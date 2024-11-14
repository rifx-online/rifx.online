---
title: "利用 CrewAI 构建自主多代理系统"
meta_title: "利用 CrewAI 构建自主多代理系统"
description: "本文介绍了如何使用CrewAI和LangChain构建自主多智能体系统。文章首先阐述了多智能体系统的概念，强调代理、工具和任务的协作关系。接着，详细描述了CrewAI框架的优势和项目结构，包括如何创建代理、定义任务和使用工具。通过一个论文写作项目示例，展示了代理如何收集信息、撰写和编辑内容。最后，使用Streamlit框架将应用程序部署，使用户能够与系统进行交互。整体上，文章强调了多智能体系统在提高任务效率和协作方面的潜力。"
date: 2024-11-14T03:29:09Z
image: "https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*72Cy_QqOie7G2NAiWr13Kw.jpeg"
categories: ["Autonomous Systems", "Programming", "Data Science"]
author: "Rifx.Online"
tags: ["CrewAI", "LangChain", "multi-agent", "Streamlit", "essay-writing"]
draft: False

---

### 什么是多智能体自主系统以及如何使用CrewAI和LangChain构建一个？



## 动机

实际上，我们对这些概念并不陌生；我们从电影中了解到它们。一个人指挥他们的AI，而AI通过使用各种工具来执行这些命令。这就是我们今天在AI系统崛起的道路上所走的方向。时代正在逐渐变化。在过去，人们无法独自完成一项任务，需要一个团队。没有团队，他们要么在一段时间后精疲力竭，要么达到能力的极限。最终，成功的项目来自于由具有不同技能的个人组成的团队。

> 团队合作使梦想成真。

然而，如今一种新技术开始崭露头角。我们可以称之为AGI之前的AI下一个阶段：“代理”。那么，这些代理是什么呢？在深入代码之前，让我们先谈谈多代理系统的结构。

## 它是如何工作的？

简单来说，这个方程式可以表示为：`Multi Agent Systems = AGENTs + TOOLs + TASKs` 这是一个多个代理配备了各种任务和工具的系统。

### 代理

我们熟悉角色扮演游戏，在这些游戏中，你的角色有一个角色，比如战士。例如。在游戏中，你将自己置于他们的位置，旨在通过完成塑造他们背景故事的任务，从一次冒险到下一次冒险来完成游戏。类似地，研究人员发现，当给大型语言模型 (LLMs) 角色、背景故事和目标时，它们可以被激励以最佳方式执行任务。这使我们能够通过几个简单的提示来激励 LLM 执行各种任务。

代理本质上将分配的任务分解为简单的步骤，然后通过“思考”——是的，思考——按顺序执行这些步骤。这使我们能够创建一个不仅能深思熟虑地执行步骤的代理，还能咨询其他具有不同专业领域的代理，而不是依赖单个 LLM 输入提示并接收输出。

### 工具

人类最伟大的能力之一无疑是我们使用工具的技能。这种能力通过进化和文化过程不断演变和发展，使我们能够创造出今天所使用的先进技术。同样，大型语言模型随着训练在更大数据集上的能力也在不断增强。现在，当工具的功能及其使用方式被清晰解释时，这些模型能够在适当条件下自主使用工具，完全自动执行，并根据输出规划下一步，而无需等待进一步的命令。

因此，工具的使用也可以被视为它们进化中最重要的部分之一。尤其是通过互联网浏览工具，代理可以按照指定功能的步骤访问必要的资源，无论是通过网络爬虫还是使用指定网站的搜索引擎。

您工具的功能和目的完全取决于您的想象力。然而，如果您希望将预构建的工具集成到您的代理中，CrewAI 和 LangChain 库都提供了广泛的内置工具供您使用。在这个项目中，我们将重点创建我们自己的自定义工具。

### 任务

就像我们创建代理一样，我们也创建任务，每个任务都需要各种工具。举一个人类行为的例子，当我们需要研究某个事情时，我们会做什么？

1\- 我们在互联网上搜索。

2\- 我们进行深入的来源研究。

3\- 我们对我们的发现进行笔记。

以同样的方式，我们可以设计任务来遵循这些步骤，我们将通过代码讨论它们是如何设计的。

## 什么是 CrewAI？

