---
title: "Mastering AI Agents: A Hands-On Guide to CrewAI and Google Search API"
meta_title: "Mastering AI Agents: A Hands-On Guide to CrewAI and Google Search API"
description: "The article provides a practical overview of using CrewAI and the Google Search API to create AI agents for research and content generation. It explains how to set up these agents, define their roles and tasks, and coordinate their efforts to streamline processes such as research and writing. The author shares their hands-on experience, illustrating the ease of automation and the potential for increased productivity in various industries. The integration of the agentic and generative phases highlights the importance of both planning and execution in achieving effective outcomes."
date: 2024-11-30T14:17:21Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*eH_-lXmJZNYnvRKBgjfGRg.png"
categories: ["Programming", "Generative AI", "Chatbots"]
author: "Rifx.Online"
tags: ["CrewAI", "Google", "Search", "API", "agents"]
draft: False

---






You know how everyone’s talking about AI agents these days? They’re popping up in industries left and right, promising to transform how things get done. But honestly, trying to wrap your head around how this all works can get overwhelming. I felt that way — lost in a sea of buzzwords, new shiny tech and the jargon that comes with it — until I saw CrewAI. Getting hands\-on with CrewAI made AI agents feel practical and less overwhelming. If you’re like me, a tech nerd swamped by AI hype, my experience with CrewAI might help you cut through the noise. No enterprise\-level white papers — just a practical, down\-to\-earth look at my experience.


## CrewAI: The Playground for AI Agent Tinkerers

Imagine you’ve got a bunch of super\-smart virtual assistants (AI agents). Each one is trained in a specific task, like research or writing, and they all work together to get things done. It’s kind of like having a team of specialists who know exactly what to do. Now, imagine being able to organise these assistants, telling them who should handle what. That’s essentially what CrewAI does. Think of it like being the project manager of an AI\-powered team, where you decide who tackles which task, and CrewAI makes sure everything runs smoothly (i.e “orchestration” — basically coordinating different tasks to make sure they all fit together).

Here’s a quick breakdown of how it works:

1. You create these “agents” — think of them as your AI team members.
2. You give each agent a role, a goal, and some background info.
3. You define tasks for your agents to tackle.
4. CrewAI acts like the team leader, making sure all your virtual assistants (AI agents) work together smoothly.

This concept scales well, offering a glimpse into what larger enterprise platforms can do on a much grander scale.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*9haJX1l3JuExNNaz)


## Getting your Hands Dirty…

As I mentioned, I’m all about learning by doing. So, I fired up Google Colab (which is basically an online platform where you can run Python code) and decided to create a little project using CrewAI with the Google Search API. My goal? To automate some basic research and writing tasks — things that organisations typically do every day.

Having not really done this before, setting it all up was… an adventure. But once I got all the API keys sorted (pro tip: *keep those safe and sound in your Colab Secrets*), things started falling into place.

