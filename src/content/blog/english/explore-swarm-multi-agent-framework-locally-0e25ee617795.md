---
title: "Explore Swarm Multi-Agent Framework Locally"
meta_title: "Explore Swarm Multi-Agent Framework Locally"
description: "Swarm is an experimental sample framework to simulate lightweight multi-agent framework for educational purpose. Usually it works with Open…"
date: 2024-10-24T17:47:43Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*0ZVceq32bvkytC7HSIgmwA.png"
categories: ["Programming", "Technology", "Education"]
author: "Rifx.Online"
tags: ["Swarm", "Multi-Agent", "Framework", "OpenAI", "Ollama"]
draft: False

---






![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*zkpW8DDwh0TTYuHJVJbDaw.png)

Swarm is an experimental sample framework to simulate lightweight multi-agent framework for educational purpose. Usually it works with Open AI Key but we can change it to use local Ollama or LM Studio Models.

**Setup:**


```python
## Create a new Conda or Python Virtual Environment and activate it
conda install python==3.10
pip install torch openai
pip install transformers accelerate huggingface_hub
pip install git+ssh://git@github.com/openai/swarm.git
```
**To use with Open AI Key:**


```python
export OPEN_API_KEY = Your Key
```
**To use Ollama or LM Studio Local LLMs — Update to Local URL:**


```python
## Find the location site-packages/swarm on the conda or python virtual env
## Locate the file core.py
class Swarm:
    def __init__(self, client=None):
        if not client:
          # Actual Code
          #client = OpenAI()
          # Update the Base URL and API Key to Ollama / LM Studio
          # In this demo we are using LM Studio and Llama 3.1
          client = OpenAI(base_url="http://localhost:1234/v1",api_key="random")
        self.client = client
```
**Clone Repo:**

Clone the Repo — where you can find examples directory with different use cases like basic, airline and weather etc.


```python
git clone https://github.com/openai/swarm.git
cd swarm/examples
```
**Sample Code:**


```python
from swarm import Swarm, Agent

client = Swarm()


it_agent = Agent(
    name="IT Agent",
    instructions="You are an IT Expert with 10 Years of Experience.",
)

sales_agent = Agent(
    name="Sales Agent",
    instructions="You are a Sales Expert with 5 Years of Experience and knows about best selling mobiles.",
)

def transfer_to_sales_agent():
    print("Sales agent in action")
    """Transfer sales related questions to sales team immediately."""
    return sales_agent

def transfer_to_it_agent():
    print("IT agent in action")
    """Transfer IT users immediately."""
    return it_agent

english_agent = Agent(
    name="English Agent",
    instructions="You only speak English.",
    functions=[transfer_to_sales_agent,transfer_to_it_agent],
)


messages = [{"role": "user", "content": "How to install pandas lib?"}]
response = client.run(agent=english_agent, messages=messages)

print(response.messages[-1]["content"])

messages = [{"role": "user", "content": "What are the best selling items?"}]
response = client.run(agent=english_agent, messages=messages)

print(response.messages[-1]["content"])
```
**References:**


```python
https://github.com/openai/swarm

https://github.com/victorb/ollama-swarm/tree/main
```
![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*hCFJ4VQoT12yElYPXwXvWA.png)

Given that it is an experimental release, there is still much room for improvement. The airline agent example code [swarm/examples/airline] was interesting, so try those examples. Give it a try and share your experience in the comments. Thanks.


