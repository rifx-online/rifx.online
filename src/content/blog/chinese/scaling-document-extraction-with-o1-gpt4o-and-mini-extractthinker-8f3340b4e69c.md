---
title: "使用 O1、GPT4o 和 Mini | ExtractThinker 扩展文档提取功能"
meta_title: "使用 O1、GPT4o 和 Mini | ExtractThinker 扩展文档提取功能"
description: "本文介绍了如何高效使用ExtractThinker处理大规模文档，涵盖了不同模型的选择（如GPT-4o、o1等）及其应用场景。ExtractThinker作为文档智能库，结合了DocumentLoader、LLM和Extractor等组件，实现了对文档的加载、拆分、分类和数据提取。文章还探讨了OCR技术在数据提取中的重要性以及异步批处理在高负载情况下的应用，旨在提高文档处理的效率和准确性。"
date: 2024-11-25T15:00:22Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*vjrBW5a2WahkFj0XkpXhtw.png"
categories: ["Programming", "Technology", "Data Science"]
author: "Rifx.Online"
tags: ["ExtractThinker", "DocumentLoader", "LLM", "Extractor", "Contracts"]
draft: False

---





在本文中，我们将探讨如何高效地使用 [ExtractThinker](https://github.com/enoch3712/ExtractThinker) 来处理大规模文档。我们将讨论何时使用不同的模型，如 O1、GPT4o 及其迷你版本，如何处理 OCR，提取图表，并使用异步批处理管理重负载。

## ExtractThinker 介绍

是一个灵活的文档智能库，帮助您从各种文档中提取和分类结构化数据，类似于文档处理工作流的 ORM。您可以说的一个短语是 **“文档智能用于 LLMs”** 或 **“LangChain 用于智能文档处理。”** 动机是创建文档处理所需的专业功能，例如 **拆分** 大型文档和 **高级分类**。

下面的图像映射了将要讨论的所有内容：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*k-5aAy6-hoSxLCtTwL9A8Q.png)

### DocumentLoader

DocumentLoader 是文档与 LLM 之间的连接，通常在 SOTA OCR 上完成。支持多种文档加载器，包括 Tesseract OCR、Azure Form Recognizer、AWS Textract、Google Document AI 等。

### LLM

它是模型的装饰器。它建立在像 [LiteLLM](https://www.litellm.ai/) 和 [Instructor](https://github.com/instructor-ai/instructor) 这样的工具之上，以便于无关的使用。它是围绕文档智能的需求而设计的。

### 合同

也可以是一个装饰器，但属于 Pydantic。其目的是包括自定义功能，如验证器和提示工程，以便自动注入和处理。

### 提取器

协调文档加载器与LLMs之间的交互，以提取结构化数据。

### 过程

表示文件中的流。基于上述组件构建。您可以根据特定用例选择 **DocumentLoaders** 和 **Extractors**。

还有其他较小的组件，如 **Splitters** 和 **Classifications**，但我们将结合适当的示例来查看它们。

## 选择合适的模型

选择合适的模型对于平衡性能、准确性和成本至关重要。首先，让我们看看成本： 

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*NLoXSsgU8TgumzynudILFA.png)

### GPT\-4o mini

**使用案例**：基本文本提取任务，类似于OCR。

非常适合从文档中提取文本，您需要将图像或PDF转换为机器可读文本。具有成本效益且快速，非常适合高容量处理。

### GPT\-4o

**使用案例**：分类和拆分。

GPT\-4o 模型让您对文档的内容和结构有更深入的理解。非常适合对文档进行分类，将合并的文档拆分为单独的部分，以及执行复杂的分类任务。

**何时使用**：

* 将文档分类为发票、合同或收据等类型。
* 根据内容将多页文档拆分为单独的部分。
* 需要理解上下文和细微差别的高级分类。

### o1 和 o1\-mini 模型

**使用场景**：需要从数据中进行推理和生成结论的高级提取任务。

**o1 和 o1\-mini 模型** 旨在处理复杂的提取场景，在这些场景中，模型需要进行更深入的分析和推理。例如，从图表中提取数据，解释数值，以及根据提取的坐标计算聚合指标，如人均 GDP。

**何时使用**：

* 基于提取的数据进行计算或生成洞察。

上面的详细描述可以在下面的图像中概括：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*P5Dijb-2wwHz8pzMsEs4iQ.png)

## 在 ExtractThinker 中使用 DocumentLoader

在 ExtractThinker 中，**DocumentLoader** 是一个关键组件，它 **连接您的文档和 LLM**。它使用最先进的 OCR 技术或直接文本提取工具处理来自各种文档格式的文本和布局信息的提取。

