---
title: "Agentic RAG Series: Exploring LangGraph for Advanced Workflows"
meta_title: "Agentic RAG Series: Exploring LangGraph for Advanced Workflows"
description: "The article discusses LangGraph, an innovative framework for creating advanced multi-agent systems within the Agentic Retrieval-Augmented Generation (RAG) architecture. LangGraph enhances workflow orchestration, tool integration, scalability, and flexibility, allowing for intelligent agent interactions. It outlines the architecture, key advantages, and a detailed code breakdown for a Document Q&A Assistant that processes URLs and PDFs, evaluates document relevance, and generates responses. The integration with tools like LangChain and Chroma is emphasized, showcasing LangGraphs capability to support complex, dynamic workflows in AI applications."
date: 2024-12-26T01:37:50Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*WTisqw_ypLsMp2mf"
categories: ["Programming", "Machine Learning", "Chatbots"]
author: "Rifx.Online"
tags: ["LangGraph", "RAG", "LangChain", "Chroma", "workflows"]
draft: False

---







### Stuck behind a paywall? Read for Free!


## Introduction

In the previous article, we introduced the concept of **Agentic RAG**, highlighting how it extends the traditional Retrieval\-Augmented Generation (RAG) framework by integrating autonomous agent capabilities. In this installment, we delve into **LangGraph**, an innovative framework for orchestrating logical workflows. LangGraph enables the creation of multi\-agent systems with sophisticated reasoning capabilities, making it an ideal tool for building Agentic RAG architectures.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*FdR0wG5Y9IbCZ909-G_1lQ.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*q9GUYeVrR_lzBCW4uDDhUQ.png)


## Why LangGraph for Agentic RAG?

**LangGraph** provides a robust environment for creating stateful workflows, where agents interact intelligently across nodes, tools, and tasks. Its compatibility with **LangChain** and other advanced AI frameworks allows seamless integration with retrieval and generation pipelines, making it a natural fit for the dynamic requirements of Agentic RAG.


### Key Advantages:

1. **Workflow Orchestration:** Define and manage multi\-step workflows with conditional logic and state management.
2. **Tool Integration:** Easily integrate external tools, APIs, and retrieval systems.
3. **Scalability:** Handle complex, multi\-agent workflows with minimal overhead.
4. **Flexibility:** Design workflows that adapt dynamically to context and input.


## If you like this article and want to show some love:

