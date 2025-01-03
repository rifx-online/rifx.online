---
title: "什么是人工智能代理？构建自己的人工智能代理的分步指南。"
meta_title: "什么是人工智能代理？构建自己的人工智能代理的分步指南。"
description: "AI代理被认为是未来技术的一个重要趋势，能够自主处理复杂任务，如保险索赔管理。与传统AI系统不同，AI代理不仅能响应用户输入，还能从头到尾管理多步骤任务，具备自动化和决策能力。构建AI代理涉及数据分类、提取、外部服务调用及信心评估等步骤，能够显著提高工作效率，自动化70%-90%的工作量。"
date: 2025-01-03T00:22:01Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*LxIyh8pAhZqXl3ADn_pz3A.jpeg"
categories: ["Autonomous Systems", "Data Science", "Technology"]
author: "Rifx.Online"
tags: ["agents", "automation", "workflows", "data", "extraction"]
draft: False

---



**下一个大趋势？** Gartner认为AI代理是未来。OpenAI、Nvidia和Microsoft对此寄予厚望——包括Salesforce等公司，它们在AI领域迄今为止表现得相对低调。

毫无疑问，这一事物现在正在迅速发展。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*wxbaaC3vQZYiBYzz5AGhBQ.png)

哇。

那么，这一趋势背后真正的原因是什么？理解代理的关键在于**代理性**。

与传统的生成式AI系统不同，代理不仅仅是响应用户输入。相反，**它们可以从头到尾处理复杂的问题，例如保险索赔**。这包括理解索赔的文本、图像和PDF，从客户数据库中检索信息，将案例与保险条款进行比较，向客户提问并等待他们的回应——即使这需要几天——也不会失去上下文。

**代理是自主完成这一切的**——不需要人类检查AI是否正确处理所有内容。

## 意式咖啡机与咖啡师

与现有的人工智能系统和所有的副驾驶相比，**人工智能代理实际上是完全成熟的员工**，为流程自动化提供了巨大的潜力。

**想象一下**——一个可以承担复杂多步骤任务的人工智能，这些任务目前由人类员工或整个部门执行：

* 规划、设计、执行、测量和优化**市场营销活动**
* 通过与承运人、客户和仓库沟通，**定位物流中的丢失货物**——或者，如果仍然丢失，则向负责的合作伙伴索赔其价值。
* **每天搜索商标数据库**，确定是否有新注册的商标与我自己的商标冲突，并立即提出异议
* 收集相关数据或询问员工，检查数据并**编制ESG报告**

目前，人工智能模型可以协助生成活动内容或评估电子邮件，但它们缺乏执行整个流程的能力。**人工智能代理可以做到这一点。**

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*V8B2X23xlhZ9gcdCwIAA6A.png)

**传统模型就像优秀的意式咖啡机，而基于代理的人工智能则是咖啡师。** 它们不仅可以制作咖啡，还可以迎接客人、接受订单、提供咖啡、收取费用、将杯子放入洗碗机，甚至在晚上关店。即使是世界上最好的意式咖啡机也无法独自运营一家咖啡馆，但咖啡师可以。

为什么人工智能代理和咖啡师能做到这一点？它们擅长掌握复杂工作中的各种子流程，并能够独立决定接下来要处理的任务。它们可以与人沟通，比如客户，如果需要更多信息（牛奶还是燕麦奶？）。它们可以决定在出现问题时应该询问谁（豆子用完了 \=\> 找老板，咖啡机罢工 \=\> 找机器供应商的客服）。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*7rWViLLiWpoHivd15UHZTQ.png)

## AI工作者的结构

但聊得够多了，让我们来构建一个AI代理。让我们看看相关的流程和工作流。

让我们**为上面图示的保险流程构建一个代理**。该代理应从开始到报销处理保险索赔。

我们在这里开发的是**业务架构和流程流。** 不幸的是，我无法深入编码，因为这可能会迅速变得非常庞大。

### 1\. 分类与将工作发送到处理通道

我们的工作流程开始于，当客户向保险公司发送一条**关于他们家庭保险索赔的消息。**

我们的代理做什么？它通过分析消息的内容来确定客户的需求。

基于此分类，系统启动一个处理通道。通常，这超出了[函数调用](https://platform.openai.com/docs/guides/function-calling)的范围；它涉及对流程做出基本决策，然后执行许多离散步骤。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*CvV2Yu0Nk43LN7GUDO8JPQ.png)

### 2\. 数据提取

在下一步中，数据被提取。**代理的主要任务之一是将非结构化数据转换为结构化数据**……以使处理**系统化、安全和可靠**。

**分类将文本分配给预定义的类别，而提取则涉及从文本中读取和解释数据。**然而，语言模型并不会直接从输入提示中复制数据；相反，它生成一个响应。这允许数据格式化，例如将电话号码从‘(718\) 123–45678’转换为‘\+1 718 123 45678’。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Q8o6a2-Fe1FbqIOS7I3EaQ.png)

