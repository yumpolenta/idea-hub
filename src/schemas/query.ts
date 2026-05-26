import { z } from 'zod';

/**
 * 🔍 通用列表查询 Schema
 * 
 * 使用 z.coerce.number() 是为了处理 URL Query String 都是字符串的问题，
 * 它会自动尝试将 "1" 转换为 1。
 */
export const ListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'title', 'status']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export type ListQuery = z.infer<typeof ListQuerySchema>;

/**
 * 📦 分页响应元数据
 */
export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
}

/**
 * 统一的分页响应包装器
 */
export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}
