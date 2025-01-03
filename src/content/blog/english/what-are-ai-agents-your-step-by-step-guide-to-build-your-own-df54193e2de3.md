---
title: "What Are AI Agents? Your Step-by-Step Guide to Build Your Own."
meta_title: "What Are AI Agents? Your Step-by-Step Guide to Build Your Own."
description: "AI agents represent a significant advancement in artificial intelligence, allowing for the autonomous handling of complex tasks such as insurance claims processing. Unlike traditional AI systems that merely assist with specific tasks, AI agents can manage entire workflows, including data extraction, external service calls, and context retention. They excel in automating processes and can potentially automate 70%-90% of workloads in certain departments. This capability marks a shift towards more sophisticated AI applications that function similarly to human employees, enhancing efficiency in various business operations."
date: 2025-01-03T00:22:01Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*LxIyh8pAhZqXl3ADn_pz3A.jpeg"
categories: ["Autonomous Systems", "Data Science", "Technology"]
author: "Rifx.Online"
tags: ["agents", "automation", "workflows", "data", "extraction"]
draft: False

---



**The next big thing?** Gartner believes AI agents are the future. OpenAI, Nvidia and Microsoft are betting on it — as are companies such as Salesforce, which have so far been rather inconspicuous in the field of AI.

And there’s no doubt that the thing is really taking off right now.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*wxbaaC3vQZYiBYzz5AGhBQ.png)

Wow.

So, what is really behind the trend? The key to understanding agents is **agency**.

Unlike traditional generative AI systems, agents don’t just respond to user input. Instead, **they can process a complex problem such as an insurance claim from start to finish**. This includes understanding the text, images and PDFs of the claim, retrieving information from the customer database, comparing the case with the insurance terms and conditions, asking the customer questions and waiting for their response — even if it takes days — without losing context.

**The agents do this autonomously** — without humans having to check whether the AI is processing everything correctly.

## The Espresso Machine and the Barista

In contrast to existing AI systems and all the copilots out there that **help employees** to do their job, **AI agents are, in fact, fully\-fledged employees themselves**, offering immense potential for process automation.

**Imagine** — an AI that can take on complex, multi\-step tasks that are currently performed by a human employee or an entire department:

* Planning, designing, executing, measuring, and optimizing **a marketing campaign**
* **Locate a lost shipment in logistics** by communicating with carriers, customers, and warehouses — or, if it remains lost, claim its value from the responsible partner.
* **Search the trademark database** each day and determine whether a new trademark has been registered that conflicts with my own trademark and immediately file an opposition
* gather the relevant data or ask employees, check the data and **compile an ESG report**

Currently, AI models can assist with tasks like generating campaign content or evaluating emails, but they lack the ability to execute an entire process. **An AI agent can do that.**

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*V8B2X23xlhZ9gcdCwIAA6A.png)

**While traditional models are like great espresso machines, agent\-based AI is the barista.** Not only can they make coffee, but they can welcome the guests, take the order, serve the coffee, collect the money, put the cups in the dishwasher, and even close up shop at night. Even the best espresso machine in the world can’t run a café by itself, but the barista can.

Why can the AI agent and the barista do this? They excel at mastering various subprocesses of a complex job and can independently decide which task to tackle next. They can communicate with people, like the clients, if they need more information (milk or oat milk?). They can decide who they should ask in case of problems (beans are out \=\> boss, coffee machine is on strike \=\> customer service of the machine vendor).

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*7rWViLLiWpoHivd15UHZTQ.png)

## Anatomy of an AI Worker

But enough chatting, let’s build an AI agent. Let us have a look at the relevant processes and workflows.

Let us **build an agent for the insurance process** shown in the diagram above. The agent should handle an insurance claim from start to reimbursement.

What we are developing here is the **business architecture and the process flow.** Unfortunately, I can’t dive into the coding because it can quickly become very extensive.

### 1\. Classification \& sending a job into processing lanes

Our workflow starts, when a customer sends a message **with a claim for their home insurance to the insurer.**

What does our agent do? It determines what the customer wants by analyzing the message’s content.

