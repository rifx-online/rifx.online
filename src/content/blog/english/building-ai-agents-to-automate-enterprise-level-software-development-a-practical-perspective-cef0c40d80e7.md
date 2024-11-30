---
title: "Building AI Agents to Automate Enterprise-Level Software Development: A Practical Perspective"
meta_title: "Building AI Agents to Automate Enterprise-Level Software Development: A Practical Perspective"
description: "The article discusses the development of AI agents utilizing Large Language Models (LLMs) to automate enterprise-level software development. It highlights challenges such as token consumption, context management, and error handling, while offering practical solutions and recommendations. Key considerations include selecting appropriate agent frameworks (like AutoGen and LangChain), optimizing conversation lengths, managing tool calls, and ensuring code indentation accuracy. The authors emphasize the importance of structured workflows and the need for effective dependency resolution to enhance the reliability and efficiency of AI-driven software development processes."
date: 2024-11-30T13:59:57Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*xdWaHAr-aHpA3isnnexHPA.png"
categories: ["Programming", "Machine Learning", "Autonomous Systems"]
author: "Rifx.Online"
tags: ["LLMs", "AutoGen", "LangChain", "token", "optimization"]
draft: False

---




Randy Zhang and Shamin Aggarwal

Agentic AI is a software application that is based on Large Language Models (LLMs) to automate tasks by simulating human\-like reasoning and decision\-making. It has shown a remarkable capability in automating software development for small and simple scripts \[1]. Can AI agents be used to automate enterprise level software development? What kind of challenges would we run into in a large and complex software development environment?

Enterprise\-level software projects are typically large\-scale software development initiatives that are designed to address complex business needs. Such a repository may consist of a large number of long scripts, complex functional dependencies, long list of software features, and robust operating requirements. This article will try to address some of the challenges that we have faced in our project and document the solutions that we came up with. These practical tips and recommendations may be helpful to you when you implement a similar AI project yourself.


## General Observations

LLM engineering in general may present specific considerations or challenges in application development, which may be amplified in an agentic AI environment. An AI agent is essentially an LLM with a pre\-defined purpose and abilities, such as a specific ‘system message’ and set of ‘tools’. We can also define specific conversation ‘flows’ for each agent, to control the steps that they follow. For enterprise software development this typically boils down to having different agents for research/planning, codebase exploration, coding, validation/testing, orchestration/reporting, etc. By compartmentalizing the tasks and properly defining inter\-agent flows to handle different scenarios, we can improve the reliability of the overall workflow, reduce token consumption and also increase visibility/traceability to easily understand the actions performed.

The following is a short list of general observations of LLM engineering when it comes to use of AI agents for enterprise software development.

**Token Consumption Optimization**

The cost of using LLMs is proportional to the number of tokens (words or parts of words) in both the prompts and the responses. When developing automation workflows, we constantly asked ourselves, “How can we accomplish this task by using the least number of words?” In coding with AI agents, this translates into figuring out how much information and existing code we need to provide to the LLM for sufficient context. Token consumption compounds as a conversation goes on, so striking a balance between the number and complexity of messages is crucial.

**Context Window Management**

Compared to humans, LLMs have very small short\-term memory, which is defined as the context window length, or just context length. This length impacts an LLM’s ability to process, understand, and generate text. What is more important is that there is an empirically observed “effective context length”, the number of tokens after which the accuracy of an LLM drops significantly. The effective context length is typically much lower than the advertised context length. A larger effective context length allows an LLM to perform better as it is able to process a larger amount of information ‘effectively’ when giving a response. As a result, such an LLM can handle more complex inputs, maintain higher coherence in long conversations, and ultimately generates more accurate responses. This is why, rather than relying on utilizing the entire context window length of a LLM, it is generally observed that a multi\-agent workflow with proper compartmentalization and limited conversation lengths is much more reliable and cost efficient.

**Catching Hallucinations**

This is often the toughest challenge. It is important to experiment with your use case to identify common mistakes your chosen LLM might make. Solutions may vary; some can be solved with prompt engineering, others might require implementing special checks and corrective prompts, and some could necessitate changes in the workflow or using better “tools.” Situations involving numerical numbers or lengthy conversations are more prone to errors, so it is best to avoid such scenarios as much as possible.

