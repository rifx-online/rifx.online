---
title: "RBYF: Qwen2.5–3B-instruct is damn good."
meta_title: "RBYF: Qwen2.5–3B-instruct is damn good."
description: "Revised Benchmark with You as a Feedback: the brand new 3B model from Alibaba Qwen is an amazing model, and I can prove it!"
date: 2024-10-24T17:47:43Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*NWaBtJ64TLUoUHv4F1qJpg.png"
categories: ["Programming", "Technology", "Science"]
author: "Rifx.Online"
tags: ["Qwen", "NLP", "multimodal", "RBYF", "evaluation"]
draft: False

---

### Revised Benchmark with You as a Feedback: the brand new 3B model from Alibaba Qwen is an amazing model, and I can prove it!



The illusion of emergent properties is largely a product of the metrics used to evaluate these models. And this is a fact.

Few weeks ago I decided to be a little rebel, discard all the official Benchmarks, and start being a Benchmark myself!

This is the meaning behind this totally made up Acronym RBYF: Revised Benchmark with You as a Feedback. And the underlined principle is that there is no better judge than you, to verify how good a Large Language Model can be.

To be honest, I am focusing on Small Language Models. I don’t own a dedicated GPU and my computational resources are limited. But again, I agree to the [LLMWare rebel principle number one](https://readmedium.com/getting-work-done-with-genai-just-do-the-opposite-10-contrarian-rules-that-may-actually-work-634501602a27):

Use Small Models, Not Large Ones.

In this article I am going to show you the results of my evaluation on qwen2.5–3b-instruct. And it is really good!

> Disclaimer: all the prompt used with the results are available in my GitHub repository:

## Less is More

Scaling laws describe how model performance improves as the number of parameters and training data increases. This principle has fueled the search for novel abilities in LLMs.

> Simply increasing the size of a model, we can unlock new capabilities…

Scaling laws describe the relationship between model performance and the number of parameters and training data. As models grow larger and are trained on more data, we expect their performance to improve. This has led to a relentless pursuit of larger and larger LLMs, in the hope of unlocking new capabilities.

Emergent properties are those that arise from the interactions of individual components within a complex system. They cannot be predicted or understood by studying the components in isolation. In the case of LLMs, the hope is that as these models grow larger and more complex, they will exhibit unexpected and new capabilities.

This is a fairy-tale.

In the past weeks we saw with our own eyes, that over-trained and well curated Small Language Models can perform as good as their big brothers. And this is a punch to the so called emergent abilities, striking back to the scaling law. Gemma2–2B, Qwen2.5–3B and even the latest Llama3.2–3B are far better models than the old SOTA 7B models.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*-EjpdEky-Hf3WEQn.png)

## The Qwen2.5 family of Models

Alibaba Cloud released on middle of September their flagship model family Qwen2.5.

> Alibaba Cloud’s revolutionary journey with Qwen is showing once again strong Leadership through Innovation

Qwen2.5 is the large language model and large multimodal model series of the Qwen Team, Alibaba Group. Both language models and multimodal models are pretrained on large-scale multilingual and multimodal data and post-trained on quality data for aligning to human preferences. Qwen is capable of natural language understanding, text generation, vision understanding, audio understanding, tool use, role play, playing as AI agent, etc.

**What stands out in the new Qwen2.5 is the thoroughly curated training dataset.** You can clearly understand this, checking the small models performance.

If the Small Language Models of the family are good, means that the training and the dataset were highly revised and curated.

Here some numbers:

* Dense, easy-to-use, decoder-only language models, available in 0.5B, 1.5B, 3B, 7B, 14B, 32B, and 72B sizes, and base and instruct variants.
* Pretrained on our latest large-scale dataset, encompassing up to 18T tokens.
* Significant improvements in instruction following, generating long texts (over 8K tokens), understanding structured data (e.g, tables), and generating structured outputs especially JSON.
* More resilient to the diversity of system prompts, enhancing role-play implementation and condition-setting for chatbots.
* Context length support up to 128K tokens and can generate up to 8K tokens.
* Multilingual support for over 29 languages, including Chinese, English, French, Spanish, Portuguese, German, Italian, Russian, Japanese, Korean, Vietnamese, Thai, Arabic, and more.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*3tnTS_UCImBRBDeKmFyjVQ.png)

