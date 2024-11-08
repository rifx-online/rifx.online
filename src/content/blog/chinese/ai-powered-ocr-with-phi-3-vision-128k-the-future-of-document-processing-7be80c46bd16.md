---
title: "采用 Phi-3-Vision-128K 的人工智能 OCR：文档处理的未来"
meta_title: "采用 Phi-3-Vision-128K 的人工智能 OCR：文档处理的未来"
description: "在快速发展的人工智能世界中，多模式模型正在为整合视觉和文本数据设定新的标准……"
date: 2024-11-08T00:26:30Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*BR-H6cQoyoRo6gVRqjvAyA.png"
categories: ["Natural Language Processing", "Computer Vision", "Data Science"]
author: "Rifx.Online"
tags: ["OCR", "tokens", "encoder", "language", "document"]
draft: False

---





在快速发展的人工智能领域，多模态模型正在为视觉和文本数据的整合设定新标准。最新的突破之一是 **Phi\-3\-Vision\-128K\-Instruct**，这是一个最先进的开放多模态模型，推动了AI在处理图像和文本方面的能力边界。该模型专注于文档提取、光学字符识别（OCR）和一般图像理解，能够彻底改变我们处理PDF、图表、表格以及其他结构化或半结构化文档的信息方式。

让我们深入探讨Phi\-3\-Vision\-128K\-Instruct的细节，探索其架构、技术要求、负责任的使用考虑，并了解它如何简化文档提取、PDF解析和AI驱动的数据分析等复杂任务。

## 什么是 Phi\-3\-Vision\-128K\-Instruct？

Phi\-3\-Vision\-128K\-Instruct 属于 Phi\-3 模型系列，专为多模态数据处理而构建，支持最长 **128,000 个令牌** 的上下文长度。该模型结合了文本和视觉数据，适合需要同时解释文本和图像的任务。其开发涉及 **5000 亿个训练令牌**，结合了高质量的合成数据和严格筛选的公开可用来源。通过包括 **监督微调和偏好优化** 的精细训练过程，该模型旨在提供精确、可靠和安全的 AI 解决方案。

Phi\-3\-Vision\-128K\-Instruct 拥有 **42 亿个参数**，其架构包括图像编码器、连接器、投影器和 Phi\-3 Mini 语言模型，使其成为广泛应用的轻量级而强大的选择。

## 核心用例

该模型的主要应用跨越多个领域，特别关注于：

* **文档提取和OCR：** 高效地将文本图像或扫描文档转换为可编辑格式。它可以处理复杂的布局，如表格、图表和图示，使其成为数字化实体文档或自动化数据提取工作流的宝贵工具。
* **一般图像理解：** 解析视觉内容以识别对象、解释场景并提取相关信息。
* **内存/计算受限环境：** 在计算能力或内存有限的情况下运行AI任务，而不影响性能。
* **延迟受限场景：** 在实时应用中减少处理延迟，例如实时数据流、基于聊天的助手或流媒体内容分析。

## 如何开始使用 Phi\-3\-Vision\-128K\-Instruct

要使用 Phi\-3\-Vision\-128K\-Instruct，您需要设置开发环境，安装所需的库和工具。该模型集成在 Hugging Face `transformers` 库的开发版本 (4\.40\.2\) 中。在深入代码示例之前，请确保您的 Python 环境已配置这些包：

```python
## Required Packages
flash_attn==2.5.8
numpy==1.24.4
Pillow==10.3.0
Requests==2.31.0
torch==2.3.0
torchvision==0.18.0
transformers==4.40.2
```
要加载模型，您可以更新本地的 `transformers` 库，或者直接从源代码克隆并安装：

```python
pip uninstall -y transformers && pip install git+https://github.com/huggingface/transformers
```
现在，让我们进入一些实际的代码片段，展示如何利用这个强大的模型进行 AI 驱动的文档提取和文本生成。

## 加载模型的示例代码

这里有一个 Python 示例，展示如何初始化模型并开始进行推断。我们将利用类和函数使代码保持整洁和有序：

