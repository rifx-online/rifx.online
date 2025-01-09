---
title: "Top 21 Famous RAG Frameworks in 2025"
meta_title: "Top 21 Famous RAG Frameworks in 2025"
description: "The article discusses the evolution and significance of Retrieval-Augmented Generation (RAG) frameworks in artificial intelligence as of January 2025. It highlights the integration of retrieval mechanisms with generative models, which enhances the accuracy and contextual relevance of responses from large language models (LLMs). The article lists 21 notable RAG frameworks available on GitHub, detailing their unique features, use cases, and suitability for various applications, such as healthcare and customer service. Key attributes of RAG frameworks include knowledge retrieval, generative model enhancement, multi-round interaction, and model optimization, which collectively improve the performance and reliability of AI systems."
date: 2025-01-09T01:46:35Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*cN8GO4abeoz-4HUlISnfcA.png"
categories: ["Generative AI", "Natural Language Processing", "Technology"]
author: "Rifx.Online"
tags: ["RAG", "retrieval", "generative", "LLMs", "optimization"]
draft: False

---







## Revolutionizing AI with Advanced Retrieval\-Augmented Generation

Disclosure: I use GPT search. The entire article is still drafted by me.


> My writing style tends to be assertive and analytical, without relying on ChatGPT\-assisted writing compared to the previous article.

Thank you for being a part of this journey with me, and I hope to continue providing value to you for years to come! Giving tips by supporting me.

As of 4th January 2025,

Disclaimer: [**Similar**](https://sebastian-petrus.medium.com/top-10-rag-frameworks-github-repos-2024-12b2a81f4a49) but I improved it.


## Introduction

The Retrieval\-Augmented Generation (RAG) frameworks have revolutionized LLMs by integrating retrieval mechanisms with generative models. As the need for AI solutions increases, several open\-source RAG frameworks have appeared on GitHub, each offering unique features and functionalities.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*guDVvKuyTeouftNs.png)

Here are the key features of the RAG framework:

1. **Knowledge Retrieval** — This core function allows the RAG framework to provide contextual support for LLMs by fetching relevant information from external knowledge bases.
2. **Generative Model Enhancement** — This involves using the retrieved information to improve the input for LLMs, enabling the model to produce more accurate, current, and contextually relevant responses.
3. **Multi\-Round Interaction** — This feature allows the RAG system to refine queries and generate content through multiple interactions with users, enhancing both user satisfaction and system accuracy.
4. **Model Optimization** — Enhances RAG system’s performance through various technical methods, such as query disambiguation, query abstraction, and index optimization.


## Why cannot we use LangChain alone?

Although LangChain streamlines the LLM development process, there are some limitations to consider

LangChain is good for beginners looking to get started quickly.

1. **Inconsistent behavior** — LangChain can obscure important details, which may lead to unexpected issues in production environments. For example, the ConversationRetrievalChain can rephrase input questions, occasionally interrupting the natural flow of conversation.
2. **Lack of standard data types** — No standard method for representing data in LangChain, which can complicate integration with other frameworks and tools, making it harder to operate within the larger machine learning ecosystem.
3. **Complex concepts and helper functions** — The codebase of LangChain includes numerous concepts and “helper” functions that act as wrappers around standard Python functions, which can make it more challenging to learn and use.

RAG is suited for managing complex and domain\-specific queries.

1. **Incorporate external knowledge** — Facilitates the smooth integration of specialized or up\-to\-date information into the LLM that may not have been part of the model’s initial training data.
2. **Improve response accuracy** — It can significantly lower error rates and instances of hallucinations in LLM outputs.
3. **Support customized needs** — Tailor LLMs for specific datasets or knowledge bases, producing responses that are more pertinent to particular application contexts.
4. **Improve process transparency** — Trace the sources of information that the LLM relies on when generating responses.


> **Hallucinations occur when the model generates content that doesn’t align with reality.**


## Top 21 Famous RAG Frameworks

These frameworks enhance the accuracy and reliability of generated content by integrating large language models with external knowledge bases, making them valuable in sectors like healthcare, finance, customer service, and education.


## 1\. RAGFlow

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*uO7VK_f2OogaoP6P)

