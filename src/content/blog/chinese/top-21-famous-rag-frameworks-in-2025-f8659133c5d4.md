---
title: "2025 年最著名的 21 个 RAG 框架"
meta_title: "2025 年最著名的 21 个 RAG 框架"
description: "检索增强生成（RAG）框架结合检索机制与生成模型，提升大型语言模型（LLMs）的准确性和可靠性。文章列出了21个著名的RAG框架，强调其在医疗、金融、客户服务和教育等领域的重要性。每个框架具有独特特性，如知识检索、生成模型增强和多轮交互，适合不同的应用场景。RAG框架的优势在于整合外部知识、提高响应准确性并支持定制需求，适合复杂查询管理。"
date: 2025-01-09T01:46:35Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*cN8GO4abeoz-4HUlISnfcA.png"
categories: ["Generative AI", "Natural Language Processing", "Technology"]
author: "Rifx.Online"
tags: ["RAG", "retrieval", "generative", "LLMs", "optimization"]
draft: False

---





## 通过高级检索增强生成技术革新人工智能

披露：我使用GPT搜索。整篇文章仍由我草拟。

> 我的写作风格倾向于自信和分析性，相比之前的文章，不依赖于ChatGPT辅助写作。

感谢您与我一起参与这段旅程，我希望在未来几年继续为您提供价值！通过支持我来提供建议。

截至2025年1月4日，

免责声明：[**类似**](https://sebastian-petrus.medium.com/top-10-rag-frameworks-github-repos-2024-12b2a81f4a49)但我进行了改进。

## 介绍

检索增强生成（RAG）框架通过将检索机制与生成模型相结合，彻底改变了大型语言模型（LLMs）。随着对人工智能解决方案需求的增加，多个开源RAG框架已在GitHub上出现，每个框架都提供独特的功能和特性。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*guDVvKuyTeouftNs.png)

以下是RAG框架的关键特性：

1. **知识检索** — 这一核心功能使RAG框架能够通过从外部知识库获取相关信息，为LLMs提供上下文支持。
2. **生成模型增强** — 这涉及使用检索到的信息来改善LLMs的输入，使模型能够生成更准确、更新和具有上下文相关性的响应。
3. **多轮交互** — 此功能允许RAG系统通过与用户的多次交互来优化查询和生成内容，从而提高用户满意度和系统准确性。
4. **模型优化** — 通过各种技术方法（如查询消歧义、查询抽象和索引优化）提升RAG系统的性能。

## 为什么我们不能单独使用 LangChain？

尽管 LangChain 简化了 LLM 开发过程，但仍需考虑一些限制。

LangChain 适合希望快速入门的初学者。

1. **不一致的行为** — LangChain 可能会掩盖重要细节，这可能导致在生产环境中出现意想不到的问题。例如，ConversationRetrievalChain 可能会重新措辞输入问题，偶尔会打断对话的自然流畅性。
2. **缺乏标准数据类型** — LangChain 中没有标准的方法来表示数据，这可能会使与其他框架和工具的集成变得复杂，从而在更大的机器学习生态系统中操作变得更加困难。
3. **复杂的概念和辅助函数** — LangChain 的代码库包含许多概念和作为标准 Python 函数包装器的“辅助”函数，这可能使学习和使用变得更加具有挑战性。

RAG 适合管理复杂和特定领域的查询。

1. **整合外部知识** — 促进将专业或最新信息平滑集成到 LLM 中，这些信息可能不在模型的初始训练数据中。
2. **提高响应准确性** — 它可以显著降低 LLM 输出中的错误率和幻觉实例。
3. **支持定制需求** — 为特定数据集或知识库定制 LLM，生成与特定应用场景更相关的响应。
4. **提高过程透明度** — 追踪 LLM 在生成响应时所依赖的信息来源。

> **幻觉发生在模型生成与现实不符的内容时。**

## 前21个著名的RAG框架

这些框架通过将大型语言模型与外部知识库集成，提高生成内容的准确性和可靠性，使其在医疗、金融、客户服务和教育等领域具有重要价值。

## 1\. RAGFlow

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*uO7VK_f2OogaoP6P)

