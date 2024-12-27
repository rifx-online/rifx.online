---
title: "How to Build Your Own OCR Assistant with Streamlit and Llama 3.2-Vision"
meta_title: "How to Build Your Own OCR Assistant with Streamlit and Llama 3.2-Vision"
description: "This article provides a comprehensive guide on building an Optical Character Recognition (OCR) assistant using Streamlit and Llama 3.2-Vision. It outlines the significance of OCR in automating text extraction from images and documents. The guide includes step-by-step instructions for setting up the necessary environment, installing dependencies, and running the OCR application. It highlights the advantages of using Llama 3.2-Vision, such as high accuracy and advanced formatting. Additionally, it discusses real-world applications of the OCR tool and troubleshooting common issues. The article encourages further enhancements and cloud deployment of the application."
date: 2024-12-27T10:58:08Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*f0fXSegk9ihTiWEo0TB2eg.png"
categories: ["Programming", "Technology", "Computer Vision"]
author: "Rifx.Online"
tags: ["OCR", "Streamlit", "Llama", "Vision", "text-extraction"]
draft: False

---







### Learn with example

OCR (Optical Character Recognition) is a tool that helps automate the process of converting images into text. You must have used it in your phone as it is very common now. From digitizing documents to automating business workflows, OCR is at the heart of many modern solutions. In this guide, we’ll walk you through creating a simple but powerful OCR assistant using Streamlit, Llama 3\.2\-Vision, and Ollama because why not to participate in the race of machine learning models. Fun part is not just you get text out of image but can also summarize it or modify prompt to get whatever you want from the model.

By the end, you’ll have a functional OCR tool that you can use to analyze images for visible text — plus, you’ll gain an understanding of cutting\-edge technologies that are reshaping machine learning.


## What is OCR and Why Use Llama 3\.2\-Vision?


## What is OCR?

OCR is the technology that converts different types of documents — scanned paper documents, photos of documents, or images containing text — into editable and searchable data. Here’s why it matters:

* **Automate Data Entry**: Extract text from scanned forms or invoices.
* **Digitize Records**: Convert old books or papers into digital files.
* **Searchable Documents**: Make image\-based PDFs searchable and easily navigable.


## Why Choose Llama 3\.2\-Vision for OCR?

Llama 3\.2\-Vision is a sophisticated vision model that offers:

* **High Accuracy**: Especially with complex images or documents.
* **Advanced Formatting**: It can maintain text structure and formatting better than traditional OCR models.
* **Adaptability**: Integrates seamlessly with a local server setup for efficient image processing.


## Step\-by\-Step Guide to Building Your OCR Assistant

First, ensure you clone the repository: [https://github.com/MinimalDevops/llama\-ocr.git](https://github.com/MinimalDevops/llama-ocr.git)


```python
git clone https://github.com/MinimalDevops/llama-ocr.git
cd llama-ocr
```

## 1\. Install Ollama and Llama 3\.2\-Vision

To use Llama 3\.2\-Vision, we need Ollama, a local service for running machine learning models.

**Install Ollama**:


```python
curl -sSfL https://ollama.com/download | sh
```
**Install Llama 3\.2\-Vision**:


```python
ollama pull llama3.2-vision
```
This command pulls the Llama 3\.2\-Vision model, making it accessible to your server.

Note: All these models require good Memory and CPU. If GPU is there, its icing on the cake.


## 2\. Set Up Your Development Environment

Using a virtual environment helps avoid conflicts between Python packages.

**Create a Virtual Environment**:


```python
python -m venv venv
source venv/bin/activate 
```
**Activate the Environment**:

* **Windows**: `venv\Scripts\activate`
* **macOS/Linux**: `source venv/bin/activate`


## 3\. Install Dependencies

To keep things simple, use a `requirements.txt` file to install all necessary packages:

**Install Dependencies**:


```python
pip install -r requirements.txt
```
The requirements include:

* `streamlit` for the web interface
* `requests` for making HTTP requests
* `Pillow` for image handling


## 4\. Run the Ollama Server

To use Llama 3\.2\-Vision for OCR, you need to start the Ollama server:


```python
ollama serve
```
Check if model is running:


```python
ollama ps
```
if not, then run it:


```python
ollama run llama3.2-vision
```
This starts the server locally, making it available for processing requests at [`http://localhost:11`434\.](http://localhost:11434.)


## 5\. Run the Streamlit OCR Application

Now that everything is set up, it’s time to run the Streamlit app that will serve as your OCR interface:

**Launch the App**:


```python
streamlit run ocr_app.py
```
**Using the Interface**:

* Upload an image (JPG, JPEG, or PNG).

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*_R_KVy594ccqtjtChDxPyg.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*SaAZDtQs6W7_ykHdQPPK9w.png)

* Click the “Run OCR” button to extract the text.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*so73Gj_zYHANoW2EwDdrDQ.png)

***Note****: I am running 11B parameter model.*


## Real\-World Applications

* **Digitizing Old Records**: Scan handwritten notes or books.
* **Automating Data Collection**: Extract data from receipts or documents to streamline workflows.


## Troubleshooting Common Issues


## 1\. Server Connection Issues

* **404 Error**: Make sure the Ollama server is running before you attempt to use the OCR functionality.
* **Cannot Connect**: Check if the endpoint `http://localhost:11434` is reachable. Ensure there are no firewall or network issues.


## 2\. Dependency Problems

* **Missing Packages**: Always activate your virtual environment and use `pip install -r requirements.txt` to install dependencies.
* **Version Conflicts**: Ensure that the Python version is 3\.8 or higher to avoid compatibility issues.

**Congratulations**! You’ve built your own OCR assistant using Streamlit and Llama 3\.2\-Vision. Here’s what you achieved:

* Installed and set up Ollama and Llama 3\.2\-Vision.
* Created a virtual environment and installed all necessary packages.
* Built a functional OCR tool to analyze text in images.

This is just the beginning! You can further improve the app by:

* **Adding More Models**: Experiment with other OCR models.
* **Deploying It on the Cloud**: Make it accessible over the internet for broader usage.
* **Modify Prompt to do wonders**: Modify the prompt to get summarization as per your need, get more details on the given text in image and what not.


> Explanation of code line by line is given in the [readme.](https://github.com/MinimalDevops/llama-ocr/blob/main/README.md)

Alternatively if you dont like coding and play around, you can use LM Studio.

* Load a model such as “Llava Phi 3 mini”

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Uca_g_NkViZkwyqLfe8_3w.png)

* Upload a image in chat and use chat prompt to get same information

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ULFp1mq6CRPF9p3_pY5JIA.png)

Also, if you like to code, we can use LM Studio API to get same results from Llava Phi in next [blog](https://readmedium.com/how-to-build-your-own-ocr-assistant-with-streamlit-and-llava-phi-450df3966bb3)! That is a Must Read!

We’d love to hear about your experience and any customizations you make — don’t hesitate to share!


