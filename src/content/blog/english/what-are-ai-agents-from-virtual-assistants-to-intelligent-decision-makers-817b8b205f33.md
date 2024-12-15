---
title: "What are AI Agents: From Virtual Assistants to Intelligent Decision-Makers"
meta_title: "What are AI Agents: From Virtual Assistants to Intelligent Decision-Makers"
description: "The article provides an overview of AI agents, emphasizing their evolution from traditional chatbots to sophisticated agentic systems. It defines AI agents as computational entities capable of autonomous decision-making, interaction with their environment, and goal-oriented behavior. The discussion highlights the transition from heuristic-based chatbots to LLM-powered systems, introducing techniques like retrieval-augmented generation (RAG) and prompt engineering to enhance AI capabilities. Key components of AI agents include their cognitive brain, action, and perception modules, which enable them to process information and adapt to their environments. The article concludes by noting the ongoing development and potential applications of AI agents in automating workflows and improving decision-making within organizations."
date: 2024-12-15T01:15:21Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*Ly9kX53GT5njOFvy"
categories: ["Chatbots", "Autonomous Systems", "Machine Learning"]
author: "Rifx.Online"
tags: ["agents", "chatbots", "RAG", "prompt", "modules"]
draft: False

---







### A Ground\-Up Guide to Understanding AI Agents

The recent shift from LLM\-powered chatbots to what the field now defines as agentic systems or agentic AI can be summarized with a good old saying: “Less talk, more action.”

Keeping up with advancement can be daunting, especially if you already have an existing business to run. Not to mention that the speed and complexity of advancement can make you feel like it’s the first day of school.

This piece provides an overview of AI agents based on their components and characteristics. The introductory section covers the components that form the term “AI agent” to create an intuitive definition. After establishing a definition, the following sections include an exploration of the evolution of the form factor of LLM applications, notably from traditional chatbots to agentic systems.

Overall, the key aim is to understand why AI agents are becoming increasingly important in the field of AI application development and how they differ from LLM\-powered chatbots. By the end of this guide, you’ll have a more thorough understanding of AI agents, their potential applications, and how they might impact workflows in your organization.


> If you are technical and would prefer getting hands on, click **[here](https://mdb.link/ai_agent_gen_ai_showcase)** to access the best repository for AI developers and builders


## What is an AI agent?



The two components of the term “AI agent” can give us a deeper understanding of its meaning. Let’s start with the easy one: artificial intelligence, also known as AI.

[**Artificial intelligence (AI)**](https://mdb.link/ai_explainer) **refers to non\-biological forms of intelligence that are loosely based on the computational mimicry of human intelligence and aim to execute tasks that traditionally require human intellect**. The primary method of providing intelligence to computational systems is through machine learning and deep learning techniques, where computer algorithms — specifically, layers of neural networks — learn patterns and features from provided datasets. AI systems are developed to tackle detection, classification, and predictive tasks, with content generation becoming a prominent problem domain due to the effectiveness of transformer\-based foundation models. In some cases, these AI systems match human performance, and in particular scenarios, they exceed it.

The second component, “agent,” is a familiar term used in both technological and human contexts, and understanding both perspectives can help clarify the concept of AI agents.

1. **In computer science and technology**: The term “agent” in computer science\-based topics refers to an entity (software agent) with environmental awareness and perception enabled via sensors and an ability to act within its environment through action mechanisms. In this context, an agent is a computational system that:
* Has **autonomy** to make decisions and take actions.
* Can **interact** with its environment.
* Can **pursue goals** or carry out tasks.
* May **learn** or **use knowledge** to achieve its objectives.

2\. **In human context:** The term “agent” typically refers to a person who acts on behalf of another person, group, or organization, usually playing the role of a proxy for decision\-making, information gathering, and sharing. An agent’s role and responsibilities could include:

* Making decisions or taking actions for someone else with permitted authorization from the party being represented.
* Formally representing a person in transactions and contractual scenarios, again, with authorization from the primary party.
* An intermediary between multiple parties.

To understand AI agents, we must combine the characteristics of both technological and human contexts where the term “agent” is used while applying the guiding principles of artificial intelligence. This combination allows us to understand how and why AI agents are uniquely suited to perform tasks that typically require human intelligence and agency.

Based on this foundational context of the term AI agent, we can form the definition of AI agents.

**An AI agent is a computational entity with an awareness of its environment that’s equipped with faculties that enable perception through input, action through tool use, and cognitive abilities through foundation models backed by long\-term and short\-term memory.**

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*bybdIno5rvrzCNao)


## From LLMs to AI agents

*Alright, you are an AI engineer now.*

But before you head off and start building the next one billion revenue\-generating AI product, let’s take a couple of steps back and understand how we even got to AI agents in the first place. We will be looking at the changes we’ve seen in a short period of time when it comes to LLM applications.

The evolution of the form factor of LLM applications has been one of the fastest developments we’ve seen in modern applications.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*7Xe0sHKjZG6TRBFQ)


