---
title: "掌握CrewAI秘籍 3：如何让你的AI代理获取知识，实现智能对话？"
meta_title: "掌握CrewAI秘籍 3：如何让你的AI代理获取知识，实现智能对话？"
description: "在CrewAI中，“知识”系统允许AI代理在执行任务时访问外部信息源，如文本文件和结构化数据。通过示例代码，展示了如何利用`StringKnowledgeSource`和自定义知识源来增强代理的决策能力。代理可以基于提供的知识源回答用户问题，确保响应的准确性和上下文一致性。此外，文章介绍了如何创建自定义知识源，以从外部API获取数据并整合到代理的工作流程中，从而提高决策的实时性和可靠性。"
date: 2025-01-05T02:27:04Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*38D5ZyX6EzjY1QKm16Bl_g.jpeg"
categories: ["Programming", "Machine Learning", "Natural Language Processing"]
author: "Rifx.Online"
tags: ["knowledge", "integration", "APIs", "chunking", "customization"]
draft: False

---



### 知识 — CrewAI



在 CrewAI 中，“知识”是允许 AI 代理在执行任务时访问和利用外部信息源的系统。我们可以把它看作是为我们的代理提供了一个参考图书馆，以便在工作时咨询。

* 文本来源：原始字符串、文本文件、pdf 等…
* 结构化数据：CSV、excel、json 等…

上一章：

让我们创建一个新项目来使用“知识” (*openai \>\> gpt\-4o\-mini*)。

```python
crewai create crew knowledge_example
```
在这个示例中，代理利用提供的知识源回答有关用户的问题，展示了如何将外部信息整合到代理的决策过程中。

```python
## crew.py

from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.knowledge.source.string_knowledge_source import StringKnowledgeSource
from dotenv import load_dotenv

load_dotenv()


content = "Users name is John. He is 30 years old and lives in San Francisco."
string_source = StringKnowledgeSource(
    content=content,
    metadata={"source": "user_profile"}
)


@CrewBase
class KnowledgeExample():
 
 agents_config = 'config/agents.yaml'
 tasks_config = 'config/tasks.yaml'

 @agent
 def john(self) -> Agent:
  return Agent(
   config=self.agents_config['john'],
   verbose=True
  )

 @task
 def john_task(self) -> Task:
  return Task(
   config=self.tasks_config['john_task'],
  )

 @crew
 def crew(self) -> Crew:

  return Crew(
   agents=self.agents, # 由 @agent 装饰器自动创建
   tasks=self.tasks, # 由 @task 装饰器自动创建
   process=Process.sequential,
   verbose=True,
   knowledge_sources=[string_source]
  )
```
我们使用 `StringKnowledgeSource` 传递了一些基于字符串的知识，并通过将 `knowledge_sources = [string_source]` 设置在 `Crew` 中。

```python
from crewai.knowledge.source.string_knowledge_source import StringKnowledgeSource

...

content = "Users name is John. He is 30 years old and lives in San Francisco."
string_source = StringKnowledgeSource(
    content=content,
 metadata={"source": "user_profile"}
)

...

    return Crew(
       agents=self.agents, 
       tasks=self.tasks, 
       process=Process.sequential,
       verbose=True,
       knowledge_sources=[string_source]
      )
```
其余的 Crew 代码：

```python
## main.py
import sys
import warnings

from crew import KnowledgeExample

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

def run():
    """
    运行 Crew。
    """
    inputs = {
        'question': '约翰住在哪个城市，他多大了？'
    }
    KnowledgeExample().crew().kickoff(inputs=inputs)

run()
```

```python
// agents.yaml

john:
  role: >
    关于用户
  goal: >
    你了解用户的所有信息。
  backstory: >
    你擅长理解人及其偏好。
```

```python
// tasks.yaml

john_task:
  description: >
    回答以下关于用户的问题：{question}
  expected_output: >
    问题的答案。
  agent: john
```
运行 Crew：

```python
python knowledge_example/src/knowledge_example/main.py
```
输出：

```python
venv) ➜  crewai-demo python knowledge_example/src/knowledge_example/main.py
## 代理: 关于用户
### 任务: 回答以下关于用户的问题：约翰住在哪个城市，他多大了？



## 代理: 关于用户
### 最终答案: 
约翰住在旧金山，他 30 岁。
```
我们还可以在传递知识时自定义配置。

