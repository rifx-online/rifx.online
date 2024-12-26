---
title: "MarkItDown：LLMs 项目必备的强大工具包，已通过 OpenAI 和 Gemini 2.0 测试"
meta_title: "MarkItDown：LLMs 项目必备的强大工具包，已通过 OpenAI 和 Gemini 2.0 测试"
description: "MarkItDown是微软开发的工具包，能够将多种文件格式转换为Markdown，便于大型语言模型（LLMs）的训练和应用。它支持多种文档类型，包括办公文件和富媒体文件，提供结构化文本以提高训练效率。通过与OpenAI和Gemini 2.0 Flash的集成，用户可以实现文档分析和上下文增强，创建高效的LLM应用。使用该工具，开发者能够轻松处理文档并生成相应的LLM响应。"
date: 2024-12-26T04:30:18Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*tiMyJhGoTluC-uHWRvnOAg.png"
categories: ["Programming", "Machine Learning", "Natural Language Processing"]
author: "Rifx.Online"
tags: ["Markdown", "LLMs", "documents", "OpenAI", "Gemini"]
draft: False

---



*MarkItDown 是微软开发的一款多功能工具，可以将各种文件格式转换为 Markdown，使其成为从事大型语言模型（LLMs）开发人员的必备工具。无论您想利用文档进行微调还是创建提示前言，这都是您不可或缺的工具。让我们看看如何在 OpenAI 和 Gemini 模型的实际应用中利用它。*

### 核心能力

