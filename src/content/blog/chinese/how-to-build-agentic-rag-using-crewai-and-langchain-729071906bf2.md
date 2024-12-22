---
title: "如何使用 CrewAI 和 Langchain 构建代理 RAG"
meta_title: "如何使用 CrewAI 和 Langchain 构建代理 RAG"
description: "文章介绍了如何利用CrewAI和Langchain构建Agentic RAG（检索增强生成）框架。Agentic RAG通过智能代理动态分析和处理用户查询，提升了查询响应的灵活性和准确性。文章详细说明了所需的Python库安装、API密钥配置、代理和工具的定义，以及如何通过定义的任务和团队协调代理的工作流程。最终，通过示例展示了如何使用该框架处理不同类型的用户查询。"
date: 2024-12-22T04:00:01Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*67w_AjJ_xBAs_g2td-rAUA.png"
categories: ["Generative AI", "Machine Learning", "Natural Language Processing"]
author: "Rifx.Online"
tags: ["RAG", "modular", "agents", "retrieval", "generation"]
draft: False

---



在快速发展的 AI 领域，提供准确、上下文感知的用户查询响应能力是一个游戏改变者。检索增强生成（RAG）作为一种强大的范式，结合了从外部来源检索相关信息与大型语言模型（LLMs）的生成能力。然而，随着查询变得越来越复杂和多样化，静态 RAG 设置可能并不总是足够。这就是 **Agentic RAG** 发挥作用的地方。

Agentic RAG 引入了一个智能的模块化框架，其中专门的代理协同工作，以动态分析、路由和回答用户查询。每个代理都有特定的角色——无论是路由问题、从向量存储中检索信息、进行网络搜索，还是使用 LLM 生成响应。这种基于代理的设计不仅增强了灵活性，还提高了 RAG 过程的效率和准确性。

## 所需安装

要设置和运行 Agentic RAG 框架，您需要安装几个构成此实现基础的 Python 库。以下是所需的安装及其用途：

### 1\. 安装 CrewAI

CrewAI 提供了创建代理、任务和工作流程的基础设施，能够无缝构建模块化和智能的基于代理的系统。

```python
pip install crewai
```

### 2\. 安装 LangChain OpenAI

LangChain 提供了与 LLMs 一起工作的工具，允许高效地链接任务和查询。需要特定的 `langchain_openai` 包以实现 ChatGPT 集成。

```python
pip install langchain_openai
pip install langchain_community
```

### 验证 API 密钥

确保您已配置必要的 API 密钥：

