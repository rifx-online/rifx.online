---
title: "选择合适的人工智能代理框架：LangGraph vs CrewAI vs OpenAI Swarm"
meta_title: "选择合适的人工智能代理框架：LangGraph vs CrewAI vs OpenAI Swarm"
description: "本文对三种流行的AI代理框架：LangGraph、CrewAI和OpenAI Swarm进行了深入比较，探讨了它们在构建自主财务助手中的优缺点。代理被定义为能够独立与环境互动并实时决策的系统，框架简化了代理的构建过程。每个框架在代理定义、工具集成、编排、记忆和人机交互方面的实现方式各有不同，LangGraph采用图形结构，CrewAI提供直观的抽象，而OpenAI Swarm则强调简洁性和灵活性。文章最后提供了选择框架的建议，并预告了后续内容将探讨代理的可调试性和可观察性。"
date: 2024-12-07T12:20:43Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*V-woT70yXxoIjArj.png"
categories: ["Programming", "Machine Learning", "Data Science"]
author: "Rifx.Online"
tags: ["agents", "frameworks", "orchestration", "memory", "benchmark"]
draft: False

---



对使用 3 种不同框架构建的相同 Agentic Finance 应用程序进行深入比较。



## 我们将涵盖的内容

* **什么是代理？** 深入了解我们如何定义代理，以及它们与AI管道和独立LLM的区别。
* **使用3个流行的代理框架构建的实践示例：** LangGraph、CrewAI和OpenAI Swarm（[完整代码](https://github.com/relari-ai/agent-examples)）。
* **我们对何时使用哪个框架的建议。**
* **接下来可以期待什么：** Part II的预览，我们将探讨这些框架中的可调试性和可观察性。

## 介绍

由LLMs驱动的自主代理经历了起伏。从2023年AutoGPT和BabyAGI的病毒式演示到今天更为精细的框架，能够自主执行端到端任务的代理-LLMs的概念引发了人们的想象和怀疑。

为何重新引起关注？在过去的9个月里，LLMs经历了显著的升级：更长的上下文窗口、结构化输出、更好的推理能力以及简单的工具集成。这些进展使得构建可靠的代理应用程序比以往任何时候都更具可行性。

在这篇博客中，我们将探讨**三种流行的框架**来构建代理应用程序：**LangGraph**、**CrewAI**和**OpenAI Swarm**。通过一个**代理财务助手**的实际示例，我们将突出每个框架的优缺点和实际应用案例。

## 什么是代理？

代理是由大型语言模型（LLMs）驱动的高级系统，能够**独立与环境互动**并**实时做出决策**。与传统的LLM应用程序不同，后者通常被构建为僵化的、预定义的流程（例如，A → B → C），代理工作流程引入了一种动态和自适应的方法。代理利用**工具** \- 函数或API，使其能够与环境互动 \- 根据上下文和目标决定下一步行动。这种灵活性使代理能够偏离固定的顺序，从而实现更自主和高效的工作流程，以适应复杂和不断发展的任务。

然而，这种灵活性也带来了自身的一系列挑战：

* 在任务之间管理状态和记忆
* 协调多个子代理及其通信架构
* 确保工具调用的可靠性，并在出现复杂错误情况时进行处理
* 处理大规模的推理和决策制定

## 为什么我们需要代理框架

从头开始构建代理并不是一件简单的事情。像 LangGraph、CrewAI 和 OpenAI Swarm 这样的框架简化了这一过程，使开发人员能够专注于他们的应用逻辑，而不是在状态管理、编排和工具集成上重新发明轮子。

在其核心，代理框架提供了

* 定义代理和工具的简单方法
* 编排机制
* 状态管理
* 使更复杂的应用程序得以实现的附加工具，如：持久层（内存）、中断等

我们将在接下来的章节中逐一探讨这些内容。‍

## 介绍代理框架

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*g-mDTL2-Swteh9tV.png)

我们选择了 **LangGraph**、**CrewAI** 和 **OpenAI Swarm**，因为它们代表了代理开发领域的最新思想。以下是快速概述：

