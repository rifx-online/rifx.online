---
title: "认识 Ministral 3B 和 8B：边缘 AI 游戏规则改变者"
meta_title: "认识 Ministral 3B 和 8B：边缘 AI 游戏规则改变者"
description: "Mistral AI 在边缘 AI 和设备计算领域的新前沿"
date: 2024-10-31T08:38:17Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*3CmWlEiW7ea8gtqxpI83_w.png"
categories: ["Technology", "Autonomous Systems", "Data Science"]
author: "Rifx.Online"
tags: ["Mistral", "edge", "computing", "translation", "robotics"]
draft: False

---



### Mistral AI在边缘AI和设备计算的新前沿

在快速发展的AI领域，边缘计算变得越来越重要，适用于那些需要低延迟、以隐私为首的高效推理的应用，而不依赖于基于云的基础设施。

**Mistral AI**最新推出的[**Ministral**](https://mistral.ai/news/ministraux/)模型家族，标志着AI领域的一次突破性进展。

为庆祝其开创性的**Mistral 7B**模型发布一周年，Mistral AI推出了下一代语言模型：**Ministral 3B**和**Ministral 8B**，统称为“[**les Ministraux**](https://mistral.ai/news/ministraux/)”。这些模型不仅仅是渐进式的改进；它们代表了边缘AI可能性的重大飞跃。



## 为什么这些模型很重要？

边缘人工智能的核心在于在本地执行复杂计算，确保数据隐私并减少响应时间。通过 **Ministral 3B** 和 **Ministral 8B**，Mistral AI 提供了将高计算能力与内存效率相结合的模型，所有这些都可以直接在设备上运行。这些模型旨在为无法承受延迟或依赖云连接的应用程序提供实时洞察。

## 主要特点：

1. **最先进的性能**：在知识、常识、推理、原生函数调用和小于10B类别的效率等不同任务中超越现有模型。
2. **大上下文窗口**：支持最多128k的上下文长度，实现更全面的理解和生成。
3. **高效架构**：Ministral 8B采用特殊的交错滑动窗口注意力模式，实现更快和更节省内存的推理。
4. **多功能性**：适用于广泛的应用，从设备内翻译到自主机器人。
5. **隐私优先设计**：为本地推理而构建，这些模型非常适合优先考虑数据隐私的应用，消除了对持续云访问的需求。
6. **可扩展性**：无论是需要Ministral 3B的低功耗消耗的小型设备，还是需要8B变体的更大能力，这两种模型都足够灵活，可以适应各种用例。

> 有关基准测试结果，请参阅 [这里](https://mistral.ai/news/ministraux/)

## 分析模型：

### Ministral 3B:

* 仅凭 **30亿个参数**，为资源受限的环境提供了平衡的解决方案
* 支持最高 **128k 上下文长度**，可以全面处理复杂查询
* 适用于超低延迟应用
* 在同类模型中表现优于许多其他模型

### Ministral 8B:

* 具有 **80亿参数** 和 **128k上下文长度**，在处理更复杂的任务时能够提供增强的计算能力
* 采用 **滑动窗口注意力** 模式，提高速度和内存效率
* 基于广泛的 **多语言** 和 **代码** 数据，使其适用于多种应用
* 支持 **函数调用**
* 在高要求的应用中平衡性能和效率
* 词汇量为 **131k**，使用 **V3-Tekken** 分词器
* 提示模板：


```python
<s>[INST]user message[/INST]assistant response</s>[INST]new user message[/INST]
```

## 用例：

这些模型提供了计算高效和低延迟的性能，使其非常适合以下场景：

* **设备端翻译**：使用户能够在实时中无缝沟通跨语言，即使在网络连接较差的地区。
* **无网络智能助手**：支持独立于云连接运行的智能虚拟助手，增强隐私敏感环境中的用户体验。
* **本地分析**：使组织能够实时分析数据，同时保持严格的隐私标准，这在医疗和金融等行业至关重要。
* **自主机器人**：为机器人配备先进的语言能力，以实现自主决策和沟通，提高它们在各个行业的运营效率。

除了其独立的能力外，les Ministraux 还可以与更大的模型如 Mistral Large 协同工作。这种协同使它们能够作为 **在代理工作流中进行函数调用的高效中介**，处理：

* **输入解析**：快速解释用户输入，以确保准确响应。
* **任务路由**：根据用户意图将请求指向适当的资源。
* **API 调用**：实时执行 API 功能，确保在各种上下文中顺畅互动。

## 代码使用（与 vLLM 一起）：

[Ministral\-8B\-Instruct\-2410](https://huggingface.co/mistralai/Ministral-8B-Instruct-2410) 语言模型是一个经过指令微调的模型，可以使用 vLLM 高效部署。您可以在 Hugging Face 上 [这里](https://huggingface.co/mistralai/Ministral-8B-Instruct-2410) 找到它。以下是您可以开始的方式：

### 安装

首先，确保您已安装最新版本的 vLLM 和 mistral\_common：


```python
pip install --upgrade vllm
pip install --upgrade mistral_common
```

> ***注意****：需要 vLLM 版本 0\.6\.2 或更高版本。*

### 离线使用 vLLM

以下是如何在离线模式下使用 Ministral\-8B 和 vLLM 的示例：


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

### 服务器模式推理与 vLLM

在服务器推理模式下，vLLM 运行一个 HTTP 服务器，能够通过与 OpenAI 协议兼容的 REST API 同时处理客户端连接和请求。以下是设置方法：

* 启动服务器：

```python
vllm serve mistralai/Ministral-8B-Instruct-2410 --tokenizer_mode mistral --config_format mistral --load_format mistral
```
* 向服务器发送请求：

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

> 关于 vLLM 使用的重要说明：

* 目前，由于在实现分页注意力的交错注意力内核方面的限制，vLLM 的上下文大小限制为 32k。
* 为了利用完整的 128k 上下文大小，建议使用 [Mistral Inference](https://github.com/mistralai/mistral-inference)。
* 如果您需要减少 GPU 内存需求，可以通过在 LLM 初始化时添加 `tensor_parallel=2` 来使用张量并行。

通过遵循这些示例，您可以轻松地将 Ministral\-8B 集成到您的项目中，无论您是在离线推理还是为多个客户端设置服务器。该模型的高效性和强大功能，加上 vLLM 的优化推理，使其成为各种 AI 应用的优秀选择。

## 结论：

Ministral的发布标志着人工智能发展中的一个重要里程碑。通过将GPT级别的性能带到边缘设备，Mistral AI不仅在推动技术边界——他们还在重新构想以本地、隐私优先的人工智能为基础的可能性。

随着开发者、研究人员和企业开始探索Ministral的能力，我们可以期待看到一波新的人工智能驱动的应用程序，这些应用程序比以往更加快速、更具隐私性和更易于获取。边缘人工智能的时代已经到来，而Ministral正在引领这一潮流。

