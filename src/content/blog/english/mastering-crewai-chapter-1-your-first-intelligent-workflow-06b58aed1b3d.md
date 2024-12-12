---
title: "Mastering CrewAI: Chapter 1 — Your First Intelligent Workflow"
meta_title: "Mastering CrewAI: Chapter 1 — Your First Intelligent Workflow"
description: "CrewAI is a platform for creating and managing teams of AI agents, offering both enterprise and open-source solutions. This article focuses on the open-source version. Agents in CrewAI are designed to simulate human-like behaviors in problem-solving, task execution, and interaction. The framework consists of four main components: Crew, AI Agents, Process, and Tasks. The installation process involves setting up a virtual environment, installing CrewAI, and creating a project template. The project structure includes `crew.py` for defining agents and tasks, `config/*.yaml` files for agent and task configurations, and `main.py` for running the crew. Agents can be assigned specific roles and goals, and tasks can be defined with detailed instructions and expected outputs. The article also covers running a crew using the `crewai` CLI or Python CLI, integrating open-source LLMs via Ollama, and using predefined tools from the CrewAI Toolkit. A practical example demonstrates creating a crew with a searcher, scrapper, copywriter, and file writer, each performing specific tasks in a sequential process."
date: 2024-12-12T01:14:38Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*NZJp8YSggSLwkxLIHgSwWg.png"
categories: ["Programming", "Generative AI", "Chatbots"]
author: "Rifx.Online"
tags: ["CrewAI", "agents", "tasks", "Ollama", "Toolkit"]
draft: False

---





### The Basics of Agents and Tasks



CrewAI is a platform that allows us to create and manage teams of AI agents. It offers both enterprise and open\-source solutions. In this blog post, we will delve into the open\-source CrewAI, of course.

So, what exactly is an agent?

Agents are modeled to simulate human\-like behaviors in problem\-solving, task execution, and interaction.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*iZgPrd8cLUztBV_u2dO5Wg.png)

An agent uses its abilities, prior knowledge, and observations to effectively act upon its environment to achieve its goals.

CrewAI is designed to help developers create and manage AI agent teams that can collaborate to accomplish complex tasks.

So, it is not a magic toy; rather, it is simply an abstraction for controlling and managing agent teams.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*HRbqTYl-0OUSfvF-eGXBaw.png)

We have 4 main components in the framework:

* Crew: Think of the “Crew” as the manager overseeing the entire operation.
* AI Agents: These are specialized team members, each with a unique role. They use tools to perform their tasks.
* Process: This is the workflow, like a blueprint for collaboration. It defines how agents interact, etc.
* Tasks: Assignments that agents must complete.


## Installation

* *\[optional \| to follow along]* create a new folder: *crewai\-demo*
* *\[optional \| to follow along]* create a new environment:


```python
python3 -m venv venv

source venv/bin/activate
```
* Install CrewAI


```python
pip install crewai crewai-tools
```
* Start a Crew project (*optional*: I used `myagents` as my project name)


```python
crewai create crew <project_name>
```
It builds a project template.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ESYfS-IT-sw1UAq-FYfh_g.png)

* It prompts us to select a provider (in this case, I will use OpenAI).

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*DIzVrXWyBIkpDHaQ9yW0Mg.png)

* It also asked for the model and OpenAI key (I chose *gpt\-4o\-mini*).
* Later, it created template files in the folders.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Pb89fHiuGiGheZ17FAdRHQ.png)


## Project Structure

Let’s take a close look at the created files.


### crew.py

This is the main script for our CrewAI project.


```python
from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task

@CrewBase
class Myagents():
 """Myagents crew"""

 agents_config = 'config/agents.yaml'
 tasks_config = 'config/tasks.yaml'

 @agent
 def researcher(self) -> Agent:
  return Agent(
   config=self.agents_config['researcher'],
   verbose=True
  )

 @agent
 def reporting_analyst(self) -> Agent:
  return Agent(
   config=self.agents_config['reporting_analyst'],
   verbose=True
  )

 @task
 def research_task(self) -> Task:
  return Task(
   config=self.tasks_config['research_task'],
  )

 @task
 def reporting_task(self) -> Task:
  return Task(
   config=self.tasks_config['reporting_task'],
   output_file='report.md'
  )

 @crew
 def crew(self) -> Crew:
  """Creates the Myagents crew"""

  return Crew(
   agents=self.agents, 
   tasks=self.tasks,
   process=Process.sequential,
   verbose=True,
  )
```
The `@CrewBase` decorator identifies `Myagents` as a CrewAI crew definition.