* **URL**: <https://github.com/infiniflow/ragflow>
* **GitHub Star**: 27\.1K
* 简化的工作流设计，配备预构建组件并与向量数据库集成。
* **适合**：希望快速构建RAG应用程序的开发者和组织。
* **工作流设计**：直观界面，用于设计和配置RAG工作流。
* **预配置工作流**：适用于常见场景的现成工作流。
* **向量数据库集成**：与向量数据库无缝集成，实现高效检索。
* 用于实时应用程序，如聊天机器人和即时问答系统。
* 用户友好且高效，减少学习曲线和开发时间。
* **社区支持**：由于其简单性和有效性，RAGFlow正逐渐受到欢迎。

## 2\. Haystack

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*lqWpcXjYVMlfQKXW)

* **URL**: [https://github.com/deepset\-ai/haystack](https://github.com/deepset-ai/haystack)
* **GitHub Star**: 18\.2k
* 模块化，包含文档检索、问答和文本摘要的组件。支持多种文档存储解决方案，如Elasticsearch、FAISS和SQL。
* **适合**：开发者、研究人员和构建端到端QA和搜索系统的组织。
* **文档检索**：使用多种索引方法高效检索相关文档。
* **问答**：利用预训练语言模型根据检索到的文档生成答案。
* **文本摘要**：提供工具以总结大型文档。
* 广泛应用于医疗、金融和客户支持领域，用于构建QA系统和搜索引擎。
* 用户友好，具有简单的API和丰富的文档，适合初学者和经验丰富的开发者。
* **社区支持**：Haystack拥有强大的社区和活跃的开发，确保持续改进和更新。

## 3\. STORM

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*665qDQeAJ9X9zbX1.jpg)

* **URL**: [https://github.com/stanford\-oval/storm](https://github.com/stanford-oval/storm)
* **GitHub Star:** 15\.7k
* 专注于高效的检索机制和生成过程。
* **适合**：需要快速和准确文本检索及响应生成的开发者和组织。
* **高度可配置的检索**：支持多种检索策略和嵌入模型。
* **优化生成**：与生成模型灵活集成，以提高响应质量。
* 在在线客户支持和智能助手中特别有用。
* 设计用于高性能和高效率，适合实时应用。
* **社区支持**：关注学术研究和实际应用。

## 4\. LLM\-App

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*SsSZp8rCYmvf1Umz.gif?output=gif&n=50)

* **URL**: [https://github.com/pathwaycom/llm\-app](https://github.com/pathwaycom/llm-app)
* **GitHub Star**: 11\.3k
* 综合工具链，用于文档解析、索引、检索和响应生成。
* **适合**：使用大型语言模型构建RAG应用的企业和开发者。
* **文档解析**：用于解析和预处理文档的工具。
* **索引**：支持各种文档存储解决方案。
* **检索和生成**：集成模块，实现高效检索和高质量响应生成。
* 用于法律、医疗和客户服务领域，构建问答系统和搜索引擎。
* 用户友好，提供详细的文档和示例，便于设置和使用。
* LLM\-App支持多种语言模型和文档存储解决方案，为RAG提供了平衡的解决方案。

## 5\. txtai

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*2t58B08UeFl1u42U.jpg)

* **URL**: <https://github.com/neuml/txtai>
* **GitHub Star:** 9\.8k
* 一体化平台，支持语义搜索、语言模型工作流和文档处理管道。
* **适合**：需要全面解决方案以应对多种AI任务的组织。
* **语义搜索**：使用嵌入式数据库进行高效的相似性搜索。
* **语言模型工作流**：与各种语言模型和AI服务的轻松集成。
* **文档处理**：支持多语言和多格式数据。
* 用于客户服务、内容推荐和数据分析。
* 高度集成且易于使用，适合小型和大型项目。
* 提供详细的文档和示例，帮助用户快速入门。

## 6\. R2R

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*S1gzUcNGpXKQ07Ni76iibw.png)