* **URL**: <https://github.com/infiniflow/ragflow>
* **GitHub Star**: 27\.1K
* Simplified workflow design with pre\-built components and integration with vector databases.
* **Suitable for**: Developers and organizations looking to build RAG applications quickly.
* **Workflow Design**: Intuitive interface for designing and configuring RAG workflows.
* **Pre\-configured Workflows**: Ready\-to\-use workflows for common scenarios.
* **Vector Database Integration**: Seamless integration with vector databases for efficient retrieval.
* Used in real\-time applications like chatbots and instant QA systems.
* User\-friendly and efficient, reducing the learning curve and development time.
* **Community support**: RAGFlow is gaining popularity due to its simplicity and effectiveness.


## 2\. Haystack

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*lqWpcXjYVMlfQKXW)

* **URL**: [https://github.com/deepset\-ai/haystack](https://github.com/deepset-ai/haystack)
* **GitHub Star**: 18\.2k
* Modular, with components for document retrieval, question answering, and text summarization. Supports various document storage solutions like Elasticsearch, FAISS, and SQL.
* **Suitable for**: Developers, researchers, and organizations building end\-to\-end QA and search systems.
* **Document Retrieval**: Efficiently retrieves relevant documents using various indexing methods.
* **Question Answering**: Uses pre\-trained language models to generate answers based on retrieved documents.
* **Text Summarization**: Provides tools to summarize large documents.
* Widely used in healthcare, finance, and customer support for building QA systems and search engines.
* Highly user\-friendly with a simple API and extensive documentation, suitable for beginners and experienced developers.
* **Community Support**: Haystack has a strong community and active development, ensuring continuous improvements and updates.


## 3\. STORM

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*665qDQeAJ9X9zbX1.jpg)

* **URL**: [https://github.com/stanford\-oval/storm](https://github.com/stanford-oval/storm)
* **GitHub Star:** 15\.7k
* Focuses on efficient retrieval mechanisms and generation processes.
* **Suitable for**: Developers and organizations needing fast and accurate text retrieval and response generation.
* **Highly Configurable Retrieval**: Supports multiple retrieval strategies and embedding models.
* **Optimized Generation**: Flexible integration with generation models to improve response quality.
* Particularly useful in online customer support and intelligent assistants.
* Designed for high performance and efficiency, suitable for real\-time applications.
* **Community Support**: a focus on academic research and practical applications.


## 4\. LLM\-App

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*SsSZp8rCYmvf1Umz.gif?output=gif&n=50)

* **URL**: [https://github.com/pathwaycom/llm\-app](https://github.com/pathwaycom/llm-app)
* **GitHub Star**: 11\.3k
* Comprehensive toolchain for document parsing, indexing, retrieval, and response generation.
* **Suitable for**: Enterprises and developers building RAG applications with large language models.
* **Document Parsing**: Tools to parse and preprocess documents.
* **Indexing**: Support for various document storage solutions.
* **Retrieval and Generation**: Integrated modules for efficient retrieval and high\-quality response generation.
* Used in legal, healthcare, and customer service for building QA systems and search engines.
* User\-friendly with detailed documentation and examples, making it easy to set up and use.
* LLM\-App supports multiple language models and document storage solutions, offering a balanced approach to RAG.


## 5\. txtai

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*2t58B08UeFl1u42U.jpg)

* **URL**: <https://github.com/neuml/txtai>
* **GitHub Star:** 9\.8k
* All\-in\-one platform for semantic search, language model workflows, and document processing pipelines.
* **Suitable for**: Organizations requiring a comprehensive solution for multiple AI tasks.
* **Semantic Search**: Efficient similarity search using embedded databases.
* **Language Model Workflows**: Easy integration with various language models and AI services.
* **Document Processing**: Support for multi\-language and multi\-format data.
* Used in customer service, content recommendation, and data analysis.
* Highly integrated and easy to use, making it suitable for small and large\-scale projects.
* Offers detailed documentation and examples to help users get started quickly.


## 6\. R2R

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*S1gzUcNGpXKQ07Ni76iibw.png)

* **URL**: [https://github.com/SciPhi\-AI/R2R](https://github.com/SciPhi-AI/R2R)
* **GitHub Star**: 4\.3K
* A lightweight framework simplifies the retrieval\-to\-response process.
* **Multi\-step Retrieval and Generation**: Optimizes intermediate steps.
* **Support for Various Strategies**: Flexible retrieval and generation options.
* Used in real\-time applications like chatbots and instant QA systems.
* Fast and efficient, suitable for real\-time applications.
* R2R is designed to reduce inference latency without compromising accuracy.


## 7\. Cognita

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*jSgyfTWaAbazLDyd.png)

