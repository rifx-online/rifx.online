---
title: "使用 GPT Vision 和 Langchain 从图像生成结构化数据"
meta_title: "使用 GPT Vision 和 Langchain 从图像生成结构化数据"
description: "在当今世界，视觉数据非常丰富，从图像中提取有意义信息的能力变得越来越重要……"
date: 2024-10-23T11:56:14Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*FPRRg85jYb7MrzXEpNWbmw.jpeg"
categories: ["llm"]
author: "Rifx.Online"
tags: ["llm"]
draft: False

---





在当今这个视觉数据丰富的世界中，从图像中提取有意义信息的能力变得越来越重要。Langchain是一个强大的框架，用于构建大型语言模型（LLMs）应用程序，提供了一套多功能的工具来应对这一挑战。在本文中，我们将探讨如何使用Langchain从图像中提取结构化信息，例如计算人数和列出主要物体。

在深入代码之前，让我们先了解一下任务的背景。想象一下你有一张场景的图像，比如城市街道。你的目标是从这张图像中提取有价值的信息，包括在场的人数和场景中的主要物体列表。

## 关于 Langchain

Langchain 是一个综合框架，允许开发者利用大型语言模型（LLMs）的强大功能构建复杂的应用程序。它提供了模块化和可扩展的架构，使开发者能够创建针对特定需求的自定义管道、代理和工作流。

Langchain 简化了 LLM 的集成，提供了处理各种数据源（包括文本、图像和结构化数据）的抽象和工具。它支持来自不同提供商的广泛 LLM，例如 OpenAI 和 Anthropic，使得在单个应用程序中轻松切换模型或组合多个模型变得简单。

## 准备环境并设置 OpenAI API 密钥

要跟随本教程，您需要安装 Langchain。您可以使用 pip 安装它：

```python
pip install langchain langchain_openai
```
要在 Langchain 中使用 OpenAI 语言模型，您需要从 OpenAI 获取一个 API 密钥。如果您还没有 API 密钥，可以在 OpenAI 网站上注册一个 (<https://openai.com/api/>)。

一旦您拥有了 API 密钥，可以将其设置为系统中的环境变量，或者直接在代码中提供。以下是如何将 API 密钥设置为环境变量的示例：

```python
export OPENAI_API_KEY="your_openai_api_key_here"
```
或者，您可以直接在 Python 代码中提供 API 密钥：

```python
import os
import langchain
os.environ["OPENAI_API_KEY"] = "your_openai_api_key_here"
```
在设置好 API 密钥后，Langchain 将能够与 OpenAI API 进行身份验证并使用他们的语言模型。

## 加载和编码图像

在我们使用 Langchain 处理图像之前，我们需要从文件中加载图像数据，并将其编码为可以传递给语言模型的格式。下面的代码定义了一个函数 `load_image`，该函数接受一个包含 `image_path` 键的字典，并返回一个新的字典，其中 `image` 键包含编码为 base64 字符串的图像数据。

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
`load_image` 函数首先从输入字典中提取 `image_path`。然后，它定义了一个嵌套函数 `encode_image`，该函数以二进制模式打开图像文件，读取其内容，并使用 Python 标准库中的 `base64.b64encode` 函数将其编码为 base64 字符串。

`load_image` 函数使用提供的 `image_path` 调用 `encode_image`，并将结果 base64 编码字符串存储在 `image_base64` 变量中。最后，它返回一个新的字典，其中 `image` 键设置为 `image_base64`。

为了将此函数集成到 Langchain 流水线中，我们可以创建一个 `TransformChain`，该链接受 `image_path` 作为输入，并生成 `image`（base64 编码字符串）作为输出。

```python
load_image_chain = TransformChain(
    input_variables=["image_path"],
    output_variables=["image"],
    transform=load_image
)
```
通过这种设置，我们可以轻松地将图像加载和编码作为更大 Langchain 工作流的一部分，从而使我们能够使用大型语言模型处理视觉数据和文本。

## 定义输出结构

在我们提取图像信息之前，需要定义我们希望接收的输出结构。在这种情况下，我们将创建一个名为 `ImageInformation` 的 Pydantic 模型，其中包括图像描述和我们可能想要提取的任何其他信息的字段。

```python
from langchain_core.pydantic_v1 import BaseModel, Field

class ImageInformation(BaseModel):
 """Information about an image."""
 image_description: str = Field(description="a short description of the image")
 people_count: int = Field(description="number of humans on the picture")
 main_objects: list[str] = Field(description="list of the main objects on the picture")
```

## 设置图像模型

接下来，我们将创建一个链，将图像加载和编码步骤与 LLM 调用步骤结合起来。由于 `ChatOpenAI` 模型在我的理解中并不具备同时处理文本和图像输入的能力，我们将创建一个包装链来实现这一功能。

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
在这个代码片段中，我们定义了一个名为 `image_model` 的链，使用提供的提示、格式说明和图像调用 `ChatOpenAI` 模型。`image_model` 链接受一个包含提示和 base64 编码图像字符串的字典 `inputs`。

在链内部，我们创建了一个 `HumanMessage` 对象，该对象结合了提示文本、格式说明和图像 URL，以数据 URI 格式化，包含 base64 编码的图像数据。然后，我们使用这个 `HumanMessage` 对象调用 `ChatOpenAI` 模型，使用专门为涉及文本和图像的多模态任务设计的 `gpt-4-vision-preview` 模型。

该模型处理文本提示和图像，并返回输出。

## 整合所有内容

现在我们已经拥有了所有必要的组件，我们可以定义一个函数来协调整个过程：

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
在这个函数中，我们定义了一个提示，要求LLM提供图像中人物的数量和主要物体的列表。然后，我们创建一个链，将图像加载步骤（`load\_image\_chain`）、LLM调用步骤（`image\_model`）和JSON输出解析器（`parser`）结合在一起。最后，我们用图像路径和提示调用这个链，函数返回一个包含提取信息的字典。

## 示例用法

要使用此功能，只需提供图像文件的路径：


```python
result = get_image_informations("path/to/your/image.jpg")
print(result)
```
这将输出一个包含请求信息的字典，例如：


```python
{
 'description': 'a view of a city showing cars waiting at a traffic light',
 'people_count': 5,
 'main_objects': ['car', 'building', 'traffic light', 'tree']
}
```

## 结论

Langchain 提供了强大的工具集，用于处理大型语言模型并从各种数据源（包括图像）中提取有价值的信息。通过将 Langchain 的功能与自定义提示和输出解析相结合，您可以创建强大的应用程序，从视觉数据中提取结构化信息。

请记住，输出的质量将取决于您使用的 LLM 的能力以及您提示的具体性。尝试不同的模型和提示，以找到最适合您用例的解决方案。

如果您找到更好的方法来实现相同的结果或有改进建议，请随时在评论中分享。本文提供的代码示例旨在作为起点，可能还有其他方法或优化。

