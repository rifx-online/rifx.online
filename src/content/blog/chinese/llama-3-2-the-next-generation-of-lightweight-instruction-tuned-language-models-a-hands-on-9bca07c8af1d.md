---
title: "Llama 3.2：下一代轻量级、指令调整语言模型：实践……"
meta_title: "Llama 3.2：下一代轻量级、指令调整语言模型：实践……"
description: "探索 LLaMA 3.2 在修剪、知识提炼和多语言性能方面的关键创新，以及运行的实践教程……"
date: 2024-11-10T03:51:17Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*BMalqlcJIFe50hidF4FnqQ.png"
categories: ["Natural Language Processing", "Machine Learning", "Generative AI"]
author: "Rifx.Online"
tags: ["LLaMA", "tuning", "pruning", "distillation", "multilingual"]
draft: False

---

### 探索 LLaMA 3\.2 在剪枝、知识蒸馏和多语言性能方面的关键创新，以及本地运行或通过 Google Colab 的实用教程

👨🏾‍💻 [GitHub](https://github.com/mdmonsurali) ⭐️ \| 👔[LinkedIn](https://www.linkedin.com/in/mdmonsurali/) \|📝 [Medium](https://medium.com/@monsuralirana)



## 介绍

语言模型持续发展，推动着效率、速度和多语言能力的边界。LLaMA 3\.2（轻量级LLaMA）代表了这一轨迹上的下一个突破，结合了剪枝、知识蒸馏和合成数据生成等创新。在Meta之前的创新基础上，LLaMA 3\.2在不牺牲速度、准确性或隐私的情况下，提高了较小模型（1B和3B参数）的性能。在这篇博客中，我们将探讨LLaMA 3\.2的关键技术进展，讨论其基准测试结果，并提供基于研究的视角，说明这些创新的重要性。最后，我们将通过一个实践教程，帮助您开始使用LangChain和Ollama部署LLaMA 3\.2。

## 1\. LLaMA模型的演变：从1\.0到3\.2

### LLaMA 模型的简史

**大型语言模型 Meta AI (LLaMA)** 系列自首次发布以来经历了显著的发展。Meta 的 **LLaMA 1\.0** 旨在使 LLM 的获取更加民主化，提供了比 GPT\-3 等模型更少参数的高性能模型，同时在各种任务中实现了类似的准确性。LLaMA 2\.0 引入了指令调优和多语言性能的改进。

**LLaMA 3\.2** 代表了下一个飞跃，重点关注以下核心领域：

* **指令调优和微调**：指令跟随能力的增强使模型在下游任务中的表现更佳。
* **边缘设备的效率**：修剪和蒸馏技术使模型能够在计算资源有限的设备上部署，例如智能手机，而不损失性能。
* **视觉和语言理解**：将视觉-语言模型集成到 LLaMA 3\.2 中，能够处理多模态任务，例如基于图像的问答。

## 2\. LLaMA 3\.2 的关键创新

### A. 指令调优与对齐

指令调优已被证明是提高大型语言模型（LLMs）遵循自然语言指令能力的关键因素。在 LLaMA 3.2 中，Meta 使用了 **监督微调（SFT）**、**拒绝采样（RS）** 和 **直接偏好优化（DPO）** 技术。这些技术被迭代应用于训练模型，以更高的准确性处理各种任务，如推理、摘要和工具使用。

* **监督微调（SFT）**：模型在人工标注的数据集上进行微调，从中学习生成更受欢迎的输出。
* **直接偏好优化（DPO）**：一种训练模型直接优化用户偏好的技术，使输出与人类期望更紧密对齐。

### B. 高效剪枝与知识蒸馏

LLaMA 3\.2 的轻量级模型，如 1B 和 3B 参数模型，利用 **结构化剪枝** 和 **知识蒸馏**。这些技术在减小模型体积的同时，保留了来自更大模型（例如 LLaMA 3\.1 8B 和 70B）的大量知识：

* **结构化剪枝**：在这种方法中，系统性地移除网络中重要性较低的部分，以创建更小的模型，同时保持准确性。
* **知识蒸馏**：一个大型模型（教师）将知识转移到一个较小的模型（学生），使得较小的模型在训练期间能够模仿较大模型的性能。

### C. 扩展上下文长度

LLaMA 3\.2 的一个主要更新是其处理更长上下文长度的能力——最多可达 **128K tokens**。这使其在处理需要处理大量文本的任务时非常高效，例如摘要、长文档分析和多轮对话。

### D. 视觉-语言模型

Meta 在 LLaMA 3.2 中引入的 **视觉-语言模型 (VLMs)** 开辟了多模态任务的新领域。这些模型旨在处理文本和图像，使其在文档问答、科学图表解释和图像描述等应用中非常有效。

## 3\. 基准性能：LLaMA 3\.2 如何比较？

LLaMA 3\.2 在广泛的基准测试中进行了严格评估，如您所分享的表格所示。主要亮点包括：

* **一般任务**：3B 模型在 **MMLU** (63\.4) 和 **IFEval** (77\.4) 等基准测试中表现出色，显示出卓越的指令遵循和推理能力。
* **工具使用**：在 **BFCL V2** 等任务中，LLaMA 3\.2 (3B) 得分 67\.0，超越了 **Gemma 2** 和 **Phi\-3\.5\-mini** 等竞争对手，在遵循与工具使用相关的复杂指令方面表现更佳。
* **数学和推理**：3B 模型在与数学相关的任务中表现强劲，在 **GSM8K** (小学数学) 中得分 **77\.7**，在 **ARC Challenge** 中得分 **78\.6**，该基准专注于推理。
* **多语言生成**：3B 模型在多语言 MGSM 基准中也表现优异，展示了其在多种语言中生成连贯文本的能力。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*lpjDJ6AaRnljLwAxtAf-Ag.png)

