import { CreateIdeaSchema } from '../schemas/idea';
import { ApiResponse, CreateIdeaDto } from '../types/resources';
import { assertNever } from '../lib/api-utils';

/**
 * 🎓 周复盘挑战：实现一个完整的类型安全处理器
 * 
 * 逻辑流：
 * 1. 接收 rawInput (unknown)
 * 2. Zod 安检 (safeParse)
 * 3. 成功 -> 返回 ApiResponse<CreateIdeaDto>
 * 4. 失败 -> 返回 ApiResponse 错误体
 */
export function processIdeaRequest(rawInput: unknown): ApiResponse<CreateIdeaDto> {
  // 1. 开始安检 (使用 CreateIdeaSchema.safeParse)
  const result = CreateIdeaSchema.safeParse(rawInput);

  // 2. 处理结果
  if (result.success) {
    // TODO: 返回一个 type 为 'success' 的对象
    return {
      type: 'success',
      data: result.data as CreateIdeaDto // 此处 Zod 已经保证了数据的安全性
    };
  } else {
    // TODO: 返回一个 type 为 'error' 的对象，message 包含第一条错误信息
    return {
      type: 'error',
      message: result.error.issues[0].message,
      code: 400
    };
  }
}

// --- 🧪 验证区 ---

const test1 = processIdeaRequest({ title: "My New Idea" });
console.log("测试 1 (成功):", test1.type === 'success' ? "✅" : "❌");

const test2 = processIdeaRequest({ title: "A" }); // 标题太短
console.log("测试 2 (拦截):", test2.type === 'error' ? "✅" : "❌");
