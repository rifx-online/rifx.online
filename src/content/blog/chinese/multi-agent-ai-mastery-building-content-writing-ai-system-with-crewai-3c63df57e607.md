---
title: "多代理人工智能高手：用 CrewAI 构建内容写作人工智能系统 | 作者：Kshitij Kutumbe | Medium"
meta_title: "多代理人工智能高手：用 CrewAI 构建内容写作人工智能系统 | 作者：Kshitij Kutumbe | Medium"
description: "CrewAI 是一个前沿框架，用于构建多代理 AI 内容写作系统。该系统通过多个角色驱动的代理协作，模拟团队动态。其架构包括工具、任务、代理、团队和流程，支持顺序和分层策略。用户可以通过定义代理和任务，创建自主的内容写作引擎，实现高效的博客撰写和编辑。CrewAI 的灵活性使其能够处理复杂任务，适用于多种应用场景。"
date: 2025-01-03T06:38:15Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*XS4qjVszohrcdTC7"
categories: ["Programming", "Machine Learning", "Chatbots"]
author: "Rifx.Online"
tags: ["multi-agent", "framework", "collaboration", "processes", "roles"]
draft: False

---





在 AI 和语言模型的领域中，多代理系统涉及多个独立的参与者，每个参与者都由语言模型驱动，以结构化的方式进行协作。在本博客中，我们将深入探讨 Crew.AI，这是一个用于构建多代理应用的前沿框架。Crew.AI 使 AI 代理能够承担角色、共享目标，并协同工作，模拟一个协调良好的团队的动态。

## 架构

Crew.AI 的架构是模块化的，由多个关键组件组成，这些组件协同工作，创建一个无缝的多代理系统。以下部分从底层开始描述这些组件，以说明它们如何集成。

**工具：** 工具是代理用于高效执行特定任务的实用程序或设备。示例包括搜索网络、加载文档和阅读文档。Crew.AI 采用 LangChain 构建，允许使用 LangChain 的现有工具或创建自定义工具。

**任务：** 任务是代理需要执行的特定活动。提供多种工具以高效执行这些任务。

**代理：** 代理是 Crew.AI 框架中的核心执行者，每个代理都有特定的角色、背景、目标和记忆。每个 Crew.AI 代理都是一个增强了 ReActSingleInputOutputParser 的 LangChain 代理。该解析器经过特别修改，以支持角色扮演，结合上下文聚焦的绑定停用词，并使用 ConversationSummaryMemory 集成记忆机制以保持上下文。

**团队：** 团队代表一组共同努力以实现特定目标的代理。这些代理以明确定义的方式协作以完成设定的任务。

**流程：** 流程对象表示团队完成任务的工作流程或策略。该框架定义了三种策略（截至撰写时，计划还会有更多）：

* **顺序：** 按定义的顺序执行任务，适合于每个代理执行特定任务并将其传递给下一个代理的管道类型工作。这种策略在示例中用于撰写给定主题的博客。
* **分层：** 以层次结构组织任务，在指挥链中进行委派。这种策略类似于编排者模式，类似于经理将工作分配给各个代理并在完成之前验证结果。下一篇博客将探讨使用此策略的解决方案。
* **协商过程（计划中）：** 一种尚未发布的流行策略，代理通过民主方式合作做出决策。尽管在 Crew.AI 中尚未实现，但其他多代理框架已经采用了这种方法，并将在未来的博客中进行探讨。

有关这些组件及其 API 的详细信息，请参阅 Crew.AI 文档。

现在让我们看看 CrewAI 如何用于为您或您的公司构建一个几乎自主的内容/博客写作引擎：

安装：


```python
!pip install crewai==0.28.8 crewai_tools==0.1.6 langchain_community==0.0.29
```
导入：


```python
from crewai import Agent, Task, Crew
import os
```
LLM 凭证和名称：


```python
os.environ["OPENAI_MODEL_NAME"] = 'gpt-3.5-turbo'
os.environ["OPENAI_API_KEY"]=""
```
定义代理、任务和团队：


```python
planner = Agent(
    role="内容规划师",
    goal="规划关于 {topic} 的引人入胜且事实准确的内容",
    backstory="您正在规划一篇关于主题: {topic} 的博客文章。"
              "您收集有助于受众学习的 "
              "信息，并做出明智的决策。 "
              "您的工作是内容作者撰写该主题文章的基础。",
    allow_delegation=False,
 verbose=True
)

writer = Agent(
    role="内容作者",
    goal="撰写关于主题: {topic} 的深刻且事实准确的 "
         "观点文章",
    backstory="您正在撰写一篇关于主题: {topic} 的新观点文章。 "
              "您根据内容规划师的工作来撰写， "
              "内容规划师提供大纲 "
              "和相关的主题背景。 "
              "您遵循大纲的主要目标和 "
              "方向， "
              "由内容规划师提供。 "
              "您还提供客观和公正的见解 "
              "并用内容规划师提供的信息支持它们。 "
              "您在观点文章中承认 "
              "当您的陈述是观点时 "
              "而不是客观陈述。",
    allow_delegation=False,
    verbose=True
)
editor = Agent(
    role="编辑",
    goal="编辑给定的博客文章以符合 "
         "组织的写作风格。 ",
    backstory="您是一名编辑，从内容作者那里收到一篇博客文章。 "
              "您的目标是审核博客文章 "
              "以确保其遵循新闻最佳实践，"
              "在提供观点或主张时 "
              "提供平衡的观点， "
              "并尽可能避免重大争议话题 "
              "或意见。",
    allow_delegation=False,
    verbose=True
)

plan = Task(
    description=(
        "1. 优先考虑关于 {topic} 的最新趋势、关键参与者和 "
            "值得注意的新闻。\n"
        "2. 确定目标受众，考虑 "
            "他们的兴趣和痛点。\n"
        "3. 制定详细的内容大纲，包括 "
            "引言、要点和号召行动。\n"
        "4. 包括 SEO 关键词和相关数据或来源。"
    ),
    expected_output="一份全面的内容计划文档 "
        "包含大纲、受众分析、 "
        "SEO 关键词和资源。",
    agent=planner,
)

write = Task(
    description=(
        "1. 使用内容计划撰写一篇引人注目的 "
            "关于 {topic} 的博客文章。\n"
        "2. 自然地融入 SEO 关键词。\n"
  "3. 各部分/小标题应以引人入胜的方式正确命名。\n"
        "4. 确保文章结构合理， "
            "包括引人入胜的引言、深刻的主体、 "
            "和总结性的结论。\n"
        "5. 校对语法错误和 "
            "与品牌声音的一致性。\n"
    ),
    expected_output="一篇格式良好的博客文章 "
        "以 markdown 格式准备发布， "
        "每个部分应有 2 或 3 段。",
    agent=writer,
)

edit = Task(
    description=("校对给定的博客文章，检查 "
                 "语法错误和 "
                 "与品牌声音的一致性。"),
    expected_output="一篇格式良好的博客文章，"
                    "以 markdown 格式准备发布，"
                    "每个部分应有 2 或 3 段。",
    agent=editor
)

crew = Crew(
    agents=[planner, writer, editor],
    tasks=[plan, write, edit],
    verbose=2
)

```
提取输出：


```python
result = crew.kickoff(inputs={"topic": "人工智能？"})
```
这就是输出博客的样子：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*xokrHoAVZCHIuKH2HOi9FA.png)

这只是使用 CrewAI 或 Autogen 或其他此类框架可以构建的许多应用程序之一。您还可以让它执行更复杂的任务，例如在互联网上搜索、收集数据、执行数据分析、提供结论等等。

请查看我的其他博客：

