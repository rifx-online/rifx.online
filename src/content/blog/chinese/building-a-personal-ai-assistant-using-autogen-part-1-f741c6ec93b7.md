---
title: "使用 AutoGen 构建人工智能个人助理 - 第 1 部分"
meta_title: "使用 AutoGen 构建人工智能个人助理 - 第 1 部分"
description: "本文介绍了Aura，一个使用AutoGen框架构建的个人AI助手，旨在通过整合Gmail和Google日历来提高用户的生产力。Aura的设计目标包括管理电子邮件混乱、跟上技术趋势和记住用户上下文。文章详细阐述了选择AutoGen的原因、工具集成过程以及Aura的交互设计。未来的计划包括扩展工具、提高鲁棒性和个性化，使Aura能够更好地满足用户需求。源代码已公开，鼓励用户参与贡献。"
date: 2024-12-26T04:30:18Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*1g_i3Vctbl9mmisplJmOEA.png"
categories: ["Programming", "Chatbots", "Technology/Web"]
author: "Rifx.Online"
tags: ["Aura", "AutoGen", "Gmail", "Calendar", "personalization"]
draft: False

---



### 探索 AutoGen v0\.4：构建具有 Gmail 和 Google Calendar 集成的 AI 助手



## TL; DR

在这篇文章中，我构建了Aura的基础，这是一个个人AI助手，旨在使用AutoGen管理电子邮件和日历。以下是我所涵盖内容的快速概述：

* **动机**：Aura解决了生产力挑战，如收件箱过载、日程安排以及跟上技术趋势。
* **框架选择**：选择AutoGen是因为其灵活性，提供了使用AgentChat的快速设置和通过其核心层进行深度定制。
* **工具集成**：Aura的初始设置包括Gmail和Google日历工具，用于草拟电子邮件、总结收件箱和创建日历事件。
* **与Aura互动**：您可以实时与Aura聊天，要求其执行任务或检索信息。
* **下一步**：未来的工作将集中在扩展工具、添加新功能、引入记忆、引入工作流程以及提高鲁棒性。

