---
title: "Pydantic AI + Web Scraper + Llama 3.3 Python = 强大的人工智能研究代理"
meta_title: "Pydantic AI + Web Scraper + Llama 3.3 Python = 强大的人工智能研究代理"
description: "本文介绍了如何使用 Pydantic AI、Web Scraper 和 Llama 3.3 构建一个多代理聊天机器人，以支持业务或个人需求。Pydantic AI 是一个基于 Pydantic 的框架，专注于数据验证和结构化响应，简化了 AI 应用开发。Llama 3.3 是 Meta 最新发布的生成 AI 模型，具有强大的性能。文章还比较了 Pydantic AI 与 LangChain 和 LlamaIndex 的不同特点，并提供了代码示例，展示如何创建一个实时聊天机器人以检索和总结最新的语言模型新闻。"
date: 2024-12-15T01:10:27Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*XIO4G9hmnfITx91eM1FmKA.png"
categories: ["Programming", "Chatbots", "Generative AI"]
author: "Rifx.Online"
tags: ["Pydantic", "Llama", "WebScraper", "Validation", "Generative"]
draft: False

---





在这个视频中，我将快速演示如何使用 Pydantic AI、Web Scraper 和 Llama 3\.3 创建一个多代理聊天机器人，以便为您的业务或个人使用构建一个强大的代理聊天机器人。

在检索增强生成（RAG）和基于大型语言模型（LLM）的工作流中，结构化输出提高了准确性和清晰度，使数据更易于理解。

我们许多人都知道验证或转换数据为正确格式是多么令人沮丧。当处理接口数据时，您会面对复杂的数据格式。如果不小心，您可能会遇到很难发现的错误。

这就是 Pydantic 发挥作用的地方。它是一个知名的数据验证工具，并在幕后发挥着关键作用。OpenAI、Anthropic、LangChain 和 LlamaIndex 都将 Pydantic 作为核心组件，负责数据验证等重要功能。

不久前，Pydantic 团队推出了 **PydanticAI**，这是一个基于 Pydantic 的 AI 代理框架。它旨在简化 AI 应用开发的复杂性，并解决 AI 代理开发中的各种痛点。

在东部时间 12 月 6 日星期五，Meta 宣布推出新的 Llama 系列生成 AI 模型：Llama 3\.3，拥有 70 亿个参数，也称为 Llama 3\.3 70B。首席执行官扎克伯格在其社交媒体 Instagram 上表示，这是今年最后一次重大 AI 模型更新，下一步将是明年 Llama 4 的首次亮相。

Llama 3\.3 现在可以从在线来源下载，例如 oLlama 官方网站和 AI 开发平台 Hugging Face。

Llama 3\.3 在行业基准测试中超越了谷歌的 Gemini 1\.5 Pro、OpenAI 的 GPT\-4o 和亚马逊本周早些时候发布的 Nova Pro。扎克伯格表示，这是今年最后一次重大 AI 模型更新，下一步将是明年 Llama 4 的出现。

那么，让我给您快速演示一个实时聊天机器人，向您展示我的意思。

让我们问一个简单的问题：今年发布的最新 LLM 是什么？如果您查看 Pydantic AI 生成输出的方式，您会看到当我提出问题并点击搜索按钮时，检索功能会获取当前日期，将查询和日期传递给 AI 代理（`search_agent`），并使用 Tavily 客户端获取搜索结果。AI 代理处理这些结果并将其组织成结构化字段（`ResearchResult`），并返回总结内容，包括标题、主要文章和要点。这个简化的系统将 AI 能力与用户友好的界面相结合，以提供简明且视觉上吸引人的信息检索和总结。

在这个视频中，我们将讨论什么是 Pydantic AI，Pydantic AI 的特点，Langchain、llamaindex 和 Pydantic AI 之间的区别，以及如何使用 Pydantic AI 创建一个超级 AI 代理。

## 在我们开始之前！🦸🏻‍♀️

如果你喜欢这个主题并想支持我：

