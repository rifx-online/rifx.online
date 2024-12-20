---
title: "Building Multi-Agent LLM Systems with crewAI: A Step-by-Step Guide"
meta_title: "Building Multi-Agent LLM Systems with crewAI: A Step-by-Step Guide"
description: "The article discusses the development and implementation of Multi-Agent Systems (MAS) using the crewAI framework. It highlights how MAS integrates multiple autonomous agents for enhanced decision-making in various sectors like healthcare, finance, and transportation. The guide covers the installation of crewAI, project creation, agent and task customization, and testing capabilities. Key components of crewAI include agents, tasks, tools, and processes, which facilitate collaboration among agents to achieve common goals. The article also provides practical examples and coding instructions for building and running projects within the crewAI environment."
date: 2024-12-19T22:13:58Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*YqQv29ycAYb9ponN2PbbUQ.png"
categories: ["Programming", "Autonomous Systems", "Technology/Web"]
author: "Rifx.Online"
tags: ["Multi-Agent", "Systems", "crewAI", "agents", "tasks"]
draft: False

---







> **Introduction To Multi\-Agent**

Multi AI Agent Systems with crewAI are transforming the way we approach complex decision\-making. By integrating multiple artificial intelligence agents, these systems enable autonomous decision\-making, revolutionizing industries such as healthcare, finance, and transportation. In this blog, we’ll delve into the world of Multi AI Agent Systems, exploring their applications, benefits, and the role of crewAI in this innovative technology


> **What are Multi\-Agent Systems?**

Multi\-Agent Systems (MAS) consist of multiple autonomous agents that interact and collaborate to achieve a common goal. These agents can be AI\-powered, human, or a combination of both. In a MAS, each agent operates independently, making decisions based on its own knowledge and goals, while also communicating with other agents to achieve a collective objective.


> **The Role of Artificial Intelligence in Multi\-Agent Systems**

Artificial Intelligence (AI) plays a crucial role in Multi\-Agent Systems, enabling agents to learn from data, adapt to new situations, and make informed decisions. AI agents can analyze vast amounts of data, identify patterns, and provide insights that inform decision\-making. In a MAS, AI agents can also facilitate communication and coordination among agents, ensuring seamless collaboration.


> **Applications of Multi AI Agent Systems**

* Healthcare: optimizing patient care and resource allocation
* Finance: enhancing risk management and portfolio optimization
* Transportation: improving traffic management and logistics


> **The Benefits of Multi AI Agent Systems**

* Enhanced decision\-making: leveraging the collective intelligence of multiple agents
* Increased efficiency: automating tasks and optimizing resource allocation
* Improved adaptability: responding to changing environments and scenarios


## The Role of CrewAI in Multi AI Agent Systems


> **What is CrewAI?**

Cutting\-edge framework for orchestrating role\-playing, autonomous AI agents. By fostering collaborative intelligence, CrewAI empowers agents to work together seamlessly, tackling complex tasks.


> **Installing crewAI**

This guide will walk you through the installation process for crewAI and its dependencies. crewAI is a flexible and powerful AI framework that enables you to create and manage AI agents, tools, and tasks efficiently. Let’s get started!

To install crewAI, you need to have Python \>\=3\.10 and \<\=3\.13 installed on your system:


```python
## Install the main crewAI package
pip install crewai

## Install the main crewAI package and the tools package
## that includes a series of helpful tools for your agents
pip install 'crewai[tools]'

## Alternatively, you can also use:
pip install crewai crewai-tools
```

> Creating a New Project


```python
$ crewai create crew <project_name>
```
This command will create a new project folder with the following structure:


```python
my_project/
├── .gitignore
├── pyproject.toml
├── README.md
└── src/
    └── my_project/
        ├── __init__.py
        ├── main.py
        ├── crew.py
        ├── tools/
        │   ├── custom_tool.py
        │   └── __init__.py
        └── config/
            ├── agents.yaml
            └── tasks.yaml
```

> **Customizing Your Project**

To customize your project, you can: — Modify `src/my_project/config/agents.yaml` to define your agents. \- Modify `src/my_project/config/tasks.yaml` to define your tasks. \- Modify `src/my_project/crew.py` to add your own logic, tools, and specific arguments. \- Modify `src/my_project/main.py` to add custom inputs for your agents and tasks. \- Add your environment variables into the `.env` file.


> **Example: Defining Agents and Tasks**