* **URL**: <https://github.com/truefoundry/cognita>
* **GitHub Star:** 3\.5K
* Designed for knowledge\-intensive applications, integrating efficient document management and retrieval mechanisms.
* **Suitable for**: Professionals and organizations dealing with complex knowledge graphs and QA systems.
* **Multi\-modal Data Support**: Handles various data types.
* **Customizable Indexing**: Flexible indexing schemes.
* **Powerful Generation Models**: Advanced models for high\-quality responses.
* Ideal for applications like medical consultations and legal advice.
* Customizable and flexible, suitable for applications requiring deep knowledge management.
* Common Use: Cognita is used in large\-scale projects where adaptability and precision are crucial.


## 8\. FlashRAG

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*DUIBTn1BzEjRMjZ5.gif?output=gif&n=50)

* **URL**: [https://github.com/RUC\-NLPIR/FlashRAG](https://github.com/RUC-NLPIR/FlashRAG)
* **GitHub Star**: 1\.6K
* Optimized for inference speed, with various acceleration techniques.
* **Suitable for**: Developers and organizations needing real\-time RAG applications.
* **Multiple Retrieval Models**: Supports various retrieval models.
* **Optimized Rescorers**: Algorithms to improve document ranking.
* **Efficient Generators**: High\-performance generation models.
* Used in applications requiring immediate and accurate responses, such as online customer support and smart assistants.
* Fast and reliable, ideal for real\-time applications.
* FlashRAG is designed to reduce inference latency without compromising accuracy.


## 9\. Neurite

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*pnnqofg3mfwu07Vu)

* **URL**: <https://github.com/satellitecomponent/Neurite>
* **GitHub Star**: 1\.3K
* Combines neural network techniques with retrieval mechanisms.
* **Suitable for**: Researchers and organizations requiring high precision and performance.
* **Deep Learning Models**: Supports various neural network models.
* **Efficient Vector Retrieval**: Optimized for large datasets.
* **Flexible Generation Strategies**: Adaptable generation methods.
* Particularly useful in scientific research and data\-driven applications.
* High precision and performance, suitable for advanced research and data analysis.
* Neurite offers advanced features for improving retrieval and generation accuracy.


## 10\. Canopy

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*3sysrT5g7fsSyHjr.png)

* **URL**: [https://github.com/pinecone\-io/canopy](https://github.com/pinecone-io/canopy)
* GitHub Star: 990
* Modular and recursive, allowing for a flexible combination of components.
* **Suitable for**: Developers and organizations needing highly customizable RAG systems.
* **Multi\-step Retrieval and Generation**: Recursive calls to models.
* **Customizable Components**: Flexibility to tailor the system.
* **Strong Model Integration**: Supports a wide range of models.
* Ideal for enterprise\-level knowledge management systems.
* Highly modular and customizable, suitable for large\-scale projects.
* Canopy is designed to handle complex and dynamic data, making it suitable for enterprise applications.


## 11\. EasyRAG

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*oA_JauclFDlAwwu5.png)

* URL: <https://github.com/BUAADreamer/EasyRAG>
* GitHub Star: 248
* EasyRAG is designed to enhance the efficiency of RAG systems, particularly for automated network operations.
* Ideal for developers and organizations looking to automate network tasks such as automated content generation, web crawling, social media analysis, and more.
* Streamlined RAG system development — EasyRAG simplifies the process of building an RAG system by offering user\-friendly APIs and tools.
* Enhanced retrieval and generation efficiency: The algorithms for retrieval and generation are optimized to maintain high efficiency when handling large datasets.
* Multi\-step retrieval and generation process: This involves a structured data processing approach, starting with dual\-way sparse retrieval for initial sorting, followed by LLM re\-ranking for fine\-tuning, and LLM generation for optimized answers, resulting in precise outcomes.
* The platform offers a flexible code base with various retrieval and generation strategies, allowing for user\-defined processes.
* Primarily utilizing BM25 retrieval and BGE\-reranked sorting, it requires no fine\-tuning of models, ensuring low memory usage, easy deployment, and excellent scalability.


