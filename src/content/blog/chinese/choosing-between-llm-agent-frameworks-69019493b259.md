---
title: "在 LLM 代理框架之间进行选择"
meta_title: "在 LLM 代理框架之间进行选择"
description: "构建定制基于代码的代理和主要代理框架之间的权衡。"
date: 2024-10-29T12:57:34Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*jRMs19HqSCazE5dY"
categories: ["Programming", "Technology", "Machine Learning"]
author: "Rifx.Online"
tags: ["agents", "frameworks", "LangGraph", "LlamaIndex", "Workflows"]
draft: False

---

### 定制代码代理与主要代理框架之间的权衡



代理正在迎来一个重要时刻。随着多个新框架和新的 [投资](https://foundationcapital.com/goodbye-aiops-welcome-agentsres-the-next-100b-opportunity/) 的涌入，现代 AI 代理正在克服 [不稳定的起源](https://arxiv.org/html/2405.13966v1)，迅速取代 RAG 成为实施优先事项。那么，2024 年是否终于会成为能够接管撰写电子邮件、预订航班、与我们的数据对话或似乎任何其他任务的自主 AI 系统的年份？

也许，但要达到这一点还有很多工作要做。任何构建代理的开发者不仅需要选择基础——使用哪个模型、用例和架构——还需要选择利用哪个框架。你是选择长期存在的 LangGraph，还是较新的 LlamaIndex Workflows？或者你选择传统方式，自己编写整个代码？

本文旨在让这个选择变得简单一些。在过去几周，我在主要框架中构建了相同的代理，以技术层面检查每个框架的一些优缺点。每个代理的所有代码都可以在 [这个库](https://github.com/Arize-ai/phoenix/tree/main/examples/agent_framework_comparison) 中找到。

### 测试用代理的背景

用于测试的代理包括功能调用、多种工具或技能、与外部资源的连接，以及共享状态或记忆。

该代理具有以下能力：

1. 从知识库回答问题
2. 与数据对话：回答有关LLM应用程序的遥测数据的问题
3. 数据分析：分析检索到的遥测数据中的更高级趋势和模式

为了实现这些，代理具有三项初始技能：基于产品文档的RAG、在跟踪数据库上生成SQL，以及数据分析。代理用户界面使用简单的gradio支持的界面，代理本身构建为一个聊天机器人。

## 基于代码的代理（无框架）

开发代理时，您可以选择完全跳过框架，自己构建代理。开始这个项目时，我采用的就是这种方法。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*pw9-0lB5JMlVcPqo)

### 纯代码架构

下面的基于代码的代理由一个由OpenAI驱动的路由器组成，该路由器使用函数调用选择合适的技能。该技能完成后，它会返回路由器，以便调用另一个技能或响应用户。

代理保持一个持续更新的消息和响应列表，在每次调用时完整传递给路由器，以保持上下文的连贯性。

```python
def router(messages):
    if not any(
        isinstance(message, dict) and message.get("role") == "system" for message in messages
    ):
        system_prompt = {"role": "system", "content": SYSTEM_PROMPT}
        messages.append(system_prompt)

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=messages,
        tools=skill_map.get_combined_function_description_for_openai(),
    )

    messages.append(response.choices[0].message)
    tool_calls = response.choices[0].message.tool_calls
    if tool_calls:
        handle_tool_calls(tool_calls, messages)
        return router(messages)
    else:
        return response.choices[0].message.content
```

技能本身在各自的类中定义（例如，GenerateSQLQuery），这些类共同保存在一个SkillMap中。路由器本身只与SkillMap交互，使用它来加载技能名称、描述和可调用函数。这种方法意味着将新技能添加到代理中只需将该技能编写为自己的类，然后将其添加到SkillMap中的技能列表中。这里的想法是使添加新技能变得简单，而不干扰路由器代码。

```python
class SkillMap:
    def __init__(self):
        skills = [AnalyzeData(), GenerateSQLQuery()]

        self.skill_map = {}
        for skill in skills:
            self.skill_map[skill.get_function_name()] = (
                skill.get_function_dict(),
                skill.get_function_callable(),
            )

    def get_function_callable_by_name(self, skill_name) -> Callable:
        return self.skill_map[skill_name][1]

    def get_combined_function_description_for_openai(self):
        combined_dict = []
        for _, (function_dict, _) in self.skill_map.items():
            combined_dict.append(function_dict)
        return combined_dict

    def get_function_list(self):
        return list(self.skill_map.keys())

    def get_list_of_function_callables(self):
        return [skill[1] for skill in self.skill_map.values()]

    def get_function_description_by_name(self, skill_name):
        return str(self.skill_map[skill_name][0]["function"])
```

总体而言，这种方法相对简单易行，但也面临一些挑战。

### 纯代码代理的挑战

第一个难点在于构建路由器系统提示。通常，上述示例中的路由器坚持自己生成 SQL，而不是将其委托给合适的技能。如果你曾经尝试让 LLM *不* 做某件事，你就会知道这种体验是多么令人沮丧；找到一个有效的提示需要经过多轮调试。考虑到每个步骤的不同输出格式也是棘手的。由于我选择不使用结构化输出，我必须准备好应对路由器和技能中每个 LLM 调用的多种不同格式。

### 纯代码代理的好处

基于代码的方法提供了良好的基准和起点，是学习代理工作原理的绝佳方式，而无需依赖现有框架中的现成代理教程。尽管说服 LLM 按预期行为可能具有挑战性，但代码结构本身足够简单，可能适用于某些用例（更多内容见下面的分析部分）。

## LangGraph

LangGraph 是最早的代理框架之一，首次发布于 2024 年 1 月。该框架旨在通过采用 Pregel 图结构来解决现有管道和链的无环特性。LangGraph 通过添加节点、边和条件边的概念，使您更容易在代理中定义循环，以遍历图形。LangGraph 建立在 LangChain 之上，并使用该框架中的对象和类型。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*fYgHiGwLhSUSrFv9)

