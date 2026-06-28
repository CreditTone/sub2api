<template>
  <div v-if="homeContent" class="min-h-screen">
    <iframe
      v-if="isHomeContentUrl"
      :src="homeContent.trim()"
      class="h-screen w-full border-0"
      allowfullscreen
    ></iframe>
    <div v-else v-html="homeContent"></div>
  </div>

  <div
    v-else
    class="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.16),_transparent_32%),radial-gradient(circle_at_80%_20%,_rgba(14,165,233,0.14),_transparent_26%),linear-gradient(180deg,_#f5f7f4_0%,_#eef3ef_45%,_#f7faf8_100%)] text-slate-900 dark:bg-[radial-gradient(circle_at_top_left,_rgba(13,148,136,0.18),_transparent_28%),radial-gradient(circle_at_80%_20%,_rgba(56,189,248,0.14),_transparent_24%),linear-gradient(180deg,_#071114_0%,_#08181d_45%,_#09151a_100%)] dark:text-white"
  >
    <div class="pointer-events-none absolute inset-0">
      <div class="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:72px_72px] dark:bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)]"></div>
      <div class="absolute -left-24 top-20 h-72 w-72 rounded-full bg-emerald-300/35 blur-3xl dark:bg-emerald-500/20"></div>
      <div class="absolute right-0 top-0 h-96 w-96 rounded-full bg-sky-300/30 blur-3xl dark:bg-sky-500/15"></div>
      <div class="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-cyan-200/30 blur-3xl dark:bg-cyan-400/10"></div>
    </div>

    <header class="relative z-20 px-6 pb-4 pt-5">
      <nav class="mx-auto flex max-w-7xl items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-white/60 bg-white/80 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-white/5 dark:shadow-[0_18px_48px_rgba(0,0,0,0.35)]">
            <img :src="siteLogo || '/logo.png'" alt="Logo" class="h-8 w-8 object-contain" />
          </div>
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700/80 dark:text-emerald-300/80">
              Private Access Layer
            </p>
            <h1 class="text-base font-semibold text-slate-900 dark:text-white">{{ siteName }}</h1>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <LocaleSwitcher />
          <a
            v-if="docUrl"
            :href="docUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200/70 bg-white/80 text-slate-500 transition hover:border-slate-300 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-white/20 dark:hover:text-white"
            :title="t('home.viewDocs')"
          >
            <Icon name="book" size="md" />
          </a>
          <button
            @click="toggleTheme"
            class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200/70 bg-white/80 text-slate-500 transition hover:border-slate-300 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-white/20 dark:hover:text-white"
            :title="isDark ? t('home.switchToLight') : t('home.switchToDark')"
          >
            <Icon v-if="isDark" name="sun" size="md" />
            <Icon v-else name="moon" size="md" />
          </button>
          <router-link
            v-if="isAuthenticated"
            :to="dashboardPath"
            class="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(15,23,42,0.18)] transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
          >
            <span class="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-[11px] font-bold text-white">
              {{ userInitial }}
            </span>
            {{ t('home.dashboard') }}
          </router-link>
          <router-link
            v-else
            to="/login"
            class="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(15,23,42,0.18)] transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
          >
            {{ t('home.login') }}
          </router-link>
        </div>
      </nav>
    </header>

    <main class="relative z-10 px-6 pb-12 pt-4">
      <section class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div class="max-w-3xl">
          <div class="inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-white/75 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800 shadow-sm backdrop-blur dark:border-emerald-400/20 dark:bg-white/5 dark:text-emerald-300">
            <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
            Managed AI Workspace
          </div>
          <h2 class="mt-6 max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-slate-950 dark:text-white md:text-6xl">
            One clean front door for your private AI capacity.
          </h2>
          <p class="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            {{ siteSubtitle }}
          </p>
          <p class="mt-4 max-w-2xl text-sm leading-7 text-slate-500 dark:text-slate-400">
            Keep access controlled, usage visible, and delivery stable across teams, clients, and internal tooling without exposing the plumbing.
          </p>

          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <router-link
              :to="isAuthenticated ? dashboardPath : '/login'"
              class="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(5,150,105,0.28)] transition hover:bg-emerald-500"
            >
              {{ isAuthenticated ? t('home.goToDashboard') : t('home.getStarted') }}
              <Icon name="arrowRight" size="md" :stroke-width="2" />
            </router-link>
            <a
              v-if="docUrl"
              :href="docUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-white/20 dark:hover:text-white"
            >
              {{ t('home.docs') }}
            </a>
          </div>

          <div class="mt-10 grid gap-4 sm:grid-cols-3">
            <div
              v-for="item in heroMetrics"
              :key="item.label"
              class="rounded-3xl border border-white/70 bg-white/70 p-4 shadow-[0_24px_48px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-white/5 dark:shadow-[0_18px_42px_rgba(0,0,0,0.24)]"
            >
              <p class="text-2xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-white">{{ item.value }}</p>
              <p class="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{{ item.label }}</p>
            </div>
          </div>
        </div>

        <div class="relative">
          <div class="absolute -left-4 top-6 h-24 w-24 rounded-full bg-emerald-300/35 blur-3xl dark:bg-emerald-500/20"></div>
          <div class="absolute right-4 top-24 h-28 w-28 rounded-full bg-sky-300/35 blur-3xl dark:bg-sky-500/20"></div>

          <div class="relative overflow-hidden rounded-[32px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(243,247,246,0.82))] p-5 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.85),rgba(6,16,23,0.92))] dark:shadow-[0_30px_90px_rgba(0,0,0,0.42)]">
            <div class="flex items-center justify-between border-b border-slate-200/80 pb-4 dark:border-white/10">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Operations Canvas</p>
                <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">Access, usage, and routing at a glance</p>
              </div>
              <div class="rounded-full bg-emerald-500/12 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                Live
              </div>
            </div>

            <div class="mt-5 space-y-4">
              <div class="grid gap-4 sm:grid-cols-2">
                <div class="rounded-3xl bg-slate-950 p-4 text-white dark:bg-white/[0.06]">
                  <p class="text-xs uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Request Flow</p>
                  <div class="mt-4 flex items-center gap-3">
                    <div class="h-11 w-11 rounded-2xl bg-emerald-500/20"></div>
                    <div class="flex-1">
                      <div class="h-2 rounded-full bg-white/20"></div>
                      <div class="mt-2 h-2 w-2/3 rounded-full bg-white/10"></div>
                    </div>
                  </div>
                  <div class="mt-4 flex items-center gap-2 text-[11px] text-slate-300">
                    <span class="rounded-full bg-white/10 px-2 py-1">sticky routing</span>
                    <span class="rounded-full bg-white/10 px-2 py-1">quota aware</span>
                  </div>
                </div>

                <div class="rounded-3xl border border-slate-200/80 bg-white/90 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                  <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Client View</p>
                  <div class="mt-4 space-y-3">
                    <div
                      v-for="item in signalRows"
                      :key="item.label"
                      class="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 dark:bg-slate-900/60"
                    >
                      <span class="text-sm text-slate-600 dark:text-slate-300">{{ item.label }}</span>
                      <span class="text-sm font-semibold text-slate-900 dark:text-white">{{ item.value }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="rounded-3xl border border-slate-200/80 bg-white/90 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-xs uppercase tracking-[0.16em] text-slate-400">Timeline</p>
                    <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">Capacity keeps moving without exposing origin accounts</p>
                  </div>
                  <span class="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500 dark:bg-white/10 dark:text-slate-300">steady</span>
                </div>
                <div class="mt-5 flex items-end gap-2">
                  <div
                    v-for="(bar, index) in trendBars"
                    :key="index"
                    class="flex-1 rounded-t-2xl bg-gradient-to-t from-emerald-500 via-teal-400 to-sky-300 opacity-90"
                    :style="{ height: `${bar}px` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="mx-auto mt-10 max-w-7xl">
        <div class="grid gap-4 lg:grid-cols-3">
          <div
            v-for="pill in featurePills"
            :key="pill.title"
            class="rounded-3xl border border-white/75 bg-white/75 p-5 shadow-[0_24px_48px_rgba(15,23,42,0.07)] backdrop-blur dark:border-white/10 dark:bg-white/5"
          >
            <div class="flex items-start gap-3">
              <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white/10">
                <Icon :name="pill.icon" size="md" />
              </div>
              <div>
                <h3 class="text-base font-semibold text-slate-950 dark:text-white">{{ pill.title }}</h3>
                <p class="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{{ pill.body }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="mx-auto mt-12 grid max-w-7xl gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div class="rounded-[32px] border border-white/75 bg-white/75 p-6 shadow-[0_24px_50px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-white/5">
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Trusted flow</p>
          <h3 class="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-white">
            What clients see is simple. What you operate stays behind the curtain.
          </h3>
          <div class="mt-6 space-y-4">
            <div
              v-for="step in timelineSteps"
              :key="step.title"
              class="flex gap-4 rounded-3xl border border-slate-200/70 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-slate-950/40"
            >
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-sm font-semibold text-white">
                {{ step.id }}
              </div>
              <div>
                <h4 class="text-sm font-semibold text-slate-900 dark:text-white">{{ step.title }}</h4>
                <p class="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{{ step.body }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-[32px] border border-slate-200/80 bg-slate-950 p-6 text-white shadow-[0_24px_56px_rgba(15,23,42,0.22)] dark:border-white/10 dark:bg-slate-950">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Designed for operators</p>
              <h3 class="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">
                Usage visibility without leaking implementation detail
              </h3>
            </div>
            <div class="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">controlled</div>
          </div>

          <div class="mt-6 grid gap-4 md:grid-cols-2">
            <div
              v-for="card in darkCards"
              :key="card.title"
              class="rounded-3xl border border-white/10 bg-white/[0.04] p-4"
            >
              <p class="text-xs uppercase tracking-[0.16em] text-slate-500">{{ card.kicker }}</p>
              <h4 class="mt-2 text-lg font-semibold text-white">{{ card.title }}</h4>
              <p class="mt-2 text-sm leading-6 text-slate-300">{{ card.body }}</p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="relative z-10 px-6 pb-8 pt-4">
      <div class="mx-auto flex max-w-7xl flex-col gap-3 border-t border-slate-200/70 pt-6 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400 md:flex-row md:items-center md:justify-between">
        <p>&copy; {{ currentYear }} {{ siteName }}. {{ t('home.footer.allRightsReserved') }}</p>
        <div class="flex items-center gap-4">
          <a
            v-if="docUrl"
            :href="docUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="transition hover:text-slate-900 dark:hover:text-white"
          >
            {{ t('home.docs') }}
          </a>
          <span>{{ footerTagline }}</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore, useAppStore } from '@/stores'
