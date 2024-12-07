---
title: "克劳德的新款 3.5 Sonnet 性能超过了 OpenAI 的 O1-mini。我很震惊。"
meta_title: "克劳德的新款 3.5 Sonnet 性能超过了 OpenAI 的 O1-mini。我很震惊。"
description: "本文对比了OpenAI的o1-mini模型和Anthropic的Claude 3.5 Sonnet模型，重点分析了它们在生成SQL查询和JSON对象方面的表现。Claude 3.5在SQL生成任务中表现优异，速度快、成本低且响应准确。然而，在JSON生成任务中，两者各有优劣，Claude更符合用户请求，但在修正输出时表现固执，而o1-mini生成的投资组合表现更佳。总体而言，Claude 3.5在日常任务中更具实用性，但选择哪个模型仍需视具体情况而定。"
date: 2024-12-07T12:38:04Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Xr24P55E2BoCNKwQ8Jx4Yw.png"
categories: ["Programming", "Generative AI", "Data Science"]
author: "Rifx.Online"
tags: ["Claude", "SQL", "JSON", "performance", "cost-effectiveness"]
draft: False

---



### Claude更新的3.5 Sonnet模型的并排比较

当OpenAI发布GPT-4o时，我充满期待……但很快就失望了。尽管GPT-4o比GPT-4更快且成本更低，但其表现明显不如前者。如果不考虑成本，原始的GPT-4（和Claude 3.5）显然是更好的模型。

今天，Anthropic发布了更新的3.5 Sonnet模型。像Reddit这样的在线社区对此赞不绝口，解释它比之前的版本更具思考性和强大。

我对此感到难以置信。



在使用这个模型15分钟后，我得出了一个惊人的结论。

这个模型不仅仅是好。它简直是不可思议的好。

而且它在相同（大致）成本下比OpenAI的o1-mini更好。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*pb2_n_sZx9hK2hflCBWGiQ.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*InOQzDDjIuybxhaj2JNQKg.png)

## 回顾：OpenAI的o1模型与Claude 3.5 Sonnet之间的区别

当OpenAI的新o1模型发布时，它是自ChatGPT发明以来最受关注的事物。

与其他大型语言模型相比，o1模型处理问题的方式是：先将问题分解，回答子问题，然后生成最终输出。

这个过程被比作人类如何“思考”和“推理”复杂问题。

我也被这种热潮所吸引。在发布时，我写了一篇文章，讲述这些模型如何在第一次尝试时生成高效的算法交易策略。我仍然认为它们是有效的。

然而，尽管它们的原始准确性和推理能力令人印象深刻，但我没有考虑到这些模型的其他一些同样极其重要的方面。

o1模型不仅速度慢……

它们也非常昂贵。尤其是如果你使用更强大的o1-preview模型。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*NjYAAiTvWWZdtj7KbBeE9g.png)

当模型发布时，我像对待其他模型一样将其启用到我的应用中。我的应用有“研究令牌”，我将该模型的定价与其他高级模型如GPT-4相同。

具体来说，我让o1-preview模型的使用费用为用户*1个研究令牌*。

由于缺乏限制，我在一天内花费了81美元。

o1系列模型很好，但它们并没有那么好。对于我能想到的几乎任何用例而言，这种极高的成本并不值得换取这些模型略微更好的有效性和准确性。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*IdZYdw7avDcoj3GbPyYdaA.png)

然而，新的Claude 3.5 Sonnet则是另一个故事。

它不仅表现出色，在许多复杂推理任务中超越o1-mini，而且它也便宜——与GPT-4o一样便宜。

不过，它确实有一些缺陷。Sonnet很固执，当它的输出错误时，难以在不更新系统提示的情况下修复。然而，我们稍后会讨论如何通过提示工程来减轻这些缺陷。

## GPT\-o1\-mini与更新版Claude 3\.5 Sonnet的并排比较

为了测试该模型的有效性，我进行了两个不同的实验：

