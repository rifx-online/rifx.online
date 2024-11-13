---
title: "使用 Llama3.1 创建客户支持助理"
meta_title: "使用 Llama3.1 创建客户支持助理"
description: "使用 LLM 代理和 Amazon Bedrock 以人工智能解决客户问题：使用 Llama3.1 构建和部署支持助理指南"
date: 2024-11-13T01:22:29Z
image: "https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*lNyf72c2_r1wKjnoRA1_FQ.png"
categories: ["Programming", "Chatbots", "Technology/Web"]
author: "Rifx.Online"
tags: ["Llama3.1", "AmazonBedrock", "Gradio", "EC2", "CustomerSupport"]
draft: False

---



### 使用 LLM 代理和 Amazon Bedrock 解决客户查询的 AI：构建和部署支持助手的指南，使用 Llama3\.1



## 介绍

### 问题

企业经常面临处理大量客户询问的挑战。这些询问可能从简单的问题“我的订单状态是什么？”到需要人工干预的更复杂的问题不等。重复询问的庞大数量可能会使客户支持团队不堪重负，导致响应时间延长和客户满意度降低。此外，利用人力资源处理简单的例行询问效率低下且成本高昂。迫切需要能够有效处理例行询问的自动化解决方案，以便人类代理可以专注于需要细致问题解决的升级案例。

### 解决方案

大型语言模型（LLM）代理的引入为这个问题提供了一个有前景的解决方案。一个 [LLM 代理](https://proxy.rifx.online/https://research.ibm.com/blog/what-are-ai-agents-llm) 可以通过访问和解释公司数据库中的数据来响应用户查询，处理一些简单的操作，例如检查订单状态、检索账户信息和回答常见问题。通过自动化这些日常任务，LLM 代理确保了更快的解决时间，并释放人力资源以应对更复杂的客户支持场景。在本指南中，我们将探讨如何使用来自 Amazon Bedrock Tools api 的 Llama3\.1 模型构建一个客户支持助手。

最后，我们将在本地机器上运行助手，并调用一个假数据库：

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Ok9N3mdX50JVWbaJKUrJeQ.gif)

## LLM 代理

### 什么是 LLM 代理

