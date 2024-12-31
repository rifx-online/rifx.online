---
title: "OpenAI o3 Model Is a Message From the Future: Update All You Think You Know About AI"
meta_title: "OpenAI o3 Model Is a Message From the Future: Update All You Think You Know About AI"
description: "OpenAI has launched its second reasoning AI model, o3, following the o1 model, showcasing significant advancements in math, coding, and reasoning capabilities. O3 achieved remarkable scores, including 71.7% on SWE-bench and 87.7% on GPQA Diamond, indicating a substantial leap in performance over previous models. Notably, o3 demonstrated exceptional results in competitive coding, placing it among the top programmers globally. While OpenAI has announced these breakthroughs, access to the model remains limited as further testing is required. The release of o3 signals a potential shift in AI capabilities, prompting a reevaluation of existing benchmarks and expectations in the field."
date: 2024-12-30T11:55:27Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*1t1U6m6ya6LyQakj.jpeg"
categories: ["Programming", "Machine Learning", "Data Science"]
author: "Rifx.Online"
tags: ["o3", "reasoning", "coding", "SWE-bench", "GPQA"]
draft: False

---





### Incredible, a miracle, more than just a better state\-of\-the\-art AI model

OpenAI [ended its 12\-day Christmas event](https://youtu.be/SKBG1sqdyIU) with a bang. On day one they launched the full version of their [first reasoning AI model, o1](https://www.thealgorithmicbridge.com/p/openai-announces-o1-model-and-chatgpt). Today, circling back to the beginning, they’ve revealed their next step: o3, their second reasoning AI model, and o3\-mini, a smaller, faster version made for coding.¹²

The significance of the announcement can’t be overstated (although people are already trying): o3’s performance in math, coding, science, and reasoning problems is *incredible*. Saying o3 is state\-of\-the\-art (SOTA) is, in a way, an understatement. We’re used to AI labs taking small steps and snatching the lead from one another every month. This was not it. OpenAI o3 didn’t just snatch the SOTA crown, it *obliterated the aspirants’ hopes* of getting it back anytime soon.³

There’s another sense in which this announcement was a breakthrough. How on earth did OpenAI manage to release the first version of a new type of AI model on December 5th and announce the next version on December 20th? *Fifteen days later*. It takes me more time to write a damn blog post. [OpenAI’s Jason Wei says](https://x.com/_jasonwei/status/1870184982007644614) there’s something special about scaling test\-time compute vs pre\-training compute: it’s much faster. Three months vs 1–2 years kind of faster.

I should underscore here one word, *announce*, before you get your hopes up; OpenAI is not giving us access. They still have post\-training, safety testing, and red\-teaming to do. For now, we will have to wait to touch the miracle that is o3\. (OpenAI did say that o3\-mini will be released first, sometime in Q1 2025, followed shortly after by o3\).

I described o3 as incredible, a miracle, and *more than just SOTA*. I’m admittedly enthusiastic about the results OpenAI presented. I have good reasons to be. We should wait for the judgment of the real world once the model is out, but in the meantime, you can take a look at the numbers to get excited with me.


## Coding

OpenAI tested o3 on software engineering (SWE\-bench Verified) and competition code (Codeforces). These are the results compared with o1 and o1\-preview:



[SWE\-bench Verified](https://openai.com/index/introducing-swe-bench-verified/) is an agent\-focused evaluation based on [SWE\-bench](https://www.swebench.com/). The questions are typical problems software engineers face in their usual work (GitHub issues). A score of 71\.7% is crazy.⁴

Here’s a graph of the second\-to\-best models (o1, GPT\-4o, Claude 3\.6 Sonnet, Gemini 2\.0 Flash) on SWE\-bench Verified:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*awzPBAfwGC5Lv9lc.png)

Claude 3\.6 Sonnet (they call it [3\.5 new](https://www.anthropic.com/news/3-5-models-and-computer-use)): 50\.8%. Nice

Gemini 2\.0 Flash (they [released it](https://deepmind.google/technologies/gemini/flash/) literally *days ago*): 51\.8%. Very nice.

Now this is what that same graph looks like when I add o3‘s score of 71\.7%:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*KgS2GQ_8YW2v1hp1.png)

We’ve never seen a direct 20% jump before. This is not “nice” or “very nice,” this is *we\-have\-to\-reconsider\-the\-implications* nice. 20% is the same jump from GPT\-4o (not even designed for SWE tasks) to 2\.0 Flash and 3\.6 Sonnet. GPT\-4o was released in May 2024!

Let’s keep going. Here’s some context on the Codeforces result. An ELO of 2727 puts o3 [among the best 200 competitive programmers](https://x.com/deedydas/status/1870175212328608232) in the world. It’s higher than OpenAI’s own chief scientist’s score of [2665](https://x.com/rowancheung/status/1870169402248945822).

It is within the *99\.7th percentile*!

DeepMind [announced AlphaCode 2](https://storage.googleapis.com/deepmind-media/AlphaCode2/AlphaCode2_Tech_Report.pdf) in December 2023\. It was specifically trained on Codeforces and reached the 87th percentile. Amazing at the time. But that’s the equivalent of an [Expert rating](https://codeforces.com/topic/123660/en1). In contrast, OpenAI just built a Codeforces grandmaster:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*eS2Jk31cPzthaK2Y.png)

[Chess](https://en.wikipedia.org/wiki/Deep_Blue_(chess_computer)) fell first. Then [Go](https://deepmind.google/research/breakthroughs/alphago/). Then [Poker](https://www.science.org/doi/10.1126/science.aay2400) and [Dota](https://openai.com/index/openai-five-defeats-dota-2-world-champions/) and [Starcraft](https://deepmind.google/discover/blog/alphastar-mastering-the-real-time-strategy-game-starcraft-ii/). Now it’s code’s turn.

Then [the rest will fall](https://en.wikipedia.org/wiki/Deep_Blue_(chess_computer)).


## Math and science

OpenAI tested o3 on competition math (AIME 2024\) and PHD\-level “Google\-proof” science questions (GPQA Diamond). Results compared to o1 and o1\-preview.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*fk9TbF1uFKxI6r0P.jpeg)

Let’s start with GPQA Diamond. [I wrote this in June](https://www.thealgorithmicbridge.com/p/phds-fail-this-5th-grade-riddle-can):


> *The two best models in the world, Anthropic’s [Claude Sonnet 3\.5](https://www.anthropic.com/news/claude-3-5-sonnet) and OpenAI’s [GPT\-4o](https://openai.com/index/hello-gpt-4o/) surpass the 50% mark on the hardest reasoning benchmark, the GPQA (graduate\-level “Google\-Proof Q\&A”).*

I called it the “hardest reasoning benchmark.” Six months later o3 scores 87\.7%.

For comparison, PhDs score on average 70% on their field of expertise. I’m not an expert on anything (just an aerospace engineering undergrad) but if it serves as another comparison, I once glimpsed at some GPQA items and I’m pretty sure I got 0% and a meltdown.

What about math? OpenAI SVP Mark Chen said during the presentation that a 96\.7% score on AIME means o3 “often just misses one question.” That’s impressive. At the same time, it’s nothing. o3 is so good at math that AIME can’t reflect its prowess.

Math benchmarks (AIME, MATH, GSM8K, etc.) are saturated, with top scores well beyond 90%\+. That’s why Epoch AI (in collaboration with OpenAI), created [FrontierMath](https://epoch.ai/frontiermath). When I [reviewed](https://www.thealgorithmicbridge.com/p/weekly-top-picks-88) this new ultra\-hard math benchmark the week it was announced, I summarized its value like this:

* Unpublished problems so no contamination.
* Solutions are automatically verifiable.
* “Guessproof”. Don’t try your luck without reason.

And added visual evidence of its complexity, even for those top models getting 90%\+ on other, easier math benchmarks; just look at all that white space:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*xijfFABu99ZWB4GF.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*Uu8BU2uKBJ7mfxjg.png)

Terence Tao, one of the world’s best mathematicians said it better than any graph could:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*UkYuRfLIrltOtZE9.png)

“Several years,” said the Fields medalist. “Hold my beer,” said the artificial intelligence.

This is what happens when you take the hardest possible math problems — the kind that would take professional mathematicians “hours or days” to solve, as Mark Chen puts it — and ask o3 to try:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*ieltUSF5YvmKsv41.jpeg)

You don’t get a 20% improvement, you get a *1200% improvement*.

25% is still far from 100%, right? I bet this was still in the ballpark of experts’ predictions. Here’s Timothy Gowers, another world\-class mathematician and Fields medalist, on FrontierMath *one month ago*:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*2jhwDiaRE2ZzqHmc.png)

OpenAI o3 is not only breaking benchmarks but also expectations.

Next thing you know, it’s breaking your heart.


## Reasoning

We’ve finally arrived at my favorite section, the one I’m most emotionally invested in. The reason is my beloved ARC\-AGI benchmark, which I’ve been praising for months on end while most of the industry ignored it.

The reason I highlighted it over others like MMLU, MATH, or even GPQA, is that it was closer to the perfect benchmark: One that most humans could easily solve, easily verifiable by basically anyone, yet seemingly impossible to figure out for AI models, however advanced.

ARC\-AGI, a prior version of which was originally proposed [by François Chollet in 2019](https://arxiv.org/abs/1911.01547), is *deceptively simple*, a living instance of Moravec’s paradox — what’s easy for us may not be for AI and vice versa. Here’s an example:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*tO1ZOifqC9BIHVVH.png)

Can you solve it? The fact that neither GPT\-4o, 3\.5 Sonnet, or Gemini 1\.5 could figure this out unveiled some unanswered mysteries that I would have missed otherwise: Why is AI failing this puzzle that [five\-graders can solve](https://www.thealgorithmicbridge.com/p/phds-fail-this-5th-grade-riddle-can) while responding with accuracy PhD questions on quantum mechanics? It was, ironically, puzzling.

Until today, the top score on the [ARC\-AGI challenge](https://arcprize.org/) that Chollet launched in 2024, was barely more than 50%. Additionally, all top scores were achieved by scaffolded models, tweaked to face ARC\-AGI more easily. The best overall models got much worse scores, with GPT\-4o peaking at a ludicrous 5%.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*aQQ7W5FrwGluxlhu.png)

As it happens, OpenAI partnered with the people behind ARC\-AGI to test o3\.

[These are the results](https://x.com/fchollet/status/1870169764762710376): o3 beat ARC\-AGI with a score of 87\.5%.⁵⁶

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*E16-EThz1AdRdZtU.jpeg)

[Chollet says this](https://arcprize.org/blog/oai-o3-pub-breakthrough) about the results:


> *For context, ARC\-AGI\-1 \[this benchmark] took 4 years to go from 0% with GPT\-3 in 2020 to 5% in 2024 with GPT\-4o. All intuition about AI capabilities will need to get updated for o3\. . . . OpenAI’s new o3 model represents a significant leap forward in AI’s ability to adapt to novel tasks. This is not merely incremental improvement, but a genuine breakthrough, marking a qualitative shift in AI capabilities compared to the prior limitations of LLMs.*

I’ve been saying for a while that GPQA Diamond, ARC\-AGI, and now also FrontierMath are the most important benchmarks today. I didn’t expect this to happen with ARC\-AGI. [o1 just got 32%](https://x.com/arcprize/status/1869551373848908029)! We were all happy and expectant about what the next months could reveal. *It took days*.

And, to top it off, o3 [didn’t even need prompt engineering](https://x.com/GregKamradt/status/1870208490096218244). “Find the common rule that maps an input grid to an output grid” was enough.⁷

Let me sum all this up because it’s too much information to process: What o3 just did is leap into uncharted territory. OpenAI [trusted the trajectory](https://x.com/polynoamial/status/1855455993611661639) and landed here. At 71\.7% SWE\-bench, 99\.95th percentile Codeforces, 96\.7 AIME, 87\.7 GPQA Diamond, 25\.2% FrontierMath and 87\.5% ARC\-AGI.

We don’t know what any of this means. We don’t know what lies further ahead. We don’t know what the next years hold. GPT\-3 was four years ago for God’s sake.

Plenty of people are saying o3 is artificial general intelligence (AGI), or at least a soft form of AGI. [Chollet denies the claim](https://x.com/fchollet/status/1870170778458828851) with an argument that reminds me of the idea that “[no AGI is dumb at times](https://www.thealgorithmicbridge.com/i/152656087/ii-no-agi-is-dumb-at-times).” He says beating ARC\-AGI was a necessary but not sufficient condition to claim AGIness, and that there’s still [research to do](https://x.com/fchollet/status/1870171986124779650).

I’m not sure what to think. The variance in intelligence across tasks is still high or o3 wouldn’t fail a single ARC\-AGI task while striding through FrontierMath, but the last bastions resisting the unstoppable advance of AI seem to be falling one by one. Is it [bitter](http://www.incompleteideas.net/IncIdeas/BitterLesson.html)? Is it even [more bitter](https://www.thealgorithmicbridge.com/p/gpt-4-the-bitterer-lesson)? I don’t know. Will new walls emerge to resist current techniques, as Chollet hopes to achieve with [ARC\-AGI\-v2](https://x.com/fchollet/status/1870171031945785821)? I also don’t know.

I need to reflect on these results and wait for o3 to come out so we can collectively find out what OpenAI has just created.

What I know is that my priors won’t survive this reckoning. This is something else. OpenAI o3 is a message from the future: update everything you think you know about AI. I got the message. I saw *it coming* with o1, with the [new paradigm of AI](https://www.thealgorithmicbridge.com/p/openai-o1-a-new-paradigm-for-ai), but I’m left speechless nonetheless.

Merry Christmas, guys. Merry Christmas.

*Join [**The Algorithmic Bridge**](https://thealgorithmicbridge.substack.com/subscribe), a blog about AI that’s actually about people.*


## Footnotes

1. The reason why the name is not “o2” is related to a [copyright issue with another company](https://www.theinformation.com/briefings/openai-preps-o3-reasoning-model).
2. I’ll focus this article solely on o3, as covering more would make it unwieldy. I’ll probably write separately about o3\-mini down the line, looking at its lower cost and lower latency, what that means for users, and how it ties into OpenAI’s stated goal of driving the cost of intelligence down to zero.
3. For the sake of healthy competition, I hope I’m exaggerating, although I’m afraid I do believe what I say.
4. It’s possible that o3 got a 71\.7% score being evaluated in a more generous setting than pass@1, which measures the accuracy of solving the questions in the first attempt. The reason is that o1 gets 48\.9% but the system card OpenAI published during the o1 release [puts the score at 41%](https://cdn.openai.com/o1-system-card-20241205.pdf). Another explanation, the one I will assume is true for the moment, is that, [as roon said](https://x.com/tszzl/status/1864918805325238526), there was a problem when evaluating o1 for SWE\-bench and the 41% result is actually from a previous, inferior version of o1\.
5. Note the x\-axis. The amount of money OpenAI spent on o3 to get that score is hilariously large. o1 got 32% at [$3\.8/task](https://x.com/arcprize/status/1869551373848908029). o3 on the high compute regime took more than the entire prize of the challenge, [$1,600,250](https://x.com/Sauers_/status/1870197781140517331).
6. Chollet denies ARC\-AGI was beaten because first, o3 was tested on the public evaluation set, not the private test set, and second, because the ARC\-AGI prize stated a requirement of 85% accuracy while spending [$0\.1 of computing power](https://x.com/fchollet/status/1870170897283526723) per task.
7. This means prompt engineering is dead. I know that claim has been made ad nauseam but the truth is, it was never alive in the first place, it was just a zombie that didn’t want to get its deserved eternal rest. Well, it’s about to RIP.