LLaMA 3\.2 在这些任务中的优势表明，它为涉及自然语言理解、指令遵循和推理的任务提供了强有力的解决方案，适用于一般和多语言环境。

## 4\. 实践教程：使用 LangChain 和 Ollama 在本地运行 LLaMA 3\.2

现在我们已经探讨了 LLaMA 3\.2 的技术进展，让我们通过逐步指南在本地使用 **LangChain** 和 **Ollama** 进行实践。我们可以在本地机器或 Google Colab 终端上安装它。只需按照以下步骤操作：

### 步骤 1：安装所需的库

首先，在您的 Python 环境中安装所需的库。运行以下命令以设置 LangChain 和 Ollama：

```python
!pip install langchain
!pip install -U langchain-community
!pip install langchain_ollama
```

### 第2步：安装并加载 Colab\-XTerm

Colab\-XTerm 是一个方便的包，可以在 Colab 笔记本中启用终端访问。这对于直接在笔记本环境中运行 shell 命令非常有用。要安装它，请运行以下命令：

```python
!pip install colab-xterm
%load_ext colabxterm
```

### 第 3 步：安装 Ollama

您可以通过运行以下命令打开终端会话：

```python
%xterm
```

在终端中，运行以下命令以安装 Ollama：

```python
curl -fsSL https://ollama.com/install.sh | sh
```

```python
ollama serve
```

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*itAzyQHMHhin8b7bRLc09w.png)

### 第4步：拉取模型

安装完Ollama后，您可以拉取所需的模型。Ollama提供了多个LLM，包括Llama 3\.2\. 以下是拉取它们的方法：

```python
ollama pull llama3.2
```

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*S3R4gByToCZXKEWBh4GWaQ.png)

上述命令将下载并准备模型以供在您的Colab环境中使用。

