---
title: "使用 Gemini 2.0 提取任何文档 | 使用 ExtractThinker 提取文档智能"
meta_title: "使用 Gemini 2.0 提取任何文档 | 使用 ExtractThinker 提取文档智能"
description: "本文探讨了Google的Gemini 2.0模型与ExtractThinker框架结合，增强智能文档处理（IDP）能力。ExtractThinker是一个开源库，能够协调OCR、分类、文档拆分和数据提取。Gemini 2.0支持多模态输入，适用于快速数据提取。文章详细介绍了Google Document AI的功能及其定价，强调了ExtractThinker在处理复杂文档时的灵活性和效率。通过结合这些工具，用户可以构建高效的IDP工作流，优化成本和准确性。"
date: 2024-12-27T12:59:06Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*u6Q__5Dg6zHmo3sFHOeN4g.png"
categories: ["Technology", "Programming", "Data Science"]
author: "Rifx.Online"
tags: ["Gemini", "ExtractThinker", "DocumentAI", "OCR", "IDP"]
draft: False

---





在本文中，我们将探讨 Google 的 [**Gemini 2\.0**](https://blog.google/technology/google-deepmind/google-gemini-ai-update-december-2024/) 模型如何与 [**ExtractThinker**](https://github.com/enoch3712/ExtractThinker) 结合，增强智能文档处理 (IDP) 的能力。ExtractThinker 是一个开源框架，旨在协调 OCR、分类、文档拆分和数据提取管道。我们将讨论 [**Google Document AI**](https://cloud.google.com/document-ai?gad_source=1&gclid=CjwKCAiAmrS7BhBJEiwAei59i9I2QplzoDpoDvzc5Eav-BPixGEFhY1qrM6lEGRHHRTgn9gu4g7kbxoCQhwQAvD_BwE&gclsrc=aw.ds&hl=en) 的适用性，以及 [**Gemini 2\.0 Flash**](https://deepmind.google/technologies/gemini/flash/) 的新功能，并将通过代码示例和定价见解来总结所有内容。

## 1\. 引言

**智能文档处理 (IDP)** 是将非结构化数据（如发票、驾驶执照和报告）转化为结构化、可操作信息的关键工作流程。尽管大型语言模型 (LLMs) 现在可以直接处理图像和 PDF，但仅仅将图像输入 LLM 并希望获得完美结果往往*不够*。相反，一个强大的 IDP 流水线结合了：

1. **OCR** 或其他布局提取工具（如 Google Document AI、Tesseract 或 PyPDF）。
2. **分类** 以识别文档类型（发票、合同、许可证等）。
3. **拆分** 以处理大型合并文件并将其分解为逻辑部分。
4. **提取** 将信息映射到结构化的 Pydantic 模型中——例如提取发票号码、日期、总金额或解释图表数据。

**ExtractThinker** 是一个处理这些步骤的库，可以开箱即用，让您无缝集成 Google 全新 **Gemini 2\.0** 模型。

## 2\. Google Document AI

在深入讨论基于LLM的提取之前，让我们先谈谈**Google Document AI**。这是来自Google Cloud的解决方案，提供OCR、结构解析、分类和专门领域的提取器（例如，发票解析、W2表格、银行对账单等）。

### Document AI 定价快速概览

Document AI 提供：

* **Document OCR** 每 1,000 页 $1.50（每月最多 5M 页），更高的使用量可享受进一步折扣。
* **Form Parser** 和 **Custom Extractor** 每 1,000 页 $30（每月超过 1M 页可享受折扣）。
* **Layout Parser** 每 1,000 页 $10。
* **预训练** 专用处理器（如美国驾照解析器或发票解析器）按文档或每页收费（例如，发票解析每 10 页 $0.10）。

使用 **ExtractThinker** 时，您可以附加 `DocumentLoaderDocumentAI`，以将 **Document AI** 的 OCR 或表单解析与基于 LLM 的管道统一起来。协同效应强大：Document AI 可靠地提取文本，而 **Gemini** 或其他模型则解读这些文本（加上图像）以生成高级结构化输出。

您可以使用任何处理器，但您应该仅使用 **Document OCR** 或 **Layout Parser**。Document OCR 应与视觉配合使用，而 Layout Parser 应在视觉不可用时使用。视觉是首选选项，如果可能的话，因为这将为 LLM 提供大量上下文，但您也可以使用 Layout 来进行额外处理。您也可以仅使用 Gemini，它将仅通过视觉进行读取。

> ***提示***：如果您想仅使用“纯 LLM 方法”读取图像文档，您可能会遇到幻觉或扫描准确性差的问题。将 Document AI 与 LLM 结合使用通常会产生更精确且具有成本效益的结果。

## 3\. Gemini 2\.0

Google的**Gemini 2\.0**是其多模态模型系列的下一次进化，支持文本、图像、音频以及先进的“代理”功能。在**Gemini 2\.0**中，有多个变体：

* **Gemini 2\.0 Flash**：一种实验性但高速的模型，在IDP工作流中表现出色。非常适合快速从文档中提取数据，并以低延迟处理大规模的文本或图像。
* **Gemini 2\.0 Thinking**：一种更“推理密集型”的模型，能够处理极其复杂的任务，具有更深的思维链和工具使用。

您可以将Gemini 2\.0与ExtractThinker一起使用。**Gemini 2\.0 Flash**特别适合IDP，因为：

1. 它更快，非常适合大规模提取任务。
2. 它支持多模态（图像+文本）输入，这对于读取扫描的页面或图表至关重要。
3. 它能够以低于“高阶”模型的成本很好地处理简单分类和结构化输出。

## 4\. ExtractThinker: LLM的IDP

**ExtractThinker** 是一个灵活的库，它抽象了构建 **智能文档处理** 流程的复杂性。它可以帮助你：

1. **加载** 通过不同的 `DocumentLoader`（Tesseract、PyPDF、Google Document AI、AWS Textract 等）文档。
2. **拆分** 组合文档为单独的文档（例如，将一个文档中的两个文档分开）。
3. **分类** 每个文档，采用多种策略和方法。
4. **提取** 使用基于 Pydantic 的“合同”提取结构化数据。

以下是 ExtractThinker 通常处理 IDP 工作流的高层次示意图：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*QkOd7SbzOzFEXvnTeGGt2Q.png)