### LangGraph 架构

LangGraph 代理在表面上看起来与基于代码的代理相似，但其背后的代码却截然不同。LangGraph 在技术上仍然使用“路由器”，即通过函数调用 OpenAI，并使用响应继续到新的步骤。然而，程序在技能之间的移动方式完全不同。

```python
tools = [generate_and_run_sql_query, data_analyzer]
model = ChatOpenAI(model="gpt-4o", temperature=0).bind_tools(tools)

def create_agent_graph():
    workflow = StateGraph(MessagesState)

    tool_node = ToolNode(tools)
    workflow.add_node("agent", call_model)
    workflow.add_node("tools", tool_node)

    workflow.add_edge(START, "agent")
    workflow.add_conditional_edges(
        "agent",
        should_continue,
    )
    workflow.add_edge("tools", "agent")

    checkpointer = MemorySaver()
    app = workflow.compile(checkpointer=checkpointer)
    return app
```

这里定义的图有一个用于初始 OpenAI 调用的节点，称为上面的“agent”，以及一个用于工具处理步骤的节点，称为“tools”。LangGraph 有一个内置对象 ToolNode，它接受一个可调用工具的列表，并根据 ChatMessage 响应触发它们，然后再返回到“agent”节点。

```python
def should_continue(state: MessagesState):
    messages = state["messages"]
    last_message = messages[-1]
    if last_message.tool_calls:
        return "tools"
    return END

def call_model(state: MessagesState):
    messages = state["messages"]
    response = model.invoke(messages)
    return {"messages": [response]}
```

在每次调用“agent”节点后（换句话说：基于代码的代理中的路由器），should_continue 边决定是将响应返回给用户，还是传递给 ToolNode 以处理工具调用。

在每个节点中，“state”存储了来自 OpenAI 的消息和响应列表，类似于基于代码的代理的方法。

