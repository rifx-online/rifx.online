---
title: "解锁 LLM 量化的 5 个关键点"
meta_title: "解锁 LLM 量化的 5 个关键点"
description: "量化大型语言模型"
date: 2024-10-23T11:56:14Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*RUqPEr2NTYXlI1omqF22Qg.png"
categories: ["large-language-models"]
author: "Rifx.Online"
tags: ["large-language-models"]
draft: False

---



### 大型语言模型的量化



LLM量化目前是一个热门话题，因为它在提高大型语言模型（LLMs）的效率和在各种硬件平台（包括消费级设备）上部署方面发挥着至关重要的作用。

通过调整模型中某些组件的精度，**量化显著减少了模型的内存占用**，同时保持相似的性能水平。

在本指南中，我们将探讨LLM量化的五个关键方面，包括将此技术应用于我们模型的一些实用步骤。

## #1. 理解量化

量化是一种模型压缩技术，通过降低 LLM 中权重和激活的精度来实现。这涉及将高精度值转换为低精度值，实际上是**将存储更多信息的数据类型更改为存储更少信息的数据类型**。

减少每个权重或激活所需的位数显著降低了整体模型大小。因此，**量化创建了使用更少内存和需要更少存储空间的 LLM。**

这一技术在应对 LLM 连续迭代中参数数量的指数增长时变得至关重要。例如，在 OpenAI 的 GPT 系列中，我们可以在以下图表中观察到这一增长趋势：

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*QlAhma3Wu1F6w2WvkE8jDA.png)

这一显著增加带来了挑战：随着模型的增长，它们的内存需求往往超过先进硬件加速器（如 GPU）的容量。**这需要分布式训练和推理来管理这些模型，从而限制了它们的可部署性。**

## #2. 量化背后的直觉

尽管量化的定义看起来相当复杂，但这个概念可以通过矩阵直观地解释。

让我们考虑以下一个 3x3 矩阵，表示神经网络的权重。左侧的矩阵显示了原始权重，而右侧的矩阵显示了这些权重的量化版本：

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*LPzWe9oxjlDYdSp7dVvRUg.png)

在这个简单的例子中，我们将原始矩阵的元素从四位小数四舍五入到一位小数。尽管矩阵看起来相似，**但四位小数版本所需的存储空间显著更高**。

在实践中，量化不仅仅是一个四舍五入操作。相反，它涉及将数值转换为不同的数据类型，通常是从更高精度转换为更低精度。

例如，大多数模型的默认数据类型是 `float32`，每个参数需要 4 字节（32 位）。因此，对于一个 3x3 矩阵，总内存占用为 36 字节。将数据类型更改为 `int8`，每个参数只需要 1 字节，从而将矩阵的总内存占用减少到仅 9 字节。

## #3. 量化误差

正如我们所看到的，原始矩阵及其量化形式并不完全相等，但非常相似。逐值之间的差异被称为“量化误差”，我们也可以用矩阵形式表示：

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*VtGDjVbr7daagLXB57i7Mg.png)

**这种量化误差可以在网络中的每个权重矩阵中累积，从而影响模型的性能。**

当前的量化研究旨在最小化精度差异，同时减少训练或推理模型所需的计算资源，同时保持可接受的性能水平。

## #4. 线性量化

线性量化是 LLMs 中最流行的量化方案之一。简单来说，它涉及将原始权重的浮点值范围映射到固定点值范围。

让我们回顾一下将线性量化应用于我们的模型所需的步骤：

* **获取最小和最大范围：** 我们需要获取待量化的浮点权重的最小值和最大值（`x_min` 和 `x_max`）。我们还需要定义量化范围（`q_min` 和 `q_max`），该范围已经由我们想要转换的数据类型设置。
* **计算缩放因子（`s`）和零点（`z`）值：** 首先，缩放因子（`s`）将浮点值的范围调整到适合整数范围，保持数据分布和范围。其次，零点（`z`）确保浮点范围内的零被准确地表示为整数，从而保持数值的准确性和稳定性，特别是对于接近零的值。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*BepC6-izw0yE19ejsS705Q.png)

* **量化值（`q`）：** 我们需要使用在前一步计算的缩放因子（`s`）和零点（`z`）将原始浮点值映射到整数范围。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*BBOQ0VbSGbwf7CN8c4PWKQ.png)

应用这些公式相当简单。如果我们将它们应用于下图左侧的 3x3 权重张量，我们将得到右侧所示的量化矩阵：

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*KzBvg84mfI2gAhTIyVibwQ.png)

我们可以看到，`int8` 值的下限对应于原始张量的下限，而上限对应于原始张量的上限，*即，映射为 `0.50 → 255` 和 `-0.40 → 0`。*

我们现在可以使用下面的公式对值进行反量化。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*E5nnqYzncYCRuM5prssuOw.png)

如果我们将反量化后的值再次放入矩阵形式（左侧矩阵），我们可以通过计算原始矩阵与其反量化版本之间逐点差异来计算量化误差（右侧矩阵）：

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*56NALu9PAN95QG2hn8HXoQ.png)

正如我们所观察到的，量化误差开始在某些矩阵值中显现。

## #5. 权重量化与激活量化

在上面的例子中，我们主要关注于量化模型的权重。虽然权重量化对于模型优化至关重要，但考虑到激活也可以进行量化同样重要。

**激活量化涉及减少网络中每层的中间输出的精度**。与权重在模型训练后保持不变不同，激活是动态的，并且随着每个输入而变化，使其范围更难预测。

一般而言，激活量化比权重量化更具挑战性，因为它需要仔细校准以确保准确捕捉激活的动态范围。

权重量化和激活量化是互补的技术。两者结合使用可以显著减少模型大小，而不会大幅影响性能。

## 最后的思考

在本文中，我们回顾了关于量化的5个关键点，以更好地理解如何减小这些不断增长的模型的大小。

至于这些技术的实现，Python中有几个支持量化的工具和库，例如`pytorch`和`tensorflow`。然而，在现有模型中无缝集成量化需要对库和模型内部结构有深入的理解。

这就是为什么到目前为止，我最喜欢的简单步骤实现量化的选项是Hugging Face的[Quanto](https://huggingface.co/blog/quanto-introduction)库，旨在简化PyTorch模型的量化过程。

如果你对LLM量化的深入内容以及如何使用上述库感兴趣，你可能还会对文章[“大型语言模型（LLMs）的量化：有效减少AI模型大小”](https://www.datacamp.com/tutorial/quantization-for-large-language-models)感兴趣。

就这些！非常感谢你的阅读！

我希望这篇文章能在**使用LLMs进行编码时**对你有所帮助！

你也可以订阅我的[**时事通讯**](https://readmedium.com/@andvalenzuela/subscribe)，以便及时获取新内容。

**特别是**，**如果你对有关大型语言模型和ChatGPT的文章感兴趣**：

