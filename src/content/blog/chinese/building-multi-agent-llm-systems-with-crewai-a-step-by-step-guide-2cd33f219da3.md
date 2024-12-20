---
title: "使用 crewAI 构建多代理 LLM 系统：分步指南"
meta_title: "使用 crewAI 构建多代理 LLM 系统：分步指南"
description: "本文介绍了使用crewAI构建多智能体系统的逐步指南。多智能体系统由多个自主智能体组成，能够协作实现共同目标，广泛应用于医疗、金融和交通等领域。crewAI作为一个灵活的框架，支持创建和管理智能体、任务及工具。指南涵盖了安装、项目创建、代理和任务定义等内容，并强调了测试功能的重要性，以确保团队按预期执行。通过示例代码，读者可以理解如何配置和运行多智能体项目。"
date: 2024-12-19T22:13:58Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*YqQv29ycAYb9ponN2PbbUQ.png"
categories: ["Programming", "Autonomous Systems", "Technology/Web"]
author: "Rifx.Online"
tags: ["Multi-Agent", "Systems", "crewAI", "agents", "tasks"]
draft: False

---






> **多智能体简介**

使用 crewAI 的多智能体系统正在改变我们处理复杂决策的方式。通过整合多个人工智能智能体，这些系统实现了自主决策，正在革新医疗、金融和交通等行业。在本博客中，我们将深入探讨多智能体系统的世界，探索其应用、优势以及 crewAI 在这一创新技术中的角色。


> **什么是多智能体系统？**

多智能体系统（MAS）由多个自主智能体组成，这些智能体相互作用和协作以实现共同目标。这些智能体可以是人工智能驱动的、人类的或两者的结合。在 MAS 中，每个智能体独立运作，根据自身的知识和目标做出决策，同时与其他智能体沟通以实现集体目标。


> **人工智能在多智能体系统中的作用**

人工智能（AI）在多智能体系统中发挥着至关重要的作用，使智能体能够从数据中学习、适应新情况并做出明智的决策。AI 智能体可以分析大量数据，识别模式，并提供有助于决策的信息。在 MAS 中，AI 智能体还可以促进智能体之间的沟通和协调，确保无缝协作。


> **多智能体系统的应用**

* 医疗：优化病人护理和资源分配
* 金融：增强风险管理和投资组合优化
* 交通：改善交通管理和物流


> **多智能体系统的优势**

* 增强决策能力：利用多个智能体的集体智慧
* 提高效率：自动化任务和优化资源分配
* 改善适应性：应对变化的环境和场景

## CrewAI在多AI代理系统中的作用

> **什么是CrewAI？**

尖端框架，用于协调角色扮演、自主AI代理。通过促进协作智能，CrewAI使代理能够无缝合作，解决复杂任务。

> **安装crewAI**

本指南将引导您完成crewAI及其依赖项的安装过程。crewAI是一个灵活且强大的AI框架，使您能够高效地创建和管理AI代理、工具和任务。让我们开始吧！

要安装crewAI，您需要在系统上安装Python >=3.10和 <=3.13：

```python
## Install the main crewAI package
pip install crewai

## Install the main crewAI package and the tools package
## that includes a series of helpful tools for your agents
pip install 'crewai[tools]'

## Alternatively, you can also use:
pip install crewai crewai-tools
```

> 创建新项目

```python
$ crewai create crew <project_name>
```
此命令将创建一个新的项目文件夹，结构如下：

```python
my_project/
├── .gitignore
├── pyproject.toml
├── README.md
└── src/
    └── my_project/
        ├── __init__.py
        ├── main.py
        ├── crew.py
        ├── tools/
        │   ├── custom_tool.py
        │   └── __init__.py
        └── config/
            ├── agents.yaml
            └── tasks.yaml
```

> **自定义您的项目**

要自定义您的项目，您可以： — 修改`src/my_project/config/agents.yaml`以定义您的代理。 \- 修改`src/my_project/config/tasks.yaml`以定义您的任务。 \- 修改`src/my_project/crew.py`以添加您自己的逻辑、工具和特定参数。 \- 修改`src/my_project/main.py`以添加代理和任务的自定义输入。 \- 将您的环境变量添加到`.env`文件中。

> **示例：定义代理和任务**

### agents.yaml


