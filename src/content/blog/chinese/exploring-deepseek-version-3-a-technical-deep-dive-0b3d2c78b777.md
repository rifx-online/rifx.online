---
title: "探索 DeepSeek 第 3 版：技术概览"
meta_title: "探索 DeepSeek 第 3 版：技术概览"
description: "DeepSeek V3 是一款由中国开发的先进开放权重大型语言模型，采用专家混合架构，拥有6710亿参数，动态激活370亿参数以优化性能。其创新技术包括多头潜在注意力、FP8混合精度和多标记预测，显著提升了效率和准确性。DeepSeek V3 在多个基准测试中超越了GPT-4o等模型，且API定价低于竞争对手，促进了AI应用的普及。该模型的发布对人工智能行业具有重要影响，推动了成本降低、开源进展和全球竞争。"
date: 2025-01-09T01:48:27Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*gPgpbVse3Q_KC3kmMpEFrg.png"
categories: ["Programming", "Machine Learning", "Natural Language Processing"]
author: "Rifx.Online"
tags: ["DeepSeek", "MoE", "MLA", "FP8", "multi-token"]
draft: False

---



DeepSeek 版本 3 的发布在 AI 社区引发了相当大的兴奋，得益于其卓越的能力和成本效益。作为一个在中国开发的先进开放权重大型语言模型 (LLM)，它利用专家混合 (MoE) 架构来优化性能，在处理过程中仅激活其 6710 亿参数中的 370 亿。多头潜在注意力 (MLA)、FP8 混合精度和多令牌预测等创新进一步提升了其效率和有效性。DeepSeek V3 在 MMLU-Pro、MATH 500 和 Codeforces 等关键基准测试中表现优于 GPT-4o 等模型。此外，其具有成本效益的 API 定价使其高度可及，促进了创新并扩大了 AI 应用的覆盖范围。



## 1\. DeepSeek V3 概述

DeepSeek V3 是一个开放权重的大型语言模型，采用 **Mixture of Experts (MoE)** 架构，这是一种旨在提高效率和性能的前沿方法。MoE 框架使用多个专门的“专家”或较小的模型，每个模型都针对特定任务进行了优化。这种模块化设计使模型在处理过程中能够动态激活仅相关的参数子集，显著降低计算开销，同时保持高准确性和适应性。

DeepSeek V3 拥有 **6710 亿参数**，是同类模型中最大的之一。然而，在进行标记处理时，仅 **370 亿参数** 被积极使用，确保了资源的最佳利用和能效。该模型在一个包含 **14.8 万亿标记** 的广泛数据集上进行了训练，相当于大约 **11.1 万亿词**。这个庞大而多样的数据集使 DeepSeek V3 能够在自然语言处理到复杂推理和问题解决等广泛任务中实现强大的泛化能力。

### 1\.1 训练效率和稳定性

DeepSeek V3 的训练过程既高效又经济。利用 **2,048 GPUs** 进行了为期两个月的训练，总成本约为 **$6 million**。与其他大型模型相比，这一成本显著降低，后者通常需要接近 16,000 GPUs 的集群来完成类似任务。例如，LLaMA 3 模型消耗了 3000 万 GPU 小时，而 DeepSeek V3 仅用 **2\.8 million GPU hours** 就达到了可比的能力。这一卓越的效率证明了该模型先进的架构设计和优化技术。

### 1\.2 DeepSeek\-V3背后的公司

DeepSeek.ai 于2023年7月17日由著名的量化资产管理公司 Phantom Quant 成立。Phantom Quant 的创始人梁文峰为公司带来了在量化投资和高性能计算方面的深厚专业知识。在成立仅六个月内，DeepSeek.ai 发布了其第一代大型模型 DeepSeek Coder。到2024年5月，公司推出了第二代开源 MoE 模型 DeepSeek\-V2，该模型因其在中文综合能力评估中的卓越表现和极低的推理成本而引起了业界的广泛关注。

## 2\. 关键技术创新

### 2\.1 多头潜在注意力（MLA）

DeepSeek\-V3 引入了 MLA 架构来优化注意力机制。MLA 通过将注意力键和值压缩到低维空间，在推理过程中减少了 Key\-Value (KV) 缓存。这是通过下投影和上投影矩阵实现的，显著降低了内存使用，同时保持与标准多头注意力（MHA）相当的性能。此外，MLA 应用旋转位置嵌入（RoPE）来增强位置信息。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*-DMAvZBrsSPeIGA6.png)

