---
title: "构建生产就绪的人工智能助理后台服务（Python）--第 2 部分"
meta_title: "构建生产就绪的人工智能助理后台服务（Python）--第 2 部分"
description: "本文介绍了使用 LangGraph 构建多代理 RAG 系统的步骤，重点在于为 AI 助手后端服务进行单元测试和应用程序构建。首先，验证了各个 API 端点的功能，包括生成会话 ID、处理用户问题和检索上下文。接着，讲解了如何使用 LangGraph 定义应用程序状态、节点和控制流，构建了一个简单的 RAG 应用程序。最后，展示了如何生成摘要并保存会话数据，为后续集成数据库奠定基础。"
date: 2024-12-22T04:22:12Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*7UMUG_wfjCA_seURYn_xIA.png"
categories: ["Programming", "Generative AI", "Chatbots"]
author: "Rifx.Online"
tags: ["Python", "RAG", "LangGraph", "endpoints", "vector"]
draft: False

---



— 使用 LangGraph 构建多代理 RAG 系统 \+ 用授权密钥头保护您的应用程序

\*免责声明 — *本文内容仅代表我个人观点，不代表我当前或过去雇主的立场。\**



在上一部分（[第 1 部分](https://readmedium.com/build-production-ready-ai-assistant-backend-service-in-python-part-1-9c7b2910eea3)）中，我们介绍了后端服务的基本知识，包括 API 和端点，并为一个专注于节能提示的 AI 助手的真实世界生成 AI 应用程序设置了初始代码库。

在本文中，我们将涵盖以下内容：

* 对所有端点进行单元测试，确保一切正常工作
* 逐步构建 RAG 应用程序的 LangGraph

让我们再次回顾后端端点工作流程。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*CJYdK0m-V0aaqTnRF70wJw.png)

我们需要验证所有端点是否按预期操作（即响应状态为 OK 200！）。

因此，在这里我们回顾每个端点：

> 如果您想开始使用 `LangGraph` 构建您的应用程序，请跳过此部分

### 测试端点

`/get_session_id`，此端点向用户的会话发送一个唯一的会话 ID。无需负载，以下请求示例会返回 200 响应：

```python
## Testing /get_session_id
import requests

main_url = "http://localhost:8000"
url = main_url + "/get_session_id"

headers = {
    "Content-Type": "application/json"
}

response = requests.post(url, headers=headers)

print(response.json())

#>>> {'session_id': '90e1d5c6-7203-4be6-9dca-ac5206079d41'}
```
请注意，此特定端点的 `headers` 可以是可选的。

`/ask`，此端点的负载需要一个 `body` 和一个 `parameter`。

```python
## Testing /ask
import requests

main_url = "http://localhost:8000"
url = main_url + "/ask"

params = {"session_id":"bcc6f0b8-f6b6-4aa6-9567-2f78b8fc07f1"}
request_body = {"message": "tell me more how I can save money on energy?"}

response = requests.post(url, params=params, json=request_body)

print(response.json())

#>>> {'message': 'Message received', 'session_id': 'bcc6f0b8-f6b6-4aa6-9567-2f78b8fc07f1'}
```
一个重要的注意事项是，在生产环境中，我们不在内存中存储消息！这是一个糟糕的设计！通常应使用预配置的数据库（结构化或半结构化）。我们将在本文的第 3 部分探讨生产选项。

`/retrieve_contexts` 我们可能不会在生产管道中使用此端点，但拥有该端点可以直接从向量存储中访问检索器以访问引用是有益的。

要测试此端点，我在 `app.py` 中添加了如下测试负载：

```python
## Inside app.py
sessions = {
    "000-000": {"messages": ["tell me something about energy saving"]}
}
```
这是此端点的请求负载示例：