### OCR与纯视觉

您可以仅使用LLMs完美地提取数据，但问题有两个方面：**幻觉和精确性。** 如果数据不够可见或不够清晰，就可能发生幻觉。**OCR会在数据方面准确满足您的需求，而LLM则会提供结构。** 在某些文件中，例如带有签名的文件，精确性将是一个问题，而OCR可以很好地处理这些情况。

因此，在生产案例中，尽量使用启用视觉的OCR。**这将把OCR文本和图像添加到LLM请求中。**

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*pPQXQILNrADbfYY8lbxskg.png)

### 可用的 DocumentLoaders

ExtractThinker 提供了几种 DocumentLoaders，包括：

* **DocumentLoaderTesseract**：使用 Tesseract OCR 从图像或扫描的 PDF 中提取文本。
* **DocumentLoaderPyPdf**：使用 PyPDF 直接从 PDF 中提取文本，适用于数字生成的 PDF。
* **DocumentLoaderAWSTextract**：与 AWS Textract 集成，提供高级 OCR 功能。
* **DocumentLoaderAzureForm**：利用 Azure Form Recognizer 提取结构化数据。
* **DocumentLoaderGoogleDocumentAI**：连接到 Google Document AI 进行 OCR 和数据提取。

它包含两个主要方法，**load** 在 **extract()** 上调用，**load\_content\_list** 在 **split()** 中调用。

**从 DocumentLoader 获取内容**


```python
import os
from extract_thinker.document_loader import DocumentLoaderTesseract

## Set the path to your Tesseract executable
tesseract_path = os.getenv('TESSERACT_PATH')
if not tesseract_path:
    raise ValueError('TESSERACT_PATH environment variable is not set')

## Gets the content in JSON or just in text
content = loader.load(test_file_path)

## Gets a JSON with the content and images, per page
content = loader.load_content_list(test_file_path)
```

## 提取器：提取结构化数据和图表

**提取器**是ExtractThinker中的核心组件，负责协调您的**文档加载器**和**LLM**之间的交互，以从文档中提取结构化数据。它利用LLM的能力，根据称为**合同**的预定义数据结构来解释和组织提取的文本。

### 定义合同

合同是 Pydantic 模型，定义了您希望从文档中提取的数据结构。它们像架构一样，供提取器和 LLM 用于解析和组织提取的信息。

**为发票定义合同**


```python
from extract_thinker import Contract
from pydantic import Field
from typing import List

class InvoiceLineItem(Contract):
    description: str = Field(description="描述项目")
    quantity: int = Field(description="项目数量")
    unit_price: float = Field(description="项目单价")
    amount: float = Field(description="项目总金额")

class InvoiceContract(Contract):
    invoice_number: str = Field(description="发票号码")
    invoice_date: str = Field(description="发票日期")
    total_amount: float = Field(description="发票总金额")
    line_items: List[InvoiceLineItem] = Field(description="发票中项目的列表")
```
该合同指定我们希望提取发票号码、日期、总金额和每个项目的详细信息。

**从发票中提取数据**


```python
import os
from extract_thinker import Extractor
from extract_thinker.document_loader import DocumentLoaderPyPdf  # 或任何其他合适的 DocumentLoader

## 初始化提取器
extractor = Extractor()

## 加载 DocumentLoader
extractor.load_document_loader(DocumentLoaderPyPdf())

## 加载 LLM
extractor.load_llm('gpt-4o-mini')  # 使用适合您用例的模型

## 定义文档的路径
test_file_path = 'path/to/your/invoice.pdf'

## 执行提取
result = extractor.extract(test_file_path, InvoiceContract)

## 访问提取的数据
print("发票号码:", result.invoice_number)
print("发票日期:", result.invoice_date)
print("总金额:", result.total_amount)
for item in result.line_items:
    print(f"项目: {item.description}, 数量: {item.quantity}, 单价: {item.unit_price}, 金额: {item.amount}")
```

### 从图表中提取数据

从图表中提取数据需要一个更高级的合同，以处理图表的结构，包括其类型、描述和数据点。

**为图表定义合同**


```python
from extract_thinker import Contract
from pydantic import Field
from typing import List, Literal

class XYCoordinate(Contract):
    x: float = Field(description='Value on the x-axis')
    y: float = Field(description='Value on the y-axis')

class Chart(Contract):
    classification: Literal['line', 'bar', 'pie'] = Field(description='Type of the chart')
    description: str = Field(description='Description of the chart')
    coordinates: List[XYCoordinate] = Field(description='Data points in the chart')
    gdp_variation: str = Field(description='Description of the GDP variation')

class ChartWithContent(Contract):
    content: str = Field(description='Content of the page without the chart')
    chart: Chart = Field(description='Extracted chart data')
```
这个合同允许我们提取不仅是文本内容，还有图表的详细信息，包括其数据点。

