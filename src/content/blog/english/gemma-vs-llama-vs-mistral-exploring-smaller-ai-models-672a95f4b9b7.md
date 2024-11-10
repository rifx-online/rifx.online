---
title: "Gemma vs. Llama vs. Mistral: Exploring Smaller AI Models"
meta_title: "Gemma vs. Llama vs. Mistral: Exploring Smaller AI Models"
description: "A Comparative Study of Small-Scale Language Models: Evaluating Gemma, Llama 3, and Mistral in Reading Comprehension Tasks"
date: 2024-11-10T22:36:54Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*TJqJ12YQCeYTS5fWOYR5Ig.png"
categories: ["Natural Language Processing", "Machine Learning", "Data Science"]
author: "Rifx.Online"
tags: ["Gemma", "Llama", "Mistral", "SQuAD", "Multi-Query"]
draft: False

---

### A Comparative Study of Small\-Scale Language Models: Evaluating Gemma, Llama 3, and Mistral in Reading Comprehension Tasks

## Introduction

Large Language Models (LLMs) have been evolving rapidly. Each month, new models are developed to surpass the current top scorers in the market. This healthy competition is beneficial for creating new approaches that increase quality and speed. Additionally, companies are focused on developing smaller models to make them accessible to individuals or organizations without powerful computing resources.

Just a few weeks ago, Apple introduced Apple Intelligence at their Worldwide Developers Conference. This is a set of multiple generative models fine\-tuned to help users write and refine text, prioritize and summarize notifications, create images, and take in\-app actions. The only foundational and proprietary model developed by Apple in that suite was introduced at the same conference. It is a small model designed to run on\-device, where the hardware becomes a significant constraint. In Apple’s case, the model is closed\-source. What we know is that it is a \~3 billion parameter model on par with the 7b versions of Gemma, Mistral, and Llama 3 (according to the results shared by Apple).

While Apple’s new model is exciting, we cannot test or reuse it. Hence, we are more interested in publicly available models since developers and companies can use them to build new products and services. It’s important to distinguish between open LLMs and open\-source LLMs. Historically, open\-source software refers to computer programs released under specific licenses, making the source code available for public use or modification. With LLMs, there is additional complexity, including the training data and model weights. Therefore, open LLMs typically disclose the model weights and initial code. An open\-source LLM, on the other hand, would share every step of the training process, including the training data, along with a permissive license. It should allow others to use, build upon, and further distribute the model. Nevertheless, most of the models released these days fall under the category of open LLMs since, for example, they do not publish the datasets used for training purposes. This is the case for Gemma by Google, Mistral by Mistral AI, and Llama by Meta.

In this article, we analyze Gemma more closely to understand what differentiates these smaller models. Gemma is one of the most recently developed models released by Google. It comes in two versions, 2 billion and 7 billion parameters. Thus, it can be used on edge devices, and it aims to outperform state\-of\-the\-art models like Mistral and Llama 3\.

Additionally, we apply Gemma, Llama 3, and Mistral to a reading comprehension dataset called SQuAD. The LLMs are tasked with answering specific questions based on given contexts. We assess their performance using quantitative metrics such as inference speed and average answer length. We also use the Relative Answer Quality (RAQ) framework proposed by \[1]. RAQ bridges the gap in evaluating LLMs for specific use cases by ranking answers based on their accuracy relative to the ground truth, providing a more nuanced and practical assessment of model performance.



As always, the code is available on our [GitHub](https://github.com/zaai-ai/lab).

## Gemma: the base text model of Gemini

Google released Gemma \[2], an open LLM developed based on its powerful, closed\-source model, Gemini \[3].

Google released pre\-trained and fine\-tuned checkpoints to promote further research of the model in new use cases, making it available in two different sizes:

* The 7B model is to be deployed and further developed on GPU or TPU.
* The 2B model is designed to address computation constraints and allow its use on CPU or on\-device applications.

Gemma promises to achieve state\-of\-the\-art performance compared to other open models with roughly the same scale, like Llama 3 7B or Mistral 7B. This should happen across different domains, such as question answering, common sense reasoning, mathematics/science, and coding.

## Gemma: what is new?

Gemma’s architecture is based on a decoder\-only \[4] Transformer \[5] with a context length of 8192 tokens. Let’s explore the approach taken to make it smaller.

## Multi\-Query Attention

The 2B model utilizes Multi\-Query Attention (MQA) to significantly reduce the memory resources required to load all query, key, and value heads, as opposed to the Multi\-Head Attention (MHA) approach. MQA achieves this memory reduction by using a single key and value for multiple query heads in the attention layer, as illustrated in Figure 3\.

While this approach allows Gemma 2B to be deployed on devices with smaller memory resources, it can lead to quality degradation and training instability. Therefore, the authors opted to use MHA in the 7B version, following the same method as Llama 3\.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*cgSktHmd_iQeTU4DwWLCPQ.png)

