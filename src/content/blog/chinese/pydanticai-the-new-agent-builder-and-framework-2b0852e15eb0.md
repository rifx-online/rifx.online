---
title: "揭秘PydanticAI：打造高效AI代理的终极利器！"
meta_title: "揭秘PydanticAI：打造高效AI代理的终极利器！"
description: "PydanticAI 是一个基于 Python 的代理框架，旨在简化生成式 AI 应用的开发。它由 Pydantic 团队构建，支持多种 AI 模型，集成了实时调试和性能监控，强调类型安全与结构化响应。框架设计遵循 Python 的最佳实践，提供依赖注入和流式响应功能，适合构建生产级应用。通过示例代码展示了如何创建和使用代理，突显了其在类型验证、错误处理和动态提示方面的优势。"
date: 2025-01-05T02:17:58Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*jhyxzVYzpUEbFsL_yDyzpQ.jpeg"
categories: ["Programming", "Generative AI", "Technology/Web"]
author: "Rifx.Online"
tags: ["Pydantic", "Generative", "OpenAI", "Anthropic", "DependencyInjection"]
draft: False

---



PydanticAI 是一个 Python 代理框架，旨在减少使用生成式 AI 构建生产级应用程序的痛苦。

FastAPI 通过提供创新且人性化的设计，彻底改变了 web 开发，其基础是 [Pydantic](https://docs.pydantic.dev/)。

同样，几乎所有的代理框架和 Python 中的 LLM 库都使用 Pydantic，然而当我们开始在 [Pydantic Logfire](https://pydantic.dev/logfire) 中使用 LLM 时，我们找不到任何能给我们带来相同感觉的东西。

PydanticAI 的构建目标很简单：将 FastAPI 的感觉带入 GenAI 应用开发中。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ENnXK7qCLEHYfjO0M4-nmg.png)

## 为什么使用 PydanticAI

**由 Pydantic 团队构建**由 [Pydantic](https://docs.pydantic.dev/latest/) 背后的团队构建（OpenAI SDK、Anthropic SDK、LangChain、LlamaIndex、AutoGPT、Transformers、CrewAI、Instructor 等的验证层）。

**模型无关**支持 OpenAI、Anthropic、Gemini、Ollama、Groq 和 Mistral，并提供简单的接口以实现对 [其他模型](https://ai.pydantic.dev/models/) 的支持。

**Pydantic Logfire 集成**与 [Pydantic Logfire](https://pydantic.dev/logfire) 无缝 [集成](https://ai.pydantic.dev/logfire/)，用于实时调试、性能监控和 LLM 驱动应用程序的行为跟踪。

**类型安全**旨在使类型检查对您尽可能有用，因此与静态类型检查器（如 [`m`ypy](https://github.com/python/mypy) 和 [`pyri`ght](https://github.com/microsoft/pyright)）良好 [集成](https://ai.pydantic.dev/agents/#static-type-checking)。

**以 Python 为中心的设计**利用 Python 熟悉的控制流和代理组合来构建您的 AI 驱动项目，使您能够轻松应用在任何其他（非 AI）项目中使用的标准 Python 最佳实践。

**结构化响应**利用 [Pydantic](https://docs.pydantic.dev/latest/) 的强大功能来 [验证和结构化](https://ai.pydantic.dev/results/#structured-result-validation) 模型输出，确保响应在多次运行中保持一致。

**依赖注入系统**提供可选的 [依赖注入](https://ai.pydantic.dev/dependencies/) 系统，以向您的代理的 [系统提示](https://ai.pydantic.dev/agents/#system-prompts)、[工具](https://ai.pydantic.dev/tools/) 和 [结果验证器](https://ai.pydantic.dev/results/#result-validators-functions) 提供数据和服务。这对于测试和以评估为驱动的迭代开发非常有用。

**流式响应**提供 [流式](https://ai.pydantic.dev/results/#streamed-results) LLM 输出的能力，确保快速和准确的结果，具有即时验证。

## 模型

PydanticAI 是模型无关的，并内置支持以下模型提供商：

* [OpenAI](https://ai.pydantic.dev/models/#openai)
* [Anthropic](https://ai.pydantic.dev/models/#anthropic)
* 通过两种不同的 API 提供 Gemini： [Generative Language API](https://ai.pydantic.dev/models/#gemini) 和 [VertexAI API](https://ai.pydantic.dev/models/#gemini-via-vertexai)
* [Ollama](https://ai.pydantic.dev/models/#ollama)
* [Groq](https://ai.pydantic.dev/models/#groq)
* [Mistral](https://ai.pydantic.dev/models/#mistral)

您还可以 [添加对其他模型的支持](https://ai.pydantic.dev/models/#implementing-custom-models)。

PydanticAI 还附带 [`TestMo`del](https://ai.pydantic.dev/api/models/test/) 和 [`FunctionMo`del](https://ai.pydantic.dev/api/models/function/) 用于测试和开发。

要使用每个模型提供商，您需要配置本地环境，并确保已安装正确的包。

## 一些代码示例：

让我来解释这段代码，它演示了 PydanticAI 的基本用法，这是一个用于构建 LLM 驱动应用程序的框架：

## 示例 — 1：

1. **导入和设置**：

```python
## --------------------------------------------------------------
## 1. PydanticAI 和简单代理的最小示例
## --------------------------------------------------------------
from pydantic import BaseModel, Field
from pydantic_ai import Agent, ModelRetry, RunContext, Tool
from pydantic_ai.models.openai import OpenAIModel
```

* 导入 Pydantic 和 PydanticAI 的必要组件
* `nest_asyncio.apply()` 在 Jupyter 笔记本中启用异步操作
* `load_dotenv()` 加载环境变量（可能包含 API 密钥）

2\. **模型初始化**：

```python
model = OpenAIModel("gpt-4o-mini")
```

创建 OpenAI 模型接口的实例

**3\.** **基本代理创建**：

```python
agent = Agent(  
    model,
    system_prompt='Be concise, reply with one sentence.',  
)
```

创建一个简单的代理，具有：

* 指定的 OpenAI 模型
* 指示代理简洁回复的系统提示

**4\. 代理执行**：

```python
result = agent.run_sync('Where does "hello world" come from?')
print(result.data)
```

* 使用问题同步运行代理
* 打印响应

**输出：**

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*waXHIAhOhpsjKCUGMkPUrw.png)

主要特点：

1. **类型安全**：使用 Pydantic 进行类型验证和安全性
2. **结构化响应**：通过 Pydantic 模型实现结构化输出
3. **生产就绪**：设计用于生产使用，具备适当的错误处理
4. **异步支持**：支持同步和异步操作

这是一个最小示例，演示了 PydanticAI 的基本设置和用法，展示了如何创建一个可以处理查询并返回结构化响应的简单代理。该框架对于构建具有类型安全性和结构化数据处理的强大 AI 应用程序特别有用。

## 示例 — 2:

```python
## --------------------------------------------------------------
## 2. 简单代理 - Hello World 示例
## --------------------------------------------------------------
"""
此示例演示了 PydanticAI 代理的基本用法。
关键概念：
- 创建一个带有系统提示的基本代理
- 运行同步查询
- 访问响应数据、消息历史和费用
"""

agent1 = Agent(
    model=model,
    system_prompt="您是一个乐于助人的客户支持代理。请简明扼要且友好。",
)

## 基本代理的示例用法
response = agent1.run_sync("我如何追踪我的订单 #12345？")
print(response.data)
```

**输出：**

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*vSyZRamWeIoARUKhtMo7kg.png)

## 示例 — 3:

```python
## --------------------------------------------------------------
## 3. 具有结构化响应的代理
## --------------------------------------------------------------
"""
本示例展示如何从代理获取结构化的类型安全响应。
关键概念：
- 使用 Pydantic 模型定义响应结构
- 类型验证和安全性
- 字段描述以便更好地理解模型
"""


class ResponseModel(BaseModel):
    """带有元数据的结构化响应。"""

    response: str
    needs_escalation: bool
    follow_up_required: bool
    sentiment: str = Field(description="客户情感分析")


agent2 = Agent(
    model=model,
    result_type=ResponseModel,
    system_prompt=(
        "你是一个智能客户支持代理。"
        "仔细分析查询并提供结构化响应。"
    ),
)

response = agent2.run_sync("我如何跟踪我的订单 #12345？")
print(response.data.model_dump_json(indent=2))
```

1. **Pydantic 模型定义**:

使用 Pydantic 的 `BaseModel` 创建结构化响应模型

定义四个具有特定类型的字段：

* `response`: 包含答案的字符串
* `needs_escalation`: 用于升级的布尔标志
* `follow_up_required`: 用于跟进的布尔标志
* `sentiment`: 用于情感分析的字符串

2\. **高级代理创建**:

在这里我们创建了 ‘agent2’

3\. **响应处理**:

在这里我们创建了 ‘response’。

* 执行查询并将响应格式化为 JSON
* 输出将结构化为：

```python
{
  "response": "你可以通过...跟踪你的订单 #12345。",
  "needs_escalation": false,
  "follow_up_required": true,
  "sentiment": "中性"
}
```

**4\. 输出:**

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*1U93nin8dm-Y1TKrTMUAJw.png)

## 示例 — 4:

```python
## --------------------------------------------------------------
## 4. 具有结构化响应和依赖关系的代理
## --------------------------------------------------------------
"""
此示例演示如何在代理中使用依赖关系和上下文。
关键概念：
- 使用 Pydantic 定义复杂数据模型
- 注入运行时依赖关系
- 使用动态系统提示
"""


## 定义订单模式
class Order(BaseModel):
    """订单详细信息的结构。"""

    order_id: str
    status: str
    items: List[str]


## 定义客户模式
class CustomerDetails(BaseModel):
    """传入客户查询的结构。"""

    customer_id: str
    name: str
    email: str
    orders: Optional[List[Order]] = None

class ResponseModel(BaseModel):
    """带有元数据的结构化响应。"""

    response: str
    needs_escalation: bool
    follow_up_required: bool
    sentiment: str = Field(description="客户情感分析")


## 具有结构化输出和依赖关系的代理
agent5 = Agent(
    model=model,
    result_type=ResponseModel,
    deps_type=CustomerDetails,
    retries=3,
    system_prompt=(
        "您是一个智能客户支持代理。"
        "仔细分析查询并提供结构化响应。"
        "始终向客户问好并提供有帮助的响应。"
    ),  # 这些在编写代码时已知
)


## 根据依赖关系添加动态系统提示
@agent5.system_prompt
async def add_customer_name(ctx: RunContext[CustomerDetails]) -> str:
    return f"客户详细信息：{to_markdown(ctx.deps)}"  # 这些在运行时依赖于某种方式的上下文


customer = CustomerDetails(
    customer_id="1",
    name="John Doe",
    email="john.doe@example.com",
    orders=[
        Order(order_id="12345", status="shipped", items=["蓝色牛仔裤", "T恤"]),
    ],
)

response = agent5.run_sync(user_prompt="我订购了什么？", deps=customer)

response.all_messages()
print(response.data.model_dump_json(indent=2))

print(
    "客户详细信息：\n"
    f"姓名：{customer.name}\n"
    f"邮箱：{customer.email}\n\n"
    "响应详细信息：\n"
    f"{response.data.response}\n\n"
    "状态：\n"
    f"需要跟进：{response.data.follow_up_required}\n"
    f"需要升级：{response.data.needs_escalation}"
)
```

1. **数据模型定义**：

* 定义三个 Pydantic 模型以处理结构化数据
* 创建模型层次结构（CustomerDetails 包含 Orders） — 类对象（Order，CustomerDetails，ResponseModel）

**2\.** **高级代理配置**：

* 指定响应类型和依赖类型
* 包含重试逻辑（3 次尝试）
* 设置基本系统提示

**3\.** **动态系统提示**：

* 为系统提示添加运行时上下文
* 使用装饰器模式进行动态提示
* 将客户详细信息转换为 markdown 格式

**4\.** **响应处理**：

* 打印格式化的 JSON 响应
* 显示客户详细信息和响应状态

**5\. 输出：**

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*i-lctSs2BSXWjgi6MJbB_A.png)

**主要特点：**

1. **依赖注入**：通过 deps 提供运行时上下文
2. **复杂数据建模**：具有关系的嵌套模型
3. **动态提示**：上下文感知的系统提示
4. **类型安全**：全面的类型检查
5. **错误处理**：可靠性的重试机制

## 示例 — 5:

```python
## --------------------------------------------------------------
## 5. 带工具的代理
## --------------------------------------------------------------

"""
本示例展示了如何通过自定义工具增强代理。
关键概念：
- 创建和注册工具
- 在工具中访问上下文
"""

shipping_info_db: Dict[str, str] = {
    "12345": "已于 2024-12-01 发货",
    "67890": "正在派送中",
}

## 定义订单架构
class Order(BaseModel):
    """订单详情的结构。"""

    order_id: str
    status: str
    items: List[str]


## 定义客户架构
class CustomerDetails(BaseModel):
    """接收客户查询的结构。"""

    customer_id: str
    name: str
    email: str
    orders: Optional[List[Order]] = None

class ResponseModel(BaseModel):
    """带有元数据的结构化响应。"""

    response: str
    needs_escalation: bool
    follow_up_required: bool
    sentiment: str = Field(description="客户情感分析")


customer = CustomerDetails(
    customer_id="1",
    name="John Doe",
    email="john.doe@example.com",
    orders=[
        Order(order_id="12345", status="shipped", items=["蓝色牛仔裤", "T恤"]),
    ],
)


def get_shipping_info(ctx: RunContext[CustomerDetails]) -> str:
    """获取客户的运输信息。"""
    return shipping_info_db[ctx.deps.orders[0].order_id]




## 带有结构化输出和依赖项的代理
agent5 = Agent(
    model=model,
    result_type=ResponseModel,
    deps_type=CustomerDetails,
    retries=3,
    system_prompt=(
        "你是一个智能客户支持代理。"
        "仔细分析查询并提供结构化响应。"
        "使用工具查找相关信息。"
        "始终向客户问好并提供有帮助的响应。"
    ),  # 这些在编写代码时是已知的
    tools=[Tool(get_shipping_info, takes_ctx=True)],  # 通过 kwarg 添加工具
)


@agent5.system_prompt
async def add_customer_name(ctx: RunContext[CustomerDetails]) -> str:
    return f"客户详情: {to_markdown(ctx.deps)}"


response = agent5.run_sync(
    user_prompt="我最后一个订单的状态是什么？", deps=customer
)

response.all_messages()
print(response.data.model_dump_json(indent=2))

print(
    "客户详情:\n"
    f"姓名: {customer.name}\n"
    f"电子邮件: {customer.email}\n\n"
    "响应详情:\n"
    f"{response.data.response}\n\n"
    "状态:\n"
    f"是否需要跟进: {response.data.follow_up_required}\n"
    f"是否需要升级: {response.data.needs_escalation}"
)
```

1. **数据库模拟**:

* 模拟一个简单的运输信息数据库

**2\.** **数据模型**（与之前的示例相同）：

3\. **自定义工具定义**:（此处 — get\_shipping\_info）

* 创建一个查找运输信息的工具
* 采用上下文参数以访问客户详情
* 返回运输状态字符串

4\. **增强的代理配置**：

* 通过 `tools` 参数添加工具
* 指定该工具需要上下文（`takes_ctx=True`）

5\. **动态系统提示**：

**add\_customer\_name** 方法负责接受动态系统提示。

**6\. 输出:**

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*FKV5CpZvLXXGILiDplY5YA.png)

## 示例 — 6:

```python
## --------------------------------------------------------------
## 6. 带反思和自我纠正的代理
## --------------------------------------------------------------

"""
本示例演示了具有自我纠正功能的高级代理能力。
关键概念：
- 实现自我反思
- 优雅地处理错误并重试
- 使用 ModelRetry 进行自动重试
- 基于装饰器的工具注册
"""

## 模拟的运输信息数据库
shipping_info_db: Dict[str, str] = {
    "#12345": "在 2024-12-01 发货",
    "#67890": "正在派送中",
}

## 定义订单模式
class Order(BaseModel):
    """订单详细信息的结构。"""

    order_id: str
    status: str
    items: List[str]

class ResponseModel(BaseModel):
    """带有元数据的结构化响应。"""

    response: str
    needs_escalation: bool
    follow_up_required: bool
    sentiment: str = Field(description="客户情感分析")

## 定义客户模式
class CustomerDetails(BaseModel):
    """传入客户查询的结构。"""

    customer_id: str
    name: str
    email: str
    orders: Optional[List[Order]] = None


customer = CustomerDetails(
    customer_id="1",
    name="John Doe",
    email="john.doe@example.com",
    orders=[
        Order(order_id="12345", status="shipped", items=["蓝色牛仔裤", "T恤"]),
    ],
)

## 带反思和自我纠正的代理
agent5 = Agent(
    model=model,
    result_type=ResponseModel,
    deps_type=CustomerDetails,
    retries=3,
    system_prompt=(
        "你是一个智能客户支持代理。"
        "仔细分析查询并提供结构化响应。"
        "使用工具查找相关信息。"
        "始终向客户问好并提供有帮助的响应。"
    ),
)


@agent5.tool_plain()  # 通过装饰器添加简单工具
def get_shipping_status(order_id: str) -> str:
    """获取给定订单 ID 的运输状态。"""
    shipping_status = shipping_info_db.get(order_id)
    if shipping_status is None:
        raise ModelRetry(
            f"未找到订单 ID {order_id} 的运输信息。"
            "确保订单 ID 以 # 开头：例如，#624743 "
            "如有必要，请自我纠正并重试。"
        )
    return shipping_info_db[order_id]


## 示例用法
response = agent5.run_sync(
    user_prompt="我最后一笔订单 12345 的状态是什么？", deps=customer
)

response.all_messages()
print(response.data.model_dump_json(indent=2))
```

**关键特性：**

1. **自我纠正机制**：

* 使用 `ModelRetry` 进行自动重试
* 提供有帮助的错误信息以便自我纠正
* 验证订单 ID 格式

**2. 基于装饰器的工具**：

* 使用 `@agent5.tool_plain()` 装饰器
* 简化工具注册
* 提供简洁的工具定义语法

**3. 错误处理**：

* 优雅地处理缺失数据
* 自动重试机制
* 提供信息丰富的错误信息

**4. 输入验证**：

* 检查订单 ID 格式是否正确
* 提供纠正指导
* 维护数据完整性

**5. 输出：**

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*mTvXw44ovPmen4izQSXxCg.png)

在这里，我们探索了使用 PydanticAI 框架的不同类型的代理用法。完整的感谢归于 ([daveebbelaar](https://github.com/daveebbelaar/pydantic-ai-tutorial/blob/main/src/introduction.py))。无论如何，这确实展示了很大的潜力，作为一个新的框架，你可以利用非常简单的抽象来选择不同的 LLM，拥有系统提示，动态更改系统提示。能够注入不同的内容，并能够设置历史记录，以便你可以轻松地进行一些记忆和操作。这是以非常 Pythonic 的方式完成的。在许多方面，比一些东西如 Langchain、LangGraph、LlamaIndex 等更容易理解。我们可以尝试一下这如何与 RAG 系统良好结合。可能我稍后会对此进行探索，同时也想比较不同框架及其差异。敬请期待！！！

## 参考文献：

1. [https://ai.pydantic.dev/](https://ai.pydantic.dev/)
2. [https://github.com/daveebbelaar/pydantic\-ai\-tutorial/blob/main/src/introduction.py](https://github.com/daveebbelaar/pydantic-ai-tutorial/blob/main/src/introduction.py)


