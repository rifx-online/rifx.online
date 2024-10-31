---
title: "Meet Ministral 3B and 8B: Edge AI Game-Changers"
meta_title: "Meet Ministral 3B and 8B: Edge AI Game-Changers"
description: "Mistral AI’s New Frontier in Edge AI and On-Device Computing"
date: 2024-10-31T08:38:17Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*3CmWlEiW7ea8gtqxpI83_w.png"
categories: ["Technology", "Autonomous Systems", "Data Science"]
author: "Rifx.Online"
tags: ["Mistral", "edge", "computing", "translation", "robotics"]
draft: False

---





### Mistral AI’s New Frontier in Edge AI and On\-Device Computing

In the rapidly evolving landscape of AI, edge computing has become increasingly crucial for applications that demand low\-latency, privacy\-first, and efficient inference without relying on cloud\-based infrastructure.

The launch of [**Ministral**](https://mistral.ai/news/ministraux/)family of models, the latest innovation from **Mistral AI**, represents a groundbreaking step forward in the realm of AI.

To mark the first anniversary of its groundbreaking **Mistral 7B** model, Mistral AI has unveiled its next generation of language models: **Ministral 3B** and **Ministral 8B**, collectively known as “[**les Ministraux**](https://mistral.ai/news/ministraux/)”. These models aren’t just incremental improvements; they represent a significant leap in what’s possible with edge AI.




## Why These Models Matter?

Edge AI is all about performing complex computations locally, ensuring data privacy and reducing response times. With **Ministral 3B** and **Ministral 8B**, Mistral AI offers models that combine high computational power with memory efficiency, all while running directly on the device. These models are designed to deliver real\-time insights for applications that can’t afford latency or depend on cloud connectivity.


## Key Features:

1. **State\-of\-the\-Art Performance**: Outperforms existing models in different tasks such as knowledge, commonsense, reasoning, native function\-calling, and efficiency within the sub\-10B category.
2. **Large Context Window**: Support for up to 128k context length, enabling more comprehensive understanding and generation.
3. **Efficient Architecture**: Ministral 8B features a special interleaved sliding\-window attention pattern for faster and more memory\-efficient inference.
4. **Versatility**: Suitable for a wide range of applications, from on\-device translation to autonomous robotics.
5. **Privacy\-First Design**: Built for local inference, these models are perfect for applications that prioritize data privacy, eliminating the need for constant cloud access.
6. **Scalability**: Whether you need low\-power consumption for smaller devices with Ministral 3B or greater capabilities with the 8B variant, both models are flexible enough to be adapted to various use cases.


> For benchmarking results, refer [here](https://mistral.ai/news/ministraux/)


## Breaking Down the Models:


### Ministral 3B:

* With just **3 billion parameters**, it provides a balanced approach for resource\-constrained environments
* Supports up to **128k context length**, allowing for comprehensive handling of complex queries
* Ideal for ultra\-low\-latency applications
* Outperforms many other models in its category


### Ministral 8B:

* With **8 billion parameters** and **128k context length**, it tends to deliver enhanced computational power for more demanding tasks
* Features a **sliding\-window attention** pattern for improved speed and memory efficiency
* Informed by a wide range of **multilingual** and **code** data, making it suitable for diverse applications
* Supports **function calling**
* Balances performance and efficiency for demanding applications
* Vocabulary size of **131k**, using the **V3\-Tekken** tokenizer
* Prompt Template:


```python
<s>[INST]user message[/INST]assistant response</s>[INST]new user message[/INST]
```

## Use Cases:

These models deliver compute\-efficient and low\-latency performance, making them ideal for the following scenarios:

* **On\-Device Translation**: Empowering users to communicate seamlessly across languages in real\-time, even in areas with less internet connectivity.
* **Internet\-less Smart Assistants**: Supporting intelligent virtual assistants that function independently of cloud connectivity, enhancing user experience in privacy\-sensitive environments.
* **Local Analytics**: Enabling organizations to analyze data in real\-time while maintaining strict privacy standards, which is essential in sectors such as healthcare and finance.
* **Autonomous Robotics**: Equipping robots with advanced language capabilities for autonomous decision\-making and communication, enhancing their operational efficiency in various industries.

In addition to their standalone capabilities, les Ministraux can work in conjunction with larger models like Mistral Large. This synergy allows them to serve as efficient intermediaries for **function\-calling in agentic workflows**, handling:

* **Input Parsing**: Quickly interpreting user input to ensure accurate responses.
* **Task Routing**: Directing requests to the appropriate resources based on user intent.
* **API Calls**: Executing API functions in real\-time, ensuring smooth interactions across various contexts.


## Code Usage (with vLLM):

The [Ministral\-8B\-Instruct\-2410](https://huggingface.co/mistralai/Ministral-8B-Instruct-2410) Language Model is an instruct fine\-tuned model that can be efficiently deployed using vLLM. You can find it [here](https://huggingface.co/mistralai/Ministral-8B-Instruct-2410) on Hugging Face. Here’s how you can get started:


### Installation

First, ensure you have the latest versions of vLLM and mistral\_common installed:


```python
pip install --upgrade vllm
pip install --upgrade mistral_common
```

> ***Note****: vLLM version 0\.6\.2 or higher is required.*


### Offline Usage with vLLM

Here’s an example of how to use Ministral\-8B in offline mode with vLLM:


```python
from vllm import LLM
from vllm.sampling_params import SamplingParams

model_name = "mistralai/Ministral-8B-Instruct-2410"
sampling_params = SamplingParams(max_tokens=8192)

llm = LLM(model=model_name, tokenizer_mode="mistral", config_format="mistral", load_format="mistral")

prompt = "What are the potential implications of artificial intelligence on the job market in the next decade?"
messages = [
    {
        "role": "user",
        "content": prompt
    },
]

outputs = llm.chat(messages, sampling_params=sampling_params)
print(outputs[0].outputs[0].text)
```

### Server Mode Inference with vLLM

In server inference mode, vLLM runs an HTTP server that concurrently handles client connections and requests via a REST API compatible with the OpenAI protocol. Here’s how to set it up:

* Start the server:


```python
vllm serve mistralai/Ministral-8B-Instruct-2410 --tokenizer_mode mistral --config_format mistral --load_format mistral
```
* Make requests to the server:


```python
curl --location 'http://localhost:8000/v1/chat/completions' \
    --header 'Content-Type: application/json' \
    --header 'Authorization: Bearer token' \
    --data '{
        "model": "mistralai/Ministral-8B-Instruct-2410",
        "messages": [
          {
            "role": "user",
            "content": "What are the potential implications of artificial intelligence on the job market in the next decade?"
          }
        ]
      }'
```

> Important Notes on vLLM Usage:

* Currently, vLLM is capped at a 32k context size due to limitations in implementing interleaved attention kernels for paged attention.
* To leverage the full 128k context size, it’s recommended to use [Mistral Inference](https://github.com/mistralai/mistral-inference).
* If you need to reduce GPU memory requirements, you can use tensor parallelism by adding `tensor_parallel=2` to the LLM initialization.

By following these examples, you can easily integrate Ministral\-8B into your projects using vLLM, whether you’re running offline inference or setting up a server for multiple clients. The model’s efficiency and powerful capabilities, combined with vLLM’s optimized inference, make it an excellent choice for a wide range of AI applications.


## Conclusion:

The release of Ministral marks a significant milestone in the evolution of AI. By bringing GPT\-level performance to edge devices, Mistral AI is not just pushing technological boundaries — they’re reimagining what’s possible with local, privacy\-first artificial intelligence.

As developers, researchers, and businesses begin to explore the capabilities of Ministral, we can expect to see a new wave of AI\-powered applications that are faster, more private, and more accessible than ever before. The age of edge AI is here, and Ministral is leading the charge.