或者，拉取Ollama中可用的任何LLM模型。所有LLM模型列表和详细信息可在此查看：[https://ollama.com/library](https://ollama.com/library)

### 第5步：将LLaMA 3\.2与LangChain集成

LangChain使得调用LLaMA 3\.2进行各种NLP任务变得简单。以下是测试模型的简单脚本：

```python
from langchain_community.llms import Ollama

## Initialize an instance of the Llama 3.1 model
llm_llama = Ollama(model="llama3.2")

## Invoke the model to generate a response
response = llm_llama.invoke("Tell me a joke")
print(response)
```

输出：

```python
Here's one:

What do you call a fake noodle?

An impasta.
```

### 第6步：尝试不同的任务

您可以将其扩展到更复杂的任务，如摘要、 multilingual translation 和推理：

```python
## Summarization
response = llm_llama.invoke("Summarize the following text: 'LLaMA 3.2 represents a major step forward in AI development...'")
print(response)

## Multilingual Generation
response = llm_llama.invoke("Translate the following into French: 'What are the major improvements in LLaMA 3.2?'")
print(response)
```

输出：

```python
Quantum Mechanics is a complex and fascinating subject, but I'll try to break it down in simple terms.

**The Basics**

Imagine you have a coin. Heads or tails, right? In classical physics (the way things work today), the coin is either one or the other - heads or tails. It's like a definite choice.

In Quantum Mechanics, however, the coin isn't quite so simple. When you flip it, it doesn't just land on heads or tails; it exists in both states at the same time! This idea might sound crazy, but that's basically what happens with tiny particles like atoms and electrons.

**Wave-Particle Duality**

Here's a key concept: tiny particles can behave like both waves and particles. It sounds weird, but think of it like this:

* Imagine a wave in the ocean. The water molecules are moving up and down, creating ripples.
* Now imagine a single water molecule as a particle (a tiny ball). That's what quantum mechanics says these particles can be!

**Superposition**

Another mind-bending idea is superposition. It means that tiny particles can exist in multiple states at the same time. Think of it like this:

* Imagine a coin that's both heads AND tails simultaneously!
* This happens with electrons, which can spin both clockwise and counterclockwise at the same time.

**Entanglement**

Quantum Mechanics also introduces entanglement. When two particles interact, they become "connected" in such a way that what happens to one particle instantly affects the other, no matter how far apart they are!

* Imagine two dancers who are perfectly synchronized, even if they're on opposite sides of the stage.
* This is basically entanglement: two particles can be connected in a similar way.

**The Weird Stuff**

Now we get to some really weird and interesting aspects of quantum mechanics:

* **Uncertainty Principle**: You can't know both the position AND momentum of a particle at the same time!
* **Quantum Tunneling**: Particles can pass through solid objects, which is weird because they shouldn't be able to fit through.
* **Schrödinger's Cat**: Imagine a cat in a box with a radioactive atom. If the atom decays, the cat dies. But according to quantum mechanics, the cat is BOTH alive AND dead until someone opens the box and observes it!

**In a Nutshell**

Quantum Mechanics is all about tiny particles behaving in strange and fascinating ways. It's like they're playing by their own rules, which can lead to some pretty wild and unpredictable outcomes.

While this explanation is simplified, it should give you an idea of how quantum mechanics works and its weird and wonderful principles!
```

输出：

```python
The translation of "What are the major improvements in LLaMA 3.2?" into French is:

"Quels sont les améliorations majeures de LLaMA 3.2?"

Here's a breakdown of the translation:

- "What" becomes "Quels"
- "are" becomes "sont"
- "the" becomes "les"
- "major improvements" become "améliorations majeures"
- "in" becomes "sont"
- "LLaMA 3.2" remains the same, as it's a proper noun.

Note: The phrase "majeures" is used to describe significant or substantial improvements.
```

> **获取 GitHub 代码：**

## 结论

LLaMA 3\.2 是一个多功能且高效的模型，在多种自然语言处理任务中表现出色，从多语言文本生成到实用工具使用。它在剪枝和知识蒸馏方面的创新确保了它在轻量级、资源受限环境中仍能保持顶级性能。通过本教程，您可以快速将 LLaMA 3\.2 集成到本地应用程序或通过 Google Colab 等云服务中。

通过解锁 LLaMA 3\.2 的能力，开发者可以创建前沿的应用程序，这些应用不仅快速、响应灵敏，而且注重隐私，确保用户数据保留在设备上。无论您是在探索自然语言处理还是构建实际应用，LLaMA 3\.2 都为轻量级、指令调优的语言模型设定了新的基准。

欢迎您探索 Ollama 库中的其他模型，并尝试不同的任务。可能性是无穷无尽的！


