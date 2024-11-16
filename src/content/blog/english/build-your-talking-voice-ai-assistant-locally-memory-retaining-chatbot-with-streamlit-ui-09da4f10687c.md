---
title: "Build Your Talking Voice AI Assistant Locally: Memory-Retaining Chatbot with Streamlit UI…"
meta_title: "Build Your Talking Voice AI Assistant Locally: Memory-Retaining Chatbot with Streamlit UI…"
description: "This article provides a comprehensive tutorial for creating a local voice AI assistant named *Porter*, utilizing Ollamas Llama models, Streamlit for the user interface, and OpenAIs Whisper for transcription. *Porter* features memory retention for conversations, allowing it to recall past interactions and provide contextual responses. The guide includes installation instructions, code snippets, and an overview of key functionalities, emphasizing the benefits of privacy and responsiveness by operating offline. The project showcases advancements in natural language processing and the potential for further enhancements in AI capabilities."
date: 2024-11-16T01:36:50Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*5WJoI0IAKwMpEaCdSY63_A.png"
categories: ["Voice Assistants", "Natural Language Processing", "Programming/Scripting"]
author: "Rifx.Online"
tags: ["Porter", "Llama", "Streamlit", "Whisper", "offline"]
draft: False

---





### Step\-by\-Step Guide to Developing Your Own Voice AI with Context Memory and Real\-Time Chat, Powered by Llama3\.1 \& Llama3\.2 Models

👨🏾‍💻 [GitHub](https://github.com/mdmonsurali) ⭐️ \| 👔[LinkedIn](https://www.linkedin.com/in/mdmonsurali/) \|📝 [Medium](https://medium.com/@monsuralirana)



The concept of a voice\-based personal assistant has grown beyond being a novelty — it has become a practical, hands\-free solution for busy professionals, remote teams, and tech enthusiasts alike. Imagine a voice AI that can listen, respond, and even keep track of past conversations, all while running locally on your device. Enter *Porter*, a personal AI assistant designed to do just that.

In this tutorial, we’ll walk you through creating *Porter*, an advanced voice assistant that’s capable of responding to voice queries, retaining context through conversation memory, and providing responses via synthesized speech. *Porter* leverages Ollama’s state\-of\-the\-art Llama models, **Streamlit** for an intuitive user interface, and OpenAI’s **Whisper** model for transcription. This guide will take you step\-by\-step from installation to final deployment on a local machine.


## Table of Contents

1. Introduction
2. Why *Porter*?
3. Key Features of *Porter*
4. User Interface (UI) Overview
5. Step\-by\-Step Tutorial
6. Running Porter Locally
7. Conclusion


## 1\. Introduction

With recent advancements in natural language processing, voice assistants have become increasingly capable of understanding complex queries, responding in natural language, and even retaining context across conversations. *Porter*, our AI voice assistant, is designed to leverage these advancements, providing users with a natural, responsive, and personalized assistant experience. Porter is built on Ollama’s advanced models, which provide conversational AI, and uses **Streamlit** for a straightforward, interactive user interface.

**Porter** provides:

* A conversational AI that can remember past exchanges.
* A smooth interface that’s easy to navigate.
* Customizable parameters for personalized responses.


## 2\. Why Porter?

Most voice assistants require internet connectivity and rely on external servers, raising concerns about security, control, and response latency. *Porter*, by running locally, offers:

* **Privacy**: With no need for internet access, all conversations and data stay securely on your machine.
* **Quick Response Times**: With everything running locally, there’s minimal delay in processing and response.
* **Memory\-Retained Conversations**: Using LangChain, *Porter* can remember context across multiple interactions, giving it the ability to answer follow\-up questions accurately.


## 3\. Key Features of Porter


### Voice Input and Output

*Porter* uses Whisper, a powerful automatic speech recognition (ASR) model, to transcribe voice input into text. It can also generate spoken responses, providing a seamless hands\-free experience.


### Session Memory and Conversation Context

With LangChain’s **ConversationBufferMemory**, *Porter* retains past conversations, allowing for multi\-turn conversations that feel natural. The memory enables *Porter* to reference past user queries and provide continuity.


### History Overview and Chat History

*Porter* includes a **Chat History** feature that provides an overview of all past interactions within the current session. This chat history is displayed on the UI, helping users keep track of what has been discussed.


### Customizable Model Parameters

In *Porter*’s Streamlit sidebar, users can select different model versions (Llama3\.1, Llama3\.2\) and adjust parameters such as **temperature** and **max tokens** to control response creativity and length.


### Streamlit\-Based User Interface

Streamlit provides a clean, intuitive UI for *Porter*, allowing users to interact with the assistant easily. The app displays previous exchanges, model settings, and allows for easy voice input.


## 4\. User Interface (UI) Overview

The Streamlit UI for *Porter* is simple and user\-friendly:

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*x_oxCvi14LfcsG8H4VeXUg.png)

