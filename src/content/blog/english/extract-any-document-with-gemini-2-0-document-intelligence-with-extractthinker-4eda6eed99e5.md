---
title: "Extract any Document with Gemini 2.0 | Document Intelligence with ExtractThinker"
meta_title: "Extract any Document with Gemini 2.0 | Document Intelligence with ExtractThinker"
description: "The article discusses the integration of Googles Gemini 2.0 models with ExtractThinker, an open-source framework for Intelligent Document Processing (IDP). It highlights how IDP transforms unstructured data into structured information through a pipeline that includes OCR, classification, splitting, and data extraction. The article details the capabilities of Google Document AI, pricing, and the advantages of using ExtractThinker for document workflows. It emphasizes the synergy between Document AI and Gemini 2.0 for efficient and accurate data extraction, and provides code examples for implementation. Overall, it presents a comprehensive solution for various document processing needs."
date: 2024-12-27T10:50:43Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*u6Q__5Dg6zHmo3sFHOeN4g.png"
categories: ["Technology", "Programming", "Data Science"]
author: "Rifx.Online"
tags: ["Gemini", "ExtractThinker", "DocumentAI", "OCR", "IDP"]
draft: False

---






In this article, we’ll explore how Google’s [**Gemini 2\.0**](https://blog.google/technology/google-deepmind/google-gemini-ai-update-december-2024/) models supercharge Intelligent Document Processing (IDP) when combined with [**ExtractThinker**](https://github.com/enoch3712/ExtractThinker) — an open\-source framework designed to orchestrate OCR, classification, document splitting, and data extraction pipelines. We’ll cover how [**Google Document AI**](https://cloud.google.com/document-ai?gad_source=1&gclid=CjwKCAiAmrS7BhBJEiwAei59i9I2QplzoDpoDvzc5Eav-BPixGEFhY1qrM6lEGRHHRTgn9gu4g7kbxoCQhwQAvD_BwE&gclsrc=aw.ds&hl=en) fits in, and the new features of [**Gemini 2\.0 Flash**](https://deepmind.google/technologies/gemini/flash/), and we’ll wrap it all up with code examples and pricing insights.


## 1\. Introduction

**Intelligent Document Processing (IDP)** is a critical workflow for turning unstructured data (like invoices, driver’s licenses, and reports) into structured, actionable information. Although Large Language Models (LLMs) can now directly process images and PDFs, it’s often *not* enough to simply feed an image into an LLM and hope for perfect results. Instead, a robust IDP pipeline combines:

1. **OCR** or other layout extraction tools (like Google Document AI, Tesseract, or PyPDF).
2. **Classification** to identify the type of document (invoice, contract, license, etc.).
3. **Splitting** to handle large combined files and break them into logical sections.
4. **Extraction** to map information into structured Pydantic models — like extracting invoice number, date, total amount, or interpreting chart data.

**ExtractThinker** is a library that handles these steps out\-of\-the\-box, letting you seamlessly integrate them with the brand\-new **Gemini 2\.0** models from Google.


## 2\. Google Document AI

Before diving into LLM\-based extraction, let’s talk about **Google Document AI**. It’s a solution from Google Cloud that provides OCR, structural parsing, classification, and specialized domain extractors (e.g., invoice parsing, W2 forms, bank statements, and more).


### Document AI Pricing Quick Overview

Document AI offers:

* **Document OCR** at $1\.50 per 1,000 pages (up to 5M pages/month), with further discounts at higher volume.
* **Form Parser** and **Custom Extractor** at $30 per 1,000 pages (discounts after 1M pages/month).
* **Layout Parser** at $10 per 1,000 pages.
* **Pretrained** specialized processors (like US Driver License Parser or Invoice Parser) with a per\-document or per\-page cost (e.g., $0\.10 per 10 pages for invoice parsing).

When using **ExtractThinker**, you can attach a `DocumentLoaderDocumentAI` to unify **Document AI** OCR or form parsing with an LLM\-based pipeline. The synergy is powerful: Document AIreliably extracts text, while **Gemini** or other models interpret that text (plus images) to produce advanced structured output.

You can use any processor, but you should only use **Document OCR** or **Layout Parser. Document OCR should paired with vision, and Layout Parser should be used when vision is not available.** Vision is the preferred option, if possible, since will give a lot of context to the LLM, but you can use Layout to do the extra work. You can also just use Gemini, which will read just with vision.


> ***Tip****: If you want to just do a “pure LLM approach” for reading documents as images, you might run into hallucinations or poor scanning accuracy. Combining Document AI with LLMs typically yields more precise and cost\-effective results.*


## 3\. Gemini 2\.0

Google’s **Gemini 2\.0** is the next evolution of their multimodal model family, supporting text, images, audio, plus advanced “agentic” features. Within **Gemini 2\.0**, there are multiple variants:

* **Gemini 2\.0 Flash**: An experimental but high\-speed model with strong performance for IDP workflows. Great for quickly extracting data from documents, and handling text or images at scale with low latency.
* **Gemini 2\.0 Thinking**: A more “reasoning\-heavy” model that handles extremely complex tasks with a deeper chain\-of\-thought and tool usage.

You can use Gemini 2\.0 with ExtractThinker. **Gemini 2\.0 Flash** is especially well suited for IDP because:

1. It’s faster, making it ideal for large\-scale extraction tasks.
2. It supports multimodal (images \+ text) input, essential for reading scanned pages or charts.
3. It can handle simple classification and structured output well at a lower cost than “higher\-order” models.


## 4\. ExtractThinker: IDP for LLMs

**ExtractThinker** is a flexible library that abstracts away the complexities of building **Intelligent Document Processing** flows. It helps you:

1. **Load** documents via different `DocumentLoader` (Tesseract, PyPDF, Google Document AI, AWS Textract, etc.).
2. **Split** combined documents into separate documents (e.g. separate two documents inside of one).
3. **Classify** each document, with several strategies and approaches
4. **Extract** structured data using Pydantic\-based “Contracts.”

Here’s a high\-level schematic of how ExtractThinker typically handles an IDP workflow:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*QkOd7SbzOzFEXvnTeGGt2Q.png)

