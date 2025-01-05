---
title: "揭秘CrewAI 4：三种流程的前所未有效率！你准备好提升你的AI协作能力了吗？"
meta_title: "揭秘CrewAI 4：三种流程的前所未有效率！你准备好提升你的AI协作能力了吗？"
description: "在CrewAI中，流程管理是AI代理协作和任务执行的核心。主要有三种流程类型：顺序流程、层级流程和协商流程。顺序流程确保任务按特定顺序执行，适用于存在依赖关系的情况。而层级流程引入经理代理，负责规划和监督任务执行，提高效率和准确性。通过示例，展示了如何使用这些流程处理客户工单和自动化多步骤工作流程。"
date: 2025-01-05T02:41:47Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*po_r5Q9WdvrKvOJdLJkWmw.jpeg"
categories: ["Programming", "Technology", "Machine Learning"]
author: "Rifx.Online"
tags: ["Sequential", "Hierarchical", "Consensual", "Processes", "Collaboration"]
draft: False

---



### 顺序与层级流程



在CrewAI中，**流程**的概念对于管理AI代理之间的协作和任务执行至关重要。

上一章：

**流程**定义了协调代理执行任务以实现共同目标的工作流策略。

主要有三种流程类型：

* 顺序流程
* 层级流程
* 协商流程（已规划，但尚未实施）

首先，让我们创建一个新项目来处理流程 *(openai \>\> gpt\-4o\-mini).*


```python
crewai create crew process_example
```

### 顺序处理

任务按照预定顺序一个接一个地执行。每个任务仅在前一个任务完成后才开始。

这对于任务之间存在依赖关系并且必须按特定顺序完成的项目是理想的。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*rZl_c0kr6Fu0zwc6j0fEbw.png)

此示例演示了 CrewAI 中的顺序处理如何自动化多步骤工作流程，确保每个任务以正确的顺序和适当的上下文执行。

```python
## main.py
import sys
import warnings

from crew import SequentialProcessExample

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")


def run():
    """
    Run the crew.
    """
    inputs = {
        'topic': "人工智能"
    }
    SequentialProcessExample().crew().kickoff(inputs=inputs)

run()
```

```python
## crew.py

from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai_tools import SerperDevTool, ScrapeWebsiteTool, FileWriterTool
from dotenv import load_dotenv

load_dotenv()


@CrewBase
class SequentialProcessExample:
 """ProcessExample crew"""

 agents_config = 'config/agents.yaml'
 tasks_config = 'config/tasks.yaml'

 @agent
 def searcher(self) -> Agent:
  return Agent(config=self.agents_config['searcher'], verbose=True, tools=[SerperDevTool()])
 
 @agent
 def scraper(self) -> Agent:
  return Agent(config=self.agents_config['scraper'], verbose=True, tools=[ScrapeWebsiteTool()])
 
 @agent
 def copywriter(self) -> Agent:
  return Agent(config=self.agents_config['copywriter'], verbose=True)
 
 @agent
 def file_writer(self) -> Agent:
  return Agent(config=self.agents_config['file_writer'], verbose=True, tools=[FileWriterTool()])
 
 @task
 def search_task(self) -> Task:
  return Task(config=self.tasks_config['search_task'], verbose=True)
 
 @task
 def scrape_task(self) -> Task:
  return Task(config=self.tasks_config['scrape_task'], verbose=True)
 
 @task
 def content_write_task(self) -> Task:
  return Task(config=self.tasks_config['content_write_task'], verbose=True)
 
 @task
 def file_write_task(self) -> Task:
  return Task(config=self.tasks_config['file_write_task'], verbose=True)

 @crew
 def crew(self) -> Crew:
  return Crew(
   agents=self.agents, 
   tasks=self.tasks,
   process=Process.sequential,
   verbose=True,
  )
```