但在此之前，如果你还没有安装，请先安装它：


```python
pip install extract-thinker
```

### 文档加载器

下面是一个最小的代码片段，展示如何使用 Google Document AI 作为 `DocumentLoader` 加载 PDF：


```python
from extract_thinker.document_loader.document_loader_google_document_ai import DocumentLoaderDocumentAI

## 初始化 Google Document AI 的 DocumentLoader
doc_loader = DocumentLoaderDocumentAI(
    project_id="YOUR_PROJECT_ID",
    location="us", # 或 eu
    processor_id="YOUR_PROCESSOR_ID",
    credentials="path/to/google_credentials.json"
)

## 现在加载或提取：
pdf_path = "path/to/your/bulk_documents.pdf"
## 你可以直接调用：
pages = doc_loader.load(pdf_path)
```

### 提取

一旦定义了 **DocumentLoader**，下一步就是提取结构化数据。**ExtractThinker** 通过基于 Pydantic 的 **Contract** 实现这一点——一个描述要从文档中提取哪些字段的架构。无论您是在解析发票中的行项目还是驾驶执照中的字段，工作流程始终保持一致。

```python
from extract_thinker import Contract
from extract_thinker import Extractor
from pydantic import Field
from typing import List

class InvoiceLineItem(Contract):
    description: str = Field(description="Description of the item")
    quantity: int = Field(description="Quantity of items purchased")
    unit_price: float = Field(description="Price per unit")
    amount: float = Field(description="Total amount for this line")

class InvoiceContract(Contract):
    invoice_number: str = Field(description="Unique invoice identifier")
    invoice_date: str = Field(description="Date of the invoice")
    total_amount: float = Field(description="Overall total amount")
    line_items: List[InvoiceLineItem] = Field(description="List of items in this invoice")

```
然后我们继续使用 **Extractor**。使用 **DocumentLoader** 指定 **Gemini 2.0 Flash** 作为 **LLM**。可以自由更换其他加载器，如 `DocumentLoaderTesseract` 或 `DocumentLoaderAzureForm`。

