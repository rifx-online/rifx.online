---
title: "Creating a Research Agent with AutoGen and Panel UI"
meta_title: "Creating a Research Agent with AutoGen and Panel UI"
description: "The article outlines the process of creating a research agent using AutoGen and Panel UI, emphasizing the benefits of automating research workflows. It highlights how these agents can enhance productivity, facilitate AI-human collaboration, and streamline research processes. The setup requires Python, AutoGen, Panel UI, and LLM models. A step-by-step guide is provided, detailing the environment setup, code implementation, and agent roles, culminating in a collaborative chat interface for efficient task management. Applications include academic research, business intelligence, and data engineering."
date: 2025-01-05T02:25:48Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*5cBKU3bQYrKt4YnsdX_kFw.png"
categories: ["Programming", "Machine Learning", "Data Science"]
author: "Rifx.Online"
tags: ["AutoGen", "Panel", "LLM", "productivity", "collaboration"]
draft: False

---







### Stuck behind a paywall? Read for Free!

🎉 Happy New Year, everyone! Before diving in, a huge THANK YOU for all your support and feedback on our previous stories — it means the world! 🙌 Now, let’s start the year with a interesting project. In the world of AI and data science, crafting intelligent and dynamic agents can be a game\-changer for automating research workflows. Leveraging **AutoGen** and **Panel UI**, you can build a research agent that collaborates with multiple sub\-agents, each designed for specific tasks like coding, planning, or critiquing. ✨ Let’s dive into how you can set up a multi\-agent system with a sleek and interactive user interface.


## What Makes This Research Agent Interesting?

Imagine delegating repetitive tasks, planning complex workflows, or critiquing research processes to AI agents. Here’s why building such an agent stands out:

* **It Boosts Productivity**: By automating mundane tasks, you can focus on higher\-order thinking.
* **Fosters AI\-Human Collaboration**: Each agent plays a distinct role, blending machine efficiency with human creativity.
* **Streamlines Research Pipelines**: Offers structured, reproducible methods, making complex research manageable and efficient.


## What You Will Need

* **Python 3\.9\+**
* **AutoGen**: A library for creating and managing AI agents.
* **Panel UI**: For building a responsive and interactive frontend.
* **LLM Models**: Such as OpenAI or a locally hosted model like Llama.
* Basic knowledge of Python and machine learning concepts.


## if you like this article and want to show some love:

* **Clap** 50 times — each one helps more than you think! 👏
* **Follow** me here on [**Medium**](https://medium.com/@mauryaanoop3) and subscribe for free to catch my latest posts. 🫶
* Let’s connect on [**LinkedIn**](https://medium.com/towards-artificial-intelligence/www.linkedin.com/in/anoop-maurya-908499148), check out my projects on [**GitHub**](https://github.com/imanoop7), and stay in touch on [**Twitter**](https://x.com/imanoop_7)!
* If you found this project useful, don’t forget to ⭐ the repo on [**GitHub**](https://github.com/imanoop7/AutoGen-notebooks). It helps others find it too!


## Setting Up the Environment

First, create a new Python environment to keep your dependencies isolated. You can use Conda or Python’s `venv` module:

**Using Conda:**


```python
conda create -n research_agent_env python=3.9 -y
conda activate research_agent_env
```
**Using venv:**


```python
python -m venv research_agent_env
source research_agent_env/bin/activate  
## On Windows: research_agent_env\Scripts\activate
```
Then, install the required libraries:


```python
pip install autogen panel 
```

## Code Walkthrough

Here’s a step\-by\-step guide to create your research agent:


### 1\. Import Libraries and Configure LLM


```python
import autogen
import panel as pn

## Configuration for the LLM model
model_configurations = [
    {
        "model": "llama3.2",
        "base_url": "http://localhost:11434/v1",
        'api_key': 'ollama',
    },
]

llm_settings = {"config_list": model_configurations, "temperature": 0, "seed": 53}
```
Here, the `config_list` defines the connection details for your LLM, including the model, base URL, and API key.


### 2\. Define AI Agents

Each agent has a distinct role. For example:

* **Admin**: Oversees the workflow and approves tasks.
* **Engineer**: Writes and debugs code.
* **Scientist**: Analyzes research data.
* **Planner**: Outlines actionable plans.
* **Executor**: Executes code.
* **Critic**: Evaluates plans and outputs.


```python
## Define the UserProxyAgent (Admin)
admin_agent = autogen.UserProxyAgent(
    name="Admin",
    is_termination_msg=lambda x: x.get("content", "").rstrip().endswith("exit"),
    system_message="""A human admin. Interact with the planner to discuss the plan. Plan execution needs to be approved by this admin. 
    Only say APPROVED in most cases, and say EXIT when nothing to be done further. Do not say others.""",
    code_execution_config=False,
    default_auto_reply="Approved",
    human_input_mode="NEVER",
    llm_config=llm_settings,
)

## Define the AssistantAgent (Engineer)
engineer_agent = autogen.AssistantAgent(
    name="Engineer",
    llm_config=llm_settings,
    system_message='''Engineer. You follow an approved plan. You write python/shell code to solve tasks. Wrap the code in a code block that specifies the script type. The user can't modify your code. So do not suggest incomplete code which requires others to modify. Don't use a code block if it's not intended to be executed by the executor.
    Don't include multiple code blocks in one response. Do not ask others to copy and paste the result. Check the execution result returned by the executor.
    If the result indicates there is an error, fix the error and output the code again. Suggest the full code instead of partial code or code changes. If the error can't be fixed or if the task is not solved even after the code is executed successfully, analyze the problem, revisit your assumption, collect additional info you need, and think of a different approach to try.
    ''',
)

## Define the AssistantAgent (Scientist)
scientist_agent = autogen.AssistantAgent(
    name="Scientist",
    llm_config=llm_settings,
    system_message="""Scientist. You follow an approved plan. You are able to categorize papers after seeing their abstracts printed. You don't write code."""
)

## Define the AssistantAgent (Planner)
planner_agent = autogen.AssistantAgent(
    name="Planner",
    system_message='''Planner. Suggest a plan. Revise the plan based on feedback from admin and critic, until admin approval.
    The plan may involve an engineer who can write code and a scientist who doesn't write code.
    Explain the plan first. Be clear which step is performed by an engineer, and which step is performed by a scientist.
    ''',
    llm_config=llm_settings,
)

## Define the UserProxyAgent (Executor)
executor_agent = autogen.UserProxyAgent(
    name="Executor",
    system_message="Executor. Execute the code written by the engineer and report the result.",
    human_input_mode="NEVER",
    code_execution_config={"last_n_messages": 3, "work_dir": "paper"},
)

## Define the AssistantAgent (Critic)
critic_agent = autogen.AssistantAgent(
    name="Critic",
    system_message="Critic. Double check plan, claims, code from other agents and provide feedback. Check whether the plan includes adding verifiable info such as source URL.",
    llm_config=llm_settings,
)
```

> **Note:** I am running all the codes generated by agents in Docker container and will suggest you the same and it will require Docker Desktop running in your system.


### Create Group Chat for Collaboration

Link all agents in a collaborative chat interface:


```python
## Create a GroupChat with all agents
group_chat = autogen.GroupChat(agents=[admin_agent, engineer_agent, scientist_agent, planner_agent, executor_agent, critic_agent], messages=[], max_round=50)
chat_manager = autogen.GroupChatManager(groupchat=group_chat, llm_config=llm_settings)
```

### Set Up Panel UI and Reply Handler:


```python
def print_messages(recipient, messages, sender, config):
    """
    Prints and sends the latest message from the sender to the recipient using the chat interface.
    Args:
        recipient (object): The recipient object containing recipient details.
        messages (list): A list of message dictionaries, where each dictionary contains message details.
        sender (object): The sender object containing sender details.
        config (dict): Configuration dictionary for additional settings.
    Returns:
        tuple: A tuple containing a boolean and None. The boolean is always False to ensure the agent communication flow continues.
    Notes:
        - The function prints the details of the latest message.
        - If the latest message contains the key 'name', it sends the message using the name and avatar from the message.
        - If the 'name' key is missing, it sends the message using a default user 'SecretGuy' and a ninja avatar.
    """
    print(f"Messages from: {sender.name} sent to: {recipient.name} | num messages: {len(messages)} | message: {messages[-1]}")
    
    if all(key in messages[-1] for key in ['name']):
        chat_interface.send(messages[-1]['content'], user=messages[-1]['name'], avatar=agent_avatars[messages[-1]['name']], respond=False)
    else:
        chat_interface.send(messages[-1]['content'], user='SecretGuy', avatar='🥷', respond=False)

    return False, None  # required to ensure the agent communication flow continues
```

```python
## Register the print_messages function as a reply handler for each agent
admin_agent.register_reply(
    [autogen.Agent, None],
    reply_func=print_messages, 
    config={"callback": None},
)

engineer_agent.register_reply(
    [autogen.Agent, None],
    reply_func=print_messages, 
    config={"callback": None},
) 
scientist_agent.register_reply(
    [autogen.Agent, None],
    reply_func=print_messages, 
    config={"callback": None},
) 
planner_agent.register_reply(
    [autogen.Agent, None],
    reply_func=print_messages, 
    config={"callback": None},
)

executor_agent.register_reply(
    [autogen.Agent, None],
    reply_func=print_messages, 
    config={"callback": None},
) 
critic_agent.register_reply(
    [autogen.Agent, None],
    reply_func=print_messages, 
    config={"callback": None},
) 
```

```python
## Initialize Panel extension with material design
pn.extension(design="material")

def callback(contents: str, user: str, instance: pn.chat.ChatInterface):
    # Initiate chat with the admin_agent
    admin_agent.initiate_chat(chat_manager, message=contents)

## Create a chat interface and send an initial message
chat_interface = pn.chat.ChatInterface(callback=callback)
chat_interface.send("Send a message!", user="System", respond=False)
chat_interface.servable()
```

## Bringing It All Together

Once the setup is complete, your research agent is ready to handle workflows. The system distributes tasks to the appropriate agents, ensuring:

* **Seamless task execution.**
* **Thorough plan critique and optimization.**
* **Efficient research output.**


## Run the Setup:


```python
panel serve .\autogen_panel_example.py
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*KBs8zZC3rMT7enIbcMoJLA.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*onsQ5PVBYs4p3mYnDoiHmQ.png)


## Applications of This Setup

* **Academic Research**: Automating literature reviews and coding experiments.
* **Business Intelligence**: Analyzing reports and generating insights.
* **Data Engineering**: Debugging pipelines and handling large datasets.


## Final Thoughts

As we step into a brand\-new year, here’s to embracing innovation and creativity! With tools like AutoGen and Panel UI, building AI systems becomes both approachable and powerful. This architecture not only streamlines workflows but also fosters meaningful collaboration between humans and AI agents. We are excited to see how these tools transform your research journeys in 2025\. 🚀

Thank you for reading, and a heartfelt Happy New Year to everyone! Wishing you prosperity, happiness, and success in all your endeavors. 🌟


## Additional Resource:

**Complete Code:**[https://github.com/imanoop7/AutoGen\-notebooks](https://github.com/imanoop7/AutoGen-notebooks)**AutogenOfficial GitHub:**<https://github.com/microsoft/autogen>**Autogen Official Page:**[https://microsoft.github.io/autogen/docs/Getting\-Started/](https://microsoft.github.io/autogen/docs/Getting-Started/)**My GitHub:** <https://github.com/imanoop7>**LinkedIn:** [www.linkedin.com/in/anoop\-maurya\-908499148](http://www.linkedin.com/in/anoop-maurya-908499148)**X:** <https://x.com/imanoop_7>


