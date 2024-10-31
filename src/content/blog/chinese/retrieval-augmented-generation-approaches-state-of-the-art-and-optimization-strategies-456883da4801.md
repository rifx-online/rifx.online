---
title: "检索增强生成：方法、最新进展和优化策略"
meta_title: "检索增强生成：方法、最新进展和优化策略"
description: "⭐ RAG 在知识密集型场景或需要持续知识的特定领域应用中特别有用……"
date: 2024-10-31T08:17:32Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*_vE7WktGmyQ5xg_t5cpFVg.jpeg"
categories: ["Generative AI", "Natural Language Processing", "Machine Learning"]
author: "Rifx.Online"
tags: ["RAG", "retrieval", "generation", "optimization", "embeddings"]
draft: False

---





⭐ RAG 在知识密集型场景或需要持续更新知识的特定领域应用中尤其有用。最近，RAG 因其在对话代理中的应用而受到广泛关注。

📌 参考研究主要集中在当前的 RAG 方法及其不同组件、最新进展（SOTA）、应用、检索、生成、增强技术的评估上。

随着 RAG 系统从简单到高级再到模块化的演变，每个阶段都是为了应对特定用例的增强而出现的。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*P2ByKtayhF4XgAVxRI1urQ.jpeg)

✏ *简单型*：用户输入用于文档查询，附加/组合到提示中，用于模型最终响应生成。通过多轮对话交互，可以将上下文/对话历史添加/组合到提示中。缺点：低精度/低召回率，冗余，重复。

✏ *高级型*：通过优化预检索、检索和后检索方法来提高检索质量。预检索中，通过增强数据粒度、索引结构改进、元数据、对齐和混合检索来提升质量。在检索中，优化嵌入模型，从而优化上下文。在后检索中，优化上下文窗口和噪声/干扰数据的拒绝。

✏ *模块化*：引入搜索模块进行相似性检索和检索的微调。新模块包括搜索、记忆、融合、路由、预测、任务适配器。

🥉 优化 RAG 流水线：

📜 *混合搜索探索*：通过智能利用关键字搜索、语义搜索和向量搜索等技术，平衡性能优化。

📜 *递归检索和查询引擎*：初始阶段可能通过获取较小的块开始检索，随后以更好且更具上下文的信息获取较大的块，以平衡上下文丰富的响应与效率。

📜 *回退提示*：这鼓励 LLM 脱离特定实例，围绕更广泛的概念和原则进行推理（arXiv:2310\.13243）。在各种具有挑战性的基于推理的任务中，使用回退提示时观察到显著的性能提升，突显了它们对 RAG 过程的自然适应性。

📜 *子查询*：根据场景应用的查询策略可以使用，例如利用 LlamaIndex 提供的查询引擎，利用树查询，使用向量查询，或执行简单的块顺序查询。

📜 *假设文档嵌入*：使用 LLM，HyDE 通过创建假设答案来响应查询，嵌入答案，并使用相同的答案来检索真实文档。该方法关注的是从一个答案到另一个答案的嵌入相似性，而不是基于查询寻找嵌入相似性\[arXiv:2212\.10496]。缺点：不一致的答案未能产生理想结果，LLM 未见主题的错误，导致错误。

让我在这里结束。我会在后续中发布新文章。

[\#genai](https://www.linkedin.com/feed/hashtag/?keywords=genai&highlightedUpdateUrns=urn%3Ali%3Aactivity%3A7170160104984571905) [\#rag](https://www.linkedin.com/feed/hashtag/?keywords=rag&highlightedUpdateUrns=urn%3Ali%3Aactivity%3A7170160104984571905) \#ai \#llm

参考：[arxiv:2312\.10997](https://arxiv.org/pdf/2312.10997)，RAG 调查，Huggingfaceblogs

