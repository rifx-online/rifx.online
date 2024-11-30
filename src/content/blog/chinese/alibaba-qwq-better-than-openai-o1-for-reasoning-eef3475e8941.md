---
title: "阿里巴巴 QwQ：比 OpenAI-o1 更适合推理？"
meta_title: "阿里巴巴 QwQ：比 OpenAI-o1 更适合推理？"
description: "阿里巴巴推出的 QwQ-32B-Preview 模型在推理能力上表现出色，尤其在数学和编程任务中超越了 OpenAI 的 o1-mini，与 o1-preview 竞争。该模型专为多步骤推理设计，拥有 32.5 亿参数和 64 层变换器，适合处理复杂问题。然而，它在语言混合、递归推理和常识理解方面存在局限性。总的来说，QwQ 为开发者提供了强大的开源选择，尤其在特定任务中展现了潜力。"
date: 2024-11-30T13:53:21Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*pWdRE0O4cXVH1KFe"
categories: ["Programming", "Machine Learning", "Natural Language Processing"]
author: "Rifx.Online"
tags: ["QwQ", "transformers", "SwiGLU", "reasoning", "parameters"]
draft: False

---



### 32b 开源模型超越 o1 mini，并与 o1-preview 竞争



几天前，阿里巴巴发布了 Marco-o1，一个 7b 推理模型。现在，他们又发布了一个改进版本，称为 QwQ，甚至超越了 OpenAI-o1 mini，并与 o1-preview 持平。最棒的是什么？

它是开源的

## 什么是 Alibaba QwQ\-32b\-preview？

QwQ\-32B\-Preview 是由 Qwen 团队设计的实验性大型语言模型，旨在探索和提升 AI 推理能力。作为预览版本，它在数学和编程等领域展示了显著的优势，但也存在一些明显的挑战。以下是其能力和局限性的详细说明：

## QwQ 关键特性：

### 高级推理能力:


> 该模型专门训练用于解决需要多步骤推理的复杂问题。


> 在分析任务中表现出色，例如数学计算和逻辑推理。

### 强大的数学和编码表现：

> 擅长处理编程任务、调试和生成代码片段。

> 在解决复杂数学问题方面表现出色。

QwQ 在一些主要基准测试中超越了 o1\-mini，并在与 o1\-preview 的表现上也不相上下。请看下面：

## QwQ 性能和指标

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*HxCy6s-Q4iUMigds)

### QwQ\-32B 的优势：

1. **数学：** 在 MATH\-500 上，QwQ\-32B 达到了 90\.6% 的 pass@1 准确率，超过了 OpenAI o1\-preview（85\.5%）和 o1\-mini。
2. **AIME 表现：** QwQ\-32B 的得分为 50\.0%，显著高于 OpenAI o1\-preview（44\.6%），远远好于 GPT\-4o（9\.3%）。这表明在某些复杂推理任务中具有优势。
3. **一般问答任务：** 在 GPQA 中，QwQ\-32B 的得分为 65\.2%，几乎与 Claude 3\.5 Sonnet（65%）持平，但略低于 OpenAI o1\-preview（72\.3%）。

### 改进领域：

* **LiveCodeBench:** QwQ\-32B 得分为 50\.0%，虽然具有竞争力，但低于 OpenAI o1\-mini (58\.0%) 和 GPT\-4o (53\.6%)，这表明在实际编码任务中存在一些局限性。
* **整体稳健性**：虽然 QwQ 在数学等特定领域表现出色，但 OpenAI 模型在各类基准测试中通常保持更好的一致性。

## Alibaba QwQ架构

* **Transformers**: 模型的核心骨干，广泛应用于现代LLMs，能够高效处理文本中的长程依赖关系。
* **RoPE (Rotary Positional Embeddings):** 一种编码模型中位置信息的技术，以提高其理解序列顺序的能力。
* 针对长上下文理解进行了优化，符合模型处理最多32,768个标记的能力。
* **SwiGLU (Switch-Gated Linear Unit):** 一种比ReLU更高效的激活函数，提高了计算效率和模型性能。
* **RMSNorm (Root Mean Square Layer Normalization):** 一种规范化技术，稳定训练并改善模型性能，特别是在大规模架构中。
* **Attention QKV Bias:** 在注意力机制中为查询（Q）、键（K）和值（V）向量添加可学习的偏置。
* 提高了模型在识别数据中重要关系方面的灵活性和准确性。

### 尺寸和层数

> **参数数量：** 总计：32.5亿参数。

> **非嵌入参数：** 31亿（直接用于计算的参数，如注意力和前馈层，不包括嵌入）。

> **层数：** 64个变换器层，提供了进行复杂推理和大规模计算所需的深度。

阿里巴巴团队对其局限性也非常坦诚

**语言混合和代码切换：**

> 模型可能会在单个响应中意外地结合或切换多种语言。

> 这可能会造成混淆，特别是对于期望在一种语言中获得一致输出的用户。

**递归推理循环：**

> 有时它会陷入循环推理，不断重新审视相同的观点而无法得出结论。

> 这可能导致过长且无效的响应。

**安全性和伦理问题：**

> 模型需要更好的保障措施，以确保输出在各种上下文中是伦理的、准确的和适当的。

> 用户在现实场景中部署时必须谨慎，因为意外的响应可能会带来风险。

**常识和语言细微差别的性能差距：**

> 尽管在数学和编码方面表现强劲，但它在以下方面存在困难：

> 常识推理（理解日常知识）。

> 细微的语言差别（解释习语、文化背景或高度抽象的想法）。

## 如何使用阿里巴巴的 QwQ？

1. 该模型现在可以在 Ollama 上使用。只需运行（如果您已经在本地系统中安装了 Ollama）


```python
ollama run qwq
```
2\. HuggingFace


```python
from transformers import AutoModelForCausalLM, AutoTokenizer

model_name = "Qwen/QwQ-32B-Preview"

model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype="auto",
    device_map="auto"
)
tokenizer = AutoTokenizer.from_pretrained(model_name)

prompt = "How many r in strawberry."
messages = [
    {"role": "system", "content": "You are a helpful and harmless assistant. You are Qwen developed by Alibaba. You should think step-by-step."},
    {"role": "user", "content": prompt}
]
text = tokenizer.apply_chat_template(
    messages,
    tokenize=False,
    add_generation_prompt=True
)
model_inputs = tokenizer([text], return_tensors="pt").to(model.device)

generated_ids = model.generate(
    **model_inputs,
    max_new_tokens=512
)
generated_ids = [
    output_ids[len(input_ids):] for input_ids, output_ids in zip(model_inputs.input_ids, generated_ids)
]

response = tokenizer.batch_decode(generated_ids, skip_special_tokens=True)[0]
```
3\. 如果您的硬件不足，请在免费的用户界面中使用它

总之，阿里巴巴的 QwQ\-32B\-Preview 代表了开源 AI 推理模型的重要进展，特别是在数学和编码任务方面表现优异。其在基准测试中的强劲表现突显了其分析能力，使其与 OpenAI 的 o1\-mini 平起平坐，甚至超过，并与 o1\-preview 竞争。然而，语言混合、递归推理和通用推理的差距等挑战表明，该模型尚未像其竞争对手那样多才多艺。

总体而言，QwQ 在特定领域提供了有希望的能力，是开发人员寻求强大开源选项以应对数学和编码任务的绝佳选择。通过进一步完善其局限性，它有潜力在更广泛的使用案例中挑战领先的专有模型。

