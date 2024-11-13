---
title: "LightRAG - GraphRAG 简单高效的竞争对手？"
meta_title: "LightRAG - GraphRAG 简单高效的竞争对手？"
description: "传统的 RAG 系统通过索引原始数据来工作。这些数据被简单地分块并存储在向量数据库中。每当有查询从..."
date: 2024-11-13T01:22:29Z
image: "https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*7_2PyaNMVdYDWTCrb_cMCg.png"
categories: ["Generative AI", "Data Science", "Technology/Web"]
author: "Rifx.Online"
tags: ["LightRAG", "retrieval", "GraphRAG", "indexing", "dual-level"]
draft: False

---





传统的 RAG 系统通过索引原始数据来工作。这些数据被简单地切分并存储在向量数据库中。每当用户发出查询时，它会查询存储的片段并 *检索* 相关片段。如果您希望了解 RAG 的基本原理，我已经在 [这里](https://proxy.rifx.online/https://readmedium.com/retrieval-augmented-generation-rag-a-quick-and-comprehensive-introduction-6cd5217a4ebb) 写了一篇全面的介绍。

由于检索步骤针对用户的每一个查询都会发生，因此这是加速简单 RAG 系统的最关键瓶颈。让检索过程变得超级高效难道不是合乎逻辑的吗？这就是 **LightRAG** 的承诺。


> **如果您不是会员，您可以在 [这里](https://proxy.rifx.online/https://www.ai-bites.net/lightrag-simple-and-efficient-rival-to-graphrag/) 免费阅读此内容。为什么不在那里订阅并将这些内容直接发送到您的收件箱呢？**

## 为什么不使用 GraphRAG

在我们查看它们之前，你可能会问：“等一下。我们不是有微软的 GraphRAG 吗？”是的，但 GraphRAG 似乎有几个缺点。

* **增量知识更新。** (sec 3\.1\) GraphRAG 首先在整个私有数据集中创建对实体和关系的引用。然后，它通过自下而上的聚类将数据层次化组织成语义集群。对数据集进行新知识的更新意味着我们必须重新经历构建图的整个过程！而 LightRAG 则通过简单地将新知识附加到现有知识上来解决这个问题。更具体地说，它通过简单的并集操作将新的图节点和边与现有的结合在一起。
* **计算强度。** 从他们的研究中可以看出，LightRAG 显著降低了检索阶段的成本。GraphRAG 需要 610,000 个标记，而 LightRAG 则少于 100 个标记。

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*0TwUDr1BCNr_nSfTPwxenw.png)

所以不再赘述，让我们深入了解 LightRAG。

## LightRAG

LightRAG的两个主要卖点是基于图的索引和双层检索框架。让我们逐一了解它们。

## 基于图的索引

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*U7sYYNA9teKEVig1dzfi2g.png)

以下是LightRAG遵循的步骤，以实现基于图的索引。

* **实体和关系（ER）提取。** ER提取在上图中用R(.)表示。此步骤确保首先从给定文档中提取简单实体。例如，在上述示例中，“蜜蜂”和“养蜂人”是两个实体。它们通过“观察”关系相关联。即，养蜂人观察蜜蜂。
* **使用LLM生成键值（KV）对。** 然后使用简单的LLM生成KV对。LLM分析步骤提供了关于实体或关系的简要说明或解释。例如，LLM解释了在我们选择的示例中“养蜂人”是谁。此步骤在上图中用P(.)表示。请注意，这个LLM与主RAG管道中使用的通用LLM不同。
* **去重。** 鉴于这些文档与蜜蜂有关，实体“养蜂人”可能是从多个文档或片段中检索到的。因此，我们需要一个去重步骤，仅保留一个并丢弃其余具有相同含义的内容。这在上图中用D(.)表示。

## 双层检索

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*t9W1UBbjFa5cnAe-_tqz-Q.png)

对RAG系统的查询可以分为两种类型——具体查询或抽象查询。在同一个蜜蜂的例子中，具体查询可以是“蜂巢中可以有多少只蜂后？”抽象查询可以是“气候变化对蜜蜂的影响是什么？”为了应对这种多样性，LightRAG采用了两种检索类型：

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*DuVxwxwl_2-gej_DwGzoeg.png)

* **低层检索。** 它简单地提取精确的实体及其关系，如蜜蜂、观察和养蜂人。
* **高层检索。** 通过使用LLM，LightRAG汇总信息并总结多个信息来源。

## 为什么要做这些？

进行所有这些练习并切换到 LightRAG 确实提高了执行时间。在索引过程中，LLM 每个块只需调用一次以提取实体及其关系。

同样，在用户查询期间，我们只需使用用于索引的相同 LLM 从块中检索实体和关系。这在检索开销和计算上节省了大量成本。因此，我们终于有了一个“轻量级”的 RAG！

将新知识整合到现有图中似乎是一个无缝的过程。每当我们有新信息时，不必重新索引整个数据，我们可以简单地将新知识附加到现有图中。

## 评估

在他们的评估中，他们与 Naive RAG、RQ\-RAG、HyDE 和 GraphRAG 进行了比较。为了保持比较的公平性，他们在所有数据集上使用了固定的 1200 的块大小并且使用了 GPT\-4o\-mini 作为 LLM。答案的评估标准包括全面性、多样性和在回答用户问题（即论文中的 *赋能*）方面的有效性。

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*DNdNHW7NRcOXpvEWjT5BKQ.png)

从下划线的结果中可以看出，LightRAG 超越了当前所有的最先进方法。

总体而言，他们得出了以下结论：

* 使用基于图的方法（GraphRAG 或 LightRAG）显著改善了基线 Naive RAG
* LightRAG 通过双层检索范式产生了相当多样的答案
* LightRAG 能更好地处理复杂查询

## 结论

尽管 RAG 是一种相对较新的技术，但我们在这一领域看到了快速进展。像 LightRAG 这样的技术能够将 RAG 流水线运行在廉价的商品硬件上，受到了广泛欢迎。随着硬件环境的不断发展，实时在计算受限的硬件上运行 LLM 和 RAG 流水线的需求也在不断增加。

您想看看关于 LightRAG 的一些实践研究吗？请继续关注……

## 向大家致敬

希望这对你有帮助。

**如果你喜欢这篇文章，为什么不在 [Twitter](https://proxy.rifx.online/https://twitter.com/ai_bites) 上关注我呢？我每天都会分享顶级AI实验室的研究更新。**

**同时，请订阅我的 [YouTube 频道](https://proxy.rifx.online/https://www.youtube.com/c/aibites)，我会以视觉方式解释AI概念和论文。**

**最后，请给我点赞，让我们一起庆祝你阅读完这个故事。**