CrewAI 是一个开源的 Python 框架，用于协调角色扮演的自主 AI 代理，具有 Crew、Task、Agent、Process 等方法，并支持多种 LLM，包括本地模型。

如果我们看看该框架提供的主要优势：

* 基于角色的代理设计。
* 自主的代理间委派。
* 灵活的任务管理。
* 基于流程的执行。
* 输出保存为 .markdown 文件等格式。
* 与开源和专有模型（如 OpenAI）兼容。

## 构建多智能体

仅仅通过描述性的解释可能不足以完全理解一个概念，因此让我们创建一个小型的论文写作项目，以更好地掌握多智能体方法。在这个项目中，我们将结合 LangChain 和 CrewAI 框架。要运行该项目，您需要一个 OpenAI API 密钥，您可以通过访问 [https://proxy.rifx.online/https://platform.openai.com/signup](https://proxy.rifx.online/https://platform.openai.com/signup) 来获取。

我们项目的结构由几个不同的 Python 脚本组成：

* `crew.py`，在这里我们定义我们的智能体及其任务。
* `graph.py`，构建 LangGraph 结构。
* `extra_tools.py`，包含我们的智能体将使用的工具。
* `pdf_writer.py`，负责将论文转换为 PDF。
* `app.py`，为我们的应用程序提供 Streamlit 界面。

```python
## 项目结构
Autonomous-Multi-Agent-Systems-with-CrewAI-Essay-Writer
├── app.py              # 主要的 streamlit 应用程序
├── crew.py             # CrewAI 智能体和任务处理
├── extra_tools.py      # 智能体工具的功能
├── graph.py            # LangGraph 和项目工作流程
├── pdf_writer.py       # 处理 PDF 输出生成
├── requirements.txt    # 所需库列表
├── media
│   └── cover.jpg       # 项目封面图像
└── README.md        
```

该项目所需的库列在 `requirements.txt` 文件中。此外，请确保您已安装 Python 3\.12 或更高版本。在运行项目之前，请不要忘记安装依赖项。我们使用的库包括：

```python
langchain-core
langchain-openai
langgraph
streamlit
wikipedia
reportlab
crewai[tools]
pysqlite3-binary
bs4
```

### 工作流程

在我们的过程中，我们将为代理分配各种角色。例如，当一个代理等待另一个代理完成其在互联网上研究的任务时，另一个代理将独立进行维基百科的研究。一旦两个代理都完成了他们的任务，等待信息的代理将继续进行写作，这是他们被分配的任务。

如果我们要将其可视化：

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Emb37H_8OAKp1s1ChLLVQg.png)

* 用户查询最初发送到路由器。
* 路由器读取查询并确定用户是想写一篇新文章、编辑之前的文章，还是仅仅传达一个讨论主题。如果用户希望写一篇新文章，请求将转发给小组。
* 发送到小组的请求首先发送给研究代理。
* 研究代理使用分配给他的工具搜索与用户想要写的主题相关的互联网资源。
* 一旦资源收集过程完成，收集到的信息将转发给写作代理。
* 当写作代理起草文章时，编辑代理进行最终调整，纠正语法错误，并将草稿作为JSON文件返回给LangGraph。
* JSON文件将发送到将在最终节点创建我们文章的PDF文件的功能。

### 构建 LangGraph

首先，我们需要建立我们架构的框架。一旦我们创建了一个工作流程，使我们能够在需要时与我们的代理进行联系，剩下的就是决定在工作流程的哪些阶段我们将向我们的代理发送请求。为此，我们将首先使用 LangChain 创建一个简单的工作流程。

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*iHQzJymxAstrW40THoRxwA.png)

```python
#LangGraph workflow

builder = StateGraph(GraphState)

builder.add_node("answer", self.answer)
builder.add_node("write_essay", self.write_essay)
builder.add_node("edit_essay", self.edit_essay)


builder.set_conditional_entry_point(self.router_query,
                              {"write_essay": "write_essay",
                                        "answer": "answer",
                                        "edit_essay": "edit_essay"})
builder.add_edge("write_essay", END)
builder.add_edge("edit_essay", END)
builder.add_edge("answer", END)

self.graph = builder.compile()
```