* **URL**: [https://github.com/SciPhi\-AI/R2R](https://github.com/SciPhi-AI/R2R)
* **GitHub Star**: 4\.3K
* 一个轻量级框架简化了检索到响应的过程。
* **多步骤检索与生成**: 优化中间步骤。
* **支持多种策略**: 灵活的检索和生成选项。
* 用于实时应用，如聊天机器人和即时问答系统。
* 快速高效，适合实时应用。
* R2R旨在减少推理延迟而不影响准确性。

## 7\. Cognita

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*jSgyfTWaAbazLDyd.png)

* **URL**: <https://github.com/truefoundry/cognita>
* **GitHub Star:** 3\.5K
* 旨在知识密集型应用，集成高效的文档管理和检索机制。
* **适合**：处理复杂知识图谱和问答系统的专业人士和组织。
* **多模态数据支持**：处理各种数据类型。
* **可定制索引**：灵活的索引方案。
* **强大的生成模型**：用于高质量响应的先进模型。
* 适用于医疗咨询和法律建议等应用。
* 可定制且灵活，适合需要深度知识管理的应用。
* 常见用途：Cognita用于适应性和精确性至关重要的大型项目。

## 8\. FlashRAG

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*DUIBTn1BzEjRMjZ5.gif?output=gif&n=50)

* **URL**: [https://github.com/RUC\-NLPIR/FlashRAG](https://github.com/RUC-NLPIR/FlashRAG)
* **GitHub Star**: 1\.6K
* 针对推理速度进行了优化，采用多种加速技术。
* **适合**：需要实时RAG应用的开发者和组织。
* **多种检索模型**：支持多种检索模型。
* **优化的重评分器**：用于改善文档排名的算法。
* **高效的生成器**：高性能的生成模型。
* 用于需要即时和准确响应的应用，如在线客户支持和智能助手。
* 快速且可靠，理想用于实时应用。
* FlashRAG旨在减少推理延迟而不影响准确性。

## 9\. Neurite

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*pnnqofg3mfwu07Vu)

* **URL**: <https://github.com/satellitecomponent/Neurite>
* **GitHub Star**: 1\.3K
* 结合神经网络技术与检索机制。
* **适合**：需要高精度和高性能的研究人员和组织。
* **深度学习模型**：支持多种神经网络模型。
* **高效向量检索**：针对大数据集进行了优化。
* **灵活的生成策略**：可适应的生成方法。
* 在科学研究和数据驱动的应用中尤为有用。
* 高精度和高性能，适合高级研究和数据分析。
* Neurite 提供了先进的功能，以提高检索和生成的准确性。

## 10\. Canopy

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*3sysrT5g7fsSyHjr.png)

* **URL**: [https://github.com/pinecone\-io/canopy](https://github.com/pinecone-io/canopy)
* GitHub Star: 990
* 模块化和递归，允许灵活组合组件。
* **适合**: 需要高度可定制的RAG系统的开发者和组织。
* **多步骤检索和生成**: 对模型的递归调用。
* **可定制组件**: 灵活性以定制系统。
* **强大的模型集成**: 支持广泛的模型。
* 适合企业级知识管理系统。
* 高度模块化和可定制，适合大规模项目。
* Canopy旨在处理复杂和动态数据，适合企业应用。

## 11\. EasyRAG

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*oA_JauclFDlAwwu5.png)

* URL: <https://github.com/BUAADreamer/EasyRAG>
* GitHub Star: 248
* EasyRAG旨在提高RAG系统的效率，特别是用于自动化网络操作。
* 非常适合希望自动化网络任务的开发者和组织，例如自动内容生成、网页爬虫、社交媒体分析等。
* 精简的RAG系统开发——EasyRAG通过提供用户友好的API和工具，简化了构建RAG系统的过程。
* 提高检索和生成效率：检索和生成的算法经过优化，以在处理大数据集时保持高效率。
* 多步骤检索和生成过程：这涉及一种结构化的数据处理方法，从双向稀疏检索开始进行初步排序，然后通过LLM重新排序进行微调，最后通过LLM生成优化答案，从而得到精确的结果。
* 该平台提供灵活的代码基础，支持多种检索和生成策略，允许用户定义流程。
* 主要利用BM25检索和BGE重新排序，无需对模型进行微调，确保低内存使用、易于部署和出色的可扩展性。

