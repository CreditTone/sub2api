<template>
  <div class="min-h-screen bg-gray-50 dark:bg-dark-950">
    <div class="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
      <div class="mb-6">
        <p class="text-sm font-medium text-primary-600 dark:text-primary-400">
          API Key 尾号 {{ suffix }}
        </p>
        <h1 class="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
          用量看板
        </h1>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          匿名查看该密钥自身的请求、Token 和模型分布。
        </p>
      </div>

      <div v-if="loading && !stats" class="flex items-center justify-center py-16">
        <LoadingSpinner />
      </div>

      <div v-else-if="error" class="card p-6">
        <h2 class="text-lg font-semibold text-red-600 dark:text-red-400">无法加载看板</h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">{{ error }}</p>
      </div>

      <template v-else-if="stats">
        <div class="space-y-6">
          <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div class="card p-4">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400">今日请求</p>
              <p class="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.today_requests || 0 }}</p>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">总请求 {{ stats.total_requests || 0 }}</p>
            </div>
            <div class="card p-4">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400">今日 Token</p>
              <p class="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{{ formatTokens(stats.today_tokens || 0) }}</p>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                In {{ formatTokens(stats.today_input_tokens || 0) }} / Out {{ formatTokens(stats.today_output_tokens || 0) }}
              </p>
            </div>
            <div class="card p-4">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400">总 Token</p>
              <p class="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{{ formatTokens(stats.total_tokens || 0) }}</p>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                In {{ formatTokens(stats.total_input_tokens || 0) }} / Out {{ formatTokens(stats.total_output_tokens || 0) }}
              </p>
            </div>
            <div class="card p-4">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400">总费用</p>
              <p class="mt-2 text-2xl font-semibold text-green-600 dark:text-green-400">${{ (stats.total_actual_cost || 0).toFixed(4) }}</p>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">今日 ${{ (stats.today_actual_cost || 0).toFixed(4) }}</p>
            </div>
          </div>
          <div v-if="rateLimits.length" class="grid gap-4 md:grid-cols-3">
            <div
              v-for="item in rateLimits"
              :key="item.window"
              class="card p-4"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="text-xs font-medium text-gray-500 dark:text-gray-400">{{ rateLimitLabel(item.window) }}</p>
                  <p class="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">${{ item.remaining.toFixed(2) }}</p>
                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    已用 ${{ item.used.toFixed(2) }} / 限额 ${{ item.limit.toFixed(2) }}
                  </p>
                </div>
                <span
                  :class="[
                    'rounded-full px-2 py-1 text-xs font-medium',
                    item.remaining <= 0
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                      : item.remaining <= item.limit * 0.2
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                  ]"
                >
                  {{ usagePercent(item) }}
                </span>
              </div>
              <div class="mt-4 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-dark-700">
                <div
                  class="h-full rounded-full transition-all"
                  :class="progressClass(item)"
                  :style="{ width: `${usagePercentNumber(item)}%` }"
                />
              </div>
              <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">
                恢复倒计时：
                <span class="font-medium text-gray-700 dark:text-gray-300">
                  {{ formatResetTime(item.reset_at) || '--' }}
                </span>
              </p>
            </div>
          </div>
          <UserDashboardCharts
            v-model:startDate="startDate"
            v-model:endDate="endDate"
            v-model:granularity="granularity"
            :loading="loadingCharts"
            :trend="trendData"
            :models="modelStats"
            :show-standard-cost="false"
            @dateRangeChange="loadCharts"
            @granularityChange="loadCharts"
            @refresh="refreshAll"
          />
          <div class="card">
            <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-dark-700">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">最近请求</h2>
              <button @click="loadRecent" :disabled="loadingRecent" class="btn btn-secondary">
                刷新
              </button>
            </div>
            <div class="p-6">
              <div v-if="loadingRecent" class="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
              <div v-else-if="recentUsage.length === 0" class="py-8 text-sm text-gray-500 dark:text-gray-400">
                暂无使用记录
              </div>
              <div v-else class="space-y-3">
                <div
                  v-for="log in recentUsage"
                  :key="log.id"
                  class="flex items-center justify-between rounded-xl bg-gray-50 p-4 dark:bg-dark-800/50"
                >
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ log.model }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatDateTime(log.created_at) }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-semibold text-green-600 dark:text-green-400">
                      ${{ log.actual_cost.toFixed(4) }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{ (log.input_tokens + log.output_tokens).toLocaleString() }} tokens
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import UserDashboardCharts from '@/components/user/dashboard/UserDashboardCharts.vue'
import { publicDashboardAPI } from '@/api/publicDashboard'
import type { PublicDashboardRateLimit } from '@/api/publicDashboard'
import type { UserDashboardStats as UserStatsType } from '@/api/usage'
import type { ModelStat, TrendDataPoint, UsageLog } from '@/types'
import { formatDateTime } from '@/utils/format'

