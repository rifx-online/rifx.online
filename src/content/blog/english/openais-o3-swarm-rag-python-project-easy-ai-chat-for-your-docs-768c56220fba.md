---
title: "OpenAI’s o3 + Swarm + RAG Python Project: Easy AI/Chat for your Docs | by Gao Dalie (高達烈) | Dec, 2024 | Towards AI"
meta_title: "OpenAI’s o3 + Swarm + RAG Python Project: Easy AI/Chat for your Docs | by Gao Dalie (高達烈) | Dec, 2024 | Towards AI"
description: "The article provides a tutorial on creating a multi-agent chatbot using OpenAIs o3 model, Swarm framework, and RAG techniques. It introduces the capabilities of the o3 model, which excels in inference tasks and surpasses human-level performance on the ARC-AGI benchmark. Swarm is highlighted as a lightweight framework for coordinating multiple AI agents, facilitating efficient problem-solving through task delegation. The tutorial includes coding examples for setting up agents to handle finance and sports queries, demonstrating the routing and handoff mechanisms within the Swarm client. Overall, it showcases the integration of advanced AI models and frameworks for enhanced chatbot functionality."
date: 2024-12-30T03:24:30Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*4JYFbwMYlpVWIe0elfyXrQ.png"
categories: ["Chatbots", "Programming/Scripting", "Machine Learning"]
author: "Rifx.Online"
tags: ["o3", "Swarm", "RAG", "ARC-AGI", "chatbot"]
draft: False

---






In this story, I have a super quick tutorial showing you how to create a multi\-agent chatbot with Swarm, Rag and OpenAI’s o3 to make a powerful Agent Chatbot for your business or personal use.

In recent years, with the development of AI technology, “multi\-agent systems” in which multiple AI agents cooperate to accomplish tasks have been attracting attention.

LLMs are like the human brain that can think independently, while AI agents are systems that further interact with the environment, make plans, and finally execute tasks. Compared to LLMs, AI agents not only tell you what to do but also help you execute it.

A large model has emerged that can not only reason but also clearly demonstrate its own “reasoning logic”.

Just now, OpenAI ushered in the finale of the year\-end AI Spring Festival Gala.

The o3 series models released this time are iterative versions of o1\. Considering possible copyright or trademark conflicts with British telecom operator O2, OpenAI decided to skip the “o2” naming and directly adopt “o3”.

OpenAI announced its latest inference models “o3” and “o3\-mini,” sending shock waves through the AI ​​industry. In the ARC\-AGI benchmark, o3 achieved an astounding score of 87\.5%, exceeding the human average score of 85%. In addition, o3\-mini is optimized for coding, achieving low\-cost and fast performance. These models outperform conventional AI models in complex inference tasks and set new standards in safety.

Swarm is a lightweight and experimental framework designed to support the development of multi\-agent systems. Unlike traditional approaches that rely heavily on the underlying Large Language Model (LLM) API, it provides a stateless abstraction for managing interactions and handovers between multiple agents.

So, let me give you a quick demo of a live chatbot to show you what I mean.







Let me ask a simple question: How do I know my current financial situation? If you take a look at how the Swarm agent generates the output. You will see that I have passed the file path to PyPDFLoader to load a PDF, extract the content, and then split it into smaller chunks using RecursiveCharacterTextSplitter. These chunks are converted into vector representations using OpenAIEmbeddings and stored in a Chroma vector store for easy retrieval.

A function, `retrieve_and_generate_Finance`, is created to fetch relevant documents and generate answers for finance\-related queries, while `retrieve_and_generate_sports` handling sports\-related questions.

Two agents, `Finance_agent` and `sports_agent`, are responsible for answering queries in their respective domains. A `central_agent` route questions to either the Finance or Sports agent based on the query's content, with handoff functions guiding the transfer.

A Swarm client is used to interact with the agents, demonstrating how the `central_agent` route a finance\-related query to the Finance agent, showing the agent's functions or the generated response.

In this story, I will give you an overview of OpenAI’s o3, explain what Swarm is, its features, why we use Swarm, and how to implement all these techniques together to create a powerful chatbot.


