---
title: "Build a RAG-based scientific ChatBot with LangChain, Streamlit & PubMed — Part 4(Put it all…"
meta_title: "Build a RAG-based scientific ChatBot with LangChain, Streamlit & PubMed — Part 4(Put it all…"
description: "Hello and welcome to the last part of the series to build a scientific ChatBot with Langchain, Streamlit, and PubMed!"
date: 2024-11-13T01:22:29Z
image: "https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*MQ7XtBd9WHn5n-gAMgd6pQ.jpeg"
categories: ["Chatbots", "Natural Language Processing", "Science"]
author: "Rifx.Online"
tags: ["ChatBot", "LangChain", "Streamlit", "PubMed", "RAG"]
draft: False

---






Hello and welcome to the last part of the series to build a scientific ChatBot with Langchain, Streamlit, and PubMed!

In the previous part, we built the data persistence and RAG pipeline with vectorstore. Now, it is time to put everything we’ve built together, and create the chatbot UI that will use the backend functionality we built, and that our scientist will use to answer their scientific questions!

As a reminder, this is the full solution that we were building during the series:

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*NFCO_uRjlAgm0WYH.png)


## App demo

* As a teaser, let’s first have a look at an illustration of what the app will look like!

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*OKEQO_2kwnV93Va4SAVWZg.gif)


## Building


### Overview of steps already done

