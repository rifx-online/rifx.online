---
title: "使用 Gemini Pro 和 LangChain 的多模式 RAG"
meta_title: "使用 Gemini Pro 和 LangChain 的多模式 RAG"
description: "介绍"
date: 2024-11-08T00:41:44Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*m2C8wrrRvhELuDiYLv4YYQ.png"
categories: ["Programming", "Machine Learning", "Computer Vision"]
author: "Rifx.Online"
tags: ["Gemini", "LangChain", "RAG", "Vertex", "sneaker"]
draft: False

---



## 介绍

在本教程中，我们将探索将 [Gemini](https://deepmind.google/technologies/gemini/#introduction) Pro 和 Gemini Pro Vision 与 [LangChain](https://www.langchain.com/langchain) 框架集成，以实现多模态（在这种情况下为图像）检索增强生成（RAG）。这个简短的教程适合初学者和经验丰富的从业者，不仅以 Google [AI Studio](https://aistudio.google.com/) 作为主要环境奠定基础，还无缝过渡到演示如何使用 [Google Cloud’s Vertex AI](https://cloud.google.com/vertex-ai) 适应和进一步增强这些实现。

## 设置环境

首先，我们需要设置我们的环境，以确保我们拥有所有必要的工具和库。

为此，我们需要 Langchain、Langchain Google Gen AI 包以及用于 RAG 的向量存储包，如下所示：

```python
pip install — upgrade langchain langchain-google-genai “langchain[docarray]” faiss-cpu
```

然后，您还需要提供 Google AI Studio API 密钥，以便模型进行交互：

```python
if "GOOGLE_API_KEY" not in os.environ:
  os.environ[“GOOGLE_API_KEY”] = getpass.getpass(“Provide your Google API Key”)
```

为了方便使用，我还写了一个简单的函数，显示我正在使用的图像。这个函数简单地从提供的 URL 下载图像并显示预览：

```python
def get_image(url, filename):
  content = requests.get(url).content
  with open(f'/content/{filename}.png', 'wb') as f:
  f.write(content)
  image = Image.open(f"/content/{filename}.png")
  image.show()
  return image
```

## 简单的 LLM 交互

让我们从一个非常简单的 LLM 交互开始。为此，我们可以简单地调用 ChatGoogleGenerativeAI 的 Gemini Pro 模型，并调用，如下所示：

```python
llm = ChatGoogleGenerativeAI(model=”gemini-pro”)
result = llm.invoke("Write a ballad about Gemini Pro in around 3 sentences.")
print(result.content)
```

结果你会得到类似这样的内容：

> 在星辰的领域，Gemini Pro 闪耀， 一道天体的灯塔，划定了界限， 指引着观星者穿越宇宙的设计。

同样，你也可以在聊天界面中使用它，采用系统、人类消息/对话格式，如下所示：

```python
model = ChatGoogleGenerativeAI(model=”gemini-pro”, convert_system_message_to_human=True)
print(model([
  SystemMessage(content="Answer only yes or no."),
  HumanMessage(content="Is apple a fruit?"),
  ]).content)
```

## 多模态 LLM

在本教程中，我将使用一个非常简单的用例，假设我是一名运动鞋爱好者，基本上想要找到在附近的本地商店购买特定运动鞋型号的方法。为此，我准备了一个虚拟知识库，里面包含了一些关于本地商店的虚假信息，以及某些流行运动鞋品牌的规格。有趣的是，这个知识库也是通过 Gemini Pro 使用 [Google Gemini](https://gemini.google.com/) 聊天界面生成的。

让我们从一张示例图片开始：

```python
image = get_image(<image_url>, “nike3”)
plt.imshow(image)
plt.show()
```

作为示例，我考虑这张 [Nike](https://nike.com/) 运动鞋的图片。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*dNFF95lOu1SeYHOn1vFnQQ.png)

现在，让我们调用 Gemini Pro Vision 模型，询问它关于这张特定图片的一些信息。为此，您只需将模型名称更改为 *“gemini\-pro\-vision”*。

```python
llm = ChatGoogleGenerativeAI(model=”gemini-pro-vision”)
message = HumanMessage(
content=[
  {
    "type": "text",
    "text": "What's in this image? provide full detail as possible.",
  }, # You can optionally provide text parts
  {"type": "image_url", "image_url": image},
])
print(
llm.invoke([message]).content
)
```

您将得到如下输出：

> 这是一个 Nike Air Max 95 运动鞋的产品图片，颜色为棕色小麦色。鞋面由网布和麂皮制成，带有皮革泥挡。中底由泡沫材料制成，后跟有可见的气垫单元。外底由橡胶制成，具有华夫格图案以增强抓地力。

*免责声明：所提供的描述可能不准确，反映的是模型对图像的解读，而非与之相关的事实信息。*

## 使用多模态的RAG

现在，让我们深入了解如何使用这种多模态方法执行RAG。首先，让我们为这个RAG创建一个信息源。为此，我写了一些关于几款Nike运动鞋的段落信息，以及一些虚构的尼泊尔本地商店位置。

```python
store_information = “Nike Air Max Plus sneakers. They feature a brown upper with a black Nike Swoosh logo on the side and a visible Air Max unit in the heel. The sole is white.
Here are some more details about the Nike Air Max Plus:
Style: TN
Release date: January 1, 2017
Style code: 852630–300
Original retail price: $150 USD
The Air Max Plus, also known as the TN, is a popular Nike running shoe that was first released in 1998. It is known for its unique design, which includes a gradient upper, visible Air Max units, and a wavy outsole. The TN has been a popular shoe among sneakerheads and casual wearers alike for over two decades.
It features a brown upper with a black Swoosh logo and a white sole. The shoe is currently available for resale on the StockX marketplace for an average price of around $150 USD.
Nike Air Max Plus Store Location: "Kings Way, Kathmandu, Nepal

...

"
```

然后，让我们创建一个Langchain链，它基本上根据我们知识库中提供的图像描述获取关于Nike模型的信息以及可以在哪里购买它。

```python
llm_text = ChatGoogleGenerativeAI(model=”gemini-pro”)
template = """
```

{context}

```
{information}
Provide brief information and store location.
"""
prompt = ChatPromptTemplate.from_template(template)
rag_chain = (
  {"context": retriever, "information": RunnablePassthrough()}
  | prompt
  | llm_text
  | StrOutputParser()
)
```

这里需要注意的是*Gemini\-Pro*和*Gemini\-Pro\-Vision*是两个不同的模型，您需要以不同的方式调用它们。在上面的代码中，我们调用了Gemini Pro文本模型，该模型根据由*gemini\-pro\-vision*模型生成的图像描述执行RAG。

现在，让我们设置一个完整的链，它首先生成图像描述，然后使用上述链进行RAG。

```python
llm_vision = ChatGoogleGenerativeAI(model=”gemini-pro-vision”, temperature=0.0)
full_chain = (
  RunnablePassthrough() | llm_vision | StrOutputParser() | rag_chain
)
```

## 执行 RAG

现在，让我们对刚刚设置的内容进行一些测试。首先，获取另一张图像作为样本

```python
image = get_image(url_3, “nike3”)
plt.imshow(image)
plt.show()
```

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*kPkfo2FKnrUR2tC18VMpjg.png)

然后，让我们调用我们的 RAG：

```python
message = HumanMessage(
  content=[
    {
      "type": "text",
      "text": "提供有关给定运动鞋的品牌和型号的信息。",
    }, # 您可以选择性地提供文本部分
    {"type": "image_url", "image_url": image},
  ])
```

现在让我们看看我们得到了什么：

```python
result = full_chain.invoke([message])
display(Markdown(result))
```

作为输出，我们将得到类似于以下内容的结果，这基于我们的虚构信息来源：

> **Nike Offcourt Slide**软质一体式鞋面舒适的泡沫中底耐用的橡胶外底提供多种颜色选择

> **商店位置：** 尼泊尔，巴克塔布尔

## 使用 Vertex AI 模型

除了使用 Google AI Studio 模型外，您还可以使用 Google Cloud 的 Vertex AI Gemini Pro 模型。为此，您首先需要为您的云环境安装与 Vertex AI 相关的包和 Langchain，如下所示：

```python
pip install — upgrade google-cloud-aiplatform langchain-google-vertexai
```

然后，使用以下命令设置与您的云项目相关的必要配置：

```python
gcloud init
```

接下来，您可以将 Vertex AI 模型用于多模态用例，如下所示：

```python
from langchain_google_vertexai import VertexAI
from langchain_google_vertexai import VertexAIEmbeddings

model_vision = VertexAI(model_name="gemini-1.0-pro-vision-001")
model_text = VertexAI(model_name="gemini-1.0-pro-001")
```

## 结论

在这个简短的教程中，我们探讨了如何将 Gemini Pro 和 Gemini Pro vision 与 LangChain 结合使用，以实现多模态 RAG 应用程序。