* **LangGraph：** 顾名思义，LangGraph 以图形架构为基础，认为这是定义和协调代理工作流的最佳方式。与早期版本的 LangChain 不同，LangGraph 是一个设计良好的框架，具有许多强大且可定制的功能，适合生产环境。然而，对于某些用例来说，它有时比必要的复杂，可能会带来额外的开销。
* **CrewAI：** 相比之下，CrewAI 更容易上手。它提供了直观的抽象，帮助您专注于任务设计，而不是编写复杂的协调和状态管理逻辑。然而，权衡之下，它是一个高度有主见的框架，后续定制起来会更加困难。
* **OpenAI Swarm：** 一个轻量级、极简的框架，OpenAI 将其描述为“教育性”而非“生产就绪”。OpenAI Swarm 几乎代表了一种“反框架”——将许多功能留给开发人员实现，或让强大的 LLM 自行解决。我们相信，对于今天有简单用例的人，或者希望将灵活的代理工作流集成到现有 LLM 流水线中的人来说，它可能是完美的选择。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*j6CA9T_bk3HnNdfO.png)

## 其他显著的框架

* **LlamaIndex Workflow:** 一个事件驱动的框架，在概念上非常适合许多代理工作流。然而，就目前而言，我们发现它仍然需要开发者编写大量的样板代码才能使其正常工作。LlamaIndex团队正在积极改进Workflow框架，我们希望他们能尽快创建更多高级抽象。
* **AutoGen:** 由微软开发的用于多代理对话编排的框架，AutoGen已被广泛应用于各种代理用例。根据早期版本的错误和反馈，AutoGen团队正在进行一次完全重写（从v0.2到v0.4），转变为一个事件驱动的编排框架。

## 构建一个自主财务助手

为了对这些框架进行基准测试，我们使用每个框架构建了相同的 **自主财务助手**。构建的应用程序的完整代码可在此处获得：[Relari Agent Examples](https://github.com/relari-ai/agent-examples)。

我们希望助手能够处理复杂的查询，例如：

* *Spirit Airline的财务健康状况与其竞争对手相比如何？*
* *从财务角度来看，Apple表现最好的产品线是什么？他们在网站上宣传什么？*
* *帮我找一些市值低于50亿美元且年收入增长超过20%的消费股*

*以下是我们希望助手提供的全面响应示例片段：*

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*facH8HbIqXZ4-3NX.png)

为了实现这些目标，我们为代理系统提供了通过 [FMP](https://site.financialmodelingprep.com/developer/docs) API 访问财务数据库的权限，并且可以访问互联网以研究互联网内容。

在构建自主AI应用程序时，我们需要做出的首要选择之一是架构。架构有多种，每种都有其优缺点。下图总结了一些流行的架构，由LangGraph提供（您可以在此处阅读有关架构选择的更多信息：[multi\-agent architecture](https://langchain-ai.github.io/langgraph/concepts/multi_agent/#multi-agent-architectures)）。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*YdOrp0-bIIH9uN3v.png)

我们为此应用选择了Supervisor架构，出于教育目的。因此，我们将创建一个Supervisor Agent，其任务是决定将任务委派给哪个子代理，以及三个具有工具访问权限的子代理：一个财务数据代理，一个网络研究代理和一个总结代理。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*I6bDSJ5Pv_QsvjKznORdxA.png)

让我们探讨每个框架如何处理代理创建、工具集成、编排、记忆和人机交互。‍

### 1\. 定义代理和工具

我们首先来看如何定义一个常规代理，例如金融数据代理、网络研究代理和输出总结代理，并在每个框架中声明其相关工具。监督代理是一个特殊的代理，扮演着协调的角色，因此我们将在协调部分进行讨论。

### LangGraph

创建一个简单的工具调用代理的最简单方法是使用预构建的 `create_react_agent` 函数，如下所示，我们可以提供我们希望该代理使用的工具和提示。

```python
from langgraph.prebuilt import create_react_agent
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool

## Below is one example of a tool definition
@tool
def get_stock_price(symbol: str) -> dict:
    """Fetch the current stock price for a given symbol.
    Args:
        symbol (str): The stock ticker symbol (e.g., "AAPL" for Apple Inc.).
    Returns:
        dict: A dictionary containing the stock price or an error message.
    """
    base_url = "https://financialmodelingprep.com/api/v3/quote-short"
    params = {"symbol": symbol, "apikey": os.getenv("FMP_API_KEY")}

    response = requests.get(base_url, params=params)
    if response.status_code == 200:
        data = response.json()
        if data:
            return {"price": data[0]["price"]}
    return {"error": "Unable to fetch stock price."}

## Below is one example of a simple react agent
financial_data_agent = create_react_agent(
    ChatOpenAI(model="gpt-4o-mini"),
    tools=[get_stock_price, get_company_profile, ...],
    state_modifier="You are a financial data agent responsible for retrieving financial data using the provided API tools ...",
)
```
在 LangGraph 中，一切都被结构化为图。实用函数 `create_react_agent` 创建一个简单的可执行图，该图包含代理节点和工具节点。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*_pB1Rq7LAnEZs1b6.png)