```python
from PIL import Image
import requests
from transformers import AutoModelForCausalLM, AutoProcessor

class Phi3VisionModel:
    def __init__(self, model_id="microsoft/Phi-3-vision-128k-instruct", device="cuda"):
        """
        使用指定的模型 ID 和设备初始化 Phi3VisionModel。
        
        参数：
            model_id (str): 来自 Hugging Face 模型库的预训练模型标识符。
            device (str): 加载模型的设备（"cuda" 表示 GPU，或 "cpu"）。
        """
        self.model_id = model_id
        self.device = device
        self.model = self.load_model()  # 在初始化时加载模型
        self.processor = self.load_processor()  # 在初始化时加载处理器
    
    def load_model(self):
        """
        加载具有因果语言建模能力的预训练语言模型。
        
        返回：
            model (AutoModelForCausalLM): 加载的模型。
        """
        print("加载模型中...")
        # 使用自动设备映射和数据类型调整加载模型
        return AutoModelForCausalLM.from_pretrained(
            self.model_id, 
            device_map="auto",  # 自动将模型映射到适当的设备
            torch_dtype="auto",  # 根据设备使用合适的 torch 数据类型
            trust_remote_code=True,  # 允许执行自定义代码以加载模型
            _attn_implementation='flash_attention_2'  # 使用优化的注意力实现
        ).to(self.device)  # 将模型移动到指定设备
    
    def load_processor(self):
        """
        加载与模型关联的处理器，以处理输入和输出。
        
        返回：
            processor (AutoProcessor): 用于处理文本和图像的加载处理器。
        """
        print("加载处理器中...")
        # 使用 trust_remote_code=True 加载处理器，以处理任何自定义处理逻辑
        return AutoProcessor.from_pretrained(self.model_id, trust_remote_code=True)
    
    def predict(self, image_url, prompt):
        """
        使用模型根据给定的图像和提示进行预测。
        
        参数：
            image_url (str): 要处理的图像的 URL。
            prompt (str): 指导模型生成的文本提示。
        
        返回：
            response (str): 模型生成的响应。
        """
        # 从提供的 URL 加载图像
        image = Image.open(requests.get(image_url, stream=True).raw)
        
        # 为模型格式化输入提示模板
        prompt_template = f"<|user|>\n<|image_1|>\n{prompt}<|end|>\n<|assistant|>\n"
        
        # 处理输入，将提示和图像转换为张量格式
        inputs = self.processor(prompt_template, [image], return_tensors="pt").to(self.device)
        
        # 设置模型响应生成的参数
        generation_args = {
            "max_new_tokens": 500,  # 最大生成的令牌数
            "temperature": 0.7,     # 生成中的采样温度以增加多样性
            "do_sample": False      # 禁用采样以获得确定性输出
        }
        print("生成响应中...")
        # 使用模型生成输出 ID，跳过输入令牌
        output_ids = self.model.generate(**inputs, **generation_args)
        output_ids = output_ids[:, inputs['input_ids'].shape[1]:]  # 忽略输出中的输入提示
        
        # 解码生成的输出令牌以获取响应文本
        response = self.processor.batch_decode(output_ids, skip_special_tokens=True)[0]
        return response

## 初始化模型
phi_model = Phi3VisionModel()

## 示例预测
image_url = "https://example.com/sample_image.png"  # 示例图像的 URL
prompt = "以 json 格式提取数据。"  # 模型指导的提示
response = phi_model.predict(image_url, prompt)  # 从模型获取响应

print("响应:", response)  # 打印生成的响应
```
上述代码定义了一个 `Phi3VisionModel` 类，抽象了模型的加载和使用，使其更容易集成到您的应用程序中。`predict()` 方法展示了如何使用自定义提示进行基于图像的推断。

为了更新文章，侧重于测试 Phi-3-Vision-128K-Instruct 模型的 OCR 能力，我们将添加一个部分，详细说明模型在处理扫描的身份证等实际示例时的表现。

## 测试 OCR 功能与扫描的身份证件

为了评估 Phi\-3\-Vision\-128K\-Instruct 模型的 OCR 性能，我们使用几张真实的扫描身份证件图像进行了测试。这些图像在质量和清晰度上各不相同，为模型提供了一系列挑战。目标是展示模型在提取具有不同特征的文档中的文本信息方面的表现，如模糊、复杂背景和不同的字体。

**图像 1：** 一本虚构的乌托邦护照，包含详细的文本，包括个人信息，如姓名、国籍、出生地、签发日期和到期日期。文本略显风格化，底部有机器可读区。图像质量高，没有明显的背景噪声。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*MltpseOI3HhvCkUZMwLdEQ.png)

**输出：**


```python
{
  "Type/Type": "P",
  "Country code/Code du pays": "UTO",
  "Passport Number/N° de passeport": "L898902C3",
  "Surname/Nom": "ERIKSSON",
  "Given names/Prénoms": "ANNA MARIA",
  "Nationality/Nationalité": "UTOPIAN",
  "Date of Birth/Date de naissance": "12 AUGUST/AOUT 74",
  "Personal No./N° personnel": "Z E 184226 B",
  "Sex/Sexe": "F",
  "Place of birth/Lieu de naissance": "ZENITH",
  "Date of issue/Date de délivrance": "16 APR/AVR 07",
  "Authority/Autorité": "PASSPORT OFFICE",
  "Date of expiry/Date d'expiration": "15 APR/AVR 12",
  "Holder's signature/Signature du titulaire": "anna maria eriksson",
  "Passport/Passeport": "P<UTOERIKSSON<<ANNA<MARIA<<<<<<<<<<<<<<<<<<<<<<<L898902C36UT07408122F1204159ZE184226B<<<<10"
}
```
**图像 2：** 一本荷兰护照，清晰地显示持有人和整齐格式化的文本。字段包括护照号码、姓名、出生日期、国籍和到期日期。该文件呈现出高对比度，使文本提取相对简单。底部的机器可读区 (MRZ) 提供了一种结构化的数据格式，有助于验证提取信息的准确性。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*WGV4tTxI9xISmAvFs8ovNw.png)