数据提取不仅限于文本内容（来自电子邮件文本），还可以包括来自图像、PDF或其他文档的数据。我们为此使用不止一个模型：LLMs、图像识别模型、OCR等。上述过程被简化了，实际上是极度简化。在现实中，我们经常将图像发送到OCR系统，以从扫描的发票或表单中提取文本……而且我们通常在分析之前也会对附件进行分类。

我们强制要求JSON作为模型的输出格式，以确保结构化数据。

这是电子邮件输入——**非结构化数据**：

```python
Hi,

I would like to report a damage and ask you to compensate me.

Yesterday, while playing with a friend, my 9-year-old son Rajad kicked a soccer ball against the chandelier in the living room, which then broke from its holder and fell onto the floor and shattered (it was made of glass). 

Luckily no one is injured, but the chandelier is damaged beyond repair. 

Attached is an invoice and some images of the destroyed chandelier.

Deepak Jamal
contract no: HC12-223873923
123 Main Street
10008 New York City
(718) 123 45678
```

这是模型输出——一个JSON，**结构化数据**：

```python
{
  "name": "Deepak",
  "surname": "Jamal",
  "address": "123 Main Street, 10008 New York City, NY",
  "phone":"+1 718 123 45678",
  "contract_no": "HC12-223873923",
  "claim_description": "Yesterday [Dec-8, 2024], while playing with a friend, my 9-year-old son Rajad kicked a soccer ball against the chandelier in the living room, which then broke from its holder and fell onto the floor and shattered (it was made of glass).\nLuckily no one is injured, but the chandelier is damaged beyond repair.\n"
}
```

### 3\. 调用外部服务，使上下文持久化

许多生成性AI系统可以直接回答查询——有时使用预训练数据、微调或在某些文档上进行检索增强生成（RAG）。这对代理来说是不够的。**几乎每个合理强大的AI代理都需要访问企业或外部数据库中的数据。**

**为了使过程的上下文在当前会话之外保持持久，它还必须将数据写入系统和数据库**。在我们的案例中，代理检查合同编号与客户数据库的匹配，并将索赔状态写入问题跟踪系统。它还可以——记住：代理权！——向外部方请求缺失的数据，例如客户。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*UjA1UCxseKtTDiZWDjmVWg.png)

### 4\. 评估、RAG、推理和信心

每个管理工作的核心在于根据各种规则解释来电案件。AI 在这方面特别擅长。因为在调用模型时我们无法提供所有上下文信息（例如，政策内容或条款和条件），**我们使用向量数据库来检索相关片段——这是一种称为 RAG 的技术**。

我们还提示 AI **“思考 aloud”**，然后再做出评估。在说出结果之前进行思考可以提高答案质量——这是我们从三年级数学课上学到的东西。我们还可以以许多明显和不明显的方式使用模型推理的输出：\- 证明给客户的答案\- 帮助提示工程师和数据科学家弄清楚模型为什么犯了错误\- 进行检查：模型是偶然得出了正确答案，还是我们可以通过其推理看出解决方案是必然的？

**信心是最大化准确性的关键。** 如果模型估计其信心——亲爱的提示工程师，这也需要非常好的少量示例来展示各种信心值——那么我们可以配置系统以极高的安全性或高自动化运行：我们设定一个信心阈值，低于该阈值的所有案件都应转交给人工支持。较高的阈值确保最小错误，但需要更多手动处理，而较低的阈值则允许更多案件自动处理，尽管增加了错误的风险。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*-kJEBbVKpueHaNxEmvlLXw.png)

瞧！如果您刚刚实施了上述 2 或 3 个步骤，您就已经开发了一个代理。我仅概述了这些 AI 代理的关键组件。您当然可以想象其他组件。**您可以借助像 crewAI、langGraph、langFlow 及其同类框架来实现，或者仅仅使用纯 Python 来完成。**

值得注意的是，这样的系统可以自动化 70%–90% 的索赔管理部门的工作量。而这在简单的预代理生成 AI 系统中是无法实现的。两年前，我从未想过这会如此快速地成为现实。

tl;dr？以下是 AI 代理的简要概述：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*tljAv3gFZUqC4LeKr-ATUQ.png)

这些代理在接下来的几个月里肯定会让我忙碌——我和我的团队刚刚启动了一个大型物流系统。

祝您在 AI 和代理 AI 系统方面一切顺利！