整个源代码可在我的[GitHub仓库](https://github.com/richard-gyiko/aura)中找到。欢迎您分叉、建议新功能、贡献或甚至构建自己的Aura版本。

话不多说，让我们开始吧……

## 动机

想象一下，有一个能够理解你工作习惯的 AI，它帮助你进行研究，审阅你的文章，清理你的收件箱，安排会议，甚至退订那些恼人的新闻通讯——所有这些都在你喝咖啡的时候进行。这就是我正在构建的 Aura。

为什么？因为我的日常工作流程有时会感觉像一团糟。以下是我希望 Aura 为我解决的几个问题：

1. **跟上技术趋势**
科技世界变化迅速。我去年依赖的一个库可能已经被更好的替代品取代。通过阅读文档、检查定价和基准测试、浏览 GitHub 问题来比较选项会耗费我数小时。我希望有一个 AI 来处理这些琐事，过滤掉无关信息，引导我做出正确的选择。
2. **管理电子邮件混乱**
我有多个电子邮件账户，跟上它们是一个挑战。Aura 将通过退订垃圾邮件通讯、自动将电子邮件组织到适当的标签中、提取可操作的任务以添加到我的 Notion 工作区、起草我可以审阅和发送的回复，甚至从预订确认邮件中创建日历事件来帮助我。
3. **记住上下文**
在每次对话或任务中解释我的偏好和工作流程令人沮丧。Aura 应该像我的记忆延伸一样，随着使用不断学习，自动完成任务，而不需要我去照看它。

## 框架选择：AutoGen

为了实现Aura，我正在使用新的AutoGen v0\.4框架。它已经[从头重建](https://microsoft.github.io/autogen/0.2/blog/2024/10/02/new-autogen-architecture-preview)，其灵活性使其非常适合我的用例。尽管v0\.4仍处于预览阶段，但我相信新的架构概念为简单和复杂任务提供了坚实的基础。

在我看来，AutoGen的一个突出特点是其双层架构：

* **核心层**：一个强大的基础，用于创建异步、事件驱动的多代理系统。
* **AgentChat层**：一个高级API，具有预设的代理和团队，使您能够快速入门，而无需处理底层细节。

这种方法完美契合我的目标。我可以利用AgentChat的抽象快速启动开发，但如果我需要更专业的东西，我可以退回到核心层并实现我的解决方案。这是两全其美——快速启动和未来的灵活性。

## 构建 Aura：工具作为智能的基石

工具是 AI 代理功能的基石。它们架起了语言模型与外部世界之间的桥梁，使得获取数据或发送命令等操作成为可能。

### 工具如何工作

这里有一个例子：

如果你问 Aura，*“我明天有什么会议？”*，系统在高层次上执行以下操作：

1. 根据提示和可用工具，LLM 确定适合该任务的工具（例如，`get_current_time` `fetch_calendar_events` 工具）并定义其调用参数。
2. 应用程序执行工具并将工具执行的结果发送给 LLM。
3. LLM 使用结果来构建有意义的回应。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*5hz6Zz0jgjIvuMlSThBwVQ.png)

### Aura的工具：Gmail和Google日历

Aura的帮助程度取决于它可以使用的工具。为了让它像专业人士一样处理我的电子邮件和日历，我需要将其与合适的资源集成。在一些挖掘之后，我找到了两个主要的起点：Gmail工具包和自定义Google日历集成。

### Gmail Toolkit

[Gmail Toolkit](https://python.langchain.com/docs/integrations/tools/gmail/)（来自LangChain社区）提供了五个基本工具，以支持Aura的电子邮件管理功能：

1. **GmailCreateDraft**：用于草拟电子邮件。
2. **GmailSendMessage**：用于发送电子邮件。
3. **GmailSearch**：用于查找特定电子邮件。
4. **GmailGetMessage**：用于检索特定电子邮件的详细信息。
5. **GmailGetThread**：用于获取线程中的所有消息。

这些工具为Aura提供了草拟、发送和组织电子邮件所需的一切。为了集成它们，我使用了以下函数：

```python
def get_gmail_tools(scopes: list[str]):
    gmailToolkit = GmailToolkit(
       api_resource=build_gmail_resource_service(scopes=scopes)
    )

    tools = gmailToolkit.get_tools()

    # Map all tools to AutoGen consumable tool
    autogen_tools = [LangChainToolAdapter(tool) for tool in tools]

    return autogen_tools
```
它的工作原理是：`GmailToolkit`提供必要的工具，而我使用`LangChainToolAdapter`来包装这些工具，以便它们可以直接在AutoGen中使用。这个适配器本质上充当桥梁，使LangChain工具与AutoGen的框架兼容。

### Google Calendar Toolkit

现在，这个需要更多的努力。在撰写时，LangChain上没有现成的Google Calendar Toolkit。经过一些研究，我找到了一个原型实现，并为Aura进行了定制。

使用自定义的Google Calendar Toolkit，Aura可以：

* **列出事件**：在特定日期范围内检索日历事件。
* **创建事件**：向我的日历添加新约会，以便我不会错过那个重要的会议——或者午餐。

集成代码与Gmail的非常相似：

```python
def get_google_calendar_tools(scopes: list[str]):
    google_calendar_toolkit = GoogleCalendarToolkit(
        api_resource=build_google_calendar_resource_service(scopes=scopes)
    )

    tools = google_calendar_toolkit.get_tools()
    
    # Map all tools to AutoGen consumable tool
    autogen_tools = [LangChainToolAdapter(tool) for tool in tools]

    return autogen_tools
```

> 两个工具包都需要凭证以便对Google API进行身份验证，以代表您执行操作。有关更多信息，请阅读工具包的官方 [docs](https://python.langchain.com/docs/integrations/tools/gmail/)。

## 让 Aura 赋能：配置 AI 助手

现在我已经准备好了工具，是时候通过创建助手代理来让 Aura 赋能。使用 AutoGen，我可以定义 Aura 及其所有工具，指定其行为，并设置其无缝处理任务。

以下是 Aura 的设置：

```python
def aura() -> AssistantAgent:
    # 第一步：收集 Aura 将使用的所有工具
    tools = (
        get_gmail_tools(SCOPES)             # 用于邮件管理的 Gmail 工具
        + get_google_calendar_tools(SCOPES) # 用于日程安排的 Google 日历工具
        + get_utility_tools()               # 额外的工具，如 get_current_time
    )

    # 第二步：使用 AutoGen 的 AssistantAgent 类创建助手代理
    assistant = AssistantAgent(
        name="aura",  # 给助手命名
        
        # 定义 LLM 客户端及其参数
        model_client=OpenAIChatCompletionClient(
            model="gpt-4o-mini",  # 一种轻量级、高效的 GPT 模型
            temperature=0.01,    # 低温度以获得精确、确定性的输出
        ),
        
        # 提供 Aura 将用于执行任务的工具
        tools=tools,
        
        # 设置系统提示以定义 Aura 的角色和行为
        system_message=SYSTEM_PROMPT_TEMPLATE.format(timezone=str(_get_timezone())),
    )

    return assistant
```
代码中的内容如下：

1. **工具设置**：我将 Gmail、Google 日历和实用工具组合成一个单一列表，使 Aura 具备功能。
2. **助手代理**：`AssistantAgent` 类使用其名称、工具和行为初始化 Aura。`OpenAIChatCompletionClient` 指定了语言模型及其配置。
3. **系统提示**：`SYSTEM_PROMPT_TEMPLATE` 定义了 Aura 的个性、职责和指导方针。例如：

```python
SYSTEM_PROMPT_TEMPLATE = """
Your name is Aura. You are a versatile and efficient AI assistant specialized in managing the user's email and calendar.
Your primary responsibilities include:
- **Email Management**: Retrieve, organize, and manage email messages. Always include a unique identifier for each message to ensure easy reference.
- **Calendar Management**: Schedule, update, and retrieve calendar events while resolving conflicts or overlaps.
Guidelines:
- Adhere to the specified timezone for all date and time-related tasks: {timezone}.
- Provide clear, concise, and user-friendly responses, prioritizing accuracy and convenience.
- Proactively notify the user of important updates, conflicts, or pending actions in their email or calendar.
"""
```
工具、轻量级 GPT 模型和量身定制的系统提示的结合确保了 Aura 准备好高效处理任务。

## 互动 AI：设计实时对话循环

现在 Aura 已经设置完成，下一步就是与之互动。为了实现这一点，我需要一个循环，让 Aura 能够实时响应用户输入。这使我们能够测试它的能力并观察其实际表现。

以下是我实现简单多轮对话循环的方法：


```python
async def main():
    # Instantiate Aura
    agent = aura()

    while True:
        try:
            # Take user input from the terminal
            user_input = input("> ")

            # Exit gracefully if the user types 'exit'
            if user_input.lower() == "exit":
                break

            # Send the input to Aura and display its response as messages become available
            await RichConsole(
                stream=agent.on_messages_stream(
                    [TextMessage(content=user_input, source="user")],
                    cancellation_token=CancellationToken(),
                ),
                show_intermediate=True,
            )
        except KeyboardInterrupt:
            # Handle Ctrl+C gracefully
            print("\nGoodbye! 👋")
            break
```

### 工作原理：

1. **初始化**：调用 `aura()` 函数来实例化助手及其所有工具和配置。
2. **用户输入循环**：程序进入一个无限循环，等待用户通过终端输入。
3. **处理输入**：每个输入都传递给 Aura，Aura 使用其工具和语言模型生成响应。
4. **输出**：`RichConsole` 实时显示 Aura 的响应。这包括中间消息，便于跟踪 Aura 如何处理任务。我使用 `rich` python 库来渲染可用的消息。
5. **优雅退出**：如果用户输入“exit”或按下 `Ctrl+C`，循环结束。

这个简单的设置允许您与 Aura 进行对话式的多轮对话。例如：

* **用户：** “我明天有什么会议？”
* **Aura：** “您明天有 3 个会议安排。以下是列表：…”

## 概念验证：Aura 的实际应用

这里展示了 Aura 在处理简单现实任务时的表现。让我们通过一些例子来看看它是如何完成工作的。

### 示例 1：创建日历事件

请求 Aura：

> *在我的任务日历中为明天的下午 5 点创建一个购物条目。*

为了解决这个问题，Aura 首先需要确定“明天”的确切日期。在下面的视频中，您将看到 Aura 如何使用工具通过工具调用来获取当前的日期和时间作为子步骤。一旦知道当前日期，它就会计算事件的正确时间，并使用其日历工具来创建条目。

```
This showcases how Aura breaks down a seemingly simple prompt into logical steps, ensuring accurate results even with relative dates.
```

### 示例 2：总结电子邮件和识别时事通讯

在这个例子中，Aura 展示了其扫描电子邮件并识别时事通讯的能力。通过一个查询，它快速总结了我的收件箱，并标记出被认为是时事通讯的电子邮件。

> 以表格格式总结今天的邮件。我想查看发件人、主题，以及邮件是否为时事通讯。确保隐藏姓名和个人身份信息。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*U9GCfzuRvTByP5J62wOmYg.png)

## 进化路线图：扩展Aura的功能

随着基础设置的完成，Aura现在已经可以正常运行，并能够使用其工具处理简单任务。它可以管理您的日历、整理您的电子邮件，甚至总结您的收件箱——但这仅仅是个开始。

现在我已经建立了一个坚实的基础，真正的旅程才刚刚开始。Aura的可能性是巨大的，还有很多改进和新功能的空间。以下是未来的展望：

### 扩展当前工具

* 增强现有的 Gmail 工具，以支持额外的任务，例如标记电子邮件、将其移动到特定文件夹，或甚至取消订阅新闻通讯。
* 通过控制返回给 LLM 的数据来优化工具输出。例如，提取特定任务所需的相关字段，而不是返回整个电子邮件。

### 添加新工具包和代理

* 引入新的集成，例如用于进行在线研究的工具、在 Notion 或 Trello 等平台上管理任务的工具，或与项目管理系统交互的工具。
* 开发可以与 Aura 协同工作的专用代理，使其能够处理更复杂的多步骤工作流程。

### 提高鲁棒性和稳定性

* 改进代理的错误处理，使其在 API 故障或意外输入等场景中更具韧性。
* 优化底层架构，以确保在添加更多工具和任务时的可扩展性和一致性。
* 测试和完善 Aura 如何管理重叠请求，确保在高需求情况下也能顺畅运行。

### 个性化

* 添加长期结构化记忆，以便Aura可以记住概念、工作流程和偏好。

这个基础使我们能够实验并将Aura发展成一个强大的个性化AI助手。

请关注即将发布的帖子，我将讨论一些这些增强功能，并将Aura提升到一个新的水平。与此同时，如果您有想法或希望Aura处理的功能，请访问[GitHub Discussions](https://github.com/richard-gyiko/aura/discussions)页面——我很想听听您的想法！

