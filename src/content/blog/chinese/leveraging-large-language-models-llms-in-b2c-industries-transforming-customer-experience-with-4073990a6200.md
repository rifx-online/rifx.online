---
title: "在 B2C 行业中利用大型语言模型 (LLM)：在 B2C 行业中利用大型语言模型 (LLM)：..."
meta_title: "在 B2C 行业中利用大型语言模型 (LLM)：在 B2C 行业中利用大型语言模型 (LLM)：..."
description: "在B2C行业中，企业利用大型语言模型（LLMs）和自主代理显著提升客户体验，尤其在金融服务、零售和电子商务领域。通过基于检索增强生成（RAG）的方法，这些代理能够提供实时、智能的响应，增强客户满意度并降低对人工支持的依赖。文章详细介绍了如何创建一个处理信用卡查询的自主代理，包括数据源的使用、嵌入与向量数据库的创建、提示工程的应用，以及如何通过Flask或Streamlit进行部署，展现了LLMs在提供个性化客户服务方面的潜力。"
date: 2024-11-16T01:24:58Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Zf15fyqPpBcoEHf6G5rgbw.jpeg"
categories: ["Programming", "Machine Learning", "Chatbots"]
author: "Rifx.Online"
tags: ["LLMs", "RAG", "embeddings", "vector", "Flask"]
draft: False

---





在金融服务、零售和电子商务等B2C行业快速发展的环境中，客户对个性化和即时响应的期望达到了前所未有的高度。随着人工智能技术的进步，尤其是大型语言模型（LLMs）的发展，企业在处理客户互动方面发生了剧烈变化。在银行和信用卡服务等行业，客户经常寻求有关产品、福利或交易的详细信息，因此采用基于LLM的自主代理提供了显著的优势。这些代理能够提供实时、智能的响应，转变客户参与方式，同时提高运营效率。

根据我在金融服务行业AI产品开发的经验，这些基于LLM的代理在正确实施时，可以成为游戏规则的改变者。它们提供可扩展的、上下文感知的客户支持，不仅提高了客户满意度，还减少了对人工代理的依赖。但我们如何开发这些智能系统呢？下面，我将带您了解创建一个用于处理与信用卡产品相关的客户查询的代理检索增强生成（RAG）系统的业务问题，并解释LLMs、嵌入、向量数据库和提示工程如何在这个解决方案中结合在一起。

## 商业问题：创建一个用于信用卡查询的自主代理

想象一下，一家主要的金融服务公司向其客户提供多种信用卡产品。处理客户关于不同信用卡产品的特性、福利、利率和奖励计划的查询是一个劳动密集型的过程。目标是开发一个能够自主、准确并具备深刻上下文理解能力的人工智能代理，以处理大量问题。

### 用于代理RAG开发的数据源

