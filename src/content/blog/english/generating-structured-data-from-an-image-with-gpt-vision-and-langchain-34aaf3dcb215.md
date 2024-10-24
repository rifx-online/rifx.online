---
title: "Generating structured data from an image with GPT vision and Langchain"
meta_title: "Generating structured data from an image with GPT vision and Langchain"
description: "In today’s world, where visual data is abundant, the ability to extract meaningful information from images is becoming increasingly…"
date: 2024-10-24T17:47:43Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*FPRRg85jYb7MrzXEpNWbmw.jpeg"
categories: ["Programming", "Computer Vision", "Natural Language Processing"]
author: "Rifx.Online"
tags: ["Langchain", "GPT", "vision", "LLMs", "structured"]
draft: False

---






In today’s world, where visual data is abundant, the ability to extract meaningful information from images is becoming increasingly valuable. Langchain, a powerful framework for building applications with large language models (LLMs), offers a versatile toolset for tackling this challenge. In this article, we’ll explore how to use Langchain to extract structured information from images, such as counting the number of people and listing the main objects.

Before diving into the code, let’s set the stage by understanding the task at hand. Imagine you have an image of a scene, such as a city street. Your goal is to extract valuable information from this image, including the number of people present and a list of the main objects in the scene.


## About Langchain

Langchain is a comprehensive framework that allows developers to build sophisticated applications by leveraging the power of large language models (LLMs). It provides a modular and extensible architecture, enabling developers to create custom pipelines, agents, and workflows tailored to their specific needs.

Langchain simplifies the integration of LLMs, offering abstractions and utilities for handling various data sources, including text, images, and structured data. It supports a wide range of LLMs from different providers, such as OpenAI and Anthropic, making it easy to switch between models or combine multiple models in a single application.


## Preparing the Environment and Setting Up the OpenAI API Key

To follow along with this tutorial, you’ll need to have Langchain installed. You can install it using pip:


```python
pip install langchain langchain_openai
```
To use the OpenAI language models with Langchain, you’ll need to obtain an API key from OpenAI. If you don’t have an API key yet, you can sign up for one on the OpenAI website (<https://openai.com/api/>).

Once you have your API key, you can set it as an environment variable in your system or provide it directly in your code. Here’s an example of how to set the API key as an environment variableCopy code


```python
export OPENAI_API_KEY="your_openai_api_key_here"
```
Alternatively, you can provide the API key directly in your Python code:


```python
import os
import langchain
os.environ["OPENAI_API_KEY"] = "your_openai_api_key_here"
```
After setting up the API key, Langchain will be able to authenticate with the OpenAI API and use their language models.


## Loading and Encoding the Image

Before we can process images with Langchain, we need to load the image data from a file and encode it in a format that can be passed to the language model. The code below defines a function `load_image` that takes a dictionary with an `image_path` key and returns a new dictionary with an `image` key containing the image data encoded as a base64 string.


```python
def load_image(inputs: dict) -> dict:
    """Load image from file and encode it as base64."""
    image_path = inputs["image_path"]
  
    def encode_image(image_path):
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')
    image_base64 = encode_image(image_path)
    return {"image": image_base64}
```
The `load_image` function first extracts the `image_path` from the input dictionary. It then defines a nested function `encode_image` that opens the image file in binary mode, reads its contents, and encodes them as a base64 string using the `base64.b64encode` function from the Python standard library.

The `load_image` function calls `encode_image` with the provided `image_path` and stores the resulting base64-encoded string in the `image_base64` variable. Finally, it returns a new dictionary with the `image` key set to `image_base64`.

To integrate this function into a Langchain pipeline, we can create a `TransformChain` that takes the `image_path` as input and produces the `image` (base64-encoded string) as outputCopy code


```python
load_image_chain = TransformChain(
    input_variables=["image_path"],
    output_variables=["image"],
    transform=load_image
)
```
With this setup, we can easily load and encode images as part of a larger Langchain workflow, enabling us to process visual data alongside text using large language models.


## Defining the Output Structure

Before we can extract information from the image, we need to define the structure of the output we want to receive. In this case, we’ll create a Pydantic model called `ImageInformation` that includes fields for the image description and any additional information we might want to extract.


```python
from langchain_core.pydantic_v1 import BaseModel, Field

class ImageInformation(BaseModel):
 """Information about an image."""
 image_description: str = Field(description="a short description of the image")
 people_count: int = Field(description="number of humans on the picture")
 main_objects: list[str] = Field(description="list of the main objects on the picture")
```

## Setting up the Image Model

Next, we’ll create a chain that combines the image loading and encoding steps with the LLM invocation step. Since the `ChatOpenAI` model is not natively capable of handling both text and image inputs simultaneously (to my unsderstanding), we'll create a wrapper chain to achieve this functionality.


```python
from langchain.chains import TransformChain
from langchain_core.messages import HumanMessage
from langchain_openai import ChatOpenAI
from langchain import globals
from langchain_core.runnables import chain

## Set verbose
globals.set_debug(True)

@chain
def image_model(inputs: dict) -> str | list[str] | dict:
 """Invoke model with image and prompt."""
 model = ChatOpenAI(temperature=0.5, model="gpt-4-vision-preview", max_tokens=1024)
 msg = model.invoke(
             [HumanMessage(
             content=[
             {"type": "text", "text": inputs["prompt"]},
             {"type": "text", "text": parser.get_format_instructions()},
             {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{inputs['image']}"}},
             ])]
             )
 return msg.content
```
In this code snippet, we define a chain called `image_model` that invokes the `ChatOpenAI` model with the provided prompt, format instructions, and image. The `image_model` chain accepts a dictionary `inputs` containing the prompt and the base64-encoded image string.

Inside the chain, we create a `HumanMessage` object that combines the prompt text, format instructions, and the image URL, formatted as a data URI with the base64-encoded image data. We then invoke the `ChatOpenAI` model with this `HumanMessage` object, using the `gpt-4-vision-preview` model, which is specifically designed for multimodal tasks involving both text and images.

The model processes both the text prompt and the image, and returns the output.


## Putting It All Together

Now that we have all the necessary components, we can define a function that orchestrates the entire process:


```python
from langchain_core.output_parsers import JsonOutputParser

parser = JsonOutputParser(pydantic_object=ImageInformation)
def get_image_informations(image_path: str) -> dict:
   vision_prompt = """
   Given the image, provide the following information:
   - A count of how many people are in the image
   - A list of the main objects present in the image
   - A description of the image
   """
   vision_chain = load_image_chain | image_model | parser
   return vision_chain.invoke({'image_path': f'{image_path}', 
                               'prompt': vision_prompt})
```
In this function, we define a prompt that asks the LLM to provide a count of the people in the image and a list of the main objects. We then create a chain that combines the image loading step (`load\_image\_chain`), the LLM invocation step (`image\_model`), and a JSON output parser (`parser`). Finally, we invoke this chain with the image path and the prompt, and the function returns a dictionary containing the extracted information.


## Example Usage

To use this function, simply provide the path to an image file:


```python
result = get_image_informations("path/to/your/image.jpg")
print(result)
```
This will output a dictionary with the requested information, such as:


```python
{
 'description': 'a view of a city showing cars waiting at a traffic light',
 'people_count': 5,
 'main_objects': ['car', 'building', 'traffic light', 'tree']
}
```

## Conclusion

Langchain provides a powerful toolset for working with large language models and extracting valuable information from various data sources, including images. By combining Langchain’s capabilities with custom prompts and output parsing, you can create robust applications that can extract structured information from visual data.

Remember, the quality of the output will depend on the capabilities of the LLM you’re using and the specificity of your prompts. Experiment with different models and prompts to find the best solution for your use case.

If you find a better way to achieve the same results or have suggestions for improvements, please don’t hesitate to share them in the comments. The code examples provided in this article are meant to serve as a starting point, and there may be alternative approaches or optimizations .


