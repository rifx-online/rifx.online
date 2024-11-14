---
title: "面向 iOS 开发人员的 5 大人工智能工具"
meta_title: "面向 iOS 开发人员的 5 大人工智能工具"
description: "本文介绍了五大AI工具，旨在提升iOS开发者的工作效率。首先是Cursor/VSCode，通过GitHub Copilot实现快速编码和智能重构。其次是GitHub Copilot的Xcode扩展，提供AI辅助编辑功能。第三是Swift Assist，虽然尚未完全可用，但有潜力生成代码。接着是ChatGPT及其衍生工具，适合快速迭代代码。最后是Alex Sidebar和AIProxy，分别为Xcode提供扩展功能和安全集成AI API。整体上，这些工具为iOS开发者提供了高效的编码体验。"
date: 2024-11-14T03:29:09Z
image: "https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*6Hs8174FgiwTv87e.jpg"
categories: ["Programming", "Technology/Web", "Generative AI"]
author: "Rifx.Online"
tags: ["Cursor", "VSCode", "GitHub", "Copilot", "Swift"]
draft: False

---

### 提高工作流程速度与效率



虽然关于人工智能的讨论很多，但我想让你回归现实。无论你是否已经在使用 AI 辅助的编码工具，或者觉得这一切都是无稽之谈……这篇标题吸引眼球的文章可能适合你。

虽然你可能已经能找到很多关于如何使用各种工具来提高你的技能、效率和准确性的文献，但对于我们 iOS 开发者来说，这要复杂一些。因为我们依赖 Xcode 及其工具链来构建我们的应用，所以我们很难不使用 Xcode。而我将在接下来的段落中列出和解释的并不是所有工具都与跳过 Xcode 有关。

## 1\. Cursor / VSCode

显然，这是列表的首位。除非你一直在石头下冬眠，否则你可能听说过VSCode。在Swift项目中使用它并不是新鲜事。内置于VSCode的GitHub Copilot允许你以光速编码，而无需进行太多设置。他们最近在VSCode中集成了更多的Copilot功能，越来越接近Cursor。除了标签补全外，你现在还可以进行内联聊天和代码生成。

Cursor是VSCode的一个分支，按照我的经验，他们的Cursor标签补全功能比VSCode更快、更准确。

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*pQ4SuReyicAiBCG3.gif)

他们还做了一些让我节省了无数小时的事情：智能/AI辅助重构。这可能是值得Cursor订阅的最佳功能之一。

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*JlzVJ6o18sulIUEeo_p5sg.gif)

而且这不仅仅是重构；在更改一行后，它在智能编辑中也会表现出色。Cursor会显示一个“标签”指示符，表示它对你刚刚编辑的代码部分提出了更改建议。只需按下标签键即可级联更改，这样可以不断进行下去。标签标签标签。

一旦你进入状态，你会发现自己能多么高效。我编码的流程和往常一样，但因为我需要写的代码少得多，所以速度更快。你使用它编码的越多，它就越能学习你的项目、编码风格等……一开始可能会显得有些不适应，但相信我，给它一点时间。

你还可以通过内联聊天生成代码：

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*pVzU2MZ0vNFQ6-dRaWPy-w.gif)

当你需要一个特定的算法，或者在现有代码中拥有所有上下文但需要编写一些繁琐的部分时，这非常有用。它的效果相当不错，也能节省很多时间。别忘了审查生成的代码 :)

为了专门开始iOS开发，我鼓励你阅读我另外两个故事：

一个是关于如何设置它，安装正确的扩展等……

另一个是关于如何将你的Xcode项目从基于组的转换为基于文件夹的，以便你可以在VSCode/Cursor中自由创建/删除/移动文件，而无需触碰.xcodeproj / Xcode。

这只是Cursor/VSCode在iOS开发中的表面。但你今天就应该开始！

## 2\. GitHub Copilot Xcode 扩展

