---
title: "利用 LangChain 和 LangGraph 进行多代理对冲基金模拟"
meta_title: "利用 LangChain 和 LangGraph 进行多代理对冲基金模拟"
description: "本项目演示了如何使用多代理设置来模拟对冲基金的分析流程。它展示了一种实用的方法来..."
date: 2024-11-10T03:51:17Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*i8wneK22YezD7zOhPKvZfg.png"
categories: ["Finance", "Programming", "Data Science"]
author: "Rifx.Online"
tags: ["multi-agent", "LangChain", "LangGraph", "FinancialDatasets", "predictive"]
draft: False

---

### 多智能体对冲基金模拟与 LangChain 和 LangGraph



该项目演示了如何使用多智能体设置来模拟对冲基金的分析过程。它展示了一种实用的方法来构建一个系统，该系统利用 AI 智能体收集和分析金融数据，这种设置可以进一步扩展和定制。在这里，我将分解该项目，其中涉及一个投资组合经理和三个分析师智能体（基本面、技术面和情绪面），每个智能体在收集和处理股票数据方面被分配了特定角色。

该项目的目标不是构建一个全面的交易算法，而是说明如何使用 LangChain 和 LangGraph 组织和并行分析各种类型的数据，利用专业的智能体。

### 项目结构和代理概述

该代理系统包括：

1. **Portfolio Manager** — 将任务委派给分析师并汇总他们的发现。
2. **Fundamental Analyst** — 获取和分析财务报表，例如利润表。
3. **Technical Analyst** — 收集指定时间范围内的股票价格数据。
4. **Sentiment Analyst** — 关注内部交易和新闻数据，提供情绪洞察。

每个代理都旨在专注于特定的数据检索任务，从而实现模块化和可扩展的分析。通过使用 LangChain 实现代理功能和 LangGraph 管理并行工作流，我们可以快速处理多个数据源。FinancialDatasets API 提供了丰富的数据来源，拥有超过 30,000 个股票代码，使得全面分析成为可能。

### 关键库和设置

LangChain 和 LangGraph 使得多智能体工作流和并行处理的分支逻辑处理变得简单。设置开始于安装所需的库并获取 API 密钥：

```python
%%capture --no-stderr
%pip install -U langgraph langchain langchain_openai langchain_experimental langsmith pandas
```
环境变量用于存储敏感数据，例如 API 密钥：

```python
import getpass
import os

def _set_if_undefined(var: str):
    if not os.environ.get(var):
        os.environ[var] = getpass.getpass(f"Please provide your {var}")

_set_if_undefined("OPENAI_API_KEY")               # https://platform.openai.com
_set_if_undefined("FINANCIAL_DATASETS_API_KEY")   # https://financialdatasets.ai
_set_if_undefined("TAVILY_API_KEY")               # https://tavily.com
```

### 代理功能：检索数据

系统中的每个代理都旨在处理与股票分析相关的特定类型数据。

### 1\. 基本面分析师

基本面分析师获取并检查财务报表，这些报表提供了公司财务健康状况的洞察。以下是获取收入报表的工具，这是一个关键的财务文件：

```python
from langchain_core.tools import tool
from typing import Dict, Union
from pydantic import BaseModel, Field

class GetIncomeStatementsInput(BaseModel):
    ticker: str = Field(..., description="The ticker of the stock.")
    period: str = Field(default="ttm", description="Valid values are 'ttm', 'quarterly', or 'annual'.")
    limit: int = Field(default=10, description="Maximum number of income statements to return.")

@tool("get_income_statements", args_schema=GetIncomeStatementsInput, return_direct=True)
def get_income_statements(ticker: str, period: str = "ttm", limit: int = 10) -> Union[Dict, str]:
    api_key = os.environ.get("FINANCIAL_DATASETS_API_KEY")
    url = f'https://api.financialdatasets.ai/financials/income-statements?ticker={ticker}&period={period}&limit={limit}'
    try:
        response = requests.get(url, headers={'X-API-Key': api_key})
        return response.json()
    except Exception as e:
        return {"ticker": ticker, "income_statements": [], "error": str(e)}
```
在这里，`get_income_statements` 用于获取给定股票代码的收入报表。通过指定期间（例如，“ttm”表示过去十二个月），代理可以专注于不同的报告周期。

### 2\. 技术分析师

技术分析师收集在定义时间范围内的股票价格数据。这些数据可以用于计算指标或识别模式。以下是检索股票价格的代码：

