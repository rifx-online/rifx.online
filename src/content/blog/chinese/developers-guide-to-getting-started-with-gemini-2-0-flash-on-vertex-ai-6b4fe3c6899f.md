---
title: "顶点人工智能 Gemini 2.0 Flash 开发人员入门指南"
meta_title: "顶点人工智能 Gemini 2.0 Flash 开发人员入门指南"
description: "Gemini 2.0 Flash在Vertex AI上提供了显著的性能提升和新功能，包括原生图像生成和可控文本转语音能力。开发者可以通过Google Gen AI SDK轻松集成该模型，支持多模态输入和输出，提升了实时交互体验。新API和工具如Google搜索增强了模型的响应质量，适用于多种应用场景，如实时编码助手和语言学习。文中提供了丰富的代码示例和学习资源，帮助开发者深入探索Gemini 2.0的潜力。"
date: 2024-12-15T08:25:26Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*szKqds28bpXwN-vWGESVIg.png"
categories: ["Technology", "Programming", "Generative AI"]
author: "Rifx.Online"
tags: ["Gemini", "Vertex", "Multimodal", "SDK", "Python"]
draft: False

---





[Gemini 2\.0 已经到来](https://blog.google/technology/google-deepmind/google-gemini-ai-update-december-2024/)，带来了为这个新代理时代构建的下一代能力。Gemini 2\.0 Flash 现在可以通过 [Vertex AI Gemini API](https://cloud.google.com/vertex-ai/generative-ai/docs/gemini-v2)、[Vertex AI Studio](https://console.cloud.google.com/vertex-ai/studio)、[Google AI Studio](https://aistudio.google.com/) 和 [Gemini Developer API](https://ai.google.dev/gemini-api/docs/models/gemini-v2) 作为实验性预览使用。这个新模型引入了显著的进步：

* **速度和性能**：Gemini 2\.0 Flash 的首次令牌时间 (TTFT) 相比 Gemini 1\.5 Flash 有了显著改善。
* **新模态**：Gemini 2\.0 引入了原生图像生成和可控的文本转语音能力，使图像编辑、本地化艺术作品创建和富有表现力的叙事成为可能。
* **质量**：该模型在质量上保持或超过了像 Gemini 1\.5 Pro 这样的更大模型（见下图）。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*GkceL7XtV0RRWsKe)

* **多模态实时 API**：这个新 API 帮助您创建实时视觉和音频流应用程序，支持工具使用。
* **改进的代理体验**：Gemini 2\.0 在多模态理解、编码、复杂指令执行和函数调用方面提供了改进。这些改进共同支持更好的代理体验。

