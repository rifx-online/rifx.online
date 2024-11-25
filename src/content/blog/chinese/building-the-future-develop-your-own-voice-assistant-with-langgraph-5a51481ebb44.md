---
title: "打造未来：使用 LangGraph 开发自己的语音助手"
meta_title: "打造未来：使用 LangGraph 开发自己的语音助手"
description: "本文介绍了如何利用LangGraph框架开发语音助手，强调了其在协调复杂代理系统方面的优势。LangGraph能够有效管理多个任务，如安排会议、撰写电子邮件和旅行规划，提升用户体验。文章提供了语音到文本及文本到语音的实现代码，并描述了构建多代理流程的步骤。未来发展包括API集成、用户体验优化和基础设施扩展，以支持更广泛的功能和更高的用户满意度。"
date: 2024-11-25T15:00:22Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*802yFFOi_kxYiUlgaAn3_A.png"
categories: ["Voice Assistants", "Programming", "Technology/Web"]
author: "Rifx.Online"
tags: ["LangGraph", "voice", "assistant", "workflows", "agents"]
draft: False

---



今天，语音助手已经发展成为智能系统中需要先进自然语言处理的基本组成部分。本文提供了使用 LangGraph 开发语音助手的技术指南，LangGraph 是一个旨在管理复杂代理系统的编排框架。在整个文本中，我们将探讨 LangGraph 如何实现多个节点的协调，从而创建高效且高度可扩展的流程。本指南面向希望利用 LangGraph 功能在 AI 环境中实施解决方案的开发者。

## 什么是 LangGraph？

LangGraph 作为一个关键工具，帮助开发者应对构建多个 LLM 代理的应用程序的复杂性。该框架是 LangChain 生态系统的一部分，提供了一种高效的架构，用于多代理系统的协调，能够清晰地定义工作流程并管理代理之间的交互。其创建循环图的能力优化了应用程序的性能和灵活性，便于在单一环境中集成多样化的功能。借助 LangGraph，开发者可以实现更连贯和有效的解决方案，改变传统的对话系统开发方法。

## 设计语音助手流程



该过程始于用户的语音捕获，语音被转换为文本以进行处理。该文本作为决策节点的输入，评估用户的请求并确定从四个可用选项中执行哪些任务：

1. 在日历中安排会议。
2. 撰写包含特定信息的电子邮件。
3. 通过互联网搜索回答问题。
4. 计划旅行，包括寻找航班、酒店以及为季节选择合适的衣物建议。

通过允许助手同时执行多个任务，这种配置不仅提升了用户体验，还展示了LangGraph框架在构建复杂对话系统方面的多功能性和强大能力。

## 构建语音组件

要构建语音组件，我们需要一个语音到文本的组件和一个文本到语音的组件。

下面是这两个组件的代码：

* **语音转文本**


```python
import speech_recognition as sr
from assistant import config as cfg


def parse_voice() -> tuple[bool, str]:
    r = sr.Recognizer()
    with sr.Microphone() as source:
        recognized = False
        try:
            r.pause_threshold = 1.5
            r.adjust_for_ambient_noise(source)
            audio_data = r.listen(source)
            text = r.recognize_google(audio_data, language=cfg.SELECTED_LANGUAGE)
            recognized = True

        except sr.UnknownValueError:
            text = cfg.LANGUAGE_MSG["unknown_value"][cfg.SELECTED_LANGUAGE]

        except sr.RequestError:
            text = cfg.LANGUAGE_MSG["request_error"][cfg.SELECTED_LANGUAGE]

        except sr.WaitTimeoutError:
            text = cfg.LANGUAGE_MSG["request_error"][cfg.SELECTED_LANGUAGE]

    return recognized, text
```
* **文本转语音**


```python
def play_audio(text: str) -> None:
    myobj = gTTS(text=text, lang=cfg.MSG_SELECTED_LANGUAGE, slow=False)

    mp3_fp = io.BytesIO()
    myobj.write_to_fp(mp3_fp)
    mp3_fp.seek(0)

    audio = AudioSegment.from_file(mp3_fp, format="mp3")
    audio = audio.speedup(playback_speed=cfg.AUDIO_SPEED)

    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_mp3:
        audio.export(temp_mp3.name, format="mp3")
        temp_filename = temp_mp3.name

    pygame.mixer.init()
    pygame.mixer.music.load(temp_filename)
    pygame.mixer.music.play()

    while pygame.mixer.music.get_busy():
        pygame.time.Clock().tick(10)
```
**构建多代理流程**

在语音组件正常工作后，我们继续构建语音助手的核心，换句话说，就是从接收到输入到获得响应的整个流程。为此，我们利用图形和子图，以便拥有一个多代理、可扩展和细粒度的调度器，使流程保持可维护和可复制。


```python
def build_assistant_graph() -> CompiledGraph: 
    graph_builder = StateGraph(GraphState) 
    graph_builder.add_node(Node.DECIDER.value, decider_node) 
    graph_builder.add_edge(START, Node.DECIDER.value) 
    graph_builder.add_conditional_edges( 
        Node.DECIDER.value, 
        route_tasks_nodes, 
        [Graph.MAIL.value, Graph.CALENDAR.value, Graph.TRAVEL.value, Graph.QUESTION.value, END], 
    ) 

    graph_builder.add_node(Graph.MAIL.value, mail_graph) 
    graph_builder.add_node(Graph.CALENDAR.value, calendar_graph) 
    graph_builder.add_node(Graph.TRAVEL.value, travel_graph) 
    graph_builder.add_node(Graph.QUESTION.value, question_graph) 

    graph_builder.add_edge(Graph.MAIL.value, END) 
    graph_builder.add_edge(Graph.CALENDAR.value, END) 
    graph_builder.add_edge(Graph.TRAVEL.value, END) 
    graph_builder.add_edge(Graph.QUESTION.value, END) 

    return graph_builder.compile() 
```
在前面的代码（对应于图1）中，可以看到如何定义主图，其中调用了一个决策节点，并通过其余子图并行路由响应：

