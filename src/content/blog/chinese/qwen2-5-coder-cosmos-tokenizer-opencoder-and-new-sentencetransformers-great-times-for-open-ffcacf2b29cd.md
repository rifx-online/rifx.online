---
title: "Qwen2.5-Coder、Cosmos Tokenizer、OpenCoder 和新的 SentenceTransformers：开放源代码的伟大时代"
meta_title: "Qwen2.5-Coder、Cosmos Tokenizer、OpenCoder 和新的 SentenceTransformers：开放源代码的伟大时代"
description: "文章介绍了多个开源项目的进展，包括Qwen2.5-Coder系列、Cosmos Tokenizer、OpenCoder和SentenceTransformers。Qwen2.5-Coder是一个与GPT-4竞争的开源代码LLM，具有多种模型尺寸和卓越的代码生成、修复和推理能力。Cosmos Tokenizer则是一种高效的神经分词器，专注于图像和视频压缩，提供显著的压缩率和高质量重建。OpenCoder是完全开源的代码LLM，训练于2.5万亿令牌，支持多种编程语言。SentenceTransformers通过OpenVINO的量化技术实现了CPU推理速度的显著提升。"
date: 2024-11-14T03:29:09Z
image: "https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*IZdOavxT_8SRCxrg"
categories: ["Programming", "Technology", "Natural Language Processing"]
author: "Rifx.Online"
tags: ["Qwen2.5-Coder", "Cosmos", "OpenCoder", "SentenceTransformers", "OpenVINO"]
draft: False

---

我想强调一些引人注目的开源进展：

* **Qwen2\.5\-Coder 系列**：一个开放源代码的代码 LLM，正在与 GPT\-4 竞争。
* **Cosmos Tokenizer**：一套先进的神经分词器，用于高效的图像和视频压缩。
* **OpenCoder**：一个完全开源的代码 LLM，训练于惊人的 2\.5 万亿个标记。
* **SentenceTransformers 的大幅 CPU 加速**：使用 OpenVINO 的 int8 静态量化，CPU 推理速度提升 4 倍。

让我们深入了解一下！

## Qwen2\.5\-Coder 系列：开源一款与 GPT\-4 竞争的 SOTA 代码 LLM

阿里云宣布开源发布 Qwen2\.5\-Coder 系列——这些模型具有 **强大**、**多样** 和 **实用** 的特点，致力于推动开放代码大语言模型 (LLMs) 的发展。

旗舰模型 **Qwen2\.5\-Coder\-32B\-Instruct** 作为最新的开源代码模型，设定了新的基准，匹配了 GPT\-4 的编码能力。它在通用和数学推理方面表现出色。



在之前发布的 1\.5B 和 7B 模型基础上，他们又推出了四种额外的模型尺寸：0\.5B、3B、14B 和 32B。Qwen2\.5\-Coder 现在能够满足广泛的开发者需求，涵盖六种主流模型尺寸。

他们还探讨了 Qwen2\.5\-Coder 在实际场景中的适用性，包括代码助手和工件生成。

实际例子突显了该模型在提升开发者生产力和代码质量方面的潜力。

**基准成就**

* **代码生成**：Qwen2\.5\-Coder\-32B\-Instruct 模型在流行的代码生成基准 EvalPlus、LiveCodeBench 和 BigCodeBench 上取得了顶尖性能。
* **代码修复**：认识到调试在软件开发中的重要性，Qwen2\.5\-Coder\-32B\-Instruct 在代码修复任务中表现出色。在 Aider 基准上得分 73\.7，表现与 GPT\-4 相当，帮助开发者高效修复代码错误。
* **代码推理**：该模型展现了先进的代码推理能力，学习代码执行过程并准确预测输入和输出。在 Qwen2\.5\-Coder\-7B\-Instruct 的出色表现基础上，32B 模型进一步提升了推理能力。

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*fzH6YE-yl_GrEXwz)

* **多语言支持**：Qwen2\.5\-Coder\-32B\-Instruct 精通 40 多种编程语言。在 McEval 上得分 65\.9，在 Haskell 和 Racket 等语言中表现出色，这得益于在预训练期间独特的数据清洗和均衡策略。

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*rhyc0T3UZp_2x0r2)

您可以在 [github](https://proxy.rifx.online/https://github.com/QwenLM/Qwen2.5-Coder) 上找到更多信息。

## Cosmos Tokenizer: 高级神经分词器用于高效的图像和视频压缩

**Cosmos Tokenizer** 是一套全面的神经分词器，专为图像和视频设计。

您现在可以将原始视觉数据转换为高效的压缩表示。

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*v8k8jLbZ4LYFRUBc.jpg)

通过无监督学习发现潜在空间，这些分词器促进了大规模模型训练，并减少了推理过程中的计算需求。

**分词器类型**：

