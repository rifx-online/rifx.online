---
title: "OpenHermes 2.5 Mistral 7B"
meta_title: "OpenHermes 2.5 Mistral 7B"
description: "OpenHermes 2.5 Mistral 7B"
date: 2023-11-20T00:00:00Z
image: "/images/what-is-openai.png"
categories: ["text->text"]
author: "teknium"
tags: ["Role", "teknium"]
draft: false

id: "teknium/openhermes-2.5-mistral-7b"
context: 4096
input: 1.7e-07
output: 0.00000017
img: 0
request: 0
---

A continuation of [OpenHermes 2 model](/models/teknium/openhermes-2-mistral-7b), trained on additional code datasets.
Potentially the most interesting finding from training on a good ratio (est. of around 7-14% of the total dataset) of code instruction was that it has boosted several non-code benchmarks, including TruthfulQA, AGIEval, and GPT4All suite. It did however reduce BigBench benchmark score, but the net gain overall is significant.

