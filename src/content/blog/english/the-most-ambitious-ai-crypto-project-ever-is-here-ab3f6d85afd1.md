---
title: "The Most Ambitious AI Crypto Project Ever is Here"
meta_title: "The Most Ambitious AI Crypto Project Ever is Here"
description: "The article discusses an ambitious project by Near to train a decentralized open-source large language model (LLM) with 1.4 trillion parameters, significantly larger than existing models. This initiative aims to combine AI and blockchain technologies, allowing individuals to own and benefit from the AI model they help train. The project seeks to raise $160 million through crowdfunding and utilizes innovative distributed training methods to overcome challenges of synchronization and communication in a decentralized environment. The integration of blockchain is crucial for ensuring transparency and trust in the ownership and rewards associated with the model's usage. However, concerns about the feasibility of such a large-scale model and the efficiency of blockchain technology remain."
date: 2024-11-16T01:24:58Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*uiBwsWl8grXKJCJaGtH7kw.png"
categories: ["Technology", "Machine Learning", "Blockchain"]
author: "Rifx.Online"
tags: ["blockchain", "parameters", "crowdfunding", "synchronization", "transparency"]
draft: False

---





### AI \& Blockchains: A Match Made in Heaven, or a Scam?



One of the founding fathers of modern AI wants to use the blockchain to train the world's largest open\-source Large Language Model (LLM), almost four times larger than Llama 3\.1 405B, generally considered the best open LLM.

And before you dismiss this headline as scammy hype, please be aware that the person who stated this goal is none other than ***Illia Polosukhin***, one of the researchers behind the “Attention is All you Need” paper, the seminal piece that led to our current AI revolution.

So, *what is exactly what they want to do? And what’s the role of the blockchain in all this?*

Read on to learn how the worlds of AI and Crypto will irremediably merge and about the project that could finally make an AI model that is owned by the people.


> You are probably sick of AI newsletters that simply explain what happened. That’ easy and anyone can do it, which is why there are so many.


> But explaining why it matters is another story. That requires knowledge, investigation, and deep thought… all attributes of the people who engage weekly with **TheTechOasis**, the newsletter that aims to answer the most pressing questions in AI.


> 🏝️🏝️ Subscribe today below:


## Owning AI

