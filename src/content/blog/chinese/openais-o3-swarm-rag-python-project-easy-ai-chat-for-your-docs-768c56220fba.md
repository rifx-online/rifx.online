---
title: "巧用OpenAI o3和Swarm，打造多元化聊天机器人！你准备好迎接高效智能沟通了吗？"
meta_title: "巧用OpenAI o3和Swarm，打造多元化聊天机器人！你准备好迎接高效智能沟通了吗？"
description: "OpenAI推出的o3系列模型在推理能力上超越了以往的AI模型，特别是在ARC-AGI基准测试中取得了87.5%的高分。Swarm框架则提供了一种轻量级的方式，支持多智能体系统的开发，使得构建复杂任务的AI聊天机器人变得更加简单和高效。通过结合o3模型和Swarm框架，用户可以创建强大的代理聊天功能，适用于各种商业和个人应用。"
date: 2024-12-30T03:24:30Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*4JYFbwMYlpVWIe0elfyXrQ.png"
categories: ["Chatbots", "Programming/Scripting", "Machine Learning"]
author: "Rifx.Online"
tags: ["o3", "Swarm", "RAG", "ARC-AGI", "chatbot"]
draft: False

---



在这个故事中，我将为您提供一个超级快速的教程，展示如何使用Swarm、RAG和OpenAI的o3创建一个多智能体聊天机器人，为您的商业或个人使用提供强大的代理聊天功能。

近年来，随着AI技术的发展，多个AI智能体协作完成任务的“多智能体系统”引起了广泛关注。

大型语言模型（LLMs）就像能够独立思考的人脑，而AI智能体是进一步与环境互动、制定计划并最终执行任务的系统。与LLMs相比，AI智能体不仅告诉您该做什么，还帮助您执行。

出现了一种大型模型，它不仅能够推理，还能清晰地展示其自身的“推理逻辑”。

刚刚，OpenAI迎来了年终AI春晚的高潮。

此次发布的o3系列模型是o1的迭代版本。考虑到与英国电信运营商O2可能存在的版权或商标冲突，OpenAI决定跳过“o2”命名，直接采用“o3”。

OpenAI宣布了其最新的推理模型“o3”和“o3-mini”，在AI行业引起了震动。在ARC-AGI基准测试中，o3取得了惊人的87.5%的得分，超过了人类平均得分85%。此外，o3-mini针对编码进行了优化，实现了低成本和快速性能。这些模型在复杂推理任务中表现优于传统AI模型，并设定了安全性的新标准。

Swarm是一个轻量级的实验框架，旨在支持多智能体系统的开发。与传统方法严重依赖底层大型语言模型（LLM）API不同，它提供了一种无状态的抽象，用于管理多个智能体之间的交互和交接。

那么，让我给您快速演示一个实时聊天机器人，来展示我的意思。

让我问一个简单的问题：我如何知道我当前的财务状况？如果您查看Swarm智能体生成的输出，您会看到我已经将文件路径传递给PyPDFLoader以加载PDF，提取内容，然后使用RecursiveCharacterTextSplitter将其拆分为更小的块。这些块通过OpenAIEmbeddings转换为向量表示，并存储在Chroma向量存储中以便于检索。

创建了一个函数`retrieve_and_generate_Finance`，用于获取相关文档并生成财务相关查询的答案，而`retrieve_and_generate_sports`处理与体育相关的问题。

两个智能体`Finance_agent`和`sports_agent`负责回答各自领域的查询。一个`central_agent`根据查询内容将问题路由到财务或体育智能体，交接函数指导转移。

使用Swarm客户端与智能体进行交互，演示`central_agent`如何将财务相关查询路由到财务智能体，展示智能体的功能或生成的响应。

在这个故事中，我将为您概述OpenAI的o3，解释Swarm是什么，它的特点，为什么我们使用Swarm，以及如何将所有这些技术结合起来创建一个强大的聊天机器人。

## 什么是 o3

o3 是由 OpenAI 开发的一个专注于推理的 AI 模型。大多数传统的 AI 模型通常只在特定任务或已学习知识的范围内运作。

然而，o3 超越了这一框架，旨在能够像人类一样灵活应对未知任务和复杂问题。

o3 系列包括两个重量级模型：

* OpenAI o3：旗舰版本，性能强大
* OpenAI o3 mini：一个轻量级模型，速度更快，成本更低，更具性价比

不要太高兴，因为 o3 系列目前尚未向普通用户开放。OpenAI 计划首先开放外部安全测试申请，官方发布预计在明年一月。

## OpenAI o3 的主要特性

特别值得注意的是，o3 在“ARC\-AGI”基准测试中取得了惊人的成绩，该测试旨在 **成为通往 AGI 的北极星。**

ARC\-AGI 是一项极具挑战性的测试，衡量 AI 解决“从未见过的问题”能力的程度，换句话说，评估其“人类水平的推理能力”。

之前的 GPT 系列模型在该测试中的得分没有改善。GPT\-3 和 GPT\-4o 仅小幅提升，GPT\-4o 提升约 5%。

