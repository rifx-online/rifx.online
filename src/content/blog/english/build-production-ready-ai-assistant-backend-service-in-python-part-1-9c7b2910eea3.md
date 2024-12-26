---
title: "Build Production Ready AI Assistant Backend Service (in Python) — Part 1"
meta_title: "Build Production Ready AI Assistant Backend Service (in Python) — Part 1"
description: "This article outlines the first part of a tutorial series on building a production-ready AI assistant backend service using Python and FastAPI. It covers essential backend concepts, including APIs, endpoints, HTTP requests/responses, payloads, status codes, and authentication. The tutorial guides readers through creating a backend service for an AI chatbot focused on energy-saving tips, detailing the implementation of endpoints for session management and context retrieval. Additionally, it introduces the use of vector stores and the integration of libraries such as langchain and FastAPI for effective application development."
date: 2024-12-26T04:30:18Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*M7eoP1eeyhX9AoPL0gbaiA.jpeg"
categories: ["Programming", "Technology/Web", "Chatbots"]
author: "Rifx.Online"
tags: ["Python", "FastAPI", "chatbot", "vector", "langchain"]
draft: False

---




— Learn the best practices for building production\-ready applications.

\*Disclosure — *the contents in this article are my own, and represent no one but myself and not those of my current or past employers.\**



By the end of this comprehensive tutorial (follow all 4 parts), you will be able to develop a backend service with the frameworks explained in the following architecture:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*L35krFevN67Bukvj9Oo2rQ.png)

In Part 1 of this article, you learn:

* Basics and definitions of backend services
* Run a simple api service with authentication
* Build a real world example of an AI assistant specialized in Energy Saving
* Develop a vector store with documents of scraped web pages and pdf documents
* Build the initial version of the backend application with FastAPI

