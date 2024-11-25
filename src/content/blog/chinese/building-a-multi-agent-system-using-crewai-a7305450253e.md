---
title: "使用 CrewAI 构建多代理系统"
meta_title: "使用 CrewAI 构建多代理系统"
description: "CrewAI是一个开源Python框架，旨在构建和管理多智能体AI系统，支持代理之间的协作。通过定义代理角色、分配任务及管理工作流程，CrewAI提升了AI代理在复杂任务中的效率。本文介绍了CrewAI的组件及其应用实例，包括构建网页搜索工具和推荐系统，展示了如何利用CrewAI实现个性化的客户体验和教育解决方案。"
date: 2024-11-25T15:00:22Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*FTlXqcTu5LWnFSLcmp39_w.png"
categories: ["Programming", "Machine Learning", "Data Science"]
author: "Rifx.Online"
tags: ["multi-agent", "collaboration", "Python", "framework", "specialization"]
draft: False

---





AI代理正在通过独立分析数据、做出预测和推荐最佳行动来改变各个行业。这些智能程序不仅擅长独立执行任务，还在与其他代理协作方面表现出色，使它们在销售、市场营销和教育等领域成为宝贵的资产。

例如，在市场营销中，AI代理可以评估客户偏好，识别个人兴趣，并制定个性化的活动，以促进客户参与和满意度。在教育中，这些代理同样可以被利用来个性化学习路径，通过将课程与学生的独特需求和目标对齐来增强教育体验。

CrewAI是一个开源框架，使开发人员能够组织协作的AI代理团队以完成复杂任务。它提供了一个Python库，用于配置具有定义角色的专业代理、分配任务并通过结构化工作流程管理协作。CrewAI在基于角色的代理设计、灵活的任务委派和团队合作方面表现出色，非常适合构建先进的多智能体系统。

本文将探讨CrewAI框架，解释它如何通过专业角色和结构化工作流程实现协作的多智能体系统。接下来，将使用CrewAI构建网络搜索工具和推荐系统。

## 开始使用

### 目录

* 什么是 CrewAI
* CrewAI 的组成部分
* 使用 CrewAI 进行实验
* 安装依赖
* 设置环境
* 1\. 构建网络搜索工具
* 导入依赖
* 爬取网站
* 将提取的文本写入文件
* 设置文本搜索工具
* 为任务创建代理
* 2\. 推荐活动生成
* 导入依赖
* 定义 LLM 模型
* 准备数据集
* 创建代理
* 为代理定义任务
* 执行 Crew
* 运行应用
* 资源

### 什么是 CrewAI

CrewAI 是一个开源的 Python 框架，旨在开发和管理多智能体 AI 系统，使用户能够构建协作的 AI 代理团队。与人类团队一样，这些代理可以进行沟通、协调并共同工作，以实现特定目标。CrewAI 通过为代理分配专业角色、支持自主决策和促进代理之间的通信，增强了这些系统的能力，使他们能够比单个代理更有效地解决复杂问题。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*rYQnVksjIFimsGIbf8DuNQ.png)

### CrewAI 组件

* **Agents:** Agents 是系统内的自主单元，旨在执行特定任务、做出决策并与其他代理动态互动。它们独立分析环境，响应输入，并使用各种工具，从简单的搜索功能到与 API 或区块链网络的集成。
* **Tasks:** Tasks 是分配给代理的具体职责，从数据分析到控制外部系统各不相同。每个任务可以细分为子任务，这些子任务可能需要专业工具或资源。任务管理涉及详细说明哪个代理负责、需要哪些工具以及相关流程，确保在基于代理的系统中实现高效工作流程和准确结果。
* **Crew:** A crew 是一个协调的代理组，组织起来以实现共同目标。Crew 的组成涉及根据代理的角色和技能选择代理、分配任务以及管理依赖关系，以确保任务按正确顺序执行。这种有组织的协作使得一个 crew 能够应对复杂挑战，利用每个代理的优势来提升性能和同步执行。
* **Tools:** Tools 指的是代理可以用来执行各种操作的技能或功能。这包括来自 CrewAI Toolkit 和 LangChain Tools 的资源，促进从基本搜索到复杂交互的所有操作，同时促进代理之间的有效团队合作。
* **Process:** Processes 负责协调代理如何执行任务，类似于人类团队中的项目管理。这些流程确保任务按照预定义策略有效分配和完成。

