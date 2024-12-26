---
title: "使用 GPT-4o 创建 WhatsApp 人工智能代理"
meta_title: "使用 GPT-4o 创建 WhatsApp 人工智能代理"
description: "本文介绍了如何使用Meta API构建一个基于LLM的WhatsApp聊天机器人。通过整合WhatsApp Cloud API与AI代理，用户可以在熟悉的聊天界面中进行实时数据请求和任务自动化。文章详细描述了设置WhatsApp API、创建Webhook、使用FastAPI开发后端、处理多媒体消息及用户身份验证等步骤。最终目标是实现一个能够与用户互动并执行复杂任务的AI助手，为未来的AI驱动工作流奠定基础。"
date: 2024-12-26T04:30:18Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*MtZ0n0nFFWmebZTncI2sqA.jpeg"
categories: ["Programming", "Technology", "Chatbots"]
author: "Rifx.Online"
tags: ["WhatsApp", "CloudAPI", "FastAPI", "webhook", "transcription"]
draft: False

---





### 如何使用 Meta API 构建您自己的 LLM 驱动的 Whatsapp 聊天机器人

在人工智能和商业管理领域，AI 代理与广泛使用的通信工具的整合是一个颠覆性的变化。想象一下，您可以通过 WhatsApp 直接与您业务的管理或个人助手 AI 进行实时数据请求、更新和任务自动化，这一切都通过熟悉的聊天界面实现。

在我们关于创建 AI 驱动的业务管理器系列的第三部分中，我将引导您完成将 AI 代理连接到 WhatsApp 的步骤，以增强其功能和覆盖范围。我们的目标是实现一个能够与您所有相关数据库表进行交互，甚至能够独立创建表格和所有必要工具的 AI 助手。作为主要展示，我将重点关注一个商业用例，例如跟踪费用、发票等。然而，您可以轻松适应相同的逻辑来创建，例如一个跟踪您的任务、项目和想法的个人助手。

这是我系列的第三部分。在我们开始之前，我要为等待的每个人道歉，感谢您们的耐心。过去几个月我一直忙于开始一份新的 AI 软件工程工作，并适应新的工作与生活平衡。我已经准备了一些未来部分的文章，我们将探讨代理工作流程的重大变化，以及具有更多附加功能的更复杂工作流程。在前两篇文章中使用的一些变通方法在当时是确保可靠工具调用所必需的，但由于更高效的模型如 GPT-4o 和 GPT-4o-mini，现在已不再需要。如果您是工具调用和代理工作流程开发的新手，我仍然建议从前两部分开始。我发现了解如何从头开始构建某些东西是非常有用的，而不是依赖像 LangChain 或更具体的 LangGraph 这样的框架来实现深度可定制的代理工作流程（我将在不久的将来介绍）。

现在，我们需要退一步，首先关注基础设施。我认为在大多数项目中，特别是在 AI 软件项目中，最好的做法是在功能蔓延之前，最初创建一个可工作的端到端产品。我常常发现自己过度思考初始设计选择，并在脑海中开发出一个过于复杂的产品。为了解决这个问题，在几天的开发时间内专注于构建一个可工作的端到端产品，确实有助于建立一个明确的基础。在那之后，您将知道优先考虑哪些功能，并能够收集初步反馈。这为增量开发过程奠定了基础，这始终是我在承诺一个项目时的目标。

## 之前部分的回顾

我们在本系列的早期部分建立了AI驱动的业务管理器的基础：

