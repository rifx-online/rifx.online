---
title: "Building a Multi-agent Internet Research Assistant"
meta_title: "Building a Multi-agent Internet Research Assistant"
description: "The article presents a tutorial on building a multi-agent internet research assistant using OpenAI Swarm and Llama 3.2. It describes a three-agent system where Agent 1 searches the web based on user queries, Agent 2 refines the search results, and Agent 3 drafts a comprehensive article. The tutorial outlines the implementation steps, including agent definitions and workflow orchestration, utilizing Streamlit for the user interface. The article emphasizes the capabilities of AI agents in reasoning and information extraction, and it aims to provide practical applications for AI engineering and LLMs."
date: 2024-12-27T12:59:06Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*S7Vz0Bq6_4szvCYFLBGASA.png"
categories: ["Programming", "Machine Learning", "Chatbots"]
author: "Rifx.Online"
tags: ["Swarm", "Llama", "Streamlit", "Agents", "Workflow"]
draft: False

---





> …with OpenAI Swarm \& Llama 3\.2 (100% local).



Let’s build a multi\-agent internet research assistant using OpenAI Swarm \& Llama 3\.2 (100% local):

Hands\-on tutorial to build a multi\-agent internet research assistant app that:

* Accepts a user query.
* Searches the web about it.
* And turns it into a well\-crafted article.

We used three agents in this app:

* Agent 1 → Accepts the user query and searches the web.
* Agent 2 → Accepts the web results from Agent 1 and refines them.
* Agent 3 → A technical writing agent that accepts the refined results, drafts an article, and sends it back to the user.

Recently, OpenAI released Swarm.

It’s an open\-source framework designed to manage and coordinate multiple AI agents in a highly customizable way.


> AI Agents are autonomous systems that can reason, think, plan, figure out the relevant sources and extract information from them when needed, take actions, and even correct themselves if something goes wrong.

Today, let’s cover a practical and hands\-on demo of this. We’ll build an internet research assistant app that:

* Accepts a user query.
* Searches the web about it.
* And turns it into a well\-crafted article.

We shall use:

* OpenAI Swarm for multi\-agent orchestration.
* Streamlit for the UI.

Here’s the step\-by\-step workflow of our multi\-agent app.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*3wxNfDwkOb4Cm724hKmoqQ.gif?output=gif&n=50)

As depicted above, we have three agents:

* Agent 1 → Accepts the user query and searches the web.
* Agent 2 → Accepts the web results from Agent 1 and refines them.
* Agent 3 → A technical writing agent that accepts the refined results, drafts an article, and sends it back to the user.

Let’s build this application!


## Imports

First, we begin with some standard imports:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*zKkVjAYXWhCkMuC_FHYHDA.png)

* We use Swarm from OpenAI to build our multi\-agent app.
* We use duckduckgo\_search to search the web.

Next, we define the MODEL name, and initialize swarm client and search client:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*QiWwtd2ZEhlcF3taI-dCiw.png)


## Agent 1

This agent must accept the user’s query, search the web, and return the raw web results.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*a-6Pw1fiwziMCvmLOM6S0A.png)

To build this, we first implement a function that accepts the query and returns the raw results.

* Line 7: Search the web.
* Line 9–16: Collect all the web results (title \+ URL \+ Body) in a single string and return it.

Next, we define our web search agent that will utilize the above function, and we also specify the instructions for this agent below:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ROn4y11ULGgGYGnDGEDJwQ.png)

Line 1: We specify the role.

Line 6–11: We define an object of Agent class (from OpenAI Swarm), specify the above function, the instructions, and the LLM.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*WKP_HyvXRH88n0wzxHzgzA.png)


## Agent 2

The results returned by Agent 1 will be pretty messy and may have a ton of irrelevant information. We need another agent to filter the appropriate information.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*-IHad_91fdo6y2uwglOFTw.png)

Like Agent 1, we define another object of the `Agent` class and pass the instructions:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*kCTx9FEIs9rUGGWSD-X3Yg.png)


## Agent 3

Finally, we build another agent that accepts the above\-filtered results and drafts an article:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*72XSp_zbUYYq-3O9YgNQMg.png)


## Stitch them together

While we have defined the three agents above, the multi\-agent app does not know the order in which these agents must run and whose output must be passed to the next agent.

Thus, we need to stitch them together in a workflow function.

Let’s do it step by step for simplicity.

* First, we pass the user query to the web search agent, which generates raw responses:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*X9MEd-G1uv2jHeN5_32KKQ.png)

Next, we pass the raw responses to the web filter agent:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*GCQmtGlqar7PPO_BkmSsNA.png)

Done!

This is the entire code for the run\_workflow method:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*5AMaGwLcZsRq8Hxtt5AvLA.png)

Executing the `run_workflow` method generates the desired output, as depicted below (and in the video at the top of this newsletter:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*dRRIbcw2oAGRMV4TDHrdbA.png)

Of course, we did not cover the Streamlit part in this tutorial.

We launched this repo today, wherein we’ll publish the code for such hands\-on AI engineering newsletter issues.

This repository will be dedicated to:

* In\-depth tutorials on **LLMs and RAGs.**
* Real\-world **AI agent** applications.
* Examples to implement, adapt, and scale in your projects.

Do you like the topic? Join our newsletter Subscribe

If you like the article and would like to support me, make sure to:

👏 Clap for the story (100 Claps) and follow me 👉🏻 [Mohammed Lubbad](https://medium.com/@mlubbad)

📑 View more content on my [Medium Profile](https://medium.com/@mlubbad)

🔔 Follow Me: [LinkedIn](https://www.linkedin.com/in/mohammedalubbad/) \| [Medium](https://medium.com/@mlubbad) \| [GitHub](https://github.com/mlubbad) \| [Twitter](https://twitter.com/engmlubbad) \| [Telegram](https://t.me/+m5aYZWcgQTg3NmU0)

🚀 Help me reach a wider audience by sharing my content with your friends and colleagues.