## Traditional chatbots to LLM\-powered chatbots

Chatbots are not new; you’ve probably interacted with a chatbot on a website before generative AI (gen AI) was coined. Traditional chatbots in the pre\-gen AI era were fundamentally different from today’s AI\-powered conversational agents. Here’s how they typically operated:

* **Heuritstic\-based responses**: “If this, then this” logic, or more formally rule\-based logic, was the basis of the operating model of traditional chatbots. They were programmed with a set of predefined rules and decision trees to determine how to respond to user inputs.
* **Canned responses**: Behind traditional chatbots was a set of pre\-written responses that were shown to the user based on detecting certain keywords or phrases. This worked to an extent.
* **Human handoff**: There was always a “Speak to a human” button in traditional chatbots, and to be honest, this hasn’t changed drastically. “Human in the loop” is still a much\-needed mechanism for even agentic systems.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*BbPNWoxmSd8RT61C)

LLM\-powered chatbots were the first mainstream introduction to LLM applications. On 30th November 2022, OpenAI released ChatGPT, a web interface that provided a simple but familiar interface of traditional chatbots (area for input and output visualization), but behind this web interface was GPT\-3\.5, an LLM created by OpenAI and trained on a large corpus of internet.

GPT (Generative Pre\-trained Transformer) is based on the Transformer architecture, which was introduced by Google in 2017\. This architecture uses self\-attention mechanisms to process input sequences, allowing the model to consider each word’s context in relation to all other words in the input.

Unlike traditional chatbots, LLMs, such as GPT\-3\.5, can generate human\-like text based on the input provided. One key differentiating factor of GPT\-3\.5 and other transformer\-based LLMs is that the mechanism of content generation is not simply based on pattern recognition and feature extraction from the training dataset, but these foundation models can create what seems to be novel and contextually relevant content when prompted.

The introduction of GPT\-powered chatbots like ChatGPT opened up a world of new possibilities, both for enterprise and commercial use cases. Notable use cases include code generation, content creation, improved customer service, etc. The capabilities of LLM\-powered chatbots marked a significant shift from traditional rule\-based chatbots to more flexible, intelligent, and capable AI assistants.

Despite their advanced capabilities, LLM\-powered chatbots still faced certain limitations. One significant challenge was personalization. These systems struggled to maintain consistent, personalized interactions over extended conversations or multiple sessions. Even more concerning was the capacity for LLMs to synthesize responses that were human\-like and coherent yet inaccurate. This phenomenon became a cause for concern, mainly because these systems began providing incorrect information with high confidence, a phenomenon now known as “hallucination.”

It’s important to understand that when an LLM “hallucinates,” it’s not malfunctioning but rather doing exactly what it has been trained to do: generate the next output token based on a set of probabilities informed by the input tokens and its training data. This process can sometimes lead to plausible\-sounding but factually incorrect outputs.

Addressing these limitations became a key focus in the development of more advanced AI systems, leading to the exploration of techniques that can “ground” the output of LLMs. One prominent technique is [retrieval\-augmented generation or RAG](https://www.mongodb.com/resources/basics/artificial-intelligence/retrieval-augmented-generation).


## LLM\-powered chatbots to RAG chatbots

**RAG is a technique that utilizes information retrieval methods to locate and provide relevant data that is then combined with user prompts and fed as input to LLMs**. This process ensures that the output generated by the LLM is based on both:

1. **Non\-parametric knowledge**: Information retrieved from external data sources in response to the specific query or context; this is usually real\-time data spruced from the internet or proprietary data
2. **Parametric knowledge**: The inherent knowledge embedded in the LLM’s parameters during its training

By leveraging both these sources of information, RAG aims to produce more accurate, up\-to\-date, and contextually relevant responses. This approach mitigates some limitations of pure LLM\-based systems, such as hallucinations or outdated information, by grounding the model’s responses in retrievable, verifiable data.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*T6oHBT_tvzzsPKBo)

The effort to improve the output of LLMs had multiple fronts, and one of these was prompt engineering. Prompt engineering refers to the practice of composing input queries to LLMs that steer the output toward desired characteristics, such as improved accuracy, relevance, and specificity. This technique involves carefully crafting the initial prompt given to an LLM to ensure the output is more precise, contextually appropriate, and task\-specific responses.

A few prompt engineering techniques have emerged, such as in\-context learning, chain of thought (CoT), and ReAct (Reason and Act).

In\-context learning: Leveraging the generalization capabilities of LLMs, in\-context learning involves the provision of input\-output pairs that demonstrate the task to be solved and the desired output. This technique can be implemented in two main ways:

1. **One\-shot learning**: Providing a single input\-output pair as an example
2. **Few\-shot learning**: Providing multiple input\-output pairs as examples

The process typically ends with an input that doesn’t have a corresponding output. Based on the provided examples, the LLM generates an output that is conditioned and guided by the input\-output pairs given in the prompt.

This approach allows the LLM to adapt to specific tasks or styles without fine\-tuning the model’s parameters. Instead, it relies on the model’s ability to recognize patterns and apply them to new, similar situations within the same context.

While in\-context learning prompting techniques enabled LLMs to generalize to new tasks, subsequent developments like chain\-of\-thought and ReAct prompting leveraged LLMs' emergent reasoning and planning capabilities. CoT enabled LLMs to decompose complex tasks into smaller, simpler sub\-parts through a step\-by\-step reasoning process. ReAct combines an LLM’s ability to reason with action planning.


## RAG chatbot to AI agents

As LLMs scaled to hundreds of billions of parameters, they exhibited increasingly sophisticated emergent abilities. These include advanced reasoning, multi\-step planning, and tool use or function calling.

Tool use, sometimes called “function calling,” refers to an LLM’s ability to generate a structured output or schema that specifies the selection of one or more functions from a predefined set and the assignment of appropriate parameter values for these functions. The tool use’s capability within an LLM is dependent on an input prompt describing an objective or task and a suite of function definitions provided to the LLM, typically in JSON format.

The LLM analyzes the input and function definitions to determine which function(s) to invoke and how to populate their parameters. This structured output can then be used by an external system to execute the actual function calls.


### What is a tool?

Generally, anything that can be programmatically defined and invoked can be defined as a tool with an accompanying JSON definition provided to an LLM. Therefore, RAG capabilities can be a tool, and API calls to external systems can also be tools.

LLMs that have access to tools and function calling capabilities are sometimes referred to as “tool\-augmented LLMs,” but notably, **the combination of advanced reasoning, multi\-step planning, and tool\-use capabilities facilitated the emergence of AI agents.** The last piece of the puzzle is the environment an AI agent resides within. AI agents operate within an iterative execution environment that enables an objective\-driven system that can iterate on a previous execution output that informs the current execution, and this can be different from the conversational\-based system interface.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*4v2PVdIFYrnhL05f)

