---
title: "Qwen New Release: The King of Coder is Qwen2.5 coder 32B!"
meta_title: "Qwen New Release: The King of Coder is Qwen2.5 coder 32B!"
description: "The article introduces Qwen2.5-Coder-32B-Instruct, a new AI coding model that outperforms existing open-source models, including GPT-4o, according to benchmark scores. It operates efficiently on a single GPU, achieving 32 tokens per second. The model is available under the Apache 2.0 license and is supported by Ollama for easy deployment. Smaller models are also available for users with limited computing resources. The integration of Qwen models with OpenWebUI enhances usability for daily tasks."
date: 2024-11-14T03:32:00Z
image: "https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*OzrZMolY75t_cdux5UGtIg.png"
categories: ["Programming", "Technology", "Machine Learning"]
author: "Rifx.Online"
tags: ["Qwen2.5", "Coder", "32B", "Instruct", "GPU"]
draft: False

---

Great new everyone! Meet Qwen2\.5\-Coder\-32B\-Instruct: the latest AI model that’s taking the code world by storm!



Most of these models are released under the Apache 2\.0 license .Benchmark scores are through the roof:

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*aHeNvfOvcpME0qzy6EQexQ.jpeg)

As we can see, it’s the best among open source models and even beats the GPT\-4o.

Ollama has already provided its support for several model series.

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*rV1xrpRXUjTFFoKwSsfeOg.png)

So it’s easy to run it.

```python
ollama run qwen2.5-coder:32b
```

The performance of the 32B (Q4 format) on one single GPU 3090 can be found from following screenshot:

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*MVQ0srQhRxX4Ifo3IqU6og.png)

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*jtH3ixeeOQGfyDzmO4Ni3A.png)

It’s **32 tokens/s**! super fast. I am very happy and impressed.

Besides the 32B model, the smaller models have shown impressive performance in terms of model size. If you do not have enough computing power, try some of the smaller models. For example, I tried the 14B model on the new Mac Mini with M4 processor and 16GB RAM.

In addition to benchmark scores, the cursor can now be integrated with the latest Qwen models, including Qwen 2\.5\-Coder\-32B\-Instruct \& OpenWebUI.

Below is a screenshot of using Qwen 2\.5\-Coder\-32B\-Instruct(Ollama) with OpenWebUI:

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*q-Pq3snVhkBs3e_Oxj4_Xw.png)

I can’t wait to use it for my day to day works!


