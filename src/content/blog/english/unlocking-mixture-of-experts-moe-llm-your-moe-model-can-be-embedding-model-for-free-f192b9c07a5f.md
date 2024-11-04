---
title: "Unlocking Mixture-of-Experts (MoE) LLM : Your MoE model can be embedding model for free"
meta_title: "Unlocking Mixture-of-Experts (MoE) LLM : Your MoE model can be embedding model for free"
description: "Mixture-of-experts (MoE) LLM can be used as an embedding model for free."
date: 2024-11-04T12:30:57Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*mB6VhEyAvxAxGbLDG_6hTw.png"
categories: ["Machine Learning", "Natural Language Processing", "Data Science"]
author: "Rifx.Online"
tags: ["Mixture-of-Experts", "MoE", "embedding", "MoEE", "BERTopic"]
draft: False

---

### Mixture\-of\-experts (MoE) LLM can be used as an embedding model for free.



I recently found an interesting paper titled “Your Mixture\-of\-Experts LLM is Secretly an Embedding Model for Free.” \[1] A recent LLM architecture trend is a decoder model, which is unsuitable for an embedding model because of their attention method. However, the authors revealed that Mixture\-of\-Experts (MoE) LLMs can perform as an embedding model to apply a diverse class of embedding\-focused tasks without any further fine\-tuning. In this blog, firstly, let’s recap MoE, and I will introduce how it works and its practical implementation.

## Table of Contents

1. What is Mixture-of-Experts (MoE)?
2. How MoE works as an embedding model?
3. Practical implementation : Leverage MoEE with BERTopic

## 1\. What is Mixture\-of\-Experts (MoE) ?

Mixture\-of\-Experts (MoE) is an architecture with multiple subnetworks called “experts,” each specializing in different tasks or aspects of data. One of MoE’s advantages is that it enables AI models to be pretrained with less computation than the same or larger models while maintaining or increasing quality. So, if we have a limited budget, we can achieve a better model using MoE than the dense, similar\-size conventional model. For recent success, Mixtral 8 x 7B outperforms the LLaMA 2 70B for many evaluation datasets.

From now on, let’s examine the architecture of MoE. Recent successful MoEs use the transformer model, so I will focus on the popular MoE architecture for the transformer. MoE has mainly two components described below.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Dia_c08PJnFeeIc9lxwtGQ.png)

* **MoE layers**

MoE replaces the feed\-forward network (FFN) layers with MoE layers in the transformer architecture. Each MoE layer has some experts (Ex. 4 experts in the above illustration), and each expert is composed of the simple FFN layer. Note that other components in the transformer, such as the self\-attention layer, share the same weights. Therefore, the number of weights of MoE is not straightforward. For example, the Mixtral 8 x 7B weight is not 8 x 7 \= 56B but 47B because the other layers besides MoE layers share the same weights.

* **Gating network**

A gating network or router is a crucial component in MoE. It takes input tokens and selects the most relevant experts for each token. For instance, in the above illustration, the left side of the router chooses the second expert to process the word “more” token. Meanwhile, the router determines the first expert to process the word “Parameters” token. Generally, a gating network chooses the top\-k experts relevant to the given token and sends the token to chosen experts; for example, Mixtral 8 x 7B chooses top\-2 experts.

How can we choose the top\-k experts? We use the softmax function to calculate the expert’s importance probabilities and keep top\-k probability experts, as shown below. I extracted the gating part of the above illustration.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*qX9H2KKtjntVuiE8yFstMQ.png)

A gating network has its weight. We apply the softmax function to the result of the dot\-product between the input word token and the weight of a gating network, then get the probability of how much the expert is relevant to the given token. Based on the probability, we can select top\-k relevant experts. MoE, which has this type of gating network, is called sparse MoE.

These are the fundamental knowledge needed to understand how MoE works as an embedding model. For further understanding, I recommend reading [this blog](https://huggingface.co/blog/moe) \[2]. Now, let’s dive into how MoE actually works as an embedding model.

## 2\. How MoE works as an embedding model?

### Quick recap about embeddings

Before diving into the theme of this section, let’s quickly recap about embeddings. Recently, embedding has been the internal representation of input data in deep learning models, and it has semantics and condensed data information. We usually extract the last hidden state of the neural network as an embedding, as shown below.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*kSHFTEejKiSI51taKZCO9A.png)

