---
title: "Building Autonomous Multi-Agent Systems with CrewAI"
meta_title: "Building Autonomous Multi-Agent Systems with CrewAI"
description: "The article discusses the development of autonomous multi-agent systems using CrewAI and LangChain frameworks. It explains the structure of multi-agent systems, emphasizing the roles of agents, tools, and tasks in achieving complex operations. The article details a project that integrates these frameworks to create an essay-writing application, demonstrating how agents can collaborate to research, write, and edit essays. It also outlines the project’s architecture, including agent design, task management, and deployment using Streamlit, providing insights into building efficient AI systems."
date: 2024-11-14T03:29:09Z
image: "https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*72Cy_QqOie7G2NAiWr13Kw.jpeg"
categories: ["Autonomous Systems", "Programming", "Data Science"]
author: "Rifx.Online"
tags: ["CrewAI", "LangChain", "multi-agent", "Streamlit", "essay-writing"]
draft: False

---

### What‘s Multi\-Agent Autonomous System and How to build one with CrewAI and LangChain?



## Motivation

In fact, we are not unfamiliar with these concepts; we know them from movies. A person commands their AI, and the AI carries out these commands by using various tools. This is the path we are on today with the rise of AI systems. The era is gradually changing. In the past, people couldn’t undertake a task alone and would need a team. Without a team, they would either run out of energy after a while or hit the limits of their abilities. In the end, successful projects come from teams made up of individuals with different skills.

> Teamwork makes the dream work.

However, these days a new technology has started to make a name for itself. We can call it the next phase of AI before AGI: ‘Agents.’ So, what are these agents? Before diving into the code, let’s talk a bit about the structure of multi\-agent systems

## How does it work?

To put the equation simply: `Multi Agent Systems = AGENTs + TOOLs + TASKs` It’s a system where multiple agents are equipped with various tasks and tools.

### Agent

We are familiar with role\-playing games, where your character has a role, like a warrior, for example. Throughout the game, you put yourself in their place, aiming to complete the game by finishing the quests that shape their backstory from one adventure to the next. Similarly, researchers have discovered that large language models (LLMs) can be motivated to perform tasks optimally when given roles, backstories, and objectives. This allows us to motivate LLMs to carry out various tasks with just a few simple prompts.

Agents essentially break down the assigned tasks into simple steps and then execute those steps by ‘thinking’ — yes, thinking — through them in sequence. This enables us to create an agent that not only performs steps thoughtfully but also consults other agents with different areas of expertise, rather than relying on a single LLM to input prompts and receive outputs.

### Tools

One of humanity’s greatest abilities is undoubtedly our skill in using tools. This ability has evolved and developed through both evolutionary and cultural processes, allowing us to create the advanced technology we use today. Similarly, large language models have increased their capabilities as they are trained on larger datasets. Now, when the function of a tool and how it is used are clearly explained, these models can autonomously use the tool under appropriate conditions, executing it fully automatically and planning their next steps based on the output, without waiting for further commands.

Therefore, tool use can be considered one of the most important parts of their evolution as well. Especially with the internet browsing tool, agents can follow the specified function’s steps to access the necessary resources, whether through web scraping or by using the search engine of the designated site.

Your tools’ functionality and purpose are entirely up to your imagination. However, if you’d like to integrate pre\-built tools into your agents, both CrewAI and LangChain libraries offer a wide range of built\-in tools ready for use. In this project, we will focus on creating our own custom tool instead.

### Task

Just as we create agents, we also create tasks, and each task requires various tools. To give an example from human behavior, what do we do when we need to research something?

1\- We search the internet.

2\- We conduct in\-depth source research.

3\- We take notes on our findings.

In the same way, we can design tasks to follow these steps, and we will touch on how they are designed through the code.

## What is CrewAI?

CrewAI is an open\-source Python framework for orchestrating role\-playing, autonomous AI agents with methods like Crew, Task, Agent, Process, and it supports various LLMs, including local models.

