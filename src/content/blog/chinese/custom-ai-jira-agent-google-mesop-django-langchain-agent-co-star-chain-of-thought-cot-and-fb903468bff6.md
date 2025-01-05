---
title: "如何用AI简化Jira管理？揭秘定制AI Jira助手的惊艳新境界！"
meta_title: "如何用AI简化Jira管理？揭秘定制AI Jira助手的惊艳新境界！"
description: "本文介绍了一个开源项目——AI Jira Assistant，该项目结合Google Mesop、Django、LangChain Agents等技术，通过Jira API实现Jira工单的自动化管理。项目旨在利用大型语言模型（LLM）推理能力自动分类工单，并为用户提供自然语言交互的便利。文章详细阐述了项目的架构、关键技术定义、Django REST框架的使用、LangChain代理工具的自定义以及Jira API的示例，最终展望了通过代码生成实现更高程度自动化的可能性。所有代码可在GitHub上获取。"
date: 2025-01-05T02:24:15Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*VsgJSpQudOXJpMbGe5nhgA.jpeg"
categories: ["Programming", "Technology/Web", "Chatbots"]
author: "Rifx.Online"
tags: ["Jira", "Mesop", "Django", "LangChain", "CO-STAR"]
draft: False

---

### 我如何使用 Google Mesop、Django、LangChain Agents、CO\-STAR 和 Chain\-of\-Thought (CoT) 提示结合 Jira API 更好地自动化 Jira



这个项目的灵感来自于我为内部用户开发的一个网页应用上的 Jira 工单创建工具。我还在系统错误发生时添加了自动创建 Jira 工单的功能。

用户和系统错误通常会创建类似的工单，因此我想看看 LLM 的推理能力是否可以用来自动对工单进行分类，通过链接相关问题、创建用户故事、接受标准和优先级。

此外，给予用户和产品/管理利益相关者更方便的方式直接用自然语言与 Jira 互动，而无需任何技术能力，这也是一个有趣的前景。

[Jira](https://www.atlassian.com/software/jira) 在软件开发中已变得无处不在，现在是项目管理的领先工具。

具体来说，大型语言模型 (LLM) 和代理研究的进展意味着在这一领域有机会实现显著的生产力提升。

与 Jira 相关的任务非常适合自动化，因为这些任务以文本的形式存在，具有高度的重复性，相对低风险和低复杂性。

在下面的文章中，我将展示我的开源项目——AI Jira Assistant：一个通过 AI 代理与 Jira 互动的聊天界面，配有自定义的 AI 代理工具来对新创建的 Jira 工单进行分类。

所有代码都已通过文章末尾的 GitHub 仓库提供。

该项目利用 LangChain agents，通过 Django (使用 PostgreSQL) 和 Google Mesop 提供服务。服务在 Docker 中提供，以便本地运行。

提示策略包括 CO\-STAR 系统提示、Chain\-of\-Thought (CoT) 推理和少量示例提示。

本文将包括以下几个部分。

1. 定义
2. Mesop 接口：Streamlit 还是 Mesop？
3. Django REST 框架
4. 自定义 LangChain 代理工具和提示
5. Jira API 示例
6. 下一步

## 1\. 定义

首先，我想介绍一些与项目密切相关的高层次定义。

### AI Jira Assistant

这里介绍的开源项目在本地运行时如下所示。

包括一个用于用户提示的聊天界面、预填充聊天界面的示例提示、一个显示模型响应的框以及一个清除模型响应的按钮。

项目中主要技术挑战的代码片段进行了详细讨论。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*0IY-30gJ9ycp2u6vs8rNVw.png)

### 什么是 Google Mesop？

Mesop 是一个相对较新的（2023）Python Web 框架，用于 Google 的快速 AI 应用开发。

“Mesop 提供了多达 30 个组件的多功能范围，从低级构建模块到高级 AI 重点组件。这种灵活性使您能够快速原型化 ML 应用或构建自定义 UI，所有这些都在一个适应您项目用例的单一框架内。” — Mesop 首页

### 什么是 AI 代理？

