---
title: "Building a Local AI-Powered News Aggregator with Ollama, Swarm, and DuckDuckGo"
meta_title: "Building a Local AI-Powered News Aggregator with Ollama, Swarm, and DuckDuckGo"
description: "No subtitle provided"
date: 2024-10-24T17:47:43Z
image: "https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*OHMOTk_WYGOxWHBsKqdpNQ.jpeg"
categories: ["Programming", "Generative AI", "Technology/Web"]
author: "Rifx.Online"
tags: ["Llama", "Swarm", "DuckDuckGo", "News", "Aggregator"]
draft: False

---


# Building a Local AI-Powered News Aggregator with Ollama, Swarm, and DuckDuckGo



In today’s fast-paced world, staying up-to-date with the latest news in specific fields can be challenging. What if we could leverage the power of Generative AI and Agents to create a personalized news aggregator that runs entirely on our local machine? In this article, we’ll explore how to build such a system using **Ollama**’s Llama 3.2 model, **Swarm** for agent orchestration, and **DuckDuckGo** for web searches.


# The Power of Local AI

With the rise of large language models, we now have the ability to run sophisticated AI systems on our personal computers. This opens up a world of possibilities for creating customized tools tailored to our specific needs. Our news aggregator is a perfect example of this potential.


# Components of Our System

1. **Ollama with Llama 3.2**: This serves as the brain of our system, powering our AI agents.
2. **Swarm**: An agent orchestration framework that allows us to create and manage multiple AI agents.
3. **DuckDuckGo Search**: Provides up-to-date web search results without tracking user data.


# How It Works

Our news aggregator consists of two main AI agents:

1. **News Assistant**: Fetches the latest news articles on a given topic using DuckDuckGo search.
2. **Editor Assistant**: Reviews and refines the collected news for final presentation.

Let’s break down the workflow:


# 1. Setting Up the Environment


```python
ollama pull llama3.2

export OPENAI_MODEL_NAME=llama3.2
export OPENAI_BASE_URL=http://localhost:11434/v1
export OPENAI_API_KEY=any

pip install git+https://github.com/openai/swarm.git duckduckgo-search
```
We start by importing the necessary libraries and initializing our Swarm client:


```python
from duckduckgo_search import DDGS
from swarm import Swarm, Agent
from datetime import datetime

current_date = datetime.now().strftime("%Y-%m")
client = Swarm()
```

# 2. Creating the News Search Function

We define a function to search for news using DuckDuckGo:


```python
pythondef get_news_articles(topic):
  ddg_api = DDGS()
  results = ddg_api.text(f"{topic} {current_date}", max_results=5)
  if results:
      news_results = "\n\n".join([f"Title: {result['title']}\nURL: {result['href']}\nDescription: {result['body']}" for result in results])
      return news_results
  else:
      return f"Could not find news results for {topic}."
```

# 3. Defining Our AI Agents

We create two agents using Ollama’s Llama 3.2 model:


```python
news_agent = Agent(
  model="llama3.2",
  name="News Assistant",
  instructions="You provide the latest news articles for a given topic using DuckDuckGo search.",
  functions=[get_news_articles],
)

editor_agent = Agent(
  model="llama3.2",
  name="Editor Assistant",
  instructions="You review and finalise the news article for publishing.",
)
```

# 4. Orchestrating the Workflow

We define a function to run our news aggregation workflow:


```python
def run_news_workflow(topic):
  # Fetch news
  news_response = client.run(
      agent=news_agent,
      messages=[{"role": "user", "content": f"Get me the news about {topic} on {current_date}"}],
  )
  raw_news = news_response.messages[-1]["content"]
  
  # Pass news to editor for final review
  edited_news_response = client.run(
      agent=editor_agent,
      messages=[{"role": "system", "content": raw_news}],
  )
  print(f"{edited_news_response.messages[-1]['content']}")
```

# 5. Running the System

Finally, we can run our news aggregator for any topic of interest:


```python
run_news_workflow("AI in Drug Discovery")
```

# Complete Code : app.py


