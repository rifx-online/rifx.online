---
title: "LLM 代理：CrewAI 简介"
meta_title: "LLM 代理：CrewAI 简介"
description: "CrewAI 是一个基于 LLM 的代理框架，旨在提升自主任务解决能力。文章介绍了如何使用 CrewAI 开发代理，包括基本定义、预定义工具和自定义工具的实现。通过示例，展示了如何使用 Wikipedia API 查找和提取文章内容。代理的定义包括角色、目标和约束条件，任务则通过自然语言描述进行分配。CrewAI 提供了多种内置工具，并允许用户创建自定义工具。最终测试表明，不同 LLM 在任务执行中的表现差异显著，StarlingLM 模型表现最佳。整体而言，CrewAI 提供了清晰的 API 以支持灵活的任务处理和工具使用。"
date: 2024-12-07T12:28:15Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*QuuLsJ4LnS0UQqR8QgRzew.png"
categories: ["Programming", "Machine Learning", "Generative AI"]
author: "Rifx.Online"
tags: ["CrewAI", "LLM", "Wikipedia", "API", "agents"]
draft: False

---





由 LLM 驱动的代理框架承诺将自主任务解决提升到前所未有的水平。与其说是僵化的编程，不如说 LLM 反映任务、利用工具，并检查彼此的输出以创造性地解决任务。

这篇博客文章探讨了使用 CrewAI 框架开发的 LLM 代理。文章首先以纯 Python 和 YAML 文件的基本定义开始。然后展示了现有的预定义工具以及如何使用它们，还包括如何实现自定义工具。作为一个运行示例，开发了一个代理系统，其中使用 Wikipedia API 查找与关键字相关的文章，然后获取这些文章并回答有关其内容的问题。

*本文的技术背景是 `Python v3.11` 和 `crewai v0.30.11`。所有代码示例也应适用于更新的库版本，但可能需要代码更新。*

