---
title: "Multimodal RAG with Gemini Pro and LangChain"
meta_title: "Multimodal RAG with Gemini Pro and LangChain"
description: "Introduction"
date: 2024-11-08T00:41:44Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*m2C8wrrRvhELuDiYLv4YYQ.png"
categories: ["Programming", "Machine Learning", "Computer Vision"]
author: "Rifx.Online"
tags: ["Gemini", "LangChain", "RAG", "Vertex", "sneaker"]
draft: False

---



## Introduction

In this tutorial, we will explore the integration of [Gemini](https://deepmind.google/technologies/gemini/#introduction) Pro and Gemini Pro Vision with the [LangChain](https://www.langchain.com/langchain) Framework for achieving Multimodal (in this case, Image) Retrieval\-Augmented Generation (RAG). This short tutorial is suitable for both beginners and seasoned practitioners, this tutorial not only lays the foundation using Google [AI Studio](https://aistudio.google.com/) as the primary environment but also seamlessly transitions to demonstrating how these implementations can be adapted and further enhanced using [Google Cloud’s Vertex AI](https://cloud.google.com/vertex-ai).

## Setting the Environment

First thing first, let’s set up our environment to ensure we have all the necessary tools and libraries at our disposal.

For this we would need Langchain, Langchain Google Gen AI Package, and a Vector Store package for RAG as:

```python
pip install — upgrade langchain langchain-google-genai “langchain[docarray]” faiss-cpu
```

Then you will also need to provide Google AI Studio API key for the models to interact with:

```python
if "GOOGLE_API_KEY" not in os.environ:
  os.environ[“GOOGLE_API_KEY”] = getpass.getpass(“Provide your Google API Key”)
```

For ease of use I have also written a simple function that shows the image I am working with. This simply downloads the image from the URL provided and shows the preview:

```python
def get_image(url, filename):
  content = requests.get(url).content
  with open(f'/content/{filename}.png', 'wb') as f:
  f.write(content)
  image = Image.open(f"/content/{filename}.png")
  image.show()
  return image
```

## A Simple LLM Interaction

Let’s start with a very simple LLM interaction. For it we can simply call the Gemini Pro model from ChatGoogleGenerativeAI and invoke, as:

```python
llm = ChatGoogleGenerativeAI(model=”gemini-pro”)
result = llm.invoke("Write a ballad about Gemini Pro in around 3 sentences.")
print(result.content)
```

As a result you would get something like this:

> In the realm of stars, Gemini Pro shines, A celestial beacon, defining the lines, Guiding stargazers through cosmic designs.

Similarly, you can also use it in a Chat Interface approach with System, Human message/conversation format. As:

```python
model = ChatGoogleGenerativeAI(model=”gemini-pro”, convert_system_message_to_human=True)
print(model([
  SystemMessage(content="Answer only yes or no."),
  HumanMessage(content="Is apple a fruit?"),
  ]).content)
```

## Multimodal LLM

For this tutorial I am using a very simple usecase, where I am imagining I am a Sneaker enthusiasts and basically like to find if given image of a sneaker, where I can buy that exact model in a local store nearby. For it, I have prepared a dummy Knowledge Base with some Fake information on local stores and made of specs of certain popular Sneaker Brands. Interestingly, this Knowledge base was also generated Using Gemini Pro using [Google Gemini](https://gemini.google.com/) chat interface.

Let’s start with a sample image:

```python
image = get_image(<image_url>, “nike3”)
plt.imshow(image)
plt.show()
```

As a sample, I am considering this image of a [Nike](https://nike.com/) Sneaker.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*dNFF95lOu1SeYHOn1vFnQQ.png)

Now, let’s call Gemini Pro Vision model and ask it to tell us bit about this particular image. For this, you simply need to change the model name to *“gemini\-pro\-vision”*.

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

And you will get output like this:

> This is a product image of a pair of Nike Air Max 95 sneakers in a tan, wheat colorway. The upper is made of mesh and suede, with a leather mudguard. The midsole is made of foam, with a visible air unit in the heel. The outsole is made of rubber, with a waffle pattern for traction.

*Disclaimer: The description provided may not be accurate and reflects the model’s interpretation of the image rather than factual information pertaining to it.*

## RAG using Multimodal

Now, let’s dive into how we can perform RAG using this multimodal approach. First thing first, lets create an information source for this RAG. For this I have written few paragraph information information on few Nike sneakers and some made up locations of local stores based in Nepal.

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

Then, let’s create a Langchain chain, that basically fetches information provided image description regarding what Nike model it is and where one can buy it based on above information from our Knowledge base.

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

Here, the thing to note is *Gemini\-Pro* and *Gemini\-Pro\-Vision* are 2 different models and you will need to call them differently. In above code, we are called the Gemini Pro text model that perform RAG provided the image description that was generated by *gemini\-pro\-vision* model.

Now, lets set up a full chain that first generates image description provided the image as an input and then does RAG using above chain.

```python
llm_vision = ChatGoogleGenerativeAI(model=”gemini-pro-vision”, temperature=0.0)
full_chain = (
  RunnablePassthrough() | llm_vision | StrOutputParser() | rag_chain
)
```

## Performing the RAG

Now, lets do some testing on what we just set up. First, lets get another image as sample

```python
image = get_image(url_3, “nike3”)
plt.imshow(image)
plt.show()
```

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*kPkfo2FKnrUR2tC18VMpjg.png)

Then, lets call our RAG:

```python
message = HumanMessage(
  content=[
    {
      "type": "text",
      "text": "Provide information on Brand and model of given sneaker.",
    }, # You can optionally provide text parts
    {"type": "image_url", "image_url": image},
  ])
```

Now let’s see what we get:

```python
result = full_chain.invoke([message])
display(Markdown(result))
```

As an output, we will get something like this, which is based on our made up information source:

> **Nike Offcourt Slide**Soft, one\-piece upperPlush foam midsoleDurable rubber outsoleAvailable in a variety of colors

> **Store Location:** Bhaktapur, Nepal

## Using Vertex AI Models

Instead of using Google AI Studio model, you can also use Google cloud’s Vertex AI gemini pro models. For it, you will need basically need to first, install related packages for Vertex AI for your cloud environment and Langchain as:

```python
pip install — upgrade google-cloud-aiplatform langchain-google-vertexai
```

Then, set up necessary config related to your cloud project using:

```python
gcloud init
```

Then, you can use Vertex AI models for your multimodal use cases as:

```python
from langchain_google_vertexai import VertexAI
from langchain_google_vertexai import VertexAIEmbeddings

model_vision = VertexAI(model_name="gemini-1.0-pro-vision-001")
model_text = VertexAI(model_name="gemini-1.0-pro-001")
```

## Conclusion

In this short tutorial, we explored how Gemini Pro and Gemini Pro vision could be used with LangChain to implement multimodal RAG applications.


