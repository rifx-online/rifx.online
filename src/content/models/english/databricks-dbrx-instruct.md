---
title: "Databricks: DBRX 132B Instruct"
meta_title: "Databricks: DBRX 132B Instruct"
description: "Databricks: DBRX 132B Instruct"
date: 2024-03-29T00:00:00Z
image: "/images/what-is-openai.png"
categories: ["text->text"]
author: "databricks"
tags: ["Role", "databricks"]
draft: false

id: "databricks/dbrx-instruct"
context: 32768
input: 1.08e-06
output: 0.00000108
img: 0
request: 0
---

DBRX is a new open source large language model developed by Databricks. At 132B, it outperforms existing open source LLMs like Llama 2 70B and [Mixtral-8x7b](/models/mistralai/mixtral-8x7b) on standard industry benchmarks for language understanding, programming, math, and logic.

It uses a fine-grained mixture-of-experts (MoE) architecture. 36B parameters are active on any input. It was pre-trained on 12T tokens of text and code data. Compared to other open MoE models like Mixtral-8x7B and Grok-1, DBRX is fine-grained, meaning it uses a larger number of smaller experts.

See the launch announcement and benchmark results [here](https://www.databricks.com/blog/introducing-dbrx-new-state-art-open-llm).

#moe

