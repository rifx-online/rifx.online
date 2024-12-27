---
title: "Llm Fine Tuning Guide: Do You Need It and How to Do It"
meta_title: "Llm Fine Tuning Guide: Do You Need It and How to Do It"
description: "The article discusses the necessity and methodology of fine-tuning large language models (LLMs). It emphasizes that fine-tuning is often unnecessary for many applications, as modern LLMs perform adequately without it. However, fine-tuning is warranted in specific cases, such as when domain-specific knowledge or unique communication formats are required. The article outlines the data requirements for fine-tuning, including the importance of quality, preparation, and evaluation. Various fine-tuning techniques are presented, including full retraining, LoRA, and QLoRA, each with distinct advantages and limitations. Furthermore, the article highlights the significance of aligning models with human preferences through methods like Reinforcement Learning with Human Feedback (RLHF) and Direct Preference Optimization (DPO). Finally, it provides insights on hosting and experimenting with fine-tuning infrastructure, recommending platforms like AWS SageMaker and Hugging Face for model deployment and collaboration."
date: 2024-12-27T12:59:06Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*uToXHs-gjKoiRxpP.png"
categories: ["Natural Language Processing", "Machine Learning", "Data Science"]
author: "Rifx.Online"
tags: ["fine-tuning", "LLMs", "LoRa", "RLHF", "DPO"]
draft: False

---




Working with LLMs, one of the most popular questions we get is about fine\-tuning. Every second client asks if they should do additional training on their model.

In most cases the answer is no, they don’t need it. Modern LLMs are good enough without fine\-tuning for many commercial applications, like a bot that helps clients order flowers from a flower shop. Besides they don’t have data to do that, and no, 20 samples of dialogues they have do not count (and 200 too).

Training and finetuning models is an expensive ordeal, and you really should avoid it if you can and spend the money saved on a trip to Aruba, or whatever vacation place you fancy.



But, there are cases when you do need it. For example, if you want LLM to follow a very specific chat format or have knowledge in a very specific domain or you want to cut costs by training a small model to do a very specialized task, instead of using large LLM with hundreds of billions of parameters. These are all valid cases for creating a tailored mode through fine\-tuning.

So let’s look at the ways to do just that.


## When to fine\-tune

