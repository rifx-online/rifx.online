---
title: "构建生产就绪的人工智能助理后台服务（Python）--第 3 部分"
meta_title: "构建生产就绪的人工智能助理后台服务（Python）--第 3 部分"
description: "本文介绍了如何构建一个生产就绪的AI助手后端服务，重点在于使用授权密钥保护应用程序和通过MongoDB数据库提升后端吞吐量。文章回顾了之前部分的内容，并详细讲解了如何实现API请求的身份验证、连接MongoDB、构建向量搜索索引、实现语义缓存等关键功能。通过这些步骤，确保了后端服务的安全性和效率，为AI聊天机器人提供了强大的支持。"
date: 2024-12-22T04:22:12Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*5B5nnxVMVbRPW2ip_ydFNw.png"
categories: ["Programming", "Technology", "Chatbots"]
author: "Rifx.Online"
tags: ["authentication", "MongoDB", "vector", "caching", "Python"]
draft: False

---



— 使用授权密钥保护您的应用程序 \+ 通过实际的 MongoDB 数据库和语义缓存能力提升后端吞吐量服务

\*免责声明 *— 本文中的内容仅代表我个人观点，与我当前或过去的雇主无关。\**



回顾一下在 [第一部分](https://readmedium.com/build-production-ready-ai-assistant-backend-service-in-python-part-1-9c7b2910eea3) 和 [第二部分](https://readmedium.com/build-production-ready-ai-assistant-backend-service-in-python-part-2-a8d31f0c2dc3) 中涵盖的内容：

* 后端服务的概念（API、端点、状态码、请求方法、有效载荷、认证） — 第一部分
* AI 聊天机器人需求收集的实际案例 — 第一部分
* 使用 FastAPI 构建应用程序 — 第一部分
* 使用 `Pydantic` 配置数据架构 — 第一部分
* 构建一个包含抓取的网页数据和 PDF 文档的检索向量存储 — 第一部分
* 端点的有效载荷和单元测试 — 第二部分
* 使用 LangGraph 开发一个代理检索增强生成（RAG） — 第二部分

本文涵盖了在 `Atlas MongoDB` 中开发实际数据库的下一步，并在云上构建向量存储。

第三部分包括以下概念：

* 为有效载荷的头部实现传入请求的认证
* 连接到 Atlas MongoDB 的实际数据库
* 构建管道以构建向量搜索索引并将向量数据推送到数据库
* 语义缓存能力以减少对 LLM 的冗余调用
* 重构代码以适应启用语义缓存的 RAG 应用程序

### /generate\_summary 的身份验证

为您的应用程序添加安全层是至关重要的，特别是当服务需要大量后端计算资源时。此外，保护您的端点免受恶意攻击或不良行为者的侵害也是必不可少的。

您可以为您的端点/应用程序添加身份验证的几种方法。OAuth2\.0 或 JWT 是大多数应用程序使用的两种常见方法。

来自 Google 的 [Firebase](https://firebase.google.com/docs/auth) 提供通过第三方服务（Gmail、Facebook、Apple、电子邮件等）实现身份验证服务的能力。

为了简化问题，我们通过在请求头中添加需要身份验证密钥的代码来修改端点。以下是更新后的 `app.py` 文件：

```python
## app.py
########

from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import APIKeyHeader
from uuid import uuid4
import json

from schema import Message, SummaryRequest, SaveRequest
from vector_data_store import lookup_contexts
from chain_config import get_graph
app = FastAPI()

sessions = {
    "000-000": {"messages": ["tell me something about energy saving"]}
}
database = {}

API_KEY_NAME = "Authorization"
api_key_header = APIKeyHeader(name=API_KEY_NAME)


VALID_API_KEYS = {"full-stack-ai-lab",
                  "secret-key",
                  "admin-key"}

def validate_api_key(api_key: str = Depends(api_key_header)):
    if api_key not in VALID_API_KEYS:
        raise HTTPException(status_code=403, detail="Invalid API Key")
    return api_key


def save_to_database(session_id: str, data: dict):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    try:
        database[session_id] = data
    except:
        raise HTTPException(status_code=500, detail="An error occured while saving to database")


## Endpoints
@app.post("/get_session_id")
def get_session_id():
    """Generate a new session ID."""
    session_id = str(uuid4())
    sessions[session_id] = {"messages": []}
    return {"session_id": session_id}

@app.post("/ask")
def ask(session_id: str, message: Message):
    """Handle user questions."""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    sessions[session_id]["messages"].append(message.message)
    return {"message": "Message received", "session_id": session_id}

@app.post("/retrieve_contexts")
async def retrieve_contexts(session_id: str):
    """Retrieve contexts from the vector store."""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    message_history = sessions[session_id]["messages"][0]
    
    retrieved_contexts = await lookup_contexts(message_history)
    
    return {"session_id": session_id, "contexts": retrieved_contexts, "message_history": message_history}

@app.post("/generate_summary")
async def generate_summary(request: SummaryRequest,
                           api_key: str = Depends(validate_api_key)):
    """Generate a summary based on retrieved contexts and message history."""
    # Simulate calling OpenAI API or another language model
    if request.session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if len(request.message_history) == 0:
        raise HTTPException(status_code=400, detail="Message history is empty")
    
    question = request.message_history[0]
    graph = get_graph()
    response = await graph.ainvoke({"question":question})
    contexts_dict = [doc.dict() for doc in response.get("context")]
    
    return {"session_id": request.session_id, 
            "summary": json.dumps(response.get('answer')), 
            "retrieved_contexts": contexts_dict,
            "question": question
            }

@app.post("/save_records")
def save_records(request: SaveRequest):
    """Save session summary in the database."""
    if request.session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Save the session's data to a mock database
    save_to_database(request.session_id, {
        "messages": sessions[request.session_id]["messages"],
        "summary": request.summary
    })
    return {"message": "Session data saved", "session_id": request.session_id}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app:app",  
        host="0.0.0.0",  
        port=8000,
    )
```
`Depends` 和 `APIKeyHeader` 是我们用来在头部实现身份验证的两个库。现在您的 `/generate_summary` 已经安全了 :).

要测试更新后的端点，可以考虑运行以下请求负载：

```python
import requests

main_url = "http://localhost:8000"
url = main_url + "/generate_summary"

headers = {
    "Authorization": "full-stack-ai-lab",
    "Content-Type": "application/json"
}

payload = {"session_id":"000-000",
           "message_history": ["tell me more how I can save money on energy?"]}

response = requests.post(url, json=payload, headers=headers)
print(response.json())
```
您可以从 post 方法输入中删除 `headers`，然后看到 `403 Forbidden` 错误！

### 在 Atlas MongoDB 中部署实际的向量数据库

我们已经成功开发了一个强大的后台系统，用于我们的能源专家聊天机器人，并通过 `authorization key` 确保安全性和身份验证到位。

在 [第一部分](https://readmedium.com/build-production-ready-ai-assistant-backend-service-in-python-part-1-9c7b2910eea3) 中，我们展示了如何使用 `InMemoryVectorStore` 构建一个 `retriever`，为了将我们的聊天机器人应用提升到一个新水平，我们需要考虑一个真正独立的数据库来存储数据。Atlas MongoDB 提供了一个完全免费的 `M0` 级别，并且有一些很不错的功能可以使用。

为了使用 `MongoDB` 开发我们的 `vectorstore`，我们必须重构我们的代码并向 [repository](https://github.com/Hadi2525/ai-chatbot-backend-service/tree/03cd3d222432a0ec0c8c2abe03942591e896d91a) 推送一个 `major` 更新。

以下是更新后的项目结构：

```python
.
├── README.md
├── ai_chatbot
│   ├── __init__.py
│   ├── app.py
│   ├── chain_config.py
│   ├── collection_config.py
│   ├── data
│   │   ├── energySavingUrls.json
│   │   └── pdfs
│   │       ├── Energy-Saving-Trust-Warm-Home-Hacks-guide-final.pdf
│   │       └── energy_savers.pdf
│   └── schema.py
├── graphFlow.png
├── project_tree.txt
├── requirements.txt
├── setup.py
└── tests
```
您可以通过 [repository](https://github.com/full-stack-ai/ai-chatbot-backend-service/tree/main/ai_chatbot/data) 访问 `data`。但是，我强烈建议将非结构化数据存储在安全的 `blob storage` 或 `bucket` 中，以确保您的访问安全。

以下是更新后的代码：

```python
### app.py
#########

import json
import os
from uuid import uuid4

from dotenv import find_dotenv, load_dotenv
from fastapi import Depends, FastAPI, HTTPException
from fastapi.security import APIKeyHeader
from pymongo import MongoClient
from schema import Message, SaveRequest, SummaryRequest

from ai_chatbot.chain_config import get_graph
from ai_chatbot.collection_config import get_query_results

load_dotenv(find_dotenv(), override=True)
CONN_STRING = os.getenv("CONN_STRING2")

app = FastAPI()
client = MongoClient(CONN_STRING)
db = client["ai_chatbot"]
chat_collection = db["chat_history"]

API_KEY_NAME = "Authorization"
api_key_header = APIKeyHeader(name=API_KEY_NAME)


VALID_API_KEYS = {"full-stack-ai-lab", "secret-key", "admin-key"}


def validate_api_key(api_key: str = Depends(api_key_header)):
    """验证 API 密钥。"""
    if api_key not in VALID_API_KEYS:
        raise HTTPException(status_code=403, detail="无效的 API 密钥")
    return api_key


def save_to_database(session_id: str, data: dict):
    """将会话数据保存到数据库。"""

    if not chat_collection.find_one({"session_id": session_id}):
        raise HTTPException(status_code=404, detail="未找到会话")
    try:
        chat_collection.update_one({"session_id": session_id}, {"$set": data})
    except:
        raise HTTPException(
            status_code=500, detail="保存到数据库时发生错误"
        )


## 端点
@app.post("/get_session_id")
def get_session_id():
    """生成新的会话 ID。"""
    session_id = str(uuid4())
    try:
        chat_collection.insert_one({"session_id": session_id, "message_history": []})
    except:
        raise HTTPException(
            status_code=500, detail="保存到数据库时发生错误"
        )
    return {"session_id": session_id}


@app.post("/ask")
def ask(session_id: str, message: Message):
    """处理用户问题。"""
    if not chat_collection.find_one({"session_id": session_id}):
        raise HTTPException(status_code=404, detail="未找到会话")
    try:
        chat_history = chat_collection.find_one({"session_id": session_id})[
            "message_history"
        ]
        chat_history.append({"message": message.message, "role": "user"})
        chat_collection.update_one(
            {"session_id": session_id}, {"$set": {"message_history": chat_history}}
        )
    except:
        raise HTTPException(
            status_code=500, detail="保存到数据库时发生错误"
        )
    return {"message": "消息已接收", "session_id": session_id}


@app.post("/retrieve_contexts")
def retrieve_contexts(message: str):
    """从向量存储中检索上下文。"""

    retrieved_contexts = get_query_results(message)

    return {"contexts": retrieved_contexts, "message_history": message}


@app.post("/generate_summary")
async def generate_summary(
    request: SummaryRequest, api_key: str = Depends(validate_api_key)
):
    """根据检索到的上下文和消息历史生成摘要。"""
    # 模拟调用 OpenAI API 或其他语言模型
    if not chat_collection.find_one({"session_id": request.session_id}):
        raise HTTPException(status_code=404, detail="未找到会话")

    if len(request.message_history) == 0:
        raise HTTPException(status_code=400, detail="消息历史为空")

    question = request.message_history[0]
    graph = get_graph()
    response = await graph.ainvoke({"question": question})
    contexts_dict = [doc.dict() for doc in response.get("context")]

    return {
        "session_id": request.session_id,
        "summary": json.dumps(response.get("answer")),
        "retrieved_contexts": contexts_dict,
        "question": question,
    }


@app.post("/save_records")
def save_records(request: SaveRequest):
    """将会话摘要保存到数据库。"""
    if not chat_collection.find_one({"session_id": request.session_id}):
        raise HTTPException(status_code=404, detail="未找到会话")

    message_history = chat_collection.find_one({"session_id": request.session_id})[
        "message_history"
    ]
    save_to_database(
        request.session_id, {"messages": message_history, "summary": request.summary}
    )
    return {"message": "会话数据已保存", "session_id": request.session_id}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
    )

```

```python
## chain_config.py
#################


from langchain import hub
from langchain_core.documents import Document
from langchain_ollama import OllamaLLM
from langchain_openai import ChatOpenAI
from langgraph.graph import START, StateGraph
from typing_extensions import List, TypedDict

from ai_chatbot.collection_config import get_query_results

prompt = hub.pull("rlm/rag-prompt")

llm = OllamaLLM(model="llama3.2:1b", temperature=0)
## import os
## from dotenv import load_dotenv, find_dotenv
## _ = load_dotenv(find_dotenv(),override=True)
## openai_api_key = os.getenv("OPENAI_API_KEY")
## llm = ChatOpenAI(
##     model="gpt-4o",
##     temperature=0,
##     max_tokens=None,

## )


class State(TypedDict):
    question: str
    context: List[Document]
    answer: str


async def retrieve(state: State):
    retrieved_docs = get_query_results(state["question"])
    return {"context": retrieved_docs}


def generate(state: State):
    docs_content = "\n\n".join(doc.page_content for doc in state["context"])
    messages = prompt.invoke({"question": state["question"], "context": docs_content})
    response = llm.invoke(messages)
    return {"answer": response}


def get_graph():
    graph_builder = StateGraph(State).add_sequence([retrieve, generate])
    graph_builder.add_edge(START, "retrieve")
    graph = graph_builder.compile()
    return graph


## from IPython.display import Image, display

## image_data = graph.get_graph().draw_mermaid_png()

## with open ("graphFlow.png", "wb") as f:
##     f.write(image_data)

#### 测试 LangGraph 管道 ###
## question = "告诉我一些关于节能的事情。"
## async def main():
##     result = await graph.ainvoke({"question": question})
##     print(result["answer"])

## import asyncio

## asyncio.run(main())
```

```python
## collection_config.py
## #####################

import json
import os
import time
from datetime import datetime
from typing import List
from uuid import uuid4

from dotenv import find_dotenv, load_dotenv
from langchain_community.document_loaders import PyPDFLoader, WebBaseLoader
from langchain_core.documents import Document
from langchain_ollama import OllamaEmbeddings
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from pymongo.mongo_client import MongoClient
from pymongo.operations import SearchIndexModel

_ = load_dotenv(find_dotenv(), override=True)

URL_JSON_FILE_PATH = os.getenv(
    "URLs_JSON_FILE_PATH", "/ai-chatbot/data/energySavingUrls.json"
)
PDF_FOLDER_PATH = os.getenv("PDF_FOLDER_PATH", "/ai-chatbot/data/pdfs")
CONN_STRING = os.getenv("CONN_STRING2")
OAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = MongoClient(CONN_STRING)
db = client["ai_chatbot"]
collection = db["data"]

model = "text-embedding-3-small"
embeddings = OpenAIEmbeddings(
    model=model, api_key=OAI_API_KEY
)  # OllamaEmbeddings(model="nomic-embed-text") #


def check_mongodb_connection(client: MongoClient):
    """
    检查 MongoDB 连接是否成功
    """

    # 发送 ping 确认连接成功
    try:
        client.admin.command("ping")
        print("成功连接到 MongoDB！")
    except Exception as e:
        print(e)


def index_pdf_contents(pdf_folder_path):
    """
    返回文件夹中 pdf 文件的文本块
    """
    try:
        for file in os.listdir(pdf_folder_path):
            pdf_file_path = os.path.join(pdf_folder_path, file)
            pdf_loader = PyPDFLoader(pdf_file_path)
            for i, page in enumerate(pdf_loader.lazy_load()):
                if len(page.page_content) == 0:
                    continue
                document = {
                    "id": str(uuid4()),
                    "chunk_number": i,
                    "timestamp": datetime.now(),
                    "text": page.page_content,
                    "source": str(file),
                    "vector_embeddings": embeddings.embed_documents(page.page_content)[
                        0
                    ],
                }
                collection.insert_one(document)
        return True
    except Exception as e:
        print(f"索引 PDF 内容失败: {e}")
        return False


def index_web_contents(urls_json_file_path):
    """
    返回来自网页文档的文本块
    """
    try:
        with open(urls_json_file_path, "r") as file:
            urls_refs = json.load(file)
    except FileNotFoundError:
        raise Exception(f"文件未找到: {urls_json_file_path}")

    urls = urls_refs.get("energy_saving_resources", [])
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=20)
    for url in urls:
        try:
            loader = WebBaseLoader(url)
            data = loader.load()
            split_docs = text_splitter.split_documents(data)
            for i, doc in enumerate(split_docs):
                document = {
                    "id": str(uuid4()),
                    "text": doc.page_content,
                    "chunk_number": i,
                    "source": str(url),
                    "timestamp": datetime.now(),
                    "vector_embeddings": embeddings.embed_documents(doc.page_content)[
                        0
                    ],
                }
                collection.insert_one(document)
            return True
        except Exception as e:
            print(f"加载 URL {url} 失败: {e}")
            return False


def format_results(results) -> List[Document]:
    """
    格式化 MongoDB 聚合管道的结果
    """
    contexts = []
    for result in results:
        id = result.pop("id")
        page_content = result.pop("text")
        document = Document(id=id, page_content=page_content, metadata=result)
        contexts.append(document)
    return contexts


## 定义一个函数来运行向量搜索查询
def get_query_results(query) -> List[Document]:
    """从向量搜索查询中获取结果。"""

    query_embedding = embeddings.embed_documents(query)[0]
    pipeline = [
        {
            "$vectorSearch": {
                "index": "vector_index",
                "queryVector": query_embedding,
                "path": "vector_embeddings",
                "exact": True,
                "limit": 10,
            }
        },
        {"$project": {"_id": 0, "vector_embeddings": 0, "timestamp": 0}},
    ]

    results = collection.aggregate(pipeline)
    contexts = format_results(results)

    return contexts


def setup_mongodb_vector_search_index():
    """
    为检索系统设置 MongoDB 集合
    """

    search_index_model = SearchIndexModel(
        definition={
            "fields": [
                {
                    "type": "vector",
                    "path": "vector_embeddings",
                    "numDimensions": 1536,
                    "similarity": "cosine",
                }
            ]
        },
        name="vector_index",
        type="vectorSearch",
    )

    result = collection.create_search_index(model=search_index_model)

    print("新搜索索引 " + result + " 正在构建。")
    # 等待初始同步完成
    print("轮询检查索引是否准备好。这可能需要一分钟。")
    predicate = None
    if predicate is None:
        predicate = lambda index: index.get("queryable") is True
    start_time = time.time()
    while True:
        indices = list(collection.list_search_indexes(result))
        if len(indices) and predicate(indices[0]):
            break
        if time.time() - start_time > 70:
            print("构建搜索索引过程失败：超时，超过 1 分钟。")
            return False
        time.sleep(5)
    print(result + " 已准备好进行查询。")
    return True
```
端点测试稍有不同，我将留给您自己去弄清楚如何测试这些端点。

在下一步中，我们在后端实现一个 `semantic caching` 功能，以提高吞吐量。

### 将语义缓存添加到具有 Atlas MongoDB 的生成 AI 聊天机器人助手

语义缓存通过基于查询的上下文含义存储响应，从而增强 LLM 应用程序的性能，而不是像传统缓存方法那样依赖于精确的关键字匹配。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*auz2yYKE_1CNKGT2AMUlDQ.png)

使用 `langchain-mongodb` 包，只需简单的插拔即可轻松在应用程序中实现缓存。如果您对 `LangChain` 中的 `caching` 功能不熟悉，我建议您访问 [`llm cach`ing](https://python.langchain.com/docs/how_to/llm_caching/) 并了解其功能。

只需向 `chain_config.py` 添加一个小函数，我们就可以在 `MongoDB` 数据库上设置缓存。

以下是更新后的文件：

```python
## chain_config.py
#################

import os

from dotenv import find_dotenv, load_dotenv
from langchain import hub
from langchain_core.documents import Document
from langchain_core.globals import set_llm_cache
from langchain_mongodb.cache import MongoDBAtlasSemanticCache
from langchain_ollama import OllamaLLM
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langgraph.graph import START, StateGraph
from typing_extensions import List, TypedDict

from ai_chatbot.collection_config import get_query_results

OAI_API_KEY = os.getenv("OPENAI_API_KEY")
CONN_STRING = os.getenv("CONN_STRING2")
DATABASE_NAME = "ai_chatbot"
COLLECTION_NAME = "semantic_cache"
INDEX_NAME = "vector_embeddings"
_ = load_dotenv(find_dotenv(), override=True)
model = "text-embedding-3-small"

prompt = hub.pull("rlm/rag-prompt")

llm = OllamaLLM(model="llama3.2:1b", temperature=0)
## import os
## from dotenv import load_dotenv, find_dotenv
## _ = load_dotenv(find_dotenv(),override=True)
## openai_api_key = os.getenv("OPENAI_API_KEY")
## llm = ChatOpenAI(
##     model="gpt-4o",
##     temperature=0,
##     max_tokens=None,

## )


class State(TypedDict):
    question: str
    context: List[Document]
    answer: str


def retrieve(state: State):
    retrieved_docs = get_query_results(state["question"])
    return {"context": retrieved_docs}


def generate(state: State):
    docs_content = "\n\n".join(doc.page_content for doc in state["context"])
    messages = prompt.invoke({"question": state["question"], "context": docs_content})
    response = llm.invoke(messages)
    return {"answer": response}


def get_graph():
    graph_builder = StateGraph(State).add_sequence([retrieve, generate])
    graph_builder.add_edge(START, "retrieve")
    setup_semantic_cache()
    graph = graph_builder.compile()
    return graph


def setup_semantic_cache():
    try:
        embeddings = OpenAIEmbeddings(
        model=model, api_key=OAI_API_KEY
        )

        set_llm_cache(
            MongoDBAtlasSemanticCache(
                connection_string=CONN_STRING,
                database_name=DATABASE_NAME,
                collection_name=COLLECTION_NAME,
                embedding=embeddings,
                index_name=INDEX_NAME,
                score_threshold=0.95
            )
        )
        return True
    except Exception as e:
        print(e)
        return False
```
要使此实现正常工作，您需要设置数据库 `ai_chatbot`，您必须在上一部分中已经完成此操作，以及在该数据库下的 `semantic_cache` 集合。

要测试此功能，请考虑运行以下测试：

```python
## Test for Semantic Caching

from ai_chatbot.chain_config import get_graph

lc_graph = get_graph()

question = "我该怎么做才能省钱？"
res = lc_graph.invoke({"question": question})

print(res.get("answer"))
```
如果您运行测试两次，或者询问类似 `告诉我如何省钱` 的问题，那么您应该能够看到更快的响应。

这就是这一部分的内容！到目前为止，我们已经成功连接到具有语义缓存的数据库，并且使用 `Authorization Header Key`，我们的后端端点是安全的 :).

在下一部分中，我们准备打包应用程序以构建 `Docker` 容器，并使其准备好生产环境！

下次见！

