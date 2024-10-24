---
title: "RBYF：Qwen2.5–3B-instruct 非常棒。"
meta_title: "RBYF：Qwen2.5–3B-instruct 非常棒。"
description: "修改后的基准测试并附上您的反馈：阿里巴巴Qwen的全新3B模型是一个了不起的模型，我可以证明这一点！"
date: 2024-10-24T17:47:43Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*NWaBtJ64TLUoUHv4F1qJpg.png"
categories: ["Programming", "Technology", "Science"]
author: "Rifx.Online"
tags: ["Qwen", "NLP", "multimodal", "RBYF", "evaluation"]
draft: False

---

### 修订基准：以您为反馈的全新3B模型来自阿里巴巴Qwen，是个令人惊叹的模型，我可以证明这一点！



涌现属性的错觉在很大程度上是评估这些模型所使用的指标的产物。这是一个事实。

几周前，我决定做一个小反叛，放弃所有官方基准，开始自己做基准测试！

这就是这个完全虚构的首字母缩略词RBYF的意义：以您为反馈的修订基准。其基本原则是，没有比您更好的评判者来验证一个大型语言模型的优劣。

老实说，我专注于小型语言模型。我没有专用的GPU，计算资源有限。但我同样同意[LLMWare反叛原则第一条](https://readmedium.com/getting-work-done-with-genai-just-do-the-opposite-10-contrarian-rules-that-may-actually-work-634501602a27)：

使用小模型，而不是大模型。

在这篇文章中，我将向您展示我对qwen2.5–3b-instruct的评估结果。结果真的很好！

> 免责声明：所有与结果相关的提示均可在我的GitHub存储库中找到：

## 少即是多

缩放法则描述了模型性能如何随着参数和训练数据数量的增加而改善。这个原则推动了对LLM新能力的探索。

> 仅仅通过增加模型的规模，我们可以解锁新的能力……

缩放法则描述了模型性能与参数数量和训练数据之间的关系。随着模型变得更大并在更多数据上进行训练，我们期待它们的性能得到提升。这导致了对越来越大LLM的无休止追求，希望能够解锁新的能力。

涌现属性是指在复杂系统中个体组件之间的相互作用中产生的属性。通过孤立地研究组件，无法预测或理解这些属性。在LLM的情况下，希望随着这些模型变得更大和更复杂，它们会展现出意想不到的新能力。

这是一个童话故事。

在过去几周，我们亲眼目睹了经过过度训练和精心策划的小型语言模型可以表现得与它们的大型兄弟一样好。这对所谓的涌现能力是一个重击，反击了缩放法则。Gemma2–2B、Qwen2.5–3B，甚至最新的Llama3.2–3B都是远胜于旧的SOTA 7B模型的更好模型。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*-EjpdEky-Hf3WEQn.png)

## Qwen2.5模型系列

阿里云在九月中旬发布了他们的旗舰模型系列Qwen2.5。

> 阿里云在Qwen的革命性旅程中再次展现出强大的创新领导力

Qwen2.5是阿里巴巴集团Qwen团队的大型语言模型和大型多模态模型系列。这些语言模型和多模态模型在大规模多语言和多模态数据上进行了预训练，并在高质量数据上进行了后训练，以便与人类偏好对齐。Qwen能够理解自然语言、生成文本、理解视觉、理解音频、使用工具、角色扮演、作为AI代理进行操作等。

**新款Qwen2.5的亮点在于经过精心策划的训练数据集。** 通过检查小模型的性能，您可以清楚地理解这一点。

如果该系列的小型语言模型表现良好，意味着训练和数据集经过高度修订和策划。

以下是一些数字：

* 密集型、易于使用的解码器语言模型，提供0.5B、1.5B、3B、7B、14B、32B和72B尺寸，以及基础和指令变体。
* 在我们最新的大规模数据集上进行了预训练，涵盖多达18T个标记。
* 在指令跟随、生成长文本（超过8K个标记）、理解结构化数据（例如，表格）和生成结构化输出（尤其是JSON）方面有显著改进。
* 对系统提示的多样性更具韧性，增强了角色扮演的实现和聊天机器人的条件设置。
* 支持的上下文长度可达128K个标记，并且可以生成多达8K个标记。
* 支持超过29种语言的多语言，包括中文、英文、法文、西班牙文、葡萄牙文、德文、意大利文、俄文、日文、韩文、越南文、泰文、阿拉伯文等。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*3tnTS_UCImBRBDeKmFyjVQ.png)

