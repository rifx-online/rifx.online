---
title: "Mastering CrewAI: Chapter 4 — Processes | by Okan Yenigün | Jan, 2025 | Medium"
meta_title: "Mastering CrewAI: Chapter 4 — Processes | by Okan Yenigün | Jan, 2025 | Medium"
description: "Chapter 4 of Mastering CrewAI discusses the importance of processes in managing AI agent collaboration. It outlines three main types of processes: Sequential, Hierarchical, and a planned but unimplemented Consensual process. The Sequential Process executes tasks in a specific order, ideal for dependency-driven workflows. The Hierarchical Process introduces a manager agent to oversee task delegation and resolution, enhancing efficiency in handling customer support issues. Practical code examples illustrate the implementation of these processes in CrewAI, showcasing their functionality in automating workflows and problem resolution."
date: 2025-01-05T02:41:47Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*po_r5Q9WdvrKvOJdLJkWmw.jpeg"
categories: ["Programming", "Technology", "Machine Learning"]
author: "Rifx.Online"
tags: ["Sequential", "Hierarchical", "Consensual", "Processes", "Collaboration"]
draft: False

---





### Sequential \& Hierarchical Processes



In CrewAI, the concept of **processes** is integral to managing how AI agents collaborate and execute tasks.

Previous Chapter:

A **process** defines the workflow strategy that coordinates how agents execute tasks to achieve a common objective.

There are three main process types:

* Sequential Process
* Hierarchical Process
* Consensual Process (Planned, not implemented yet)

First, let’s create a new project to work on processes *(openai \>\> gpt\-4o\-mini).*


```python
crewai create crew process_example
```

### Sequential Process

Tasks are executed one after the other in a predetermined order. Each task begins only after the previous one has been completed.

It is ideal for projects where tasks have dependencies and must be completed in a specific sequence.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*rZl_c0kr6Fu0zwc6j0fEbw.png)

This example demonstrates how a sequential process in CrewAI can automate a multi\-step workflow, ensuring each task is executed in the correct order with appropriate context.


```python
## main.py
import sys
import warnings

from crew import SequentialProcessExample

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")


def run():
    """
    Run the crew.
    """
    inputs = {
        'topic': "Artificial Intelligence"
    }
    SequentialProcessExample().crew().kickoff(inputs=inputs)

run()
```

```python
## crew.py

from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai_tools import SerperDevTool, ScrapeWebsiteTool, FileWriterTool
from dotenv import load_dotenv

load_dotenv()


@CrewBase
class SequentialProcessExample:
 """ProcessExample crew"""

 agents_config = 'config/agents.yaml'
 tasks_config = 'config/tasks.yaml'

 @agent
 def searcher(self) -> Agent:
  return Agent(config=self.agents_config['searcher'], verbose=True, tools=[SerperDevTool()])
 
 @agent
 def scraper(self) -> Agent:
  return Agent(config=self.agents_config['scraper'], verbose=True, tools=[ScrapeWebsiteTool()])
 
 @agent
 def copywriter(self) -> Agent:
  return Agent(config=self.agents_config['copywriter'], verbose=True)
 
 @agent
 def file_writer(self) -> Agent:
  return Agent(config=self.agents_config['file_writer'], verbose=True, tools=[FileWriterTool()])
 
 @task
 def search_task(self) -> Task:
  return Task(config=self.tasks_config['search_task'], verbose=True)
 
 @task
 def scrape_task(self) -> Task:
  return Task(config=self.tasks_config['scrape_task'], verbose=True)
 
 @task
 def content_write_task(self) -> Task:
  return Task(config=self.tasks_config['content_write_task'], verbose=True)
 
 @task
 def file_write_task(self) -> Task:
  return Task(config=self.tasks_config['file_write_task'], verbose=True)

 @crew
 def crew(self) -> Crew:
  return Crew(
   agents=self.agents, 
   tasks=self.tasks,
   process=Process.sequential,
   verbose=True,
  )
```

```python
## agents.yaml
searcher:
  role: >
    {topic} Content Searcher
  goal: >
    Uncover cutting-edge developments in {topic}
  backstory: >
    You're a seasoned researcher with a knack for uncovering the latest
    developments in {topic}. Known for your ability to find the most relevant
    information and present it in a clear and concise manner.

scraper:
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

```python
## tasks.yaml

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
  agent: scraper

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
    Article written in a article.txt file
  agent: file_writer
```

```python
python process_example/src/process_example/main.py
```
It creates `article.txt` file.


```python
**The Dawn of Artificial Intelligence: Transformations in Our Modern World**

Artificial Intelligence (AI) is no longer the stuff of science fiction. It stands at the forefront of a technological revolution, reshaping sectors from healthcare to robotics and beyond. As we delve into recent advancements, it becomes evident how AI is intertwined with our daily lives, fueling innovation and promising a future filled with possibilities.

One of the most fascinating developments includes breakthroughs in emotional recognition. Recent technology enables androids to portray lifelike facial expressions, crossing the "uncanny valley." This newfound ability to convey emotional consistency holds the potential to transform human-robot interaction, making it more relatable and intuitive.