import LocaleSwitcher from '@/components/common/LocaleSwitcher.vue'
import Icon from '@/components/icons/Icon.vue'

const { locale, t } = useI18n()

const authStore = useAuthStore()
const appStore = useAppStore()

const siteName = computed(() => appStore.cachedPublicSettings?.site_name || appStore.siteName || 'AI Console')
const siteLogo = computed(() => appStore.cachedPublicSettings?.site_logo || appStore.siteLogo || '')
const siteSubtitle = computed(() => appStore.cachedPublicSettings?.site_subtitle || defaultSubtitle.value)
const docUrl = computed(() => appStore.cachedPublicSettings?.doc_url || appStore.docUrl || '')
const homeContent = computed(() => appStore.cachedPublicSettings?.home_content || '')

const isHomeContentUrl = computed(() => {
  const content = homeContent.value.trim()
  return content.startsWith('http://') || content.startsWith('https://')
})

const isDark = ref(document.documentElement.classList.contains('dark'))

const isZh = computed(() => locale.value.startsWith('zh'))
type HomeFeaturePill = {
  icon: 'shield' | 'chart' | 'server'
  title: string
  body: string
}
const defaultSubtitle = computed(() => isZh.value
  ? '面向内部团队与客户交付的 AI 访问中台'
  : 'A private AI access layer for internal teams and client delivery')
