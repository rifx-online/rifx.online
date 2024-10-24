---
title: "A new risings Red star: Qwen2.5 is here"
meta_title: "A new risings Red star: Qwen2.5 is here"
description: "Let’s test together the new born Alibaba Cloud’s generative AI Qwen2.5 with python and llama-cpp"
date: 2024-10-24T17:47:43Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*zU-XtqK2oMLkvscgxavjdw.png"
categories: ["Programming", "Technology", "Education"]
author: "Rifx.Online"
tags: ["Qwen2.5", "multimodal", "instruction-following", "text-generation", "multilingual"]
draft: False

---





### Let’s test together the new born Alibaba Cloud’s generative AI Qwen2.5 with python and llama-cpp



In silence, with not so many claims and anticipated announcements, Alibaba Cloud release on September the 19th their flagship model family Qwen2.5.

Alibaba Cloud’s revolutionary journey with Qwen is showing once again strong Leadership through Innovation.

How? What’s so cool in them? And should we expect?

In this article we are going to explore the new models and check the performances. As a follow up, in the next article, we are going to use `llama-cpp-python` and the quantized version of qwen2.5–1.5b-instruct, putting the model under 13 NLP tasks test.

In fact I believe that we are the best Benchmark tool around and we are fully able to evaluate when a model is good for us!

For now, here what we are going to cover:


```python
- Qwen2.5 family innovation
- Declared scope, use cases and models
- Qwen2.5: a party of Foundation models
- Expanding Reach through Open-Source Contributions
- Bridging Industries through cutting-edge AI solutions
- 13 Tasks to prove it worth 
- Future outlook: continued Open-Sourcing
```
Let’s dive in!

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*OeQ5qeOzCdl8LPJOZZgTIw.png)


## Qwen2.5 family innovation

Qwen is the large language model and large multimodal model series of the Qwen Team, Alibaba Group. Just yesterday the large language models have been upgraded to Qwen2.5.

Both language models and multimodal models are pretrained on large-scale multilingual and multimodal data and post-trained on quality data for aligning to human preferences. Qwen is capable of natural language understanding, text generation, vision understanding, audio understanding, tool use, role play, playing as AI agent, etc.

With the recent release of Qwen2.5 and additional open-source model releases Alibaba Cloud continues its leadership position to meet rising AI demands from enterprise users. Since June last year, the Qwen family has attracted over 90,000 deployments via Model Studio in various industries including consumer electronics, automobiles, gaming, and more.

Qwen also expanded its reach with new models such as Qwen1.5–110B and CodeQwen1.5–7B on platforms like Hugging Face, showcasing Alibaba’s commitment to open-source AI development.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*A4pEOgsLK2PAFtiaGQx1Qw.png)


## Declared scope, use cases and models

In the past three months since Qwen2’s release, numerous developers have built new models on the Qwen2 language models, providing valuable feedback to the entire community, but also to Alibaba Cloud.


> During this period, we have focused on creating smarter and more knowledgeable language models. Today, we are excited to introduce the latest addition to the Qwen family: Qwen2.5.

Their claims come with facts about the new family of models:

* Dense, easy-to-use, decoder-only language models, available in 0.5B, 1.5B, 3B, 7B, 14B, 32B, and 72B sizes, and base and instruct variants.
* Pretrained on our latest large-scale dataset, encompassing up to 18T tokens.
* Significant improvements in instruction following, generating long texts (over 8K tokens), understanding structured data (e.g, tables), and generating structured outputs especially JSON.
* More resilient to the diversity of system prompts, enhancing role-play implementation and condition-setting for chatbots.
* Context length support up to 128K tokens and can generate up to 8K tokens.
* Multilingual support for over 29 languages, including Chinese, English, French, Spanish, Portuguese, German, Italian, Russian, Japanese, Korean, Vietnamese, Thai, Arabic, and more.


## Qwen2.5: a party of Foundation models