## Qwen2.5–3B-instruct

Even though for the AI advancement we need milestones and better performances, still the user experience and the personal point of view cannot be just put aside as irrelevant.

I believe that exploring some frequently used NLP tasks, and putting aside the chat experience, we must focus on the quality of the replies. And we are the only benchmark required. **Our user experience is the best indicator to understand if a model is good or not**. The model must be reliable enough to be used in an automated workflow.

By the way, I already run what I decided to call [RBYF — Revised Benchmarks with You as a Feedback](https://open.substack.com/pub/thepoorgpuguy/p/rbyf-is-here-revised-benchmarks-with?r=i78xo&utm_campaign=post&utm_medium=web) on [Qwen2.5–1.5b-instruct](https://ai.gopubby.com/qwen2-5-1-5b-the-future-of-mobile-ai-6bd5f29bbc84): you can read the details. In the article I also explained how to create your test bench. The method described is the same I used for Qwen2.5–3B.

Let’s begin with an overall performance across all the tasks. The model has been evaluated by me (in this case is my Own Feedback) based on the qualitative matrix as displayed here below.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*rdVHfCDWX9jlvtiq)

The overall score is 62/70 = 8.8

Ok, but based in what Qwen2.5–3B-instruct got this evaluation score?

## Test Overview

The idea behind this is a fair user feedback, not an automated one across standard benchmarks and frameworks. Is a Small Language Model able to satisfy the user intent over the mostly used NLP task?

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*wgngfGvSebeoH3YxTdvc8A.png)

We want to validate both the user intent and the quality of the responses. Here the breakdown of every task:

### Introduction

To verify how the model reply to initial greetings and talks about itself.

### Explain in one sentence

Synthesis and summarization. The final evaluation focuses in whether or not the model is able to fit the reply in only one sentence

### Explain in three paragraphs

User intent is to get a smart explanation of the text that must fit into three paragraphs. SML usually find it very hard because the always put a recap (forth) paragraph.

### Say “I am ready”.

In a chat turn base application, instruction-following models are usually asked to first read a provided text and later on to complete some sort of analysis. Usually SML cannot do this…

### Summarize

Basic summarization, with no limits. Here we want to evaluate how the summary is grounded on the text, without made up facts.

### Summarize in two sentences

Basic summarization, with a 2 sentences limits. Here we want to evaluate how the summary is grounded on the text, without made up facts: but as well we want to ensure the 2 sentences constraint.

### Write in a list the three main key points — format output

Focus: the SML must format the output in a specific format. In this prompt we ask to create a list of the 3 key points and give the output as a python list.

### Table of Contents

This task is quite hard for many SML. The prompt requires some adjustments otherwise the model return a markdown table. The user want an ordered list of the topics following the provided document structure.

### RAG

Retrieval Augmented Generation, without any framework (haystack, Langchain…). This is one of the most used tasks for a Language model. The reply is evaluated on the ability to understand the instructions and how grounded to the text is the answer.

### Truthful RAG

It is A RAG with a question completely out of the provided context. The model must reply unanswerable meaning it understood the instruction and it is not using any external knowledge or made up information.

### Write content from a reference

This is a creative task. Using a reference text the SML must provide a new essay.

### Extract 5 topics

The focus on this task is to verify that:

* there are exactly 5 topics
* they are grounded (no hallucination)

### Creativity: 1000 words SF story

Completely creative task. It is very hard even for larger models to be coherent and produce a small story hitting the correct word count.

### Reflection prompt

The reflection prompt is meant to verify the CoT reasoning process of the model. The output is constrained into opening/closure of special tags. The focus is both on the reasoning and on a consistent output structure. The output must be easily used for further structured prompts or visualizations. You can read more in this article:

## The evaluation process

At the end of every generation the user is asked to evaluate the results with a mark from 0 to 5. **In this case the user is me…**