We typically use encoder\-based models to extract embeddings because they can capture semantics with bi\-directional attention compared to decoder\-only models. Decoder\-only models often use causal attention to interact with only the previous word tokens; thus, they cannot capture the rich semantics, such as contextualized information, like encoder\-decoder models.

### How MoE works as an embedding model?

It was a common belief that the decoder model could not be used for embedding extraction. However, the authors found that the routing weight in the MoE provides complementary information to the decoder embedding. The routing weight in each layer reflects the reasoning choice on the input token, so it contains the input’s semantic information that hidden state’s embedding may lost. In the mathematical formula, we can describe it as:

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*n6wGCMqAhjBAfLFV47ML1g.png)

*g* is the softmax function and *H* means the hidden state. We concatenate all the MoE layer’s routing weights to avoid losing model’s reasoning choice.

To fully utilize the routing weights and decoder embedding, the authors proposed a method called MoE Embedding (MoEE) to form a more comprehensive embedding representation. There are two types of MoEE. One method is a concatenation\-based combination, described below.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*uVmcV-lM83XL7HoYbYjt7w.png)

This method is simple, and we just concatenate routing weights and decoder embedding. The authors call this method as MoEE(concat). It can preserve the distinct information captured by each routing weight while allowing downstream tasks to leverage the combined representation.

The other method is weighted sum integration. It performs a weighted sum of the similarity scores calculated from routing weights and hidden state (HS) embedding, denoted as MoEE (sum). This method is used for tasks that compare two sentences, such as semantic textual similarity.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*kyJxWW9zdgRyNr2jmO4LlQ.png)

𝛂 is a hyperparameter to control the contribution of the routing weights. After calculating the similarity score for each pair, we compute the rank correlation, such as Spearman’s rank correlation, between the calculated similarity score and the ground truth similarity.

For practical usage, I think that the MoEE(concat) is easy to use. Moreover, the authors leverage the PromptEOL technique \[4] to enhance MoEE. This technique prompts the following template to constrain LLMs in predicting semantic information in the next token.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*S9BASj9JkQe-i4fqmbopWg.png)

Now, here is the performance table across MTEB tasks.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*7LxkEMR2DFlncypF6_T7Vw.png)

MoEE with PromptEOL can work better than supervised and self\-supervised methods. Note that this leaderboard is not the latest one, so this result is not SOTA. The value of this method is that we can obtain decent results for embedding tasks, and it can be used without any further training.

We have covered how MoEE works so far. In the next section, we will implement MoEE with BERTopic and cluster sentences.

## 3\. Practical implementation : Leverage MoEE with BERTopic