### agents.yaml


```python
researcher:
  role: >
    Job Candidate Researcher
  goal: >
    Find potential candidates for the job
  backstory: >
    You are adept at finding the right candidates by exploring various online
    resources. Your skill in identifying suitable candidates ensures the best
    match for job positions.
```

### tasks.yaml


```python
research_candidates_task:
  description: >
    Conduct thorough research to find potential candidates for the specified job.
    Utilize various online resources and databases to gather a comprehensive list of potential candidates.
    Ensure that the candidates meet the job requirements provided.

    Job Requirements:
    {job_requirements}
  expected_output: >
    A list of 10 potential candidates with their contact information and brief profiles highlighting their suitability.
  agent: researcher # THIS NEEDS TO MATCH THE AGENT NAME IN THE AGENTS.YAML FILE AND THE AGENT DEFINED IN THE crew.py FILE
  context: # THESE NEED TO MATCH THE TASK NAMES DEFINED ABOVE AND THE TASKS.YAML FILE AND THE TASK DEFINED IN THE crew.py FILE
    - researcher
```

> **Referencing Variables**


### agents.yaml


```python
email_summarizer:
    role: >
      Email Summarizer
    goal: >
      Summarize emails into a concise and clear summary
    backstory: >
      You will create a 5 bullet point summary of the report
    llm: mixtal_llm
```

### tasks.yaml


```python
email_summarizer_task:
    description: >
      Summarize the email into a 5 bullet point summary
    expected_output: >
      A 5 bullet point summary of the email
    agent: email_summarizer
    context:
      - reporting_task
      - research_task
```
Use the annotations to properly reference the agent and task in the `crew.py` file.


> **Annotations**

* `@agent`
* `@task`
* `@crew`
* `@tool`
* `@callback`
* `@output_json`
* `@output_pydantic`
* `@cache_handler`


```python
## ...
@agent
def email_summarizer(self) -> Agent:
    return Agent(
        config=self.agents_config["email_summarizer"],
    )

@task
def email_summarizer_task(self) -> Task:
    return Task(
        config=self.tasks_config["email_summarizer_task"],
    )
## ...
```

> **Interpolating Variables**

Any variable interpolated in your `agents.yaml` and `tasks.yaml` files like `{variable}` will be replaced by the value of the variable in the `main.py` file.


### tasks.yaml


```python
research_task:
  description: >
    Conduct a thorough research about the customer and competitors in the context
    of {customer_domain}.
    Make sure you find any interesting and relevant information given the
    current year is 2024.
  expected_output: >
    A complete report on the customer and their customers and competitors,
    including their demographics, preferences, market positioning and audience engagement.
```

```python
## main.py
def run():
    inputs = {
        "customer_domain": "crewai.com"
    }
    MyProjectCrew(inputs).crew().kickoff(inputs=inputs)
```

> **Running Your Project**

To run your project, use the following command:


```python
$ crewai run
```

> **5 important components of crewAI**

* Agent
* Task
* Tools
* Processes
* Crew


> **What is an Agent?**

An agent is an **autonomous unit** programmed to:

* Perform tasks
* Make decisions
* Communicate with other agents

Think of an agent as a member of a team, with specific skills and a particular job to do. Agents can have different roles like ‘Researcher’, ‘Writer’, or ‘Customer Support’, each contributing to the overall goal of the crew.

BaseAgent includes attributes and methods required to integrate with your crews to run and delegate tasks to other agents within your own crew.

CrewAI is a universal multi\-agent framework that allows for all agents to work together to automate tasks and solve problems.


> **What is a Task?**

In the crewAI framework, tasks are specific assignments completed by agents. They provide all necessary details for execution, such as a description, the agent responsible, required tools, and more, facilitating a wide range of action complexities.

Tasks within crewAI can be collaborative, requiring multiple agents to work together. This is managed through the task properties and orchestrated by the Crew’s process, enhancing teamwork and efficiency.


> **What are Tools?**

