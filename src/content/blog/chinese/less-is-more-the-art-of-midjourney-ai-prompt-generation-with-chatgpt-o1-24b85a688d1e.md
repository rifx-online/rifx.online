---
title: "少即是多：使用 ChatGPT 生成中途人工智能提示的艺术 o1"
meta_title: "少即是多：使用 ChatGPT 生成中途人工智能提示的艺术 o1"
description: "本文探讨了使用 ChatGPT o1 生成 Midjourney AI 提示的艺术。作者通过实验发现，当生成较少的提示时，ChatGPT o1 能够生成更高质量的输出。具体而言，作者通过提供详细的场景类型、情绪类别、光照和氛围条件等信息，生成了多个不同情绪的河流场景提示。实验结果表明，小批量生成的提示在氛围描述、光线元素和环境细节方面更加丰富和细腻，更符合 Midjourney AI 的要求。作者建议 AI 艺术创作者从较小的批量请求开始，以确保生成的提示词质量和效果。"
date: 2024-12-12T01:33:58Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*xohsmh0Qg0b-5OtjuSjlkA.png"
categories: ["Chatbots", "Generative AI", "Machine Learning"]
author: "Rifx.Online"
tags: ["ChatGPT", "Midjourney", "prompts", "river", "scenes"]
draft: False

---





作为一名 AI 艺术创作者，当 OpenAI 发布了声称具有博士学位水平智能的 ChatGPT o1 时，我自然感到非常兴奋。虽然许多人急于测试其编码或写作能力，但我有一个不同的关注点：它在帮助生成 Midjourney AI 提示方面表现如何？

我在 AI 提示生成方面的旅程是逐步发展的。最初，使用之前的 ChatGPT 版本时，我系统地工作，逐个生成提示，并在 AI 的帮助下仔细改进每一个。这种有条不紊的方法取得了不错的效果，但我很好奇 ChatGPT o1 的高级功能是否能够同时生成多个提示。

## 初始实验

对 ChatGPT o1 声称的能力充满信心，我提供了一个全面的结构，用于生成 24 个不同的河流场景提示。我的输入详细且系统，包括明确的类别：

* 宁静/平静的场景
* 安详的环境
* 充满活力/动态的水流
* 神秘/超现实的场景
* 戏剧性的环境
* 不同的光照条件

对于每个类别，我提供了具体的元素，例如光照效果、水纹和大气条件。结果是可用的，但相对基础。例如，一个提示是：“*黄昏时宁静的河流场景照片，平静的水面映射周围环境，重点突出金色时刻的效果*。”

为了获得 24 个 Midjourney AI 提示：


```python
河流场景可能的情绪
河流场景可以唤起许多不同的情绪，具体取决于涉及的元素。以下是一份按一般情感基调分组的可能情绪列表：

1. 宁静/平静
   安详
   平静
   宁静
   沉思
   反思
2. 充满活力/动态
   强大（例如，湍急的水流）
   清爽
   冒险
   振奋
3. 神秘/梦幻
   迷人
   神奇
   虚幻
   超现实
4. 悲伤/沉郁
   阴郁
   悲伤
   怀旧
   孤独
5. 明亮/乐观
   欢快
   辉煌
   温暖
   令人振奋
6. 戏剧性/强烈
   神秘
   暴风雨
   令人不安
   令人敬畏

影响河流场景情绪的因素
光照：柔和的晨光与戏剧性的日落或阴天的阴影。
色彩调色板：温暖的大地色调与冷色调的蓝色和灰色。
水流：静止的反射水面带来平静感，而湍急或汹涌的水流则增加能量或戏剧性。
周围环境：茂密的绿色植被感觉宁静，而荒凉的景观可能感觉孤独或严峻。
额外元素：鸟类、雾气、岩石或人类互动（如单独垂钓的人）增加情感深度。

根据上述可能的情绪列表，修改以下提示，并创建 24 个不同的独特河流场景 Midjourney AI 提示，以“照片”开头：
照片：宁静的河流场景，周围是茂密的森林。阳光透过树木洒下，将金色和绿色的光芒投射在水面上，水面像镜子一样反射周围环境。整张照片的氛围平静而宁静，强调自然的美丽。突出光影和倒影的相互作用，营造出宁静的氛围。

- 不使用“切割”一词
- 不包括人类活动
```

## 意外的发现

随后出现了意想不到的突破。根据我之前的经验，我决定尝试一个更小的批次——仅基于特定情绪的6个提示：宁静、平静、安静、冥想、反思和迷人。使用相同的清晰信息结构，结果非常显著。

质量上的差异非常明显。以下是一个来自6个提示批次的例子：“*宁静的河流场景，周围是茂密的森林。阳光透过树冠，形成斑驳的金色和翠绿色图案，映在平静如镜的水面上。整体氛围宁静祥和，光影交织，营造出一种静谧的和谐感*。”

对比非常明显——更小的批次生成的提示具有：

* 更详细的氛围描述
* 更精致的光线元素
* 更丰富的环境细节
* 更微妙的情绪设定
* Midjourney AI 能够理解和有效处理的术语


