---
title: "Bolt DIY + Deepseek V3 + Gemini 2.0：免费人工智能编码器"
meta_title: "Bolt DIY + Deepseek V3 + Gemini 2.0：免费人工智能编码器"
description: "Bolt DIY 是一个开源的 AI 编程助手，允许用户在浏览器中构建全栈应用程序，支持多种 AI 模型如 OpenAI 和 Gemini。其优势包括错误修复、代码高亮、GitHub 同步、Docker 支持等，能够显著简化开发流程。用户可以选择不同的安装方式，并通过简单的步骤设置和更新。Deepseek V3 和 Gemini 2.0 是其主要模型，提供快速和多模态的编程支持，适合学生和独立开发者使用。"
date: 2025-01-09T02:11:36Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*en7w1g9A-w9NlEuneL_TYQ.jpeg"
categories: ["Programming", "Technology/Web", "Generative AI"]
author: "Rifx.Online"
tags: ["Bolt", "Deepseek", "Gemini", "Docker", "Node.js"]
draft: False

---





嘿，你听说过 Bolt DIY 吗？

它超级酷，我敢打赌你会喜欢它。

想象一下，在你的浏览器中有一个智能 AI 助手，可以帮助你编写全栈应用程序。

最棒的是？它是免费的，灵活性超高。

让我来解释一下它是如何工作的。

## 什么是 Bolt DIY？

所以，Bolt DIY 是一个开源工具（它以前被称为 oTToDev，如果你听说过的话）。

它允许你直接在浏览器中构建全栈应用程序，但有趣的部分是——你可以选择哪个 AI 模型来帮助你完成编码任务。

以下是你可以选择的一些模型：

* OpenAI
* HuggingFace
* Gemini
* Deepseek
* Anthropic
* Mistral
* LMStudio
* xAI
* Groq

但这还不是全部！

你可以使用 Vercel AI SDK 添加更多模型。

这意味着你可以完全自定义它，以符合你的需求。

此外，还有一个名为“Bolt DIY Expert”的功能，可以回答你的问题。

这一切都是一个大型社区项目的一部分，并且正在快速增长。

## 为什么你应该关心 Bolt DIY？

以下是 Bolt DIY 的一些优点：

* **多种模型：** 选择你喜欢的 AI 模型，甚至可以在项目中途切换。
* **错误修复：** 它能够为你发现并修复错误——就像一个超级聪明的调试小伙伴。
* **可视化选择工具：** 高亮代码的部分以便轻松进行更改。
* **GitHub 同步：** 连接到你的 GitHub 项目，进行工作，并直接推送更新。
* **Docker 支持：** 如果你喜欢使用 Docker，这个工具能满足你的需求。
* **版本控制：** 轻松返回代码的旧版本。
* **便携项目：** 将项目保存为 ZIP 文件，方便你随身携带。
* **自定义提示：** 使用内置库中的现成提示，针对不同编码任务节省时间并激发创造力。

这只是冰山一角，但你明白了——它就像开发者的瑞士军刀。

为了更好地理解 Bolt DIY 如何简化你的开发工作流程，让我们看看这些功能是如何协同工作的：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*lgpzK0gYG89KKJbt6EOKUw.png)

这个工作流程演示了 Bolt DIY 如何集成 AI 模型、错误处理和导出选项，以创建无缝的开发体验。

你可以从任何 AI 模型开始，生成代码，并让 Bolt DIY 自动处理错误，同时保持多种导出选项。

## 让我们开始吧

开始使用 Bolt DIY 有两条简单的路径。

以下是一个视觉指南，帮助您选择：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*y1xS_8CDoSrMR2113mYq4Q.png)

让我们详细了解每种安装方法。

开始很简单。

让我们一步一步来。

> **选项 1：直接安装**

**安装 Node.js：**

* 从 [这里](https://nodejs.org/) 下载 LTS 版本。
* 验证安装（对于 Windows，检查 Path 变量；对于 Mac/Linux，运行 `echo $PATH`）。

**克隆仓库：**


```python
git clone https://github.com/stackblitz-labs/bolt.diy.git
```
**安装依赖：**


```python
npm install -g pnpm pnpm install
```
**运行应用：**


```python
pnpm run dev
```
打开您的浏览器，您就可以开始使用了！


> **选项 2：使用 Docker**

如果您喜欢 Docker，那就太好了。以下是设置方法：

1. **安装 Docker：** 在 [这里](https://www.docker.com/) 获取。
2. **构建 Docker 镜像：**


```python
npm run dockerbuild # OR docker build . --target bolt-ai-development
```
**运行容器：**


```python
docker-compose --profile development up
```
太好了！您可以开始使用了。

## 添加 API 密钥和配置模型

那么，来谈谈 API 密钥吧。

添加它们非常简单：

> 打开应用程序并转到主界面。

> 从下拉菜单中选择您的提供者。

> 点击铅笔图标进行编辑。

> 安全地输入您的 API 密钥。

如果您使用的是像 Ollama 或 LM Studio 这样的自定义基础 URL，只需前往设置，找到“提供者”选项卡并在那添加 URL。

简单吧？

## Deepseek V3（你的快速且免费的编码助手）

Deepseek V3 是这里的明星模型之一。

它快速、可靠，并且——你猜对了——是免费的。

没有需要担心的速率限制，它能够像专业人士一样处理聊天和编码任务。

示例：假设你想要一个可玩的合成器键盘。只需输入你的提示，Deepseek 就会生成代码。如果缺少某个包，Bolt DIY 会标记并为你修复。

这有多酷？

## Gemini 2\.0 (多模态魔法)

现在，Gemini 2\.0 是一个更高级的版本。

它支持文本、图像等更多内容。

可以用来处理诸如通过截图优化代码或处理视觉密集型任务等事情。

只需获取一个 API 密钥，设置好它，让它发挥作用。

## 保持您的设置更新

了解更新过程对于维护您的 Bolt DIY 安装至关重要。

以下是更新工作流程的视觉指南：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Z3JGUzP1LboP19dCbvnJdA.png)

此过程确保在保留您的本地更改的同时顺利进行更新。

以下是详细步骤：

更新非常简单：

保存您的本地更改：


```python
git stash
```
拉取最新更新：


```python
git pull origin main
```
更新依赖项：


```python
pnpm install
```
恢复您的更改：


```python
git stash pop
```
如果出现问题，不用担心。只需进行干净安装：


```python
rm -rf node_modules pnpm-lock.yaml
pnpm store prune
pnpm install
```

## 方便的脚本

以下是一些用于管理 Bolt DIY 的常用脚本：

* `pnpm run dev`: 启动开发服务器。
* `pnpm run build`: 构建您的项目。
* `pnpm run start`: 在本地运行构建的应用程序。
* `pnpm run deploy`: 推送到 Cloudflare Pages。
* `pnpm run lint:fix`: 修复那些恼人的 lint 问题。
* `pnpm run preview`: 在本地预览生产构建。
* `pnpm run typecheck`: 简化 TypeScript 类型检查。

## 为什么你应该尝试这个

如果你对编程很认真，Bolt DIY 与 Deepseek V3 和 Gemini 2.0 是不容错过的选择。

它非常适合学生、独立开发者或任何想要一个强大的 AI 助手而不想花费太多的人。

此外，社区支持非常出色，新功能不断推出。

## 最后思考

好的，这就是要点。

Bolt DIY 不仅仅是一个工具；它是一个游戏规则改变者。

去试试吧，看看它如何改变你的编码工作流程。

编码愉快！

