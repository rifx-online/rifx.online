---
title: "OpenAI Swarm vs LangChain LangGraph：多代理框架详解"
meta_title: "OpenAI Swarm vs LangChain LangGraph：多代理框架详解"
description: "本文比较了OpenAI Swarm和LangChain LangGraph这两个多智能体框架。OpenAI Swarm以其简单易用的API和快速原型制作能力为特点，但在控制和功能上有所限制。LangChain LangGraph则提供更细粒度的控制和灵活性，适合经验丰富的开发者，但学习曲线较陡，代码实现复杂。选择框架应根据项目需求和开发者经验水平来决定。"
date: 2024-11-25T15:00:22Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*pyEJYpMc1b6-Tikp0-cm5A.png"
categories: ["Programming", "Technology", "Machine Learning"]
author: "Rifx.Online"
tags: ["Swarm", "LangGraph", "multi-agent", "frameworks", "prototyping"]
draft: False

---



[Ankush k Singal](https://readmedium.com/undefined)



### 介绍

人工智能的世界正在迅速发展，创建涉及多个代理的复杂工作流程的能力变得越来越重要。在这个领域中，OpenAI Swarm 和 LangChain LangGraph 是两个备受关注的框架。本文将深入探讨这两个框架，探索它们的功能、优势和理想用例，以帮助您决定哪个框架可能最适合您的项目。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*I_bHKsRrKfqneBerzWGruA.png)

### 什么是 OpenAI Swarm？

OpenAI Swarm 是 OpenAI 最近发布的新产品。它采用高层次的方法来处理多智能体工作流程，使得设置变得简单，代码量最小。它的工作原理如下：

* **代理和工具：** 你定义代理（本质上是带有指令的 LLM）并为它们配备工具（函数）以执行特定任务。
* **路由：** 你建立一个路由机制，根据上下文变量将用户查询引导到适当的代理。
* **简单实现：** Swarm 提供了一个直观的 API，包含清晰的指令和函数，用于代理创建、工具定义和工作流程执行。

### OpenAI Swarm 的好处：

* **易于使用：** Swarm 最大的优势在于其简单性。设置基本的多智能体工作流程只需最少的编码，使其对新接触智能体框架的人士更为友好。
* **快速原型制作：** 由于其用户友好的特性，Swarm 非常适合快速构建原型并测试多智能体概念。

### OpenAI Swarm 的缺点：

* **控制有限：** 虽然用户友好，但 Swarm 牺牲了一些对代理行为的控制。您无法深入处理错误、重试或框架内的复杂逻辑。
* **功能有限：** 目前，Swarm 处于实验阶段，缺乏向量数据库集成或高级检索技术等功能。

### 代码实现

让我们深入了解 Open AI Swarm 的代码实现。步骤如下：


```python
from dotenv import load_dotenv

load_dotenv()

from swarm import Swarm, Agent

client = Swarm()

def get_weather(city: str):
    return f"The weather in {city} is always 30°C."

def get_air_quality(city: str):
    return f"The air quality in {city} is 'Good' with an AQI of 42."

def route_request(context_variables):
    user_message = context_variables.get("last_user_message", "")
    if "weather" in user_message.lower():
        return weather_agent
    elif "air quality" in user_message.lower():
        return air_quality_agent
    else:
        return "I'm sorry, I don't understand your request."

weather_agent = Agent(
    name="Weather Agent",
    instructions="You are a weather assistant. Provide the weather information when asked.",
    functions=[get_weather]
)

air_quality_agent = Agent(
    name="Air Quality Agent",
    instructions="You are an air quality assistant. Provide the air quality information when asked.",
    functions=[get_air_quality]
)

supervisor_agent = Agent(
    name="Supervisor Agent",
    instructions="You are the supervisor. Determine whether the user's request is about weather or air quality, and transfer them to the appropriate agent by calling the 'route_request' function.",
    functions=[route_request]
)

user_message = "What's the weather like in Paris?"
context_variables = {"last_user_message": user_message}

response = client.run(
    agent=supervisor_agent,
    messages=[{"role": "user", "content": user_message}],
    context_variables=context_variables
)

print(response.messages[-1]["content"])
```

### LangChain LangGraph 是什么？

LangChain LangGraph 采用低级别的方法。它提供了对多代理工作流各个方面的更细粒度的控制。以下是 LangGraph 的简要介绍：

* **状态管理：** LangGraph 利用状态变量在整个工作流中跟踪信息，从而实现复杂的决策制定。
* **可定制节点：** 您可以定义具有特定功能的自定义节点，包括与您的工作流无缝集成的工具节点。
* **边缘和路由：** 条件边缘根据代理的输出和用户输入决定工作流的进展。

### LangChain LangGraph 的优势：

* **细粒度控制：** LangGraph 赋予您对代理行为的完全控制。您可以定义错误处理、路由逻辑，并集成高级工具。
* **灵活性：** LangGraph 的低级特性允许根据您的特定需求定制高度自定义的工作流程。
* **模型无关：** LangGraph 不仅限于 OpenAI 模型。您可以将各种大型语言模型，如 LAMA，集成到您的工作流程中。

