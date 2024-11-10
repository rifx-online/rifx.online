---
title: "Multi-Agent Hedge Fund Simulation with LangChain and LangGraph"
meta_title: "Multi-Agent Hedge Fund Simulation with LangChain and LangGraph"
description: "This project demonstrates how to use a multi-agent setup to simulate a hedge fund’s analytical process. It showcases a practical way to…"
date: 2024-11-10T03:51:17Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*i8wneK22YezD7zOhPKvZfg.png"
categories: ["Finance", "Programming", "Data Science"]
author: "Rifx.Online"
tags: ["multi-agent", "LangChain", "LangGraph", "FinancialDatasets", "predictive"]
draft: False

---


### Multi\-Agent Hedge Fund Simulation with LangChain and LangGraph



This project demonstrates how to use a multi\-agent setup to simulate a hedge fund’s analytical process. It showcases a practical way to build a system that uses AI agents to gather and analyze financial data, a setup that could be scaled and customized further. Here, I’ll break down the project, which involves a portfolio manager and three analyst agents (fundamental, technical, and sentiment), each assigned specific roles in gathering and processing stock data.

The goal of this project is not to build a comprehensive trading algorithm but rather to illustrate how various types of data can be organized and analyzed in parallel with specialized agents using LangChain and LangGraph.


### Project Structure and Agent Overview

This agent system includes:

1. **Portfolio Manager** — Delegates tasks to analysts and aggregates their findings.
2. **Fundamental Analyst** — Fetches and analyzes financial statements, such as income statements.
3. **Technical Analyst** — Collects stock price data over specified timeframes.
4. **Sentiment Analyst** — Looks at insider trading and news data, providing sentiment insights.

Each agent is designed to specialize in a specific data retrieval task, allowing for modular and scalable analysis. By using LangChain for agent functionality and LangGraph for managing parallel workflows, we can quickly process multiple data sources. The FinancialDatasets API provides a rich source of data with over 30,000 stock tickers, enabling comprehensive analysis.


### Key Libraries and Setup

LangChain and LangGraph enable easy handling of multi\-agent workflows and branching logic for parallel processing. The setup begins by installing required libraries and securing API keys:


```python
%%capture --no-stderr
%pip install -U langgraph langchain langchain_openai langchain_experimental langsmith pandas
```
Environment variables are used to store sensitive data, like API keys:


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

### Agent Functions: Retrieving Data

Each agent in the system is designed to handle specific types of data relevant to stock analysis.


### 1\. Fundamental Analyst

The Fundamental Analyst retrieves and examines financial statements, which offer insights into a company’s financial health. Below is the tool for getting income statements, a key financial document:


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
Here, `get_income_statements` retrieves the income statements for a given stock ticker. By specifying the period (e.g., “ttm” for trailing twelve months), the agent can focus on different reporting cycles.


### 2\. Technical Analyst

The Technical Analyst collects stock price data over defined timeframes. This data can later be used to calculate indicators or recognize patterns. Below is the code to retrieve stock prices:


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
This function allows us to specify parameters like date range and interval, giving control over the granularity of the data (e.g., daily or hourly).


### 3\. Sentiment Analyst

The Sentiment Analyst pulls in data on insider trading and relevant news. Insider trades and public sentiment indicators can offer insights into market perception, which is important for assessing stock volatility and potential price movements.


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
By capturing insider trades, this tool can track moves made by those with privileged information, which might be early indicators of performance changes.


### Portfolio Manager: Coordinating and Summarizing Analysis

The Portfolio Manager serves as the coordinator, delegating tasks to the analysts and compiling their results into a single report. Below is a sample workflow for the Portfolio Manager that demonstrates how it calls each agent:


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
In this function:

* Each agent’s functions are called in parallel to gather data for the specified ticker.
* The manager then compiles the data from each agent into a single summary for easy review.


### Conclusion

This project provides a basic yet flexible setup for analyzing stock data through a team of specialized agents. By splitting tasks among a Portfolio Manager, Fundamental Analyst, Technical Analyst, and Sentiment Analyst, we’re able to gather and organize insights across different financial data types. Using LangChain and LangGraph for modularity and parallel processing makes this approach scalable, while Financial Datasets API supports a broad range of tickers, enabling robust data access.

While this system is designed as a project for practice, its structure can serve as a foundation for more complex hedge fund simulations or data analytics tools. Next steps might include enhancing each agent with additional tools or data analysis techniques, such as:

* **Technical Patterns and Indicators:** Integrating more technical analysis tools like moving averages or trend lines.
* **Sentiment Scoring:** Automating sentiment scoring from news sources or insider trading data.
* **Predictive Modeling:** Adding ML models that can make buy/sell recommendations based on the combined data.

This setup is a useful prototype for modular financial data analysis, with plenty of room for future customizations and improvements.

For those interested in the code behind this toolkit, you can find the complete implementation on GitHub [*here*](https://github.com/shaikhmubin02/ai-hedge-fund).


