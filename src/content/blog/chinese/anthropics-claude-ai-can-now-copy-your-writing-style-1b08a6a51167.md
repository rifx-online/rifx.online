---
title: "Anthropic 的克劳德人工智能现在可以复制你的写作风格"
meta_title: "Anthropic 的克劳德人工智能现在可以复制你的写作风格"
description: "Anthropic推出的Claude AI新功能“创建你的风格”允许用户根据个人需求定制写作风格，增强与AI的互动体验。用户可以选择默认、简洁、解释性或正式的响应风格，或上传示例文本以生成自定义风格的内容。这一功能简化了传统的微调过程，使非技术用户也能轻松实现AI写作风格的个性化，提升工作效率，适用于多种应用场景，如技术文档和市场营销材料。"
date: 2024-12-05T12:36:46Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Kcgez6GPjUmB5qMeMWiEjg.jpeg"
categories: ["Programming", "Natural Language Processing", "Generative AI"]
author: "Rifx.Online"
tags: ["Claude", "Customize", "Styles", "Fine-tuning", "Writing"]
draft: False

---





我作为多个组织的AI大使已经工作了几个月，如果有一个问题是大多数用户不断询问的，那就是如何让AI聊天机器人像他们一样写作。基本上，他们希望像ChatGPT、Claude和Gemini这样的聊天机器人能够模仿他们的写作风格，这样他们就不必每次都给AI提供详细的指示。

我总是告诉用户，他们可以通过两种方式做到这一点：

1. **简单的方法：** 创建一个自定义聊天机器人，添加指示，例如以特定的风格、语气或长度进行回复。你甚至可以提供一个示例让它模仿。这可以通过ChatGPT中的自定义GPT或Gemini中的Gems来完成。
2. **复杂但更有效的方法：** 进行一个称为[微调](https://generativeai.pub/fine-tune-large-language-models-with-your-own-data-9c3798aea5bc)的过程，在这个过程中，语言模型会在你的样本数据上进行训练，以更精确地复制你的写作风格。

第二种方法通常更有效，但对于非技术用户来说也更复杂。这种复杂性源于缺乏易于使用的微调工具。

然而，Anthropic通过推出一个全新的Claude功能**“创建你的风格”**正在改变这一点。

## 什么是自定义样式？

自定义样式是一种让您根据独特需求和工作流程定制Claude响应的方式。

如果您是一名从事技术文档的开发人员、塑造品牌指南的市场营销人员，或是产品团队的一员，概述详细项目需求，Claude可以无缝适应您的独特写作风格。

查看新功能的实际应用：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*dGqyEmE-XtCAj5jHNaWT-A.gif?output=gif&n=50)

GitLab是首批将此新功能纳入其工作流程的主要平台之一。

> “Claude在不同上下文中保持一致声音的能力，使我们的团队能够在各种用例中应用它，从撰写商业案例和更新用户文档到创建和翻译营销材料。现成样式的快速对齐与针对个人偏好的自定义样式的结合，使其成为一个极具价值的工具。” — Taylor McCaslin, GitLab的AI和ML技术产品负责人

## 它是如何工作的

当您打开Claude的界面时，您会注意到一个新的菜单，标记为**“选择风格”**，位于模型选择下拉菜单旁边。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*uO1Kt8xPELCnDGL_uDXqdA.png)

写作风格选择菜单允许您在以下选项之间进行调整：

* **正常：** Claude的默认响应
* **简洁：** 更短的响应和更多的消息
* **解释性：** 用于学习的教育性响应
* **正式：** 清晰且结构良好的响应

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*d1NcbmEmrp0uYjB8WoCDIA.png)

这个功能有趣之处在于：您还可以通过点击**“创建和编辑风格”**按钮来创建自己的自定义写作风格。

在右侧部分，您可以上传反映您希望Claude模仿的写作风格的示例文档或文本文件。重要的是，这些文件不会存储在Claude的记忆或服务器中，以确保您的隐私。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*nxZpV458bObiidF5Fr5uNA.png)

让我们通过上传示例莎士比亚十四行诗来测试这个功能，内容如下：


