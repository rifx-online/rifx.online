---
title: "使用 Llama 3.2 构建强大的本地人工智能网络搜索助手："
meta_title: "使用 Llama 3.2 构建强大的本地人工智能网络搜索助手："
description: "Web-LLM Assistant 是一个将大型语言模型（如 Llama 3.2）与实时网络搜索相结合的智能系统，旨在提供最新和上下文相关的答案。它通过隐私友好的 DuckDuckGo 搜索引擎获取信息，并使用自我优化的搜索策略，确保用户能够快速得到准确的回答。该助手支持本地执行，减少对外部 API 的依赖，适合多种应用场景，如研究助手和客户支持。设置过程包括克隆代码库、安装依赖、配置模型及运行助手。"
date: 2024-11-30T13:44:12Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*p5Z1OfVTyxFpcw16U87j0A.jpeg"
categories: ["Programming", "Natural Language Processing", "Technology/Web"]
author: "Rifx.Online"
tags: ["Web-LLM", "Llama", "DuckDuckGo", "web-scraping", "real-time"]
draft: False

---



### 将大型语言模型与实时网络搜索相结合，以获取最新答案和上下文相关见解

👨🏾‍💻 [GitHub](https://github.com/mdmonsurali) ⭐️ \| 👔 [LinkedIn](https://www.linkedin.com/in/mdmonsurali/) \| 📝 [Medium](https://medium.com/@monsuralirana) \| ☕️ [Ko\-fi](https://ko-fi.com/monsurali)



## 介绍

大型语言模型（LLMs）彻底改变了我们与技术的互动方式。从总结大量文本到生成创意内容，它们的能力令人印象深刻。但当我们需要关于时事或超出其训练数据的信息的答案时，会发生什么呢？这就是 **Web\-LLM Assistant** 的用武之地。通过将 LLM 的强大功能与实时网络搜索相结合，这个项目将助手的实用性提升到了前所未有的水平。

在这篇博客中，我将探讨 Web\-LLM Assistant 的工作原理、其突出的特点，以及如何使用 **Llama 3\.2** 进行设置——一个强大且多功能的 LLM。

## Web\-LLM助手是什么？

Web\-LLM助手是一个智能系统，它将大型语言模型的计算能力与网络搜索功能相结合。这种混合方法使助手能够提供准确、最新的回答，即使对于其训练数据中未涵盖的主题。它通过利用网络抓取和自我优化的搜索策略来实现这一点。

例如，如果你问：“波音星际航天器还卡在国际空间站吗？”，助手将会：

1. 解析你的查询。
2. 使用以隐私为中心的DuckDuckGo进行网络搜索。
3. 抓取并分析最相关的结果。
4. 将LLM的预训练知识与检索到的信息结合起来，生成详细的答案。

## Web-LLM助手的关键特性

### 1\. 本地 LLM 集成

该助手通过 **Llama.cpp** 或 **Ollama** 支持模型的本地执行，确保数据隐私并减少对外部 API 的依赖。

### 2\. 实时网络搜索

它使用 DuckDuckGo 进行网络搜索，优先考虑用户隐私。这使它能够获取关于最新事件或冷门主题的最新信息。

### 3\. 网络爬虫

通过抓取最相关的结果，助手获取丰富的上下文数据，从而能够提供更全面的答案。

### 4\. 自我改进搜索

如果初始搜索没有产生足够的信息，助手会优化其查询词和时间范围，进行最多五次搜索迭代以获得最佳结果。

### 5\. 提升用户体验

通过丰富多彩、动态的控制台输出，与助手的互动变得生动有趣且直观。

### 6\. 灵活的模型配置

助手支持多种指令模型，让用户可以尝试不同的配置，以满足他们的需求和硬件。

## 为什么选择 Llama 3\.2？

Llama 3\.2 作为一个高性能的指令模型脱颖而出。它专为对话任务设计，是 Web\-LLM Assistant 的理想选择。它较小的内存占用确保了与本地机器的兼容性，即使是资源有限的机器也能使用。

## 实操教程：使用 Llama 3.2 设置 Web-LLM 助手

本分步指南将帮助您使用 **Llama 3.2** 设置 Web-LLM 助手，并探索其强大功能。您还将学习它如何处理实时搜索查询，综合生成全面的响应。

## 步骤 1：克隆仓库并安装依赖

首先，克隆 Web-LLM Assistant 仓库并安装其依赖：


```python
git clone https://github.com/TheBlewish/Web-LLM-Assistant-Llamacpp-Ollama
cd Web-LLM-Assistant-Llamacpp-Ollama
pip install -r requirements.txt
```

## 第2步：设置Ollama并下载所需模型

1. **安装Ollama**  
按照[Ollama安装指南](https://ollama.com)在本地机器上设置Ollama服务器。  
2. **下载Llama 3\.2和Nomic嵌入模型**  
启动Ollama服务器：  

```python
ollama serve
```  
拉取所需模型：  

```python
ollama pull llama3.2
ollama pull nomic-embed-text
```

## 第3步：更新配置

修改 `llm_config.py` 文件以使用 Llama 3.2 模型与 Ollama。查找以下部分：

```python
## LLM setting for Ollama
LLM_CONFIG_OLLAMA = {
    "model_name": "ollama model name",  # Change this to "llama3.2"
    ...
}
```
将 `"ollama model name"` 更新为 `"llama3.2"`。

## 第4步：运行Web-LLM助手

通过运行脚本启动助手：

```python
python3 WEB-LLM.py
```

## 第5步：与助手互动

您现在可以开始与Web-LLM助手互动。要提出基于网络的查询，请在您的消息前加上斜杠（`/`）。

例如：

```python
/Md Monsur Ali LLM Medium blogger
```

## 助手的工作原理

* 助手根据您的查询进行网络搜索。
* 它获取前10个结果，选择最相关的内容，并提取其内容。
* 最后，它结合网络搜索数据和Llama 3.2的预训练知识综合出一个答案。

## 示例交互

### 查询：


```python
/Md Monsur Ali LLM Medium blogger
```
搜索尝试输出：


```python
-=- 搜索尝试：1 -=-

@ 正在搜索...
原始查询：Md Monsur Ali LLM Medium blogger
构建的查询：Md Monsur Ali LLM Medium Blogger
时间范围：无
发送到DuckDuckGo的搜索查询：Md Monsur Ali LLM Medium Blogger
发送到DuckDuckGo的时间范围：无
结果数量：10

搜索结果：
结果 1：
标题：关于我 — Md Monsur Ali
网址：https://medium.com/about-me-stories/about-me-md-monsur-ali-6606e94f4695

结果 2：
标题：数据科学家的旅程：我的故事与未来
网址：https://medium.com/@monsuralirana/the-journey-of-a-data-scientist-my-story-and-beyond-faa7b693f36d
...

从以下网址抓取内容：
网址：https://medium.com/about-me-stories/about-me-md-monsur-ali-6606e94f4695
内容：
嗨，我是Md Monsur Ali，我很高兴欢迎你进入我的好奇、探索和创造力的世界！

我是一名数据科学家，目前居住在德国，尽管我的旅程始于孟加拉国。在德国攻读硕士学位后，我顺利完成了学业，并在这里开始了我的职业生涯，最终将德国作为我的永久家园。我的工作专注于人工智能、数据科学和技术，多年来，我有幸应对复杂的挑战，这让我对创新技术的潜力充满了兴趣。写作我的经历已经成为我的一种热情，因为这让我能够分享知识和见解，同时与其他有着相同好奇心的人建立联系。
```

> **更多细节：**


> **留下你的反馈、评论，并为这个故事👏 👏 鼓掌！！👏👏**


> **如果你喜欢这篇文章并想支持我的工作，可以在这里请我喝咖啡：[Ko\-fi](https://ko-fi.com/monsurali)☕**

## 实际应用

1. **研究助手**  
快速检索和综合任何主题的信息，包括最新进展。
2. **个性化学习**  
利用它探索复杂的主题，提供互动的实时帮助。
3. **客户支持**  
将其集成到客户支持工作流程中，以便提供实时的、知情的响应。

## 摘要

**Web-LLM Assistant** 无缝结合了大型语言模型（LLMs）如 **Llama 3.2** 的强大功能与实时网页搜索和抓取能力。这个创新工具解决了 LLMs 的一个关键限制——无法访问最新或小众信息——通过检索和分析最新的网页内容。使用以隐私为中心的 DuckDuckGo，它迭代地优化搜索过程，抓取相关页面，并综合出有见地的答案。

开始的关键步骤包括克隆代码库，设置 **Ollama**，拉取必要的模型（Llama 3.2 和 `nomic-embed-text`），以及配置 `llm_config.py` 文件。设置完成后，用户可以轻松提出查询，助手将智能地将 LLM 知识与实时网页数据结合，以提供准确的回答。

## 结论

**Web-LLM Assistant** 代表了 AI 辅助研究和互动的重大进展。通过将 LLM 能力与实时数据检索相结合，它克服了预训练模型的静态特性，使其在研究、教育和实时问答系统等应用中高度灵活。

无论您是探索 AI 边界的开发者，寻找精确和最新答案的研究人员，还是仅仅是一个爱好者，这个工具都提供了一个卓越的创新平台。它能够与 **Llama.cpp** 或 **Ollama** 本地运行，确保数据隐私，同时提供强大的性能。

## 参考文献

\[1] TheBlewish, “Web\-LLM\-Assistant\-Llamacpp\-Ollama: GitHub 代码库,” 2024\. 可用链接: [https://github.com/TheBlewish/Web\-LLM\-Assistant\-Llamacpp\-Ollama](https://github.com/TheBlewish/Web-LLM-Assistant-Llamacpp-Ollama)

\[2] Ollama, “Ollama: 本地 LLM 推理平台,” 2024\. 可用链接: <https://ollama.com/>

\[3] Ollama, “Llama 3\.2 模型概述: 库,” 2024\. 可用链接: [https://ollama.com/library/llama3\.2](https://ollama.com/library/llama3.2)

快乐编码！ 🎉

👨🏾‍💻 [GitHub](https://github.com/mdmonsurali) ⭐️ \| 👔 [LinkedIn](https://www.linkedin.com/in/mdmonsurali/) \| 📝 [Medium](https://medium.com/@monsuralirana) \| ☕️ [Ko\-fi](https://ko-fi.com/monsurali)

感谢您阅读这篇文章！

请务必留下您的反馈和评论。 👏 为这个故事点赞并关注更多故事。下次博客见，敬请期待 📢

## 享受这篇文章吗？查看我的更多作品：

* **使用Elasticsearch、Ollama、LLaMA 3\.1和LangChain构建自定义文档代理：** 探索如何使用LLaMA 3\.1和Ollama设置个性化文档检索代理，以实现无缝信息检索。[在这里阅读完整教程](https://readmedium.com/building-a-custom-documents-agent-with-elasticsearch-ollama-llama-3-1-and-langchain-926b28047e1d)。
* **使用Ollama的LLaMA3\.1、LLaMA3\.2模型、Streamlit UI和本地构建个人AI助手：** 发现如何开发一个能够记住过去互动的AI助手，使用最新的LLaMA模型和用户友好的Streamlit界面。[在这里阅读完整教程。](https://readmedium.com/building-porter-your-personal-ai-assistant-with-memory-using-ollamas-llama3-1-efb32b80c129)
* **OpenAI Swarm：一个轻量级的多代理编排框架：** 深入了解一个新框架，旨在高效管理多个AI代理，提升您的AI项目管理能力。[在这里阅读完整教程。](https://readmedium.com/openai-swarm-a-lightweight-framework-for-multi-agent-orchestration-b4a83a1a1e37)
* **如何使用Molmo\-7B进行多模态AI：使用开源视觉-语言模型提取文本和图像：** 学习如何利用Molmo\-7B模型提取文本和图像，彻底改变您对多模态AI的处理方式。[在这里阅读完整教程。](https://readmedium.com/how-to-use-molmo-7b-for-multimodal-ai-extract-text-and-images-with-an-open-source-vision-language-8a31939a2960)

