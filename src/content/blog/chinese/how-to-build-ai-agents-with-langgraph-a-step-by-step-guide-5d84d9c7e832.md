---
title: "如何使用 LangGraph 构建人工智能代理：分步指南"
meta_title: "如何使用 LangGraph 构建人工智能代理：分步指南"
description: "本文介绍了如何使用LangGraph构建AI代理，重点在于其在复杂任务中的应用。LangGraph作为LangChain的扩展，支持有状态图和循环计算，能够实现动态决策和多步骤交互。通过一个计算太阳能电池板节能的示例，逐步展示了如何导入库、定义工具、管理状态、设置LLM并构建图结构，最终实现一个能够与用户互动的智能助手。该教程强调了LangGraph在AI开发中的灵活性和强大功能。"
date: 2024-11-25T15:00:22Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*57VJ-0AO8RaJHhRxNegnAg.png"
categories: ["Programming", "Machine Learning", "Generative AI"]
author: "Rifx.Online"
tags: ["LangGraph", "RAG", "stateful", "multi-actor", "workflows"]
draft: False

---



## 介绍

在人工智能的世界中，检索增强生成（RAG）系统已成为处理简单查询和生成上下文相关响应的常用工具。然而，随着对更复杂的人工智能应用需求的增长，出现了超越这些检索能力的系统的需求。AI代理应运而生——这些自主实体能够执行复杂的多步骤任务，在交互中保持状态，并动态适应新信息。**LangGraph**，作为LangChain库的强大扩展，旨在帮助开发人员构建这些先进的AI代理，通过启用具有状态的多参与者应用程序以及循环计算能力。

在本文中，我们将探讨LangGraph如何改变AI开发，并提供一个逐步指南，教您如何使用一个计算太阳能电池板节能的示例来构建自己的AI代理。这个示例将展示LangGraph独特的功能如何创建智能、可适应的、适合现实世界的AI系统。

## 什么是 LangGraph？

LangGraph 是一个基于 LangChain 的高级库，旨在通过引入循环计算能力来增强您的大型语言模型 (LLM) 应用程序。虽然 LangChain 允许创建有向无环图 (DAG) 以实现线性工作流，但 LangGraph 更进一步，允许添加循环，这对于开发复杂的代理行为至关重要。这些行为使 LLM 能够持续循环处理一个过程，根据不断变化的条件动态决定下一步采取的行动。



LangGraph 的核心是 **有状态图** 的概念：

* **状态**：表示在计算过程中维护和更新的上下文或记忆。它确保图中的每一步都可以访问来自前一步的相关信息，从而允许基于整个过程中的累积数据进行动态决策。
* **节点**：作为图的构建块，表示单独的计算步骤或函数。每个节点执行特定任务，例如处理输入、做出决策或与外部系统交互。节点可以自定义，以在工作流中执行广泛的操作。
* **边**：连接图中的节点，定义从一个步骤到下一个步骤的计算流。它们支持条件逻辑，允许根据当前状态改变执行路径，并促进节点之间数据和控制的移动，使复杂的多步骤工作流成为可能。

LangGraph 通过无缝管理图结构、状态和协调，重新定义了人工智能开发，赋予创建复杂的多参与者应用程序的能力。通过自动状态管理，LangGraph 确保跨交互保持上下文，使您的人工智能能够智能响应变化的输入。其简化的代理协调保证了精确的执行和高效的信息交换，让您专注于创造创新的工作流，而不是技术细节。LangGraph 的灵活性允许开发量身定制的高性能应用程序，而其可扩展性和容错性确保您的系统在企业级别上保持稳健和可靠。

## 分步指南

现在我们已经对 LangGraph 有了扎实的理解，并且了解它如何增强 AI 开发，让我们深入一个实际的例子。在这个场景中，我们将构建一个 AI 代理，旨在根据用户输入计算太阳能电池板的潜在节能。这款代理可以作为太阳能电池板销售网站上的潜在客户生成工具，与潜在客户互动，提供个性化的节省估算。通过收集每月电费等关键信息，这个 AI 代理帮助客户了解太阳能的财务收益，同时为销售团队的后续跟进筛选潜在客户。这个例子展示了 LangGraph 在创建智能、动态系统方面的强大能力，这些系统可以自动化复杂任务并推动商业价值。

