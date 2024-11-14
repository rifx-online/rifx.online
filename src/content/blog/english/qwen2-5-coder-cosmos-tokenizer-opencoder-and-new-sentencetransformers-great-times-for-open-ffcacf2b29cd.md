---
title: "Qwen2.5-Coder, Cosmos Tokenizer, OpenCoder, and New SentenceTransformers: Great Times for Open…"
meta_title: "Qwen2.5-Coder, Cosmos Tokenizer, OpenCoder, and New SentenceTransformers: Great Times for Open…"
description: "The article discusses significant advancements in open-source technology, highlighting four key projects: the Qwen2.5-Coder series, Cosmos Tokenizer, OpenCoder, and SentenceTransformers. Qwen2.5-Coder offers a competitive alternative to GPT-4 in code generation and debugging, while Cosmos Tokenizer enhances image and video compression using neural tokenizers. OpenCoder, trained on 2.5 trillion tokens, provides comprehensive resources for code model development. Lastly, SentenceTransformers achieves a 4x CPU inference speedup via OpenVINO's quantization, optimizing NLP tasks. These developments underscore the ongoing evolution and practical applications of open-source tools in AI and coding."
date: 2024-11-14T03:29:09Z
image: "https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*IZdOavxT_8SRCxrg"
categories: ["Programming", "Technology", "Natural Language Processing"]
author: "Rifx.Online"
tags: ["Qwen2.5-Coder", "Cosmos", "OpenCoder", "SentenceTransformers", "OpenVINO"]
draft: False

---




I want to highlight some standout open\-source advancements that have really caught my eye:

* **Qwen2\.5\-Coder Series**: An open\-source code LLM that’s giving GPT\-4 a run for its money.
* **Cosmos Tokenizer**: An advanced suite of neural tokenizers for efficient image and video compression.
* **OpenCoder**: A fully open\-source code LLM trained on an astonishing 2\.5 trillion tokens.
* **Massive CPU Speedup in SentenceTransformers**: A 4x speed boost on CPU inference using OpenVINO’s int8 static quantization.

Let’s dive in!


## Qwen2\.5\-Coder Series: Open\-Sourcing a SOTA Code LLM Rivaling GPT\-4

Alibaba Cloud announced the open\-source release of the Qwen2\.5\-Coder series — models that are **Powerful**, **Diverse**, and **Practical** — dedicated to propelling the evolution of open code large language models (LLMs).

The flagship model, **Qwen2\.5\-Coder\-32B\-Instruct**, sets a new benchmark as the state\-of\-the\-art (SOTA) open\-source code model, matching the coding capabilities of GPT\-4\. It excels in general\-purpose and mathematical reasoning.



Expanding upon previous releases of 1\.5B and 7B models, they introduced four additional model sizes: 0\.5B, 3B, 14B, and 32B. Qwen2\.5\-Coder now accommodates a wide spectrum of developer requirements, covering six mainstream model sizes.

They have also explored the applicability of Qwen2\.5\-Coder in real\-world scenarios, including code assistants and artifact generation.

Practical examples highlight the model’s potential in enhancing developer productivity and code quality.

**Benchmark Achievements**

* **Code Generation**: The Qwen2\.5\-Coder\-32B\-Instruct model achieves top\-tier performance on popular code generation benchmarks such as EvalPlus, LiveCodeBench, and BigCodeBench.
* **Code Repair**: Recognizing the importance of debugging in software development, Qwen2\.5\-Coder\-32B\-Instruct excels in code repair tasks. Scoring 73\.7 on the Aider benchmark, it performs comparably to GPT\-4, aiding developers in efficiently fixing code errors.
* **Code Reasoning**: The model exhibits advanced code reasoning abilities, learning code execution processes and accurately predicting inputs and outputs. Building upon the impressive performance of Qwen2\.5\-Coder\-7B\-Instruct, the 32B model further elevates reasoning capabilities.

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*fzH6YE-yl_GrEXwz)

* **Multi\-Language Support**: Qwen2\.5\-Coder\-32B\-Instruct is proficient in over 40 programming languages. It scores 65\.9 on McEval, showing remarkable performance in languages like Haskell and Racket, thanks to unique data cleaning and balancing strategies during pre\-training.

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*rhyc0T3UZp_2x0r2)

You can find more info on [github](https://proxy.rifx.online/https://github.com/QwenLM/Qwen2.5-Coder).


## Cosmos Tokenizer: Advanced Neural Tokenizers for Efficient Image and Video Compression

The **Cosmos Tokenizer** is a comprehensive suite of neural tokenizers designed for images and videos.

You can now convert raw visual data into efficient, compressed representations.

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*v8k8jLbZ4LYFRUBc.jpg)

By discovering latent spaces through unsupervised learning, these tokenizers facilitate large\-scale model training and reduce computational demands during inference.

**Types of Tokenizers**:

* **Continuous Tokenizers**: Map visual data to continuous embeddings, suitable for models sampling from continuous distributions like Stable Diffusion.
* **Discrete Tokenizers**: Map visual data to quantized indices, used in models like VideoPoet that rely on cross\-entropy loss for training.

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*a6Hvj8hXJUpOAp9Ber781g.png)

**Key Features**:

* **High Compression with Quality Preservation**: Balances significant compression rates with high\-quality reconstruction, preserving essential visual details in the latent space.
* **Lightweight Temporally Causal Architecture**: Utilizes causal temporal convolution and attention layers to maintain the chronological order of video frames, enabling seamless tokenization for both images and videos.
* **Training on Diverse Data**: Trained on high\-resolution images and long videos across various aspect ratios and categories, making it agnostic to temporal length during inference.

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*lBO1omEzlr18SPB1zF-vMw.png)

**Performance Highlights**:

* **Superior Compression Rates**: Offers remarkable compression capabilities with speeds up to **12x faster** than previous methods.
* **High\-Quality Reconstruction**: Delivers significant gains in Peak Signal\-to\-Noise Ratio (PSNR), outperforming existing methods by over **\+4 dB** on the DAVIS video dataset.
* **Efficient Tokenization**: Capable of encoding up to **8\-second 1080p** and **10\-second 720p** videos on NVIDIA A100 GPUs with 80GB memory.

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*uYQttZw-MDOCK3oxxLcHbw.png)

**Evaluation and Resources**:

* **TokenBench Dataset** is a new dataset curated for standardizing video tokenizer evaluation, covering categories like robotics, driving, and sports.
* **Public Availability**: Pretrained models with spatial compressions of 8x and 16x, and temporal compressions of 4x and 8x, are available at [GitHub — NVIDIA/Cosmos\-Tokenizer](https://proxy.rifx.online/https://github.com/NVIDIA/Cosmos-Tokenizer).

More information on [NVIDIA’s official blog post](https://proxy.rifx.online/https://research.nvidia.com/labs/dir/cosmos-tokenizer/).


> *Thank you for taking your time to be here!*


> *If you are enjoying the post, please take a moment to [**follow us on Medium**](https://proxy.rifx.online/https://medium.com/@datadrifters/subscribe), clap this article 50 times and leave a comment.*


> *We are also running a cohort\-based training **[for building full\-stack GenAI SaaS applications](https://proxy.rifx.online/https://forms.gle/8mfFH4wjhF7BbtRY9)**, would be happy to see you inside too!*


## OpenCoder: A Fully Open\-Source Code LLM Trained on 2\.5T Tokens

**OpenCoder** introduces a new family of open\-source code language models, including base and chat models at **1\.5B** and **8B** parameter scales.

Supporting both English and Chinese languages, OpenCoder is trained from scratch on an extensive dataset of **2\.5 trillion tokens**, comprising 90% raw code and 10% code\-related web data.

The model reaches performance levels comparable to leading code LLMs.

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*5rd863dHI-W_2ei7.png)

**Key Contributions**:

* The team provides model weights, inference code, training data, data processing pipelines, and detailed training protocols, empowering researchers and practitioners to build upon and innovate.
* They also introduced **RefineCode dataset**, a high\-quality, reproducible code pre\-training corpus containing **960 billion tokens** across **607 programming languages**.

More information on [official announcement](https://proxy.rifx.online/https://opencoder-llm.github.io/).


## SentenceTransformers Accelerates CPU Inference with 4x Speed Boost

The latest release of **SentenceTransformers** introduces significant performance enhancements, delivering up to a **4x speedup** on CPU inference using **OpenVINO’s int8 static quantization**.

This update optimizes both training and inference workflows for developers working with large\-scale natural language processing tasks.

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Pd9ESPxjKHaHVgV15pCQig.png)

**Key Enhancements**:

* **OpenVINO int8 Static Quantization**: Leveraging OpenVINO’s quantization techniques, the model achieves superior inference speeds with minimal loss in accuracy. This optimization outperforms existing backends, enhancing deployment efficiency on CPU architectures.
* **Prompt\-Based Training**: Supports training with prompts, offering a straightforward method for performance boosts without additional computational overhead.
* **Convenient Evaluation on NanoBEIR**: Facilitates quicker assessments of model performance using NanoBEIR, a subset of the robust Information Retrieval benchmark BEIR.
* **PEFT Compatibility**: Now supports **Parameter\-Efficient Fine\-Tuning (PEFT)** by allowing easy addition and loading of adapters, enabling more efficient model customization.

You can find more info on [github](https://proxy.rifx.online/https://github.com/UKPLab/sentence-transformers/releases/tag/v3.3.0).


## Bonus Content : Building with AI

And don’t forget to have a look at some practitioner resources that we published recently:

Thank you for stopping by, and being an integral part of our community.