## 12\. TableRAG

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*bXPJfaikFG9dvllo.png)

* **URL**: [https://arxiv.org/html/2410\.04739v1](https://arxiv.org/html/2410.04739v1)
* Designed for understanding and generating tasks related to millions of labeled tables, TableRAG specializes in processing tabular data, enabling efficient comprehension and generation of large\-scale datasets.
* Ideal for scenarios involving large\-scale tabular data, such as data analysis, report generation, and financial statement processing.
* By utilizing query expansion and retrieving patterns and cells, it supplies key information to the language model, enhancing both accuracy and efficiency in generation.
* Efficient retrieval and generation capabilities — This approach significantly shortens prompt lengths and minimizes the risk of losing important information.
* Multi\-step retrieval and generation — The process includes query expansion, pattern and cell retrieval, and LLM generation, among other steps.
* Experimental verification: Two million token benchmarks were created using the Arcade and BIRD\-SQL datasets to thoroughly assess the effectiveness of TableRAG in large\-scale applications.


## 13\. Modular RAG

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*GWisxg8ssjlGHNnL.png)

* URL: [https://arxiv.org/html/2407\.21059v1](https://arxiv.org/html/2407.21059v1)
* Transforming the RAG system into a reconfigurable framework akin to Lego.
* Ideal for RAG applications that demand high flexibility and customizability, suitable for knowledge management systems in enterprises, personalized recommendation systems, and more.
* Multi\-step retrieval and generation — The modular design supports processes for multi\-step retrieval and generation.
* Custom components — Users can select and configure various components as needed, creating a highly tailored RAG system.
* Perfect for large\-scale projects, offering flexible solutions.
* Modular RAG is capable of managing complex and dynamic data, making it especially suitable for the constantly evolving data landscape in enterprise applications.


## 14\. Speculative RAG

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*3bmUR8yoYudN7JRH.png)

* URL: [https://arxiv.org/pdf/2407\.08223](https://arxiv.org/pdf/2407.08223)
* It first creates drafts, then retrieves and refines them during the generation process, which boosts both accuracy and efficiency.
* Ideal for situations that demand high\-precision output such has content creation, knowledge\-based Q\&A, technical document generation, and more.
* Multi\-step retrieval and generation — Drafts are initially created, followed by retrieval and optimization during the generation phase, enhancing both accuracy and efficiency.
* Custom components — Users have the flexibility to choose and configure various components as needed, allowing for a highly tailored RAG system.
* Speculative RAG is adept at handling intricate and evolving data, making it especially suitable for the fast\-paced data landscape in enterprise applications.


## 15\. RAGAR

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*g2LUI2shqHvJ3Rn_.jpg)

* URL: [https://arxiv.org/html/2404\.12065v2](https://arxiv.org/html/2404.12065v2)
* RAGAR integrates multimodal data with RAG technology specifically for political fact\-checking.
* well\-suited for environments that require political fact\-checking, such as news organizations, government bodies, and political research institutions.
* Multi\-step retrieval and generation — By merging multimodal data, RAGAR implements a multi\-step process for retrieval and generation.
* Custom components — Users have the flexibility to choose and configure various components based on their specific needs, allowing for a highly tailored RAG system.
* RAGAR is equipped to manage complex and evolving data, making it particularly effective in the fast\-paced data landscape of enterprise applications.


## 16\. Blended RAG

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*g6A3NQ2k9qTfc1kh.png)