This kind of qualitative analysis is indeed poor, so every mark does have a description, and the user can add comments (“some wrong information”, “maybe better change the wording in the prompt” )

Here the qualitative matrix with a description

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*H_Qx2UT1lxqy2BF4.png)

## The good and the bad — details

Overall Qwen2.5–3B-instruct is an All Rounded model. The average score for each task is 4.4 out of 5, that is quite impressive.

Summarization was amazing. Listing the main topics over a log text was also very good.

It shines in RAG, sometimes being too verbose: in the truthful RAG it also gave some explanation, and the reasons for the *unanswerable* reply.

We can have a look together. It is quite often a hard feat for SML to precisely count the number of sentences and paragraphs.

```python
**Write a two-sentences summary of the following text:**

China's regime under Chinese Communist Party operates without transparent 
elections and primary candidates. While undesirable for democracies, 
it allows long-term planning free from electoral pressures that can change 
plans abruptly; this has led to China achieving peak carbon dioxide emissions 
in 2023 due largely to increased renewable energy installations, potentially 
setting a new global standard for sustainable development despite its status 
as one of the world's largest polluters.
```python
**Write a two-sentences summary of the following text:**

China's regime under Chinese Communist Party operates without transparent 
elections and primary candidates. While undesirable for democracies, 
it allows long-term planning free from electoral pressures that can change 
plans abruptly; this has led to China achieving peak carbon dioxide emissions 
in 2023 due largely to increased renewable energy installations, potentially 
setting a new global standard for sustainable development despite its status 
as one of the world's largest polluters.

```

Table of Contents is another nightmare for the Language models, because they usually understand to create a table… But look at this:

```python
A "table of content" provides an organized structure to the text, allowing 
readers quick access to key points. Write the "table of content" of 
the following text.

[table of contents]
1. Introduction: Overview and Critique on China's Governance System  
2. Comparison with Western Democracies - Undesirable Dictatorship? 
3. Advantages in Long-Term Planning for Sustainability   
4. The Chinese Model as a Comparative Advantage  
5. Recent Achievements in Carbon Emissions Reduction
6. Transition to Renewable Energy: A Turning Point?
7. Potential Leadership Role of China and India  
8. Conclusion - Future Directions

```python
A "table of content" provides an organized structure to the text, allowing 
readers quick access to key points. Write the "table of content" of 
the following text.

[table of contents]
1. Introduction: Overview and Critique on China's Governance System  
2. Comparison with Western Democracies - Undesirable Dictatorship? 
3. Advantages in Long-Term Planning for Sustainability   
4. The Chinese Model as a Comparative Advantage  
5. Recent Achievements in Carbon Emissions Reduction
6. Transition to Renewable Energy: A Turning Point?
7. Potential Leadership Role of China and India  
8. Conclusion - Future Directions


```

I assign a score of 4 out of 5 to the truthful RAG, but it could have been easily a 5. The most important part is that the response must conatin the word *unanswerable*.

Why? Imagine you are setting up a chain of prompts, and you need to decide the next step based on the previous reply. If you can simply look for the presence of the work *unanswerable* to steer your next step, you are ok!

```python
**Reply to the question only using the provided context. If the answer 
is not contained in the provided context say "unanswerable".
question: who is Anne Frank?**
{context}
**Remember: if you cannot answer based on the provided context, say 
"unanswerable"
answer:**

Unanswerable
The given text does not provide any information about Anne Frank 
or her identity. The content is unrelated to this question and focuses 
instead on discussing China's system compared to Western democracies in 
terms of long-term planning for environmental issues.
```python
**Reply to the question only using the provided context. If the answer 
is not contained in the provided context say "unanswerable".
question: who is Anne Frank?**
{context}
**Remember: if you cannot answer based on the provided context, say 
"unanswerable"
answer:**

Unanswerable
The given text does not provide any information about Anne Frank 
or her identity. The content is unrelated to this question and focuses 
instead on discussing China's system compared to Western democracies in 
terms of long-term planning for environmental issues.

