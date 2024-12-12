---
title: "Meta Llama3.3 : 70B model alternate for Llama3.1 405B"
meta_title: "Meta Llama3.3 : 70B model alternate for Llama3.1 405B"
description: "Meta has released Llama 3.3, a 70B parameter generative AI model that outperforms previous Llama models and some state-of-the-art (SOTA) large language models (LLMs) on benchmark datasets. The model is open-sourced and free to use. Key features include Grouped Query Attention (GQA) for efficient inference, a 128K vocabulary tokenizer, and support for multiple languages. Llama 3.3 is trained on over 15 trillion tokens and can handle input up to 128k tokens. The model is available on HuggingFace, and users can access it by following a few steps, including obtaining a HuggingFace token and installing the necessary libraries. Llama 3.3 is a cost-effective alternative to larger models, offering exceptional performance across various NLP tasks."
date: 2024-12-12T01:16:08Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*iq0qStuD9_wx7jOB"
categories: ["Generative AI", "Natural Language Processing", "Technology/Web"]
author: "Rifx.Online"
tags: ["Llama", "GQA", "tokenizer", "HuggingFace", "NLP"]
draft: False

---





### 3rd model series in Llama after Llama3\.1, Llama3\.2



So Meta, in their final release for the year, launched Llama3\.3, a 70B GenAI model that has shown some great results and has already beaten some SOTA LLMs on benchmark datasets. As promised by Meta, the model is open\-sourced and hence free to use








> If you don't know, Llama3\.3 is the 3rd release in the Llama family, earlier ones being Llama3\.1 (8B, 70B, 405B), Llama3\.2 (4 variants, multimodal) and now Llama3\.3 (70B, text only).


## Model Architecture

Llama 3\.3 operates on an **auto\-regressive basis**, meaning it generates text by predicting the next word in a sequence based on the preceding words. This approach allows for coherent and contextually relevant text generation, making it suitable for a wide array of tasks in NLP.The architecture of Llama 3\.3 is built upon a transformer design that has been **optimized for performance**.







Key features include:

* **Grouped Query Attention (GQA**): This mechanism enhances the model’s efficiency during inference by allowing it to process multiple queries simultaneously, which is particularly beneficial when dealing with larger datasets and longer sequences.
* **Tokenizer with 128K Vocabulary:** The model utilizes a tokenizer that can handle a vast vocabulary, improving its ability to encode language efficiently and effectively.


### Training Methodology

Llama 3\.3 employs two primary training methodologies to enhance its performance:

1. **Supervised Fine\-Tuning (SFT)**: This process involves training the model on labelled datasets where human feedback is used to guide the learning process.
2. **Reinforcement Learning with Human Feedback (RLHF):** RLHF further refines the model’s capabilities by incorporating feedback from human evaluators during training.


> **Training Data:** Built on a diverse mix of publicly available online sources.


> **Context Length:** Can handle input up to 128k tokens.


> **Token Count:** Trained on over 15 trillion tokens.


> **Knowledge Cutoff:** Updated until December 2023\.


> **Supported languages:** English, German, French, Italian, Portuguese, Hindi, Spanish, and Thai.


## Performance and metrics

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*AZncUlj9mNWYeCqc)

As you might have observed in the above table


> Llama3\.3 outperforms Llama3\.1 70B on almost all benchmarks


> Beats Llama3\.1 405B on some metrics like GPQA Diamond, MATH, IFEval etc.


> Even the cost associated with about 1/5th of that of Llama3\.1 405B.

Overall, the metrics look good and given the model size, the performance looks awesome.


## How to use Llama3\.3?

The model is available on HuggingFace to use. You first need to

* Take access to the gated repo (by filling out a short form)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*u0HOL3wYsXOPiM618okcrQ.png)

* Update transformers


```python
pip install --upgrade transformers
```
* Generate a HuggingFace READ token (free to create).
* Follow the below code


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
In conclusion, Llama 3\.3 stands out as a powerful and cost\-effective alternative to larger models like Llama 3\.1 405B, delivering exceptional performance across key benchmarks while remaining open\-source and accessible. Its optimized architecture, advanced training methodologies, and support for diverse languages make it an ideal choice for a wide range of NLP applications. Whether you’re exploring text generation, reasoning tasks, or coding challenges, Llama 3\.3 offers a robust solution at a fraction of the cost, making it a valuable tool for developers and researchers alike.