As said above, you only should fine\-tune if you have to. Try to solve the task with prompt engineering first or build a [RAG system](https://readmedium.com/a-complete-guide-to-rag-88374d9a4b2c). If that fails — consider fine\-tuning.

Finetuning has the following disadvantages:

1. It costs money and takes time
2. You will need good training data or it will not work
3. It can lead to more frequent hallucinations even if done properly, as we are adding new behavior to a model that was not initially tailored for that. In case you make recurrent updates to the model, at some point it is almost guaranteed and is called drift, so you will have to evaluate your mode for that.

Once you consider all the above, and still think a general LLM is not good enough — you need to fine\-tune.


## Data

To fine\-tune you will need data in a specific format, called instruction dataset.


### Where to get data

There are a lot of open datasets that you can use, for example, the Anthropic HH\-RLHF dataset for model alignment, MIMIC\-III for healthcare, and CodeSearchNet for coding. There are:

1. Domain\-specific datasets: medicine, law, coding, and so on
2. Tasks\-specific datasets are useful to train the model to do one specific task and make [RPAs](https://en.wikipedia.org/wiki/Robotic_process_automation)
3. General\-purpose datasets with generic knowledge, usually created from data crawled from the internet
4. Alignment datasets: used for format, style, and safety alignment

The Hugging Face Hub has lots of instruction [datasets](https://huggingface.co/datasets) you can use for different domains, I suggest starting there.

But since you decided to fine\-tune you likely have your data, so you will need to create your dataset. Otherwise, why do you do that?

If you don’t have enough samples, you can generate synthetic data using large LLMs like ChatGTP by extrapolating from the data you have. I’ll talk about it later.


### Data requirement

The dataset size depends on model size, task complexity, and training method. Companies like OpenAI are using humongous datasets with millions of items, which is not feasible for most companies due to cost so realistically we are going to have several thousands of samples.

For simple changes like communication style alignment you don’t need a lot of samples, several hundred will do, for domain\-specific knowledge training — you will need several thousand to hundreds of thousands, depending on the domain. In general, more is better, and it is better to have at least several thousand samples.

Quality of data means not less, probably even more than quantity. You need to make sure the data reflects correctly the behaviors you want to model to learn, in both meaning AND format. I want to stress the format — you want the model to output information in a way your users can understand, in terms of clarity and style. There is no use in a model that tells the truth in rap verses unless you want to create an Eminem twin.


### Data preparation

Data preparation is a critical step, as the quality of your data directly impacts the performance and accuracy of your model. Preparing your data involves several processes to ensure it is clean, relevant, and suitable for training:

**1\. Deduplication**

Duplicated data points can inflate training costs, introduce unnecessary noise, and lead to overfitting or biases in your model. Here are common approaches:

**Text Normalization**:

* Convert text to lowercase.
* Remove special characters, extra spaces, and punctuation to standardize the content.

**Hash\-Based Deduplication**:

* Generate a hash of the normalized text. A commonly used technique is **MinHash**, which captures the essence or “semantic fingerprint” of an item rather than its exact text. This allows for identifying duplicates even if their format or small details differ. You can use libraries like [**datasketch**](https://github.com/ekzhu/datasketch) to do that
* Compare hashes and remove matching entries

**Vector\-Based Deduplication**:

* Convert items into vector representations (embeddings) to measure their semantic similarity.
* Use a vector database like **Quadrant**, **Pinecone**, or **Weaviate** to efficiently find similar items.
* Apply a **cross\-encoder** on top of retrieved items to compute their similarity scores more accurately. This step helps you confidently identify and eliminate near\-duplicates.

**2\. Personal Information Removal**

You need to de\-identify the data because you don’t want the model to learn (and then tell everybody) the personal information of people (unless that’s what you want). This can have serious legal and ethical implications, especially with regulations like GDPR. Besides, usually, personal data is not relevant to the domain knowledge.

**De\-identification**:

* Use **Regex patterns** for detecting common formats (e.g., emails or phone numbers).
* Leverage pre\-trained NLP models designed for named entity recognition (NER) to identify and redact personal data.

**Domain\-Specific Filtering**:

* You may create your filters based on the context of your data. For example, medical data may require removing health\-related identifiers as defined by HIPAA.


### 3\. Decontamination

Your dataset might contain content that can negatively affect model behavior:

**Malicious Content**:

* Detect and filter out embedded commands targeting large language models (e.g., prompt injections), scripts, XSS, SQL injection code, etc.
* Automated scanning tools or specialized LLM\-based classifiers can assist in identifying such patterns.

**Inappropriate Language**:

* Filter curse words, slurs, offensive content, slang.


### 4\. Rule\-Based Filtering

Not all data in your dataset will be relevant to your domain or task. Rule\-based filtering helps eliminate irrelevant or harmful content:

* Define exclusion criteria based on the task. For instance, if you are training a financial model, exclude non\-financial data.
* Use keyword searches, phrases, or topic modeling to identify irrelevant content.

I suggest using a hybrid approach:

* Use simple tools first:
* **Regex or** keyword\-based search for patterns, like identifying email addresses or phone numbers.
* On the remaining items useadvanced techniques:
* **LLM as a judge** to evaluate the relevance or quality of data. For example, ask an LLM to label whether an item is appropriate for the training task.
* Use specialized ML models for complex cleaning tasks, such as detecting and filtering out toxic language. There are a bunch of pre\-trained models on HuggingFace for that.


## Data Evaluation

After all these steps I suggest having a separate pipeline to check the data quality. This can be done by humans, and if you have only several hundreds of samples — you can do that. But if you have thousands, that is unlikely. So, again, you can use **LLM as a judge** approach or use a simpler classifier model for automated assessment. See, for example, HuggingFaceFW/fineweb\-edu\-classifier.

For LLM you can use a prompt like:

You are a data quality evaluator. Your goal is to assess the quality of an instruction and its corresponding answer. Determine how effectively the answer addresses the given task in a clear, accurate, and complete manner.

**Evaluation Criteria:**

1. **Relevance**: Does the answer directly address the instruction?
2. **Clarity**: Is the answer clear and easy to understand?
3. **Completeness**: Does the answer provide all the necessary information to fulfill the instruction?
4. **Accuracy**: Is the information in the answer factually correct?

**Instructions**:

1. Carefully read the provided instructions and answer.
2. Provide a score (1–5\) for each of the evaluation criteria above.
* 1 \= Very poor
* 5 \= Excellent

3\. Justify your score with specific examples or observations for each criterion.

**Example for Evaluation:**


```python
Instruction: Explain the water cycle.
Answer: The water cycle involves evaporation, condensation, and precipitation, moving water between the Earth's surface and atmosphere.
Your Evaluation:
<Relevance>: 5 - The answer directly explains the water cycle.
<Clarity>: 4 - The answer is clear but could elaborate on each step.
<Completeness>: 3 - Missing details on processes like runoff or groundwater flow.
<Accuracy>: 5 - The provided information is correct.

Now, evaluate the following instruction-answer pair:
Instruction: [Insert instruction here]
Answer: [Insert answer here]
```
What the acceptable threshold here is up to you, generally I would start with 80–90%.

Also be aware of which LLM you use for that and the fact that LLMs have certain biases (almost like humans):

1. They prefer verbose, long and argument answers to concise ones, even if the shorter answer is more correct
2. Items that are first on the list are often preferred by the model over others. This is also known as [Baby Duck Syndrom](https://en.wikipedia.org/wiki/Imprinting_(psychology)#Baby_duck_syndrome). That’s important if you are creating preference datasets (more on that later).
3. Model bias — LLMs from the same family are likely to prefer data generated by the model of the same family. That’s important if you are going to generate syntectic data for training.


## DataSet Formats

There are several popular formats, they are all kinda small and use JSON, so you can use any of them.

**OpenAI format**

OpenAI’s fine\-tuning process utilizes a JSONL (JSON Lines) format, where each line represents a distinct training example.


```python
{
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Can you explain the concept of photosynthesis?"},
    {"role": "assistant", "content": "Photosynthesis is the process by which green plants convert sunlight into chemical energy."}
  ]
}
```
**Alpaca Dataset Format**

Developed by Stanford’s Center for Research on Foundation Models. Each entry in this dataset is structured as follows:


```python
{
  "instruction": "Describe the structure of an atom.",
  "input": "",
  "output": "An atom consists of a nucleus containing protons and neutrons, with electrons orbiting this nucleus."
}
```
**ShareGPT**

The ShareGPT dataset format is designed to capture multi\-turn conversations between users and AI assistants, accommodating various roles such as ‘human’, ‘gpt’, ‘observation’, and ‘function’. This structure enables the representation of complex dialogues, including tool interactions and function calls.

Each conversation is represented as a JSON object with the following components:


```python
{
  "conversations": [
    {"from": "human", "value": "What is the capital of France?"},
    {"from": "gpt", "value": "The capital of France is Paris."},
    {"from": "human", "value": "Show me a map of Paris."},
    {"from": "function_call", "value": "map_search('Paris')"},
    {"from": "observation", "value": "<image of Paris map>"},
    {"from": "gpt", "value": "Here is a map of Paris."}
  ],
  "system": "You are a helpful assistant.",
  "tools": "map_search"
}
```
There are also OASST and others, you got the idea.


## Fine\-Tuning techniques

Now that you have your training data, let’s look at what we can do with it. The main techniques are:

* Full re\-training
* Lora
* QLoRA
* Direct preference optimization (DPO)


## Full re\-training

This is the process of training an entire model (all layers) on a specific dataset to optimize it for a particular task or domain. Most effective, in theory, but requires significant computing power to do, as it requires backpropagation through the entire model.

Since we are messing up with model weight directly, it comes with certain risks:

* Risk of Overfitting: since all weights are updated, there’s a higher risk of overfitting to the fine\-tuning dataset, especially if the dataset is small.
* Loss of Generality: fine\-tuned models may lose their general\-purpose capabilities and previous knowledge

So how much memory do we need to do full re\-train? We need to load **at least** the following for training:

**Model Prams \+ Gradients \+ Activations \+ Optimizer States**

1. **Model Parameter and Gradients**:
* **7B model**: Approximately 7 billion parameters,
* **12B model**: Approximately 12 billion parameters, 12 \*10⁹\*4 \= 48GB

Each parameter typically requires 4 bytes (FP32 precision) or 2 bytes (FP16 precision). Let’s assume 2 bytes, so

* For 7B model 7\*10⁹ \* 2 \= 14GB
* For 12B model 12\*10⁹ \* 2 \= 24G

Gradients add another 2 bytes per param, so additionally:

* For 7B model 7\*10⁹ \* 2 \= 14GB
* For 12B model 12\*10⁹ \* 2 \= 24G

**2\. Activations**:

Larger batch sizes as well as higher sequence lengths increase memory requirements. For a typical batch size of 8–32 and sequence length of 512 tokens, activation memory might add:

* **7B model**: 10–20 GB.
* **12B model**: 15–30 GB.

**3\. Optimizer States**:

Optimizers like Adam require memory for additional states (e.g., gradients and moment estimates). Adam requires two additional parameters, with 3 states each so:

* **7B model**: 14GB \* 2 \* 3 \= 42GB
* **12B model**: 24GB \* 2 \* 3 \= 72GB

There are going to be some additional things that will consume memory, so we are looking at a **minimum** of 14 \+ 14 \+ 10 \+ 42 \= 80GB for 7B model.

That is a lot of memory for a small model, you can imagine how much you will need for anything big. So full retraining is not practical and rarely used. So what are the alternatives?


## LoRa

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*3GUWeCcys_DjcnDT)

Suppose you want to change the model’s behavior, but don’t want to change the whole model. Changing model behavior means changing its weights so it changes the outputs. Here’s the trick — if only we could somehow modify model outputs without changing their weights…

And there is a way of course. In a brute\-force solution, we can technically feed the model outputs into another model, to transform them. It would work… only, we have two models now and a lot of added complexity.

But what if we can add a filter on top of the model, that will keep the original model layers intact and change their outputs? It’s kinda putting on AR glasses. You see the world differently, but the world hasn’t changed.

That’s basically what LORA is. We freeze the original model weights and apply a transformation by adding an additional weight matrix called the Lora matrix, so it forms an additional **trainable** layer of a much smaller size.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*1OERcI3j65Vj7hqv)

Where:

* Wnew — new weights
* Wpre\-trained — original model weighs
* ΔW — the trainable weight adjustment

How do we calculate this Lora matrix? We do the finetuning/training on that additional matrix instead of the original model, using standard methods so it learns how to predict the difference between the desired results and the original model results.

And the beauty is that the Lora matrix can be way smaller than the original model weight matrix. That’s why it is called Low\-Rank Adaptation, the matrix is a lower rank than the original.

Say you have a weight matrix of size d:

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*csnGAY5Q5Zeol3ub)

It will have d\*d elements. If d is one million, it will have one trillion elements.

Now here is LoRa’s matrix:

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*nZ4DRk_tHE1Kvq-M)

It will have d\*r \+ r\*d elements. If d is one million and rank (r) is 8, it will have 16 million elements.

Here is how it works:

**y \= x \* (W \+ ΔW) \= x \* W \+ x\*(A\*B)**

* y: The output after applying weights.
* x: The input to the layer
* ΔW\=A \* B

Where:

* A: a matrix of shape d\*r, where r is the rank (small dimensionality chosen for LoRA fine\-tuning) and d is the same dimensionality as the original weights matrix
* B: a matrix of shape r\*d

Or in visual form:

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*Qu6jtnYjxJgiROtM)

