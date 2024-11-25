---
title: "Building a multi agent system using CrewAI"
meta_title: "Building a multi agent system using CrewAI"
description: "CrewAI is an open-source Python framework designed for developing multi-agent AI systems that facilitate collaboration among AI agents. It allows for the organization of specialized roles, task delegation, and structured workflows, enhancing the efficiency of complex problem-solving. The framework is exemplified through practical applications, such as building a web search tool and a recommendation system for educational courses, showcasing how agents can analyze data, make decisions, and communicate effectively to achieve specific goals."
date: 2024-11-25T15:00:22Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*FTlXqcTu5LWnFSLcmp39_w.png"
categories: ["Programming", "Machine Learning", "Data Science"]
author: "Rifx.Online"
tags: ["multi-agent", "collaboration", "Python", "framework", "specialization"]
draft: False

---






AI agents are transforming industries by independently analyzing data, making predictions, and recommending optimal actions. These intelligent programs are not only skilled at executing tasks on their own but also excel at collaborating with other agents, making them valuable assets in fields like sales, marketing, and education.

For instance, in marketing, AI agents can assess customer preferences, identify individual interests, and craft personalized campaigns that foster customer engagement and satisfaction. In education, these agents can be similarly leveraged to personalize learning paths, enhancing the educational experience by aligning courses with students’ unique needs and goals.

CrewAI is an open\-source framework that empowers developers to organize collaborative AI agent teams for complex tasks. It provides a Python library for configuring specialized agents with defined roles, assigning tasks, and managing collaboration through structured workflows. CrewAI excels in role\-based agent design, flexible task delegation, and teamwork, making it ideal for building advanced multi\-agent systems.

This article, we will explore the CrewAI framework, explaining how it enables collaborative multi\-agent systems through specialized roles and structured workflows. Following that, building web search tool and a recommendation systems using CrewAI.


## Getting Started


### Table of contents

* What is CrewAI
* Components of CrewAI
* Experimenting with CrewAI
* Installing the dependencies
* Setting up the environment
* 1\. Building a web search tool
* Importing dependencies
* Scraping a website
* Writing extracted text to a file
* Setting up the text search tool
* Creating an agent for the task
* 2\. Recommendation Campaign Generation
* Importing the dependencies
* Defining the LLM model
* Preparing the dataset
* Creating the agents
* Defining tasks for the agents
* Executing the Crew
* Running the app
* Resources


### What is CrewAI

CrewAI is an open\-source Python framework designed to develop and manage multi\-agent AI systems, enabling users to build collaborative teams of AI agents. Like human teams, these agents can communicate, coordinate, and work together to achieve specific objectives. CrewAI enhances these systems by assigning specialized roles to agents, supporting autonomous decision\-making, and facilitating inter\-agent communication, allowing them to tackle complex problems more efficiently than single agents could.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*rYQnVksjIFimsGIbf8DuNQ.png)


### Components of CrewAI

* **Agents:** Agents are autonomous units within a system, designed to perform specific tasks, make decisions, and interact dynamically with other agents. They independently analyze their environment, respond to inputs, and use various tools, ranging from simple search functions to integrations with APIs or blockchain networks.
* **Tasks:** Tasks are the specific duties assigned to agents, varying from data analysis to controlling external systems. Each task may be broken down into subtasks, which may require specialized tools or resources. Task management involves detailing which agent is responsible, what tools are needed, and the processes involved, ensuring efficient workflows and accurate results in an agent\-based system.
* **Crew:** A crew is a coordinated group of agents organized to achieve a common goal. Crew formation involves selecting agents based on their roles and skills, assigning tasks, and managing dependencies to ensure that tasks are executed in the correct order. This organized collaboration allows a crew to tackle complex challenges, leveraging each agent’s strengths for enhanced performance and synchronized execution.
* **Tools:** Tools refer to the skills or functions that agents can use to carry out various actions. This includes resources from the CrewAI Toolkit and LangChain Tools, facilitating everything from basic searches to intricate interactions while promoting effective teamwork among agents.
* **Process:** Processes are responsible for orchestrating how tasks are executed by agents, similar to project management in human teams. These processes ensure that tasks are allocated and completed efficiently, in accordance with a predefined strategy.


## Experimenting with CrewAI

In this section, we will take an in\-depth look at CrewAI. The focus will be on experimenting with its components and developing two solutions (a web search tool and a recommendation system) by utilizing the framework.


### Installing the dependencies

* Create and activate a virtual environment by executing the following command.


```python
python -m venv venv
source venv/bin/activate #for ubuntu
venv/Scripts/activate #for windows
```
* Install `crewai-tools`, `crewai`, `langchain_openai` and `python-dotenv` libraries using pip.


