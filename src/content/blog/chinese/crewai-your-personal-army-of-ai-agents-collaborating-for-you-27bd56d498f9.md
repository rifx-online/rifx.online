---
title: "CrewAI：由人工智能代理组成的个人军队，为您协同工作"
meta_title: "CrewAI：由人工智能代理组成的个人军队，为您协同工作"
description: "CrewAI是一个多代理框架，旨在促进AI代理之间的协作，类似于团队运作。它允许创建代理执行复杂任务，如移动应用开发。框架包括代理、任务、工具、过程和小组等概念，支持顺序任务执行。通过示例代码，展示了如何定义代理角色和任务，并生成相关输出文件。此外，CrewAI与Tavily结合使用，增强了搜索和生成能力，适用于自主智能代理的开发。其可扩展性和与开源大型语言模型的集成能力，提升了多智能体应用的开发效率。"
date: 2024-12-07T12:39:52Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*VF65WeGkHcmWtuZT2zKWFg.jpeg"
categories: ["Programming", "Machine Learning", "Autonomous Systems"]
author: "Rifx.Online"
tags: ["collaboration", "agents", "tasks", "LangChain", "multi-agent"]
draft: False

---





**CrewAI框架是什么？**

AI协作的力量有太多值得提供的。CrewAI旨在使AI代理能够承担角色、共享目标，并以一个紧密合作的单位运作——就像一支运转良好的团队。无论您是在构建智能助手平台、自动化客户服务团队，还是多代理研究团队，CrewAI都为复杂的多代理交互提供了基础。

换句话说，CrewAI是一个代理框架，允许我们创建代理来帮助我们解决简单（优化）或复杂的任务（例如开发游戏）。AI代理承担角色，分享目标，并以一个紧密合作的单位运作，就像一支运转良好的团队。

我们将看一个如何使用它的例子 :)

> *如果您对提高生产力和机器学习技能的实用技巧感兴趣，请随时订阅我们的[LinkedIn页面](https://www.linkedin.com/company/lilmod-ai/)。我们每天分享该领域的精彩新闻，每周发布一篇新文章。*

在进行实现之前，让我们简要了解一下涉及的不同概念。

**A/ 代理**

代理代表团队（小组）的成员。它有一系列属性，我们可以将其分配给它，以帮助指导它的工作。

**B/ 任务**

任务只是代理需要完成的事情。它负责任务的执行。我们可以给它一个任务描述，以提供更多指导。

**C/ 工具**

工具是代理可以利用的技能或功能，以执行各种操作。这包括来自CrewAI工具包和LangChain工具的工具，能够从简单的搜索到复杂的交互以及代理之间的有效协作。

**D/ 过程**

过程协调代理的任务执行，类似于人类团队中的项目管理。这些过程确保任务被有效分配和执行，与预定义的策略保持一致。

**E/ 小组**

小组代表一个协作的代理组，共同工作以实现一组任务。每个小组定义任务执行、代理协作和整体工作流程的策略。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*W6ix1fdlcoce_AG8zLWLCA.png)

***要求：**

*您需要一个OpenAI密钥并选择GPT模型（我使用gpt-4）。*

```python
import os
from crewai import Agent, Task, Crew, Process # pip install crewai
from dotenv import load_dotenv
from CalculatorTool import calculate

os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY") # In .env file 
os.environ["OPENAI_MODEL_NAME"] = "gpt-4"
```
我们的目标是实现一个应用程序，使用3个代理来规划和开发移动应用程序的功能，以及设计其用户界面和编写技术文档（分别）。

```python
user_input = input("Enter the main features in the mobile app: ") # User

## Agent 1
feature_planner = Agent(
    role="Feature Planner",
    goal="You can design and outline the key features of the mobile app based on the input provided.",
    backstory="You are a product manager skilled in outlining app features that align with user needs and business goals.",
    verbose=True
)

## Agent 2
uiux_designer = Agent(
    role="UI/UX Designer",
    goal="You can create a user-friendly design for the app, considering user experience and usability.",
    backstory="""You are an experienced designer with a strong focus on creating intuitive and visually appealing interfaces.""",
    verbose=True
)

## Agent 3
technical_writer = Agent(
    role="Technical Writer",
    goal="You are tasked with writing detailed technical documentation for developers based on the app's design and features.",
    backstory="You are a seasoned technical writer with extensive experience in creating clear and concise documentation for software developers.",
    verbose=True
)
```
*backstory*和*verbose*参数对于理解流程非常重要：

