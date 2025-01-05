---
title: "2025 年学习人工智能的最快方法"
meta_title: "2025 年学习人工智能的最快方法"
description: "本文提供了一种快速学习人工智能的方法，强调以实际应用为导向，而非单纯学习编程语言如Python。建议从API开始，利用在线平台如Colab和Kaggle进行实践，避免安装复杂的软件。同时，Hugging Face被推荐作为AI产品的搜索引擎，帮助用户寻找和测试模型。在学习过程中，理论知识应在实际需要时再学习，以提高学习效率。通过这种方法，读者可以更有效地掌握AI工具和应用。"
date: 2025-01-05T02:04:10Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*B9jdpxqgZrkbPIaL7wDvrQ.png"
categories: ["Programming", "Machine Learning", "Natural Language Processing"]
author: "Rifx.Online"
tags: ["APIs", "Colab", "HuggingFace", "practical", "applications"]
draft: False

---

### 为什么短期有效时还要选择长期？

本博客旨在为您提供一条清晰的捷径，让您在AI领域入门的同时探索新的AI产品，以保持您的动力。我不会包含令人不知所措的建议，比如

> “嘿，您应该开始学习Python，因为它是最常见和流行的编程语言……”

或任何图表，如下所示：



大多数搜索**“如何学习AI”**的人立刻会面临诸如ML和DL等术语，这可能会让人感到沮丧，并使AI看起来很困难。然而，考虑这一点：如果通过掌握全栈技术（理论/编程）来学习AI是正确的方法，那么像Pranjali Awasthi这样的16岁少女创办Delv.AI并筹集了近50万美元投资，或像Alexandr Wang这样的24岁年轻人通过AI成为全球最年轻的白手起家亿万富翁并创建了一家成功的初创公司，都是不可能的。许多18岁或20岁以下的年轻人正在破解代码并赚取丰厚的收入，他们并不是专注于如何学习AI，这可能导致无尽的学习新产品、工具或每周发布的项目的循环，而是专注于学习

> 如何使用AI，这才是关键问题！

即使您通过一般的方法开始学习AI，我们大多数人也会从Transformer架构开始，特别是因为我们都是因为ChatGPT而进入AI领域。不久之后，我们就会迷失在理论的技术复杂性中，即使我们理解了它，我们也会想知道如何复制它，正如您已经知道的那样，这是不可能的。然后，我们往往会转向探索在线可用的AI工具，而不是学习它们，并开始思考它们的商业用例。

要真正学习AI，关键在于如何以不同于其主要目的的方式使用这些AI产品，利用和实施它们以保持领先一步，充分利用它们无尽的可能性。

## 目录

* 从 APIs 开始，而不是 Python
* 不要安装任何东西
* 将 HuggingFace 作为搜索引擎
* 成为一个聪明的免费资源寻求者
* 需要时再学习理论
* 快速谷歌搜索
* 让我们实现这个博客

## 从 API 开始，而不是 Python

大量博客会告诉你要从 Python 开始，因为它是最常用和最受欢迎的语言，虽然这是真的，但 Python 本身是一个完整的生态系统。你至少需要 6 个月的时间来学习 Python，而到那时，可能会有新的热门 AI 主题出现。然而，如今大多数 AI 工具都是通过 API 提供或运行的，这只是编程的一个很小部分。这给了我们一个优势：你不需要一台强大的笔记本电脑或开始学习 Python 就可以使用 AI。API 只是 Python 中一个小而快速、易于学习的部分。因此，API 应该是你首先关注的内容。

对于那些不理解 API 是什么的人，可以把它想象成餐厅里的服务员。它是这样工作的：

* 你（顾客）想要一些东西（比如食物）。
* 厨房（系统）有食物，但你不能自己去那里拿。
* 服务员（API）把你的请求带到厨房，并把你要的食物带回来。

在技术层面上，其他人正在为你运行 AI 产品，你使用他们的 API 来与产品互动。这种 API 学习方法不仅减少了你的 **学习负担**，而且消除了对高性能笔记本电脑或 PC 的需求。

## 不需要安装任何东西

是的，标题并没有误导你，你不需要安装任何东西。正如我提到的，我们将使用API来学习AI，这使你可以绕过将AI产品加载到你的PC或笔记本电脑上的需求。那么Python和其他工具呢？有三个著名的在线环境可以为你解决这个问题：