```python
## 分块处理

knowledge_source = StringKnowledgeSource(
    content="长内容...",
    chunk_size=4000,     # 每个块的字符数（默认）
    chunk_overlap=200    # 块之间的重叠（默认）
)


## 嵌入

...
string_source = StringKnowledgeSource(
    content="Users name is John. He is 30 years old and lives in San Francisco.",
)
crew = Crew(
    ...
    knowledge_sources=[string_source],
    embedder={
        "provider": "openai",
        "config": {"model": "text-embedding-3-small"},
    },
)
```
要清除 Crew 中的知识：

```python
crewai reset-memories --knowledge
```

### 自定义知识源

可以使用 `BaseKnowledgeSource` 类创建自定义知识源包装器。

```python
## knowledge.py (创建一个新文件)

import requests
import uuid
from crewai.knowledge.source.base_knowledge_source import BaseKnowledgeSource
from pydantic import BaseModel, Field
from typing import Dict, Any


class SpaceNewsKnowledgeSource(BaseKnowledgeSource):
    """从 Space News API 获取数据的知识源。"""

    api_endpoint: str = Field(description="API 端点 URL")
    limit: int = Field(default=10, description="要获取的文章数量")
    metadata: Dict[str, Any] = Field(default_factory=dict)

    def load_content(self) -> Dict[Any, str]:
        """获取并格式化太空新闻文章。"""
        try:
            response = requests.get(
                f"{self.api_endpoint}?limit={self.limit}"
            )
            response.raise_for_status()

            data = response.json()
            articles = data.get('results', [])

            formatted_data = self._format_articles(articles)
            return {self.api_endpoint: formatted_data}
        except Exception as e:
            raise ValueError(f"获取太空新闻失败: {str(e)}")
        
    def add(self) -> None:
        """处理并存储文章。"""
        content = self.load_content()
        for _, text in content.items():
            chunks = self._chunk_text(text)
            self.chunks.extend(chunks)
            chunks_metadata = [
                {
                    "chunk_id": str(uuid.uuid4()),
                    "source": self.api_endpoint,
                    "description": f"来自 API {self.api_endpoint} 的第 {i + 1} 段"
                }
                for i in range(len(chunks))
            ]

        self.save_documents(metadata=chunks_metadata)
        
    def _format_articles(self, articles: list) -> str:
        """将文章格式化为可读文本。"""
        formatted = "太空新闻文章:\n\n"
        for article in articles:
            formatted += f"""
                标题: {article['title']}
                发布: {article['published_at']}
                摘要: {article['summary']}
                新闻网站: {article['news_site']}
                URL: {article['url']}
                -------------------"""
        return formatted
```
在这里，我们通过重写 `load_content` 和 `add` 方法的行为扩展了 `BaseKnowledgeSource` 类。此实现从外部 API 获取新闻并总结内容。

更新的文件：

```python
## main.py
import sys
import warnings

from crew import KnowledgeExample

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

def run():
    """
    运行 crew。
    """
    inputs = {
        # 'question': '约翰住在哪个城市，他多大了？'
        "user_question": "太空探索的最新进展是什么？"
    }
    KnowledgeExample().crew().kickoff(inputs=inputs)

run()
```

```python
## crew.py

from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.knowledge.source.string_knowledge_source import StringKnowledgeSource
from dotenv import load_dotenv
from knowledge import SpaceNewsKnowledgeSource

load_dotenv()


## content = "用户的名字是约翰。他 30 岁，住在旧金山。"
## string_source = StringKnowledgeSource(
##     content=content,
##  metadata={"source": "user_profile"}
## )

recent_news = SpaceNewsKnowledgeSource(
    api_endpoint="https://api.spaceflightnewsapi.net/v4/articles",
    limit=10,
 metadata={"source": "space_news"}
)


@CrewBase
class KnowledgeExample():
 
 agents_config = 'config/agents.yaml'
 tasks_config = 'config/tasks.yaml'

 # @agent
 # def john(self) -> Agent:
 #  return Agent(
 #   config=self.agents_config['john'],
 #   verbose=True
 #  )

 @agent
 def space_analyst(self) -> Agent:
  return Agent(
   config=self.agents_config['space_analyst'],
   verbose=True,
   knowledge_sources=[recent_news],
  )

 # @task
 # def john_task(self) -> Task:
 #  return Task(
 #   config=self.tasks_config['john_task'],
 #  )
 
 @task
 def analysis_task(self) -> Task:
  return Task(
   config=self.tasks_config['analysis_task'],
  )
 
 @crew
 def crew(self) -> Crew:

  return Crew(
   agents=self.agents, # 由 @agent 装饰器自动创建
   tasks=self.tasks, # 由 @task 装饰器自动创建
   process=Process.sequential,
   verbose=True,
  )
```

