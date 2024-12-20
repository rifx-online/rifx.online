---
title: "AutoGen: An Agentic Open-Source Framework for Intelligent Automation"
meta_title: "AutoGen: An Agentic Open-Source Framework for Intelligent Automation"
description: "AutoGen is an open-source framework developed by Microsoft for creating intelligent agents that collaborate through conversational patterns to perform tasks. It supports the integration of multiple large language models (LLMs) and tools, allowing for customizable, conversable agents. The framework facilitates both local development and deployment in cloud environments, enabling efficient AI workflows. Key features include conversation programming, flexible agent roles, and a standardized interface for message exchanges. AutoGen Studio offers a low-code solution for building multi-agent workflows, distinguishing itself from other frameworks like LangChain by emphasizing collaborative agent interactions. Future plans include enhancing agent capabilities and exploring more complex scenarios."
date: 2024-12-19T22:17:28Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*0QU43GSq6Om2x4T5gu0rog.png"
categories: ["Programming", "Machine Learning", "Chatbots"]
author: "Rifx.Online"
tags: ["AutoGen", "conversational", "agents", "LLMs", "cloud"]
draft: False

---




AutoGen is an open\-source framework from Microsoft for building agents that can collaborate through converstaional patterns to accomplish tasks. AutoGen streamlines AI development and research, enabling the use of multiple large language models (LLMs), integrated tools, and advanced multi\-agent design patterns. You can develop and test your agent systems locally, then deploy to a distributed cloud environment as your needs grow.



This framework allows developers to build LLM applications via multiple agents that can converse with each other to accomplish tasks. AutoGen agents are customizable, conversable, and can operate in various modes that employ combinations of LLMs, human inputs, and tools. Using AutoGen, developers can also flexibly define agent interaction behaviors. Both natural language and computer code can be used to program flexible conversation patterns for different applications. AutoGen serves as a generic infrastructure to build diverse applications of various complexities and LLM capacities. Empirical studies demonstrate the effectiveness of the framework in many example applications, with domains ranging from mathematics, coding, question answering, operations research, online decision\-making, entertainment, etc. You can think of this application as ***ChatGPT \+ Code Interpreter \+ Plugins \+ Fully Customizable.***

The features this framework mainly has :

**Conversable agents:**

* A design of agents that can use LLMs, human input, tools, or a combination of these to create agents with different roles.
* They are basically play a role of conversable — Entity with a specific role that can pass messages to send and receive information to and from other conversable agents . e.g., to start or continue a conversation.
* Also they are customizable i.e., each agent can be configured based on application\-specific needs to display complex behavior in multi\-agent conversations, using a mix of basic back\-end types.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*YKozzXQ20ruZtVIRsiV2WA.png)

**Conversation Programming:**

* Programming paradigm centered around inter\-agent conversations
* Paradigm that blends computation and control flow within multi\-agent conversations.
* Merges programming and natural language control.
* **Computation:** Role\-specific, conversation\-centric actions.
* **Control Flow:** Defined by conversation dynamics among agents.
* **Efficiency:** Streamlines AI development for various skill levels.

AutoGen has its design pattern with a unified interfaces where it showcases standardized interfaces for agent interactions. It also has a Auto\-reply mechanism for continuous converstaion flow. Also supports with Dynamic conversations which supports static and dynamic flows. It provides customizable reply functions for adaptive conversations.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*9KXxw8Q0MdqH1JZeWktoAQ.png)

Now let us see how we can build a simple agent.


## Build a Simple Agent with Autogen

**Install Packages**:


```python
!pip install pyautogen
```

```python
from autogen import AssistantAgent, UserProxyAgent, config_list_from_json, GroupChat, GroupChatManager
## Load LLM inference endpoints from an env variable or a file
## See https://microsoft.github.io/autogen/docs/FAQ#set-your-api-endpoints
config_list = config_list_from_json(env_or_file="OAI_CONFIG_LIST", filter_dict={"model" : "gpt-4o-mini"})
```
sample or example on how you can create is “OAI\_CONFIG\_LIST”

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*QhguIWb9F65WetJRhGsAAQ.png)

**AssistantAgent Creation**:


```python
assistant = autogen.AssistantAgent(
    name="assistant",
    llm_config={
        "seed": 42,  # seed for caching and reproducibility
        "config_list": config_list,  # a list of OpenAI API configurations
        "temperature": 0,  # temperature for sampling
    },
)
```
Creates an AI assistant agent

* **name**: Identifies the agent as "assistant"
* **llm\_config :** Configuration for the language model:
* **seed:** Set to 42 for reproducible results
* **config\_list :** Contains OpenAI API settings (from previous configuration)
* **temperature :** Set to 0 for most deterministic/focused responses

**UserProxyAgent Creation**:


```python
user_proxy = autogen.UserProxyAgent(
    name="user_proxy",
    human_input_mode="NEVER",
    max_consecutive_auto_reply=10,
    is_termination_msg=lambda x: x.get("content", "").rstrip().endswith("TERMINATE"),
    code_execution_config={
        "work_dir": "coding",
        "use_docker": False,
    },
)
```
Creates a proxy agent that represents the user

