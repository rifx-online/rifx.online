---
title: "Hands-on : Build Agentic Workflow using LangGraph (Key Learnings from Langchain-academy) | Part-1"
meta_title: "Hands-on : Build Agentic Workflow using LangGraph (Key Learnings from Langchain-academy) | Part-1"
description: "The article introduces LangGraph, an open-source framework for creating agentic workflows that allow LLMs to determine subsequent actions dynamically. It contrasts traditional sequential task management with iterative, collaborative workflows that enhance adaptability. Key concepts include stateful graphs, nodes, edges, and persistence mechanisms, enabling complex agent behaviors. The article details a hands-on project to build a weather analysis bot using LangGraph, illustrating the frameworks capabilities in developing agent-based applications. Future installments promise to explore more advanced multi-agent workflows."
date: 2024-11-30T13:57:18Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*yEVfPsqzZO9PiB-9sW1cHg.png"
categories: ["Programming", "Machine Learning", "Chatbots"]
author: "Rifx.Online"
tags: ["LangGraph", "LLMs", "workflows", "stateful", "graphs"]
draft: False

---





## Introduction

Langchain has recently introduced an [impressive course](https://academy.langchain.com/courses/intro-to-langgraph) focusing on LangGraph and its key features for developing robust agentic and multi\-agentic workflows.

In this series, we will explore essential insights from the course and create applications utilizing agentic workflows. In the first part, we’ll cover fundamental concepts of LangGraph and how to get started. The second part will focus on developing a comprehensive end\-to\-end agent\-based application using LangGraph.


## What is Agentic Workflow?

In most LLM\-based applications, tasks are typically organized in a sequential manner, known as ‘chains.’ While this approach ensures reliability and consistent execution, it can be somewhat rigid.


> *What if we allowed LLMs to determine the next action?*

An agentic workflow offers an iterative and collaborative model, transforming interactions with LLMs into a series of manageable, refinable steps. This approach enables continuous improvement and adaptation throughout the task completion process. **A system is more “agentic” the more an LLM decides how the system can behave.**


## What is LanGraph?

LangGraph is an [open\-source framework](https://langchain-ai.github.io/langgraph/) designed for creating agent and multi\-agent applications. Distinct from the LangChain package, LangGraph’s core philosophy is to provide developers with enhanced precision and control in agent workflows, making it well\-suited for the complexities of real\-world systems.

While LangChain facilitates the creation of Directed Acyclic Graphs (DAGs) for linear workflows, **LangGraph advances this by allowing the incorporation of cycles**. These cycles are crucial for developing complex, agent\-like behaviors, enabling LLMs to continuously iterate through a process and dynamically decide the next action based on changing conditions.


## Fundamental Concepts about LangGraph

* **State:** LangGraph centers on the concept of a stateful graph, where each node represents a step in the computation. It ensures that each step can access relevant information from previous steps, facilitating dynamic decision\-making based on accumulated data throughout the process.
* **Nodes:** Nodes serve as the foundational elements of LangGraph. Each node represents a function or computation step and can be customized to perform a variety of operations within the workflow.
* **Edges:** Edges connect the nodes within your graph, defining the computational flow. LangGraph supports conditional edges, enabling dynamic determination of the next node to execute based on the graph’s current state.


## Things to know before building Agentic Flow In LangGraph


### Persistence:

* LangGraph can use a checkpointer to automatically save the graph state after each step.
* This built\-in persistence layer gives us memory, allowing LangGraph to pick up from the last state
* All we need to do is simply compile the graph with a checkpointer, and our graph has memory!


```python
#One of the easiest checkpointers to use is the `MemorySaver`, an in-memory key-value store for Graph state.
#We can also use external DB 
from langgraph.checkpoint.memory import MemorySaver
memory = MemorySaver() 
graph_memory = builder.compile(checkpointer=memory)
```

### State Reducer:

* Reducer define how updates are executed.
* By using the `Annotated` type, you can specify a reducer function.
* For instance, if you want to update the graph state in parallel nodes by appending values rather than overwriting them, you can use a reducer like `operator.add`. This function, from Python's built\-in operator module, performs list concatenation when applied to lists.


```python
from operator import add
from typing import Annotated

class State(TypedDict):
  foo: Annotated[list[int], add]
```

### State Schema:

* When defining a LangGraph `StateGraph`, a state schema is utilized to represent the structure and data types the graph will use.
* All nodes are expected to adhere to this schema for communication. LangGraph provides flexibility in defining your state schema, accommodating various Python and validation methods.


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

### Schema Design:

Defining a schema for the Graph can be important where we want a bit more control over:

* Internal nodes may pass information that is *not required* in the graph’s input / output.
* We may also want to use different input / output schemas for the graph. The output might, for example, only contain a single relevant output key.


```python
#1. Private State
#- useful for anything needed as part of the intermediate working logic of the graph, 
#- but not relevant for the overall graph input or output
from typing_extensions import TypedDict
from IPython.display import Image, display
from langgraph.graph import StateGraph, START, END

class OverallState(TypedDict):
    foo: int

class PrivateState(TypedDict):
    baz: int

#2. Input/Output Schema
#- By default, `StateGraph` takes in a single schema and all nodes are expected to communicate with that schema. 
#- However, it is also possible to [define explicit input and output schemas for a graph](https://langchain-ai.github.io/langgraph/how-tos/input_output_schema/?h=input+outp).
#- Often, in these cases, we define an "internal" schema that contains *all* keys relevant to graph operations.
#- But, we use specific `input` and `output` schemas to constrain the input and output. 

class OverallState(TypedDict):
    question: str
    answer: str
    notes: str

def thinking_node(state: OverallState):
    return {"answer": "bye", "notes": "... his is name is Lance"}

def answer_node(state: OverallState):
    return {"answer": "bye Lance"}
```

### Streaming:

LangGraph supports multiple streaming modes. The main ones are:

* `values`: This streaming mode streams back values of the graph. This is the full state of the graph after each node is called.


```python
inputs = {"messages": [("human", "what's the weather in Delhi?")]}
async for chunk in graph.astream(inputs, stream_mode="values"):
    chunk["messages"][-1].pretty_print()
```
* `updates`: This streaming mode streams back updates to the graph. This is the update to the state of the graph after each node is called.


```python
async for chunk in graph.astream(inputs, stream_mode="updates"):
    for node, values in chunk.items():
        print(f"Receiving update from node: '{node}'")
```
We can pass as argument ‘stream\_mode’


### Sub\-Graph:

Subgraphs allow you to create and manage different states in different parts of your graph. This allows you build things like [multi\-agent teams](https://langchain-ai.github.io/langgraph/tutorials/multi_agent/hierarchical_agent_teams/), where each team can track its own separate state.



We will get more details of using sub\-graph in part\-2 of the series.


## Hands\-on: Building Weather Analysis Bot using Agentic Flow

We are going to design simple agentic workflow that \-

* Checks the temperature of given cities in parallel execution.
* Provide the most warmest city out of all provided cities.


### Step\-1: Load all Environment variable

We will use here Langsmith to monitor and logging purpose.


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

### Step\-2: Import necessary python libraries


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

### Step\-3: Define model variables


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

### Step 4: Define tools that Agent will be using

We are defining two tools

* **get\_current\_weather(city: str) \-\> int:** This tool will provide the latest weather
* **get\_difference(minuend: int,subtrahend: int) \-\> int:** This tool will provide the difference in weather b/w two cities


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

### Step\-5: Bind tools with LLM

‘bind\_tools’ function allows us to a chat model to be able to invoke tools. the model can choose whether to return one tool call, multiple tool calls, or no tool calls at all.


```python
tools_weather = [weather, difference]
llm_with_tools_weather = llm.bind_tools(tools_weather)
```

### Step\-6: Define Graph and it’s nodes and edges

In our graph, we build ReAct agent that makes a decision on which tools to call and when to end the flow

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

### Step\-7: Invoke the ‘Agent’ flow

we can call to our agent flow using invoke() method, passing our arguments as json


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
So, now our basic agent flow is ready! ***The code can be found here [basic\_graph.py](https://github.com/anurag-mishra899/agentic_workflow/blob/main/basic_graph.py)***


### Conclusion:

In this blog, we explored the concept of agentic workflows and highlighted some of their key benefits. We delved into how LangGraph can be utilized to construct such workflows, discussing essential concepts of LangGraph. Finally, we developed a basic, functional agentic workflow using LangGraph.

In the next installment of our series, we will delve into building more robust and complex multi\-agent workflows using LangGraph.

**I frequently write about developments in Generative AI and Machine learning, so feel free to follow me on LinkedIn ([https://www.linkedin.com/in/anurag\-mishra\-660961b7/](https://www.linkedin.com/in/anurag-mishra-660961b7/))**