然而，o3 在推理数量较少的情况下（所谓的“低计算”模式）取得了 75\.7% 的得分，并在“高计算”模式下达到了 **87\.5%，该模式使用了更大量的计算资源。**

这个数字超过了人类的平均表现（约 85%），标志着 AI 超越人类潜力的重要里程碑。

过去，人们广泛指出，仅仅增大 AI 的规模不足以应对真正的新问题，但 o3 采用的新架构使得“语言程序探索和执行”成为可能，这被认为产生了重大影响。

## 什么是Swarm？

Swarm是一个用于协调多个AI代理以执行复杂任务的框架。

它的关键词是“轻量级”、“符合人体工程学”和“实验性”。它旨在以最小的抽象来构建和编排代理，使用户能够轻松地构建和实验多代理系统，而无需复杂的配置。

Swarm通过将复杂问题分解为较小的任务，并将每个任务分配给专门的代理，从而实现高效的问题解决。

## 1\.2 Swarm功能

* **轻量级和人性化设计：** 简单的界面和最小的抽象使得构建多智能体系统变得容易。它直观且不需要复杂的配置或样板代码。
* **高度控制和可测试性：** Swarm 允许您对智能体行为进行细粒度的控制和可测试性，使您能够自定义每个智能体的角色和能力，并微调系统整体的行为。
* **可扩展性和灵活性：** 该系统可以通过根据需要添加更多智能体来轻松扩展。每个智能体可以专门用于特定任务，从而有效处理复杂问题。
* **交接和例程：** Swarm 的核心概念是“交接”和“例程”。例程定义了智能体的行为，而交接管理智能体之间的控制转移，允许多个智能体协同工作以处理复杂任务。
* **客户端执行：** Swarm 在客户端运行，不同于 OpenAI 的 Assistants API (o1-preview/mini)，这意味着您对 Swarm 的行为有完全的控制权，并且可以清楚了解其状态和正在执行的操作，这对于调试和理解系统行为非常有用。

**为什么使用 Swarm？**

Swarm 的设计旨在轻量、可扩展且高度可定制。当许多独立功能和指令难以编码为单个提示时，它的表现最佳。

如果您正在寻找完全托管的线程以及内置的内存管理和检索，Assistants API 是一个不错的选择。但如果您希望对上下文、步骤和工具调用拥有完全透明度和细粒度的控制，Swarm 是最佳选择。Swarm 几乎完全在客户端运行，并且与 Chat Completions API 类似，不会在调用之间存储状态。

团队还演示了一个应用示例，包括一个天气查询智能体、一个用于处理航空公司不同客户服务请求的多智能体设置、一个客户服务机器人、一个可以帮助处理销售和退款的个人智能体等。具体示例可以在 Swarm 代码库中找到。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*xrJN4llbhf-MRG7N5nh5zQ.png)

## 开始编码：

让我们开始吧，您需要下载几个不同的 Python 库，即 langchain\_community、langchain\-openai、langchain\-chroma 和 PyMuPDF，如果您还没有克隆 GitHub 仓库，可以直接输入：

```python
pip install -r requirements.txt
```

完成后，让我们转到一个 Python 文件，我们将使用 Langchain\_community、Langchain\_openai、langchain\_core 和 swarm 来结合执行代码所需的指令和代理。

```python
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from swarm import Swarm, Agent
from langchain_chroma import Chroma
from langchain_openai import ChatOpenAI
from langchain_openai import OpenAIEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain.schema.runnable import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
import os
```

让我们处理 PDF 文件，使其可搜索，使用嵌入和向量存储。我使用 PyPDFLoader 从指定的文件路径加载 PDF，将其内容提取到 docs 中，其中每个元素对应于一页或一个部分，并打印加载的文档数量。之后，它使用 `RecursiveCharacterTextSplitter` 将文档拆分为更小、可管理的块，每个块大约 1,000 个字符，重叠 200 个字符以保持上下文。然后，它设置 `OpenAIEmbeddings` 模型（`text-embedding-ada-002`）将文本转换为向量表示。这些向量通过 `Chroma.from_documents` 保存，数据存储在一个文件夹（`./chroma_db`）中，以便后续轻松访问。最后，它从向量存储创建一个检索器。

```python
os.environ["OPENAI_API_KEY"] =
loader = PyPDFLoader("Your path")
docs = loader.load()
print(f"从文件加载了 {len(docs)} 个文档。")

## 将文档拆分为块
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
splits = text_splitter.split_documents(docs)
print(f"将文档拆分为 {len(splits)} 个块。")

gemini_embeddings = OpenAIEmbeddings(model='text-embedding-ada-002')


## 保存到磁盘
vectorstore = Chroma.from_documents(
                     documents=docs,                 # 数据
                     embedding=gemini_embeddings,    # 嵌入模型
                     persist_directory="./chroma_db" # 保存数据的目录
                     )

retriever = vectorstore.as_retriever()
print("向量存储已创建并持久化到 './chroma_db'")
```

OpenAI 尚未发布 o3 模型，但一旦模型发布，我会更新该模型。并且可以轻松将模型名称更改为 ‘o3\-mini’。

```python
llm = ChatOpenAI(model="o1-preview",
                 temperature=1, top_p=0.85)
```