But before anything else, install it if you don't have it:


```python
pip install extract-thinker
```

### Document Loader

Below is a minimal snippet showing how to load a PDF using Google Document AI as a `DocumentLoader`:


```python
from extract_thinker.document_loader.document_loader_google_document_ai import DocumentLoaderDocumentAI

## Initialize the DocumentLoader for Google Document AI
doc_loader = DocumentLoaderDocumentAI(
    project_id="YOUR_PROJECT_ID",
    location="us", # or eu
    processor_id="YOUR_PROCESSOR_ID",
    credentials="path/to/google_credentials.json"
)

## Now load or extract:
pdf_path = "path/to/your/bulk_documents.pdf"
## You can directly call:
pages = doc_loader.load(pdf_path)
```

### Extraction

Once your **DocumentLoader** is defined, the next step is extracting structured data. **ExtractThinker** achieves this through a Pydantic\-based **Contract** — a schema describing what fields to pull from the document. The workflow remains consistent whether you’re parsing line items from an invoice or fields from a driver's license.


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
Then we proceed to the **Extractor**. Using the **DocumentLoader** assign **Gemini 2\.0 Flash** as the **LLM**. Feel free to swap in other loaders, like `DocumentLoaderTesseract` or `DocumentLoaderAzureForm`


```python
## Create Extractor & attach the loader
extractor = Extractor()
extractor.load_document_loader(doc_loader)

## Assign Gemini 2.0 Flash model for extraction
extractor.load_llm("vertex_ai/gemini-2.0-flash-exp")
```
Then, it is processed to extract. You just need to pass the **path or stream** and the **contract** defined. You also have other optional fields, like **vision**, that will convert the pages into images to be used inside the model, if the **model of vision**.


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

### Classification

Suppose we want to classify documents as either **“Vehicle Registration”** or **“Driver’s License.”** We can define Pydantic\-based `Contract`s for each type and map them to `Classification` objects in **ExtractThinker**. A fast model like **Gemini 2\.0 Flash** can handle most documents, but if its confidence falls below a threshold, we can escalate to the more capable—and slower—**Gemini 2\.0 Thinking**. ExtractThinker’s multi\-layer approach automates this fallback logic, balancing cost efficiency with robust accuracy.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*aNggz6h6DDFi3SGn27yB3A.png)