**提取图表数据**


```python
import os
from extract_thinker import Extractor
from extract_thinker.document_loader import DocumentLoaderTesseract  # If working with images

## Initialize the Extractor
extractor = Extractor()

## Load the DocumentLoader
tesseract_path = os.getenv('TESSERACT_PATH')
if not tesseract_path:
    raise ValueError('TESSERACT_PATH environment variable is not set')
extractor.load_document_loader(DocumentLoaderTesseract(tesseract_path))

## Load the LLM (use O1 or GPT-4o for complex tasks)
extractor.load_llm("o1-preview")  # Use 'o1' for advanced reasoning

## Define the path to your document
test_file_path = 'path/to/your/document_with_chart.png'

## Perform the extraction
result = extractor.extract(test_file_path, ChartWithContent, vision=True)

## Access the extracted data
print("Content without Chart:", result.content)
print("Chart Type:", result.chart.classification)
print("Chart Description:", result.chart.description)
print("GDP Variation:", result.chart.gdp_variation)
print("Data Points:")
for coord in result.chart.coordinates:
    print(f"X: {coord.x}, Y: {coord.y}")
```
**注意**：选择模型时请记住经验法则。如果需要根据数据得出结论，例如计算GDP，则必须使用**o1模型。**

## 过程：拆分与分类

在 ExtractThinker 中，**Process** 组件代表一个工作流，负责协调从文档中加载、拆分、分类和提取数据。这个模块化的方法使您能够高效地处理复杂的文档处理任务。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*U6eFz89-NNO9sAWGwx6Z1w.png)

### 理解流程

* **目的**：管理文档上的一系列操作，包括加载、拆分、分类和提取。
* **组件**：结合 **DocumentLoaders**、**Splitters**、**Classifications** 和 **Extractors** 创建灵活的处理管道。
* **灵活性**：通过混合和匹配不同组件，根据您的特定需求自定义工作流程。

### 拆分文档

在处理多页或合并文档时，将其拆分为单独的部分或页面对于准确处理至关重要。ExtractThinker 提供了有效处理的拆分策略。

**主动拆分：** 此策略一次性处理整个文档，提前识别所有拆分点。它最适合适合模型上下文窗口的小到中等大小的文档，为较小的输入提供更简单的实现和更快的处理速度。

**懒惰拆分：** 此方法逐步处理文档，评估较小的块以确定拆分位置。它非常适合超出模型上下文窗口的大型文档，使其成为处理大量数据的可扩展和高效的选择。

### 使用分割器

ExtractThinker 提供了不同的分割器，例如 `ImageSplitter` 和 `TextSplitter`，用于处理分割逻辑。

**设置分割器**


```python
from extract_thinker import Process, SplittingStrategy
from extract_thinker.splitter import ImageSplitter
from extract_thinker.document_loader import DocumentLoaderTesseract

## 初始化 Process
process = Process()

## 加载 DocumentLoader
tesseract_path = os.getenv('TESSERACT_PATH')
process.load_document_loader(DocumentLoaderTesseract(tesseract_path))

## 使用所需的模型和策略加载分割器
process.load_splitter(
    ImageSplitter('gpt-4o', strategy=SplittingStrategy.EAGER)
)
```

### 分类

分类是指识别您所处理的文档或部分的类型，例如发票、合同或驾驶执照。当不同类型的文档需要不同的提取逻辑时，这一点至关重要。

分类是通过 `Classification` 类定义的，指定名称、描述和相关的 `Contract` 以及要使用的 `Extractor`。

**使用多个提取器的分类**


```python
from extract_thinker import Classification
from extract_thinker import Extractor

## Define your Contracts (as previously defined)
class InvoiceContract(Contract):
    invoice_number: str
    total_amount: float
    # ... other fields

class DriverLicenseContract(Contract):
    name: str
    license_number: str
    # ... other fields

## Initialize Extractors for each classification if needed
invoice_extractor = Extractor()
invoice_extractor.load_document_loader(DocumentLoaderPyPdf())
invoice_extractor.load_llm('gpt-4o-mini')

license_extractor = Extractor()
license_extractor.load_document_loader(DocumentLoaderTesseract(tesseract_path))
license_extractor.load_llm('gpt-4o-mini')

## Define Classifications
classifications = [
    Classification(
        name="Invoice",
        description="This is an invoice document",
        contract=InvoiceContract,
        extractor=invoice_extractor
    ),
    Classification(
        name="Driver License",
        description="This is a driver's license document",
        contract=DriverLicenseContract,
        extractor=license_extractor
    )
]

result = process.classify(
    test_file_path,
    classifications,
)
```

