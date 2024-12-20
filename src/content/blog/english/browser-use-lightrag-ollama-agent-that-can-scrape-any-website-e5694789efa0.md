---
title: "Browser-use + LightRAG Agent That Can Scrape 99% websites with LLM!!"
meta_title: "Browser-use + LightRAG Agent That Can Scrape 99% websites with LLM!!"
description: "This article presents a tutorial on creating a chatbot using Browser-Use and LightRAG to scrape any website and answer questions based on the gathered data. LightRAG enhances information retrieval by integrating graph structures, allowing for contextual understanding and efficient data handling. The combination of these technologies enables users to extract and analyze information more effectively, addressing limitations of traditional retrieval systems. Browser-Use serves as an open-source library facilitating web automation for LLMs. The article emphasizes the potential of these tools to transform information interaction across various fields."
date: 2024-12-19T22:20:03Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*r5XQP1tBlG1FjJ64roBlcQ.png"
categories: ["Programming", "Chatbots", "Technology/Web"]
author: "Rifx.Online"
tags: ["chatbot", "LightRAG", "Browser-Use", "web-scraping", "graph-structures"]
draft: False

---






In this story, I have a quick tutorial showing how to create a powerful chatbot using Browser\-use, LightRAG, and a local LLM to develop an AI agent capable of scraping any website you choose. On top of that, you can ask questions about your data, which will give you responses to that question.


> Disclaimer: This article is only for educational purposes. We do not encourage anyone to scrape websites, especially those web properties that may have terms and conditions against such actions.

Existing RAG systems suffer from significant limitations, including reliance on flat data representations and a lack of context awareness, which leads to fragmented answers and an inability to capture complex interdependencies.

To address these challenges, we propose **LightRAG and Browser\-Use**

Browser\-Use is an open\-source web automation library that supports interaction with any language model (LLM).

Through a simple interface, users can enable LLMs to interact with websites and perform tasks such as data scraping, and information querying.

**LightRAG integrates graph structures into the text indexing and retrieval** process. This innovative framework adopts **a two\-level retrieval system** to enhance comprehensive information retrieval from low\-level and high\-level knowledge discovery.

So, let me give you a quick demo of a live chatbot to show you what I mean.







I wanted to scrape a website, so I asked the agent two questions. My first question was, ‘Go to Amazon and find the cheapest laptop with 16GB VRAM and GPUs with RTX 3080 or RTX 4090\.’

The result was amazing! The browser used a large language model to extract the data, automatically locating interactive elements. If you look closely, As you see the agent will self\-correct if it can’t find an element or if the LLM makes a mistake. It also uses a vision model to take a screenshot and extract information.

For my second question, I asked the agent, ‘Go to google.com and find the article on Supervised LLM, then extract everything about Supervised Fine\-Tuning.’ If you want to know more about fine\-tuning, I covered it in my last video, which is well\-explained and well\-researched.

Once the data is loaded, we implement LightRAG to allow the LLM to handle multiple elements at once—entities, relationships, and descriptions. It tests the LLM’s understanding, and splitting tasks can reduce strain but may increase token use.

The model’s source code specifies entity types in advance, which may not generalize well to new domains, similar to the challenge of defining schemas in traditional knowledge graphs.

At a higher level, keywords guide the recall of related information, but the recall quality depends on those keywords. Ultimately, this process improves the quality of the final answer.


## Before we start! 🦸🏻‍♀️

If you like this topic and you want to support me:

