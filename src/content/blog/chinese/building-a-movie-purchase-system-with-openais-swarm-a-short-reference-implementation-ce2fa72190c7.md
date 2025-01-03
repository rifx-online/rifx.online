---
title: "OpenAI的Swarm（第一部分）：简短的参考实现"
meta_title: "OpenAI的Swarm（第一部分）：简短的参考实现"
description: "本文探讨了OpenAI的Swarm框架在构建多智能体系统中的应用，特别是创建一个电影购买系统。通过多个专门代理（如监督、销售和运输代理）的协作，Swarm实现了复杂任务的高效管理。文章详细介绍了共享上下文的定义、环境设置，以及使用时序图进行调试的技巧。尽管Swarm被标记为实验性，但其灵活性和实用性为未来的多智能体应用提供了良好的基础。"
date: 2025-01-03T00:23:58Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*kYGO_VdF8nsCTggZUPvTLA.png"
categories: ["Programming", "Machine Learning", "Autonomous Systems"]
author: "Rifx.Online"
tags: ["Swarm", "multi-agent", "collaboration", "debugging", "sequence-diagrams"]
draft: False

---





**一个简短的代码参考，用于构建。**

## 字数：1350 \| 预计阅读时间：8分钟

## 目录

1. [简介：多智能体系统的挑战](https://markdowntohtml.com/#introduction)
2. [OpenAI的群体框架概述](https://markdowntohtml.com/#swarm-overview)
3. [环境设置](https://markdowntohtml.com/#setup)
4. [定义共享上下文](https://markdowntohtml.com/#shared-context)
5. [创建专门化代理](https://markdowntohtml.com/#specialized-agents)
* [监管代理](https://markdowntohtml.com/#supervisor-agent)
* [销售专家代理](https://markdowntohtml.com/#sales-agent)
* [运输专业代理](https://markdowntohtml.com/#shipping-agent)

6\. [使用序列图进行调试](https://markdowntohtml.com/#sequence-diagrams)

7\. [调试多智能体系统的专业技巧](https://markdowntohtml.com/#debugging-tips)

8\. [潜在应用和下一步](https://markdowntohtml.com/#applications)

## TL;DR

我们探索了使用 OpenAI 的实验性 Swarm 框架创建一个简化的电影购买系统，其中多个 AI 代理在监督者的控制下协作处理交易。

本文展示了为监督、销售和运输创建专门代理的过程，并使用 Mermaid 序列图进行有效调试。

从第一性原理的角度来看，我喜欢 OpenAI Swarm。它在掌握后显得简单而灵活。你总是足够接近使用常规的 Python 代码，并且它迫使你精准地调整提示。

> ***使用流状态（Swarm 术语中的 context_variables）帮助监督者管理从一个代理到另一个代理的适当过渡。***

接下来，我们可能会尝试一个更简单的顺序实现。但为什么要先做简单的事情呢？ :)

关于使用 Mermaid 序列图来帮助可视化调试的部分也非常有用。我尝试了一些开源的“LLM 跟踪”库，但发现它们不够直观。我想我会暂时保留我新发现的可视化调试习惯。

我已将整个代码的 gist 公开 [在这里](https://gist.github.com/cnndabbler/6ee1b89044306e8073356e59f4cb0bac)。欢迎探索并分享你的经验。

我预计在探索添加记忆和其他协调方案的同时继续使用 Swarm。到目前为止，这很有趣。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*S4g9b7Lgu1WNCxTzmye7bw.png)

## 介绍：多智能体系统的挑战

开发者通常使用单一目的的聊天机器人，这些机器人简单但功能有限。

然而，现实世界的应用往往需要更强大和复杂的系统，涉及多个专门的AI代理和谐地协作。

想象一个电影购买系统：一个代理根据电影的标题和发布日期确定定价，另一个管理运输物流以确保及时交付，而一个监督者协调整个过程，以保持无缝的工作流程和无错误的执行。

通过利用这种协作方法，这些系统可以处理更复杂的任务，并提供更好的用户体验。

本文深入探讨了OpenAI的实验性Swarm框架如何为构建多智能体编排提供实用和高效的解决方案，使得具有挑战性的任务变得可管理和直观。

## OpenAI的Swarm框架概述

Swarm是OpenAI的多智能体编排实验框架。它引入了：

* **智能体协作**：多个具有特定目标的智能体共同工作。
* **共享上下文管理**：使智能体能够访问和修改集中上下文。
* **动态功能处理**：促进智能体之间的通信和功能调用。

尽管被标记为实验性且不适用于生产环境，Swarm仍然是一个很好的教育工具，用于探索先进的AI系统设计。然而，这种标签低估了它的潜力；Swarm的架构和模式展示了一种灵活性和健壮性，可以激发超越其当前范围的创新应用。

## 设置环境

首先，安装必要的库并配置环境：

```python
from openai import OpenAI
from swarm import Swarm, Agent
from swarm.types import Response, Result
```

```python
client = OpenAI()
crew = Swarm(client=client)
model = "gpt-4o-mini"  # 我们选择的模型
```
这将使用 OpenAI 的客户端和所需的模型设置 Swarm 实例。

## 定义共享上下文

共享上下文确保所有代理能够访问相同的信息，从而实现无缝协作。

```python
context_variables = {
   "query": "",
   "title": None,
   "year": None,
   "price": None,
   "sales_done": False,
   "shipping_done": False,
   "transaction_id": None,
   "timestamp": None,
}
```
每个变量在交易过程中动态初始化和更新。

## 创建专业代理

### 监督代理

该代理协调流程，确保所有步骤按顺序完成。


```python
supervisor_agent = Agent(
   name="supervisor",
   model=model,
   instructions="""
      GOAL:
      You help the user buy a movie and ship it to their address.
```

```python
      FOLLOW THIS FLOW STRICTLY:
      1. Extract the movie title and year from the query
      2. Call buy_movie with the title and year
      3. WAIT for the price to be computed
      4. Only after the price is set, proceed with ship_movie
   """,
   context_variables=context_variables,
   functions=[buy_movie, ship_movie]
)
```

### 销售专家代理

使用 `get_price` 函数处理电影定价。


```python
buy_movie_agent = Agent(
   name="buy_movie_agent",
   model=model,
   instructions="""You are a sales agent. Your ONLY task is to get the price for a movie using the get_price function.
```

```python
IMPORTANT: You must ALWAYS call get_price with the title and year provided in the context variables.
```

```python
DO NOT proceed with any other actions.
DO NOT engage in conversation.
JUST call get_price immediately.""",
   context_variables=context_variables,
   functions=[get_price]
)
```

### 发货代理

负责将购买的电影发货。


```python
ship_movie_agent = Agent(
   name="ship_movie_agent",
   model=model,
   instructions="""You are a shipping agent. Your task is to ship the movie to the customer's address.
```

```python
   IMPORTANT:
   - Only ship if the movie has been purchased
   - You must call process_shipping to handle the shipping process
   - DO NOT engage in conversation
   - DO NOT ask for the address (it's already in context_variables)
   - JUST call process_shipping immediately""",
   context_variables=context_variables,
   functions=[process_shipping]
)
```

## 使用时序图进行调试

调试多智能体系统可能很具挑战性。时序图提供了智能体交互和状态变化的可视化表示。

以下是一些示例。在第一个案例中，我们可以轻松跟随顺序，从一个智能体移动到下一个智能体。

如果用户请求包括电影和日期，监督者智能体将继续处理其余的群体。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*S4g9b7Lgu1WNCxTzmye7bw.png)

其他请求将被忽略。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*61_PCv5sgPGAmVQinr4btA.png)

## 调试多智能体系统的专业技巧

1. **可视化流程跟踪**: 序列图通过可视化呈现智能体交互来简化调试。
2. **状态监控**: 确保上下文变量按预期变化。
3. **时序洞察**: 查找步骤之间的不寻常延迟。
4. **激活检查**: 验证每个智能体是否被正确触发。

## 潜在应用与后续步骤

这里展示的模式可以应用于多个领域：

* **客户服务**：自动化多步骤支持流程。
* **预订系统**：协调预订、付款和确认。
* **教育辅导**：实施多智能体学习工作流程。

你会用多智能体系统构建什么？在评论中分享你的想法！

本指南展示了使用 OpenAI 的 Swarm 框架的现实世界实施。尽管该框架是实验性的，但这些原则和模式可以普遍应用于多智能体系统设计。

