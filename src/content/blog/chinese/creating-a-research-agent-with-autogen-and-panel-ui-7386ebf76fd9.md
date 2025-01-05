---
title: "轻松打造高效研究助手！AutoGen与Panel UI结合的神奇旅程"
meta_title: "轻松打造高效研究助手！AutoGen与Panel UI结合的神奇旅程"
description: "本文介绍了如何利用AutoGen和Panel UI构建一个多代理研究系统，通过自动化日常任务来提升生产力。系统包括多个专门代理，如管理员、工程师、科学家、规划者、执行者和评论者，协同工作以简化研究流程。所需环境包括Python 3.9及以上版本，并需安装AutoGen和Panel UI库。文章详细描述了代理的定义、协作聊天的创建以及用户界面的设置，展示了该系统在学术研究和商业智能等领域的应用潜力。"
date: 2025-01-05T02:25:48Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*5cBKU3bQYrKt4YnsdX_kFw.png"
categories: ["Programming", "Machine Learning", "Data Science"]
author: "Rifx.Online"
tags: ["AutoGen", "Panel", "LLM", "productivity", "collaboration"]
draft: False

---




🎉 新年快乐，大家好！在开始之前，衷心感谢大家对我们之前故事的支持和反馈——这对我们意义重大！🙌 现在，让我们以一个有趣的项目开始新的一年。在人工智能和数据科学的世界中，打造智能和动态的代理可以为自动化研究工作流程带来重大变化。利用 **AutoGen** 和 **Panel UI**，您可以构建一个研究代理，与多个子代理协作，每个子代理都设计用于特定任务，如编码、规划或批评。✨ 让我们深入了解如何设置一个具有流畅和互动用户界面的多代理系统。

## 什么让这个研究代理变得有趣？

想象一下，将重复性的任务、复杂的工作流程规划或研究过程的评估委托给AI代理。以下是构建这样一个代理的独特之处：

* **提升生产力**：通过自动化日常任务，您可以专注于更高层次的思考。
* **促进AI与人类的协作**：每个代理扮演着独特的角色，将机器的高效与人类的创造力相结合。
* **简化研究流程**：提供结构化、可重复的方法，使复杂的研究变得可管理和高效。

## 你需要的东西

* **Python 3\.9\+**
* **AutoGen**：一个用于创建和管理AI代理的库。
* **Panel UI**：用于构建响应式和交互式前端。
* **LLM模型**：如OpenAI或本地托管模型如Llama。
* 对Python和机器学习概念的基本知识。

## 设置环境

首先，创建一个新的 Python 环境以保持依赖关系的隔离。您可以使用 Conda 或 Python 的 `venv` 模块：

**使用 Conda：**

```python
conda create -n research_agent_env python=3.9 -y
conda activate research_agent_env
```python
conda create -n research_agent_env python=3.9 -y
conda activate research_agent_env

```

**使用 venv：**

```python
python -m venv research_agent_env
source research_agent_env/bin/activate  
## 在 Windows 上：research_agent_env\Scripts\activate
```python
python -m venv research_agent_env
source research_agent_env/bin/activate  
## 在 Windows 上：research_agent_env\Scripts\activate
```
```
然后，安装所需的库：

```python
pip install autogen panel 
```python
pip install autogen panel 

```

## 代码逐步讲解

这是创建您的研究代理的逐步指南：

### 1\. 导入库并配置LLM

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

这里，`config_list` 定义了您的LLM的连接详细信息，包括模型、基础URL和API密钥。

### 2\. 定义 AI 代理

每个代理都有不同的角色。例如：

* **Admin**: 监督工作流程并批准任务。
* **Engineer**: 编写和调试代码。
* **Scientist**: 分析研究数据。
* **Planner**: 制定可行计划。
* **Executor**: 执行代码。
* **Critic**: 评估计划和输出。

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

> **注意：** 我在 Docker 容器中运行所有代理生成的代码，并建议您也这样做，这需要您的系统中运行 Docker Desktop。

### 创建协作的群聊

将所有代理链接到协作聊天界面：

```python
## Create a GroupChat with all agents
group_chat = autogen.GroupChat(agents=[admin_agent, engineer_agent, scientist_agent, planner_agent, executor_agent, critic_agent], messages=[], max_round=50)
chat_manager = autogen.GroupChatManager(groupchat=group_chat, llm_config=llm_settings)
```python
## Create a GroupChat with all agents
group_chat = autogen.GroupChat(agents=[admin_agent, engineer_agent, scientist_agent, planner_agent, executor_agent, critic_agent], messages=[], max_round=50)
chat_manager = autogen.GroupChatManager(groupchat=group_chat, llm_config=llm_settings)

