---
title: "2025:人工智能代理年--利用 CrewAi 和 Gemini 1.5 构建多代理系统"
meta_title: "2025:人工智能代理年--利用 CrewAi 和 Gemini 1.5 构建多代理系统"
description: "2025年被预测为自主人工智能的关键年份，标志着高度自主系统的兴起。本文介绍了一个基于CrewAi和Gemini 1.5构建的多智能体系统，能够根据用户输入的主题生成博客文章和LinkedIn帖子。该系统依赖三个代理：主题研究者、博客撰写者和LinkedIn帖子创建者，展示了代理AI在内容创作中的潜力。尽管面临整合、研究和内容质量控制等挑战，该系统的成功实施预示着未来AI技术在各行业的广泛应用。"
date: 2025-01-09T01:54:33Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*kCQEo_XteDxjn_yypzi_zA.jpeg"
categories: ["Autonomous Systems", "Programming", "Generative AI"]
author: "Rifx.Online"
tags: ["agentic", "autonomous", "multi-agent", "Gemini", "CrewAi"]
draft: False

---





正如许多专家预测的那样，2025年将成为自主人工智能的年份。这个新兴领域有望通过引入高度自主的系统来重新定义我们与技术的互动，这些系统能够在最小的人类干预下做出决策并执行复杂任务。受到这一理念的启发，我开始构建一个多智能体系统，该系统不仅执行特定任务，还能根据用户定义的主题创建有意义的内容。

在这篇文章中，我将带您了解我构建的系统、我面临的挑战，以及自主人工智能所蕴含的激动人心的未来。

## 什么是代理AI？

代理AI是指旨在独立执行任务而无需持续人类监督的系统。与传统AI不同，传统AI在每一步都需要明确的指令，而代理AI能够自主做出决策，并根据变化的情况调整其行动。

到2025年，我们预计这些系统将成为从医疗保健到物流等各个行业的核心，能够处理从自动化重复任务到自主解决复杂问题的各种事务。事实上，许多预测显示，超过60%的企业AI实施将以某种形式整合代理AI。

## 我多智能体系统背后的愿景

随着代理人工智能的前景日益明朗，我决定构建一个简单的多智能体系统，以展示其在内容创作和摘要方面的潜力。我构建的系统接受用户输入的主题，进行相关的网络研究，并生成两个输出：一篇深入的博客文章和一篇简洁的LinkedIn帖子。

该项目依赖于强大的**Gemini 1.5 model**，这是一个强大的AI语言模型，在生成内容中发挥着关键作用。Gemini 1.5提供了令人印象深刻的文本生成能力，确保输出既连贯又引人入胜，以及**CrewAi，**一个旨在构建和管理AI驱动的多智能体系统的平台。它允许您通过定义具有特定角色和任务的智能体来创建复杂的工作流程，然后协调它们无缝协作。

## 系统如何工作

我构建的多代理系统利用了**三个主要代理**：

1. **主题研究者**：该代理负责从网络上搜索和分析与给定主题相关的资源。它使用互联网搜索工具来识别该主题上最相关和信息丰富的文章。
2. **博客撰写者**：第二个代理将研究结果用于撰写全面的博客文章。博客文章包括引言、逐步指南和结论，以便为读者提供对主题的完整理解。
3. **LinkedIn帖子创建者**：第三个代理将信息总结成简洁且引人入胜的LinkedIn帖子。该代理专注于撰写与专业人士产生共鸣的信息，包括相关的标签以提升可见性。

## 代码块和说明

以下是系统的关键组件，包括代码块和说明。

### 1\. 导入库和初始化环境

第一步是加载环境变量，例如我们使用的工具的API密钥：

```python
import os
from dotenv import load_dotenv
from crewai import Agent, Crew, Process, Task
from crewai_tools import SerperDevTool
import os
from crewai import LLM
from dotenv import load_dotenv

## Load environment variables from a .env file
load_dotenv()
## Set the API key for the SerperDevTool (web search tool)
os.environ['SERPER_API_KEY'] = os.getenv('SERPER_API_KEY')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
```
在这里，我们从`.env`文件中加载API密钥，以保持其安全，并且不直接在脚本中硬编码。

### 2\. 设置 AI 工具

接下来，我们初始化 Gemini 1\.5 模型和网络搜索工具 (SerperDevTool)：

```python
## Initialize the tool for internet searching capabilities
tool = SerperDevTool()
llm = LLM(
    model="gemini/gemini-1.5-flash",  # Specify the AI model to use
    temperature=0.7  # Set the creativity of the model
)
```
在这里，我们设置 `SerperDevTool` 以执行网络搜索，并使用 `Gemini 1.5` 模型生成内容。`temperature` 控制响应的创造性或确定性。

### 3\. 定义代理

我们定义了三个协同工作以实现目标的代理：**主题研究员**、**博客撰写者**和**LinkedIn帖子创建者**。