## 实验 CrewAI

在本节中，我们将深入探讨 CrewAI。重点将放在实验其组件并利用该框架开发两个解决方案（一个网络搜索工具和一个推荐系统）。

### 安装依赖

* 通过执行以下命令创建并激活虚拟环境。


```python
python -m venv venv
source venv/bin/activate #for ubuntu
venv/Scripts/activate #for windows
```
* 使用 pip 安装 `crewai-tools`、`crewai`、`langchain_openai` 和 `python-dotenv` 库。


```python
pip install crewai-tools crewai langchain_openai python-dotenv
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*pITkLAdGyNXsBO_R1PIiOQ.png)

### 设置环境

* 首先为您的项目创建一个新文件夹。选择一个反映项目目的的名称。
* 创建一个名为 `.env` 的文件。此文件将存储您的环境变量，包括 OpenAI 密钥。
* 打开 `.env` 文件，并添加以下代码以指定您的 OpenAI API 密钥：


```python
OPENAI_API_KEY=sk-proj-7XyPjkdaG_gDl0_...
```

## 1\. 构建一个网页搜索工具

在这个例子中，我们将使用 CrewAI 创建一个网页搜索工具。将使用三个 crewai 工具：`ScrapeWebsiteTool` 从网站抓取内容，`FileWriterTool` 将内容保存到文件中，以及 `TXTSearchTool` 用于搜索 RAG 内容。

### 导入依赖

* 创建一个名为 `app.py` 的文件
* 通过将以下代码添加到文件中来导入依赖项并设置项目的环境变量。


```python
from crewai_tools import ScrapeWebsiteTool, FileWriterTool, TXTSearchTool
from crewai import Agent, Task, Crew
import os
from dotenv import load_dotenv

## Load environment variables from the .env file
load_dotenv()
os.environ['OPENAI_API_KEY'] = os.getenv('OPENAI_API_KEY')
```

### 抓取网站

初始化 `ScrapeWebsiteTool`，这是一个用于从网站提取内容的工具。在这里，它被配置为抓取维基百科“人工智能”页面的内容。

```python
## Initialize the tool, potentially passing the session
tool = ScrapeWebsiteTool(website_url='https://en.wikipedia.org/wiki/Artificial_intelligence')  

## Extract the text
text = tool.run()
print(text)
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*nwJKTIiS4up9FwKw0RmgjA.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*_cnZmnePASavCYro0IV5lw.png)

### 将提取的文本写入文件

使用 `FileWriterTool` 将提取的内容保存到名为 `ai.txt` 的文件中。

```python
## Initialize the tool
file_writer_tool = FileWriterTool()
text = text.encode("ascii", "ignore").decode()
## Write content to a file in a specified directory
result = file_writer_tool._run(filename='ai.txt', content = text, overwrite="True")
print(result)
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*6GBEi_1mJoLRByjx_e2nOA.png)

### 设置文本搜索工具

设置 `TXTSearchTool` 以搜索 `ai.txt` 文件的内容。

```python
## Initialize the tool with a specific text file, so the agent can search within the given text file's content
tool = TXTSearchTool(txt='ai.txt')
```

### 为任务创建代理

创建一个数据分析师代理，角色为教育者。代理的任务是根据从文件搜索中检索到的文本回答问题：“什么是自然语言处理？”


```python
context = tool.run('What is natural language processing?')

data_analyst = Agent(
    role='Educator',
    goal=f'Based on the context provided, answer the question - What is Natural Language Processing? Context - {context}',
    backstory='You are a data expert',
    verbose=True,
    allow_delegation=False,
    tools=[tool]
)

