---
title: "如何使用 RAG 提高 LLM 成绩"
meta_title: "如何使用 RAG 提高 LLM 成绩"
description: "适合初学者的 Python 代码介绍"
date: 2024-11-04T12:31:55Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*N0Ad_oCIrAyzMYRdH3trqg.png"
categories: ["Natural Language Processing", "Programming", "Generative AI"]
author: "Rifx.Online"
tags: ["RAG", "retrievers", "LlamaIndex", "knowledge", "bases"]
draft: False

---



### 初学者友好的介绍 w/ Python 代码

本文是关于在实践中使用大型语言模型的[更大系列](https://shawhin.medium.com/list/large-language-models-llms-8e009ae3054c)的一部分。在[上一篇文章](https://towardsdatascience.com/qlora-how-to-fine-tune-an-llm-on-a-single-gpu-4e44d6b5be32)中，我们使用 QLoRA 对 Mistral-7b-Instruct 进行了微调，以回应 YouTube 评论。尽管微调后的模型在回应观众反馈时成功捕捉了我的风格，但它对技术问题的回答与我的解释并不匹配。在这里，我将讨论如何通过检索增强生成（即 RAG）来提高 LLM 的性能。



大型语言模型（LLMs）在响应用户查询时展示了存储和部署大量知识的惊人能力。虽然这使得像 ChatGPT 这样的强大 AI 系统得以创建，但以这种方式压缩世界知识有**两个关键限制**。

**首先**，LLM 的知识是静态的，即不会随着新信息的出现而更新。**其次**，LLM 可能对其训练数据中不显著的利基和专业信息缺乏足够的“理解”。这些限制可能导致模型对用户查询的回答不理想（甚至是虚构的）。

我们可以通过**通过专业和可变的知识库增强模型**来缓解这些限制，例如客户常见问题解答、软件文档或产品目录。这使得创建更强大和适应性更强的 AI 系统成为可能。

**检索增强生成**，或称 **RAG**，就是这样一种方法。在这里，我提供 RAG 的高级介绍，并分享使用 LlamaIndex 实现 RAG 系统的示例 Python 代码。

## 什么是 RAG？

LLM 的基本用法是给它一个提示并获取响应。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*sM1p-3FoTaGZunqx918G9A.png)

**RAG 通过在这个基本过程中添加一个步骤来工作**。具体来说，执行一个检索步骤，根据用户的提示，从外部知识库中提取相关信息，并在传递给 LLM 之前将其注入到提示中。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*EhJZj1blu7a8EPmVAPsNcA.png)

## 我们为什么关心

请注意，RAG 并没有从根本上改变我们使用 LLM 的方式；它仍然是 *提示输入和响应输出*。RAG 只是增强了这个过程（因此得名）。

这使得 **RAG 成为一种灵活且（相对）简单的方式来改善基于 LLM 的系统**。此外，由于知识存储在外部数据库中，更新系统知识就像从表中添加或删除记录一样简单。

### 为什么不进行微调？

本系列之前的文章讨论了[微调](https://towardsdatascience.com/fine-tuning-large-language-models-llms-23473d763b91)，即为特定用例调整现有模型。虽然这是一种赋予LLM专业知识的替代方法，但从经验来看，**微调似乎在这方面的效果不如RAG** \[1]。

## 它是如何工作的

RAG 系统有两个关键要素：**检索器**和 **知识库**。

### Retriever

检索器接收用户提示并从知识库中返回相关项目。这通常使用所谓的 **文本嵌入**，即文本在概念空间中的数值表示。换句话说，这些是 **表示给定文本的 *含义* 的数字**。

文本嵌入可以用来计算用户查询与知识库中每个项目之间的相似性得分。这个过程的结果是 **每个项目与输入查询相关性的排名**。

然后，检索器可以选择前 k 个（例如 k=3）最相关的项目，并将它们注入到用户提示中。这个增强的提示随后被传递给 LLM 进行生成。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*jpTwdBmoTlJlfPAm0oJiVQ.png)

### 知识库

RAG 系统的下一个关键要素是知识库。这个 **包含了您希望提供给 LLM 的所有信息**。虽然有无数种方法可以构建 RAG 的知识库，但在这里我将重点介绍如何从一组文档中构建一个知识库。

这个过程可以分为 **4 个关键步骤** \[2,3].

