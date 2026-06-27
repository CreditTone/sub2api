import { apiClient } from './client'
import type { UsageLog } from '@/types'
import type { UserDashboardStats, TrendParams, TrendResponse, ModelStatsResponse } from './usage'

export interface PublicDashboardRateLimit {
  window: '5h' | '1d' | '7d'
  limit: number
  used: number
  remaining: number
  reset_at?: string | null
}

export interface PublicDashboardStatsResponse {
  api_key_suffix: string
  stats: UserDashboardStats
  rate_limits?: PublicDashboardRateLimit[]
}

export interface PublicDashboardTrendResponse extends TrendResponse {
  api_key_suffix: string
}

export interface PublicDashboardModelsResponse extends ModelStatsResponse {
  api_key_suffix: string
}

export interface PublicDashboardRecentResponse {
  api_key_suffix: string
  items: UsageLog[]
}

export async function getPublicDashboardStats(suffix: string): Promise<PublicDashboardStatsResponse> {
  const { data } = await apiClient.get<PublicDashboardStatsResponse>(`/public/dashboard/${suffix}/stats`)
  return data
}

export async function getPublicDashboardTrend(
  suffix: string,
  params?: TrendParams
): Promise<PublicDashboardTrendResponse> {
  const { data } = await apiClient.get<PublicDashboardTrendResponse>(`/public/dashboard/${suffix}/trend`, { params })
  return data
}

export async function getPublicDashboardModels(
  suffix: string,
  params?: {
    start_date?: string
    end_date?: string
  }
): Promise<PublicDashboardModelsResponse> {
  const { data } = await apiClient.get<PublicDashboardModelsResponse>(`/public/dashboard/${suffix}/models`, { params })
  return data
}

export async function getPublicDashboardRecent(
  suffix: string,
  pageSize: number = 5
): Promise<PublicDashboardRecentResponse> {
  const { data } = await apiClient.get<PublicDashboardRecentResponse>(`/public/dashboard/${suffix}/recent`, {
    params: { page_size: pageSize }
  })
  return data
}

export const publicDashboardAPI = {
  getPublicDashboardStats,
  getPublicDashboardTrend,
  getPublicDashboardModels,
  getPublicDashboardRecent
}

export default publicDashboardAPI
