---
title: "构建动态多代理工作流：利用 LangChain 和 LangGraph 实现人工智能协作"
meta_title: "构建动态多代理工作流：利用 LangChain 和 LangGraph 实现人工智能协作"
description: "本文介绍了如何利用LangChain和LangGraph构建一个简单的多智能体工作流。通过两个智能体的协作，第一个生成随机数字，第二个将其乘以10。文中详细阐述了环境设置、代理创建、状态跟踪、工作流程定义及主要执行过程，展示了如何通过路由逻辑管理代理之间的消息流动。该架构可扩展至更复杂的任务处理场景。"
date: 2024-11-25T15:00:22Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*82Gx7MfG2xi4JAKkdY15yA.png"
categories: ["Programming", "Machine Learning", "Chatbots"]
author: "Rifx.Online"
tags: ["LangChain", "LangGraph", "multi-agent", "workflow", "collaboration"]
draft: False

---



本文利用 ***LangChain 和 LangGraph*** 创建一个简单的多智能体系统。智能体协同工作以完成任务。第一个智能体生成一系列随机数字，第二个智能体将这些数字乘以 10。每个智能体使用 OpenAI 的 GPT-4o API 来执行这些任务。

本文遵循基于工作流的架构，智能体根据分配的任务进行交互。在这篇文章中，我们将逐步分析脚本的每个部分以及它如何为整体流程做出贡献。



### 前提条件

在开始代码之前，请确保您已安装以下内容：

* Python 3\.7\+
* OpenAI API 访问（您需要一个 API 密钥）
* 已安装 LangChain 和 LangGraph 库。您可以通过 pip 安装它们：


```python
pip install langchain langgraph
```

## 设置环境

在脚本中，您必须将您的 OpenAI API 密钥设置为环境变量。这确保了代理可以与 GPT-4 模型进行交互。您可以在终端中设置 API 密钥：

```python
import os
os.environ["OPENAI_API_KEY"] = "your_openai_api_key"
```

## 创建 AI 代理

函数 `create_agent` 负责使用 LangChain 的 `ChatPromptTemplate` 设置代理。每个代理都通过系统消息进行初始化，该消息指定了它将执行的任务。其工作原理如下：

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
系统消息解释了代理的角色及其应如何行为。例如，一个代理被指示生成随机数字，另一个则被要求对其进行乘法运算。

## 代理状态

为了跟踪代理之间交换的消息，脚本使用 `TypedDict` 定义了代理状态的结构。这有助于管理消息并识别哪个代理发送了最后一条消息：

```python
class AgentState(TypedDict):
    messages: Sequence[BaseMessage]
    sender: str
```
每个代理发送和接收消息，状态跟踪当前负责下一步操作的代理。

## 定义工作流程

工作流程是使用 LangGraph 的 `StateGraph` 实现的。在这里，代理作为工作流程中的节点添加，并且它们之间的转换是基于路由逻辑定义的。

路由函数帮助控制代理之间消息的流动：

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
工作流程定义了代理之间的交互方式以及控制从一个代理移动到另一个代理的条件。

### 将代理添加到工作流

代理作为工作流中的节点添加，使用 `workflow.add_node`。例如，`Agent_1` 负责生成随机数：

```python
workflow.add_node("Agent_1", agent_1_node)
workflow.add_node("Agent_2", agent_2_node)
```
根据路由逻辑添加条件边，以便在一个代理与另一个代理之间移动流程。

## 主要执行

脚本的主要部分负责初始化工作流并根据用户的初始输入执行它。输入消息指示系统生成随机数并将其乘以 10：

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
在这里，工作流通过初始消息执行，系统通过每个代理流式传输事件。递归限制确保工作流不会无限运行。

## 输出

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*jNxRxpEASdOleQ27lHwLzw.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*5m-x35XOK34MAQvO8dvz8Q.png)

## 结论

这个 Python 脚本演示了如何使用 LangChain 和 LangGraph 构建一个简单的多代理工作流。该过程涉及定义代理、设置其状态，并在它们之间路由消息以实现特定任务。该架构可以扩展到更复杂的工作流，多个代理可以协作处理各种任务。

感谢您访问这个博客。敬请期待更多内容！

