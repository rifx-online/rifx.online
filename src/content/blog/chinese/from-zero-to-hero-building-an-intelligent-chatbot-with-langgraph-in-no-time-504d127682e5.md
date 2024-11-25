---
title: "从零到英雄：使用 LangGraph 快速构建智能聊天机器人"
meta_title: "从零到英雄：使用 LangGraph 快速构建智能聊天机器人"
description: "本文介绍了如何使用LangGraph构建一个智能聊天机器人，涵盖了从基础构建到增强功能的多个步骤。首先，创建了一个简单的聊天机器人，随后集成了网络搜索工具以提升回答能力，并实现了记忆管理以保持对话状态。此外，文章还探讨了人机协作的实现，通过人工监督和自定义状态更新来增强机器人的灵活性和响应能力。整个过程展示了LangGraph在构建复杂有状态AI应用中的强大功能和灵活性。"
date: 2024-11-25T15:00:22Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*80g4sqbcGGL9p3qEK852iA.jpeg"
categories: ["Chatbots", "Programming", "Machine Learning"]
author: "Rifx.Online"
tags: ["LangGraph", "chatbot", "state", "memory", "tools"]
draft: False

---





在这个全面的快速入门指南中，我们将使用 LangGraph 构建一个支持聊天机器人，它可以：

* **通过搜索网络回答常见问题**
* **在调用之间保持对话状态**
* **将复杂查询路由到人工进行审查**
* **使用自定义状态来控制其行为**
* **回溯并探索替代对话路径**

我们将从一个基本的聊天机器人开始，逐步添加更复杂的功能，同时介绍关键的 LangGraph 概念。

## 设置

首先，安装所需的包：

```python
%pip install -U langgraph langsmith langchain_anthropic
```
接下来，设置您的 API 密钥：

```python
import getpass
import os

def _set_env(var: str):
    if not os.environ.get(var):
        os.environ[var] = getpass.getpass(f"{var}: ")
_set_env("ANTHROPIC_API_KEY")
```
为 LangGraph 开发设置 **LangSmith**。注册 LangSmith 以快速发现问题并提高您的 LangGraph 项目的性能。LangSmith 允许您使用跟踪数据来调试、测试和监控使用 LangGraph 构建的 LLM 应用程序。

## 第1部分：构建一个基本的聊天机器人

我们将首先使用 LangGraph 创建一个简单的聊天机器人。这个聊天机器人将直接对用户消息做出回应。尽管简单，它将阐明使用 LangGraph 构建的核心概念。在本节结束时，您将构建一个初步的聊天机器人。

## 定义状态图

首先创建一个 `StateGraph`。`StateGraph` 对象定义了我们聊天机器人的结构，作为一个 **状态机**。我们将添加节点来表示 LLM 和我们的聊天机器人可以调用的函数，并添加边来指定机器人如何在这些函数之间转换。

```python
from typing import Annotated
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages


class State(TypedDict):
    # 消息的类型是 "list"。`add_messages` 函数
    # 在注释中定义了如何更新此状态键
    # （在这种情况下，它将消息附加到列表中，而不是覆盖它们）
    messages: Annotated[list, add_messages]
graph_builder = StateGraph(State)
```
**注意：**

* **状态定义**：`State` 包含图的架构以及指定如何将更新应用于状态的 reducer 函数。
* **注释消息**：`messages` 键被注释为 `add_messages` reducer 函数，这告诉 LangGraph 将新消息附加到现有列表中，而不是覆盖它。

## 添加聊天机器人节点

接下来，添加一个 `chatbot` 节点。节点代表工作单元，通常是常规的 Python 函数。

```python
from langchain_anthropic import ChatAnthropic
llm = ChatAnthropic(model="claude-2")

def chatbot(state: State):
    return {"messages": [llm.invoke(state["messages"])]}
## The first argument is the unique node name
## The second argument is the function or object that will be called whenever
## the node is used.
graph_builder.add_node("chatbot", chatbot)
```
* **函数说明**：`chatbot` 函数以当前 `State` 作为输入，并返回一个字典，字典中包含一个更新后的 `messages` 列表，键为 `"messages"`。

