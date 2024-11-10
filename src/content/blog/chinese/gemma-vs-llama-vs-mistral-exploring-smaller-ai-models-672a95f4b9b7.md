---
title: "Gemma、Llama 和 Mistral：探索较小的 AI 模型"
meta_title: "Gemma、Llama 和 Mistral：探索较小的 AI 模型"
description: "小规模语言模型的比较研究：评估 Gemma、Llama 3 和 Mistral 在阅读理解任务中的表现"
date: 2024-11-10T22:36:54Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*TJqJ12YQCeYTS5fWOYR5Ig.png"
categories: ["Natural Language Processing", "Machine Learning", "Data Science"]
author: "Rifx.Online"
tags: ["Gemma", "Llama", "Mistral", "SQuAD", "Multi-Query"]
draft: False

---

### 小规模语言模型的比较研究：在阅读理解任务中评估 Gemma、Llama 3 和 Mistral

## 引言

大型语言模型（LLMs）正在快速发展。每个月，新的模型被开发出来，以超越当前市场上的顶尖模型。这种健康的竞争有利于创造新的方法，提高质量和速度。此外，各公司还专注于开发更小的模型，以便使其能够被没有强大计算资源的个人或组织所使用。

就在几周前，苹果公司在其全球开发者大会上推出了Apple Intelligence。这是一套多个生成模型，经过微调以帮助用户撰写和完善文本、优先处理和总结通知、创建图像以及进行应用内操作。在该套件中，苹果公司开发的唯一基础和专有模型是在同一大会上介绍的。它是一个旨在设备上运行的小型模型，其中硬件成为一个重要的限制。在苹果的案例中，该模型是闭源的。我们所知道的是，它是一个约30亿参数的模型，与Gemma、Mistral和Llama 3的7b版本相当（根据苹果分享的结果）。

虽然苹果的新模型令人兴奋，但我们无法测试或重用它。因此，我们更感兴趣的是公开可用的模型，因为开发者和公司可以利用它们来构建新产品和服务。区分开放LLMs和开源LLMs是重要的。从历史上看，开源软件指的是在特定许可证下发布的计算机程序，使源代码可供公众使用或修改。在LLMs中，存在额外的复杂性，包括训练数据和模型权重。因此，开放LLMs通常会披露模型权重和初始代码。另一方面，开源LLM将分享训练过程的每一步，包括训练数据，以及一个宽松的许可证。它应该允许其他人使用、构建和进一步分发该模型。然而，如今发布的大多数模型都属于开放LLMs的范畴，因为例如它们并未发布用于训练的数据库。这种情况适用于谷歌的Gemma、Mistral AI的Mistral和Meta的Llama。

在本文中，我们更仔细地分析Gemma，以了解这些较小模型的区别。Gemma是谷歌最近发布的模型之一。它有两个版本，分别是20亿和70亿参数。因此，它可以在边缘设备上使用，并旨在超越Mistral和Llama 3等最先进的模型。

此外，我们将Gemma、Llama 3和Mistral应用于一个名为SQuAD的阅读理解数据集。LLMs的任务是根据给定的上下文回答特定问题。我们使用定量指标评估它们的性能，例如推理速度和平均回答长度。我们还使用了\[1]提出的相对答案质量（RAQ）框架。RAQ通过根据答案相对于真实答案的准确性对答案进行排名，填补了在特定用例中评估LLMs的空白，从而提供了更细致和实用的模型性能评估。



如往常一样，代码可在我们的[GitHub](https://github.com/zaai-ai/lab)上找到。

## Gemma: Gemini的基础文本模型

谷歌发布了Gemma \[2]，这是基于其强大的闭源模型Gemini \[3]开发的开放LLM。

谷歌发布了预训练和微调的检查点，以促进该模型在新用例中的进一步研究，提供了两种不同的大小：

* 7B模型将被部署并在GPU或TPU上进一步开发。
* 2B模型旨在解决计算限制，并允许在CPU或设备应用程序上使用。

Gemma承诺在与其他大致相同规模的开放模型（如Llama 3 7B或Mistral 7B）相比时，达到最先进的性能。这应该在不同领域中实现，例如问答、常识推理、数学/科学和编码。

## Gemma: 有什么新变化？

Gemma 的架构基于一个仅解码器 \[4] Transformer \[5]，上下文长度为 8192 个标记。让我们来探讨一下为使其更小而采取的方法。

## 多查询注意力

2B模型利用多查询注意力（MQA）显著减少了加载所有查询、键和值头所需的内存资源，而不是使用多头注意力（MHA）方法。MQA通过在注意力层中对多个查询头使用单一的键和值来实现这种内存减少，如图3所示。

虽然这种方法允许Gemma 2B在内存资源较小的设备上部署，但可能导致质量下降和训练不稳定。因此，作者选择在7B版本中使用MHA，遵循与Llama 3相同的方法。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*cgSktHmd_iQeTU4DwWLCPQ.png)

