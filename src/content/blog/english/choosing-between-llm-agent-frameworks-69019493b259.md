---
title: "Choosing Between LLM Agent Frameworks"
meta_title: "Choosing Between LLM Agent Frameworks"
description: "The tradeoffs between building bespoke code-based agents and the major agent frameworks."
date: 2024-10-29T12:57:34Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*jRMs19HqSCazE5dY"
categories: ["Programming", "Technology", "Machine Learning"]
author: "Rifx.Online"
tags: ["agents", "frameworks", "LangGraph", "LlamaIndex", "Workflows"]
draft: False

---

### The tradeoffs between building bespoke code\-based agents and the major agent frameworks.




Agents are having a moment. With multiple new frameworks and fresh [investment](https://foundationcapital.com/goodbye-aiops-welcome-agentsres-the-next-100b-opportunity/) in the space, modern AI agents are overcoming [shaky origins](https://arxiv.org/html/2405.13966v1) to rapidly supplant RAG as an implementation priority. So will 2024 finally be the year that autonomous AI systems that can take over writing our emails, booking flights, talking to our data, or seemingly any other task?

Maybe, but much work remains to get to that point. Any developer building an agent must not only choose foundations — which model, use case, and architecture to use — but also which framework to leverage. Do you go with the long\-standing LangGraph, or the newer entrant LlamaIndex Workflows? Or do you go the traditional route and code the whole thing yourself?

This post aims to make that choice a bit easier. Over the past few weeks, I built the same agent in major frameworks to examine some of the strengths and weaknesses of each at a technical level. All of the code for each agent is available in [this repo](https://github.com/Arize-ai/phoenix/tree/main/examples/agent_framework_comparison).

### Background on the Agent Used for Testing

The agent used for testing includes function calling, multiple tools or skills, connections to outside resources, and shared state or memory.

The agent has the following capabilities:

1. Answering questions from a knowledge base
2. Talking to data: answering questions about telemetry data of an LLM application
3. Analyzing data: analyzing higher\-level trends and patterns in retrieved telemetry data

In order to accomplish these, the agent has three starting skills: RAG with product documentation, SQL generation on a trace database, and data analysis. A simple gradio\-powered interface is used for the agent UI, with the agent itself structured as a chatbot.

## Code\-Based Agent (No Framework)

The first option you have when developing an agent is to skip the frameworks entirely and build the agent fully yourself. When embarking on this project, this was the approach I started with.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*pw9-0lB5JMlVcPqo)

### Pure Code Architecture

The code\-based agent below is made up of an OpenAI\-powered router that uses function calling to select the right skill to use. After that skill completes, it returns back to the router to either call another skill or respond to the user.

The agent keeps an ongoing list of messages and responses that is passed fully into the router on each call to preserve context through cycles.

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

The skills themselves are defined in their own classes (e.g. GenerateSQLQuery) that are collectively held in a SkillMap. The router itself only interacts with the SkillMap, which it uses to load skill names, descriptions, and callable functions. This approach means that adding a new skill to the agent is as simple as writing that skill as its own class, then adding it to the list of skills in the SkillMap. The idea here is to make it easy to add new skills without disturbing the router code.

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

Overall, this approach is fairly straightforward to implement but comes with a few challenges.

### Challenges with Pure Code Agents

The first difficulty lies in structuring the router system prompt. Often, the router in the example above insisted on generating SQL itself instead of delegating that to the right skill. If you’ve ever tried to get an LLM *not* to do something, you know how frustrating that experience can be; finding a working prompt took many rounds of debugging. Accounting for the different output formats from each step was also tricky. Since I opted not to use structured outputs, I had to be ready for multiple different formats from each of the LLM calls in my router and skills.

### Benefits of a Pure Code Agent

A code\-based approach provides a good baseline and starting point, offering a great way to learn how agents work without relying on canned agent tutorials from prevailing frameworks. Although convincing the LLM to behave can be challenging, the code structure itself is simple enough to use and might make sense for certain use cases (more in the analysis section below).

## LangGraph

LangGraph is one of the longest\-standing agent frameworks, first releasing in January 2024\. The framework is built to address the acyclic nature of existing pipelines and chains by adopting a Pregel graph structure instead. LangGraph makes it easier to define loops in your agent by adding the concepts of nodes, edges, and conditional edges to traverse a graph. LangGraph is built on top of LangChain, and uses the objects and types from that framework.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*fYgHiGwLhSUSrFv9)

### LangGraph Architecture

The LangGraph agent looks similar to the code\-based agent on paper, but the code behind it is drastically different. LangGraph still uses a “router” technically, in that it calls OpenAI with functions and uses the response to continue to a new step. However the way the program moves between skills is controlled completely differently.

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

