---
title: "Multi-Agent AI Architecture with Large Language Models (LLMs)"
meta_title: "Multi-Agent AI Architecture with Large Language Models (LLMs)"
description: "This article discusses the integration of Multi-Agent Architecture with Large Language Models (LLMs), showcasing its effectiveness in addressing complex tasks that require collaboration and advanced reasoning. It highlights how autonomous agents powered by LLMs can independently make decisions and communicate using natural language. The article also provides a practical implementation example using the Swarm framework, demonstrating how multiple agents can coordinate to extract and summarize news based on user queries. Overall, it emphasizes the scalability and versatility of multi-agent systems enhanced by LLMs."
date: 2024-12-27T10:48:53Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*mDld8-UAl8yND332Pw9kgg.png"
categories: ["Programming", "Machine Learning", "Natural Language Processing"]
author: "Rifx.Online"
tags: ["Multi-Agent", "LLMs", "Collaboration", "Swarm", "Summarization"]
draft: False

---





### End To End Multi\-Agent Implementation With LLMs

A multi\-agent architecture consists of multiple autonomous agents collaborating to accomplish complex tasks. With the recent advancements in LLMs, this architecture has gained significant popularity.

These agents are capable of making decisions and performing actions independently. The agents are powered by large language models (LLMs).

The way multi\-agents architecture works is that you do not have to specify every single step, we can give them a goal and they can figure out the sequence of actions.

These architectures are used in diverse fields like robotics, virtual assistants, collaborative decision\-making, and multi\-modal processing where tasks require dynamic interaction and high\-level reasoning.


## 1\. Article Overview

This article explores the integration of Multi\-Agent Architecture with Large Language Models (LLMs), emphasizing its ability to tackle complex challenges that demand coordination, scalability, and advanced intelligence.

1. It outlines how autonomous agents, equipped with LLMs, collaborate effectively by leveraging their capabilities to understand and generate human\-like text.
2. The article also presents a complete implementation of a multi\-agent application using LLMs, providing a practical guide to this innovative framework.

When integrated with large language models (LLMs), the multi\-agent architecture becomes a powerful paradigm for solving problems that require coordination, scalability, and intelligence.

A multi\-agent architecture with LLMs involves a system of multiple autonomous agents, each equipped with large language models, collaborating to solve complex problems by leveraging their ability to understand and generate human\-like text.




## 2\. Overview of Multi\-Agent Architecture with LLMs

Let’s understand the key aspects of a multi\-agent architecture:

A multi\-agent architecture with LLM consists of multiple agents, each functioning independently with its own goals, decision\-making abilities, and data access while playing one or more roles within the environment. They are backed by LLMs.

The integration of LLMs enhances the system’s ability to process natural language inputs, generate context\-aware outputs, and adapt to a variety of scenarios, making multi\-agent systems more efficient and versatile.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*8Xq3XujUzubGyiPJZRJJZA.png)


### Agent

* An agent is a goal\-oriented software component that operates within an environment by observing its state, formulating a plan, and executing actions to achieve its objectives. It is a system that uses LLM to control the flow of the application.
* Agents can have context and memory. An agent is usually a specialist who handles specific sub\-tasks, such as data preprocessing, querying the LLM, or analyzing results.
* Agents may use reinforcement learning or other techniques to improve their performance over time. One or more agents utilize LLMs to perform natural language understanding, reasoning, or generation tasks.
* An `Agent` encompasses `instructions` and `tools`, and can at any point choose to hand off a conversation to another `Agent`.
* For instance, we might have a Sales Agent, a Finance Analyst Agent and/or a Quant Agent in our application. These agents are specialists in their domains. They have specific prompts and tools configured that allow them to perform the required functions.

Agents interact with external systems or environments, gathering inputs and making decisions in real\-time.

* The agents communicate and coordinate with each other, often using natural language facilitated by LLMs, to share information, plan, and execute tasks collectively. Each agent can call one or many different LLMs that best meet the requirements.


### Tools

* Tools perform tasks. They do not have any decision\-making ability. They receive inputs and perform a set of steps based on the instructions. Think of them as reusable utility functions.
* Examples of tools can be a function that calls an LLM to rewrite the input, a function that uses Yahoo Finance to find news about a company, a provider that gets data from an API, a repository function that queries a database, etc.


### Note On Multi\-Agent Architecture Design

* It’s important to ensure the architecture can scale. Multi\-agent architecture is usually scaled by adding more agents horizontally.
* The agents are distributed as separate processes to reduce the risk of failure and fault tolerance/auto\-recovery is usually built into the architecture so they can recover from the last checkpoint.
* Ensure, the design of the system is modular so that the agents can be independently developed, tested, and deployed, ensuring flexibility in system design.

There are several multi\-agent LLM frameworks available:


### 1\. Swarm by OpenAI

* **Pro**: Scales efficiently for distributed tasks requiring collaboration among multiple agents.
* **Con**: Still in experimental stages, with limited community support and documentation.


### 2\. LangGraph Agents

* **Pro**: Offers robust integrations with various tools and APIs, making it highly versatile for diverse use cases.
* **Con**: Complexity increases with the number of agents and requires careful management to avoid resource bottlenecks.


