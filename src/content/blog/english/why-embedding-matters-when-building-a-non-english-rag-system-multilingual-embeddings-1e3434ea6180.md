---
title: "Why embedding matters when building a non-English RAG system — Multilingual embeddings"
meta_title: "Why embedding matters when building a non-English RAG system — Multilingual embeddings"
description: "Discover why multilingual embeddings are crucial for RAG systems, with a detailed comparison of English vs. multilingual models in Dutch."
date: 2024-11-13T01:22:29Z
image: "https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*QvODAYxqisUTrt4V.png"
categories: ["Natural Language Processing", "Machine Learning", "Multilingual"]
author: "Rifx.Online"
tags: ["embeddings", "multilingual", "RAG", "Cohere", "Dutch"]
draft: False

---





## Why Embeddings are Key

Embeddings are a cornerstone of modern generative AI, silently driving the functionality of many systems we interact with daily. At their simplest, embeddings are **numerical representations of text** — effectively transforming words, sentences, or even entire documents into numbers. These numbers are far from random; they’re carefully designed to capture the meaning and relationships within the text. For instance, the embeddings for “dog” and “puppy” would be closer together in the numerical space than the embedding for “car,” reflecting their **semantic similarity**. This ability to encode meaning into a measurable form is what makes embeddings indispensable for tasks like search, recommendation systems, and advanced AI applications such as **Retrieval\-Augmented Generation (RAG)**.



This transformation into numbers allows AI to compare and understand text in a meaningful way. When working with massive amounts of data, as is often the case in RAG systems, embeddings become essential. These systems combine the power of embeddings with specialized storage solutions called **vector databases**. Unlike traditional databases that search for exact matches, vector databases are optimized to find the closest matches based on meaning. This capability enables RAG systems to retrieve the most relevant information from vast knowledge bases and use it to generate precise, contextually informed responses. By bridging raw data and intelligent retrieval, embeddings and vector databases together form the backbone of RAG systems’ success.


## The Challenge of Multilingual Systems

Building RAG systems that work well in English is already a complex task, but extending them to other languages introduces a whole new set of challenges. English embeddings are often highly optimized because of the abundance of training data and the simplicity of the language’s structure. However, using these English\-trained embeddings for other languages can lead to significant inaccuracies. Different languages come with their own nuances, grammar, and cultural contexts, which standard embedding models trained predominantly on English text often fail to capture. While some multilingual embedding models exist to bridge this gap, they are not all equally effective across languages, particularly for those with limited training data or unique linguistic features. This makes it difficult to build RAG systems that are as accurate and reliable for non\-English languages as they are for English.


### Why Are English Embeddings More Accurate?

1. **Abundance of High\-Quality Training Data**
English dominates the digital landscape, with an unparalleled volume of high\-quality content available for training. Datasets like Wikipedia, books, research papers, and social media are much richer in English than in other languages. In contrast, many languages, especially low\-resource ones, lack diverse and standardized datasets, which limits the quality of embeddings trained on them.
2. **Model Optimization Bias**
NLP models like BERT and GPT were initially developed and optimized for English, often prioritizing it even in multilingual versions. Multilingual models balance learning across many languages within the same parameter space, which can dilute performance for less\-represented languages in favor of dominant ones like English.
3. **Linguistic Complexity and Diversity**
English has relatively simple morphology compared to many other languages. For instance, word forms in English tend to remain consistent (e.g., “run” and “running”), while languages like Turkish or Finnish have highly inflected forms, where a single root word can have dozens of variations. Additionally, languages with different syntax or word order, such as Japanese (Subject\-Object\-Verb) or Arabic (flexible word order), pose extra challenges for models optimized for English\-like structures.
4. **Semantic and Cultural Alignment**
Capturing semantic meaning across languages is far from straightforward. Words and phrases often carry nuanced meanings that don’t translate directly. For example, the English word “love” has multiple culturally distinct equivalents in other languages (e.g., “amor” in Spanish, “eros” or “agape” in Greek). Embeddings that fail to account for these differences struggle with multilingual alignment.
5. **Benchmarking and Evaluation Bias**
Many benchmarking datasets and evaluation methods are designed with English in mind. This English\-centric focus can artificially inflate the perceived performance of models in English while masking their limitations in other languages.


### The Impact on RAG Systems

When embeddings fail to handle the complexity of other languages, the consequences for RAG systems can be significant. Retrieval results often become less relevant or even outright wrong, as the embeddings may struggle to capture the nuanced meaning of non\-English queries. This doesn’t just impact accuracy — it also undermines user trust and the overall utility of the system. Crucial text chunks may be missed during retrieval, preventing the system from accessing the information it needs to generate accurate and contextually relevant responses.

For a multilingual RAG system to perform well, it requires embeddings that can align semantically across languages while accounting for their unique structural and cultural intricacies. Investing in high\-quality multilingual embeddings and fine\-tuning them for specific languages or tasks is essential. This ensures that RAG systems can meet the needs of users in any language — not just English.

