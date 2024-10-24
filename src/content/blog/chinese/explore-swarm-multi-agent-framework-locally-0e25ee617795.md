---
title: "本地探索 Swarm 多智能体框架"
meta_title: "本地探索 Swarm 多智能体框架"
description: "Swarm 是一个实验性示例框架，用于模拟轻量级多代理框架，用于教育目的。通常它与 Open… 配合使用"
date: 2024-10-23T11:56:14Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*0ZVceq32bvkytC7HSIgmwA.png"
categories: ["agents"]
author: "Rifx.Online"
tags: ["agents"]
draft: False

---





![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*zkpW8DDwh0TTYuHJVJbDaw.png)

Swarm 是一个实验性样本框架，用于模拟轻量级多智能体框架，旨在教育目的。通常它与 Open AI Key 一起使用，但我们可以更改为使用本地的 Ollama 或 LM Studio 模型。

**设置：**


```python
## 创建一个新的 Conda 或 Python 虚拟环境并激活它
conda install python==3.10
pip install torch openai
pip install transformers accelerate huggingface_hub
pip install git+ssh://git@github.com/openai/swarm.git
```
**使用 Open AI Key：**


```python
export OPEN_API_KEY = Your Key
```
**使用 Ollama 或 LM Studio 本地 LLM — 更新为本地 URL：**


```python
## 查找 conda 或 python 虚拟环境中的 site-packages/swarm
## 找到文件 core.py
class Swarm:
    def __init__(self, client=None):
        if not client:
          # 实际代码
          #client = OpenAI()
          # 将基础 URL 和 API Key 更新为 Ollama / LM Studio
          # 在本演示中，我们使用 LM Studio 和 Llama 3.1
          client = OpenAI(base_url="http://localhost:1234/v1",api_key="random")
        self.client = client
```
**克隆仓库：**

克隆仓库 — 在这里您可以找到不同用例的示例目录，如基本、航空公司和天气等。


```python
git clone https://github.com/openai/swarm.git
cd swarm/examples
```
**示例代码：**


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
**参考文献：**


```python
https://github.com/openai/swarm

https://github.com/victorb/ollama-swarm/tree/main
```
![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*hCFJ4VQoT12yElYPXwXvWA.png)

鉴于这是一个实验性版本，仍有很大的改进空间。航空代理示例代码 [swarm/examples/airline] 非常有趣，因此可以尝试这些示例。试试看，并在评论中分享您的经验。谢谢。

