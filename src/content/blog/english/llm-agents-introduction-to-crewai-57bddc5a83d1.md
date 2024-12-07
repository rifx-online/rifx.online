---
title: "LLM Agents: Introduction to CrewAI"
meta_title: "LLM Agents: Introduction to CrewAI"
description: "The article discusses CrewAI, a framework for developing LLM agents capable of autonomous task-solving. It explains agent definitions, task execution, and tool integration, including custom tool creation. A practical example demonstrates using the Wikipedia API to search for articles and extract information. The frameworks high-level API allows for easy setup and configuration of agents, tools, and tasks. Performance comparisons among various LLMs highlight CrewAIs effective tool usage and reflective capabilities, making it a strong choice for specific tasks like Wikipedia searches."
date: 2024-12-07T12:28:15Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*QuuLsJ4LnS0UQqR8QgRzew.png"
categories: ["Programming", "Machine Learning", "Generative AI"]
author: "Rifx.Online"
tags: ["CrewAI", "LLM", "Wikipedia", "API", "agents"]
draft: False

---






Agent frameworks powered by LLMs promise to catapult autonomous task solving to unprecedented levels. Instead of rigid programming, LLMs reflect tasks, utilize tools, and check each other’s outputs to solve tasks creatively.

This blog post explores LLM agents developed with the CrewAI framework. The article starts with the basic definition of agents, using both pure Python as well as YAML files. It then shows which predefined tools exist and how to use them, as well as how to implement custom tools. As a running example, an agent system is developed in which the Wikipedia API is used for finding articles about a keyword, then to fetch these articles and answer questions about their content.

*The technical context of this article is `Python v3.11` and `crewai v0.30.11`. All code examples should work with newer library versions too, but may require code updates.*