But how well do different embeddings actually perform in a non\-English context? To explore this, we’ll compare an English embedding model with a multilingual embedding model using a Dutch dataset. This test will reveal how different approaches to embeddings impact retrieval accuracy and the quality of the generated responses in a multilingual RAG system.


## Comparing Embedding Models for a Dutch RAG System

To understand how different embedding models handle a non\-English language like Dutch, we’ll compare two models available on Amazon Bedrock: **Cohere Embed English v3** and **Cohere Embed Multilingual v3**. These models represent different approaches to embeddings — one optimized exclusively for English and the other designed for multilingual tasks. The table below summarizes their key attributes:

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*pBhIHfOsb-McrjHKvtq4Xw.png)


### Build Embeddings

To evaluate the performance of the embedding models, we will build a local vectorstore using the LangChain framework. For this evaluation, we will use a guideline for firefighters written in Dutch as our dataset. This document contains technical and procedural information, making it a realistic and challenging use case for semantic retrieval in a non\-English language. Below is the cleaned and streamlined code for creating a local vectorstore and indexing document chunks. We’ll use this setup to test two embedding models: **Cohere Embed English v3** and **Cohere Embed Multilingual v3**.


```python
import os
from langchain_community.document_loaders import DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain_aws import BedrockEmbeddings
import boto3

## Step 1: Load documents
loader = DirectoryLoader('data', glob="**/*.pdf")  # Adjust 'data' to your document directory
documents = loader.load()

print(f"You have {len(documents)} documents")
print(f"Document 1 contains {len(documents[0].page_content)} characters")

## Step 2: Split documents into smaller chunks
text_splitter = RecursiveCharacterTextSplitter(chunk_size=400, chunk_overlap=50)
chunks = text_splitter.split_documents(documents)

print(f"You have {len(chunks)} chunks")
print(f"The first chunk is {len(chunks[0].page_content)} characters long")

## Step 3: Set up Bedrock embeddings
bedrock_client = boto3.client("bedrock-runtime", region_name='us-east-1')
bedrock_embeddings = BedrockEmbeddings(model_id="cohere.embed-multilingual-v3", client=bedrock_client)

## Step 4: Build the FAISS vectorstore
vectorstore = FAISS.from_documents(chunks, bedrock_embeddings)

## Save the vectorstore locally for reuse
vectorstore.save_local("faiss_cohere_multilingual")
```

## How This Code Works

1. **Document Loading**:
The code loads all PDF files from the `data` directory. You can adjust the file path and format to match your dataset.
2. **Text Splitting**:
Documents are split into smaller chunks of 400 characters with a 50\-character overlap to improve retrieval accuracy. This ensures each chunk remains contextually meaningful.
3. **Embedding Models**:
The `BedrockEmbeddings` class initializes the embedding model. You can replace the `model_id` to test **Cohere Embed English v3 or Cohere Embed Multilingual v3**.
4. **Local Vectorstore**:
The FAISS library is used to create an in\-memory vectorstore from the document chunks. This allows for fast similarity searches and can be saved locally for reuse.

To test all models, replace the `model_id` in the `BedrockEmbeddings` initialization with the appropriate model:

* `"cohere.embed-english-v3"` for Cohere English.
* `"cohere.embed-multilingual-v3"` for Cohere Multilingual.


### Evaluating the Embedding Models

To evaluate the performance of the embedding models, we will ask the question: **“Welke rangen zijn er bij de brandweer?”**, which translates to **“Which ranks exist within the fire department?”**. This question was chosen because our document only uses the term **“hiërarchie”**, which in Dutch has a similar semantic meaning to **“rangen”**. However, in English, “hierarchy” and “ranks” do not share semantic similarity.

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*6N3C8C500hMQ3GNNkuu21A.png)

This distinction is crucial for our test. We expect the **Cohere Embed English v3** model to struggle with this query, as it relies on English semantics where the terms are unrelated. On the other hand, the **Cohere Embed Multilingual v3** model, which is trained to understand Dutch semantics, should retrieve the correct information from the document, demonstrating its ability to handle semantic nuances in non\-English languages.

By asking this question, we aim to highlight how semantic alignment affects retrieval performance in a Dutch RAG system. This test will provide a clear comparison of the models’ ability to handle non\-English queries and retrieve relevant information. The results will showcase the importance of multilingual embeddings for achieving accurate retrieval in non\-English contexts.

To implement and test this setup, we can use the following code. This script demonstrates how to query the vectorstore and utilize a RAG chain to combine the embeddings with a language model for answering questions. Note that when testing different embeddings (e.g., **Cohere Embed English v3** vs. **Cohere Embed Multilingual v3**), you need to ensure that the vectorstore is built using the corresponding embedding model. Replace the vectorstore with the one indexed using the embedding model you want to test for accurate results.


