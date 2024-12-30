---
title: "DeepSeek V3"
meta_title: "DeepSeek V3"
description: "DeepSeek V3"
date: 2024-12-29T15:07:38Z
image: "https://img.rifx.online/icons/deepseek-color.svg"
categories: ["text 2 text"]
author: "DeepSeek"
tags: ["Generative AI", "Multi-Token Prediction", "New", "deepseek-chat-v3", "DeepSeek", "Hot", "Machine Learning", "Mixture-of-Experts", "Natural Language Processing", "Load Balancing Strategy", "Programming", "Multi-head Latent Attention", "Technology"]
model_tags: ['New', 'Hot']
labels: ["deepseek-chat-v3", "Mixture-of-Experts", "Multi-head Latent Attention", "Multi-Token Prediction", "Load Balancing Strategy"]
draft: False
is_recommended: True
is_active: True
discount: 1
is_free: False

id: "deepseek/deepseek-chat-v3"
context: 64000
input: 1.4e-07
output: 2.8e-07
img: 0
request: 0
last_updated: 2024-12-29T15:07:38Z

---

## 1. 介绍

我们推出了 DeepSeek-V3，这是一款强大的混合专家 (MoE) 语言模型，拥有 671B 的总参数，其中每个令牌激活 37B。 
为了实现高效推理和具有成本效益的训练，DeepSeek-V3 采用了多头潜在注意力 (MLA) 和 DeepSeekMoE 架构，这些架构在 DeepSeek-V2 中得到了充分验证。 
此外，DeepSeek-V3 首创了一种无辅助损失的负载平衡策略，并设定了多令牌预测的训练目标，以实现更强的性能。 
我们在 14.8 万亿多样化且高质量的令牌上对 DeepSeek-V3 进行了预训练，随后进行了监督微调和强化学习阶段，以充分发挥其能力。 
全面的评估结果表明，DeepSeek-V3 超越了其他开源模型，性能可与领先的闭源模型相媲美。
尽管表现优异，DeepSeek-V3 完整训练仅需 2.788M H800 GPU 小时。
此外，其训练过程极为稳定。 
在整个训练过程中，我们没有经历任何不可恢复的损失峰值，也没有进行任何回滚。 

<p align="center">
  <img width="80%" src="https://wsrv.nl/?url=https://huggingface.co/deepseek-ai/DeepSeek-V3/resolve/main/figures/benchmark.png">
</p>

## 2. 模型摘要

---

**架构：创新的负载平衡策略和训练目标**

- 在 DeepSeek-V2 高效架构的基础上，我们首创了一种无辅助损失的负载平衡策略，最大限度地减少了由于鼓励负载平衡而导致的性能下降。
- 我们研究了多令牌预测 (MTP) 目标，并证明其对模型性能的益处。 
    它还可以用于推测解码以加速推理。

---

**预训练：追求终极训练效率**

- 我们设计了一个 FP8 混合精度训练框架，并首次验证了在极大规模模型上进行 FP8 训练的可行性和有效性。  
- 通过算法、框架和硬件的共同设计，我们克服了跨节点 MoE 训练中的通信瓶颈，几乎实现了计算与通信的完全重叠。  
  这显著提高了我们的训练效率并降低了训练成本，使我们能够在没有额外开销的情况下进一步扩大模型规模。  
- 以仅 2.664M H800 GPU 小时的经济成本，我们在 14.8T 令牌上完成了 DeepSeek-V3 的预训练，生成了当前最强的开源基础模型。 预训练后的后续训练阶段仅需 0.1M GPU 小时。

---

**后训练：来自 DeepSeek-R1 的知识蒸馏**

- 我们引入了一种创新的方法论，将推理能力从长链思维 (CoT) 模型（特别是来自 DeepSeek R1 系列模型的一个）蒸馏到标准 LLM，特别是 DeepSeek-V3。我们的流程优雅地将 R1 的验证和反思模式融入 DeepSeek-V3，并显著提高了其推理性能。同时，我们也对 DeepSeek-V3 的输出风格和长度进行了控制。

---

## 3. 模型下载

<div align="center">