Below is a simplified illustration with two `Classification` objects: one for a “Driver’s License” and another for a “Vehicle Registration.” (You could similarly define “Invoice,” “Credit Note,” etc.)


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
To implement a fallback approach, we set up two **Extractor** instances — one powered by **Gemini 2\.0 Flash** (fast) and another by **Gemini 2\.0 Thinking** (fallback). Each `Extractor` is associated with a `DocumentLoader` that can read your PDFs or images (e.g., `DocumentLoaderPyPdf`).


```python
from extract_thinker import Extractor
from extract_thinker.document_loader.document_loader_pypdf import DocumentLoaderPyPdf
from extract_thinker.process import Process, ClassificationStrategy
from extract_thinker.models.classification import Classification

## 1. Define your DocumentLoader
pdf_loader = DocumentLoaderPyPdf()

## 2. Create two Extractors: fast & fallback
flash_extractor = Extractor(pdf_loader)
flash_extractor.load_llm("vertex_ai/gemini-2.0-flash-exp")

thinking_extractor = Extractor(pdf_loader)
thinking_extractor.load_llm("vertex_ai/gemini-2.0-thinking-exp")

## 3. Define Classifications (e.g. "Vehicle Registration" & "Driver License")
vehicle_registration = Classification(name="Vehicle Registration", description="...")
driver_license = Classification(name="Driver License", description="...")
my_classifications = [vehicle_registration, driver_license]

## 4. Build a Process and add both extractors in separate layers
process = Process()
process.add_classify_extractor([
    [flash_extractor],     # Layer 1
    [thinking_extractor]   # Layer 2 (fallback)
])

## 5. Perform classification with CONSENSUS_WITH_THRESHOLD at 0.9
pdf_path = "path/to/document.pdf"
result = process.classify(
    pdf_path,
    my_classifications,
    strategy=ClassificationStrategy.CONSENSUS_WITH_THRESHOLD,
    threshold=9,  # i.e., 0.9 confidence,
    image=False # if vision is allowed, you can add it in the classification
)

print("Classified as:", result.name)
print("Confidence:", result.confidence)
```

### Splitting Documents with a Splitter

Many IDP workflows involve **multi\-page** PDFs or mixed document sets. For instance, one file might contain both an **Invoice** and a **Driver's License** back\-to\-back. **ExtractThinker** offers splitting strategies to segment documents automatically. Two primary strategies are:

* **EAGER**: Process the entire file at once, identifying all split points upfront.
* **LAZY**: Incrementally compare pages, deciding where to split as it goes.

Below, we demonstrate **EAGER** splitting with a hypothetical PDF that combines different forms:


```python
from extract_thinker.process import Process
from extract_thinker.splitter import SplittingStrategy
from extract_thinker.image_splitter import ImageSplitter

## 1. Prepare a Process
process = Process()

## 2. Assign a DocumentLoader (e.g., Tesseract, PyPdf, etc.) or an Extractor later
## Here we do it at the extractor level or process level:
## process.load_document_loader(my_loader)

## 3. Specify which Splitter to use
image_splitter = ImageSplitter(model="vertex_ai/gemini-2.0-flash-exp")
process.load_splitter(image_splitter)

## 4. Provide classifications—like "Invoice" vs "Driver License"
## (already defined as my_classifications or from a tree)
```
At runtime, **EAGER** splitting will scan the entire document, detect logical boundaries (based on content differences), and create smaller “sub\-documents,” each of which can then be classified and extracted.

To put it all together you need:

1. **A Process** (with a loaded splitter).
2. **Classifications** to identify each page.
3. **An Extractor** or LLM was assigned.

You can load a file, split it, and extract it all *in* one chained call:


```python
from extract_thinker.models.splitting_strategy import SplittingStrategy

BULK_DOC_PATH = "path/to/combined_documents.pdf"

result = process.load_file(BULK_DOC_PATH)
    .split(my_classifications, strategy=SplittingStrategy.EAGER)
    .extract(vision=True)

## 'result' is a list of extracted objects, each matching a classification's contract
for doc_content in result:
    print(f"Extracted document type: {type(doc_content).__name__}")
    print(doc_content.json(indent=2))
```
* `load_file(...)`: Loads the combined PDF.
* `split(...)`: Segments the content using **EAGER** strategy, guided by the **Splitter** model and your classifications.
* `extract(...)`: Invokes your chosen LLM(s) to parse each split chunk into a structured Pydantic model.