代理软件范式的起源来自于“代理”一词，它是一个可以观察其环境并对其进行操作的软件程序。

“人工智能（AI）代理是一个可以与其环境互动、收集数据并使用这些数据执行自我决定任务以实现预定目标的软件程序。

人类设定目标，但 AI 代理独立选择为实现这些目标所需执行的最佳行动。

AI 代理是理性代理。它们根据其感知和数据做出理性决策，以产生最佳性能和结果。

AI 代理通过物理或软件接口感知其环境。” — AWS 网站

### 什么是 CO\-STAR 提示？

这是一个关于提示格式的指南，其中包含以下标题：背景、目标、风格、语气、受众和回应。这被广泛接受为提高大型语言模型（LLMs）输出的有效方法。

“CO\-STAR 框架是新加坡政府科技局数据科学与人工智能团队的创意，是一个便捷的提示结构模板。

它考虑了影响大型语言模型回应的有效性和相关性的所有关键方面，从而产生更优的回应。” — Sheila Teo 的 Medium 文章

### 什么是链式思维（CoT）提示？

最初在谷歌的一篇论文中提出；[Wei et al. (2022\).](https://arxiv.org/pdf/2201.11903) 链式思维（CoT）提示是指提供少量示例的中间推理步骤。这被证明可以改善模型输出的常识推理能力。

### 什么是Django？

Django是一个更复杂且广泛使用的Python框架。

“Django是一个高层次的Python Web框架，鼓励快速开发和简洁、务实的设计。它是免费的开源软件。” — Django主页

### 什么是 LangChain？

LangChain 是支持 LLM 应用程序的较知名的开源库之一，包括与此项目相关的代理和提示。

“LangChain 的灵活抽象和以 AI 为中心的工具包使其成为开发者在使用 GenAI 时的首选。加入 1M+ 构建者，标准化他们在 LangChain 的 Python 和 JavaScript 框架中的 LLM 应用开发。” — LangChain 网站

## 2\. Mesop 接口：Streamlit 还是 Mesop？

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*DGFLQWKGJBCOuxViJKstGA.jpeg)

我在专业上广泛使用 [Streamlit](https://streamlit.io/) 来托管生成式 AI 应用程序，我的工作示例可以在 [这里](https://wan-ifra.org/2024/10/how-uks-reach-is-using-ai-to-help-produce-more-content-faster/) 找到。

从高层次来看，Streamlit 是一个可比的开源 Python Web 框架。

有关 Streamlit 的更多信息，请参阅我其他的 Medium 文章，其中详细讨论了它。

这是第一次在实际应用中使用 Mesop，因此我认为进行比较可能会很有用。

Mesop 旨在提供对组件 CSS 样式的更细粒度控制，并与 JS Web 注释原生集成。Mesop 在本地运行时还具有有用的调试工具。根据我的经验，我还会说多页面应用程序功能更易于使用。

然而，这确实意味着对于不太熟悉 CSS 样式的机器学习从业者来说，进入门槛更高（包括我自己）。Streamlit 也有更大的社区支持。

从代码片段中，我们可以设置不同的页面路由。该项目仅包含两个页面：主页面和错误页面。

```python
import mesop as me

## local imports
try:
    from .utils import ui_components
except Exception:
    from utils import ui_components

@me.page(path="/")
def page(security_policy=me.SecurityPolicy(dangerously_disable_trusted_types=True)):
    with me.box(
        style=me.Style(
            background="#fff",
            min_height="calc(100% - 48px)",
            padding=me.Padding(bottom=16),
        )
    ):
        with me.box(
            style=me.Style(
                width="min(800px, 100%)",
                margin=me.Margin.symmetric(horizontal="auto"),
                padding=me.Padding.symmetric(
                    horizontal=16,
                ),
            )
        ):
            ui_components.header_text()
            ui_components.example_row()
            ui_components.chat_input()
            ui_components.output()
            ui_components.clear_output()
    ui_components.footer()

@me.page(path="/error")
def error(security_policy=me.SecurityPolicy(dangerously_disable_trusted_types=True)):
    with me.box(
        style=me.Style(
            background="#fff",
            min_height="calc(100% - 48px)",
            padding=me.Padding(bottom=16),
        )
    ):
        with me.box(
            style=me.Style(
                width="min(720px, 100%)",
                margin=me.Margin.symmetric(horizontal="auto"),
                padding=me.Padding.symmetric(
                    horizontal=16,
                ),
            )
        ):
            ui_components.header_text()
            ui_components.render_error_page()
    ui_components.footer()
```

错误页面包含一个按钮，用于重定向到主页。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*q4YqAm1bZw8AccStl9diYw.png)