1. 用自然语言生成复杂的SQL查询
2. 用自然语言创建复杂的JSON对象

这些是我为我的AI驱动的交易平台[NexusTrade](https://nexustrade.io/)提供的功能。NexusTrade使零售投资者能够轻松进行金融研究并开发算法交易策略。

因此，使用NexusTrade，我们将测试Claude 3\.5 Sonnet的有效性。让我们开始生成SQL查询。

### AI驱动的股票筛选器与GPT o1-mini

AI驱动的股票筛选器是NexusTrade的独特功能。它允许用户使用自然语言找到基本面强劲的投资。

具体来说，它将用户请求转换为SQL查询。然后在数据库中执行该SQL查询，以找到用户想要的股票。

为了测试GPT o1-mini与Claude 3.5 Sonnet的有效性，我们使用了以下查询。

> 什么AI股票的评级为4或更高，并且本月表现较低？按评级降序排列，对于并列的情况按市值降序排列

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*0dYpxlzv0qG0geiZPeB0IQ.png)

虽然确切的响应格式是主观的，但我们将评估模型是否给出了我们所要求的股票。

GPT o1-mini没有。

列表中的首只股票NVIDIA处于历史高位。此外，如果我们检查由GPT o1生成的SQL查询，它根本没有对本月表现较低的股票进行任何过滤。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*oJ8iquMeLLGZ7RTE4Po4qg.png)

相比之下，Claude在我第一次尝试时就*非常准确*地理解了我的意思。

### AI驱动的股票筛选器与3.5 Sonnet

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*rBi_8Gj87PgA2GKuQc9KCw.png)

向3.5 Sonnet提出完全相同的问题时，我们注意到几个方面：

* 响应格式更整洁（尽管这是主观的）
* 响应生成速度快了很多倍
* 使用Sonnet的成本可能远低于使用o1-mini
* **最重要的是，响应更准确**

如果我们检查SQL查询，可以看到模型理解了我们所说的“本月低点”，并生成了与我们期望相符的查询。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*hnKiHLf25YnKyMjK0yqiMg.png)

这真是太不可思议了！与GPT的模型相比，响应几乎在各个方面都更好。

然而，这是否意味着Claude 3.5 Sonnet是更好的模型？

未必。

### 使用 GPT o1-mini 创建算法交易策略

我们的下一个测试将检验这些模型在生成符合我们请求的语法有效的 JSON 方面的有效性。具体来说，我们将使用这些模型来创建算法交易策略。

我在 [之前的一篇文章中](https://medium.datadriveninvestor.com/i-used-openais-o1-model-to-develop-a-trading-strategy-it-is-destroying-the-market-576a6039e8fa) 解释了这个过程是如何工作的。总结来说，在创建投资组合时，一个提示的输入被用作另一个提示的输出。这创建了“提示链”，使我们能够创建深度嵌套和复杂的对象。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*ywNbmdTa-BdQ05SU.png)

在这种情况下，对象是一个投资组合，包含策略（进出交易的规则）、条件（策略执行时的布尔触发器）和指标（关于市场的数值观察）。

为了创建一个投资组合，我们将在聊天中说以下内容。

> 我想要一个关于 TQQQ 的 SMA 交叉策略。我想要一个获利了结策略，但不想设置止损——我对科技股长期看涨，不想被止损出局。我还想分散我的买入，而不是一次性全进。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*A4DhFQAExojxydu4Nzvu4A.png)

对于 o1-mini，它在第一次尝试时创建了一个表现优于大盘的投资组合。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*7RasrqbCInCeLwWeOE_NbA.png)

尽管这个策略的表现令人印象深刻，但**有一点非常重要需要注意。**

它并没有遵循规范。

具体来说，我在聊天中说了以下内容。

> 我还想分散我的买入，而不是一次性全进。

然而，当我们检查模型创建的策略时，它并没有创建那些策略。它为该规则创建了一个单独的策略，这显然不是我的本意。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Qk_586CrmxogIcqCK9elIQ.png)

