---
title: "How to make more reliable reports using AI — A Technical Guide"
meta_title: "How to make more reliable reports using AI — A Technical Guide"
description: "The article provides a technical guide on enhancing the reliability of AI-generated reports based on the authors experience in AI software development. Key strategies include using Markdown for better model comprehension, crafting clear prompts, selecting appropriate models based on task requirements, and employing effective prompting techniques like Chain-of-Thought. It emphasizes the importance of a streamlined AI system to reduce API calls for improved reliability and suggests utilizing evaluation pipelines for continuous optimization. The guide serves as a checklist for practitioners aiming to enhance their AI reporting processes."
date: 2024-11-25T15:00:22Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*P4K2D_t-DnC3xFv6AziA8A.jpeg"
categories: ["Programming", "Machine Learning", "Natural Language Processing"]
author: "Rifx.Online"
tags: ["Markdown", "prompts", "models", "Chain-of-Thought", "optimization"]
draft: False

---





### Technical guide, sharing my experience of working with AI



Over the past year, I’ve been running my own AI software development and consulting agency, working with a variety of clients — from startup founders to academics. During this time, I’ve taken on projects from a wide range of fields, including digital marketing, SaaS, and cybersecurity. While the goals and objectives of each project have varied, one common request has been the need to create reliable reports for stakeholders or end customers using AI. Almost all of my clients had a milestone within the project to make reports.

Through these experiences, I’ve gained valuable insights into the common challenges, mistakes, and best practices in AI software development. In this post, I want to share what I’ve learned about AI\-generated reporting and how to make these reports more reliable and practical.

This isn’t an exhaustive guide — it’s shaped by my personal opinions and experiences. I’d love to hear your thoughts, feedback, and suggestions for improvement, especially from fellow AI engineers and consultants!


## Covering the basics

These are simple, quick wins that can significantly improve your AI system with minimal effort. They’re some of the most effective things I’ve come across and are always at the top of my to\-do list when building AI systems.


### Small wins

Start by checking if you’re doing these simple things:

* **Use Markdown**: If your prompt includes a table, format it in markdown. LLMs are trained on markdown text, so they understand it better and often respond in markdown too.
* **Make your prompts clear**: Just like people, LLMs can get confused by unclear instructions. The way you phrase your prompts affects the quality of the response. To make things clearer, you can even ask the LLM to help you rewrite the prompt while chatting with it.


### Using the right LLM/ API configurations:

It’s tempting to rely on top LLMs like GPT\-4o or Claude 3\.5\. While they’re great for general tasks, you might get better results with other models depending on the specific task. You can check online LLM leaderboards to see which models perform best for different tasks. Even if GPT\-4o or Claude 3\.5 is the right choice, tweaking settings like max tokens or temperature, or caching your prompts, can improve performance.

One limitation I often encounter with GPT\-4o and Claude 3\.5 is their lack of long context windows. For some tasks, like generating detailed reports, a longer context window is more useful. In such cases, models like Gemini 1\.5, which supports up to 2M tokens, are a better fit.


### Using common prompting techniques

Having trouble getting the LLM to respond properly? Try adding a phrase like *“Explain your reasoning step by step.”* This simple tweak often leads to better, more accurate responses. This approach is known as **Chain\-of\-Thought prompting**.

There are many other prompting techniques, like **ReAct**, which help the LLM choose tools or agents more effectively. You can experiment with these techniques manually, or use frameworks like DSPy, which have built\-in methods to easily add and test different prompting strategies.

Another important step is adding few\-shot examples, here is where long context windows can come really in handy. By adding variants of the answers you expect, the models are more likely to respond better.

Still struggling to get reliable outputs from AI?Reach out for help, using this link:https://eu.jotform.com/agent/01936317e669754bbebb321da59458adfd49


### Using the right framework

Choosing the right agent or LLM framework can be a hot topic. In my opinion, it’s best to use the API directly or go with a lightweight framework like DSPy, which is also designed with evaluation in mind (the importance of which I explain in the next section). Some frameworks can overcomplicate your program unnecessarily.