```python
## Create Extractor & attach the loader
extractor = Extractor()
extractor.load_document_loader(doc_loader)

## Assign Gemini 2.0 Flash model for extraction
extractor.load_llm("vertex_ai/gemini-2.0-flash-exp")
```
接下来，处理以进行提取。您只需传递 **path or stream** 和定义的 **contract**。您还有其他可选字段，如 **vision**，如果 **vision model**，将把页面转换为图像以供模型使用。

```python
extracted_invoice = extractor.extract(
    source=test_file_path,
    response_model=InvoiceContract,
    vision=False                     
)

## Access the structured data
print("Invoice Number:", extracted_invoice.invoice_number)
print("Invoice Date:", extracted_invoice.invoice_date)
print("Total Amount:", extracted_invoice.total_amount)
for item in extracted_invoice.line_items:
    print(f"Item {item.description}: x{item.quantity} at ${item.unit_price} each.")
```

### 分类

假设我们想将文档分类为**“车辆登记”**或**“驾驶执照。”** 我们可以为每种类型定义基于Pydantic的`Contract`，并将其映射到**ExtractThinker**中的`Classification`对象。像**Gemini 2.0 Flash**这样的快速模型可以处理大多数文档，但如果其置信度低于阈值，我们可以升级到更强大但较慢的**Gemini 2.0 Thinking**。ExtractThinker的多层方法自动化了这种回退逻辑，平衡了成本效率和强大的准确性。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*aNggz6h6DDFi3SGn27yB3A.png)

下面是一个简化的示例，包含两个`Classification`对象：一个用于“驾驶执照”，另一个用于“车辆登记”。（您可以类似地定义“发票”、“信用票据”等。）


```python
from extract_thinker.models.classification import Classification
from tests.models.driver_license import DriverLicense
from tests.models.vehicle_registration import VehicleRegistration

driver_license_class = Classification(
    name="Driver License",
    description="A document representing a driver's license",
    contract=DriverLicense
)

vehicle_registration_class = Classification(
    name="Vehicle Registration",
    description="Official document registering a vehicle ownership",
    contract=VehicleRegistration
)

my_classifications = [driver_license_class, vehicle_registration_class]
```
为了实现回退方法，我们设置了两个**Extractor**实例——一个由**Gemini 2.0 Flash**（快速）驱动，另一个由**Gemini 2.0 Thinking**（回退）驱动。每个`Extractor`都与可以读取您的PDF或图像的`DocumentLoader`相关联（例如，`DocumentLoaderPyPdf`）。


