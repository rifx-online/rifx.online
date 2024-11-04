---
title: "Large Language Models Just Got A Whole Lot Smaller"
meta_title: "Large Language Models Just Got A Whole Lot Smaller"
description: "And how this might change the game for software startups"
date: 2024-11-04T12:29:02Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*1PeFyz_Dlt6jEf27Q9Y33Q.png"
categories: ["Programming", "Technology", "Machine Learning"]
author: "Rifx.Online"
tags: ["compression", "optimization", "ternary", "parallelism", "hardware"]
draft: False

---

### And how this might change the game for software startups



**This piece was co\-written with [David Meiborg](https://readmedium.com/undefined).**

*TLDR: Large Language Models (LLMs for short) are currently huge, costly to run, and have a [significant carbon footprint](https://arxiv.org/abs/2309.14393). Recent advancements in model compression and system\-level optimization methods might, however, enhance LLM inference. In particular, an approach using parameters with ternary structure has the potential of circumventing much of the costly matrix multiplication that is standard today. This has exciting consequences for hardware startups making specialized chips, but also for software startups that use or custom\-build their own LLMs. Startups that help their customers deploy LLMs might also have more business coming for them.*

Large language models today are big. Like, really big. If you want to load a LlaMa\-2–70B model, you’d need 140 GB of VRAM (that’s 70 billion parameters multiplied by 2 bytes per parameter). For comparison, GPUs like the NVIDIA RTX 3090 or 4090, have just 24 GB of VRAM — a fraction of what one would need.

There are some [workarounds with quantization](https://towardsdatascience.com/run-llama-2-70b-on-your-gpu-with-exllamav2-588141a88598), but these tend to be cumbersome. Likely you will still have your GPU running hot for up to 15 hours until the model is loaded. Not to mention that you still need some spare memory for inference, or in other words for deploying the model.

Using current\-day LLMs is therefore costly: One typically needs multiple high\-end GPUs to keep the model, and must then account for the energy costs from inference.

This is why lots of research is going into applying techniques that make LLMs smaller and thus cheaper to run on smaller hardware. It is a tough trade\-off in most cases, because making LLMs smaller usually impacts their quality. Finding the point where cost equals benefits can be tricky.

In this piece, we give an overview of promising optimization approaches, explain a recent breakthrough from Microsoft researchers, provide a brief overview of innovative startups in the field of “efficient LLMs” and derive some general implications for startups operating in the LLM ecosystem.

## How LLMs are getting more resource\-efficient

Tech giants like Microsoft and OpenAI, Meta, or Google have sufficient resources to train up cutting\-edge models even if the training cost is currently prohibitive for most other companies. The biggest bottleneck to widespread adoption therefore is not training but inference efficiency. In other words, although Meta has published LlaMa, it still isn’t being adopted enough because running — not creating — the model is already challenging enough.

Researchers, however, are starting to increase this inference efficiency. Broadly speaking, there are two approaches to this: **System\-level optimizations** do not change the model itself but rather make it work better by changing key aspects of the environment that it is in. **Model optimizations** compress the model so that it is easier to deploy and run.

There is a variety of different techniques for either approach. [A recent paper](https://arxiv.org/pdf/2402.01799.pdf) by researchers summarize these techniques excellently. Because these techniques might soon become basic knowledge for anyone working on systems with LLMs, we give a quick overview over these techniques below.

### System\-level optimization

System\-level optimization refers to changing not the model itself, but how it is run across the hardware. As it turns out, plenty of levers can be pulled to avoid resources sitting around idle or wiping out other inefficiencies.

**Paged Attention**

At the heart of LLMs like GPT is the attention mechanism. This mechanism allows the model to focus on different parts of the input text when generating each word of the output text. Imagine you are reading a book and highlighting important sentences to remember the story better. Similarly, the attention mechanism “highlights” or gives more importance to certain words or phrases when making predictions.

This mechanism is very resource\-intensive. It requires the model to consider the relationships between all pairs of words in the input text. For long texts, this can require a lot of memory and computational power.

Instead of processing the entire text at once, paged attention divides the text into smaller “pages” or segments. The model then processes these pages one at a time or in smaller groups. This approach significantly reduces the amount of memory needed at any given time because the model doesn’t need to keep track of the entire text’s relationships simultaneously.

This is a bit like a student who would be overwhelmed by reading the entire year’s textbook at once. By breaking it down into manageable segments over the school year, the student can memorize the contents of the textbook.

By requiring less memory for each step, paged attention allows for the use of larger models or longer texts within the same hardware constraints.

**Tensor Parallelism**

Parallelism is a well\-known concept in computing. It means dividing a large computational task into smaller parts that can be processed simultaneously by multiple processors or computers. This significant speeds up the time a program needs to run.

[Tensors](https://towardsdatascience.com/what-is-a-tensor-in-deep-learning-6dedd95d6507), in the context of LLMs, are multi\-dimensional arrays of numbers. These tensors are used to represent the data processed by the models. Such data includes input text; model weights, i.e. parameters that the model learns; and output predictions.

Putting both concepts together, tensor parallelism involves splitting these tensors across multiple GPUs or other processing units. For example, if a model’s parameters (weights) are too large to fit into the memory of a single GPU, they can be divided across multiple GPUs. Each GPU then processes only a portion of the tensor at a time.

Just like a team of multiple people working on a large project, the processing units need to exchange information as they work on their respective parts of the tensors. For instance, the results of computations on one GPU might need to be shared with another GPU to continue the next step in the computation. Efficient communication between the units is therefore crucial for the effectiveness of tensor parallelism.

In short, tensor parallelism is a way of breaking down the computations needed for LLMs into smaller, parallel tasks that can be handled simultaneously by multiple computing units, leading to faster training and inference times for these large and complex models.

**Pipeline Parallelism**

This technique focuses on improving the workflow of processing data through the model’s layers. This can significantly speed up the overall computation and make better use of available hardware.

A pipeline in computing works similarly to a factory assembly line, with different stages of a task being completed in sequence. This allows for multiple tasks to be worked on simultaneously but at different stages.

In LLMs, these different stages are represented by layers of neural networks. Each layer processes the input data in sequence, gradually extracting more complex features or patterns until it produces the final output. Think of each layer as a worker in the factory assembly line: Each worker adds something to the input data as it passes through, until finally a complex product emerges.

In pipeline parallelism, the model’s layers are divided into segments, and each segment is assigned to a different GPU or processing unit. This way, the model can be fed on batches of data: Once the first segment is through with the first batch, the second segment takes that batch, and the first segment takes a fresh, new batch on.

This creates a continuous flow of data through the model where each segment of the model is working on a different piece of data at any given time. This maximizes the use of available hardware resources by keeping all parts of the model active and reduces the idle time that can occur when a single processor waits for tasks to complete.

Pipeline parallelism, which was discussed earlier, operates at the level of model layers, distributing the sequential processing stages across devices. Tensor parallelism, on the other hand, operates at a more granular level, distributing the actual computations (e.g., parts of a large matrix multiplication) that occur within layers across devices.

**CPU/GPU Offloading**

We have talked a lot about GPUs in this piece. Nevertheless, ot all tasks in training or running an LLM are equally suited to GPUs. Some tasks, like data preprocessing or certain control logic, might be more efficiently handled by a CPU. Other tasks, particularly the heavy mathematical computations involved in processing neural networks (like matrix multiplications), are indeed more efficiently executed on GPUs.

By offloading specific tasks to the processor best suited for them — GPUs for parallelizable, computation\-heavy tasks, and CPUs for sequential or logic\-intensive tasks — systems can ensure that each part of the workload is processed in the most efficient manner possible.

**Fused Operations**

Fused operations take multiple processing steps that would normally be executed separately and combine them into a single, streamlined operation. For instance, instead of doing a matrix multiplication and then an addition, a fused operation would do both at once.

**Speculative Decoding**

When generating text, LLMs calculate the probabilities of what the next word in a sentence might be, based on the words that have come before. Traditionally, after each word is generated, the model recalculates to determine the next word, and this process repeats until the full sentence or paragraph is completed. This sequential process can be slow, however, especially for longer texts or more complex models, because each step depends on the completion of the previous step.

Parallel Predictions: Instead of waiting for each word to be chosen before considering the next, speculative decoding allows the model to “speculate” or make multiple predictions about what the next few words could be at the same time. This is called *parallel predictions*. It’s like making educated guesses about several possible paths the sentence could take next

By exploring these possibilities in parallel, the model can potentially reduce the overall time it takes to generate text. Once the actual next word is selected, the model can more quickly proceed along the most likely path, having already computed the subsequent options.

### Compression of LLM Models

Researchers have in the past explored model compression. With the advent of large\-scale LLMs, however, this has become a bigger challenge.

Many established compression methods rely on the paradigm of executing fine\-tuning steps to regain lost performance during the compression stage. This approach has significant limitations, however, when applied to LLMs because of their sheer size. LLM compression has therefore become a whole new research domain.

**Architecture pruning**

When you prune an apple tree, you cut off certain branches in winter early spring. This ensures that the tree doesn’t waste resources on unproductive branches or catches diseases from dead wood. This helps it produce better fruit.

LLMs, of course, don’t produce fruit. In this context, pruning is a method used to reduce the size of the model while trying to maintain or minimally impact its performance.

LLM models have millions or even billions of parameters. Not all of these parameters are equally important for the model to make predictions or understand language. Some parameters are used rarely or don’t contribute much to the model’s decisions: Eliminating these redundant or less impactful connections, neurons, or entire layers hence makes the model more efficient to use.

Choosing which parameters to prune is not a trivial task. In magnitude\-based pruning, the weights of the neural network with the smallest absolute values are removed. Before training, such weights are usually zero; after training, they are typically somewhere between \-1 and 1\. If training did not affect a weight very much, then it is likely close to zero, and thus contributes less to the model’s decisions.

A more resource\-intensive but also more robust pruning technique is sensitivity analysis. This involves evaluating the impact of removing each parameter, or group of parameters, on the model’s performance. Parameters whose removal causes the least degradation in performance are pruned.

There are other techniques as well, but generally one can classify them as unstructured or structured pruning. Unstructured pruning (e.g. magnitude\-based pruning) removes individual weights, leading to a sparsely connected neural network. Structured pruning (e.g. sensitivity analysis) removes entire units or layers (e.g., a whole neuron or channel), which can be more effective for computational efficiency on certain hardware.

After pruning, the model often undergoes a fine\-tuning process. This involves retraining the pruned model on the training dataset or a subset of it. The goal is to allow the model to adjust and optimize its remaining parameters to compensate for the loss of the pruned ones. This helps in recovering any performance that was lost due to pruning.

This can be done in an iterative or in a one\-shot approach. In iterative pruning, the model is pruned iteratively over several rounds. After each round, the pruned model is retrained to regain performance lost due to pruning. This cycle can be repeated multiple times, with the model potentially becoming more robust and maintaining performance even with significantly fewer parameters. In one\-shot pruning, all the identified parameters are removed at once, and the model is then fine\-tuned.

**Knowledge distillation**

Imagine there is a football court with two players: One is very experienced and knows many tricks, the other is a beginner. The experienced player knows much more than the beginner, but the beginner can quickly get to a comparable behavior by mimicking the other player’s behavior on the field.

Knowledge distillation for LLMs works similarly: It is the process of training a smaller (student model), more efficient model to replicate the performance of a larger model (teacher model) by learning from its outputs and the way it processes information.

To apply this technique, you obviously need a large teacher model, e.g. one of the large open\-source models from LlaMa or Mistral. Then you need to design a smaller neural network that has significantly fewer parameters than the teacher model.

Instead of training the student model solely on the original hard targets, i.e., the ground truth data labels, it is also trained on the soft targets. These are the probabilities produced by the teacher model for the same inputs. For example, for a given set of queries, imagine that the teacher answers it as ‘A’ 70 percent of the time, ‘B’ 20 percent of the time, and ‘C’, ‘D’, or ‘E’ 10 percent of the time. Not only will the student model try to get the answer to every question right; it will also try to follow the same probability distribution over a set of queries.

Such soft targets carry more information per example than hard labels because they include the teacher model’s confidence levels across all possible outcomes. This is how to the student model is able perform similarly to the teacher but with less computational expense.

After the initial knowledge distillation, the student model might be further fine\-tuned on the task\-specific dataset with hard labels to maximize its performance.

**Low rank approximations**

LLMs work by processing and generating text based on incredibly large matrices (i.e., veeeeery big tables of numbers) that represent the relationships between words, their meanings, and how they’re used in language. These matrices can be so large that they’re hard to work with, especially when it comes to storage and computation.

A low\-rank approximation involves finding a simpler matrix that is much smaller in size but still captures the most important information of the original large matrix. It is a bit like reducing a detailed painting to a sketch.

This is done through mathematical techniques that identify which parts of the matrix (or painting, in our analogy) hold the most information and condense the matrix to just those parts. There are mathematical techniques, notably [singular value decomposition](https://www.cs.cmu.edu/~venkatg/teaching/CStheory-infoage/book-chapter-4.pdf), which help with this.

In contrast to pruning, low rank approximation performs matrix dimensionality reduction, maintaining the structure of the model but representing it in a more compact form, while pruning directly removes parts of the neural network.

**Quantization**

LLMs process text using a vast number of mathematical calculations. These calculations are performed using numbers that can have a wide range of values. Typically, these numbers are stored in a format that can represent a very wide range of values ([floating\-point format](https://de.wikipedia.org/wiki/Einfache_Genauigkeit)), occupying 32 bits in memory.

Quantization reduces the precision of those numbers, typically from 32\-bit floating\-point numbers to lower bit\- width representations, such as 8\-bit integers. This means that instead of using numbers with a lot of decimal places, the model uses “simpler” numbers, making the calculations faster and requiring less memory.

Quantization\-Aware Training (QAT) involves training the model with quantization in mind, allowing it to adapt to the precision loss and usually resulting in better performance but at the cost of more complex and resource\-intensive training processes.

Post\-Training Quantization (PTQ) applies quantization after the model has been fully trained, offering a simpler and faster approach to reduce computational demands. However, it may not achieve the same level of accuracy or performance as QAT due to the model not being specifically optimized for lower precision operations.

### The Era of 1\-bit LLMs?

Microsoft researchers recently [made waves with a paper](https://arxiv.org/pdf/2402.17764.pdf) that stores each parameter not in 16 bits, as is currently [the standard](https://en.wikipedia.org/wiki/Half-precision_floating-point_format) in LLMs, but in a mere 1\.58 bits. This is huge news: With this technique, they achieved almost 10 times more token throughput, i.e., it processes text almost 10 times as fast. They also reduced their memory footprint by a factor of 3\.5, which means that they need a lot less hardware to run these models on.

This was achieved using a ternary bit. Instead of using a floating\-point number between \-1 and 1, as is usually the case and typically uses 16 bits, every weight is expressed as either \-1, 0, or 1\. These numbers can be stored on 1\.58 bits, because for 3 possible values on a binary transistor one gets that 2¹.58 \= 3\. Using only numbers this simple also means that complicated matrix multiplication is no longer necessary, which makes it a lot more resource\-efficient.

What is baffling about this technique is that it achieves a similar output performance as traditional 16\-bit models at a size of 3 billion parameters. It is not yet clear whether this kind of model scales up as well as traditional models, when passing the threshold of 13 billion or more parameters. What is clear is that even at 70 billion parameters it is more efficient, in terms of latency, memory usage and energy consumption, than a traditional model with only 13 billion parameters. The quality of the output remains to be tested in detail.

One other disadvantage is that state\-of\-the\-art quantization of existing LLMs cannot be used to produce a 1\.58\-bit model. Such models need to be created from scratch, which, despite its dramatically lowered cost, will put it out of reach of the average citizen for now.

If and when such models have been created and work well, however, inference should become a lot easier. 1\.58\-bit LLMs might even be deployed on edge and mobile devices. They are also a lot friendlier to CPU devices — which most mobile devices run on — which makes them easier to deploy on cheaper chips. All this has a lot of advantages, for example for privacy, but allow allows for new applications that humanity hasn’t even dreamt of yet.

Moreover, startups like [Groq](https://groq.com/) have demonstrated promising results and great potential for building specific hardware [like LPUs](https://wow.groq.com/why-groq/) for LLMs. LLM\-specific hardware is already a [huge market](https://finance.yahoo.com/news/generative-ai-market-size-expected-163500846.html#:~:text=%2D%20Large%20Language%20Model%20(LLM),the%20forecast%20period%202023%2D2029.). Findings like these might make this market grow even more aggressively than analysts have foreseen to date.

If nothing else, inference will become dirt cheap due to a combination of quantization techniques and specialized hardware. This has implications for many companies, including startups.

## What do lighter LLMs mean for startups?

### The boom in AI hardware has just begun

Between 1971 and 1999, CPUs were pretty much [the only microprocessors](https://cs.stanford.edu/people/eroberts/courses/soco/projects/2005-06/64-bit-processors/history1.html) on the market. Then [NVIDIA introduced](https://readmedium.com/a-brief-history-of-gpu-47d98d6a0f8a) its GPU. It was not technically the world’s first GPU; however, it was the one of the first microprocessors that made gaming an accessible and immersible experience. (Gaming eats a lot of computing power — if you didn’t know, now you know!)

From gaming, GPUs quickly proliferated to do many different tasks, including scientific image processing, linear algebra, 3D reconstruction, and more. One thing that GPUs do particularly well? Machine learning and LLMs. Many of NVIDIA’s chips today are being used for training LLMs.

Since then, other microprocessors have started to proliferate. [Google’s TPUs](https://cloud.google.com/tpu?hl=en), introduced in 2016, are particularly well\-suited for AI training and inference. While GPUs turned out to be great for LLMs, TPUs were specifically designed for this purpose. They are well\-suited both for training and inference.

The industry is [at a turning point](https://www.wsj.com/tech/ai/how-a-shifting-ai-chip-market-will-shape-nvidias-future-f0c256b1), however: Soon, the majority of LLM\-related work will be inference, and no longer training, as users start deploying models such as LlaMa. New and innovative AI semiconductor companies now have a chance to enter the game.

This includes chipmaker [Groq](https://wow.groq.com/press/) which focuses on particularly speedy inference processors. Other startups include [Cerebras](https://www.cerebras.net/) (which focuses on training), [Graphcore](https://www.graphcore.ai/about) (which covers training and interference), and [SambaNova](https://sambanova.ai/) (also training and inference). More established competitors like Intel and AMD are also eyeing both training and inference, although most growth is expected to come from the latter in the coming years. The big tech giants — Google, Amazon, or Microsoft — are also developing AI\-specialized chips, but mostly for in\-house use.

Overall, the hardware market for LLMs is still dominated by datacenter applications. Edge and mobile applications are the next logical step, but will require more breakthroughs like the 1\.58\-bit approach that Microsoft researchers recently published (see above).

## The impact for LLM software companies

Looking at the whole value chain in the emerging AI space, the developments we outlined above are likely to lead to **significantly reduced costs for running/consuming LLMs**.

Some of our thoughts on where this will lead to:

* **Great B2C products**, because lower LLM costs mean that you can build freemium B2C experiences with a high LLM consumption (frequency \& scale — e.g. long context window) without ruining company unit economics.
* Democratization of access on a global scale, allowing **users in lower\-income countries** to utilize advanced AI technologies
* Companies can automate a wider range of tasks, leading to **increased efficiency and productivity** (“I don’t care anymore if I have 10k API calls per hour”)
* New edge AI hardware combined with smaller models will lead to **new edge AI use cases** becoming feasible that were “data\-center”\-only before
* As edge hardware explodes, we believe opportunity opens up to build software companies that help customers to bring AI models to the fragmented space of tailored edge devices (“give me your model, I compress it with various techniques, test it on 10 different edge devices, tell you what works best and then help you to deploy it”)