**Infinite Loops**

LLMs can sometimes get stuck in loops, performing the same action repeatedly or cycling between a few actions. This is especially true when having them code and debug on their own. An AI agent might make a change to the code, run it, see the same error, and then attempt the same change again. While we have not found a fool\-proof solution, detecting such situations and instructing the agent to try something else often works, or at least prevents useless token consumption.

**Handling Line Numbers**

LLMs are notoriously not good at handling numbers, for example ChatGPT\-4o cannot even tell how many r’s there are in the word ‘strawberry’. In coding, this manifests as mistakes with line numbers in code files. Ideally, we would want agents to specify which lines they want to edit instead of rewriting entire code blocks. However, we have noticed that in long conversations, the coder agent tended to make mistakes with line numbers. We tackled this by limiting conversation lengths, effectively resetting the agent’s memory when a conversation runs too long, and then letting it continue from where it left off.


## Agent Framework Selection

To speed up the agent development process, we can use agent frameworks to quickly prototype a project. Agent frameworks such as AutoGen and LangChain enable developers to create workflows where AI agents can plan, generate, modify, and debug code autonomously. When we kicked off this project, we needed to choose an agent framework that would best suit our needs. We evaluated several options, including AutoGen, LangChain, and a few others. After some tinkering, we decided to go with AutoGen.

**AutoGen**, developed by Microsoft, is a library for automating code generation and workflow management using LLMs. It is particularly suited for rapid prototyping, allowing us to quickly experiment with different agentic workflows without getting bogged down in complexity. Here’s what we liked about it:

· Ease of Use: It was straightforward to set up and get going.

· Rapid Prototyping: Allowed us to test ideas quickly.

· Sufficient Functionality: Had all the foundational components we needed for our proposed workflow

We also looked into LangChain, a popular library that focuses on creating modular and extensible pipelines for LLM\-based applications. It is good for building refined conversational agents and data retrieval systems.

**Pros for LangChain:**

· Highly Modular: Offers fine\-grained control over components.

· Extensible: Easy to integrate with different tools and APIs.

· Active Community: Lots of resources and community support.

**Cons for LangChain:**

· Steeper Learning Curve: Takes more time to get up to speed.

· More Setup Required: Not as quick to prototype as AutoGen.

Now that we have wrapped up the project, here is what we found beneficial about AutoGen:

· Simplicity: We did not have to write a ton of boilerplate code.

· Specialized Functionalities: Unlike LangChain, AutoGen was written specifically to assist in code generation, and has extra functionalities e.g. executing generated code.

· Focus on Workflow: Allowed us to concentrate on designing the agent workflow rather than the underlying mechanics.

· Quick Iterations: Made it easy to adjust and test different approaches.

For future, more complex projects, especially at an enterprise level, we would recommend giving LangChain a serious look. As our project grew, we started to miss the fine\-grained control and additional functionalities that LangChain offers. While AutoGen was great for getting started, LangChain might have helped us achieve better results in the long run.


## LLM Selection

The choice of LLM is a key decision that will affect many aspects of development beyond the general performance of the agentic workflow; the prompts, context window length, types of hallucinations, tool call formats, max conversation lengths, etc.

For our project we selected the OpenAI LLMs, which in our testing perform better than other comparable foundational models, specifically those from Meta and Google. Smaller LLMs like ChatGPT\-3\.5 that have context windows in the range of 4k were too small to handle the ‘main tasks’ of code exploration, planning and coding, as enterprise codebases have long and complex modules that require context windows at least in the range of 32k, if not 128k.

Anthropic’s Claude 3\.5 Sonnet model does perform better for coding related tasks compared to GPT\-4o, however OpenAI’s API has a more robust set of functionalities for tool calling, structured outputs, etc. which make it much easier to use their LLMs as AI agents.


## Token Limits

The power of AI agents lies with its iterative decision making and collaboration among agents, which as a side effect drive up the token usage. This is amplified with an enterprise level software repository. There are two types of tokens, both of which add to the cost:

· Prompt Tokens: Tokens used in the input prompts users (through agents) send to the model.

· Response Tokens: Tokens generated by the model in its responses.

The LLM API we used imposes token rate limits, with restrictions placed on the number of tokens we could consume per minute, hour, and day. During codebase exploration, agents consume a lot of tokens reading long code scripts. Hitting token limits during this process would cause our workflow to break, so we needed a solution. We implemented a token tracking system to monitor consumption in real\-time. Before sending a prompt, we calculate the expected token usage and ensure it would not exceed the limits. If it is close, we would introduce a sleep timer to pause the agent until it was safe to proceed.

In our implementation, we estimate the token usage and pause when necessary. In such a way we kept our agents running smoothly without hitting the API limits. Here is a simplified version of our token management code to control the message length so that we stay below the minute limit:



If a rate limit applies to both prompt and response tokens, the only fool\-proof way of ensuring you never go over the limit is that you assume that any response could be as long as the maximum possible length, which is the context window length minus the prompt length. This is because there is no way to know beforehand how long the response could be for any given prompt. Practically this will result in a lot of unnecessary sleep timers as most responses will actually be much smaller, so in this case it is better to prioritize optimizing conversation length over controlling the message length.

Even if you do not have any token limits it is still very important to optimize token consumption by limiting the conversation length. The challenge though is that, as we reduce the conversation length we increase the ‘work’ performed per message, thus bringing down the average accuracy/reliability. You may have to experiment to strike a balance between the optimized conversation length and accuracy based on your chosen LLM. Nevertheless, generally speaking, we get a lower token cost when we optimize for conversation length.


## Optimizing Conversation Lengths

The conversation length between agents can be optimized in multiple ways for agentic workflows, here are two examples:

**Limiting the number of agents in each conversation**

Potentially every message from a given agent in a conversation could be read by every other agent in an any\-to\-any pattern, thus increasing the token consumption exponentially, not linearly. This means that a conversation between 3 agents could consume twice as many tokens as a conversation between 2 agents.

In our implementation we opted to only use single\-agent conversations, also called user\-agent conversations, where none of the agents directly ‘converses’ with one another. We have independent conversations with every agent through a ‘user proxy’ agent, and insert the final response from an agent to the ‘initialization prompt’ of the next agent in the workflow.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*pjtD1D-HADn8yQV5ivb1tg.png)

**Limiting the number of messages/steps per agent**

If we reduce the number of agents in a conversation, we are essentially relying on fewer agents to do the same work. In our implementation, for example, we designate the Coder agent to play multiple roles. One downside with this arrangement is that this made it difficult to predict the Coder agent’s conversation length and could lead to scenarios like excessive re\-planning, infinite debugging loops, etc. We needed a way to allow the Coder to break out of such scenarios or interrupt it externally. One way of implementing a ‘break out’ is by allowing the Coder to request ‘clarifications’ from the planning agents. This can be done by conventional prompt engineering or writing tool calls for invoking the planning agents.

External interruptions can be implemented by detecting when an agent is stuck in a loop or its conversation length has exceeded a pre\-set maximum. In such scenarios we then prompt the Coder agent to give a summary of all the code it has written or modified so far, and then clear the conversation history. The conversation is then ‘resumed’ by appending the generated summary to Coder’s initialization prompt to simulate a continued Coder conversation.


## Tool Calls

AI agents take advantage of software functions or tools to carry out specific tasks to assist LLMs in problem solving. Tools allow agents to perform actions beyond text generation. In the context of software development, we generally require at least 2 sets of tools:

· File Operations: Reading, writing, modifying files.

· Executing Code: Running scripts or code snippets, CLI commands, etc.

Having a robust library of tools for LLM agents is crucial, especially for software development tasks. These tools can be overlooked sometimes as they are deceptively simple. Tip: try thinking how you would explore a codebase using just CLI commands.

We should try to identify as many actions as we can, that a human software developer performs on an IDE, and make sure that an equivalent is available to the LLMs. One example of this is the ‘Go to Definition’ functionality of VS Code, which allows developers to easily go to the definition of an imported/referenced symbol (function, class, etc.).

