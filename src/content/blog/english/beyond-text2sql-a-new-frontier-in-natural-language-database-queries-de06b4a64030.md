---
title: "Beyond Text2SQL: A New Frontier in Natural Language Database Queries"
meta_title: "Beyond Text2SQL: A New Frontier in Natural Language Database Queries"
description: "The article introduces Table-Augmented Generation (TAG), a unified model designed to enhance natural language queries over databases. TAG addresses the limitations of existing approaches like Text2SQL and Retrieval-Augmented Generation (RAG) by integrating the reasoning capabilities of language models with efficient database execution. It consists of three main steps: query synthesis, query execution, and answer generation, allowing it to handle complex queries requiring external knowledge and semantic reasoning. TAG has demonstrated superior accuracy in evaluations, outperforming traditional methods, and shows promise for future advancements in data interaction."
date: 2024-12-26T04:30:18Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*mlnZpjaf3iJBvk-A5BSKoQ.jpeg"
categories: ["Natural Language Processing", "Data Science", "Programming/Scripting"]
author: "Rifx.Online"
tags: ["TAG", "query", "synthesis", "execution", "generation"]
draft: False

---





### Introducing TAG, a Unified Model for Complex Question Answering




## Bridging the Gap Between AI and Databases


### The Promise and the Bottleneck

Artificial intelligence (AI) is rapidly transforming the way we interact with data. The advent of powerful language models (LMs) has opened up new possibilities for querying and analyzing information in a more natural and intuitive way. Imagine a world where you can simply ask a question in plain English, and the system retrieves the exact information you need from a vast database. This is the promise of AI\-powered data interaction.

However, there’s a bottleneck. Traditional database systems are designed for structured queries, while LMs excel at understanding and generating natural language. Bridging this gap is crucial to unlocking the full potential of AI in data management.


### Why Text2SQL and RAG Fall Short

Recent efforts to bridge this gap have focused on two main approaches: Text2SQL and Retrieval\-Augmented Generation (RAG). Text2SQL aims to convert natural language questions into SQL queries that can be executed on a database. While promising, Text2SQL struggles with queries that require reasoning or knowledge beyond the data source.

RAG, on the other hand, retrieves relevant information from a knowledge base and uses it to answer the question. However, RAG often relies on simple point lookups and fails to leverage the full computational power of database systems.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*B5xA01XEzAY4QfaIO1DpkA.png)

Consider the following query, illustrated in Figure 1:

* “Summarize the reviews of the highest\-grossing romance movie considered a classic.”

Text2SQL might struggle with this query because it requires identifying “classic” movies, which necessitates an understanding of movie genres and critical acclaim, something not explicitly present in the database. RAG might also fail because it needs to combine information about revenue, genre, and reviews, potentially from multiple tables, and then perform a summarization.


### Enter TAG: A Unified Approach

To overcome these limitations, we introduce Table\-Augmented Generation (TAG), a unified model that combines the strengths of both LMs and database systems. TAG leverages the reasoning and knowledge capabilities of LMs while utilizing the efficient query execution of databases. This approach allows TAG to handle a wider range of queries, including those that require reasoning, knowledge, and complex computations.

In the following sections, we’ll delve deeper into the TAG model, explore its design space, and demonstrate its effectiveness through systematic evaluation.

**How TAG Handles the Example Query**

As depicted in Figure 1, TAG processes the example query in three steps:

1. **Query Synthesis:** TAG translates the natural language query into a database query (e.g., SQL) that incorporates LM\-based operators to identify classic romance movies.
2. **Query Execution:** The database efficiently executes the query, leveraging LMs if needed, to retrieve the highest\-grossing classic romance movie (in this case, Titanic).
3. **Answer Generation:** TAG uses an LM to summarize the reviews of the retrieved movie, providing a natural language answer to the user.

This structured approach allows TAG to effectively combine the strengths of LMs and databases, enabling it to answer complex queries that are beyond the capabilities of Text2SQL and RAG.


## Demystifying the TAG Model


### A Deep Dive into TAG’s Framework

The Table\-Augmented Generation (TAG) model provides a structured approach to answering natural language questions over databases. It comprises three key steps:

**Query Synthesis (`syn`)**: This step translates the natural language request (`R`) into an executable database query (`Q`). It identifies the relevant data and performs semantic parsing to generate a query in a language understandable by the database system (e.g., SQL).


