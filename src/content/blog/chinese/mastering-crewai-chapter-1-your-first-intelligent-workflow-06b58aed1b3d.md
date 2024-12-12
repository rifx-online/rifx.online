---
title: "掌握 CrewAI：第 1 章 - 您的第一个智能工作流程"
meta_title: "掌握 CrewAI：第 1 章 - 您的第一个智能工作流程"
description: "CrewAI 是一个平台，用于创建和管理 AI 代理团队，提供企业级和开源解决方案。本文重点介绍开源 CrewAI，解释了代理的概念及其如何模拟人类行为。CrewAI 包含四个主要组件：Crew、AI Agents、Process 和 Tasks。文章详细介绍了如何安装和配置 CrewAI，创建项目结构，定义代理和任务，以及运行团队。此外，还介绍了如何集成 Ollama 以使用开源 LLM，并展示了如何创建和运行更复杂的任务队列。通过这些步骤，开发人员可以构建和管理能够协作完成复杂任务的 AI 代理团队。"
date: 2024-12-12T01:14:38Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*NZJp8YSggSLwkxLIHgSwWg.png"
categories: ["Programming", "Generative AI", "Chatbots"]
author: "Rifx.Online"
tags: ["CrewAI", "agents", "tasks", "Ollama", "Toolkit"]
draft: False

---



### 代理和任务的基础



CrewAI 是一个平台，允许我们创建和管理 AI 代理团队。它提供企业级和开源解决方案。在这篇博客文章中，我们将深入探讨开源 CrewAI，当然。

那么，代理到底是什么？

代理被建模以模拟人类在解决问题、执行任务和互动中的行为。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*iZgPrd8cLUztBV_u2dO5Wg.png)

代理利用其能力、先验知识和观察，有效作用于其环境以实现其目标。

CrewAI 被设计为帮助开发人员创建和管理能够协作完成复杂任务的 AI 代理团队。

因此，它并不是一个神奇的玩具；而是一个用于控制和管理代理团队的抽象。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*HRbqTYl-0OUSfvF-eGXBaw.png)

框架中有 4 个主要组件：

* Crew: 可以将“Crew”视为监督整个操作的经理。
* AI Agents: 这些是具有独特角色的专门团队成员。他们使用工具来完成任务。
* Process: 这是工作流程，类似于协作蓝图。它定义了代理如何互动等。
* Tasks: 代理必须完成的分配。

## 安装

* *\[可选 \| 以跟随操作]* 创建一个新文件夹: *crewai\-demo*
* *\[可选 \| 以跟随操作]* 创建一个新环境:


```python
python3 -m venv venv

source venv/bin/activate
```
* 安装 CrewAI


```python
pip install crewai crewai-tools
```
* 启动一个 Crew 项目 (*可选*: 我使用了 `myagents` 作为项目名称)


```python
crewai create crew <project_name>
```
它会构建一个项目模板。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ESYfS-IT-sw1UAq-FYfh_g.png)

* 它会提示我们选择一个提供者（在这种情况下，我将使用 OpenAI）。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*DIzVrXWyBIkpDHaQ9yW0Mg.png)

* 它还会要求提供模型和 OpenAI 密钥（我选择了 *gpt\-4o\-mini*）。
* 随后，它在文件夹中创建了模板文件。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Pb89fHiuGiGheZ17FAdRHQ.png)

## 项目结构

让我们仔细看看创建的文件。

### crew.py

这是我们的CrewAI项目的主脚本。


