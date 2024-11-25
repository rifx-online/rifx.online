---
title: "Which AI Agent framework should i use? (CrewAI, Langgraph, Majestic-one and pure code)"
meta_title: "Which AI Agent framework should i use? (CrewAI, Langgraph, Majestic-one and pure code)"
description: "The article discusses various AI agent frameworks including CrewAI, LangGraph, AutoGen (Magentic-One), and pure code approaches. It highlights the evolution of large language models into AI agents capable of complex reasoning and task execution through components like memory, planning, and tools. Each framework has distinct strengths: CrewAI is user-friendly for beginners, LangGraph offers flexibility for advanced users, AutoGen incorporates specialized agents for IT tasks, and pure code allows for high customization but lacks community support. The article concludes that selecting a framework depends on specific needs such as ease of use, complexity, and community support."
date: 2024-11-25T15:00:22Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*WeIWsSVJkAL_KZlfwz4QBw.png"
categories: ["Programming", "Machine Learning", "Natural Language Processing"]
author: "Rifx.Online"
tags: ["CrewAI", "LangGraph", "AutoGen", "agents", "frameworks"]
draft: False

---




With the advancement of large language models, it is now possible for artificial intelligence models to reason through a problem. At the start, we believed that the models would not be able to accomplish our works since they seemed to be only chat\-bot versions of search engines and we were able to trick these models with simple reasoning, but this has become harder and harder. These large language models can now think through steps and complete much more complex tasks than simply answering questions.



Large language models are trained by predicting the next token from previous tokens. Tokens can be words, characters or group of characters known as subwords. From this structure, Openai developed the chatbot called ChatGPT. This chatbot is able to answer questions and it has vast knowledge since it was trained on a vast network scraped from the internet. And with the improving it became better and better at reasoning. And an idea was born. What if we gave tools to an LLM to perceive its environment and take actions to achieve specific objectives. This type of structure is called an AI agent.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*CnzI5_2lmlGkMFDqg6IcyA.png)

Nvidia defines an agent as a system that can use an LLM to reason through a problem, create a plan to solve the problem, and execute the plan with the help of a set of tools. The components of an AI agent are memory, planning, prompt, knowledge and tools.

**1\. Memory**

* As we know, agents complete a complex task by first breaking down into sub\-tasks than executing tools to finish sub\-tasks. For this, the model needs to remember its previous steps.

**2\. Planning**

* Complex problems often need a chain\-of\-thought approaches.

**3\. Prompt**

* Prompts are instructions that give information to LLM about its objective, behavior and plan.

**4\. Knowledge**

* Without the knowledge of the field, agent can not solve or even understand the task. So either the LLM must be fine\-tuned to have the knowledge or we can create a tool to extract the knowledge from a database.

**5\. Tools**

* Executable functions, APIs or other services that allow agents to complete their duties.

But the real strength of an AI agent comes from the collaboration of different agents. This kind of structure is called multi\-agent structure. In this type of an architecture, like a team the structure contains several members with specific skills and particular job to do. For high efficiency more specific roles and objectives the better. Agents can have different roles, each contributing to the overall goal of the crew.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*rI-hmUm-oYDCh9qq)

Big tech companies are continually advancing multimodal and text generation models to the point where pre\-training custom models is becoming both unnecessary and prohibitively expensive. As a result, the development of AI solutions in the near future is likely to focus on three main areas:

* 60% Flow Engineering
* 35% Fine\-Tuning
* 5% Prompt Engineering

Although AI agents represent the pinnacle of the AI community, they perform best when each agent is assigned a specific role and operates within a well\-defined workflow. Leveraging AI agent frameworks is the most effective way to achieve this structured collaboration.

Many frameworks have emerged to make AI agents accessible to all people. In this article, I am going to go through the frameworks: crewAI, langgraph, autogen(majestic one extension) and at the end we will go through building an agent without any frameworks.


## 1\. CrewAI

crewAI is an open source multiagent orchestration framework created by João Moura. This Python\-based framework leverages role\-playing autonomous AI agents that work together as a cohesive assembly or “crew” to complete tasks.

The slogan behind crewAI is, “Become an Multi\-Agent Expert in Hours”. It is the easiest framework to work with. This has its upsides and downsides. Being a high\-level framework makes it easier to build the general structure. On the other hand, not knowing what is happening behind the framework methods makes tweaking the general process much harder and possible errors are harder to notice and debug.

Creating an agent with crewAI framework requires four attributes:

* Role


> Defines agent’s function within the crew

* Goal


> The individual objective that the agent aims to achieve

* Backstory


> Provides context to agent’s role and goal, enriching the interaction and collaboration dynamics

* Tools


> Set of capabilities or functions that the agent can use to perform tasks

With CrewAI framework it’s much easier to get an agent up and running with just a few lines of very simple code. It’s perfect for beginners or those who want to get things done without a setup hassle.

Crewai, a scalable, data\-driven framework, excels in handling large\-scale systems and offers a simple API for easy integration with existing systems. It also supports deployment on cloud platforms such as **AWS** and **Azure**, though it has limited support for custom models which is critical with companies that have to work with open source models and is also less flexible than Autogen. Another drawback of crewAI is that it does not handle streaming function calling **which can be a huge problem.**