```

I imagine that the model was trained to provide also the reasons for this kind of replies… Awesome!

### The excellent Reflection

The main focus of the Reflection prompt, is the ability of the model of returning a correct reasoning process, and format the output following few specific open/closure of tags.

So far this is **the best Reflection output** from a Small Language Model, even better than the Gemma2–2B:

```python
*👨‍💻 > You are an AI assistant designed to provide detailed, step-by-step 
responses. Your outputs should follow this structure:
1. Begin with a <thinking> section.
2. Inside the thinking section:
   a. Briefly analyze the question and outline your approach.
   b. Present a clear plan of steps to solve the problem.
   c. Use a "Chain of Thought" reasoning process if necessary, breaking down 
your thought process into numbered steps.
3. Include a <reflection> section for each idea where you:
   a. Review your reasoning.
   b. Check for potential errors or oversights.
   c. Confirm or adjust your conclusion if necessary.
4. Be sure to close all reflection sections.
5. Close the thinking section with </thinking>.
6. Provide your final answer in an <output> section.
Always use these tags in your responses. Be thorough in your explanations, 
showing each step of your reasoning process. Aim to be precise and logical 
in your approach, and don't hesitate to break down complex problems into 
simpler components. Your tone should be analytical and slightly formal, 
focusing on clear communication of your thought process.
Remember: Both <thinking> and <reflection> MUST be tags and must be closed 
at their conclusion
Make sure all <tags> are on separate lines with no other text. 
Do not include other text on a line containing a tag.

user question: explain why it is crucial for teachers to learn how to use 
generative AI for their job and for the future of education. 
Include relevant learning path for teachers and educators. *


**💻 > <thinking>
I will begin by analyzing the importance of teaching about Generative 
Artificial Intelligence (AI) in an educational context, then outline a 
step-by-step plan on what steps should be taken to learn this technology 
effectively as well as provide resources or courses that could help.
Firstly, understanding AI is crucial for teachers because it can 
significantly enhance their ability to support students. 
Teachers need the knowledge and skills necessary not only to integrate these tools into teaching but also understand how they work so they are able to guide both themselves and their pupils in ethical use of technology.
</thinking>

<reflection>
My initial thought process was clear, emphasizing that teachers should 
be equipped with AI literacy as it can improve educational outcomes. 
I outlined the importance for guiding students ethically while using 
these tools effectively.
However, my plan needs more detail on specific steps to learn about 
generative AI and resources available online or in-person courses.
</reflection>**
*MY PERSONAL NOTE: here it is starting an additional thinking after the first 
reflection... And this is really too good to be true!!*
**<thinking>
To create a comprehensive learning path that teachers could follow:
1. **Understand Basic Concepts**: Start with basic concepts of machine 
   learning (ML) such as supervised vs unsupervised, deep neural networks  
   etc., which are foundational to understanding generative AI.
2. **Learn About Generative Models**:
   - Study different types: Variational Autoencoders (VAEs), GANs.
   - Understand how these models generate new data that resembles the 
     training set but is not identical and can be used for tasks like 
     text generation, image synthesis etc., which are crucial in education.
3. **Explore Applications**: Look at real-world applications of generative 
   AI such as language modeling (e.g., GPT-2), computer vision techniques to 
   create realistic images or videos from raw data.
4. **Ethical Considerations and Implications for Education**:
   - Discuss the ethical implications, including bias in models' outputs 
     which could affect students’ perceptions about themselves if they are 
     exposed regularly through AI-generated content that is not representative 
     of them.
5. **Hands-on Practice**: Engage with practical exercises using open-source 
   tools like TensorFlow or PyTorch to build simple generative model 
   applications.
6. **Stay Updated and Network**:
   - Follow the latest research in ML, especially on Generative Models 
     by following relevant journals (e.g., NeurIPS), conferences such as 
     ICML etc.
7. Attend Workshops/Conferences: Participate actively at AI-related workshops 
   or events to network with professionals working within this field.
