---
title: "比较为图像添加文本的主要文本到图像生成模型"
meta_title: "比较为图像添加文本的主要文本到图像生成模型"
description: "本文评估了九种领先的文本到图像生成模型在图像中准确渲染文本的能力。测试结果显示，Black Forest Labs的FLUX1.1 [pro]和Stability AI的Stable Image Ultra在再现提示中请求的文本方面表现最佳。文章还探讨了三种替代技术，以提高生成图像中文本的准确性，包括在图像中替换生成的文本、从空白画布开始生成图像以及分别生成图像和文本。"
date: 2024-11-16T11:03:12Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Gvj5CUGClWka1KUsDy5GQw.png"
categories: ["Generative AI", "Natural Language Processing", "Technology/Web"]
author: "Rifx.Online"
tags: ["text", "generation", "models", "accuracy", "techniques"]
draft: False

---

### 九个领先图像生成模型在图像中渲染准确文本（单词和短语）的能力比较

在这篇文章中，我们将评估来自多个提供商的九个最先进的文本到图像生成模型在不同托管平台上的能力。具体来说，我们将根据给定的提示评估它们在图像中生成准确文本（单词和短语）的能力。测试的模型包括以下内容（按字母顺序排列）：

1. Adobe Firefly Image 3（通过 [firefly.adobe.com](http://firefly.adobe.com/)）
2. Amazon Titan Image Generator G1 v2（通过 [Amazon Bedrock](https://aws.amazon.com/bedrock/)）
3. Black Forest Labs FLUX1\.1 \[pro] 和 Ultra Mode（通过 [Replicate](http://replicate.com/)）
4. Google Imagen 3（通过 [ImageFX](https://aitestkitchen.withgoogle.com/tools/image-fx)）
5. KLING AI 由 [Kwai\-Kolors/Kolors](https://huggingface.co/Kwai-Kolors/Kolors) 提供支持（通过 [klingai.com](http://klingai.com/)）
6. Midjourney v6\.1（通过 [midjourney.com](http://midjourney.com/)）
7. OpenAI DALL·E 3（通过 [ChatGPT](https://quip-amazon.com/62AqA7VtF4Xb/chatgpt.com)）
8. Stability AI Stable Diffusion 3\.5 Large（通过 [stability.ai](http://stability.ai/) API）
9. Stability AI Stable Image Ultra 1\.0 v1（通过 [Amazon Bedrock](https://aws.amazon.com/bedrock/)）

此外，我们还将研究三种替代的、更可靠的技术，以确保生成图像中文本的准确性。

## 测试模型

对所有模型进行了几项测试，使用了不同的提示和不同程度的细节。提示示例包括：

1. *一张微笑的科学家手持标语牌的照片，上面写着：“无瑕的 AI 生成文本！”*
2. *一个蔬菜摊位，上面有各种蔬菜，包括西红柿。一个黑色标牌上用白色字体写着：“农场新鲜西红柿 $2.99/磅。”*
3. *一幅幽默插图，描绘了一只友好的南瓜，背景为白色，配有秋季主题的各种南瓜和秋叶。“万圣节快乐”的字样以大深棕色字母居中在南瓜上方。*
4. *一块时尚的广告牌高耸在繁忙的高速公路上，车流在高峰时段快速掠过。在一个动态的抽象背景下，大而粗体的文字“生成性 AI：转变数字广告”，为路过的司机提供了即时的可读性。*

尽管模型之间的整体图像质量和明显偏见程度差异显著，但仅评估了文本生成能力。能够至少 50% 准确再现提示中请求文本的模型获得了及格分数。以下是一些选定测试的结果，展示了模型的能力。结果按字母顺序呈现，而不是按质量排名。每个测试中包含了四张代表性的平均质量图像。



## 模型

### Adobe Firefly Image 3

Adobe于2024年4月发布了其Firefly Image 3基础模型。根据[新闻稿](https://news.adobe.com/news/news-details/2024/adobe-introduces-firefly-image-3-foundation-model-to-take-creative-exploration-and-ideation-to-new-heights)，Adobe Firefly Image 3在照片真实感质量、造型能力、细节、准确性和多样性方面实现了惊人的进步。此外，生成速度的显著提升使得构思和创作过程更加高效和富有生产力。该模型可在Adobe Photoshop（测试版）和[firefly.adobe.com](https://firefly.adobe.com/generate/images)上使用。以下是两个界面。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*gcASwZgRSfPNYJB7n5GrlQ.png)

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*vU3NW6VdkgojkNlHaGWoSg.png)

🚫 在我的测试中，Adobe Firefly无法准确重现提示中请求的文本。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*yWoDLmj5mPKEw8GRg51YXw.jpeg)

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*0iskBrEjrtFk-mXNrBvkag.jpeg)

### Amazon Titan Image Generator G1 v2

Amazon Titan Image Generator G1 v2 模型于 2024 年 8 月发布。它是对上一代 Amazon Titan Image Generator G1 v1 模型的升级，该模型于 2023 年 11 月发布。Amazon Titan Image Generator G1 v2 模型增加了多个功能，包括图像调节、使用调色板的图像引导、背景移除和主题一致性。

Amazon Titan Image Generator G1 v2 模型在 Amazon Bedrock 上进行了测试， 根据 [AWS](https://aws.amazon.com/bedrock/)，它是“*一个完全托管的服务，提供来自领先 AI 公司（如 AI21 Labs、Anthropic、Cohere、Meta、Mistral AI、Stability AI 和 Amazon）的高性能基础模型（FMs）的选择，通过单一 API，以及构建具有安全性、隐私性和负责任 AI 的生成 AI 应用所需的广泛能力。*”

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*TmROyF5c-BXHevqImyflmw.png)

🚫 在我的测试中，Amazon Titan Image Generator G1 v2 无法准确重现提示中请求的文本。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*QLvxsEveORObkPOOB3u1Mg.png)

### 黑森林实验室 FLUX1\.1 \[pro] 和超模式

黑森林实验室于2024年10月发布了FLUX1\.1 \[pro]。根据黑森林实验室的说法，“*FLUX1\.1 \[pro] 的生成速度比其前身FLUX.1 \[pro]快六倍，同时提高了图像质量、提示遵循度和多样性。同时，我们更新了FLUX.1 \[pro]，使其生成与之前相同的输出，但速度提高了两倍.*” 早期的FLUX.1 \[pro]模型于2024年8月发布。

在我准备这篇文章时，黑森林实验室推出了FLUX1\.1 \[pro]的超模式和原始模式。根据新闻稿，“*今天，我们为FLUX1\.1 \[pro]增加了新的高分辨率功能，扩展其功能以支持4倍更高的图像分辨率（最高可达4MP），同时保持每个样本仅需10秒的出色生成时间.*”

黑森林实验室FLUX1\.1 \[pro]和超模式的测试是在[Replicate](https://replicate.com/blog/machine-learning-needs-better-tools)上进行的。他们的网站声明，“*Replicate在云中运行机器学习模型。我们有一个开源模型库，您可以通过几行代码运行。如果您正在构建自己的机器学习模型，Replicate使其易于大规模部署.*”

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*IUbfTFj32FxIta_3J1W0pQ.png)

✅ 在我的测试中，黑森林实验室FLUX1\.1 \[pro]能够在超过50%的时间内准确重现提示中请求的文本。它在所有测试模型中表现最佳。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*RewBBA9MAiNbG93h65WdYg.png)

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ISZfNQZHo3PL_QkYu3jEIw.png)

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*XliNJWJr2TZ5MGwi7RAa-g.png)

### Google Imagen 3

Google Imagen 3 于2024年8月向所有美国用户发布。根据谷歌的说法，“*Imagen 3 是我们最高质量的文本到图像模型，能够生成具有更好细节、更丰富光照和更少干扰性伪影的图像，比我们之前的模型更出色。*” Google Imagen 3 的测试在 [ImageFX](https://aitestkitchen.withgoogle.com/tools/image-fx) 上进行，这是谷歌 AI Test Kitchen 的一部分，“*这是一个人们可以体验并反馈谷歌最新 AI 技术的地方。*”

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*nhto3l0o-XITJzEEQoHSTA.png)

🚫 在我的测试中，Google Imagen 3 无法准确重现提示中请求的文本。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*9aqKPuZlpGF_lE3pA0ZNtw.png)

### KLING AI 由 Kolors 提供支持

Kolors 为 Kling AI 的图像生成能力提供支持。根据 [Hugging Face](https://huggingface.co/Kwai-Kolors/Kolors) 的说法，“*Kolors 是一个基于潜在扩散的大规模文本到图像生成模型，由快手 Kolors 团队开发。经过数十亿对文本-图像的训练，Kolors 在视觉质量、复杂语义准确性以及中文和英文字符的文本渲染方面相较于开源和专有模型具有显著优势。*” 根据 [Kuaishou](https://ir.kuaishou.com/news-releases/news-release-details/kuaishou-launches-full-beta-testing-kling-ai-global-users-0) 的消息，Kling AI 于 2024 年 7 月发布\。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*na56zUz3DLWK7Dqj51vSKw.png)

🚫 在我的测试中，KLING AI 由 Kolors 提供支持无法准确再现提示中请求的文本。结果是所有测试模型中表现最差的。许多响应都是中文，即使明确要求以英文显示。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*xgq4C0m8s3Wfp4p9Va7fSQ.png)

### Midjourney v6\.1

Midjourney v6\.1 于2024年7月发布。根据 [Midjourney](https://updates.midjourney.com/version-6-1/)，最新发布的 v6\.1 包含了几项重要改进，包括更连贯的图像（手臂、腿、手、身体、植物、动物等）、更好的图像质量、更精确、详细和正确的小图像特征，以及改进的文本准确性（在提示中通过“引号”绘制单词时）。根据 [Midjourney](https://docs.midjourney.com/docs/text-generation)，使用 `— — style raw` 标志也有助于在某些测试案例中提高文本准确性。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ETXx5VyY4BgEA8zn4K3M0g.png)

🚫 ✅ 在我的测试中，Midjourney v6\.1 的结果参差不齐。Midjourney 在超过 50% 的时间内无法一致地再现提示中请求的文本。在某些测试案例中，输出是正确的，而在其他案例中则接近提示，但也同样经常重复单词和标点符号。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*yIaVzqP_BwvDGMO5SOo1SA.png)

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*BDCsxYe_cJSb6pfoxKrWGA.jpeg)

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*dqGYigq9T-PMx3GKfqSf2Q.png)