```python
## Define the Topic Researcher agent
topic_researcher = Agent(
    role='Topic Researcher',
    goal='Search for only 1 relevant resource on the topic {topic} from the web',
    verbose=True,
    memory=True,
    backstory='Expert in finding and analyzing relevant content from Web...',
    tools=[tool],
    llm=llm,
    allow_delegation=True
)
```

```python
## Define the Blog writer agent
blog_writer = Agent(
    role='Blog Writer',
    goal='Write a comprehensive blog post from the only 1 article  provided by the Topic Researcher, covering all necessary sections',
    verbose=True,
    memory=True,
    backstory='Experienced in creating in-depth, well-structured blog posts that explain technical concepts clearly and engage readers from introduction to conclusion.',
    tools=[tool],
    llm=llm,
    allow_delegation=True

)
```

```python
## Define the linkedin post writer agent

linkedin_post_agent = Agent(
    role='LinkedIn Post Creator',
    goal='Create a concise LinkedIn post summary from the transcription provided by the Topic Researcher.',
    verbose=True,
    memory=True,
    backstory='Expert in crafting engaging LinkedIn posts that summarize complex topics and include trending hashtags for maximum visibility.',
    tools=[tool],
    llm=llm,
    allow_delegation=True

)
```
每个代理都具有特定的角色和目标。例如，`主题研究员`代理负责在网络上寻找相关的文章。

### 4\. 为每个代理定义任务

一旦代理设置完成，我们就定义每个代理将执行的任务。例如，`Topic Researcher` 的任务是识别相关内容：


```python
## Define Tasks
research_task = Task(
    description="Identify and analyze only 1 content or  article on the {topic} from the web.",
    expected_output="A complete word-by-word report on the most relevant post or article found on the topic {topic}.",
    agent=topic_researcher,
    tools=[tool]
)

blog_writing_task = Task(
    description="""Write a comprehensive blog post based on the 1 article  provided by the Topic Researcher.
                   The article must include an introduction, step-by-step guides, and conclusion.
                   The overall content must be about 400 words long.""",
    expected_output="A markdown-formatted blog post",
    agent=blog_writer,
    tools=[tool],
    output_file='./artifacts/blog-post.md'
)

linkedin_post_task = Task(
    description="Create a LinkedIn post summarizing the key points from the transcription provided by the Topic Researcher, including relevant hashtags.",
    expected_output="A markdown-formatted LinkedIn post",
    agent=linkedin_post_agent,
    tools=[tool],
    output_file='./artifacts/linkedin-post.md'
)
```
在这种情况下，任务包括搜索和分析特定主题上的相关文章，并创建博客和LinkedIn帖子。

### 5\. 运行流程

一旦代理和任务设置完成，我们创建**Crew**并启动流程：

```python
## Create the Crew with defined agents and tasks
my_crew = Crew(
    agents=[topic_researcher, linkedin_post_agent, blog_writer],
    tasks=[research_task, linkedin_post_task, blog_writing_task],
    verbose=True,
    process=Process.sequential  # Run tasks sequentially
)
## Input Topic
topic_of_interest = 'gemini 2.0 multimodel'
## Kick off the process with the provided topic
result = my_crew.kickoff(inputs={'topic': topic_of_interest})
print(result)
```
在这里，代理以**顺序流程**的方式协同工作，确保每个代理依次执行其任务。`kickoff`方法使用提供的`topic_of_interest`启动流程，在这种情况下为"gemini 2\.0 multimodel"。

### 6\. 生成输出

代理将执行各自的任务并生成输出：一篇综合性的博客文章和一篇简洁的LinkedIn帖子。结果将在最后打印。

## Gemini 1\.5 的角色

这个项目最令人兴奋的方面之一是使用 **Gemini 1\.5 模型** 来驱动 AI 代理。Gemini 1\.5 以其先进的自然语言处理能力而闻名，使其能够在广泛的上下文中理解和生成类人文本。无论是进行研究还是撰写内容，Gemini 1\.5 都确保代理能够高效、准确地完成其任务。

## 挑战与经验教训

构建这个多智能体系统并非没有挑战。我遇到的一些主要障碍包括：

1. **整合多个智能体**：确保智能体之间的顺畅沟通至关重要。每个智能体都有特定的角色，但它们需要无缝协作以产生预期的结果。我了解到，清晰且明确的任务管理对系统的效率至关重要。
2. **完善研究智能体**：主题研究者智能体的任务是从网络上寻找相关资源。尽管总体表现良好，但有时会返回与主题不完全相关的文章。微调其搜索参数需要一些反复试验。
3. **内容质量控制**：尽管Gemini 1.5在生成内容方面非常有效，但输出的质量取决于其接收到的输入。确保提供给博客撰写者和LinkedIn帖子创建者智能体的研究资料全面且清晰，以产生连贯且结构良好的最终输出是很重要的。

## 结论

2025年可能会成为自主智能的年份，我们已经看到其潜力的早期迹象。我的多智能体系统只是一个例子，展示了人工智能如何用于自动化复杂任务并生成有意义的输出。随着技术的不断进步，我们可以期待更强大的系统出现，重塑各个行业，使人工智能成为我们日常生活中不可或缺的一部分。

