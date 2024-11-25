---
title: "AI for BI: Building a Business Information Report with CrewAI and OpenAI"
meta_title: "AI for BI: Building a Business Information Report with CrewAI and OpenAI"
description: "This article discusses the development of a basic Business Intelligence (BI) report using CrewAI and OpenAIs API. It outlines the steps to create visualizations and textual reports from CSV data, emphasizing the role of AI in automating data analysis and reporting. Two agents are created: one for generating charts and another for analyzing data and composing reports. The article also highlights the potential improvements for tailoring the application to specific needs, enhancing the reports comprehensiveness, and ensuring safety in code execution. The resulting report includes sales performance insights and visualizations."
date: 2024-11-25T15:00:22Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*GsGgqHBQlZiLSxqQ"
categories: ["Programming", "Technology", "Data Science"]
author: "Rifx.Online"
tags: ["Business", "Intelligence", "CrewAI", "OpenAI", "Visualizations"]
draft: False

---





### How to create a simple BI report directly from CSV data



Business Information applications help businesses use their data as a resource to make critical decisions and we are going to build one with AI.

AI will inevitably play an ever\-increasing role in BI tools; more specifically, LLM\-based applications will allow BI apps to create visualizations, provide insights through data analysis, and automate business reporting.

So, in this article, we will explore how an LLM application can help create business information. It won’t be a full\-blown BI application; it will, however, automatically create charts and a textual report directly from data.

We will use the OpenAI API via CrewAI to build a program that will show the potential of AI in this field and will result in a simple AI\-driven BI application.

I should point out that I am using these particular components as they are convenient — I used CrewAI in a recent [tutorial](https://datavizandai.github.io/2024/09/28/AI_Agents_vs._AI_Pipelines-3A_a_Practical_Guide_to_Coding_Your_LLM_Application.html) (if you are new to CrewAI, I would encourage you to read it) and am getting comfortable with it. CrewAI uses OpenAI by default, so I’ve gone with that, too.

Another LLM, such as Anthropic’s Claude, Google’s Gemini, etc. would be as effective and, equally, while CrewAI is easy to use, another AI agent framework such as Autogen, or a similar, that supports code execution would be suitable, too.

Here, I am using the open\-source offering from CrewAI which is, of course, free to use; OpenAI requires an API key so you have to sign up and will be charged for use\[1].


## The BI apps and data

There are two types of functionality that we are going to explore: creating charts and reporting in text. Both of these require an LLM that can analyse and make sense of data — that shouldn’t be difficult for most modern LLMs.

We’ll create two agents: one that creates charts and one that analyses the data and creates a report.

The data we will use is in CSV format and is entirely fictional. It was created with a ChatGPT and concerns and a company that sells an unlikely range of products (from smart TVs to bed frames) in various regions across the world.

There are three tables. The first records the monthly sales.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*bDLrWJ_cuxcOa6Sh)

The second shows the sales of the top\-selling products in each region.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*lk4_csz7Xet22plY)

And the third details the sales of each item.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*4guxe3n-1syYIxLD)

Is this a realistic set of data that a sales director might find useful? I will freely admit that I don’t have a clue. I don’t own a company and I don’t sell anything, so I cannot claim any expertise in this area.

However, I’m not sure that it matters that much. We can use the data that ChatGPT has given me, create charts, and do some analysis and reporting, whether or not this data is precisely (or even vaguely) typical.

So let’s get started. I’m using Jupyter Lab to code these examples and you can find all the notebooks in my [GitHub repo](https://github.com/alanjones2/CrewAIapps) in the **AIBI\-3** folder.

Charts are always a feature of BI reporting so let’s start with them.


## Chart Maker

First, we’ll take the CSV files and get the LLM to create charts from it. Below is an example — it was generated with Matplotlib.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*AIDlTPaWw46wqTwk)

We’ll be using the LLM to generate code and CrewAI to run it.

Running LLM\-generated code is potentially unsafe because an LLM can produce arbitrary code that is not necessarily what we want (it may hallucinate something that when run could cause damage in the local file system).