Meanwhile, researchers are exploring the combination of machine psychology and neural networks to inch closer to achieving general AI—an intelligence model that encapsulates human-like reasoning and understanding. Such advancements evoke profound questions about our relationship with machines.

In healthcare, AI's role is groundbreaking. From reinforcement learning guiding personalized treatment strategies to generative AI significantly improving lung cancer diagnoses, the potential for enhanced patient outcomes is immense. Moreover, AI can now monitor babies in NICUs, detecting neurologic changes through video data alone, offering critical support in intensive care environments.

In robotics, swarms of 'ant-like' robots are showcasing remarkable collaborative abilities, lifting heavy objects and navigating obstacles together. This mirrors the efficiency of natural systems and opens doors for innovative construction and logistics solutions.

Moreover, AI-driven tools are streamlining chemical synthesis, showcasing how mobile robots enhance productivity in laboratories. Not to mention, the advent of a robot that learns to clean a washbasin through observation, proves that the learning capabilities of machines are advancing rapidly.

From real-time interpretation of American Sign Language to laser-based artificial neurons mimicking biological functions, the spectrum of AI applications is expanding and transforming our world. As we continue to explore these trends, one thing remains clear: the journey of AI is just beginning, and its impact will define the future of technology and human interaction for generations to come.
```
This example involves the following steps:

1. **Web Search**: Conduct a web search on a given topic.
2. **Content Extraction**: Scrape relevant content from the search results.
3. **Content Summarization**: Summarize the extracted content into a cohesive article.
4. **File Writing**: Save the summarized content into a txt file.

In this setup, each task is executed in order. The `search_task` runs first, and its output (a list of URLs) becomes the input for the `scrape_task`. This chaining continues through the `content_write_task` and concludes with the `file_write_task`.

Each task depends on the output of the previous one, ensuring a logical flow of information. For instance, the content writer cannot summarize information until the scraper has extracted it.

By setting `process=Process.sequential`, we define the execution order explicitly, ensuring that tasks proceed in the specified sequence.


### Hierarchical Process

In CrewAI, a **hierarchical process** emulates a corporate hierarchy by introducing a manager agent responsible for planning, delegating tasks, and validating outcomes. This approach enhances efficiency and accuracy in task execution.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*kUf9VzTKVIhBhlpPWZwgqw.png)

The new problem involves handling customer tickets, such as complaints or issues. In this example, the customer has trouble logging into their account and receives an “Invalid credentials” error message.

Our system:

1. Categorizes the ticket as either a **technical issue** or a **billing issue**.
2. Assigns the ticket to the appropriate support agent.
3. Resolves the issue and provides solutions.
4. Reviews the solutions to ensure quality.


```python
## crew.py

from crewai import Agent, Crew, Process, Task
from dotenv import load_dotenv

load_dotenv()

## Define the manager agent
manager = Agent(
    role="Customer Support Manager",
    goal="Oversee the support team to ensure timely and effective resolution of customer inquiries",
    backstory=(
        "You are a seasoned customer support manager with extensive experience in leading support teams. "
        "Your primary responsibility is to coordinate the efforts of support agents, ensuring that customer issues "
        "are addressed promptly and satisfactorily. You excel in task delegation, performance monitoring, and "
        "maintaining high standards of customer service."
    ),
    allow_delegation=True,
    verbose=True,
)

## Define the technical support agent
technical_support_agent = Agent(
    role="Technical Support Specialist",
    goal="Resolve technical issues reported by customers promptly and effectively",
    backstory=(
        "You are a highly skilled technical support specialist with a strong background in troubleshooting software and hardware issues. "
        "Your primary responsibility is to assist customers in resolving technical problems, ensuring their satisfaction and the smooth operation of their products."
    ),
    allow_delegation=False,
    verbose=True,
)

## Define the billing support agent
billing_support_agent = Agent(
    role="Billing Support Specialist",
    goal="Address customer inquiries related to billing, payments, and account management",
    backstory=(
        "You are an experienced billing support specialist with expertise in handling customer billing inquiries. "
        "Your main objective is to provide clear and accurate information regarding billing processes, resolve payment issues, and assist with account management to ensure customer satisfaction."
    ),
    allow_delegation=False,
    verbose=True,
)

## Define tasks
categorize_tickets = Task(
    description="Categorize the incoming customer support ticket: '{ticket} based on its content to determine if it is technical or billing-related.",
    expected_output="A categorized ticket labeled as 'Technical' or 'Billing'.",
    agent=manager,
)

resolve_technical_issues = Task(
    description="Resolve technical issues described in the ticket: '{ticket}'",
    expected_output="Detailed solutions provided to each technical issue.",
    agent=technical_support_agent,
)

resolve_billing_issues = Task(
    description="Resolve billing issues described in the ticket: '{ticket}'",
    expected_output="Comprehensive responses to each billing-related inquiry.",
    agent=billing_support_agent,
)

