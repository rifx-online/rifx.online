---
title: "Image Inference through Multi-Modal LLM Models"
meta_title: "Image Inference through Multi-Modal LLM Models"
description: "This article discusses the advancements in multimodal AI models that integrate visual and textual data for enhanced image inference. It highlights the transition from traditional text extraction methods to modern models like OpenAI and Gemini, which facilitate efficient data processing. The article provides practical guidance on sending image-based requests to these models, emphasizing the importance of context windows and request structures. It concludes by outlining the benefits of multimodal AI in various fields, including healthcare and creative industries, showcasing its potential for improved decision-making and accessibility."
date: 2024-12-27T12:59:06Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Hws72hKiwND8Qphp6OYGJQ.png"
categories: ["Natural Language Processing", "Computer Vision", "Generative AI"]
author: "Rifx.Online"
tags: ["multimodal", "image", "LLMs", "Gemini", "OpenAI"]
draft: False

---


### MULTIMODAL AI \| LLM \| OPENAI \| GEMINI \| VISION





### This blog explores the capabilities of multi\-modal models in image inference, highlighting their ability to integrate visual and textual information for improved analysis



The emergence of multimodal AI has significantly transformed the landscape of data wrangling. In the past, we relied heavily on text extraction libraries like PyTesseract for tasks such as optical character recognition (OCR). However, the advancement of Vision Transformers and other multimodal models has revolutionized how we process and interpret data. These advanced models are capable of seamlessly integrating information from multiple modalities, such as images and text, providing a more holistic and efficient approach to data extraction and interpretation. This shift has paved the way for more accurate and sophisticated AI\-driven solutions across various industries.

We will start with the actual and important question.


> *What is meant by **MULTI\-MODAL**?*

To help you understand this, I will give you a snippet from Wikipedia.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*6VrSLvW3hQP-Rv-L_y-H0A.png)

In simple words, when there is more than one mode of communication, it is said to be multimodal. To understand this, let's take the example of multimodal communication.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*NSrE0gTBIoMdVJLgmR7jBA.png)

**Multimodal pedagogy** is an approach to the teaching of writing that implements different modes of communication.[Multimodality](https://en.wikipedia.org/wiki/Multimodality) refers to the use of visual, aural, linguistic, spatial, and gestural modes in differing pieces of media, each necessary to properly convey the information it presents.


> ***what is multimodal AI?***

Let's take this definition from the [IBM blog.](https://www.ibm.com/think/topics/multimodal-ai)

Multimodal AI refers to machine learning models capable of processing and integrating information from multiple modalities or types of data. These modalities can include text, images, audio, video, and other forms of sensory input.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*05fvs3jxAxSdMKXv)

**Calling large language models (LLMs) for text\-based data has become quite straightforward now.** However, with the multimodal AI — which integrates text, images, and other forms of data — there has been a lot of confusion regarding how to send requests to LLMs to obtain outputs based on images. Much of the information on this topic is scattered across different sources, making it difficult to find a clear and comprehensive understanding.

To address this issue, I have tried to collect and organize the available data on how to send image\-based requests to LLMs. One of the primary differences between text\-based and image\-based requests lies in the way the requests are constructed.

While constructing the request, check for the below questions for your case and accordingly take the right approach to deal.


> **Are your images hosted at a URL or locally?**


> Clarify whether the images you’re working with are stored on a web server (accessible via a URL) or on your local machine.


> **What model do you want to use?**


> Define the AI model you’re using for the task, whether it’s a text\-to\-image model, a multi\-modal model, or any other specialized AI model.


> **How do you decide the structure of your request to accommodate multiple images?**


> Consider how to format your request so it can handle various inputs. Think about creating a flexible structure that can accept multiple images, either as individual inputs or in batches, depending on the use case and model’s capabilities.


> **How do you decide on token sizes?**


> When working with large models, ensure you choose token sizes that fit within the model’s constraints. The token size should allow the input to be processed without exceeding limits, balancing between detail and efficiency.

Before going for the technical details of sending image\-based requests to large language models (LLMs), it’s crucial to decide which model you’re going to work with. While many multimodal AI models exist today, for the sake of simplicity and clarity, let’s focus on two of the most well\-known models: **OpenAI** and **Gemini**.

For OpenAI, we have models like GPT 4o and GPT 4o\-mini.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*BqyMFVwL6rGHfqk46a0ahQ.png)

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Z1lO386JaCosePZYHNJ1pQ.png)

Let's start with Gemini!


> ***Why to Start with Gemini?***

For several practical reasons, starting with **Gemini** is a more advantageous approach when experimenting with multimodal models:

1. **Free Access**: Gemini offers **free access**, making it cost\-effective, especially for experimentation and early development. You won’t need to worry about charges during the testing and exploratory phases.
2. **Larger Context Window**: Gemini provides a **bigger context window**, which allows for better understanding and more detailed interactions with both text and image data. This is especially useful when handling complex tasks that require longer sequences of information or more detailed image analysis.
3. **Minimal Charges for Experiments**: When costs do come into play, Gemini is designed to keep **charges as low as possible**, making it ideal for long\-term use without significant budget constraints.


### Context Window of Gemini

Gemini’s context window is a defining feature that allows it to process large amounts of both text and visual data at once. [*Gemini 1\.5 Flash comes standard with a 1\-million\-token context window, and Gemini 1\.5 Pro comes with a 2\-million\-token context window. Historically, large language models (LLMs) were significantly limited by the amount of text (or tokens) that could be passed to the model at one time. The Gemini 1\.5\-long context window, with near\-perfect retrieval (\>99%), unlocks many new use cases and developer paradigms.*](https://ai.google.dev/gemini-api/docs/long-context)

Lets use below image for image extraction.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*dkqmNzW8KN166FfxmR3UDQ.png)