* **Clap** 50 times — each one helps more than you think! 👏
* **Follow** me here on [**Medium**](https://medium.com/@mauryaanoop3) and subscribe for free to catch my latest posts. 🫶
* Let’s connect on [**LinkedIn**](https://medium.com/towards-artificial-intelligence/www.linkedin.com/in/anoop-maurya-908499148), check out my projects on [**GitHub**](https://github.com/imanoop7), and stay in touch on [**Twitter**](https://x.com/imanoop_7)!
* If you found this project useful, don’t forget to ⭐ the repo on [**GitHub**](https://github.com/imanoop7/Agentic-RAG). It helps others find it too!


## LangGraph Architecture for Agentic RAG

A typical LangGraph workflow for Agentic RAG might include components for query rewriting, document retrieval, grading relevance, and generating responses.


### Flowchart: LangGraph Workflow in Agentic RAG


```python
[Start Query]
   |
   v
[Agent Node: Rewrite or Process Query]
   |
   +--> [Retrieve Documents: Knowledge Sources]
   |
   +--> [Grade Relevance]
   |
   +--> [Generate Response]
   |
   v
[End]
```
* **Start Query:** Accepts input queries from users.
* **Agent Node:** Determines the next step based on context and conditions.
* **Retrieve Documents:** Fetches relevant documents from knowledge repositories.
* **Grade Relevance:** Scores documents for contextual relevance to the query.
* **Generate Response:** Produces a final output using retrieved and processed data.


## Benchmarking LangGraph with Agentic RAG


### Experimental Setup

* **Dataset:** A mix of research papers, articles, and FAQs.
* **Evaluation Metrics:** Relevance, accuracy, response time, and workflow efficiency.
* **Baseline:** Traditional RAG vs. Agentic RAG with LangGraph.


### Results:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*_-j98OuAf923t0i1M7H6VA.png)


## Explanation of the Code:

This code defines a **Document Q\&A Assistant** that allows users to upload PDFs, provide URLs, or both, and then ask questions about the content in those documents. It utilizes the **LangChain framework**, **LangGraph**, and the **Ollama API** for embeddings and chat\-based responses. The assistant is built using the **Gradio library**, which provides an easy\-to\-use interface for interacting with the system.


### Code Breakdown:


### 1\. Imports

The code begins by importing necessary modules:

* **LangChain and LangGraph**: Used for document loading, vector store creation, embeddings, message handling, and graph\-based workflows.
* **Gradio**: Used to build a user\-friendly interface.
* **Pydantic**: Helps define and validate data structures.
* **Validators**: Used for checking URL validity.
* **Tempfile**: Creates temporary files for handling PDF uploads.


```python
from langchain_community.document_loaders import WebBaseLoader, PyPDFLoader
from langchain_community.vectorstores import Chroma
from langchain_ollama import OllamaEmbeddings, ChatOllama
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.tools.retriever import create_retriever_tool
from typing import Annotated, Sequence, Literal
from typing_extensions import TypedDict
from langchain_core.messages import BaseMessage, HumanMessage
from langgraph.graph.message import add_messages
from langchain import hub
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langgraph.graph import END, StateGraph, START
from langgraph.prebuilt import ToolNode, tools_condition
from pydantic import BaseModel, Field
import gradio as gr
import tempfile
import validators
from io import StringIO
```

### 2\. Data Structures

* **AgentState**: A `TypedDict` that tracks the agent's state, specifically a sequence of messages. This is used to maintain conversation context during interactions.


```python
class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]
```

### 3\. Processing Sources

* `process_sources(urls=None, pdf_files=None)`:
* Accepts URLs and/or PDF files as inputs.
* For URLs:
* Validates the format.
* Uses `WebBaseLoader` to load documents from the web.
* For PDFs:
* Temporarily saves the uploaded file.
* Uses `PyPDFLoader` to parse the PDF into documents.
* Returns a list of processed documents.


```python
def process_sources(urls=None, pdf_files=None):
    """Process both URLs and PDF files"""
    docs_list = []
    
    # Handle URLs
    if urls and urls.strip():
        url_list = [url.strip() for url in urls.split(",")]
        for url in url_list:
            if validators.url(url):
                try:
                    url_docs = WebBaseLoader(url).load()
                    docs_list.extend(url_docs)
                except Exception as e:
                    print(f"Error loading URL {url}: {e}")
    
    # Handle PDFs
    if pdf_files:
        for pdf in pdf_files:
            try:
                with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp:
                    tmp.write(pdf.read())
                    loader = PyPDFLoader(tmp.name)
                    docs_list.extend(loader.load())
            except Exception as e:
                print(f"Error loading PDF: {e}")
```

### 4\. Grading Document Relevance

* `grade_documents(state)`:
* Determines if a document is relevant to the user’s query.
* Uses `ChatOllama` with a specific prompt to grade documents as `yes` or `no`.
* The prompt asks the model to evaluate if the document’s content aligns with the user’s question.


```python
def grade_documents(state) -> Literal["generate", "rewrite"]:
    print("---CHECK RELEVANCE---")
    
    class grade(BaseModel):
        binary_score: str = Field(description="Relevance score 'yes' or 'no'")
    
    model = ChatOllama(temperature=0, model="llama3.2", streaming=True)
    llm_with_tool = model.with_structured_output(grade)
    
    prompt = PromptTemplate(
        template="""You are a grader assessing relevance of a retrieved document to a user question.
        Document: {context}
        Question: {question}
        If the document contains keyword(s) or semantic meaning related to the user question, grade it as relevant.
        Give a binary score 'yes' or 'no' score to indicate whether the document is relevant to the question.""",
        input_variables=["context", "question"],
    )
    
    chain = prompt | llm_with_tool
    
    messages = state["messages"]
    question = messages[0].content
    docs = messages[-1].content
    
    scored_result = chain.invoke({"question": question, "context": docs})
    return "generate" if scored_result.binary_score == "yes" else "rewrite"
```

### 5\. Core Agent Functions:

`agent(state)`:

* Handles general queries by invoking the agent’s LLM capabilities with the provided tools.


```python
def agent(state):
    print("---CALL AGENT---")
    messages = state["messages"]
    model = ChatOllama(temperature=0, streaming=True, model="llama3.2")
    model = model.bind_tools(tools)
    response = model.invoke(messages)
    return {"messages": [response]}
```
`rewrite(state)`:

* Reformulates the user’s query for better precision using semantic reasoning.


```python
def rewrite(state):
    print("---TRANSFORM QUERY---")
    messages = state["messages"]
    question = messages[0].content
    
    msg = [HumanMessage(content=f"""
    Look at the input and try to reason about the underlying semantic intent / meaning.
    Initial question: {question}
    Formulate an improved question:""")]
    
    model = ChatOllama(temperature=0, model="llama3.2", streaming=True)
    response = model.invoke(msg)
    return {"messages": [response]}
```
`generate(state)`:

* Uses a prebuilt RAG (Retrieve\-and\-Generate) prompt to answer the user’s query by leveraging relevant document content.


```python
def generate(state):
    print("---GENERATE---")
    messages = state["messages"]
    question = messages[0].content
    docs = messages[-1].content
    
    prompt = hub.pull("rlm/rag-prompt")
    llm = ChatOllama(temperature=0, streaming=True, model="llama3.2")
    rag_chain = prompt | llm | StrOutputParser()
    
    response = rag_chain.invoke({"context": docs, "question": question})
    return {"messages": [HumanMessage(content=response)]}
```

### 6\. Query Processing Workflow

`process_query(urls, pdf_files, query)`:

* First, processes the provided URLs and PDFs into a list of documents.
* Splits these documents into smaller chunks using a `RecursiveCharacterTextSplitter`.
* Embeds these chunks using `OllamaEmbeddings` and stores them in a **Chroma vector store**.
* A retriever tool is created to search through the vector store.
* A **LangGraph\-based workflow** is defined with nodes:
* `agent`: Manages conversation flow.
* `retrieve`: Searches for relevant documents.
* `rewrite`: Reformulates queries.
* `generate`: Produces the final answer.
* Workflow edges define transitions between these nodes based on conditions.
* Executes the graph to provide the user with a response to their query.


```python
def process_query(urls, pdf_files, query):
    docs_list = process_sources(urls, pdf_files)
    if not docs_list:
        return "No valid documents provided. Please input URLs or upload PDFs."
    
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=100, chunk_overlap=50)
    doc_splits = text_splitter.split_documents(docs_list)
    
    vectorstore = Chroma.from_documents(
        documents=doc_splits,
        collection_name="rag-chroma",
        embedding=OllamaEmbeddings(model="nomic-embed-text"),
    )
    retriever = vectorstore.as_retriever()
    
    global tools
    tools = [create_retriever_tool(
        retriever,
        "retrieve_documents",
        "Search and return information from the provided documents."
    )]
    
    workflow = StateGraph(AgentState)
    workflow.add_node("agent", agent)
    workflow.add_node("retrieve", ToolNode(tools))
    workflow.add_node("rewrite", rewrite)
    workflow.add_node("generate", generate)
    
    workflow.add_edge(START, "agent")
    workflow.add_conditional_edges(
        "agent",
        tools_condition,
        {"tools": "retrieve", END: END},
    )
    workflow.add_conditional_edges(
        "retrieve",
        grade_documents,
        {"generate": "generate", "rewrite": "rewrite"},
    )
    workflow.add_edge("generate", END)
    workflow.add_edge("rewrite", "agent")
    
    graph = workflow.compile()
    
    inputs = {"messages": [HumanMessage(content=query)]}
    response = ""
    for output in graph.stream(inputs):
        for key, value in output.items():
            if value.get("messages"):
                response = value["messages"][-1].content
    
    return response
```

### 7\. Gradio Interface

`create_interface()`:

* Builds a Gradio interface with two tabs:

**Upload Documents**:

* Textbox for URLs.
* File uploader for PDFs.
* Button to process documents.
* Status box to display processing results.

**Chat**:

* Textbox for user queries.
* Button to initiate the query.
* Textbox to display the response.


```python
def create_interface():
    with gr.Blocks(title="Document Q&A Assistant") as interface:
        gr.Markdown("# Document Q&A Assistant")
        gr.Markdown("*You can provide URLs, PDF files, or both*")
        
        with gr.Tab("Upload Documents"):
            urls = gr.Textbox(label="Enter URLs (comma separated)", placeholder="https://example1.com, https://example2.com")
            pdfs = gr.File(file_count="multiple", label="Upload PDF files", file_types=[".pdf"])
            upload_btn = gr.Button("Process Documents")
            upload_status = gr.Textbox(label="Upload Status")
            
            def handle_upload(urls, pdfs):
                if not urls and not pdfs:
                    return "Please provide either URLs, PDF files, or both"
                docs = process_sources(urls, pdfs)
                if docs:
                    return "Documents processed successfully!"
                return "No valid documents provided. Please input valid URLs or PDF files"
            
            upload_btn.click(
                fn=handle_upload,
                inputs=[urls, pdfs],
                outputs=upload_status
            )
        
        with gr.Tab("Chat"):
            query = gr.Textbox(label="Ask a question about the documents")
            chat_btn = gr.Button("Ask")
            response = gr.Textbox(label="Response")
            
            chat_btn.click(
                fn=process_query,
                inputs=[urls, pdfs, query],
                outputs=response
            )
            
    return interface
```

### 8\. Application Launch

* The Gradio interface is launched when the script is executed.


```python
interface = create_interface()

if __name__ == "__main__":
    interface.launch()
```

## Key Features Highlighted:

**Multimodal Document Support**:

* Supports URLs and PDFs simultaneously.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*vah5AK1CD8BREdcNCcEggw.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*j7dpCN5gRDHBXrMq9VszqQ.png)

**Relevance Grading**:

* Ensures responses are based on the most relevant documents.

**Workflow Graph**:

* Leverages `StateGraph` to dynamically decide on actions (e.g., rewrite, retrieve, generate).

**Embeddings and Vector Search**:

* Utilizes `OllamaEmbeddings` and **Chroma vector store** for efficient document retrieval.

**Interactive UI**:

* Uses **Gradio** for an accessible, no\-code interface.


## Conclusion

LangGraph is a pivotal tool for advancing Agentic RAG by enabling dynamic, multi\-agent workflows that adapt to complex scenarios. Its seamless integration with tools like LangChain, Chroma, and ChatOllama ensures that developers can efficiently build scalable and intelligent retrieval\-augmented systems.

In the next article, we’ll explore **AutoGen** and its role in automating agent reasoning within the Agentic RAG framework.


## Additional Resource:

**Complete Code:**[https://github.com/imanoop7/Agentic\-RAG](https://github.com/imanoop7/Agentic-RAG)**Ollama Official WebSite:** <https://ollama.com/>**Ollama Github:** [https://github.com/ollama/ollama?tab\=readme\-ov\-file](https://github.com/ollama/ollama?tab=readme-ov-file)**Cheat Sheet:** [https://cheatsheet.md/llm\-leaderboard/ollama.en](https://cheatsheet.md/llm-leaderboard/ollama.en)**Langgraph :**[https://langchain\-ai.github.io/langgraph/](https://langchain-ai.github.io/langgraph/)**My GitHub:** <https://github.com/imanoop7>**LinkedIn:** [www.linkedin.com/in/anoop\-maurya\-908499148](http://www.linkedin.com/in/anoop-maurya-908499148)**X:** <https://x.com/imanoop_7>


