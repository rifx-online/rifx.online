---
title: "Bolt.new 和 Ollama：革新人工智能驱动的全栈式 Web 开发"
meta_title: "Bolt.new 和 Ollama：革新人工智能驱动的全栈式 Web 开发"
description: "Bolt.new是一款创新的AI驱动全栈Web开发工具，能在浏览器中简化应用程序的构建与部署。结合Ollama，用户可以在本地运行开源AI模型，降低成本并提升灵活性。Bolt.new通过全面控制开发环境，支持从简单网页到复杂金融服务应用的开发，极大地提高了开发效率和便捷性。"
date: 2024-11-16T01:24:58Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*vbo04xVLorq_rvpeEDCaAg.jpeg"
categories: ["Programming", "Technology/Web", "Data Science"]
author: "Rifx.Online"
tags: ["Bolt", "Ollama", "browser", "deployment", "web"]
draft: False

---





在快速发展的 Web 开发世界中，效率和创新至关重要。开发者、项目经理和设计师们都在不断寻找能够简化工作流程、降低成本和提高生产力的工具。**Bolt.new** 是一款突破性的 AI 驱动全栈 Web 开发代理，完全在您的浏览器中运行。与 **Ollama** 配合使用，后者允许您在本地运行开源 AI 模型，Bolt.new 将彻底改变我们构建和部署 Web 应用程序的方式。本文将深入探讨 Bolt.new、它与 Ollama 的集成，并提供一个全面的入门指南。

## 目录

1. Bolt.new 简介
2. Bolt.new 的独特之处
* 浏览器中的全栈开发
* 具备环境控制的 AI

3\. 将 Bolt.new 与 Ollama 集成

* 为什么使用 Ollama？
* 安装与设置

4\. 安装指南逐步解析

* 前置条件
* 克隆代码库
* 配置环境变量
* 安装依赖
* 运行应用程序

5\. 使用 Docker 运行 Bolt.new

6\. 实际演示

* 创建一个简单的网页
* 构建一个贪吃蛇游戏
* 开发全栈金融服务网页应用

7\. 最大化利用 Bolt.new 的技巧与窍门

## Bolt.new简介

Bolt.new 是一款创新工具，旨在简化构建全栈 web 应用程序的过程。通过利用先进的 AI 模型，Bolt.new 允许用户直接从浏览器中 **提示**、**运行**、**编辑** 和 **部署** 应用程序。这消除了复杂的本地设置需求，使 web 开发变得更加便捷和高效。

无论您是经验丰富的开发人员、负责多个项目的项目经理，还是希望快速原型设计的设计师，Bolt.new 提供了一个多功能平台，以最小的努力将您的想法变为现实。

## Bolt.new 的独特之处

虽然有众多 AI 模型和开发工具，但 Bolt.new 通过其全面的功能和无缝的集成脱颖而出。以下是 Bolt.new 独特之处的详细介绍：

## 浏览器中的全栈开发

