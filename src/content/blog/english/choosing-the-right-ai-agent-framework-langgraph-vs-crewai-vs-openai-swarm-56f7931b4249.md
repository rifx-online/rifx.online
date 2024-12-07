---
title: "Choosing the Right AI Agent Framework: LangGraph vs CrewAI vs OpenAI Swarm"
meta_title: "Choosing the Right AI Agent Framework: LangGraph vs CrewAI vs OpenAI Swarm"
description: "This article provides a detailed comparison of three AI agent frameworks: LangGraph, CrewAI, and OpenAI Swarm, using a common application, the Agentic Finance Assistant, as a benchmark. It explains the definition and significance of agents in AI, highlights the strengths and weaknesses of each framework, and discusses their orchestration, memory management, and human-in-the-loop capabilities. The article concludes with recommendations on when to use each framework and hints at future explorations into enhancing agent performance and reliability."
date: 2024-12-07T12:20:43Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*V-woT70yXxoIjArj.png"
categories: ["Programming", "Machine Learning", "Data Science"]
author: "Rifx.Online"
tags: ["agents", "frameworks", "orchestration", "memory", "benchmark"]
draft: False

---




In\-depth comparison of agent orchestration with the same Agentic Finance App built using 3 different frameworks.




## What We Will Cover

* **What are agents?** A deeper look at how we define agents and what sets them apart from AI pipelines, and standalone LLMs.
* **Hands\-on example built using 3 popular agent frameworks:** LangGraph, CrewAI, and OpenAI Swarm ([full code](https://github.com/relari-ai/agent-examples)).
* **Our recommendation on when to use which framework.**
* **What to expect next:** A preview of Part II, where we’ll explore debuggability and observability in these frameworks.


## Introduction

Autonomous agents powered by LLMs have seen their ups and downs. From the viral demos of AutoGPT and BabyAGI in 2023 to today’s more refined frameworks, the concept of agents\-LLMs that can execute end\-to\-end tasks autonomously\-has captured both imagination and skepticism.

Why the renewed interest? LLMs have seen significant upgrades over the past 9 months: longer context windows, structured outputs, better reasoning, and simple tool integration. These advancements make building reliable agentic applications more viable than ever.

In this blog, we’ll explore **three popular frameworks** for building agentic applications: **LangGraph**, **CrewAI**, and **OpenAI Swarm**. By using a hands\-on example of an **Agentic Finance Assistant**, we’ll highlight each framework’s strengths, weaknesses, and practical use cases.


## What are agents?

Agents are advanced systems powered by large language models (LLMs) that can **independently interact with their environment** and **make decisions** in real time. Unlike traditional LLM applications, which are structured as rigid, predefined pipelines (e.g., A → B → C), agentic workflows introduce a dynamic and adaptive approach. Agents leverage **tools** \-functions or APIs that enable interaction with their environment\-to decide their next steps based on context and goals. This flexibility allows agents to deviate from fixed sequences, enabling more autonomous and efficient workflows tailored to complex and evolving tasks.

However, this flexibility comes with its own set of challenges:

* Managing state and memory across tasks
* Orchestrating multiple sub\-agents and their communication schema.
* Making sure the tool calling is reliable and handling complex error cases when they arise.
* Handling reasoning and decision\-making at scale.


## Why we need Agent Frameworks

Building agents from scratch is no small feat. Frameworks like LangGraph, CrewAI, and OpenAI Swarm simplify the process, enabling developers to focus on their application logic instead of reinventing the wheel for state management, orchestration, and tool integration.

At their core agents framework offer

* A simple way to define agents and tools
* An orchestration mechanism
* State management
* Additional tools to enable more complex applications like: persistence layer (memory), interruptions, etc

We will go through each of these in the following sections.‍


## Introducing Agent Frameworks

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*g-mDTL2-Swteh9tV.png)

We chose **LangGraph**, **CrewAI**, and **OpenAI Swarm** because they represent the latest schools of thought in agent development. Here’s a quick overview:

* **LangGraph:** As its name suggests, LangGraph bets on graph architecture as the best way to define and orchestrate agentic workflows. Unlike early versions of LangChain, LangGraph is a well designed framework with many robust and customizable features built for production. However, it’s sometimes more complex than necessary for certain use cases and can create additional overhead.
* **CrewAI:** CrewAI in contrast is much simpler to get started. It comes with intuitive abstractions that help you focus on task design as opposed to writing complex orchestration and state management logic. However, the tradeoff is that it is a highly opinionated framework and is more difficult to customize down the road.
* **OpenAI Swarm:** A lightweight, minimalist framework described by OpenAI to be “educational” rather than “production\-ready”. OpenAI Swarm almost represents an “anti\-framework” — leaving many functionalities up to developers to implement or for the powerful LLMs to figure out themselves. We believe it could be the perfect fit for those with simple use cases today, or for those who want to integrate nimble agentic workflows into an existing LLM pipeline.‍

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*j6CA9T_bk3HnNdfO.png)


