---
title: "Generative AI UX — Developing Innovative Use Cases for the Enterprise"
meta_title: "Generative AI UX — Developing Innovative Use Cases for the Enterprise"
description: "To create innovative and appropriate enterprise Generative AI (Gen AI) experiences, a framework is needed to ensure the AI is trained on business operations, goals, and processes. Unlike consumer use cases, enterprise Gen AI must address complex processes and maintain a professional tone, drawing from authoritative sources. The framework involves gathering and synthesizing information to understand user needs, define expected responses, and ensure the AI aligns with company goals. Key aspects include capturing user intent, expected response formats, conversation flow, data sources, tone, and creativity levels. User research, journey maps, and specific application questions help in identifying potential use cases. The framework aims to balance Gen AI’s benefits with trust, control, and agency issues, ensuring the AI adds value appropriately."
date: 2024-12-12T01:54:14Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*uNN73YEEusgyXdxyqy_rtw.png"
categories: ["Generative AI", "Programming", "Technology/Web"]
author: "Rifx.Online"
tags: ["Generative", "enterprise", "framework", "processes", "trust"]
draft: False

---


### PRACTICAL DESIGN INNOVATION





### A framework for designing innovative and appropriate enterprise Gen AI experiences.



To create innovative Generative AI experiences that users will adopt and use, we need to ensure appropriate responses. To accomplish this, we need these experiences to be trained on how the business operates, how it is measured, the company’s goals, flows, and processes, how the company should be discussed in different contexts, and how activities like initiatives and projects relate to each other.

Consumer use cases tend to be simple and focused on fulfilling individuals’ needs. Copying resumé beautification experiences will not help enterprises create innovative Gen AI experiences. The enterprise needs Gen AI to solve company goals across complex processes. Given that generative tools provide the user much more flexibility in how they approach work than logic\-based experiences like tables and forms, we need to reevaluate our understanding of how users think about their work so we can provide appropriate responses, be proactive, and provide predictable and actionable follow\-up.

Conversely, responding in an inappropriate tone or with information that is not authoritative is vastly more problematic in enterprise Gen AI experiences than in consumer ones. We need to be sure information is derived from authoritative and appropriate sources that are explicitly specified to the model, not inferred from whatever documents might exist in a domain, some of which could be works\-in\-progress instead of completed, agreed\-upon decisions.


