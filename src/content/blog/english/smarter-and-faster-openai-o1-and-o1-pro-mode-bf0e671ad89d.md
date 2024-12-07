---
title: "Smarter and Faster: OpenAI o1 and o1 pro mode"
meta_title: "Smarter and Faster: OpenAI o1 and o1 pro mode"
description: "OpenAI has launched the new o1 model and o1-Pro mode, which significantly enhance problem-solving capabilities and speed. The o1 model outperforms its predecessor, achieving 1.4 to 1.5 times better accuracy in math and coding competitions. It also features improved reasoning speed, being 50% faster than the previous version. Notably, the o1 model is multimodal, capable of processing both text and images. The subscription-based o1-Pro offers even greater performance, demonstrating superior problem-solving in complex tasks such as chemistry."
date: 2024-12-07T12:37:07Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*QH51yWrZSTPzCtusAvb7EQ.png"
categories: ["Programming", "Machine Learning", "Natural Language Processing"]
author: "Rifx.Online"
tags: ["o1", "o1-Pro", "multimodal", "reasoning", "performance"]
draft: False

---




Just 12 hours ago, OpenAI rolled out the new o1 model and o1 with pro mode. As you may already know, o1 models are the first series of models designed to think before answering, providing more detailed and accurate responses, especially in math, coding, and research.

People care about two things: **multimodality** and **solving hard problems**, and these new models excel in both areas.


> [Non\-member link.](https://readmedium.com/smarter-and-faster-openai-o1-and-o1-pro-mode-bf0e671ad89d?sk=362863e4af96d1371ba29a3d92bc15af)


## Outperforming in Solving Hard Problems

Let’s take a look at how they perform on challenging problems.



We can see that o1 is a major improvement over the o1\-preview model, let alone the gpt4o model. Specifically, the new o1 model is about **1\.4 to 1\.5 times better** than the o1\-preview model on AIME math competitions and CodeForce coding competition problems.

The GPQA Diamond Questions include about 200 multiple\-choice problems, each with four answer options. About a year ago, **the GPT\-4 model achieved only 36%** accuracy, barely above what you’d get by guessing at random. Now, **the o1 model scores 78%**, comparable to human experts.

Furthermore, OpenAI has introduced a more advanced model called **o1\-Pro**. Users can access o1\-Pro only with a subscription to the Pro plan, which currently costs **$200 per month**. **The o1\-Pro model performs slightly better than the o1 model** on these challenging tasks.


> Notice that **OpenAI has made the o1 model here weaker compared to the “o1” model shown in the previous figure**, so the Pro\-mode o1 model appear more competent. For instance, in the previous figure, the o1 model achieved an accuracy of 83\.3, but here it only scores 78\.3 in Competition Math.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*3oG796wKEybJHpUQFq6eNw.png)

This may seem minor, but consider **the worst\-case scenario**: OpenAI test the models by **asking the same question four times** and count it as correct only if the model answers correctly on all four attempts. Compared to the previous figures, **the performance drop for o1\-Pro is minimal**.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*T425KvopcAIKrjdvtswoUg.png)


## Thinking Faster and Smarter

The new o1 model is also more intelligent.

If you ask a simple question, it won’t take long to think, but if you ask a harder problem, it can still spend time reasoning. According to OpenAI, its overall thinking speed is about **50% faster than the o1\-preview model**, which you’ll see in the next example.

The OpenAI team asked both the o1 and the o1\-preview model the same question: “List the Roman Emperors of the second century, including their dates and accomplishments.” Since there are a lot of Roman emperors, it takes time for the models to reason through the information. **The o1 model took 14 seconds, while the o1\-preview model took 33 seconds**.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*dl0xh990DGHh4NQfoOC5sg.png)


## Multimodality \+ o1 Model

Now let’s talk about multimodality.

Previously, the o1\-preview model wasn’t multimodal, but **the new o1 model can now reason through both text and images**. To demonstrate this, OpenAI showed the model a hand\-drawn image of a 1GW data center blueprint set in space. It specifically included a radiator cooling system, since there’s no air or water to cool the GPUs.


> Note: o1 still doesn’t support documents for multimodality currently.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*sK-QVSjDsilaqTQM2CRurw.png)

Next, the OpenAI team asked the o1 model to find out the lower bound for the radiator’s area — just like a problem you might encounter in a general physics textbook.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*66wcUdNmcuIwA7yYAPhCkg.png)

From the output, we see the model accurately recognized the handwritten “1GW” parameter. And since the cooling panel’s temperature wasn’t specified in the text or image, the model assumed a temperature of around 300 K, and under that assumption. This means the model can handle ambiguity to reason and perform the calculation quite well.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*i4aizQt31kbDeRgKB_dNeA.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*83rITDh5P8wlDmT2Ti-IuA.png)


## The o1\-pro Model

For o1\-Pro, OpenAI demonstrated the model’s capabilities by asking it a challenging chemistry problem.

Which protein strictly following the criteria?

1\. The precursor polypeptide has a length of 210 to 230 amino acid residues.

2\. The gene encoding this protein spans 32 kilobases.

3\. The gene is located on the X chromosome, specifically at band Xp22\.

4\. The signal peptide comprises 23 amino acid residues.

5\. The protein facilitates cell\-cell adhesion.

6\. The protein plays a critical role in maintaining the health of a specific part of the nervous system.

For anyone who is not familiar with this topic, let me explain.

The initial form of the protein is simply a chain of 210 to 230 amino acids. To function properly, this chain must fold into the correct 3D structure.The instructions for folding this protein are encoded by a gene that spans about 32 kilobases (32,000 base pairs) of DNA, and this gene is located at the Xp22 region on the X chromosome.

Once properly folded, the protein can help cells stick to each other and play a crucial role in maintaining the health of the nervous system.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*wPDO2kQJ7i3C-dXuJ6F2wg.png)

This is a challenging problem because each criterion includes thousands of candidates. As a result, the model enters a “mull\-over” state, taking minutes to determine the answer.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*2E5UaasvZIq4ZNwqq8kvjA.png)

Once it’s done, you can click and see the reasoning steps the model went through to get the answer. The model’s answer is “RS1,” which is quite accurate. You can verify this gene information on the following websites:

[*Retinoschisin 1 GeneCards*](https://www.genecards.org/cgi-bin/carddisp.pl?gene=RS1&utm_source=chatgpt.com)

[*RS1, a Discoidin Domain\-containing Retinal Cell Adhesion Protein Associated with X\-linked Retinoschisis, Exists as a Novel Disulfide\-linked Octamer*](https://www.jbc.org/article/S0021-9258%2819%2930478-8/fulltext?utm_source=chatgpt.com)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*tfrGE55ngwB0Ioxazrfg6Q.png)


