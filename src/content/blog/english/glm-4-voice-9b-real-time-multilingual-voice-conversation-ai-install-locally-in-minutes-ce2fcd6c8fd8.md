---
title: "GLM-4-Voice 9B — Real-time Multilingual Voice Conversation AI — Install Locally in Minutes"
meta_title: "GLM-4-Voice 9B — Real-time Multilingual Voice Conversation AI — Install Locally in Minutes"
description: "How to set up GLM-4-Voice 9B for seamless real-time voice interaction in English and Chinese, and explore its unique architecture…"
date: 2024-11-04T12:29:59Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*LATTpEc2AHvqgVyPKSzW7A.jpeg"
categories: ["Voice Assistants", "Natural Language Processing", "Chatbots"]
author: "Rifx.Online"
tags: ["multilingual", "conversation", "real-time", "customization", "performance"]
draft: False

---

### How to set up GLM\-4\-Voice 9B for seamless real\-time voice interaction in English and Chinese, and explore its unique architecture, low\-latency response, and customizable voice attributes.

👨🏾‍💻 [GitHub](https://github.com/mdmonsurali) ⭐️ \| 👔[LinkedIn](https://www.linkedin.com/in/mdmonsurali/) \|📝 [Medium](https://medium.com/@monsuralirana)



## Introduction

In recent years, voice\-enabled AI has significantly advanced, enabling conversational agents to better understand and respond to human speech. From virtual assistants to customer service bots, voice AI has become an essential tool in various industries. However, most models still struggle with fluently transitioning between languages, understanding nuances in spoken queries, and delivering high\-quality responses. This is where GLM\-4\-Voice by Zhipu AI shines. Developed as an end\-to\-end voice model, GLM\-4\-Voice pushes the boundaries of multilingual conversational AI by supporting real\-time dialogue in both English and Chinese, while offering an adaptable and human\-like response generation.

In this article, we’ll explore why GLM\-4\-Voice is worth paying attention to, what makes it unique, and how you can set it up and start using it locally. We’ll also take a look at its architecture and provide a hands\-on guide to accessing the web demo.

## Why GLM\-4\-Voice?

Traditional language models are often limited to text and require additional processing layers to handle voice. They may also struggle with interactivity or suffer from latency issues. GLM\-4\-Voice overcomes these limitations with a unified model that directly processes and generates speech. Here’s what makes it stand out:

1. **End\-to\-End Voice Processing**: Unlike many other models that rely on a separate text\-to\-speech (TTS) or speech\-to\-text (STT) module, GLM\-4\-Voice directly interprets and responds in spoken language, allowing a more seamless and responsive experience.
2. **Multilingual Support**: This model excels in handling both English and Chinese, two widely used languages globally. Its ability to switch between languages fluidly makes it ideal for bilingual environments and international applications.
3. **Customizable Attributes**: GLM\-4\-Voice allows for adjustments in emotion, intonation, speech rate, and even dialect, making it capable of producing more natural and contextually appropriate responses.
4. **Low Latency**: With support for streaming inference, the model has a latency of around 20 tokens, which enables near\-instantaneous responses in real\-time conversations.

## Specialties of GLM\-4\-Voice

GLM\-4\-Voice brings several unique features to the table, setting it apart from other voice models. Here’s what makes it special:

* **Real\-Time Voice Interaction**: By supporting low\-latency responses, GLM\-4\-Voice can maintain fluid and natural conversations, which is crucial for applications like customer support and interactive AI.
* **Dynamic Voice Attributes**: Users can specify the model’s emotional tone, speaking rate, and other characteristics, making interactions more engaging and suited to various contexts.
* **Bilingual Support with Context Awareness**: This model is designed to comprehend and generate responses in both Chinese and English. It can switch between these languages seamlessly, offering a flexible solution for multilingual applications.
* **Advanced Speech Decoding**: Built on CosyVoice, the GLM\-4\-Voice decoder enables high\-quality speech generation with streaming support, maintaining high clarity in both languages.

## Architecture

The architecture of GLM\-4\-Voice consists of three primary components, each fulfilling a crucial role in achieving end\-to\-end voice interaction:

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*nJsKHtxSblNkixPIBZpWyQ.jpeg)

