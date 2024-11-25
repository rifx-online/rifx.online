---
title: "Scaling Document Extraction with O1, GPT4o, and Mini | ExtractThinker"
meta_title: "Scaling Document Extraction with O1, GPT4o, and Mini | ExtractThinker"
description: "The article discusses the ExtractThinker library, designed for efficient document processing at scale. It details the components such as DocumentLoader, LLM, and Extractor, and outlines the use of various models (GPT-4o, O1) for different extraction tasks. The library supports advanced features like asynchronous batch processing, OCR integration, and the definition of Contracts for structured data extraction. Additionally, it emphasizes the importance of selecting the right model based on performance, accuracy, and cost, providing practical code examples for implementation."
date: 2024-11-25T15:00:22Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*vjrBW5a2WahkFj0XkpXhtw.png"
categories: ["Programming", "Technology", "Data Science"]
author: "Rifx.Online"
tags: ["ExtractThinker", "DocumentLoader", "LLM", "Extractor", "Contracts"]
draft: False

---






In this article, we’ll explore using [ExtractThinker](https://github.com/enoch3712/ExtractThinker) to process documents efficiently at scale. We’ll discuss when to use different models like O1, GPT4o, and their mini versions, how to handle OCR, extract charts, and manage heavy loads using asynchronous batch processing.


## Introduction to ExtractThinker

Is a flexible document intelligence library that helps you extract and classify structured data from various documents, acting like an ORM for document processing workflows. One phrase you say is **“Document Intelligence for LLMs”** or **“LangChain for Intelligent Document Processing.”** The motivation is to create niche features required for document processing, like **splitting** large documents and **advanced classification**.

The image below maps everything that will be discussed:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*k-5aAy6-hoSxLCtTwL9A8Q.png)


### DocumentLoader

DocumentLoader is the connection between the document and the LLM, usually done on an SOTA OCR. Support for multiple document loaders, including Tesseract OCR, Azure Form Recognizer, AWS Textract, Google Document AI, and more.


### LLM

It's the decorator of a model. It’s built on top of tools like [LiteLLM](https://www.litellm.ai/) and [Instructor](https://github.com/instructor-ai/instructor) to facilitate agnostic usage. Is designed around the need for document intelligence.


### Contract

Also a decorator, but of Pydantic. The objective is to include custom features like validators and prompt engineering to be injected and treated automatically.


### Extractor

Orchestrate the interaction between the document loaders and LLMs to extract structured data.


### Process

Represents a flow across the file. Is built on top of the components above. You can pick **DocumentLoaders** for certain use cases, as well as **Extractors**.

There are other smaller components like **Splitters** and **Classifications**, but we are going to look at them in context with proper examples.


## Choosing the Right Model

Selecting the appropriate model is crucial for balancing performance, accuracy, and cost. Firstly let's take a look at the costs:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*NLoXSsgU8TgumzynudILFA.png)


### GPT\-4o mini

**Use case**: Basic text extraction tasks, similar to OCR.

Ideal for extracting text from documents where you must convert images or PDFs into machine\-readable text. Cost\-effective and fast, making it suitable for high\-volume processing.


### GPT\-4o

**Use case**: Classification and splitting.

GPT\-4o models give you an added understanding of the content and structure of documents. Perfect for classifying documents, splitting combined documents into individual sections, and performing sophisticated classification tasks.

**When to use**:

* Categorizing documents into types like invoices, contracts, or receipts.
* Splitting multi\-page documents into individual sections based on content.
* Advanced classification where understanding context and nuances is important.


### o1 and o1\-mini Models

**Use it for**: Advanced extraction tasks that require reasoning and generating conclusions from data.

**o1 and o1\-mini models** are designed for complex extraction scenarios where the model needs to perform deeper analysis and reasoning. For example, extracting data from charts, interpreting values, and calculating aggregated metrics like GDP per capita based on extracted coordinates.

**When to use**:

* Performing calculations or generating insights based on extracted data.

The verbose description above can be packed up in the image below:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*P5Dijb-2wwHz8pzMsEs4iQ.png)


## Using DocumentLoader in ExtractThinker

In ExtractThinker, the **DocumentLoader** is a crucial component that **bridges your documents and the LLM**. It handles the extraction of text and layout information from various document formats using SOTA OCR technologies or direct text extraction tools.


### OCR vs Pure Vision

