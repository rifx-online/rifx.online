---
title: "Wren AI Text-to-SQL: API — the good stuff | by D | Medium"
meta_title: "Wren AI Text-to-SQL: API — the good stuff | by D | Medium"
description: "Wren AI is an AI application that translates natural language queries into SQL, simplifying interaction with structured data in databases. It offers a UI and an API for generating SQL queries and retrieving data. Users must configure schemas and metadata for optimal results. While the API lacks real-time update mechanisms, it allows for asynchronous task management. Currently, there’s no public API documentation, but users can explore functionalities through network monitoring. Wren AI enhances the efficiency of database communication by converting user prompts directly into SQL queries."
date: 2025-01-05T02:05:18Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*gaxyrdmKJziTuQTEDloByg.gif?output=gif&n=50"
categories: ["Programming", "Technology", "Data Science"]
author: "Rifx.Online"
tags: ["SQL", "translation", "queries", "database", "metadata"]
draft: False

---




**Wren AI** is an AI pipeline application that translates natural language user queries to SQL also known as **Text\-to\-SQL** (also known as Natural Language to SQL or NL2SQL), so you can chat with your database. It features both a UI and an API, allowing you to generate SQL queries based on user prompts and retrieve data using those queries. This significantly simplifies working with structured tabular data in your RAG/Agent applications.

Take a look at their demo <https://demo.getwren.ai/>



For more details on AI RAG and Agent pipeline applications, please see my previous article.


## How Wren AI Works:

Deploying Wren AI is straightforward using the official Wren AI Docker Compose [locally](https://docs.getwren.ai/installation). You will need an OpenAI API key and to select the model you plan to use. Alternatively, you can use other OpenAI API\-compatible inference engines like LocalAI by setting the [`OPENAI_API_B`ASE](https://github.com/Canner/WrenAI/blob/main/docker/.env.example#L28) environment variable for the container. The Wren AI team has also implemented [Ollama inference](https://github.com/Canner/WrenAI/pull/376) and recommends using [Llama3 70b\-instruct](https://ollama.com/library/llama3:70b-instruct) model. To utilize other than OpenAI models, you’ll need to create [\~/.wrenai/.env.ai](https://github.com/Canner/WrenAI/blob/main/docker/.env.ai.example) file following this example. Supported databases currently include BigQuery, DuckDB, PostgreSQL, MySQL, MS SQL, Clickhouse, and even [Microsoft Excel Add\-in](https://appsource.microsoft.com/en-us/product/office/WA200007192). You can vote for additional database support \[[here](https://github.com/Canner/WrenAI/discussions/327)].


```python
### Example: Ollama inference
LLM_PROVIDER=ollama
```

```python
### ollama. URL should be reachable from Docker Container!!!
OLLAMA_URL=http://host.docker.internal:11434
```

```python
### https://ollama.com/library/llama3:70b-instruct-q8_0
GENERATION_MODEL=llama3:70b-instruct-q8_0
```

```python
### supported embedding models providers by qdrant: https://qdrant.tech/documentation/embeddings/
### https://ollama.com/library/mxbai-embed-large:335m-v1-fp16
EMBEDDING_MODEL=mxbai-embed-large:335m-v1-fp16
EMBEDDING_MODEL_DIMENSION=1024
```

```python
### DOCUMENT_STORE
DOCUMENT_STORE_PROVIDER=qdrant
QDRANT_HOST=qdrant
```
For Kubernetes deployment, refer to my article here:

Upon completing installing the Wren AI app you can access it via the URL.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*VRzx0jbho6sgHKcgrteFqg.png)

