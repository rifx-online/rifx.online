---
title: "解锁混合专家 (MoE) LLM：你的 MoE 模型可以免费嵌入模型"
meta_title: "解锁混合专家 (MoE) LLM：你的 MoE 模型可以免费嵌入模型"
description: "混合专家 (MoE) LLM 可以免费用作嵌入模型。"
date: 2024-11-04T12:30:57Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*mB6VhEyAvxAxGbLDG_6hTw.png"
categories: ["Machine Learning", "Natural Language Processing", "Data Science"]
author: "Rifx.Online"
tags: ["Mixture-of-Experts", "MoE", "embedding", "MoEE", "BERTopic"]
draft: False

---

### Mixture-of-experts (MoE) LLM 可以作为免费的嵌入模型使用。



我最近发现了一篇有趣的论文，标题为“你的 Mixture-of-Experts LLM 秘密地是一个免费的嵌入模型。”\[1\] 最近的 LLM 架构趋势是解码器模型，这对于嵌入模型并不适用，因为它们的注意力方法。然而，作者揭示了 Mixture-of-Experts (MoE) LLM 可以作为嵌入模型来执行多种嵌入相关的任务，而无需进一步的微调。在这篇博客中，首先让我们回顾一下 MoE，我将介绍它的工作原理及其实际应用。

## 目录

1. 什么是专家混合模型（MoE）？
2. MoE 如何作为嵌入模型工作？
3. 实际实施：使用 BERTopic 利用 MoEE

## 1\. 什么是专家混合模型 (MoE)？

专家混合模型 (MoE) 是一种具有多个子网络的架构，这些子网络被称为“专家”，每个专家专注于不同的任务或数据方面。MoE 的一个优势是，它能够以比相同或更大模型更少的计算量对 AI 模型进行预训练，同时保持或提高质量。因此，如果我们的预算有限，使用 MoE 可以比稠密的、相似大小的传统模型获得更好的模型。在最近的成功案例中，Mixtral 8 x 7B 在许多评估数据集上超越了 LLaMA 2 70B。

接下来，让我们研究 MoE 的架构。最近成功的 MoE 使用了变压器模型，因此我将重点关注变压器的流行 MoE 架构。MoE 主要有两个组件，如下所述。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Dia_c08PJnFeeIc9lxwtGQ.png)

* **MoE 层**

MoE 在变压器架构中用 MoE 层替代了前馈网络 (FFN) 层。每个 MoE 层有一些专家（例如，上图中的 4 个专家），每个专家由简单的 FFN 层组成。请注意，变压器中的其他组件，例如自注意力层，使用相同的权重。因此，MoE 的权重数量并不简单。例如，Mixtral 8 x 7B 的权重不是 8 x 7 = 56B，而是 47B，因为除了 MoE 层之外的其他层共享相同的权重。

* **门控网络**

门控网络或路由器是 MoE 中的一个关键组件。它接收输入标记并为每个标记选择最相关的专家。例如，在上面的插图中，路由器的左侧选择第二个专家来处理单词“more”标记。同时，路由器确定第一个专家来处理单词“Parameters”标记。通常，门控网络选择与给定标记相关的前 k 个专家，并将标记发送给选定的专家；例如，Mixtral 8 x 7B 选择前 2 个专家。

我们如何选择前 k 个专家？我们使用 softmax 函数来计算专家的重要性概率，并保留前 k 个概率专家，如下所示。我提取了上述插图的门控部分。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*qX9H2KKtjntVuiE8yFstMQ.png)

门控网络有其权重。我们将 softmax 函数应用于输入单词标记与门控网络权重之间的点积结果，然后得到专家与给定标记相关的概率。根据概率，我们可以选择前 k 个相关专家。具有这种类型门控网络的 MoE 被称为稀疏 MoE。

这些是理解 MoE 如何作为嵌入模型工作的基本知识。为了进一步理解，我推荐阅读 [这篇博客](https://huggingface.co/blog/moe) \[2]。现在，让我们深入探讨 MoE 实际上是如何作为嵌入模型工作的。

## 2\. MoE 如何作为嵌入模型工作？

### 关于嵌入的快速回顾

在深入本节主题之前，让我们快速回顾一下嵌入。最近，嵌入成为深度学习模型中输入数据的内部表示，它具有语义和浓缩的数据信息。我们通常提取神经网络的最后一个隐藏状态作为嵌入，如下所示。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*kSHFTEejKiSI51taKZCO9A.png)

我们通常使用基于编码器的模型来提取嵌入，因为与仅解码器模型相比，它们能够通过双向注意力捕捉语义。仅解码器模型通常使用因果注意力，只与之前的词元进行交互；因此，它们无法捕捉丰富的语义，如上下文信息，这一点是编码器-解码器模型所能实现的。

### MoE如何作为嵌入模型工作？

人们普遍认为解码器模型无法用于嵌入提取。然而，作者发现MoE中的路由权重为解码器嵌入提供了互补信息。每一层中的路由权重反映了对输入标记的推理选择，因此它包含了输入的语义信息，而隐藏状态的嵌入可能会丢失。在数学公式中，我们可以这样描述它：

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*n6wGCMqAhjBAfLFV47ML1g.png)

*g*是softmax函数，*H*表示隐藏状态。我们将所有MoE层的路由权重进行连接，以避免丢失模型的推理选择。

为了充分利用路由权重和解码器嵌入，作者提出了一种称为MoE嵌入（MoEE）的方法，以形成更全面的嵌入表示。MoEE有两种类型。一种方法是基于连接的组合，具体如下。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*uVmcV-lM83XL7HoYbYjt7w.png)

