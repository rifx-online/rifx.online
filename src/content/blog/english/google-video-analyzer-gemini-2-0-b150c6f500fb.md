---
title: "Google Video Analyzer: Gemini 2.0 | by Samar Singh | Dec, 2024 | Medium"
meta_title: "Google Video Analyzer: Gemini 2.0 | by Samar Singh | Dec, 2024 | Medium"
description: "Google AI Studios Video Analyzer is an advanced tool designed for efficient video content analysis using AI techniques. It offers features such as automatic scene-based captions, key moment extraction, object detection, and creative outputs. The article provides a comprehensive guide on utilizing the app and replicating its functionality with Python in Google Colab, detailing steps from video upload to generating scene captions. The Video Analyzer serves various applications, including content creation, accessibility enhancement, event analysis, and creative interpretations."
date: 2025-01-05T02:43:01Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*xY4by7eRc0hLVJoye55J6g.png"
categories: ["Programming", "Technology", "Computer Vision"]
author: "Rifx.Online"
tags: ["Video", "Analyzer", "Captions", "Detection", "Python"]
draft: False

---




The advancements in AI tools are moving at breakneck speed, and Google AI Studio’s Video Analyzer is a testament to this innovation. If you’re curious about video analysis, this tool and its underlying framework are excellent ways to explore the capabilities of AI in processing and understanding video content. I have covered indepth about gemini 2\.0 model as well as Google AI Studio in my [previous article](https://readmedium.com/googles-new-model-gemini-2-0-gemini-2-0-beats-claude-openai-7f1da72183fb).

In this article, we’ll explore the Video Analyzer app on AI Studio, walk through its key features, and demonstrate how to replicate its functionality using Python code in Google Colab. Whether you’re a developer or an AI enthusiast, this comprehensive guide will help you leverage this groundbreaking technology.




## What is Google AI Studio’s Video Analyzer?

Google AI Studio’s Video Analyzer is a robust application designed to analyze video content efficiently. By utilizing advanced AI techniques, it provides:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*I88obYZ_7fer1VMyuUAHzA.png)

1. **Scene\-based Captions**: Automatically generates captions for each scene, including visual descriptions and spoken text.
2. **Key Moment Extraction**: Identifies pivotal moments in the video and summarizes them concisely.
3. **Object and Count Analysis**: Detects objects, people, or other numerical entities across scenes.
4. **Creative Outputs**: Produces creative outputs like haikus based on video content.

This app combines powerful prompting with function calls to process and analyze videos dynamically.


## Demo Walkthrough: Exploring Video Analyzer on AI Studio

Here’s how you can utilize the app step by step:


## 1\. Upload a Video

* Start by uploading your video to AI Studio.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*J8PodccEuiSX8ljulYlv3Q.png)


## 2\. Generate A/V Captions \& Paragraph

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*XQz6Tk21uKmk1-_QpV0q0g.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*6Q8puImfZqaGycI1oaVMcA.png)


## 3\. Summarize Key Moments

* The app highlights important scenes, creating a concise timeline. For example:
* `00:18`: Introduction of Gemini.
* `02:00`: Summary of Gemini's features.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*qoQWRBr-M228yx7VXJrKjQ.png)


## 4\. Create Tabular Data

Tabular outputs allow you to visualize:

* Timings.
* Scene descriptions.
* Additional objects or emojis tied to scenes.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*qn2yXtnnRz5vA7M-jBdegg.png)


## 5\. Chart \& Custom

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*UqFRdh8fwxS7rpfxrTreZw.png)

* Count the number of object like people, phones or trees in each scene.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*pDG4EOjv4HpkGYd4is45hQ.png)


## Video Analyzer with Python in google colab

This step\-by\-step guide demonstrates how to use Python to interact with the API, upload a video, and generate accurate scene captions with timecodes.


## Prerequisites

Before getting started, ensure the following:

* **Google API Key**: Obtain an API key from the Google Developer Console.
* **Google Gemini 2\.0 SDK**: Install the library using pip.
* **Video File**: Prepare the video file you want to process.


## Step 1: Install the Required Library

Install the Google Gemini SDK by running the following command in your environment:


```python
!pip install -U -q google-genai
```

## Step 2: Authenticate with Google API

The Google API key is necessary to authenticate your requests. In this example, we’re using Google Colab’s `userdata` for secure storage.


```python
import os
from google.colab import userdata
from google import genai
from google.genai import types
## Fetch the API key securely
GOOGLE_API_KEY = userdata.get('GOOGLE_API_KEY')
## Initialize the client
client = genai.Client(api_key=GOOGLE_API_KEY)
```

## Step 3: Define the Model and Upload the Video

We’re using the `gemini-2.0-flash-exp` model for content generation. First, prepare and upload your video file.


```python
import pathlib
## Path to your video file
img_path = pathlib.Path('/content/Introducing Gemini 2.0 烈 Our most capable AI model yet.mp4')
## Upload the video file
file_upload = client.files.upload(path=img_path)
## Monitor upload state
import time
while file_upload.state == "PROCESSING":
    print('Waiting for video to be processed...')
    time.sleep(10)
    file_upload = client.files.get(name=file_upload.name)
if file_upload.state == "FAILED":
    raise ValueError("Video processing failed")
print(f'Video processing complete: {file_upload.uri}')
```

## Step 4: Define the Prompts

Define the **system prompt** and **user prompt** to instruct the model to generate captions.


```python
SYSTEM_PROMPT = "When given a video and a query, call the relevant function only once with the appropriate timecodes and text for the video"

USER_PROMPT = """For each scene in this video, generate captions that describe the scene along with any spoken text placed in quotation marks. 
    Place each caption into an object sent to set_timecodes with the timecode of the caption in the video."""
```

## Step 5: Generate Content Using the Model

Send the uploaded video and the prompts to the Gemini 2\.0 model for processing.


```python
response = client.models.generate_content(
    model="gemini-2.0-flash-exp",
    contents=[
        types.Content(
            role="user",
            parts=[
                types.Part.from_uri(
                    file_uri=file_upload.uri,
                    mime_type=file_upload.mime_type
                )
            ]
        ),
        USER_PROMPT,
    ],
    config=types.GenerateContentConfig(
        system_instruction=SYSTEM_PROMPT,
        temperature=0.0,
    ),
)
```

## Step 6: Display the Results

The API’s response contains the captions with timecodes. Use the `Markdown` library to display the results neatly.


```python
from IPython.display import Markdown
## Render the captions as markdown
Markdown(response.text)
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*SkEU7DlPNK8XXAYvuRzH3A.png)


## Applications of Video Analyzer

1. **Content Creation**: Automate video summarization for blogs or reports.
2. **Accessibility**: Generate captions for improved accessibility.
3. **Event Analysis**: Highlight key moments in sports or presentations.
4. **Creative Outputs**: Leverage creative interpretations like poetry for marketing.


## Conclusion

Google AI Studio’s Video Analyzer is an excellent tool for video analysis, offering insights through captions, summaries, and object detection. By understanding its underlying principles and recreating it with Python, you can harness the power of AI to analyze and interpret video content effectively. Whether you’re building accessibility features, summarizing content, or exploring creative possibilities, the Video Analyzer provides a strong foundation to innovate.


