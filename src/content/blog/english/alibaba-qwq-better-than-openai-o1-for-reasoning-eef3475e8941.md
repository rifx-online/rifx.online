---
title: "Alibaba QwQ: Better than OpenAI-o1 for reasoning?"
meta_title: "Alibaba QwQ: Better than OpenAI-o1 for reasoning?"
description: "Alibabas QwQ-32B-Preview is an advanced open-sourced language model that excels in reasoning, particularly in mathematics and coding, outperforming OpenAIs o1-mini and competing closely with o1-preview. It features 32.5 billion parameters and employs modern techniques like transformers and SwiGLU for enhanced performance. Despite its strengths, it faces challenges in language consistency, recursive reasoning, and common-sense understanding, indicating room for improvement. Overall, QwQ represents a significant advancement in AI reasoning capabilities, particularly for developers focused on specific analytical tasks."
date: 2024-11-30T13:53:21Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*pWdRE0O4cXVH1KFe"
categories: ["Programming", "Machine Learning", "Natural Language Processing"]
author: "Rifx.Online"
tags: ["QwQ", "transformers", "SwiGLU", "reasoning", "parameters"]
draft: False

---





### 32b open\-sourced model beats o1 mini and competes with o1\-preview



A few days back, Alibaba released Marco\-o1, a 7b reasoning model. Now, they have released another, improved version called QwQ, which even outperformed OpenAI\-o1 mini and is at par with o1\-preview. The best part?

It’s open\-sourced








## What is Alibaba QwQ\-32b\-preview?

QwQ\-32B\-Preview is an experimental large language model designed by the Qwen Team to explore and improve AI reasoning abilities. As a preview version, it demonstrates significant strengths, especially in areas like math and coding, but also comes with notable challenges. Below is a detailed explanation of its capabilities and limitations:


## QwQ key features:








### Advanced Reasoning Abilities:


> The model is specifically trained to tackle complex problems that require multi\-step reasoning.


> Shows promise in analytical tasks, such as mathematical computations and logical deductions.


### Strong Math and Coding Performance:


> Excels in handling programming tasks, debugging, and generating code snippets.


> Performs well in solving intricate math problems.

QwQ has outperformed o1\-mini and looks neck to neck with o1\-preview as well on some major benchmarks. Have a look below:


## QwQ performance and metrics

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*HxCy6s-Q4iUMigds)


### Strengths of QwQ\-32B:

1. **Mathematics:** On MATH\-500, QwQ\-32B achieved 90\.6% pass@1 accuracy, outperforming OpenAI o1\-preview (85\.5%) \& o1\-mini
2. **AIME Performance:** QwQ\-32B scored 50\.0%, significantly higher than OpenAI o1\-preview (44\.6%) and far better than GPT\-4o (9\.3%). This demonstrates an edge in certain complex reasoning tasks.
3. **General QA Tasks:** In GPQA, QwQ\-32B scored 65\.2%, nearly matching Claude 3\.5 Sonnet (65%) but slightly behind OpenAI o1\-preview (72\.3%).


### Areas for Improvement:

* **LiveCodeBench:** QwQ\-32B scored 50\.0%, which is competitive but lower than OpenAI o1\-mini (58\.0%) and GPT\-4o (53\.6%), suggesting some limitations in practical coding tasks.
* **Overall Robustness**: While QwQ excels in specific domains like math, OpenAI models generally maintain better consistency across various benchmarks.


## Alibaba QwQ architecture

* **Transformers**: The core backbone of the model, widely used in modern LLMs, enabling efficient handling of long\-range dependencies in text.
* **RoPE (Rotary Positional Embeddings):** A technique for encoding positional information in the model to improve its ability to understand sequence order.
* Optimized for long\-context understanding, which aligns with the model’s ability to handle up to 32,768 tokens.
* **SwiGLU (Switch\-Gated Linear Unit):** A more efficient activation function compared to ReLU, boosting computational efficiency and model performance.
* **RMSNorm (Root Mean Square Layer Normalization):** A normalization technique that stabilizes training and improves model performance, especially in large\-scale architectures.
* **Attention QKV Bias:** Adds learnable biases to the Query (Q), Key (K), and Value (V) vectors in the attention mechanism.
* Enhances the model’s flexibility and accuracy in identifying important relationships in the data.


### Size and Layers


> **Number of Parameters:** Total: 32\.5 billion parameters.


> **Non\-Embedding Parameters**: 31 billion (parameters used directly for computations like attention and feedforward layers, excluding embeddings).


> **Number of Layers:** 64 transformer layers, providing the depth needed for complex reasoning and large\-scale computations.

Alibaba team has been quite open about its limitations as well

**Language Mixing and Code\-Switching:**


> The model may unexpectedly combine or switch between multiple languages in a single response.


> This can create confusion, especially for users expecting consistent outputs in one language.

**Recursive Reasoning Loops:**


> It sometimes gets stuck in circular reasoning, repeatedly re\-examining the same points without reaching a conclusion.


> This can lead to overly long and unproductive responses.

**Safety and Ethical Concerns:**


> The model requires better safeguards to ensure outputs are ethical, accurate, and appropriate for various contexts.


> Users must exercise caution when deploying it in real\-world scenarios, as unintended responses could pose risks.

**Performance Gaps in Common Sense and Language Nuance:**


> While strong in math and coding, it struggles with:


> Common sense reasoning (understanding everyday knowledge).


> Subtle language nuances (interpreting idioms, cultural contexts, or highly abstract ideas).


## How to use the Alibaba QwQ?

1. The model is now available on Ollama. just run (if you have already installed Ollama in the local system)


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
3\. If you don't have enough hardware, use it in the free UI

In conclusion, Alibaba’s QwQ\-32B\-Preview represents a significant step forward in open\-sourced AI reasoning models, particularly excelling in mathematical and coding tasks. Its strong performance on benchmarks highlights its analytical prowess, putting it on par with or even ahead of OpenAI’s o1\-mini and competitive with o1\-preview. However, challenges such as language mixing, recursive reasoning, and gaps in general\-purpose reasoning indicate that the model is not yet as versatile as its competitors.

Overall, QwQ offers promising capabilities for specific domains and is an excellent choice for developers seeking a robust, open\-source option for math and coding tasks. With further refinement in its limitations, it has the potential to challenge leading proprietary models in more general use cases.