```python
## agents.yaml
searcher:
  role: >
    {topic} 内容搜索者
  goal: >
    揭示 {topic} 的前沿发展
  backstory: >
    你是一位经验丰富的研究员，擅长揭示 {topic} 的最新发展。以找到最相关的信息并以清晰简洁的方式呈现而闻名。

scraper:
  role: >
    网站抓取者
  goal: >
    抓取最新的 {topic} 内容
  backstory: >
    你是一位熟练的网站抓取者，擅长从网站中提取最有价值的信息。以能够浏览复杂网站并提取最相关的信息而闻名。

copywriter:
  role: >
    内容文案撰写者
  goal: >
    基于提供的信息撰写引人入胜且信息丰富的内容
  backstory: >
    你是一位才华横溢的文案撰写者，擅长创作引人入胜且信息丰富的内容。以将复杂信息提炼成清晰而引人注目的文案而闻名。

file_writer:
  role: >
    文件撰写者
  goal: >
    将提取的信息写入文件
  backstory: >
    你是一位熟练的撰写者，擅长创建结构良好且信息丰富的文件。以能够以清晰简洁的方式呈现信息而闻名。
```

```python
## tasks.yaml

search_task:
  description: >
    深入研究 {topic}
    确保找到任何有趣和相关的信息，考虑到当前年份是 2024 年。
  expected_output: >
    关于 {topic} 的 10 个要点的列表
  agent: searcher

scrape_task:
  description: >
    在网上抓取关于 {topic} 的最新信息
    确保找到任何有趣和相关的信息，考虑到当前年份是 2024 年。
  expected_output: >
    抓取的网站上关于 {topic} 的所有重要信息
  agent: scraper

content_write_task:
  description: >
    撰写关于 {topic} 的博客文章
    确保包括所有相关信息，并使其对读者引人入胜。
  expected_output: >
    一篇关于 {topic} 的博客文章，至少有 200 个字。
  agent: copywriter

file_write_task:
  description: >
    将文章写入文件
  expected_output: >
    文章写入 article.txt 文件
  agent: file_writer
```

```python
python process_example/src/process_example/main.py
```
它创建了 `article.txt` 文件。

```python
**人工智能的黎明：我们现代世界的变革**

人工智能 (AI) 不再是科幻小说的内容。它站在技术革命的最前沿，重塑了从医疗到机器人等多个领域。随着我们深入探讨最近的进展，显而易见的是，人工智能与我们的日常生活息息相关，推动着创新，并承诺一个充满可能性的未来。

其中一个最引人注目的发展是情感识别的突破。最近的技术使得机器人能够表现出逼真的面部表情，跨越了“恐怖谷”。这种传达情感一致性的能力有可能改变人机交互，使其更加人性化和直观。

与此同时，研究人员正在探索机器心理学与神经网络的结合，以更接近实现通用人工智能——一种包含类人推理和理解的智能模型。这些进展引发了关于我们与机器关系的深刻问题。

在医疗领域，人工智能的作用是开创性的。从强化学习指导个性化治疗策略，到生成式人工智能显著改善肺癌诊断，提升患者结果的潜力是巨大的。此外，人工智能现在可以通过视频数据监测新生儿重症监护病房中的婴儿，检测神经变化，在重症监护环境中提供重要支持。

在机器人技术中，成群的“蚂蚁般”的机器人展示了卓越的协作能力，能够共同抬起重物并导航障碍。这反映了自然系统的效率，并为创新的建筑和物流解决方案打开了大门。

此外，人工智能驱动的工具正在简化化学合成，展示了移动机器人如何提高实验室的生产力。更不用说，出现了一种通过观察学习清洁洗手池的机器人，证明了机器的学习能力正在迅速进步。

从对美国手语的实时翻译到模仿生物功能的激光基人工神经元，人工智能应用的范围正在扩大并改变我们的世界。随着我们继续探索这些趋势，有一件事是明确的：人工智能的旅程才刚刚开始，它的影响将定义未来几代人的技术和人际互动。
```
此示例涉及以下步骤：

1. **网络搜索**：对给定主题进行网络搜索。
2. **内容提取**：从搜索结果中抓取相关内容。
3. **内容总结**：将提取的内容总结成一篇连贯的文章。
4. **文件写入**：将总结的内容保存到 txt 文件中。

