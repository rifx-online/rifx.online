---
title: "Anthropic’s Claude AI Can Now Copy Your Writing Style"
meta_title: "Anthropic’s Claude AI Can Now Copy Your Writing Style"
description: "Anthropic has introduced a new feature in its Claude AI called Create Your Style, allowing users to customize the AIs writing style. Users can select from predefined styles or upload sample texts to train Claude to mimic their unique writing style. This feature simplifies the fine-tuning process, making it accessible even for non-technical users. GitLab has already integrated this feature, highlighting its versatility for various writing tasks. The tool aims to enhance user creativity while providing a more personalized AI interaction experience."
date: 2024-12-05T12:36:46Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Kcgez6GPjUmB5qMeMWiEjg.jpeg"
categories: ["Programming", "Natural Language Processing", "Generative AI"]
author: "Rifx.Online"
tags: ["Claude", "Customize", "Styles", "Fine-tuning", "Writing"]
draft: False

---






I’ve been working as an AI ambassador for various organizations for months, and if there’s one thing most users keep asking, it’s how to make AI chatbots write like them. Essentially, they want chatbots like ChatGPT, Claude, and Gemini to copy their writing style so they don’t have to give detailed instructions to the AI every single time.

I always tell users there are two ways they can do this:

1. **The** **Easy Way:** Create a custom chatbot by adding instructions such as responding in a specific style, tone, or length. You can even provide an example for it to mimic. This can be done using custom GPTs in ChatGPT or Gems in Gemini.
2. **The Sophisticated but More Effective Way:** Perform a process called [fine\-tuning](https://generativeai.pub/fine-tune-large-language-models-with-your-own-data-9c3798aea5bc), where a language model is trained on your sample data to more precisely replicate your writing style.

The second method is often more effective, but it’s also more complex, especially for non\-tech\-savvy users. This complexity arises from the lack of easy\-to\-use tools for fine\-tuning.

However, Anthropic is changing that with the introduction of a brand\-new Claude feature called **“Create Your Style.”**


## What is a custom style?

Custom style is a way for you to customize Claude’s responses to your unique needs and workflows.

If you’re a developer working on technical documentation, a marketer shaping brand guidelines, or part of a product team outlining detailed project requirements, Claude can seamlessly adapt to your unique writing style.

Check out the new feature in action:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*dGqyEmE-XtCAj5jHNaWT-A.gif?output=gif&n=50)

GitLab is among the first major platforms to incorporate this new feature into their workflow.


> “Claude’s ability to maintain a consistent voice while adapting to different contexts enables our team to apply it across various use cases, from writing business cases and updating user documentation to creating and translating marketing materials. The blend of pre\-built styles for quick alignment and custom styles tailored to individual preferences makes it an incredibly valuable tool.” — Taylor McCaslin, Product Lead for AI and ML Technology at GitLab


## How It Works

When you open Claude’s interface, you’ll notice a new menu labeled **“Choose Style”** beside the model selection dropdown.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*uO1Kt8xPELCnDGL_uDXqdA.png)

The writing style selection menu allows you to adjust between the following options:

* **Normal:** Default responses from Claude
* **Concise:** Shorter responses and more messages
* **Explanatory:** Educational responses for learning
* **Formal:** Clear and well\-structured responses

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*d1NcbmEmrp0uYjB8WoCDIA.png)

Here’s what makes this feature interesting: You can also create your own custom writing style by clicking the **“Create \& Edit Styles”** button.

On the right\-hand section, you can upload sample documents or a text file that reflects the writing style you want Claude to emulate. Importantly, these files are not stored in Claude’s memory or servers, ensuring your privacy.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*nxZpV458bObiidF5Fr5uNA.png)

Let’s test this feature by uploading sample Shakespearean sonnets like the following:


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

Next, click the **“Use Style”** button to start generating content with your custom writing style. In this case, the style is called *Sonnet Weaver*.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*bEjDsNfKN_mFWnSt3K6qow.png)

Now, let’s try generating a poem with this simple prompt:


> **Prompt:** write a poem

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
As you can see, Claude successfully created a poem in the style of Shakespeare without explicitly mentioning the famous author.

This feature is pretty powerful for anyone who loves to experiment with different writing styles. You can also tweak the prompt or try uploading different sample documents or text to help Claude better capture the style you’re going for.


## How Does It Compare to the Manual Fine\-Tuning?

To give you an idea of how the traditional way of fine\-tuning works, let me share with you a summary of the process. Perhaps the most popular way for developers is to use OpenAI’s [playground](https://platform.openai.com/playground/).

The first thing that you need to do is format your input data into a JSON file like this:


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
In the dashboard, head over to the fine\-tuning tab and click on the “Create” button.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*PJySzFuaGG-VY6iMlKMj_Q.png)

In the next screen, you need to choose which language model you want to use as a base model. If you are not familiar with the various model versions, this could be a little tricky. You may want to read first the documentation [here](https://platform.openai.com/docs/guides/fine-tuning).

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*FaUMpPQAUmkqEkmMlX8WDg.png)

Depending on the size of your JSON file, it may take a few minutes or several hours for the training to complete. You can monitor the progress on the right side of the dashboard.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*P6RCIgHSjaADHHMm.png)

The final step is to test the fine\-tuned model on OpenAI’s playground page.

You can also perform the fine\-tuning on Amazon Bedrock, but the process is way more complicated. I won’t give out the details here anymore.

As you see, the entire process of doing this traditional finetuning requires some familiarity with JSON files and the different language models. The process itself usually takes several minutes to complete, as opposed to 1\-2 minutes by Claude’s custom style feature.


## Final Thoughts

I was quick to share this new feature with the communities I’m part of, and everyone seems to love it. It’s incredibly helpful, especially if you’ve been looking for ways to make chatbots behave and write like you.

The only downside I can think of is the potential for users to abuse or become overly dependent on this tool. As a writer, I’ve always encouraged people to use AI tools to enhance their work, not replace it entirely. Relying on AI for everything isn’t something I’d recommend. So, use this feature wisely and know when it’s better to rely on your own creativity.

Anthropic has been ahead of the competition lately, rolling out some really cool features over the past few weeks. They’ve added things like computer use, prompt enhancers, support for Google Docs, and now this custom style feature.

If you’ve already tried out this feature, let me know what you think in the comments!

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*wCl18YvTCG97drvr.png)

This story is published on [Generative AI](https://generativeai.pub/). Connect with us on [LinkedIn](https://www.linkedin.com/company/generative-ai-publication) and follow [Zeniteq](https://www.zeniteq.com/) to stay in the loop with the latest AI stories.

Subscribe to our [newsletter](https://www.generativeaipub.com/) and [YouTube](https://www.youtube.com/@generativeaipub) channel to stay updated with the latest news and updates on generative AI. Let’s shape the future of AI together!

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*5Knl6Z-t_wk5Cd50.png)


