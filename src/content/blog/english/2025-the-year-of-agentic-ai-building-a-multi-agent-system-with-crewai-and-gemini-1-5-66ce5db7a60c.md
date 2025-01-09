---
title: "2025: The Year of Agentic AI — Building a Multi-Agent System with CrewAi and Gemini 1.5"
meta_title: "2025: The Year of Agentic AI — Building a Multi-Agent System with CrewAi and Gemini 1.5"
description: "The article discusses the emergence of agentic AI, anticipated to transform technology interactions by 2025 through autonomous systems capable of decision-making with minimal human input. The author outlines the development of a multi-agent system using Gemini 1.5 and CrewAi, which automates content creation by researching topics, writing blog posts, and summarizing for LinkedIn. Key challenges faced include agent integration, refining research accuracy, and ensuring content quality. The project exemplifies the potential of agentic AI to streamline complex tasks and enhance productivity across various industries."
date: 2025-01-09T01:54:33Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*kCQEo_XteDxjn_yypzi_zA.jpeg"
categories: ["Autonomous Systems", "Programming", "Generative AI"]
author: "Rifx.Online"
tags: ["agentic", "autonomous", "multi-agent", "Gemini", "CrewAi"]
draft: False

---






As many experts predict, 2025 is shaping up to be the year of agentic AI. This emerging field is poised to redefine how we interact with technology by introducing highly autonomous systems that can make decisions and perform complex tasks with minimal human intervention. Inspired by this, I’ve embarked on building a multi\-agent system that not only performs specific tasks but also creates meaningful content based on a user\-defined topic.

In this post, I’ll walk you through the system I built, the challenges I faced, and the exciting future that agentic AI holds.


## What is Agentic AI?

Agentic AI refers to systems designed to independently perform tasks without continuous human oversight. Unlike traditional AI, which requires explicit instructions at every step, agentic AI is capable of making autonomous decisions and adjusting its actions based on changing circumstances.

By 2025, we expect that these systems will become integral to industries ranging from healthcare to logistics, with the ability to handle everything from automating repetitive tasks to solving complex problems autonomously. In fact, many forecasts predict that more than 60% of enterprise AI implementations will integrate agentic AI in some form.


## The Vision Behind My Multi\-Agent System

With the promise of agentic AI looming large, I decided to build a simple multi\-agent system that could demonstrate its potential in the realm of content creation and summarization. The system I built takes a user\-input topic, performs relevant web research, and generates two outputs: an in\-depth blog post and a concise LinkedIn post.

This project relies on the power of the **Gemini 1\.5 model**, a powerful AI language model, which plays a critical role in generating the content. Gemini 1\.5 offers impressive text generation capabilities, ensuring that the output is both coherent and engaging and **CrewAi,**a platform designed to build and manage AI\-driven multi\-agent systems. It allows you to create complex workflows by defining agents with specific roles and tasks, and then orchestrating them to work together seamlessly..


## How the System Works

The multi\-agent system I built utilizes **three main agents**:

1. **Topic Researcher**: This agent is responsible for searching and analyzing a relevant resource about the given topic from the web. It uses internet search tools to identify the most relevant and informative article on the subject.
2. **Blog Writer**: The second agent takes the research findings and uses them to craft a comprehensive blog post. The blog post includes an introduction, step\-by\-step guides, and a conclusion to provide the reader with a complete understanding of the topic.
3. **LinkedIn Post Creator**: The third agent summarizes the information in a concise and engaging LinkedIn post. This agent focuses on crafting a message that resonates with professionals, including relevant hashtags to boost visibility.


## Code Blocks and Explanations

Below are the key components of the system, with code blocks and explanations.


### 1\. Importing Libraries and Initializing the Environment

The first step is to load environment variables, such as the API keys for the tools we are using:


```python
import os
from dotenv import load_dotenv
from crewai import Agent, Crew, Process, Task
from crewai_tools import SerperDevTool
import os
from crewai import LLM
from dotenv import load_dotenv

## Load environment variables from a .env file
load_dotenv()
## Set the API key for the SerperDevTool (web search tool)
os.environ['SERPER_API_KEY'] = os.getenv('SERPER_API_KEY')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
```
Here, we load the API keys from a `.env` file to keep them secure and not hard\-code them directly in the script.


### 2\. Setting Up the AI Tools

Next, we initialize the Gemini 1\.5 model and the web search tool (SerperDevTool):


```python
## Initialize the tool for internet searching capabilities
tool = SerperDevTool()
llm = LLM(
    model="gemini/gemini-1.5-flash",  # Specify the AI model to use
    temperature=0.7  # Set the creativity of the model
)
```
Here, we set up the `SerperDevTool` to perform web searches and the `Gemini 1.5` model for generating the content. The `temperature` controls how creative or deterministic the responses are.


### 3\. Defining Agents

We define three agents that work together to achieve the goal: a **Topic Researcher**, **Blog Writer**, and **LinkedIn Post Creator**.


