---
title: "新崛起红星：Qwen2.5来了"
meta_title: "新崛起红星：Qwen2.5来了"
description: "一起用python和llama-cpp测试一下阿里云新生的生成式AI Qwen2.5"
date: 2024-10-24T17:47:43Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*zU-XtqK2oMLkvscgxavjdw.png"
categories: ["Programming", "Technology", "Education"]
author: "Rifx.Online"
tags: ["Qwen2.5", "multimodal", "instruction-following", "text-generation", "multilingual"]
draft: False

---



### 一起测试新生的阿里云生成式AI Qwen2.5，使用Python和llama-cpp



在没有太多宣传和预期公告的情况下，阿里云于9月19日发布了他们的旗舰模型系列Qwen2.5。

阿里云在Qwen上的革命性旅程再次展示了通过创新的强大领导力。

怎么做的？它们有什么特别之处？我们应该期待什么？

在本文中，我们将探讨新模型并检查其性能。作为后续，在下一篇文章中，我们将使用`llama-cpp-python`和量化版本的qwen2.5–1.5b-instruct，对模型进行13项NLP任务的测试。

事实上，我相信我们是最佳的基准工具，能够全面评估一个模型是否适合我们！

现在，我们将覆盖以下内容：


```python
- Qwen2.5 family innovation
- Declared scope, use cases and models
- Qwen2.5: a party of Foundation models
- Expanding Reach through Open-Source Contributions
- Bridging Industries through cutting-edge AI solutions
- 13 Tasks to prove it worth 
- Future outlook: continued Open-Sourcing
```
让我们深入了解！ 

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*OeQ5qeOzCdl8LPJOZZgTIw.png)

## Qwen2.5家族创新

Qwen是阿里巴巴集团Qwen团队的大型语言模型和大型多模态模型系列。就在昨天，大型语言模型已升级为Qwen2.5。

语言模型和多模态模型均在大规模多语言和多模态数据上进行预训练，并在高质量数据上进行后训练，以与人类偏好对齐。Qwen能够进行自然语言理解、文本生成、视觉理解、音频理解、工具使用、角色扮演、作为AI代理等。

随着Qwen2.5的发布以及额外开源模型的发布，阿里云继续保持其领导地位，以满足企业用户日益增长的AI需求。自去年六月以来，Qwen家族通过Model Studio在消费电子、汽车、游戏等多个行业吸引了超过90,000个部署。

Qwen还通过在Hugging Face等平台上推出新模型，如Qwen1.5–110B和CodeQwen1.5–7B，扩大了其影响力，展示了阿里巴巴对开源AI开发的承诺。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*A4pEOgsLK2PAFtiaGQx1Qw.png)

## 声明的范围、用例和模型

在 Qwen2 发布的过去三个月里，众多开发者在 Qwen2 语言模型基础上构建了新的模型，为整个社区以及阿里云提供了宝贵的反馈。

> 在此期间，我们专注于创建更智能、更知识丰富的语言模型。今天，我们很高兴地介绍 Qwen 家族的最新成员：Qwen2.5。

他们的声明伴随着有关新模型家族的事实：

* 密集型、易于使用的仅解码器语言模型，提供 0.5B、1.5B、3B、7B、14B、32B 和 72B 尺寸，以及基础和指令变体。
* 在我们最新的大规模数据集上进行预训练，涵盖多达 18T 的标记。
* 在遵循指令、生成长文本（超过 8K 标记）、理解结构化数据（例如，表格）以及生成结构化输出（尤其是 JSON）方面有显著改进。
* 对系统提示的多样性更具韧性，增强了角色扮演实现和聊天机器人的条件设置。
* 支持的上下文长度可达 128K 标记，并且可以生成多达 8K 标记。
* 支持超过 29 种语言的多语言功能，包括中文、英文、法文、西班牙文、葡萄牙文、德文、意大利文、俄文、日文、韩文、越南文、泰文、阿拉伯文等。

## Qwen2.5：基础模型的聚会