* **URL**: [https://arxiv.org/html/2404\.07220v1](https://arxiv.org/html/2404.07220v1)
* Blended RAG combines semantic search with a hybrid query retriever to boost retrieval accuracy and efficiency.
* Ideal for situations that require processing extensive long\-tail knowledge, such as an enterprise’s internal knowledge base or professional field Q\&A.
* Multi\-step retrieval and generation — The system implements a multi\-step process for retrieval and generation through semantic search and a hybrid query retriever.
* Custom components — Users have the flexibility to choose and configure various components based on their specific needs, allowing for a highly tailored RAG system.
* Blended RAG is equipped to manage complex and evolving data, making it particularly effective in the fast\-paced data landscape of enterprise applications.


## 17\. ARAGOG (ARAGOG — Advanced Retrieval Augmented Generation Output Grading)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*zqSaGL2SODaR4xMu.png)

* **URL**: [https://arxiv.org/html/2404\.01037v1](https://arxiv.org/html/2404.01037v1)
* evaluating the quality of answers produced by the RAG system.
* Ideal for applications that require quality control of generated responses, such as education, medical care, and legal consulting.
* **Multi\-step retrieval and generation** — This system implements a multi\-step process for retrieval and generation through advanced output grading.
* **Custom components** — Users can select and configure various components according to their specific needs, allowing for a highly customized RAG system.
* ARAGOG is designed to manage complex and dynamic data, making it particularly suitable for the constantly changing data landscape in enterprise applications.


## 18\. RAPTOR

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*VHAIpGwCqa1MepXY.jpg)

* It enhances the efficiency and accuracy of data retrieval through its recursive methods.
* Ideal for processing hierarchical data, such as legal documents, corporate records, technical manuals, and more.
* The system enables a multi\-step retrieval and generation process using recursive techniques.
* Users can choose and configure various components to create a highly customized RAG system.
* RAPTOR is designed to manage complex and dynamic data, making it especially suitable for the constantly evolving data landscape in enterprise applications.


## 19\. LightRAG

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*XCP1w_oVPUtXGtdM)

* **URL**: [https://arxiv.org/pdf/2410\.05779](https://arxiv.org/pdf/2410.05779)
* It leverages graph structures to improve the efficiency of the retrieval process.
* Ideal for managing complex queries and extensive datasets: for instance, enterprise knowledge bases, academic research, and more.
* Multi\-step retrieval and generation — The dual\-level retrieval system enables a comprehensive multi\-step retrieval and generation process.
* Custom components — Users have the flexibility to choose and configure various components to create a highly tailored RAG system.
* LightRAG is designed to handle complex and evolving data, making it especially suitable for the fast\-paced data landscape in enterprise applications.


## 20\. Invar\-RAG

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*q9RN4WmRW2OlHUMS.png)

* URL: [https://arxiv.org/html/2411\.07021v1](https://arxiv.org/html/2411.07021v1)
* It improves both the retrieval and generation processes using the invariant alignment technique.
* Ideal for applications that demand high\-precision generation and retrieval, such as knowledge\-intensive tasks and professional field Q\&A.
* Multi\-step retrieval and generation — The invariant alignment method enables a multi\-step approach to retrieval and generation.
* Custom components — Users have the flexibility to choose and configure various components to create a highly tailored RAG system.
* Invar\-RAG is capable of managing complex and dynamic data, making it especially suitable for the rapidly changing data landscape in enterprise applications.


## 21\. RankRAG

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*TQla2HSEl45sZyzoxEg99Q.png)

* **URL:** [https://arxiv.org/pdf/2407\.02485](https://arxiv.org/pdf/2407.02485)
* It streamlines the retrieval\-augmented generation (RAG) pipeline by fine\-tuning large language models to handle retrieval and ranking tasks.
* Ideal for RAG applications that demand high performance and efficiency, such as enterprise internal knowledge bases and specialized question\-and\-answer systems.
* Multi\-step retrieval and generation — The fine\-tuning approach enables the execution of multi\-step retrieval and generation processes.
* Custom components — Users have the flexibility to select and configure various components according to their needs, allowing for a highly tailored RAG system.
* RankRAG is equipped to manage complex and dynamic data, making it especially well\-suited for the constantly evolving data landscape in enterprise applications.

**References**








## If you’ve found any of my articles helpful or useful then please consider throwing a coffee my way to help support my work or give me patronage😊, by using

[**Patreon**](https://www.patreon.com/jinlowmedium)

[**Ko\-fi.com**](https://ko-fi.com/jinlowmedium)

[**buymeacoffee**](https://www.buymeacoffee.com/jinlowmedium)

*Last but not least, if you are not a Medium Member yet and plan to become one, I kindly ask you to do so using the following link. I will receive a portion of your membership fee at no additional cost to you.*

I am thrilled to announce my upcoming Substack newsletter, where I’ll delve into my investing system, harnessing the immense potential of IT technology and embracing a system\-thinking approach to investment strategies. Rest assured, I will still be posting when inspiration strikes.


