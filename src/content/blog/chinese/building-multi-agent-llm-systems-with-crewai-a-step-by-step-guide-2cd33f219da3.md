---
title: "使用 crewAI 构建多代理 LLM 系统：分步指南"
meta_title: "使用 crewAI 构建多代理 LLM 系统：分步指南"
description: "本文介绍了使用crewAI构建多智能体系统的逐步指南。多智能体系统（MAS）由多个自主代理组成，能够通过协作实现复杂决策。crewAI框架使得这些代理能够高效合作，优化医疗、金融和交通等领域的任务。文章详细说明了安装crewAI、创建项目、定义代理与任务、运行项目及测试的过程，同时强调了AI在多智能体系统中的关键角色和优势。通过示例代码，读者可以学习如何实现和管理代理，提升决策能力和任务执行效率。"
date: 2024-12-07T12:26:35Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*YqQv29ycAYb9ponN2PbbUQ.png"
categories: ["Autonomous Systems", "Programming", "Technology"]
author: "Rifx.Online"
tags: ["Multi-Agent", "Systems", "crewAI", "Agents", "Tasks"]
draft: False

---






> **多智能体简介**

使用 crewAI 的多智能体系统正在改变我们处理复杂决策的方式。通过整合多个人工智能代理，这些系统实现了自主决策，彻底改变了医疗、金融和交通等行业。在本博客中，我们将深入探讨多智能体系统的世界，探索它们的应用、优势，以及 crewAI 在这一创新技术中的角色。


> **什么是多智能体系统？**

多智能体系统（MAS）由多个自主代理组成，这些代理相互互动和协作以实现共同目标。这些代理可以是人工智能驱动的、人类或两者的组合。在 MAS 中，每个代理独立运作，根据自己的知识和目标做出决策，同时与其他代理进行沟通以实现集体目标。


> **人工智能在多智能体系统中的角色**

人工智能（AI）在多智能体系统中发挥着至关重要的作用，使代理能够从数据中学习、适应新情况并做出明智的决策。AI 代理可以分析大量数据，识别模式，并提供有助于决策的信息。在 MAS 中，AI 代理还可以促进代理之间的沟通和协调，确保无缝协作。


> **多智能体系统的应用**

* 医疗：优化患者护理和资源分配
* 金融：增强风险管理和投资组合优化
* 交通：改善交通管理和物流


> **多智能体系统的优势**

* 增强决策能力：利用多个代理的集体智能
* 提高效率：自动化任务和优化资源分配
* 改善适应性：应对变化的环境和情景

## CrewAI在多AI代理系统中的角色

> **什么是CrewAI？**

前沿框架，用于协调角色扮演的自主AI代理。通过促进协作智能，CrewAI使代理能够无缝合作，解决复杂任务。

> **安装crewAI**

本指南将引导您完成crewAI及其依赖项的安装过程。crewAI是一个灵活而强大的AI框架，使您能够高效地创建和管理AI代理、工具和任务。让我们开始吧！

要安装crewAI，您需要在系统上安装Python \>\=3\.10和\<\=3\.13：

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
该命令将创建一个具有以下结构的新项目文件夹：

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

要自定义您的项目，您可以： — 修改`src/my_project/config/agents.yaml`以定义您的代理。 \- 修改`src/my_project/config/tasks.yaml`以定义您的任务。 \- 修改`src/my_project/crew.py`以添加您自己的逻辑、工具和特定参数。 \- 修改`src/my_project/main.py`以为您的代理和任务添加自定义输入。 \- 将您的环境变量添加到`.env`文件中。

> **示例：定义代理和任务**

### agents.yaml


```python
researcher:
  role: >
    求职候选人研究员
  goal: >
    寻找适合该职位的潜在候选人
  backstory: >
    你擅长通过探索各种在线资源来找到合适的候选人。你识别合适候选人的能力确保了职位的最佳匹配。
```

### tasks.yaml