1. **Clap** my article 50 times; that will really help me out.👏
2. [**Follow**](https://medium.com/@mr.tarik098) me on Medium and subscribe to get my latest article for Free🫶
3. Join the family — Subscribe to [**YouTube channel**](https://www.youtube.com/channel/UC6P5WCWjqhhXVFBqbJHNxyw)

In this video, I will explain what LightRAG is, how the LightRAG process works, the differences between LightRAG and GraphRAG, what Browser\-Use is and its features, and how to implement all these techniques together


> **Disclaimer**: This article is only for educational purposes. We do not encourage anyone to scrape websites, especially those web properties that may have terms and conditions against such actions.


## What is LightRag?

LightRAG is a fast and efficient information retrieval and generation system designed to solve the problems of conventional RAG systems. A typical RAG system aims to link LLM with external knowledge to generate more accurate answers to user questions.

Still, traditional systems are limited by flat data representation and need more context. LightRAG incorporates a graph structure into data indexing and searches to overcome these limitations and provide efficient and contextual information.


## How LightRag Works

LightRAG first applies a graph\-based data structure to preprocess entities and their relationships in the external database during information retrieval.

This process includes multiple steps:

* Extraction of entities and relationships
* Generation of retrieval key\-value pairs
* Deduplication of information

Through these steps, LightRAG not only extracts entities with specific semantics but also deepens the understanding of abstract concepts, enabling the system to perform more accurate information retrieval and generation when faced with complex problems.


## For Example

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*vT661cWFIzMaQJud-K73JA.png)


### Graph\-Based Text Indexing

LightRAG extracts entities (people, places, concepts, etc.) from documents and the relationships between them, which it uses to build a knowledge graph.

For example, from the sentence “Andrew Yan is researching artificial intelligence at the Google Brain team,” we extract the following information:

* Entities: Andrew Yan (person), Google Brain team (organization), artificial intelligence (concept)
* Relationship: Andrew Yan — Research — Artificial Intelligence, Andrew Yan — Affiliation — Google Brain team

The knowledge graph created in this way can efficiently represent complex information relationships. The left side of Figure 1 corresponds to this process.


### Two\-phase search paradigm

The LightRAG search is performed in two stages, a low\-level and a high\-level, shown in the centre part of Figure 1\.

* Low\-level search: Finding concrete entities or relationships,
e.g. specific names or concepts such as “Andrew Yan” or “The Google Brain team”.
* High\-level search: Look for more abstract topics or subjects,
e.g. a broad theme such as “The cutting edge of AI research in Google.”

This two\-tiered approach allows for balanced information retrieval that captures specific facts and the bigger picture.


## LightRAG Vs GraphRAG

LightRAG outperforms GraphRAG in efficiency, retrieval, and handling of complex queries. It uses a dual\-level retrieval system, reducing token usage to under 100 with only one API call, unlike GraphRAG’s 610,000 tokens and multiple calls.

LightRAG provides more diverse responses, captures specific and broad topics effectively, and excels with complex queries, while GraphRAG is less adaptable and incurs higher costs. LightRAG is more efficient, flexible, and suited for dynamic data environments.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*XptwuXxVl48o3QLHH5VixA.png)


## What is Browser\-Use?

Browser\-use is an open\-source web automation library that allows large language models (LLMs) to perform tasks like checking flights, searching for information, summarizing popular posts, and more.

It automatically detects clickable elements, handles cookie prompts and pop\-ups, and allows switching between multiple tabs. It can also fill out forms, extract webpage information, take screenshots, and read image content.

The tool makes intelligent decisions by analyzing the current page content to determine the next action — whether to click, enter text, or turn the page. Additionally, it has memory capabilities, enabling it to recall previously visited pages and collected information. It supports models compatible with LangChain, including GPT\-4, Claude 3\.5, and LLama.


## Let’s Start Coding

Before we dive into our application, we will create an ideal environment for the code to work. For this, we need to install the necessary Python libraries required. Firstly, we will start by installing the libraries that support the model. For this, we will do a pip install requirements. Since the demo uses the OpenAI large model, you must first set the OpenAI API Key.


```python
pip install -r requirements.txt
```
Once installed we import browser\_use, langchain\_openai, and lightrag.


```python
from browser_use import Agent, Controller
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
import os
from lightrag.lightrag import LightRAG, QueryParam
from lightrag.llm import gpt_4o_mini_complete
```
Then, we use the Controller to manage and persist the browser state across multiple agents. It allows agents to share a browsing session, maintaining consistency in cookies, sessions, and tabs.


```python
## Persist browser state across agents
controller = Controller()
```
Let’s initialise the agent to find and extract information about “LoRA LLM” by searching in Google. then we use the chatOpenai model to process and analyze the content which is connected to the `controller` to maintain the browser state.


```python
## Initialize browser agent
agent = Agent(
    task="Go to google.com and find the article about Lora llm and extract everything about Lora",
    llm=ChatOpenAI(model="gpt-4o", timeout=25, stop=None),
    controller=controller)
```
Also, we can initialise another agent, but it is optional and depends on how many agents you want to include in your code. They can do different tasks, but you need to manage each agent to a different task


```python
agent = Agent(
    task="Go to google.com and find the article Supervised llm and extract everything about Supervised Fine-Tuning",
    llm=ChatOpenAI(model="gpt-4o", timeout=25, stop=None),
    controller=controller)
```
Then we define an asynchronous function for the concurrent execution of tasks we set the max step of the agent limit to 20 but feel free to set any number you want At each step, the agent performs an action that Represents what the agent plans to do next and the result Contains the output of the step, including whether the task is complete and any data extracted. If the task is completed, the extracted content is saved to a file named `text.txt`, and the process terminates.


