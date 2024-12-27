---
title: "Building a Multi Agent based — “Auto Recursive” — Plan , Execute, Re-Plan Process"
meta_title: "Building a Multi Agent based — “Auto Recursive” — Plan , Execute, Re-Plan Process"
description: "The article discusses the development of a multi-agent system designed for a recursive plan-execute-replan process. It identifies the limitations of simpler agentic solutions and proposes a more sophisticated framework that utilizes a supervisor agent to manage configurations and facilitate communication among independent agents. The system is designed to adapt dynamically, allowing for human intervention when necessary and ensuring flexibility in calling external systems. This innovative approach aims to automate complex, multi-step processes effectively, showcasing its iterative and recursive capabilities."
date: 2024-12-27T12:59:06Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*V01_TB1pHE2c-bXGK9qxkg.png"
categories: ["Programming", "Autonomous Systems", "Generative AI"]
author: "Rifx.Online"
tags: ["multi-agent", "supervisor", "replanning", "Azure", "GenAI"]
draft: False

---




This blog has below 3 sections :

* The problem statement
* The solution approach
* Conclusions and References

**Problem Statement**

Plan, Execute \& Re\-Plan process is not new in the word of agentic solutions. We have been implementing these agent based plan\-execute\-re\_plan process since last year.

So, when one of my colleague was discussing the challenges of implementing the same, I was intrigued a I thought it was a problem well discussed.

But when I was talking to him, I understood the nature and the complexities of the scenario of what he planned to do and I thought it will be a good opportunity to work together.

So, to layout the content, below are the scenarios of what I though and what the problem statement was.

*Scenario 1 (what was my understanding) :*

Agentic solution can be designed in multiple ways. Agents can be designed as supervisor\<\-\> workers ; they can be designed as network of Agents talking to each other in a acyclic way; they can be hierarchical etc.

My understanding was that, in its simplest form, we can implement a plan\-execute\-re\_plan process using one Agent and multiple tools. This was good enough for simple use cases. When I shared the multi\-tool (single agent) used to solve this use case, we found that it served the simpler scenarios.

*Scenario 2(a bit more advanced but aligned to Langchain) :*

In this second scenario, I brought in another solution. I talked about Langchain’s own pre\-built agent that can help implement this loop. Trust me, this got us excited for quite sometime as it was able to loop through and iterate of the plan to generate execution outcomes. For more details about this — check out @ [https://github.com/langchain\-ai/langchain/blob/master/cookbook/plan\_and\_execute\_agent.ipynb](https://github.com/langchain-ai/langchain/blob/master/cookbook/plan_and_execute_agent.ipynb)

This is out of box agent that contains load\_chat\_planner and PlanAndExecute modules within the plan\_and\_execute Agent API.

This agent (provided by Langchain) was inspired by BabyAGI . The core of the solution focusses on planner and an executer.

*What is missing in these 2 scenarios (Scenario 3\):*

When I was talking to my colleague, the genuine issue that he was trying to solve was the dynamic adaptation of the agents to plan, take action and re\-plan based on previous action. The single Agent in scenario 2 was ok for certain scenarios — but when it comes to complex multi step process, it was struggling.

Secondly, in the plan\-execute\-replan process — we need more flexibility. We need to call external systems while planning and executing steps. This meant that we needed to design a recursive, multi agent system that can keep processing until it can effectively complete the goal.

So, without much ado, lets get started:

**Solution**

Let us start with the overall design of the plan\-execute\-replan process that we ended up designing. The overall solution is based on the multi\-agent framework I am working on for a while. I did write more than 10 blogs on the multi\-agent framework, you can find the links at the “conclusion” section below.

When the workflow starts, the initial supervisor agent kicks off. The supervisor agent can setup the initial configurations (like the acyclic DAG, memory, prompts etc.) so that the other independent agents can work in tandem to converge to the goal. This is depicted in step 2, 3, when the supervisor agent setup and initialization is achieved.

Next (in step 4\) — the DAG goes through the first agent — if the agent requires a human intervention (like the agent requires a human to ask a question or confirm a decision) — then the process pauses for human to take that action and maintains state.

In step 6\- the agent can call the associated tool to complete the agent action and based on that calls the next step of the process. The next step is the executor process that executes the command.

Next, the system checks if the task list is complete, if the whole set of task is complete then the system respons back to the user, else it calls the replanner agent in a recursive way as shown below.



To understand how the system behaves, I have another process flow that provides the use case level process flow (compared to the above architecture blueprint).

In this case — when the user asks a question — the planner agent is triggered, the planner will generate the detailed task list as shown. From that task list, the executor agent will be called recursively.

For the first task, the executor agent will call the appropriate tool to get the response. Based on response the re\-planner agent will be called. The re\-planner agent will decide if a replan is needed or not. It will also decide of all pending tasks are complete or not.

If complete, then it will collect the response and sent to user, else it will call the next step recursively.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*2Jv-lm15MSq-U0YhkgWhmg.png)

Now let us look into the solution. The solution is designed on Azure Gen AI Foundation framework with same look and feel (check the framework @ [https://medium.com/@nayan.j.paul/gen\-ai\-building\-adoption\-through\-a\-common\-platform\-instead\-of\-enabling\-be\-spoke\-use\-cases\-b0cbc2e185a8](https://medium.com/@nayan.j.paul/gen-ai-building-adoption-through-a-common-platform-instead-of-enabling-be-spoke-use-cases-b0cbc2e185a8))

The system asks us to provide a question based on which it will design the plan.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*KCtvixPWIpZVvjGFy1TL4A.png)

This is the same guardrails and state management which ensures that the system will not move forward unless the agent specific details are provided (in this case it is the question).

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*vpBO3zC4hDQ0R5CKTgDu-g.png)