As announced on the [official blog press release](https://qwenlm.github.io/blog/qwen2.5/) on September 19, 2024:


> Today, we are excited to introduce the latest addition to the Qwen family: **Qwen2.5**. We are announcing what might be the largest opensource release in history! Let’s get the party started!


> Our latest release features the LLMs **Qwen2.5**, along with specialized models for coding, **Qwen2.5-Coder**, and mathematics, **Qwen2.5-Math**.

To showcase Qwen2.5’s capabilities, the Alibaba Cloud team benchmarked their largest open-source model, **Qwen2.5–72B** — a 72B-parameter dense decoder-only language model — against leading open-source models like Llama-3.1–70B and Mistral-Large-V2.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*-MMFgkkWHa307jNo.jpg)

All open-weight models are dense, decoder-only language models, available in various sizes, including:

* Qwen2.5: 0.5B, 1.5B, 3B, 7B, 14B, 32B, and 72B
* Qwen2.5-Coder: 1.5B, 7B, and 32B on the way
* Qwen2.5-Math: 1.5B, 7B, and 72B.

All these open-source models, except for the 3B and 72B variants, are licensed under Apache 2.0. You can find the license files in the respective Hugging Face repositories.


> In addition to these models, we offer APIs for our flagship language models: **Qwen-Plus** and **Qwen-Turbo** through Model Studio, and we encourage you to explore them!

But this is not all!


> …we have also open-sourced the **Qwen2-VL-72B**, which features performance enhancements compared to last month’s release.

In terms of **Qwen2.5**, the language models, all models are pretrained on our latest large-scale dataset, encompassing up to **18 trillion** tokens. Compared to Qwen2, Qwen2.5 has acquired significantly more knowledge (MMLU: 85+) and has greatly improved capabilities in coding (HumanEval 85+) and mathematics (MATH 80+). Additionally, the new models achieve significant improvements in instruction following, generating long texts (over 8K tokens), understanding structured data (e.g, tables), and generating structured outputs especially JSON.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*7c7CIbl-WVjazUeE.jpeg)

Qwen2.5 models are generally more resilient to the diversity of system prompts, enhancing role-play implementation and condition-setting for chatbots.

Like Qwen2, the Qwen2.5 language models support up to **128K** tokens and can generate up to **8K** tokens. They also maintain multilingual support for over **29** languages, including Chinese, English, French, Spanish, Portuguese, German, Italian, Russian, Japanese, Korean, Vietnamese, Thai, Arabic, and more.


### Qwen-Coder is the new kid of the family

The specialized expert language models, namely **Qwen2.5-Coder** for coding and **Qwen2.5-Math** for mathematics, have undergone substantial enhancements compared to their predecessors, CodeQwen1.5 and Qwen2-Math. Specifically, Qwen2.5-Coder has been trained on **5.5 trillion** tokens of code-related data, enabling even smaller coding-specific models to deliver competitive performance against larger language models on coding evaluation benchmarks. Meanwhile, Qwen2.5-Math supports both **Chinese** and **English** and incorporates various reasoning methods, including Chain-of-Thought (CoT), Program-of-Thought (PoT), and Tool-Integrated Reasoning (TIR).

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Nvk4wrcB0SB4Tt-xbCzO6g.png)


## Expanding Reach through Open-Source Contributions

As part of its continuous commitment to the broader community, Alibaba Cloud has made additional steps in releasing various sizes and variants of Qwen models. This includes:

1. **Qwen 0.5 billion parameters**, a foundational version suitable for more traditional applications.2. A compact but potent model tailored specifically for gaming development: **Qwen-VL (vision-language)** optimized with high capabilities.

These advancements demonstrate Alibaba’s commitment to open-source AI, sharing not only the base versions of Qwen but also significant improvements and new models that are targeting directly the enterprise needs while enhancing their ability to innovate rapidly.

This aligns closely with a strategic vision where continuous contributions benefit both community members and its own clients as they seek innovative applications across multiple sectors.