## 2\. LangGraph

LangGraph is a framework built upon the Langchain library and uses its many functions and tools. LangGraph utilizes graphs to create a multi\-agent or single agent structure. Graph represents the general flow of the architecture. LangGraph is a tool designed to visualize and manage complex relationships and workflows involving language models by creating a graph\-like representation of component interactions.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*_Doc5NI81aXnNpRKMleSuQ.png)

Compared to crewAI, LangGraph is fairly a low\-level framework. Therefore it is a bit harder to implement than crewAI. But low\-level structure allows us to tweak the process and generate much more complex flows required for our work. Even though the framework is known for its ease of use, scalability, and integration with popular AI libraries like TensorFlow, PyTorch, and Keras, it has limited support for distributed systems such as Amazon or Azure.

LangGraph also offers Langsmith which is used for monitoring your LLMs. Using LangSmith you can monitor what your agents produced and what was their roadmap. The implementation is very simple. Simply adding your LangSmith api key to the environment will let you monitor all your inputs and outputs in your graph. But you have to take note that these monitoring is stored in the internet which may not be viable to some use cases. For those use cases LangFuse can be implemented which is much more complex.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*jylIemjQodxh8jsynwq92w.png)


## 3\. AutoGen(Magentic\-One)

AutoGen is a framework developed by Microsoft and Magentic\-one is newly released extension of AutoGen. It features an Orchestrator agent that manages task planning and coordination among four specialized agents: WebSurfer, FileSurfer, Coder, and ComputerTerminal. By combining these agents, it is possible to accomplish countless tasks in the IT industry.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*FF-bJ_RnigMEy66a4UOdbQ.png)

Magentic\-One consists of the following agents:

* **Orchestrator:** The lead agent responsible for task decomposition, planning, directing other agents in executing subtasks, tracking overall progress, and taking corrective actions as needed
* **WebSurfer**: An LLM\-based agent proficient in commanding and managing the state of a Chromium\-based web browser. For each request, the WebSurfer performs actions such as navigation (e.g., visiting URLs, performing searches), interacting with webpages (e.g., clicking, typing), and reading actions (e.g., summarizing, answering questions). It then reports on the new state of the webpage. The WebSurfer relies on the browser’s accessibility tree and set\-of\-marks prompting to perform its tasks.
* **FileSurfer**: An LLM\-based agent that commands a markdown\-based file preview application to read local files. It can also perform common navigation tasks such as listing directory contents and navigating through them.
* **Coder**: An LLM\-based agent specialized in writing code, analyzing information collected from the other agents, and creating new artifacts.
* **ComputerTerminal**: Provides access to a console shell for executing programs and installing new libraries.

Magentic\-One is modular and adaptable, allowing easy integration of various language models. The system has demonstrated competitive performance on benchmarks like GAIA, AssistantBench, and WebArena, without requiring core modifications. For example, GAIA is made of more than 450 non\-trivial question with an unambiguous answer, requiring different levels of tooling and autonomy to solve. The framework also includes safety measures for dangerous autonomous actions.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*yhY-sdhDaBnz3wd8Tv9AFg.png)

While the default multimodal LLM used for all agents is GPT\-4o, Magentic\-One is model\-agnostic, allowing the integration of heterogeneous models to support different capabilities or meet different cost requirements. Different LLMs can be integrated, however strong reasoning model is recommended for obvious reasons.


## 4\. Pure Code Agent

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*LxigG3MHrjJjYgs4xPc7sw.gif?output=gif&n=50)

Final approach involves building pure code agents entirely from scratch, bypassing frameworks entirely. This approach provides a high level of customization, especially for simple workflows. However with the increase of the workflow complexity, it becomes extremely difficult to implement. Building from scratch might be good learning opportunity however, it is very time consuming and there would be no community support when there is an issue.


## Final Comparison

From various sources it seems all of the frameworks have their own strong suits:

· **For Software Development**: LangGraph — Best suited for tasks involving code generation and complex multi\-agent coding workflows.

· **Best for Newbies**: CrewAI — User\-friendly, making it ideal for those new to multi\-agent AI without complex setup requirements.

· **Best for Complex Tasks**: LangGraph — Offers high flexibility and is built for advanced users, allowing custom logic and orchestration.

· **Open\-Source LLMs**: LangGraph — Integrates well with open\-source LLMs and supports various APIs, unlike some other frameworks. Even CrewAI is fine.

· **Best community support:** AutoGen has decent community support helping you with out\-of\-the\-way issues

· **Ready from Word Go**: CrewAI — Quick to set up and intuitive, suitable for demos or tasks that require rapid agent creation. Even Swarm and Magentic\-One are pretty good but don’t have enough community support

· **Cost\-Effective**: Magentic\-One — Comes with a pre\-packaged setup and a generalist approach, potentially saving on initial costs. Even Swarm and CrewAI can be considered.


## Sources

