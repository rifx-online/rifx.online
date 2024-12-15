---
title: "使用 ChatGPT 4o 的视觉分析逐步生成旅程中期提示"
meta_title: "使用 ChatGPT 4o 的视觉分析逐步生成旅程中期提示"
description: "本文介绍了通过利用ChatGPT 4o的视觉分析功能来创建Midjourney提示的有效方法。作者强调图像质量和多样性对生成结果的重要性，建议每次上传不超过25张图像。通过结构化的分析提示，ChatGPT能够识别图像中的关键元素、艺术风格和色彩搭配，从而帮助用户提炼出最佳的设计模式。最终，作者提供了一个成功提示的结构，并指出保持简单和清晰是生成高质量提示的关键。此方法具备灵活性，适用于多种艺术风格。"
date: 2024-12-15T01:33:46Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*oq1D9LYxs9Eg9ynv7iIkIA.png"
categories: ["Natural Language Processing", "Generative AI", "Technology/Web"]
author: "Rifx.Online"
tags: ["Midjourney", "ChatGPT", "reference", "analysis", "creativity"]
draft: False

---





你是否有过这样的感觉：想要创建完美的 Midjourney 提示，但言辞却无法表达你脑海中的想法？我也经历过这样的时刻。在无数小时的实验后，我发现了一种改变游戏规则的方法：利用 ChatGPT 4o 的视觉能力分析参考图像并生成精准的提示。

让我分享我的旅程和我使用的确切过程。相信我，这将改变你创建 AI 艺术的方式。

## 灵光一现 💡

我曾经花费数小时描述我想要的内容给 Midjourney。有时有效，但往往无效。然后我意识到——为什么要描述，当我可以展示呢？

ChatGPT 4o 的视觉分析成为了我的秘密武器。我不再苦苦挣扎于描述，而是让它分析我喜欢的图像并将其转换为完美的提示。

## 入门：图像收集阶段

首先，收集你的灵感。但这里有一个我通过实践学到的重要提示：不要过度收集图像。

根据我的实验，最佳数量是每次对话不超过25张图像。这使得一切都能保持可管理，并确保详细分析。

我希望在开始时就知道的一个颠覆性见解是：**你收集的图像的质量和多样性直接影响你的最终结果**。把它想象成通过示例教学——如果你提供给ChatGPT多样且高质量的参考资料，真正代表你想要的内容，它将更好地理解你的愿景。我通过更加挑剔我的参考图像，看到提示质量的巨大差异。

我将其分成每批10张图像。这种系统化的方法始终给我带来最佳结果。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*-q4ocl4S-Dg8SR3ry1eCXQ.png)

## 魔法公式：初步分析阶段

这是我用于初步分析的确切提示（随意复制）：

```python
Please analyze the uploaded images in detail.
For each image, identify:
Key elements (e.g., objects, patterns, and
recurring motifs).
The artistic style used (e.g., paper-cut,
abstract, minimalist).
The dominant color palette and transitions
between shades.
The theme or mood conveyed by the
composition.
Provide your findings in a format similar to
this:
Image 1 (Full Moon with Cherry Blossoms)
Elements: [description]
Style: [description]
Color Palette: [description]
Theme: [description]
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*AzDXzoDMa1b1r4ALn4yIdA.png)

### 为什么这个方法如此有效

可以把它看作是请一位专业艺术评论家分析你最喜欢的作品。结构化的格式帮助 ChatGPT 系统地分解每一幅图像。

我发现这种方法能够捕捉到我自己可能错过的细节。就像多了一双眼睛，能够看到一切。

### 两批策略

这是我经过时间考验的方法：

**第一批（前10张图片）**上传您的第一组图片并使用分析提示。花一些时间查看结果。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*NVDUPQCBFMEGAvc8WTsjgg.png)

**第二批（接下来的10张图片）**使用您的第二批重复该过程。这将帮助您全面了解自己的风格偏好。

## 寻找模式：秘密调料 🎯

在分析了两个批次后，我使用这个简单但强大的提示：


```python
based on details in all uploaded images in
this conversation and Identify common
patterns and predict top 5 most preferred
objects and design patterns
```
这就是魔法发生的地方。ChatGPT 开始将你所有的参考资料联系起来。

## 制作完美提示

现在进入有趣的部分。这是我最终的提示，始终能产生惊人的结果：

```python
using the preferred objects and design
patterns craft 6 Midjourney AI prompts that
will create a series of close-up vector
images that illustrate 3D red paper cut for
Chinese New Year and parameters --ar 16:9
--stylize 50 --v 6.1  
exclude dragon and tiger as part of the
prompt
and following are prompts example, can
analyze them to understand the Midjourney AI
prompt structure better, but not copying
their details: 

A red paper-cut of a peony flower. It is
simple and pretty. --ar 16:9 --stylize 50 --v
6.1
A beautiful paper-cut card with soft colors.
It shows a child happily playing with an
abacus at the Mid-Autumn Festival night.
There are lanterns and a family together. It
is mostly red. --ar 16:9 --stylize 50 --v 6.1
A red paper-cut of a peony flower. It is
simple and pretty. --ar 16:9 --stylize 50 --v
6.1
A flat paper-cut of a pretty Chinese window
flower. The flower has simple shapes and
smooth lines. It is on a white background.
--ar 16:9 --stylize 50 --v 6.1
```

### 有效的结构

每个成功的提示都遵循这个模式：


```python
[Main Subject] + [Style Description] + [Additional Details] + [Technical Parameters]
```
可以把它想象成一个食谱——每个组成部分在最终结果中都扮演着至关重要的角色。

### 避免常见陷阱

通过我的实验，我学会了注意以下几点：\- 过于复杂的描述\- 缺失技术参数\- 混合冲突的风格\- 观点不清晰

保持简单和专注。对于 Midjourney 提示，少即是多。


```python
A beautiful 3D red paper-cut featuring a
pagoda at the center, surrounded by swirling
clouds and symmetrical cherry blossoms. The
design showcases a layered composition with a
harmonious balance of traditional Chinese
elements --ar 16:9 --stylize 50 --v 6.1
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*R2TTkUsnQLkI0xuszVh0Jg.png)


