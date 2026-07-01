import type { PaginationMeta } from './pagination'

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}