```python
researcher:
  role: >
    职位候选人研究员
  goal: >
    寻找潜在的职位候选人
  backstory: >
    你擅长通过各种在线资源寻找合适的候选人。你识别合适候选人的能力确保了职位的最佳匹配。
```

### tasks.yaml


```python
research_candidates_task:
  description: >
    进行全面研究，以寻找指定职位的潜在候选人。
    利用各种在线资源和数据库，收集潜在候选人的综合名单。
    确保候选人符合提供的职位要求。

    职位要求:
    {job_requirements}
  expected_output: >
    一份包含10名潜在候选人的名单，附有他们的联系信息和简要个人简介，突出他们的适合性。
  agent: researcher # THIS NEEDS TO MATCH THE AGENT NAME IN THE AGENTS.YAML FILE AND THE AGENT DEFINED IN THE crew.py FILE
  context: # THESE NEED TO MATCH THE TASK NAMES DEFINED ABOVE AND THE TASKS.YAML FILE AND THE TASK DEFINED IN THE crew.py FILE
    - researcher
```

> **Referencing Variables**

### agents.yaml


```python
email_summarizer:
    role: >
      邮件摘要生成器
    goal: >
      将邮件总结成简洁明了的摘要
    backstory: >
      您将创建一份包含5个要点的报告摘要
    llm: mixtal_llm
```

### tasks.yaml


```python
email_summarizer_task:
    description: >
      将电子邮件总结为5个要点
    expected_output: >
      电子邮件的5个要点总结
    agent: email_summarizer
    context:
      - reporting_task
      - research_task
```
在 `crew.py` 文件中使用注释正确引用代理和任务。


> **注释**

* `@agent`
* `@task`
* `@crew`
* `@tool`
* `@callback`
* `@output_json`
* `@output_pydantic`
* `@cache_handler`


```python
## ...
@agent
def email_summarizer(self) -> Agent:
    return Agent(
        config=self.agents_config["email_summarizer"],
    )

@task
def email_summarizer_task(self) -> Task:
    return Task(
        config=self.tasks_config["email_summarizer_task"],
    )
## ...
```

> **变量插值**

在 `agents.yaml` 和 `tasks.yaml` 文件中插值的任何变量，例如 `{variable}`，将在 `main.py` 文件中替换为变量的值。

### tasks.yaml


```python
research_task:
  description: >
    Conduct a thorough research about the customer and competitors in the context
    of {customer_domain}.
    Make sure you find any interesting and relevant information given the
    current year is 2024.
  expected_output: >
    A complete report on the customer and their customers and competitors,
    including their demographics, preferences, market positioning and audience engagement.
```

```python
## main.py
def run():
    inputs = {
        "customer_domain": "crewai.com"
    }
    MyProjectCrew(inputs).crew().kickoff(inputs=inputs)
```

> **运行您的项目**

要运行您的项目，请使用以下命令：


```python
$ crewai run
```

> **crewAI 的 5 个重要组成部分**

* 代理
* 任务
* 工具
* 流程
* 团队


> **什么是代理？**

代理是一个 **自主单元**，其程序设计为：

* 执行任务
* 做出决策
* 与其他代理沟通

可以将代理视为团队的一员，拥有特定的技能和特定的工作。代理可以有不同的角色，如“研究员”、“撰稿人”或“客户支持”，每个角色都为团队的整体目标做出贡献。

BaseAgent 包括与您的团队集成以运行和委派任务所需的属性和方法。

CrewAI 是一个通用的多代理框架，允许所有代理协同工作以自动化任务和解决问题。


> **什么是任务？**

在 crewAI 框架中，任务是由代理完成的特定分配。它们提供执行所需的所有详细信息，例如描述、负责的代理、所需工具等，便于处理各种复杂的操作。

crewAI 内的任务可以是协作性的，要求多个代理共同工作。这通过任务属性进行管理，并由团队的流程进行协调，从而增强团队合作和效率。


> **什么是工具？**

