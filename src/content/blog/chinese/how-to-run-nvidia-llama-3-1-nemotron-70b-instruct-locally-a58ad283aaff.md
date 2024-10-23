---
title: "如何在本地运行 Nvidia 的 llama-3.1-nemotron-70b-instruct"
meta_title: "如何在本地运行 Nvidia 的 llama-3.1-nemotron-70b-instruct"
description: "在本地运行大型语言模型 (LLM) 在开发人员、研究人员和 AI 爱好者中越来越受欢迎。其中之一就是……"
date: 2024-10-23T11:49:51Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*swPjVuudAhsoRiiw3Ee32w.png"
categories: ["large-language-models"]
author: "Rifx.Online"
tags: ["large-language-models"]
draft: False

---





### Data feeding in markdown text format increases generated text quality




## Introduction

In the context of **Large Language Models (LLMs)** and **Retrieval-Augmented Generation (RAG)** environments, data feeding in **markdown text format** holds **significant importance**. Here are some detailed considerations.

**LLMs** are powerful language models that can generate coherent and contextually relevant text. However, they may sometimes produce responses that lack factual accuracy or context. By incorporating retrieval-based methods (like RAG), we can enhance the quality of generated text.

**RAG** enables the integration of **external data** — previously absent in the LLM’s training data — into the text generation process. This inclusion mitigates “hallucination issues’’ and enhances the relevance of text responses.


## Why Markdown for LLM?

**Markdown** is a lightweight markup language that allows users to format plain text using simple syntax. It is widely used for creating structured documents, especially on platforms like GitHub, Jupyter notebooks, and various content management systems. When feeding data into an LLM or RAG system, using markdown format provides several benefits:

1. **Structured Content**: Markdown allows you to organize information into headings, lists, tables, and other structured elements. This structure aids in better understanding and context preservation.
2. **Rich Text**: Markdown supports basic formatting such as bold, italics, links, and code blocks. Including rich text in the input data enhances the context for the language model.
3. **Embedding Links and References**: Markdown lets you embed hyperlinks, footnotes, and references. In RAG scenarios, this can be crucial for referring to external sources or providing additional context.
4. **Ease of Authoring**: Markdown is human-readable and easy to write. Authors can create content efficiently without complex formatting tools.
5. **Chunking**: Essential for RAG systems, chunking (otherwise known as “splitting”) breaks down extensive documents for easier processing. With PyMuPDF data extraction available in MD format we support chunking to keep text with common context together. **Importantly, PyMuPDF extraction in MD format allows for [Level 3 chunking](https://readmedium.com/five-levels-of-chunking-strategies-in-rag-notes-from-gregs-video-7b735895694d#b123)**.

In summary, using markdown text format in LLM and RAG environments ensures more accurate and relevant results because it supplies richer data structures and more relevant data chunk loads to your LLM.


## PyMuPDF Support for Markdown Conversion of a PDF

Since its inception, PyMuPDF has been able to extract text, images, vector graphics and, since August 2023, tables from PDF pages. Each of these object types has its own extraction method: there is one for text, and yet others for tables, images and vector graphics. To meet the requirements of RAG, we merged these disparate extractions to produce one common, unified **Markdown** string which consistently represents the page’s content as a whole.

All this is implemented as [one Python script](https://github.com/pymupdf/RAG/blob/main/helpers/pymupdf_rag.py). It can be imported as a module by some other script, or be invoked as a line command in a terminal window like this:

`$ python pymupdf_rag.py input.pdf [-pages PAGES]`

It will produce a text file (called `input.md`) in **Markdown** format. The optional parameter `PAGES` allows restricting the conversion to a subset of the PDF’s total pages. If omitted, the full PDF is processed.


## Markdown Creation Details


### Selecting Pages to Consider

The “`-pages`” parameter is a string consisting of desired page numbers (1-based) to consider for markdown conversion. Multiple page number specifications can be given, separated by commas. Each specification either is one integer or two integers separated by a “`-`” hyphen, specifying a range of pages. Here is an example:

“`-pages 1–10,15,20-N`”

This would include pages 1 through 10, 15 and pages 20 through the end of the file (capital “N” is treated as the number of the last page).


### Identifying Headers

Upon invocation, the program examines all text on the given pages and finds the most frequently used font size. This value (and all smaller font sizes) is assumed to represent **body text**. Larger font sizes are assumed to represent **header text**.

Depending on their relative position in the font size hierarchy, header text will be prefixed with one or more markdown header `#`-tag characters.


### Identifying the Processing Mode per Page Area

All text on each page will first be classified as being either **standard** text or **table** text. Then the page content will be extracted from top to bottom converting everything to markdown format.

This is best explained by an example:

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*u5fv2aAIvDaaAd6H.png)

This page shows content, that represents typical situations:

* Two tables, having partly overlapping vertical positions. One table has no headers, the other one has **external** column headers.
* There is a **title** line and **headers** at multiple levels.
* The **body text** contains a variety of styling details like **bold**, *italic* and `inline code`.
* Ordered and unordered lists.
* Code snippet.

Layout analysis will determine three areas and select the appropriate processing modes: **(1)** text, **(2)** table, **(3)** text.

The generated Markdown text reflects the above faithfully — as much as at all possible in this format.

For an example, let us look at the output for the table with external headers:


```python
|Column1|Column2|

|---|---|

|Cell (0, 0)|Cell (0, 1)|

|Cell (1, 0)|Cell (1, 1)|

|Cell (2, 0)|Cell (2, 1)|
```
This is GitHub-compatible format with the minimum possible token size — an important aspect for keeping feeds into RAG systems small.

**Column borders** are indicated by the “`|`” character. A text line is assumed to be a **table header** if it is followed by a line of the form “`|---|---| …`”. The full **table definition** must be preceded and followed by at least one empty line.

Please note that for technical reasons markdown tables must have a header and thus will choose the first table row if no external header is available.

To confirm overall fidelity, here is how a Markdown parser processes the full page:

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*Ge83uj7FiM4T6XFn)


## Invoking the Markdown Converter Programmatically

Instead of executing a program in the command line, Markdown conversion can also be requested by a program:


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

## Conclusion

By integrating PyMuPDF’s extraction methods, the content of PDF pages will be faithfully converted to markdown text that can be used as input for RAG chatbots.

Remember, the key to a successful RAG chatbot lies in the quality and completeness of information it can access.

PyMuPDF-enabled markdown extraction ensures that this information from PDFs is not only possible but straightforward, showcasing the library’s strength and developer-friendliness. Happy coding!


### Source Code

* [RAG/helpers/pymupdf\_rag.py (github.com)](https://github.com/pymupdf/RAG/blob/main/helpers/pymupdf_rag.py)


### References

* [5 Levels of Text Splitting](https://github.com/FullStackRetrieval-com/RetrievalTutorials/blob/main/tutorials/LevelsOfTextSplitting/5_Levels_Of_Text_Splitting.ipynb)


### Related Blogs

* [Building a RAG Chatbot GUI with the ChatGPT API and PyMuPDF](https://readmedium.com/building-a-rag-chatbot-gui-with-the-chatgpt-api-and-pymupdf-9ea8c7fc4ab5)
* [Creating a RAG Chatbot with ChatGPT and PyMUPDF](https://readmedium.com/creating-a-rag-chatbot-with-chatgpt-and-pymupdf-f6c30907ae27)
* [RAG/LLM and PDF: Enhanced Text Extraction](https://readmedium.com/rag-llm-and-pdf-enhanced-text-extraction-5c5194c3885c)

