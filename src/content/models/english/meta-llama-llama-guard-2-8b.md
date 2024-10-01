---
title: "Meta: LlamaGuard 2 8B"
meta_title: "Meta: LlamaGuard 2 8B"
description: "Meta: LlamaGuard 2 8B"
date: 2024-05-13T00:00:00Z
image: "/images/what-is-openai.png"
categories: ["text->text"]
author: "meta-llama"
tags: ["Role", "meta-llama"]
draft: false

id: "meta-llama/llama-guard-2-8b"
context: 8192
input: 1.8e-07
output: 0.00000018
img: 0
request: 0
---

This safeguard model has 8B parameters and is based on the Llama 3 family. Just like is predecessor, [LlamaGuard 1](https://huggingface.co/meta-llama/LlamaGuard-7b), it can do both prompt and response classification.

LlamaGuard 2 acts as a normal LLM would, generating text that indicates whether the given input/output is safe/unsafe. If deemed unsafe, it will also share the content categories violated.

For best results, please use raw prompt input or the `/completions` endpoint, instead of the chat API.

It has demonstrated strong performance compared to leading closed-source models in human evaluations.

Usage of this model is subject to [Meta's Acceptable Use Policy](https://www.llama.com/llama3/use-policy/).

