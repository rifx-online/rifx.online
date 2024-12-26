---
title: "用 Python 构建可投入生产的人工智能助理后台服务 - 第 1 部分"
meta_title: "用 Python 构建可投入生产的人工智能助理后台服务 - 第 1 部分"
description: "本文介绍了如何使用Python构建生产就绪的AI助手后端服务。第一部分涵盖了后端服务的基础知识，包括API、端点、HTTP请求与响应、身份验证等概念。通过示例，读者可以学习如何使用FastAPI构建一个支持节能建议的AI聊天机器人后端服务，涉及会话管理、上下文检索和摘要生成等功能。此外，文章提供了相关的代码示例和GitHub代码库链接，便于读者实践和学习。"
date: 2024-12-26T04:30:18Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*M7eoP1eeyhX9AoPL0gbaiA.jpeg"
categories: ["Programming", "Technology/Web", "Chatbots"]
author: "Rifx.Online"
tags: ["Python", "FastAPI", "chatbot", "vector", "langchain"]
draft: False

---



— 学习构建生产就绪应用程序的最佳实践。

\*免责声明 — *本文中的内容仅代表我个人观点，不代表我当前或过去雇主的观点。\**



通过本综合教程的学习（请按照所有 4 个部分），您将能够使用以下架构中解释的框架开发后端服务：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*L35krFevN67Bukvj9Oo2rQ.png)

在本文的第 1 部分中，您将学习：

* 后端服务的基础知识和定义
* 运行一个简单的带有身份验证的 API 服务
* 构建一个专注于节能的 AI 助手的真实案例
* 开发一个包含抓取网页和 PDF 文档的文档向量存储
* 使用 FastAPI 构建后端应用程序的初始版本

