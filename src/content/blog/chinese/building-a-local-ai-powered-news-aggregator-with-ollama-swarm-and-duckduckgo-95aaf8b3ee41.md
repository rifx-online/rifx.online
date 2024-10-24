---
title: "使用 Ollama、Swarm 和 DuckDuckGo 构建本地 AI 新闻聚合器"
meta_title: "使用 Ollama、Swarm 和 DuckDuckGo 构建本地 AI 新闻聚合器"
description: "没有提供字幕"
date: 2024-10-23T10:49:58Z
image: "https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*OHMOTk_WYGOxWHBsKqdpNQ.jpeg"
categories: ["agents"]
author: "Rifx.Online"
tags: ["agents"]
draft: False

---

# 使用OllamaSwarm和DuckDuckGo构建本地AI驱动的新闻聚合器



在当今快节奏的世界中，跟上特定领域最新新闻的步伐可能会很具挑战性。如果我们能够利用生成式AI和代理的力量，创建一个完全在本地机器上运行的个性化新闻聚合器呢？在本文中，我们将探讨如何使用**Ollama**的Llama 3.2模型、**Swarm**进行代理编排，以及**DuckDuckGo**进行网络搜索来构建这样的系统。

# 本地AI的力量

随着大型语言模型的兴起，我们现在能够在个人电脑上运行复杂的AI系统。这为创建针对我们特定需求定制的工具开辟了无限可能。我们的新闻聚合器就是这一潜力的完美例证。

# 我们系统的组成部分

1. **Ollama with Llama 3.2**: 这是我们系统的核心，为我们的AI代理提供动力。
2. **Swarm**: 一个代理编排框架，允许我们创建和管理多个AI代理。
3. **DuckDuckGo Search**: 提供最新的网页搜索结果，而不跟踪用户数据。

# 工作原理

我们的新闻聚合器由两个主要的AI代理组成：

1. **新闻助手**：使用DuckDuckGo搜索获取特定主题的最新新闻文章。
2. **编辑助手**：审查并精炼收集到的新闻以供最终展示。

让我们来分解一下工作流程：

# 1. 设置环境


```python
ollama pull llama3.2

export OPENAI_MODEL_NAME=llama3.2
export OPENAI_BASE_URL=http://localhost:11434/v1
export OPENAI_API_KEY=any

pip install git+https://github.com/openai/swarm.git duckduckgo-search
```
我们首先导入必要的库并初始化我们的 Swarm 客户端：


```python
from duckduckgo_search import DDGS
from swarm import Swarm, Agent
from datetime import datetime

current_date = datetime.now().strftime("%Y-%m")
client = Swarm()
```

# 2. 创建新闻搜索功能

我们定义一个函数来使用 DuckDuckGo 搜索新闻：

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

# 3. 定义我们的 AI 代理

我们使用 Ollama 的 Llama 3.2 模型创建两个代理：


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

# 4. 协调工作流程

我们定义一个函数来运行我们的新闻聚合工作流程：

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

# 5. 运行系统

最后，我们可以针对任何感兴趣的话题运行我们的新闻聚合器：


```python
run_news_workflow("AI in Drug Discovery")
```

# 完整代码 : app.py


