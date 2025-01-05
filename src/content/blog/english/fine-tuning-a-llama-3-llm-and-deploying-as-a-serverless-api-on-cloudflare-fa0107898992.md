---
title: "Fine-Tuning a Llama-3 LLM and Deploying as a Serverless API on CloudFlare"
meta_title: "Fine-Tuning a Llama-3 LLM and Deploying as a Serverless API on CloudFlare"
description: "The article details the authors journey of building and deploying a Llama 3-powered chatbot, named Dummy, on their personal website using CloudFlares free services. The author emphasizes the importance of having publicly viewable projects to enhance job prospects in data science. They provide a step-by-step guide on creating the chatbot, including using JavaScript, customizing the model through prompt engineering, and designing a simple user interface. The project serves as a practical demonstration of deploying machine learning models and showcases the authors skills in a competitive job market."
date: 2025-01-05T02:29:46Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*-e2786fNYpH6y4iu"
categories: ["Programming", "Machine Learning", "Chatbots"]
author: "Rifx.Online"
tags: ["Llama", "CloudFlare", "JavaScript", "prompt", "engineering"]
draft: False

---





### (Or: how I launched my own Llama 3 chatbot at mywebsite.com)



2 years ago, I (like many data scientists) knew absolutely nothing about building websites.

I was great at building ML models, but didn’t have a clue how to actually get those models live/online at a domain like *mywebsite.com*. The ML Engineers handle that, right?

Wrong!

If you want to stand out in a crowded job marketplace, having publicly\-viewable code is a fantastic way to demonstrate your skills.

In this article, I’ll show you how I built a Llama 3\-powered chatbot and got it online at my own personal domain, all for free, using CloudFlare AI Workers.


## My background (AKA why I decided to start making data science websites)

In May 2022, I was nearing the end of my data science master’s degree and feeling a bit lost about what to do with my life.

I wanted to do something in the world of data, but I knew I’d be facing an uphill battle to get any employers to take me seriously, because I didn’t have much prior experience in data science.

In a moment of inspiration (ahem, procrastination), I decided to make a data science portfolio to help me showcase some of the skills I’d gained. Surprisingly, I enjoyed the process of making the website, and it gave me a massive confidence boost. Seeing all of my projects in one place made me realise: “wait a second — I *can* do data science!” and gave me the confidence to start applying to more jobs.

Fast\-forward to May 2024, and, even though I’ve been a data scientist for two years, I’m still making websites.

I’m at a point in my career where I’m looking to take the next step up, and — especially given all of the GenAI madness going on — I’m really keen to demonstrate my ability with LLMs and learn more about how they’re deployed in the real world (outside of Jupyter notebooks).


## Don’t just take it from me — here’s what Nick Singh (ex\-Facebook Data Scientist) has to say

I decided to make my Llama 3 chatbot a few weeks ago, when I read this story in an email from Nick:


> Recently, I spoke at the Open Data Science Conference (ODSC) where I covered [How to Ace the Data Job Hunt](https://nipunsingh.us19.list-manage.com/track/click?u=11fa1ee9c20a64044db2d61ba&id=468a568f98&e=6ce36e21d3) for a crowd of 120 people.


> During the talk, something shocking happened, which made me realize just how low the bar was for job hunting.


> I asked the audience:


> *“On your resume, how **published** is your portfolio project”?*


> 2 people out of 120 had a proper URL to their project (ex. DataLemur.com)


> 5 people had a link to a repo (ex. github .com/NickSingh/DataLemur)


> Surprised by how few people had resumes which linked to their project, I asked the 120 people a more basic question:


> *“Forget links. Who has a non\-school, individually done portfolio project on your resume?”*


> **Only 10ish more hands went up!**


> Here I was, droning on and on about how to make a good portfolio project even more amazing by buying a domain name for it (ex. “BobReccomendsMovies.com”).


> Yet, 85% of the room didn’t even have a single individually \& independently finished project to their name!

Nick’s story made me realise that, even as a non\-beginner data scientist, there’s a lot of value to be gained from having publicly\-viewable projects.

If you follow along with this tutorial, in 30 minutes you’ll be in that “2 out of 120” category of people who have a live portfolio project at your own domain.


## What I built

Here’s a preview of the Llama 3 chatbot I built:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*fSmgsKJbSsBOc1senusjHQ.png)

I called it Dummy (it’s an LLM primed for making dummy data for SQL pandas and Excel) and you can view it live at <https://dummy.chat>.


## Why is it so basic?

As you can see, the UI is pretty basic!