Every time an agent decides to use a tool, it consumes tokens. Frequent or verbose tool calls can quickly eat up your token quota.

Based on the tool it could consume a lot of tokens in the tool call request, response, or both:

· Requesting the Tool: Writing long code scripts would consume a lot of ‘LLM response’ tokens.

· Process the Response: Interpret the tool’s output, which if lengthy would consume a lot of ‘prompt’ tokens, ex. when reading long code scripts.

We can streamline our tool interfaces to be more token\-efficient:

· Standardized Commands: Use concise, predefined commands instead of lengthy natural language requests.

· Minimal Responses: Design tools to return only essential information.

· Flexibility: Construct tool calls with optional functionalities for providing more control and flexibility (see an example below).

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*3vQgU0k8dW0Xi9CRunaAzw.png)

Even with a simple tool call for reading files, we can include the ability to specify a range, to allow AI agents to read specific lines from a file, reducing unnecessary token consumption. Moreover, we opted to include line numbers in the tool response to further facilitate this.


## Dependency Resolution

Generally speaking, a dependency is some code written outside the current script/code block which is being imported/referenced. Conventionally though dependencies refer to external libraries or modules that your code relies on. Understanding how they work is essential to be able to use them properly.

One useful tool that we wrote for the AI agents (and have not observed being used in the open\-source community much) is for exploring the dependencies of a given code block/script. This includes both external libraries as well as inter\-module dependencies inside the codebase itself. This gave a lot of autonomy to the agents by allowing them to recursively check out the definitions of functions, classes, etc. being referenced somewhere and understand the codebase in depth.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*BULGZmVNe5OgOJlNK-dxOA.png)


## Indentation Handling

In Python, indentation is not just for readability, it is syntactically significant. Misaligned indentation can lead to Indentation Errors, causing programs to crash.

AI models may struggle with consistent indentation because they rely on a certain ‘number’ of spaces, and LLMs don’t do well with numbers. This problem is further exasperated in enterprise software development because of:

· Context Limitations: They might lose track of nesting levels.

· Copy\-Paste Errors: When code is generated over multiple turns, consistency can be lost.

· Formatting Issues: Tabs vs. spaces can cause problems.

There are a few options to handle the agent indentation issue:

1\. Strict and Precise Prompting

a. Pros: Encourages the model to maintain correct indentation.

b. Cons: Not foolproof; increases token usage.

2\. Post\-Processing

a. Pros: Can correct minor issues automatically.

b. Cons: Might not fix logical indentation errors.

3\. Code Parsers

a. Pros: Validates code before execution.

b. Cons: Adds computational overhead.

We implemented a deterministic validation step using the ‘ast’ python library to parse generated code and check for syntax errors. By integrating this validation step, we significantly reduced runtime errors due to indentation issues, making our agents more reliable. Below is a simplified version of the same:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*IH5aN_mDFTGKWdrKvSEWZA.png)


## Summary

Developing agents to perform daily tasks is becoming the hottest trend in AI. In this article, we documented our experiences of building AI agents to automate an enterprise level software development project. We started with our general observations on building AI agents. We shared our lessons and learnings on key considerations for agent development, such as agent development framework selection, LLM selection, optimizing and controlling tokens, handling tool calls, code dependency resolution, and code indentation requirements handling. As AI agents are increasingly being used to automate human tasks and workflows, it is reasonable to expect that we will see more and more advancement and use cases.

**About the Authors**

Randy Zhang, PhD, is a principal architect at Cisco Systems. He holds 3 US patents and is an author of two books and over 30 other publications. He is actively working on AI projects for networking use cases. Randy is a frequent speaker at industry conferences and can be reached via LinkedIn, <https://www.linkedin.com/in/randyzhang/>, and github, <https://github.com/ranzhang/>.

**Shamin Aggarwal,** MS Computer Science (spec. ML), a software engineer passionate about AI and automation. He specializes in developing agentic workflows for software development and enjoys exploring new technologies. LinkedIn: <https://www.linkedin.com/in/shamin1998/>

**References**

\[1] Randy Zhang, Automated networking script development with AI agents, [link](https://github.com/ranzhang/ai-codegen-routers)