With Trump’s win, Crypto has entered an improvised bull cycle, [taking Bitcoin eerily close to the $100k per coin mark](https://coinmarketcap.com/currencies/bitcoin/) and reaching new all\-time highs.


### The Near Project

Under Trump, blockchain companies have good reason to be optimistic about the future. One of these companies is Near, which is trying to bridge the worlds of Crypto and AI.

I won’t go into more detail about this project because I don’t want you to feel I’m sponsoring it (I do not own NEAR coins). However, they’ve recently started a great, ambitious goal I deeply align with:

Training the largest open\-source model ever, crowdfunded by individuals, and owned by them.

Specifically, **they want to train a 1\.4 trillion\-parameter model**, one that would rival the size of models like GPT\-4 and be 3\.5 times larger than the largest open\-source (or dare I say, open\-weight) LLM in the world, Meta’s Llama 3\.1 405B, which is also considered the best open model today.

To achieve this, **they expect to have to crowdfund a sizeable amount of $160 million**, funded through the acquisition of $NEAR coins, a cryptocurrency that, as of today, [has a market value of $6\.6 billion](https://coinmarketcap.com/currencies/near-protocol/).

However, the real issue isn’t size, but the fact they want to train this model in a decentralized manner through poorly\-communicated hardware. In layman’s terms, they don’t intend to train this model in a [140 MegaWatt data center with 100,000 GPUs](https://readmedium.com/putting-the-worlds-largest-ai-supercomputer-into-perspective-60afde9bc653) like the one Elon Musk owns in Memphis, Tennessee, but training it on a global scale.

For someone familiar with how these models are trained, this is as ambitious as one can be in AI today.

*But why?*


### The Importance of Time

You may have heard the crazy numbers regarding AI training and inference, but these numbers are just a fraction of what’s coming.

* [Elon Musk has 100,000 NVIDIA H100 GPUs](https://readmedium.com/putting-the-worlds-largest-ai-supercomputer-into-perspective-60afde9bc653) in one location and intends to double the compute power to 200,000 H100 equivalents in the next months.
* All Hyperscalers (Microsoft, Amazon, Meta, Google, or Oracle) are reaching or have [reached deals with nuclear power plants](https://www.technologyreview.com/2024/09/26/1104516/three-mile-island-microsoft/) or Small Modular Reactor companies to build nuclear power generation to power their data centers and avoid the excessive lead times of transmission lines and electrical transformers
* [A Hyperscaler pitched North Dakota Governor Doug Burgum about building a **5–10 GigaWatt data center**](https://thetechoasis.beehiiv.com/p/understanding-ai-s-big-picture). For reference, the latter data center would have more compute capacity than [Microsoft’s entire Azure cloud (5 GW)](https://www.datacenterdynamics.com/en/news/microsoft-to-double-new-data-center-capacity-this-year-report/), and consume enough power to provide electricity to **8\.3 million US homes at the average US household consumption value of 10,500 KWh/year**.

And the list goes on. *But why?*

**The reason is time**. To train a model, you send it data, force it to sample a prediction, and measure how good that prediction was. Based on that error signal, we then update the model's parameters so that the prediction error falls over time.

The issue with this process is two\-fold:

* The models are huge, meaning that each time we have to update parameters, we are updating potentially trillions of them.
* The data sets are also huge, meaning the amount of parameter updates is unfathomably large.

This leads to training runs that take, if executed sequentially, forever. Luckily, as most frontier AI models today are basically matrix multiplications on steroids, a very similar mathematical computation to rendering pixels on a computer screen, the original goal of GPUs, we can use this hardware to train these models.

Crucially, GPUs are meant to parallelize computation, meaning that we can parallelize the training of these models extensively ([although not fully due to Amdahl’s Law](https://thetechoasis.beehiiv.com/p/understanding-ai-s-big-picture)).

This is why models like [Llama 3\.1 405B were trained on a 24,000 GPU cluster](https://arxiv.org/pdf/2407.21783) and why models like the new Grok from xAI and [Llama 4 from Meta](https://www.tomshardware.com/tech-industry/artificial-intelligence/meta-is-using-more-than-100-000-nvidia-h100-ai-gpus-to-train-llama-4-mark-zuckerberg-says-that-llama-4-is-being-trained-on-a-cluster-bigger-than-anything-that-ive-seen) are being trained in 100,000\-plus GPU clusters.

Ok, I get these models need a lot of GPUs working simultaneously to get trained. *But how do they do it?*


### The essence of distributed training

In distributed training, instead of training one single model and updating it by sending all the data to that instance, we build replicas, identical versions of the model, each assigned to a given GPU pod (a pod is a group of tightly connected and collocated GPUs).

Then, we batch the training set, and set the batches to the different pods. Of course, that means that each replica receives different training data and, thus, learns different things.

Consequently, **every certain time the GPU pods need to synchronize**, sharing their learnings with the other pods, meaning that, after this synchronous stage, all model replicas have the exact same parameter values (as each model replica is actually updated with the average learning value, so that all model replicas learn the same after each batch training step).

While all this seems well and good, this synchronization is a big issue because these synchronous updates mean all pods are basically stalled for the duration of the synchronization, **pulling us dangerously close to making the training run too long (these trainings take literally months)**.

And to make matters worse, Near wants to do this in low\-bandwidth form, meaning that the communication channels between the GPU pods will be slow.

Thus, *how can they do this, and what role will the blockchain play?* Luckily, we kind of know the answer to both in much more detail than what you would expect.


## Toward Decentralized AI

Luckily for Near, they aren’t the only ones thinking about decentralized AI (although Near adds the blockchain; we see how they’ll do it later), as at the time of writing, **the world’s largest decentralized training run is taking place as you read this piece**.


### The Prime Framework

Prime Intellect is a company working toward the vision of training massive LLMs in a decentralized manner, aiming to train ***Intellect\-1***, a 10\-billion parameter model, in a fully decentralized way.

In other words, the training run is distributed across several GPUs, **which are owned by independent parties**, potentially separated across continents, and connected through low\-bandwidth networks.


> You can watch the progress and the different parties involved [through this app](https://app.primeintellect.ai/intelligence?utm_source=thetechoasis.beehiiv.com&utm_medium=newsletter&utm_campaign=should-ai-s-kill-openai-s-swarm-the-future-of-ai-training&_bhlid=8eadb6cf7d24b545a761f9ac3f7126a45ac2b579).

This gives us great insight into how Near will achieve its mission of training the largest open\-source AI model ever.

As you may have guessed from the previous section, the main bottleneck in AI training is the synchronous update. According to Amdahl’s Law, **parallelization can be an exercise of diminishing returns if a certain point in the training can’t be parallelized**.

Therefore, as you increase parallelization, the time\-saving improvements become incremental, as we can’t reduce the synchronization time.


> In case you’re wondering, synchronization can’t be performed asynchronously (each pod updating its parameter values independently) as model convergence becomes impossible (at least for our current knowledge).

Knowing this, Prime Intellect has put into practice several techniques that Near will surely capitalize on:

* **Synchronization every hundreds of steps**.

Instead of synchronizing the GPU pods in every parameter update, each pod carries its ‘pseudo\-gradients’ (accumulating its learnings across several local training time steps), and every 100 of these timesteps, it shares its learnings with the rest.

Simply put, as learning sharing is the main bottleneck to training performance, we minimize the number of times GPU pods communicate.

* **Quantization of communication payload**.

The number of times you communicate across pods isn’t the only thing that affects time; the amount of shared information matters, too. Thus, we quantize the learnings so that information travels in a compressed form, making it faster.

This reduces communication requirements by 400x. In standard form, synchronization takes up to 40 minutes. With this quantization, it takes less than a minute.


> **What is quantization?** In a nutshell, we take the information we want to store (or share, as in this case) and reduce the per\-parameter precision (instead of ‘1\.023293,’ that number travels as a ‘1’) of the optimizer states (the states that carry what each model replica is learning).


> **Think of this is as compressing the data into a zip file before sending it so the size of the sent packet is smaller and, thus, faster to send.**


> However, while the original numbers can be recovered (dequantization), it incurs some precision loss, which can affect performance. However, [Prime Intellect claims they did not appreciate any performance loss](https://www.primeintellect.ai/blog/intellect-1) despite the massive time savings.

* **Dynamic global groups**

One of the biggest issues of decentralized model training is unreliability; both the network and, above all, the workers (GPUs) may break and fail. Also, **you want to incentivize this dynamism**, so that people can jointly enter the training run and log off when desired.

For this, the Prime framework has **dynamic global groups** that ensure workers can on\-ramp and off\-ramp without impacting the overall training run.

Furthermore, the framework includes other techniques like asynchronous checkpointing that I won’t go into for the sake of length but that you can [read in full detail here](https://www.primeintellect.ai/blog/intellect-1).

But we still haven’t answered the key question: *Where does the blockchain fit in all this?*


## An Exciting Future Ahead

Over the next four years, you will see blockchains in everything.

Yes, the *‘{Insert something that works just fine} but now it’s decentralized’* type of slogans are coming back into our lives.

While many of these new use cases will be pointless, blockchains do have a clear raison d’être that makes them very valuable when used when necessary, not for the sake of saying you’re using a blockchain.


### It’s… a ledger

Blockchains are decentralized ledgers. They store transaction information between two peers in blocks of transactions connected sequentially (hence the name).

**This is a big deal because their decentralized nature makes this ledger almost impossible to tamper with**. True blockchains (which there aren’t that many today that meet this standard) are immutable and definite, the unequivocal source of truth that a transaction took place at some point.

Importantly, they are ‘trustless,’ meaning that cryptography, not centralized entities like banks, guarantees the untampered nature of the ledger.


> The reason why they are so hard to tamper with is, you guessed it, their decentralized nature. The global network of nodes that secure the blockchain all have an exact copy of the network, updated every time a new block is added.


> Therefore, to introduce tampered transactions, you would need to own a majority amount of these nodes, be that through investing huge amounts of compute in proof\-of\-work blockchains like Bitcoin (extremely costly), hacking a majority of the nodes (again, extremely costly) or by owning majority stakes in the blockchain’s cryptocurrency in proof\-of\-stake blockchains like Ethereum (again, extremely costly).

Long story short, the value of blockchains is to make the act of tampering them a very, very bad idea economically speaking, one that is just simply not worth it.

Hence, their value is the idea that not only they are great sources of truth, providing trust to transaction making, but they are also exempt of centralized powers that may be incentivized to tamper them.

*And how does that fit into AI?* Here’s where all comes full circle.


### Owned AI Needs the Blockchain

The idea behind training a decentralized AI model is that the people who participate in training that model (be that with compute or with money) are rewarded for it.

Thus, the goal of this 1\.4 trillion parameter model is that its inferences (the usage) will be paid back to its funders.

And here’s where the blockchain comes in, as undeniable proof that *‘Jane Doe from Nebraska’* paid $1,000 to fund this training or for *‘John Doe from Japan’* to prove they provided 100 hours of GPU compute into the training and, thus, both are rightful receptors of the benefits of that model’s inferences (every time the model runs, you get paid).

Now, you may ask: Could a centralized entity manage this?

For sure, but the whole point of blockchains is to prevent the need for that central entity to exist in the first place and ensure that no one fully controls who owns what or how much you get paid.

Now, all things considered, *is this vision actually possible today?*


### Does Feasibility Meet Vision?

It’s very easy for anyone to align with Near's vision of AI, especially considering the people behind this project.

Envisioning a future where decentralized economies rise around AI to ensure people are paid for their data, content, compute, or expertise and get unequivocally and objectively rewarded for it is a vision anyone can empathize with.

However, **a 1\.4 trillion parameter model appears simply too large based on current standards**. As mentioned, *Intellect\-1*, the largest known model being trained that way, **is 140 times smaller than what *Near* intends to build**.

The other concern is with the blockchain. For instance, one of the biggest lies regarding NFTs was that blockchains only stored that an NFT transaction took place, **but the NFT was stored ‘off\-chain.’** Sadly, the truth was that only the data that is stored in the blockchain is fully protected, so the actual piece of ‘art’ was largely unprotected and easily clonable.

However, blockchains are notoriously inefficient, meaning that the fewer data you have to store ‘on\-chain,’ the better, making them very impractical.

Thus, if neither the model, nor the data, nor the compute used to train a model will be stored in the blockchain, *what’s the point?*

Luckily, there’s a solution: zero\-knowledge proofs, which I won’t go into today for the sake of length, may appear as the key enabler to guarantee that an event, even if it isn’t stored on\-chain, really happened.

Through zk\-proofs, someone could prove that the compute they claim to have dedicated to the training actually happened or that they truly funded the training run, by storing a registry of that transaction with a zk\-proof attached that proves with a very high certainty that something that happened off\-chain actually happened.

Thus, by just storing the zk\-proof, we can guarantee that even off\-chain data can be trusted. *The issue?* Zk\-proofs aren’t ready yet due to their extensive compute requirements.

However, one point still stands: If you truly believe AI can be decentralized, you have to trust blockchains are legit.

*But how does this type of announcement make you feel? Are you excited about what the synergy between Crypto and AI has to offer?*

*Or do you still think of a ‘scam’ whenever you see a blockchain mentioned?* If that’s the case, I don’t blame you, but if you manage to abstract yourself from Crypto’s countless scams, you’ll realize this technology will play a vital role in AI.

And if Near is right, that will be sooner than expected.


> **For business inquiries on AI strategy or analysis, reach out at nacho@thewhitebox.ai**


> If you have enjoyed this article, I share similar thoughts in a more comprehensive and simplified manner for free on my [LinkedIn](https://www.linkedin.com/in/ignacio-de-gregorio-noblejas/).


