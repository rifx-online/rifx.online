---
title: "Program a RAG LLM Chat App with LangChain + Streamlit + *o1, GTP-4o and Claude 3.5"
meta_title: "Program a RAG LLM Chat App with LangChain + Streamlit + *o1, GTP-4o and Claude 3.5"
description: "This article provides a comprehensive guide on building a Retrieval Augmented Generation (RAG) web application using Python, Streamlit, and LangChain. It explains the advantages of RAG over fine-tuning large language models (LLMs) by allowing real-time access to updated information without the need for extensive retraining. The article outlines the six steps involved in creating a RAG pipeline, including document loading, splitting, embedding, and storing, followed by retrieval and generation phases. It also details the integration of RAG into a chat application and offers deployment instructions for hosting the app online. The code examples provided facilitate the implementation of these concepts effectively."
date: 2024-11-20T00:43:56Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*NNgzD3_oLFEHSfKp1CmmKA.png"
categories: ["Programming", "Machine Learning", "Chatbots"]
author: "Rifx.Online"
tags: ["RAG", "Streamlit", "LangChain", "embeddings", "chatbot"]
draft: False

---




Learn how to build a RAG web application using Python, Streamlit and LangChain, so you can chat with Documents, Websites and other custom data.







GitHub Code: <https://github.com/enricd/rag_llm_app>

The RAG LLM Streamlit App: [https://rag\-llm\-app.streamlit.app/](https://rag-llm-app.streamlit.app/)


## Table of Contents

1. 💪🏻 Intro to RAG (and why it’s better than fine\-tuning)
2. 🦜 RAG with LangChain step by step
3. 👨‍💻 Integrating RAG into an LLM Chat web app
4. 🚀 Deploy the RAG web app online for free!


## 1\. 💪🏻 Intro to RAG (and why it’s better than fine\-tuning)

In this blog we will learn how to develop a **Retrieval Augmented Generation (RAG)** pipeline step by step, and how to integrate it into a Chat Web App, in Python, using [LangChain](https://www.langchain.com/) and [Streamlit](https://streamlit.io/).

Let’s see the final result:


### With RAG:




### Without RAG:

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*0BXPS5ekGBy7ovM6frKDmw.png)

As you probably already know, LLMs are trained on large amounts of public data up to a certain date. **Any fact that is either not public, newer, or quite niche is essentially unknown to them**. Although newer models tend to be better at recalling facts that were in the training set, they are still far from perfect. This can be a limiting factor for many tasks that, for one reason or another, require an LLM that has to know specific topics very precisely.

**RAG** consists of providing a source of custom information to our LLM chat pipeline. Before sending any question to the model, we automatically provide the most relevant fragments of context extracted from this database, so the model has precise details in the context itself next to our question. In this way, the model knows very precisely what we are talking about, where the information comes from, and we can easily update that information with almost no cost or need for a GPU. We can use any already available LLM, like GPT\-4o from the OpenAI API (now or soon even o1 and o1\-mini!), Claude 3\.5 from the Anthropic API, or even open\-source ones with the original weights in a cheap and efficient way as we are already doing. If a better model appears tomorrow, we can integrate it almost immediately into our RAG pipeline and take advantage of it without having to fine\-tune any LLM again.

Going more into detail, RAG consists in 6 steps, which can be divided in 2 phases:


### 1st phase: Indexing

**1\- 📤 Loading the documents:** We extract the raw text from them, regardless of the format, using appropriate Python packages for it.

**2\- ✂️ Splitting the documents:** As some documents can have hundreds or even thousands of pages of text, our LLM’s context is limited, and probably we only want few specific smaller parts from those docs, we will split them into chunks or splits, with some overlap between them.

**3\- 🔢 Embedding the splits:** Here we use and Embeddings LLM that receives our chunks of text and returns the embeddings from each token of our text. So later we will be able to quickly retrieve the chunks more related to every given question, those that are closer to the question in the multidimensional embedding space.

**4\- 🗃️ Storing the embeddings in the Vector Store (aka. Vector DB):** The embeddings are saved in a specialized database for embeddings that can perform basic vector operations efficiently, like calculating the encoded semantic distance between two sentences at every retrieval request.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*xUYXAKdVxqYJsdZb.png)


### 2nd phase: Retrieval and Generation

