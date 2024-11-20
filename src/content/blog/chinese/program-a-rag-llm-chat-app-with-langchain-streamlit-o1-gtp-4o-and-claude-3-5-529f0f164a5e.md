---
title: "使用 LangChain + Streamlit + *o1、GTP-4o 和 Claude 3.5 编写 RAG LLM 聊天应用程序"
meta_title: "使用 LangChain + Streamlit + *o1、GTP-4o 和 Claude 3.5 编写 RAG LLM 聊天应用程序"
description: "本文介绍了如何使用Python、Streamlit和LangChain构建一个检索增强生成（RAG）聊天应用程序。RAG通过在大语言模型（LLM）之前引入相关上下文信息，提升了模型对特定主题的回答准确性。文章详细描述了RAG的六个步骤，包括文档加载、拆分、嵌入和存储，最后通过检索和生成阶段实现增强的回答。作者还提供了应用的代码示例，并展示了如何将其在线部署到Streamlit Cloud。"
date: 2024-11-20T00:43:56Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*NNgzD3_oLFEHSfKp1CmmKA.png"
categories: ["Programming", "Machine Learning", "Chatbots"]
author: "Rifx.Online"
tags: ["RAG", "Streamlit", "LangChain", "embeddings", "chatbot"]
draft: False

---



学习如何使用 Python、Streamlit 和 LangChain 构建 RAG 网络应用，以便您可以与文档、网站和其他自定义数据进行聊天。

GitHub 代码：<https://github.com/enricd/rag_llm_app>

RAG LLM Streamlit 应用：[https://rag\-llm\-app.streamlit.app/](https://rag-llm-app.streamlit.app/)

## 目录

1. 💪🏻 RAG 介绍（以及为什么它比微调更好）
2. 🦜 LangChain 中的 RAG 分步指南
3. 👨‍💻 将 RAG 集成到 LLM 聊天网页应用中
4. 🚀 在线免费部署 RAG 网页应用！

## 1\. 💪🏻 RAG简介（以及为什么它优于微调）

在本博客中，我们将逐步学习如何开发**检索增强生成（RAG）**管道，以及如何使用[LangChain](https://www.langchain.com/)和[Streamlit](https://streamlit.io/)将其集成到Python的聊天Web应用中。

让我们看看最终结果：

### 使用 RAG:



### Without RAG:

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*0BXPS5ekGBy7ovM6frKDmw.png)

正如您可能已经知道的，LLMs 是在大量公共数据上训练的，直到某个特定日期。**任何不公开、更新或相对小众的事实对它们来说基本上是未知的**。尽管更新的模型在回忆训练集中存在的事实方面往往更好，但它们仍然远非完美。这可能是许多任务的一个限制因素，这些任务因某种原因需要 LLM 非常精确地了解特定主题。

**RAG** 的核心是为我们的 LLM 聊天管道提供自定义信息源。在向模型发送任何问题之前，我们会自动提供从该数据库中提取的最相关的上下文片段，以便模型在上下文中拥有与我们的问题相邻的精确信息。通过这种方式，模型非常清楚我们在讨论什么，信息来自哪里，并且我们可以几乎没有成本或不需要 GPU 的情况下轻松更新这些信息。我们可以使用任何已可用的 LLM，例如来自 OpenAI API 的 GPT\-4o（现在或不久将来的 o1 和 o1\-mini！）、来自 Anthropic API 的 Claude 3\.5，甚至是以经济高效的方式使用具有原始权重的开源模型，正如我们已经在做的那样。如果明天出现更好的模型，我们可以几乎立即将其集成到我们的 RAG 管道中，并利用它，而无需再次微调任何 LLM。

更详细地说，RAG 由 6 个步骤组成，可以分为 2 个阶段：

### 1st phase: Indexing

**1\- 📤 加载文档:** 我们从文档中提取原始文本，无论其格式如何，使用适当的Python包进行处理。

**2\- ✂️ 拆分文档:** 由于某些文档可能包含数百甚至数千页的文本，我们的LLM上下文是有限的，可能只想从这些文档中提取几个特定的小部分，因此我们将其拆分为多个块，并在它们之间保留一些重叠。

**3\- 🔢 嵌入拆分:** 在这里，我们使用一个嵌入LLM，它接收我们的文本块并返回每个文本标记的嵌入。因此，稍后我们将能够快速检索与每个给定问题更相关的文本块，这些文本块在多维嵌入空间中更接近该问题。

**4\- 🗃️ 将嵌入存储在向量存储中（即向量数据库）:** 嵌入被保存在一个专门用于嵌入的数据库中，该数据库能够高效地执行基本的向量操作，例如在每次检索请求中计算两个句子之间的编码语义距离。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*xUYXAKdVxqYJsdZb.png)

