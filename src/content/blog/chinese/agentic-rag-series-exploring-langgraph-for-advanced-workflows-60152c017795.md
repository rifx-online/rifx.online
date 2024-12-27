---
title: "代理 RAG 系列：探索 LangGraph 高级工作流程"
meta_title: "代理 RAG 系列：探索 LangGraph 高级工作流程"
description: "本文探讨了**LangGraph**在构建**Agentic RAG**架构中的应用，强调其在协调复杂工作流程中的优势。LangGraph支持多代理系统的创建，具备工作流编排、工具集成和灵活性等特性，适合动态需求。文章还介绍了基于LangGraph的工作流程，包括查询处理、文档检索和响应生成，并提供了相关代码示例，展示其在处理多模态文档时的有效性和高效性。"
date: 2024-12-27T11:09:55Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*WTisqw_ypLsMp2mf"
categories: ["Programming", "Machine Learning", "Chatbots"]
author: "Rifx.Online"
tags: ["LangGraph", "RAG", "workflows", "LangChain", "scalability"]
draft: False

---



## 介绍

在上一篇文章中，我们介绍了**Agentic RAG**的概念，强调它如何通过集成自主代理能力来扩展传统的检索增强生成（RAG）框架。在本期中，我们深入探讨**LangGraph**，这是一个用于协调逻辑工作流程的创新框架。LangGraph使得创建具有复杂推理能力的多代理系统成为可能，是构建Agentic RAG架构的理想工具。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*FdR0wG5Y9IbCZ909-G_1lQ.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*q9GUYeVrR_lzBCW4uDDhUQ.png)

## 为什么选择 LangGraph 进行 Agentic RAG？

**LangGraph** 提供了一个强大的环境，用于创建有状态的工作流，代理在节点、工具和任务之间智能地互动。它与 **LangChain** 及其他高级 AI 框架的兼容性使得与检索和生成管道的无缝集成成为可能，完美契合了 Agentic RAG 的动态需求。

### 主要优势：

1. **工作流编排：** 定义和管理具有条件逻辑和状态管理的多步骤工作流。
2. **工具集成：** 容易集成外部工具、API 和检索系统。
3. **可扩展性：** 以最小的开销处理复杂的多代理工作流。
4. **灵活性：** 设计能够动态适应上下文和输入的工作流。

## 如果你喜欢这篇文章并想表达一些支持：