```python
1. Sonnet 106
When in the chronicle of wasted time
I see descriptions of the fairest wights,
And beauty making beautiful old rhyme
In praise of ladies dead, and lovely knights,
Then, in the blazon of sweet beauty’s best,
Of hand, of foot, of lip, of eye, of brow,
I see their antique pen would have express’d
Even such a beauty as you master now.
So all their praises are but prophecies
Of this our time, all you prefiguring;
And, for they look’d but with divining eyes,
They had not skill enough your worth to sing:
For we, which now behold these present days,
Had eyes to wonder, but lack tongues to praise.
 
2. Sonnet 138
When my love swears that she is made of truth
I do believe her, though I know she lies,
That she might think me some untutor’d youth,
Unlearned in the world’s false subtleties.
Thus vainly thinking that she thinks me young,
Although she knows my days are past the best,
Simply I credit her false speaking tongue:
On both sides thus is simple truth suppress’d.
But wherefore says she not she is unjust?
And wherefore say not I that I am old?
O, love’s best habit is in seeming trust,
And age in love loves not to have years told:
Therefore I lie with her and she with me,
And in our faults by lies we flatter’d be.
 
3. Sonnet 98
From you have I been absent in the spring,
When proud-pied April dress’d in all his trim
Hath put a spirit of youth in every thing,
That heavy Saturn laugh’d and leap’d with him.
Yet nor the lays of birds nor the sweet smell
Of different flowers in odour and in hue
Could make me any summer’s story tell,
Or from their proud lap pluck them where they grew;
Nor did I wonder at the lily’s white,
Nor praise the deep vermilion in the rose;
They were but sweet, but figures of delight,
Drawn after you, you pattern of all those.
Yet seem’d it winter still, and, you away,
As with your shadow I with these did play.
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*4Dj0aLUjTpz--kS162HA9A.png)

接下来，点击**“使用风格”**按钮，以开始生成具有您自定义写作风格的内容。在这种情况下，这种风格被称为*Sonnet Weaver*。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*bEjDsNfKN_mFWnSt3K6qow.png)

现在，让我们尝试用这个简单的提示生成一首诗：


> **提示：** 写一首诗

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*avZLaDXXqu_SzqyYgzxJYQ.png)


```python
Upon the Threshold of Twilight
When twilight draws her veil across the sky,
And paints with amber brush the fading day,
Each tender star that dares to catch mine eye
Doth bid sweet thoughts of thee to come and stay.
The gentle wind that whispers through the leaves
Bears fragments of our laughter, soft and clear;
While Time, that cruel thief who oft deceives,
Cannot diminish what we treasure here.
In nature's dance I see thy graceful form,
As moonlight steps with silver-sandaled feet;
Though winter comes with its relentless storm,
Within my heart thy summer stays complete.
So let the world its endless circles spin,
While love's eternal light burns bright within.
A second stanza emerges:
The garden where we walked in spring's first light,
When morning dew adorned each opening flower,
Remains untouched by Time's ungentle flight,
Preserved within this sacred memory's bower.
Each rose that bloomed beneath thy gentle gaze
Still holds the warmth of that enchanted morn;
Though autumn mists now shroud these shorter days,
Our love, like spring, is endlessly reborn.
The sundial's shadow marks the hours' swift pace,
Yet cannot measure depths of true love's worth;
For in the temple of thy sweet embrace,
Time loses power, and moments find new birth.
Thus do I pledge, by stars that crown the night,
To keep our love forever burning bright.
```
如您所见，Claude成功地创作了一首以莎士比亚风格的诗，而没有明确提到这位著名的作者。

这个功能对于任何喜欢尝试不同写作风格的人来说都非常强大。您还可以调整提示或尝试上传不同的示例文档或文本，以帮助Claude更好地捕捉您想要的风格。

## 它与手动微调相比如何？

为了让您了解传统微调的工作方式，我将为您总结一下这个过程。对于开发者来说，最常用的方法是使用 OpenAI 的 [playground](https://platform.openai.com/playground/)。

您首先需要做的是将输入数据格式化为这样的 JSON 文件：


```python
{
    "messages": [
        {
            "role": "system",
            "content": "Collection of Shakespeare's Sonnets in JSON format."
        },
        {
            "role": "user",
            "content": "Requesting formatted sonnets for reference."
        },
        {
            "role": "assistant",
            "content": [
                {
                    "Sonnet": "106",
                    "Content": "When in the chronicle of wasted time\nI see descriptions of the fairest wights,\nAnd beauty making beautiful old rhyme\nIn praise of ladies dead, and lovely knights,\nThen, in the blazon of sweet beauty's best,\nOf hand, of foot, of lip, of eye, of brow,\nI see their antique pen would have express'd\nEven such a beauty as you master now.\nSo all their praises are but prophecies\nOf this our time, all you prefiguring;\nAnd, for they look'd but with divining eyes,\nThey had not skill enough your worth to sing:\nFor we, which now behold these present days,\nHad eyes to wonder, but lack tongues to praise."
                },
                {
                    "Sonnet": "138",
                    "Content": "When my love swears that she is made of truth\nI do believe her, though I know she lies,\nThat she might think me some untutor'd youth,\nUnlearned in the world's false subtleties.\nThus vainly thinking that she thinks me young,\nAlthough she knows my days are past the best,\nSimply I credit her false speaking tongue:\nOn both sides thus is simple truth suppress'd.\nBut wherefore says she not she is unjust?\nAnd wherefore say not I that I am old?\nO, love's best habit is in seeming trust,\nAnd age in love loves not to have years told:\nTherefore I lie with her and she with me,\nAnd in our faults by lies we flatter'd be."
                },
                {
                    "Sonnet": "98",
                    "Content": "From you have I been absent in the spring,\nWhen proud-pied April dress'd in all his trim\nHath put a spirit of youth in every thing,\nThat heavy Saturn laugh'd and leap'd with him.\nYet nor the lays of birds nor the sweet smell\nOf different flowers in odour and in hue\nCould make me any summer's story tell,\nOr from their proud lap pluck them where they grew;\nNor did I wonder at the lily's white,\nNor praise the deep vermilion in the rose;\nThey were but sweet, but figures of delight,\nDrawn after you, you pattern of all those.\nYet seem'd it winter still, and, you away,\nAs with your shadow I with these did play."
                }
            ]
        }
    ]
}
```
在仪表板上，前往微调选项卡并点击“创建”按钮。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*PJySzFuaGG-VY6iMlKMj_Q.png)

在下一个屏幕上，您需要选择要用作基础模型的语言模型。如果您对各种模型版本不熟悉，这可能会有点棘手。您可能想先阅读 [这里](https://platform.openai.com/docs/guides/fine-tuning) 的文档。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*FaUMpPQAUmkqEkmMlX8WDg.png)

根据您的 JSON 文件大小，训练可能需要几分钟或几个小时才能完成。您可以在仪表板右侧监控进度。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*P6RCIgHSjaADHHMm.png)

最后一步是在 OpenAI 的 playground 页面上测试微调后的模型。

您也可以在 Amazon Bedrock 上进行微调，但这个过程要复杂得多。我不再详细说明。

正如您所见，整个传统微调过程需要对 JSON 文件和不同语言模型有一定的了解。这个过程通常需要几分钟才能完成，而 Claude 的自定义风格功能则只需 1-2 分钟。

## 最后的想法

我很快就与我所参与的社区分享了这个新功能，大家似乎都很喜欢。这个功能非常有帮助，特别是如果你一直在寻找让聊天机器人表现和写作像你一样的方法。

我能想到的唯一缺点是用户可能会滥用或过于依赖这个工具。作为一名作家，我一直鼓励人们使用 AI 工具来增强他们的工作，而不是完全取代它。依赖 AI 处理一切并不是我推荐的做法。因此，明智地使用这个功能，并知道什么时候更好地依靠自己的创造力。

Anthropic 最近在竞争中处于领先地位，在过去几周推出了一些非常酷的功能。他们增加了计算机使用、提示增强器、对 Google Docs 的支持，以及现在这个自定义样式功能。

如果你已经尝试过这个功能，请在评论中告诉我你的想法！

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*wCl18YvTCG97drvr.png)

这个故事发布在 [Generative AI](https://generativeai.pub/)。在 [LinkedIn](https://www.linkedin.com/company/generative-ai-publication) 上与我们联系，并关注 [Zeniteq](https://www.zeniteq.com/)，以获取最新的 AI 故事。

订阅我们的 [newsletter](https://www.generativeaipub.com/) 和 [YouTube](https://www.youtube.com/@generativeaipub) 频道，及时了解生成 AI 的最新新闻和更新。让我们一起塑造 AI 的未来！

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*5Knl6Z-t_wk5Cd50.png)