## Other Notable Frameworks

* **LlamaIndex Workflow:** An event\-driven framework that is a conceptually good fit for many agentic workflows. However, as it stands today, we find that it still requires the developers to write a significant amount of boilerplate code to make it work. The LlamaIndex team is actively improving the Workflow framework and we hope they create more high\-level abstractions soon.
* **AutoGen:** A framework developed by Microsoft for multi\-agent conversation orchestration, AutoGen has been adopted for a variety of agent use cases. Learning from the mistakes and feedback from the early versions, AutoGen team is doing a complete rewrite (from v0\.2 to v0\.4\) into an event\-driven orchestration framework.


## Building an Agentic Finance Assistant

To benchmark these frameworks, we built the same **agentic finance assistant** using each framework. Full code for the applications built are available here: [Relari Agent Examples](https://github.com/relari-ai/agent-examples).

We want the agent to handle complex queries like:

* *How does Spirit Airline’s financial health compare to its competitors?*
* *What is Apple’s best performing product line from the financial perspective? And what are they marketing on their website?*
* *Find me some consumer stocks that are below $5bn in market cap that has a revenue growth over 20% YoY*

*Here’s an example snippet of the comprehensive response we’d like to see from assistant:*

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*facH8HbIqXZ4-3NX.png)

To accomplish these, we provide the agent system access to a financial database through the [FMP](https://site.financialmodelingprep.com/developer/docs) API and internet access to research internet content.

When building an agentic AI application, one of the first choices we need to take is the architecture. There are several architectures and each of them has their pros and cons. In the image below there are some popular architecture summarized by LangGraph (You can read more about the architectural choices here: [multi\-agent architecture](https://langchain-ai.github.io/langgraph/concepts/multi_agent/#multi-agent-architectures)).

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*YdOrp0-bIIH9uN3v.png)

We picked the Supervisor architecture for this application for educational purposes. So we will be creating a Supervisor Agent whose task is to decide which sub\-agent to delegate the task, and three sub\-agents with tool access: a financial data agent, a web research agent, and a summarizing agent.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*I6bDSJ5Pv_QsvjKznORdxA.png)

Let’s explore how each framework approaches agent creation, tool integration, orchestration, memory, and human\-in\-the\-loop interaction.‍


### 1\. Defining Agents and Tools

We first look at how we define a regular agent like Financial Data Agent, Web Research Agent and Output Summarizing Agent and declare its associated tools in each framework. The Supervisor Agent is a special agent that plays the orchestration role so we will cover in the Orchestration section.


### LangGraph

The easiest way to create a simple tool\-calling agent is to use the prebuilt `create_react_agent` function as below, where we can provide the tools and prompts we want this agent to operate with.


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
In LangGraph, everything is structured as a graph. The utility function `create_react_agent` creates a simple executable graph that contains the agent node and the tool node.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*_pB1Rq7LAnEZs1b6.png)

The agent acts as the decision maker and dynamically determines which tools to call and assesses whether it has sufficient information to transition to the `__end__` state.

In the graphs, solid lines represent deterministic edges (the Tool node must always return to the agent), whereas dashed lines represent conditional edges where the LLM\-powered agent is making the decisions on where to go next.

Nodes and edges are foundational building blocks of the graph. We will see later in the orchestration section that this graph can be represented as a node in a larger, more complex graph.

‍


### CrewAI

CrewAI’s agent definition centers around the relationship between **agents** and **tasks** (what the agent is supposed to accomplish).

