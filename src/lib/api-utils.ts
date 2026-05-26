import { ApiResponse } from '../types/resources';

/**
 * 练习任务：实现 handleApiResponse 函数
 * 
 * 目标：验证 TypeScript 的“类型收窄 (Type Narrowing)”能力。
 * 
 * 需求：
 * 1. 当 type 为 'success' 时，返回 "Data: " + 数据内容 (JSON.stringify)
 * 2. 当 type 为 'error' 时，返回 "Error [code]: message"
 * 3. 当 type 为 'loading' 时，返回 "Loading..."
 * 
 * 验收标准：
 * - 观察在不同分支下，IDE 提供的自动补全是否准确。
 */
/**
 * 穷尽性检查辅助函数
 * 当代码逻辑执行到这个函数时，意味着之前的分支已经覆盖了所有可能的类型。
 * 如果未来增加了新类型但忘记处理，TS 编译器会在调用此处时报错。
 */
export function assertNever(value: never): never {
  throw new Error(`Unhandled case: ${JSON.stringify(value)}`);
}

/**
 * 演示：使用判别联合与穷尽性检查
 */
export function handleApiResponse<T>(response: ApiResponse<T>): string {
  switch (response.type) {
    case 'error':
      return `Error [${response.code}]: ${response.message}`;
    case 'success':
      return `Data: ${JSON.stringify(response.data)}`;
    case 'loading':
      return "Loading...";
    case 'maintenance':
      return `${response.message}`
    default:
      // 如果 ApiResponse 增加了新 type 但这里没处理，
      // assertNever 会产生编译时错误。
      return assertNever(response);
  }
}
