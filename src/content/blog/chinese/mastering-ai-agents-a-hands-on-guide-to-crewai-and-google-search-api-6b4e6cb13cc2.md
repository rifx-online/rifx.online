---
title: "掌握人工智能代理：CrewAI 和 Google Search API 实用指南"
meta_title: "掌握人工智能代理：CrewAI 和 Google Search API 实用指南"
description: "本文介绍了CrewAI和Google Search API的实用指南，强调了AI代理在任务管理中的应用。CrewAI允许用户创建和协调多个AI代理，分别负责研究和写作任务，提升工作效率。通过实际操作示例，展示了如何设置环境、定义代理及任务，并实现协同工作。文章还探讨了代理性阶段和生成性阶段的协同作用，强调了AI工具在各行业中的潜力，鼓励读者亲自尝试这些技术以提升工作流程。"
date: 2024-11-30T14:17:21Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*eH_-lXmJZNYnvRKBgjfGRg.png"
categories: ["Programming", "Generative AI", "Chatbots"]
author: "Rifx.Online"
tags: ["CrewAI", "Google", "Search", "API", "agents"]
draft: False

---





你知道最近大家都在谈论 AI 代理吗？它们在各个行业层出不穷，承诺改变工作方式。但说实话，试图理解这一切是如何运作的，确实让人感到不知所措。我也曾有过这种感觉——在一片流行词汇、新技术和随之而来的行话中迷失，直到我看到了 CrewAI。亲身体验 CrewAI 让我觉得 AI 代理变得实用而不再令人畏惧。如果你和我一样，是个被 AI 热潮淹没的技术爱好者，我的 CrewAI 体验可能会帮助你穿透噪音。没有企业级的白皮书——只是我经验的实用、接地气的视角。

## CrewAI：AI代理人爱好者的游乐场

想象一下，你有一群超级智能的虚拟助手（AI代理人）。每个助手都经过特定任务的训练，比如研究或写作，他们共同合作完成任务。这就像拥有一支专业团队，他们知道该做什么。现在，想象一下能够组织这些助手，告诉他们谁应该处理什么。这基本上就是CrewAI的功能。可以把它看作是一个AI驱动团队的项目经理，你决定谁来处理哪个任务，而CrewAI确保一切顺利进行（即“编排”——基本上是协调不同的任务，以确保它们能够协调一致）。

以下是它如何工作的简要说明：

1. 你创建这些“代理人”——把它们看作你的AI团队成员。
2. 你为每个代理人分配一个角色、一个目标和一些背景信息。
3. 你为你的代理人定义要处理的任务。
4. CrewAI就像团队领导，确保所有虚拟助手（AI代理人）顺利合作。

这个概念具有良好的扩展性，提供了对更大企业平台在更宏大规模上所能实现的能力的洞察。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*9haJX1l3JuExNNaz)

## 亲自动手…

如我所提到的，我一向认为实践是最好的学习方式。因此，我启动了 Google Colab（这基本上是一个可以运行 Python 代码的在线平台），决定使用 CrewAI 和 Google Search API 创建一个小项目。我的目标？自动化一些基本的研究和写作任务——组织通常每天都会做的事情。

由于之前没有真正做过这个，设置一切是……一次冒险。但一旦我整理好所有的 API 密钥（专业提示：*将这些安全地保存在你的 Colab Secrets 中*），事情就开始变得顺利起来。