1. **GLM\-4\-Voice\-Tokenizer**: This component tokenizes continuous speech input into discrete tokens, with around 12\.5 tokens generated per second of audio. The tokenizer is based on Whisper’s encoder, with added vector quantization, allowing the model to process audio in a structured form.
2. **GLM\-4\-Voice\-9B**: The core language model, based on the GLM\-4 architecture, has been aligned to process spoken input. It can handle both text and speech, making it a powerful multimodal conversational agent.
3. **GLM\-4\-Voice\-Decoder**: This decoder converts the discrete tokens back into continuous speech, allowing the model to produce audio outputs. It supports streaming inference, enabling responses to begin after processing just a few tokens, minimizing conversation latency.

Together, these components make GLM\-4\-Voice a powerful tool for real\-time voice interactions, supporting conversational AI across different languages and dialects.

## Setting Up GLM\-4\-Voice Locally

To experience GLM\-4\-Voice, follow these steps to set up the model locally on your machine.

### Step 1: Clone the Repository

Begin by cloning the repository from GitHub. Make sure to include submodules:

```python
!git clone --recurse-submodules https://github.com/THUDM/GLM-4-Voice
cd GLM-4-Voice
```

### Step 2: Install Dependencies

Navigate into the project directory and install the necessary dependencies:

```python
!pip install -r requirements.txt
```

### Step 3: Download the Model Checkpoint

GLM\-4\-Voice’s decoder model is hosted on Hugging Face and requires `git-lfs` to download. Make sure `git-lfs` is installed, then run:

```python
!git clone https://huggingface.co/THUDM/glm-4-voice
```

### Step 4: Launch the Model Service

With everything set up, start the model server:

```python
python model_server.py --model-path glm-4-voice-9b
```

### Step 5: Start the Web Service

Once the model server is running, start the web service by executing:

```python
python web_demo.py
```

You can now access the web demo at [http://127\.0\.0\.1:8888](http://127.0.0.1:8888) to interact with GLM\-4\-Voice.

> **Note:** The GLM\-4\-Voice model is resource\-intensive and requires a substantial amount of computational power to run effectively. Specifically, it necessitates 35–40 GPUs for optimal performance, making it suitable for deployment in environments with access to high\-performance hardware. Users should ensure they have the necessary infrastructure in place before attempting to utilize this model.

## Web Demo Interface

The web demo for GLM\-4\-Voice provides an intuitive interface with several customization options:

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*scbHOUXqMW5KGAcT3Bq1Eg.png)

* **Input Mode**: Users can choose to provide input as either text or audio. This flexibility allows for hands\-free or traditional interaction.
* **Voice Control Parameters**: Adjust temperature, top\-p, and token limits to customize the model’s response characteristics.
* **Debug Information**: Input and output tokens are displayed, giving users insight into the model’s processing of their queries.
* **Interactive Audio Display**: Audio inputs and responses are displayed as waveforms, and users can replay or review audio segments to assess quality.

However, Gradio, which is used to stream audio in the demo, may sometimes present instability. For best quality, it’s recommended that audio from the dialogue box be replayed after it has been generated.

## Conclusion

GLM\-4\-Voice stands out as an impressive achievement in conversational AI, offering a unique blend of bilingual support, real\-time audio interaction, and flexible response customization. Its end\-to\-end design and low latency make it a prime candidate for applications in customer service, education, virtual assistants, and more. With an accessible setup process, GLM\-4\-Voice opens the door for developers and researchers to explore advanced voice capabilities in both Chinese and English.

As the demand for more interactive and realistic AI continues to grow, models like GLM\-4\-Voice represent a significant step forward in bridging language and conversational barriers. Whether you’re looking to build a chatbot, a virtual teacher, or a customer service agent, GLM\-4\-Voice provides a robust and versatile solution.