I start by asking the system to give me quick steps to prepare expresso coffee. The question tiggers the iterative and recursive plan\-execute\-replan process. The system then goes to a auto\-drive mode recursively calling and executing next steps.

If we see below, it starts with the plan step to give me 3 steps to execute the process. Then it moved to execute plan to execute the first task.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*eIHDITFdLRlxzwDo75n-1A.png)

Once the first task is complete, the system automatically then identifies that the plan is in progress and then calls the re\-plan step. The replan step then calls the execute plan step again in loop untill we reach the end of all processing as below.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*rm5U2TWYyLZFCFMCQDBLDg.png)

All of this is automated where at every step the system makes decision to go to next step and process.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*P8B0_OhmsT8D9WvYNcEYrA.png)

This shows the iterative nature of this agentic solution where the processes are recursive and automated.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Tex4Rf0SrgFajxh5ZGM9Eg.png)

**Conclusion**

If you have any other question for me to try, do send them to me. I will share how the framework behaves in complex scenarios. I am testing this will customer use case now and I will keep you all posted.

Now, I have been working on Agents for quite a while now, below are some of the agentic use cases I implemented, I will mention these cases for your reference:

1. Overview of the whole ‘agentic solution’ @ [https://medium.com/@nayan.j.paul/implementing\-llm\-and\-gen\-ai\-applications\-using\-the\-world\-of\-llm\-agents\-37fab8889bd3](https://medium.com/@nayan.j.paul/implementing-llm-and-gen-ai-applications-using-the-world-of-llm-agents-37fab8889bd3)
2. Goal based agent development @ [https://medium.com/@nayan.j.paul/how\-i\-designed\-a\-tic\-tac\-toe\-agent\-in\-a\-multi\-agent\-setup\-with\-llm\-and\-gen\-ai\-3da646177980](https://medium.com/@nayan.j.paul/how-i-designed-a-tic-tac-toe-agent-in-a-multi-agent-setup-with-llm-and-gen-ai-3da646177980)
3. Exploratory Data Analysis using collection of agents @ [https://medium.com/@nayan.j.paul/designing\-exploratory\-analysis\-agent\-with\-gen\-ai\-large\-language\-models\-llms\-61310a1cd60f](https://medium.com/@nayan.j.paul/designing-exploratory-analysis-agent-with-gen-ai-large-language-models-llms-61310a1cd60f)
4. Designing hypothesis testing and pattern analysis agents @ [https://medium.com/@nayan.j.paul/designing\-hypothesis\-analysis\-agent\-with\-gen\-ai\-large\-language\-models\-llms\-a09aaf7016d4](https://medium.com/@nayan.j.paul/designing-hypothesis-analysis-agent-with-gen-ai-large-language-models-llms-a09aaf7016d4)
5. Designing a supply chain simulation modelling @ [https://medium.com/@nayan.j.paul/designing\-simulation\-modeling\-agents\-using\-gen\-ai\-large\-language\-models\-llms\-ed12f462c3f2](https://medium.com/@nayan.j.paul/designing-simulation-modeling-agents-using-gen-ai-large-language-models-llms-ed12f462c3f2)
6. Multi turn use case for car order placement @ [https://medium.com/@nayan.j.paul/multi\-turn\-goal\-based\-agents\-with\-large\-language\-models\-with\-practical\-use\-case\-49a78fcc79c4](https://medium.com/@nayan.j.paul/multi-turn-goal-based-agents-with-large-language-models-with-practical-use-case-49a78fcc79c4)
7. Scheduling assistant @ [https://medium.com/@nayan.j.paul/designing\-scheduling\-assistant\-agent\-using\-gen\-ai\-large\-language\-models\-llms\-7799d882ee6e](https://medium.com/@nayan.j.paul/designing-scheduling-assistant-agent-using-gen-ai-large-language-models-llms-7799d882ee6e)
8. Recursive Multi Agent Game (Wolf, Cabbage, Goat) — [https://medium.com/@nayan.j.paul/implementic\-recursive\-agentic\-solution\-wolf\-goat\-cabbage\-game\-using\-gen\-ai\-677506ecf906](https://medium.com/@nayan.j.paul/implementic-recursive-agentic-solution-wolf-goat-cabbage-game-using-gen-ai-677506ecf906)
9. O1 Model based Multi Agent System for Reasoning — [https://medium.com/@nayan.j.paul/root\-cause\-analysis\-use\-case\-with\-the\-new\-o1\-reasoning\-model\-e4f75e88403b](https://medium.com/@nayan.j.paul/root-cause-analysis-use-case-with-the-new-o1-reasoning-model-e4f75e88403b)
10. Multi Agent Back Order Propagation System — [https://medium.com/@nayan.j.paul/implementing\-back\-order\-prediction\-agent\-using\-gen\-ai\-large\-language\-models\-llms\-8eede590438e](https://medium.com/@nayan.j.paul/implementing-back-order-prediction-agent-using-gen-ai-large-language-models-llms-8eede590438e)
11. Shipping ETA prediction using Multi Agent System — [https://medium.com/@nayan.j.paul/implementing\-shipment\-eta\-prediction\-agent\-using\-gen\-ai\-large\-language\-models\-llms\-d0e9021bb54b](https://medium.com/@nayan.j.paul/implementing-shipment-eta-prediction-agent-using-gen-ai-large-language-models-llms-d0e9021bb54b)

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*kYqWimOJf0bUBzWe6Bq7dA.jpeg)


