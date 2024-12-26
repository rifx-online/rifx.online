---
title: "How to build Agentic RAG using CrewAI and Langchain"
meta_title: "How to build Agentic RAG using CrewAI and Langchain"
description: "Agentic RAG is an advanced framework combining Retrieval-Augmented Generation (RAG) with modular agents to dynamically analyze and respond to user queries. It utilizes specialized agents, such as Router_Agent and Retriever_Agent, to route and retrieve information from vector stores or perform web searches. The implementation requires libraries like CrewAI and LangChain, and involves defining tasks and tools for efficient query handling. This modular approach enhances the flexibility and accuracy of responses, making it well-suited for complex and diverse queries."
date: 2024-12-26T04:30:18Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*67w_AjJ_xBAs_g2td-rAUA.png"
categories: ["Generative AI", "Machine Learning", "Natural Language Processing"]
author: "Rifx.Online"
tags: ["RAG", "modular", "agents", "retrieval", "generation"]
draft: False

---




In the rapidly evolving landscape of AI, the ability to provide accurate, context\-aware responses to user queries is a game\-changer. Retrieval\-Augmented Generation (RAG) has emerged as a powerful paradigm, combining the retrieval of relevant information from external sources with the generative capabilities of large language models (LLMs). However, as queries become more complex and diverse, a static RAG setup may not always suffice. This is where **Agentic RAG** steps in.

Agentic RAG introduces an intelligent, modular framework where specialized agents work together to analyze, route, and answer user queries dynamically. Each agent is designed with a specific role — whether it’s routing a question, retrieving information from a vector store, conducting a web search, or generating a response using LLMs. This agent\-based design not only enhances flexibility but also improves the efficiency and accuracy of the RAG process.


## Required Installations

To set up and run the Agentic RAG framework, you need to install several Python libraries that form the backbone of this implementation. Below are the required installations and their purposes:


### 1\. Install CrewAI

CrewAI provides the infrastructure to create agents, tasks, and workflows seamlessly. It enables building modular and intelligent agent\-based systems.


```python
pip install crewai
```

### 2\. Install LangChain OpenAI

LangChain provides tools to work with LLMs, allowing for efficient chaining of tasks and queries. The specific `langchain_openai` package is needed for ChatGPT integration.


```python
pip install langchain_openai
pip install langchain_community
```

### Verify API Keys

Ensure you have the necessary API keys configured:

* **OpenAI API Key** for LLMs.
* [**Serper API Key**](https://serper.dev/) for Google search\-based queries.


```python
OPENAI_API_KEY=<your_openai_api_key>
SERPER_API_KEY=<your_serper_api_key>
```

## Import Necessary Libraries:


```python
from langchain_openai import ChatOpenAI
import os
from crewai_tools import PDFSearchTool
from crewai_tools  import tool
from crewai import Crew
from crewai import Task
from crewai import Agent
from crewai.tools import BaseTool
from pydantic import Field
from langchain_community.utilities import GoogleSerperAPIWrapper
```

## Define the LLM:


```python
llm=ChatOpenAI(model_name="gpt-4o-mini", temperature=0)
```

## Define the Agents:


```python
Router_Agent = Agent(
  role='Router',
  goal='Route user question to a vectorstore or web search',
  backstory=(
    "You are an expert at routing a user question to a vectorstore or web search ."
    "Use the vectorstore for questions on transformer or differential transformer."
    "use web-search for question on latest news or recent topics."
    "use generation for generic questions otherwise"
  ),
  verbose=True,
  allow_delegation=False,
  llm=llm,
)
Retriever_Agent = Agent(
role="Retriever",
goal="Use the information retrieved from the vectorstore to answer the question",
backstory=(
    "You are an assistant for question-answering tasks."
    "Use the information present in the retrieved context to answer the question."
    "You have to provide a clear concise answer."
),
verbose=True,
allow_delegation=False,
llm=llm,
)


```
The `Router_Agent` and `Retriever_Agent` are key components of the Agentic RAG framework, each with distinct roles:

`Router_Agent`**:**

* **Role:** Determines the best tool to handle a user query.
* **Logic:** Routes to a **vectorstore** for domain\-specific queries (e.g., “transformer” or “differential transformer”).Routes to **web search** for recent topics or news.Uses **generation** for generic questions.
* **Details:** Doesn’t delegate tasks and provides clear routing based on the query.

`Retriever_Agent`**:**

* **Role:** Fetches and delivers answers based on the routed decision.
* **Logic:**Uses vectorstore, web search, or generation tools depending on the query type.
* **Details:** Focuses on clear, concise answers without additional delegation.

Together, these agents streamline the RAG process by analyzing and addressing queries efficiently.


## Define the tools:


```python
search = GoogleSerperAPIWrapper

class SearchTool(BaseTool):
    name: str = "Search"
    description: str = "Useful for search-based queries. Use this to find current information about markets, companies, and trends."
    search: GoogleSerperAPIWrapper = Field(default_factory=GoogleSerperAPIWrapper)

    def _run(self, query: str) -> str:
        """Execute the search query and return results"""
        try:
            return self.search.run(query)
        except Exception as e:
            return f"Error performing search: {str(e)}"
class GenerationTool(BaseTool):
    name: str = "Generation_tool"
    description: str = "Useful for generic-based queries. Use this to find  information based on your own knowledge."
    #llm: ChatOpenAI(model_name="gpt-4o-mini", temperature=0)

    def _run(self, query: str) -> str:
      llm=ChatOpenAI(model_name="gpt-4o-mini", temperature=0)
      """Execute the search query and return results"""
      return llm.invoke(query)
generation_tool=GenerationTool()
web_search_tool = SearchTool()
```

### 1\. SearchTool

**Purpose:** Handles search\-based queries to retrieve current information (e.g., market trends, company details, or general online information).

**Key Components:**

* **Name:** `"Search"`
* **Description:** Highlights its use for search\-related queries.
* **Core Mechanism:** Uses `GoogleSerperAPIWrapper` to execute the query.
* **Error Handling:** Captures and returns error messages if the query fails.

**Usage:** Suitable for live, dynamic searches requiring up\-to\-date information.


### 2\. GenerationTool

**Purpose:** Handles generic, knowledge\-based queries using an LLM.

**Key Components:**

* **Name:** `"Generation_tool"`
* **Description:** Used for generating responses based on pre\-trained knowledge.
* **Core Mechanism:**Instantiates a `ChatOpenAI` object (configured with `gpt-4o-mini` and `temperature=0` for deterministic outputs).Executes the query via `llm.invoke(query)`.

**Usage:** Best for queries not reliant on external data but rather on reasoning or static knowledge.

`web_search_tool = SearchTool()`: Creates an instance of `SearchTool` for live queries.

`generation_tool = GenerationTool()`: Creates an instance of `GenerationTool` for generative tasks.

These tools integrate seamlessly into the RAG framework, allowing the agents to dynamically route and answer queries based on the nature of the information required.


### 3\. PDF search tool:

The link to pdf file :[https://arxiv.org/pdf/2410\.05258](https://arxiv.org/pdf/2410.05258), you can use any pdf as per your requirements.


```python
pdf_search_tool = PDFSearchTool(
    pdf="differential transformer.pdf",
)
```
The code snippet initializes a `PDFSearchTool` to enable searching within a specific PDF file. Here's a concise explanation:

`PDFSearchTool` **Overview**

* **Purpose:** Enables querying and retrieving information from a provided PDF file.

**Initialization:**

* The tool is instantiated with the path to the PDF file, in this case, `"differential transformer.pdf"`.
* This means queries related to the content of this PDF will be routed here.

**How It Works**

* When integrated into the framework (e.g., in `retriever_task`):
* If a query is determined to require a **vectorstore search** (based on keywords like “transformer” or “differential transformer”), the `PDFSearchTool` will be used.
* The tool parses and searches the content of the specified PDF to provide relevant information.


## Define the Agent Tasks:


```python
router_task = Task(
    description=("Analyse the keywords in the question {question}"
    "Based on the keywords decide whether it is eligible for a vectorstore search or a web search or generation."
    "Return a single word 'vectorstore' if it is eligible for vectorstore search."
    "Return a single word 'websearch' if it is eligible for web search."
    "Return a single word 'generate' if it is eligible for generation."
    "Do not provide any other premable or explaination."
    ),
    expected_output=("Give a  choice 'websearch' or 'vectorstore' or 'generate' based on the question"
    "Do not provide any other premable or explaination."),
    agent=Router_Agent,
   )

retriever_task = Task(
    description=("Based on the response from the router task extract information for the question {question} with the help of the respective tool."
    "Use the web_serach_tool to retrieve information from the web in case the router task output is 'websearch'."
    "Use the rag_tool to retrieve information from the vectorstore in case the router task output is 'vectorstore'."
    "otherwise generate the output basedob your own knowledge in case the router task output is 'generate"
    ),
    expected_output=("You should analyse the output of the 'router_task'"
    "If the response is 'websearch' then use the web_search_tool to retrieve information from the web."
    "If the response is 'vectorstore' then use the rag_tool to retrieve information from the vectorstore."
    "If the response is 'generate' then use then use generation_tool ."
    "otherwise say i dont know if you dont know the answer"

    "Return a claer and consise text as response."),
    agent=Retriever_Agent,
    context=[router_task],
    tools=[pdf_search_tool,web_search_tool,generation_tool],
)
```

### 1\. router\_task

**Purpose:** Decides how to route a user query based on its content.

**Description Logic:**

* Analyzes the keywords in the query (`{question}`).
* Determines whether the query should:
* Use the **vectorstore** (if related to transformers or technical terms like “differential transformer”).
* Perform a **web search** (if the question relates to recent topics, news, or dynamic content).
* Use **generation** (for generic, knowledge\-based queries).
* Returns a single word (`'vectorstore'`, `'websearch'`, or `'generate'`) as the routing decision.
* **Agent Used:** `Router_Agent`.


### 2\. retriever\_task

**Purpose:** Executes the appropriate tool or action based on the output from `router_task`.

**Description Logic:**

* Reads the routing decision from `router_task`:
* `'websearch'`**:** Uses `web_search_tool` to retrieve information from the web.
* `'vectorstore'`**:** Uses `rag_tool` (PDF search or other vector\-based retrieval) for domain\-specific queries.
* `'generate'`**:** Uses `generation_tool` to create a response using LLM capabilities.
* If none of the above applies, it outputs `"I don't know"`.
* Ensures concise and contextually relevant responses.
* **Agent Used:** `Retriever_Agent`.
* **Tools Used:** Combines `pdf_search_tool`, `web_search_tool`, and `generation_tool`.

These tasks work together via `Router_Agent` and `Retriever_Agent` to handle diverse queries efficiently and intelligently.


## Define the Crew:


```python
rag_crew = Crew(
    agents=[Router_Agent, Retriever_Agent], 
    tasks=[router_task, retriever_task],
    verbose=True,

)
```
The `rag_crew` defines a **Crew** instance that orchestrates the interaction between agents and tasks within the **Agentic RAG framework**.

**Coordination:⁣**`rag_crew` ensures seamless collaboration between agents and tasks.

**Workflow:**

* A query is processed through `router_task` using `Router_Agent`.
* The decision from `router_task` is executed by `retriever_task` using `Retriever_Agent`.

This `Crew` acts as the central hub for managing the entire RAG process, making it modular, efficient, and easy to expand for future capabilities.




## Using the crew:


```python
result = rag_crew.kickoff(inputs={"question":"What is diffrential transformer?"})
```
output:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*sbs-Jr1N10NKnDhrWsvY0w.png)


```python
result = rag_crew.kickoff(inputs={"question":"What is AI?"})
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*b6glCrRUOyeRU5WCnusDCA.png)


```python
result = rag_crew.kickoff(inputs={"question":"What is weather in bengaluru?"})
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*6LHzzZPUx1Q470V4CeKq1g.png)