为 CrewAI 和 Google Search API 设置环境可能看起来令人生畏，但一旦你知道从哪里开始，其实很简单。你可以在 [这里](https://github.com/larry-deee/CrewAI/blob/main/CrewAI_with_Google_Search.ipynb) 查看完整代码。

**设置 API 密钥**：你显然需要你的 LLM 提供者密钥（如果是本地则不需要），这个过程（以及更多）都有 [详细文档](https://docs.crewai.com/core-concepts/LLMs/)。对于 Google-Search，我需要从我的 [Google 控制台凭据部分](https://console.cloud.google.com/apis/credentials) 获取我的 Google Search API 密钥和 ID，然后将其存储在 Colab Secrets 中。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*yckiBbOmqfSjgziMi_Yc5A.png)

接下来，我需要用相关的包设置我的环境：


```python
!sudo apt-get update
!pip install crewai
!pip install 'crewai[tools]'
!pip install google-api-python-client

```
这解决了所有问题——CrewAI、管理代理的工具，以及设置网络搜索集成的 Google Search API 框架。

以下是处理 API 密钥的快速代码片段：


```python
import os
from google.colab import userdata

os.environ["GOOGLE_API_KEY"] = userdata.get('GOOGLE_API_KEY')
os.environ["GOOGLE_CSE_ID"] = userdata.get('GOOGLE_CSE_ID')
```
在单独的单元中设置主题，以便更易于管理…


```python
## Set the Topic Here
#######
topic = """
Look for the latest Tech and AI trends in 2024.
"""
####
```
接下来的部分可能看起来复杂，但对于集成 Google Search API 来说很重要。完整代码可以在 [这里](https://github.com/larry-deee/CrewAI/blob/main/CrewAI_with_Google_Search.ipynb) 找到：


```python
class GoogleSearchTool:
    def __init__(self, api_key, cse_id):
        # Validate API key and Custom Search Engine ID upon initialization
        if not api_key or not cse_id:
            raise ValueError("API key and CSE ID must be provided")

        # Initialize the Google Custom Search API client
        self.api_key = api_key
        self.cse_id = cse_id
        self.service = build("customsearch", "v1", developerKey=self.api_key)
        self.name = "GoogleSearchTool"
        self.args = {"query": "Search term to find relevant results"}
        self.description = "Performs a Google search and returns relevant results."
```
**研究与内容自动化**：接下来，我创建了两个 CrewAI 代理：一个用于研究，一个用于写作。**GoogleSearchTool** 类是在 ChatGPT 和 Claude 的指导下编写的（嘿，向 AI 朋友寻求帮助没有什么可羞愧的！），使得代理能够通过 API 使用 Google 的自定义搜索。这些代理随后将研究与 AI 写作代理结合起来，生成一个良好的初步书面内容。例如，研究代理会深入最新的 AI 进展，而写作代理会根据这些发现撰写一篇引人入胜的博客/维基风格的文章。相当酷。

以下是定义代理的部分：


```python
## Define your agents
researcher = Agent(
    role='Principal Researcher and Analyst',
    goal=f"Uncover cutting-edge developments in AI and related topics.",
    backstory="""
        You are an experienced and award-winning researcher who excels at 
        finding actionable insights and translating complex data 
        into engaging content.
    """,
    verbose=True,
    allow_delegation=False,
    llm=ChatOpenAI(model_name="gpt-4o", temperature=0.5),
    tools=[google_search_tool, ScrapeWebsiteTool()]
)

writer = Agent(
    role='Tech Content Strategist',
    goal=f"Craft compelling content on AI advancements.",
    backstory="""
      You are a renowned Content Strategist known for 
      translating complex ideas into engaging narratives.
    """,
    verbose=True,
    allow_delegation=True,
    llm=ChatOpenAI(model_name="gpt-4o", temperature=0.7)
)
```
……然后将他们需要完成的工作定义为任务。


```python
## Define tasks
research = Task(
    description="""
      Extract key insights, ideas, and information from AI topics 
      related to technology and self-improvement.
    """,
    expected_output="""
      A concise report on AI and technology, containing key insights 
      and recommendations in bullet points.
    """,
    agent=researcher,
    output_file="researcher_tasks.md"
)

write_blog = Task(
    description="""
    Write an engaging blog post based on the research on AI advancements.
    """,
    expected_output="""
      A full blog post of around 500 words with citations from all the URLs.
    """,
    agent=writer,
    output_file="writer_tasks.md"
)
```
……最后将他们协调为一个“团队”以启动他们：


```python
## Instantiate and kickoff the crew
crew = Crew(
    agents=[researcher, writer],
    tasks=[research, write_blog],
    verbose=True,
    process=Process.sequential  # Use parallel if no dependencies between tasks
)

## Kickoff the crew
result = crew.kickoff()
```
不久之后——我创建了两个 AI 代理。一个是研究者，另一个是写作者。研究者挖掘最新的 AI 趋势，而写作者将这些信息转化为人们可能真正想要阅读的内容（希望如此）。这很简单，也让我（至少对我来说）尝到了“代理编排”和任务完成的工作原理。

完整代码可参考 [这里](https://github.com/larry-deee/CrewAI/blob/main/CrewAI_with_Google_Search.ipynb)。

## 那个灵光一现的时刻

让我感到震撼的是看到这些代理人如何协同工作……以及设置是多么简单。我让他们去研究并撰写关于这个主题的内容，看到他们之间的协调真是太好了，因为 LLM 的响应以文本日志的形式出现。研究代理人会在网上搜寻，提取信息，然后交给写作代理人。写作代理人则将这些事实编织成一篇连贯的文章。

输出虽然不是完美的，但已经足够好了，特别是在短时间的设置后几乎没有调整。然而，看到这一切结合在一起真是太棒了……而且实际上这几乎不需要任何编码技能。

它确实节省了研究和草拟的时间，是的。这也让我有时间去思考其他可以优化的方式。

这种自动化不仅加速了内容创作，还展示了企业和任何人如何简化研究任务，从而提高生产力。

## 为什么这很重要（即使你不是程序员）

现在，我知道你在想什么。“太好了，你玩了一些代码。这怎么能帮助我理解这些功能，更不用说一个企业平台了？”无论你是在个人项目中使用AI代理，还是在企业系统中，核心理念都是一样的，让AI代理在复杂任务上协同工作，以解决现实世界的问题，这将改变游戏规则。

至于我那个小的CrewAI项目？它就像是一个迷你模拟，展示了AI如何承担研究、分析和内容创作——这些任务在几乎每个行业中都是至关重要的。

## 输出

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*8wwLh9k0ieASxR5w9PhRHw.png)

## 代理性和生成性阶段的实践

这些术语我开始听得很多。因此，我的理解是**代理性阶段**提供了**策略和编排**，确保将正确的任务分配给合适的代理，而**生成性阶段**则处理**执行和内容创建**。这两个阶段协同工作，以实现协调良好的输出，展示了自主决策（代理性阶段）与人工智能的创造能力（生成性阶段）的结合。

简单来说，代理性阶段是关于规划和组织任务，而生成性阶段则处理执行和内容创建。它们共同形成一个无缝的过程，确保一切高效完成。

### 这里是一个详细说明：

**定义代理：**

* **ResearchAgent** 和 **Writer Agent** 是根据特定角色和目标创建的。例如，**ResearchAgent** 负责从搜索结果中发现洞察，而 **Writer Agent** 则负责撰写内容。

```python
researcher = ResearchAgent(
    name='Principal Researcher and Analyst',
    role='Researcher',
    goal=f"""Uncover cutting-edge developments in {search_query} and 
          related topics.""",
    backstory="""
        You are an experienced and award-winning researcher who excels 
        at finding actionable insights and 
        translating complex data into engaging content.
    """,
    tools=[google_search_tool, ScrapeWebsiteTool()]
)
```
**任务协调**：

* 任务被分配给代理，CrewAI 管理 **流程**。我认为这是一种 **代理** 关注的方式，因为这是对代理如何协作的高层次编排，确保正确的任务按正确的顺序执行。

```python
crew = Crew(
    agents=[researcher, writer],
    tasks=[research, write_blog],
    verbose=True,
    process=Process.sequential  # 确保研究任务在写作开始之前完成
)
```
**任务定义**：

* 任务的定义，包括其预期输出和描述，反映了 **代理思维**。它为每个代理设定了 **高层次目标** 并定义了它们如何相互互动。

```python
research = Task(
    description=f"""
      Extract key insights, ideas, and information from {search_query}.
    """,
    expected_output=f"""
      A concise report on {search_query}, containing key insights and 
      recommendations in bullet points.
    """,
    agent=researcher,
    output_file="researcher_tasks.md",
    execution_function=researcher_task_execution  # 执行研究者的功能以收集洞察
)
```

### 它们在代码中的协同工作：
Agentic Phase:

* **设置结构：** 它定义了每个代理的角色，概述了任务，并组织了工作流程。
* **决定顺序：** 该过程按顺序进行，以便研究任务在写作任务之前运行（使用 Process.sequential）。

### 生成阶段：

* **执行策略：** 代理从代理阶段获取指令并生成实际内容（研究洞察、博客文章）。
* **创建输出：** 通过 GoogleSearchTool 和写作任务，代理根据研究发现生成最终输出。

**代理阶段** 处理更高层次的决策、协调和任务定义（例如定义代理、任务和流程）。**生成阶段** 负责执行这些决策并生成实际内容（例如搜索、处理洞察和撰写博客文章）。它们共同创建一个无缝的工作流程，其中策略与执行相辅相成。

## 收获

在一个人工智能正在革新各个行业的世界里，像 CrewAI 这样的工具提供了一个易于访问的起点。无论你是否是程序员，尝试这些工具都可以帮助你理解人工智能和人工智能代理的潜力。

我鼓励你尝试像 CrewAI 和 Google Search API 这样的工具，亲身体验人工智能如何改变你的工作流程——无论你是否是程序员。这既有教育意义又很有趣！

保持好奇，科技爱好者们！

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*s-vmVEbzUQaRf4qRCMAO5w.png)