## 12\. TableRAG

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*bXPJfaikFG9dvllo.png)

* **URL**: [https://arxiv.org/html/2410\.04739v1](https://arxiv.org/html/2410.04739v1)
* TableRAG 专注于理解和生成与数百万个标记表格相关的任务，专门处理表格数据，使得对大规模数据集的理解和生成变得高效。
* 理想的场景包括大规模表格数据的处理，例如数据分析、报告生成和财务报表处理。
* 通过利用查询扩展和检索模式与单元格，它为语言模型提供关键信息，提高了生成的准确性和效率。
* 高效的检索和生成能力——这种方法显著缩短了提示长度，并最小化了丢失重要信息的风险。
* 多步骤检索和生成——该过程包括查询扩展、模式和单元格检索，以及 LLM 生成等步骤。
* 实验验证：使用 Arcade 和 BIRD-SQL 数据集创建了两百万个标记基准，以全面评估 TableRAG 在大规模应用中的有效性。

## 13\. 模块化 RAG

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*GWisxg8ssjlGHNnL.png)

* URL: [https://arxiv.org/html/2407\.21059v1](https://arxiv.org/html/2407.21059v1)
* 将 RAG 系统转变为类似 Lego 的可重配置框架。
* 适用于需要高灵活性和可定制性的 RAG 应用，适合企业中的知识管理系统、个性化推荐系统等。
* 多步骤检索和生成 — 模块化设计支持多步骤检索和生成的过程。
* 自定义组件 — 用户可以根据需要选择和配置各种组件，创建高度定制化的 RAG 系统。
* 非常适合大规模项目，提供灵活的解决方案。
* 模块化 RAG 能够管理复杂和动态的数据，特别适合企业应用中不断变化的数据环境。

## 14\. 投机性 RAG

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*3bmUR8yoYudN7JRH.png)

* URL: [https://arxiv.org/pdf/2407\.08223](https://arxiv.org/pdf/2407.08223)
* 它首先创建草稿，然后在生成过程中检索和优化这些草稿，从而提高了准确性和效率。
* 非常适合对高精度输出有要求的情况，如内容创作、基于知识的问答、技术文档生成等。
* 多步骤检索和生成 — 草稿最初被创建，随后在生成阶段进行检索和优化，增强了准确性和效率。
* 自定义组件 — 用户可以根据需要选择和配置各种组件，允许高度定制的 RAG 系统。
* 投机性 RAG 擅长处理复杂和不断变化的数据，特别适合企业应用中快速变化的数据环境。

## 15\. RAGAR

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*g2LUI2shqHvJ3Rn_.jpg)

* URL: [https://arxiv.org/html/2404\.12065v2](https://arxiv.org/html/2404.12065v2)
* RAGAR 集成了多模态数据与 RAG 技术，专门用于政治事实核查。
* 非常适合需要政治事实核查的环境，例如新闻机构、政府机构和政治研究机构。
* 多步骤检索和生成 — 通过合并多模态数据，RAGAR 实现了一个多步骤的检索和生成过程。
* 自定义组件 — 用户可以根据具体需求选择和配置各种组件，从而实现高度定制的 RAG 系统。
* RAGAR 能够管理复杂和不断变化的数据，使其在企业应用的快速数据环境中特别有效。

## 16\. 混合 RAG

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*g6A3NQ2k9qTfc1kh.png)

