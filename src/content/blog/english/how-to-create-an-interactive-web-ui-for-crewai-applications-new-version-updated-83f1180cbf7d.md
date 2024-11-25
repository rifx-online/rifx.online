---
title: "How to Create an Interactive Web UI for CrewAI Applications (New Version Updated)"
meta_title: "How to Create an Interactive Web UI for CrewAI Applications (New Version Updated)"
description: "This article provides an updated tutorial on creating an interactive web UI for CrewAI applications, reflecting significant changes in the framework from version 0.28 to 0.80. It outlines the new features, such as customizable prompts, enhanced agent capabilities, and simplified project creation via a single command. The tutorial walks through integrating the CrewAI framework with the Panel library to facilitate user interaction through a chat interface, detailing the necessary code adjustments in the project files. It concludes with instructions on running the web app and emphasizes the ongoing development of CrewAI, suggesting future updates to the tutorial."
date: 2024-11-25T15:00:22Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*1--VMRKUMg3Dh7jB3ohpAg.png"
categories: ["Programming/Scripting", "Technology/Web", "Chatbots"]
author: "Rifx.Online"
tags: ["CrewAI", "Panel", "prompts", "agents", "chat"]
draft: False

---





### A Quick Update for the Implementation of CrewAI \+ Panel UI



Early this year, I wrote a tutorial about creating an interactive web UI for CrewAI applications, and in that tutorial, I implemented a simple web server to visualize the CrewAI agents and workflows and allow users to interact with them with messages. Since then, CrewAI has undergone many changes and improvements from version 0\.28 to the latest version 0\.80\. Not only the API usages have been changed a lot, but also the entire architecture is different after this half of the year, so there are many developers in the tech community told me that the tutorial is outdated and they cannot update the CrewAI for new features but retain the existing UI designs in their projects.

In this tutorial, I will show you how to create the same web UI for the latest version of the CrewAI framework. You can see the innovative procedure for quickly building a multi\-agent application with the new CrewAI framework, the way to customize the app by redirecting the agents' default output to the chat UI of [Panel](https://panel.holoviz.org/reference/index.html#chat), a Python library for building custom web apps, and how to interact with each agent by sending messages on the UI.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*LkEYABv3w_o_tBINAlrVYA.png)


## What’s new in CrewAI since our last tutorial?

If you follow my last implementation of the CrewAI web app, you must now have a look at what significant changes have been made to the development of this framework. During May and June of 2024, CrewAI added various features like setting a manager for crews, customizable prompt and response templates, and integration with external tools, enhancing flexibility and user control over AI behavior. It also introduced new agent types to execute code directly, integration with third\-party agents from various platforms, and a training CLI, significantly increasing the framework’s capabilities in handling complex, dynamic tasks. Those are all helpful features for multi\-agent systems, and I will demonstrate how to leverage and expand them in future demonstrations.

To me, the most innovative step forward of CrewAI is its ability to create a complete application with a single command. With just `crewai create crew my-app`, you can instantly generate a fully functional multi\-agent application with all the necessary modules, documentation, and configuration files. This includes pre\-configured agent roles and tasks in YAML files, a crew orchestration module, and environment variable templates — everything needed to get started. The generated project structure follows best practices and includes features like task callbacks, process management, and agent coordination out of the box. This dramatically reduces the time and effort needed to build LLM multi\-agent applications compared to starting from scratch with other frameworks that only provide APIs and examples.

Let’s warm up with an example of a CrewAI project.


## Project Creation

Let’s walk through creating a simple CrewAI project that uses the default content.

First, install the latest version of CrewAI (The current version is 0\.80\):


```python
pip install crewai crewai-tools
```
Then, create a new CrewAI project using its CLI:


```python
crewai create crew my_crew
```
During creation, you will be asked to choose the language model and your API key for agents to use.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*OY9mS7ylA_YJ57Si23wwIg.jpeg)

After a couple of seconds, you will see a message showing that your crew has been created successfully, and there will be a new directory called `my_crew` in your current working directory with the basic structure of your project.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*3I44j4w5vn2KPMPjBRQ6Uw.jpeg)