const route = useRoute()
const suffix = computed(() => String(route.params.suffix || ''))

const stats = ref<UserStatsType | null>(null)
const rateLimits = ref<PublicDashboardRateLimit[]>([])
const trendData = ref<TrendDataPoint[]>([])
const modelStats = ref<ModelStat[]>([])
const recentUsage = ref<UsageLog[]>([])
const loading = ref(false)
const loadingCharts = ref(false)
const loadingRecent = ref(false)
const error = ref('')
const now = ref(new Date())
let resetTimer: ReturnType<typeof setInterval> | null = null

const formatLD = (d: Date) => d.toISOString().split('T')[0]
const formatTokens = (value: number) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return String(value)
}
const rateLimitLabel = (window: PublicDashboardRateLimit['window']) => {
  switch (window) {
    case '5h':
      return '5 小时额度'
    case '1d':
      return '每日额度'
    case '7d':
      return '每周额度'
    default:
      return window
  }
}
const usagePercentNumber = (item: PublicDashboardRateLimit) => {
  if (item.limit <= 0) return 0
  return Math.max(0, Math.min(100, (item.used / item.limit) * 100))
}
const usagePercent = (item: PublicDashboardRateLimit) => `${usagePercentNumber(item).toFixed(0)}%`
const progressClass = (item: PublicDashboardRateLimit) => {
  if (item.remaining <= 0) return 'bg-rose-500'
  if (item.remaining <= item.limit * 0.2) return 'bg-amber-500'
  return 'bg-emerald-500'
}
const formatResetTime = (resetAt?: string | null) => {
  if (!resetAt) return ''
  const diff = new Date(resetAt).getTime() - now.value.getTime()
  if (diff <= 0) return '已恢复'
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const mins = Math.floor((diff % 3600000) / 60000)
  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${mins}m`
  return `${Math.max(1, mins)}m`
}
const startDate = ref(formatLD(new Date(Date.now() - 6 * 86400000)))
const endDate = ref(formatLD(new Date()))
const granularity = ref('day')

const loadStats = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await publicDashboardAPI.getPublicDashboardStats(suffix.value)
    stats.value = res.stats
    rateLimits.value = res.rate_limits || []
  } catch (err: any) {
    error.value = err?.message || '请求失败'
  } finally {
    loading.value = false
  }
}

const loadCharts = async () => {
  loadingCharts.value = true
  error.value = ''
  try {
    const [trendRes, modelRes] = await Promise.all([
      publicDashboardAPI.getPublicDashboardTrend(suffix.value, {
        start_date: startDate.value,
        end_date: endDate.value,
        granularity: granularity.value as 'day' | 'hour'
      }),
      publicDashboardAPI.getPublicDashboardModels(suffix.value, {
        start_date: startDate.value,
        end_date: endDate.value
      })
    ])
    trendData.value = trendRes.trend || []
    modelStats.value = modelRes.models || []
  } catch (err: any) {
    error.value = err?.message || '图表加载失败'
  } finally {
    loadingCharts.value = false
  }
}

const loadRecent = async () => {
  loadingRecent.value = true
  error.value = ''
  try {
    const res = await publicDashboardAPI.getPublicDashboardRecent(suffix.value, 5)
    recentUsage.value = res.items || []
  } catch (err: any) {
    error.value = err?.message || '最近记录加载失败'
  } finally {
    loadingRecent.value = false
  }
}

const refreshAll = async () => {
  await Promise.all([loadStats(), loadCharts(), loadRecent()])
}

watch(
  () => suffix.value,
  () => {
    refreshAll()
  }
)

onMounted(() => {
  refreshAll()
  resetTimer = setInterval(() => {
    now.value = new Date()
  }, 60000)
})

watch(
  () => suffix.value,
  () => {
    rateLimits.value = []
  }
)

onUnmounted(() => {
  if (resetTimer) clearInterval(resetTimer)
})
</script>
