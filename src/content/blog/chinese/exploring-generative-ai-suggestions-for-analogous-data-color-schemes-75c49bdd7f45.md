---
title: "探索类比数据配色方案的人工智能生成建议"
meta_title: "探索类比数据配色方案的人工智能生成建议"
description: "本文探讨了生成式AI在数据可视化中提供通过色彩缺陷测试的类比色彩和谐建议的能力。文章分析了三种流行生成式AI工具（OpenAI的ChatGPT、微软的Copilot和谷歌的Gemini）如何响应关于类比色彩和谐的请求。结果显示，ChatGPT和Gemini提供的色彩方案均成功通过了色盲测试，而Copilot的方案未能通过。最终，ChatGPT的建议被选用于数据可视化示例，因其在色彩对比度方面表现优越。"
date: 2024-12-05T12:36:46Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*KQegjMlPfwo8xqg6lXlynQ.png"
categories: ["Generative AI", "Color Vision", "Data Science"]
author: "Rifx.Online"
tags: ["Generative", "color", "harmony", "deficiency", "chatbots"]
draft: False

---





类比色彩和谐是指在色轮上相邻的至少三种颜色。这种色彩方案可以创造出令人愉悦的色彩组合，但在应用于数据可视化时，可能会面临色盲测试不合格的风险。生成式AI能否通过提供通过色彩缺陷测试的类比建议来帮助数据色彩方案设计？在这里，我将探讨这个问题。让我们首先更详细地回顾一下类比色彩和谐、色彩缺陷以及生成式AI系统的概念。

**类比色彩和谐：**

色彩和谐是选择在色轮上能很好地配合在一起的颜色的过程。就像音乐中的概念一样，这些和谐是基于色轮上的色彩组合，提供了关于色彩色调如何相互配合的共同指导原则。艾萨克·牛顿被认为在1700年代初期创造了色轮的概念，当时他将线性色谱闭合成一个色彩圆。下面展示了他的概念插图。艺术家和色彩科学家对他的概念进行了演变和扩展，以包括色彩和谐。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*VA7YwgGV-AIYUBAdGyi-UA.png)

形成色轮基础的两个色彩空间是传统的红-黄-蓝（RYB）色彩空间，画家们使用了几个世纪，以及用于桌面和移动显示设备的红-绿-蓝（RGB）色彩空间。在对数据可视化进行着色时，这些色彩空间会产生稍微不同的色彩和谐结果。色轮上相邻的三种颜色形成**类比**色彩和谐。下面，我展示了在蓝色调下，两个不同色彩空间的类比色彩和谐的比较。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Vddf3meOO3VG0BTdNRldkw.png)