```python
pip install crewai-tools crewai langchain_openai python-dotenv
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*pITkLAdGyNXsBO_R1PIiOQ.png)


### Setting up the environment

* Begin by creating a new folder for your project. Choose a name that reflects the purpose of your project.
* Create a file named `.env`. This file will store your environment variables, including the OpenAI key.
* Open the `.env` file and add the following code to specify your OpenAI API key:


```python
OPENAI_API_KEY=sk-proj-7XyPjkdaG_gDl0_...
```

## 1\. Building a web search tool

In this example, We will be creating a web search tool using CrewAI. Three crewai tools will be used: `ScrapeWebsiteTool` to scrape content from a website, `FileWriterTool` to save the content to a file, and `TXTSearchTool` to search the content for RAG.


### Importing dependencies

* Create a file named `app.py`
* Import the dependencies and setting up the environment variables to the project by adding the following code to it.


```python
from crewai_tools import ScrapeWebsiteTool, FileWriterTool, TXTSearchTool
from crewai import Agent, Task, Crew
import os
from dotenv import load_dotenv

## Load environment variables from the .env file
load_dotenv()
os.environ['OPENAI_API_KEY'] = os.getenv('OPENAI_API_KEY')
```

### Scraping a website

Initialize the `ScrapeWebsiteTool`, a tool used to extract content from websites. Here, it’s configured to scrape content from Wikipedia's "Artificial Intelligence" page.


```python
## Initialize the tool, potentially passing the session
tool = ScrapeWebsiteTool(website_url='https://en.wikipedia.org/wiki/Artificial_intelligence')  

## Extract the text
text = tool.run()
print(text)
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*nwJKTIiS4up9FwKw0RmgjA.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*_cnZmnePASavCYro0IV5lw.png)


### Writing extracted text to a file

Use the `FileWriterTool` to save the extracted content into a file named `ai.txt`.


```python
## Initialize the tool
file_writer_tool = FileWriterTool()
text = text.encode("ascii", "ignore").decode()
## Write content to a file in a specified directory
result = file_writer_tool._run(filename='ai.txt', content = text, overwrite="True")
print(result)
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*6GBEi_1mJoLRByjx_e2nOA.png)


### Setting up the text search tool

Set up the `TXTSearchTool` to search the contents of the `ai.txt` file.


```python
## Initialize the tool with a specific text file, so the agent can search within the given text file's content
tool = TXTSearchTool(txt='ai.txt')
```

### Creating an agent for the task

A data analyst agent is created with the role of an educator. The agent’s task is to answer the question, “What is Natural Language Processing?” based on the text retrieved from the file search.


```python
context = tool.run('What is natural language processing?')

data_analyst = Agent(
    role='Educator',
    goal=f'Based on the context provided, answer the question - What is Natural Language Processing? Context - {context}',
    backstory='You are a data expert',
    verbose=True,
    allow_delegation=False,
    tools=[tool]
)

test_task = Task(
    description="Understand the topic and give the correct response",
    tools=[tool],
    agent=data_analyst,
    expected_output='Give a correct response'
)

crew = Crew(
    agents=[data_analyst],
    tasks=[test_task]
)

output = crew.kickoff()
print(output)
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*lKar4EQT-KJBNe_FChpgRg.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*KF8XthHk_3pMn-Xx9TYkog.png)


## 2\. Recommendation Campaign Generation

Imagine running an education counseling company that aims to suggest the best courses for students based on their degrees, academic goals, hobbies, and computer skills. The challenge lies in deciding which courses to recommend to each student.

In this example, a recommendation system will be created using CrewAI to suggest the courses that are best suited for students.


### Importing dependencies

* Create a file named `app.py`
* Import the dependencies and setting up the environment variables to the project by adding the following code to it.


```python
from crewai import Agent, Task, Crew, Process
from textwrap import dedent
import pandas as pd

import os
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
load_dotenv()
os.environ['OPENAI_API_KEY'] = os.getenv('OPENAI_API_KEY')
```

### Defining the LLM model

Next, the LLM model to be used is defined along with the corresponding API key. Any LLM model of choice can be used; in this instance, `gpt-3.5-turbo-16k` has been used.


```python
llm = ChatOpenAI(
    model="gpt-3.5-turbo-16k",
    temperature=0.1,
    max_tokens=8000
)
```

### Preparing the dataset

Create a csv file which contains the student profile along with a list of courses to be recommended to the students.