[Link to the Repository Code](https://github.com/Hadi2525/ai-chatbot-backend-service).

You can follow the [part 2 of the article here](https://readmedium.com/build-production-ready-ai-assistant-backend-service-in-python-part-2-a8d31f0c2dc3).


> Feel free to skip the following part if you are an expert in backend services and go directly to the **Backend Service for Generative AI Apps**


## A Touch on Backend Services

Before diving into the actual practice for the backend service, for those of you who may not be familiar with certain definitions, I will explore the following concepts:

* Application programming interface (API)
* Endpoint
* Http requests / responses
* Payloads
* Http status codes
* Authentication


## APIs

One of the foundational components of software applications is comprised of at least one API. As it comes from the name, an API is a piece of programming code that acts as an interface for a certain task. For instance, in a purchase scenario from amazon website,`order` is a programming mechanism that when triggered by the user, initiates a process to accommodate the purchase of a product. API works as an intermediate interface of various resource as you can see in the following image.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*7-ugkOCRz1K2z1nLNqdYHA.gif?output=gif&n=50)

There are 5 main types of API methods and 3 of these methods are very common in building backend applications:

* **GET** — Retrieve a resource from server \[**common**]
* **POST** — Create a resource on the server \[**common**]
* **PUT** — Replace a resource
* **PATCH** — Update a resource
* **DELETE** — Delete a resource \[**common**]

In our daily routine, when visiting a website (e.g, [www.news.com)](http://www.news.com)) the browser sends a request to the server to **GET** the content of the website and renders the information as HTML\+CSS\+JavaScript so you can view a polished content on your browser. It is also a good practice to open the `console` of your browser (hit F12\) and go to the `network` section and view the http requests yourself.

You get the picture how the other methods work and so I recommend to view [this page](https://pieces.app/blog/practical-guide-api-methods) for further information.

A typical approach to call an API is to use `curl` from command line of your operating system.

Example: run the following from your CLI and see the results:


```python
curl -X GET "https://api.openweathermap.org/data/2.5/weather?id=5946768&appid=YOUR_API_KEY&units=metric"
```
This is a well\-known API url for calling for weather forecasts. Make sure to replace `YOUR_API_KEY` with your key once you sign up at <https://openweathermap.org/>.


## Endpoint

An endpoint is an unique URL that represents a specific type of activity or API. In the example of purchasing a product on Shop, `https://www.shop_test.com/order/productId=xyz` represents the `order` API to submit the purchase for a product with ID `xyz`.


## Http Request / Response

As a client or user who interacts with a browser, when looking for information or web page, they send a **Http Request**, and the server receives the request and in turn, responds with a **Http Response**.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*_1WncjxSiG1ttZKY93WJbQ.png)

To learn more about the structure of requests and responses, I highly recommend to download and install [postman](https://www.postman.com/downloads/). This application has a friendly UI that helps with easy ways to communicate with API calls.


## Payload

This is the core content or the essential data that is being transferred in a http request or response. In majority of cases, a payload is structured as a JSON or XML format. Payload is one of those expression you may hear from backend engineers a lot!


## Http Status Codes

This is likely one of the most common scenarios for anyone who uses the internet or accesses information on the web. Almost every request includes a status code that is returned along with the response data. Here, I’ll briefly cover some of the most widely used status codes:

* *1xx informational response* — the request was received, continuing process
* *2xx successful* — the request was successfully received, understood, and accepted
* *3xx redirection* — further action needs to be taken in order to complete the request
* *4xx client error* — the request contains bad syntax or cannot be fulfilled
* *5xx server error* — the server failed to fulfil an apparently valid request

Among these codes, the followings are very popular:

* **200 OK —** Standard response for successful HTTP requests.
* **304 Not Modified —** Indicates that the resource has not been modified since the version specified by the [request headers](https://en.wikipedia.org/wiki/List_of_HTTP_header_fields#Request_Headers) If\-Modified\-Since or If\-None\-Match.
* **400 Bad Request —** The server cannot or will not process the request due to an apparent client error
* **401 Unauthorized —** Similar to 403 Forbidden, but specifically for use when authentication is required and has failed
* **403 Forbidden —** The request contained valid data and was understood by the server, but the server is refusing action.
* **404 Not Found —** The requested resource could not be found but may be available in the future.
* **500 Internal Server Error —** A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.
* **502 Bad Gateway —** The server was acting as a [gateway](https://en.wikipedia.org/wiki/Gateway_(telecommunications)) or proxy and received an invalid response from the upstream server.
* **503 Service Unavailable** — The server cannot handle the request (because it is overloaded or down for maintenance).
* **504 Gateway Timeout** — The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.

The backend app should clearly address every endpoint with as much status codes as needed to provide a high observability for the backend team and the clients as well.


## Authentication

This is one of the most common method to protect the essential resource from unwanted access. The access is granted upon a successful credential request. HTTP authentication is built into the HTTP protocol and utilizes specific headers to facilitate the authentication process.

There are various ways to impose an authentication/authorization granting access by the server which is outside the scope of this article.

Here is a basic syntax of sending a request with username and password:


```python
curl -u username:password URL
```
**Example:** If your username is `admin` and your password is `secret`, and you want to access `https://example.com/protected`, the command would be:


```python
curl -u admin:secret https://example.com/protected
```
Of course you may not want to reveal your password and so the better approach is to send the request with only the username and the server prompts you to put the password.

Another method is to retrieve the password from `environment variables` .


```python
export CURL_PASSWORD='secret'
```
and then run the following command:


```python
curl -u admin:$CURL_PASSWORD https://example.com/protected
```
Then you should be able to get a response from the server like the following:


```python
HTTP/1.1 200 OK
Content-Type: text/html

<!-- Protected content -->
```
Now if you want to practice for yourself, consider playing with endpoints from [https://httpbin.org/](https://httpbin.org/#/). This is a free available service to hit the endpoints.

If you run the following:


```python
curl -i https://httpbin.org/basic-auth/user/pass
```
You’ll get the following result:


```python
HTTP/2 401 
date: Mon, 18 Nov 2024 17:45:19 GMT
content-length: 0
server: gunicorn/19.9.0
www-authenticate: Basic realm="Fake Realm"
access-control-allow-origin: *
access-control-allow-credentials: true
```
Now if you run:


```python
curl -i -u user:pass https://httpbin.org/basic-auth/user/pass
```
You’ll get a 200 response!


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
This API is set up to grant access to requests with username: `user` and password: `pass` . It’s very easy to practice.

That wraps up the fundamentals of backends. Now, let’s dive into the backend service for our AI assistant!


## Backend Service for Gen AI Apps — with Example

Here, we’ll explain how to build a Generative AI application with a fully developed backend service that meets the expected standards of a robust software application. This guide is especially valuable if you come from a non\-software engineering background and are passionate about creating Generative AI applications.

Here is the GitHub Code Repository for this part:[https://github.com/Hadi2525/ai\-chatbot\-backend\-service](https://github.com/Hadi2525/ai-chatbot-backend-service)

Note that the above code snippet is the particular `commit` for part 1\.

Let’s explore a simple LLM\-based Generative AI application:


## AI Chatbot Specialized in Energy Saving Tips and Recommendations

Requirements:

* User opens a new session with a unique `session_id` using a POST `/get_session_id`.
* Every question the user asks is handled using an independent endpoint `/ask` .
* The session data (message history) is parsed to be sent to the vector store (`mongodb, chromadb, etc.`) with `/retrieve_contexts` then the retrieved contexts along with the message history are passed to the `/generate_summary` for the language model `OpenAI API etc.`to generate the summary response.
* Upon successful calls, call `/save_records` to keep track of the session and store it in the database.

Here is a general picture of how the endpoints look like:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*CJYdK0m-V0aaqTnRF70wJw.png)


## Backend Service Implementation with code (Python)

I explain step by step the development of the backend for this AI chatbot.

I use the following libraries/dependencies to develop the backend:

1. `fastapi` for the application service
2. `langchain` to build the retrieval augmented generation (RAG) orchestration
3. `llama 3.2 1B` I use the local version of the model. I also push the code to use the `openai` API for those who have access to the API.
4. `local database` to store the vector database
5. `mongodb database` to store on the actual database along with semantic search and caching (free!) in [part 3](https://readmedium.com/093ba216918e)
6. `docker` to build the docker image for containerizing the backend app service

Let’s first initialize the `app` with `fastapi` .


### Here is a breakdown of what to accomplish

Here is the initial structure of my project:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*luYx_T-aukTdM_WTJnM7GQ.png)

`schema.py` collects all the schema that are required throughout the app. Basically, all the request and response must follow some pattern. Here is the initial schema for the data:


```python
## schema.py
###########

"""
All data models are defined in this library.
"""

from typing import List, Dict, Optional
from pydantic import BaseModel


## Models
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
[`Pydan`tic](https://docs.pydantic.dev/latest/) is used to make it easy to manage the structure of the data expected or required.

`vector store` code is saved in a separate file `vector_data_store.py`. There is no right or wrong approach when it comes to system design for the development. I prefer to have a separate library for my `vector store` as multiple endpoints need to call the function.

Initially, I mock the vector store with the following function:


```python
## vector_data_store.py
######################

async def lookup_contexts(message):
    """
    function is used to lookup contexts from the vector store.
    """
    retriever = await get_vectorstore()

    retrieved_contexts = retriever.similarity_search(message)
    return retrieved_contexts


## Use the following instructions to test the output of the function
## import asyncio

## message = "tell me something about the energy saving"
## retrieved = asyncio.run(lookup_contexts(message=message))
## print(retrieved)
```
\***Note**\* `lookup_contexts` is an `asynchronous function` and so needs to be handled asynchronously. Async programming is another concept that should be studied in a separate content.

And finally the backend application:


```python
## app.py
########

"""
The backend app service with FastAPI
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
    message_history = sessions[session_id]["messages"]
    
    retrieved_contexts = await lookup_contexts(message_history)
    
    return {"session_id": session_id, "contexts": retrieved_contexts, "message_history": message_history}

@app.post("/generate_summary")
def generate_summary(request: SummaryRequest):
    """Generate a summary based on retrieved contexts and message history."""
    # Simulate calling OpenAI API or another language model
    summary = f"Summary based on: {json.dumps(request.contexts)} and {json.dumps(request.message_history)}"
    
    return {"session_id": request.session_id, "summary": summary}

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
One of the great features of FastAPI is its built\-in Swagger UI, which makes testing endpoints convenient. After starting the service on a specified port, simply navigate to the `/docs` path appended to the main URL. For example, visiting `http://localhost:8000/docs` in your browser will display the Swagger UI, complete with all available endpoints for easy interaction and testing.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*S1DjUceC0iJBYd-2rzthjg.png)

After the FastAPI app service is completely developed, we focus on the `langchain` configuration.


### Building a RAG with langchain

Here is the breakdown of building blocks of the RAG system with LangChain:

* install required libraries: `langchain, langchain-community, langchain-ollama, beautifulsoup4, pypdf`


```python
pip install langchain langchain-community langchain-ollama beautifulsoup4 pypdf
```
* install `ollama` on your [Mac/Linux or Windows](https://ollama.com/download)
* pull an embedding model with `ollama` from CLI:


```python
ollama pull nomic-embed-text
```
* build the `vectorstore`


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
So far your backend service is set up to return some mock results and you have access to a `retriever` which communicates with vectorized content from pdf files and web pages. For the purpose of our application, to build a chatbot that is specialized in providing Energy Saving Tips on electricity bills, we use various websites and pdf documents. These `data` is TEMPORARILY available on the GitHub repository:

[https://github.com/Hadi2525/ai\-chatbot\-backend\-service/tree/main/ai\_chatbot/data](https://github.com/Hadi2525/ai-chatbot-backend-service/tree/main/ai_chatbot/data)

In [part 2](https://readmedium.com/build-production-ready-ai-assistant-backend-service-in-python-part-2-a8d31f0c2dc3), you learn how to:

* Test all the endpoint using python library `request`
* Step by step build the LangGraph flow for constructing the backend RAG system
* Developer the LLM service (on local using Ollama or with OpenAI API)
* Run the ChatBot Backend on `localhost`

Thank you for coming along and see you in [part 2](https://readmedium.com/build-production-ready-ai-assistant-backend-service-in-python-part-2-a8d31f0c2dc3)!


