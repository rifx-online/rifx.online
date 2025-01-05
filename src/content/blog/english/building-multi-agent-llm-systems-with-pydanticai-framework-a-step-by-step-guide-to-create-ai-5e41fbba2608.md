---
title: "🚀Building Multi-Agent LLM Systems with PydanticAI Framework: A Step-by-Step Guide To Create AI…"
meta_title: "🚀Building Multi-Agent LLM Systems with PydanticAI Framework: A Step-by-Step Guide To Create AI…"
description: "PydanticAI is a Python framework designed for building production-grade applications leveraging Generative AI, enhancing data validation and agent interaction through Pydantics robust capabilities. It supports multiple AI models, offers dependency injection, and facilitates structured responses. Key features include type safety, real-time debugging, and the ability to integrate tools and manage message history, making it suitable for complex workflows. PydanticAI addresses challenges in the agent framework landscape by providing a streamlined approach for developers to create reliable AI systems."
date: 2025-01-05T01:59:43Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*poYIHZMPGKdODDLO.png"
categories: ["Programming", "Generative AI", "Data Science"]
author: "Rifx.Online"
tags: ["Pydantic", "Generative", "Models", "Dependency", "Structured"]
draft: False

---






Pydantic, a powerhouse in the Python ecosystem with over **285 million monthly downloads**, has been a cornerstone of robust data validation in Python projects. Now, its creators are venturing into the cutting\-edge domain of AI with **Pydantic AI**, a framework designed for building production\-grade applications powered by Generative AI. In this article, we’ll delve into **what makes Pydantic AI unique**, its key features, and how it compares to other agent frameworks.


## Pydantic Vs Pydantic in GenAI Vs PydanticAI


> **Pydantic:**


```python
from datetime import date
from pydantic import BaseModel
class User(BaseModel):
    id: int
    name: str
    dob: date
user = User(id='123', name='Samuel Colvin', dob='1987-01-28')
#> User(id=123, name='Samuel Colvin', dob=date(1987, 1, 28))
user = User.model_validate_json('{"id: 123, "name": "Samuel Colvin", "dob": "1987-01-28"}')
#> User(id=123, name='Samuel Colvin', dob=date(1987, 1, 28))
print(User.model_json_schema())
s = {
    'properties': {
        'id': {'title': 'Id', 'type': 'integer'},
        'name': {'title': 'Name', 'type': 'string'},
        'dob': {'format': 'date', 'title': 'Dob', 'type': 'string'},
    },
    'required': ['id', 'name', 'dob'],
    'title': 'User',
    'type': 'object',
}
```

> **Pydantic in GenAI:**


```python
from datetime import date
from pydantic import BaseModel
from openai import OpenAI
class User(BaseModel):
    """Definition of a user"""
    id: int
    name: str
    dob: date
response = OpenAI().chat.completions.create(
    model='gpt-4o',
    messages=[
        {'role': 'system', 'content': 'Extract information about the user'},
        {'role': 'user', 'content': 'The user with ID 123 is called Samuel, born on Jan 28th 87'}
    ],
    tools=[
        {
            'function': {
                'name': User.__name__,
                'description': User.__doc__,
                'parameters': User.model_json_schema(),
            },
            'type': 'function'
        }
    ]
)
user = User.model_validate_json(response.choices[0].message.tool_calls[0].function.arguments)
print(user)
```

> **PydanticAI:**

That same example with PydanticAI — Agent Framework for production.


```python
from datetime import date
from pydantic_ai import Agent
from pydantic import BaseModel
class User(BaseModel):
    """Definition of a user"""
    id: int
    name: str
    dob: date
agent = Agent(
    'openai:gpt-4o',
    result_type=User,
    system_prompt='Extract information about the user',
)
result = agent.run_sync('The user with ID 123 is called Samuel, born on Jan 28th 87')
print(result.data)
```

> **What Is PydanticAI?**

PydanticAI is a Python agent framework designed to make it less painful to build production grade applications with Generative AI.


> **Why PydanticAI?**

Suppose you’re making an app where users submit their name, age, and email. You want to ensure:


> *The name is a string.*


> *The age is a number.*


> *The email is in a valid format.*

Here’s how Pydantic makes this easy:


