---
title: "Build a Medical Chatbot Using Open Source Model: Transforming Healthcare Through AI"
meta_title: "Build a Medical Chatbot Using Open Source Model: Transforming Healthcare Through AI"
description: "The article outlines the process of building a fully open-source medical chatbot using AI. It details the steps taken, including environment setup, text embedding creation, vector database configuration, and the integration of a large language model (LLM) for generating responses. The final step involves creating a user interface with Streamlit for user interaction. The chatbot is designed to provide accurate and empathetic medical information based on user queries and relevant documents from a vector database. The project aims to enhance access to reliable healthcare information through AI technology."
date: 2025-01-09T01:53:19Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*850c_t9WLHYl_hCZeTNtSw.jpeg"
categories: ["Programming", "Chatbots", "Health"]
author: "Rifx.Online"
tags: ["medical", "chatbot", "embedding", "LLM", "Streamlit"]
draft: False

---






AI is transforming healthcare, and chatbots provide quick and reliable medical information. As I continued to gain more knowledge in generative AI, I wanted to build a medical chatbot that is completely 100% open source. My goal was to get the medical bot to answer medical questions by tapping into a wealth of medical literature. However, I faced some challenges and breakthroughs which will be addressed later. I took these steps to achieve this project.

**Step 1: Environment and Requirement Setup**

First things first, I created a new repository on my GitHub and cloned it to my local machine. Once that was done, I set up an `.env` file to store my API keys and a `requirements.txt` file with all the libraries I’d need for the project. Pretty straightforward, but it laid the foundation for everything else.

Note: API keys should be hidden so do not push that to your GitHub.

**Step2: Setting Up Text Embeddings**

I used the `HuggingFaceEmbeddings` class to create embeddings with the `all-MiniLM-L6-v2` model. This step was crucial for transforming text into numerical vectors, making it easier for the model to understand and process the data. Essentially, it allowed me to take raw text and represent it in a format that could be used for tasks like similarity searches or clustering.


```python
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
```
**Step3: Vector Database Setup**

This code was used to set up Pinecone, a vector database, to store and search through embeddings. I first fetched the `PINECONE_API_KEY` from the environment and used it to connect to Pinecone. Then, I created an index called "medicalbot" to store the embeddings for efficient similarity searches. With this setup, I defined a function to search through the stored data by comparing user queries to the vector store, returning the most relevant results.


```python
PINECONE_API_KEY = os.environ.get('PINECONE_API_KEY')
pc = Pinecone(api_key=PINECONE_API_KEY)
index_name = "medicalbot"
index = pc.Index(index_name)

vector_store = PineconeVectorStore(index=index, embedding=embeddings)

def search_db(user_query: str) -> list:
    sim_docs =[]
    result = vector_store.similarity_search_with_score(
    user_query, k=3
    )
    for doc in result:
        sim_docs.append(doc[0].page_content)
    
    return sim_docs    

search = search_db(user_query="What is candidiasis?")


```
**Step 4: LLM set up**

I set up a medical AI chatbot that provides answers based on medical documents. It uses a large language model (LLM) called `ChatGroq` with the "llama\-3\.3\-70b\-versatile" model. The function `medicalbot_ai` takes in a user query and a list of relevant documents. It then processes the query, uses the documents to generate an accurate, conversational, and professional response, and returns the answer to the user. The response is tailored to be both informative and empathetic, ensuring the AI provides accurate and helpful information.

Note: I have come to find out how important prompting is in AI. How good a query output is is dependent on how good the prompt is.


```python
## ---------------------------- LLM --------------------------------------
llm = ChatGroq(model_name="llama-3.3-70b-versatile", temperature=0.5)

def medicalbot_ai(user_query: str, doc_list: list) -> str:
    template = """
    You are a medical consultant AI chatbot. Your role is to provide accurate and reliable answers to user questions based on the provided documents. Use the information from the `doc_list` to address the `user_query` thoroughly and correctly. Ensure that your response is:

    - **Accurate:** Base your answers solely on the information in the provided documents.
    - **Conversational:** Maintain a friendly and approachable tone.
    - **Mature and Consultancy-Oriented:** Present information in a professional and trustworthy manner.

    **Inputs:**
    1. `user_query`: {user_query} The question posed by the user.
    2. `doc_list`: {doc_list} A list of documents containing relevant information related to the user's question.

    **Instructions:**
    - Analyze the `user_query` and identify the key information needed to answer it.
    - Review the `doc_list` to find relevant information that addresses the query.
    - Construct a response that is clear, concise, and directly answers the user's question using the information from the documents.
    - Avoid introducing information not present in the `doc_list`.
    - If the `user_query` have nothing similar to what is in the `doc_list`, return document not found or something in an apologetic way, tell the user to ask for something related to the context.
    - If the  `user_query` is an empty string, respond with "Please provide a valid query.".
    - Maintain a tone that is both professional and empathetic, suitable for a consultancy setting.
    
    Return the answer as the only output. 
    Always make sure that you're returning the answer without any explanation. 
    The output should be the answer alone.
    Always return this: "Please provide a valid query." for empty query.
    """
    question_prompt = PromptTemplate(input_variables=["user_query", "doc_list"], template=template)
    initiator_router = question_prompt | llm | StrOutputParser()
    output = initiator_router.invoke({"user_query":user_query, "doc_list":doc_list})
    return output
```
**Step 5: Integrating the Medical Chatbot Workflow for User Queries**

The `medical_chatbot` function is the heart of the chatbot’s workflow. It processes the user’s query and generates an accurate and relevant medical response. The function begins by logging that it's searching for documents related to the user's query in the vector database using the `search_db` function. Once the relevant documents are retrieved, the function then calls the `medicalbot_ai` function to generate a response, using the fetched documents to provide an accurate, conversational, and professional answer. After the response is generated, the function logs the final step and returns the chatbot's response to the user.

This function seamlessly connects the document search process and AI\-based answer generation, ensuring the chatbot responds accurately to user queries.

**Step 6: Building the Chatbot Interface Using Streamlit**

To bring everything together into a functional chatbot, we’ll use the *Streamlit* library to create a user interface.

I used Streamlit because it is free and the medical bot can be interacted with by others.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*yD9EtsqLXs9FETlcDRsCdQ.png)


## CONCLUSION

This these steps, you can successfully build a medical chatbot that is 100% open source and deploy using Streamlit so users can interact with it.

For full code and further details, check out the project repository on GitHub: <https://github.com/Chinelonweke/medicalbot>

Interact with the medical chatbot here: [https://medicalbot\-semf2x7tccjtfv8fzd7iih.streamlit.app/](https://medicalbot-semf2x7tccjtfv8fzd7iih.streamlit.app/)

Thank you for reading and please leave your opinion.

You can find me here;

LinkedIn: [**Chinelo Nweke**](https://www.linkedin.com/feed/?trk=404_page)

x: [**Nelo Nweke**](https://x.com/nelonweke?s=21)