* **URL**: [https://arxiv.org/html/2404\.07220v1](https://arxiv.org/html/2404.07220v1)
* 混合 RAG 将语义搜索与混合查询检索器相结合，以提高检索的准确性和效率。
* 适用于需要处理大量长尾知识的情况，例如企业的内部知识库或专业领域的问答。
* 多步骤检索和生成 — 系统通过语义搜索和混合查询检索器实现多步骤的检索和生成过程。
* 自定义组件 — 用户可以根据特定需求选择和配置各种组件，从而实现高度定制的 RAG 系统。
* 混合 RAG 能够处理复杂和不断变化的数据，使其在企业应用的快速数据环境中特别有效。

## 17\. ARAGOG (ARAGOG — 高级检索增强生成输出评分)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*zqSaGL2SODaR4xMu.png)

* **URL**: [https://arxiv.org/html/2404\.01037v1](https://arxiv.org/html/2404.01037v1)
* 评估 RAG 系统生成的答案质量。
* 适用于需要对生成响应进行质量控制的应用，如教育、医疗和法律咨询。
* **多步骤检索和生成** — 该系统通过先进的输出评分实现多步骤的检索和生成过程。
* **自定义组件** — 用户可以根据具体需求选择和配置各种组件，从而实现高度定制化的 RAG 系统。
* ARAGOG 旨在管理复杂和动态的数据，特别适合企业应用中不断变化的数据环境。

## 18\. RAPTOR

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*VHAIpGwCqa1MepXY.jpg)

* 它通过递归方法提高了数据检索的效率和准确性。
* 非常适合处理层次化数据，如法律文件、公司记录、技术手册等。
* 该系统利用递归技术实现多步骤的检索和生成过程。
* 用户可以选择和配置各种组件，以创建高度定制化的RAG系统。
* RAPTOR旨在管理复杂和动态的数据，使其特别适合企业应用中不断发展的数据环境。

## 19\. LightRAG

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*XCP1w_oVPUtXGtdM)

* **URL**: [https://arxiv.org/pdf/2410\.05779](https://arxiv.org/pdf/2410.05779)
* 它利用图结构来提高检索过程的效率。
* 适合管理复杂查询和庞大数据集：例如，企业知识库、学术研究等。
* 多步骤检索和生成——双层检索系统实现了全面的多步骤检索和生成过程。
* 自定义组件——用户可以灵活选择和配置各种组件，以创建高度定制的RAG系统。
* LightRAG旨在处理复杂和不断发展的数据，特别适合企业应用中快速变化的数据环境。

## 20\. Invar\-RAG

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*q9RN4WmRW2OlHUMS.png)

* URL: [https://arxiv.org/html/2411\.07021v1](https://arxiv.org/html/2411.07021v1)
* 它通过不变对齐技术改进了检索和生成过程。
* 非常适合需要高精度生成和检索的应用，如知识密集型任务和专业领域问答。
* 多步骤检索和生成 — 不变对齐方法使得检索和生成可以采用多步骤的方法。
* 自定义组件 — 用户可以灵活选择和配置各种组件，以创建高度定制的RAG系统。
* Invar\-RAG能够管理复杂和动态的数据，使其特别适合企业应用中快速变化的数据环境。

## 21\. RankRAG

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*TQla2HSEl45sZyzoxEg99Q.png)

* **URL:** [https://arxiv.org/pdf/2407\.02485](https://arxiv.org/pdf/2407.02485)
* 它通过微调大型语言模型来处理检索和排名任务，从而简化了检索增强生成（RAG）流程。
* 适用于需要高性能和高效率的RAG应用，如企业内部知识库和专业问答系统。
* 多步骤检索和生成——微调方法使得能够执行多步骤的检索和生成过程。
* 自定义组件——用户可以根据自己的需求选择和配置各种组件，从而实现高度定制的RAG系统。
* RankRAG能够管理复杂和动态的数据，使其特别适合企业应用中不断变化的数据环境。

**References**

## 如果你觉得我的文章有帮助或实用，请考虑请我喝杯咖啡，以支持我的工作或给予我赞助😊，使用以下链接

[**Patreon**](https://www.patreon.com/jinlowmedium)

[**Ko\-fi.com**](https://ko-fi.com/jinlowmedium)

[**buymeacoffee**](https://www.buymeacoffee.com/jinlowmedium)

*最后，如果你还不是 Medium 会员并计划成为会员，我恳请你使用以下链接注册。我将以无额外费用的方式获得你会员费的一部分。*

我很高兴地宣布即将推出我的 Substack 新闻通讯，我将深入探讨我的投资系统，利用 IT 技术的巨大潜力，并采用系统思维的方法来制定投资策略。请放心，当灵感来袭时，我仍会继续发帖。

