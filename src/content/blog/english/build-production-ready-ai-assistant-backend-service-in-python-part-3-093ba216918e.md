---
title: "Build Production Ready AI Assistant Backend Service (in Python) — Part 3"
meta_title: "Build Production Ready AI Assistant Backend Service (in Python) — Part 3"
description: "This article is the third part of a series focused on developing a production-ready AI assistant backend service using Python. It covers implementing authentication for incoming requests, connecting to an Atlas MongoDB database, constructing a vector search index, and adding semantic caching capabilities to enhance performance. The article emphasizes the importance of securing endpoints with authentication keys and outlines the necessary code modifications to achieve this. Additionally, it discusses the integration of a MongoDB database to store session data and improve the chatbots functionality. The final section introduces semantic caching to optimize response times based on contextual queries."
date: 2024-12-22T04:22:12Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*5B5nnxVMVbRPW2ip_ydFNw.png"
categories: ["Programming", "Technology", "Chatbots"]
author: "Rifx.Online"
tags: ["authentication", "MongoDB", "vector", "caching", "Python"]
draft: False

---




— Secure Your App with Authorization Key \+ Boost your Backend Throughput Service with Actual MongoDB Database and Semantic Caching Capability

\*Disclosure *— the contents in this article are my own, and represent no one but myself and not those of my current or past employers.\**



