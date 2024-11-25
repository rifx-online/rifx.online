---
title: "From Zero to Hero: Building an Intelligent Chatbot with LangGraph in No Time"
meta_title: "From Zero to Hero: Building an Intelligent Chatbot with LangGraph in No Time"
description: "This guide details the development of an intelligent support chatbot using LangGraph, emphasizing its capabilities to answer questions, manage conversation states, and integrate web search tools. The process involves setting up the environment, creating a basic chatbot, enhancing it with tools, implementing memory for context retention, and incorporating human oversight. Key features include state management, conditional routing, and custom state updates. Ultimately, the guide illustrates how to build a sophisticated, stateful AI application, showcasing LangGraphs flexibility and power for AI development."
date: 2024-11-25T15:00:22Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*80g4sqbcGGL9p3qEK852iA.jpeg"
categories: ["Chatbots", "Programming", "Machine Learning"]
author: "Rifx.Online"
tags: ["LangGraph", "chatbot", "state", "memory", "tools"]
draft: False

---






In this comprehensive quick start guide, we’ll build a support chatbot using LangGraph that can:

* **Answer common questions by searching the web**
* **Maintain conversation state across calls**
* **Route complex queries to a human for review**
* **Use custom state to control its behavior**
* **Rewind and explore alternative conversation paths**

We’ll start with a basic chatbot and progressively add more sophisticated capabilities, introducing key LangGraph concepts along the way.


## Setup

First, install the required packages:


```python
%pip install -U langgraph langsmith langchain_anthropic
```
Next, set your API keys:


```python
import getpass
import os

def _set_env(var: str):
    if not os.environ.get(var):
        os.environ[var] = getpass.getpass(f"{var}: ")
_set_env("ANTHROPIC_API_KEY")
```
Set up **LangSmith** for LangGraph development. Sign up for LangSmith to quickly spot issues and improve the performance of your LangGraph projects. LangSmith lets you use trace data to debug, test and monitor your LLM apps built with LangGraph.


## Part 1: Build a Basic Chatbot

We’ll first create a simple chatbot using LangGraph. This chatbot will respond directly to user messages. Though simple, it will illustrate the core concepts of building with LangGraph. By the end of this section, you will have built a rudimentary chatbot.


## Defining the StateGraph

Start by creating a `StateGraph`. A `StateGraph` object defines the structure of our chatbot as a **state machine**. We'll add nodes to represent the LLM and functions our chatbot can call and edges to specify how the bot should transition between these functions.


```python
from typing import Annotated
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages


class State(TypedDict):
    # Messages have the type "list". The `add_messages` function
    # in the annotation defines how this state key should be updated
    # (in this case, it appends messages to the list, rather than overwriting them)
    messages: Annotated[list, add_messages]
graph_builder = StateGraph(State)
```
**Note:**

* **State Definition**: The `State` consists of the schema of the graph as well as reducer functions that specify how to apply updates to the state.
* **Annotated Messages**: The `messages` key is annotated with the `add_messages` reducer function, which tells LangGraph to append new messages to the existing list, rather than overwriting it.


## Adding the Chatbot Node

Next, add a `chatbot` node. Nodes represent units of work and are typically regular Python functions.


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
* **Function Explanation**: The `chatbot` function takes the current `State` as input and returns a dictionary containing an updated `messages` list under the key `"messages"`.


## Defining the Entry and Exit Points

Add an entry point and a finish point to the graph.


```python
graph_builder.add_edge(START, "chatbot")
graph_builder.add_edge("chatbot", END)
```
* **Entry Point**: Tells the graph where to start its work each time we run it.
* **Finish Point**: Instructs the graph to exit after the `chatbot` node.


## Compiling the Graph

Compile the graph to create a `CompiledGraph` that we can use to invoke on our state.


```python
graph = graph_builder.compile()
```

## Visualizing the Graph (Optional)

You can visualize the graph using the `get_graph` method and one of the draw methods.


```python
from IPython.display import Image, display

try:
    display(Image(graph.get_graph().draw_mermaid_png()))
except Exception:
    pass  # Visualization is optional
```