[LLM 代理](https://proxy.rifx.online/https://research.ibm.com/blog/what-are-ai-agents-llm) 是基于大型语言模型如 Llama3.1 构建的专用应用程序，旨在执行特定任务或功能。与根据给定提示生成类人文本的通用 LLM 不同，LLM 代理具备额外的能力，如访问外部数据库、执行操作和根据预定义规则做出决策。它们被定制用于处理特定用例，例如客户支持，在这些场景中，它们可以与用户互动、检索信息并根据对话的上下文执行命令。

虽然通用 LLM 在生成连贯文本和理解语言方面非常强大，但 LLM 代理通过与外部系统集成，进一步拓展了其能力，使其能够执行超出文本生成的现实世界任务。

代理具有一套指令、基础模型、一组可用操作和知识库，使其能够执行复杂任务。

生成模型可以回答一般性问题或与您的文档相关的问题，例如“我看不到我的会议？我该如何预定会议？”。而代理则使用基础模型作为推理逻辑，并结合外部数据源如您的 API，能够返回用户已预定会议的数量，或直接从交互界面安排会议。

“通用目的”类别中有许多代理，还有一些专门用于特定任务的代理，如代码助手（[Amazon CodeWhisperer, Copilot](https://proxy.rifx.online/https://www.missioncloud.com/blog/github-copilot-vs-amazon-codewhisperer)）、写作助手、系统设计（[Amazon Q](https://proxy.rifx.online/https://aws.amazon.com/q/)）、维基百科摘要等。

**AI 代理生态系统：**

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*VuAyzZ2BfrD7o-z0lOpUwA.png)

### 使用 Python 从头创建一个基本代理

让我们使用 Python 从头创建一个简单的 LLM 代理。本文展示了如何在不依赖任何库或框架的情况下构建代理。

## 自定义支持助手

现在，让我们使用来自 [Bedrock](https://proxy.rifx.online/https://aws.amazon.com/bedrock/) 的 [Llama3\.1](https://proxy.rifx.online/https://llama.meta.com/) 模型创建一个更复杂的客户支持助手。该代理将能够执行更复杂的任务，例如从数据库中查找用户数据和执行简单操作，如查看订单的运输状态。

### 定义能力和边界

在构建我们的助手之前，定义代理可以执行的操作并建立其操作的明确边界至关重要。在生产环境中，这些能力和边界对于确保代理有效且安全地运行至关重要。

**能力：**

* 回复常见客户查询（例如，订单状态、退货政策）。
* 从数据库中访问和检索用户数据。
* 执行简单操作，如查看订单状态、更新客户信息等。

**边界：**

* 代理不应执行需要人类判断的操作，例如处理退款或处理升级。
* 应在定义的范围内操作，除非明确允许，否则不应访问敏感数据。
* 应为不支持的查询设置错误处理和回退机制。

### 架构

我们解决方案的系统架构涉及多个组件协同工作：

1. **LLM Agent**: 系统的核心，使用 [Llama3\.1](https://proxy.rifx.online/https://llama.meta.com/) 或 [Claude 3\.5 Sonnet](https://proxy.rifx.online/https://www.anthropic.com/news/claude-3-5-sonnet) 模型构建，处理自然语言处理和决策制定。
2. **数据库**: 存储客户数据和其他相关信息，供代理查询。
3. **API层**: 促进LLM代理与数据库之间的通信，使代理能够检索和操作数据。
4. **用户界面**: 一个前端界面（例如，聊天机器人界面），客户在此与支持助手互动。

### 代码

在我们检查代码之前，请确保您具备以下条件：

1. 了解 Python 和 [boto3](https://proxy.rifx.online/https://boto3.amazonaws.com/v1/documentation/api/latest/index.html) 库。
2. 拥有一个启用了模型访问的有效 AWS 账户，在 [Bedrock](https://proxy.rifx.online/https://aws.amazon.com/bedrock/) 中。
3. 安装了 Python 和 boto3 的 [虚拟环境](https://proxy.rifx.online/https://docs.anaconda.com/miniconda/)。

### 代码演示


```python
from datetime import datetime
import json
from typing import Any, Dict, List

import boto3
from botocore.exceptions import ClientError

## Initialize a Boto3 session and create a Bedrock runtime client
session = boto3.Session()
region = "us-east-1" # us-west-2 has better runtime quota
bedrock_client = session.client(service_name = 'bedrock-runtime', region_name = region)
```
首先，我们导入必要的包，并为 `us-east-1` 区域创建一个名为 `bedrock_client` 的 `boto3` Bedrock 运行时客户端实例。如果您的 AWS 账户启用了 `us-west-2` 可用区 (AZ)，请改用该区域。撰写本文时，Llama3\.1 模型仅在 `us-west-2` AZ 可用，并且与仅支持每分钟 50 次请求的 `us-east-1` AZ 相比，`claude-3.5-sonnet` 模型的运行时配额更大（每分钟 250 次请求）。


```python
## Define available models with their respective request limits
available_models = {
    "sonnet3-5": "anthropic.claude-3-5-sonnet-20240620-v1:0", # 50 requests per min
    "sonnet": "anthropic.claude-3-sonnet-20240229-v1:0", # 500 requests per min
    "llama31-70b": "meta.llama3-1-70b-instruct-v1:0", # 400 requests per min
    "llama31-405b": "meta.llama3-1-405b-instruct-v1:0", # 50 requests per min
}
modelId = available_models["sonnet3-5"]  # Select model for conversation
```
接下来，我们创建 Bedrock 中模型 ID 的映射。**目前并非所有可用于 Amazon Bedrock 的模型都支持工具使用**。请查看 Amazon Bedrock 用户指南中的 [支持的模型列表](https://proxy.rifx.online/https://docs.aws.amazon.com/bedrock/latest/userguide/conversation-inference.html#conversation-inference-supported-models-features) [这里](https://proxy.rifx.online/https://docs.aws.amazon.com/bedrock/latest/userguide/conversation-inference.html#conversation-inference-supported-models-features)。


```python
class FakeDatabase:
    """Sample fake database implementation."""
    def __init__(self):
        self.customers = [
            {"id": "1213210", "name": "John Doe", "email": "john@gmail.com", "phone": "123-456-7890", "username": "johndoe"},
            {"id": "2837622", "name": "Priya Patel", "email": "priya@candy.com", "phone": "987-654-3210", "username": "priya123"},
            {"id": "3924156", "name": "Liam Nguyen", "email": "lnguyen@yahoo.com", "phone": "555-123-4567", "username": "liamn"},
            {"id": "4782901", "name": "Aaliyah Davis", "email": "aaliyahd@hotmail.com", "phone": "111-222-3333", "username": "adavis"},
            {"id": "5190753", "name": "Hiroshi Nakamura", "email": "hiroshi@gmail.com", "phone": "444-555-6666", "username": "hiroshin"},
            {"id": "6824095", "name": "Fatima Ahmed", "email": "fatimaa@outlook.com", "phone": "777-888-9999", "username": "fatimaahmed"},
            {"id": "7135680", "name": "Alejandro Rodriguez", "email": "arodriguez@protonmail.com", "phone": "222-333-4444", "username": "alexr"},
            {"id": "8259147", "name": "Megan Anderson", "email": "megana@gmail.com", "phone": "666-777-8888", "username": "manderson"},
            {"id": "9603481", "name": "Kwame Osei", "email": "kwameo@yahoo.com", "phone": "999-000-1111", "username": "kwameo"},
            {"id": "1057426", "name": "Mei Lin", "email": "meilin@gmail.com", "phone": "333-444-5555", "username": "mlin"}
        ]

        self.orders = [
            {"id": "24601", "customer_id": "1213210", "product": "Wireless Headphones", "quantity": 1, "price": 79.99, "status": "Shipped"},
            {"id": "13579", "customer_id": "1213210", "product": "Smartphone Case", "quantity": 2, "price": 19.99, "status": "Processing"},
            {"id": "97531", "customer_id": "2837622", "product": "Bluetooth Speaker", "quantity": 1, "price": "49.99", "status": "Shipped"}, 
            {"id": "86420", "customer_id": "3924156", "product": "Fitness Tracker", "quantity": 1, "price": 129.99, "status": "Delivered"},
            {"id": "54321", "customer_id": "4782901", "product": "Laptop Sleeve", "quantity": 3, "price": 24.99, "status": "Shipped"},
            {"id": "19283", "customer_id": "5190753", "product": "Wireless Mouse", "quantity": 1, "price": 34.99, "status": "Processing"},
            {"id": "74651", "customer_id": "6824095", "product": "Gaming Keyboard", "quantity": 1, "price": 89.99, "status": "Delivered"},
            {"id": "30298", "customer_id": "7135680", "product": "Portable Charger", "quantity": 2, "price": 29.99, "status": "Shipped"},
            {"id": "47652", "customer_id": "8259147", "product": "Smartwatch", "quantity": 1, "price": 199.99, "status": "Processing"},
            {"id": "61984", "customer_id": "9603481", "product": "Noise-Cancelling Headphones", "quantity": 1, "price": 149.99, "status": "Shipped"},
            {"id": "58243", "customer_id": "1057426", "product": "Wireless Earbuds", "quantity": 2, "price": 99.99, "status": "Delivered"},
            {"id": "90357", "customer_id": "1213210", "product": "Smartphone Case", "quantity": 1, "price": 19.99, "status": "Shipped"},
            {"id": "28164", "customer_id": "2837622", "product": "Wireless Headphones", "quantity": 2, "price": 79.99, "status": "Processing"}
        ]

    def get_user(self, key:str, value:str) -> Dict[str, str]:
        """Return metadata of user."""
        if key in {"email", "phone", "username"}:
            for customer in self.customers:
                if customer[key] == value:
                    return customer
            return f"Couldn't find a user with {key} of {value}"
        else:
            raise ValueError(f"Invalid key: {key}")
        
        return None

    def get_order_by_id(self, order_id: str) -> Dict[str, str]:
        """Return metadata of the order using order id."""
        for order in self.orders:
            if order["id"] == order_id:
                return order
        return None
    
    def get_customer_orders(self, customer_id: str) -> List[Dict[str, str]]:
        """Return a list of orders for a specific customer."""
        return [order for order in self.orders if order["customer_id"] == customer_id]

    def cancel_order(self, order_id: str) -> str:
        """Cancel an order if it's in 'Processing' status."""
        order = self.get_order_by_id(order_id)
        if order:
            if order["status"] == "Processing":
                order["status"] = "Cancelled"
                return "Cancelled the order"
            else:
                return "Order has already shipped.  Can't cancel it."
        return "Can't find that order!"
```
在本演示中，我们实现了一个模拟数据库类，其中包含预定义的客户及其订单列表。这个模拟数据库类还包括从数据库中检索数据的方法。

* `get_user` : 返回用户
* `get_order_by_id` : 使用订单 ID 返回订单
* `get_customer_orders` : 返回特定客户的所有订单
* `cancel_order` : 如果订单处于“处理中”状态，则取消订单。


```python
## Define all the tools avilable to the model
tool_config = {
    "tools": [
        {
            "toolSpec": {
                "name": "get_user",
                "description": "Looks up a user by email, phone, or username.",
                "inputSchema": {
                    "json": {
                        "type": "object",
                        "properties": {
                            "key": {
                                "type": "string",
                                "enum": ["email", "phone", "username"],
                                "description": "The attribute to search for a user by (email, phone, or username).",
                            },
                            "value": {
                                "type": "string",
                                "description": "The value to match for the specified attribute.",
                            },
                        },
                        "required": ["key", "value"],
                    }
                },
            }
        },
        {
            "toolSpec": {
                "name": "get_order_by_id",
                "description": "Retrieves the details of a specific order based on the order ID. Returns the order ID, product name, quantity, price, and order status.",
                "inputSchema": {
                    "json": {
                        "type": "object",
                        "properties": {
                            "order_id": {
                                "type": "string",
                                "description": "The unique identifier for the order.",
                            }
                        },
                        "required": ["order_id"],
                    }
                },
            }
        },
        {
            "toolSpec": {
                "name": "get_customer_orders",
                "description": "Retrieves the list of orders belonging to a user based on a user's customer id.",
                "inputSchema": {
                    "json": {
                        "type": "object",
                        "properties": {
                            "customer_id": {
                                "type": "string",
                                "description": "The customer_id belonging to the user",
                            }
                        },
                        "required": ["customer_id"],
                    }
                },
            }
        },
        {
            "toolSpec": {
                "name": "cancel_order",
                "description": "Cancels an order based on a provided order_id.  Only orders that are 'processing' can be cancelled",
                "inputSchema": {
                    "json": {
                        "type": "object",
                        "properties": {
                            "order_id": {
                                "type": "string",
                                "description": "The order_id pertaining to a particular order",
                            }
                        },
                        "required": ["order_id"],
                    }
                },
            }
        },
    ],
    "toolChoice": {"auto": {}},
}
```
接下来我们定义一个 `tool_config` 。

您可以使用 Amazon Bedrock API 为模型提供访问 [工具](https://proxy.rifx.online/https://docs.aws.amazon.com/bedrock/latest/userguide/tool-use.html)，帮助其生成您发送给模型的消息的响应。例如，您可能有一个聊天应用程序，让用户查找广播电台播放的最受欢迎的歌曲。为了回答有关最受欢迎歌曲的请求，模型需要一个可以查询并返回歌曲信息的工具。

> 与模型一起使用工具也被称为 *函数调用*。

在 Amazon Bedrock 中，模型并不直接调用工具。相反，当您向模型发送消息时，您还提供一个或多个工具的定义，这些工具可能会帮助模型生成响应。在这个例子中，您将提供一个返回客户详情、订单详情或取消订单的工具定义。如果模型确定需要工具来生成消息的响应，模型将回复您请求调用该工具。它还包括要传递给工具的输入参数（所需的客户 ID 或订单 ID）。

在您的代码中，您代表模型调用工具。在这种情况下，假设工具实现是一个 API。工具也可以是数据库、Lambda 函数或其他软件。您决定如何实现工具。然后，您通过提供工具结果的消息与模型继续对话。最后，模型生成一个包含您发送给模型的工具结果的原始消息的响应。

在我们的例子中，我们在 `tool_config` 中定义了我们希望聊天机器人执行的所有功能。有关 ToolConfiguration API 的更多信息，请参阅 [Amazon Bedrock 文档](https://proxy.rifx.online/https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_ToolConfiguration.html)。

```python
def process_tool_call(tool_name: str, tool_input: Any) -> Any:
    """Process the tool call based on the tool name and input."""
    if tool_name == "get_user":
        return db.get_user(tool_input["key"], tool_input["value"])
    elif tool_name == "get_order_by_id":
        return db.get_order_by_id(tool_input["order_id"])
    elif tool_name == "get_customer_orders":
        return db.get_customer_orders(tool_input["customer_id"])
    elif tool_name == "cancel_order":
        return db.cancel_order(tool_input["order_id"])
```
由于我们的应用程序代码将代表 LLM 调用所需的工具，我们将所有工具打包到一个单一的函数中。`process_tool_call` 函数根据 LLM 提供的 `tool_name` 和 `tool_input` 执行相应的功能。

```python
def simple_chat():
    """Main chat function that interacts with the user and the LLM."""
    system_prompt = """
    You are a customer support chat bot for an online retailer called TechNova. 
    Your job is to help users look up their account, orders, and cancel orders.
    Be helpful and brief in your responses.
    You have access to a set of tools, but only use them when needed.  
    If you do not have enough information to use a tool correctly, ask a user follow up questions to get the required inputs.
    Do not call any of the tools unless you have the required data from a user. 
    """
    # Initial user message
    user_message = input("\nUser: ")
    messages = [{"role": "user", "content": [{"text": user_message}]}]

    while True:
        # If the last message is from the assistant, get another input from the user
        if messages[-1].get("role") == "assistant":
            user_message = input("\nUser: ")
            messages.append({"role": "user", "content": [{"text": user_message}]})

        # Parameters for API request to the Bedrock model
        converse_api_params = {
            "modelId": modelId,
            "system": [{"text": system_prompt}],
            "messages": messages,
            "inferenceConfig": {"maxTokens": 4096},
            "toolConfig": tool_config,  # Pass the tool config
        }

        # Get response from Bedrock model
        response = bedrock_client.converse(**converse_api_params)

        # Append assistant's message to the conversation
        messages.append(
            {"role": "assistant", "content": response["output"]["message"]["content"]}
        )

        # If the model wants to use a tool, process the tool call
        if response["stopReason"] == "tool_use":
            tool_use = response["output"]["message"]["content"][
                -1
            ]  # Naive approach assumes only 1 tool is called at a time
            tool_id = tool_use["toolUse"]["toolUseId"]
            tool_name = tool_use["toolUse"]["name"]
            tool_input = tool_use["toolUse"]["input"]

            print(f"Claude wants to use the {tool_name} tool")
            print(f"Tool Input:")
            print(json.dumps(tool_input, indent=2))

            # Run the underlying tool functionality on the fake database
            tool_result = process_tool_call(tool_name, tool_input)

            print(f"\nTool Result:")
            print(json.dumps(tool_result, indent=2))

            # Append tool result message
            messages.append(
                {
                    "role": "user",
                    "content": [
                        {
                            "toolResult": {
                                "toolUseId": tool_id,
                                "content": [{"text": str(tool_result)}],
                            }
                        }
                    ],
                }
            )

        else:
            # If the model does not want to use a tool, just print the text response
            print(
                "\nTechNova Support:"
                + f"{response['output']['message']['content'][0]['text']}"
            )
```
`simple_chat` 函数处理用户交互，调用 LLM，并将工具响应传回 LLM。

该函数中的一个重要行是 `response["stopReason"] == "tool_use"`。这决定了 LLM 是否想要使用工具，并在进一步解析时指示 LLM 打算调用哪个工具。

以下是 bedrock-runtime `converse` API 的响应对象示例：

```python
{
    'ResponseMetadata': {
        'RequestId': '07f323a7-cc52-4813-9d1b-83e5c3ae932a', 
        'HTTPStatusCode': 200, 
        'HTTPHeaders': {
            'date': 'Thu, 08 Aug 2024 10:52:59 GMT', 
            'content-type': 'application/json', 
            'content-length': '519', 
            'connection': 'keep-alive', 
            'x-amzn-requestid': '07f323a7-cc52-4813-9d1b-83e5c3ae932a'
        }, 
        'RetryAttempts': 0
    }, 
    'output': {
        'message': {
            'role': 'assistant', 'content': [
                {
                    'text': "Certainly! I'll search for search for your orders. Let me use our search tool to find that information for you."
                }, {
                    'toolUse': {
                        'toolUseId': 'tooluse_8C_XIwrAROC3t3eEu5FCVw', 
                        'name': 'get_customer_orders', 
                        'input': {'customer_id': '1213210'}
                    }
                }
            ]
        }
    }, 
    'stopReason': 'tool_use',
    'usage': {'inputTokens': 672, 'outputTokens': 103, 'totalTokens': 775}, 
    'metrics': {'latencyMs': 2431}
}
```
有关 Converse API 的更多详细信息，请参阅 [Amazon Bedrock API 参考](https://proxy.rifx.online/https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_Converse.html)。

一旦我们使用 `process_tool_call` 函数调用所需的工具或功能，我们将函数的响应传回 LLM，以生成最终用户的响应。

请注意，我们正在使用 boto3 Bedrock 运行时客户端的 Converse API。您还可以使用 Converse Stream API 生成流式响应。有关更多详细信息，请参阅 Amazon Bedrock API 参考中的 Converse Stream API 和 Boto3 文档中的 Converse Stream API。

### 在本地终端运行

一旦您正确设置了所有内容，请在虚拟环境中运行 Python 文件，使用：

```python
## 从虚拟环境内部
python main.py
```
![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Ok9N3mdX50JVWbaJKUrJeQ.gif)

## 在 EC2 上部署

您可以在 EC2 实例上部署聊天机器人以进行演示，使用 [Gradio](https://proxy.rifx.online/https://www.gradio.app/) 应用程序，它只需几行代码即可提供类似聊天机器人的界面，并与我们的主函数无缝集成。

### Gradio

[Gradio](https://proxy.rifx.online/https://www.gradio.app/) 是一个开源的 Python 库，简化了构建和部署基于网页的机器学习演示的过程。它允许开发者以最少的编码创建直观的网页界面，使得部署和分享模型变得更加容易。

让我们编写一个聊天函数，随机响应 `Yes` 或 `No`，使用 gradio。

这是我们的聊天函数（如果您还没有安装，请在您的虚拟环境中执行 `pip install gradio`）：

```python
import random

import gradio as gr


def random_response(message, history):
    return random.choice(["Yes", "No"])

gr.ChatInterface(random_response).launch()
```
![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*XxkUM6yO3lmjN545tRlOvQ.png)

阅读更多关于 [gradio 聊天机器人文档的信息](https://proxy.rifx.online/https://www.gradio.app/main/docs/gradio/chatbot)。

### 在您的 Web 服务器上使用 Nginx 运行 Gradio 应用

让我们在 EC2 上使用 Nginx 部署我们的聊天机器人代理。

**安装 Nginx 并创建新的 conda 环境**

1. **创建一个至少有 2–3 GB 内存的 EC2 实例**。您也可以在 Kubernetes 或 ECS 集群上部署。确保修改 Nginx 配置文件以匹配您的设置。

2\. **SSH 进入您的 EC2 实例**并 [安装 Nginx](https://proxy.rifx.online/https://devopsden.io/article/how-to-install-nginx-on-ec2-instance):


```python
sudo yum update -y
sudo amazon-linux-extras install nginx1.12
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl status nginx
```
3\. [**安装 Miniconda**](https://proxy.rifx.online/https://docs.anaconda.com/miniconda/#quick-command-line-install) 以管理 Python 包:


```python
mkdir -p ~/miniconda3
wget https://proxy.rifx.online/https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda3/miniconda.sh
bash ~/miniconda3/miniconda.sh -b -u -p ~/miniconda3
rm -rf ~/miniconda3/miniconda.sh

~/miniconda3/bin/conda init bash
~/miniconda3/bin/conda init zsh
```
4\. **创建一个新的 Conda 环境**，使用 Python 3，并安装 `boto3` 和 `gradio`:


```python
conda create --name gradio-demo python=3.12 pip -y
conda activate gradio-demo
pip install --no-cache-dir gradio boto3
```
5\. **为您的聊天机器人和 Gradio 代码创建一个新的 Python 文件**。将所有代码复制到此文件中:


```python
vim gradio_demo.py
```
或者，您可以使用 `scp` 将文件直接从本地计算机复制到远程实例。

**设置 Nginx**

现在我们将 **设置 Nginx** 以将所有流量从 `/gradio-demo` 路径重定向到由 `gradio_demo.py` 文件启动的本地服务器。请参阅 [此处的官方文档以在 Nginx 上运行 Gradio](https://proxy.rifx.online/https://www.gradio.app/guides/running-gradio-on-your-web-server-with-nginx)。

1. 编辑位于 `/etc/nginx/nginx.conf` 的 Nginx 配置文件:


```python
vim /etc/nginx/nginx.conf
```
2\. 在 `http` 块中，添加以下行以包含来自单独文件的服务器块配置:


```python
server_names_hash_bucket_size  128;
include /etc/nginx/sites-enabled/*;
```
3\. 在 `/etc/nginx/sites-available` 目录中创建一个新文件（如果该目录不存在则创建），使用一个表示您的应用程序的文件名，例如：`sudo vim /etc/nginx/sites-available/my_gradio_app` :


```python
sudo mkdir -p /etc/nginx/sites-enabled
sudo vim /etc/nginx/sites-available/my_gradio_app
```
在 `my_gradio_app` 文件中粘贴以下内容:


```python
server {
    listen 80;
    server_name www.ec2-12-34-56-78.us-west-2.compute.amazonaws.com; # 将此更改为您的域名

    location /gradio-demo/ {  # 如果您希望在不同路径上提供 Gradio 应用，请更改此处
        proxy_pass http://127.0.0.1:7860/; # 如果您的 Gradio 应用将在不同端口上运行，请更改此处
        proxy_buffering off;
        proxy_redirect off;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
4\. 在 `/etc/nginx/sites-enabled` 目录中创建指向此文件的符号链接:


```python
sudo ln -s /etc/nginx/sites-available/my_gradio_app /etc/nginx/sites-enabled/
```
5\. **更新 `gradio_demo.py` 文件** 以在 Gradio 启动 API 中设置根路径:


```python
.launch(root_path="/gradio-demo")
```
6\. **检查 Nginx 配置** 并重启 Nginx:


```python
sudo nginx -t
sudo systemctl restart nginx
```
如果您在 `nginx -t` 命令中遇到错误，请在继续之前解决这些错误。

**在后台运行 `gradio_demo.py` 文件**。您可以使用 `nohup` 或 `tmux`:


```python
## 从 Conda 环境内部
nohup python gradio_demo.py &
```
**访问 EC2 DNS URL** 并附加 `/gradio-demo/` 以查看您的聊天机器人代理在 Gradio 界面上。

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*rcdUROlShsrcaeBDpBKBAQ.png)

## 摘要

在本文中，我们探讨了如何使用 [Llama3\.1](https://proxy.rifx.online/https://llama.meta.com/) 或 [Claude 3\.5 Sonnet](https://proxy.rifx.online/https://www.anthropic.com/news/claude-3-5-sonnet) 模型构建客户支持助手。我们首先定义了处理重复客户查询的问题，以及 LLM 代理如何提供解决方案。接着，我们讨论了 LLM 代理的概念以及它们与一般 LLM 的区别。之后，我们演示了如何在 Python 中创建一个基本代理，并使用 Amazon Bedrock 中的模型开发了一个更复杂的客户支持助手。我们还介绍了如何在 EC2 上部署助手，包括使用 Gradio 创建 Web 界面的示例。通过自动化常规客户支持任务，企业可以提高效率，降低成本，并改善客户满意度。

在生产环境中，您可以将登录用户的姓名和 ID 传递给系统提示，以便 LLM 不必向登录用户询问基本信息。某些操作，例如取消订单，可能需要额外的门控。此外，如果客户感到不满或变得激动，应该指示 LLM 将案件升级到人类助手。

您可以通过 LinkedIn 与我联系：<https://proxy.rifx.online/https://linkedin.com/in/maheshrajput>

感谢您的阅读 😊

