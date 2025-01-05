---
title: "使用 PydanticAI 框架构建多代理 LLM 系统：创建人工智能系统的分步指南..."
meta_title: "使用 PydanticAI 框架构建多代理 LLM 系统：创建人工智能系统的分步指南..."
description: "Pydantic AI 是一个新的 Python 框架，旨在简化生成式 AI 驱动的生产级应用程序的构建。它结合了 Pydantic 的数据验证能力，使得用户能够定义数据模型并确保输入数据的有效性。Pydantic AI 支持多种 AI 模型，提供类型安全和依赖注入系统，增强了代理与 LLM 的交互。本文介绍了 Pydantic AI 的核心功能和使用示例，包括如何创建代理、使用工具、处理依赖关系和进行测试与评估，强调了其在开发可靠 AI 应用中的重要性。"
date: 2025-01-05T01:59:43Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*poYIHZMPGKdODDLO.png"
categories: ["Programming", "Generative AI", "Data Science"]
author: "Rifx.Online"
tags: ["Pydantic", "Generative", "Models", "Dependency", "Structured"]
draft: False

---





Pydantic 是 Python 生态系统中的一股强大力量，拥有超过 **2.85 亿次的月下载量**，一直是 Python 项目中稳健数据验证的基石。现在，它的创造者正在进军前沿的 AI 领域，推出 **Pydantic AI**，这是一个旨在构建由生成式 AI 驱动的生产级应用程序的框架。在本文中，我们将深入探讨 **Pydantic AI 的独特之处**、其关键特性，以及它与其他代理框架的比较。

## Pydantic 与 GenAI 中的 Pydantic 与 PydanticAI


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

> **GenAI 中的 Pydantic:**


```python
from datetime import date
from pydantic import BaseModel
from openai import OpenAI
class User(BaseModel):
    """用户定义"""
    id: int
    name: str
    dob: date
response = OpenAI().chat.completions.create(
    model='gpt-4o',
    messages=[
        {'role': 'system', 'content': '提取用户信息'},
        {'role': 'user', 'content': 'ID 为 123 的用户叫 Samuel，出生于 87 年 1 月 28 日'}
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

相同的例子结合 PydanticAI — 生产环境的 Agent 框架。


```python
from datetime import date
from pydantic_ai import Agent
from pydantic import BaseModel
class User(BaseModel):
    """用户定义"""
    id: int
    name: str
    dob: date
agent = Agent(
    'openai:gpt-4o',
    result_type=User,
    system_prompt='提取用户信息',
)
result = agent.run_sync('ID 为 123 的用户叫 Samuel，出生于 87 年 1 月 28 日')
print(result.data)
```

> **什么是 PydanticAI?**

PydanticAI 是一个 Python 代理框架，旨在简化使用生成式 AI 构建生产级应用程序的过程。


> **为什么选择 PydanticAI?**

假设您正在制作一个应用程序，用户提交他们的姓名、年龄和电子邮件。您希望确保：


> *姓名是字符串。*


> *年龄是数字。*


> *电子邮件格式有效。*

以下是 Pydantic 如何简化这一过程：


```python
from pydantic import BaseModel, EmailStr
## 定义模型
class User(BaseModel):
    name: str
    age: int
    email: EmailStr
