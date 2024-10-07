---
title: "巨人 120B"
meta_title: "巨人 120B"
description: "巨人 120B"
date: 2023-11-10T00:00:00Z
image: "/images/what-is-openai.png"
categories: ["文本->文本"]
author: "alpindale"
tags: ["角色", "alpindale"]
draft: false

id: "alpindale/goliath-120b"
context: 6144
input: 9.375e-06
output: 0.000009375
img: 0
request: 0
---

通过将两个经过微调的Llama 70B模型合并成一个120B模型而创建的大型语言模型。结合了Xwin和Euryale。

感谢
- [@chargoddard](https://huggingface.co/chargoddard)开发用于合并模型的框架 - [mergekit](https://github.com/cg123/mergekit)。
- [@Undi95](https://huggingface.co/Undi95)帮助确定合并比例。

#merge