对于这个用例，我们将使用来自花旗银行的公共数据源，其中包含一系列信用卡产品的详细信息，可以保存为PDF格式。这些文档包含回答客户关于花旗银行信用卡产品查询所需的信息：[花旗信用卡概述](https://www.citi.com/credit-cards/compare/view-all-credit-cards?intc=citicard_vac_202405_AB)。完整的代码库和逐步的笔记本可以在这个[git仓库](https://github.com/nitsourish/Conversational_AIchatbot)中找到。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*rNgsnBXq0R-RnKfSVCQ26Q.png)

## 嵌入与向量数据库创建

为了使AI代理能够从可用的产品PDF中检索相关信息，第一步是创建嵌入。嵌入是文本的向量表示，允许模型在连续的向量空间中捕捉单词、短语甚至完整文档的语义意义。

在这个用例中，下载并处理包含不同信用卡详细信息的PDF文件。使用预训练语言模型 **text-embedding-3-small**，我们将文本数据转换为稠密的向量表示。这些向量存储在向量数据库中，从而实现高效的相似性搜索。

**关键步骤：**

1. **数据摄取**：解析并将花旗银行信用卡产品的PDF转换为文本格式。

```python
for file in os.listdir("../credit_card_products"):
    if file.endswith(".pdf"):
        loaders.append(file)     
pdf_loaders = [PyPDFLoader(f"../credit_card_products/{file}") for file in loaders]

pages = []

for loader in pdf_loaders:
    pages.extend(loader.load())
```
**2\. 切分**：将文本拆分为块，使用换行符 (`"\n"`) 作为分隔符。每个块具有一定的字符重叠。这有助于确保在嵌入或检索等下游处理过程中的文本分割更为顺畅。

```python
text_splitter = CharacterTextSplitter(
    separator="\n",
    chunk_size=1500,
    chunk_overlap=100,
    length_function=len
)
docs = text_splitter.split_documents(pages)
```
**3\. 嵌入创建与向量数据库**：使用基于LLM的嵌入模型将预处理的文本转换为向量表示，并将嵌入存储在如Pinecone、FAISS或基于MongoDB的自定义解决方案等向量数据库中。我们在这里使用FAISS（Facebook AI相似性搜索）。这将允许对大量文档集进行快速、可扩展的搜索。

```python
embeddings_model = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY, model="text-embedding-3-small")
## Load it into the vector store and embed
vectordb = FAISS.from_documents(docs, embeddings_model)
```

## 大型语言模型 (LLM) 和检索增强生成 (RAG)

LLM，例如 GPT 模型，在生成类人文本方面非常强大，但当与 RAG 系统配对时，它们的能力得到了增强，显著减少了大型语言模型 (LLM) 的幻觉，并使自主代理能够提供可靠且具有上下文意识的信息。检索增强生成 (RAG) 通过将其响应生成与从向量数据库检索的相关外部知识相结合，来提高 LLM 的性能。在现实世界中，检索来源可以是任何东西，从企业向量数据库到私有或公共网址（维基百科、谷歌文档等）。

在我们的信用卡代理的上下文中，客户查询可能包括：“Citi 的 Costco Anywhere Visa® Card 的利率 (APR) 是多少？”基于 RAG 的系统将分两步工作：

**1\. 检索**：使用向量数据库根据与查询的嵌入相似性获取相关的花旗信用卡 PDF 的部分内容。

```python
retriever = vectordb.as_retriever(search_type="similarity", search_kwargs={"k": 6})
```
**2\. 生成**：LLM 获取检索到的上下文，并生成直接回答客户问题的详细且准确的响应。

```python
question = """ """

ai_msg = rag.invoke({"input": question, "chat_history": retriever})

```
这种方法确保代理的响应既基于真实数据（从数据库中检索）又具有上下文相关性。

## 提升交互的提示工程

部署基于LLM的代理的一个重要方面是提示工程。在这个过程中，精心设计的提示引导LLM生成准确且具有上下文相关性的输出。当回答与信用卡产品相关的查询时，代理需要能够理解用户意图，从数据库中检索正确的信息，并以对话的方式进行回应。

有效提示工程的示例包括：

* **上下文跟进**：清晰地解释角色和信息领域。我们在这里使用来自*langchain_core*的*ChatPromptTemplate*。


```python
qa_system_prompt = """You are an assistant for question-answering tasks. \
Use the following pieces of retrieved context to answer the question. \
If you don't know the answer, just say that you don't know. \
Use three sentences maximum and keep the answer concise.\

{context}"""

qa_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", qa_system_prompt),
        ("human", "{input}"),
    ]
)
```
通过微调提示并确保其涵盖查询的各个角度，AI代理能够利用最佳的上下文和指令提供更好的客户体验。

## 检索聊天历史以增强上下文意识

AI驱动的客户服务面临的挑战之一是，在一系列互动中提供连贯且具有上下文意识的回应。例如，客户可能在一次会话中对信用卡产品提出多个问题。为了保持对话的流畅性，系统必须跟踪先前的互动。

```python
system_prompt = """Given the chat history and a recent user question \
generate a new standalone question \
that can be understood without the chat history. Do NOT answer the question, \
just reformulate it if needed or otherwise return it as is."""

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ]
)

retriever_with_history = create_history_aware_retriever(
    llm, retriever, prompt
)
```
检索聊天历史帮助代理保持上下文并提供更个性化的回应。这在客户提出后续问题或在多个产品之间切换的情况下尤其重要。系统确保早期的数据点（例如，客户正在讨论的产品）仍然是当前对话的一部分。

## Langchain：协调代理

Langchain 是连接所有这些组件的关键工具：LLMs、向量数据库、RAG 系统和外部 API。它提供了一个集成框架，用于构建这些自主代理，简化开发过程，并确保代理在不同任务之间无缝工作，包括检索、上下文生成和响应制定。

```python
llm = ChatOpenAI(openai_api_key=OPENAI_API_KEY, model="gpt-3.5-turbo-0125")
question_answer_chain = create_stuff_documents_chain(llm, qa_system_prompt)

retriever_with_history = create_history_aware_retriever(
    llm, retriever, prompt
)

chat_history = [""" """]
rag_chain = create_retrieval_chain(retriever_with_history, question_answer_chain)
ai_msg = rag_chain.invoke({"input": question, "chat_history": chat_history}
chat_history.append([HumanMessage(content=question),ai_msg["answer"]])
```
Langchain 的模块化架构允许轻松集成不同的数据源，无论它们是存储在向量数据库中还是通过 API 访问。它还促进了用户查询的实时协调，结合适当的检索、生成和上下文感知机制。

## 使用 Flask 和 Streamlit 部署

一旦 RAG 模型经过训练和优化，就可以使用轻量级的 Web 框架如 Flask 或 Streamlit 进行部署。Flask 允许对部署进行更多的自定义和控制，而 Streamlit 则专注于简单性，提供快速原型开发。完整实现可以在 [git repo](https://github.com/nitsourish/Conversational_AIchatbot) 中找到。

**Flask 示例：**

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*1BZhU0OMY10wCQPRYliEQw.png)


```python
app = Flask(__name__)

@app.route('/query', methods=['POST'])
def query_model():
    input_data = request.json['query']
    response = rag_chain.invoke({"input": input_data})
    return jsonify({"response": response})

if __name__ == '__main__':
    app.run(debug=True)
```
**Streamlit 示例：**


```python
st.title("信用卡产品查询代理")
user_query = st.text_input("询问有关花旗信用卡的问题：")
if user_query:
    response = rag_chain.invoke({"input": user_query})
    st.write(f"响应: {response}")
```
![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*uOXAnRB0yln6U21aCUMy9Q.png)

## 关键要点与未来展望

在这篇博客中，我讨论了大型语言模型（LLMs）在B2C行业中的相关性，特别是在客户接触点较多的领域，重点应用于银行产品的对话式AI代理，包括基于RAG的管道的逐步开发和部署，利用流行的lang-chain框架。流程包括定制的工程管道，数据摄取，向量数据库（检索器）的配置。最后展示了使用微型Web框架如Flask进行全面控制或使用Streamlit进行快速原型开发的部署。

在当今快速发展的B2C环境中，提供快速、准确和个性化的客户服务是获得竞争优势的关键。通过将LLMs与向量数据库、检索增强生成（RAG）和提示工程相结合，公司可以部署不仅能回答客户查询的AI代理，而且能够以高上下文准确性进行回答。

感谢阅读本文。要阅读更多精彩的AI故事，请关注我的[medium stories](https://medium.com/@sourish.syntel)。