With each agent, we must define its `role`, `goal`, and `backstory`, and specify the tools it has access to.


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
Then we have to create the task that requires the agent to execute. The Task must contain the `description` and the `expected_output`.


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
This structured approach to building prompts for LLMs provides a clear and consistent framework, ensuring that agents and tasks are well\-defined. While this method helps maintain focus and coherence, it can sometimes feel rigid or repetitive, particularly when repeatedly defining roles, goals, backstories, and task descriptions.

Tools can be integrated using the @tool decorator, similar to the approach in LangGraph. It is worth mentioning that alternatively, we could extend the BaseTool class, which would be a more robust method for enforcing tool input schemas, thanks to the use of Pydantic models (this approach is also supported by LangGraph).


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

Swarm takes a different approach: instead of explicitly defining the reasoning flow in code, OpenAI proposes to structure the flow in system prompts as “Routines” (in `instructions`), predefined sets of steps or instructions that an agent follows to accomplish a task. This is understandable coming from OpenAI as they would prefer developers to lean more on the models ability of following instructions rather than defining sets of custom logic in code. We find this approach to be simple and effective when working with a stronger LLM that's capable of keeping track of an reasoning over the Routines.

For tools, we can just bring in directly as tools.


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

## 2\. Orchestration

We now look at the core part of each framework on how they bring multiple sub\-agents together.‍


### LangGraph

The core of langgraph is graph\-based orchestration. We first create the supervisor agent, which acts as a router and its sole task is to analyze the situation and decide which agent to call next. The execution agents themselves can only communicate the results back to the supervisor agent.

LangGraph requires the explicit definition of the state. The `AgentState` class helps define a common state schema across different agents.


```python
class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], operator.add]
    next: str
```
For each agent, we interact with the state by wrapping it in a node that converts the agent output into the consistent message schema.


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
We are now ready to define the agent itself.


```python
class RouteResponse(BaseModel):
    next: Literal[OPTIONS]

def supervisor_agent(state):
    prompt = ChatPromptTemplate.from_messages([
        ("system", ORCHESTRATOR_SYSTEM_PROMPT),
        MessagesPlaceholder(variable_name="messages"),
        (
            "system",
            "Given the conversation above, who should act next?"
            " Or should we FINISH? Select one of: {options}",
        ),
    ]).partial(options=str(OPTIONS), members=", ".join(MEMBERS))
  
    supervisor_chain = prompt | LLM.with_structured_output(RouteResponse)
    return supervisor_chain.invoke(state)
```
After defining the supervisor agent, we define the agent workflow as a graph by adding each agent as a node and all the execution logic as edges.

When defining the edges we have two possibilities: **regular** or **conditional** edges. Regular edges are used when we want a deterministic transition. For example, the Financial Data Agent should always return the results to the Supervisor\_Agent to decide the next steps.

