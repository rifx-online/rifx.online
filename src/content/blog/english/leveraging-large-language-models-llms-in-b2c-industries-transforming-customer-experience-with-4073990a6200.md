---
title: "Leveraging Large Language Models (LLMs) in B2C Industries: Transforming Customer Experience with…"
meta_title: "Leveraging Large Language Models (LLMs) in B2C Industries: Transforming Customer Experience with…"
description: "The article discusses the implementation of Large Language Models (LLMs) in B2C industries, particularly for enhancing customer service through autonomous agents. It outlines the development of an Agentic Retrieval-Augmented Generation (RAG) system for handling credit card inquiries, utilizing embeddings, vector databases, and prompt engineering to improve response accuracy. The process includes data ingestion, embedding creation, and deployment using frameworks like Flask or Streamlit. The integration of LLMs with RAG systems significantly enhances customer engagement by providing real-time, contextually aware responses, ultimately improving operational efficiency and customer satisfaction."
date: 2024-11-16T11:03:34Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Zf15fyqPpBcoEHf6G5rgbw.jpeg"
categories: ["Programming", "Machine Learning", "Chatbots"]
author: "Rifx.Online"
tags: ["LLMs", "RAG", "embeddings", "vector", "Flask"]
draft: False

---






In the rapidly evolving landscape of B2C industries such as financial services, retail, and eCommerce, customer expectations for personalized and instant responses are at an all\-time high. With the advancement of AI technologies, particularly Large Language Models (LLMs), there has been a dramatic shift in how companies can handle customer interactions. In industries like banking and credit card services, where customers frequently seek detailed information about products, benefits, or transactions, the adoption of LLM\-powered autonomous agents offers significant advantages. These agents can provide real\-time, intelligent responses, transforming customer engagement while driving operational efficiency.

In my experience with AI product development in the financial services industry, these LLM\-powered agents, when implemented correctly, can serve as a game\-changer. They offer scalable, contextually aware customer support that not only improves satisfaction but also reduces the reliance on human agents. But how do we develop these intelligent systems? Below, I’ll walk you through the business problem of creating an Agentic Retrieval\-Augmented Generation (RAG) system for handling customer queries related to credit card products and explain how LLMs, embeddings, vector databases, and prompt engineering come together in this solution.


## Business Problem: Creating an Autonomous Agent for Credit Card Queries

Imagine a major financial services company that offers a variety of credit card products to its customers. Handling customer queries about features, benefits, interest rates, and rewards programs for different credit card products is a labor\-intensive process. The goal is to develop an AI agent capable of handling a large volume of questions autonomously, accurately, and with deep contextual understanding.


### Data Source for Agentic RAG Development

For this use case, we’ll use a public data source from Citibank, where a range of credit card product details is available to save as PDF format. These documents contain the necessary information for answering customer queries regarding Citibank’s credit card products: [Citibank Credit Cards Overview](https://www.citi.com/credit-cards/compare/view-all-credit-cards?intc=citicard_vac_202405_AB). The complete code base with step by step notebook can be found in this [git repo](https://github.com/nitsourish/Conversational_AIchatbot).

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*rNgsnBXq0R-RnKfSVCQ26Q.png)


## Embeddings and Vector Database Creation

To enable the AI agent to retrieve relevant information from the available product PDFs, the first step is to create embeddings. Embeddings are vector representations of text that allow the model to capture the semantic meaning of words, phrases, and even full documents in a continuous vector space.

In this use case, PDF files containing details on different credit cards are downloaded and processed. Using pre\-trained language model **text\-embedding\-3\-small**, we convert the textual data into dense vector representations. These vectors are stored in a vector database, which enables efficient similarity searches.

**Key Steps:**

1. **Data Ingestion**: PDFs of Citibank’s credit card products are parsed and converted into textual format.


```python
for file in os.listdir("../credit_card_products"):
    if file.endswith(".pdf"):
        loaders.append(file)     
pdf_loaders = [PyPDFLoader(f"../credit_card_products/{file}") for file in loaders]

pages = []

for loader in pdf_loaders:
    pages.extend(loader.load())
```
**2\. Chunking(Splitting)**: Idea is to split the text into chunks , using newline (`"\n"`) as the separator. Each chunk has an certain overlap of characters. This helps ensure smoother text segmentation for downstream processes like embedding or retrieval.


```python
text_splitter = CharacterTextSplitter(
    separator="\n",
    chunk_size=1500,
    chunk_overlap=100,
    length_function=len
)
docs = text_splitter.split_documents(pages)
```
**3\. Embedding Creation and Vector Database** : Use an LLM\-based embedding model to convert the preprocessed text into vector representations and Store the embeddings in a vector database such as Pinecone, FAISS, or a MongoDB\-based custom solution.We used here FAISS(Facebook AI Similarity Search).This will allow fast, scalable search over large sets of documents.


