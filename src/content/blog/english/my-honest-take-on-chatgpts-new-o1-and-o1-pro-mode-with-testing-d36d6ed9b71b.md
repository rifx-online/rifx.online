---
title: "My Honest take on ChatGPT’s New o1 and o1 Pro Mode (with testing)"
meta_title: "My Honest take on ChatGPT’s New o1 and o1 Pro Mode (with testing)"
description: "OpenAI has introduced a new ChatGPT model, o1, and a premium subscription plan, ChatGPT Pro, which includes o1 Pro mode. The o1 model offers significant improvements in speed, accuracy, and problem-solving capabilities, particularly in coding, math, and image analysis. The Pro mode enhances these abilities further, making it suitable for complex tasks. The $200/month Pro plan includes unlimited use of o1, advanced voice tools, and access to o1 Pro mode. While expensive for casual users, it may be worth it for professionals who need high accuracy and efficiency. Testing shows o1 performs well in math and image analysis tasks, but users should still verify results for critical tasks."
date: 2024-12-12T01:39:31Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*Z8nyx9Rt3riXMjDA"
categories: ["Chatbots", "Programming", "Data Science"]
author: "Rifx.Online"
tags: ["o1", "ChatGPT", "Pro", "coding", "math"]
draft: False

---







> **Note: In this article I will try to cover all the points related to the event and my personal take on it.**

Few days back OpenAI started their “12 Days of OpenAI” event with exciting news: the release of a new ChatGPT model called o1 and a premium subscription plan called ChatGPT Pro that includes the powerful o1 Pro mode.

This announcement showcases major improvements in how the AI thinks, solves problems, works with images and helps with tough tasks like coding and math.

OpenAI is making tools for everyone — from casual users to researchers and engineers who need advanced help.

Let’s break down what’s new, why it’s exciting and whether the

$200/month Pro plan is worth it.


## What’s New in o1?

Earlier versions of o1 had promise but were slow and sometimes struggled with hard problems. Basically take too long time even for small queries.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*YZJ5GkbFoiYXrnRO)

But as mentioned now the updated o**1 model** fixes those issues and adds new features.

Lets see


## Key Improvements in o1


### Faster and Smarter:

O1 answers simple questions faster and works harder on tough problems.

Also, it no longer pauses awkwardly to respond to easy queries.

and when solving complex puzzles or math problems, it takes the time needed to get things right.


### More Accurate Thinking:

Also, o1 does much better in coding challenges and advanced math tasks. For example, on tricky math problems, its accuracy jumped from 50 to 78, and with o1 Pro mode, it goes into the 80s.

Here is comparison metrices of model performances of different models on AIME 2024 (Math test) and PhD level questions.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*FFWUsEs9bLSgp67zj9lpXA.png)


### Understands Text and Images:

It is also found that o1 can look at pictures and figure things out. For example, in video they have shown that it can analyze a hand\-drawn design of a data center in space and calculate cooling needs or dimensions.

This is great for engineers and designers who work with visuals.


## Now what is o1 Pro Mode?

o1 Pro mode is like a supercharged version of o1\.

It spends more time thinking to solve the hardest problems.


## Question is why we use O1 Pro Mode?

Firstly, Pro mode takes longer to respond but delivers better answers for difficult tasks like chemistry problems, tricky coding puzzles or even analyzing big sets of data.

Also, even small improvements in accuracy can make a big difference when solving complex challenges.

So, if you’re working on cutting\-edge research, testing new ideas or solving complicated problems, o1 Pro mode can help you avoid mistakes and find better solutions.


## What Does ChatGPT Pro Offer for $200/Month?

Waooo! this is too much.

OpenAI’s **ChatGPT Pro** plan costs **$200 per month** which is much higher than the $20/month Plus plan.

Here’s what you get:


### They Claim These Features of ChatGPT Pro:

* **Unlimited Use of O1:** No daily limits or message caps. Use O1 as much as you want.
* **Advanced Voice Tools:** Ideal for users who prefer speaking to typing, like consultants or managers.
* **Access to o1 Pro Mode:** Tackle the hardest problems with Pro’s extra brainpower.
* **Future Updates:** OpenAI promises more tools soon, like browsing the internet, uploading files and handling bigger projects. Maybe developers could even create apps using these features.

So in my opinion, for casual users this $200/month might feel too expensive.

But for professionals who use AI for tough tasks every day, the time saved and better results might make it worth the price. But better decide the complexity of task and its overall effect.


## My sample tests on o1 model

As, I have a 20 usd plan, so I test this with my questions.


> **Math test**

I asked one of the toughest questions from the IIT\-JEE exam (one of India’s hardest tests).

Many students agree on its difficulty, so it’s worth a try.

Here’s the question:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*OBBq0CEBZLQCZbO3)

The image may look like a picture taken (not very clear) with minimal text and no additional context such as how many options are correct.

I won’t provide the answers to the model (I will crop that part out).

Later, we’ll evaluate how well it performed.

I’m interested in seeing the thinking time, the steps taken, and most importantly, the answer.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*gRT4phqLWXVEkcDM-mllNw.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*JxVyFrdmet-YoeqG0I1xjQ.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*6gco_L4hg3NHdCstT_YTsg.png)