```python
class GetPricesInput(BaseModel):
    ticker: str
    start_date: str
    end_date: str
    interval: str = "day"
    interval_multiplier: int = 1
    limit: int = 5000

@tool("get_stock_prices", args_schema=GetPricesInput, return_direct=True)
def get_stock_prices(ticker: str, start_date: str, end_date: str, interval: str, interval_multiplier: int = 1, limit: int = 5000) -> Union[Dict, str]:
    api_key = os.environ.get("FINANCIAL_DATASETS_API_KEY")
    url = (
        f"https://api.financialdatasets.ai/prices?ticker={ticker}"
        f"&start_date={start_date}&end_date={end_date}"
        f"&interval={interval}&interval_multiplier={interval_multiplier}"
        f"&limit={limit}"
    )
    try:
        response = requests.get(url, headers={'X-API-Key': api_key})
        return response.json()
    except Exception as e:
        return {"ticker": ticker, "prices": [], "error": str(e)}
```
该函数允许我们指定日期范围和时间间隔等参数，从而控制数据的粒度（例如，按日或按小时）。

### 3\. 情绪分析师

情绪分析师收集内部交易和相关新闻的数据。内部交易和公众情绪指标可以提供市场感知的洞察，这对于评估股票波动性和潜在价格变动非常重要。

```python
class GetInsiderTradesInput(BaseModel):
    ticker: str
    limit: int = 10

@tool("get_insider_trades", args_schema=GetInsiderTradesInput, return_direct=True)
def get_insider_trades(ticker: str, limit: int = 10) -> Union[Dict, str]:
    api_key = os.environ.get("FINANCIAL_DATASETS_API_KEY")
    url = f'https://api.financialdatasets.ai/insider-transactions?ticker={ticker}&limit={limit}'
    try:
        response = requests.get(url, headers={'X-API-Key': api_key})
        return response.json()
    except Exception as e:
        return {"ticker": ticker, "insider_transactions": [], "error": str(e)}
```
通过捕获内部交易，该工具可以跟踪拥有特权信息的人的操作，这可能是绩效变化的早期指标。

### 投资组合经理：协调和总结分析

投资组合经理作为协调者，将任务分配给分析师，并将他们的结果汇总成一份报告。以下是投资组合经理的示例工作流程，展示了它如何调用每个代理：

```python
from langchain_community.tools.tavily_search import TavilySearchResults

## Tools grouped by agent type
fundamental_tools = [get_income_statements]
technical_tools = [get_stock_prices]
sentiment_tools = [get_insider_trades, TavilySearchResults(max_results=5)]

## Sample function for running all analyses in parallel
def analyze_portfolio(ticker: str):
    # Delegate tasks to each agent
    fundamentals = [tool(ticker=ticker) for tool in fundamental_tools]
    prices = [tool(ticker=ticker, start_date="2023-01-01", end_date="2023-12-31") for tool in technical_tools]
    sentiment = [tool(ticker=ticker) for tool in sentiment_tools]
    
    # Summarize results (simplified)
    summary = {
        "fundamentals": fundamentals,
        "technical": prices,
        "sentiment": sentiment
    }
    return summary
```
在这个函数中：

* 每个代理的函数并行调用，以收集指定股票代码的数据。
* 然后，经理将来自每个代理的数据汇总成一个简明的摘要，以便于审阅。

### 结论

本项目提供了一个基本但灵活的设置，通过一组专业代理分析股票数据。通过将任务分配给投资组合经理、基本面分析师、技术分析师和情绪分析师，我们能够在不同的金融数据类型中收集和组织见解。使用 LangChain 和 LangGraph 实现模块化和并行处理，使这种方法具有可扩展性，而金融数据集 API 则支持广泛的股票代码，能够实现强大的数据访问。

虽然该系统被设计为一个实践项目，但其结构可以作为更复杂的对冲基金模拟或数据分析工具的基础。下一步可能包括为每个代理增强更多工具或数据分析技术，例如：

* **技术模式和指标：** 整合更多技术分析工具，如移动平均线或趋势线。
* **情绪评分：** 从新闻来源或内部交易数据自动化情绪评分。
* **预测建模：** 添加可以根据综合数据做出买卖建议的机器学习模型。

该设置是一个有用的模块化金融数据分析原型，未来还有很多定制和改进的空间。

对于那些对这个工具包背后的代码感兴趣的人，您可以在 GitHub 上找到完整的实现 [*这里*](https://github.com/shaikhmubin02/ai-hedge-fund)。