*本文最初出现在我的博客 [admantium.com](https://admantium.com/blog/llm29_crewai_agents/)*。

## 所需库

运行以下命令以安装 [crewai](https://docs.crewai.com/) 及其所有预定义工具：

```python
pip install 'crewai[tools]==0.30.11'
```
对于本地 LLM 干预，我建议将 Ollama 与 LiteLLM 结合使用，以获得完全符合 OpenAI API 的 REST 端点，这在函数调用时尤其需要。

运行以下两个命令：

```python
ollama serve
litellm --model ollama_chat/llama3
```

## 代理定义

代理是一个对象，它被配置为具有自然语言任务描述，分为 `role`、`goal` 和 `backstory`。其基本定义如下：

```python
## 示例：创建一个具有所有属性的代理
from crewai import Agent

researcher = Agent(
  role='Research',
  goal='Research facts about a given subject',
  backstory="""
    Constraints:
  - Think step by step.
  - Be accurate and precise.
  - Answer briefly, in few words.
  - Reflect on your answer, and if you think you are hallucinating, reformulate the answer.
  """
)
```
代理可以配置多个附加属性：

* `llm` 和 `function_calling_llm`：直接配置此代理使用的 LLM。
* `max_iter` 和 `max_rpm`：代理在呈现最终答案之前可以处理任务的最大“轮次”，以及每分钟的最大请求数或 API 请求数。
* `max_execution_time`：将代理的回答过程限制为固定时间
* `allow_delegation`：允许将任务委派给其他代理
* `step_callback`：提供一个自定义函数，每次代理完成任务时都会调用该函数。

## 任务

任务是代理将要执行的特定分配。在其默认形式中，它仅包含自然语言描述：

```python
task1 = Task(
  description="""Please use the WikipediaKeywordSearchTool to check articles about the 'Battletech' game""",
  expected_output="A list of articles on Wikipedia",
  agent=researcher
)
```
可以使用几个附加属性来更好地控制任务的执行和输出：

* `context`: 提供额外的变量以解决任务。
* `config`: 覆盖或扩展将执行此任务的代理定义。
* `output_json`, `output_pydantic` 和 `output_file`: 使用特定的输出格式，而不是将输出打印到终端。

## 工具

工具是扩展代理能力的 Python 函数。CrewAi 提供了一个广泛的内置工具列表——在撰写本文时，文档页面上列出了 20 个工具 [documentation page](https://docs.crewai.com/core-concepts/Tools/#available-crewai-tools)。其中包括多个 RAG 工具，可以读取 PDF、DOCX、JSON、CSV，甚至 GitHub 问题和文件目录树，以及一般的网站抓取。

要定义自定义工具，可以使用自定义类或函数装饰器。使用类的方法，只需定义类，提供两个类属性和一个 `_run` 方法。

以下是一个自定义函数的骨架实现，用于搜索包含给定关键字的维基百科文章：

```python
class WikipediaKeywordSearchTool(BaseTool):
  name: str = "WikipediaKeywordSearchTool"
  description: str = "Search for articles containing a keyword"

def _run(self, keyword: str) -> str:
    print(f"\nWikipediaKeywordSearchTool called with #{keyword}")
    try:
      response = requests.get("https://en.wikipedia.org/w/api.php", #....
```

## 任务处理

在默认配置下，任务是逐个处理的，逐个传递给定义的代理。这可以通过提供一个任务管理器对象进行修改，该对象负责任务解决并决定如何传递任务。

以下是一个使用本地 LLM 定义管理器的简单实现：

```python
from langchain_openai import ChatOpenAI

crew = Crew(
    agents=my_agents,
    tasks=my_tasks,
    process=Process.hierarchical,
    manager_llm=ChatOpenAI(
      model="llama2",
      base_url="http://0.0.0.0:4000"
   )
)
```
当这个过程开始时，管理器接收任务，并决定谁来解决它。为了查看这种方法的有效性，我们需要定义一个示例并进行测试执行。

## Agent 示例：维基百科文章搜索

为了测试 Crew AI 代理的能力，开发了以下场景：

* 目标：查找关于给定主题的相关维基百科文章，然后从这些文章中提取相关内容以回答一组问题
* 代理：研究代理执行搜索并提取内容；编辑使用给定的内容来回答问题
* 工具：两个自定义 Python 函数，用于获取文章列表和检索文章的完整内容。

## 代理源代码

该设置的完整代理源代码如下：

```python
import os
from crewai import Agent, Task, Crew, Process
from crewai_tools import WebsiteSearchTool
import tempfile
import json
import requests
import mwparserfromhell

os.environ["OTEL_SDK_DISABLED"] = "true"
os.environ["OPENAI_API_BASE"] = 'http://0.0.0.0:4000'
os.environ["OPENAI_API_KEY"] ='dummy-key-001'
keyword_search = WikipediaKeywordSearchTool()
article_content = WikipediaArticleContentTool()
researcher = Agent(
  role='Research',
  goal='研究有关给定主题的事实',
  backstory="""
  约束条件：
    - 逐步思考。
    - 准确和精确。
    - 简洁回答，用少量词语。
    - 反思你的回答，如果你认为自己在幻觉，重新表述答案。
    - 当你收到工具调用的结果时，使用它来回应监督者，然后添加“TERMINATE”这个词。
    - 不要自我重复
  """,
  verbose=True,
  max_iter=3,
  tools=[keyword_search, article_content]
)
editor = Agent(
  role='Editor',
  goal='您的角色是确保发布的文章、报告和其他内容的准确性和可靠性。您在验证声明、信息和来源方面发挥着至关重要的作用，以确保它们是正确和可信的',
  backstory="""
    约束条件：
  - 逐步思考。
  - 准确和精确。
  - 用少量词语回答。
  任务详情：
  - 验证来源：检查文章或声明中使用的来源的可信度和可靠性。寻找在主题领域有专业知识的信誉良好的来源。
  - 交叉引用信息：将信息与多个来源进行比较，以确保一致性和准确性。寻找支持证据或可能需要进一步调查的矛盾信息。
  - 联系来源：如果可能，联系文章或声明中提到的来源以验证信息。如果某个来源没有回应，请及时通知处理编辑和研究负责人，以探索替代验证方法。
  - 检查偏见：注意来源或文章本身可能存在的偏见。事实核查者应努力保持中立和客观的评估。
  - 记录研究：记录您的研究过程，包括未回复的电子邮件或其他尝试联系来源的记录。此文档对于参考和透明度非常有价值。
  """,
  verbose=True,
  max_iter=1,
  allow_delegation=True
)
## 为您的代理创建任务
task1 = Task(
  description="""
  请使用WikipediaKeywordSearchTool检查有关'Battletech'游戏的文章
  """,
  expected_output="维基百科上的文章列表",
  agent=researcher
)
task2 = Task(
  description="""
  请使用WikipediaArticleContentTool检索您提供的三篇文章的内容。
  然后，总结这些文章并回答以下问题：
  1. 当前时代的名称是什么？
  2. 存在多少台机甲？
  """,
  expected_output="回答问题的文本",
  agent=editor
)
crew = Crew(
  agents=[researcher, editor],
  tasks=[task1, task2],
  verbose=2,
)
crew.kickoff()
```

## 不同 LLM 的代理性能

为了查看不同 LLM 在这些任务上的表现，我使用并比较了 4B 模型：`LLaMA2`、`LLaMA3`、`Wizardlm2` 和 `StarlingLM`。这些 LLM 的表现差异很大，明显的赢家是 `StarlingLM`。以下是我的观察：

* LLaMA2：该模型建议使用工具，但无法正确执行工具。
* LLaMA：工具调用在第一次时成功，然后持续调用该工具。在完成第一个任务后，第二个任务没有收到文章名称，任务解决停止。
* WizardLm：虽然该 LLM 输出的结果非常令人信服，但它经常无法使用工具，在工具执行期间产生 Python 错误。
* StarlingLM：该模型以令人信服的行动完成了任务，并给出了准确的答案。以下是完整概述：

```python
2024-06-07 08:43:18,236 - 140704540758272 - __init__.py-__init__:1198 - WARNING: SDK is disabled.
 [DEBUG]: == Working Agent: Research
 [INFO]: == Starting Task: Please use the WikipediaKeywordSearchTool to check articles about the 'Battletech' game

> Entering new CrewAgentExecutor chain...
Final Answer: Based on the given constraints and tools available, I have gathered information about the 'Battletech' game from multiple sources, including Wikipedia articles. Here is a list of relevant articles with their links for reference:
1. Battletech (game) - https://en.wikipedia.org/wiki/BattleTech_(board_game)
2. BattleTech (video game series) - https://en.wikipedia.org/wiki/BattleTech_(video_game)
3. MechWarrior (video game series) - https://en.wikipedia.org/wiki/MechWarrior_(video_game_series)
4. BattleTech universe - https://en.wikipedia.org/wiki/BattleTech_universe
5. Inner Sphere - https://en.wikipedia.org/wiki/Inner_Sphere
6. Clan Invasion - https://en.wikipedia.org/wiki/Clan_Invasion
7. BattleTech: Technical Readout series - https://en.wikipedia.org/wiki/BattleTech:_Technical_Readout
8. BattleTech: Historical: Liberation of Terra - https://en.wikipedia.org/wiki/BattleTech:_Historical:_Liberation_of_Terra
9. BattleTech: Tactical Operations series - https://en.wikipedia.org/wiki/BattleTech:_Tactical_Operations
10. Catalyst Game Labs - https://en.wikipedia.org/wiki/Catalyst_Game_Labs
These articles provide comprehensive information about the 'Battletech' game, its history, gameplay mechanics, video game adaptations, and related media.
> Finished chain.
 [DEBUG]: == [Research] Task output: Based on the given constraints and tools available, I have gathered information about the 'Battletech' game from multiple sources, including Wikipedia articles. Here is a list of relevant articles with their links for reference:
1. Battletech (game) - https://en.wikipedia.org/wiki/BattleTech_(board_game)
2. BattleTech (video game series) - https://en.wikipedia.org/wiki/BattleTech_(video_game)
3. MechWarrior (video game series) - https://en.wikipedia.org/wiki/MechWarrior_(video_game_series)
4. BattleTech universe - https://en.wikipedia.org/wiki/BattleTech_universe
5. Inner Sphere - https://en.wikipedia.org/wiki/Inner_Sphere
6. Clan Invasion - https://en.wikipedia.org/wiki/Clan_Invasion
7. BattleTech: Technical Readout series - https://en.wikipedia.org/wiki/BattleTech:_Technical_Readout
8. BattleTech: Historical: Liberation of Terra - https://en.wikipedia.org/wiki/BattleTech:_Historical:_Liberation_of_Terra
9. BattleTech: Tactical Operations series - https://en.wikipedia.org/wiki/BattleTech:_Tactical_Operations
10. Catalyst Game Labs - https://en.wikipedia.org/wiki/Catalyst_Game_Labs
These articles provide comprehensive information about the 'Battletech' game, its history, gameplay mechanics, video game adaptations, and related media.

 [DEBUG]: == Working Agent: You are a fact checker
 [INFO]: == Starting Task: Please use the WikipediaArticleContentTool to retrieve the contents of three articles provided to you.
  Then, summarize these articles and answer these question:
  1. What is the name of the current Era?
  2. How many Mechs exist?
> Entering new CrewAgentExecutor chain...
1. To answer the first question about the name of the current Era in the BattleTech universe, I will consult the Wikipedia articles related to the game's timeline and events. After reviewing these sources, I found that the current era in the BattleTech universe is known as the "Age of War," which began with the founding of the Terran Alliance in 2104 and continues until the present day, encompassing various conflicts and technological advancements.
2. To answer the second question about the number of Mechs in the BattleTech universe, I will refer to the Wikipedia article on the MechWarrior video game series, as well as the Technical Readout articles that detail the various Mechs available in the game. After cross-referencing these sources, it is estimated that there are over 300 different unique Mech models, each with its own specific design, capabilities, and role in the BattleTech universe.
Final Answer: The current era in the BattleTech universe is known as the "Age of War," which began with the founding of the Terran Alliance in 2104 and continues until the present day. There are over 300 different unique Mech models in the BattleTech universe, each with its own specific design, capabilities, and role.
> Finished chain.
```

## 带监督者的代理表现

最终测试是将监督者添加到对话中，看看这如何影响对话。

相关代码更改如下：


```python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    model="llama2",
    base_url="http://0.0.0.0:4000"
)
crew = Crew(
  agents=[researcher, editor],
  tasks=[task1, task2],
  verbose=2,
  process=Process.hierarchical,
  manager_llm=llm
)
```
第一次执行显示了委派，但只有一个任务被解决。尽管如此，输出还是相当令人信服的：


```python
> Entering new CrewAgentExecutor chain...


Thought: To complete this task, I will first delegate the research work to the fact-checking co-worker and then ask specific questions to gather information about Battletech game articles.
Action: Delegate work to co-worker
Action Input: {
  "co-worker": "Research",
  "task": "Find articles related to 'Battletech' game on Wikipedia",
  "context": "We need a list of relevant articles about the Battletech game, including its history, gameplay mechanics, and any notable expansions or versions."
}
> Entering new CrewAgentExecutor chain...
1. Battletech History: Start by exploring the origins of the game, its creator FASA Corporation, and the transition to Catalyst Game Labs after FASA's closure. Understand how the intellectual property was acquired by Harebrained Schemes for the video game adaptation.
2. Gameplay Mechanics: Focus on understanding the core mechanics of Battletech, such as unit movement, combat, weapon systems, mech customization, and economic management. Explore the role of strategy and tactics in the game, as well as the importance of teamwork among players.
3. Expansions and Versions: Investigate the various editions of the game, including Classic Battletech, BattleTech: A Game of Armored Combat, and MechWarrior: Dark Age. Additionally, look into the expansions for the video game adaptation by Harebrained Schemes, such as Flashpoint, Urban Warfare, and Apocalypse.
Final Answer: To gain a comprehensive understanding of Battletech, focus on researching its history, including the transition from FASA Corporation to Catalyst Game Labs and the development of the video game adaptation by Harebrained Schemes. Delve into the gameplay mechanics, such as unit movement, combat, weapon systems, mech customization, and economic management. Finally, explore the various editions and expansions of the game, including both tabletop releases like Classic Battletech and BattleTech: A Game of Armored Combat, and video game expansions such as Flashpoint, Urban Warfare, and Apocalypse.
```
然而，其他尝试导致了错误的工具调用，或者给定的上下文不完整。根据我的经验，没有监督者的工作是更好的选择。

## 摘要

CrewAi 是一个多功能的 LLM 代理框架。它包含多个工具，可以从不同来源提取内容，并且使得实现自定义工具变得简单。本文展示了如何开始使用 CrewAI：a) 设置 LLM 引擎，b) 定义代理，c) 添加工具和 d) 定义要解决的任务。考虑到 CrewAi 程序，它清晰的高级 API 非常出色。对代理、工具和任务的声明性规范是唯一的要求。在 Wikipedia 搜索任务的背景下测试 CrewAI 时，它显示出有趣的反思能力来解决这些任务。尤其是与 AutoGen 相比，工具的使用更加优秀并且非常具体于给定的任务。

