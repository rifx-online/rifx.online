---
title: "Gemini 2.0 Flash + Local Multimodal RAG + Context-aware Python Project: Easy AI/Chat for your Docs"
meta_title: "Gemini 2.0 Flash + Local Multimodal RAG + Context-aware Python Project: Easy AI/Chat for your Docs"
description: "The article presents a tutorial on creating a local multimodal Retrieval-Augmented Generation (RAG) chatbot using Googles Gemini 2.0 Flash model. Released in December 2023, this lightweight model boasts improved speed and performance, supporting multimodal inputs and outputs. The tutorial details the coding process, including PDF processing, image conversion, and embedding generation, to enable efficient question-answering from documents. It emphasizes context-aware responses to enhance the AIs relevance and accuracy. Overall, it highlights Gemini 2.0 Flashs potential in developing intelligent agents for various applications."
date: 2024-12-22T03:46:35Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*5mhjGURhXDnPnulgwr8d7g.png"
categories: ["Programming", "Chatbots", "Generative AI"]
author: "Rifx.Online"
tags: ["Gemini", "RAG", "multimodal", "embeddings", "chatbot"]
draft: False

---






In this video, I have a super quick tutorial showing you how to create a local Multimodal RAG, Gemini 2\.0 Flash and Context\-aware response to make a powerful agent chatbot for your business or personal use — one that doesn’t require a powerful laptop.

At the end of the year, the competition between big\-model products kicked up again. In my last video, I have covered LLama3\.3\.

On December 11, Google released **Gemini 2\.0 Flash.** As the model name suggests, it has low latency and high performance, and Google plans to make it the core engine for the large\-scale application of Google\-related products.

Gemini 1\.5 Flash is a favourite among developers. Building on the success of Gemini 2\.0 Flash, it delivers improved performance while maintaining fast response times. Notably, the new model outperformed the 2\.0 Pro in key benchmarks by twice as much speed.

It introduces expanded capabilities, including support for multimodal input such as images, video and audio, and multimodal output such as text paired with AI\-generated images and manipulated multi\-language text\-to\-speech (TTS) audio. This AI model can also natively call tools like Google Search to execute code and access user\-defined third\-party functions.

Multimodal RAG allows the RAG system to inject multiple forms of information into the multimodal model, allowing the system to retrieve text snippets based on user prompts and text, images, videos, and other data in different modalities.

Guys, if you want to know more about Multimodal RAG, I have covered a cool video about CoPali and Ollama OCR. It is well\-explained and easy to understand. In this video, we use the same concept of CoPali but in a programmatic way.

So, let me give you a quick demo of a live chatbot to show you what I mean.







I will upload a PDF that includes a table and a chart and then ask the chatbot a question: Summarize this PDF. Feel free to ask any question you want. If you look at how the chatbot generates the output, you will see that it starts by converting PDF pages into images using PyMuPDF and Pillow. It processes each page, adjusts the resolution, converts it to PNG, and generates embeddings with built\-in rate limiting to ensure compliance with API restrictions by retrying if the limit is exceeded.

It then answers user questions by identifying the most relevant passage in a DataFrame to a given query and calculating embedding similarity using the dot product. The agent follows text\-based instructions to ensure precise summaries are designed for embedding and retrieval tasks. and another agent analyzes the page to avoid missing information or fabricated details before generating the output.


## Before we start! 🦸🏻‍♀️

If you like this topic and you want to support me:

1. **Clap** my article 50 times; that will really help me out.👏
2. [**Follow**](https://medium.com/@mr.tarik098) me on Medium and subscribe to get my latest article for Free🫶
3. Join the family — Subscribe to [**YouTube channel**](https://www.youtube.com/channel/UC6P5WCWjqhhXVFBqbJHNxyw)

In this video, I will explain what Gemini 2\.0 Flash and Context\-aware responses are, what the Features of Gemini 2\.0 Flash and how to create a powerful chatbot with Gemini 2\.0 Flash, local Multimodal RAG and Context\-aware responses


## What Gemini 2\.0 Flash is

Gemini 2\.0 Flash is a lightweight model that is the successor to Gemini 1\.5 Flash.

Lightweight models are generally ‘cheap’ and ‘fast,’ but they often have lower response accuracy compared to heavy models.

Essentially, it is an option to reduce costs and latency when the high response accuracy of heavy models is not required. Gemini 2\.0 Flash goes beyond being merely a knowledge base, allowing Gemini 2\.0 to obtain information and process tasks on its own.


## Features

The core upgrades of the Gemini 2\.0 Flash experimental version released this time are as follows:

* **Breakthrough in speed and performance**: Gemini 2\.0 Flash outperforms Gemini 1\.5 Pro on key benchmarks and is twice as responsive.
* **Multimodal output**: supports native generation of text, audio, and images, enabling more complex interactions.
* **Intelligent tool use**: Models are trained to use tools such as Google search and code execution, enhancing their ability to obtain information and perform tasks.

As shown in the figure below, Gemini 2\.0 Flash performs well in multiple benchmarks, even surpassing Gemini 1\.5 Pro. These features make Gemini 2\.0 Flash not only a faster version but also a powerful platform that can provide intelligent interaction, suitable for complex task processing and real\-time response.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*-B3LGfzIziCpLK9rZpJaDg.gif?output=gif&n=50)


## What Context\-aware responses?

Context awareness is huge for AI agents because if we want them to be efficient and give us an output using the knowledge we carry in our minds, they need to understand the context we already have. It would create more work for someone to manually type out their thoughts so there are different ways of collecting the context to consider.

context awareness enhances the relevance and quality of AI outputs by ensuring that they are not only technically accurate but also contextually appropriate.


## Let’s start coding

Now, let’s get on with the guide on how to build an AI chatbot using Gemini 2\.0 Flash \+ Multimodal RAG \+ Context\-aware When it comes to creating this chatbot, we will create an ideal environment for the code to work. we need to install the necessary Python libraries. For this, we will do a pip install of the libraries below.


```python
pip install -r requirements.txt
```
Once installed we import the important dependencies like

rate\-limit to control the rate of requests sent or received by a network interface controller, Fitz to parse PDFs, split and merge PDFs and google to handle API


```python
import os
import numpy as np
import pandas as pd
from tqdm import tqdm
from typing import List, Dict
from google import genai
from google.genai import types
import textwrap
from dataclasses import dataclass
from PIL import Image
import time
from ratelimit import limits, sleep_and_retry
import fitz
import io
from dotenv import load_dotenv
import streamlit as st
```
Let’s `Config` class to provide an easy and structured way to manage application settings. I use default values for critical parameters like model name, text embedding model ID, and image resolution.


```python
@dataclass
class Config:
    """Configuration class for the application"""
    MODEL_NAME: str = "gemini-2.0-flash-exp"  # Updated to match Google's example
    TEXT_EMBEDDING_MODEL_ID: str = "text-embedding-004"  # Correct embedding model name
    DPI: int = 300  # Resolution for PDF to image conversion
```
We create a pdf\_to\_images function in the `PDFProcessor` converts PDF pages into high\-quality images using PyMuPDF and Pillow. It processes each page, adjusts the resolution, converts it to a PNG byte stream, and returns a list of PIL images for further analysis. This method is flexible, supporting DPI adjustments, and is ideal for document analysis or vision\-based AI models.


```python
class PDFProcessor:
    """Handles PDF processing using PyMuPDF and Gemini's vision capabilities"""
    
    @staticmethod
    def pdf_to_images(pdf_path: str, dpi: int = Config.DPI) -> List[Image.Image]:
        """Convert PDF pages to PIL Images"""
        images = []
        pdf_document = fitz.open(pdf_path)
        
        for page_number in range(pdf_document.page_count):
            page = pdf_document[page_number]
            pix = page.get_pixmap(matrix=fitz.Matrix(dpi/72, dpi/72))
            
            # Convert PyMuPDF pixmap to PIL Image
            img_data = pix.tobytes("png")
            img = Image.open(io.BytesIO(img_data))
            images.append(img)
            
        pdf_document.close()
        return images
```
We then create another class called `GeminiClient` to facilitate interaction with the Gemini API for tasks like text summarization and image analysis. The Gemini API is initialized to create an instance of the `GeminiClient`. Next, we define a `make_prompt` function to generate text\-based instructions for the Gemini API to ensure the summaries are precise and designed for embedding and retrieval tasks. We also implement a `analyze_page` function to process and summarize a PDF page image. This ensures that summaries are optimized for embedding and retrieval while avoiding fabricated details, such as non\-existent numbers.


```python
class GeminiClient:
    """Handles interactions with the Gemini API"""
    
    def __init__(self, api_key: str):
        if not api_key:
            raise ValueError("API key is required")
        
        # Initialize the client exactly as in Google's example
        self.client = genai.Client(api_key=api_key)
        
    def make_prompt(self, element: str) -> str:
        """Create prompt for summarization"""
        return f"""You are an agent tasked with summarizing research tables and texts from research papers for retrieval. 
                  These summaries will be embedded and used to retrieve the raw text or table elements. 
                  Give a concise summary of the tables or text that is well optimized for retrieval. 
                  Table or text: {element}"""

    def analyze_page(self, image: Image.Image) -> str:
        """Analyze a PDF page using Gemini's vision capabilities"""
        prompt = """You are an assistant tasked with summarizing images for retrieval. 
                   These summaries will be embedded and used to retrieve the raw image.
                   Give a concise summary of the image that is well optimized for retrieval.
                   If it's a table, extract all elements of the table.
                   If it's a graph, explain the findings in the graph.
                   Include details about color, proportion, and shape if necessary to describe the image.
                   Extract all text content from the page accurately.
                   Do not include any numbers that are not mentioned in the image."""
        
        try:
            response = self.client.models.generate_content(
                model=Config.MODEL_NAME,
                contents=[prompt, image]
            )
            return response.text if response.text else ""
        except Exception as e:
            print(f"Error analyzing page: {e}")
            return ""
```
So, we `create_embeddings` function to generate embeddings with built\-in rate limiting to ensure compliance with API restrictions by retrying if the limit is exceeded. and `find_best_passage` function to identify the most relevant passage in a DataFrame for a given query by calculating embedding similarity using the dot product, with error handling for reliable execution. Together, these functions include error handling and are designed for applications like semantic search and document retrieval, ensuring efficient API usage and reliable results.


```python
@sleep_and_retry
    @limits(calls=30, period=60)
    def create_embeddings(self, data: str):
        """Create embeddings with rate limiting - exactly as in Google's example"""
        time.sleep(1)
        return self.client.models.embed_content(
            model=Config.TEXT_EMBEDDING_MODEL_ID,
            contents=data,
            config=types.EmbedContentConfig(task_type="RETRIEVAL_DOCUMENT")
        )

    def find_best_passage(self, query: str, dataframe: pd.DataFrame) -> dict:
        """Find the most relevant passage for a query"""
        try:
            query_embedding = self.client.models.embed_content(
                model=Config.TEXT_EMBEDDING_MODEL_ID,
                contents=query,
                config=types.EmbedContentConfig(task_type="RETRIEVAL_QUERY")
            )
            
            dot_products = np.dot(np.stack(dataframe['Embeddings']), 
                                query_embedding.embeddings[0].values)
            idx = np.argmax(dot_products)
            content = dataframe.iloc[idx]['Original Content']
            return {
                'page': content['page_number'],
                'content': content['content']
            }
        except Exception as e:
            print(f"Error finding best passage: {e}")
            return {'page': 0, 'content': ''}
```
Then we create the make\_answer\_prompt function for the agent to answer questions in a friendly way. It cleans up the passage and helps the agent give easy\-to\-understand answers, which is perfect for explaining research in a way that anyone can understand.


```python
def make_answer_prompt(self, query: str, passage: dict) -> str:
        """Create prompt for answering questions"""
        escaped = passage['content'].replace("'", "").replace('"', "").replace("\n", " ")
        return textwrap.dedent("""You are a helpful and informative bot that answers questions using text from the reference passage included below. 
                                 You are answering questions about a research paper. 
                                 Be sure to respond in a complete sentence, being comprehensive, including all relevant background information. 
                                 However, you are talking to a non-technical audience, so be sure to break down complicated concepts and 
                                 strike a friendly and conversational tone. 
                                 If the passage is irrelevant to the answer, you may ignore it.
                                 
                                 QUESTION: '{query}'
                                 PASSAGE: '{passage}'
                                 
                                 ANSWER:
                              """).format(query=query, passage=escaped)
```
Finally, we define the `RAGApplication` class to process a PDF, extracting and analyzing content from each page using Gemini’s vision capabilities, then generating embeddings for document retrieval, summarization, and semantic search. It initializes with an API key to create a GeminiClient and sets up an empty DataFrame. The `process_pdf` method checks if the PDF exists, converts its pages to images, analyzes them, and stores the results. If no content is found, it raises an error. The method then generates embeddings for the extracted content and stores them in the DataFrame. Error handling is incorporated to ensure smooth processing.


```python
class RAGApplication:
    """Main RAG application class"""
    
    def __init__(self, api_key: str):
        self.gemini_client = GeminiClient(api_key)
        self.data_df = None
        
    def process_pdf(self, pdf_path: str):
        """Process PDF using Gemini's vision capabilities"""
        if not os.path.exists(pdf_path):
            raise FileNotFoundError(f"PDF file not found: {pdf_path}")
            
        # Convert PDF pages to images
        images = PDFProcessor.pdf_to_images(pdf_path)
        
        # Analyze each page
        page_contents = []
        page_analyses = []
        
        st.write("Analyzing PDF pages...")
        for i, image in enumerate(tqdm(images)):
            content = self.gemini_client.analyze_page(image)
            if content:
                # Store both the analysis and the content
                page_contents.append({
                    'page_number': i+1,
                    'content': content
                })
                page_analyses.append(content)
        
        if not page_analyses:
            raise ValueError("No content could be extracted from the PDF")
            
        # Create dataframe
        self.data_df = pd.DataFrame({
            'Original Content': page_contents,
            'Analysis': page_analyses
        })
        
        # Generate embeddings
        st.write("\nGenerating embeddings...")
        embeddings = []
        try:
            for text in tqdm(self.data_df['Analysis']):
                embeddings.append(self.gemini_client.create_embeddings(text))
        except Exception as e:
            print(f"Error generating embeddings: {e}")
            time.sleep(10)
            
        _embeddings = []
        for embedding in embeddings:
            _embeddings.append(embedding.embeddings[0].values)
            
        self.data_df['Embeddings'] = _embeddings
```
Then we create an answer\_questions function to a list of questions by first checking if the PDF data is loaded. For each question, it finds the most relevant passage from the PDF, creates a prompt for Gemini’s model, and generates an answer. The answer, along with the source information, is stored in a list. If any error occurs, an error message is added instead. The method returns the list of answers and their sources.


```python
def answer_questions(self, questions: List[str]) -> List[Dict[str, str]]:
        """Answer a list of questions using the processed data"""
        if self.data_df is None:
            raise ValueError("Please process a PDF first using process_pdf()")
            
        answers = []
        for question in questions:
            try:
                passage = self.gemini_client.find_best_passage(question, self.data_df)
                prompt = self.gemini_client.make_answer_prompt(question, passage)
                response = self.gemini_client.client.models.generate_content(
                    model=Config.MODEL_NAME,
                    contents=prompt
                )
                answers.append({
                    'question': question,
                    'answer': response.text,
                    'source': f"Page {passage['page']}\nContent: {passage['content']}"
                })
            except Exception as e:
                print(f"Error processing question '{question}': {e}")
                answers.append({
                    'question': question,
                    'answer': f"Error generating answer: {str(e)}",
                    'source': "Error"
                })
            
        return answers
```
So, We create`main()` function in this Streamlit app which allows users to upload a PDF, input a question, and use the Gemini API through the `RAGApplication` class to process the PDF and provide answers. The process includes loading environment variables, handling API key verification, and using forms to gather user input. The app uses error handling to ensure smooth operation, with clear messages displayed to users during the entire workflow. This setup enables document analysis and question\-answering from PDFs in a user\-friendly interface.


```python
def main():
    # Load environment variables
    load_dotenv()

    # Page title
    st.set_page_config(page_title='🦜🔗 Ask the Doc App')
    st.title('🦜🔗 Ask the Doc App')
    
    # Get API key
    api_key = os.getenv('GOOGLE_API_KEY')
    alternative_names = ['GEMINI_API_KEY', 'GOOGLE_GEMINI_KEY', 'GEMINI_KEY']
    for name in alternative_names:
        if not api_key:
            api_key = os.getenv(name)
            if api_key:
                st.write(f"Found API key in {name}")

    if not api_key:
        raise ValueError("Please set the GOOGLE_API_KEY environment variable.")

    # Test the API key
    try:
        test_client = genai.Client(api_key=api_key)
        test_response = test_client.models.generate_content(
            model="gemini-2.0-flash-exp",
            contents="Hello, this is a test message."
        )
        st.write("API key is working!",test_response.text)
    except Exception as e:
        st.write(f"API test failed: {e}")
        raise ValueError("Invalid API key.")

    # Form
    with st.form(key="stimy_form"):
        pdf_path = st.file_uploader("Upload a PDF file", type=["pdf"])  
        questions = st.text_input('Enter your question:', placeholder='Please provide a short summary.')
        submit_button = st.form_submit_button(label="Submit")

    if submit_button and pdf_path and questions:
        try:
            # Save the uploaded PDF to a temp file
            temp_pdf_path = f"temp_{pdf_path.name}"
            with open(temp_pdf_path, "wb") as f:
                f.write(pdf_path.getbuffer())
            
            # Initialize application
            app = RAGApplication(api_key)
            
            # Process PDF and answer questions
            st.write(f"Processing PDF: {pdf_path.name}")
            with st.spinner("Thinking..."):
                app.process_pdf(temp_pdf_path)
                answers = app.answer_questions(questions)

            # Display answers
            for result in answers:
                st.write(f"Question: {result['question']}")
                st.write(f"Answer: {result['answer']}")
                st.write(f"Source: {result['source']}")
                st.write("-" * 80)
        except Exception as e:
            st.write(f"An error occurred: {e}")

if __name__ == "__main__":
    main()
```

## Conclusion :

Gemini 2\.0 Flash helps you build faster and more powerful AI apps, further promoting the arrival of the era of intelligent agents. Of course, Gemini 2\.0 Flash is not the first Agentic model. Models like Claude 3\.5 Sonnet and GPT\-4o have achieved strong results in the field of AI Agents. The release of Gemini 2\.0 Flash means that Google has officially joined the fierce competition for AI Agents.

As a big fan of AI Agents, I am still looking forward to the early release of the official version of Gemini 2\.0 Flash to see how powerful Google’s AI Agent will be. I wonder if our AI Agent army will gain another powerful member.


> ***🧙‍♂️ I am an AI Generative expert! If you want to collaborate on a project, drop an [inquiry here](https://docs.google.com/forms/d/e/1FAIpQLSelxGSNOdTXULOG0HbhM21lIW_mTgq7NsDbUTbx4qw-xLEkMQ/viewform) or Book a [1\-on\-1 Consulting](https://calendly.com/gao-dalie/ai-consulting-call) Call With Me.***

*📚Feel free to check out my other articles:*