**路由节点**：正如我们在工作流程描述中提到的，我们的路由器根据传入请求将任务分配给各个节点。为此，我们需要创建一个有效的提示，涵盖用户提供的主题并结合过去的对话。毕竟，我们正在开发一个多代理的作文写作聊天机器人，它可以记住并回忆之前的讨论。

让我们起草一个简单的提示和相应的节点来利用这个提示。在提示中，我们应该使用 Pydantic 库定义一个 `BaseModel`，以确保我们的路由器选择三种潜在响应策略中的一种。这些策略将指导聊天机器人有效地制定其响应。

在节点中，我们将使用 Langchain 的 `PromptTemplate` 方法实现这个提示。然后，我们将调用 LLM（大型语言模型），将用户查询和对话历史一起传入，以确保响应在上下文上相关并符合用户的需求。

1. **定义 Pydantic 模型**：创建一个模型，指定所需的响应策略。
2. **构建提示**：编写一个清晰概述三种策略的提示。
3. **设置节点**：使用 Langchain 的 `PromptTemplate` 动态格式化提示。
4. **调用 LLM**：使用格式化的提示、用户查询和对话历史调用 LLM。

通过遵循这些步骤，我们可以确保聊天机器人准确响应并保持之前互动的上下文。

```python
#Router Prompt and Router Node
class RouteQuery(BaseModel):
    """将用户查询路由到直接回答或研究。"""

    way: Literal["edit_essay","write_essay", "answer"] = Field(
        ...,
        description="根据用户问题选择将其路由到 write_essay、edit_essay 或 answer",
    )

self.router_prompt = 
    """
    你是一个路由器，你的职责是将用户引导到正确的专家。
    始终检查对话历史，并根据其考虑你的行动。
    如果主题是关于记忆或日常谈话，将用户引导到回答专家。
    如果主题以“你能写...”开头，或者用户请求你写一篇文章或论文，将用户引导到写作专家。
    如果主题是用户想要编辑论文中的任何内容，将用户引导到编辑专家。
  
    \n对话历史: {memory}
    \n主题: {topic}
    """

def router_query(self, state: GraphState):
    print("**ROUTER**")
    prompt = PromptTemplate.from_template(self.router_prompt)
    memory = self.memory.load_memory_variables({})

    router_query = self.model.with_structured_output(RouteQuery)
    chain = prompt | router_query
    result:  RouteQuery = chain.invoke({"topic": state["topic"],
                                       "memory": memory})

    print("Router Result: ", result.way)
    return result.way
```

**简单回答节点**：在将我们的路由器作为开始部分的节点后，下一步是创建其他三个节点：`write_essay`、`edit_essay` 和 `answer`。为了采取简单的方式，我们需要编程我们的 `answer` 节点，以便在用户发送随意消息或参与有关论文的对话时直接使用其记忆生成响应。

为此，我们必须首先为此任务编写一个合适的提示。然后，利用这个提示，我们将设计一个简单的节点。让我们继续这个设计。

```python
#Simple Answer Prompt and Node

self.simple_answer_prompt = 
      """
      你是一个专家，你正在为用户的问题提供简单的 
      答案。
    
      \n对话历史: {memory}
      \n主题: {topic}
      """
def answer(self, state: GraphState):
    print("**ANSWER**")
    prompt = PromptTemplate.from_template(self.simple_answer_prompt)
    memory = self.memory.load_memory_variables({})
    chain = prompt | self.model | StrOutputParser()
    result = chain.invoke({"topic": state["topic"], "memory": memory})

    self.memory.save_context(inputs={"input": state["topic"]}, outputs={"output": result})
    return {"response": result}
```

**写作节点**：接下来，我们需要设计 `writing_essay` 节点。该节点的目的是使用 CrewAI 的 `kickoff` 方法将用户收到的查询转发给我们的代理，然后将代理返回的 JSON 文件转换为 PDF。自然，我们不需要为这个节点编写提示，因为提示将在代理创建阶段定义。这个节点将仅用于调用代理和利用返回的值。

1. **调用代理**：使用 CrewAI 的 `kickoff` 方法将用户的查询发送给代理。
2. **处理返回的 JSON**：处理从代理收到的 JSON 响应。
3. **转换为 PDF**：将 JSON 中的相关数据转换为 PDF 格式。