const footerTagline = computed(() => isZh.value ? 'Private routing. Clean client experience.' : 'Private routing. Clean client experience.')

const heroMetrics = computed(() => isZh.value
  ? [
      { value: '24/7', label: '稳定交付' },
      { value: 'Per Key', label: '独立额度' },
      { value: 'Realtime', label: '透明用量' }
    ]
  : [
      { value: '24/7', label: 'stable delivery' },
      { value: 'Per Key', label: 'independent quotas' },
      { value: 'Realtime', label: 'visible usage' }
    ])

const signalRows = computed(() => isZh.value
  ? [
      { label: '独立 API Key 额度', value: '5h / 1d / 7d' },
      { label: '匿名公共看板', value: 'enabled' },
      { label: '分组化访问控制', value: 'active' }
    ]
  : [
      { label: 'Independent API key windows', value: '5h / 1d / 7d' },
      { label: 'Anonymous public dashboard', value: 'enabled' },
      { label: 'Segmented access control', value: 'active' }
    ])

const featurePills = computed<HomeFeaturePill[]>(() => isZh.value
  ? [
      {
        icon: 'shield',
        title: '隐去底层实现',
        body: '客户只看到统一入口、稳定响应和自己的额度看板，不直接接触账号池与调度策略。'
      },
      {
        icon: 'chart',
        title: '按 Key 精细运营',
        body: '每个密钥的用量、模型分布、恢复时间和额度余量都可以单独呈现。'
      },
      {
        icon: 'server',
        title: '适合公司内部交付',
        body: '既能做团队内部统一入口，也能给外部客户提供干净的接入体验。'
      }
    ]
  : [
      {
        icon: 'shield',
        title: 'Hide the plumbing',
        body: 'Clients only see a unified surface, stable responses, and their own usage dashboard.'
      },
      {
        icon: 'chart',
        title: 'Operate per key',
        body: 'Show usage, model mix, reset times, and quota remaining at the API key level.'
      },
      {
        icon: 'server',
        title: 'Built for internal delivery',
        body: 'Works as both an internal access layer and a clean customer-facing entrypoint.'
      }
    ])