Setting up the environment for CrewAI and Google Search API might seem daunting, but it’s straightforward once you know where to start. You can check out the full code [here](https://github.com/larry-deee/CrewAI/blob/main/CrewAI_with_Google_Search.ipynb).

**Setting Up API Keys**: You’ll obviously need your LLM provider keys (or not if local) and that process (and more) is [well documented](https://docs.crewai.com/core-concepts/LLMs/). For Google\-Search I needed to grab my Google Search API key and ID from my [Google console credentials section](https://console.cloud.google.com/apis/credentials), and then store it in Colab Secrets.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*yckiBbOmqfSjgziMi_Yc5A.png)

Next, I had to set up my environment with relevant packages:


```python
!sudo apt-get update
!pip install crewai
!pip install 'crewai[tools]'
!pip install google-api-python-client

```
This took care of everything — CrewAI, the tools for managing the agents, and the Google Search API framework to setup the integration for web searches.

Here’s a quick code snippet for handling API keys:


```python
import os
from google.colab import userdata

os.environ["GOOGLE_API_KEY"] = userdata.get('GOOGLE_API_KEY')
os.environ["GOOGLE_CSE_ID"] = userdata.get('GOOGLE_CSE_ID')
```
Set the topic in a separate cell to make it easier to manage…


```python
## Set the Topic Here
#######
topic = """
Look for the latest Tech and AI trends in 2024.
"""
####
```
This next part might seem complex, but it’s important for integrating the Google Search API. The full code is available [here](https://github.com/larry-deee/CrewAI/blob/main/CrewAI_with_Google_Search.ipynb):


```python
class GoogleSearchTool:
    def __init__(self, api_key, cse_id):
        # Validate API key and Custom Search Engine ID upon initialization
        if not api_key or not cse_id:
            raise ValueError("API key and CSE ID must be provided")

        # Initialize the Google Custom Search API client
        self.api_key = api_key
        self.cse_id = cse_id
        self.service = build("customsearch", "v1", developerKey=self.api_key)
        self.name = "GoogleSearchTool"
        self.args = {"query": "Search term to find relevant results"}
        self.description = "Performs a Google search and returns relevant results."
```
**Research and Content Automation**: Next, I created two CrewAI agents: one for research and one for writing. The **GoogleSearchTool** class, which was written using the help of ChatGPT and Claude’s guidance (hey, no shame in getting help from an AI friend!), allowed the agents to use Google’s Custom Search via API. These agents then combined the research with AI writing agents to produce a good first\-pass written content. For example, the researcher agent would dig into the latest AI advancements, while the writer would craft an engaging blog/wiki style post based on those findings. Pretty cool.

Here is the section that defines the Agents:


```python
## Define your agents
researcher = Agent(
    role='Principal Researcher and Analyst',
    goal=f"Uncover cutting-edge developments in AI and related topics.",
    backstory="""
        You are an experienced and award-winning researcher who excels at 
        finding actionable insights and translating complex data 
        into engaging content.
    """,
    verbose=True,
    allow_delegation=False,
    llm=ChatOpenAI(model_name="gpt-4o", temperature=0.5),
    tools=[google_search_tool, ScrapeWebsiteTool()]
)

writer = Agent(
    role='Tech Content Strategist',
    goal=f"Craft compelling content on AI advancements.",
    backstory="""
      You are a renowned Content Strategist known for 
      translating complex ideas into engaging narratives.
    """,
    verbose=True,
    allow_delegation=True,
    llm=ChatOpenAI(model_name="gpt-4o", temperature=0.7)
)
```
…and then the job they need doing defined as Tasks.


```python
## Define tasks
research = Task(
    description="""
      Extract key insights, ideas, and information from AI topics 
      related to technology and self-improvement.
    """,
    expected_output="""
      A concise report on AI and technology, containing key insights 
      and recommendations in bullet points.
    """,
    agent=researcher,
    output_file="researcher_tasks.md"
)

write_blog = Task(
    description="""
    Write an engaging blog post based on the research on AI advancements.
    """,
    expected_output="""
      A full blog post of around 500 words with citations from all the URLs.
    """,
    agent=writer,
    output_file="writer_tasks.md"
)
```
…and then finally coordinating them as a ‘Crew’ to get them going:


```python
## Instantiate and kickoff the crew
crew = Crew(
    agents=[researcher, writer],
    tasks=[research, write_blog],
    verbose=True,
    process=Process.sequential  # Use parallel if no dependencies between tasks
)

## Kickoff the crew
result = crew.kickoff()
```
In no time at all — I created two AI agents. One’s a researcher, the other’s a writer. The researcher digs up the latest AI trends, and the writer turns that info into something people might actually want to read (hopefully). It’s nice and easy, and gives you (at least for me) a taste of how ‘agent orchestration’ and task completion works.

For reference the full code [here](https://github.com/larry-deee/CrewAI/blob/main/CrewAI_with_Google_Search.ipynb).


## That Lightbulb Moment

What blew me away was watching these agents work together…and how relatively easy it was to set up. I set them loose on a task to research and write about the topic, and it was great seeing the coordination between them as LLM responses showed up as text logs. The researcher agent would scour the web, pulling out nuggets of information, and then hand them off to the writer. The writer would then spin those facts into a coherent article.

The output wasn’t perfect but good enough, especially after a short setup and virtually no tweaking. However, seeing it all come together was great… and really how easy it was to do with really no coding skills.

Did it save time on the research and drafting, yep. It also free’d me up to think of other ways I could optimise it.

This automation not only accelerates content creation but also demonstrates how businesses, anyone can streamline research tasks, boosting productivity.


## Why This Matters (Even If You’re Not a Coder)

Now, I know what you’re thinking. “Great, you played with some code. How does this help me understand these features let alone an Enterprise platform?” Whether you’re using AI Agents in a personal project or on an enterprise system, the core idea is the same, getting AI agents to work together on complex tasks to solve real world problems is a game changer.

As for my little CrewAI project? It’s like a mini simulation of that. It shows how AI can take on research, analysis, and content creation — tasks that are crucial in pretty much every industry.


## The Output

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*8wwLh9k0ieASxR5w9PhRHw.png)


## Agentic and Generative Phases in Practice

These terms I’m starting to hear a lot. So the way I’m seeing it is the **agentic phase** provided the **strategy and orchestration**, ensuring that the right tasks were assigned to the right agents, while the **generative phase** handled the **execution and creation of content**. The two phases work together to achieve a well\-coordinated output, illustrating the combining of autonomous decision\-making (agentic phase) with the creation abilities of AI (generative phase).

In simple terms, the agentic phase is about planning and organizing tasks, while the generative phase handles the execution and content creation. Together, they form a seamless process that ensures everything gets done efficiently.


### Here is a breakdown:

**Defining Agents:**

* **ResearchAgent** and **Writer Agent** are created with specific roles and goals. For instance, the **ResearchAgent** is tasked with uncovering insights from search results, and the **Writer Agent** is responsible for crafting content.


```python
researcher = ResearchAgent(
    name='Principal Researcher and Analyst',
    role='Researcher',
    goal=f"""Uncover cutting-edge developments in {search_query} and 
          related topics.""",
    backstory="""
        You are an experienced and award-winning researcher who excels 
        at finding actionable insights and 
        translating complex data into engaging content.
    """,
    tools=[google_search_tool, ScrapeWebsiteTool()]
)
```
**Task Coordination**:

* Tasks are assigned to the agents, and CrewAI manages the **process flow**. I see this as **agentic** focused as it’s the higher\-level orchestration of how the agents will collaborate, ensuring the right task is executed in the right sequence.


```python
crew = Crew(
    agents=[researcher, writer],
    tasks=[research, write_blog],
    verbose=True,
    process=Process.sequential  # Ensure the research task finishes before writing starts
)
```
**Task Definition**:

* The definition of tasks, including their expected output and description, reflects **agentic thinking**. It sets the **high\-level objectives** for each agent and defines how they will interact with each other.


```python
research = Task(
    description=f"""
      Extract key insights, ideas, and information from {search_query}.
    """,
    expected_output=f"""
      A concise report on {search_query}, containing key insights and 
      recommendations in bullet points.
    """,
    agent=researcher,
    output_file="researcher_tasks.md",
    execution_function=researcher_task_execution  # Executes the researcher's function to gather insights
)
```

### How They Work Together in the Code:
Agentic Phase:

* **Sets the structure:** It defines the roles of each agent, outlines the tasks, and organises the workflow.
* **Decides the sequence:** The process is sequenced so that the research task runs before the writing task (using Process.sequential).


### Generative Phase:

* **Executes the strategy:** The agents take the instructions from the agentic phase and produce the actual content (research insights, blog post).
* **Creates the output:** Through the GoogleSearchTool and writing tasks, the agents generate the final output based on the research findings.

The **agentic phase** handles the higher\-level decision\-making, coordination, and task definition (like defining agents, tasks, and processes). The **generative phase** deals with executing these decisions and generating the actual content (like searching, processing insights, and writing blog posts). Together, they create a seamless workflow where strategy and execution are working together.


## The Takeaway

In a world where AI are revolutionising industries, tools like CrewAI offer an easily accessible starting point. Whether you’re a coder or not, experimenting with these tools can help grasp the potential of AI and AI agents.

I encourage you to experiment with tools like CrewAI and Google Search API to see firsthand how AI can transform your workflows — whether you’re a coder or not. This was educational and fun!

Stay curious, fellow tech enthusiasts!

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*s-vmVEbzUQaRf4qRCMAO5w.png)