A tool in CrewAI is a skill or function that agents can utilize to perform various actions. This includes tools from the [crewAI Toolkit](https://github.com/joaomdmoura/crewai-tools) and [LangChain Tools](https://python.langchain.com/docs/integrations/tools), enabling everything from simple searches to complex interactions and effective teamwork among agents.


> **What are Processes?**

In CrewAI, processes orchestrate the execution of tasks by agents, akin to project management in human teams. These processes ensure tasks are distributed and executed efficiently, in alignment with a predefined strategy.

* **Sequential**: Executes tasks sequentially, ensuring tasks are completed in an orderly progression.
* **Hierarchical**: Organizes tasks in a managerial hierarchy, where tasks are delegated and executed based on a structured chain of command. A manager language model (`manager_llm`) or a custom manager agent (`manager_agent`) must be specified in the crew to enable the hierarchical process, facilitating the creation and management of tasks by the manager.
* **Consensual Process (Planned)**: Aiming for collaborative decision\-making among agents on task execution, this process type introduces a democratic approach to task management within CrewAI. It is planned for future development and is not currently implemented in the codebase.


> **What is a Crew?**

A crew in crewAI represents a collaborative group of agents working together to achieve a set of tasks. Each crew defines the strategy for task execution, agent collaboration, and the overall workflow.


> **Testing**

Testing is a crucial part of the development process, and it is essential to ensure that your crew is performing as expected. With crewAI, you can easily test your crew and evaluate its performance using the built\-in testing capabilities.

We added the CLI command `crewai test` to make it easy to test your crew. This command will run your crew for a specified number of iterations and provide detailed performance metrics. The parameters are `n_iterations` and `model`, which are optional and default to 2 and `gpt-4o-mini` respectively. For now, the only provider available is OpenAI.


```python
crewai test
```
If you want to run more iterations or use a different model, you can specify the parameters like this:


```python
crewai test --n_iterations 5 --model gpt-4o
```
or using the short forms


```python
crewai test -n 5 -m gpt-4o
```
When you run the `crewai test` command, the crew will be executed for the specified number of iterations, and the performance metrics will be displayed at the end of the run.

A table of scores at the end will show the performance of the crew in terms of the following metrics:


```python
                                                     Tasks Scores
                                                (1-10 Higher is better)
┏━━━━━━━━━━━━━━━━━━━━┯━━━━━━━┯━━━━━━━┯━━━━━━━━━━━━┯━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┯━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Tasks/Crew/Agents  │ Run 1 │ Run 2 │ Avg. Total │ Agents                         │                                 ┃
┠────────────────────┼───────┼───────┼────────────┼────────────────────────────────┼─────────────────────────────────┨
┃ Task 1             │  9.0  │  9.5  │    9.2     │ - Professional Insights        │                                 ┃
┃                    │       │       │            │ Researcher                     │                                 ┃
┃                    │       │       │            │                                │                                 ┃
┃ Task 2             │  9.0  │ 10.0  │    9.5     │ - Company Profile Investigator │                                 ┃
┃                    │       │       │            │                                │                                 ┃
┃ Task 3             │  9.0  │  9.0  │    9.0     │ - Automation Insights          │                                 ┃
┃                    │       │       │            │ Specialist                     │                                 ┃
┃                    │       │       │            │                                │                                 ┃
┃ Task 4             │  9.0  │  9.0  │    9.0     │ - Final Report Compiler        │                                 ┃
┃                    │       │       │            │                                │ - Automation Insights           ┃
┃                    │       │       │            │                                │ Specialist                      ┃
┃ Crew               │ 9.00  │ 9.38  │    9.2     │                                │                                 ┃
┃ Execution Time (s) │  126  │  145  │    135     │                                │                                 ┃
┗━━━━━━━━━━━━━━━━━━━━┷━━━━━━━┷━━━━━━━┷━━━━━━━━━━━━┷━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┷━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```
Its Coding Time !!!!!!!!!


> **crewai\-sequential\-quickstart**

Simplified and tested template of a **sequential** CrewAI crew performing **web searches** (SerperDevTool).

Requirements: Use these commands in terminal after installing colab\-xterm loaded 2 terminals run first two commands in first terminal then 3rd command in other terminal 1\.curl [https://ollama.ai/install.sh](https://www.google.com/url?q=https%3A%2F%2Follama.ai%2Finstall.sh) \| sh 2\.ollama pull llama3 3\.ollama server

* Serper API Key: [https://serper.dev/](https://www.google.com/url?q=https%3A%2F%2Fserper.dev%2F)

if you are not aware of ollama please refer the below links








```python
!pip install colab-xterm
```

```python
%load_ext colabxterm
```

```python
%xterm
```

```python
!pip install langchain
!pip install crewai
!pip install duckduckgo-search
!pip install crewai_tools
```

> **Input Serper API Key by running this cell**


```python
## @title 🔑 Input **Serper** API Key by running this cell
import os
from crewai_tools import SerperDevTool
from getpass import getpass
## Instantiate tools

## Set the SERPER_API_KEY environment variable by prompting the user to enter the key
## The Serper API key is required to use the Serper search tool (https://serper.dev)
os.environ["SERPER_API_KEY"] = getpass("Enter SERPER_API_KEY: ")
search_tool = SerperDevTool()
```

> **You can use this link to create serper api key**


> **we have created Researcher \& Writer crew which includes**


> **1 Researcher , 1 Writer , 2 tasks 1 for Full analysis report in bullet points and 1 for Full blog post of at least 4 paragraphs**


```python
import os
from crewai import Agent, Task, Crew, Process
from crewai_tools import  tool
from langchain_community.chat_models import ChatOllama
## from langchain_groq import ChatGroq
local_llm = "llama3:latest"

llm = ChatOllama(model=local_llm, temperature=0)
## llm = ChatGroq(groq_api_key = os.getenv('GROQ_API_KEY'),model = 'mixtral-8x7b-32768')
## llm = LlamaAPI(model="llama-70b-chat",api_key=os.environ["LLAMA_API_Key"])
from langchain_community.tools import DuckDuckGoSearchRun

@tool('DuckDuckGoSearch')
def search(search_query: str) -> str:
    """search the web for information on a given topic."""
    return DuckDuckGoSearchRun().run(search_query)

## search_tool = DuckDuckGoSearchRun()
## Define your agents with roles and goals
researcher = Agent(
  role='Senior Research Analyst',
  goal='Uncover cutting-edge developments in AI and data science',
  backstory="""You work at a leading tech think tank.
  Your expertise lies in identifying emerging trends.
  You have a knack for dissecting complex data and presenting actionable insights.""",
  verbose=True,
  allow_delegation=False,
  tools=[search],
  llm=llm

)
writer = Agent(
  role='Tech Content Strategist',
  goal='Craft compelling content on tech advancements',
  backstory="""You are a renowned Content Strategist, known for your insightful and engaging articles.
  You transform complex concepts into compelling narratives.""",
  verbose=True,
  allow_delegation=True,
  llm=llm
)

## Create tasks for your agents
task1 = Task(
  description="""Conduc t a comprehensive analysis of the latest advancements in AI in2024.
  Identify key trends, breakthrough technologies, and potential industry impacts.""",
  expected_output="Full analysis report in bullet points",
  agent=researcher
)

task2 = Task(
  description="""Using the insights provided, develop an engaging blog
  post that highlights the most significant AI advancements.
  Your post should be informative yet accessible, catering to a tech-savvy audience.
  Make it sound cool, avoid complex words so it doesn't sound like AI.""",
  expected_output="Full blog post of at least 4 paragraphs",
  agent=writer
)

## Instantiate your crew with a sequential process
crew = Crew(
  agents=[researcher, writer],
  tasks=[task1, task2],
  verbose=2, # You can set it to 1 or 2 to different logging levels
)

## Get your crew to work!
result = crew.kickoff()

print("######################")
print(result)
```
*When we started running the above cell the below is the verbose it showed and you can see all the actions what crewAI agents performed*


```python
[DEBUG]: == Working Agent: Senior Research Analyst
 [INFO]: == Starting Task: Conduct a comprehensive analysis of the latest advancements in AI in 2024.
  Identify key trends, breakthrough technologies, and potential industry impacts.


> Entering new CrewAgentExecutor chain...
Thought: I should start by searching for recent advancements in AI.

Action: DuckDuckGoSearch

Action Input: {"q": "latest advancements in AI 2024 

I encountered an error while trying to use the tool. This was the error: search() got an unexpected keyword argument 'q'.
 Tool DuckDuckGoSearch accepts these inputs: DuckDuckGoSearch(search_query: 'string') - search the web for information on a given topic.

I apologize for the mistake earlier! Let's start fresh.

Thought: I should search for recent advancements in AI.
Action: DuckDuckGoSearch
Action Input: {"search_query": "latest advancements in AI 2024 

In 2024, generative AI might actually become useful for the regular, non-tech person, and we are going to see more people tinkering with a million little AI models. State-of-the-art AI models ... Here are some important current AI trends to look out for in the coming year. Reality check: more realistic expectations. Multimodal AI. Small (er) language models and open source advancements. GPU shortages and cloud costs. Model optimization is getting more accessible. Customized local models and data pipelines. This year's trends reflect a deepening sophistication and caution in AI development and deployment strategies, with an eye to ethics, safety and the evolving regulatory landscape. Here are the top 10 AI and machine learning trends to prepare for in 2024. 1. Multimodal AI. Multimodal AI goes beyond traditional single-mode data processing to ... The Top 5 Artificial Intelligence (AI) Trends For 2024. Adobe Stock. It's been a year since OpenAI released ChatGPT, opening the door to seamlessly weave AI into the fabric of our daily lives ... Here's how it works. AI in 2024 — the biggest new products and advancements on the way. While 2023 was the year of AI, 2024 will be the year we use it. We have just come to the end of a year ...

Thought: I now know the final answer
Final Answer:

**Comprehensive Analysis Report: Latest Advancements in AI (2024)**

• **Generative AI**: Expected to become more accessible and useful for non-tech individuals, with increased adoption of small language models and open-source advancements.
• **Multimodal AI**: A trend that goes beyond traditional single-mode data processing, enabling the integration of multiple data sources and modalities.
• **Model Optimization**: Becoming increasingly accessible, allowing for customized local models and data pipelines.
• **Customized Local Models**: Expected to gain traction, as organizations seek to develop tailored AI solutions for specific use cases.
• **GPU Shortages and Cloud Costs**: A challenge that will continue to impact the development and deployment of AI projects.
• **Reality Check: More Realistic Expectations**: As AI adoption grows, there is a need for more realistic expectations about what AI can achieve, with an emphasis on ethics, safety, and regulatory compliance.
• **Top 10 AI and Machine Learning Trends**:
 1. Multimodal AI
 2. Small (er) language models
 3. Open-source advancements
 4. Model optimization is getting more accessible
 5. Customized local models and data pipelines
 6. GPU shortages and cloud costs
 7. Ethics, safety, and regulatory compliance
 8. AI in 2024: the biggest new products and advancements on the way
 9. ChatGPT-like applications will become more mainstream
 10. AI-powered virtual assistants will continue to evolve

**Key Takeaways**

• AI is becoming increasingly accessible and useful for non-tech individuals.
• Multimodal AI, model optimization, and customized local models are key trends in 2024.
• The focus on ethics, safety, and regulatory compliance will continue to grow.
• AI-powered virtual assistants will continue to evolve.

This comprehensive analysis report provides an overview of the latest advancements in AI (2024), highlighting key trends, breakthrough technologies, and potential industry impacts.

> Finished chain.
 [DEBUG]: == [Senior Research Analyst] Task output: **Comprehensive Analysis Report: Latest Advancements in AI (2024)**

• **Generative AI**: Expected to become more accessible and useful for non-tech individuals, with increased adoption of small language models and open-source advancements.
• **Multimodal AI**: A trend that goes beyond traditional single-mode data processing, enabling the integration of multiple data sources and modalities.
• **Model Optimization**: Becoming increasingly accessible, allowing for customized local models and data pipelines.
• **Customized Local Models**: Expected to gain traction, as organizations seek to develop tailored AI solutions for specific use cases.
• **GPU Shortages and Cloud Costs**: A challenge that will continue to impact the development and deployment of AI projects.
• **Reality Check: More Realistic Expectations**: As AI adoption grows, there is a need for more realistic expectations about what AI can achieve, with an emphasis on ethics, safety, and regulatory compliance.
• **Top 10 AI and Machine Learning Trends**:
 1. Multimodal AI
 2. Small (er) language models
 3. Open-source advancements
 4. Model optimization is getting more accessible
 5. Customized local models and data pipelines
 6. GPU shortages and cloud costs
 7. Ethics, safety, and regulatory compliance
 8. AI in 2024: the biggest new products and advancements on the way
 9. ChatGPT-like applications will become more mainstream
 10. AI-powered virtual assistants will continue to evolve

**Key Takeaways**

• AI is becoming increasingly accessible and useful for non-tech individuals.
• Multimodal AI, model optimization, and customized local models are key trends in 2024.
• The focus on ethics, safety, and regulatory compliance will continue to grow.
• AI-powered virtual assistants will continue to evolve.

This comprehensive analysis report provides an overview of the latest advancements in AI (2024), highlighting key trends, breakthrough technologies, and potential industry impacts.


 [DEBUG]: == Working Agent: Tech Content Strategist
 [INFO]: == Starting Task: Using the insights provided, develop an engaging blog
  post that highlights the most significant AI advancements.
  Your post should be informative yet accessible, catering to a tech-savvy audience.
  Make it sound cool, avoid complex words so it doesn't sound like AI.


> Entering new CrewAgentExecutor chain...
Action: Delegate work to co-worker

Action Input: {
    "task": "Research AI advancements",
    "context": "Comprehensive Analysis Report: Latest Advancements in AI (2024)",
    "coworker": "Senior Research Analyst 


Error executing tool. Co-worker mentioned not found, it must to be one of the following options:
- senior research analyst


I apologize for the mistake. Since I can only delegate work to a Senior Research Analyst, I will reattempt the action.

Thought:
Action: Delegate work to co-worker
Action Input: {
    "task": "Research AI advancements",
    "context": "Comprehensive Analysis Report: Latest Advancements in AI (2024)",
    "coworker": "Senior Research Analyst 

I tried reusing the same input, I must stop using this action input. I'll try something else instead.



Thought:
Action: Delegate work to co-worker
Action Input: { "task": "Research AI advancements", "context": "Comprehensive Analysis Report: Latest Advancements in AI (2024)", "coworker": "Senior Research Analyst" 

I tried reusing the same input, I must stop using this action input. I'll try something else instead.



Here's my attempt at crafting a compelling blog post on the latest AI advancements:

**The Future of Artificial Intelligence: Trends and Breakthroughs**

As we step into 2024, the world of artificial intelligence (AI) is poised for significant growth and innovation. In this article, we'll delve into the latest trends and breakthroughs that are shaping the future of AI.

**Generative AI: The Rise of Small Language Models**

One of the most exciting developments in AI is the rise of generative AI, particularly small language models. These models have made tremendous progress in recent years, enabling non-tech individuals to harness the power of AI for various applications. With increased adoption and open-source advancements, we can expect to see even more innovative uses of generative AI in the coming year.

**Multimodal AI: The Future of Data Processing**

Another trend that's gaining traction is multimodal AI, which enables the integration of multiple data sources and modalities. This breakthrough technology has far-reaching implications for industries such as healthcare, finance, and education, where diverse data sets are crucial for informed decision-making.

**Model Optimization: Customized Local Models and Data Pipelines**

As AI adoption grows, so does the need for customized local models and data pipelines. Model optimization is becoming increasingly accessible, allowing organizations to develop tailored AI solutions for specific use cases. This trend will continue to shape the future of AI, enabling more accurate predictions and better decision-making.

**GPU Shortages and Cloud Costs: The Challenges Ahead**

Despite the excitement surrounding AI advancements, there are still challenges that need to be addressed. GPU shortages and cloud costs remain significant hurdles for developers and organizations looking to deploy AI projects. As we move forward, it's essential to find innovative solutions to these issues and ensure that AI remains accessible to all.

**The Future of AI: Trends and Breakthroughs**

In conclusion, the future of AI is bright, with trends such as generative AI, multimodal AI, model optimization, and more breakthroughs on the horizon. As we navigate the challenges ahead, it's crucial to stay informed about the latest developments in AI and their potential applications.

**Final Answer:**
The final answer is a blog post that highlights the latest trends and breakthroughs in AI, including generative AI, multimodal AI, model optimization, and more. The post aims to educate readers on the future of AI and its potential applications across various industries.

Please let me know if this meets your requirements!

> Finished chain.
 [DEBUG]: == [Tech Content Strategist] Task output: **
The final answer is a blog post that highlights the latest trends and breakthroughs in AI, including generative AI, multimodal AI, model optimization, and more. The post aims to educate readers on the future of AI and its potential applications across various industries.

Please let me know if this meets your requirements!


######################
**
The final answer is a blog post that highlights the latest trends and breakthroughs in AI, including generative AI, multimodal AI, model optimization, and more. The post aims to educate readers on the future of AI and its potential applications across various industries.

Please let me know if this meets your requirements!
```
*Below link is the article generated by crewAI*


> If you want to see complete vedio series on the same “Building Multi\-Agent LLM Systems with crewAI” see the below link







*With this you understand “Building Multi\-Agent LLM Systems with crewAI”….*

*Happy Learning !!!!!!!!!!*

*Please feel free to give suggestions or comments for better teaching..*