## RoPE Embeddings

Transformers require Positional Embeddings because they are inherently order\-invariant. This means that without positional information, a Transformer would represent sentences with the same words but different orders and meanings in the same way. For example:

> *Sentence 1:* Gemma is better than Llama 3

> *Sentence 2:* Llama 3 is better than Gemma

Positional information is typically represented using two sinusoidal functions (sine and cosine). Then, a unique positional embedding is created for each position in the sequence based on its position, the token embedding dimension, and the model dimension.

Therefore, adding positional information is crucial for enabling Transformers to process text properly. The original Transformer architecture used **Absolute Positional Embeddings**, where a vector representation of a position is added to the vector representation of a token.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*cU5a_5-ATKwrQVeka-ViXQ.png)

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*JZLrvgvc7l_52uewCrPSbg.png)

The challenge with Absolute Positional Embeddings is that they do not explicitly encode the relative distances between tokens. While they capture positional information using sine and cosine functions, these embeddings are calculated independently for each position. This means that the model does not inherently understand the proximity or relational significance of different positions within a sequence. For instance, the embeddings for tokens at positions 1 and 2 may appear similar due to the nature of the sinusoidal functions, but the model doesn’t explicitly recognize that these positions are adjacent.

Because of this, the model might not differentiate the relationship between tokens at positions 1 and 2 from the relationship between tokens at positions 1 and 500\. In natural language processing, words that are close together in a sentence often share more context or have a stronger semantic or syntactic relationship than words that are far apart. Absolute Positional Embeddings might not completely capture this nuance. It can lead to limitations in capturing long\-range dependencies or the hierarchical structure of language.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*p-fG2ydLbOhJHjO7Y0LyUw.png)

Rotary Positional Embeddings (RoPE) \[6] address this problem by modeling the relative positions of tokens through a rotation of the token embeddings in the sequence.

Let’s use the previous example, *‘Gemma is better than Llama*,’ and consider each word as a token represented by a 2D vector. The word *better* will be represented by a 2D vector rotated from the original vector based on its position *m* and a constant angle θ, as shown in Figure 5\.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*nX3llo0cwBIrCQ8Gn21-gg.png)

This approach preserves the relative distance between tokens because the rotational transformation maintains the same similarity between vectors, regardless of their position in the sequence. For instance, if we add two words to the original sentence, making it ‘*The LLM Gemma is better than Llama*’, the positions of *better* and *than* change from (3 \& 4\) to (5 \& 6\). However, since the rotation angle remains consistent, the similarity between these vectors (as measured by the dot product) stays the same, ensuring consistent relative positioning.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*6cpWPXTexZC8YQbnasHOUg.png)

## GeGLU Activation Function

The authors replaced the traditional ReLU activation function with a variant of a Gated Linear Unit (GLU) called GeGLU, as another study \[7] has shown that it improves the quality of the output generated by the LLM.

There are two differences between the ReLU and GeGLU:

1. **Activation function** — GeGLU uses a Gaussian Error Linear Unit (GELU) \[8] function that differs from ReLU in the sense that it multiplies the neuron input *x* by a cumulative distribution function of the normal distribution. In this case, the probability of *x* being dropped is higher as *x* decreases.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*FXCfQpvdMJXPk5s6AO-RuA.png)

2\. **Sigmoid Activated** — The simple ReLU or GELU activation function is applied between the hidden representation *x* andtwo linear transformations represented by two matrices (*W1* and *W2\).* The Gating variant in GeGLU applies a gating mechanism (sigmoid) to one of the components, as shown in Equation 3\.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Z9hUjuy4NvQVDrPj6iSfrQ.png)

## Normalizer Location

