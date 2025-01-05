---
title: "Multi-Agent AI Mastery: Building Content Writing AI System with CrewAI | by Kshitij Kutumbe | Medium"
meta_title: "Multi-Agent AI Mastery: Building Content Writing AI System with CrewAI | by Kshitij Kutumbe | Medium"
description: "The article discusses Crew.AI, a framework for developing multi-agent AI systems that simulate team dynamics. It outlines Crew.AIs modular architecture, which includes tools, tasks, agents, crew, and processes, facilitating collaborative task execution. The framework supports various strategies like sequential, hierarchical, and consensual processes. An example is provided on building a content writing engine with defined roles for a planner, writer, and editor, showcasing how agents can work together to produce a blog post. Crew.AI allows for complex tasks beyond content creation, such as data analysis and internet searches."
date: 2025-01-03T06:38:15Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*XS4qjVszohrcdTC7"
categories: ["Programming", "Machine Learning", "Chatbots"]
author: "Rifx.Online"
tags: ["multi-agent", "framework", "collaboration", "processes", "roles"]
draft: False

---






In the realm of AI and language models, a multi\-agent system involves several independent actors, each powered by language models, collaborating in a structured manner. In this blog, we will delve into Crew.AI, a cutting\-edge framework for building multi\-agent applications. Crew.AI enables AI agents to assume roles, share goals, and operate cohesively, mimicking the dynamics of a well\-coordinated team.


## Architecture

The architecture of Crew.AI is modular, consisting of several key components that work together to create a seamless multi\-agent system. The following sections describe these components, starting from the bottom up to illustrate how they integrate.

**Tool:** A tool is a utility or equipment that agents use to perform specific tasks efficiently. Examples include searching the web, loading documents, and reading them. Built with LangChain, Crew.AI allows for the use of existing tools from LangChain or the creation of custom tools.

**Task:** A task is a specific activity that needs to be executed by an agent. Various tools are provided to execute these tasks efficiently.

**Agents:** Agents are the core performers in the Crew.AI framework, each with a specific role, background, goal, and memory. Each Crew.AI agent is a LangChain agent enhanced with a ReActSingleInputOutputParser. This parser is specially modified to support role\-playing, incorporate a binding stop word for contextual focus, and integrate a memory mechanism using ConversationSummaryMemory for maintaining context.

**Crew:** The crew represents a team of agents working together to achieve a particular goal. These agents collaborate in a well\-defined manner to accomplish the set tasks.

**Process:** The process object represents the workflow or strategy the crew follows to complete tasks. The framework defines three strategies (as of the time of writing, with plans for more):

* **Sequential:** Executes tasks in a defined order, ideal for pipeline\-type work where each agent performs a specific task and passes it to the next. This strategy is used in the example to write a blog on a given topic.
* **Hierarchical:** Organizes tasks in a hierarchy, delegating them in a chain of command. This strategy resembles an orchestrator pattern, similar to a manager assigning work to various agents and validating results before completion. The next blog will explore a solution using this strategy.
* **Consensual Process (Planned):** A popular strategy yet to be released, where agents collaborate to make decisions democratically. Although not yet implemented in Crew.AI, other multi\-agent frameworks have adopted this approach and it will be explored in future blogs.

For more detailed information on these components and their APIs, refer to the Crew.AI documentation.

Let’s now see how CrewAI could be used to build an almost autonomous content/blog writing engine for yourself or your company:

Installations:


```python
!pip install crewai==0.28.8 crewai_tools==0.1.6 langchain_community==0.0.29
```
Imports:


```python
from crewai import Agent, Task, Crew
import os
```
LLM credentials and name:


```python
os.environ["OPENAI_MODEL_NAME"] = 'gpt-3.5-turbo'
os.environ["OPENAI_API_KEY"]=""
```
Defining Agents, Tasks and crew:


```python
planner = Agent(
    role="Content Planner",
    goal="Plan engaging and factually accurate content on {topic}",
    backstory="You're working on planning a blog article "
              "about the topic: {topic}."
              "You collect information that helps the "
              "audience learn something "
              "and make informed decisions. "
              "Your work is the basis for "
              "the Content Writer to write an article on this topic.",
    allow_delegation=False,
 verbose=True
)

writer = Agent(
    role="Content Writer",
    goal="Write insightful and factually accurate "
         "opinion piece about the topic: {topic}",
    backstory="You're working on a writing "
              "a new opinion piece about the topic: {topic}. "
              "You base your writing on the work of "
              "the Content Planner, who provides an outline "
              "and relevant context about the topic. "
              "You follow the main objectives and "
              "direction of the outline, "
              "as provide by the Content Planner. "
              "You also provide objective and impartial insights "
              "and back them up with information "
              "provide by the Content Planner. "
              "You acknowledge in your opinion piece "
              "when your statements are opinions "
              "as opposed to objective statements.",
    allow_delegation=False,
    verbose=True
)
editor = Agent(
    role="Editor",
    goal="Edit a given blog post to align with "
         "the writing style of the organization. ",
    backstory="You are an editor who receives a blog post "
              "from the Content Writer. "
              "Your goal is to review the blog post "
              "to ensure that it follows journalistic best practices,"
              "provides balanced viewpoints "
              "when providing opinions or assertions, "
              "and also avoids major controversial topics "
              "or opinions when possible.",
    allow_delegation=False,
    verbose=True
)

plan = Task(
    description=(
        "1. Prioritize the latest trends, key players, "
            "and noteworthy news on {topic}.\n"
        "2. Identify the target audience, considering "
            "their interests and pain points.\n"
        "3. Develop a detailed content outline including "
            "an introduction, key points, and a call to action.\n"
        "4. Include SEO keywords and relevant data or sources."
    ),
    expected_output="A comprehensive content plan document "
        "with an outline, audience analysis, "
        "SEO keywords, and resources.",
    agent=planner,
)

write = Task(
    description=(
        "1. Use the content plan to craft a compelling "
            "blog post on {topic}.\n"
        "2. Incorporate SEO keywords naturally.\n"
  "3. Sections/Subtitles are properly named "
            "in an engaging manner.\n"
        "4. Ensure the post is structured with an "
            "engaging introduction, insightful body, "
            "and a summarizing conclusion.\n"
        "5. Proofread for grammatical errors and "
            "alignment with the brand's voice.\n"
    ),
    expected_output="A well-written blog post "
        "in markdown format, ready for publication, "
        "each section should have 2 or 3 paragraphs.",
    agent=writer,
)

edit = Task(
    description=("Proofread the given blog post for "
                 "grammatical errors and "
                 "alignment with the brand's voice."),
    expected_output="A well-written blog post in markdown format, "
                    "ready for publication, "
                    "each section should have 2 or 3 paragraphs.",
    agent=editor
)

crew = Crew(
    agents=[planner, writer, editor],
    tasks=[plan, write, edit],
    verbose=2
)

```
Extracting the output:


```python
result = crew.kickoff(inputs={"topic": "Artificial Intelligence?"})
```
And this is how the output blog will look like:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*xokrHoAVZCHIuKH2HOi9FA.png)

This is just one of the many applications that could be built using CrewAI or Autogen or other such frameworks. You can also make it perform more complex tasks like searching over internet, collecting data, performing data analysis, providing conclusions and so on.

Also checkout my other blog:


