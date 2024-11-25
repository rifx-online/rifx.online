---
title: "利用 LangGraph 和 OpenAI 打造代理金融分析师"
meta_title: "利用 LangGraph 和 OpenAI 打造代理金融分析师"
description: "本文介绍了如何使用LangGraph和OpenAI构建一个自主财务分析师，旨在通过基本面分析和技术指标评估股票表现。该代理能够从Yahoo Finance获取实时股票数据，计算技术指标（如RSI、MACD等），并提供结构化的AI生成分析。文章还详细描述了所需工具、环境设置及代码实现，展示了如何高效协调工具和管理对话逻辑。最终，构建的分析师能够提供全面的股票分析，帮助投资者做出明智决策。"
date: 2024-11-25T15:00:22Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Bmq-ltRKcChnyTT76oSksQ.png"
categories: ["Finance", "Programming", "Data Science"]
author: "Rifx.Online"
tags: ["LangGraph", "OpenAI", "YahooFinance", "RSI", "MACD"]
draft: False

---





在股票交易的世界中，投资者依赖各种工具和方法来做出明智的决策。其中一种方法是 **基本面分析**，它评估公司的财务健康状况和股票表现，以提供可操作的见解。随着 AI 和机器学习的进步，股票分析现在可以在很大程度上实现自动化。在这篇文章中，我们将探讨如何使用 LangChain、LangGraph 和 Yahoo Finance 创建一个 **股票表现分析代理**，利用实时股票数据和关键技术指标。

无论您是金融爱好者、开发者还是数据科学家，这个逐步教程将使您能够创建自己的智能代理。让我们开始吧！

### 这个代理财务分析师将会做什么？

* **从 Yahoo Finance 获取股票价格数据**。
* **计算技术指标**，如 RSI、MACD、VWAP 等。
* **评估财务指标**，如市盈率、债务与股本比率和利润率。
* **提供结构化的 AI 生成分析**，使用 OpenAI 强大的语言模型。

### 我们将使用的工具

1. **LangGraph:** 一个用于协调工具和构建对话代理的库。
2. **OpenAI GPT\-4:** 用于生成智能和结构化的财务洞察。
3. **yfinance:** 用于获取股票价格和财务比率。
4. **ta (技术分析库):** 用于计算关键技术指标。
5. **Python 库:** `pandas`、`dotenv` 和 `datetime` 用于数据处理和环境设置。

## 第一步：设置环境

首先安装所需的库：


```python
pip install -U langgraph langchain langchain_openai pandas ta python-dotenv yfinance
```
设置一个 `.env` 文件以安全存储您的 OpenAI API 密钥：


```python
OPENAI_API_KEY=your_openai_api_key_here
```

## 第2步：分析师工具

**获取股票价格**：此工具获取股票的历史数据并计算多个技术指标。

