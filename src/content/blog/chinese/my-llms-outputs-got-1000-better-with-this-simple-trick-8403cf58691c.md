---
title: "提升LLM输出质量的简单技巧！如何达到1000%的进步？"
meta_title: "提升LLM输出质量的简单技巧！如何达到1000%的进步？"
description: "文章介绍了一种通过过滤低概率token来提升大型语言模型（LLM）输出质量的技巧。在实习期间，作者发现logit变换可能导致输出混乱，尝试减少提升幅度后仍未解决问题。最终，通过过滤低概率词汇，成功消除了乱码，同时改善了上下文对齐。文章强调了这种过滤方法在提升输出流畅性和语法正确性方面的重要性，但也指出其在不同提示下效果可能不一致，标准化开发存在挑战。"
date: 2024-12-28T01:51:44Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*UaZS29qc_qxURjPD"
categories: ["Natural Language Processing", "Machine Learning", "Generative AI"]
author: "Rifx.Online"
tags: ["logits", "filtering", "thresholds", "fluency", "context"]
draft: False

---

## 我希望我能更早知道这个技巧。



去年夏天我在Adobe Research（班加罗尔）实习时，我的工作是使开源LLM更符合上下文。这意味着无论提供的上下文说了什么，LLM都需要遵循它。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*TlgNYgNqVrW_L766nw2reA.png)

我尝试了一种方法，查看输入token的激活，并利用其中的一些现有模式来识别在上下文中出现的token，并对它们进行比其他token更大的提升。这被称为“logit变换”。有时，logit变换可能会出错，导致低概率token超过所有其他token。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*WNmH93NC_JoOGpCAv5KDMQ.png)

在上面的例子中，假设上下文说奥林匹亚是首府。

显然，在没有任何变换的情况下，输出是西雅图。

经过变换，输出是“eek”。

这两个答案都不正确。

我们现在不讨论变换的细节。你可以通过这个链接阅读更多细节：

但你可能已经猜到发生了什么：

我的输出完全混乱不堪。

> **示例输出**：“华盛顿的首府是seekek0q3n ee”

我困惑了一段时间，不知道该怎么办。

我尝试的第一件事是减少通过我尝试的方法提升token的幅度。虽然减少幅度有助于降低输出的混乱程度，但我试图实现的上下文对齐也随之减少。几乎就像我必须在上下文对齐和输出的混乱程度之间找到平衡。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*2-OONzbwLj4mNplTaPDY5w.png)

但在我接下来尝试的事情之后，混乱程度完全解决了，而没有影响上下文对齐。

## 诀窍

我只是过滤掉了概率非常低的词汇。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*RkE2VMBfF-4VJcfrxvB8nw.png)

这完全消除了乱码输出，同时仍然让我改善输出的上下文对齐。

最后，我的方法稍微改善了上下文对齐，同时保持了输出的流畅性和语法正确性。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ZI8MZZlRISG32D3GrDf5AQ.png)

## 过滤函数

这是整体函数的外观，考虑到过滤和logit变换。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*V59NKlNr81TIbXt2.png)

假设qN(x)是我们试图修改的logit分布。在这种情况下的修改是qN与qM的对数。将其视为某种函数，该函数改变输出分布，使LLM更加“真实”。

现在，过滤方面是通过将logits设置为\-infinity来处理的，如果概率值低于阈值。因此，像“Washington”后面的“eek”这样的高度不可能的token在这里被移除。请记住，当我们对logits进行softmax以获得概率分布时，我们使用的是指数函数。因此，将任何logit设置为\-infinity相当于将该token的概率设置为零。

您可以在这里看到过滤阈值是如何定义的。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*SRbvjeN8SgrootrI.png)

本质上，阈值是最可能的下一个token概率的某个分数。这可以是任何东西，具体取决于同样可能被预测为下一个的token数量。这就是为什么我们不能采用固定的阈值，而是取某个分数。

这种特定形式的过滤函数在实践中非常重要，因为以下两种方法都没有那么有效：

* 固定数量的最高概率token（例如，前10个概率token）
* 固定阈值（例如，0\.1）

## 结论与局限性

这是一个相当有趣的应用，采用了一种相对简单的技术，这在LLM的输出质量上具有深远的影响。具体来说，在应用某些变换时，这些变换通常仅适用于高概率的tokens，而低概率的tokens需要在变换分布之前先被消除。

我发现这些解码方法是改变LLM行为的令人兴奋的新方法，但尽管有这样的过滤方法，重要的是要意识到涉及logits变换的方法是有限制的。虽然这种过滤方法在整体上可能很好地解决了混乱的输出，但所需的过滤阈值使得输出更加流畅可能在不同的提示中有所不同。这使得标准化的过滤器很难开发。

即使过滤方法在大多数情况下有效，也很难证明它在所有情况下都有效——如果要在更商业的应用中采用它，我们可能需要对它有更多的信心。


