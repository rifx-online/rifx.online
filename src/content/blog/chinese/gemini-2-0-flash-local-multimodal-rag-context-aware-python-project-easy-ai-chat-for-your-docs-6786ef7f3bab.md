---
title: "Gemini 2.0 Flash + 本地多模式 RAG + 上下文感知 Python 项目：文档的简易人工智能/聊天"
meta_title: "Gemini 2.0 Flash + 本地多模式 RAG + 上下文感知 Python 项目：文档的简易人工智能/聊天"
description: "Gemini 2.0 Flash 是谷歌推出的低延迟、高性能的多模态 AI 模型，支持图像、视频和音频输入输出。该模型在基准测试中表现优异，速度提升至两倍，适合构建快速响应的聊天机器人。通过结合多模态 RAG 和上下文感知响应，用户可以创建强大的文档分析和问答系统，处理 PDF 文件并生成相应的答案。该项目展示了使用 Python 构建高效 AI 应用程序的过程，强调了 Gemini 2.0 Flash 在 AI 代理领域的潜力。"
date: 2024-12-22T03:46:35Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*5mhjGURhXDnPnulgwr8d7g.png"
categories: ["Programming", "Chatbots", "Generative AI"]
author: "Rifx.Online"
tags: ["Gemini", "RAG", "multimodal", "embeddings", "chatbot"]
draft: False

---





在这个视频中，我将展示一个超级快速的教程，教你如何创建一个本地多模态 RAG、Gemini 2\.0 Flash 和上下文感知响应，以便为你的业务或个人使用打造一个强大的代理聊天机器人——一个不需要强大笔记本电脑的聊天机器人。

年末时，大模型产品之间的竞争再次加剧。在我上一个视频中，我介绍了 LLama3\.3\。

在12月11日，谷歌发布了 **Gemini 2\.0 Flash。** 正如模型名称所暗示的，它具有低延迟和高性能，谷歌计划将其作为谷歌相关产品大规模应用的核心引擎。

Gemini 1\.5 Flash 在开发者中备受欢迎。在 Gemini 2\.0 Flash 的成功基础上，它在保持快速响应时间的同时提供了更好的性能。值得注意的是，新模型在关键基准测试中以两倍的速度超越了 2\.0 Pro。

它引入了扩展的功能，包括支持多模态输入，如图像、视频和音频，以及多模态输出，如与 AI 生成的图像和处理过的多语言文本转语音（TTS）音频配对的文本。该 AI 模型还可以原生调用工具，如谷歌搜索，以执行代码并访问用户定义的第三方函数。

多模态 RAG 允许 RAG 系统将多种形式的信息注入到多模态模型中，使系统能够根据用户提示和文本、图像、视频及其他不同模态的数据检索文本片段。

各位，如果你想了解更多关于多模态 RAG 的信息，我有一个关于 CoPali 和 Ollama OCR 的精彩视频。内容解释得很好，并且易于理解。在这个视频中，我们以编程的方式使用 CoPali 的相同概念。

所以，让我给你快速演示一个实时聊天机器人，向你展示我的意思。

我将上传一个包含表格和图表的 PDF，然后问聊天机器人一个问题：总结这个 PDF。随意问任何你想问的问题。如果你观察聊天机器人生成输出的方式，你会看到它首先使用 PyMuPDF 和 Pillow 将 PDF 页面转换为图像。它处理每一页，调整分辨率，将其转换为 PNG，并生成嵌入，同时内置速率限制以确保遵守 API 限制，在超过限制时进行重试。

然后，它通过在 DataFrame 中识别与给定查询最相关的段落来回答用户问题，并使用点积计算嵌入相似度。代理遵循基于文本的指令，以确保为嵌入和检索任务设计精确的摘要。另一个代理分析页面，以避免遗漏信息或虚构细节，然后生成输出。

## 开始之前！🦸🏻‍♀️

如果你喜欢这个主题并想支持我：

