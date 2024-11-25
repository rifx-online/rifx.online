---
title: "如何为 CrewAI 应用程序创建交互式 Web UI（新版已更新）"
meta_title: "如何为 CrewAI 应用程序创建交互式 Web UI（新版已更新）"
description: "本文介绍了如何为更新后的 CrewAI 应用程序创建交互式 Web 用户界面（UI）。随着 CrewAI 从版本 0.28 升级到 0.80，框架的架构和 API 发生了显著变化。新版本提供了多项功能，包括可定制的提示、与外部工具的集成以及通过单个命令快速创建多代理应用程序的能力。教程详细说明了如何使用 Panel 库将任务输出重定向到聊天 UI，实现用户输入和输出的交互，并展示了如何通过命令行创建和运行新的 CrewAI 项目。最终，用户能够在 Web 应用中进行主题研究并与代理进行互动。"
date: 2024-11-25T15:00:22Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*1--VMRKUMg3Dh7jB3ohpAg.png"
categories: ["Programming/Scripting", "Technology/Web", "Chatbots"]
author: "Rifx.Online"
tags: ["CrewAI", "Panel", "prompts", "agents", "chat"]
draft: False

---



### CrewAI \+ Panel UI 实现的快速更新



今年早些时候，我写了一篇关于为 CrewAI 应用程序创建交互式 Web UI 的教程。在那个教程中，我实现了一个简单的 Web 服务器，用于可视化 CrewAI 代理和工作流，并允许用户通过消息与它们进行交互。从那时起，CrewAI 从版本 0\.28 更新到最新版本 0\.80，经历了许多变化和改进。不仅 API 的用法发生了很大变化，而且在这半年里，整个架构也不同，因此许多开发者告诉我这个教程已经过时，他们无法更新 CrewAI 以获取新功能，同时保留项目中的现有 UI 设计。

在本教程中，我将向您展示如何为最新版本的 CrewAI 框架创建相同的 Web UI。您可以看到使用新 CrewAI 框架快速构建多代理应用程序的创新过程，如何通过将代理的默认输出重定向到 [Panel](https://panel.holoviz.org/reference/index.html#chat) 的聊天 UI 来自定义应用程序，这是一个用于构建自定义 Web 应用程序的 Python 库，以及如何通过在 UI 上发送消息与每个代理进行交互。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*LkEYABv3w_o_tBINAlrVYA.png)

## CrewAI 自上次教程以来的新变化

如果你关注我上一次的 CrewAI 网页应用实现，现在应该看看这个框架的开发中有哪些重大变化。在 2024 年 5 月和 6 月，CrewAI 添加了各种功能，比如为团队设置经理、可定制的提示和响应模板，以及与外部工具的集成，增强了对 AI 行为的灵活性和用户控制。它还引入了新的代理类型，能够直接执行代码，支持来自各种平台的第三方代理集成，以及一个训练 CLI，显著提高了框架在处理复杂动态任务方面的能力。这些都是多代理系统的有用功能，我将在未来的演示中展示如何利用和扩展这些功能。

对我而言，CrewAI 最具创新性的进步是其通过单个命令创建完整应用程序的能力。只需 `crewai create crew my-app`，你就可以瞬间生成一个功能齐全的多代理应用程序，包含所有必要的模块、文档和配置文件。这包括在 YAML 文件中预配置的代理角色和任务、一个团队编排模块以及环境变量模板——一切所需的启动内容。生成的项目结构遵循最佳实践，开箱即用地包括任务回调、进程管理和代理协调等功能。这大大减少了与其他仅提供 API 和示例的框架从零开始构建 LLM 多代理应用程序所需的时间和精力。

让我们用一个 CrewAI 项目的示例来热身。

## 项目创建

让我们来创建一个使用默认内容的简单 CrewAI 项目。

首先，安装最新版本的 CrewAI（当前版本为 0\.80\）：

```python
pip install crewai crewai-tools
```
然后，使用其 CLI 创建一个新的 CrewAI 项目：

```python
crewai create crew my_crew
```
在创建过程中，系统会要求您选择语言模型和供代理使用的 API 密钥。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*OY9mS7ylA_YJ57Si23wwIg.jpeg)

几秒钟后，您将看到一条消息，显示您的团队已成功创建，并且在您当前的工作目录中将会有一个名为 `my_crew` 的新目录，里面包含项目的基本结构。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*3I44j4w5vn2KPMPjBRQ6Uw.jpeg)

在该结构中，您会发现 `main.py` 和 `crew.py` 位于 `src/` 目录中，而两个 YAML 文件位于 `src/config/` 目录中。基本的多代理逻辑仍然在这两个 Python 文件中实现，但代理和任务的系统指令现在已移至 YAML 文件。这种新结构将编码部分与配置部分分开，允许代理/提示/工具设计者（非编码）与多代理能力/工作流开发者（编码）之间进行更多协作。默认应用演示了一个简单的多代理工作流，该工作流研究并报告给定主题或学科的最新 AI 发展。因此，让我们通过在终端中运行以下命令来运行该应用：

```python
cd my_crew
crewai run
```
在自动下载依赖项后，整个代理的工作流将被执行，输出将显示在终端中。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*aU1oLj0EuSzXdL1tIeolZg.jpeg)

了解这一点后，让我们进入本教程的主要主题，看看如何将这个命令行应用包装成基于该源代码结构的面板 Web UI。

## CrewAI \+ Panel 集成

根据设计目的，让我们将任务的输出和人类输入重定向到 Panel 的聊天用户界面。首先安装 Panel：


```python
pip install panel
```

