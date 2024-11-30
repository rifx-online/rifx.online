---
title: "使用 LangGraph 框架以多代理方式实施复杂的 LLM 应用程序"
meta_title: "使用 LangGraph 框架以多代理方式实施复杂的 LLM 应用程序"
description: "LangGraph是一个基于LangChain的库，旨在创建有状态的多参与者LLM应用。它引入了循环计算能力，允许多个节点以动态方式协调计算过程。核心概念包括有状态图、节点和边，支持条件边以根据状态动态决定计算流程。通过示例代码，用户可以学习如何定义节点、构建工作流并实现复杂的AI系统，从而应对生成式人工智能的挑战。"
date: 2024-11-30T14:02:13Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*-jTqDmLTPnuXK-p2HrNgdw.png"
categories: ["Programming", "Generative AI", "Machine Learning"]
author: "Rifx.Online"
tags: ["LangGraph", "LangChain", "LLMs", "nodes", "edges"]
draft: False

---



> 将LangGraph添加到您的GenAI相关技能库中。这项技能可以立即使您能够创建复杂的AI系统。当然，前提是您需要了解LangChain的使用方法。



## 介绍

LangGraph 是一个强大的工具，旨在使用大型语言模型 (LLMs) 创建有状态的多参与者应用程序。通过扩展 LangChain 库的功能，LangGraph 使得多个链（或参与者）能够在各种计算步骤中以循环方式进行协调。在这篇博客文章中，我们将介绍 LangGraph，探讨其基本概念，并解决初学者常见的困惑。

## 什么是 LangGraph？

LangGraph 是一个建立在 LangChain 之上的库，专门设计用于将循环计算能力整合到您的 LLM 应用程序中。虽然 LangChain 允许定义计算链（有向无环图或 DAG），但 LangGraph 引入了添加循环的能力。这一增强功能促进了更复杂的类代理行为，使您能够在循环中调用 LLM，并根据其响应确定下一步行动。

## 关键概念

### 有状态图：

LangGraph 的核心概念是有状态图。图中的每个节点代表计算中的一个步骤，图保持一个状态，该状态在计算进展时不断更新。

**节点：**节点是 LangGraph 的基本构建块。每个节点代表一个特定的功能或计算步骤。您可以定义节点来执行各种任务，例如处理输入、做出决策或与外部 API 交互。

**边：**边连接图中的节点，定义计算的流程。LangGraph 支持条件边，允许根据图的当前状态动态确定下一个要执行的节点。

## 代码示例

### 安装

我期待你已经在你的 Python 环境中安装了 langchain 和 openai。如果没有，请创建一个新环境并安装以下库。

```python
### general packages
numpy
pandas
matplotlib
pydantic
tqdm
python-dotenv

### llm & other models
openai==1.12.0
sentence-transformers
faiss-cpu
chromadb

### frameworks
langchain
langchain-community
langchain-experimental
langchain-core
langchainhub
langgraph
```
使用 `pip install langgraph` 安装 LangGraph。

### 导入


```python
## usual libraries
from typing import List
from typing_extensions import TypedDict
import re
from pydantic import BaseModel, Field

## langchain related libraries
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser, StrOutputParser

## langgraph related libraries
from langgraph.graph import StateGraph, START, END
```

### 定义一个状态


```python
class AgentState(TypedDict):
    question: str
    llm_output: str
    documents: list[str]
    cnt_retries: int
```

### 节点方法

**节点 — 问题范围分类器**


```python
class QuestionScopeClass(BaseModel):
    """问题的范围"""
    score: str = Field(
        description="布尔值，用于检查问题是关于什么、哪里或比较。如果是 -> 'Yes'，否则为 'No'"
    )


def question_intent_classifier(state: AgentState):
    question = state["question"]
    state['cnt_retries'] = 0
    parser = JsonOutputParser(pydantic_object=QuestionScopeClass)
    output_format = parser.get_format_instructions()
    system = """您是一个问题分类器。检查问题是否与以下主题之一相关： 
        1. 定义
        2. 可用性
        3. 比较
        如果问题确实与这些主题相关，请回答“是”，否则请回答“否”。
        
        输出格式为: `{output_format}`
        """

    intent_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system),
            ("human", "用户问题: {question}"),
        ]
    )

    llm = openAI()
    grader_llm = intent_prompt | llm | parser
    result = grader_llm.invoke({"question": question, 'output_format': output_format})
    print(f"to_proceed: {result['score']}")
    state["on_topic"] = result['score']
    return state

## 启用条件边缘的路由
def on_topic_router(state: AgentState):
    print('ontopic router ... ')
    on_topic = state["on_topic"]
    if on_topic.lower() == "yes":
        return "on_topic"
    return "off_topic"
```
**节点 — 答案评分器**


