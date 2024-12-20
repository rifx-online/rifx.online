---
title: "AutoGen：智能自动化的代理开放源码框架"
meta_title: "AutoGen：智能自动化的代理开放源码框架"
description: "AutoGen是微软推出的开源框架，旨在通过对话模式构建智能体以协作完成任务。它支持多种大型语言模型，简化了AI开发，允许开发者在本地测试并部署到云环境。AutoGen的特点包括可对话智能体、对话编程和统一接口，支持灵活的交互模式和动态对话。该框架适用于多领域应用，如编码、问答等，并通过AutoGen Studio提供低代码界面，便于构建多代理工作流。未来计划包括提升智能体的学习能力和理解图像的能力。"
date: 2024-12-19T22:17:28Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*0QU43GSq6Om2x4T5gu0rog.png"
categories: ["Programming", "Machine Learning", "Chatbots"]
author: "Rifx.Online"
tags: ["AutoGen", "conversational", "agents", "LLMs", "cloud"]
draft: False

---



AutoGen是微软提供的一个开源框架，用于构建能够通过对话模式协作完成任务的智能体。AutoGen简化了AI开发和研究，支持多种大型语言模型（LLMs）、集成工具和先进的多智能体设计模式。您可以在本地开发和测试智能体系统，然后根据需求将其部署到分布式云环境中。



该框架允许开发者通过多个智能体构建LLM应用，这些智能体可以相互对话以完成任务。AutoGen智能体是可定制的、可对话的，并且可以在多种模式下运行，结合使用LLMs、人类输入和工具。使用AutoGen，开发者还可以灵活定义智能体的交互行为。自然语言和计算机代码都可以用于为不同应用编程灵活的对话模式。AutoGen作为一个通用基础设施，支持构建各种复杂性和LLM能力的多样化应用。实证研究证明了该框架在许多示例应用中的有效性，涵盖了数学、编码、问答、运筹学、在线决策、娱乐等多个领域。您可以将此应用视为***ChatGPT + 代码解释器 + 插件 + 完全可定制。***

该框架主要具有以下特性：

**可对话智能体：**

* 一种设计智能体的方式，可以使用LLMs、人类输入、工具或这些的组合，创建具有不同角色的智能体。
* 它们基本上扮演可对话的角色——具有特定角色的实体，可以发送和接收信息，与其他可对话智能体进行消息传递。例如，开始或继续对话。
* 它们也是可定制的，即每个智能体可以根据特定应用需求进行配置，在多智能体对话中展示复杂行为，使用基本后端类型的混合。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*YKozzXQ20ruZtVIRsiV2WA.png)

**对话编程：**

* 以智能体间对话为中心的编程范式
* 在多智能体对话中融合计算和控制流的范式。
* 融合编程和自然语言控制。
* **计算：** 角色特定、以对话为中心的动作。
* **控制流：** 由智能体之间的对话动态定义。
* **效率：** 为不同技能水平的AI开发提供简化。

AutoGen具有统一接口的设计模式，展示了智能体交互的标准化接口。它还具有自动回复机制，以保持持续的对话流。还支持动态对话，支持静态和动态流。它提供可定制的回复功能，以适应性对话。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*9KXxw8Q0MdqH1JZeWktoAQ.png)

现在让我们看看如何构建一个简单的智能体。

## 构建一个简单的代理与 Autogen

**安装包**：

```python
!pip install pyautogen
```

```python
from autogen import AssistantAgent, UserProxyAgent, config_list_from_json, GroupChat, GroupChatManager
## 从环境变量或文件加载 LLM 推理端点
## 参见 https://microsoft.github.io/autogen/docs/FAQ#set-your-api-endpoints
config_list = config_list_from_json(env_or_file="OAI_CONFIG_LIST", filter_dict={"model" : "gpt-4o-mini"})
```
示例或如何创建的内容是“OAI\_CONFIG\_LIST”

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*QhguIWb9F65WetJRhGsAAQ.png)

**创建 AssistantAgent**：

```python
assistant = autogen.AssistantAgent(
    name="assistant",
    llm_config={
        "seed": 42,  # 用于缓存和可重复性的种子
        "config_list": config_list,  # OpenAI API 配置列表
        "temperature": 0,  # 采样的温度
    },
)
```
创建一个 AI 助手代理

