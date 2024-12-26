---
title: "MarkItDown: A Powerful and must-have Toolkit for LLMs projects, tested with OpenAI and Gemini 2.0"
meta_title: "MarkItDown: A Powerful and must-have Toolkit for LLMs projects, tested with OpenAI and Gemini 2.0"
description: "MarkItDown is a toolkit developed by Microsoft that converts various file formats into Markdown, facilitating the preparation of training data for Large Language Models (LLMs). It supports Office documents, media files, and structured data formats. The toolkit enhances context for LLM applications by providing clean, structured text. Integration examples with OpenAI and Gemini 2.0 Flash models demonstrate its utility in generating grounded responses from documents, enabling applications like document analysis and image-to-image pipelines. The toolkit simplifies the processing of diverse documents for improved training and response accuracy in LLM projects."
date: 2024-12-26T04:30:18Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*tiMyJhGoTluC-uHWRvnOAg.png"
categories: ["Programming", "Machine Learning", "Natural Language Processing"]
author: "Rifx.Online"
tags: ["Markdown", "LLMs", "documents", "OpenAI", "Gemini"]
draft: False

---




*MarkItDown is a versatile utility developed by Microsoft that transforms various file formats into Markdown, making it an essential tool for developers working with Large Language Models (LLMs). Water you want to leverage documents to fine\-tune or create prompt preambles, this is a must have for you. Let’s see how we can leverage it in real applications with OpenAI and Gemini models.*


### Core Capabilities

The [toolkit](https://github.com/microsoft/markitdown) excels at converting multiple document types to Markdown format, including:

* Office documents (PowerPoint, Word, Excel)
* Rich media files (Images with EXIF and OCR, Audio with transcription)
* Web and structured data (HTML, CSV, JSON, XML)
* Archive files (ZIP)


### LLM Integration Benefits

**Training Data Preparation**Converting diverse document formats to Markdown creates clean, structured text that’s ideal for LLM training. This standardization ensures consistent input formatting and improves training efficiency.Context **Enhancement**When building LLM\-powered applications, MarkItDown can process domain\-specific documents to provide rich context for more accurate and relevant responses.

Installing the library is very simple:


```python
pip install markitdown
```
Then for running a simple conversion you need just few lines of code:


```python
from markitdown import MarkItDown

md = MarkItDown()
result = md.convert("technical_doc.xlsx")
processed_content = result.text_content
```
In the case above we are converting an Excel fine to markdown. One advanced integration may look like this:


```python
from markitdown import MarkItDown
from openai import OpenAI

## Initialize OpenAI client
client = OpenAI()

## Configure MarkItDown with LLM capabilities
md = MarkItDown(
    llm_client=client,
    llm_model="gpt-4o-mini"
)

## Process image with LLM-powered description
result = md.convert("diagram.jpg")
enhanced_content = result.text_content
```
The example above initialize the *OpenAI* client, then *Markitdown* is configured to use *gtp\-4 model.* In this case instead of converting a document to markdown we are asking to Gpt to provide the markdown text description of the image. Why does mater? Imagine you want to create a simple **image\-to\-image pipeline***,* you can ask as input (1\) the image (2\) and the text (user input) description of the changes. By concatenating both the image description and the user text changes (both converted to markdown) you can pass it to the image generation model and get the final result.

You could also create a **document analysis pipeline** in this way:


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
This simple function above can process all documents in a folder and get the markdown text to pass to a model for any type of action, like summarization, entity extraction, training, etc..

On of the potential application that popped first in my mind is a **“LLM Context Provider”.** Specifically, creating a function (in the case below a Class with 3 functions) that grounds a LLM response to provided documentation.


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
Let’s review how this simple class works: the *DocumentContextProvider* class serves as a bridge between document processing and LLM interactions, implementing a key pattern for grounded responses.

1\- The constructor initializes a *MarkItDown* instance that will handle all document conversions. The instance maintains state throughout the object’s lifecycle.

2\- The method processes any supported document format and extracts its content in markdown format, making it suitable for LLM consumption.


### Enhanced Implementation with OpenAI LLM Integration

Here’s an expanded version that implements this grounding techniques using **OpenAI API**:


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
The full implementation shared above leverage **OpenAI** *gpt\-4o\-mini* model to pass the parsed document along with the user’s query. For this example, I downloaded the PDF of NVIDIA earnings and asked the model to tell me how Q4 2024 performed. This code works in **Jupyter notebook** for an easy testing.


### Gemini 2\.0 Flash Implementation

Let go straight by creating a simple implementation of the same workflow as above, but this time we leverage the latest breakthrough model from Google: [Gemini 2\.0 Flash](https://ai.google.dev/gemini-api/docs/models/gemini#gemini-2.0-flash).

Here the code to import libraries and creating the class:


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
Make sure before proceeding to get your free API Key from <https://aistudio.google.com/app/apikey>


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
In this case I passed to the LLM via *MarkItDown* the PDF of the NVIDIA earning, and asked about the last financial results and a specific question on the operational margin. I’m going to share the result I got from this iteration:


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
That was a simple and effective example of grounding the LLM model with a PDF document in your hands.

I also created a repository in GitHub with the Gemini workflow you can try \& test locally on your computer:

[manuelec/gemini\-markitdown: A Python toolkit combining Google’s Gemini 2\.0 Flash model with MarkItDown for intelligent document processing](https://github.com/manuelec/gemini-markitdown)

Hope you enjoyed the reading and tested out the code. If yes, clap clap and follow for more.