```python
csv = '''Academic Goals, Major, Hobbies, Computer Skills, Interest in Languages, GPA
To become a software engineer, Computer Science, Gaming, Advanced, Spanish, 3.7
To study environmental science, Environmental Science, Hiking, Intermediate, French, 3.5
To pursue a career in medicine, Pre-Med, Playing the piano, Advanced, Spanish, 3.9
To major in psychology, Psychology, Reading, Intermediate, German, 3.6
To work in international relations, Political Science, Traveling, Basic, Mandarin, 3.8
To become a teacher, Education, Painting, Advanced, Spanish, 3.4
To study literature, English Literature, Writing, Intermediate, French, 3.9
To pursue a career in business, Business Administration, Playing soccer, Basic, Mandarin, 3.5
To become a biologist, Biology, Photography, Advanced, German, 3.7
To work in data analysis, Statistics, Cooking, Intermediate, Japanese, 3.6
'''

from io import StringIO
csvStringIO = StringIO(csv)
df_customers = pd.read_csv(csvStringIO, sep=",")

courses = '''
"Introduction to Computer Science" - Offered by Harvard University on edX
"Biology: Life on Earth" - Offered by Coursera
"Introduction to Psychology" - Offered by Yale University on Coursera
"Environmental Science" - Offered by University of Leeds on FutureLearn
"Introduction to Literature" - Offered by MIT on edX
"Medical Terminology" - Offered by University of Pittsburgh on Coursera
"Data Science and Machine Learning" - Offered by Stanford University on Coursera
"Cell Biology" - Offered by Massachusetts Institute of Technology on edX
"Positive Psychology" - Offered by University of North Carolina at Chapel Hill on Coursera
"Environmental Law and Policy" - Offered by Vermont Law School on Coursera
"Programming for Everybody (Getting Started with Python)" - Offered by University of Michigan on Coursera
"Anatomy: Human Neuroanatomy" - Offered by University of Michigan on Coursera
"Introduction to Cognitive Psychology" - Offered by Duke University on Coursera
"Climate Change and Health: From Science to Action" - Offered by Harvard University on edX
"English for Science, Technology, Engineering, and Mathematics" - Offered by University of Pennsylvania on Coursera
"An Introduction to American Law" - Offered by University of Pennsylvania on Coursera
"Introduction to Chemistry: Reactions and Ratios" - Offered by Duke University on Coursera
"Epidemiology: The Basic Science of Public Health" - Offered by University of North Carolina at Chapel Hill on Coursera
"Computer Science: Programming with a Purpose" - Offered by Princeton University on Coursera
"Introduction to Statistics and Data Analysis" - Offered by Rice University on Coursera
"Genes and the Human Condition (From Behavior to Biotechnology)" - Offered by University of Maryland on Coursera
"Ethics, Technology, and the Future of Medicine" - Offered by Georgetown University on edX
"Fundamentals of Immunology" - Offered by Harvard University
'''
```

### Creating the agents

Define the various AI agents for the first crew, each AI agent requires a role, a goal, and a backstory. The second crew will be used to generate a recommendation text for the courses suggested to a student.


```python
## First crew agents
student_profiler = Agent(
  role='student_profiler',
  goal='''From limited data, you logically deduct conclusions about students.''',
  backstory='You are an expert psychologist with decades of experience.',
  llm = llm,allow_delegation=False,verbose=True)

course_specialist = Agent(
     role='course specialist',
     goal='''Match the suitable course to the students''',
     backstory='You have exceptional knowledge of the courses and can say how valuable they are to a student.',
     llm = llm,allow_delegation=False,verbose=True)

Chief_Recommendation_Director = Agent(
     role="Chief Recomeendation Director",
     goal=dedent("""\Oversee the work done by your team to make sure it's the best
  possible and aligned with the course's goals, review, approve,
  ask clarifying question or delegate follow up work if necessary to make
  decisions"""),
     backstory=dedent("""\You're the Chief Promotion Officer of a large EDtech company. You're launching a personalized ad campaign,
          trying to make sure your team is crafting the best possible
   content for the customer."""),
     llm = llm,tools=[],allow_delegation=False, verbose=True)

## Second crew agents
campaign_agent = Agent(
     role="campaign_agent",
     goal=dedent("""\Develop compelling and innovative content
  for ad campaigns, with a focus customer specific ad copies."""),
     backstory=dedent("""\As a Creative Content Creator at a top-tier
   digital marketing agency, you excel in crafting advertisements
   that resonate with potential customers.
   Your expertise lies in turning marketing strategies
   into engaging stories that capture
   attention and inspire buying action."""),
     llm = llm,allow_delegation=False, verbose=True)
```

### Defining tasks for the agents

Let’s define the tasks that each agent will perform.