### Output:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*87erCrk12EGGU0GGGMsb4Q.jpeg)


## Running the Chatbot

Now let’s run the chatbot!


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
**Example Interaction:**


```python
User: What is LangGraph?
Assistant: LangGraph is a library designed to help build stateful multi-agent applications using language models. It provides tools for creating workflows and state machines to coordinate multiple AI agents or language model interactions.
Goodbye!
```
**Congratulations!** You’ve built your first chatbot using LangGraph. This bot can engage in basic conversation by taking user input and generating responses using an LLM.


## Part 2: Enhancing the Chatbot with Tools

To handle queries our chatbot can’t answer from memory, we’ll integrate a web search tool. Our bot can use this tool to find relevant information and provide better responses.


## Requirements

Before we start, make sure you have the necessary packages installed and API keys set up.

**Install the Tavily Search Engine:**


```python
%pip install -U tavily-python langchain_community
```
Set your `TAVILY_API_KEY`:


```python
_set_env("TAVILY_API_KEY")
```

## Defining the Tool


```python
from langchain_community.tools.tavily_search import TavilySearchResults

tool = TavilySearchResults(max_results=2)
tools = [tool]
```

## Modifying the Graph

We’ll start defining our graph. The following is similar to Part 1, but we have added `bind_tools` on our LLM.


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

## Adding the Tool Node

Create a function to run the tools if they are called.


```python
import json
from langchain_core.messages import ToolMessage

class BasicToolNode:
    """A node that runs the tools requested in the last AIMessage."""
    def __init__(self, tools: list) -> None:
        self.tools_by_name = {tool.name: tool for tool in tools}
    def __call__(self, inputs: dict):
        if messages := inputs.get("messages", []):
            message = messages[-1]
        else:
            raise ValueError("No message found in input")
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

## Defining Conditional Edges

Edges route the control flow from one node to the next. Conditional edges usually contain “if” statements to route to different nodes depending on the current graph state.


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

## Visualizing the Enhanced Graph


```python
from IPython.display import Image, display

try:
    display(Image(graph.get_graph().draw_mermaid_png()))
except Exception:
    pass
```

### Output:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*InvKcUBqDcXMLHUusmp30A.jpeg)


## Running the Enhanced Chatbot


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
**Example Interaction:**


```python
User: What's a 'node' in LangGraph?
Assistant: Based on the search results, a 'node' in LangGraph represents a function or computation step. Each node performs a specific task and can be connected to other nodes to form a workflow.
Goodbye!
```
**Congratulations!** You’ve created a conversational agent in LangGraph that can use a search engine to retrieve updated information when needed.


## Part 3: Adding Memory to the Chatbot

Our chatbot can now use tools to answer user questions, but it doesn’t remember the context of previous interactions. This limits its ability to have coherent, multi\-turn conversations.


## Using Checkpointing for Memory

LangGraph solves this problem through persistent checkpointing. If you provide a checkpointer when compiling the graph and a `thread_id` when calling your graph, LangGraph automatically saves the state after each step.

**Create a MemorySaver Checkpointer:**


```python
from langgraph.checkpoint.memory import MemorySaver
memory = MemorySaver()
```

## Updating the Graph

We will use LangGraph’s prebuilt `ToolNode` and `tools_condition` for brevity.


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

## Interacting with the Chatbot with Memory

**Set the Thread ID:**


```python
config = {"configurable": {"thread_id": "1"}}
```
**First Interaction:**


```python
user_input = "Hi there! My name is Alice."
events = graph.stream(
    {"messages": [("user", user_input)]}, config, stream_mode="values"
)
for event in events:
    event["messages"][-1].pretty_print()
```
**Second Interaction:**


```python
user_input = "Remember my name?"
events = graph.stream(
    {"messages": [("user", user_input)]}, config, stream_mode="values"
)
for event in events:
    event["messages"][-1].pretty_print()
