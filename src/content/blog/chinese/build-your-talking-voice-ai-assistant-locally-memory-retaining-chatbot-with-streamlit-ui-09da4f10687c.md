---
title: "在本地构建会说话的语音人工智能助理：具有流光溢彩用户界面的记忆保持聊天机器人..."
meta_title: "在本地构建会说话的语音人工智能助理：具有流光溢彩用户界面的记忆保持聊天机器人..."
description: "本文提供了一个详细的指南，介绍如何使用Streamlit、LangChain和Ollama Llama模型构建一个具有记忆保留功能的个人语音AI助手Porter。Porter能够在本地运行，确保用户数据安全并提供快速响应。其主要功能包括语音输入输出、会话记忆、聊天记录和可定制的模型参数设置。通过整合先进的自然语言处理技术，Porter旨在为用户提供个性化的助手体验，适用于各种应用场景。该项目强调了隐私保护和高效交互的重要性，展示了现代AI助手的潜力。"
date: 2024-11-16T01:36:50Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*5WJoI0IAKwMpEaCdSY63_A.png"
categories: ["Voice Assistants", "Natural Language Processing", "Programming/Scripting"]
author: "Rifx.Online"
tags: ["Porter", "Llama", "Streamlit", "Whisper", "offline"]
draft: False

---



### 开发您自己的具有上下文记忆和实时聊天功能的语音 AI 的逐步指南，基于 Llama3.1 和 Llama3.2 模型

👨🏾‍💻 [GitHub](https://github.com/mdmonsurali) ⭐️ \| 👔[LinkedIn](https://www.linkedin.com/in/mdmonsurali/) \|📝 [Medium](https://medium.com/@monsuralirana)



基于语音的个人助手的概念已经超越了新奇的范畴——它已成为忙碌的专业人士、远程团队和科技爱好者的实用无障碍解决方案。想象一下，一个可以倾听、回应甚至跟踪过去对话的语音 AI，所有这些都在您的设备上本地运行。介绍 *Porter*，一个旨在实现这一目标的个人 AI 助手。

在本教程中，我们将指导您创建 *Porter*，一个先进的语音助手，能够响应语音查询，通过对话记忆保持上下文，并通过合成语音提供响应。*Porter* 利用 Ollama 的尖端 Llama 模型、**Streamlit** 提供直观的用户界面，以及 OpenAI 的 **Whisper** 模型进行转录。该指南将带您逐步完成从安装到最终在本地机器上部署的过程。

## 目录

1. 介绍
2. 为什么选择 *Porter*?
3. *Porter* 的关键特性
4. 用户界面 (UI) 概述
5. 分步教程
6. 本地运行 Porter
7. 结论

## 1\. 引言

随着自然语言处理的最新进展，语音助手在理解复杂查询、以自然语言响应以及在对话中保持上下文方面变得越来越强大。*Porter*，我们的人工智能语音助手，旨在利用这些进展，为用户提供自然、响应迅速且个性化的助手体验。Porter 基于 Ollama 的先进模型构建，提供对话式人工智能，并使用 **Streamlit** 提供简单易用的交互式用户界面。

**Porter** 提供：

* 能够记住过去交流的对话式人工智能。
* 易于导航的流畅界面。
* 可定制的参数以实现个性化响应。

## 2\. 为什么选择 Porter？

大多数语音助手需要互联网连接并依赖外部服务器，这引发了关于安全性、控制权和响应延迟的担忧。*Porter* 通过本地运行，提供了：

* **隐私**：无需互联网访问，所有对话和数据都安全地保留在您的设备上。
* **快速响应时间**：所有操作都在本地进行，处理和响应的延迟最小。
* **记忆保留的对话**：使用 LangChain，*Porter* 可以在多次交互中记住上下文，使其能够准确回答后续问题。

## 3\. 波特的关键特性

### 语音输入和输出

*Porter* 使用 Whisper，一个强大的自动语音识别 (ASR) 模型，将语音输入转录为文本。它还可以生成语音响应，提供无缝的免提体验。

### 会话记忆与对话上下文

通过 LangChain 的 **ConversationBufferMemory**，*Porter* 能够保留过去的对话，从而实现自然的多轮对话。该记忆功能使 *Porter* 能够引用过去的用户查询并提供连贯性。

### 历史概述和聊天记录

*Porter* 包含一个 **聊天记录** 功能，提供当前会话中所有过去互动的概述。此聊天记录显示在用户界面上，帮助用户跟踪已讨论的内容。

### 可定制的模型参数

在 *Porter* 的 Streamlit 侧边栏中，用户可以选择不同的模型版本 (Llama3\.1, Llama3\.2) 并调整参数，如 **temperature** 和 **max tokens** 以控制响应的创造性和长度。

### 基于 Streamlit 的用户界面

Streamlit 为 *Porter* 提供了一个简洁、直观的用户界面，使用户能够轻松与助手进行互动。该应用显示了之前的交流、模型设置，并允许轻松进行语音输入。

## 4\. 用户界面 (UI) 概述

*Porter* 的 Streamlit 用户界面简单且用户友好：

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*x_oxCvi14LfcsG8H4VeXUg.png)

