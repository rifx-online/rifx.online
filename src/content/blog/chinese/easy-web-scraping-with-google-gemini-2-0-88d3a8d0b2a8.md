---
title: "使用 Google 双子座 2.0 轻松进行网络抓取"
meta_title: "使用 Google 双子座 2.0 轻松进行网络抓取"
description: "Google Gemini 2.0 是一款多模态实时 API，极大简化了网页抓取的过程。用户只需通过共享屏幕并与 AI 交互，便可轻松提取复杂或非结构化的数据。文章中提供了两个实际示例：一是从 Airbnb 列表中实时抓取评论，二是从研究文章中提取特定的表格数据。Gemini 2.0 使得数据提取过程高效且无需编写代码，适合各种数据分析需求。"
date: 2024-12-26T04:30:18Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Koz9eMv-AzQKmNDMGlPt1g.png"
categories: ["Programming/Scripting", "Technology/Web", "Data Science"]
author: "Rifx.Online"
tags: ["voice", "scraping", "Gemini", "JSON", "unstructured"]
draft: False

---





网页抓取从未如此简单，这都要感谢谷歌开创性的多模态实时 API——Gemini 2\.0\。

使用这个工具，您可以轻松地从任何网页中提取数据，无论是复杂的、非结构化的，还是某些非常特定的数据。

今天，我将逐步带您体验我自己尝试过的实际示例，这样您就会确切知道该怎么做。

即使您是完全的初学者，您也会在短时间内感觉像个专业人士。

让我们开始吧！

## 入门：设置 Google AI Studio

在我们开始示例之前，让我向您展示如何进行设置：

1. **访问 Google AI Studio：** 打开 Google AI Studio，并使用您的 Google 账户登录。
2. **启用“共享您的屏幕”：** 您可以在工具下找到此选项。点击它，并确保选择“共享整个屏幕”，而不仅仅是一个标签。这非常重要，因为 Gemini 2.0 将处理您整个屏幕上的内容。
3. **选择输出格式：** 在开始之前，将输出格式设置为“文本”。这确保 Gemini 能够以可读且结构化的格式返回结果。

完成后，您就准备好了。

以下是参考的截图。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*kMax6TaHx4Q3IdlaXGAL6g.png)

现在让我带您了解我自己尝试的两个示例。

## 示例 1：在滚动时抓取 Airbnb 评论

场景如下：

我想从一个 Airbnb 列表中抓取评论，但评论只有在滚动时加载。

那么如何无缝提取这些信息呢？

以下是我一步步完成的方法：

我打开了一个 Airbnb 列表并点击了评论部分，我选择了一个随机的房产进行测试并打开了评论部分。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*6GyGEc1Gy7XEJB_kDgdq3Q.png)

在 Gemini 2.0 激活的情况下，我分享了我的整个屏幕（如之前设置的那样）

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*bU_PvJm2lMrkIFEzUHmaCw.png)

我通过语音给它下达了这个命令：

*“将屏幕上可见的所有评论提取为结构化格式。随着我滚动继续提取。”*

当我浏览评论时，Gemini 2.0 实时持续提取数据。它不需要我停止或重新加载——它只是不断捕捉可见的评论。

一旦我完成滚动，Gemini 就以干净的结构化格式返回了评论。输出包括：

* 评论者的姓名
* 评论日期
* 星级评分
* 评论的完整文本

这是截图，显示 AI 如何抓取并给我输出

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*EaGLJ0Kckl39Oo3HkhnOBQ.png)

**这有什么用？**

无论您是在分析客户反馈还是汇总评论以进行比较，这种方法都可以为您节省数小时的手动复制和粘贴。

**输出示例 (JSON)：**


```python
[
    {
        "name": "Sonal",
        "date": "3 days ago",
        "stars": "5",
        "text": "The place was beautiful and we were awestruck to see such a well maintained and designed property within Bangalore."
    },
    {
        "name": "Rituraj",
        "date": "1 week ago",
        "stars": "5",
         "text":"I recently stayed at the property and had an incredible experience. The property was exactly as described, and even exceeded my expectations in many ways. The space was clean, well-maintained, and thoughtfully designed. Our host, was amazing—super responsive, friendly, and helpful. Overall, I would highly recommend this property to anyone looking for a comfortable and enjoyable stay, I’m already looking forward to coming back!"
    },
    {
       "name": "Damodar",
       "date": "June 2024",
        "stars": "5",
       "text": "It was a wonderful stay, nice clean pool, tidy rooms, ample entertainment sources like games(football, carrom etc.), decent piano to play, each room had a TV and living room had a big projector screen. Caretaker Laxman was polite and helpful. Ample amount of seating area all over and great cosy beds made our sleep pretty comfortable. Kids also enjoyed the indoor swing seats a lot. Trust me it is a great place to stay...SUPER COMFORTABLE and enjoyable  The only drawback was one of the food provider near by called Chaitra...suggest whoever goes there either cook your own food in the excellent kitchen or order/dine at nearby restaurants ...many options are there within 5 Kms. We had dinner and breakfast from the food vendor however the quality was not up to mark. Non veg food was not cooked completely. We ordered barbeque veg non veg and non veg took much time to cook and even after that it was not roasted/ cooked properly.. have strong doubts on their raw material"
    }
]
```
就这样！Gemini 2.0 让这个过程变得极其简单。