在此设置中，每个任务按顺序执行。`search_task` 首先运行，其输出（URL 列表）成为 `scrape_task` 的输入。这种链式关系继续通过 `content_write_task`，并以 `file_write_task` 结束。

每个任务都依赖于前一个任务的输出，确保信息的逻辑流动。例如，内容撰写者在抓取者提取信息之前无法进行总结。

通过设置 `process=Process.sequential`，我们明确了执行顺序，确保任务按指定顺序进行。

### 层级过程

在 CrewAI 中，**层级过程** 模拟企业层级，通过引入一个负责规划、分配任务和验证结果的经理代理来实现。这种方法提高了任务执行的效率和准确性。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*kUf9VzTKVIhBhlpPWZwgqw.png)

新问题涉及处理客户工单，例如投诉或问题。在这个例子中，客户在登录账户时遇到困难，并收到“无效凭证”错误消息。

我们的系统：

1. 将工单分类为 **技术问题** 或 **账单问题**。
2. 将工单分配给适当的支持代理。
3. 解决问题并提供解决方案。
4. 审核解决方案以确保质量。

```python
## crew.py

from crewai import Agent, Crew, Process, Task
from dotenv import load_dotenv

load_dotenv()

## 定义经理代理
manager = Agent(
    role="客户支持经理",
    goal="监督支持团队，确保及时有效地解决客户咨询",
    backstory=(
        "您是一位经验丰富的客户支持经理，具有领导支持团队的广泛经验。"
        "您的主要职责是协调支持代理的工作，确保客户问题得到及时和满意的解决。"
        "您擅长任务分配、绩效监控，并保持高标准的客户服务。"
    ),
    allow_delegation=True,
    verbose=True,
)

## 定义技术支持代理
technical_support_agent = Agent(
    role="技术支持专家",
    goal="及时有效地解决客户报告的技术问题",
    backstory=(
        "您是一位技术支持专家，拥有丰富的故障排除软件和硬件问题的背景。"
        "您的主要职责是协助客户解决技术问题，确保他们的满意度和产品的顺利运行。"
    ),
    allow_delegation=False,
    verbose=True,
)

## 定义账单支持代理
billing_support_agent = Agent(
    role="账单支持专家",
    goal="处理与账单、支付和账户管理相关的客户咨询",
    backstory=(
        "您是一位经验丰富的账单支持专家，擅长处理客户的账单咨询。"
        "您的主要目标是提供清晰准确的账单流程信息，解决支付问题，并协助账户管理，以确保客户满意。"
    ),
    allow_delegation=False,
    verbose=True,
)

## 定义任务
categorize_tickets = Task(
    description="根据内容对来电客户支持工单进行分类：'{ticket}'，以确定它是技术问题还是账单问题。",
    expected_output="一个标记为'技术'或'账单'的分类工单。",
    agent=manager,
)

resolve_technical_issues = Task(
    description="解决工单中描述的技术问题：'{ticket}'",
    expected_output="为每个技术问题提供详细解决方案。",
    agent=technical_support_agent,
)

resolve_billing_issues = Task(
    description="解决工单中描述的账单问题：'{ticket}'",
    expected_output="为每个与账单相关的咨询提供全面的回应。",
    agent=billing_support_agent,
)

quality_assurance_review = Task(
    description="审核提供的技术和账单问题的解决方案，以确保准确性和客户满意度。",
    expected_output="一份确认解决方案质量和准确性的报告。",
    agent=manager,
)

## 使用自定义经理和层级过程实例化您的团队
crew_q = Crew(
    agents=[technical_support_agent, billing_support_agent],
    tasks=[categorize_tickets, resolve_technical_issues, resolve_billing_issues, quality_assurance_review],
    manager_agent=manager,
    process=Process.hierarchical,
    verbose=True,
)
```
**代理**：

* **经理代理**：监督整个过程，分类工单，并审核解决方案。
* **技术支持代理**：处理技术问题，如登录问题。
* **账单支持代理**：解决与账单相关的咨询。

**任务**：

