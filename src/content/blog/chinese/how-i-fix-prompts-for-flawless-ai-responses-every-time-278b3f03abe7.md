---
title: "我如何修复提示，让人工智能每次都能做出无懈可击的回应"
meta_title: "我如何修复提示，让人工智能每次都能做出无懈可击的回应"
description: "本文探讨了如何通过改进提示来获得更理想的AI响应。针对大型语言模型（LLM）可能产生的次优回应，作者建议重新审视提示内容，识别模糊或不清晰的部分，并提供具体的改进建议。通过使用调试提示的结构，用户可以更有效地分析和修正提示，从而确保AI能够理解并产生期望的输出。文章强调了不断验证和迭代的必要性，以实现更高质量的AI交互。"
date: 2024-12-26T04:30:18Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*TfY_DcLm9LsznJBJclkr1Q.jpeg"
categories: ["Natural Language Processing", "Chatbots", "Machine Learning"]
author: "Rifx.Online"
tags: ["prompt", "debugging", "clarity", "iteration", "LLMs"]
draft: False

---





当ChatGPT首次推出时，几乎每个行业和职业的提示模板都涌入了互联网。你可能见过类似“最佳\[N\] ChatGPT提示用于\[行业/职业\]”的帖子。

这些帖子帮助许多人接触到AI工具，使得提问和获得答案变得简单。然而，现在我们中的大多数人已经掌握了这一点，并希望进一步推进。简单的提示会导致简单的结果，因此我们开始撰写更详细和复杂的提示。

然而，这也带来了挑战：有时，“AI”根本没有给我们期待的回应。尤其是当你有需要特定格式或有某些限制的任务时，编写能够完美工作的提示可能会很困难。

在这篇文章中，我将向你展示如何快速识别提示中的问题并改进它们，以获得一致且可重复的响应。

## 问题陈述

为了确保我们在同一页面上，让我们看一个真实的例子，其中大型语言模型（LLM）给出了一个次优的响应。

```python
QUESTION:
The value "1" for the question "Which of the following best describes 
the nature of your impairment or health issue?" is not valid.

Please correct it to one or more of the following: 
['1 - Autism', '2 - Physical disability', 
'3 - Registered blind or visual impairments uncorrected by glasses', 
'4 - Deaf/sign language user'].

Provide your answer as JSON with a 'valid_value' key.
For multiple selections, use a comma-separated string.

Example: {"valid_value": "Option A, Option B"}
    
RESPONSE:
1 - Autism, 2 - Physical disability, 3 - Registered blind or visual impairments uncorrected by glasses, 4 - Deaf/sign language user
```
为了提供背景，想象一下用户在填写没有任何验证的表单，而你的任务是纠正他们的答案。在这种情况下，你想将像“1”这样的响应更改为“1 — Autism”。然而，大型语言模型在进行此修复时遇到了困难。为了澄清，我使用的是**GPT\-4o**，OpenAI当前的旗舰模型，但仍然无法得到正确的结果。

现在，虽然这是一个与编程相关的例子，但我将分享的解决方案并不是。你在处理不同用例时可能会轻易遇到同样的问题，例如，以特定格式撰写报告，但LLM却不断遗漏某个部分。

这里的关键要点是，这只是一个例子——该解决方案适用于各种任务。

## 首先，重新阅读你的提示

我知道这听起来很简单，但相信我——我很认真😊。复杂的提示可能很长，有时最好的解决方案就是花几分钟，清理思绪，仔细再次阅读你的提示。

在写一个冗长的提示时，你可能在过程中进行了几次修改。在这样做时，很可能无意中引入了不一致或矛盾，从而让AI模型感到困惑。

有时，你甚至可能在使用一个在网上找到的提示，而没有完全将其调整到你的具体任务上。快速的重新阅读有助于捕捉这些问题，并确保它们不是导致LLM响应不佳的原因。

在我们的例子中，我想我们可以同意我的提示看起来相当扎实😅，所以在这方面没有什么需要修正的。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*12oaJJinqNUa4XbmJu_7Gw.jpeg)