### 2阶段：检索与生成

**5\- 🔎 检索：** 用户的问题首先被转换为令牌和嵌入，以便可以快速与向量存储中的所有文档块进行比较，从而检索出在意义上更接近或更相似的 N 个块。

**6\- 🧠 增强生成：** 在用户问题之前，将 N 个最相关的文档块添加到提示中，并为 LLM 提供适当的指令，这样 LLM 就可以进行上下文学习，这意味着相关信息与问题一起出现在请求的上下文中（而不是稀释在模型的权重中），并能以更好的知识和准确性进行回答。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*GLJD4MUcpbP5mX2b.png)

### “但是.. 微调呢？”

许多人听说过**微调**的概念，甚至有可能从头开始训练一个LLM。虽然从技术上讲这是可行的（尤其是第一个），但它伴随着许多警告、限制和隐藏成本，使其最终成为一个不太理想的选择：

* 要微调一个LLM，您首先**需要访问它**，这通常可以通过像HuggingFace上的开源LLM（例如Llama 3.1）来实现，但对于像GPT-4或Claude 3.5这样的私有模型则不太可能（有一些例外，比如OpenAI的小型模型和其他一些私有选项，但不是最好的LLM），这些模型在质量上仍然比开源模型领先一步。
* 要用**您自己的数据微调模型，您需要准备和处理数据**，这需要至少数千个多样化、最新和均衡的示例。这并不像拥有一些PDF或文档那么简单。这可能需要大量的人力时间进行预处理。
* 在过去的1-2年中，微调技术有所进展，使得这一过程更高效，并且所需的GPU内存更少。即便如此，您仍然需要**花费数千美元用于GPU资源**，无论是使用自己的NVIDIA设备还是从传统或新兴的云服务租用它们。
* 然后，您需要**服务您的新自定义LLM**，使其了解您的用例，这也需要GPU的支持，并且成本不低。您将无法使用按令牌付费或按需付费的模型，因为这些模型仅适用于普通的通用LLM。确实，一些公司如OpenAI允许对其一些较小和较旧的模型进行微调并为您提供服务，但同样，这也有其限制，而这些模型现在并不是最好的LLM。
* 此外，您的微调模型**不会自动更新**，如果明天发布了新的Llama 4或您正在使用的其他开源模型。如果您用于训练的自定义数据下个月变得过时，或者您需要包含新数据，它也不会更新。您需要重新经历这个过程：1. 准备所有数据，2. 再次微调模型，3. 部署/服务/监控。
* 如果这一切还不足以让您把微调作为计划B（或C，或D），您需要了解一个叫做**灾难性遗忘**的概念。这是指神经网络在学习新示例时失去先前学习的信息的倾向。换句话说，当您用自定义示例微调一个顶级LLM时，您使其在之前拥有的一般知识上变得不那么准确。不仅如此，LLM通常不会100%准确地学习您的自定义事实，而是学习它们的一些接近总结或不完美的副本，这些信息在之前训练模型的权重和偏差中被稀释。
* 最后，LLM本身**无法告诉您提供的事实的确切引用或精确来源**，如果它们能做到这一点，很可能是它们对这些信息产生了幻觉。

