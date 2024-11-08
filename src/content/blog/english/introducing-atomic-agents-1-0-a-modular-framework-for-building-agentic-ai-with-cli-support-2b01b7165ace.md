---
title: "Introducing Atomic Agents 1.0: A Modular Framework for Building Agentic AI"
meta_title: "Introducing Atomic Agents 1.0: A Modular Framework for Building Agentic AI"
description: "Imagine building AI applications as effortlessly as assembling LEGO blocks. That’s the idea behind Atomic Agents, a modular framework for…"
date: 2024-11-08T00:19:37Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*BZGf8BCnCJiFlKZ5.png"
categories: ["Programming", "Machine Learning", "Autonomous Systems"]
author: "Rifx.Online"
tags: ["modular", "framework", "Atomic", "assembler", "schema"]
draft: False

---



Imagine building AI applications as effortlessly as assembling LEGO blocks. That’s the idea behind [Atomic Agents](https://github.com/BrainBlend-AI/atomic-agents), a modular framework for constructing AI agents inspired by **Atomic Design** principles. With the release of **version 1\.0**, Atomic Agents introduces a powerful CLI called **Atomic Assembler**, making it even easier to build, manage, and deploy your AI applications.

## Why Atomic Agents?

Many existing frameworks for **Agentic AI** focus on building autonomous multi\-agent systems that are more like curiosities than practical tools. While these can be fascinating, they often lack the predictability and control required for real\-world applications.

Businesses typically aren’t looking for a bot that writes articles in a different style each time. They want consistency in style, structure, and tone to align with their brand identity. Fine\-tuning a model is one approach, but it requires substantial data and resources, and it’s not always feasible with the latest models like GPT\-4\.

Atomic Agents aims to solve this by providing:

* **Modularity**: Build complex AI systems by combining simple, interchangeable components.
* **Atomicity**: Each component within Atomic Agents, each tool, each agent, each context provider, is as single\-purpose and re\-usable as possible, Guaranteeing a great separation of concerns.
* **Control**: Fine\-tune each individual step and component, from system prompts to tools.
* **Predictability**: Ensure reproducible and reliable outputs suitable for business use cases.
* **Extensibility**: Easily add or replace components without overhauling the entire system.

## A Traditional Modular Approach

In traditional software development, complex problems are broken down into smaller, manageable parts:

1. **Define the problem**: Start with flows, user stories, or customer journeys.
2. **Break it down**: Divide the problem into smaller, solvable tasks.
3. **Develop modular code**: Write functions or classes that handle specific tasks.
4. **Integrate**: Combine these modules to form the complete application.

Atomic Agents brings this same level of modularity and predictability to AI agent development.

## A Real\-World Scenario

Instead of building a monolithic AI system that “writes a blog post,” we can design a modular system that:

1. **Generates queries** related to a subject.
2. **Identifies** the top X most relevant articles.
3. **Visits** each identified article’s page.
4. **Extracts** the text from each article.
5. **Generates summaries** of each article.
6. **Stores** the summaries in a vector database.
7. **Generates questions** around the subject.
8. **Answers** those questions using the vector database.
9. **Synthesizes** the answers into a coherent blog post.

This approach is more verbose but offers greater control, reliability, and suitability for real\-world business applications.

## Introduction of the CLI: Atomic Assembler

One of the significant additions in version 1\.0 is the **Atomic Assembler** CLI. This command\-line tool allows you to:

* **Download and manage tools**: Easily add new tools or agents to your project.
* **Avoid unnecessary dependencies**: Install only what you need.
* **Modify tools effortlessly**: Each tool comes with its own tests and documentation.
* **Access tools directly**: If you prefer, manage tools manually without the CLI.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*aDceAIINxyFDOvle.png)

## Anatomy of an Agent

AI agents, especially in the Atomic Agents framework, consist of several key components:

* **System Prompt**: Defines the agent’s behavior and purpose.
* **User Input**: The data provided by the user.
* **Tools**: External functions or APIs the agent can utilize.
* **Memory**: Keeps track of the conversation or state.

Each component is designed to be modular and interchangeable, adhering to the principles of separation of concerns and single responsibility.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*yt-5SoQC6uXTAd1-)

## The Power of Modularity

By breaking down agents into these atomic components, you can:

* **Swap out tools** without affecting the rest of the system.
* **Fine\-tune prompts** to adjust the agent’s behavior.
* **Chain agents and tools** seamlessly by matching their input and output schemas.

## Using the CLI: Atomic Assembler

## Installation

To get started with Atomic Agents and the CLI, install the package via pip:

```python
pip install atomic-agents
```

## Running the CLI

Launch the CLI using:

```python
atomic
```

Or, if you installed Atomic Agents with Poetry:

```python
poetry run atomic
```

You’ll be presented with a menu to download and manage tools:

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*SzRlpA0-ivcE2qhk)

*Image: Atomic CLI Main Menu*

Each tool includes:

* **Input Schema**
* **Output Schema**
* **Usage Examples**
* **Dependencies**
* **Installation Instructions**

## Managing Tools

The Atomic Assembler CLI provides complete control over your tools, allowing you to:

* **Avoid dependency clutter**: Install only the tools you need.
* **Modify tools easily**: Each tool is self\-contained with its own tests.
* **Access tools directly**: Manage tool folders manually if you prefer.

## Context Providers

Atomic Agents introduces **Context Providers** to enhance your agents with dynamic context. Context Providers allow you to inject additional information into the agent’s system prompt at runtime.

## Using Context Providers

**Create a Context Provider Class**: Subclass `SystemPromptContextProviderBase` and implement the `get_info()` method.

```python
from atomic_agents.lib.components.system_prompt_generator import SystemPromptContextProviderBase   

class SearchResultsProvider(SystemPromptContextProviderBase):
      def __init__(self, title: str, search_results: List[str]):
          super().__init__(title=title)
          self.search_results = search_results

       def get_info(self) -> str:
          return "\n".join(self.search_results)
```

**Register the Context Provider with the Agent**:

```python
## Initialize your context provider with dynamic data
search_results_provider = SearchResultsProvider(
      title="Search Results",
      search_results=["Result 1", "Result 2", "Result 3"]
)   

## Register the context provider with the agent  
agent.register_context_provider("search_results", search_results_provider)
```

This allows your agent to include dynamic data like search results in its system prompt, enhancing its responses based on the latest information.

## Chaining Schemas and Agents

Atomic Agents simplifies chaining agents and tools by aligning their input and output schemas. This design promotes modularity and reusability.

### Example: Generating Queries for Different Search Providers

Suppose you have an agent that generates search queries and you want to use these queries with different search tools. By aligning the agent’s output schema with the input schema of the search tool, you can easily chain them or switch between providers.

```python
import instructor
import openai
from pydantic import Field
from atomic_agents.agents.base_agent import BaseIOSchema, BaseAgent, BaseAgentConfig
from atomic_agents.lib.components.system_prompt_generator import SystemPromptGenerator

## Import the search tool
from web_search_agent.tools.searxng_search import SearxNGSearchTool
class QueryAgentInputSchema(BaseIOSchema):
    """Input schema for the QueryAgent."""
    instruction: str = Field(..., description="Instruction to generate search queries for.")
    num_queries: int = Field(..., description="Number of queries to generate.")


## Initialize the query agent
query_agent = BaseAgent(
    BaseAgentConfig(
        client=instructor.from_openai(openai.OpenAI()),
        model="gpt-4",
        system_prompt_generator=SystemPromptGenerator(
            background=[
                "You are an intelligent query generation expert.",
                "Your task is to generate diverse and relevant queries based on a given instruction."
            ],
            steps=[
                "Receive the instruction and the number of queries.",
                "Generate the queries in JSON format."
            ],
            output_instructions=[
                "Ensure each query is unique and relevant.",
                "Provide the queries in the expected schema."
            ],
        ),
        input_schema=QueryAgentInputSchema,
        output_schema=SearxNGSearchTool.input_schema,  # Align output schema
    )
)
```

