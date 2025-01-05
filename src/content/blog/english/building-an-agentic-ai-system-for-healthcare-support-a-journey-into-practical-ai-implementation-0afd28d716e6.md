---
title: "Building an Agentic AI System for Healthcare Support: A Journey into Practical AI Implementation…"
meta_title: "Building an Agentic AI System for Healthcare Support: A Journey into Practical AI Implementation…"
description: "Doctolib is developing an Agentic AI system to enhance healthcare support interactions by using specialized AI agents. This system aims to reduce support costs while maintaining high customer satisfaction by intelligently handling routine queries. Each agent is designed with specific roles and tools, ensuring efficiency and security. The approach emphasizes a human-in-the-loop model for sensitive actions, maintaining user control and safety. As the project progresses, it seeks to expand its capabilities in healthcare support automation, focusing on user experience and security."
date: 2025-01-05T02:19:27Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*nEeaSGfJUxgHBHRp"
categories: ["Health", "Artificial Intelligence", "Customer Service"]
author: "Rifx.Online"
tags: ["Agentic", "healthcare", "automation", "security", "agents"]
draft: False

---




At Doctolib, our mission goes beyond building the healthcare we all dream of — we’re transforming how health professionals and patients interact with technology. Two ambitious objectives drive us: delighting health professionals who use our solutions and accelerating our pace of innovation. But with great ambition comes great responsibility, especially when it comes to supporting our users.

As our platform grows, so does the volume of support requests. The traditional approach would be to simply scale our support team linearly with demand. However, we saw an opportunity to think differently: what if we could have sustainable support costs while maintaining our high standards of customer satisfaction? What if technology could help our support teams focus on what they do best: providing empathetic, human care for complex cases?

This challenge led us to explore the frontier of AI technology, specifically Agentic AI. We’re building a system that doesn’t just answer questions — it thinks, analyzes, and acts with the expertise of a seasoned support agent. It’s not about replacing human interaction, but about enhancing it. By handling routine queries intelligently, we’re freeing our support teams to focus on cases where human expertise and empathy matter the most.


## What’s agentic BTW?

In the word “agentic” there is “agent”, and that’s not a coincidence.

An agentic system is essentially a network of specialized AI **agents**, working together like a well\-coordinated team of experts toward a common goal. Think of it as a virtual organization where each member has specific skills and responsibilities.



Each agent is powered by a Large Language Model (LLM) but is carefully constrained in these ways:

* A specialized prompt that defines its role, context, and expertise
* A specific set of tools it can use

Let’s make this concrete with an example from our support system. One of our agents is the “Data Retriever” — a specialist focused solely on gathering customer information. While it has deep access to our customer data APIs, it can only use a carefully curated set of endpoints. This specialization ensures both efficiency and security (principle of the least privilege).

The interaction between agents is governed by a directed graph structure, where:

* Each node is a computation/processing step: it can be an LLM\-based agent or just a deterministic function
* Each edge defines the possible communication paths
* The flow of information follows these predefined paths, depending on the output of the previous node

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*xBUUd76fg-2Cp8vk)

Under the hood, our agentic system is built on [LangGraph](https://www.langchain.com/langgraph), a powerful framework for orchestrating these complex agent interactions.

You can read more about it on my colleague [Anouk’s article](https://readmedium.com/part-2-from-rag-to-agents-doctolibs-journey-to-revolutionize-customer-care-6b14da40f5ae).

In the previous quarters we developed a Retrieval Augmented Generation (RAG) engine that enriches AI responses with our support knowledge base. Guess what? It will now become a specialized agent of our agentic system!


## Beyond chatbots: reimagining support interactions


### The terrible dummy chatbot experience

We all, once, experienced the frustration of talking with a chatbot with the clear goal in mind to talk to a human.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*RI_Rv6HX05Ev1oVF)

Either the chatbot proposed a limited list of choices with none matching what you wanted or a free\-text field, allowing you to rage against the machine (🤘), without getting what you want.

This is **exactly** what **we don’t** want to do.


### Alfred 🛎️! Bring the big red button, please

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*RMVEbGcc0WARcTNz)

Instead of forcing users through rigid decision trees or leaving them shouting into the void of a free\-text field, we envisioned something fundamentally different: a digital butler that provides the same thoughtful, intelligent service you’d expect from a skilled human agent.

Just like a well\-trained butler, Alfred:

* Understands what customers need, even when it’s not perfectly articulated
* Knows which questions to ask and when to ask them
* Discreetly gathers the information that is readily available from our systems
* Presents them with a clear, actionable solution — our ✌️big red button✌️
* Does it all through a dynamic user interface


### From vision to reality: a real\-world example

For Q4 2024 we wanted to address one specific yet common scenario: managing access rights to a doctor’s calendar.For instance, it could be “hey Alfred, I’d like to give Maria Smith read\-only access to my home consultations calendar”.

But let’s be honest, customers rarely formulate such a precise demand from the outset.

A more realistic scenario could be a conversation like:

* HCP: I’d like to give access to my agenda
* Alfred: Sure, I see there are several persons in your organization, which one is concerned by your demand?
 1\. Maria Smith
 2\. John Doe
* HCP: Maria Smith
* Alfred: I also see you have various agendas: which one would you like Maria to have access to?
 1\. Agenda 1
 2\. Agenda 2
 3\. Agenda 3
* HCP: Agenda 1
* Alfred: OK. What level of access would you like to give to Maria?
 1\. read\-only
 2\. bookings management
 3\. full\-access