* **name** : Identifies the agent as "user\_proxy"
* **human\_input\_mode\=”NEVER”**: Runs automatically without human intervention
* **max\_consecutive\_auto\_reply\=10:** Limits continuous exchanges to 10 messages
* **is\_termination\_msg:** A function that checks if a message should end the conversation (looks for “TERMINATE” at the end)
* **code\_execution\_config:** Settings for code execution:
* **work\_dir:** Directory where code will be executed (“coding”)
* **use\_docker:** Disabled (can be enabled for isolated code execution)

**Chat Initiation**:


```python
user_proxy.initiate_chat(
    assistant,
    message="""What date is today? Compare the year-to-date gain for META and TESLA."""
)
```
**Output:**

These are the files they generated at folder.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*lUs_AWxkS72xOBPJecAQdg.png)

The output in the terminal is shown below.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*-E-COgFvCMzI-e2e20F_jg.png)


## How to Build a Research Assistant with Autogen

Let us build a research agent. Here is the block diagram showing all the responsibilities for each of the agents.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*54e4pR_5Si2YiLeTOrIAMQ.png)

Lets us look at each and every query of agents.


### 1\. user\_proxy \= UserProxyAgent(…)

* **Purpose**: Represents a human admin who approves plans.
* **Attributes**:
* **name**: “Admin” — Identifies the role.
* **system\_message**: Describes the admin’s role in interacting with the planner.
* **code\_execution\_config**: Set to False, indicating this agent does not execute code.


```python
user_proxy = UserProxyAgent(
  name="Admin",
  system_message="A human admin. Interact with a planner to discuss the plan of execution. This plan needs to be approved by this admin.",
  code_execution_config=False
)
```

### 2\. planner \= AssistantAgent(…)

* **Purpose**: Suggests and revises plans based on feedback.
* **Attributes**:
* **name:** “Planner” — Identifies the role.
* **system\_message**: Describes the planner’s responsibilities, including involving engineers and scientists.
* **llm\_config**: Configuration for the language model, gpt4o\_config.


```python
planner = AssistantAgent(
  name='Planner',
  system_message='Planner. Suggest a plan. Revise the plan based on feedback from a critic agent.\
    The plan may involve an engineer who can write code and a scientist who doesn’t write code. \
    Explain the plan first. Be clear which step is performed by an engineer, and which step is performed by a scientist.',
  llm_config=gpt4o_config,

)
```

### 3\. engineer \= AssistantAgent(…)

* **Purpose**: Writes and executes code based on approved plans.
* **Attributes**:
* name: “Engineer” — Identifies the role.
* system\_message: Details the engineer’s tasks, including writing and debugging code.
* llm\_config: Configuration for the language model.


```python
engineer = AssistantAgent(
  name="Engineer",
  llm_config=gpt4o_config,
  system_message="""Engineer. You follow an approved plan. You write Python/shell code to solve tasks.\
    Wrap the code in a code block that specifies the script type. The user can't modify your code. Don't include multiple code blocks in one response. \
    Do not ask others to copy and paste the result. Check the execution result returned by the executor. \
    If the result indicates there is an error, fix the error and output the code again. Suggest the full code instead of partial code or code changes.\
    If the error can't be fixed or if the task is not solved even after the code is executed successfully, analyse the problem."""
)
```

### 4\. scientist \= AssistantAgent(…)

* **Purpose**: Analyzes research and categorizes papers.
* **Attributes**:
* **name:** “Scientist” — Identifies the role.
* **system\_message**: Describes the scientist’s role in categorizing papers and providing reports.
* **llm\_config**: Configuration for the language model.


```python
scientist = AssistantAgent(
  name="Scientist",
  llm_config=gpt4o_config,
  system_message="""Scientist. You follow an approved plan. You are able to categorize papers after seeing their abstracts printed. You don't write code.\
    you provided detailed resource  reports for the ResearchWriter to write comprehensive research reports."""
)
```

### 5\. executor \= UserProxyAgent(…)

* **Purpose**: Executes code written by the engineer.
* **Attributes**:
* **name:** “Executor” — Identifies the role.
* **system\_message:** Describes the executor’s task of running code.
* **human\_input\_mode:** Set to “NEVER”, indicating no human input is required.
* **code\_execution\_config:** Configuration for code execution, including message history and working directory.


```python
executor = UserProxyAgent(
  name="Executor",
  system_message="Executor. Execute the code written by the engineer and report the result.",
  human_input_mode="NEVER",
  code_execution_config={
      "last_n_messages": 3,
      "work_dir": "paper",
      "use_docker": False,
  }
  # Please set use_docker=True if docker is available to run the generated code. Using docker is safer than running the generated code directly.
)
```

### 6\. critic \= AssistantAgent(…)

* **Purpose**: Reviews and provides feedback on plans, code, and reports.
* **Attributes**:
* **name:** “Critic” — Identifies the role.
* **system\_message:** Describes the critic’s role in verifying information and providing feedback.
* **llm\_config:** Configuration for the language model.


```python
critic = AssistantAgent(
  name="Critic",
  system_message="Critic. Double check, claims, code and report from other agents and provide feedback. \
  Check whether the final research report includes adding verifiable info such as source ",
  llm_config=gpt4o_config,
)
```