这里包含了触发重定向到主页的代码。

```python
def navigate_home(event: me.ClickEvent):
    me.navigate("/")

def render_error_page():
    is_mobile = me.viewport_size().width < 640
    with me.box(
        style=me.Style(
            position="sticky",
            width="100%",
            display="block",
            height="100%",
            font_size=50,
            text_align="center",
            flex_direction="column" if is_mobile else "row",
            gap=10,
            margin=me.Margin(bottom=30),
        )
    ):
        me.text(
            "发生错误",
            style=me.Style(
                text_align="center",
                font_size=30,
                font_weight=700,
                padding=me.Padding.all(8),
                background="white",
                justify_content="center",
                display="flex",
                width="100%",
            ),
        )
        me.button(
            "导航到主页", 
            type="flat",
            on_click=navigate_home
        )
```

我们还必须创建 State 类，这样可以在事件循环中保留数据。

```python
import mesop as me

@me.stateclass
class State:
    input: str
    output: str
    in_progress: bool
```

要清除界面上的模型输出，我们可以将输出变量分配为空字符串。还有不同的 [按钮支持类型](https://google.github.io/mesop/components/button/#overview)，截至撰写时包括：默认、凸起、平坦和描边。

```python
def clear_output():
    with me.box(style=me.Style(margin=me.Margin.all(15))):
        with me.box(style=me.Style(display="flex", flex_direction="row", gap=12)):
            me.button("清除输出", type="flat", on_click=delete_state_helper)

def delete_state_helper(ClickEvent):
    config.State.output = ""
```

为了自动填充聊天界面中的示例提示，我们使用按钮的 onclick 事件，通过更新状态来实现。

```python
def example_row():
    is_mobile = me.viewport_size().width < 640
    with me.box(
        style=me.Style(
            display="flex",
            flex_direction="column" if is_mobile else "row",
            gap=10,
            margin=me.Margin(bottom=40),
        )
    ):
        for example in config.EXAMPLE_PROMPTS:
            prompt_box(example, is_mobile)

def prompt_box(example: str, is_mobile: bool):
    with me.box(
        style=me.Style(
            width="100%" if is_mobile else 200,
            height=250,
            text_align="center",
            background="#F0F4F9",
            padding=me.Padding.all(16),
            font_weight=500,
            line_height="1.5",
            border_radius=16,
            cursor="pointer",
        ),
        key=example,
        on_click=click_prompt_box,
    ):
        me.text(example)

def click_prompt_box(e: me.ClickEvent):
    config.State.input = e.key
```

同样，要向 Django 服务发送请求，我们使用下面的代码片段。我们使用 [海象运算符](https://www.geeksforgeeks.org/walrus-operator-in-python-3-8/) (:=) 来判断请求是否收到了有效的响应（状态码 200），并将输出附加到状态中，以便在 UI 中呈现，否则我们将用户重定向到之前讨论的错误页面。

```python
def chat_input():
    with me.box(
        style=me.Style(
            padding=me.Padding.all(8),
            background="white",
            display="flex",
            width="100%",
            border=me.Border.all(me.BorderSide(width=0, style="solid", color="black")),
            border_radius=12,
            box_shadow="0 10px 20px #0000000a, 0 2px 6px #0000000a, 0 0 1px #0000000a",
        )
    ):
        with me.box(
            style=me.Style(
                flex_grow=1,
            )
        ):
            me.native_textarea(
                value=config.State.input,
                autosize=True,
                min_rows=4,
                placeholder="输入你的提示",
                style=me.Style(
                    padding=me.Padding(top=16, left=16),
                    background="white",
                    outline="none",
                    width="100%",
                    overflow_y="auto",
                    border=me.Border.all(
                        me.BorderSide(style="none"),
                    ),
                ),
                on_blur=textarea_on_blur,
            )
        with me.content_button(type="icon", on_click=click_send):
            me.icon("send")

def click_send(e: me.ClickEvent):
    if not config.State.input:
        return
    config.State.in_progress = True
    input = config.State.input
    config.State.input = ""
    yield

    if result := api_utils.call_jira_agent(input):
        config.State.output += result
    else:
        me.navigate("/error")

    config.State.in_progress = False
    yield

def textarea_on_blur(e: me.InputBlurEvent):
    config.State.input = e.value
```

为完整起见，我提供了请求代码，以便向 Django 端点运行 AI Jira Agent。

```python
import requests

## local imports
from . import config

def call_jira_agent(request):
    try:
        data = {"request": request}
        if (response := requests.post(f"{config.DJANGO_URL}api/jira-agent/", data=data)) and \
        (response.status_code == 200) and \
        (output := response.json().get("output")):
            return f"请求: {request}<br>输出: {output}<br><br>"
    except Exception as e:
        print(f"ERROR call_jira_agent: {e}")
```

为了在本地运行，我包含了相关的 Docker 和 Docker compose 文件。

这个用于运行 Mesop 的 Docker 文件是通过 Mesop 项目主页提供的。

Docker compose 文件由三个服务组成：后端 Django 应用程序、前端 Mesop 应用程序和一个与 Django 应用程序配合使用的 PostgreSQL 数据库实例。

我想特别提到传递到 Mesop Docker 容器的环境变量 PYTHONUNBUFFERED=1，确保 Python 输出、stdout 和 stderr 流被发送到终端。使用推荐的 Mesop 应用程序 Docker 镜像时，我花了一些时间来确定未看到应用程序输出的根本原因。

DOCKER_RUNNING=true 环境变量是一种约定，用于简单地确定应用程序是在 Docker 内运行，还是例如在虚拟环境中运行。

重要的是要指出，环境变量将通过 config 子目录中引用的 config.ini 配置文件中的 env_file 元素进行填充。

要运行该项目，您必须用您的 Open AI 和 Jira 凭据填充此配置文件。

## 3\. Django REST framework

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*5pTNbNWMr81ucvsqPMnCig.jpeg)

Django 是一个 Python 网络框架，提供了许多开箱即用的实用功能。

它可以与 Flask 或 FastAPI 等框架相媲美，但需要一些额外的设置，并且学习曲线较陡峭。

如果你想了解更多关于 Flask 的信息，请查看我下面的文章。

在本文中，我将涵盖应用、模型、序列化器、视图和 PostgreSQL 数据库集成。

应用是一个逻辑上独立的网络应用，具有特定的目的。

在我们的例子中，我们将应用命名为“api”，并通过运行以下命令创建它。

```python
django-admin startapp api
```

在 views.py 文件中，我们定义我们的 API 端点。

> “视图函数，简称 *view*，是一个 Python 函数，它接受一个网络请求并返回一个网络响应。这个响应可以是网页的 HTML 内容，或重定向，或 404 错误，或 XML 文档，或图像……实际上可以是任何东西。视图本身包含返回该响应所需的任意逻辑。” — [Django 网站](https://docs.djangoproject.com/en/5.1/topics/http/views/)

Django 视图的端点路由在应用的 urls.py 文件中定义，如下所示。urls.py 文件在应用初始化时创建。我们在这个项目中有三个端点；一个健康检查端点，一个返回数据库中所有记录的端点，以及一个处理调用 AI 代理的端点。

视图被声明为类，这是 Django 中的标准约定。请查看完整的文件。

大部分代码是自解释的，尽管这个代码片段很重要，因为它将模型数据保存到数据库中。

```python
modelRequest = models.ModelRequest(request=request, response=response)
modelRequest.save()
```

下面的代码片段返回 ModelRequest 模型中数据库的所有记录，我将接下来讲解模型。

```python
class GetRecords(APIView):
    def get(self, request):
        """获取请求记录端点"""
        data = models.ModelRequest.objects.all().values()
        return Response({'result': str(data)})
```

> “模型是关于你的数据的唯一、权威的信息来源。它包含你所存储数据的基本字段和行为。通常，每个模型映射到一个单独的数据库表。” — [Django 网站](https://docs.djangoproject.com/en/5.1/topics/db/models/#:~:text=A%20model%20is%20the%20single,.db.models.Model%20.)

我们这个项目的模型很简单，因为我们只想存储用户请求和最终模型输出，这两者都是文本字段。

\_\_str\_\_ 方法是一个常见的 Python 约定，例如，在 print 函数中默认调用。该方法的目的是返回对象的人类可读字符串表示。

序列化器将模型中的字段映射以验证输入和输出，并将更复杂的数据类型转换为 Python 数据类型。这可以在之前详细介绍的 views.py 中看到。

> “ModelSerializer 通常指的是 Django REST 框架 (DRF) 的一个组件。Django REST 框架是一个流行的工具包，用于在 Django 应用程序中构建 Web API。它提供了一组工具和库，以简化构建 API 的过程，包括序列化器。

> ModelSerializer 类提供了一种快捷方式，让你可以自动创建一个与模型字段相对应的序列化器类。

> ModelSerializer 类与常规的序列化器类相同，只是：

> 它将根据模型自动生成一组字段。

> 它将自动为序列化器生成验证器，例如 unique_together 验证器。

> 它包括 .create() 和 .update() 的简单默认实现。” — [Geeks for geeks](https://www.geeksforgeeks.org/serializers-django-rest-framework/)

项目的完整 serializers.py 文件如下。

为了进行 PostgreSQL 数据库集成，settings.py 文件中的配置必须与 database.ini 文件匹配。

默认的数据库设置必须更改为指向 PostgreSQL 数据库，因为这不是 Django 的默认数据库集成。

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'vectordb', 
        'USER': 'testuser',
        'PASSWORD': 'testpwd',
        'HOST': 'db' if DOCKER_RUNNING else '127.0.0.1', 
        'PORT': '5432',
    }
}
```

database.ini 文件在初始化时定义 PostgreSQL 数据库的配置。

为了确保在 Docker 容器运行后应用数据库迁移，我们可以使用一个 bash 脚本来应用迁移，然后运行服务器。自动运行迁移将意味着数据库在 Django 源控制中的任何定义更改时总是会被修改，这在长远来看节省了时间。

Dockerfile 的入口点随后被更改为指向 bash 脚本，使用 CMD 指令。

## 4\. 自定义 LangChain 代理工具和提示

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*YHOziD_MsYJ3z8rvfrf35A.jpeg)

我正在使用现有的 LangChain 代理功能，并结合 [Jira 工具包](https://python.langchain.com/docs/integrations/tools/jira/)，这是一个围绕 Atlassian Python API 的封装。

默认库开箱即用，非常有用，尽管有时在提示方面需要一些反复试验，但我认为随着该领域研究的进展，情况应该会有所改善。

然而，对于这个项目，我想为代理添加一些自定义工具。这可以在下面的 `triage` 函数中看到，使用了 @tool 装饰器。

函数类型提示和工具的注释描述对于向代理传达调用时的期望是必要的。函数返回的字符串被代理观察，在这种情况下，我们简单返回“任务完成”，这样代理就停止进行下一步。

自定义 triage 工具执行以下步骤：

* 获取项目的所有未解决 Jira 票据
* 获取代理正在进行 triage 的 Jira 问题键的描述和摘要
* 与所有未解决票据进行异步 LLM 基于文本的比较，并自动标记看起来相关的票据，然后使用 Jira API 将它们链接起来
* 然后使用 LLM 生成用户故事、验收标准和优先级，将此模型结果作为主票据的注释

```python
from langchain.agents import AgentType, initialize_agent
from langchain_community.agent_toolkits.jira.toolkit import JiraToolkit
from langchain_community.utilities.jira import JiraAPIWrapper
from langchain_openai import OpenAI
from langchain.tools import tool
from langchain_core.prompts import ChatPromptTemplate, FewShotChatMessagePromptTemplate

llm = OpenAI(temperature=0)

@tool
def triage(ticket_number:str) -> None:
    """triage a given ticket and link related tickets"""
    ticket_number = str(ticket_number)
    all_tickets = jira_utils.get_all_tickets()
    primary_issue_key, primary_issue_data = jira_utils.get_ticket_data(ticket_number)
    find_related_tickets(primary_issue_key, primary_issue_data, all_tickets)
    user_stories_acceptance_criteria_priority(primary_issue_key, primary_issue_data)
    return "Task complete"

jira = JiraAPIWrapper()
toolkit = JiraToolkit.from_jira_api_wrapper(jira)
agent = initialize_agent(
    toolkit.get_tools() + [triage], 
    llm, 
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, 
    verbose=True, 
    max_iterations=5,
    return_intermediate_steps=True
)
```

这两个 LLM 任务使用 CO\-STAR 系统提示和思维链少量提示策略。因此，我将这些任务抽象为 LLMTask 类。

它们在以下代码片段中被实例化。可以说，我们可以为每个任务尝试不同的 LLM，尽管出于时间考虑，我没有进行任何实验——如果您拉取了代码库并有任何经验分享，请随时在下面评论。

```python
class LLMTask:
    def __init__(self, system_prompt, examples, llm):
        self.system_prompt = system_prompt
        self.examples = examples
        self.llm = llm

    def construct_prompt(self):
        example_prompt = ChatPromptTemplate.from_messages(
            [
                ("human", "{input}"),
                ("ai", "{output}"),
            ]
        )     
        few_shot_prompt = FewShotChatMessagePromptTemplate(
            example_prompt=example_prompt,
            examples=self.examples,
        )     
        return ChatPromptTemplate.from_messages(
            [
                ("system", self.system_prompt),
                few_shot_prompt,
                ("human", "{input}"),
            ]
        )
  
    def run_llm(self, input):
        chain = self.construct_prompt() | self.llm 
        return chain.invoke({"input": input})

product_model = LLMTask(system_prompts.get("system_prompt_product"), example_prompts.get("examples_product"), llm)
linking_model = LLMTask(system_prompts.get("system_prompt_linking"), example_prompts.get("examples_linking"), llm)
```

对于链接任务，CO\-STAR 系统提示如下。上下文、目标、风格、语气、受众和响应的标题是 CO\-STAR 方法的标准标题。我们定义上下文和输出，包括对模型结果的每个元素进行标记。

明确界定受众、风格和语气有助于确保模型输出适合商业环境。

```python
## CONTEXT #
I want to triage newly created Jira tickets for our software company by comparing them to previous tickets.
The first ticket will be in <ticket1> tags and the second ticket will be in <ticket2> tags. 

## OBJECTIVE #
Determine if two tickets are related if the issue describes similar tasks and return True in <related> tags, also include your thinking in <thought> tags.

## STYLE #
Keep reasoning concise but logical.

## TONE #
Create an informative tone.

## AUDIENCE #
The audience will be business stake holders, product stakeholders and software engineers.

## RESPONSE #
Return a boolean if you think the tickets are related in <related> tags and also return your thinking as to why you think the tickets are related in <thought> tags.
```

对于执行产品风格票据评估（用户故事、验收标准和优先级），系统提示如下。我们明确将优先级定义为 LOW、MEDIUM 或 HIGH。

我们还规定模型的风格为产品负责人/经理，传统上会进行此任务。

```python
## CONTEXT #
You are a product owner working in a large software company, you triage new tickets from their descriptions in <description> tags as they are raised from users.

## OBJECTIVE #
From the description in <description> tags, you should write the following; user stories in <user_stories> tags, acceptance criteria in <acceptance_criteria> tags and priority in <priority>.
Priority must be either LOW, MEDIUM OR HIGH depending on the what you deem is most appropriate for the given description.
Also include your thinking in <thought> tags for the priority.

## STYLE #
Should be in the style of a product owner or manager.

## TONE #
Use a professional and business oriented tone.

## AUDIENCE #
The audience will be business stake holders, product stakeholders and software engineers.

## RESPONSE #
Respond with the following format.
User stories in <user_stories> tags.
Acceptance criteria in <acceptance_criteria> tags.
Priority in <priority> tags.
```

我现在将提供用于链接 Jira 票据的思维链少量提示，我们将两个票据的摘要和描述分别放在 <issue1> 和 <issue2> 标签中。模型的思维被捕捉在 <thought> 标签中，这构成了思维链元素。

少量提示的名称来自于向模型输入多个示例的情况。

<related> 标签包含判断两个票据是否相关的信息，如果模型认为它们相关，则返回值为 True。

我们稍后将使用正则表达式解析模型输出，并有一个辅助函数通过 Jira API 链接相关票据，所有 Jira API 辅助函数将在文章后面提供。

```python
    "examples_linking": [
        {
            "input": "<issue1>Add Jira integration ticket creation Add a Jira creation widget to the front end of the website<issue1><issue2>Add a widget to the front end to create a Jira Add an integration to the front end to allow users to generated Jira tickets manually<issue2>",
            "output": "<related>True<related><thought>Both tickets relate to a Jira creation widget, they must be duplicate tickets.<thought>"
        },
        {
            "input": "<issue1>Front end spelling error There is a spelling error for the home page which should read 'Welcome to the homepage' rather than 'Wellcome to the homepage'<issue1><issue2>Latency issue there is a latency issue and the calls to the Open AI should be made asynchronous<issue2>",
            "output": "<related>False<related><thought>The first ticket is in relation to a spelling error and the second is a latency, therefore they are not related.<thought>"
        },
        {
            "input": "<issue1>Schema update We need to add a column for model requests and responses<issue1><issue2>Update schema to include both model requests and model responses Add to two new additional fields to the schema<issue2>",
            "output": "<related>True<related><thought>Both tickets reference a schema update with two new fields for model requests and model responses, therefore they must be related.<thought>"
        }
    ]
```

同样，对于票据评估，用户故事放在 <user_stories> 标签中，验收标准放在 <acceptance_criteria> 标签中，优先级放在 <priority> 标签中。<thought> 标签也用于捕捉模型在优先级方面的推理。

所有示例均由我手动注释。

```python
    "examples_product": [
        {
            "input": "<description>Add Jira integration ticket creation Add a Jira creation widget to the front end of the website<description>",
            "output": "<user_stories>As a user, I want to be able to create a Jira ticket directly from the website.\nAs a product owner, I want to streamline the process of creating Jira tickets for our team.<user_stories>\n<acceptance_criteria>The Jira creation widget should be easily accessible on the front end of the website.\nThe widget should allow users to input all necessary information for a Jira ticket, such as title, description, and assignee.\nOnce submitted, the widget should create a new Jira ticket in the designated project.\nThe widget should have proper error handling in case of any issues with creating the ticket.<acceptance_criteria>\n<priority>MEDIUM<priority>\n<thought>By adding a Jira integration and creation widget to the website, we can improve the efficiency and accuracy of creating Jira tickets for our team. This will ultimately save time and resources for both the business and the development team. Though there is no immediate need for this to be completed. Therefore, I believe this ticket should be prioritized as MEDIUM.<thought>"
        },
        {
            "input": "<description>Urgent schema update We need to add a column for model requests and responses for compliance<description>",
            "output": "<user_stories>As a developer, I want to be able to view and track model requests and responses for compliance purposes.\nAs a product owner, I want to ensure our system is compliant with regulations and standards.<user_stories>\n<acceptance_criteria>A new column should be added to the schema for model requests and responses.\nThe column should accurately track and store all relevant information for compliance purposes.\nThe column should be easily accessible and viewable for authorized users.\nThe update should not disrupt any existing functionality of the system.<acceptance_criteria>\n<priority>HIGH<priority>\n<thought>This ticket is marked as urgent, indicating that it is a high priority for the business. Compliance is a critical aspect of our business and it is important that we address this issue as soon as possible. By adding a new column for model requests and responses, we can ensure that our system is compliant and avoid any potential legal or regulatory issues. Therefore, I believe this ticket should be prioritized as HIGH.<thought>"
        },
        {
            "input": "<description>Homepage CSS error There is a CSS error for the homepage which is affecting a call to action button and negatively impacting conversion<description>",
            "output": "<user_stories>As a user, I want the CSS error on the homepage to be fixed so that I can easily access the call to action button.\nAs a product owner, I want to improve the conversion rate of our website by fixing any CSS errors.<user_stories>\n<acceptance_criteria>The CSS error should be identified and fixed on the homepage.\nThe call to action button should be easily visible and accessible for users.\nThe fix should not affect any other functionality of the website.<acceptance_criteria>\n<priority>HIGH<priority>\n<thought>This CSS error is directly impacting the conversion rate of our website, which is a key metric for our business. It is important that we address this issue as soon as possible to improve the user experience and ultimately increase conversions. Therefore, I believe this ticket should be prioritized as HIGH.<thought>"
        }
    ],
```

该代码片段使用多线程方法并发链接 Jira 问题。这将大大减少与项目中的所有开放票据进行配对比较所需的时间，以确定它们是否相关。

```python
def check_issue_and_link_helper(args):
    key, data, primary_issue_key, primary_issue_data = args
    if key != primary_issue_key and \
    llm_check_ticket_match(primary_issue_data, data):
        jira_utils.link_jira_issue(primary_issue_key, key) 

def find_related_tickets(primary_issue_key, primary_issue_data, issues):
    args = [(key, data, primary_issue_key, primary_issue_data) for key, data in issues.items()]
    with concurrent.futures.ThreadPoolExecutor(os.cpu_count()) as executor:
        executor.map(check_issue_and_link_helper, args)

def llm_check_ticket_match(ticket1, ticket2):
    llm_result = linking_model.run_llm(f"<ticket1>{ticket1}<ticket1><ticket2>{ticket2}<ticket2>")
    if ((result := jira_utils.extract_tag_helper(llm_result))) \
    and (result == 'True'):
        return True 
```

工具的一个示例工作流程，创建一个工单并进行分类。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*eGZ_mlkmoE7NRYB9wiiOqQ.png)

这些操作的结果被记录在Jira工单中。相关工单已自动链接，用户故事、验收标准、优先级和思考已作为Jira评论被记录。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*fV6iOvvdHutciX5VIjZLAA.png)

我们可以在Docker容器的打印语句中看到代理的中间步骤。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*urflhNCQpMlqja6SFvZJBA.png)

## 5\. Jira API 示例

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*w5rm3nqOrXwl27KGRpmo1Q.png)

在这个项目中，我明确使用的所有 [Jira REST API](https://developer.atlassian.com/server/jira/platform/rest/v10002/intro/#gettingstarted) 示例都已包括在下面，以便于查看。

用于解析模型结果的正则表达式提取辅助函数也包括在内。虽然也有一个用于 Jira 的 Python SDK，但我选择在此实例中使用 requests 库，以便更容易转换为其他编程语言。

## 6\. 下一步

自然的下一步是通过与源代码管理集成来实现代码生成，以实现几乎完全自动化的软件开发生命周期，结合人类参与，这可能是一个可行的解决方案。

我们已经看到，AI代码生成正在对企业产生影响——如果日常工作可以部分自动化，那么软件开发人员/产品从业者就可以专注于更有趣和更有意义的工作。

如果这篇文章引起了很多兴趣，也许我可以将其作为后续项目进行研究。

我希望您发现这篇文章富有启发性，正如承诺的那样——您可以在Github仓库中找到所有代码 [这里](https://github.com/lewisExternal/Custom-AI-Jira-Agent/tree/main)。

## 参考文献

* [https://google.github.io/mesop/getting\-started/quickstart/\#starter\-kit](https://google.github.io/mesop/getting-started/quickstart/#starter-kit)
* [https://www.django\-rest\-framework.org/\#example](https://www.django-rest-framework.org/#example)
* [https://blog.logrocket.com/dockerizing\-django\-app/](https://blog.logrocket.com/dockerizing-django-app/)