Claude 3.5 Sonnet 做得要好得多……但有一个问题。

### 使用Claude 3.5 Sonnet创建算法交易策略

使用相同的提示，我与Claude创建了以下算法交易策略。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*IQppSFMHC2AlKOWf_6goHw.png)

这个策略**实际上符合我的要求**，这使得它更好。它只会在上一个订单后的7天才会买入。

然而，有一个问题。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*mqAcaCA_mizVaJXU8WCS8A.png)

使用Sonnet创建的投资组合的表现**要差得多。**原因很简单——如果我们看看卖出规则，我们会发现它在头寸上涨0.15%时就卖出了。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ZHQkXS_CS9Tc80ed7D-ZeQ.png)

更糟糕的是，该模型非常固执。当我要求它修正规则时，它不断生成完全相同的投资组合。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*3XX9oJHPCEW-8PDPXQQUkA.png)

**这使得本轮的胜者难以决定。**虽然Claude确实符合我的要求，但GPT-o1-mini生成了一个表现更好的投资组合，并能够听取修改。

尽管如此，我们仍然可以找到方法来改善Claude的表现，使其创建出更好的投资组合。

## 改进基础模型与提示工程

为了让Claude生成“正确”的投资组合，我必须修改系统提示。这对应于以下更改。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*fOrdz67c4IEnQ0W3bcJeLg.png)

除了系统提示外，我还在上下文中添加了更多示例以进行“少量示例提示”。具体来说，我有一个输入/输出对，表示“负15%”对我的应用程序意味着什么。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*G01vdp6iwRPH7Y_luuGe5w.png)

通过这些修改，Claude 3\.5 Sonnet能够生成一个完全符合我最初要求的正确投资组合。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*3UXtuqL7mL6iYpRpwd6DNw.png)

## 结论思考：哪个更好？

在本文中，我对比了OpenAI的o1-mini模型和Anthropic的最新模型3.5 Sonnet。我们对SQL生成和JSON生成这两个任务进行了并排比较。

在SQL生成任务中，Claude 3.5 Sonnet毫无疑问是赢家。其响应更准确，格式更好，生成成本更低，速度也更快。

在JSON生成任务中，胜者难以确定。虽然Claude更符合最初的请求，但在出现错误时它很难调整投资组合。相比之下，OpenAI的模型虽然在符合用户请求方面表现较差，但在第一次尝试时生成的投资组合更好，细节正确，例如所需的出售百分比变化。

因此，关于“哪个更好”的问题并没有明确的答案。Claude 3.5 Sonnet似乎比o1系列模型更周到、更快速。但它也更固执，直到我们更改系统提示并添加更具体的示例，它才会改变输出。

最终，“哪个更好”的绝对答案是“这要看情况”。但如果我必须在两者之间选择，并考虑速度、成本和周到性等因素，Claude 3.5（结合提示工程）是日常任务中更可用的模型，我会选择它而非o1系列模型。

感谢您的阅读！通过使用NexusTrade，您可以使用自然语言创建自己的算法交易策略。想自己试试吗？今天就在NexusTrade上创建一个免费账户。

关注我： [**LinkedIn**](https://www.linkedin.com/in/austin-starks/) **\| [X (Twitter)](https://x.com/nexustrade_) \| [TikTok](https://www.tiktok.com/@starkstechnology) \| [Instagram](https://www.instagram.com/starkstechnology/) \| [Newsletter](https://nexustrade.io/blog)**

收听我： [**Spotify**](https://open.spotify.com/show/6xX8sT3sD7sYFaD8EH5PaV) \| [**Amazon Music**](https://podcasters.amazon.com/podcasts/76197134-357f-47bd-be74-6801bf90ffb3) **\| [Apple Podcasts](https://podcastsconnect.apple.com/my-podcasts/show/auroras-insights/86a719fb-2552-4406-b0f5-a3bdd09c82eb)**