**输出：**


```python
Here's the extracted full data from the passport in JSON format:

{
  "passport": {
    "issuingCountry": "Netherlands",
    "issuingAuthority": "Koninkrijk der Nederlanden",
    "passportNumber": "SPEC12014",
    "issuingDate": "09 MAR 2014",
    "expiryDate": "09 MAR 2024",
    "holder": {
      "gender": "F",
      "nationality": "Netherlands",
      "placeOfBirth": "SPECIMEN",
      "sex": "WF",
      "firstNames": [
        "Willem",
        "Lieselotte"
      ]
    },
    "physicalDescription": {
      "height": "1.75 m",
      "hairColor": "gray",
      "hairLength": "short"
    },
    "issuingOffice": "Burg. van Stad en Dorp",
    "issuingDateAsInt": "14032014",
    "expiryDateAsInt": "14032024",
    "fieldsExtracted": [
      {
        "code": "NL",
        "dateOfBirth": "10 MAR 1965",
        "dateOfIssue": "09 MAR 2014",
        "dateOfExpiry": "09 MAR 2024",
        "firstNames": [
          "Willem",
          "Lieselotte"
        ],
        "nationality": "Netherlands",
        "passportNumber": "SPEC12014",
        "placeOfBirth": "SPECIMEN",
        "sex": "WF"
      }
    ]
  }
}
```

## 尝试 Phi\-3\-Vision\-128K\-Instruct

如果您想亲自尝试 Phi\-3\-Vision\-128K\-Instruct 模型，可以通过以下链接进行探索：[在 Azure AI 上尝试 Phi\-3\-Vision\-128K\-Instruct](https://ai.azure.com/explore/models/Phi-3-vision-128k-instruct/version/1/registry/azureml)。该链接允许您体验模型的功能并实验其 OCR 功能。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*7feNu3ZuclgAnAzbJMMSFg.png)

## 理解架构与训练

**Phi\-3\-Vision\-128K\-Instruct** 模型不仅仅是一个语言模型——它是一个多模态强者，能够处理视觉和文本数据。它经历了全面的训练过程，包含 **5000亿个标记**，结合了文本和图像数据。其架构整合了语言模型和图像处理模块，创建了一个能够理解 **128K 个标记** 上下文的统一系统，支持更长的对话或大量内容的文档。

在强大的硬件上训练，例如 **512 H100 GPUs**，并利用 **flash attention** 提高内存效率，这个模型能够轻松处理大规模任务。训练数据集包括合成数据和经过筛选的真实世界数据，强调 **数学、编码、常识推理** 和 **一般知识**，使其足够灵活以适应各种应用。

## 关键基准和性能

Phi\-3\-Vision\-128K\-Instruct 的性能已经在多个基准测试中进行评估，包括 **ScienceQA**、**AI2D**、**MathVista** 和 **TextVQA**。它的得分在结合文本和视觉的任务中始终超过许多现有模型，特别是在以下领域：

* **文档理解**：从复杂文档（如 PDF 或图像）中提取有用信息。
* **表格和图表理解**：准确解读图形数据并将其转换为文本解释。

特别是，该模型在 **ChartQA** 上取得了令人印象深刻的 **81\.4%**，在 **AI2D** 上取得了 **76\.7%**，展示了其有效理解数据丰富文档的能力。

## 为什么OCR和文档提取很重要

文档提取和OCR对于企业和研究至关重要，使得将打印或手写文本转换为机器可读格式成为可能。使用像Phi-3-Vision-128K-Instruct这样的AI模型，可以显著简化**PDF解析**、**数据录入自动化**、**发票处理**和**法律文档分析**等任务。

无论您处理的是扫描文档、截图还是拍摄的页面，该模型的多模态能力都可以帮助**自动化数据提取**，使其成为提高生产力和减少人工工作量的宝贵工具。

## 负责任的人工智能与安全措施

虽然该模型功能强大，但开发者应注意其局限性。**语言偏见**、**刻板印象强化**和**不准确内容生成**是潜在问题。对于高风险的使用案例，例如**健康或法律建议**，需要额外的**验证和内容过滤**层。

## 未来方向与微调

想要扩展 Phi\-3\-Vision\-128K\-Instruct 的功能吗？支持微调，可以使用 **Phi\-3 Cookbook** 进行，该手册提供了调整模型以适应特定任务的配方，例如 **文档分类**、**增强的 OCR 准确性** 和 **专业的图像理解**。

## 结论

Phi\-3\-Vision\-128K\-Instruct 不仅仅是多模态 AI 的一步进展；它是迈向一个未来的飞跃，在这个未来中，**文档提取、OCR 和 AI 驱动的内容生成**是无缝且易于获取的。凭借广泛的训练、强大的架构和深思熟虑的设计，该模型使开发者能够在各个领域转变数据处理。

敬请期待更多关于如何将该模型与现实世界应用集成的高级示例和教程，我们将探索**处理多种文档类型**和应用**AI 驱动的技术**从多样化来源提取有价值的见解。

**AI 驱动的文档提取**的未来从未如此光明！