Agentic systems or compound AI systems are currently emerging as a paradigm of implementation for modern AI applications that are complex compared to LLM\-based chatbots and multifaceted in their integration with system components. Agentic systems can be defined as computational **architecture** encompassing one or more AI agents with autonomous decision\-making capabilities, able to **access and utilize various system components and resources** to achieve defined objectives while adapting to environmental feedback. More resources on understanding agentic systems will be provided in the near future.

Another key term to be aware of is “agentic RAG,” which refers to a paradigm that leverages LLMs’ routing, tool use, reasoning, and planning capabilities alongside information retrieval based on comparing query and stored data. This system paradigm enables the development of dynamic LLM applications that can access various tools to execute queries, decompose tasks, and solve complex problems.

To truly understand AI agents, it’s important to consider their components, characteristics, and capabilities.


## The key components and characteristics of an AI agent

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*ECcuPBrGeawz_s6s)

The components of an AI agent are the crucial parts that form its architecture and enable its functionality. These components work together to process information, make decisions, and interact with the environment. The primary components include the brain, action, and perception modules, each playing a vital role in the agent’s operation.

An agent is a computational entity composed of several integrated components, including the brain, perception and action components. These components work cohesively to enable the agent to achieve its defined objectives and goals.

**Brain**: This component of an agent’s architecture is responsible for the cognitive abilities of an agent, including its ability to reason, plan, and make decisions. The brain of an agent is essentially the LLM. The emergent abilities of LLMs provide the agent abilities such as reasoning, comprehension, planning, etc. At the same time, and similar to humans, the brain component encapsulates different modules such as memory, profiler, and knowledge.

The memory module stores agent interactions with other external entities or systems. This stored information can be recalled to inform future execution steps and act accordingly based on historical interactions. The profiler module enables the agent to take on certain roles based on descriptions of the characteristics of roles that are intended to condition the agent into a set of behaviors.

The knowledge module within the brain component of an agent enables the storage and retrieval of domain\-specific, relevant, and useful information to leverage in planning and taking action toward an objective.

**Action**: The capability of an agent to react to its environment and new information is facilitated by the action component, which includes modules that enable the agent to generate responses and invoke other systems. An LLM\-based agent is equipped to decompose tasks into steps using processes within the brain component. Each step can be associated with a tool from the agent’s arsenal. With LLMs’ reasoning and planning capabilities, the agent can effectively decide when to utilize a tool at each step.

**Perception**: This component is solely responsible for capturing and processing inputs from the agent’s environment. Within the scope of agentic systems and interactions, inputs come in various forms, but the primary inputs provided to agents are auditory, textual, and visual.

The characteristics of an AI agent are the distinctive features and behaviors that define its capabilities and operational mode. These characteristics determine how an AI agent interacts with its environment, processes information, and achieves its objectives. Key characteristics include autonomy, proactivity, reactivity, and interactivity.


### Below is a summary of the key characteristics of agents:

* **AI agents are reflective and proactive**: AI agents utilize advanced reasoning patterns to tackle complex problems. They employ techniques like ReAct and chain\-of\-thought to decompose tasks, plan actions, and reflect on outcomes. Leveraging LLMs’ emergent properties of reasoning and planning, these agents continuously adapt their strategies based on feedback, previous execution outputs, and environmental inputs. This iterative process of planning, execution, and reflection enables AI agents to execute input objectives efficiently.
* **AI agents are interactive**: In some cases, AI agents may be required to interact with other agents within the same system or external systems, and often, they are expected to engage with humans for feedback or review of outputs from execution steps. AI agents can also comprehend the context of outputs from other agents and humans and change their course of action and next steps. The interactivity of AI agents extends into the undertaking of personas or roles to drive and condition the actions of the AI agents toward predictability based on the adopted role. In a multi\-agent environment, this enables the mimicry of societal roles and collaboration based on role definitions.
* **AI agents are autonomous and reactive**: Their autonomous characteristics enable them to perform actions based on both internal processing results and external observations, often without requiring explicit external commands. This reactivity is facilitated by two key capabilities: tool use and input processing. These capabilities allow AI agents to dynamically respond to changes in their environment or task conditions, adjusting their behavior and actions accordingly.


