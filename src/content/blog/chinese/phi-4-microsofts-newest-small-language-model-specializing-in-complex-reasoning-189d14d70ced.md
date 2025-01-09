---
title: "Phi-4：微软最新的小语言模型，专门用于复杂推理"
meta_title: "Phi-4：微软最新的小语言模型，专门用于复杂推理"
description: "微软最新推出的Phi-4是一款小型语言模型，专注于复杂推理任务，具备高效、资源友好的特点。它在逻辑推理和上下文理解等方面表现优异，适用于教育、医疗、法律和财务等多个行业。Phi-4的紧凑架构使其可在资源有限的设备上运行，同时提供可定制性，便于针对特定领域进行微调。此外，Phi-4支持在本地和Azure AI Foundry上部署，为用户提供灵活的应用选择。"
date: 2025-01-09T01:52:31Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*o8HPziDLRELkcmNAQdFACw.png"
categories: ["Natural Language Processing", "Machine Learning", "Data Science"]
author: "Rifx.Online"
tags: ["Phi-4", "reasoning", "compact", "customization", "deployment"]
draft: False

---



### Phi\-4: 一款重新定义现实世界应用的紧凑型强大AI推理模型



微软的Phi\-4在小型语言模型领域代表了一项显著的进步，能够在复杂推理任务中表现出色，同时保持紧凑高效的架构。与其更大型的同行不同，Phi\-4专注于为那些需要高级问题解决能力的用例提供精确、细致的输出，而不会对计算资源造成过大压力。

本博客将探讨Phi\-4的架构、基准测试、实际应用，以及在本地或Azure AI Foundry上部署的逐步指南。无论您是AI爱好者还是希望利用尖端技术的开发者，本指南将提供您所需的所有见解。

## 为什么选择 Phi\-4？

Phi\-4 在效率和智能之间架起了桥梁。它的体积更小，使其具有：

* **资源友好**：适合在计算能力有限的设备上部署。
* **高度专业化**：旨在在需要逻辑推理和上下文理解的任务中表现出色。
* **多功能**：可适应各个行业，从金融到医疗和教育。

基准测试显示，Phi\-4 在以下任务中优于同类模型：

* 逻辑推理
* 多跳推理
* 上下文理解

例如，在最近的一项基准测试中，Phi\-4 与其他模型进行了比较：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*DeQ7W7WPez48_YlBrVHatA.png)

Phi\-4 的卓越准确性和较低的内存占用使其成为一个杰出的选择。

## Phi\-4的关键特性

### 1\. 高级推理

Phi\-4 采用了增强的注意力机制，使其能够处理：

* 复杂的逻辑链。
* 多层次的上下文问题。

### 2\. 紧凑尺寸

在不到1GB的模型权重下，Phi\-4可以在资源有限的设备上运行，而不牺牲性能。

### 3\. 可定制性

对 Phi\-4 进行微调以适应特定领域的任务非常简单，使其成为以下应用的理想选择：

* 财务预测。
* 法律文件分析。
* 学术研究支持。

## 开始使用 Phi\-4

### 在本地运行 Phi\-4

您可以使用微软的开源实现，在本地笔记本电脑上运行 Phi\-4。以下是步骤：

### 第一步：系统要求

* **操作系统**：Windows 10/11、macOS 或 Linux
* **内存**：最低 8GB（推荐 16GB）
* **Python**：版本 3\.8 或更高

### 第2步：Ollama安装

Ollama的安装过程简单明了，支持包括macOS、Windows和Linux在内的多种操作系统，以及Docker环境，确保了广泛的可用性和灵活性。以下是Windows和macOS平台的安装指南。

您可以从官方网站或GitHub获取安装包：

* [从Ollama官方网站下载](https://ollama.com/download)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*dNxS9ommXn92jlIQ.png)

Ollama下载页面截图

* [从Ollama GitHub发布页面下载](https://github.com/ollama/ollama/releases)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*2zYp3PWqq_PJFRS8nhNorQ.png)

### 在 Windows 上安装 Ollama

在这里，我们从 Ollama 官方网站下载安装程序： <https://ollama.com/download/OllamaSetup.exe>

运行安装程序并点击 `Install`

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*0Y-CutLv-_-2NI5z.png)

点击 `Install`

安装程序将自动执行安装任务，请耐心等待。一旦安装过程完成，安装程序窗口将自动关闭。如果您没有看到任何内容，请不要担心，因为 Ollama 现在在后台运行，可以在任务栏右侧的系统托盘中找到。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*8dtF3IZVtAHxNpHrc2-IDA.png)

通过 REST API 或 Python 客户端本地访问模型。示例 Python 代码：

### 第3步：下载Phi\-4Mini模型

安装Ollama后，您需要下载Phi\-3\.5迷你模型。您可以通过运行以下命令来完成此操作：

