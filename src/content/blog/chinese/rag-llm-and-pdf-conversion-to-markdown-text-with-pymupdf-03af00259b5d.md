---
title: "RAG/LLM 和 PDF：使用 PyMuPDF 转换为 Markdown 文本"
meta_title: "RAG/LLM 和 PDF：使用 PyMuPDF 转换为 Markdown 文本"
description: "采用 markdown 文本格式输入数据可提高生成的文本质量"
date: 2024-10-24T17:47:43Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*swPjVuudAhsoRiiw3Ee32w.png"
categories: ["Programming", "Technology", "Technology/Web"]
author: "Rifx.Online"
tags: ["markdown", "PyMuPDF", "LLM", "RAG", "PDF"]
draft: False

---



### 以Markdown文本格式输入数据可以提高生成文本的质量



## 介绍

在**大型语言模型（LLMs）**和**检索增强生成（RAG）**环境中，以**markdown文本格式**输入数据具有**重要意义**。以下是一些详细考虑因素。

**LLMs** 是强大的语言模型，可以生成连贯且具有上下文相关性的文本。然而，它们有时可能会产生缺乏事实准确性或上下文的响应。通过结合基于检索的方法（如RAG），我们可以提高生成文本的质量。

**RAG** 使得将**外部数据**——在LLM的训练数据中之前缺失的数据——整合到文本生成过程中成为可能。这种包含减少了“幻觉问题”，并增强了文本响应的相关性。

## 为什么选择 Markdown 用于 LLM？

**Markdown** 是一种轻量级标记语言，允许用户使用简单的语法格式化纯文本。它广泛用于创建结构化文档，特别是在 GitHub、Jupyter 笔记本和各种内容管理系统上。当将数据输入到 LLM 或 RAG 系统时，使用 Markdown 格式提供了几个好处：

1. **结构化内容**：Markdown 允许您将信息组织成标题、列表、表格和其他结构化元素。这种结构有助于更好地理解和上下文保留。
2. **富文本**：Markdown 支持基本格式，如粗体、斜体、链接和代码块。在输入数据中包含富文本可以增强语言模型的上下文。
3. **嵌入链接和引用**：Markdown 允许您嵌入超链接、脚注和引用。在 RAG 场景中，这对于引用外部来源或提供额外上下文至关重要。
4. **易于创作**：Markdown 具有可读性，易于编写。作者可以高效地创建内容，而无需复杂的格式化工具。
5. **分块**：对于 RAG 系统至关重要，分块（也称为“拆分”）将大量文档拆分为更易处理的部分。通过支持 MD 格式的 PyMuPDF 数据提取，我们支持分块以保持具有共同上下文的文本在一起。**重要的是，MD 格式的 PyMuPDF 提取允许进行 [第 3 级分块](https://readmedium.com/five-levels-of-chunking-strategies-in-rag-notes-from-gregs-video-7b735895694d#b123)**。

总之，在 LLM 和 RAG 环境中使用 Markdown 文本格式可以确保更准确和相关的结果，因为它提供了更丰富的数据结构和更相关的数据块负载给您的 LLM。

## PyMuPDF 支持 PDF 的 Markdown 转换

自推出以来，PyMuPDF 一直能够从 PDF 页面中提取文本、图像、矢量图形，并且从 2023 年 8 月起，还能够提取表格。这些对象类型各自有其提取方法：文本有一种，表格、图像和矢量图形则有其他方法。为了满足 RAG 的要求，我们将这些不同的提取方式合并，生成一个统一的 **Markdown** 字符串，以一致地表示页面的整体内容。

所有这些都实现为 [一个 Python 脚本](https://github.com/pymupdf/RAG/blob/main/helpers/pymupdf_rag.py)。它可以被其他脚本作为模块导入，或者在终端窗口中通过以下命令行调用：

`$ python pymupdf_rag.py input.pdf [-pages PAGES]`

它将生成一个 **Markdown** 格式的文本文件（称为 `input.md`）。可选参数 `PAGES` 允许将转换限制为 PDF 总页面的一个子集。如果省略，则处理整个 PDF。

## Markdown 创建细节

### 选择要考虑的页面

“`-pages`” 参数是一个字符串，由所需的页面编号（从1开始）组成，用于考虑进行markdown转换。可以给出多个页面编号规范，使用逗号分隔。每个规范可以是一个整数或两个用“`-`”连接的整数，指定一个页面范围。以下是一个示例：

“`-pages 1–10,15,20-N`”

这将包括第1页到第10页、第15页以及第20页到文件末尾（大写“N”被视为最后一页的编号）。

### 识别标题

在调用时，程序检查给定页面上的所有文本并找出最常用的字体大小。该值（以及所有较小的字体大小）被假定为 **正文文本**。较大的字体大小被假定为 **标题文本**。

根据它们在字体大小层级中的相对位置，标题文本将前面加上一个或多个 markdown 标题 `#` 标签字符。

### 按页面区域识别处理模式

每个页面上的所有文本首先将被分类为**标准**文本或**表格**文本。然后，页面内容将从上到下提取，并转换为Markdown格式。

这最好通过一个例子来解释：

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*u5fv2aAIvDaaAd6H.png)

该页面显示的内容代表典型情况：

* 两个表格，具有部分重叠的垂直位置。一个表格没有标题，另一个表格有**外部**列标题。
* 有一行**标题**和多个级别的**标题**。
* **正文文本**包含多种样式细节，如**粗体**、*斜体*和`行内代码`。
* 有序和无序列表。
* 代码片段。

布局分析将确定三个区域并选择适当的处理模式：**(1)** 文本，**(2)** 表格，**(3)** 文本。

生成的Markdown文本忠实地反映了上述内容——在这种格式中尽可能做到。

作为一个例子，让我们看一下具有外部标题的表格的输出：

```python
|Column1|Column2|

|---|---|

|Cell (0, 0)|Cell (0, 1)|

|Cell (1, 0)|Cell (1, 1)|

|Cell (2, 0)|Cell (2, 1)|
```
这是与GitHub兼容的格式，具有最小的可能令牌大小——这是保持输入到RAG系统的小型化的重要方面。

**列边框**由“`|`”字符表示。如果文本行后面跟着“`|---|---| …`”形式的行，则假定该文本行是**表头**。完整的**表格定义**必须前后至少有一行空行。

请注意，由于技术原因，Markdown表格必须有一个标题，因此如果没有外部标题，将选择第一行作为表头。

为了确认整体准确性，以下是Markdown解析器如何处理完整页面的示例：

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*Ge83uj7FiM4T6XFn)