```python
@CrewBase
class Myagents():
```
It sets the framework for defining the agents, tasks, and crew logic. It is like a template for assembling our team.

The `@agent` decorator defines specific AI agents with predefined configurations.


```python
@agent
 def researcher(self) -> Agent:
  return Agent(
   config=self.agents_config['researcher'],
   verbose=True
  )

 @agent
 def reporting_analyst(self) -> Agent:
  return Agent(
   config=self.agents_config['reporting_analyst'],
   verbose=True
  )
```
Each agent’s behavior is determined by its configuration.

The `@task` decorator defines the task that the agents need to complete.


```python
@task
 def research_task(self) -> Task:
  return Task(
   config=self.tasks_config['research_task'],
  )

 @task
 def reporting_task(self) -> Task:
  return Task(
   config=self.tasks_config['reporting_task'],
   output_file='report.md'
  )
```
Tasks are like items on a to\-do list, each with clear instructions and sometimes an expected deliverable like `output_file='report.md'`

The `@crew` decorator is used to defining the entire crew within the project.


```python
@crew
 def crew(self) -> Crew:
  """Creates the Myagents crew"""
  # To learn how to add knowledge sources to your crew, check out the documentation:
  # https://docs.crewai.com/concepts/knowledge#what-is-knowledge

  return Crew(
   agents=self.agents, # Automatically created by the @agent decorator
   tasks=self.tasks, # Automatically created by the @task decorator
   process=Process.sequential,
   verbose=True,
   # process=Process.hierarchical, # In case you wanna use that instead https://docs.crewai.com/how-to/Hierarchical/
  )
```
The `Crew` class represents the entire team of agents working together. The `process` determines how the team operates. In a sequential process, tasks are completed one after another.

In summary:

* We create roles (like `researcher` and `reporting_analyst`) with specific capabilities using the `@agent`. These are the workers.
* We define jobs (like `research_task` and `reporting_task`) the agents need to perform using the `@task`.
* We assemble the agents and tasks into a single unit called `crew` , defining how they work together via the `process`.


### config/\*.yaml

YAML configurations define the roles, goals, and tasks of our AI agents.

**agents.yaml**

This file defines the configuration for each agent in the project. Each agent has a role, goal, and backstory.


```python
researcher:
  role: >
    {topic} Senior Data Researcher
  goal: >
    Uncover cutting-edge developments in {topic}
  backstory: >
    You're a seasoned researcher with a knack for uncovering the latest
    developments in {topic}. Known for your ability to find the most relevant
    information and present it in a clear and concise manner.

reporting_analyst:
  role: >
    {topic} Reporting Analyst
  goal: >
    Create detailed reports based on {topic} data analysis and research findings
  backstory: >
    You're a meticulous analyst with a keen eye for detail. You're known for
    your ability to turn complex data into clear and concise reports, making
    it easy for others to understand and act on the information you provide.
```
* `role`: the professional title
* `goal`: the primary objective
* `backstory`: a narrative background that defines the agent’s personality and approach.

This file is like assigning *personalities* and *responsibilities* to virtual team members. The `researcher` is the *detective*, tasked with finding hidden gems of information, while the `reporting_analyst` is the *storyteller*, organizing findings into coherent narratives.

**tasks.yaml**

This file defines the tasks to be performed by the agents. Each task includes a description, expected output, and the agent responsible for the task.


```python
research_task:
  description: >
    Conduct a thorough research about {topic}
    Make sure you find any interesting and relevant information given
    the current year is 2024.
  expected_output: >
    A list with 10 bullet points of the most relevant information about {topic}
  agent: researcher

reporting_task:
  description: >
    Review the context you got and expand each topic into a full section for a report.
    Make sure the report is detailed and contains any and all relevant information.
  expected_output: >
    A fully fledge reports with the mains topics, each with a full section of information.
    Formatted as markdown without '```'
  agent: reporting_analyst
```
* `description`: detailed instructions for the task.
* `expected_output`: specific format or type of output expected
* `agent`: which agent is responsible for completing the task.

The tasks represent what needs to be done and who will do it.

The `research_task` is like creating the foundation of a project, gathering raw but crucial data.

The `reporting_task` refines this foundation into a polished and actionable document.


### main.py

This is the entry point for running and interacting with our crew.


```python
import sys
import warnings

from myagents.crew import Myagents

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

def run():
    """
    Run the crew.
    """
    inputs = {
        'topic': 'AI LLMs'
    }
    Myagents().crew().kickoff(inputs=inputs)


