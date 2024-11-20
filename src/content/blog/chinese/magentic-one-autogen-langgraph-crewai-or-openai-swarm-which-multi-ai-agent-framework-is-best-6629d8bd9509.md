---
title: "Magentic-One、AutoGen、LangGraph、CrewAI 或 OpenAI Swarm：哪种多人工智能代理框架最好？"
meta_title: "Magentic-One、AutoGen、LangGraph、CrewAI 或 OpenAI Swarm：哪种多人工智能代理框架最好？"
description: "本文对五种流行的多智能体编排框架进行了比较，包括AutoGen、CrewAI、LangGraph、OpenAI Swarm和Magentic-One。每个框架的特点、优缺点被详细阐述，适用场景也有所区分。AutoGen适合软件开发，CrewAI用户友好且易于设置，LangGraph灵活性高，OpenAI Swarm适合新手，而Magentic-One则是AutoGen的简化版本。最终选择应基于用户需求和技术背景。"
date: 2024-11-20T00:11:54Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*JWKx6b9PYndI9BCpKvK9yw.png"
categories: ["Programming", "Machine Learning", "Chatbots"]
author: "Rifx.Online"
tags: ["AutoGen", "CrewAI", "LangGraph", "OpenAI", "Magentic-One"]
draft: False

---



### 流行的多智能体编排框架的优缺点



生成式人工智能中的多智能体话题正在升温，每个主要科技巨头都发布了一些相关框架。

但是，应该选择哪个多智能体框架呢？

> 选择实在太多了！！

随着OpenAI发布Swarm和微软的Magentic-One，这个领域变得非常拥挤。因此，为了消除任何疑虑，我将尝试解释每个框架的关键特性、优缺点，让您决定哪个最适合您。我们将讨论：

> AutoGen (Microsoft)

> LangGraph (LangChain)

> CrewAI

> OpenAI Swarm (OpenAI)

> Magentic-One (Microsoft)

让我们开始吧！！

## 1\. Autogen

AutoGen 是微软在该领域中最受欢迎和最早的框架，更适合软件开发任务

**特点**：

* 它主要涉及两个代理，用户和助手。
* **用户代理和助手代理交互**：在 Autogen 的用户-助手代理模型中，**用户代理**可以提供提示或需求，而 **助手代理** 生成并执行代码。
* 助手代理不仅处理代码生成，还负责执行，将结果反馈给用户或设置中的其他代理。
* 专注于代码任务的多代理编排，但也可以处理其他任务。
* 在交互过程中可以提供人类指导。
* 得到微软的强大社区支持。

**局限性**：

* 不够直观，不适合非程序员。
* 设置复杂，尤其是在本地 LLM 时；需要一个代理服务器。
* 如果不是软件开发任务，效果可能相当平庸。

## 2\. CrewAI

CrewAI 通常是人们构建任何多 AI 代理任务快速演示的首选，因为它非常直观且易于设置。

**特点**：

* 非常直观，主要依赖于提示编写。
* 创建新代理并将其添加到生态系统中非常简单。您可以在几分钟内创建数百个代理。
* 非技术用户也易于使用。
* 由于与 LangChain 的集成，能够很好地与大多数 LLM 提供商和本地 LLM 配合使用。

**限制**：

* 灵活性和自定义能力有限。
* 适合基本用例，不适合复杂编程任务。
* 代理之间的交互过程中存在一些错误。
* 社区支持有限

## 3\. Langraph

我个人最喜欢的 LangGraph 可以用于任何多智能体任务，并提供了很大的灵活性。

**特点**：

* 基于 LangChain 构建；基于有向循环图的理念。
* 它不仅仅是一个多智能体框架，还有更多功能。
* 非常灵活和可定制，支持几乎所有多智能体编排应用。
* 它是 LangChain 的扩展，因此得到了很好的社区支持。
* 与开源 LLM 和任何 API 配合良好。

**限制**：

* 缺乏全面的文档。
* 对于非程序员或初学程序员不够友好。
* 需要相当的编程技能，特别是在理解图形和逻辑流程方面。

## 4\. OpenAI Swarm

OpenAI 最近发布了 Swarm，我必须说，如果你想入门，这是最简单的多 AI 代理框架。

### 特性

* 适合多智能体领域的新手
* 主要关注简化“智能体创建”和智能体之间的上下文切换（称为交接）。
* 创建一个简短的演示非常简单

### 限制

* 不支持除 OpenAI API 以外的 LLM
* 不适合生产环境部署
* 灵活性不足
* 社区支持较差。您甚至无法在 Git Hub 上提出问题！

## 5\. Magentic\-One

这个列表中最新的成员是微软的 Magentic\-One（他们的第二个框架），这也是一个简化他们现有 AutoGen 框架的尝试。

### 特性

* 类似于 Swarm，适合非程序员，易于运行
* 附带一个默认的 5 个代理包，其中一个是管理代理，其他 4 个为：**WebSurfer** 通过浏览器导航和与网页互动，**FileSurfer** 管理和导航本地文件，**Coder** 专注于编写和分析代码，**ComputerTerminal** 提供控制台访问以运行程序和安装库。
* 基于 AutoGen 构建，更像是一个通用框架。
* 包含 AutoGenBench，一个专门用于分析代理性能的工具。

### 限制

* 对开源 LLM 的支持很复杂
* 灵活性不足；对我来说，更像是一个应用而不是一个框架
* 目前文档和社区支持几乎为零

## 那么，最好的多智能体框架是什么？

根据我的观点（我使用过所有这些包），

* **软件开发**：AutoGen（微软）—— 最适合涉及代码生成和复杂多智能体编码工作流的任务。
* **新手最佳选择**：OpenAI Swarm 和 CrewAI — 用户友好，适合那些对多智能体 AI 不熟悉且不需要复杂设置的用户。
* **复杂任务最佳选择**：LangGraph — 提供高度灵活性，专为高级用户构建，允许自定义逻辑和编排。
* **开源 LLM**：LangGraph — 与开源 LLM 集成良好，并支持各种 API，不像其他一些框架。即使 CrewAI 也不错。
* **最佳社区支持**：AutoGen 具有良好的社区支持，可以帮助您解决各种问题。
* **随时准备就绪**：CrewAI — 快速设置且直观，适合演示或需要快速创建智能体的任务。即使 Swarm 和 Magnetic-One 也相当不错，但社区支持不足。
* **性价比高**：Magnetic-One — 提供预打包的设置和通用方法，可能节省初始成本。即使 Swarm 和 CrewAI 也可以考虑。

我希望这篇博客对您有所帮助，帮助您选择合适的多智能体 AI 编排框架。