> ***Lets install libraries***


```python
import base64, httpx
from base64 import b64encode
from langchain_core.messages import HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI
import google.generativeai as genai
API_KEY = "Your API KEY"
```

> ***Now lets write a simple code for sending simple image to Flash model***


```python
from PIL import Image

genai.configure(api_key=API_KEY)

## Initialize the model
model = genai.GenerativeModel('gemini-1.5-flash-001')
## Function to encode image file as base64 string
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return b64encode(image_file.read()).decode("utf-8")

## Encode the image
image_path = "Image path"
encoded_image = encode_image(image_path)

## Prepare the content
contents = [
    {
        "parts": [
            {"text": "Explain in brief what is in image. explain everything step wise."},
            {
                "inline_data": {
                    "mime_type": "image/png",
                    "data": encoded_image,
                }
            },
        ]
    }
]

## Generate the content
response = model.generate_content(contents=contents)

## Print the response
print(response.text)
```

> ***Output***

The image shows a road sign with a warning on top and an instruction on the bottom. The warning sign is a red triangle with a black silhouette of a building, suggesting there might be a dip in the road ahead.The instruction sign is green and has the following text:\- "GO SLOW" \- indicating drivers should reduce their speed.\- "TOLL BOOTH AHEAD" \- informing drivers that there is a toll booth coming up.\- "200MTRS" \- stating the distance to the toll booth. The image also shows a truck on the road and some trees in the background. It appears to be a scene from a highway or road with a toll booth nearby.

It was fascinating to see how effectively Google’s models are extracting and processing data. The way these models efficiently analyze large volumes of information and derive meaningful insights demonstrates the impressive capabilities of artificial intelligence.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*dkqmNzW8KN166FfxmR3UDQ.png)

Excellent! We can see that Gemini gave a nice output for the image and did a nice analysis of it. This is the simplest method to send any image to LLM. You can tweak any prompt according to your needs.


> ***Lets try same image for OpenAI model***


```python
import base64, httpx
from base64 import b64encode
from openai import OpenAI
import os

client = OpenAI(
    api_key=os.environ.get("Your openAI key")
## Function to encode image file as base64 string
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return b64encode(image_file.read()).decode('utf-8')
```

> ***Now lets write a simple code for sending simple image to OpenAI model***


```python
response = client.chat.completions.create(
  model="gpt-4o-mini",
  messages=[
    {
      "role": "user",
      "content": [
        {"type": "text", "text": "Explain in brief what is in image. explain everything step wise."},
        {
          "type": "image_url",
          "image_url": {"url": f'data:image/jpeg;base64,{encode_image("test_image.PNG")}'}, 
        },
      ],
    }
  ],
)

print(response.choices[0].message.content)
```

> ***Output***

The image features a road sign with important information for drivers. Here’s a step\-by\-step explanation of its components:

1\. \*\*Shape and Color\*\*: — The sign is a combination of triangular and rectangular shapes. — The triangle at the top is typically used for warning signs, indicating the need for caution.

2\. \*\*Top Section\*\* (Triangular Sign): — The triangular section contains a black silhouette of a toll booth, signaling that drivers should be aware of the upcoming toll area.

3\. \*\*Middle Section\*\* (Main Instruction): — The rectangular green sign beneath gives a directive: “GO SLOW.” This instructs drivers to reduce their speed as they approach the toll booth.

4\. \*\*Lower Section\*\*: — The next line states “TOLL BOOTH AHEAD,” providing clear information about what to expect soon. — The bottom line reads “200 MTRS,” indicating that the toll booth is located 200 meters ahead, giving drivers a distance reference to prepare for the toll.

5\. \*\*Surroundings\*\*: — The background shows a road with some greenery and a few vehicles, highlighting the real\-world context where this sign is placed.

Overall, the sign effectively conveys to drivers the need to slow down due to the upcoming toll booth, ensuring safety and compliance with road regulations.

This is how you can send images to multimodal LLM models. Processing images with LLMs offers numerous advantages by combining their text\-processing capabilities with the ability to understand and generate visual content. This integration enables a unified understanding of both text and visuals, allowing for contextual analysis that enhances decision\-making across various domains. For instance, in healthcare, these models can analyze X\-rays or MRIs alongside patient notes to provide better diagnostic insights. They also improve accessibility by describing visual information in natural language, making it usable for visually impaired individuals.

Moreover, LLMs with image\-processing capabilities advance search and retrieval systems, enabling multimodal search engines where users can search using text and receive visual results or vice versa. In creative fields, they allow text\-to\-image interaction, where users can modify or generate images based on textual prompts. Additionally, these models automate repetitive tasks, such as data annotation and document digitization, by interpreting images and extracting structured information.


## If you have found this article insightful

It is a proven fact that “**Generosity makes you a happier person**”; therefore, Give claps to the article if you liked it. If you found this article insightful, follow me on [**Linkedin**](https://www.linkedin.com/in/chinmay-bhalerao-6b5284137/) and [**Medium**](https://medium.com/@BH_Chinmay). You can also [**subscribe**](https://medium.com/@BH_Chinmay) to get notified when I publish articles. Let’s create a community! Thanks for your support!


## You can read my other blogs related to :


### Signing off,


### Chinmay


