---
title: "Bolt DIY + Deepseek V3 + Gemini 2.0: The Free AI Coder"
meta_title: "Bolt DIY + Deepseek V3 + Gemini 2.0: The Free AI Coder"
description: "Bolt DIY is an open-source browser-based tool for building full-stack applications, allowing users to select from various AI models, including Deepseek V3 and Gemini 2.0. It features error detection, GitHub sync, Docker support, and customizable prompts. Users can start easily with Node.js or Docker, and the platform encourages community involvement. The tool is particularly beneficial for developers seeking an efficient coding assistant without cost, providing a seamless development experience through its integrated features."
date: 2025-01-09T02:11:36Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*en7w1g9A-w9NlEuneL_TYQ.jpeg"
categories: ["Programming", "Technology/Web", "Generative AI"]
author: "Rifx.Online"
tags: ["Bolt", "Deepseek", "Gemini", "Docker", "Node.js"]
draft: False

---






Hey, have you heard about Bolt DIY?

It’s super cool, and I bet you’ll love it.

Imagine having a smart AI helper right in your browser that can help you code full\-stack apps.

The best part? It’s free and super flexible.

Let me explain how it works.


## What is Bolt DIY?

So, Bolt DIY is an open\-source tool (it used to be called oTToDev, just in case you’ve heard of that).

It lets you build full\-stack apps directly in your browser but here’s the fun part — you get to choose which AI model helps you with your coding tasks.

Here are some of the models you can pick from:

* OpenAI
* HuggingFace
* Gemini
* Deepseek
* Anthropic
* Mistral
* LMStudio
* xAI
* Groq

But that’s not all!

You can add even more models using the Vercel AI SDK.

This means you can totally customize it to work how you want.

Plus, there’s a feature called “Bolt DIY Expert” that can answer your questions.

It’s all part of a big community project and it’s growing really fast.


## Why Should You Care About Bolt DIY?

Here’s why Bolt DIY is awesome:

* **Multiple Models:** Pick your favorite AI model, and you can even switch mid\-project.
* **Error Fixes:** It spots and fixes errors for you — like a super\-smart buddy for debugging.
* **Visual Selection Tool:** Highlight parts of your code to easily make changes.
* **GitHub Sync:** Connect to your GitHub projects, work on them, and push updates directly.
* **Docker Support:** If you like using Docker, this tool’s got you covered.
* **Version Control:** Go back to older versions of your code without any hassle.
* **Portable Projects:** Save your project as a ZIP file so you can take it anywhere.
* **Custom Prompts:** Use a built\-in library with ready\-made prompts for different coding tasks to save time and boost creativity.

This is just scratching the surface but you get the idea—it’s like a Swiss Army knife for developers.

To better understand how Bolt DIY streamlines your development workflow, let’s look at how these features work together:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*lgpzK0gYG89KKJbt6EOKUw.png)

This workflow demonstrates how Bolt DIY integrates AI models, error handling and export options to create a seamless development experience.

You can start with any AI model, generate code and let Bolt DIY automatically handle errors while maintaining multiple export options.


## Let’s Get You Started

Getting started with Bolt DIY offers two straightforward paths.

Here’s a visual guide to help you choose:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*y1xS_8CDoSrMR2113mYq4Q.png)

Let’s walk through each installation method in detail.

Getting started is simple.

Let’s walk through it step by step.


> **Option 1: Install Directly**

**Install Node.js:**

* Download the LTS version from [here](https://nodejs.org/).
* Verify installation (for Windows, check the Path variable; for Mac/Linux, run `echo $PATH`).

**Clone the Repo:**


```python
git clone https://github.com/stackblitz-labs/bolt.diy.git
```
**Install Dependencies:**


```python
npm install -g pnpm pnpm install
```
**Run the App:**


```python
pnpm run dev
```
Open your browser and you’re ready to go!


> **Option 2: Use Docker**

If Docker’s your thing, you’re in luck. Here’s how to set it up:

1. **Install Docker:** Get it [here](https://www.docker.com/).
2. **Build the Docker Image:**


```python
npm run dockerbuild # OR docker build . --target bolt-ai-development
```
**Run the Container:**


```python
docker-compose --profile development up
```
Boom! You’re good to go.


## Adding API Keys and Configuring Models

So, let’s talk about API keys.

Adding them is super easy:


> Open the app and go to the main interface.


> Pick your provider from the dropdown menu.


> Click the pencil icon to edit.


> Enter your API key securely.

If you’re using something like Ollama or LM Studio with custom base URLs, just head to the settings, find the “Providers” tab and add the URL there.

Simple, right?


## Deepseek V3 (Your Fast and Free Coding friend)

Deepseek V3 is one of the standout models here.

It’s quick, reliable, and—you guessed it—free.

No rate limits to worry about, and it handles both chat and coding tasks like a pro.

Example: Let’s say you want a playable synth keyboard. Just type in your prompt, and Deepseek generates the code. If there’s a missing package, Bolt DIY will flag it and fix it for you.

How cool is that?


## Gemini 2\.0 (Multimodal Magic)

Now, Gemini 2\.0 is next\-level.

It supports text, images, and more.

Use it for things like refining code with screenshots or tackling vision\-heavy tasks.

Just grab an API key, set it up and let it do its thing.


## Keeping Your Setup Updated

Understanding the update process is crucial for maintaining your Bolt DIY installation.

Here’s a visual guide to the update workflow:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Z3JGUzP1LboP19dCbvnJdA.png)

This process ensures smooth updates while preserving your local changes.

Here are the detailed steps:

Updates are a breeze:

Save your local changes:


```python
git stash
```
Pull the latest updates:


```python
git pull origin main
```
Update dependencies:


```python
pnpm install
```
Restore your changes:


```python
git stash pop
```
If something breaks, no worries. Just clean install:


```python
rm -rf node_modules pnpm-lock.yaml
pnpm store prune
pnpm install
```

## Handy Scripts You’ll Use

Here are some go\-to scripts for managing Bolt DIY:

* `pnpm run dev`: Start the development server.
* `pnpm run build`: Build your project.
* `pnpm run start`: Run the built app locally.
* `pnpm run deploy`: Push to Cloudflare Pages.
* `pnpm run lint:fix`: Fix those pesky linting issues.
* `pnpm run preview`: Preview production builds locally.
* `pnpm run typecheck`: TypeScript type checking made simple.


## Why You Should Try This

If you’re serious about coding, Bolt DIY with Deepseek V3 and Gemini 2\.0 is a no\-brainer.

It’s perfect for students, indie devs or anyone who wants a powerful AI assistant without breaking the bank.

Plus, the community support is fantastic, and new features keep rolling out.


## Final Thoughts

Alright, that’s the gist of it.

Bolt DIY isn’t just a tool; it’s a game\-changer.

Go ahead, give it a spin, and see how it transforms your coding workflow.

Happy coding!