If we look at the main advantages provided by the framework:

* Role\-based agent design.
* Autonomous inter\-agent delegation.
* Flexible task management.
* Process\-driven execution.
* Output saving as files like .markdown files.
* Compatibility with both open\-source and proprietary models like OpenAI.

## Building Multi\-Agent

A descriptive explanation alone may not always be enough to fully understand a concept, so let’s create a small Essay Writer project to better grasp the multi\-agent approach. In this project, we will combine the LangChain and CrewAI frameworks. To run the project, you will need an OpenAI API key, which you can obtain by visiting [https://proxy.rifx.online/https://platform.openai.com/signup](https://proxy.rifx.online/https://platform.openai.com/signup).

The structure of our project consists of several different python scripts:

* `crew.py`, where we define our agents and their tasks.
* `graph.py`, which builds the LangGraph structure.
* `extra_tools.py`, containing the tools our agents will use.
* `pdf_writer.py`, responsible for converting the essay into a PDF.
* `app.py`, which provides the Streamlit interface for our application.

```python
## Project Structure
Autonomous-Multi-Agent-Systems-with-CrewAI-Essay-Writer
├── app.py              # Main streamlit application
├── crew.py             # CrewAI agents and task handling
├── extra_tools.py      # Agentic functions of tools
├── graph.py            # LangGraph and Project Workflow
├── pdf_writer.py       # Handles PDF output generation
├── requirements.txt    # List of required libraries
├── media
│   └── cover.jpg       # Project cover image
└── README.md        
```

The libraries required for this project are listed in the `requirements.txt` file. Additionally, please ensure you have installed Python version 3\.12 or higher. Don’t forget to install the dependencies before running the project. The libraries we use include:

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

### Workflow

In our process, we will assign various roles to the agents. For example, while one agent waits for another to complete their task of researching on the internet, another agent will independently carry out research on Wikipedia. Once both agents have completed their tasks, the agent waiting for their information will then proceed with writing the essay, which is their assigned task.

If we were to visualize this:

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Emb37H_8OAKp1s1ChLLVQg.png)

* The User Query is initially sent to the Router.
* The Router reads the query and determines whether the user wants to write a new essay, edit a previous one, or simply convey a topic for discussion. If the user wishes to write a new essay, the request is forwarded to Crew.
* The incoming request to Crew is first sent to the Researcher Agent.
* The researcher agent uses the tools assigned to him to search for internet resources related to the subject on which the user wants to write an essay.
* Once the resource collection process is completed, the collected information is forwarded to the Writer Agent.
* When the writer agent drafts the essay, the Editor Agent makes final adjustments, corrects grammatical errors, and returns the draft as a JSON file to LangGraph.
* The JSON file is sent to the function that will create our essay as a PDF file in the final node.

### Building LangGraph

First, we need to establish the skeleton of our schema. Once we create a workflow that allows us to reach our agents as needed, all that’s left is to decide at which stages of the workflow we will send a request to our agents. To do this, we will first create a simple workflow using LangChain.

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

**Router Node**: As we mentioned in the workflow description, our router assigns tasks to various nodes based on incoming requests. To achieve this, we need to create an effective prompt that encompasses the topic provided by the user and incorporates past conversations. After all, we are developing a multi\-agent essay writer chatbot that can remember and recall previous discussions.

Let’s draft a simple prompt and the corresponding node that will utilize this prompt. In the prompt, we should define a `BaseModel` using the Pydantic library to enforce that our router selects one of three potential response strategies. These strategies will guide the chatbot in formulating its responses effectively.

In the node, we will implement this prompt using Langchain’s `PromptTemplate` method. Then, we will invoke the LLM (Large Language Model) with both the user query and the conversation history to ensure that the response is contextually relevant and tailored to the user’s needs.

