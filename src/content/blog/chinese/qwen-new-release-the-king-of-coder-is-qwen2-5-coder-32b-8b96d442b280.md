---
title: "Qwen 新发布：编码器之王是 Qwen2.5 编码器 32B！"
meta_title: "Qwen 新发布：编码器之王是 Qwen2.5 编码器 32B！"
description: "Qwen2.5-Coder-32B-Instruct是最新发布的AI编码模型，表现优异，基准分数超过GPT-4o，速度达到32 tokens/s。该模型在Apache 2.0许可下开源，支持多种硬件配置，包括单个GPU 3090和较小的14B模型，适用于计算能力较低的用户。Ollama已为多个模型提供支持，用户可通过简单命令运行模型。"
date: 2024-11-14T03:32:00Z
image: "https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*OzrZMolY75t_cdux5UGtIg.png"
categories: ["Programming", "Technology", "Machine Learning"]
author: "Rifx.Online"
tags: ["Qwen2.5", "Coder", "32B", "Instruct", "GPU"]
draft: False

---

大家好！介绍一下 Qwen2\.5\-Coder\-32B\-Instruct：最新的 AI 模型正在引领编码界的风潮！



这些模型大多在 Apache 2\.0 许可下发布。基准分数高得惊人：

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*aHeNvfOvcpME0qzy6EQexQ.jpeg)

如我们所见，它在开源模型中表现最佳，甚至超越了 GPT\-4o。

Ollama 已经为多个模型系列提供了支持。

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*rV1xrpRXUjTFFoKwSsfeOg.png)

因此，运行起来非常简单。

```python
ollama run qwen2.5-coder:32b
```

32B（Q4 格式）在单个 GPU 3090 上的性能可以从以下截图中找到：

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*MVQ0srQhRxX4Ifo3IqU6og.png)

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*jtH3ixeeOQGfyDzmO4Ni3A.png)

它的速度是 **32 tokens/s**！超级快。我非常高兴和印象深刻。

除了 32B 模型外，较小的模型在模型大小方面也表现出色。如果您的计算能力不足，可以尝试一些较小的模型。例如，我在新款配备 M4 处理器和 16GB RAM 的 Mac Mini 上尝试了 14B 模型。

在基准分数之外，光标现在可以与最新的 Qwen 模型集成，包括 Qwen 2\.5\-Coder\-32B\-Instruct 和 OpenWebUI。

以下是使用 Qwen 2\.5\-Coder\-32B\-Instruct（Ollama）与 OpenWebUI 的截图：

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*q-Pq3snVhkBs3e_Oxj4_Xw.png)

我迫不及待想在日常工作中使用它！


