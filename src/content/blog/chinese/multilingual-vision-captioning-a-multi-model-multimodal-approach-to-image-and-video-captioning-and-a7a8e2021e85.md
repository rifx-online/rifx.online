---
title: "多语言视觉字幕：图像和视频字幕的多模型、多模态方法和多语言视觉字幕：..."
meta_title: "多语言视觉字幕：图像和视频字幕的多模型、多模态方法和多语言视觉字幕：..."
description: "本文介绍了一种多模型多模态的图像和视频字幕与翻译方法，利用Meta的Llama 3.2、Facebook的NLLB-200和LLaVA-Next-Video模型生成多语言描述、标签和情感分析。文章详细阐述了如何使用先进的机器学习模型批量处理视觉内容，并生成自然语言描述、情感分析和多语言翻译。通过具体示例，展示了如何分析广告和创意内容，强调了AI在视觉内容分析中的应用潜力。"
date: 2024-12-26T02:20:46Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*I1PvP9vmfC9oXJESlkt8dw.png"
categories: ["Natural Language Processing", "Computer Vision", "Generative AI"]
author: "Rifx.Online"
tags: ["multimodal", "vision", "captioning", "translation", "quantization"]
draft: False

---



### 使用Meta的Llama 3.2 11B Vision Instruct、Facebook的600M NLLB-200和LLaVA-Next-Video 7B模型生成多语言图像和视频标题、描述标签以及情感分析。