*This article originally appeared at my blog [admantium.com](https://admantium.com/blog/llm29_crewai_agents/)*.


## Required Libraries

Run the following command to install [crewai](https://docs.crewai.com/) with all pre\-defined tools:


```python
pip install 'crewai[tools]==0.30.11'
```
For local LLM interference, I suggest a combination of Ollama with LiteLLM to obtain a full OpenAI API compliant REST endpoint, which is especially required for function calling.

Run the following two commands:


```python
ollama serve
litellm --model ollama_chat/llama3
```

## Agent Definitions

An agent is an object configured with a natural language task description divided into `role`, `goal` and `backstory`. Its basic definition is shown below:


```python
## Example: Creating an agent with all attributes
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
Agents can be configured with several additional properties:

* `llm` and `function_calling_llm`: Directly configure which LLM to use for this agent.
* `max_iter` and `max_rpm`: The maximum number of "turns" an agent can work on a task before presenting the final answer, and the maximum number or API requests per minute.
* `max_execution_time`: Limit the agents answer process to a fixed time
* `allow_delegation`: Enable task delegation to other agents
* `step_callback`: Provide a custom function that is called every time the agent finishes a task.


## Task

Tasks are specific assignment that the agents will work on. In its default form, it also contains only a natural\-language description:


```python
task1 = Task(
  description="""Please use the WikipediaKeywordSearchTool to check articles about the 'Battletech' game""",
  expected_output="A list of articles on Wikipedia",
  agent=researcher
)
```
Several additional attributes can be used to control task execution and output better:

* `context`: Provide additional variables to solve the task.
* `config`: Overrides or extends the agents definition that will execute this task.
* `output_json`, `output_pydantic` and `output_file`: Use a specific output format instead of printing the output to the terminal.


## Tools

Tools are Python functions that extend an agent’s capabilities. CrewAi provides an extensive list of built\-in tools — at the time of writing, 20 tools are listed on the [documentation page](https://docs.crewai.com/core-concepts/Tools/#available-crewai-tools). Among them several RAG tools to read PDF, DOCX, JSON, CSV or even GitHub issues and file directory trees, and general website scraping.

To define a custom tool, a custom class or a function decoration can be used. With the class approach, you just need to define the class, provide two class attributes, and a `_run` method.

Here is the skeleton implementation for a custom function that searches Wikipedia articles containing a given keyword:


```python
class WikipediaKeywordSearchTool(BaseTool):
  name: str = "WikipediaKeywordSearchTool"
  description: str = "Search for articles containing a keyword"

def _run(self, keyword: str) -> str:
    print(f"\nWikipediaKeywordSearchTool called with #{keyword}")
    try:
      response = requests.get("https://en.wikipedia.org/w/api.php", #....
```

## Task Processing

In its default configuration, tasks are processed one\-by\-one, passed to the defined agents one\-by\-one. This can be modified by providing a task manager object which shepherds task resolution and decides how to pass tasks around.

Here is a simple implementation for defining a manager that uses a local LLM:


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
When this process starts, the manager receives the tasks, and decides who should solve it. To see how effective this approach is, we need to define an example and test the execution there.


## Agent Example: Wikipedia Article Search

To test Crew AI agent capabilities, the following scenario is developed:

* Goal: Find relevant Wikipedia articles about a given subject, then extract relevant content from these articles to answer a set of questions
* Agents: The research agent performs searches and extracts content; the editor uses the given content to answer the questions
* Tools: Two custom Python function for getting a list of articles and for retrieving the complete content of an article.


## Agent Source Code

The complete agent source code for this setup is as follows:


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
  goal='Research facts about a given subject',
  backstory="""
  Constraints:
    - Think step by step.
    - Be accurate and precise.
    - Answer briefly, in few words.
    - Reflect on your answer, and if you think you are hallucinating, reformulate the answer.
    - When you receive the result of a tool call, use it to respond to the supervisor, and then add the word "TERMINATE"
    - Do not repeat yourself
  """,
  verbose=True,
  max_iter=3,
  tools=[keyword_search, article_content]
)
editor = Agent(
  role='Editor',
  goal='Your role is to ensure the accuracy and reliability of published articles, reports, and other content. You play a crucial role in verifying statements, information, and sources to ensure that they are correct and trustworthy',
  backstory="""
    Constraints:
  - Think step by step.
  - Be accurate and precise.
  - Answer with few words.
  Task Details:
  - Verify sources: Check the credibility and reliability of the sources used in the article or claim. Look for reputable sources that have expertise in the subject matter.
  - Cross-reference information: Compare the information with multiple sources to ensure consistency and accuracy. Look for corroborating evidence or conflicting information that may require further investigation.
  - Contact sources: If possible, reach out to the sources mentioned in the article or claim to verify the information. If a source is unresponsive, notify the handling editor and head of research promptly to explore alternative verification methods.
  - Check for bias: Be aware of potential bias in the sources or the article itself. Fact checkers should strive to remain neutral and objective in their assessment.
  - Document research: Keep a record of your research process, including unanswered emails or other attempts to contact sources. This documentation can be valuable for reference and transparency.
  """,
  verbose=True,
  max_iter=1,
  allow_delegation=True
)
## Create tasks for your agents
task1 = Task(
  description="""
  Please use the WikipediaKeywordSearchTool to check articles about the 'Battletech' game
  """,
  expected_output="A list of articles on Wikipedia",
  agent=researcher
)
task2 = Task(
  description="""
  Please use the WikipediaArticleContentTool to retrieve the contents of three articles provided to you.
  Then, summarize thes articles and answer these question:
  1. What is the name of the current Era?
  2. How many Mechs exist?
  """,
  expected_output="A text answering the questions",
  agent=editor
)
crew = Crew(
  agents=[researcher, editor],
  tasks=[task1, task2],
  verbose=2,
)
crew.kickoff()
```

## Agent Performance with Different LLMs

To see how different LLMs perform on these tasks, I used and compared 4B models: `LLaMA2`, `LLaMA3`, `Wizardlm2`, and `StarlingLM`. The LLMs performed very different, with the clear winner of `StarlingLM`. Here are my observations:

* LLaMA2: This model suggests tool usage but could not execute the tools correctly.
* LLaMA: Tool call was successful in the very first time, and then it kept on calling the tool. After finishing the first task, the second task did not receive the article names, and the task resolution stopped.
* WizardLm: While the output reflected by this LLM is very convincing, it frequently could not use the tools, creating Python errors during tool execution.
* StarlingLM: This model completed the task with convincing actions and gave accurate answers. Here is the complete overview:


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

## Agent Performance with Supervisor

The final test is to add a supervisor to the conversation and see how this influences the conversation.

The relevant codes changes are these:


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
The first execution showed delegation, but only one tasks was solved. Nevertheless, the output was quiet convincing:


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
However, other attempts resulted in false tool calls, or the given context was incomplete. From my experience, working without a supervisor is the better option.


## Summary

CrewAi is a versatile LLM agent framework. It comes included with several tools to extract content form different sources, and it makes implementing custom tools easy. This article showed how to start with CrewAI: a) setup an LLM engine, b) defining agents, c) adding tools and d) define the tasks to be solved. Considering a CrewAi program, it’s clear, high\-level API is exceptional. Declarative specification of agents, tools and tasks is all that’s required. When testing CrewAI in the context of a Wikipedia search task, it shows interesting reflective capabilities to solve these tasks. Especially when compared to AutoGen, tool usage is much better and very specific to a given task.


