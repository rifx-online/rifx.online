---
title: "Meta Llama3.3：70B 型号，Llama3.1 的备用型号 405B"
meta_title: "Meta Llama3.3：70B 型号，Llama3.1 的备用型号 405B"
description: "Llama 3.3 是 Meta 发布的最新 700 亿参数生成式 AI 模型，采用自回归架构和分组查询注意力机制，支持多种语言。该模型在多个基准测试中表现优异，成本仅为 Llama 3.1 405B 的约 1/5。Llama 3.3 通过有监督微调和基于人类反馈的强化学习进行训练，可在 HuggingFace 上免费使用，适用于各种 NLP 任务。"
date: 2024-12-12T01:16:08Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*iq0qStuD9_wx7jOB"
categories: ["Generative AI", "Natural Language Processing", "Technology/Web"]
author: "Rifx.Online"
tags: ["Llama", "GQA", "tokenizer", "HuggingFace", "NLP"]
draft: False

---



### Llama3.3 是 Llama 系列中的第 3 个模型系列，继 Llama3.1 和 Llama3.2 之后



因此，Meta 在今年的最后一次发布中推出了 Llama3.3，这是一个 700 亿参数的生成式 AI 模型，已经展示了一些非常出色的结果，并在基准数据集上击败了一些最先进的大语言模型。正如 Meta 所承诺的，该模型是开源的，因此可以免费使用。

> 如果你不知道的话，Llama3.3 是 Llama 系列中的第 3 个版本，前两个版本分别是 Llama3.1（80 亿、700 亿、4050 亿参数），Llama3.2（4 个变体，多模态），而现在是 Llama3.3（700 亿参数，纯文本）。

## 模型架构

Llama 3.3 采用**自回归方式**运行，这意味着它通过预测序列中的下一个词来生成文本，预测的依据是前面的词。这种方法使得生成的文本连贯且上下文相关，使其适用于自然语言处理中的各种任务。Llama 3.3 的架构基于经过**性能优化**的变压器设计。

关键特性包括：

* **分组查询注意力 (GQA)**：这种机制通过允许模型同时处理多个查询来提高推理过程中的效率，这在处理更大数据集和更长序列时特别有益。
* **128K 词汇量的分词器**：该模型使用一个能够处理庞大词汇量的分词器，提高了其高效且有效地编码语言的能力。

### 训练方法

Llama 3.3 采用两种主要的训练方法来提升其性能：

1. **有监督微调 (SFT)**：此过程涉及在标记数据集上训练模型，其中使用人工反馈来指导学习过程。
2. **基于人类反馈的强化学习 (RLHF)**：RLHF 通过在训练过程中结合人类评估者的反馈进一步优化模型的能力。


> **训练数据：** 基于多种公开的在线资源混合构建。


> **上下文长度：** 可处理长达 128k 个标记的输入。


> **标记数量：** 在超过 15 万亿个标记上进行训练。


> **知识截止日期：** 更新至 2023 年 12 月。


> **支持的语言：** 英语、德语、法语、意大利语、葡萄牙语、印地语、西班牙语和泰语。

## 性能和指标

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*AZncUlj9mNWYeCqc)

如上表所示


> Llama3\.3 在几乎所有基准测试中都优于 Llama3\.1 70B


> 在 GPQA Diamond、MATH、IFEval 等指标上也超过了 Llama3\.1 405B


> 甚至成本也仅为 Llama3\.1 405B 的约 1/5。

总体而言，指标表现良好，考虑到模型的大小，性能非常出色。

## 如何使用 Llama3\.3？

该模型可在 HuggingFace 上使用。首先你需要

* 访问受限制的仓库（填写简短的表单）

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*u0HOL3wYsXOPiM618okcrQ.png)

* 更新 transformers


```python
pip install --upgrade transformers
```
* 生成一个 HuggingFace READ 令牌（免费创建）。
* 按照以下代码


```python
import transformers
import torch

model_id = "meta-llama/Llama-3.3-70B-Instruct"

pipeline = transformers.pipeline(
    "text-generation",
    model=model_id,
    model_kwargs={"torch_dtype": torch.bfloat16},
    device_map="auto",
)

messages = [
    {"role": "system", "content": "You are a pirate chatbot who always responds in pirate speak!"},
    {"role": "user", "content": "Who are you?"},
]

outputs = pipeline(
    messages,
    max_new_tokens=256,
)
print(outputs[0]["generated_text"][-1])
```
总之，Llama 3\.3 作为 Llama 3\.1 405B 等大型模型的强大且经济实惠的替代品，在关键基准测试中表现出色，同时保持开源和易访问性。其优化的架构、先进的训练方法和对多种语言的支持使其成为广泛 NLP 应用的理想选择。无论你是在探索文本生成、推理任务还是编程挑战，Llama 3\.3 都能以较低的成本提供强大的解决方案，使其成为开发人员和研究人员的宝贵工具。

