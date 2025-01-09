---
title: "利用 Pydantic AI 实现智能自主研究代理"
meta_title: "利用 Pydantic AI 实现智能自主研究代理"
description: "本文探讨了使用Pydantic AI构建智能自主研究代理的过程，强调了AI代理在信息处理和研究中的重要性。通过工具调用，代理能够访问外部API并自动化研究任务，从而提高效率并减少用户的认知负担。Pydantic库为代理的结构化数据管理提供了支持，确保输出的可靠性和一致性。文章还介绍了构建代理的初步步骤和示例代码，展示了如何创建一个能够执行迭代搜索和任务管理的研究代理。"
date: 2025-01-09T01:56:22Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*NyZEflBLmzJHH9YTXeloPg.png"
categories: ["Autonomous Systems", "Data Science", "Machine Learning"]
author: "Rifx.Online"
tags: ["Pydantic", "autonomous", "research", "agents", "toolcalling"]
draft: False

---





在技术进步的步伐要求不断学习和适应的时代，拥有一个智能助手来承担研究的重担不仅仅是一种奢侈——它正逐渐成为一种必需品。独立企业家、研究人员甚至普通学习者常常会被大量的信息所淹没。这就是由人工智能驱动的研究代理发挥作用的地方，它们不仅承诺提高效率，还能深入理解复杂主题。

## 代理系统的重要性

AI agents 并不新颖；它们的应用遍及客户服务聊天机器人、推荐引擎和个人助手，如 Siri 或 Alexa。然而，它们自主导航和分析大量信息的能力——这些工具专为深入研究而设计——是一个游戏规则的改变者。这些代理可以：

* **减少认知负担**：通过总结大型数据集或文章，它们使用户能够专注于决策而不是信息处理。
* **提供专业见解**：通过量身定制的配置，代理可以深入小众领域，提供特定领域的知识。
* **促进创新**：通过自动化重复的研究任务，用户可以花更多时间进行构思和战略规划。

对于独立创业者来说，这意味着更快地发现市场趋势或竞争对手。对于学术界来说，这意味着以更少的努力合成文献综述。这些系统的潜在受众是巨大的。

## 工具调用：扩展代理能力

真正的魔力发生在人工智能代理被赋予工具时。工具调用是一个日益受到关注的概念，它允许代理访问外部API，从网站抓取数据，甚至与其他软件互动以执行任务。可以把它看作是赋予代理成为学徒的能力——不仅仅是获取信息，还能操控和分析信息。

例如，一个具备工具的代理可以：

1. 提取并总结网页的主要内容。
2. 使用API收集实时数据，例如股市趋势或天气更新。
3. 交叉参考多个来源以验证信息的可信度。

通过为代理配备这样的工具，我们使他们能够超越表面信息，深入探讨主题，提供更丰富、更具可操作性的洞察。

## 自动化研究：智能代理的梦想

想象一下，有一个代理可以自主研究一个主题，收集数据，并返回一份有组织的报告。这种代理可以：

* **执行迭代搜索**：从一个广泛的查询开始，并根据中间发现逐步细化。
* **批判性评估来源**：识别可信的来源，并忽略不可靠或冗余的数据。
* **创建结构化输出**：以摘要、图表或详细叙述等格式呈现发现。

这种能力将彻底改变我们学习和决策的方式。用户不再需要在Google上花费数小时或浏览多个网站，而是可以依赖他们的研究代理来完成繁重的工作。

## 进入 Pydantic AI：构建智能

Pydantic 是一个以数据验证和设置管理而闻名的 Python 库，为创建结构化的 AI 系统提供了坚实的基础。通过将 Pydantic 集成到 AI 代理框架中，我们可以：

* 确保数据一致性：验证输入和输出数据，确保代理的结果可靠且无错误。
* 增强模块化：使用可重用组件构建代理，使其能力更易于扩展或适应。
* 精简开发：减少样板代码，更专注于逻辑而不是底层实现。

使用 Pydantic 进行工具调用代理简化了在代理与其工具之间传递结构化数据的过程，确保无缝交互和可靠性能。

## 构建代理的初步步骤

我已经开始尝试使用 Pydantic AI 代理，考虑到自主研究代理。因此，本文将随着我的实验进展而演变。欢迎每位专家对我的方法提出异议，并在我可能采取更好方法时给予指导。

