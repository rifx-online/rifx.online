---
title: "微调 Llama-3 LLM 并将其部署为 CloudFlare 上的无服务器 API"
meta_title: "微调 Llama-3 LLM 并将其部署为 CloudFlare 上的无服务器 API"
description: "本文介绍了如何在个人网站上使用Llama 3构建和部署聊天机器人，通过CloudFlare的免费服务实现无服务器API。作者分享了自己在数据科学领域的背景以及制作网站的过程，强调了拥有公开项目的重要性。通过CloudFlare的Workers AI，作者使用JavaScript创建了一个简单的聊天界面，并提供了代码示例和设计思路，鼓励读者展示自己的技能并参与GenAI的热潮。"
date: 2025-01-05T02:29:46Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*-e2786fNYpH6y4iu"
categories: ["Programming", "Machine Learning", "Chatbots"]
author: "Rifx.Online"
tags: ["Llama", "CloudFlare", "JavaScript", "prompt", "engineering"]
draft: False

---



两年前，我（像许多数据科学家一样）对构建网站一无所知。

我擅长构建机器学习模型，但完全不知道如何将这些模型实际部署到像 *mywebsite.com* 这样的域名上。机器学习工程师负责这个，对吧？

错了！

如果你想在竞争激烈的就业市场中脱颖而出，拥有公开可见的代码是展示你技能的绝佳方式。

在这篇文章中，我将向你展示我是如何构建一个基于 Llama 3 的聊天机器人，并通过 CloudFlare AI Workers 免费将其上线到我个人域名上的。

## 我的背景（也就是我为什么决定开始制作数据科学网站）

在2022年5月，我的数据显示科学硕士学位快要完成了，但对未来的方向感到有些迷茫。

我想在数据领域做一些事情，但我知道要让雇主认真对待我将面临巨大的挑战，因为我在数据科学方面没有太多的经验。

在一个灵感闪现的时刻（咳，拖延），我决定制作一个数据科学作品集，以帮助我展示我所获得的一些技能。令人惊讶的是，我享受制作网站的过程，这给了我巨大的信心提升。看到我所有的项目集中在一个地方让我意识到：“等一下——我*可以*做数据科学！”并让我有信心开始申请更多的工作。

快进到2024年5月，尽管我已经做了两年的数据科学家，我仍然在制作网站。

我正处于职业生涯的一个阶段，想要迈出下一步，尤其是在当前所有的GenAI热潮下，我非常希望展示我在LLM方面的能力，并了解它们在现实世界中的部署方式（不局限于Jupyter笔记本）。

## 不要只听我说 — 来看看前 Facebook 数据科学家 Nick Singh 的看法

几周前，我决定制作我的 Llama 3 聊天机器人，当时我在 Nick 的一封邮件中读到了这个故事：

> 最近，我在开放数据科学会议 (ODSC) 上发言，内容是 [如何在数据求职中脱颖而出](https://nipunsingh.us19.list-manage.com/track/click?u=11fa1ee9c20a64044db2d61ba&id=468a568f98&e=6ce36e21d3)，面对 120 人的听众。

> 在演讲过程中，发生了一件令人震惊的事情，让我意识到求职的门槛是多么低。

> 我问观众：

> *“在你的简历上，你的作品项目有多 **公开**？”*

> 120 人中只有 2 人有自己项目的正确 URL（例如：DataLemur.com）

> 5 人有一个 repo 的链接（例如：github.com/NickSingh/DataLemur）

> 看到这么少的人在简历中链接到他们的项目，我又问了 120 人一个更基本的问题：

> *“忘掉链接吧。谁在简历上有一个非学校、独立完成的作品项目？”*

> **只有大约 10 只手举起来！**

> 我在这里喋喋不休地谈论如何通过购买一个域名（例如：“BobReccomendsMovies.com”）使一个好的作品项目变得更出色。

> 然而，85% 的人甚至没有一个独立完成的项目！

Nick 的故事让我意识到，即使作为一个非初学者的数据科学家，拥有可公开查看的项目仍然有很大的价值。

如果你跟着这个教程，在 30 分钟内，你将成为“120 人中的 2 人”之一，拥有自己域名下的在线作品项目。

## 我构建的内容

这是我构建的 Llama 3 聊天机器人的预览：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*fSmgsKJbSsBOc1senusjHQ.png)