In the structure, you will find that the `main.py` and `crew.py` are located in the `src/` directory and two YAML files are located in the `src/config/` directory. The basic multi\-agent logic is still implemented in the two Python files, but the system instructions for agents and tasks are now moved to the YAML files. This new structure separates the coding sections from the configuration sections, which allows more collaboration between the agent/prompt/tool designers (non\-coding) and the multi\-agent capabilities/workflow developers (coding). The default app demonstrates a simple multi\-agent workflow that researches and reports on the latest AI developments for a given topic or subject. So let’s run the app by running the following command in the terminal:


```python
cd my_crew
crewai run
```
After automatically downloading the dependencies, the entire agent's workflow will be executed, and the output will be displayed in the terminal.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*aU1oLj0EuSzXdL1tIeolZg.jpeg)

Understanding that now let’s move to the main topic of this tutorial to see how to wrap this command line application into the Panel Web UI based on this source code structure.


## CrewAI \+ Panel integration

Following the design purpose, let’s redirect the task’s output and human input to the chat UI of Panel. Install the Panel first:


```python
pip install panel
```

### crew.py

Move to the `crew.py` file in the source directory and create the `ChatInterface` object from Panel’s widget library.


```python
import panel as pn

chat_interface = pn.chat.ChatInterface()
```
Then, define the `print_output()` function to send the task’s output to the panel's chat UI.


```python
from crewai.tasks.task_output import TaskOutput

def print_output(output: TaskOutput):

    message = output.raw
    chat_interface.send(message, user=output.agent, respond=False)
```
This function is designed to be called when a task is completed, so we need to register it as a callback function to each task definition.

Note that the `human_input=True` parameter is added to the `reporting_task` definition to allow the agent to interact with the user at the final step of the workflow.


```python
@task
def research_task(self) -> Task:
    return Task(
        # ...existing parameters...
        callback=print_output
    )

@task
def reporting_task(self) -> Task:
    return Task(
        # ...existing parameters...
        callback=print_output,
        human_input=True,
    )
```

### main.py

For the main file, we need to first remove all the existing code because we have to run the app by using Panel’s serve command instead of the `crewai run` command in order to wrap the crew workflow. The existing general execution code is no longer needed.

First, we need to manually import the `OPENAI_API_KEY` from the `.env` file, which is initialized when we run the crew command.


```python
import os
from dotenv import load_dotenv
load_dotenv()
```
Then, we need to define the Panel theme.


```python
import panel as pn
pn.extension(design='material')
```
OK, now we need to define the callback function to handle the user input, feed it to the crew workflow, and send the results back to the chat UI.

The callback function will be called from the message input of the chat UI on two occasions:

1. When the app starts, the user sends a query to initiate the crew workflow.
2. When a task is completed, the relevant agent requires feedback input from the user.

Here is the code:


```python
from my_crew.crew import MyCrew
from my_crew.crew import chat_interface
import threading

user_input = None
crew_started = False

def initiate_chat(message):
    global crew_started
    crew_started = True
    
    try:
        # Initialize crew with inputs
        inputs = {"topic": message}
        crew = MyCrew().crew()
        result = crew.kickoff(inputs=inputs)
        
        # Send results back to chat
    except Exception as e:
        chat_interface.send(f"An error occurred: {e}", user="Assistant", respond=False)
    crew_started = False

def callback(contents: str, user: str, instance: pn.chat.ChatInterface):
    global crew_started
    global user_input

    if not crew_started:
        thread = threading.Thread(target=initiate_chat, args=(contents,))
        thread.start()

    else:
        user_input = contents

chat_interface.callback = callback 
```
In the callback function, we need to check if the crew’s workflow has been started. If not, we create a new thread to run the `initiate_chat()` function to deliver the users’ initial query to start the workflow. Here we just simply kick off the crew by calling `MyCrew().crew()` and its `.kickoff()` method, which is imported from our modified `crew.py` file. The reason why we use a thread is that the `kickoff()` method will block the panel’s UI updating process, including further user inputs and callbacks, so we need to run it in a separate thread to avoid blocking it. If the crew’s workflow has already started, we can assume that the user’s input is a feedback message for the ongoing workflow, and we will update the `user_input` variable with the new message string. Then, register the callback function to the `chat_interface` object.