* **语音输入小部件**：一个麦克风图标让用户录制他们的查询。
* **聊天显示**：显示用户消息和 *Porter* 的回复，包括时间戳和响应时间。
* **设置侧边栏**：通过模型选项、温度和最大 token 自定义 *Porter*。
* **历史概览**：在聊天窗口中查看对话历史，便于跟踪之前的交流。

## 5\. 分步教程

让我们分解代码，看看如何实现Porter。我们将使用两个主要文件：`app.py`（用于Streamlit应用）和`voicebot.py`（用于后端逻辑）。

### 前提条件：

* Python 3\.7\+
* 本地 conda 环境
* Streamlit 用于用户界面
* Ollama 用于模型推理
* LangChain 用于管理模型与记忆之间的交互。

### 第一步：安装必要的包

安装必要的库和工具：

```python
!pip install langchain==0.0.318
!pip install langchain-ollama 
!pip install langchain-community==0.0.3 
!pip install ollama==0.0.8
!pip install streamlit==1.25.0
!pip install pathlib==1.0.1
!pip install audio-recorder-streamlit==0.0.10
!pip install torch==2.4.1
!pip install transformer==4.44.2
```

> **我已经通过 Ollama 设置了 LLaMA 3\.1 和 3\.2 模型。如果你在本地机器上没有 Ollama 或 LLaMA 模型，请按照下面链接中的说明进行安装。链接仅适用于 Llama 3\.2，但你可以通过运行 `"ollama pull llama3.1"` 来获取 Llama 3\.1。**

> **我使用了 Piper TTS 模型进行文本到语音转换。它轻量级，速度快10倍，实时工作，离线操作，并且产生类似人类的声音。**

### 第2步：设置Streamlit应用程序


```python
import streamlit as st
import time
from audio_recorder_streamlit import audio_recorder
from voicebot import initialize_chat, text_to_speech, transcribe_audio

st.title("Porter - Your Personal Voice AI Assistant")

## Initialize session state variables
if "messages" not in st.session_state:
    st.session_state.messages = []
if "audio_bytes" not in st.session_state:
    st.session_state.audio_bytes = None

## Sidebar Settings
with st.sidebar:
    logo_path = "/path/to/logo.png"
    st.image(logo_path, caption="AI Enterprise", use_column_width=True)
    st.subheader("推理设置")
    st.session_state.model = st.selectbox("模型", ["llama3.1", "llama3.2:latest"], index=0)
    st.session_state.temperature = st.slider("温度", 0.0, 1.0, 0.0, 0.05)
    st.session_state.max_tokens = st.slider("最大令牌数", 100, 5000, 500, 100)

## Initialize chat model
if "chain" not in st.session_state:
    st.session_state.chain = initialize_chat()
```
在本节中：

1. **会话状态变量**：存储消息历史和音频字节。
2. **侧边栏控件**：提供用户界面控件以自定义模型、温度和令牌长度。
3. **聊天模型初始化**：加载聊天模型以供应用程序使用。

### 第3步：实现聊天功能


```python
## Display chat history
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

## Record voice input
footer_container = st.container()
with footer_container:
    st.session_state.audio_bytes = audio_recorder(text="Record a question", icon_size="lg")

if st.session_state.audio_bytes:
    transcript = transcribe_audio(st.session_state.audio_bytes)
    if transcript:
        st.session_state.messages.append({"role": "user", "content": transcript})
        
        # Display user input in chat
        with st.chat_message("user"):
            st.markdown(transcript)

        # Get response from model
        with st.chat_message("assistant"):
            start_time = time.time()
            with st.spinner("Porter is thinking..."):
                response = st.session_state.chain.run(transcript)
            end_time = time.time()

            response_time_str = f"Response time: {end_time - start_time:.2f} seconds"
            st.markdown(response)
            text_to_speech(response)
            st.markdown(f"_{response_time_str}_")

        st.session_state.messages.append({"role": "assistant", "content": response, "response_time": response_time_str})
```
这里：