```python
#Write Essay Node
def write_essay(self, state: GraphState):
    print("**ESSAY COMPLETION**")

    self.essay = self.crew.kickoff({"topic": state["topic"]})

    self.memory.save_context(inputs={"input": state["topic"]},
                           outputs={"output": str(self.essay)})

    pdf_name = generate_pdf(self.essay)
    return {"response": "这是你的论文！",  "pdf_name": f"{pdf_name}"}
```

**编辑论文节点**：让我们简要讨论我们的最后一个节点 `edit_essay`。代码可能看起来有点冗长，因为提示被保留在节点内。如果你愿意，也可以在类定义期间编写提示并将其分配为变量。

当路由器检测到用户的任何论文修改请求时，将激活该节点。在此节点中，我们需要三个重要值：对话历史、用户请求和最近生成的论文。此外，提示中有一个变量，Langchain 将生成，称为 `format_instructions`。这个变量使我们能够向 LLM 传达我们希望保持编辑论文 JSON 格式的结构，并以相同格式接收响应。之后，我们将把返回的响应发送到我们的 PDF 生成工具。

1. **检测编辑请求**：路由器识别用户请求是否为编辑论文。
2. **收集必要值**：收集对话历史、用户请求和最后生成的论文。
3. **创建并使用提示**：构建一个包含 `format_instructions` 的提示。
4. **生成编辑后的论文**：调用 LLM 获取编辑后的论文，并将响应传递给 PDF 生成器。

```python
#Edit Essay Node

def edit_essay(self, state: GraphState):
    print("**ESSAY EDIT**")
    memory = self.memory.load_memory_variables({})

    user_request = state["topic"]
    parser = JsonOutputParser(pydantic_object=Essay)
    prompt = PromptTemplate(
      template=("按照用户请求编辑 JSON 文件，并返回新的 JSON 文件。"
                "\n请求:{user_request} "
                "\n对话历史: {memory}"
                "\n JSON 文件: {essay}"
                " \n{format_instructions}"),
      input_variables=["memory","user_request","essay"],
      partial_variables={"format_instructions": parser.get_format_instructions()},
  )

    chain = prompt | self.model | parser

    self.essay = chain.invoke({"user_request": user_request,
                               "memory": memory, 
                                "essay": self.essay})


    self.memory.save_context(inputs={"input": state["topic"]},
                             outputs={"output": str(self.essay)})
    pdf_name = generate_pdf(self.essay)
    return {"response": "这是你的编辑后的论文！", 
            "essay": self.essay, "pdf_name": f"{pdf_name}"}
```

## 构建代理

**内容研究员**：为了保持我们的项目简单，我们定义了三个代理，它们将相互通信并进行互联网搜索以撰写文章。让我们设计第一个代理，研究员代理。该代理将对维基百科和其他网站进行网页抓取，收集必要的来源，直到它确定已收集到足够的信息。它将获取与主题相关的主要标题、副标题和文章，并准备摘要。随后，这些文档将被存储，以便发送给写作代理。

在设计这个代理时，我们需要考虑它的角色、背景故事和目标。我们将这些分配给`Agent`类中的参数，类似于构建提示，从而为代理的操作做好准备。

```python
#Content Researcher Agent and Task

self.researcher = Agent(
    role="Content Researcher",

    goal="Research accurate content on {topic}",

    backstory="You're researching content to write 
                an essay about the topic: {topic}."
              "You collect information that helps 
                the audience learn something and make informed decisions."
              "Your work is the basis for the Content Writer to 
                write an article on this topic.",
    verbose=True
)

self.research = Task(
    description=(
        "1. Prioritize the latest trends, key players, 
            and noteworthy news on {topic}.\n"
        "2. Identify the target audience, considering their 
            interests and pain points.\n"
        "3. Research a detailed content outline including 
            an introduction, key points, and a conclusion.\n"
        "4. Include SEO keywords and relevant data or sources."
    ),
    expected_output="A comprehensive document with an outline, 
                    audience analysis, SEO keywords, and resources.",
    tools=[search_wikipedia, scrap_webpage],
    agent=self.researcher,
)
```

我们需要创建两个类：`Agent`和`Task`。每个代理可以有一个或多个分配的任务。我们可以直接将工具分配给代理，或者添加特定于任务的工具。通过为任务专门添加工具，我们确保该工具仅在特定任务中使用。

### 参数

我们的 `Agent` 类的参数：

