---
title: "我应该使用哪种人工智能代理框架？(CrewAI、Langgraph、Majestic-one 和 pure code）。"
meta_title: "我应该使用哪种人工智能代理框架？(CrewAI、Langgraph、Majestic-one 和 pure code）。"
description: "随着大型语言模型的发展，AI代理框架如CrewAI、LangGraph和AutoGen等应运而生，旨在通过多代理协作提升任务执行效率。CrewAI适合初学者，LangGraph提供较高的灵活性，适合复杂工作流，而AutoGen则专注于任务协调和专业代理的管理。每种框架都有其独特的优势和适用场景，选择合适的框架可根据用户需求和复杂性进行。"
date: 2024-11-25T15:00:22Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*WeIWsSVJkAL_KZlfwz4QBw.png"
categories: ["Programming", "Machine Learning", "Natural Language Processing"]
author: "Rifx.Online"
tags: ["CrewAI", "LangGraph", "AutoGen", "agents", "frameworks"]
draft: False

---



随着大型语言模型的进步，人工智能模型现在能够对问题进行推理。起初，我们认为这些模型无法完成我们的工作，因为它们似乎只是搜索引擎的聊天机器人版本，我们能够用简单的推理来欺骗这些模型，但这变得越来越困难。这些大型语言模型现在能够逐步思考，并完成比简单回答问题更复杂的任务。



大型语言模型是通过预测前一个标记的下一个标记进行训练的。标记可以是单词、字符或称为子词的字符组。从这个结构，OpenAI开发了名为ChatGPT的聊天机器人。这个聊天机器人能够回答问题，并且由于其在从互联网抓取的大量网络上进行训练，因此具有广泛的知识。随着其不断改进，它在推理方面变得越来越好。一个想法诞生了。如果我们给LLM工具来感知其环境并采取行动以实现特定目标，这种结构被称为AI代理。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*CnzI5_2lmlGkMFDqg6IcyA.png)

Nvidia将代理定义为一个系统，可以使用LLM对问题进行推理，制定解决问题的计划，并在一组工具的帮助下执行该计划。AI代理的组成部分包括内存、规划、提示、知识和工具。

**1\. 内存**

* 正如我们所知，代理通过首先将复杂任务分解为子任务，然后执行工具来完成子任务。为此，模型需要记住其先前的步骤。

**2\. 规划**

* 复杂问题通常需要链式思维的方法。

**3\. 提示**

* 提示是给LLM有关其目标、行为和计划的信息的指令。

**4\. 知识**

* 如果没有该领域的知识，代理无法解决甚至理解任务。因此，要么LLM必须经过微调以具备知识，要么我们可以创建一个工具从数据库中提取知识。

**5\. 工具**

* 可执行的功能、API或其他服务，允许代理完成其职责。

但AI代理的真正力量来自不同代理之间的协作。这种结构称为多代理结构。在这种架构中，就像一个团队，结构包含几个具有特定技能和特定工作的成员。为了高效，角色和目标越具体越好。代理可以具有不同的角色，每个角色都为团队的整体目标做出贡献。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*rI-hmUm-oYDCh9qq)

大型科技公司不断推进多模态和文本生成模型，以至于预训练定制模型变得既不必要又过于昂贵。因此，未来AI解决方案的发展可能会集中在三个主要领域：

* 60% 流程工程
* 35% 微调
* 5% 提示工程

尽管AI代理代表了AI社区的巅峰，但当每个代理被分配特定角色并在明确定义的工作流中操作时，它们的表现最佳。利用AI代理框架是实现这种结构化协作的最有效方式。

许多框架已经出现，使AI代理对所有人都可访问。在本文中，我将讨论以下框架：crewAI、langgraph、autogen（majestic one扩展），最后我们将讨论如何在没有任何框架的情况下构建一个代理。

## 1\. CrewAI

crewAI 是一个由 João Moura 创建的开源多智能体编排框架。这个基于 Python 的框架利用角色扮演的自主 AI 代理，作为一个紧密协作的团队或“船员”共同完成任务。

crewAI 的口号是：“在数小时内成为多智能体专家”。这是最易于使用的框架。这有其优点和缺点。作为一个高级框架，它使构建一般结构变得更容易。另一方面，不了解框架方法背后发生的事情使得调整整体过程变得更加困难，可能出现的错误也更难被发现和调试。

使用 crewAI 框架创建一个代理需要四个属性：

* Role

> 定义代理在船员中的功能

* Goal

> 代理旨在实现的个人目标

* Backstory

> 为代理的角色和目标提供背景，丰富互动和协作动态

* Tools

> 代理可以用来执行任务的一组能力或功能

使用 CrewAI 框架，只需几行非常简单的代码，就能更轻松地启动和运行一个代理。它非常适合初学者或那些希望在没有繁琐设置的情况下完成任务的人。

CrewAI 是一个可扩展的数据驱动框架，擅长处理大规模系统，并提供简单的 API 以便于与现有系统的集成。它还支持在 **AWS** 和 **Azure** 等云平台上部署，尽管它对自定义模型的支持有限，这对于必须与开源模型合作的公司至关重要，并且在灵活性上不如 Autogen。另一个 crewAI 的缺点是它不支持流式函数调用 **这可能是一个巨大的问题。**