```python
research_candidates_task:
  description: >
    进行深入研究，以寻找指定职位的潜在候选人。
    利用各种在线资源和数据库，收集潜在候选人的综合名单。
    确保候选人符合提供的职位要求。

    职位要求：
    {job_requirements}
  expected_output: >
    一份包含10名潜在候选人及其联系信息和简要个人资料的名单，突出他们的适合性。
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
      将邮件总结为简洁明了的摘要
    backstory: >
      您将创建一份包含 5 个要点的报告摘要
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
在`crew.py`文件中使用注释正确引用代理和任务。


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

在您的`agents.yaml`和`tasks.yaml`文件中插值的任何变量，如`{variable}`，将被`main.py`文件中变量的值替换。

### tasks.yaml

```python
research_task:
  description: >
    在{customer_domain}的背景下，对客户和竞争对手进行全面研究。
    确保找到任何有趣和相关的信息，因为当前年份是2024年。
  expected_output: >
    关于客户及其客户和竞争对手的完整报告，包括他们的人口统计、偏好、市场定位和受众参与情况。
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

> **crewAI的5个重要组成部分**

* Agent
* Task
* Tools
* Processes
* Crew

> **什么是Agent？**

Agent是一个**自主单元**，其编程目的是：

* 执行任务
* 做出决策
* 与其他agents沟通

可以将Agent视为团队中的一员，具有特定的技能和特定的工作。Agents可以具有不同的角色，如“研究员”、“撰稿人”或“客户支持”，每个角色都为团队的整体目标做出贡献。

BaseAgent包括与您的crew集成以运行和委派任务给其他agents所需的属性和方法。

CrewAI是一个通用的多agent框架，允许所有agents协同工作以自动化任务和解决问题。

> **什么是Task？**

在crewAI框架中，任务是由agents完成的具体分配。它们提供执行所需的所有详细信息，例如描述、负责的agent、所需的工具等，促进各种行动复杂性的实现。

crewAI中的任务可以是协作的，要求多个agents共同工作。这通过任务属性进行管理，并由Crew的流程进行协调，从而增强团队合作和效率。

> **什么是Tools？**