在 CrewAI 中，工具是代理可以利用以执行各种操作的技能或功能。这包括来自 [crewAI 工具包](https://github.com/joaomdmoura/crewai-tools) 和 [LangChain 工具](https://python.langchain.com/docs/integrations/tools) 的工具，使得从简单搜索到复杂交互和有效团队合作成为可能。


> **什么是流程？**

在 CrewAI 中，流程协调代理执行任务，类似于人类团队中的项目管理。这些流程确保任务有效分配和执行，并与预定义的策略保持一致。

* **顺序**：顺序执行任务，确保任务按顺序完成。
* **层级**：以管理层级组织任务，根据结构化的指挥链分配和执行任务。必须在团队中指定管理语言模型（`manager_llm`）或自定义管理代理（`manager_agent`），以启用层级流程，方便管理者创建和管理任务。
* **共识流程（计划）**：旨在促进代理之间对任务执行的协作决策，这种流程类型引入了一种民主的任务管理方法。它计划在未来开发，目前尚未在代码库中实现。


> **什么是团队？**

在 crewAI 中，团队代表一个协作的代理组，共同努力实现一系列任务。每个团队定义了任务执行、代理协作和整体工作流程的策略。


> **测试**

测试是开发过程中的关键部分，确保您的团队按预期执行至关重要。使用 crewAI，您可以轻松测试您的团队并评估其性能，使用内置的测试功能。

我们添加了 CLI 命令 `crewai test`，使您可以轻松测试您的团队。该命令将运行您的团队指定的迭代次数并提供详细的性能指标。参数 `n_iterations` 和 `model` 是可选的，默认值分别为 2 和 `gpt-4o-mini`。目前，唯一可用的提供者是 OpenAI。


```python
crewai test
```
如果您想运行更多迭代或使用不同的模型，可以像这样指定参数：


```python
crewai test --n_iterations 5 --model gpt-4o
```
或使用简短形式


```python
crewai test -n 5 -m gpt-4o
```
当您运行 `crewai test` 命令时，团队将执行指定的迭代次数，并在运行结束时显示性能指标。

最后的分数表将显示团队在以下指标方面的表现：


```python
                                                     Tasks Scores
                                                (1-10 Higher is better)
┏━━━━━━━━━━━━━━━━━━━━┯━━━━━━━┯━━━━━━━┯━━━━━━━━━━━━┯━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┯━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Tasks/Crew/Agents  │ Run 1 │ Run 2 │ Avg. Total │ Agents                         │                                 ┃
┠────────────────────┼───────┼───────┼────────────┼────────────────────────────────┼─────────────────────────────────┨
┃ Task 1             │  9.0  │  9.5  │    9.2     │ - Professional Insights        │                                 ┃
┃                    │       │       │            │ Researcher                     │                                 ┃
┃                    │       │       │            │                                │                                 ┃
┃ Task 2             │  9.0  │ 10.0  │    9.5     │ - Company Profile Investigator │                                 ┃
┃                    │       │       │            │                                │                                 ┃
┃ Task 3             │  9.0  │  9.0  │    9.0     │ - Automation Insights          │                                 ┃
┃                    │       │       │            │ Specialist                     │                                 ┃
┃                    │       │       │            │                                │                                 ┃
┃ Task 4             │  9.0  │  9.0  │    9.0     │ - Final Report Compiler        │                                 ┃
┃                    │       │       │            │                                │ - Automation Insights           ┃
┃                    │       │       │            │                                │ Specialist                      ┃
┃ Crew               │ 9.00  │ 9.38  │    9.2     │                                │                                 ┃
┃ Execution Time (s) │  126  │  145  │    135     │                                │                                 ┃
┗━━━━━━━━━━━━━━━━━━━━┷━━━━━━━┷━━━━━━━┷━━━━━━━━━━━━┷━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┷━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```
是时候编码了 !!!!!!!!!


> **crewai\-sequential\-quickstart**

简化和经过测试的模板，**顺序** CrewAI 团队执行 **网络搜索**（SerperDevTool）。

要求：在安装 colab\-xterm 后，在终端中使用这些命令，加载 2 个终端，首先在第一个终端运行前两个命令，然后在另一个终端运行第三个命令 1\.curl [https://ollama.ai/install.sh](https://www.google.com/url?q=https%3A%2F%2Follama.ai%2Finstall.sh) \| sh 2\.ollama pull llama3 3\.ollama server

* Serper API 密钥：[https://serper.dev/](https://www.google.com/url?q=https%3A%2F%2Fserper.dev%2F)

如果您不熟悉 ollama，请参考以下链接








```python
!pip install colab-xterm
```

```python
%load_ext colabxterm
```

```python
%xterm
```

```python
!pip install langchain
!pip install crewai
!pip install duckduckgo-search
!pip install crewai_tools
```

> **通过运行此单元输入 Serper API 密钥**


```python
## @title 🔑 输入 **Serper** API 密钥
import os
from crewai_tools import SerperDevTool
from getpass import getpass
## 实例化工具

## 通过提示用户输入密钥来设置 SERPER_API_KEY 环境变量
## 使用 Serper 搜索工具（https://serper.dev）需要 Serper API 密钥
os.environ["SERPER_API_KEY"] = getpass("Enter SERPER_API_KEY: ")
search_tool = SerperDevTool()
```

> **您可以使用此链接创建 serper api 密钥**


> **我们创建了研究员和撰稿人团队，其中包括**


> **1 名研究员，1 名撰稿人，2 个任务，1 个用于完整分析报告以要点形式呈现，1 个用于至少 4 段的完整博客文章**


```python
import os
from crewai import Agent, Task, Crew, Process
from crewai_tools import  tool
from langchain_community.chat_models import ChatOllama
## from langchain_groq import ChatGroq
local_llm = "llama3:latest"

llm = ChatOllama(model=local_llm, temperature=0)
## llm = ChatGroq(groq_api_key = os.getenv('GROQ_API_KEY'),model = 'mixtral-8x7b-32768')
## llm = LlamaAPI(model="llama-70b-chat",api_key=os.environ["LLAMA_API_Key"])
from langchain_community.tools import DuckDuckGoSearchRun

@tool('DuckDuckGoSearch')
def search(search_query: str) -> str:
    """search the web for information on a given topic."""
    return DuckDuckGoSearchRun().run(search_query)

## search_tool = DuckDuckGoSearchRun()
## 定义您的代理及其角色和目标
researcher = Agent(
  role='Senior Research Analyst',
  goal='Uncover cutting-edge developments in AI and data science',
  backstory="""You work at a leading tech think tank.
  Your expertise lies in identifying emerging trends.
  You have a knack for dissecting complex data and presenting actionable insights.""",
  verbose=True,
  allow_delegation=False,
  tools=[search],
  llm=llm

)
writer = Agent(
  role='Tech Content Strategist',
  goal='Craft compelling content on tech advancements',
  backstory="""You are a renowned Content Strategist, known for your insightful and engaging articles.
  You transform complex concepts into compelling narratives.""",
  verbose=True,
  allow_delegation=True,
  llm=llm
)

## 为您的代理创建任务
task1 = Task(
  description="""Conduc t a comprehensive analysis of the latest advancements in AI in2024.
  Identify key trends, breakthrough technologies, and potential industry impacts.""",
  expected_output="Full analysis report in bullet points",
  agent=researcher
)

task2 = Task(
  description="""Using the insights provided, develop an engaging blog
  post that highlights the most significant AI advancements.
  Your post should be informative yet accessible, catering to a tech-savvy audience.
  Make it sound cool, avoid complex words so it doesn't sound like AI.""",
  expected_output="Full blog post of at least 4 paragraphs",
  agent=writer
)

## 用顺序流程实例化您的团队
crew = Crew(
  agents=[researcher, writer],
  tasks=[task1, task2],
  verbose=2, # 您可以将其设置为 1 或 2，以获得不同的日志级别
)

## 让您的团队开始工作！
result = crew.kickoff()

print("######################")
print(result)
```
*当我们开始运行上面的单元时，下面是显示的详细信息，您可以看到所有 crewAI 代理执行的操作*

```python
[DEBUG]: == Working Agent: Senior Research Analyst
 [INFO]: == Starting Task: Conduct a comprehensive analysis of the latest advancements in AI in 2024.
  Identify key trends, breakthrough technologies, and potential industry impacts.


> Entering new CrewAgentExecutor chain...
Thought: I should start by searching for recent advancements in AI.

Action: DuckDuckGoSearch

Action Input: {"q": "latest advancements in AI 2024 

I encountered an error while trying to use the tool. This was the error: search() got an unexpected keyword argument 'q'.
 Tool DuckDuckGoSearch accepts these inputs: DuckDuckGoSearch(search_query: 'string') - search the web for information on a given topic.

I apologize for the mistake earlier! Let's start fresh.

Thought: I should search for recent advancements in AI.
Action: DuckDuckGoSearch
Action Input: {"search_query": "latest advancements in AI 2024 

In 2024, generative AI might actually become useful for the regular, non-tech person, and we are going to see more people tinkering with a million little AI models. State-of-the-art AI models ... Here are some important current AI trends to look out for in the coming year. Reality check: more realistic expectations. Multimodal AI. Small (er) language models and open source advancements. GPU shortages and cloud costs. Model optimization is getting more accessible. Customized local models and data pipelines. This year's trends reflect a deepening sophistication and caution in AI development and deployment strategies, with an eye to ethics, safety and the evolving regulatory landscape. Here are the top 10 AI and machine learning trends to prepare for in 2024. 1. Multimodal AI. Multimodal AI goes beyond traditional single-mode data processing to ... The Top 5 Artificial Intelligence (AI) Trends For 2024. Adobe Stock. It's been a year since OpenAI released ChatGPT, opening the door to seamlessly weave AI into the fabric of our daily lives ... Here's how it works. AI in 2024 — the biggest new products and advancements on the way. While 2023 was the year of AI, 2024 will be the year we use it. We have just come to the end of a year ...

Thought: I now know the final answer
Final Answer:

**综合分析报告：2024年人工智能最新进展**

• **生成式AI**：预计将变得更加易于获得，并对非技术人员更有用，随着小型语言模型和开源进展的增加，采用率将上升。
• **多模态AI**：一种超越传统单一模式数据处理的趋势，使多个数据源和模态的集成成为可能。
• **模型优化**：变得越来越易于获取，允许定制本地模型和数据管道。
• **定制本地模型**：预计将获得更多关注，组织寻求为特定用例开发量身定制的AI解决方案。
• **GPU短缺和云成本**：一个将继续影响AI项目开发和部署的挑战。
• **现实检查：更现实的期望**：随着AI的采用增加，需要对AI能够实现的目标有更现实的期望，强调伦理、安全和合规性。
• **2024年人工智能和机器学习的十大趋势**：
 1. 多模态AI
 2. 小型（更小的）语言模型
 3. 开源进展
 4. 模型优化变得更加易于获取
 5. 定制本地模型和数据管道
 6. GPU短缺和云成本
 7. 伦理、安全和合规性
 8. 2024年的AI：即将推出的最大的新产品和进展
 9. 类似ChatGPT的应用将变得更加主流
 10. AI驱动的虚拟助手将继续演变

**关键要点**

• AI正变得越来越易于获得，并对非技术人员更有用。
• 多模态AI、模型优化和定制本地模型是2024年的关键趋势。
• 对伦理、安全和合规性的关注将继续增长。
• AI驱动的虚拟助手将继续演变。

这份综合分析报告提供了2024年人工智能最新进展的概述，突出显示了关键趋势、突破性技术和潜在行业影响。

> Finished chain.
 [DEBUG]: == [Senior Research Analyst] Task output: **综合分析报告：2024年人工智能最新进展**

• **生成式AI**：预计将变得更加易于获得，并对非技术人员更有用，随着小型语言模型和开源进展的增加，采用率将上升。
• **多模态AI**：一种超越传统单一模式数据处理的趋势，使多个数据源和模态的集成成为可能。
• **模型优化**：变得越来越易于获取，允许定制本地模型和数据管道。
• **定制本地模型**：预计将获得更多关注，组织寻求为特定用例开发量身定制的AI解决方案。
• **GPU短缺和云成本**：一个将继续影响AI项目开发和部署的挑战。
• **现实检查：更现实的期望**：随着AI的采用增加，需要对AI能够实现的目标有更现实的期望，强调伦理、安全和合规性。
• **2024年人工智能和机器学习的十大趋势**：
 1. 多模态AI
 2. 小型（更小的）语言模型
 3. 开源进展
 4. 模型优化变得更加易于获取
 5. 定制本地模型和数据管道
 6. GPU短缺和云成本
 7. 伦理、安全和合规性
 8. 2024年的AI：即将推出的最大的新产品和进展
 9. 类似ChatGPT的应用将变得更加主流
 10. AI驱动的虚拟助手将继续演变

**关键要点**

• AI正变得越来越易于获得，并对非技术人员更有用。
• 多模态AI、模型优化和定制本地模型是2024年的关键趋势。
• 对伦理、安全和合规性的关注将继续增长。
• AI驱动的虚拟助手将继续演变。

这份综合分析报告提供了2024年人工智能最新进展的概述，突出显示了关键趋势、突破性技术和潜在行业影响。


 [DEBUG]: == Working Agent: Tech Content Strategist
 [INFO]: == Starting Task: Using the insights provided, develop an engaging blog
  post that highlights the most significant AI advancements.
  Your post should be informative yet accessible, catering to a tech-savvy audience.
  Make it sound cool, avoid complex words so it doesn't sound like AI.


> Entering new CrewAgentExecutor chain...
Action: Delegate work to co-worker

Action Input: {
    "task": "Research AI advancements",
    "context": "综合分析报告：2024年人工智能最新进展",
    "coworker": "Senior Research Analyst 


Error executing tool. Co-worker mentioned not found, it must to be one of the following options:
- senior research analyst


I apologize for the mistake. Since I can only delegate work to a Senior Research Analyst, I will reattempt the action.

Thought:
Action: Delegate work to co-worker
Action Input: {
    "task": "Research AI advancements",
    "context": "综合分析报告：2024年人工智能最新进展",
    "coworker": "Senior Research Analyst 

I tried reusing the same input, I must stop using this action input. I'll try something else instead.



Thought:
Action: Delegate work to co-worker
Action Input: { "task": "Research AI advancements", "context": "综合分析报告：2024年人工智能最新进展", "coworker": "Senior Research Analyst" 

I tried reusing the same input, I must stop using this action input. I'll try something else instead.



Here's my attempt at crafting a compelling blog post on the latest AI advancements:

**人工智能的未来：趋势与突破**

随着我们步入2024年，人工智能（AI）的世界正处于显著增长和创新的前沿。在本文中，我们将深入探讨塑造人工智能未来的最新趋势和突破。

**生成式AI：小型语言模型的崛起**

人工智能中最令人兴奋的发展之一是生成式AI的崛起，特别是小型语言模型。这些模型在近年来取得了巨大的进展，使非技术人员能够利用AI的力量进行各种应用。随着采用率的增加和开源进展的推进，我们可以期待在来年看到更多创新的生成式AI应用。

**多模态AI：数据处理的未来**

另一个正在获得关注的趋势是多模态AI，它使多个数据源和模态的集成成为可能。这项突破性技术对医疗、金融和教育等行业具有深远的影响，因为多样化的数据集对明智的决策至关重要。

**模型优化：定制本地模型和数据管道**

随着人工智能的采用增加，对定制本地模型和数据管道的需求也在增长。模型优化变得越来越易于获取，允许组织为特定用例开发量身定制的AI解决方案。这一趋势将继续塑造人工智能的未来，使更准确的预测和更好的决策成为可能。

**GPU短缺和云成本：面临的挑战**

尽管围绕人工智能进展的兴奋情绪不断上升，但仍然存在需要解决的挑战。GPU短缺和云成本仍然是开发者和希望部署AI项目的组织面临的重要障碍。随着我们向前推进，找到创新的解决方案来应对这些问题并确保AI对所有人都保持可及性至关重要。

**人工智能的未来：趋势与突破**

总之，人工智能的未来是光明的，生成式AI、多模态AI、模型优化等趋势以及更多突破正在逼近。随着我们应对未来的挑战，保持对人工智能最新发展的了解及其潜在应用至关重要。

**最终答案：**
最终答案是一篇博文，强调了人工智能的最新趋势和突破，包括生成式AI、多模态AI、模型优化等。该博文旨在教育读者关于人工智能的未来及其在各个行业的潜在应用。

请告诉我这是否符合您的要求！

> Finished chain.
 [DEBUG]: == [Tech Content Strategist] Task output: **
最终答案是一篇博文，强调了人工智能的最新趋势和突破，包括生成式AI、多模态AI、模型优化等。该博文旨在教育读者关于人工智能的未来及其在各个行业的潜在应用。

请告诉我这是否符合您的要求！


######################
**
最终答案是一篇博文，强调了人工智能的最新趋势和突破，包括生成式AI、多模态AI、模型优化等。该博文旨在教育读者关于人工智能的未来及其在各个行业的潜在应用。

请告诉我这是否符合您的要求！
```

> 如果您想查看完整的视频系列“使用 crewAI 构建多智能体 LLM 系统”，请查看以下链接

*通过这个，您将理解“使用 crewAI 构建多智能体 LLM 系统”….*

*祝您学习愉快 !!!!!!!!!!*

*请随时提出建议或评论，以便更好地教学..*