### 第一步：导入必要的库

我们首先导入项目所需的所有基本 Python 库和模块。

```python
from langchain_core.tools import tool
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import Runnable
from langchain_aws import ChatBedrock
import boto3
from typing import Annotated
from typing_extensions import TypedDict
from langgraph.graph.message import AnyMessage, add_messages
from langchain_core.messages import ToolMessage
from langchain_core.runnables import RunnableLambda
from langgraph.prebuilt import ToolNode
```
这些导入为利用 LangChain、LangGraph 和 AWS 服务构建我们的 AI 助手奠定了基础。

### 第2步：定义计算太阳能节省的工具

接下来，我们定义一个工具，用于根据用户提供的每月电费计算能源节省。

```python
@tool
def compute_savings(monthly_cost: float) -> float:
    """
    Tool to compute the potential savings when switching to solar energy based on the user's monthly electricity cost.
    
    Args:
        monthly_cost (float): The user's current monthly electricity cost.
    
    Returns:
        dict: A dictionary containing:
            - 'number_of_panels': The estimated number of solar panels required.
            - 'installation_cost': The estimated installation cost.
            - 'net_savings_10_years': The net savings over 10 years after installation costs.
    """
    def calculate_solar_savings(monthly_cost):
        # Assumptions for the calculation
        cost_per_kWh = 0.28  
        cost_per_watt = 1.50  
        sunlight_hours_per_day = 3.5  
        panel_wattage = 350  
        system_lifetime_years = 10  

        # Monthly electricity consumption in kWh
        monthly_consumption_kWh = monthly_cost / cost_per_kWh
        
        # Required system size in kW
        daily_energy_production = monthly_consumption_kWh / 30
        system_size_kW = daily_energy_production / sunlight_hours_per_day
        
        # Number of panels and installation cost
        number_of_panels = system_size_kW * 1000 / panel_wattage
        installation_cost = system_size_kW * 1000 * cost_per_watt
        
        # Annual and net savings
        annual_savings = monthly_cost * 12
        total_savings_10_years = annual_savings * system_lifetime_years
        net_savings = total_savings_10_years - installation_cost
        
        return {
            "number_of_panels": round(number_of_panels),
            "installation_cost": round(installation_cost, 2),
            "net_savings_10_years": round(net_savings, 2)
        }

    # Return calculated solar savings
    return calculate_solar_savings(monthly_cost)
```
该函数处理用户的每月电费，并返回太阳能电池板系统的详细收益估算，包括所需的电池板数量、安装成本和十年的净节省。为简化起见，我们在计算中做了一些假设，例如每千瓦时的平均成本和平均日照小时。然而，在这个AI代理的更高级版本中，我们可以直接从用户那里收集这些信息，使估算更精确地符合他们的独特情况。

### 第 3 步：设置状态管理和错误处理

有效的状态管理和错误处理对于构建稳健的 AI 系统至关重要。在这里，我们定义了用于管理错误和维护对话状态的工具。

```python
def handle_tool_error(state) -> dict:
    """
    Function to handle errors that occur during tool execution.
    
    Args:
        state (dict): The current state of the AI agent, which includes messages and tool call details.
    
    Returns:
        dict: A dictionary containing error messages for each tool that encountered an issue.
    """
    # Retrieve the error from the current state
    error = state.get("error")
    
    # Access the tool calls from the last message in the state's message history
    tool_calls = state["messages"][-1].tool_calls
    
    # Return a list of ToolMessages with error details, linked to each tool call ID
    return {
        "messages": [
            ToolMessage(
                content=f"Error: {repr(error)}\n please fix your mistakes.",  # Format the error message for the user
                tool_call_id=tc["id"],  # Associate the error message with the corresponding tool call ID
            )
            for tc in tool_calls  # Iterate over each tool call to produce individual error messages
        ]
    }

def create_tool_node_with_fallback(tools: list) -> dict:
    """
    Function to create a tool node with fallback error handling.
    
    Args:
        tools (list): A list of tools to be included in the node.
    
    Returns:
        dict: A tool node that uses fallback behavior in case of errors.
    """
    # Create a ToolNode with the provided tools and attach a fallback mechanism
    # If an error occurs, it will invoke the handle_tool_error function to manage the error
    return ToolNode(tools).with_fallbacks(
        [RunnableLambda(handle_tool_error)],  # Use a lambda function to wrap the error handler
        exception_key="error"  # Specify that this fallback is for handling errors
    )
```
这些函数确保在工具执行过程中遇到的任何错误都能得到妥善处理，为用户提供有用的反馈。

