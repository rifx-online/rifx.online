---
title: "在构建非英语 RAG 系统时，嵌入为什么很重要 - 多语言嵌入"
meta_title: "在构建非英语 RAG 系统时，嵌入为什么很重要 - 多语言嵌入"
description: "通过对英语与荷兰语多语言模型的详细比较，了解多语言嵌入对 RAG 系统至关重要的原因。"
date: 2024-11-13T01:22:29Z
image: "https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*QvODAYxqisUTrt4V.png"
categories: ["Natural Language Processing", "Machine Learning", "Multilingual"]
author: "Rifx.Online"
tags: ["embeddings", "multilingual", "RAG", "Cohere", "Dutch"]
draft: False

---



## 为什么嵌入是关键

嵌入是现代生成 AI 的基石，默默推动着我们每天互动的许多系统的功能。简单来说，嵌入是 **文本的数值表示** —— 有效地将单词、句子甚至整个文档转换为数字。这些数字远非随机；它们经过精心设计，以捕捉文本中的含义和关系。例如，“dog”和“puppy”的嵌入在数值空间中会更靠近，而“car”的嵌入则会相对较远，反映出它们的 **语义相似性**。将意义编码为可测量的形式的能力，使得嵌入在搜索、推荐系统以及 **检索增强生成 (RAG)** 等高级 AI 应用中不可或缺。



这种数字化转化使 AI 能够以有意义的方式比较和理解文本。当处理大量数据时，尤其是在 RAG 系统中，嵌入变得至关重要。这些系统将嵌入的力量与称为 **向量数据库** 的专用存储解决方案相结合。与传统数据库搜索精确匹配不同，向量数据库经过优化，以根据含义找到最接近的匹配。这种能力使 RAG 系统能够从庞大的知识库中检索出最相关的信息，并用它生成准确、具有上下文的响应。通过桥接原始数据和智能检索，嵌入和向量数据库共同构成了 RAG 系统成功的基础。

## 多语言系统的挑战

构建在英语中表现良好的RAG系统已经是一项复杂的任务，但将其扩展到其他语言则带来了全新的挑战。由于训练数据丰富和语言结构简单，英语嵌入通常经过高度优化。然而，使用这些经过英语训练的嵌入来处理其他语言可能会导致显著的不准确性。不同语言具有其自身的细微差别、语法和文化背景，而主要基于英语文本训练的标准嵌入模型往往无法捕捉这些特征。虽然存在一些多语言嵌入模型来弥补这一差距，但它们在不同语言中的有效性并不相同，尤其是对于那些训练数据有限或具有独特语言特征的语言。这使得构建在非英语语言中与英语一样准确和可靠的RAG系统变得困难。

### 为什么英语嵌入更准确？

1. **高质量训练数据的丰富性**  
英语主导了数字领域，拥有无与伦比的高质量内容可供训练。像维基百科、书籍、研究论文和社交媒体等数据集在英语中要比其他语言丰富得多。相比之下，许多语言，特别是低资源语言，缺乏多样化和标准化的数据集，这限制了在这些语言上训练的嵌入的质量。
2. **模型优化偏见**  
像BERT和GPT这样的NLP模型最初是为英语开发和优化的，通常在多语言版本中仍然优先考虑英语。多语言模型在同一参数空间内平衡多种语言的学习，这可能会稀释对代表性较少的语言的性能，倾向于像英语这样的主导语言。
3. **语言复杂性和多样性**  
与许多其他语言相比，英语的形态相对简单。例如，英语中的词形往往保持一致（例如，“run”和“running”），而像土耳其语或芬兰语这样的语言具有高度的屈折形式，一个根词可能有数十种变化。此外，具有不同语法或词序的语言，如日语（主语-宾语-动词）或阿拉伯语（灵活的词序），对优化为英语结构的模型构成额外挑战。
4. **语义和文化对齐**  
跨语言捕捉语义意义远非简单。单词和短语往往带有细微的含义，无法直接翻译。例如，英语单词“love”在其他语言中有多个文化上独特的对应词（例如，西班牙语中的“amor”，希腊语中的“eros”或“agape”）。未能考虑这些差异的嵌入在多语言对齐方面表现不佳。
5. **基准测试和评估偏见**  
许多基准数据集和评估方法都是以英语为中心设计的。这种以英语为中心的关注可能会人为地提高模型在英语中的感知性能，同时掩盖它们在其他语言中的局限性。

### 对 RAG 系统的影响

当嵌入无法处理其他语言的复杂性时，对 RAG 系统的影响可能是显著的。检索结果往往变得不相关，甚至完全错误，因为嵌入可能难以捕捉非英语查询的细微含义。这不仅影响准确性，还削弱了用户信任和系统的整体实用性。在检索过程中，关键文本片段可能被遗漏，阻止系统获取生成准确且上下文相关的响应所需的信息。