代理充当决策者，动态决定调用哪些工具，并评估是否拥有足够的信息以过渡到 `__end__` 状态。

在图中，实线表示确定性边缘（工具节点必须始终返回到代理），而虚线表示条件边缘，其中 LLM 驱动的代理正在决定下一步的去向。

节点和边缘是图的基础构建块。我们将在后面的编排部分看到，这个图可以表示为更大、更复杂图中的一个节点。

### CrewAI

CrewAI的代理定义围绕**代理**和**任务**（代理需要完成的内容）之间的关系展开。

对于每个代理，我们必须定义其`role`、`goal`和`backstory`，并指定其可访问的工具。


```python
from crewai import Agent, Task

financial_data_agent = Agent(
    role="Financial Data Agent",
    goal="Retrieve comprehensive financial data using FMP API that provide the data needed to answer the user's query",
    backstory="""You're a seasoned financial data gatherer with extensive experience in
    gathering financial information. Known for your precision
    and ability to find the most relevant financial data points using
    FMP API that provides financial data on public companies in the US""",
    tools=[
        StockPriceTool(),
        CompanyProfileTool(),
        ...
    ]
)
```
然后我们需要创建需要代理执行的任务。任务必须包含`description`和`expected_output`。


```python
gather_financial_data = Task(
    description=("Conduct thorough financial research to gather relevant financial data that can help "
    "answer the user query: {query}. Use the available financial tools to fetch accurate "
    "and up-to-date information. Focus on finding relevant stock prices, company profiles, "
    "financial ratios, and other pertinent financial metrics that answer the user's query: {query}."),
    expected_output="A comprehensive set of financial data points that directly address the query: {query}.",
    agent=financial_data_agent,
)
```
这种构建LLM提示的结构化方法提供了一个清晰且一致的框架，确保代理和任务得到良好的定义。虽然这种方法有助于保持重点和连贯性，但在重复定义角色、目标、背景故事和任务描述时，有时会显得僵化或重复。

可以使用@tool装饰器集成工具，类似于LangGraph中的方法。值得一提的是，另外我们可以扩展BaseTool类，这将是强制工具输入模式的更稳健的方法，得益于使用Pydantic模型（这种方法在LangGraph中也得到了支持）。


```python
class StockPriceInput(BaseModel):
    """Input schema for stock price queries."""
    symbol: str = Field(..., description="The stock ticker symbol")

class StockPriceTool(BaseTool):
    name: str = "Get Stock Price"
    description: str = "Fetch the current stock price for a given symbol"
    args_schema: Type[BaseModel] = StockPriceInput

def _run(self, symbol: str) -> dict:
    # Use FMP API to fetch the stock price of the given symbol‍
```

### OpenAI Swarm

Swarm采取了不同的方法：OpenAI建议将推理流程结构化为系统提示中的“例程”（在`instructions`中），即代理为完成任务而遵循的预定义步骤或指令集合。这是可以理解的，因为OpenAI更希望开发者依赖模型遵循指令的能力，而不是在代码中定义自定义逻辑集合。我们发现这种方法在使用更强大的LLM时简单有效，因为它能够跟踪和推理这些例程。

对于工具，我们可以直接引入作为工具。