### 7\. research\_report\_writer \= AssistantAgent(…)

* **Purpose**: Writes comprehensive research reports.
* **Attributes**:
* **name:** “ResearchWriter” — Identifies the role.
* **system\_message:** Details the report writing process, including sections and citation requirements.
* **llm\_config:** Configuration for the language model


```python
research_report_writer = AssistantAgent(
  name='ResearchWriter',
  system_message='Research Report Writer. Write a research report based on the findings from the papers categorized by the scientist and exchange with critic to improve \
  the quality of the report.\
  The report should include the following sections: Introduction, Literature Review, Methodology, Results, Conclusion, and References.\
  The report should be written in a clear and concise manner. Make sure to include proper citation and references.',
  llm_config=gpt4o_config
)
```

### 8\. groupchat \= GroupChat(…)

* **Purpose**: Initializes a group chat with various agents.
* **Attributes**:
* agents: A list of agents (user\_proxy, planner, engineer, scientist, executor, critic, research\_report\_writer) that participate in the chat.
* messages: An empty list \[] to store messages exchanged in the chat.
* max\_round: Set to 50, indicating the maximum number of interaction rounds allowed.


```python
groupchat = GroupChat(
  agents=[user_proxy, planner, engineer, scientist, executor, critic, research_report_writer],
  messages=[],
  max_round=50
)
```

### 9\. manager \= GroupChatManager(…)

* **Purpose**: Manages the group chat, coordinating interactions and ensuring smooth communication.
* **Attributes**:
* groupchat: The groupchat instance created above.
* llm\_config: Configuration for the language model, gpt4o\_config.


```python
manager = GroupChatManager(groupchat=groupchat, llm_config=gpt4o_config)
```
**Key Points:**

* **Agents**: Each agent has a specific role, contributing to tasks like planning, coding, executing, reviewing, and reporting.
* **Messages**: The chat system is designed to handle and store messages between agents.
* **Rounds**: Limits the number of interactions to ensure efficiency and prevent endless loops.


```python
output_report = user_proxy.initiate_chat(manager, message = "Write a 4 paragraph research report about how to use LLMs to enhance personal productivity?")
```
The output snapshots

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*0IHzZw4slRxBBEQoMcvB0w.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*_esJ7I3axaDn8be-XBtBJg.png)

Microsoft also introduced **AutoGen Studio:** A low\-code interface for building multi\-agent workflows.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*lZviFikjahThOkY7dJ5Gyg.png)

Please explore on this [here](https://www.microsoft.com/en-us/research/blog/introducing-autogen-studio-a-low-code-interface-for-building-multi-agent-workflows/).


## Key Takeaways:

* Agents in the AutoGen framework collaborate through message exchanges, which resemble conversations, allowing them to coordinate and share information to accomplish tasks efficiently.
* Conversable agents in AutoGen are flexible entities that can switch roles and exchange messages with other agents, allowing them to perform different tasks based on the application’s requirements.
* The **“human input mode”** setting in a conversable agent allows developers to decide whether human input is allowed or required during the agent’s execution.
* Conversation programming in AutoGen allows agents to exchange messages and execute tasks autonomously through natural language conversations while enabling control over the flow of tasks. This merges natural language interaction with deterministic computation, providing flexibility in AI workflows.
* The standardized interface in AutoGen provides better control over the dynamics of message exchanges between agents, ensuring consistency and predictability in conversations, while still supporting flexible and dynamic interaction patterns.
* AutoGen Studio is designed to provide a chat\-based interface that simplifies building and interacting with AutoGen\-based agents. It allows users to execute various tasks and workflows in an intuitive and flexible environment.
* The main difference between the LangChain framework and Microsoft’s AutoGen framework for building agents is that theLangChain focuses on connecting models and tools to build workflows whereas AutoGen emphasizes collaborative agents that interact using conversational patterns to accomplish tasks, introducing a different approach to agent\-based workflows.


## Future Plans:

* Tackle increasingly more complex benchmarks and real\-world scenarios
* Introduce agents with learn and self\-improve
* Understand images and screenshots
* Systematically explore and search

**Please do clap** 👏 **or comment if you find it helpful ❤️🙏**


## References:

1. <https://github.com/microsoft/autogen>
2. [https://arxiv.org/abs/2308\.08155](https://arxiv.org/abs/2308.08155)
3. [https://www.microsoft.com/en\-us/research/blog/autogen\-enabling\-next\-generation\-large\-language\-model\-applications/](https://www.microsoft.com/en-us/research/blog/autogen-enabling-next-generation-large-language-model-applications/)
4. Credit (Youtube Videos of) : Matthew Berman, Lucas Soares
5. [https://www.microsoft.com/en\-us/research/blog/introducing\-autogen\-studio\-a\-low\-code\-interface\-for\-building\-multi\-agent\-workflows/](https://www.microsoft.com/en-us/research/blog/introducing-autogen-studio-a-low-code-interface-for-building-multi-agent-workflows/)
6. [https://autogen\-studio.com/](https://autogen-studio.com/)

