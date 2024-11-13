---
title: "使用 LangChain、Streamlit 和 PubMed 构建基于 RAG 的科学聊天机器人--第 4 部分（将所有..."
meta_title: "使用 LangChain、Streamlit 和 PubMed 构建基于 RAG 的科学聊天机器人--第 4 部分（将所有..."
description: "大家好，欢迎来到使用 Langchain、Streamlit 和 PubMed 构建科学聊天机器人系列的最后一部分！"
date: 2024-11-13T01:22:29Z
image: "https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*MQ7XtBd9WHn5n-gAMgd6pQ.jpeg"
categories: ["Chatbots", "Natural Language Processing", "Science"]
author: "Rifx.Online"
tags: ["ChatBot", "LangChain", "Streamlit", "PubMed", "RAG"]
draft: False

---





您好，欢迎来到构建科学聊天机器人的系列最后一部分，使用Langchain、Streamlit和PubMed！

在前一部分中，我们构建了数据持久性和带有向量存储的RAG管道。现在，是时候将我们所构建的一切整合在一起，创建聊天机器人用户界面，利用我们构建的后端功能，帮助科学家回答他们的科学问题！

作为提醒，这就是我们在系列中构建的完整解决方案：

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*NFCO_uRjlAgm0WYH.png)

## 应用演示

* 作为预告，让我们先来看看应用的界面示例！ 

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*OKEQO_2kwnV93Va4SAVWZg.gif)

## 建设

### 已完成步骤概述