```python
from swarm import Agent

financial_data_agent = Agent(
    name="Financial Data Agent",
    instructions="""You are a financial data specialist responsible for retrieving financial data using the provided API tools.
    Your tasks:
    Step 1. Given a user query, use the appropriate tool to fetch relevant financial data
    Step 2. Read the data and make sure they can answer the user query. If not, modify the tool input or use different tools to get more information.
    Step 3. Once you have gathered enough information, return only the raw data obtained from the tool. Do not add commentary or explanations""",
    functions=[
        get_stock_price,
        get_company_profile,
        ...
    ]
)‍
```

## 2\. 编排

我们现在来看看每个框架的核心部分，它们是如何将多个子代理结合在一起的。‍

### LangGraph

LangGraph 的核心是基于图的调度。我们首先创建监督代理，它充当路由器，唯一的任务是分析情况并决定下一个调用哪个代理。执行代理本身只能将结果传回给监督代理。

LangGraph 需要明确的状态定义。`AgentState` 类帮助在不同代理之间定义一个共同的状态架构。

```python
class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], operator.add]
    next: str
```
对于每个代理，我们通过将状态包装在一个节点中与之交互，该节点将代理输出转换为一致的消息架构。

```python
async def financial_data_node(state):
    result = await financial_data_agent.ainvoke(state)
    return {
        "messages": [
            AIMessage(
                content=result["messages"][-1].content, name="Financial_Data_Agent"
            )
        ]
    }
```
我们现在准备定义代理本身。

```python
class RouteResponse(BaseModel):
    next: Literal[OPTIONS]

def supervisor_agent(state):
    prompt = ChatPromptTemplate.from_messages([
        ("system", ORCHESTRATOR_SYSTEM_PROMPT),
        MessagesPlaceholder(variable_name="messages"),
        (
            "system",
            "根据上面的对话，谁应该接下来行动？"
            " 或者我们应该结束吗？选择以下之一：{options}",
        ),
    ]).partial(options=str(OPTIONS), members=", ".join(MEMBERS))
  
    supervisor_chain = prompt | LLM.with_structured_output(RouteResponse)
    return supervisor_chain.invoke(state)
```
在定义监督代理后，我们通过将每个代理作为节点添加并将所有执行逻辑作为边来定义代理工作流程。

在定义边时，我们有两种可能性：**常规**或**条件**边。当我们想要确定性过渡时，使用常规边。例如，金融数据代理应该始终将结果返回给监督代理以决定下一步。

条件边用于当我们希望 LLM 选择采取哪个路径时（例如，监督代理决定是否有足够的数据直接发送给输出总结代理，还是返回数据和网络代理以获取更多信息）。

```python
from langgraph.graph import END, START, StateGraph

def build_workflow() -> StateGraph:
    """构建工作流程的状态图。"""
    workflow = StateGraph(AgentState)

    workflow.add_node("Supervisor_Agent", supervisor_agent)
    workflow.add_node("Financial_Data_Agent", financial_data_node)
    workflow.add_node("Web_Research_Agent", web_research_node)
    workflow.add_node("Output_Summarizing_Agent", output_summarizing_node)

    workflow.add_edge("Financial_Data_Agent", "Supervisor_Agent")
    workflow.add_edge("Web_Research_Agent", "Supervisor_Agent")

    conditional_map = {
        "Financial_Data_Agent": "Financial_Data_Agent",
        "Web_Research_Agent": "Web_Research_Agent",
        "Output_Summarizing_Agent": "Output_Summarizing_Agent",
        "FINISH": "Output_Summarizing_Agent",
    }
    workflow.add_conditional_edges(
        "Supervisor_Agent", lambda x: x["next"], conditional_map
    )

    workflow.add_edge("Output_Summarizing_Agent", END)
    workflow.add_edge(START, "Supervisor_Agent")

    return workflow
```
这是生成的图。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*tTrheeq8v0yo7hMK.png)

### CrewAI

与 LangGraph 相比，CrewAI 抽象化了大部分的协调任务。