1. **角色**：定义代理在团队中的功能。它决定了代理最适合执行的任务类型，应简短且具有描述性。
2. **目标**：这是代理旨在实现的个人目标。它指导代理的决策过程，应简短且简单。
3. **背景故事**：为代理的角色和目标提供背景，丰富互动和协作动态。应尽可能详细。
4. **详细**：将其设置为 `True` 可配置内部记录器，提供详细的执行日志，有助于调试和监控我们的代理正在进行的活动。

我们的 `Task` 类的参数：

1. **描述**：对任务内容的清晰简洁的陈述。应尽可能详细以确保清晰。
2. **预期输出**：对任务完成后结果的详细描述，有助于设定对结果的明确期望。
3. **工具**：代理可以利用来执行任务的功能或能力。在这里，您可以根据需要使用 LangChain、CrewAI 或自定义工具。
4. **代理**：负责该任务的代理，可以直接分配或通过团队的流程分配。

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ocQ9ZUZwFtGx7a7pPrTbuQ.png)

**内容撰写者**：一旦我们的研究代理通过多次迭代收集了必要的信息，它将把收集到的数据存储在内存中，认为自己已获得足够的知识，并将任务传递给我们的下一个代理，内容撰写者。

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*HD1Bm7twxsUIVGPiqEhHAg.png)

现在，让我们定义我们的内容撰写者代理及其角色。该代理不需要使用任何工具，因此只需详细说明背景故事和描述，类似于研究代理。在背景故事中，我们必须记得指定哪个代理提供了信息来源。

### 参数

1. **角色**：项目中内容编写代理的功能。这应简洁地捕捉代理的作用。
2. **目标**：内容编写者旨在实现的具体目标，例如根据收集的信息撰写一篇结构良好的文章。
3. **背景故事**：为内容编写者的角色提供上下文，包括关于研究者代理及其提供的信息的详细信息。精心制作的背景故事可以增强叙述和协作动态。
4. **描述**：对内容编写者所做工作的清晰简洁的陈述，重点关注其职责和任务。
5. **预期输出**：对任务完成的详细描述，帮助设定对结果的明确期望。
6. **上下文**：在执行任务之前，我们指定要等待完成的任务，并从该任务输出中获取必要的信息，结合上下文参数。

```python
#Content Writer Agent and Task

self.writer = Agent(
  role="Content Writer",

  goal="撰写有关提供主题的深刻且事实准确的 "
       "观点文章",

  backstory="您正在撰写一篇关于提供主题的新观点文章。"
            "您基于内容研究员的工作，该研究员提供了主题的提纲和相关背景信息。"
            "您遵循内容研究员提供的提纲的主要目标和方向。"
            "您还提供客观和公正的见解，并用内容研究员提供的信息进行支持。",
  verbose=True,
)

self.write = Task(
  description=(
      "1. 使用内容撰写一篇引人入胜的文章。\n"
      "2. 自然地融入SEO关键词。\n"
      "3. 各部分/副标题以引人入胜的方式命名。\n"
      "4. 确保文章结构合理，包含引人入胜的引言、深刻的主体和总结性的结论。\n"
      "5. 校对语法错误并确保与品牌声音一致。\n"
      "6. 选择合适的标题。\n"
  ),
  expected_output="一篇以markdown格式撰写的文章，"
                  "准备发布，每个部分应有2或3段。",
  context=[self.research],
  agent=self.writer,
)
```

**内容编辑器**：在定义了编写代理后，我们本可以结束这个过程；然而，即使编写代理负责写作，它仍可能出现拼写错误和破坏内容连贯性的错误。为防止这些问题并将文章输出为JSON格式，我们将定义一个新的代理：内容编辑器。

在该代理的背景故事中，我们将说明它负责审查和纠正从编写代理收到的文章。在任务阶段，我们还将定义所需的输出格式。

```python
#Content Editor Agent and Task
self.editor = Agent(
    role="Content Editor",

    goal="编辑给定的文章，以符合组织的写作风格。",

    backstory="您是一名编辑，收到来自内容编写者的文章。"
              "您的目标是审查文章，以确保其遵循最佳实践，提供平衡的观点"
              "在提供意见或断言时，尽量避免重大争议话题或意见。",
    verbose=True
)

self.edit = Task(
    description="校对给定文章的语法错误，并确保与品牌声音一致。",

    expected_output="一篇以所需格式撰写的文章，"
                    "准备发布，每个部分应有2或3段。",
    output_json = Essay,
    context=[self.write],
    agent=self.editor
)
```