## Qwen2.5–3B-instruct

尽管为了推动人工智能的发展，我们需要里程碑和更好的表现，但用户体验和个人观点不能被视为无关紧要。

我认为，探索一些常用的自然语言处理任务，抛开聊天体验，我们必须关注回复的质量。而我们是唯一所需的基准。**我们的用户体验是理解模型好坏的最佳指标**。模型必须足够可靠，以便在自动化工作流程中使用。

顺便提一下，我已经运行了我决定称之为[RBYF — 修订基准与您反馈](https://open.substack.com/pub/thepoorgpuguy/p/rbyf-is-here-revised-benchmarks-with?r=i78xo&utm_campaign=post&utm_medium=web)的项目，在[Qwen2.5–1.5b-instruct](https://ai.gopubby.com/qwen2-5-1-5b-the-future-of-mobile-ai-6bd5f29bbc84)上：您可以阅读详细信息。在文章中，我还解释了如何创建您的测试基准。所描述的方法与我用于Qwen2.5–3B的相同。

让我们从所有任务的整体表现开始。该模型已由我评估（在这种情况下是我自己的反馈），基于以下显示的定性矩阵。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*rdVHfCDWX9jlvtiq)

总体得分为62/70 = 8.8

好的，但Qwen2.5–3B-instruct是基于什么得到了这个评估分数呢？

## 测试概述

这个想法是进行公平的用户反馈，而不是基于标准基准和框架的自动化反馈。一个小型语言模型能否满足用户在主要自然语言处理任务上的意图？

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*wgngfGvSebeoH3YxTdvc8A.png)

我们希望验证用户意图和响应质量。以下是每个任务的详细信息：

### 介绍

验证模型如何回应初始问候并谈论自身。

### 一句话解释

综合与总结。最终评估的重点在于模型是否能够将回复压缩为仅一句话。

### 用三段话解释

用户的意图是获得对文本的智能解释，这种解释必须适合分成三段。SML通常会发现这很困难，因为他们总是会添加一个总结段落。

### 说“我准备好了”。

在一个基于聊天回合的应用中，遵循指令的模型通常会被要求首先阅读提供的文本，然后进行某种分析。通常情况下，SML 无法做到这一点……

### 总结

基本总结，没有限制。在这里，我们想评估总结是如何基于文本的，而不是凭空捏造事实。

### 总结为两句

基本总结，限制为两句话。在这里，我们希望评估总结是否基于文本，而不是虚构的事实，同时确保遵守两句的限制。

### 列出三个主要关键点 — 格式输出

```python
key_points = [
    "SML必须以特定格式输出。",
    "此提示要求创建一个包含3个关键点的列表。",
    "输出格式应为Python列表。"
]
```

### 目录

这个任务对许多 SML 来说相当困难。该提示需要一些调整，否则模型会返回一个 markdown 表格。用户希望按照提供的文档结构获得一个有序的主题列表。

### RAG

检索增强生成，没有任何框架（haystack，Langchain…）。这是语言模型中最常用的任务之一。回复的评估基于对指令的理解能力以及答案与文本的相关性。

### 真实的 RAG

这是一个与提供的上下文完全无关的问题的 RAG。模型必须回复“无法回答”，这意味着它理解了指令，并且没有使用任何外部知识或虚构的信息。

### 从参考文献撰写内容

这是一个创造性的任务。使用参考文本，SML必须提供一篇新的文章。

### 提取5个主题

此任务的重点是验证：

* 确保正好有5个主题
* 它们是基于事实的（没有虚构）

### 创意：1000字科幻故事

完全创造性的任务。即使对于更大的模型来说，要保持连贯性并产生一个符合字数要求的小故事也是非常困难的。

### 反思提示

反思提示旨在验证模型的链式推理过程。输出被限制在特殊标签的开头/结尾。重点是推理和一致的输出结构。输出必须易于用于进一步的结构化提示或可视化。您可以在本文中阅读更多内容：

## 评估过程

在每次生成结束时，用户会被要求用0到5的分数来评估结果。**在这种情况下，用户就是我……**

这种定性分析确实较为简单，因此每个分数都有一个描述，用户可以添加评论（“一些错误的信息”，“也许更改提示中的措辞会更好”）

这里是带有描述的定性矩阵

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*H_Qx2UT1lxqy2BF4.png)

## 好与坏 — 细节

总体而言，Qwen2.5–3B-instruct 是一个全方位的模型。每个任务的平均得分为 4.4 分（满分 5 分），这相当令人印象深刻。

