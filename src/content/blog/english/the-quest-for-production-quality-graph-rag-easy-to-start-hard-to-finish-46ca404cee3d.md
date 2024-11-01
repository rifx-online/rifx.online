---
title: "The Quest for Production-Quality Graph RAG: Easy to Start, Hard to Finish"
meta_title: "The Quest for Production-Quality Graph RAG: Easy to Start, Hard to Finish"
description: "Overcoming the challenges of productionizing graph RAG"
date: 2024-11-01T03:56:04Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*RMudHNmBOgXM1Mubj1UTkw.jpeg"
categories: ["Programming", "Data Science", "Generative AI"]
author: "Rifx.Online"
tags: ["graph", "RAG", "production", "uncertainty", "optimization"]
draft: False

---





### Overcoming the challenges of productionizing graph RAG



When I read the recent article in VentureBeat about how Glean [just secured over $260 million in its latest funding round](https://venturebeat.com/data-infrastructure/how-to-take-advantage-of-a-generative-tool-fueling-gleans-260m-raise-graph-rag/), I had two immediate gut feelings. First, it was satisfying to see this very public example of graph RAG living up to its potential as a powerful, valuable technology that connects people with knowledge more efficiently than ever. Second, it felt surprising but validating to read:


> One of the world’s largest ride\-sharing companies experienced its benefits firsthand. After dedicating an entire team of engineers to develop a similar in\-house solution, they ultimately decided to transition to Glean’s platform.


> “Within a month, they were seeing twice the usage on the Glean platform because the results were there,” says Matt Kixmoeller, CMO at Glean.

Although I was surprised to read about the failure in a news article, struggling to bring graph RAG into production is what I would expect, based on my experience as well as the experiences of coworkers and customers. I’m not saying that I expect large tech companies to fail at building their own graph RAG system. **I merely expect that most folks will struggle to build out and productionize graph RAG — even if they already have a very successful proof\-of\-concept.**

I wrote a [high\-level reaction to the VentureBeat article in The New Stack](https://bit.ly/4fjIlgJ), and in this article, I’d like to dive deeper into why graph RAG can be so hard to get right. First, I’ll note how easy it has become, using the latest tools, to get started with graph RAG. Then, I’ll dig into some of the specific challenges of graph RAG that can make it so difficult to bring from R\&D into production. Finally, I’ll share some tips on how to maximize your chances of success with graph RAG.


## Getting started with graph RAG is easy

So if a big ride\-sharing company couldn’t build their own platform effectively, then why would I say that it’s easy to implement graph RAG yourself?

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*l6EiwfjeUGLjVlYeiY1lqA.jpeg)

Well, first of all, technologies supporting RAG and graph RAG have come a long way in the past year. Twelve months ago, most enterprises hadn’t even heard of retrieval\-augmented generation. Now, not only is RAG support [a key feature of the best AI\-building tools like LangChain](https://python.langchain.com/docs/tutorials/rag/), but just about every major player in the AI space has a RAG tutorial, and [there is even a Coursera course](https://www.coursera.org/projects/introduction-to-rag). There is no shortage of quick entry points for trying RAG.

Microsoft may not have been the first to do graph RAG, but they gave the concept a big push with a [research blog post earlier this year](https://www.microsoft.com/en-us/research/blog/graphrag-unlocking-llm-discovery-on-narrative-private-data/), and they continue to work on related tech.

Here on Medium, there is also a nice conceptual introduction, with some technical details, [from a gen AI engineer at Google](https://towardsdatascience.com/graph-rag-a-conceptual-introduction-41cd0d431375). And, in Towards Data Science, there is a recent and very thorough [how\-to article on building a graph RAG system](https://towardsdatascience.com/how-to-implement-graph-rag-using-knowledge-graphs-and-vector-databases-60bb69a22759) and testing on a dataset of scientific publications.

An established name in traditional graph databases and analytics, Neo4j, added vector capabilities to their flagship graph DB product in response to the recent gen AI revolution, and they have an excellent platform of tools for projects that require sophisticated graph analytics and deep graph algorithms in addition to standard graph RAG capabilities. They also have a [Getting Started With Graph RAG](https://neo4j.com/developer-blog/graphrag-ecosystem-tools/) guide.

On the other hand, [you don’t even need a graph DB to do graph RAG](https://bit.ly/3YD5NAd). Many folks who are new to graph RAG believe that they need to deploy a specialized graph DB, but this is not necessary, and in fact may simply complicate your tech stack.

My employer, DataStax, also has a [Guide to Graph RAG](https://bit.ly/4862Lrl).

And, of course, the two most popular gen AI application composition frameworks, [LangChain](https://blog.langchain.dev/enhancing-rag-based-applications-accuracy-by-constructing-and-leveraging-knowledge-graphs/) and [LlamaIndex](https://docs.llamaindex.ai/en/stable/examples/cookbooks/GraphRAG_v1/), each have their own graph RAG introductions. And there’s [a DataCamp article](https://www.datacamp.com/tutorial/knowledge-graph-rag) that uses both.

With all of the tools and tutorials available, getting started with graph RAG is the easy part…


## …but bringing graph RAG into production is hard

This is a very old story in data science: a new software methodology, technology, or tool solves some imposing problem in a research context, but industry struggles to build it into products that deliver value on a daily basis. It’s not just an issue of effort and proficiency in software development — even the biggest, best, and brightest teams might not be able to overcome the uncertainty, unpredictability, and uncontrollability of real\-world data involved in solving real\-world problems.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*OklHNrhsNHZF6qzeRUSd_w.jpeg)

Uncertainty is an inherent part of building and using data\-centric systems, which almost always have some elements of stochasticity, probability, or unbounded inputs. And, uncertainty can be even greater when inputs and outputs are unstructured, which is the case with natural language inputs and outputs of LLMs and other GenAI applications.

Folks who want to try graph RAG typically already have an existing RAG application that performs well for simple use cases, but fails on some of the more complex use cases and prompts requiring multiple pieces of information across a knowledge base, potentially in different documents, contexts, formats, or even data stores. When all of the information needed to answer a question is in the knowledge base, but the RAG system isn’t finding it, it seems like a failure. And from a user experience (UX) perspective, it is — the correct answer wasn’t given.

But that doesn’t necessarily mean there is a “problem” with the RAG system, which might be performing exactly as it was designed. If there isn’t a problem or a bug, but we still aren’t getting the responses we want, that must mean that we are expecting the RAG system to have a capability it simply doesn’t have.

Before we look at why specifically graph RAG is hard to bring into production, let’s take a look at the problem we’re trying to solve.


## The main challenge that graph RAG addresses

Because plain RAG systems (without knowledge graphs) retrieve documents based solely on vector search, only documents that are most semantically similar to the query can be retrieved. Documents that are not semantically similar at all — or not quite similar enough — are left out and are not generally made available to the LLM generating a response to the prompt at query time.

When the documents we need to answer a question in a prompt are not all semantically similar to the prompt, one or more of them is often missed by a RAG system. This can happen when answering the question requires a mix of generalized and specialized documents or terms, and when documents are detail\-dense in the sense that some very important details for this specific prompt are buried in the middle of related details that aren’t as relevant to this prompt. See [this article for an example of RAG missing documents](https://bit.ly/3BKZAJv) because two related concepts (“Space Needle” and “Lower Queen Anne neighborhood” in this case) are not semantically similar, and [see this article for an example of important details getting buried](https://bit.ly/4ffhrqi) in detail\-dense documents because vector embeddings are “lossy”.

When we see retrieval “failing” to find the right documents, it can be tempting to try to make vector search better or more tailored to our use case. But this would require fiddling with embeddings, and embeddings are complicated, messy, expensive to calculate, and even more expensive to fine\-tune. Besides, that wouldn’t even be the best way to solve the problem.

For example, looking at the example linked above, would we really want to use an embedding algorithm that puts the text “Space Needle” and “Lower Queen Anne neighborhood” close together in semantic vector space? No, fine\-tuning or finding an embedding algorithm that puts those two terms very close together in semantic space would likely have some unexpected and undesired side effects.

It is better not to try to force a semantic model to do a job that geographical or tourism information would be much better suited for. If I were a travel or tourism company who relied on knowing which neighborhood such landmarks are in, I would rather build a database that knows these things with certainty — a task that is much easier than making semantic vector search do the same task… without complete certainty.

So, the main issue here is that we have concepts and information that we know are related in some way, but not in semantic vector space. Some other (non\-vector) source of information is telling us that there are connections among the wide variety of concepts we are working with. The task of building a graph RAG application is to effectively capture these connections between concepts into a knowledge graph, and to use the graph connections to retrieve more relevant documents for responding to a prompt.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*flPVNMUm83oc7H9Lt7U5AA.jpeg)

To summarize the issue that we’re trying to tackle with graph RAG: there exists semi\-structured, non\-semantic information connecting many of the concepts that appear in my unstructured documents — and I would like to use this connection information to complement semantic vector search in order to retrieve documents that are best suited to answer prompts and questions within my use cases. We simply want to make retrieval better, and we want to use some external information or external logic to accomplish that, instead of relying solely on semantic vector search to connect prompts with documents,


## Guiding principles for integrating graph with RAG

Considering the above motivation — to use “external” information to make document connections that semantic search misses — there are some guiding principles that we can keep in mind while building and testing a graph RAG application:

1. The graph should contain high\-quality, meaningful concepts and connections
2. Concepts and connections should be relevant to prompts within the set of use cases
3. Graph connections should complement, not replace, vector search
4. The usefulness of one\- and two\-step graph connections should be prioritized; relying on more than three steps to make connections should be reserved only for specialized use cases.

Perhaps in a future article, we will dig into the nuances and potential impacts of following these principles, but for now, I’ll just note that this list is intended to jointly increase explainability, prevent over\-complexity, and maximize efficiency of both building and using a graph RAG system.

Following these principles along with other core principles from software engineering and data science can increase your chances of successfully building a useful and powerful graph RAG app, but there are certainly pitfalls along the way, which we outline in the next section.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*twgres708JPQHa1uZrkwDA.jpeg)

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*5U0k4GoHTFiQhKM2a6xdMA.jpeg)


## Reasons that your graph RAG app might not make it into production

Anyone who has spent a lot of time building software around data, complex algorithms, statistics, and human users probably understands that there is a lot of uncertainty in building a system like graph RAG. Unexpected things can happen during data prep and loading, while building a knowledge graph, while querying and traversing the graph, during results compilation and prompt construction, and at virtually any other point in the workflow.

Above, we discussed how it’s easy to implement graph RAG to get preliminary results, but it can be hard to get good results, much less production\-quality results. Next, we look at a few potential issues that you might encounter when building and testing a graph RAG application.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*1J9hwwZDuYZ3WNrxCl_cOA.jpeg)


### Graph RAG isn’t doing much better than plain RAG

If the performance of your graph RAG system is about the same as with plain RAG, there can be any number of causes. Generally speaking, this seems to imply that the graph is not adding value to the system, but this could be caused by a low\-quality knowledge graph, under\-utilization of the graph, sub\-optimal parameter settings, or many others. Or, there may not be a problem at all; vector search may be doing an excellent job of finding the right documents, and a graph simply isn’t needed.

What to look at:

* Do you have example prompts that plain RAG doesn’t handle well, but you would expect graph RAG to succeed? Can you “debug” on these prompts and see what is happening under the hood?
* Does the knowledge graph contain meaningful connections that semantic search may not make? Can you find examples of concept pairs connected in the graph whose associated documents are far apart in vector space? The KG should be making meaningful connections between “far away” docs.


### You (still) see hallucinations

If you’re seeing hallucinations with graph RAG that you didn’t see with plain RAG, I would suspect a bug or a bad parameter setting somewhere. If you are seeing a similar level of hallucinations, this sounds like a general problem beyond the graph aspects.

What to look at:

* Does your document set contain the correct responses to the prompts that elicited hallucinations? Is vector search finding these documents?
* Are the correct responses from the retrieved documents properly inserted into the context of the prompt that is passed to the LLM?


### The graph is “too big”

When your knowledge graph is “too big” or too dense, two main types of problems can occur. First, there could be issues with scaling, which I discuss below. Second, graph traversal could result in “too many” documents, which must then be re\-ranked and filtered. If the re\-ranking and filtering strategy doesn’t play well with the retrieval and graph traversal elements, you could end up filtering out important documents immediately after your graph just discovered them.

What to look at:

* How many documents are returned after graph traversal, and how many are re\-ranked or filtered out? Does it look like documents found via strong graph connections are surviving filtering?
* Did you build a knowledge graph filled with meaningful connections that suit your use cases? In the graph, can you find many concepts or connections that are too generic or irrelevant for your use cases? How much of your knowledge graph is made up of low\-quality information?


### The graph is “too small”

Per above, if the graph is “too big”, it might be filled with low\-quality connections. And if the graph is “too small”, I would hope that the connections there are meaningful, which is good, but missing connections come in two main types. The first is caused by a bug in the graph construction process. The second is caused by graph construction that was not designed for it. Data in a different contexts or different formats may be processed differently by different graph\-construction methods.

What to look at:

* Did you build your knowledge graph using an LLM with entity/keyword extraction? Are you capturing all of the meaningful entities from every document, or is the LLM limiting its output?
* In your documents, what are some concepts and connections that you would expect to be in the knowledge graph, but seem to be missing? When and how do you expect them to be added to the graph? Why aren’t they actually being added to the graph?


### You can’t find the “happy medium” graph

Do you feel like you can build a graph that is “too big” or one that is “too small”, but you can’t build something in the middle?

What to look at:

* What parameters or methods are you changing to go from small to big or back again? Should these be affecting graph quality this much? Can you study some graph elements that appear or disappear unexpectedly, depending on which graph construction settings you’re using?
* Also see relevant tips in “big” and “small” sections above.


### Your implementation requires new software or increased deployment complexity

This is a classic Data Science problem: build really cool and cutting\-edge methods, only to see development teams refuse or struggle to bring the code from your notebooks into the production stack. Sticking to the most popular, best supported, and largely open\-source tools can make it easier to get to production, especially if your organization is already using those tools elsewhere.

What to look at:

* Does your implementation require creating a new data store for graphs? You [probably don’t need a graph DB](https://www.datastax.com/blog/knowledge-graphs-for-rag-without-a-graphdb), and might be able to use your production vector store for graphs as well.
* Are you using some of the most popular open\-source tools for building AI applications, like LangChain? These can reduce code complexity, make the app more portable, and expand potential integrations and further development.


### Your implementation doesn’t scale

The article [Scaling Knowledge Graphs by Eliminating Edges](https://thenewstack.io/scaling-knowledge-graphs-by-eliminating-edges/) in *The New Stack* shows one way to make graph RAG very scalable. Like above, the most popular, best supported, and largely open\-source tools are usually the best path to painless scaling, but it’s not always easy.

What to look at:

* Which part isn’t scaling? Graph traversal, re\-ranking, results compilation, or something else? See “The graph is too big” above for more tips.
* Do you have a particular component that isn’t scaling well? Sometimes using an in\-memory graph library like ‘networkx’ — \-or even a graph DB — to do complex graph operations can cause a resource bottleneck. You may want to [switch to a more scalable option for graph operations](https://bit.ly/3YD5NAd).
* Are you using parallel API calls to handle most of the heavy lifting, or are you trying to do complex or costly computations inside the main app logic?


## Finding success with graph RAG in production

The key to creating a successful graph RAG system lies in constructing a knowledge graph and traversal logic that complement semantic vector retrieval, not replacing or competing with it. The graph design should aim to connect the right nodes, knowledge, entities, and documents at the right time, enabling the assembly of the appropriate documents to produce the most helpful and actionable query response.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*orXW5uw-geBo-WVtZUxWXQ.jpeg)

With respect to Glean, it should be noted that an internal document dataset is a perfect use case for graph RAG. A knowledge graph can connect people, projects, products, customers, meetings, locations, etc — and all of these are somewhat limited in number by the size of the organization and the work it does. Building and managing a graph of thousands of employees is much more tractable than, for example, trying to do the same with all of the people mentioned on Wikipedia or in a large database of financial or legal documents. So, possibly the first great decision that Glean made was to find a great use case for graph RAG to tackle.

One often understated aspect of graph RAG systems is the quality and reliability of the input data and the pipelines that get it there. This has more to do with data engineering and traditional software development than AI. In previous tech paradigms, connecting different data systems was challenging due to incompatible data types and access methods. Now, AI and LLMs enable the integration of disparate sources of unstructured data, allowing for the consolidation of data from various origins into a single RAG system. This integration capability enables LLMs to process and make sense of unstructured data from various sources, such as internal web pages, wikis, code repositories, databases, Google Docs, and chat logs. Simply connecting all of this information together and making it accessible from a single interface can be a big win.


## The way forward

Construction of graph RAG systems for any use case involves leveraging foundational components such as data stores for vectors and graphs, embeddings, and LLMs, enhanced by open\-source orchestration tools like LangChain and LlamaIndex. These tools facilitate the development of robust, scalable, and efficient systems, promising a future where companies achieve substantial success by optimizing knowledge work through automation and streamlining.

The public success of knowledge graphs and graph RAG systems, particularly by companies like Glean, showcases how effective these technologies are for internal use cases, creating value by making the organization more efficient. However, the broader application potential for external, enterprise and consumer\-facing products remains largely untapped, presenting many opportunities for other companies to explore.

It is perhaps notable that we have been in what is called the “Information Age” for at least 30 years, and it is only in the past year or two that we have really started to put together the building blocks for connecting all of this information across sources, across ideas, across documents, and across concepts, so that our software systems can make the same types of reasoning, logic, and judgment that we as humans use as a daily part of our knowledge work. Some people are calling this the “Intelligence Age”.

While initially focusing on simple, straightforward decisions, AI’s trajectory is set towards managing more complex scenarios, dramatically improving efficiency in both time and cost. This exciting evolution positions many AI applications — including graph RAG — as pivotal in transforming how knowledge is interconnected and utilized in a wide variety of contexts.

To get started with graph RAG now, or to learn more, take a look at the [DataStax guide to graph RAG](https://bit.ly/4862Lrl).

*by Brian Godsey, Ph.D. ([LinkedIn](https://bit.ly/4enqFRa)) — mathematician, data scientist and engineer // AI and ML products at [DataStax](https://bit.ly/3NpPujA) // Wrote the book [Think Like a Data Scientist](https://bit.ly/4f5uVES)*

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Il1GrFN6fYN7e_ovExRGPw.jpeg)

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*wQvZDIlkOvrYZnbwl0bEPQ.jpeg)