* Colab: [https://colab.research.google.com/](https://colab.research.google.com/)
* Kaggle: [https://www.kaggle.com/](https://www.kaggle.com/)
* Lightning AI: [https://lightning.ai/](https://lightning.ai/)

还有许多其他平台允许你在不安装任何东西的情况下工作，而这三个是其中最好的。 在这三者中，Colab是首选。但它们到底是什么呢？

Colab、Kaggle和Lightning AI是在线工具，让你可以在不需要下载或安装任何东西的情况下进行AI和编码工作。它们完全在你的网络浏览器中运行，使其使用起来非常简单。

## HuggingFace 作为搜索引擎

现在，人工智能领域每天都在疯狂发展，容易让人感到自己被抛在了后面。正如我之前提到的，每一天都有新的人工智能初创公司出现，这些公司无非是利用巨头们的 API。同时，这些巨头们通过每周甚至每天推出突破性的产品引领市场。在人工智能领域发生了如此多的事情，以至于你需要一个专门的搜索引擎来关注人工智能产品。有很多选择，但 Hugging Face 是人工智能的“谷歌”，是获取人工智能产品更新的最简单和最受欢迎的来源。

如果你访问 Hugging Face 的模型页面 ([https://huggingface.co/models](https://huggingface.co/models))，即使是零基础的人也可以搜索文本到图像模型。你会发现很多这样的模型，按趋势排序。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Gzl8GBs7duEv2bPOZlz78A.png)

假设你遇到了“LLaMA\-3\.3 70B”模型，它类似于 OpenAI 在 ChatGPT 背后的模型。下一步是访问 Hugging Face 的空间标签 ([https://huggingface.co/spaces](https://huggingface.co/spaces))，大多数人工智能产品都在这里托管。你可以搜索你感兴趣的模型并进行测试，所有这一切无需安装或运行任何东西，只需将 Hugging Face 作为你的搜索引擎！

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*qO9phDLEIbNx7wraRYaHSw.png)

此外，还有通过 API 使用模型的选项，这是我们在 Hugging Face 平台上以零基础开始的第一步，之后再实施我们自己的策略。

然而，有一点重要的是，如果你喜欢的模型在 Hugging Face 空间中不存在怎么办？这就是你下一个章节的开始：你需要成为一个聪明的“免费资源”寻求者。

## 成为智能的免费资源寻求者

大多数情况下，您喜爱的模型可能不在 Hugging Face Spaces 上，但您可以使用 Google 来帮助解决这个问题。例如，如果“LLaMA\-3\.3 70B”在 Hugging Face Spaces 上不存在，您接下来应该在线搜索一下，看看是否可以通过 API 获取。例如，当我需要 LLaMA\-3\.3 70B 时，我发现了 [Nebi.us](https://nebius.com/)，它提供 $100 的免费积分，通过他们的 API 提供这个 AI 产品。这 $100 足够让您探索该产品并查看它对您有多大帮助。

您应该能找到很多其他平台，但您很有可能会喜欢已经存在于 Hugging Face Spaces 上的产品。

[https://nebius.com/](https://nebius.com/)

## 理论在需要时

这是自学者最重要的部分，许多人在这里挣扎，你们大多数人可能会面临这个挑战。然而，我处理这个问题的方法是，你应该首先搜索你感兴趣的产品，而不是直接进入理论学习。市场上有很多产品，其中大多数不会引起你的兴趣或带来任何实际用途，这意味着学习它们没有优势。在AI产品中，相同的模型往往会成为趋势。例如，我感兴趣的LLaMA\-3\.3模型是最受欢迎的模型之一，你很容易找到一个讲解它的YouTube视频。但是，如果你的兴趣在于一个非趋势的AI产品呢？

如果你没有任何知识，第一步是搜索关于该模型的技术博客或信息。例如，我找到了DataCamp关于LLaMA\-3\.3的博客：[LLaMA\-3\.3 70B 博客](https://www.datacamp.com/blog/llama-3-3-70b)。将博客中的技术内容复制并粘贴到这个聊天窗口：[Gemini on AI Studio](https://aistudio.google.com/app/prompts/new_chat)。你可能听说过Gemini，它是Google推出的ChatGPT的竞争对手。我建议使用Gemini的原因是它的工作方式与ChatGPT相似，但具有更大的内存，可以记住较早的消息。

启动与Gemini的聊天，使用你感兴趣的模型的技术博客内容，并确保用你自己的方式提问，而不仅仅是阅读别人的风格。这样，你就不会让自己感到不知所措。当你问：“嘿，你能解释一下LLaMA\-3\.3是如何创建的吗？”Gemini会回应，这将引发你脑海中新的问题，你可以继续探索，直到你觉得对这个AI产品有足够的信息。之后，你可以观看YouTube视频或更深入地研究该模型。

关键在于，不仅要学习你喜欢的产品的理论，还要继续使用你在网上找到的模型内容与Gemini聊天。这种方法将帮助你引导并加深你的理解。

[https://aistudio.google.com/app/prompts/new_chat](https://aistudio.google.com/app/prompts/new_chat)

## 快速的谷歌搜索

我在完成硕士论文时经历的一件事是，当我完成它时，一种新的替代AI发明已经在市场上推出，使我在论文中使用的方法瞬间过时。我觉得分享这一点很重要，因为即使是像我这样在AI领域工作多年的人员，往往也会发现自己处于同样的境地，学习的东西很快就变得过时。在某个时刻，我们都需要再次学习新的东西。这时我了解到，无论何时你在AI领域遇到瓶颈，最好的方法就是直接开始使用谷歌进行实施。看看它是否已经存在并且可以免费使用。如果可以，就重新使用它，或者找到一个捷径，快速学习足够的内容，这将给你足够的信心去搜索关于该产品的正确关键词。

在我论文即将完成的最近几天，我自己也这样做了。我搜索了使我的论文过时的新替代方案，并检查了它的AI技术代码是否已经存在。这让我能够重新使用它，并通过ChatGPT学习其中的一部分，以便我的论文能够融入最新的技术。这就是你如何保持对感兴趣模型的更新。

## 让我们实现这个博客

所以，让我们实现之前的步骤，看看我们能走多远。我将假设我对人工智能一无所知，但在观看了YouTube Shorts后，对它产生了浓厚的兴趣！

正如我提到的，Hugging Face是搜索引擎，我对图像聊天模型感兴趣。我在YouTube上看到过类似的东西，可以与图像聊天。我觉得很有趣，所以我想在Hugging Face的模型部分搜索一下。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*IHoA7GyZT-9vk4Tu1Vjilg.png)

我去了Hugging Face，使用过滤器（文本到图像）进行搜索，发现Flux.1-dev模型作为新手因为下载量而引起了我的兴趣。然而，你可能会因为某种合理的原因对其他模型更感兴趣。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*GwzN9QnzewE8UeQNZAotXw.png)

我访问了模型页面，想看看如何将其用作API。我首先观察到的是，我们可以直接在网站上运行它，以查看它是如何工作的。这简化了事情，因为在这种情况下不需要使用API。让我们通过创建一幅“自然景观”的图像来检查网站是否正常工作。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*0S6rT4iHZtpEY2FmAFj7rA.png)

现在你觉得它很有趣，并且在使用网站演示时表现良好，让我们看看如何将其用作API。让我们在Hugging Face Spaces上搜索一下，看看它是否通过API存在。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*abQKpNgtw_Df6mx1PUNLGQ.png)

我们也在Spaces上找到了它作为API。如果它在Spaces上不可用，我们会使用Google搜索一个免费的API提供者。但幸运的是，我们在同一模型页面上找到了它并且可以运行。

所以，让我们点击“用作API”，看看会出现什么。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ZhSZJtkFJn1BKLUDKAf9hA.png)

如果你熟悉API，这个教程可能不会太难，但如果你对API一无所知，我们可以做的就是简单地复制内容并粘贴到ChatGPT中。所以，让我们这样做。

你可以请ChatGPT解释一下，但因为我们很着急，我们应该问ChatGPT如何在Colab上实现它，以运行并绘制一幅自然的图像。

ChatGPT告诉你去[Google Colab](https://colab.research.google.com/)并创建一个新的笔记本。在第一个代码块中，运行`!pip install gradio_client`。我这样做了，然后在下一个代码块中，我只是粘贴了确切的代码，提示词是“nature”。我这样做了，但我得到了这个：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*bNkac1SHPhO0EkvO_Z5ZHw.png)

然后我去查看我的第一个AI API生成的图像的图像路径，结果是这样的。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*HbG8_Fe9V6xscaGu4QDTtw.png)

这就是如何将API学习与探索模型连接起来。你探索的模型类型越多，你就越能探索Python代码用于API的各种方式。你可以进一步使用ChatGPT来理解它如何定义代码，你可以做哪些更改，以及这些更改将如何影响图像。有很多东西可以探索。