The last modification to the original Transformer architecture is shown in Figure 8\. The authors normalize both the input and output of each transformer sub\-layer to improve training stability, contrary to the original paper, which only normalized the output.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*NQe4ME2MhvRWVzobVdIloA.png)

They also replaced the traditional LayerNorm function with RMSNorm \[8]. It is computationally more efficient while maintaining training stability improvements and helping the model converge.

RMSNorm achieves better efficiency because its authors demonstrated that the benefits of LayerNorm come from re\-scaling invariance rather than re\-centering invariance. Re\-scaling invariance means that the output of the normalization process remains unchanged if a constant factor scales the input. In other words, multiplying all the inputs by a constant does not affect the normalized outputs. Re\-centering invariance means that the output of the normalization process remains unchanged if a constant value is added to all the inputs. This implies that shifting all inputs by a constant amount does not affect the normalized outputs. This finding allows the removal of the overhead of computing the mean (you only need to compute the standard deviation), making RMSNorm simpler and more efficient.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*qblXBo8SCcxzPWePhFVlYg.png)

## Mistral AI vs. Meta vs. Google: a comparison between Gemma 7B vs. Llama 3 7B vs. Mistral 7B

In this section, we put 3 LLMs — Gemma 7B, Mistral 7B, and Llama 3 7B — to a test. We use a question\-answering dataset under the License CC BY\-SA 4\.0 called SQuAD (it can be found [here](https://huggingface.co/datasets/rajpurkar/squad)). This dataset is a reading comprehension dataset consisting of questions about a set of Wikipedia articles. Based on context, the models should be able to retrieve the correct answer to a question. The 3 more important fields for our use case are:

* `question` \- the question a model should answer.
* `context` \- background information from which the model needs to extract the answer.
* `answers` \- the text answer to the question.

The evaluation process will consist of two quantitative metrics:

* `words per second` \- assesses the inference speed.
* `words` \- assesses the length of the answer.

To assess the accuracy of the models in our use case, we use RAQ \[1]. RAQ ranks the answers of all LLMs using an independent LLM based on how close they are to the ground truth answer.

We start by downloading the models in a `.gguf` format to be able to run them in CPU, and we place them under the folder `model/`.

We used the instruct version of each model with a 4\-bit quantization:

* `mistral-7b-instruct-v0.1.Q4_K_M.gguf` from [https://huggingface.co/TheBloke/Mistral\-7B\-Instruct\-v0\.1\-GGUF/tree/main](https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.1-GGUF/tree/main)
* `Meta-Llama-3-8B-Instruct-Q4_K_M.gguf` from [https://huggingface.co/NousResearch/Meta\-Llama\-3\-8B\-Instruct\-GGUF](https://huggingface.co/NousResearch/Meta-Llama-3-8B-Instruct-GGUF)
* `gemma-7b-it-Q4_K_M.gguf` from [https://huggingface.co/rahuldshetty/gemma\-7b\-it\-gguf\-quantized/tree/main](https://huggingface.co/rahuldshetty/gemma-7b-it-gguf-quantized/tree/main)

After that, we import all the libraries and our generator that receives the model we want to use as an argument.

```python
import os

import seaborn as sns
import matplotlib.pyplot as plt
import scikit_posthocs as sp
import pandas as pd
import utils

from dotenv import load_dotenv
from datasets import load_dataset
from generator.generator import Generator

llama = Generator(model='llama')
mistral = Generator(model='mistral')
gemma = Generator(model='gemma')
load_dotenv('env/var.env')
```

This class is responsible for importing the model parameters defined in a `config.yaml` file with the following characteristics: `context_length` of 1024, `temperature` of 0\.7, and `max_tokens` of 2000\.

```python
generator:
  llama:
    llm_path: "model/Meta-llama-3-8B-Instruct-Q4_K_M.gguf"
  mistral:
    llm_path: "model/mistral-7b-instruct-v0.1.Q4_K_M.gguf"
  gemma:
    llm_path: "model/gemma-7b-it-Q4_K_M.gguf"
  context_length: 1024
  temperature: 0.7
  max_tokens: 2000
```

It also creates the Prompt Template. This template helps format the query and the context before passing it to the LLM to get a response.

```python
from langchain import PromptTemplate
from langchain.chains import LLMChain
from langchain.llms import LlamaCpp

from base.config import Config
class Generator(Config):
    """Generator, aka LLM, to provide an answer based on some question and context"""
    def __init__(self, model) -> None:
        super().__init__()
    # template
        self.template = """
            Use the following pieces of context to answer the question at the end.
            {context}
            Question: {question}
            Answer:
        """
   # load llm from local file
        self.llm = LlamaCpp(
            model_path=f"{self.parent_path}/{self.config['generator'][model]['llm_path']}",
            n_ctx=self.config["generator"]["context_length"],
            temperature=self.config["generator"]["temperature"],
        )
        # create prompt template
        self.prompt = PromptTemplate(
            template=self.template, input_variables=["context", "question"]
        )
    def get_answer(self, context: str, question: str) -> str:
        """
        Get the answer from llm based on context and user's question
        Args:
            context: most similar document retrieved
            question: user's question
        Returns:
            llm answer
        """
        query_llm = LLMChain(
            llm=self.llm,
            prompt=self.prompt,
            llm_kwargs={"max_tokens": self.config["generator"]["max_tokens"]},
        )
        return query_llm.run({"context": context, "question": question})
```

With the LLMs loaded, we fetch the SQuAD dataset from HuggingFace and shuffle it to ensure enough variety in the question theme.

```python
squad = load_dataset("squad", split="train")
squad = squad.shuffle()
```

Now, we can loop over 60 questions and contexts and record the metrics mentioned above.

```python
for i in range(60):
    context = squad[i]['context']
    query = squad[i]['question']
    answer = squad[i]['answers']['text'][0]

    # Llama
    answer_llama, words_per_second, words = utils.get_llm_response(llama, context, query)
    llama_metrics["words_per_second"].append(words_per_second)
    llama_metrics["words"].append(words)
    # mistral
    answer_mistral, words_per_second, words = utils.get_llm_response(mistral, context, query)
    mistral_metrics["words_per_second"].append(words_per_second)
    mistral_metrics["words"].append(words)
    # gemma
    answer_gemma, words_per_second, words = utils.get_llm_response(gemma, context, query)
    gemma_metrics["words_per_second"].append(words_per_second)
    gemma_metrics["words"].append(words)
  
    # GPT-3.5 rank
    llm_answers_dict = {'llama': answer_llama, 'mistral': answer_mistral, 'gemma': answer_gemma}
    rank = utils.get_gpt_rank(answer, llm_answers_dict, os.getenv("OPENAI_API_KEY"))
    llama_metrics["rank"].append(rank.index('1')+1)
    mistral_metrics["rank"].append(rank.index('2')+1)
    gemma_metrics["rank"].append(rank.index('3')+1)
```

The function `get_llm_response` is responsible for receiving the loaded LLM, the context, and the question and return the LLM answer as well as the quantitative metrics.

```python
def get_llm_response(model: Generator, context: str, query: str) -> Tuple[str, int, int]:
    """
    Generates an answer from a given LLM based on context and query
    returns the answer and the number of words per second and the total number of words
    Args:
        model: LLM
        context: context data
        query: question
    Returns:
        answer, words_per_second, words
    """
    init_time = time.time()
    answer_llm = model.get_answer(context, query)
    total_time = time.time()-init_time
    words_per_second = len(re.sub("[^a-zA-Z']+", ' ', answer_llm).split())/total_time
    words = len(re.sub("[^a-zA-Z']+", ' ', answer_llm).split())
    return answer_llm, words_per_second, words
```

We can see that Llama 3 is faster than Mistral and Gemma by producing on average \~0\.7 words per second, while Mistral produces \~0\.26 and Gemma \~0\.4 words. In terms of answer length, Llama 3 also produces longer answers than Mistral and Gemma, with an average answer length of 148 words against 20 words for Mistral and 50 for Gemma. Finally, based on RAQ, Mistral had the best average rank of approximately 1\.81, followed by Gemma with an average of 2\.05, while Llama 3 performed worse with an average rank of approximately 2\.1\.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*GVeFQbMZZ5oUScVEHQPu8A.png)

The RAQ framework also includes a statistical test to understand if the observed differences are significant. Table 1 displays the results of the Dunn post\-hoc test, comparing the performance of different language models. Each cell indicates whether the difference in performance between the respective models is statistically significant at a 5% significance level. “Significant” denotes a statistically significant difference (p\-value ≤ 0\.05\), while “Not Significant” indicates no statistically significant difference (p\-value \> 0\.05\). For the selected significance level, the Dunn test result shows that the difference in performance between models is not significant.

```python
p_values = sp.posthoc_dunn([Llama_metrics['rank'], mistral_metrics['rank'], gemma_metrics['rank']], p_adjust='holm')
p_values > 0.05
```

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ftCaagMKAm5RzeATYm_7Ug.png)

It is always important to assess qualitatively some examples. Below, we have the answers from the 3 models to the question *‘Power House Day is celebrated on what day in New Haven?’* based on the following context:

> ***Context:***‘For over a century, New Haven citizens had fought in the colonial militia alongside regular British forces, as in the French and Indian War. As the American Revolution approached, General David Wooster and other influential residents hoped that the conflict with the government in Britain could be resolved short of rebellion. On 23 April 1775, which is still celebrated in New Haven as Powder House Day, the Second Company, Governor’s Foot Guard, of New Haven entered the struggle against the governing British parliament. Under Captain Benedict Arnold, they broke into the powder house to arm themselves and began a three\-day march to Cambridge, Massachusetts. Other New Haven militia members were on hand to escort George Washington from his overnight stay in New Haven on his way to Cambridge. Contemporary reports, from both sides, remark on the New Haven volunteers’ professional military bearing, including uniforms.’

All 3 models gave correct answers. While Llama 3 and Gemma provided more complete answers, Mistral was more succinct.

> ***Llama 3 answer:***‘New Haven’s Powder House Day is celebrated on April 23rd.’

> ***Gemma answer:***‘Sure! The text states on which day Powder House Day is celebrated on: Powder House Day is celebrated on **23 April** in New Haven.’

> ***Mistral answer:***’23 April’

## Conclusion

On\-device models present a great opportunity to enhance user experiences by making powerful LLMs accessible on devices with lower computational resources. Both Apple and Google are actively developing smaller, more efficient models to meet this need, enabling more people to benefit from advanced AI in their daily lives.

In this article, we explored Gemma, the open LLM developed by Google, which introduced four novel features to the traditional Transformer architecture: Multi\-Query Attention in the 2B version, RoPE embeddings for positional encoding, GeGLU as the activation function, and input normalization.

We also compared Gemma's performance against Llama 3 and Mistral on a reading comprehension dataset. We observed that Gemma produced more words per second and wrote longer answers than Mistral, but it did not surpass Llama 3 in these metrics. Using the RAQ framework, we assessed the accuracy of the three models. While the data showed better results from Mistral, followed by Gemma, the differences were not statistically significant. Therefore, we can say that the 3 models performed similarly when applied to our use case of reading comprehension.

## References

\[1] Luís Roque, Rafael Guedes. Research to Production: Relative Answer Quality (RAQ) and NVIDIA NIM. [https://readmedium.com/research\-to\-production\-relative\-answer\-quality\-raq\-and\-nvidia\-nim\-15ce0c45b3b6](https://readmedium.com/research-to-production-relative-answer-quality-raq-and-nvidia-nim-15ce0c45b3b6), 2024\.

\[2] Gemma Team, Google DeepMind. Gemma: Open Models Based on Gemini Research and Technology, 2023\.

\[3] Gemini Team. Gemini: A family of highly capable multimodal models, 2023\.

\[4] Noam Shazeer. Fast Transformer Decoding: One Write\-Head is All You Need. arXiv:1911\.02150, 2019\.

\[5] Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Lukasz Kaiser, Illia Polosukhin. Attention Is All You Need. arXiv:1706\.03762, 2017\.

\[6] Jianlin Su, Yu Lu, Shengfeng Pan, Ahmed Murtadha, Bo Wen, Yunfeng Liu. RoFormer: Enhanced Transformer with Rotary Position Embedding. arXiv:2104\.09864, 2021\.

\[7] Noam Shazeer. GLU Variants Improve Transformer. arXiv:2002\.05202, 2020\.

\[8] Dan Hendrycks, Kevin Gimpel. Gaussian Error Linear Units (GELUs). arXiv:1606\.08415, 2016\.

\[9] Biao Zhang, Rico Sennrich. Root Mean Square Layer Normalization. arXiv:1910\.07467, 2019\.