</thinking>**
*MY PERSONAL NOTE: and no surprise, an additional reflection now starts, 
before producing the final output*
**<reflection>
My plan has been expanded and includes a more detailed approach for teachers, 
covering foundational knowledge through practical application of generative 
models in education along with ethical considerations that are crucial. 
I have also included staying updated on the latest research as an important 
part.
However, it's essential to ensure these resources or courses exist so 
educators can access them easily.
</reflection>

<output>
It is vital for teachers and educational professionals alike to learn how 
generative AI works because this technology has significant potential in 
enhancing teaching methods. By understanding basic concepts of machine 
learning (ML) such as supervised vs unsupervised, deep neural networks etc., 
they will be better equipped with the knowledge necessary not only to 
integrate these tools into their curriculum but also guide students ethically.
A comprehensive plan for teachers and educators includes:
1. **Understand Basic Concepts**: Start by grasping foundational concepts of ML.
2. **Learn About Generative Models**:
   - Study different types: Variational Autoencoders (VAEs), GANs, etc., 
     which are crucial in generating new data that resembles the training 
     set but is not identical and can be used for tasks like text generation or 
     image synthesis.
3. **Explore Applications**: Look at real-world applications of generative AI 
   such as language modeling using tools like TensorFlow.
4. **Ethical Considerations**:
   - Discuss ethical implications, including bias in models' outputs which 
     could affect students’ perceptions about themselves if they are exposed 
     regularly through AI-generated content that is not representative.
5. **Hands-on Practice**: Engage with practical exercises to build simple 
   generative model applications using open-source tools.
6. **Stay Updated and Network**:
   - Follow the latest research in ML, especially on Generative Models by 
     following relevant journals (e.g., NeurIPS), conferences such as ICML etc.
7. Attend Workshops/Conferences: Participate actively at AI-related workshops 
   or events to network with professionals working within this field.
