---
title: "LongRAG: Giving AI a Bigger Net to Catch More Fish in the Sea of Information"
meta_title: "LongRAG: Giving AI a Bigger Net to Catch More Fish in the Sea of Information"
description: "In my previous article, I introduced whether RAG would become obsolete due to long-context LLMs. Today, let’s look at how to apply…"
date: 2024-11-08T00:17:39Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Nt5TRh0ooDkgmibMlA1Srg.png"
categories: ["Generative AI", "Natural Language Processing", "Data Science"]
author: "Rifx.Online"
tags: ["long-context", "LLMs", "RAG", "retrieval", "generation"]
draft: False

---

In [my previous article](https://readmedium.com/will-long-context-llms-cause-the-extinction-of-rag-de41ca5ddfc6), I introduced whether RAG would become obsolete due to long\-context LLMs. Today, let’s look at how to apply long\-context LLMs to RAG scenarios.

In the realm of Retrieval\-Augmented Generation (RAG), the traditional approach has always relied on short retrieval units, typically around 100 words, which forces retrievers to sift through vast corpora to extract the necessary information. This design, while functional, places an imbalanced load on the retriever, often leading to suboptimal performance due to the overwhelming volume of units it must process.

The article introduces a new study titled “[LongRAG: Enhancing Retrieval\-Augmented Generation with Long\-context LLMs](https://arxiv.org/pdf/2406.15319v3)”. It seeks to address this imbalance by proposing a novel framework that significantly improves the efficiency of the retriever and the performance of the reader by extending the length of retrieval units to 4,000 tokens.

## Traditional RAG vs. LongRAG



As shown in Figure 1, the core innovation of LongRAG lies in its restructuring of the traditional RAG framework. By extending the retrieval unit size to 4K tokens — 30 times longer than the typical unit — LongRAG drastically reduces the number of units from millions to a manageable few hundred thousand.

This approach not only eases the burden on the retriever but also enhances the semantic completeness of the retrieved information, leading to superior downstream performance.

## LongRAG

The LongRAG framework is composed of two main components: the **Long Retriever** and the **Long Reader**. An illustrative example of these two components are depicted in Figure 2\.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*fs37A8QUj-y2rW9_iAqS3Q.png)

The Long Retriever organizes the retrieval process by grouping related documents into cohesive units that retain semantic integrity. Once the relevant long retrieval units are identified, they are passed on to the Long Reader, which is equipped to handle extensive contexts (around 30K tokens).

Here’s a step\-by\-step breakdown of the workflow:

### 1\. Formulating Long Retrieval Units

The first step in LongRAG is the creation of long retrieval units.

**In traditional RAG** frameworks, the retrieval units are short, often just a few hundred tokens, which can lead to fragmented information and a heavy burden on the retriever to piece together the relevant context.

**LongRAG addresses this** by grouping related documents into cohesive long retrieval units that are significantly larger — up to 4,000 tokens per unit.

To form these long units, LongRAG employs a grouping algorithm that organizes documents based on their relationships, such as hyperlinks embedded within Wikipedia articles.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*zPEDmLo7rcdCQ06e.png)

For instance, documents about a particular topic or entity are grouped together to create a comprehensive retrieval unit (Figure 2\). This ensures that each unit maintains semantic integrity and provides a richer context for the reader to extract the answer from.

### 2\. Similarity Search and Ranking

Once the long retrieval units are formed, the next step is to perform a similarity search to identify which units are most relevant to the query.

The query is encoded into a vector using an encoder function, E\_Q, and each retrieval unit is similarly encoded using another encoder function, E\_C. The similarity between the query `q` and each retrieval unit `g` is calculated using the dot product of their respective vectors.

However, given the length of the retrieval units, **directly encoding the entire unit can be computationally expensive and less effective**. **To mitigate this, LongRAG approximates the similarity by breaking down the long unit into smaller chunks** and calculating the maximum similarity score across these chunks.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*U1BsMZuyXqO1oqsl.png)

This method, akin to [the MaxP design from prior works](https://arxiv.org/pdf/1905.09217), allows LongRAG to efficiently identify the most relevant sections within each long retrieval unit without sacrificing performance.

### 3\. Aggregating Retrieval Results

After the similarity scores are calculated, the top k retrieval units are selected based on their relevance to the query. **These selected units are then concatenated to form a single long context, which typically consists of around 30,000 tokens.** This aggregated context is what will be passed on to the Long Reader.

The size of k, or the number of retrieval units, is crucial for balancing the workload. If the retrieval units are too short, more units are needed, which can overwhelm the reader. Conversely, if the units are too long, fewer are needed, but they must be highly relevant to avoid including extraneous information.

LongRAG optimizes this balance by using a moderate number of well\-formed long retrieval units, usually between 4 and 8, depending on the task.

### 4\. Processing by the Long Reader

The Long Reader is the component responsible for extracting the final answer from the long context. This step leverages advanced long\-context language models like GPT\-4o or Gemini\-1\.5\-Pro, which are capable of handling extensive sequences of text without losing track of the critical information.

For shorter contexts (less than 1,000 tokens), the Long Reader directly extracts the answer. However, for the longer contexts typical of LongRAG, the process is more nuanced. Initially, the model generates a detailed response that spans a few sentences, ensuring that it captures all relevant information. This initial output is then refined through a second round of processing, where the Long Reader condenses the response into a precise, concise answer.

This two\-step approach ensures that the Long Reader can effectively handle the large amount of information provided by the long retrieval units while still delivering accurate and focused answers.

## Evaluation

The paper presents a thorough evaluation of LongRAG on well\-known datasets like Natural Questions (NQ) and HotpotQA. The results are compelling, showing an improvement in retrieval performance, with answer recall rates jumping from 52% to 71% on NQ (Figure 4\), and from 47% to 72% on HotpotQA (Figure 5\).

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*wLUdp-4OihjAz8Fu.png)

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*vmTsnuIsV6LxJFtj.png)

## Conclusion

This article explored the innovative LongRAG framework, which is an innovative approach by extending the RAG framework to handle long documents, enabling the model to process and generate answers from extended contexts effectively. It incorporates a multi\-step retrieval process that dynamically retrieves relevant sections of long texts, ensuring that the most pertinent information is used in the generation phase. This allows LongRAG to excel in tasks that require understanding and synthesizing information from lengthy and complex documents, outperforming traditional RAG models in such scenarios.

However, this approach is not without its challenges. The dependency on powerful long\-context models means that the framework’s performance is tightly coupled with the capabilities of these models. Additionally, the grouping algorithm used for creating long retrieval units may require further refinement to generalize beyond Wikipedia\-based corpora.