有关完整和准确的文档，请参考 Pydantic AI 参考 [这里](https://ai.pydantic.dev/)。下面给出了一个简化的 Pydantic 代理，

```python
from pydantic_ai import Agent, RunContext

roulette_agent = Agent(  
    'openai:gpt-4o',
    deps_type=int,
    result_type=bool,
    system_prompt=(
        'Use the `roulette_wheel` function to see if the '
        'customer has won based on the number they provide.'
    ),
)


@roulette_agent.tool
async def roulette_wheel(ctx: RunContext[int], square: int) -> str:  
    """check if the square is a winner"""
    return 'winner' if square == ctx.deps else 'loser'

async def main():
    result = await roulette_agent.run(7) #example input
    print(result)

import asyncio
asyncio.run(main())
```
**示例中的关键概念：**

`Agent` **类：**

* `from pydantic_ai import Agent`: 这导入了核心 `Agent` 类。
* `roulette_agent = Agent(...)`: 这创建了一个名为 `roulette_agent` 的代理实例。
* `'openai:gpt-4o'`: 这指定了要使用的底层 LLM。在这种情况下，它是 OpenAI 的 GPT-4。Pydantic AI 支持各种 LLM（例如，Gemini、Ollama）。
* `deps_type=int`: 这定义了代理期望的 *依赖项* 或输入类型。在这里，它期望一个整数（例如，客户选择的数字）。该输入将在工具函数中通过 `ctx.deps` 访问。
* `result_type=bool`: 这定义了代理整体执行的预期 *输出* 类型。在这种情况下，它是布尔值（True 表示胜利，False 表示失败）。然而，在你的示例中，`roulette_wheel` 函数返回一个字符串，因此这是一个不匹配。它应该是 `result_type=str`
* `system_prompt`: 这是给 LLM 的核心指令。它告诉 LLM 如何行为以及它的角色是什么。在此示例中，它指示 LLM 使用 `roulette_wheel` 函数来确定结果。

`@roulette_agent.tool` **装饰器：**

* `@roulette_agent.tool`: 这个装饰器至关重要。它将函数 `roulette_wheel` 注册为 LLM 可以使用的 *工具*。工具是代理可以执行的操作或函数。
* `async def roulette_wheel(...)`: 这定义了工具函数。它被标记为 `async`，因为 LLM 交互通常是异步的（它们需要时间来完成）。
* `ctx: RunContext[int]`: 这提供了工具执行的 *上下文*。 `RunContext` 包含有关当前运行的信息，包括输入依赖项（`ctx.deps`）。 `[int]` 指定 `deps` 属性将是一个整数，与 `Agent` 构造函数中定义的 `deps_type` 相匹配。
* `square: int`: 这是 LLM 传递给工具函数的一个参数。它表示 LLM 想要检查的轮盘上的数字。
* `-> str`: 这指定了工具函数的返回类型（在这种情况下为字符串）。

**工作原理（简化）：**

1. 你向代理提供输入（例如，客户选择的数字）。
2. Pydantic AI 将此输入与 `system_prompt` 一起传递给 LLM。
3. LLM 根据提示决定使用 `roulette_wheel` 工具。
4. Pydantic AI 调用 `roulette_wheel` 函数，传递输入（来自 `ctx.deps`）和 LLM 提供的任何参数（`square`）。
5. `roulette_wheel` 函数执行其逻辑（检查 `square` 是否与 `ctx.deps` 匹配）并返回结果。
6. Pydantic AI 处理结果并将其作为代理的整体输出返回。

基本概念足够了。我的第一个挑战是创建一个可以将任务委派给特定专家代理的协调者代理。

```python
task_genie = Agent(
    name="task_genie",
    model=model,
    system_prompt=(
        "You are an orchestrator agent. Your job is to analyze user input and route it to the appropriate agent. "
        "Your job is to get the overall task done using the provided tools and agents. "
        "You should summarize what you have done with all the tools and agents and return a string response. "
    ),
    deps_type=str,
    result_type=str,
    tools=[
        agents.tools.research_tool
    ]
)
```
我花了一些时间才弄明白子代理应该使用上述定义的协调者代理的工具进行协调。

```python
async def research_tool(ctx: RunContext[str], prompt: str) -> str:
    """
    This tool is used to delegate the task to `research_agent` to research the provided user `prompt`
    This tool can download a web page from url and can process the data.
    params:
    - ctx: RunContext[str]: The context of the run
    - prompt: str: The prompt to be used for research
    """

    logfire.info(
        f"Attempting to call the research_agent for research, prompt: " + prompt)

    try:
        response = await research_agent.run(prompt)
        logfire.info(f"Received data from the research_agent")
        return response.data
    except Exception as e:
        logfire.error(f"Error calling the research_agent: {e}")
        return f"Error calling the research_agent: {e}"

async def scrap_from_contents_tool(ctx: RunContext[str], prompt: str) -> dict:
    """
    This tool is used to delegate the task to `scrapper_agent` to fetch and scrap data for the provided user `prompt`. 
    Please notice that this tool can download the webpage contents and then scrap the data from it.
    params:
    - ctx: RunContext[str]: The context of the run
    - file_path: str: The path to the local file that contains the html contents
    - prompt: str: The prompt to be used for scrapping
    """
    logfire.info(
        f"Attempting to call the scrapper_agent for scrapping the contents as JSON, prompt: " + prompt)

    try:
        response = await scrapper_agent.run(prompt)
        logfire.info(f"Received data from the scrapper_agent")
        return response.data
    except Exception as e:
        logfire.error(f"Error calling the scrapper_agent: {e}")
        return f"Error calling the scrapper_agent: {e}"
```
协调者代理根据用户提示选择工具，其中子代理使用原始提示运行。我们可以要求协调者代理将提示进一步传递给子代理。上述示例只是展示如何协调子代理（它们不是我对研究代理实际研究的一部分）。

**自主研究代理**我尝试创建一个受 AutoGPT 启发的自主研究代理。该代理将研究任务分解，依次执行，并迭代地细化结果。

```python
research_agent = Agent(
    model,
    name="research_agent",
    deps_type=str,
    result_type=str,
    system_prompt=(
        """
        You are a research agent. 
        Your primary role is to plan and execute research tasks efficiently. Follow these steps:

        1. Break down the main research objective into smaller, manageable sub-tasks, task: {"task": "description of task", "status": "pending"}.
        2. Use the `store_tasks` tool to store the sub-tasks. Ensure each task is clearly defined and actionable.
        3. Use the `get_next_pending_task` tool to retrieve the next pending sub-task in the sequence.
        4. Use the `perform_task` tool to execute the retrieved sub-task and mark it as completed.

        Continue this process until all sub-tasks are completed and the research is successfully accomplished. 
        Always aim to complete tasks systematically and provide concise, clear results for each step.
        Do not run tasks in parallel as they may depend on each other.
        """
    )
)
```
到目前为止，该代理足够通用，可以逐个创建任务。

```python
async def main():

    query = "If I ask you to research on topic like services provided by the company from their complete website https://www.dataicraft.com, can you create tasks and accomplish them ?"
    result = await research_agent.run(query)
    print(result)

asyncio.run(main())
```
它仍在研究中，我可能在实验过程中需要调整（可能，我需要上一个关于提示工程的课程，因为这个差距变得显而易见）。对研究代理的调用有点更有指导性，因为我必须明确指定只进行工作，直到创建和迭代选择并解决一个待处理任务。（这也提出了需要以系统化的方法逐步编写 GenAI 应用程序的需求，逐步增加复杂性）

```python
@research_agent.tool
def store_tasks(ctx: RunContext[str], tasks: str) -> str:
    """
    Stores the tasks in JSON format with a 'pending' flag.
    """
    logfire.info(f"Storing tasks: {tasks}")

    # convert json from string into dict
    json_tasks = json.loads(tasks)

    with open(f"{work_folder}/tasks.json", "w") as f:
        json.dump(json_tasks, f, indent=4)

    logfire.info(f"Tasks stored successfully.")
    return "Tasks created and stored."
```
我正在考虑的一个重要点是工具的粒度（它们应该做多少工作，以及我们应该在多大程度上依赖 LLM 模型的认知特征）。目前，我采取的是非常小的工具，带有非常简短的文档字符串（尽管我还没有使用高级类型验证，只是为了保持研究的简单性）。上面定义的工具“store_tasks”用于代理为给定查询创建任务列表。给定的查询/提示导致以下任务：

```python
[
    {
        "task": "Fetch the DataCraft website homepage",
        "status": "pending"
    },
    {
        "task": "Identify the main sections related to services",
        "status": "pending"
    },
    {
        "task": "Extract the description of each service",
        "status": "pending"
    },
    {
        "task": "Summarize the findings",
        "status": "pending"
    }
]
```
有时，代理给键不同的名称，例如，“task” 有时被称为 “description”，因此我必须在系统提示中明确写出这一点，以便下一个工具需要这样做。我还尝试将温度设置为 0，以便代理可以给出确定性的响应，但到目前为止我仍在寻找它。

```python
@research_agent.tool
def get_next_pending_task(ctx: RunContext[str]) -> str:
    """
    从任务列表中获取下一个待处理任务。
    """
    logfire.info(f"正在获取下一个待处理任务...")

    with open(f"{work_folder}/tasks.json", "r") as f:
        tasks = json.load(f)

    for task in tasks:
        if task["status"] == "pending":
            logfire.info(f"找到下一个待处理任务: {task['task']}")
            return task["task"]

    logfire.info("没有找到待处理任务。")
    return "没有找到待处理任务。"
```
上述工具获取下一个待处理任务并返回给代理。


```python
@research_agent.tool
def perform_task(ctx: RunContext[str], task: str) -> str:
    """
    执行给定的任务并将其标记为已完成。
    """
    logfire.info(f"正在执行任务: {task}")

    with open(f"{work_folder}/tasks.json", "r") as f:
        tasks = json.load(f)

    for t in tasks:
        if t["task"] == task:
            t["status"] = "completed"
            break

    with open(f"{work_folder}/tasks.json", "w") as f:
        json.dump(tasks, f, indent=4)

    logfire.info(f"任务已完成: {task}")
    return f"任务已完成: {task}"
```
为了帮助代理记录已完成的任务，上述工具将任务的状态写为已完成（以便下次调用get_next_pending_task工具时可以检索下一个任务）。在我给代理提供基本的工具来从互联网获取网页之前，我无法让代理遵循这个过程。一旦它知道以下工具可用，它就会遵循系统提示。


```python
@research_agent.tool
def load_page(ctx: RunContext[str], url: str) -> str:
    """
    获取由 `url` 提供的网页并返回内容。

    """

    logfire.info(f"正在加载页面: {url}")
    content = ""
    with sync_playwright() as p:
        # 以无头模式启动浏览器
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 导航到 URL
        page.goto(url)

        # 等待页面完全加载
        page.wait_for_load_state("networkidle")

        # 获取渲染后的 HTML
        content = page.content()
        browser.close()

    return content
```
load_page工具简单地获取url并返回页面内容。我使用playwright库来完全获取网页（即使页面使用javascript加载一些内容）。在以后的版本中，我还将使用搜索API，例如Serp API，来研究多个页面）。使用到目前为止可用的工具，代理无法完成原始提示所要求的整个研究。代理的以下响应流（在一次执行中）清楚表明我们仍然需要更多工具来完成整体任务。


```python
RunResult(
    _all_messages=[
        SystemPrompt(content='\n        
   你是一个研究代理。\n
   你的主要角色是高效地规划和执行研究任务。遵循以下步骤：\n\n        
    1. 将主要研究目标分解为较小、可管理的子任务，任务: {"task": "任务描述", "status": "pending"}。\n        
    2. 使用 `store_tasks` 工具存储子任务。确保每个任务都清晰定义并可操作。\n        
    3. 使用 `get_next_pending_task` 工具检索序列中的下一个待处理子任务。\n        
    4. 使用 `perform_task` 工具执行检索到的子任务并将其标记为已完成。\n\n        
   
   继续这个过程，直到所有子任务完成，研究成功完成。\n        
   始终旨在系统地完成任务，并为每个步骤提供简明、清晰的结果。\n        
   不要并行运行任务，因为它们可能相互依赖。\n        ', role='system'),
        UserPrompt(content='如果我让你研究公司提供的服务，例如从他们的完整网站 https: // www.dataicraft.com，你能创建任务并完成它们吗？', timestamp=datetime.datetime(2024, 12, 21, 11, 50, 45, 433035, tzinfo=datetime.timezone.utc), role='user'),
        ModelStructuredResponse(calls=[ToolCall(tool_name='store_tasks', args=ArgsDict(args_dict=
   {
    'tasks': '
    [
     {"task": "获取DataCraft网站主页", "status": "pending"}, 
     {"task": "识别与服务相关的主要部分", "status": "pending"}, 
     {"task": "提取每项服务的描述", "status": "pending"}, 
     {"task": "总结发现", "status": "pending"}
    ]
   '}), tool_id=None)], timestamp=datetime.datetime(2024, 12, 21, 11, 50, 47, 305173, tzinfo=datetime.timezone.utc), role='model-structured-response'), 
        ToolReturn(tool_name='store_tasks', content='任务已创建并存储。', tool_id=None, timestamp=datetime.datetime(2024, 12, 21, 11, 50, 47, 341426, tzinfo=datetime.timezone.utc), role='tool-return '),
        ModelStructuredResponse(calls=[ToolCall(tool_name='get_next_pending_task', args=ArgsDict(args_dict={}), tool_id=None)], timestamp=datetime.datetime(2024, 12, 21, 11, 50, 47, 938261, tzinfo=datetime.timezone.utc), role='model-structured-response'), 
        ToolReturn(tool_name='get_next_pending_task', content='获取DataCraft网站主页', tool_id=None, timestamp=datetime.datetime(2024, 12, 21, 11, 50, 47, 976900, tzinfo=datetime.timezone.utc), role='tool-return '),
        ModelStructuredResponse(calls=[ToolCall(tool_name='perform_task', args=ArgsDict(args_dict={'task': '获取DataCraft网站主页'}), tool_id=None)], timestamp=datetime.datetime(2024, 12, 21, 11, 50, 48, 614588, tzinfo=datetime.timezone.utc), role='model-structured-response'),
        ToolReturn(tool_name='perform_task', content='任务已完成: 获取DataCraft网站主页', tool_id=None,timestamp=datetime.datetime(2024, 12, 21, 11, 50, 48, 651188, tzinfo=datetime.timezone.utc), role='tool-return '),
        ModelStructuredResponse(calls=[ToolCall(tool_name='get_next_pending_task', args=ArgsDict(args_dict={}), tool_id=None)], timestamp=datetime.datetime(2024, 12, 21, 11, 50, 49, 255609, tzinfo=datetime.timezone.utc), role='model-structured-response'),
        ToolReturn(tool_name='get_next_pending_task', content='识别与服务相关的主要部分', tool_id=None,timestamp=datetime.datetime(2024, 12, 21, 11, 50, 49, 271959, tzinfo=datetime.timezone.utc), role='tool-return '),
        ModelTextResponse(content='我需要访问互联网和解析HTML的能力来完成这个任务。可用的工具没有提供此功能。因此，我无法完成这个子任务。要继续，我需要额外的工具或库来进行网页抓取和HTML解析。\n', timestamp=datetime.datetime(2024, 11, 50, 50, 91294, tzinfo=datetime.timezone.utc), role='model-text-response')], _new_message_index=1, data='我需要访问互联网和解析HTML的能力来完成这个任务。可用的工具没有提供此功能。因此，我无法完成这个子任务。要继续，我需要额外的工具或库来进行网页抓取和HTML解析。\n', _cost=Cost(request_tokens=2752, response_tokens=156, total_tokens=2908, details=None))
    ]
))
```
RunResult包含消息列表，从系统提示和用户提示开始。下一条消息“ModelStructuredResponse”显示了LLM模型的结构化响应，其中包含工具调用（以及LLM模型建议的工具参数）。工具被执行，返回ToolReturn。它遵循任务的流程，直到它能够解决任务（尽管perform_task只是模拟任务完成并响应消息，以便代理知道它可以继续）。当下一个待处理任务被提取时，LLM模型给出的最终响应表明该任务没有可用工具。我将从这里继续进行更多研究。最终目标仍然遥远，因为我仍然需要使事情正常运作，以解决整体目标。如果有读者想要加入我这个努力，我们可以共同努力，将这个代理做成一个SaaS产品。但它仍处于起步阶段。

