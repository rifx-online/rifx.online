---
title: "Google Releases Gemma — A Lightweight And Open Source Model"
meta_title: "Google Releases Gemma — A Lightweight And Open Source Model"
description: "Google released Gemma, a family of lightweight and open-source models built upon the research and technology used to create the Gemini…"
date: 2024-10-29T12:46:34Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*G7XbkhsCwillpje7AvETjQ.jpeg"
categories: ["Natural Language Processing", "Programming", "Chatbots"]
author: "Rifx.Online"
tags: ["Gemma", "Gemini", "parameters", "NLP", "chatbots"]
draft: False

---






In just a week, the world has witnessed the most groundbreaking AI advancements from two tech giants. OpenAI introduced its jaw\-dropping AI video generator, [Sora](https://readmedium.com/3d16381f3bf5), while Google unveiled its [Gemini 1\.5 model](https://generativeai.pub/google-releases-gemini-1-5-with-1m-context-window-44ed4a2ea319), capable of supporting up to a 1 million token context window.

Today, Google dropped another bombshell with the release of [Gemma](https://ai.google.dev/gemma/?utm_source=keyword&utm_medium=referral&utm_campaign=gemma_cta&utm_content), a family of lightweight, state\-of\-the\-art open\-source models built upon the research and technology used to create the Gemini models.


## What is Gemma?

Named after the Latin word *gemma* for “precious stone,” Gemma draws inspiration from its predecessor, Gemini, reflecting its value and rarity in the tech world.

They are text\-to\-text, decoder\-only large language models, available in English, with open weights, pre\-trained variants, and instruction\-tuned variants.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Fu2ryJMunebq5c0dD-opZQ.png)

Gemma is available worldwide starting today in two sizes (2B and 7B), supports a wide range of tools and systems, and runs on a developer laptop and workstation.


## 2 model sizes and capabilities

Gemma models are available in 2 billion and 7 billion parameter sizes. The 2B model is intended to run on mobile devices and laptops, while the 7B model is intended to run on desktop computers and small servers.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*sH9jaz1RvtKeJ5yjfyOL5Q.png)

**Tuned models**

Gemma also comes in two versions: tuned and pretrained.

* **Pretrained:** This is like the base model without any fine tuning. This model is not trained on any specific tasks or instructions beyond the Gemma core data training set.
* **Instruction\-tuned:** This model is fine\-tuned to human language interactions, which improves its ability to perform targeted tasks.


## How it compares with the competition?

Because of its small size, Gemma is capable of running directly on a user’s laptop. The chart below shows how the language understanding and generation performance of Gemma (7B) compares to similarly sized open models like LLaMA 2 (7B), LLaMA 2 (13B), and Mistral (7B).

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*QxjZALUAIDiS_T66EpOu-g.png)

You can check out a more detailed comparison for each benchmark [here](https://ai.google.dev/gemma/?utm_source=keyword&utm_medium=referral&utm_campaign=gemma_cta&utm_content).

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Fc8Fk0Dgh2VFU_VLhpcs6Q.png)


## What is it for?

Here are some possible use cases that Gemma can be used for:

**Content Creation and Communication**

* Text Generation
* Chatbots and Conversational AI
* Text Summarization

**Research and Education**

* **Natural Language Processing (NLP) Research:** Serving as a foundation for NLP research, experimenting with techniques, developing algorithms, and contributing to the field’s advancement.
* **Language Learning Tools:** supporting interactive language learning experiences, aiding in grammar correction, or providing writing practice.
* **Knowledge Exploration:** Assisting researchers in exploring large bodies of text by generating summaries or answering questions about specific topics.

Tasks that previously required extremely large models are now possible with state\-of\-the\-art, smaller models. This unlocks completely new ways of developing AI applications, and we could soon see in\-device AI chatbots on our smartphones—no internet connection needed.

How exciting is that?


## Is it good, though?

Several [redditors](https://www.reddit.com/r/LocalLLaMA/comments/1awbqwd/gemma_7b_the_latest_opensource_model_from_google/) have shared their experience using Gemma, and so far, it’s not looking good. Take a look at this example where Gemma is giving incorrect answers when asked about weight questions.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*Sdaiaqcuz7qbftG1)

I haven’t really tried it myself, but it’s important to remember that smaller models like this are expected to have some flaws and might give incorrect answers sometimes.


## Try it yourself

You can start working with Gemma today using free access to Kaggle, a free tier for Colab notebooks, and $300 in credits for first\-time Google Cloud users.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*BrvLnczy724TPrsk-uFJCw.png)

If you are interested in getting started with Gemma, check out these guides to learn from text generation up to deployment in Gemma mode:

* **Text generation with Gemma**: Build a basic text generation example with the model.
* **Tune Gemma with LoRA tuning:** Perform LoRA fine\-tuning on a Gemma 2B model.
* **Tune a Gemma model using distributed training:** Use Keras with a JAX backend to fine\-tune a Gemma 7B model with LoRA and model parallelism.
* **Deploy Gemma to production:** Use Vertex AI to deploy Gemma to production.


## Download the model

The open models are currently available on [HuggingFace](https://huggingface.co/models?other=gemma&sort=trending&search=google).

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*mJRzGhO1sUxPL4_3YjpNGA.png)

The Gemma models can also be downloaded from [Kaggle Models](https://www.kaggle.com/models/google/gemma).


## Final Thoughts

While Gemma models may be small and lack complications, they may make up for it in speed and cost of use.

Looking at the bigger picture, instead of chasing immediate consumer excitement, Google is cultivating a market for businesses. They envision companies paying for Google Cloud services as developers use Gemma to create innovative new consumer applications.

Also, despite the underwhelming reception of Gemini, Google is still showing that it has a lot more tricks under its sleeve.

Of course, with any powerful technology, the true test is how well it works. Google’s past raises the question of whether these models will perform as well as they promise in the real world. It’s important to keep a careful eye on this, but also to hope that Google learns from the past and delivers models that are truly comparable or even better than the competition.

I can’t wait to get my hands on Gemma, and I will definitely share my initial thoughts and findings about this new AI model.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*8BDnUV9iQisOyeN3.png)

This story is published on [Generative AI](https://generativeai.pub/). Connect with us on [LinkedIn](https://www.linkedin.com/company/generative-ai-publication) and follow [Zeniteq](https://www.zeniteq.com/) to stay in the loop with the latest AI stories. Let’s shape the future of AI together!

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*JeeoUhaBYUJGr0Xq.png)