## Conclusion

In our exploration, we’ve developed an understanding of AI agents and their characteristics and even provided a working definition. However, it’s crucial to note an important caveat: **There is currently no consolidated industry standard for what precisely constitutes an AI agent in today’s rapidly evolving AI landscape.**

Instead, the industry has generally agreed that the classification of a system as an AI agent lies on a spectrum or continuum. This nuanced perspective acknowledges that AI systems can exhibit varying degrees of agency, autonomy, and capability.

This is where the term “agentic” enters the discussion. “Agentic” refers to the degree to which an AI system demonstrates agent\-like qualities. These qualities might include the following:

1. Level of autonomy in decision\-making.
2. Ability to interact with and manipulate its environment.
3. Capacity for goal\-oriented behavior.
4. Adaptability to new situations.
5. Degree of proactive behavior.

This continuum\-based understanding allows for a more flexible and inclusive approach to categorizing AI systems. It recognizes that as AI technology advances, the line between “simple” AI systems and fully\-fledged AI agents may become increasingly blurred.


> ***Where are the value and impact of the new form factor of LLM application realized?***

When it comes to software and application development, we tend to focus on value and impact, as well as the return on investment made in early exploration and experimentation efforts on AI agents and agentic systems. Primarily, we see value being realized around productivity gains through the automation of manual processes. Manual approvals, documentation, and reviews are embedded within most workflows in enterprise organizations. Agentic systems are showing early potential in automating — or, in other words, “agentifying” — aspects of an existing workflow that are repetitive.

Another value of agentic systems is the alleviation of decision\-making within enterprise workflows. AI agents can be prompted with rules and guidelines that steer their decision\-making capabilities when they are embedded within agentic systems and compound AI systems. But even more value and impact can be observed in what can be described as bringing the everyday individual closer to the system without the need for technical knowledge gain, and this is because agentic systems allow for an interface that is text\- and image\-driven to be a primary driver for calling and execution of the system functionality. The versatility of inputs from foundation models enables agentic systems to be steered by natural language, reducing the technical complexity of system interaction.

***Where are the efforts of players in the [AI stack](https://mdb.link/ai_stack_link_medium) currently placed?***

Reliability, scalability, and performance of AI agents are areas of focus for the key players in the AI industry who are attempting to provide solutions. Approaches to solving these focus areas include increasing the parameters in foundation models that enable reasoning capabilities in AI agents or developing tools to orchestrate workflows within a system in which an AI agent resides.

MongoDB stands at the forefront of data solutions, offering a comprehensive suite of database capabilities and platform features tailored to support the development of enterprise\-ready and cutting\-edge agentic systems. To provide developers with the functionalities to solve for agentic systems’s reliability, scalability, and performance, **MongoDB is the memory provider for AI agents and agentic systems.** MongoDB in agentic systems excels in critical areas, including:

1. **Long\-term data managemen**t: MongoDB provides robust storage and efficient retrieval of conversational histories, enabling AI agents to maintain context and learn from past interactions, enabled via [Atlas Search](https://mdb.link/atlas_search).
2. **Vector database capabilities**: Leveraging [MongoDB Atlas Vector Search](https://mdb.link/vector_search), the platform offers state\-of\-the\-art storage and retrieval of vector embedding data, which is crucial for AI workloads and semantic search functionalities.
3. [**Scalable data storage**](https://www.mongodb.com/products/platform/atlas-database): MongoDB’s architecture ensures high\-performance, scalable storage for AI agents’ operational data, adapting seamlessly to growing data volumes and computational demands.

**Check out our [technical resource](https://mdb.link/ai_agent_gen_ai_showcase)s and start implementing your AI agents with MongoDB.**


### The article was initially published on MongoDB Resources.


