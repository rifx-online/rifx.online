---
title: "阿里巴巴 Marco-o1：OpenAI-o1 的开源替代品"
meta_title: "阿里巴巴 Marco-o1：OpenAI-o1 的开源替代品"
description: "阿里巴巴推出的Marco-o1是OpenAI-o1的开源替代品，专注于复杂推理和开放式问题。它采用蒙特卡罗树搜索（MCTS）、思维链微调和自我反思机制，能够生成多种解决方案，处理模糊查询和翻译任务。Marco-o1在英语和中文的MGSM数据集上表现出显著的准确率提升，展现了其在高级推理任务中的潜力。"
date: 2024-11-30T13:50:22Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*_k5UXg-sjqD1g84RX0qVGg.png"
categories: ["Programming", "Machine Learning", "Natural Language Processing"]
author: "Rifx.Online"
tags: ["Marco-o1", "OpenAI-o1", "Monte-Carlo", "Chain-of-Thought", "self-reflection"]
draft: False

---



### LLM用于开放式问题



OpenAI-o1 是一次革命性的发布，使 LLM 能够对复杂任务进行详细推理，例如数学或物理问题，而不仅仅局限于通用文本生成。

但 OpenAI-o1 是收费的

正如预期的那样，开源竞争者并不遥远，而再次是阿里巴巴（在 Qwen 系列之后）最近推出了 Marco-o1。

## 什么是 Alibaba 的 Marco\-o1？

Marco\-o1 旨在通过采用先进技术，如蒙特卡罗树搜索（MCTS）和思维链（CoT）微调，来解决复杂的推理任务。它的主要重点是为开放式问题生成多个解决方案，而不是仅仅满足于单一答案，这与人类的推理过程更为接近。

Marco\-o1 并不仅仅是为那些有明确答案的学科而构建的，比如数学、物理或编程——在这些领域中，使用强化学习（RL）来衡量成功是很简单的。它还专注于解决没有固定规则或明显成功判断标准的开放式问题。

例如：

> 想象一下 Marco\-o1 是一个超级聪明的问题解决者。大多数模型（如数学、物理或编程）擅长于有固定答案的问题——比如 **“2\+2 等于多少？”或 “我该如何修复这段代码？”** 这些问题很简单，因为我们知道它们是对还是错。

> 但 Marco\-o1 超越了这一点。它还试图解决混乱的开放式问题，比如 **“我们如何能让世界更快乐？”或 “讲这个故事的最佳方式是什么？”** 在这里没有单一的“正确”答案，而且很难确切说出什么使一个答案好或坏。

### 关键特性

* **开放式推理：** 与传统模型旨在提供明确答案不同，Marco-o1 探索多种潜在解决方案，使其在处理模糊或复杂查询时特别有效
* **蒙特卡罗树搜索 (MCTS)：** 该技术允许模型评估众多可能的解决路径，类似于棋手在做出决策之前考虑不同的走法。MCTS 有助于在探索新可能性与利用已知成功策略之间取得平衡
* **思维链微调：** 通过利用现有数据集和自生成的合成数据的组合，Marco-o1 提高了其通过结构化推理步骤处理复杂任务的能力
* **反思机制：** 该模型包含一个自我反思组件，促使其在生成答案后重新评估其推理，从而增强其解决问题的能力

## Marco\-o1 是如何工作的？

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*eHR-SduQCAPPgeQVbAdPWw.png)

### 1\. 数据集来源（顶部部分）：

该模型在三个数据集上进行训练：

* **Open\-o1 CoT 数据集（过滤后）：** 一个经过精炼的数据集，包含思维链（CoT）注释。
* **Marco\-o1 CoT 数据集（合成）：** 为了增强学习而创建的合成数据。
* **Marco\-o1 指令数据集：** 一个专注于指令提示的数据集。

这些数据集被结合并用于**监督微调**，以提高模型的推理和响应能力。它基本上使用 Qwen2–7B 模型作为基础，在上述数据集上进行微调。

### 2\. 推理过程（底部部分）：

在推理过程中（模型生成答案时）：

**MCTS（蒙特卡洛树搜索）：**

* 使用树结构逐步探索可能的答案。
* **节点**表示不同的推理路径。
* **黄色节点**被选中以进行进一步探索。
* **绿色节点**显示最终答案。
* 像“选择”和“备份”这样的箭头显示系统如何评估和细化选择。

**行动策略：** 模型可以在两个层面上操作：

> **步骤层面：** 高层次推理（全局视图）。

> **微步骤层面：** 详细的、较小的推理步骤。

**置信度分数：**

* 在生成答案后，模型使用概率（在公式中显示）计算对结果的置信度。
* 置信度值有助于细化最终输出。

### 性能与指标

除了MGSM（多语言小学数学）对英语和中文的比较指标外，报告的比较指标不多。

* MGSM 数据集（英语）：Marco\-o1 的准确率提高了6\.17%。
* MGSM 数据集（中文）：该模型的准确率提高了5\.60%。

## Acing at Language Translation

在翻译任务中，Marco\-o1 展现了处理俚语和随意语言的能力。例如，它可以将 **“这件衣服太炸了”** 翻译为 **“This outfit is amazing,”** 显示了它理解和传达口语细微差别的能力。下面的图片更好地解释了这一点。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*JcWLn3XhWvQCqj3C0SrVTQ.png)

## 如何使用 Marco\-o1？

直接访问 HuggingFace，一切都已为您准备好。只需设置您的 HF\_TOKEN（读取令牌，免费创建）并使用以下代码开始。

```python
## Load model directly
from transformers import AutoTokenizer, AutoModelForCausalLM

tokenizer = AutoTokenizer.from_pretrained("AIDC-AI/Marco-o1")
model = AutoModelForCausalLM.from_pretrained("AIDC-AI/Marco-o1")
```
总而言之，Alibaba 的 Marco\-o1 是 OpenAI\-o1 的一个开源替代方案，在复杂推理和开放式问题解决方面表现出色。它具有 MCTS、CoT 微调和自我反思等功能，能够有效处理翻译和模糊查询等细致任务。虽然更多的性能基准将增强其说服力，但 Marco\-o1 的可获取性和实际应用使其成为高级推理任务的一个有前途的工具。

