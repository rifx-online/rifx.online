---
title: "Developer’s guide to getting started with Gemini 2.0 Flash on Vertex AI"
meta_title: "Developer’s guide to getting started with Gemini 2.0 Flash on Vertex AI"
description: "Gemini 2.0 Flash, now available on Vertex AI, introduces significant improvements in speed, performance, and multimodal capabilities, including image generation and text-to-speech. It enhances user experiences through a Multimodal Live API for real-time interactions and incorporates Google Search as a tool for improved response accuracy. The Google Gen AI SDK offers a unified interface for developers to integrate Gemini 2.0 into applications, supporting both Python and Go. The guide provides practical examples and resources for leveraging these advancements effectively."
date: 2024-12-15T08:25:26Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*szKqds28bpXwN-vWGESVIg.png"
categories: ["Technology", "Programming", "Generative AI"]
author: "Rifx.Online"
tags: ["Gemini", "Vertex", "Multimodal", "SDK", "Python"]
draft: False

---






[Gemini 2\.0 has arrived](https://blog.google/technology/google-deepmind/google-gemini-ai-update-december-2024/), bringing next\-level capabilities built for this new agentic era. Gemini 2\.0 Flash is now available as an experimental preview through [Vertex AI Gemini API](https://cloud.google.com/vertex-ai/generative-ai/docs/gemini-v2), [Vertex AI Studio](https://console.cloud.google.com/vertex-ai/studio), [Google AI Studio](https://aistudio.google.com/), and the [Gemini Developer API](https://ai.google.dev/gemini-api/docs/models/gemini-v2). This new model introduces significant advancements:

* **Speed and performance**: Gemini 2\.0 Flash has a significantly improved time to first token (TTFT) over Gemini 1\.5 Flash.
* **New modalities**: Gemini 2\.0 introduces native image generation and controllable text\-to\-speech capabilities, enabling image editing, localized artwork creation, and expressive storytelling.
* **Quality**: The model maintains or improves on quality compared to larger models like Gemini 1\.5 Pro (see image below).

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*GkceL7XtV0RRWsKe)

* **Multimodal Live API**: This new API helps you create real\-time vision and audio streaming applications with tool use.
* **Improved agentic experiences**: Gemini 2\.0 delivers improvements to multimodal understanding, coding, complex instruction following, and function calling. These improvements work together to support better agentic experiences.