The graph defined here has a node for the initial OpenAI call, called “agent” above, and one for the tool handling step, called “tools.” LangGraph has a built\-in object called ToolNode that takes a list of callable tools and triggers them based on a ChatMessage response, before returning to the “agent” node again.

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

After each call of the “agent” node (put another way: the router in the code\-based agent), the should\_continue edge decides whether to return the response to the user or pass on to the ToolNode to handle tool calls.

Throughout each node, the “state” stores the list of messages and responses from OpenAI, similar to the code\-based agent’s approach.

### Challenges with LangGraph

Most of the difficulties with LangGraph in the example stem from the need to use Langchain objects for things to flow nicely.

**Challenge \#1: Function Call Validation**

In order to use the ToolNode object, I had to refactor most of my existing Skill code. The ToolNode takes a list of callable functions, which originally made me think I could use my existing functions, however things broke down due to my function parameters.

The skills were defined as classes with a callable member function, meaning they had “self” as their first parameter. GPT\-4o was smart enough to not include the “self” parameter in the generated function call, however LangGraph read this as a validation error due to a missing parameter.

This took hours to figure out, because the error message instead marked the third parameter in the function (“args” on the data analysis skill) as the missing parameter:

```python
pydantic.v1.error_wrappers.ValidationError: 1 validation error for data_analysis_toolSchema
args field required (type=value_error.missing)
```

It is worth mentioning that the error message originated from Pydantic, not from LangGraph.

I eventually bit the bullet and redefined my skills as basic methods with Langchain’s @tool decorator, and was able to get things working.

```python
@tool
def generate_and_run_sql_query(query: str):
    """Generates and runs an SQL query based on the prompt.

    Args:
        query (str): A string containing the original user prompt.

    Returns:
        str: The result of the SQL query.
    """
```

**Challenge \#2: Debugging**

As mentioned, debugging in a framework is difficult. This primarily comes down to confusing error messages and abstracted concepts that make it harder to view variables.

The abstracted concepts primarily show up when trying to debug the messages being sent around the agent. LangGraph stores these messages in state\[“messages”]. Some nodes within the graph pull from these messages automatically, which can make it difficult to understand the value of messages when they are accessed by the node.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*KuCg0WGHSklOKe6t)

### LangGraph Benefits

One of the main benefits of LangGraph is that it’s easy to work with. The graph structure code is clean and accessible. Especially if you have complex node logic, having a single view of the graph makes it easier to understand how the agent is connected together. LangGraph also makes it straightforward to convert an existing application built in LangChain.

### Takeaway

If you use everything in the framework, LangGraph works cleanly; if you step outside of it, prepare for some debugging headaches.

## LlamaIndex Workflows

Workflows is a newer entrant into the agent framework space, premiering earlier this summer. Like LangGraph, it aims to make looping agents easier to build. Workflows also has a particular focus on running asynchronously.

Some elements of Workflows seem to be in direct response to LangGraph, specifically its use of events instead of edges and conditional edges. Workflows use steps (analogous to nodes in LangGraph) to house logic, and emitted and received events to move between steps.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*22WuFVBWctdeiCSL)

The structure above looks similar to the LangGraph structure, save for one addition. I added a setup step to the Workflow to prepare the agent context, more on this below. Despite the similar structure, there is very different code powering it.

### Workflows Architecture

The code below defines the Workflow structure. Similar to LangGraph, this is where I prepared the state and attached the skills to the LLM object.

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

This is also where I define an extra step, “prepare\_agent”. This step creates a ChatMessage from the user input and adds it to the workflow memory. Splitting this out as a separate step means that we do return to it as the agent loops through steps, which avoids repeatedly adding the user message to the memory.

In the LangGraph case, I accomplished the same thing with a run\_agent method that lived outside the graph. This change is mostly stylistic, however it’s cleaner in my opinion to house this logic with the Workflow and graph as we’ve done here.

With the Workflow set up, I then defined the routing code:

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

And the tool call handling code:

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

Both of these look more similar to the code\-based agent than the LangGraph agent. This is mainly because Workflows keeps the conditional routing logic in the steps as opposed to in conditional edges — lines 18–24 were a conditional edge in LangGraph, whereas now they are just part of the routing step — and the fact that LangGraph has a ToolNode object that does just about everything in the tool\_call\_handler method automatically.

Moving past the routing step, one thing I was very happy to see is that I could use my SkillMap and existing skills from my code\-based agent with Workflows. These required no changes to work with Workflows, which made my life much easier.