\[1] Introduction to LLM Agents, [https://developer.nvidia.com/blog/introduction\-to\-llm\-agents/](https://developer.nvidia.com/blog/introduction-to-llm-agents/)

\[2] CrewAI homepage, <https://www.crewai.com/>

\[3] What is crewAI?, [https://www.ibm.com/think/topics/crew\-ai](https://www.ibm.com/think/topics/crew-ai)

\[4] Comparative Study of LangGraph, Autogen, and Crewai for Development of Multi\-Agent System: Detailed Review, [https://readmedium.com/comparative\-study\-of\-langgraph\-autogen\-and\-crewai\-for\-development\-of\-multi\-agent\-system\-detailed\-2aa8ebdc8e88](https://readmedium.com/comparative-study-of-langgraph-autogen-and-crewai-for-development-of-multi-agent-system-detailed-2aa8ebdc8e88)

\[5] Magentic\-One, AutoGen, LangGraph, CrewAI, or OpenAI Swarm: Which Multi\-AI Agent Framework is Best?, [https://readmedium.com/magentic\-one\-autogen\-langgraph\-crewai\-or\-openai\-swarm\-which\-multi\-ai\-agent\-framework\-is\-best\-6629d8bd9509](https://readmedium.com/magentic-one-autogen-langgraph-crewai-or-openai-swarm-which-multi-ai-agent-framework-is-best-6629d8bd9509)

\[6] AI Agentic Frameworks, [https://readmedium.com/ai\-agentic\-frameworks\-2022fe43e78a](https://readmedium.com/ai-agentic-frameworks-2022fe43e78a)

\[7] Comparative Study of LangGraph, Autogen, and Crewai for Building Multi\-Agent Systems, [https://pratikbarjatya.medium.com/comparative\-study\-of\-langgraph\-autogen\-and\-crewai\-for\-building\-multi\-agent\-systems\-0e7e47f9078e](https://pratikbarjatya.medium.com/comparative-study-of-langgraph-autogen-and-crewai-for-building-multi-agent-systems-0e7e47f9078e)

\[8] LangGraph homepage, <https://www.langchain.com/langgraph>

\[9] LangSmith homepage, <https://www.langchain.com/langsmith>

\[10] Comparing Bespoke Code Agents and Framework\-Based Approaches, [https://timothy\-urista.medium.com/comparing\-bespoke\-code\-agents\-and\-framework\-based\-approaches\-92bb609ab711](https://timothy-urista.medium.com/comparing-bespoke-code-agents-and-framework-based-approaches-92bb609ab711)

\[11] Magentic\-One: A Generalist Multi\-Agent System for Solving Complex Tasks, [https://www.microsoft.com/en\-us/research/articles/magentic\-one\-a\-generalist\-multi\-agent\-system\-for\-solving\-complex\-tasks/](https://www.microsoft.com/en-us/research/articles/magentic-one-a-generalist-multi-agent-system-for-solving-complex-tasks/)

\[12] What is an LLM Agent and how does it work?, [https://readmedium.com/what\-is\-an\-llm\-agent\-and\-how\-does\-it\-work\-1d4d9e4381ca](https://readmedium.com/what-is-an-llm-agent-and-how-does-it-work-1d4d9e4381ca)

\[13] GAIA leaderboard, [https://gaia\-benchmark\-leaderboard.hf.space/](https://gaia-benchmark-leaderboard.hf.space/)

\[14] Top 5 Frameworks for Building AI Agents in 2024, [https://www.analyticsvidhya.com/blog/2024/07/ai\-agent\-frameworks/](https://www.analyticsvidhya.com/blog/2024/07/ai-agent-frameworks/)

\[15] A Quick Review of The Most Popular AI Agent Frameworks (June 2024\), [https://readmedium.com/a\-quick\-review\-of\-the\-most\-popular\-ai\-agent\-frameworks\-june\-2024\-ce53c0ef809a](https://readmedium.com/a-quick-review-of-the-most-popular-ai-agent-frameworks-june-2024-ce53c0ef809a)

\[16] Exploring LangChain, LangGraph, and Crew AI: Tools to Revolutionize Language Models and Team Productivity, [https://readmedium.com/exploring\-langchain\-langgraph\-and\-crew\-ai\-tools\-to\-revolutionize\-language\-models\-and\-team\-71cb80a15e63](https://readmedium.com/exploring-langchain-langgraph-and-crew-ai-tools-to-revolutionize-language-models-and-team-71cb80a15e63)

\[17] Microsoft Magentic\-One: New Multi\-AI Agent Framework, [https://readmedium.com/microsoft\-magnetic\-one\-new\-multi\-ai\-agent\-framework\-7fd151b81cd7](https://readmedium.com/microsoft-magnetic-one-new-multi-ai-agent-framework-7fd151b81cd7)

\[18] LangGraph\- Develop LLM powered AI agents with LangGraph, [https://www.udemy.com/course/langgraph/?couponCode\=LETSLEARNNOW](https://www.udemy.com/course/langgraph/?couponCode=LETSLEARNNOW)


