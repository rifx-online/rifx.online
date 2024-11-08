---
title: "LongRAG：让人工智能在信息海洋中捕捞更多鱼"
meta_title: "LongRAG：让人工智能在信息海洋中捕捞更多鱼"
description: "在我之前的文章中，我介绍了 RAG 是否会因长语境 LLM 而过时。今天，我们来看看如何申请……"
date: 2024-11-08T00:17:39Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Nt5TRh0ooDkgmibMlA1Srg.png"
categories: ["Generative AI", "Natural Language Processing", "Data Science"]
author: "Rifx.Online"
tags: ["long-context", "LLMs", "RAG", "retrieval", "generation"]
draft: False

---

在 [我之前的文章](https://readmedium.com/will-long-context-llms-cause-the-extinction-of-rag-de41ca5ddfc6) 中，我介绍了RAG是否会因长上下文LLMs而变得过时。今天，让我们看看如何将长上下文LLMs应用于RAG场景。

在检索增强生成（RAG）领域，传统方法一直依赖于短检索单元，通常约为100个单词，这迫使检索器在庞大的语料库中筛选以提取必要信息。这种设计虽然可行，但对检索器施加了不平衡的负担，往往因其必须处理的单元数量庞大而导致表现不佳。

本文介绍了一项新研究，标题为“[LongRAG: 使用长上下文LLMs增强检索增强生成](https://arxiv.org/pdf/2406.15319v3)”。它旨在通过提出一种新颖的框架来解决这种不平衡，从而将检索单元的长度扩展到4,000个标记，显著提高检索器的效率和读者的表现。

## 传统 RAG 与 LongRAG



如图 1 所示，LongRAG 的核心创新在于其对传统 RAG 框架的重构。通过将检索单元的大小扩展到 4K tokens——是典型单元的 30 倍——LongRAG 将单元数量从数百万减少到可管理的几十万个。

这种方法不仅减轻了检索器的负担，还增强了所检索信息的语义完整性，从而提高了下游性能。

## LongRAG

LongRAG框架由两个主要组件组成：**Long Retriever**和**Long Reader**。这两个组件的示例如图2所示。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*fs37A8QUj-y2rW9_iAqS3Q.png)

Long Retriever通过将相关文档分组为保持语义完整性的统一体来组织检索过程。一旦识别出相关的长检索单元，它们将被传递给Long Reader，该组件能够处理广泛的上下文（大约30K个标记）。

以下是工作流程的逐步分解：

### 1\. 制定长检索单元

LongRAG的第一步是创建长检索单元。

**在传统的RAG**框架中，检索单元较短，通常只有几百个标记，这可能导致信息碎片化，并且给检索器带来重大的负担，需要将相关上下文拼凑在一起。

**LongRAG解决了这个问题**，通过将相关文档分组为连贯的长检索单元，这些单元显著更大 — 每个单元可达4,000个标记。

为了形成这些长单元，LongRAG采用了一种分组算法，根据文档之间的关系组织文档，例如维基百科文章中嵌入的超链接。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*zPEDmLo7rcdCQ06e.png)

例如，关于特定主题或实体的文档被分组在一起，以创建一个综合的检索单元（图2）。这确保了每个单元保持语义完整性，并为读者提供了更丰富的上下文，以便从中提取答案。

### 2\. 相似性搜索与排名

一旦形成了长检索单元，下一步就是执行相似性搜索，以识别哪些单元与查询最相关。

查询通过编码器函数 E\_Q 编码为一个向量，每个检索单元也通过另一个编码器函数 E\_C 进行类似的编码。查询 `q` 与每个检索单元 `g` 之间的相似性通过它们各自向量的点积来计算。

然而，考虑到检索单元的长度，**直接编码整个单元可能计算开销大且效果较差**。**为了解决这个问题，LongRAG 通过将长单元分解为更小的块来近似相似性**，并计算这些块之间的最大相似性得分。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*U1BsMZuyXqO1oqsl.png)

这种方法类似于[以往工作的 MaxP 设计](https://arxiv.org/pdf/1905.09217)，使 LongRAG 能够高效地识别每个长检索单元中最相关的部分，而不会牺牲性能。

### 3\. 聚合检索结果

在计算相似度分数后，基于与查询的相关性选择前 k 个检索单元。**这些选定的单元随后被连接起来形成一个单一的长上下文，通常包含约 30,000 个标记。** 这个聚合的上下文将被传递给 Long Reader。

k 的大小或检索单元的数量对于平衡工作负载至关重要。如果检索单元太短，则需要更多单元，这可能会使阅读器不堪重负。相反，如果单元太长，则需要的数量较少，但必须高度相关，以避免包含多余的信息。

LongRAG 通过使用适量的结构良好的长检索单元来优化这种平衡，通常在 4 到 8 之间，具体取决于任务。

### 4\. 通过长阅读器处理

长阅读器是负责从长上下文中提取最终答案的组件。此步骤利用先进的长上下文语言模型，如GPT-4o或Gemini-1.5-Pro，能够处理大量文本序列而不丢失关键信息。

对于较短的上下文（少于1,000个tokens），长阅读器直接提取答案。然而，对于典型的长RAG的较长上下文，该过程更加细致。最初，模型生成一个涵盖几句话的详细响应，确保捕捉到所有相关信息。然后，通过第二轮处理，长阅读器对初始输出进行精炼，将响应浓缩为一个精确、简洁的答案。

这种两步法确保长阅读器能够有效处理长检索单元提供的大量信息，同时仍然提供准确且集中的答案。

## 评估

本文对 LongRAG 在知名数据集上的表现进行了全面评估，如 Natural Questions (NQ) 和 HotpotQA。结果令人信服，检索性能有所提升，NQ 的答案召回率从 52% 提升至 71%（图 4），HotpotQA 的答案召回率从 47% 提升至 72%（图 5）。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*wLUdp-4OihjAz8Fu.png)

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*vmTsnuIsV6LxJFtj.png)

## 结论

本文探讨了创新的 LongRAG 框架，这是一种通过扩展 RAG 框架以处理长文档的创新方法，使模型能够有效地处理和生成来自扩展上下文的答案。它结合了一个多步骤检索过程，动态检索长文本的相关部分，确保在生成阶段使用最相关的信息。这使得 LongRAG 在需要理解和综合来自冗长复杂文档的信息的任务中表现出色，在这种情况下优于传统的 RAG 模型。

然而，这种方法并非没有挑战。对强大的长上下文模型的依赖意味着该框架的性能与这些模型的能力紧密相关。此外，用于创建长检索单元的分组算法可能需要进一步改进，以便在超越基于维基百科的语料库时进行泛化。