```python
async def main():
    max_steps = 20
    # Run the agent step by step
    for i in range(max_steps):
        print(f'\n📍 Step {i+1}')
        action, result = await agent1.step()

        print('Action:', action)
        print('Result:', result)

        if result.done:
            print('\n✅ Task completed successfully!')
            print('Extracted content:', result.extracted_content)
            
            # Save extracted content to a text file
            with open('text.txt', 'w') as file:
                file.write(result.extracted_content)
            print("Extracted content has been saved to text.txt")
            
            break

asyncio.run(main())
```
Now we define the working directory and check if a directory named `dickens` exists in the current working directory. If it doesn't, the program creates it. This ensures the directory is available for storing files or other resources.


```python
WORKING_DIR = "./dickens"
if not os.path.exists(WORKING_DIR):
    os.mkdir(WORKING_DIR)
```
The primary step is configuring the LightRAG instance with the necessary parameters. We initialized with a working directory (./dickens) and a lightweight GPT\-4o model (gpt\_4o\_mini\_complete) as the default language model. This setup is efficient for retrieval\-augmented tasks, with the flexibility to use a more robust model (gpt\_4o\_complete) if needed.


```python
rag = LightRAG(
    working_dir=WORKING_DIR,
    llm_model_func=gpt_4o_mini_complete  # Use gpt_4o_mini_complete LLM model
    # llm_model_func=gpt_4o_complete  # Optionally, use a stronger model
)
```
we read the contents `text.txt` from the specified path and insert it into the RAG system using the `rag.insert()`


```python
with open("C:/Users/mrtar/Desktop/lightrag/text.txt") as f:
    rag.insert(f.read())
```
We perform a **naive search** for the query “What is Supervised Fine\-Tuning” in the RAG system. In naive search mode, the system looks for documents or entries that directly contain the keywords in the query, without considering any relationships or context around those terms. It is useful for straightforward queries that don’t need complex reasoning. It will return the results based purely on keyword matching.


```python
## Perform naive search
print(rag.query("what is Supervised Fine-Tuning", param=QueryParam(mode="naive")))
```
Also, we performed a **local search** for the query “What is Supervised Fine\-Tuning?” In local search mode, the system retrieves information about the query and its immediate neighbours (directly related entities). It will provide additional context, focusing on close relationships directly related to “Supervised Fine\-Tuning.

Search is more detailed than naive and valuable when you need more context about direct connections or relationships.


```python
## Perform local search
print(rag.query("what is Supervised Fine-Tuning", param=QueryParam(mode="local")))
```
Now, we use a **global search** for the query “What is Supervised Fine\-Tuning.”The system considers the entire knowledge graph in global search mode, looking at direct and indirect relationships across a broader scope. It examines all possible connections related to “Supervised Fine\-Tuning,” not just the immediate ones. It provides a comprehensive overview and is ideal for queries needing a wide\-ranging context or a global relationship perspective.


```python
## Perform global search
print(rag.query("what is Supervised Fine-Tuning", param=QueryParam(mode="global")))
```
Finally, we perform a **hybrid search** for the query "What is Supervised Fine\-Tuning.” Hybrid search mode combines the benefits of both local and global searches. It retrieves information based on direct relationships (like local search) but also considers indirect or global relationships (like global search). It provides a balanced and thorough context, suitable for most scenarios, especially when it is essential to understand the overall and specific context.


```python
## Perform hybrid search
print(rag.query("what is Supervised Fine-Tuning", param=QueryParam(mode="hybrid")))\
```

## Conclusion :

More than just technological advancements, LightRAG and Browser\-Use can potentially fundamentally change how we interact with information. They offer more accurate and comprehensive search capabilities, precise answers to complex questions, and responses that always reflect the latest knowledge.

If these goals are realized, they could revolutionize fields such as education, research, and business. LightRAG and Browser\-Use represent groundbreaking technology that will open up the next generation of information search and generation. I’m really looking forward to seeing how it develops in the future!


> ***🧙‍♂️ I am an AI Generative expert! If you want to collaborate on a project, drop an [inquiry here](https://docs.google.com/forms/d/e/1FAIpQLSelxGSNOdTXULOG0HbhM21lIW_mTgq7NsDbUTbx4qw-xLEkMQ/viewform) or Book a [1\-on\-1 Consulting](https://calendly.com/gao-dalie/ai-consulting-call) Call With Me.***

*📚Feel free to check out my other articles:*


