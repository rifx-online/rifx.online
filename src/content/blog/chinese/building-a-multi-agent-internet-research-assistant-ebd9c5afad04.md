---
title: "构建多代理互联网研究助手"
meta_title: "构建多代理互联网研究助手"
description: "本文介绍了如何使用OpenAI Swarm和Llama 3.2构建一个多智能体互联网研究助手。该助手由三个智能体组成：第一个智能体接受用户查询并进行网络搜索，第二个智能体对搜索结果进行筛选和精炼，第三个智能体负责撰写文章。通过OpenAI Swarm框架实现智能体的管理和协调，用户界面则使用Streamlit设计。文章详细描述了各个智能体的功能和实现步骤，提供了构建多智能体应用的实用指南。"
date: 2024-12-27T12:59:06Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*S7Vz0Bq6_4szvCYFLBGASA.png"
categories: ["Programming", "Machine Learning", "Chatbots"]
author: "Rifx.Online"
tags: ["Swarm", "Llama", "Streamlit", "Agents", "Workflow"]
draft: False

---



> …使用 OpenAI Swarm 和 Llama 3.2（100% 本地）。



让我们使用 OpenAI Swarm 和 Llama 3.2（100% 本地）构建一个多智能体互联网研究助手：

动手教程，构建一个多智能体互联网研究助手应用程序，该应用程序：

* 接受用户查询。
* 在网上搜索相关信息。
* 并将其转化为一篇精心撰写的文章。

我们在这个应用中使用了三个智能体：

* 智能体 1 → 接受用户查询并在网上搜索。
* 智能体 2 → 接受来自智能体 1 的网络结果并进行精炼。
* 智能体 3 → 一个技术写作智能体，接受精炼后的结果，起草一篇文章，并将其发送回用户。

最近，OpenAI 发布了 Swarm。

这是一种开源框架，旨在以高度可定制的方式管理和协调多个 AI 智能体。

> AI 智能体是自主系统，可以推理、思考、规划，找出相关来源并在需要时从中提取信息，采取行动，甚至在出现问题时自我纠正。

今天，让我们覆盖一个实用的动手演示。我们将构建一个互联网研究助手应用程序，该应用程序：

* 接受用户查询。
* 在网上搜索相关信息。
* 并将其转化为一篇精心撰写的文章。

我们将使用：

* OpenAI Swarm 进行多智能体编排。
* Streamlit 进行用户界面设计。

以下是我们多智能体应用的逐步工作流程。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*3wxNfDwkOb4Cm724hKmoqQ.gif?output=gif&n=50)

如上所示，我们有三个智能体：

* 智能体 1 → 接受用户查询并在网上搜索。
* 智能体 2 → 接受来自智能体 1 的网络结果并进行精炼。
* 智能体 3 → 一个技术写作智能体，接受精炼后的结果，起草一篇文章，并将其发送回用户。

让我们构建这个应用程序！

## 导入

首先，我们开始进行一些标准导入：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*zKkVjAYXWhCkMuC_FHYHDA.png)

* 我们使用来自OpenAI的Swarm来构建我们的多代理应用。
* 我们使用duckduckgo\_search来搜索网络。

接下来，我们定义模型名称，并初始化swarm客户端和搜索客户端：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*QiWwtd2ZEhlcF3taI-dCiw.png)

## Agent 1

该代理必须接受用户的查询，搜索网络，并返回原始网络结果。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*a-6Pw1fiwziMCvmLOM6S0A.png)

为了构建这个，我们首先实现一个接受查询并返回原始结果的函数。

* 第7行：搜索网络。
* 第9–16行：将所有网络结果（标题 \+ URL \+ 正文）收集到一个字符串中并返回。

接下来，我们定义我们的网络搜索代理，它将利用上述函数，并且我们还在下面指定该代理的指令：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ROn4y11ULGgGYGnDGEDJwQ.png)

第1行：我们指定角色。

第6–11行：我们定义一个Agent类的对象（来自OpenAI Swarm），指定上述函数、指令和LLM。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*WKP_HyvXRH88n0wzxHzgzA.png)

## Agent 2

Agent 1 返回的结果可能非常杂乱，并且可能包含大量无关信息。我们需要另一个代理来筛选适当的信息。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*-IHad_91fdo6y2uwglOFTw.png)

与 Agent 1 一样，我们定义另一个 `Agent` 类的对象并传递指令：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*kCTx9FEIs9rUGGWSD-X3Yg.png)

## Agent 3

最后，我们构建了另一个代理，它接受上述过滤结果并撰写文章：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*72XSp_zbUYYq-3O9YgNQMg.png)

## 将它们组合在一起

虽然我们已经定义了上述三个代理，但多代理应用程序并不知道这些代理必须运行的顺序以及哪个输出必须传递给下一个代理。

因此，我们需要在工作流函数中将它们组合在一起。

为了简单起见，我们一步一步来。

* 首先，我们将用户查询传递给网络搜索代理，它生成原始响应：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*X9MEd-G1uv2jHeN5_32KKQ.png)

接下来，我们将原始响应传递给网络过滤代理：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*GCQmtGlqar7PPO_BkmSsNA.png)

完成！

这是 `run_workflow` 方法的完整代码：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*5AMaGwLcZsRq8Hxtt5AvLA.png)

执行 `run_workflow` 方法会生成期望的输出，如下所示（以及本通讯顶部的视频：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*dRRIbcw2oAGRMV4TDHrdbA.png)

当然，我们在本教程中没有涉及 Streamlit 部分。

我们今天启动了这个仓库，我们将在其中发布此类动手 AI 工程通讯期刊的代码。

这个仓库将专注于：

* 深入教程关于 **LLMs 和 RAGs。**
* 真实世界的 **AI 代理** 应用。
* 在您的项目中实施、适应和扩展的示例。

您喜欢这个主题吗？加入我们的通讯 订阅

如果您喜欢这篇文章并希望支持我，请确保：

👏 为故事点赞（100 次点赞）并关注我 👉🏻 [Mohammed Lubbad](https://medium.com/@mlubbad)

📑 查看我 [Medium 个人资料](https://medium.com/@mlubbad) 上的更多内容

🔔 关注我: [LinkedIn](https://www.linkedin.com/in/mohammedalubbad/) \| [Medium](https://medium.com/@mlubbad) \| [GitHub](https://github.com/mlubbad) \| [Twitter](https://twitter.com/engmlubbad) \| [Telegram](https://t.me/+m5aYZWcgQTg3NmU0)

🚀 通过与您的朋友和同事分享我的内容，帮助我接触更广泛的受众。

