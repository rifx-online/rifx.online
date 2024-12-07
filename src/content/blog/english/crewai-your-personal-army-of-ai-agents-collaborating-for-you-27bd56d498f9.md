---
title: "CrewAI: Your Personal Army of AI Agents, Collaborating for You"
meta_title: "CrewAI: Your Personal Army of AI Agents, Collaborating for You"
description: "CrewAI is a framework that facilitates collaboration among AI agents, enabling them to work together on tasks in a structured manner. It consists of agents, tasks, tools, processes, and crews, allowing for efficient execution of both simple and complex tasks. The framework supports applications like smart assistants and automated customer service. Additionally, CrewAI can be integrated with LangChain and other tools to enhance AI capabilities, enabling autonomous agents to perform tasks based on user queries. Overall, CrewAI provides a robust solution for developing multi-agent systems."
date: 2024-12-07T12:39:52Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*VF65WeGkHcmWtuZT2zKWFg.jpeg"
categories: ["Programming", "Machine Learning", "Autonomous Systems"]
author: "Rifx.Online"
tags: ["collaboration", "agents", "tasks", "LangChain", "multi-agent"]
draft: False

---






**What the CrewAI framework is ?**

The power of AI collaboration has too much to offer. CrewAI is designed to enable AI agents to assume roles, share goals, and operate in a cohesive unit — much like a well\-oiled crew. Whether you’re building a smart assistant platform, an automated customer service ensemble, or a multi\-agent research team, CrewAI provides the backbone for sophisticated multi\-agent interactions.

In others terms, CrewAI is an agent Framework that allows us to create agents to help us solve simple (optimization) or complex tasks (develop a game as example). AI agents assume roles, share goals and operate in a cohesive unit, much like a weel\-oiled crew.

We’ll look at an example of how to use it :)


> *If you’re interested in practical tips to increase your productivity and your skill in Machine Learning, feel free to subscribe to our [LinkedIn page](https://www.linkedin.com/company/lilmod-ai/). Every day we share exciting news in the field and every week a new article.*

Before moving on to implementation, let’s take a brief look at the different concepts involved.

**A/ Agents**

An agent represents a member of a team (crew). It has a bunch of attributes that we can assign to it to kind of help guide on what that job is

**B/ Tasks**

A task is just something to be completed by the agent. it is responsible for task execution. We can give it a description of the task for more guideness.

**C/ Tool**

A tool is a skill or function that agents can utilize to perform various actions. This includes tools from the crewAI Toolkit and LangChain Tools, enabling everything from simple searches to complex interactions and effective teamwork among agents.

**D/ Process**

Processes orchestrate the execution of tasks by agents, akin to project management in human teams. These processes ensure tasks are distributed and executed efficiently, in alignment with a predefined strategy.

**E/ Crews**

A crew represents a collaborative group of agents working together to achieve a set of tasks. Each crew defines the strategy for task execution, agent collaboration, and the overall workflow.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*W6ix1fdlcoce_AG8zLWLCA.png)

***Requirements* :**

*You need an OpenIA key and to choose the GPT model (I use gpt\-4\).*


```python
import os
from crewai import Agent, Task, Crew, Process # pip install crewai
from dotenv import load_dotenv
from CalculatorTool import calculate

os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY") # In .env file 
os.environ["OPENAI_MODEL_NAME"] = "gpt-4"
```
Our objective is to implement an application that uses 3 agents to plan and develop the functionalities of a mobile application, as well as to design its user interface and write its technical documentation (respectively).


```python
user_input = input("Enter the main features in the mobile app: ") # User

## Agent 1
feature_planner = Agent(
    role="Feature Planner",
    goal="You can design and outline the key features of the mobile app based on the input provided.",
    backstory="You are a product manager skilled in outlining app features that align with user needs and business goals.",
    verbose=True
)

## Agent 2
uiux_designer = Agent(
    role="UI/UX Designer",
    goal="You can create a user-friendly design for the app, considering user experience and usability.",
    backstory="""You are an experienced designer with a strong focus on creating intuitive and visually appealing interfaces.""",
    verbose=True
)

## Agent 3
technical_writer = Agent(
    role="Technical Writer",
    goal="You are tasked with writing detailed technical documentation for developers based on the app's design and features.",
    backstory="You are a seasoned technical writer with extensive experience in creating clear and concise documentation for software developers.",
    verbose=True
)
```
The *backstory* and *verbose* parameters are very important for understanding the flow:

*backstory*: The *feature \_planner* agent (for example) is described as a product manager experienced in defining functionalities that meet user needs and business objectives.*verbose\=True*: This indicates that the agent provides additional details about its process or actions.

**Definition of tasks :**

We’re going to create three tasks :

* List the main features of the application, classified by type (e.g. authentication, notifications, etc.).\-
* Generate a detailed wireframe or description of the user interface, with a rationale for UX decisions.
* Create a technical document for developers explaining the application architecture and how to implement the features.


```python
task1 = Task(
    description=f"Design the core features of the mobile app based on the following input: {app_features_input}",
    expected_output="List the key features of the app, categorized by functionality (e.g., authentication, notifications, etc.).",
    agent=feature_planner
)

task2 = Task(
    description="Design the user interface and experience (UI/UX) based on the planned features.",
    expected_output="Generate a detailed wireframe or description of the user interface, along with a rationale for UX decisions.",
    output_file="uiux_design.txt",
    agent=uiux_designer
)

task3 = Task(
    description="Write the technical documentation detailing how the features should be implemented, including architecture diagrams, API endpoints, and data flow.",
    expected_output="Create a technical document for developers that explains the app's architecture and how to implement the features.",
    output_file="technical_documentation.txt",
    agent=technical_writer
)
```
When you run the code, the ‘`technical_documentation.txt`.’ file will appear, which is why it’s important to create the *output\_file* parameter

All that’s left to do is to create a crew made up of our two agents.

**Creating the team and managing the process :**

The tasks are carried out in order (sequentially). A Crew object is created with the agents and tasks defined previously.


```python
crew = Crew(
    agents=[feature_planner, uiux_designer, technical_writer],
    tasks=[task1, task2, task3],
    process=Process.sequential,  # The tasks are carried out in the order
    verbose=True
)

print(crew.kickoff())  # Launching process
```
Suppose my input is : *‘Authentication via email and social networks, push notifications for special offers, interactive map to find nearby shops.’, ’Task management with reminders, sharing tasks with other users, and the ability to add sub\-tasks. tasks with other users, and the ability to add sub\-tasks.’ and ’Calorie tracking, recipe suggestions based on ingredients, and a loyalty points system.’*

**Result :**

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Q2Jn3s1iu84SNBmtw7gdlQ.png)

Let’s display *technical\_documentation.txt* as example :

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*9kpAxfHOghEi3LRNafBiNA.png)


## Build an Agentic RAG using Crew AI \& Tavily (with LLM Meta AI)

In this section, we explore the world of RAG agents using Crew AI and Tavily. We will show how to improve AI capabilities by integrating search mechanisms with generative models to design autonomous and intelligent agents.

***Requirements* :**

You need to install the following libraries (if you haven’t already done so) :

* crewai \& crewai\_tools
* langchain \& langchain\-groq
* sentence\-transformers

Get Groq and Tavily API’s key .


```python
from langchain_openai import ChatOpenAI
import os
from crewai_tools import PDFSearchTool  # import PDF file
from langchain_community.tools.tavily_search import TavilySearchResults
from crewai_tools  import tool
from crewai import Crew
from crewai import Task
from crewai import Agent
from google.colab import userdata

os.environ['GROQ_API_KEY'] = userdata.get('GROQ_API_KEY')
os.environ['TAVILY_API_KEY'] = userdata.get('TAVILY_API_KEY')

llm = ChatOpenAI(
    openai_api_base="https://api.groq.com/openai/v1",
    openai_api_key=os.environ['GROQ_API_KEY'],
    model_name="llama3-8b-8192",
    temperature=0.1,
    max_tokens=1000,
)

rag = PDFSearchTool(pdf='doc.pdf',
    config=dict(
        llm=dict(
            provider="groq", # or google, openai, anthropic, llama2, ...
            config=dict(
                model="llama3-8b-8192",
                # temperature=0.5,
                # top_p=1,
                # stream=true,
            ),
        ),
        embedder=dict(
            provider="huggingface", # or openai, ollama, ...
            config=dict(
                model="BAAI/bge-small-en-v1.5",
                #task_type="retrieval_document",
                # title="Embeddings",
            ),
        ),
    )
)

#We search the content of the PDF file by reading the relevant content using the rag model

rag.run("What does Sporo Health do?") # According to the PDF

```
Now, let’s find out some results on web about question above