1. **Define the Pydantic Model**: Create a model that specifies the required response strategy.
2. **Construct the Prompt**: Write a prompt that clearly outlines the three strategies.
3. **Set Up the Node**: Use Langchain `PromptTemplate` to format the prompt dynamically.
4. **Invoke the LLM**: Call the LLM with the formatted prompt, user query, and conversation history.

By following these steps, we can ensure that the chatbot responds accurately and maintains the context from previous interactions.

```python
#Router Prompt and Router Node
class RouteQuery(BaseModel):
    """Route a user query to direct answer or research."""

    way: Literal["edit_essay","write_essay", "answer"] = Field(
        ...,
        description="Given a user question choose to route it to write_essay, 
        edit_essay or answer",
    )

self.router_prompt = 
    """
    You are a router and your duty is to route the user to the correct expert.
    Always check conversation history and consider your move based on it.
    If topic is something about memory, or daily talk route 
      the user to the answer expert.
    If topic starts something like can u write, or user request 
      you write an article or essay, route the user to the write_essay expert.
    If topic is user wants to edit anything in the essay, 
      route the user to the edit_essay expert.
  
    \nConservation History: {memory}
    \nTopic: {topic}
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

**Simple Answer Node**: After placing our router as a node in the start section, the next step is to create our other three nodes: `write_essay`, `edit_essay`, and `answer`. To take a straightforward approach, we need to program our `answer` node to generate responses directly using its memory when a user sends a casual message or engages in a conversation about an essay.

To achieve this, we must first write a suitable prompt for this task. Then, using this prompt, we will design a simple node. Let’s proceed with this design.

```python
#Simple Answer Prompt and Node

