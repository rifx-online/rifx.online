---
title: "Six Thinking Hats + CrewAI Flows: Smarter Decisions with AI Ag"
meta_title: "Six Thinking Hats + CrewAI Flows: Smarter Decisions with AI Ag"
description: "The article discusses the integration of AI agents with Edward de Bonos Six Thinking Hats methodology to enhance decision-making processes. It emphasizes the importance of using AI as a complement to human expertise, focusing on validation of AI outputs. CrewAIs latest features enable users to create complex workflows and multi-agent systems that facilitate structured decision-making. By leveraging AIs analytical capabilities while maintaining human judgment, this approach aims to improve the quality of decisions across various contexts, from business strategies to personal choices."
date: 2024-11-25T15:00:22Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*blFudLTNGRrNB1gE"
categories: ["Programming", "Machine Learning", "Decision Making"]
author: "Rifx.Online"
tags: ["AI", "decision-making", "validation", "workflows", "multi-agent"]
draft: False

---







> “It seemed like a good idea at the time.”


> \- From \*The Magnificent Seven\*








## Leveraging AI Agents for Informed Decision\-Making

“It seemed like a good idea at the time.” This line, borrowed from \*The Magnificent Seven\*, is often a sentiment we all share when reflecting on past decisions. Sometimes, we can’t help but wonder if having more information could have helped us make better choices. But how do we make decisions, anyway? We rely on our own knowledge — information stored in our minds, perhaps indexed and stacked away — as well as the insights of experts. But in today’s world of AI, who exactly are the experts?

**The Rise of AI as Experts**

The answer could be generative AI models or applications and agents that draw from these advanced models. Let’s talk about agents for a moment. Imagine having a multitude of specialized agents at your disposal — tools that not only supplement your knowledge but perhaps even spark new ideas. This extra push could make our next steps easier, more informed, and perhaps even more creative.

**Using External Sources**

In a way, this isn’t entirely new to us. Think about how we’ve used Google searches to step into roles we’re not truly experts in. For example, doctors often talk about “Google\-trained patients” who want to co\-create their treatment plans, despite lacking the expertise to validate the solutions they find. In this sense, we’ve been feeding on external sources of information — albeit imperfectly — for years.

**The Importance of Validation**

The real challenge, then, becomes validation. If we’re using AI applications and agents, the key is to validate their outputs, to the extent possible. Logically, we should apply these AI\-driven solutions in areas where we can either manually validate them or at least have some confidence in doing so. A scenario like a real\-estate transaction might be appropriate, but a highly specialized medical treatment may not be.

**Building Agents with CrewAI**

With this in mind, let’s explore building a few agents using CrewAI, integrating them with GPT models as we’ve learned in the recent course from deeplearning.ai. These agents could act as our digital experts, helping us navigate complex decisions, while always keeping in mind the critical role of validation and human judgment.

**Human\-AI Collaboration**

One important aspect we must consider is the collaborative potential between humans and AI agents. By viewing AI not as a replacement but as an augmentation of our own skills, we can achieve a synergy that allows us to push beyond our typical limitations. This partnership can enable us to focus on creative, strategic aspects of problems while letting AI handle more routine analysis, multiple loops of reflection (such as “should I have done this or not” or “did I think this through thoroughly” kinds of never\-ending thought trains), and data\-heavy tasks. Such a division of labor not only improves efficiency but also gives us the freedom to tackle more ambitious challenges.

**Decision\-Making with Edward de Bono’s Six Thinking Hats**

To enhance decision\-making, we can draw inspiration from Edward de Bono’s Six Thinking Hats methodology, a powerful tool for structuring both personal and professional decision\-making. By using AI agents that emulate the different roles of the Six Thinking Hats — white (facts and information), red (emotions), black (caution), yellow (positivity), green (creativity), and blue (management and control) — we can gain a balanced perspective on our challenges. Imagine an AI\-powered decision\-making toolkit that helps you explore all these dimensions effectively, ensuring no aspect is overlooked. This can be especially valuable in both business contexts, where strategic decisions need a well\-rounded approach, and in personal decisions, where emotions and creativity often need structure.

This article will explore a simple implementation of Six Thinking Hats methodology using the latest feature of CrewAI\- Flows.


## A quick summary of CrewAI’s latest features from their Deeplearning.ai course.







CrewAI is a platform for building and deploying multi\-agent AI systems. The platform focuses on practical applications and allows users to create agents that work together to achieve common goals or solve complex tasks.

Users can now organise agents into workflows, connect multiple crews to form pipelines, test and train agents for optimal performance, and leverage external tools to build sophisticated applications.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*y6BziQsFioR61tnKpyfqHA.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Ridtl40yeyjxgni7r3gKVw.png)

* **More complex agent workflows:** The platform now allows users to organize agents into more complex workflows, such as connecting multiple groups of agents, having agents work in hybrid settings, enabling parallel task completion, and reporting results to higher\-level agents. Flows now allow running python code before/during/after multiple crews’ executions

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*R0MxGJADhufLprdnL23gag.png)

* **Pipeline creation through multiple crews:** Users can now build pipelines by combining multiple crews, with one crew’s output conditionally passed to another crew for further tasks.
* **Performance testing and training:** crewAI enables the creation of evaluations to assess crew performance and provides live human feedback mechanisms for agents to improve their behavior over time.
* **Integration with external tools:** Users can now build more advanced agent\-based apps and automations that utilize external tools.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*mR6syF8kUhlz01r7G4dYRw.png)

* **Easy deployment using CrewAI cloud**: Users can now use these agents/crews/flows via simple API integration.


## Implementing Six Thinking Hats with CrewAI Flows: A Simple Technical Guide