In my opinion, that’s absolutely fine — remember that only about 2% of people in Nick’s audience even had a project on their own domain.

Besides, we’re data scientists, not UI designers. Getting our project online is the main thing, and you can always add to it later.

It was completely free to build and launch (the only cost was the $20 payment I made for the domain, but that’s completely optional, as you get given a free domain by CloudFlare when you create the project).


## How I built it

My app is powered by CloudFlare.

They offer a bunch of free services, including **Workers AI**, which is what I used to access a Llama 3 model and build Dummy.


> **Note**: When I told a friend that CloudFlare offers these services for free, he was skeptical. “So… how do they make money?” was his inevitable response. The answer is (1\) they make money from other services on their platform related to security and web performance optimisation, and (2\) they have a “Paid” tier for Workers AI which you can sign up for separately if you will need more than \~200 LLM responses per day. For our purposes, however, the Free tier is plenty.


> **Another note**: I am not affiliated with CloudFlare in any way. I am just a fanboy.

I started by creating an account on [cloudflare.com](https://www.cloudflare.com/en-gb/). I opted for the Free tier.

Then, by following the steps in [this guide](https://developers.cloudflare.com/workers-ai/get-started/workers-wrangler/), I created a very basic chatbot with JavaScript and Llama 3 8b Instruct, and deployed it to CloudFlare’s network. CloudFlare gave me a free domain on their \*.workers.dev root domain, enabling to view my LLM’s responses at *dummy.workers.dev*.


## Did you say… JavaScript?

Yes! JavaScript is the language of web development, and I’m reasonably comfortable coding with it, so it made sense in my situation.


> Prefer not to use JavaScript? You can also build your chatbot via the [graphical user interface](https://developers.cloudflare.com/workers-ai/get-started/dashboard/) on your CloudFlare dashboard, or with [Python](https://blog.cloudflare.com/python-workers).

I’ve actually written a fair bit on why I think learning JavaScript is an excellent idea for Data Scientists:


## Customising the model with prompt engineering

The easiest way to customise a model is through configuring the system prompt.

What do I mean? Well, here’s the default prompt of a Llama 3 model on CloudFlare:


```python
export interface Env {
  AI: any;
}

export default {
  async fetch(request, env): Promise<Response> {
    const response = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
        prompt: "What is the origin of the phrase Hello, World"
      }
    );

    return new Response(JSON.stringify(response));
  },
} satisfies ExportedHandler<Env>;
```
And this is what I changed it to:


```python
export interface Env {
  AI: any;
}

export default {
  async fetch(request, env): Promise<Response> {
    const response = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
        prompt: `Your name is Dummy. You are a helpful assistant who
                 create dummy data for people to help them learn/practice 
                 SQL, pandas and Excel. You have the ability to create 
                 SQL scripts, pandas code, and Excel tables which users 
                 can copy and paste into their own application in order 
                 to test our their code and learn new skills.`
      }
    );

    return new Response(JSON.stringify(response));
  },
} satisfies ExportedHandler<Env>;
```
Of course, we also need a way to pass user queries/input to the model. I did that by using [Hono](https://hono.dev/) (a JavaScript framework) to create an “app” which accepts user queries via the URL, inspired by [this video](https://www.youtube.com/watch?v=pJh2vLpysy4):


```python
import { Ai } from "@cloudflare/ai";
import { Hono } from "hono";

import streamingTemplate from "./template-streaming.html";

const app = new Hono();

app.get("/", (c) => c.html(streamingTemplate));

app.get("/stream", async (c) => {
 const ai = new Ai(c.env.AI);

 const query = c.req.query("query");
 const question = query || "Hello, please introduce yourself";

 const systemPrompt = `Your name is Dummy. You are a helpful assistant who
 create dummy data for people to help them learn/practice SQL, pandas and Excel.
 You have the ability to create SQL scripts, pandas code, and Excel tables which
 users can copy and paste into their own application in order to test our their code.`;
 const stream = await ai.run(
  '@cf/meta/llama-3-8b-instruct',
  {
   messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: question },
   ],
   stream: true,
  },
 );

 return new Response(stream, {
  headers: {
   "content-type": "text/event-stream",
  },
 });
});

app.post("/", async (c) => {
 const ai = new Ai(c.env.AI);

 const body = await c.req.json();
 const question = body.query || "Hello, please introduce yourself";

 const systemPrompt = `Your name is Dummy. You are a helpful assistant who
 create dummy data for people to help them learn/practice SQL, pandas and Excel.
 You have the ability to create SQL scripts, pandas code, and Excel tables which
 users can copy and paste into their own application in order to test our their code.`;

 const { response: answer } = await ai.run(
  '@cf/meta/llama-3-8b-instruct',
  {
   messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: question },
   ],
  },
 );

 return c.text(answer);
});

app.onError((err, c) => {
 return c.text(err);
});

export default app;
```

## Designing the interface

By default, the “chatbot” you create via CloudFlare will just return JSON responses.

For example, here is what happens when I send the message “hello” to Dummy by entering the URL [https://dummy.chat/stream?query\=hello](https://dummy.chat/stream?query=hello). Dummy returns the response as a series of JSON objects (note: the reason the format looks weird is because the response is “streaming”).

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*A-D-XGC6rTYXvcvFpe5RQg.png)

That’s great if you want to use the model as an API and interact with it from another application (e.g., if you want to [Explore Workers AI Models Using a Jupyter Notebook](https://developers.cloudflare.com/workers-ai/tutorials/explore-workers-ai-models-using-a-jupyter-notebook/)), but if you want to interact with your model via a graphical interface, you’ll need to customise the HTML/CSS a little. Here’s the basic HTML interface I built using TailwindCSS, again inspired by [this video](https://www.youtube.com/watch?v=pJh2vLpysy4):


```python
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Dummy</title>
    <link rel="icon" type="image/svg+xml" href="dummy.svg">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400;700&display=swap');
      @import url('https://unpkg.com/normalize.css');
    </style>
  </head>
  <body>

    <div class="h-screen items-center flex flex-col w-full mx-auto">
      
      <div class="flex-grow h-full w-full p-10 flex items-center">
        <div class="w-full md:w-3/4 xl:w-1/2 mx-auto">

          <div class="flex flex-col py-10">
            <h1 class="font-bold text-4xl py-5 text-center">Dummy</h1>
            <p class="font-light text-xl text-center">Create fake data for SQL, pandas and Excel</p>
          </div>

          <div id="response-history" class="w-full flex flex-col">
            <div class="w-full flex flex-row">
              <div class="w-1/12 p-3" id="user-icon"></div>
              <div class="w-11/12 p-3" id="user-message"></div>
            </div>

            <div class="w-full flex flex-row">
              <div class="w-1/12 p-3" id="llm-icon"></div>
              <div class="w-11/12 p-3" id="response"></div>
            </div>
          </div>

        </div>
      
      </div>

      <div class="h-[150px] bg-gray-50 w-full p-10 flex items-center">
        <div class="w-full md:w-3/4 xl:w-1/2 flex justify-between mx-auto rounded-lg border p-5">
          <form id="query-form" class="w-full flex flex-row justify-between">
            <input
              autofocus
              name="query"
              placeholder="Describe the data you want to create..." 
              type="text"
              class="flex-grow bg-transparent focus:outline-none"
            >
            </input>

            <div class="w-[50px] flex justify-center">
              <button type="submit" class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium tracking-wide text-white transition-colors duration-200 rounded-md bg-neutral-950 hover:bg-neutral-900 focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900 focus:shadow-outline focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-circle-fill" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0m-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z"/>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>

    <script>
      const submitForm = async (formEvent) => {
        formEvent.preventDefault()

        const userMessage = formEvent.target.query.value;
        const userMessageDiv = document.getElementById("user-message");
        userMessageDiv.innerText = userMessage;
        const userMessageIcon = document.getElementById("user-icon");
        userMessageIcon.innerText = 'You';

        const url = `/stream?query=${formEvent.target.query.value}`
        const source = new EventSource(url)

        // Clear existing response before appending new message
        document.querySelector("div#response").innerHTML = "";

        source.onmessage = (event) => {
          if (event.data === "[DONE]") {
            source.close()
            formEvent.target.query.value = ""
            return
          }
          const data = JSON.parse(event.data)
          document.querySelector("div#response").innerHTML += data.response
          
          const llmMessageIcon = document.getElementById("llm-icon");
          llmMessageIcon.innerText = 'LLM';
        }
      }

      document.querySelector("form#query-form").addEventListener("submit", submitForm)
    </script>
    
  </body>
</html>
```
This produced the simple interface you see at <https://dummy.chat.>


## Code and further learning

You can view my full code on [GitHub](https://github.com/mattschapman/dummy).

If you’re interested in learning more about web development for data science, you might enjoy my previous article:


## Conclusion

Thanks for reading. I hope you found this helpful, and free to connect with me on [Twitter](https://twitter.com/matt_chapma) or [LinkedIn](https://www.linkedin.com/in/matt-chapman-ba8488118/)! :\-)