```python
from extract_thinker import Extractor
from extract_thinker.document_loader.document_loader_pypdf import DocumentLoaderPyPdf
from extract_thinker.process import Process, ClassificationStrategy
from extract_thinker.models.classification import Classification

## 1. 定义您的 DocumentLoader
pdf_loader = DocumentLoaderPyPdf()

## 2. 创建两个 Extractors：快速和回退
flash_extractor = Extractor(pdf_loader)
flash_extractor.load_llm("vertex_ai/gemini-2.0-flash-exp")

thinking_extractor = Extractor(pdf_loader)
thinking_extractor.load_llm("vertex_ai/gemini-2.0-thinking-exp")

## 3. 定义分类（例如“车辆登记”和“驾驶执照”）
vehicle_registration = Classification(name="Vehicle Registration", description="...")
driver_license = Classification(name="Driver License", description="...")
my_classifications = [vehicle_registration, driver_license]

## 4. 构建一个 Process 并在不同层中添加两个提取器
process = Process()
process.add_classify_extractor([
    [flash_extractor],     # 层 1
    [thinking_extractor]   # 层 2（回退）
])

## 5. 使用 CONSENSUS_WITH_THRESHOLD 进行分类，阈值为 0.9
pdf_path = "path/to/document.pdf"
result = process.classify(
    pdf_path,
    my_classifications,
    strategy=ClassificationStrategy.CONSENSUS_WITH_THRESHOLD,
    threshold=9,  # 即 0.9 置信度，
    image=False # 如果允许视觉，可以在分类中添加它
)

print("分类为:", result.name)
print("置信度:", result.confidence)
```

### 使用分割器拆分文档

许多 IDP 工作流涉及 **多页** PDF 或混合文档集。例如，一个文件可能包含 **发票** 和 **驾驶执照** 的背面。**ExtractThinker** 提供分割策略以自动分割文档。主要有两种策略：

* **EAGER**：一次性处理整个文件，提前识别所有分割点。
* **LAZY**：逐步比较页面，边比较边决定分割位置。

下面，我们演示如何使用假设的 PDF 文件进行 **EAGER** 分割，该文件结合了不同的表单：

```python
from extract_thinker.process import Process
from extract_thinker.splitter import SplittingStrategy
from extract_thinker.image_splitter import ImageSplitter

## 1. 准备一个 Process
process = Process()

## 2. 分配一个 DocumentLoader（例如，Tesseract、PyPdf 等）或稍后分配 Extractor
## 这里我们在提取器级别或过程级别进行：
## process.load_document_loader(my_loader)

## 3. 指定使用哪个 Splitter
image_splitter = ImageSplitter(model="vertex_ai/gemini-2.0-flash-exp")
process.load_splitter(image_splitter)

## 4. 提供分类——如“发票”与“驾驶执照”
## （已定义为 my_classifications 或来自树）
```
在运行时，**EAGER** 分割将扫描整个文档，检测逻辑边界（基于内容差异），并创建更小的“子文档”，每个子文档都可以被分类和提取。

要将所有内容整合在一起，您需要：

1. **一个 Process**（带有加载的分割器）。
2. **分类** 以识别每一页。
3. **一个 Extractor** 或分配的 LLM。

您可以加载一个文件，进行分割，并在一个链式调用中提取所有内容：

```python
from extract_thinker.models.splitting_strategy import SplittingStrategy

BULK_DOC_PATH = "path/to/combined_documents.pdf"

result = process.load_file(BULK_DOC_PATH)
    .split(my_classifications, strategy=SplittingStrategy.EAGER)
    .extract(vision=True)

## 'result' 是提取对象的列表，每个对象都符合分类的合同
for doc_content in result:
    print(f"提取的文档类型: {type(doc_content).__name__}")
    print(doc_content.json(indent=2))
```
* `load_file(...)`：加载合并的 PDF。
* `split(...)`：使用 **EAGER** 策略分割内容，受 **Splitter** 模型和您的分类指导。
* `extract(...)`：调用您选择的 LLM(s) 将每个分割块解析为结构化的 Pydantic 模型。

这种方法有效处理大型或多文档输入，确保每个子文档被正确分类，然后用最少的额外代码提取。

> 在这个例子中，我们使用 ImageSplitter，但在 **Flash\-Thinking 目前不支持图像。** 您可以使用 `TextSplitter` 代替。

## Document AI的Splitter与ExtractThinker

Google Document AI还提供了一个**Splitter处理器**，它识别子文档边界并为每个段落分配一个**置信度分数**。它输出结构化的JSON（实体列出页面范围、分类标签等）。然而，它有**显著的限制**——例如，不支持拆分大型（超过**30页**）逻辑文档，并且分割器仅在页面边界处拆分文档，而不会实际为您拆分PDF。