This implementation leverages CrewAI’s Flow feature to create a structured decision\-making pipeline based on Edward de Bono’s Six Thinking Hats methodology. The system processes decisions through multiple specialized agents, each representing a different “thinking hat,” and synthesizes their insights into actionable recommendations.

**Prerequisites**

* Python environment with CrewAI installed
* OpenAI API key or compatible LLM setup
* Basic understanding of YAML configuration
* Familiarity with Python classes and async programming

**Implementation Architecture**

*1\. Configuration Structure*

The implementation uses two YAML configuration files:

* `six_hats_agents.yaml`: Defines the agent roles and characteristics
* `six_hats_tasks.yaml`: Specifies the tasks each agent performs

The separation of concerns allows easy modification of agent behaviors and task definitions without changing the core logic.

*2\. Agent Roles*

Eight specialized agents are implemented:

* White Hat: Information Gatherer
* Red Hat: Emotional Evaluator
* Black Hat: Critical Analyzer
* Yellow Hat: Benefit Finder
* Green Hat: Creative Thinker
* Blue Hat: Process Controller
* Synthesis Specialist
* Implementation Strategist

**3\. Flow Pipeline Structure**

The decision\-making pipeline is implemented as a `DecisionMakingPipeline` class inheriting from CrewAI's Flow:


```python
class DecisionMakingPipeline(Flow):
    @start()
    def get_decision(self)
    @listen(get_decision)
    def perform_hat_analysis(self, decisions)
    @listen(perform_hat_analysis)
    def synthesize_and_plan(self, analyses)
    @listen(synthesize_and_plan)
    def finalize_recommendation(self, recommendations)
```
**4\. Key Implementation Steps**

*a. Environment Setup*

* Install required packages
* Configure environment variables
* Load YAML configurations

*b. Agent Creation*

* Initialize each agent with their respective roles
* Configure agent parameters (verbose, delegation settings)
* Assign specific tools if needed

*c. Task Definition*

* Create tasks for each analysis type
* Link tasks to appropriate agents
* Define expected outputs and formats

*d. Crew Assembly*

* Create analysis crew with six hat agents
* Create synthesis crew with specialist agents
* Configure crew settings and interaction patterns

*e. Flow Implementation*

1. Decision Input (`get_decision`):
* Formats initial decision data
* Prepares context for analysis

2\. Hat Analysis (`perform_hat_analysis`):

* Parallel processing of perspectives
* Collection of diverse viewpoints

3\. Synthesis (`synthesize_and_plan`):

* Integration of analyses
* Formation of recommendations

4\. Finalization (`finalize_recommendation`):

* Structured output creation
* Action plan development

**Best Practices**

1. *Error Handling*
* Implement robust error catching in each flow stage
* Provide fallback mechanisms for agent failures
* Log issues for debugging and improvement

***2\.*** *Data Flow*

* Maintain consistent data structures between stages
* Validate outputs before passing to next stage
* Consider using Pydantic models for data validation

*3\. Performance Optimization*

* Use parallel processing where possible
* Implement caching for repeated analyses
* Monitor token usage and optimize prompts

*4\. Extensibility*

* Design for easy addition of new hat perspectives
* Allow for custom agent and tool configurations
* Support different output formats

**Usage Examples**

1. *Basic Decision Analysis:*


```python
flow = DecisionMakingPipeline()
results = flow.kickoff()
```
*2\. Saving Results:*


```python
def save_decision_results(results, filename='decision_analysis.md'):
    # Implementation for saving results to file
```
3\. *Plotting the flow*


```python
flow.plot()
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ib3qK2g1m0GDuFxdZC6Gyw.jpeg)

**Future Enhancements**

1. *Integration capabilities:*
* API endpoints for remote access
* Web interface for interaction
* Database storage for decision history

*2\. Advanced features:*

* Custom hat perspectives
* Real\-time collaboration
* Decision tracking and analytics

**Troubleshooting**

Common issues and solutions:

1. *Token limits*: Optimize prompt lengths
2. *Async execution errors in Google Colab*: Check event loop handling
3. *Configuration loading*: Verify YAML syntax
4. *Agent communication*: Monitor message passing

**Github link**


## Bringing It All Together: The Future of AI\-Enhanced Decision Making

As we’ve journeyed from the philosophical foundations of decision\-making to the practical implementation of the Six Thinking Hats methodology using CrewAI Flows, one thing becomes clear: we’re not just building tools; we’re reshaping how we approach complex decisions in the AI era.

The simple implementation we’ve explored gives a small inkling as to how modern AI technology can enhance traditional decision\-making frameworks. By combining Edward de Bono’s time\-tested Six Thinking Hats methodology with the capabilities of CrewAI’s multi\-agent system, we’ve attempted to create a bridge between human wisdom and artificial intelligence. This isn’t about replacing human decision\-making but rather about augmenting it with structured, comprehensive analysis that might be challenging for a single human mind to achieve alone.

Looking ahead, the potential applications are vast. From business strategy to personal life choices, this approach could help reduce cognitive bias, scale decision\-making capabilities, and provide consistent, well\-documented decision processes. However, as we mentioned at the start with that quote from \*The Magnificent Seven\* — “It seemed like a good idea at the time” — we must remember that all tools, no matter how sophisticated, require thoughtful application.

The key lies in maintaining the balance between leveraging AI’s analytical capabilities while preserving human judgment and intuition. Whether you’re a developer looking to implement similar systems or a business leader seeking to enhance your decision\-making processes, remember that the goal isn’t to make perfect decisions — that’s likely impossible — but to make better, more considered ones. By combining traditional wisdom with cutting\-edge AI technology, we’re taking significant steps toward that goal.