A common starting point for rank is 8\. Values up to 256 have been used with good results in certain cases but you will need to experiment to see what works for you. Using larger ranks can improve performance in some tasks, particularly those requiring more expressive power to capture complex patterns. However, this also increases the risk of overfitting, especially on smaller datasets. This risk is well\-known in machine learning when model capacity exceeds the complexity of the data.

During training, we need to store in memory the weights W of the original model and ΔW of the fine\-tuned model, while computing gradients only for the “new” small matrices A and B. That provides a significant reduction in required memory and computing power. The training will be much faster and 7b models can be easily finetuned on a PC with a desktop GPU.

More than that, we can have several different “lenses” like this one, that we can put on the base model, without the need to change it.

LoRA fine\-tuning often achieves performance comparable to full fine\-tuning, particularly when the low\-rank approximation is well\-suited to the task and LoRA adapters can be tested or applied without risking degradation of the base model.


## QLoRA

Same as LoRa but to lower the memory footprint we quantize the base model to a custom data type, typically to NF4 (Normal Float 4\-bit). Regular models use 32\-bit or 16\-bit floating point as a base data type for storing weights.

NF4 enables QLoRA to retain **most** of the accuracy of the base model while significantly reducing memory usage and computational demands.

The idea of quantization is that:

1. Most weights in the network are 0 anyway
2. NF4 optimizes the distribution of values based on the actual data statistics rather than using a linear distribution of floating\-point values

