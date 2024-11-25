---
title: "Building a Dynamic Multi-Agent Workflow: Harnessing AI Collaboration with LangChain & LangGraph"
meta_title: "Building a Dynamic Multi-Agent Workflow: Harnessing AI Collaboration with LangChain & LangGraph"
description: "The article details the creation of a multi-agent workflow using LangChain and LangGraph, where two agents collaborate to generate and manipulate random numbers. It outlines the prerequisites, environment setup, agent creation, state management, and workflow definition. The router function controls message flow between agents, ensuring efficient task execution. The script demonstrates initializing the workflow with user input and streaming events, showcasing the potential for more complex multi-agent collaborations."
date: 2024-11-25T15:00:22Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*82Gx7MfG2xi4JAKkdY15yA.png"
categories: ["Programming", "Machine Learning", "Chatbots"]
author: "Rifx.Online"
tags: ["LangChain", "LangGraph", "multi-agent", "workflow", "collaboration"]
draft: False

---




This article utilizes ***LangChain and LangGraph*** to create a simple, multi\-agent system. The agents work together to fulfill a task. The first agent generates a sequence of random numbers, and the second agent multiplies them by 10\. Each agent uses OpenAI’s GPT\-4o API to perform these tasks.

The article follows a workflow\-based architecture where agents interact based on assigned tasks. In this post, we’ll break down each part of the script and how it contributes to the overall flow.




### Prerequisites

Before diving into the code, ensure you have the following installed:

* Python 3\.7\+
* OpenAI API access (you’ll need an API key)
* LangChain and LangGraph libraries installed. You can install them via pip:


```python
pip install langchain langgraph
```

## Setting up the Environment

In the script, you must set your OpenAI API key as an environment variable. This ensures that the agents can interact with the GPT\-4 model. You can set the API key in your terminal:


```python
import os
os.environ["OPENAI_API_KEY"] = "your_openai_api_key"
```

## Creating an AI Agent

The function `create_agent` is responsible for setting up an agent using the `ChatPromptTemplate` from LangChain. Each agent is initialized with a system message that specifies the task it will perform. Here’s how it works:


```python
def create_agent(llm, system_message: str):
    """Create an agent."""
    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "You are a helpful AI assistant, collaborating with other assistants. "
                "Work on the assigned task and provide useful outputs. "
                "Prefix your response with FINAL ANSWER if you have completed your task."
                " Here is the task: {system_message}",
            ),
            MessagesPlaceholder(variable_name="messages"),
        ]
    )
    prompt = prompt.partial(system_message=system_message)
    return prompt | llm
```
The system message explains the role of the agent and how it should behave. For example, one agent is instructed to generate random numbers, and another is asked to multiply them.


## The Agent State

To keep track of the messages exchanged between agents, the script defines a structure for the agent’s state using `TypedDict`. This helps in managing the messages and identifying which agent sent the last message:


```python
class AgentState(TypedDict):
    messages: Sequence[BaseMessage]
    sender: str
```
Each agent sends and receives messages, and the state keeps track of the current agent that is responsible for the next action.


## Defining the Workflow

The workflow is implemented using LangGraph’s `StateGraph`. Here, the agents are added as nodes in the workflow, and the transitions between them are defined based on the router logic.

The router function helps in controlling the flow of messages between agents:


```python
def router(state):
    messages = state["messages"]
    last_message = messages[-1]
    if "FINAL ANSWER" in last_message.content:
        if state["sender"] == "Agent_1":
            return "Agent_2"
        return END
    return "continue"
```
The workflow defines how the agents interact and the conditions under which the control moves from one agent to another.


### Adding Agents to the Workflow

Agents are added as nodes in the workflow using `workflow.add_node`. For instance, `Agent_1` is responsible for generating random numbers:


```python
workflow.add_node("Agent_1", agent_1_node)
workflow.add_node("Agent_2", agent_2_node)
```
Conditional edges are added to move the process from one agent to another based on the router logic.


## Main Execution

The main part of the script is responsible for initializing the workflow and executing it based on a user’s initial input. The input message instructs the system to generate random numbers and multiply them by 10:


```python
if __name__ == "__main__":
    initial_state = {
        "messages": [
            HumanMessage(content="Generate 10 random numbers and multiply each by 10.")
        ],
        "sender": "Agent_1",
    }

    events = graph.stream(initial_state, {"recursion_limit": 150})
    for event in events:
        print(event)
        print("----")
```
Here, the workflow is executed with an initial message, and the system streams the events through each agent. The recursion limit ensures that the workflow does not run indefinitely.


## Output

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*jNxRxpEASdOleQ27lHwLzw.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*5m-x35XOK34MAQvO8dvz8Q.png)


## Conclusion

This Python script demonstrates how to build a simple, multi\-agent workflow using LangChain and LangGraph. The process involves defining agents, setting up their states, and routing the messages between them to achieve a specific task. This architecture can be extended to more complex workflows with multiple agents collaborating on various tasks.

Thanks for visiting this blog. Stay tuned for more!