Once connected to your database or after uploading a sample dataset, such as the NBA playground, you’ll enter the home page. If you’d like to see the data in the sample dataset you can find it [here](https://github.com/Canner/WrenAI/blob/main/wren-ai-service/demo/utils.py#L369-L394) just replace the version in the URL with the `DATASET_VERSION` variable listed at the same location.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*jr4HyNw18SN1kCYav2UbFg.png)

Configuring your schema and adding descriptive text is crucial in the **Modeling** menu.


> **Modeling** aids both you and your Large Language Model (LLM) in understanding the data and metadata, resulting in improved query outcomes. To provide better results you must setup relations and provide descriptions since API names of the columns in your tables might not be enough.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*50jA3YBy4jfvaO6L0MmEqA.png)

With your schema with relations configured and descriptions added in the Modeling menu, head to the **Home** menu to generate your first Text\-to\-SQL queries. The system attempts to produce three different SQL queries for you, with the results visible.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*_mNiFr48CTi5EjXG2mfavw.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*u1lsyCSCVDrxz7Ah8XcLWA.png)


## The good stuff: API

Moreover, you can access the same functionality via an API, making it an ideal platform for integrating structured tabular data into your RAG/Agent pipeline applications simply by consuming Wren AI as a service. Unfortunately, currently, there’s no mechanism for sending real\-time updates from Wren AI back to the client such as WebSocket, Server\-Sent\-Events, or WebHooks. You’ll have to use Long Polling initiated by the client to constantly check for updates if Wren AI gets the answers ready for you, but the team is [working on it](https://github.com/Canner/WrenAI/issues/331).

While there isn’t currently public API documentation available, you can explore the functionality through the following steps by utilizing the Chrome Dev Tools \-\> Network to observe API interactions.

1\. Create an asynchronous task by submitting a question to AI using the \`**createAskingTask**\` mutation in GraphQL.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*zaSxdvO3VR6a_fc9)

2\. Poll the task’s status change using the \`**askingTask**\` query.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*1-614X8bZtNzQlAX)

3\. Upon receiving a \`**FINISHED**\` status, retrieve three candidates in the payload.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*YS6vh9kizEn4H9Vj)

4\. Call the \`**createThread**\` mutation with the payload obtained.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*vqfYwzBo02rr_Gov)

5\. A thread comprises multiple responses, each containing a question and an answer. Query a thread with the \`**thread**\` query.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*fnffXrP72lRZ8yp1)

6\. The \`**responses**\` field in each thread contains an array of responses. Subsequent questions append to this array.

7\. Continuously poll the \`**threadResponse**\` API to monitor status changes.

8\. Upon the status turning \`**FINISHED**\`, view the detailed answer in the \`**detail**\` field.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*fonGcCYqsw4HhHVZ)

9\. The \`**detail**\` field provides a step\-by\-step answer seen in the UI.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*w427tiU4XZ1wbRr0)

Currently, Wren AI doesn’t offer a direct way to download or export results with data. As a workaround, consider copying the native SQL, executable within your database, and perform exporting from the database itself.


## Summary

Wren AI platform makes it extremely easy for you or your RAG/Agent AI application to work with structured data in your Relational Databases, converting user prompts into valid SQL. UI with a modeling menu is important to provide additional metadata descriptions and schemas for your LLM to better understand your database and its data. Once modeling is done, Wren AI is ready to serve as a middleman in front of your DB. In short, you just speak to your database. This is unheard\-of simplicity unachievable before, which makes work with DB highly effective in translating business language into SQL queries directly.


## Enjoyed This Story?

If you like this article and you want to support me:

1. **Clap** 👏 my article **10 times**; that will help me out
2. [**Follow**](https://medium.com/@qdrddr) me on Medium to get my latest articles 🫶
3. Follow [Wren AI on Medium](https://blog.getwren.ai/)
4. [**Share**](https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fmedium.com%2F%40qdrddr.4d57c0c181c) this article on social media ➡️🌐
5. Give me **feedback in the comments** 💬 below. It’ll help me to better understand that this work was useful, even a simple “thanks” or “\+” will do. Give me good, give me bad, whatever you think as long as you tell me place to improve and how.

