---
title: "具有大型语言模型（LLM）的多代理人工智能架构"
meta_title: "具有大型语言模型（LLM）的多代理人工智能架构"
description: "本文探讨了多智能体架构与大型语言模型（LLMs）的结合，强调其在解决复杂任务中的优势。多智能体系统由多个自主智能体组成，能够独立决策并协作完成任务，广泛应用于机器人技术和虚拟助手等领域。文章提供了一个使用LLMs的多智能体应用的端到端实现示例，展示了如何通过协调者和多个代理利用LLMs进行自然语言处理与推理。"
date: 2024-12-27T10:48:53Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*mDld8-UAl8yND332Pw9kgg.png"
categories: ["Programming", "Machine Learning", "Natural Language Processing"]
author: "Rifx.Online"
tags: ["Multi-Agent", "LLMs", "Collaboration", "Swarm", "Summarization"]
draft: False

---



### 端到端多智能体实现与LLMs

多智能体架构由多个自主智能体组成，它们协作以完成复杂任务。随着LLMs的最新进展，这种架构已获得显著的关注。

这些智能体能够独立做出决策并执行行动。智能体由大型语言模型（LLMs）驱动。

多智能体架构的工作方式是，你不必指定每一个步骤，我们可以给它们一个目标，它们可以自行确定行动顺序。

这些架构被广泛应用于机器人技术、虚拟助手、协作决策和多模态处理等不同领域，这些领域的任务需要动态交互和高级推理。

## 1\. 文章概述

本文探讨了多智能体架构与大型语言模型（LLMs）的结合，强调其应对需要协调、可扩展性和高级智能的复杂挑战的能力。

1. 它概述了配备LLMs的自主智能体如何通过利用其理解和生成类人文本的能力有效协作。
2. 文章还提供了一个使用LLMs的多智能体应用的完整实现，提供了这一创新框架的实用指南。

与大型语言模型（LLMs）结合时，多智能体架构成为解决需要协调、可扩展性和智能的问题的强大范式。

配备LLMs的多智能体架构涉及一个由多个自主智能体组成的系统，每个智能体都配备有大型语言模型，通过利用其理解和生成类人文本的能力协作解决复杂问题。



## 2\. 多智能体架构概述与LLMs

让我们了解多智能体架构的关键方面：

带有LLM的多智能体架构由多个智能体组成，每个智能体独立运作，拥有自己的目标、决策能力和数据访问权限，同时在环境中扮演一个或多个角色。它们由LLM支持。

LLM的集成增强了系统处理自然语言输入、生成上下文相关输出和适应各种场景的能力，使多智能体系统更加高效和多功能。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*8Xq3XujUzubGyiPJZRJJZA.png)

### 代理

* 代理是一个目标导向的软件组件，它通过观察环境状态、制定计划并执行行动来实现目标。它是一个利用LLM控制应用程序流程的系统。
* 代理可以拥有上下文和记忆。代理通常是处理特定子任务的专家，例如数据预处理、查询LLM或分析结果。
* 代理可能使用强化学习或其他技术来随着时间的推移提高其性能。一个或多个代理利用LLM执行自然语言理解、推理或生成任务。
* 一个`Agent`包含`instructions`和`tools`，并可以在任何时候选择将对话移交给另一个`Agent`。
* 例如，我们的应用程序中可能会有销售代理、财务分析师代理和/或量化代理。这些代理在各自的领域中是专家。它们配置了特定的提示和工具，使其能够执行所需的功能。

代理与外部系统或环境进行交互，实时收集输入并做出决策。

* 代理相互沟通和协调，通常使用LLM促进的自然语言，分享信息、计划和共同执行任务。每个代理可以调用一个或多个最符合要求的不同LLM。

### 工具

* 工具执行任务。它们没有任何决策能力。它们接收输入并根据指令执行一系列步骤。可以将它们视为可重用的实用函数。
* 工具的例子可以是一个调用 LLM 来重写输入的函数，一个使用 Yahoo Finance 查找公司新闻的函数，一个从 API 获取数据的提供者，一个查询数据库的存储库函数等。

### 关于多智能体架构设计的注意事项

* 确保架构能够扩展是非常重要的。多智能体架构通常通过水平增加更多智能体来进行扩展。
* 智能体作为独立的进程分布，以降低故障风险，故障容错/自动恢复通常内置于架构中，以便它们能够从上一个检查点恢复。
* 确保系统设计是模块化的，以便智能体可以独立开发、测试和部署，从而确保系统设计的灵活性。

有几个多智能体 LLM 框架可用：

### 1\. Swarm by OpenAI

* **优点**：有效地扩展以支持需要多个代理协作的分布式任务。
* **缺点**：仍处于实验阶段，社区支持和文档有限。

### 2\. LangGraph Agents

* **优点**：与各种工具和API提供强大的集成，使其在多种用例中高度灵活。
* **缺点**：随着代理数量的增加，复杂性增加，需要仔细管理以避免资源瓶颈。

### 3\. Auto\-GPT

* **优点**: 旨在实现自主任务执行，能够以最小的人工干预实现端到端工作流程。
* **缺点**: 由于其广泛的任务探索方法，计算成本高，并且对于简单任务可能效率低下。

## 3\. 使用 LLM 的多智能体架构的端到端实现