* 如果您还没有完成 [第一部分](https://proxy.rifx.online/https://readmedium.com/build-a-rag-based-scientific-chatbot-with-langchain-streamlit-pubmed-part-1-set-up-streamlit-37550b44b266)、[第二部分](https://proxy.rifx.online/https://readmedium.com/llm-aided-retrieval-of-relevant-scientific-abstracts-via-pubmed-api-using-natural-language-part2-9e10f78575e6) 和 [第三部分](https://proxy.rifx.online/https://readmedium.com/build-a-rag-based-scientific-chatbot-with-langchain-streamlit-pubmed-part-3-create-vector-1e5e401e72e6)，请务必先完成，因为我们将基于这些内容进一步构建。在最后一部分结束时，我们得到了如下的项目结构：

```python
.
├── app
│   ├── app.py
│   ├── backend
│   │  ├── abstract_retrieval
│   │  │   ├── interface.py
│   │  │   ├── pubmed_retriever.py
│   │  │   └── pubmed_query_simplification.py
│   │  ├── data_repository
│   │  │   ├── interface.py
│   │  │   ├── local_data_store.py
│   │  │   └── models.py
│   │  └── rag_pipeline
│   │      ├── interface.py
│   │      ├── chromadb_rag.py
│   │      └── embeddings.py
│   ├── components
│   │   ├── chat_utils.py
│   │   ├── llm.py
│   │   └── prompts.py
│   └── tests
│       └── test_chat_utils.py
├── assets
│   └── pubmed-screener-logo.jpg
└── environment
    └── requirements.txt
```
在系列的最后一部分中，我们将重点关注定义我们的 Streamlit UI 的代码部分——***app/app.py*** 和 ***app/components*** 模块。

### 修改 chat\_utils.py 以包含 RAG 逻辑

[在第一部分](https://proxy.rifx.online/https://readmedium.com/build-a-rag-based-scientific-chatbot-with-langchain-streamlit-pubmed-part-1-set-up-streamlit-37550b44b266)，我们构建了一个初步版本的 ***chat\_utils.py***，其中包含一个简单的 QA 聊天机器人实现（没有 RAG）。现在，我们将深入研究并将其转换为一个上下文感知的 QA 聊天机器人，该机器人将根据用户问题构建答案，并通过相似性搜索从我们的向量索引中检索相关上下文（摘要）。

我们将使用[第三部分](https://proxy.rifx.online/https://readmedium.com/build-a-rag-based-scientific-chatbot-with-langchain-streamlit-pubmed-part-3-create-vector-1e5e401e72e6)中构建的所有后端功能来实现这一目的。

**app/components/chat\_utils.py**

```python
from typing import List
import streamlit as st
from langchain_core.documents.base import Document
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.runnables.base import Runnable
from langchain_core.runnables.utils import Output
from langchain_community.chat_message_histories import StreamlitChatMessageHistory
from langchain_core.prompts import ChatPromptTemplate
from langchain.vectorstores import VectorStore


class ChatAgent:
    def __init__(self, prompt: ChatPromptTemplate, llm: Runnable):
        """
        初始化 ChatAgent。

        参数：
        - prompt (ChatPromptTemplate): 聊天提示模板。
        - llm (Runnable): 语言模型可运行对象。
        """
        self.history = StreamlitChatMessageHistory(key="chat_history")
        self.llm = llm
        self.prompt = prompt
        self.chain = self.setup_chain()
    
    def reset_history(self) -> None:
        """
        清除聊天历史以开始新的聊天会话。
        """
        self.history.clear()

    def setup_chain(self) -> RunnableWithMessageHistory:
        """
        为 ChatAgent 设置链。

        返回：
        - RunnableWithMessageHistory: 配置好的带有消息历史的链。
        """
        chain = self.prompt | self.llm
        return RunnableWithMessageHistory(
            chain,
            lambda session_id: self.history,
            input_messages_key="question",
            history_messages_key="history",
        )

    def display_messages(self, selected_query: str) -> None:
        """
        在聊天界面显示消息。
        如果没有消息，则添加默认的 AI 消息。
        """
        if len(self.history.messages) == 0:
            self.history.add_ai_message(f"让我们聊聊你的问题：{selected_query}")
        for msg in self.history.messages:
            st.chat_message(msg.type).write(msg.content)
    
    def format_retreieved_abstracts_for_prompt(self, documents: List[Document]) -> str:
        """
        将检索到的文档格式化为字符串，以便传递给 LLM。
        """
        formatted_strings = []
        for doc in documents:
            formatted_str = f"摘要标题：{doc.metadata['title']}, 摘要内容：{doc.page_content}, 摘要 DOI：{doc.metadata['source'] if 'source' in doc.metadata.keys() else '缺少 DOI..'}"
            formatted_strings.append(formatted_str)
        return "; ".join(formatted_strings)
    
    def get_answer_from_llm(self, question: str, retrieved_documents: List[Document]) -> Output:
        """
        根据用户问题和检索到的文档从 LLM 获取响应。
        """
        config = {"configurable": {"session_id": "any"}}
        return self.chain.invoke(
            {
                "question": question, 
                "retrieved_abstracts": retrieved_documents,
            }, config
        )
    
    def retrieve_documents(self, retriever: VectorStore, question: str, cut_off: int = 5) -> List[Document]:
        """
        使用相似性搜索检索文档
        cut_off 参数控制检索到的结果数量（默认为 5）
        """
        return retriever.similarity_search(question)[:cut_off]

    def start_conversation(self, retriever: VectorStore, selected_query: str) -> None:
        """
        在聊天界面开始对话。
        显示消息，提示用户输入，并处理 AI 响应。
        """
        self.display_messages(selected_query)
        user_question = st.chat_input(placeholder="问我任何事情..")
        if user_question:
            documents = self.retrieve_documents(retriever, user_question)
            retrieved_abstracts = self.format_retreieved_abstracts_for_prompt(documents)
            st.chat_message("human").write(user_question)
            response = self.get_answer_from_llm(user_question, retrieved_abstracts)
            st.chat_message("ai").write(response.content)
```
**更改内容：**

* 我们添加了方法 ***retrieve\_documents***，该方法将我们的向量索引（检索器）作为参数，并调用检索器上的方法 similarity\_search，从我们的科学摘要的向量索引中获取与用户问题最相似的记录。请注意参数 cut\_off，它指定要检索的结果数量（默认为 5）。
* 添加了方法 ***format\_retreieved\_abstracts\_for\_prompt***，该方法接收通过 retrieve\_documents 方法检索到的文档，并将其格式化为 LLM 使用。这在我们要求 LLM 在提示中引用相关来源（文章 DOI 和标题）时将非常有用。
* 添加了方法 ***get\_answer\_from\_llm***，用于调用 LLM 并传递必要的变量，以保持客户端函数 start\_conversation 的简洁。
* 修改了 ***start\_conversation*** 方法以包含 RAG 逻辑。

### 创建 QA 聊天提示

* 我们将修改现有的聊天提示，以包含检索到的摘要，并基于这些摘要构建答案。
* 我们还将包含一个额外的（简单的）提示，用于在聊天机器人部分之外提供直接的即时答案，以便用户在 UI 上获得直接的答案。

**app/components/chat\_prompts.py**

```python
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder, PromptTemplate


chat_prompt_template = ChatPromptTemplate.from_messages(
    [
        ("system", "You are a knowledgeable expert chatbot in the biomedicine field."),
        MessagesPlaceholder(variable_name="history"),
        (
            "human", 
            """
            Answer the following scientific question: {question}, 
            using the following context retrieved from scientific articles: {retrieved_abstracts}.

            The user might refer to the history of your conversation. Please, use the following history of messages for the context as you see fit.

            The abstracts will come formatted in the following way: ABSTRACT TITLE: <abstract title>; ABSTRACT CONTENT: <abstract content>, ABSTRACT DOI: <abstract doi> (the content inside <> will be variable).
            In your answer, ALWAYS cite the abstract title and abstract DOI when citing a particular piece of information from that given abstract.

            Your example response might look like this:

            In the article (here in the brackets goes the contents of ABSTRACT_TITLE), it was discussed, that Cannabis hyperemesis syndrome (CHS) is associated with chronic, heavy cannabis use. The endocannabinoid system (ECS) plays a crucial role in the effects of cannabis on end organs and is central to the pathophysiology of CHS. (here, in the end of the cited chunk, the ABSTRACT_DOI goes)
            """
        ),
    ]
)

qa_template = PromptTemplate(
    input_variables=['question', 'retrieved_abstracts'],
    template="""
        Answer the following scientific question: {question}, 
        using the following context retrieved from scientific articles: {retrieved_abstracts}.

        The abstracts will come formatted in the following way: ABSTRACT TITLE: <abstract title>; ABSTRACT CONTENT: <abstract content>, ABSTRACT DOI: <abstract doi> (the content inside <> will be variable).
        In your answer, ALWAYS cite the abstract title and abstract DOI when citing a particular piece of information from that given abstract.

        Your example response might look like this:

        In the article (here in the brackets goes the contents of ABSTRACT_TITLE), it was discussed, that Cannabis hyperemesis syndrome (CHS) is associated with chronic, heavy cannabis use. The endocannabinoid system (ECS) plays a crucial role in the effects of cannabis on end organs and is central to the pathophysiology of CHS. (here, in the end of the cited chunk, the ABSTRACT_DOI goes)
    """
)
```
* 请注意，两个提示的内容几乎相同，但聊天提示包含对聊天历史的引用，使用 MessagesPlaceholder，并指示在对话过程中根据 LLM 的判断使用聊天历史。

### 创建新文件 app/components/layout\_extensions.py

* 该文件将保存一个辅助函数，该函数将向用户呈现我们应用程序布局的一部分，并提供查询示例（如何使用应用程序的提示）。我决定创建这个扩展文件，以避免使我们的 app.py 文件杂乱，并保持其整洁，因为这段代码相当冗长，并包含一些自定义样式（应用信息将在用户悬停时显示）：

```python
import streamlit as st


def render_app_info():
    st.title("PubMed Screener")
    st.markdown("""
        PubMed Screener is a ChatGPT & PubMed powered insight generator from biomedical abstracts.
    """)

    # Adding custom HTML and CSS for an improved hover-over tooltip
    st.markdown("""
        <style>
        .tooltip {
            position: relative;
            display: inline-block;
            border-bottom: 1px dotted black; /* Style for the hoverable text */
        }

        .tooltip .tooltiptext {
            visibility: hidden;
            width: 800px; /* Width to fit content */
            background-color: #f9f9f9;
            color: #000;
            text-align: left;
            border-radius: 6px;
            padding: 15px;
            position: absolute;
            z-index: 1;
            bottom: 100;
            right: -430px; /* Positioning to the right and slightly offset */
            opacity: 0;
            transition: opacity 0.5s;
            box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.8); /* Adding some shadow for better visibility */
        }

        .tooltip:hover .tooltiptext {
            visibility: visible;
            opacity: 1;
        }
        </style>
        <div class="tooltip">🔍 示例问题
            <span class="tooltiptext">
                <strong>示例科学问题：</strong>
                <ul>
                    <li>如何利用先进的成像技术和生物标志物早期诊断和监测神经退行性疾病的进展？</li>
                    <li>干细胞技术和再生医学在神经退行性疾病治疗中的潜在应用是什么？相关挑战又是什么？</li>
                    <li>肠道微生物群和肠脑轴在1型和2型糖尿病发病机制中的作用是什么？如何调节这些相互作用以获得治疗益处？</li>
                    <li>针对癌症靶向治疗的耐药性发展的分子机制是什么？如何克服这些耐药机制？</li>
                </ul>
            </span>
        </div>
        """, unsafe_allow_html=True)
    
    st.text("")py
```

### 修改 app/app.py

* 最后，是时候将我们构建的所有内容整合在一起，并将其作为一个 streamlit 应用程序进行展示！


```python
import streamlit as st
from metapub import PubMedFetcher
from components.chat_utils import ChatAgent
from components.chat_prompts import chat_prompt_template, qa_template
from components.llm import llm
from components.layout_extensions import render_app_info
from backend.abstract_retrieval.pubmed_retriever import PubMedAbstractRetriever
from backend.data_repository.local_storage import LocalJSONStore
from backend.rag_pipeline.chromadb_rag import ChromaDbRag
from backend.rag_pipeline.embeddings import embeddings


## 实例化对象
pubmed_client = PubMedAbstractRetriever(PubMedFetcher())
data_repository = LocalJSONStore(storage_folder_path="backend/data")
rag_client = ChromaDbRag(persist_directory="backend/chromadb_storage", embeddings=embeddings)
chat_agent = ChatAgent(prompt=chat_prompt_template, llm=llm)

def main():
    st.set_page_config(
        page_title="Pubmed 摘要筛选器",
        page_icon='💬',
        layout='wide'
    )

    # 定义列 - 这将使布局水平分割
    column_logo, column_app_info, column_answer = st.columns([1, 4, 4])

    # 在第一列放置 logo
    with column_logo:
        st.image('../assets/pubmed-screener-logo.jpg')

    # 在第二列放置解释应用程序目的的文本以及用户可能提出的一些示例科学问题。
    with column_app_info:

        # 运行应用程序信息，包括示例问题作为用户的提示
        render_app_info()

        # 输入科学问题的部分
        st.header("输入您的科学问题！")
        placeholder_text = "在此输入您的科学问题..."
        scientist_question = st.text_input("您的问题是什么？", placeholder_text)
        get_articles = st.button('获取文章 & 答案')

        # 处理用户问题，获取数据
        with st.spinner('正在获取摘要。这可能需要一段时间...'):
            if get_articles:
                if scientist_question and scientist_question != placeholder_text:

                    # 获取摘要数据
                    retrieved_abstracts = pubmed_client.get_abstract_data(scientist_question)
                    if not retrieved_abstracts:
                        st.write('未找到摘要。')
                    else:
                        # 将摘要保存到存储并创建向量索引
                        query_id = data_repository.save_dataset(retrieved_abstracts, scientist_question)
                        documents = data_repository.create_document_list(retrieved_abstracts)
                        rag_client.create_vector_index_for_user_query(documents, query_id)
                        
                        # 直接回答用户问题并在 UI 上显示答案
                        vector_index = rag_client.get_vector_index_by_user_query(query_id)
                        retrieved_documents = chat_agent.retrieve_documents(vector_index, scientist_question)
                        chain = qa_template | llm
                        
                        with column_answer:
                            st.markdown(f"##### 您的问题的答案：'{scientist_question}'")
                            st.write(chain.invoke({
                                "question": scientist_question, 
                                "retrieved_abstracts": retrieved_documents,
                            }).content)

    # 聊天机器人部分的开始
    # 显示查询列表以选择一个进行对话
    query_options = data_repository.get_list_of_queries()

    if query_options:
        st.header("与摘要聊天")
        selected_query = st.selectbox('选择一个过去的查询', options=list(query_options.values()), key='selected_query')
        
        # 初始化关于用户问题历史中的某个查询的聊天
        if selected_query:
            selected_query_id = next(key for key, val in query_options.items() if val == selected_query)
            vector_index = rag_client.get_vector_index_by_user_query(selected_query_id)

            # 切换查询进行聊天时清除聊天历史
            if 'prev_selected_query' in st.session_state and st.session_state.prev_selected_query != selected_query:
                chat_agent.reset_history()

            st.session_state.prev_selected_query = selected_query

            # 开始聊天会话
            chat_agent.start_conversation(vector_index, selected_query)


if __name__ == "__main__":
    main()
```
* 代码包含以下部分：
1. 实例化我们在系列之前部分中构建的所有对象 → ***PubMedAbstractRetriever***、***LocalJSONStore***、***ChromaDbRag*** 和 ***ChatAgent***。我们将在应用程序代码中使用这些对象。
2. 定义布局以呈现应用程序标题、logo 和应用程序信息。
3. 定义用户问题的输入和一个提交按钮。当按钮被点击时，这将触发搜索和获取 PubMed 文章的逻辑（使用 ***PubMedAbstractRetriever —*** pubmed\_client），将它们保存到本地数据存储库（使用 ***LocalJSONStore —*** data\_repository），并为它们创建向量索引（使用 ***ChromaDbRag —*** rag\_client）。
4. 直接回答用户问题并在 UI 上显示。
5. 显示聊天机器人部分，让您选择一个过去的查询进行对话，以便进一步询问摘要。在选择过去的查询后，加载相应的向量索引，并启动聊天会话（***chat\_agent.start\_conversation(…)***）。现在您可以与摘要聊天！

## 限制

我很高兴你和我一起走过这个系列，我们构建了一个科学聊天机器人的原型！不过需要说明的是，这个应用程序仅仅是一个概念验证（PoC），所展示的实现存在一些需要在生产环境中部署之前解决的问题。

**简单RAG的限制和考虑**

* **检索内容的相关性**：你无法确定检索到的内容（与用户问题最相似的内容）是否是最相关的信息。有一些先进的RAG技术，如*假设性问题*或*层次索引*，可以帮助解决这个问题——在[这篇文章](https://proxy.rifx.online/https://readmedium.com/advanced-rag-techniques-unlocking-the-next-level-040c205b95bc)中了解更多关于这些技术的信息。
* **检索内容的截断**：很难评估是否检索到了所有相关信息。此外，由于LLM的令牌限制，适应所有上下文到提示中可能会很具挑战性。在我们的案例中，默认的截断等于5个摘要（在我们的ChatAgent的retrieve_documents方法中），如果用户提出一个广泛的问题，这显然可能不够。
* **适用性有限**：有时，用户的问题可能更倾向于总结性质，而使用不同于RAG的技术可能更适合这个目的。例如，你可以构建一个代理，决定任务是总结/检索，基于用户问题。在此评估之后，将有一个函数执行不同的逻辑，分别进行总结或检索。

**部署架构考虑**

* **运行环境**：在本系列的范围内，我们仅在本地构建了我们的聊天机器人，没有考虑如果我们想要将这个应用程序部署以服务一些真实用户时需要做出的任何架构决策。
* **同步处理**：由于数据获取可能需要相当长的时间，实现基于队列的异步处理用户请求会更高效，并在数据获取完成后通知用户。以同步方式进行此操作可能会耗费大量时间，这可能导致许多服务器超时。
* **后端技术**：在我们的案例中，使用的后端是ChromaDB，采用本地存储的JSON文件。对于一个服务用户的部署应用程序，这应该重新评估并选择合适的技术。这可以通过基于应用程序后端代码中的接口定义（*RagWorkflow*和*UserQueryDataStore*接口）轻松实现。

**包括更多科学数据库**

* 在这个系列中，我们仅关注PubMed，但为了提供丰富的上下文基础，可以添加其他科学论文数据库（即Scopus）。这可以通过基于应用程序后端代码中的接口定义（*AbstractRetriever*接口）轻松实现。

## 完整代码库 GitHub 链接

随意分叉该仓库并将其适应您的 UC！

### 链接到 GitHub 仓库 pubmed\-rag\-screener

## 摘要

* 在本系列的最后一部分中，我们将之前构建的所有组件组合在一起，创建一个用户界面，让科学家可以提出问题，基于科学摘要获得答案，然后与摘要进行进一步的交流。
* 应用逻辑是模块化的，便于使用提供的接口进行扩展。
* 概述并强调了该方法的局限性，并包括了一些构建生产级应用的建议。

> 非常感谢您与我一起完成这个系列！希望您喜欢构建这个令人兴奋的用例 :)

> 如果您想讨论有关开发、数据、人工智能的任何内容，或者只是想联系，请随时与我联系 — [在LinkedIn上联系我](https://proxy.rifx.online/https://www.linkedin.com/in/sbarankova/)

## 系列内容

* [第一部分 — 解释用例，设置带有聊天机器人界面的 Streamlit 应用的第一步。](https://proxy.rifx.online/https://readmedium.com/build-a-rag-based-scientific-chatbot-with-langchain-streamlit-pubmed-part-1-set-up-streamlit-37550b44b266)
* [第二部分 — 通过 PubMed API 使用自然语言辅助检索相关科学摘要](https://proxy.rifx.online/https://readmedium.com/llm-aided-retrieval-of-relevant-scientific-abstracts-via-pubmed-api-using-natural-language-part2-9e10f78575e6)
* [第三部分 — 设置后端 — 从检索到的科学摘要创建向量嵌入并将其存储在向量库中](https://proxy.rifx.online/https://readmedium.com/build-a-rag-based-scientific-chatbot-with-langchain-streamlit-pubmed-part-3-create-vector-1e5e401e72e6)
* **第四部分（本文） — 通过 RAG 将所有内容整合在一起 — 与科学摘要聊天**