## 以编程方式调用 Markdown 转换器

除了在命令行中执行程序外，Markdown 转换也可以通过程序请求：

```python
import fitz
from pymupdf_rag import to_markdown  # import Markdown converter

doc = fitz.open(“input.pdf”)  # open input PDF

## define desired pages: this corresponds “-pages 1-10,15,20-N”
page_list = list(range(9)) + [14] + list(range(19, len(doc) – 1))

## get markdown string for all pages
md_text = to_markdown(doc, pages=page_list)

## write markdown string to some file
output = open(“out-markdown.md”, “w”)
output.write(md_text)
output.close()
```

## 结论

通过集成 PyMuPDF 的提取方法，PDF 页面的内容将被忠实地转换为可用作 RAG 聊天机器人的输入的 Markdown 文本。

请记住，成功的 RAG 聊天机器人的关键在于它能够访问的信息的质量和完整性。

启用 PyMuPDF 的 Markdown 提取确保从 PDF 中获取这些信息不仅是可能的，而且是简单的，展示了该库的强大和对开发者的友好。祝编码愉快！

### 源代码

* [RAG/helpers/pymupdf\_rag.py (github.com)](https://github.com/pymupdf/RAG/blob/main/helpers/pymupdf_rag.py)

### 参考文献

* [5 Levels of Text Splitting](https://github.com/FullStackRetrieval-com/RetrievalTutorials/blob/main/tutorials/LevelsOfTextSplitting/5_Levels_Of_Text_Splitting.ipynb)

### 相关博客

* [使用 ChatGPT API 和 PyMuPDF 构建 RAG 聊天机器人 GUI](https://readmedium.com/building-a-rag-chatbot-gui-with-the-chatgpt-api-and-pymupdf-9ea8c7fc4ab5)
* [使用 ChatGPT 和 PyMUPDF 创建 RAG 聊天机器人](https://readmedium.com/creating-a-rag-chatbot-with-chatgpt-and-pymupdf-f6c30907ae27)
* [RAG/LLM 和 PDF：增强文本提取](https://readmedium.com/rag-llm-and-pdf-enhanced-text-extraction-5c5194c3885c)