This approach effectively handles large or multi\-document inputs, ensuring each sub\-document is classified correctly and then extracted with minimal extra code.


> In this example we are using ImageSplitter, but in the case of **Flash\-Thinking doesn’t support image for now.** You can use `TextSplitter` instead.


## Document AI’s Splitter vs. ExtractThinker

Google Document AI also provides a **Splitter processor** that identifies sub\-document boundaries and assigns each segment a **confidence score**. It outputs structured JSON (entities listing page ranges, classification labels, etc.). However, it has **notable constraints** — for example, splitting large (over **30 pages**) logical documents is unsupported, and the splitter only breaks documents at page boundaries without actually splitting the PDF for you.

By contrast, **ExtractThinker**’s approach:

1. **Has no strict page limit** — it can analyze arbitrarily long files through chunking or incremental strategies (e.g., **lazy**).
2. **Integrates classification logic** — Split decisions can be driven by **LLM insights** (e.g., Gemini 2\.0\) instead of fixed page\-level heuristics.
3. **Performs the entire pipeline** — extraction, classification, and splitting in a single workflow, with fallback logic and advanced Pydantic\-based Contracts for structured data.

In short, while **Document AI’s Splitter works well for simpler cases** (especially if you want an out\-of\-the\-box processor for shorter docs), **ExtractThinker**’s splitter is far more **flexible** and can unify advanced classification or multi\-layer LLM logic — an all\-in\-one approach for large\-scale, complex IDP pipelines.


## Comparing pricing

While Google hasn’t officially published **Gemini 2\.0** token\-based pricing, the **Gemini 1\.5** model serves as a close reference. In most public previews, these rates apply:

* **Input Tokens**: $0\.075 per **1 million** tokens
* **Output Tokens**: $0\.30 per **1 million** tokens

For example, if you send **800** tokens of text (prompt) and receive **500** tokens (model response), that’s **1,300** tokens in total:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*FaGsrRDfHK7LDFU8VI0NSA.png)

**Total** \= **$0\.00021** per page.


> ***Note****: Output tokens are 4× more expensive than input tokens. Actual prices for **Gemini 2\.0** may differ by region, tier, or new Google announcements.*


### Adding Document AI or OCR

Depending on your needs, you may pair **Gemini** with:

**Tesseract or Other OCR**

* **Cost**: Typically **$0\.00** (open source).
* If combined with a \~1,300\-token LLM request, your total cost per page remains around **$0\.0002** — extremely cheap for large volumes

**Document AI OCR or Layout**

* The total might be **$0\.0017 — $0\.0102** per page, depending on the Document AI processor.

**Document AI Specialized Parser** (e.g., Layout)

* \~$0\.10 per 10 pages ($0\.01/page), no LLM needed if the built\-in fields suffice.
* If you still want an LLM for extra fields or validation, add $0\.0002 per page (Gemini tokens).
* Total \~$0\.0102 per page.

Even on a **lower\-tier** Document AI plan, Google’s OCR is **state\-of\-the\-art**, especially for poor\-quality scans or handwriting. If your documents are straightforward images (e.g., typed text, good contrast), free OCR plus Gemini tokens yields massive savings — **$0\.0002 vs. $0\.01** per page is a \~50× difference at scale.

For many use cases, **ExtractThinker** with an open\-source OCR or direct LLM vision stands out as **the most cost\-effective** solution, while still allowing you to incorporate Document AI’s advanced OCR for signatures or challenging scans whenever needed.


## Conclusion

By combining **ExtractThinker** with **Gemini 2\.0** models, you can build a comprehensive IDP workflow that elegantly balances speed, cost, and accuracy. Document loading (via **DocumentLoader**), classification (with fallback layers if confidence is low), extraction (using Pydantic\-based **Contracts**), and S**plitting** all come together in a single, streamlined system. Whether you’re processing scanned invoices, licenses, multi\-page PDFs, or other document types, ExtractThinker has your back in the Document Intelligence world!

If you enjoyed this article, please consider starring the [ExtractThinker repository](https://github.com/enoch3712/ExtractThinker)! 🌟


