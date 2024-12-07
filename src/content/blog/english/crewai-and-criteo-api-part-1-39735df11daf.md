---
title: "CrewAI and Criteo API — Part 1"
meta_title: "CrewAI and Criteo API — Part 1"
description: "This article introduces the integration of CrewAI and Criteo APIs, focusing on obtaining credentials, accessing an Access Token, and retrieving information about Accounts, Retailers, and Brands using AI Agents. It outlines the prerequisites, including setting up a developer account and environment, and provides a step-by-step guide on creating CrewAI tools, agents, and tasks. The article emphasizes the collaboration of AI agents to enhance media campaign performance through Criteos Retail Media API, culminating in the execution of tasks and output generation. Future articles will build upon this foundational knowledge."
date: 2024-12-07T12:30:39Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*bkE8a9yFkP-I5zjScUbOXA.png"
categories: ["Programming", "Technology", "Machine Learning"]
author: "Rifx.Online"
tags: ["CrewAI", "Criteo", "API", "Access", "Token"]
draft: False

---







## Introduction

This article is the first in a series showing how to use CrewAI and Criteo APIs. We will see how to obtain credentials, use those credentials to get an Access Token and use the token call endpoints to get Accounts, Retailers, and Brands, all from a CrewAI crew.


> ***CrewAI*** *is a* “cutting\-edge framework for orchestrating role\-playing autonomous AI agents. By fostering collaborative intelligence, CrewAI empowers agents to work together seamlessly and tackle complex tasks.”


> ***Criteo Retail Media API*** unlocks various possibilities to enhance media campaign performance from any platform. It allows you to create, launch, and monitor online marketing campaigns and provides a comprehensive view of their performance.


> **CrewAI** and **Retail Media** togetner unlocks the power of AI and the power of Commerce Meda


### Purpose

Using CrewAI, you will become familiar with Criteo’s Retail Media APIs and how to use them as tools for large language models (LLMs), AI Agents, etc.