1. **加载文档** — 这包括收集一组文档并确保它们处于可解析的格式（稍后会详细介绍）。
2. **分块文档—**由于 LLM 的上下文窗口有限，文档必须被拆分成更小的块 **（例如，** 256 或 512 个字符长）。
3. **嵌入块** — 使用文本嵌入模型将每个块转换为数字。
4. **加载到向量数据库**— 将文本嵌入加载到数据库（即向量数据库）中。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*VWG6Tr0OxCnD5Mvygm5DCA.png)

## 一些细微差别

虽然构建 RAG 系统的步骤在概念上很简单，但一些细微差别可能使得在现实世界中构建一个系统变得更加复杂。

**文档准备**—RAG 系统的质量取决于从源文档中提取有用信息的能力。例如，如果一个文档格式混乱，充满了图像和表格，那么解析起来会比一个格式良好的文本文件更困难。

**选择合适的块大小**—我们已经提到由于 LLM 上下文窗口的需要进行分块。然而，还有 2 个额外的分块动机。

**首先**，它可以降低（计算）成本。你在提示中注入的文本越多，生成完成所需的计算就越多。**第二**是性能。特定查询的相关信息往往集中在源文档中（通常仅一句话就可以回答一个问题）。分块有助于最小化传递给模型的无关信息的数量 \[4\]。

**改善搜索** — 虽然文本嵌入提供了一种强大且快速的搜索方式，但它并不总是能如人所愿地工作。换句话说，它可能返回与用户查询“相似”的结果，但对回答问题并没有帮助，例如，“*洛杉矶的天气怎么样？*”可能返回“*纽约的天气怎么样？*”。

缓解这一问题的最简单方法是通过良好的文档准备和分块。然而，对于某些用例，可能需要额外的策略来改善搜索，例如为每个块使用 **元标签**、采用结合关键词和嵌入搜索的 **混合搜索**，或使用 **重排序器**，这是一种专门计算两段文本相似性的模型。

## 示例代码：使用 RAG 改进 YouTube 评论响应器

