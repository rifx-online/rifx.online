---
title: "Conversational BI: Text2SQL Challenges & Solutions"
meta_title: "Conversational BI: Text2SQL Challenges & Solutions"
description: "Conversational Business Intelligence (BI) is emerging as a significant advancement, allowing users to query databases in natural language through Text2SQL systems. Challenges in translating natural language queries to SQL include understanding database schemas and mapping user intent to SQL components. Snowflakes Cortex Analyst addresses these challenges with features like user intent validation, a lightweight semantic model, and flexibility in LLM selection. This enables accurate and reliable query responses, enhancing self-service analytics capabilities for business users."
date: 2024-12-26T01:20:35Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*kpV1Y-JzwIz7GQ5s.png"
categories: ["Natural Language Processing", "Programming/Scripting", "Data Science"]
author: "Rifx.Online"
tags: ["Conversational", "Text2SQL", "Snowflake", "Cortex", "Analyst"]
draft: False

---





### The art of querying SQL Databases / Warehouses in Natural Language


## Introduction

the future of BI is Conversational

— this is what Gartner and other analysts have been telling us for the last few years. Conversational BI holds immense potential in empowering business users to query data repositories themselves (in natural language), without any dependency on data engineering teams. With large language models (LLMs), we seem to have reached a tipping point. Let us first understand the challenges in realizing Text2SQL.


### Text2SQL Challenges

Let’s focus on structured data, relational data to be precise. This forms the underlying storage format for most of the business intelligence (BI) world, irrespective of whether you are querying the database or data warehouse interactively or building a dashboard / report — the predominant language to interact with such storage platforms is SQL.


> We are talking about translating a natural language query (NLQ) to structured query language (SQL) in this article, also known as a natural language interface to databases (NLIDB), or Text2SQL.

For example, let us consider a *Country* table with Language and Population details — illustrative schema below:

**Country table**: Country ID \| Name \| Language \| Population CountNLQ1: *Which country has the maximum population count?*SQL1: *Select Name, max(\[Population Count]) from Country;*

At the core of most Natural Language Q\&A systems \[1], is a Natural Language Understanding Unit (NLU) module that is trying to understand the NLQ’s intent by extracting and classifying the ‘utterances’. In simple words, one can think of utterances as the key phrases in the sentence, e.g., *country, maximum, population, count*.



The next step is to generate the corresponding SQL query based on this information. So we need a transformation / mapping logic to map *‘country’ to the ‘Country’ table (the table to be queried), ‘maximum’ to the MAX SQL function, ‘population count’ to the column ‘Population Count’.* And, this is where things start to get challenging.


> Mapping NLQ utterances to the right SQL operators, esp., in determining if an utterance corresponds to a Table, Column, Primary / Foreign Key, SQL operator, in the first place — is non\-trivial.

For example, without any inherent knowledge of the database schema, it is very difficult for the mapping logic to determine that the ‘count’ in this case refers to the column ‘population count’ , and not the SQL function COUNT. The problem gets amplified for complex queries, e.g.,

NLQ2: *Which language is spoken by maximum number of countries?*

whose SQL translation would involve both the SQL functions: MAX \& COUNT. Other examples of complex queries include scenarios where we need to JOIN multiple tables.


## NLQ — SQL translation Deep Dive

In this section, we do do a deep dive into the problem domain, reflecting on existing literature / approaches — to understand the technical challenges involved.

There are two benchmark datasets that are primarily referenced in this field:

* [WikiSQL](https://github.com/salesforce/WikiSQL): is a large annotated corpus for developing natural language interfaces, which was introduced along with the paper \[2].
* [Spider](https://yale-lily.github.io/spider) is a large\-scale annotated semantic parsing and text\-to\-SQL dataset. [SParC](https://yale-lily.github.io/sparc) is the context\-dependent / multi\-turn version of Spider, and [CoSQL](https://yale-lily.github.io/cosql) is the dialogue version of Spider and SParC datasets. For a detailed discussion, refer to the accompanying paper \[3].

As Spider highlights in its introductory text, any NLIDB solution needs to not only understand the underlying database schema, but it *should generalize to new schemas as well*. The generalization challenge lies in (a) encoding the database schema for the semantic parser, and (b) modeling alignment between database columns, keys, and their mentions in a given NLQ \[4].

With this context, let us take a look at some works that have tried to encode (the missing) database schema knowledge into neural networks. *Directed graphs are a popular formalism to encode database schema relationships.*\[4] presents a unified framework to address schema encoding, linking, and feature representation within a text\-to\-SQL encoder. \[5] encodes the database schema with a graph neural network, and this representation is used at both encoding and decoding time in an encoder\-decoder semantic parser. \[6] presents a database schema interaction graph encoder to utilize historical information of database schema items. In the decoding phase, a gate mechanism is used to to weigh the importance of different vocabularies and then make a prediction of SQL tokens.

Pre\-trained large language models \[7] as text\-to\-SQL generators help to a certain extent, esp., with respect to encoding table and column names by taking advantage of the attention mechanism \[8]. However, they still struggle with schema relationships for complex SQL operation. Refer to \[9] for a good summary of the challenges involved in Text2SQL and how the research community is trying to address them.

CHASE\-SQL \[10] with Gemini currently holds the current \#1 position (at the time of writing this article) on the notable BIRD (BIg Bench for LaRge\-scale Database Grounded Text\-to\-SQL Evaluation) [leaderboard](https://bird-bench.github.io/) with a test execution accuracy of 73%. It leverages the intrinsic knowledge of LLMs to generate diverse and candidates through: (1\) a divide\-and\-conquer method that decomposes complex queries into manageable sub\-queries in a single LLM call, (2\) chain\-of\-thought (CoT) reasoning based on query execution planning, and (3\) a unique instance\-aware synthetic example generation technique.


> The papers show significant progress in embedding database schemas, however, they are still specific to the datasets under consideration; and do not generalize well to new domains / schemas.


## Snowflake’s Cortex Analyst

Snowflake has taken a very **user\-centric view** of enabling BI conversations seamlessly with at the following three differentiating features:

* User intent validation and query explanation
* Lightweight semantic model
* Flexibility with respect to the underlying LLM

Cortex Analyst, together with Cortex Copilot, are Snowflake’s latest additions to their Cortex Generative AI platform — to provide the conversational BI capability. While Cortex Copilot is targeted more towards developers, Cortex Analyst is the one we will be talking about in this article focusing on business users.

To elaborate, Cortex Analyst is actually an end\-to\-end text\-to\-answer solution as it returns the generated SQL as well, providing the final query response. It is very easy to deploy — available as an API, and Snowflake also provides a simple Streamlit application that can be deployed with a few lines of code. As such, it is very use to deploy and pilot / use.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*Ne-y66hviwm73wx2)

We all know that LLMs hallucinate, so the first (and best) thing to do is to validate the **system’s understanding** of a given query with the user — before responding with the final answer. Cortex Analyst enables this by:

* having a dialogue with the user, where for any given query, it first presents its understanding of the query to the user with an explanation of how it generated the SQL query.
* In addition, it also provides suggestions to make the query more concrete in case of ambiguities — illustrated in the below figure.


> This user validation helps in significantly improving the correctness and accuracy of the final answer.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*hkWtfazrF1LE3HYt)

Secondly, Cortex Analyst addresses the data repository metadata mapping problem highlighted earlier with the help of a **semantic model**.


> The semantic model is the bridge mapping the domain or business specific terms used by users to the database schemas.

These additional semantic details, like more descriptive names or synonyms, enable Cortex Analyst to answer natural language queries more reliably.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*hwL-ddQ5vCjE-uXa)

Overall, the semantic model can be considered as a logical layer providing a simplified view of a physical database table or view. Snowflake makes it very easy to create the semantic model with the help of a generator [tool](https://github.com/Snowflake-Labs/semantic-model-generator) and is stored in an easily accessible YAML file.


> In addition, the semantic model also allows the provision of storing queries.

This acts as a verified query repository (**VQR**), capturing user queries that have worked correctly in the past — providing a query cache that helps in further improving accuracy and trustworthiness of the results.

Given the complexity of enterprise databases, and the subsequent difficulty in encoding them, we can also think of the model generator tool as a **metadata bot** that provides the users with a Q\&A system to capture information reg. the underlying schema, e.g., ‘Which table contains the Sales data for Switzerland?’ together with an auto\-complete logic for SQL operators, e.g., ‘Do we have the Sales Data for Germany and Spain in one table?’, answered by a join / filter on the respective table(s).

Finally, let’s delve into the flexibility that Snowflake provides with respect to choosing the underlying LLM powering Cortex Analyst. As we all know, the LLM landscape and leaderboard is continuously evolving with new and (more powerful) LLMs getting released regularly. So choice is critical in such fast\-moving technology landscapes. By default, Cortex Analyst leverages **Snowflake\-hosted Cortex LLMs**, which have been heavily fine\-tuned for text\-to\-SQL generation tasks and are one of the most powerful LLMs available today. It is however possible to explicitly opt\-in to allow Cortex Analyst to use the latest OpenAI GPT models, hosted by Microsoft Azure, alongside the Snowflake\-hosted models.


> At runtime, Cortex Analyst will select the optimal combination of models to ensure the highest accuracy and performance for each query.

To conclude, [Cortex Analyst](https://www.snowflake.com/en/blog/cortex-analyst-ai-self-service-analytics/) is a very promising Conversational BI Assistant ready to be used today (in public preview).


## References

1. D. Biswas. *Chatbots \& Natural Language Search*. Towards Data Science, [https://towardsdatascience.com/chatbots\-natural\-language\-search\-cc097f671b2b](https://towardsdatascience.com/chatbots-natural-language-search-cc097f671b2b)
2. Victor Zhong, Caiming Xiong, and Richard Socher. 2017\. *Seq2SQL: Generating Structured Queries from Natural Language using Reinforcement Learning*. [https://arxiv.org/abs/1709\.00103](https://arxiv.org/abs/1709.00103)
3. Tao Yu, et al. 2018\. *Spider: A large\-scale Human\-labeled Dataset for Complex and Cross\-domain Semantic Parsing and Text\-to\-Sql Task*. [https://arxiv.org/abs/1809\.08887](https://arxiv.org/abs/1809.08887)
4. Bailin Wang, et. al. 2020\. *RAT\-SQL: Relation\-Aware Schema Encoding and Linking for Text\-to\-SQL Parsers*. In Proc. of the 58th Annual Meeting of the Association for Computational Linguistics. [https://doi.org/10\.18653/v1/](https://doi.org/10.18653/v1/) 2020\.acl\-main.677
5. Ben Bogin, Matt Gardner, Jonathan Berant (2019\). *Representing Schema Structure with Graph Neural Networks for Text\-to\-SQL Parsing*. ACL, [https://arxiv.org/pdf/1905\.06241\.pdf](https://arxiv.org/pdf/1905.06241.pdf)
6. Yitao Cai and Xiaojun Wan. 2020\. *IGSQL: Database Schema Interaction Graph Based Neural Model for Context\-Dependent Text\-to\-SQL* *Generation*. In Proc. of the 2020 Conference on Empirical Methods in Natural Language Processing (EMNLP), [https://aclanthology.org/2020\.emnlp\-main.560\.pdf](https://aclanthology.org/2020.emnlp-main.560.pdf)
7. Lin, X.V., Socher, R., \& Xiong, C. (2020\). *Bridging Textual and Tabular Data for Cross\-Domain Text\-to\-SQL Semantic Parsing*. *FINDINGS*. [https://arxiv.org/abs/2012\.12627](https://arxiv.org/abs/2012.12627)
8. Bahdanau, Dzmitry, Kyunghyun Cho and Yoshua Bengio. *Neural Machine Translation by Jointly Learning to Align and Translate*. [https://arxiv.org/pdf/1409\.0473\.pdf](https://arxiv.org/pdf/1409.0473.pdf)
9. A. Floratou, et. al. *NL2SQL is a solved problem… Not*!, CIDR 2024, [https://www.cidrdb.org/cidr2024/papers/p74\-floratou.pdf](https://www.cidrdb.org/cidr2024/papers/p74-floratou.pdf)
10. M. Pourreza, et. al. *CHASE\-SQL: Multi\-Path Reasoning and Preference Optimized Candidate Selection in Text\-to\-SQL* (2024\), [https://arxiv.org/html/2410\.01943v1](https://arxiv.org/html/2410.01943v1)

