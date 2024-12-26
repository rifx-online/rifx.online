---
title: "使用 Markdown 和 Gemini 为 RAG 解锁 PDF"
meta_title: "使用 Markdown 和 Gemini 为 RAG 解锁 PDF"
description: "本文介绍了一种新技术，通过将PDF文件的内容提取为Markdown格式，提升检索增强生成（RAG）应用程序的准确性与上下文丰富性。PDF文件因其复杂布局和文本格式而难以处理，传统的Python库难以满足需求。新方法利用Gemini和Google Cloud，将每页PDF转换为图像并提取Markdown，支持并行处理以提高效率。Markdown格式增强了模型的理解能力，适合与大型语言模型结合使用。该方法在处理RAG应用中表现出色，提供了更好的文本提取质量和文档分块能力。"
date: 2024-12-26T04:30:18Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*KWoWZylZN9Gkd1gM56NtFw.png"
categories: ["Programming", "Technology", "Data Science"]
author: "Rifx.Online"
tags: ["PDF", "Markdown", "Gemini", "RAG", "DocumentAI"]
draft: False

---





可以说，检索增强生成（RAG）为许多企业和组织带来了变革。通过将像 [Gemini](https://deepmind.google/technologies/gemini/) 这样的 LLM 的内置功能与您自己的信息相结合，您可以创造出真正具有变革性的强大体验。

尽管如此，创建一个能够很好处理复杂非结构化文档（如 PDF）的 RAG 应用程序仍然是一个挑战。

**本文提出了一种从 PDF 中提取文本并转换为 Markdown 格式的新技术，从而提高了检索增强生成（RAG）应用程序的准确性和丰富的上下文。**

Markdown 不仅仅用于输出。在提示中使用 Markdown 可以显著提高模型响应的质量，因为它相比于纯文本提供了更多的细微差别。

## PDF的问题

PDF文件 notoriously 难以处理。每个文档可以有各种各样的布局，包括多列文本，甚至文本似乎随机分布在页面上。由于PDF不仅支持文本，还支持图像，因此某些页面可能看起来像文本，但实际上是以图像形式表示的。此外，PDF通常包含表格数据，这可能相当难以解析。最后，从PDF中提取文本并保留格式信息（如粗体、斜体和项目符号）是相当困难的。仅提取文本会丢失原始文档中的意义和细微差别。

这些情况使得在RAG应用中使用PDF变得困难。当然，有许多Python库可用于处理PDF文档，如PyPDF、PDFPlumber或PDFMiner，但几乎没有一个能够处理上述所有复杂情况。根据源文档的不同，所有这些库可能会生成不完整甚至完全错误的文本。

最近，一些新方法被引入，使用ML模型（如[Docling](https://github.com/DS4SD/docling)）来解析PDF，但它们可能非常慢，并且对于超过几页的PDF不可用。（在我最近在笔记本电脑上运行的一次测试中，Docling花了18分钟来解析一个12页的文档。）

这篇博客文章描述了一种新的技术，通过Gemini和Google Cloud快速有效地读取PDF文件并生成准确的相应Markdown。生成的Markdown非常适合索引到RAG数据存储中。

## 关于Markdown的简要说明

[Markdown](https://en.wikipedia.org/wiki/Markdown) 是一种简单而紧凑的标记语言。Markdown 的语法比 HTML 和 CSS 更简单，专注于有限的样式元素：标题、粗体文本、斜体文本、超链接、项目符号和简单表格。

大多数大型语言模型（如 Gemini）生成的输出使用 Markdown，而它提供的样式对于读者理解非常有帮助。实际的项目符号远比在行首使用连字符的纯文本替代方案要好得多，而粗体和斜体文本可以使重要信息更加突出。除此之外，Markdown 将信息组织成表格的能力也非常有用。

或许不太直观的是，Markdown 在创建提示时也非常有用。通过选择性地突出提示中的关键短语或将信息组织成项目符号列表，我们为模型提供了比单纯的文本内容更多的信息，从而提高了模型的理解能力，帮助其集中于当前任务。

尽管如此，重要的是要记住，Markdown 是一种简单的语言，可能不支持您在 PDF 中存储的所有内容。例如，Markdown 表格不支持跨行或跨列，这在表头中经常出现。在测试这种新方法时，记住这一点非常重要，因为这会影响您对某些 PDF 文件提取的准确性。

尽管存在这些限制，能够将 PDF 的内容提取为 Markdown 在处理 RAG 应用程序时非常有帮助。在分块和索引过程中，您可以使用标题来理解章节和小节，这使得将文档分块为离散主题成为可能。同样，按 Markdown 表格排列的表格数据可以帮助模型比使用纯文本更容易理解内容。

总之，显然，从 PDF 中提取的 Markdown 可以显著提高 Gemini 的响应质量，因为与纯文本相比，它提供了更多的细微差别。此外，它还在 RAG 吞吐过程中帮助分块文档，因为您可以使用诸如标题之类的线索来检测文档中的逻辑部分。

现在我们了解了 Markdown 如何提供帮助，让我们看看从 PDF 文档中提取它的过程。

## 如何从 PDF 中提取 Markdown

简单来说，从 PDF 文档中提取 Markdown 的过程如下：

* 对于 PDF 中的每一页：
\- 创建该页的图像
\- 将该图像传递给 Gemini，并提示它提取该页的内容为 Markdown
* 一旦所有单独的页面都处理完毕，将所有页面的 markdown 合并为一个单一的 Markdown 字符串。

这种方法效果很好。以下是一个示例，使用来自 [伊利诺伊州1040税表](https://tax.illinois.gov/content/dam/soi/en/web/tax/forms/incometax/documents/currentyear/individual/il-1040.pdf) 的页面。注意页面被分成两列，页面的上半部分与下半部分完全分开：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*A1Ryg_j_bWbAHYrT)

以下是 Gemini 生成的相应 Markdown，已渲染以便您可以看到项目符号、标题等的使用：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*7XFQDStvA8Gds8Cg)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*UPz4Pq4eygFcCnLc)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*AUMp0DlHdHIzuT9X)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*UDIxS5mXEjKPhDAa)