在对 RAG 工作原理有基本了解后，让我们看看如何在实践中使用它。我将基于 [上一篇文章](https://towardsdatascience.com/qlora-how-to-fine-tune-an-llm-on-a-single-gpu-4e44d6b5be32) 中的示例，在其中我使用 QLoRA 对 Mistral-7B-Instruct 进行了微调，以响应 YouTube 评论。我们将使用 LlamaIndex 为之前微调的模型添加 RAG 系统。

示例代码可在 [Colab Notebook](https://colab.research.google.com/drive/1peJukr-9E1zCo1iAalbgDPJmNMydvQms?usp=sharing) 中免费获得，该 Notebook 可以在提供的（免费）T4 GPU 上运行。此示例的源文件可在 [GitHub 仓库](https://github.com/ShawhinT/YouTube-Blog/tree/main/LLMs/rag) 中找到。

🔗 [Google Colab](https://colab.research.google.com/drive/1peJukr-9E1zCo1iAalbgDPJmNMydvQms?usp=sharing) \| [GitHub Repo](https://github.com/ShawhinT/YouTube-Blog/tree/main/LLMs/rag)

### 导入

我们首先安装并导入必要的 Python 库。

```python
!pip install llama-index
!pip install llama-index-embeddings-huggingface
!pip install peft
!pip install auto-gptq
!pip install optimum
!pip install bitsandbytes
## 如果不是在 Colab 上运行，请确保也安装 transformers
```

```python
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core import Settings, SimpleDirectoryReader, VectorStoreIndex
from llama_index.core.retrievers import VectorIndexRetriever
from llama_index.core.query_engine import RetrieverQueryEngine
from llama_index.core.postprocessor import SimilarityPostprocessor
```

### 设置知识库

我们可以通过定义我们的嵌入模型、块大小和块重叠来配置我们的知识库。在这里，我们使用来自BAAI的\~33M参数[bge-small-en-v1.5](https://huggingface.co/BAAI/bge-small-en-v1.5)嵌入模型，该模型可在Hugging Face hub上获取。其他嵌入模型选项可以在这个[text embedding leaderboard](https://huggingface.co/spaces/mteb/leaderboard)上找到。

```python
## import any embedding model on HF hub
Settings.embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")

Settings.llm = None # we won't use LlamaIndex to set up LLM
Settings.chunk_size = 256
Settings.chunk_overlap = 25
```
接下来，我们加载源文档。在这里，我有一个名为“[*articles*](https://github.com/ShawhinT/YouTube-Blog/tree/main/LLMs/rag/articles)”的文件夹，其中包含我在[fat tails](https://towardsdatascience.com/pareto-power-laws-and-fat-tails-0355a187ee6a)上写的3篇Medium文章的PDF版本。如果在Colab中运行，您必须从[GitHub repo](https://github.com/ShawhinT/YouTube-Blog/tree/main/LLMs/rag)下载文章文件夹并手动上传到您的Colab环境。

对于该文件夹中的每个文件，下面的函数将从PDF中读取文本，将其拆分成块（基于之前定义的设置），并将每个块存储在名为*documents*的列表中。

```python
documents = SimpleDirectoryReader("articles").load_data()
```
由于这些博客是直接从Medium下载为PDF的，因此它们更像是网页，而不是格式良好的文章。因此，一些块可能包含与文章无关的文本，例如网页标题和Medium文章推荐。

在下面的代码块中，我对documents中的块进行精炼，删除文章主体前后的大部分块。

```python
print(len(documents)) # prints: 71
for doc in documents:
    if "Member-only story" in doc.text:
        documents.remove(doc)
        continue

    if "The Data Entrepreneurs" in doc.text:
        documents.remove(doc)

    if " min read" in doc.text:
        documents.remove(doc)

print(len(documents)) # prints: 61
```
最后，我们可以将精炼后的块存储在向量数据库中。

```python
index = VectorStoreIndex.from_documents(documents)
```

### 设置检索器

在我们的知识库建立之后，我们可以使用 LlamaIndex 的 *VectorIndexRetriever()* 创建一个检索器，它返回与用户查询最相似的 3 个块。

```python
## set number of docs to retreive
top_k = 3

## configure retriever
retriever = VectorIndexRetriever(
    index=index,
    similarity_top_k=top_k,
)
```
接下来，我们定义一个查询引擎，使用检索器和查询返回一组相关的块。

```python
## assemble query engine
query_engine = RetrieverQueryEngine(
    retriever=retriever,
    node_postprocessors=[SimilarityPostprocessor(similarity_cutoff=0.5)],
)
```

### 使用查询引擎

现在，随着我们的知识库和检索系统的建立，让我们使用它来返回与查询相关的内容。在这里，我们将传递我们向ShawGPT（YouTube评论回复者）提出的相同技术问题，来自[上一篇文章](https://readmedium.com/qlora-how-to-fine-tune-an-llm-on-a-single-gpu-4e44d6b5be32)。

```python
query = "What is fat-tailedness?"
response = query_engine.query(query)
```
查询引擎返回一个响应对象，其中包含文本、元数据和相关块的索引。下面的代码块返回该信息的更易读版本。

```python
## reformat response
context = "Context:\n"
for i in range(top_k):
    context = context + response.source_nodes[i].text + "\n\n"

print(context)
```

```python
Context:
Some of the controversy might be explained by the observation that log-
normal distributions behave like Gaussian for low sigma and like Power Law
at high sigma [2].
However, to avoid controversy, we can depart (for now) from whether some
given data fits a Power Law or not and focus instead on fat tails.
Fat-tailedness — measuring the space between Mediocristan
and Extremistan
Fat Tails are a more general idea than Pareto and Power Law distributions.
One way we can think about it is that “fat-tailedness” is the degree to which
rare events drive the aggregate statistics of a distribution. From this point of
view, fat-tailedness lives on a spectrum from not fat-tailed (i.e. a Gaussian) to
very fat-tailed (i.e. Pareto 80 – 20).
This maps directly to the idea of Mediocristan vs Extremistan discussed
earlier. The image below visualizes different distributions across this
conceptual landscape [2].

print("mean kappa_1n = " + str(np.mean(kappa_dict[filename])))
    print("")
Mean κ (1,100) values from 1000 runs for each dataset. Image by author.
These more stable results indicate Medium followers are the most fat-tailed,
followed by LinkedIn Impressions and YouTube earnings.
Note: One can compare these values to Table III in ref [3] to better understand each
κ value. Namely, these values are comparable to a Pareto distribution with α
between 2 and 3.
Although each heuristic told a slightly different story, all signs point toward
Medium followers gained being the most fat-tailed of the 3 datasets.
Conclusion
While binary labeling data as fat-tailed (or not) may be tempting, fat-
tailedness lives on a spectrum. Here, we broke down 4 heuristics for
quantifying how fat-tailed data are.

Pareto, Power Laws, and Fat Tails
What they don’t teach you in statistics
towardsdatascience.com
Although Pareto (and more generally power law) distributions give us a
salient example of fat tails, this is a more general notion that lives on a
spectrum ranging from thin-tailed (i.e. a Gaussian) to very fat-tailed (i.e.
Pareto 80 – 20).
The spectrum of Fat-tailedness. Image by author.
This view of fat-tailedness provides us with a more flexible and precise way of
categorizing data than simply labeling it as a Power Law (or not). However,
this begs the question: how do we define fat-tailedness?
4 Ways to Quantify Fat Tails
```

### 将 RAG 添加到 LLM

我们首先从 Hugging Face hub 下载 [微调模型](https://readmedium.com/qlora-how-to-fine-tune-an-llm-on-a-single-gpu-4e44d6b5be32)。

```python
## load fine-tuned model from hub
from peft import PeftModel, PeftConfig
from transformers import AutoModelForCausalLM, AutoTokenizer

model_name = "TheBloke/Mistral-7B-Instruct-v0.2-GPTQ"
model = AutoModelForCausalLM.from_pretrained(model_name,
                                             device_map="auto",
                                             trust_remote_code=False,
                                             revision="main")

config = PeftConfig.from_pretrained("shawhin/shawgpt-ft")
model = PeftModel.from_pretrained(model, "shawhin/shawgpt-ft")

## load tokenizer
tokenizer = AutoTokenizer.from_pretrained(model_name, use_fast=True)
```
作为基线，我们可以观察模型在没有任何文章上下文的情况下如何回应技术问题。为此，我们使用 lambda 函数创建一个提示模板，该函数接受观众评论并返回 LLM 的提示。有关此提示来源的更多详细信息，请参见本系列的 [上一篇文章](https://towardsdatascience.com/qlora-how-to-fine-tune-an-llm-on-a-single-gpu-4e44d6b5be32#5aad)。

```python
## prompt (no context)
intstructions_string = f"""ShawGPT, functioning as a virtual data science \
consultant on YouTube, communicates in clear, accessible language, escalating \
to technical depth upon request. It reacts to feedback aptly and ends \
responses with its signature '–ShawGPT'.

ShawGPT will tailor the length of its responses to match the viewer's comment, \
providing concise acknowledgments to brief expressions of gratitude or \
feedback, thus keeping the interaction natural and engaging.

Please respond to the following comment.
"""

prompt_template = lambda comment: f'''[INST] {intstructions_string} \n{comment} \n[/INST]'''
comment = "What is fat-tailedness?"

prompt = prompt_template(comment)
print(prompt)
```

```python
[INST] ShawGPT, functioning as a virtual data science consultant on YouTube, communicates in clear, accessible language, escalating to technical depth upon request. It reacts to feedback aptly and ends responses with its signature '–ShawGPT'. ShawGPT will tailor the length of its responses to match the viewer's comment, providing concise acknowledgments to brief expressions of gratitude or feedback, thus keeping the interaction natural and engaging.

Please respond to the following comment.
 
What is fat-tailedness? 
[/INST]
```
接下来，我们可以使用以下代码将此提示传递给模型。

```python
model.eval()

inputs = tokenizer(prompt, return_tensors="pt")
outputs = model.generate(input_ids=inputs["input_ids"].to("cuda"), 
                          max_new_tokens=280)

print(tokenizer.batch_decode(outputs)[0])
```
这是模型的响应（没有上下文）。

```python
Great question!

Fat-tailedness is a statistical property of a distribution. In simple terms, 
it refers to the presence of extreme outliers or heavy tails in the 
distribution.

For instance, consider the distribution of heights in a population. A normal 
distribution would have most people clustered around an average height with a 
few people deviating slightly from the mean. However, in a fat-tailed 
distribution, you would observe a larger number of people being significantly 
taller or shorter than the average.

In finance, fat-tailedness is often used to describe the presence of extreme 
market moves or outliers in financial returns. It's an important concept in 
risk management and financial modeling.

I hope this explanation helps! Let me know if you have any questions.
–ShawGPT
```
虽然响应的风格和格式都很好，但模型对 fat-tailedness 的解释与我在我的 [视频](https://www.youtube.com/playlist?list=PLz-ep5RbHosVrT89BRNX-IGKHYxvx9wqi) 和 [博客系列](https://towardsdatascience.com/pareto-power-laws-and-fat-tails-0355a187ee6a) 中定义的有所不同。

让我们看看当我们包含适当的上下文时模型的响应会发生什么。为此，我们创建另一个提示模板，该模板也可以从 RAG 系统中获取上下文。

```python
## prompt (with context)
prompt_template_w_context = lambda context, comment: f"""[INST]ShawGPT, functioning as a virtual data science consultant on YouTube, communicates in clear, accessible language, escalating to technical depth upon request. \
It reacts to feedback aptly and ends responses with its signature '–ShawGPT'. \
ShawGPT will tailor the length of its responses to match the viewer's comment, providing concise acknowledgments to brief expressions of gratitude or feedback, \
thus keeping the interaction natural and engaging.

{context}
Please respond to the following comment. Use the context above if it is helpful.

{comment}
[/INST]
"""
```
接下来，我们将查询引擎中的上下文和观众评论传递给模型。

```python
prompt = prompt_template_w_context(context, comment)

inputs = tokenizer(prompt, return_tensors="pt")
outputs = model.generate(input_ids=inputs["input_ids"].to("cuda"), max_new_tokens=280)

print(tokenizer.batch_decode(outputs)[0])
```
这是新的响应（带上下文）。

```python
Great question!

Fat-tailedness is a property of a distribution that describes how much the 
presence of extreme values (rare events) affects the overall statistics of the 
distribution.

In the context of the video, the author discusses how Mediocristan and 
Extremistan distributions differ in terms of fat-tailedness. Mediocristan 
distributions have a relatively small impact from extreme values, while 
Extremistan distributions are heavily influenced by extreme values.

The author also mentions that fat-tailedness is a more general concept than 
specific distributions like Pareto or Power Laws. Instead, it lives on a 
spectrum ranging from thin-tailed (Gaussian) to very fat-tailed (Pareto 80-20).

I hope that helps clarify things a bit! Let me know if you have any questions.
–ShawGPT
```
这比没有上下文的响应更好地捕捉了我对 fat tails 的解释，并且甚至提到了 Mediocristan 和 Extremistan 的细分概念。

## 接下来是什么？

在这里，我为初学者提供了一个关于 RAG 的友好介绍，并分享了如何使用 LlamaIndex 实现它的具体示例。RAG 使我们能够通过可更新和特定领域的知识来改善 LLM 系统。

虽然最近的 AI 热潮主要集中在构建 AI 助手上，但一个强大的（但不那么流行的）创新来自于文本嵌入（即我们用来进行检索的东西）。在本系列的下一篇文章中，我将更详细地探讨 **文本嵌入**，包括它们如何用于 **语义搜索** 和 **分类任务**。

**更多关于 LLM 的内容 👇**

## 资源

**连接**: [我的网站](https://shawhintalebi.com/) \| [预约电话](https://calendly.com/shawhintalebi)

**社交**: [YouTube 🎥](https://www.youtube.com/channel/UCa9gErQ9AE5jT2DZLjXBIdA) \| [LinkedIn](https://www.linkedin.com/in/shawhintalebi/) \| [Instagram](https://www.instagram.com/shawhintalebi)

**支持**: [请我喝杯咖啡](https://www.buymeacoffee.com/shawhint) ☕️

\[1] [RAG \> FT (经验性)](https://github.com/openai/openai-cookbook/blob/main/examples/Question_answering_using_embeddings.ipynb)

\[2] [LlamaIndex 网络研讨会：为生产构建 LLM 应用程序，第一部分（与 Anyscale 联合主持）](https://www.youtube.com/watch?v=efbn-3tPI_M)

\[3] [LlamaIndex 文档](https://docs.llamaindex.ai/en/stable/understanding/loading/loading.html)

\[4] [LlamaIndex 网络研讨会：使 RAG 准备好生产](https://www.youtube.com/watch?v=Zj5RCweUHIk&list=WL&index=4)

