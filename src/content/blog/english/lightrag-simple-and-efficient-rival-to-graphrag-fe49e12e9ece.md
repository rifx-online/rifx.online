---
title: "LightRAG — Simple and efficient rival to GraphRAG?"
meta_title: "LightRAG — Simple and efficient rival to GraphRAG?"
description: "Traditional RAG systems work by indexing raw data. This data is simply chunked and stored in vector DBs. Whenever a query comes from the…"
date: 2024-11-13T01:22:29Z
image: "https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*7_2PyaNMVdYDWTCrb_cMCg.png"
categories: ["Generative AI", "Data Science", "Technology/Web"]
author: "Rifx.Online"
tags: ["LightRAG", "retrieval", "GraphRAG", "indexing", "dual-level"]
draft: False

---






Traditional RAG systems work by indexing raw data. This data is simply chunked and stored in vector DBs. Whenever a query comes from the user, it queries the stored chunks and *retrieves* relevant chunks. If you wish to learn the fundamentals of RAG I have written a comprehensive intro about it [here](https://proxy.rifx.online/https://readmedium.com/retrieval-augmented-generation-rag-a-quick-and-comprehensive-introduction-6cd5217a4ebb).

As the retrieval step happens for every single query from the user, it is the most crucial bottleneck to speed up naive RAG systems. Would it not be logical to make the retrieval process super efficient? This is the promise of **LightRAG**.


> **If you are a non\-member, you may read this for free [here](https://proxy.rifx.online/https://www.ai-bites.net/lightrag-simple-and-efficient-rival-to-graphrag/). Why not subscribe there and get these right to your inbox?**


## Why not GraphRAG

Before we look at them, you may ask, “Wait. Do we not have GraphRAG from Microsoft?”. Yes, but GraphRAG seems to have a couple of drawbacks.

* **Incremental knowledge update.** (sec 3\.1\) GraphRAG first creates a reference to entities and relationships in the entire private dataset. It then does bottom\-up clustering that organizes the data hierarchically into semantic clusters. An update to the dataset with new knowledge means that we have to go through the entire process of building the graph! LightRAG on the other hand addresses this by simply appending new knowledge to the existing one. More specifically, it combines new graph nodes and edges with existing ones through a simple union operation.
* **Computational intensity.** As seen from their study, LightRAG significantly reduces the cost of the retrieval phase. What takes 610,000 tokens for GraphRAG takes less than 100 tokens for LightRAG.

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*0TwUDr1BCNr_nSfTPwxenw.png)

So without further adieu, let's dive into LightRAG.


## LightRAG

The two main selling points of LightRAG are Graph\-based indexing and dual\-level retrieval framework. So let's look into each of them.


## Graph\-based Indexing

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*U7sYYNA9teKEVig1dzfi2g.png)

Below are the steps LightRAG follows to incorporate graph\-based indexing.

* **Entity and Relationship (ER) extraction.** ER extraction is shown by R(.) in the above figure. This step ensures that simple entities are first extracted from a given document. For example, in the above example, “bees” and “beekeeper” are two entities. And they are related by “observe” relation. As in, a beekeeper observes bees.
* **Key\-value (KV) pair generation using LLM.** KV pairs are then generated using a simple LLM. The LLM profiling step gives a small note or explanation of what the entity or relation is all about. For example, the LLM explains who a “beekeeper” is in our chosen example. This step is denoted by the P(.) in the above figure. Note that this LLM is different from the general\-purpose LLM used in the main RAG pipeline.
* **Deduplication.** Given that the documents have to do with bees, it is quite possible that the entity “beekeeper” could have been retrieved from several documents or chunks. So, we need a deduplication step that just keeps one and discards the rest with the same meaning. This is shown by the D(.) in the above figure.


## Dual\-level Retrieval

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*t9W1UBbjFa5cnAe-_tqz-Q.png)

A query to a RAG system can be one of two types — specific or abstract. In the same bee example, a specific query could be “How many queen bees can be there in the hive?”. An abstract query could be, “What are the implications of climate change on honey bees?” To address this diversity, LightRAG employs two retrieval types:

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*DuVxwxwl_2-gej_DwGzoeg.png)

* **Low\-level retrieval.** It simply extracts precise entities and their relationships like bees, observe, and beekeepers.
* **High\-level retrieval.** Employing an LLM, LightRAG aggregates information and summarizes multiple sources of information.


## Why bother doing all this?

Doing all this exercise and switching to LightRAG improves execution time indeed. During indexing, the LLM needs to be called just once per chunk to extract entities and their relationships.

Likewise, during user query, we only retrieve entities and relationships from chunks using the same LLM we used for indexing. This is a huge saving on the retrieval overhead and hence computation. So, we have a “light” RAG at last!

Integrating new knowledge into existing graphs seems to be a seamless exercise. Instead of re\-indexing the whole data whenever we have new information, we can simply append new knowledge to the existing graph.


## Evaluation

In their evaluations, they have compared against Naive RAG, RQ\-RAG, HyDE, and GraphRAG. To keep the comparison fair, they have used GPT\-4o\-mini as the LLM across the board with a fixed chunk size of 1200 for all datasets. The answers were evaluated for comprehensiveness, diversity, and effectiveness in answering the user(a.k.a. *empowerment* in the paper).

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*DNdNHW7NRcOXpvEWjT5BKQ.png)

As we can see from the underlined results, LightRAG beats all of the state\-of\-the\-art methods currently available.

In general, they draw the following conclusions:

* Using graph\-based methods (GraphRAG or LightRAG) improves significantly over the baseline Naive RAG
* LightRAG produces quite diverse answers powered by the dual\-level retrieval paradigm
* LightRAG can deal with complex queries better


## Conclusion

Though RAG is a fairly recent technique, we are seeing rapid progress in the area. Techniques like LightRAG which can take RAG pipelines to cheap commodity hardware are the most welcome. While the hardware landscape is ever\-growing, there is always an increasing need to run LLMs and RAG pipelines in compute\-constrained hardware in real time.

Would you like to see some hands\-on study of LightRAG? Please stay tuned…


## Shout Out

Hope that was useful.

**If you liked this article, why not follow me on [Twitter](https://proxy.rifx.online/https://twitter.com/ai_bites) where I share research updates from top AI labs every single day.**

**Also please subscribe to my [YouTube channel](https://proxy.rifx.online/https://www.youtube.com/c/aibites) where I explain AI concepts and papers visually.**

**Lastly, please clap, and let’s celebrate you reaching the end of this story.**