**Modularity**: By setting the `output_schema` of the `query_agent` to match the `input_schema` of `SearxNGSearchTool`, you can directly use the output of the agent as input to the tool.

**Swapability**: To switch to a different search provider, import a different search tool and update the `output_schema`:

```python
## Import a different search tool
from web_search_agent.tools.another_search import AnotherSearchTool

## Update the output schema
query_agent.config.output_schema = AnotherSearchTool.input_schema
```

## Example: Building a Simple AI Agent

Now that we’ve covered the basics, let’s build a simple AI agent using Atomic Agents and explore how it works under the hood.

## Step 1: Installation

First, install the necessary packages:

```python
pip install atomic-agents openai instructor
```

## Step 2: Import Components

Import the necessary components:

```python
import os
from atomic_agents.agents.base_agent import BaseAgent, BaseAgentConfig, BaseIOSchema
from atomic_agents.lib.components.system_prompt_generator import SystemPromptGenerator
from atomic_agents.lib.components.agent_memory import AgentMemory
from pydantic import Field
import instructor
import openai
```

## Step 3: Define a Custom Output Schema

```python
class CustomOutputSchema(BaseIOSchema):
    chat_message: str = Field(..., description="The chat message from the agent.")
    suggested_questions: List[str] = Field(..., description="Suggested follow-up questions.")
```

## Step 4: Set Up the System Prompt

```python
system_prompt_generator = SystemPromptGenerator(
    background=["This assistant is knowledgeable, helpful, and suggests follow-up questions."],
    steps=[
        "Analyze the user's input to understand the context and intent.",
        "Formulate a relevant and informative response.",
        "Generate 3 suggested follow-up questions for the user."
    ],
    output_instructions=[
        "Provide clear and concise information in response to user queries.",
        "Conclude each response with 3 relevant suggested questions for the user."
    ]
)
```

## Step 5: Initialize the Agent

```python
## Initialize memory (optional)
memory = AgentMemory()

## Initialize the agent
agent = BaseAgent(
    config=BaseAgentConfig(
        client=instructor.from_openai(openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))),
        model="gpt-4o-mini",
        system_prompt_generator=system_prompt_generator,
        memory=memory,
        output_schema=CustomOutputSchema
    )
)
```

## Step 6: Use the Agent

```python
user_input = "Can you explain the benefits of using Atomic Agents?"
response = agent.run(agent.input_schema(chat_message=user_input))
print(f"Agent: {response.chat_message}")
print("Suggested questions:")
for question in response.suggested_questions:
    print(f"- {question}")
```

## What’s Happening Behind the Scenes?

* **System Prompt**: Defines the agent’s behavior and guides the LLM.
* **Input Schema**: Validates the user’s input.
* **Output Schema**: Ensures the agent’s response matches the expected format.
* **Memory**: Keeps track of the conversation history.

## Conclusion

Atomic Agents 1\.0 brings modularity, control, and flexibility to AI agent development. With the introduction of the Atomic Assembler CLI and features like Context Providers and schema chaining, building sophisticated AI applications has never been easier.

Whether you’re a developer aiming to build AI\-powered tools or a business looking to automate complex tasks, Atomic Agents provides the building blocks to create reliable and maintainable AI systems.

## Get Started Today

* **GitHub Repository**: [BrainBlend\-AI/atomic\-agents](https://github.com/BrainBlend-AI/atomic-agents)
* **API Documentation**: [Atomic Agents API Docs](https://brainblend-ai.github.io/atomic-agents/)
* **Examples Directory**: [Atomic Examples](https://github.com/BrainBlend-AI/atomic-agents/tree/main/atomic-examples)