## 定义入口和出口

为图形添加一个入口点和一个结束点。


```python
graph_builder.add_edge(START, "chatbot")
graph_builder.add_edge("chatbot", END)
```
* **入口点**：告诉图形每次运行时从哪里开始工作。
* **结束点**：指示图形在 `chatbot` 节点之后退出。

## 编译图形

编译图形以创建一个 `CompiledGraph`，我们可以在我们的状态上调用它。

```python
graph = graph_builder.compile()
```

## 可视化图形（可选）

您可以使用 `get_graph` 方法和其中一种绘图方法来可视化图形。

```python
from IPython.display import Image, display

try:
    display(Image(graph.get_graph().draw_mermaid_png()))
except Exception:
    pass  # Visualization is optional
```

### 输出:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*87erCrk12EGGU0GGGMsb4Q.jpeg)

## 运行聊天机器人

现在让我们运行聊天机器人！


```python
def stream_graph_updates(user_input: str):
    for event in graph.stream({"messages": [("user", user_input)]}):
        for value in event.values():
            print("Assistant:", value["messages"][-1].content)

while True:
    try:
        user_input = input("User: ")
        if user_input.lower() in ["quit", "exit", "q"]:
            print("Goodbye!")
            break
        stream_graph_updates(user_input)
    except:
        # Fallback if input() is not available
        user_input = "What do you know about LangGraph?"
        print("User: " + user_input)
        stream_graph_updates(user_input)
        break
```
**示例互动：**


```python
User: What is LangGraph?
Assistant: LangGraph is a library designed to help build stateful multi-agent applications using language models. It provides tools for creating workflows and state machines to coordinate multiple AI agents or language model interactions.
Goodbye!
```
**恭喜！** 你已经使用 LangGraph 构建了第一个聊天机器人。这个机器人可以通过获取用户输入并使用 LLM 生成响应来进行基本对话。

## Part 2: 使用工具增强聊天机器人

为了处理我们的聊天机器人无法通过记忆回答的查询，我们将集成一个网络搜索工具。我们的机器人可以使用此工具查找相关信息并提供更好的回应。

## 需求

在开始之前，请确保您已安装必要的软件包并设置了 API 密钥。

**安装 Tavily 搜索引擎：**


```python
%pip install -U tavily-python langchain_community
```
设置您的 `TAVILY_API_KEY`：


```python
_set_env("TAVILY_API_KEY")
```

## 定义工具


```python
from langchain_community.tools.tavily_search import TavilySearchResults

tool = TavilySearchResults(max_results=2)
tools = [tool]
```

## 修改图形

我们将开始定义我们的图形。以下内容与第一部分类似，但我们在我们的 LLM 中添加了 `bind_tools`。


```python
from typing import Annotated
from langchain_anthropic import ChatAnthropic
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages


class State(TypedDict):
    messages: Annotated[list, add_messages]
graph_builder = StateGraph(State)
llm = ChatAnthropic(model="claude-2")
llm_with_tools = llm.bind_tools(tools)
def chatbot(state: State):
    return {"messages": [llm_with_tools.invoke(state["messages"])]}
graph_builder.add_node("chatbot", chatbot)
```

## 添加工具节点

创建一个函数来运行被调用的工具。