test_task = Task(
    description="Understand the topic and give the correct response",
    tools=[tool],
    agent=data_analyst,
    expected_output='Give a correct response'
)

crew = Crew(
    agents=[data_analyst],
    tasks=[test_task]
)

output = crew.kickoff()
print(output)
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*lKar4EQT-KJBNe_FChpgRg.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*KF8XthHk_3pMn-Xx9TYkog.png)

## 2\. 推荐课程生成

想象一下，您经营一家教育咨询公司，旨在根据学生的学位、学术目标、爱好和计算机技能建议最佳课程。挑战在于决定向每位学生推荐哪些课程。

在这个例子中，将使用 CrewAI 创建一个推荐系统，以建议最适合学生的课程。

### 导入依赖

* 创建一个名为 `app.py` 的文件
* 通过将以下代码添加到文件中来导入依赖项并设置项目的环境变量。


```python
from crewai import Agent, Task, Crew, Process
from textwrap import dedent
import pandas as pd

import os
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
load_dotenv()
os.environ['OPENAI_API_KEY'] = os.getenv('OPENAI_API_KEY')
```

### 定义LLM模型

接下来，定义要使用的LLM模型以及相应的API密钥。可以使用任何选择的LLM模型；在此实例中，使用了`gpt-3.5-turbo-16k`。


```python
llm = ChatOpenAI(
    model="gpt-3.5-turbo-16k",
    temperature=0.1,
    max_tokens=8000
)
```

### 准备数据集

创建一个包含学生档案及推荐给学生的课程列表的csv文件。

```python
csv = '''Academic Goals, Major, Hobbies, Computer Skills, Interest in Languages, GPA
To become a software engineer, Computer Science, Gaming, Advanced, Spanish, 3.7
To study environmental science, Environmental Science, Hiking, Intermediate, French, 3.5
To pursue a career in medicine, Pre-Med, Playing the piano, Advanced, Spanish, 3.9
To major in psychology, Psychology, Reading, Intermediate, German, 3.6
To work in international relations, Political Science, Traveling, Basic, Mandarin, 3.8
To become a teacher, Education, Painting, Advanced, Spanish, 3.4
To study literature, English Literature, Writing, Intermediate, French, 3.9
To pursue a career in business, Business Administration, Playing soccer, Basic, Mandarin, 3.5
To become a biologist, Biology, Photography, Advanced, German, 3.7
To work in data analysis, Statistics, Cooking, Intermediate, Japanese, 3.6
'''

from io import StringIO
csvStringIO = StringIO(csv)
df_customers = pd.read_csv(csvStringIO, sep=",")

courses = '''
"Introduction to Computer Science" - Offered by Harvard University on edX
"Biology: Life on Earth" - Offered by Coursera
"Introduction to Psychology" - Offered by Yale University on Coursera
"Environmental Science" - Offered by University of Leeds on FutureLearn
"Introduction to Literature" - Offered by MIT on edX
"Medical Terminology" - Offered by University of Pittsburgh on Coursera
"Data Science and Machine Learning" - Offered by Stanford University on Coursera
"Cell Biology" - Offered by Massachusetts Institute of Technology on edX
"Positive Psychology" - Offered by University of North Carolina at Chapel Hill on Coursera
"Environmental Law and Policy" - Offered by Vermont Law School on Coursera
"Programming for Everybody (Getting Started with Python)" - Offered by University of Michigan on Coursera
"Anatomy: Human Neuroanatomy" - Offered by University of Michigan on Coursera
"Introduction to Cognitive Psychology" - Offered by Duke University on Coursera
"Climate Change and Health: From Science to Action" - Offered by Harvard University on edX
"English for Science, Technology, Engineering, and Mathematics" - Offered by University of Pennsylvania on Coursera
"An Introduction to American Law" - Offered by University of Pennsylvania on Coursera
"Introduction to Chemistry: Reactions and Ratios" - Offered by Duke University on Coursera
"Epidemiology: The Basic Science of Public Health" - Offered by University of North Carolina at Chapel Hill on Coursera
"Computer Science: Programming with a Purpose" - Offered by Princeton University on Coursera
"Introduction to Statistics and Data Analysis" - Offered by Rice University on Coursera
"Genes and the Human Condition (From Behavior to Biotechnology)" - Offered by University of Maryland on Coursera
"Ethics, Technology, and the Future of Medicine" - Offered by Georgetown University on edX
"Fundamentals of Immunology" - Offered by Harvard University
'''

### 创建代理

定义第一组的各种AI代理，每个AI代理需要一个角色、一个目标和一个背景故事。第二组将用于为建议给学生的课程生成推荐文本。

```python
## First crew agents
student_profiler = Agent(
  role='student_profiler',
  goal='''从有限的数据中，逻辑推导关于学生的结论。''',
  backstory='您是一位拥有数十年经验的心理学专家。',
  llm = llm,allow_delegation=False,verbose=True)