```python
embeddings_model = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY, model="text-embedding-3-small")
## Load it into the vector store and embed
vectordb = FAISS.from_documents(docs, embeddings_model)
```

## Large Language Models (LLM) and Retrieval\-Augmented Generation (RAG)

LLMs, such as GPT models, are powerful at generating human\-like text, but their capabilities are amplified when paired with RAG systems, significantly reducing hallucinations in Large Language Models (LLMs) and enabling autonomous agents to provide reliable and context\-aware information.Retrieval\-Augmented Generation (RAG) improves the performance of LLMs by augmenting their response generation with relevant external knowledge retrieved from a vector database. In real world the retrieval source can be anything, enterprise vector database to private or public urls(wikipedia,google docs etc.)

In the context of our credit card agent, a customer query might include: “What is the interest rate(APR) on Costco Anywhere Visa® Card by Citi?” A RAG\-based system would work in two steps:

**1\. Retrieval**: Use the vector database to fetch the relevant sections of the Citibank credit card PDFs based on the embedding similarity to the query.


```python
retriever = vectordb.as_retriever(search_type="similarity", search_kwargs={"k": 6})
```
**2\. Generation**: The LLM takes the retrieved context and generates a detailed and accurate response that directly answers the customer’s question.


```python
question = """ """

ai_msg = rag.invoke({"input": question, "chat_history": retriever})

```
This approach ensures the agent’s responses are both grounded in real data (retrieved from the database) and contextually relevant.


## Prompt Engineering for Improved Interaction

An essential aspect of deploying LLM\-powered agents is prompt engineering. In this process, carefully designed prompts guide the LLM to generate accurate and contextually relevant outputs. When answering queries related to credit card products, the agent needs to be able to understand user intent, retrieve the right information from the database, and respond in a conversational manner.

Examples of effective prompt engineering include:

* **Contextual follow\-ups**: Clearly explaining the roles and information domain. We use here *ChatPromptTemplate from* from *langchain\_core.*


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
By fine\-tuning the prompt and ensuring it covers various angles of the query, the AI agent delivers better customer experiences leveraging best possible contexts and instruction.


## Retrieving Chat History for Context Awareness

One of the challenges with AI\-powered customer service is providing coherent, context\-aware responses across a series of interactions. For example, a customer might ask multiple questions about a credit card product in a single session. To maintain the conversational flow, the system must keep track of prior interactions.


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
Retrieving chat history helps the agent maintain context and deliver more personalized responses. This is especially crucial in situations where the customer asks follow\-up questions or shifts between multiple products. The system ensures that earlier data points (e.g., the product the customer is discussing) remain part of the current conversation.


## Langchain: Orchestrating the Agent

Langchain is an essential tool for connecting all these components: LLMs, vector databases, RAG systems, and external APIs. It provides an integrated framework for building these autonomous agents, streamlining the development process, and ensuring that the agent works seamlessly across different tasks, including retrieval, context generation, and response formulation.


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
Langchain’s modular architecture allows easy integration of different data sources, whether they are stored in a vector database or accessible through APIs. It also facilitates real\-time orchestration of user queries with appropriate retrieval, generation, and contextual awareness mechanisms.


## Deployment using Flask and Streamlit

Once the RAG model is trained and optimized, it can be deployed using lightweight web frameworks such as Flask or Streamlit. Flask allows for more customization and control over the deployment, while Streamlit offers rapid prototyping with a focus on simplicity. The full implementation is in [git repo](https://github.com/nitsourish/Conversational_AIchatbot).

**Flask Example:**

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
**Streamlit Example:**


```python
st.title("Credit Card Product Query Agent")
user_query = st.text_input("Ask a question about Citi credit cards:")
if user_query:
    response = rag_chain.invoke({"input": user_query})
    st.write(f"Response: {response}")
```
![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*uOXAnRB0yln6U21aCUMy9Q.png)


## Key Takeaways and Road Ahead

In this blog, I discussed Relevance of LLMs in B2C Industries especially areas with high customer touch\-points with a special application of conversational AI agent for banking products including step by step development and deployment of RAG based Pipeline leveraging popular lang\-chain framework.The flow includes customized engineering pipeline with data ingestion, configuration of vector database(retriever).Finally there is demonstration of deployment using micro web frameworks like Flask for full control or Streamlit for quick prototyping.

In today’s fast\-paced B2C environment, providing quick, accurate, and personalized customer service is key to gaining a competitive advantage. By combining LLMs with vector databases, retrieval\-augmented generation (RAG), and prompt engineering, companies can deploy AI agents that not only answer customer queries but do so with high contextual accuracy.

Thanks for reading the article. To read such exciting AI stories follow my [medium stories](https://medium.com/@sourish.syntel).