在这里，我们的输出是一个名为`Essay`的对象，它是通过Pydantic库中的`BaseModel`和`Field`类创建的。通过添加我们的代理可以理解的解释，我们确保代理将数据以PDF打印功能所期望的格式输出。

```python
#Expected Pydantic Output

class Paragraph(TypedDict):
    sub_header: str
    paragraph: str

class Essay(BaseModel):
    header: str = Field(..., description="文章的标题")
    entry: str = Field(..., description="文章的引言")
    paragraphs: List[Paragraph] = Field(..., description="文章的段落")
    conclusion: str = Field(..., description="文章的结论")
    seo_keywords: List[str] = Field(..., description="文章的SEO关键词")
```

我们已经定义了我们的代理及其任务。现在，让我们将我们的三个代理结合在一起。为此，我们应该使用CrewAI库中的一个小而实用的方法，称为`Crew`。在此方法中，我们列出将顺序操作的代理及其将使用的工具。如果任务需要按顺序执行，如在我们的项目中，我们将`process`参数设置为`Process.sequential`。我们还将`memory`参数设置为`True`，以使代理能够使用短期和长期记忆进行相互通信。

```python
#Crew Run

def kickoff(self,*args):
    return Crew(
        agents=[self.researcher, self.writer, self.editor],
        tasks=[self.research, self.write, self.edit],
        process=Process.sequential,
        verbose=True,
        memory=True
    ).kickoff(*args)
```

我们的代理结构已经完成，但我们还没有讨论我们的工具。现在，让我们简要说明一下我们的工具。

## 构建工具

工具本质上是接受各种输入并返回值作为输出的函数。我们的代理将简单地提供这些函数所需的输入，并处理他们收到的输出。因此，我们需要以高容错性设计我们的工具。当发生使用错误时，我们的代理应该能够读取错误，并配备信息以便在下一次迭代中正确使用工具。

在为我们的工具准备好函数后，我们应该使用 LangChain 或 CrewAI 的工具创建类将它们转换为工具对象，并附上各种说明。在这里，我们通过简单地在函数顶部写上 C**rewAI 的工具装饰器**将我们的工具转换为代理可以使用的形式。

```python
from crewai_tools import tool

@tool("Wikipedia Search Tool")
def search_wikipedia(query: str) -> str:
    """Run Wikipedia search and get page summaries."""
    page_titles = wikipedia.search(query)
    summaries = []

    for page_title in page_titles[:3]:  # First 3 results
        try:
            wiki_page = wikipedia.page(title=page_title, auto_suggest=False)
            summaries.append(f"Page: {page_title}\nSummary: {wiki_page.summary}")
        except wikipedia.PageError: # Page Not Found
            pass
        except wikipedia.DisambiguationError: # Disambiguation Error
            pass

    if not summaries:
        return "No good Wikipedia Search Result was found"

    return "\n\n".join(summaries)
```

## 构建应用程序

现在，让我们使用我经常使用并且认为提供了简单界面设计的 Streamlit 框架来实时部署我们的应用程序。Streamlit 是一个开源的 Python 框架，供数据科学家和 AI/ML 工程师使用，仅需几行代码即可交付动态数据应用程序。

当用户在 `text_input` 框中输入他们的 OpenAI 密钥并点击“初始化代理”按钮时，我们的应用程序主要激活。当用户通过活动的 `chat_input` 部分发送消息时，以下函数用于将输入的请求传递给我们建立的代理结构：

```python
def generate_response(topic):
    return app.invoke(input={"topic": topic})
```

借助 Streamlit 的 `st.chat_message` 组件，我们可以轻松实现聊天机器人界面。如果用户正在进行常规消息传递，响应将显示正常答案。如果生成了一篇文章，我们将通过编写简单的 if-else 循环向用户提供 PDF 的目录。

同时，我们将从聊天机器人发送和接收的每条消息添加到 Streamlit 的 `session_state` 中创建的 `messages` 变量中。这样，我们就创建了一个可见的聊天屏幕。

