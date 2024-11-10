---
title: "SmolLM2: Very Good Alternatives to Qwen2.5 and Llama 3.2"
meta_title: "SmolLM2: Very Good Alternatives to Qwen2.5 and Llama 3.2"
description: "And it's fully open!"
date: 2024-11-10T03:51:17Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*Y3_lsNsFKybrOi14.png"
categories: ["Technology", "Machine Learning", "Data Science"]
author: "Rifx.Online"
tags: ["SmolLM2", "parameters", "pre-training", "MobileLLM", "reproducibility"]
draft: False

---





## And it's fully open!

Hugging Face has doubled down on their SmolLM initiative.

They released SmolLM2: 1\.7B, 360M, and 135M models trained on 11T tokens (against 1T for SmolLM). They released based and instruct versions:

* Hugging Face Collection: [SmolLM2](https://huggingface.co/collections/HuggingFaceTB/smollm2-6723884218bcda64b34d7db9) (Apache 2\.0 license)

They used new datasets for pre\-training that they will release soon. To make the instruct versions, they used a recipe similar to what they did to train Zephyr (SFT\+DPO on ultrafeedback).

It looks like SmolLM2 performs very well:



Note that Hugging Face fully releases the pre\-training data and the recipe they used to prevent data contamination. In other words, their published evaluation results are probably accurate and fully reproducible.

Hugging Face used its own framework for pre\-training, [Nanotron](https://github.com/huggingface/nanotron). I’ve never written about Nanotron but I think it’s a very interesting project that deserves to be better known, especially if you are interested in understanding how pre\-training is done. I’ll try to find the time to publish an article explaining Nanotron before 2025!

Meta also released a series of small models, MobileLLM:

* Hugging Face Collection: [MobileLLM](https://huggingface.co/collections/facebook/mobilellm-6722be18cb86c20ebe113e95) (CC\-BY\-NC)

This is a new release but note that these models are actually quite old. They were trained for this work published in February 2024:

[MobileLLM: Optimizing Sub\-billion Parameter Language Models for On\-Device Use Cases](https://arxiv.org/abs/2402.14905)

Learn everything you need about using and fine\-tuning Large Language Models with my new book “LLMs on a Budget”:


