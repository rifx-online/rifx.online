---
title: "Hands-on demo with building Agentic RAG (Retrieval-Augmented Generation) pipeline"
meta_title: "Hands-on demo with building Agentic RAG (Retrieval-Augmented Generation) pipeline"
description: "The article discusses the concept of Agentic Retrieval-Augmented Generation (RAG), which enhances traditional RAG systems by incorporating autonomous agents. These agents utilize large language models (LLMs) to intelligently decide which vector databases to query based on user queries, improving the relevance and accuracy of retrieved information. The article outlines the potential applications of Agentic RAG in various fields such as customer support and legal tech, and provides a demo using frameworks like CrewAI, LangChain, and Gradio to build an Agentic RAG application. This approach allows for more responsive and adaptable information retrieval systems."
date: 2024-12-26T04:30:18Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*KEKmnC8BhWGCbTyNmullbw.png"
categories: ["Generative AI", "Autonomous Systems", "Technology/Web"]
author: "Rifx.Online"
tags: ["RAG", "agents", "LLMs", "vector", "databases"]
draft: False

---




Illustration to see how autonomous agents can be involved in the RAG system to retrieve the most relevant piece of information


## What is Agentic RAG?

So, we all know what Retrieval Augmented Generation (RAG) is. But let’s just do a quick refresher. Retrieval augmented generation is a powerful and popular pipeline that enhances responses from a large language model. It does this by incorporating relevant data retrieved from a vector database, adding it as context to the prompt, and sending it to the LLM for generation. What this does is it allows the LLM to ground its response in concrete and accurate information, and that improves the quality and reliability of the response.

Let me quickly depict this it out. So, let’s say we have a user or an application. And they send a query. Now without retrieval augmented generation this query is going to go and get itself interpolated into a prompt. And from there that’s going to hit the LLM. And that’s going to generate an output to make this a simple RAG workflow.



Now further we can add a vector database (vector DB) to your traditional workflow. So instead of just going directly and getting itself interpolated into the prompt, it’s going to hit this vector DB. And the response from that vector DB is going to be used as context for the prompt. Now in this typical pipeline we call the LLM only once, and we use it solely to generate a response.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*UPCWU-RWif2U38AAN1KYLQ.png)

But what if we could leverage the LLM not just for responses, but also for additional tasks like deciding which vector database to query. Say, if we have multiple databases, or even determining the type of responseto give? Should an answer with text — generate a chart or even provide a code snippet? And that would all be dependent on the context of that query. So, this is where the **agentic RAG** pipeline comes into play.

In agentic RAG, we use the LLM as an agent and the LLM goes beyond just generating a response. It takes on an active role and can make decisions that will improve both the relevance and accuracy of the retrieved data.

Now, let’s explore how we can augment the initial process with an agentand a couple of different sources of data. So instead of just one single source, let’s add a second. And the first one can be your known internal documentation. And the second one can be general industry knowledge. Now in the internal documentation we’re going to have things like policies procedures and guidelines. And the general knowledge base will have things like industry standards, best practices and public resources. So how can we get the LLM to use the vector DB that contains the datathat would be most relevant to the query? Let’s add that agent into this pipeline as outlined below.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*oLVwFwICd1g8WrFLdGRlTQ.png)

Now, this agent can intelligently decide which database to query based on the user’s question, and the agent isn’t making a random guess. It’s leveraging the LLMs language understanding capabilities to interpret the query and determine its context. So if an employee asks what’s the company’s policy on remote work during the holidays, it would route thatto the internal documentation, and that response will be used as context for the prompt. But if the question is more general, like what are the industries standards for remote work in tech companies, the agent is going to route that to the general knowledge database, and that context is going to be used within that prompt powered by an LLM, the agent analyzes the query and based on the understanding of the content and the context, decides which database to use. But we may not always ask questions that are generally or genuinely relevant to any of this, or to that matterany of the stuff that we have in our vector DB. So what if someone asks a question that is just totally out of context. Like who won the T20 World Cup in 2024? What the agent can do at that point is that it could route it to a failsafe. So because the agent is able to recognize the context of the query, it could recognize that it’s not a part of the two databases that we have, could route it to the failsafe and return back a message like “*Sorry, I don’t have the information your are looking for*”.


## Potential Example Usage