```python
## Testing /retrieve_contexts
import requests

main_url = "http://localhost:8000"
url = main_url + "/retrieve_contexts"

params = {"session_id":"000-000"}
headers = {
    "Content-Type": "application/json"
}

response = requests.post(url, params=params, headers=headers)

print(response.json())

#>>> {'session_id': '000-000', 
##    'contexts': [{'id': 'f7d91b48-3fdd-40c1-bb2c-c5c5cb0aeddd', 
##    'metadata': {'source': 'https://en.wikipedia.org/wiki/Home_Energy_Saver', 'title': 'Home Energy Saver - Wikipedia', 'language': 'en'}, 'page_content': 'The Home Energy Saver website includes a section called LEARN which offers tips about energy savings, an explanation of the house-as-system energy efficiency approach, and other information to help people understand how energy is used in a home.', 'type': 'Document'}, {'id': '4c0a3ba6-a020-4fcf-8ca2-fd73703596e1', 'metadata': {'source': 'https://en.wikipedia.org/wiki/Home_Energy_Saver', 'title': 'Home Energy Saver - Wikipedia', 'language': 'en'}, 'page_content': 'Home Energy Saver is a set of on–line resources developed by the U.S. Department of Energy at the Lawrence Berkeley National Laboratory intended to help consumers and professional energy analysts, analyze, reduce, and manage home energy use.[1]', 'type': 'Document'}, {'id': 'ebc87da9-ea1f-4a53-af12-a1dc9265f828', 'metadata': {'source': 'ai-chatbot/data/pdfs/energy_savers.pdf', 'page': 3}, 'page_content': 'appliances, and renewable energy.\nFind even more information about \nsaving money and energy at home  \nby visiting energysavers.gov.\nTo learn more about U.S. Department \nof Energy (DOE) programs in energy \nefficiency and renewable energy,  \nvisit the Office of Energy Efficiency \nand Renewable Energy website at \neere.energy.gov.\nEnergySavers\n2', 'type': 'Document'}, {'id': '9424991e-e8fb-4b76-9757-c80e9bc53fd6', 'metadata': {'source': 'ai-chatbot/data/pdfs/energy_savers.pdf', 'page': 2}, 'page_content': 'such as solar and wind to save  \nenergy dollars while reducing \nenvironmental impact.\n37\nTransportation\nChoose efficient transportation \noptions and drive more efficiently  \nto save at the gas pump.\n39\nReferences\nUse our reference list to learn  \nmore about energy efficiency  \nand renewable energy.\n40\nEndnotes\nSee endnotes for individual \ncitations.\nContents\n1', 'type': 'Document'}], 'message_history': 'tell me something about energy saving'}
```
`/save_records` 是一个简单的 `POST` 方法，用于将结果存储到数据库中。如前所述，将数据存储在内存中是一个糟糕的设计，可能导致服务器中断和故障。

`/generate_summary` 需要进行修改以适应几个工作流程。每当用户发送请求时，服务器首先在向量存储中搜索与用户最后一个问题相关的信息，然后利用 LLM 生成上下文的摘要，最后将其存储在数据库中，并最终将响应作为响应对象返回给用户。