## RoPE 嵌入

Transformers 需要位置嵌入，因为它们本质上是无序不变的。这意味着如果没有位置信息，Transformer 将以相同的方式表示具有相同单词但不同顺序和意义的句子。例如：

> *句子 1:* Gemma 比 Llama 3 更好

> *句子 2:* Llama 3 比 Gemma 更好

位置信息通常使用两个正弦函数（正弦和余弦）来表示。然后，根据位置、标记嵌入维度和模型维度，为序列中的每个位置创建一个独特的位置信息嵌入。

因此，添加位置信息对于使 Transformers 正确处理文本至关重要。原始 Transformer 架构使用**绝对位置嵌入**，其中位置的向量表示被添加到标记的向量表示中。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*cU5a_5-ATKwrQVeka-ViXQ.png)

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*JZLrvgvc7l_52uewCrPSbg.png)

绝对位置嵌入的挑战在于它们并未明确编码标记之间的相对距离。虽然它们使用正弦和余弦函数捕获位置信息，但这些嵌入是针对每个位置独立计算的。这意味着模型并不固有地理解序列中不同位置的接近性或关系重要性。例如，位置 1 和 2 的标记嵌入可能由于正弦函数的性质而看起来相似，但模型并未明确识别这些位置是相邻的。

因此，模型可能无法区分位置 1 和 2 的标记之间的关系与位置 1 和 500 的标记之间的关系。在自然语言处理过程中，句子中相近的单词通常共享更多上下文或具有比远离的单词更强的语义或句法关系。绝对位置嵌入可能无法完全捕获这种细微差别。这可能导致在捕获长程依赖关系或语言的层次结构方面的局限性。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*p-fG2ydLbOhJHjO7Y0LyUw.png)

旋转位置嵌入（RoPE）\[6] 通过对序列中的标记嵌入进行旋转来建模标记的相对位置，从而解决了这个问题。

让我们使用之前的例子，*‘Gemma 比 Llama 更好*，并考虑每个单词作为由 2D 向量表示的标记。单词 *better* 将由根据其位置 *m* 和一个常量角度 θ 从原始向量旋转而来的 2D 向量表示，如图 5 所示。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*nX3llo0cwBIrCQ8Gn21-gg.png)

这种方法保留了标记之间的相对距离，因为旋转变换保持了向量之间的相似性，无论它们在序列中的位置如何。例如，如果我们在原始句子中添加两个单词，使其变为‘*The LLM Gemma 比 Llama 更好*’，则 *better* 和 *than* 的位置从 (3 & 4) 变为 (5 & 6)。然而，由于旋转角度保持一致，这些向量之间的相似性（通过点积测量）保持不变，从而确保了一致的相对位置。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*6cpWPXTexZC8YQbnasHOUg.png)

## GeGLU 激活函数

作者将传统的 ReLU 激活函数替换为一种称为 GeGLU 的门控线性单元（GLU）变体，因为另一项研究 \[7] 表明它改善了 LLM 生成的输出质量。

ReLU 和 GeGLU 之间有两个区别：

1. **激活函数** — GeGLU 使用高斯误差线性单元（GELU）\[8] 函数，与 ReLU 的不同之处在于，它将神经元输入 *x* 乘以正态分布的累积分布函数。在这种情况下，*x* 被丢弃的概率随着 *x* 的减小而增加。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*FXCfQpvdMJXPk5s6AO-RuA.png)

2\. **Sigmoid 激活** — 简单的 ReLU 或 GELU 激活函数应用于隐藏表示 *x* 和两个由两个矩阵 (*W1* 和 *W2*) 表示的线性变换之间。GeGLU 中的门控变体对其中一个组件应用门控机制（sigmoid），如公式 3 所示。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Z9hUjuy4NvQVDrPj6iSfrQ.png)

## Normalizer Location

对原始Transformer架构的最后修改如图8所示。作者对每个transformer子层的输入和输出进行了归一化，以提高训练的稳定性，这与原始论文仅对输出进行归一化的做法相反。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*NQe4ME2MhvRWVzobVdIloA.png)

他们还用RMSNorm \[8]替换了传统的LayerNorm函数。RMSNorm在保持训练稳定性改进的同时，计算上更高效，并有助于模型收敛。