```python
supervisor_agent = Agent(
    role="Financial Assistant Manager",
    goal="Leverage the skills of your coworkers to answer the user's query: {query}.",
    backstory="""You are a manager who oversees the workflow of the financial assistant,
    skilled in overseeing complex workers with different skills and ensuring that you can answer the user's query with the help of the coworkers.
    You always try to gather data using the financial data agent and / or web scraping agent first.
    After gathering the data, you must delegate to the output summarizing agent to create a comprehensive report instead of answering the user's query directly.""",
    verbose=True,
    llm=ChatOpenAI(model="gpt-4o", temperature=0.5),
    allow_delegation=True,
    )
```
与 Langgraph 类似，我们首先创建监督代理。请注意 `allow_delegation` 标志，它允许代理将任务传递给其他代理。

接下来，我们使用 `Crew` 将代理聚集在一起。在这里选择 `Process.hierarchical` 非常重要，以允许监督代理委派任务。在后台，监督代理接收用户查询并将其转换为任务，然后找到相关的代理来执行这些任务。如果我们希望创建一个更确定性的流程，其中任务将按顺序执行，另一种选择是不使用管理代理并执行 `Process.sequential`。

```python
finance_crew = Crew(
    agents=[
        financial_data_agent,
        web_scraping_agent,
        output_summarizing_agent
    ],
    tasks=[
        gather_financial_data,
        gather_website_information,
        summarize_findings
    ],
    process=Process.hierarchical,
    manager_agent=supervisor_agent,
)‍
```

### OpenAI Swarm

Swarm orchestration 使用一种非常简单的策略——交接。核心思想是创建一个转移函数，其中使用另一个代理作为工具。

这无疑是最干净的方法。关系在转移函数中是隐式的。

```python
def transfer_to_summarizer():
    return summarizing_agent

def transfer_to_web_researcher():
    return web_researcher_agent

def transfer_to_financial_data_agent():
    return financial_data_agent

supervisor_agent = Agent(
    name="Supervisor",
    instructions="""You are a supervisor agent responsible for coordinating the Financial Data Agent, Web Researcher Agent, and Summarizing Agent.
    Your tasks:
    1. Given a user query, determine which agent to delegate the task to based on the user's query
    2. If the user's query requires financial data, delegate to the Financial Data Agent
    3. If the user's query requires web research, delegate to the Web Researcher Agent
    4. If there's enough information already available to answer the user's query, delegate to the Summarizing Agent for final output.
    Never summarize the data yourself. Always delegate to the Summarizing Agent to provide the final output.
    """,
    functions=[ # Agent as a tool
        transfer_to_financial_data_agent,
        transfer_to_web_researcher,
        transfer_to_summarizer
    ]
)
```
这种方法的一个缺点是，随着应用程序的增长，代理之间的依赖关系变得更难以跟踪。

## 3\. 内存

内存是有状态智能系统的关键组成部分。我们可以区分两个层次的内存：

* **短期** 内存允许智能体维持多轮 / 多步骤的执行，
* **长期** 内存允许智能体在会话之间学习和记住偏好。

这个主题可能会变得非常复杂，但让我们看看每个框架中可用的最简单的内存协调。 

``` 
## 示例代码
def example_function():
    pass
```

### LangGraph

LangGraph 在单线程（单个对话线程内的记忆）和跨线程（跨对话的记忆）之间进行了区分。

为了保存单线程记忆，LangGraph 提供了 MemorySaver() 类，用于将图的状态或对话历史保存到 `checkpointer` 中。

```python
from langgraph.checkpoint.memory import MemorySaver

def build_app():
    """Build and compile the workflow."""
    memory = MemorySaver()
    workflow = build_workflow()
    return workflow.compile(checkpointer=memory)
```
要将代理执行与记忆线程关联，请传递一个带有 `thread_id` 的配置。这告诉代理使用哪个线程的记忆检查点。例如：

```python
config = {"configurable": {"thread_id": "1"}}
app = build_app()
await run(app, input, config)
```
为了保存跨线程记忆，LangGraph 允许我们将记忆保存到 JSON 文档存储中。

```python
from langgraph.store.memory import InMemoryStore

store = InMemoryStore()  # Can be a DB-backed store in production use
user_id = "user_0"
store.put(
    user_id,
    "current_portfolio",
    {
        "portfolio": ["TSLA", "AAPL", "GOOG"],
    }
)‍
```

### CrewAI

