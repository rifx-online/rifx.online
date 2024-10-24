---
title: "6 种最佳本地运行模型的 LLM 工具"
meta_title: "6 种最佳本地运行模型的 LLM 工具"
description: "运行大型语言模型 (LLM)（例如 ChatGPT 和 Claude）通常涉及将数据发送到由 OpenAI 和其他 AI 模型管理的服务器……"
date: 2024-10-24T17:47:43Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*2MB6-INUUGLR0NR_iOACIg.jpeg"
categories: ["Technology", "Programming", "Health"]
author: "Rifx.Online"
tags: ["LLM", "local", "deployment", "customization", "telehealth"]
draft: False

---





运行大型语言模型（LLMs）如 [ChatGPT](https://openai.com/chatgpt/mac/) 和 [Claude](https://claude.ai/) 通常涉及将数据发送到由 [OpenAI](https://openai.com/) 和其他 AI 模型提供商管理的服务器。虽然这些服务是安全的，但一些企业更倾向于将其数据完全离线，以获得更高的隐私保护。

本文将介绍开发人员可以使用的六款工具，以便在本地运行和测试 LLM，确保他们的数据永远不会离开他们的设备，这类似于 [端到端加密](https://getstream.io/blog/end-to-end-encryption/) 保护隐私的方式。

## 为什么使用本地 LLM？

像 [LM Studio](https://lmstudio.ai/) 这样的工具在用户使用它来运行本地 LLM 时，不会收集用户数据或跟踪用户的行为。它允许所有聊天数据保留在本地计算机上，而不与 AI/ML 服务器共享。

* **隐私**：您可以以多轮的方式提示本地 LLM，而不会让您的提示数据离开本地主机。
* **自定义选项**：本地 LLM 提供 CPU 线程、温度、上下文长度、GPU 设置等高级配置选项。这类似于 OpenAI 的游乐场。
* **支持和安全性**：它们提供与 OpenAI 或 Claude 相似的支持和安全性。
* **订阅和费用**：这些工具免费使用，并且不需要每月订阅。对于像 OpenAI 这样的云服务，每个 API 请求都需要付费。本地 LLM 有助于节省费用，因为没有每月订阅。
* **离线支持**：您可以在离线时加载和连接大型语言模型。
* **连接性**：有时，连接到像 OpenAI 这样的云服务可能会导致信号和连接不良。

## 六大免费本地 LLM 工具

根据您的具体使用案例，您可以选择几种离线 LLM 应用程序。这些工具中有一些完全免费供个人和商业使用。其他工具可能需要您发送请求以用于商业用途。对于 Mac、Windows 和 Linux，有多种本地 LLM 工具可供选择。以下是您可以选择的六个最佳工具。

## 1. LM Studio

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*svbQPZKu08of7Kv6)

[LM Studio](https://lmstudio.ai/) 可以运行任何格式为 `gguf` 的模型文件。它支持来自模型提供商的 `gguf` 文件，如 [Llama 3.1](https://llama.meta.com/)、[Phi 3](https://huggingface.co/docs/transformers/main/en/model_doc/phi3)、[Mistral](https://mistral.ai/) 和 [Gemma](https://ai.google.dev/gemma)。要使用 LM Studio，请访问上述链接并下载适合您机器的应用程序。启动 LM Studio 后，主页会展示可下载和测试的顶级 LLM。还有一个搜索栏，可以筛选并下载来自不同 AI 提供商的特定模型。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*sbS3VqiLgDsftgs2)

从特定公司的模型中搜索会显示多个模型，范围从小型到大型 [quantization](https://huggingface.co/docs/optimum/en/concept_guides/quantization)。根据您的机器，LM Studio 会使用兼容性猜测来突出显示适合该机器或平台的模型。

## LM Studio 的关键特性

LM Studio 提供与 ChatGPT 相似的功能和特性。它具有多个功能。以下是 LM Studio 的关键特性。

* **模型参数自定义**：这允许您调整温度、最大令牌、频率惩罚等。
* **聊天历史**：允许您保存提示以供后续使用。
* **参数和用户界面提示**：您可以将鼠标悬停在信息按钮上以查找模型参数和术语。
* **跨平台**：LM Studio 可在 Linux、Mac 和 Windows 操作系统上使用。
* **机器规格检查**：LM Studio 检查计算机规格，如 GPU 和内存，并报告兼容的模型。这可以防止下载可能在特定机器上无法运行的模型。
* **AI 聊天和游乐场**：以多轮聊天格式与大型语言模型进行对话，并通过同时加载多个 LLM 进行实验。
* **开发者本地推理服务器**：允许开发者设置一个类似于 OpenAI API 的本地 HTTP 服务器。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*9bHmRiOSf6gm-u3P)

本地服务器提供示例 Curl 和 Python 客户端请求。此功能有助于使用 LM Studio 构建 AI 应用程序，以访问特定的 LLM。

```python
## Example: reuse your existing OpenAI setup
from openai import OpenAI

## Point to the local server
client = OpenAI(base_url="http://localhost:1234/v1", api_key="lm-studio")

completion = client.chat.completions.create(
  model="TheBloke/Mistral-7B-Instruct-v0.1-GGUF",
  messages=[
    {"role": "system", "content": "Always answer in rhymes."},
    {"role": "user", "content": "Introduce yourself."}
  ],
  temperature=0.7,
)

print(completion.choices[0].message)
```
通过上述示例 Python 代码，您可以重用现有的 OpenAI 配置，并将基本 URL 修改为指向您的本地主机。

* **OpenAI 的 Python 库导入**：LM Studio 允许开发者导入 OpenAI Python 库，并将基本 URL 指向本地服务器（localhost）。
* **多模型会话**：使用单个提示并选择多个模型进行评估。

## 使用 LM Studio 的好处

该工具可供个人免费使用，允许开发者通过应用内聊天用户界面和游乐场运行 LLM。它提供了一个华丽且易于使用的界面，带有过滤器，并支持连接到 OpenAI 的 Python 库，无需 API 密钥。公司和企业可以根据要求使用 LM Studio。然而，它需要 M1/M2/M3 Mac 或更高版本，或具有支持 [AVX2](https://edc.intel.com/content/www/us/en/design/ipla/software-development-platforms/client/platforms/alder-lake-desktop/12th-generation-intel-core-processors-datasheet-volume-1-of-2/009/intel-advanced-vector-extensions-2-intel-avx2/) 的处理器的 Windows PC。Intel 和 [AMD](https://www.amd.com/en/support/download/drivers.html) 用户仅限于使用 [v0.2.31](https://lmstudio.ai/) 中的 Vulkan 推理引擎。

## 2. Jan

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*7YeH_48iFYB4lDRu)

将 [Jan](https://jan.ai/) 理解为一个设计用于离线操作的开源版本的 ChatGPT。它由一个用户社区构建，秉持用户拥有的理念。Jan 允许您在设备上运行流行的模型，如 [Mistral](https://huggingface.co/models?other=mistral) 或 [Llama](https://huggingface.co/models?other=llama)，而无需连接互联网。使用 Jan，您可以访问远程 API，如 OpenAI 和 [Groq](https://groq.com/)。

## Jan 的主要特点

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*ufyOE6QkcHw8X5U7)

Jan 是一款电子应用程序，其功能类似于 LM Studio。它通过将消费者设备转变为 AI 计算机，使 AI 变得开放和可访问。由于这是一个开源项目，开发者可以为其贡献代码并扩展其功能。以下是 Jan 的主要特点。

* **本地**：您可以在设备上运行您喜欢的 AI 模型，而无需将其连接到互联网。
* **即用模型**：下载 Jan 后，您将获得一组已安装的模型以供开始使用。也可以搜索特定模型。
* **模型导入**：支持从 Hugging Face 等来源导入模型。
* **免费、跨平台和开源**：Jan 完全免费，开源，并可在 Mac、Windows 和 Linux 上运行。
* **自定义推理参数**：调整模型参数，如最大令牌、温度、流、频率惩罚等。所有偏好设置、模型使用和配置都保留在您的计算机上。
* **扩展**：Jan 支持 [TensortRT](https://github.com/NVIDIA/TensorRT) 和 [Inference Nitro](https://huggingface.co/jan-hq/nitro-v1.2-e3) 等扩展，以自定义和增强您的 AI 模型。

## 使用 Jan 的好处

Jan 提供了一个干净简单的界面来与 LLM 互动，并且将所有数据和处理信息保存在本地。它已经为您安装了超过七十个大型语言模型供您使用。这些现成的模型的可用性使得连接和与远程 API（如 OpenAI 和 Mistral）互动变得简单。Jan 还有一个很棒的 [GitHub](https://github.com/janhq/jan)、[Discord](https://discord.gg/FTk2MvZwJH) 和 [Hugging Face](https://huggingface.co/janhq) 社区，可以关注并寻求帮助。然而，像所有 LLM 工具一样，这些模型在 Apple Silicon Macs 上的运行速度比在 Intel 机器上更快。

## 3. Llamafile

[Llamafile](https://github.com/Mozilla-Ocho/llamafile) 由 [Mozilla](https://www.mozilla.org/en-US/?v=1) 支持，旨在通过快速的 [CPU 推理](https://huggingface.co/docs/transformers/en/perf_infer_cpu) 使开源 AI 对每个人都可访问，而无需网络连接。它将 LLM 转换为多平台的 [可执行链接格式](https://gist.github.com/x0nu11byt3/bcb35c3de461e5fb66173071a2379779) (ELF)。它提供了将 AI [集成](https://getstream.io/chat/solutions/ai-integration/) 到应用程序中的最佳选项之一，使您能够仅通过一个可执行文件运行 LLM。

## Llamafile 的工作原理

它旨在将权重转换为多个可执行程序，这些程序无需安装即可在 Windows、MacOS、Linux、Intel、ARM、FreeBSD 等架构上运行。在底层，Llamafile 使用 [tinyBLAST](https://github.com/ggerganov/llama.cpp/issues/5048) 在像 Windows 这样的操作系统上运行，而无需 SDK。

## Llamafile 的关键特性

* **可执行文件**：与 LM Studio 和 Jan 等其他 LLM 工具不同，Llamafile 只需一个可执行文件即可运行 LLM。
* **使用现有模型**：Llamafile 支持使用现有的模型工具，如 Ollama 和 LM Studio。
* **访问或创建模型**：您可以访问 OpenAI、Mistral、Groq 等流行 LLM。它还提供从头创建模型的支持。
* **模型文件转换**：您可以将许多流行 LLM 的文件格式转换，例如，将 `.gguf` 转换为 `.llamafile` 只需一个命令。

`llamafile-convert mistral-7b.gguf`

## 开始使用 Llamafile

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*4PV1KsCZvvVKqFll)

要安装 Llamafile，请访问 Huggingface 网站，从导航中选择 **Models**，然后搜索 **Llamafile**。您还可以从下面的 URL 安装您喜欢的 [量化](https://huggingface.co/docs/optimum/en/concept_guides/quantization) 版本。

[`https://huggingface.co/Mozilla/Meta-Llama-3.1-8B-Instruct-llamafile/tree/m`ain](https://huggingface.co/Mozilla/Meta-Llama-3.1-8B-Instruct-llamafile/tree/main)

**注意**：量化数字越大，响应越好。正如上图所示，本文使用 `Meta-Llama-3.1-8B-Instruct.Q6_K.llamafile`，其中 `Q6` 代表量化数字。

**步骤 1：下载 Llamafile**

从上面的链接，点击任意下载按钮以获取您喜欢的版本。如果您在机器上安装了 [wget](https://www.gnu.org/software/wget/) 工具，您可以使用以下命令下载 Llamafile。

`wget <https://huggingface.co/Mozilla/Meta-Llama-3.1-8B-Instruct-llamafile/blob/main/Meta-Llama-3.1-8B-Instruct.Q6_K.llamafile>`

您应该用您喜欢的版本替换 URL。

**步骤 2：使 Llamafile 可执行**

下载特定版本的 Llamafile 后，您应该通过导航到文件位置，使用以下命令使其可执行。

`chmod +x Meta-Llama-3.1-8B-Instruct.Q6_K.llamafile`**步骤 3：运行 Llamafile**

在文件名之前添加一个点和斜杠 `./` 来启动 Llamafile。

`./Meta-Llama-3.1-8B-Instruct.Q6_K.llamafile`

Llamafile 应用程序现在将在 `http://127.0.0.1:8080` 可用，以运行您的各种 LLMs。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*1xrwDPTfNgmEQDTx)

## 使用 Llamafile 的好处

Llamafile 通过使 LLM 容易被消费者 CPU 访问，帮助实现 AI 和 ML 的民主化。与其他本地 LLM 应用程序如 **Llama.cpp** 相比，Llamafile 提供了最快的提示处理体验，并在游戏电脑上表现更佳。由于其更快的性能，它是总结长文本和大型文档的绝佳选择。它完全离线运行并保护隐私，因此用户不会将数据分享给任何 AI 服务器或 API。像 Hugging Face 这样的机器学习社区支持 Llamafile 格式，使得搜索与 Llamafile 相关的模型变得容易。它还有一个出色的开源社区，进一步开发和扩展它。

## 4. GPT4ALL

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*j3vNWWQZCVF5woo5)

GPT4ALL 基于隐私、安全和无需互联网的原则构建。用户可以在 Mac、Windows 和 Ubuntu 上 [安装](https://www.nomic.ai/gpt4all)。与 Jan 或 LM Studio 相比，GPT4ALL 拥有更多的每月下载量、[GitHub Stars](https://github.com/nomic-ai/gpt4all) 和活跃用户。

## GPT4ALL的主要特点

GPT4All可以在主要消费硬件上运行LLM，例如Mac M系列芯片、AMD和NVIDIA GPU。以下是其主要特点。

* **隐私优先**：将私人和敏感的聊天信息和提示仅保留在您的设备上。
* **无需互联网**：它完全离线工作。
* **模型探索**：此功能允许开发者浏览和下载不同类型的LLM进行实验。您可以从流行选项中选择大约1000个开源语言模型，如LLama、Mistral等。
* **本地文档**：您可以让本地LLM访问您的敏感数据，使用本地文档如`.pdf`和`.txt`，数据不会离开您的设备，也无需网络。
* **自定义选项**：它提供多个[聊天机器人](https://getstream.io/blog/llm-chatbot-docs/)调整选项，如温度、批处理大小、上下文长度等。
* **企业版**：GPT4ALL提供企业套餐，具备安全性、支持和每台设备的许可证，将本地AI带入企业。

## 开始使用 GPT4All

要开始使用 GPT4All 在本地运行 LLMs，请[下载](https://www.nomic.ai/gpt4all)适合您操作系统的版本。

## 使用GPT4ALL的好处

除了Ollama，GPT4ALL在GitHub贡献者数量上最为显著，拥有约250000名每月活跃用户（根据<https://www.nomic.ai/gpt4all>）并且与其竞争对手相比。该应用收集有关使用分析和聊天分享的匿名用户数据。然而，用户可以选择加入或退出。使用GPT4ALL，开发者可以从其庞大的用户基础、GitHub和Discord社区中受益。

## 5. Ollama

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*STAonWgWIsY6cgDR)

使用 [Ollama](https://ollama.com/)，您可以轻松创建本地聊天机器人，而无需连接到像 OpenAI 这样的 API。由于一切都在本地运行，您无需支付任何订阅费或 API 调用费用。

## Ollama 的关键特性

* **模型自定义**：Ollama 允许您转换 `.gguf` 模型文件并使用 `ollama run modelname` 运行它们。
* **模型库**：Ollama 拥有大量模型可供尝试，访问 [ollama.com/library](https://ollama.com/library)。
* **导入模型**：Ollama 支持从 [PyTorch](https://pytorch.org/) 导入模型。
* **社区集成**：Ollama 无缝集成到网页和桌面应用程序中，例如 [Ollama-SwiftUI](https://github.com/kghandour/Ollama-SwiftUI)、[HTML UI](https://github.com/rtcfirefly/ollama-ui)、[Dify.ai](https://github.com/rtcfirefly/ollama-ui) 和 [更多](https://github.com/ollama/ollama?tab=readme-ov-file#community-integrations)。
* **数据库连接**：Ollama 支持多个 [数据平台](https://github.com/mindsdb/mindsdb/blob/main/mindsdb/integrations/handlers/ollama_handler/README.md)。
* **移动集成**：像 [Enchanted](https://github.com/AugustDev/enchanted) 这样的 SwiftUI 应用将 Ollama 带入 iOS、macOS 和 visionOS。[Maid](https://github.com/Mobile-Artificial-Intelligence/maid) 也是一个跨平台的 Flutter 应用，能够本地处理 `.gguf` 模型文件。

## 开始使用 Ollama

要首次使用 Ollama，请访问 <https://ollama.com> 并下载适合您机器的版本。您可以在 Mac、Linux 或 Windows 上安装它。安装 Ollama 后，您可以在终端中使用以下命令检查其详细信息。

`ollama`

要运行特定的 LLM，您应该使用以下命令下载它：

`ollama pull modelname`，其中 `modelname` 是您要安装的模型名称。请在 [GitHub](https://github.com/ollama/ollama) 上查看一些可供下载的示例模型。`pull` 命令也用于更新模型。一旦使用，仅会获取差异部分。

例如，在下载了 `llama3.1` 后，在命令行中运行 `ollama run llama3.1` 将启动该模型。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*aglZm6h0BU6GAYkSl04XWA.gif)

在上述示例中，我们提示 `llama3.1` 模型解决一个物理功和能量的问题。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*dNNQYpz1s2tz1pcn)

## 使用 Ollama 的好处

Ollama 在 GitHub 上拥有超过 200 名贡献者，并且有活跃的更新。它拥有最多的贡献者，并且在上述其他开源 LLM 工具中更具可扩展性。

## 6. LLaMa.cpp

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*KhsAUquhDZAHghxK)

[LLaMa.cpp](https://github.com/ggerganov/llama.cpp) 是支持本地 LLM 工具（如 Ollama 等）的底层后端技术（推理引擎）。LLaMa.cpp 支持显著的大型语言模型推理，配置简单，并在各种硬件上提供出色的本地性能。它也可以在云端运行。

## LLaMa.cpp 的主要特点

* **设置**：它的设置非常简单。您只需一个命令即可安装。
* **性能**：它在本地和云端的各种硬件上表现非常出色。
* **支持的模型**：它支持流行的主要 LLM，如 [Mistral 7B](https://huggingface.co/mistralai/Mistral-7B-v0.1)、[Mixtral MoE](https://huggingface.co/models?search=mistral-ai/Mixtral)、[DBRX](https://huggingface.co/databricks/dbrx-instruct)、[Falcon](https://huggingface.co/models?search=tiiuae/falcon) 和 [其他许多模型](https://github.com/ggerganov/llama.cpp?tab=readme-ov-file#description)。
* **前端 AI 工具**：LLaMa.cpp 支持开源 LLM UI 工具，如 [MindWorkAI/AI-Studio](https://github.com/MindWorkAI/AI-Studio) (FSL-1.1-MIT)、[iohub/collama](https://github.com/iohub/coLLaMA) 等。

## 使用 LLaMa.cpp 开始

要运行您的第一个本地大型语言模型，请使用以下命令安装 llama.cpp：

`brew install llama.cpp`

接下来，从 Hugging Face 或其他来源下载您想要运行的模型。例如，从 Hugging Face 下载下面的模型并将其保存在您计算机上的某个位置。

[`https://huggingface.co/MaziyarPanahi/Mistral-7B-Instruct-v0.3-GGUF/resolve/main/Mistral-7B-Instruct-v0.3.Q4_K_M.g`guf](https://huggingface.co/MaziyarPanahi/Mistral-7B-Instruct-v0.3-GGUF/resolve/main/Mistral-7B-Instruct-v0.3.Q4_K_M.gguf)

使用您喜欢的命令行工具，如终端，`cd` 进入您刚下载的 `.gguf` 模型文件的位置，并运行以下命令。

```python
llama-cli --color \ 
-m Mistral-7B-Instruct-v0.3.Q4_K_M.ggufb \ 
-p "Write a short intro about SwiftUI"
```
总之，您首先调用 LLaMa CLI 工具并设置颜色和其他标志。`-m` 标志指定您要使用的模型的路径。`-p` 标志指定您希望用来指示模型的提示。

运行上述命令后，您将看到以下预览中的结果。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*4Al-j50vXUXLUfvxzBt6aw.gif)

## 本地 LLM 的用例

在本地运行 LLM 可以帮助开发人员深入了解其性能和工作原理。 本地 LLM 可以查询私有文档和技术论文，以便与这些文档相关的信息不会离开用于查询的设备，不会发送到任何云 AI API。 本地 LLM 在没有互联网的地方和网络信号较差的地方非常有用。

在 [远程医疗环境](https://getstream.io/blog/telemedicine-app-development/) 中，本地 LLM 可以对患者文档进行排序，而无需出于隐私考虑将其上传到任何 AI API 提供商。

## 评估本地运行的大型语言模型性能

在本地使用大型语言模型之前，了解其性能对于获得所需的响应至关重要。有几种方法可以确定特定 LLM 的性能。以下是一些方法。

* **训练**：该模型是基于什么数据集进行训练的？
* **微调**：模型在多大程度上可以定制以执行特定任务，或者是否可以针对特定领域进行微调？
* **学术研究**：该 LLM 是否有学术研究论文？

要回答上述问题，您可以查看优秀的资源，如 [Hugging Face](https://huggingface.co/datasets) 和 [Arxiv.org](https://arxiv.org/)。此外，[Open LLm Leaderboard](https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard) 和 [LMSYS Chatbot Arena](https://chat.lmsys.org/?arena) 提供了各种 LLM 的详细信息和基准测试。

## 本地 LLM 工具结论

正如本文所讨论的，选择和使用本地大型语言模型的动机有很多。如果您不希望将数据集通过互联网发送给 AI API 提供商，则可以对模型进行微调，以执行 [远程医疗应用](https://getstream.io/chat/solutions/healthcare/) 中的特定任务。许多开源的图形用户界面（GUI）本地 LLM 工具，如 LLm Studio 和 Jan，提供直观的前端用户界面，以便在没有像 OpenAI 或 Claude 这样的订阅服务的情况下配置和实验 LLM。您还发现了各种强大的命令行 LLM 应用程序，如 Ollama 和 LLaMa.cpp，帮助您在本地运行和测试模型，而无需互联网连接。查看 Stream 的 [AI 聊天机器人](https://getstream.io/chat/solutions/ai-integration/) 解决方案，将 AI 聊天集成到您的应用中，并访问所有相关链接以了解更多信息。

*最初发布于 [https://getstream.io](https://getstream.io/blog/best-local-llm-tools/).*