[链接到代码库](https://github.com/Hadi2525/ai-chatbot-backend-service)。

您可以在此处查看 [文章的第 2 部分](https://readmedium.com/build-production-ready-ai-assistant-backend-service-in-python-part-2-a8d31f0c2dc3)。

> 如果您是后端服务的专家，可以跳过以下部分，直接进入 **生成型 AI 应用的后端服务**

## 后端服务简介

在深入后端服务的实际操作之前，对于那些可能不熟悉某些定义的人，我将探讨以下概念：

* Application programming interface (API)
* Endpoint
* Http requests / responses
* Payloads
* Http status codes
* Authentication

## APIs

软件应用程序的基础组件之一由至少一个API组成。顾名思义，API是一段编程代码，充当某个任务的接口。例如，在亚马逊网站的购买场景中，`order`是一个编程机制，当用户触发时，启动一个流程以满足产品的购买。API作为各种资源的中介接口，如下图所示。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*7-ugkOCRz1K2z1nLNqdYHA.gif?output=gif&n=50)

API方法主要有5种，其中3种在构建后端应用程序时非常常见：

* **GET** — 从服务器检索资源 \[**常见**]
* **POST** — 在服务器上创建资源 \[**常见**]
* **PUT** — 替换资源
* **PATCH** — 更新资源
* **DELETE** — 删除资源 \[**常见**]

在我们日常生活中，当访问一个网站（例如，[www.news.com](http://www.news.com)）时，浏览器向服务器发送请求以**GET**网站的内容，并将信息呈现为HTML\+CSS\+JavaScript，以便您可以在浏览器中查看精美的内容。打开浏览器的`console`（按F12）并转到`network`部分，自己查看HTTP请求也是一个好习惯。

您可以了解其他方法的工作原理，因此我建议查看[此页面](https://pieces.app/blog/practical-guide-api-methods)以获取更多信息。

调用API的典型方法是从操作系统的命令行使用`curl`。

示例：在您的CLI中运行以下命令并查看结果：

```python
curl -X GET "https://api.openweathermap.org/data/2.5/weather?id=5946768&appid=YOUR_API_KEY&units=metric"
```
这是一个著名的API网址，用于调用天气预报。确保在<https://openweathermap.org/>注册后，将`YOUR_API_KEY`替换为您的密钥。

## 端点

端点是一个唯一的 URL，代表特定类型的活动或 API。在 Shop 购买产品的例子中，`https://www.shop_test.com/order/productId=xyz` 代表 `order` API，用于提交 ID 为 `xyz` 的产品的购买。

## Http 请求 / 响应

作为与浏览器互动的客户端或用户，当寻找信息或网页时，他们发送一个 **Http 请求**，服务器接收请求并反过来以 **Http 响应** 进行回应。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*_1WncjxSiG1ttZKY93WJbQ.png)

要了解请求和响应的结构，我强烈建议下载并安装 [postman](https://www.postman.com/downloads/)。该应用程序具有友好的用户界面，可以帮助轻松进行 API 调用。

## Payload

这是在 http 请求或响应中传输的核心内容或基本数据。在大多数情况下，payload 结构为 JSON 或 XML 格式。payload 是后端工程师经常提到的一个术语！

## Http 状态码

这可能是任何使用互联网或访问网络信息的人的最常见场景之一。几乎每个请求都包含一个与响应数据一起返回的状态码。在这里，我将简要介绍一些最常用的状态码：

* *1xx 信息性响应* — 请求已接收，继续处理
* *2xx 成功* — 请求已成功接收、理解并接受
* *3xx 重定向* — 需要采取进一步的行动以完成请求
* *4xx 客户端错误* — 请求包含错误的语法或无法满足
* *5xx 服务器错误* — 服务器未能满足一个明显有效的请求

在这些代码中，以下几个非常流行：

* **200 OK —** 成功的 HTTP 请求的标准响应。
* **304 Not Modified —** 表示自指定版本的 [请求头](https://en.wikipedia.org/wiki/List_of_HTTP_header_fields#Request_Headers) 以来资源未被修改。
* **400 Bad Request —** 服务器无法或不愿处理请求，因为出现明显的客户端错误。
* **401 Unauthorized —** 类似于 403 Forbidden，但专门用于需要身份验证且身份验证失败的情况。
* **403 Forbidden —** 请求包含有效数据并被服务器理解，但服务器拒绝执行该操作。
* **404 Not Found —** 请求的资源未找到，但未来可能会可用。
* **500 Internal Server Error —** 一条通用错误消息，当遇到意外情况且没有更具体的消息适用时给出。
* **502 Bad Gateway —** 服务器充当 [网关](https://en.wikipedia.org/wiki/Gateway_(telecommunications)) 或代理，并从上游服务器接收到无效响应。
* **503 Service Unavailable** — 服务器无法处理请求（因为它超载或正在维护中）。
* **504 Gateway Timeout** — 服务器充当网关或代理，并未及时收到上游服务器的响应。

后端应用应清楚地处理每个端点，并根据需要提供尽可能多的状态码，以便为后端团队和客户提供高可观察性。

## 身份验证

这是保护重要资源免受未授权访问的最常见方法之一。访问权限是在成功的凭证请求后授予的。HTTP 身份验证内置于 HTTP 协议中，并利用特定的头部来促进身份验证过程。

服务器施加身份验证/授权以授予访问权限的方式有很多，这超出了本文的范围。

以下是发送包含用户名和密码的请求的基本语法：


```python
curl -u username:password URL
```
**示例：** 如果您的用户名是 `admin`，密码是 `secret`，并且您想要访问 `https://example.com/protected`，命令将是：


```python
curl -u admin:secret https://example.com/protected
```
当然，您可能不想泄露您的密码，因此更好的方法是仅发送用户名，请求服务器提示您输入密码。

另一种方法是从 `环境变量` 中检索密码。


```python
export CURL_PASSWORD='secret'
```
然后运行以下命令：


```python
curl -u admin:$CURL_PASSWORD https://example.com/protected
```
然后您应该能够从服务器获得如下响应：


```python
HTTP/1.1 200 OK
Content-Type: text/html

<!-- Protected content -->
```
现在，如果您想自己练习，可以考虑使用 [https://httpbin.org/](https://httpbin.org/#/) 的端点进行练习。这是一个可免费使用的服务，可以访问这些端点。

如果您运行以下命令：


```python
curl -i https://httpbin.org/basic-auth/user/pass
```
您将获得以下结果：


```python
HTTP/2 401 
date: Mon, 18 Nov 2024 17:45:19 GMT
content-length: 0
server: gunicorn/19.9.0
www-authenticate: Basic realm="Fake Realm"
access-control-allow-origin: *
access-control-allow-credentials: true
```
现在如果您运行：


```python
curl -i -u user:pass https://httpbin.org/basic-auth/user/pass
```
您将获得 200 响应！


```python
HTTP/2 200 
date: Mon, 18 Nov 2024 17:45:48 GMT
content-type: application/json
content-length: 47
server: gunicorn/19.9.0
access-control-allow-origin: *
access-control-allow-credentials: true

{
  "authenticated": true, 
  "user": "user"
}
```
此 API 设置为允许使用用户名：`user` 和密码：`pass` 的请求访问。练习起来非常简单。

这就是后端基础知识的总结。现在，让我们深入了解我们 AI 助手的后端服务！

## 用于生成 AI 应用的后端服务 — 示例

在这里，我们将解释如何构建一个生成式 AI 应用程序，配备一个符合强大软件应用预期标准的完整后端服务。如果您来自非软件工程背景并对创建生成式 AI 应用程序充满热情，这本指南特别有价值。

这是此部分的 GitHub 代码库：[https://github.com/Hadi2525/ai\-chatbot\-backend\-service](https://github.com/Hadi2525/ai-chatbot-backend-service)

请注意，上面的代码片段是第 1 部分的特定 `commit`。

让我们探索一个简单的基于 LLM 的生成式 AI 应用程序：

## 专注于节能提示和建议的AI聊天机器人

要求：

* 用户通过POST `/get_session_id`打开一个带有唯一 `session_id` 的新会话。
* 用户提出的每个问题都通过独立的端点 `/ask` 进行处理。
* 会话数据（消息历史）被解析后，通过 `/retrieve_contexts` 发送到向量存储（`mongodb, chromadb, 等`），然后检索到的上下文与消息历史一起传递给 `/generate_summary`，用于语言模型 `OpenAI API 等` 生成摘要响应。
* 在成功调用后，调用 `/save_records` 以跟踪会话并将其存储在数据库中。

以下是端点大致外观的示意图：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*CJYdK0m-V0aaqTnRF70wJw.png)

## 使用代码实现后端服务 (Python)

我将逐步解释这个 AI 聊天机器人的后端开发。

我使用以下库/依赖来开发后端：

1. `fastapi` 用于应用服务
2. `langchain` 用于构建检索增强生成 (RAG) 协调
3. `llama 3.2 1B` 我使用模型的本地版本。我还推送代码以使用 `openai` API，供那些有 API 访问权限的人使用。
4. `local database` 用于存储向量数据库
5. `mongodb database` 用于存储实际数据库，并结合语义搜索和缓存（免费！）在 [第 3 部分](https://readmedium.com/093ba216918e)
6. `docker` 用于构建 Docker 镜像以容器化后端应用服务

让我们首先使用 `fastapi` 初始化 `app`。

### 这里是要完成的任务分解

这是我项目的初始结构：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*luYx_T-aukTdM_WTJnM7GQ.png)

`schema.py` 收集应用程序中所需的所有 schema。基本上，所有的请求和响应必须遵循某种模式。以下是数据的初始 schema：

```python
## schema.py
###########

"""
所有数据模型都在这个库中定义。
"""

from typing import List, Dict, Optional
from pydantic import BaseModel


## 模型
class Message(BaseModel):
    message: str

class SessionData(BaseModel):
    session_id: str
    messages: List[str]

class SummaryRequest(BaseModel):
    session_id: str
    contexts: List[str]
    message_history: List[str]

class SaveRequest(BaseModel):
    session_id: str
    summary: str
```
[`Pydan`tic](https://docs.pydantic.dev/latest/) 用于方便地管理所需或期望的数据结构。

`vector store` 代码保存在单独的文件 `vector_data_store.py` 中。在系统设计方面，没有绝对的对错。我更倾向于为我的 `vector store` 创建一个单独的库，因为多个端点需要调用该功能。

最初，我用以下函数模拟了 vector store：

```python
## vector_data_store.py
######################

async def lookup_contexts(message):
    """
    用于从向量存储中查找上下文的函数。
    """
    retriever = await get_vectorstore()

    retrieved_contexts = retriever.similarity_search(message)
    return retrieved_contexts


## 使用以下指令测试函数的输出
## import asyncio

## message = "tell me something about the energy saving"
## retrieved = asyncio.run(lookup_contexts(message=message))
## print(retrieved)
```
\***注意**\* `lookup_contexts` 是一个 `异步函数`，因此需要异步处理。异步编程是另一个应该在单独内容中学习的概念。

最后是后端应用程序：

```python
## app.py
########

"""
使用 FastAPI 的后端应用服务
"""

from fastapi import FastAPI, HTTPException
from uuid import uuid4
import json

from schema import Message, SummaryRequest, SaveRequest
from vector_data_store import lookup_contexts
app = FastAPI()

sessions = {}
database = {}


def save_to_database(session_id: str, data: dict):
    database[session_id] = data

## 端点
@app.post("/get_session_id")
def get_session_id():
    """生成新的会话 ID。"""
    session_id = str(uuid4())
    sessions[session_id] = {"messages": []}
    return {"session_id": session_id}

@app.post("/ask")
def ask(session_id: str, message: Message):
    """处理用户问题。"""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="会话未找到")
    sessions[session_id]["messages"].append(message.message)
    return {"message": "消息已接收", "session_id": session_id}

@app.post("/retrieve_contexts")
async def retrieve_contexts(session_id: str):
    """从向量存储中检索上下文。"""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="会话未找到")
    message_history = sessions[session_id]["messages"]
    
    retrieved_contexts = await lookup_contexts(message_history)
    
    return {"session_id": session_id, "contexts": retrieved_contexts, "message_history": message_history}

@app.post("/generate_summary")
def generate_summary(request: SummaryRequest):
    """根据检索的上下文和消息历史生成摘要。"""
    # 模拟调用 OpenAI API 或其他语言模型
    summary = f"基于: {json.dumps(request.contexts)} 和 {json.dumps(request.message_history)} 的摘要"
    
    return {"session_id": request.session_id, "summary": summary}

@app.post("/save_records")
def save_records(request: SaveRequest):
    """将会话摘要保存到数据库。"""
    if request.session_id not in sessions:
        raise HTTPException(status_code=404, detail="会话未找到")
    
    # 将会话数据保存到模拟数据库
    save_to_database(request.session_id, {
        "messages": sessions[request.session_id]["messages"],
        "summary": request.summary
    })
    return {"message": "会话数据已保存", "session_id": request.session_id}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app:app",  
        host="0.0.0.0",  
        port=8000,
    )
```
FastAPI 的一个伟大特点是其内置的 Swagger UI，使得测试端点变得方便。在指定端口启动服务后，只需导航到主 URL 附加的 `/docs` 路径。例如，在浏览器中访问 `http://localhost:8000/docs` 将显示 Swagger UI，包含所有可用端点，便于交互和测试。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*S1DjUceC0iJBYd-2rzthjg.png)

在 FastAPI 应用服务完全开发后，我们将重点放在 `langchain` 配置上。

### 使用 langchain 构建 RAG

以下是使用 LangChain 构建 RAG 系统的构建模块分解：

* 安装所需的库： `langchain, langchain-community, langchain-ollama, beautifulsoup4, pypdf`


```python
pip install langchain langchain-community langchain-ollama beautifulsoup4 pypdf
```
* 在您的 [Mac/Linux 或 Windows](https://ollama.com/download) 上安装 `ollama`
* 从 CLI 使用 `ollama` 拉取嵌入模型：


```python
ollama pull nomic-embed-text
```
* 构建 `vectorstore`


```python
## retrieval_config.py
#####################


from langchain_community.document_loaders import WebBaseLoader, PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_ollama import OllamaEmbeddings
import json
import os
from dotenv import load_dotenv, find_dotenv

import asyncio
_ = load_dotenv(find_dotenv(),override=True)

FILE_PATH = os.getenv("URLs_JSON_FILE_PATH", "/ai-chatbot/data/energySavingUrls.json")
PDF_FOLDER_PATH = os.getenv("PDF_FOLDER_PATH", "/ai-chatbot/data/pdfs")
async def get_vectorstore():
    """
    Returns the vectorstore using InMemoryVectorStore
    """
    # Add web documents
    try:
        with open(FILE_PATH, "r") as file:
            urls_refs = json.load(file)
    except FileNotFoundError:
        raise Exception(f"File not found at: {FILE_PATH}")


    urls = urls_refs.get("energy_saving_resources", [])
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=20)
    documents = []
    for url in urls:
        try:
            loader = WebBaseLoader(url)
            data = loader.load()
            
            split_docs = text_splitter.split_documents(data)
            documents.extend(split_docs)
        except Exception as e:
            print(f"Failed to load URL {url}: {e}")

    # add pdf documents
    for file in os.listdir(PDF_FOLDER_PATH):
        pdf_file_path = os.path.join(PDF_FOLDER_PATH, file)
        pdf_loader = PyPDFLoader(pdf_file_path)
        pages = []
        async for page in pdf_loader.alazy_load():
            pages.append(page)
        split_pdf_docs = text_splitter.split_documents(pages)
        documents.extend(split_pdf_docs)

    


    local_embeddings = OllamaEmbeddings(model="nomic-embed-text")

    vectorstore = InMemoryVectorStore.from_documents(documents=documents, embedding=local_embeddings)
    return vectorstore


#### Uncomment if you want to test the retriever ###
## vectorstore = asyncio.run(get_vectorstore())

## q = "how can I do energy saving?"

## docs = vectorstore.similarity_search(q, k=10)

## for doc in docs:
##     print(doc)
```
到目前为止，您的后端服务已设置为返回一些模拟结果，并且您可以访问一个 `retriever`，它与来自 PDF 文件和网页的向量化内容进行通信。为了构建一个专门提供电费节能小贴士的聊天机器人，我们使用了各种网站和 PDF 文档。这些 `data` 暂时可在 GitHub 存储库中获取：

[https://github.com/Hadi2525/ai\-chatbot\-backend\-service/tree/main/ai\_chatbot/data](https://github.com/Hadi2525/ai-chatbot-backend-service/tree/main/ai_chatbot/data)

在 [第 2 部分](https://readmedium.com/build-production-ready-ai-assistant-backend-service-in-python-part-2-a8d31f0c2dc3) 中，您将学习如何：

* 使用 Python 库 `request` 测试所有端点
* 步骤分解构建 LangGraph 流以构建后端 RAG 系统
* 开发 LLM 服务（在本地使用 Ollama 或使用 OpenAI API）
* 在 `localhost` 上运行 ChatBot 后端

感谢您的参与，我们在 [第 2 部分](https://readmedium.com/build-production-ready-ai-assistant-backend-service-in-python-part-2-a8d31f0c2dc3) 再见！

