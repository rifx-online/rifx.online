---
title: "Towards Intelligent Autonomous Research Agents Using Pydantic AI"
meta_title: "Towards Intelligent Autonomous Research Agents Using Pydantic AI"
description: "The article discusses the development of intelligent autonomous research agents using Pydantic AI, emphasizing the increasing need for AI-driven tools that assist in managing vast information efficiently. It highlights the capabilities of AI agents to reduce cognitive load, provide specialized insights, and foster innovation by automating research tasks. The integration of tool calling enhances these agents functionalities, allowing them to access external data and perform complex analyses. The author shares their experimental journey in building a research agent that can autonomously break down tasks, execute them sequentially, and refine results, ultimately aiming to revolutionize research methodologies."
date: 2025-01-09T01:56:22Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*NyZEflBLmzJHH9YTXeloPg.png"
categories: ["Autonomous Systems", "Data Science", "Machine Learning"]
author: "Rifx.Online"
tags: ["Pydantic", "autonomous", "research", "agents", "toolcalling"]
draft: False

---






In an era where the pace of technological advancement demands constant learning and adaptability, having an intelligent assistant to shoulder the burden of research is not just a luxury — it’s becoming a necessity. Solo entrepreneurs, researchers, and even casual learners often find themselves overwhelmed by the sheer volume of information available. This is where research agents powered by Artificial Intelligence come into play, promising not only efficiency but also deeper insights into complex topics.


## The Importance of Agent Systems

AI agents are not new; their use spans across customer service chatbots, recommendation engines, and personal assistants like Siri or Alexa. However, their ability to autonomously navigate and analyze vast amounts of information — tools designed for in\-depth research — is a game changer. These agents can:

* **Reduce cognitive load**: By summarizing large datasets or articles, they enable users to focus on decision\-making rather than information processing.
* **Provide specialized insights**: With tailored configurations, agents can delve into niche areas, offering domain\-specific knowledge.
* **Foster innovation**: By automating repetitive research tasks, users can spend more time ideating and strategizing.

For solo entrepreneurs, this means discovering market trends or competitors faster. For academics, it translates to synthesizing literature reviews with less effort. The potential audience for these systems is vast.


## Tool Calling: Expanding Agent Capabilities

The real magic happens when AI agents are endowed with tools. Tool calling, a concept gaining traction, allows agents to access external APIs, scrape data from websites, or even interact with other software to perform their tasks. Think of it as empowering the agent to become an apprentice — not just fetching information but also manipulating and analyzing it.

For example, a tool\-enabled agent could:

1. Extract and summarize the main points of a webpage.
2. Use APIs to gather live data, such as stock market trends or weather updates.
3. Cross\-reference multiple sources to verify the credibility of information.

By equipping agents with such tools, we enable them to go beyond surface\-level information, diving deeper into topics and providing richer, more actionable insights.


## Autonomous Research: The Dream of Intelligent Agents

Imagine having an agent that can autonomously research a topic, gather data, and return with an organized report. Such agents can:

* **Perform iterative searches**: Start with a broad query and progressively refine it based on intermediate findings.
* **Critically evaluate sources**: Identify reputable sources and ignore unreliable or redundant data.
* **Create structured outputs**: Present findings in formats like summaries, charts, or detailed narratives.

This capability would revolutionize how we approach learning and decision\-making. Instead of spending hours on Google or sifting through multiple websites, users could rely on their research agents to do the heavy lifting.


## Enter Pydantic AI: Structuring Intelligence

Pydantic, a Python library known for its data validation and settings management, provides a robust foundation for creating structured AI systems. By integrating Pydantic into AI agent frameworks, we can:

* Ensure data consistency: Validate input and output data, ensuring the agent’s results are reliable and free of errors.
* Enhance modularity: Structure agents with reusable components, making it easier to scale or adapt their capabilities.
* Streamline development: Reduce boilerplate code, focusing more on logic and less on plumbing.

Using Pydantic for tool\-calling agents simplifies the process of passing structured data between the agent and its tools, ensuring seamless interaction and reliable performance.


## Initial Steps in Building the Agent