### Challenges with Workflows

**Challenge \#1: Sync vs Async**

While asynchronous execution is preferable for a live agent, debugging a synchronous agent is much easier. Workflows is designed to work asynchronously, and trying to force synchronous execution was very difficult.

I initially thought I would just be able to remove the “async” method designations and switch from “achat\_with\_tools” to “chat\_with\_tools”. However, since the underlying methods within the Workflow class were also marked as asynchronous, it was necessary to redefine those in order to run synchronously. I ended up sticking to an asynchronous approach, but this didn’t make debugging more difficult.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*78Hzqkiv9cI7W4UA)

**Challenge \#2: Pydantic Validation Errors**

In a repeat of the woes with LangGraph, similar problems emerged around confusing Pydantic validation errors on skills. Fortunately, these were easier to address this time since Workflows was able to handle member functions just fine. I ultimately just ended up having to be more prescriptive in creating LlamaIndex FunctionTool objects for my skills:

```python
for func in skill_map.get_function_list(): 
            self.tools.append(FunctionTool(
                skill_map.get_function_callable_by_name(func), 
                metadata=ToolMetadata(name=func, description=skill_map.get_function_description_by_name(func))))
```

*Excerpt from AgentFlow.\_\_init\_\_ that builds FunctionTools*

### Benefits of Workflows

I had a much easier time building the Workflows agent than I did the LangGraph agent, mainly because Workflows still required me to write routing logic and tool handling code myself instead of providing built\-in functions. This also meant that my Workflow agent looked extremely similar to my code\-based agent.

The biggest difference came in the use of events. I used two custom events to move between steps in my agent:

```python
class ToolCallEvent(Event):
    tool_calls: list[ToolSelection]

class RouterInputEvent(Event):
    input: list[ChatMessage]
```

The emitter\-receiver, event\-based architecture took the place of directly calling some of the methods in my agent, like the tool call handler.

If you have more complex systems with multiple steps that are triggering asynchronously and might emit multiple events, this architecture becomes very helpful to manage that cleanly.

Other benefits of Workflows include the fact that it is very lightweight and doesn’t force much structure on you (aside from the use of certain LlamaIndex objects) and that its event\-based architecture provides a helpful alternative to direct function calling — especially for complex, asynchronous applications.

## Comparing Frameworks

Looking across the three approaches, each one has its benefits.

The no framework approach is the simplest to implement. Because any abstractions are defined by the developer (i.e. SkillMap object in the above example), keeping various types and objects straight is easy. The readability and accessibility of the code entirely comes down to the individual developer however, and it’s easy to see how increasingly complex agents could get messy without some enforced structure.

LangGraph provides quite a bit of structure, which makes the agent very clearly defined. If a broader team is collaborating on an agent, this structure would provide a helpful way of enforcing an architecture. LangGraph also might provide a good starting point with agents for those not as familiar with the structure. There is a tradeoff, however — since LangGraph does quite a bit for you, it can lead to headaches if you don’t fully buy into the framework; the code may be very clean, but you may pay for it with more debugging.

Workflows falls somewhere in the middle. The event\-based architecture might be extremely helpful for some projects, and the fact that less is required in terms of using of LlamaIndex types provides greater flexibility for those not be fully using the framework across their application.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*PITmiVGuG8QuDVX6)

Ultimately, the core question may just come down to “are you already using LlamaIndex or LangChain to orchestrate your application?” LangGraph and Workflows are both so entwined with their respective underlying frameworks that the additional benefits of each agent\-specific framework might not cause you to switch on merit alone.

The pure code approach will likely always be an attractive option. If you have the rigor to document and enforce any abstractions created, then ensuring nothing in an external framework slows you down is easy.

## Key Questions To Help In Choosing An Agent Framework

Of course, “it depends” is never a satisfying answer. These three questions should help you decide which framework to use in your next agent project.

***Are you already using LlamaIndex or LangChain for significant pieces of your project?***

If yes, explore that option first.

***Are you familiar with common agent structures, or do you want something telling you how you should structure your agent?***

If you fall into the latter group, try Workflows. If you *really* fall into the latter group, try LangGraph.

***Has your agent been built before?***

One of the framework benefits is that there are many tutorials and examples built with each. There are far fewer examples of pure code agents to build from.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*wF9aSF1db1yaniqO)

## Conclusion

Picking an agent framework is just one choice among many that will impact outcomes in production for generative AI systems. As always, it pays to have robust guardrails and [LLM tracing](https://docs.arize.com/phoenix/tracing/llm-traces) in place — and to be agile as new agent frameworks, research, and models upend established techniques.