## 修正提示的提示

我们将使用一个 LLM 来帮助修正我们的提示。这听起来很简单，也许你已经考虑过这个问题。但是，如果你直接将有问题的提示粘贴到 ChatGPT 中，问“我的提示有什么问题？”，你很可能会遇到我们试图避免的同样问题：使用一个次优的提示来解决问题。所以让我们做得更好！

```python
You are a prompt-debugging assistant. Your goal is to make sure that the 
input I provide leads to the expected output. 
Please help me identify and fix issues with my prompt.

Step-by-Step Debugging Process:
1. Interpretation
   - Analyze the current prompt and summarize what the model likely understands from the given instructions.
   
2. Diagnosis 
   - Identify any ambiguity, confusing wording, or structural issues in the prompt that might prevent the model from producing the desired output.
   
3. Suggested Fixes
   - Provide at least three concrete improvements to the prompt, ranging from minor tweaks to substantial revisions, that could make the instructions clearer.

4. Test Cases
   - Based on the revised prompt, suggest at least three sample inputs along with their expected outputs. This will allow me to test the effectiveness of the updated prompt.

5. Validation
   - If possible, describe how the revised prompt addresses specific issues from the initial version and ensures the expected result.

Current Prompt:
[Insert current prompt here]

Expected Output:
[Insert expected output here]
```
现在你可以复制并粘贴了！

但在此之前，让我向你展示这如何解决我们示例中不那么明显的问题，以及希望能解决你的问题。

这个提示的第一件事是试图理解 AI 模型如何解释你的有问题的提示。如果你仔细想想，这正是我们人类处理问题的方式——我们会重新阅读提示，看看我们可能遗漏了什么。然后，提示促使 LLM 识别任何问题，例如模糊性或不清晰的措辞，并提供改进的建议和示例。

最后，它提供了测试用例和预期结果，以指导进一步的验证。最后一步是我对调试提示的个人调整。

准备好查看结果了吗？

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Tn__t2hhP47HFOJHl8TkfA.png)

随意在你可以访问的任何 LLM 中尝试完整的提示，并亲自查看完整的结果。

但简要说明一下，来自 GPT-4o 的回应让我意识到了一些重要的事情。我的 **有问题的提示** 是在要求模型将输入值“1”与此列表中的相应选项匹配 *‘1 — 自闭症’，‘2 — 身体残疾’，‘3 — 注册失明或视力障碍（未通过眼镜矫正）’，‘4 — 聋人/手语使用者’*。

然而，并不清楚“1”是否应该直接映射到“1 — 自闭症”，或者是否有一些条件逻辑来处理无效输入。

事实上，我的提示措辞暗示“1”是一个无效输入，即使“1 — 自闭症”是列表的一部分。这种矛盾让模型感到困惑。因此，我得到了一个意外的回应。我感到震惊，因为我根本没法自己发现这个问题。

## 放大提示修正器

我知道这感觉像是全部——从技术上讲确实如此——但我喜欢多走一步，显然你也是。那么让我们让这次体验值得你付出。

**提示修正提示**本身已经是你工具箱中的一个强大工具。但如果我们将其与OpenAI的新o1模型结合起来呢？是的，我说的就是那些以“批判性思维”能力而闻名的模型。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*QqVFNa0-iwIMP_fnxuRb4w.png)

虽然我最初的问题并不需要这样，但我决定使用o1-preview模型来实验这个提示。结果更加简洁、精确且可操作。如果你有机会，我强烈建议你试试看。

现在，你知道我知道的事情了！

但请记住，在使用LLM时，始终要不断验证和迭代。我喜欢称之为“**LLM调试循环**”。

我希望保持开放的对话，所以请尝试一下**提示调试器**，并在评论中分享你的经验或挑战。

感谢阅读，不要害羞，可以通过[LinkedIn](https://www.linkedin.com/in/bamboriz/)或[Twitter](https://x.com/iamtechonda)给我留言！