```python
from pydantic import BaseModel, EmailStr
## Define the model
class User(BaseModel):
    name: str
    age: int
    email: EmailStr
## Example input
user_data = {
    "name": "Alice",
    "age": 25,
    "email": "alice@example.com"
}
## Validate the input
user = User(**user_data)
print(user.name)  # Alice
print(user.age)   # 25
print(user.email) # alice@example.com
```

## What if the data is wrong?

If the user submits invalid data (e.g., `"age": "twenty-five"`), Pydantic will throw an error automatically:


```python
user_data = {
    "name": "Alice",
    "age": "twenty-five",  # Invalid
    "email": "alice@example.com"
}
user = User(**user_data)
## Error: value is not a valid integer
```
Pydantic plays a critical role in deployment as is mostly mandatory to follow because

***Built by the Pydantic Team***Built by the team behind Pydantic (the validation layer of the OpenAI SDK, the Anthropic SDK, LangChain, LlamaIndex, AutoGPT, Transformers, CrewAI, Instructor and many more).

***Model\-agnostic***Supports OpenAI, Anthropic, Gemini, Ollama, Groq, and Mistral, and there is a simple interface to implement support for other models.

***Pydantic Logfire Integration***Seamlessly integrates with Pydantic Logfire for real\-time debugging, performance monitoring, and behavior tracking of your LLM\-powered applications.