## Before we start! 🦸🏻‍♀️

If you like this topic and you want to support me:

1. **Clap** my article 50 times; that will really help me out.👏
2. [**Follow**](https://medium.com/@mr.tarik098) me on Medium and subscribe to get my latest article for Free🫶
3. Join the family — Subscribe to [**YouTube channel**](https://www.youtube.com/channel/UC6P5WCWjqhhXVFBqbJHNxyw)


## What is o3

o3 is an AI model developed by OpenAI that specializes in inference. Most conventional AI models generally function only within the scope of specific tasks or learned knowledge.

However, o3 goes beyond that framework and has been developed to be able to respond flexibly to unknown tasks and complex problems like a human being

The o3 series includes two heavyweight models:

* OpenAI o3: flagship version with powerful performance
* OpenAI o3 mini: A lightweight model that is faster, cheaper, and more cost\-effective

Don’t be too happy just yet, because the o3 series is not currently open to ordinary users. OpenAI plans to open external security testing applications first, and the official release is expected to be in January next year


## Main features of OpenAI o3

Of particular note is the astonishing score that o3 achieved on the “ARC\-AGI” benchmark, which is intended **to be the North Star on the path to AGI.**

ARC\-AGI is a highly challenging test that measures the extent to which an AI can solve “problems of a type it has never seen before,” or in other words, evaluates its “human\-level reasoning ability.”

Previous GPT series models had been unable to improve their scores on this test. GPT\-3 and GPT\-4o only saw a small improvement, with GPT\-4o improving by about 5%.

However, o3 achieved a score of 75\.7% even with a small number of inferences (so\-called “Low\-compute” mode) and reached **87\.5% in the “High\-compute” mode, which uses even larger amounts of computing resources.**

This figure exceeds the average human performance (around 85%) and marks an important milestone in demonstrating the potential for AI to surpass humans.

In the past, it has been widely pointed out that simply making AI larger is not enough to deal with truly new problems, but o3’s adoption of a new architecture that enables “language program exploration and execution” is thought to have had a major impact.


## What is a Swarm?

Swarm is a framework for coordinating multiple AI agents to perform complex tasks.

It is described by the keywords “lightweight,” “ergonomic,” and “experimental.” It aims to enable the building and orchestration of agents with minimal abstraction, allowing users to build and experiment with multi\-agent systems without complex configuration easily.

Swarm enables efficient problem\-solving by breaking down complex problems into smaller tasks and assigning each task to a specialized agent.


## 1\.2 Swarm Features

* **Lightweight and ergonomic:** A simple interface and minimal abstraction make it easy to build multi\-agent systems. It’s intuitive and doesn’t require complex configuration or boilerplate code.
* **A high degree of control and testability:** Swarm allows you to exercise fine\-grained control and testability over agent behavior, allowing you to customize the role and capabilities of each agent and fine\-tune the system's behaviour as a whole.
* **Scalability and flexibility:** The system can be easily scaled by adding more agents as needed. Each agent can be specialized for a specific task, allowing it to handle complex problems efficient
* **Handoffs and Routines:** Core concepts in Swarm are “handoffs” and “routines.” Routines define the behavior of agents, and handoffs manage the transfer of control between agents, allowing multiple agents to work together to handle complex tasks.
* **Client\-side execution:** Swarm runs client\-side, unlike OpenAI’s Assistants API (o1\-preview/mini), which means you have full control over Swarm’s behavior and visibility into its state and what it is doing, which is useful for debugging and understanding system behavior.

**Why use Swarm?**

Swarm is designed to be lightweight, extensible, and highly customizable. It works best when many independent functions and instructions are difficult to encode into a single prompt.

If you’re looking for fully managed threads and built\-in memory management and retrieval, the Assistants API is a good choice. But if you want full transparency and fine\-grained control over context, steps, and tool invocations, Swarm is the best choice. Swarm runs (almost) entirely on the client side and, much like the Chat Completions API, does not store state between invocations.

The team also demonstrated an application example, including a weather query agent, a multi\-agent setup for handling different customer service requests in an airline environment, a customer service bot, a personal agent that can help with sales and refunds, etc. Specific examples can be found in the Swarm code repository.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*xrJN4llbhf-MRG7N5nh5zQ.png)


## Let’s start coding:

Let’s get started, you do need to download a couple of different Python libraries, namely langchain\_community, langchain\-openai, langchain\-chroma, and PyMuPDF and clone GitHub Repo if you haven’t already done so can simply type :


```python
pip install -r requirements.txt
```
Once you have done that let’s head on over to a Python file we will be making use of Langchain\_community, Langchain\_openai, langchain\_core and swarm to combine the instruction and agent needed to execute the code.


```python
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from swarm import Swarm, Agent
from langchain_chroma import Chroma
from langchain_openai import ChatOpenAI
from langchain_openai import OpenAIEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain.schema.runnable import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
import os
```
Let’s process PDF files to make them searchable using embeddings and a vector store. I use PyPDFLoader to load a PDF from a specified file path, extracting its content into docs, where each element corresponds to a page or section, and prints the number of documents loaded. After that, it splits the documents into smaller, manageable chunks using`RecursiveCharacterTextSplitter`, keeping each chunk about 1,000 characters long with a 200\-character overlap to maintain context. It then sets up the `OpenAIEmbeddings` model (`text-embedding-ada-002`) to turn the text into vector representations. These vectors are saved with`Chroma.from_documents`, which stores the data in a folder (`./chroma_db`) for easy access later. Finally, it creates a retriever from the vector store.


```python
os.environ["OPENAI_API_KEY"] =
loader = PyPDFLoader("Your path")
docs = loader.load()
print(f"Loaded {len(docs)} documents from the file.")

## Split documents into chunks
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
splits = text_splitter.split_documents(docs)
print(f"Split the documents into {len(splits)} chunks.")

gemini_embeddings = OpenAIEmbeddings(model='text-embedding-ada-002')


## Save to disk
vectorstore = Chroma.from_documents(
                     documents=docs,                 # Data
                     embedding=gemini_embeddings,    # Embedding model
                     persist_directory="./chroma_db" # Directory to save data
                     )

retriever = vectorstore.as_retriever()
print("Vector store created and persisted to './chroma_db'")
```
OpenAI has not yet released the o3 model, but I will update the model once the model is launched. And easy to change the name of the model to ‘o3\-mini’.


```python
llm = ChatOpenAI(model="o1-preview",
                 temperature=1, top_p=0.85)
```
We create a function retrieve\_and\_generate\_Finance that takes a question, retrieves relevant documents, and generates an answer based on them. It uses a template to format the prompt with context and questions. The `docs2str(docs)` function converts retrieved documents into a string, printing their content. A RAG chain combines the retriever, `docs2str`the question, and OpenAI to generate the response.


```python
def retrieve_and_generate_Finance(question):
    print("Calling retrieve_and_generate_Finance")
    template = """Answer the question based only on the following context:
    {context}
    Question: {question}
    Answer: """

    prompt = ChatPromptTemplate.from_template(template)

    def docs2str(docs):
        if not docs:
            print("No documents retrieved!")
        else:
            print("Retrieved documents:", [doc.page_content for doc in docs])
        return "\n\n".join(doc.page_content for doc in docs)


    rag_chain = (
        {"context": retriever | docs2str, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )

    response = rag_chain.invoke(question)
    return response
```
The same thing happened with the function retrieve\_and\_generate\_sports. the output is parsed with `StrOutputParser()`. The function invokes the chain with the question and returns the generated response, relying on key components like the retriever, `RunnablePassthrough()`and the language model for processing.


```python
def retrieve_and_generate_sports(question):
    print("Calling retrieve_and_generate_sports")
    template = """Answer the question based only on the following context:
    {context}
    Question: {question}
    Answer: """

    prompt = ChatPromptTemplate.from_template(template)

    def docs2str(docs):
        if not docs:
            print("No documents retrieved!")
        else:
            print("Retrieved documents:", [doc.page_content for doc in docs])
        return "\n\n".join(doc.page_content for doc in docs)

    rag_chain = (
        {"context": retriever | docs2str, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )

    response = rag_chain.invoke(question)
    return response
```
We defines three agents: Finance\_agent, sports\_agent, and central\_agent. The Finance\_agent is responsible for retrieving information from the Finance knowledge base and generating responses to finance\-related queries using the `retrieve_and_generate_Finance` function. The sports\_agent performs a similar role for sports\-related queries, using the `retrieve_and_generate_sports` function. The central\_agent determines whether a query is about finance or sports and routes it to the appropriate agent.


```python
## Define the Politics and sports agents
Finance_agent = Agent(
    name="Finance Agent",
    instructions="You retrieve relevant information from the Finance knowledge base and generate responses to general queries about Finance.",
    functions=[retrieve_and_generate_Finance]
)

sports_agent = Agent(
    name="Sports Agent",
    instructions="You retrieve relevant information from the Sports knowledge base and generate responses to general queries about the sports.",
    functions=[retrieve_and_generate_sports]
)

## Define the Central Agent
central_agent = Agent(
    name="Central Agent",
    instructions="Determine if the query is about Finance or sports, and route the query accordingly."
)
```
Then we define two handoff functions, `transfer_to_Finance` and `transfer_to_sports`, which are responsible for directing queries to the appropriate agent. The `transfer_to_Finance` function prints a message indicating the transfer to the Finance Agent and returns the `Finance_agent` to handle finance\-related queries, while the `transfer_to_sports` function prints a message indicating the transfer to the Sports Agent and returns the `sports_agent` to handle sports\-related queries. These handoff functions are then attached to the`central_agent`, allowing it to route queries to either the Finance or Sports agent based on the query's content.


```python
## Define handoff functions
def transfer_to_Finance():
    print("Handing off to the Finance Agent.")
    """Transfer the task to the Finance_agent Agent for Finance queries."""
    return Finance_agent

def transfer_to_sports():
    print("Handing off to the sports agent.")
    """Transfer the task to the sport_Agent for sports queries."""
    return sports_agent

## Attach the handoff functions to the central agent
central_agent.functions = [transfer_to_Finance, transfer_to_sports]
```
So, let’s create a Swarm client to interact with the agents and demonstrate how the `central_agent` route a finance\-related query to the Finance agent. The query, "How do I know my current financial situation?" is sent to the`central_agent`, which determines the appropriate agent (Finance or Sports). If the response is an agent, its functions are printed; if not, the last message (the generated answer) is shown. This illustrates how the `central_agent` directs queries to the correct agent based on their content.


```python
client = Swarm()

## Example 1: Asking about the politics
print("\n--- Example 1: Asking about the Finance ---")
messages = [{"role": "user", "content": "How i know my current financial situation"}]
response = client.run(agent=central_agent, messages=messages)
if isinstance(response, Agent):
    selected_agent = response
    result = selected_agent.functions
    print(result)
else:
    print(response.messages[-1]["content"])
```

## Conclusion :

Swarm makes it easy to build a system in which multiple agents work together. The concepts of route and handoffs are broad, and I think they can handle more complex functions and tasks than RAG.

In an industry where time is measured in days, even the o3 model released today will find it difficult to create another two\-year window.

Especially when new models such as Grok\-3 and Claude are ready to go, time may not be running out for OpenAI.

Wake up, the best AI company this year is still OpenAI, but next year there may be countless answers due to different AI directions.

Fortunately, as users, we will be the biggest winners in this change.


> **🧙‍♂️ I am an AI Generative expert! If you want to collaborate on a project, drop an [inquiry here](https://docs.google.com/forms/d/e/1FAIpQLSelxGSNOdTXULOG0HbhM21lIW_mTgq7NsDbUTbx4qw-xLEkMQ/viewform) or Book a [1\-on\-1 Consulting](https://calendly.com/gao-dalie/ai-consulting-call) Call With Me.**

*📚Feel free to check out my other articles:*