* **分类工单**：确定问题是技术问题还是账单相关问题。
* **解决技术问题**：为技术问题提供解决方案。
* **解决账单问题**：处理与支付和账户相关的咨询。
* **质量保证审核**：审核提供的解决方案的准确性和质量。

```python
## main.py
import sys
import warnings

from crew import crew_q

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

def run():
    """
    运行团队。
    """
    inputs = {
       "ticket": "我今天尝试登录我的账户，但一直收到'无效凭证'错误消息。"
    }
    result = crew_q.kickoff(inputs=inputs)

run()
```
该程序通过将客户的工单输入系统来运行。任务由相关代理按顺序执行。每个代理提供答案或采取行动以完成他们的任务。

输入是客户工单：“我今天尝试登录我的账户，但一直收到‘无效凭证’错误消息。”


```python
## 代理：客户支持经理
### 任务：根据内容对来电客户支持工单进行分类：'我今天尝试登录我的账户，但一直收到'无效凭证'错误消息。'，以确定它是技术问题还是账单相关问题。


## 代理：客户支持经理
### 最终答案： 
技术


## 代理：客户支持经理
### 任务：解决工单中描述的技术问题：'我今天尝试登录我的账户，但一直收到'无效凭证'错误消息。'
## 代理：技术支持专家
### 任务：客户尝试登录其账户时，'无效凭证'错误消息的潜在原因和解决步骤是什么？


## 代理：技术支持专家
### 最终答案： 
当客户尝试登录其账户时，出现'无效凭证'错误消息的潜在原因有几个。以下是常见原因和解决此问题的步骤：

1. **用户名或密码错误**： 
   - **解决方案**：确认客户输入的用户名和密码是否正确。建议他们检查拼写错误，并确保大写锁定关闭，因为凭证通常区分大小写。

2. **账户锁定**： 
   - **解决方案**：许多系统在多次登录失败后会锁定账户。询问客户是否多次尝试登录但未成功。如果是，可能需要等待一段时间或联系支持以解锁账户。

3. **密码过期**： 
   - **解决方案**：检查客户的密码是否已过期。如有必要，指导他们重置密码的过程。

4. **账户不活跃**：
   - **解决方案**：长时间未使用的账户可能会被停用。建议客户联系支持以重新激活其账户。

5. **域名或用户ID错误**：
   - **解决方案**：某些账户要求包含域名或正确的用户ID格式。与客户核实他们是否按照需要包含正确的域名或格式。

6. **浏览器问题**：
   - **解决方案**：建议清除浏览器的缓存和cookie，或尝试通过不同的浏览器或隐身窗口登录。

7. **服务器或网络问题**：
   - **解决方案**：确认是否存在任何已知的故障或服务器问题可能影响登录服务。如果存在临时网络中断，建议客户稍后再试。

8. **多因素身份验证（MFA）问题**：
   - **解决方案**：如果启用了MFA，确保客户完成额外的身份验证步骤。如果遇到问题，帮助重置MFA。

9. **系统或安全更改**：
   - **解决方案**：最近的更新或系统安全更改可能会干扰登录尝试。建议客户确保其设备已更新到最新的软件和安全补丁。

鼓励客户仔细回顾他们的登录步骤，如果一切都失败了，请咨询支持团队以进行进一步调查。如果问题仍然存在，可能需要向他们保证处理一个工单以进行全面的系统检查。
```
**经理代理** 将工单分类为“技术”问题。**技术支持代理** 为该问题提供详细的故障排除步骤，例如检查凭证错误或解决账户锁定。

### 了解更多

### 来源

<https://docs.crewai.com/concepts/processes>

[https://docs.crewai.com/how\-to/sequential\-process](https://docs.crewai.com/how-to/sequential-process)

[https://docs.crewai.com/how\-to/hierarchical\-process](https://docs.crewai.com/how-to/hierarchical-process)

[https://www.ionio.ai/blog/how\-to\-build\-llm\-agent\-to\-automate\-your\-code\-review\-workflow\-using\-crewai](https://www.ionio.ai/blog/how-to-build-llm-agent-to-automate-your-code-review-workflow-using-crewai)