### OpenAI DALL·E 3

OpenAI DALL·E 3 于2023年10月发布，距今已有一年多。根据 [OpenAI](https://openai.com/index/dall-e-3/)，"*DALL·E 3 在生成完全符合您提供的文本的图像能力上迈出了重要一步。DALL·E 3 理解的细微差别和细节远超我们之前的系统 [DALL·E 2]，使您能够轻松将您的想法转化为极其准确的图像。*"

OpenAI Imagen 3 的测试是在 [ChatGPT](https://openai.com/index/chatgpt/) 上进行的。此外，根据 [OpenAI](https://openai.com/index/dall-e-3/)，"*DALL·E 3 原生构建于 ChatGPT 之上，这使您可以将 ChatGPT 作为头脑风暴伙伴和提示的完善者。只需询问 ChatGPT 您希望在从简单句子到详细段落中的任何内容中看到的内容。*"

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*x45i0IJoYNiJT1kOi98k7w.png)

🚫 在我的测试中，OpenAI DALL·E 3 无法准确再现提示中请求的文本。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*NirwqSB-k8dzfGRNAw-pQw.png)

### Stability AI Stable Diffusion 3\.5 Large

根据Stability AI，发布于2024年10月的[Stable Diffusion 3\.5 Large](https://stability.ai/news/introducing-stable-diffusion-3-5)模型“*拥有81亿参数，具有卓越的质量和对提示的遵循能力，这个基础模型是Stable Diffusion家族中最强大的。该模型非常适合1兆像素分辨率的专业用例*。” Stability AI Stable Diffusion 3\.5 Large使用[StabilityAI REST API](https://platform.stability.ai/docs/api-reference#tag/Generate/paths/~1v2beta~1stable-image~1generate~1ultra/post)和在Jupyter Notebook中用Python编写的代码进行了测试。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*56Zp5QWVvTzGYlslcWEGKg.png)

✅ 在我的测试中，Stability AI Stable Diffusion 3\.5 Large能够在超过50%的时间内准确再现提示中请求的文本，偶尔会有轻微的标点错误。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*CQ9I5z7x8ILTdFhu1dCBCQ.jpeg)

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*G2D-L2fEtjKVTTyph3Burg.jpeg)

