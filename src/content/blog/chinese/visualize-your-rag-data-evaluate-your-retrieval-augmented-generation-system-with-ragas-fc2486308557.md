---
title: "可视化你的 RAG 数据——使用 Ragas 评估你的检索增强生成系统"
meta_title: "可视化你的 RAG 数据——使用 Ragas 评估你的检索增强生成系统"
description: "如何使用 UMAP 降维对嵌入进行处理以显示多个评估问题及其与源文档的关系……"
date: 2024-11-04T12:35:56Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*peWTe1A-MqeROT_Jdof_Cw.gif"
categories: ["Natural Language Processing", "Generative AI", "Data Science"]
author: "Rifx.Online"
tags: ["RAG", "UMAP", "embeddings", "evaluation", "visualization"]
draft: False

---



### 如何使用 UMAP 降维将嵌入可视化以展示多个评估问题及其与源文档的关系，结合 Ragas、OpenAI、Langchain 和 ChromaDB

检索增强生成（RAG）在 LLM 的工作流程中增加了一个检索步骤，使其能够在回答问题和查询时，从私人文档等额外来源查询相关数据 \[1]。该工作流程不需要对额外文档进行昂贵的训练或微调。文档被拆分成片段，然后进行索引，通常使用紧凑的 ML 生成的向量表示（嵌入）。内容相似的片段在这个嵌入空间中会彼此靠近。

RAG 应用将用户提供的问题投影到嵌入空间，以根据与问题的距离检索相关文档片段。LLM 可以使用检索到的信息来回答查询，并通过呈现片段作为参考来证明其结论。



评估 RAG 应用是具有挑战性的 \[2]。存在不同的方法：一方面，有些方法要求开发者提供答案作为真实值；另一方面，答案（和问题）也可以由另一个 LLM 生成。最大的开源 LLM 支持回答系统之一是 Ragas \[4](检索增强生成评估)，它提供

* 基于文档生成测试数据的方法，以及
* 基于不同指标逐步和端到端评估检索和生成步骤的评估。

在本文中，您将学习