```

### 设置面板 UI 和回复处理程序：

```python
def print_messages(recipient, messages, sender, config):
    """
    打印并通过聊天界面将发件人的最新消息发送给收件人。
    参数：
        recipient (object): 包含收件人详细信息的收件人对象。
        messages (list): 消息字典的列表，每个字典包含消息详细信息。
        sender (object): 包含发件人详细信息的发件人对象。
        config (dict): 用于其他设置的配置字典。
    返回：
        tuple: 包含布尔值和 None 的元组。布尔值始终为 False，以确保代理通信流继续。
    备注：
        - 该函数打印最新消息的详细信息。
        - 如果最新消息包含键 'name'，则使用消息中的名称和头像发送消息。
        - 如果缺少 'name' 键，则使用默认用户 'SecretGuy' 和忍者头像发送消息。
    """
    print(f"Messages from: {sender.name} sent to: {recipient.name} | num messages: {len(messages)} | message: {messages[-1]}")
  
    if all(key in messages[-1] for key in ['name']):
        chat_interface.send(messages[-1]['content'], user=messages[-1]['name'], avatar=agent_avatars[messages[-1]['name']], respond=False)
    else:
        chat_interface.send(messages[-1]['content'], user='SecretGuy', avatar='🥷', respond=False)

    return False, None  # required to ensure the agent communication flow continues
```python
def print_messages(recipient, messages, sender, config):
    """
    打印并通过聊天界面将发件人的最新消息发送给收件人。
    参数：
        recipient (object): 包含收件人详细信息的收件人对象。
        messages (list): 消息字典的列表，每个字典包含消息详细信息。
        sender (object): 包含发件人详细信息的发件人对象。
        config (dict): 用于其他设置的配置字典。
    返回：
        tuple: 包含布尔值和 None 的元组。布尔值始终为 False，以确保代理通信流继续。
    备注：
        - 该函数打印最新消息的详细信息。
        - 如果最新消息包含键 'name'，则使用消息中的名称和头像发送消息。
        - 如果缺少 'name' 键，则使用默认用户 'SecretGuy' 和忍者头像发送消息。
    """
    print(f"Messages from: {sender.name} sent to: {recipient.name} | num messages: {len(messages)} | message: {messages[-1]}")
  
    if all(key in messages[-1] for key in ['name']):
        chat_interface.send(messages[-1]['content'], user=messages[-1]['name'], avatar=agent_avatars[messages[-1]['name']], respond=False)
    else:
        chat_interface.send(messages[-1]['content'], user='SecretGuy', avatar='🥷', respond=False)

    return False, None  # required to ensure the agent communication flow continues

```

```python
## 将 print_messages 函数注册为每个代理的回复处理程序
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
```python
## 将 print_messages 函数注册为每个代理的回复处理程序
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
## 使用材料设计初始化面板扩展
pn.extension(design="material")

def callback(contents: str, user: str, instance: pn.chat.ChatInterface):
    # 与 admin_agent 启动聊天
    admin_agent.initiate_chat(chat_manager, message=contents)

## 创建聊天界面并发送初始消息
chat_interface = pn.chat.ChatInterface(callback=callback)
chat_interface.send("发送一条消息！", user="系统", respond=False)
chat_interface.servable()
```python
## 使用材料设计初始化面板扩展
pn.extension(design="material")

def callback(contents: str, user: str, instance: pn.chat.ChatInterface):
    # 与 admin_agent 启动聊天
    admin_agent.initiate_chat(chat_manager, message=contents)

## 创建聊天界面并发送初始消息
chat_interface = pn.chat.ChatInterface(callback=callback)
chat_interface.send("发送一条消息！", user="系统", respond=False)
chat_interface.servable()

```

## 整合所有内容

一旦设置完成，您的研究代理就准备好处理工作流程。系统将任务分配给适当的代理，确保：

* **无缝的任务执行。**
* **全面的计划批评和优化。**
* **高效的研究输出。**

## 运行设置：

```python
panel serve .\autogen_panel_example.py
```python
panel serve .\autogen_panel_example.py

```

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*KBs8zZC3rMT7enIbcMoJLA.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*onsQ5PVBYs4p3mYnDoiHmQ.png)

## 此设置的应用

* **学术研究**：自动化文献综述和编码实验。
* **商业智能**：分析报告并生成洞察。
* **数据工程**：调试管道和处理大型数据集。

## 最后的思考

随着我们迈入全新的一年，愿我们拥抱创新与创造力！借助 AutoGen 和 Panel UI 等工具，构建 AI 系统变得既简单又强大。这种架构不仅简化了工作流程，还促进了人类与 AI 代理之间的有意义合作。我们期待看到这些工具如何在 2025 年改变你的研究旅程。🚀

感谢您的阅读，衷心祝大家新年快乐！祝愿您在所有的努力中繁荣、幸福与成功。🌟

## 其他资源：

**完整代码：**[https://github.com/imanoop7/AutoGen\-notebooks](https://github.com/imanoop7/AutoGen-notebooks)


