---
title: "Unlocking PDFs for RAG with Markdown and Gemini"
meta_title: "Unlocking PDFs for RAG with Markdown and Gemini"
description: "This article discusses a novel technique for extracting text from PDFs in Markdown format to enhance Retrieval Augmented Generation (RAG) applications, particularly using the Gemini model. It highlights the challenges of working with PDFs due to their complex layouts and the limitations of existing Python libraries. The proposed method involves converting each PDF page into an image and using Gemini to generate Markdown, which improves response quality and context. The implementation leverages Google Cloud for efficient parallel processing and concludes by suggesting a comparison with Google Clouds DocumentAI for document parsing."
date: 2024-12-22T03:55:14Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*KWoWZylZN9Gkd1gM56NtFw.png"
categories: ["Programming", "Technology", "Data Science"]
author: "Rifx.Online"
tags: ["PDF", "Markdown", "Gemini", "RAG", "DocumentAI"]
draft: False

---






It’s safe to say that Retrieval Augmented Generation (RAG) has changed the world for many businesses and organizations. By supplementing the built\-in capabilities that an LLM like [Gemini](https://deepmind.google/technologies/gemini/) has with your own information, you can create extremely powerful experiences that are truly transformative.

Despite this, it’s often difficult to create a RAG application that works well with complex unstructured documents like PDFs.

**This article presents a novel technique for extracting text from PDFs in Markdown format, leading to improved accuracy and richer context in Retrieval Augmented Generation (RAG) applications.**

Markdown isn’t just for output. Using Markdown in your prompts can dramatically improve the quality of the model’s responses due to the added nuance it provides compared to plain text.


## The problem with PDFs

PDFs are notoriously difficult to work with. Each document can have a wide variety of layouts, including multiple columns of text, or even text that seems to be randomly distributed on a page. Since PDFs support not only text but also images, some pages may look like text but are actually represented as images. Additionally, PDFs often contain tabular data which can be quite challenging to parse. Finally, it’s quite difficult to extract text from a PDF that also retains formatting information like bold, italics, and bullet points. By extracting only the text, you lose meaning and nuance that were in the original document.

Each of these situations makes it difficult to use PDFs in a RAG application. There are of course a number of Python libraries available that are designed to work with PDF documents like PyPDF, PDFPlumber, or PDFMiner, but almost none of them handle all of the complex situations described above. Depending on the source document, all of these libraries can produce text that’s incomplete or even completely incorrect.

Recently some new approaches have been introduced that use ML models (like [Docling](https://github.com/DS4SD/docling)) to parse PDFs, but they can be extraordinarily slow, and aren’t usable for PDFs beyond just a few pages. (In one test I recently ran on my laptop, it took Docling 18 minutes to parse a 12 page document.)

This blog post describes a new technique to read in PDF files and quickly and efficiently generate accurate corresponding Markdown using Gemini and Google Cloud. The resulting Markdown is well\-suited for indexing into a RAG datastore.


## A word about Markdown

[Markdown](https://en.wikipedia.org/wiki/Markdown) is a simple and compact markup language. Markdown employs a simpler syntax than HTML and CSS, focusing on a limited set of stylistic elements: headings, bold text, italic text, hyperlinks, bullet points, and simple tables.

Most LLMs such as Gemini create output that uses Markdown, and the styling that it provides is extremely helpful in reader comprehension. Having actual bullet points is vastly superior to a plain\-text alternative like using a hyphen at the start of a line, and bold and italicized text can make important information really stand out. Beyond that, Markdown’s ability to organize information into a table can be quite helpful.

Perhaps less intuitively, Markdown is also extremely useful when creating prompts. By selectively highlighting key phrases in your prompt, or organizing information into bulleted lists, we provide the model with more information than just the text content, which improves the model’s understanding and helps it focus on the task at hand.

Even so, it’s important to remember that Markdown is a simple language, and may not support everything you can store in a PDF. For example, Markdown tables do not support spanned rows or columns, which are often found in table headers. That’s important to keep in mind as you test this new approach, since it will affect the accuracy of your extraction for certain PDF files.

Regardless of these limitations, having the ability to extract a PDF’s content as Markdown can be extremely helpful when working on a RAG application. During the chunking and indexing process, you can use the headers to understand sections and subsections, which allows chunking documents into discrete topics. Similarly, tabular data arranged in a Markdown table can help the model understand the content much more easily than using plain text.

To sum up, it’s clear that using Markdown extracted from a PDF can dramatically improve the quality of Gemini’s responses due to the added nuance it provides compared to plain text. Beyond that, it also helps in terms of chunking documents during the RAG ingestion process, since you can use cues like headers to detect logical sections within the document.

Now that we understand how Markdown can help, let’s look at the process to extract it from PDF documents.


## How To Extract Markdown From a PDF

In simple terms, here’s the process for extracting Markdown from a PDF document:

* For each page in the PDF:
\- Create an image of the page
\- Pass that image to Gemini, with a prompt asking it to extract the content of the page as Markdown
* Once all of the individual pages have been processed, combine the markdown from all of the pages into a single Markdown string.

This approach works quite well. Here’s an example, using a page from the instructions for the [state of Illinois tax form 1040](https://tax.illinois.gov/content/dam/soi/en/web/tax/forms/incometax/documents/currentyear/individual/il-1040.pdf). Notice that the page is split into two columns, and the top half of the page is completely separate from the bottom half:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*A1Ryg_j_bWbAHYrT)

And here’s the corresponding Markdown generated by Gemini, rendered so you can see the use of bullet points, headers, and the like:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*7XFQDStvA8Gds8Cg)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*UPz4Pq4eygFcCnLc)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*AUMp0DlHdHIzuT9X)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*UDIxS5mXEjKPhDAa)

As you can see, the quality of the extracted markdown is very good, as it generally reflects how a human being would read the page. Notice that “Step 2” (the top half of the page) is described fully before “Step 3” (the bottom half.)

Additionally, markdown is produced that designates bullet point lists, bolded text, headings, and more. All of this adds meaning to the raw text that is extracted, which will typically produce better results when passing this markdown to Gemini. And, as stated earlier, having headings and subheadings helps us chunk a document into logical groupings, which will help with the RAG retrieval process.


## Implementation Details

Depending on your use case, you could simply loop through each page within a PDF, extract a page image, and then pass it to Gemini in order to obtain the markdown. However, when approaching this problem, it’s good to think about scaling.

On my laptop, extracting an image for the above example page took 0\.140 seconds, so that part of the algorithm is extremely quick. However, calling Gemini 1\.5 Flash to extract the Markdown took 23\.857 seconds, which can quickly add up for longer PDF documents.

Luckily, this problem fits very well with a [map\-reduce](https://en.wikipedia.org/wiki/MapReduce) approach. This approach first splits work into multiple parts, each of which runs in parallel. That part is called the **map** step. Then, when all of the parallel parts are complete, the results are combined or aggregated, which is called the **reduce** step.

In our case, we can process each page separately and then combine the markdown for all of the pages once all pages are processed. By leveraging Google Cloud, we can distribute the work using a [PubSub](https://cloud.google.com/pubsub?hl=en) topic, and process each page using a [Cloud Run Function](https://cloud.google.com/functions?hl=en). Here’s a diagram that illustrates this approach:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*KfHSQiozPJK1UeSZ)

Reading from left to right, these steps are taken:

1. When a PDF file is placed in a Google Cloud Storage bucket, it causes a Cloud Function to be run.
2. That function copies the PDF from the bucket to the function’s local storage, then opens it simply to determine how many pages it contains. Then, for each page, the function writes a small JSON item to the PubSub topic, which contains the name of the PDF, the page number to process (from 0 to N — 1, where there are N pages), and the total number of pages found in the PDF.
3. The Page Handler cloud function is triggered when a new item shows up in the PubSub topic. Note that several invocations of this function can be run at the same time through the [parallel processing facilitated by Cloud Run](https://cloud.google.com/functions/docs/configuring/concurrency). You can specify the maximum concurrency when configuring the function.
4. The function copies the PDF from the bucket to the function’s local storage, opens the PDF, renders an image for the page in question (that is, the page number in the JSON data retrieved from the topic), and then calls Gemini via the Vertex AI API to get the Markdown.
5. Once the page Markdown is obtained from Gemini, it is stored in a BigQuery table, which has fields for the file name, the page number, and the extracted markdown string.

These steps extract markdown for each page (the **map** part of map\-reduce), but we still need to address the **reduce** step where all of the individual page markdown is combined into a single string.

In this case, the simplest approach is to have the page handler function check if it is the last page in the document. By counting the number of pages in the BigQuery table for the given document, we can determine if all processing is complete (which is why we passed the total number of pages in as part of the data on the PubSub topic.)

In short, after the page handler function finishes processing the page, it counts the number of completed pages from the BigQuery table for the document in question, and if it matches the total number of pages, then all of the individual page markdown strings are retrieved (ordered by page number) and combined into a single string. At that point we can store the document Markdown in a file, or perform more processing (such as using the extracted Markdown as part of another prompt sent to Gemini) if desired.


## Implementation Code

First, let’s look at the code for the PDF file handler — the function that is invoked when a PDF file is placed in a bucket. We use the PDF library [PyPdfium](https://pypi.org/project/pypdfium2/) to count the number of pages.


```python
from google.cloud import storage, pubsub_v1
import os
from typing import Callable
from concurrent import futures
import pypdfium2 as pdfium
import json

## project ID
project_id = os.getenv("PROJECTID")
## the pubsub topic we're writing to
pubsub_topicname = os.getenv("TOPICNAME")
publisher = pubsub_v1.PublisherClient()
topic_path = publisher.topic_path(project_id, pubsub_topicname)


def handle_new_file(event, context):
    # copy file from cloud storage into local storage
    bucketname = event['bucket']
    filename = event['name']
    if filename.lower().endswith('.pdf') is False:
        print(f"File {filename} is not a PDF file, skipping")
        return
    localname = '/tmp/test.pdf'
    download_to_local(bucketname, filename, localname)

    # Determine how many pages there are
    num_pages = len(pdfium.PdfDocument(localname))

    # For each page, post a message
    publish_futures = []
    for page_num in range(num_pages):
        # Create a JSON object with the file name, page number to process, and total number of pages
        data = json.dumps({"filename": filename, "pagenum": page_num, "totalpages": num_pages}).encode('utf-8')

        # Non-blocking. Publish failures are handled in the callback function.
        future = publisher.publish(topic_path, data)
        future.add_done_callback(get_callback(future, data))
        publish_futures.append(future)

    # Wait for all the publish futures to resolve before exiting.
    futures.wait(publish_futures, return_when=futures.ALL_COMPLETED)

    # then delete the local file and exit
    os.remove(localname)


def download_to_local(bucketname, filename, localname):
    bucket = storage_client.bucket(bucketname)
    blob = bucket.blob(filename)
    blob.download_to_filename(localname)


def get_callback(publish_future: pubsub_v1.publisher.futures.Future, data: str) -> Callable[[pubsub_v1.publisher.futures.Future], None]:
    def callback(publish_future: pubsub_v1.publisher.futures.Future) -> None:
        try:
            # Wait 60 seconds for the publish call to succeed.
            publish_future.result(timeout=60)
        except futures.TimeoutError:
            print(f"Publishing {data} timed out.")
    return callback
```
Now let’s look at the function that processes an individual page.


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
    # Decode the message data
    message_bytes = base64.b64decode(event['data'])
    message_str = message_bytes.decode('utf-8')
    message_json = json.loads(message_str)

    # Get information about the page we should process
    filename = message_json.get("filename")
    pagenum = message_json.get("pagenum")
    totalpages = message_json.get("totalpages")

    # retrieve the file, extract the page in question, convert it to an image,
    # and use Gemini to get the markdown for it
    download_to_local(BUCKET, filename, "temp.pdf")
    markdown = get_markdown_for_page("temp.pdf", pagenum)
    save_page_info(filename, pagenum, markdown)

    # now check if all of the pages have been processed
    num_pages_for_filename = get_num_pages_for_filename(filename)
    if num_pages_for_filename == totalpages:
        # retrieve the markdown for all pages, combine, and then store as a file
        # in the future, we will now pass this string to Gemini to get the product info
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
As you can see, this function calls a couple of additional modules. First, here’s the **read\_pdf.py** module for extracting the image and then calling Gemini for the markdown:


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
    bitmap = page.render(scale=2)    # 72dpi resolution x 2
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
        [image1, "Examine the image and return all of the text within it, converted to Markdown. Make sure the text reflects how a human being would read this, following columns and understanding formatting. Ignore footnotes and page numbers - they should not be returned as part of the Markdown. Only generate markdown for the text found on the page."],
        generation_config=generation_config,
        safety_settings=safety_settings,
        stream=True,
    )

    response_text = []
    for response in responses:
        response_text.append(response.text)
    return "".join(response_text)
```
As you can see, the prompt we use to extract the Markdown is the following:


```python
Examine the image and return all of the text within it, converted to 
Markdown. Make sure the text reflects how a human being would read this, 
following columns and understanding formatting. Ignore footnotes and 
page numbers - they should not be returned as part of the Markdown. 
Only generate markdown for the text found on the page.
```
Finally, there are a couple of functions we use when interacting with BigQuery, which are located in the **bigquery.py** module:


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

    # Insert the extracted fields as a new row
    try:
        errors = bq_client.insert_rows_json(
            table_ref,
            [{
                "filename": filename,
                "pagenum": pagenum,
                "markdown": markdown
            }])

        if errors == []:
            logger.log_text("Data inserted into table")
        else:
            logger.log_text(f"Errors encountered while inserting data: {errors}", severity="ERROR")
    except Exception as e:
        logger.log_text(f"Error inserting data into BQ: {e}", severity="ERROR")


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
    # combine into one string
    parts = [row.markdown for row in results]
    return "\n".join(parts)
```
Note that this code assumes that the BigQuery table **pdf2markdown** has already been created. Although you can create the table via code if it doesn’t exist, there is often a slight delay before you can insert data into that table, which can result in errors. Best practice is to create the empty table outside of your code first by using Terraform or some other Infrastructure As Code (IAC) approach.


## Conclusion

This article talks about the challenges that come with working with PDF documents, specifically for a RAG application. Since PDF files were designed primarily to support almost any imaginable layout, they are very often quite difficult to work with when attempting to extract the text and related contextual information like headings, tables, etc.

Markdown, on the other hand, is very well\-suited for use with a LLM like Gemini, both in terms of adding readability and context to the output, but also for constructing prompts, and when chunking and indexing documents for a RAG solution. The challenge is to extract content from a PDF in Markdown format.

By turning each page of a PDF into an image, and then asking Gemini to extract the page content as Markdown, we can quickly and easily extract both the text and the context of the text from the document. And by leveraging the power of Google Cloud, we can make that process extremely efficient by processing many pages in parallel, only to combine the results once all pages have been processed.

Finally, another option to explore is Google Cloud’s [DocumentAI](https://cloud.google.com/document-ai/docs/overview), which uses Google Foundation models to parse and chunk documents. It also has built\-in OCR support, which allows parsing of image\-based pages. You may wish to compare that approach with the approach described here, in order to determine the best approach for your documents. Keep in mind that DocumentAI does not return Markdown, so you should take that into account when deciding which approach to take.