I have started experimenting with Pydantic AI Agents with Autonomous Research Agents in mind. So this article will evolve as my experimentations move ahead. Every expert is welcomed to disagree with my approach and to provide me guidance when I could have taken a better approach.

For complete and accurate documentation please refer the pydantic AI reference [here](https://ai.pydantic.dev/). A simplified Pydantic Agent is given below,


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
**Key Concepts in the Example:**

`Agent` **Class:**

* `from pydantic_ai import Agent`: This imports the core `Agent` class.
* `roulette_agent = Agent(...)`: This creates an instance of your agent named `roulette_agent`.
* `'openai:gpt-4o'`: This specifies the underlying LLM to use. In this case, it's GPT\-4 from OpenAI. Pydantic AI supports various LLMs (e.g., Gemini, Ollama).
* `deps_type=int`: This defines the type of *dependencies* or input that the agent expects. Here, it expects an integer (e.g., a customer's chosen number). This input will be accessible within your tool functions using `ctx.deps`.
* `result_type=bool`: This defines the expected *output* type of the agent's overall execution. In this case, it's a boolean (True for win, False for lose). However, in your example, the `roulette_wheel` function returns a string, so this is a mismatch. It should be `result_type=str`
* `system_prompt`: This is the core instruction given to the LLM. It tells the LLM how to behave and what its role is. In this example, it instructs the LLM to use the `roulette_wheel` function to determine the outcome.

`@roulette_agent.tool` **Decorator:**

* `@roulette_agent.tool`: This decorator is crucial. It registers the function `roulette_wheel` as a *tool* that the LLM can use. Tools are the actions or functions that the agent can execute.
* `async def roulette_wheel(...)`: This defines the tool function. It's marked as `async` because LLM interactions are often asynchronous (they take time to complete).
* `ctx: RunContext[int]`: This provides the *context* for the tool's execution. `RunContext` contains information about the current run, including the input dependencies (`ctx.deps`). The `[int]` specifies that the `deps` attribute will be an integer, matching the `deps_type` defined in the `Agent` constructor.
* `square: int`: This is an argument passed to the tool function by the LLM. It represents the number the LLM wants to check on the roulette wheel.
* `-> str`: This specifies the return type of the tool function (a string in this case).

**How it Works (Simplified):**

1. You provide input to the agent (e.g., a customer’s chosen number).
2. Pydantic AI passes this input to the LLM along with the `system_prompt`.
3. The LLM, based on the prompt, decides to use the `roulette_wheel` tool.
4. Pydantic AI calls the `roulette_wheel` function, passing the input (from `ctx.deps`) and any arguments the LLM provided (`square`).
5. The `roulette_wheel` function executes its logic (checking if `square` matches `ctx.deps`) and returns a result.
6. Pydantic AI handles the result and returns it as the agent’s overall output.

Enough of basic concepts now. My first challenge was to create an Orchestrator Agent that could delegate a task to a particular expert agent.


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
It took some time for me to figure out that sub\-agents should be orchestrated using the tools for the orchestrator agent as defined above.


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
The Orchestrator agent picks a tool according to the user prompt where the sub\-agent is run with the original prompt. We can ask the orchestrator agent to pass the prompt further down to the sub\-agents. The above example is just to show how to orchestrate sub\-agents (they are not part of my actual research on the Researcher Agents.

**Autonomous Research Agents**I experimented with creating an Autonomous Research Agent inspired by AutoGPT. The agent breaks down research tasks, executes them sequentially, and iteratively refines the results.


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
As of now, the agent is general enough to create the tasks that it can come one by one on each task.


```python
async def main():

    query = "If I ask you to research on topic like services provided by the company from their complete website https://www.dataicraft.com, can you create tasks and accomplish them ?"
    result = await research_agent.run(query)
    print(result)

asyncio.run(main())
```
It is still in research and I may have to pivot during my experimentations (probably, I need to take a course on Prompt Engineering because that gap is becoming apparent now). The call to the research agent is a bit more guided as I had to specify explicitly to only do work up to creating and iteratively picking and solving a pending task. (This also raises a need of a systemetic approach to incrementally write GenAI applications step by step by increasing complexity)


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
One important point that I am thinking is the granularity of the tools (how much work they should do and how much we should rely on the cognitive features of the LLM model). At the moment, I am taking the approach of very small tools with very brief docstring (although I have not used the advanced type validations yet, just to keep the research simple). The tool defined above “store\_tasks” is used by the agent to create a list of tasks for the given query. The given query/prompt results in the following tasks:


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
Sometimes, the agent gave different names to the keys, for example, “task” was sometimes called as “description”, so I had to explicity write it in the system prompt to fix it as the following tool will require that. I also tried to set the temperature to 0 so that the agent may give the deterministic response, but so far I am still looking for it.


```python
@research_agent.tool
def get_next_pending_task(ctx: RunContext[str]) -> str:
    """
    Gets the next pending task from the list of tasks.
    """
    logfire.info(f"Fetching the next pending task...")

    with open(f"{work_folder}/tasks.json", "r") as f:
        tasks = json.load(f)

    for task in tasks:
        if task["status"] == "pending":
            logfire.info(f"Next pending task found: {task['task']}")
            return task["task"]

    logfire.info("No pending tasks found.")
    return "No pending tasks found."
```
The above tool takes the next pending task and returns to the Agent.


```python
@research_agent.tool
def perform_task(ctx: RunContext[str], task: str) -> str:
    """
    Performs the given task and marks it as completed.
    """
    logfire.info(f"Performing task: {task}")

    with open(f"{work_folder}/tasks.json", "r") as f:
        tasks = json.load(f)

    for t in tasks:
        if t["task"] == task:
            t["status"] = "completed"
            break

    with open(f"{work_folder}/tasks.json", "w") as f:
        json.dump(tasks, f, indent=4)

    logfire.info(f"Task completed: {task}")
    return f"Task completed: {task}"
```
To help the Agent keep note of what tasks have been accomplished the above tool writes the status of a task to completed (so that the next task is retrieved next time the get\_next\_pending\_task tool is called. I could not let the agent follow this process until I gave it basic tool to fetch a web page from the internet. Once, it knew that the following tool is available, then it followed the system prompt.


```python
@research_agent.tool
def load_page(ctx: RunContext[str], url: str) -> str:
    """
    Fetches the web page given by the `url` and returns the contents.

    """

    logfire.info(f"Loading page: {url}")
    content = ""
    with sync_playwright() as p:
        # Launch the browser in headless mode
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the URL
        page.goto(url)

        # Wait for the page to fully load
        page.wait_for_load_state("networkidle")

        # Get the rendered HTML
        content = page.content()
        browser.close()

    return content
```
The load\_page tool simply gets the url and returns the contents of the page. I am using the playwright library to completely fetch the web page (even if the page loads some contents using javascript). In later version, I will also use search APIs, like Serp API, to do research on multiple pages). Using the tools, that are available so far, the Agent cannot do the whole research that was required by the original prompt. The following stream of responses from the Agent (on one execution) makes it clear that we still need more tools to accomplish the overall task.


```python
RunResult(
    _all_messages=[
        SystemPrompt(content='\n        
   You are a research agent. \n
   Your primary role is to plan and execute research tasks efficiently. Follow these steps: \n\n        
    1. Break down the main research objective into smaller, manageable sub-tasks, task: {"task": "description of task", "status": "pending"}.\n        
    2. Use the `store_tasks` tool to store the sub-tasks. Ensure each task is clearly defined and actionable.\n        
    3. Use the `get_next_pending_task` tool to retrieve the next pending sub-task in the sequence.\n        
    4. Use the `perform_task` tool to execute the retrieved sub-task and mark it as completed.\n\n        
   
   Continue this process until all sub-tasks are completed and the research is successfully accomplished. \n        
   Always aim to complete tasks systematically and provide concise, clear results for each step.\n        
   Do not run tasks in parallel as they may depend on each other.\n        ', role='system'),
        UserPrompt(content='If I ask you to research on topic like services provided by the company from their complete website https: // www.dataicraft.com, can you create tasks and accomplish them ?', timestamp=datetime.datetime(2024, 12, 21, 11, 50, 45, 433035, tzinfo=datetime.timezone.utc), role='user'),
        ModelStructuredResponse(calls=[ToolCall(tool_name='store_tasks', args=ArgsDict(args_dict=
   {
    'tasks': '
    [
     {"task": "Fetch the DataCraft website homepage", "status": "pending"}, 
     {"task": "Identify the main sections related to services", "status": "pending"}, 
     {"task": "Extract the description of each service", "status": "pending"}, 
     {"task": "Summarize the findings", "status": "pending"}
    ]
   '}), tool_id=None)], timestamp=datetime.datetime(2024, 12, 21, 11, 50, 47, 305173, tzinfo=datetime.timezone.utc), role='model-structured-response'), 
        ToolReturn(tool_name='store_tasks', content='Tasks created and stored.', tool_id=None, timestamp=datetime.datetime(2024, 12, 21, 11, 50, 47, 341426, tzinfo=datetime.timezone.utc), role='tool-return '),
        ModelStructuredResponse(calls=[ToolCall(tool_name='get_next_pending_task', args=ArgsDict(args_dict={}), tool_id=None)], timestamp=datetime.datetime(2024, 12, 21, 11, 50, 47, 938261, tzinfo=datetime.timezone.utc), role='model-structured-response'), 
        ToolReturn(tool_name='get_next_pending_task', content='Fetch the DataCraft website homepage', tool_id=None, timestamp=datetime.datetime(2024, 12, 21, 11, 50, 47, 976900, tzinfo=datetime.timezone.utc), role='tool-return '),
        ModelStructuredResponse(calls=[ToolCall(tool_name='perform_task', args=ArgsDict(args_dict={'task': 'Fetch the DataCraft website homepage'}), tool_id=None)], timestamp=datetime.datetime(2024, 12, 21, 11, 50, 48, 614588, tzinfo=datetime.timezone.utc), role='model-structured-response'),
        ToolReturn(tool_name='perform_task', content='Task completed: Fetch the DataCraft website homepage', tool_id=None,timestamp=datetime.datetime(2024, 12, 21, 11, 50, 48, 651188, tzinfo=datetime.timezone.utc), role='tool-return '),
        ModelStructuredResponse(calls=[ToolCall(tool_name='get_next_pending_task', args=ArgsDict(args_dict={}), tool_id=None)], timestamp=datetime.datetime(2024, 12, 21, 11, 50, 49, 255609, tzinfo=datetime.timezone.utc), role='model-structured-response'),
        ToolReturn(tool_name='get_next_pending_task', content='Identify the main sections related to services', tool_id=None,timestamp=datetime.datetime(2024, 12, 21, 11, 50, 49, 271959, tzinfo=datetime.timezone.utc), role='tool-return '),
        ModelTextResponse(content='I need access to the internet and the ability to parse HTML to accomplish this task.  The available tools do not provide this functionality.  Therefore, I cannot complete this sub-task.  To proceed, I would need additional tools or libraries that allow for web scraping and HTML parsing.\n', timestamp=datetime.datetime(2024, 11, 50, 50, 91294, tzinfo=datetime.timezone.utc), role='model-text-response')], _new_message_index=1, data='I need access to the internet and the ability to parse HTML to accomplish this task.  The available tools do not provide this functionality.  Therefore, I cannot complete this sub-task.  To proceed, I would need additional tools or libraries that allow for web scraping and HTML parsing.\n', _cost=Cost(request_tokens=2752, response_tokens=156, total_tokens=2908, details=None))
    ]
))
```
The RunResult contains the list of messages, starting from the system prompt and UserPrompt. The next message “ModelStructuredResponse” shows a structured response from the LLM model with the tool call (along with the arguments to the tool, suggested by the LLM model). The tool is executed and ToolReturn is returned. It follows the flow of tasks upto a point when it could resolve the tasks (although perform\_task is just simulating the task completion and responding with a message so that Agent knows it can proceed). When the next pending task is fetched the LLM model gives the final response as the task at hand has no tool available. I will continue from here to do more research. The final destination is far away as I still have to make the things work upto resolving the overall goal. If some reader wants to join me on this endeavor, we can work together on this agent and make it a SaaS product. But it is still in its infancy.