根据2024年9月19日的[官方博客新闻稿](https://qwenlm.github.io/blog/qwen2.5/)的公告：

> 今天，我们很高兴地介绍Qwen家族的最新成员：**Qwen2.5**。我们宣布这可能是历史上最大的开源发布！让我们开始庆祝吧！

> 我们最新的发布包含了LLMs **Qwen2.5**，以及用于编码的专用模型**Qwen2.5-Coder**和用于数学的模型**Qwen2.5-Math**。

为了展示Qwen2.5的能力，阿里云团队对其最大的开源模型**Qwen2.5–72B**——一个72B参数的稠密解码器语言模型——与领先的开源模型如Llama-3.1–70B和Mistral-Large-V2进行了基准测试。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*-MMFgkkWHa307jNo.jpg)

所有开放权重模型都是稠密的解码器语言模型，提供多种尺寸，包括：

* Qwen2.5：0.5B、1.5B、3B、7B、14B、32B和72B
* Qwen2.5-Coder：1.5B、7B和32B正在发布中
* Qwen2.5-Math：1.5B、7B和72B。

除了3B和72B变体外，所有这些开源模型均在Apache 2.0许可证下发布。您可以在各自的Hugging Face库中找到许可证文件。

> 除了这些模型外，我们还通过Model Studio提供旗舰语言模型的API：**Qwen-Plus**和**Qwen-Turbo**，我们鼓励您进行探索！

但这还不是全部！

> …我们还开源了**Qwen2-VL-72B**，与上个月的发布相比，具有性能提升。

在**Qwen2.5**方面，所有语言模型均在我们最新的大规模数据集上进行了预训练，涵盖了多达**18万亿**个标记。与Qwen2相比，Qwen2.5获得了显著更多的知识（MMLU：85+），并在编码（HumanEval 85+）和数学（MATH 80+）方面大大提升了能力。此外，新模型在指令跟随、生成长文本（超过8K个标记）、理解结构化数据（例如，表格）和生成结构化输出，尤其是JSON方面取得了显著改善。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*7c7CIbl-WVjazUeE.jpeg)

Qwen2.5模型通常对系统提示的多样性更具韧性，增强了角色扮演的实施和聊天机器人的条件设置。

与Qwen2一样，Qwen2.5语言模型支持多达**128K**个标记，并可以生成多达**8K**个标记。它们还支持超过**29**种语言的多语言支持，包括中文、英文、法文、西班牙文、葡萄牙文、德文、意大利文、俄文、日文、韩文、越南文、泰文、阿拉伯文等。

### Qwen-Coder 是家族中的新成员

专业的专家语言模型，即 **Qwen2.5-Coder** 用于编码，**Qwen2.5-Math** 用于数学，相较于它们的前身 CodeQwen1.5 和 Qwen2-Math，进行了实质性的增强。具体来说，Qwen2.5-Coder 已在 **5.5 万亿** 个与代码相关的数据上进行了训练，使得即使是较小的编码专用模型也能够在编码评估基准上与更大的语言模型提供竞争力的表现。同时，Qwen2.5-Math 支持 **中文** 和 **英文**，并结合了多种推理方法，包括思维链（CoT）、思维程序（PoT）和工具集成推理（TIR）。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Nvk4wrcB0SB4Tt-xbCzO6g.png)

## 通过开源贡献扩大影响力

作为持续致力于更广泛社区的一部分，阿里云在发布各种规模和变体的Qwen模型方面迈出了进一步的步伐。这包括：

1. **Qwen 0.5亿参数**，适用于更传统应用的基础版本。2. 一款紧凑但强大的模型，专门为游戏开发量身定制：**Qwen-VL（视觉-语言）**，优化了高性能。

这些进展展示了阿里对开源AI的承诺，不仅分享了Qwen的基础版本，还推出了显著改进和新模型，直接针对企业需求，同时增强其快速创新的能力。

这与一个战略愿景密切相关，即持续贡献惠及社区成员和自身客户，帮助他们在多个行业寻求创新应用。

### 通过前沿的人工智能解决方案连接各行业