为了使多语言 RAG 系统表现良好，它需要能够在语言之间语义对齐的嵌入，同时考虑到它们独特的结构和文化复杂性。投资高质量的多语言嵌入并对其进行特定语言或任务的微调是至关重要的。这确保了 RAG 系统能够满足任何语言用户的需求——不仅仅是英语。

但不同的嵌入在非英语环境中的表现如何呢？为了解这个问题，我们将使用荷兰数据集比较一个英语嵌入模型和一个多语言嵌入模型。这个测试将揭示不同的嵌入方法如何影响多语言 RAG 系统中的检索准确性和生成响应的质量。

## 比较荷兰语RAG系统的嵌入模型

为了了解不同的嵌入模型如何处理像荷兰语这样的非英语语言，我们将比较在Amazon Bedrock上可用的两个模型：**Cohere Embed English v3**和**Cohere Embed Multilingual v3**。这两个模型代表了对嵌入的不同处理方式——一个专门针对英语进行了优化，另一个则设计用于多语言任务。下表总结了它们的主要属性：

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*pBhIHfOsb-McrjHKvtq4Xw.png)

### 构建嵌入

为了评估嵌入模型的性能，我们将使用 LangChain 框架构建一个本地向量存储。对于此次评估，我们将使用用荷兰语撰写的消防员指南作为我们的数据集。该文档包含技术和程序信息，使其成为非英语语言语义检索的一个现实且具有挑战性的用例。下面是创建本地向量存储和索引文档块的清理和简化代码。我们将使用此设置来测试两个嵌入模型：**Cohere Embed English v3** 和 **Cohere Embed Multilingual v3**。

```python
import os
from langchain_community.document_loaders import DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain_aws import BedrockEmbeddings
import boto3

## Step 1: Load documents
loader = DirectoryLoader('data', glob="**/*.pdf")  # Adjust 'data' to your document directory
documents = loader.load()

print(f"You have {len(documents)} documents")
print(f"Document 1 contains {len(documents[0].page_content)} characters")

## Step 2: Split documents into smaller chunks
text_splitter = RecursiveCharacterTextSplitter(chunk_size=400, chunk_overlap=50)
chunks = text_splitter.split_documents(documents)

print(f"You have {len(chunks)} chunks")
print(f"The first chunk is {len(chunks[0].page_content)} characters long")

## Step 3: Set up Bedrock embeddings
bedrock_client = boto3.client("bedrock-runtime", region_name='us-east-1')
bedrock_embeddings = BedrockEmbeddings(model_id="cohere.embed-multilingual-v3", client=bedrock_client)

## Step 4: Build the FAISS vectorstore
vectorstore = FAISS.from_documents(chunks, bedrock_embeddings)

## Save the vectorstore locally for reuse
vectorstore.save_local("faiss_cohere_multilingual")
```

## 代码如何工作

1. **文档加载**：
代码从 `data` 目录加载所有 PDF 文件。您可以调整文件路径和格式以匹配您的数据集。
2. **文本拆分**：
文档被拆分为每个 400 个字符的小块，重叠 50 个字符，以提高检索的准确性。这确保每个块在上下文上保持有意义。
3. **嵌入模型**：
`BedrockEmbeddings` 类初始化嵌入模型。您可以更改 `model_id` 来测试 **Cohere Embed English v3 或 Cohere Embed Multilingual v3**。
4. **本地向量存储**：
FAISS 库用于从文档块创建内存中的向量存储。这允许快速相似性搜索，并可以本地保存以供重用。

要测试所有模型，请将 `BedrockEmbeddings` 初始化中的 `model_id` 替换为相应的模型：

* `"cohere.embed-english-v3"` 用于 Cohere English。
* `"cohere.embed-multilingual-v3"` 用于 Cohere Multilingual。

### 评估嵌入模型

为了评估嵌入模型的性能，我们将提出问题：**“Welke rangen zijn er bij de brandweer?”**，其翻译为**“消防部门存在哪些等级？”**。选择这个问题是因为我们的文档中仅使用了术语**“hiërarchie”**，在荷兰语中与**“rangen”**具有相似的语义。然而，在英语中，“hierarchy”和“ranks”并没有语义上的相似性。

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*6N3C8C500hMQ3GNNkuu21A.png)

这种区别对我们的测试至关重要。我们预期**Cohere Embed English v3**模型在处理这个查询时会遇到困难，因为它依赖于英语语义，而这些术语并不相关。另一方面，**Cohere Embed Multilingual v3**模型经过训练能够理解荷兰语语义，应该能够从文档中检索到正确的信息，展示其处理非英语语言语义细微差别的能力。

通过提出这个问题，我们旨在突出语义对荷兰RAG系统检索性能的影响。这项测试将清晰地比较模型处理非英语查询和检索相关信息的能力。结果将展示多语言嵌入在非英语环境中实现准确检索的重要性。