本节旨在提供一个使用 LLM 的多智能体架构示例。我将使用 OpenAI 框架 [**swarm**](https://github.com/openai/swarm/tree/main)，这是一个探索人体工程学、轻量级多智能体编排的教育框架。

我准备的示例虽然简单，但可以演示如何使用 LLM 构建多智能体架构。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*CO0B6c5NMbK-gEsapoGjpg.png)

使用 Swarm 的原因在于它专注于使智能体的协调和执行轻量化、高度可控且易于测试。

基本上，swarm 的工作方式是，当调用 `run()` 函数时，它执行以下步骤：

1. 获取当前智能体的完成
2. 执行工具调用并附加结果
3. 如有必要，切换智能体
4. 如有必要，更新上下文变量
5. 如果没有新的函数调用，返回

### 开始编码吧

### 第一步：创建虚拟环境并安装 Python 包

```python
pip install git+https://github.com/openai/swarm.git
pip install openai==1.58.1
pip install yahoo_fin==0.8.9.1


```

### 第2步：创建一个 main.py 文件


```python
import os

key = 'ENTER API KEY'
os.environ['OPENAI_API_KEY'] = key

from swarm import Swarm, Agent
import feedparser
from yahoo_fin import news


def transfer_to_summariser_agent():
    return summariser_agent


def yahoo_finance_tool():
    try:
        company_name = context_variables['name']
        news_data = news.get_yf_rss(company_name)
        news_titles = list(map(lambda n: n.title, news_data))
        return news_titles
    except Exception as e:
        return f"从 Yahoo Finance 获取新闻时出错：{e}"


def google_extract_tool():
    keyword = context_variables['name']
    # 使用网络爬虫提取一般新闻
    try:
        keyword_encoded = keyword.replace(" ", "+")
        rss_url = f"https://news.google.com/rss/search?q={keyword_encoded}&hl=en-US&gl=US&ceid=US:en"

        # 获取并解析 RSS 源
        feed = feedparser.parse(rss_url)
        return list(map(lambda entry: entry.title, feed.entries))
    except Exception as e:
        return f"获取一般新闻时出错：{e}"


company_news_extractor_agent = Agent(
    name="company_news_extractor_agent",
    description="""
                    调用 Yahoo Finance 工具，然后调用总结器
                    """,
    functions=[yahoo_finance_tool, transfer_to_summariser_agent])

person_news_extractor_agent = Agent(
    name="person news extractor agent",
    description="""
                    调用 Google 工具，然后调用总结器
                    """,
    functions=[google_extract_tool, transfer_to_summariser_agent])

summariser_agent = Agent(
    name='NewsSummarizerAgent',
    instructions="""您是一名经济学家。用三句话总结以下新闻。"""
)


def coordinate(name, type):
    context_variables['name'] = name
    if type == 'company_news_agent_extractor' or type == 'company':
        return company_news_extractor_agent
    elif type == 'person_news_extractor_agent' or type == 'person':
        return person_news_extractor_agent
    raise Exception(f'无法处理类型={type}')


context_variables = {}
coordinator_agent = Agent(
    name="Coordinator Agent",
    instructions=f"""您负责协调用户请求，并调用工具以转移到正确的意图。
    您不需要了解具体内容，只需知道请求的主题。
    如果用户请求与公司有关，请转移到 company_news_extractor_agent。
    如果用户请求与个人有关，请转移到 person_news_extractor_agent
    """,
    functions=[coordinate],
    context_variables=context_variables,
    debug=True
)

## 主执行
if __name__ == "__main__":
    # 初始化群体和代理
    client = Swarm()

    # 示例
    user_query = [{"role": "user", "content": "关于 AAPL 的最新动态是什么？"}]
    summary = client.run(agent=coordinator_agent, messages=user_query)
    print("\n最终摘要：")
    print(summary.messages[3]['content'])

    user_query = [{"role": "user", "content": "关于特朗普的最新动态是什么？"}]
    summary = client.run(agent=coordinator_agent, messages=user_query)
    print("\n最终摘要：")
    print(summary.messages[3]['content'])
```
该应用程序的工作方式如下：

1. 输入被传递给 `coordinator agent`
2. 协调者代理使用 OpenAI API 检测查询是关于个人还是公司的
3. 如果是关于 `person`，协调者代理将其传递给 `person news extractor agent`，该代理使用 Google RSS 工具提取新闻。
4. 如果查询是关于 `company`，则协调者代理将其传递给 `company news extractor agent`，该代理使用 Yahoo finance 工具提取新闻。
5. 最后，新闻被传递给 `summariser agent`，该代理通过 Open AI LLM 对新闻进行总结。

这是一个简单的示例，但演示了如何使用协调者、多个代理和工具，以及它们如何使用 LLM 来制定计划。像 Swarm 这样的方式非常适合涉及众多独立能力和复杂指令的场景，这些场景无法有效地封装在单个提示中。

## 摘要

本文概述了与大型语言模型（LLMs）集成的多智能体架构，强调了其在解决需要协调、可扩展性和智能的复杂问题中的潜力。

讨论了多智能体系统的概念，其中由LLMs驱动的自主智能体通过利用其类人文本理解和生成能力协作工作。

此外，文章还包括了一个使用LLMs的多智能体应用的端到端实现，提供了对这一创新方法的实际见解。