***Type\-safe***Designed to make type checking as useful as possible for you, so it [integrates](https://ai.pydantic.dev/agents/#static-type-checking) well with static type checkers, like [`m`ypy](https://github.com/python/mypy) and [`pyri`ght](https://github.com/microsoft/pyright).

***Python\-centric Design***Leverages Python’s familiar control flow and agent composition to build your AI\-driven projects, making it easy to apply standard Python best practices you’d use in any other (non\-AI) project

***Structured Responses***Harnesses the power of Pydantic to validate and structure model outputs, ensuring responses are consistent across runs.

***Dependency Injection System***Offers an optional dependency injection system to provide data and services to your agent’s system prompts, tools and result validators. This is useful for testing and eval\-driven iterative development.

***Streamed Responses***Provides the ability to stream LLM outputs continuously, with immediate validation, ensuring rapid and accurate results.

The aim is to solve one of the major issues in the agent framework landscape: the lack of tools designed specifically for production use cases.


> **Installing PydanticAI**

Requires Python 3\.9\+


```python
pip install pydantic-ai
```
This installs the `pydantic_ai` package, core dependencies, and libraries required to use all the models included in PydanticAI. If you want to use a specific model, you can install the "slim" version of PydanticAI.


> ***8 important components of PydanticAI***

* Agents
* Models
* Dependencies
* Function Tools
* Results
* Messages and chat history
* Testing and Evals
* Debugging and Monitoring


## Agents

Agents are PydanticAI’s primary interface for interacting with LLMs.

In some use cases a single Agent will control an entire application or component, but multiple agents can also interact to embody more complex workflows.


> The Agent class has full API documentation, but conceptually you can think of an agent as a container for:


### Running Agents

There are three ways to run an agent:

1. `agent.run()` — a coroutine which returns a `RunResult` containing a completed response
2. `agent.run_sync()` — a plain, synchronous function which returns a `RunResult` containing a completed response (internally, this just calls `loop.run_until_complete(self.run())`)
3. `agent.run_stream()` — a coroutine which returns a `StreamedRunResult`, which contains methods to stream a response as an async iterable

Here’s a simple example demonstrating all three:


```python
from pydantic_ai import Agent
agent = Agent('openai:gpt-4o')
result_sync = agent.run_sync('What is the capital of Italy?')
print(result_sync.data)
#> Rome

async def main():
    result = await agent.run('What is the capital of France?')
    print(result.data)
    #> Paris
    async with agent.run_stream('What is the capital of the UK?') as response:
        print(await response.get_data())
        #> London
```

## Models

PydanticAI is Model\-agnostic and has built in support for the following model providers:

* OpenAI
* Anthropic
* Gemini via two different APIs: Generative Language API and VertexAI API
* Ollama
* Groq
* Mistral

You can also add support for other models.

PydanticAI also comes with `TestModel` and `FunctionModel` for testing and development.

To use each model provider, you need to configure your local environment and make sure you have the right packages installed.

To use `GeminiModel` models, you just need to install `pydantic-ai` or `pydantic-ai-slim`, no extra dependencies are required.


### Configuration

`GeminiModel` let's you use the Google's Gemini models through their Generative Language API, `generativelanguage.googleapis.com`.

`GeminiModelName` contains a list of available Gemini models that can be used through this interface.

To use `GeminiModel`, go to aistudio.google.com and follow your nose until you find the place to generate an API key.


### Environment variable

Once you have the API key, you can set it as an environment variable:


```python
from pydantic_ai import Agent
from pydantic_ai.models.gemini import GeminiModel
model = GeminiModel('gemini-1.5-flash', api_key=os.environ['GEMINI_API_KEY'])
agent = Agent(model)
```

## Dependencies

PydanticAI uses a dependency injection system to provide data and services to your agent’s system prompts, tools and result validators.

Matching PydanticAI’s design philosophy, our dependency system tries to use existing best practice in Python development rather than inventing esoteric “magic”, this should make dependencies type\-safe, understandable easier to test and ultimately easier to deploy in production.


### Defining Dependencies

Dependencies can be any python type. While in simple cases you might be able to pass a single object as a dependency (e.g. an HTTP connection), dataclasses are generally a convenient container when your dependencies included multiple objects.

Here’s an example of defining an agent that requires dependencies.


```python
from dataclasses import dataclass
import httpx
from pydantic_ai import Agent, RunContext

@dataclass
class MyDeps:
    api_key: str
    http_client: httpx.AsyncClient

agent = Agent(
    'openai:gpt-4o',
    deps_type=MyDeps,
)

@agent.system_prompt  
async def get_system_prompt(ctx: RunContext[MyDeps]) -> str:  
    response = await ctx.deps.http_client.get(  
        'https://example.com',
        headers={'Authorization': f'Bearer {ctx.deps.api_key}'},  
    )
    response.raise_for_status()
    return f'Prompt: {response.text}'

async def main():
    async with httpx.AsyncClient() as client:
        deps = MyDeps('foobar', client)
        result = await agent.run('Tell me a joke.', deps=deps)
        print(result.data)
        #> Did you hear about the toothpaste scandal? They called it Colgate.
```
MyDeps are the dependencies are getting injected into agent.run method


## Function Tools

Function tools provide a mechanism for models to retrieve extra information to help them generate a response.

They’re useful when it is impractical or impossible to put all the context an agent might need into the system prompt, or when you want to make agents’ behavior more deterministic or reliable by deferring some of the logic required to generate a response to another (not necessarily AI\-powered) tool.

There are a number of ways to register tools with an agent:

* via the `@agent.tool` decorator — for tools that need access to the agent context
* via the `@agent.tool_plain` decorator — for tools that do not need access to the agent context
* via the `tools` keyword argument to `Agent` which can take either plain functions, or instances of `Tool`

`@agent.tool` is considered the default decorator since in the majority of cases tools will need access to the agent context.

Here’s an example using both:


```python
import random
from pydantic_ai import Agent, RunContext
agent = Agent(
    'gemini-1.5-flash',  
    deps_type=str,  
    system_prompt=(
        "You're a dice game, you should roll the die and see if the number "
        "you get back matches the user's guess. If so, tell them they're a winner. "
        "Use the player's name in the response."
    ),
)

@agent.tool_plain  
def roll_die() -> str:
    """Roll a six-sided die and return the result."""
    return str(random.randint(1, 6))

@agent.tool  
def get_player_name(ctx: RunContext[str]) -> str:
    """Get the player's name."""
    return ctx.deps

dice_result = agent.run_sync('My guess is 4', deps='Anne')  
print(dice_result.data)
#> Congratulations Anne, you guessed correctly! You're a winner!
```

## Results

Results are the final values returned from running an agent. The result values are wrapped in `RunResult` and `StreamedRunResult` so you can access other data like usage of the run and message history

Both `RunResult` and `StreamedRunResult` are generic in the data they wrap, so typing information about the data returned by the agent is preserved


```python
from pydantic import BaseModel
from pydantic_ai import Agent

class CityLocation(BaseModel):
    city: str
    country: str

agent = Agent('gemini-1.5-flash', result_type=CityLocation)
result = agent.run_sync('Where were the olympics held in 2012?')
print(result.data)
#> city='London' country='United Kingdom'
print(result.usage())
"""
Usage(requests=1, request_tokens=57, response_tokens=8, total_tokens=65, details=None)
"""
```

## Messages and chat history

PydanticAI provides access to messages exchanged during an agent run. These messages can be used both to continue a coherent conversation, and to understand how an agent performed.


### Accessing Messages from Results

After running an agent, you can access the messages exchanged during that run from the `result` object.

Both `RunResult` (returned by `Agent.run`, `Agent.run_sync`) and `StreamedRunResult` (returned by `Agent.run_stream`) have the following methods:

* `all_messages()`: returns all messages, including messages from prior runs. There's also a variant that returns JSON bytes, `all_messages_json()`.
* `new_messages()`: returns only the messages from the current run. There's also a variant that returns JSON bytes, `new_messages_json()`.


### Using Messages as Input for Further Agent Runs

The primary use of message histories in PydanticAI is to maintain context across multiple agent runs.

To use existing messages in a run, pass them to the `message_history` parameter of `Agent.run`, `Agent.run_sync` or `Agent.run_stream`.

If `message_history` is set and not empty, a new system prompt is not generated — we assume the existing message history includes a system prompt.


```python
from pydantic_ai import Agent
agent = Agent('openai:gpt-4o', system_prompt='Be a helpful assistant.')
result1 = agent.run_sync('Tell me a joke.')
print(result1.data)
#> Did you hear about the toothpaste scandal? They called it Colgate.
result2 = agent.run_sync('Explain?', message_history=result1.new_messages())
print(result2.data)
#> This is an excellent joke invent by Samuel Colvin, it needs no explanation.
print(result2.all_messages())
"""
[
    ModelRequest(
        parts=[
            SystemPromptPart(
                content='Be a helpful assistant.', part_kind='system-prompt'
            ),
            UserPromptPart(
                content='Tell me a joke.',
                timestamp=datetime.datetime(...),
                part_kind='user-prompt',
            ),
        ],
        kind='request',
    ),
    ModelResponse(
        parts=[
            TextPart(
                content='Did you hear about the toothpaste scandal? They called it Colgate.',
                part_kind='text',
            )
        ],
        timestamp=datetime.datetime(...),
        kind='response',
    ),
    ModelRequest(
        parts=[
            UserPromptPart(
                content='Explain?',
                timestamp=datetime.datetime(...),
                part_kind='user-prompt',
            )
        ],
        kind='request',
    ),
    ModelResponse(
        parts=[
            TextPart(
                content='This is an excellent joke invent by Samuel Colvin, it needs no explanation.',
                part_kind='text',
            )
        ],
        timestamp=datetime.datetime(...),
        kind='response',
    ),
]
"""
```

## Testing and Evals

With PydanticAI and LLM integrations in general, there are two distinct kinds of test:

1. **Unit tests** — tests of your application code, and whether it’s behaving correctly
2. **Evals** — tests of the LLM, and how good or bad its responses are

For the most part, these two kinds of tests have pretty separate goals and considerations.


### Unit tests

Unit tests for PydanticAI code are just like unit tests for any other Python code.

Because for the most part they’re nothing new, we have pretty well established tools and patterns for writing and running these kinds of tests.

Unless you’re really sure you know better, you’ll probably want to follow roughly this strategy:

* Use `pytest` as your test harness
* If you find yourself typing out long assertions, use inline\-snapshot
* Similarly, dirty\-equals can be useful for comparing large data structures
* Use `TestModel` or `FunctionModel` in place of your actual model to avoid the usage, latency and variability of real LLM calls
* Use `Agent.override` to replace your model inside your application logic
* Set `ALLOW_MODEL_REQUESTS=False` globally to block any requests from being made to non\-test models accidentally

Let’s write unit tests for the following application code:


```python
import asyncio
from datetime import date
from pydantic_ai import Agent, RunContext
from fake_database import DatabaseConn  
from weather_service import WeatherService  
weather_agent = Agent(
    'openai:gpt-4o',
    deps_type=WeatherService,
    system_prompt='Providing a weather forecast at the locations the user provides.',
)

@weather_agent.tool
def weather_forecast(
    ctx: RunContext[WeatherService], location: str, forecast_date: date
) -> str:
    if forecast_date < date.today():  
        return ctx.deps.get_historic_weather(location, forecast_date)
    else:
        return ctx.deps.get_forecast(location, forecast_date)

async def run_weather_forecast(  
    user_prompts: list[tuple[str, int]], conn: DatabaseConn
):
    """Run weather forecast for a list of user prompts and save."""
    async with WeatherService() as weather_service:
        async def run_forecast(prompt: str, user_id: int):
            result = await weather_agent.run(prompt, deps=weather_service)
            await conn.store_forecast(user_id, result.data)
        # run all prompts in parallel
        await asyncio.gather(
            *(run_forecast(prompt, user_id) for (prompt, user_id) in user_prompts)
        )
```
Here we have a function that takes a list of `(user_prompt, user_id)` tuples, gets a weather forecast for each prompt, and stores the result in the database.

We want to test this code without having to mock certain objects or modify our code so we can pass test objects in.

Here’s how we would write tests using `TestModel`:


```python
from datetime import timezone
import pytest
from dirty_equals import IsNow
from pydantic_ai import models, capture_run_messages
from pydantic_ai.models.test import TestModel
from pydantic_ai.messages import (
    ArgsDict,
    ModelResponse,
    SystemPromptPart,
    TextPart,
    ToolCallPart,
    ToolReturnPart,
    UserPromptPart,
    ModelRequest,
)
from fake_database import DatabaseConn
from weather_app import run_weather_forecast, weather_agent
pytestmark = pytest.mark.anyio  
models.ALLOW_MODEL_REQUESTS = False  

async def test_forecast():
    conn = DatabaseConn()
    user_id = 1
    with capture_run_messages() as messages:
        with weather_agent.override(model=TestModel()):  
            prompt = 'What will the weather be like in London on 2024-11-28?'
            await run_weather_forecast([(prompt, user_id)], conn)  
    forecast = await conn.get_forecast(user_id)
    assert forecast == '{"weather_forecast":"Sunny with a chance of rain"}'  
    assert messages == [  
        ModelRequest(
            parts=[
                SystemPromptPart(
                    content='Providing a weather forecast at the locations the user provides.',
                ),
                UserPromptPart(
                    content='What will the weather be like in London on 2024-11-28?',
                    timestamp=IsNow(tz=timezone.utc),  
                ),
            ]
        ),
        ModelResponse(
            parts=[
                ToolCallPart(
                    tool_name='weather_forecast',
                    args=ArgsDict(
                        args_dict={
                            'location': 'a',
                            'forecast_date': '2024-01-01',  
                        }
                    ),
                    tool_call_id=None,
                )
            ],
            timestamp=IsNow(tz=timezone.utc),
        ),
        ModelRequest(
            parts=[
                ToolReturnPart(
                    tool_name='weather_forecast',
                    content='Sunny with a chance of rain',
                    tool_call_id=None,
                    timestamp=IsNow(tz=timezone.utc),
                ),
            ],
        ),
        ModelResponse(
            parts=[
                TextPart(
                    content='{"weather_forecast":"Sunny with a chance of rain"}',
                )
            ],
            timestamp=IsNow(tz=timezone.utc),
        ),
    ]
```

### Unit testing with FunctionModel

The above tests are a great start, but careful readers will notice that the `WeatherService.get_forecast` is never called since `TestModel` calls `weather_forecast` with a date in the past.

To fully exercise `weather_forecast`, we need to use `FunctionModel` to customise how the tools is called.

Here’s an example of using `FunctionModel` to test the `weather_forecast` tool with custom inputs


```python
import re
import pytest
from pydantic_ai import models
from pydantic_ai.messages import (
    ModelMessage,
    ModelResponse,
    ToolCallPart,
)
from pydantic_ai.models.function import AgentInfo, FunctionModel
from fake_database import DatabaseConn
from weather_app import run_weather_forecast, weather_agent
pytestmark = pytest.mark.anyio
models.ALLOW_MODEL_REQUESTS = False

def call_weather_forecast(  
    messages: list[ModelMessage], info: AgentInfo
) -> ModelResponse:
    if len(messages) == 1:
        # first call, call the weather forecast tool
        user_prompt = messages[0].parts[-1]
        m = re.search(r'\d{4}-\d{2}-\d{2}', user_prompt.content)
        assert m is not None
        args = {'location': 'London', 'forecast_date': m.group()}  
        return ModelResponse(
            parts=[ToolCallPart.from_raw_args('weather_forecast', args)]
        )
    else:
        # second call, return the forecast
        msg = messages[-1].parts[0]
        assert msg.part_kind == 'tool-return'
        return ModelResponse.from_text(f'The forecast is: {msg.content}')

async def test_forecast_future():
    conn = DatabaseConn()
    user_id = 1
    with weather_agent.override(model=FunctionModel(call_weather_forecast)):  
        prompt = 'What will the weather be like in London on 2032-01-01?'
        await run_weather_forecast([(prompt, user_id)], conn)
    forecast = await conn.get_forecast(user_id)
    assert forecast == 'The forecast is: Rainy with a chance of sun'
```

### Evals

“Evals” refers to evaluating a models performance for a specific application.

Evals are generally more like benchmarks than unit tests, they never “pass” although they do “fail”; you care mostly about how they change over time.

Since evals need to be run against the real model, then can be slow and expensive to run, you generally won’t want to run them in CI for every commit.


### Measuring performance

The hardest part of evals is measuring how well the model has performed.

In some cases (e.g. an agent to generate SQL) there are simple, easy to run tests that can be used to measure performance (e.g. is the SQL valid? Does it return the right results? Does it return just the right results?).

In other cases (e.g. an agent that gives advice on quitting smoking) it can be very hard or impossible to make quantitative measures of performance — in the smoking case you’d really need to run a double\-blind trial over months, then wait 40 years and observe health outcomes to know if changes to your prompt were an improvement.

There are a few different strategies you can use to measure performance:

* **End to end, self\-contained tests** — like the SQL example, we can test the final result of the agent near\-instantly
* **Synthetic self\-contained tests** — writing unit test style checks that the output is as expected, checks like `'chewing gum' in response`, while these checks might seem simplistic they can be helpful, one nice characteristic is that it's easy to tell what's wrong when they fail
* **LLMs evaluating LLMs** — using another models, or even the same model with a different prompt to evaluate the performance of the agent (like when the class marks each other’s homework because the teacher has a hangover), while the downsides and complexities of this approach are obvious, some think it can be a useful tool in the right circumstances
* **Evals in prod** — measuring the end results of the agent in production, then creating a quantitative measure of performance, so you can easily measure changes over time as you change the prompt or model used, logfire can be extremely useful in this case since you can write a custom query to measure the performance of your agent


### System prompt customization

The system prompt is the developer’s primary tool in controlling an agent’s behavior, so it’s often useful to be able to customize the system prompt and see how performance changes. This is particularly relevant when the system prompt contains a list of examples and you want to understand how changing that list affects the model’s performance.


## Debugging and Monitoring

Applications that use LLMs have some challenges that are well known and understood: LLMs are **slow**, **unreliable** and **expensive**.

These applications also have some challenges that most developers have encountered much less often: LLMs are **fickle** and **non\-deterministic**. Subtle changes in a prompt can completely change a model’s performance, and there’s no `EXPLAIN` query you can run to understand why

To build successful applications with LLMs, we need new tools to understand both model performance, and the behavior of applications that rely on them.

LLM Observability tools that just let you understand how your model is performing are useless: making API calls to an LLM is easy, it’s building that into an application that’s hard.


### Pydantic Logfire

Pydantic Logfire is an observability platform developed by the team who created and maintain Pydantic and PydanticAI. Logfire aims to let you understand your entire application: Gen AI, classic predictive AI, HTTP traffic, database queries and everything else a modern application needs.

PydanticAI has built\-in (but optional) support for Logfire via the `logfire-api` no\-op package.

That means if the `logfire` package is installed and configured, detailed information about agent runs is sent to Logfire. But if the `logfire` package is not installed, there's virtually no overhead and nothing is sent.

Here’s an example showing details of running the Weather Agent in Logfire:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*GlIOkbWSg-4sgR7Z.png)