```python
from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task

@CrewBase
class Myagents():
 """Myagents crew"""

 agents_config = 'config/agents.yaml'
 tasks_config = 'config/tasks.yaml'

 @agent
 def researcher(self) -> Agent:
  return Agent(
   config=self.agents_config['researcher'],
   verbose=True
  )

 @agent
 def reporting_analyst(self) -> Agent:
  return Agent(
   config=self.agents_config['reporting_analyst'],
   verbose=True
  )

 @task
 def research_task(self) -> Task:
  return Task(
   config=self.tasks_config['research_task'],
  )

 @task
 def reporting_task(self) -> Task:
  return Task(
   config=self.tasks_config['reporting_task'],
   output_file='report.md'
  )

 @crew
 def crew(self) -> Crew:
  """Creates the Myagents crew"""

  return Crew(
   agents=self.agents, 
   tasks=self.tasks,
   process=Process.sequential,
   verbose=True,
  )
```
`@CrewBase` 装饰器将 `Myagents` 标记为 CrewAI 团队定义。


```python
@CrewBase
class Myagents():
```
它为定义代理、任务和团队逻辑提供了框架。就像我们团队的组装模板。

`@agent` 装饰器定义了具有预定义配置的特定 AI 代理。


```python
@agent
 def researcher(self) -> Agent:
  return Agent(
   config=self.agents_config['researcher'],
   verbose=True
  )

 @agent
 def reporting_analyst(self) -> Agent:
  return Agent(
   config=self.agents_config['reporting_analyst'],
   verbose=True
  )
```
每个代理的行为由其配置决定。

`@task` 装饰器定义了代理需要完成的任务。


```python
@task
 def research_task(self) -> Task:
  return Task(
   config=self.tasks_config['research_task'],
  )

 @task
 def reporting_task(self) -> Task:
  return Task(
   config=self.tasks_config['reporting_task'],
   output_file='report.md'
  )
```
任务就像待办事项列表中的项目，每个任务都有明确的指示，有时还需要一个预期的交付成果，如 `output_file='report.md'`

`@crew` 装饰器用于定义项目中的整个团队。


```python
@crew
 def crew(self) -> Crew:
  """Creates the Myagents crew"""
  # 要了解如何为您的团队添加知识源，请参阅文档：
  # https://docs.crewai.com/concepts/knowledge#what-is-knowledge

  return Crew(
   agents=self.agents, # 由 @agent 装饰器自动创建
   tasks=self.tasks, # 由 @task 装饰器自动创建
   process=Process.sequential,
   verbose=True,
   # process=Process.hierarchical, # 如果您想使用分层处理，请参阅 https://docs.crewai.com/how-to/Hierarchical/
  )
```
`Crew` 类表示整个团队的代理协同工作。`process` 决定了团队的工作方式。在顺序处理中，任务依次完成。

总结：

* 我们使用 `@agent` 创建具有特定能力的角色（如 `researcher` 和 `reporting_analyst`）。这些是工作者。
* 我们使用 `@task` 定义代理需要完成的工作（如 `research_task` 和 `reporting_task`）。
* 我们将代理和任务组装成一个称为 `crew` 的单一单元，通过 `process` 定义它们如何协同工作。

### config/\*.yaml

YAML 配置文件定义了我们的 AI 代理的角色、目标和任务。

**agents.yaml**

此文件定义了项目中每个代理的配置。每个代理都有一个角色、目标和背景故事。

```python
researcher:
  role: >
    {topic} Senior Data Researcher
  goal: >
    Uncover cutting-edge developments in {topic}
  backstory: >
    You're a seasoned researcher with a knack for uncovering the latest
    developments in {topic}. Known for your ability to find the most relevant
    information and present it in a clear and concise manner.

reporting_analyst:
  role: >
    {topic} Reporting Analyst
  goal: >
    Create detailed reports based on {topic} data analysis and research findings
  backstory: >
    You're a meticulous analyst with a keen eye for detail. You're known for
    your ability to turn complex data into clear and concise reports, making
    it easy for others to understand and act on the information you provide.
```
* `role`: 专业头衔
* `goal`: 主要目标
* `backstory`: 定义代理个性和方法的叙述背景。

此文件就像为虚拟团队成员分配 *个性* 和 *职责* 一样。`researcher` 是 *侦探*，负责寻找信息的隐藏瑰宝，而 `reporting_analyst` 是 *讲故事的人*，将发现组织成连贯的叙述。

