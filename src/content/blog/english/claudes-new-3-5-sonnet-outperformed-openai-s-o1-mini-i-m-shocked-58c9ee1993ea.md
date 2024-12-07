---
title: "Claude’s new 3.5 Sonnet outperformed OpenAI’s O1-mini. I’m shocked."
meta_title: "Claude’s new 3.5 Sonnet outperformed OpenAI’s O1-mini. I’m shocked."
description: "The article compares Anthropics updated Claude 3.5 Sonnet model with OpenAIs o1-mini model, highlighting Claudes superior performance in generating SQL queries and its cost-effectiveness. While Claude excelled in accuracy and speed, it struggled with prompt adherence and adaptability in JSON generation tasks. The conclusion suggests that Claude 3.5 Sonnet, particularly when enhanced with prompt engineering, is more suitable for everyday tasks than the o1 models, though the choice ultimately depends on specific use cases and requirements."
date: 2024-12-07T12:38:04Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Xr24P55E2BoCNKwQ8Jx4Yw.png"
categories: ["Programming", "Generative AI", "Data Science"]
author: "Rifx.Online"
tags: ["Claude", "SQL", "JSON", "performance", "cost-effectiveness"]
draft: False

---





### A side\-by\-side comparison of Claude’s updated 3\.5 Sonnet model

When OpenAI released GPT\-4o, I had high expectations… and was promptly let down. While GPT\-4o was faster and less expensive than GPT\-4, it was noticeably less sharp. The original GPT\-4 (and Claude 3\.5\) was clearly the better model if cost wasn’t a consideration.

Today, Anthropic released an updated 3\.5 Sonnet model. Online communities like Reddit raved about it, explaining how it was much more thoughtful and powerful than the previous version.

I found that hard to believe.



15 minutes later after playing with this model, I’ve come to a startling conclusion.

This model isn’t just good. It’s unbelievably good.

And it’s better than OpenAI’s o1\-mini at the same (approximate) cost.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*pb2_n_sZx9hK2hflCBWGiQ.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*InOQzDDjIuybxhaj2JNQKg.png)


## Recap: What is the difference between the OpenAI’s o1 models and Claude 3\.5 Sonnet

When OpenAI’s new o1 model was released, it was the most hyped thing since the invention of ChatGPT.

Unlike other Large Language Models which respond more\-or\-less instantly, O1 models take the problem, break it down, answer the sub\-problems, and THEN generates a final output.

This process has been compared to how humans “think” and “reason” about complex problems.

Even I was sucked into the hype cycle. Upon release, I wrote an article about how these models generated highly effective algorithmic trading strategies on their first try. I still stand by their effectiveness.

However, while their raw accuracy and reasoning skills are impressive, I didn’t consider the other things about these models that are also extremely important.

Not only are the o1 models slow…

They’re also very expensive. Especially if you use the more powerful o1\-preview model.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*NjYAAiTvWWZdtj7KbBeE9g.png)

When the model was released, I enabled it into my app like any model. My app has “research tokens”, and I priced the model like I did other advanced models like GPT\-4\.

Specifically, I made the o1\-preview model cost the user *1 Research Token* in order to use.

And because of the lack of restrictions, I spent $81 in a single day.

The o1 family of models are good, but they’re not that good. For nearly any use\-case I can think of, the extreme cost isn’t worth the marginally better effectiveness and accuracy of these models.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*IdZYdw7avDcoj3GbPyYdaA.png)

However, the new Claude 3\.5 Sonnet is a different story.

Not only is it scary good, outperforming o1\-mini in many complex reasoning tasks, but it’s also cheap – as cheap as GPT\-4o.

However, it does have some flaws. Sonnet is stubborn, and it’s hard to fix its output when its wrong without updating the system prompt. Nonetheless, we’ll discuss later how to mitigate these flaws with prompt engineering.


## A Side\-By\-Side Comparison of GPT\-o1\-mini and the Updated Claude 3\.5 Sonnet