* **Voice Input Widget**: A microphone icon lets users record their queries.
* **Chat Display**: Displays user messages and *Porter*’s responses, including timestamps and response times.
* **Settings Sidebar**: Customize *Porter* with model options, temperature, and max tokens.
* **History Overview**: Review conversation history in the chat window, making it easy to follow previous exchanges.


## 5\. Step\-by\-Step Tutorial

Let’s break down the code to see how to implement Porter. We’ll use two main files: `app.py` (for the Streamlit app) and `voicebot.py` (for backend logic).


### Prerequisites:

* Python 3\.7\+
* locally conda environment
* Streamlit for the UI
* Ollama for model inference
* LangChain is used to manage the interaction between the models and memory.


### Step 1: Install Necessary Packages

Install necessary libraries and tools:


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

> **I have the LLaMA 3\.1 and 3\.2 models set up through Ollama. If you don’t have Ollama or the LLaMA models on your local machine, please follow the instructions at the link below to install them. The link is exclusive to Llama 3\.2, but you can pull Llama 3\.1 by simply running `"ollama pull llama3.1"`.**


> **I’ve used the Piper TTS model for text\-to\-speech. It’s lightweight, 10x faster, works in real\-time, operates offline, and produces a human\-like voice.**


### Step 2: Setting up the Streamlit App


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
    st.subheader("Inference Settings")
    st.session_state.model = st.selectbox("Model", ["llama3.1", "llama3.2:latest"], index=0)
    st.session_state.temperature = st.slider("Temperature", 0.0, 1.0, 0.0, 0.05)
    st.session_state.max_tokens = st.slider("Max Tokens", 100, 5000, 500, 100)

## Initialize chat model
if "chain" not in st.session_state:
    st.session_state.chain = initialize_chat()
```
In this section:

1. **Session State Variables**: Store message history and audio bytes.
2. **Sidebar Controls**: Provide UI controls to customize the model, temperature, and token length.
3. **Chat Model Initialization**: This loads the chat model for use in the app.


### Step 3: Implementing the Chat Functionality


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
Here:

1. **Display Previous Messages**: The chat window shows the conversation history.
2. **Voice Input \& Transcription**: Records and transcribes audio input into text, adding it to the chat.
3. **Assistant Response**: Sends user input to the model, retrieves a response, and converts it to audio for playback.


### Step 4: Implementing the Backend (voicebot.py)

In `voicebot.py`, the main components are set up to initialize Porter’s conversation model and handle text\-to\-speech and transcription:


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

## Text-to-speech
def text_to_speech(text):
    subprocess.call(f'echo "{text}" | piper --model en_US-amy-medium --output_file output.wav', shell=True)
    os.system("aplay output.wav")

## Speech recognition
pipe = pipeline("automatic-speech-recognition", "openai/whisper-large-v3-turbo", torch_dtype=torch.float16, device="cuda:0")

def transcribe_audio(audio_bytes):
    webm_file_path = "temp_audio.mp3"
    with open(webm_file_path, "wb") as f:
        f.write(audio_bytes)
    
    transcript = pipe(webm_file_path)['text'].strip()
    os.remove(webm_file_path)
    return transcript
```
This section:

1. **Model Setup**: Configures the chat model and prompt template.
2. **Text\-to\-Speech**: Converts model responses to audio.
3. **Speech\-to\-Text**: Uses Whisper to transcribe recorded audio input.


### Step 5: Deploying Porter

Once you’ve completed the setup, you can launch your app using Streamlit. To run the app, navigate to your project folder and run the following command in your terminal:


```python
streamlit run apps.py
```
After the app starts, you’ll see the following message in your terminal:


```python
  You can now view your Streamlit app in your browser.

  Local URL: http://localhost:8501
  Network URL: http://172.30.254.103:8501
```
You can access Porter by opening the **Local URL** (`http://localhost:8501`) in your browser if you’re on the same machine. Alternatively, if you want to access it from another device on the same network, use the **Network URL** (`http://172.30.254.103:8501`).

You’ll now have a fully functional personal AI assistant!


> **“Conversing with Porter: How It Remembers and Recalls Past Interactions”**

Porter isn’t just an AI that responds to questions at the moment — it’s designed to remember past conversations. Thanks to its memory system, it can recall previous chats, providing contextually aware responses that make interactions feel more personalized and fluid. Whether you’re revisiting an old topic or issuing a command Porter has handled before, it intelligently recalls past exchanges, allowing for a seamless, coherent dialogue that feels like an ongoing conversation rather than starting fresh every time.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*dKn8HbZ7YhHHzml-OtBY4w.png)