In this section, we extract embeddings from pre\-trained MoE LLM and leverage them with [BERTopic](https://maartengr.github.io/BERTopic/index.html) using a 20\-news\-group dataset \[5]. For your information, BERTopic is a convenient topic modeling library beyond conventional statistical topic modeling. It leverages embeddings from Transformer to make topic clustering, so I think it is suitable for checking the capability. First of all, let’s prepare an environment.

### Environment setup

I used a conda environment with Python 3\.10\. I experimented on Ubuntu 20\.04 with cuda 12\.4, 16 GB VRAM. You may need 32 GB RAM for downloading model weights.

```python
conda create -n moee python=3.10 -y
conda activate moee
```

Next, we need to install the libraries below via pip.

```python
pip install transformers torch bitsandbytes bertopic accelerate
```

MoE models need generally high VRAM because we need to load the entire model to our VRAM in advance. Therefore, we require using bitsandbytes, which is a quantization package, to save VRAM memory.

We need to clone the official GitHub repository.

```python
git clone https://github.com/tianyi-lab/MoE-Embedding.git
```

All preparation is done. Now, let’s implement topic clustring with BERTopic using MoEE.

### Leverage MoEE with BERTopic

Now, we will use MoEE as an embedding model for BERTopic and try topic clustering. The original repository allows us to use small MoE models, such as Qwen\-1\.5\-MoE\-A2\.7B or OLMoE\-1B\-7B. In this blog, I will use OLMoE\-1B\-7B, which is affordable for running inference on 16 GB VRAM. Firstly, we need to load OLMoE\-1B\-7B.

```python
kwargs = {
        "base_model": 'allenai/OLMoE-1B-7B-0924',
        "normalized": False,
        "torch_dtype": torch.bfloat16,
        "mode": "embedding",
        "pooling_method": "mean",
        "attn_implementation": "sdpa",
        "attn": "bbcc",
    }

config = {
    'embed_method': 'prompteol',
    'emb_info': 'MoEE'
    }

embedding_model = MOEE(model_name_or_path='allenai/OLMoE-1B-7B-0924', **kwargs)
```

Next, we need to calculate embeddings of 20\-news\-group dataset to pass BERTopic. (I will attach full code later.)

```python
from sklearn.datasets import fetch_20newsgroups

docs = fetch_20newsgroups(subset='all', remove=('headers', 'footers', 'quotes'))['data']

dataset = MyDataset(docs)
dataloader = DataLoader(dataset=dataset, batch_size=8)
embeddings = None

for batch in tqdm(dataloader):
    with torch.no_grad():    
        embedding = embedding_model.encode(batch, **config)
      
        if embeddings is None:
            embeddings = embedding[0]
        else:
            embeddings = np.vstack((embeddings, embedding[0]))
  
    torch.cuda.empty_cache()
```

To calculate embeddings in advance, we use torch.utils.data.DataLoader for an iterator, and encode each batched document. Note that we must pass embeddings as np.asarray type to the BERTopic.

When you want to use your own MoE models, you must implement to get the routing weights from each MoE layer. For the hidden state embedding, we can utilize the HuggingFace transformer function. We only need to pass the output\_hidden\_states\=True argument when inference.

Now, we can run topic modeling.

```python
## Step 2 - Reduce dimensionality
umap_model = UMAP(n_neighbors=15, n_components=5, min_dist=0.0, metric='cosine')

## Step 3 - Cluster reduced embeddings
hdbscan_model = HDBSCAN(min_cluster_size=15, metric='euclidean', cluster_selection_method='eom', prediction_data=True)

## Step 4 - Tokenize topics
vectorizer_model = CountVectorizer(stop_words="english")

## Step 5 - Create topic representation
ctfidf_model = ClassTfidfTransformer()

## Step 6 - (Optional) Fine-tune topic representations with 
## a `bertopic.representation` model
representation_model = KeyBERTInspired()

## All steps together
topic_model = BERTopic(
  embedding_model=embedding_model,          # Step 1 - Extract embeddings
  umap_model=umap_model,                    # Step 2 - Reduce dimensionality
  hdbscan_model=hdbscan_model,              # Step 3 - Cluster reduced embeddings
  vectorizer_model=vectorizer_model,        # Step 4 - Tokenize topics
  ctfidf_model=ctfidf_model,                # Step 5 - Extract topic words
  representation_model=representation_model # Step 6 - (Optional) Fine-tune topic representations
)

## topic modeling using BERTopic model
topics, probs = topic_model.fit_transform(docs, embeddings)
```

We got 42 topics by the default setting; some samples are shown below. Even though I picked up topics randomly, it can capture the semantics very well.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*VIaKHU-PSuTPzOUKDFbwOw.png)

Moreover, here is the topic cluster visualization.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*KYAUOe2qEAv-ihq2S2dM0A.png)

Please look at the red circle in the topic cluster visualization. This red circle refers to topic 0, which is related to the computer. Closer topics are also associated with mechanic words, such as graphics, digital, and printers.

This method shows us that we can get decent embeddings without any training. Although there is still room to improve the quality to be equivalent to the SOTA\-supervised models, this paper’s finding is a good step for further improvement of the embedding extracting method without training.

Here is my entire code. You need to put this file into the top of the MoE\-Embedding directory.

## References

\[1] Ziyue Li, Tianyi Zhou, [YOUR MIXTURE\-OF\-EXPERTS LLM IS SECRETLY AN EMBEDDING MODEL FOR FREE](https://arxiv.org/pdf/2410.10814) (2024\), *Arxiv*

\[2] Omar S., et.al., [Mixture of Experts Explained](https://huggingface.co/blog/moe) (2023\), Hugging Face

\[3] William Fedus, Barret Zoph., et.al., [Switch Transformers: Scaling to Trillion Parameter Models with Simple and Efficient Sparsity](https://arxiv.org/pdf/2101.03961) (2021\), *Arxiv*

\[4] Ting Jiang, et.al., [Scaling Sentence Embeddings with Large Language Models](https://arxiv.org/pdf/2307.16645) (2023\), *Arxiv*

\[5] [20 News groups](http://qwone.com/~jason/20Newsgroups/)


