---
title: "My LLM’s outputs got 1000% better with this simple trick."
meta_title: "My LLM’s outputs got 1000% better with this simple trick."
description: "The article discusses a technique for improving the output quality of open-source large language models (LLMs) by enhancing context alignment while minimizing garbled responses. Initially, the author employed a logit transformation method, which inadvertently led to nonsensical outputs. The breakthrough came from filtering out low-probability words, which resolved the garbled outputs and maintained fluency. The filtering function adjusts logits based on a threshold related to the most likely token, emphasizing the need for a flexible approach rather than fixed thresholds. The author acknowledges the limitations of this method and the challenges in standardizing the filtering process across different prompts."
date: 2024-12-28T01:51:44Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*UaZS29qc_qxURjPD"
categories: ["Natural Language Processing", "Machine Learning", "Generative AI"]
author: "Rifx.Online"
tags: ["logits", "filtering", "thresholds", "fluency", "context"]
draft: False

---





## I wish I had known this trick sooner.



When I interned at Adobe Research (Bangalore) last summer, my job was to make open\-source LLMs more aligned with the context. That means that no matter what the context provided said, the LLM needed to abide by it.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*TlgNYgNqVrW_L766nw2reA.png)

I tried a method that looked at the input token activations and used some existing patterns in them to identify tokens that are seen in the context and boost them more than the other ones. This is called a “logit transformation”. Sometimes, logit transformations can go wrong, causing low probability tokens to exceed all other tokens.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*WNmH93NC_JoOGpCAv5KDMQ.png)

In the above example, assume the context says that Olympia is the capital.

Clearly, without any transformation, the output is Seattle.

With the transformation, the output is “eek”.

Neither answer is correct.

Let’s not get into the details of the transformation right now. You can read some more details on it through this link:

But you might’ve guessed what happened:

My outputs ended up totally garbled.


> **Example output**: “The capital of Washington iseekek0q3n ee”

I was stuck for a while and didn’t know what to do.

The first thing I tried was reduce the magnitude by which tokens were boosted through the method I tried. While reducing it helped reduce how garbled the outputs were, the context alignment I was trying to achieve had reduced. It was almost like I had to balance context alignment and garbled\-ness of my outputs.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*2-OONzbwLj4mNplTaPDY5w.png)

But after what I tried next, the garbled\-ness had totally been resolved, without affecting the context alignment at all.


## The Trick

I just filtered out the words of very low probability.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*RkE2VMBfF-4VJcfrxvB8nw.png)

That turned out to completely eradicate the garbled outputs, while still allowing me to improve context alignment of the outputs.

At the end, my method improved context alignment slightly while maintaining fluency and grammatical correctness of the outputs.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ZI8MZZlRISG32D3GrDf5AQ.png)


## Filtering function

This is how the overall function looks, when you take into consideration the filtering and the logit transformation.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*V59NKlNr81TIbXt2.png)

Assume qN(x) is the logit distribution that we’re trying to modify. The modification in this case is the logarithm of qN over qM. Just consider this as some function that changes the output distribution and makes the LLM more “truthful”.

Now, the filtering aspect is taken care of by setting the logits to \-infinity if the probability values are less than a threshold. Therefore, highly unlikely tokens like “eek” right after “Washington” are removed here. Remember that when we perform a softmax to the logits to get the probability distribution, we are using an exponential function. So setting any logit to \-infinity is equivalent to setting that token’s probability to zero.

You can see how the filtering threshold is defined here.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*SRbvjeN8SgrootrI.png)

Essentially, the threshold is some fraction of the probability of the most likely next token. This could be anything depending on the number of tokens that are similarly likely to be predicted next. That’s why we can’t take a fixed threshold but instead take some fraction.

Having this specific form of the filtering function mattered a lot in practice, since neither of the following worked as well:

* A fixed number of highest probability tokens (eg, the top 10 probability tokens)
* A fixed threshold (eg, 0\.1\)


## Concluding thoughts and limitations

This is a pretty interesting application of a fairly simple technique that has some far\-reaching consequences in output quality of LLMs. In specific, when applying certain transformations, these transformations often only apply to high probability tokens, and the low probability tokens need to eliminated to begin with before transforming the distributions.

I find these decoding approaches to be exciting new approaches to change LLM behaviour, but in spite of a filtering approach like this, it’s important to realise that methods involving transformations of logits have limitations. While this filtering approach might work well overall to resolve the garbled outputs, the threshold of filtering required make the outputs more fluent might differ across prompts. This makes a standardised filter hard to develop.

Even if the filtering approach works in most cases, it would be hard to prove that it would work in ALL cases — we might need some more confidence in it if it is to be adopted in a more commercial application.

If you want to know another method that used this filtering function, you might find this blog interesting:

Follow me: [**LinkedIn**](https://www.linkedin.com/in/nikhilanand1303/) **\| [X (Twitter)](https://twitter.com/nikhilanand003) \| [Website](https://nikhilanand03.github.io/about)**