*backstory*：*feature_planner*代理（例如）被描述为一名产品经理，擅长定义满足用户需求和商业目标的功能。*verbose=True*：这表示代理提供有关其过程或操作的额外细节。

**任务定义：**

我们将创建三个任务：

* 列出应用程序的主要功能，按类型分类（例如，身份验证、通知等）。-
* 生成用户界面的详细线框或描述，并说明UX决策的理由。
* 为开发人员创建技术文档，解释应用程序架构以及如何实现这些功能。

```python
task1 = Task(
    description=f"Design the core features of the mobile app based on the following input: {app_features_input}",
    expected_output="List the key features of the app, categorized by functionality (e.g., authentication, notifications, etc.).",
    agent=feature_planner
)

task2 = Task(
    description="Design the user interface and experience (UI/UX) based on the planned features.",
    expected_output="Generate a detailed wireframe or description of the user interface, along with a rationale for UX decisions.",
    output_file="uiux_design.txt",
    agent=uiux_designer
)

task3 = Task(
    description="Write the technical documentation detailing how the features should be implemented, including architecture diagrams, API endpoints, and data flow.",
    expected_output="Create a technical document for developers that explains the app's architecture and how to implement the features.",
    output_file="technical_documentation.txt",
    agent=technical_writer
)
```
当您运行代码时，‘`technical_documentation.txt`’文件将会出现，这就是为什么创建*output_file*参数很重要。

剩下的就是创建一个由我们的两个代理组成的小组。

**创建团队和管理过程：**

任务按顺序（顺序）进行。使用之前定义的代理和任务创建Crew对象。

```python
crew = Crew(
    agents=[feature_planner, uiux_designer, technical_writer],
    tasks=[task1, task2, task3],
    process=Process.sequential,  # The tasks are carried out in the order
    verbose=True
)

print(crew.kickoff())  # Launching process
```
假设我的输入是：*‘通过电子邮件和社交网络进行身份验证，推送通知以获取特别优惠，互动地图以查找附近的商店。任务管理与提醒，分享任务给其他用户，以及添加子任务的能力。卡路里跟踪，根据食材的食谱建议，以及忠诚积分系统。’*

**结果：**

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Q2Jn3s1iu84SNBmtw7gdlQ.png)

让我们显示*technical_documentation.txt*作为示例：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*9kpAxfHOghEi3LRNafBiNA.png)

## 使用 Crew AI 和 Tavily 构建 Agentic RAG（与 LLM Meta AI）

在本节中，我们探索使用 Crew AI 和 Tavily 的 RAG 代理的世界。我们将展示如何通过将搜索机制与生成模型集成来提高 AI 能力，以设计自主和智能的代理。

***要求* :**

您需要安装以下库（如果尚未安装）：

* crewai \& crewai\_tools
* langchain \& langchain\-groq
* sentence\-transformers

获取 Groq 和 Tavily API 的密钥。

```python
from langchain_openai import ChatOpenAI
import os
from crewai_tools import PDFSearchTool  # import PDF file
from langchain_community.tools.tavily_search import TavilySearchResults
from crewai_tools  import tool
from crewai import Crew
from crewai import Task
from crewai import Agent
from google.colab import userdata

os.environ['GROQ_API_KEY'] = userdata.get('GROQ_API_KEY')
os.environ['TAVILY_API_KEY'] = userdata.get('TAVILY_API_KEY')

llm = ChatOpenAI(
    openai_api_base="https://api.groq.com/openai/v1",
    openai_api_key=os.environ['GROQ_API_KEY'],
    model_name="llama3-8b-8192",
    temperature=0.1,
    max_tokens=1000,
)

rag = PDFSearchTool(pdf='doc.pdf',
    config=dict(
        llm=dict(
            provider="groq", # or google, openai, anthropic, llama2, ...
            config=dict(
                model="llama3-8b-8192",
                # temperature=0.5,
                # top_p=1,
                # stream=true,
            ),
        ),
        embedder=dict(
            provider="huggingface", # or openai, ollama, ...
            config=dict(
                model="BAAI/bge-small-en-v1.5",
                #task_type="retrieval_document",
                # title="Embeddings",
            ),
        ),
    )
)

#我们通过使用 rag 模型读取相关内容来搜索 PDF 文件的内容

rag.run("Sporo Health 是做什么的？") # 根据 PDF

```
现在，让我们在网上查找关于上述问题的一些结果。