quality_assurance_review = Task(
    description="Review the resolutions provided for both technical and billing issues to ensure accuracy and customer satisfaction.",
    expected_output="A report confirming the quality and accuracy of the resolutions.",
    agent=manager,
)

## Instantiate your crew with a custom manager and hierarchical process
crew_q = Crew(
    agents=[technical_support_agent, billing_support_agent],
    tasks=[categorize_tickets, resolve_technical_issues, resolve_billing_issues, quality_assurance_review],
    manager_agent=manager,
    process=Process.hierarchical,
    verbose=True,
)
```
**Agents**:

* **Manager Agent**: Oversees the entire process, categorizes tickets, and reviews the solutions.
* **Technical Support Agent**: Handles technical issues like login problems.
* **Billing Support Agent**: Resolves billing\-related inquiries.

**Tasks**:

* **Categorize Tickets**: Determine if the issue is technical or billing\-related.
* **Resolve Technical Issues**: Provide solutions to technical problems.
* **Resolve Billing Issues**: Handle inquiries related to payments and accounts.
* **Quality Assurance Review**: Review the provided solutions for accuracy and quality.


```python
## main.py
import sys
import warnings

from crew import crew_q

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

def run():
    """
    Run the crew.
    """
    inputs = {
       "ticket": "I tried logging into my account today, but I keep receiving an 'Invalid credentials' error message. "
    }
    result = crew_q.kickoff(inputs=inputs)

run()
```
The program runs by feeding the customer’s ticket into the system. Tasks are executed sequentially by the relevant agents. Each agent provides an answer or takes an action to complete their task.

Inpus is a customer ticket: “I tried logging into my account today, but I keep receiving an ‘Invalid credentials’ error message.”


```python
## Agent: Customer Support Manager
### Task: Categorize the incoming customer support ticket: 'I tried logging into my account today, but I keep receiving an 'Invalid credentials' error message.  based on its content to determine if it is technical or billing-related.


## Agent: Customer Support Manager
### Final Answer: 
Technical


## Agent: Customer Support Manager
### Task: Resolve technical issues described in the ticket: 'I tried logging into my account today, but I keep receiving an 'Invalid credentials' error message. '
## Agent: Technical Support Specialist
### Task: What are the potential causes and steps to resolve an 'Invalid credentials' error message when a customer tries to log into their account?


## Agent: Technical Support Specialist
### Final Answer: 
There are several potential causes for an 'Invalid credentials' error message when a customer attempts to log into their account. Here are common causes and steps to resolve this issue:

1. **Incorrect Username or Password**: 
   - **Resolution**: Confirm that the customer is entering the correct username and password. Suggest them to check for any spelling mistakes, and ensure that the Caps Lock is turned off since credentials are often case-sensitive.

2. **Account Lockout**: 
   - **Resolution**: Many systems lock accounts after several failed login attempts. Ask the customer if they've tried logging in multiple times unsuccessfully. If so, waiting for a certain amount of time or contacting support for account unlocking might be necessary.

3. **Expired Password**: 
   - **Resolution**: Check if the customer's password has expired. Guide them through the process of resetting their password if needed.

4. **Account Inactivity**:
   - **Resolution**: Accounts that haven't been used for an extended period might be deactivated. Advise the customer to contact support to reactivate their account.

5. **Incorrect Domain or User ID**:
   - **Resolution**: Some accounts require inclusion of a domain or proper user ID format. Verify with the customer if they are incorporating the correct domain or format as needed.

6. **Browser Issues**:
   - **Resolution**: Suggest clearing the browser's cache and cookies, or trying to log in through a different browser or incognito window.

7. **Server or Network Issues**:
   - **Resolution**: Confirm if there are any known outages or server issues that could be impacting login services. Advise the customer to try later if there are temporary network disruptions.

8. **Multi-Factor Authentication (MFA) Problems**:
   - **Resolution**: If MFA is enabled, ensure the customer is completing the additional authentication steps. Help reset the MFA if they're encountering issues.

9. **System or Security Changes**:
   - **Resolution**: Recent updates or changes in system security could botch login attempts. Advise the customer to ensure their device is updated with the latest software and security patches.

Encourage the customer to carefully retrace their login steps and, if all else fails, consult the support team for further investigation. It may be essential to reassure them of processing a ticket to get a thorough system check if the problem persists.
```
The **Manager Agent** categorizes the ticket as a “Technical” issue. The **Technical Support Agent** provides detailed troubleshooting steps for the issue, like checking for incorrect credentials or resolving account lockout.


### Read More


### Sources

<https://docs.crewai.com/concepts/processes>

[https://docs.crewai.com/how\-to/sequential\-process](https://docs.crewai.com/how-to/sequential-process)

[https://docs.crewai.com/how\-to/hierarchical\-process](https://docs.crewai.com/how-to/hierarchical-process)

[https://www.ionio.ai/blog/how\-to\-build\-llm\-agent\-to\-automate\-your\-code\-review\-workflow\-using\-crewai](https://www.ionio.ai/blog/how-to-build-llm-agent-to-automate-your-code-review-workflow-using-crewai)