```python
## Define the Topic Researcher agent
topic_researcher = Agent(
    role='Topic Researcher',
    goal='Search for only 1 relevant resource on the topic {topic} from the web',
    verbose=True,
    memory=True,
    backstory='Expert in finding and analyzing relevant content from Web...',
    tools=[tool],
    llm=llm,
    allow_delegation=True
)
```

```python
## Define the Blog writer agent
blog_writer = Agent(
    role='Blog Writer',
    goal='Write a comprehensive blog post from the only 1 article  provided by the Topic Researcher, covering all necessary sections',
    verbose=True,
    memory=True,
    backstory='Experienced in creating in-depth, well-structured blog posts that explain technical concepts clearly and engage readers from introduction to conclusion.',
    tools=[tool],
    llm=llm,
    allow_delegation=True

)
```

```python
## Define the linkedin post writer agent

linkedin_post_agent = Agent(
    role='LinkedIn Post Creator',
    goal='Create a concise LinkedIn post summary from the transcription provided by the Topic Researcher.',
    verbose=True,
    memory=True,
    backstory='Expert in crafting engaging LinkedIn posts that summarize complex topics and include trending hashtags for maximum visibility.',
    tools=[tool],
    llm=llm,
    allow_delegation=True

)
```
Each agent is defined with specific roles and goals. For example, the `Topic Researcher` agent is responsible for finding relevant articles on the web.


### 4\. Defining Tasks for Each Agent

Once the agents are set up, we define tasks that each agent will perform. For example, the `Topic Researcher` is tasked with identifying relevant content:


```python
## Define Tasks
research_task = Task(
    description="Identify and analyze only 1 content or  article on the {topic} from the web.",
    expected_output="A complete word-by-word report on the most relevant post or article found on the topic {topic}.",
    agent=topic_researcher,
    tools=[tool]
)

blog_writing_task = Task(
    description="""Write a comprehensive blog post based on the 1 article  provided by the Topic Researcher.
                   The article must include an introduction, step-by-step guides, and conclusion.
                   The overall content must be about 400 words long.""",
    expected_output="A markdown-formatted blog post",
    agent=blog_writer,
    tools=[tool],
    output_file='./artifacts/blog-post.md'
)

linkedin_post_task = Task(
    description="Create a LinkedIn post summarizing the key points from the transcription provided by the Topic Researcher, including relevant hashtags.",
    expected_output="A markdown-formatted LinkedIn post",
    agent=linkedin_post_agent,
    tools=[tool],
    output_file='./artifacts/linkedin-post.md'
)
```
In this case, the tasks involves searching for and analyzing a relevant article on a specific topic and create blog and Linkedin post.


### 5\. Running the Process

Once the agents and tasks are set up, we create the **Crew** and initiate the process:


```python
## Create the Crew with defined agents and tasks
my_crew = Crew(
    agents=[topic_researcher, linkedin_post_agent, blog_writer],
    tasks=[research_task, linkedin_post_task, blog_writing_task],
    verbose=True,
    process=Process.sequential  # Run tasks sequentially
)
## Input Topic
topic_of_interest = 'gemini 2.0 multimodel'
## Kick off the process with the provided topic
result = my_crew.kickoff(inputs={'topic': topic_of_interest})
print(result)
```
Here, the agents work together in a **sequential process**, ensuring that each agent performs its task one after another. The `kickoff` method runs the process with the provided `topic_of_interest`, which is "gemini 2\.0 multimodel" in this case.


### 6\. Generating the Output

The agents will perform their respective tasks and generate the outputs: a comprehensive blog post and a concise LinkedIn post. The result is printed at the end.


## The Role of Gemini 1\.5

One of the most exciting aspects of this project is the use of the **Gemini 1\.5 model** to power the AI agents. Gemini 1\.5 is known for its advanced natural language processing capabilities, which allow it to understand and generate human\-like text in a wide range of contexts. Whether it’s performing research or writing content, Gemini 1\.5 ensures that the agents can effectively complete their tasks with high accuracy and fluidity.


## Challenges and Lessons Learned

Building this multi\-agent system wasn’t without its challenges. Some of the key hurdles I encountered included:

1. **Integrating Multiple Agents**: Ensuring smooth communication between agents was crucial. Each agent had a specific role, but they needed to work together seamlessly to produce the desired outcome. I learned that clear and well\-defined task management was essential for the system’s efficiency.
2. **Refining the Research Agent**: The Topic Researcher agent was tasked with combing the web for relevant resources. While it performed well overall, there were instances where it returned articles that were not entirely relevant to the topic. Fine\-tuning its search parameters took some trial and error.
3. **Content Quality Control**: Although Gemini 1\.5 is highly effective at generating content, the quality of the output depends on the input it receives. It was important to ensure that the research provided to the Blog Writer and LinkedIn Post Creator agents was comprehensive and clear, to produce coherent and well\-structured final outputs.


## Conclusion

2025 may very well be the year of agentic AI, and we are already seeing early glimpses of its potential. My multi\-agent system is just one example of how AI can be used to automate complex tasks and generate meaningful outputs. As technology continues to improve, we can expect even more powerful systems to emerge, reshaping industries and making AI a crucial part of our daily lives.