```python
## Tasks
def get_ad_campaign_task(agent, customer_description, courses):
  return Task(description=dedent(f"""\
    You're creating a targeted marketing campaign tailored to what we know about our student customers.

    For each student customer, we have to choose exactly three courses to promote in the next campaign.
    Make sure the selection is the best possible and aligned with the student customer,
   review, approve, ask clarifying question or delegate follow up work if
  necessary to make decisions. When delegating work send the full draft
  as part of the information.
    This is the list of all the courses participating in the campaign: {courses}.
    This is all we know so far from the student customer: {customer_description}.

    To start this campaign we will need to build first an understanding of our student customer.
    Once we have a profile about the student customers interests, lifestyle and means and needs,
    we have to select exactly three courses that have the highest chance to be bought by them.

    Your final answer MUST be exactly 3 courses from the list, each with a short description
    why it matches with this student customer. It must be formatted like this example:
     :
     :
     :
    """),
    agent=agent,expected_output='A refined finalized version of the marketing campaign in markdown format'
  )

def get_ad_campaign_written_task(agent, selection):
    return Task(description=dedent(f"""\
    You're creating a targeted marketing campaign tailored to what we know about our student customer.

    For each student customer, we have chosen three courses to promote in the next campaign.
    This selection is tailored specifically to the customer: {selection},

    To end this campaign succesfully we will need a promotional message advertising these courses  to the student customer with the ultimate intent that they buy from us.
    This message should be around 3 paragraphs, so that it can be easily integrated into the full letter. For example:
    Interested in learning data science, get yourself enrolled in this course from Harvard University.
    Take Your career to the next level with the help of this course.

    You need to review, approve, and delegate follow up work if necessary to have the complete promotional message. When delegating work send the full draft
  as part of the information.

    Your final answer MUST include the 3 courses from the list, each with a short promotional message.
    """),
    agent=agent,expected_output='A refined finalized version of the marketing campaign in markdown format'
  )
```

### Executing the Crew

Let’s execute the entire process for each row of the student profile dataset.


```python
df_output_list = [] 

for index, row in df_customers.iterrows():
  print('############################################## '+ str(index))
  customer_description = f'''
  Their academic goals are {row['Academic Goals']}.
  Their major is in {row[' Major']}.
  Their Hobbies are {row[' Hobbies']}.
  Their computer skills are {row[' Computer Skills']}.
  Their interest in languages are {row[' Interest in Languages']}.
  Their GPA is {row[' GPA']}.
  '''
  print(customer_description)
  
  # Define Task 1 for selecting top 3 relevant courses
  task1 = get_ad_campaign_task(Chief_Recommendation_Director ,customer_description, courses)
  # start crew
  targetting_crew = Crew(
    agents=[student_profiler, course_specialist ,Chief_Recommendation_Director ],
    tasks=[task1],
    verbose=True, 
  process=Process.sequential # Sequential process will have tasks executed one after the other and the outcome of the previous one is passed as extra content into this next.
  )
  targetting_result = targetting_crew.kickoff()
  
  # Define Task 2 for Generating Recommendation Campaign
  task2 = get_ad_campaign_written_task(Chief_Recommendation_Director ,targetting_result)
  copywriting_crew = Crew(
    agents=[campaign_agent,Chief_Recommendation_Director ],
    tasks=[task2],
    verbose=True, 
  process=Process.sequential # Sequential process will have tasks executed one after the other and the outcome of the previous one is passed as extra content into this next.
  )
  copywriting_result = copywriting_crew.kickoff()

  # Create one line in output df
  df_output_list.append({'customer':customer_description,
                         'targeted_courses':targetting_result,
                         'promo_msg':copywriting_result,
                        })

## Collect results in dataframe
df_output = pd.DataFrame(df_output_list)
print(df_output)
```

### Running the app

Lets run the app using the following code.


```python
python app.py
```
The output in the pandas data frame appears as follows.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*2JJJM-1J4Qf0pMeAUc0d0g.png)

Let’s take a closer look at one student profile and the generated campaign using Crew AI in detail.

Consider the following student’s profile:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*LAFkqj5T3OF2FmXr108A0g.png)

The course specialist agent has selected the following courses based on the student’s profile.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*QrIlvKnrES6bkkRvtlhGkw.png)

The second crew produced the following recommendation messages.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ETJ0pjt2arYYqMFlU6xQ9w.png)

If you’re looking to create AI agents and assistants without any coding, **Runbear** makes it super easy by offering a no\-code platform that integrates seamlessly with Slack, MS Teams, HubSpot, and Zendesk, allowing you to set up custom AI assistants for your workspace in just minutes.

*Thanks for reading this article !!*

*Thanks Gowri M Bhatt for reviewing the content.*

If you enjoyed this article, please click on the clap button 👏 and share to help others find it!

The full source code for this tutorial can be found here,


### Resources

* [Introduction — CrewAI](https://docs.crewai.com/introduction)
* [alejandro\-ao/crewai\-crash\-course: Tutorial: Introduction to CrewAI](https://github.com/alejandro-ao/crewai-crash-course)
* [Multi Agent Systems and how to build them](https://learn.crewai.com/)
* [crewAIInc/crewAI: Framework for orchestrating role\-playing, autonomous AI agents. By fostering collaborative intelligence, CrewAI empowers agents to work together seamlessly, tackling complex tasks.](https://github.com/crewAIInc/crewAI)