* **拍手** 50 次——每一次的支持都比你想象的更有帮助！ 👏
* **关注** 我在 [**Medium**](https://medium.com/@mauryaanoop3)，免费订阅以获取我的最新帖子。 🫶
* 让我们在 [**LinkedIn**](https://medium.com/towards-artificial-intelligence/www.linkedin.com/in/anoop-maurya-908499148) 上连接，查看我在 [**GitHub**](https://github.com/imanoop7) 上的项目，并在 [**Twitter**](https://x.com/imanoop_7) 上保持联系！
* 如果你觉得这个项目有用，不要忘记在 [**GitHub**](https://github.com/imanoop7/Agentic-RAG) 上给这个仓库 ⭐。这也帮助其他人找到它！

## LangGraph 架构用于 Agentic RAG

一个典型的 LangGraph 工作流用于 Agentic RAG 可能包括查询重写、文档检索、相关性评分和生成响应的组件。

### 流程图：Agentic RAG 中的 LangGraph 工作流程

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

* **Start Query:** 接收用户输入的查询。
* **Agent Node:** 根据上下文和条件确定下一步。
* **Retrieve Documents:** 从知识库中获取相关文档。
* **Grade Relevance:** 对文档进行评分，以评估其与查询的上下文相关性。
* **Generate Response:** 使用检索和处理的数据生成最终输出。

## 使用 Agentic RAG 对 LangGraph 进行基准测试

### 实验设置

* **数据集：** 研究论文、文章和常见问题的混合。
* **评估指标：** 相关性、准确性、响应时间和工作流程效率。
* **基准：** 传统的 RAG 与使用 LangGraph 的 Agentic RAG。

### 结果:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*_-j98OuAf923t0i1M7H6VA.png)

## 代码说明：

该代码定义了一个 **文档问答助手**，允许用户上传PDF文件、提供URL或两者兼而有之，然后询问有关这些文档内容的问题。它利用 **LangChain框架**、**LangGraph** 和 **Ollama API** 进行嵌入和基于聊天的响应。该助手使用 **Gradio库** 构建，提供了一个易于使用的界面，以便与系统进行交互。

### 代码解析：

### 1\. 导入

代码开始时导入必要的模块：

* **LangChain 和 LangGraph**：用于文档加载、向量存储创建、嵌入、消息处理和基于图的工作流程。
* **Gradio**：用于构建用户友好的界面。
* **Pydantic**：帮助定义和验证数据结构。
* **Validators**：用于检查 URL 的有效性。
* **Tempfile**：创建临时文件以处理 PDF 上传。

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

### 2\. 数据结构

* **AgentState**: 一个 `TypedDict`，用于跟踪代理的状态，特别是一系列消息。它用于在交互过程中维护对话上下文。

```python
class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]
```

### 3\. 处理来源

* `process_sources(urls=None, pdf_files=None)`:
* 接受 URL 和/或 PDF 文件作为输入。
* 对于 URL：
* 验证格式。
* 使用 `WebBaseLoader` 从网络加载文档。
* 对于 PDF：
* 临时保存上传的文件。
* 使用 `PyPDFLoader` 将 PDF 解析为文档。
* 返回处理后的文档列表。

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

### 4\. 文档相关性评分

* `grade_documents(state)`:
* 确定文档是否与用户的查询相关。
* 使用 `ChatOllama` 和特定提示将文档评分为 `yes` 或 `no`。
* 提示要求模型评估文档内容是否与用户的问题一致。

```python
def grade_documents(state) -> Literal["generate", "rewrite"]:
    print("---CHECK RELEVANCE---")
  
    class grade(BaseModel):
        binary_score: str = Field(description="相关性评分 'yes' 或 'no'")
  
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

### 5\. 核心代理功能：

`agent(state)`:

* 通过调用代理的 LLM 功能和提供的工具来处理一般查询。

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

* 使用语义推理重新表述用户的查询，以提高精确度。

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

* 使用预构建的 RAG（检索与生成）提示来回答用户的查询，利用相关文档内容。

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

### 6\. 查询处理工作流程

`process_query(urls, pdf_files, query)`:

* 首先，将提供的URLs和PDF处理成文档列表。
* 使用`RecursiveCharacterTextSplitter`将这些文档拆分成更小的块。
* 使用`OllamaEmbeddings`对这些块进行嵌入，并将其存储在**Chroma向量存储**中。
* 创建一个检索工具以在向量存储中进行搜索。
* 定义一个基于**LangGraph**的工作流程，包含节点：
* `agent`: 管理对话流程。
* `retrieve`: 搜索相关文档。
* `rewrite`: 重新表述查询。
* `generate`: 生成最终答案。
* 工作流程边缘根据条件定义这些节点之间的转换。
* 执行图形以向用户提供查询的响应。

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

### 7\. Gradio 界面

`create_interface()`:

* 构建一个带有两个标签的 Gradio 界面：

**上传文档**：

* 输入框用于输入 URL。
* 文件上传器用于上传 PDF 文件。
* 处理文档的按钮。
* 状态框显示处理结果。

**聊天**：

* 用户查询的输入框。
* 启动查询的按钮。
* 显示响应的输入框。

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

### 8\. 应用程序启动

* 当脚本被执行时，Gradio 界面被启动。

```python
interface = create_interface()

if __name__ == "__main__":
    interface.launch()
```

## 关键特性亮点：

**多模态文档支持**：

* 同时支持 URLs 和 PDFs。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*vah5AK1CD8BREdcNCcEggw.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*j7dpCN5gRDHBXrMq9VszqQ.png)

**相关性评分**：

* 确保响应基于最相关的文档。

**工作流图**：

* 利用 `StateGraph` 动态决定行动（例如，重写、检索、生成）。

**嵌入和向量搜索**：

* 使用 `OllamaEmbeddings` 和 **Chroma 向量存储** 进行高效的文档检索。

**交互式用户界面**：

* 使用 **Gradio** 提供可访问的无代码界面。

## 结论

LangGraph 是推动 Agentic RAG 发展的关键工具，通过支持动态的多代理工作流程，能够适应复杂场景。它与 LangChain、Chroma 和 ChatOllama 等工具的无缝集成确保开发者能够高效构建可扩展的智能检索增强系统。

在下一篇文章中，我们将探讨 **AutoGen** 及其在 Agentic RAG 框架中自动化代理推理的作用。

## 其他资源：

**完整代码:** [https://github.com/imanoop7/Agentic\-RAG](https://github.com/imanoop7/Agentic-RAG) **Ollama 官方网站:** [https://ollama.com/](https://ollama.com/) **Ollama GitHub:** [https://github.com/ollama/ollama?tab\=readme\-ov\-file](https://github.com/ollama/ollama?tab=readme-ov-file) **备忘单:** [https://cheatsheet.md/llm\-leaderboard/ollama.en](https://cheatsheet.md/llm-leaderboard/ollama.en) **Langgraph:** [https://langchain\-ai.github.io/langgraph/](https://langchain-ai.github.io/langgraph/) **我的 GitHub:** [https://github.com/imanoop7](https://github.com/imanoop7) **LinkedIn:** [www.linkedin.com/in/anoop\-maurya\-908499148](http://www.linkedin.com/in/anoop-maurya-908499148) **X:** [https://x.com/imanoop_7](https://x.com/imanoop_7)