def train():
    """
    Train the crew for a given number of iterations.
    """
    inputs = {
        "topic": "AI LLMs"
    }
    try:
        Myagents().crew().train(n_iterations=int(sys.argv[1]), filename=sys.argv[2], inputs=inputs)

    except Exception as e:
        raise Exception(f"An error occurred while training the crew: {e}")

def replay():
    """
    Replay the crew execution from a specific task.
    """
    try:
        Myagents().crew().replay(task_id=sys.argv[1])

    except Exception as e:
        raise Exception(f"An error occurred while replaying the crew: {e}")

def test():
    """
    Test the crew execution and returns the results.
    """
    inputs = {
        "topic": "AI LLMs"
    }
    try:
        Myagents().crew().test(n_iterations=int(sys.argv[1]), openai_model_name=sys.argv[2], inputs=inputs)

    except Exception as e:
        raise Exception(f"An error occurred while replaying the crew: {e}")
```
* `run` starts the crew with predefined inputs. Input `topic: "AI LLMs"` is passed to agents (remember it from the YAML file).


```python
researcher:
  role: >
    {topic} Senior Data Researcher
```
* `train` runs a training loop for the crew to improve performance over multiple iterations.
* `replay` re\-executes the crew from a specific task.
* `test` tests the crew’s execution and returns results for evaluation.


## Running a Crew

We can use `crewai` CLI command to run a crew or we can manually run a project using Python CLI.


### crewai CLI

* Go to the crewai project (*myagents* in my case)


```python
cd myagents
```
* Install `crewai` . It will create a new virtual environment and so on.


```python
crewai install
```
* Run the crew.


```python
crewai run
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*7AQnOhu_hASwtLu7VmUrsw.png)

First, it runs the “Senior Data Researcher”. Then, the “Reporting Analyst”.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*zYezD11vfXN45BCwOLJfoQ.png)

Finally, it created the `report.md` as we wanted.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*H5q26a1VKPJmqQiz05d7xg.png)


### Python CLI

To run it manually;

* Update module import in the `main.py`


```python
#from myagents.crew import Myagents
from crew import Myagents
```
* Load environment variables in `crew.py`


```python
from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task


from dotenv import load_dotenv

load_dotenv()
```
* Update `main.py`


```python
#!/usr/bin/env python
import sys
import warnings

#from myagents.crew import Myagents
from crew import Myagents

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")


def run():
    """
    Run the crew.
    """
    inputs = {
        'topic': 'AI LLMs'
    }
    Myagents().crew().kickoff(inputs=inputs)

run()
```
* Run the CLI command


```python
python myagents/src/myagents/main.py  
```

## Ollama Integration

Until now, we have been using `gpt-4o-mini` as the LLM. It is possible to use open\-source LLMs in CrewAI, and these models can be integrated using Ollama.

Let’s use `llama3.2:1b`


```python
ollama run llama3.2:1b
```
To run a model on the Ollama API, we need to update `crew.py`

`from crewai import LLM` adds the ability to define and integrate an LLM.


```python
from crewai import Agent, Crew, Process, Task, LLM # import LLM

@CrewBase
class Myagents():
 
 agents_config = 'config/agents.yaml'
 tasks_config = 'config/tasks.yaml'

  # Define a new LLM 
 ollama_llm = LLM(
  model="ollama/llama3.2:1b", # the model name
  base_url="http://localhost:11434", # the ollama endpoint
 )
```
Then we update the llm each agent uses.


```python
@agent
 def researcher(self) -> Agent:
  return Agent(
   config=self.agents_config['researcher'],
   verbose=True,
   llm=self.ollama_llm # You can pass the LLM to the agent
  )

 @agent
 def reporting_analyst(self) -> Agent:
  return Agent(
   config=self.agents_config['reporting_analyst'],
   verbose=True,
   llm=self.ollama_llm # You can pass the LLM to the agent
  )
```
The new `crew.py`


```python
from crewai import Agent, Crew, Process, Task, LLM
from crewai.project import CrewBase, agent, crew, task
from dotenv import load_dotenv

load_dotenv()

@CrewBase
class Myagents():

 agents_config = 'config/agents.yaml'
 tasks_config = 'config/tasks.yaml'

 ollama_llm = LLM(
  model="ollama/llama3.2:1b",
  base_url="http://localhost:11434",
 )

 @agent
 def researcher(self) -> Agent:
  return Agent(
   config=self.agents_config['researcher'],
   verbose=True,
   llm=self.ollama_llm # You can pass the LLM to the agent
  )

 @agent
 def reporting_analyst(self) -> Agent:
  return Agent(
   config=self.agents_config['reporting_analyst'],
   verbose=True,
   llm=self.ollama_llm # You can pass the LLM to the agent
  )

 @task
 def research_task(self) -> Task:
  return Task(
   config=self.tasks_config['research_task'],
  )

 @task
 def reporting_task(self) -> Task:
  return Task(
   config=self.tasks_config['reporting_task'],
   output_file='report.md'
  )

 @crew
 def crew(self) -> Crew:
  """Creates the Myagents crew"""


  return Crew(
   agents=self.agents,
   tasks=self.tasks,
   process=Process.sequential,
   verbose=True,
  )
```
Run the crew again.


