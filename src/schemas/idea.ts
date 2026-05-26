import { z } from 'zod';

/**
 * 💡 灵感创建 Schema
 * 
 * 推导逻辑：
 * 1. title: 必须有，且不能太短 (比如至少 2 个字)
 * 2. status: 只能是指定的几个字面量，未提交时默认为 draft
 * 3. 服务端生成字段和归属字段不允许由客户端提交
 */

export const IdeaStatusSchema = z.enum(['draft', 'published', 'archived'])

export const CreateIdeaSchema = z
  .object({
    title: z.string().min(2, '标题至少需要 2 个字符').max(100),
    status: IdeaStatusSchema.default('draft'),
  })
  .strict();

export const UpdateIdeaSchema = z
  .object({
    title: z.string().min(2).max(100).optional(),
    status: IdeaStatusSchema.optional(),
  })
  .strict();


// 自动提取类型
export type CreateIdeaInput = z.infer<typeof CreateIdeaSchema>;
export type UpdateIdeaInput = z.infer<typeof UpdateIdeaSchema>;
