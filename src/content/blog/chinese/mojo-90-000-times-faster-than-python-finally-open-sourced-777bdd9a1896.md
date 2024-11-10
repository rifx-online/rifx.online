---
title: "Mojo，比 Python 快 90,000 倍，终于开源了！"
meta_title: "Mojo，比 Python 快 90,000 倍，终于开源了！"
description: "2024年3月29日，Modular Inc.宣布Mojo核心组件开源。"
date: 2024-11-10T22:36:54Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*jcayumihC6jn5q_0"
categories: ["Programming", "Machine Learning", "Data Science"]
author: "Rifx.Online"
tags: ["Mojo", "Python", "MLIR", "SIMD", "open-source"]
draft: False

---

2024年3月29日，Modular Inc.宣布开源Mojo的核心组件。

Mojo是一种专门为编写人工智能软件而设计的编程语言，去年八月正式发布。自那时以来，它已经吸引了超过175,000名开发者和50,000个组织。

人工智能模型通常使用多种编程语言编写。开发者通常使用Python实现神经网络的最简单部分，因为它易于学习，但相对较慢。其余代码通常用C++编写，虽然速度更快，但学习起来更复杂。

Modular将Mojo定位为一种更方便的替代方案。它提供了类似Python的易用语法，但执行速度有可能快上千倍。因此，开发者可以编写快速的AI模型，而无需学习像C++这样复杂的语言。



去年，当Mojo推出时，一些开发者对它的出现表示兴奋。然而，当被问及开源日期时，Chris Lattner在Discord上表示：“如果我知道，我会告诉你。”大约一年以来，许多开发者处于观察和质疑的状态：

> “宣传很好，但如果不是开源的，我不会花时间去尝试。”

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*rIJiJylh4-mWBiqz)

> “显然这是一个被过度炒作的编程语言，而且它不是开源的！Chris Lattner想要欺骗数百万Python开发者！”

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*0u5HDKseL0Gy_-8A)

> “我无法在一个可能开源也可能不开源的语言上花时间，尤其是在当前的OSS商业环境下……”

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*wrTO7fbKfBZOpBxF)

现在，Mojo终于开源了！在短时间内，它已经达到了17.6k颗星和2.1k个fork！

## 01 Mojo开源之旅的第一步

Modular今天宣布开源Mojo标准库的核心组件。标准库构成了编程语言的核心部分，包含基本的语法元素和基本功能。Mojo的标准库包括优化AI超参数的功能，这些超参数决定了神经网络如何处理数据。

“Mojo标准库仍在进行激烈的开发和快速变化，因此我们首先开源其核心模块。这标志着我们开源之旅的重要起点，而不是结束。”

该公司表示，开源将使他们能够从更多开发者那里收集反馈，从而促进Mojo的更好开发。此外，开源项目有多种方式：有些项目提供源代码但不接受贡献；有些则提供不透明的贡献流程，使得理解目标和路线图变得困难；还有一些虽然开源，但并未得到积极维护。Modular表示，他们选择了一种更全面的开源方式：通过GitHub拉取请求允许外部贡献，鼓励开发者参与Mojo的开发和改进，并促进社区的成长。

此外，Modular通过分享完整的提交历史，展示了诚意，从初始提交开始！公开修订开源标准库的历史使开发者能够跟踪代码的演变，更好地理解其含义。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*0-FqkfLUTevloPjI)

此外，他们将发布Mojo编译器的夜间构建，方便开发者快速尝试最新的编译器功能并进行持续集成测试。

去年年底，Modular推出了商业AI平台MAX，这是一个用于构建高性能AI应用的统一工具和库集，可以高效地部署在多个硬件平台上，例如在Kubernetes环境中运行AI应用。今天，该公司透露，他们还计划在未来开源MAX的一些组件。

此外，值得一提的是，他们选择了Apache 2 LLVM许可证进行开源。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*dgVCSxaCq6onY2uP)

这是Apache 2许可证的定制版本。此外，为了便于与遵循GPL2许可证的软件集成，Modular进行了相应的调整。GPL2是另一种流行的开源许可证，著名地用于Linux内核等项目。在公告博客中，Modular写道：