### LangChain LangGraph 的缺点：

* **学习曲线陡峭：** 与 Swarm 相比，LangGraph 需要对代理工作流和编程概念有更深入的理解。
* **复杂的实现：** 在 LangGraph 中构建工作流需要更多的代码，这使得它在快速原型开发中不太理想。

### 代码实现

让我们深入了解Langchain的LangGraph的代码实现，步骤如下：


```python
from typing import TypedDict, List
from pydantic import BaseModel, Field
from langchain_openai import ChatOpenAI  # Corrected import
from langchain.schema import HumanMessage, AIMessage, SystemMessage, BaseMessage
from langchain.prompts import ChatPromptTemplate
from langchain.tools import tool
from langgraph.graph import StateGraph, START, END

from typing import Annotated
from langgraph.graph.message import add_messages

## 使用@tool装饰器定义工具
@tool
def get_weather(city: str) -> str:
    """获取给定城市的天气信息。"""
    return f"The weather in {city} is always 30°C."

@tool
def get_air_quality(city: str) -> str:
    """获取给定城市的空气质量信息。"""
    return f"The air quality in {city} is 'Good' with an AQI of 42."

@tool
def default_answer() -> str:
    """当无法回答时提供默认响应。"""
    return "I'm sorry, I can't answer that."


class AgentState(TypedDict):
    messages: Annotated[List[BaseMessage], add_messages]
    on_topic: str
    classification: str
    system_message: SystemMessage

get_weather_tools = [get_weather]
get_air_quality_tools = [get_air_quality]
default_answer_tools = [default_answer]


supervisor_llm = ChatOpenAI(temperature=0)
weather_llm = ChatOpenAI(temperature=0).bind_tools(get_weather_tools)
air_quality_llm = ChatOpenAI(temperature=0).bind_tools(get_air_quality_tools)
off_topic_llm = ChatOpenAI(temperature=0).bind_tools(default_answer_tools)

```

```python
from langchain.schema import AIMessage, SystemMessage
from typing import Dict, Any

## 调用天气模型的函数
def call_weather_model(state: AgentState) -> Dict[str, Any]:
    messages = state["messages"]
    system_message = SystemMessage(
        content="You are WeatherBot. Answer the user's weather-related questions only in French."
    )
    conversation = [system_message] + messages
    response = weather_llm.invoke(conversation)
    return {"messages": state["messages"] + [response]}

## 调用空气质量模型的函数
def call_air_quality_model(state: AgentState) -> Dict[str, Any]:
    messages = state["messages"]
    system_message = SystemMessage(
        content="You are AirQualityBot. Provide air quality information in a very formal and polite manner."
    )
    conversation = [system_message] + messages
    response = air_quality_llm.invoke(conversation)
    return {"messages": state["messages"] + [response]}

## 调用离题模型的函数
def call_off_topic_model(state: AgentState) -> Dict[str, Any]:
    messages = state["messages"]
    system_message = SystemMessage(
        content="You are OffTopicBot. Apologize to the user and explain that you cannot help with their request, but do so in a friendly tone."
    )
    conversation = [system_message] + messages
    response = off_topic_llm.invoke(conversation)
    return {"messages": state["messages"] + [response]}



def should_continue_weather(state: AgentState):
    messages = state["messages"]
    last_message = messages[-1]
    if hasattr(last_message, 'tool_calls') and last_message.tool_calls:
        return "weather_tools"
    return END

def should_continue_air_quality(state: AgentState):
    messages = state["messages"]
    last_message = messages[-1]
    if hasattr(last_message, 'tool_calls') and last_message.tool_calls:
        return "air_quality_tools"
    return END

def should_continue_off_topic(state: AgentState):
    messages = state["messages"]
    last_message = messages[-1]
    if hasattr(last_message, 'tool_calls') and last_message.tool_calls:
        return "off_topic_tools"
    return END
```

```python
from pydantic import BaseModel, Field
from langchain.prompts import ChatPromptTemplate

from langgraph.prebuilt import ToolNode

class SupervisorDecision(BaseModel):
    """由监督代理做出的决定。"""
    classification: str = Field(description="将消息分类为'weather'、'air_quality'或'other'")

def call_supervisor_model(state: AgentState) -> AgentState:

    print(state)

    messages = state['messages']
    last_message = messages[-1].content if messages else ''

    system_prompt = """你是一个监督代理，决定用户的消息是否在主题上并进行分类。

    分析用户的消息并决定：

    如果在主题上，将其分类为'weather'、'air_quality'或'other'。

    以以下结构化格式提供你的决定：
        "classification": "weather"或"air_quality"或"other"
    """

    prompt = ChatPromptTemplate.from_messages(
        [("system", system_prompt),
         ("human", "用户消息：\n\n{user_message}")]
    )

    structured_supervisor_llm = supervisor_llm.with_structured_output(SupervisorDecision)
    evaluator = prompt | structured_supervisor_llm

    result = evaluator.invoke({"user_message": last_message})

    classification = result.classification
    state['classification'] = classification

    return state



weather_tool_node = ToolNode(tools=[get_weather])
air_quality_tool_node = ToolNode(tools=[get_air_quality])
off_topic_tool_node = ToolNode(tools=[default_answer])
```