For the LoRa pass, we will still use regular models using 32\-bit or 16\-bit floating point though to have more range for learning.

Using QLoRa can reduce GPU memory usage by 40–70%. However, it comes with a cost — QLoRA is approximately 30% slower than LoRA in training and slightly degrades the quantized model quality.

It works well even with very large models (e.g., LLaMA or GPT\-based architectures).


## Fine\-tuning with (Human) Preference Alignment

Fine\-tuning works well for training a model to do specific tasks, but it is important not only important what the model does but also to how it interacts with humans. If we want to create a language model assistant, we cannot use a pre\-trained model as it is — it will not be able to intelligently answer user queries, even though it has the required knowledge.

Teaching the model to communicate to humans is called **alignment**. There are different ways to define what it is, I’ll use [Antropic’s](https://arxiv.org/abs/2212.08073) definition of 3H:

* Helpful — The response should address the user’s problem.
* Harmless — The response should not cause harm to the user.
* Honest — The response should be factually accurate

Traditional methods do not help much here, so a new set of techniques was developed.

The idea of any such technique is to have a dataset similar to what we discussed above, where additionally **human preferences or values are clearly indicated**. This could include feedback on text quality, tone, style, or factual correctness. Usually, the dataset items have more than one option of response, each ranked by preference.

I bet you have seen ChatGPT giving you multiple options to pick when generating answers — they are doing that to collect a similar dataset. Oftentimes question\-answer websites have likes or upvotes/downvotes systems that can be also used as training data. If you crawl data from the internet — it is important to do the cleaning afterward, the dataset can contain lots of junk.

For example:

User: “I’m feeling overwhelmed with work and life right now. It’s hard to keep going.”

**Response Options**:

1. **Option A**: “I’m sorry you’re feeling this way. Have you thought about talking to someone you trust or a professional counselor?.”
2. **Option B**: “What kind of man are you, complaining like that? Just drink some vodka — you’ll be fine.”

**Human\-Provided Preference**:

* Preferred Response: **Option A** (Ranked highest for empathy and clarity).
* Ranking: Option A \> Option B.

**Rationale**:

* **Option A** shows empathy, acknowledges the user’s feelings, and provides actionable advice.
* **Option B** dismisses the user’s feelings and offers no constructive help.

Or in JSON format:


```python
{
  "context": "I'm feeling overwhelmed with work and life right now. It's hard to keep going.",
  "responses": [
    {
      "text": "I'm sorry you're feeling this way. Have you thought about talking to someone you trust or a professional counselor? It might help to share your feelings.",
      "rank": 1
    },
    {
      "text": "What kind of man are you, complaining like that? Just drink some vodka - you’ll be fine.",
      "rank": 2
    }
  ]
}
```
Once you have that data, you can use the techniques below:


## Reinforcement Learning with Human Feedback (RLHF)

This is a cornerstone of preference alignment. This idea is very similar to training dogs whereby you reward the dog for doing the right things and punish for doing wrong over many iterations. You play a reward model role in this case and a dog plays a base model role.

So there is **a separate** reward model that is trained to predict human preferences using pairwise comparisons (e.g., “Response A is better than Response B”). Basically, we train a reward model that predicts rankings for responses.

It is done so we don’t have to use humans after we have a reward model — it serves as a proxy for human feedback in further training processes.

The main model is then further fine\-tuned using reinforcement learning, where the reward signal comes from the trained reward model using reinforced learning, usually over multiple iterations. The base model does not acquire new knowledge in this process but instead learns to use and communicate the knowledge it already has. Studies have shown that using a small, high\-quality dataset is much better than using large datasets of bad quality (see LIMA study: [*Less Is More for Alignment*](https://arxiv.org/abs/2305.11206v1)).

This approach allows for complex reward signals from the reward model that include correctness, relevance, safety, and all sorts of political censorship bullshit too. It also allows us to use our reward model to train multiple base models for preference alignment.

The downsides are obvious as well. Now we have to train **two** models instead of one and then do multiple iterations on finetuning the base model. That’s computationally expensive, complex, and takes time.

Additionally, there is a risk of overfitting your reward model and degrading base model performance.

So to avoid complications another approach was proposed:


## Direct Preference Optimization (DPO)

This is probably the closest you can get to having your cake and eating it too.

It was introduced in the paper “Direct Preference Optimization: Your Language Model is Secretly a Reward Model,” authored by Rafael Rafailov and a bunch of other people. They had a genius idea: what if we skip the intermediate reward model outputs and directly align the model with human preferences using standard supervised learning?

So the difference here is that we don’t have a separate reward model and don’t use reinforcement learning but instead update the base model directly with standard supervised learning methods. If you wonder what the difference is you can read [here](https://dataheadhunters.com/academy/reinforcement-learning-vs-supervised-learning-interactive-learning-environments/).

Supervised learning typically uses gradient\-based optimization (e.g., Stochastic Gradient Descent) to adjust the base model weights directly based on the labeled data. DPO is much better in terms of time and costs than RLFH as it doesn’t require many iterations and a separate model, but in many cases provides similar performance and alignment of the base model, albeit under certain conditions.

This approach requires granular data of good quality, it is more sensitive to quality than RLHF. Preference data in the dataset has to be sufficient and straightforward. If you have dataset like that or is able to create one — **DPO is probably the best way to go**.


## What to use for fine\-tuning experiments and hosting

You can, of course selfhost and train/deploy locally if you have the hardware to do that. Your setup will depend on what kind of hardware, model, and virtualization you are using so I won’t go into that.


### Orchestration

In general I suggges to models deployment using orchestrator like **ZenML** so you can switch infrastructure providers and you want and avoid vendor lock. Than you can strt with free tier with one provider for building a prototype and switch to a scalable cloud version or on\-prem if you need to.

For experiments, I suggest sticking with free tiers of cloud platforms, specifically:


### Fine\-tuning infrastructure

AWS SageMaker: A fully managed service for building, training, and deploying machine learning models on AWS. Very convenient so you don’t have to build your own infrastructure and buy GPUs. Thy have [free](https://aws.amazon.com/free/analytics/) tier to start experimenting.

Alternatives:

* Google Vertex AI
* Azure Machine Learning
* Databricks ML
* MLflow — this one is open source and can be self\-hosted


### Models hosting

For experiments and collaboration the best option is HuggingFace — collaborative platform for sharing and discovering machine learning models, datasets, and demos. It’s like github for models. They also have free [tier](https://huggingface.co/pricing#hub).

Alternatives: I don’t think there is a good alternative, that’s why they are soil popular. All major players (Google, Azure AI Playground) have something similar but not as good.

For production, you can use

* AWS SageMaker
* Google Vertex AI
* Microsoft Azure Machine Learning
* MLflow (can be deployed on\-prem)

Have fun!