1. **显示之前的消息**：聊天窗口显示对话历史。
2. **语音输入与转录**：录制并转录音频输入为文本，添加到聊天中。
3. **助手回复**：将用户输入发送到模型，检索回复，并将其转换为音频以供播放。

### 第4步：实现后端 (voicebot.py)

在 `voicebot.py` 中，主要组件用于初始化Porter的对话模型，并处理文本到语音和转录：

```python
import os
import subprocess
from langchain.memory.buffer import ConversationBufferMemory
from langchain.memory.chat_message_histories.file import FileChatMessageHistory
from langchain_community.chat_models.ollama import ChatOllama
from langchain.chains.llm import LLMChain
from transformers import pipeline
import torch

def initialize_chat():
    def get_llm():
        return ChatOllama(
            model=st.session_state.model,
            temperature=st.session_state.temperature,
            max_tokens=st.session_state.max_tokens,
        )

    from langchain.prompts import (
        HumanMessagePromptTemplate,
        ChatPromptTemplate,
        MessagesPlaceholder,
        SystemMessagePromptTemplate,
    )

    def get_chat_prompt_template():
        return ChatPromptTemplate(
            input_variables=["content", "messages"],
            messages=[
                SystemMessagePromptTemplate.from_template(
                    "You're a Personal Assistant, and your name is Porter."
                ),
                MessagesPlaceholder(variable_name="messages"),
                HumanMessagePromptTemplate.from_template("{content}"),
            ],
        )

    def get_memory():
        return ConversationBufferMemory(
            memory_key="messages",
            chat_memory=FileChatMessageHistory(file_path="memory.json"),
            return_messages=True,
            input_key="content",
        )

    llm = get_llm()
    prompt = get_chat_prompt_template()
    return LLMChain(llm=llm, prompt=prompt, memory=get_memory())

## 文本转语音
def text_to_speech(text):
    subprocess.call(f'echo "{text}" | piper --model en_US-amy-medium --output_file output.wav', shell=True)
    os.system("aplay output.wav")

## 语音识别
pipe = pipeline("automatic-speech-recognition", "openai/whisper-large-v3-turbo", torch_dtype=torch.float16, device="cuda:0")

def transcribe_audio(audio_bytes):
    webm_file_path = "temp_audio.mp3"
    with open(webm_file_path, "wb") as f:
        f.write(audio_bytes)
    
    transcript = pipe(webm_file_path)['text'].strip()
    os.remove(webm_file_path)
    return transcript
```
本节：

1. **模型设置**：配置聊天模型和提示模板。
2. **文本转语音**：将模型响应转换为音频。
3. **语音转文本**：使用Whisper转录录制的音频输入。

### 第5步：部署Porter

完成设置后，您可以使用Streamlit启动您的应用程序。要运行应用程序，请导航到您的项目文件夹，并在终端中运行以下命令：

```python
streamlit run apps.py
```
应用程序启动后，您将在终端中看到以下消息：

```python
  You can now view your Streamlit app in your browser.

  Local URL: http://localhost:8501
  Network URL: http://172.30.254.103:8501
```
如果您在同一台机器上，可以通过在浏览器中打开**Local URL**（`http://localhost:8501`）来访问Porter。或者，如果您想从同一网络上的其他设备访问它，请使用**Network URL**（`http://172.30.254.103:8501`）。

现在，您将拥有一个功能齐全的个人AI助手！

> **“与Porter对话：它如何记住和回忆过去的互动”**

Porter不仅仅是一个在瞬间回答问题的AI——它被设计用来记住过去的对话。得益于其记忆系统，它可以回忆起以前的聊天，提供上下文相关的响应，使互动感觉更加个性化和流畅。无论您是在重温旧话题还是发出Porter之前处理过的命令，它都能智能地回忆起过去的交流，从而实现无缝、连贯的对话，感觉就像是一场持续的对话，而不是每次都重新开始。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*dKn8HbZ7YhHHzml-OtBY4w.png)

> ***GitHub代码：***

> **留下您的反馈、评论，并为这个故事👏 👏 点赞！！👏👏**

## 结论

