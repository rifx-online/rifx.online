---
title: "Testing OpenAI’s o1 Models: A Look at Chain-of-Thought Prompting for Journalism Tasks"
meta_title: "Testing OpenAI’s o1 Models: A Look at Chain-of-Thought Prompting for Journalism Tasks"
description: "The article evaluates OpenAIs new o1 models, emphasizing their reasoning capabilities in journalism tasks such as data analysis and headline selection. While o1 models show promise in handling complex problems, they do not consistently outperform existing models like GPT-4o. The evaluation reveals that chain-of-thought prompting enhances performance across various models, suggesting that effective prompting strategies are crucial for optimal results. Overall, o1 models are not yet the best choice for journalism tasks, highlighting the need for tailored evaluations to determine the most suitable model for specific use cases."
date: 2024-12-07T12:38:58Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*wZoDihjVRh_gB1hq"
categories: ["Natural Language Processing", "Machine Learning", "Data Science"]
author: "Rifx.Online"
tags: ["o1", "reasoning", "journalism", "prompting", "GPT-4o"]
draft: False

---




*New LLMs are touted as smarter problem\-solvers — but how do they fare in real\-world journalistic tasks like data visualization and headline selection?*



Last month, OpenAI released two new large language models: o1\-preview and o1\-mini. These are what the company calls [“reasoning models”](https://openai.com/index/introducing-openai-o1-preview/), an important distinction from the large language models we’ve seen so far. Whereas LLMs like GPT\-4o generate text directly in response to a user’s question, the o1 models first build a step\-by\-step plan, then execute it to reach a solution. This process allows o1 to handle more involved problems: According to [benchmarks](https://openai.com/index/learning-to-reason-with-llms/), these models improve on GPT\-4o for programming, math, and other complex reasoning tasks.

When might these new models be useful for journalists? As with any LLM, it’s tricky to translate benchmarks into real\-world performance. And this is even more true for the o1 models — OpenAI’s [documentation notes](https://help.openai.com/en/articles/9824965-using-openai-o1-models-and-gpt-4o-models-on-chatgpt) that “GPT\-4o is still the best option for most prompts,” but that o1 “may be helpful for handling complex, problem\-solving tasks in domains like research, strategy, coding, math, and science.” To figure out what that means in practice, it’s helpful to identify a few common journalism tasks that we can use to evaluate o1\.

Complex problem\-solving is central to many aspects of journalism, but not all tasks are equally feasible to evaluate. Drawing from Charlotte Li’s [journalism task taxonomy](https://generative-ai-newsroom.com/heres-what-gpt-4-thinks-being-a-journalist-is-all-about-88028ae27a01), we can group tasks into six categories: gathering information, sensemaking, editing, publication and distribution, productivity, and journalism training. Most of these require a model embedded in a newsroom for proper evaluation, which makes them challenging to assess in isolation.

Sensemaking, however, involves reasoning\-intensive tasks around processing information, which are feasible to evaluate in a controlled setting. With that in mind, I chose two core sensemaking tasks for this evaluation: **data analysis** and **headline selection**.


## Evaluation tasks

*The prompts, analysis code, and model outputs for all evaluations are available in the [project repo](https://github.com/NHagar/o1-eval).*


### Data analysis

**Data analysis** — the process of cleaning, processing, and visualizing an unfamiliar dataset — is a time\-consuming but essential part of reporting. It’s also a promising application of LLMs: [Research from Joris Veerbeek and Nick Diakopoulos](https://arxiv.org/abs/2409.07286) has demonstrated the potential of LLMs for analyzing datasets, and OpenAI [highlights](https://openai.com/index/learning-to-reason-with-llms/) code generation as a strength of the o1 models.

I wanted to evaluate the models’ ability to carry out end\-to\-end analysis tasks, starting with a spreadsheet and ending with a clear visualization. To do this, I selected several [popular datasets](https://catalog.data.gov/dataset?q=&sort=views_recent+desc) from data.gov: the Department of Agriculture’s [estimated fruit and vegetable prices](https://catalog.data.gov/dataset/fruit-and-vegetable-prices), [electric vehicle registration in Washington State](https://catalog.data.gov/dataset/electric-vehicle-population-data), and [motor vehicle collisions](https://catalog.data.gov/dataset/motor-vehicle-collisions-crashes) in New York City. For each dataset, I prompted the models to generate Python code for a different type of visualization. I structured these visualization tasks in increasing complexity:

* **Produce prices:** A scatter plot showing the relationship between retail price and cup\-equivalent price, with a line of best fit.
* **EVs:** Side\-by\-side histograms, showing the range distributions for battery EVs and plug\-in hybrids.
* **Collisions:** A heatmap of collisions by NYC borough.

I evaluated each model’s output on the following criteria:

* Did the code run?
* Did the output match the requested figure?
* Were there any data cleaning errors?
* How many lines of code did the model require to complete the task?


### Headline selection

Many newsrooms leverage **multivariate headline testing** to compare the performance (e.g., clickthrough rate) of multiple headlines for the same story, to see which one resonates best with readers. As our [prior research](https://par.nsf.gov/servlets/purl/10301845) shows, predicting the outcomes of these tests is often difficult, requiring strong editorial judgment and familiarity with audience preferences. A reasoning model may be well\-equipped to weigh these factors when evaluating headlines.

To test this, I randomly sampled 50 headline tests from the exploratory dataset in the [Upworthy Research Archive](https://osf.io/jd64p/). This dataset contains tests run by [Upworthy](https://www.upworthy.com/), a digital publisher, between 2013 and 2015\. I prompted the model to select the best headline from each test, then measured its accuracy compared to the headlines that editors selected.


### Comparison LLMs

To judge the relative effectiveness of the o1 models, I also evaluated GPT\-4o, GPT\-4o\-mini, and Llama3\.1–7b, the latter to assess the performance of a smaller model that could run locally.

This comparison matters because, to the extent that these models can compete with o1, they represent significant cost savings. At the time of writing, o1\-preview costs $15 per million input tokens and $60 per million output tokens. That’s 6x as expensive as GPT\-4o, and 100x as expensive as GPT\-4o\-mini (and infinitely more expensive than a model you can run on your laptop).

In addition to single\-step prompts for each task, I explored multiple prompting strategies to see if these less expensive models could compete. This was motivated by o1’s [“reasoning” capabilities](https://openai.com/index/learning-to-reason-with-llms/), which leverage a technique called [chain of thought](https://arxiv.org/pdf/2201.11903). Chain of thought is a prompting strategy that elicits intermediate reasoning steps from an LLM — rather than answering a request immediately, the model first outputs its “thought process.” It also [improves](https://arxiv.org/pdf/2201.11903) LLM performance on some tasks, even without any changes to the underlying model. While o1 is optimized for this approach, you can use chain of thought with any LLM ([here](https://gist.github.com/NHagar/37dde89443f68715674840cc42802ead) is an example with llama3\.1–7b).

Knowing this, I tried three strategies to elicit more involved “reasoning” from the non\-o1 models:

* A **chain of thought** system prompt, which instructs the model to think through problems step\-by\-step, adapted from the open source [optillm](https://github.com/codelion/optillm/blob/main/optillm/cot_reflection.py#L8-L33) library.
* A **multi\-step reasoning strategy**, which allows the model to mimic o1’s approach, adapted from the open source [g1](https://github.com/bklieger-groq/g1/tree/main) project.
* **Hand\-crafted multi\-step workflows**, to assess the benefit of reasoning driven by a human in the loop.


## Results


### Data analysis

The table below summarizes whether each model successfully completed each analysis. For a comprehensive breakdown of performance by model and prompting strategy, see Appendix A.







At a high level, while o1 is generally more effective than other models for these analysis tasks, it isn’t strictly the *best*. The smaller models struggle with more complex tasks, regardless of prompting — only GPT\-4o and o1\-preview are able to complete all three. But on the whole, GPT\-4o with chain\-of\-thought prompting produces comparable visualizations to o1\. Here’s a comparison of their collision heatmaps:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*upwHcaMAe10hYhcnchrbXQ.png)

Llama\-3\.1–7b struggled the most, only completing the simplest task (fruit prices) with chain\-of\-thought prompting. Still, this shows that even small, local models can handle some analysis tasks — promising for reporting workflows that prioritize efficiency and privacy.

This also underscores the broader effectiveness of chain\-of\-thought prompting. For non\-o1 models, it produced the most accurate figures in 56% of cases, compared to 44% for single prompts, 33% for generated reasoning chains, and 22% for hand\-crafted reasoning. While hand\-crafted reasoning was less effective overall, it excelled in specific cases — such as the fruit prices analysis with GPT\-4o\-mini, where it generated the most thorough data cleaning and revealed an interesting trend in dried fruit prices:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*mRRYJAWYJMhFf4wy)

Overall, while the o1 models are generally effective for data analysis, they don’t exceed the capabilities of other models enough to justify their added cost. Smaller models struggle with complex tasks, but with the right prompting — especially chain\-of\-thought — even local models like Llama\-3\.1–7b can handle simpler analyses.


### A/B headline tests

When evaluating the models’ ability to predict winning headlines in A/B tests, the o1 models consistently underperformed: Both o1\-preview and o1\-mini achieved an accuracy of just 24%. In contrast, GPT\-4o and GPT\-4o\-mini achieved the highest accuracy at 34%, with chain\-of\-thought prompting for GPT\-4o and hand\-crafted reasoning chains for GPT\-4o\-mini yielding the best results (see Appendix B for details on all prompting approaches).







This performance gap suggests that o1’s reasoning capabilities may not translate well to tasks requiring editorial judgment or audience engagement predictions. While all models struggled with this task, prompting also makes a clear difference. For the GPT models, hand\-crafted reasoning chains boosted accuracy more than in the code generation tasks, demonstrating that these workflows can be useful in editorial contexts. Chain\-of\-thought prompting again increased accuracy across most models, reinforcing its value as a versatile strategy for improving performance on reasoning\-intensive tasks.


## Conclusion

In constructing this evaluation, I tried to pick tasks that would benefit from o1’s reasoning capabilities — tasks that required combining multiple logical steps to produce a data visualization, or that required the model to reason about newsworthiness and audience engagement. But the results shown here echo [OpenAI’s general guidance](https://help.openai.com/en/articles/9824965-using-openai-o1-models-and-gpt-4o-models-on-chatgpt): For most tasks, o1 should not be your go\-to model. While it’s as good as GPT\-4o in some areas, it lags behind in others (and does so at a [steep premium](https://openai.com/api/pricing/)).

This evaluation highlights the importance of intentional prompting strategies. Chain\-of\-thought prompting, in particular, is a powerful tool — refining your prompts can significantly boost performance, even for smaller, local models. By guiding the model to reason step\-by\-step, you can elevate its ability to handle more complex tasks.

Equally important is task\-specific evaluation. While newer models may excel in benchmarks, their performance doesn’t always translate to every task. The only way to determine which model is best for your use case is to develop a systematic, real\-world evaluation tailored to the specific challenges you’re addressing. This requirement makes it hard for practitioners to find the best model for their needs, creating an opportunity for future work to develop journalism\-specific benchmarks for evaluating LLMs.

There are limitations to consider. The o1 models are new, and as users learn how to prompt them more effectively, their performance may improve. OpenAI has also [indicated](https://www.axios.com/2024/09/19/openai-sam-altman-chatgpt-strawberry-o1) that o1 will evolve rapidly, meaning these findings could change with future updates. And this evaluation covers only a small subset of journalistic tasks, and different models may excel with different datasets or tasks.

In their current form, o1 models show promise in [some areas](https://www.nature.com/articles/d41586-024-03169-9) but are not yet the most reliable option for journalism tasks. Their reasoning abilities are impressive, but they often fall short compared to more established models like GPT\-4o. The key takeaway is that success with any model hinges on thoughtful prompting and thorough evaluation. As o1 continues to evolve, reassessing its strengths and weaknesses will be crucial to understanding its real\-world applications.


## Appendix A: Data analysis evaluation


### Fruit price scatterplot








### Electric vehicle histograms








### NYC collision heatmap:








## Appendix B: A/B test evaluation