在[之前的](https://readmedium.com/how-genai-understands-color-harmony-as-applied-to-data-visualization-f447171ef3dc)文章中，我展示了生成式AI系统默认使用RYB色彩空间来定义色彩和谐，但在提示时会指定RGB色彩空间的色彩和谐。

**什么是色彩缺陷？**

此外，我在[早期的](https://medium.com/@theresamarierhyne)UX Collective和Nightingale的关于色彩的文章中强调，人类有三种类型的光感受器或锥体。每种对光的视觉光谱的不同部分敏感，以促进丰富的色彩视觉。当一种或多种锥体无法正常工作时，就会发生色彩缺陷。红锥缺陷被归类为红色盲（Protanopia）。绿锥缺陷被归类为绿色盲（Deuteranopia）。蓝锥缺陷被归类为蓝色盲（Tritanopia）。有软件可模拟色彩缺陷。我将使用[Adobe Color的色盲可访问性检查](https://color.adobe.com/create/color-accessibility)来检查本文中数据色彩方案的色彩缺陷。作为对应用于数据可视化的选定色彩方案的最终检查，我经常使用[Coblis — 色盲模拟器](https://www.color-blindness.com/coblis-color-blindness-simulator/)工具。

现在，让我们来看看生成式AI聊天机器人的一些细节，以了解它如何促进色彩方案建议。

**生成式AI聊天机器人：**

目前，广泛使用的三种流行生成式AI聊天机器人是：Open AI的ChatGPT、微软的Copilot和谷歌的Gemini。用户可以请求这些聊天机器人协助完成创建电子邮件、论文和代码等任务。有几篇评论描述了[ChatGPT](https://www.cnet.com/tech/services-and-software/chatgpt-3-5-review-first-doesnt-mean-best/)、[Copilot](https://www.techtarget.com/whatis/definition/Microsoft-Copilot#:~:text=It%20was%20a%20standalone%20application,creation%2C%20editing%20and%20workflow%20automation.)和[Gemini](https://zapier.com/blog/google-gemini/)的功能。每种工具的基本版本（ChatGPT 3.5、Copilot和Gemini）都是免费的，付费服务约为每月20美元。在本文中，我使用这些系统的“免费”版本来探索它们对类比色彩和谐的理解。下面，我展示了每个聊天机器人的用户界面和定价信息的屏幕截图。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*6XxAJnCsCj-M69ihKphvsA.png)

我要求每个生成式AI聊天机器人“指定一个通过色彩缺陷测试的类比色彩和谐”。有趣的是，每个系统都提供了一个蓝色调的类比和谐。接下来，我展示了每个聊天机器人提供的详细信息。

**请求Open AI的ChatGPT帮助创建一个通过色彩缺陷测试的类比色彩和谐：**

我首先与ChatGPT合作，要求系统“指定一个通过色彩缺陷测试的类比色彩和谐”。聊天机器人回应如下：

*为了确保类比色彩和谐在色彩缺陷（如红色盲、绿色盲和蓝色盲）患者中仍然可视，最好选择在亮度和饱和度以及色调上有所不同的颜色。以下是一种安全的方法：*

***建议的色彩和谐：***

*1.* ***选择基础色调****：选择蓝色、紫色或黄-橙色范围内的颜色。这些色调通常在各种色彩缺陷类型中仍然可区分。*

*2.* ***类比色****：选择在色轮上基础色调两侧约30°到60°的颜色。根据选择的基础色调，使用暖色（黄-橙色）或冷色（蓝色/紫色）的混合色调。*

*3.* ***饱和度和亮度的变化****：为了增强区分度，可以在你的类比调色板中改变饱和度和亮度。使每种色调变亮或变暗可以创造更好的对比度，使调色板更适合色彩缺陷。*

*4.*

***示例类比调色板：***

· ***蓝色基础****：蓝色（\#007acc）、青色（\#00aaff）、水色（\#66ccff）*

· ***黄-橙色基础****：金色（\#ffaa00）、橙色（\#ff8800）、烧橙色（\#ff5500）*

*x*

*这些调色板利用亮度和饱和度的对比，提高了在各种色彩缺陷类型中的可见性，同时保持和谐。*

在这个回应中，ChatGPT提供了两个类比色彩和谐示例，旨在通过色彩缺陷测试。具体颜色以颜色Hex代码的形式指定。对于不熟悉此概念的人来说，颜色Hex代码是一种以十六进制表示RGB格式颜色的方法，通过组合红、绿和蓝的量来表示特定颜色。该代码是一个六位数字和字母的组合，前面带有一个哈希符号（\#）。每对数字分别表示颜色中红、绿和蓝的强度。颜色Hex代码不区分大小写，因此\#FFFFFF和\#ffffff均表示白色。

我展示了聊天机器人回应的实际文本。还展示了我使用[Adobe Color](https://color.adobe.com/create/color-wheel)工具来可视化映射和测试ChatGPT指定的三种蓝色基础颜色的色彩缺陷。正如前面所述，所有三种生成式AI工具都提供了蓝色的类比示例。ChatGPT是唯一一个额外包含橙色调示例的系统。在本文中，为了比较目的，我将重点放在蓝色调的示例上。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*IldG2RZmD5tqTrrwxe8Z7Q.png)

ChatGPT提供了一个非常狭窄的类比示例，其中颜色在色轮上非常接近。现在，让我们探索微软Copilot生成式AI系统的响应。

**请求微软Copilot帮助创建一个通过色彩缺陷测试的类比色彩和谐：**

*当然可以！类比色彩方案通常使用在色轮上相邻的颜色。以下是一个通过色彩缺陷测试的方案：*

***色彩组合：蓝-绿、蓝、蓝-紫***

· *蓝-绿：\#17BECF*

· *蓝：\#1F77B4*

· *蓝-紫：\#9467BD*

*该方案确保这些颜色对于色彩视觉缺陷患者是可区分的，同时仍然保持和谐的外观。计划将这些颜色用于特定项目吗？*

我展示了聊天机器人回应的实际文本。还展示了我使用[Adobe Color](https://color.adobe.com/create/color-wheel)工具来可视化映射和测试Copilot指定的蓝-绿、蓝、蓝-紫颜色的色彩缺陷。正如前面所述，所有三种生成式AI工具都提供了蓝色的类比示例。不幸的是，Copilot的类比组合未能通过Adobe Color的色彩缺陷测试。我在测试结果上打了个X。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*mZpLLoADvK7aJ3depqH6LQ.png)

Copilot提供了一个旨在通过色彩缺陷测试的类比示例，但在红色盲和绿色盲的情况下未能通过。现在，让我们探索谷歌Gemini生成式AI系统的响应。

**请求谷歌Gemini帮助创建一个通过色彩缺陷测试的类比色彩和谐：**

在这里，我展示了谷歌Gemini对我“指定一个通过色彩缺陷测试的类比色彩和谐”询问的回应。聊天机器人回应如下：

*类比色彩是指在色轮上相邻的颜色。这种色彩方案通常创造出和谐且视觉上令人愉悦的设计。为了确保对色彩缺陷个体的可访问性，请考虑以下类比色彩调色板：*

***色彩调色板：***

· ***主色：*** *蓝色*

· ***类比色：*** *青色和绿色*

***为什么这个调色板有效：***

*1\.* ***足够的对比度：*** *在适当的色调选择下，蓝色、青色和绿色为大多数色盲人士提供了足够的对比度。*

*2\.* ***清晰度：*** *从蓝色到绿色的渐变提供了清晰的视觉进展。*

*3\.* ***多功能性：*** *这个调色板可以适应各种设计风格和主题。*

我在下面展示了实际的文本聊天机器人响应。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*nRjgJN_6TyyrqtCFhe9bVg.png)

与OpenAI ChatGPT和Microsoft Copilot不同，Google Gemini没有提供具体的颜色Hex代码响应。因此，我对我的请求添加了更多细节，并询问：“指定一个通过色盲测试的类比色和颜色Hex代码的和谐配色”。

聊天机器人回应如下：

*这是一个通常被色盲人士良好接受的类比色和谐配色及其Hex代码：*

***主色：*** *蓝色（\#007bff）*** 类比色：***

· *青色：(\#009688\)*

· *绿色：(\#4caf50\)*

*这个颜色调色板提供了和谐且视觉上令人愉悦的组合，同时也确保了色盲人士的足够对比度。*

***记住：***

· ***测试你的设计：*** *使用颜色模拟工具预览你的设计在不同类型的色盲人士眼中的效果。*

· ***优先考虑文本可读性：*** *始终选择与背景有足够对比度的文本颜色。*

*遵循这些指导方针，你可以创建既美观又能被广泛受众所接受的设计。*

我在下面展示了我的使用[Adobe Color](https://color.adobe.com/create/color-wheel)工具可视化映射和测试Gemini指定的蓝色、青色和绿色的色盲情况。正如之前所述，所有三个生成AI工具在蓝色调中提供了类比示例。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*2fhmL6hGzDXRIzR_MA3EZA.png)

Gemini提供了一个类比示例，主色被标记为蓝色，然而在这个推荐中，中间的颜色是青色。通常，类比组合中的中间颜色是关键或主色，但在这种情况下则不是。这个蓝色、青色和绿色的类比色和谐配色通过了色盲测试。

**总结通过色盲测试的类比色和谐配色：**

在被问到“指定一个通过色盲测试的类比色和谐配色”时，所有三个生成AI系统提供了相邻于蓝色的颜色示例。每个聊天机器人也都在其提供的蓝色示例中提到了色盲问题。当进行色盲测试时，Open AI ChatGPT和Google Gemini建议的类比示例通过了测试，而Microsoft Copilot的配色方案则未通过。Open AI ChatGPT的类比方案非常狭窄，所有三种颜色都位于非常接近的蓝色范围内，并通过了色盲测试。Microsoft Copilot的方案使用了青色、蓝色和紫色组合，其中蓝色和紫色在色盲测试中发生了冲突。Google Gemini提供了一个蓝色、青色和绿色的组合，成功通过了色盲测试。在类比色和谐中，关键颜色通常是组合中的中心颜色。有趣的是，Google Gemini提供了它所称的蓝色类比方案，其中青色位于中心位置，我在下面展示这些结果的总结。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*R24XVM4HOKS2b98C3lzRGQ.png)

**将通过色盲测试的生成AI蓝色类比色方案应用于数据可视化示例：**

由于这两种配色方案都通过了色盲测试，我将ChatGPT蓝色类比和Gemini蓝色类比方案应用于一个条形图数据可视化示例。我使用了三个地区的预测销售数据。这些结果如下所示。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Cp5mz5h2ob7r6GO9K2lMQw.png)

在检查这两个数据可视化示例时，我更喜欢*ChatGPT蓝色类比*选项，而不是Gemini的*蓝色类比*建议。Gemini建议的青色和绿色之间的对比度并没有我所期望的那么显著。

让我们使用免费的在线[色盲模拟器（Coblis）](https://www.color-blindness.com/coblis-color-blindness-simulator/)工具检查这两个颜色方案在条形图数据可视化中的色盲情况。结果如下所示。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*aiUyGOVsCnfohKM6bO5yEw.png)

ChatGPT蓝色类比方案通过了测试，而Gemini蓝色类比方案在应用于此条形图示例时则处于临界状态。我决定为这个具体的数据可视化选择*ChatGPT蓝色类比*选项。

**回顾：**

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*9bWuFuTb2yv2jokd48moiQ.png)

在这篇文章中，我探讨了三个基于文本的生成AI工具，Open AI ChatGPT、Microsoft Copilot和Google Gemini如何解决我“指定一个通过色盲测试的类比色和谐配色”的请求。每个系统在蓝色调中提供了进一步检查的解决方案。不幸的是，Microsoft Copilot的解决方案未能通过Adobe Color的色盲测试，因此被排除在进一步考虑之外。OpenAI ChatGPT提供了一个狭窄的类比建议，其中所有三种颜色都在蓝色系列。Google Gemini提供了一个跨越蓝色、青色和绿色的类比配色方案。这两个建议被应用于条形图数据可视化。条形图数据可视化的色盲检查表明，ChatGPT蓝色类比条形图通过了测试，而Gemini蓝色类比数据可视化则在Tritanopia测试中处于临界状态。我为这个具体的数据可视化选择了ChatGPT蓝色类比条形图选项。

有关我与各种颜色建议工具探索的更多讨论，请参见我之前的[UX Collective和Nightingale](https://medium.com/@theresamarierhyne)文章，以及我在2016年出版的关于“[将色彩理论应用于数字媒体和可视化](https://www.crcpress.com/Applying-Color-Theory-to-Digital-Media-and-Visualization/Rhyne/p/book/9781498765497)”的书。我的书的[第二版](https://www.routledge.com/Applying-Color-Theory-to-Digital-Media-and-Visualization/Rhyne/p/book/9781032811727)现已开放预订，并将在2024年12月19日后发货。

**作者简介：**

Theresa-Marie Rhyne是一位可视化顾问，在制作和上色数字媒体与可视化方面拥有丰富的经验。她曾与斯坦福大学可视化小组合作开发颜色建议原型系统，参与加州大学戴维斯分校可视化中心以及犹他大学科学计算与成像研究所的色彩理论应用于集成数据可视化的咨询工作。在她的咨询工作之前，她创办了两个可视化中心：（a）美国环境保护署的科学可视化中心和（b）北卡罗来纳州立大学的可视化与分析中心。

