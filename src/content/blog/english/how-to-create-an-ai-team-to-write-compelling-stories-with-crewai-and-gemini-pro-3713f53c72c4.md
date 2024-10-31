---
title: "How to create an AI team to write compelling stories with CrewAI and Gemini Pro"
meta_title: "How to create an AI team to write compelling stories with CrewAI and Gemini Pro"
description: "Are you fascinated by the idea of AI generating stories that capture the imagination? If so, you’re not alone! In this article, we’ll dive…"
date: 2024-10-31T23:04:49Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*tSnoOxxIGtrwdUT8"
categories: ["Programming", "Natural Language Processing", "Generative AI"]
author: "Rifx.Online"
tags: ["CrewAI", "Gemini", "screenwriters", "critics", "storytelling"]
draft: False

---



Are you fascinated by the idea of AI generating stories that capture the imagination? If so, you’re not alone! In this article, we’ll dive into an introductory project that combines the powers of CrewAI and Gemini Pro to create an agent network that crafts short stories with a little help from user input. Whether you’re a budding programmer, a storyteller looking to explore digital frontiers, or simply curious about the potential of artificial intelligence, this guide is for you.

## What are CrewAI and Gemini Pro?

Before we jump into the nuts and bolts of building our AI storyteller, let’s clarify what CrewAI and Gemini Pro are.

**CrewAI** is a fascinating framework designed to orchestrate multiple AI agents, each with its own unique skills and responsibilities, to collaborate on complex tasks. Think of it as a director managing a team of actors, where each actor plays a specific role to bring a story to life. In the context of our project, CrewAI enables us to create a team of specialized agents (like screenwriters, critics, and story masters) to work together on writing stories.

**Gemini Pro**, on the other hand, is a state\-of\-the\-art language model developed by Google. It’s known for its ability to understand and generate human\-like text, making it an ideal candidate for creative tasks such as storytelling. By leveraging Gemini Pro, we can ensure our agents have a solid foundation for generating compelling narrative content.

## Why is This Kind of Structure Important?

The combination of CrewAI and Gemini Pro enables a highly collaborative and specialized approach to story generation. This structure allows for:

1. **Specialization**: Each agent can focus on what it does best, whether it’s crafting dialogue, ensuring consistency, or overseeing the project.
2. **Collaboration**: Agents can work together, combining their strengths to produce a story that’s greater than the sum of its parts.
3. **Flexibility**: The setup is highly adaptable, allowing for different story elements to be emphasized or altered based on user input or creative direction.

## Setting Up the Environment

First, we will need some libraries to use. You can load these libraries via pip:

```python
pip install crewai
```

```python
pip install langchain-google-genai
```

After loading the necessary libraries we can start coding. We will start by importing our necessary modules and initialize our Gemini pro api connection.

As you may notice, we will need an API key for Gemini model. You can create this key in Google AI Studio for [free](https://ai.google.dev/). After that, you can copy this key into google\_api\_key variable or you can load it into environment by running this command in your command line:

```python
export GOOGLE_API_KEY=YOUR_KEY
```

Replace the api key that you will get from google ai studio with YOUR\_KEY.

Next, we define our agents: the Screenwriter, Critic, and Story Master. Each agent is assigned a role, goal, and backstory to guide its contributions to the story generation process.

For example, the Screenwriter is focused on translating ideas into engaging scenes, while the Critic ensures consistency and adherence to genre.

These agents will work together and create an engaging story. The story master will accept the task, then it will delegate and coordinate tasks between other agents. We allow this behavior by setting allow\_delegation parameter to True.

With our agents ready, we prompt the user for a story idea. This input is then used to create a task that outlines what the story should include, guiding the agents in their creative process.

While creating the task, we submit the task to the story master since it will coordinate our story creation process.

Finally, we should combine these agents into a crew and run our task.

And thats it. When we run this code, it will prompt the user to give a story idea and then write a short story by agent cooperation. Of course, there is much more than this in the CrewAI framework such as tool usage, hierarchical processing, working with ollama to run agents fully locally with different agents etc, but these topics are for another article.

You can find the full code in here for directly run:

You can use this code as a template for these kinds of applications, you can build game builder crew, stock analyzer crew, marketing crew etc. With imagination, sky is the limit. If you like this article and excited about the more advanced implementations you can visit the CrewAI [website](https://www.crewai.com/).