```python
import json
from langchain_core.messages import ToolMessage

class BasicToolNode:
    """一个运行在最后一个AIMessage中请求的工具的节点。"""
    def __init__(self, tools: list) -> None:
        self.tools_by_name = {tool.name: tool for tool in tools}
    def __call__(self, inputs: dict):
        if messages := inputs.get("messages", []):
            message = messages[-1]
        else:
            raise ValueError("输入中未找到消息")
        outputs = []
        for tool_call in message.tool_calls:
            tool_result = self.tools_by_name[tool_call["name"]].invoke(
                tool_call["args"]
            )
            outputs.append(
                ToolMessage(
                    content=json.dumps(tool_result),
                    name=tool_call["name"],
                    tool_call_id=tool_call["id"],
                )
            )
        return {"messages": outputs}
tool_node = BasicToolNode(tools=[tool])
graph_builder.add_node("tools", tool_node)
```

## 定义条件边

边缘将控制流从一个节点路由到下一个节点。条件边通常包含“if”语句，以根据当前图状态路由到不同的节点。

```python
from typing import Literal

def route_tools(state: State):
    if isinstance(state, list):
        ai_message = state[-1]
    elif messages := state.get("messages", []):
        ai_message = messages[-1]
    else:
        raise ValueError(f"No messages found in input state to tool_edge: {state}")
    if hasattr(ai_message, "tool_calls") and len(ai_message.tool_calls) > 0:
        return "tools"
    return END
graph_builder.add_conditional_edges(
    "chatbot",
    route_tools,
    {"tools": "tools", END: END},
)
graph_builder.add_edge("tools", "chatbot")
graph_builder.add_edge(START, "chatbot")
graph = graph_builder.compile()
```

## 可视化增强图

```python
from IPython.display import Image, display

try:
    display(Image(graph.get_graph().draw_mermaid_png()))
except Exception:
    pass
```

### 输出:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*InvKcUBqDcXMLHUusmp30A.jpeg)

## 运行增强型聊天机器人


```python
while True:
    try:
        user_input = input("User: ")
        if user_input.lower() in ["quit", "exit", "q"]:
            print("Goodbye!")
            break
        stream_graph_updates(user_input)
    except:
        user_input = "What do you know about LangGraph?"
        print("User: " + user_input)
        stream_graph_updates(user_input)
        break
```
**示例互动:**


```python
User: What's a 'node' in LangGraph?
Assistant: Based on the search results, a 'node' in LangGraph represents a function or computation step. Each node performs a specific task and can be connected to other nodes to form a workflow.
Goodbye!
```
**恭喜！** 您已经在 LangGraph 中创建了一个可以在需要时使用搜索引擎检索更新信息的对话代理。

## 第3部分：为聊天机器人添加记忆

我们的聊天机器人现在可以使用工具来回答用户的问题，但它并不记得之前交互的上下文。这限制了它进行连贯的多轮对话的能力。

## 使用检查点技术进行内存管理

LangGraph通过持久性检查点解决了这个问题。如果在编译图时提供一个检查点器，并在调用图时提供一个`thread_id`，LangGraph会在每一步后自动保存状态。

**创建一个 MemorySaver 检查点器：**


```python
from langgraph.checkpoint.memory import MemorySaver
memory = MemorySaver()
```

## 更新图表

我们将使用 LangGraph 的预构建 `ToolNode` 和 `tools_condition` 来简化操作。

```python
from langchain_anthropic import ChatAnthropic
from langchain_community.tools.tavily_search import TavilySearchResults
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode, tools_condition

class State(TypedDict):
    messages: Annotated[list, add_messages]
graph_builder = StateGraph(State)
tool = TavilySearchResults(max_results=2)
tools = [tool]
llm = ChatAnthropic(model="claude-2")
llm_with_tools = llm.bind_tools(tools)
def chatbot(state: State):
    return {"messages": [llm_with_tools.invoke(state["messages"])]}
graph_builder.add_node("chatbot", chatbot)
tool_node = ToolNode(tools=[tool])
graph_builder.add_node("tools", tool_node)
graph_builder.add_conditional_edges(
    "chatbot",
    tools_condition,
)
graph_builder.add_edge("tools", "chatbot")
graph_builder.add_edge(START, "chatbot")
graph = graph_builder.compile(checkpointer=memory)
```

