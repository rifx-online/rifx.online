---
title: "通过多模态 LLM 模型进行图像推理"
meta_title: "通过多模态 LLM 模型进行图像推理"
description: "本文探讨了多模态人工智能在图像推理中的应用，强调其将视觉和文本信息整合以提升数据分析能力的优势。多模态模型如OpenAI和Gemini，通过处理多种数据类型（如图像和文本），为各行业提供更准确的人工智能解决方案。文章还提供了如何向大型语言模型（LLMs）发送图像请求的技术细节，并展示了这些模型在自动化任务和提升无障碍性方面的潜力。"
date: 2024-12-27T12:59:06Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Hws72hKiwND8Qphp6OYGJQ.png"
categories: ["Natural Language Processing", "Computer Vision", "Generative AI"]
author: "Rifx.Online"
tags: ["multimodal", "image", "LLMs", "Gemini", "OpenAI"]
draft: False

---

### 多模态人工智能 \| LLM \| OPENAI \| GEMINI \| 视觉



### 本博客探讨了多模态模型在图像推断中的能力，强调它们整合视觉和文本信息以改善分析的能力



多模态人工智能的出现显著改变了数据处理的格局。在过去，我们在光学字符识别（OCR）等任务中严重依赖文本提取库，如 PyTesseract。然而，视觉变换器和其他多模态模型的进步彻底改变了我们处理和解释数据的方式。这些先进的模型能够无缝集成来自多种模态的信息，如图像和文本，为数据提取和解释提供了更全面和高效的方法。这一转变为各个行业提供了更准确和复杂的人工智能驱动解决方案铺平了道路。

我们将从一个实际且重要的问题开始。

> *“多模态”是什么意思？*

为了帮助您理解这一点，我将给您一段来自维基百科的摘录。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*6VrSLvW3hQP-Rv-L_y-H0A.png)

简单来说，当有不止一种交流方式时，就称其为多模态。为了理解这一点，让我们以多模态交流为例。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*NSrE0gTBIoMdVJLgmR7jBA.png)

**多模态教学法**是一种实施不同交流方式的写作教学方法。[多模态性](https://en.wikipedia.org/wiki/Multimodality)指的是在不同媒体中使用视觉、听觉、语言、空间和手势等多种方式，每种方式对于正确传达所呈现的信息都是必要的。

> ***什么是多模态人工智能？***

让我们从[IBM博客](https://www.ibm.com/think/topics/multimodal-ai)中获取这个定义。

多模态人工智能是指能够处理和整合来自多种模态或数据类型信息的机器学习模型。这些模态可以包括文本、图像、音频、视频以及其他形式的感官输入。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*05fvs3jxAxSdMKXv)

**调用大型语言模型（LLMs）处理基于文本的数据现在变得相当简单。** 然而，随着多模态人工智能的出现——它整合了文本、图像和其他数据形式——关于如何向 LLMs 发送请求以基于图像获得输出的困惑也随之增加。关于这个主题的信息散布在不同的来源中，使得找到清晰和全面的理解变得困难。

为了解决这个问题，我尝试收集和整理关于如何向 LLMs 发送基于图像请求的可用数据。基于文本和基于图像请求之间的一个主要区别在于请求的构建方式。

在构建请求时，请检查以下问题，以便根据您的情况采取正确的方法。

> **您的图像是托管在 URL 上还是本地？**

> 澄清您正在处理的图像是存储在网络服务器上（可以通过 URL 访问）还是在您的本地计算机上。

> **您想使用哪个模型？**

> 定义您正在用于此任务的人工智能模型，无论是文本到图像模型、多模态模型，还是任何其他专业的人工智能模型。

> **您如何决定请求的结构以容纳多个图像？**

> 考虑如何格式化您的请求，以便它可以处理各种输入。考虑创建一个灵活的结构，可以接受多个图像，具体取决于用例和模型的能力，可以作为单个输入或批量输入。

> **您如何决定令牌大小？**

> 在使用大型模型时，确保选择适合模型限制的令牌大小。令牌大小应允许输入在不超过限制的情况下进行处理，平衡细节和效率。

在进行向大型语言模型（LLMs）发送基于图像请求的技术细节之前，确定您要使用哪个模型至关重要。虽然今天存在许多多模态人工智能模型，但为了简化和清晰起见，让我们专注于两个最知名的模型：**OpenAI** 和 **Gemini**。

对于 OpenAI，我们有像 GPT 4o 和 GPT 4o-mini 这样的模型。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*BqyMFVwL6rGHfqk46a0ahQ.png)

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Z1lO386JaCosePZYHNJ1pQ.png)

让我们从 Gemini 开始！

> ***为什么从 Gemini 开始？***

出于几个实际原因，从 **Gemini** 开始在实验多模态模型时是一种更有利的方式：

1. **免费访问**：Gemini 提供 **免费访问**，使其在实验和早期开发中具有成本效益。在测试和探索阶段，您无需担心费用。
2. **更大的上下文窗口**：Gemini 提供 **更大的上下文窗口**，这使得更好地理解和与文本和图像数据进行更详细的交互成为可能。这在处理需要更长信息序列或更详细图像分析的复杂任务时尤其有用。
3. **实验的最低费用**：当费用确实需要考虑时，Gemini 旨在保持 **费用尽可能低**，使其在没有显著预算限制的情况下适合长期使用。

### Gemini的上下文窗口