1. **为**我的文章鼓掌 50 次；这对我真的很有帮助。👏
2. [**关注**](https://medium.com/@mr.tarik098)我在 Medium 上，并订阅以免费获取我的最新文章🫶
3. 加入这个大家庭 — 订阅 [**YouTube 频道**](https://www.youtube.com/channel/UC6P5WCWjqhhXVFBqbJHNxyw)

## 什么是 Pydantic AI

PydanticAI 提倡类型安全操作、结构化响应验证以及一种新颖的依赖注入系统，所有这些都在熟悉的 Python 最佳实践领域内进行。这使其成为开发人员在不牺牲代码质量或安全性的情况下，利用生成性 AI 力量的宝贵工具。PydanticAI 值得探索，特别是它与 Logfire 的集成，以增强调试和监控能力。

## 功能

PydanticAI 是由 Pydantic 团队开发的 Python 代理框架，用于构建生产级应用程序，利用生成式 AI。它提供模型无关的支持、类型安全的验证、结构化响应处理，并与各种 LLM 提供商无缝集成。该框架强调简单性和可靠性，同时提供强大的功能，如依赖注入、流式响应和通过 Logfire 集成的全面监控。

**类型安全的响应验证：** 利用 Pydantic 确保 LLM 输出符合预期的数据结构，为生产应用提供强有力的验证

**依赖注入系统：** 一种新颖的类型安全系统，允许定制代理行为，并促进测试和评估驱动的开发

**模型无关架构：** 支持多个 LLM 提供商（OpenAI、Gemini、Groq），并为额外模型支持提供简单接口

**流式响应处理：** 能够实时处理和验证流式响应，包括在流式传输期间的结构化数据验证

## Langchain 与 Llamaindex 与 Pydantic AI

这些框架之间的差异体现在它们的技术特性、对大型语言模型应用开发的不同理解和实践方向上。

PydanticAI 优先考虑工程实践和生产可靠性，其核心是严格的类型系统和标准化的开发模型。

LangChain 为开发者提供了一种方便的方式，通过灵活的组件设计和丰富的生态系统快速构建应用程序。

LlamaIndex 专注于文档处理和知识检索，在数据处理和索引优化方面形成了独特的优势。

## 开始编码

在我们深入应用程序之前，我们将创建一个理想的环境以使代码正常工作。为此，我们需要安装必要的 Python 库。首先，我们将开始安装支持模型的库。为此，我们将对下面的库进行 pip 安装。

```python
pip install -r requirements.txt
```
安装完成后，我们导入 Pydantic AI、dataclasses、tavily、streamlit 和 devtools。

```python
import os
import asyncio
import datetime
from typing import Any
from dataclasses import dataclass

import nest_asyncio
nest_asyncio.apply()
from openai import  AsyncOpenAI
from pydantic_ai.models.openai import OpenAIModel
import streamlit as st
from pydantic_ai import Agent, RunContext
from pydantic import BaseModel, Field
from tavily import AsyncTavilyClient
from dotenv import load_dotenv
```
为您的 LLM 提供者设置 API 令牌。Pydantic 直接与 OpenAI、Groq 和 VertexAI 配合使用。

但在本视频中，我们将使用 Ollama，它现在与 OpenAI [Chat Completions API](https://github.com/ollama/ollama/blob/main/docs/openai.md) 内置兼容，使得可以在本地使用更多工具和应用程序。

```python
client = AsyncOpenAI(
    base_url='http://localhost:11434/v1',
    api_key='your-api-key',
)

model = OpenAIModel('llama3.3:latest', openai_client=client)
```
我们将使用 tavily 来抓取浏览器、过滤和聚合数据。

```python
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")
if not TAVILY_API_KEY:
    raise ValueError("Please set TAVILY_API_KEY environment variable.")

tavily_client = AsyncTavilyClient(api_key=TAVILY_API_KEY)
```
我们定义了三个类。第一个 `SearchDataclass` 是一个数据类，用于存储与搜索相关的信息，特别是最大结果数 (`max_results`) 和今天的日期 (`todays_date`)。

第二个类 `ResearchDependencies` 是另一个数据类，仅存储今天的日期。

第三个类 `ResearchResult` 继承自 `BaseModel`，表示一篇研究文章，包含文章标题 (`research_title`)、主要内容 (`research_main`) 和一组总结要点的项目符号 (`research_bullets`)。

`Field` 函数用于为每个属性添加描述，有助于验证和文档。

```python
@dataclass
class SearchDataclass:
    max_results: int
    todays_date: str

@dataclass
class ResearchDependencies:
    todays_date: str

class ResearchResult(BaseModel):
    research_title: str = Field(description='Markdown heading describing the article topic, prefixed with #')
    research_main: str = Field(description='A main section that provides a detailed news article')
    research_bullets: str = Field(description='A set of bullet points summarizing key points')
```
我创建了一个 `Agent` LLama3.3 用于研究任务。它使用 `ResearchDependencies` 数据类作为输入，使用 `ResearchResult` 类作为输出。接着，我们编写一个 **系统提示**，指示它从查询中识别关键词，执行多次搜索，然后将这些结果合并成详细响应。

```python
## Create the agent
search_agent = Agent(
    model,
    deps_type=ResearchDependencies,
    result_type=ResearchResult,
    system_prompt='You are a helpful research assistant, you are an expert in research. '
                  'When given a query, you will identify strong keywords to do 3-5 searches using the provided search tool. '
                  'Then combine results into a detailed response.'
)
```
我们创建一个 add\_current\_date 函数，以指示代理从给定问题中识别强关键词，使用这些关键词进行 3-5 次搜索，并将结果合并成详细响应，同时确保信息准确且最新。

```python
@search_agent.system_prompt
async def add_current_date(ctx: RunContext[ResearchDependencies]) -> str:
    todays_date = ctx.deps.todays_date
    system_prompt = (
        f"You're a helpful research assistant and an expert in research. "
        f"When given a question, write strong keywords to do 3-5 searches in total "
        f"(each with a query_number) and then combine the results. "
        f"If you need today's date it is {todays_date}. "
        f"Focus on providing accurate and current information."
    )
    return system_prompt
```
我们定义了两个异步函数：`get_search` 和 `do_search`。

* `get_search` 是 `search_agent` 用于执行搜索的工具。它接受搜索查询和搜索上下文（包括最大结果数），并使用 `tavily_client` 来检索搜索结果，将其作为字典返回。
* `do_search` 通过创建 `SearchDataclass` 的实例（包括当前日期和最大结果数）来准备必要的依赖项。然后它使用这些依赖项和查询运行 `search_agent`，等待结果。

```python
@search_agent.tool
async def get_search(search_data: RunContext[SearchDataclass], query: str, query_number: int) -> dict[str, Any]:
    """Perform a search using the Tavily client."""
    max_results = search_data.deps.max_results
    results = await tavily_client.get_search_context(query=query, max_results=max_results)
    return results

async def do_search(query: str, max_results: int):
    # Prepare dependencies
    current_date = datetime.date.today()
    date_string = current_date.strftime("%Y-%m-%d")
    deps = SearchDataclass(max_results=max_results, todays_date=date_string)
    result = await search_agent.run(query, deps=deps)
```
让我们设置一个 Streamlit 应用程序，用户可以输入查询并指定要检索的搜索结果数量。在我们点击按钮以启动搜索后，应用程序将获取相关的研究数据（包括标题、主要文章和关键要点），并以组织良好的格式显示。

```python
st.set_page_config(page_title="AI News Researcher", layout="centered")

st.title("Large Language Model News Researcher")
st.write("Stay updated on the latest trends and developments in Large Language Model.")

## User input section
st.sidebar.title("Search Parameters")
query = st.sidebar.text_input("Enter your query:", value="latest Large Language Model news")
max_results = st.sidebar.slider("Number of search results:", min_value=3, max_value=10, value=5)

st.write("Use the sidebar to adjust search parameters.")

if st.button("Get Latest Large Language Model News"):
    with st.spinner("Researching, please wait..."):
        result_data = asyncio.run(do_search(query, max_results))

    st.markdown(result_data.research_title)
    # A bit of styling for the main article
    st.markdown(f"<div style='line-height:1.6;'>{result_data.research_main}</div>", unsafe_allow_html=True)

    st.markdown("### Key Takeaways")
    st.markdown(result_data.research_bullets)
```

## 结论：

Pydantic AI 是一个出色的库，但有许多方法可以实现相同的功能。我花了很多精力来理解和使用我在这里展示的示例。希望你能利用这些示例更快、更轻松地掌握 Pydantic。

无论是构建一个简单的聊天机器人还是一个复杂的系统，PydanticAI 提供的功能使开发过程更加顺畅，最终产品更加可靠。

> ***🧙‍♂️ 我是一名 AI 生成专家！如果你想在项目上合作，请在这里提交 [咨询](https://docs.google.com/forms/d/e/1FAIpQLSelxGSNOdTXULOG0HbhM21lIW_mTgq7NsDbUTbx4qw-xLEkMQ/viewform) 或与我预约 [一对一咨询](https://calendly.com/gao-dalie/ai-consulting-call) 电话。***

*📚欢迎查看我的其他文章:*