To test the effectiveness of this model, I ran it through two different experiments:

1. Generate a complex SQL query in natural language
2. Create a complex JSON object in natural language

These are features for my AI\-Powered trading platform, [NexusTrade](https://nexustrade.io/). NexusTrade makes it easy for retail investors to perform financial research and develop algorithmic trading strategies.

So, using NexusTrade, we’re gonna test the effectiveness of Claude 3\.5 Sonnet. Let’s start with generating the SQL Query.


### The AI\-Powered Stock Screener with GPT o1\-mini

The AI\-Powered Stock Screener is a unique feature of NexusTrade. It allows users to find fundamentally strong investments using natural language.

Specifically, it converts a user request into a SQL query. The SQL query is then executed against the database to find the stocks that the user wants.

To test the effectiveness of GPT o1\-mini versus Claude 3\.5 Sonnet, we used the following query.


> What AI stocks have a rating of 4 or higher and are low for the month? Sort by rating descending, then market cap descending for ties

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*0dYpxlzv0qG0geiZPeB0IQ.png)

While the exact response format is subjective, we’re going to evaluate whether the model gave us the stocks we asked for.

GPT o1\-mini did not.

The top stock of the list, NVIDIA, is at an all\-time high. Moreover, if we examine the SQL query that was generated by GPT o1, it does absolutely no filtering to find stocks that are low for the month.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*oJ8iquMeLLGZ7RTE4Po4qg.png)

In contrast, Claude knew *exactly* what I meant on my first try.


### The AI\-Powered Stock Screener with 3\.5 Sonnet

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*rBi_8Gj87PgA2GKuQc9KCw.png)

Asking the same exact question to 3\.5 Sonnet, we notice several things:

* The response format is neater (although this is subjective)
* The response was generated many orders of magnitude faster
* It was likely much cheaper to use Sonnet than it was to use o1\-mini
* **Most importantly, the response is more accurate**

If we examine the SQL query, we can see that the model understands what we meant by “low for the month”, and generates a query that corresponds to what we wanted.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*hnKiHLf25YnKyMjK0yqiMg.png)

This is incredible! The response is better in nearly every way compared to GPT’s models.

However, does this mean that Claude 3\.5 Sonnet is the better model?

Not necessarily.


### Creating an algorithmic trading strategy with GPT o1\-mini

Our next test will see how effective the models are at generating syntactically\-valid JSON that conform to our request. Specifically, we’ll use these models to create algorithmic trading strategies.

I’ve explained how this process worked in [a previous article.](https://medium.datadriveninvestor.com/i-used-openais-o1-model-to-develop-a-trading-strategy-it-is-destroying-the-market-576a6039e8fa) To summarize, when creating a portfolio, the input of one prompt is used as the output of another. This creates “a prompt chain” and allows us to create deeply nested and complicated objects.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*ywNbmdTa-BdQ05SU.png)

In this case, the object is a portfolio, complete with strategies (rules for entering/exiting trades), conditions (boolean triggers for when a strategy executes) and indicators (numerical observations about the market).

To create a portfolio, we’ll say the following in the chat.


> I want a SMA crossover strategy on TQQQ. I want a take profit strategy, but no stop losses — I’m bullish on tech long\-term and don’t want to be stop lossed out. I also want to space out my buys and not go all\-in at once.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*A4DhFQAExojxydu4Nzvu4A.png)

For o1\-mini, it created a portfolio that outperformed the broader market on its first try.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*7RasrqbCInCeLwWeOE_NbA.png)

While the performance of this strategy is impressive, **there is something very important to note.**

It did not conform to spec.

Specifically, I said the following into the chat.


> I also want to space out my buys and not go all\-in at once.

Yet, when we examine the strategies the model created, it did not create those strategies. It created a separate strategy for that rule, which is clearly not what I meant.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Qk_586CrmxogIcqCK9elIQ.png)

Claude 3\.5 Sonnet did a much better job… with a catch.