**5\- 🔎 Retrieval:** The user’s question is first transformed to tokens and embeddings so it can be quickly compared to all the chunks of documents in the Vector Store, in order to retrieve (get) the N closer or more similar in terms of meaning.

**6\- 🧠 Augmented Generation:** The N most relevant chunks are added to the prompt before the user’s question with proper instructions for the LLM, so the LLM does in\-context learning, which means that has relevant information together with the question in the context of the request (not diluted in the model’s weights), and can answer with much better knowledge and accuracy.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*GLJD4MUcpbP5mX2b.png)


### “But.. what about fine\-tuning?”

Many people have heard about the concept of **fine\-tuning** or even the possibility of training an LLM from scratch. While this is technically possible (especially the first one), it comes with many caveats, constraints, and hidden costs that make it a less favorable option in the end:

* To fine\-tune an LLM, you first **need access to it**, which is mostly possible with open\-source LLMs like those on HuggingFace, such as Llama 3\.1, but not with private ones like GPT\-4 or Claude 3\.5 (with some few exceptions like the smaller models of OpenAI and some few other private options, but not with the best LLMs), which are still a step ahead in terms of quality compared to open\-source models.
* To fine\-tune a model with **your own data, you need to prepare and process it**, requiring at least thousands of diverse, up\-to\-date, and balanced examples. It’s not as simple as having some PDFs or documents around. This could take many human\-hours in preprocessing.
* In the past 1–2 years, there have been advances in fine\-tuning techniques, making the process much more efficient and requiring less GPU memory. Even so, you still need to **spend thousands of dollars on GPU resources**, either with your own NVIDIAs or by renting them from classic or newer cloud services.
* Then, you will need to **serve your new custom LLM** that knows about your use case, which also requires GPU power and doesn’t scale cheaply. You won’t be able to use pay\-per\-token or pay\-as\-you\-go models, as these are only available for the normal generalist LLMs. It’s true that some companies like OpenAI allow fine\-tuning of some of their smaller and older models and serve them for you, but again, this has limitations, and those are not the best LLMs right now.
* Moreover, your fine\-tuned model **won’t auto\-update** if a new Llama 4 or whatever open\-source model you are using gets released tomorrow. Neither will it update if the custom data you used for training becomes obsolete next month or if you need to include new data. You will need to go through the process again: 1\. Prepare all the data, 2\. Fine\-tune the model again, 3\. Deploy / Serve / Monitor.
* If all of this wasn’t enough to make fine\-tuning your Plan B (or C, or D), you need to know about a concept called **Catastrophic Forgetting**. This is the tendency of a neural network to lose previously learned information upon learning from new examples. In other words, while you are fine\-tuning a top LLM with your custom examples, you are making it less accurate on the general knowledge it had before. Not only this, but very often, the LLM doesn’t learn your custom facts 100% accurately but rather some close summary or imperfect copy of them, which gets diluted in the weights and biases of the previously trained model.
* Finally, LLMs by themselves **can not tell you the exact references or precise sources of the facts** they provide, and if they do, it’s very possible they hallucinate about them.

So, after this long list of caveats and complications when applying fine\-tuning for a real case, here we have a better option for over 90% of the cases: ***Le RAG!***