```python
web_search = TavilySearchResults(k=3) # 至少搜索 3 个链接
web_search.run("Sporo Health 是做什么的？")
```
我们将创建一个路由函数，该函数分析一个问题（作为参数接收）并决定使用哪个工具或方法来回答它。

```python
@tool
def router_tool(question):
  """路由函数"""
  if 'Sporo Health' in question:
    return 'vectorstore'
  else:
    return 'web_search'
```
我们将创建两个代理，其中一个称为 *Router\_Agent*，旨在将用户的问题引导到与增强搜索生成（ASG）相关的向量搜索或其他问题的网页搜索，同时对关键词保持灵活性；另一个称为 *Gradent\_Agent*，旨在根据与用户问题相关的关键词的存在评估检索到的文档的相关性，同时确保提供的答案是相关的。

现在，让我们创建两个任务：

* *router\_task* : 分析问题中的关键词，并通过 Router\_Agent 代理和 router\_tool 工具返回“vectorstore”或“websearch”，而不做任何解释。
* *retriever\_task* : 使用 router\_task 的响应根据适当的工具提取信息：对于“websearch”输出使用 web\_search\_tool，针对“vectorstore”输出使用 rag\_tool。Retriever\_Agent 然后必须提供清晰简洁的响应。

```python
router_task = Task(
    description=("分析问题 {question} 中的关键词"
    "根据关键词决定它是否适合进行向量搜索或网页搜索。"
    "如果适合向量搜索，则返回一个单词 'vectorstore'。"
    "如果适合网页搜索，则返回一个单词 'websearch'。"
    "不要提供任何其他前言或解释。"
    ),
    expected_output=("根据问题给出二元选择 'websearch' 或 'vectorstore'"
    "不要提供任何其他前言或解释。"),
    agent=Router_Agent,
    tools=[router_tool],
)

retriever_task = Task(
    description=("根据路由任务的响应提取问题 {question} 的信息，借助相应的工具。"
    "如果路由任务输出为 'websearch'，则使用 web_serach_tool 从网络中检索信息。"
    "如果路由任务输出为 'vectorstore'，则使用 rag_tool 从向量存储中检索信息。"
    ),
    expected_output=("您应该分析 'router_task' 的输出。"
    "如果响应为 'websearch'，则使用 web_search_tool 从网络中检索信息。"
    "如果响应为 'vectorstore'，则使用 rag_tool 从向量存储中检索信息。"
    "返回清晰简洁的文本作为响应。"),
    agent=Retriever_Agent,
    context=[router_task],
)
```
太好了！剩下的就是 crew：

```python
crew = Crew(
    agents=[Router_Agent, Retriever_Agent, Grader_agent, hallucination_grader, answer_grader],
    tasks=[router_task, retriever_task, grader_task, hallucination_task, answer_task],
    verbose=True,

)

print(result = rag_crew.kickoff(inputs={"question":"Sporo 是否简化了患者病历审查？"})
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*v5BlzKM-HFowvifRxLBmtQ.png)

***输出 :*** 是的，Sporo 简化了患者病历审查。

## 结论

CrewAI 在其可扩展功能方面具有明显优势，这些功能由 LangChain 提供支持，包括与各种工具的集成和对开源大型语言模型的支持。其管理顺序编排的能力可能会显著提升多智能体应用的开发。

## 参考文献 :

* <https://github.com/crewAIInc/crewAI>
* [https://github.com/AIAnytime/Agentic\-RAG\-using\-Crew\-AI](https://github.com/AIAnytime/Agentic-RAG-using-Crew-AI)
* <https://github.com/crewAIInc/crewAI/tree/main/tests>