```python
crewai run
```

## Tasks

A Task in CrewAI is a specific assignment given to an AI agent. It encapsulates the specific actions the agent must perform.

Tasks can follow two primary workflows:

* **Sequential**: Tasks are executed one after another in the order they are defined. `task1` \-\> `task2` \-\> `task3`
* **Hierarchical**: Tasks are assigned dynamically to agents based on their roles and expertise. `task1` can split into subtasks `subtask1`, `subtask2`.

The basic interface to set an execution flow:


```python
crew = Crew(
    agents=[agent1, agent2],  # Define the agents
    tasks=[task1, task2],    # Define the tasks
    process=Process.sequential  # or Process.hierarchical
)
```
Tasks can be customized using its many attributes.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*uunEfMrm6pwbuW9gaqs-gw.png)

By customizing these attributes, we can design tasks tailored to our project requirements.


## Tools

Tools are the building blocks that empower AI agents to perform a wide range of tasks. These tools can range from APIs, LLMs, or database connectors to custom\-built logic.

While we can create our own custom tools, CrewAI includes a preset toolkit called the CrewAI Toolkit and also supports the LangChain Toolkit.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ftYg5qbvlWcvXb_ue14NaQ.png)

To understand tasks \& tools better, let’s create a new CrewAI project (I named it *crew\-tasks, using gpt\-4o\-mini*).

We will have four agents: `searcher`, `scrapper`, `copywriter`, and `file_writer`.

* `searcher` will search for a specific subject on the web.
* `scrapper` will scrap the websites that `searcher` returns.
* `copywriter` generates meaningful texts from the data from the websites.
* `file_writer` writes the output into a file.

We will use predefined tools from `crewai_tools` .


```python
from crewai_tools import SerperDevTool, ScrapeWebsiteTool, FileWriterTool


@CrewBase
class CrewTasks():
 """CrewTasks crew"""

 agents_config = 'config/agents.yaml'
 tasks_config = 'config/tasks.yaml'

 @agent
 def searcher(self) -> Agent:
  return Agent(
   config=self.agents_config['searcher'],
   verbose=True,
   tools=[SerperDevTool()],
  )

 @agent
 def scrapper(self) -> Agent:
  return Agent(
   config=self.agents_config['scrapper'],
   verbose=True,
   tools=[ScrapeWebsiteTool()],
  )
 
 @agent
 def copywriter(self) -> Agent:
  return Agent(
   config=self.agents_config['copywriter'],
   verbose=True,
  )
 
 @agent
 def file_writer(self) -> Agent:
  return Agent(
   config=self.agents_config['file_writer'],
   verbose=True,
   tools=[FileWriterTool()],
  )

@task
 def search_task(self) -> Task:
  return Task(
   config=self.tasks_config['search_task'],
  )
 
 @task
 def scrape_task(self) -> Task:
  return Task(
   config=self.tasks_config['scrape_task'],
  )

 
 @task
 def content_write_task(self) -> Task:
  return Task(
   config=self.tasks_config['content_write_task'],
  )
 
 @task
 def file_write_task(self) -> Task:
  return Task(
   config=self.tasks_config['file_write_task'],
  )

 @crew
 def crew(self) -> Crew:
  """Creates the CrewTasks crew"""
 
  return Crew(
   agents=self.agents, 
   tasks=self.tasks, 
   process=Process.sequential,
   verbose=True,
  
  )
```
For each agent, we have a specific task: `search_task`, `scrap_task`, `content_write_task`, and `file_write_task`.

Accordingly, we should update the YAML files.

**agents.yaml**