* HCP: bookings management
* Alfred: I understood you want to give **Maria Smith** access to your **agenda 1** with access rights “booking management”. To perform the action please press the confirm button.

*HCP submits the confirmation button ;*

✨ Maria Smith now has access to agenda 1 ✨

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*vH7yvyc7R_6Psmed)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*TAjyzxptidKtKHpr)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*TAjyzxptidKtKHpr)

Pretty stylish, right 😄?


## Technical challenges and design decisions


### Managing AI hallucinations

As non\-deterministic systems, large language models do hallucinate. Sometimes a little, sometimes more. That’s a fact, and it is a part of the equation we cannot ignore.

After extensive discussions with engineers, legal department, and leadership, we established a crucial principle: the LLM will never directly execute sensitive actions. The final step of changing agenda accesses always remains in the users’ hands. This “human\-in\-the\-loop” approach ensures **safety** while maintaining **efficiency**.

But that decision brings it own complexity: how to ensure that what we show to the users is actually what will be performed when they click on confirm?Said differently, how to make sure that when we display “Maria Smith” it’s actually not John Doe’s ID that is sent in the body of the request?


### Security and access rights

Some AI agents need access to customer data to do their job effectively. However, following the [principle of least privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege), we decided against giving them elevated “✌️admin✌️” access to our APIs. Instead, we implemented a more nuanced approach:

* Agents inherit the exact same permissions as the user they’re assisting
* This requires sophisticated application context propagation
* Each API call respects existing authorization boundaries
* Security remains consistent with our regular user interactions


### Scaling for production

Let’s look at the numbers:

* \~1,700 support cases per business day
* Assuming \~10 interactions per conversation
* Results in \~17,000 messages daily

While this volume is manageable from a pure throughput perspective, it presents interesting challenges:

* Maintaining conversation context across multiple interactions
* Ensuring consistent response times
* Monitoring and logging for quality assurance


## Technical implementation

Here comes the time to dive into the technical details. As you can imagine, there are plenty of things to say, but in order to keep this article digestible I selected a few. Hold your breath and put your swimsuit on!

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*pgx0YWAKDLpzOnZN)


### Service\-to\-service authentication

Our services communicate using JSON Web Tokens (JWTs), implementing a robust authentication scheme:

Service A (Alfred) → JWT → Service B (Agenda)

Each JWT contains two crucial pieces of information (claims):

* The audience (aud): “Who you are talking to” — the target service
* The issuer (iss): “Who you are” — the calling service

Think of it as a secure introduction letter: “Dear Agenda Service (aud), I am the Alfred Service (iss), and here are my credentials signed with our shared secret.”

But we went a step further. Each service maintains an explicit list of allowed callers. Even with a perfectly valid signature, if Alfred isn’t on a service’s “approved callers” list, the request is rejected. This double\-checks mechanism ensures that services only talk to those they explicitly trust.


### User context propagation

Remember our principle of having Alfred work with the same permissions as the user they’re helping? Here’s how we implement it:

Users authenticate upon our identify provider (Keycloak). As a result they get a JWT as proof of identity that will be propagated along with the requests.

When Alfred makes a request, it carries two tokens:

1. The service\-to\-service JWT (proving Alfred’s identity)
2. The user’s Keycloak token (carrying user identity)

This way, target services can:

* Verify that Alfred is allowed to make the call
* Apply the same permission checks they would for a direct user request
* Maintain consistent security boundaries

It’s like Alfred having both his butler credentials AND a letter of authorization from the user they’re helping — both are needed to perform actions on the user’s behalf.


### Secure action execution

One of our core principles is that AI agents should never directly execute sensitive operations. But how do we implement this in practice while maintaining a smooth user experience? Here is how we aim to do it:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*SqNalQ5V7UIX2Gtb)

Whenever an AI agent decides it’s time to perform an update on the agenda authorizations it will craft the complete request (url, http method and payload) and pass it to a **deterministic node**. On its turn, this node will

1. Ensure the parameters were not hallucinated by the LLM (fact\-checking)
2. Send it to an Action Request Checker responsible for fetching fresh data for all referenced resources, and returning both technical and human\-readable forms

For instance, let’s say the AI agent crafted the following payload:


```python
{
  "method": "POST",
  "endpoint": "/api/v1/agenda_authorizations",
  "payload": {
    "user_id": 42,
    "agenda_id": 123,
    "access_right": "read_only"
  }
}
```
The Action Request Checker will fetch the corresponding data in order to show to the users what it means:

* John Doe
* Agenda A
* Read\-only access

That way, the frontend can present something **human\-readable** and **accurate**, meaning that when we display “John Doe” it’s John Doe’s ID which is used underneath, and not something hallucinated by the LLM.


### Evaluation

For this crucial task, we leverage [Literal.ai](https://www.literalai.com/), a specialized platform for AI evaluation.

Our core metrics are:

1. Level of achievement: 1\-to\-3 scale comparing Alfred’s output against established groundtruth
2. Efficiency:
\- Latency of the execution of the graph
\- Number of steps: number of nodes visited during the execution — optimal number of steps


## Looking Ahead 🔭

We’re still in the early chapters of our journey with Alfred. While our initial focus on calendar access management serves as a proof of concept, it’s just the beginning, and we’re exploring additional support scenarios where this agentic approach could bring value.

The foundation we’ve built — with its careful consideration of security, user experience, and technical constraints — provides a solid platform for expanding Alfred’s repertoire of skills.

Stay tuned for more updates as we continue to push the boundaries of what’s possible in healthcare support automation. After all, every great butler needs time to perfect their service. 🎩