**tasks.yaml**

此文件定义了代理需要执行的任务。每个任务包括描述、预期输出和负责该任务的代理。

```python
research_task:
  description: >
    Conduct a thorough research about {topic}
    Make sure you find any interesting and relevant information given
    the current year is 2024.
  expected_output: >
    A list with 10 bullet points of the most relevant information about {topic}
  agent: researcher

reporting_task:
  description: >
    Review the context you got and expand each topic into a full section for a report.
    Make sure the report is detailed and contains any and all relevant information.
  expected_output: >
    A fully fledge reports with the mains topics, each with a full section of information.
    Formatted as markdown without '```'
  agent: reporting_analyst
```
* `description`: 任务的详细说明。
* `expected_output`: 预期的特定格式或输出类型
* `agent`: 负责完成任务的代理。

任务代表了需要完成的工作和谁将完成这些工作。

`research_task` 像是创建项目的基石，收集原始但关键的数据。

`reporting_task` 将这些基石精炼成一个精致且可操作的文档。

### main.py

这是运行和与我们的团队互动的入口点。

```python
import sys
import warnings

from myagents.crew import Myagents

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

def run():
    """
    Run the crew.
    """
    inputs = {
        'topic': 'AI LLMs'
    }
    Myagents().crew().kickoff(inputs=inputs)


def train():
    """
    Train the crew for a given number of iterations.
    """
    inputs = {
        "topic": "AI LLMs"
    }
    try:
        Myagents().crew().train(n_iterations=int(sys.argv[1]), filename=sys.argv[2], inputs=inputs)

    except Exception as e:
        raise Exception(f"An error occurred while training the crew: {e}")

def replay():
    """
    Replay the crew execution from a specific task.
    """
    try:
        Myagents().crew().replay(task_id=sys.argv[1])

    except Exception as e:
        raise Exception(f"An error occurred while replaying the crew: {e}")

def test():
    """
    Test the crew execution and returns the results.
    """
    inputs = {
        "topic": "AI LLMs"
    }
    try:
        Myagents().crew().test(n_iterations=int(sys.argv[1]), openai_model_name=sys.argv[2], inputs=inputs)

    except Exception as e:
        raise Exception(f"An error occurred while replaying the crew: {e}")
```
* `run` 以预定义的输入启动团队。输入 `topic: "AI LLMs"` 传递给代理（记得 YAML 文件中的内容）。

```python
researcher:
  role: >
    {topic} Senior Data Researcher
```
* `train` 运行一个训练循环，以提高团队在多次迭代中的表现。
* `replay` 从特定任务重新执行团队。
* `test` 测试团队的执行并返回结果以进行评估。

## 运行团队

我们可以使用 `crewai` CLI 命令来运行团队，或者使用 Python CLI 手动运行项目。

### crewai CLI

* 进入 `crewai` 项目（在我的情况下是 *myagents*）


```python
cd myagents
```
* 安装 `crewai`。它将创建一个新的虚拟环境等。


```python
crewai install
```
* 运行团队。


```python
crewai run
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*7AQnOhu_hASwtLu7VmUrsw.png)

首先，它运行 “Senior Data Researcher”。然后，运行 “Reporting Analyst”。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*zYezD11vfXN45BCwOLJfoQ.png)

最后，它创建了我们想要的 `report.md`。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*H5q26a1VKPJmqQiz05d7xg.png)

### Python CLI

手动运行：

* 更新 `main.py` 中的模块导入


```python
#from myagents.crew import Myagents
from crew import Myagents
```
* 在 `crew.py` 中加载环境变量


```python
from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task


from dotenv import load_dotenv

load_dotenv()
```
* 更新 `main.py`


```python
#!/usr/bin/env python
import sys
import warnings

#from myagents.crew import Myagents
from crew import Myagents

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")


def run():
    """
    Run the crew.
    """
    inputs = {
        'topic': 'AI LLMs'
    }
    Myagents().crew().kickoff(inputs=inputs)

run()
```
* 运行 CLI 命令


