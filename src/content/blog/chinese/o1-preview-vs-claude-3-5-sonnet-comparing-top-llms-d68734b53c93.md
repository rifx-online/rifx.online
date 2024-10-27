---
title: "o1-preview 与 claude-3.5-sonnet：比较顶级法学硕士"
meta_title: "o1-preview 与 claude-3.5-sonnet：比较顶级法学硕士"
description: "了解 OpenAI 的 o1 预览版与 Claude 3.5 Sonnet 在性能、速度和功能方面的比较。"
date: 2024-10-27T13:58:01Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*kTWAcpRdOpsrFIDZjjjr7Q.jpeg"
categories: ["Programming", "Machine Learning", "Generative AI"]
author: "Rifx.Online"
tags: ["o1-preview", "Claude", "throughput", "latency", "reasoning"]
draft: False

---



今天（2024年9月12日），OpenAI 发布了其最新的语言模型 o1-preview。这个先进的模型经过设计，能够在生成响应之前投入更多时间进行处理，使其能够更好地应对复杂任务，并在科学、编码和数学等领域解决具有挑战性的问题。

在这篇博客文章中，我们将深入分析 o1-preview，并将其与之前被认为是最先进模型之一的 Claude 3.5 Sonnet 进行比较。



## 比较方法论

我们的分析利用了 [Keywords AI 的 LLM playground](https://docs.keywordsai.co/features/prompt/model-playground)，这是一个支持超过 200 种语言模型并提供函数调用功能的平台。我们将探讨以下几个方面：

* 基本比较
* 基准比较
* 处理速度
* 评估指标
* 建议的使用案例

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*yc171ikejtBy_o11.jpeg)

## 基本比较

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*z2FrS_AVig7Y6eU_.jpeg)

注意：o1-preview 不支持流式传输、函数调用和系统消息。

## 基准比较

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*Bx_vAvFc9DAD0cZA.jpeg)

O1-preview 在所有基准测试中都优于 Claude 3.5 Sonnet。最小的差距出现在 MMLU（一般知识）中。GPQA Diamond 测试研究生水平的推理，显示出显著的性能差异。MATH 基准揭示了最大的差距，突显了 o1-preview 的高级数学能力。这些结果表明，o1-preview 在复杂推理和各个领域的问题解决方面有了显著改善。

## 速度比较

O1-preview 的思考和响应时间比其他 LLM 更长。虽然直接的速度比较可能并不完全公平，但测试 o1-preview 的速度至关重要。这些信息帮助开发者更好地理解 o1-preview 的能力，并判断它是否适合他们的项目。注意：由于 o1-preview 不支持流式传输，我们已为两个模型禁用流式传输。因此，无法测量首次令牌时间（TTFT）。

## 延迟

我们的测试涉及每个模型数百个请求，揭示了显著的差异。Claude 3.5 Sonnet 的平均延迟为 18.3 秒/请求，而 o1-preview 的平均延迟为 39.4 秒/请求。o1-preview 显著更长的延迟是由于其延长的思考和推理过程。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*2PMkgPVuylFxwfIa.jpeg)

## 吞吐量（每秒令牌数）

尽管延迟较高，o1-preview的吞吐量更为出色。o1-preview生成92.94个令牌/秒，而Claude 3.5 Sonnet生成74.87个令牌/秒。这表明o1-preview较长的生成时间主要是由于其初始处理阶段，而非令牌生成速度。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*wxqpnwZhl9pnbw8y.jpeg)

## 性能比较

我们在[Keywords AI平台](https://keywordsai.co/)上进行了评估测试。评估包括三个部分：

* **编码任务**：两个模型成功完成了前端和后端开发任务。O1-preview在处理较长上下文时表现更佳，能够在第一次尝试中更有效地识别和解决bug。它还展现了更全面的代码分析能力。
* **逻辑推理**：O1-preview在推理任务中表现出色。它的思维过程与人类认知非常相似。虽然Claude 3.5 Sonnet在大多数问题上表现良好，但o1-preview始终能够解决复杂的推理挑战，包括国际数学奥林匹克（IMO）级别的问题。
* **写作任务**：两个模型在写作任务上表现非常出色。它们展现了撰写真实、个性化的冷邮件以及简洁且有意义的博客文章的能力。

## 模型推荐

o1-preview

* **最佳选择：** 适用于数学、编码和物理学中的复杂问题解决。特别适合处理挑战性任务的研究人员。
* **不适合：** 需要快速响应时间或严重依赖系统提示的AI应用。由于缺乏流媒体支持，不适用于语音AI应用。

Claude 3.5 Sonnet

* **最佳选择：** 适用于大多数需要问题解决能力和高质量内容生成的AI应用。
* **不适合：** 语音AI应用或对预算限制严格、需要较低运营成本的项目。

## 如何将 o1-preview 集成到您的 AI 应用中

要将 o1-preview 集成到您的 AI 应用中，只需访问 Keywords AI 模型页面并找到“查看代码”按钮。点击此按钮以复制提供的代码片段，然后将其直接粘贴到您的代码库中。通过这个简单的过程，您将能够在项目中利用 o1-preview 的强大功能，使您能够轻松应对复杂问题并生成高质量内容。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*XyQ9QiI7TN8Uc5Jp.jpeg)

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*t8fEYlEs13eM7D28lVbtIw.png)

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*yhu9y5ixNuxeFVe1.png)

此故事发布在 [Generative AI](https://generativeai.pub/)。请在 [LinkedIn](https://www.linkedin.com/company/generative-ai-publication) 上与我们联系，并关注 [Zeniteq](https://www.zeniteq.com/)，以便获取最新的 AI 资讯。

订阅我们的 [newsletter](https://www.generativeaipub.com/) 和 [YouTube](https://www.youtube.com/@generativeaipub) 频道，及时了解生成 AI 的最新消息和动态。让我们共同塑造 AI 的未来！

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*PelNtaNaEVDWgMWr.png)