如您所见，提取的 markdown 质量非常好，因为它通常反映了人类阅读页面的方式。注意“步骤 2”（页面的上半部分）在“步骤 3”（下半部分）之前被完整描述。

此外，生成的 markdown 指定了项目符号列表、加粗文本、标题等。所有这些为提取的原始文本增加了意义，这通常会在将该 markdown 传递给 Gemini 时产生更好的结果。而且，如前所述，拥有标题和副标题有助于我们将文档分块为逻辑分组，这将有助于 RAG 检索过程。

## 实施细节

根据您的用例，您可以简单地遍历 PDF 中的每一页，提取页面图像，然后将其传递给 Gemini 以获取 markdown。然而，在处理这个问题时，考虑扩展性是很重要的。

在我的笔记本电脑上，提取上述示例页面的图像花费了 0.140 秒，因此算法的这一部分非常快速。然而，调用 Gemini 1.5 Flash 提取 Markdown 则花费了 23.857 秒，对于较长的 PDF 文档，这个时间会迅速累积。

幸运的是，这个问题非常适合使用 [map-reduce](https://en.wikipedia.org/wiki/MapReduce) 方法。该方法首先将工作分成多个部分，每个部分并行运行。这一部分称为 **map** 步骤。然后，当所有并行部分完成时，结果被组合或聚合，这称为 **reduce** 步骤。

在我们的案例中，我们可以分别处理每一页，然后在所有页面处理完毕后合并所有页面的 markdown。通过利用 Google Cloud，我们可以使用 [PubSub](https://cloud.google.com/pubsub?hl=en) 主题分配工作，并使用 [Cloud Run Function](https://cloud.google.com/functions?hl=en) 处理每一页。以下是说明该方法的图示：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*KfHSQiozPJK1UeSZ)

从左到右，这些步骤如下：

1. 当 PDF 文件被放入 Google Cloud Storage 存储桶时，会触发一个 Cloud Function。
2. 该函数将 PDF 从存储桶复制到函数的本地存储，然后打开它以确定它包含多少页。然后，对于每一页，函数向 PubSub 主题写入一个小的 JSON 项，其中包含 PDF 的名称、要处理的页面编号（从 0 到 N — 1，其中有 N 页）和在 PDF 中找到的总页数。
3. 当 PubSub 主题中出现新项目时，会触发 Page Handler 云函数。请注意，通过 [Cloud Run 提供的并行处理](https://cloud.google.com/functions/docs/configuring/concurrency)，可以同时运行该函数的多个调用。您可以在配置函数时指定最大并发性。
4. 该函数将 PDF 从存储桶复制到函数的本地存储，打开 PDF，为相关页面（即从主题中检索的 JSON 数据中的页面编号）渲染图像，然后通过 Vertex AI API 调用 Gemini 以获取 Markdown。
5. 一旦从 Gemini 获得页面 Markdown，它将被存储在 BigQuery 表中，该表具有文件名、页面编号和提取的 markdown 字符串的字段。

这些步骤为每一页提取 markdown（map-reduce 的 **map** 部分），但我们仍然需要处理 **reduce** 步骤，其中所有单独的页面 markdown 被合并成一个字符串。

在这种情况下，最简单的方法是让页面处理函数检查它是否是文档中的最后一页。通过计算给定文档在 BigQuery 表中的页数，我们可以确定所有处理是否完成（这就是我们在 PubSub 主题中传递总页数的原因）。

简而言之，在页面处理函数完成页面处理后，它会从相关文档的 BigQuery 表中计算已完成的页面数量，如果与总页数匹配，则检索所有单独的页面 markdown 字符串（按页面编号排序）并合并成一个字符串。此时，我们可以将文档 Markdown 存储在文件中，或者如果需要，可以进行更多处理（例如，将提取的 Markdown 作为发送给 Gemini 的另一个提示的一部分）。

## 实现代码

首先，让我们看一下 PDF 文件处理程序的代码——当 PDF 文件放入存储桶时调用的函数。我们使用 PDF 库 [PyPdfium](https://pypi.org/project/pypdfium2/) 来计算页面数量。

```python
from google.cloud import storage, pubsub_v1
import os
from typing import Callable
from concurrent import futures
import pypdfium2 as pdfium
import json

## 项目 ID
project_id = os.getenv("PROJECTID")
## 我们要写入的 pubsub 主题
pubsub_topicname = os.getenv("TOPICNAME")
publisher = pubsub_v1.PublisherClient()
topic_path = publisher.topic_path(project_id, pubsub_topicname)


def handle_new_file(event, context):
    # 从云存储复制文件到本地存储
    bucketname = event['bucket']
    filename = event['name']
    if filename.lower().endswith('.pdf') is False:
        print(f"文件 {filename} 不是 PDF 文件，跳过")
        return
    localname = '/tmp/test.pdf'
    download_to_local(bucketname, filename, localname)

    # 确定有多少页
    num_pages = len(pdfium.PdfDocument(localname))

    # 对于每一页，发布一条消息
    publish_futures = []
    for page_num in range(num_pages):
        # 创建一个 JSON 对象，包含文件名、要处理的页码和总页数
        data = json.dumps({"filename": filename, "pagenum": page_num, "totalpages": num_pages}).encode('utf-8')

        # 非阻塞。发布失败在回调函数中处理。
        future = publisher.publish(topic_path, data)
        future.add_done_callback(get_callback(future, data))
        publish_futures.append(future)

    # 等待所有发布的 futures 完成后再退出。
    futures.wait(publish_futures, return_when=futures.ALL_COMPLETED)

    # 然后删除本地文件并退出
    os.remove(localname)


def download_to_local(bucketname, filename, localname):
    bucket = storage_client.bucket(bucketname)
    blob = bucket.blob(filename)
    blob.download_to_filename(localname)


def get_callback(publish_future: pubsub_v1.publisher.futures.Future, data: str) -> Callable[[pubsub_v1.publisher.futures.Future], None]:
    def callback(publish_future: pubsub_v1.publisher.futures.Future) -> None:
        try:
            # 等待 60 秒以确保发布调用成功。
            publish_future.result(timeout=60)
        except futures.TimeoutError:
            print(f"发布 {data} 超时。")
    return callback
```
现在让我们看一下处理单个页面的函数。

```python
import base64
from google.cloud import storage
import os
import json
from read_pdf import get_markdown_for_page
from bigquery import save_page_info, get_num_pages_for_filename, get_markdown_for_filename


BUCKET = os.getenv("BUCKET")
storage_client = storage.Client()


def handle_pubsub_message(event, context):
    # 解码消息数据
    message_bytes = base64.b64decode(event['data'])
    message_str = message_bytes.decode('utf-8')
    message_json = json.loads(message_str)

    # 获取我们应该处理的页面信息
    filename = message_json.get("filename")
    pagenum = message_json.get("pagenum")
    totalpages = message_json.get("totalpages")

    # 获取文件，提取相关页面，将其转换为图像，
    # 并使用 Gemini 获取其 Markdown
    download_to_local(BUCKET, filename, "temp.pdf")
    markdown = get_markdown_for_page("temp.pdf", pagenum)
    save_page_info(filename, pagenum, markdown)

    # 现在检查所有页面是否已处理
    num_pages_for_filename = get_num_pages_for_filename(filename)
    if num_pages_for_filename == totalpages:
        # 获取所有页面的 Markdown，合并，然后存储为文件
        # 未来，我们将把这个字符串传递给 Gemini 以获取产品信息
        all_markdown = get_markdown_for_filename(filename)
        save_text_to_bucket(BUCKET, f'markdown\{filename}.md', all_markdown)


def download_to_local(bucketname, filename, localname):
    bucket = storage_client.bucket(bucketname)
    blob = bucket.blob(filename)
    blob.download_to_filename(localname)


def save_text_to_bucket(bucketname, filename, text):
    bucket = storage_client.bucket(bucketname)
    blob = bucket.blob(filename)
    blob.upload_from_string(text)
```
如您所见，此函数调用了一些额外的模块。首先，这是 **read_pdf.py** 模块，用于提取图像并调用 Gemini 获取 Markdown：

```python
import vertexai
from vertexai.generative_models import (
    Part,
    Image,
    GenerativeModel,
    HarmBlockThreshold,
    HarmCategory,
)
import pypdfium2 as pdfium
import os


PROJECT_ID = os.getenv("PROJECTID")
REGION = os.getenv("REGION")
LOCAL_IMAGE_FILE = "/tmp/page.png"
vertexai.init(project=PROJECT_ID, location=REGION)
model = GenerativeModel("gemini-1.5-flash-002")


def get_markdown_for_page(fname, pagenum):
    imgname = get_image_for_page(fname, pagenum)
    markdown = call_gemini_for_markdown(imgname)
    return markdown


def get_image_for_page(fname, pagenum):
    doc = pdfium.PdfDocument(fname)
    page = doc.get_page(pagenum)
    bitmap = page.render(scale=2)    # 72dpi 分辨率 x 2
    bitmap = bitmap.to_pil()
    bitmap.save(LOCAL_IMAGE_FILE)
    return LOCAL_IMAGE_FILE


def call_gemini_for_markdown(img_filename):
    image1 = Part.from_image(Image.load_from_file(img_filename))
    generation_config = {
        "max_output_tokens": 8192,
        "temperature": 1,
        "top_p": 0.95,
    }

    safety_settings = {
        HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
    }

    responses = model.generate_content(
        [image1, "检查图像并返回其中所有文本，转换为 Markdown。确保文本反映人类阅读的方式，遵循列并理解格式。忽略脚注和页码 - 它们不应作为 Markdown 的一部分返回。仅为页面上找到的文本生成 markdown。"],
        generation_config=generation_config,
        safety_settings=safety_settings,
        stream=True,
    )

    response_text = []
    for response in responses:
        response_text.append(response.text)
    return "".join(response_text)
```
如您所见，我们用来提取 Markdown 的提示如下：

```python
检查图像并返回其中所有文本，转换为 
Markdown。确保文本反映人类阅读的方式， 
遵循列并理解格式。忽略脚注和 
页码 - 它们不应作为 Markdown 的一部分返回。 
仅为页面上找到的文本生成 markdown。
```
最后，我们在与 BigQuery 交互时使用的几个函数位于 **bigquery.py** 模块中：

```python
from google.cloud import logging, bigquery
import os
import time


BQ_DATASET = os.getenv("BQ_DATASET")
BQ_TABLE = "pdf2markdown"
bq_client = bigquery.Client()
logging_client = logging.Client()
log_name = "debug-log"
logger = logging_client.logger(log_name)


def save_page_info(filename, pagenum, markdown):
    table_id = f'{BQ_DATASET}.{BQ_TABLE}'
    table_ref = bq_client.dataset(BQ_DATASET).table(BQ_TABLE)

    # 将提取的字段作为新行插入
    try:
        errors = bq_client.insert_rows_json(
            table_ref,
            [{
                "filename": filename,
                "pagenum": pagenum,
                "markdown": markdown
            }])

        if errors == []:
            logger.log_text("数据已插入表中")
        else:
            logger.log_text(f"插入数据时遇到错误: {errors}", severity="ERROR")
    except Exception as e:
        logger.log_text(f"插入数据到 BQ 时出错: {e}", severity="ERROR")


def get_num_pages_for_filename(filename):
    query = f"SELECT COUNT(*) as numpages FROM `{BQ_DATASET}.{BQ_TABLE}` WHERE filename = '{filename}'"
    query_job = bq_client.query(query)
    results = list(query_job.result())
    count = results[0].numpages
    return count


def get_markdown_for_filename(filename):
    query = f"SELECT markdown FROM `{BQ_DATASET}.{BQ_TABLE}` WHERE filename = '{filename}' ORDER BY pagenum"
    query_job = bq_client.query(query)
    results = list(query_job.result())
    # 合并为一个字符串
    parts = [row.markdown for row in results]
    return "\n".join(parts)
```
请注意，这段代码假设 BigQuery 表 **pdf2markdown** 已经创建。尽管您可以通过代码创建表，但在您可以向该表插入数据之前，通常会有一个小的延迟，这可能会导致错误。最佳实践是在代码之外首先使用 Terraform 或其他基础设施即代码 (IAC) 方法创建空表。

## 结论

本文讨论了处理PDF文档时面临的挑战，特别是针对RAG应用程序。由于PDF文件的设计主要是为了支持几乎任何可以想象的布局，因此在尝试提取文本和相关的上下文信息（如标题、表格等）时，通常非常困难。

另一方面，Markdown非常适合与像Gemini这样的LLM一起使用，不仅在提高输出的可读性和上下文方面，而且在构建提示时，以及在为RAG解决方案分块和索引文档时。挑战在于将PDF中的内容提取为Markdown格式。

通过将PDF的每一页转换为图像，然后请求Gemini将页面内容提取为Markdown，我们可以快速轻松地从文档中提取文本及其上下文。通过利用Google Cloud的强大功能，我们可以通过并行处理多个页面，使该过程变得极为高效，直到所有页面处理完成后再合并结果。

最后，另一个值得探索的选项是Google Cloud的[DocumentAI](https://cloud.google.com/document-ai/docs/overview)，它使用Google基础模型来解析和分块文档。它还具有内置的OCR支持，可以解析基于图像的页面。您可能希望将这种方法与此处描述的方法进行比较，以确定适合您文档的最佳方法。请记住，DocumentAI不返回Markdown，因此在决定采取哪种方法时，应考虑这一点。