### 第4步：定义状态和助手类

在这一步中，我们将定义AI代理如何管理其状态（对话的持续上下文），并确保它对用户的输入和工具的输出做出适当的回应。

为此，我们使用Python的`TypedDict`创建一个`State`类，以定义将要传递的消息结构。状态将保存消息，包括来自用户的输入和来自代理或工具的输出。

```python
class State(TypedDict):
    messages: Annotated[list[AnyMessage], add_messages]
```

接下来，我们创建助手类，它负责运行AI代理、与工具交互以及管理对话的流程。助手调用工具，确保它们返回适当的结果，并处理在执行过程中可能发生的任何重新提示或错误。它的核心功能包括调用Runnable，定义调用LLM和诸如`compute_savings`的工具的过程，然后监控结果。如果代理未能返回有效的响应，或者工具未提供有意义的数据，助手将重新提示用户或请求澄清。它将继续循环通过Runnable，直到获得有效输出，确保顺利执行和有效响应。

```python
class Assistant:
    def __init__(self, runnable: Runnable):
        # 使用定义与工具交互过程的可运行对象进行初始化
        self.runnable = runnable

    def __call__(self, state: State):
        while True:
            # 使用当前状态（消息和上下文）调用可运行对象
            result = self.runnable.invoke(state)
            
            # 如果工具未能返回有效输出，重新提示用户澄清或重试
            if not result.tool_calls and (
                not result.content
                or isinstance(result.content, list)
                and not result.content[0].get("text")
            ):
                # 添加消息以请求有效响应
                messages = state["messages"] + [("user", "请给出有效的输出。")]
                state = {**state, "messages": messages}
            else:
                # 在获得有效输出时退出循环
                break

        # 返回处理可运行对象后的最终状态
        return {"messages": result}
```

这个设置对于维持对话的流畅性和确保助手根据上下文做出适当响应至关重要。

### 第5步：使用AWS Bedrock设置LLM

在此步骤中，我们使用AWS Bedrock配置大型语言模型（LLM），这将为AI助手的语言能力提供支持。AWS Bedrock使我们能够访问先进的LLM，例如Anthropic的Claude。要与AWS服务交互，您需要配置**AWS凭证**。这意味着您必须在环境中设置AWS凭证（通过AWS CLI或环境变量），或者使用AWS SDK可以访问的凭证文件。如果没有正确的AWS配置，助手将无法连接到AWS服务，例如Bedrock来运行LLM。

```python
def get_bedrock_client(region):
    return boto3.client("bedrock-runtime", region_name=region)

def create_bedrock_llm(client):
    return ChatBedrock(model_id='anthropic.claude-3-sonnet-20240229-v1:0', client=client, model_kwargs={'temperature': 0}, region_name='us-east-1')

llm = create_bedrock_llm(get_bedrock_client(region='us-east-1'))
```
此集成确保助手能够有效地理解和响应用户输入。

### 第6步：定义助手的工作流程

现在我们已经设置了LLM和工具，下一步是定义AI助手的工作流程。这涉及创建对话模板，指定助手将使用的工具，并配置AI代理如何响应用户输入以及触发不同的功能（如计算太阳能节省）。工作流程本质上是管理助手如何与用户互动、收集信息并调用工具以提供结果的逻辑。

工作流程的第一部分涉及**创建提示模板**，定义助手如何与用户沟通。提示帮助引导AI助手确定需要向用户询问什么，如何根据输入进行响应，以及何时触发工具，如`compute_savings`。

在这种情况下，助手需要询问用户的每月电费，以计算太阳能电池板的节省。以下是我们如何定义对话：

```python
primary_assistant_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            '''You are a helpful customer support assistant for Solar Panels Belgium.
            You should get the following information from them:
            - monthly electricity cost
            If you are not able to discern this info, ask them to clarify! Do not attempt to wildly guess.

            After you are able to discern all the information, call the relevant tool.
            ''',
        ),
        ("placeholder", "{messages}"),
    ]
)
```
* `system` **消息**：此消息作为AI代理的指南，指示其询问用户的每月电费，并在信息不明确时不要进行猜测。助手将持续提示用户，直到收集到所需的数据。
* `placeholder`：此占位符允许助手动态注入对话中的消息，创建一个持续的对话，其中用户的输入影响下一步。

