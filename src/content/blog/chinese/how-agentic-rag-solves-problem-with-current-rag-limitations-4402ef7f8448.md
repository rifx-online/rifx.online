---
title: "Agentic RAG 如何解决当前 RAG 限制的问题"
meta_title: "Agentic RAG 如何解决当前 RAG 限制的问题"
description: "在《咖啡休息概念》第 4 卷中，我们将了解 AgenticRAG 如何帮助解决传统 RAG 的局限性。"
date: 2024-11-04T12:34:57Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*abCDtDjfKZDJzginIc1UPA.png"
categories: ["Generative AI", "Data Science", "Machine Learning"]
author: "Rifx.Online"
tags: ["Agentic", "RAG", "agents", "query", "routing"]
draft: False

---

在本卷咖啡休息概念的第 4 期中，我们将了解 AgenticRAG 如何帮助解决传统 RAG 的限制。

## RAG框架

RAG（检索增强生成）框架按特定顺序操作：

文档 \-\> 片段 \-\> 向量数据库 \-\> 片段检索（前K个） \-\> LLM

然而，这一顺序**在处理某些类型的查询时会遇到障碍。**



## 问题 1：摘要

考虑一个查询，比如“总结文档”。

* 传统的 RAG 方法检索前 K 个块并进行摘要。
* 但如果检索文档的所有块并进行总结，岂不是更全面吗？

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*gIb0RNALIItt4UmyVfPRZg.png)

## 问题 2：比较文档

* 在比较文档 A 和文档 B 时，**基本 RAG 检索随机片段并尝试比较这些前 K 个片段**。
* 这**并不能准确反映**文档的整体情况。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*pJuKlKx1unDAvKmmp_1Rlg.png)

## 问题 3：结构化数据分析

考虑一个问题：“**下一个休假是什么时候？**”。

* 第一步是从结构化表中检索员工所属的区域。
* 根据该区域，从休假政策文件中提取该区域的下一个休假。
* 在当前的 RAG 框架下，这个过程并不是那么简单。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*XZuMz9EXtb_m28l4Ox27lQ.png)

## 问题 4：多部分问题

考虑一个问题，例如“**识别所有地区的共同请假？**”。

* 想象一下，您有一份在 120 个国家运营的公司的请假政策文件。
* 由于您正在传递前 K 个上下文，**可以比较的最大地区数量限制为 K**，其中 K 是传递给 LLM 的块的数量。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*l0FY6rI_UK9k9TW-nEJO7w.png)

查看我们的 **AgenticRAG with LlamaIndex** 课程，包含 **5 个实时案例研究**。

课程链接：[https://www.masteringllm.com/course/agentic\-retrieval\-augmented\-generation\-agenticrag](https://www.masteringllm.com/course/agentic-retrieval-augmented-generation-agenticrag)

## Agentic RAG

Agentic RAG 可以通过自定义代理来解决这 4 个问题。

* 代理将与多个系统进行交互。
* RAG 现在是代理可以使用的系统的一部分。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Su8LiYNG4lv4jvuCQAhYdg.png)

* 代理使用 LLMs 来自动化推理和工具选择
* RAG 只是代理可能决定使用的另一个工具。

## 路由代理

* 路由代理是简单的代理，用于路由查询。
* 一个代理可以在一个或多个工具中路由查询。
* 请记住我们的问题“**总结文档**”或如果我们想结合“**总结 \+ 语义搜索**”的问题，可以使用以下示例路由来解决。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*43Y9jlYoXDb0BbUoYCcKrg.png)

## 查询规划代理

* 查询规划代理将查询分解为子查询。
* 每个子查询都可以在 RAG 管道上执行。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*32Ng2zpxNWXhQZ3CaLcFeA.png)

## 代理的工具

* LLMs 可以拥有多个工具，例如调用 API，推断 API 的参数。
* RAG 现在是 LLM 可能使用的一个工具。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Z1viCXkfah_5JJM2Ty6Kjw.png)

## 摘要

* RAG 在处理复杂问题时存在局限性。
* 一些用例，如总结、比较等，仅靠 RAG 无法解决。
* Agentic RAG 可以帮助克服 RAG 的局限性。
* Agentic RAG 将 RAG 视为可用于语义搜索的工具。
* 配备路由、查询规划和工具的代理能够超越传统的 RAG 应用。