Conditional edges instead are used when we want the LLM to pick which path to take (e.g. the Supervisor Agent deciding if it has enough data to just send to the Output Summerizing Agent or go back to the Data and Web agents for more information.


```python
from langgraph.graph import END, START, StateGraph

def build_workflow() -> StateGraph:
    """Construct the state graph for the workflow."""
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
Here is the resulting graph.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*tTrheeq8v0yo7hMK.png)


### CrewAI

In contrast to LangGraph, CrewAI abstracts away most of the orchestration tasks.


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
Similar to Langgraph, we first create the supervisor agent. Notice the `allow_delegation` flag which allows the agent to pass tasks to other agents.

Next we use the `Crew` to bring the agents together. It's important to select `Process.hierarchical` here to allow the supervisor agent to delegate tasks. Behind the scenes, the supervisor agent takes the user query and converts it into tasks, it then finds the associated agents to carry out those tasks. The alternative is to not use a manager agent and do `Process.sequential` if we want to create a more deterministic process where tasks will be executed sequentially.


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

Swarm orchestration uses a very simple strategy — handoffs. The core idea is to create a transfer function where it uses another agent as a tool.

This is undoubtedly the cleanest approach. The relationships are implicit in the transfer functions.


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
A drawback of this approach is that as the application grows the dependencies between agents are harder to keep track of.


## 3\. Memory

Memory is a critical component of a stateful agentic system. We can distinguish two layers of memory:

* **short\-term** memory allows an agent to maintain multi\-turn / multi\-step executions,
* **long\-term** memory allows an agent to learn and remember preferences across sessions.

This topic can get very complex, but let’s take a look at the simplest memory orchestration available in each framework.

‍


### LangGraph

LangGraph differentiates memory between in\-thread (memory within a single conversation thread) and cross\-thread (memory across conversation).

To save in\-thread memory, LangGraph offers the MemorySaver() class that saves the state of the graph, or the conversation history into a `checkpointer`.


```python
from langgraph.checkpoint.memory import MemorySaver

def build_app():
    """Build and compile the workflow."""
    memory = MemorySaver()
    workflow = build_workflow()
    return workflow.compile(checkpointer=memory)
```
To associate an agent execution with a memory thread, pass a configuration with a `thread_id`. This tells the agent which thread's memory checkpointer to use. For example:


```python
config = {"configurable": {"thread_id": "1"}}
app = build_app()
await run(app, input, config)
```
To save cross\-thread memory, LangGraph allows us to save memory to a JSON Document Storage.


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

Not surprisingly, CrewAI takes a simpler, but more rigid approach. All that’s required on the developer side is to set memory to true.


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
What it does behind the scene is very complex, as it creates a few different memory storage:

* Short\-term memory: it creates a ChromaDB vectorstore with OpenAI Embeddings that stores the agent execution history.
* Most recent memory: SQLite3 db to store the most recent task execution results.
* Long\-term memory: SQLite3 db to store task results, note that the task description has to match exactly (fairly strict) for a long term memory to be retrieved
* Entity memory: extracts key entities and stores the entity relationship into another ChromaDB vectorstore.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*S78repO8Ma-EWFbv.png)


### OpenAI Swarm

Swarm uses a simple stateless design and doesn’t have any built\-in memory features. One reference for how OpenAI thinks about memory can be seen in its stateful Assistant API. Each conversation has a thread\_id for short term memory, whereas each assistant has an assistant\_id that can be associated with long term memory.

It’s also possible to integrate third party memory layer providers such as [mem0](https://github.com/mem0ai/mem0) or implement our own short\-term and long\-term.


## 4\. Human\-in\-the\-loop

Although we want the agent to be autonomous, many agents are designed to interact with humans.

For example, a customer support agent can be asking the user for information throughout the execution chain. Humans can also act as auditors or guides to enable more seamless human\-agent collaboration.‍


### LangGraph

LangGraph allows us to set breakpoint in the graph, like below if we want to add a human checkpoint before the summarizer builds the final output.


```python
workflow.compile(checkpointer=checkpointer, interrupt_before=["Output_Summarizing_Agent"])
```
The Graph will then execute until the break point is reached. We can then implement a step to get the user input before proceeding with the graph.


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

CrewAI allows humans to provide feedback to an agent by just setting `human_input=True` flag in the agent initialization.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*tBtjr57agqneYgvj.png)

The agent will then pause after executing and ask the user to input natural language feedback on its actions and results (see below).

However, it doesn’t support more custom human\-in\-the\-loop interactions.‍


### OpenAI Swarm

Swarm doesn’t have any built\-in human\-in\-the\-loop functions. However, the simplest way to add human input in the middle of the execution is to add human as a Tool or as an agent that the AI agents can transfer to.‍


## Summary of feature differences

To summarize our findings building the same application across the three frameworks.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*TVka-rR7OnaG1fc4uQg6nQ.png)

‍


## Our Recommendation

We summarized our recommendation in the flowchart to help you navigate your decision on which framework to start with.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*zZsMcyy75YKgISFLtGkWKQ.jpeg)

‍‍


## What’s Next?

This blog focused on building the first version of agents. These agents are by no means performant or reliable.

The next blog will focus on improving and iterating on these agents (typically the bulk of work of AI system production).

* Define success criteria and metrics
* Benchmark performance of agents built using different framework
* Deep\-dive into quality and reliability
* Make targeted improvements on prompts, tools, reasoning, architecture

We will use some of the latest agent evaluation, simulation, and observability tools that Relari is developing to dig deeper into how to turn these agents into production\-ready systems.

Subscribe and stay tuned!

*Originally published at [https://www.relari.ai](https://www.relari.ai/blog/ai-agent-framework-comparison-langgraph-crewai-openai-swarm).*