For instance, many frameworks come with built\-in task\-specific templates. While this can make it easy to get started, it often makes it harder to create reliable AI systems tailored to your needs. These templates are often unoptimized, waste context space with unnecessary tokens, and limit flexibility. Not to mention there are many bugs that arise from using them, which make it harder to program.

On the other hand, DSPy doesn’t use templates. Instead, each LLM program is built using *signatures*, which are simply a combination of prompts, inputs, and outputs.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*XoHdXRBojz8CxZw_NlWpeQ.png)

If you are struggling with LLM outputs, make sure you cover these basics. The next section will focus more on advanced optimizations you can do to improve reliability.


## Evaluations

One way to improve your LLM program is by “nudging” it toward the right output. This isn’t the same as fine\-tuning; it’s about figuring out the best way to phrase your prompts, inputs, and outputs so the program works effectively.

You might wonder, how do you know which phrasing works best? The answer is by using an evaluation pipeline. In this post, I’ll give a high\-level overview of what evaluations are and how they work. If you’re looking for a detailed guide, I’ve shared a step\-by\-step example here:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*Ftd2LtE5C3_onWY0.png)

On a high level, an evaluation pipeline works like this, first, you get a set of queries, inputs, and “expected” outputs. Then you design a metric, which measures how good an output is based on the task. For example, for a text\-to\-SQL program, you can create a metric that gives a score to queries that can successfully run, have the right column names, and are relevant to user queries.

Once, you have the metric you can score your LLM program outputs, and measure them against your expected outputs. You can then generate new instructions for your program and measure them. Iterating this would give you better or optimized instructions. There are many algorithms in prompt optimization, you can use DSPy to automate these pipelines for you.


## Simplify the AI system

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*SznN18SFXO4bUkiw2rKOLg.png)

The last point is about the complexity of an AI system. Advocating for simplicity is not new in software design principles but it is much more important for large language model\-based software. The reason is that LLM outputs are probabilistic, not deterministic.

Even if a LLM call has a 95% probability of generating the correct output, and your program relies on 10 API calls every run. The probability of a reliable output from the system is (0\.95\)¹⁰ \= 0\.598 or 60%. You should try to achieve your task with the least amount of LLM calls. A system that gets the job done in 2 calls as opposed to 3 is exponentially better.

No algorithm will reduce the number of API calls for you, it requires good engineers to design the system well and constantly rethink components.

Hint: maybe a long context model can one\-shot it more reliably than a top\-tier small context model can in 2 API calls. Or perhaps you have too many intermediary steps in your system flow.

Putting effort into designing the system has huge savings in terms of reliability later on!

Want an expert to simply your AI pipeline?Reach out for help, using this link:https://eu.jotform.com/agent/01936317e669754bbebb321da59458adfd49


## Conclusion

Use this checklist to ensure your maximizing reliability


### 1\. Quick Fixes

* **Use Markdown:** Format tables in markdown for better LLM understanding.
* **Write Clear Prompts:** Avoid confusion with clear, concise instructions.


### 2\. Optimize Models

* Choose the right model for the task; check LLM leaderboards.
* Adjust settings (e.g., max tokens, temperature) for better performance.
* Use long\-context models like Gemini 1\.5 for detailed tasks.


### 3\. Smart Prompting

* Add phrases like *“Explain step by step”* for better accuracy (Chain\-of\-Thought).
* Include a few\-shot examples to guide responses.


### 4\. Choose the Right Framework

* Avoid overly complex frameworks; use lightweight options like DSPy.


### 5\. Evaluate and Iterate

* Use evaluation pipelines to test and optimize prompts, inputs, and outputs.


### 6\. Simplify Your System

* Minimize API calls to boost reliability.
* Streamline components for simpler, more efficient workflows.

This checklist is by no means exhaustive, these are just things we at FireBird Technologies have learned by working with clients. Please do follow, share, and comment.

Thank you for reading!