* **name**: 将代理标识为 "assistant"
* **llm\_config :** 语言模型的配置：
* **seed:** 设置为 42 以获得可重复的结果
* **config\_list :** 包含 OpenAI API 设置（来自之前的配置）
* **temperature :** 设置为 0 以获得最确定/集中的响应

**创建 UserProxyAgent**：

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
创建一个代表用户的代理

* **name** : 将代理标识为 "user\_proxy"
* **human\_input\_mode\=”NEVER”**: 自动运行，无需人工干预
* **max\_consecutive\_auto\_reply\=10:** 限制连续交流为 10 条消息
* **is\_termination\_msg:** 一个函数，用于检查消息是否应结束对话（查找结尾的“TERMINATE”）
* **code\_execution\_config:** 代码执行的设置：
* **work\_dir:** 代码将被执行的目录（“coding”）
* **use\_docker:** 禁用（可以启用以实现隔离的代码执行）

**聊天启动**：

```python
user_proxy.initiate_chat(
    assistant,
    message="""今天是什么日期？比较 META 和 TESLA 的年初至今的收益。"""
)
```
**输出：**

这些是他们在文件夹中生成的文件。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*lUs_AWxkS72xOBPJecAQdg.png)

终端中的输出如下所示。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*-E-COgFvCMzI-e2e20F_jg.png)

## 如何构建一个带有 Autogen 的研究助手

让我们构建一个研究代理。以下是显示每个代理所有职责的框图。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*54e4pR_5Si2YiLeTOrIAMQ.png)

让我们逐一查看代理的每个查询。

### 1\. user\_proxy \= UserProxyAgent(…)

* **目的**: 代表一个批准计划的人类管理员。
* **属性**:
* **name**: “Admin” — 标识角色。
* **system\_message**: 描述管理员在与规划者互动中的角色。
* **code\_execution\_config**: 设置为 False，表示该代理不执行代码。

```python
user_proxy = UserProxyAgent(
  name="Admin",
  system_message="A human admin. Interact with a planner to discuss the plan of execution. This plan needs to be approved by this admin.",
  code_execution_config=False
)
```

### 2\. planner \= AssistantAgent(…)

* **目的**: 根据反馈建议和修订计划。
* **属性**:
* **name:** “Planner” — 确定角色。
* **system\_message**: 描述规划者的职责，包括涉及工程师和科学家。
* **llm\_config**: 语言模型的配置，gpt4o\_config。


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

* **目的**: 根据已批准的计划编写和执行代码。
* **属性**:
* name: “Engineer” — 标识角色。
* system\_message: 详细说明工程师的任务，包括编写和调试代码。
* llm\_config: 语言模型的配置。


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

* **目的**: 分析研究并对论文进行分类。
* **属性**:
* **name:** “Scientist” — 确定角色。
* **system\_message**: 描述科学家在分类论文和提供报告中的角色。
* **llm\_config**: 语言模型的配置。


```python
scientist = AssistantAgent(
  name="Scientist",
  llm_config=gpt4o_config,
  system_message="""Scientist. You follow an approved plan. You are able to categorize papers after seeing their abstracts printed. You don't write code.\
    you provided detailed resource  reports for the ResearchWriter to write comprehensive research reports."""
)
```

### 5\. executor \= UserProxyAgent(…)

* **目的**: 执行工程师编写的代码。
* **属性**:
* **name:** “Executor” — 确定角色。
* **system\_message:** 描述执行者运行代码的任务。
* **human\_input\_mode:** 设置为“NEVER”，表示不需要人类输入。
* **code\_execution\_config:** 代码执行的配置，包括消息历史和工作目录。


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

* **目的**: 审查并提供对计划、代码和报告的反馈。
* **属性**:
* **名称:** “Critic” — 确定角色。
* **系统消息:** 描述评论者在验证信息和提供反馈中的角色。
* **llm\_config:** 语言模型的配置。


```python
critic = AssistantAgent(
  name="Critic",
  system_message="Critic. Double check, claims, code and report from other agents and provide feedback. \
  Check whether the final research report includes adding verifiable info such as source ",
  llm_config=gpt4o_config,
)
```

### 7\. research\_report\_writer \= AssistantAgent(…)

* **目的**: 撰写综合性的研究报告。
* **属性**:
* **名称:** “ResearchWriter” — 确定角色。
* **系统消息:** 详细说明报告撰写过程，包括章节和引用要求。
* **llm\_config:** 语言模型的配置


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

