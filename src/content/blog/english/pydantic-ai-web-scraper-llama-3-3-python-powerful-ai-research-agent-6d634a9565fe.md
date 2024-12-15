---
title: "Pydantic AI + Web Scraper + Llama 3.3 Python = Powerful AI Research Agent"
meta_title: "Pydantic AI + Web Scraper + Llama 3.3 Python = Powerful AI Research Agent"
description: "The article provides a tutorial on creating a multi-agent chatbot using Pydantic AI, Web Scraper, and Llama 3.3. It highlights the importance of structured output in Retrieval-Augmented Generation workflows for improved accuracy. Pydantic AI, a framework for data validation, simplifies AI application development, while Llama 3.3, Metas latest generative AI model, surpasses competitors in benchmarks. Key features of Pydantic AI include type-safe response validation, dependency injection, and model-agnostic architecture, making it suitable for production-level applications. The article also compares Pydantic AI with Langchain and LlamaIndex, emphasizing its focus on reliability and engineering practices."
date: 2024-12-15T01:10:27Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*XIO4G9hmnfITx91eM1FmKA.png"
categories: ["Programming", "Chatbots", "Generative AI"]
author: "Rifx.Online"
tags: ["Pydantic", "Llama", "WebScraper", "Validation", "Generative"]
draft: False

---






In this video, I have a super quick tutorial showing you how to create a multi\-agent chatbot with Pydantic AI, Web Scraper and Llama 3\.3 to make a powerful Agent Chatbot for your business or personal use.

In Retrieval\-Augmented Generation (RAG) and large language model (LLM)\-\-based workflows, structured output improves accuracy and clarity and makes the data easier to understand.

Many of us know how frustrating it can be to validate or convert data into the right format. When working with interface data, you deal with complex data formats. If you’re not careful, you could end up with bugs that are really hard to find.

That’s where Pydantic comes in. It is a well\-known tool for data validation and plays a key role behind the scenes. OpenAI, Anthropic, LangChain, and LlamaIndex all use Pydantic as a core component, responsible for important functions such as data validation.

Not long ago, the Pydantic team launched **PydanticAI**, an AI agent framework based on Pydantic. It is designed to simplify the complexity of AI application development and address various pain points in AI agent development.

On Friday, December 6, Eastern Time, Meta announced the launch of a new Llama series generative AI model: Llama 3\.3 with 7 billion parameters, also known as Llama 3\.3 70B. CEO Zuckerberg said on his social media Instagram that this is the last major AI model update this year, and the next step will be the debut of Llama 4 next year.

Llama 3\.3 is now available for download from online sources such as the oLlama official website and the AI development platform Hugging Face.

Llama 3\.3 outperformed Google’s Gemini 1\.5 Pro, OpenAI’s GPT\-4o, and Amazon’s Nova Pro released earlier this week in industry benchmarks. Zuckerberg said this is the last major AI model update this year, and the next step will be the appearance of Llama 4 next year.

So, Let me give you a quick demo of a live chatbot to show you what I mean.







Let me ask a simple: What is the latest LLM released this year If you look at how the Pydantic AI generates the output, you will see that when I ask a question and click on the search button, the research function retrieves the current date, passes the query and date to the AI agent (`search_agent`), and fetches search results using the Tavily client. The AI agent processes these results and organizes them into structured fields (`ResearchResult`), and returns summarized content, including a title, main article, and bullet points. This streamlined system combines AI capabilities with a user\-friendly interface to deliver concise and visually appealing information retrieval and summarization.

In this video, we will discuss what Pydantic AI is, what are the features of Pydantic AI, the differences between Langchain, llamaindex and Pydantic AI and how Pydantic AI can be used to create a super AI Agent.


## Before we start! 🦸🏻‍♀️

If you like this topic and you want to support me:

1. **Clap** my article 50 times; that will really help me out.👏
2. [**Follow**](https://medium.com/@mr.tarik098) me on Medium and subscribe to get my latest article for Free🫶
3. Join the family — Subscribe to [**YouTube channel**](https://www.youtube.com/channel/UC6P5WCWjqhhXVFBqbJHNxyw)


## What Pydantic AI is

PydanticAI advocates type\-safe operations, structured response validation, and a novel dependency injection system, all within the familiar field of Python best practices. This makes it a valuable tool for developers seeking to leverage the power of generative AI without sacrificing code quality or security. PydanticAI is worth exploring, especially its integration with Logfire to enhance debugging and monitoring capabilities.


## Features

PydanticAI is a Python agent framework developed by the Pydantic team for building production\-level applications using generative AI. It provides model\-agnostic support, type\-safe validation, structured response handling, and seamless integration with various LLM providers. The framework emphasizes simplicity and reliability while providing powerful features such as dependency injection, streaming responses, and comprehensive monitoring through Logfire integration.

**Type\-safe response validation:** Leverage Pydantic to ensure that LLM output conforms to the expected data structure, providing strong validation for production applications

**Dependency Injection System:** A novel type\-safe system that allows customization of proxy behavior and facilitates testing and evaluation\-driven development

**Model\-agnostic architecture:** supports multiple LLM providers (OpenAI, Gemini, Groq) and provides a simple interface for additional model support

**Streaming response processing:** Ability to process and validate streaming responses in real\-time, including structured data validation during streaming


## Langchain Vs Llamaindex Vs Pydantic AI

The differences between these frameworks are reflected in their technical features, their different understandings of and practical directions for developing large language model applications.

PydanticAI prioritizes engineering practice and production reliability, with a strict type system and standardized development model at its core.

LangChain provides developers with a convenient way to quickly build applications through flexible component design and a rich ecosystem.

LlamaIndex focuses on document processing and knowledge retrieval and has formed unique advantages in data processing and index optimization.


## Let’s start coding

Before we dive into our application, we will create an ideal environment for the code to work. For this, we need to install the necessary Python libraries. Firstly, we will start by installing the libraries that support the model. For this, we will do a pip install of the libraries below.


```python
pip install -r requirements.txt
```
Once installed we import Pydantic AI, dataclasses, tavily, streamlit and devtools


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
Set up an API token for your LLM provider. Pydantic works directly with OpenAI, Groq, and VertexAI.

but in this video, we will use Ollama now has built\-in compatibility with the OpenAI [Chat Completions API](https://github.com/ollama/ollama/blob/main/docs/openai.md), making it possible to use more tooling and applications with Ollama locally.


```python
client = AsyncOpenAI(
    base_url='http://localhost:11434/v1',
    api_key='your-api-key',
)

model = OpenAIModel('llama3.3:latest', openai_client=client)
```
we will use tavily to scrape the browser, filter, and aggregate data


```python
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")
if not TAVILY_API_KEY:
    raise ValueError("Please set TAVILY_API_KEY environment variable.")

tavily_client = AsyncTavilyClient(api_key=TAVILY_API_KEY)
```
We define three classes. The first `SearchDataclass`is a data class designed to store search\-related information, specifically the maximum number of results (`max_results`) and today's date (`todays_date`).

The second class `ResearchDependencies`is another data class that stores only today's date.

The third class, `ResearchResult`, extends `BaseModel` and represents a research article, containing fields for the article's title (`research_title`), main body (`research_main`), and a set of bullet points summarizing key points (`research_bullets`).

The `Field` function is used to add descriptions to each attribute, which helps with validation and documentation.


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
I create a `Agent` LLama3\.3 for research tasks. It uses the `ResearchDependencies` data class for input and the `ResearchResult` class for output. Then we write a **system prompt**, which instructs it to identify keywords from a query, perform multiple searches, and then combine those results into a detailed response.


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
we create an add\_current\_date function to instruct the agent to identify strong keywords from a given question, perform 3–5 searches with those keywords, and combine the results into a detailed response while ensuring the information is accurate and current.


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
We define two asynchronous functions: `get_search` and `do_search`.

* `get_search` is a tool used by the `search_agent` to perform a search. It takes in the search query and the search context (including the max results) and uses the `tavily_client` to retrieve the search results, returning them as a dictionary.
* `do_search` prepares the necessary dependencies by creating an instance of `SearchDataclass` (which includes the current date and max results). It then runs `search_agent` with these dependencies and the query, awaiting the results.


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
Let’s set up a Streamlit app where the user can input a query and specify the number of search results to retrieve. After we click the button to initiate the search, the app fetches the relevant research data (including the title, main article, and key takeaways) and displays it in an organized format.


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

## Conclusion:

Pydantic AI is a fantastic library, but there are many ways to do the same thing. It took me a lot of effort to understand and use the examples I show here. I hope you can use these examples to get up to speed with Pydantic faster and with less effort than I did.

Whether building a simple chatbot or a complex system, PydanticAI offers features that make the development process smoother and the final product more dependable.


> ***🧙‍♂️ I am an AI Generative expert! If you want to collaborate on a project, drop an [inquiry here](https://docs.google.com/forms/d/e/1FAIpQLSelxGSNOdTXULOG0HbhM21lIW_mTgq7NsDbUTbx4qw-xLEkMQ/viewform) or Book a [1\-on\-1 Consulting](https://calendly.com/gao-dalie/ai-consulting-call) Call With Me.***

*📚Feel free to check out my other articles:*


