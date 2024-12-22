---
title: "Build Production Ready AI Assistant Backend Service (in Python) — Part 2 | by Hadi Rouhani | Dec, 2024 | Medium"
meta_title: "Build Production Ready AI Assistant Backend Service (in Python) — Part 2 | by Hadi Rouhani | Dec, 2024 | Medium"
description: "This article discusses the development of a production-ready AI assistant backend service in Python, specifically focusing on building a multi-agent Retrieval-Augmented Generation (RAG) system using LangGraph. It outlines the testing of various backend endpoints, including session management and context retrieval, while emphasizing the importance of proper data storage practices. The article also details the configuration of LangGraph for managing application states, nodes, and control flows, ultimately guiding the implementation of an AI assistant specialized in energy-saving tips. Future developments will include integrating a database for semantic data storage and vector search capabilities."
date: 2024-12-22T04:01:47Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*7UMUG_wfjCA_seURYn_xIA.png"
categories: ["Programming", "Generative AI", "Chatbots"]
author: "Rifx.Online"
tags: ["Python", "RAG", "LangGraph", "endpoints", "vector"]
draft: False

---




— Build a multi agent RAG system using LangGraph \+ Secure your Application with Authorization Key Headers

\*Disclosure — *the contents in this article are my own, and represent no one but myself and not those of my current or past employers.\**



In the previous part ([part 1](https://readmedium.com/build-production-ready-ai-assistant-backend-service-in-python-part-1-9c7b2910eea3)), we covered the fundamentals of backend services, including APIs and endpoints, and set up the initial repository for a real\-world Generative AI application featuring an AI assistant specialized in energy\-saving tips.

In this article, we cover the following:

* Unit test all the endpoints making sure everything works as expected
* Step by step build the LangGraph for the RAG application

Let’s review the backend endpoint workflow again.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*CJYdK0m-V0aaqTnRF70wJw.png)

We need to verify that all endpoints operate as expected (aka response status is OK 200!).

Therefore, here we review each endpoint:


> Skip this part if you want to start building your application with `LangGraph`


### Test Endpoints

`/get_session_id`, this endpoint posts a unique session id to the user’s session. No payload is required and the following request example gets a 200 response:


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
Note that the `headers` for this particular endpoint can be optional.

`/ask`, the payload for this endpoint requires a `body` and a `parameter`.


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
One important note to consider, in a production environment, we do NOT store messages on the memory! That is a terrible design! Usually a provisioned database (structured or semi\-structured) should be used. We explore production options in part 3 of this article.

`/retrieve_contexts` We may not be using this endpoint within the production pipeline, though it’s good to have the endpoint to be able to access the retriever to access references directly from the vectorstore.

To test this endpoint, I add a test payload like the following to `app.py` :


```python
## Inside app.py
sessions = {
    "000-000": {"messages": ["tell me something about energy saving"]}
}
```
Here is the request payload example for this endpoint:


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
`/save_records` is a simple `POST` method which stores the results to the database. As mentioned before, saving data to memory is a terrible design leading to server interruption and possible outages.

`/generate_summary` needs to be modified to accommodate a few workflows. Whenever the user sends a request, the server initially search against the vectorstore to find information in particular for the last question the user asked, then utilize the LLM to generate a summary of the context and then store it in the database and finally return the response for the user as a response object.

Before showing the payload example for this endpoint, let’s build the chain using `LangGraph`. If you are not familiar with `LangGraph` check out [this link](https://langchain-ai.github.io/langgraph/).


## Building a RAG using LangGraph

LangGraph is a powerful tool for building agentic flows and multi agent workflows (learn more about [langGraph](https://langchain-ai.github.io/langgraph/)). If you are interested, [you can enrol a course from LangChain for free](https://academy.langchain.com/courses/intro-to-langgraph)!

For a simple RAG application, the states of the workflow is straightforward. To use LangGraph, we need to define three things:

1. The state of our application;
2. The nodes (i.e., application steps);
3. The “control flow” (e.g., the ordering of the steps).


### States

The [state](https://langchain-ai.github.io/langgraph/concepts/low_level/#state) of our application controls what data is input to the application, transferred between steps, and output by the application. It is typically a `TypedDict`, but can also be a [Pydantic BaseModel](https://langchain-ai.github.io/langgraph/how-tos/state-model/).

For a simple RAG application, we can just keep track of the input question, retrieved context, and generated answer:


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

### Nodes (application steps)​

Let’s start with a simple sequence of two steps: retrieval and generation.


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

### Control flow​

Finally, we compile our application into a single `graph` object. In this case, we are just connecting the retrieval and generation steps into a single sequence.


```python
## chain_config.py continued
###########################

from langgraph.graph import START, StateGraph

graph_builder = StateGraph(State).add_sequence([retrieve, generate])
graph_builder.add_edge(START, "retrieve")
graph = graph_builder.compile()
```
LangGraph also comes with built\-in utilities for visualizing the control flow of your application:


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
Running the above code or the alternative approach should provide the following flow:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*EgdGcJfu_XM8N6S9RxcWZw.png)


### Building the LLM for Generating Summary

We use a local LLM `llama3.2:1b` using the Ollama framework and set up the LLM as follows:


```python
## chain_config.py

from langchain_ollama import OllamaLLM

llm = OllamaLLM(
    model="llama3.2:1b",
    temperature=0
)
```
For simplicity, I use the LangChain’s hub to pull a custom prompt for `RAG` applications. You can custom build your own prompt using `PromptTemplate` or `ChatPromptTemplate` libraries.

Here is a complete breakdown of the `chain_config.py` :


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
    This state is meant for retrieving content from the vectorstore
    '''
    vector_store = await get_vectorstore()
    retrieved_docs = vector_store.similarity_search(state["question"])
    return {"context": retrieved_docs}

def generate(state: State):
    '''
    The LLM is used to generate a summary of relevant contents from 
    the retrieved contexts
    '''
    docs_content = "\n\n".join(doc.page_content for doc in state["context"])
    messages = prompt.invoke({"question": state["question"], "context": docs_content})
    response = llm.invoke(messages)
    return {"answer": response}

def get_graph():
    '''
    returns the compiled graph builder object as a RAG system
    '''
    graph_builder = StateGraph(State).add_sequence([retrieve, generate])
    graph_builder.add_edge(START, "retrieve")
    graph = graph_builder.compile()
    return graph


## [Optional] ##
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
Here is the updated `app.py`:


```python
from fastapi import FastAPI, HTTPException
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
async def generate_summary(request: SummaryRequest):
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
Now that we have the RAG system, it’s time to test the `/generate_summary` endpoint.


```python
## Testing /generate_summary
import requests

main_url = "http://localhost:8000"
url = main_url + "/generate_summary"

payload = {"session_id":"000-000",
           "message_history": ["tell me more how I can save money on energy?"]}

response = requests.post(url, json=payload)
print(response.json())
```
That’s it! You now have a fully functional backend service to serve an AI assistant specialized in energy saving tips!

Note that you may get warnings like the following:


```python
site-packages/langsmith/client.py:241: LangSmithMissingAPIKeyWarning: API key must be provided when using hosted LangSmith API
  warnings.warn(
```
which is fine as long as you don’t want to trace the LangGraph inside LangSmith dashboard. If you are interested in learning more about `LangSmith`, checkout this tutorial:







So far the application service works well when interacting with it using your `localhost`. I won’t stop here and I want to guide you exactly how you should move forward :).

In the next part (part 3\), we want to go a step further and implement an actual database using `MongoDB` to store our semantic data and learn how to communicate with a `vector datastore` and build `vector search index`.

Thank you for coming along and see you in the next part!