该 [toolkit](https://github.com/microsoft/markitdown) 擅长将多种文档类型转换为 Markdown 格式，包括：

* 办公文档（PowerPoint、Word、Excel）
* 富媒体文件（带有 EXIF 和 OCR 的图像、带有转录的音频）
* 网络和结构化数据（HTML、CSV、JSON、XML）
* 压缩文件（ZIP）

### LLM 集成的好处

**训练数据准备** 将多种文档格式转换为 Markdown 创建了干净、结构化的文本，适合 LLM 训练。这种标准化确保了一致的输入格式，提高了训练效率。**上下文增强** 在构建 LLM 驱动的应用程序时，MarkItDown 可以处理特定领域的文档，以提供丰富的上下文，从而实现更准确和相关的响应。

安装库非常简单：

```python
pip install markitdown
```
然后，运行简单的转换只需几行代码：

```python
from markitdown import MarkItDown

md = MarkItDown()
result = md.convert("technical_doc.xlsx")
processed_content = result.text_content
```
在上述案例中，我们将 Excel 文件转换为 Markdown。一个高级集成可能如下所示：

```python
from markitdown import MarkItDown
from openai import OpenAI

## 初始化 OpenAI 客户端
client = OpenAI()

## 配置 MarkItDown 以支持 LLM 功能
md = MarkItDown(
    llm_client=client,
    llm_model="gpt-4o-mini"
)

## 使用 LLM 驱动的描述处理图像
result = md.convert("diagram.jpg")
enhanced_content = result.text_content
```
上述示例初始化了 *OpenAI* 客户端，然后 *MarkItDown* 被配置为使用 *gpt-4 模型*。在这种情况下，我们不是将文档转换为 Markdown，而是请求 Gpt 提供图像的 Markdown 文本描述。这有什么意义？想象一下，你想创建一个简单的 **图像到图像管道**，你可以输入 (1) 图像 (2) 以及文本 (用户输入) 的更改描述。通过将图像描述和用户文本更改（都转换为 Markdown）连接在一起，你可以将其传递给图像生成模型并获得最终结果。

你还可以以这种方式创建一个 **文档分析管道**：

```python
from markitdown import MarkItDown
import glob

def process_document_library():
    md = MarkItDown()
    documents = glob.glob("./documents/*.*")
    
    processed_docs = []
    for doc in documents:
        result = md.convert(doc)
        processed_docs.append(result.text_content)
    
    return processed_docs
```
上述简单函数可以处理文件夹中的所有文档，并获取 Markdown 文本以传递给模型进行任何类型的操作，如摘要、实体提取、训练等。

我想到的一个潜在应用是 **“LLM 上下文提供者”。** 特别是创建一个函数（在下面的案例中是一个包含 3 个函数的类），将 LLM 响应与提供的文档关联起来。

```python
from markitdown import MarkItDown

class DocumentContextProvider:
    def __init__(self):
        self.md = MarkItDown()
    
    def get_context(self, document_path):
        result = self.md.convert(document_path)
        return result.text_content

    def prepare_llm_prompt(self, document_path, query):
        context = self.get_context(document_path)
        return f"Context:\n{context}\n\nQuery: {query}"
```
让我们回顾一下这个简单类是如何工作的：*DocumentContextProvider* 类充当文档处理与 LLM 交互之间的桥梁，实现了一个关键模式，以便提供有依据的响应。

1\- 构造函数初始化了一个 *MarkItDown* 实例，该实例将处理所有文档转换。该实例在对象的生命周期内保持状态。

2\- 该方法处理任何支持的文档格式并提取其内容为 Markdown 格式，使其适合 LLM 消费。

### 增强的实现与 OpenAI LLM 集成

这是一个扩展版本，使用 **OpenAI API** 实现了这种基础技术：

```python
## Ensure to install MarkItDown and tiktoken before importing libraries
## and you have your ownn OpenAI API key
api_key = 'xxxxxxx'

from markitdown import MarkItDown
from openai import OpenAI
import tiktoken
import nest_asyncio
import asyncio
import os

## Enable nested asyncio for Jupyter
nest_asyncio.apply()

class AdvancedDocumentContextProvider:
    def __init__(self, api_key, model_name="gpt-4o-mini"):
        self.md = MarkItDown()
        self.client = OpenAI(api_key=api_key)  # Pass API key directly
        self.model_name = model_name
        self.encoder = tiktoken.encoding_for_model(model_name)
        
    def get_context(self, document_path):
        result = self.md.convert(document_path)
        return result.text_content
    
    def truncate_context(self, context, max_tokens=3000):
        tokens = self.encoder.encode(context)
        if len(tokens) > max_tokens:
            tokens = tokens[:max_tokens]
            context = self.encoder.decode(tokens)
        return context
    
    def prepare_prompt(self, context, query):
        system_prompt = """You are an AI assistant that answers questions based on the provided context. 
        Always ground your responses in the given context and cite relevant parts of the context in your answer."""
        
        return {
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {query}"}
            ]
        }
    
    async def get_grounded_response(self, document_path, query):
        # Get and process context
        context = self.get_context(document_path)
        context = self.truncate_context(context)
        
        # Prepare the prompt
        prompt = self.prepare_prompt(context, query)
        
        # Get response from LLM
        response = await self.client.chat.completions.create(
            model=self.model_name,
            messages=prompt["messages"],
            temperature=0.7,
            max_tokens=1000
        )
        
        return response.choices[0].message.content

async def main():
    # Initialize the provider
    provider = AdvancedDocumentContextProvider(api_key=api_key)
    
    # Example document and query
    document_path = "/content/NVIDIA.pdf"
    query = "Can you tell me how Nvidia performed in Q4 2024?"
    
    # Get grounded response
    response = await provider.get_grounded_response(document_path, query)
    print(response)

## Run the async function
asyncio.run(main())
```
上述完整实现利用 **OpenAI** *gpt\-4o\-mini* 模型，将解析后的文档与用户的查询一起传递。在这个例子中，我下载了 NVIDIA 的财报 PDF，并询问模型关于 2024 年第四季度的表现。该代码可在 **Jupyter notebook** 中运行，便于测试。

### Gemini 2\.0 Flash 实现

我们直接创建一个与上述相同工作流程的简单实现，但这次我们利用谷歌最新的突破性模型：[Gemini 2\.0 Flash](https://ai.google.dev/gemini-api/docs/models/gemini#gemini-2.0-flash)。

这里是导入库和创建类的代码：

```python
from google.generativeai import GenerativeModel
import google.generativeai as genai
import os
from markitdown import MarkItDown

class GeminiDocumentProvider:
    def __init__(self, api_key):
        genai.configure(api_key=api_key)
        self.model = GenerativeModel('gemini-2.0-flash-exp')
        self.md = MarkItDown()
    
    def get_context(self, document_path):
        result = self.md.convert(document_path)
        return result.text_content
    
    def get_grounded_response(self, document_path, query):
        context = self.get_context(document_path)
        
        prompt = f"""Context: {context}
        Question: {query}
        Answer based on the context provided."""
        
        response = self.model.generate_content(prompt)
        return response.text
```
确保在继续之前从 <https://aistudio.google.com/app/apikey> 获取您的免费 API 密钥。

```python
## Set your API key
api_key = "xxxxxx"

## Initialize provider
provider = GeminiDocumentProvider(api_key)

## Process document
document_path = "/content/NVIDIA.pdf"
query = "How went the NVIDIA earning in Q4 2024? What about the operational margin?"
response = provider.get_grounded_response(document_path, query)
print(response)
```
在这个例子中，我通过 *MarkItDown* 将 NVIDIA 财报的 PDF 文件传递给 LLM，并询问有关最新财务结果和运营利润的具体问题。我将分享我从这一迭代中得到的结果：

```python
Okay, here's a breakdown of NVIDIA's Q4 2024 earnings and operational margin based on the provided text:

**Q4 2024 Earnings Performance:**

*   **Record Revenue:** NVIDIA achieved a record quarterly revenue of **$22.1 billion**, which represents a **22% increase from the previous quarter (Q3)** and a massive **265% increase from the same quarter last year (Q4 2023)**.
*   **Record Data Center Revenue:** The Data Center segment also saw record revenue of **$18.4 billion**, a **27% increase from Q3** and a staggering **409% increase year-over-year**.
*   **GAAP Earnings Per Diluted Share:**  GAAP earnings per diluted share were **$4.93**, up **33% from Q3** and up **765% from Q4 2023**.
*  **Non-GAAP Earnings Per Diluted Share**: Non-GAAP earnings per diluted share was **$5.16**, up **28% from Q3** and up **486% from Q4 2023**.

**Operational Margin:**

The text provides information on operating income and revenue, which we can use to derive the operational margin. Note that this calculation can be done based on both GAAP and non-GAAP values.

*   **GAAP Operating Income:** The Q4 GAAP operating income was **$13.615 billion.** 
*   **GAAP Operational Margin Calculation:**  ($13.615B / $22.103B) * 100%  = **61.6%**
*   **Non-GAAP Operating Income:** The Q4 Non-GAAP operating income was **$14.749 billion**
*    **Non-GAAP Operational Margin Calculation:** ($14.749B / $22.103B) * 100% =  **66.7%**

**In Summary:**

NVIDIA had a very strong Q4 2024. It achieved record revenues and significant growth in both revenue and earnings per share.  The operational margin was also quite high, especially when looking at Non-GAAP metrics. 

It is worth noting that the text highlights the significant growth in the Data Center segment, which is a major contributor to NVIDIA's overall success. Also, it notes that "Accelerated computing and generative AI have hit the tipping point".
```
这是一个简单有效的示例，展示了如何利用手头的 PDF 文档为 LLM 模型提供基础。

我还在 GitHub 上创建了一个包含 Gemini 工作流程的仓库，您可以在本地计算机上尝试和测试：

[manuelec/gemini\-markitdown: A Python toolkit combining Google’s Gemini 2\.0 Flash model with MarkItDown for intelligent document processing](https://github.com/manuelec/gemini-markitdown)

希望您喜欢阅读并测试代码。如果是的话，鼓掌并关注以获取更多内容。



