---
title: "利用 Gen AI（OpenAI API）构建智能测试自动化"
meta_title: "利用 Gen AI（OpenAI API）构建智能测试自动化"
description: "我们都知道，用户界面测试是超级脆弱的。它们会因各种原因而崩溃，其中最大的罪魁祸首之一就是 UI 的更改..."
date: 2024-11-13T01:22:29Z
image: "https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*kZ4ZR-jqdTTgH3bpOzcgUw.png"
categories: ["Generative AI", "Programming", "Testing"]
author: "Rifx.Online"
tags: ["Generative", "OpenAI", "Selenium", "LLMs", "POM"]
draft: False

---



> 我们都知道 UI 测试非常脆弱。它们可能因各种原因而失败，其中一个最大的问题是 UI 定位器的变化。很难想象我们如何能让它们足够智能，以理解定位器何时发生变化，并在测试中出现定位器问题之前防止测试运行。

你没听错！现在是 2024 年，自动化测试工具已经取得了长足的进步。在与这些工具打交道近 18 年后，从 Mercury Winrunner 到 Playwright，我们现在可以利用生成性 AI 的强大功能做一些真正令人惊叹的事情。这就像魔法，但这是真正的科学！

没错，我们现在可以找到一种方法，让我们的测试自动化代码 **更智能**，而不需要自己编写各种模糊的数学算法，这一切都由 LLM 的神来处理。

在这篇文章中，我们将讨论如何以更有效和高效的方式使我们的测试变得智能，但同样，要实现这一点，您需要具备以下前提条件：

1. **Open AI API** 带信用额度（您需要即时购买）



2\. C\# .NET 代码知识，因为我将要涵盖的代码来自 .NET 和 Selenium

3\. 对测试自动化的基本理解

再次强调，以上所有内容以及以下讨论都是我 [Udemy 课程](https://proxy.rifx.online/https://www.udemy.com/course/generative-ai-in-software-automation-testing/) 的一部分，该课程涵盖了更详细的内容和逐步编写代码的方法。

## 让我们理解问题陈述

我们有一个页面，希望使用 Selenium C# 代码进行自动化。我们使用页面对象模型（POM）模式编写了非常好的代码，一切看起来都很棒，并且完美运行，如下所示。

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*GPSBTmPEZBpubI72OElwbw.gif)

我们的开发冠军发现了一个需要调整的 UI 元素。他根据同事的代码审查意见进行了更改，但不幸的是，他删除了我们在自动化测试中使用的定位器。这意味着我们的 POM 代码将不再工作，因为定位器不再存在，这最终导致测试 **失败**。

最重要的是，由于单个定位器的更改，所有测试场景都将因相同的失败而失败。测试并不知道定位器已更改，也没有任何方法知道这一点，因此它总是失败。

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*tINBnScOW78vz8sKb6lWbA.gif)

## 如何解决这个问题？

我相信像我一样，很多人在使用 UI 测试工具时，每天都在经历这个问题，无论是 **Cypress**、**Selenium** 还是 **Playwright**。这个问题总是存在，无论使用什么工具。

现在让我们来理解如何解决上述问题。

我们都知道 **生成式 AI** 和 **大型语言模型**（LLMs）已经远远超出了文本/图像/视频生成的范畴。它们理解给定的上下文，并生成我们所寻找的有意义的信息集。

因此，针对上述问题，我们可以利用生成式 AI 的力量，通过 OpenAI 的 API，将我们的提示请求传递给像 ***GPT 4o*** 或 ***GPT 4 turbo*** 的 LLM，以理解问题陈述并给出有意义的解决方案。

> 那么，我们需要向 OpenAI 的 API 传递什么提示请求，以便在我们的测试自动化中执行操作呢？

好吧，这张图将给你答案。

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*bsCOcyWc0FDnxPp9ApssVw.gif)

我们可以将应用程序的“**实际测试页面**”和 Selenium 测试的“**页面对象模型**”代码作为提示发送给 OpenAI 的 API（附带一些额外的响应解析细节）。这将作为 OpenAI API 的验证过程，以查看定位器是否与给定页面匹配。

根据该操作，我们可以决定测试是否执行。定位器发生了变化，因此继续运行测试是没有意义的。

执行上述操作的代码大致如下：

```python
public static async Task<string> VerifyPageLocatorFromAiAsync(string pomFileContent, string htmlPageSource)
{
    ChatClient client = new(model: "gpt-4o-mini", apiKey);
    
    var chatMessage = $"Verify if locators from this Selenium POM class: {pomFileContent} match this page source: {htmlPageSource}\", only return True or False result";

    ChatCompletion completion = await client.CompleteChatAsync(chatMessage);

    return completion.Content.FirstOrDefault().Text;
}
```
上述代码只是课程中涉及的大量代码的一部分，但你可以看到如何简单地执行将页面与 Selenium 的页面对象模型代码进行分析的操作。

## GenAI在软件测试课程中

*以上讨论只是我在Udemy新课程“[**在软件自动化测试中使用生成性AI**](https://proxy.rifx.online/https://www.udemy.com/course/generative-ai-in-software-automation-testing/)”中讨论主题的一部分*

以下是课程内容

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*lHe_b7qVqUQo-9Y5.png)

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*rMrsbB2IaKPbthdAr9Rc9g.png)

该课程目前在Udemy上以优惠价格提供，作为首发优惠，请在购买课程时使用优惠码**EA\_NOV\_24 ⚡️**。

如果优惠码已过期，请随时在此帖子下留言，我会将最新的可用优惠码发送给您。