```python
ollama pull vanilj/Phi-4
```

### 第4步：运行模型

下载模型后，您可以使用以下命令运行它：

```python
ollama run vanilj/Phi-4
```
此命令将启动模型并使其准备好进行推理。

### 第5步：使用模型

您现在可以将模型用于各种任务。例如，要根据提示生成文本，您可以使用：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Mc_u6fLOIomjTnC6lDSqWA.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*XglyRx9ewMjH7djt)

## 可视化 Phi\-4 的影响

*Phi\-4 在数学竞赛问题上的表现*

在数学竞赛问题上，Phi\-4 的表现超过了包括 Gemini Pro 1\.5 在内的更大模型。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*XaKRLEQOtFF08adP)

在数学竞赛问题上，Phi\-4 的表现超过了包括 Gemini Pro 1\.5 在内的更大模型 (https://maa.org/student\-programs/amc/)

要查看更多基准测试，请阅读最新发布的技术论文 [arxiv](https://arxiv.org/abs/2412.08905)。

## 在 Azure AI Foundry 上部署 Phi\-4

Azure AI Foundry 提供无缝集成，以便在生产环境中部署 Phi\-4

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*y2cVJRN2PI2XYOYDD7T5cA.png)

## 真实世界应用

### 1\. 教育

Phi\-4 通过解决 STEM 学科中的复杂问题，实现个性化辅导。

### 2\. 医疗保健

支持医疗专业人员分析患者数据并生成洞察。

### 3\. 法律分析

帮助律师起草合同并通过精确的推理分析法律文件。

### 4\. 财务

增强财务建模和风险分析，确保准确的预测。

## 安全且负责任地推动AI创新

负责任地构建AI解决方案是微软AI开发的核心。我们已经将强大的负责任AI能力提供给使用Phi模型的客户，[包括针对Windows Copilot\+ PC优化的Phi\-3\.5\-mini](https://blogs.windows.com/windowsexperience/2024/12/06/phi-silica-small-but-mighty-on-device-slm/)。

[Azure AI Foundry](http://ai.azure.com/)为用户提供了一套强大的能力，帮助组织在传统机器学习和生成AI应用的AI开发生命周期中衡量、缓解和管理AI风险。[Azure AI Foundry中的AI评估](https://learn.microsoft.com/en-us/azure/ai-studio/how-to/evaluate-generative-ai-app)使开发人员能够使用内置和自定义指标迭代评估模型和应用的质量与安全，以指导缓解措施。

此外，Phi用户可以使用[Azure AI内容安全](https://learn.microsoft.com/en-us/azure/ai-services/content-safety/overview)功能，如提示保护、受保护材料检测和基础性检测。这些能力可以作为内容过滤器与我们[模型目录](https://ai.azure.com/explore/models)中包含的任何语言模型一起使用，开发人员可以通过单个API轻松将这些能力集成到他们的应用中。一旦投入生产，开发人员可以监控他们的应用质量与安全、对抗性提示攻击和数据完整性，借助实时警报及时进行干预。 

```
## Sample code block
print("Hello, World!")
```

## 结论

Phi\-4 是微软在推动人工智能能力方面的承诺的证明，同时确保可访问性和效率。凭借其紧凑的架构和强大的推理能力，Phi\-4 将重新定义小型语言模型在各个行业中的应用。

无论您是在本地部署还是在 Azure AI Foundry 上扩展，Phi\-4 都提供无与伦比的灵活性和性能。今天就尝试一下，亲身体验人工智能驱动的推理的未来。

## 参考文献

\[1] [微软AI博客](https://techcommunity.microsoft.com/blog/aiplatformblog/introducing-phi-4-microsoft%E2%80%99s-newest-small-language-model-specializing-in-comple/4357090)

## 感谢您！


> 感谢您抽出时间阅读我的故事！如果您喜欢并觉得它有价值，请考虑为我点赞（或者50个！）以表示支持。您的点赞帮助其他人发现这些内容，并激励我继续创作更多。

> 另外，不要忘记关注我，以获取更多关于人工智能的见解和更新。您的支持对我意义重大，帮助我继续与您分享有价值的内容。谢谢！

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*QGVzMaKoWp9alv1a.png)

这个故事发布在 [Generative AI](https://generativeai.pub/)。与我们在 [LinkedIn](https://www.linkedin.com/company/generative-ai-publication) 上连接，并关注 [Zeniteq](https://www.zeniteq.com/)，以了解最新的人工智能故事。

订阅我们的 [newsletter](https://www.generativeaipub.com/) 和 [YouTube](https://www.youtube.com/@generativeaipub) 频道，以获取关于生成性人工智能的最新新闻和更新。让我们一起塑造人工智能的未来！

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*RqwxqkTvTXII0Zep.png)