## 2\. LangGraph

LangGraph 是一个基于 Langchain 库构建的框架，利用其众多功能和工具。LangGraph 使用图形来创建多代理或单代理结构。图形表示架构的一般流程。LangGraph 是一个旨在通过创建组件交互的图形表示来可视化和管理涉及语言模型的复杂关系和工作流程的工具。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*_Doc5NI81aXnNpRKMleSuQ.png)

与 crewAI 相比，LangGraph 是一个相对低级的框架。因此，它的实现比 crewAI 要困难一些。但低级结构使我们能够调整流程，生成我们工作所需的更复杂的流程。尽管该框架以易用性、可扩展性和与流行的 AI 库（如 TensorFlow、PyTorch 和 Keras）的集成而闻名，但它对亚马逊或 Azure 等分布式系统的支持有限。

LangGraph 还提供了 Langsmith，用于监控您的 LLM。使用 LangSmith，您可以监控您的代理生成的内容及其路线图。实现非常简单。只需将您的 LangSmith API 密钥添加到环境中，即可监控图中的所有输入和输出。但您必须注意，这些监控信息存储在互联网上，这对某些用例可能不太可行。对于这些用例，可以实现 LangFuse，尽管它更复杂。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*jylIemjQodxh8jsynwq92w.png)

## 3\. AutoGen(Magentic\-One)

AutoGen 是由 Microsoft 开发的框架，Magentic\-One 是 AutoGen 新发布的扩展。它具有一个 Orchestrator 代理，负责管理任务规划和协调四个专业代理之间的工作：WebSurfer、FileSurfer、Coder 和 ComputerTerminal。通过结合这些代理，可以在 IT 行业中完成无数任务。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*FF-bJ_RnigMEy66a4UOdbQ.png)

Magentic\-One 由以下代理组成：

* **Orchestrator:** 主要代理，负责任务分解、规划、指导其他代理执行子任务、跟踪整体进度，并在需要时采取纠正措施
* **WebSurfer**: 基于 LLM 的代理，擅长指挥和管理基于 Chromium 的网页浏览器的状态。对于每个请求，WebSurfer 执行诸如导航（例如，访问 URL、执行搜索）、与网页交互（例如，点击、输入）和读取操作（例如，总结、回答问题）。然后，它报告网页的新状态。WebSurfer 依赖于浏览器的可访问性树和一组标记提示来执行其任务。
* **FileSurfer**: 基于 LLM 的代理，指挥基于 markdown 的文件预览应用程序以读取本地文件。它还可以执行常见的导航任务，例如列出目录内容并在其中导航。
* **Coder**: 基于 LLM 的代理，专注于编写代码、分析从其他代理收集的信息并创建新工件。
* **ComputerTerminal**: 提供访问控制台 shell 的功能，以执行程序和安装新库。

Magentic\-One 是模块化和可适应的，允许各种语言模型的轻松集成。该系统在 GAIA、AssistantBench 和 WebArena 等基准测试中表现出竞争力，无需核心修改。例如，GAIA 由超过 450 个具有明确答案的非平凡问题组成，解决这些问题需要不同级别的工具和自主性。该框架还包括针对危险自主行为的安全措施。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*yhY-sdhDaBnz3wd8Tv9AFg.png)

虽然所有代理使用的默认多模态 LLM 是 GPT\-4o，但 Magentic\-One 是模型无关的，允许集成异构模型以支持不同的能力或满足不同的成本要求。可以集成不同的 LLM，但建议使用强推理模型，显而易见。

## 4\. 纯代码代理

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*LxigG3MHrjJjYgs4xPc7sw.gif?output=gif&n=50)

最终的方法是完全从零开始构建纯代码代理，完全绕过框架。此方法提供了较高的定制化程度，尤其适用于简单工作流。然而，随着工作流复杂性的增加，实施变得极为困难。从头开始构建可能是一个良好的学习机会，但这非常耗时，并且在出现问题时没有社区支持。

## 最终比较

从各种来源来看，所有框架都有其自身的优势：

· **软件开发最佳选择**：LangGraph — 最适合涉及代码生成和复杂多代理编码工作流的任务。

· **新手最佳选择**：CrewAI — 用户友好，非常适合那些对多代理 AI 不熟悉且不需要复杂设置的用户。

· **复杂任务最佳选择**：LangGraph — 提供高度灵活性，专为高级用户设计，允许自定义逻辑和编排。

· **开源 LLM**：LangGraph — 与开源 LLM 集成良好，并支持各种 API，与其他一些框架不同。CrewAI 也不错。

· **最佳社区支持**：AutoGen 具有相当不错的社区支持，可以帮助您解决各种问题。

· **即开即用**：CrewAI — 设置快速且直观，适合演示或需要快速创建代理的任务。Swarm 和 Magentic-One 也相当不错，但社区支持不足。

