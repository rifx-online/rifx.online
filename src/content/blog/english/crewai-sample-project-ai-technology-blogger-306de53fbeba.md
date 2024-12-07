---
title: "CrewAI Sample Project — AI Technology Blogger"
meta_title: "CrewAI Sample Project — AI Technology Blogger"
description: "This tutorial outlines the development of an AI-powered blog writing assistant using the CrewAI platform, aimed at enhancing content creation for technology bloggers. It details the projects goals, which include improving efficiency and content quality by utilizing Google and Serper APIs for data collection. The project involves two main agents: a Researcher, who gathers and analyzes information, and a Writer, who composes the blog posts based on the Researchers findings. The process is designed to be sequential, ensuring that tasks are completed in order for optimal results. Overall, this project facilitates the automatic generation of technology blog posts, streamlining the content creation process for users."
date: 2024-12-07T12:31:23Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*vGnSw8IVCKoafs73F-9Q1A.png"
categories: ["Programming", "Technology", "Machine Learning"]
author: "Rifx.Online"
tags: ["CrewAI", "Researcher", "Writer", "APIs", "content"]
draft: False

---






In this tutorial, an AI\-based blog writer assistant is developed for content creators using the CrewAI platform. The project is structured to automatically provide and suggest both basic and advanced information that users may need when creating technology blog posts. This approach aims to reduce the workload of content creators, improve quality, and ensure consistency.


## Goals

* To develop an AI\-powered system to speed up the process of creating technology blog posts for users.
* To create a blog post by scanning the most popular and latest developments from Google.
* To help users work more efficiently by improving content quality.


## Technical Structure

**Required Two APIs and Keys** were used in this project:

* **Google API:** Used to perform Google searches. (<https://aistudio.google.com/app/apikey>)
* **Serper API:** Returns Google search results in JSON format, allowing for data analysis. ([https://serper.dev/api\-key](https://serper.dev/api-key))

API keys are assigned as environment variables by adding them to the `.env` file:


```python
GEMINI_API_KEY="AI…………"
SERPER_API_KEY="b……………"
```

## Required Libraries

Before starting the project, the necessary Python libraries are installed:


```python
pip install crewai crewai-tools
pip install load_dotenv
pip install python-dotenv
pip install google-generativeai
```
These libraries are necessary to run AI models, communicate with APIs, and manage environment variables in the project.


## Defining the Serper API Tool

In this project, the Serper API is used to perform searches. This API is a service that allows search engine functionality to be accessed programmatically. By returning results in JSON format, it enables developers to utilize search data.

First, the Serper API key needs to be retrieved from the `.env` file and assigned to an environment variable:


```python
import os
from dotenv import load_dotenv
from crewai_tools.tools.serper_dev_tool.serper_dev_tool import SerperDevTool

load_dotenv()
os.environ["SERPER_API_KEY"] = os.getenv("SERPER_API_KEY")

serper_tool = SerperDevTool()
```
Here, a tool is created using the `SerperDevTool` class from the `crew-ai-tools` package and assigned to the `serper_tool` variable. This tool will handle the data collection processes used for blog post generation.


## Agents

Two separate agents are defined in the project: Researcher and Writer. These agents are designed to perform specific tasks. Each agent has a specific role and a goal.

* **Researcher:** Conducts research on relevant technological topics and presents analyses.
* **Writer:** Uses the information collected by the Researcher to create a blog post on a specific topic.

If you want the agent to work more comprehensively, I recommend writing a long backstory. To indicate that the Researcher agent will provide information to other agents, the `allow_delegation` boolean is set to `True`. Additionally, since I want to use the Gemini model for both agents, I only need to write the model's name in the `llm` part and assign the environment variable `GEMINI_API_KEY`. The Serper API we created is also assigned via the `tool` parameter.

When writing prompts, if we want to assign variable values, we write the name of the input value in curly brackets within the text, as seen in the `{topic}`.


```python
import os

from crewai import Agent
from dotenv import load_dotenv

from tools import serper_tool

load_dotenv()

os.environ['GEMINI_API_KEY'] = os.getenv("GEMINI_API_KEY")

researcher = Agent(
    role= "Senior Researcher",
    goal="Uncover groundbreaking technologies in {topic}",
    verbose= True,
    memory=True,
    backstory=("""
        Driven by curiosity and a relentless pursuit of knowledge, you're at the forefront of innovation. Your role
        is to explore and discover emerging technologies within the {topic} space. You gather insights from multiple 
        sources, analyze them meticulously, and compile them into actionable reports. You are well-versed in understanding 
        market trends, technological shifts, and their potential impacts on various industries.
    """),
    tools= [serper_tool],
    llm="gemini/gemini-1.5-flash",
    allow_delegation=True
)

writer = Agent(
    role= "Writer",
    goal="Narrate compelling tech stories about {topic}",
    verbose= True,
    memory=True,
    backstory=("""
        With a passion for structuring complex topics into cohesive narratives, you bring clarity to groundbreaking technologies.
        Your writing bridges the gap between technical depth and readability, engaging readers by providing clear introductions, 
        detailed explanations, and insightful conclusions. You are known for creating a flow that draws readers in and leaves 
        them with a deeper understanding of the subject matter and its future implications.
    """),
    tools= [serper_tool],
    llm="gemini/gemini-1.5-flash"
)
```
* **Researcher Agent:** Conducts in\-depth research on the topic, analyzes the information obtained, and creates reports.
* **Writer Agent:** Produces readable and flowing articles using the information received from the Researcher.


## Tasks

Tasks to be assigned to agents are defined using the `Task` class. Each task includes a description, expected output, tools to be used, and the agent that will carry out the task.

* **Researcher Task:** Prepare an in\-depth report on the topic.
* **Writer Task:** Use this report to write a blog post.

As you can see, since tasks need to be completed sequentially, the process must progress as a `Sequential Process`. Therefore, the `async_execution` value must be set to `False`. This way, the Writer waits for the Researcher before performing its task.


```python
from crewai import Task

from agents import researcher, writer
from tools import serper_tool

researcher_task = Task(
    description=("""
        Conduct an in-depth exploration of the latest trends in {topic} and identify key technologies that have the potential 
        to disrupt the market in the near future. Your analysis should include the strengths, weaknesses, and market 
        implications of these technologies. Focus on identifying major opportunities and risks, providing a clear picture 
        of how these innovations could shape the industry landscape. Pay special attention to scalability, adoption barriers, 
        and competitive dynamics.
    """),
    expected_output="A comprehensive 3-paragraph report analyzing emerging technologies, market potential, and risks in {topic}.",
    tools=[serper_tool],
    agent=researcher
)

writer_task = Task(
    description=("""
        Write the article in language {language}.
        Structure the article into three sections: Introduction, Development, and Conclusion. 
        
        In the **Introduction**, provide an overview of {topic}, its current relevance, and why it matters today. 
        
        In the **Development** section, write min 2 max 4 paragraphs that analyze key trends, technological advancements, 
        and their implications for the industry. Include both the opportunities and challenges these technologies present.
        
        In the **Conclusion**, summarize the overall impact of these technologies and offer predictions about how 
        they may evolve in the future. Make sure the article is cohesive, flows naturally from one section to the next, 
        and ends with a forward-looking perspective.
        
        The article should not have headings labeled as Introduction, Development, or Conclusion. 
        All paragraphs should be between 500 and 850 words in length.
        If the selected language is not English, I would like you to write English technical terms in parentheses next to the translated term. 
        For example, in the Turkish translation, I want it to say 'Üretken Yapay Zeka (Generative AI)'.
    """),
    expected_output="A well-structured article (4 paragraphs) in markdown with a clear Introduction, Development (2-3 paragraphs), and Conclusion.",
    async_execution= False,
    tools=[serper_tool],
    agent=writer,
    output_file= "new-blog-post.md"
)
```

## Crew and Process

Once the agents and tasks are defined, the process is defined using the `Crew` object. In this process, tasks are executed sequentially. Finally, the `kickoff` method is used to run the project. In this method, necessary parameters are entered, and the process is started.


```python
from crewai import Crew, Process

from agents import researcher, writer
from tasks import researcher_task, writer_task

crew = Crew(
    agents=[researcher, writer],
    tasks=[researcher_task, writer_task],
    process=Process.sequential,
    verbose=True
)

result = crew.kickoff(inputs={
    'topic': 'AI in industry',
    'language': 'english'})
print(result)
```
This code takes the topic to be researched and the language parameter and starts the interaction between agents and tasks. As an output, a blog post is generated.


## Sample Output

The output of the post is saved to the specified file path.

An sample output:


```python
The AI industry is undergoing a dramatic transformation, fueled by emerging technologies with the potential to reshape the market. Generative AI, specifically large language models (LLMs) and image-generating AI, stands at the forefront of this revolution. Its ability to create novel content, automate tasks, and personalize experiences across various industries, from healthcare and manufacturing to finance and marketing, is driving widespread adoption. This transformative potential has positioned generative AI as a vital tool for businesses seeking to optimize processes, enhance products, and create new revenue streams.  

The rise of Multimodal AI (Multimodal AI), which integrates different data modalities like text, image, and audio, represents another crucial trend reshaping the industry. This technology offers a more comprehensive understanding of complex data, enabling more sophisticated applications in areas such as natural language processing, computer vision, and robotics.  The increasing accessibility of open-source AI tools and models is democratizing access to AI technology, fostering innovation and empowering smaller players to participate in the market.  Furthermore, cloud-based AI platforms provide scalable solutions, making AI accessible to a wider range of businesses. 

While these developments present exciting opportunities, they also introduce risks. Ethical considerations are paramount, requiring careful attention to bias, fairness, and transparency in AI systems.  The rapid pace of development and the evolving nature of AI technologies also pose challenges, requiring continuous adaptation and learning.  Moreover, the high computational demands of generative AI models and the requirement for specialized expertise pose significant adoption barriers, particularly for smaller businesses.  

Despite these complexities, the future of AI in industry appears promising, with these emerging technologies poised to revolutionize industries and create new opportunities for innovation and growth.  As AI technologies continue to advance, the industry will likely see further consolidation and the emergence of new use cases across various sectors.  The focus will likely shift towards developing more robust and ethical AI systems, ensuring responsible and equitable implementation.  The integration of AI with other technologies like the Internet of Things (IoT) and blockchain will also create exciting new possibilities. Ultimately, the success of AI in industry will depend on collaboration between businesses, researchers, and policymakers to address ethical and practical challenges and harness the transformative potential of these technologies for the benefit of society.
```
With this project, users can automatically generate technology blog posts and significantly speed up their content creation processes.

If you’d like me to continue with the AI\-related series, I appreciate your support 🙂 Also, don’t forget to follow 😉