> Example: For the query “Summarize the reviews of the highest\-grossing romance movie considered a classic,” syn would generate a SQL query that targets attributes like movie\_title, review, revenue, and genre. This might involve using LLM\-based operators within the SQL query to identify movies considered “classics.”

**Query Execution (`exec`)**: This step executes the generated query (`Q`) on. the database to obtain the relevant data (`T`). It leverages the efficiency of the database engine to process potentially vast amounts of data. The database API can range from traditional SQL engines to systems augmented with LLM\-based operators or native ML functions.


> Example: The SQL query generated in the previous step would be executed. The database would filter for romance movies, use an LLM\-based operator to identify “classics” among them, and then rank them by revenue to find the highest\-grossing one. The resulting data `T` would contain the relevant information for "Titanic" in this case.

**Answer Generation (`gen`)**: This step uses an LLM to generate a natural language answer (`A`) based on the user's request (`R`) and the retrieved data (`T`). It mirrors the generation step in RAG but benefits from the structured and relevant data obtained through the previous steps.


> Example: The LLM would receive the original request and the data about “Titanic,” including its reviews. It would then leverage its semantic reasoning capabilities to generate a natural language summary of those reviews.

TAG’s structured approach promotes a clean separation of concerns between the database system, responsible for efficient data retrieval, and the LLM, responsible for natural language understanding and generation. This allows TAG to effectively combine the strengths of both worlds, enabling it to answer complex queries that are beyond the capabilities of Text2SQL and RAG.


## Exploring the Vast Landscape of TAG


### Query Types: From Point Lookups to Complex Reasoning

TAG is designed to handle a wide spectrum of query types, going beyond the limitations of previous approaches. This includes:

* **Point Queries**: These queries retrieve specific information from a limited number of rows in the database. They often resemble lookup\-based questions.


> **Example**: “What is the phone number of John Doe?”

* **Aggregation Queries**: These queries require analyzing and summarizing information across multiple rows in the database. They often involve tasks like summarization, ranking, or complex reasoning.


> **Example**: “Summarize the customer reviews for the latest iPhone.”


### Data Model: Embracing the Diversity of Data

TAG is flexible enough to handle various data models:

* **Structured Data**: This refers to data organized in a predefined format, typically stored in relational databases. TAG can leverage the schema and relationships within structured data for efficient querying.


> **Example**: Customer data with attributes like name, age, address, and purchase history.

* **Unstructured Data**: This refers to data without a predefined format, such as text, images, audio, or video. TAG can leverage LLMs to extract relevant information and insights from unstructured data.


> **Example**: Customer reviews, social media posts, news articles.

* **Semi\-structured Data**: This refers to data that has some organizational properties but doesn’t adhere to a strict schema, often represented in formats like JSON or XML. TAG can handle the mix of structured and unstructured elements in semi\-structured data.


> **Example**: Product catalogs with structured attributes (name, price) and unstructured descriptions.


### Database APIs: A Gateway to Efficient Data Retrieval

TAG can work with various database APIs and execution engines:

* **SQL\-based Systems**: TAG can generate SQL queries to interact with relational databases, leveraging their efficient query processing capabilities.
* **Vector Embedding Systems**: For unstructured data, TAG can utilize vector embedding techniques to represent data semantically and perform similarity\-based retrieval.
* **Semantic Operator Systems**: TAG can leverage systems with LLM\-based operators, enabling the integration of natural language understanding and reasoning directly within the database query execution.


> **Example**: Using a `sem_filter` operator to filter rows based on sentiment or topic.

* **ML\-augmented Systems**: TAG can utilize databases with built\-in machine learning functionalities to perform complex analysis and predictions.


### LM Generation: Unlocking the Potential of Iterative and Recursive Patterns

TAG’s answer generation step can employ various LLM generation patterns:

* **Single\-call Generation**: The LLM generates the answer in a single step, processing the retrieved data and the user query in context.
* **Iterative Generation**: The LLM refines the answer iteratively, potentially interacting with the database multiple times to gather additional information or clarify ambiguities.
* **Recursive Generation**: The LLM breaks down complex queries into sub\-queries, recursively generating answers for each sub\-query and combining them to form the final answer.