> ***GitHub Code:***


> **Leave your feedback, comments, and 👏 👏 Clap for the story !! 👏👏**


## Conclusion

The creation of ***Porter*** demonstrates the exciting potential of personal AI assistants that prioritize **privacy** and **responsiveness** by operating locally. By integrating LangChain for conversation memory, Ollama’s high\-performance Llama models for natural language processing, and Whisper for speech recognition, *Porter* showcases how these advanced tools can be combined to create a robust, intuitive voice assistant. This project not only emphasizes the accessibility of modern AI but also highlights the importance of keeping user data safe and interaction fast — two areas where local solutions excel.

With Porter's flexible architecture, there’s ample room to expand its capabilities. Developers could integrate other local NLP models or add customized workflows for different use cases, like customer support, educational tutoring, or technical troubleshooting. Moreover, as new language models and voice\-processing techniques emerge, *Porter* can be updated to provide even more nuanced and contextually aware responses.


## References

\[1] Llama 3\.2: The Next Generation of Lightweight, Instruction\-Tuned Language Models: A Hands\-On Tutorial, 2024\. Available: [https://readmedium.com/llama\-3\-2\-the\-next\-generation\-of\-lightweight\-instruction\-tuned\-language\-models\-a\-hands\-on\-9bca07c8af1d](https://readmedium.com/llama-3-2-the-next-generation-of-lightweight-instruction-tuned-language-models-a-hands-on-9bca07c8af1d)

\[2] Hugging Face, *Transformers Documentation: Using LLaMA 3\.2 Vision Models*, Hugging Face, 2024\. Available: <https://huggingface.co/blog/llama32>

\[3] Build a basic LLM chat app. Available: [https://docs.streamlit.io/develop/tutorials/llms/build\-conversational\-apps](https://docs.streamlit.io/develop/tutorials/llms/build-conversational-apps)

Happy coding! 🎉

👨🏾‍💻 [GitHub](https://github.com/mdmonsurali) ⭐️ \| 👔[LinkedIn](https://www.linkedin.com/in/mdmonsurali/) \|📝 [Medium](https://medium.com/@monsuralirana)

Thank you for your time in reading this post!

Make sure to leave your feedback and comments. 👏 Clap for the story and follow for stories. See you in the next blog; stay tuned 📢


## Enjoyed this article? Check out more of my work:

* **Building a Custom Documents Agent with Elasticsearch, Ollama, LLaMA 3\.1, and LangChain:** Explore how to set up a personalized document retrieval agent using LLaMA 3\.1 and Ollama for seamless information retrieval. [Read the full tutorial here](https://readmedium.com/building-a-custom-documents-agent-with-elasticsearch-ollama-llama-3-1-and-langchain-926b28047e1d).
* **Building Your Personal AI Assistant with Memory Using Ollama’s LLaMA3\.1, LLaMA3\.2 Models, Streamlit UI, and Locally:** Discover how to develop an AI assistant that remembers past interactions using the latest LLaMA models and a user\-friendly Streamlit interface. [Read the full tutorial here.](https://readmedium.com/building-porter-your-personal-ai-assistant-with-memory-using-ollamas-llama3-1-efb32b80c129)
* **OpenAI Swarm: A Lightweight Framework for Multi\-Agent Orchestration:** Dive into a new framework designed for managing multiple AI agents efficiently, enhancing your AI project management. [Read the full tutorial here.](https://readmedium.com/openai-swarm-a-lightweight-framework-for-multi-agent-orchestration-b4a83a1a1e37)
* **How to Use Molmo\-7B for Multimodal AI: Extract Text and Images with an Open\-Source Vision\-Language Model:** Learn how to harness the power of the Molmo\-7B model for extracting both text and images, revolutionizing your approach to multimodal AI. [Read the full tutorial here.](https://readmedium.com/how-to-use-molmo-7b-for-multimodal-ai-extract-text-and-images-with-an-open-source-vision-language-8a31939a2960)
* **Meta Spirit LM: A Complete Guide to Multimodal AI for Text and Speech Generation:** Explore the capabilities of Meta Spirit LM in generating text and speech, and how it can be applied in various AI applications. [Read the full tutorial here.](https://readmedium.com/meta-spirit-lm-a-complete-guide-to-multimodal-ai-for-text-and-speech-generation-ed0af74bc950)
* **Supercharge Text\-to\-Speech with Piper TTS:** Find out how to achieve 10x faster, real\-time, offline voice synthesis with human\-like accuracy in this hands\-on *Google Colab tutorial*. [Transform your text into lifelike speech here.](https://readmedium.com/unleashing-the-power-of-piper-tts-transforming-text-to-speech-10x-faster-with-ai-human-like-voice-eadf2065d66d)