In this blog post, you will learn how you can use Gemini 2\.0 Flash on Google Cloud with Vertex AI and the all\-new streamlined [Google Gen AI SDK](https://cloud.google.com/vertex-ai/generative-ai/docs/sdks/overview), making it easier than ever to build with these powerful models. We’ll dive deeper into some of these exciting new functionalities, explore practical code examples, and share advanced notebooks for you to continue your learning journey. For those interested in exploring Gemini 2\.0 Flash via Google AI Studio or the Gemini Developer API, please have a look at the [Gemini 2\.0 Cookbook](https://github.com/google-gemini/cookbook/tree/main/gemini-2).

Want to skip the blog and go straight notebooks that show how to use Gemini 2\.0 Flash with the Vertex AI Gemini API? Go to the the [Generative AI on Vertex AI cookbook](https://cloud.google.com/vertex-ai/generative-ai/docs/cookbook). Make sure you bookmark it for easy access later!


## Google Gen AI SDK

Want to integrate Gemini 2\.0 Flash into your application? The Google Gen AI SDK is your go\-to tool. The new Google Gen AI SDK provides a unified interface to Gemini 2\.0 through both the [Gemini Developer API](https://ai.google.dev/gemini-api/docs/sdks) and the [Vertex AI Gemini API](https://cloud.google.com/vertex-ai/generative-ai/docs/sdks/overview), and is currently available for Python and Go

With a few exceptions, code that runs on one platform will run on both. This allows you to migrate your application to Vertex AI without the hassle of rewriting your code, saving you time and effort.

Importantly, the Google Gen AI SDK isn’t limited to just the latest models; you can also leverage the capabilities of Gemini 1\.5 models. This choice allows developers to select the model that best fits their specific performance, latency and cost requirements.


## Getting started with Gemini 2\.0 Flash with the Google Gen AI SDK

Let’s have a look at how you can get started with Gemini 2\.0 Flash using the Gemini API on Vertex AI which you can access through the Google Gen AI SDK. In this example we will use the [Python SDK](https://googleapis.github.io/python-genai/).


### Initialize the Google Gen AI SDK

First you will need to install the `google-genai` Python SDK in your development environment:

`pip install google-genai`

Next, you’ll need initialize the client and set your Google Cloud project ID and set location to `us-central1`. There are two primary ways to initialize the client:

**Option 1: Explicitly setting your project and location**

One way to initialize the client is by directly providing your project ID and location details. This makes your code self\-contained and easy to understand:

`client = genai.Client( vertexai=True, project="<your-google-cloud-project>", location="us-central1")`

Remember to replace `"<your-google-cloud-project>"` with your actual project ID. Take a look at the [documentation](https://cloud.google.com/vertex-ai/generative-ai/docs/gemini-v2) to learn more about creating a Google Cloud Project.

**Option 2: Using environment variables**

Alternatively, you can configure the client using environment variables. This approach is useful for managing configurations across different environments and keeping sensitive information out of your code:

`export GOOGLE_CLOUD_PROJECT="<your-google-cloud-project>"export GOOGLE_CLOUD_LOCATION="us-central1"export GOOGLE_GENAI_USE_VERTEXAI=True`

Next, you can initialize the client and call the `gemini-2.0-flash-exp` model and call the API:

`client = genai.Client()model_id = “gemini-2.0-flash-exp”`

`response = client.models.generate_content(model=model_id, contents=”Explain to me, a front-end developer, what is Vertex AI and how can I use it to build GenAI applications?”)`

`print(response.text)`


### Using the Gen AI SDK with Gemini 2\.0 Flash

Similar to previous versions Gemini 2\.0 Flash is multimodal, accepting prompts that incorporate text, PDF documents, images, audio, and even video.

Here’s a quick example of how to send an image along with a text prompt using the sdk:

`import requests`

`from PIL import Image`

`image = Image.open( requests.get( “https://storage.googleapis.com/cloud-samples-data/generative-ai/image/meal.png", stream=True, ).raw)`

`response = client.models.generate_content( model=MODEL_ID, contents=[ image, “Write a short and engaging blog post based on this picture.”, ])`

`print(response.text)`

This is the image that we’re sending to Gemini:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*0-vLyoPRps30psHD)

You can easily configure the parameters for the model by using `GenerateContentConfig`:

`from google.genai.types import (GenerateContentConfig)`

`gemini_config = GenerateContentConfig( temperature=0.2, top_p=0.95, top_k=20, candidate_count=1, seed=5, max_output_tokens=100, stop_sequences=[“STOP!”], )`

`response = client.models.generate_content( model=MODEL_ID, contents=”Tell me how the internet works, but pretend I’m a puppy who only understands squeaky toys.”, config=gemini_config)`

`print(response.text)`

**Notebook:** Want to learn more about how to use Gemini 2\.0 Flash on Vertex AI? Have a look at [this notebook](https://github.com/GoogleCloudPlatform/generative-ai/blob/main/gemini/getting-started/intro_gemini_2_0_flash.ipynb), its a great introduction into how to use multimodal data, configure your model parameters, use controlled generation and much more!


## Build with Gemini 2\.0 Flash

Gemini 2\.0 comes with a set of new features and enhanced core capabilities. Some of the new features are:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*dxHBpfbt0kRuYVgy)

Let’s dive a bit deeper into some of these additional features and see how you can use them.


### Multimodal Live API

The [Multimodal Live API](https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/multimodal-live) enables real\-time interaction with Gemini, making it ideal for applications that process streaming data, such as those involving live video. The API facilitates low\-latency, bidirectional communication with Gemini using [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API), supporting voice and video interactions.

This API allows for natural, human\-like voice conversations, including the ability for users to interrupt the model’s responses with voice commands. The voices are preset and developers have the option to select from the voices available. The model can process text, audio, and video input, and can provide text and audio output, enabling a wide range of multimodal applications. The Multimodal Live API is accessed through the `BidiGenerateContent` method within the Gemini API, leveraging [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) for real\-time communication.

Here’s a simple text\-to\-text example to help you get started with the Multimodal Live API:

`MODEL = ‘models/gemini-2.0-flash-exp’CONFIG = {‘generation_config’: {‘response_modalities’: [‘AUDIO’]}}`

`async with client.aio.live.connect(model=MODEL, config=CONFIG) as session: message = ‘Summarize what is happening in this Podcast?’ print(‘> ‘, message, ‘\n’) await session.send(message, end_of_turn=True)`

`# For text responses, when the model’s turn is complete it breaks out of the loop. async for response in session: model_turn = response.server_content.model_turn for part in model_turn.parts: print(“- “, part.text)`

Here are a few use cases that highlight the potential of the Multimodal Live API:

* **Live coding agent:** Use the Multimodal Live API as a live coding buddy to speed up your coding.
* **Interactive language tutoring:** Imagine a language learning application where students can converse in real\-time with Gemini. The API can analyze pronunciation, provide immediate feedback, and engage in free\-flowing dialogue.
* **Real\-time transcription and translation:** For international conferences or business meetings, the Multimodal Live API can transcribe and translate conversations on the fly. Participants speaking different languages can understand each other seamlessly.

**Notebook:** Want to learn more about the Multimodal Live API? Have a look at [this notebook](https://github.com/GoogleCloudPlatform/generative-ai/blob/main/gemini/multimodal-live-api/real_time_rag_retail_gemini_2_0.ipynb) on real\-time RAG with the Multimodal Live API and Gemini 2\.0 on Vertex AI.


### Search as a Tool

Large language models (LLMs) can sometimes provide information that might be outdated. To ensure accuracy and recency, especially when dealing with factual queries, grounding with external sources can be important. Using [Search as a Tool](https://cloud.google.com/vertex-ai/generative-ai/docs/gemini-v2#search-tool), you can improve the quality of responses from Gemini models. Starting with the `gemini-2.0-flash-exp` model, Google Search is available as a tool. This means the model can intelligently decide when to use Google Search to augment its knowledge.

To use Search as a Tool, you can add the `tools` keyword argument to the `GenerateContentConfig`. First, you need to create a `GoogleSearch` tool object, and then pass it as a `Tool` object. This instructs Gemini to first perform a Google Search with the prompt, then construct an answer based on the web search results.

[Dynamic Retrieval](https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/ground-gemini#dynamic-retrieval) lets you set a threshold for when grounding is used for model responses. This is useful when the prompt doesn’t require an answer grounded in Google Search. This helps you manage latency, quality, and cost more effectively.

`from IPython.display import` `Markdown`

`google_search_tool = Tool( google_search=GoogleSearch())`

`response = client.models.generate_content( model=’gemini-2.0-flash-exp’, contents=’How many people live in the Netherlands?’, config=GenerateContentConfig( tools=[google_search_tool] ),)`

`display(Markdown(response.text))`

`print(response.candidates[0].grounding_metadata)`

Let’s have a look at example responses. The first image shows a response from Gemini 2\.0 Flash without `GoogleSearch()` enabled.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*oy0V3qZXbxbzOLTL)

The second image displays the output of Gemini 2\.0 Flash with `GoogleSearch()` enabled. Can you spot the difference? This output includes grounding chunks (not included in the image), that can include an URL linking to the source, in this case, the [Worldometer](https://www.worldometers.info/world-population/netherlands-population/) website.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*qH_uIpR2353xZsu2)

**Notebook:** Want to learn more about Search as a Tool? Have a look at [this notebook](https://github.com/GoogleCloudPlatform/generative-ai/blob/main/gemini/use-cases/marketing/creating_marketing_assets_gemini_2_0.ipynb) on using Gemini 2\.0 for marketing.


### Agentic experiences

Gemini 2\.0 can help you build multi\-agent systems that streamline complex workflows, like a research agent. You can leverage Gemini 2\.0 to build intelligent multi\-agents systems to gather insights from multiple sources, perform intricate analysis, and generate comprehensive reports. This is all powered by Gemini 2\.0 Flash features like:

* **Function calling:** Structure your agents’ behavior and interactions.
* **Controlled generated output:** Generate consistent, easily\-validatable data.
* **Send asynchronous requests:** Handle parallel tasks efficiently for faster results.

**Notebook:** Get a deep dive into core multi\-agent concepts and practical design patterns, perfect for tasks like market research and competitive analysis. Start building today with this [notebook](https://github.com/GoogleCloudPlatform/generative-ai/blob/main/gemini/agents/research-multi-agents/intro_research_multi_agents_gemini_2_0.ipynb) on multi\-agent systems!


## Continue your learning journey

Ready to explore Gemini 2\.0 on Vertex AI and the Google Gen AI SDK further? We’ve created a collection of code assets designed to deepen your understanding and help you build awesome Generative AI use cases.

**Vertex AI Gemini API Code Assets**

[Intro to Gemini 2\.0 Flash](https://github.com/GoogleCloudPlatform/generative-ai/blob/main/gemini/getting-started/intro_gemini_2_0_flash.ipynb)

Shows how to use the Gen AI SDK to access Google generative AI services and models including Gemini 1\.5 and other 1P models.

[Intro to Google Gen AI SDK](https://github.com/GoogleCloudPlatform/generative-ai/blob/main/gemini/getting-started/intro_genai_sdk.ipynb)

Shows how to access Gemini 2\.0 with Gen AI SDK

[Multimodal Live API Demo App](https://github.com/GoogleCloudPlatform/generative-ai/blob/main/gemini/multimodal-live-api/websocket-demo-app)

Shows how to use Multimodal Live API with Gen AI SDK

[Real\-Time RAG with Multimodal Live API](https://github.com/GoogleCloudPlatform/generative-ai/blob/main/gemini/multimodal-live-api/real_time_rag_retail_gemini_2_0.ipynb)

Demonstrates how to use the Vertex AI Gemini API (speech generation) and the Multimodal Live API in a retail scenario. Learn about Gemini 2\.0, Multimodal Live API and RAG.

[Creating Marketing Assets using Gemini 2\.0](https://github.com/GoogleCloudPlatform/generative-ai/blob/main/gemini/use-cases/marketing/creating_marketing_assets_gemini_2_0.ipynb)

Demonstrates how to localize marketing assets using the Gemini 2\.0 API, including Search as a tool and controlled output generation.

[Vertex AI Gemini Research Multi Agent Demo](https://github.com/GoogleCloudPlatform/generative-ai/blob/main/gemini/agents/research-multi-agents/intro_research_multi_agents_gemini_2_0.ipynb)

Demonstrates how to build a research multi\-agent using Gemini 2 and the Multimodal Live API. Learn about multi\-agent framework, Gemini 2, function calling and Search as a tool.

[Interactive Loan Application Assistant](https://github.com/GoogleCloudPlatform/generative-ai/blob/main/gemini/multimodal-live-api/real_time_rag_bank_loans_gemini_2_0.ipynb)

Demonstrates how to use Gemini 2\.0 as a personal file assistant to empower users to seamlessly understand and interact with their loan documents.

**Important:** Be aware that Gemini 2\.0 Flash is an experimental preview release.

We encourage you to experiment, adapt, and share your own discoveries — the potential of Gemini is vast, and we’re excited to see what you build!

*Big thanks to Alok Pattani, Lavi Nigam, Koushik Ghosh, Deepak Moonat and Polong Lin for their contributions to this blog post.*