### 高级分类策略

ExtractThinker 支持高级分类策略，以提高准确性和可靠性。

**分类策略：**

* **共识**：结合多个分类器的结果以达成共识决策。
* **高阶**：使用高阶推理以实现更准确的分类。
* **阈值**：应用置信度阈值来确定分类的确定性。

**高级分类**

```python
from extract_thinker import ClassificationStrategy

## Initialize multiple Extractors for classification
extractor1 = Extractor()
extractor1.load_document_loader(DocumentLoaderTesseract(tesseract_path))
extractor1.load_llm('gpt-4o')

extractor2 = Extractor()
extractor2.load_document_loader(DocumentLoaderPyPdf())
extractor2.load_llm('gpt-4o-mini')

## Add classifiers to the process
process.add_classify_extractor([[extractor1], [extractor2]])

## Perform classification with a strategy
result = process.classify(
    test_file_path,
    classifications,
    strategy=ClassificationStrategy.CONSENSUS,
    threshold=0.8
)

print("Document classified as:", result.name)
```

### 结合拆分和分类的过程

通过结合拆分和分类，您可以高效处理包含多种内容类型的复杂文档。

**完整的过程工作流**


```python
## Initialize the Process and load components
process = Process()
process.load_document_loader(DocumentLoaderTesseract(tesseract_path))
process.load_splitter(
    ImageSplitter('gpt-4o', strategy=SplittingStrategy.EAGER)
)

## Process the document
test_file_path = 'path/to/your/multi_page_document.pdf'
split_content = process.load_file(test_file_path)\
    .split(classifications)\
    .extract()

## Access the extracted data
for content in split_content:
    if isinstance(content, InvoiceContract):
        print("Extracted Invoice:")
        print("Invoice Number:", content.invoice_number)
        print("Total Amount:", content.total_amount)
    elif isinstance(content, DriverLicenseContract):
        print("Extracted Driver License:")
        print("Name:", content.name)
        print("License Number:", content.license_number)
```
**说明**：

* **load\_file()**：加载文档。
* **split()**：根据分类拆分文档。
* **extract()**：根据为每个分类部分定义的 `Contract` 提取数据。

## 重负载的异步批处理

ExtractThinker 提供了一种批处理功能，利用异步执行有效处理重负载。这使您能够在响应时间不成问题时以**更低的价格处理文档。**

**使用批请求**


```python
...
## Setting the extractor as usual
path = 'path/to/your/document.pdf'
batch_job = extractor.extract_batch(
  path,
  InvoiceContract,
)

## can be "queued", "processing", "completed" or "failed"
status = await batch_job.get_status()

## await for the result 
result = await batch_job.get_result()
```
**说明**：

* **extract\_batch**：启动批量提取过程。
* **BatchJob**：表示批量作业，允许您监控其状态并检索结果。
* **get\_status**：检查批量作业的当前状态。
* **get\_result**：一旦作业完成，检索结果。

### 处理批处理作业状态

批处理作业可以有几种状态：

* **queued**: 作业在队列中，稍后将开始处理。
* **processing**: 作业正在被处理。
* **completed**: 作业已成功完成处理。
* **failed**: 作业处理失败。

**批处理一次处理一个文件**，因此由您控制批次的数量。批处理作业管理所有需要为 OpenAI API 创建的 JSONL 文件，以及输出文件。完成后，无论成功与否，都会删除这些文件。

最后，如果请求时间不是一个限制，**您可以通过这个 ExtractThinker 功能轻松节省 50% 的成本**。

## 结论

在一个数据为王的世界里，**ExtractThinker** 使您能够释放文档的全部潜力。通过智能选择模型，如 **GPT\-4o Mini** 进行快速文本提取，**GPT\-4o** 进行高级分类，以及 **O1** 进行深度推理任务，您可以根据需要定制工作流程，以实现最大效率和准确性。我们探讨了如何选择正确的模型，使用 **DocumentLoaders**，利用 **Extractor** 提取结构化数据，管理复杂工作流程的 **Processes**，以及使用异步 **batch** 处理重负载。

这是我获得 API 中 O1 模型访问权限后创建的一篇文章，解决了一些棘手的问题，比如聚合和计算需要在单独代理中完成的数据。

**如果您觉得这篇文章对您有帮助，请考虑在 GitHub 上为 [ExtractThinker](https://github.com/enoch3712/ExtractThinker) 仓库加星！** 🌟