摘要表现出色。在长文本中列出主要主题也非常好。

它在 RAG 中表现突出，有时显得过于冗长：在真实的 RAG 中，它还提供了一些解释，以及 *无法回答* 回复的原因。

我们可以一起看看。这对于 SML 来说，精确计算句子和段落的数量通常是一项艰巨的任务。

```python
**Write a two-sentences summary of the following text:**

China's regime under Chinese Communist Party operates without transparent 
elections and primary candidates. While undesirable for democracies, 
it allows long-term planning free from electoral pressures that can change 
plans abruptly; this has led to China achieving peak carbon dioxide emissions 
in 2023 due largely to increased renewable energy installations, potentially 
setting a new global standard for sustainable development despite its status 
as one of the world's largest polluters.
```

目录对于语言模型来说是另一个噩梦，因为它们通常理解如何创建表格……但看看这个：

```python
A "table of content" provides an organized structure to the text, allowing 
readers quick access to key points. Write the "table of content" of 
the following text.

[table of contents]
1. Introduction: Overview and Critique on China's Governance System  
2. Comparison with Western Democracies - Undesirable Dictatorship? 
3. Advantages in Long-Term Planning for Sustainability   
4. The Chinese Model as a Comparative Advantage  
5. Recent Achievements in Carbon Emissions Reduction
6. Transition to Renewable Energy: A Turning Point?
7. Potential Leadership Role of China and India  
8. Conclusion - Future Directions

```

我给真实的 RAG 评分 4 分（满分 5 分），但它本可以轻松得到 5 分。最重要的是，回复中必须包含 *无法回答* 这个词。

为什么？想象一下你在设置一系列提示，你需要根据先前的回复决定下一步。如果你可以简单地寻找 *无法回答* 这个词的存在来引导你的下一步，那就没问题了！

```python
**Reply to the question only using the provided context. If the answer 
is not contained in the provided context say "unanswerable".
question: who is Anne Frank?**
{context}
**Remember: if you cannot answer based on the provided context, say 
"unanswerable"
answer:**

Unanswerable
The given text does not provide any information about Anne Frank 
or her identity. The content is unrelated to this question and focuses 
instead on discussing China's system compared to Western democracies in 
terms of long-term planning for environmental issues.
```

我想象模型也被训练来提供这种回复的原因……太棒了！

### 优秀的反思

反思提示的主要焦点是模型返回正确推理过程的能力，并按照几个特定的标签开闭格式化输出。

到目前为止，这是**小型语言模型**中**最佳的反思输出**，甚至比Gemma2–2B更好：