```python
from langchain.prompts import ChatPromptTemplate
from langchain_aws import ChatBedrock
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

instructions = """Je bent een brandweer expert. Beantwoord de vraag, maak gebruik van de context"""

human = """
Dit is de context: {context}
Dit is de vraag: {question}
"""

prompt = ChatPromptTemplate(
    messages=[
        SystemMessagePromptTemplate.from_template(instructions),
        HumanMessagePromptTemplate.from_template(human), #User query will go here
    ],
    input_variables=['context','question'], # context provided by retriever and question by the user
)
model = ChatOpenAI(
    model="gpt-4",  # or "gpt-3.5-turbo" based on your needs
    temperature=0,
    max_tokens=512
)

## Function to merge text chunks
def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)


## RAG chain
rag_chain = (
        {"context": vectorstore.as_retriever(k=10) | format_docs, "question": RunnablePassthrough()}
        | prompt
        | model
        | StrOutputParser()
)

rag_chain.invoke("Welke rangen zijn er bij de brandweer?")
```

## Results of the Embedding Models

To evaluate the performance of the two embedding models, we asked the question: **“Welke rangen zijn er bij de brandweer?”** (translated: “Which ranks exist within the fire department?”). Below are the responses generated by each model:


### Cohere Embed English v3

**Response**:*“De tekst geeft geen specifieke informatie over de verschillende rangen binnen de brandweer. Echter, in veel brandweerorganisaties zijn er verschillende rangen zoals brandweerman, luitenant, kapitein, bataljonschef, assistent\-chef en brandweerchef. De specifieke rangen kunnen variëren afhankelijk van het land en de specifieke organisatie.”*

**Analysis**:The response is generic and doesn’t rely on the provided context from the Dutch document. This is expected, as the English embedding model struggles to connect the semantic similarity between “hiërarchie” (used in the document) and “rangen” (used in the query). Consequently, it defaults to general knowledge about fire department ranks.


### Cohere Embed Multilingual v3

**Response**:*“Binnen de brandweer zijn er verschillende rangen. Deze zijn onderverdeeld in het basiskader en het middenkader. In het basiskader hebben we de B01 brandweerman en de B02 korporaal. In het middenkader, dat bestaat uit onderofficieren, hebben we de M01 sergeant en de M02 adjudant. Deze rangen worden aangeduid op het diensttenue, het uitgaanstenue en op de interventiekledij.”*

**Analysis**:This response is highly relevant and accurately retrieves information from the document. The multilingual embedding model successfully identifies the semantic relationship between “hiërarchie” (context) and “rangen” (query). It provides a detailed answer directly based on the content of the document, demonstrating its ability to handle Dutch\-specific semantics effectively.


### Key Takeaways

* **Cohere Embed English v3**: The English model failed to retrieve relevant context from the Dutch document due to a lack of semantic alignment between the query and the document’s terminology. This highlights the limitations of using English\-specific embeddings for non\-English tasks.
* **Cohere Embed Multilingual v3**: The multilingual model excelled in this test, retrieving and leveraging contextually relevant information from the Dutch document. This demonstrates the importance of multilingual embeddings for achieving accurate retrieval and answering non\-English queries effectively.


## Conclusion

This evaluation highlights a critical insight for anyone building Retrieval\-Augmented Generation (RAG) systems for non\-English languages: **embeddings matter**, especially when the task demands nuanced understanding across languages. The stark contrast in performance between the Cohere Embed English v3 and Cohere Embed Multilingual v3 models illustrates the limitations of English\-specific embeddings in non\-English contexts and the immense value of multilingual models.

When tasked with answering a query in Dutch, the multilingual model excelled, retrieving accurate and contextually rich information directly from the document. Meanwhile, the English embedding model defaulted to generic, unrelated knowledge, demonstrating its inability to bridge the semantic gap between the query and the document’s content.

For organizations developing AI systems in a global, multilingual landscape, this test reinforces the importance of choosing the right embedding models for the task at hand. Multilingual embeddings are not just a “nice\-to\-have” feature; they are essential for ensuring accuracy, relevance, and user trust in non\-English applications.

As generative AI continues to expand its reach, embracing language diversity through better embeddings will be key to delivering meaningful and impactful solutions worldwide. By prioritizing multilingual capabilities, businesses can create systems that are not only smarter but also more inclusive — empowering users across languages and cultures.

***Follow me for more AI deep dives!***

[Medium](https://proxy.rifx.online/https://medium.com/@lorevanoudenhove), [Instagram](https://proxy.rifx.online/https://www.instagram.com/lorevanoudenhove.ai/), [YouTube](https://proxy.rifx.online/https://www.youtube.com/channel/UCVyOJS1VV7FxPsStK65pHcA), [Pairrot](https://proxy.rifx.online/https://www.pairrot.eu/)


