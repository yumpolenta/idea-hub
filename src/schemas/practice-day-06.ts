import { ZodIssue } from 'zod';
import { CreateIdeaSchema } from './idea';

/**
 * 📝 第 6 天练习：模拟 API 入门校验
 * 
 * 目标：使用 safeParse 捕获并分析错误。
 */

function validateInput(input: any) {
  const result = CreateIdeaSchema.safeParse(input);

  if (result.success) {
    console.log("✅ 校验通过:", result.data);
  } else {
    // 打印出详细的错误路径和信息
    console.log("❌ 校验失败:");
    result.error.issues.forEach((issue: ZodIssue) => {
      console.log(`  - [${issue.path.join('.')}] ${issue.message}`);
    });
  }
}

// --- 🧪 测试场景 ---

console.log("场景 1: 标题太短");
validateInput({ title: "A" });

console.log("\n场景 2: 状态非法");
validateInput({ title: "Valid Title", status: "hack-the-system" });

console.log("\n场景 3: 标签类型错误");
validateInput({ title: "Valid Title", tags: "not-an-array" });

console.log("\n场景 4: 完美输入 (带默认值)");
validateInput({ title: "My Great Idea" });

console.log("\n场景 5: 输入数字");
validateInput({ tags: [12, "str"] });