· **性价比高**：Magentic-One — 提供预打包设置和通用方法，可能节省初始成本。Swarm 和 CrewAI 也可以考虑。

## 来源

\[1] LLM代理简介, [https://developer.nvidia.com/blog/introduction\-to\-llm\-agents/](https://developer.nvidia.com/blog/introduction-to-llm-agents/)

\[2] CrewAI主页, <https://www.crewai.com/>

\[3] 什么是crewAI?, [https://www.ibm.com/think/topics/crew\-ai](https://www.ibm.com/think/topics/crew-ai)

\[4] LangGraph、Autogen和Crewai在多代理系统开发中的比较研究：详细评审, [https://readmedium.com/comparative\-study\-of\-langgraph\-autogen\-and\-crewai\-for\-development\-of\-multi\-agent\-system\-detailed\-2aa8ebdc8e88](https://readmedium.com/comparative-study-of-langgraph-autogen-and-crewai-for-development-of-multi-agent-system-detailed-2aa8ebdc8e88)

\[5] Magentic\-One、AutoGen、LangGraph、CrewAI或OpenAI Swarm：哪个多AI代理框架最好?, [https://readmedium.com/magentic\-one\-autogen\-langgraph\-crewai\-or\-openai\-swarm\-which\-multi\-ai\-agent\-framework\-is\-best\-6629d8bd9509](https://readmedium.com/magentic-one-autogen-langgraph-crewai-or-openai-swarm-which-multi-ai-agent-framework-is-best-6629d8bd9509)

\[6] AI代理框架, [https://readmedium.com/ai\-agentic\-frameworks\-2022fe43e78a](https://readmedium.com/ai-agentic-frameworks-2022fe43e78a)

\[7] LangGraph、Autogen和Crewai在构建多代理系统中的比较研究, [https://pratikbarjatya.medium.com/comparative\-study\-of\-langgraph\-autogen\-and\-crewai\-for\-building\-multi\-agent\-systems\-0e7e47f9078e](https://pratikbarjatya.medium.com/comparative-study-of-langgraph-autogen-and-crewai-for-building-multi-agent-systems-0e7e47f9078e)

\[8] LangGraph主页, <https://www.langchain.com/langgraph>

\[9] LangSmith主页, <https://www.langchain.com/langsmith>

\[10] 定制代码代理与基于框架的方法比较, [https://timothy\-urista.medium.com/comparing\-bespoke\-code\-agents\-and\-framework\-based\-approaches\-92bb609ab711](https://timothy-urista.medium.com/comparing-bespoke-code-agents-and-framework-based-approaches-92bb609ab711)

\[11] Magentic\-One：解决复杂任务的通用多代理系统, [https://www.microsoft.com/en\-us/research/articles/magentic\-one\-a\-generalist\-multi\-agent\-system\-for\-solving\-complex\-tasks/](https://www.microsoft.com/en-us/research/articles/magentic-one-a-generalist-multi-agent-system-for-solving-complex-tasks/)

\[12] 什么是LLM代理，它是如何工作的?, [https://readmedium.com/what\-is\-an\-llm\-agent\-and\-how\-does\-it\-work\-1d4d9e4381ca](https://readmedium.com/what-is-an-llm-agent-and-how-does-it-work-1d4d9e4381ca)

\[13] GAIA排行榜, [https://gaia\-benchmark\-leaderboard.hf.space/](https://gaia-benchmark-leaderboard.hf.space/)

\[14] 2024年构建AI代理的前5大框架, [https://www.analyticsvidhya.com/blog/2024/07/ai\-agent\-frameworks/](https://www.analyticsvidhya.com/blog/2024/07/ai-agent-frameworks/)

\[15] 对2024年最受欢迎的AI代理框架的快速评审（2024年6月\）, [https://readmedium.com/a\-quick\-review\-of\-the\-most\-popular\-ai\-agent\-frameworks\-june\-2024\-ce53c0ef809a](https://readmedium.com/a-quick-review-of-the-most-popular-ai-agent-frameworks-june-2024-ce53c0ef809a)

\[16] 探索LangChain、LangGraph和Crew AI：革新语言模型和团队生产力的工具, [https://readmedium.com/exploring\-langchain\-langgraph\-and\-crew\-ai\-tools\-to\-revolutionize\-language\-models\-and\-team\-71cb80a15e63](https://readmedium.com/exploring-langchain-langgraph-and-crew-ai-tools-to-revolutionize-language-models-and-team-71cb80a15e63)

\[17] 微软Magentic\-One：新的多AI代理框架, [https://readmedium.com/microsoft\-magnetic\-one\-new\-multi\-ai\-agent\-framework\-7fd151b81cd7](https://readmedium.com/microsoft-magnetic-one-new-multi-ai-agent-framework-7fd151b81cd7)

\[18] LangGraph- 使用LangGraph开发LLM驱动的AI代理, [https://www.udemy.com/course/langgraph/?couponCode\=LETSLEARNNOW](https://www.udemy.com/course/langgraph/?couponCode=LETSLEARNNOW)