我称它为 Dummy（这是一个为 SQL pandas 和 Excel 制作虚拟数据而优化的 LLM），您可以在 [https://dummy.chat](https://dummy.chat) 观看它的实时演示。

## 为什么这么基础？

如您所见，用户界面相当基础！

在我看来，这完全没问题——请记住，Nick的观众中只有大约2%的人有自己的项目。

此外，我们是数据科学家，而不是用户界面设计师。将我们的项目上线是最重要的，您可以随时在之后进行添加。

构建和启动完全免费（唯一的费用是我为域名支付的20美元，但这完全是可选的，因为您在创建项目时可以从CloudFlare获得免费的域名）。

## 我是如何构建它的

我的应用程序由 CloudFlare 提供支持。

他们提供了一系列免费的服务，包括 **Workers AI**，我用它来访问 Llama 3 模型并构建 Dummy。

> **注意**：当我告诉一个朋友 CloudFlare 提供这些免费服务时，他表示怀疑。“那么……他们是怎么赚钱的？”这是他不可避免的反应。答案是 (1\) 他们通过与安全性和网站性能优化相关的其他服务赚钱，(2\) 他们有一个“付费”层级的 Workers AI，如果你每天需要超过 \~200 个 LLM 响应，可以单独注册。不过就我们而言，免费层级已经足够了。

> **另一个注意**：我与 CloudFlare 没有任何关联。我只是一个粉丝。

我首先在 [cloudflare.com](https://www.cloudflare.com/en-gb/) 上创建了一个账户。我选择了免费层级。

然后，通过遵循 [本指南](https://developers.cloudflare.com/workers-ai/get-started/workers-wrangler/) 中的步骤，我用 JavaScript 和 Llama 3 8b Instruct 创建了一个非常基本的聊天机器人，并将其部署到 CloudFlare 的网络上。CloudFlare 给了我一个免费的域名在他们的 \*.workers.dev 根域名下，使我能够在 *dummy.workers.dev* 查看我的 LLM 的响应。

## 你说… JavaScript？

是的！JavaScript 是网页开发的语言，我对使用它编写代码相当熟悉，所以在我的情况下这很合理。

> 不想使用 JavaScript？你也可以通过你的 CloudFlare 控制面板上的 [图形用户界面](https://developers.cloudflare.com/workers-ai/get-started/dashboard/) 或者使用 [Python](https://blog.cloudflare.com/python-workers) 来构建你的聊天机器人。

实际上，我已经写了不少关于我认为学习 JavaScript 对数据科学家来说是个好主意的文章：

## 自定义模型与提示工程

自定义模型的最简单方法是通过配置系统提示。

我是什么意思呢？这是 CloudFlare 上 Llama 3 模型的默认提示：

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

这是我修改后的内容：

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

当然，我们还需要一种方法将用户查询/输入传递给模型。我通过使用 [Hono](https://hono.dev/)（一个 JavaScript 框架）创建了一个“应用”，通过 URL 接受用户查询，这个灵感来自于 [这个视频](https://www.youtube.com/watch?v=pJh2vLpysy4)：

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

## 设计界面

默认情况下，通过 CloudFlare 创建的“聊天机器人”将仅返回 JSON 响应。

例如，当我通过输入 URL [https://dummy.chat/stream?query\=hello](https://dummy.chat/stream?query=hello) 向 Dummy 发送消息“hello”时，会发生以下情况。Dummy 将响应作为一系列 JSON 对象返回（注意：格式看起来奇怪的原因是因为响应是“流式传输”）。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*A-D-XGC6rTYXvcvFpe5RQg.png)

如果您想将模型用作 API 并从另一个应用程序与之交互（例如，如果您想 [使用 Jupyter Notebook 探索 Workers AI 模型](https://developers.cloudflare.com/workers-ai/tutorials/explore-workers-ai-models-using-a-jupyter-notebook/)），这很好，但如果您想通过图形界面与模型交互，则需要稍微自定义 HTML/CSS。这是我使用 TailwindCSS 构建的基本 HTML 界面，再次受到 [这个视频](https://www.youtube.com/watch?v=pJh2vLpysy4) 的启发：

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
            <p class="font-light text-xl text-center">为 SQL、pandas 和 Excel 创建虚假数据</p>
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
              placeholder="描述您想要创建的数据..." 
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
        userMessageIcon.innerText = '您';

        const url = `/stream?query=${formEvent.target.query.value}`
        const source = new EventSource(url)

        // 在附加新消息之前清除现有响应
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

这产生了您在 [https://dummy.chat.](https://dummy.chat.) 上看到的简单界面。

## 代码与进一步学习

您可以在 [GitHub](https://github.com/mattschapman/dummy) 上查看我的完整代码。

如果您对数据科学的网页开发感兴趣，您可能会喜欢我之前的文章：