## 示例输入
user_data = {
    "name": "Alice",
    "age": 25,
    "email": "alice@example.com"
}
## 验证输入
user = User(**user_data)
print(user.name)  # Alice
print(user.age)   # 25
print(user.email) # alice@example.com
```

## 如果数据错误怎么办？

如果用户提交无效数据（例如，`"age": "twenty-five"`），Pydantic 会自动抛出错误：

```python
user_data = {
    "name": "Alice",
    "age": "twenty-five",  # Invalid
    "email": "alice@example.com"
}
user = User(**user_data)
## Error: value is not a valid integer
```
Pydantic 在部署中发挥着关键作用，因为它通常是强制遵循的。

***由 Pydantic 团队构建***由 Pydantic 背后的团队构建（OpenAI SDK、Anthropic SDK、LangChain、LlamaIndex、AutoGPT、Transformers、CrewAI、Instructor 等的验证层）。

***模型无关***支持 OpenAI、Anthropic、Gemini、Ollama、Groq 和 Mistral，并且有一个简单的接口来实现对其他模型的支持。

***Pydantic Logfire 集成***无缝集成 Pydantic Logfire，用于实时调试、性能监控和 LLM 驱动应用程序的行为跟踪。

***类型安全***旨在使类型检查对您尽可能有用，因此它与静态类型检查器（如 [`m`ypy](https://github.com/python/mypy) 和 [`pyri`ght](https://github.com/microsoft/pyright)）良好集成。

***以 Python 为中心的设计***利用 Python 熟悉的控制流和代理组合来构建您的 AI 驱动项目，使您可以轻松应用在任何其他（非 AI）项目中使用的标准 Python 最佳实践。

***结构化响应***利用 Pydantic 的强大功能来验证和结构化模型输出，确保响应在多次运行中保持一致。

***依赖注入系统***提供可选的依赖注入系统，以向您的代理系统提示、工具和结果验证器提供数据和服务。这对于测试和评估驱动的迭代开发非常有用。

***流式响应***提供连续流式 LLM 输出的能力，进行即时验证，确保快速和准确的结果。

目标是解决代理框架领域中的一个主要问题：缺乏专门为生产用例设计的工具。

> **安装 PydanticAI**

需要 Python 3\.9\+

```python
pip install pydantic-ai
```
这将安装 `pydantic_ai` 包、核心依赖项和使用 PydanticAI 中所有模型所需的库。如果您想使用特定模型，可以安装 PydanticAI 的“精简”版本。

> ***PydanticAI 的 8 个重要组成部分***

* 代理
* 模型
* 依赖项
* 函数工具
* 结果
* 消息和聊天记录
* 测试和评估
* 调试和监控

## 代理

代理是 PydanticAI 与 LLM 交互的主要接口。

在某些使用案例中，单个代理将控制整个应用程序或组件，但多个代理也可以相互作用，以体现更复杂的工作流程。

> 代理类具有完整的 API 文档，但从概念上讲，您可以将代理视为以下内容的容器：

### 运行代理

有三种运行代理的方法：

1. `agent.run()` — 一个协程，返回一个包含完成响应的 `RunResult`
2. `agent.run_sync()` — 一个普通的同步函数，返回一个包含完成响应的 `RunResult`（内部，这只是调用 `loop.run_until_complete(self.run())`）
3. `agent.run_stream()` — 一个协程，返回一个 `StreamedRunResult`，其中包含将响应作为异步可迭代对象流式传输的方法

以下是一个简单的示例，演示所有三种方法：


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

## 模型

PydanticAI 是模型无关的，并内置支持以下模型提供者：

* OpenAI
* Anthropic
* Gemini 通过两种不同的 API：生成语言 API 和 VertexAI API
* Ollama
* Groq
* Mistral

您也可以添加对其他模型的支持。

PydanticAI 还附带 `TestModel` 和 `FunctionModel` 用于测试和开发。

要使用每个模型提供者，您需要配置本地环境并确保安装了正确的包。

要使用 `GeminiModel` 模型，您只需安装 `pydantic-ai` 或 `pydantic-ai-slim`，不需要额外的依赖项。

### 配置

`GeminiModel` 让您通过 Google 的生成语言 API `generativelanguage.googleapis.com` 使用 Gemini 模型。

`GeminiModelName` 包含可以通过此接口使用的可用 Gemini 模型列表。

要使用 `GeminiModel`，请访问 aistudio.google.com，并按照提示找到生成 API 密钥的地方。

### 环境变量

一旦你拥有了 API 密钥，你可以将其设置为环境变量：


```python
from pydantic_ai import Agent
from pydantic_ai.models.gemini import GeminiModel
model = GeminiModel('gemini-1.5-flash', api_key=os.environ['GEMINI_API_KEY'])
agent = Agent(model)
```

## 依赖关系

PydanticAI 使用依赖注入系统为您的代理系统提示、工具和结果验证器提供数据和服务。

与 PydanticAI 的设计哲学相匹配，我们的依赖系统尝试使用现有的 Python 开发最佳实践，而不是发明深奥的“魔法”，这应该使依赖关系类型安全、易于理解、易于测试，并最终更易于在生产环境中部署。

### 定义依赖关系

依赖关系可以是任何 Python 类型。在简单的情况下，您可能能够将单个对象作为依赖关系传递（例如，HTTP 连接），但是当您的依赖关系包含多个对象时，数据类通常是一个方便的容器。

以下是定义一个需要依赖关系的代理的示例。

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
MyDeps 是注入到 agent.run 方法中的依赖关系。

## 功能工具

功能工具为模型提供了一种机制，以检索额外信息来帮助生成响应。

当将代理所需的所有上下文放入系统提示中不切实际或不可能时，或者当您希望通过将生成响应所需的一些逻辑推迟到另一个（不一定是 AI 驱动的）工具来使代理的行为更加确定或可靠时，它们非常有用。

有多种方法可以将工具注册到代理：

* 通过 `@agent.tool` 装饰器 — 用于需要访问代理上下文的工具
* 通过 `@agent.tool_plain` 装饰器 — 用于不需要访问代理上下文的工具
* 通过 `Agent` 的 `tools` 关键字参数，可以接受普通函数或 `Tool` 的实例

`@agent.tool` 被认为是默认装饰器，因为在大多数情况下，工具将需要访问代理上下文。

以下是同时使用两者的示例：

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

## 结果

结果是从运行代理返回的最终值。结果值被包装在 `RunResult` 和 `StreamedRunResult` 中，因此您可以访问其他数据，如运行的使用情况和消息历史。

`RunResult` 和 `StreamedRunResult` 在它们包装的数据方面是通用的，因此关于代理返回的数据的类型信息得以保留。

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

## 消息和聊天记录

PydanticAI 提供了在代理运行期间交换的消息的访问。这些消息可以用于继续连贯的对话，也可以用于了解代理的表现。

### 访问结果中的消息

在运行代理后，您可以从 `result` 对象访问在该运行期间交换的消息。

`RunResult`（由 `Agent.run`、`Agent.run_sync` 返回）和 `StreamedRunResult`（由 `Agent.run_stream` 返回）都有以下方法：

* `all_messages()`: 返回所有消息，包括来自之前运行的消息。还有一个变体返回 JSON 字节，`all_messages_json()`。
* `new_messages()`: 仅返回当前运行的消息。还有一个变体返回 JSON 字节，`new_messages_json()`。

### 使用消息作为进一步代理运行的输入

在 PydanticAI 中，消息历史的主要用途是保持多个代理运行之间的上下文。

要在运行中使用现有消息，请将它们传递给 `Agent.run`、`Agent.run_sync` 或 `Agent.run_stream` 的 `message_history` 参数。

如果 `message_history` 被设置且不为空，则不会生成新的系统提示——我们假设现有的消息历史包括一个系统提示。


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

## 测试与评估

在 PydanticAI 和 LLM 集成中，主要有两种不同类型的测试：

1. **单元测试** — 对应用程序代码的测试，以及其是否正常运行
2. **评估** — 对 LLM 的测试，以及其响应的好坏

在大多数情况下，这两种测试的目标和考虑因素是相当独立的。

### 单元测试

PydanticAI 代码的单元测试与其他 Python 代码的单元测试相似。

因为大多数情况下它们并没有什么新意，我们已经建立了相当成熟的工具和模式来编写和运行这些测试。

除非你真的很确定你知道得更好，否则你可能会想大致遵循以下策略：

* 使用 `pytest` 作为测试工具
* 如果你发现自己在输入冗长的断言，可以使用 inline-snapshot
* 类似地，dirty-equals 可以用于比较大型数据结构
* 使用 `TestModel` 或 `FunctionModel` 代替实际模型，以避免真实 LLM 调用的使用、延迟和变异性
* 使用 `Agent.override` 在应用逻辑中替换你的模型
* 全局设置 `ALLOW_MODEL_REQUESTS=False` 以阻止意外向非测试模型发送请求

让我们为以下应用代码编写单元测试：


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
这里我们有一个函数，它接受一个 `(user_prompt, user_id)` 元组的列表，为每个提示获取天气预报，并将结果存储在数据库中。

我们希望在不模拟某些对象或修改代码以便传递测试对象的情况下测试这段代码。

以下是我们如何使用 `TestModel` 编写测试：


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

### 使用 FunctionModel 进行单元测试

上述测试是一个很好的开始，但细心的读者会注意到，`WeatherService.get_forecast` 从未被调用，因为 `TestModel` 使用过去的日期调用了 `weather_forecast`。

为了充分测试 `weather_forecast`，我们需要使用 `FunctionModel` 自定义工具的调用方式。

以下是使用 `FunctionModel` 测试 `weather_forecast` 工具的自定义输入示例：

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

“Evals” 指的是评估模型在特定应用中的性能。

Evals 通常更像基准测试而非单元测试，它们从不“通过”，尽管它们确实会“失败”；你主要关心的是它们随时间的变化。

由于 evals 需要在真实模型上运行，因此可能运行缓慢且成本高昂，通常不希望在每次提交时都在 CI 中运行它们。

### 性能测量

评估中最困难的部分是测量模型的表现如何。

在某些情况下（例如，生成 SQL 的代理），可以使用简单且易于运行的测试来测量性能（例如，SQL 是否有效？是否返回正确的结果？是否仅返回正确的结果？）。

在其他情况下（例如，提供戒烟建议的代理），进行量化的性能测量可能非常困难或不可能——在戒烟的情况下，您确实需要进行为期数月的双盲试验，然后等待 40 年并观察健康结果，以了解对提示的更改是否有所改善。

您可以使用几种不同的策略来测量性能：

* **端到端、自包含测试**——像 SQL 示例一样，我们可以几乎瞬间测试代理的最终结果
* **合成自包含测试**——编写单元测试风格的检查，以确保输出符合预期，比如检查 `'chewing gum' in response`，虽然这些检查看起来可能过于简单，但它们是有帮助的，一个好的特征是，当它们失败时，容易判断出问题所在
* **LLMs 评估 LLMs**——使用其他模型，甚至使用相同模型但不同提示来评估代理的性能（就像班级互相批改作业，因为老师宿醉），虽然这种方法的缺点和复杂性显而易见，但有些人认为在适当的情况下它可以成为一个有用的工具
* **生产中的评估**——测量代理在生产中的最终结果，然后创建一个量化的性能测量，以便在您更改提示或使用的模型时，能够轻松测量随时间的变化，logfire 在这种情况下可以非常有用，因为您可以编写自定义查询来测量代理的性能

### 系统提示自定义

系统提示是开发者控制代理行为的主要工具，因此能够自定义系统提示并观察性能变化通常是有用的。当系统提示包含一系列示例时，这一点尤其相关，因为您希望了解更改该列表如何影响模型的性能。

## 调试与监控

使用 LLM 的应用程序面临一些众所周知且易于理解的挑战：LLM **慢**、**不可靠** 和 **昂贵**。

这些应用程序还面临一些大多数开发人员较少遇到的挑战：LLM **变化无常** 和 **非确定性**。提示中的微小变化可以完全改变模型的性能，并且没有可以运行的 `EXPLAIN` 查询来理解原因。

为了构建成功的 LLM 应用程序，我们需要新的工具来理解模型性能以及依赖它们的应用程序的行为。

仅仅让您了解模型性能的 LLM 可观察性工具是无用的：调用 LLM 的 API 很简单，将其构建到应用程序中才是困难的。

### Pydantic Logfire

Pydantic Logfire 是一个由创建和维护 Pydantic 和 PydanticAI 的团队开发的可观察性平台。Logfire 的目标是让您了解整个应用程序：生成 AI、经典预测 AI、HTTP 流量、数据库查询以及现代应用程序所需的一切。

PydanticAI 内置（但可选）对 Logfire 的支持，通过 `logfire-api` 无操作包实现。

这意味着如果安装并配置了 `logfire` 包，关于代理运行的详细信息将被发送到 Logfire。但如果未安装 `logfire` 包，则几乎没有开销，并且不会发送任何信息。

以下是一个示例，展示了在 Logfire 中运行天气代理的详细信息：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*GlIOkbWSg-4sgR7Z.png)

## 示例 1：简单的 AI 代理

以下是如何设置一个基本的 AI 代理，使用 Pydantic 模型验证结构化数据。 \[1]

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*vPrYOb2xTDljoTEW.png)

图 1：显示用户、代理和模型之间的序列图。

让我们继续创建一些 Python 代码来开始。

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
看起来多简单？这里发生的事情是 `CityInfo` 模型定义了我们期望的响应结构。然后，代理被配置为验证 LLM 的输出是否符合该结构，确保结果可预测。快速而简单！

## 示例 2：为您的代理添加工具

PydanticAI 中的工具是您的代理在推理过程中可以调用的辅助函数。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*IDroaHTnQf8ZySU_.png)

图 2：展示用户、代理和工具使用的序列图。

让我们继续编写一些 Python 代码，展示如何使用工具。


```python
from pydantic_ai import Agent, RunContext
import random
## 定义代理
agent = Agent('openai:gpt-4o')
## 添加一个掷骰子的工具
@agent.tool
async def roll_die(ctx: RunContext, sides: int = 6) -> int:
    """掷一个指定面数的骰子。"""
    return random.randint(1, sides)