```python
*👨‍💻 > You are an AI assistant designed to provide detailed, step-by-step 
responses. Your outputs should follow this structure:
1. Begin with a <thinking> section.
2. Inside the thinking section:
   a. Briefly analyze the question and outline your approach.
   b. Present a clear plan of steps to solve the problem.
   c. Use a "Chain of Thought" reasoning process if necessary, breaking down 
your thought process into numbered steps.
3. Include a <reflection> section for each idea where you:
   a. Review your reasoning.
   b. Check for potential errors or oversights.
   c. Confirm or adjust your conclusion if necessary.
4. Be sure to close all reflection sections.
5. Close the thinking section with </thinking>.
6. Provide your final answer in an <output> section.
Always use these tags in your responses. Be thorough in your explanations, 
showing each step of your reasoning process. Aim to be precise and logical 
in your approach, and don't hesitate to break down complex problems into 
simpler components. Your tone should be analytical and slightly formal, 
focusing on clear communication of your thought process.
Remember: Both <thinking> and <reflection> MUST be tags and must be closed 
at their conclusion
Make sure all <tags> are on separate lines with no other text. 
Do not include other text on a line containing a tag.

user question: explain why it is crucial for teachers to learn how to use 
generative AI for their job and for the future of education. 
Include relevant learning path for teachers and educators. *

**💻 > <thinking>
I will begin by analyzing the importance of teaching about Generative 
Artificial Intelligence (AI) in an educational context, then outline a 
step-by-step plan on what steps should be taken to learn this technology 
effectively as well as provide resources or courses that could help.
Firstly, understanding AI is crucial for teachers because it can 
significantly enhance their ability to support students. 
Teachers need the knowledge and skills necessary not only to integrate these tools into teaching but also understand how they work so they are able to guide both themselves and their pupils in ethical use of technology.
</thinking>

<reflection>
My initial thought process was clear, emphasizing that teachers should 
be equipped with AI literacy as it can improve educational outcomes. 
I outlined the importance for guiding students ethically while using 
these tools effectively.
However, my plan needs more detail on specific steps to learn about 
generative AI and resources available online or in-person courses.
</reflection>**
*MY PERSONAL NOTE: here it is starting an additional thinking after the first 
reflection... And this is really too good to be true!!*
**<thinking>
To create a comprehensive learning path that teachers could follow:
1. **Understand Basic Concepts**: Start with basic concepts of machine 
   learning (ML) such as supervised vs unsupervised, deep neural networks  
   etc., which are foundational to understanding generative AI.
2. **Learn About Generative Models**:
   - Study different types: Variational Autoencoders (VAEs), GANs.
   - Understand how these models generate new data that resembles the 
     training set but is not identical and can be used for tasks like 
     text generation, image synthesis etc., which are crucial in education.
3. **Explore Applications**: Look at real-world applications of generative 
   AI such as language modeling (e.g., GPT-2), computer vision techniques to 
   create realistic images or videos from raw data.
4. **Ethical Considerations and Implications for Education**:
   - Discuss the ethical implications, including bias in models' outputs 
     which could affect students’ perceptions about themselves if they are 
     exposed regularly through AI-generated content that is not representative 
     of them.
5. **Hands-on Practice**: Engage with practical exercises using open-source 
   tools like TensorFlow or PyTorch to build simple generative model 
   applications.
6. **Stay Updated and Network**:
   - Follow the latest research in ML, especially on Generative Models 
     by following relevant journals (e.g., NeurIPS), conferences such as 
     ICML etc.
7. Attend Workshops/Conferences: Participate actively at AI-related workshops 
   or events to network with professionals working within this field.
</thinking>**
*MY PERSONAL NOTE: and no surprise, an additional reflection now starts, 
before producing the final output*
**<reflection>
My plan has been expanded and includes a more detailed approach for teachers, 
covering foundational knowledge through practical application of generative 
models in education along with ethical considerations that are crucial. 
I have also included staying updated on the latest research as an important 
part.
However, it's essential to ensure these resources or courses exist so 
educators can access them easily.
</reflection>

<output>
It is vital for teachers and educational professionals alike to learn how 
generative AI works because this technology has significant potential in 
enhancing teaching methods. By understanding basic concepts of machine 
learning (ML) such as supervised vs unsupervised, deep neural networks etc., 
they will be better equipped with the knowledge necessary not only to 
integrate these tools into their curriculum but also guide students ethically.
A comprehensive plan for teachers and educators includes:
1. **Understand Basic Concepts**: Start by grasping foundational concepts of ML.
2. **Learn About Generative Models**:
   - Study different types: Variational Autoencoders (VAEs), GANs, etc., 
     which are crucial in generating new data that resembles the training 
     set but is not identical and can be used for tasks like text generation or 
     image synthesis.
3. **Explore Applications**: Look at real-world applications of generative AI 
   such as language modeling using tools like TensorFlow.
4. **Ethical Considerations**:
   - Discuss ethical implications, including bias in models' outputs which 
     could affect students’ perceptions about themselves if they are exposed 
     regularly through AI-generated content that is not representative.
5. **Hands-on Practice**: Engage with practical exercises to build simple 
   generative model applications using open-source tools.
6. **Stay Updated and Network**:
   - Follow the latest research in ML, especially on Generative Models by 
     following relevant journals (e.g., NeurIPS), conferences such as ICML etc.
7. Attend Workshops/Conferences: Participate actively at AI-related workshops 
   or events to network with professionals working within this field.
</output>
```

这样的精炼思维过程，以及清晰的标签开闭格式，可以方便后续的处理流程，或者在漂亮的GUI中进行美观的打印。

## 它不擅长什么？

最糟糕的任务是创作短篇小说。模型在生成过程中开始重复相同的段落。

这并不意味着它无法做到。更有可能的是，通过提高温度和重复惩罚，可以获得良好的结果。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*GNJ3lG6FM5qt9glIdf7qhQ.jpeg)

## 结论

您可以在我的GitHub仓库中找到所有聊天记录，以及代码和自行操作的说明。您可以参考我之前文章中的教程 [Qwen2.5 1.5b: 移动AI的未来？](https://ai.gopubby.com/qwen2-5-1-5b-the-future-of-mobile-ai-6bd5f29bbc84)

在接下来的文章中，我将介绍其他小型语言模型，使用相同的原则：从小型的350M参数，到500M系列，再到3B — 经过1.5B。