Until now, the message output of the tasks has been implemented, and it’s time to allow user input for the ongoing workflow.

Here is the code snippet:


```python
from crewai.agents.agent_builder.base_agent_executor_mixin import CrewAgentExecutorMixin
import time

def custom_ask_human_input(self, final_answer: dict) -> str:
      
    global user_input

    chat_interface.send(final_answer, user="Assistant", respond=False)

    prompt = "Please provide feedback on the Final Result and the Agent's actions: "
    chat_interface.send(prompt, user="System", respond=False)

    while user_input == None:
        time.sleep(1)  

    human_comments = user_input
    user_input = None

    return human_comments


CrewAgentExecutorMixin._ask_human_input = custom_ask_human_input
```
In the CrewAI framework, there is no explicit API for redirecting the user input from the command line to the chat UI, so we have to do a “Monkey Patch” to the `CrewAgentExecutorMixin` class to override the default `ask_human_input()` method. In the custom function, we send the interim outputs back to the chat UI, plus the prompt message that asks for the user’s feedback, and wait for the user’s input. Once received, it returns the feedback message, and `CrewAgentExecutorMixin` will continue to process with it.

The logic design has been completed, and then we can add the snippet for the Panel server at the end of the code:


```python
## Send welcome message
chat_interface.send(
    "Welcome! I'm your AI Research Assistant. What topic would you like me to research?",
    user="Assistant",
    respond=False
)

## Make it servable
chat_interface.servable()
```

### tasks.yaml

In this demo app, we will not modify the default definitions of agents or tasks because they are all domain\-specific designs in your own program. Therefore, we only need to add one line in the task definition to notify the reporting agent to ask for the user’s feedback.


```python
reporting_task:
  description: >
    ...
    Ask user input for more information if needed. 
...
```

## Run the app

Before running the app, make sure you have moved to the `my_crew/` directory and run the below command to install `my_crew` as a package importable from anywhere:


```python
cd my_crew
pip install -e .
```
Everything is ready, and now we can run the web app by executing the command:


```python
panel serve src/my_crew/main.py
```
After seeing the message from the terminal `Bokeh app running at [http://localhost:5006](http://localhost:5006`,)`[,](http://localhost:5006`,) you can open your web browser and navigate to the URL to see the web app.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*dcVLg6elvNQ4bz47bsWQ7A.png)

Input your desired topic, such as “LLM,” and click the “Send” button to start the workflow. The two agents will then generate the research and report it sequentially.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*77P4xDhJNXzNTrFdAdX9OQ.png)

When the prompt message shows, you can input additional directions, such as “Add subtitle for each title,” and click the “Send” button again to continue the workflow. Finally, the report with subtitles will be displayed.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*8wN_pNa6x9JDyMS1hiQN4g.png)

In conclusion, the whole idea of adding web UI to CrewAI is to register the callback for output and find and replace the default human input function with the UI input function. As a popular open\-source project, CrewAI is still under active development, and the architecture is expected to change more or less in the future, so I will keep looking at the latest version and update the tutorial as needed.

Thanks for reading. If you think it’s helpful, please Clap 👏 for this article. Your encouragement and comments mean a lot to me, mentally and financially. 🍔

**Before you go:**

✍️ If you have any questions, please leave me responses or find me on [**X**](https://twitter.com/Yeyu2HUANG/)and [**Discord**](https://discord.gg/KPTCE4CEmp), where you can have my active support on development and deployment.

☕️ If you want exclusive resources and technical services, subscribing to the services on my **[Ko\-fi](https://ko-fi.com/yeyuh)** will be a good choice.

💯 **I am also open to being hired for any innovative and full\-stack development jobs.**