### LangGraph 的挑战

大多数与 LangGraph 相关的困难源于需要使用 Langchain 对象，以便流程顺畅。

**挑战 \#1：函数调用验证**

为了使用 ToolNode 对象，我不得不重构我现有的大部分 Skill 代码。ToolNode 接受一个可调用函数的列表，这最初让我认为可以使用我现有的函数，但由于我的函数参数，事情却出现了问题。

这些技能被定义为具有可调用成员函数的类，这意味着它们的第一个参数是“self”。GPT\-4o 足够智能，未在生成的函数调用中包含“self”参数，然而 LangGraph 将其视为缺少参数的验证错误。

这花了我几个小时才弄明白，因为错误信息却将函数中的第三个参数（数据分析技能中的“args”）标记为缺失参数：

```python
pydantic.v1.error_wrappers.ValidationError: 1 validation error for data_analysis_toolSchema
args field required (type=value_error.missing)
```

值得一提的是，错误消息源自 Pydantic，而不是 LangGraph。

我最终下定决心，将我的技能重新定义为使用 Langchain 的 @tool 装饰器的基本方法，并成功使其工作。

```python
@tool
def generate_and_run_sql_query(query: str):
    """根据提示生成并运行 SQL 查询。

    参数：
        query (str): 包含原始用户提示的字符串。

    返回：
        str: SQL 查询的结果。
    """
```

**挑战 \#2：调试**

如前所述，在框架中进行调试是困难的。这主要归结为令人困惑的错误消息和抽象概念，使得查看变量变得更加困难。

抽象概念主要在尝试调试在代理中传递的消息时出现。LangGraph 将这些消息存储在 state\[“messages”] 中。图中的某些节点会自动从这些消息中提取，这可能使得在节点访问消息时理解消息的值变得困难。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*KuCg0WGHSklOKe6t)

### LangGraph 的好处

LangGraph 的主要好处之一是易于使用。图结构代码简洁且易于访问。特别是当您有复杂的节点逻辑时，拥有图的单一视图使理解代理之间的连接变得更加容易。LangGraph 还使将现有的基于 LangChain 构建的应用程序转换变得简单。

### 外卖

如果您使用框架中的所有内容，LangGraph 将运行良好；如果您超出它的范围，请准备好进行一些调试。

## LlamaIndex 工作流

工作流是代理框架领域的新进入者，早在今年夏天首次亮相。与 LangGraph 类似，它旨在简化循环代理的构建。工作流还特别关注异步运行。

工作流的一些元素似乎是对 LangGraph 的直接回应，特别是它使用事件而不是边和条件边。工作流使用步骤（类似于 LangGraph 中的节点）来容纳逻辑，并通过发出和接收事件在步骤之间移动。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*22WuFVBWctdeiCSL)

上面的结构看起来与 LangGraph 结构相似，只是增加了一项内容。我在工作流中添加了一个设置步骤，以准备代理上下文，更多内容请见下文。尽管结构相似，但支撑它的代码却截然不同。

### 工作流架构

下面的代码定义了工作流结构。与 LangGraph 类似，这里是我准备状态并将技能附加到 LLM 对象的地方。

```python
class AgentFlow(Workflow):
    def __init__(self, llm, timeout=300):
        super().__init__(timeout=timeout)
        self.llm = llm
        self.memory = ChatMemoryBuffer(token_limit=1000).from_defaults(llm=llm)
        self.tools = []
        for func in skill_map.get_function_list():
            self.tools.append(
                FunctionTool(
                    skill_map.get_function_callable_by_name(func),
                    metadata=ToolMetadata(
                        name=func, description=skill_map.get_function_description_by_name(func)
                    ),
                )
            )

    @step
    async def prepare_agent(self, ev: StartEvent) -> RouterInputEvent:
        user_input = ev.input
        user_msg = ChatMessage(role="user", content=user_input)
        self.memory.put(user_msg)

        chat_history = self.memory.get()
        return RouterInputEvent(input=chat_history)
```