```python
searcher:
  role: >
    {topic} Content Searcher
  goal: >
    Uncover cutting-edge developments in {topic}
  backstory: >
    You're a seasoned researcher with a knack for uncovering the latest
    developments in {topic}. Known for your ability to find the most relevant
    information and present it in a clear and concise manner.

scrapper:
  role: >
    Website Scraper
  goal: >
    Scrape the website for the latest {topic} content
  backstory: >
    You're a skilled web scraper with a knack for extracting the most valuable imnfomration from websites. Known for your ability to navigate complex websites and extract the most relevant information.

copywriter:
  role: >
    Content Copywriter
  goal: >
    Write engaging and informative content based on the provided information
  backstory: >
    You're a talented copywriter with a flair for creating engaging and informative content. Known for your ability to distill complex information into clear and compelling copy.

file_writer:
  role: >
    File Writer
  goal: >
    Write the extracted information to a file
  backstory: >
    You're a skilled writer with a knack for creating well-organized and informative files. Known for your ability to present information in a clear and concise manner.
```
**tasks.yaml**


```python
search_task:
  description: >
    Conduct a thorough research about {topic}
    Make sure you find any interesting and relevant information given
    the current year is 2024.
  expected_output: >
    A list with 10 bullet points of the most relevant information about {topic}
  agent: searcher

scrape_task:
  description: >
    Scrape the web for the most recent information about {topic}
    Make sure you find any interesting and relevant information given
    the current year is 2024.
  expected_output: >
    Scrapped websites with all the important information about {topic}
  agent: scrapper

content_write_task:
  description: >
    Write a blog post about {topic}
    Make sure you include all the relevant information and make it
    engaging for the reader.
  expected_output: >
    A blog post about {topic} with at least 200 words.
  agent: copywriter

file_write_task:
  description: >
    Write the article to a file
  expected_output: >
    Article written in a article.md file
  agent: file_writer
```
We are almost done.

Finally, we need a SERPER\_API\_KEY.

Go to: [*serper.dev*](https://serper.dev/api-key)

Add it to the *.env* file


```python
SERPER_API_KEY=your-api-key
```

```python
## main.py

import sys
import warnings
from datetime import datetime
from crew import CrewTasks

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

def run():
    """
    Run the crew.
    """
    inputs = {
        'topic': 'AI LLMs',
        "date": datetime.now().strftime('%Y-%m-%d'),
    }
    CrewTasks().crew().kickoff(inputs=inputs)

run()
```
When I ran this crew, it failed to scrape the websites. It seems that the smaller model I used, `gpt-4o-mini`, is not capable of handling such a task. I updated the model to `gpt-4o` (via the `.env` file), reran `main.py`, and this time it succeeded.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*yq8GsDG2SQeneyXFm1K-LA.png)

We can give multiple inputs and run it for each.


```python
def run():
    """
    Run the crew.
    """
    # inputs = {
    #     'topic': 'AI LLMs',
    #     "date": datetime.now().strftime('%Y-%m-%d'),
    # }

    inputs_list = [
        {
            'topic': 'AI LLMs',
            "date": datetime.now().strftime('%Y-%m-%d'),
        },
        {
            'topic': 'Hugging Face',
            "date": datetime.now().strftime('%Y-%m-%d'),
        },
        {
            'topic': 'Ollama',
            "date": datetime.now().strftime('%Y-%m-%d'),
        },

    ]
    # CrewTasks().crew().kickoff(inputs=inputs)
    CrewTasks().crew().kickoff_for_each(inputs=inputs_list)
```
This concludes the first chapter on utilizing CrewAI.


### Read More


### Sources

[https://www.codiste.com/ai\-agents\-and\-agentic\-workflows](https://www.codiste.com/ai-agents-and-agentic-workflows)

<https://www.crewai.com/>

<https://docs.crewai.com/concepts/tasks>

<https://docs.crewai.com/concepts/tools>

[https://www.youtube.com/watch?v\=ONKOXwucLvE](https://www.youtube.com/watch?v=ONKOXwucLvE)


## In Plain English 🚀

*Thank you for being a part of the [**In Plain English**](https://plainenglish.io/) community! Before you go:*

* Be sure to **clap** and **follow** the writer ️👏**️️**
* Follow us: [**X**](https://x.com/inPlainEngHQ) \| [**LinkedIn**](https://www.linkedin.com/company/inplainenglish/) \| [**YouTube**](https://www.youtube.com/channel/UCtipWUghju290NWcn8jhyAw) \| [**Discord**](https://discord.gg/in-plain-english-709094664682340443) \| [**Newsletter**](https://newsletter.plainenglish.io/) \| [**Podcast**](https://open.spotify.com/show/7qxylRWKhvZwMz2WuEoua0)
* [**Create a free AI\-powered blog on Differ.**](https://differ.blog/)
* More content at [**PlainEnglish.io**](https://plainenglish.io/)

