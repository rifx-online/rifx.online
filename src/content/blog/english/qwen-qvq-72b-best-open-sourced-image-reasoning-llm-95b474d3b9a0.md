---
title: "Qwen QVQ-72B: Best open-sourced Image Reasoning LLM"
meta_title: "Qwen QVQ-72B: Best open-sourced Image Reasoning LLM"
description: "Qwen QVQ-72B, developed by Alibaba, is an open-sourced visual reasoning language model that integrates multimodal processing of text and images. It demonstrates enhanced reasoning capabilities, achieving high benchmark scores, particularly in math-related tasks. Despite its advancements, it faces limitations such as language mixing and potential inaccuracies. Built on a transformer-based architecture, Qwen QVQ-72B is accessible for research and development, although it may require significant computational resources for optimal performance."
date: 2024-12-27T12:59:06Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*tmbEax6HI5uMGiJp"
categories: ["Natural Language Processing", "Machine Learning", "Technology/Web"]
author: "Rifx.Online"
tags: ["Qwen", "QVQ-72B", "multimodal", "transformer", "benchmarks"]
draft: False

---





### Visual Reasoning LLM by Alibaba



So. before ending 2024, Qwen (by Alibaba) is back with a bang and has released another open\-sourced LLM, Qwen QVQ\-72B which is a visual reasoning LLM i.e. a reasoning model (similar to OpenAI\-o1\) with support for reasoning on image inputs.

Qwen QVQ is an improved version of Qwen2\-VL for visual reasoning

Talking about its key features:


### 1\. Multimodal Integration

* **Visual and Language Processing:** QVQ integrates language and visual information, allowing it to perform tasks that require understanding both text and images.


### 2\. Performance Metrics

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*mf-CzSuaEgDV_szkhg6YKg.png)

* **High Benchmark Scores**: In evaluations such as the MMMU (Multimodal Math Understanding), QVQ achieved a score of 70\.3, indicating substantial improvements over its predecessor, Qwen2\-VL\-72B\-Instruct, especially in math\-related benchmarks.


### 3\. Enhanced Reasoning Capabilities

* **Complex Analytical Thinking:** QVQ excels in tasks that require sophisticated reasoning, such as solving complex physics problems through methodical approaches. It demonstrates improved performance in visual reasoning tasks compared to earlier models.


### 4\. Open\-Source Availability

* **Community Access:** The model has been released as open\-source, allowing researchers and developers to utilize and build upon its capabilities without significant barriers to entry.


### 5\. Limitations and Challenges

* **Potential Issues:** Despite its advancements, QVQ has limitations, including challenges with language mixing, circular logic patterns, and maintaining focus on image content during multi\-step reasoning processes. These factors can lead to inaccuracies or “hallucinations” in outputs.


### 6\. Technical Specifications

* **Model Architecture:** QVQ is built upon the Qwen2\-VL\-72B architecture, featuring transformer\-based design principles that enhance its processing capabilities across various tasks.

Check this example to understand its might !


## Input

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*nmAvRU-UYXq-cotvy61Ubw.png)


## Output


```python
So I've got this picture of some pelicans, and I need to figure out how many there are in total. Let me see. First, I see a group of them standing on what looks like a concrete ledge or maybe a pier, with water in the background. The water is calm, with small ripples, and the pelicans are all facing pretty much the same direction, towards the left side of the photo.

There are four pelicans in this main group, all lined up next to each other. They have long beaks and are mostly brown with some lighter shades on their bodies. Their heads are held high, and they seem to be resting or waiting there.

Now, besides this group of four, there are a couple more pelicans that are partially visible. One is on the far right of the photo, and only part of its body is showing. It's facing away from the camera, and its tail and part of its wing are visible. Another one is slightly to the left of that, and only its head and part of its back are visible.

So, if I count them carefully, the main group has four pelicans, and then there are these two partial ones on the right side. That would make a total of six pelicans in the picture. But wait, I should double-check that. Maybe one of these partial ones is actually the same pelican, but I don't think so. They seem to be separate birds.

Let me try counting again. Starting from the left: the first pelican is fully visible, standing on the edge. Then, right next to it, another one, also fully visible. Then a third one, and a fourth one, all in a row. So that's four.

Then, towards the right, there's another pelican that's only partially in the frame, showing its head and part of its body. And even further right, there's another partial pelican, showing its tail and part of its wing. So, that adds up to six pelicans in total.

I think that's accurate. The question is asking for the total number of pelicans in the picture, and from what I can see, there are six of them. Maybe I should look again to make sure I'm not missing any.

Looking back at the photo, I can see the four pelicans in the main group, all facing left, and then the two partial ones on the right. No, I don't see any other pelicans in the background or anywhere else in the picture.

So, my final answer is that there are six pelicans in the picture.

**Final Answer**

6
```

## How to use Qwen QVQ\-72B?

The model is open\-sourced and is easily accessible through huggingface. However, as the size is big, you might not be able to use it on a consumer\-grade GPU.

Find the codes here

If you wish to use it for free, check this space

I hope you try Qwen QVQ for visual reasoning


