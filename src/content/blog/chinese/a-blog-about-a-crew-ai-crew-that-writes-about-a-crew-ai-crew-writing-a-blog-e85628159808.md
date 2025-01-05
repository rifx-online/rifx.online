---
title: "关于人工智能船员的博客，写关于人工智能船员的博客 | 作者：Ryan A Ellis | Medium"
meta_title: "关于人工智能船员的博客，写关于人工智能船员的博客 | 作者：Ryan A Ellis | Medium"
description: "本文介绍了如何使用CrewAI框架构建一个多智能体团队，以撰写技术博客。CrewAI允许用户创建自主的AI代理，分配角色和任务，通过定义代理、任务和工具来协同完成目标。项目包括安装CrewAI、定义API密钥、设置代理角色、创建任务及运行团队。最终成果为一篇结构良好的博客文章，展示了CrewAI在内容创作中的应用。"
date: 2025-01-03T06:40:26Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*TkhZA3qfFiAsWoDBQccRtA.jpeg"
categories: ["Programming", "Autonomous Systems", "Generative AI"]
author: "Rifx.Online"
tags: ["CrewAI", "agents", "tasks", "Python", "multi-agent"]
draft: False

---





## 介绍

这篇博客的目的是简要展示我使用 crewAI 框架构建的内容以及使其工作的组件。我想测试一下我从 DeepLearning.AI 的短期课程 [Multi AI Agent Systems with crewAI](https://learn.deeplearning.ai/courses/multi-ai-agent-systems-with-crewai) 中学到的知识。本文将简要解释我使用的 crewAI 组件，以构建我自己的团队来撰写博客。为了演示，该项目是在 jupyter notebook 中用 python 编写的，最后会提供 notebook 的链接。

### 什么是 Crew AI？

CrewAI 是一个用 Python 编写的多智能体框架，允许用户创建自主的 AI 代理，以协同工作来完成一个或多个任务。有关其详细信息和功能，您可以访问他们的网站 [crewai.com](https://www.crewai.com/)。Crew AI 的核心组件可以分为以下几类：

**代理：** CrewAI 中的代理是具有明确角色和目标的自主实体。例如，“研究员”可能负责收集信息，而“撰稿人”则专注于撰写引人入胜的内容。

**任务：** 这些是分配给代理的单独任务。每个任务都有描述和预期输出，以确保清晰和方向明确。

**工具：** 代理使用各种工具来完成任务。这些工具可能包括网页抓取工具、API 集成功能或语言模型。

**流程：** CrewAI 通过流程协调任务执行。这些流程可以是顺序的或层次化的，有效地指导代理完成任务。

### 项目设置

我的目标是利用 crewAI 的模板代码并进行定制，以创建一个能够规划、研究和撰写既具有教育意义又易于理解的技术博客的团队。像代理人一样划分工作，我将项目分为几个部分，并在后续添加细节。最终计划如下：

1. 安装 crewAI
2. 定义工具和密钥
3. 定义代理角色
4. 设置任务
5. 定义并运行你的团队！

现在，让我们开始吧！

### 第一步：安装 Crew AI

要安装 crewAI，您需要在系统上安装 Python \>\=3\.10 和 \<\=3\.13：


```python
%pip install crewai==0.30.11 crewai_tools==0.2.6
```
恭喜！crewAI 现在应该已安装完成！

### 第2步：定义工具和密钥

在处理API密钥时，建议将其存储为*.env*文件中的变量，并将该文件包含在*.gitignore*中，以确保敏感信息保持私密。为了加载这些环境变量，我使用*dotenv*库，如果在您的环境中尚不可用，可能需要进行安装。对于这个项目，我们有两个需要保密的变量：我们的OpenAI密钥和Serper API密钥。以下是我的.env文件的示例，以及我如何将变量导入本地环境。

```python
SERPER_API_KEY = 'Your Key Here'
OPENAI_API_KEY= 'Your Key Here'
OPENAI_MODEL_NAME='gpt-4o' 
```

```python
from dotenv import load_dotenv
## Loading variables from .env file
load_dotenv()
```
加载完我们的API密钥后，我们现在可以初始化AI工具。

```python
from crewai_tools import ScrapeWebsiteTool, SerperDevTool, YoutubeChannelSearchTool, YoutubeVideoSearchTool, CodeDocsSearchTool
codeDocTool = CodeDocsSearchTool()
youtubeChannelTool= YoutubeChannelSearchTool()
youtubeVideoTool = YoutubeVideoSearchTool()
search_tool = SerperDevTool()
scrape_tool = ScrapeWebsiteTool()
```
对于我们选择的大型语言模型，我们选择了gpt\-4o。然而，您并不局限于OpenAI的llm。CrewAI允许您使用多种您选择的模型！想要了解更多内容，请访问crewAI的[文档](https://docs.crewai.com/how-to/LLM-Connections/)。CrewAI的核心组成部分之一是其工具的使用。您可以使用预构建的工具或创建自定义工具。由于不确定AI可能需要的具体工具，我决定为其配备五个预构建的工具：ScrapeWebsiteTool、SerperDevTool、YoutubeChannelSearchTool、YoutubeVideoSearchTool和CodeDocsSearchTool。以下是每个工具的简要描述：

* **ScrapeWebsiteTool：** 通过抓取整个网站来促进全面的数据收集。
* **SerperDevTool：** 实现高效的Google搜索。
* **YoutubeChannelSearchTool：** 一种检索增强生成（RAG）工具，用于在YouTube频道内搜索，适合视频内容分析。
* **YoutubeVideoSearchTool：** 一种RAG工具，旨在在YouTube视频中搜索，适合提取视频数据。
* **CodeDocsSearchTool：** 一种RAG工具，优化用于搜索代码文档和相关技术文档。

### 第3步：定义代理角色

在crewAI中定义代理时，必须为他们分配角色、目标和背景故事。角色和目标应与代理将执行的任务对齐。背景故事增加了个性和背景，使代理更加贴近用户。例如，对于研究代理，我们的目标是确保其摘要简洁明了，以便写作代理能够轻松扩展。请注意，输入的更清晰和简洁的组合将大大影响代理的表现。

```python
##############################################################
## Agent: Planner
#
##############################################################
planner = Agent(
    role="内容规划师",
    goal="规划关于{topic}的引人入胜且事实准确的内容",
    backstory="您正在规划一篇关于主题：{topic}的博客文章。"
              "您收集有助于受众学习和做出明智决策的信息。"
              "您的工作是内容写作者在该主题上撰写文章的基础。",
   allow_delegation=False,
   tools=[scrape_tool, search_tool]
)

##############################################################
## Agent: Researcher
#
##############################################################
researcher = Agent(
    role="技术研究员",
    goal="为写作者找到优秀的信息来源作为起点。",
    tools=[search_tool, scrape_tool,codeDocTool, youtubeChannelTool, youtubeVideoTool],
    backstory=(
        "作为技术研究员，您在导航和提取文档中的关键信息方面的能力无与伦比。"
        "您是阅读代码并将其翻译成通俗英语的专家"    
    )
)
##############################################################
## Agent: Writer
#
##############################################################
writer = Agent(
    role="内容写作者",
    goal="撰写关于主题：{topic}的深入且易于理解的教程",
    backstory="您正在撰写关于主题：{topic}的新教程。"
              "您的写作基于内容规划师的工作，内容规划师提供大纲和相关背景信息。"
              "您遵循大纲的主要目标和方向，"
              "由内容规划师提供。"
              "您还提供客观和公正的见解，并用内容规划师提供的信息进行支持。"
              "您会说明您的来源。",
    allow_delegation=False
)

##############################################################
## Agent: Editor
#
##############################################################
editor = Agent(
    role="编辑",
    goal="编辑给定的博客文章，使其符合组织的写作风格。"
         "确保博客文章是为初学者撰写的",
    backstory="您是一名编辑，收到内容写作者提供的博客文章。"
              "您的目标是审查博客文章，"
              "确保其遵循新闻最佳实践，"
              "在提供观点或主张时提供平衡的观点，"
              "并尽可能避免重大争议话题或观点。",
    allow_delegation=False
)
```
代理可以在代理或任务级别分配单独的工具。当在任务级别分配时，工具的使用优先级更高。默认情况下，委派是启用的，但对于这个特定的设计，我们禁用委派，以使代理专注于特定任务。在其他情况下，启用委派可能有助于使代理与其任务对齐，当任务可能由多个专业代理处理时。

### 第4步：设置任务

请记住，这个团队的目标是撰写一篇博客。我创建了四个任务来实现这个目标：

1. **计划：** 为博客创建一个大纲。
2. **研究：** 收集并分析各种博客来源。
3. **写作：** 使用提供的来源草拟博客。
4. **编辑：** 校对博客并优化搜索引擎优化（SEO）。

每个任务都需要一个描述、预期输出和分配的代理。描述和输出可以包含变量，用{}表示，可以在初始化团队时进行自定义。

```python
################################################################################
## 任务：计划
#
################################################################################
plan = Task(
    description=(
        "1. 选择一个易于复制的任务，主题为：  "
            "{topic}。\n"
        "2. 为对 Python 知识有限的人规划文章。\n"
        "3. 制定详细的内容大纲，包括 "
            "引言、关键点和行动号召。\n"
        "4. 包括 SEO 关键字和相关数据或来源。"
    ),
    expected_output="一份全面的内容计划文档，"
        "包含大纲、受众分析、"
        "SEO 关键字和资源。"
        "应以逐步的方式格式化。",
    agent=planner,
    tools=[search_tool, scrape_tool]
)

################################################################################
## 任务：研究
#
################################################################################
research = Task(
    description=("根据内容规划者的当前计划，确保执行以下操作。\n"
        "1. 确定哪些网站是搜索的最佳选择。针对计划主题 {topic}。\n"
        "2. 制作一个资源摘要，供写作者在撰写文章时参考。"
    ),
    expected_output="一份结构化的资源列表，每个来源都有简要描述。",
    agent=researcher,
    tools=[search_tool, scrape_tool,codeDocTool, youtubeChannelTool, youtubeVideoTool],
    context=[plan]
)

################################################################################
## 任务：写作
#
################################################################################
write = Task(
    description=(
        "1. 根据内容规划者和技术研究者提供的大纲，撰写一篇关于 {topic} 的博客文章。\n"
        "2. 自然地融入 SEO 关键字。\n"
        "3. 各部分/小标题命名应当吸引人。\n"
        "4. 确保文章结构合理，包含 "
            "引人入胜的引言、深刻的正文，"
            "以及总结性的结论。\n"
        "5. 文章应以一种读者可以复制的方式撰写。\n"
        "6. 校对语法错误，并确保与品牌声音一致。\n"
    ),
    expected_output="一篇格式良好的博客文章，"
        "采用 markdown 格式，准备发布，"
        "每个部分应有 2 或 3 段。",
    agent=writer,
    tools=[search_tool, scrape_tool],
    context = [plan,research]
)

################################################################################
## 任务：编辑
#
################################################################################
edit = Task(
    description=("校对给定的博客文章，"
                 "检查语法错误，并确保内容丰富。"),
    expected_output="一篇格式良好的博客文章，采用 markdown 格式，"
                    "准备发布，"
                    "每个部分应有 2 或 3 段。",
    agent=editor,
    context=[plan,research,write],
    output_file="final_article.md" 
)
```
为了确保任务所需的所有资源可用，您可以定义上下文。此上下文是一个任务数组，必须在当前任务执行之前完成。

### 第5步：定义并运行你的团队！

我们快要结束了！现在，我们需要定义团队并启动其运行。对于这个项目，我们使用 crewAI 的顺序流程，按给定顺序执行任务。或者，crewAI 还提供了一个层次流程，其中经理 LLM 将任务分配给代理。我们还为团队启用了记忆功能，允许代理之间进行检索增强生成 (RAG)。有关记忆组件如何工作的更多详细信息，请参阅 crewAI [文档](https://docs.crewai.com/core-concepts/Memory/)。


```python
from crewai import Crew, Process
from langchain_openai import ChatOpenAI

crew = Crew(
    agents=[planner, researcher, writer, editor],
    tasks=[plan, research, write, edit],
    process=Process.sequential,
    verbose=True,
    memory=True    
)
```
现在让我们运行我们的团队！


```python
result = crew.kickoff(inputs={"topic": "Building a Simple blog writing Crew with CrewAI"})
```
当我们运行团队时，我们将给团队提供输入，这些输入将充当我们在任务中使用的变量。输入是一个文本字典，但你可以让这些文本指向你想要的任何内容。例如，你可以让文本值指向 pdf 文件的位置。不过，要使其正常工作，代理还必须配备相应的工具来读取 pdf。

### 结论

在本文中，我演示了如何使用 crewAI 框架创建一个用于撰写博客的团队。您可以在我的 GitHub 上找到我的结果，格式为 markdown，链接 [这里](https://github.com/Codeblockz/CrewAI_Bloger_Demo/blob/main/final_article.md)。

### 额外资源

* [**源文件：**](https://github.com/Codeblockz/CrewAI_Bloger_Demo/blob/main/Research_writer_article.ipynb) 我使用的 Jupyter Notebook。
* [**CrewAI 文档：**](https://docs.crewai.com/) 官方的 crewAI 文档。
* [**使用 crewAI 的多 AI 代理系统：**](https://learn.deeplearning.ai/courses/multi-ai-agent-systems-with-crewai) 由 Deeplearning.AI 提供的短期课程，为我提供了 crewAI 框架的基础概念。

