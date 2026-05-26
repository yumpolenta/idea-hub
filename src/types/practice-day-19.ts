import { components } from "./api";


/**
 * 练习目标：
 * 1. 从生成的 components["schemas"] 中提取 Idea 类型。
 * 2. 创建一个名为 `myFirstIdea` 的变量。
 * 3. 故意漏掉 id 或 status 字段，看看 TypeScript 如何报错。
 */

type Idea = components["schemas"]["Idea"];

const myFirstIdea: Idea = {
    id: crypto.randomUUID(),
    title: "My First Idea",
    content: "My First Idea",
    status: "draft",
    createdAt: new Date().toISOString(),
    tags: ["tech"]
};