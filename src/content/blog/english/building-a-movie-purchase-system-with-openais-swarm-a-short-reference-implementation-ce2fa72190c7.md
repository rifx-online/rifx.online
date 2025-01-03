---
title: "OpenAI’s Swarm (Part 1): A Short Reference Implementation"
meta_title: "OpenAI’s Swarm (Part 1): A Short Reference Implementation"
description: "The article discusses OpenAIs Swarm framework, an experimental tool for building multi-agent systems that enable collaboration among specialized AI agents. It outlines the creation of a movie purchase system where agents handle pricing, shipping, and overall supervision. Key features include shared context management and dynamic function handling, enhancing the robustness of the system. Debugging tips using sequence diagrams are provided to facilitate tracking agent interactions. The framework, while still in development, shows potential for applications in customer service, booking systems, and educational tutoring."
date: 2025-01-03T00:23:58Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*kYGO_VdF8nsCTggZUPvTLA.png"
categories: ["Programming", "Machine Learning", "Autonomous Systems"]
author: "Rifx.Online"
tags: ["Swarm", "multi-agent", "collaboration", "debugging", "sequence-diagrams"]
draft: False

---






**A short code reference to build upon.**


## Word Count: 1350 \| Estimated Reading Time: 8 minutes


## Table of Contents

1. [Introduction: The Challenge of Multi\-Agent Systems](https://markdowntohtml.com/#introduction)
2. [Overview of OpenAI’s Swarm Framework](https://markdowntohtml.com/#swarm-overview)
3. [Setting Up the Environment](https://markdowntohtml.com/#setup)
4. [Defining the Shared Context](https://markdowntohtml.com/#shared-context)
5. [Creating Specialized Agents](https://markdowntohtml.com/#specialized-agents)
* [The Supervisor Agent](https://markdowntohtml.com/#supervisor-agent)
* [The Sales Expert Agent](https://markdowntohtml.com/#sales-agent)
* [The Shipping Pro Agent](https://markdowntohtml.com/#shipping-agent)

6\. [Debugging with Sequence Diagrams](https://markdowntohtml.com/#sequence-diagrams)

7\. [Pro Tips for Debugging Multi\-Agent Systems](https://markdowntohtml.com/#debugging-tips)

8\. [Potential Applications and Next Steps](https://markdowntohtml.com/#applications)


## TL;DR

We explore using OpenAI’s experimental Swarm framework to create a simplified movie purchase system in which multiple AI agents collaborate under the control of a supervisor to handle transactions.

The article demonstrates the creation of specialized agents for supervision, sales, and shipping and the use of Mermaid sequence diagrams for effective debugging.

From a first\-principles perspective, I like OpenAI Swarm. It is deceptively simple and flexible once you get the hang of it. You are always close enough to using regular Python code, and it forces you to nail your prompts.


> ***Using a flow state (context\_variables in Swarm parlance) helps the supervisor manage proper transitions from one agent to the next.***

Next, we might try a more straightforward sequential implementation. But why do the easy thing first? :)

The part about using a Mermaid sequence diagram to help visually debug is also very useful. I tried some open\-source “LLM tracing” libraries but found them less intuitive. I think I’ll keep my newly found visual debugging habits for now.

I have made a gist of the entire code available [here](https://gist.github.com/cnndabbler/6ee1b89044306e8073356e59f4cb0bac) . Feel free to explore and share your experience.

I expect to keep using Swarm while looking into adding memory and exploring other orchestration schemes. It’s been fun so far.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*S4g9b7Lgu1WNCxTzmye7bw.png)


## Introduction: The Challenge of Multi\-Agent Systems

Developers often work with single\-purpose chatbots, which are straightforward but limited in scope and functionality.

However, real\-world applications often demand more robust and sophisticated systems involving multiple specialized AI agents working harmoniously.

Think of a movie purchasing system: one agent determines the pricing based on the movie’s title and release year, another manages the shipping logistics to ensure prompt delivery, and a supervisor orchestrates the entire process to maintain a seamless workflow and error\-free execution.

By utilizing such a collaborative approach, these systems can tackle more complex tasks and provide enhanced user experiences.

This article dives into how OpenAI’s experimental Swarm framework provides a practical and efficient solution for building multi\-agent orchestrations, making challenging tasks manageable and intuitive.


## Overview of OpenAI’s Swarm Framework

Swarm is OpenAI’s experimental framework for multi\-agent orchestration. It introduces:

* **Agent Collaboration**: Multiple agents, each with specific goals, work together.
* **Shared Context Management**: Enables agents to access and modify a centralized context.
* **Dynamic Function Handling**: Facilitates inter\-agent communication and function calls.

While labeled as experimental and not for production, Swarm is a great educational tool for exploring advanced AI system design. However, such a label underestimates its potential; Swarm’s architecture and patterns demonstrate a flexibility and robustness that can inspire innovative applications beyond its current scope.


## Setting Up the Environment

First, install the necessary libraries and configure the environment:


```python
from openai import OpenAI
from swarm import Swarm, Agent
from swarm.types import Response, Result
```

```python
client = OpenAI()
crew = Swarm(client=client)
model = "gpt-4o-mini"  # Our choice of model
```
This sets up the Swarm instance with OpenAI’s client and the desired model.


## Defining the Shared Context

Shared context ensures all agents can access the same information, enabling seamless collaboration.


```python
context_variables = {
   "query": "",
   "title": None,
   "year": None,
   "price": None,
   "sales_done": False,
   "shipping_done": False,
   "transaction_id": None,
   "timestamp": None,
}
```
Each variable is initialized and updated dynamically during the transaction process.


## Creating Specialized Agents


### The Supervisor Agent

This agent orchestrates the flow, ensuring all steps are completed in order.


```python
supervisor_agent = Agent(
   name="supervisor",
   model=model,
   instructions="""
      GOAL:
      You help the user buy a movie and ship it to their address.
```

```python
      FOLLOW THIS FLOW STRICTLY:
      1. Extract the movie title and year from the query
      2. Call buy_movie with the title and year
      3. WAIT for the price to be computed
      4. Only after the price is set, proceed with ship_movie
   """,
   context_variables=context_variables,
   functions=[buy_movie, ship_movie]
)
```

### The Sales Expert Agent

Handles movie pricing using the `get_price` function.


```python
buy_movie_agent = Agent(
   name="buy_movie_agent",
   model=model,
   instructions="""You are a sales agent. Your ONLY task is to get the price for a movie using the get_price function.
```

```python
IMPORTANT: You must ALWAYS call get_price with the title and year provided in the context variables.
```

```python
DO NOT proceed with any other actions.
DO NOT engage in conversation.
JUST call get_price immediately.""",
   context_variables=context_variables,
   functions=[get_price]
)
```

### The Shipping Pro Agent

Responsible for shipping the purchased movie.


```python
ship_movie_agent = Agent(
   name="ship_movie_agent",
   model=model,
   instructions="""You are a shipping agent. Your task is to ship the movie to the customer's address.
```

```python
   IMPORTANT:
   - Only ship if the movie has been purchased
   - You must call process_shipping to handle the shipping process
   - DO NOT engage in conversation
   - DO NOT ask for the address (it's already in context_variables)
   - JUST call process_shipping immediately""",
   context_variables=context_variables,
   functions=[process_shipping]
)
```

## Debugging with Sequence Diagrams

Debugging multi\-agent systems can be challenging. Sequence diagrams provide a visual representation of agent interactions and state changes.

Here are some examples. In the first case, we can easily follow the order as it moves from one agent to the next.

If the user requests include a movie and date, the Supervisor agent will continue with the rest of the Swarm.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*S4g9b7Lgu1WNCxTzmye7bw.png)

Other requests will be ignored.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*61_PCv5sgPGAmVQinr4btA.png)


## Pro Tips for Debugging Multi\-Agent Systems

1. **Visual Flow Tracking**: Sequence diagrams simplify debugging by visually representing agent interactions.
2. **State Monitoring**: Ensure context variables change as expected.
3. **Timing Insights**: Look for unusual delays between steps.
4. **Activation Checks**: Verify that each agent is properly triggered.


## Potential Applications and Next Steps

The patterns demonstrated here can be applied to various domains:

* **Customer Service**: Automate multi\-step support processes.
* **Booking Systems**: Coordinate reservation, payment, and confirmation.
* **Educational Tutoring**: Implement multi\-agent learning workflows.

What would you build with a multi\-agent system? Share your ideas in the comments!

This guide showcases real\-world implementation using OpenAI’s Swarm framework. While the framework is experimental, the principles and patterns can be applied universally to multi\-agent system design.


