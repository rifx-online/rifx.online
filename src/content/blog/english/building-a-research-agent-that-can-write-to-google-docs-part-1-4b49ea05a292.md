---
title: "Building a Research Agent That Can Write to Google Docs (Part 1)"
meta_title: "Building a Research Agent That Can Write to Google Docs (Part 1)"
description: "This article introduces the development of a research agent using LangGraph and Tavily, aimed at creating and refining short articles. The agent employs a structured process involving planning, researching, writing, reviewing, and editing, leveraging Large Language Models (LLMs) to enhance output quality through iterative revisions. The article outlines the agents architecture, which includes components like a planner, researcher, writer, reviewer, and editor, and discusses the integration of Tavily for web searches. The goal is to streamline research tasks while ensuring the generation of polished reports, with a follow-up on connecting outputs to Google Docs in the second part."
date: 2024-12-19T21:35:48Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*K3ft-8NkUixw6K7isGBWVw.png"
categories: ["Programming", "Natural Language Processing", "Generative AI"]
author: "Rifx.Online"
tags: ["LangGraph", "Tavily", "LLMs", "planner", "researcher"]
draft: False

---







### A tool that might help with your homework

***This article is the first of a two part series where we use LangGraph and Tavily to build a simple research agent, which writes and refines short articles. To keep track of the plans, articles and comments it generates we add the ability to programmatically create and edit Google Docs. In this article we focus on the agent, leaving the docs connection to the second article. You can find all the relevant code [here](https://github.com/rmartinshort/research_assist).***

Large Language Models (LLMs) are quickly finding use in all sorts of applications relevant to analysts and researchers, especially when it comes to the extraction, organization and summarization of text information. The community — both commercial and open source — is also making it increasingly easy to build and scale so\-called “agentic” applications, in which the LLM assumes the role of a (hopefully) skilled analyst and makes semi\-autonomous decisions. In a chatbot application, for example, if the user asks a complex or multi\-step query the LLM might need to design a plan of action, correctly query multiple external tools — perhaps calculators, web searchers, vector databases etc — assemble the results and generate an answer.

Systems like this are often said to use the [ReAct framework](https://www.promptingguide.ai/techniques/react) of prompt engineering, which stands for “Reasoning\-Action”. Basically, the structure and sequence of prompts forces the LLM to answer the question in very methodical fashion, first by articulating a thought (typically a plan of attack), carrying out an action, then making an observation of the result. In agentic systems, this process can continue iteratively until the LLM decides that it’s come to an acceptable answer.

In this series of articles, we’ll use the [LangGraph](https://www.langchain.com/langgraph) library and [Tavily](https://tavily.com/) search tool to build a simple research assistant that demonstrates some of these concepts and might even be useful for those of us looking to generate quick, well written reports about any subject. Our agent will be inspired by the plan \-\> research \-\> write \-\> submit \-\> review \-\> revise cycle that happens in peer\-reviewed research, and you can take a look at the prompts for these different sections [here](https://github.com/rmartinshort/research_assist/blob/main/research_assist/researcher/prompts.py).

To make the system feel more complete, we’ll also add the ability to automatically add the material generated to a Google Doc, which is explored in [part 2](https://towardsdatascience.com/building-a-research-assistant-that-can-write-to-google-docs-part-2-ac9dcacff4ff). This should be considered as more of an add\-on than an integrated component of the agent, but it is interesting in its own right and so could also be read as a stand\-alone article.


## 1\. What should our research assistant do?

Before looking at how we can build this assistant and what it means for it to be “agentic”, we should think briefly about what we’d like it to do. The goal is to build a system that can plan and write short, informative articles about a given topic, then improve its own work through review and revision.

Why? Mainly this is just an exploration of technology, but the use of LLMs as semi\-autonomous researchers is an active field of investigation and is yielding interesting projects such as [GPT\-researcher](https://github.com/assafelovic/gpt-researcher). They have the potential to speed up the work of analysts, students, authors and researchers — though of course if the goal is human learning, there is no substitute for careful reading, note taking and discussion, which AI cannot replace.

LLMs like GPT4, Anthropic Claude Sonnet, Meta Llama 3, Google Gemini Pro etc. can already write great articles out of the box with just a single prompt. However, these LLMs have knowledge cutoffs and so need access to additional tools in order to fetch the latest information, such as news about current events. There are plenty of services — notably tools like Perplexity, ChatGPT (now accessible via chat.com) and Google’s AI overview that already have this ability, but they are geared more towards providing quick summaries than polished research reports.

Here, we’re making the assumption that multiple iterations of review and revision will improve the quality of an article generated by an LLM. This is certainly how it works in human writing. Our assistant will have the following components, each with its own instruction prompt

* **Planner.** Turns a poorly defined task into a structured article plan
* **Researcher.** Takes the plan and searches the internet for relevant content.
* **Writer.** Uses the plan, retrieved content and it own knowledge to write the report
* **Reviewer.** Reads the report and offers constructive criticism
* **Editor.** Reads the report and the reviewer’s criticism and decides if the report needs to be revised. If so, the report is sent back to the researcher and writer stages.

In our implementation each of these components will be calling the same LLM, namely GPT4o\-mini, but in a real application they could just as easily use different, more specialized models.

The output will be a well\-written, informative report — preferably with references — that we can programmatically drop into a Google doc for safe keeping. It’s easy to modify the “personality” or our researcher by adapting the prompts. The editor is particularly important, because it’s the gatekeeper for the end of the process. If we make our editor very strict, the system might need to loop through many revisions to get accepted. To what extent will a stricter editor improve the quality of the result? That’s a very interesting question which, as they say, is beyond the scope of the current work!


## 2\. Structure of the agent

Our research assistant is based heavily on the example described in this [excellent short course about LangGraph](https://www.deeplearning.ai/short-courses/ai-agents-in-langgraph/). LangGraph is an LLM orchestration library that attempts to make it easier for us to design and build reliable agents. For an in\-depth comparison of LangGraph and LangChain, I recommend this excellent [article](https://towardsdatascience.com/ai-agent-workflows-a-complete-guide-on-whether-to-build-with-langgraph-or-langchain-117025509fa0).

What exactly is an agent? It appears that the community has not yet settled on a definition, but at least broadly speaking we might say that an agent is a [multi\-step system where an LLM is allowed to make meaningful decisions about the outcome](https://blog.langchain.dev/what-is-an-agent/). This makes it more complex (and potentially more unpredictable) than a chain, which is just a predefined set of LLM calls one after the other.

In an agent framework, the LLM has some autonomy over how to solve the problem it’s given, perhaps by choosing the appropriate tool to call or deciding when to stop refining a solution once it’s good enough. In that sense the LLM becomes more of the brain of the system, acting more like a human analyst than just an API call. One interesting challenge here is that while agents might be free to make decisions, they are usually embedded within or interact with traditional software systems that require structured inputs and outputs. It’s therefore very important to force the agent to return its answers in the way that these other systems understand, regardless of the decision it makes.

For a more in\-depth discussion of agents in the context of LangGraph, this [documentation](https://langchain-ai.github.io/langgraph/concepts/#graphs) is very helpful. Our research agent will be quite a simple one (partly because I am still learning this material too!) but hopefully could be a stepping stone towards something more sophisticated.

In LangGraph we define the logic of our system as a graph, which consists of nodes and edges. Nodes are where LLM calls are made, and edges pass information from one node to the next. Edges can be conditional, meaning that they can direct information to different nodes depending on what decision is made. Information is passed between nodes in a structured format defined by a state.

Our research assistant has a single stage called `AgentState` and it looks like this


```python
class AgentState(TypedDict):
    """
    A dictionary representing the state of the research agent.

    Attributes:
        task (str): The description of the task to be performed.
        plan (str): The research plan generated for the task.
        draft (str): The current draft of the research report.
        critique (str): The critique received for the draft.
        content (List[str]): A list of content gathered during research.
        revision_number (int): The current revision number of the draft.
        max_revisions (int): The maximum number of revisions allowed.
        finalized_state (bool): Indicates whether the report is finalized.
    """

    task: str
    plan: str
    draft: str
    critique: str
    content: List[str]
    editor_comment: str
    revision_number: int
    max_revisions: int
    finalized_state: bool
```
This is where all the information relevant to our problem gets stored, and can be updated by LLM action inside a node of the graph.

Now we can define some nodes. In the code, all the nodes are kept within the `AgentNodes` class, which is just a way I found helpful to group them. For example the planner node looks like this


```python
    def plan_node(self, state: AgentState) -> Dict[str, str]:
        """
        Generate a research plan based on the current state.

        Args:
            state (AgentState): The current state of the research agent.

        Returns:
            Dict[str, str]: A dictionary containing the generated research plan.
        """
        messages = [
            SystemMessage(content=ResearchPlanPrompt.system_template),
            HumanMessage(content=state["task"]),
        ]
        response = self.model.invoke(messages)
        return {"plan": response.content}
```
Note how it takes in an `AgentState` and returns a modification to one of its components, namely the text for the research plan. When this node is run, the plan is updated.

The code inside the node function uses standard LangChain syntax. `self.model` is an instance of `ChatOpenAI`, which looks like this


```python
model = ChatOpenAI(
    model="gpt-4o-mini", temperature=0, api_key=secrets["OPENAI_API_KEY"]
)
```
The prompt consists of a system message from the `ResearchPlanPrompt` dataclass concatenated with the “task” element of the AgentState, which is the research topic provided by the user. The plan prompt looks like this.


```python
@dataclass
class ResearchPlanPrompt:
    system_template: str = """
    You are an expert writer tasked with creating a high-level outline for a research report.
    Write such an outline for the user-provided topic. Include relevant notes or instructions for each section.
    The style of the research report should be geared towards the educated public. It should be detailed enough to provide
    a good level of understanding of the topic, but not unnecessarily dense. Think of it more like a whitepaper to be consumed 
    by a business leader rather than an academic journal article. 
    """
```
Similar nodes need to be made for the following tasks

* **Conduct research**. This is where we use an LLM to convert the research task into a series of queries, then use the Tavily search tool to find their answers online and save this under “content” in the AgentStage. This process is discussed in more detail in section 2
* **Write the report**. Here we make use of the task name, the research plan, the research content and any previous reviewer comments to actually write the research report. This gets saved under “draft” in the AgentState. Whenever this runs, the `revision_number` indicator gets updated.
* **Review the report.** Call the LLM to critique the research report and save the review under “critique”
* **Conduct more research in response to the critique**. This is going to take in the original draft and the review and generate some more queries for Tavily that should help the system address the reviewer comments. Once again, this information is saved under “content”
* **Make a decision** about whether or not the report satisfies the reviewer’s comments. This is done by the LLM with the guidance of the editor prompt, which instructs it to make a yes/no decision on the article and explain its reasoning.
* **Dummy nodes** for rejecting or accepting the research. Once we get to either of these, we can end the flow. The final research report can then be extracted from the AgentState

We need to make a conditional edge in the graph at the editor node: If the editor says yes, we go to the accepted node. If no, we go back to the review node.

To define this logic, we need to make a function to run inside the conditional edge. I have chosen to put this in an AgentEdges class, but this is not a requirement.


```python
 def should_continue(state: AgentState) -> str:
        """
        Determine whether the research process should continue based on the current state.

        Args:
            state (AgentState): The current state of the research agent.

        Returns:
            str: The next state to transition to ("to_review", "accepted", or "rejected").
        """
        # always send to review if editor hasn't made comments yet
        current_editor_comments = state.get("editor_comment", [])
        if not current_editor_comments:
            return "to_review"

        final_state = state.get("finalized_state", False)
        if final_state:
            return "accepted"
        elif state["revision_number"] > state["max_revisions"]:
            logger.info("Revision number > max allowed revisions")
            return "rejected"
        else:
            return "to_review"
```
In code, the entire graph setup looks like this


```python
from research_assist.researcher.AgentComponents import (
    AgentNodes,
    AgentState,
    AgentEdges,
)
## this is the predefined end node
from langgraph.graph import END

agent = StateGraph(AgentState)
nodes = AgentNodes(model, searcher)
edges = AgentEdges()

### Nodes
agent.add_node("initial_plan", nodes.plan_node)
agent.add_node("write", nodes.generation_node)
agent.add_node("review", nodes.review_node)
agent.add_node("do_research", nodes.research_plan_node)
agent.add_node("research_revise", nodes.research_critique_node)
agent.add_node("reject", nodes.reject_node)
agent.add_node("accept", nodes.accept_node)
agent.add_node("editor", nodes.editor_node)

### Edges
agent.set_entry_point("initial_plan")
agent.add_edge("initial_plan", "do_research")
agent.add_edge("do_research", "write")
agent.add_edge("write", "editor")

### Conditional edges
agent.add_conditional_edges(
  "editor",
  edges.should_continue,
  {"accepted": "accept", "to_review": "review", "rejected": "reject"},
)
agent.add_edge("review", "research_revise")
agent.add_edge("research_revise", "write")
agent.add_edge("reject", END)
agent.add_edge("accept", END)
```
Before data can flow through a graph, the graph must be compiled. My understanding from the docs is that just runs some simple checks on the structured of the graph and returns a `CompiledGraph` object, which has methods like `stream` and `invoke.`These allow you to pass inputs to the start node, which is defined using `set_entry_point` in the code above.

When building these graphs, it can be very helpful to visualize all the nodes and edges in a notebook. This can be done with the following command


```python
from IPython.display import Image

Image(agent.compile().get_graph().draw_png())
```
[LangGraph offers a few different ways of drawing the graph](https://langchain-ai.github.io/langgraph/how-tos/visualization/), depending on what visualization package you have installed. I’m using pygraphviz, which can be installed on an m\-series mac using the following command


```python
brew install graphviz
pip install -U --no-cache-dir  \
        --config-settings="--global-option=build_ext" \
        --config-settings="--global-option=-I$(brew --prefix graphviz)/include/" \
        --config-settings="--global-option=-L$(brew --prefix graphviz)/lib/" \
        pygraphviz
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*UbEWmRJZyL59E3sSiidqPg.png)

How do we test our agent? The simplest way would just be to call invoke with initial values of some of the components of AgentState (i.e. task, max\_revisions and revision number), which enter the graph at the entry point node.


```python
graph = agent.compile()
res = graph.invoke(
    {
        "task": "What are the key trends in LLM research and application that you see in 2024",
        "max_revisions": 1,
        "revision_number": 0,
    }
)
```
After some time (can be several minutes if the max\_revisions is set to be large) this will return a dictionary of the agent state with all the components filled in. I’m using gpt4o\-mini for this and the results are very impressive, although the extent to which adding the “review” and “editor” components really help to improve the quality of the article could be debated and we’ll return to that in section 3\.

What if we want more insight into the inputs and outputs of the nodes at each stage of the graph? This is essential for debugging and explainable as the graph grows or if we’re hoping to deploy something like this in production. Thankfully LangGraph has some great tools here, which are covered under the [persistence](https://langchain-ai.github.io/langgraph/concepts/persistence/) and [streaming](https://langchain-ai.github.io/langgraph/concepts/streaming/) sections of its documentation. A minimal implementation looks something like this, where we are using an in memory store to keep track of the updates the come out of each stage of the graph.


```python
from langgraph.store.memory import InMemoryStore
from langgraph.checkpoint.memory import MemorySaver
import uuid

checkpointer = MemorySaver()
in_memory_store = InMemoryStore()
graph = agent.compile(checkpointer=checkpointer, store=self.in_memory_store)

## Invoke the graph
user_id = "1"
config = {"configurable": {"thread_id": "1", "user_id": user_id}}
namespace = (user_id, "memories")
        
for i, update in enumerate(graph.stream(
  {
     "task": task_description,
     "max_revisions": max_revisions,
     "revision_number": 0,
  }, config, stream_mode="updates"
        )):
   # print the data that just got generated 
   print(update)
   memory_id = str(uuid.uuid4())
   # store the data that just got generated in memory
   self.in_memory_store.put(namespace, memory_id, {"memory": update})
   results.append(update)
```
More sophisticated applications would access the store from inside the nodes themselves, allowing a chatbot to recall previous conversations with a given user for example. Here we’re just using the memory to save the outputs of each of the nodes, which can then be viewed for debugging purposes. We’ll explore that a bit more in the final section.


## 3\. What’s in the “do\_research” node? The power of Tavily search

Perhaps the most interesting parts of the control flow above are the `do_research`and `research_revise` nodes. Inside both of these nodes we are using an LLM to generate some web search queries relevant to the task, and then we’re using the [Tavily](https://docs.tavily.com/docs/welcome) API to actually conduct the search. Tavily is a relatively new service that offers a search engine optimized for AI agents. Practically what this means is that the service returns search results as chunks of relevant text from websites, rather than just a list of urls (which would need to be scraped and parsed) as in the case of typical search engine APIs.

Under the hood, Tavily is likely using web scrapers and LLMs to extract content relevant to the user’s search, but all of that is abstracted away. You can sign up [here](https://app.tavily.com/home) for Tavily’s free “Researcher” plan which gives 1000 free API calls. Unfortunately after that you’d need to pay a monthly fee to keep using it, which is likely only worth it for business use cases.

Lets see an example using the code very similar to what’s going on inside `AgentNodes.research_plan_node`


```python
from langchain_core.messages import (
    SystemMessage,
    HumanMessage,
)
from research_assist.researcher.prompts import (
    ResearchPlanPrompt,
)
from langchain_openai import ChatOpenAI
from tavily import TavilyClient

class Queries(BaseModel):
    """
    A model representing a list of search queries.

    Attributes:
        queries (List[str]): A list of search queries to be executed.
    """

    queries: List[str]

## set up task
task = """
What are the key trends in LLM reseach and application that you see in 2024
"""

## set up LLM and Tavily
model = ChatOpenAI(
    model="gpt-4o-mini", temperature=0, api_key=secrets["OPENAI_API_KEY"]
)
tavily = TavilyClient(api_key=secrets["TAVILY_API_KEY"])

## generate some queries relevant to the task
queries = agent.nodes.model.with_structured_output(Queries).invoke(
            [
                SystemMessage(content=ResearchPlanPrompt.system_template),
                HumanMessage(content=task),
            ]
)
```
This generates 5 search queries relevant to the task we defined, which look like this


```python
['key trends in LLM research 2024',
 'LLM applications 2024',
 'latest developments in LLM technology 2024',
 'future of LLMs 2024',
 'LLM research advancements 2024']
```
Next we can call Tavily search on each of these queries


```python
response = tavily.search(query=queries[0], max_results=2)
```
This provides a nicely formatted result with url, title and text chunk.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ggfmdmQTEpuZVIOL5bIq5A.png)

This is a very powerful and easy to use search tool that can give LLM applications access to the web without the need for extra work!

In our researcher agent, we’re currently only using the content field, which we extract and append to a list which is passed into the AgentState. That information then gets injected into the prompt thats used for the writer node, hence allowing the LLM to have access to it when generating the report.

There is a lot more you can do with Tavily search, but be aware that experimenting with it will quickly burn through your free API calls. In fact, for our report writing task there are many applications where Tavily calls probably aren’t necessary (i.e. the LLM already has sufficient knowledge to write the report), so I would recommend adding an additional conditional edge that allows the system to bypass the `do_research` and `research_revise` nodes if it determines that a web search is not needed. I will likely update the repo with this change soon.


## 4\. Walk through an example

To solidify everything we just learned, let’s walk through an example of the researcher in action, using the same task as above.

First, we import the libraries and set up our LLM and searcher models


```python
from research_assist.researcher.Agent import ResearchAgent, load_secrets
from langchain_openai import ChatOpenAI
from tavily import TavilyClient

secrets = load_secrets()
model = ChatOpenAI(
    model="gpt-4o-mini", temperature=0, api_key=secrets["OPENAI_API_KEY"]
)
tavily = TavilyClient(api_key=secrets["TAVILY_API_KEY"])

agent = ResearchAgent(model, tavily)
```
Now we can run the agent on a task and give it a maximum number of revisions.


```python
task = """
What are the key trends in LLM reseach and application that you see in 2024
"""
result = agent.run_task(task_description=task,max_revisions=3)
```
Now the agent will run its task, which might take about a minute. Logging has been added to show what it’s doing and importantly, the results are being saved to the `in_memory_store` , which we saw at the end of section 2\.

The final report is accessible in a few ways. Its stored in the result list and can be visualized in a notebook like this


```python
Markdown(result[-3]['write']['draft'])
```
Its also stored in the agent’s memory along with all the other outputs. We can access it as follows


```python
agent.in_memory_store.search(("1", "memories"))[-3].dict()
```
The report itself is about 1300 words long — a bit too much to copy here — but I’ve pasted it into the repo [here](https://github.com/rmartinshort/research_assist/tree/main/research_assist/examples). We can also take a look at what the editor thought of it after one round of revision


```python
editor_comments = agent.in_memory_store.search(("1", "memories"))[-2].dict()
```

```python
{'value': {'memory': {'editor': {'editor_comment': 
'The report has addressed the critiques by enhancing depth in key sections, 
adding clarity, and improving structure with subheadings. 
It provides specific examples and discusses ethical considerations, 
making it a valuable resource. The revisions are sufficient for publication.',
    'finalized_state': True}}},
 'key': '9005ad06-c8eb-4c6f-bb94-e77f2bc867bc',
 'namespace': ['1', 'memories'],
 'created_at': '2024-11-11T06:09:46.170263+00:00',
 'updated_at': '2024-11-11T06:09:46.170267+00:00'}
```
It seems the editor was satisfied!

For debugging purposes, we probably need to read though all the other outputs though. This can be painful to do in a notebook so in the next article we’ll discuss how they can be programmatically dropped into Google Docs. Thanks for making it to the end and [we’ll pick up in part 2](https://towardsdatascience.com/building-a-research-assistant-that-can-write-to-google-docs-part-2-ac9dcacff4ff)!

The author is unaffiliated with any of the tools discussed in this article.