* 如何简要构建一个 Formula One 的 RAG 系统（有关详细描述，请参阅之前的文章 [可视化您的 RAG 数据 — 检索增强生成的 EDA](https://readmedium.com/visualize-your-rag-data-eda-for-retrieval-augmented-generation-0701ee98768f)）
* 生成问题和答案
* 使用 [Ragas](https://github.com/explodinggradients/ragas) 评估 RAG 系统
* 最重要的是，如何使用 [Renumics Spotlight](https://github.com/Renumics/spotlight) 可视化结果并解读结果。

代码可在 Github 上获取。

## 准备你的环境

启动一个笔记本并安装所需的 python 包

```python
!pip install langchain langchain-openai chromadb renumics-spotlight
%env OPENAI_API_KEY=<your-api-key>
```
本教程使用以下 python 包：

* [**Langchain**](https://github.com/langchain-ai/langchain): 一个集成语言模型和 RAG 组件的框架，使设置过程更加顺畅。
* [**Renumics\-Spotlight**](https://github.com/Renumics/spotlight): 一个可视化工具，用于交互式探索非结构化的机器学习数据集。
* [**Ragas**](https://github.com/explodinggradients/ragas): 一个帮助你评估 RAG 管道的框架

*免责声明：本文作者也是 Spotlight 的开发者之一。*

## 为数据集准备文档和嵌入

您可以使用自己的 RAG 应用程序，跳到下一部分了解如何评估、提取和可视化。

或者您可以使用来自[上一篇文章](https://readmedium.com/visualize-your-rag-data-eda-for-retrieval-augmented-generation-0701ee98768f)的 RAG 应用程序，配合[我们准备的所有维基百科 Formula One 文章的数据集](https://spotlightpublic.blob.core.windows.net/docs-data/rag_demo/docs.zip)。您还可以将自己的文档插入到“docs/”子文件夹中。

> 此数据集基于来自[维基百科](https://www.wikipedia.org/)的文章，并根据知识共享署名-相同方式共享许可协议进行许可。原始文章及作者列表可以在相应的维基百科页面中找到。

现在您可以使用 Langchain 的 `DirectoryLoader` 从 docs 子目录加载所有文件，并使用 `RecursiveCharacterTextSpliter` 将文档拆分为片段。通过 `OpenAIEmbeddings`，您可以创建嵌入并将其存储在 `ChromaDB` 中作为向量存储。对于 Chain 本身，您可以使用 LangChains 的 `ChatOpenAI` 和 `ChatPromptTemplate`。

本文的[链接代码](https://github.com/Renumics/rag-demo/blob/main/notebooks/visualize_rag_tutorial_qs.ipynb)包含所有必要步骤，您可以在[上一篇文章](https://readmedium.com/visualize-your-rag-data-eda-for-retrieval-augmented-generation-0701ee98768f)中找到上述所有步骤的详细描述。

一个重要的点是，您应该使用哈希函数为 `ChromaDB` 中的片段创建 ID。这允许在仅拥有文档及其内容和元数据的情况下找到数据库中的嵌入。这使得可以跳过已经存在于数据库中的文档。

```python
import hashlib
import json
from langchain_core.documents import Document

def stable_hash_meta(doc: Document) -> str:
    """
    Stable hash document based on its metadata.
    """
    return hashlib.sha1(json.dumps(doc.metadata, sort_keys=True).encode()).hexdigest()

...
splits = text_splitter.split_documents(docs)
splits_ids = [
    {"doc": split, "id": stable_hash_meta(split.metadata)} for split in splits
]

existing_ids = docs_vectorstore.get()["ids"]
new_splits_ids = [split for split in splits_ids if split["id"] not in existing_ids]

docs_vectorstore.add_documents(
    documents=[split["doc"] for split in new_splits_ids],
    ids=[split["id"] for split in new_splits_ids],
)
docs_vectorstore.persist()
```

## 评估问题

对于像一级方程式这样的常见主题，可以直接使用 ChatGPT 生成一般性问题。本文使用了四种问题生成方法：

* **GPT4**: 使用 ChatGPT 4 生成了 30 个问题，提示为“写 30 个关于一级方程式的问题”
– 随机示例：“哪个一级方程式车队以其跃马标志而闻名？”
* **GPT3\.5:** 使用 ChatGPT 3\.5 生成了另外 199 个问题，提示为“写 100 个关于一级方程式的问题”，并重复“谢谢，再写 100 个吧”
– 示例：“哪位车手在 1950 年赢得了首届一级方程式世界锦标赛？”
* **Ragas\_GPT4**: 使用 Ragas 生成了 113 个问题。Ragas 再次利用文档及其自身的嵌入模型构建一个向量数据库，然后用 GPT4 生成问题。
– 示例：“你能告诉我更多关于乔丹 198 一级方程式赛车在 1998 年世界锦标赛中的表现吗？”
* **Rags\_GPT3\.5**: 使用 Ragas 生成了 226 个额外问题——这里我们使用 GPT3\.5
– 示例：“在 2014 年比利时大奖赛上发生了什么事件导致汉密尔顿退赛？”

```python
from ragas.testset import TestsetGenerator

generator = TestsetGenerator.from_default(
    openai_generator_llm="gpt-3.5-turbo-16k", 
    openai_filter_llm="gpt-3.5-turbo-16k"
)

testset_ragas_gpt35 = generator.generate(docs, 100)
```
问题和答案没有经过审核或修改。所有问题都合并在一个单一的数据框中，包含 `id`、`question`、`ground_truth`、`question_by` 和 `answer` 列。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*R_74K0-_SJXyTxq6ovAcWg.png)

接下来，问题将被提出给 RAG 系统。对于超过 500 个问题，这可能需要一些时间并产生费用。如果逐行询问问题，可以暂停并继续该过程，或者在崩溃后恢复，而不会丢失到目前为止的结果：

```python
for i, row in df_questions_answers.iterrows():
    if row["answer"] is None or pd.isnull(row["answer"]):
        response = rag_chain.invoke(row["question"])

        df_questions_answers.loc[df_questions_answers.index[i], "answer"] = response[
            "answer"
        ]
        df_questions_answers.loc[df_questions_answers.index[i], "source_documents"] = [
            stable_hash_meta(source_document.metadata)
            for source_document in response["source_documents"]
        ]

```
不仅存储了答案，还存储了检索到的文档片段的源 ID 及其文本内容作为上下文：

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*umlKv7Qf9SSLzRslT2r0Qw.png)

此外，还生成并存储了所有问题的嵌入，并将其存储在数据框中。这使得可以将它们与文档一起可视化。

## 使用 Ragas 进行评估

[Ragas](https://github.com/explodinggradients/ragas) 提供了评估您的 RAG 流水线中每个组件的指标，以及整体性能的端到端指标：

1. **上下文精确度：** 使用 `question` 和检索到的 `contexts` 来测量信号与噪声的比率。
2. **上下文相关性：** 测量检索到的上下文与问题的相关性，使用 `question` 和 `contexts` 计算。
3. **上下文召回率：** 基于 `ground truth` 和 `contexts` 检查是否检索到所有与答案相关的信息。
4. **忠实度：** 利用 `contexts` 和 `answer` 来衡量生成答案的事实准确性。
5. **答案相关性：** 使用 `question` 和 `answer` 计算，评估生成的答案与问题的相关性（不考虑事实性）。
6. **答案语义相似度：** 使用 `ground truth` 和 `answer` 进行评估，以判断生成答案与正确答案之间的语义相似性。
7. **答案正确性：** 依赖于 `ground truth` 和 `answer` 来衡量生成答案的准确性和与正确答案的一致性。
8. **方面评估：** 涉及分析 `answer` 以根据预定义或自定义方面（如正确性或有害性）评估提交结果。

目前，我们专注于答案正确性的端到端指标。数据框中的列名和内容已复制并调整，以符合 Ragas API 的命名和格式要求：

```python
## prepare the dataframe for evaluation
df_qa_eval = df_questions_answers.copy()


## adapt the ground truth to the ragas naming and format
df_qa_eval.rename(columns={"ground_truth": "ground_truths"}, inplace=True)
df_qa_eval["ground_truths"] = [
    [gt] if not isinstance(gt, list) else gt for gt in df_qa_eval["ground_truths"]
]
```
这可能需要一些时间，甚至比仅查询您的 RAG 系统花费更多的金钱。让我们逐行应用评估，以便在崩溃后能够恢复而不丢失到目前为止的结果：

```python
## evaluate the answer correctness if not already done
fields = ["question", "answer", "contexts", "ground_truths"]
for i, row in df_qa_eval.iterrows():
    if row["answer_correctness"] is None or pd.isnull(row["answer_correctness"]):
        evaluation_result = evaluate(
            Dataset.from_pandas(df_qa_eval.iloc[i : i + 1][fields]),
            [answer_correctness],
        )
        df_qa_eval.loc[i, "answer_correctness"] = evaluation_result[
            "answer_correctness"
        ]

```
之后，您可以将结果存储在 `df_questions_answer` 数据框中：

```python
df_questions_answers["answer_correctness"] = df_qa_eval["answer_correctness"]
```

## 准备可视化

为了在可视化中包含文档片段，我们添加了从文档到使用该文档作为来源的问题的引用。此外，引用文档的问题数量也被存储：

```python
## Explode 'source_documents' so each document ID is in its own row alongside the question ID
df_questions_exploded = df_qa_eval.explode("source_documents")

## Group by exploded 'source_documents' (document IDs) and aggregate
agg = (
    df_questions_exploded.groupby("source_documents")
    .agg(
        num_questions=("id", "count"),  # Count of questions referencing the document
        question_ids=(
            "id",
            lambda x: list(x),
        ),  # List of question IDs referencing the document
    )
    .reset_index()
    .rename(columns={"source_documents": "id"})
)

## Merge the aggregated information back into df_documents
df_documents_agg = pd.merge(df_docs, agg, on="id", how="left")

## Use apply to replace NaN values with empty lists for 'question_ids'
df_documents_agg["question_ids"] = df_documents_agg["question_ids"].apply(
    lambda x: x if isinstance(x, list) else []
)
## Replace NaN values in 'num_questions' with 0
df_documents_agg["num_questions"] = df_documents_agg["num_questions"].fillna(0)
```
现在将问题的数据框与文档的数据框连接起来

```python
df = pd.concat([df_qa_eval, df_documents_agg], axis=0)
```
此外，让我们准备一些不同的 UMAP \[3] 映射。您可以稍后在 Spotlight GUI 中做类似的事情，但提前做好可以节省时间。

* umap\_all: 对所有文档和问题嵌入应用 fit 和 transform 的 UMAP
* umap\_questions: 仅对问题嵌入应用 fit，并对两者应用 transform 的 UMAP
* umap\_docs: 仅对文档嵌入应用 fit，并对两者应用 transform 的 UMAP

我们像这样准备每个 UMAP 转换：

```python
umap = UMAP(n_neighbors=20, min_dist=0.15, metric="cosine", random_state=42).fit
umap_all = umap.transform(df["embedding"].values.tolist())
df["umap"] = umap_all.tolist()

```
每个文档片段的另一个有趣指标是其嵌入与最近问题的嵌入之间的距离：

```python
question_embeddings = np.array(df[df["question"].notna()]["embedding"].tolist())
df["nearest_question_dist"] = [  # brute force, could be optimized using ChromaDB
    np.min([np.linalg.norm(np.array(doc_emb) - question_embeddings)])
    for doc_emb in df["embedding"].values
]
```
这个指标可以帮助找到未被问题引用的文档。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*YTRUXZmd0iX8kyPIdUUnlg.png)

## 可视化结果

如果您跳过了之前的步骤，您可以下载数据框并使用以下代码加载它：

```python
import pandas as pd
df = pd.read_parquet("df_f1_rag_docs_and_questions.parquet")
```
然后启动 [Renumics Spotlight](https://github.com/Renumics/spotlight) 以可视化它：

```python
from renumics import spotlight

spotlight.show(df)
spotlight.show(
    df,
    layout="/home/markus/Downloads/layout_rag_1.json",
    dtype={x: Embedding for x in df.keys() if "umap" in x},
)
```
这将打开一个新的浏览器窗口：

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*IMbva0pP8RAVhoY4dVbjLg.png)

在左上角，您可以看到一个**所有问题和所有文档**片段的表格。您可以使用“可见列”按钮来控制表格中显示哪些数据框列。直接创建一个选择仅问题的过滤器是很有用的，以便能够在可视化中打开和关闭问题：选择所有问题，然后使用“从选定行创建过滤器”按钮创建过滤器。

在表格的右侧，`answer correctness` **作为一个指标**显示在所有问题中。下面有两个**直方图**；左侧显示了根据不同问题生成方法划分的`answer correctness`的分布。右侧显示了问题生成方法的分布。在这里，如果需要，建议使用过滤按钮为问题创建过滤器，以仅显示选定的行（问题）。

右侧有**两个相似性图**。第一个使用`umap_questions`列，基于仅对问题应用的转换显示问题和文档。这对于独立于相关文档查看问题的分布很有帮助，因为这种方法允许分析师识别问题本身的模式或簇。

第二个相似性图基于仅对文档应用的转换（`umap_docs`）显示问题和文档。它对于在其相关文档的上下文中查看问题很有用。一个同时对问题和文档进行转换的相似性图在问题数量较多时被证明不太有用，因为更多或更少的问题会聚集在一起并倾向于与文档分开。因此，这种表示在这里被省略。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*1wZrAj60hiw1T3RVnCuBtA.png)

### 文档嵌入相似性图：观察

在相似性图 `umap_docs` 中，您可以识别出文档嵌入空间中没有邻近问题的区域。当选择 `nearest_question_dist` 进行着色时，这一点更加明显。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*cMGNPnnBa9Bn7BJ05SzxBw.png)

可以识别出一些簇，包括仅包含标题或逐页包含仅数字的表格数据的片段，这些在拆分过程中其意义丧失。此外，许多不包含相关信息的维基百科特定文本添加，例如指向其他语言的链接或编辑注释，形成了没有邻近问题的簇。

使用维基百科 API 删除维基百科相关文本形式的噪声非常简单。这可能并不是特别必要，因为它主要占用一些空间——预计 RAG 结果不会因此特别恶化。然而，包含在大表格中的数据很难被 RAG 系统捕获，使用先进的预处理方法进行表格提取并将其连接到 RAG 系统可能是有益的。

您可以在 `umap_docs` 相似性图中观察到的另一个点是来自不同来源的问题的分布。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*IH7z3J4yUmU0C_SruxnDkg.png)

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*K4bADgDmSAr5t4t4r9VImQ.png)

由 ChatGPT（GPT-3.5、GPT-4）直接生成的问题位于中心的一个更为封闭的区域，而基于文档生成的 ragas 生成的问题覆盖了更大的区域。

### 答案正确性直方图

直方图可以作为了解数据全球统计的起点。总体而言，在所有问题中，`答案正确性`为0\.45。对于没有使用ragas创建的问题，该值为0\.36，而使用ragas的问题则为0\.52。预计系统在生成使用ragas的问题时表现会更好，因为这些问题是基于可用数据生成的，而ChatGPT直接生成的问题可能来自于ChatGPT训练时使用的所有数据。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*GsLBsg7uwTrw-AzvO4BHmw.png)

对一些问题/答案和真实情况进行快速随机手动审核显示，在`答案正确性`为0\.3–0\.4的区间，大多数问题仍然根据真实情况得到了正确回答。在0\.2–0\.3的区间，存在许多错误答案。在0\.1–0\.2的区间，大多数答案都是错误的。值得注意的是，这个范围内几乎所有的问题都来自GPT\-3\.5。尽管在这个区间内生成的两个问题使用的是GPT\-4，但它们仍然得到了正确的回答，尽管其`答案正确性`低于0\.2。

### 问题嵌入相似性图：观察

问题嵌入相似性图可以通过检查可能导致类似问题的相似问题集群，帮助深入挖掘 `答案正确性`。

* **集群“驱动程序/过程/汽车的术语”：** 平均 `答案正确性` 0\.23：答案通常不够精确。例如，底盘调校与底盘弯曲或刹车调校与刹车偏差调整。是否适合用这些类型的问题来评估系统是值得怀疑的，因为判断答案似乎非常困难。
* **集群“燃料策略的术语”：** 平均 `答案正确性` 0\.44，类似于全球 `答案正确性`。
* **集群“赛道名称”：** 平均 `答案正确性` 0\.49，类似于全球 `答案正确性`。
* **集群“谁保持了…的记录”：** 平均 `答案正确性` 0\.44，类似于全球 `答案正确性`。
* **集群“赢得…锦标赛”：** 平均 `答案正确性` 0\.26 — 看起来很具挑战性。带有许多条件的问题，例如：“谁是唯一一位凭借英国赛车执照、为意大利车队驾驶美国引擎赢得一级方程式世界锦标赛的车手。” 扩展的RAG方法如多查询可能有助于改善这一点。
* **集群“谁是唯一一位赢得…的车手，驾驶编号为\<number\>的汽车”：** 平均 `答案正确性` 0\.23 — 看起来GPT-3\.5在这里懒惰，重复了相同的问题，只是换了不同的数字，尽管大多数真实答案都是错误的！

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Yc03cpSEFlJoZSBPIpMkiQ.png)

## 结论

总之，利用基于 UMAP 的可视化提供了一种有趣的方法，可以深入分析全球指标之外的内容。文档嵌入相似性地图提供了一个良好的概述，展示了相似文档的聚类及其与评估问题的关系。问题相似性地图揭示了模式，使得可以结合质量指标对问题进行区分和分析，从而生成洞察。请参阅可视化结果部分，将可视化应用于您的评估策略——您将发现什么洞察？

*I am a professional with expertise in creating advanced software solutions for the interactive exploration of unstructured data. I write about unstructured data and use powerful visualization tools to analyze and make informed decisions.*

## 参考文献

\[1] Yunfan Gao, Yun Xiong, Xinyu Gao, Kangxiang Jia, Jinliu Pan, Yuxi Bi, Yi Dai, Jiawei Sun, Qianyu Guo, Meng Wang, Haofen Wang: [Retrieval\-Augmented Generation for Large Language Models: A Survey](https://arxiv.org/abs/2312.10997) (2024\), arxiv

\[2] Yixuan Tang, Yi Yang: [MultiHop\-RAG: Benchmarking Retrieval\-Augmented Generation for Multi\-Hop Queries](https://arxiv.org/abs/2401.15391) (2021\), arXiv

\[3] Leland McInnes, John Healy, James Melville: [UMAP: Uniform Manifold Approximation and Projection for Dimension Reduction](https://arxiv.org/abs/1802.03426) (2018\), arXiv

\[4] Shahul Es, Jithin James, Luis Espinosa\-Anke, Steven Schockaert: [RAGAS: Automated Evaluation of Retrieval Augmented Generation](https://arxiv.org/abs/2309.15217) (2023\), arXiv

