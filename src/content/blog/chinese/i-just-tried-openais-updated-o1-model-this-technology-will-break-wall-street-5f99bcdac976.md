---
title: "我刚刚试用了 OpenAI 的升级版 o1 模型。这项技术将重创华尔街"
meta_title: "我刚刚试用了 OpenAI 的升级版 o1 模型。这项技术将重创华尔街"
description: "OpenAI最新发布的o1模型在金融研究和交易策略生成方面展现出显著优势。与之前的o1-preview模型相比，新模型具备更高的准确性、视觉能力和函数调用支持，使用户能够生成有效的交易策略。利用该模型，用户可以快速生成复杂的金融查询并获得准确结果，进而转化为算法交易策略，显著提高投资回报。这一技术的进步为散户投资者提供了强大的工具，简化了金融分析和自动化交易的过程。"
date: 2024-12-26T04:30:18Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*g3hVkAu_l6Lv9BeY.png"
categories: ["Finance", "Programming", "Machine Learning"]
author: "Rifx.Online"
tags: ["OpenAI", "O1", "trading", "strategies", "financial"]
draft: False

---

当我第一次尝试o1-preview模型时，发布于九月中旬，我并没有留下深刻的印象。与传统的大型语言模型不同，o1系列模型不会立即响应。它们会“思考”问题和可能的解决方案，这个过程非常漫长。

再加上使用该模型的费用异常高昂以及缺乏基本功能（如函数调用），我很少使用这个模型，尽管我已经展示了如何使用它来创建超越市场的交易策略。

然而，OpenAI刚刚发布了最新的o1模型。与其前身（o1-preview）不同，这个新的推理模型有以下升级：

* **更高的准确性和更少的推理令牌**：这个新模型更聪明、更快速，达到博士级别的智能。
* **视觉**：与盲目的o1-preview模型不同，新o1模型可以通过视觉API实际“看见”。
* **函数调用**：最重要的是，新模型支持函数调用，允许我们在API中生成语法有效的JSON对象。

有了这些新升级（特别是函数调用），我决定看看这个新模型的强大之处。

哇，我非常震惊。**我不仅创建了一个使回报翻倍的交易策略。**

我还进行了准确的金融研究，甚至连华尔街都羡慕不已。

让我来解释一下。

## 增强的金融研究能力

与最强大的传统语言模型不同，大型推理模型能够根据需要思考以回答问题。

这种思考并不是浪费精力。它使模型能够生成极其准确的查询，以回答几乎所有金融问题，只要数据库中有可用的数据。

例如，我向模型提出了以下问题：

> *自2000年1月1日起，SPY在7天内下跌5%的次数是多少？换句话说，在时间t，时间(t + 7天)的百分比回报有多少次为-5%或更低。*

> *请注意，我问的是7个日历天，而不是7个交易日。*

> *在结果中，包括这些下跌的数据范围并显示百分比回报。同时，以markdown表格格式展示这些结果。*

它给出了以下结果：



其他语言模型响应迅速但效果不佳。即使是最好的传统语言模型Claude 3.5 Sonnet也未能准确回答我的问题。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*63jufC1DLGBo4FLQqY1nNQ.png)

虽然可以告诉Claude它做错了什么，但这需要阅读模型生成的查询并进行解释。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*DgJ_-tsOEBqqbM8VKJvFZw.png)

例如，你必须是SQL专家才能知道这个查询是错误的，因为它使用了`LEAD(..., 7)`，这计算的是7个交易日（而不是7个日历天）。此外，你可以看到模型没有以markdown格式响应，尽管我们明确要求了这一点。然后，我们必须告诉Claude它做错了什么，并希望它下次能做对。

可以想象，这对非技术投资者来说是非常困难的。而且更难发现查询中的问题。

相比之下，O1在第一次尝试时就生成了准确的查询，无需手动调整。

## 将这些见解转化为交易策略

继续与o1交谈，我与模型进行了长时间的对话。从这次对话中，我提取了以下见解：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Rpc4BXiGzPo9EFGtQqPbkg.png)

我基本上了解到，即使面临大幅回撤，市场在接下来的几个月内往往会恢复。这包括前所未有的市场下跌，例如2008年的金融危机和COVID-19大流行。

我们可以将这些见解转化为算法交易策略，**利用市场在回调后往往会反弹的事实。**

例如，我使用LLM创建了以下规则：

* 如果我们的SPXL头寸少于$500，则使用50%的购买力进行买入
* 如果我们在10000天（一个任意大的数字）内没有卖出，并且我们的头寸上涨了10%，则卖出20%的SPXL投资组合价值
* 如果SPXL股价自上次卖出以来上涨了10%，则卖出20%的SPXL投资组合价值
* 如果我们的SPXL头寸下跌了12%或更多，则使用40%的购买力买入SPXL

这些规则利用了SPXL在牛市中相对于SPY表现优异的事实，比例为3比1。如果市场确实对我们不利，我们有足够的购买力来降低我们的成本基础。如果我们假设市场往往会上涨，这是一种巧妙的策略，但需要特别警告的是，在长期、多年的市场回调期间，这种策略特别危险。

然后我测试了这个策略，从2020年1月1日到2022年1月1日。**请注意，开始日期恰好是在臭名昭著的COVID-19市场崩盘之前。**尽管回撤最低达到-69%，但投资组合的表现比更广泛的市场高出85%。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*2fTO9zQ2e1QkwrtyihMNTA.png)

这只是一个简单的例子。实际上，我们可以迭代地更改参数以适应特定的市场条件，甚至根据当前市场创建不同的策略。

这一切都无需编写一行代码。

一旦我们准备好，就可以通过点击一个按钮将策略部署到市场。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*Wr7QxHAVUCSOhOK8.png)

## 结论思考

OpenAI O1 模型是金融领域的一次巨大进步。它让任何人都能进行高度复杂的金融研究，而不需要成为 SQL 专家。这种影响不可小觑。

现实是，这些模型正在变得越来越好且成本越来越低。能够从市场中提取真实洞察并将其转化为自动化投资策略，这在三年前是闻所未闻的。