在CrewAI中，工具是agents可以利用的技能或功能，以执行各种操作。这包括来自[crewAI工具包](https://github.com/joaomdmoura/crewai-tools)和[LangChain工具](https://python.langchain.com/docs/integrations/tools)的工具，能够实现从简单搜索到复杂交互和有效团队合作的所有功能。

> **什么是Processes？**

在CrewAI中，流程协调agents执行任务，类似于人类团队中的项目管理。这些流程确保任务有效分配和执行，符合预定义的策略。

* **顺序**：按顺序执行任务，确保任务按照有序的进展完成。
* **层级**：以管理层级组织任务，其中任务根据结构化的指挥链进行委派和执行。必须在crew中指定一个管理语言模型（`manager_llm`）或自定义管理agent（`manager_agent`）以启用层级流程，从而促进任务的创建和管理。
* **共识过程（计划）**：旨在促进agents之间的协作决策，这种过程类型在CrewAI中引入了一种民主的任务管理方法。它计划在未来开发，目前尚未在代码库中实现。

> **什么是Crew？**

在crewAI中，Crew代表一个协作的agent组，共同工作以实现一系列任务。每个Crew定义了任务执行、agent协作和整体工作流程的策略。

> **测试**

测试是开发过程中的一个关键部分，确保您的crew按预期运行至关重要。使用crewAI，您可以轻松测试您的crew并评估其性能，利用内置的测试功能。

我们添加了CLI命令`crewai test`，使测试您的crew变得简单。此命令将在指定的迭代次数内运行您的crew，并提供详细的性能指标。参数`n_iterations`和`model`是可选的，默认值分别为2和`gpt-4o-mini`。目前，唯一可用的提供者是OpenAI。

```python
crewai test
```
如果您想运行更多迭代或使用不同的模型，可以这样指定参数：

```python
crewai test --n_iterations 5 --model gpt-4o
```
或使用简写形式

```python
crewai test -n 5 -m gpt-4o
```
当您运行`crewai test`命令时，crew将执行指定次数的迭代，并在运行结束时显示性能指标。

最后的得分表将显示crew在以下指标方面的表现：

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
是时候编码了！！！！！

> **crewai-sequential-quickstart**

简化和经过测试的**顺序**CrewAI crew执行**网络搜索**（SerperDevTool）的模板。

要求：在安装colab-xterm后，在终端中使用这些命令，加载2个终端，在第一个终端中运行前两个命令，然后在另一个终端中运行第三个命令 1\.curl [https://ollama.ai/install.sh](https://www.google.com/url?q=https%3A%2F%2Follama.ai%2Finstall.sh) \| sh 2\.ollama pull llama3 3\.ollama server

* Serper API Key: [https://serper.dev/](https://www.google.com/url?q=https%3A%2F%2Fserper.dev%2F)

如果您不了解ollama，请参考以下链接

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

> **通过运行此单元输入Serper API Key**

```python
## @title 🔑 输入**Serper** API Key通过运行此单元
import os
from crewai_tools import SerperDevTool
from getpass import getpass
## 实例化工具

## 通过提示用户输入密钥来设置SERPER_API_KEY环境变量
## 使用Serper搜索工具（https://serper.dev）需要Serper API密钥
os.environ["SERPER_API_KEY"] = getpass("输入SERPER_API_KEY: ")
search_tool = SerperDevTool()
```

> **您可以使用此链接创建serper api密钥**

> **我们创建了研究员和撰稿人crew，包括**

> **1名研究员，1名撰稿人，2个任务，1个用于全面分析报告以要点形式呈现，1个用于至少4段的完整博客文章**

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
    """搜索给定主题的信息。"""
    return DuckDuckGoSearchRun().run(search_query)

## search_tool = DuckDuckGoSearchRun()
## 定义您的agents及其角色和目标
researcher = Agent(
  role='高级研究分析师',
  goal='发现AI和数据科学的前沿发展',
  backstory="""您在一家领先的科技智囊团工作。
  您的专长在于识别新兴趋势。
  您擅长剖析复杂数据并呈现可行的见解。""",
  verbose=True,
  allow_delegation=False,
  tools=[search],
  llm=llm
)

writer = Agent(
  role='科技内容策略师',
  goal='撰写有关科技进步的引人入胜的内容',
  backstory="""您是一位著名的内容策略师，以其深刻和引人入胜的文章而闻名。
  您将复杂的概念转化为引人入胜的叙述。""",
  verbose=True,
  allow_delegation=True,
  llm=llm
)

## 为您的agents创建任务
task1 = Task(
  description="""对2024年AI最新进展进行全面分析。
  识别关键趋势、突破性技术和潜在行业影响。""",
  expected_output="以要点形式呈现的完整分析报告",
  agent=researcher
)

task2 = Task(
  description="""根据提供的见解，撰写一篇引人入胜的博客文章
  突出最重要的AI进展。
  您的文章应该信息丰富且易于理解，适合科技爱好者。
  让它听起来很酷，避免复杂的词汇，以免听起来像AI。""",
  expected_output="至少4段的完整博客文章",
  agent=writer
)

## 实例化您的crew，采用顺序流程
crew = Crew(
  agents=[researcher, writer],
  tasks=[task1, task2],
  verbose=2, # 您可以将其设置为1或2以调整日志级别
)

## 让您的crew开始工作！
result = crew.kickoff()

print("######################")
print(result)
```
*当我们开始运行上述单元时，下面是显示的详细信息，您可以看到所有crewAI agents执行的操作*

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

In 2024, 生成式人工智能可能会真正对普通非技术人员变得有用，我们将看到更多人尝试一百万个小的人工智能模型。最先进的人工智能模型 ... 这里有一些在即将到来的一年中需要关注的重要当前人工智能趋势。现实检查：更现实的期望。多模态人工智能。更小的语言模型和开源进展。GPU短缺和云成本。模型优化变得更加可及。定制的本地模型和数据管道。今年的趋势反映了人工智能开发和部署策略的日益复杂和谨慎，关注伦理、安全和不断变化的监管环境。以下是2024年需要准备的十大人工智能和机器学习趋势。1. 多模态人工智能。多模态人工智能超越传统的单一模式数据处理 ... 2024年人工智能的五大趋势。Adobe Stock。自OpenAI发布ChatGPT以来已经过去了一年，打开了将人工智能无缝融入我们日常生活的可能性 ... 这是它的工作原理。2024年的人工智能——即将推出的最大的新产品和进展。虽然2023年是人工智能的年份，但2024年将是我们使用它的一年。我们刚刚结束了一年 ...

Thought: I now know the final answer
Final Answer:

**综合分析报告：人工智能最新进展（2024）**

• **生成式人工智能**：预计将对非技术人员变得更加可及和有用，小型语言模型和开源进展的采用将增加。
• **多模态人工智能**：一种超越传统单一模式数据处理的趋势，能够整合多个数据源和模式。
• **模型优化**：变得越来越易于获取，允许定制本地模型和数据管道。
• **定制本地模型**：预计将获得关注，组织寻求为特定用例开发量身定制的人工智能解决方案。
• **GPU短缺和云成本**：一个将继续影响人工智能项目开发和部署的挑战。
• **现实检查：更现实的期望**：随着人工智能采用的增长，需要对人工智能能实现的目标有更现实的期望，强调伦理、安全和合规性。
• **十大人工智能和机器学习趋势**：
 1. 多模态人工智能
 2. 更小的语言模型
 3. 开源进展
 4. 模型优化变得更加可及
 5. 定制本地模型和数据管道
 6. GPU短缺和云成本
 7. 伦理、安全和合规性
 8. 2024年的人工智能：即将推出的最大的新产品和进展
 9. 类ChatGPT的应用将变得更加主流
 10. 人工智能驱动的虚拟助手将继续发展

**关键要点**

• 人工智能正变得越来越可及和有用，尤其是对非技术人员。
• 多模态人工智能、模型优化和定制本地模型是2024年的关键趋势。
• 对伦理、安全和合规性的关注将继续增长。
• 人工智能驱动的虚拟助手将继续发展。

这份综合分析报告提供了2024年人工智能最新进展的概述，突出了关键趋势、突破性技术和潜在行业影响。

> Finished chain.
 [DEBUG]: == [Senior Research Analyst] Task output: **综合分析报告：人工智能最新进展（2024）**

• **生成式人工智能**：预计将对非技术人员变得更加可及和有用，小型语言模型和开源进展的采用将增加。
• **多模态人工智能**：一种超越传统单一模式数据处理的趋势，能够整合多个数据源和模式。
• **模型优化**：变得越来越易于获取，允许定制本地模型和数据管道。
• **定制本地模型**：预计将获得关注，组织寻求为特定用例开发量身定制的人工智能解决方案。
• **GPU短缺和云成本**：一个将继续影响人工智能项目开发和部署的挑战。
• **现实检查：更现实的期望**：随着人工智能采用的增长，需要对人工智能能实现的目标有更现实的期望，强调伦理、安全和合规性。
• **十大人工智能和机器学习趋势**：
 1. 多模态人工智能
 2. 更小的语言模型
 3. 开源进展
 4. 模型优化变得更加可及
 5. 定制本地模型和数据管道
 6. GPU短缺和云成本
 7. 伦理、安全和合规性
 8. 2024年的人工智能：即将推出的最大的新产品和进展
 9. 类ChatGPT的应用将变得更加主流
 10. 人工智能驱动的虚拟助手将继续发展

**关键要点**

• 人工智能正变得越来越可及和有用，尤其是对非技术人员。
• 多模态人工智能、模型优化和定制本地模型是2024年的关键趋势。
• 对伦理、安全和合规性的关注将继续增长。
• 人工智能驱动的虚拟助手将继续发展。

这份综合分析报告提供了2024年人工智能最新进展的概述，突出了关键趋势、突破性技术和潜在行业影响。


 [DEBUG]: == Working Agent: Tech Content Strategist
 [INFO]: == Starting Task: Using the insights provided, develop an engaging blog
  post that highlights the most significant AI advancements.
  Your post should be informative yet accessible, catering to a tech-savvy audience.
  Make it sound cool, avoid complex words so it doesn't sound like AI.


> Entering new CrewAgentExecutor chain...
Action: Delegate work to co-worker

Action Input: {
    "task": "Research AI advancements",
    "context": "综合分析报告：人工智能最新进展（2024）",
    "coworker": "Senior Research Analyst 


Error executing tool. Co-worker mentioned not found, it must to be one of the following options:
- senior research analyst


I apologize for the mistake. Since I can only delegate work to a Senior Research Analyst, I will reattempt the action.

Thought:
Action: Delegate work to co-worker
Action Input: {
    "task": "Research AI advancements",
    "context": "综合分析报告：人工智能最新进展（2024）",
    "coworker": "Senior Research Analyst 

I tried reusing the same input, I must stop using this action input. I'll try something else instead.



Thought:
Action: Delegate work to co-worker
Action Input: { "task": "Research AI advancements", "context": "综合分析报告：人工智能最新进展（2024）", "coworker": "Senior Research Analyst" 

I tried reusing the same input, I must stop using this action input. I'll try something else instead.



Here's my attempt at crafting a compelling blog post on the latest AI advancements:

**人工智能的未来：趋势与突破**

随着我们步入2024年，人工智能（AI）的世界正准备迎接显著的增长和创新。在本文中，我们将深入探讨塑造人工智能未来的最新趋势和突破。

**生成式人工智能：小型语言模型的崛起**

人工智能中最令人兴奋的发展之一是生成式人工智能的崛起，特别是小型语言模型。这些模型在近年来取得了巨大的进步，使非技术人员能够利用人工智能的力量进行各种应用。随着采用和开源进展的增加，我们可以期待在未来一年看到更多创新的生成式人工智能应用。

**多模态人工智能：数据处理的未来**

另一个正在获得关注的趋势是多模态人工智能，它能够整合多个数据源和模式。这项突破性技术对医疗、金融和教育等行业具有深远的影响，因为多样的数据集对于明智的决策至关重要。

**模型优化：定制本地模型和数据管道**

随着人工智能的采用增长，定制本地模型和数据管道的需求也在增加。模型优化变得越来越可及，使组织能够为特定用例开发量身定制的人工智能解决方案。这一趋势将继续塑造人工智能的未来，使得更准确的预测和更好的决策成为可能。

**GPU短缺和云成本：面临的挑战**

尽管围绕人工智能进展的兴奋情绪，但仍然存在需要解决的挑战。GPU短缺和云成本仍然是开发人员和组织在部署人工智能项目时面临的重大障碍。随着我们向前推进，寻找创新的解决方案以应对这些问题至关重要，以确保人工智能对所有人都保持可及。

**人工智能的未来：趋势与突破**

总之，人工智能的未来是光明的，生成式人工智能、多模态人工智能、模型优化等趋势以及更多突破正在前方等待着我们。随着我们应对未来的挑战，了解人工智能的最新发展及其潜在应用至关重要。

**最终答案：**
最终答案是一篇突出人工智能最新趋势和突破的博客文章，包括生成式人工智能、多模态人工智能、模型优化等。该文章旨在教育读者关于人工智能的未来及其在各个行业的潜在应用。

请让我知道这是否符合您的要求！

> Finished chain.
 [DEBUG]: == [Tech Content Strategist] Task output: **
最终答案是一篇突出人工智能最新趋势和突破的博客文章，包括生成式人工智能、多模态人工智能、模型优化等。该文章旨在教育读者关于人工智能的未来及其在各个行业的潜在应用。

请让我知道这是否符合您的要求！


######################
**
最终答案是一篇突出人工智能最新趋势和突破的博客文章，包括生成式人工智能、多模态人工智能、模型优化等。该文章旨在教育读者关于人工智能的未来及其在各个行业的潜在应用。

请让我知道这是否符合您的要求！
```

> 如果您想查看完整的视频系列“使用 crewAI 构建多智能体 LLM 系统”，请参见以下链接

*通过这个您可以理解“使用 crewAI 构建多智能体 LLM 系统”….*

*祝您学习愉快 !!!!!!!!!!*

*如有更好的教学建议或评论，请随时提出..*