* **目的**: 初始化一个包含多个代理的群聊。
* **属性**:
* agents: 参与聊天的代理列表（user_proxy, planner, engineer, scientist, executor, critic, research_report_writer）。
* messages: 一个空列表 \[] 用于存储聊天中交换的消息。
* max\_round: 设置为 50，表示允许的最大互动轮数。


```python
groupchat = GroupChat(
  agents=[user_proxy, planner, engineer, scientist, executor, critic, research_report_writer],
  messages=[],
  max_round=50
)
```

### 9\. manager \= GroupChatManager(…)

* **目的**：管理群聊，协调互动，确保顺畅的沟通。
* **属性**：
* groupchat: 上面创建的群聊实例。
* llm\_config: 语言模型的配置，gpt4o\_config。


```python
manager = GroupChatManager(groupchat=groupchat, llm_config=gpt4o_config)
```
**关键点：**

* **代理**：每个代理都有特定的角色，参与规划、编码、执行、审查和报告等任务。
* **消息**：聊天系统旨在处理和存储代理之间的消息。
* **轮次**：限制交互次数，以确保效率并防止无休止的循环。


```python
output_report = user_proxy.initiate_chat(manager, message = "Write a 4 paragraph research report about how to use LLMs to enhance personal productivity?")
```
输出快照

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*0IHzZw4slRxBBEQoMcvB0w.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*_esJ7I3axaDn8be-XBtBJg.png)

微软还推出了 **AutoGen Studio**：一个用于构建多代理工作流的低代码界面。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*lZviFikjahThOkY7dJ5Gyg.png)

请在[这里](https://www.microsoft.com/en-us/research/blog/introducing-autogen-studio-a-low-code-interface-for-building-multi-agent-workflows/)了解更多信息。

## 主要收获：

* AutoGen 框架中的代理通过消息交换进行协作，这类似于对话，使它们能够协调并分享信息以高效完成任务。
* AutoGen 中的可对话代理是灵活的实体，可以切换角色并与其他代理交换消息，使其能够根据应用程序的需求执行不同的任务。
* 可对话代理中的 **“人类输入模式”** 设置允许开发者决定在代理执行期间是否允许或需要人类输入。
* AutoGen 中的对话编程允许代理通过自然语言对话交换消息并自主执行任务，同时能够控制任务的流程。这将自然语言交互与确定性计算相结合，为 AI 工作流程提供灵活性。
* AutoGen 中的标准化接口提供了更好的控制，确保代理之间消息交换的动态性，一致性和可预测性，同时仍然支持灵活和动态的交互模式。
* AutoGen Studio 旨在提供一个基于聊天的界面，简化与基于 AutoGen 的代理的构建和交互。它允许用户在直观和灵活的环境中执行各种任务和工作流程。
* LangChain 框架与微软的 AutoGen 框架在构建代理方面的主要区别在于，LangChain 专注于连接模型和工具以构建工作流程，而 AutoGen 强调使用对话模式进行交互的协作代理，以完成任务，引入了一种不同的基于代理的工作流程方法。

## 未来计划：

* 应对越来越复杂的基准测试和现实场景
* 引入具有学习和自我提升能力的智能体
* 理解图像和截图
* 系统性地探索和搜索

**如果您觉得这有帮助，请点赞** 👏 **或评论❤️🙏**

## 参考文献：

1. <https://github.com/microsoft/autogen>
2. [https://arxiv.org/abs/2308\.08155](https://arxiv.org/abs/2308.08155)
3. [https://www.microsoft.com/en\-us/research/blog/autogen\-enabling\-next\-generation\-large\-language\-model\-applications/](https://www.microsoft.com/en-us/research/blog/autogen-enabling-next-generation-large-language-model-applications/)
4. 版权（Youtube 视频来自）: Matthew Berman, Lucas Soares
5. [https://www.microsoft.com/en\-us/research/blog/introducing\-autogen\-studio\-a\-low\-code\-interface\-for\-building\-multi\-agent\-workflows/](https://www.microsoft.com/en-us/research/blog/introducing-autogen-studio-a-low-code-interface-for-building-multi-agent-workflows/)
6. [https://autogen\-studio.com/](https://autogen-studio.com/)