You can extract data perfectly well just using LLMs, but the problems are twofold: **Hallucinations and Precision.** Hallucinations can happen if the data is not visible enough or clear enough. **OCR will give you exactly what you want in terms of data, the LLM will give you the structure.** Precision will be a problem in certain documents with signatures for example, an OCR will take this just fine.

So in production cases, try to use an OCR with Vision active. **This will add the OCR text \+ Image to the LLM request.**

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*pPQXQILNrADbfYY8lbxskg.png)


### Available DocumentLoaders

ExtractThinker offers several DocumentLoaders, including:

* **DocumentLoaderTesseract**: Uses Tesseract OCR for text extraction from images or scanned PDFs.
* **DocumentLoaderPyPdf**: Extracts text directly from PDFs using PyPDF, suitable for digitally generated PDFs.
* **DocumentLoaderAWSTextract**: Integrates with AWS Textract for advanced OCR capabilities.
* **DocumentLoaderAzureForm**: Utilizes Azure Form Recognizer for extracting structured data.
* **DocumentLoaderGoogleDocumentAI**: Connects to Google Document AI for OCR and data extraction.

It contains two main methods, **load** called on **extract(),** and **load\_content\_list** called in the **split().**

**Getting content from DocumentLoader**


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

## Extractor: Extracting Structured Data and Charts

The **Extractor** is a core component in ExtractThinker that orchestrates the interaction between your **DocumentLoader** and the **LLM** to extract structured data from documents. It leverages the capabilities of LLMs to interpret and organize the extracted text according to predefined data structures called **Contracts**.


### Defining Contracts

Contracts are Pydantic models that define the structure of the data you want to extract from your documents. They act like schemas that the Extractor and LLM use to parse and organize the extracted information.

**Defining a Contract for Invoices**


```python
from extract_thinker import Contract
from pydantic import Field
from typing import List

class InvoiceLineItem(Contract):
    description: str = Field(description="Description of the item")
    quantity: int = Field(description="Quantity of the item")
    unit_price: float = Field(description="Unit price of the item")
    amount: float = Field(description="Total amount for the item")

class InvoiceContract(Contract):
    invoice_number: str = Field(description="Invoice number")
    invoice_date: str = Field(description="Date of the invoice")
    total_amount: float = Field(description="Total amount of the invoice")
    line_items: List[InvoiceLineItem] = Field(description="List of line items in the invoice")
```
This contract specifies that we want to extract the invoice number, date, total amount, and line items, each with their details.

**Extracting Data from an Invoice**


```python
import os
from extract_thinker import Extractor
from extract_thinker.document_loader import DocumentLoaderPyPdf  # Or any other suitable DocumentLoader

## Initialize the Extractor
extractor = Extractor()

## Load the DocumentLoader
extractor.load_document_loader(DocumentLoaderPyPdf())

## Load the LLM
extractor.load_llm('gpt-4o-mini')  # Use the appropriate model for your use case

## Define the path to your document
test_file_path = 'path/to/your/invoice.pdf'

## Perform the extraction
result = extractor.extract(test_file_path, InvoiceContract)

## Access the extracted data
print("Invoice Number:", result.invoice_number)
print("Invoice Date:", result.invoice_date)
print("Total Amount:", result.total_amount)
for item in result.line_items:
    print(f"Item: {item.description}, Quantity: {item.quantity}, Unit Price: {item.unit_price}, Amount: {item.amount}")
```

### Extracting Data from Charts

Extracting data from charts requires a more advanced Contract that can handle the structure of a chart, including its type, description, and data points.

**Defining a Contract for Charts**


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
This contract allows us to extract not only the textual content but also the details of the chart, including its data points.

**Extracting Chart Data**


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
**Note**: For picking the model remember the rule of thumb. If conclusions need to be made based on the data, in this case, the calculation of the GDP, you must use **o1 models.**


## Processes: Splitting and Classification

In ExtractThinker, the **Process** component represents a workflow that orchestrates the loading, splitting, classifying, and extracting of data from documents. This modular approach allows you to handle complex document processing tasks efficiently.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*U6eFz89-NNO9sAWGwx6Z1w.png)


### Understanding Processes

* **Purpose**: Manage a sequence of operations on documents, including loading, splitting, classification, and extraction.
* **Components**: Combines **DocumentLoaders**, **Splitters**, **Classifications**, and **Extractors** to create a flexible processing pipeline.
* **Flexibility**: Customize workflows according to your specific needs by mixing and matching different components.


