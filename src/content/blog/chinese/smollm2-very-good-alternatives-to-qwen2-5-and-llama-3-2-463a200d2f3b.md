---
title: "SmolLM2：Qwen2.5 和 Llama 3.2 的最佳替代品"
meta_title: "SmolLM2：Qwen2.5 和 Llama 3.2 的最佳替代品"
description: "而且是全开的！"
date: 2024-11-10T03:51:17Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*Y3_lsNsFKybrOi14.png"
categories: ["Technology", "Machine Learning", "Data Science"]
author: "Rifx.Online"
tags: ["SmolLM2", "parameters", "pre-training", "MobileLLM", "reproducibility"]
draft: False

---



## 而且它是完全开放的！

Hugging Face 加大了对 SmolLM 计划的投入。

他们发布了 SmolLM2：1\.7B、360M 和 135M 模型，训练于 11T 令牌（相比 SmolLM 的 1T）。他们发布了基础版和指导版：

* Hugging Face Collection: [SmolLM2](https://huggingface.co/collections/HuggingFaceTB/smollm2-6723884218bcda64b34d7db9) (Apache 2\.0 许可证)

他们使用了新的数据集进行预训练，计划很快发布。为了制作指导版，他们使用了类似于训练 Zephyr 的配方（SFT\+DPO 在 ultrafeedback 上）。

看起来 SmolLM2 的表现非常出色：



请注意，Hugging Face 完全公开了预训练数据和他们用来防止数据污染的配方。换句话说，他们发布的评估结果可能是准确且完全可重复的。

Hugging Face 使用了自己的框架进行预训练，[Nanotron](https://github.com/huggingface/nanotron)。我从未写过关于 Nanotron 的文章，但我认为这是一个非常有趣的项目，值得更广为人知，特别是如果你有兴趣了解预训练是如何进行的。我会尽量找时间在 2025 年之前发布一篇解释 Nanotron 的文章！

Meta 还发布了一系列小型模型，MobileLLM：

* Hugging Face Collection: [MobileLLM](https://huggingface.co/collections/facebook/mobilellm-6722be18cb86c20ebe113e95) (CC\-BY\-NC)

这是一个新发布的项目，但请注意，这些模型实际上相当旧。它们是为 2024 年 2 月发布的这项工作训练的：

[MobileLLM: Optimizing Sub\-billion Parameter Language Models for On\-Device Use Cases](https://arxiv.org/abs/2402.14905)

通过我的新书“LLMs on a Budget”，了解使用和微调大型语言模型所需的一切：