相比之下，**ExtractThinker**的做法：

1. **没有严格的页面限制**——它可以通过分块或增量策略（例如，**懒惰**）分析任意长度的文件。
2. **集成分类逻辑**——分割决策可以由**LLM洞察**（例如，Gemini 2.0）驱动，而不是固定的页面级启发式。
3. **执行整个管道**——在单一工作流程中进行提取、分类和分割，具有回退逻辑和基于Pydantic的结构化数据合同。

总之，虽然**Document AI的Splitter在简单情况下表现良好**（特别是如果您需要一个即插即用的处理器来处理较短的文档），但**ExtractThinker**的分割器则更加**灵活**，可以统一高级分类或多层LLM逻辑——这是一个针对大规模复杂IDP管道的全能解决方案。

## 比较定价

虽然谷歌尚未正式发布 **Gemini 2\.0** 基于令牌的定价，但 **Gemini 1\.5** 模型可以作为一个接近的参考。在大多数公开预览中，这些费率适用：

* **输入令牌**：每 **100 万** 令牌 $0\.075
* **输出令牌**：每 **100 万** 令牌 $0\.30

例如，如果您发送 **800** 令牌的文本（提示）并接收 **500** 令牌（模型响应），那么总共是 **1,300** 令牌：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*FaGsrRDfHK7LDFU8VI0NSA.png)

**总计** \= **$0\.00021** 每页。


> ***注意****：输出令牌的价格是输入令牌的 4 倍。**Gemini 2\.0** 的实际价格可能因地区、级别或谷歌的新公告而有所不同。*

### 添加文档 AI 或 OCR

根据您的需求，您可以将 **Gemini** 与以下内容配对：

**Tesseract 或其他 OCR**

* **成本**：通常为 **$0\.00**（开源）。
* 如果与约 1,300 个 token 的 LLM 请求结合，您每页的总成本仍然约为 **$0\.0002** — 对于大批量来说极其便宜。

**文档 AI OCR 或布局**

* 每页的总成本可能为 **$0\.0017 — $0\.0102**，具体取决于文档 AI 处理器。

**文档 AI 专用解析器**（例如，布局）

* 每 10 页约 **$0\.10**（$0\.01/页），如果内置字段足够，则无需 LLM。
* 如果您仍然希望使用 LLM 以获取额外字段或验证，每页增加 $0\.0002（Gemini tokens）。
* 每页总成本约为 **$0\.0102**。

即使在 **低级** 文档 AI 计划中，谷歌的 OCR 也是 **最先进的**，特别适合低质量扫描或手写。如果您的文档是简单的图像（例如，打印文本，良好的对比度），免费 OCR 加上 Gemini tokens 将带来巨大的节省 — 每页 **$0\.0002 对比 $0\.01** 在规模上约为 50 倍的差异。

对于许多用例，使用开源 OCR 或直接 LLM 视觉的 **ExtractThinker** 脱颖而出，成为 **最具成本效益** 的解决方案，同时仍然允许您在需要时结合文档 AI 的高级 OCR 以处理签名或复杂扫描。

## 结论

通过将 **ExtractThinker** 与 **Gemini 2.0** 模型结合，您可以构建一个全面的 IDP 工作流，优雅地平衡速度、成本和准确性。文档加载（通过 **DocumentLoader**）、分类（在信心较低时使用后备层）、提取（使用基于 Pydantic 的 **Contracts**）和 S**plitting** 都在一个单一的、精简的系统中完美结合。无论您是在处理扫描的发票、许可证、多页 PDF 还是其他文档类型，ExtractThinker 都会在文档智能领域为您提供支持！

如果您喜欢这篇文章，请考虑为 [ExtractThinker 仓库](https://github.com/enoch3712/ExtractThinker) 点赞！🌟