> “Apache 2许可证是一个良好的起点，但我们在LLVM项目中使用许可证的经验告诉我们，它有两个小问题。有人担心Apache 2许可证可能与GPL2代码（例如Linux内核）不兼容，并且Apache 2许可证要求您在派生项目中承认代码的使用。我们希望您能够使用Mojo，而不必强制承认Modular或Mojo。因此，我们添加了LLVM特别设计的例外条款，以解决这些问题。”

## 02 在未来50年中，AI编程的最佳语言是什么？

去年5月，当Mojo刚刚发布时，Modular声称它在运行Mandelbrot等算法时比原始Python快35,000倍。

去年9月，Modular再次表示：“Mojo结合了动态语言和静态语言的优点，性能提升至Python的68,000倍。”

去年10月，当Mojo在Mac上发布时，Modular再次提高了性能比较数据：“比Python快90,000倍。”

谈到Mojo，Modular的创始人兼首席执行官Chris Lattner表示：“你可以把Mojo看作Python家族的一员，借鉴了所有这些酷炫的语言、编译器和其他技术，使Python向前迈出了一大步。我们相信它增强了Python的能力，赋予Python程序员超能力，使熟悉Python的人能够学习新知识，探索和征服新领域，而无需切换到C++。”

Mojo基于MLIR中的最新编译器技术，这是LLVM的演变，因此性能更佳。只要程序员具备必要的技能并愿意充分优化，他们就可以让代码运行得极快。Mojo语言的目标是满足Python开发者的需求，同时提供一系列新的代码优化技术，以充分利用硬件设备的性能极限。

另一方面，Mojo团队高度赞赏Rust，并公开表示“Mojo的设计也受到Rust的极大启发。”

在性能方面，Modular进行了许多与Python的比较，以提供明确的对比，但人们并没有概念它比Rust快多少。就在上个月，他们专门回应了“Mojo是否比Rust快”的问题。

今年2月，Netflix工程师和Rust倡导者@ThePrimeagen发布了一段视频：用Mojo解析DNA序列，速度超过Rust 50%。这篇博客引发了很多关注和讨论，毕竟Rust被视为Python和C++在AI领域的潜在继任者。

@ThePrimeagen对Mojo和Rust在AI编程中的展望：

> 如果Mojo正式加入竞争，那么我相信Mojo无疑会胜出。Mojo获胜的原因在于，它不需要对开发者已经熟悉的范式进行任何改变。只需稍加学习，就能实现惊人的性能。首先，Mojo编译速度快，用户体验与大家已经熟悉的语言非常相似，性能可与Rust媲美。唯一的问题是如何让更多人接受它。

在发表评论后，受人尊敬的Rust贡献者及《Rust: From Zero to Production》的作者Luca Palmieri在X上回应：

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*Hqe7bPWGI36LPGzE)

Rust在系统编程领域拥有顶尖的设计，但在AI应用领域面临两个主要问题：

* 编译速度慢，而AI强调实验和快速迭代。
* 大多数有Python经验的AI研究人员不愿意花时间从零开始学习一门新语言。

Mojo旨在使Python开发者能够直观且轻松地掌握。正如Mohamed所示，他在几周内作为一个业余项目学习了Mojo，并利用SIMD优化算法（初始实现仅需200行代码）。

对于那些对AI开发感兴趣的人来说，确实存在在三种可用语言中选择其一的困境。

Mojo和Rust都允许开发者在更低的层面进行优化。对于Rust，开发者当然可以将所有内容打包到Arc、Mutex或Box中，以避免与借用检查器的冲突，但这可能会牺牲一些性能。虽然这种性能差异可能对应用代码没有显著影响，但在库或其他性能敏感代码中可能会迅速累积。两者的选择取决于程序员对减少开销和优化性能的关注。

这两种语言都可以利用LLVM进行代码生成优化，并允许使用内联汇编（尽管实际上不太可能有人这样做），因此理论上，两者在传统硬件上的性能潜力相似。

## 03 基于最先进的编译器技术