这也是我定义额外步骤“prepare\_agent”的地方。此步骤从用户输入创建一个 ChatMessage，并将其添加到工作流内存中。将其分离为单独步骤意味着我们在代理循环通过步骤时会返回到它，这避免了重复将用户消息添加到内存中。

在 LangGraph 的情况下，我通过一个位于图外的 run\_agent 方法完成了同样的事情。然而，这一变化主要是风格上的，然而在我看来，将此逻辑与工作流和图形结合在一起更为简洁。

设置好工作流后，我接着定义了路由代码：

```python
@step
async def router(self, ev: RouterInputEvent) -> ToolCallEvent | StopEvent:
    messages = ev.input

    if not any(
        isinstance(message, dict) and message.get("role") == "system" for message in messages
    ):
        system_prompt = ChatMessage(role="system", content=SYSTEM_PROMPT)
        messages.insert(0, system_prompt)

    with using_prompt_template(template=SYSTEM_PROMPT, version="v0.1"):
        response = await self.llm.achat_with_tools(
            model="gpt-4o",
            messages=messages,
            tools=self.tools,
        )

    self.memory.put(response.message)

    tool_calls = self.llm.get_tool_calls_from_response(response, error_on_no_tool_call=False)
    if tool_calls:
        return ToolCallEvent(tool_calls=tool_calls)
    else:
        return StopEvent(result=response.message.content)
```

以及工具调用处理代码：

```python
@step
async def tool_call_handler(self, ev: ToolCallEvent) -> RouterInputEvent:
    tool_calls = ev.tool_calls

    for tool_call in tool_calls:
        function_name = tool_call.tool_name
        arguments = tool_call.tool_kwargs
        if "input" in arguments:
            arguments["prompt"] = arguments.pop("input")

        try:
            function_callable = skill_map.get_function_callable_by_name(function_name)
        except KeyError:
            function_result = "Error: Unknown function call"

        function_result = function_callable(arguments)
        message = ChatMessage(
            role="tool",
            content=function_result,
            additional_kwargs={"tool_call_id": tool_call.tool_id},
        )

        self.memory.put(message)

    return RouterInputEvent(input=self.memory.get())
```

这两者看起来更像是基于代码的代理，而不是 LangGraph 代理。这主要是因为工作流将条件路由逻辑保留在步骤中，而不是在条件边中——第 18 到 24 行在 LangGraph 中是一个条件边，而现在它们只是路由步骤的一部分——以及 LangGraph 具有一个 ToolNode 对象，几乎自动处理 tool\_call\_handler 方法中的所有内容。

在路由步骤之后，我非常高兴地看到我可以将我的 SkillMap 和基于代码的代理中的现有技能与工作流一起使用。这些技能无需更改就可以与工作流配合使用，这让我的工作轻松了很多。

### 工作流的挑战

**挑战 \#1: 同步与异步**

尽管异步执行对于实时代理更为理想，但调试同步代理要容易得多。工作流设计为异步工作，强行实现同步执行非常困难。

我最初以为只需去掉“async”方法标识，将“achat\_with\_tools”切换为“chat\_with\_tools”即可。然而，由于Workflow类中的底层方法也被标记为异步，因此有必要重新定义这些方法以便实现同步执行。最终我还是坚持使用异步方法，但这并没有使调试变得更加困难。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*78Hzqkiv9cI7W4UA)

**挑战 \#2: Pydantic 验证错误**

在与LangGraph的困境重演中，关于技能的Pydantic验证错误出现了类似的问题。幸运的是，由于工作流能够很好地处理成员函数，这次解决起来要容易得多。我最终不得不在为我的技能创建LlamaIndex FunctionTool对象时更加规范：