Bolt.new 将最先进的 AI 模型与由 [StackBlitz 的 WebContainers](https://github.com/stackblitz/webcontainer-core) 驱动的浏览器开发环境集成在一起。这一集成实现了一系列功能：

* **安装和运行 npm 工具和库：** 利用流行框架如 Vite、Next.js 等，无需离开浏览器。
* **运行 Node.js 服务器：** 无缝管理后端操作。
* **与第三方 API 交互：** 通过集成各种服务增强应用程序的功能。
* **通过聊天直接部署到生产环境：** 通过聊天界面直接将应用程序推向上线。
* **通过 URL 分享工作：** 轻松与合作者或利益相关者分享项目。

## AI与环境控制

与传统开发环境中AI助手仅限于代码生成不同，Bolt.new使AI模型能够**完全控制**开发环境。这包括管理文件系统、节点服务器、包管理器、终端和浏览器控制台。这种全面的控制使AI代理能够处理整个应用程序生命周期——从创建到部署——显著简化了开发过程。

## 将 Bolt.new 与 Ollama 集成

为了进一步增强 Bolt.new 的功能并提供更多灵活性，与 **Ollama** 的集成是一个改变游戏规则的举措。

## 为什么使用 Ollama？

**Ollama** 允许您在本地机器上运行开源 AI 模型。这种集成提供了几个优势：

* **成本效益：** 避免为基于云的 AI 模型支付与令牌使用相关的费用。
* **灵活性：** 根据您的偏好访问各种模型，从 Llama 3.2 Vision 到 Deep SE Coder。
* **隐私和控制：** 本地运行模型以维护数据隐私并控制开发环境。

## 安装和设置

将 Ollama 与 Bolt.new 集成涉及几个简单的步骤。以下是帮助您入门的详细指南。

## 步骤\-逐步安装指南

## 前提条件

在使用 Ollama 设置 Bolt.new 之前，请确保您的系统上已安装以下内容：

1. **Git:** 克隆代码库所必需的工具。
* [下载 Git](https://git-scm.com/downloads)

**2\. Node.js:** 用于在服务器上执行 JavaScript 的运行时环境。

* [下载 Node.js](https://nodejs.org/en/download/)

**3\. Docker（可选）：** 用于容器化应用程序。

* [下载 Docker](https://www.docker.com/)

**4\. Ollama:** 用于本地运行开源 AI 模型。

* [下载 Ollama](https://ollama.com/)

## 克隆仓库

首先从 GitHub 克隆 Bolt.new 仓库


```python
git clone https://github.com/coleam00/bolt.new-any-llm.git
```

## 配置环境变量

1. **重命名配置文件：** 导航到克隆的仓库，并将 `.env.example` 文件重命名为 `.env.local`。
2. **添加您的 LLM API 密钥：** 打开 `.env.local` 文件并添加您的 API 密钥：

```python
GROQ_API_KEY=YOUR_GROQ_API_KEY
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
ANTHROPIC_API_KEY=YOUR_ANTHROPIC_API_KEY
```
**注意：** 如果您使用 Ollama，它不需要 API 密钥，因为它在本地运行。

**3\. 可选调试级别：** 您可以设置调试级别以帮助故障排除：

```python
VITE_LOG_LEVEL=debug
```
**重要：** 切勿将您的 `.env.local` 文件提交到版本控制，因为它已包含在 `.gitignore` 中。

## 安装依赖

Bolt.new 使用 `pnpm` 进行包管理。使用以下命令安装依赖：

1. **安装 pnpm（如果尚未安装）：**


```python
sudo npm install -g pnpm
```
**2\. 安装项目依赖**


```python
pnpm install
```

## 运行应用程序

使用以下命令启动开发服务器：


```python
pnpm run dev
```
该命令初始化 Remix Vite 开发服务器。为了获得最佳性能，建议使用 [Google Chrome Canary](https://www.google.com/chrome/canary/) 作为您的浏览器。

## 使用 Docker 运行 Bolt.new

对于那些喜欢容器化环境的用户，Bolt.new 提供了强大的 Docker 支持。

## 使用辅助脚本

Bolt.new 提供了用于构建 Docker 镜像的 NPM 脚本：

* **开发构建：**


```python
npm run dockerbuild
```
* **生产构建：**


```python
npm run dockerbuild:prod
```

## 直接 Docker 构建命令

或者，使用 Docker 的目标特性来指定构建环境：

* **开发构建：**


```python
docker build . --target bolt-ai-development
```
* **生产构建：**


```python
docker build . --target bolt-ai-productio
```

## Docker Compose 与配置文件

使用 Docker Compose 配置文件管理不同的环境：

* **开发环境：**

```python
docker-compose --profile development up
```
* **生产环境：**

```python
docker-compose --profile production up
```
**注意：** 当使用开发配置文件运行 Docker Compose 命令时，您机器上代码的任何更改将自动反映在运行中的容器中，从而实现热重载。

## 实用演示

为了展示 Bolt.new 的功能，让我们通过几个实用示例来进行演示。

## 创建一个简单的网页

其中一个最简单的演示是生成一个基本的网页：

1. **Prompt Bolt.new:** 请求AI创建一个简单的网页。
2. **Generation:** Bolt.new生成所有必要的文件夹和文件。
3. **Preview:** 利用预览功能即时查看输出。

这个过程强调了Bolt.new高效处理简单任务的能力，为更复杂的项目提供了坚实的基础。

## 构建贪吃蛇游戏

Bolt.new的能力在创建交互式应用程序时变得更加明显，例如贪吃蛇游戏：

1. **提示Bolt.new：** 请求AI帮助创建贪吃蛇游戏。
2. **生成：** Bolt.new生成所有所需的文件、包和前端界面。
3. **预览：** 打开生成的HTML文件，查看一个功能齐全的贪吃蛇游戏，并跟踪得分。

**结果：** AI成功生成了一个视觉上吸引人且功能齐全的游戏，展示了其处理动态和交互式网页应用程序的能力。

## 开发全栈金融服务网页应用

为了更全面的演示，让我们探讨构建一个全栈金融服务应用程序：

1. **Prompt Bolt.new:**
* **前端:** 使用 React 作为用户界面。
* **后端:** 实现 Next.js 进行服务器端渲染。
* **数据库:** 集成 PostgreSQL 进行数据管理。
* **身份验证:** 使用 Clerk 进行设置。

```python
Create a full-stack financial service web app with a clean, intuitive UI using ChatGPT and React for the frontend, Next.js for server-side rendering, PostgreSQL for data management, and authentication set up with Clerk.
```
**2\. 生成过程:**

* **文件创建:** Bolt.new 生成必要的项目结构和文件。
* **包安装:** 安装所需的包，如 React、Next.js 和 Clerk。
* **后端设置:** 配置服务器端渲染和数据库连接。
* **身份验证:** 集成 Clerk 进行用户身份验证。

**3\. 预览:** 通过提供的 URL 访问应用程序，查看完整功能的金融仪表板，特点包括：

* **余额历史:** 所有存款的概述。
* **预算配置:** 能够从各个类别添加预算。
* **交易管理:** 添加和查看交易。
* **投资跟踪:** 监控投资。

**结果:** Bolt.new 高效地管理复杂多面的应用程序创建，突出其在大规模项目中的潜力。

## Tips and Tricks for Maximizing Bolt.new

为了充分利用 Bolt.new，请考虑以下策略：

1. **明确您的技术栈：**
* 在初始提示中清楚地提及您希望使用的框架或库（例如，Astro、Tailwind、ShadCN），以确保 Bolt.new 按照您的需求搭建项目。

**2\. 使用增强提示图标：**

* 在提交提示之前，使用“增强”功能来优化您的指令。这将导致更准确和高效的代码生成。

**3\. 首先搭建基础结构：**

* 在添加高级功能之前，从应用程序的基本结构开始。这有助于 Bolt.new 理解项目基础，确保后续功能的良好集成。

**4\. 批量处理简单指令：**

* 将多个简单任务合并为一个提示，以节省时间并减少 API 额度消耗。例如，请求更改配色方案、添加移动响应能力，以及一次性重启开发服务器。

**5\. 利用开源自定义：**

* 由于 Bolt.new 是开源的，请探索 [Bolt.new GitHub 仓库](https://github.com/coleam00/bolt.new-any-llm.git)，以自定义和扩展功能以满足您的特定项目需求。

Bolt.new，特别是在与 Ollama 集成时，代表了 AI 驱动的网页开发的重大进步。通过将先进的 AI 模型与强大的开发工具结合起来，Bolt.new 简化了构建、部署和管理全栈应用程序的过程。无论您是希望加快开发工作流程、探索 AI 驱动的编码辅助，还是以最小的设置构建复杂的网页应用程序，Bolt.new 都提供了实现目标所需的工具和灵活性。

