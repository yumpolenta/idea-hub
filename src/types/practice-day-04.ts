import { Idea } from './resources';

/**
 * 📝 练习 1: 公开展示类型 (Public View)
 * 
 * 目标：从 Idea 类型中排除 'authorId' 和 'status'。
 * 理由：在公开列表页，我们不想暴露作者的内部 ID，也不想展示状态字段。
 */
export type PublicIdea = Omit<Idea,'authorId'|'status'>  ; // TODO: 使用 Omit 修改这里

/**
 * 📝 练习 2: 标签更新专用类型 (Tags Only)
 * 
 * 目标：创建一个只包含 'id' 和 'tags' 的类型。
 * 理由：当用户只修改标签时，我们希望接口只接收这两个字段。
 */
export type IdeaTagsUpdate = Pick<Idea,'id'|'tags'>; // TODO: 使用 Pick 修改这里


// --- 🧪 自动化验证区 (不要修改以下代码) ---
// 如果你实现正确，下面的代码应该会根据注释提示报错或正常工作

const testPublic: PublicIdea = {
  id: '1',
  title: 'Hello',
  content: 'World',
  tags: ['ts'],
  createdAt: '2023-01-01',
  // @ts-expect-error: authorId 应该被排除了，这里应该报错
  authorId: 'user-123' 
};

const testTags: IdeaTagsUpdate = {
  id: '1',
  tags: ['new-tag'],
  // @ts-expect-error: title 不应该存在于 IdeaTagsUpdate 中，这里应该报错
  title: 'This should fail'
};