course_specialist = Agent(
     role='course specialist',
     goal='''将合适的课程与学生匹配。''',
     backstory='您对课程有着卓越的知识，并能说明它们对学生的价值。',
     llm = llm,allow_delegation=False,verbose=True)

Chief_Recommendation_Director = Agent(
     role="Chief Recomeendation Director",
     goal=dedent("""\监督您团队的工作，以确保其尽可能最佳，并与课程目标对齐，审查、批准，
  提出澄清问题或在必要时委派后续工作以做出决策"""),
     backstory=dedent("""\您是一个大型教育科技公司的首席推广官。您正在推出个性化广告活动，
          努力确保您的团队为客户制作最佳内容。"""),
     llm = llm,tools=[],allow_delegation=False, verbose=True)

## Second crew agents
campaign_agent = Agent(
     role="campaign_agent",
     goal=dedent("""\为广告活动开发引人注目且创新的内容，
  重点是客户特定的广告文案。"""),
     backstory=dedent("""\作为一家顶级数字营销机构的创意内容创作者，
   您擅长制作与潜在客户产生共鸣的广告。
   您的专长在于将营销策略转化为引人入胜的故事，
   吸引注意并激发购买行动。"""),
     llm = llm,allow_delegation=False, verbose=True)
```

### 为代理定义任务

让我们定义每个代理将执行的任务。

```python
## Tasks
def get_ad_campaign_task(agent, customer_description, courses):
  return Task(description=dedent(f"""\
    You're creating a targeted marketing campaign tailored to what we know about our student customers.

    For each student customer, we have to choose exactly three courses to promote in the next campaign.
    Make sure the selection is the best possible and aligned with the student customer,
   review, approve, ask clarifying question or delegate follow up work if
  necessary to make decisions. When delegating work send the full draft
  as part of the information.
    This is the list of all the courses participating in the campaign: {courses}.
    This is all we know so far from the student customer: {customer_description}.

    To start this campaign we will need to build first an understanding of our student customer.
    Once we have a profile about the student customers interests, lifestyle and means and needs,
    we have to select exactly three courses that have the highest chance to be bought by them.

    Your final answer MUST be exactly 3 courses from the list, each with a short description
    why it matches with this student customer. It must be formatted like this example:
     :
     :
     :
    """),
    agent=agent,expected_output='A refined finalized version of the marketing campaign in markdown format'
  )

def get_ad_campaign_written_task(agent, selection):
    return Task(description=dedent(f"""\
    You're creating a targeted marketing campaign tailored to what we know about our student customer.

    For each student customer, we have chosen three courses to promote in the next campaign.
    This selection is tailored specifically to the customer: {selection},

    To end this campaign succesfully we will need a promotional message advertising these courses  to the student customer with the ultimate intent that they buy from us.
    This message should be around 3 paragraphs, so that it can be easily integrated into the full letter. For example:
    Interested in learning data science, get yourself enrolled in this course from Harvard University.
    Take Your career to the next level with the help of this course.

    You need to review, approve, and delegate follow up work if necessary to have the complete promotional message. When delegating work send the full draft
  as part of the information.

    Your final answer MUST include the 3 courses from the list, each with a short promotional message.
    """),
    agent=agent,expected_output='A refined finalized version of the marketing campaign in markdown format'
  )