这种方法很简单，我们只需将路由权重和解码器嵌入进行连接。作者将这种方法称为MoEE(concat)。它可以保留每个路由权重捕获的独特信息，同时允许下游任务利用组合表示。

另一种方法是加权求和集成。它对从路由权重和隐藏状态（HS）嵌入计算的相似性分数进行加权求和，表示为MoEE(sum)。该方法用于比较两个句子的任务，例如语义文本相似性。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*kyJxWW9zdgRyNr2jmO4LlQ.png)

𝛂是一个超参数，用于控制路由权重的贡献。在为每对计算相似性分数后，我们计算计算得出的相似性分数与真实相似性之间的等级相关性，例如斯皮尔曼等级相关性。

在实际使用中，我认为MoEE(concat)易于使用。此外，作者利用PromptEOL技术\[4]来增强MoEE。该技术提示以下模板，以限制LLMs在预测下一个标记的语义信息时的行为。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*S9BASj9JkQe-i4fqmbopWg.png)

现在，这里是MTEB任务的性能表。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*7LxkEMR2DFlncypF6_T7Vw.png)

带有PromptEOL的MoEE可以比监督和自监督方法表现更好。请注意，这个排行榜不是最新的，因此这个结果并不是SOTA。这种方法的价值在于我们可以在嵌入任务中获得不错的结果，并且可以在没有任何进一步训练的情况下使用。

到目前为止，我们已经涵盖了MoEE的工作原理。在下一节中，我们将实现MoEE与BERTopic并对句子进行聚类。

## 3\. 实际实施：利用 MoEE 与 BERTopic

在本节中，我们从预训练的 MoE LLM 中提取嵌入，并使用 20-news-group 数据集 \[5] 与 [BERTopic](https://maartengr.github.io/BERTopic/index.html) 结合。供您参考，BERTopic 是一个便利的主题建模库，超越了传统的统计主题建模。它利用来自 Transformer 的嵌入进行主题聚类，因此我认为它适合用于检查能力。首先，我们来准备一个环境。

### 环境设置

我使用了一个带有 Python 3\.10 的 conda 环境。我在 Ubuntu 20\.04 上进行了实验，使用 cuda 12\.4，16 GB VRAM。下载模型权重可能需要 32 GB RAM。

```python
conda create -n moee python=3.10 -y
conda activate moee
```

接下来，我们需要通过 pip 安装以下库。

```python
pip install transformers torch bitsandbytes bertopic accelerate
```

MoE 模型通常需要较高的 VRAM，因为我们需要提前将整个模型加载到 VRAM 中。因此，我们需要使用 bitsandbytes，这是一个量化包，以节省 VRAM 内存。

我们需要克隆官方 GitHub 仓库。

```python
git clone https://github.com/tianyi-lab/MoE-Embedding.git
```

所有准备工作都完成了。现在，让我们使用 MoEE 实现 BERTopic 的主题聚类。

### 利用 MoEE 和 BERTopic

现在，我们将使用 MoEE 作为 BERTopic 的嵌入模型并尝试主题聚类。原始代码库允许我们使用小型 MoE 模型，例如 Qwen\-1\.5\-MoE\-A2\.7B 或 OLMoE\-1B\-7B。在这篇博客中，我将使用 OLMoE\-1B\-7B，它适合在 16 GB VRAM 上运行推理。首先，我们需要加载 OLMoE\-1B\-7B。

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

接下来，我们需要计算 20\-news\-group 数据集的嵌入，以传递给 BERTopic。（我稍后会附上完整代码。）

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

为了提前计算嵌入，我们使用 torch.utils.data.DataLoader 作为迭代器，并对每个批次的文档进行编码。请注意，我们必须将嵌入作为 np.asarray 类型传递给 BERTopic。

当您想使用自己的 MoE 模型时，必须实现从每个 MoE 层获取路由权重。对于隐藏状态嵌入，我们可以利用 HuggingFace transformer 函数。我们只需在推理时传递 output\_hidden\_states\=True 参数。

现在，我们可以运行主题建模。

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

我们通过默认设置得到了 42 个主题；一些示例如下所示。尽管我随机选择了主题，但它能够很好地捕捉语义。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*VIaKHU-PSuTPzOUKDFbwOw.png)

此外，这里是主题聚类可视化。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*KYAUOe2qEAv-ihq2S2dM0A.png)

请查看主题聚类可视化中的红色圆圈。这个红色圆圈指的是主题 0，与计算机相关。更接近的主题也与机械词汇相关，例如图形、数字和打印机。

这种方法向我们展示了我们可以在没有任何训练的情况下获得良好的嵌入。尽管在质量上仍有提升空间，以达到 SOTA\-监督模型的水平，但本文的发现是进一步改善嵌入提取方法而不进行训练的良好步骤。

这是我的完整代码。您需要将此文件放入 MoE\-Embedding 目录的顶部。

## 参考文献

\[1] Ziyue Li, Tianyi Zhou, [YOUR MIXTURE\-OF\-EXPERTS LLM IS SECRETLY AN EMBEDDING MODEL FOR FREE](https://arxiv.org/pdf/2410.10814) (2024\), *Arxiv*

\[2] Omar S., et.al., [Mixture of Experts Explained](https://huggingface.co/blog/moe) (2023\), Hugging Face

\[3] William Fedus, Barret Zoph., et.al., [Switch Transformers: Scaling to Trillion Parameter Models with Simple and Efficient Sparsity](https://arxiv.org/pdf/2101.03961) (2021\), *Arxiv*

\[4] Ting Jiang, et.al., [Scaling Sentence Embeddings with Large Language Models](https://arxiv.org/pdf/2307.16645) (2023\), *Arxiv*

\[5] [20 News groups](http://qwone.com/~jason/20Newsgroups/)