这是一个最近发布的扩展，最初是 [Intitni](https://proxy.rifx.online/https://github.com/intitni/CopilotForXcode) 的一个项目，但似乎 GitHub 已经对其进行了分叉/收购，并使其成为 Copilot + Xcode 的官方扩展。到目前为止，虽然用户体验并不完美（可以理解，因为他们必须与可访问性/窗口 API 一起工作），但它比 Apple（本地）Xcode 模型要好得多。

而你很幸运，我已经写过关于它的内容：

如果你还不准备切换到 Xcode 以外的其他编辑器，但仍想使用高效的 AI 辅助代码编辑，那么这个扩展就是为你准备的！

## 3\. Swift Assist

虽然 Xcode 已经内置了一个用于预测代码补全的本地模型（仅在 Xcode 16 的 Apple Silicon Mac 上可用），但 Apple 在 WWDC 上透露了其他内容：

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*-mlY8GyGh3VPVhyg3TmLYw.png)

Swift Assist

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*XJnlRo8mqrAMZEVEL64ufg.gif)

这看起来像是我上面演示的 Cursor 的聊天 + 代码生成。它应该能够根据你的评论生成代码。但目前，这仍然是一个虚幻的产品。Xcode 16\.2 beta 2 提到了它，但我们仍然无法进行测试。

也许它会在 Xcode 16\.2 beta 的后续版本中推出，我迫不及待想要测试并写关于它的内容！

## 4\. ChatGPT/Claude/Perplexity 网络界面

有时候，回归基础是最好的选择。虽然这些代码编辑器使用了Anthropic和OpenAI的模型以及它们自己的模型，但在当今的环境中，使用它们的网络界面也是一种宝贵的工具。

### ChatGPT \+ Canvas

OpenAI 的 ChatGPT 在过去几个月中有了很大的进展。最近发布的 o1-preview 版本带来了推理和画布功能，使得在 ChatGPT 网页界面中进行编码会话变得更加顺畅。

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*WUraNCcZMrCRrHMilgzl-Q.png)

画布是一个构建在 ChatGPT 网页界面上的迷你代码编辑器，允许您快速迭代代码和想法。您可以使用聊天进行增量更改，还有其他一些工具可以对代码进行注释、进行内联更改、转换为其他语言等。

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ab7PdMLJwacZtVsET2YYmA.gif)

虽然这不能让您构建完整的应用程序，但它是一个在标准编辑器之外快速迭代代码想法的好工具。

### Claude 伪影

这与 ChatGPT Canvas 类似，但具有一些其他功能，例如预览（显然不支持 Swift/SwiftUI）和同时处理多个文件。

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*2iverELFSGqnJzklPK0cYg.png)

## 5\. Alex Sidebar

这是一个新的竞争者！前提很简单，因为 Xcode 是闭源的，扩展 API 相当有限，为什么不围绕 Xcode 构建呢？

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*vZgn_FjH0FW53c7qZ4DZAg.png)

我对用户体验并不太满意，但它提供了大多数 Cursor 功能，作为一个像窗口一样构建的 Xcode 侧面板。这里有各种快捷键 + 代码补全 + 聊天。你绝对应该尝试一下，看看它是否能改善你的工作流程！

## 6\. AIProxy

作为（3）Swift Assist的额外奖励，它并不是真正的….可用

这不是一个用于编码的工具，而是一个为构建者准备的工具。当在你的iOS应用中集成AI API时，你很可能需要将API密钥添加到你的项目中。但正如我们所知（对吧！），你不应该将其放在客户端。如果这样做，几乎任何人都可以轻易获取你的API密钥，并代表你使用你的AI积分。

进入[AIProxy](https://proxy.rifx.online/https://www.aiproxy.pro/)，他们提供开源SDK，易于集成，并支持你所需的所有AI提供商。

如果你不想构建一个后端来代理你的AI调用，这就是适合你的工具！