* **OpenAI API 密钥** 用于 LLM。
* [**Serper API 密钥**](https://serper.dev/) 用于基于 Google 搜索的查询。


```python
OPENAI_API_KEY=<your_openai_api_key>
SERPER_API_KEY=<your_serper_api_key>
```

## 导入必要的库:


```python
from langchain_openai import ChatOpenAI
import os
from crewai_tools import PDFSearchTool
from crewai_tools  import tool
from crewai import Crew
from crewai import Task
from crewai import Agent
from crewai.tools import BaseTool
from pydantic import Field
from langchain_community.utilities import GoogleSerperAPIWrapper
```

## 定义 LLM:


```python
llm=ChatOpenAI(model_name="gpt-4o-mini", temperature=0)
```

## 定义代理：

```python
Router_Agent = Agent(
  role='Router',
  goal='将用户问题路由到向量存储或网络搜索',
  backstory=(
    "您是将用户问题路由到向量存储或网络搜索的专家。"
    "对于有关变压器或差分变压器的问题，请使用向量存储。"
    "对于最新新闻或近期主题的问题，请使用网络搜索。"
    "对于一般性问题，请使用生成。"
  ),
  verbose=True,
  allow_delegation=False,
  llm=llm,
)
Retriever_Agent = Agent(
role="Retriever",
goal="使用从向量存储中检索到的信息回答问题",
backstory=(
    "您是问答任务的助手。"
    "使用检索到的上下文中的信息回答问题。"
    "您必须提供清晰简洁的答案。"
),
verbose=True,
allow_delegation=False,
llm=llm,
)


```
`Router_Agent`**:**

* **角色：** 确定处理用户查询的最佳工具。
* **逻辑：** 对于特定领域的查询（例如，“变压器”或“差分变压器”），路由到**向量存储**。对于近期主题或新闻，路由到**网络搜索**。对于一般性问题，使用**生成**。
* **详情：** 不委派任务，并根据查询提供清晰的路由。

`Retriever_Agent`**:**

* **角色：** 根据路由决策获取并提供答案。
* **逻辑：** 根据查询类型使用向量存储、网络搜索或生成工具。
* **详情：** 专注于提供清晰、简洁的答案，而不进行额外的委派。

这两个代理共同简化了RAG过程，通过高效分析和处理查询。

## 定义工具：

```python
search = GoogleSerperAPIWrapper

class SearchTool(BaseTool):
    name: str = "Search"
    description: str = "用于基于搜索的查询。使用此工具查找有关市场、公司和趋势的最新信息。"
    search: GoogleSerperAPIWrapper = Field(default_factory=GoogleSerperAPIWrapper)

    def _run(self, query: str) -> str:
        """执行搜索查询并返回结果"""
        try:
            return self.search.run(query)
        except Exception as e:
            return f"执行搜索时出错: {str(e)}"
class GenerationTool(BaseTool):
    name: str = "Generation_tool"
    description: str = "用于基于通用的查询。使用此工具根据您自己的知识查找信息。"
    #llm: ChatOpenAI(model_name="gpt-4o-mini", temperature=0)

    def _run(self, query: str) -> str:
      llm=ChatOpenAI(model_name="gpt-4o-mini", temperature=0)
      """执行搜索查询并返回结果"""
      return llm.invoke(query)
generation_tool=GenerationTool()
web_search_tool = SearchTool()
```

### 1\. SearchTool

**目的：** 处理基于搜索的查询以检索当前信息（例如，市场趋势、公司详细信息或一般在线信息）。

**关键组件：**

* **名称：** `"Search"`
* **描述：** 突出其用于与搜索相关的查询。
* **核心机制：** 使用 `GoogleSerperAPIWrapper` 执行查询。
* **错误处理：** 捕获并返回查询失败时的错误消息。

**用法：** 适用于需要最新信息的实时动态搜索。

### 2\. GenerationTool

**目的：** 处理基于知识的通用查询，使用 LLM。

**关键组件：**

* **名称：** `"Generation_tool"`
* **描述：** 用于根据预训练知识生成响应。
* **核心机制：** 实例化一个 `ChatOpenAI` 对象（配置为 `gpt-4o-mini` 和 `temperature=0` 以获得确定性输出）。通过 `llm.invoke(query)` 执行查询。

**用法：** 最适合不依赖外部数据，而是依赖推理或静态知识的查询。

`web_search_tool = SearchTool()`: 创建一个 `SearchTool` 实例以进行实时查询。

`generation_tool = GenerationTool()`: 创建一个 `GenerationTool` 实例以进行生成任务。

这些工具无缝集成到 RAG 框架中，使代理能够根据所需信息的性质动态路由和回答查询。

### 3\. PDF搜索工具：

PDF文件链接：[https://arxiv.org/pdf/2410\.05258](https://arxiv.org/pdf/2410.05258)，您可以根据需要使用任何PDF文件。

```python
pdf_search_tool = PDFSearchTool(
    pdf="differential transformer.pdf",
)
```
该代码片段初始化了一个 `PDFSearchTool`，以便在特定的PDF文件中进行搜索。以下是简要说明：

`PDFSearchTool` **概述**

* **目的：** 允许从提供的PDF文件中查询和检索信息。

**初始化：**

* 工具通过PDF文件的路径进行实例化，在这种情况下为 `"differential transformer.pdf"`。
* 这意味着与该PDF内容相关的查询将被路由到这里。

**工作原理**

* 当集成到框架中（例如，在 `retriever_task` 中）：
* 如果确定查询需要进行 **向量存储搜索**（基于“transformer”或“differential transformer”等关键词），则将使用 `PDFSearchTool`。
* 该工具解析并搜索指定PDF的内容，以提供相关信息。

## 定义代理任务：

```python
router_task = Task(
    description=("分析问题中的关键词 {question}"
    "根据关键词决定它是否适合进行向量存储搜索、网络搜索或生成。"
    "如果适合向量存储搜索，则返回单词 'vectorstore'。"
    "如果适合网络搜索，则返回单词 'websearch'。"
    "如果适合生成，则返回单词 'generate'。"
    "不要提供任何其他前言或解释。"
    ),
    expected_output=("根据问题给出选择 'websearch'、'vectorstore' 或 'generate'"
    "不要提供任何其他前言或解释。"),
    agent=Router_Agent,
   )

retriever_task = Task(
    description=("根据路由任务的响应，使用相应的工具提取问题 {question} 的信息。"
    "如果路由任务的输出是 'websearch'，则使用 web_search_tool 从网络中检索信息。"
    "如果路由任务的输出是 'vectorstore'，则使用 rag_tool 从向量存储中检索信息。"
    "否则，如果路由任务的输出是 'generate'，则根据你自己的知识生成输出。"
    ),
    expected_output=("你应该分析 'router_task' 的输出。"
    "如果响应是 'websearch'，则使用 web_search_tool 从网络中检索信息。"
    "如果响应是 'vectorstore'，则使用 rag_tool 从向量存储中检索信息。"
    "如果响应是 'generate'，则使用 generation_tool。"
    "否则，如果你不知道答案，就说我不知道。"

    "返回清晰简洁的文本作为响应。"),
    agent=Retriever_Agent,
    context=[router_task],
    tools=[pdf_search_tool,web_search_tool,generation_tool],
)
```

### 1\. router\_task

**目的:** 根据用户查询的内容决定如何路由。

**描述逻辑:**

* 分析查询中的关键词 (`{question}`)。
* 确定查询是否应该：
* 使用 **vectorstore**（如果与变压器或技术术语如“微分变压器”相关）。
* 执行 **web search**（如果问题涉及最近的话题、新闻或动态内容）。
* 使用 **generation**（对于一般的、基于知识的查询）。
* 返回一个单词 (`'vectorstore'`, `'websearch'`, 或 `'generate'`) 作为路由决策。
* **使用的代理:** `Router_Agent`.

### 2\. retriever\_task

**目的：** 根据 `router_task` 的输出执行适当的工具或操作。

**描述逻辑：**

* 从 `router_task` 读取路由决策：
* `'websearch'`**:** 使用 `web_search_tool` 从网络上检索信息。
* `'vectorstore'`**:** 使用 `rag_tool`（PDF 搜索或其他基于向量的检索）进行特定领域的查询。
* `'generate'`**:** 使用 `generation_tool` 利用 LLM 能力生成响应。
* 如果以上都不适用，则输出 `"I don't know"`。
* 确保响应简洁且与上下文相关。
* **使用的代理：** `Retriever_Agent`。
* **使用的工具：** 结合 `pdf_search_tool`、`web_search_tool` 和 `generation_tool`。

这些任务通过 `Router_Agent` 和 `Retriever_Agent` 协同工作，以高效和智能地处理各种查询。

## 定义团队：

```python
rag_crew = Crew(
    agents=[Router_Agent, Retriever_Agent], 
    tasks=[router_task, retriever_task],
    verbose=True,

)
```
`rag_crew` 定义了一个 **Crew** 实例，用于协调 **Agentic RAG 框架** 中代理与任务之间的交互。

**协调：** `rag_crew` 确保代理与任务之间的无缝协作。

**工作流程：**

* 查询通过 `Router_Agent` 使用 `router_task` 进行处理。
* `router_task` 的决策由 `Retriever_Agent` 使用 `retriever_task` 执行。

该 **Crew** 作为管理整个 RAG 过程的中心枢纽，使其模块化、高效，并易于扩展以满足未来的能力需求。



## 使用团队：

```python
result = rag_crew.kickoff(inputs={"question":"What is diffrential transformer?"})
```
输出：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*sbs-Jr1N10NKnDhrWsvY0w.png)


```python
result = rag_crew.kickoff(inputs={"question":"What is AI?"})
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*b6glCrRUOyeRU5WCnusDCA.png)


```python
result = rag_crew.kickoff(inputs={"question":"What is weather in bengaluru?"})
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*6LHzzZPUx1Q470V4CeKq1g.png)