```python
from duckduckgo_search import DDGS
from swarm import Swarm, Agent
from datetime import datetime

current_date = datetime.now().strftime("%Y-%m")

# Initialize Swarm client
client = Swarm()

# 1. Create Internet Search Tool

def get_news_articles(topic):
    print(f"Running DuckDuckGo news search for {topic}...")
    
    # DuckDuckGo search
    ddg_api = DDGS()
    results = ddg_api.text(f"{topic} {current_date}", max_results=5)
    if results:
        news_results = "\n\n".join([f"Title: {result['title']}\nURL: {result['href']}\nDescription: {result['body']}" for result in results])
        return news_results
    else:
        return f"Could not find news results for {topic}."
    
# 2. Create AI Agents

def transfer_to_editor_assistant(raw_news):
    print("Passing articles to Editor Assistant...")
    return editor_agent.run({"role": "system", "content": raw_news})

# News Agent to fetch news
news_agent = Agent(
    model="llama3.2",
    name="News Assistant",
    instructions="You provide the latest news articles for a given topic using DuckDuckGo search.",
    functions=[get_news_articles],
)

# Editor Agent to edit news
editor_agent = Agent(
    model="llama3.2",
    name="Editor Assistant",
    instructions="You review and finalise the news article for publishing.",
)

# 3. Create workflow

def run_news_workflow(topic):
    print("Running news Agent workflow...")
    
    # Step 1: Fetch news
    news_response = client.run(
        agent=news_agent,
        messages=[{"role": "user", "content": f"Get me the news about {topic} on {current_date}"}],
    )
    raw_news = news_response.messages[-1]["content"]
    print(f"Fetched news: {raw_news}")
    
    # Step 2: Pass news to editor for final review
    edited_news_response = client.run(
        agent=editor_agent,
        messages=[{"role": "system", "content": raw_news}],
    )
    print(f"{edited_news_response.messages[-1]['content']}")


# Example of running the news workflow for a given topic
run_news_workflow("AI in Drug Discovery")
```

# Sample Output


```python
Running news Agent workflow...
Running DuckDuckGo news search for AI in Drug Discovery...
Fetched news: Here's a formatted answer based on the news articles:

**AI in Drug Discovery: A Revolutionary Shift**

The role of Artificial Intelligence (AI) in drug discovery has marked a revolutionary shift in the pharmaceutical landscape. AI leverages sophisticated algorithms for autonomous decision-making from data analysis, augmenting human capabilities rather than replacing them.

**Challenges and Limitations**

Despite the promising advancements, challenges and limitations have been identified in the field. The paper "The Role of AI in Drug Discovery" addresses these issues, highlighting the need for high-quality data, addressing ethical concerns, and recognizing the limitations of AI-based approaches.

**Applications of AI in Drug Discovery**

AI has the potential to play a critical role in drug discovery, design, and studying drug-drug interactions.Applications of AI in drug discovery include:

* Polypharmacology: AI can predict the likelihood of a compound's effectiveness against multiple diseases.
* Chemical synthesis: AI can optimize chemical synthesis processes for faster and more efficient production.
* Drug repurposing: AI can identify new uses for existing drugs.
* Predicting drug properties: AI can predict the efficacy, toxicity, and physicochemical characteristics of compounds.

**The Future of AI in Drug Discovery**

As AI continues to evolve, it is expected to significantly impact the pharmaceutical industry. The successful application of AI will depend on the availability of high-quality data, addressing ethical concerns, and recognizing the limitations of AI-based approaches.
```

# The Benefits of Local AI News Aggregation

* **Privacy**: All processing happens on your local machine, ensuring your data stays with you.
* **Customization**: You can easily modify the agents’ instructions or add new agents to suit your specific needs.
* **Up-to-date Information**: By using DuckDuckGo search, you always get the latest news on your chosen topic.
* **AI-powered Curation**: The Editor Assistant helps refine and organize the collected news, providing a more polished final output.


# Conclusion

This local AI-powered news aggregator demonstrates the potential of combining large language models with web search capabilities. By leveraging Ollama’s Llama 3.2 model, Swarm for agent orchestration, and DuckDuckGo for search, we’ve created a powerful tool that can keep us informed on any topic of interest, all while maintaining our privacy and running entirely on our local machine.

As AI continues to evolve, the possibilities for creating personalized, AI-driven tools will only expand. This news aggregator is just the beginning — imagine what other innovative applications you could build using these technologies!


# Reference :

Swarm Github : <https://github.com/openai/swarm>

If you found this article informative and valuable, I’d greatly appreciate your support:

* Give it a few claps 👏 on Medium to help others discover this content (did you know you can clap up to 50 times?). Your claps will help spread the knowledge to more readers.
- Share it with your network of AI enthusiasts and professionals.
- Connect with me on LinkedIn: <https://www.linkedin.com/in/manjunath-janardhan-54a5537/>