These flexible generation patterns allow TAG to adapt to different query complexities and provide comprehensive and informative answers.


## Putting TAG to the Test


### Benchmark Methodology: A Quest for Realistic Evaluation

Existing benchmarks for table question answering primarily focus on queries that can be answered solely using the information explicitly available in the data source. To thoroughly evaluate TAG’s capabilities in handling queries that require external knowledge or complex reasoning, we needed a benchmark that included such challenging scenarios.


### Dataset and Query Modification: Tailoring BIRD for TAG

We chose the BIRD benchmark as our foundation due to its large\-scale tables, diverse domains, and variety of query types, including match\-based, comparison, ranking, and aggregation queries. We selected five domains from BIRD: `california_schools`, `debit_card_specializing`, `formula_1`, `codebase_community`, and `european_football_2`.

To assess TAG’s ability to handle real\-world scenarios, we modified the original BIRD queries to introduce two key challenges:

* **World Knowledge Requirement**: We added clauses or constraints that demand knowledge not explicitly present in the database, forcing the system to rely on external world knowledge.


> **Example**: In the `california_schools` domain, we modified the query "What is the grade span offered in the school with the highest longitude?" to "What is the grade span offered in the school with the highest longitude in cities that are part of the 'Silicon Valley' region?" This requires knowing which cities constitute the Silicon Valley region, information not found in the table.

* **Semantic Reasoning Requirement**: We modified queries to necessitate complex reasoning over textual or relational data, pushing the system to go beyond simple lookups and perform deeper analysis.


> **Example**: In the `codebase_community` domain, we modified the query "What are the titles of the top 5 posts with the highest popularity?" to "Of the 5 posts with the highest popularity, list their titles in order of most technical to least technical." This requires understanding the technicality of post titles, a task involving semantic reasoning over text.

Our final benchmark consists of 80 modified queries, evenly distributed between world knowledge and semantic reasoning requirements, with equal representation across the four BIRD query types.


### Baselines: A Spectrum of Approaches

We evaluated TAG against several baselines, each representing a different approach to answering natural language questions over databases:

* **Text2SQL**: This baseline directly translates the natural language query into SQL code, which is then executed on the database to obtain the answer.
* **Retrieval Augmented Generation (RAG)**: This baseline retrieves relevant rows from the database based on embedding similarity and then uses an LLM to generate the answer based on the retrieved data and the original query.
* **Retrieval \+ LM Rank**: This baseline extends RAG by using an LLM to re\-rank the retrieved rows before feeding them to the LLM for answer generation.
* **Text2SQL \+ LM**: This baseline uses Text2SQL to retrieve potentially relevant rows and then feeds them to an LLM for answer generation, similar to RAG but with a different retrieval mechanism.
* **Hand\-written TAG**: This baseline represents an ideal scenario where TAG pipelines are manually crafted with expert knowledge of the database schema and the query intent.


### Results and Analysis: TAG’s Triumph

Our evaluation showed that TAG, particularly the hand\-written version, significantly outperforms all other baselines in terms of answer accuracy. The hand\-written TAG achieved an overall exact match accuracy of 55%, while the other baselines struggled to surpass 20%. This highlights the effectiveness of TAG’s structured approach in combining the strengths of LLMs and database systems.

We also analyzed the performance of different baselines on various query types and found that TAG consistently delivers superior results, especially for queries requiring world knowledge or complex reasoning. This demonstrates TAG’s versatility and its ability to handle a wider range of real\-world scenarios.

Here are the detailed results from the research paper:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*BzkF5x_EPrCE2wMIdqDTiw.png)


## A Look at the Wider Research Landscape

TAG builds upon and extends previous research in the field of natural language processing and database systems. Here’s how it relates to other prominent approaches:


### Text2SQL: A Foundation with Limitations

Text2SQL methods aim to convert natural language questions into executable SQL queries. This has been extensively explored in the context of various datasets like WikiSQL, Spider, and BIRD. However, Text2SQL primarily focuses on queries that have direct relational equivalents and often struggles with queries requiring external knowledge or complex reasoning, which TAG is designed to address.


### RAG: Extending Knowledge, But Not Enough

Retrieval Augmented Generation (RAG) extends the capabilities of LLMs by retrieving relevant information from a knowledge base to answer questions. While RAG can incorporate external knowledge, it often relies on simple point lookups and may not fully leverage the computational power of database systems for complex queries. TAG addresses this by integrating LLMs into the database querying process itself, allowing for more sophisticated interactions between natural language understanding and structured data retrieval.


