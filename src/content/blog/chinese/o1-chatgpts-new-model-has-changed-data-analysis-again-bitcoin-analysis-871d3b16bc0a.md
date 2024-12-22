---
title: "o1:ChatGPT 的新模式再次改变了数据分析！(比特币分析）"
meta_title: "o1:ChatGPT 的新模式再次改变了数据分析！(比特币分析）"
description: "ChatGPT最近推出的O1模型在比特币数据分析方面展现了显著的改进。该模型现在能够处理附件，并通过优化提示来预测比特币的未来价格。用户可以从CoinGecko下载数据，并利用O1模型进行分析，生成折线图等可视化结果。尽管当前无法直接上传CSV文件，但模型的分析能力仍然为用户提供了强大的数据洞察。整体而言，这些新功能标志着数据分析领域的进一步发展。"
date: 2024-12-22T03:51:48Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*c_NC21VlBAsUh1uy68v5gQ.jpeg"
categories: ["Chatbots", "Data Science", "Predictive Analytics"]
author: "Rifx.Online"
tags: ["o1", "ChatGPT", "Bitcoin", "data-analysis", "predictions"]
draft: False

---



### 测试 ChatGPT 的新 O1 模型，进行比特币数据分析



ChatGPT 最近宣布将在 12 天内分享 12 个新功能，今天是第一天。正如您从我之前的文章中所读到的，我们已经看到了他们第一天的功能，包括 O1 模型。

## o1 模型

这个模型在一段时间前以 o1\-preview(beta) 的名称发布。看起来测试阶段已经结束，现在我们有了 o1 模型。根据基准测试结果，它变得更聪明了。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*PFRbsrUh03AvnPzq7cXjCw.png)

而且，当时 o1 模型没有处理附件的能力，但现在它可以了；请查看截图。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*0AyvxEcozvhy3CN10vtOLg.png)

正如我们一直所做的，让我们通过数据分析来测试它！

**CoinGecko**

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*_wc0PtmxKs-G1VeUMsRCUw.png)

让我们前往 CoinGecko 并下载过去 10 年的 BTC 数据。接下来，我们需要一个好的提示还是完美的提示呢？

### 提示优化器

让我们使用我们的提示优化器来构建一个预测模型。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*NP011v_zXjeHmlW-qdD6nA.png)

完美！现在，让我们多利用一下 o1。正如你所知，我们可以将文件附加到它上面，但不幸的是，它不接受 CSV 文件。这会阻止我们吗？当然不会。让我们将这组数据的头部发送给它。选择如下;

***要访问提示优化器，请考虑成为 [Substack](https://www.learnwithmeai.com/subscribe) 的付费订阅者。***

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*jNaeiLIBd7fQEJJNo-5isA.png)

现在，使用这个提示结构;

```python
Here is my prompt: [Perfect Prompt]

Here is my dataset: [ head of the dataset]

As you can tell from my perfect prompt, I want to predict BTC's prices 
for the next 10 days. 
Based on this, can you update my prompt? 
I'll then use this prompt with the GPT-4o model and instruct it to make 
predictions, so please adjust it accordingly.
```
让我们试试吧！

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*wv5RiYRjLkQX87e5QB6Edg.png)

## GPT 4o

我希望 OpenAI 能尽快允许我们将 csv 上传到 o1 模型。但是如果我这样想，他们会考虑并很快实现这个功能。不过，在那之前，我们应该使用 GPT 4o 来分析文件。

现在，附上我们使用上述提示下载的 CSV 文件。旅程开始了！

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*kuwnpTW2gI_qhTzjFpm0CQ.png)

一开始，它给出了这个计算；

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*WM6f87dB8kG7mHxA3EbAlA.png)

但是让我们请求它以折线图的形式展示！瞧！

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*L0f85NN-LKsDvBocr3oRyA.png)

***免责声明：我不是金融顾问；这不是金融建议。***

当然，你可以增强你的分析，并询问 O1 你还可以做些什么，但你明白我的意思，对吧？

## 最后的思考

这些模型将在未来改变一切，因为两年前，我记得在最后几天做过这种应用，如果你知道你要做什么。

我们在几分钟内完成了，但当然，这不是一个专业项目，我也不是财务顾问，所以请不要根据这个预测进行投资。

我希望你能理解数据分析又一次发生了变化。如果你进行这些计算，你会得到很好的分析！感谢你的阅读！

如果你喜欢你所阅读的内容并渴望了解更多关于人工智能的信息，请使用我们的代理，阅读我们的优质文章，并考虑在 [Substack](https://www.learnwithmeai.com/subscribe) 上成为付费订阅者。

## 系列

* **每周 AI 脉搏：** *在阅读 [此处](https://www.learnwithmeai.com/t/weekly-ai-pulse) 时获取最新更新。*
* **LearnAI 系列：** *通过我们的独特 GPT 学习 AI，并通过 [此系列](https://www.learnwithmeai.com/p/it-is-time-to-start-learnaiwithme) 赋能。*
* **求职系列：** *在 Upwork 上发现自由职业机会 [这里](https://www.learnwithmeai.com/t/job-hunt-ai)*

## GPT’s

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*2q6W14C9UoCcSmPG.png)

这里是免费的资源。

***这是[ChatGPT备忘单](https://gencay.ck.page/chatgpt)。***

***这是[提示技巧备忘单](https://gencay.ck.page/prompt)。***

***这是我的[NumPy备忘单](https://gencay.ck.page/)。***

***这是“[如何成为亿万富翁](https://gencay.ck.page/billionaire)”数据项目的源代码。***

***这是“[使用Python的6种不同算法进行分类任务](https://gencay.ck.page/bfd9d41fdc)”数据项目的源代码。***

***这是“[能源效率分析中的决策树](https://gencay.ck.page/2df5d07388)”数据项目的源代码。***

***这是“[DataDrivenInvestor 2022文章分析](https://gencay.ck.page/56510fbc8d)”数据项目的源代码。***

“机器学习是人类将要创造的最后一项发明。” Nick Bostrom