```python
web_search = TavilySearchResults(k=3) # Search at least 3 links
web_search.run("What does Sporo Health do?")
```
We’re going to create a routing function that analyses a question (received as a parameter) and decides which tool or method to use to answer it.


```python
@tool
def router_tool(question):
  """Router Function"""
  if 'Sporo Health' in question:
    return 'vectorstore'
  else:
    return 'web_search'
```
We’re going to create 2 agents, one of which, called *Router\_Agent*, aims to direct users’ questions either to a vector search for topics related to augmented search generation (ASG), or to a web search for other questions, while being flexible with keywords and the other *Gradent\_Agent* , aims to assess the relevance of the documents retrieved in relation to a user question, based on the presence of keywords related to the question, while ensuring that the answers provided are relevant.

Now, let’s create two tasks :

* *router\_task* : analyses the keywords in a question and returns either ‘vectorstore’ or ‘websearch’, without any explanation, via the Router\_Agent agent and the router\_tool tool.
* *retriever\_task* : uses the router\_task response to extract information based on the appropriate tool: web\_search\_tool for ‘websearch’ output and rag\_tool for ‘vectorstore’ output. The Retriever\_Agent must then provide a clear and concise response.


```python
router_task = Task(
    description=("Analyse the keywords in the question {question}"
    "Based on the keywords decide whether it is eligible for a vectorstore search or a web search."
    "Return a single word 'vectorstore' if it is eligible for vectorstore search."
    "Return a single word 'websearch' if it is eligible for web search."
    "Do not provide any other premable or explaination."
    ),
    expected_output=("Give a binary choice 'websearch' or 'vectorstore' based on the question"
    "Do not provide any other premable or explaination."),
    agent=Router_Agent,
    tools=[router_tool],
)

retriever_task = Task(
    description=("Based on the response from the router task extract information for the question {question} with the help of the respective tool."
    "Use the web_serach_tool to retrieve information from the web in case the router task output is 'websearch'."
    "Use the rag_tool to retrieve information from the vectorstore in case the router task output is 'vectorstore'."
    ),
    expected_output=("You should analyse the output of the 'router_task'"
    "If the response is 'websearch' then use the web_search_tool to retrieve information from the web."
    "If the response is 'vectorstore' then use the rag_tool to retrieve information from the vectorstore."
    "Return a claer and consise text as response."),
    agent=Retriever_Agent,
    context=[router_task],
)
```
Great ! it remains the crew :


```python
crew = Crew(
    agents=[Router_Agent, Retriever_Agent, Grader_agent, hallucination_grader, answer_grader],
    tasks=[router_task, retriever_task, grader_task, hallucination_task, answer_task],
    verbose=True,

)

print(result = rag_crew.kickoff(inputs={"question":"Does Sporo Streamline patient chart reviews?"})
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*v5BlzKM-HFowvifRxLBmtQ.png)

***Output :*** Yes, Sporo Streamline patient chart reviews.


## Conclusion

CrewAI has a distinct edge with its extendable features enabled by LangChain, which include integration with various tools and support for open\-source large language models. Its ability to manage sequential orchestration could significantly enhance the development of multi\-agent applications.


## References :

* <https://github.com/crewAIInc/crewAI>
* [https://github.com/AIAnytime/Agentic\-RAG\-using\-Crew\-AI](https://github.com/AIAnytime/Agentic-RAG-using-Crew-AI)
* <https://github.com/crewAIInc/crewAI/tree/main/tests>

