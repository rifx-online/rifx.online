---
title: "OpenAI‘泄露’的 GPT2 模型让所有人震惊。"
meta_title: "OpenAI‘泄露’的 GPT2 模型让所有人震惊。"
description: "故意泄密？"
date: 2024-11-01T04:07:40Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*-G0yfSjGPdNw02NZ"
categories: ["Chatbots", "Generative AI", "Natural Language Processing"]
author: "Rifx.Online"
tags: ["GPT-2", "Chatbot", "Inference", "JSON", "AlphaGo"]
draft: False

---



### 故意泄漏？



OpenAI 对人工智能行业的影响不容小觑。每一个动作或决定都会自动成为头条……即使他们并没有真正宣布什么。

几天前，一个我们许多人曾试用过但已被删除的模型让整个人工智能行业着迷。这个名为“gpt2-chatbot”的模型在 [lmsys.org](https://chat.lmsys.org/) 的“直接聊天”功能中可以使用了几天。

*但为什么这么多喧嚣？*

因为这个模型与我们见过的任何东西都不同。**它处于一个完全不同的层次。**

因此，许多人认为它是 **ChatGPT-4.5** 或甚至 **GPT-5** 的非官方预告。更令人兴奋的是，使用数字“2”作为信号，表明 **新一代长推理模型的 GPT 正在逼近**。

甚至 OpenAI 的 CEO Sam Altman 也忍不住承认它的存在，并在过程中调侃我们：




那么，*这个模型到底有多好，它究竟是什么？*


> 你可能已经厌倦了人工智能通讯简报谈论某个事情是如何“刚刚”发生的。这些通讯简报层出不穷，因为粗略地谈论已经发生的事件和事情是容易的，**但提供的价值有限，炒作却被夸大。**


> 然而，谈论 **将** 会发生的事情的通讯简报却是罕见的。如果你想在别人之前获得易于理解的人工智能未来洞察，**TheTechOasis** 通讯简报可能非常适合你。


> 🏝️🏝️ 今天就订阅吧：

## 未来的预告

随着每一天的过去，OpenAI的下一个模型显然将在推理和复杂问题解决方面实现飞跃。

为了证明这个神秘的新模型可能就是它，这里有几个例子展示这个神秘模型的强大，可能表明这艘船已经在那个港口停靠：

> 以下所有示例被认为是**当前最先进模型**的**困难或完全不可能**的。

首先，它在零-shot模式下解决了一个数学奥林匹克问题（没有提供辅助示例来支持解决方案）：

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*oNPg_hTGc0OP90n9)

我甚至无法开始解释之前的例子有多疯狂，从当前最先进的模型中得到这样的答案绝对是不可能的。