💡 Make sure to follow me on [Medium](https://medium.com/@enricdomingo), [YouTube](https://www.youtube.com/@enricd) and [GitHub](https://github.com/enricd) as in the next blog and video we will see how to deploy this app into Azure, using GPT\-4o and GPT\-4o mini through Azure OpenAI Service and adding SSO Authentication in front of our app, so only authorized users under our Azure subscription (for example, your work colleagues) can access to our app, no one else will spend our resources or steal our data!

Let’s get into the code!! 💪🧑‍💻


## 2\. 🦜 RAG with LangChain step by step

Let’s start by installing all needed Python libraries (I assume you already have Python ≥3\.9 installed, an IDE like VSCode or PyCharm, and any OS like Windows, Linux/Ubuntu, or MacOS).


```python
## Create a folder, go to the terminal into it with cd and then:

$ python -m venv venv  # optional
$ venv/scripts/activate  # or source venv/bin/activate for mac and linux, optional

$ pip install python-dotenv streamlit langchain langchain-core langchain-community langchain-openai langchain-anthropic chromadb==0.5.3 langchain-chroma docx2txt pypdf bs4 ipykernel
```
Create a file in your folder called *.env* and put your [OpenAI API key](https://platform.openai.com/) and optionally, your [Anthropic API key](https://console.anthropic.com/) as well like this (check the links if you don’t have them yet):


```python
## /.env

OPENAI_API_KEY="<your-openai-api-key>"
ANTHROPIC_API_KEY="<your-anthropic-api-key>"
```
Make sure to create a *.gitignore* file and add the *.env* file in it:


```python
## /.gitignore

.env
venv/
__pycache__
```
Now let’s create a Jupyter Notebook to see how to use the LangChain RAG methods, I will call it *langchain\_rag.ipynb*.

In it, let’s start the first cell importing all needed libraries:


```python
## /langchain_rag.ipynb

import os
import dotenv
from pathlib import Path

from langchain_core.messages import AIMessage, HumanMessage
from langchain_community.document_loaders.text import TextLoader
from langchain_community.document_loaders import (
    WebBaseLoader, 
    PyPDFLoader, 
    Docx2txtLoader,
)
from langchain_community.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain

dotenv.load_dotenv()
```
Now, let’s implement the 6 steps we saw before: Load, Split, Embed, Store, Retrieve, and Augmented Generation:

**Load:** We will use some of the most common LangChain document loader methods, you can check all available in here and apply more custom ones for your specific use case: [LangChain Document Loaders](https://python.langchain.com/v0.2/docs/integrations/document_loaders/).

In the following cell we will load pdf, docx, txt, and markdown docs, but also websites’ text content from their URLs. Here I’ve created a *docs/* folder in the project’s folder where I placed some test\_rag docs with some random info to validate it’s really working, and for the URLs, I’m testing it with the Streamlit documentation changelog where I will ask the LLM about the most recent versions:


```python
## Load docs

doc_paths = [
    "docs/test_rag.pdf",
    "docs/test_rag.docx",
]

docs = [] 
for doc_file in doc_paths:
    file_path = Path(doc_file)

    try:
        if doc_file.endswith(".pdf"):
            loader = PyPDFLoader(file_path)
        elif doc_file.endswith(".docx"):
            loader = Docx2txtLoader(file_path)
        elif doc_file.endswith(".txt") or doc_file.name.endswith(".md"):
            loader = TextLoader(file_path)
        else:
            print(f"Document type {doc_file.type} not supported.")
            continue

        docs.extend(loader.load())

    except Exception as e:
        print(f"Error loading document {doc_file.name}: {e}")
    
    finally:
        os.remove(file_path)


## Load URLs

url = "https://docs.streamlit.io/develop/quick-reference/release-notes"
try:
    loader = WebBaseLoader(url)
    docs.extend(loader.load())

except Exception as e:
    print(f"Error loading document from {url}: {e}")


```
**Split:** Now, we will use the *RecursiveCharacterTextSplitter* for splitting every document in chunks of 5000 characters, with an overlap of 1000 to not cut any context in half.


```python
## Split docs

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=5000,
    chunk_overlap=1000,
)

document_chunks = text_splitter.split_documents(docs)
```
**Embed and Store:** We will use a single method from Chroma DB to tokenize our text using the OpenAI Embeddigns model and store it in the local Chroma DB Vector Store.


```python
## Tokenize and load the documents to the vector store

vector_db = Chroma.from_documents(
    documents=document_chunks,
    embedding=OpenAIEmbeddings(),
)
```
And now we already have our Vector Store loaded and ready to be retrieved. Let’s create the pipeline to do so:

**Retrieve:** There are different algorithms and methods to retrieve, some more basic, some more complex. Here we will use a mid one that considers not only the last question from the user to get the relevant info from the Vector Store, but all the previous conversation:


```python
def _get_context_retriever_chain(vector_db, llm):
    retriever = vector_db.as_retriever()
    prompt = ChatPromptTemplate.from_messages([
        MessagesPlaceholder(variable_name="messages"),
        ("user", "{input}"),
        ("user", "Given the above conversation, generate a search query to look up in order to get inforamtion relevant to the conversation, focusing on the most recent messages."),
    ])
    retriever_chain = create_history_aware_retriever(llm, retriever, prompt)

    return retriever_chain
```
This function will be used to get the most useful chunks of info for a given conversation, and the following method will make the query to the LLM with these chunks included in it:


```python
def get_conversational_rag_chain(llm):
    retriever_chain = _get_context_retriever_chain(vector_db, llm)

    prompt = ChatPromptTemplate.from_messages([
        ("system",
        """You are a helpful assistant. You will have to answer to user's queries.
        You will have some context to help with your answers, but now always would be completely related or helpful.
        You can also use your knowledge to assist answering the user's queries.\n
        {context}"""),
        MessagesPlaceholder(variable_name="messages"),
        ("user", "{input}"),
    ])
    stuff_documents_chain = create_stuff_documents_chain(llm, prompt)

    return create_retrieval_chain(retriever_chain, stuff_documents_chain)
```
**Augmented Generation:** Finally we will use the previous method to query the LLM with the automatic addition to the relevant context in our request. We need to create the LLM Chat objects, with streaming capabilites so later we can already build the chat webapp with them and also the messages history:


```python
llm_stream_openai = ChatOpenAI(
    model="gpt-4o",  # Here you could use "o1-preview" or "o1-mini" if you already have access to them
    temperature=0.3,
    streaming=True,
)

llm_stream_anthropic = ChatAnthropic(
    model="claude-3-5-sonnet-20240620",
    temperature=0.3,
    streaming=True,
)

llm_stream = llm_stream_openai  # Select between OpenAI and Anthropic models for the response

messages = [
    {"role": "user", "content": "Hi"},
    {"role": "assistant", "content": "Hi there! How can I assist you today?"},
    {"role": "user", "content": "What is the latest version of Streamlit?"},
]
messages = [HumanMessage(content=m["content"]) if m["role"] == "user" else AIMessage(content=m["content"]) for m in messages]

conversation_rag_chain = get_conversational_rag_chain(llm_stream)
response_message = "*(RAG Response)*\n"
for chunk in conversation_rag_chain.pick("answer").stream({"messages": messages[:-1], "input": messages[-1].content}):
    response_message += chunk
    print(chunk, end="", flush=True)

messages.append({"role": "assistant", "content": response_message})
```
If we did everything correctly, now we should see the LLM response being streamed with our response. When the LLM was trained, the latest version of Streamlit maybe was 1\.34 for example, but now it knows about the freshest one thanks to our RAG connection to Streamlit updates and the changelog! 🔥 You can do the same for any other custom use case.

One nice thing about using LangChain is the easy interoperability between different LLM providers. We can switch between them with almost no code changes.

Let’s make this more interactive and usable for everyone: Let’s build a RAG Chat Bot website and later, publish it online for free!


## 3\. 👨‍💻 Integrating RAG into an LLM Chat web app

We already saw how to build a multi\-modal chat webapp, in Streamlit, for:

* OpenAI models like GPT\-4o: [Blog and Video Link](https://readmedium.com/code-the-omnichat-app-integrating-gpt-4o-your-python-chatgpt-d399b90d178e)
* Google DeepMind models like Gemini 1\.5: [Blog and Video Link](https://readmedium.com/how-i-add-gemini-1-5-pro-api-to-my-app-chat-with-videos-images-and-audios-f42171606143)
* Anthropic models like Claude 3\.5 Sonnet: [Blog and Video Link](https://readmedium.com/claude-sonnet-3-5-api-integrating-the-best-llm-into-our-app-7ec4623e2dac)

Here we will skip to explain some of the fine details of how to build the code, as we already saw them in these blogs, but basically, we will create a ***/rag\_methods.py*** file to declare all needed LLM and RAG methods that we have just developed and experimented in the previous step in the */langchain\_rag.ipynb* notebook.

Then we will create the */app.py* file where we will develop all the Streamlit logic to create the website, importing all previously developed RAG methods.


### /rag\_methods.py

The logic and methods is almost the same as before, but adapted to make it work in Streamlit, using the *st.session\_state* to manage the messages conversation but also the Chroma DB Vector Stores for each user, attaching them to every users’ session, but keeping as much of 20 of them, to make sure we don’t overflow our limited server memory. You can modify these limits for your own use case and cloud infra.


```python
import os
import dotenv
from time import time
import streamlit as st

from langchain_community.document_loaders.text import TextLoader
from langchain_community.document_loaders import (
    WebBaseLoader, 
    PyPDFLoader, 
    Docx2txtLoader,
)
## pip install docx2txt, pypdf
from langchain_community.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain

dotenv.load_dotenv()

os.environ["USER_AGENT"] = "myagent"
DB_DOCS_LIMIT = 10

## Function to stream the response of the LLM 
def stream_llm_response(llm_stream, messages):
    response_message = ""

    for chunk in llm_stream.stream(messages):
        response_message += chunk.content
        yield chunk

    st.session_state.messages.append({"role": "assistant", "content": response_message})


## --- Indexing Phase ---

def load_doc_to_db():
    # Use loader according to doc type
    if "rag_docs" in st.session_state and st.session_state.rag_docs:
        docs = [] 
        for doc_file in st.session_state.rag_docs:
            if doc_file.name not in st.session_state.rag_sources:
                if len(st.session_state.rag_sources) < DB_DOCS_LIMIT:
                    os.makedirs("source_files", exist_ok=True)
                    file_path = f"./source_files/{doc_file.name}"
                    with open(file_path, "wb") as file:
                        file.write(doc_file.read())

                    try:
                        if doc_file.type == "application/pdf":
                            loader = PyPDFLoader(file_path)
                        elif doc_file.name.endswith(".docx"):
                            loader = Docx2txtLoader(file_path)
                        elif doc_file.type in ["text/plain", "text/markdown"]:
                            loader = TextLoader(file_path)
                        else:
                            st.warning(f"Document type {doc_file.type} not supported.")
                            continue

                        docs.extend(loader.load())
                        st.session_state.rag_sources.append(doc_file.name)

                    except Exception as e:
                        st.toast(f"Error loading document {doc_file.name}: {e}", icon="⚠️")
                        print(f"Error loading document {doc_file.name}: {e}")
                    
                    finally:
                        os.remove(file_path)

                else:
                    st.error(F"Maximum number of documents reached ({DB_DOCS_LIMIT}).")

        if docs:
            _split_and_load_docs(docs)
            st.toast(f"Document *{str([doc_file.name for doc_file in st.session_state.rag_docs])[1:-1]}* loaded successfully.", icon="✅")


def load_url_to_db():
    if "rag_url" in st.session_state and st.session_state.rag_url:
        url = st.session_state.rag_url
        docs = []
        if url not in st.session_state.rag_sources:
            if len(st.session_state.rag_sources) < 10:
                try:
                    loader = WebBaseLoader(url)
                    docs.extend(loader.load())
                    st.session_state.rag_sources.append(url)

                except Exception as e:
                    st.error(f"Error loading document from {url}: {e}")

                if docs:
                    _split_and_load_docs(docs)
                    st.toast(f"Document from URL *{url}* loaded successfully.", icon="✅")

            else:
                st.error("Maximum number of documents reached (10).")


def initialize_vector_db(docs):
    vector_db = Chroma.from_documents(
        documents=docs,
        embedding=OpenAIEmbeddings(api_key=st.session_state.openai_api_key),
        collection_name=f"{str(time()).replace('.', '')[:14]}_" + st.session_state['session_id'],
    )

    # We need to manage the number of collections that we have in memory, we will keep the last 20
    chroma_client = vector_db._client
    collection_names = sorted([collection.name for collection in chroma_client.list_collections()])
    print("Number of collections:", len(collection_names))
    while len(collection_names) > 20:
        chroma_client.delete_collection(collection_names[0])
        collection_names.pop(0)

    return vector_db


def _split_and_load_docs(docs):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=5000,
        chunk_overlap=1000,
    )

    document_chunks = text_splitter.split_documents(docs)

    if "vector_db" not in st.session_state:
        st.session_state.vector_db = initialize_vector_db(docs)
    else:
        st.session_state.vector_db.add_documents(document_chunks)


## --- Retrieval Augmented Generation (RAG) Phase ---

def _get_context_retriever_chain(vector_db, llm):
    retriever = vector_db.as_retriever()
    prompt = ChatPromptTemplate.from_messages([
        MessagesPlaceholder(variable_name="messages"),
        ("user", "{input}"),
        ("user", "Given the above conversation, generate a search query to look up in order to get inforamtion relevant to the conversation, focusing on the most recent messages."),
    ])
    retriever_chain = create_history_aware_retriever(llm, retriever, prompt)

    return retriever_chain


def get_conversational_rag_chain(llm):
    retriever_chain = _get_context_retriever_chain(st.session_state.vector_db, llm)

    prompt = ChatPromptTemplate.from_messages([
        ("system",
        """You are a helpful assistant. You will have to answer to user's queries.
        You will have some context to help with your answers, but now always would be completely related or helpful.
        You can also use your knowledge to assist answering the user's queries.\n
        {context}"""),
        MessagesPlaceholder(variable_name="messages"),
        ("user", "{input}"),
    ])
    stuff_documents_chain = create_stuff_documents_chain(llm, prompt)

    return create_retrieval_chain(retriever_chain, stuff_documents_chain)


def stream_llm_rag_response(llm_stream, messages):
    conversation_rag_chain = get_conversational_rag_chain(llm_stream)
    response_message = "*(RAG Response)*\n"
    for chunk in conversation_rag_chain.pick("answer").stream({"messages": messages[:-1], "input": messages[-1].content}):
        response_message += chunk
        yield chunk

    st.session_state.messages.append({"role": "assistant", "content": response_message})
```

### /app.py


```python
import streamlit as st
import os
import dotenv
import uuid

## check if it's linux so it works on Streamlit Cloud
if os.name == 'posix':
    __import__('pysqlite3')
    import sys
    sys.modules['sqlite3'] = sys.modules.pop('pysqlite3')

import streamlit as st
import os
import dotenv
import uuid

from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain.schema import HumanMessage, AIMessage

from rag_methods import (
    load_doc_to_db, 
    load_url_to_db,
    stream_llm_response,
    stream_llm_rag_response,
)

dotenv.load_dotenv()

MODELS = [
    # "openai/o1-mini",
    "openai/gpt-4o",
    "openai/gpt-4o-mini",
    "anthropic/claude-3-5-sonnet-20240620",
]

st.set_page_config(
    page_title="RAG LLM app?", 
    page_icon="📚", 
    layout="centered", 
    initial_sidebar_state="expanded"
)


## --- Header ---
st.html("""<h2 style="text-align: center;">📚🔍 <i> Do your LLM even RAG bro? </i> 🤖💬</h2>""")


## --- Initial Setup ---
if "session_id" not in st.session_state:
    st.session_state.session_id = str(uuid.uuid4())

if "rag_sources" not in st.session_state:
    st.session_state.rag_sources = []

if "messages" not in st.session_state:
    st.session_state.messages = [
        {"role": "user", "content": "Hello"},
        {"role": "assistant", "content": "Hi there! How can I assist you today?"}
]


## --- Side Bar LLM API Tokens ---
with st.sidebar:
    default_openai_api_key = os.getenv("OPENAI_API_KEY") if os.getenv("OPENAI_API_KEY") is not None else ""  # only for development environment, otherwise it should return None
    with st.popover("🔐 OpenAI"):
        openai_api_key = st.text_input(
            "Introduce your OpenAI API Key (https://platform.openai.com/)", 
            value=default_openai_api_key, 
            type="password",
            key="openai_api_key",
        )

    default_anthropic_api_key = os.getenv("ANTHROPIC_API_KEY") if os.getenv("ANTHROPIC_API_KEY") is not None else ""
    with st.popover("🔐 Anthropic"):
        anthropic_api_key = st.text_input(
            "Introduce your Anthropic API Key (https://console.anthropic.com/)", 
            value=default_anthropic_api_key, 
            type="password",
            key="anthropic_api_key",
        )

## --- Main Content ---
## Checking if the user has introduced the OpenAI API Key, if not, a warning is displayed
missing_openai = openai_api_key == "" or openai_api_key is None or "sk-" not in openai_api_key
missing_anthropic = anthropic_api_key == "" or anthropic_api_key is None
if missing_openai and missing_anthropic:
    st.write("#")
    st.warning("⬅️ Please introduce an API Key to continue...")

else:
    # Sidebar
    with st.sidebar:
        st.divider()
        st.selectbox(
            "🤖 Select a Model", 
            [model for model in MODELS if ("openai" in model and not missing_openai) or ("anthropic" in model and not missing_anthropic)],
            key="model",
        )

        cols0 = st.columns(2)
        with cols0[0]:
            is_vector_db_loaded = ("vector_db" in st.session_state and st.session_state.vector_db is not None)
            st.toggle(
                "Use RAG", 
                value=is_vector_db_loaded, 
                key="use_rag", 
                disabled=not is_vector_db_loaded,
            )

        with cols0[1]:
            st.button("Clear Chat", on_click=lambda: st.session_state.messages.clear(), type="primary")

        st.header("RAG Sources:")
            
        # File upload input for RAG with documents
        st.file_uploader(
            "📄 Upload a document", 
            type=["pdf", "txt", "docx", "md"],
            accept_multiple_files=True,
            on_change=load_doc_to_db,
            key="rag_docs",
        )

        # URL input for RAG with websites
        st.text_input(
            "🌐 Introduce a URL", 
            placeholder="https://example.com",
            on_change=load_url_to_db,
            key="rag_url",
        )

        with st.expander(f"📚 Documents in DB ({0 if not is_vector_db_loaded else len(st.session_state.rag_sources)})"):
            st.write([] if not is_vector_db_loaded else [source for source in st.session_state.rag_sources])

    
    # Main chat app
    model_provider = st.session_state.model.split("/")[0]
    if model_provider == "openai":
        llm_stream = ChatOpenAI(
            api_key=openai_api_key,
            model_name=st.session_state.model.split("/")[-1],
            temperature=0.3,
            streaming=True,
        )
    elif model_provider == "anthropic":
        llm_stream = ChatAnthropic(
            api_key=anthropic_api_key,
            model=st.session_state.model.split("/")[-1],
            temperature=0.3,
            streaming=True,
        )

    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

    if prompt := st.chat_input("Your message"):
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)

        with st.chat_message("assistant"):
            message_placeholder = st.empty()
            full_response = ""

            messages = [HumanMessage(content=m["content"]) if m["role"] == "user" else AIMessage(content=m["content"]) for m in st.session_state.messages]

            if not st.session_state.use_rag:
                st.write_stream(stream_llm_response(llm_stream, messages))
            else:
                st.write_stream(stream_llm_rag_response(llm_stream, messages))


```
Now, you can try to run locally the website by going to the terminal and:


```python
## cd to the project's folder and venv activation

$ streamlit run app.py
```
If everything is properly setted, you should see this from localhost:8501 in your browser:

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*lGbTqfd6J9Gq4F53nDUtNw.png)

You can try to chat with it without docs, and then load any pdf, txt, docx or URL you want to try, and ask specific questions about it, to validate it’s really working.

Great! Let’s make this available outside our computer, let’s deploy this website for free on the Streamlit Cloud. Remember that in the next blog and video we will see how to deploy this in Azure, with more powerful machines, more security and the possibility of adding SSO authentication. Let me know in the comments if you want to see how to deploy it as well in other cloud providers such AWS. 🤗


## 4\. 🚀 Deploy the RAG web app online for free!

We already saw in previous blogs how to easily deploy Streamlit websites for free into the Streamlit cloud, but let’s see again the steps to do it:

* Create a Git repo if you haven’t done it yet:


```python
## cd to your project's folder, make sure to have the .gitignore properly setted

$ venv/scripts/activate  # or source venv/bin/activate

$ pip freeze > requirements.txt

## add the following line on top of the requirements.txt file: pysqlite3-binary; sys_platform == 'linux'

$ git init -b main

$ git add .

$ git commit -m "complete project"
```
* Go to [github.com](https://github.com) (create an account if you don’t have it yet) and create a new repo. Follow the steps in there to upload (push) an existing local project.
* Go to [streamlit.io](https://streamlit.io/) , sign up with your github account, and create a new a new App with the top\-right button, select that you already have an app.
* Now, if you properly linked your GitHub account with Streamlit, select your app’s repo from the dropdown, select the main branch, tell that the Main file path is *app.py* and remember to select an available, short and cool subdomain for your app.
* Deploy, and after 1–2 minutes you should see your app running publicly! 🚀
* If there is any bug or issue, you can debut it from the bottom\-right button that shows you the server logs, where any error will be printed so you can understand better what is failing.

I hope you enjoyed this content, RAG applications is really a next step in making LLMs more useful for an infinite number of niche and advanced applications. You can adapt what we have seen here for many other use cases, making use of other alternative LangChain methods, or using external Vector Store services so you don’t have to run Chroma DB locally.

Make sure to applause this post, follow me on Medium and YouTube, comment any question and feedback, and see you in the next one!! 🤗 Thanks!