### Bridging Industries through cutting-edge AI solutions

To showcase the breadth of Qwen’s capabilities in real-world scenarios, Alibaba Cloud has been at the forefront:

1. **Xiaomi**: the Company is integrating Alibaba’s models into their AI assistant, Xiao Ai, and deploying it within Xiaomi smartphones and electric vehicles to create enhanced features like car infotainment image generation via voice commands.

2. **Perfect World Games**: the integration of Qwen in game development has led to innovative applications including improving plot resolution through dialogue dynamics and real-time content management.

The collaborations between Alibaba Cloud models and various industries have not only enriched the user experience but also facilitated greater opportunities for growth within these sectors, pushing boundaries that would otherwise be unimaginable without AI advancements.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*ku8o3rq6PHDE8xcc.png)


## 13 Tasks to prove it worth

The 1.5 Billion parameters model is probably the best variant considering complexity, prompt understanding and inference speed.

I will show you my internal testing using only `llama-cpp-python` and a simple terminal interface.

To do so, I created a list of prompt, covering a series of normally used tasks where you can also assign a vote (from 0 to 5) after every generation. It’s a personal human benchmark.


### Requirements

Create a `venv` (python 3.11+ is required): I tested it on my Mini-PC running Windows 11.


```python
## create the virtual environment
python -m venv venv
## activate the venv
venv\Scripts\activate
## Install the dependencies 
pip install llama-cpp-python==0.2.90 tiktoken
```
We need to download the GGUF file from the [official Qwen2.5 Hugging Face repo](https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF). I used the qwen2.5–1.5b-instruct-q5\_k\_m.gguf version.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Fa-qFsx9RTFGZmM-vxCEPQ.png)

Download the file in the main project directory. And we are all set.

The code used here for the analysis is in my GitHub repository:

I will explain the entire code and the results in the next article. Stay updated!


## Future outlook: continued Open-Sourcing

In future plans, Alibaba has also expressed their commitment to ongoing open-source contributions by releasing smaller variants of Qwen for developers across different sectors. In reality in the Hugging Face community many users have started to fine-tune Qwen for dedicated tasks: I wrote an example in my article on NuExtract: the smaller variant of this model family is based on Qwen2–0.5b!

These developments in AI technology and model advancements are crucial steps towards leveraging the full potential of large language models like **Qwen** within a variety of industries. With robust adoption rates continuing to grow rapidly through Model Studio, it is clear that Alibaba Cloud has been a pioneer industry leader not only by providing advanced tools but also promoting innovation across enterprises.

On my side, my outlook are to proceed with internal testing on the new models, specifically on the small ones, up to 3B.

In the next article I will share with you my method, how to run the models and the prompt templates used for each of the thirteen NLP tasks.

Hope you enjoyed the article. If this story provided value and you wish to show a little support, you could:

1. Clap a lot of times for this story
2. Highlight the parts more relevant to be remembered (it will be easier for you to find them later, and for me to write better articles)
3. **Join my [totally free weekly Substack newsletter here](https://thepoorgpuguy.substack.com/about)**
4. Sign up for a Medium membership ($5/month to read unlimited Medium stories)
5. Follow me on Medium
6. Read my latest articles <https://medium.com/@fabio.matricardi>

Here are a few more articles to feed your curiosity:

Resources references in this article:

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*Du7V61mEX_yIrfmF.png)

This story is published on [Generative AI](https://generativeai.pub/). Connect with us on [LinkedIn](https://www.linkedin.com/company/generative-ai-publication) and follow [Zeniteq](https://www.zeniteq.com/) to stay in the loop with the latest AI stories.

Subscribe to our [newsletter](https://www.generativeaipub.com/) and [YouTube](https://www.youtube.com/@generativeaipub) channel to stay updated with the latest news and updates on generative AI. Let’s shape the future of AI together!

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*pvLAT3it1FkdhVU0.png)