## 运行代理
if __name__ == '__main__':
    result = agent.run_sync("Roll a 20-sided die.")
    print(result.data)  # 输出一个 1 到 20 之间的随机数
```
工具为代理提供了可用的资源，使其更加高效。最终，它们通过扩展代理的功能来提供帮助。它们可以与 API、数据库交互，甚至执行计算。

*我对理论感到无聊 ufffff* 🙁*..是时候编码了* 😝😝😝😝*!!!!!!!!!!!!!!!!!!!!!!!!!!*

让我们继续在 Python 中编码，展示如何将一个单独的 API 连接到应用程序中。

用例：研究人员和作家

我们需要 Gemini API 密钥和 *Tavily API，*

*如果你想知道如何创建 Gemini API 密钥*，请访问 [aistudio.google.com](https://aistudio.google.com/) 并按照你的笔记找到生成 API 密钥的地方。

*TAVILY\_API\_KEY 如果你想为自己创建一个，请从这个链接获取 <https://app.tavily.com/>*

一旦你获得了这两个密钥，请在 .env 文件中设置如下


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
## 代理设置
search_agent = Agent(
    model= model ,
    result_type=Content,
    system_prompt=(
        """你是高级研究分析师，作为领先的科技智库工作。
  你的专业在于识别新兴趋势。
  你擅长解析复杂数据并提供可操作的见解。给定主题为 Pydantic AI。
  提供完整的分析报告，使用要点形式"""
    ),
    retries=2
)
content_writer_agents = Agent(
    model= model ,
    deps_type=Content,
    result_type=BlogPostBaseModel,
    system_prompt=(
        """你是一位著名的内容策略师，以你深入且引人入胜的文章而闻名。使用 search_web 获取要点列表。
  你将复杂概念转化为引人注目的叙述。生成至少 4 段的完整博客文章，包括段落、标题、要点，并包含 HTML 标签，请移除 '\\n\\n'。"""
    ),
    retries=2
)
## 针对您的查询进行网络搜索
@search_agent.tool
async def search_web(
    ctx: RunContext[Deps], web_query: str
) -> str:
    """针对您的查询进行网络搜索。"""
    tavily_client = TavilyClient(api_key=ctx.deps.tvly_api_key)
    response =  tavily_client.search(web_query)
    return json.dumps(response)
@search_agent.tool
async def content_writer_agent(
    ctx: RunContext[Deps], question: str
) -> str:
    """使用此工具与内容策略师进行沟通"""
    print(question)
    response = await ctx.deps.content_strategist_agent.run(user_prompt=question)
    ctx.deps.content = response.data
    print("内容策略师") 
    return response.data
async def main():
    async with AsyncClient() as client:
        message_history =[]
        tvly_api_key = os.environ['TVLY_API_KEY']
        deps = Deps(client=client, tvly_api_key=tvly_api_key,content_strategist_agent=content_writer_agents,content="")
        result = await search_agent.run("blog article for Pydantic AI",message_history=message_history, deps=deps)
        message_history = result.all_messages()
        print("博客：")
        print(deps.content)
if __name__ == '__main__':
    asyncio.run(main()
```

> 输出是一篇关于 Pydantic AI 的精彩博客….


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

> 我们设置了两个代理 **search\_agent ,content\_writer\_agents** 和两个工具 **search\_agent 和 content\_writer\_agent**


> **search\_agent** : 针对给定主题进行研究，并使用 **search\_web** 工具获取信息，并将信息（上下文）传递给 **content\_writer\_agent** 工具。由于我们使用了 **tool** 属性，代理将保持上下文，**content\_writer\_agent** 工具将运行 **content\_writer\_agents** 代理，**content\_writer\_agent** 工具将设置由 **content\_writer\_agents** 代理生成的博客上下文。


> **content\_writer\_agents***: 它所包含的内容是来自* **search\_web** *工具的输出，它将优雅地撰写一篇博客。*

*通过这个，你可以理解如何* Pydantic AI *使用* Pydantic AI *框架创建生产就绪的 AI 应用程序*

*快乐学习 !!!!!!!!!!*

*请随时提出建议或评论，以便更好地教学..*

*如果你喜欢这篇博客，请给我点赞* 👏👏👏

要深入了解该框架，请查看官方 [Pydantic AI 文档](https://ai.pydantic.dev/)。