const timelineSteps = computed(() => isZh.value
  ? [
      {
        id: '01',
        title: '统一入口接入',
        body: '团队或客户只使用一个入口域名和一套鉴权方式，不需要理解后端账号来源。'
      },
      {
        id: '02',
        title: '策略层控制',
        body: '在分组、密钥、额度与路由层做精细控制，把运营规则放在你自己手里。'
      },
      {
        id: '03',
        title: '可视化交付',
        body: '通过私有或公共看板，把该给客户看的用量信息单独展示出去。'
      }
    ]
  : [
      {
        id: '01',
        title: 'One entrypoint',
        body: 'Teams and clients use one domain and one auth pattern without needing to know account origins.'
      },
      {
        id: '02',
        title: 'Policy in your layer',
        body: 'Control quotas, groups, routing, and exposure at the layer you own.'
      },
      {
        id: '03',
        title: 'Visible delivery',
        body: 'Expose the right usage information through private or public dashboards only where needed.'
      }
    ])

const darkCards = computed(() => isZh.value
  ? [
      {
        kicker: 'client dashboard',
        title: '把“看得见”留给客户',
        body: '客户能看到自己的请求、Token、模型分布与恢复倒计时，但不会看到你的后台结构。'
      },
      {
        kicker: 'operator control',
        title: '把“可控性”留给运营',
        body: '管理员仍可在后台按分组、密钥、账号池和渠道策略做细粒度管理。'
      },
      {
        kicker: 'presentation',
        title: '首页就是产品门面',
        body: '默认首页不再暴露开源项目痕迹，而是更像你自己的产品或服务入口。'
      },
      {
        kicker: 'delivery',
        title: '适合私有化部署',
        body: '对内可做统一访问层，对外可做客户交付页，保持品牌和体验的一致性。'
      }
    ]
  : [
      {
        kicker: 'client dashboard',
        title: 'Clients see their own data',
        body: 'Requests, tokens, model mix, and reset timers can be shown without exposing backend structure.'
      },
      {
        kicker: 'operator control',
        title: 'Operators keep the levers',
        body: 'Admins still manage keys, groups, account pools, and channel policy behind the scenes.'
      },
      {
        kicker: 'presentation',
        title: 'The homepage looks like a product',
        body: 'The default landing page no longer looks like an upstream admin panel or open-source scaffold.'
      },
      {
        kicker: 'delivery',
        title: 'Fits private deployment',
        body: 'Use it as an internal access layer or a customer-facing delivery surface with consistent branding.'
      }
    ])

const trendBars = [52, 76, 64, 92, 68, 110, 88, 124, 102, 136, 118, 148]

const authStoreReady = computed(() => authStore.isAuthenticated)
const isAuthenticated = computed(() => authStoreReady.value)
const isAdmin = computed(() => authStore.isAdmin)
const dashboardPath = computed(() => isAdmin.value ? '/admin/dashboard' : '/dashboard')
const userInitial = computed(() => {
  const user = authStore.user
  if (!user || !user.email) return ''
  return user.email.charAt(0).toUpperCase()
})
const currentYear = computed(() => new Date().getFullYear())

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

function initTheme() {
  const savedTheme = localStorage.getItem('theme')
  if (
    savedTheme === 'dark' ||
    (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
}

onMounted(() => {
  initTheme()
  authStore.checkAuth()
  if (!appStore.publicSettingsLoaded) {
    appStore.fetchPublicSettings()
  }
})
</script>
