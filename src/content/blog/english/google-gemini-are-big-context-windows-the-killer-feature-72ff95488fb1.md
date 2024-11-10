---
title: "Google Gemini: Are Big Context Windows the Killer Feature?"
meta_title: "Google Gemini: Are Big Context Windows the Killer Feature?"
description: "Goggle’s upcoming LLM makes a massive move"
date: 2024-11-10T22:36:54Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*MteQrQSTXLuJcd86RbjQrg.png"
categories: ["Machine Learning", "Natural Language Processing", "Data Science"]
author: "Rifx.Online"
tags: ["Gemini", "tokens", "context", "LLM", "evolution"]
draft: False

---

### Goggle’s upcoming LLM makes a massive move



Barely eight months ago, a leaked Google email revealed the company was struggling to outpace its AI rivals. Not only was there [no moat](https://www.semianalysis.com/p/google-we-have-no-moat-and-neither) around their AI offerings — in other words, no built up business advantage— Google also had [no secret sauce](https://www.semianalysis.com/p/google-we-have-no-moat-and-neither) that could change things. And even as they were grappling with the problem, they were watching the gap between privately funded AI projects like theirs and open source AI models closing with “astonishing” speed.

It’s too soon to know how this story ends. Maybe open source AI will continue to build on its early successes, or maybe it will be smothered by the AIs run by massively wealthy competitors like Google, Microsoft, and Apple, and their mind\-boggling quantities of data. Right now the conflict is still unfolding, as different organizations roll out a rapid series of AI advancements. Recently, Google took the spotlight in this arena, when it announced a preview of its newest LLM, [Gemini 1\.5 Pro](https://deepmind.google/technologies/gemini/). Another day, another Large Language Model — or so it seemed, until Google described a startling change.

Gemini 1\.5 Pro explodes the *context window*—essentially, a measure of how much data an LLM can track at once. In past versions, Gemini had a context window of up to 128,000 tokens, just like GPT\-4\. But Gemini’s new context window fits **1 million** tokens, and the implications of that change are enormous.

But before we can talk about the effect of context windows on LLM capabilities, we need to back up and quickly review how context windows work.

## Context windows (in a nutshell)

In simple terms, the context window sets how much of your information an LLM can remember during an interaction. If you’re using ChatGPT, for example, the context window consists of the current prompt you gave it, everything else you’ve typed in to that conversation before, and every reply ChatGPT has sent back your way. Talk long enough, and the old parts of the conversation will slip out of the context window, and ChatGPT will abruptly forget those details.

A 128,000 token context window sounds large, but the number is deceptive. First, consider that an average word is actually 1 to 3 tokens when it’s broken down for an LLM. (The rule of thumb is 4 tokens for 3 words, but it increases as the language becomes more complex or in specialized fields, like law or medicine.) When you look at long documents, ongoing interactions, and AI\-powered applications, you’ll quickly find that you can’t fit everything you want an LLM to know in its context window.

For that reason, we’ve developed some clever ways to work around the context window limitation. For example:

* **Chunking.** You can break down a large amount of data and get the LLM to look at it one piece at a time. This works well for some tasks (summarizing a long document), but not as well if you need to analyze concepts that span the entire document.
* **Fine\-tuning.** You can train the LLM with your specific data. The key problem, other than time and expense, is that your new data is easily overwhelmed by the much larger set of general purpose training data the LLM has already absorbed. Often, it just won’t stick. And besides, many LLMs don’t support fine\-tuning at all — including GPT\-4 and Gemini.
* **Retrieval augmented generation (RAG).** First, you convert your text content into a special representation, called *embeddings*. (Embeddings are an important part of how LLMs work. Essentially, they’re a numeric representation that captures the meaning of content.) Once you have the embeddings, you place them in a vector database. Now you can use the magic of *semantic search* to look at a prompt and find pieces of conceptually related content in your database, which you feed into the LLM. In other words, you’re giving it just the important stuff.

The last point is the most common approach today. RAG is efficient and predictable. It works amazingly well if you have a massive collection of loosely related documents. For example, imagine you’re creating a tech support chatbot that draws its information from your company’s knowledge base articles. With RAG, you find the relevant data, and give that to the LLM with your prompt. Essentially, you’re telling the LLM where to look when it answers a prompt.

But RAG isn’t perfect. It forces you to spend much more time preparing your data. It doesn’t make it easy to jump into a completely new dataset. And it’s not effective if you really do need to consider a huge bulk of information at once — for example, it you’re looking for overarching themes in a novel or features in a codebase. But despite its limitations, RAG is pretty close to a best practice today.

At least, it was until Gemini 1\.5 Pro flipped the script.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*EEHKDSH0wXa-J6veK5etZA.png)

## The wow moment

Although Gemini 1\.5 Pro isn’t released yet, it’s available in a tightly limited trial. And the results have been eye opening.

Some of the most impressive examples show Gemini creating analyses that span massive bodies of knowledge. Google’s demos are predictably impressive, but they’ve been accused of staging demonstations and cherry picking examples in the past. I’m more interested in independent testers, who have reported results that are no less remarkable.

For example, Conor Grennan [fed a 300 page novel](https://www.youtube.com/watch?v=-MKGsijn5tI) to Gemini and asked it to describe main characters, find plot twists, and identify examples of characters feeling certain emotions. Gemini had no trouble developing nuanced arguments that reasoned across the entire span of the book. Jeff Delaney, the creator of the popular [Fireship channel](https://www.youtube.com/c/fireship) on YouTube, fed Gemini an entire codebase with thousands of files and asked it to add new features. Not only did Gemini write the correct code, it followed the style of the existing project, using the components, libraries, and conventions that were already established. Other demonstrations show Gemini identifying issues in an application, extracting key examples, and writing API documentation.

And if you want something else to fill up Gemini’s enormous context window, there’s another new feature — video. Video is tokenized differently than words, and takes much more space. But even so, a 1 million token context window can hold about an hour of video — enough to look through a movie and answer complex questions about its content. That’s what Google did when it asked Gemini to [find specific details](https://www.youtube.com/watch?v=wa0MT8OwHuk) in a Buster Keaton movie, like the words written on a scrap of paper in a scene they didn’t identify.

## The LLMs of the future

Are large context windows the way of the future? Up until now, the common wisdom was that large context windows were a partial solution at best. We worried that they’d be prohibitively expensive in compute time. [One study](https://www.voiceflow.com/blog/the-context-window-paradox-why-bigger-might-not-be-better) found that LLMs weren’t particularly good at finding information in the middle of long context windows, and performed better with details that occurr towards the beginning or end. All these factors supported the same conclusion: Brute forcing your content into the context window was naïve and cost\-prohibitive. Dumping all your data into one request wasn’t every going to be the right way to talk to an LLM.

Now it seems like the future has suddenly shifted. Large context windows are on the horizon, and they could give LLMs a more capable, holistic understanding of broad knowledge sets. Tasks that were impossible to do with text last year are about to become possible now *in video*. And Google Research is playing with a variant of Gemini that expands the context window to a staggering 10 million tokens.

Two facts are clear. First, picking a winner in the LLM wars is a fool’s game. And second, the pace of change isn’t slowing — it’s picking up speed.