```python
python myagents/src/myagents/main.py  
```

## Ollama 集成

到目前为止，我们一直使用 `gpt-4o-mini` 作为 LLM。在 CrewAI 中可以使用开源 LLM，并且这些模型可以使用 Ollama 集成。

让我们使用 `llama3.2:1b`


```python
ollama run llama3.2:1b
```
要在 Ollama API 上运行模型，我们需要更新 `crew.py`

`from crewai import LLM` 添加了定义和集成 LLM 的能力。


```python
from crewai import Agent, Crew, Process, Task, LLM # import LLM

@CrewBase
class Myagents():
 
 agents_config = 'config/agents.yaml'
 tasks_config = 'config/tasks.yaml'

  # Define a new LLM 
 ollama_llm = LLM(
  model="ollama/llama3.2:1b", # the model name
  base_url="http://localhost:11434", # the ollama endpoint
 )
```
然后我们更新每个代理使用的 LLM。


```python
@agent
 def researcher(self) -> Agent:
  return Agent(
   config=self.agents_config['researcher'],
   verbose=True,
   llm=self.ollama_llm # You can pass the LLM to the agent
  )

 @agent
 def reporting_analyst(self) -> Agent:
  return Agent(
   config=self.agents_config['reporting_analyst'],
   verbose=True,
   llm=self.ollama_llm # You can pass the LLM to the agent
  )
```
新的 `crew.py`


```python
from crewai import Agent, Crew, Process, Task, LLM
from crewai.project import CrewBase, agent, crew, task
from dotenv import load_dotenv

load_dotenv()

@CrewBase
class Myagents():

 agents_config = 'config/agents.yaml'
 tasks_config = 'config/tasks.yaml'

 ollama_llm = LLM(
  model="ollama/llama3.2:1b",
  base_url="http://localhost:11434",
 )

 @agent
 def researcher(self) -> Agent:
  return Agent(
   config=self.agents_config['researcher'],
   verbose=True,
   llm=self.ollama_llm # You can pass the LLM to the agent
  )

 @agent
 def reporting_analyst(self) -> Agent:
  return Agent(
   config=self.agents_config['reporting_analyst'],
   verbose=True,
   llm=self.ollama_llm # You can pass the LLM to the agent
  )

 @task
 def research_task(self) -> Task:
  return Task(
   config=self.tasks_config['research_task'],
  )

 @task
 def reporting_task(self) -> Task:
  return Task(
   config=self.tasks_config['reporting_task'],
   output_file='report.md'
  )

 @crew
 def crew(self) -> Crew:
  """Creates the Myagents crew"""


  return Crew(
   agents=self.agents,
   tasks=self.tasks,
   process=Process.sequential,
   verbose=True,
  )
```
再次运行团队。


```python
crewai run
```

## 任务

CrewAI 中的任务是分配给 AI 代理的具体任务。它封装了代理必须执行的具体操作。

任务可以遵循两种主要的工作流程：

* **顺序**：任务按定义的顺序依次执行。`task1` -> `task2` -> `task3`
* **层次**：任务根据代理的角色和专长动态分配。`task1` 可以拆分为子任务 `subtask1`、`subtask2`。

设置执行流程的基本接口：

```python
crew = Crew(
    agents=[agent1, agent2],  # Define the agents
    tasks=[task1, task2],    # Define the tasks
    process=Process.sequential  # or Process.hierarchical
)
```
任务可以使用其许多属性进行自定义。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*uunEfMrm6pwbuW9gaqs-gw.png)

通过自定义这些属性，我们可以设计符合项目需求的任务。

## 工具

工具是使 AI 代理能够执行广泛任务的构建块。这些工具可以是从 API、LLM 或数据库连接器到自定义构建的逻辑。