```python
A close-up of a peony flower in a 3D red
paper-cut style. The layers highlight the
petals' intricate patterns with fine details
on each leaf. The background includes subtle
curves and smooth circular shapes, enhancing
the elegant simplicity of the composition.
--ar 16:9 --stylize 50 --v 6.1
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*wxCcsfie-YVeVslVeBe9Cw.png)

## 简单提示的魅力 🎯

我在实验中发现了一些有趣的事情：一旦 ChatGPT 理解了我们之前互动中 Midjourney 提示创建的上下文，我们就可以切换到非常简单的提示。例如，我现在只问“用 7 岁孩子能理解的英语描述附加的图像”，就能得到完美详细、清晰的描述。ChatGPT 4o 对我们之前 Midjourney 讨论的记忆帮助它提供了适合提示生成的描述。这种简单性是强大的——它使整个过程更易于接近，技术性更低。就像和一个已经知道你想要达成目标的朋友进行对话。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*s9iYDvu0XwPKa5gerI-l2A.png)


```python
A red paper-cut of a pagoda surrounded by
clouds and cherry blossoms. The intricate
layers emphasize symmetry, with delicate 3D
cutouts showing fine details on the pagoda's
roof and branches. The background features
flowing organic shapes and swirling clouds.
--ar 16:9 --stylize 50 --v 6.1
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*9Clq0QhmUGE1p9oQ1TnaRw.png)


```python
An artistic 3D red paper-cut depiction of
plum blossoms on curved branches. The design
showcases organic flow with smooth layers and
subtle shadowing, embodying elegance and
natural beauty. --ar 16:9 --stylize 50 
--v 6.1
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*cl19GZUp746YwFAMQTz9IQ.png)


```python
A 3D red paper-cut design featuring a
blooming peony surrounded by intricate
flowing branches and delicate foliage,
symbolizing prosperity and beauty. The design
is highly detailed with layered cuts to
create depth. --ar 16:9 --stylize 50 --v 6.1
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*wCFfbSiYdZVeKJ69GrMWTQ.png)

## 多功能性的力量 🎨

我最喜欢这种方法的地方在于它的灵活性。只需更改您的样本图像集，您就会获得一整套针对新方向定制的提示。想从中国剪纸风格切换到赛博朋克美学？没问题。只需给ChatGPT提供一组新的赛博朋克参考，它就会生成与该风格相匹配的新提示。这使其成为一个适应您感兴趣的任何艺术风格的通用提示生成框架。


```python
A 3D red paper-cut featuring a traditional
Chinese pagoda surrounded by pine trees and
layered clouds. The pagoda’s intricate roof
design is highlighted against a red
background with subtle white accents for
contrast. --ar 16:9 --stylize 50 --v 6.1
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*YuMfUJs-riFl9eYXFmfu6w.png)


```python
An elegant 3D paper-cut composition in rich
red with pure white underlays, showing ornate
pavilions nestled among cloud patterns.
Architectural details reveal multiple depth
layers, with white accents highlighting roof
tiles and lattice work. Intricate geometric
borders frame the scene with dimensional
shadows. --ar 16:9 --stylize 50 --v 6.1
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*A5r_lnbDNWWZVKzn31jP9w.png)


```python
A close-up of a serene full moon surrounded
by delicate cherry blossom branches in a 3D
red paper-cut style. The blossoms are
detailed with layered petals, and the
background is textured to emphasize depth.
The composition exudes elegance and
tranquility. --ar 16:9 --stylize 50 --v 6.1
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*KV2zPs-b16ppk9wviZD41g.png)


```python
A flat 3D red paper-cut illustration of a
blooming magnolia branch with smooth petals
and curved leaves. The design includes
minimal background swirls, focusing on
simplicity and elegance. --ar 16:9 
--stylize 50 --v 6.1
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*y1vLUnv9xaAGJA1KgMtBxQ.png)


```python
A delicate 3D red paper-cut of a full moon
surrounded by cherry blossom branches and
swirling clouds. The design is framed with
layered circular patterns, creating an
elegant and peaceful atmosphere --ar 16:9
--stylize 50 --v 6.1
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*qFqPF4pbdWtUVFj1woSBbg.png)

### 最后的想法 🌟

这种方法彻底改变了我使用 Midjourney 的创作方式。这不仅仅是生成提示，而是理解你的艺术偏好并有效地将其转化。

记住，关键是耐心和系统的方法。不要急于完成分析阶段——那些见解对于创建完美的提示至关重要。

### 轮到你来创造了

为什么不试试这个方法呢？从一小批你喜欢的图像开始，让 ChatGPT 4o 的视觉能力引导你更好地生成提示。

在你的作品中标记我——我很想看看你用这种方法制作的内容！

**祝你提示愉快！欢迎在下面的评论中提出问题。**