* [**第一部分**](https://towardsdatascience.com/leverage-openai-tool-calling-building-a-reliable-ai-agent-from-scratch-4e21fcd15b62)：目标是开发一个原型代理工作流，能够与工具对象交互，并减少底层语言模型（LLM）生成的工具参数中的幻觉现象。
* [**第二部分**](https://towardsdatascience.com/building-an-ai-powered-business-manager-e2a31a2fe984)：我们专注于定义基本功能，组织项目存储库，并使用SQLModel构建数据库架构。我们还添加了用于数据添加和查询的SQL工具，并更新了Tool类以适应SQLModel对象。此外，我们介绍了TaskAgent类以自动化代理启动，并设置了OpenAIAgent以实现上下文感知的工具使用。

## 本文的范围

如往常一样，让我们首先定义本文的范围：

1. **使用 MetaAPI 将 AI Agent 与 WhatsApp 集成** 设置和配置 MetaAPI 以实现 WhatsApp Business 集成。确保 AI agent 能够通过 WhatsApp 发送和接收消息。
2. **使用 Ngrok 设置 Webhooks 并在本地运行** 创建一个 FastAPI 应用程序来处理来自 WhatsApp 的 webhook 事件。使用 ngrok 将本地 FastAPI 服务器暴露到互联网。配置 MetaAPI 以将 webhook 事件发送到 ngrok URL

由于我们正在向可部署的服务器迈进，因此我们还需要调整我们的项目架构。我们本质上是在实现一个 FastAPI 服务器，因此我首选的仓库结构是领域驱动设计（DDD），或者更倾向于 DDD。（您可以在 [这里](https://github.com/elokus/WhatsappAgent) 查看仓库结构）

## 1\. 设置 WhatsApp Cloud API

首先，您需要熟悉 Meta 提供的 Cloud API。您可以使用像 Twilio 这样的 SaaS 产品实现相同的结果，这些产品提供了更友好的集成。然而，由于最近的数据泄露以及出于成本效率的考虑，我更倾向于使用 Meta 提供的根 API。

## 1\.1 前提条件

1. 在开始之前，您需要通过以下步骤注册一个 Meta 开发者账号：[如何开设 Meta 开发者账号](https://developers.facebook.com/docs/development/register)。在注册过程中，您需要使用手机号码进行验证。请注意，这将不是您最终 WhatsApp 客户端的手机号码。相反，您将获得一个由平台分配的测试手机号码，之后可以更改为其他手机号码。
2. 注册后，前往您的仪表板并创建一个应用。
3. 此外，您还需要一个与您的真实账户关联的 Meta 商业账户（MBA），或者您可以创建一个新的 MBA 进行关联。您也可以跳过此步骤，因为在下一步中，系统会自动提示您关联或创建 MBA。

## 1\.2 将 WhatsApp 产品添加到您的应用程序

在您的 Meta 开发者账户中创建应用程序后，系统会提示您添加产品。在这里，您需要选择 WhatsApp 并按照设置流程进行操作。如果您尚未完成，请在此处创建一个 Meta 商业账户。完成后，您将拥有一个测试 WhatsApp 商业账户和一个测试电话号码。

## 1\.3 添加接收者号码

1. 在应用仪表板的左侧菜单中，导航到 **WhatsApp** \> **API 设置**  
   在 **发送和接收消息** 下，选择 **收件人** 字段并选择 **管理电话号码列表**。在这里，您可以添加一个允许发送和接收消息的电话号码，这个号码最好是您自己的手机号码，因为您想要测试您的应用程序。在将此 WhatsApp API 账户链接到真实号码之前，您最多只能添加 5 个接收者号码。
2. 在 `WhatsApp > API 设置` 中，您现在可以通过在 `from` 字段中填写您的测试电话号码，在 `to` 字段中填写您的接收者号码（您自己的手机号码）来发送测试消息。
3. 生成访问令牌。这是您的 `WHATSAPP_API_TOKEN`，我们将在第 6 步中需要它。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Yy6n2NdwO6CrSL2njWj-7g.png)

我们已成功按要求设置 Cloud API。在下一步中，我们将创建一个 Webhook，以便与我们的 AI 助手应用程序进行通信。

为此，我们需要在后端应用程序中创建并提供一个端点。这意味着我们的 Python 后端必须通过 URL 可访问。此 URL 将充当 Webhook 端点，AI 助手可以调用它以发送和接收数据。

## 2\. 创建 FastAPI 端点

为了被 Webhook 接受，我们的根端点必须验证 Webhook 在添加我们的 URL 时发送的特定 GET 请求。Webhook 将发送三个查询参数：

`hub.mode`，`hub.challenge`，`hub.verify.token`。

验证令牌是在 Cloud API 中创建 Webhook 时定义的。您的后端应该验证该令牌是否与您定义的匹配，并将 `hub.challenge` 对象作为响应返回。确保首先使用 `pip install fastapi uvicorn` 安装 FastAPI 和 Uvicorn。

## 2\.1 创建 main.py

创建一个名为 `main.py` 的文件，内容如下：


```python
from fastapi import FastAPI, Query, HTTPException


VERIFICATION_TOKEN = "abcdefg12345"

app = FastAPI()


@app.get("/")
def verify_whatsapp(
    hub_mode: str = Query("subscribe", description="The mode of the webhook", alias="hub.mode"),
    hub_challenge: int = Query(..., description="The challenge to verify the webhook", alias="hub.challenge"),
    hub_verify_token: str = Query(..., description="The verification token", alias="hub.verify_token"),
):
    if hub_mode == "subscribe" and hub_verify_token == VERIFICATION_TOKEN:
        return hub_challenge
    raise HTTPException(status_code=403, detail="Invalid verification token")


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.get("/readiness")
def readiness():
    return {"status": "ready"}
```
在第三行，您可以定义一个 `VERIFICATION_TOKEN`，该令牌稍后将由 webhook 用于验证后端是否在您的控制之下。在这种情况下，我们将其定义为 `"abcdefg12345"`，但您可以定义自己的自定义令牌。

我将继续修正其余部分，并很快包含下一部分！

## 2\.2 运行应用程序

使用 Uvicorn 运行应用程序：

```python
uvicorn main:app --reload
```

## 2\.3 本地服务您的 API

您的后端现在在 `http://localhost:8000` 和/或 [`http://127.0.0.1:8000`](http://127.0.0.1:8000) 上运行。

我们现在提供以下端点：

* 验证 WhatsApp webhook: [`http://127.0.0.1:8000/?hub.mode=subscribe&hub.challenge=1234&hub.verify_token=abcdefg12345`](http://127.0.0.1:8000/?hub.mode=subscribe&hub.challenge=1234&hub.verify_token=abcdefg12345)
* 健康检查端点: [`http://127.0.0.1:8000/health`](http://127.0.0.1:8000/health)
* 就绪检查端点: [`http://127.0.0.1:8000/readiness`](http://127.0.0.1:8000/readiness)

您可以使用健康检查端点来检查您的应用程序是否正在运行。在浏览器中打开 `http://127.0.0.1:8000/health`，您应该看到: `{"status": "healthy"}`

## 3\. 使用 Ngrok 运行代理服务器

由于我们的服务器在本地运行，WhatsApp Webhook 无法调用端点进行验证。我们需要的是一个可以被 webhook 使用的公共 URL。有两个选项：将应用程序部署到云服务器或创建一个代理服务器隧道。由于我们仍处于开发过程中，我们将使用第二个选项。

1. 前往 [ngrok 注册](https://dashboard.ngrok.com/signup) 并创建一个免费账户。
2. 在本地安装 ngrok。根据您的系统，您可以使用 Brew、Chocolatey，或直接下载并安装。请参见：[设置与安装](https://dashboard.ngrok.com/get-started/setup)。
3. 安装完成后，在终端中使用以下命令添加您的认证代码。将 `$YOUR-AUTHENTICATION_TOKEN` 替换为您的 ngrok 认证令牌，该令牌可以在 ngrok 控制面板的“Your Authtoken”下找到。
4. 通过在终端中运行以下命令，开始从本地主机的 8000 端口转发流量：


```python
> ngrok config add-authtoken $YOUR-AUTHENTICATION_TOKEN
> ngrok http http://localhost:8000

Forwarding                    https://<random-string>.ngrok.io -> http://localhost:8000
```
您的本地服务器现在可以通过 ngrok 提供的公共 URL 访问。您应该看到类似以下内容：


```python
Forwarding                    https://<random-string>.ngrok.io -> http://localhost:8000
```
使用 ngrok 提供的 HTTPS URL 进行 webhook 配置。

## 4\. 实现 Webhook

现在让我们回到 Meta 的 Cloud API 来实现所需的 webhook。

1. 访问 [Meta for Developers](https://developers.facebook.com/apps/) 并选择之前创建的应用。
2. 在左侧菜单中转到 **WhatsApp** \> **Configuration**。
3. 在 **Webhook** 部分，将您的 ngrok HTTPS 转发 URL 粘贴到 **Callback URL** 字段中，并在 **Verification Token** 字段中输入 `main.py` 中定义的 `VERIFICATION_TOKEN`。
4. 点击确认并保存按钮，等待 webhook 验证您的后端。
5. 在 **Webhook Fields** 部分，在 **Subscribed Fields** 下启用 `messages` 切换。

就这样！您现在应该能够在 Python 后端服务器中接收 WhatsApp 消息。

## 4\.1 理解 Webhooks 和对话

Webhooks 是 HTTP 回调，允许程序在特定事件发生时接收实时更新，例如新消息或状态变化。Webhooks 通过向预配置的 URL（在我们的案例中是 ngrok 代理服务器 URL）发送包含事件数据的 HTTP 请求，使系统集成和自动化成为可能。

要理解 Meta 宇宙中 Webhooks 的逻辑和定价，了解一些关于对话的基本原则是很有帮助的。

在 WhatsApp API 上，‘对话’开始于：**1\. 用户发送消息**：这会打开一个 24 小时的窗口，在此期间，您可以回复包括文本、图像或其他媒体的消息 **而无需额外费用**。

**2\. 商家发起联系**：如果最近没有收到用户消息（没有打开的 24 小时窗口），您的 AI 助手必须使用 **预先批准的模板消息** 来开始对话。您可以添加自定义模板，但需要获得 Meta 的批准。

只要用户持续回复，24 小时窗口会随着每条新消息重置。这使得在没有额外费用的情况下进行持续互动成为可能。一次对话的费用约为 0\.00–0\.08 美元。具体定价基于您的对话类型（营销、实用、服务）和您的位置。仅供参考：服务对话目前似乎是免费的。您可以在这里找到具体定价：[Whatsapp 定价](https://developers.facebook.com/docs/whatsapp/pricing)

## 5\. 构建接收消息的端点

现在我们能够在后端接收消息了。由于我们已订阅消息对象，每当消息发送到您的测试号码时，webhook 将向您在前一步中定义的回调 URL 创建一个 POST 请求。接下来我们需要做的是在我们的 FastAPI 应用程序中构建一个处理 POST 请求的端点。

让我们先定义需求：

* **返回 200 HTTP 状态码：** 这对于通知 CloudAPI 消息已成功接收至关重要。未能做到这一点将导致 CloudAPI 在长达 7 天的时间内重试发送消息。
* **提取电话号码和消息：** 传入请求的有效负载包含包括电话号码和消息的数据。我们需要在后端处理这些数据。
* **过滤传入对象：** 由于 CloudAPI 可能会为同一条消息发送多个事件（例如已发送、已接收和已阅读），后端需要确保仅处理一条消息的实例。
* **处理多种消息类型：** 后端可以处理不同类型的消息，例如文本、语音消息和图片。为了不扩展文章的范围，我们将仅为图片奠定基础，但不实现到最终。
* **使用 LLM-Agent 工作流进行处理：** 提取的信息通过我们在本系列的前面部分开发的 LLM-Agent 工作流进行处理。您也可以使用其他代理实现，例如 Langchain 或 Langgraph。

## 5\.1 定义模型和架构

我们将从 webhook 接收负载。您可以在 Meta 的文档中找到示例负载：[示例负载](https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples/)

我更喜欢使用 Pydantic 编写代码，以为我的 Python 代码增加类型安全。此外，类型注解和 Pydantic 是 FastAPI 应用程序的最佳匹配。因此，让我们首先定义在我们的端点中使用的模型：

```python
## app/schema.py
from typing import List, Optional  
from pydantic import BaseModel, Field   

class Profile(BaseModel):  
    name: str  

class Contact(BaseModel):  
    profile: Profile  
    wa_id: str  

class Text(BaseModel):  
    body: str

class Image(BaseModel):  
    mime_type: str  
    sha256: str  
    id: str  

class Audio(BaseModel):  
    mime_type: str  
    sha256: str  
    id: str  
    voice: bool  

class Message(BaseModel):  
    from_: str = Field(..., alias="from")  
    id: str  
    timestamp: str  
    text: Text | None = None  
    image: Image | None = None  
    audio: Audio | None = None  
    type: str

class Metadata(BaseModel):  
    display_phone_number: str  
    phone_number_id: str

class Value(BaseModel):  
    messaging_product: str  
    metadata: Metadata  
    contacts: List[Contact] | None = None  
    messages: List[Message] | None = None  

class Change(BaseModel):  
    value: Value  
    field: str  
    statuses: List[dict] | None = None  

class Entry(BaseModel):  
    id: str  
    changes: List[Change]  

class Payload(BaseModel):  
    object: str  
    entry: List[Entry]

class User(BaseModel):  
    id: int  
    first_name: str  
    last_name: str  
    phone: str
    role: str

class UserMessage(BaseModel):  
    user: User  
    message: str | None = None  
    image: Image | None = None  
    audio: Audio | None = None
```

## 5\.2 解析传入消息

接下来，我们将为在 FastAPI 中使用依赖注入创建一些辅助函数：

```python
## app/main.py

from app.domain import message_service

def parse_message(payload: Payload) -> Message | None:  
    if not payload.entry[0].changes[0].value.messages:  
        return None  
    return payload.entry[0].changes[0].value.messages[0]  

def get_current_user(message: Annotated[Message, Depends(parse_message)]) -> User | None:  
    if not message:  
        return None  
    return message_service.authenticate_user_by_phone_number(message.from_)  

def parse_audio_file(message: Annotated[Message, Depends(parse_message)]) -> Audio | None:  
    if message and message.type == "audio":  
        return message.audio  
    return None  

def parse_image_file(message: Annotated[Message, Depends(parse_message)]) -> Image | None:  
    if message and message.type == "image":  
        return message.image  
    return None  

def message_extractor(  
        message: Annotated[Message, Depends(parse_message)],  
        audio: Annotated[Audio, Depends(parse_audio_file)],  
):  
    if audio:  
        return message_service.transcribe_audio(audio)  
    if message and message.text:  
        return message.text.body  
    return None
```
* **解析负载：** `parse_message` 函数从传入负载中提取第一个消息（如果存在）。如果没有找到消息，该函数返回 `None`，以便只处理有效消息。
* **用户认证：** `get_current_user` 函数使用 `parse_message` 依赖注入来提取消息，然后根据与消息关联的电话号码进行用户认证。在这里，我们确保只有经过认证的用户可以发送消息。
* **音频和图像解析：** 这些函数从消息中提取音频或图像文件，如果消息类型分别为“audio”或“image”。这使得应用程序能够处理不同类型的媒体。
* **消息提取：** `message_extractor` 函数尝试从消息中提取文本或将音频转录为文本。这确保无论消息类型如何，内容都可以被处理。

这里我们从我们的领域层引入了一个模块。整个脚本 `message_service` 是我们放置该实现所有领域特定代码的地方，例如 `authenticate_user_by_phone_number` 和 `transcribe_audio`。

## 5\.3 实现 POST 端点


```python
## app/main.py
import threading  
from typing_extensions import Annotated  
from fastapi import APIRouter, Query, HTTPException, Depends  
from app.domain import message_service  
from app.schema import Payload, Message, Audio, Image, User  

## ... rest of the code ...

@app.post("/", status_code=200)  
def receive_whatsapp(  
        user: Annotated[User, Depends(get_current_user)],  
        user_message: Annotated[str, Depends(message_extractor)],  
        image: Annotated[Image, Depends(parse_image_file)],  
):  
    if not user and not user_message and not image:  
        return {"status": "ok"}  
    if not user:  
        raise HTTPException(status_code=401, detail="Unauthorized")  
    if image:  
        return print("Image received")  
    if user_message:  
        thread = threading.Thread(
            target=message_service.respond_and_send_message, 
            args=(user_message, user)
        )  
        thread.daemon = True  
        thread.start()  
    return {"status": "ok"}
```
* **POST 端点实现：** 该端点处理传入的 POST 请求。它检查用户、消息或图像是否有效。如果都无效，则简单地返回一个状态消息给 CloudAPI。如果用户未经过身份验证，则抛出一个 `HTTPException`，状态码为 401。
* **处理图像和消息：** 如果接收到图像，我们会进行简单的 stdout 打印，作为未来图像处理的占位符。如果接收到文本消息，则使用单独的线程异步处理，以避免阻塞主应用线程。调用 `message_service.respond_and_send_message` 函数根据 LLM-Agent 工作流处理消息。

**使用线程池处理 Webhook 的解释：** WhatsApp 会在收到 200 响应之前重新发送 webhook，因此使用线程池确保消息处理不会阻塞 webhook 响应。

## 6 消息服务

在我们之前定义了端点的展示层中，我们使用了一些需要接下来定义的 `message_service` 函数。具体来说，我们需要一个实现来处理和转录音频负载、验证用户，最后调用我们的代理并发送响应。我们将把所有这些功能放在 `domain/message_service.py` 中。在生产环境中，随着应用的增长，我建议将它们进一步拆分，例如 `transcription_service.py`、`message_service.py` 和 `authentication_service.py`。

在本节的多个函数中，我们将向 Meta API 发送请求 `"https://graph.facebook.com/..."`。在所有这些请求中，我们需要包含带有 `WHATSAPP_API_KEY` 的授权头，该密钥在 **步骤 1\.3** 中创建，作为持有者令牌。我通常将 API 密钥和令牌存储在 `.env` 文件中，并通过 Python 的 `dotenv` 库访问它们。我们还使用 OpenAI 客户端和你的 `OPENAI_API_KEY`，这也可以存储在 `.env` 文件中。

但为了简单起见，让我们将它们放置并在 `message_service.py` 脚本的顶部初始化，如下所示：

```python
import os  
import json  
import requests  
from typing import BinaryIO

WHATSAPP_API_KEY = "YOUR_ACCESS_TOKEN"
llm = OpenAI(api_key="YOUR_OPENAI_API_KEY")
```
将 “YOUR\_ACCESS\_TOKEN” 替换为您在步骤 1\.3 中创建的实际访问令牌。

## 6\.1 处理和转录音频文件

处理来自WhatsApp webhook的语音记录并不像看起来那么简单。首先，重要的是要知道，传入的webhook只告诉我们数据类型和对象ID。因此，它不包含二进制音频文件。我们首先必须使用Meta的Graph API下载音频文件。要下载我们接收到的音频，我们需要进行两个顺序请求。第一个是带有`object_id`的GET请求，以获取下载URL。这个下载URL是我们第二个GET请求的目标。

```python
def download_file_from_facebook(file_id: str, file_type: str, mime_type: str) -> str | None:  
    # First GET request to retrieve the download URL  
    url = f"https://graph.facebook.com/v19.0/{file_id}"  
    headers = {"Authorization": f"Bearer {WHATSAPP_API_KEY}"}  
    response = requests.get(url, headers=headers)
    if response.status_code == 200:  
            download_url = response.json().get('url')  
            # Second GET request to download the file  
            response = requests.get(download_url, headers=headers)  
            if response.status_code == 200:
                # Extract file extension from mime_type    
                file_extension = mime_type.split('/')[-1].split(';')[0]
                # Create file_path with extension
                file_path = f"{file_id}.{file_extension}"  
                with open(file_path, 'wb') as file:  
                    file.write(response.content)  
                if file_type == "image" or file_type == "audio":  
                    return file_path  
            raise ValueError(f"Failed to download file. Status code: {response.status_code}")  
        raise ValueError(f"Failed to retrieve download URL. Status code: {response.status_code}")
```
在这里，我们基本上是通过对象ID获取下载URL，并使用文件扩展名将文件下载到文件系统中作为`file_path`。如果出现问题，我们会引发一个`ValueError`，指示错误发生的位置。

接下来，我们简单地定义一个函数，接受音频二进制文件并使用Whisper进行转录：

```python
def transcribe_audio_file(audio_file: BinaryIO) -> str:  
    if not audio_file:  
        return "No audio file provided"  
    try:  
        transcription = llm.audio.transcriptions.create(  
            file=audio_file,  
            model="whisper-1",  
            response_format="text"  
        )  
        return transcription  
    except Exception as e:  
        raise ValueError("Error transcribing audio") from e
```
最后，让我们将下载和转录函数结合在一起：

```python
def transcribe_audio(audio: Audio) -> str:  
    file_path = download_file_from_facebook(audio.id, "audio", audio.mime_type)  
    with open(file_path, 'rb') as audio_binary:  
        transcription = transcribe_audio_file(audio_binary)  
    try:  
        os.remove(file_path)  
    except Exception as e:  
        print(f"Failed to delete file: {e}")  
    return transcription
```

## 6\.2 认证用户

在使用 Meta 提供的测试号码时，我们必须预定义我们的聊天机器人可以发送消息的号码。我不太确定，也没有测试过是否任何号码都可以向我们的聊天机器人发送消息。但无论如何，一旦我们切换到自定义号码，我们不希望任何人能够执行我们的代理聊天机器人。因此，我们需要一种方法来认证用户。我们有几种选择。首先，我们必须考虑存储用户信息的位置。例如，我们可以使用 PostgreSQL 这样的数据库，或者使用 Firestore 这样的非关系型数据库。我们可以在文件系统中以 JSON 文件或 `.env` 文件的形式预定义我们的用户。在本教程中，我将采用最简单的方法，将用户硬编码到我们认证函数中的列表中。

列表项的结构与 **步骤 5\.1** 中定义的 `User` 模型相同。因此，用户由 ID、名、姓和电话号码组成。我们尚未在我们的代理工作流中实现角色系统。但在大多数不同用户的用例中，例如小型企业助手的示例案例，不同用户将拥有不同的权限和访问范围。现在，我们只传递 `"default"` 作为占位符角色。

```python
def authenticate_user_by_phone_number(phone_number: str) -> User | None:  
    allowed_users = [  
        {"id": 1, "phone": "+1234567890", "first_name": "John", "last_name": "Doe", "role": "default"},  
        {"id": 2, "phone": "+0987654321", "first_name": "Jane", "last_name": "Smith", "role": "default"}  
    ]    
    for user in allowed_users:  
        if user["phone"] == phone_number:  
            return User(**user)  
    return None
```
因此，只需验证电话号码是否在我们的 `allowed_users` 列表中，如果是，则返回用户。否则，我们返回 `None`。如果您查看 **步骤 5\.3** 中的端点，您会看到我们在用户为 `None` 时抛出错误，以防止进一步处理未经授权的用户消息。

## 6\.3 发送消息

现在，在我们实际调用代理之前，最后一个辅助函数是 `send_whatsapp_message`。我在这个函数中包含了两种模式，因为一些与Meta相关的WhatsApp API逻辑。

基本上，您不被允许向用户发送自定义消息作为对话的起始。这意味着，如果用户首先启动对话并向聊天机器人发送消息，您可以用个别文本消息进行回复。否则，如果您希望聊天机器人主动发起对话，您只能使用经过批准的模板，比如“Hello World”模板。

还需要提到的是，当我们谈论Meta逻辑时，启动对话后会打开一个24小时的对话窗口，在此窗口内您可以向该用户发送消息。这个对话窗口也会被计费，而不是单个消息。根据对话的类型（如营销、支持等），情况会变得更加复杂。

您还可以自行定义模板并让其获得Meta的批准。我在这一点上还没有做到，因此为了测试我们是否可以从后端向用户发送消息，我使用“Hello World”模板。如果您添加了一些自定义的批准模板，您也可以使用此函数将其发送给用户。

回到代码。要发送消息，我们发起一个POST请求，并定义一个有效负载，该有效负载可以包括文本主体或模板：

```python
def send_whatsapp_message(to, message, template=True):  
    url = f"https://graph.facebook.com/v18.0/289534840903017/messages"  
    headers = {  
        "Authorization": f"Bearer " + WHATSAPP_API_KEY,  
        "Content-Type": "application/json"  
    }  
    if not template:  
        data = {  
            "messaging_product": "whatsapp",  
            "preview_url": False,  
            "recipient_type": "individual",  
            "to": to,  
            "type": "text",  
            "text": {  
                "body": message  
            }  
        }  
    else:  
        data = {  
            "messaging_product": "whatsapp",  
            "to": to,  
            "type": "template",  
            "template": {  
                "name": "hello_world",  
                "language": {  
                    "code": "en_US"  
                }  
            }  
        }  

    response = requests.post(url, headers=headers, data=json.dumps(data))  
    return response.json()
```

## 6\.4 调用我们的代理

最后，我们可以整合之前示例中的代理。在这个阶段，您还可以整合自定义代理，例如 Langchain 的 `AgentExecutor`、Langgraph 的 `AgentWorkflow` 等。

因此，我们将在每个传入消息上调用的主要函数是 `respond_and_send_message`，它接收 `user_message` 字符串并将其作为输入对象传递给我们的代理工作流。

```python
## app/domain/message_service.py
import json  
import requests
from app.domain.agents.routing_agent import RoutingAgent  
from app.schema import User  

def respond_and_send_message(user_message: str, user: User):  
    agent = RoutingAgent()  
    response = agent.run(user_message, user.id)  
    send_whatsapp_message(user.phone, response, template=False)
```
在调用我们的代理后，我们会得到一个响应消息，我们希望使用 send\_whatsapp\_message 函数将其发送回用户。

现在，您应该能够向测试号码发送消息并通过代理执行器获得答案。**备注**：在使用 WhatsApp 测试号码时，您必须在 Meta API 应用中注册允许向您的机器人发送消息的电话号码。

遵循本指南，您已迈出了创建强大的 LLM 驱动聊天机器人的重要一步，该机器人可以与 WhatsApp 无缝协作。这不仅仅是关于实时设置自动化业务通信；这也是为未来更先进的 AI 驱动工作流奠定基础。

## 我们做了什么：

* **WhatsApp Cloud API 集成：**
我们成功启动了 Meta 的 WhatsApp 云 API，包括构建用于实时消息处理的 webhook。
* **使用 FastAPI 的后端开发：**
设置了端点以验证 webhooks、处理传入消息，并异步处理响应。
* **多媒体与身份验证支持：**
启用了音频转录和用户身份验证等功能，以实现更个性化的互动。图像处理尚未完全实现，但我们已添加了相关可能性。

## 接下来做什么：

在接下来的部分中，我承诺会尽快发布 🙏 我将把实现迁移到 LangGraph。我会为代理添加一些更多的功能，比如创建数据库表和工具。这将使代理更加灵活。我也欢迎反馈和关于添加哪些功能的想法！

## 总结：

将WhatsApp的覆盖范围和可用性与LLMs结合起来，对商业和个人使用案例来说是一个巨大的胜利。无论您是想要一个个人助手还是一个全面的商业工具，这份指南为您提供了到达目标的路径。继续尝试、改进和突破界限——这只是您可以构建的开始。

祝您编码愉快！ 🚀

您可以在这里找到完整的代码：[Github Repo](https://github.com/elokus/WhatsappAgent)

完整链接：<https://github.com/elokus/WhatsappAgent>

