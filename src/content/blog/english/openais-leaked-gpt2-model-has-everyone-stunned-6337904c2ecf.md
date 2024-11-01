---
title: "OpenAI’s ‘Leaked’ GPT2 Model Has Everyone Stunned."
meta_title: "OpenAI’s ‘Leaked’ GPT2 Model Has Everyone Stunned."
description: "On-Purpose leak?"
date: 2024-11-01T04:07:40Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*-G0yfSjGPdNw02NZ"
categories: ["Chatbots", "Generative AI", "Natural Language Processing"]
author: "Rifx.Online"
tags: ["GPT-2", "Chatbot", "Inference", "JSON", "AlphaGo"]
draft: False

---





### On\-Purpose leak?



The influence that OpenAI has on the AI industry can’t be understated. Every move or decision makes headlines automatically… even if they don’t actually announce the thing.

A few days ago, a model many of us played with that has since been deleted has the entire AI industry fascinated. Named “gpt2\-chatbot” it was accessible for a few days in the ‘Direct Chat’ function in [lmsys.org](https://chat.lmsys.org/).

*But why so much fuss?*

Well, because this model is unlike anything we have ever seen. **It’s on a completely different level.**

For this reason, many believe it has been the unofficial teaser of **ChatGPT\-4\.5** or even **GPT\-5**. Or, even more exciting, using the number ‘2’ as a signal that a **new GPT generation of long\-inference models is approaching**.

Even Sam Altman, CEO of OpenAI, couldn’t resist the temptation to acknowledge its existence and tease us in the process:







So, *how good is this model, and what on Earth is it?*


> You are probably sick of AI newsletters talking about how this or that \*\*just\*\* happened. And these newsletters abound because coarsely talking about events and things that already took place is easy, **but the value provided is limited and the hype exaggerated.**


> However, newsletters talking about what **will** happen are a rare sight. If you’re into easy\-to\-understand insights looking into the future of AI before anyone else does, **TheTechOasis** newsletter might be perfect for you.


> 🏝️🏝️ Subscribe today below:


## A Teaser of What’s to Come

With every passing day, it’s clear that OpenAI’s next model will be a leap in reasoning and complex problem\-solving.

And to prove how this new mysterious model might be it, here are just a few examples of the prowess of this mysterious model that could signal that the boat has landed in that port:


> All examples below are considered **hard or outright impossible** for the current state\-of\-the\-art models.

For starters, It solved a math\-olympiad problem in zero\-shot mode (without being provided with auxiliary examples to support the resolution):

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*oNPg_hTGc0OP90n9)

I can’t even start to explain how crazy the previous example is, it’s absolutely impossible to get such an answer from the current state\-of\-the\-art models.

