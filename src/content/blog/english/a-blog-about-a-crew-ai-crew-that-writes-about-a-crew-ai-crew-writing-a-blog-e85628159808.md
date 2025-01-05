---
title: "A Blog about a Crew AI Crew that writes about a Crew AI Crew writing a Blog | by Ryan A Ellis | Medium"
meta_title: "A Blog about a Crew AI Crew that writes about a Crew AI Crew writing a Blog | by Ryan A Ellis | Medium"
description: "This blog post outlines the development of a blog-writing crew using the CrewAI framework, which enables the creation of autonomous AI agents. The author explains the key components of CrewAI, including agents, tasks, tools, and processes, and details the setup of a project that involves planning, researching, writing, and editing a blog. The project is implemented in Python and utilizes various tools for data collection and content generation. The final output is a well-structured blog post, demonstrating the capabilities of multi-agent systems in content creation."
date: 2025-01-03T06:40:26Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*TkhZA3qfFiAsWoDBQccRtA.jpeg"
categories: ["Programming", "Autonomous Systems", "Generative AI"]
author: "Rifx.Online"
tags: ["CrewAI", "agents", "tasks", "Python", "multi-agent"]
draft: False

---







## Introduction

The purpose of this blog post is to briefly demonstrate what I built with the crewAI framework and the components used that make it work. I wanted to test my knowledge of what I had learned from the short course, [Multi AI Agent Systems with crewAI](https://learn.deeplearning.ai/courses/multi-ai-agent-systems-with-crewai) , from DeepLearning.AI. This post will briefly explain the components I used from crewAI to build my own crew to write about blogs. For demonstration purposes the project was coded with python in a jupyter notebook and I will have the link to the notebook at the end of the post.


### What is Crew AI?

CrewAI is a multi\-agent framework that is programmed in python and allows users to make autonomous AI agents to work together to achieve a task or multiple tasks. For more detailed knowledge of what it is and what it does you can visit their website, [crewai.com](https://www.crewai.com/). The core components of crew AI can be broken into the following:

**Agents:** Agents in CrewAI are autonomous entities with defined roles and goals. For instance, a ‘Researcher’ might be tasked with gathering information, while a ‘Writer’ focuses on crafting engaging content.

**Tasks:** These are individual assignments allocated to agents. Each task comes with a description and an expected output, ensuring clarity and direction.

**Tools:** Agents utilize various tools to accomplish their tasks. These could include web scraping tools, API integration functionalities, or language models.

**Processes:** CrewAI orchestrates task execution through processes. These processes can be sequential or hierarchical, guiding agents through their tasks efficiently.


### Project Set up

My goal was to utilize crewAIs boilerplate code and customize it to make a crew that can plan, research and write a technical blog that is both educational and easy to follow. Dividing the work, much like the agents do, I planned the project by parts and added details later. The final plan was as follows:

1. Install crewAI
2. Define tools and keys
3. Define Agent Roles
4. Set up the tasks.
5. Define and run your crew!

Now, let’s begin!


### Step 1: Install Crew AI

To install crewAI, you need to have Python \>\=3\.10 and \<\=3\.13 installed on your system:


```python
%pip install crewai==0.30.11 crewai_tools==0.2.6
```
Congrats! crewAI should now be installed!


### Step 2: Define tools and keys

When working with API keys, it is advisable to store them as variables in a *.env* file and include this file in your *.gitignore* to ensure that sensitive information remains private. To load these environment variables, I utilize the *dotenv* library, which may require installation if not already available in your environment. For this project, we have two variables that we need to keep confidential: our OpenAI key and Serper API key. Below is an example of what my .env file looks like and how I imported the variables into the local environment.


```python
SERPER_API_KEY = 'Your Key Here'
OPENAI_API_KEY= 'Your Key Here'
OPENAI_MODEL_NAME='gpt-4o' 
```

```python
from dotenv import load_dotenv
## Loading variables from .env file
load_dotenv()
```
With our API keys loaded we can now initialize the AI tools.


```python
from crewai_tools import ScrapeWebsiteTool, SerperDevTool, YoutubeChannelSearchTool, YoutubeVideoSearchTool, CodeDocsSearchTool
codeDocTool = CodeDocsSearchTool()
youtubeChannelTool= YoutubeChannelSearchTool()
youtubeVideoTool = YoutubeVideoSearchTool()
search_tool = SerperDevTool()
scrape_tool = ScrapeWebsiteTool()
```
For our choice of large language model, we went with gpt\-4o. However, you are not restricted to OpenAI for llms. CrewAI allows you to use a wide variety of models of your choice! For those who want to learn more, visit crewAIs [documentation](https://docs.crewai.com/how-to/LLM-Connections/). One of the core components of crewAI is its utilization of tools. You can use prebuilt tools or create custom ones. Unsure of the specific tools the AI might require, I decided to equip it with five prebuilt tools: ScrapeWebsiteTool, SerperDevTool, YoutubeChannelSearchTool, YoutubeVideoSearchTool, and CodeDocsSearchTool. Below is a brief description of each tool:

* **ScrapeWebsiteTool:** Facilitates comprehensive data collection by scraping entire websites.
* **SerperDevTool:** Enables efficient Google searches.
* **YoutubeChannelSearchTool:** A Retrieval\-Augmented Generation (RAG) tool for searching within YouTube channels, ideal for video content analysis.
* **YoutubeVideoSearchTool:** A RAG tool designed for searching within YouTube videos, perfect for extracting video data.
* **CodeDocsSearchTool:** A RAG tool optimized for searching through code documentation and related technical documents.


### Step 3: Define Agent Roles

When defining agents in crewAI, it is essential to assign them a role, a goal, and a backstory. The role and goal should align with the tasks the agent will perform. The backstory adds personality and context, making the agent more relatable. For example, for the research agent, we aimed to ensure that its summaries are straightforward, allowing the writer agent to easily expand upon them. Note that having a more clear and concise combination of inputs will greatly affect the performance of the agent.


```python
##############################################################
## Agent: Planner
#
##############################################################
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
   tools=[scrape_tool, search_tool]
)

##############################################################
## Agent: Researcher
#
##############################################################
researcher = Agent(
    role="Tech Researcher",
    goal="To find excellent sources of information for the writer to use as a starting point.",
    tools=[search_tool, scrape_tool,codeDocTool, youtubeChannelTool, youtubeVideoTool],
    backstory=(
        "As a Tech Researcher, your prowess in "
        "navigating and extracting critical "
        "information from documentation is unmatched."
        "You are an expert in reading code and translating it to plain english"    
    )
)
##############################################################
## Agent: Writer
#
##############################################################
writer = Agent(
    role="Content Writer",
    goal="Write insightful and easy to follow "
         "tutorial about the topic: {topic}",
    backstory="You're working on a writing "
              "a new tutorial about the topic: {topic}. "
              "You base your writing on the work of "
              "the Content Planner, who provides an outline "
              "and relevant context about the topic. "
              "You follow the main objectives and "
              "direction of the outline, "
              "as provide by the Content Planner. "
              "You also provide objective and impartial insights "
              "and back them up with information "
              "provide by the Content Planner. "
              "You state your sources.",
    allow_delegation=False
)

##############################################################
## Agent: Editor
#
##############################################################
editor = Agent(
    role="Editor",
    goal="Edit a given blog post to align with "
         "the writing style of the organization. "
         "Ensure that the blog post is written for beginners",
    backstory="You are an editor who receives a blog post "
              "from the Content Writer. "
              "Your goal is to review the blog post "
              "to ensure that it follows journalistic best practices,"
              "provides balanced viewpoints "
              "when providing opinions or assertions, "
              "and also avoids major controversial topics "
              "or opinions when possible.",
    allow_delegation=False
)
```
Agents can be assigned individual tools either at the agent or task level. When assigned at the task level, the tool usage is prioritized. By default, delegation is enabled, but for this specific design, we disable delegation to focus agents on specific tasks. In other scenarios, enabling delegation might be beneficial to align agents with their tasks when the task may be handled by multiple specialized agents.


### Step 4: Set up task

Remember, the goal of this crew is to write a blog. I created four tasks to achieve this goal:

1. **Plan:** Create an outline for the blog.
2. **Research:** Compile and analyze various sources for the blog.
3. **Write:** Draft the blog using the provided sources.
4. **Edit:** Proofread the blog and optimize it for Search engine optimization (SEO).

Each task requires a description, expected output, and an assigned agent. The description and output can include variables, indicated by {}, which can be customized when initializing the crew.


```python
################################################################################
## Task: Plan
#
################################################################################
plan = Task(
    description=(
        "1. Choose a task that is easy to replicate for the following topic:  "
            "{topic}.\n"
        "2. Plan the article for those with limited knowledge of python.\n"
        "3. Develop a detailed content outline including "
            "an introduction, key points, and a call to action.\n"
        "4. Include SEO keywords and relevant data or sources."
    ),
    expected_output="A comprehensive content plan document "
        "with an outline, audience analysis, "
        "SEO keywords, and resources."
        "It should be formatted in a sequential step by step manner.",
    agent=planner,
    tools=[search_tool, scrape_tool]
)

################################################################################
## Task: Research
#
################################################################################
research = Task(
    description=("Given the current plan by the Content Planner make sure to do the following.\n"
        "1. Determine which sites are the best to search. For the planned topic of {topic}.\n"
        "2. Make a summary of sources the Writer can use as a reference when making the article."
    ),
    expected_output="A structured list of resources to use a brief description for each source.",
    agent=researcher,
    tools=[search_tool, scrape_tool,codeDocTool, youtubeChannelTool, youtubeVideoTool],
    context=[plan]
)

################################################################################
## Task: Write
#
################################################################################
write = Task(
    description=(
        "1. Using the outline provided by the content planner and tech researcher make a"
            "blog post on {topic}.\n"
        "2. Incorporate SEO keywords naturally.\n"
  "3. Sections/Subtitles are properly named "
            "in an engaging manner.\n"
        "4. Ensure the post is structured with an "
            "engaging introduction, insightful body, "
            "and a summarizing conclusion.\n"
        "5. This should be written in a follow along style that the reader can replicate.\n"
        "6. Proofread for grammatical errors and "
            "alignment with the brand's voice.\n"
    ),
    expected_output="A well-written blog post "
        "in markdown format, ready for publication, "
        "each section should have 2 or 3 paragraphs.",
    agent=writer,
    tools=[search_tool, scrape_tool],
    context = [plan,research]
)

################################################################################
## Task: Edit
#
################################################################################
edit = Task(
    description=("Proofread the given blog post for "
                 "grammatical errors and "
                 "ensure that there is plenty of content."),
    expected_output="A well-written blog post in markdown format, "
                    "ready for publication, "
                    "each section should have 2 or 3 paragraphs.",
    agent=editor,
    context=[plan,research,write],
    output_file="final_article.md" 
)
```
To ensure all necessary sources are available for a task, you can define the context. This context is an array of tasks that must be completed before the current task is executed.


### Step 5: Define and run your crew!

We’re nearing the end! Now, we need to define the crew and initiate its run. For this project, we’re using crewAI’s sequential process, executing tasks in the given order. Alternatively, crewAI offers a hierarchical process where a manager LLM assigns tasks to agents. We also enable memory for the crew, allowing Retrieval\-Augmented Generation (RAG) between agents. For more details on how the memory component works, refer to the crewAI [documentation](https://docs.crewai.com/core-concepts/Memory/).


```python
from crewai import Crew, Process
from langchain_openai import ChatOpenAI

crew = Crew(
    agents=[planner, researcher, writer, editor],
    tasks=[plan, research, write, edit],
    process=Process.sequential,
    verbose=True,
    memory=True    
)
```
Now let’s run our crew!


```python
result = crew.kickoff(inputs={"topic": "Building a Simple blog writing Crew with CrewAI"})
```
When we run the crew, we will give the crew the inputs that will act as our variables we used in the task. The inputs are a dictionary of text but you can have that text point to whatever you desire. For example, you could have the text value of a pdf file location. For that to work however, you must also have the agent equipped with the corresponding tool to read the pdf.


### Conclusion

In this article, I demonstrated how to use the crewAI framework to create a crew for writing a blog. You can find my results in markdown format on my GitHub [here](https://github.com/Codeblockz/CrewAI_Bloger_Demo/blob/main/final_article.md).


### Extra Resources

* [**Source File:**](https://github.com/Codeblockz/CrewAI_Bloger_Demo/blob/main/Research_writer_article.ipynb) The Jupyter Notebook I used.
* [**CrewAI Documentation:**](https://docs.crewai.com/) The official crewAI documentation.
* [**Multi AI Agent Systems with crewAI:**](https://learn.deeplearning.ai/courses/multi-ai-agent-systems-with-crewai) A short course by Deeplearning.AI that provided me with the foundational concepts of the crewAI framework.

