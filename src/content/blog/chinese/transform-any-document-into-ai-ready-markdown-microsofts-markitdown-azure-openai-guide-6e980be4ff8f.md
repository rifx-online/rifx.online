---
title: "将任何文档转化为人工智能就绪的 Markdown：微软 MarkItDown + Azure OpenAI 指南"
meta_title: "将任何文档转化为人工智能就绪的 Markdown：微软 MarkItDown + Azure OpenAI 指南"
description: "微软的MarkItDown是一款新开源工具，用于将PDF、Office文件和图像转换为Markdown格式。该工具与Azure OpenAI集成，增强了图像处理能力。MarkItDown支持多种文档和数据格式，适用于文档转换和自然语言处理。使用时需有效的Azure订阅和API权限。开发者可利用示例代码批量处理文档，MarkItDown为文档处理提供了坚实基础。"
date: 2024-12-26T01:13:12Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*7prmWElJ3rqdbMK_z9uAXw.png"
categories: ["Programming", "Technology", "Machine Learning"]
author: "Rifx.Online"
tags: ["Markdown", "conversion", "OpenAI", "Azure", "batch-processing"]
draft: False

---





### 开发者的实用指南：使用微软最新的开源工具与 Azure OpenAI 集成，将 PDF、Office 文件和图像转换为干净的 Markdown

微软的 MarkItDown 是一款由 AutoGen 团队开发的新开源工具，可以将各种文档格式转换为 Markdown。虽然该工具可以独立工作，但将其与 Azure OpenAI 集成可以增强其功能，特别是在图像处理任务方面。

### 为什么 MarkItDown 重要

文档处理与人工智能的交集带来了独特的挑战。传统文档格式在将数据输入机器学习模型时往往会造成障碍。MarkItDown 通过提供一种统一的方法，将这些格式转换为 Markdown，这是一种轻量级的标记语言，已成为数字时代文本格式化的事实标准。

### 验证的功能

根据官方文档，MarkItDown 支持：

* 文档格式：PDF、PowerPoint、Word、Excel
* 媒体文件：图像（带 EXIF \& OCR）、音频（带 EXIF \& 转录）
* 网页内容：HTML
* 数据格式：CSV、JSON、XML
* 压缩文件：ZIP 文件

## Azure OpenAI 集成

当您需要高级功能，特别是图像描述时，Azure OpenAI 集成增加了另一层智能。以下是基于官方文档的与 Azure OpenAI 集成的验证方法：

```python
from markitdown import MarkItDown
from openai import AzureOpenAI
import os

## Initialize Azure OpenAI client
client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_KEY"),
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_version="2024-02-15-preview"
)

## Initialize MarkItDown with Azure OpenAI
md = MarkItDown(
    llm_client=client,
    llm_model="deployment-name"  # Your Azure OpenAI deployment name
)

## Process a document with AI capabilities
result = md.convert("image-with-text.jpg")
print(result.text_content)
```

## 重要的验证说明

**LLM 集成范围**

* 确认：LLM 功能主要用于图像描述生成
* 不需要：用于基本文档转换任务

**Azure OpenAI 要求**

* 有效的 Azure 订阅
* Azure OpenAI 服务访问
* 在您的 Azure 资源中部署的模型
* 适当的 API 权限

**安全最佳实践**

* 使用环境变量存储凭据
* 实施适当的错误处理
* 遵循 Azure 的安全指南

## 批处理示例

此批处理示例已通过官方库验证。为了高效处理多个文档：


```python
import os
from markitdown import MarkItDown
from openai import AzureOpenAI

## Initialize with Azure OpenAI (if needed)
client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_KEY"),
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_version="2024-02-15-preview"
)

md = MarkItDown(
    llm_client=client,
    llm_model=os.getenv("AZURE_OPENAI_DEPLOYMENT")
)

## Define supported formats
supported_extensions = ('.pptx', '.docx', '.pdf', '.jpg', '.jpeg', '.png')
files_to_convert = [f for f in os.listdir('.') 
                   if f.lower().endswith(supported_extensions)]

## Process each file
for file in files_to_convert:
    print(f"\nProcessing: {file}")
    try:
        result = md.convert(file)
        output_file = f"{os.path.splitext(file)[0]}.md"
        with open(output_file, 'w') as f:
            f.write(result.text_content)
        print(f"Success: Created {output_file}")
    except Exception as e:
        print(f"Error processing {file}: {str(e)}")
```

## 当前状态 \& 限制

**截至2024年12月：**

* **项目状态：** 由Microsoft AutoGen团队积极开发
* 假期休息：12月21日-1月6日（已从仓库通知中确认）
* **Azure OpenAI：** 仅在图像描述功能中需要
* 图像处理：OCR功能与Azure OpenAI无关

MarkItDown代表了文档处理技术的重大进步。它与Azure OpenAI服务的结合为开发人员提供了一个强大的工具包，适用于文档转换和自然语言处理。无论您是在构建内容管理系统、准备AI模型的训练数据，还是自动化文档工作流程，MarkItDown都为您的文档处理需求提供了坚实的基础。

## 验证过的参考文献

1. [官方 MarkItDown 仓库](https://github.com/microsoft/markitdown) — 最后验证时间：2024年12月22日
2. [Azure OpenAI 服务文档](https://learn.microsoft.com/en-us/azure/ai-services/openai/) — 包含当前 API 版本和集成指南
3. [Azure AI 服务定价](https://azure.microsoft.com/en-us/pricing/details/cognitive-services/openai-service/) — 了解当前 Azure OpenAI 的费用和限制


> 注意：所有代码示例和功能均已根据截至2024年12月22日的官方 Microsoft 文档和仓库进行验证。由于 MarkItDown 和 Azure OpenAI 服务的持续开发状态，请始终参考官方文档以获取最新信息。