Now for example, this agentic RAG pipeline can be used in customersupport systems and legal tech. For instance, a lawyer can source answers to their questions from like their internal briefs and then in another query, just get stuff from public caseload databases. The agent can be utilizedin a ton of ways. This approach opens up so many possibilities for applications in customer service, legal, tech, health care, virtually any fieldas IT technology continues to evolve. We will see AI systems that truly understand context and can deliver amazing values to the end user.

Enough of talk as — **“Talk is cheap**. **Show me the code.**” — **Linus Torvalds.**

Let’s deep\-dive into our demo illustration.


## DEMO — Building Agentic RAG application using CrewAI, LangChain and Gradio

Through this demo example, we shall see a basic illustration on how agents can be involved in the RAG system to retrieve the most relevant information.

First create a folder for your project, for example — “llm\_agentic\_rag\_app\_demo”, followed by creating a virtual environment using conda


> *conda create \-n llm\_agentic\_rag\_venv python\=3\.10*

or using the ***Virtualenv***


> *py \-3\.10 \-m venv llm\_agentic\_rag\_venv*

followed by activating the Virtual Environment

Once your virtual environment is activated, next we need to install all the needed libraries.


### Install the required libraries








### Import the libraries








### Setup API keys







Load our data/custom data you would like to use. Here, we are using a publicly available pdf on ‘[**attention is all you need**](https://arxiv.org/abs/1706.03762)’.


### Download the PDF, if not present








### Configure your LLM







We create a RAG tool and Web Search tool. For web search tool we will be using Tavily as a tool for our agents to use. [Tavily Search API](https://docs.tavily.com/docs/tavily-api/introduction) is a search engine optimized for LLMs and RAG, aimed at efficient, quick and persistent search results.


### Create a RAG tool variable to pass our PDF








### Let’s define a tool








### Create agents to work with








### Define tasks for these agents








### Define the flow for our RAG application







Final step is to create our application interface and UI. For this we use [GRADIO](https://github.com/gradio-app/gradio). Using it one can demo your ML model with a friendly web interface.


### Create Application using GRADIO








### Running RAG pipeline







This Agentic RAG pipeline — processes the user queries through the agents, retrieves the most relevant information, filters out hallucinations, and provides a precise and concise answer to the questions.

[**Access the complete code here**](https://github.com/ajayarunachalam/AGENTIC_RAG_DEMO_APP)


## Wrap\-up

**Agentic RAG** is an evolution in how we enhance the RAG pipeline by moving beyond simple response generation to more intelligent decision making. By allowing an agent to choose the best data sources and potentially even incorporate external information like real\-time data or third party services. We can create a pipeline that’s more responsive, more accurate, and more adaptable.

With combination of frameworks like **CrewAI, LangChain and Gradio**, we built a functional agentic RAG application, that don’t just generate information — but actively retrieve, verify, and filter the information autonomously to ensure accurate and high quality of responses.

If you liked the blog post encourage me to publish more contents by your support \& love with a clap [👏](https://emojipedia.org/clapping-hands/)


## Contact Me

You can reach me at ***ajay.arunachalam08@gmail.com*** or connect me through [**Linkedin**](https://www.linkedin.com/in/ajay-ph-d-4744581a/)

Thanks for reading.

“Knowledge is Power ”— So, always keep learning!!! Check my Git Repo **[here](https://github.com/ajayarunachalam)**

***About Me***

*I am an **AWS Certified Cloud Solution Architect \& AWS Certified Machine Learning Specialist**. In the past, I have worked in **Telecom**, **Retail**, **Banking and Finance,** **Healthcare, Media, Marketing, Education, Agriculture,** and **Manufacturing** sectors. I have 7**\+** years of experience in delivering Data Science \& Analytic solutions of which 6**\+** years of experience is client facing. I have **Lead \& Managed** a large team of Data engineers, ML engineers, Data Scientists, Data analysts \& Business analysts. Also, I am experienced with Technical/Management skills in the area of business intelligence, data warehousing, reporting and analytics holding **Microsoft Certified Power BI Associate** Certifications. I have worked on several key strategic \& data\-monetization initiatives in the past. Being a certified **Scrum Master,** I practice agile principles while focusing on collaboration, customer, continuous improvement, and sustainable development.*


## References