* If you haven’t followed through the [first](https://proxy.rifx.online/https://readmedium.com/build-a-rag-based-scientific-chatbot-with-langchain-streamlit-pubmed-part-1-set-up-streamlit-37550b44b266) , the [second](https://proxy.rifx.online/https://readmedium.com/llm-aided-retrieval-of-relevant-scientific-abstracts-via-pubmed-api-using-natural-language-part2-9e10f78575e6), and the [third part](https://proxy.rifx.online/https://readmedium.com/build-a-rag-based-scientific-chatbot-with-langchain-streamlit-pubmed-part-3-create-vector-1e5e401e72e6), please do so, because we will be building on that further. At the end of the last part, we ended up with a project structure looking like this:


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
In this last part of the series, we will focus on the part of code base that defines our Streamlit UI — ***app/app.py*** and the ***app/components*** module.


### Modify chat\_utils.py to include RAG logic

[In the first part](https://proxy.rifx.online/https://readmedium.com/build-a-rag-based-scientific-chatbot-with-langchain-streamlit-pubmed-part-1-set-up-streamlit-37550b44b266), we built a preliminary version of ***chat\_utils.py*** that contained a simple QA chatbot implementation (without RAG). Now, we will dive in and convert this into a context\-aware QA chatbot, that will construct answers based on user questions and retrieve relevant context (abstracts) from our vector index via similarity search.

We will use all the backend functionality [built in part three](https://proxy.rifx.online/https://readmedium.com/build-a-rag-based-scientific-chatbot-with-langchain-streamlit-pubmed-part-3-create-vector-1e5e401e72e6) for this purpose.

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
        Initialize the ChatAgent.

        Args:
        - prompt (ChatPromptTemplate): The chat prompt template.
        - llm (Runnable): The language model runnable.
        """
        self.history = StreamlitChatMessageHistory(key="chat_history")
        self.llm = llm
        self.prompt = prompt
        self.chain = self.setup_chain()
    
    def reset_history(self) -> None:
        """
        Clean up chat history to start new chat session.
        """
        self.history.clear()

    def setup_chain(self) -> RunnableWithMessageHistory:
        """
        Set up the chain for the ChatAgent.

        Returns:
        - RunnableWithMessageHistory: The configured chain with message history.
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
        Display messages in the chat interface.
        If no messages are present, adds a default AI message.
        """
        if len(self.history.messages) == 0:
            self.history.add_ai_message(f"Let's chat about your query: {selected_query}")
        for msg in self.history.messages:
            st.chat_message(msg.type).write(msg.content)
    
    def format_retreieved_abstracts_for_prompt(self, documents: List[Document]) -> str:
        """
        Format retrieved documents in a string to be passed to LLM.
        """
        formatted_strings = []
        for doc in documents:
            formatted_str = f"ABSTRACT TITLE: {doc.metadata['title']}, ABSTRACT CONTENT: {doc.page_content}, ABSTRACT DOI: {doc.metadata['source'] if 'source' in doc.metadata.keys() else 'DOI missing..'}"
            formatted_strings.append(formatted_str)
        return "; ".join(formatted_strings)
    
    def get_answer_from_llm(self, question: str, retrieved_documents: List[Document]) -> Output:
        """
        Get response from LLM given user question and retrieved documents.
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
        Retrieve documents using similarity search 
        cut_off parameter controls how many results are retrieved (default is 5)
        """
        return retriever.similarity_search(question)[:cut_off]

    def start_conversation(self, retriever: VectorStore, selected_query: str) -> None:
        """
        Start a conversation in the chat interface.
        Displays messages, prompts user for input, and handles AI response.
        """
        self.display_messages(selected_query)
        user_question = st.chat_input(placeholder="Ask me anything..")
        if user_question:
            documents = self.retrieve_documents(retriever, user_question)
            retrieved_abstracts = self.format_retreieved_abstracts_for_prompt(documents)
            st.chat_message("human").write(user_question)
            response = self.get_answer_from_llm(user_question, retrieved_abstracts)
            st.chat_message("ai").write(response.content)
```
**What has changed:**

* We added the method ***retrieve\_documents*** that takes our vector index (retriever) as argument, and calls a method similarity\_search on the retriever to get the most similar records to user’s question from the vector index of our scientific abstracts. Note the parameter cut\_off that specifies the number of results to be retrieved (defaults to 5\).
* Added method ***format\_retreieved\_abstracts\_for\_prompt***, that takes the documents retrieved via retrieve\_documents method, and formats them for the LLM. This will come very handy when we will ask the LLM in our prompt to cite the relevant sources (article DOIs, and titles).
* Added method ***get\_answer\_from\_llm*** that serves for calling the LLM with necessary variables, to keep the client function start\_conversation clean.
* Modified the ***start\_conversation*** method to include the RAG logic.


### Create chat prompts for QA

* We will be modifying the existing chat prompt to include retrieved abstracts and construct the answer based on those.
* We will also include an additional (simple) prompt that will serve for a simple immediate answer outside of the chatbot section, so that the user gets a direct answer to his question displayed on the UI.

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
* Note that the contents of the two prompts is almost identical, but the chat prompt contains a reference for the chat history with the MessagesPlaceholder and an instruction to use the chat history as the LLM sees fit during the conversation.


### Create new file app/components/layout\_extensions.py

* This file will hold a helper function that will render a part of the layout of our app with examples of queries (cues on how to use the app) to the user. I decided to create this extensions file to not clutter our app.py file and keep it clean, since this code is quite lengthy and contains some custom styling (the app info will be displayed to the user on hover):


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
        <div class="tooltip">🔍 Example Questions
            <span class="tooltiptext">
                <strong>Example scientific questions:</strong>
                <ul>
                    <li>How can advanced imaging techniques and biomarkers be leveraged for early diagnosis and monitoring of disease progression in neurodegenerative disorders?</li>
                    <li>What are the potential applications of stem cell technology and regenerative medicine in the treatment of neurodegenerative diseases, and what are the associated challenges?</li>
                    <li>What are the roles of gut microbiota and the gut-brain axis in the pathogenesis of type 1 and type 2 diabetes, and how can these interactions be modulated for therapeutic benefit?</li>
                    <li>What are the molecular mechanisms underlying the development of resistance to targeted cancer therapies, and how can these resistance mechanisms be overcome?</li>
                </ul>
            </span>
        </div>
        """, unsafe_allow_html=True)
    
    st.text("")py
```

### Modify the app/app.py

* Finally, time to put everything we’ve built together and expose it as a streamlit application!


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


## Instantiate objects
pubmed_client = PubMedAbstractRetriever(PubMedFetcher())
data_repository = LocalJSONStore(storage_folder_path="backend/data")
rag_client = ChromaDbRag(persist_directory="backend/chromadb_storage", embeddings=embeddings)
chat_agent = ChatAgent(prompt=chat_prompt_template, llm=llm)

def main():
    st.set_page_config(
        page_title="Pubmed Abstract Screener",
        page_icon='💬',
        layout='wide'
    )

    # Define columns - this will make layout split horizontally
    column_logo, column_app_info, column_answer = st.columns([1, 4, 4])

    # Place the logo in the first column
    with column_logo:
        st.image('../assets/pubmed-screener-logo.jpg')

    # In the second column, place text explaining the purpose of the app and some example scientific questions that your user might ask.
    with column_app_info:

        # Runder app info including example questions as cues for the user
        render_app_info()

        # Section to enter scientific question
        st.header("Enter your scientific question!")
        placeholder_text = "Type your scientific question here..."
        scientist_question = st.text_input("What is your question?", placeholder_text)
        get_articles = st.button('Get articles & Answer')

        # Processing user question, fetching data
        with st.spinner('Fetching abstracts. This can take a while...'):
            if get_articles:
                if scientist_question and scientist_question != placeholder_text:

                    # Get abstracts data
                    retrieved_abstracts = pubmed_client.get_abstract_data(scientist_question)
                    if not retrieved_abstracts:
                        st.write('No abstracts found.')
                    else:
                        # Save abstarcts to storage and create vector index
                        query_id = data_repository.save_dataset(retrieved_abstracts, scientist_question)
                        documents = data_repository.create_document_list(retrieved_abstracts)
                        rag_client.create_vector_index_for_user_query(documents, query_id)
                        
                        # Answer the user question and display the answer on the UI directly
                        vector_index = rag_client.get_vector_index_by_user_query(query_id)
                        retrieved_documents = chat_agent.retrieve_documents(vector_index, scientist_question)
                        chain = qa_template | llm
                        
                        with column_answer:
                            st.markdown(f"##### Answer to your question: '{scientist_question}'")
                            st.write(chain.invoke({
                                "question": scientist_question, 
                                "retrieved_abstracts": retrieved_documents,
                            }).content)

    # Beginning of the chatbot section
    # Display list of queries to select one to have a conversation about
    query_options = data_repository.get_list_of_queries()

    if query_options:
        st.header("Chat with the abstracts")
        selected_query = st.selectbox('Select a past query', options=list(query_options.values()), key='selected_query')
        
        # Initialize chat about some query from the history of user questions
        if selected_query:
            selected_query_id = next(key for key, val in query_options.items() if val == selected_query)
            vector_index = rag_client.get_vector_index_by_user_query(selected_query_id)

            # Clear chat history when switching query to chat about
            if 'prev_selected_query' in st.session_state and st.session_state.prev_selected_query != selected_query:
                chat_agent.reset_history()

            st.session_state.prev_selected_query = selected_query

            # Start chat session
            chat_agent.start_conversation(vector_index, selected_query)


if __name__ == "__main__":
    main()
```
* The code contains the following parts:
1. Instantiate all objects that we built in previous parts of the series → ***PubMedAbstractRetriever***, ***LocalJSONStore***, ***ChromaDbRag***, and ***ChatAgent***. We will be using all those objects in our app code.
2. Define layout to render app title, logo, and app info.
3. Define input for the user’s question, and a button to submit it. When the button is clicked, this triggers the logic to search \& fetch PubMed articles (using ***PubMedAbstractRetriever —*** pubmed\_client), save them to the local data repository (with ***LocalJSONStore —***data\_repository), and create a vector index for them (with ***ChromaDbRag —*** rag\_client).
4. Answer the user question directly and show it on the UI.
5. Display ChatBot section that will let you select a past query to chat about, in case you want to interrogate the abstracts further. After the selection of a past query, the corresponding vector index is loaded, and a chat session is initiated (***chat\_agent.start\_conversation(…)***). Now you can chat with your abstracts!


## Limitations

I am happy you went with me through this series where we built a prototype of a scientific chatbot! It is necessary to say though, that this application is a PoC scope ONLY, and the implementation presented has its caveats that would need to be addressed before deploying in a production manner.

**Naive RAG limitations and considerations**

* **Retrieved content relevance**: you can’t be sure if the retrieved content (the content most similar to user’s question) is the most relevant piece of information. There are some techniques of advanced RAG, like *H**ypothetical Questions*****,** or ***Hierarchical indexing*** that can help with that — read more about those techniques and more [in this article](https://proxy.rifx.online/https://readmedium.com/advanced-rag-techniques-unlocking-the-next-level-040c205b95bc)
* **Retrieved content cut off**: It is hard to assess whether all the relevant information was retrieved. Also, it can be challenging to fit all the context to the prompt due to the token limits of LLMs. The default cut off in our case equals to 5 abstracts (in our ChatAgent retrieve\_documents method), which can certainly not be enough if the user asks a broad question.
* **Limited applicability**: Sometimes, the user question can be rather of a summarization character, and a different technique than RAG would be more appropriate for this purpose. For example, you could build an agent that decides whether task is summarization / retrieval based on user question. After this evaluation, there would be a function executing different logic that performs summarization or retrieval, respectively.

**Deployment architecture considerations**

* **Runtime environment**: For the scope of this series, we only built our chatbot locally, not considering any architectural decisions we would need to make if we would like to deploy this app to serve some real users.
* **Synchronous processing**: Since the data fetching can take a considerable amount of time, it would be more efficient to implement a queue\-based asynchronous processing of user requests, and notify user when data fetching is done. Doing this in a synchronous manner can take a lot of time which can result in timeouts in many servers.
* **Backend technologies**: The backend used in our case was ChromaDB with local storage using JSON files. For a deployed application serving users, this should be re\-evaluated and appropriate technology selected. This can be easily achieved by building on the interface definitions in the app backend code (***RagWorkflow*** and ***UserQueryDataStore*** interfaces).

**Including more scientific databases**

* In the series, we focused on PubMed only, but to provide a rich context base, another scientific paper databases (i.e. Scopus) could be added. This can be easily achieved by building on the interface definitions in the app backend code (***AbstractRetriever*** interface).


## Full codebase GitHub link

Feel free to fork the repo and adapt it to your UC!


### Link to GitHub repo pubmed\-rag\-screener


## Summary

* In this last part of the series to build a scientific ChatBot, we put together all the previously built pieces to create a user interface, where our scientist can formulate her/his question, get an answer based on scientific abstracts, and then chat with the abstracts for further insights.
* The application logic is modular and enables easy extension using provided interfaces.
* The limitations of the approach were outlined and highlighted, and some suggestions to build a production\-grade application were included.


> Thanks so much for going through this series with me! I hope you enjoyed building this exciting use case :)


> Do not hesitate to get in touch with me if you want to discuss anything about dev, data, AI, or just connect — [reach out on LinkedIn](https://proxy.rifx.online/https://www.linkedin.com/in/sbarankova/)


## Contents of the series

* [Part 1 — Explaining the use case, first steps to set up the Streamlit app with chatbot interface.](https://proxy.rifx.online/https://readmedium.com/build-a-rag-based-scientific-chatbot-with-langchain-streamlit-pubmed-part-1-set-up-streamlit-37550b44b266)
* [Part 2 — LLM\-aided retrieval of relevant scientific abstracts via PubMed API using natural language](https://proxy.rifx.online/https://readmedium.com/llm-aided-retrieval-of-relevant-scientific-abstracts-via-pubmed-api-using-natural-language-part2-9e10f78575e6)
* [Part 3 — Setting up the backend — Create vector embeddings from the retrieved scientific abstracts and store them in a vector store](https://proxy.rifx.online/https://readmedium.com/build-a-rag-based-scientific-chatbot-with-langchain-streamlit-pubmed-part-3-create-vector-1e5e401e72e6)
* **Part 4 (this article) — Put it all together via RAG — chat with scientific abstracts**

