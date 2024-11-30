---
title: "Langflow 1.1 发布"
meta_title: "Langflow 1.1 发布"
description: "Langflow 1.1 版本发布，带来了全新的用户界面和多代理编排功能，提升了 genAI 开发的灵活性和互动性。新版本支持复杂的代理调用和工具模式，使代理能够相互交互并执行动态工作流程。此外，更新后的游乐场提供更智能的交互体验，用户可以实时可视化系统行为，并通过预构建模板快速启动项目。"
date: 2024-11-30T14:25:17Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*IEebLvovSdGRmq2e"
categories: ["Programming", "Generative AI", "Chatbots"]
author: "Rifx.Online"
tags: ["user-interface", "multi-agent", "orchestration", "playground", "templates"]
draft: False

---



### 对代理管道的愉快邀请！ 🚀



我们很高兴地分享 Langflow 1\.1！此版本包含使 genAI 开发更加灵活、互动和愉快的更新。无论您是在构建语言模型管道、开发 RAG 系统，还是深入多代理编排，Langflow 1\.1 都提供了强大的增强功能，让您的项目更上一层楼。让我们深入了解新内容吧！

## 全新视角：重新设计的用户界面

Langflow 1\.1 引入了全新的视觉体验。全新的用户界面具有更新的徽标、更新的颜色和流畅的品牌形象，使 Langflow 现在看起来既现代又直观。从侧边栏到画布，一切都经过重新构思，使导航和构建工作流程变得更加顺畅和高效。了解我们重新品牌和重新设计的所有信息，请访问：[Langflow 重新构思：为更高生产力而精简](https://www.datastax.com/blog/langflow-brand-and-ui-reimagined-with-1-1-release)。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*s78xr_4ABa_wbfVvdca12g.png)

## 多代理魔法：高级编排

Langflow 1.1 中的一项突出新增功能是新的代理组件，旨在支持复杂的编排，具备内置模型选择、聊天记忆以及可追溯的推理和工具调用动作的中间步骤。 

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*WugoI-V04P5INLm7)

### 一切都是工具

欢迎来到工具模式，在这里，任何组件都可以被重新用作代理的工具集。无论是内置计算器还是自定义组件，您可以通过在字段级别设置 tool_mode=True 来决定代理可以自动填写哪些字段。这种细粒度的控制意味着您可以为代理分配特定的操作，同时在需要时保留手动输入。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*3Z4dahqpCRy8sRX_)

### 代理调用代理，进而调用更多代理！

通过工具模式，代理现在可以作为工具调用其他代理，创建一个多代理系统，使它们能够相互互动并相互构建。这种递归编排使得多层次、动态的问题解决成为可能，代理可以通过顺序或嵌套的方式相互调用来组合复杂的工作流程。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*xYOJddi9k3X1aW1b)

## 更智能的游乐场

在 genAI 开发中，互动是关键！语言模型复杂，实现精确控制通常需要反复调整。Langflow 的游乐场正是为此而建——创建、互动、调整和优化以达到期望的结果。

更新后的游乐场感觉更加生动和响应迅速，提供了新的方式来实时可视化系统的行为：

* **可折叠元素**：通过可折叠元素查看中间步骤和代理操作，提供代理推理和工具使用的逐步视图。
* **对话会话**：实例化多个会话，并在每个会话中保持对话上下文。
* **可编辑消息**：编辑过去的消息，(注意！) 代理将“记住”人工 **修改** 的输入，非常适合快速调整行为！ 

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*qQhGns4SrJAMHOBn)

## 模板丰富

对 Langflow 感到陌生或寻找灵感？我们为您提供支持。

Langflow 1\.1 带来了一个按用例和方法分类的预构建模板库。通过选择助手、问答、编码或内容生成的模板，快速启动您的项目。通过在 Prompting、RAG 或基本 Agent 设置中的示例进行实践，深入了解。敬请期待——我们将在未来几个月推出更多模板！

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*IYdJNB-kJ2znxcey)

准备好与代理一起构建了吗？请查看 [Langflow](https://www.langflow.org) 网站或加入我们的 [GitHub](https://github.com/langflow-ai/langflow) 社区，现在就开始吧！我们会与您一起走过这段旅程。✨