self.simple_answer_prompt = 
      """
      You are an expert and you are providing a simple 
      answer to the user's question.
    
      \nConversation History: {memory}
      \nTopic: {topic}
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

**Writing Essay Node**: Next, we need to design the `writing_essay` node. The purpose of this node is to forward the query received from the user to our agents using CrewAI’s `kickoff` method and then to convert the JSON file returned by the agents into a PDF. Naturally, we do not need to write a prompt for this node, as the prompts will be defined during the agent creation phase. This node will be created solely for the purpose of invoking the agents and utilizing the returned values.

1. **Invoke Agents**: Use CrewAI’s `kickoff` method to send the user's query to the agents.
2. **Process the Returned JSON**: Handle the JSON response received from the agents.
3. **Convert to PDF**: Convert the relevant data from the JSON into a PDF format.

```python
#Write Essay Node
def write_essay(self, state: GraphState):
    print("**ESSAY COMPLETION**")

    self.essay = self.crew.kickoff({"topic": state["topic"]})

    self.memory.save_context(inputs={"input": state["topic"]},
                           outputs={"output": str(self.essay)})

    pdf_name = generate_pdf(self.essay)
    return {"response": "Here is your essay! ",  "pdf_name": f"{pdf_name}"}
```

**Edit Essay Node**: Let’s briefly discuss our final node, `edit_essay`. The code may appear a bit lengthy, as the prompt is kept within the node. You can also write the prompt during the class definition and assign it as a variable if you prefer.

This node will be activated by the router when it detects a request for any essay modifications from the user. In this node, we need three important values: the conversation history, the user’s request, and the most recently generated essay. Additionally, there is a variable in the prompt that Langchain will generate called `format_instructions`. This variable allows us to communicate to the LLM that we want to maintain the structure of the JSON format of the edited essay and to receive the response in the same format. Afterward, we will send the returned response to our PDF generation tool.

1. **Detect Edit Request**: The router identifies whether the user’s request is for editing an essay.
2. **Collect Necessary Values**: Gather the conversation history, user request, and the last generated essay.
3. **Create and Use the Prompt**: Construct a prompt that includes `format_instructions`.
4. **Generate the Edited Essay**: Invoke the LLM to get the edited essay and pass the response to the PDF generator.

```python
#Edit Essay Node

def edit_essay(self, state: GraphState):
    print("**ESSAY EDIT**")
    memory = self.memory.load_memory_variables({})

    user_request = state["topic"]
    parser = JsonOutputParser(pydantic_object=Essay)
    prompt = PromptTemplate(
      template=("Edit the Json file as user requested, 
                  and return the new Json file."
                "\n Request:{user_request} "
                "\n Conservation History: {memory}"
                "\n Json File: {essay}"
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
    return {"response": "Here is your edited essay! ", 
            "essay": self.essay, "pdf_name": f"{pdf_name}"}
```

## Building Agents

**Content Researcher**: To keep our project simple, we have defined three agents that will communicate with each other and conduct internet searches to write essays. Let’s design the first agent, the researcher agent. This agent will perform web scraping on Wikipedia and other websites as needed, gathering necessary sources until it determines it has collected enough information. It will fetch main headings, subheadings, and articles related to the topic, preparing summaries. Subsequently, these documents will be stored to be sent to the writer's agent.

When designing this agent, we need to consider its role, backstory, and goal. We will assign these to the parameters in the `Agent` class similarly to how we would construct a prompt, thereby readying the agent for operation.

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

We need to create two classes: `Agent` and `Task`. Each agent can have one or more assigned tasks. We can assign tools directly to the agents or add task\-specific tools. By adding the tool specifically for the task, we ensure that the tool is only used during that particular task.

### Parameters

The parameters of our `Agent` class:

1. **Role**: This defines the agent’s function within the crew. It determines the kind of tasks the agent is best suited for and should be short and descriptive.
2. **Goal**: This is the individual objective that the agent aims to achieve. It guides the agent’s decision\-making process and should be short and simple.
3. **Backstory**: This provides context for the agent’s role and goal, enriching the interaction and collaboration dynamics. It should be as detailed as possible.
4. **Verbose**: Setting this to `True` configures the internal logger to provide detailed execution logs, aiding in debugging and monitoring what our agent is engaged in.

The parameters of our `Task` class:

1. **Description**: A clear and concise statement of what the task entails. This should be as detailed as possible to ensure clarity.
2. **Expected Output**: A detailed description of what the task’s completion looks like, helping to set clear expectations for the outcome.
3. **Tools**: The functions or capabilities the agent can utilize to perform the task. Here, you can use LangChain, CrewAI, or custom tools as needed.
4. **Agent**: The agent responsible for the task, assigned either directly or through the crew’s process.

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ocQ9ZUZwFtGx7a7pPrTbuQ.png)

**Content Writer**: Once our researcher agent has gathered the necessary information through several iterations, it will store the collected data in memory, believing it has acquired sufficient knowledge, and pass the task to our next agent, the content writer.

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*HD1Bm7twxsUIVGPiqEhHAg.png)

Now, let’s define our content writer agent and its role. This agent does not require the use of any tools, so it will suffice to detail the backstory and description similarly to the researcher agent. In the backstory, we must remember to specify which agent provided the source of information.

### Parameters

1. **Role**: The function of the content writer agent within the project. This should succinctly capture what the agent does.
2. **Goal**: The specific objective that the content writer aims to achieve, such as drafting a well\-structured essay based on the information collected.
3. **Backstory**: This provides context for the content writer’s role, including details about the researcher agent and the information it has provided. A well\-crafted backstory can enhance the narrative and collaboration dynamics.
4. **Description**: A clear and concise statement of what the content writer does, focusing on its responsibilities and tasks.
5. **Expected Output**: A detailed description of what the task’s completion looks like, helping to set clear expectations for the outcome.
6. **Context**: Before executing the task, we specify which task to wait for to be completed and to obtain the necessary information from that task output with the context parameter.

```python
#Content Writer Agent and Task

self.writer = Agent(
  role="Content Writer",

  goal="Write insightful and factually accurate "
       "opinion piece about the provided topic",

  backstory="You're working on a writing a new opinion piece 
              about the provided topic."
            "You base your writing on the work of the Content Researcher, 
             who provides an outline and relevant context about the topic."
            "You follow the main objectives and direction of the outline, 
              as provide by the Content Researcher."
            "You also provide objective and impartial insights 
             and back them up with information provide 
             by the Content Researcher.",
  verbose=True,
)

self.write = Task(
  description=(
      "1. Use the content to craft a compelling essay.\n"
      "2. Incorporate SEO keywords naturally.\n"
      "3. Sections/Subtitles are properly named in an engaging manner.\n"
      "4. Ensure the essay is structured with an engaging introduction, 
          insightful body, and a summarizing conclusion.\n"
      "5. Proofread for grammatical errors and alignment with 
          the brand's voice.\n"
      "6. Pick a suitable header\n"
  ),
  expected_output="A well-written essay in markdown format, 
                  ready for publication, each section 
                  should have 2 or 3 paragraphs.",
  context=[self.research],
  agent=self.writer,
)
```

**Content Editor**: After defining the writer agent, we could have concluded the process; however, even though the writer agent is responsible for writing, it may still make spelling mistakes and errors that disrupt the coherence of the content. To prevent these issues and to export the essay output in JSON format, we will define one more agent: the content editor.

In the backstory of this agent, we will specify that it is responsible for reviewing and correcting the essay received from the writer agent. In the task phase, we will also define the required output format.

```python
#Content Editor Agent and Task
self.editor = Agent(
    role="Content Editor",

    goal="Edit a given essay to align with the writing 
            style of the organization.",

    backstory="You are an editor who receives an essay 
                from the Content Writer."
              "Your goal is to review the essay to ensure 
                that it follows best practices, provides balanced viewpoints"
              "When providing opinions or assertions,
                and also avoids major controversial topics 
                or opinions when possible.",
    verbose=True
)

self.edit = Task(
    description="Proofread the given essay for grammatical errors 
                  and alignment with the brand's voice.",

    expected_output="A well-written essay in required format, 
                      ready for publication, each section 
                      should have 2 or 3 paragraphs.",
    output_json = Essay,
    context=[self.write],
    agent=self.editor
)
```

Here, our output is an object named; `Essay`, created with the help of the `BaseModel` and `Field` classes from the Pydantic Library. By adding explanations that our agent can understand, we ensure that the agent will output data in a format expected by our PDF printing function.

```python
#Expected Pydantic Output

class Paragraph(TypedDict):
    sub_header: str
    paragraph: str

class Essay(BaseModel):
    header: str = Field(..., description="The header of the essay")
    entry: str = Field(..., description="The entry of the essay")
    paragraphs: List[Paragraph] = Field(..., description="The paragraphs of the essay")
    conclusion: str = Field(..., description="The conclusion of the essay")
    seo_keywords: List[str] = Field(..., description="The SEO keywords of the essay")
```

We have defined our agents and their tasks. Now, let’s bring together our three agents. For this, we should use a small yet functional method from the CrewAI library called `Crew`. In this method, we list the agents that will operate sequentially along with the tools they will use. If the tasks need to be executed in order, as in our project, we set the `process` parameter to `Process.sequential`. We also set the `memory` parameter to `True` to enable the agents to communicate with each other using short\-term and long\-term memory.

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

Our agent structure is complete, but we haven’t discussed our tools yet. Now, let’s briefly address our tools.

## Building Tools

Tools are essentially functions that take various inputs and return a value as output. Our agents will simply provide the expected input to these functions and process the output they receive. Therefore, we need to design our tools with high fault tolerance. When a usage error occurs, our agents should be able to read the error and be equipped with information to use the tool correctly in the next iteration.

After preparing the functions for our tools, we should convert them into tool objects using either LangChain or CrewAI’s Tool creation class, along with various explanations. Here, we convert our tool into a form that our agent can use by simply writing C**rewAI’s tool decorator** at the top of our function.

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

## Building App

Now, let’s deploy our application live using the Streamlit framework, which I frequently use and believe offers an easy interface design. Streamlit is an open\-source Python framework for data scientists and AI/ML engineers to deliver dynamic data apps with only a few lines of code.

Our app primarily activates when the user enters their OpenAI key in a `text_input` box and then clicks the "Initialize Agents" button. When the user sends a message through the active `chat_input` section, the following function is used to relay the entered request to our established agent structure:

```python
def generate_response(topic):
    return app.invoke(input={"topic": topic})
```

With Streamlit’s `st.chat_message` component, we can easily implement a chatbot interface. If the user is engaged in regular messaging, the response will display a normal answer. If an essay has been generated, we’ll provide the directory of the PDF to the user by writing a simple if\-else loop.

Meanwhile, we add every message we send and receive from the chatbot to a `messages` variable created in Streamlit’s `session_state`. This way, we create a visible chat screen.

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
    st.info(" * This app uses the OpenAI API to generate text, please provide your API key."
            "\n\n * This app uses the 'gpt-4o-mini-2024-07-18' model. Cost effective and efficient."
            "\n\n * If you don't have an API key, you can get one [here](https://proxy.rifx.online/https://platform.openai.com/signup)."
            "\n\n * You can also find the source code for this app [here](https://proxy.rifx.online/https://github.com/mesutdmn/Autonomous-Multi-Agent-Systems-with-CrewAI-Essay-Writer)"
            "\n\n * App keys are not stored or saved in any way."
            "\n\n * Writing essay may take some time, please be patient. Approximately 1-2 minutes."
    openai_key= st.text_input("OpenAI API Key", type="password")


def initialize_agents():
    os.environ["OPENAI_API_KEY"] = openai_key
    essay_writer = EssayWriter().graph

    if len(openai_key) < 1:
        st.error("Please enter your OpenAI API key and Initialize the agents.")

        st.session_state.chat_active = True
    else:
        st.success("Agents successfully initialized")
        st.session_state.chat_active = False

    return essay_writer

with st.sidebar:
    if st.button("Initialize Agents", type="primary"):
        st.session_state.app = initialize_agents()

app = st.session_state.app
def generate_response(topic):
    return app.invoke(input={"topic": topic})


for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"], unsafe_allow_html=True)

if topic:= st.chat_input(placeholder="Ask a question", disabled=st.session_state.chat_active):
    st.chat_message("user").markdown(topic)

    st.session_state.messages.append({"role": "user", "content": topic})
    with st.spinner("Thinking..."):
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

**Congratulations**! We have completed our project. If you wish, you can watch the project work log that I have recorded for you. Don’t forget to visit the GitHub [**repo**](https://proxy.rifx.online/https://github.com/mesutdmn/Autonomous-Multi-Agent-Systems-with-CrewAI-Essay-Writer) to access all the codes of the project.

And this is how our app’s main page will look like once we deploy it!

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*8tDAluuAH6njIohDbb-UqA.png)

## Conclusion

In this article, we explored how to build autonomous multi\-agent systems using CrewAI. We started by discussing the motivation behind creating agents and how they can work together to accomplish tasks more efficiently. By breaking down tasks and utilizing tools, we enabled our agents to perform complex operations in a structured way.

We developed a simple project that integrated the CrewAI and LangChain frameworks, showcasing how multiple agents can collaborate to gather information, write essays, and edit content. The use of tools and task management was emphasized to ensure our agents operated smoothly and effectively.

Finally, we deployed our application using Streamlit, allowing users to interact with the system effortlessly.

You can check out the live project [**here**](https://proxy.rifx.online/https://multi-agent-essay-writer.streamlit.app/), view the source code on my GitHub repository [**here**](https://proxy.rifx.online/https://github.com/mesutdmn/Autonomous-Multi-Agent-Systems-with-CrewAI-Essay-Writer)