```

### 执行团队

让我们对学生档案数据集的每一行执行整个过程。


```python
df_output_list = [] 

for index, row in df_customers.iterrows():
  print('############################################## '+ str(index))
  customer_description = f'''
  Their academic goals are {row['Academic Goals']}.
  Their major is in {row[' Major']}.
  Their Hobbies are {row[' Hobbies']}.
  Their computer skills are {row[' Computer Skills']}.
  Their interest in languages are {row[' Interest in Languages']}.
  Their GPA is {row[' GPA']}.
  '''
  print(customer_description)
  
  # Define Task 1 for selecting top 3 relevant courses
  task1 = get_ad_campaign_task(Chief_Recommendation_Director ,customer_description, courses)
  # start crew
  targetting_crew = Crew(
    agents=[student_profiler, course_specialist ,Chief_Recommendation_Director ],
    tasks=[task1],
    verbose=True, 
  process=Process.sequential # Sequential process will have tasks executed one after the other and the outcome of the previous one is passed as extra content into this next.
  )
  targetting_result = targetting_crew.kickoff()
  
  # Define Task 2 for Generating Recommendation Campaign
  task2 = get_ad_campaign_written_task(Chief_Recommendation_Director ,targetting_result)
  copywriting_crew = Crew(
    agents=[campaign_agent,Chief_Recommendation_Director ],
    tasks=[task2],
    verbose=True, 
  process=Process.sequential # Sequential process will have tasks executed one after the other and the outcome of the previous one is passed as extra content into this next.
  )
  copywriting_result = copywriting_crew.kickoff()

  # Create one line in output df
  df_output_list.append({'customer':customer_description,
                         'targeted_courses':targetting_result,
                         'promo_msg':copywriting_result,
                        })

## Collect results in dataframe
df_output = pd.DataFrame(df_output_list)
print(df_output)
```

### 运行应用程序

让我们使用以下代码运行应用程序。

```python
python app.py
```
在 pandas 数据框中的输出如下所示。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*2JJJM-1J4Qf0pMeAUc0d0g.png)

让我们详细看看一个学生的个人资料和使用 Crew AI 生成的活动。

考虑以下学生的个人资料：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*LAFkqj5T3OF2FmXr108A0g.png)

课程专家代理根据学生的个人资料选择了以下课程。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*QrIlvKnrES6bkkRvtlhGkw.png)

第二组提供了以下推荐消息。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ETJ0pjt2arYYqMFlU6xQ9w.png)

如果您希望创建无需编码的 AI 代理和助手，**Runbear** 通过提供一个无代码平台，使其变得非常简单，该平台与 Slack、MS Teams、HubSpot 和 Zendesk 无缝集成，让您可以在几分钟内为您的工作区设置自定义 AI 助手。

*感谢您阅读这篇文章！！*

*感谢 Gowri M Bhatt 审阅内容。*

如果您喜欢这篇文章，请点击鼓掌按钮 👏 并分享以帮助其他人找到它！

本教程的完整源代码可以在此处找到，

### 资源

* [介绍 — CrewAI](https://docs.crewai.com/introduction)
* [alejandro\-ao/crewai\-crash\-course: 教程：CrewAI 介绍](https://github.com/alejandro-ao/crewai-crash-course)
* [多智能体系统及其构建方法](https://learn.crewai.com/)
* [crewAIInc/crewAI: 用于协调角色扮演、自主 AI 代理的框架。通过促进协作智能，CrewAI 使代理能够无缝协作，处理复杂任务。](https://github.com/crewAIInc/crewAI)