Waoo, its correct

I am really impressed, it solved the question in just 22 sec and with all steps and correct answer.

**Working with Image with no context**

Let’s put the model’s image handling and understanding capabilities to the test!

I randomly chose an image of a complex algorithm to see how well the model can interpret it. Here’s what I want to evaluate:

* What is this image about?
* Is it related to a specific concept or algorithm?
* Can it provide Python code to create similar graphs?

Let’s see how it performs!

I know its too much, but lets try

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*waBx4ZkCpWiKOdV5)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*FP4HcL_2ZhD-FIg-LHbhyg.png)

Here is response


```python
What is this image all about?
This image appears to be a network graph (often called a social network graph) depicting relationships between characters, likely from a fictional universe such as Game of Thrones / A Song of Ice and Fire. In such a graph:

    Nodes (circles) represent characters.
    Edges (lines) between nodes indicate some form of relationship, such as co-occurrence in scenes, alliances, or conversations between characters.
    Colors of the nodes and their groupings often represent detected communities or clusters of closely connected characters. This grouping might be based on shared storylines, familial ties, or factional alliances.

Is this related to some concept or algorithm?
Yes, the visualization and grouping of nodes into clusters is closely related to concepts in graph theory and network analysis. Some relevant concepts and algorithms include:

    Community Detection: Algorithms like Louvain, Girvan-Newman, or modularity optimization methods to detect clusters (i.e., groups of nodes that are more connected to each other than to the rest of the network).
    Force-Directed Graph Drawing: Algorithms such as Fruchterman-Reingold or ForceAtlas2 which position the nodes so that edges appear at reasonable lengths and clusters become visually distinct.
    Centrality Measures: Metrics like degree centrality, betweenness centrality, and eigenvector centrality could be used to size nodes by importance or influence.

    Optionally, python-louvain for community detection (Louvain algorithm).
```
OMG, I hadn’t noticed that this was related to Game of Thrones characters, but the model identified it in just 2 seconds!

It not only recognized the characters but also correctly identified the algorithm.

Plus, it provided the Python code for it.

Impressive!


```python
import networkx as nx
import matplotlib.pyplot as plt
from itertools import count

## Optional: community detection via Louvain algorithm (pip install python-louvain)
try:
    from community import community_louvain
    community_available = True
except ImportError:
    community_available = False

## 1. Create a sample graph
G = nx.karate_club_graph()  # Zachary's Karate Club is a classic example graph
## You could also build your own graph from data:
## G = nx.Graph()
## G.add_node("Eddard")
## G.add_node("Catelyn")
## G.add_edge("Eddard", "Catelyn")
## ... and so forth

## 2. Detect communities (if python-louvain is installed)
if community_available:
    # partition is a dict node -> community_id
    partition = community_louvain.best_partition(G)
else:
    # Without Louvain, we can do a trivial community assignment 
    # or use a built-in algorithm like greedy_modularity_communities:
    from networkx.algorithms import community
    communities = community.greedy_modularity_communities(G)
    # communities is a list of sets of nodes; map them to an integer label
    partition = {}
    for i, comm in enumerate(communities):
        for node in comm:
            partition[node] = i

## 3. Assign colors to each community
## Get unique community ids
community_ids = set(partition.values())
## Create a color map from the community IDs
color_map = {}
palette = plt.cm.get_cmap('viridis', len(community_ids))
for cid, c_color in zip(community_ids, palette.colors):
    color_map[cid] = c_color

## 4. Extract node colors based on communities
node_colors = [color_map[partition[node]] for node in G.nodes()]

## 5. Draw the graph with a force-directed layout
pos = nx.spring_layout(G, seed=42)  # seed for reproducibility

plt.figure(figsize=(10, 8))
nx.draw_networkx_nodes(G, pos, node_color=node_colors, node_size=300, alpha=0.9)
nx.draw_networkx_edges(G, pos, alpha=0.5)
nx.draw_networkx_labels(G, pos, font_size=8)

plt.title("Network Graph with Community Detection")
plt.axis('off')
plt.tight_layout()
plt.show()
```
So, overall from my experience of testing with random stuff, I think this model is obviously a better one.

But I am not sure will that beat Claude 3\.5 as I have not tried these questions on claude.

But yes this is something to watch.

But the big question: **Is ChatGPT Pro worth $200/month?**

I think for user with less complex task should stick with the free or Plus plan. The o1 improvements are already included in these tiers, so you get faster and smarter AI without paying extra.

**But for professionals like** If you’re an analyst, researcher, coder, or engineer who uses AI daily, the Pro plan could be worth it.

Saving hours of work and getting better results might easily cover the cost.

Even though AI is improving, it’s still important to double\-check its answers. Pro mode requires some skill to use effectively and you should always verify results for important tasks.


## What’s Next?

This is just the start of OpenAI’s “12 Days of OpenAI” event.

New updates like file uploads, browsing and other tools might make the Pro plan even more appealing in the future.

Looking forward to the next day.

See you.