Based on this classification, the system initiates a processing lane. Often, this goes beyond [function calling](https://platform.openai.com/docs/guides/function-calling); it involves making a fundamental decision about the process, followed by executing many discrete steps.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*CvV2Yu0Nk43LN7GUDO8JPQ.png)

### 2\. Extracting data

In the next step, data is extracted. **One of the main tasks of an agent is to turn unstructured data into structured data** … to make processing **systematic, safe and secure**.

**Classification assigns a text to a predefined category, whereas extraction involves reading and interpreting data from the text.** However, a language model doesn’t directly copy data from the input prompt; instead, it generates a response. This allows for data formatting, such as converting a phone number from ‘(718\) 123–45678’ to ‘\+1 718 123 45678’.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Q8o6a2-Fe1FbqIOS7I3EaQ.png)

The extraction of data is not limited to text content (from the e\-mail text), but can also comprise data from images, PDFs or other documents. We use more than one model for that: LLMs, image recognition models, OCR and others. The above process is simplified, really massively simplified. In reality, we often send images to OCR systems that extract text from scanned invoices or forms.. And often we classify attachments as well, before analyzing them.

We enforce JSON as the model’s output format to ensure structured data.

This is the email input — **unstructured data**:

```python
Hi,

I would like to report a damage and ask you to compensate me.

Yesterday, while playing with a friend, my 9-year-old son Rajad kicked a soccer ball against the chandelier in the living room, which then broke from its holder and fell onto the floor and shattered (it was made of glass). 

Luckily no one is injured, but the chandelier is damaged beyond repair. 

Attached is an invoice and some images of the destroyed chandelier.

Deepak Jamal
contract no: HC12-223873923
123 Main Street
10008 New York City
(718) 123 45678
```

This is the model output — a JSON, **structured data**:

```python
{
  "name": "Deepak",
  "surname": "Jamal",
  "address": "123 Main Street, 10008 New York City, NY",
  "phone":"+1 718 123 45678",
  "contract_no": "HC12-223873923",
  "claim_description": "Yesterday [Dec-8, 2024], while playing with a friend, my 9-year-old son Rajad kicked a soccer ball against the chandelier in the living room, which then broke from its holder and fell onto the floor and shattered (it was made of glass).\nLuckily no one is injured, but the chandelier is damaged beyond repair.\n"
}
```

### 3\. Calling external services, making the context persistent

Many generative AI systems can answer queries directly — sometimes using pre\-trained data, fine\-tuning, or Retrieval Augmented Generation (RAG) on some documents. This is not enough for agents. **Almost every reasonably powerful AI agent needs to access corporate or external data from databases.**

**To keep the context of a process persistent beyond the current session, it must also write data to systems and databases**. In our case, the agent checks the contract number against a customer database and writes the status of the claim to an issue tracking system. It can also — remember: agency! — request missing data from external parties, such as the customer.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*UjA1UCxseKtTDiZWDjmVWg.png)

### 4\. Assessment, RAG, reasoning and confidence

The heart of every administration job consists of interpreting incoming cases in relation to various rules. AI is particularly good at this. Because we can’t provide all contextual information (e.g., policy content or terms and conditions) when calling a model, **we use a vector database to retrieve relevant snippets — a technique known as RAG**.

And we prompt the AI to **‘think aloud’** before making an assessment. Thinking before blurting out the result improves answer quality — something we’ve all learned since 3rd grade math. We can also use the output of the model reasoning in many obvious and less obvious ways:\- To substantiate an answer to the customer\- To help the prompt engineer and data scientist figure out why the model made a mistake\- For checks: Did the model arrive at the correct answer by chance, or can we see through its reasoning that the solution was inevitable?

**Confidence is the key to maximizing accuracy.** If the model estimates its confidence — and, dear prompt engineers, this also requires very good few shot learning examples for various confidence values — then we can configure the system to operate with extreme safety or high automation: We set a threshold of confidence below which all cases should go to human support. A high threshold ensures minimal errors but requires more manual processing, while a lower threshold allows more cases to be processed automatically, albeit with an increased risk of errors.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*-kJEBbVKpueHaNxEmvlLXw.png)

Et voila! If you have just implemented 2 or 3 of the above steps, you have developed an agent. I’ve outlined only the key components of these AI agents. You can certainly imagine the others. **And you can either implement it with help of frameworks such as crewAI, langGraph, langFlow and their siblings or just do it in pure Python.**

Remarkably, such a system can automate 70%–90% of a claims management department’s workload. And that’s not possible with simple pre\-agent generative AI systems. Two years ago, I could never have imagined this becoming reality so quickly.

tl;dr? Here’s AI agents in a nutshell:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*tljAv3gFZUqC4LeKr-ATUQ.png)

These agents will certainly keep me busy over the coming months — my team and me have just launched a large logistics system.

I wish you every success with your AI and agentic AI systems!