```python
## agents.yaml

## john:
##   role: >
##     关于用户
##   goal: >
##     你了解用户的所有信息。
##   backstory: >
##     你擅长理解人和他们的偏好。

space_analyst:
  role: >
    太空新闻分析师
  goal: >
    准确、全面地回答有关太空新闻的问题
  backstory: >
    你是一名具有太空探索、卫星技术和太空产业趋势专业知识的太空行业分析师。你擅长回答有关太空新闻的问题，并提供详细、准确的信息。
```

```python
## tasks.yaml

## john_task:
##   description: >
##     回答关于用户的以下问题: {question}
##   expected_output: >
##     对问题的回答。
##   agent: john

analysis_task:
  description: >
    回答有关太空新闻的这个问题: {user_question}
  expected_output: >
    基于最近太空新闻文章的详细答案
  agent: space_analyst
```
让我们运行更新后的 Crew：

```python
crewai-demo python knowledge_example/src/knowledge_example/main.py
```

```python
## Agent: 太空新闻分析师
### 任务: 回答这个关于太空新闻的问题: 太空探索的最新进展是什么？



## Agent: 太空新闻分析师
### 最终答案: 
太空探索的最新进展非常显著，展示了多项任务和进展，特别关注于月球、火星和卫星技术的倡议。

1. **SpaceX 发射激增**: 2024 年，SpaceX 显著加快了全球发射活动，创下了轨道发射数量的新纪录。这一增长主要归因于公司增强的运营能力和成功的发射节奏，特别是通过其 Starlink 卫星部署。Starlink Group 12-6 任务体现了这一激增，结束了 SpaceX 在发射方面创纪录的一年（来源：SpaceNews，2025 年 1 月 2 日）。

2. **NASA 对航天健康的评估**: NASA 进行了重要研究，涉及宇航员在太空中面临的健康挑战。独立评估集中在减轻与减压病 (DCS) 和卵圆孔未闭 (PFO) 相关的风险，尤其是在太空飞行期间。这项研究对于规划长期任务至关重要，例如那些旨在火星探索和潜在的载人任务（低地球轨道以外）（来源：NASA，2024 年 12 月 31 日）。

3. **新格伦发射载具开发**: 蓝色起源的 New Glenn 火箭最近完成了重要的热火测试，验证了其七个 BE-4 主引擎。这标志着其首次发射前的最后主要测试阶段，计划于 2025 年初进行。这一载具代表了进入竞争激烈的太空发射市场的新选择，后者越来越被 SpaceX 主导（来源：Space Scout，2024 年 12 月 31 日）。

4. **欧洲太空发射**: 2024 年，欧洲发射载具取得了进展，Vega C 火箭重新飞行，Ariane 6 火箭首次发射。尽管欧洲国家一直在努力取得进展，但这一年结束时并没有在商业开发的欧洲火箭上实现首次轨道飞行，这给该行业带来了加速技术改进的压力（来源：European Spaceflight，2025 年 1 月 1 日）。

5. **未来天文学教育倡议**: NASA 启动了天文学激活大使项目，旨在通过提升科学教师的能力来增强学生在 STEM 领域的参与。这一倡议突显了促进教育推广的承诺，随着太空探索的扩展，这一点至关重要（来源：NASA，2024 年 12 月 31 日）。

6. **商业频谱分配**: 此外，联邦通信委员会 (FCC) 为商业发射申请分配了新的频谱。此决定支持日益增长的商业太空产业，使公司能够在更少的限制下运营，并改善太空中卫星发射和操作的整体效率（来源：SpaceNews，2025 年 1 月 1 日）。

这些进展强调了一个充满活力和快速发展的太空探索环境，私人太空公司和政府对这一关键领域的研究和教育的强大支持推动了明确的势头。
```
**在 CrewAI 中使用知识的关键好处包括:**

* 用领域特定的信息增强代理
* 用真实世界的数据支持决策
* 在对话中保持上下文
* 将响应基于事实信息进行基础化

下一步:

### 了解更多

### 来源

<https://docs.crewai.com/concepts/knowledge>

