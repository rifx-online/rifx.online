---
title: "Google 发布 Gemma — 轻量级开源模型"
meta_title: "Google 发布 Gemma — 轻量级开源模型"
description: "Google 发布了 Gemma，这是一系列轻量级开源模型，基于创建 Gemini 的研究和技术构建……"
date: 2024-10-29T12:46:34Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*G7XbkhsCwillpje7AvETjQ.jpeg"
categories: ["Natural Language Processing", "Programming", "Chatbots"]
author: "Rifx.Online"
tags: ["Gemma", "Gemini", "parameters", "NLP", "chatbots"]
draft: False

---





在短短一周内，世界见证了两家科技巨头带来的最具突破性的AI进展。OpenAI推出了令人惊叹的AI视频生成器[Sora](https://readmedium.com/3d16381f3bf5)，而谷歌则揭晓了其[Gemini 1.5模型](https://generativeai.pub/google-releases-gemini-1-5-with-1m-context-window-44ed4a2ea319)，能够支持最多100万的上下文窗口。

今天，谷歌再次引发轰动，发布了[Gemma](https://ai.google.dev/gemma/?utm_source=keyword&utm_medium=referral&utm_campaign=gemma_cta&utm_content)，这是一个轻量级、最先进的开源模型家族，建立在用于创建Gemini模型的研究和技术基础之上。

## 什么是 Gemma？

Gemma 以拉丁语 *gemma* 意为“珍贵的宝石”命名，汲取了其前身 Gemini 的灵感，反映了其在科技领域的价值和稀有性。

它们是文本到文本、仅解码的大型语言模型，提供英语版本，具有开放权重、预训练变体和指令调优变体。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Fu2ryJMunebq5c0dD-opZQ.png)

Gemma 从今天起在全球范围内提供，分为两种尺寸（2B 和 7B），支持广泛的工具和系统，并可在开发者的笔记本电脑和工作站上运行。

## 2 模型大小和能力

Gemma 模型有 20 亿和 70 亿参数两种规模。2B 模型旨在运行在移动设备和笔记本电脑上，而 7B 模型则适用于桌面计算机和小型服务器。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*sH9jaz1RvtKeJ5yjfyOL5Q.png)

**调优模型**

Gemma 还有两个版本：调优版和预训练版。

* **预训练：** 这就像基础模型，没有任何微调。该模型没有针对 Gemma 核心数据训练集以外的特定任务或指令进行训练。
* **指令调优：** 该模型经过微调，以适应人类语言交互，从而提高其执行特定任务的能力。

## 它与竞争对手的比较？

由于体积小，Gemma能够直接在用户的笔记本电脑上运行。下图显示了Gemma (7B)的语言理解和生成性能与类似规模的开放模型如LLaMA 2 (7B)、LLaMA 2 (13B)和Mistral (7B)的比较。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*QxjZALUAIDiS_T66EpOu-g.png)

您可以在[这里](https://ai.google.dev/gemma/?utm_source=keyword&utm_medium=referral&utm_campaign=gemma_cta&utm_content)查看每个基准的更详细比较。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Fc8Fk0Dgh2VFU_VLhpcs6Q.png)

## 它的用途是什么？

以下是 Gemma 可能的使用场景：

**内容创作与沟通**

* 文本生成
* 聊天机器人和对话式 AI
* 文本摘要

**研究与教育**

* **自然语言处理 (NLP) 研究：** 作为 NLP 研究的基础，实验技术，开发算法，并为该领域的进步做出贡献。
* **语言学习工具：** 支持互动语言学习体验，帮助语法纠正，或提供写作练习。
* **知识探索：** 帮助研究人员通过生成摘要或回答特定主题的问题来探索大量文本。

以前需要极大模型的任务现在可以通过最先进的小型模型来实现。这开启了开发 AI 应用程序的全新方式，我们很快可能会在智能手机上看到无需互联网连接的设备内 AI 聊天机器人。

这有多令人兴奋呢？

## 这真的好吗？

几位 [redditors](https://www.reddit.com/r/LocalLLaMA/comments/1awbqwd/gemma_7b_the_latest_opensource_model_from_google/) 分享了他们使用 Gemma 的经验，到目前为止，结果并不理想。看看这个例子，Gemma 在回答关于重量的问题时给出了错误的答案。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*Sdaiaqcuz7qbftG1)

我自己还没有真正尝试过，但重要的是要记住，像这样的较小模型预计会有一些缺陷，有时可能会给出错误的答案。

## 尝试自己动手

您可以今天开始使用Gemma，通过Kaggle的免费访问、Colab笔记本的免费层以及首次使用Google Cloud的用户可获得的$300信用额度。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*BrvLnczy724TPrsk-uFJCw.png)

如果您有兴趣开始使用Gemma，请查看这些指南，以了解从文本生成到在Gemma模式下部署的过程：

* **使用Gemma进行文本生成**：构建一个基本的文本生成示例。
* **使用LoRA调优Gemma**：对Gemma 2B模型进行LoRA微调。
* **使用分布式训练调优Gemma模型**：使用Keras和JAX后端对Gemma 7B模型进行LoRA和模型并行的微调。
* **将Gemma部署到生产环境**：使用Vertex AI将Gemma部署到生产环境。

## 下载模型

开放模型目前可在 [HuggingFace](https://huggingface.co/models?other=gemma&sort=trending&search=google) 上获取。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*mJRzGhO1sUxPL4_3YjpNGA.png)

Gemma 模型也可以从 [Kaggle Models](https://www.kaggle.com/models/google/gemma) 下载。

## 最后的思考

虽然Gemma模型可能体积小且缺乏复杂性，但它们在速度和使用成本上可能会有所弥补。

从更大的角度来看，谷歌并不是追逐短期的消费者兴奋，而是在为企业培育市场。他们设想公司会为谷歌云服务付费，因为开发者使用Gemma来创建创新的新消费应用。

此外，尽管Gemini的反响平平，谷歌仍然展示了它还有更多的秘密武器。

当然，对于任何强大的技术来说，真正的考验是它的实际效果。谷歌的过去引发了一个问题：这些模型在现实世界中的表现是否能如承诺的那样出色。密切关注这一点是重要的，但也希望谷歌能从过去中吸取教训，提供真正可比甚至优于竞争对手的模型。

我迫不及待想要体验Gemma，并且我一定会分享我对这个新AI模型的初步想法和发现。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*8BDnUV9iQisOyeN3.png)

这篇文章发布在[Generative AI](https://generativeai.pub/)。请在[LinkedIn](https://www.linkedin.com/company/generative-ai-publication)上与我们联系，并关注[Zeniteq](https://www.zeniteq.com/)，以获取最新的AI故事。让我们一起塑造AI的未来！

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*JeeoUhaBYUJGr0Xq.png)