* **连续分词器**：将视觉数据映射到连续嵌入，适用于从连续分布（如稳定扩散）中采样的模型。
* **离散分词器**：将视觉数据映射到量化索引，应用于依赖交叉熵损失进行训练的模型，如 VideoPoet。

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*a6Hvj8hXJUpOAp9Ber781g.png)

**关键特性**：

* **高压缩与质量保留**：在显著的压缩率与高质量重建之间取得平衡，保留潜在空间中的重要视觉细节。
* **轻量级时间因果架构**：利用因果时间卷积和注意力层保持视频帧的时间顺序，实现图像和视频的无缝分词。
* **在多样化数据上训练**：在各种纵横比和类别的高分辨率图像和长视频上进行训练，使其在推理时对时间长度不敏感。

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*lBO1omEzlr18SPB1zF-vMw.png)

**性能亮点**：

* **卓越的压缩率**：提供显著的压缩能力，速度比以前的方法快**12倍**。
* **高质量重建**：在峰值信噪比（PSNR）方面显著提升，在 DAVIS 视频数据集上超越现有方法超过 **+4 dB**。
* **高效的分词**：能够在 NVIDIA A100 GPU（80GB 内存）上编码高达 **8 秒 1080p** 和 **10 秒 720p** 视频。

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*uYQttZw-MDOCK3oxxLcHbw.png)

**评估与资源**：

* **TokenBench 数据集** 是一个新数据集，旨在标准化视频分词器评估，涵盖机器人、驾驶和体育等类别。
* **公开可用性**：具有 8x 和 16x 空间压缩，以及 4x 和 8x 时间压缩的预训练模型可在 [GitHub — NVIDIA/Cosmos-Tokenizer](https://proxy.rifx.online/https://github.com/NVIDIA/Cosmos-Tokenizer) 获取。

有关更多信息，请参阅 [NVIDIA 的官方博客文章](https://proxy.rifx.online/https://research.nvidia.com/labs/dir/cosmos-tokenizer/)。

> *感谢您抽出时间来到这里！*

> *如果您喜欢这篇文章，请花一点时间 [**在 Medium 上关注我们**](https://proxy.rifx.online/https://medium.com/@datadrifters/subscribe)，为这篇文章点赞 50 次并留下评论。*

> *我们还在进行一个基于小组的培训 **[用于构建全栈 GenAI SaaS 应用程序](https://proxy.rifx.online/https://forms.gle/8mfFH4wjhF7BbtRY9)**，也期待在里面见到您！*

## OpenCoder: 完全开源的代码 LLM，训练于 2.5T 令牌

**OpenCoder** 介绍了一系列新的开源代码语言模型，包括 **1.5B** 和 **8B** 参数规模的基础模型和聊天模型。

OpenCoder 支持英语和中文，完全从一个庞大的数据集 **2.5 万亿令牌** 中训练而成，包含 90% 的原始代码和 10% 的代码相关网络数据。

该模型的性能水平可与领先的代码 LLM 相媲美。

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*5rd863dHI-W_2ei7.png)

**关键贡献**：

* 团队提供了模型权重、推理代码、训练数据、数据处理管道和详细的训练协议，使研究人员和从业者能够在此基础上进行构建和创新。
* 他们还推出了 **RefineCode 数据集**，这是一个高质量、可重复的代码预训练语料库，包含 **9600 亿令牌**，涵盖 **607 种编程语言**。

更多信息请查看 [官方公告](https://proxy.rifx.online/https://opencoder-llm.github.io/).

## SentenceTransformers 加速 CPU 推理，速度提升 4 倍

最新发布的 **SentenceTransformers** 引入了显著的性能提升，使用 **OpenVINO 的 int8 静态量化** 在 CPU 推理中实现高达 **4 倍的速度提升**。

此更新优化了开发者在处理大规模自然语言处理任务时的训练和推理工作流程。

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Pd9ESPxjKHaHVgV15pCQig.png)

**主要增强**：

* **OpenVINO int8 静态量化**：利用 OpenVINO 的量化技术，模型在保持准确性的前提下实现了卓越的推理速度。此优化超越了现有后端，提高了在 CPU 架构上的部署效率。
* **基于提示的训练**：支持使用提示进行训练，提供了一种简单的方法来提升性能，而无需额外的计算开销。
* **在 NanoBEIR 上的便捷评估**：通过使用 NanoBEIR，这个强大的信息检索基准 BEIR 的子集，便于更快速地评估模型性能。
* **PEFT 兼容性**：现在支持 **参数高效微调（PEFT）**，通过允许轻松添加和加载适配器，实现更高效的模型定制。

您可以在 [github](https://proxy.rifx.online/https://github.com/UKPLab/sentence-transformers/releases/tag/v3.3.0) 上找到更多信息。