虽然我们可以创建自己的自定义工具，但 CrewAI 包括一个预设的工具包，称为 CrewAI 工具包，并且还支持 LangChain 工具包。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ftYg5qbvlWcvXb_ue14NaQ.png)

为了更好地理解任务和工具，让我们创建一个新的 CrewAI 项目（我将其命名为 *crew-tasks*，使用 *gpt-4o-mini*）。

我们将有四个代理：`searcher`、`scrapper`、`copywriter` 和 `file_writer`。

* `searcher` 将在互联网上搜索特定主题。
* `scrapper` 将抓取 `searcher` 返回的网站。
* `copywriter` 从网站数据生成有意义的文本。
* `file_writer` 将输出写入文件。

我们将使用 `crewai_tools` 中的预定义工具。

```python
from crewai_tools import SerperDevTool, ScrapeWebsiteTool, FileWriterTool
```

@CrewBase
class CrewTasks():
 """CrewTasks 机组任务"""

 agents_config = 'config/agents.yaml'
 tasks_config = 'config/tasks.yaml'

 @agent
 def searcher(self) -> Agent:
  return Agent(
   config=self.agents_config['searcher'],
   verbose=True,
   tools=[SerperDevTool()],
  )

 @agent
 def scrapper(self) -> Agent:
  return Agent(
   config=self.agents_config['scrapper'],
   verbose=True,
   tools=[ScrapeWebsiteTool()],
  )
 
 @agent
 def copywriter(self) -> Agent:
  return Agent(
   config=self.agents_config['copywriter'],
   verbose=True,
  )
 
 @agent
 def file_writer(self) -> Agent:
  return Agent(
   config=self.agents_config['file_writer'],
   verbose=True,
   tools=[FileWriterTool()],
  )

@task
 def search_task(self) -> Task:
  return Task(
   config=self.tasks_config['search_task'],
  )
 
 @task
 def scrape_task(self) -> Task:
  return Task(
   config=self.tasks_config['scrape_task'],
  )

 
 @task
 def content_write_task(self) -> Task:
  return Task(
   config=self.tasks_config['content_write_task'],
  )
 
 @task
 def file_write_task(self) -> Task:
  return Task(
   config=self.tasks_config['file_write_task'],
  )

 @crew
 def crew(self) -> Crew:
  """创建 CrewTasks 机组"""
 
  return Crew(
   agents=self.agents, 
   tasks=self.tasks, 
   process=Process.sequential,
   verbose=True,
  
  )
```
每个代理都有一个特定的任务：`search_task`、`scrap_task`、`content_write_task` 和 `file_write_task`。

相应地，我们应该更新 YAML 文件。

**agents.yaml**


```python
searcher:
  role: >
    {topic} 内容搜索者
  goal: >
    发现 {topic} 领域的最新进展
  backstory: >
    你是一位经验丰富的研究人员，擅长发现 {topic} 领域的最新进展。以能够找到最相关的信息并以清晰简洁的方式呈现而闻名。

scrapper:
  role: >
    网站抓取者
  goal: >
    抓取网站上的最新 {topic} 内容
  backstory: >
    你是一位熟练的网站抓取者，擅长从网站中提取最有价值的信息。以能够导航复杂网站并提取最相关信息而闻名。

copywriter:
  role: >
    内容撰稿人
  goal: >
    根据提供的信息编写引人入胜且信息丰富的内容
  backstory: >
    你是一位才华横溢的撰稿人，擅长创作引人入胜且信息丰富的内容。以能够将复杂信息简化为清晰且引人入胜的文字而闻名。

file_writer:
  role: >
    文件撰写者
  goal: >
    将提取的信息写入文件
  backstory: >
    你是一位熟练的撰稿人，擅长创建条理清晰且信息丰富的文件。以能够以清晰简洁的方式呈现信息而闻名。
