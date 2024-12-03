---
title: "Meta: LlamaGuard 2 8B"
meta_title: "Meta: LlamaGuard 2 8B"
description: "Meta: LlamaGuard 2 8B"
date: 2024-12-03T02:56:08Z
image: "https://img.rifx.online/icons/meta-color.svg"
categories: ["text 2 text"]
author: "Meta Llama"
tags: ["Programming", "Machine Learning", "Natural Language Processing", "Ethics", "Chatbots"]
draft: False
is_recommended: False
is_active: True

id: "meta-llama/llama-guard-2-8b"
context: 8192
input: 1.8e-07
output: 1.8e-07
img: 0
request: 0
last_updated: 2024-12-03T02:56:08Z
---

该安全模型具有8B参数，并基于Llama 3系列。与其前身[LlamaGuard 1](https://huggingface.co/meta-llama/LlamaGuard-7b)一样，它可以进行提示和响应分类。

LlamaGuard 2的功能类似于普通的LLM，生成文本以指示给定的输入/输出是否安全。如果被认为不安全，它还会分享违反的内容类别。

为了获得最佳效果，请使用原始提示输入或`/completions`端点，而不是聊天API。

在人工评估中，它的表现与领先的闭源模型相比表现强劲。

使用该模型需遵守[Meta的可接受使用政策](https://www.llama.com/llama3/use-policy/)。

