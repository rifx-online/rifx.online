---
title: "Qwen2-VL：本地运行的视觉语言模型"
meta_title: "Qwen2-VL：本地运行的视觉语言模型"
description: "*Qwen2-VL* 是阿里巴巴于2024年发布的视觉语言模型，支持多种应用如图像理解和视频分析。该模型提供三种大小（2B、7B、72B），并解决了现有模型的局限性，如对日语的支持和较小的模型尺寸。其架构结合视觉编码器和文本解码器，经过多阶段训练，使用了1.4万亿个标记，性能超过GPT-4o。该模型适用于多种场景，并通过特定提示模板与视觉输入交互。使用*ailia SDK*可实现快速推理。"
date: 2024-12-15T01:42:35Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Uey7hGE5TZhqmLh6uKQ6TQ.png"
categories: ["Natural Language Processing", "Computer Vision", "Technology/Web"]
author: "Rifx.Online"
tags: ["Qwen2-VL", "vision", "language", "multilingual", "video"]
draft: False

---



这是对「Qwen2\-VL」的介绍，这是一种可以与 [ailia SDK](https://ailia.jp/en/) 一起使用的机器学习模型。您可以轻松使用此模型创建 AI 应用程序，利用 [ailia SDK](https://ailia.jp/en/) 以及许多其他现成的 [ailia MODELS](https://github.com/axinc-ai/ailia-models).

## 概述

*Qwen2\-VL* 是 *Alibaba* 于 2024 年 10 月发布的 [视觉语言模型](http://Vision Language Models)。它提供三种模型大小：2B、7B 和 72B，允许用户通过文本对图像提问，类似于 GPT\-4 视觉 API。

应用包括多语言图像文本理解、代码/数学推理、视频分析、实时聊天和代理。

之前，[*LLAVA*](https://readmedium.com/llava-large-language-model-that-understands-images-57d68c321254) 通常被用作此类任务的开源解决方案。然而，它存在一些局限性，例如其最小模型相对较大，达到 7B，并且不支持某些语言，如日语。*Qwen2\-VL* 通过提供 2B 模型大小和对日语的支持来解决这些问题。



## 架构

在 *Qwen2\-VL* 中，输入图像被标记化并与提示文本结合，然后通过视觉编码器转换为潜在表示，最后输入到 *QwenLM* 解码器中。它还支持视频，可以将多达 30 帧一起标记化。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*am2Nn19Y0AfXPmuNr6UqKA.jpeg)

视觉语言模型（VLMs）通常面临以下挑战：

* 以固定分辨率编码输入图像
* 使用 [CLIP](https://readmedium.com/clip-learning-transferable-visual-models-from-natural-language-supervision-4508b3f0ea46) 作为视觉编码器

*Qwen2\-VL* 通过以下方式解决这些问题：

* 处理输入分辨率，嵌入位置信息与 RoPE
* 使用 [视觉变换器](https://readmedium.com/vision-transformer-state-of-the-art-image-identification-technology-without-convolutional-fd10097ae9c2)（ViT）作为视觉编码器，并使其可训练

这些改进提高了模型的准确性。

*Qwen2\-VL* 的训练过程如下：

1. 第一阶段涉及训练 ViT
2. 第二阶段训练所有参数，包括 LLM 的参数
3. 在最后阶段，ViT 参数被冻结，并使用指令数据集进行指令调优

在预训练期间，使用了 6000 亿个标记。LLM 以 Qwen2 参数初始化。在第二阶段，处理了额外的 8000 亿个与图像相关的标记，使总数达到 1.4 万亿个标记。

## 性能

*Qwen2\-VL\-72B* 在性能方面优于 *GPT\-4o*。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*fjhilY_DeBK9CQQuC-Hzfw.png)

下图是2B、7B和72B模型的性能比较。虽然72B模型提供了最高的准确率，但2B模型也展现了稳健的性能。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*6X8j2db55sXU09_-dD94dQ.png)

*Qwen2\-VL\-2B* 是最有效的模型，为大多数场景提供了足够的性能。7B模型显著增强了文本识别和视频理解能力。72B模型进一步提升了指令遵循、决策和代理相关能力。

视觉编码器的参数数量固定为675M，确保无论模型大小如何，图像识别性能都很高。因此，即使是2B模型，OCR等任务也能达到高性能。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Fei0Z5OiV3ev6enTa9JU0g.png)

## 提示模板

Qwen2\-VL 利用特殊标记，如 `<|vision_start|>` 和 `<|vision_end|>`，用于与视觉相关的输入。在对话中，使用 `<!im_start|>`。对于编码边界框，使用 `<|box_start|>` 和 `<|box_end|>`。为了将边界框与说明文字链接，使用 `<|object_ref_start|>` 和 `<|object_ref_end|>`。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*wm7ejZ-sowoKm_2h00V0pg.png)