```python
def grade_answer(state: AgentState):
    answer = state['llm_output']
    print('评分中 ...')    
    # print('生成的答案类型:', type(answer))
    # 答案中是否包含 '不知道'
    pattern = r'do not know|apolog|sorry'
    is_answer = '是' if not re.search(pattern, answer.lower()) else '否'
    state['is_answer_ok'] = is_answer
    print(f"答案评分: {is_answer}")
    return state

def is_answer_router(state: AgentState):
    print('评分路由 ... ')
    is_answer = state["is_answer_ok"]
    if state['cnt_retries'] >2:  # 允许最多 3 次重试 (0 到 2)
        return "hit_max_retries"
    if is_answer.lower() == "yes":
        return "is_answer"
    return "is_not_answer"
```
**节点 — 问题重述器**


```python
def question_rephraser(state: AgentState):
    print('重述中 ...')
    question = state['question']
    print(f"重试次数: {state['cnt_retries']+1}")
    llm = openAI()

    template = """
        您是一个擅长重述英语问题的专家。\
        您的任务是重述来自零售和供应链领域的问题。\
        在重述时，您可以执行以下操作：
        1. 从原始问题中提取关键词
        2. 根据需要扩展或创建问题的缩写
        3. 理解问题的意图
        4. 包括上述信息以生成原始问题的重述版本。\
        除重述问题外，不要输出任何其他内容。\
        
        问题: {question}
        """

    prompt = ChatPromptTemplate.from_template(
        template=template,
    )
    chain = prompt | llm | StrOutputParser()
    result = chain.invoke({"question": question})
    # print(result)
    state['question'] = result
    state['cnt_retries'] +=1
    return state
```
**节点 — 检索器（可选）**


```python
## 创建向量存储的检索器的某些函数
retriever = get_retriever(config_vector_store) 

def retrieve_docs(state: AgentState):
    question = state["question"]
    documents = retriever.invoke(input=question)
    state["documents"] = documents
    print(f"检索到的文档数量: {len(documents)}")
    return state
```
**节点 — 响应生成**


```python
def generate_answer(state: AgentState):
    question = state['question']
    context = [doc.page_content for doc in state['documents']]
    print('生成答案 ... ')
    llm = openAI()

    template = """
        您是一个客户支持聊天机器人，旨在回答来自零售和电子商务行业的用户查询。\
        保持对话和专业的语气。\
        请记住，提到的缩写与这些领域相关。\
        严格根据提供的上下文回答问题。\
        避免在响应中提到参考了上下文。\
        避免在生成的响应中使用“当然”和“看起来像”等词。\
        除答案外，不要输出任何其他内容。\
        
        {context}

        问题: {question}
        """

    prompt = ChatPromptTemplate.from_template(
        template=template,
    )
    chain = prompt | llm | StrOutputParser()
    result = chain.invoke({"question": question, "context": context})
    print(f"生成结果: {result}")
    state['llm_output'] = result
    return state
```
**节点 — 后备响应**


```python
def get_default_reply(state:AgentState):
    print('获取默认答案 ...')
    state['llm_output'] = '我没有答案。'
    return state
```

### 组成语言图

这是连接我们上面创建的不同节点的流程。这也通过利用上面定义的路由器启用条件边。

```python
workflow = StateGraph(AgentState)

## 添加节点
workflow.add_node('intent_classifier', question_intent_classifier)
workflow.add_node('retrieve_docs', retrieve_docs)
workflow.add_node('generate_answer', generate_answer)
workflow.add_node('grade_answer', grade_answer)
workflow.add_node('question_rephraser', question_rephraser)
workflow.add_node('default_reply', get_default_reply)

## 添加边，包括条件边
workflow.add_edge('intent_classifier', START)
workflow.add_conditional_edges(
    'intent_classifier', on_topic_router, 
    {
        'on_topic': 'retrieve_docs', 
        'off_topic': 'default_reply'
    }
)
workflow.add_edge('retrieve_docs', 'generate_answer')
workflow.add_edge('generate_answer', 'grade_answer')
workflow.add_conditional_edges(
    'grade_answer', is_answer_router,
    {
        'is_answer':END, 
        'is_not_answer':'question_rephraser', 
        'hit_max_retries':'default_reply'
    }
)
workflow.add_edge('question_rephraser', 'retrieve_docs')
workflow.add_edge('default_reply', END)

## 编译工作流
app = workflow.compile()
```
**可视化工作流**

```python
try:
    display(Image(app.get_graph(xray=True).draw_mermaid_png()))
except:
    pass
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*0Ybvw--nCGhXvSDgLLED5Q.jpeg)

**使用应用程序**

```python
query = "Capital of India"
response = app.invoke(input={"question": query})

print(result['llm_output'])
```

## 结论

通过理解这些基础元素，用户可以利用 LangGraph 设计更复杂、动态的 LLM 应用，超越简单的线性任务链。无论是开发基于代理的系统还是管理多步骤工作流程，LangGraph 都提供了一个强大的框架，以应对生成式人工智能不断发展的领域中的挑战。