因此，在应用微调于实际案例时，经过这一长串警告和复杂因素后，我们有一个更好的选择，适用于90%以上的情况：***Le RAG!***

💡 确保关注我的 [Medium](https://medium.com/@enricdomingo)、[YouTube](https://www.youtube.com/@enricd) 和 [GitHub](https://github.com/enricd)，在下一个博客和视频中，我们将看到如何将这个应用部署到Azure，使用GPT-4o和GPT-4o mini通过Azure OpenAI Service，并在我们的应用前添加SSO身份验证，以便只有在我们的Azure订阅下的授权用户（例如，您的工作同事）可以访问我们的应用，其他人将无法使用我们的资源或窃取我们的数据！

让我们进入代码吧！！ 💪🧑‍💻

## 2\. 🦜 使用 LangChain 的 RAG 步骤详解

让我们开始安装所有需要的 Python 库（我假设您已经安装了 Python ≥3\.9，使用 VSCode 或 PyCharm 等 IDE，并且使用 Windows、Linux/Ubuntu 或 MacOS 等操作系统）。

```python
## 创建一个文件夹，进入终端并使用 cd 进入该文件夹，然后：

$ python -m venv venv  # 可选
$ venv/scripts/activate  # 或者在 mac 和 linux 上使用 source venv/bin/activate， 可选

$ pip install python-dotenv streamlit langchain langchain-core langchain-community langchain-openai langchain-anthropic chromadb==0.5.3 langchain-chroma docx2txt pypdf bs4 ipykernel
```
在您的文件夹中创建一个名为 *.env* 的文件，并将您的 [OpenAI API 密钥](https://platform.openai.com/) 和可选的 [Anthropic API 密钥](https://console.anthropic.com/) 放入其中，如下所示（如果您还没有密钥，请查看链接）：

```python
## /.env

OPENAI_API_KEY="<your-openai-api-key>"
ANTHROPIC_API_KEY="<your-anthropic-api-key>"
```
确保创建一个 *.gitignore* 文件，并将 *.env* 文件添加到其中：

```python
## /.gitignore

.env
venv/
__pycache__
```
现在让我们创建一个 Jupyter Notebook，看看如何使用 LangChain 的 RAG 方法，我将其命名为 *langchain\_rag.ipynb*。

在其中，让我们在第一个单元中导入所有需要的库：

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
现在，让我们实现之前看到的 6 个步骤：加载、拆分、嵌入、存储、检索和增强生成：

**加载：** 我们将使用一些最常见的 LangChain 文档加载方法，您可以在这里查看所有可用的方法，并为您的特定用例应用更多自定义的方法：[LangChain 文档加载器](https://python.langchain.com/v0.2/docs/integrations/document_loaders/)。

在下面的单元中，我们将加载 pdf、docx、txt 和 markdown 文档，还将从其 URL 加载网站的文本内容。在项目文件夹中，我创建了一个 *docs/* 文件夹，并放置了一些 test\_rag 文档，其中包含一些随机信息以验证其确实有效，对于 URL，我正在测试 Streamlit 文档的更新日志，我将询问 LLM 关于最新版本的信息：

```python
## 加载文档

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
            print(f"文档类型 {doc_file.type} 不支持。")
            continue

        docs.extend(loader.load())

    except Exception as e:
        print(f"加载文档 {doc_file.name} 时出错: {e}")
    
    finally:
        os.remove(file_path)


## 加载 URL

url = "https://docs.streamlit.io/develop/quick-reference/release-notes"
try:
    loader = WebBaseLoader(url)
    docs.extend(loader.load())

except Exception as e:
    print(f"从 {url} 加载文档时出错: {e}")


```
**拆分：** 现在，我们将使用 *RecursiveCharacterTextSplitter* 将每个文档拆分为 5000 个字符的块，重叠 1000 个字符，以免将任何上下文切成两半。

```python
## 拆分文档

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=5000,
    chunk_overlap=1000,
)

document_chunks = text_splitter.split_documents(docs)
```
**嵌入和存储：** 我们将使用 Chroma DB 的单个方法来使用 OpenAI Embeddings 模型对文本进行标记，并将其存储在本地 Chroma DB 向量存储中。

```python
## 对文档进行标记并加载到向量存储中

vector_db = Chroma.from_documents(
    documents=document_chunks,
    embedding=OpenAIEmbeddings(),
)
```
现在我们已经将向量存储加载并准备好进行检索。让我们创建检索的管道：

**检索：** 有不同的算法和方法可供检索，有些更基础，有些更复杂。在这里，我们将使用一种中等的方式，它不仅考虑用户的最后一个问题，还考虑之前的所有对话，以便从向量存储中获取相关信息：

```python
def _get_context_retriever_chain(vector_db, llm):
    retriever = vector_db.as_retriever()
    prompt = ChatPromptTemplate.from_messages([
        MessagesPlaceholder(variable_name="messages"),
        ("user", "{input}"),
        ("user", "根据以上对话，生成一个搜索查询，以查找与对话相关的信息，重点关注最新的消息。"),
    ])
    retriever_chain = create_history_aware_retriever(llm, retriever, prompt)

    return retriever_chain
```
此函数将用于获取给定对话中最有用的信息块，以下方法将使用这些块向 LLM 发出查询：

```python
def get_conversational_rag_chain(llm):
    retriever_chain = _get_context_retriever_chain(vector_db, llm)

    prompt = ChatPromptTemplate.from_messages([
        ("system",
        """您是一个有用的助手。您将需要回答用户的查询。
        您将拥有一些上下文来帮助回答，但并不总是完全相关或有帮助。
        您还可以利用您的知识来协助回答用户的查询。\n
        {context}"""),
        MessagesPlaceholder(variable_name="messages"),
        ("user", "{input}"),
    ])
    stuff_documents_chain = create_stuff_documents_chain(llm, prompt)

    return create_retrieval_chain(retriever_chain, stuff_documents_chain)
```
**增强生成：** 最后，我们将使用前面的方法向 LLM 查询，并在请求中自动添加相关上下文。我们需要创建 LLM Chat 对象，具有流式能力，以便稍后可以使用它们构建聊天网页应用程序，以及消息历史：

```python
llm_stream_openai = ChatOpenAI(
    model="gpt-4o",  # 在这里，如果您已经可以访问，可以使用 "o1-preview" 或 "o1-mini"
    temperature=0.3,
    streaming=True,
)

llm_stream_anthropic = ChatAnthropic(
    model="claude-3-5-sonnet-20240620",
    temperature=0.3,
    streaming=True,
)

llm_stream = llm_stream_openai  # 在 OpenAI 和 Anthropic 模型之间选择以获取响应

messages = [
    {"role": "user", "content": "嗨"},
    {"role": "assistant", "content": "你好！今天我能帮助您什么？"},
    {"role": "user", "content": "Streamlit 的最新版本是什么？"},
]
messages = [HumanMessage(content=m["content"]) if m["role"] == "user" else AIMessage(content=m["content"]) for m in messages]

conversation_rag_chain = get_conversational_rag_chain(llm_stream)
response_message = "*(RAG 响应)*\n"
for chunk in conversation_rag_chain.pick("answer").stream({"messages": messages[:-1], "input": messages[-1].content}):
    response_message += chunk
    print(chunk, end="", flush=True)

messages.append({"role": "assistant", "content": response_message})
```
如果我们一切顺利，现在我们应该可以看到 LLM 的响应被流式传输。当 LLM 被训练时，Streamlit 的最新版本可能是 1\.34，但现在它通过我们与 Streamlit 更新和更新日志的 RAG 连接，知道了最新的版本！🔥 您可以对任何其他自定义用例做同样的事情。

使用 LangChain 的一个好处是不同 LLM 提供者之间的易于互操作性。我们可以几乎不更改代码地在它们之间切换。

让我们让这个项目更具互动性并便于每个人使用：让我们构建一个 RAG 聊天机器人网站，随后将其在线发布！

## 3\. 👨‍💻 将 RAG 集成到 LLM 聊天网页应用中

我们已经看到如何在 Streamlit 中构建一个多模态聊天网页应用，针对：

* OpenAI 模型，如 GPT-4o: [博客和视频链接](https://readmedium.com/code-the-omnichat-app-integrating-gpt-4o-your-python-chatgpt-d399b90d178e)
* Google DeepMind 模型，如 Gemini 1.5: [博客和视频链接](https://readmedium.com/how-i-add-gemini-1-5-pro-api-to-my-app-chat-with-videos-images-and-audios-f42171606143)
* Anthropic 模型，如 Claude 3.5 Sonnet: [博客和视频链接](https://readmedium.com/claude-sonnet-3-5-api-integrating-the-best-llm-into-our-app-7ec4623e2dac)

在这里，我们将跳过一些构建代码的细节，因为我们已经在这些博客中看到过，但基本上，我们将创建一个 ***/rag_methods.py*** 文件，以声明我们在 */langchain_rag.ipynb* 笔记本中刚刚开发和实验的所有需要的 LLM 和 RAG 方法。

然后，我们将创建 */app.py* 文件，在其中开发所有 Streamlit 逻辑以创建网站，导入所有先前开发的 RAG 方法。

### /rag\_methods.py

逻辑和方法几乎与之前相同，但进行了调整以使其在Streamlit中工作，使用 *st.session\_state* 来管理消息对话，同时为每个用户附加Chroma DB向量存储，将其附加到每个用户的会话中，但保留最多20个，以确保我们不会溢出有限的服务器内存。您可以根据自己的用例和云基础设施修改这些限制。

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
    page_title="RAG LLM 应用？", 
    page_icon="📚", 
    layout="centered", 
    initial_sidebar_state="expanded"
)


## --- Header ---
st.html("""<h2 style="text-align: center;">📚🔍 <i> 你的 LLM 真的 RAG 吗？ </i> 🤖💬</h2>""")


## --- Initial Setup ---
if "session_id" not in st.session_state:
    st.session_state.session_id = str(uuid.uuid4())

if "rag_sources" not in st.session_state:
    st.session_state.rag_sources = []

if "messages" not in st.session_state:
    st.session_state.messages = [
        {"role": "user", "content": "你好"},
        {"role": "assistant", "content": "你好！今天我能帮你什么？"}
]


## --- Side Bar LLM API Tokens ---
with st.sidebar:
    default_openai_api_key = os.getenv("OPENAI_API_KEY") if os.getenv("OPENAI_API_KEY") is not None else ""  # 仅用于开发环境，否则应返回 None
    with st.popover("🔐 OpenAI"):
        openai_api_key = st.text_input(
            "请输入你的 OpenAI API 密钥 (https://platform.openai.com/)", 
            value=default_openai_api_key, 
            type="password",
            key="openai_api_key",
        )

    default_anthropic_api_key = os.getenv("ANTHROPIC_API_KEY") if os.getenv("ANTHROPIC_API_KEY") is not None else ""
    with st.popover("🔐 Anthropic"):
        anthropic_api_key = st.text_input(
            "请输入你的 Anthropic API 密钥 (https://console.anthropic.com/)", 
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
    st.warning("⬅️ 请提供 API 密钥以继续...")

else:
    # Sidebar
    with st.sidebar:
        st.divider()
        st.selectbox(
            "🤖 选择一个模型", 
            [model for model in MODELS if ("openai" in model and not missing_openai) or ("anthropic" in model and not missing_anthropic)],
            key="model",
        )

        cols0 = st.columns(2)
        with cols0[0]:
            is_vector_db_loaded = ("vector_db" in st.session_state and st.session_state.vector_db is not None)
            st.toggle(
                "使用 RAG", 
                value=is_vector_db_loaded, 
                key="use_rag", 
                disabled=not is_vector_db_loaded,
            )

        with cols0[1]:
            st.button("清除聊天", on_click=lambda: st.session_state.messages.clear(), type="primary")

        st.header("RAG 来源:")
            
        # File upload input for RAG with documents
        st.file_uploader(
            "📄 上传文档", 
            type=["pdf", "txt", "docx", "md"],
            accept_multiple_files=True,
            on_change=load_doc_to_db,
            key="rag_docs",
        )

        # URL input for RAG with websites
        st.text_input(
            "🌐 输入一个 URL", 
            placeholder="https://example.com",
            on_change=load_url_to_db,
            key="rag_url",
        )

        with st.expander(f"📚 数据库中的文档 ({0 if not is_vector_db_loaded else len(st.session_state.rag_sources)})"):
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

    if prompt := st.chat_input("你的消息"):
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
现在，您可以通过进入终端在本地运行网站：


```python
## cd 到项目文件夹并激活虚拟环境

$ streamlit run app.py
```
如果一切设置正确，您应该在浏览器的 localhost:8501 中看到以下内容：

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*lGbTqfd6J9Gq4F53nDUtNw.png)

您可以尝试与它聊天而无需文档，然后加载任何您想尝试的 pdf、txt、docx 或 URL，并询问有关它的具体问题，以验证它是否真的有效。

太好了！让我们把它发布到我们的计算机之外，让我们在 Streamlit Cloud 上免费部署这个网站。请记住，在下一个博客和视频中，我们将看到如何在 Azure 上部署它，使用更强大的机器，更高的安全性以及添加 SSO 身份验证的可能性。如果您想看到如何在其他云提供商（如 AWS）上部署它，请在评论中告诉我。 🤗

## 4\. 🚀 免费在线部署 RAG 网络应用程序！

我们在之前的博客中已经看到如何轻松地将 Streamlit 网站免费部署到 Streamlit 云中，但让我们再次看看步骤：

* 如果你还没有创建 Git 仓库，请创建一个：

```python
## cd 到你的项目文件夹，确保 .gitignore 正确设置

$ venv/scripts/activate  # 或 source venv/bin/activate

$ pip freeze > requirements.txt

## 在 requirements.txt 文件顶部添加以下行：pysqlite3-binary; sys_platform == 'linux'

$ git init -b main

$ git add .

$ git commit -m "complete project"
```
* 访问 [github.com](https://github.com) （如果你还没有账号，请创建一个）并创建一个新的仓库。按照那里提供的步骤上传（推送）现有的本地项目。
* 访问 [streamlit.io](https://streamlit.io/)，使用你的 GitHub 账号注册，并使用右上角的按钮创建一个新的应用程序，选择你已经有一个应用程序。
* 现在，如果你正确地将你的 GitHub 账号与 Streamlit 关联，选择下拉菜单中的应用程序仓库，选择主分支，告诉它主文件路径是 *app.py*，并记得为你的应用程序选择一个可用、简短且酷炫的子域名。
* 部署，1-2 分钟后你应该能看到你的应用程序公开运行！🚀
* 如果有任何错误或问题，你可以从右下角的按钮调试，它会显示服务器日志，任何错误都会打印出来，以便你更好地理解出现了什么问题。

我希望你喜欢这个内容，RAG 应用程序确实是使 LLM 更加适用于无数小众和高级应用的下一步。你可以根据我们在这里看到的内容适应许多其他用例，利用其他替代的 LangChain 方法，或使用外部 Vector Store 服务，这样你就不必在本地运行 Chroma DB。

确保点赞这篇文章，关注我的 Medium 和 YouTube，评论任何问题和反馈，我们下次见！！🤗 谢谢！

