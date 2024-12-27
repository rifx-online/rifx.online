---
title: "如何使用 Streamlit 和 Llama 3.2-Vision 构建自己的 OCR 助手"
meta_title: "如何使用 Streamlit 和 Llama 3.2-Vision 构建自己的 OCR 助手"
description: "本文介绍了如何使用Streamlit和Llama 3.2-Vision构建OCR助手。OCR技术用于将图像中的文本转换为可编辑数据，具有自动化数据录入和数字化记录的应用价值。Llama 3.2-Vision以其高准确性和高级格式化能力，成为OCR任务的优选模型。文章提供了详细的步骤，包括安装Ollama、设置开发环境、运行OCR应用程序等，帮助用户快速搭建功能齐全的OCR工具，并探讨了潜在的应用和改进方向。"
date: 2024-12-27T10:58:08Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*f0fXSegk9ihTiWEo0TB2eg.png"
categories: ["Programming", "Technology", "Computer Vision"]
author: "Rifx.Online"
tags: ["OCR", "Streamlit", "Llama", "Vision", "text-extraction"]
draft: False

---





### 通过示例学习

OCR（光学字符识别）是一种帮助自动化将图像转换为文本的工具。你一定在手机上使用过它，因为现在它非常普遍。从数字化文档到自动化业务工作流程，OCR 是许多现代解决方案的核心。在本指南中，我们将引导您使用 Streamlit、Llama 3\.2\-Vision 和 Ollama 创建一个简单但强大的 OCR 助手，因为为什么不参与机器学习模型的竞争呢。有趣的是，不仅可以从图像中获取文本，还可以对其进行总结或修改提示，以从模型中获取您想要的内容。

到最后，您将拥有一个功能齐全的 OCR 工具，可以用来分析图像中的可见文本——此外，您还将了解正在重塑机器学习的前沿技术。

## 什么是OCR，以及为什么使用Llama 3.2-Vision？

## 什么是OCR？

OCR是一种将不同类型的文档——扫描的纸质文档、文档照片或包含文本的图像——转换为可编辑和可搜索数据的技术。以下是其重要性：

* **自动化数据录入**：从扫描的表单或发票中提取文本。
* **数字化记录**：将旧书籍或文件转换为数字文件。
* **可搜索文档**：使基于图像的PDF可搜索且易于导航。

## 为什么选择 Llama 3\.2\-Vision 进行 OCR？

Llama 3\.2\-Vision 是一个复杂的视觉模型，提供：

* **高准确性**：特别是在处理复杂图像或文档时。
* **高级格式化**：它能够比传统的 OCR 模型更好地保持文本结构和格式。
* **适应性**：与本地服务器设置无缝集成，以实现高效的图像处理。

## 构建您的 OCR 助手的逐步指南

首先，确保您克隆该仓库：[https://github.com/MinimalDevops/llama\-ocr.git](https://github.com/MinimalDevops/llama-ocr.git)

```python
git clone https://github.com/MinimalDevops/llama-ocr.git
cd llama-ocr
```

## 1\. 安装 Ollama 和 Llama 3\.2\-Vision

要使用 Llama 3\.2\-Vision，我们需要 Ollama，这是一个用于运行机器学习模型的本地服务。

**安装 Ollama**：

```python
curl -sSfL https://ollama.com/download | sh
```
**安装 Llama 3\.2\-Vision**：

```python
ollama pull llama3.2-vision
```
此命令拉取 Llama 3\.2\-Vision 模型，使其可供您的服务器访问。

注意：所有这些模型都需要良好的内存和 CPU。如果有 GPU，那就更好了。

## 2\. 设置您的开发环境

使用虚拟环境可以避免 Python 包之间的冲突。

**创建虚拟环境**：

```python
python -m venv venv
source venv/bin/activate 
```
**激活环境**：

* **Windows**: `venv\Scripts\activate`
* **macOS/Linux**: `source venv/bin/activate`

## 3\. 安装依赖

为了简单起见，使用 `requirements.txt` 文件来安装所有必要的包：

**安装依赖**：

```python
pip install -r requirements.txt
```
依赖包括：

* `streamlit` 用于网页界面
* `requests` 用于发送 HTTP 请求
* `Pillow` 用于图像处理

## 4\. 运行 Ollama 服务器

要使用 Llama 3\.2\-Vision 进行 OCR，您需要启动 Ollama 服务器：

```python
ollama serve
```
检查模型是否正在运行：

```python
ollama ps
```
如果没有，则运行它：

```python
ollama run llama3.2-vision
```
这将在本地启动服务器，使其可用于处理请求，地址为 [`http://localhost:11`434\.](http://localhost:11434.)

## 5\. 运行 Streamlit OCR 应用程序

现在一切都已设置完毕，是时候运行作为 OCR 界面的 Streamlit 应用程序了：

**启动应用程序**：

```python
streamlit run ocr_app.py
```
**使用界面**：

* 上传一张图像（JPG、JPEG 或 PNG）。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*_R_KVy594ccqtjtChDxPyg.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*SaAZDtQs6W7_ykHdQPPK9w.png)

* 点击“运行 OCR”按钮以提取文本。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*so73Gj_zYHANoW2EwDdrDQ.png)

***注意****：我正在运行 11B 参数模型。*

## 现实世界的应用

* **数字化旧记录**：扫描手写笔记或书籍。
* **自动化数据收集**：从收据或文件中提取数据以优化工作流程。

## 故障排除常见问题

## 1\. 服务器连接问题

* **404 错误**：在尝试使用 OCR 功能之前，请确保 Ollama 服务器正在运行。
* **无法连接**：检查端点 `http://localhost:11434` 是否可访问。确保没有防火墙或网络问题。

## 2\. 依赖问题

* **缺失的包**：始终激活您的虚拟环境，并使用 `pip install -r requirements.txt` 安装依赖项。
* **版本冲突**：确保 Python 版本为 3\.8 或更高，以避免兼容性问题。

**恭喜您**！您已使用 Streamlit 和 Llama 3\.2\-Vision 构建了自己的 OCR 助手。您取得了以下成就：

* 安装并设置了 Ollama 和 Llama 3\.2\-Vision。
* 创建了一个虚拟环境并安装了所有必要的包。
* 构建了一个功能齐全的 OCR 工具来分析图像中的文本。

这只是一个开始！您可以通过以下方式进一步改进应用程序：

* **添加更多模型**：尝试其他 OCR 模型。
* **在云端部署**：使其可以通过互联网访问，以便更广泛的使用。
* **修改提示以实现奇迹**：修改提示以根据您的需求获取摘要，获取图像中文本的更多细节等等。

> 逐行代码解释请参见 [readme.](https://github.com/MinimalDevops/llama-ocr/blob/main/README.md)

如果您不喜欢编码和玩耍，可以使用 LM Studio。

* 加载模型，例如“Llava Phi 3 mini”

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Uca_g_NkViZkwyqLfe8_3w.png)

* 在聊天中上传图像，并使用聊天提示获取相同的信息

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ULFp1mq6CRPF9p3_pY5JIA.png)

此外，如果您喜欢编码，我们可以在下一篇 [博客](https://readmedium.com/how-to-build-your-own-ocr-assistant-with-streamlit-and-llava-phi-450df3966bb3) 中使用 LM Studio API 从 Llava Phi 获取相同的结果！这是必读的内容！

我们很想听听您的体验以及您所做的任何自定义——请随时分享！

