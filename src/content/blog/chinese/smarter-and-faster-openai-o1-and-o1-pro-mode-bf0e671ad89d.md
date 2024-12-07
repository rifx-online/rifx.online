---
title: "更智能、更快速：OpenAI o1 和 o1 pro 模式"
meta_title: "更智能、更快速：OpenAI o1 和 o1 pro 模式"
description: "OpenAI推出了新的o1模型及其专业模式o1-Pro，显著提高了在数学和编程等挑战性问题上的表现，准确率较之前版本提升1.4到1.5倍。o1模型具备多模态能力，能够同时处理文本和图像，且在思考速度上较o1-preview快50%。o1-Pro模型在复杂任务上稍优于o1，需订阅才能使用。整体来看，新模型在智能和效率上都有显著提升。"
date: 2024-12-07T12:37:07Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*QH51yWrZSTPzCtusAvb7EQ.png"
categories: ["Programming", "Machine Learning", "Natural Language Processing"]
author: "Rifx.Online"
tags: ["o1", "o1-Pro", "multimodal", "reasoning", "performance"]
draft: False

---



就在12小时前，OpenAI推出了新的o1模型和带有专业模式的o1。如您所知，o1模型是首个在回答之前进行思考的模型系列，提供更详细和准确的响应，特别是在数学、编码和研究方面。

人们关注两件事：**多模态性**和**解决难题**，而这些新模型在这两个领域表现出色。

> [非会员链接。](https://readmedium.com/smarter-and-faster-openai-o1-and-o1-pro-mode-bf0e671ad89d?sk=362863e4af96d1371ba29a3d92bc15af)

## 在解决困难问题上的超越表现

让我们来看看它们在具有挑战性的问题上的表现。



我们可以看到，o1相比于o1-preview模型有了显著的改进，更不用说gpt4o模型了。具体来说，新推出的o1模型在AIME数学竞赛和CodeForce编程竞赛问题上，比o1-preview模型高出约**1.4到1.5倍**。

GPQA钻石问题包含约200道多项选择题，每道题有四个答案选项。大约一年前，**GPT-4模型的准确率仅为36%**，勉强高于随机猜测的结果。现在，**o1模型的得分为78%**，可与人类专家相媲美。

此外，OpenAI还推出了一个更高级的模型，称为**o1-Pro**。用户只有在订阅Pro计划后才能访问o1-Pro，该计划目前的费用为**每月200美元**。**o1-Pro模型在这些具有挑战性的任务上表现略优于o1模型**。

> 注意，**OpenAI在这里使o1模型相比于前一图中的“o1”模型表现更弱**，以使Pro模式的o1模型显得更有能力。例如，在前一图中，o1模型的准确率为83.3，而在这里它在竞赛数学中的得分仅为78.3。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*3oG796wKEybJHpUQFq6eNw.png)

这看似微不足道，但考虑一下**最坏情况**：OpenAI通过**询问同样的问题四次**来测试模型，仅在模型四次都回答正确时才算作正确。与之前的图相比，**o1-Pro的表现下降是微乎其微的**。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*T425KvopcAIKrjdvtswoUg.png)

## 更快更聪明的思考

新的 o1 模型也更加智能。

如果你问一个简单的问题，它不会花太长时间思考，但如果你问一个更难的问题，它仍然可以花时间进行推理。根据 OpenAI 的说法，它的整体思维速度约为 **比 o1-preview 模型快 50%**，在下一个例子中你将看到这一点。

OpenAI 团队向 o1 和 o1-preview 模型提出了相同的问题：“列出第二世纪的罗马皇帝，包括他们的日期和成就。”由于罗马皇帝数量众多，模型需要时间来推理这些信息。 **o1 模型花费了 14 秒，而 o1-preview 模型花费了 33 秒**。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*dl0xh990DGHh4NQfoOC5sg.png)

## 多模态 \+ o1 模型

现在让我们来谈谈多模态。

之前，o1-preview 模型并不是多模态的，但 **新的 o1 模型现在可以同时处理文本和图像**。为了演示这一点，OpenAI 向模型展示了一幅手绘的 1GW 数据中心蓝图，设置在太空中。它特别包括了一个散热器冷却系统，因为在这种环境下没有空气或水来冷却 GPU。

> 注意：o1 目前仍不支持多模态文档。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*sK-QVSjDsilaqTQM2CRurw.png)

接下来，OpenAI 团队要求 o1 模型找出散热器面积的下限——就像你可能在一般物理教科书中遇到的问题一样。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*66wcUdNmcuIwA7yYAPhCkg.png)

从输出结果来看，我们看到模型准确识别了手写的“1GW”参数。由于文本或图像中没有指定冷却面板的温度，模型假设温度约为 300 K，并在此假设下进行计算。这意味着模型能够处理模糊性，从而进行推理并很好地执行计算。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*i4aizQt31kbDeRgKB_dNeA.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*83rITDh5P8wlDmT2Ti-IuA.png)

## o1\-pro模型

对于o1\-Pro，OpenAI通过提出一个具有挑战性的化学问题来展示模型的能力。

哪个蛋白质严格遵循以下标准？

1\. 前体多肽的长度为210到230个氨基酸残基。

2\. 编码该蛋白质的基因跨越32千碱基。

3\. 该基因位于X染色体上，具体位于Xp22带。

4\. 信号肽由23个氨基酸残基组成。

5\. 该蛋白质促进细胞间的粘附。

6\. 该蛋白质在维持特定部分神经系统的健康中发挥关键作用。

对于任何不熟悉这个主题的人，让我解释一下。

蛋白质的初始形式仅仅是一条由210到230个氨基酸组成的链。为了正常功能，这条链必须折叠成正确的3D结构。折叠该蛋白质的指令由一个跨越约32千碱基（32,000个碱基对）的基因编码，该基因位于X染色体的Xp22区域。

一旦正确折叠，蛋白质可以帮助细胞相互粘附，并在维持神经系统健康中发挥至关重要的作用。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*wPDO2kQJ7i3C-dXuJ6F2wg.png)

这是一个具有挑战性的问题，因为每个标准包括成千上万的候选者。因此，模型进入“思考”状态，花费数分钟来确定答案。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*2E5UaasvZIq4ZNwqq8kvjA.png)

一旦完成，您可以点击查看模型为得出答案而经历的推理步骤。模型的答案是“RS1”，相当准确。您可以在以下网站验证该基因信息：

[*Retinoschisin 1 GeneCards*](https://www.genecards.org/cgi-bin/carddisp.pl?gene=RS1&utm_source=chatgpt.com)

[*RS1，含有Discoidin结构域的视网膜细胞粘附蛋白，关联于X-连锁视网膜裂孔，存在为一种新型二硫键连接的八聚体*](https://www.jbc.org/article/S0021-9258%2819%2930478-8/fulltext?utm_source=chatgpt.com)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*tfrGE55ngwB0Ioxazrfg6Q.png)