Gemini的上下文窗口是一个重要特征，使其能够同时处理大量文本和视觉数据。[*Gemini 1.5 Flash标准配备1百万个标记的上下文窗口，而Gemini 1.5 Pro则配备2百万个标记的上下文窗口。历史上，大型语言模型（LLMs）在一次性传递给模型的文本（或标记）数量上受到显著限制。Gemini 1.5的长上下文窗口，几乎完美的检索（>99%），解锁了许多新的用例和开发者范式。*](https://ai.google.dev/gemini-api/docs/long-context)

让我们使用下面的图像进行图像提取。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*dkqmNzW8KN166FfxmR3UDQ.png)


> ***让我们安装库***


```python
import base64, httpx
from base64 import b64encode
from langchain_core.messages import HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI
import google.generativeai as genai
API_KEY = "Your API KEY"
```

> ***现在让我们编写一个简单的代码，将简单图像发送到Flash模型***


```python
from PIL import Image

genai.configure(api_key=API_KEY)

## 初始化模型
model = genai.GenerativeModel('gemini-1.5-flash-001')
## 将图像文件编码为base64字符串的函数
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return b64encode(image_file.read()).decode("utf-8")

## 编码图像
image_path = "Image path"
encoded_image = encode_image(image_path)

## 准备内容
contents = [
    {
        "parts": [
            {"text": "简要解释图像中的内容，逐步解释一切。"},
            {
                "inline_data": {
                    "mime_type": "image/png",
                    "data": encoded_image,
                }
            },
        ]
    }
]

## 生成内容
response = model.generate_content(contents=contents)

## 打印响应
print(response.text)
```

> ***输出***

该图像显示了一个路标，上面有警告，下面有指示。警告标志是一个红色三角形，里面有一个建筑物的黑色剪影，暗示前方可能有路面下沉。指示标志是绿色的，包含以下文本：\- "慢行" \- 指示驾驶员应减速。\- "前方收费站" \- 通知驾驶员前方有收费站。\- "200米" \- 表示到收费站的距离。图像中还显示了一辆卡车和一些背景树木。这似乎是一个高速公路或收费站附近的场景。

看到谷歌的模型如何有效提取和处理数据真是令人着迷。这些模型高效分析大量信息并得出有意义的见解，展示了人工智能的令人印象深刻的能力。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*dkqmNzW8KN166FfxmR3UDQ.png)

太棒了！我们可以看到Gemini为图像提供了很好的输出，并进行了很好的分析。这是将任何图像发送到LLM的最简单方法。您可以根据需要调整任何提示。

> ***让我们尝试使用相同的图像进行OpenAI模型***


```python
import base64, httpx
from base64 import b64encode
from openai import OpenAI
import os

client = OpenAI(
    api_key=os.environ.get("Your openAI key")
## 将图像文件编码为base64字符串的函数
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return b64encode(image_file.read()).decode('utf-8')
```

> ***现在让我们编写一个简单的代码，将简单图像发送到OpenAI模型***


```python
response = client.chat.completions.create(
  model="gpt-4o-mini",
  messages=[
    {
      "role": "user",
      "content": [
        {"type": "text", "text": "简要解释图像中的内容，逐步解释一切。"},
        {
          "type": "image_url",
          "image_url": {"url": f'data:image/jpeg;base64,{encode_image("test_image.PNG")}'}, 
        },
      ],
    }
  ],
)

print(response.choices[0].message.content)
```

> ***输出***

该图像展示了一个路标，为驾驶员提供重要信息。以下是其组成部分的逐步解释：

1\. **形状和颜色**： — 该标志由三角形和矩形形状组合而成。 — 顶部的三角形通常用于警告标志，表示需要小心。

2\. **顶部部分**（三角形标志）： — 三角形部分包含一个收费站的黑色剪影，提醒驾驶员注意即将到来的收费区域。

3\. **中间部分**（主要指示）： — 矩形绿色标志下方给出指令：“慢行”。这指示驾驶员在接近收费站时应减速。

4\. **底部部分**： — 下一行写着“前方收费站”，清楚地提供了即将发生的事情的信息。 — 最后一行写着“200米”，表示收费站距离200米，给驾驶员提供了准备收费的距离参考。

5\. **周边环境**： — 背景显示了一条道路，周围有一些绿色植物和几辆车辆，突显出该标志所处的现实环境。

总体而言，该标志有效地向驾驶员传达了由于即将到来的收费站需要减速的信息，确保安全并遵守道路法规。

这就是您如何将图像发送到多模态LLM模型。使用LLM处理图像通过将其文本处理能力与理解和生成视觉内容的能力相结合，提供了许多优势。这种整合使得对文本和视觉内容的统一理解成为可能，从而进行上下文分析，增强各个领域的决策能力。例如，在医疗保健领域，这些模型可以分析X光片或MRI与患者记录一起提供更好的诊断见解。它们还通过以自然语言描述视觉信息，提高无障碍性，使视觉障碍人士能够使用。

此外，具有图像处理能力的LLM推动了搜索和检索系统的进步，使得多模态搜索引擎成为可能，用户可以使用文本搜索并获得视觉结果，反之亦然。在创意领域，它们允许文本与图像的交互，用户可以根据文本提示修改或生成图像。此外，这些模型通过解释图像和提取结构化信息来自动化重复任务，例如数据标注和文档数字化。

## 如果你觉得这篇文章有启发

“**慷慨使你成为一个更快乐的人**”是一个经过验证的事实；因此，如果你喜欢这篇文章，请给它点赞。如果你觉得这篇文章有启发，请在 [**Linkedin**](https://www.linkedin.com/in/chinmay-bhalerao-6b5284137/) 和 [**Medium**](https://medium.com/@BH_Chinmay) 上关注我。你还可以 [**订阅**](https://medium.com/@BH_Chinmay) 以便在我发布文章时收到通知。让我们创建一个社区！感谢你的支持！

## 你可以阅读我其他相关的博客：

### 签字，

### Chinmay