子图的一个例子是旅行组件：


```python
def build_travel_graph() -> CompiledGraph: 
    graph_builder = StateGraph(ViajeState) 
    graph_builder.add_node(TravelNode.PARSER.value, parser_travel_node) 
    graph_builder.add_node(TravelNode.FLIGHTS.value, flights_node) 
    graph_builder.add_node(TravelNode.PACKING.value, packagin_node) 
    graph_builder.add_edge(START, TravelNode.PARSER.value) 

    graph_builder.add_conditional_edges( 
        TravelNode.PARSER.value, 
        route_travel_nodes, 
        [ 
            TravelNode.FLIGHTS.value, 
            TravelNode.PACKING.value, 
        ], 
    ) 

    graph_builder.add_node(TravelNode.BOOK.value, book_node) 
    graph_builder.add_edge(TravelNode.FLIGHTS.value, TravelNode.BOOK.value) 
    graph_builder.add_edge(TravelNode.BOOK.value, END) 
    graph_builder.add_edge(TravelNode.PACKING.value, END) 

    return graph_builder.compile() 
```
节点是执行特定功能的代理。在这种情况下，决策者是一个调用 gpt-4o-mini 模型的过程，根据输入决定执行哪个节点，而其余节点则覆盖其他功能，例如通过 tavily 搜索答案或通过 API 连接客户端以搜索航班、酒店等。

决策 Pydantic 模型：


```python
class DeciderOptions(BaseModel):
    mail: bool
    calendar: bool
    travel: bool
    question: bool
```
旅行组织节点：

**注意**：API 连接尚未开发，因为我们希望展示 LangGraph 的功能。


```python
...

def parser_travel_node(state: ViajeState) -> dict[str, Any]: 
    travel_chain = build_travel_chain() 
    user_input = state["travel_input"] 
    res = travel_chain.invoke({"text": user_input}) 

    return {"travel": res} 

def flights_node(state: TravelState) -> dict[str, str]:
    # TODO: 开发 API 组件以推荐航班，如果日期不具体，或在确切日期购买机票
    formatted_string = cfg.LANGUAGE_MSG["flights_output"][cfg.MSG_SELECTED_LANGUAGE].format(
        destination=state["travel"].destination,
        date=state["travel"].date
    )
    return {"flights_output": formatted_string}
...
```

## 下一步

我们的重点是扩展功能，增强用户体验，并加强应用程序的基础设施，以支持更广泛的能力。下一步将分为三个主要阶段：

**1\. 功能操作的API集成**

初始开发阶段将涉及构建API集成，以扩展助手的能力，使用户能够无缝地与基本服务进行交互。此阶段将专注于以下关键操作：

* **酒店和航班预订**：实施API以访问酒店和航空公司预订平台，使用户能够通过语音命令直接检查可用性、进行预订和确认预订。
* **日历管理**：启用日历API集成，以允许助手设置、修改和发送会议邀请，提供免提的日程安排体验。
* **电子邮件自动化**：与电子邮件服务集成，允许助手发送、阅读和分类电子邮件，使用户能够更有效地管理他们的收件箱。

**2\. 用户界面和体验优化**

随着应用程序核心功能的扩展，下一阶段将专注于专业化用户体验，以确保其符合行业标准并增强用户满意度。重点领域将包括：

* **前端重新设计**：全面的用户界面刷新，以现代化应用程序外观，使其视觉上吸引人且易于导航。这可能涉及采用干净、简约的设计，并使用用户友好的元素直观地引导用户使用应用程序的功能。
* **语音交互优化**：提高语音识别和响应系统的准确性、响应性和个性化。这包括优化语音提示，使其听起来自然，改善上下文理解，并确保助手在各种使用案例中准确响应。

**3\. 基础设施扩展和优化**

为了支持新功能，并确保应用程序能够处理随着采用增长而增加的需求，建立强大的基础设施至关重要。此阶段将优先考虑：

* **可扩展的云基础设施**：过渡到可扩展的云解决方案，能够处理高负载，支持快速扩展，并提供冗余以保持正常运行时间。
* **数据安全和合规性**：实施严格的安全协议，包括数据加密、安全的API通信和GDPR合规性，以保护用户数据并增强信任。
* **性能监控和优化**：建立对系统性能和API正常运行时间的持续监控，使我们能够主动识别和解决问题。这可能包括设置自动警报系统和优化服务器响应时间。

## 结论

在本文中，我们探讨了如何使用 LangGraph 开发语音助手，强调了其框架在协调复杂系统中的重要性。通过实现一个将语音输入转换为文本并使用决策节点管理各种任务的流程，例如安排会议、撰写电子邮件、回答问题和组织旅行，我们展示了 LangGraph 在创建先进对话应用程序中的多样性。

此外，我们详细说明了在不同操作系统上安装必要音频组件的步骤，使实时语音捕获和播放成为可能。这种集成对于提供流畅有效的用户体验至关重要。通过将 LangGraph 的强大功能与音频处理能力相结合，我们为一个强大且功能齐全的语音助手奠定了基础，该助手能够适应动态人工智能环境中用户不断变化的需求。随着语音技术的不断发展，改善和扩展这一助手的可能性是无穷无尽的，为人机交互的未来创新打开了大门。

您可以在 [这里](https://github.com/dimc26/langgraph-multiagent-app) 查看完整代码。