### Splitting Documents

When dealing with multi\-page or combined documents, splitting them into individual sections or pages is crucial for accurate processing. ExtractThinker provides splitting strategies to handle this effectively.

**Eager Splitting:** This strategy processes the entire document at once, identifying all split points upfront. It is best suited for small to medium\-sized documents that fit within the model’s context window, offering a simpler implementation and faster processing for smaller inputs.

**Lazy Splitting:** This approach processes the document incrementally, evaluating smaller chunks to determine where to split. It is ideal for large documents that exceed the model’s context window, making it a scalable and efficient option for handling large volumes of data.


### Using Splitters

ExtractThinker offers different Splitters, such as `ImageSplitter` and `TextSplitter`, to handle splitting logic.

**Setting Up a Splitter**


```python
from extract_thinker import Process, SplittingStrategy
from extract_thinker.splitter import ImageSplitter
from extract_thinker.document_loader import DocumentLoaderTesseract

## Initialize the Process
process = Process()

## Load the DocumentLoader
tesseract_path = os.getenv('TESSERACT_PATH')
process.load_document_loader(DocumentLoaderTesseract(tesseract_path))

## Load the Splitter with the desired model and strategy
process.load_splitter(
    ImageSplitter('gpt-4o', strategy=SplittingStrategy.EAGER)
)
```

### Classification

Classification is about identifying the type of document or section you’re dealing with, such as invoices, contracts, or driver’s licenses. This is essential when different types of documents require different extraction logic.

Classifications are defined using the `Classification` class, specifying the name, description, and associated `Contract`, and the `Extractor` to use.

**Using Classifications with multiple Extractors**


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

### Advanced Classification Strategies

ExtractThinker supports advanced classification strategies to improve accuracy and reliability.

**Classification Strategies:**

* **Consensus**: Combines results from multiple classifiers to reach a consensus decision.
* **Higher Order**: Uses higher\-order reasoning for more accurate classification.
* **Thresholding**: Applies confidence thresholds to determine classification certainty.

**Advanced classification**


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

### Combining Splitting and Classification in a Process

By combining splitting and classification, you can process complex documents containing multiple types of content efficiently.

**Complete process workflow**


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
**Explanation**:

* **load\_file()**: Loads the document.
* **split()**: Splits the document based on classifications.
* **extract()**: Extracts data according to the defined `Contract` for each classified section.


## Async Batch Processing for Heavy Loads

ExtractThinker offers a batch processing feature that leverages asynchronous execution to handle heavy workloads effectively. This allows you to process documents at a **lower price when response time is not a concern.**

**Using batch requests**


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
**Explanation**:

* **extract\_batch**: Starts the batch extraction process.
* **BatchJob**: Represents the batch job, allowing you to monitor its status and retrieve results.
* **get\_status**: Checks the current status of the batch job.
* **get\_result**: Retrieves the results once the job is completed.


### Handling Batch Job Status

The batch job can have several statuses:

* **queued**: The job is in the queue and will start processing soon.
* **processing**: The job is currently being processed.
* **completed**: The job has finished processing successfully.
* **failed**: The job failed to process.

**The batch is done one file at a time**, so is up to you to control the amount of batches on your side. The batchjob manages all the JSONL files needed to be created for the OpenAI API, and the same for the output. When completed, successfully or not, deletes the files.

To conclude, if request time is not a constraint, **you can easily cut 50% of the cost with this ExtractThinker feature**.


## Conclusion

In a world where data is king, **ExtractThinker** empowers you to unlock the full potential of your documents. By intelligently choosing between models like **GPT\-4o Mini** for swift text extraction, **GPT\-4o** for advanced classification, and **O1** for deep reasoning tasks, you can tailor your workflows for maximum efficiency and accuracy. We’ve explored selecting the right models, using **DocumentLoaders**, extracting structured data with the **Extractor**, managing complex workflows with **Processes**, and handling heavy loads with async **batch**.

This is an article created once I got access to O1 models in the API, that solved a couple of tricky problems, like aggregation and calculation of data that would need to be done in a separate agent.

ExtractThinker is close to being released, and this is a compilation of what the documentation is going to look like.

**If you found this article helpful, please consider starring the [ExtractThinker](https://github.com/enoch3712/ExtractThinker) repository on GitHub!** 🌟