我们创建一个名为 retrieve\_and\_generate\_Finance 的函数，该函数接受一个问题，检索相关文档，并根据这些文档生成答案。它使用模板将上下文和问题格式化为提示。`docs2str(docs)` 函数将检索到的文档转换为字符串，打印其内容。RAG 链结合了检索器、`docs2str` 问题和 OpenAI 以生成响应。

```python
def retrieve_and_generate_Finance(question):
    print("调用 retrieve_and_generate_Finance")
    template = """仅根据以下上下文回答问题：
    {context}
    问题：{question}
    答案："""

    prompt = ChatPromptTemplate.from_template(template)

    def docs2str(docs):
        if not docs:
            print("没有检索到文档！")
        else:
            print("检索到的文档：", [doc.page_content for doc in docs])
        return "\n\n".join(doc.page_content for doc in docs)


    rag_chain = (
        {"context": retriever | docs2str, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )

    response = rag_chain.invoke(question)
    return response
```

retrieve\_and\_generate\_sports 函数的情况也是如此，输出使用 `StrOutputParser()` 进行解析。该函数使用问题调用链并返回生成的响应，依赖于检索器、`RunnablePassthrough()` 和语言模型等关键组件进行处理。

```python
def retrieve_and_generate_sports(question):
    print("调用 retrieve_and_generate_sports")
    template = """仅根据以下上下文回答问题：
    {context}
    问题：{question}
    答案："""

    prompt = ChatPromptTemplate.from_template(template)

    def docs2str(docs):
        if not docs:
            print("没有检索到文档！")
        else:
            print("检索到的文档：", [doc.page_content for doc in docs])
        return "\n\n".join(doc.page_content for doc in docs)

    rag_chain = (
        {"context": retriever | docs2str, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )

    response = rag_chain.invoke(question)
    return response
```

我们定义了三个代理：Finance\_agent、sports\_agent 和 central\_agent。Finance\_agent 负责从 Finance 知识库中检索信息并生成对与财务相关的查询的响应，使用 `retrieve_and_generate_Finance` 函数。sports\_agent 对于与体育相关的查询执行类似的角色，使用 `retrieve_and_generate_sports` 函数。central\_agent 确定查询是关于财务还是体育，并将其路由到相应的代理。

```python
## 定义财经和体育代理
Finance_agent = Agent(
    name="Finance Agent",
    instructions="您从 Finance 知识库中检索相关信息并生成对财务的一般查询的响应。",
    functions=[retrieve_and_generate_Finance]
)

sports_agent = Agent(
    name="Sports Agent",
    instructions="您从 Sports 知识库中检索相关信息并生成对体育的一般查询的响应。",
    functions=[retrieve_and_generate_sports]
)

## 定义中央代理
central_agent = Agent(
    name="Central Agent",
    instructions="确定查询是关于财务还是体育，并相应地路由查询。"
)
```

然后我们定义两个移交函数 `transfer_to_Finance` 和 `transfer_to_sports`，负责将查询指向适当的代理。`transfer_to_Finance` 函数打印一条消息，指示转移到 Finance Agent，并返回 `Finance_agent` 以处理与财务相关的查询，而 `transfer_to_sports` 函数打印一条消息，指示转移到 Sports Agent，并返回 `sports_agent` 以处理与体育相关的查询。这些移交函数随后附加到 `central_agent`，使其能够根据查询内容将查询路由到财务或体育代理。

```python
## 定义移交函数
def transfer_to_Finance():
    print("移交给 Finance Agent。")
    """将任务转移给 Finance_agent 代理以处理财务查询。"""
    return Finance_agent

def transfer_to_sports():
    print("移交给体育代理。")
    """将任务转移给 sports_Agent 以处理体育查询。"""
    return sports_agent

## 将移交函数附加到中央代理
central_agent.functions = [transfer_to_Finance, transfer_to_sports]
```

那么，让我们创建一个 Swarm 客户端与代理进行交互，并演示 `central_agent` 如何将与财务相关的查询路由到 Finance 代理。查询 "我如何知道我目前的财务状况？" 被发送到 `central_agent`，它确定适当的代理（财务或体育）。如果响应是一个代理，则打印其函数；如果不是，则显示最后一条消息（生成的答案）。这说明了 `central_agent` 如何根据内容将查询指向正确的代理。

```python
client = Swarm()

## 示例 1：询问财务
print("\n--- 示例 1：询问财务 ---")
messages = [{"role": "user", "content": "我如何知道我目前的财务状况"}]
response = client.run(agent=central_agent, messages=messages)
if isinstance(response, Agent):
    selected_agent = response
    result = selected_agent.functions
    print(result)
else:
    print(response.messages[-1]["content"])
```

## 结论：

Swarm 使得构建一个多个代理协同工作的系统变得简单。路线和交接的概念很广泛，我认为它们可以处理比 RAG 更复杂的功能和任务。

在一个时间以天来计算的行业中，即使是今天发布的 o3 模型，也很难再创造出两年的窗口。

尤其是当 Grok-3 和 Claude 等新模型准备就绪时，OpenAI 的时间可能并不紧迫。