## Example 1: A Simple AI Agent

Here’s how to set up a basic AI agent that validates structured data using a Pydantic model. \[1]

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*vPrYOb2xTDljoTEW.png)

Figure 1: A sequence diagram showing how User, Agent, and Model.

Let us go ahead create some python code to get us started.


```python
from pydantic_ai import Agent
from pydantic import BaseModel
## Define the structure of the response
class CityInfo(BaseModel):
 city: str
 country: str
## Create an agent
agent = Agent(
 model='openai:gpt-4o', # Specify your model
 result_type=CityInfo # Enforce the structure of the response
)
## Run the agent
if __name__ == '__main__':
 result = agent.run_sync("Tell me about Paris.")
 print(result.data) # Outputs: {'city': 'Paris', 'country': 'France'}
```
See how simple? What happens here is that the`CityInfo` model defines the structure we expect from the response. The agent is then configured to validate the LLM’s output against this structure, ensuring predictable results. Quick and simple!


## Example 2: Adding Tools to Your Agent

Tools in PydanticAI are helper functions your agent can call during its reasoning process.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*IDroaHTnQf8ZySU_.png)

Figure 2: A sequence diagram showing the User, Agent, and Tool being used.

Let us go ahead create some python code to show how tools can be used.


```python
from pydantic_ai import Agent, RunContext
import random
## Define the agent
agent = Agent('openai:gpt-4o')
## Add a tool to roll a die
@agent.tool
async def roll_die(ctx: RunContext, sides: int = 6) -> int:
    """Rolls a die with the specified number of sides."""
    return random.randint(1, sides)
## Run the agent
if __name__ == '__main__':
    result = agent.run_sync("Roll a 20-sided die.")
    print(result.data)  # Outputs a random number between 1 and 20
```
Tools give the agent resources to work with and be more productive. In the end, they help by extending your agent’s functionality. They can interact with APIs, databases, or even perform calculations.