```python
#Streamlit App

import streamlit as st
from graph import EssayWriter
import os
import base64

st.set_page_config(page_title="Essay Writer Chat Bot", page_icon="🤖")
st.image("./media/cover.jpg", use_column_width=True)


if "messages" not in st.session_state:
    st.session_state.messages =  [{"role": "assistant", "content": "Hello!"}]
    st.session_state.app = None
    st.session_state.chat_active = True

with st.sidebar:
    st.info(" * 此应用程序使用 OpenAI API 生成文本，请提供您的 API 密钥。"
            "\n\n * 此应用程序使用 'gpt-4o-mini-2024-07-18' 模型。成本有效且高效。"
            "\n\n * 如果您没有 API 密钥，可以在 [这里](https://proxy.rifx.online/https://platform.openai.com/signup) 获取。"
            "\n\n * 您还可以在 [这里](https://proxy.rifx.online/https://github.com/mesutdmn/Autonomous-Multi-Agent-Systems-with-CrewAI-Essay-Writer) 找到此应用程序的源代码。"
            "\n\n * 应用程序密钥不会以任何方式存储或保存。"
            "\n\n * 写作论文可能需要一些时间，请耐心等待。大约 1-2 分钟。"
    openai_key= st.text_input("OpenAI API 密钥", type="password")


def initialize_agents():
    os.environ["OPENAI_API_KEY"] = openai_key
    essay_writer = EssayWriter().graph

    if len(openai_key) < 1:
        st.error("请输入您的 OpenAI API 密钥并初始化代理。")

        st.session_state.chat_active = True
    else:
        st.success("代理成功初始化")
        st.session_state.chat_active = False

    return essay_writer

with st.sidebar:
    if st.button("初始化代理", type="primary"):
        st.session_state.app = initialize_agents()

app = st.session_state.app
def generate_response(topic):
    return app.invoke(input={"topic": topic})


for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"], unsafe_allow_html=True)

if topic:= st.chat_input(placeholder="问一个问题", disabled=st.session_state.chat_active):
    st.chat_message("user").markdown(topic)

    st.session_state.messages.append({"role": "user", "content": topic})
    with st.spinner("思考中..."):
        response = generate_response(topic)

    with st.chat_message("assistant"):
        if "pdf_name" in response:
            with open(f"./{response['pdf_name']}", "rb") as file:
                file_bytes = file.read()
                b64 = base64.b64encode(file_bytes).decode()
            href = f'<a href="data:application/pdf;base64,{b64}" download="{response['pdf_name']}">{response['pdf_name']}</a>'

            st.markdown(f"{response['response']}: {href}", unsafe_allow_html=True)
            st.session_state.messages.append({"role": "assistant", "content": f"{response['response']}: {href}"})
        else:
            st.markdown(response["response"])
            st.session_state.messages.append({"role": "assistant", "content": response["response"]})
```

**恭喜**！我们已经完成了我们的项目。如果您愿意，可以观看我为您录制的项目工作日志。不要忘记访问 GitHub [**仓库**](https://proxy.rifx.online/https://github.com/mesutdmn/Autonomous-Multi-Agent-Systems-with-CrewAI-Essay-Writer) 以获取项目的所有代码。

这就是我们应用程序的主页在部署后将呈现的样子！

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*8tDAluuAH6njIohDbb-UqA.png)

## 结论

在本文中，我们探讨了如何使用 CrewAI 构建自主多智能体系统。我们首先讨论了创建智能体的动机，以及它们如何协同工作以更高效地完成任务。通过将任务细分并利用工具，我们使我们的智能体能够以结构化的方式执行复杂操作。

我们开发了一个简单的项目，集成了 CrewAI 和 LangChain 框架，展示了多个智能体如何协作收集信息、撰写论文和编辑内容。强调了工具使用和任务管理，以确保我们的智能体能够顺利有效地运行。

最后，我们使用 Streamlit 部署了我们的应用程序，使用户能够轻松与系统互动。

您可以在 [**这里**](https://proxy.rifx.online/https://multi-agent-essay-writer.streamlit.app/) 查看实时项目，在我的 GitHub 仓库 [**这里**](https://proxy.rifx.online/https://github.com/mesutdmn/Autonomous-Multi-Agent-Systems-with-CrewAI-Essay-Writer) 查看源代码


