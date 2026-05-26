/**
 * User 资源类型定义
 */
export interface User {
  readonly id: string;
  username: string;
  email: string;
  avatarUrl?: string; // 可选属性，因为不是每个用户都有头像
  createdAt: string; // 后续我们会学习如何处理 Date 类型，目前用 ISO 字符串表示
}

/**
 * Idea 状态定义
 */
export type IdeaStatus = 'draft' | 'published' | 'archived';

/**
 * Idea 资源类型定义
 */
export interface Idea {
  readonly id: string;
  title: string;
  content: string;
  authorId: string;
  tags: string[];
  status: IdeaStatus; // 使用联合类型代替 boolean
  createdAt: string;
  updatedAt?: string;
}

/**
 * Project 资源类型定义
 */
export interface Project {
  readonly id: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: string; 
}

/**
 * Task 状态定义
 */
export type TaskStatus = 'todo' | 'in-progress' | 'done';

/**
 * Task 资源类型定义
 */
export interface Task {
  readonly id: string;
  content: string;
  status: TaskStatus; // 使用联合类型代替 boolean
  projectId: string;
  createdAt: string;
}

/**
 * 统一 API 响应：判别联合
 */
export type ApiResponse<T> =
  | { type: 'success'; data: T }
  | { type: 'error'; message: string; code: number }
  | { type: 'loading' }
  | { type: 'maintenance'; message:string };

/**
 * 分页响应包装器
 */
export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

/**
 * 通用的创建输入工具：排除自动生成的字段
 */
export type CreateInput<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * 通用的更新输入工具：ID 必传，核心字段可选，排除不可变字段
 */
export type UpdateInput<T extends { id: string }> = { id: string } & Partial<
  Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'ownerId' | 'authorId'>
>;

/**
 * 通用的列表查询参数
 */
export type ListQuery = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
};

/**
 * 资源具体的 DTO (Data Transfer Objects)
 */
export type CreateIdeaDto = CreateInput<Idea>;
export type UpdateIdeaDto = UpdateInput<Idea>;

export type CreateProjectDto = CreateInput<Project>;
export type UpdateProjectDto = UpdateInput<Project>;

export type CreateTaskDto = CreateInput<Task>;
export type UpdateTaskDto = UpdateInput<Task>;