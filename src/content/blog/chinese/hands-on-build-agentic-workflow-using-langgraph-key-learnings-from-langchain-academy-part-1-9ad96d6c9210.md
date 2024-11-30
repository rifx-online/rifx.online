---
title: "实践：使用 LangGraph 构建代理工作流（Langchain-academy 的主要学习内容） | 第 1 部分"
meta_title: "实践：使用 LangGraph 构建代理工作流（Langchain-academy 的主要学习内容） | 第 1 部分"
description: "本文介绍了LangGraph的基本概念及其在构建自主代理工作流中的应用。LangGraph是一个开源框架，旨在提供更高的精确度和控制力，支持复杂的代理行为。文章详细阐述了状态、节点和边的定义，以及持久性、状态归约器和模式设计等关键要素。最后，通过构建一个天气分析机器人示例，展示了如何在LangGraph中实现代理工作流，强调了其动态决策和迭代能力。"
date: 2024-11-30T13:57:18Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*yEVfPsqzZO9PiB-9sW1cHg.png"
categories: ["Programming", "Machine Learning", "Chatbots"]
author: "Rifx.Online"
tags: ["LangGraph", "LLMs", "workflows", "stateful", "graphs"]
draft: False

---



## 介绍

Langchain 最近推出了一门[令人印象深刻的课程](https://academy.langchain.com/courses/intro-to-langgraph)，专注于 LangGraph 及其在开发强大的代理和多代理工作流中的关键特性。

在本系列中，我们将探索课程中的基本见解，并创建利用代理工作流的应用程序。在第一部分中，我们将涵盖 LangGraph 的基本概念以及如何入门。第二部分将专注于使用 LangGraph 开发一个全面的端到端基于代理的应用程序。

## 什么是代理工作流？

在大多数基于LLM的应用中，任务通常以顺序方式组织，称为“链”。虽然这种方法确保了可靠性和一致的执行，但它可能有些僵化。

> *如果我们允许LLM决定下一步行动呢？*

代理工作流提供了一种迭代和协作的模型，将与LLM的交互转变为一系列可管理的、可细化的步骤。这种方法使得在任务完成过程中能够持续改进和适应。**一个系统越“代理”，LLM决定系统如何行为的能力就越强。**

## 什么是 LanGraph？

LangGraph 是一个 [开源框架](https://langchain-ai.github.io/langgraph/)，旨在创建代理和多代理应用程序。与 LangChain 包不同，LangGraph 的核心理念是为开发者提供更高的精确度和控制力，以应对代理工作流的复杂性，使其非常适合现实世界系统的复杂性。

虽然 LangChain 促进了线性工作流的有向无环图（DAG）的创建，**LangGraph 通过允许引入循环进一步发展这一点**。这些循环对于开发复杂的类代理行为至关重要，使 LLM 能够在一个过程中不断迭代，并根据变化的条件动态决定下一步行动。

## LangGraph的基本概念

* **状态：** LangGraph的核心是状态图的概念，其中每个节点代表计算中的一个步骤。它确保每个步骤可以访问来自先前步骤的相关信息，从而促进基于整个过程累积数据的动态决策。
* **节点：** 节点是LangGraph的基础元素。每个节点代表一个函数或计算步骤，可以根据工作流程的需要进行定制，以执行各种操作。
* **边：** 边连接图中的节点，定义计算流程。LangGraph支持条件边，能够根据图的当前状态动态确定下一个要执行的节点。

## 在 LangGraph 中构建 Agentic Flow 之前需要了解的事项

### 持久性：

* LangGraph 可以使用检查点工具在每一步后自动保存图状态。
* 这个内置的持久性层为我们提供了内存，使 LangGraph 能够从上一个状态继续。
* 我们需要做的就是简单地用检查点工具编译图，我们的图就有了内存！


```python
#One of the easiest checkpointers to use is the `MemorySaver`, an in-memory key-value store for Graph state.
#We can also use external DB 
from langgraph.checkpoint.memory import MemorySaver
memory = MemorySaver() 
graph_memory = builder.compile(checkpointer=memory)
```

### 状态归约器：

* 归约器定义了如何执行更新。
* 通过使用 `Annotated` 类型，您可以指定一个归约器函数。
* 例如，如果您想通过追加值而不是覆盖它们来更新并行节点中的图状态，可以使用像 `operator.add` 这样的归约器。这个函数来自 Python 的内置 operator 模块，当应用于列表时执行列表连接。

```python
from operator import add
from typing import Annotated

class State(TypedDict):
  foo: Annotated[list[int], add]
```

### 状态模式：

* 在定义 LangGraph `StateGraph` 时，使用状态模式来表示图形将使用的结构和数据类型。
* 所有节点都应遵循此模式进行通信。LangGraph 在定义状态模式时提供了灵活性，以适应各种 Python 和验证方法。

```python
## TypedDict
#As we mentioned in Module 1, we can use the `TypedDict` class from python's `typing` module.
#It allows you to specify keys and their corresponding value types.

from typing import Literal
class TypedDictState(TypedDict):
    name: str
    mood: Literal["happy","sad"]

## Dataclass
#Python's dataclasses provide another way to define structured data.
#Dataclasses offer a concise syntax for creating classes that are primarily used to store data.

from dataclasses import dataclass

@dataclass
class DataclassState:
    name: str
    mood: Literal["happy","sad"]

## Pyadantic

#`TypedDict` and `dataclasses` provide type hints but they don't enforce types at runtime. 
#This means you could potentially assign invalid values without raising an error!
#Pydantic is a data validation and settings management library using Python type annotations. 
#It's particularly well-suited for defining state schemas in LangGraph due to its validation capabilities.

from pydantic import BaseModel, field_validator, ValidationError

class PydanticState(BaseModel):
    name: str
    mood: Literal["happy", "sad"]

    @field_validator('mood')
    @classmethod
    def validate_mood(cls, value):
        # Ensure the mood is either "happy" or "sad"
        if value not in ["happy", "sad"]:
            raise ValueError("Each mood must be either 'happy' or 'sad'")
        return value
```

### 模式设计：

为图定义模式可能很重要，因为我们希望对以下内容有更多的控制：

* 内部节点可能会传递在图的输入/输出中*不需要*的信息。
* 我们可能还希望为图使用不同的输入/输出模式。例如，输出可能仅包含一个相关的输出键。

```python
#1. 私有状态
#- 对于图的中间工作逻辑中需要的任何内容都很有用，
#- 但与整体图的输入或输出无关
from typing_extensions import TypedDict
from IPython.display import Image, display
from langgraph.graph import StateGraph, START, END

class OverallState(TypedDict):
    foo: int

class PrivateState(TypedDict):
    baz: int

#2. 输入/输出模式
#- 默认情况下，`StateGraph`接受一个单一模式，所有节点都应该与该模式进行通信。
#- 但是，也可以[为图定义明确的输入和输出模式](https://langchain-ai.github.io/langgraph/how-tos/input_output_schema/?h=input+outp)。
#- 在这些情况下，我们通常定义一个“内部”模式，其中包含与图操作相关的*所有*键。
#- 但是，我们使用特定的`input`和`output`模式来限制输入和输出。

class OverallState(TypedDict):
    question: str
    answer: str
    notes: str

def thinking_node(state: OverallState):
    return {"answer": "bye", "notes": "... his is name is Lance"}

def answer_node(state: OverallState):
    return {"answer": "bye Lance"}
```

### 流式传输：

LangGraph 支持多种流式传输模式。主要有：

* `values`: 此流式传输模式返回图的值。这是每个节点调用后图的完整状态。


```python
inputs = {"messages": [("human", "what's the weather in Delhi?")]}
async for chunk in graph.astream(inputs, stream_mode="values"):
    chunk["messages"][-1].pretty_print()
```
* `updates`: 此流式传输模式返回对图的更新。这是每个节点调用后图状态的更新。


```python
async for chunk in graph.astream(inputs, stream_mode="updates"):
    for node, values in chunk.items():
        print(f"Receiving update from node: '{node}'")
```
我们可以将 'stream\_mode' 作为参数传递

### 子图：

子图允许您在图的不同部分创建和管理不同的状态。这使您能够构建像 [多智能体团队](https://langchain-ai.github.io/langgraph/tutorials/multi_agent/hierarchical_agent_teams/) 这样的东西，其中每个团队可以跟踪其自己的独立状态。



我们将在系列的第2部分中获得有关使用子图的更多细节。

## 实践：使用 Agentic Flow 构建天气分析机器人

我们将设计一个简单的代理工作流，来 -

* 并行执行检查给定城市的温度。
* 提供所有提供城市中最温暖的城市。

### 第一步：加载所有环境变量

我们将在这里使用 Langsmith 进行监控和日志记录。

```python
AZURE_OPENAI_API_KEY = <api-key>
AZURE_OPENAI_ENDPOINT = <api-endpoint>
AZURE_OPENAI_VERSION = '2024-02-15-preview' 
AZURE_GPT4O_MODEL = 'gpt-4o'
AZURE_OPENAI_EMBEDDINGS_MODEL = 'text-embedding-ada-002'
LANGCHAIN_TRACING_V2 = 'true'
LANGCHAIN_ENDPOINT = "https://api.smith.langchain.com"
LANGCHAIN_API_KEY = <langsmith-key>
LANGCHAIN_PROJECT = <langsmith-project>
```

### 第2步：导入必要的python库


```python
from langchain_openai import AzureOpenAIEmbeddings, AzureChatOpenAI
from langgraph.graph import MessagesState
from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.graph import START, StateGraph
from langgraph.prebuilt import tools_condition
from langgraph.prebuilt import ToolNode
from IPython.display import Image, display
## Import things that are needed generically for tools
from langchain.pydantic_v1 import BaseModel, Field
from langchain.tools import StructuredToolStep-3: Initialize Model variable
```

### 第3步：定义模型变量


```python
llm = AzureChatOpenAI(temperature=0,
                           api_key=os.getenv('AZURE_OPENAI_API_KEY'),
                           azure_endpoint=os.getenv('AZURE_OPENAI_ENDPOINT'),
                           openai_api_version=os.getenv('AZURE_OPENAI_VERSION'),
                           azure_deployment=os.getenv('AZURE_GPT4O_MODEL')
                           )

embeddings = AzureOpenAIEmbeddings(
                            api_key=os.getenv('AZURE_OPENAI_API_KEY'),
                            azure_endpoint=os.getenv('AZURE_OPENAI_ENDPOINT'),
                            azure_deployment=os.getenv('AZURE_OPENAI_EMBEDDINGS_MODEL'),
                            openai_api_version=os.getenv('AZURE_OPENAI_VERSION'),
                            )

```

### 第4步：定义代理将使用的工具

我们定义了两个工具

* **get\_current\_weather(city: str) \-\> int:** 该工具将提供最新的天气
* **get\_difference(minuend: int,subtrahend: int) \-\> int:** 该工具将提供两个城市之间的天气差异


```python
class City(BaseModel):
    city: str = Field(description="City")

def get_current_weather(city: str) -> int:
    # Here we are passing hard-coded value but can be integrated with weather api
    temparation = {'delhi':30,
                   'mumbai':20,
                   'chennai':40}
    return temparation[city.lower()]


weather = StructuredTool.from_function(
    func=get_current_weather,
    name="Get_Weather",
    description="Get the current temperature from a city, in Fahrenheit",
    args_schema=City,
    return_direct=False,
)

class DifferenceInput(BaseModel):
    minuend: int = Field(
        description="The number from which another number is to be subtracted"
    )
    subtrahend: int = Field(description="The number to be subtracted")


def get_difference(minuend: int, subtrahend: int) -> int:
    return minuend - subtrahend


difference = StructuredTool.from_function(
    func=get_difference,
    name="Difference",
    description="Get the difference between two numbers",
    args_schema=DifferenceInput,
    return_direct=False,
)
```

### 第5步：将工具与LLM绑定

‘bind\_tools’函数允许我们使聊天模型能够调用工具。模型可以选择返回一个工具调用、多个工具调用或根本不进行工具调用。

```python
tools_weather = [weather, difference]
llm_with_tools_weather = llm.bind_tools(tools_weather)
```

### 第\-6步：定义图及其节点和边

在我们的图中，我们构建了一个 ReAct 代理，它决定调用哪些工具以及何时结束流程

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ODKLSZ66KzWCWdTnHx1zDA.png)


```python
## System message
sys_msg = SystemMessage(content="You are a helpful assistant.")

## Node
def assistant(state: MessagesState):
   return {"messages": [llm_with_tools_weather.invoke([sys_msg] + state["messages"])]}

## Graph
builder = StateGraph(MessagesState)

## Define nodes: these do the work
builder.add_node("assistant", assistant)
builder.add_node("tools", ToolNode(tools_weather))

## Define edges: these determine how the control flow moves
builder.add_edge(START, "assistant")
builder.add_conditional_edges(
    "assistant",
    # If the latest message (result) from assistant is a tool call -> tools_condition routes to tools
    # If the latest message (result) from assistant is a not a tool call -> tools_condition routes to END
    tools_condition,
)
builder.add_edge("tools", "assistant")
react_graph = builder.compile()

## Show
display(Image(react_graph.get_graph(xray=True).draw_mermaid_png()))
```

### 第7步：调用“代理”流程

我们可以使用 invoke() 方法调用我们的代理流程，将参数作为 json 传递


```python
messages = [HumanMessage(content="Where is it warmest: Chennai, Delhi and Mumbai? And by how much is it warmer than the other cities?")]
messages = react_graph.invoke({"messages": messages})

##Agent's Response
"""
The current temperatures are as follows:
- Chennai: 40°F
- Delhi: 30°F
- Mumbai: 20°F

Chennai is the warmest city. Here is how much warmer it is compared to the other cities:
- Chennai is 10°F warmer than Delhi.
- Chennai is 20°F warmer than Mumbai.

Additionally, Delhi is 10°F warmer than Mumbai.
""
```
所以，现在我们的基本代理流程已经准备好了！***代码可以在这里找到 [basic\_graph.py](https://github.com/anurag-mishra899/agentic_workflow/blob/main/basic_graph.py)***

### 结论：

在这篇博客中，我们探讨了代理工作流的概念，并强调了它们的一些关键好处。我们深入讨论了如何利用 LangGraph 构建这样的工作流，介绍了 LangGraph 的基本概念。最后，我们使用 LangGraph 开发了一个基本的、功能性的代理工作流。

在系列的下一篇文章中，我们将深入探讨如何使用 LangGraph 构建更强大和复杂的多代理工作流。

**我经常撰写关于生成性人工智能和机器学习的最新发展，欢迎在 LinkedIn 上关注我 ([https://www.linkedin.com/in/anurag\-mishra\-660961b7/](https://www.linkedin.com/in/anurag-mishra-660961b7/))**