Rust 于 2006 年启动，而 Swift 于 2010 年出现，两者主要基于 LLVM IR 构建。而 Mojo 则在 2022 年首次亮相，构建于 MLIR 之上——与 Rust 使用的 LLVM IR 相比，MLIR 是一个更现代的“下一代”编译器栈。值得注意的是，Chris Lattner 在 2000 年 12 月大学时期创立了 LLVM，并从其多年的演变中学习了很多。他后来加入 Google 领导 MLIR 的开发，旨在支持公司的 TPU 和其他 AI 加速器项目。随后，他继续基于从 LLVM IR 中获得的知识进行探索。

Modular 表示 Mojo 是第一个充分利用 MLIR 高级特性的编程语言。它可以生成具有更高优化的 CPU 代码，并且还支持 GPU 和其他加速器，速度比 Rust 快得多。这是目前其他语言无法实现的优势，也是 AI 和编译器爱好者对 Mojo 热情的核心原因。

他们特别强调两个方面：

出色的 SIMD 人体工程学设计：CPU 通过特殊寄存器和指令同时处理多个数据元素，称为 SIMD（单指令多数据）。然而，从历史上看，编写此类代码的体验一直很糟糕，并且在人体工程学方面很难使用。尽管这些特殊指令已经存在多年，但大多数代码并未针对它们进行优化。因此，谁能解决这种复杂性并编写可移植的 SIMD 优化算法，谁就能在市场中脱颖而出，例如 simd_json。

Mojo 的原语从一开始就以 SIMD 为优先设计：UInt8 实际上是 SIMD\[DType.uint8, 1]，表示一个元素的 SIMD。这种表示不会带来性能开销，同时允许程序员轻松地将其用于 SIMD 优化。例如，文本可以被拆分为 64 字节的块，表示为 SIMD\[DType.uint8, 64]，然后与单个换行符进行比较，以找到每个换行符的索引。由于机器上的 SIMD 寄存器可以同时对 512 位数据执行操作，因此此操作可以将此类操作的性能提升 64 倍！

或者给出一个更简单的例子，假设你有一个 SIMDDType.float64, 8。只需将其乘以 Float64(2)，你就可以轻松提高性能。与逐个乘以每个元素相比，这种方法可以在大多数机器上将性能提高多达 8 倍。

LLVM（Rust 也在使用）具有自动向量化优化通道，但由于其无法更改 SIMD 的内存布局和其他重要细节，其性能从未达到理论优化水平。然而，Mojo 从一开始就考虑了 SIMD 特性，因此编写 SIMD 优化的体验与编写常规代码非常相似。

急切销毁：Rust 的设计受到 C++ 的 RAII（资源获取即初始化）启发，这意味着一旦对象超出作用域，应用程序开发人员不需要担心释放内存——编程语言本身会处理这一点。这是一个很好的例子，避免了垃圾回收的性能陷阱，同时确保了动态语言的人体工程学。

Mojo 更进一步，不是等到作用域结束，而是在对象最后一次使用时释放内存。这对于 AI 场景非常有益，因为提前释放对象意味着提前释放 GPU 张量，从而允许在等效的 GPU RAM 中适应更大的模型。这是 Mojo 的独特优势，使程序员能够在不必自己设计的情况下实现最佳性能。Rust 的借用检查器最初将所有事物的生命周期延长到其作用域的结束，匹配析构函数的行为，但这可能会给用户带来一些困惑的后果。Rust 后来添加了一些非词法生命周期特性，以简化开发人员的工作。然而，通过 Mojo 的急切析构机制，可以直接实现这种简化效果，并且与对象实际销毁的方式保持一致，从而避免令人困惑的极端情况。

Rust 另一个开销来自 Drop 的实现。它使用 Drop Flags 来跟踪对象是否应该在运行时被删除。Rust 能够在某些情况下进行优化，但 Mojo 可以通过显式定义消除所有额外开销。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*0VcMppg3rDTqfsMY)

无论如何，开发人员必须在 Mojo 和 Python 的易用性，以及 C、C++ 或 Rust 的高性能之间做出选择。对此，Mojo 团队呼吁开发人员：“如果你对未来充满好奇，希望掌握一种可能在未来 50 年内促进 AI 发展的语言，为什么不试试 Mojo 呢？”