***Porter*** 的创建展示了个人 AI 助手的令人兴奋的潜力，这些助手通过本地操作优先考虑 **隐私** 和 **响应性**。通过整合 LangChain 进行对话记忆、Ollama 的高性能 Llama 模型用于自然语言处理以及 Whisper 进行语音识别，*Porter* 展示了如何将这些先进工具结合起来，创建一个强大且直观的语音助手。该项目不仅强调了现代 AI 的可及性，还突出了保护用户数据安全和快速交互的重要性——这是本地解决方案的两个优势领域。

凭借 Porter 灵活的架构，有足够的空间来扩展其功能。开发人员可以集成其他本地 NLP 模型或为不同用例添加定制工作流程，例如客户支持、教育辅导或技术故障排除。此外，随着新语言模型和语音处理技术的出现，*Porter* 可以更新以提供更细致和具有上下文意识的响应。

## 参考文献

\[1] Llama 3\.2: 下一代轻量级指令调优语言模型：实践教程，2024\. 可用链接：[https://readmedium.com/llama\-3\-2\-the\-next\-generation\-of\-lightweight\-instruction\-tuned\-language\-models\-a\-hands\-on\-9bca07c8af1d](https://readmedium.com/llama-3-2-the-next-generation-of-lightweight-instruction-tuned-language-models-a-hands-on-9bca07c8af1d)

\[2] Hugging Face, *Transformers 文档：使用 LLaMA 3\.2 视觉模型*, Hugging Face, 2024\. 可用链接：<https://huggingface.co/blog/llama32>

\[3] 构建一个基本的 LLM 聊天应用程序。可用链接：[https://docs.streamlit.io/develop/tutorials/llms/build\-conversational\-apps](https://docs.streamlit.io/develop/tutorials/llms/build-conversational-apps)

快乐编码！ 🎉

👨🏾‍💻 [GitHub](https://github.com/mdmonsurali) ⭐️ \| 👔[LinkedIn](https://www.linkedin.com/in/mdmonsurali/) \|📝 [Medium](https://medium.com/@monsuralirana)

感谢您花时间阅读这篇文章！

请确保留下您的反馈和评论。 👏 为这个故事点赞并关注更多故事。下次博客见，敬请关注 📢

## 享受这篇文章吗？查看我更多的作品：

* **使用Elasticsearch、Ollama、LLaMA 3\.1和LangChain构建自定义文档代理:** 探索如何使用LLaMA 3\.1和Ollama设置个性化文档检索代理，以实现无缝信息检索。[在这里阅读完整教程](https://readmedium.com/building-a-custom-documents-agent-with-elasticsearch-ollama-llama-3-1-and-langchain-926b28047e1d)。
* **使用Ollama的LLaMA3\.1、LLaMA3\.2模型、Streamlit UI和本地环境构建个人AI助手:** 发现如何开发一个能够记住过去互动的AI助手，使用最新的LLaMA模型和用户友好的Streamlit界面。[在这里阅读完整教程。](https://readmedium.com/building-porter-your-personal-ai-assistant-with-memory-using-ollamas-llama3-1-efb32b80c129)
* **OpenAI Swarm：一个轻量级的多代理编排框架:** 深入了解一个旨在高效管理多个AI代理的新框架，提升您的AI项目管理能力。[在这里阅读完整教程。](https://readmedium.com/openai-swarm-a-lightweight-framework-for-multi-agent-orchestration-b4a83a1a1e37)
* **如何使用Molmo\-7B进行多模态AI：使用开源视觉语言模型提取文本和图像:** 学习如何利用Molmo\-7B模型提取文本和图像，彻底改变您对多模态AI的处理方式。[在这里阅读完整教程。](https://readmedium.com/how-to-use-molmo-7b-for-multimodal-ai-extract-text-and-images-with-an-open-source-vision-language-8a31939a2960)
* **Meta Spirit LM：文本和语音生成的多模态AI完整指南:** 探索Meta Spirit LM在生成文本和语音方面的能力，以及它如何应用于各种AI应用。[在这里阅读完整教程。](https://readmedium.com/meta-spirit-lm-a-complete-guide-to-multimodal-ai-for-text-and-speech-generation-ed0af74bc950)
* **使用Piper TTS超级增强文本到语音:** 了解如何在这个动手*Google Colab教程*中实现10倍更快、实时、离线的人声合成。[在这里将您的文本转化为栩栩如生的语音。](https://readmedium.com/unleashing-the-power-of-piper-tts-transforming-text-to-speech-10x-faster-with-ai-human-like-voice-eadf2065d66d)