### Stability AI Stable Image Ultra

根据Stability AI的说法，16 *billion\-parameter [Stable Image Ultra](https://stability.ai/stable-image) 模型于2024年10月发布，“是我们的旗舰模型，结合了SD3 Large的强大功能与先进的工作流程，以提供最高质量的照片级真实图像。该高级模型专为需要无与伦比视觉真实感的行业设计，例如市场营销、广告和建筑。”与Amazon Titan Image Generator一样，Stability AI Stable Image Ultra模型也使用[Amazon Bedrock](https://aws.amazon.com/blogs/aws/stability-ais-best-image-generating-models-now-in-amazon-bedrock/)进行了测试，使用了Image Playground UI。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*GjaPW2FWGGhuJ06trs1Jww.png)

✅ 在我的测试中，Stability AI Stable Image Ultra能够在超过50%的时间内准确再现提示中请求的文本。与Black Forest Labs FLUX1\.1 \[pro]一起，它是测试中表现最佳的模型之一。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*O7JKeKBPgaEOuvdFW-u2Sg.png)

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*jDHNLjOKHuEBQlFvTb7nYQ.png)

## AI生成文本的替代方案

Black Forest Labs的FLUX1.1 \[pro]和Stability AI的Stable Image Ultra模型比其他模型更频繁地准确再现提示中的请求短语。然而，用户仍然无法控制图像的许多方面，包括文本的确切位置、大小、字距、颜色和字体样式。存在几种替代且更可靠的技术，以确保生成图像中文本的准确性。