对于前馈网络（FFN），DeepSeek\-V3 采用了 DeepSeekMoE 架构，该架构使用更细粒度的专家，并将一些专家隔离为共享专家。模型通过结合共享专家和路由专家来计算 FFN 输出，路由专家根据令牌与专家的亲和得分进行选择。DeepSeek\-V3 使用 sigmoid 函数进行亲和得分计算，并对选定的得分进行归一化，以生成门控值，确保在没有辅助损失的情况下实现平衡的专家利用。

### 2\.2 FP8 混合精度

DeepSeek V3 的一项突出创新是其在 **FP8 混合精度** 下的训练。这种方法证明可以使用 8 位浮点精度训练如此规模的模型，这在计算效率上是一个重大突破。DeepSeek 团队必须开发创新的负载均衡策略和算法改进，以克服 H800 GPU 带来的计算限制。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*sEGt-FwFbaYAA7FX.png)

### 2\.3 多标记预测

DeepSeek V3 采用多标记预测，这是一种增强模型生成连贯且上下文相关输出能力的技术。此功能对于需要理解和生成复杂标记序列的任务特别有益。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*1qaIFO82ezyQkCfV.png)

### 2\.4 后训练增强

**DeepSeek V3 融合了来自 DeepSeek R1 的知识蒸馏，后者是一种以推理能力著称的模型。** 这个过程涉及使用 DeepSeek R1 生成的合成数据来增强 DeepSeek V3 的推理性能。该流程优雅地将 R1 的验证和反思模式融入 V3，提高了其推理性能，同时保持对输出风格和长度的控制。这种创新的方法论使 DeepSeek V3 能够受益于 DeepSeek R1 的先进推理能力，即使它本身并不是一个推理模型。

## 3\. 性能基准

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*kJHcR1rKHMh2XtxFGyJaBw.png)

DeepSeek V3 已经与多个其他模型进行了基准测试，包括 LLaMA\-3\.1–405B 和 GPT\-4o\-0513\. 结果令人印象深刻：

* **MMLU\-Pro:** DeepSeek V3 超越了 LLaMA\-3\.1–405B 和 GPT\-4o，展现出卓越的语言理解能力。
* **GPQA\-Diamond**: DeepSeek V3 在一般问答任务中表现优异。
* **MATH 500**: DeepSeek V3 在数学推理任务中表现出色，准确率达到 90\.2%，而 GPT\-4o 为 74\.6%，Claude 3\.5 Sonnet 为 78\.3%。
* **AIME 2024:** 专注于高级数学竞赛问题。DeepSeek V3 的准确率接近 40%，而 GPT\-4 为 9%，Claude 3\.5 Sonnet 为 16%。
* **Codeforces**: DeepSeek V3 在代码相关任务中表现尤为出色，准确率为 51\.6%，而 GPT\-4o 和 Claude 3\.5 Sonnet 约为 20%。
* **SWE Bench**: DeepSeek V3 在实际软件任务中具有竞争力，表现优于大多数其他模型，仅次于 Claude 3\.5 Sonnet。

总体而言，DeepSeek V3 在各个基准测试中的表现令人印象深刻。在多个指标上，它与 Claude\-3\.5 Sonnet 非常接近，甚至在编码任务中超越了它。另一项评估显示，DeepSeek V3 在 Aider polyglot 基准测试中超越了 Claude\-3\.5 Sonnet，展示了其处理多语言任务的能力。该模型的推理能力尤其值得注意，堪比像 GPT\-o1 这样的专业推理模型。这一表现证明了该模型的强大训练和创新的架构特性。

## 4\. 成本效率

DeepSeek V3 的成本效率是另一个主要优势。DeepSeek V3 的 API 定价显著低于 GPT\-4o 和 Claude 3\.5 Sonnet：

* 输入：DeepSeek V3 为每百万个令牌 $0\.27，而 Claude 3\.5 Sonnet 为每百万个令牌 $3，GPT\-4o 为 $2\.50。
* 输出：DeepSeek V3 为每百万个令牌 $0\.11，而 Claude 3\.5 Sonnet 为每百万个令牌 $15，GPT\-4o 为 $10。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*LRJwjl5mVz3IF-M9.jpeg)

这使得 DeepSeek V3 成为开发者在更低成本下将先进 AI 功能集成到其应用程序中的一个有吸引力的选择。定价模型使得 AI 解决方案更加经济实惠和可及，尤其是对于初创企业和小型企业。

## 5\. 实际应用