| **模型** | **#总参数** | **#激活参数** | **上下文长度** | **下载** |
| :------------: | :------------: | :------------: | :------------: | :------------: |
| DeepSeek-V3-Base | 671B | 37B | 128K   | [🤗 HuggingFace](https://huggingface.co/deepseek-ai/DeepSeek-V3-Base)   |
| DeepSeek-V3   | 671B | 37B |  128K   | [🤗 HuggingFace](https://huggingface.co/deepseek-ai/DeepSeek-V3)   |

</div>

**注意：DeepSeek-V3 模型在 HuggingFace 上的总大小为 685B，其中包括 671B 的主模型权重和 14B 的多令牌预测 (MTP) 模块权重。**

为了确保最佳性能和灵活性，我们与开源社区和硬件供应商合作，提供多种在本地运行模型的方法。有关逐步指导，请查看第 6 节：[如何本地运行](#6-how-to-run-locally)。

对于希望深入了解的开发者，我们建议探索 [README_WEIGHTS.md](./README_WEIGHTS.md)，以获取有关主模型权重和多令牌预测 (MTP) 模块的详细信息。请注意，MTP 支持目前正在社区内积极开发中，我们欢迎您的贡献和反馈。

## 4. 评估结果
### 基础模型
#### 标准基准

<div align="center">

|  | 基准 (指标) | # 样本 | DeepSeek-V2 | Qwen2.5 72B | LLaMA3.1 405B | DeepSeek-V3 |
|---|-------------------|----------|--------|-------------|---------------|---------|
| | 架构 | - | MoE | Dense | Dense | MoE |
| | # 激活参数 | - | 21B | 72B | 405B | 37B |
| | # 总参数 | - | 236B | 72B | 405B | 671B |
| 英语 | Pile-test (BPB) | - | 0.606 | 0.638 | **0.542** | 0.548 |
| | BBH (EM) | 3-shot | 78.8 | 79.8 | 82.9 | **87.5** |
| | MMLU (Acc.) | 5-shot | 78.4 | 85.0 | 84.4 | **87.1** |
| | MMLU-Redux (Acc.) | 5-shot | 75.6 | 83.2 | 81.3 | **86.2** |
| | MMLU-Pro (Acc.) | 5-shot | 51.4 | 58.3 | 52.8 | **64.4** |
| | DROP (F1) | 3-shot | 80.4 | 80.6 | 86.0 | **89.0** |
| | ARC-Easy (Acc.) | 25-shot | 97.6 | 98.4 | 98.4 | **98.9** |
| | ARC-Challenge (Acc.) | 25-shot | 92.2 | 94.5 | **95.3** | **95.3** |
| | HellaSwag (Acc.) | 10-shot | 87.1 | 84.8 | **89.2** | 88.9 |
| | PIQA (Acc.) | 0-shot | 83.9 | 82.6 | **85.9** | 84.7 |
| | WinoGrande (Acc.) | 5-shot | **86.3** | 82.3 | 85.2 | 84.9 |
| | RACE-Middle (Acc.) | 5-shot | 73.1 | 68.1 | **74.2** | 67.1 |
| | RACE-High (Acc.) | 5-shot | 52.6 | 50.3 | **56.8** | 51.3 |
| | TriviaQA (EM) | 5-shot | 80.0 | 71.9 | **82.7** | **82.9** |
| | NaturalQuestions (EM) | 5-shot | 38.6 | 33.2 | **41.5** | 40.0 |
| | AGIEval (Acc.) | 0-shot | 57.5 | 75.8 | 60.6 | **79.6** |
| 代码 | HumanEval (Pass@1) | 0-shot | 43.3 | 53.0 | 54.9 | **65.2** |
| | MBPP (Pass@1) | 3-shot | 65.0 | 72.6 | 68.4 | **75.4** |
| | LiveCodeBench-Base (Pass@1) | 3-shot | 11.6 | 12.9 | 15.5 | **19.4** |
| | CRUXEval-I (Acc.) | 2-shot | 52.5 | 59.1 | 58.5 | **67.3** |
| | CRUXEval-O (Acc.) | 2-shot | 49.8 | 59.9 | 59.9 | **69.8** |
| 数学 | GSM8K (EM) | 8-shot | 81.6 | 88.3 | 83.5 | **89.3** |
| | MATH (EM) | 4-shot | 43.4 | 54.4 | 49.0 | **61.6** |
| | MGSM (EM) | 8-shot | 63.6 | 76.2 | 69.9 | **79.8** |
| | CMath (EM) | 3-shot | 78.7 | 84.5 | 77.3 | **90.7** |
| 中文 | CLUEWSC (EM) | 5-shot | 82.0 | 82.5 | **83.0** | 82.7 |
| | C-Eval (Acc.) | 5-shot | 81.4 | 89.2 | 72.5 | **90.1** |
| | CMMLU (Acc.) | 5-shot | 84.0 | **89.5** | 73.7 | 88.8 |
| | CMRC (EM) | 1-shot | **77.4** | 75.8 | 76.0 | 76.3 |
| | C3 (Acc.) | 0-shot | 77.4 | 76.7 | **79.7** | 78.6 |
| | CCPM (Acc.) | 0-shot | **93.0** | 88.5 | 78.6 | 92.0 |
| 多语言 | MMMLU-non-English (Acc.) | 5-shot | 64.0 | 74.8 | 73.8 | **79.4** |

</div>

注意：最佳结果以粗体显示。得分差距不超过 0.3 的视为同一水平。DeepSeek-V3 在大多数基准测试中表现最佳，特别是在数学和代码任务上。
有关更多评估细节，请查阅我们的论文。

#### 上下文窗口
<p align="center">
  <img width="80%" src="https://wsrv.nl/?url=https://huggingface.co/deepseek-ai/DeepSeek-V3/resolve/main/figures/niah.png">
</p>


在 ``Needle In A Haystack`` (NIAH) 测试中的评估结果。DeepSeek-V3 在所有上下文窗口长度（最多 **128K**）上表现良好。

### 聊天模型
#### 标准基准 (大于 67B 的模型)
<div align="center">

| | **基准 (指标)** | **DeepSeek V2-0506** | **DeepSeek V2.5-0905** | **Qwen2.5 72B-Inst.** | **Llama3.1 405B-Inst.** | **Claude-3.5-Sonnet-1022** | **GPT-4o 0513** | **DeepSeek V3** |
|---|---------------------|---------------------|----------------------|---------------------|----------------------|---------------------------|----------------|----------------|
| | 架构 | MoE | MoE | Dense | Dense | - | - | MoE |
| | # 激活参数 | 21B | 21B | 72B | 405B | - | - | 37B |
| | # 总参数 | 236B | 236B | 72B | 405B | - | - | 671B |
| 英语 | MMLU (EM) | 78.2 | 80.6 | 85.3 | **88.6** | **88.3** | 87.2 | **88.5** |
| | MMLU-Redux (EM) | 77.9 | 80.3 | 85.6 | 86.2 | **88.9** | 88.0 | **89.1** |
| | MMLU-Pro (EM) | 58.5 | 66.2 | 71.6 | 73.3 | **78.0** | 72.6 | 75.9 |
| | DROP (3-shot F1) | 83.0 | 87.8 | 76.7 | 88.7 | 88.3 | 83.7 | **91.6** |
| | IF-Eval (Prompt Strict) | 57.7 | 80.6 | 84.1 | 86.0 | **86.5** | 84.3 | 86.1 |
| | GPQA-Diamond (Pass@1) | 35.3 | 41.3 | 49.0 | 51.1 | **65.0** | 49.9 | 59.1 |
| | SimpleQA (Correct) | 9.0 | 10.2 | 9.1 | 17.1 | 28.4 | **38.2** | 24.9 |
| | FRAMES (Acc.) | 66.9 | 65.4 | 69.8 | 70.0 | 72.5 | **80.5** | 73.3 |
| | LongBench v2 (Acc.) | 31.6 | 35.4 | 39.4 | 36.1 | 41.0 | 48.1 | **48.7** |
| 代码 | HumanEval-Mul (Pass@1) | 69.3 | 77.4 | 77.3 | 77.2 | 81.7 | 80.5 | **82.6** |
| | LiveCodeBench (Pass@1-COT) | 18.8 | 29.2 | 31.1 | 28.4 | 36.3 | 33.4 | **40.5** |
| | LiveCodeBench (Pass@1) | 20.3 | 28.4 | 28.7 | 30.1 | 32.8 | 34.2 | **37.6** |
| | Codeforces (Percentile) | 17.5 | 35.6 | 24.8 | 25.3 | 20.3 | 23.6 | **51.6** |
| | SWE Verified (Resolved) | - | 22.6 | 23.8 | 24.5 | **50.8** | 38.8 | 42.0 |
| | Aider-Edit (Acc.) | 60.3 | 71.6 | 65.4 | 63.9 | **84.2** | 72.9 | 79.7 |
| | Aider-Polyglot (Acc.) | - | 18.2 | 7.6 | 5.8 | 45.3 | 16.0 | **49.6** |
| 数学 | AIME 2024 (Pass@1) | 4.6 | 16.7 | 23.3 | 23.3 | 16.0 | 9.3 | **39.2** |
| | MATH-500 (EM) | 56.3 | 74.7 | 80.0 | 73.8 | 78.3 | 74.6 | **90.2** |
| | CNMO 2024 (Pass@1) | 2.8 | 10.8 | 15.9 | 6.8 | 13.1 | 10.8 | **43.2** |
| 中文 | CLUEWSC (EM) | 89.9 | 90.4 | **91.4** | 84.7 | 85.4 | 87.9 | 90.9 |
| | C-Eval (EM) | 78.6 | 79.5 | 86.1 | 61.5 | 76.7 | 76.0 | **86.5** |
| | C-SimpleQA (Correct) | 48.5 | 54.1 | 48.4 | 50.4 | 51.3 | 59.3 | **64.8** |

注意：所有模型均在限制输出长度为 8K 的配置下进行评估。包含少于 1000 个样本的基准测试使用不同的温度设置进行了多次测试，以得出可靠的最终结果。DeepSeek-V3 是表现最佳的开源模型，并且在与前沿闭源模型的竞争中表现出色。

</div>

#### 开放式生成评估

<div align="center">

| 模型 | Arena-Hard | AlpacaEval 2.0 |
|-------|------------|----------------|
| DeepSeek-V2.5-0905 | 76.2 | 50.5 |
| Qwen2.5-72B-Instruct | 81.2 | 49.1 |
| LLaMA-3.1 405B | 69.3 | 40.5 |
| GPT-4o-0513 | 80.4 | 51.1 |
| Claude-Sonnet-3.5-1022 | 85.2 | 52.0 |
| DeepSeek-V3 | **85.5** | **70.0** |

注意：英语开放式对话评估。对于 AlpacaEval 2.0，我们使用长度控制的胜率作为指标。
</div>

## 5. 聊天网站与 API 平台
您可以在 DeepSeek 的官方网站与 DeepSeek-V3 聊天：[chat.deepseek.com](https://chat.deepseek.com/sign_in)

我们还在 DeepSeek 平台提供 OpenAI 兼容的 API：[platform.deepseek.com](https://platform.deepseek.com/)

## 6. 如何本地运行

DeepSeek-V3 可以使用以下硬件和开源社区软件在本地部署：

1. **DeepSeek-Infer Demo**：我们提供了一个简单轻量的 FP8 和 BF16 推理演示。
2. **SGLang**：完全支持 DeepSeek-V3 模型的 BF16 和 FP8 推理模式。
3. **LMDeploy**：支持本地和云部署的高效 FP8 和 BF16 推理。
4. **TensorRT-LLM**：目前支持 BF16 推理和 INT4/8 量化，FP8 支持即将推出。
5. **vLLM**：支持 DeepSeek-V3 模型的 FP8 和 BF16 模式，适用于张量并行和管道并行。
6. **AMD GPU**：通过 SGLang 在 BF16 和 FP8 模式下在 AMD GPU 上运行 DeepSeek-V3 模型。
7. **华为昇腾 NPU**：支持在华为昇腾设备上运行 DeepSeek-V3。

由于我们的框架原生采用 FP8 训练，因此仅提供 FP8 权重。如果您需要 BF16 权重进行实验，可以使用提供的转换脚本进行转换。

以下是将 FP8 权重转换为 BF16 的示例：

```shell
cd inference
python fp8_cast_bf16.py --input-fp8-hf-path /path/to/fp8_weights --output-bf16-hf-path /path/to/bf16_weights
```

**注意：Huggingface 的 Transformers 还未直接支持。**

### 6.1 使用 DeepSeek-Infer Demo 进行推理（仅示例）

#### 模型权重与演示代码准备

首先，克隆我们的 DeepSeek-V3 GitHub 仓库：

```shell
git clone https://github.com/deepseek-ai/DeepSeek-V3.git
```

导航到 `inference` 文件夹，并安装 `requirements.txt` 中列出的依赖项。

```shell
cd DeepSeek-V3/inference
pip install -r requirements.txt
```

从 HuggingFace 下载模型权重，并将其放入 `/path/to/DeepSeek-V3` 文件夹中。

#### 模型权重转换

将 HuggingFace 模型权重转换为特定格式：

```shell
python convert.py --hf-ckpt-path /path/to/DeepSeek-V3 --save-path /path/to/DeepSeek-V3-Demo --n-experts 256 --model-parallel 16
```

#### 运行

然后您可以与 DeepSeek-V3 聊天：

```shell
torchrun --nnodes 2 --nproc-per-node 8 generate.py --node-rank $RANK --master-addr $ADDR --ckpt-path /path/to/DeepSeek-V3-Demo --config configs/config_671B.json --interactive --temperature 0.7 --max-new-tokens 200
```

或在给定文件上进行批量推理：

```shell
torchrun --nnodes 2 --nproc-per-node 8 generate.py --node-rank $RANK --master-addr $ADDR --ckpt-path /path/to/DeepSeek-V3-Demo --config configs/config_671B.json --input-file $FILE
```

### 6.2 使用 SGLang 进行推理（推荐）

[SGLang](https://github.com/sgl-project/sglang) 目前支持 MLA 优化、FP8 (W8A8)、FP8 KV 缓存和 Torch 编译，提供在开源框架中最先进的延迟和吞吐量性能。

值得注意的是，[SGLang v0.4.1](https://github.com/sgl-project/sglang/releases/tag/v0.4.1) 完全支持在 **NVIDIA 和 AMD GPU** 上运行 DeepSeek-V3，使其成为高度灵活和强大的解决方案。

以下是 SGLang 团队的启动说明：https://github.com/sgl-project/sglang/tree/main/benchmark/deepseek_v3

### 6.3 使用 LMDeploy 进行推理（推荐）
[LMDeploy](https://github.com/InternLM/lmdeploy) 是一个灵活且高性能的推理和服务框架，专为大型语言模型量身定制，现已支持 DeepSeek-V3。它提供离线管道处理和在线部署能力，与基于 PyTorch 的工作流程无缝集成。

有关使用 LMDeploy 运行 DeepSeek-V3 的全面逐步说明，请参考此处：https://github.com/InternLM/lmdeploy/issues/2960


### 6.4 使用 TRT-LLM 进行推理（推荐）

[TensorRT-LLM](https://github.com/NVIDIA/TensorRT-LLM) 现已支持 DeepSeek-V3 模型，提供 BF16 和 INT4/INT8 权重的精度选项。FP8 支持目前正在进行中，并将很快发布。您可以通过以下链接访问专门为 DeepSeek-V3 支持的 TRTLLM 自定义分支，以直接体验新功能：https://github.com/NVIDIA/TensorRT-LLM/tree/deepseek/examples/deepseek_v3。 

### 6.5 使用 vLLM 进行推理（推荐）

[vLLM](https://github.com/vllm-project/vllm) v0.6.6 支持在 NVIDIA 和 AMD GPU 上的 DeepSeek-V3 推理，适用于 FP8 和 BF16 模式。除了标准技术外，vLLM 还提供 _管道并行_，允许您在通过网络连接的多台机器上运行此模型。有关详细指导，请参考 [vLLM 指南](https://docs.vllm.ai/en/latest/serving/distributed_serving.html)。欢迎您关注 [改进计划](https://github.com/vllm-project/vllm/issues/11539)。

### 6.6 使用 AMD GPU 的推荐推理功能

与 AMD 团队合作，我们实现了对 AMD GPU 的 Day-One 支持，使用 SGLang，完全兼容 FP8 和 BF16 精度。有关详细指导，请参考 [SGLang 指南](#63-inference-with-lmdeploy-recommended)。

### 6.7 使用华为昇腾 NPU 的推荐推理功能
华为昇腾社区的 [MindIE](https://www.hiascend.com/en/software/mindie) 框架已经成功适配 DeepSeek-V3 的 BF16 版本。有关昇腾 NPU 的逐步指导，请按照 [此处的说明](https://modelers.cn/models/MindIE/deepseekv3) 操作。

## 7. 许可证
此代码库遵循 [MIT 许可证](LICENSE-CODE)。使用 DeepSeek-V3 基础/聊天模型需遵循 [模型许可证](LICENSE-MODEL)。DeepSeek-V3 系列（包括基础和聊天）支持商业使用。

## 8. 引用
```

```

## 9. 联系
如果您有任何问题，请提出问题或通过 [service@deepseek.com](service@deepseek.com) 联系我们。