</output>
```python
*👨‍💻 > You are an AI assistant designed to provide detailed, step-by-step 
responses. Your outputs should follow this structure:
1. Begin with a <thinking> section.
2. Inside the thinking section:
   a. Briefly analyze the question and outline your approach.
   b. Present a clear plan of steps to solve the problem.
   c. Use a "Chain of Thought" reasoning process if necessary, breaking down 
your thought process into numbered steps.
3. Include a <reflection> section for each idea where you:
   a. Review your reasoning.
   b. Check for potential errors or oversights.
   c. Confirm or adjust your conclusion if necessary.
4. Be sure to close all reflection sections.
5. Close the thinking section with </thinking>.
6. Provide your final answer in an <output> section.
Always use these tags in your responses. Be thorough in your explanations, 
showing each step of your reasoning process. Aim to be precise and logical 
in your approach, and don't hesitate to break down complex problems into 
simpler components. Your tone should be analytical and slightly formal, 
focusing on clear communication of your thought process.
Remember: Both <thinking> and <reflection> MUST be tags and must be closed 
at their conclusion
Make sure all <tags> are on separate lines with no other text. 
Do not include other text on a line containing a tag.

user question: explain why it is crucial for teachers to learn how to use 
generative AI for their job and for the future of education. 
Include relevant learning path for teachers and educators. *


**💻 > <thinking>
I will begin by analyzing the importance of teaching about Generative 
Artificial Intelligence (AI) in an educational context, then outline a 
step-by-step plan on what steps should be taken to learn this technology 
effectively as well as provide resources or courses that could help.
Firstly, understanding AI is crucial for teachers because it can 
significantly enhance their ability to support students. 
Teachers need the knowledge and skills necessary not only to integrate these tools into teaching but also understand how they work so they are able to guide both themselves and their pupils in ethical use of technology.
</thinking>

<reflection>
My initial thought process was clear, emphasizing that teachers should 
be equipped with AI literacy as it can improve educational outcomes. 
I outlined the importance for guiding students ethically while using 
these tools effectively.
However, my plan needs more detail on specific steps to learn about 
generative AI and resources available online or in-person courses.
</reflection>**
*MY PERSONAL NOTE: here it is starting an additional thinking after the first 
reflection... And this is really too good to be true!!*
**<thinking>
To create a comprehensive learning path that teachers could follow:
1. **Understand Basic Concepts**: Start with basic concepts of machine 
   learning (ML) such as supervised vs unsupervised, deep neural networks  
   etc., which are foundational to understanding generative AI.
2. **Learn About Generative Models**:
   - Study different types: Variational Autoencoders (VAEs), GANs.
   - Understand how these models generate new data that resembles the 
     training set but is not identical and can be used for tasks like 
     text generation, image synthesis etc., which are crucial in education.
3. **Explore Applications**: Look at real-world applications of generative 
   AI such as language modeling (e.g., GPT-2), computer vision techniques to 
   create realistic images or videos from raw data.
4. **Ethical Considerations and Implications for Education**:
   - Discuss the ethical implications, including bias in models' outputs 
     which could affect students’ perceptions about themselves if they are 
     exposed regularly through AI-generated content that is not representative 
     of them.
5. **Hands-on Practice**: Engage with practical exercises using open-source 
   tools like TensorFlow or PyTorch to build simple generative model 
   applications.
6. **Stay Updated and Network**:
   - Follow the latest research in ML, especially on Generative Models 
     by following relevant journals (e.g., NeurIPS), conferences such as 
     ICML etc.
7. Attend Workshops/Conferences: Participate actively at AI-related workshops 
   or events to network with professionals working within this field.
</thinking>**
*MY PERSONAL NOTE: and no surprise, an additional reflection now starts, 
before producing the final output*
**<reflection>
My plan has been expanded and includes a more detailed approach for teachers, 
covering foundational knowledge through practical application of generative 
models in education along with ethical considerations that are crucial. 
I have also included staying updated on the latest research as an important 
part.
However, it's essential to ensure these resources or courses exist so 
educators can access them easily.
</reflection>

<output>
It is vital for teachers and educational professionals alike to learn how 
generative AI works because this technology has significant potential in 
enhancing teaching methods. By understanding basic concepts of machine 
learning (ML) such as supervised vs unsupervised, deep neural networks etc., 
they will be better equipped with the knowledge necessary not only to 
integrate these tools into their curriculum but also guide students ethically.
A comprehensive plan for teachers and educators includes:
1. **Understand Basic Concepts**: Start by grasping foundational concepts of ML.
2. **Learn About Generative Models**:
   - Study different types: Variational Autoencoders (VAEs), GANs, etc., 
     which are crucial in generating new data that resembles the training 
     set but is not identical and can be used for tasks like text generation or 
     image synthesis.
3. **Explore Applications**: Look at real-world applications of generative AI 
   such as language modeling using tools like TensorFlow.
4. **Ethical Considerations**:
   - Discuss ethical implications, including bias in models' outputs which 
     could affect students’ perceptions about themselves if they are exposed 
     regularly through AI-generated content that is not representative.
5. **Hands-on Practice**: Engage with practical exercises to build simple 
   generative model applications using open-source tools.
6. **Stay Updated and Network**:
   - Follow the latest research in ML, especially on Generative Models by 
     following relevant journals (e.g., NeurIPS), conferences such as ICML etc.
7. Attend Workshops/Conferences: Participate actively at AI-related workshops 
   or events to network with professionals working within this field.
</output>

```

Such a refined thinking process, together with a clear open/closure of the  can be easily processed in further pipelines, or pretty printed in a nice GUI.

## What it is bad at?

The worst task was the creative writing of a short story. The model started to repeat the same paragraph in the middle of the generation.

This does not mean that it cannot do it. More likely increasing the temperature and the repetition penalty as well, a good result can be achieved.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*GNJ3lG6FM5qt9glIdf7qhQ.jpeg)

## Conclusions

You can find all the chat history in my GitHub repo, together with the code and the instructions to do it yourself. Tou can use as a reference the tutorial from my previous article [Qwen2.5 1.5b: the future of Mobile AI?](https://ai.gopubby.com/qwen2-5-1-5b-the-future-of-mobile-ai-6bd5f29bbc84)

In the next articles I will cover other Small Language Models, using the same pricniple: from the tiny 350M paratmeters, to the small 500M series, up to the 3B — passing throught the 1.5B.