RMSNorm实现了更好的效率，因为其作者证明LayerNorm的好处来自于重新缩放不变性，而不是重新中心化不变性。重新缩放不变性意味着，如果一个常数因子缩放输入，则归一化过程的输出保持不变。换句话说，将所有输入乘以一个常数不会影响归一化输出。重新中心化不变性意味着，如果一个常数值加到所有输入上，则归一化过程的输出保持不变。这意味着将所有输入平移一个常数量不会影响归一化输出。这个发现使得可以去掉计算均值的开销（只需计算标准差），从而使RMSNorm更简单、更高效。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*qblXBo8SCcxzPWePhFVlYg.png)

## Mistral AI vs. Meta vs. Google: Gemma 7B、Llama 3 7B 和 Mistral 7B 的比较

在本节中，我们将 3 个 LLM——Gemma 7B、Mistral 7B 和 Llama 3 7B——进行测试。我们使用一个名为 SQuAD 的问答数据集，遵循 CC BY-SA 4.0 许可证（可以在 [这里](https://huggingface.co/datasets/rajpurkar/squad) 找到）。该数据集是一个阅读理解数据集，包含关于一组维基百科文章的问题。根据上下文，模型应该能够检索到问题的正确答案。对于我们的用例，3 个最重要的字段是：

* `question` - 模型应该回答的问题。
* `context` - 模型需要从中提取答案的背景信息。
* `answers` - 问题的文本答案。

评估过程将包括两个定量指标：

* `words per second` - 评估推理速度。
* `words` - 评估答案的长度。

为了评估模型在我们用例中的准确性，我们使用 RAQ \[1]。RAQ 使用一个独立的 LLM 对所有 LLM 的答案进行排名，基于它们与真实答案的接近程度。

我们首先下载以 `.gguf` 格式提供的模型，以便在 CPU 上运行，并将它们放在 `model/` 文件夹下。

我们使用每个模型的指令版本，并进行了 4 位量化：

* `mistral-7b-instruct-v0.1.Q4_K_M.gguf` 来自 [https://huggingface.co/TheBloke/Mistral\-7B\-Instruct\-v0\.1\-GGUF/tree/main](https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.1-GGUF/tree/main)
* `Meta-Llama-3-8B-Instruct-Q4_K_M.gguf` 来自 [https://huggingface.co/NousResearch/Meta\-Llama\-3\-8B\-Instruct\-GGUF](https://huggingface.co/NousResearch/Meta-Llama-3-8B-Instruct-GGUF)
* `gemma-7b-it-Q4_K_M.gguf` 来自 [https://huggingface.co/rahuldshetty/gemma\-7b\-it\-gguf\-quantized/tree/main](https://huggingface.co/rahuldshetty/gemma-7b-it-gguf-quantized/tree/main)

之后，我们导入所有库和接收我们想要使用的模型作为参数的生成器。

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

该类负责导入在 `config.yaml` 文件中定义的模型参数，具有以下特征：`context_length` 为 1024，`temperature` 为 0.7，`max_tokens` 为 2000\。

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

它还创建了提示模板。该模板有助于在将查询和上下文传递给 LLM 以获取响应之前格式化它们。

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

加载 LLM 后，我们从 HuggingFace 获取 SQuAD 数据集并对其进行洗牌，以确保问题主题的多样性。

```python
squad = load_dataset("squad", split="train")
squad = squad.shuffle()
```

现在，我们可以循环处理 60 个问题和上下文，并记录上述指标。

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

函数 `get_llm_response` 负责接收加载的 LLM、上下文和问题，并返回 LLM 答案以及定量指标。

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

我们可以看到，Llama 3 的速度快于 Mistral 和 Gemma，平均每秒生成约 0.7 个单词，而 Mistral 约为 0.26，Gemma 约为 0.4 个单词。在答案长度方面，Llama 3 也生成比 Mistral 和 Gemma 更长的答案，平均答案长度为 148 个单词，而 Mistral 为 20 个单词，Gemma 为 50 个单词。最后，根据 RAQ，Mistral 的平均排名最好，约为 1.81，其次是 Gemma，平均为 2.05，而 Llama 3 的表现较差，平均排名约为 2.1\。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*GVeFQbMZZ5oUScVEHQPu8A.png)

RAQ 框架还包括统计检验，以了解观察到的差异是否显著。表 1 显示了 Dunn 事后检验的结果，比较不同语言模型的性能。每个单元格表示相应模型之间的性能差异在 5% 显著性水平下是否具有统计显著性。“显著”表示统计上显著的差异（p 值 ≤ 0.05），而“无显著性”表示没有统计上显著的差异（p 值 > 0.05）。对于所选的显著性水平，Dunn 检验结果表明模型之间的性能差异不显著。

```python
p_values = sp.posthoc_dunn([Llama_metrics['rank'], mistral_metrics['rank'], gemma_metrics['rank']], p_adjust='holm')
p_values > 0.05
```

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ftCaagMKAm5RzeATYm_7Ug.png)

定性评估一些示例始终很重要。以下是 3 个模型对问题 *‘Power House Day 在纽黑文的哪一天庆祝？’* 的回答，基于以下上下文：

> ***Context:***‘一个多世纪以来，纽黑文市民一直与常规英国军队一起在殖民民兵中作战，就像在法国和印第安战争中一样。随着美国革命的临近，大卫·伍斯特将军和其他有影响力的居民希望与英国政府的冲突能够在不反叛的情况下解决。在 1775 年 4 月 23 日，这一天在纽黑文仍被庆祝为火药屋日，纽黑文的第二公司，州长的步兵卫队，参与了与统治英国议会的斗争。在本尼迪克特·阿诺德船长的指挥下，他们闯入火药库以武装自己，并开始了为期三天的游行，前往马萨诸塞州的剑桥。其他纽黑文民兵成员在场护送乔治·华盛顿，从他在纽黑文的过夜住宿前往剑桥。来自双方的当代报告都提到了纽黑文志愿者的专业军事风范，包括制服。’

所有 3 个模型都给出了正确答案。虽然 Llama 3 和 Gemma 提供了更完整的答案，但 Mistral 则更加简洁。

> ***Llama 3 answer:***‘纽黑文的火药屋日庆祝于 4 月 23 日。’

> ***Gemma answer:***‘当然！文本中说明了火药屋日庆祝的日期：火药屋日在纽黑文庆祝于 **4 月 23 日**。’

> ***Mistral answer:***’23 April’

## 结论

在设备上的模型为提升用户体验提供了极大的机会，使强大的 LLM 能够在计算资源较低的设备上使用。苹果和谷歌都在积极开发更小、更高效的模型，以满足这一需求，使更多人能够在日常生活中受益于先进的人工智能。

在本文中，我们探讨了谷歌开发的开源 LLM Gemma，它在传统的 Transformer 架构中引入了四个新特性：2B 版本中的多查询注意力、用于位置编码的 RoPE 嵌入、作为激活函数的 GeGLU，以及输入归一化。

我们还将 Gemma 的性能与 Llama 3 和 Mistral 在阅读理解数据集上的表现进行了比较。我们观察到，Gemma 每秒生成的单词数更多，写出的答案比 Mistral 更长，但在这些指标上并未超过 Llama 3。使用 RAQ 框架，我们评估了这三种模型的准确性。尽管数据表明 Mistral 的结果更佳，其次是 Gemma，但差异并不具有统计学意义。因此，我们可以说这三种模型在应用于我们的阅读理解用例时表现相似。

## 参考文献

\[1] Luís Roque, Rafael Guedes. 从研究到生产：相对答案质量（RAQ）与NVIDIA NIM. [https://readmedium.com/research\-to\-production\-relative\-answer\-quality\-raq\-and\-nvidia\-nim\-15ce0c45b3b6](https://readmedium.com/research-to-production-relative-answer-quality-raq-and-nvidia-nim-15ce0c45b3b6), 2024\.

\[2] Gemma Team, Google DeepMind. Gemma：基于Gemini研究和技术的开放模型, 2023\.

\[3] Gemini Team. Gemini：一系列高能力的多模态模型, 2023\.

\[4] Noam Shazeer. 快速Transformer解码：一只写头就足够了. arXiv:1911\.02150, 2019\.

\[5] Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Lukasz Kaiser, Illia Polosukhin. 注意力即一切. arXiv:1706\.03762, 2017\.

\[6] Jianlin Su, Yu Lu, Shengfeng Pan, Ahmed Murtadha, Bo Wen, Yunfeng Liu. RoFormer：带旋转位置嵌入的增强型Transformer. arXiv:2104\.09864, 2021\.

\[7] Noam Shazeer. GLU变体改善Transformer. arXiv:2002\.05202, 2020\.

\[8] Dan Hendrycks, Kevin Gimpel. 高斯误差线性单元（GELUs）. arXiv:1606\.08415, 2016\.

\[9] Biao Zhang, Rico Sennrich. 均方根层归一化. arXiv:1910\.07467, 2019\.