为了展示Qwen在现实场景中的广泛能力，阿里云一直处于前沿：

1. **小米**：该公司正在将阿里的模型集成到他们的AI助手小爱中，并在小米智能手机和电动汽车中部署，以通过语音命令生成车载娱乐图像等增强功能。

2. **完美世界游戏**：Qwen在游戏开发中的集成导致了创新应用，包括通过对话动态改善情节解析和实时内容管理。

阿里云模型与各行业之间的合作不仅丰富了用户体验，还促进了这些行业内更大的增长机会，推动了没有人工智能进步的情况下无法想象的边界。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*ku8o3rq6PHDE8xcc.png)

## 13 个证明其价值的任务

1.5 亿参数的模型可能是考虑到复杂性、提示理解和推理速度的最佳变体。

我将向您展示我仅使用 `llama-cpp-python` 和一个简单终端界面进行的内部测试。

为此，我创建了一个提示列表，涵盖了一系列通常使用的任务，您可以在每次生成后分配一个投票（从 0 到 5）。这是一个个人的人工基准测试。

### 需求

创建一个 `venv`（需要 Python 3.11+）：我在运行 Windows 11 的迷你电脑上进行了测试。

```python
## create the virtual environment
python -m venv venv
## activate the venv
venv\Scripts\activate
## Install the dependencies 
pip install llama-cpp-python==0.2.90 tiktoken
```
我们需要从[官方 Qwen2.5 Hugging Face 仓库](https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF)下载 GGUF 文件。我使用的是 qwen2.5–1.5b-instruct-q5\_k\_m.gguf 版本。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Fa-qFsx9RTFGZmM-vxCEPQ.png)

在主项目目录中下载文件。我们就准备好了。

这里用于分析的代码在我的 GitHub 仓库中：

我将在下一篇文章中解释整个代码和结果。保持关注！

## 未来展望：持续的开源

在未来的计划中，阿里巴巴还表达了他们对持续开源贡献的承诺，通过为不同领域的开发者发布更小的 Qwen 变体。实际上，在 Hugging Face 社区中，许多用户已开始针对特定任务对 Qwen 进行微调：我在我的 NuExtract 文章中写了一个例子：这个模型系列的较小变体基于 Qwen2–0.5b！

这些人工智能技术和模型进展的发展是充分利用大型语言模型如 **Qwen** 在各个行业中潜力的关键步骤。随着 Model Studio 中强劲的采用率持续快速增长，显然阿里云不仅通过提供先进的工具而且通过促进企业之间的创新，成为了行业的先锋领导者。

在我这边，我的展望是继续对新模型进行内部测试，特别是对小型模型，最高到 3B。

在下一篇文章中，我将与您分享我的方法，如何运行模型以及用于十三个 NLP 任务的提示模板。

希望您喜欢这篇文章。如果这个故事对您有价值，并且您想稍微表示支持，您可以：

1. 为这个故事多次点赞
2. 突出更值得记住的部分（这将使您更容易找到它们，也让我写出更好的文章）
3. **加入我的[完全免费的每周 Substack 通讯](https://thepoorgpuguy.substack.com/about)**
4. 注册 Medium 会员（$5/月可阅读无限 Medium 故事）
5. 在 Medium 上关注我
6. 阅读我的最新文章 <https://medium.com/@fabio.matricardi>

这里还有几篇文章来满足您的好奇心：

本文中引用的资源：

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*Du7V61mEX_yIrfmF.png)

此故事发布在 [Generative AI](https://generativeai.pub/)。与我们在 [LinkedIn](https://www.linkedin.com/company/generative-ai-publication) 上联系，并关注 [Zeniteq](https://www.zeniteq.com/)，以便及时了解最新的人工智能故事。

订阅我们的 [通讯](https://www.generativeaipub.com/) 和 [YouTube](https://www.youtube.com/@generativeaipub) 频道，及时获取生成式 AI 的最新消息和更新。让我们共同塑造 AI 的未来！

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*pvLAT3it1FkdhVU0.png)