## 示例 2：从研究文章中提取特定数据

对于我的第二个用例，我想从一篇研究文章中提取仅仅是**表格数据**——而不是整个页面。这次，我专注于精确性。以下是我的操作方法：

我找到了一篇包含标题为“供需组成的综合视图，欧盟，2021年和2022年”的表格的文章。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*iqi7elTzMTVeRJmAAGVTdg.png)

和之前一样，我共享了我的全屏，以便让Gemini看到整篇文章。

我告诉Gemini：

*“仅提取该文章中的表格数据，并将其转换为JSON格式。”*

Gemini立即识别出表格，提取了数据，并以请求的JSON格式返回。

以下是Gemini给我的输出：

```python
{
  "Table": {
    "Title": "Synoptic view of supply and use components, EU, 2021 and 2022",
    "Unit": "(€ Billion)",
    "Rows": [
      {
        "Item": "1. Domestic production",
        "Equation": null,
        "2021": 27848,
        "2022": 31674,
        "Change 2021-22": 3826
      },
      {
        "Item": "2. Imports of goods and services",
        "Equation": null,
        "2021": 2378,
        "2022": 3198,
        "Change 2021-22": 820
      },
      {
        "Item": "3. Total supply",
         "Equation": "1+2",
        "2021": 30226,
        "2022": 34779,
        "Change 2021-22": 4552
      },
      {
        "Item": "4. Intermediate consumption",
        "Equation": null,
        "2021": 14343,
        "2022": 16340,
        "Change 2021-22": 1997
      },
      {
        "Item": "5. Final consumption expenditure of households",
        "Equation": null,
        "2021": 11554,
        "2022": 12541,
        "Change 2021-22": 986
      },
      {
        "Item": "6. Final consumption expenditure of government",
        "Equation": null,
        "2021": 3188,
        "2022": 3375,
        "Change 2021-22": 187
       },
      {
         "Item": "7. Final consumption expenditure of NPISH",
         "Equation": null,
         "2021": 193,
         "2022": 209,
         "Change 2021-22": 15
      },
      {
         "Item": "8. Final consumption expenditure",
         "Equation":"= 5+6+7",
        "2021": 14936,
         "2022": 16125,
         "Change 2021-22": 1068
        },
      {
        "Item": "9. Gross fixed capital formation",
        "Equation": null,
        "2021": 2538,
        "2022": 2865,
        "Change 2021-22": 326
      },
       {
        "Item": "10. Changes in inventories and acquisitions less disposals of valuables",
        "Equation": null,
        "2021": 226,
        "2022": 323,
        "Change 2021-22": 98
      },
      {
        "Item": "11. Gross capital formation",
        "Equation": "= 9+10",
        "2021": 2764,
        "2022": 3188,
        "Change 2021-22": 424
      },
       {
        "Item":"12. Exports of goods and services",
        "Equation": null,
         "2021": 2891,
         "2022": 3291,
         "Change 2021-22": 400
       },
      {
       "Item": "13. Total use",
        "Equation":"= 4+8+11+12",
        "2021":30228,
        "2022":34779,
        "Change 2021-22":4552
        },
       {
        "Item": "14. Taxes less subsidies on products",
         "Equation": null,
         "2021": 459,
          "2022":482,
         "Change 2021-22": 24
        },
       {
        "Item": "15. Value added",
         "Equation":"= 1-4 =16+17+18",
         "2021": 13005,
          "2022": 14334,
         "Change 2021-22": 1330
        },
        {
        "Item": "16. Compensation of employees",
         "Equation": null,
         "2021": 6954,
          "2022": 7447,
         "Change 2021-22": 493
        },
         {
        "Item": "17. Gross operating surplus and mixed income",
         "Equation": null,
         "2021": 6013,
          "2022": 6608,
         "Change 2021-22": 595
        },
        {
         "Item": "18. Other taxes less subsidies on production",
         "Equation": null,
         "2021": 32,
          "2022": 158,
         "Change 2021-22": 127
        }
    ]
   }
}
```
**这有什么用？**

如果你正在处理研究数据、表格或报告，你可以仅提取所需的信息而不受干扰。然后，你可以分析它，将其转换为电子表格，或者以你想要的方式进行可视化。

## 为什么 Gemini 2\.0 让网页抓取变得如此简单

使用 Gemini 2\.0，您无需编写一行代码。

只需与 AI 交谈，描述您想要的内容，它就能处理繁重的工作。

无论您是在浏览评论还是提取精确数据，Gemini 都能轻松适应您的需求。

## 尝试一下吧！

以下是一些可以帮助你入门的想法：

* 提取亚马逊评论或产品数据。
* 爬取餐厅列表或酒店详情。
* 从文章中提取财务表格或统计数据，就像我做的那样。

设置 Gemini 2.0，分享你的屏幕，简单地告诉它你需要什么。

这使得网络爬虫变得极其简单。

如果你想了解更多关于网络爬虫工具的信息，这里有我的文章，你可以查看。