要实现和测试这个设置，我们可以使用以下代码。该脚本演示了如何查询向量存储并利用RAG链将嵌入与语言模型结合以回答问题。请注意，在测试不同的嵌入（例如**Cohere Embed English v3**与**Cohere Embed Multilingual v3**）时，您需要确保向量存储是使用相应的嵌入模型构建的。用您想要测试的嵌入模型索引的向量存储替换，以获得准确的结果。

```python
from langchain.prompts import ChatPromptTemplate
from langchain_aws import ChatBedrock
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

instructions = """Je bent een brandweer expert. Beantwoord de vraag, maak gebruik van de context"""

human = """
Dit is de context: {context}
Dit is de vraag: {question}
"""

prompt = ChatPromptTemplate(
    messages=[
        SystemMessagePromptTemplate.from_template(instructions),
        HumanMessagePromptTemplate.from_template(human), #User query will go here
    ],
    input_variables=['context','question'], # context provided by retriever and question by the user
)
model = ChatOpenAI(
    model="gpt-4",  # or "gpt-3.5-turbo" based on your needs
    temperature=0,
    max_tokens=512
)

## Function to merge text chunks
def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)


## RAG chain
rag_chain = (
        {"context": vectorstore.as_retriever(k=10) | format_docs, "question": RunnablePassthrough()}
        | prompt
        | model
        | StrOutputParser()
)

rag_chain.invoke("Welke rangen zijn er bij de brandweer?")
```

## 嵌入模型的结果

为了评估这两个嵌入模型的性能，我们提出了这个问题：**“Welke rangen zijn er bij de brandweer?”**（翻译：“消防部门存在哪些职级？”）。以下是每个模型生成的响应：

### Cohere Embed English v3

**Response**:*“文本没有提供关于消防队内部不同等级的具体信息。然而，在许多消防组织中，有不同的等级，如消防员、 lieutenant、 captain、 battalion chief、 assistant chief 和 fire chief。具体的等级可能因国家和具体组织而异。”*

**Analysis**:该响应是通用的，并没有依赖于荷兰文档提供的上下文。这是可以预期的，因为英语嵌入模型在连接“hiërarchie”（文档中使用）和“rangen”（查询中使用）之间的语义相似性时遇到了困难。因此，它默认使用关于消防部门等级的一般知识。

### Cohere Embed Multilingual v3

**Response**:*“在消防队中有不同的等级。这些等级分为基础框架和中层框架。在基础框架中，我们有 B01 消防员和 B02 下士。在中层框架中，由下士组成，我们有 M01 中士和 M02 副官。这些等级在工作制服、休闲服和干预服上都有标识。”*

**Analysis**:此响应高度相关，并准确地从文档中检索信息。多语言嵌入模型成功识别了“hiërarchie”（上下文）与“rangen”（查询）之间的语义关系。它直接基于文档内容提供了详细的答案，展示了其有效处理荷兰特定语义的能力。

### 关键要点

* **Cohere Embed English v3**：由于查询与文档术语之间缺乏语义对齐，英语模型未能从荷兰文档中检索到相关上下文。这突显了在非英语任务中使用英语特定嵌入的局限性。
* **Cohere Embed Multilingual v3**：多语言模型在此测试中表现出色，从荷兰文档中检索并利用了上下文相关的信息。这表明多语言嵌入在实现准确检索和有效回答非英语查询方面的重要性。

## 结论

本次评估突显了一个对任何构建非英语语言的检索增强生成（RAG）系统的人来说至关重要的见解：**嵌入非常重要**，尤其是在任务要求跨语言细致理解时。Cohere Embed English v3 和 Cohere Embed Multilingual v3 模型在性能上的明显差异说明了英语特定嵌入在非英语环境中的局限性，以及多语言模型的巨大价值。

在回答荷兰语查询时，多语言模型表现出色，能够直接从文档中检索到准确且上下文丰富的信息。与此同时，英语嵌入模型则退回到通用的、不相关的知识，显示出其在查询与文档内容之间弥合语义差距的无能。

对于在全球多语言环境中开发 AI 系统的组织而言，这项测试强化了为手头任务选择合适嵌入模型的重要性。多语言嵌入不仅仅是一个“锦上添花”的特性；它们对于确保非英语应用的准确性、相关性和用户信任至关重要。

随着生成 AI 继续拓展其影响力，通过更好的嵌入来拥抱语言多样性将是提供有意义和有影响力的解决方案的关键。通过优先考虑多语言能力，企业可以创建不仅更智能而且更具包容性的系统——赋能跨语言和文化的用户。

***关注我以获取更多 AI 深度解析！***

[Medium](https://proxy.rifx.online/https://medium.com/@lorevanoudenhove), [Instagram](https://proxy.rifx.online/https://www.instagram.com/lorevanoudenhove.ai/), [YouTube](https://proxy.rifx.online/https://www.youtube.com/channel/UCVyOJS1VV7FxPsStK65pHcA), [Pairrot](https://proxy.rifx.online/https://www.pairrot.eu/)