```python
from typing import Union, Dict, Set, List, TypedDict, Annotated
import pandas as pd
from langchain_core.tools import tool
import yfinance as yf
from ta.momentum import RSIIndicator, StochasticOscillator
from ta.trend import SMAIndicator, EMAIndicator, MACD
from ta.volume import volume_weighted_average_price

@tool
def get_stock_prices(ticker: str) -> Union[Dict, str]:
    """Fetches historical stock price data and technical indicator for a given ticker."""
    try:
        data = yf.download(
            ticker,
            start=dt.datetime.now() - dt.timedelta(weeks=24*3),
            end=dt.datetime.now(),
            interval='1wk'
        )
        df= data.copy()
        data.reset_index(inplace=True)
        data.Date = data.Date.astype(str)
        
        indicators = {}
        
        rsi_series = RSIIndicator(df['Close'], window=14).rsi().iloc[-12:]
        indicators["RSI"] = {date.strftime('%Y-%m-%d'): int(value) 
                    for date, value in rsi_series.dropna().to_dict().items()}
        
        sto_series = StochasticOscillator(
            df['High'], df['Low'], df['Close'], window=14).stoch().iloc[-12:]
        indicators["Stochastic_Oscillator"] = {
                    date.strftime('%Y-%m-%d'): int(value) 
                    for date, value in sto_series.dropna().to_dict().items()}

        macd = MACD(df['Close'])
        macd_series = macd.macd().iloc[-12:]
        indicators["MACD"] = {date.strftime('%Y-%m-%d'): int(value) 
                    for date, value in macd_series.to_dict().items()}
        
        macd_signal_series = macd.macd_signal().iloc[-12:]
        indicators["MACD_Signal"] = {date.strftime('%Y-%m-%d'): int(value) 
                    for date, value in macd_signal_series.to_dict().items()}
        
        vwap_series = volume_weighted_average_price(
            high=df['High'], low=df['Low'], close=df['Close'], 
            volume=df['Volume'],
        ).iloc[-12:]
        indicators["vwap"] = {date.strftime('%Y-%m-%d'): int(value) 
                    for date, value in vwap_series.to_dict().items()}
        
        return {'stock_price': data.to_dict(orient='records'),
                'indicators': indicators}

    except Exception as e:
        return f"Error fetching price data: {str(e)}"
```
**财务比率**：此工具检索关键财务健康比率。

```python
@tool
def get_financial_metrics(ticker: str) -> Union[Dict, str]:
    """Fetches key financial ratios for a given ticker."""
    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        return {
            'pe_ratio': info.get('forwardPE'),
            'price_to_book': info.get('priceToBook'),
            'debt_to_equity': info.get('debtToEquity'),
            'profit_margins': info.get('profitMargins')
        }
    except Exception as e:
        return f"Error fetching ratios: {str(e)}"
```

## 第3步：构建LangGraph

LangGraph使我们能够高效地协调工具和管理对话逻辑。

### 1\. 定义图

我们首先定义一个 `StateGraph` 来管理流程：

```python
from langgraph.graph import StateGraph, START, END

class State(TypedDict):
    messages: Annotated[list, add_messages]
    stock: str
    
graph_builder = StateGraph(State)
```

### 2\. 定义 OpenAI 和绑定工具

我们将工具集成到 LangGraph 中，并创建一个用于分析的反馈循环


```python
import dotenv
dotenv.load_dotenv()

from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model='gpt-4o-mini')

tools = [get_stock_prices, get_financial_metrics]
llm_with_tool = llm.bind_tools(tools)
```

### 3\. 分析师节点

该提示确保AI理解其角色并提供结构化输出。

```python
FUNDAMENTAL_ANALYST_PROMPT = """
You are a fundamental analyst specializing in evaluating company (whose symbol is {company}) performance based on stock prices, technical indicators, and financial metrics. Your task is to provide a comprehensive summary of the fundamental analysis for a given stock.

You have access to the following tools:
1. **get_stock_prices**: Retrieves the latest stock price, historical price data and technical Indicators like RSI, MACD, Drawdown and VWAP.
2. **get_financial_metrics**: Retrieves key financial metrics, such as revenue, earnings per share (EPS), price-to-earnings ratio (P/E), and debt-to-equity ratio.

#### Your Task:
1. **Input Stock Symbol**: Use the provided stock symbol to query the tools and gather the relevant information.
2. **Analyze Data**: Evaluate the results from the tools and identify potential resistance, key trends, strengths, or concerns.
3. **Provide Summary**: Write a concise, well-structured summary that highlights:
    - Recent stock price movements, trends and potential resistance.
    - Key insights from technical indicators (e.g., whether the stock is overbought or oversold).
    - Financial health and performance based on financial metrics.

#### Constraints:
- Use only the data provided by the tools.
- Avoid speculative language; focus on observable data and trends.
- If any tool fails to provide data, clearly state that in your summary.

#### Output Format:
Respond in the following format:
"stock": "<Stock Symbol>",
"price_analysis": "<Detailed analysis of stock price trends>",
"technical_analysis": "<Detailed time series Analysis from ALL technical indicators>",
"financial_analysis": "<Detailed analysis from financial metrics>",
"final Summary": "<Full Conclusion based on the above analyses>"
"Asked Question Answer": "<Answer based on the details and analysis above>"

Ensure that your response is objective, concise, and actionable."""

def fundamental_analyst(state: State):
    messages = [
        SystemMessage(content=FUNDAMENTAL_ANALYST_PROMPT.format(company=state['stock'])),
    ]  + state['messages']
    return {
        'messages': llm_with_tool.invoke(messages)
    }

graph_builder.add_node('fundamental_analyst', fundamental_analyst)
graph_builder.add_edge(START, 'fundamental_analyst')

```