For more detailed articles and videos on large language models (LLMs), AI Agents, and CrewAI, see my favourite authors listed at the end of this article. ([Sam Witteveen](https://www.linkedin.com/in/samwitteveen/) and [Brandon Hancock](https://www.linkedin.com/in/brandon-hancock-2925bb125/)**)**


## Overview

We aim to use a crew of AI Agents and Tasks to retrieve Accounts, Retailers and Brands for Retail Media APIs and perform *rudimentary* analytics. We will get a developer account at Criteo, create [**Tools**](https://docs.crewai.com/core-concepts/Tools/) to access the APIs, build an [**Agent**](https://docs.crewai.com/core-concepts/Agents/) that uses the tools and specify [**Tasks**](https://docs.crewai.com/core-concepts/Tasks/) that will be executed sequentially by the [**Crew**](https://docs.crewai.com/core-concepts/Crews/).

All the code for this article is in Python and uses poetry as the package manager/environment manager.


## Prerequisites

You will need to install the following to run the code examples:

* Python 3\.12 <https://www.python.org/downloads/>
* Pipx <https://pipx.pypa.io/stable/installation/>
* Poetry [https://python\-poetry.org/docs/](https://python-poetry.org/docs/)
* Developer account and credentials at Criteo
* [Groq Cloud account](https://groq.com/community/) and API key or an Azure OpenAI instance and credentials


## Step\-by\-Step Guide


### Step 1: Criteo Developer Account, Credentials and Authentication

To use the Criteo APIs, you need a [developer account](https://developers.criteo.com/retail-media/docs/create-your-developer-account) created in the [Developer Portal](https://developers.criteo.com/) by clicking the ‘Get started’ button.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*oYvaKkrHClDx0VqRJij7cg.jpeg)

This will take you to the Criteo partners dashboard. Click on ‘create a new app’ (you can see my application already defined)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*uIp2LljRn--AAtCj4FUDWg.jpeg)

You will need consent to data provided by the APIs; follow the prompts to be authorised.

Once you have consent, click ‘create a new key’ to create credentials for your application.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Wp9mYad3GkWRJpR9symR1Q.jpeg)

A file containing the credentials is automatically downloaded to your local matching. You will use these credentials to obtain an access token for each API call.

\# Here is an example:


```python
---------------------------
| Criteo Developer Portal |
---------------------------


Please store your client secret carefully on your side.
You will need it to connect to the API and this is the only time we will be able to communicate it to you.
You can find more information on our API Documentation at https://developers.criteo.com.


application_id: <application id>
client_id: <client id>
client_secret: <client secret here>
allowed_grant_types: client_credentials
```
**Tips**: Keep your credentials secret. Don’t commit them to a public repository (GitHub, GitLab, etc).

Authentication with client credentials results in an AccessToken that is valid (at the time of writing) for about 15 minutes. Call the Criteo authentication API for a valid token using your client credentials.

The following code snippet is a function that retrieves an AccessToken using client credentials and caches it for 15 minutes.







Lines 15–16 retrieve the client ID and secret from environment variables (.env)

Line 17 defines the headers, specifically the `content-type` of `application/x-www-form-urlencoded`. This header value is quite important.

Lines 18–22 set up the data containing your credentials.

Line 23 executes a post request to get an access token, and line 26 returns a structure containing the token, the token type, and an expiration time of seconds.

Example auth result as JSON:


```python
{
  "access_token": "eyJhbGciOiJSUzII ... pG5LGeb4aiuB0EKAhszojHQ",
  "token_type": "Bearer",
  "refresh_token": None,
  "expires_in": 900
}
```
The rest of the code caches the result until the token expires.


### Step 2: CrewAI environment setup

Clone the [repository](https://github.com/helipilot50/criteo-retail-media-crew-ai.git) and change the directory to `part_1`. The code used in this article is in this directory. Already defined is a poetry project in the file: `pyproject.toml`

Run these commands in a terminal to install the dependencies, create/update the poetry environment and jump into the correct shell.


```python
poetry install --no-root
poetry shell
```
**VS Code:**

If you use VSCode, check that it uses the correct virtual environment. To set the Python interpreter to your virtual environment. Get the path with this command


```python
poetry env info --path
/Users/petermilne/Library/Caches/pypoetry/virtualenvs/part-1-qwAxeBFF-py3.12
```
and copy the path.

Then click on the ‘Python ….’ in the bottom right\-hand corner of vs code.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*QdW_Y7LY05Hyfoua1mUZ6A.png)

Choose: Enter interpreter path

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*coc0QTdWo4zOgqjta8cJCg.png)

and paste the path


### Environment Variables .env

You will need to create a `.env`file similar to this:


```python
CRITEO_CLIENT_ID=<your client id>
CRITEO_CLIENT_SECRET=<your client secret>
RETAIL_MEDIA_API_URL=https://api.criteo.com/2024-07/retail-media/

## only if you use Azure
AZURE_OPENAI_API_KEY=
AZURE_OPENAI_ENDPOINT=
AZURE_OPENAI_CHAT_DEPLOYMENT_NAME=
OPENAI_API_VERSION=2024-02-15-preview

## only if you use Groq
GROQ_API_KEY=<your groq api key>
GROQ_AI_MODEL_NAME=llama-3.1-70b-versatile
```
Tip: Criteo APIs are versioned by date, e.g. `2024–07`, be sure to use the current API version.


### Groq or Azure OpenAI, and why not OpenAI?

Groq Cloud is a fast and inexpensive LLM service using new technology that is *“powered by the Groq LPU and available as public, private, and co\-cloud instances, GroqCloud redefines real\-time.”* It is free for developers and a great way to start with LLMs

Azure OpenAI is a private instance of an LLM service. What does “private” mean? This ensures OpenAI does not use the proprietary data you pass into the LLM to train its future models. i.e., the data from your API calls does not become part of the public domain!

**Tips**:

If your poetry environment is not running in the terminal, check you are in the correct directory/folder, then run:


```python
poetry install --no-root
poetry shell
```

### Step 3: CrewAI Tools using APIs


> A tool in CrewAI is a skill or function that agents can utilize to perform various actions. This includes tools from the [crewAI Toolkit](https://github.com/joaomdmoura/crewai-tools) and [LangChain Tools](https://python.langchain.com/docs/integrations/tools), enabling everything from simple searches to complex interactions and effective teamwork among agents.

[https://docs.crewai.com/core\-concepts/Tools/](https://docs.crewai.com/core-concepts/Tools/)

Our first task is to create CrewAI Tools to call the Retail Media REST APIs. We will create three simple tools to retrieve:

* A list of Accounts accessible to the current user (user credentials)
* A list of Brands for the accounts
* A list of Retailers for the accounts

Each tool will use the equivalent REST API endpoint(see: [https://developers.criteo.com/retail\-media/docs/account\-endpoints](https://developers.criteo.com/retail-media/docs/account-endpoints))

Let’s discuss one of these tools: **RetailersTool**







Here, we have defined a class named `RetailersTool`that implements the tool, subclassing the `BaseTool` from `crewai_tool`.

Lines 26–32 code the `_run` method implements the call to the Retail Media API and is invoked by the agents using the tool. You can see the parameters of `accountId`, `pageIndex` and `pageSize`passed to the REST call. The response is the response body, which is JSON.


### Step 4: Agents


> An agent in CrewAI is an **autonomous unit** programmed to Perform tasks, Make decisions and Communicate with other agents. Think of an agent as a member of a team with specific skills and a particular job to do. Agents can have different roles, such as ‘Researcher’, ‘Writer’, or ‘Customer Support’, each contributing to the crew's overall goal.

[https://docs.crewai.com/core\-concepts/Agents/](https://docs.crewai.com/core-concepts/Agents/)

You can think of an agent as the embodiment of a Persona, but you can think of it as a chunk of intelligent processing.

You can define agents entirely in code or in a `yaml` file with a little code in the crew. Using a `yaml` file encourages the [**separation of concerns**](https://readmedium.com/fundamental-software-architecture-principles-separation-of-concerns-modularity-and-abstraction-856c5a5bdaf0) and allows non\-programmers to define agents’ properties.

Here, we define the agent `account_manager` properties in `config/agents.yaml` and the agent code in `crew.py`

**Yaml snippet: agents.yaml**


```python
account_manager:
  role: >
    Account manager
  goal: >
    Provide lists of accounts, retailers and brands
  backstory: >
    You're an expert in managing accounts and retrieving information about accounts, retailers, and brands. 
    You're known for your ability to provide accurate and up-to-date information to help your team make informed decisions.
    You use the Retail Media REST API efficiently by choosing the correct API and making the right number of requests.
    Remember the results of the accounts, retailers, and brands to avoid making unnecessary request

  verbose: True
  cache: True
```
The agent is designed with three key elements: **role**, **goal**, and **backstory**.

**Role**: This defines the agent’s job within the crew. In this case, the role is simply Account Manager

**Goal**: This specifies what the agent aims to achieve. The goal is aligned with the agent’s role and the overall objectives of the crew. Here, the goal is to provide a list of accounts, retailers and brands

**Backstory**: This provides depth to the agent’s persona, enriching its motivations and engagements within the crew. The backstory contextualises the agent’s role and goal, making interactions more meaningful. Here, the agent is an expert in managing accounts and has specific instructions on how to go about its responsibilities.

The LLM uses these properties as part of the prompt to configure its behaviour and core competencies.

**Code snippet: crew.py**


```python
    """
    Account manager agent instance created from the config file.
    The function is decorated with the @agent decorator to indicate that it is an agent.
    """

    @agent
    def account_manager(self) -> Agent:
        return Agent(
            config=self.agents_config["account_manager"]
            llm=llm, # if you use Azure OpenAI or Groq
        )
```
The actual code loads the properties from the YAML file and sets theLLM (if you are using Groq or Azure)


### Step 5: Tasks


> In the crewAI framework, tasks are specific assignments completed by agents. They provide all necessary details for execution, such as a description, the agent responsible, required tools, and more, facilitating a wide range of action complexities.


> Tasks within crewAI can be collaborative, requiring multiple agents to work together. This is managed through the task properties and orchestrated by the Crew’s process, enhancing teamwork and efficiency.

[https://docs.crewai.com/core\-concepts/Tasks/](https://docs.crewai.com/core-concepts/Tasks/)

In this example, we have three tasks:

* **accounts**: Retrieve Accounts data and produce a Markdown file.
* **brands**: Retrieve Brands data for a specific Account and produce a Markdown file.
* **retailers**: retrieve Retailers data for a specific Account and produce a Markdown file.

Similar to Agents, you can define tasks entirely in code or in a `yaml` file with a little code in the crew. Similarly, using a `yaml` file encourages the [**separation of concerns**](https://readmedium.com/fundamental-software-architecture-principles-separation-of-concerns-modularity-and-abstraction-856c5a5bdaf0) and allows non\-programmers to define task properties.

Here, we define the task `brands` properties in `config/tasks.yaml` and the task code in `crew.py`


```python
brands:
  description: >
    Iterate through the {accounts list}, and for each {account} retrieve the Retail Media brands. Use the {account id} to get the brands.
  expected_output: >
    A list of brands for the account formatted as a table in Markdown. Here is an example of the expected output:
    | Brand ID | Brand Name | 
  agent: account_manager
  context:
    - accounts
```
A task typically includes the following properties:

**Description**: This is a detailed explanation of what the task entails. It provides the purpose and the steps needed to complete the task. Here, the `brands` task is instructed to retrieve the Brands for each Account.

**Expected Output**: This defines the desired outcome of the task. It should be clear and specific. In this example, the output is a markdown table *with an example.*

**Agent**: This refers to the entity responsible for executing the task. It could be a specific person, a team, or an automated system. Here, the task is to be done by the `account_manager`agent.

**Context**: This includes any additional information or data that provides background or input for the task. It helps understand the environment or conditions under which the task should be performed. The `brands`task needs input from the results of `accounts`

**Code snippet: crew.py**


```python
    """
    Brands task instance created from the config file.
    This function is decorated with the @agent decorator to indicate that it is an agent.
    It's job is to retrieve Brands data for a specific Account and produce a Markdown file.
    """

    @task
    def brands(self) -> Task:
        return Task(
            config=self.tasks_config["brands"],
            output_file="output/brands.md",
            asynch=True,
            context=[self.accounts()],
            tools=[
                BrandsTool(),
            ],
        )
```
Similar to the agent configurations, the code for the tasks loads properties from the `tasks.yaml` file. In this example, you see that the output of the task is written to the file: `output/brands.md`.

Note that we have been explicit in the tool to be used to accomplish this task: `BrandsTool()` This enables the agent performing the task to be more focused and less confused.


### Step 6: The Crew


> A crew in crewAI represents a collaborative group of agents working together to achieve a set of tasks. Each crew defines the strategy for task execution, agent collaboration, and the overall workflow.

[https://docs.crewai.com/core\-concepts/Crews/](https://docs.crewai.com/core-concepts/Crews/)

The crew is the fabric that stitches everything together. It creates instances of the Agents, Tasks, and Tools and specifies the crew's execution details. This is where the “rubber meets the road”.


### Code Snippet: crew.py








### Creating the LLM

Lines 10\- 24 create the LLM used by the Agent. Here, you can create the LLM from Groq or Azure OpenAI, or, as we will see in later articles, you can use both for different agents on your crew.


### Creating the Crew

The class Part1Crew is defined by lines 27–82 (note: some lines are omitted for brevity; complete code at: [https://github.com/helipilot50/criteo\-retail\-media\-crew\-ai/blob/main/part\_1/src/part\_1/crew.py](https://github.com/helipilot50/criteo-retail-media-crew-ai/blob/main/part_1/src/part_1/crew.py))

Lines 73–82 define the crew as a function/method in the class.The process is sequential, meaning the tasks will be executed in the order they are defined. We have set the verbose flag to true to see a verbose log of activity in the file: `output/part_1.log`


### Step 7 Running the Crew

To run the crew, enter the following command in the terminal.


```python
crewai run
```
Ensure that you are using the correct Poetry environment. Many frustrating hours, grey hairs, and expletives can be avoided if you check the environment:


```python
poetry env info
```
Each task will output its results to a file; these are:

* **accounts**: `output/accounts.md`
* **brands**: `output/brands.md`
* **retailers**: `output/retailers.md`

Here is a sample of the output for Retailers:


```python
| Retailer ID | Retailer Name | Campaign Eligibilities |
|-------------|---------------|------------------------|
| 314159      | Marysons      | auction, preferred     |
                        ...
| 398687      | Office Stuff  | auction, preferred     |
| 873908      | GAI Group     | auction, preferred     |
```

## Conclusion

**Summary**: We have seen how to use Retail Media APIs as tools used by Agents and Tasks in CrewAI. This is quite a simple example of how to walk through the setup and “plumbing” to connect these technologies.

**Next Steps**: If you haven't already done so, watch the videos by Sam and Brandon. And soon, this series will have a “Part 2”.

[Code in GitHub](https://github.com/helipilot50/criteo-retail-media-crew-ai/tree/main/part_1)


## Additional Resources


### Related Articles:


### Links:

* **CrewAI** <https://docs.crewai.com/>
* **Groq** <https://groq.com/>
* **Criteo Retail Media APIs** [https://developers.criteo.com/retail\-media/docs/welcome\-to\-criteo](https://developers.criteo.com/retail-media/docs/welcome-to-criteo)
* **Source code** [https://github.com/helipilot50/criteo\-retail\-media\-crew\-ai](https://github.com/helipilot50/criteo-retail-media-crew-ai)


### Favourite Authors:

**Sam Witteveen** — CEO \& Co\-Founder @ Red Dragon AI / Google Developer Expert for Machine Learning — Publications NeurIPS, EMNLP

* Youtube: <https://www.youtube.com/@samwitteveenai>
* LinkedIn: <https://www.linkedin.com/in/samwitteveen/>













**Brandon Hancock** — CrewAI Senior Software Engineer \| Content Creator on YouTube

* YouTube: <https://www.youtube.com/@bhancock_ai>
* LinkedIn: [https://www.linkedin.com/in/brandon\-hancock\-2925bb125/](https://www.linkedin.com/in/brandon-hancock-2925bb125/)
* Website: <https://brandonhancock.io/>