```python
Serene
Tranquil
Quiet
Meditative
Reflective
Enchanting
Magical
Ethereal
Otherworldly

by referring the following Midjourney prompt
and create 9 different unique river scene
Midjourney AI prompts ,
- 1 for each mood listed above, 
- same subject, environment and composition
as the attached image
- starting with "photo of" :
photo of a serene river scene surrounded by a
dense forest. Sunlight streams through the
trees, casting golden and green hues on the
water, which reflects the surroundings like a
mirror. The overall mood of the image feels
calm and peaceful, with an emphasis on
nature's beauty. highlights the interplay of
light, shadow, and reflections, creating a
tranquil atmosphere. 

- don't use the term "cutting"
- don't include human activities 
```

### 超凡脱俗：

```python
photo of an otherworldly river scene
surrounded by a dense forest. Sunlight
streams through ancient trees, casting
shimmering gold and emerald hues across the
still, reflective waters. The overall mood
feels beyond the ordinary, as light and
shadow converge into a vision of nature’s
mystical grandeur --ar 16:9 --stylize 50 
--v 6.1
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*qm-M_hhLdlYLrFMOdnGZgA.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Bpxcfy8fGKNlN3fG0rxhXg.png)

### 空灵：

```python
photo of an ethereal river scene surrounded
by a dense forest. Sunlight drifts dreamily
through the canopy, layering the water with
subtle gold and green reflections that seem
to glow from within. The overall mood is
otherworldly and delicate, as light and
shadow blend to form a soft, transcendent
aura --ar 16:9 --stylize 50 --v 6.1
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*9AxNfqWc6jYTlh9daikuqQ.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*J3y35nbbYW5vtEoZ5bhm_g.png)

### 神奇的：

```python
photo of a magical river scene surrounded by
a dense forest. Sunlight filters through
leafy branches, scattering radiant gold and
vivid green glimmers that dance across the
serene water’s surface. The overall mood is
spellbinding, as light and shadow unite in a
luminous, fairy-tale setting --ar 16:9
--stylize 50 --v 6.1
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*MoDQAIFOzTho6EZk6PefZA.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Ax9Bf1FUZ3bnS4U7VZZOvg.png)

### 迷人的：

```python
photo of an enchanting river scene surrounded
by a dense forest. Sunlight weaves through
tall trees, sprinkling sparkling gold and
lush green reflections across the gentle
waters. The overall mood feels magically
alluring, as light and shadow create a
captivating natural tapestry --ar 16:9
--stylize 50 --v 6.1
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*nsuKk4tlQ1KSZPj_jSG-qQ.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*4ZPy8UR6WFLtR_COh66U0g.png)

### 反射性：

```python
photo of a reflective river scene surrounded
by a dense forest. Sunlight pierces the
canopy, scattering warm gold and soft green
hues that shimmer upon the water’s
mirror-like face. The overall mood is
contemplative and introspective, encouraging
quiet observation of nature’s flawless
symmetry --ar 16:9 --stylize 50 --v 6.1
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*LCBkxXNuWzdOoNt65QaAQQ.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*AMbNZ23V7KdeYxS0OYLxWg.png)

### 宁静：

```python
photo of a quiet river scene surrounded by a
dense forest. Sunlight filters between
branches, painting muted golden and green
tones across the calm, reflective surface.
The overall mood is hushed and gentle,
celebrating the subtle beauty of nature’s
silent presence --ar 16:9 
--stylize 50 --v 6.1
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*7DkpSaXj7jGyvbT4gnCpPQ.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*oPjOwiETwQ0a2cd2Khxy3Q.png)

### 宁静：

```python
photo of a tranquil river scene surrounded by
a dense forest. Sunlight drifts through the
trees, forming dappled patterns of gold and
emerald on the glassy surface of the water.
The overall mood is soothing and still,
capturing a sense of quiet harmony as light
and shadow dance together. --ar 16:9
--stylize 50 --v 6.1
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*9M_rgyQNyvMGink_0d9urg.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*fK6Poobw21vSupHhVAaayA.png)

宁静：

```python
photo of a serene river scene surrounded by a
dense forest. Sunlight streams softly through
the foliage, casting gentle golden-green
highlights on the mirror-like water. The
overall mood feels deeply peaceful,
emphasizing the pure elegance of nature’s
interplay of light, shadow, and reflection.
--ar 16:9 --stylize 50 --v 6.1
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*B4WzLFXhCbKERIWjBsdw8Q.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*E7pqLlVBUz8af13BLU_avA.png)

## 聚焦的力量

这一偶然的发现揭示了使用 ChatGPT o1 时的一个重要点：少即是多。当要求生成较少的提示时，它会将更多的“注意力”集中在每个提示上，从而生成更高质量的输出，更好地发挥 Midjourney 的功能。

在两种情况下，结构化的输入保持一致：

1. 明确的场景类型/情绪类别
2. 具体的描述元素
3. 光照和氛围条件
4. 专注于自然元素和反射

然而，结果表明，即使在像 ChatGPT o1 这样的高级 AI 中，数量也会影响质量。

## 展望未来

这次经历表明，虽然 ChatGPT o1 确实能够生成高质量的 Midjourney 提示词，但使用方式至关重要。关键不仅在于提供明确的指示，还在于理解生成高质量输出的最佳请求量。

对于 fellow AI 艺术家，我建议从较小的批量请求开始，比如每次 5-6 个提示词。虽然生成大量提示词可能需要更多的迭代，但质量的提升使其值得。有时，退一步，要求更少，实际上会给你带来更多。

请记住，在 AI 艺术创作的世界里，目标不仅是高效生成提示词，还要创建能够真正捕捉你所追求愿景的提示词。有时，这意味着放慢速度，让 AI 集中精力生成更少但更好的输出。

