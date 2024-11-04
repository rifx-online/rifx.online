---
title: "How Agentic RAG solves problem with current RAG limitations"
meta_title: "How Agentic RAG solves problem with current RAG limitations"
description: "In this volume 4 of coffee break concept, we will understand how AgenticRAG helps solve limitations of traditional RAG."
date: 2024-11-04T12:34:57Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*abCDtDjfKZDJzginIc1UPA.png"
categories: ["Generative AI", "Data Science", "Machine Learning"]
author: "Rifx.Online"
tags: ["Agentic", "RAG", "agents", "query", "routing"]
draft: False

---

In this volume 4 of coffee break concept, we will understand how AgenticRAG helps solve limitations of traditional RAG.

## RAG Framework

The RAG (Retrieval Augmented Generation) framework operates in a specific sequence:

Document \-\> Chunks\-\> Vector DB \-\> Chunk Retrieval (Top K) \-\> LLM

However, this sequence **encounters obstacles when dealing with certain types of queries.**



## Problem 1: Summarization

Consider a query like “Summarize the document”.

* The conventional RAG approach retrieves the top K chunks and summarizes them.
* But wouldn’t it be more comprehensive if it retrieved all chunks of the document and summarized them?

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*gIb0RNALIItt4UmyVfPRZg.png)

## Problem 2: Comparing Documents

* When tasked with comparing Document A and Document B, the **basic RAG retrieves random chunks and attempts to compare these top K chunks**.
* This **doesn’t paint an accurate picture** as it doesn’t represent the full scope of the documents.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*pJuKlKx1unDAvKmmp_1Rlg.png)

## Problem 3: Structured Data Analysis

Consider a question like “**When is the next leave?**”.

* The first step is to retrieve the region to which the employee belongs from a structured table.
* Based on the region, the next leave for that region is extracted from the leave policy document.
* This process isn’t as straight forward with the current RAG framework.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*XZuMz9EXtb_m28l4Ox27lQ.png)

## Problem 4: The Multi\-part Question

Consider a question like “**Identify common leave across all regions?**”.

* Imagine you have a leave policy document of a company present in 120 countries.
* Since you are passing the top K contexts, the **maximum number of regions that can be compared is limited to K**, where K is the number of chunks passed to LLM.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*l0FY6rI_UK9k9TW-nEJO7w.png)

Look into our **AgenticRAG with LlamaIndex** Course with **5 real\-time case studies**.

Course link: [https://www.masteringllm.com/course/agentic\-retrieval\-augmented\-generation\-agenticrag](https://www.masteringllm.com/course/agentic-retrieval-augmented-generation-agenticrag)

## Agentic RAG

Agentic RAG can solve this 4 problems by replacing via custom agents.

* Agents will interact with multiple systems.
* RAG is now one part of this system which agents can use.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Su8LiYNG4lv4jvuCQAhYdg.png)

* Agents uses LLMs to automate the reasoning and tool selection
* RAG is just another tool which Agent may decides to use.

## Routing Agent

* Routing agents are simple agents which routes the queries.
* An agent can route query in one or multiple tools.
* Remember our question “**Summarize the document**” or a question if we want to combine “**Summarization \+ Sematic search**” can be solved using below example routing

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*43Y9jlYoXDb0BbUoYCcKrg.png)

## Query Planning Agent

* Query planning agent breaks down the queries into sub\-queries.
* Each of the sub\-queries can be executed against RAG pipeline.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*32Ng2zpxNWXhQZ3CaLcFeA.png)

## Tools For Agents

* LLMs can have multiple tools like calling an API, infer parameters for API.
* RAG is now a tool which LLM might use.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Z1viCXkfah_5JJM2Ty6Kjw.png)

## Summary

* RAG has limitations when represented with complex questions.
* Few of the use cases like summarization, comparison etc. can’t be solve with just RAG.
* Agentic RAG can help overcome limitation of RAG.
* Agentic RAG treats RAG as a tool which it can use for semantic search.
* Agents equipped with routing, query planning and tools can out perform traditional RAG applications.


