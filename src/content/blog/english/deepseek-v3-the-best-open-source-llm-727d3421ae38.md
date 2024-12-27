---
title: "DeepSeek V3: The best Open-source LLM | by Mehul Gupta | Data Science in your pocket | Dec, 2024 | Medium"
meta_title: "DeepSeek V3: The best Open-source LLM | by Mehul Gupta | Data Science in your pocket | Dec, 2024 | Medium"
description: "DeepSeek V3, released by Chinas DeepSeek, is an advanced open-source large language model (LLM) with 685 billion parameters, outperforming notable competitors like Claude 3.5 and GPT-4o. It achieves high accuracy near 90% and operates at 60 tokens per second, demonstrating efficiency and cost-effectiveness. Key features include Mixture-of-Experts architecture, multi-head latent attention, and extensive training on 14.8 trillion tokens. DeepSeek V3 excels in various performance metrics, including math reasoning and complex question answering, making it one of the best open-source models available."
date: 2024-12-27T03:43:30Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*QYVWKYv9qo54BvFi"
categories: ["Natural Language Processing", "Machine Learning", "Data Science"]
author: "Rifx.Online"
tags: ["DeepSeek", "parameters", "Mixture-of-Experts", "tokens", "math"]
draft: False

---





### Better than Claude 3\.5 Sonnet, GPT\-4o, Llama3\.1 405B



The year is about to end and just now, China’s DeepSeek has released its open\-sourced model DeepSeek\-v3, which has outperformed all major names be it Claude3\.5 Sonnet, GPT\-4o, Qwen2\.5 Coder and others. The model performance looks like a monster and clearly, we can say







DeepSeek\-V3 is the best\-open\-sourced model released so far


### One of the biggest LLMs, ever!

DeepSeek\-V3 boasts an impressive size of 685 billion parameters, making it one of the larger models in the AI landscape. This extensive parameter count allows for a more nuanced understanding and generation of text.








### Very Fast

60 tokens/second (3x faster than DeepSeek V2\)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*04soDWEsFKvpFi_P.jpeg)

The graph highlights DeepSeek\-V3’s **superiority** based on **performance\-to\-price ratio** and **accuracy** (MMLU Redux ZeroEval Score). Here’s why it’s the best:

1. **High Accuracy**: DeepSeek\-V3 scores near **90**, surpassing most open\-source models and even competing closely with closed\-source ones like Claude 3\.5 and GPT\-4\.
2. **Optimal Cost**: It falls into the **performance/price optimum range**, making it highly efficient in terms of API cost per million tokens compared to other high\-performing models.
3. **Balanced Performance and Accessibility**: Unlike expensive closed\-source models, DeepSeek\-V3 offers competitive performance while being open\-source, ensuring affordability and flexibility.


## Key Features of DeepSeek\-V3:

**Model Size and Efficiency**:

* **671B total parameters**, with **37B activated per token**.
* Uses **Mixture\-of\-Experts (MoE)** for efficiency.


> A **Mixture\-of\-Experts (MoE) LLM** is a type of AI model that uses **multiple specialized “experts” (smaller sub\-models)**. For each input, only a few of these experts are activated, which makes the model **faster and more efficient**. It’s like having a group of specialists where only the right ones are consulted for each task, rather than asking everyone.

**Architectural Innovations**:

* Implements **Multi\-head Latent Attention (MLA)** and **DeepSeekMoE architectures**, building on advancements from DeepSeek\-V2\.
* Introduces an **auxiliary\-loss\-free strategy** for load balancing.
* Adopts a **multi\-token prediction training objective** for enhanced performance.

**Training Dataset**:

* Pre\-trained on **14\.8 trillion high\-quality tokens**, ensuring diverse and rich data.

**Training Process**:

* Comprises **Supervised Fine\-Tuning** and **Reinforcement Learning** stages.
* Requires only **2\.788M H800 GPU hours**, making it cost\-effective.
* **Stable training process** with no irrecoverable loss spikes or rollbacks.


## Performance and Metrics

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*7UwH-gLiNTznTN37.png)

Summarizing the results,

**MMLU\-Pro (Knowledge Understanding)**:

* **DeepSeek\-V3**: 75\.9% (second best).
* Slightly behind **GPT\-4 (78%)**, outperforming all other models.

**GPQA\-Diamond (Complex QA)**:

* **DeepSeek\-V3**: 59\.1%
* Significant lead over **GPT\-4 (49\.9%)** and others. Only Claude is better

**MATH 500 (Math Reasoning)**:

* **DeepSeek\-V3**: 90\.2% (best performance).
* Outperforms GPT\-4 and other models by a wide margin.

**AIME 2024 (Advanced Math Reasoning)**:

* **DeepSeek\-V3**: 39\.2% (best performance).
* Leads by over **23%** compared to GPT\-4 and others.

**Codeforces (Programming Problem Solving)**:

* **DeepSeek\-V3**: 51\.6% (best performance).
* Exceeds GPT\-4 and other models significantly.

**SWE\-bench Verified (Software Engineering)**:

* **DeepSeek\-V3**: 42% (second best).
* Behind **Claude Sonnet (50\.8%)** but ahead of most other models.


## How to use DeepSeek\-V3?

The model weights are open\-sourced and can be accessed using HuggingFace

If you just wish to chat, the model is hosted for free on deepseek’s official chat: <https://www.deepseek.com/>

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*jRKyQIV8oIuAjE65bvVVdw.png)

Hope you try out the model