接下来，我们定义助手在互动中将使用的工具，主要工具是`compute_savings`，它根据用户的每月电费计算潜在的节省。在列表中指定工具后，我们使用`llm.bind_tools()`方法将它们绑定到助手的工作流程中。这一步确保AI助手可以在对话中根据需要访问和触发工具，从而实现用户与助手之间的无缝互动。

```python
## Define the tools the assistant will use
part_1_tools = [
    compute_savings
]

## Bind the tools to the assistant's workflow
part_1_assistant_runnable = primary_assistant_prompt | llm.bind_tools(part_1_tools)
```

## 第7步：构建图结构

在此步骤中，我们使用 LangGraph 构建 AI 助手的 **图结构**，该结构控制助手如何处理用户输入、触发工具以及在不同阶段之间移动。图定义了核心操作的 **节点**（如调用助手和工具）和决定这些节点之间流动的 **边**。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*PodIyQcMp9wApph_wXg-Ug.png)

LangGraph 中的每个 **节点** 代表一个操作步骤，例如与用户互动或执行工具。我们为这个 AI 助手定义了两个关键节点：

* **助手节点**：管理对话流程，询问用户的电费并处理响应。
* **工具节点**：执行工具（例如 `compute_savings`）以计算用户的太阳能电池板节省。

```python
builder = StateGraph(State)
builder.add_node("assistant", Assistant(part_1_assistant_runnable))
builder.add_node("tools", create_tool_node_with_fallback(part_1_tools))
```
**边** 定义了节点之间的流动方式。在这里，助手开始对话，然后在收集到所需输入后过渡到工具，并在工具执行后返回助手。

```python
builder.add_edge(START, "assistant")  # 从助手开始
builder.add_conditional_edges("assistant", tools_condition)  # 收集输入后移动到工具
builder.add_edge("tools", "assistant")  # 工具执行后返回助手
```
我们使用 **MemorySaver** 确保图在不同步骤之间保持对话状态。这使助手能够记住用户的输入，确保多步骤交互中的连续性。

```python
memory = MemorySaver()
graph = builder.compile(checkpointer=memory)
```

### 第8步：运行助手

最后，您可以通过初始化图形并开始对话来运行助手。

```python
## import shutil
import uuid

## Let's create an example conversation a user might have with the assistant
tutorial_questions = [
    'hey',
    'can you calculate my energy saving',
    "my montly cost is $100, what will i save"
]

## Update with the backup file so we can restart from the original place in each section
## shutil.copy(backup_file, db)
thread_id = str(uuid.uuid4())

config = {
    "configurable": {
        # The passenger_id is used in our flight tools to
        # fetch the user's flight information
        # "passenger_id": "3442 587242",
        # Checkpoints are accessed by thread_id
        "thread_id": thread_id,
    }
}

_printed = set()
for question in tutorial_questions:
    events = graph.stream(
        {"messages": ("user", question)}, config, stream_mode="values"
    )
    for event in events:
        _print_event(event, _printed)
```

## 结论

通过遵循这些步骤，您已经成功创建了一个使用 LangGraph 的 AI 助手，可以根据用户输入计算太阳能电池板的能源节省。 本教程展示了 LangGraph 在管理复杂的多步骤流程中的强大能力，并强调了如何利用先进的 AI 工具高效解决现实世界的挑战。 无论您是为客户支持、能源管理还是其他应用开发 AI 代理，LangGraph 都提供了实现您想法所需的灵活性、可扩展性和稳健性。

*想要使用 LangGraph Studio 可视化和测试这个代理吗？请关注我，敬请期待我的下一个教程，我将引导您通过这些令人兴奋的工具，进一步增强您的 AI 开发工作流程！*

***关注我以获取更多 AI 深入探讨！***

[Medium](https://medium.com/@lorevanoudenhove), [Instagram](https://www.instagram.com/lorevanoudenhove.ai/), [YouTube](https://www.youtube.com/channel/UCVyOJS1VV7FxPsStK65pHcA)

