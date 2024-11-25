---
title: "OpenAI Swarm vs LangChain LangGraph: A Detailed Look at Multi-Agent Frameworks"
meta_title: "OpenAI Swarm vs LangChain LangGraph: A Detailed Look at Multi-Agent Frameworks"
description: "The article compares two multi-agent frameworks, OpenAI Swarm and LangChain LangGraph, highlighting their functionalities, benefits, and drawbacks. OpenAI Swarm is user-friendly and suitable for rapid prototyping but offers limited control and functionality. In contrast, LangChain LangGraph provides granular control and flexibility for advanced workflows but has a steeper learning curve. The choice between the two depends on the users experience level and project requirements, with Swarm being ideal for beginners and LangGraph for experienced developers seeking comprehensive control."
date: 2024-11-25T15:00:22Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*pyEJYpMc1b6-Tikp0-cm5A.png"
categories: ["Programming", "Technology", "Machine Learning"]
author: "Rifx.Online"
tags: ["Swarm", "LangGraph", "multi-agent", "frameworks", "prototyping"]
draft: False

---




[Ankush k Singal](https://readmedium.com/undefined)




### Introduction

The world of artificial intelligence is rapidly evolving, and the ability to create complex workflows involving multiple agents is becoming increasingly important. Two frameworks vying for attention in this space are OpenAI Swarm and LangChain LangGraph. This article will delve into both frameworks, exploring their functionalities, benefits, and ideal use cases to help you decide which one might be the best fit for your project.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*I_bHKsRrKfqneBerzWGruA.png)


### What is OpenAI Swarm?

OpenAI Swarm is a newcomer to the scene, recently released by OpenAI. It takes a high\-level approach to multi\-agent workflows, making it easy to set up with minimal code. Here’s how it works:

* **Agents and Tools:** You define agents (essentially LLMs with instructions) and equip them with tools (functions) to perform specific tasks.
* **Routing:** You establish a routing mechanism to direct user queries to the appropriate agent based on context variables.
* **Simple Implementation:** Swarm offers a straightforward API with clear instructions and functions for agent creation, tool definition, and workflow execution.


### Benefits of OpenAI Swarm:

* **Ease of Use:** Swarm’s biggest advantage lies in its simplicity. Setting up a basic multi\-agent workflow requires minimal coding, making it accessible to those new to agentic frameworks.
* **Rapid Prototyping:** Due to its user\-friendly nature, Swarm is ideal for quickly building prototypes and testing out multi\-agent concepts.


### Drawbacks of OpenAI Swarm:

* **Limited Control:** While user\-friendly, Swarm sacrifices some control over agent behavior. You can’t delve into error handling, retries, or complex logic within the framework.
* **Limited Functionality:** As of now, Swarm is in an experimental stage and lacks features like vector database integration or advanced retrieval techniques.


### Code Implementation

Lets delve into the Code implementation of Open AI Swarm. Here are the steps as follows:


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

### What is LangChain LangGraph?

LangChain LangGraph, on the other hand, takes a low\-level approach. It offers a more granular level of control over every aspect of your multi\-agent workflow. Here’s a glimpse into LangGraph:

* **State Management:** LangGraph utilizes state variables to track information throughout the workflow, allowing for complex decision\-making.
* **Customizable Nodes:** You can define custom nodes with specific functionalities, including tool nodes that integrate seamlessly with your workflow.
* **Edges and Routing:** Conditional edges determine how the workflow progresses based on the agent’s output and user input.


### Benefits of LangChain LangGraph:

* **Granular Control:** LangGraph empowers you with complete control over your agents’ behavior. You can define error handling, routing logic, and integrate advanced tools.
* **Flexibility:** LangGraph’s low\-level nature allows for highly customized workflows tailored to your specific needs.
* **Model Agnostic:** LangGraph isn’t restricted to OpenAI models. You can integrate various large language models like LAMA into your workflow.


### Drawbacks of LangChain LangGraph:

* **Steeper Learning Curve:** LangGraph requires a deeper understanding of agentic workflows and programming concepts compared to Swarm.
* **Complex Implementation:** Building workflows in LangGraph involves more code, making it a less ideal choice for quick prototyping.


### Code Implementation