在展示此端点的负载示例之前，让我们使用 `LangGraph` 构建链。如果您不熟悉 `LangGraph`，请查看 [此链接](https://langchain-ai.github.io/langgraph/)。

## 使用 LangGraph 构建 RAG

LangGraph 是一个强大的工具，用于构建代理流和多代理工作流（了解更多关于 [langGraph](https://langchain-ai.github.io/langgraph/) 的信息）。如果您感兴趣，[您可以免费注册 LangChain 的课程](https://academy.langchain.com/courses/intro-to-langgraph)!

对于一个简单的 RAG 应用程序，工作流的状态是简单明了的。要使用 LangGraph，我们需要定义三件事：

1. 应用程序的状态；
2. 节点（即应用程序步骤）；
3. “控制流”（例如，步骤的顺序）。

### 状态

应用程序的 [state](https://langchain-ai.github.io/langgraph/concepts/low_level/#state) 控制输入到应用程序的数据、步骤之间传递的数据以及应用程序输出的数据。它通常是一个 `TypedDict`，但也可以是一个 [Pydantic BaseModel](https://langchain-ai.github.io/langgraph/how-tos/state-model/)。

对于一个简单的 RAG 应用程序，我们只需跟踪输入的问题、检索到的上下文和生成的答案：

```python
## chaing_config.py
##################

from langchain_core.documents import Document
from typing_extensions import List, TypedDict

class State(TypedDict):
    question: str
    context: List[Document]
    answer: str
```

### 节点（应用步骤）​

让我们从两个简单的步骤开始：检索和生成。


```python
## chain_config.py continued
###########################
from retrieval_config import get_vectorstore

async def retrieve(state: State):
    vector_store = await get_vectorstore()
    retrieved_docs = await vector_store.similarity_search(state["question"])
    return {"context": retrieved_docs}


def generate(state: State):
    docs_content = "\n\n".join(doc.page_content for doc in state["context"])
    messages = prompt.invoke({"question": state["question"], "context": docs_content})
    response = llm.invoke(messages)
    return {"answer": response.content}
```

### 控制流

最后，我们将我们的应用程序编译成一个单一的 `graph` 对象。在这种情况下，我们只是将检索和生成步骤连接成一个单一的序列。

```python
## chain_config.py continued
###########################

from langgraph.graph import START, StateGraph

graph_builder = StateGraph(State).add_sequence([retrieve, generate])
graph_builder.add_edge(START, "retrieve")
graph = graph_builder.compile()
```
LangGraph 还提供了内置的工具，用于可视化应用程序的控制流：

```python
## chain_config.py continued
###########################

from IPython.display import Image, display

## Get the image data
image_data = graph.get_graph().draw_mermaid_png()

## Save the image data to a file
with open("output.png", "wb") as f:
    f.write(image_data)

## Display the image
img = display(Image(image_data))
```
运行上述代码或替代方法应该提供以下流程：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*EgdGcJfu_XM8N6S9RxcWZw.png)

### 构建用于生成摘要的 LLM

我们使用本地 LLM `llama3.2:1b`，采用 Ollama 框架，并按如下方式设置 LLM：


```python
## chain_config.py

from langchain_ollama import OllamaLLM

llm = OllamaLLM(
    model="llama3.2:1b",
    temperature=0
)
```
为了简化，我使用 LangChain 的 hub 来拉取用于 `RAG` 应用的自定义提示。您可以使用 `PromptTemplate` 或 `ChatPromptTemplate` 库自定义构建自己的提示。

以下是 `chain_config.py` 的完整分解：


```python
## chain_config.py 
###########################

from langchain import hub
from langchain_core.documents import Document
from langchain_ollama import OllamaLLM
from langgraph.graph import START, StateGraph
from langchain_openai import ChatOpenAI
from retrieval_config import get_vectorstore
from typing_extensions import List, TypedDict


prompt = hub.pull("rlm/rag-prompt")

llm = OllamaLLM(
    model="llama3.2:1b",
    temperature=0
)
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
    '''
    此状态用于从向量存储中检索内容
    '''
    vector_store = await get_vectorstore()
    retrieved_docs = vector_store.similarity_search(state["question"])
    return {"context": retrieved_docs}

def generate(state: State):
    '''
    LLM 用于生成从检索到的上下文中提取的相关内容的摘要
    '''
    docs_content = "\n\n".join(doc.page_content for doc in state["context"])
    messages = prompt.invoke({"question": state["question"], "context": docs_content})
    response = llm.invoke(messages)
    return {"answer": response}

def get_graph():
    '''
    返回编译后的图构建对象作为 RAG 系统
    '''
    graph_builder = StateGraph(State).add_sequence([retrieve, generate])
    graph_builder.add_edge(START, "retrieve")
    graph = graph_builder.compile()
    return graph


## [可选] ##
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
以下是更新后的 `app.py`：


```python
from fastapi import FastAPI, HTTPException
from uuid import uuid4
import json

from schema import Message, SummaryRequest, SaveRequest
from vector_data_store import lookup_contexts
from chain_config import get_graph
app = FastAPI()

sessions = {
    "000-000": {"messages": ["告诉我一些关于节能的事情"]}
}
database = {}


def save_to_database(session_id: str, data: dict):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="会话未找到")
    try:
        database[session_id] = data
    except:
        raise HTTPException(status_code=500, detail="保存到数据库时发生错误")


## 端点
@app.post("/get_session_id")
def get_session_id():
    """生成一个新的会话 ID。"""
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
    message_history = sessions[session_id]["messages"][0]
    
    retrieved_contexts = await lookup_contexts(message_history)
    
    return {"session_id": session_id, "contexts": retrieved_contexts, "message_history": message_history}

@app.post("/generate_summary")
async def generate_summary(request: SummaryRequest):
    """根据检索到的上下文和消息历史生成摘要。"""
    # 模拟调用 OpenAI API 或其他语言模型
    if request.session_id not in sessions:
        raise HTTPException(status_code=404, detail="会话未找到")
    
    if len(request.message_history) == 0:
        raise HTTPException(status_code=400, detail="消息历史为空")
    
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
    """将会话摘要保存到数据库中。"""
    if request.session_id not in sessions:
        raise HTTPException(status_code=404, detail="会话未找到")
    
    # 将会话数据保存到模拟数据库中
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
现在我们已经有了 RAG 系统，是时候测试 `/generate_summary` 端点了。


```python
## 测试 /generate_summary
import requests

main_url = "http://localhost:8000"
url = main_url + "/generate_summary"

payload = {"session_id":"000-000",
           "message_history": ["告诉我更多如何节省能源开支？"]}

response = requests.post(url, json=payload)
print(response.json())
```
就这样！您现在拥有一个完全功能的后端服务，为专注于节能提示的 AI 助手提供服务！

请注意，您可能会收到如下警告：


```python
site-packages/langsmith/client.py:241: LangSmithMissingAPIKeyWarning: 使用托管的 LangSmith API 时必须提供 API 密钥
  warnings.warn(
```
这没关系，只要您不想在 LangSmith 仪表板中追踪 LangGraph。如果您想了解更多关于 `LangSmith` 的信息，请查看本教程：







到目前为止，应用服务在与您的 `localhost` 交互时运行良好。我不会止步于此，我想准确指导您如何继续前进 :）。

在下一部分（第 3 部分），我们希望更进一步，使用 `MongoDB` 实现一个实际的数据库，以存储我们的语义数据，并学习如何与 `向量数据存储` 进行通信并构建 `向量搜索索引`。

感谢您的参与，我们在下一部分见！

