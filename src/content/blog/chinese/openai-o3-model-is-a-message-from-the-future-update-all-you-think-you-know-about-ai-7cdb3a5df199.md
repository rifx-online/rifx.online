---
title: "未来已来！OpenAI o3模型颠覆你对AI的所有想象！"
meta_title: "未来已来！OpenAI o3模型颠覆你对AI的所有想象！"
description: "OpenAI最近发布了其第二个推理AI模型o3及其小型版本o3-mini，展示了在数学、编码、科学和推理任务上显著超越前代模型的能力。o3在多个基准测试中取得了惊人的成绩，例如在SWE-bench中得分71.7%，在Codeforces中位于99.7百分位，显示出其在软件工程和竞争编程领域的卓越表现。此外，o3在GPQA Diamond和ARC-AGI等推理基准测试中也表现出色，标志着AI能力的重大飞跃。这一系列成果表明，o3不仅是技术的进步，更是AI领域的潜在变革。"
date: 2024-12-30T11:55:27Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*1t1U6m6ya6LyQakj.jpeg"
categories: ["Programming", "Machine Learning", "Data Science"]
author: "Rifx.Online"
tags: ["o3", "reasoning", "coding", "SWE-bench", "GPQA"]
draft: False

---



### 令人难以置信的奇迹，不仅仅是一个更先进的 AI 模型