A recap on what has been covered in [part I](https://readmedium.com/build-production-ready-ai-assistant-backend-service-in-python-part-1-9c7b2910eea3) and [part II](https://readmedium.com/build-production-ready-ai-assistant-backend-service-in-python-part-2-a8d31f0c2dc3):

* Concept of backend services (API, endpoints, status codes, request methods, payload, authentication) — Part I
* Real world example of an AI chatbot requirement gathering — Part I
* Build the application with FastAPI — Part I
* Use `Pydantic` to configure a data schema — Part I
* Build a retriever vector store that contains scraped web data \+ PDF documents — Part I
* Payload and unit testing of endpoints — Part II
* Develop an agentic retrieval augmented generation (RAG) using LangGraph — Part II

This article covers the next steps for developing an actual database in `Atlas MongoDB` and build a vector store on the cloud.

Part 3 includes the following concepts:

* Implement authentication for incoming requests on the payload’s header
* Connect to an actual database from Atlas MongoDB
* Construct the pipeline to build the vector search index and push vector data to the database
* Semantic caching capability to reduce redundant calls to the LLM
* Refactoring the code to accommodate a semantic caching enabled RAG application


### Authentication for /generate\_summary

Adding a security layer to your application is crucial, particularly when the service demands substantial backend computational resources. Moreover, it’s essential to protect your endpoint from malicious attacks or bad actors.

There are several approaches that you can add authentication to your endpoint/application. OAuth2\.0 or JWT are the two common methods that most applications use.

[Firebase](https://firebase.google.com/docs/auth) from Google provides the capability to implement an authentication service through 3rd party services (Gmail, Facebook, Apple, Email etc.).

To simplify matters, we modify the endpoint by adding code that requires an authentication key in the request header. Here is the updated `app.py` file:


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
`Depends` and `APIKeyHeader` are the two libraries we use to accommodate authentication in the header. Now your `/generate_summary` is secured :).

To test the updated endpoint, consider running the following request payload:


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
You can remove the `headers` from the post method input and see the `403 Forbidden` error!


### Deploy Actual Vector Database in Atlas MongoDB

We have successfully developed a robust backend for our energy specialist chatbot and secured it with an `authorization key` to ensure security and authentication is in place.

In [part I](https://readmedium.com/build-production-ready-ai-assistant-backend-service-in-python-part-1-9c7b2910eea3), we showed how to build a `retriever` using `InMemoryVectorStore` and to take our chatbot app to the next level, we need to consider a real independent database to store the data. Atlas MongoDB has a `M0` tier that is completely free and has some nice feature to work with.

To develop our `vectorstore` using `MongoDB`, we have to refactor our code and push a `major` update to the [repository](https://github.com/Hadi2525/ai-chatbot-backend-service/tree/03cd3d222432a0ec0c8c2abe03942591e896d91a).

Here is the updated project structure:


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
You can access the `data` through the [repository](https://github.com/full-stack-ai/ai-chatbot-backend-service/tree/main/ai_chatbot/data). However, I highly recommend to store unstructured data inside a `blob storage` or a `bucket` that is secure for your access.

Here are the updated codes:


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
    """Validate the API key."""
    if api_key not in VALID_API_KEYS:
        raise HTTPException(status_code=403, detail="Invalid API Key")
    return api_key


def save_to_database(session_id: str, data: dict):
    """Save the session data to the database."""

    if not chat_collection.find_one({"session_id": session_id}):
        raise HTTPException(status_code=404, detail="Session not found")
    try:
        chat_collection.update_one({"session_id": session_id}, {"$set": data})
    except:
        raise HTTPException(
            status_code=500, detail="An error occured while saving to database"
        )


## Endpoints
@app.post("/get_session_id")
def get_session_id():
    """Generate a new session ID."""
    session_id = str(uuid4())
    try:
        chat_collection.insert_one({"session_id": session_id, "message_history": []})
    except:
        raise HTTPException(
            status_code=500, detail="An error occured while saving to database"
        )
    return {"session_id": session_id}


@app.post("/ask")
def ask(session_id: str, message: Message):
    """Handle user questions."""
    if not chat_collection.find_one({"session_id": session_id}):
        raise HTTPException(status_code=404, detail="Session not found")
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
            status_code=500, detail="An error occured while saving to database"
        )
    return {"message": "Message received", "session_id": session_id}


@app.post("/retrieve_contexts")
def retrieve_contexts(message: str):
    """Retrieve contexts from the vector store."""

    retrieved_contexts = get_query_results(message)

    return {"contexts": retrieved_contexts, "message_history": message}


@app.post("/generate_summary")
async def generate_summary(
    request: SummaryRequest, api_key: str = Depends(validate_api_key)
):
    """Generate a summary based on retrieved contexts and message history."""
    # Simulate calling OpenAI API or another language model
    if not chat_collection.find_one({"session_id": request.session_id}):
        raise HTTPException(status_code=404, detail="Session not found")

    if len(request.message_history) == 0:
        raise HTTPException(status_code=400, detail="Message history is empty")

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
    """Save session summary in the database."""
    if not chat_collection.find_one({"session_id": request.session_id}):
        raise HTTPException(status_code=404, detail="Session not found")

    message_history = chat_collection.find_one({"session_id": request.session_id})[
        "message_history"
    ]
    save_to_database(
        request.session_id, {"messages": message_history, "summary": request.summary}
    )
    return {"message": "Session data saved", "session_id": request.session_id}


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

#### Testing the LangGraph pipeline ###
## question = "Tell me something about energy saving."
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
    Checks if the MongoDB connection is successful
    """

    # Send a ping to confirm a successful connection
    try:
        client.admin.command("ping")
        print("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        print(e)


def index_pdf_contents(pdf_folder_path):
    """
    Returns the text chunks from the pdf files in the folder
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
        print(f"Failed to index PDF contents: {e}")
        return False


def index_web_contents(urls_json_file_path):
    """
    Returns the text chunks from the web documents
    """
    try:
        with open(urls_json_file_path, "r") as file:
            urls_refs = json.load(file)
    except FileNotFoundError:
        raise Exception(f"File not found at: {urls_json_file_path}")

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
            print(f"Failed to load URL {url}: {e}")
            return False


def format_results(results) -> List[Document]:
    """
    Formats the results of a MongoDB aggregation pipeline
    """
    contexts = []
    for result in results:
        id = result.pop("id")
        page_content = result.pop("text")
        document = Document(id=id, page_content=page_content, metadata=result)
        contexts.append(document)
    return contexts


## Define a function to run vector search queries
def get_query_results(query) -> List[Document]:
    """Gets results from a vector search query."""

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
    Sets up the MongoDB collection for the retrieval system
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

    print("New search index named " + result + " is building.")
    # Wait for initial sync to complete
    print("Polling to check if the index is ready. This may take up to a minute.")
    predicate = None
    if predicate is None:
        predicate = lambda index: index.get("queryable") is True
    start_time = time.time()
    while True:
        indices = list(collection.list_search_indexes(result))
        if len(indices) and predicate(indices[0]):
            break
        if time.time() - start_time > 70:
            print("Building search index process failed: Timeout after 1 minute.")
            return False
        time.sleep(5)
    print(result + " is ready for querying.")
    return True
```
The endpoint tests are slightly different and I leave it up to you to figure out how to test the endpoints.

In the next step, we implement a `semantic caching` capability to our backend to improve the throughput.


### Add Semantic Caching to the Generative AI ChatBot assistant with Atlas MongoDB

A semantic cache enhances the performance of LLM applications by storing responses based on the contextual meaning of queries, rather than relying on exact keyword matches like traditional caching methods.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*auz2yYKE_1CNKGT2AMUlDQ.png)

Using the `langchain-mongodb` package, it is just a plug\-and\-play to easily implement caching into your application. If you are new to `caching` capability in `LangChain`, I recommend visit [`llm cach`ing](https://python.langchain.com/docs/how_to/llm_caching/) and learn its capabilities.

With just adding a small function to `chain_config.py` we can set up caching on our `MongoDB` database.

Here is the updated file:


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
For this implementation to work, you need to have setup the database `ai_chatbot` which you must have already done in the previous section and also the `semantic_cache` collection under this database.

To test this capability, consider running the following test:


```python
## Test for Semantic Caching

from ai_chatbot.chain_config import get_graph

lc_graph = get_graph()

question = "what should I do to save money on my bills?"
res = lc_graph.invoke({"question": question})

print(res.get("answer"))
```
If you either run the test twice, or ask something similar like `Tell me how to save money on bills` then you should be able to see a faster response.

That’s it for this part! So far, we have a successful connection to the database with semantic caching and using the `Authorization Header Key`, our backend endpoint is secured :).

In the next part, we prepare our packaged application to build a `Docker` container and make it production ready!

See you in the next part!