### 替换生成的文本

一种替代方法是生成带有所需文本的图像，而不考虑拼写错误。随后，可以在 Adobe Photoshop 中删除文本，并用正确的文本替换，确保位置、大小、颜色和样式完全一致。然而，如果前景主体或阴影部分遮挡文本，或者文本出现在不规则的表面上，删除和重建文本可能会很具挑战性。为了增强新文本的真实感，可以将矢量文本栅格化，然后添加噪声、模糊、扭曲、光照、纹理和图层混合效果。

以下是使用 Black Forest Labs FLUX1\.1 \[pro] Ultra 生成的两幅图像示例（第一幅图像）。文本已在 Adobe Photoshop 中删除（第二幅图像），添加了新的基于矢量的文本（第三幅图像），最后，文本已被栅格化并扭曲，以显得更真实（第四幅图像）。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*B0_3d8oImDlrRb6mjpekrw.png)

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*fmrW46OsZe6Zsc0eshPyYw.png)

### 从空白画布开始

第二种选择是生成没有文本的图像，然后使用 Adobe Photoshop 添加您所需颜色、大小和字体样式的文本。这种技术比对生成的图像进行修饰以去除现有文本要简单得多。示例是使用 [Replicate](https://replicate.com/docs/get-started/python) API，通过 Jupyter Notebook 调用 Black Forest Labs 的 FLUX1\.1 \[pro] 和 Ultra 创建的。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*iFpqy4fEUJOXaJMzhsgbDA.png)

下面是使用 Black Forest Labs FLUX1\.1 \[pro] Ultra 生成的图像，提示为：“*一位微笑的女性科学家穿着实验室外套，站在实验室里，手持一块没有文字或其他元素的白色矩形标牌。*”生成的图像（第一张图）添加了新文本（第二张图），最后，文本被扭曲以显得更真实（第三张图）。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*c1rgPArHDrUQ2cePV9DUCA.png)

下面是另一个例子，开始时生成的图像没有文本，后来添加了文本。最初的图像是使用 Black Forest Labs FLUX1\.1 \[pro] Ultra 生成的，提示为：“*各种蔬菜的蔬菜摊，包括西红柿。一个小的、矩形的、空白的黑色标牌，旁边没有文字或其他元素，放在西红柿旁边。*”

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*t_6oM1aItMGQfBUPjH83lA.png)

最后一个例子使用提示：“*一个光滑的广告牌高高耸立在繁忙的高速公路上，车辆飞驰而过。广告牌的背景是色彩丰富、动态的抽象图案。*”来生成原始图像。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*KyGveUehRxuFTK-DmWnCaw.jpeg)

## 分别生成图像和文本

第三种也是最后一种技术是使用您选择的模型分别生成图像和文本，然后在后期制作中使用 Adobe Photoshop 将这两个元素结合起来。下面是左侧没有文本的 Midjourney 原始图像，使用的提示是：“*各种蔬菜的蔬菜摊，包括西红柿。一个空白的黑板样式标志。— ar 1:1*”

中间黑色背景上的白色文字也是在 Midjourney 中生成的，使用的提示是：“*短语“农场新鲜西红柿 $2.99/磅。”用白色粉笔字写在纯黑色背景上。— 没有西红柿或其他物体 — ar 3:2 — 风格原始 — 风格化 0*”

文本图像可以很容易地叠加在第一个图像上，使用文本图层的“变亮”混合模式。可以应用额外的扭曲效果，使文本在最终图像中看起来更加自然。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ZP-pqTQVN8Xy_Vhjm8D0gg.png)

## 结论

在这篇文章中，我们探讨了来自不同提供商的九种最先进的文本到图像生成模型的能力，以根据提示生成图像中的准确文本。我们发现，Black Forest Labs 的 FLUX1.1 [pro] 和 Stability AI 的 Stable Image Ultra 在准确再现图像中请求的文本方面，比其他模型更成功。最后，我们检查了三种替代的、更可靠的技术，以确保生成图像中文本的准确性。