### NL Queries over Semi\-structured Data: Handling the Real World

Research on natural language queries over semi\-structured data explores the interaction between structured database elements and unstructured components like text fields. Approaches like STaRK and SUQL have tackled challenges in this domain, focusing on retrieval and semantic parsing techniques. TAG complements this research by providing a more general framework for handling both structured and unstructured data within a unified querying approach.


### Agentic Data Assistants: The Future of Data Interaction?

Recent work has explored the concept of LLM agents as data assistants, capable of interacting with databases and other tools to perform complex tasks. While TAG is currently defined as a single\-turn interaction, future research could extend it to multi\-turn, agentic scenarios where the LLM engages in a dialogue with the user and the database to iteratively refine the query and answer.


## TAG: A New Chapter in Data Understanding


### Key Findings: TAG’s Superiority and Potential

Our exploration of the TAG model and its evaluation has yielded several key findings:

* **Superior Accuracy**: TAG consistently outperforms traditional Text2SQL and RAG methods in answering complex natural language questions over databases, particularly those requiring external knowledge or semantic reasoning. This highlights the value of TAG’s unified approach, combining the strengths of LLMs and database systems.
* **Handling Diverse Query Types**: TAG can handle a wide range of query types, from simple point queries to complex aggregation queries that involve summarization, ranking, or intricate reasoning over data.
* **Adaptability to Different Data Models**: TAG is flexible enough to work with structured, unstructured, and semi\-structured data, making it applicable to various real\-world scenarios.
* **Efficient Query Execution**: By leveraging the capabilities of database systems, TAG ensures efficient query execution even for complex questions that require analyzing large amounts of data.
* **Potential for Future Advancements**: TAG opens up exciting research opportunities for developing more sophisticated techniques in query synthesis, LLM\-based operator integration, and answer generation.


### Future Research Directions: Expanding TAG’s Horizons

While TAG demonstrates significant promise, there are several avenues for future research:

* **Multi\-turn Interactions**: Extending TAG to handle multi\-turn dialogues, where the LLM can iteratively interact with the user and the database to refine the query and answer.
* **Explanation Generation**: Enhancing TAG to provide explanations for its answers, increasing transparency and user trust.
* **Handling Ambiguity and Uncertainty**: Developing robust mechanisms within TAG to handle ambiguous queries or uncertain information in the data.
* **Optimizing LLM\-based Operators**: Exploring efficient implementations and optimizations for LLM\-based operators within the database query execution.
* **Benchmarking and Evaluation**: Creating more comprehensive benchmarks to evaluate TAG’s performance on a wider range of tasks and data modalities.

By pursuing these research directions, we can further enhance TAG’s capabilities and unlock its full potential in revolutionizing the way we interact with data using natural language.


## References

\[1] Text2SQL is Not Enough: Unifying AI and Databases with TAG. [arXiv:2408\.14717](https://arxiv.org/abs/2408.14717v1).

\[2] Introduction to AI and ML in BigQuery \| [Google Cloud](https://cloud.google.com/bigquery/docs/bqml-introduction).

\[3] [https://ai.meta.com/blog/meta\-llama\-3\-1/](https://ai.meta.com/blog/meta-llama-3-1/)

\[4] [Open\-Domain Question Answering Goes Conversational via Question Rewriting](https://aclanthology.org/2021.naacl-main.44.pdf)

\[5] Spider2\-V: How Far Are Multimodal Agents From Automating Data Science and Engineering Workflows? [arXiv:2407\.10956](https://arxiv.org/abs/2407.10956)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*7wALg_4vYc9c1ZIi.png)

This story is published on [Generative AI](https://generativeai.pub/). Connect with us on [LinkedIn](https://www.linkedin.com/company/generative-ai-publication) and follow [Zeniteq](https://www.zeniteq.com/) to stay in the loop with the latest AI stories.

Subscribe to our [newsletter](https://www.generativeaipub.com/) and [YouTube](https://www.youtube.com/@generativeaipub) channel to stay updated with the latest news and updates on generative AI. Let’s shape the future of AI together!

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*7pSh94oL2KMUe7Ko.png)