[It’s also absolutely superb at parsing JSONs](https://twitter.com/skirano/status/1785035706173214888), a fundamental skill for LLM integration with APIs and other web\-based tools.

Also, it completely obliterates GPT\-4 at complex drawing tasks like [drawing SVG files based on code](https://twitter.com/decentricity/status/1785049191003361778) or **unicorns using ASCII code (below)**, humiliating **Claude 3 Opus**, the current state\-of\-the\-art, in the process:

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*5A0EcRU91ZYAwVAc)

Additionally, although this very well could have been a hallucination, **the model claimed to me that it was trained by OpenAI and based on a GPT\-4 variant.**

Of course, after such a demonstration of power, **many suggest that “gpt2\-chatbot” might even be the famous Q\* model**.

But instead of simply giving in to the different fanciful options people have claimed this is, let’s take a more sensible approach and see what OpenAI itself has been hinting at through their research for months (and years).


## The Power of Long Inference

For several months, experts in the space like [Demis Hassabis](https://www.youtube.com/watch?v=eqXfhejDeqA&t=2s) or [Andrej Karpathy](https://youtu.be/c3b-JASoPi0?si=fZWoSpLuSmua8YMR&t=1481) have discussed how LLMs alone simply aren’t it, and that we need ‘something else’ to really take them to the next step.

In both cases, they refer to achieving the equivalent of ‘AlphaGo but in LLMs’, which is indirectly referring to:

* **Self\-improvement** and
* **test\-time computation** LLMs

*But what do they mean by that?*


### A Giant Step for AI

AlphaGo is history of AI. It was the first model that unequivocally surpassed human might in the game of **Go**, a Korean board game.

It used **Monte Carlo Tree Search**, a search algorithm, to explore the realm of possible moves for any given step in the game, being able to go beyond the current action and predict what the opposing player would do.


> Some of you might remember **Deep Blue** too, the chess machine that barely beat Gary Kasparov in the second game in their series back in 1997 after losing the first game.


> However, while Deep Blue could be beaten, AlphaGo was invincible.

*But how?*


### Self\-improving to go Superhuman

The key element that made AlphaGo superior was how it was trained, **by playing against lesser versions of itself to create a self\-improvement loop.**

It consistently played against itself, gradually improving its ELO to 3\.739, almost at the level of today’s best Go player.


> In 2017, AlphaZero, an improved version, achieved a 5\.018 ELO, completely superhuman and unbeatable.

In other words, with AlphaGo humans had achieved, for the first time, a way to train a model by self\-improvement, allowing it to achieve superhuman capacities **as it no longer relied on imitating humans to learn.**

In case you’re wondering, this is not the case for LLMs.

Current LLMs are completely chained to human\-level performance, as all data and training are inherently human\-dependent (to the point that [the alignment phase](https://thewhitebox.ai/llms-the-backbones-of-frontier-ai/), the part of the training process where LLMs are modeled to improve their safety levels and avoid offensive responses, **is strictly executed using ‘human preferences’**).


> On a side note, [Meta recently proposed Self\-Rewarding Models](https://arxiv.org/pdf/2401.10020v1) that could self\-improve with their own responses. However, it’s unclear whether this feedback loop really can make LLMs superhuman.

But even though it still feels hard to believe that “gpt2\-chatbot” has been trained through self\-improvement, **we have plenty of reasons to believe it’s the first successful implementation of what OpenAI has been working on for years: test\-time computation**.


### The Arrival of test\-time computation models

Over the years, several research papers by OpenAI have hinted at this idea of skewing models into ‘heavy inference’.

For example, back in 2021, [they presented the notion of using ‘verifiers’](https://arxiv.org/pdf/2110.14168) at inference to improve the model’s responses when working with Math.

The idea was to train an auxiliary model that would evaluate in real\-time several responses the model gave, choosing the best one (which was then served to the user).

This, combined with some sort of tree search algorithm like the one used by AlphaGo, with examples like Google Deepmind’s [Tree\-of\-Thought research](https://arxiv.org/pdf/2305.10601) for LLMs, and you could eventually create an LLM that, before answering, explores the ‘realm of possible responses’, **carefully filtering and selecting the best path toward the solution.**

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*pHWwOA66fxpKbl-z)

This idea, although presented by OpenAI back in 2021, has become pretty popular these days, [with cross\-effort research by Microsoft and Google applying it to train next\-generation verifiers](https://arxiv.org/pdf/2402.06457), and with Google even managing to create a model, [Alphacode](https://storage.googleapis.com/deepmind-media/AlphaCode2/AlphaCode2_Tech_Report.pdf), that executed this kind of architecture to great success, **reaching the 85% percentile among competitive programmers, the best humans at it.**

*And why does this new generation of LLMs have so much potential?*

Well, **because they approach problem\-solving in a very similar way to how humans do**, through the exercise of deliberate and extensive thought to solve a given task.

Bottom line, think of ‘search\+LLM’ models as AI systems that allocate a much higher degree of compute (akin to human thought) to the actual runtime of the model so that, instead of having to guess the correct solution immediately, they are, simply put, ‘given more time to think’.

But OpenAI has gone further.


### PRM Models for Improved Maths Execution

Back in May last year, they released the paper [Let’s Verify Step\-by\-Step](https://arxiv.org/pdf/2305.20050), with the participation of the man himself Ilya Sutskever, Chief Scientist at OpenAI, and some of the researchers from the original verifier paper like Karl Cobbe.

The idea here is to modify the reward model used during the alignment phase of the model.

[Although I recommend checking this article for a full guide on LLM training](https://thewhitebox.ai/llms-the-backbones-of-frontier-ai/), the last step in the process of creating products like ChatGPT is the use of Reinforcement Learning from Human Feedback, or RLHF.

The idea is for the model to improve its decision\-making. Thus, we train an auxiliary reward model (which is essentially an almost identical copy of the model being trained) that learns to rank the results of the trained model according to human preferences.

*The issue?*

Well, most reward models today are **ORMs, or Outcome\-Supervised Reward Models**. In layman’s terms, to evaluate the degree of correctness or the model’s prediction, they look at it globally, disregarding the entire ‘thought process’.

On the other hand, **PRMs, or Process\-Supervised Reward Models, evaluate every single step in the response of the model**. Consequently, they ‘force’ the model to pay close attention and effort to every single step of the process, which is crucial in situations like solving a maths equation like the one below:

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*8JC6sZl5UFfl3WorliQy-A.png)

However, this is a very, very expensive process as the preference data requires heavy human crafting so that the supervisory signal can be applied. Consequently, every single training example has dozens or more rewards to measure.

Therefore, “gpt2\-chatbot” might have included some sort of variation of the reward training considering how proficient it is at generating plans and executing complex problem\-solving.


## Impossible not to Get Excited

Considering gpt2\-chatbot’s insane performance, and keeping in mind OpenAI’s recent research and [leaks](https://www.reuters.com/technology/sam-altmans-ouster-openai-was-precipitated-by-letter-board-about-ai-breakthrough-2023-11-22/), we might have a pretty nice idea by now of what on Earth this thing is.

What we know for sure is that we are soon going to be faced with a completely different beast, one that will take AI’s impact to the next level.

* *Have we finally reached the milestone for LLMs to go beyond human\-level performance as we did with AlphaGo?*
* *Is the age of long inference, aka the conquest of System 2 thinking by AI, upon us?*

Probably not. However, it’s hard not to feel highly optimistic for the insane developments we are about to witness over the following months.

In the meantime, I guess we will have to wait to get those answers. But not for long.


> On a final note, if you have enjoyed this article, I share similar thoughts in a more comprehensive and simplified manner for free on my [LinkedIn](https://www.linkedin.com/in/ignacio-de-gregorio-noblejas/).


> If preferable, you can connect with me through [X](https://twitter.com/TheTechOasis1).


> Looking forward to connecting with you.