### crew.py

移动到源目录中的 `crew.py` 文件，并从 Panel 的小部件库中创建 `ChatInterface` 对象。

```python
import panel as pn

chat_interface = pn.chat.ChatInterface()
```
然后，定义 `print_output()` 函数以将任务的输出发送到面板的聊天 UI。

```python
from crewai.tasks.task_output import TaskOutput

def print_output(output: TaskOutput):

    message = output.raw
    chat_interface.send(message, user=output.agent, respond=False)
```
此函数设计为在任务完成时调用，因此我们需要将其注册为每个任务定义的回调函数。

请注意，在 `reporting_task` 定义中添加了 `human_input=True` 参数，以允许代理在工作流程的最后一步与用户互动。

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

对于主文件，我们需要首先移除所有现有的代码，因为我们必须使用 Panel 的 serve 命令来运行应用，而不是使用 `crewai run` 命令，以便包装 crew 工作流。现有的一般执行代码不再需要。

首先，我们需要手动从 `.env` 文件中导入 `OPENAI_API_KEY`，该文件在我们运行 crew 命令时初始化。

```python
import os
from dotenv import load_dotenv
load_dotenv()
```
然后，我们需要定义 Panel 主题。

```python
import panel as pn
pn.extension(design='material')
```
好的，现在我们需要定义回调函数来处理用户输入，将其传递给 crew 工作流，并将结果发送回聊天 UI。

回调函数将在聊天 UI 的消息输入中有两个场合被调用：

1. 当应用启动时，用户发送查询以启动 crew 工作流。
2. 当任务完成时，相关代理需要用户的反馈输入。

以下是代码：

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
在回调函数中，我们需要检查 crew 的工作流是否已经开始。如果没有，我们创建一个新线程来运行 `initiate_chat()` 函数，将用户的初始查询传递给工作流。这里我们只需通过调用 `MyCrew().crew()` 和它的 `.kickoff()` 方法来启动 crew，该方法是从我们修改过的 `crew.py` 文件中导入的。我们使用线程的原因是 `kickoff()` 方法会阻塞面板的 UI 更新过程，包括后续的用户输入和回调，因此我们需要在单独的线程中运行它以避免阻塞。如果 crew 的工作流已经开始，我们可以假设用户的输入是对正在进行的工作流的反馈消息，我们将用新的消息字符串更新 `user_input` 变量。然后，将回调函数注册到 `chat_interface` 对象。

到目前为止，任务的消息输出已经实现，现在是时候允许用户输入以便进行中的工作流。

以下是代码片段：

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
在 CrewAI 框架中，没有明确的 API 用于将用户输入从命令行重定向到聊天 UI，因此我们必须对 `CrewAgentExecutorMixin` 类进行“猴子补丁”，以覆盖默认的 `ask_human_input()` 方法。在自定义函数中，我们将临时输出发送回聊天 UI，以及请求用户反馈的提示消息，并等待用户输入。一旦收到，它将返回反馈消息，`CrewAgentExecutorMixin` 将继续处理。

逻辑设计已经完成，然后我们可以在代码末尾添加 Panel 服务器的代码片段：

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

在这个演示应用中，我们不会修改代理或任务的默认定义，因为它们都是您自己程序中的特定领域设计。因此，我们只需要在任务定义中添加一行，以通知报告代理请求用户的反馈。

```python
reporting_task:
  description: >
    ...
    Ask user input for more information if needed. 
...
```

## 运行应用程序

在运行应用程序之前，请确保您已移动到 `my_crew/` 目录，并运行以下命令将 `my_crew` 安装为可从任何地方导入的包：

```python
cd my_crew
pip install -e .
```
一切准备就绪，现在我们可以通过执行以下命令来运行 Web 应用程序：

```python
panel serve src/my_crew/main.py
```
在终端看到消息 `Bokeh app running at [http://localhost:5006](http://localhost:5006`,)`[,](http://localhost:5006`,) 后，您可以打开 Web 浏览器并导航到该 URL 以查看 Web 应用程序。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*dcVLg6elvNQ4bz47bsWQ7A.png)

输入您想要的主题，例如“LLM”，然后单击“发送”按钮以开始工作流程。然后，两个代理将依次生成研究并报告结果。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*77P4xDhJNXzNTrFdAdX9OQ.png)

当提示消息显示时，您可以输入额外的指示，例如“为每个标题添加副标题”，然后再次单击“发送”按钮以继续工作流程。最后，带有副标题的报告将显示出来。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*8wN_pNa6x9JDyMS1hiQN4g.png)

总之，将 Web UI 添加到 CrewAI 的整体思路是注册输出的回调，并用 UI 输入功能替换默认的人类输入功能。作为一个流行的开源项目，CrewAI 仍在积极开发中，架构预计在未来会或多或少地发生变化，因此我会持续关注最新版本，并根据需要更新教程。

感谢您的阅读。如果您觉得这篇文章有帮助，请为这篇文章点赞 👏。您的鼓励和评论对我意义重大，无论是精神上还是经济上。🍔

**在您离开之前：**

✍️ 如果您有任何问题，请给我留言或在 [**X**](https://twitter.com/Yeyu2HUANG/) 和 [**Discord**](https://discord.gg/KPTCE4CEmp) 上找到我，在那里您可以获得我在开发和部署方面的积极支持。

☕️ 如果您想要独家资源和技术服务，订阅我的 **[Ko\-fi](https://ko-fi.com/yeyuh)** 上的服务将是一个不错的选择。

💯 **我也乐于接受任何创新和全栈开发工作的雇佣。**