## 与具有记忆的聊天机器人互动

**设置线程 ID：**


```python
config = {"configurable": {"thread_id": "1"}}
```
**第一次互动：**


```python
user_input = "Hi there! My name is Alice."
events = graph.stream(
    {"messages": [("user", user_input)]}, config, stream_mode="values"
)
for event in events:
    event["messages"][-1].pretty_print()
```
**第二次互动：**


```python
user_input = "Remember my name?"
events = graph.stream(
    {"messages": [("user", user_input)]}, config, stream_mode="values"
)
for event in events:
    event["messages"][-1].pretty_print()
```
**示例输出：**


```python
mathematica
```

```python
Assistant: Of course, I remember your name, Alice. How can I assist you today?
```
**恭喜！** 由于 LangGraph 的检查点系统，您的聊天机器人现在可以在会话之间保持对话状态。

## 第4部分：人机协作

代理可能不可靠，可能需要人类的输入才能成功完成任务。同样，对于某些操作，您可能希望在运行之前要求人类批准，以确保一切按预期进行。

## 添加人工监督

我们将使用 LangGraph 的 `interrupt_before` 功能来始终中断工具节点。

**编译带中断的图：**


```python
graph = graph_builder.compile(
    checkpointer=memory,
    interrupt_before=["tools"],
)
```

## 与人类参与者的交互

**用户输入：**


```python
user_input = "I'm learning LangGraph. Could you do some research on it for me?"
config = {"configurable": {"thread_id": "1"}}
events = graph.stream(
    {"messages": [("user", user_input)]}, config, stream_mode="values"
)
for event in events:
    if "messages" in event:
        event["messages"][-1].pretty_print()
```
**检查状态：**


```python
snapshot = graph.get_state(config)
existing_message = snapshot.values["messages"][-1]
existing_message.tool_calls
```
**继续图形：**


```python
events = graph.stream(None, config, stream_mode="values")
for event in events:
    if "messages" in event:
        event["messages"][-1].pretty_print()
```
**恭喜！** 您已使用中断为您的聊天机器人添加了人类参与者执行，使其在需要时能够进行人工监督和干预。

## 第5部分：手动更新状态

LangGraph 允许您手动更新状态，使您能够通过修改代理的行为来控制其轨迹。

## 更新状态

**开始一个新线程：**


```python
user_input = "I'm learning LangGraph. Could you do some research on it for me?"
config = {"configurable": {"thread_id": "2"}}
events = graph.stream(
    {"messages": [("user", user_input)]}, config, stream_mode="values"
)
for event in events:
    if "messages" in event:
        event["messages"][-1].pretty_print()
```
**修改工具调用：**


```python
from langchain_core.messages import AIMessage

snapshot = graph.get_state(config)
existing_message = snapshot.values["messages"][-1]
new_tool_call = existing_message.tool_calls[0].copy()
new_tool_call["args"]["query"] = "LangGraph human-in-the-loop workflow"
new_message = AIMessage(
    content=existing_message.content,
    tool_calls=[new_tool_call],
    id=existing_message.id,
)
graph.update_state(config, {"messages": [new_message]})
```
**恢复图形：**


```python
events = graph.stream(None, config, stream_mode="values")
for event in events:
    if "messages" in event:
        event["messages"][-1].pretty_print()
```
**恭喜！** 你已经使用 `interrupt_before` 和 `update_state` 手动修改状态，作为人机协作工作流的一部分。

## 第6部分：自定义状态

我们将通过添加一个新节点来扩展我们的聊天机器人，以说明如何使用自定义状态更新来定制机器人的行为。

## 定义扩展状态


```python
from typing import Annotated
from langchain_anthropic import ChatAnthropic
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START
from langgraph.graph.message import add_messages

class State(TypedDict):
    messages: Annotated[list, add_messages]
    ask_human: bool  # 这个标志是新的
```