OpenAI [以盛大的方式结束了他们为期 12 天的圣诞活动](https://youtu.be/SKBG1sqdyIU)。在第一天，他们推出了他们的 [第一个推理 AI 模型 o1 的完整版本](https://www.thealgorithmicbridge.com/p/openai-announces-o1-model-and-chatgpt)。今天，回到起点，他们揭示了下一步：o3，他们的第二个推理 AI 模型，以及 o3-mini，一个为编码而设计的更小、更快的版本。¹²

这一公告的重要性不可低估（尽管人们已经开始尝试这样做）：o3 在数学、编码、科学和推理问题上的表现是 *令人难以置信的*。说 o3 是最先进的（SOTA）在某种程度上是轻描淡写。我们习惯于 AI 实验室每个月都采取小步伐并相互争夺领先地位。但这次并非如此。OpenAI 的 o3 不仅夺取了 SOTA 的桂冠，它 *粉碎了竞争者重夺桂冠的希望*。³

还有另一种意义上，这一公告是一次突破。OpenAI 怎么能在 12 月 5 日发布一种新类型的 AI 模型的第一个版本，并在 12 月 20 日宣布下一个版本？ *仅仅十五天后*。写一篇该死的博客文章对我来说还需要更多时间。[OpenAI 的 Jason Wei 说](https://x.com/_jasonwei/status/1870184982007644614)，在扩展测试时间计算与预训练计算时，有些特别之处：速度快得多。三个月与 1-2 年的差距。

在你们对这个消息抱有希望之前，我应该强调一个词，*宣布*；OpenAI 并没有给我们访问权限。他们仍然需要进行后训练、安全测试和红队测试。现在，我们必须等待去触摸 o3 这一奇迹。（OpenAI 确实表示 o3-mini 将首先在 2025 年第一季度发布，随后不久将发布 o3）。

我将 o3 描述为令人难以置信的奇迹，*不仅仅是 SOTA*。我对 OpenAI 呈现的结果感到兴奋，我有充分的理由。我们应该等待模型发布后的现实世界的评判，但在此期间，你可以看看这些数字，与我一起感到兴奋。

## 编程

OpenAI 在软件工程 (SWE-bench Verified) 和竞赛代码 (Codeforces) 上测试了 o3。这些是与 o1 和 o1-preview 的比较结果：



[SWE-bench Verified](https://openai.com/index/introducing-swe-bench-verified/) 是基于 [SWE-bench](https://www.swebench.com/) 的以代理为中心的评估。问题是软件工程师在日常工作中面临的典型问题 (GitHub issues)。得分 71.7% 非常惊人。⁴

这是第二优秀模型 (o1, GPT-4o, Claude 3.6 Sonnet, Gemini 2.0 Flash) 在 SWE-bench Verified 上的图表：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*awzPBAfwGC5Lv9lc.png)

Claude 3.6 Sonnet (他们称之为 [3.5 new](https://www.anthropic.com/news/3-5-models-and-computer-use))：50.8%。不错

Gemini 2.0 Flash (他们 [几天前发布](https://deepmind.google/technologies/gemini/flash/))：51.8%。非常不错。

现在这是当我添加 o3 的得分 71.7% 时同一图表的样子：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*KgS2GQ_8YW2v1hp1.png)

我们从未见过直接的 20% 跳跃。这不是“不错”或“非常不错”，这是 *我们必须重新考虑其影响* 的不错。20% 是从 GPT-4o（甚至不是为 SWE 任务设计的）到 2.0 Flash 和 3.6 Sonnet 的同样跳跃。GPT-4o 于 2024 年 5 月发布！

让我们继续。以下是 Codeforces 结果的一些背景。2727 的 ELO 使得 o3 [位于全球前 200 名竞争程序员之中](https://x.com/deedydas/status/1870175212328608232)。它的得分高于 OpenAI 自己首席科学家的 [2665](https://x.com/rowancheung/status/1870169402248945822)。

它位于 *99.7 百分位* 内！

DeepMind [在 2023 年 12 月宣布了 AlphaCode 2](https://storage.googleapis.com/deepmind-media/AlphaCode2/AlphaCode2_Tech_Report.pdf)。它专门在 Codeforces 上进行训练，并达到了第 87 百分位。当时非常惊人。但这相当于 [专家评级](https://codeforces.com/topic/123660/en1)。相比之下，OpenAI 则构建了一个 Codeforces 大师：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*eS2Jk31cPzthaK2Y.png)

[国际象棋](https://en.wikipedia.org/wiki/Deep_Blue_(chess_computer)) 首先倒下。然后是 [围棋](https://deepmind.google/research/breakthroughs/alphago/)。接着是 [扑克](https://www.science.org/doi/10.1126/science.aay2400) 和 [Dota](https://openai.com/index/openai-five-defeats-dota-2-world-champions/) 以及 [星际争霸](https://deepmind.google/discover/blog/alphastar-mastering-the-real-time-strategy-game-starcraft-ii/)。现在轮到代码了。

然后 [其余的将会倒下](https://en.wikipedia.org/wiki/Deep_Blue_(chess_computer))。

## 数学与科学

OpenAI在竞争数学（AIME 2024\）和博士级“谷歌防范”科学问题（GPQA Diamond）上测试了o3。结果与o1和o1\-preview进行了比较。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*fk9TbF1uFKxI6r0P.jpeg)

让我们从GPQA Diamond开始。[我在六月写过这个](https://www.thealgorithmicbridge.com/p/phds-fail-this-5th-grade-riddle-can)：

> *世界上最好的两个模型，Anthropic的[Claude Sonnet 3\.5](https://www.anthropic.com/news/claude-3-5-sonnet)和OpenAI的[GPT\-4o](https://openai.com/index/hello-gpt-4o/)在最难的推理基准GPQA（研究生级“谷歌防范问答”）上超过了50%的分数。*

我称之为“最难的推理基准”。六个月后，o3的得分为87\.7%。

作为比较，博士在其专业领域的平均得分为70%。我对任何事情都不是专家（只是一个航空航天工程的本科生），但如果这可以作为另一个比较，我曾经看过一些GPQA项目，我很确定我得了0%并且崩溃了。

数学怎么样？OpenAI的高级副总裁Mark Chen在演示中提到，AIME上的96\.7%得分意味着o3“通常只错一个问题。”这很令人印象深刻。与此同时，这也没什么。o3在数学方面表现得如此出色，以至于AIME无法反映它的能力。

数学基准（AIME、MATH、GSM8K等）已趋于饱和，顶尖分数远超90%\+。这就是为什么Epoch AI（与OpenAI合作）创建了[FrontierMath](https://epoch.ai/frontiermath)。当我在宣布的那一周[审查](https://www.thealgorithmicbridge.com/p/weekly-top-picks-88)这个新的超难数学基准时，我总结了它的价值：

* 未发表的问题，因此没有污染。
* 解答是自动可验证的。
* “猜测防范”。没有理由不要试运气。

并增加了其复杂性的视觉证据，即使对于那些在其他更简单的数学基准上获得90%\+的顶尖模型；看看所有的空白区域：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*xijfFABu99ZWB4GF.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*Uu8BU2uKBJ7mfxjg.png)

世界上最优秀的数学家之一Terence Tao比任何图表都说得更好：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*UkYuRfLIrltOtZE9.png)

“几年，”这位菲尔兹奖得主说。“给我拿着酒，”人工智能说。

当你给出可能是最难的数学问题——Mark Chen所说的那种需要专业数学家“几个小时或几天”才能解决的问题——并让o3尝试时，会发生这样的事情：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*ieltUSF5YvmKsv41.jpeg)

你得到的不是20%的提升，而是*1200%的提升*。

25%仍然远未达到100%，对吧？我敢打赌这仍然在专家预测的范围内。这是另一位世界级数学家和菲尔兹奖得主Timothy Gowers在*一个月前*对FrontierMath的看法：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*2jhwDiaRE2ZzqHmc.png)

OpenAI的o3不仅打破了基准，还打破了期望。

接下来你会发现，它正在打破你的心。

## 推理

我终于来到了我最喜欢的部分，也是我情感上最投入的部分。原因是我心爱的 ARC-AGI 基准测试，我已经赞扬了好几个月，而大多数行业却对此置之不理。

我之所以强调它而不是其他基准，如 MMLU、MATH 或甚至 GPQA，是因为它更接近完美的基准：一个大多数人类都能轻松解决、几乎任何人都能轻易验证的基准，但对 AI 模型来说却似乎是不可解的，无论其多么先进。

ARC-AGI 的前一个版本最初是由 [François Chollet 在 2019 年提出的](https://arxiv.org/abs/1911.01547)，它是*看似简单*的，生动体现了莫拉维克悖论——对我们来说简单的事情，对 AI 可能并不简单，反之亦然。这里有一个例子：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*tO1ZOifqC9BIHVVH.png)

你能解决它吗？GPT-4o、3.5 Sonnet 或 Gemini 1.5 都无法解决这个问题，揭示了一些我原本会错过的未解之谜：为什么 AI 在回答这个 [五年级学生能解的谜题](https://www.thealgorithmicbridge.com/p/phds-fail-this-5th-grade-riddle-can) 时失败，而在量子力学的博士问题上却能给出准确的回答？这，讽刺的是，令人困惑。

直到今天，Chollet 在 2024 年发起的 [ARC-AGI 挑战](https://arcprize.org/) 的最高分勉强超过 50%。此外，所有的高分都是通过经过调整的模型实现的，以便更容易应对 ARC-AGI。整体表现最好的模型得分更低，GPT-4o 的最高得分仅为荒谬的 5%。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*aQQ7W5FrwGluxlhu.png)

恰巧的是，OpenAI 与 ARC-AGI 的团队合作测试了 o3。

[这些是结果](https://x.com/fchollet/status/1870169764762710376)：o3 以 87.5% 的分数击败了 ARC-AGI。⁵⁶

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*E16-EThz1AdRdZtU.jpeg)

[Chollet 对这些结果的看法](https://arcprize.org/blog/oai-o3-pub-breakthrough)是：

> *为了提供背景，ARC-AGI-1 \[这个基准] 从 2020 年 GPT-3 的 0% 到 2024 年 GPT-4o 的 5% 花费了 4 年时间。关于 AI 能力的所有直觉都需要为 o3 更新……OpenAI 的新 o3 模型代表了 AI 适应新任务能力的重大飞跃。这不仅仅是渐进的改进，而是真正的突破，标志着 AI 能力与之前 LLM 的局限性相比的质变。*

我已经说过一段时间，GPQA Diamond、ARC-AGI，以及现在的 FrontierMath 是当今最重要的基准。我没有预料到 ARC-AGI 会发生这样的事情。[o1 刚刚得到了 32% 的分数](https://x.com/arcprize/status/1869551373848908029)！我们都对接下来的几个月可能揭示的内容感到高兴和期待。*这花了几天时间*。

而且，更令人惊讶的是，o3 [甚至不需要提示工程](https://x.com/GregKamradt/status/1870208490096218244)。 “找到将输入网格映射到输出网格的共同规则”就足够了。⁷

让我总结一下，因为信息量太大，难以处理：o3 所做的就是跃入未知领域。OpenAI [相信这个轨迹](https://x.com/polynoamial/status/1855455993611661639)并在这里成功着陆。在 71.7% SWE-bench、99.95 百分位 Codeforces、96.7 AIME、87.7 GPQA Diamond、25.2% FrontierMath 和 87.5% ARC-AGI 的成绩上。

我们不知道这一切意味着什么。我们不知道未来会发生什么。我们不知道接下来的几年会怎样。天哪，GPT-3 是四年前的事情。

很多人说 o3 是人工通用智能（AGI），或者至少是 AGI 的一种软形式。[Chollet 否认了这一说法](https://x.com/fchollet/status/1870170778458828851)，他的论点让我想起了“[没有 AGI 有时是愚蠢的](https://www.thealgorithmicbridge.com/i/152656087/ii-no-agi-is-dumb-at-times)”这个想法。他说，击败 ARC-AGI 是声称 AGI 能力的必要但不充分条件，并且仍然有 [研究要做](https://x.com/fchollet/status/1870171986124779650)。

我不知道该怎么想。不同任务之间的智能差异仍然很大，否则 o3 不会在完成 FrontierMath 时失败任何 ARC-AGI 任务，但似乎抵御 AI 不可阻挡进步的最后堡垒正在一个个倒下。这是 [痛苦的](http://www.incompleteideas.net/IncIdeas/BitterLesson.html) 吗？甚至是 [更痛苦的](https://www.thealgorithmicbridge.com/p/gpt-4-the-bitterer-lesson)？我不知道。新的壁垒会出现以抵御当前技术吗，正如 Chollet 希望通过 [ARC-AGI-v2](https://x.com/fchollet/status/1870171031945785821) 实现的那样？我也不知道。

我需要反思这些结果，并等待 o3 发布，以便我们共同找出 OpenAI 刚刚创造了什么。

我知道的是，我的先入之见无法承受这次审判。这是别的东西。OpenAI o3 是来自未来的信息：更新你对 AI 的所有认知。我收到了这个信息。我在 o1、[AI 的新范式](https://www.thealgorithmicbridge.com/p/openai-o1-a-new-paradigm-for-ai) 中看到了*它的到来*，但我仍然感到无言以对。

圣诞快乐，大家。圣诞快乐。

*加入 [**算法桥**](https://thealgorithmicbridge.substack.com/subscribe)，一个关于 AI 的博客，实际上是关于人类的。*

## 脚注

1. 名称不是“o2”的原因与另一家公司存在的[版权问题](https://www.theinformation.com/briefings/openai-preps-o3-reasoning-model)有关。
2. 我将在这篇文章中专注于o3，因为覆盖更多内容会使其变得笨重。我可能会单独写关于o3-mini的内容，探讨其较低的成本和较低的延迟，这对用户意味着什么，以及它如何与OpenAI的目标——将智能成本降低到零——相结合。
3. 为了健康的竞争，我希望我在夸大其词，尽管我恐怕我确实相信我所说的。
4. o3可能在一个比pass@1更宽松的环境中被评估，获得了71.7%的分数，而pass@1测量的是第一次尝试解决问题的准确性。原因是o1得到了48.9%的分数，但OpenAI在o1发布时发布的系统卡片[将分数定为41%](https://cdn.openai.com/o1-system-card-20241205.pdf)。另一种解释，我暂时假设这是真的，是[正如roon所说](https://x.com/tszzl/status/1864918805325238526)，在评估o1的SWE-bench时出现了问题，而41%的结果实际上来自o1的一个早期、较差的版本。
5. 请注意x轴。OpenAI在o3上花费的金额以获得该分数是极其庞大的。o1在[$3.8/任务](https://x.com/arcprize/status/1869551373848908029)的情况下得到了32%。而o3在高计算模式下的花费超过了整个挑战奖金[$1,600,250](https://x.com/Sauers_/status/1870197781140517331)。
6. Chollet否认ARC-AGI被击败，首先，o3是在公共评估集上测试的，而不是私有测试集，其次，ARC-AGI奖项要求85%的准确率，同时每个任务的计算能力花费为[$0.1](https://x.com/fchollet/status/1870170897283526723)。
7. 这意味着提示工程已经死去。我知道这种说法已经被反复提及，但事实是，它从未真正存在过，它只是一个不愿意获得应有的永恒安息的僵尸。好吧，它即将安息。