Lets delve into the code implementation of Langchain’s LangGraph \>here are the steps as follows:


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

## Define the tools using the @tool decorator
@tool
def get_weather(city: str) -> str:
    """Get the weather information for a given city."""
    return f"The weather in {city} is always 30°C."

@tool
def get_air_quality(city: str) -> str:
    """Get the air quality information for a given city."""
    return f"The air quality in {city} is 'Good' with an AQI of 42."

@tool
def default_answer() -> str:
    """Provide a default response when unable to answer."""
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

## Function to invoke the weather model
def call_weather_model(state: AgentState) -> Dict[str, Any]:
    messages = state["messages"]
    system_message = SystemMessage(
        content="You are WeatherBot. Answer the user's weather-related questions only in French."
    )
    conversation = [system_message] + messages
    response = weather_llm.invoke(conversation)
    return {"messages": state["messages"] + [response]}

## Function to invoke the air quality model
def call_air_quality_model(state: AgentState) -> Dict[str, Any]:
    messages = state["messages"]
    system_message = SystemMessage(
        content="You are AirQualityBot. Provide air quality information in a very formal and polite manner."
    )
    conversation = [system_message] + messages
    response = air_quality_llm.invoke(conversation)
    return {"messages": state["messages"] + [response]}

## Function to invoke the off-topic model
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
    """Decision made by the supervisor agent."""
    classification: str = Field(description="Classify the message as 'weather', 'air_quality', or 'other'")

def call_supervisor_model(state: AgentState) -> AgentState:

    print(state)

    messages = state['messages']
    last_message = messages[-1].content if messages else ''

    system_prompt = """You are a supervisor agent that decides whether the user's message is on topic and classifies it.

    Analyze the user's message and decide:

    Classify it as 'weather', 'air_quality', or 'other' if on topic.

    Provide your decision in the following structured format:
        "classification": "weather" or "air_quality" or "other"
    """

    prompt = ChatPromptTemplate.from_messages(
        [("system", system_prompt),
         ("human", "User Message:\n\n{user_message}")]
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

app.invoke({"messages": [HumanMessage(content="How is the weather in Munich?")]})
```

### Choosing the Right Framework:

The choice between OpenAI Swarm and LangChain LangGraph boils down to your project’s specific needs and your experience level.

* **For Beginners:** If you’re new to agentic workflows and want a quick way to experiment with basic multi\-agent interactions, OpenAI Swarm is a good starting point.
* **For Experienced Developers:** If you require complete control over your workflows and need to integrate advanced functionalities, LangChain LangGraph is the way to go.


### Conclusion

Both OpenAI Swarm and LangChain LangGraph offer valuable tools for building multi\-agent workflows. While OpenAI Swarm shines with its user\-friendliness, LangChain LangGraph empowers you with unparalleled control and flexibility. Ultimately, the best framework depends on your project’s complexity and your comfort level with programming concepts.


### Resources

* [swarm\_vs\_langgraph](https://github.com/Coding-Crashkurse/LangGraph-Tutorial/blob/main/swarm_vs_langgraph.ipynb)

Stay connected and support my work through various platforms:

[Github](https://github.com/andysingal) [Patreon](https://www.patreon.com/AndyShanu) [Kaggle](https://www.kaggle.com/alphasingal) [Hugging\-Face](https://huggingface.co/Andyrasika) [YouTube](https://www.youtube.com/@andy111007) [GumRoad](https://rasikasingal.gumroad.com/) [Calendly](http://calendly.com/alphasingal)

Like my content? Feel free to [Buy Me a Coffee ☕](https://paypal.me/alphasingal?country.x=US&locale.x=en_US) !

Requests and questions: If you have a project in mind that you’d like me to work on or if you have any questions about the concepts I’ve explained, don’t hesitate to let me know. I’m always looking for new ideas for future Notebooks and I love helping to resolve any doubts you might have.

Remember, each “Like”, “Share”, and “Star” greatly contributes to my work and motivates me to continue producing more quality content. Thank you for your support!

If you enjoyed this story, feel free [to subscribe](https://medium.com/@andysingal) to Medium, and you will get notifications when my new articles will be published, as well as full access to thousands of stories from other authors.