```python
def supervisor_router(state: AgentState) -> str:
    classification = state.get('classification', '')
    if classification == 'weather':
        return 'weather_model'
    elif classification == 'air_quality':
        return 'air_quality_model'
    else:
        return 'off_topic_model'

def should_continue_weather(state: AgentState):
    messages = state["messages"]
    last_message = messages[-1]
    if hasattr(last_message, 'tool_calls') and last_message.tool_calls:
        return "weather_tools"
    return END

def should_continue_air_quality(state: AgentState):
    messages = state["messages"]
    last_message = messages[-1]
    if hasattr(last_message, 'tool_calls') and last_message.tool_calls:
        return "air_quality_tools"
    return END

def should_continue_off_topic(state: AgentState):
    messages = state["messages"]
    last_message = messages[-1]
    if hasattr(last_message, 'tool_calls') and last_message.tool_calls:
        return "off_topic_tools"
    return END


workflow = StateGraph(AgentState)

workflow.add_node("supervisor_agent", call_supervisor_model)

workflow.add_node("weather_model", call_weather_model)
workflow.add_node("weather_tools", weather_tool_node)

workflow.add_node("air_quality_model", call_air_quality_model)
workflow.add_node("air_quality_tools", air_quality_tool_node)

workflow.add_node("off_topic_model", call_off_topic_model)
workflow.add_node("off_topic_tools", off_topic_tool_node)

workflow.add_edge(START, "supervisor_agent")
workflow.add_conditional_edges(
    "supervisor_agent", supervisor_router,
    ["weather_model", "air_quality_model", "off_topic_model"]
)

workflow.add_conditional_edges("weather_model", should_continue_weather, ["weather_tools", END])
workflow.add_edge("weather_tools", "weather_model")

workflow.add_conditional_edges("air_quality_model", should_continue_air_quality, ["air_quality_tools", END])
workflow.add_edge("air_quality_tools", "air_quality_model")

workflow.add_conditional_edges("off_topic_model", should_continue_off_topic, ["off_topic_tools", END])
workflow.add_edge("off_topic_tools", "off_topic_model")

app = workflow.compile()


from IPython.display import Image, display

try:
    display(Image(app.get_graph().draw_mermaid_png()))
except Exception:
    pass
```

```python
from langchain.schema import HumanMessage

app.invoke({"messages": [HumanMessage(content="慕尼黑的天气怎么样？")]})
```

### 选择合适的框架：

在 OpenAI Swarm 和 LangChain LangGraph 之间的选择取决于您项目的具体需求和您的经验水平。

* **对于初学者：** 如果您刚接触代理工作流并希望快速实验基本的多代理交互，OpenAI Swarm 是一个不错的起点。
* **对于有经验的开发者：** 如果您需要对工作流进行完全控制并需要集成高级功能，LangChain LangGraph 是最佳选择。

### 结论

OpenAI Swarm 和 LangChain LangGraph 都为构建多智能体工作流提供了有价值的工具。虽然 OpenAI Swarm 在用户友好性方面表现出色，但 LangChain LangGraph 则为您提供了无与伦比的控制和灵活性。最终，最佳框架取决于您项目的复杂性以及您对编程概念的舒适程度。

### 资源

* [swarm\_vs\_langgraph](https://github.com/Coding-Crashkurse/LangGraph-Tutorial/blob/main/swarm_vs_langgraph.ipynb)

通过各种平台保持联系并支持我的工作：

[Github](https://github.com/andysingal) [Patreon](https://www.patreon.com/AndyShanu) [Kaggle](https://www.kaggle.com/alphasingal) [Hugging\-Face](https://huggingface.co/Andyrasika) [YouTube](https://www.youtube.com/@andy111007) [GumRoad](https://rasikasingal.gumroad.com/) [Calendly](http://calendly.com/alphasingal)

喜欢我的内容吗？请随意 [请我喝杯咖啡 ☕](https://paypal.me/alphasingal?country.x=US&locale.x=en_US)！

请求和问题：如果您有一个项目想让我参与，或者您对我解释的概念有任何问题，请随时告诉我。我总是在寻找未来笔记本的新想法，并且我喜欢帮助解决您可能有的任何疑问。

请记住，每一个“点赞”、“分享”和“星标”都对我的工作有很大帮助，并激励我继续制作更多优质内容。感谢您的支持！

如果您喜欢这个故事，请随时 [订阅](https://medium.com/@andysingal) Medium，您将收到我新文章发布时的通知，并能全面访问其他作者的数千个故事。