毫不奇怪，CrewAI采取了一种更简单但更严格的方法。开发者只需将内存设置为true。

```python
finance_crew = Crew(
    agents=[financial_data_agent, web_researcher_agent, summarizing_agent],
    tasks=[gather_financial_data, gather_website_information, summarize_findings],
    process=Process.hierarchical,
    manager_agent=supervisor_agent,
    memory=True, # creates memory databases in "CREWAI_STORAGE_DIR" folder
    verbose=True, # necessary for memory
)
```
它在后台所做的事情非常复杂，因为它创建了几种不同的内存存储：

* 短期记忆：创建一个带有OpenAI嵌入的ChromaDB向量存储，存储代理执行历史。
* 最近记忆：SQLite3数据库，用于存储最近的任务执行结果。
* 长期记忆：SQLite3数据库，用于存储任务结果，请注意，任务描述必须完全匹配（相当严格），才能检索长期记忆。
* 实体记忆：提取关键实体并将实体关系存储到另一个ChromaDB向量存储中。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*S78repO8Ma-EWFbv.png)

### OpenAI Swarm

Swarm 使用简单的无状态设计，并且没有内置的记忆功能。关于 OpenAI 如何看待记忆的一个参考可以在其有状态的 Assistant API 中看到。每个对话都有一个 thread_id 用于短期记忆，而每个助手都有一个 assistant_id，可以与长期记忆相关联。

还可以集成第三方记忆层提供商，例如 [mem0](https://github.com/mem0ai/mem0)，或实现我们自己的短期和长期记忆。

## 4\. 人工干预

虽然我们希望代理是自主的，但许多代理被设计为与人类互动。

例如，客户支持代理可以在执行链中询问用户信息。人类还可以充当审计员或指导者，以实现更无缝的人机协作。‍

### LangGraph

LangGraph 允许我们在图中设置断点，如下所示，如果我们想在摘要生成器构建最终输出之前添加一个人工检查点。

```python
workflow.compile(checkpointer=checkpointer, interrupt_before=["Output_Summarizing_Agent"])
```
然后，图将执行直到达到断点。我们可以在继续执行图之前实现一个步骤以获取用户输入。

```python
## Run the graph until the first interruption
for event in graph.stream(initial_input, thread, stream_mode="values"):
    print(event)

try:
    user_approval = input("Do you want to go to Output Summarizer? (yes/no): ")
except:
    user_approval = "yes"

if user_approval.lower() == "yes":
    # If approved, continue the graph execution
    for event in graph.stream(None, thread, stream_mode="values"):
        print(event)
else:
    print("Operation canceled by user.")‍
```

### CrewAI

CrewAI 允许人类通过在代理初始化时设置 `human_input=True` 标志来提供反馈。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*tBtjr57agqneYgvj.png)

代理执行后将暂停，并要求用户输入对其行为和结果的自然语言反馈（见下文）。

然而，它不支持更多自定义的人机交互。‍

### OpenAI Swarm

Swarm 没有任何内置的人机协作功能。然而，在执行过程中添加人类输入的最简单方法是将人类作为工具或作为 AI 代理可以转移到的代理。‍

## 功能差异总结

总结我们在三个框架中构建相同应用程序的发现。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*TVka-rR7OnaG1fc4uQg6nQ.png)

‍

## 我们的建议

我们在流程图中总结了我们的建议，以帮助您决定从哪个框架开始。 

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*zZsMcyy75YKgISFLtGkWKQ.jpeg)

‍‍

## 接下来是什么？

这篇博客专注于构建代理的第一个版本。这些代理绝对不是高效或可靠的。

下一篇博客将专注于改进和迭代这些代理（通常是AI系统生产的主要工作）。

* 定义成功标准和指标
* 基于不同框架的代理性能基准测试
* 深入探讨质量和可靠性
* 针对提示、工具、推理、架构进行有针对性的改进

我们将使用Relari正在开发的一些最新代理评估、模拟和可观察性工具，深入探讨如何将这些代理转变为生产就绪的系统。

订阅并保持关注！

*最初发布于 [https://www.relari.ai](https://www.relari.ai/blog/ai-agent-framework-comparison-langgraph-crewai-openai-swarm).*