这是运行示例时使用的提示。`<|image_pad|>` 被图像的标记值替换，并提供给视觉编码器。

```python
<!im_start|>system
You are a helpful assistant.<!im_end|>
<!im_start|>user
<|vision_start|><|image_pad|><|vision_end|>Describe this image.<!im_end|>
<!im_start|>assistant
```
当输入标记的大小为 (1, 913\) 时，视觉编码器的输出将为 (1, 913, 1536\)。该输出随后被输入到 QwenLM 解码器中以生成文本。

## Tokenizer

*Qwen2\-VL* 使用 *Qwen2Tokenizer* 作为其分词器。*Qwen2Tokenizer* 兼容并采用与 *GPT2Tokenizer* 相同的基于 BPE 的方法。

## 使用方法

要使用 ailia SDK 运行 Qwen2-VL（[版本 1.5 或更高](https://readmedium.com/released-ailia-sdk-1-5-0-723bbcae0068)），请使用以下命令。2B 模型的大小为 10GB (FP32)，并且可以在提示中使用日语。

```python
$ python3 qwen2_vl.py --input demo.jpeg --prompt "Describe this image."
```
在 M2 Mac CPU 上运行推理时，图像嵌入（1024x683 分辨率）大约需要 23 秒，文本生成大约需要 42 秒。图像嵌入的处理时间取决于图像分辨率，而文本生成时间受分辨率的影响较小。

还提供了 ONNX 模型的减少版 FP16。要使用 FP16 版本，请包含 `-fp16` 选项。

```python
$ python3 qwen2_vl.py --input demo.jpeg --prompt "Describe this image." --fp16
```
*Qwen2-VL* 目前不支持 *llama.cpp*，但支持问题正在处理 [Issue \#9426](https://github.com/ggerganov/llama.cpp/issues/9246)。

## 输出示例

这是使用 Qwen2-VL 查询图像的示例。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*jRKMxDJ2uIy-JJ2QJsr2QQ.jpeg)


> **描述这张图片。**


> 这张图片描绘了一个宁静的海滩场景，画面中有一位女性和一只狗。女性坐在沙滩上，穿着格子衬衫和黑色裤子，似乎在微笑。她正与坐在她旁边的狗击掌。狗穿着一个五彩斑斓的背带，似乎在摇尾巴。背景显示出海洋，波浪轻柔，天空清澈，散发着柔和的光芒，暗示着日出或日落。整体氛围宁静而愉悦。

查询可以用日语进行，并且支持日语 OCR。

## 应用

一个名为 [*ColQwen2*](https://huggingface.co/vidore/colqwen2-v0.1) 的应用被提议，它利用 *Qwen2\-VL* 视觉编码器输出的投影特征来执行基于 PDF 的检索增强生成 (RAG)。用户可以使用 *Qwen2\-VL* 提示询问相关页面上的图像问题以获取答案。

传统的 RAG 处理一切都是基于文本的，这使得处理图表和图形变得困难。然而，通过使用 *ColPali*，它利用 *Qwen2\-VL* 处理一切图像，这个问题可以有效解决。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*HxxJt520iUesujVm1c8wEg.jpeg)

[ax Inc.](https://axinc.jp/en/) 开发了 [ailia SDK](https://ailia.jp/en/)，它支持跨平台、基于 GPU 的快速推理。

ax Inc. 提供从咨询和模型创建到基于 AI 的应用程序和 SDK 开发的广泛服务。如有任何咨询，请随时 [联系我们](https://axinc.jp/en/)。