*I am bored with theory ufffff* 🙁*..Yeah Its Coding Time* 😝😝😝😝*!!!!!!!!!!!!!!!!!!!!!!!!!!*

Lets go ahead and code this up in Python to show how we can connect a separate API into the application.

Use Case : Researcher and Writer

We need Gemini API Key and *Tavily API,*

*If you want know how to create Gemini API Key* go to [aistudio.google.com](https://aistudio.google.com/) and follow your notes until you find the place to generate an API key.

*TAVILY\_API\_KEY if you want to create one for you, get it from this link <https://app.tavily.com/>*

Once you got both the key please setup in .env file like below


```python
GEMINI_API_KEY = "Your api key"
TVLY_API_KEY ="Your api key"
```

```python
pip install 'pydantic-ai[examples]' \
pip install tavily-python
```

```python
import asyncio
from dataclasses import dataclass
import json
import os
from typing import List
from pydantic import BaseModel
from pydantic_ai import Agent, RunContext 
from dotenv import load_dotenv
from pydantic_ai.models.gemini import GeminiModel
from httpx import AsyncClient
from tavily import TavilyClient
load_dotenv()
@dataclass
class Deps:
    content_strategist_agent:Agent[None,str]
    client: AsyncClient
    tvly_api_key: str | None
    content:str
    
@dataclass
class Content:
    points: str
class BlogPostBaseModel(BaseModel):
    content:str
model = GeminiModel('gemini-1.5-flash', api_key=os.environ['GEMINI_API_KEY'])
## Agent setup
search_agent = Agent(
    model= model ,
    result_type=Content,
    system_prompt=(
        """you are Senior Research Analyst and your work as a leading tech think tank.
  Your expertise lies in identifying emerging trends.
  You have a knack for dissecting complex data and presenting actionable insights.given topic pydantic AI.
  Full analysis report in bullet points"""
    ),
    retries=2
)
content_writer_agents = Agent(
    model= model ,
    deps_type=Content,
    result_type=BlogPostBaseModel,
    system_prompt=(
        """You are a renowned Content Strategist, known for your insightful and engaging articles.use search_web for getting the list of points
  You transform complex concepts into compelling narratives.Full blog post of at least 4 paragraphs include paragrahs,headings, bullet points include html tags, please remove '\\n\\n'}"""
    ),
    retries=2
)
## Web Search for your query
@search_agent.tool
async def search_web(
    ctx: RunContext[Deps], web_query: str
) -> str:
    """Web Search for your query."""
    tavily_client = TavilyClient(api_key=ctx.deps.tvly_api_key)
    response =  tavily_client.search(web_query)
    return json.dumps(response)
@search_agent.tool
async def content_writer_agent(
    ctx: RunContext[Deps], question: str
) -> str:
    """Use this tool to communicate with content strategist"""
    print(question)
    response = await ctx.deps.content_strategist_agent.run(user_prompt=question)
    ctx.deps.content = response.data
    print("contentstragist") 
    return response.data
async def main():
    async with AsyncClient() as client:
        message_history =[]
        tvly_api_key = os.environ['TVLY_API_KEY']
        deps = Deps(client=client, tvly_api_key=tvly_api_key,content_strategist_agent=content_writer_agents,content="")
        result = await search_agent.run("blog article for Pydantic AI",message_history=message_history, deps=deps)
        message_history = result.all_messages()
        print("Blog:")
        print(deps.content)
if __name__ == '__main__':
    asyncio.run(main()
```

> The output is such a nice blog about Pydantic AI….


```python
Pydantic AI: A Robust Foundation for Your AI Applications
In the dynamic world of Artificial Intelligence (AI), where data integrity and model reliability are paramount, choosing the right tools is crucial. Pydantic, a Python library for data parsing and validation, emerges as a powerful ally in building robust and efficient AI systems. Its ability to define data models and enforce data validation rules significantly improves the development process and reduces the risk of errors caused by inconsistent or malformed data.
Data Validation: The Cornerstone of Reliable AI
Data validation is a critical step in any AI project. Inaccurate or incomplete data can lead to flawed models, erroneous predictions, and ultimately, unreliable AI systems. Pydantic excels in this area by allowing you to define strict data schemas. This ensures that all data processed by your AI application conforms to predefined rules. No more unexpected type errors or missing values crashing your model – Pydantic acts as a gatekeeper, ensuring only valid data proceeds.
Type checking: Pydantic automatically validates data types, ensuring that integers remain integers, strings stay strings, and so on.
Value constraints: Define constraints such as minimum/maximum values, allowed strings, regular expressions, etc., to enforce precise data integrity.
Custom validation: Implement custom validation logic to handle complex scenarios and business rules specific to your AI application.
Data Modeling: Structure and Organization for Your AI Projects
AI projects often involve numerous data structures and configurations. Pydantic provides a powerful and elegant way to model your data. By creating data models, you not only improve the organization of your code but also enable early detection of inconsistencies. This structured approach simplifies data processing and manipulation, making your AI application cleaner and easier to maintain.
Structured Data: Easily define classes representing the structure of your input and output data.
Complex Data Types: Handle nested structures, lists, and dictionaries seamlessly, enforcing validation at every level.
Improved Readability: Clearly defined data models make your code easier to understand and maintain for both you and your collaborators.
Configuration Management: Centralized and Validated Settings
Managing configurations, especially in complex AI systems, can quickly become challenging. Pydantic offers a solution for efficient configuration management. You can create Pydantic models for your application's settings, ensuring that all configurations conform to predefined types and constraints. This centralized approach simplifies the management and modification of settings, thereby improving the overall workflow of your AI project.
Environment Variables: Easily load configuration settings from environment variables with validation.
Configuration Files: Use configuration files (YAML, JSON, etc.) to store and load settings while enforcing type and constraint validation.
Version Control Integration: Easily track configuration changes in your version control system, ensuring reproducibility and traceability.
Conclusion
Incorporating Pydantic into your AI development pipeline offers numerous advantages, from robust data validation to streamlined configuration management. By leveraging Pydantic's data modeling capabilities and validation features, you can create more reliable, maintainable, and ultimately, successful AI applications. It's a simple yet powerful addition that significantly enhances the overall robustness and efficiency of your AI development efforts.
```

> we have set up two agents **search\_agent ,content\_writer\_agents** two tools **search\_agent and content\_writer\_agent**


> **search\_agent** : Research about the given topic and using **search\_web** tool to get the information and pass information(context) to **content\_writer\_agent** tool since we used **tool** attribute agent will maintain the context, **content\_writer\_agent** tool will run the **content\_writer\_agents** agent and **content\_writer\_agent** toolwill set the blog context generated by **content\_writer\_agents** agent


> **content\_writer\_agents***: The content it has which is out put from the* **search\_web** *tool, it will nicely articulate a blog.*

*With this you understand how* Pydantic AI *USING* Pydantic AI *FRAMEWORK you can create production ready AI Applications*

*Happy Learning !!!!!!!!!!*

*Please feel free to give suggestions or comments for better teaching..*

*if you like the blog please do clap* 👏👏👏

For a deep dive into the framework, check out the official [Pydantic AI documentation](https://ai.pydantic.dev/).


