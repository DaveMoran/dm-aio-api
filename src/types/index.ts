/**
 * Shared API-layer types.
 * Domain-specific types live in src/schemas/ as z.infer<> exports.
 */

export type ApiResponse<T> =
  | { data: T; error?: never }
  | { data?: never; error: string }

export type PaginatedResponse<T> = {
  data: T[]
  total: number
  page: number
  pageSize: number
}