1. **点赞**我的文章50次，这对我真的很有帮助。👏
2. [**关注**](https://medium.com/@mr.tarik098)我在Medium上的账号，并订阅以免费获取我的最新文章🫶
3. 加入这个大家庭 — 订阅[**YouTube频道**](https://www.youtube.com/channel/UC6P5WCWjqhhXVFBqbJHNxyw)

在这个视频中，我将解释什么是Gemini 2\.0 Flash和上下文感知响应，Gemini 2\.0 Flash的特点是什么，以及如何使用Gemini 2\.0 Flash、本地多模态RAG和上下文感知响应创建一个强大的聊天机器人。

## 什么是 Gemini 2\.0 Flash

Gemini 2\.0 Flash 是一个轻量级模型，是 Gemini 1\.5 Flash 的继任者。

轻量级模型通常被认为是“便宜”和“快速”的，但它们的响应准确性通常低于重型模型。

本质上，当不需要重型模型的高响应准确性时，它是降低成本和延迟的一个选择。Gemini 2\.0 Flash 不仅仅是一个知识库，它还允许 Gemini 2\.0 自主获取信息和处理任务。

## 特性

此次发布的 Gemini 2\.0 Flash 实验版本的核心升级如下：

* **速度和性能的突破**：Gemini 2\.0 Flash 在关键基准测试中优于 Gemini 1\.5 Pro，响应速度提高了两倍。
* **多模态输出**：支持原生生成文本、音频和图像，实现更复杂的交互。
* **智能工具使用**：模型经过训练能够使用 Google 搜索和代码执行等工具，增强获取信息和执行任务的能力。

如下图所示，Gemini 2\.0 Flash 在多个基准测试中表现出色，甚至超过了 Gemini 1\.5 Pro。这些特性使得 Gemini 2\.0 Flash 不仅是一个更快的版本，也是一个强大的平台，能够提供智能交互，适合复杂任务处理和实时响应。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*-B3LGfzIziCpLK9rZpJaDg.gif?output=gif&n=50)

## 什么是上下文感知的响应？

上下文感知对人工智能代理至关重要，因为如果我们希望它们高效地使用我们脑中所拥有的知识来给出输出，它们就需要理解我们已经拥有的上下文。手动输入思考会增加工作量，因此有不同的方法来收集需要考虑的上下文。

上下文感知通过确保人工智能输出不仅在技术上准确，而且在上下文上也适当，从而增强了输出的相关性和质量。

## 让我们开始编码

现在，让我们继续关于如何使用 Gemini 2.0 Flash + 多模态 RAG + 上下文感知构建 AI 聊天机器人的指南。在创建这个聊天机器人时，我们将为代码的运行创建一个理想的环境。我们需要安装必要的 Python 库。为此，我们将对以下库进行 pip 安装。

```python
pip install -r requirements.txt
```
安装完成后，我们导入重要的依赖项，如

rate-limit 用于控制网络接口控制器发送或接收请求的速率，Fitz 用于解析 PDF，拆分和合并 PDF，以及 google 用于处理 API。

```python
import os
import numpy as np
import pandas as pd
from tqdm import tqdm
from typing import List, Dict
from google import genai
from google.genai import types
import textwrap
from dataclasses import dataclass
from PIL import Image
import time
from ratelimit import limits, sleep_and_retry
import fitz
import io
from dotenv import load_dotenv
import streamlit as st
```
让我们创建 `Config` 类，以提供一种简单且结构化的方式来管理应用程序设置。我使用默认值来设置关键参数，如模型名称、文本嵌入模型 ID 和图像分辨率。

```python
@dataclass
class Config:
    """应用程序的配置类"""
    MODEL_NAME: str = "gemini-2.0-flash-exp"  # 更新以匹配 Google 的示例
    TEXT_EMBEDDING_MODEL_ID: str = "text-embedding-004"  # 正确的嵌入模型名称
    DPI: int = 300  # PDF 转图像的分辨率
```
我们创建一个 pdf\_to\_images 函数在 `PDFProcessor` 中，将 PDF 页面转换为高质量图像，使用 PyMuPDF 和 Pillow。它处理每一页，调整分辨率，将其转换为 PNG 字节流，并返回用于进一步分析的 PIL 图像列表。该方法灵活，支持 DPI 调整，适用于文档分析或基于视觉的 AI 模型。

```python
class PDFProcessor:
    """使用 PyMuPDF 和 Gemini 的视觉能力处理 PDF"""
    
    @staticmethod
    def pdf_to_images(pdf_path: str, dpi: int = Config.DPI) -> List[Image.Image]:
        """将 PDF 页面转换为 PIL 图像"""
        images = []
        pdf_document = fitz.open(pdf_path)
        
        for page_number in range(pdf_document.page_count):
            page = pdf_document[page_number]
            pix = page.get_pixmap(matrix=fitz.Matrix(dpi/72, dpi/72))
            
            # 将 PyMuPDF pixmap 转换为 PIL 图像
            img_data = pix.tobytes("png")
            img = Image.open(io.BytesIO(img_data))
            images.append(img)
            
        pdf_document.close()
        return images
```
接下来，我们创建另一个类 `GeminiClient`，以便与 Gemini API 进行交互，执行文本摘要和图像分析等任务。初始化 Gemini API 以创建 `GeminiClient` 实例。接下来，我们定义一个 `make_prompt` 函数，以生成基于文本的指令供 Gemini API 使用，以确保摘要是精确的，并且设计用于嵌入和检索任务。我们还实现了 `analyze_page` 函数，以处理和总结 PDF 页面图像。这确保摘要针对嵌入和检索进行了优化，同时避免了虚构的细节，例如不存在的数字。

```python
class GeminiClient:
    """处理与 Gemini API 的交互"""
    
    def __init__(self, api_key: str):
        if not api_key:
            raise ValueError("需要 API 密钥")
        
        # 按照 Google 的示例初始化客户端
        self.client = genai.Client(api_key=api_key)
        
    def make_prompt(self, element: str) -> str:
        """为摘要创建提示"""
        return f"""您是一个代理，负责总结研究论文中的研究表格和文本以便检索。
                  这些摘要将被嵌入并用于检索原始文本或表格元素。
                  请对表格或文本进行简明扼要的总结，以便优化检索。
                  表格或文本: {element}"""

    def analyze_page(self, image: Image.Image) -> str:
        """使用 Gemini 的视觉能力分析 PDF 页面"""
        prompt = """您是一个助手，负责总结图像以便检索。
                   这些摘要将被嵌入并用于检索原始图像。
                   请对图像进行简明扼要的总结，以便优化检索。
                   如果是表格，请提取表格的所有元素。
                   如果是图形，请解释图形中的发现。
                   如有必要，请包含有关颜色、比例和形状的细节以描述图像。
                   准确提取页面中的所有文本内容。
                   不要包含图像中未提到的任何数字。"""
        
        try:
            response = self.client.models.generate_content(
                model=Config.MODEL_NAME,
                contents=[prompt, image]
            )
            return response.text if response.text else ""
        except Exception as e:
            print(f"分析页面时出错: {e}")
            return ""
```
因此，我们创建 `create_embeddings` 函数以生成嵌入，内置速率限制以确保遵守 API 限制，如果超出限制则重试。并且 `find_best_passage` 函数用于通过计算嵌入相似性（使用点积）来识别给定查询在 DataFrame 中的最相关段落，并实现错误处理以确保可靠执行。这些函数结合了错误处理，旨在用于语义搜索和文档检索等应用，确保高效的 API 使用和可靠的结果。

```python
@sleep_and_retry
@limits(calls=30, period=60)
def create_embeddings(self, data: str):
    """创建带有速率限制的嵌入 - 完全按照 Google 的示例"""
    time.sleep(1)
    return self.client.models.embed_content(
        model=Config.TEXT_EMBEDDING_MODEL_ID,
        contents=data,
        config=types.EmbedContentConfig(task_type="RETRIEVAL_DOCUMENT")
    )

def find_best_passage(self, query: str, dataframe: pd.DataFrame) -> dict:
    """为查询找到最相关的段落"""
    try:
        query_embedding = self.client.models.embed_content(
            model=Config.TEXT_EMBEDDING_MODEL_ID,
            contents=query,
            config=types.EmbedContentConfig(task_type="RETRIEVAL_QUERY")
        )
        
        dot_products = np.dot(np.stack(dataframe['Embeddings']), 
                            query_embedding.embeddings[0].values)
        idx = np.argmax(dot_products)
        content = dataframe.iloc[idx]['Original Content']
        return {
            'page': content['page_number'],
            'content': content['content']
        }
    except Exception as e:
        print(f"查找最佳段落时出错: {e}")
        return {'page': 0, 'content': ''}
```
然后我们创建 `make_answer_prompt` 函数，以便代理以友好的方式回答问题。它清理段落，并帮助代理给出易于理解的答案，非常适合以任何人都能理解的方式解释研究。

```python
def make_answer_prompt(self, query: str, passage: dict) -> str:
    """为回答问题创建提示"""
    escaped = passage['content'].replace("'", "").replace('"', "").replace("\n", " ")
    return textwrap.dedent("""您是一个乐于助人且信息丰富的机器人，使用下面包含的参考段落中的文本回答问题。
                             您正在回答有关研究论文的问题。
                             请确保以完整的句子回答，全面涵盖所有相关背景信息。
                             但是，您是在与非技术受众交谈，因此请确保简化复杂的概念，
                             并保持友好和对话的语气。
                             如果段落与答案无关，您可以忽略它。
                             
                             问题: '{query}'
                             段落: '{passage}'
                             
                             答案:
                          """).format(query=query, passage=escaped)
```
最后，我们定义 `RAGApplication` 类，以处理 PDF，提取并分析每页的内容，利用 Gemini 的视觉能力，然后为文档检索、摘要和语义搜索生成嵌入。它使用 API 密钥初始化以创建一个 GeminiClient，并设置一个空的 DataFrame。`process_pdf` 方法检查 PDF 是否存在，将其页面转换为图像，分析它们并存储结果。如果未找到内容，则引发错误。该方法随后为提取的内容生成嵌入并将其存储在 DataFrame 中。集成了错误处理以确保平稳处理。

```python
class RAGApplication:
    """主要 RAG 应用程序类"""
    
    def __init__(self, api_key: str):
        self.gemini_client = GeminiClient(api_key)
        self.data_df = None
        
    def process_pdf(self, pdf_path: str):
        """使用 Gemini 的视觉能力处理 PDF"""
        if not os.path.exists(pdf_path):
            raise FileNotFoundError(f"未找到 PDF 文件: {pdf_path}")
            
        # 将 PDF 页面转换为图像
        images = PDFProcessor.pdf_to_images(pdf_path)
        
        # 分析每一页
        page_contents = []
        page_analyses = []
        
        st.write("分析 PDF 页面...")
        for i, image in enumerate(tqdm(images)):
            content = self.gemini_client.analyze_page(image)
            if content:
                # 存储分析和内容
                page_contents.append({
                    'page_number': i+1,
                    'content': content
                })
                page_analyses.append(content)
        
        if not page_analyses:
            raise ValueError("无法从 PDF 中提取任何内容")
            
        # 创建数据框
        self.data_df = pd.DataFrame({
            'Original Content': page_contents,
            'Analysis': page_analyses
        })
        
        # 生成嵌入
        st.write("\n生成嵌入...")
        embeddings = []
        try:
            for text in tqdm(self.data_df['Analysis']):
                embeddings.append(self.gemini_client.create_embeddings(text))
        except Exception as e:
            print(f"生成嵌入时出错: {e}")
            time.sleep(10)
            
        _embeddings = []
        for embedding in embeddings:
            _embeddings.append(embedding.embeddings[0].values)
            
        self.data_df['Embeddings'] = _embeddings
```
然后我们创建一个 answer\_questions 函数，以便回答一系列问题，首先检查 PDF 数据是否已加载。对于每个问题，它从 PDF 中找到最相关的段落，为 Gemini 的模型创建提示，并生成答案。答案及其来源信息存储在列表中。如果发生任何错误，则添加错误消息。该方法返回答案及其来源的列表。

```python
def answer_questions(self, questions: List[str]) -> List[Dict[str, str]]:
        """使用处理过的数据回答一系列问题"""
        if self.data_df is None:
            raise ValueError("请先使用 process_pdf() 处理 PDF")

        answers = []
        for question in questions:
            try:
                passage = self.gemini_client.find_best_passage(question, self.data_df)
                prompt = self.gemini_client.make_answer_prompt(question, passage)
                response = self.gemini_client.client.models.generate_content(
                    model=Config.MODEL_NAME,
                    contents=prompt
                )
                answers.append({
                    'question': question,
                    'answer': response.text,
                    'source': f"第 {passage['page']} 页\n内容: {passage['content']}"
                })
            except Exception as e:
                print(f"处理问题 '{question}' 时出错: {e}")
                answers.append({
                    'question': question,
                    'answer': f"生成答案时出错: {str(e)}",
                    'source': "错误"
                })

        return answers
```
所以，我们在这个 Streamlit 应用中创建了 `main()` 函数，允许用户上传 PDF，输入问题，并通过 `RAGApplication` 类使用 Gemini API 处理 PDF 并提供答案。该过程包括加载环境变量、处理 API 密钥验证以及使用表单收集用户输入。该应用使用错误处理以确保平稳操作，在整个工作流程中向用户显示清晰的信息。此设置使得文档分析和从 PDF 中回答问题的过程更加用户友好。

```python
def main():
    # 加载环境变量
    load_dotenv()

    # 页面标题
    st.set_page_config(page_title='🦜🔗 Ask the Doc App')
    st.title('🦜🔗 Ask the Doc App')
    
    # 获取 API 密钥
    api_key = os.getenv('GOOGLE_API_KEY')
    alternative_names = ['GEMINI_API_KEY', 'GOOGLE_GEMINI_KEY', 'GEMINI_KEY']
    for name in alternative_names:
        if not api_key:
            api_key = os.getenv(name)
            if api_key:
                st.write(f"在 {name} 中找到 API 密钥")

    if not api_key:
        raise ValueError("请设置 GOOGLE_API_KEY 环境变量。")

    # 测试 API 密钥
    try:
        test_client = genai.Client(api_key=api_key)
        test_response = test_client.models.generate_content(
            model="gemini-2.0-flash-exp",
            contents="你好，这是一个测试消息。"
        )
        st.write("API 密钥正常工作！", test_response.text)
    except Exception as e:
        st.write(f"API 测试失败: {e}")
        raise ValueError("无效的 API 密钥。")

    # 表单
    with st.form(key="stimy_form"):
        pdf_path = st.file_uploader("上传 PDF 文件", type=["pdf"])  
        questions = st.text_input('输入您的问题:', placeholder='请提供简短的总结。')
        submit_button = st.form_submit_button(label="提交")

    if submit_button and pdf_path and questions:
        try:
            # 将上传的 PDF 保存到临时文件
            temp_pdf_path = f"temp_{pdf_path.name}"
            with open(temp_pdf_path, "wb") as f:
                f.write(pdf_path.getbuffer())
            
            # 初始化应用
            app = RAGApplication(api_key)
            
            # 处理 PDF 并回答问题
            st.write(f"正在处理 PDF: {pdf_path.name}")
            with st.spinner("思考中..."):
                app.process_pdf(temp_pdf_path)
                answers = app.answer_questions(questions)

            # 显示答案
            for result in answers:
                st.write(f"问题: {result['question']}")
                st.write(f"答案: {result['answer']}")
                st.write(f"来源: {result['source']}")
                st.write("-" * 80)
        except Exception as e:
            st.write(f"发生错误: {e}")

if __name__ == "__main__":
    main()
```

## 结论：

Gemini 2\.0 Flash 帮助您构建更快、更强大的 AI 应用程序，进一步推动智能代理时代的到来。当然，Gemini 2\.0 Flash 并不是第一个代理模型。像 Claude 3\.5 Sonnet 和 GPT\-4o 这样的模型在 AI 代理领域取得了强劲的成果。Gemini 2\.0 Flash 的发布意味着谷歌正式加入了激烈的 AI 代理竞争。

作为 AI 代理的忠实粉丝，我仍然期待 Gemini 2\.0 Flash 官方版本的早日发布，想看看谷歌的 AI 代理将会有多强大。我想知道我们的 AI 代理军团是否会再添一位强大的成员。

> ***🧙‍♂️ 我是一名 AI 生成专家！如果您想在项目上合作，请在此处提交 [咨询请求](https://docs.google.com/forms/d/e/1FAIpQLSelxGSNOdTXULOG0HbhM21lIW_mTgq7NsDbUTbx4qw-xLEkMQ/viewform) 或与我预约 [1 对 1 咨询](https://calendly.com/gao-dalie/ai-consulting-call) 电话。***

*📚欢迎查看我的其他文章：*

