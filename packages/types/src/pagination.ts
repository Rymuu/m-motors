export type PaginatedResponse<T> = {
  data: T[]
  currentPage: number
  totalPages: number
  totalItems: number
  limit: number
}