```
**Example Output:**


```python
mathematica
```

```python
Assistant: Of course, I remember your name, Alice. How can I assist you today?
```
**Congratulations!** Your chatbot can now maintain conversation state across sessions thanks to LangGraph’s checkpointing system.


## Part 4: Human\-in\-the\-loop

Agents can be unreliable and may need human input to successfully accomplish tasks. Similarly, for some actions, you may want to require human approval before running to ensure that everything is running as intended.


## Adding Human Oversight

We will use LangGraph’s `interrupt_before` functionality to always break the tool node.

**Compile the Graph with Interruptions:**


```python
graph = graph_builder.compile(
    checkpointer=memory,
    interrupt_before=["tools"],
)
```

## Interacting with Human\-in\-the\-loop

**User Input:**


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
**Inspecting the State:**


```python
snapshot = graph.get_state(config)
existing_message = snapshot.values["messages"][-1]
existing_message.tool_calls
```
**Continuing the Graph:**


```python
events = graph.stream(None, config, stream_mode="values")
for event in events:
    if "messages" in event:
        event["messages"][-1].pretty_print()
```
**Congratulations!** You’ve used an interrupt to add human\-in\-the\-loop execution to your chatbot, allowing for human oversight and intervention when needed.


## Part 5: Manually Updating the State

LangGraph lets you manually update state, enabling you to control the agent’s trajectory by modifying its actions.


## Updating the State

**Starting a New Thread:**


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
**Modifying the Tool Invocation:**


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
**Resuming the Graph:**


```python
events = graph.stream(None, config, stream_mode="values")
for event in events:
    if "messages" in event:
        event["messages"][-1].pretty_print()
```
**Congratulations!** You’ve used `interrupt_before` and `update_state` to manually modify the state as a part of a human\-in\-the\-loop workflow.


## Part 6: Customizing State

We’ll extend our chatbot with a new node to illustrate how to customize the bot’s behavior using custom state updates.


## Defining the Extended State


```python
from typing import Annotated
from langchain_anthropic import ChatAnthropic
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START
from langgraph.graph.message import add_messages

class State(TypedDict):
    messages: Annotated[list, add_messages]
    ask_human: bool  # This flag is new
```

## Defining the Human Assistance Schema


```python
from pydantic import BaseModel

class RequestAssistance(BaseModel):
    """Escalate the conversation to an expert."""
    request: str
```

## Updating the Chatbot Node


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

## Adding the Human Node


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

## Defining Conditional Logic


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

## Interacting with the Customized Chatbot

**User Input:**


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
**Responding as the Human:**


```python
ai_message = snapshot.values["messages"][-1]
human_response = (
    "We, the experts, recommend you check out LangGraph to build your agent."
)
tool_message = create_response(human_response, ai_message)
graph.update_state(config, {"messages": [tool_message]})
```
**Resuming the Graph:**


```python
events = graph.stream(None, config, stream_mode="values")
for event in events:
    if "messages" in event:
        event["messages"][-1].pretty_print()
```
**Congratulations!** You’ve added an additional node to your assistant graph to let the chatbot decide for itself whether or not it needs to interrupt execution.


## Conclusion

In this comprehensive guide, we’ve built a support chatbot using LangGraph with progressively advanced capabilities:

* **Basic Chatbot**: Responds directly to user messages.
* **Enhanced with Tools**: Uses a web search tool to answer questions.
* **Added Memory**: Maintains conversation state across calls.
* **Human\-in\-the\-loop**: Allows human oversight and intervention.
* **Custom State**: Controls behavior using custom state updates.

LangGraph’s flexibility and powerful features enable developers to create sophisticated, stateful AI applications with ease. By mastering these concepts, you’re well on your way to building advanced conversational agents and exploring the vast possibilities of AI development.

**Happy Coding!**

***References:***

[Introduction \| 🦜️🔗 LangChain](https://python.langchain.com/docs/introduction/)

[https://python.langchain.com/v0\.2/docs/how\_to/migrate\_agent/](https://python.langchain.com/v0.2/docs/how_to/migrate_agent/)

[https://langchain\-ai.github.io/langgraph/tutorials/introduction](https://langchain-ai.github.io/langgraph/tutorials/introduction)