```
**tasks.yaml**


```python
search_task:
  description: >
    对 {topic} 进行彻底研究
    确保找到任何有趣且相关的信息，考虑到当前年份是 2024 年。
  expected_output: >
    一份包含 10 个要点的关于 {topic} 的最相关信息列表
  agent: searcher

scrape_task:
  description: >
    抓取网络上关于 {topic} 的最新信息
    确保找到任何有趣且相关的信息，考虑到当前年份是 2024 年。
  expected_output: >
    抓取的网站，包含关于 {topic} 的所有重要信息
  agent: scrapper

content_write_task:
  description: >
    编写关于 {topic} 的博客文章
    确保包含所有相关信息，并使其对读者具有吸引力。
  expected_output: >
    一篇至少 200 字的关于 {topic} 的博客文章
  agent: copywriter

file_write_task:
  description: >
    将文章写入文件
  expected_output: >
    文章写入 article.md 文件
  agent: file_writer
```
我们快要完成了。

最后，我们需要一个 SERPER_API_KEY。

前往：[*serper.dev*](https://serper.dev/api-key)

将其添加到 *.env* 文件中


```python
SERPER_API_KEY=your-api-key
```

```python

## main.py

import sys
import warnings
from datetime import datetime
from crew import CrewTasks

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

def run():
    """
    运行任务队列。
    """
    inputs = {
        'topic': 'AI LLMs',
        "date": datetime.now().strftime('%Y-%m-%d'),
    }
    CrewTasks().crew().kickoff(inputs=inputs)

run()
```
当我运行这个任务队列时，它未能抓取网站。看来我使用的较小模型 `gpt-4o-mini` 无法处理这样的任务。我将模型更新为 `gpt-4o`（通过 `.env` 文件），重新运行 `main.py`，这次成功了。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*yq8GsDG2SQeneyXFm1K-LA.png)

我们可以提供多个输入并为每个输入运行任务。


```python
def run():
    """
    运行任务队列。
    """
    # inputs = {
    #     'topic': 'AI LLMs',
    #     "date": datetime.now().strftime('%Y-%m-%d'),
    # }

    inputs_list = [
        {
            'topic': 'AI LLMs',
            "date": datetime.now().strftime('%Y-%m-%d'),
        },
        {
            'topic': 'Hugging Face',
            "date": datetime.now().strftime('%Y-%m-%d'),
        },
        {
            'topic': 'Ollama',
            "date": datetime.now().strftime('%Y-%m-%d'),
        },

    ]
    # CrewTasks().crew().kickoff(inputs=inputs)
    CrewTasks().crew().kickoff_for_each(inputs=inputs_list)
```
这是利用 CrewAI 的第一章结束。


### 阅读更多


### 参考资料

[https://www.codiste.com/ai\-agents\-and\-agentic\-workflows](https://www.codiste.com/ai-agents-and-agentic-workflows)

<https://www.crewai.com/>

<https://docs.crewai.com/concepts/tasks>

<https://docs.crewai.com/concepts/tools>

[https://www.youtube.com/watch?v\=ONKOXwucLvE](https://www.youtube.com/watch?v=ONKOXwucLvE)


## 用简单英语 🚀

*感谢您成为 [**In Plain English**](https://plainenglish.io/) 社区的一员！在您离开之前：*

* 请务必**点赞**并**关注**作者 ️👏**️️**
* 关注我们：[**X**](https://x.com/inPlainEngHQ) \| [**LinkedIn**](https://www.linkedin.com/company/inplainenglish/) \| [**YouTube**](https://www.youtube.com/channel/UCtipWUghju290NWcn8jhyAw) \| [**Discord**](https://discord.gg/in-plain-english-709094664682340443) \| [**Newsletter**](https://newsletter.plainenglish.io/) \| [**Podcast**](https://open.spotify.com/show/7qxylRWKhvZwMz2WuEoua0)
* [**在 Differ 上创建一个免费的 AI 驱动的博客。**](https://differ.blog/)
* 更多内容请访问 [**PlainEnglish.io**](https://plainenglish.io/)

