---
title: "DeepSeek V3：超越竞争对手的开源大语言模型技术解析"
meta_title: "DeepSeek V3：超越竞争对手的开源大语言模型技术解析"
description: "DeepSeek发布的开源模型DeepSeek-V3在性能上超越了Claude 3.5 Sonnet、GPT-4o等主要竞争者，拥有6850亿个参数，具备高准确性和性价比。该模型使用专家混合模型提高效率，经过14.8万亿高质量令牌的预训练，表现出色，尤其在数学推理和编程问题解决方面。DeepSeek-V3的模型权重可通过HuggingFace访问，用户可在其官网进行聊天体验。"
date: 2024-12-27T03:43:30Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*QYVWKYv9qo54BvFi"
categories: ["Natural Language Processing", "Machine Learning", "Data Science"]
author: "Rifx.Online"
tags: ["DeepSeek", "parameters", "Mixture-of-Experts", "tokens", "math"]
draft: False

---



### 优于 Claude 3\.5 Sonnet、GPT\-4o、Llama3\.1 405B



年末将至，刚刚，中国的 DeepSeek 发布了其开源模型 DeepSeek\-v3，该模型在性能上超越了所有主要竞争者，包括 Claude3\.5 Sonnet、GPT\-4o、Qwen2\.5 Coder 等等。该模型的表现如同怪兽，显然，我们可以说

DeepSeek\-V3 是迄今为止发布的最佳开源模型

### 有史以来最大的 LLM 之一！

DeepSeek\-V3 拥有令人印象深刻的 6850 亿个参数，使其成为 AI 领域中较大的模型之一。如此庞大的参数数量使其能够更细致地理解和生成文本。

### 非常快速

60 tokens/秒 (比 DeepSeek V2 快 3 倍\)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*04soDWEsFKvpFi_P.jpeg)

该图表突出了 DeepSeek\-V3 在 **性价比** 和 **准确性** (MMLU Redux ZeroEval Score) 基础上的 **优势**。以下是它成为最佳选择的原因：

1. **高准确性**：DeepSeek\-V3 的得分接近 **90**，超越了大多数开源模型，甚至与 Claude 3\.5 和 GPT\-4 等闭源模型竞争非常接近。
2. **最佳成本**：它处于 **性能/价格最佳范围**，在每百万 tokens 的 API 成本方面相较于其他高性能模型极具效率。
3. **平衡的性能和可获取性**：与昂贵的闭源模型不同，DeepSeek\-V3 在保持竞争性能的同时是开源的，确保了经济实惠和灵活性。

## DeepSeek\-V3 的关键特性：

**模型规模与效率**：

* **671B 总参数**，每个令牌激活 **37B**。
* 使用 **专家混合模型 (MoE)** 提高效率。

> **专家混合模型 (MoE) LLM** 是一种使用 **多个专门的“专家”（较小的子模型）** 的 AI 模型。对于每个输入，仅激活其中几个专家，这使得模型 **更快且更高效**。这就像拥有一组专家，针对每项任务只咨询合适的专家，而不是询问所有人。

**架构创新**：

* 实施 **多头潜在注意力 (MLA)** 和 **DeepSeekMoE 架构**，基于 DeepSeek\-V2 的进展。
* 引入 **无辅助损失策略** 进行负载均衡。
* 采用 **多令牌预测训练目标** 以提高性能。

**训练数据集**：

* 在 **14.8 万亿高质量令牌** 上进行预训练，确保数据的多样性和丰富性。

**训练过程**：

* 包括 **监督微调** 和 **强化学习** 阶段。
* 仅需 **2.788M H800 GPU 小时**，具有成本效益。
* **稳定的训练过程**，没有不可恢复的损失峰值或回滚。

## 性能与指标

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*7UwH-gLiNTznTN37.png)

总结结果，

**MMLU\-Pro (知识理解)**：

* **DeepSeek\-V3**: 75\.9%（第二好）。
* 略低于 **GPT\-4 (78%)**，超过所有其他模型。

**GPQA\-Diamond (复杂问答)**：

* **DeepSeek\-V3**: 59\.1%
* 相较于 **GPT\-4 (49\.9%)** 和其他模型有显著领先。只有 Claude 更优秀。

**MATH 500 (数学推理)**：

* **DeepSeek\-V3**: 90\.2%（最佳表现）。
* 大幅超过 GPT\-4 和其他模型。

**AIME 2024 (高级数学推理)**：

* **DeepSeek\-V3**: 39\.2%（最佳表现）。
* 比 GPT\-4 和其他模型领先超过 **23%**。

**Codeforces (编程问题解决)**：

* **DeepSeek\-V3**: 51\.6%（最佳表现）。
* 显著超过 GPT\-4 和其他模型。

**SWE\-bench Verified (软件工程)**：

* **DeepSeek\-V3**: 42%（第二好）。
* 落后于 **Claude Sonnet (50\.8%)**，但领先于大多数其他模型。

## 如何使用 DeepSeek\-V3？

模型权重是开源的，可以通过 HuggingFace 访问

如果您只想聊天，该模型在 deepseek 的官方聊天中免费托管：<https://www.deepseek.com/>

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*jRKyQIV8oIuAjE65bvVVdw.png)

希望您能尝试这个模型