**视频：** 可口可乐公司，1971年，[“Hilltop”广告](https://www.youtube.com/watch?v=C2406n8_rUw)， featuring the famous “*I’d Like to Buy the World a Coke*” song.

**描述标签：** 音乐，唱歌，团体，和声，快乐，幸福，庆祝，青春，爱，友谊，团结，自然，户外，阳光，复古，1960年代，时尚，汽水，可口可乐

**自然语言描述：** “*视频展示了一群年轻人站在一起，唱歌并对着镜头微笑。场景设定在一个光线明亮的户外区域，背景是清澈的蓝天和树木。这个团体由男男女女组成，穿着色彩鲜艳的休闲服装。摄像机角度稍微抬高，从胸部以上捕捉到这个团体。音频清晰，歌手的声音清晰可闻，背景噪音很少。团体充满快乐和活力的表情，露出宽大的笑容和张开的嘴，暗示着一种生动和愉快的气氛。摄像机捕捉到团体在唱歌时的动作，有些人向旁边看，有些人则直接看着镜头。整体视频的氛围是欢快和团结的，团体的活力和明亮的环境共同营造出一种团结和共享乐趣的感觉。*”

**情感分析：** “*视频展示了一群人，主要是年轻成年人，站在一个田野里，背景是清澈的蓝天。整体情感基调是积极和快乐的，充满团结和友谊的感觉。温暖的色调和明亮的灯光增强了欢快的氛围，而开放的田野和清澈的天空的视觉象征则暗示着自由和开放。叙述围绕着共同的经历展开，个体们聚在一起，享受彼此的陪伴。音频中伴随着活泼和欢快的背景音乐，增强了整体的积极情绪。节奏稳定而不急促，使观看体验轻松愉快。*”

## 介绍

在使用人工智能，尤其是生成式人工智能来辅助视觉内容分析——图像、视频、广告和创意内容方面，存在着显著的兴趣。人工智能通常用于分析视觉内容，原因有以下几点：

* 处理和分类大量视觉内容，为搜索应用提取元数据，节省时间和人力资源；
* 检测和识别物体、面孔、产品、品牌、标志、文本和模式，实现自动标记和组织；
* 评估图像和视频质量，识别模糊或光线不足等问题；
* 内容审核，标记视觉内容中不当、敏感或商标材料；
* 分析广告效果，测量品牌曝光率和评估观众参与度；
* 实现视觉搜索功能，允许用户找到相似的图像或产品；
* 从视觉数据中提取有价值的见解，例如零售环境中的客户情感和行为；

在接下来的帖子中，我们将学习如何利用最先进的（SoTA）机器学习模型批量处理图像和视频集合，并生成不同类型的输出：

* **描述性标签**：描述视觉资产的独特词汇和短语列表；
* **标题**：视觉资产的多语言自然语言描述；
* **情感分析**：对视觉资产整体情感基调、情绪和潜在情感的解读；

对于这项任务，我们将利用开放权重模型，所有模型均可在 [Hugging Face](https://huggingface.co/) 上获取，包括：

* **图像标题生成**：Meta 最新的 [Llama 3.2 11B Vision Instruct](https://huggingface.co/meta-llama/Llama-3.2-11B-Vision-Instruct) LLM 的 4 位和 8 位量化版本；
* **视频标题生成**：[LLaVA-Next-Video 7B](https://huggingface.co/llava-hf/LLaVA-NeXT-Video-7B-hf) SoTA 微调 LLM，具备图像和视频理解能力；
* **机器翻译**：Facebook 的 [distilled 600M parameter variant of the NLLB-200](https://huggingface.co/facebook/nllb-200-distilled-600M) 混合专家（MoE）机器翻译模型；

尽管我们可以使用 Llama-3.2–11B-Vision-Instruct 模型的不同变体生成多语言的图像描述，但我们最终会得到不同语言的不同描述，而不是单一描述翻译成多种语言。

## 模型托管

有许多选项可用于托管这些开放权重模型以进行推理，无论是本地还是在云端。对于这篇文章，我将在本地工作，将模型托管在一台基于NVIDIA GPU的Intel Core i9 Windows 11工作站上，该工作站配备16 GB的GDDR6X内存（VRAM）。已安装并配置了[PyTorch](https://pytorch.org/) (2\.4\.1\+cu124\)、[CUDA](https://docs.nvidia.com/cuda/cuda-installation-guide-microsoft-windows/index.html) (12\.4\)和[Flash Attention 2](https://arxiv.org/abs/2307.08691)。根据[NVIDIA](https://docs.nvidia.com/cuda/cuda-installation-guide-microsoft-windows/index.html)，CUDA（计算统一设备架构）是NVIDIA发明的一个并行计算平台和编程模型。它通过利用图形处理单元（GPU）的强大性能，实现了计算性能的显著提升。[FlashAttention](https://arxiv.org/abs/2205.14135)是一种加速注意力机制并减少其内存占用的算法，且不进行近似。[FlashAttention\-2](https://arxiv.org/abs/2307.08691)旨在实现更快的注意力机制，具有更好的并行性和工作分配；这将用于加速视频字幕生成。



### 模型量化

根据来源，完整版精度的 Llama 3.2 11B Vision Instruct LLM 需要高端 GPU，至少 22 GB VRAM，以实现高效推理。在本地，这至少需要一款顶级的 [NVIDIA RTX 4090](https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4090/) 显卡，配备 24 GB VRAM。我们还可以在多个云服务提供商的平台上访问此模型，包括 [Amazon Bedrock](https://aws.amazon.com/bedrock/llama/)（如下所示），或托管在 [Amazon SageMaker](https://aws.amazon.com/sagemaker/) 上，使用 [Amazon EC2 G5 实例](https://aws.amazon.com/ec2/instance-types/g5/) 或等效实例，亦配备 24 GB VRAM。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*MVkT5w0NNtwJ_34yiqlZfA.png)

为了减少本帖的计算需求，我们将使用两个不同的 [量化版本](https://pytorch.org/docs/stable/quantization.html) 的 Llama 3.2 11B Vision 模型，均可在 Hugging Face 上获取：

* [**SeanScripts/Llama-3.2–11B-Vision-Instruct-nf4**](https://huggingface.co/SeanScripts/Llama-3.2-11B-Vision-Instruct-nf4)：根据模型卡，此模型是通过 Hugging Face 的 [bitsandbytes](https://huggingface.co/docs/bitsandbytes/main/en/index) 使用 NF4（4 位）量化从 [meta-llama/Llama-3.2–11B-Vision-Instruct](https://huggingface.co/meta-llama/Llama-3.2-11B-Vision-Instruct) 转换而来的，并需要 `bitsandbytes` 来加载。Hugging Face 的 bitsandbytes 通过 k 位量化使大型语言模型可访问，适用于 PyTorch。该模型不使用双重量化。
* [**neuralmagic/Llama-3.2–11B-Vision-Instruct-FP8-dynamic**](https://huggingface.co/neuralmagic/Llama-3.2-11B-Vision-Instruct-FP8-dynamic)**:** 根据模型卡，此模型是通过将 [Llama-3.2–11B-Vision-Instruct](https://huggingface.co/meta-llama/Llama-3.2-11B-Vision-Instruct) 的权重和激活量化为 FP8 数据类型获得的，已准备好与从源代码构建的 [vLLM](https://github.com/vllm-project/vllm) 进行推理。此优化将每个参数的位数从 16 降低到 8，约减少 50% 的磁盘大小和 GPU 内存需求。[LLM Compressor](https://github.com/vllm-project/llm-compressor) 用于量化。

在我的工作站上，4 位的 `SeanScripts/Llama-3.2–11B-Vision-Instruct-nf4` 模型大小为 7.6 GB，并消耗大约 11.5 GB 的可用专用 16 GB VRAM。较大的 8 位 `neuralmagic/Llama-3.2–11B-Vision-Instruct-FP8-dynamic` 模型为 15.6 GB，并在与 `facebook/nllb-200-distilled-600M` 模型同时运行时消耗大约 14.8 GB 的 VRAM（见下文）。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*_zoXWK1ggaqQ_STk_f6CTw.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*AIWZqxrpN7avU8JTkER0MQ.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*QjQwMkybRz3NSjniBb3VkA.png)

## 机器翻译

使用上述两种量化模型中的任意一种，我们将生成每个图像或视频的自然语言描述，语言为英语。一旦我们获得了英语描述，我们将使用 Facebook（现为 Meta）的 [NLLB\-200 的蒸馏 600M 参数变体](https://huggingface.co/facebook/nllb-200-distilled-600M) 混合专家（MoE）机器翻译模型。根据 Hugging Face 的说法，NLLB\-200 允许在 200 种语言之间进行单句翻译。在我的工作站上，`facebook/nllb-200-distilled-600M` 模型大小为 2\.5 GB，约消耗 2\.8 GB 的可用专用 16 GB VRAM。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*_RtWMfyyuo_QmVqa7CBMPg.png)

他们还指出，`facebook/nllb-200-distilled-600M` 是一个研究模型，不适合生产部署。NLLB\-200 是在通用领域文本数据上训练的，不打算用于特定领域文本，例如医疗或法律领域。该模型不适用于文档翻译。该模型的训练输入长度不超过 512 个标记（我们将源英语描述限制为最多 300 个标记）；因此，翻译较长的序列可能导致质量下降。NLLB\-200 的翻译不能作为认证翻译使用。

推荐使用 Flores\-200 数据集来评估 NLLB\-200。方便的是，FLORES\+ 多语言机器翻译评估基准库在 [GitHub](https://github.com/openlanguagedata/flores) 上包含所有 200 种 [语言代码](https://github.com/openlanguagedata/flores) 的列表，我们将使用这些代码来指示我们希望将英语描述翻译成的语言，例如法语（`fra_Latn`）、西班牙语（`spa_Latn`）或印地语（`hin_Deva`）。

## 前提条件

首先，确保您已安装与 C\+\+ 相关的免费 [Visual Studio Build Tools](https://visualstudio.microsoft.com/vs/community/)。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*HTampjzvPxls5VuVjn-tWw.png)

### 模型

可选地，我选择在本地预缓存本文中的模型，使用 [huggingface-cli](https://huggingface.co/docs/huggingface_hub/en/guides/cli)。huggingface_hub 库允许您与 [Hugging Face Hub](https://hf.co/) 进行交互。huggingface_hub Python 包带有一个名为 huggingface-cli 的内置 CLI 工具。此工具使您能够直接从终端与 Hugging Face Hub 进行交互。如果您未提前缓存模型，它们将在应用程序首次加载时下载到本地缓存中。

```python
python -m pip install "huggingface_hub[cli]" --upgrade

huggingface-cli login --token %HUGGINGFACE_TOKEN% --add-to-git-credential

huggingface-cli download SeanScripts/Llama-3.2-11B-Vision-Instruct-nf4
```

### 使用 pip 的 Python 3 虚拟环境

包含所有依赖项的 `requirements.txt` 文件：


```python
accelerate
av
bitsandbytes
compressed-tensors
numpy
pillow
protobuf
requests
transformers
transformers[sentencepiece]
```
用于创建虚拟环境并安装本帖所需包的 Python 3 和 `pip` 命令：


```python
python -m venv .venv
.venv\Scripts\activate

set USE_FLASH_ATTENTION=1
pip install pip --upgrade
pip uninstall torch torchvision torchaudio -y
pip install -r requirements.txt --upgrade
pip install torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cu124
pip install build cmake ninja wheel --upgrade
pip install flash-attn --no-build-isolation
```

### Anaconda虚拟环境与pip

使用[Anaconda](https://www.anaconda.com/)和`pip`创建虚拟环境并安装本帖所需包的命令：


```python
python --version
conda create --name .conda_env python=3.12.4 --yes
conda activate .conda_env

python --version
conda create --name .conda_env python=3.12.4 --yes
conda activate .conda_env

set USE_FLASH_ATTENTION=1
pip install pip --upgrade
pip uninstall torch torchvision torchaudio -y
pip install -r requirements.txt --upgrade
pip install torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cu124
pip install build cmake ninja wheel --upgrade
pip install flash-attn --no-build-isolation
```

## 图像标注

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*nzLR4Vlf_vdjKpqAnyCTkg.png)

我们将从图像标注开始，然后进行视频标注。我编写了一个用于批量图像标注和机器翻译的 Python 3 脚本 `image_batch_translate.py`。该脚本允许您选择 8 位的 `neuralmagic/Llama-3.2–11B-Vision-Instruct-FP8-dynamic` 或 4 位的 `SeanScripts/Llama-3.2–11B-Vision-Instruct-nf4` 模型。由于相同的翻译功能也将用于视频的标注，我将翻译功能分离到一个独立的 `Translator` 类 `translator.py` 中，并在主要的图像标注脚本中实例化该类的一个实例。

```python
"""
Batch process a directory of images, generating a natural language description of each image 
using the 4- and 8-bit quantized versions of Llama-3.2-11B-Vision-Instruct
Author: Gary A. Stafford
Date: 2024-10-05
"""

import os
import time
import json
import logging

import imageProcessor
import translator

## Constants
VISION_MODELS = [
    "neuralmagic/Llama-3.2-11B-Vision-Instruct-FP8-dynamic",
    "SeanScripts/Llama-3.2-11B-Vision-Instruct-nf4",
]
MODEL_NAME = VISION_MODELS[1]
TEMPERATURE = 0.3
MAX_NEW_TOKENS = 300
IMAGE_DIR = "input\\ad_images"
OUTPUT_FILE = "output\\image_output_translations.json"
PROMPT = """<|begin_of_text|><|start_header_id|>user<|end_header_id|>

<|image|>分析给定的图像，并生成 2-3 段的简洁描述。 
您的描述应捕捉图像的本质，包括其视觉元素、颜色、情绪、风格和整体影响。 
力求提供全面而简洁的叙述，让读者对图像有清晰的心理印象。

在描述中考虑以下方面：

1. 主题：
   - 图像的主要焦点或主题
   - 背景和环境
   - 任何显著的物体或元素

2. 视觉构图：
   - 元素的排列和框架
   - 透视和深度的使用
   - 平衡与对称（或缺乏对称）

3. 颜色和光照：
   - 主导颜色和整体调色板
   - 光的质量和方向
   - 影子和高光
   - 对比度和饱和度

4. 纹理和细节：
   - 物体的表面特性
   - 细节或抽象的程度
   - 图案或重复

5. 风格和技巧：
   - 艺术风格（例如，现实主义、印象派、抽象）
   - 使用的媒介（例如，照片、绘画、数字艺术）
   - 显著的艺术或摄影技巧

6. 情绪和氛围：
   - 整体情感基调
   - 象征性或隐喻性元素
   - 唤起的时间或地点感

7. 上下文和解读：
   - 潜在的意义或信息
   - 文化或历史参考（如果明显）
   - 观众可能的情感反应

指南：
- 用清晰、引人入胜的散文书写。
- 在客观描述和主观解读之间保持平衡。
- 优先考虑图像中最重要和最独特的元素。
- 使用生动、具体的语言在读者的脑海中描绘图像。
- 保持流畅的叙述，连接图像的不同方面。
- 将您的回应限制在 2-3 段。

您的描述应将这些元素编织在一起，创建一个连贯而生动的图像描绘，让读者能够清晰地想象出它，而不需要亲眼看到。<|eot_id|><|start_header_id|>assistant<|end_header_id|>"""


## 配置日志
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)


def main() -> None:
    """
    主函数，处理图像并生成描述和翻译。
    """
    image_processor = imageProcessor.ImageProcessor(MODEL_NAME)
    translate = translator.Translator()
    results = {"descriptions": [], "stats": {}}

    tt0 = time.time()

    for image_file in os.listdir(IMAGE_DIR):
        logging.info(f"正在处理 {image_file}...")

        t0 = time.time()

        image_path = os.path.join(IMAGE_DIR, image_file)
        if not image_path.lower().endswith((".png", ".jpg", ".jpeg")):
            continue

        inputs = image_processor.process_image(image_path, PROMPT)
        prompt_tokens = len(inputs["input_ids"][0])

        generate_ids, total_time = image_processor.generate_response(
            inputs, TEMPERATURE, MAX_NEW_TOKENS
        )
        description, generated_tokens, total_time, _ = image_processor.prepare_results(
            generate_ids, prompt_tokens, total_time
        )

        translation_spanish = translate.translate_text(description, "spa_Latn")
        translation_french = translate.translate_text(description, "fra_Latn")
        translation_hindi = translate.translate_text(description, "hin_Deva")

        t1 = time.time()
        total_processing_time = round(t1 - t0, 3)
        logging.info(f"总处理时间: {total_processing_time} 秒")

        image_result = {
            "image_file": image_file,
            "description_english": description,
            "translation_spanish": translation_spanish,
            "translation_french": translation_french,
            "translation_hindi": translation_hindi,
            "generated_tokens": generated_tokens,
            "description_generation_time_sec": round(total_time, 3),
            "total_processing_time_sec": round(total_processing_time, 3),
        }

        results["descriptions"].append(image_result)

        logging.info(f"描述: {description}")

    tt1 = time.time()
    total_batch_time = round(tt1 - tt0, 3)

    file_count = len(os.listdir(IMAGE_DIR))

    results["stats"] = {
        "model": MODEL_NAME,
        "temperature": TEMPERATURE,
        "total_batch_time_sec": total_batch_time,
        "total_images": file_count,
        "average_time_per_image_sec": round(total_batch_time / file_count, 3),
    }

    with open(OUTPUT_FILE, "w") as f:
        json.dump(results, f, indent=4)


if __name__ == "__main__":
    main()
```
主要的图像处理功能，用于所有类型的生成输出，已被分离到 `ImageProcessor` 类 `imageProcessor.py` 中。

```python
"""
Batch process a directory of images, generating a some form of an analysis of each image 
using the 4- and 8-bit quantized versions of Llama-3.2-11B-Vision-Instruct
Author: Gary A. Stafford
Date: 2024-10-05
"""

import time
import logging

from PIL import Image
import torch
from transformers import MllamaForConditionalGeneration, AutoProcessor


## Constants
DEVICE = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

## 配置日志
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)


class ImageProcessor:
    def __init__(self, model_name: str):
        self.model_name = model_name
        self.model = self.load_model()
        self.processor = self.load_processor()

    def load_model(self) -> MllamaForConditionalGeneration:
        """
        Load the model for conditional generation.

        Args:
            model_id (str): The model ID to load.

        Returns:
            MllamaForConditionalGeneration: The loaded model.
        """
        return MllamaForConditionalGeneration.from_pretrained(
            self.model_name,
            use_safetensors=True,
            torch_dtype="auto",
            device_map=DEVICE,
            attn_implementation="sdpa",
        ).to(DEVICE)

    def load_processor(self) -> AutoProcessor:
        """
        Load the processor for the model.

        Args:
            model_id (str): The model ID to load the processor for.

        Returns:
            AutoProcessor: The loaded processor.
        """
        return AutoProcessor.from_pretrained(self.model_name)

    def process_image(self, image_path: str, prompt: str) -> dict:
        """
        Process the image and prepare inputs for the model.

        Args:
            image_path (str): The path to the image file.
            prompt (str): The prompt to use for the model.
            model_device (str): The device to use for the model.

        Returns:
            dict: The processed inputs.
        """
        model_device = self.model.device
        image = Image.open(image_path).convert("RGB")
        inputs = self.processor(image, prompt, return_tensors="pt").to(model_device)
        return inputs

    def generate_response(
        self, inputs: dict, temperature: float, max_new_tokens: int
    ) -> tuple:
        """
        Generate a response based on the image content.

        Args:
            inputs (dict): The inputs for the model.
            temperature (float): The temperature to use for generation.
            max_new_tokens (int, optional): The maximum number of new tokens to generate. Defaults to 256.

        Returns:
            tuple: The generated IDs and the total time taken for generation.
        """
        t0 = time.time()
        generate_ids = self.model.generate(
            **inputs, max_new_tokens=max_new_tokens, temperature=temperature
        )
        t1 = time.time()
        total_time = t1 - t0
        return generate_ids, total_time

    def prepare_results(
        self, generate_ids: dict, prompt_tokens: int, total_time: float
    ) -> tuple:
        """
        Prepare the results from the generated IDs.

        Args:
            generate_ids (dict): The generated IDs.
            prompt_tokens (int): The number of prompt tokens.
            total_time (float): The total time taken for generation.

        Returns:
            tuple: The output description, the number of generated tokens, the total time, and the time per token.
        """
        output = self.processor.decode(generate_ids[0][prompt_tokens:]).replace(
            "<|eot_id|>", ""
        )
        generated_tokens = len(generate_ids[0]) - prompt_tokens
        time_per_token = total_time / generated_tokens
        return output, generated_tokens, total_time, time_per_token
```
以下是 `Translator` 类 `translator.py`，它使用 2.5 GB 的 `facebook/nllb-200-distilled-600M` 模型进行分词和翻译。

```python
"""
翻译器类，用于使用 Facebook (Meta) NLLB-200 精简版 600M 模型翻译文本
https://huggingface.co/facebook/nllb-200-distilled-600M
作者：Gary A. Stafford
日期：2024-10-05
"""

import logging

import torch
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

MODEL_ID_TRANSLATE = "facebook/nllb-200-distilled-600M"
MODEL_ID_TOKENIZER = "facebook/nllb-200-distilled-600M"
TEMPERATURE = 0.3
MAX_NEW_TOKENS = 300
DEVICE = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

## 配置日志
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)


class Translator:
    """
    一个用于使用预训练的序列到序列语言模型翻译文本的类。

    方法
    -------
    __init__():
        使用分词器和翻译模型初始化翻译器。

    translate_text(text: str, language: str = "eng_Latn") -> str:
        将给定文本翻译为指定语言。
    """

    def __init__(self):
        self.model = (
            AutoModelForSeq2SeqLM.from_pretrained(
                "facebook/nllb-200-distilled-600M",
                torch_dtype=torch.float16,
                attn_implementation="flash_attention_2",
            )
            .to(DEVICE)
            .eval()
        )

        self.tokenizer = AutoTokenizer.from_pretrained(
            "facebook/nllb-200-distilled-600M"
        )

    def translate_text(self, text, language="eng_Latn") -> str:
        logging.info(f"翻译文本到: {language}...")

        inputs = self.tokenizer(
            text, return_tensors="pt", padding=True, truncation=True
        ).to(DEVICE)

        translated_tokens = self.model.generate(
            **inputs,
            forced_bos_token_id=self.tokenizer.convert_tokens_to_ids(language),
            max_length=MAX_NEW_TOKENS,
            do_sample=True,
            temperature=TEMPERATURE,
        )
        response = self.tokenizer.batch_decode(
            translated_tokens, skip_special_tokens=True
        )[0]

        return response
```
该脚本遍历图像目录。它打开每个图像文件并将其转换为 RGB 颜色空间，这是一种在数字成像中使用的标准颜色模型。`Image.open` 函数是 Python Imaging Library (PIL) 的一部分，通常用于打开、处理和保存多种不同的图像文件格式。此转换是必要的，因为许多图像处理算法和模型期望输入图像为 RGB 格式。然后，该脚本准备图像以输入机器学习模型。`processor` 函数接受图像和 `prompt`，并将处理后的数据作为张量返回，张量是 PyTorch 中的核心数据抽象。`return_tensors="pt"` 参数指定输出应为 PyTorch 张量格式，这在深度学习框架中常用。最后，`.to(DEVICE)` 方法将处理后的张量移动到指定设备，即启用 CUDA 的 NVIDIA GPU。

`generate_description` 函数调用 4 位量化的 `SeanScripts/Llama-3.2–11B-Vision-Instruct-nf4` 模型为图像生成文本描述。它接受模型、输入、温度和最大新令牌数作为参数，并返回生成的描述。该函数使用 `transformers` 的 `MllamaForConditionalGeneration` 类，其中的 Mllama 模型由一个视觉编码器和一个语言模型组成。

Hugging Face [Transformers](https://huggingface.co/docs/transformers/en/index) 库，Hugging Face 表示该库支持 PyTorch、TensorFlow 和 JAX 之间的框架互操作性，提供在模型生命周期的每个阶段使用不同框架的灵活性。例如，在一个框架中用三行代码训练模型，然后在另一个框架中加载进行推理。Transformers 库提供 API 和工具，以便轻松下载和训练最先进的预训练模型。

### 图像标题示例

我从 Microsoft Edge 主页的在线数字广告中收集了 15 张小 PNG 图像。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Y0n7b7EDjX33pe0HpJw7OQ.png)

这些图像代表了各种消费者广告，包括旅行、耐用品、债务减免、信用卡和投资。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*m8iZoQPLY4y6la4lhXgVsA.png)

让我们来看看对上面第一张图像的分析结果，该图像显示了一张红色便签，上面写着“再见信用卡债务”，背景是一栋住宅。

来自脚本 `image_batch_translate.py` 的输出是一个复杂的 JSON 对象，包含 15 个图像描述。每个描述中，我都包含了统计信息：生成的标记数量（例如，222\）、英语描述生成的时间（例如，11\.863s）以及整个标题和创建三个翻译的过程的时间（例如，37\.432s）。此外，我还包括了整体批次的统计信息：模型（例如，`SeanScripts/Llama-3.2–11B-Vision-Instruct-nf4`）、温度（例如，0\.3\）、总批次时间（例如，9m25s）、处理的图像数量（15\）以及每张图像的平均时间（例如，37\.661s）。

```python
{
  "descriptions": [
    {
      "image_file": "test_image_01.jpg",
      "description_english": "The image depicts a house with a red sign in front of it, featuring the text \"BYE BYE CREDIT CARD DEBT\" in black letters. The house is a single-story structure with a gray roof and white trim, constructed from brown brick or stone. A covered porch with white columns runs along the front of the house, accompanied by a window on the left side and a door on the right.\n\nIn the foreground, the red sign dominates the scene, with the text written in a playful, handwritten font. The sign's bright red color stands out against the more subdued tones of the house. The background of the image features trees and greenery, suggesting a peaceful and natural setting.\n\nThe overall mood of the image is one of celebration and liberation, as the sign's message implies a sense of freedom from financial burdens. The use of a bright red color for the sign adds to this feeling, conveying a sense of joy and optimism. The image appears to be a lighthearted and humorous take on the idea of paying off debt, rather than a serious or somber depiction.",
      "translation_spanish": "La imagen representa una casa con un letrero rojo en su frente, con el texto \"BYE BYE CREDIT CARD DEBT\" en letras negras. La casa es una estructura de un piso con un techo gris y un acabado blanco, construido de ladrillo o piedra marrón. Un porche cubierto con columnas blancas corre a lo largo de la parte frontal de la casa, acompañado de una ventana en el lado izquierdo y una puerta en el derecho. En primer plano, el letrero rojo domina la escena, con el texto escrito en una fuente de colores divertidos escritos a mano. El color rojo brillante de la señal destaca contra los tonos más suaves de la casa. El sentido de la imagen presenta árboles y verdura, sugiriendo un entorno pacífico y natural. El humor general de la imagen es uno de la celebración y la liberación, ya que el mensaje del mensaje implica un signo de libertad de uso de la deuda, pero el color rojo parece ser un sentimento de alegría o un sentido de humor, que permite que la imagen sea más positiva, y el sentimiento de alegría se despliegue para una imagen, o un sentimiento de alegría positiva y de alegría para un sentimento positivo.",
      "translation_french": "L'image représente une maison avec un panneau rouge devant elle, avec le texte \"BYE BYE CREDIT CARD DEBT\" en lettres noires. La maison est une structure à étage unique avec un toit gris et un décor blanc, construit à partir de briques ou de pierres brunes. Un porche couvert avec des colonnes blanches s'étend le long de l'avant de la maison, accompagné d'une fenêtre du côté gauche et d'une porte à droite.",
      "translation_hindi": "छवि में एक लाल चिह्न के साथ एक घर का चित्रण किया गया है, जिसमें काले अक्षरों में \"BYE BYE CREDIT CARD DEBT\" शब्द लिखा है। यह घर भूरे रंग की छत और सफेद सजावट वाली एक मंजिला संरचना है, जिसे ब्राउन ईंट या पत्थर से बनाया गया है। घर के सामने एक सफेद कॉलम वाली एक ढक्कन है, जिसके साथ बाईं ओर एक खिड़की और दाईं ओर एक दरवाजा है। अग्रभूमि में, लाल चिह्न दृश्य पर हावी है, जिसमें एक रंगीन, हाथ से लिखे गए फ़ॉन्ट में लिखा गया है। चिह्न की उज्ज्वल लाल रंग घर के अधिक विनम्र स्वरों के खिलाफ बाहर खड़ा है। छवि की भावना में पेड़ और हरियाली है, जो एक शांत और प्राकृतिक सेटिंग का सुझाव देती है। छवि का समग्र मूड उत्सव और मुक्ति का एक है, क्योंकि संदेश का अर्थ है कि एक स्पष्ट रूप से स्पष्ट रूप से एक स्पष्ट भावना का उपयोग करना, एक स्पष्ट भावना का उपयोग करना और एक स्पष्ट रूप से स्पष्ट रूप से सकारात्मक भावना का उपयोग करना।",
      "generated_tokens": 222,
      "description_generation_time_sec": 11.863,
      "total_processing_time_sec": 37.432
    },
    {...}
  ],
  "stats": {
    "model": "SeanScripts/Llama-3.2-11B-Vision-Instruct-nf4",
    "temperature": 0.3,
    "total_batch_time_sec": 564.917,
    "total_images": 15,
    "average_time_per_image_sec": 37.661
  }
}
```
上述内容展示了由 4 位 `SeanScripts/Llama-3.2–11B-Vision-Instruct-nf4 模型` 生成的图像的英语描述，之后是法语、西班牙语和印地语翻译。生成的英语描述非常详细：

“*图像描绘了一栋房子，前面有一个红色标志，上面用黑色字母写着“再见信用卡债务”。这栋房子是一层结构，屋顶是灰色的，白色的装饰，采用棕色砖石建造。房子的前面有一个带白色柱子的有顶走廊，左侧有一扇窗户，右侧有一扇门。*

*在前景中，红色标志主导了场景，文字采用俏皮的手写字体。标志鲜艳的红色在房子的柔和色调中显得格外突出。图像的背景是树木和绿色植物，暗示着一个宁静自然的环境。*

*整体而言，图像传达了一种庆祝和解放的氛围，因为标志的信息暗示着摆脱经济负担的自由感。标志使用鲜艳的红色进一步增强了这种感觉，传达出一种快乐和乐观的情绪。该图像似乎是对还清债务这一概念的轻松幽默的诠释，而非严肃或阴郁的描绘。”*

作为比较，这里是使用 8 位量化的 `Llama-3.2–11B-Vision-Instruct-FP8-dynamic` 模型生成的同一图像的英语描述：

“*图像描绘了一个红色标志，上面有手写文字，显著展示在一栋房子前面。该标志似乎是用建筑纸或类似材料制成的，上面用黑色马克笔写着“再见信用卡债务”。*

*标志位于图像的前景，吸引了对其信息的注意。在背景中，可以看到一栋灰色屋顶和棕色砖外墙的一层房子，配有有顶走廊和玻璃前门。房子被树木和灌木环绕，为场景增添了一丝自然美感。*

*总体而言，图像暗示了制作标志的人通过消除信用卡债务而迈出了实现财务自由的重要一步。使用醒目、引人注目的标志和宁静的郊区环境营造了一种胜利和庆祝的感觉，暗示个人现在摆脱了债务的负担，可以专注于建立更安全的财务未来。*”

对于这 15 个视频批次，8 位模型的平均推理时间比 4 位模型慢 8\.5 倍，分别为 68\.741s 和 8\.09s。这在处理时间和成本上是一个显著的增加，尤其是在描述质量差异微不足道的情况下。

## 视频字幕生成

接下来，我们将使用 14.1 GB 的 `llava-hf/LLaVA-NeXT-Video-7B-hf` 模型来研究视频字幕生成。我编写了一个用于批量视频字幕生成和机器翻译的 Python 3 脚本 `video_batch_translate.py`。该脚本还实例化了 `Translator` 类的一个实例。

```python
"""
Batch process a directory of videos, generating a natural language description 
of each video using the LLaVA-NeXT-Video-7B model.
https://huggingface.co/docs/transformers/main/model_doc/llava_next_video
Author: Gary A. Stafford
Date: 2024-10-05
"""

import json
import logging
import os
import time

import videoProcessor
import translator

## Constants
MODEL_NAME = "llava-hf/LLaVA-NeXT-Video-7B-hf"
TEMPERATURE = 0.3
MAX_NEW_TOKENS = 300
VIDEO_DIR = "commercials"
OUTPUT_FILE = "output/video_output_descriptions.json"
PROMPT = """Analyze the given video and generate a concise description in 2-3 paragraphs. 
Your description should capture the essence of the video, including visual elements, audio content, and non-verbal communication. 
Aim for a comprehensive yet succinct narrative that gives readers a clear understanding of the video's content and style.

Consider the following aspects in your description:

1. Visual Content:
   - Setting and environment
   - Main characters or subjects
   - Key actions and events
   - Visual style and aesthetics

2. Audio Elements:
   - Dialogue themes or narration
   - Music and its mood
   - Significant sound effects
   - Overall audio atmosphere

3. Non-verbal Communication:
   - Emotions conveyed
   - Body language and gestures
   - Symbolic or metaphorical elements

4. Technical Aspects:
   - Filming techniques
   - Editing style
   - Special effects (if any)

5. Narrative and Theme:
   - Main message or story
   - Genre or type of video
   - Target audience
   - Overall mood or tone

Guidelines:
- Write in clear, engaging prose.
- Prioritize the most significant and distinctive elements of the video.
- Balance concrete details with broader observations about style and theme.
- Maintain a neutral, descriptive tone.
- Limit your response to 2-3 paragraphs.

Your description should flow naturally, weaving together various elements to create a cohesive overview of the video. 
Focus on painting a vivid picture that allows readers to envision the video without seeing it."""

## Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)

def main() -> None:
    """
    Main function to orchestrate the workflow.
    """

    video_processor = videoProcessor.VideoProcessor(
        MODEL_NAME, TEMPERATURE, MAX_NEW_TOKENS, PROMPT
    )
    containers = video_processor.load_videos(VIDEO_DIR)
    translate = translator.Translator()
    results = {"descriptions": [], "stats": {}}

    tt0 = time.time()

    for container in containers:
        logging.info(f"Processing {container.name}...")

        t0 = time.time()

        video_stream = container.streams.video[0]
        size = round(container.size / 1024 / 1024, 3)
        duration = round(video_stream.duration * video_stream.time_base)
        processed_frames = video_processor.process_video(container)
        response = video_processor.generate_response(processed_frames)
        description = video_processor.extract_answer(response)
        logging.info(f"Response: {description}")

        translation_spanish = translate.translate_text(description, "spa_Latn")
        translation_french = translate.translate_text(description, "fra_Latn")
        translation_hindi = translate.translate_text(description, "hin_Deva")

        t1 = time.time()
        total_processing_time = round(t1 - t0, 3)
        logging.info(f"Total processing time: {total_processing_time} seconds")

        video_result = {
            "video_file": container.name,
            "video_size_mb": size,
            "video_duration_sec": duration,
            "video_fps": round(video_stream.base_rate),
            "video_frames": video_stream.frames,
            "video_width": video_stream.width,
            "video_height": video_stream.height,
            "description_english": description,
            "translation_spanish": translation_spanish,
            "translation_french": translation_french,
            "translation_hindi": translation_hindi,
            "total_processing_time_sec": total_processing_time,
        }

        results["descriptions"].append(video_result)

    tt1 = time.time()
    total_batch_time = round(tt1 - tt0, 3)

    file_count = len(os.listdir(VIDEO_DIR))

    results["stats"] = {
        "model": MODEL_NAME,
        "temperature": TEMPERATURE,
        "total_batch_time_sec": total_batch_time,
        "total_videos": file_count,
        "average_time_per_video_sec": round(total_batch_time / file_count, 3),
    }

    logging.info(results["stats"])

    with open(OUTPUT_FILE, "w") as f:
        json.dump(results, f, indent=4)


if __name__ == "__main__":
    main()
```
主要的视频处理功能被分离到 `VideoProcessor` 类中，位于 `videoProcessor.py`。

```python
"""
Batch process a directory of videos, generating a some form of an analysis
of each video using the LLaVA-NeXT-Video-7B model.
https://huggingface.co/docs/transformers/main/model_doc/llava_next_video
Author: Gary A. Stafford
Date: 2024-10-05
"""

import logging
import os
import re

import av
import numpy as np
from transformers import LlavaNextVideoForConditionalGeneration, LlavaNextVideoProcessor
from transformers.utils import is_flash_attn_2_available

## Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)


class VideoProcessor:
    def __init__(
        self, model_name: str, temperature: float, max_new_tokens: int, prompt: str
    ):
        self.model_name = model_name
        self.temperature = temperature
        self.max_new_tokens = max_new_tokens
        self.prompt = prompt
        self.model = self.load_model()
        self.processor = self.load_processor()

    def read_video_pyav(
        self, container: av.container.input.InputContainer, indices: list[int]
    ) -> np.ndarray:
        """
        Decode the video with PyAV decoder.
        Args:
            container (`av.container.input.InputContainer`): PyAV container.
            indices (`List[int]`): List of frame indices to decode.
        Returns:
            result (np.ndarray): np array of decoded frames of shape (num_frames, height, width, 3).
        """
        frames = []
        container.seek(0)
        start_index = indices[0]
        end_index = indices[-1]
        for i, frame in enumerate(container.decode(video=0)):
            if i > end_index:
                break
            if i >= start_index and i in indices:
                frames.append(frame)
        decoded_frames = np.stack([x.to_ndarray(format="rgb24") for x in frames])
        return decoded_frames

    def load_model(self) -> LlavaNextVideoForConditionalGeneration:
        """
        Load the LlavaNextVideo model.
        Returns:
            model (LlavaNextVideoForConditionalGeneration): Loaded model.
        """
        return LlavaNextVideoForConditionalGeneration.from_pretrained(
            self.model_name,
            use_safetensors=True,
            torch_dtype="auto",
            device_map="cuda:0",
            attn_implementation=(
                "flash_attention_2" if is_flash_attn_2_available() else "sdpa"
            ),
        ).to("cuda")

    def load_processor(self) -> LlavaNextVideoProcessor:
        """
        Load the LlavaNextVideo processor.
        Returns:
            processor (LlavaNextVideoProcessor): Loaded processor.
        """
        processor = LlavaNextVideoProcessor.from_pretrained(self.model_name)
        processor.patch_size = 16
        processor.vision_feature_select_strategy = "default"
        return processor

    def load_videos(self, directory: str) -> list[av.container.input.InputContainer]:
        """
        Load all videos from the specified directory.
        Args:
            directory (str): Path to the directory containing video files.
        Returns:
            containers (list[av.container.input.InputContainer]): List of loaded video containers.
        """
        containers = []
        for filename in os.listdir(directory):
            if filename.endswith(".mp4"):
                filepath = os.path.join(directory, filename)
                container = av.open(filepath)
                containers.append(container)
        return containers

    def process_video(self, container: av.container.input.InputContainer) -> np.ndarray:
        """
        Process the video to extract frames.
        Args:
            container (`av.container.input.InputContainer`): PyAV container.
        Returns:
            video (np.ndarray): Processed video frames.
        """
        video_stream = container.streams.video[0]
        indices = np.arange(0, video_stream.frames, video_stream.frames / 8).astype(int)
        processed_frames = self.read_video_pyav(container, indices)
        return processed_frames

    def generate_response(self, video: np.ndarray) -> str:
        """
        Generate a response based on the video content.
        Args:
            video (np.ndarray): Processed video frames.
        Returns:
            answer (str): Generated response.
        """
        conversation = [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": self.prompt},
                    {"type": "video"},
                ],
            },
        ]
        prompt = self.processor.apply_chat_template(
            conversation, add_generation_prompt=True
        )
        inputs = self.processor(text=prompt, videos=video, return_tensors="pt").to(
            self.model.device
        )
        out = self.model.generate(
            **inputs,
            max_new_tokens=self.max_new_tokens,
            do_sample=True,
            temperature=self.temperature
        )
        response = self.processor.batch_decode(
            out, skip_special_tokens=True, clean_up_tokenization_spaces=True
        )
        return response

    def extract_answer(self, answer: str) -> str:
        """
        Extract and log the assistant's response from the generated answer.
        Args:
            answer (str): The generated response.
        Returns:
            assistant_value (str): The assistant's response.
        """
        match = re.search(r"ASSISTANT: (.*)", answer[0])
        if match:
            assistant_value = match.group(1)
        else:
            assistant_value = "No match found."

        return assistant_value
```
该脚本使用 `os` 和 `av` Python 包从指定目录加载所有视频到已加载视频容器的列表中 (`list[av.container.input.InputContainer]`)。该脚本使用 NumPy 库的 `np.arange` 函数生成帧索引数组。`np.arange` 函数在给定范围内创建一个均匀间隔的值数组。这里，范围从 0 开始，到 `video_stream.frames` 结束，表示视频的总帧数。步长为 `video_stream.frames / 16`，这意味着该函数将在将总帧数除以 16 的间隔处生成索引。这有效地从视频中选择 16 个均匀分布的帧。`.astype(int)` 方法将结果数组转换为整数，确保索引是有效的帧编号。最后，`generate_response` 函数处理视频内容（处理后的帧）并使用 `llava-hf/LLaVA-NeXT-Video-7B-hf` 模型和处理器生成文本响应。



### 视频字幕示例

在这篇文章中，我收集了15个公开可用的热门商业广告视频，全部为MP4格式。这些广告包括大众汽车、雪佛兰、可口可乐、德克里多斯、耐克、亨氏、州立农场、TurboTax等知名品牌。视频长度从30秒到94秒不等，包含720到2,349帧；视频分辨率各异。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*IwxqYaNtkzrCcxzzVJaB2g.png)

让我们来看看上面展示的最后一个视频的分析结果，耐克2024年的“*胜利并非人人可得*”广告。

输出来自脚本`video_batch_translate.py`，是一个复杂的JSON对象，包含15个视频描述。每个描述中，我都包括了统计信息：视频大小、时长、帧率、帧数、像素宽度、像素高度以及整个字幕和翻译过程的时间（例如：45.586秒）。我还包括了整体批次的统计信息：模型（`llava-hf/LLaVA-NeXT-Video-7B-hf`）、温度（例如：0.3）、总批次时间（例如：10分钟39秒）、处理的视频数量（例如：15）以及每个视频的平均时间（例如：42.632秒）。

```python
{
    "descriptions": [
    { 
      "video_file": "commercials\\Winning Isn't For Everyone Am I A Bad Person Nike.mp4",
      "video_size_mb": 28.354,
      "video_duration_sec": 90,
      "video_fps": 24,
      "video_frames": 2160,
      "video_width": 1920,
      "video_height": 1080,
      "total_processing_time_sec": 45.586,
      "description_english": "The video captures a dynamic scene of a female athlete, dressed in a white tank top and shorts, running on a track. She is in the midst of a race, her speed and focus evident as she approaches the finish line. The camera follows her from behind, emphasizing her determination and the intensity of the competition. In the background, a man in a blue shirt and shorts is seen running, adding to the sense of a competitive atmosphere. The camera then shifts to a woman in a blue shirt, who appears to be a reporter, providing commentary or analysis of the ongoing race. The audio includes the sound of the athletes' footsteps and breathing, along with the commentator's voice, creating a realistic and immersive experience. The visual style is realistic, with a focus on the athletes' physicality and the track's texture, giving a sense of the speed and effort involved in the sport. The overall mood is energetic and competitive, with a hint of excitement as the race nears its end. The video seems to be a sports-related piece, possibly a documentary or a live broadcast, aimed at sports enthusiasts or fans, highlighting the intensity of the competition and the dedication of the athletes.",
      "translation_spanish": "El video captura una escena dinámica de una atleta, vestida con una camiseta blanca y pantalones cortos, corriendo en una pista. Está en medio de una carrera, su velocidad y enfoque son evidentes cuando se acerca a la línea de meta. La cámara la sigue desde atrás, enfatizando su determinación e intensidad de la competencia. En el fondo, un hombre con camisa azul y pantalones cortos se ve corriendo, lo que agrega el sentido de un ambiente competitivo. La cámara luego se desplaza a una mujer con camisa azul, que parece ser una periodista, dando comentarios o análisis de la carrera en curso. El audio incluye el sonido de los pasos y la respiración de los atletas, junto con la voz del comentarista, creando una experiencia realista e inmersiva. El estilo es realista, con un enfoque en la velocidad de la carrera y el texto del esfuerzo de la carrera, y el objetivo es dar un paso a la intensidad visual de la carrera, y el deporte de los atletas es un entusiasta, como un entusiasta en la competencia, y el video se presenta como un gran sentido de la competencia o un entusiasta en vivo.",
      "translation_french": "La caméra la suit de derrière, soulignant sa détermination et l'intensité de la compétition. Dans le fond, un homme en chemise bleue et des shorts est vu courir, ajoutant à la sensation d'une atmosphère de compétition. La caméra se déplace ensuite vers une femme en chemise bleue, qui semble être une journaliste, fournissant des commentaires ou des analyses de la course en cours. L'audio comprend le son des pas et de la respiration des athlètes, ainsi que la voix du commentaire, créant une expérience réaliste et immersive. Le style est réaliste, avec un accent sur la vitesse de la course et la texture de l'effort de la course, et donne un sens de l'enthousiasme physique et la compétition, ou l'enthousiasme physique, la vidéo semble être un sens de l'enthousiasme et de l'enthousiasme des athlètes, et la diffusion d'un documentaire est liée à la compétition, et la vidéo semble être un épisode d'enthousiasme physique, une émotion physique, une émotion physique et un sens de l'enthousiasme de la compétition, et une émission sportive.",
      "translation_hindi": "वीडियो में एक महिला एथलीट का एक गतिशील दृश्य कैप्चर किया गया है, जो एक सफेद टैंक टॉप और शॉर्ट्स में पहनी हुई है, जो एक ट्रैक पर दौड़ती है। वह दौड़ के बीच में है, जब वह फिनिश लाइन के पास जाती है तो उसकी गति और ध्यान स्पष्ट होता है। कैमरा पीछे से उसका अनुसरण करता है, जिसमें उसकी दृढ़ संकल्प और प्रतियोगिता की तीव्रता पर जोर दिया जाता है। पृष्ठभूमि में, नीली शर्ट और शॉर्ट्स में एक आदमी दौड़ते हुए देखा जाता है, जिससे प्रतिस्पर्धी माहौल की भावना बढ़ जाती है। कैमरा फिर एक नीली शर्ट में एक महिला को स्थानांतरित करता है, जो एक रिपोर्टर प्रतीत होती है, जो चल रही दौड़ की टिप्पणी या विश्लेषण प्रदान करती है। ऑडियो में एथलीट के कदम और सांस की ध्वनि शामिल होती है, साथ ही एक यथार्थवादी और विसर्जित अनुभव पैदा होता है। ट्रैक की गति और स्पर्धा के अंत में टेक्स्ट पर ध्यान केंद्रित करते हुए, और एक दृश्यता प्रदान करती है, जो खेल के प्रति उत्साही, या खेल के प्रति उत्साही के साथ एक उत्साहपूर्ण भावना को बढ़ावा देती है।"
    }
  ],
  "stats": {
    "model": "llava-hf/LLaVA-NeXT-Video-7B-hf",
    "temperature": 0.3,
    "total_batch_time_sec": 639.474,
    "total_videos": 15,
    "average_time_per_video_sec": 42.632
  }
}
```
以上，我们看到视频的原始英文描述，随后是法语、西班牙语和印地语的翻译。生成的英文视频描述非常出色，详细描述了视觉、音频和非语言内容：

“*视频捕捉到一位女性运动员的动态场景，她穿着白色背心和短裤，在跑道上奔跑。她正处于比赛中，随着她接近终点线，她的速度和专注显而易见。相机从后面跟随她，强调了她的决心和竞争的激烈。在背景中，一个穿蓝衬衫和短裤的男人正在奔跑，增加了竞争氛围的感觉。然后相机转向一位穿蓝衬衫的女性，她似乎是一名记者，正在对正在进行的比赛进行评论或分析。音频包括运动员的脚步声和呼吸声，以及评论员的声音，创造出一种真实而沉浸的体验。视觉风格真实，着重于运动员的身体素质和跑道的质感，传达了这项运动中速度和努力的感觉。整体氛围充满活力和竞争，随着比赛接近尾声，带着一丝兴奋。视频似乎是与体育相关的作品，可能是纪录片或现场直播，旨在吸引体育爱好者或粉丝，突出竞争的激烈和运动员的奉献精神。*”

## 描述性标签

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*cndHLYkhKASw3pTFo2i30Q.png)

通过更改用于生成自然语言描述的提示，我们可以生成一系列描述性标签——独特的单词和短语，用于表征图像或视频。以下是从 `video_batch_tagging.py` 脚本中用于视频的描述性标签提示的示例：

```python
PROMPT = """Analyze the given video and generate a list of 15-20 descriptive tags or short phrases that capture its key elements. Consider all aspects: visual content, audio elements, and non-verbal communication. Your output should be a comma-delimited list.

Guidelines:
1. Cover diverse aspects: setting, characters, actions, emotions, audio, style, theme, and technical elements.
2. Use single words or short phrases (max 3-4 words) for each tag.
3. Prioritize the most significant and distinctive elements.
4. Include both concrete (e.g., "forest setting") and abstract (e.g., "melancholic atmosphere") descriptors.
5. Consider visual elements (colors, movements, objects), audio (dialogue themes, music, sound effects), and non-verbal cues (body language, emotions).
6. Note any standout technical aspects (animation style, camera techniques, video quality).
7. Capture the overall mood, genre, and target audience if apparent.

Format your response as a single line of comma-separated tags, ordered from most to least prominent. Do not use numbering or bullet points. Do not end the list with a period.

Example output:
urban landscape, neon lights, electronic music, fast-paced editing, young protagonists, street dance, nighttime setting, energetic atmosphere, handheld camera, diverse cast, futuristic fashion, crowd cheering, bold color palette, rebellious theme, social media integration, drone footage, underground culture, viral challenge, generational conflict, street art"""
```
分析同样的耐克2024年“*胜利并非人人可得*”广告，`llava-hf/LLaVA-NeXT-Video-7B-hf` 模型生成了以下标签列表，随后通过实用类 `tagsProcessor.py` 进行了去重和排序：

```python
"tags_processed": [
    "athletic training",
    "athleticism",
    "celebratory mood",
    "competitive edge",
    "competitive spirit",
    "crowd reactions",
    "determination",
    "dynamic camera angles",
    "emotional highs and lows",
    "energetic music",
    "female commentator",
    "gritty realism",
    "high-stakes event",
    "intense focus",
    "physical exertion",
    "post-game interview",
    "sports",
    "sportsmanship",
    "strategic planning",
    "sweaty palms",
    "teamwork",
    "vibrant colors"
]
```

## 情感分析

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*oNO7yGS2Obu5UAZjcHqAfA.png)

我们还可以通过再次更改提示来对图像或视频进行情感分析。以下是从 `video_batch_sentiment.py` 脚本中用于视频的情感分析提示示例：

```python
PROMPT = """Perform a comprehensive sentiment analysis of the given video. 
Focus on identifying and interpreting the overall emotional tone, mood, and underlying sentiments expressed throughout the video. 
Present your analysis in 2-3 concise paragraphs.

Consider the following aspects in your sentiment analysis:

1. Visual Elements:
   - Facial expressions and body language of individuals
   - Color palette and lighting (e.g., warm vs. cool tones)
   - Visual symbolism or metaphors

2. Audio Components:
   - Tone of voice in dialogue or narration
   - Emotional quality of background music
   - Use of sound effects and their emotional impact

3. Narrative and Content:
   - Overall story arc or message
   - Emotional journey of characters or subjects
   - Conflicts and resolutions presented

4. Pacing and Editing:
   - Rhythm and tempo of scene changes
   - Use of techniques like slow motion or quick cuts

5. Textual Elements:
   - Sentiment in any on-screen text or captions
   - Emotional connotations of title or subtitles

Guidelines for Analysis:
- Identify the dominant sentiment(s) expressed in the video (e.g., joy, sadness, anger, fear, surprise).
- Note any shifts in sentiment throughout the video's duration.
- Analyze how different elements (visual, audio, narrative) work together to create the overall emotional tone.
- Consider both explicit and implicit expressions of sentiment.
- Reflect on the intended emotional impact on the viewer.
- If applicable, discuss any contrasting or conflicting sentiments present.
- Provide specific examples from the video to support your analysis.
- Consider the context and target audience when interpreting sentiment.

Presentation Guidelines:
- Summarize your findings in 2-3 well-structured paragraphs.
- Begin with an overview of the dominant sentiment(s) and overall emotional tone.
- In subsequent paragraph(s), delve into more nuanced aspects of the sentiment analysis, including any notable shifts or contrasts.
- Conclude with a brief reflection on the effectiveness of the video in conveying its intended emotional message.
- Use clear, concise language while providing sufficient detail to support your analysis.
- Maintain an objective tone in your analysis, focusing on observed elements rather than personal opinions.

Your sentiment analysis should provide readers with a clear understanding of the emotional content and impact of the video, 
supported by specific observations from various aspects of the video's production."""
```
使用耐克2024年“*胜利并不适合每个人*”广告的相同示例，`llava-hf/LLaVA-NeXT-Video-7B-hf` 模型生成了以下情感分析：

“*该视频展现了一系列多样的情感和情绪，整体氛围以积极和充满活力为主。主导情感是兴奋和期待，这在小女孩和男人的表情中显而易见。女孩睁大眼睛的凝视和男人专注的表情传达出一种渴望和准备的感觉，暗示他们渴望参与即将进行的活动或事件。温暖的灯光和鲜艳的色彩，例如女孩的黄色球衣和男人的红白制服，进一步增强了这种充满活力和积极的情绪。背景音乐活泼而欢快，增加了场景的兴奋和热情。*”

## 广告与创意分析

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*A6iqmML9kbvLZV8L0hV2UA.png)

最后，我们可以通过再次更改提示来执行广告和创意内容的分析。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*13Yd3-xpA5mgMvjzRLz3YA.png)

以下是用于分析数字广告的广告分析提示示例，来自 `ads_batch_descriptions.py` 脚本的图像捕获：

```python
PROMPT = """<|begin_of_text|><|start_header_id|>user<|end_header_id|>

<|image|>Analyze the given advertisement and generate a concise description in a 2-3 paragraph structure. Don't use headlines or lists.
Your description should capture the essence of the ad, including its visual elements, layout, typography, copy, imagery, and overall impact. 
Aim for a comprehensive yet succinct narrative that gives readers a clear understanding of the ad's content, style, and intended message.

Consider the following aspects in your paragraph-based description:

1. Visual Elements:
   - Overall color scheme and dominant colors
   - Main images or illustrations and their content
   - Use of white space
   - Presence of logos or brand elements

2. Layout and Composition:
   - Overall structure and organization of elements
   - Focal points and visual hierarchy
   - Balance and alignment of components

3. Typography:
   - Font choices and styles
   - Size and prominence of text elements
   - Relationship between different text components

4. Copy and Messaging:
   - Main headline or slogan
   - Key phrases or taglines
   - Tone and style of the written content
   - Call-to-action (if present)

5. Imagery and Graphics:
   - Style of images (e.g., photography, illustrations, CGI)
   - Emotional appeal of visuals
   - Symbolism or metaphors in imagery

6. Branding Elements:
   - Prominence and placement of brand name/logo
   - Consistency with known brand identity (if applicable)

7. Target Audience and Context:
   - Implied target demographic
   - Cultural or social context of the ad

8. Medium and Format:
   - Type of ad (e.g., print, digital, billboard)
   - Size and orientation

9. Overall Impact and Effectiveness:
   - Emotional tone or mood evoked
   - Clarity and memorability of the message
   - Unique or innovative aspects of the ad

Guidelines:
- Write in clear, engaging prose.
- Balance description of individual elements with analysis of their collective impact.
- Prioritize the most significant and distinctive features of the advertisement.
- Use specific, vivid language to paint a picture in the reader's mind.
- Maintain a flowing narrative that connects different aspects of the ad.
- Include an objective description of the ad's elements and a brief interpretation of its likely intended effect.
- Limit your response to 2-3 paragraphs.

Your description should weave together these elements to create a cohesive and insightful portrayal of the advertisement, 
allowing readers to visualize it clearly and understand its key messages and strategies.<|eot_id|><|start_header_id|>assistant<|end_header_id|>"""让我们来看看对 World Wide Technology 在 Yahoo! 上的数字广告分析生成的结果。
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*qcaej4V1bcvzfzdoklkcQA.png)

`SeanScripts/Llama-3.2–11B-Vision-Instruct-nf4` 模型生成了以下详细分析：

“*该广告展示了一辆未来派的高科技赛车，采用蓝色和红色的色调，背景模糊为一个体育场或竞技场。图像上叠加了网格图案和各种线条与形状，营造出动态和科技感。*

*广告的布局简洁现代，底部有一个显眼的行动号召（CTA）按钮，上面写着“了解更多”。文本清晰易读，字体较大，使用简单的无衬线字体。整体设计流畅而精致，传达出创新和尖端科技的感觉。*

*广告的信息集中在释放人工智能的力量上，标语为“WWT的人工智能试验场——解锁无与伦比的全球人工智能技术访问”。“试验场”这一短语暗示了一种实验和探索的感觉，而“无与伦比的访问”则暗示了一种独特性和高端品质。总体而言，广告有效地传达了 World Wide Technology 在人工智能领域的领导地位，并为客户提供了利用其专业知识的独特机会。”*

## 结论

在这篇文章中，我们学习了如何使用 Llama 3.2 11B Vision Instruct 模型的 4 位和 8 位量化版本以及 LLaVA-Next-Video 7B 模型的组合，生成详细的自然语言描述、描述性标签和图像与视频的情感分析。我们还学习了如何使用 Facebook 的 600M 参数变体的 NLLB-200 模型，从生成的描述中产生翻译。Hugging Face 上有超过一百万个模型，我们可以使用无限的模型组合来解决即使是最复杂的 NLP 任务。

*如果您还不是 Medium 会员并希望支持像我这样的作者，请在此注册：<https://garystafford.medium.com/membership>。*

*本博客代表我的观点，而不是我雇主亚马逊网络服务（AWS）的观点。所有产品名称、图像、徽标和品牌均为其各自所有者的财产。*