### Creating an algorithmic trading strategy with Claude 3\.5 Sonnet

Using the same prompt, I created the following algorithmic trading strategy with Claude.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*IQppSFMHC2AlKOWf_6goHw.png)

This strategy **actually conforms to my request**, which makes it better. It will only buy if 7 days passed since the last order.

However, there is a problem.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*mqAcaCA_mizVaJXU8WCS8A.png)

The performance of the portfolio created with Sonnet is **much worse.** The reason for it is simple – if we look at the selling rule, we see that it sold when the positions were up 0\.15%.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ZHQkXS_CS9Tc80ed7D-ZeQ.png)

What’s worse is that the model was very stubborn. When I asked it to correct the rule, it kept generating the same exact portfolio over and over again.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*3XX9oJHPCEW-8PDPXQQUkA.png)

**This makes the winner of this round a toss\-up.** While Claude actually conformed to my request, GPT\-o1\-mini generated a portfolio with much better performance and would be able to listen to modifications.

Nonetheless, there are ways we can improve the performance of Claude and get it to create a better portfolio.


## Improve the Base Models with Prompt Engineering

In order to Claude to generate the “correct” portfolio, I had to modify the system prompt. This corresponds to the following change.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*fOrdz67c4IEnQ0W3bcJeLg.png)

In addition to the system prompt, I added more examples into the context for “few shot prompting”. Specifically, I has an input/output pair for what an indicator of “negative 15%” would mean for my app.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*G01vdp6iwRPH7Y_luuGe5w.png)

By making these modifications, Claude 3\.5 Sonnet was able to generate a correct portfolio that conformed to what I asked for initially exactly.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*3UXtuqL7mL6iYpRpwd6DNw.png)


## Concluding Thoughts: Which is better?

In this article, I put OpenAI’s o1\-mini model versus Anthropic’s latest model, 3\.5 Sonnet. We did a side\-by\-side comparison of two tasks: SQL generation and JSON generation.

For the SQL generation task, Claude 3\.5 Sonnet was the unambiguous winner. The response was more accurate, better formatted, and was less expensive to generate, and much quicker to generate.

For the JSON generation task, the winner is a toss\-up. While Claude better conformed to the initial request, it had a tough time changing the portfolio when it made mistakes. In contrast, OpenAI’s model did a more poor job at conforming to the user request, but generated a much better portfolio on its first try, with correct minute details such as the percent change needed to sell.

For these reasons, there isn’t a clear\-cut answer of “which is better”. Claude 3\.5 Sonnet seems to be much more thoughtful and faster than the o1 family of models. But, it was also more stubborn, and wouldn’t change its output until we changed the system prompt and added more concrete examples.

Ultimately, the absolute answer to “which is better” is “it depends”. But if I had to choose one or the other and account for things like speed, cost, and thoughtfulness, Claude 3\.5 (mixed with prompt engineering) is a much more usable model for day\-to\-day tasks, and I would choose it over the o1 family of models.

Thank you for reading! By using NexusTrade, you can create your own algorithmic trading strategies using natural language. Want to try it out for yourself? Create a free account on NexusTrade today.

Follow me: [**LinkedIn**](https://www.linkedin.com/in/austin-starks/) **\| [X (Twitter)](https://x.com/nexustrade_) \| [TikTok](https://www.tiktok.com/@starkstechnology) \| [Instagram](https://www.instagram.com/starkstechnology/) \| [Newsletter](https://nexustrade.io/blog)**

Listen to me: [**Spotify**](https://open.spotify.com/show/6xX8sT3sD7sYFaD8EH5PaV) \| [**Amazon Music**](https://podcasters.amazon.com/podcasts/76197134-357f-47bd-be74-6801bf90ffb3) **\| [Apple Podcasts](https://podcastsconnect.apple.com/my-podcasts/show/auroras-insights/86a719fb-2552-4406-b0f5-a3bdd09c82eb)**