> We need to be intentional about collecting information to solve Gen AI problems. This [article](https://uxplanet.org/enterprise-generative-ai-the-problem-of-authoritative-data-eaf19c2320e5) describes some of the **authoritative data** difficulties with Gen AI systems we want to consider when gathering information to complete the framework.

Building innovative enterprise experiences involves many roles understanding the abilities and limitations of Gen AI. User experience team members can help extract what kind of information users want in different contexts and what appropriate responses are. Content management people can ensure enough appropriate content is available so that Gen AI experiences provide expected and desired outcomes. Developers can help fine\-tune the model and make proper connections to data sources so the system can access authoritative data.


> The following framework provides methods for these roles to work together to extract this understanding, create the user experiences users don’t yet know they desire from generative tools, ensure that the company’s needs are met, and the tools are appropriate and trustworthy.

No matter what [design direction](https://uxplanet.org/generative-ai-ux-design-patterns-192bb169ab99) a Gen AI experience might take the following framework provides ways to help extract how users work and imagine where Gen AI can provide value. We want to collect information with the intention that Gen AI **might** be a way to solve problems and then evaluate users’ goals and issues in the context of how Gen AI excels and fails.


## Framework

This framework provides teams building enterprise LLM tools the means to understand what is needed to evaluate the model, fine\-tune it, and engineer the experience to provide appropriate responses.

The methods in the framework are not meant to extract every capability of an enterprise feature or application. They are an exercise to help teams extract the most useful and comprehensive capabilities where Gen AI can help users achieve their goals while maintaining the company’s goals and reputation.

Gathering and synthesizing information to create Gen AI experiences that meet the needs of complex enterprise applications requires thoughtful effort.


> \[T]he framework can help me capture information that is needed upfront to evaluate and prioritize gen AI use cases and needed later to develop the actual capabilities.


> I can imagine using the framework to structure working sessions for a multi\-disciplinary working group tasked with creating this knowledge.


> — [**Francesca Barrientos**](http://linkedin.com/in/francescabarrientos)

A spreadsheet, like the one below, is a consumable deliverable to evaluate data needs, fine\-tune the model, and provide prompts or direction to make generative tools more effective and can be used as a checklist to support QA (quality assurance), *the effort to understand the relationship between users’ goals and Gen AI is where the real value lies*.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*UsYKYGSHe4W-UJ27eTOdow.png)


## What information we capture, why we capture it, and what might we do with it (WMWDWI)

The following are aspects of generative AI experience we will want to make sure we get correct. We want to gather information about these aspects that will help us create innovative and appropriate experiences. To do that we capture information (what) to understand the aspect (why) so that we can use it to make decisions about the experience (wmwdwi).


### Question / Goal

**WHAT** — We want to capture and communicate the intent of the user’s request— what question they want answered or the goal they are trying to accomplish. If the experience only allows typing, we want to capture the likely phrasing the user will use when making the request.

**WHY** — While users can ask questions about the same subject in many ways, this column should give the team a good general idea of the domain to address. This should be representative of what users might ask for. Use the **For each question** section below to develop variations the user may ask and whether the variations should be captured separately.

**WMWDWI** — This information will be used to evaluate whether we have the data needed to answer or act, what context the user may have we need to support, shape prompt engineering that might be needed, and develop quality assurance efforts.


### Expected Response

**WHAT** — We need to capture the content, tone and format of the response the user expects. And we need to capture the likely format the user would prefer the response to be displayed — sentence, several paragraphs, list, table, visualization, start of an activity, etc.

Would the request likely be asked in the mobile context? Is it likely that for mobile, they will prefer a spoken response, and for desktop, something that is more in\-depth?

**WHY** — Within the broader palette of responses a Gen AI can provide specific results that may be difficult to describe. It is still important to have an expectation that can be tested. It may also be valuable to document whether the desired response would differ between mobile and desktop so that the development of that difference can be accounted for.

**WMWDWI** — In the enterprise context, the information is used to shape responses specific to the company’s goals and processes. Some responses, such as those involving legal, financial or humar resources have legal and other implications for which responses need to meet.


### Part of conversation

**WHAT** — Is the request likely part of a conversation? If so, might it be part of a larger goal or process? If so, what follow\-up requests could we expect?

Suppose the initial request is likely the start of a more extensive process, like a travel request, the creation of a marketing campaign, or the status of a complex project that will require cycles of analytic questions. What might the conversation look like?

Consider how likely the user would like the system to indicate that follow\-up questions could help provide better answers or whether the system should preemptively try to respond to questions the user might have.

**WHY** — The sooner we can determine the direction the user wants, the better we are able to proactively provide responses that efficiently helps them obtain their goals.

**WMWDWI**— If the request is likely part of larger questions — possibly about travel or fixing a piece of hardware, or the status of a project that needs steps, and the system can determine that, then part of the response can proactively contain aspects that help the user with a more complete understanding or next steps.

This conversation concerns a complex issue, and you should consider switching the user into an experience focused on helping them fulfill the process. In this circumstance, the user can use Gen AI’s conversational abilities to ask complex requests, with the system providing a point\-and\-click experience for manipulating the results.


### Data

**WHAT** — System instrumentation, content sources, or available data tables to fulfill the request. Whether the correct data has been marked so the system will know what is authoritative.

**WHY** — One of the biggest reasons AI tools fail is that the right data does not exist in the production environment.

*Being intentional instead of hoping that data exists is essential to creating viable and successful enterprise Gen AI projects.*

**WMWDWI —** This can be used by product management and engineering to assess access and APIs to the systems needed to support the request. Also, to address problems and remediation mentioned above.


### Tone

**WHAT —** Make sure the system responds to each request in a tone (corporate, financial, legal, on brand, casual, friendly) appropriate to the audience — legal, financial, customer, employee asking HR questions, etc. Also, need to consider if the response will likely be used in a press release or have legal implications.

**WHY** — Many responses could be factual or authoritative but not appropriate to the audience because the tone is not appropriate to the information. This is especially important for media and legal\-related requests.


> I worked on a Gen AI project that was stopped because the audience would be the press, and the standard tone the system took was not on brand and appropriate to financial press releases.

**WMWDWI** — This information will be used to frame response’s tone to requests via fine\-tuning or prompt\-engineering.


### Creativity (Temperature)

**WHAT** — How creative can the system be with the answer. It’s especially important if the response must meet a level of legal appropriateness.

* **None** — System should respond verbatim. If it cannot, tell the user, it does not have a response to the question.
* **Some** (default) — If confident of sources, construct a response based on Tone and provide a standard disclaimer; otherwise, construct a response with a strong disclaimer.
* **Lots** — Use a standard disclaimer, and the System can reframe the response.

**WHY** — Creativity is an aspect of the system hallucinating as higher creativity gives it flexibility when sampling content and creating the response. The more the temperature is reduced, the more the system is forced to use the source versus sampling outside the source data space. So, lower temperature means more authoritative.

**WMWDWI**—This information is used to mark certain kinds of requests as needing a low temperature so that the system responds appropriately. You may also need the system to NOT respond if the response cannot meet certain legal or public\-facing criteria.


## Some help gathering the information

The following are a few ways to generate rows for the spreadsheet — to think about the kinds of questions, requests, activities, or conversations users might want enabled. We do this because predicting what kinds of requests a user might make of an AI actually requires thinking deeply about what users are doing and the context in which they make requests.


### User Research / Journey Maps / Jobs To Be Done

Your first stop, of course, should be your UX/XD group. They may have Journey Maps or Jobs\-to\-be\-done deliverables that provides users’ needs and desires about different phases of work and how they think about it.


### General Questions

The following questions are ways to elicit areas of applications users might expect a generative tool to respond to. The examples are simplistic. You can expect users to ask more detailed versions. Consider what an ideal response might be given the organization’s context when thinking about how that would shape the response for each question.

**What might users’ process questions be?**

* How do I submit a service request?
* How do I start the hiring process?
* How do you start a new project?
* Does our dev process use a standard SDLC? — Software Development Lifecycle
* Who are the stakeholders for the X project?

**What might users’ state/status questions be?**

* When is the X project expected to finish?
* How close are we running to capacity?
* Are we close to hiring a candidate for \[position]?
* Do we have regulations around \[issue]?

**What might users’ actions (Create/Read/Update/Delete, etc.) within their domain be?**

* Create a marketing campaign for \[customer type] for \[product].
* How many loans do we have that should close this month?
* Add 5 days to all of the \[something] projects.
* Delete user assignments for the \[something] role.

**What might users’ analytics questions be?**

* Did any events happen around 00/00/00?
* Do we have enough \[part] to build 300 \[product]?
* What is the most common reason given for articles that have thumbs down?
* Which way is adoption trending for \[new feature]?

**What might users want to know about the main objects in the system?**

* Marketing — How is my \[something] campaign doing?
* Sales — When was the last time I engaged with \[customer]?
* HR — How many employees does \[manager] have?

We want to think about what users might do with the answer and what actions they might take.


### For each question, what type of question is it?

Thinking about the nature of the questions users will be asking helps guide us to the nature of the reply or experience that will meet their needs.

**To find if something exists** — Ex. Is there a marketing plan that has…?

**To find out information about a thing or group of things** — Ex. descriptions, state/status, amounts, changes/deltas.

**To find out how to do an activity** — Ex. Request a laptop, ask for access to a system, plan travel within company guidelines, start projects, suggest ideas, etc.

**To find out how things relate to each other** — Ex. Hierarchically (is this a child to, parent to, several branches away?), equal to, greater than, less than, statistical relationships (min, max, average, usual, unusual, the norm, an event), categorical relationships (part of group, not part of, related to, tagged in a specific way), etc.


### Application/Feature/Page\-focused Questions

Generative systems will let users automate many tasks as agent\-based systems become better at reasoning and following steps. We are not looking to replicate specific actions from an application, feature, or page but to use the activities around these interfaces to consider what users might expect to be able to do.

We want to consider how complex an application, feature, or page is to decide whether to consider conversational support to help the user use it or whether its functionality will likely be subsumed in a Gen AI flow or agent.

Also, while we can expect a Gen AI tool to find content from systems related to an application, page, or feature, it is better to specifically connect the Gen AI to authoritative learning content or knowledge articles that it should use to respond.

To understand what users might want to know about an enterprise application, consider asking the following types of questions.

**For pages, what does the user do on the page if it’s a:**


### Form

* How complex is the editing? Would users think to address it conversationally?
* How might the system help the user complete it conversationally?
* How does this relate to larger goals?


### Table

* What activities might they ask to do against the data?
* How many  are there?
* Does  exist?
* What state is  in?
* How much are all  worth?


### Dashboard

* What questions do users expect to answer?
* What inquiry paths would users follow from certain states of data?
* Is the thinking the dashboard represents captured anywhere (as a knowledge graph) that the AI can access so it can derive answers?


### Complex page (mixed content of cards, tables, carousels, calendars, etc.)

* What process does this page support? Is learning content or knowledge articles supporting it that can used by the Gen AI to help respond?
* Would the user request information about specific sections?
* Would the user request information across sections?


## Conclusion

Building innovative enterprise Gen AI experiences requires different roles to understand whether user needs and business goals can be met. The participants need to balance Gen AI’s benefits against its pitfalls. Unlike logic\-based experiences, Gen AI ones also come with trust, control, [and agency issues](https://readmedium.com/generative-ai-ux-design-adjectives-566168accef1). To create innovative products where Gen AI adds value *appropriately*, teams need to reassess the process of determining and defining products. This framework provides some of the structure needed to adjust the process.

Thanks to [Andrew Avedian](https://www.linkedin.com/in/andrew-avedian/), [Francesca Barrientos](https://www.linkedin.com/in/francescabarrientos), and [Andersson J Christoffer](https://medium.com/@andersson.j.christoffer), for their editorial support.