For this reason, it either needs to be checked by a human first or run in some sort of sandbox. There are different approaches to this, Autogen, for example, gives you a choice of how you run code but CrewAI opts for safety first and all code is run in a Docker container which is isolated from the the local file system.

So that means you need to have Docker running on your local machine. This is straightforward — just go to the [Docker website](https://www.docker.com/products/docker-desktop/), download the desktop app for your operating system, install it, and run it. You don’t need to create an account or sign in — you don’t even need to know anything about Docker, just let it run and CrewAI will use it.

We will let the LLM decide what charts it would like to create and we’ll see how that goes. I’ve coded each of the code blocks below in a separate Jupyter code cell; together they will build up the complete program.

We will be using the default OpenAI API\[1] and that means that your API key should be accessible as an environment variable. If it is stored as an environment variable, you will need to run the following code block first.


```python
import os
os.environ["OPENAI_API_KEY"] = "your api key"
```
To get started you first import the necessary libraries and set the LLM model.


```python
from crewai import Agent, Task, Crew
llm = "gpt-4o-mini"
```
A CrewAI app consists of a few elements: agents, tasks and a crew that runs the tasks and agents. We’ll see how they are used as we go. (For a more detailed introduction to CrewAI, see my article, [AI Agents vs. AI Pipelines: a Practical Guide to Coding Your LLM Application](https://alanjones2.github.io/articles/agentpipeline/text/article.html) which introduces CrewAI).

In order to do stuff that the LLM is not capable of, we also need to provide the agents with tools — again we’ll see them at work, shortly.

The tools that we need here allow the LLM to read the data files as well as write charts and reports to the local file system. So, next, we import the CrewAI tools required to read and write files.


```python
from crewai_tools import FileReadTool, FileWriterTool

file_read_tool = FileReadTool()
file_writer_tool = FileWriterTool()
```
Much of the work in a CrewAI app is done by one or more agents. Below, we set up `chart_agent`.


```python
## Define agent

chart_agent = Agent(
        role="Chart creator",
        goal="""Read the data provided and create a matplotlib chart from 
                that data.
                If you are given specific instructions on how to draw the 
                chart then follow them, if not then create a chart that 
                best represents the data""",
        backstory="""You aim is to read and analyse sales data and create 
                     a mathplotlib chart""",
        tools=[file_read_tool, file_writer_tool],
        llm=llm,
        allow_code_execution=True
    )
```
You can see that this is an object instantiated from the CrewAI [Agent](https://docs.crewai.com/concepts/agents) class. The first three parameters are used to create a system prompt — what we expect the agent to do is defined in the `goal` and `backstory` parameters. And you can also see that we have declared the tools that the LLM can use as well as referring the LLM that we will be using.

We’ve given the agent instructions that will give it autonomy in what it creates unless it is given specific instructions.

Significantly, we set `allow_code_execution` to `True`. This implicitly allows the LLM to use its code execution tool and run code in Docker.

I’ve defined the files that we are going to use in a Python `dict` \- the data files exist already, of course, and the image file is where we want the charts to be saved.


```python
files = [
    {
        'data_file_name':'sales_product_cat.csv',
        'chart_file_name': 'sales_product_summary.png',
    },
    {
        'data_file_name': 'monthly_sales.csv',
        'chart_file_name': 'monthly_sales.png',
    },
    {
        'data_file_name': 'sales_by_region.csv',
        'chart_file_name': 'sales_by_region.png',
    }
]
```
The next thing to data is to create a Task which further defines what we want to do. It tells the agent to create a chart for a data file and save it in a local file. We also need to specify the appropriate agent (there could be more than one) and the tools that will be necessary.

Lastly, we set up a Crew. This defines the list of agents and the lists of tasks that we want to run (in this case the lists only have one element). The `verbose` parameter does what you would expect; when set `True` the agent will write all of its thinking to the console. If you don't want to be inundated with a large amount of text then set this to `False`.

Well, almost lastly. We need to set off the crew and collect the result, of course. Often we will use the method `crew.kickoff()` but in this case, we have a list of files that we want processed and CrewAI gives us a useful method that will iterate through a list in `crew.kickoff_for_each()` and as we see below this takes a list as a parameter.


```python
create_chart = Task(
    description="""Create a chart for {data_file_name} and save it in {chart_file_name}.'
                    """,
    expected_output="""A matplotlib chart""",
    agent=chart_agent,
    tools=[file_read_tool, file_writer_tool]
)

## Define the crew
crew = Crew(
    agents=[chart_agent],
    tasks=[create_chart],
    verbose=True
)
result = crew.kickoff_for_each(inputs=files)
```
Running the crew like this produces an awful lot of text which I am not going to reproduce here but which details the steps that the agent is going through. The sequence of events is this:

* use the `files_read_tool` to read the data file
* send the data to the LLM to analyse the data and produce the code that creates a Matplotlib chart
* run the LLM\-generated code in Docker
* use the `file_writer_tool` to write the chart to a PNG file in the local file system.

It will do this for each data file and if you have the Docker window open you will see that it runs the code interpreter image as necessary.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*Y0sW2p8gQCWGdzzq)

As the code is generated by an LLM, we cannot guarantee that it will produce the same result each time. However, it seems fairly consistent. An image is produced for each data file; the Monthly Sales Data can be seen at the beginning of this section and the other two are reproduced below.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*gWBjYx4hxDD637qr)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*NrYkrwLhtDNytqQV)


## An agent\-generated report

Now we have the charts, let’s move on to generating a report that will be the result of some simple analysis and question\-answering by the LLM. This and links to the previously generated images will then be combined into a Markdown file and this will be the final report.

We need a new agent for this; we’ll call it `data_analysis_agent`.

We set up the agent much in the same format as before but, of course, the role, goal and backstory are different. Also, this time, we disable code execution as we do not need it to create a report.


```python
data_analysis_agent = Agent(
        role="Data Analyser",
        goal="""You aim is to read and analyse sales data. You should
                then write a report on sales performance 
                that includes an executive summary.
                """,
        backstory="You are assigned to perform sales analysis for a company",
        tools=[file_read_tool, file_writer_tool],
        llm=llm,
        allow_code_execution=False
    )
```
The task that the agent will be assigned is different this time, of course. The description tells the agent what to do: the first couple of sentences give the agent the files that it will need (the data and the charts) and then there is a list of questions that the LLM should attempt to answer. It is also told where to save the report and that it should be in Markdown format.

Note that the files are also included after the question; the reason for this is that, in an earlier version of the program, the LLM seemed to forget about the chart files and including them again fixes the problem.

Following the task definition we set up the crew and execute it.


```python
write_report = Task(
    description=f"""The following contains a set of data files and
                    corresponding charts:
                        {files}
                    Write report in Markdown that includes and overview of all
                    of the sales data and incorporate the corresponding charts.If the information is available, or you can calculate it,
                    try and answer the following questions: 
                    1. What has been the overall revenue for the latest month?
                    2. What are the top selling 5 items during the reporting 
                    period?
                    3. In which regions have there been the most sales and 
                    what items are popular those regions?
                    4. What sort of growth has there been over the reporting 
                    period?
                    5. Are there any trends that you can detect?
                    The overview of the data and the corresponding charts from {files} should be included in an appendix.
                    
                    Save the result in the file './report.md'.
                    """,
    expected_output="""A markdown file""",
    agent=data_analysis_agent,
    tools=[file_read_tool, file_writer_tool]
)
## Define the crew
crew = Crew(
    agents=[data_analysis_agent],
    tasks=[write_report],
    verbose=True
)
result = crew.kickoff()

```
The resulting report is too long to include in the text, so I’ve appended it to the end of the article. However, the program makes a reasonable attempt to answer the questions and faithfully includes the charts.

The report is short and a more sophisticated prompt might well result in something more comprehensive. However, when designing the prompt, one has to be careful not to provide inappropriate hints to the LLM. For example, I cut and pasted some suggestions from a ChatGPT session which included questions about supply chain problems. Of course, there is no way that you could deduce such a problem from the data given but the LLM hallucinated a fictitious supply chain problem to explain a downturn in sales!


## Conclusion and towards a more useful program

It’s remarkably simple to create a very basic BI report writer like this but many improvements could be made to both the chart creation and the report writing.

This program is pretty generic, it will take any set of CSV files and do its best to interpret them and construct suitable charts. We could tailor it better to a particular application by including a description of the data file in the `files` data structure and we could also add a specification of the chart that we wanted to create \- the agent is already primed to expect this but we would need to make some minor changes to incorporate the data description. Both of these measures would help to make sure that the output is more consistent and better meets our needs.

The report writing prompt could also be made more specific to a particular application and expanded to give a longer report.

If we were to take both that prompt and the `files` data structure out into a separate file, this would allow the program to be tuned for different applications.

This has been a basic foray into using AI to produce a BI report but there is significant room for improvement. Using an external file to specify more detailed data file descriptions and explicit chart specifications would allow non\-programmers to tailor the program to their specific needs while maintaining the program’s generic nature. And of course, a Jupyter Notebook is not necessarily the best vehicle for an application that is to be used by non\-programmers. But I hope that this has been food for thought.

As ever, thanks for reading — I hope that it has been useful. You can see more articles on my [website](https://readmedium.com/alanjones2.github.io) and subscribe to my occasional newsletter [here](http://technofile.substack.com).

The code and data for this article can be found in this [GitHub repo](https://github.com/alanjones2/CrewAIapps) in the *AIBI\-3* folder. The resulting charts and report are in the same folder


## Notes and references

1. If you run the code here you will need an OpenAI account and an API key. Using this means you will be charged. Running the code here should not cost you more than a few 10s of cents but you should always check your expenditure on the OpenAI dashboard.
2. All images and screenshots are by me, the author, unless otherwise stated.
3. Disclaimer: I have no commercial connection with any company mentioned in this article.


## Appendix — the report

Note that the Markdown format does not render perfectly in Medium but what you see below is pretty close to what was generated.


## Sales Performance Report


## Executive Summary

This report analyzes the sales performance of the company over the reporting period, highlighting overall revenue, top\-selling items, regional performance, growth trends, and notable observations. The analysis is based on sales data for various product categories, monthly sales figures, and regional performance metrics.


## Sales Overview

1. **Overall Revenue for Latest Month:**
* **August Total Revenue:** $4,000,000

2\. **Top Selling 5 Items:**

* 1\. Smartphone — $1,200,000
* 2\. Laptop — $850,000
* 3\. Smart TV — $450,000
* 4\. Refrigerator — $400,000
* 5\. Washing Machine — $200,000

**3\. Regions with Most Sales:**

* **North America:**
* Total Revenue: $1,500,000
* Top\-Selling Product: Smartphone (800 units)
* **Europe:**
* Total Revenue: $1,200,000
* Top\-Selling Product: Laptop (600 units)
* **Asia\-Pacific:**
* Total Revenue: $800,000
* Top\-Selling Product: Smart TV (900 units)
* **South America:**
* Total Revenue: $350,000
* Top\-Selling Product: Refrigerator (300 units)
* **Africa:**
* Total Revenue: $250,000
* Top\-Selling Product: Sofa (150 units)

**4\. Growth Over the Reporting Period:**

* The overall trend shows a consistent increase in sales. For instance, revenue grew from $3,500,000 in January to $4,000,000 in August, indicating a gradual upward trajectory in sales performance.

**5\. Trends Detected:**

* There has been a steady growth in sales of electronics, particularly smartphones and laptops.
* Seasonality might affect sales, as evidenced by fluctuating monthly performance.
* New product categories, particularly in home appliances and furniture, show promising growth potential.


## Appendix

* **Sales by Product Category Chart:**

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*CQxZG5Xfs9v5JsuD)

* **Monthly Sales Chart:**

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*d-Af0u03ggIsN09K)

* **Sales by Region Chart:**

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*sjnuGHYtQEZrl3NI)

*This article was first published on my website, [here](https://datavizandai.github.io/2024/11/16/AI4BI-2.html)*