### 4\. 将工具添加到图形并编译


```python
graph_builder.add_node(ToolNode(tools))
graph_builder.add_conditional_edges('fundamental_analyst', tools_condition)
graph_builder.add_edge('tools', 'fundamental_analyst')

graph = graph_builder.compile()

```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*2LAokFLreuYiwzbCRURmfg.png)

### 5\. 执行图形


```python
events = graph.stream({'messages':[('user', 'Should I buy this stock?')],
 'stock': 'TSLA'}, stream_mode='values')
for event in events:
    if 'messages' in event:
        event['messages'][-1].pretty_print()

```

## 示例输出


```python
{
  "stock": "TSLA",
  "price_analysis": "最近TSLA的股票价格显示出波动性，波动幅度显著。在过去几周内，价格从2024年11月18日的最高点$361.53到2024年4月15日的最低点$147.05。当前股票交易价格约为$352.56，表明从近期低点强劲反弹。根据最近的高点，潜在的阻力位似乎在$360附近，而支撑位可以识别在$320附近。",
  "technical_analysis": "技术指标呈现出混合的前景。相对强弱指数(RSI)最近上升至71，表明该股票接近超买区域。随机振荡器(Stochastic Oscillator)显示值为94，暗示该股票可能也处于超买状态。同时，MACD正在上升，目前为28，这表明看涨动能。然而，由于RSI和随机振荡器都暗示潜在的超买状况，建议保持谨慎。",
  "financial_analysis": "TSLA的财务指标显示相对于其收益的高估值，市盈率(P/E)为108.09，市净率(price-to-book ratio)为16.17。公司的债务股本比率为18.08，属于相对较低，表明资产负债表强劲。利润率为13.08%，显示出不错的盈利能力。然而，高市盈率表明投资者对未来增长有很高的期望。",
  "final Summary": "总之，TSLA近期显示出强劲的价格反弹，潜在阻力位在$360附近。技术指标表明该股票可能处于超买状态，这可能导致价格修正。从财务上看，尽管公司在可控的债务水平和合理的利润率下表现良好，但高估值指标表明未来表现必须满足较高的期望。投资者在决定购买之前应仔细权衡这些因素。",
  "Asked Question Answer": "考虑到当前的超买指标和高估值，等待潜在回调后再购买TSLA可能是明智的选择。"
}

```

## 未来改进

引入**全方位投资组合管理代理**的概念是对项目的一个极大改进！在一个统一的平台下，多个专业团队的协作能够显著增强代理的功能，涵盖广泛的领域，并提供一个全面的投资组合管理工具。

## 结论

构建一个自主金融分析师不仅是学习人工智能和金融分析的绝佳方式，也是创建强大现实应用的垫脚石。亲自尝试一下，看看自动化的力量如何在行动中展现！

在 [GitHub](https://github.com/Abhinavk910/GenAI/blob/main/Agent/Langgraph/finance_agent/financial_analyst.ipynb) 上查看完整项目。分叉它，进行实验，并告诉我你的想法！

你会为这个项目添加哪些功能？在下面留言，我们来讨论！