## 定义人类辅助模式


```python
from pydantic import BaseModel

class RequestAssistance(BaseModel):
    """Escalate the conversation to an expert."""
    request: str
```

## 更新聊天机器人节点


```python
tool = TavilySearchResults(max_results=2)
tools = [tool]
llm = ChatAnthropic(model="claude-2")
llm_with_tools = llm.bind_tools(tools + [RequestAssistance])

def chatbot(state: State):
    response = llm_with_tools.invoke(state["messages"])
    ask_human = False
    if (
        response.tool_calls
        and response.tool_calls[0]["name"] == RequestAssistance.__name__
    ):
        ask_human = True
    return {"messages": [response], "ask_human": ask_human}
```

## 添加人类节点


```python
from langchain_core.messages import AIMessage, ToolMessage

def create_response(response: str, ai_message: AIMessage):
    return ToolMessage(
        content=response,
        tool_call_id=ai_message.tool_calls[0]["id"],
    )
def human_node(state: State):
    new_messages = []
    if not isinstance(state["messages"][-1], ToolMessage):
        new_messages.append(
            create_response("No response from human.", state["messages"][-1])
        )
    return {
        "messages": new_messages,
        "ask_human": False,
    }
graph_builder.add_node("human", human_node)
```

## 定义条件逻辑


```python
def select_next_node(state: State):
    if state["ask_human"]:
        return "human"
    return tools_condition(state)


graph_builder.add_conditional_edges(
    "chatbot",
    select_next_node,
    {"human": "human", "tools": "tools", END: END},
)
graph_builder.add_edge("tools", "chatbot")
graph_builder.add_edge("human", "chatbot")
graph_builder.add_edge(START, "chatbot")
memory = MemorySaver()
graph = graph_builder.compile(
    checkpointer=memory,
    interrupt_before=["human"],
)
```

## 与定制聊天机器人互动

**用户输入：**


```python
user_input = "I need some expert guidance for building this AI agent. Could you request assistance for me?"
config = {"configurable": {"thread_id": "1"}}
events = graph.stream(
    {"messages": [("user", user_input)]}, config, stream_mode="values"
)
for event in events:
    if "messages" in event:
        event["messages"][-1].pretty_print()
```
**作为人类的回应：**


```python
ai_message = snapshot.values["messages"][-1]
human_response = (
    "We, the experts, recommend you check out LangGraph to build your agent."
)
tool_message = create_response(human_response, ai_message)
graph.update_state(config, {"messages": [tool_message]})
```
**恢复图形：**


```python
events = graph.stream(None, config, stream_mode="values")
for event in events:
    if "messages" in event:
        event["messages"][-1].pretty_print()
```
**恭喜！** 您已向助手图添加了一个额外节点，让聊天机器人自行决定是否需要中断执行。

## 结论

在本综合指南中，我们使用 LangGraph 构建了一个具有逐步增强功能的支持聊天机器人：

* **基本聊天机器人**：直接响应用户消息。
* **增强工具**：使用网络搜索工具回答问题。
* **增加记忆**：在调用之间维护对话状态。
* **人类参与**：允许人类监督和干预。
* **自定义状态**：通过自定义状态更新控制行为。

LangGraph 的灵活性和强大功能使开发人员能够轻松创建复杂的、有状态的 AI 应用程序。通过掌握这些概念，您在构建高级对话代理和探索 AI 开发的广阔可能性方面已经走上了良好的道路。

**祝编码愉快！**

***参考文献：***

[介绍 \| 🦜️🔗 LangChain](https://python.langchain.com/docs/introduction/)

[https://python.langchain.com/v0\.2/docs/how\_to/migrate\_agent/](https://python.langchain.com/v0.2/docs/how_to/migrate_agent/)

[https://langchain\-ai.github.io/langgraph/tutorials/introduction](https://langchain-ai.github.io/langgraph/tutorials/introduction)