### 3\. Auto\-GPT

* **Pro**: Designed for autonomous task execution, enabling end\-to\-end workflows with minimal manual intervention.
* **Con**: High computational cost and potential inefficiency for simpler tasks due to its broad task exploration approach.


## 3\. End To End Implementation Of Multi\-Agent Architecture Using LLM

This section aims to provide an example of a multi\-agent architecture using LLMs. I will be using the OpenAI framework [**swarm**](https://github.com/openai/swarm/tree/main), an educational framework exploring ergonomic, lightweight multi\-agent orchestration.

The example I have prepared is simplistic but can demonstrate how to build a multi\-agent architecture using LLMs.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*CO0B6c5NMbK-gEsapoGjpg.png)

The reason for using Swarm is that it focuses on making agent coordination and execution lightweight, highly controllable, and easily testable.

Essentially, the way swarm works is that when the function `run()` is called, it performs the following steps:

1. Get a completion from the current Agent
2. Execute tool calls and append results
3. Switch Agent if necessary
4. Update context variables, if necessary
5. If no new function calls, return


### Let’s start coding


### Step 1: Create a virtual environment and install Python Packages


```python
pip install git+https://github.com/openai/swarm.git
pip install openai==1.58.1
pip install yahoo_fin==0.8.9.1


```

### Step 2: Create a main.py file


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
        return f"Error fetching news from Yahoo Finance: {e}"


def google_extract_tool():
    keyword = context_variables['name']
    # General news extraction using web scraping
    try:
        keyword_encoded = keyword.replace(" ", "+")
        rss_url = f"https://news.google.com/rss/search?q={keyword_encoded}&hl=en-US&gl=US&ceid=US:en"

        # Fetch and parse the RSS feed
        feed = feedparser.parse(rss_url)
        return list(map(lambda entry: entry.title, feed.entries))
    except Exception as e:
        return f"Error fetching general news: {e}"


company_news_extractor_agent = Agent(
    name="company_news_extractor_agent",
    description="""
                    Calls yahoo finance tool and then call summariser
                    """,
    functions=[yahoo_finance_tool, transfer_to_summariser_agent])

person_news_extractor_agent = Agent(
    name="person news extractor agent",
    description="""
                    Calls google tool and then call summariser
                    """,
    functions=[google_extract_tool, transfer_to_summariser_agent])

summariser_agent = Agent(
    name='NewsSummarizerAgent',
    instructions="""You are an economist. Summarize the following news in 3 sentences."""
)


def coordinate(name, type):
    context_variables['name'] = name
    if type == 'company_news_agent_extractor' or type == 'company':
        return company_news_extractor_agent
    elif type == 'person_news_extractor_agent' or type == 'person':
        return person_news_extractor_agent
    raise Exception(f'cannot handle the type={type}')


context_variables = {}
coordinator_agent = Agent(
    name="Coordinator Agent",
    instructions=f"""You are to coordinate users requests, and call a tool to transfer to the right intent.
    You dont need to know specifics, just the topic of the request.
    If the user request is about a company, transfer to company_news_extractor_agent.
    If the user request is about a person, transfer to the person_news_extractor_agent
    """,
    functions=[coordinate],
    context_variables=context_variables,
    debug=True
)

## Main execution
if __name__ == "__main__":
    # Initialize the swarm and agents
    client = Swarm()

    # Examples
    user_query = [{"role": "user", "content": "What are the latest updates about AAPL?"}]
    summary = client.run(agent=coordinator_agent, messages=user_query)
    print("\nFinal Summary:")
    print(summary.messages[3]['content'])

    user_query = [{"role": "user", "content": "What are the latest updates about Trump?"}]
    summary = client.run(agent=coordinator_agent, messages=user_query)
    print("\nFinal Summary:")
    print(summary.messages[3]['content'])
```
The way the application works is this:

1. The input is passed to the `coordinator agent`
2. The coordinator agent uses the OpenAI API to detect if the query is about a person or a company
3. If it’s about a `person`, the coordinator agent passes it to the `person news extractor agent`, that uses a Google RSS tool to extract the news.
4. If the query is about a `company` then the coordinator agent passes it to the `company news extractor agent` that uses a Yahoo finance tool to extract the news.
5. Finally, the news is passed to the `summariser agent` that summarises the news via Open AI LLM.

This is a simple example but demonstrates using a coordinator, multiple agents, and tools and how they can use an LLM to prepare a plan. Approaches like Swarm are ideal for scenarios involving numerous independent capabilities and complex instructions that cannot be effectively encapsulated in a single prompt.


## Summary

This article provided an overview of Multi\-Agent Architecture integrated with Large Language Models (LLMs), highlighting its potential for solving complex problems requiring coordination, scalability, and intelligence.

It discussed the concept of multi\-agent systems where autonomous agents, powered by LLMs, work collaboratively by leveraging their human\-like text understanding and generation capabilities.

Additionally, the article included an end\-to\-end implementation of a multi\-agent application using LLMs, offering practical insights into this innovative approach.