```python
from duckduckgo_search import DDGS
from swarm import Swarm, Agent
from datetime import datetime

current_date = datetime.now().strftime("%Y-%m")

# 初始化 Swarm 客户端
client = Swarm()

# 1. 创建互联网搜索工具

def get_news_articles(topic):
    print(f"正在为 {topic} 进行 DuckDuckGo 新闻搜索...")
    
    # DuckDuckGo 搜索
    ddg_api = DDGS()
    results = ddg_api.text(f"{topic} {current_date}", max_results=5)
    if results:
        news_results = "\n\n".join([f"标题: {result['title']}\n网址: {result['href']}\n描述: {result['body']}" for result in results])
        return news_results
    else:
        return f"未能找到关于 {topic} 的新闻结果。"
    
# 2. 创建 AI 代理

def transfer_to_editor_assistant(raw_news):
    print("将文章传递给编辑助手...")
    return editor_agent.run({"role": "system", "content": raw_news})

# 新闻代理以获取新闻
news_agent = Agent(
    model="llama3.2",
    name="新闻助手",
    instructions="您提供有关给定主题的最新新闻文章，使用 DuckDuckGo 搜索。",
    functions=[get_news_articles],
)

# 编辑代理以编辑新闻
editor_agent = Agent(
    model="llama3.2",
    name="编辑助手",
    instructions="您审阅并最终确定新闻文章以供发布。",
)

# 3. 创建工作流程

def run_news_workflow(topic):
    print("运行新闻代理工作流程...")
    
    # 第一步: 获取新闻
    news_response = client.run(
        agent=news_agent,
        messages=[{"role": "user", "content": f"获取关于 {topic} 在 {current_date} 的新闻"}],
    )
    raw_news = news_response.messages[-1]["content"]
    print(f"获取的新闻: {raw_news}")
    
    # 第二步: 将新闻传递给编辑进行最终审查
    edited_news_response = client.run(
        agent=editor_agent,
        messages=[{"role": "system", "content": raw_news}],
    )
    print(f"{edited_news_response.messages[-1]['content']}")


# 运行给定主题的新闻工作流程示例
run_news_workflow("药物发现中的 AI")
```

# 示例输出


```python
Running news Agent workflow...
Running DuckDuckGo news search for AI in Drug Discovery...
Fetched news: Here's a formatted answer based on the news articles:

**药物发现中的人工智能：革命性的转变**

人工智能（AI）在药物发现中的作用标志着制药领域的革命性转变。AI利用复杂的算法进行自主决策，从数据分析中增强人类能力，而不是取代它们。

**挑战与局限性**

尽管有着令人期待的进展，但在该领域中仍然存在挑战和局限性。论文《AI在药物发现中的作用》探讨了这些问题，强调了高质量数据的必要性、伦理问题的解决以及对基于AI的方法局限性的认识。

**AI在药物发现中的应用**

AI有潜力在药物发现、设计和研究药物间相互作用中发挥关键作用。AI在药物发现中的应用包括：

* 多靶点药理学：AI可以预测化合物对多种疾病的有效性。
* 化学合成：AI可以优化化学合成过程，以实现更快和更高效的生产。
* 药物重定位：AI可以识别现有药物的新用途。
* 预测药物特性：AI可以预测化合物的效力、毒性和物理化学特性。

**药物发现中AI的未来**

随着AI的不断发展，预计将对制药行业产生重大影响。AI的成功应用将依赖于高质量数据的可用性、伦理问题的解决以及对基于AI的方法局限性的认识。
```

# 本地 AI 新闻聚合的好处

* **隐私**：所有处理都在您的本地机器上进行，确保您的数据留在您自己手中。
* **定制化**：您可以轻松修改代理的指令或添加新的代理以满足您的特定需求。
* **最新信息**：通过使用 DuckDuckGo 搜索，您总是能获得关于您选择主题的最新新闻。
* **AI 驱动的策展**：编辑助手帮助精炼和组织收集的新闻，提供更精致的最终输出。

# 结论

这个本地的人工智能驱动新闻聚合器展示了将大型语言模型与网络搜索能力结合的潜力。通过利用Ollama的Llama 3.2模型、Swarm进行代理编排，以及DuckDuckGo进行搜索，我们创建了一个强大的工具，可以让我们在任何感兴趣的话题上保持信息灵通，同时维护我们的隐私，并完全在本地计算机上运行。

随着人工智能的不断发展，创建个性化、人工智能驱动工具的可能性只会不断扩大。这个新闻聚合器只是一个开始——想象一下，利用这些技术你还可以构建哪些其他创新应用！

# 参考：

Swarm Github : <https://github.com/openai/swarm>

如果您觉得这篇文章信息丰富且有价值，我将非常感谢您的支持：

* 在Medium上为它点赞几次 👏，帮助其他人发现这篇内容（您知道您可以点赞多达50次吗？）。您的点赞将帮助更多读者传播知识。
- 与您的AI爱好者和专业人士网络分享。
- 在LinkedIn上与我联系：<https://www.linkedin.com/in/manjunath-janardhan-54a5537/>