```python
for func in skill_map.get_function_list(): 
            self.tools.append(FunctionTool(
                skill_map.get_function_callable_by_name(func), 
                metadata=ToolMetadata(name=func, description=skill_map.get_function_description_by_name(func))))
```

*摘自 AgentFlow.\_\_init\_\_，用于构建 FunctionTools*

### 工作流的好处

构建 Workflows 代理比构建 LangGraph 代理要容易得多，主要是因为 Workflows 仍然要求我自己编写路由逻辑和工具处理代码，而不是提供内置函数。这也意味着我的 Workflow 代理看起来与我的基于代码的代理极为相似。

最大的区别在于事件的使用。我使用了两个自定义事件在我的代理中移动步骤：

```python
class ToolCallEvent(Event):
    tool_calls: list[ToolSelection]

class RouterInputEvent(Event):
    input: list[ChatMessage]
```

发射器-接收器、基于事件的架构取代了直接调用我的代理中的某些方法，比如工具调用处理器。

如果您有更复杂的系统，具有多个异步触发的步骤并可能发出多个事件，这种架构将非常有助于干净地管理这些情况。

Workflows 的其他好处包括它非常轻量且不强迫您使用很多结构（除了某些 LlamaIndex 对象的使用），而且它的基于事件的架构为直接函数调用提供了一个有用的替代方案——特别是对于复杂的异步应用程序。

## 比较框架

在这三种方法中，各自都有其优点。

无框架的方法是最简单的实现方式。因为任何抽象都是由开发者定义的（即上面示例中的 SkillMap 对象），保持各种类型和对象的清晰是很容易的。然而，代码的可读性和可访问性完全取决于个别开发者，随着代理的复杂性增加，如果没有一些强制结构，很容易变得混乱。

LangGraph 提供了相当多的结构，这使得代理的定义非常明确。如果一个更广泛的团队在协作开发代理，这种结构将提供一种强有力的架构强制方式。对于那些不太熟悉该结构的人，LangGraph 也可能为代理提供一个良好的起点。然而，这也有一个权衡——由于 LangGraph 为你做了很多事情，如果你没有完全接受这个框架，可能会导致麻烦；代码可能非常干净，但你可能会为此付出更多的调试成本。

Workflows 则处于中间位置。基于事件的架构可能对某些项目极为有用，而使用 LlamaIndex 类型的要求较少，为那些没有在整个应用程序中完全使用框架的人提供了更大的灵活性。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*PITmiVGuG8QuDVX6)

最终，核心问题可能只是“你是否已经在使用 LlamaIndex 或 LangChain 来协调你的应用程序？”LangGraph 和 Workflows 都与各自的基础框架紧密相连，因此每个特定于代理的框架的额外好处可能不足以单凭优点而促使你切换。

纯代码的方法可能始终是一个有吸引力的选项。如果你有严谨的方法来记录和强制执行任何创建的抽象，那么确保外部框架不会拖慢你的速度是很容易的。

## 选择代理框架的关键问题

当然，“这要看情况”从来不是一个令人满意的答案。这三个问题应该帮助你决定在下一个代理项目中使用哪个框架。

***你是否已经在项目的重要部分使用了 LlamaIndex 或 LangChain？***

如果是，请首先探索这个选项。

***你是否熟悉常见的代理结构，还是希望有一些指导来告诉你如何构建代理？***

如果你属于后者，尝试 Workflows。如果你*真的*属于后者，尝试 LangGraph。

***你的代理之前是否已经构建过？***

框架的一个好处是每个框架都有许多教程和示例可供使用。而纯代码代理的示例则少得多。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*wF9aSF1db1yaniqO)

## 结论

选择一个代理框架只是众多选择中的一个，这将影响生成式AI系统的生产结果。像往常一样，建立稳健的保护措施和 [LLM tracing](https://docs.arize.com/phoenix/tracing/llm-traces) 是非常重要的——并且要灵活应对新的代理框架、研究和模型颠覆既定技术。