DeepSeek V3 已集成到像 VectorShift 这样的无代码 AI 自动化平台中。此集成使用户能够为各种任务创建强大的 AI 代理，例如关键词研究、博客文章生成和竞争分析。该平台提供了一系列模板和集成，便于部署自定义 AI 解决方案。例如，用户可以创建聊天机器人、自动生成内容，甚至与 Google Drive 和 Google Docs 集成以实现高级工作流程。该平台还支持语音命令和自定义选项，提供量身定制的用户体验。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ZOZ8DpWEvuYqXglK1XwYtg.png)

您可以在 [**deepseek.com**](https://www.deepseek.com/) 评估 DeepSeek V3 的有效性，该网站提供各种探索渠道，如 **DeepSeek Chat**、**API 集成**和 **本地部署**。

### 5\.1 DeepSeek Chat

[DeepSeek Chat](https://chat.deepseek.com/) 提供了一个用户友好的界面，以便与模型进行交互。其实时响应能力尤为令人印象深刻。例如，当被要求生成一个 HTML 脚本以创建数字时钟效果时，模型几乎瞬间提供了一个可行的解决方案。生成的代码，包括一个 RoundHTML 组件，既高效又美观。这展示了模型轻松处理复杂编程任务的能力。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*_w_L7zWsCelGWtsOJGVBpA.png)

* **DeepThink 模式**：DeepSeek Chat 具有 **思考模式**，类似于 Gemini 2\.0 Flash，允许用户观察模型的推理过程。在测试一个高考数学问题时，DeepSeek V3 提供了详细且准确的解决方案，附带逐步推理。这一功能对教育目的至关重要，使学生能够理解复杂的解题方法。
* **搜索模式**：DeepSeek Chat 还提供 **网络搜索** 功能，进一步增强了 Chat 的实用性，通过整合实时网络数据。例如，查询最新的英超联赛排名得到了最新的结果，并附带分析和源数据的引用。这一能力将模型的知识基础扩展到整个互联网，使其成为一个强大的信息检索工具。

### 5\.2 API 集成

DeepSeek V3 的 API 兼容 **OpenAI API 规范**，便于与第三方应用程序无缝集成。使用 **Chatolama**，我们演示了如何配置和部署 DeepSync Chat 模型。该 API 支持多个模型，包括 **DeepSync Chat** 和 **DeepSync Coder**，使开发人员能够轻松利用最新版本的模型。

* 在一个实际示例中，我们请求模型生成一个数字时钟的 **View 组件**。模型迅速提供了一个功能实现，可以直接在 Chatolama 中预览。这展示了模型在生成代码和视觉组件方面的多功能性。该 API 还支持 **批处理** 和 **异步请求**，使其适合大规模应用程序。

### 5\.3 本地部署

对于需要本地部署的用户，DeepSeek V3 提供了关于 **HuggingFace** 的全面文档。该模型可以使用 **AMD Deploy** 和 **vLLM** 等工具进行部署，使用户能够在自己的服务器资源上运行。部署过程经过简化，详细指南涵盖了 **安装**、**配置** 和 **优化**。例如，**AMD Deploy** 工具支持 **分布式训练** 和 **推理**，允许用户根据需求扩展模型。由于资源限制，本文未包含实时演示，但提供的指南使感兴趣的用户能够轻松进行本地部署。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*OYPf_HAnnHWz9qdvgkAzuQ.png)

## 6\. 对人工智能行业的影响

DeepSeek V3 的发布对人工智能行业产生了几方面的影响：

1. **成本降低**：训练成本和计算需求的显著降低挑战了现状，使先进的人工智能模型更加可及。这可能导致人工智能的民主化，较小的公司和个人可以开发和部署复杂的模型。
2. **开源进展**：DeepSeek V3 的开源特性鼓励创新和竞争，推动行业发展。开源模型允许社区贡献、快速迭代和持续改进，惠及整个人工智能生态系统。
3. **全球竞争**：DeepSeek V3 的成功突显了美国和中国在人工智能竞赛中的日益竞争，中国在人工智能芯片出口管制的情况下仍显示出显著进展。这种竞争可能会进一步推动全球人工智能技术的创新和投资。

## 7\. 结论

DeepSeek V3 代表了大型语言模型（LLMs）发展的重要一步。其成本效益、训练稳定性和令人印象深刻的性能基准使其成为人工智能领域的强大竞争者。随着行业的不断发展，像 DeepSeek V3 这样的模型将在推动创新和可及性方面发挥关键作用。

要进一步探索，开发者可以在 [chat.deepseek.com](http://chat.deepseek.com/) 测试 DeepSeek V3，并使用 VectorShift 等平台将其集成到他们的项目中。人工智能的未来是光明的，而 DeepSeek V3 则证明了该领域快速发展的进步。