在这篇博客文章中，您将学习如何在 Google Cloud 上使用 Vertex AI 和全新的简化版 [Google Gen AI SDK](https://cloud.google.com/vertex-ai/generative-ai/docs/sdks/overview) 使用 Gemini 2\.0 Flash，使构建这些强大模型比以往任何时候都更容易。我们将深入探讨一些令人兴奋的新功能，探索实用的代码示例，并分享高级笔记本，帮助您继续学习之旅。对于那些有兴趣通过 Google AI Studio 或 Gemini Developer API 探索 Gemini 2\.0 Flash 的用户，请查看 [Gemini 2\.0 Cookbook](https://github.com/google-gemini/cookbook/tree/main/gemini-2)。

想跳过博客，直接查看展示如何使用 Vertex AI Gemini API 的 Gemini 2\.0 Flash 笔记本吗？请访问 [Generative AI on Vertex AI cookbook](https://cloud.google.com/vertex-ai/generative-ai/docs/cookbook)。确保您将其添加到书签中，以便后续轻松访问！

## Google Gen AI SDK

想要将 Gemini 2\.0 Flash 集成到您的应用程序中吗？Google Gen AI SDK 是您的首选工具。新的 Google Gen AI SDK 通过 [Gemini Developer API](https://ai.google.dev/gemini-api/docs/sdks) 和 [Vertex AI Gemini API](https://cloud.google.com/vertex-ai/generative-ai/docs/sdks/overview) 提供了一个统一的接口，目前支持 Python 和 Go。

除了少数例外，运行在一个平台上的代码也可以在另一个平台上运行。这使您能够将应用程序迁移到 Vertex AI，而无需重新编写代码，从而节省时间和精力。

重要的是，Google Gen AI SDK 不仅限于最新的模型；您还可以利用 Gemini 1\.5 模型的能力。这个选择允许开发人员选择最符合其特定性能、延迟和成本要求的模型。

## 使用 Google Gen AI SDK 开始使用 Gemini 2\.0 Flash

让我们来看看如何通过 Google Gen AI SDK 访问 Vertex AI 上的 Gemini API 来开始使用 Gemini 2\.0 Flash。在这个例子中，我们将使用 [Python SDK](https://googleapis.github.io/python-genai/)。

### 初始化 Google Gen AI SDK

首先，您需要在开发环境中安装 `google-genai` Python SDK：

`pip install google-genai`

接下来，您需要初始化客户端并设置您的 Google Cloud 项目 ID 和位置为 `us-central1`。初始化客户端有两种主要方法：

**选项 1：显式设置项目和位置**

一种初始化客户端的方法是直接提供您的项目 ID 和位置信息。这使您的代码自包含且易于理解：

`client = genai.Client( vertexai=True, project="<your-google-cloud-project>", location="us-central1")`

请记得将 `"<your-google-cloud-project>"` 替换为您的实际项目 ID。请查看 [文档](https://cloud.google.com/vertex-ai/generative-ai/docs/gemini-v2) 以了解有关创建 Google Cloud 项目的更多信息。

**选项 2：使用环境变量**

另外，您可以使用环境变量配置客户端。这种方法对于管理不同环境中的配置以及将敏感信息与代码分离非常有用：

`export GOOGLE_CLOUD_PROJECT="<your-google-cloud-project>"export GOOGLE_CLOUD_LOCATION="us-central1"export GOOGLE_GENAI_USE_VERTEXAI=True`

接下来，您可以初始化客户端并调用 `gemini-2.0-flash-exp` 模型并调用 API：

`client = genai.Client()model_id = “gemini-2.0-flash-exp”`

`response = client.models.generate_content(model=model_id, contents=”Explain to me, a front-end developer, what is Vertex AI and how can I use it to build GenAI applications?”)`

`print(response.text)`

### 使用Gen AI SDK与Gemini 2.0 Flash

与之前的版本类似，Gemini 2.0 Flash 是多模态的，接受包含文本、PDF文档、图像、音频甚至视频的提示。

以下是如何使用sdk发送图像和文本提示的快速示例：

`import requests`

`from PIL import Image`

`image = Image.open( requests.get( “https://storage.googleapis.com/cloud-samples-data/generative-ai/image/meal.png", stream=True, ).raw)`

`response = client.models.generate_content( model=MODEL_ID, contents=[ image, “根据这张图片写一篇简短而引人入胜的博客文章。”, ])`

`print(response.text)`

这是我们发送给Gemini的图像：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*0-vLyoPRps30psHD)

您可以通过使用 `GenerateContentConfig` 来轻松配置模型的参数：

`from google.genai.types import (GenerateContentConfig)`

`gemini_config = GenerateContentConfig( temperature=0.2, top_p=0.95, top_k=20, candidate_count=1, seed=5, max_output_tokens=100, stop_sequences=[“STOP!”], )`

`response = client.models.generate_content( model=MODEL_ID, contents=”告诉我互联网是如何工作的，但假装我是一只只理解吱吱玩具的小狗。”, config=gemini_config)`

`print(response.text)`

**Notebook:** 想了解更多关于如何在Vertex AI上使用Gemini 2.0 Flash的信息吗？请查看[这个笔记本](https://github.com/GoogleCloudPlatform/generative-ai/blob/main/gemini/getting-started/intro_gemini_2_0_flash.ipynb)，这是关于如何使用多模态数据、配置模型参数、使用控制生成等的极佳介绍！

## 使用 Gemini 2\.0 Flash 构建

Gemini 2\.0 带来了一系列新功能和增强的核心能力。以下是一些新功能：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*dxHBpfbt0kRuYVgy)

让我们深入了解这些附加功能，并看看您如何使用它们。

### 多模态实时 API

[多模态实时 API](https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/multimodal-live) 使与 Gemini 的实时交互成为可能，非常适合处理流数据的应用程序，例如涉及实时视频的应用。该 API 通过 [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) 实现与 Gemini 的低延迟双向通信，支持语音和视频交互。

该 API 允许进行自然、类人语音对话，包括用户可以通过语音命令打断模型响应的能力。声音是预设的，开发者可以选择可用的声音。该模型可以处理文本、音频和视频输入，并可以提供文本和音频输出，从而支持广泛的多模态应用。多模态实时 API 通过 Gemini API 中的 `BidiGenerateContent` 方法访问，利用 [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) 进行实时通信。

以下是一个简单的文本到文本的示例，帮助您开始使用多模态实时 API：

`MODEL = ‘models/gemini-2.0-flash-exp’CONFIG = {‘generation_config’: {‘response_modalities’: [‘AUDIO’]}}`

`async with client.aio.live.connect(model=MODEL, config=CONFIG) as session: message = ‘Summarize what is happening in this Podcast?’ print(‘> ‘, message, ‘\n’) await session.send(message, end_of_turn=True)`

`# For text responses, when the model’s turn is complete it breaks out of the loop. async for response in session: model_turn = response.server_content.model_turn for part in model_turn.parts: print(“- “, part.text)`

以下是一些突出多模态实时 API 潜力的用例：

* **实时编码助手：** 使用多模态实时 API 作为实时编码伙伴，加快您的编码速度。
* **互动语言辅导：** 想象一个语言学习应用程序，学生可以与 Gemini 进行实时对话。该 API 可以分析发音，提供即时反馈，并进行自由流畅的对话。
* **实时转录和翻译：** 对于国际会议或商务会议，多模态实时 API 可以实时转录和翻译对话。说不同语言的参与者可以无缝理解彼此。

**笔记本：** 想了解更多关于多模态实时 API 的信息吗？请查看 [这个笔记本](https://github.com/GoogleCloudPlatform/generative-ai/blob/main/gemini/multimodal-live-api/real_time_rag_retail_gemini_2_0.ipynb)，了解多模态实时 API 和 Vertex AI 上的 Gemini 2.0 的实时 RAG。

### 将搜索作为工具

大型语言模型（LLMs）有时可能提供过时的信息。为了确保准确性和时效性，特别是在处理事实查询时，使用外部来源进行支持是很重要的。通过使用 [将搜索作为工具](https://cloud.google.com/vertex-ai/generative-ai/docs/gemini-v2#search-tool)，您可以提高 Gemini 模型的响应质量。从 `gemini-2.0-flash-exp` 模型开始，Google 搜索作为工具可用。这意味着模型可以智能地决定何时使用 Google 搜索来增强其知识。

要使用将搜索作为工具，您可以将 `tools` 关键字参数添加到 `GenerateContentConfig` 中。首先，您需要创建一个 `GoogleSearch` 工具对象，然后将其作为 `Tool` 对象传递。这指示 Gemini 首先使用提示执行 Google 搜索，然后根据网络搜索结果构建答案。

[动态检索](https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/ground-gemini#dynamic-retrieval) 允许您设置何时使用支持来生成模型响应的阈值。这在提示不需要基于 Google 搜索的答案时非常有用。这有助于您更有效地管理延迟、质量和成本。

`from IPython.display import` `Markdown`

`google_search_tool = Tool( google_search=GoogleSearch())`

`response = client.models.generate_content( model=’gemini-2.0-flash-exp’, contents=’荷兰有多少人？’, config=GenerateContentConfig( tools=[google_search_tool] ),)`

`display(Markdown(response.text))`

`print(response.candidates[0].grounding_metadata)`

让我们看看示例响应。第一张图片显示了未启用 `GoogleSearch()` 的 Gemini 2\.0 Flash 的响应。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*oy0V3qZXbxbzOLTL)

第二张图片显示了启用 `GoogleSearch()` 的 Gemini 2\.0 Flash 的输出。您能发现区别吗？此输出包括支持块（未包含在图像中），可以包含指向源的 URL，在本例中为 [Worldometer](https://www.worldometers.info/world-population/netherlands-population/) 网站。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*qH_uIpR2353xZsu2)

**笔记本：** 想了解更多关于将搜索作为工具的信息吗？请查看 [这个笔记本](https://github.com/GoogleCloudPlatform/generative-ai/blob/main/gemini/use-cases/marketing/creating_marketing_assets_gemini_2_0.ipynb)，了解如何使用 Gemini 2\.0 进行营销。

### 代理体验

Gemini 2.0 可以帮助您构建多代理系统，以简化复杂的工作流程，比如研究代理。您可以利用 Gemini 2.0 构建智能多代理系统，从多个来源收集洞察，进行复杂分析，并生成全面报告。这一切都得益于 Gemini 2.0 的 Flash 功能，如：

* **函数调用：** 结构化您的代理行为和交互。
* **受控生成输出：** 生成一致、易于验证的数据。
* **发送异步请求：** 高效处理并行任务，以获得更快的结果。

**笔记本：** 深入了解核心多代理概念和实用设计模式，非常适合市场研究和竞争分析等任务。今天就开始构建这个关于多代理系统的 [笔记本](https://github.com/GoogleCloudPlatform/generative-ai/blob/main/gemini/agents/research-multi-agents/intro_research_multi_agents_gemini_2_0.ipynb)！

## 继续您的学习旅程

准备进一步探索 Vertex AI 上的 Gemini 2\.0 和 Google Gen AI SDK 吗？我们创建了一系列代码资产，旨在加深您的理解，并帮助您构建出色的生成式 AI 用例。

**Vertex AI Gemini API 代码资产**

[Gemini 2\.0 快速入门](https://github.com/GoogleCloudPlatform/generative-ai/blob/main/gemini/getting-started/intro_gemini_2_0_flash.ipynb)

展示了如何使用 Gen AI SDK 访问 Google 生成式 AI 服务和模型，包括 Gemini 1\.5 和其他 1P 模型。

[Google Gen AI SDK 入门](https://github.com/GoogleCloudPlatform/generative-ai/blob/main/gemini/getting-started/intro_genai_sdk.ipynb)

展示了如何使用 Gen AI SDK 访问 Gemini 2\.0。

[多模态实时 API 演示应用](https://github.com/GoogleCloudPlatform/generative-ai/blob/main/gemini/multimodal-live-api/websocket-demo-app)

展示了如何使用 Gen AI SDK 进行多模态实时 API。

[实时 RAG 与多模态实时 API](https://github.com/GoogleCloudPlatform/generative-ai/blob/main/gemini/multimodal-live-api/real_time_rag_retail_gemini_2_0.ipynb)

演示了如何在零售场景中使用 Vertex AI Gemini API（语音生成）和多模态实时 API。了解 Gemini 2\.0、多模态实时 API 和 RAG。

[使用 Gemini 2\.0 创建营销资产](https://github.com/GoogleCloudPlatform/generative-ai/blob/main/gemini/use-cases/marketing/creating_marketing_assets_gemini_2_0.ipynb)

演示了如何使用 Gemini 2\.0 API 本地化营销资产，包括将搜索作为工具和受控输出生成。

[Vertex AI Gemini 研究多代理演示](https://github.com/GoogleCloudPlatform/generative-ai/blob/main/gemini/agents/research-multi-agents/intro_research_multi_agents_gemini_2_0.ipynb)

演示了如何使用 Gemini 2 和多模态实时 API 构建研究多代理。了解多代理框架、Gemini 2、功能调用和将搜索作为工具。

[互动贷款申请助手](https://github.com/GoogleCloudPlatform/generative-ai/blob/main/gemini/multimodal-live-api/real_time_rag_bank_loans_gemini_2_0.ipynb)

演示了如何使用 Gemini 2\.0 作为个人文件助手，帮助用户无缝理解和处理他们的贷款文件。

**重要提示：** 请注意，Gemini 2\.0 快速入门是实验性预览版本。

我们鼓励您进行实验、调整并分享您自己的发现——Gemini 的潜力巨大，我们期待看到您所构建的内容！

*特别感谢 Alok Pattani、Lavi Nigam、Koushik Ghosh、Deepak Moonat 和 Polong Lin 对本博客文章的贡献。*