[它在解析JSON方面也绝对出色](https://twitter.com/skirano/status/1785035706173214888)，这是LLM与API及其他基于网络工具集成的基本技能。

此外，它在复杂绘图任务中完全压倒了GPT-4，例如[根据代码绘制SVG文件](https://twitter.com/decentricity/status/1785049191003361778)或**使用ASCII代码绘制独角兽（如下）**，在这个过程中羞辱了**Claude 3 Opus**，当前的最先进模型：

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*5A0EcRU91ZYAwVAc)

此外，尽管这很可能是一次幻觉，**模型向我声称它是由OpenAI训练的，并基于GPT-4变体。**

当然，在如此强大的演示之后，**许多人建议“gpt2-chatbot”甚至可能是著名的Q\*模型**。

但与其简单地屈服于人们声称的不同奇幻选项，不如采取更理性的方式，看看OpenAI自己在几个月（甚至几年）里通过他们的研究所暗示的内容。

## 长推理的力量

几个月来，像 [Demis Hassabis](https://www.youtube.com/watch?v=eqXfhejDeqA&t=2s) 或 [Andrej Karpathy](https://youtu.be/c3b-JASoPi0?si=fZWoSpLuSmua8YMR&t=1481) 这样的领域专家讨论了仅靠 LLMs 是不够的，我们需要“其他东西”来真正将它们提升到一个新的水平。

在这两种情况下，他们提到实现相当于“AlphaGo 但在 LLMs 中”，这间接指的是：

* **自我提升** 和
* **测试时计算** LLMs

*但他们这是什么意思呢？*

### 人工智能的巨大飞跃

AlphaGo 是人工智能的历史。它是第一个在围棋这一韩国棋类游戏中毫无疑问地超越人类实力的模型。

它使用了 **Monte Carlo Tree Search**，一种搜索算法，来探索游戏中任何给定步骤的可能走法，能够超越当前的动作并预测对手的行动。

> 你们中的一些人可能还记得 **Deep Blue**，那台在1997年与加里·卡斯帕罗夫的系列赛中第二局勉强战胜他的国际象棋机器，在第一局中输掉了比赛。

> 然而，尽管 Deep Blue 可以被击败，但 AlphaGo 是无敌的。

*但这是怎么做到的？*

### 自我提升以达到超人水平

使AlphaGo卓越的关键因素在于它的训练方式，**通过与自身的较弱版本对弈来创建自我提升循环。**

它持续与自己对弈，逐渐将ELO提升至3\.739，几乎达到了当今最佳围棋选手的水平。

> 2017年，改进版的AlphaZero达到了5\.018的ELO，完全超越人类，无法击败。

换句话说，有了AlphaGo，人类首次实现了一种通过自我提升来训练模型的方法，使其能够达到超人能力，**因为它不再依赖模仿人类来学习。**

如果你在想，这对LLMs并不适用。

当前的LLMs完全依赖于人类水平的表现，因为所有数据和训练本质上都依赖于人类（以至于[对齐阶段](https://thewhitebox.ai/llms-the-backbones-of-frontier-ai/)——LLMs被建模以提高其安全水平并避免冒犯性反应的训练过程的一部分，**严格执行时使用的是“人类偏好”**）。

> 顺便提一下，[Meta最近提出了自我奖励模型](https://arxiv.org/pdf/2401.10020v1)，可以通过自身的反应进行自我提升。然而，目前尚不清楚这个反馈循环是否真的能使LLMs超越人类。

但尽管仍然很难相信“gpt2\-chatbot”是通过自我提升训练出来的，**我们有充分的理由相信它是OpenAI多年来努力工作的第一个成功实现：测试时计算**。

### 测试时计算模型的到来

多年来，OpenAI的几篇研究论文暗示了将模型偏向“重推理”的这一想法。

例如，早在2021年，[他们提出了在推理时使用“验证者”的概念](https://arxiv.org/pdf/2110.14168)，以改善模型在处理数学问题时的响应。

这个想法是训练一个辅助模型，实时评估模型给出的多个响应，选择最佳的一个（然后提供给用户）。

这与某种树搜索算法相结合，比如AlphaGo使用的那种，结合Google Deepmind的[思维树研究](https://arxiv.org/pdf/2305.10601)的例子，最终可以创建一个LLM，在回答之前，探索“可能响应的领域”，**仔细过滤并选择通向解决方案的最佳路径。**

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*pHWwOA66fxpKbl-z)

这个想法虽然在2021年由OpenAI提出，但如今已经变得相当流行，[微软和谷歌的跨界合作研究将其应用于训练下一代验证者](https://arxiv.org/pdf/2402.06457)，谷歌甚至成功创建了一个模型，[Alphacode](https://storage.googleapis.com/deepmind-media/AlphaCode2/AlphaCode2_Tech_Report.pdf)，以极大的成功执行这种架构，**在竞争程序员中达到了85%的百分位，成为最优秀的人类程序员之一。**

*那么，为什么这一代新的LLM具有如此巨大的潜力？*

因为**它们在解决问题时与人类的方式非常相似**，通过有意识和广泛的思考来解决特定任务。

归根结底，把“搜索+LLM”模型视为AI系统，它们在模型的实际运行时间上分配了更高程度的计算（类似于人类思维），因此，它们不必立即猜测正确的解决方案，而是简单地说，“有更多时间来思考”。

但OpenAI更进一步。

### PRM 模型以改善数学执行

在去年五月，他们发布了论文 [Let’s Verify Step\-by\-Step](https://arxiv.org/pdf/2305.20050)，参与者包括 OpenAI 的首席科学家 Ilya Sutskever 以及一些来自原始验证者论文的研究人员，如 Karl Cobbe。

这里的想法是修改在模型对齐阶段使用的奖励模型。

[虽然我建议查看这篇文章以获取关于 LLM 训练的完整指南](https://thewhitebox.ai/llms-the-backbones-of-frontier-ai/)，创建 ChatGPT 等产品过程中的最后一步是使用人类反馈强化学习，或 RLHF。

这个想法是让模型改善其决策能力。因此，我们训练一个辅助奖励模型（本质上是被训练模型的几乎相同副本），它学习根据人类偏好对训练模型的结果进行排名。

*问题是什么？*

好吧，今天大多数奖励模型是 **ORMs，或结果监督奖励模型**。通俗来说，评估模型预测的正确程度时，他们从整体上看待，而忽略了整个“思维过程”。

另一方面，**PRMs，或过程监督奖励模型，评估模型响应中的每一个步骤**。因此，他们“迫使”模型在过程的每一个步骤上都付出密切的关注和努力，这在解决如下数学方程等情况中至关重要：

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*8JC6sZl5UFfl3WorliQy-A.png)

然而，这是一个非常非常昂贵的过程，因为偏好数据需要大量的人力构建，以便可以应用监督信号。因此，每一个训练示例都有数十个或更多的奖励来进行测量。

因此，“gpt2\-chatbot”可能在奖励训练中包含某种变体，考虑到它在生成计划和执行复杂问题解决方面的高效性。

## 不禁让人兴奋

考虑到gpt2-chatbot的惊人表现，以及OpenAI最近的研究和[泄露](https://www.reuters.com/technology/sam-altmans-ouster-openai-was-precipitated-by-letter-board-about-ai-breakthrough-2023-11-22/)，我们现在可能对这个东西有了相当不错的了解。

我们可以肯定的是，我们很快将面临一个完全不同的存在，它将把AI的影响提升到一个新的水平。

* *我们是否终于达到了大型语言模型超越人类水平表现的里程碑，就像我们在AlphaGo中所做的那样？*
* *长推理时代，即AI征服系统2思维的时代，是否已经到来？*

可能还没有。然而，无法不对接下来几个月我们即将见证的惊人发展感到高度乐观。

与此同时，我想我们将不得不等待这些答案。但不会太久。

> 最后，如果你喜欢这篇文章，我在我的[LinkedIn](https://www.linkedin.com/in/ignacio-de-gregorio-noblejas/)上以更全面和简化的方式免费分享类似的想法。

> 如果方便的话，你可以通过[X](https://twitter.com/TheTechOasis1)与我联系。

> 期待与你的联系。

