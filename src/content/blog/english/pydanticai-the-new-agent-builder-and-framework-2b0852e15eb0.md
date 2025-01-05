---
title: "PydanticAI — The NEW Agent Builder and Framework"
meta_title: "PydanticAI — The NEW Agent Builder and Framework"
description: "PydanticAI is a Python framework aimed at simplifying the development of production-grade applications using Generative AI. It integrates seamlessly with various model providers like OpenAI and Anthropic, offering features such as type safety, structured responses, and dependency injection. Built by the Pydantic team, it allows for real-time debugging and performance monitoring, making it suitable for robust AI applications. The framework supports both synchronous and asynchronous operations, enabling developers to create complex agents with self-correction capabilities and dynamic system prompts, all while adhering to Pythons best practices."
date: 2025-01-05T02:17:58Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*jhyxzVYzpUEbFsL_yDyzpQ.jpeg"
categories: ["Programming", "Generative AI", "Technology/Web"]
author: "Rifx.Online"
tags: ["Pydantic", "Generative", "OpenAI", "Anthropic", "DependencyInjection"]
draft: False

---






PydanticAI is a Python Agent Framework designed to make it less painful to build production grade applications with Generative AI.

FastAPI revolutionized web development by offering an innovative and ergonomic design, built on the foundation of [Pydantic](https://docs.pydantic.dev/).

Similarly, virtually every agent framework and LLM library in Python uses Pydantic, yet when we began to use LLMs in [Pydantic Logfire](https://pydantic.dev/logfire), we couldn’t find anything that gave us the same feeling.

PydanticAI is built with one simple aim: to bring that FastAPI feeling to GenAI app development.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ENnXK7qCLEHYfjO0M4-nmg.png)


## Why use PydanticAI

**Built by the Pydantic Team**Built by the team behind [Pydantic](https://docs.pydantic.dev/latest/) (the validation layer of the OpenAI SDK, the Anthropic SDK, LangChain, LlamaIndex, AutoGPT, Transformers, CrewAI, Instructor and many more).

**Model\-agnostic**Supports OpenAI, Anthropic, Gemini, Ollama, Groq, and Mistral, and there is a simple interface to implement support for [other models](https://ai.pydantic.dev/models/).

**Pydantic Logfire Integration**Seamlessly [integrates](https://ai.pydantic.dev/logfire/) with [Pydantic Logfire](https://pydantic.dev/logfire) for real\-time debugging, performance monitoring, and behavior tracking of your LLM\-powered applications.

**Type\-safe**Designed to make type checking as useful as possible for you, so it [integrates](https://ai.pydantic.dev/agents/#static-type-checking) well with static type checkers, like [`m`ypy](https://github.com/python/mypy) and [`pyri`ght](https://github.com/microsoft/pyright).

**Python\-centric Design**Leverages Python’s familiar control flow and agent composition to build your AI\-driven projects, making it easy to apply standard Python best practices you’d use in any other (non\-AI) project

**Structured Responses**Harnesses the power of [Pydantic](https://docs.pydantic.dev/latest/) to [validate and structure](https://ai.pydantic.dev/results/#structured-result-validation) model outputs, ensuring responses are consistent across runs.

**Dependency Injection System**Offers an optional [dependency injection](https://ai.pydantic.dev/dependencies/) system to provide data and services to your agent’s [system prompts](https://ai.pydantic.dev/agents/#system-prompts), [tools](https://ai.pydantic.dev/tools/) and [result validators](https://ai.pydantic.dev/results/#result-validators-functions). This is useful for testing and eval\-driven iterative development.

**Streamed Responses**Provides the ability to [stream](https://ai.pydantic.dev/results/#streamed-results) LLM outputs continuously, with immediate validation, ensuring rapid and accurate results.


## Models

PydanticAI is Model\-agnostic and has built in support for the following model providers:

* [OpenAI](https://ai.pydantic.dev/models/#openai)
* [Anthropic](https://ai.pydantic.dev/models/#anthropic)
* Gemini via two different APIs: [Generative Language API](https://ai.pydantic.dev/models/#gemini) and [VertexAI API](https://ai.pydantic.dev/models/#gemini-via-vertexai)
* [Ollama](https://ai.pydantic.dev/models/#ollama)
* [Groq](https://ai.pydantic.dev/models/#groq)
* [Mistral](https://ai.pydantic.dev/models/#mistral)

You can also [add support for other models](https://ai.pydantic.dev/models/#implementing-custom-models).

PydanticAI also comes with [`TestMo`del](https://ai.pydantic.dev/api/models/test/) and [`FunctionMo`del](https://ai.pydantic.dev/api/models/function/) for testing and development.

To use each model provider, you need to configure your local environment and make sure you have the right packages installed.


## Some code examples:

Let me explain this code which demonstrates the basic usage of PydanticAI, a framework for building LLM\-powered applications:


## Example — 1:

1. **Imports and Setup**:


```python
## --------------------------------------------------------------
## 1. Minimal example of PydanticAI with a Simple Agent
## --------------------------------------------------------------
from pydantic import BaseModel, Field
from pydantic_ai import Agent, ModelRetry, RunContext, Tool
from pydantic_ai.models.openai import OpenAIModel
```
* Imports necessary components from Pydantic and PydanticAI
* `nest_asyncio.apply()` enables async operations in Jupyter notebooks
* `load_dotenv()` loads environment variables (likely containing API keys)

2\. **Model Initialization**:


```python
model = OpenAIModel("gpt-4o-mini")
```
Creates an instance of OpenAI’s model interface

**3\.** **Basic Agent Creation**:


```python
agent = Agent(  
    model,
    system_prompt='Be concise, reply with one sentence.',  
)
```
Creates a simple agent with:

* The specified OpenAI model
* A system prompt that instructs the agent to be concise

**4\. Agent Execution**:


```python
result = agent.run_sync('Where does "hello world" come from?')
print(result.data)
```
* Runs the agent synchronously with a question
* Prints the response

**Output:**

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*waXHIAhOhpsjKCUGMkPUrw.png)

Key Features:

1. **Type Safety**: Uses Pydantic for type validation and safety
2. **Structured Responses**: Enables structured output through Pydantic models
3. **Production\-Ready**: Designed for production use with proper error handling
4. **Async Support**: Supports both synchronous and asynchronous operations

This is a minimal example demonstrating the basic setup and usage of PydanticAI, showing how to create a simple agent that can process queries and return structured responses. The framework is particularly useful for building robust AI applications with type safety and structured data handling.


## Example — 2:


```python
## --------------------------------------------------------------
## 2. Simple Agent - Hello World Example
## --------------------------------------------------------------
"""
This example demonstrates the basic usage of PydanticAI agents.
Key concepts:
- Creating a basic agent with a system prompt
- Running synchronous queries
- Accessing response data, message history, and costs
"""

agent1 = Agent(
    model=model,
    system_prompt="You are a helpful customer support agent. Be concise and friendly.",
)

## Example usage of basic agent
response = agent1.run_sync("How can I track my order #12345?")
print(response.data)
```
**Output:**

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*vSyZRamWeIoARUKhtMo7kg.png)


## Example — 3:


```python
## --------------------------------------------------------------
## 3. Agent with Structured Response
## --------------------------------------------------------------
"""
This example shows how to get structured, type-safe responses from the agent.
Key concepts:
- Using Pydantic models to define response structure
- Type validation and safety
- Field descriptions for better model understanding
"""


class ResponseModel(BaseModel):
    """Structured response with metadata."""

    response: str
    needs_escalation: bool
    follow_up_required: bool
    sentiment: str = Field(description="Customer sentiment analysis")


agent2 = Agent(
    model=model,
    result_type=ResponseModel,
    system_prompt=(
        "You are an intelligent customer support agent. "
        "Analyze queries carefully and provide structured responses."
    ),
)

response = agent2.run_sync("How can I track my order #12345?")
print(response.data.model_dump_json(indent=2))
```
1. **Pydantic Model Definition**:

Creates a structured response model using Pydantic’s `BaseModel`

Defines four fields with specific types:

* `response`: String containing the answer
* `needs_escalation`: Boolean flag for escalation
* `follow_up_required`: Boolean flag for follow\-up
* `sentiment`: String for sentiment analysis

2\. **Advanced Agent Creation**:

Here we have created ‘agent2’

3\. **Response Handling**:

Here we have created ‘response’.

* Executes the query and formats response as JSON
* Output will be structured like:


```python
{
  "response": "You can track your order #12345 by...",
  "needs_escalation": false,
  "follow_up_required": true,
  "sentiment": "neutral"
}
```
**4\. Output:**

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*1U93nin8dm-Y1TKrTMUAJw.png)


## Example — 4:


```python
## --------------------------------------------------------------
## 4. Agent with Structured Response & Dependencies
## --------------------------------------------------------------
"""
This example demonstrates how to use dependencies and context in agents.
Key concepts:
- Defining complex data models with Pydantic
- Injecting runtime dependencies
- Using dynamic system prompts
"""


## Define order schema
class Order(BaseModel):
    """Structure for order details."""

    order_id: str
    status: str
    items: List[str]


## Define customer schema
class CustomerDetails(BaseModel):
    """Structure for incoming customer queries."""

    customer_id: str
    name: str
    email: str
    orders: Optional[List[Order]] = None

class ResponseModel(BaseModel):
    """Structured response with metadata."""

    response: str
    needs_escalation: bool
    follow_up_required: bool
    sentiment: str = Field(description="Customer sentiment analysis")


## Agent with structured output and dependencies
agent5 = Agent(
    model=model,
    result_type=ResponseModel,
    deps_type=CustomerDetails,
    retries=3,
    system_prompt=(
        "You are an intelligent customer support agent. "
        "Analyze queries carefully and provide structured responses. "
        "Always greet the customer and provide a helpful response."
    ),  # These are known when writing the code
)


## Add dynamic system prompt based on dependencies
@agent5.system_prompt
async def add_customer_name(ctx: RunContext[CustomerDetails]) -> str:
    return f"Customer details: {to_markdown(ctx.deps)}"  # These depend in some way on context that isn't known until runtime


customer = CustomerDetails(
    customer_id="1",
    name="John Doe",
    email="john.doe@example.com",
    orders=[
        Order(order_id="12345", status="shipped", items=["Blue Jeans", "T-Shirt"]),
    ],
)

response = agent5.run_sync(user_prompt="What did I order?", deps=customer)

response.all_messages()
print(response.data.model_dump_json(indent=2))

print(
    "Customer Details:\n"
    f"Name: {customer.name}\n"
    f"Email: {customer.email}\n\n"
    "Response Details:\n"
    f"{response.data.response}\n\n"
    "Status:\n"
    f"Follow-up Required: {response.data.follow_up_required}\n"
    f"Needs Escalation: {response.data.needs_escalation}"
)
```
1. **Data Models Definition**:
* Defines three Pydantic models for structured data handling
* Creates a hierarchy of models (CustomerDetails contains Orders) — class objects ( Order, CustomerDetails, ResponseModel)

**2\.** **Advanced Agent Configuration**:

* Specifies both response type and dependencies type
* Includes retry logic (3 attempts)
* Sets base system prompt

**3\.** **Dynamic System Prompt**:

* Adds runtime context to system prompt
* Uses decorator pattern for dynamic prompting
* Converts customer details to markdown format

**4\.** **Response Handling**:

* Prints formatted JSON response
* Displays customer details and response status

**5\. Output:**

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*i-lctSs2BSXWjgi6MJbB_A.png)

**Key Features:**

1. **Dependency Injection**: Runtime context provided through deps
2. **Complex Data Modeling**: Nested models with relationships
3. **Dynamic Prompting**: Context\-aware system prompts
4. **Type Safety**: Full type checking throughout
5. **Error Handling**: Retry mechanism for reliability


## Example — 5:


```python
## --------------------------------------------------------------
## 5. Agent with Tools
## --------------------------------------------------------------

"""
This example shows how to enhance agents with custom tools.
Key concepts:
- Creating and registering tools
- Accessing context in tools
"""

shipping_info_db: Dict[str, str] = {
    "12345": "Shipped on 2024-12-01",
    "67890": "Out for delivery",
}

## Define order schema
class Order(BaseModel):
    """Structure for order details."""

    order_id: str
    status: str
    items: List[str]


## Define customer schema
class CustomerDetails(BaseModel):
    """Structure for incoming customer queries."""

    customer_id: str
    name: str
    email: str
    orders: Optional[List[Order]] = None

class ResponseModel(BaseModel):
    """Structured response with metadata."""

    response: str
    needs_escalation: bool
    follow_up_required: bool
    sentiment: str = Field(description="Customer sentiment analysis")


customer = CustomerDetails(
    customer_id="1",
    name="John Doe",
    email="john.doe@example.com",
    orders=[
        Order(order_id="12345", status="shipped", items=["Blue Jeans", "T-Shirt"]),
    ],
)


def get_shipping_info(ctx: RunContext[CustomerDetails]) -> str:
    """Get the customer's shipping information."""
    return shipping_info_db[ctx.deps.orders[0].order_id]




## Agent with structured output and dependencies
agent5 = Agent(
    model=model,
    result_type=ResponseModel,
    deps_type=CustomerDetails,
    retries=3,
    system_prompt=(
        "You are an intelligent customer support agent. "
        "Analyze queries carefully and provide structured responses. "
        "Use tools to look up relevant information."
        "Always great the customer and provide a helpful response."
    ),  # These are known when writing the code
    tools=[Tool(get_shipping_info, takes_ctx=True)],  # Add tool via kwarg
)


@agent5.system_prompt
async def add_customer_name(ctx: RunContext[CustomerDetails]) -> str:
    return f"Customer details: {to_markdown(ctx.deps)}"


response = agent5.run_sync(
    user_prompt="What's the status of my last order?", deps=customer
)

response.all_messages()
print(response.data.model_dump_json(indent=2))

print(
    "Customer Details:\n"
    f"Name: {customer.name}\n"
    f"Email: {customer.email}\n\n"
    "Response Details:\n"
    f"{response.data.response}\n\n"
    "Status:\n"
    f"Follow-up Required: {response.data.follow_up_required}\n"
    f"Needs Escalation: {response.data.needs_escalation}"
)
```
1. **Database Simulation**:
* Simulates a simple database for shipping information

**2\.** **Data Models** (Same as previous example):

3\. **Custom Tool Definition**: (Here — get\_shipping\_info)

* Creates a tool that looks up shipping information
* Takes context parameter to access customer details
* Returns shipping status string

4\. **Enhanced Agent Configuration**:

* Adds tool via `tools` parameter
* Specifies that tool requires context (`takes_ctx=True`)

5\. **Dynamic System Prompt**:

**add\_customer\_name** method is doing the job of accepting dynamic system prompting.

**6\. Output:**

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*FKV5CpZvLXXGILiDplY5YA.png)


## Example — 6:


```python
## --------------------------------------------------------------
## 6. Agent with Reflection and Self-Correction
## --------------------------------------------------------------

"""
This example demonstrates advanced agent capabilities with self-correction.
Key concepts:
- Implementing self-reflection
- Handling errors gracefully with retries
- Using ModelRetry for automatic retries
- Decorator-based tool registration
"""

## Simulated database of shipping information
shipping_info_db: Dict[str, str] = {
    "#12345": "Shipped on 2024-12-01",
    "#67890": "Out for delivery",
}

## Define order schema
class Order(BaseModel):
    """Structure for order details."""

    order_id: str
    status: str
    items: List[str]

class ResponseModel(BaseModel):
    """Structured response with metadata."""

    response: str
    needs_escalation: bool
    follow_up_required: bool
    sentiment: str = Field(description="Customer sentiment analysis")

## Define customer schema
class CustomerDetails(BaseModel):
    """Structure for incoming customer queries."""

    customer_id: str
    name: str
    email: str
    orders: Optional[List[Order]] = None


customer = CustomerDetails(
    customer_id="1",
    name="John Doe",
    email="john.doe@example.com",
    orders=[
        Order(order_id="12345", status="shipped", items=["Blue Jeans", "T-Shirt"]),
    ],
)

## Agent with reflection and self-correction
agent5 = Agent(
    model=model,
    result_type=ResponseModel,
    deps_type=CustomerDetails,
    retries=3,
    system_prompt=(
        "You are an intelligent customer support agent. "
        "Analyze queries carefully and provide structured responses. "
        "Use tools to look up relevant information. "
        "Always greet the customer and provide a helpful response."
    ),
)


@agent5.tool_plain()  # Add plain tool via decorator
def get_shipping_status(order_id: str) -> str:
    """Get the shipping status for a given order ID."""
    shipping_status = shipping_info_db.get(order_id)
    if shipping_status is None:
        raise ModelRetry(
            f"No shipping information found for order ID {order_id}. "
            "Make sure the order ID starts with a #: e.g, #624743 "
            "Self-correct this if needed and try again."
        )
    return shipping_info_db[order_id]


## Example usage
response = agent5.run_sync(
    user_prompt="What's the status of my last order 12345?", deps=customer
)

response.all_messages()
print(response.data.model_dump_json(indent=2))
```
**Key Features:**

1. **Self\-Correction Mechanism**:
* Uses `ModelRetry` for automatic retries
* Provides helpful error messages for self\-correction
* Validates order ID format

**2\. Decorator\-Based Tools**:

* Uses `@agent5.tool_plain()` decorator
* Simplifies tool registration
* Provides clean syntax for tool definition

**3\. Error Handling**:

* Graceful handling of missing data
* Automatic retry mechanism
* Informative error messages

**4\. Input Validation**:

* Checks for correct order ID format
* Provides guidance for correction
* Maintains data integrity

**5\. Output:**

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*mTvXw44ovPmen4izQSXxCg.png)

Here we kind of explored different types of Agents usage using PydanticAI framework. Complete credit to ([daveebbelaar](https://github.com/daveebbelaar/pydantic-ai-tutorial/blob/main/src/introduction.py)). Anyways this certianly does show a lot of promise, as a new framework that you can use sort of very simple abstractions to be able to choose different LLMs, have system prompts, change the system prompts on the fly. Be able to inject different things in and be able to set up a history so that you have got some memory and stuff going on very easily in here. It’s something that’s done in a very Pythonic fashion. In many ways, much easier to understand than some of the things like, Langchain, LangGraph, LlamaIndex, etc., for these kind of things. We can try on how this plays well with a RAG system. Probably I will explore on this later and also I would like to explore a comparision of different frameworks and how they differ from each other. Stay tuned!!!

**Please do clap** 👏 **or comment if you find it helpful ❤️🙏**


## References:

1. <https://ai.pydantic.dev/>
2. [https://github.com/daveebbelaar/pydantic\-ai\-tutorial/blob/main/src/introduction.py](https://github.com/daveebbelaar/pydantic-ai-tutorial/blob/main/src/introduction.py)

