---
title: "面向真实世界应用的高级代理人工智能设计考虑因素"
meta_title: "面向真实世界应用的高级代理人工智能设计考虑因素"
description: "本文探讨了高级代理人工智能在现实应用中的设计考虑，特别是如何通过代理、工具、记忆和规划机制创建智能工作流。比较了三种实现方式（CODE1、CODE2和CODE5），强调了它们在非结构化数据处理、数据整合和元数据管理中的不同方法。CODE1采用结构化代理，适合静态工作流程；CODE2利用LangChain实现动态适应性；CODE5结合两者的优点，实现可扩展和透明的系统。文章指出，设计有效的代理AI系统需平衡结构性与适应性，以满足现代需求。"
date: 2024-11-25T15:00:22Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*YmUitsAGa-VCjtPEdCzbDQ.png"
categories: ["Programming", "Machine Learning", "Data Science"]
author: "Rifx.Online"
tags: ["modular", "agents", "unstructured", "integration", "LLMs"]
draft: False

---



**从基于课堂的代理到语言链代理**

随着人工智能（AI）系统的发展，**代理人工智能**的概念——即由模块化、特定任务的代理协作工作的AI系统——已成为可扩展和可适应AI解决方案的基石。本文探讨了代理人工智能背后的设计考虑，研究了代理、工具、记忆、状态和规划如何结合在一起创造智能工作流。我们将比较三种实现——**CODE1**、**CODE2**和**CODE5**——以揭示其中的实用性和复杂性。



**架构 1**、**架构 2**和**架构 3**分别映射到**CODE1**、**CODE2**和**CODE5**。

代码可以在[这里](https://github.com/Karindraj/Agents/blob/main/Advanced%20Multi%20AGent%20system.ipynb)找到。

## 目标

提供的代码的主要目标是自动化和简化从非结构化文本评论中提取、转换和整合结构化数据的过程，以便将其转换为可用于进一步分析的格式。具体而言，此工作流程解决了从客户评论中提取实体的问题，将提取的实体与现有的结构化数据集关联，并将两者结合以进行全面的数据分析。

所解决的问题涉及三个关键挑战：

1. **非结构化数据处理**：客户评论通常包含埋藏在自然语言文本中的有价值信息。从这些评论中提取客户姓名和购买日期等结构化数据对于丰富现有数据集至关重要。
2. **数据整合**：在提取相关信息后，将其与结构化数据集（例如，客户交易记录）整合，以确保分析数据的统一和全面视图。
3. **自动化元数据管理**：该解决方案不仅提取和整合数据，还生成并存储结构化和非结构化数据集的元数据。这有助于更深入地理解数据，例如其统计属性和潜在质量问题。

## 任务

* **ColumnNameAgent**: 解析列名和描述对，形成结构化字典。
* **ChainCreationAgent**: 使用 LangChain 和本地 LLM 设置链，以对评论文本执行命名实体识别（NER）。
* **EntityExtractionAgent**: 应用链从数据集中提取非结构化文本中的实体。
* **DataCombinationAgent**: 将提取的实体与现有数据集结合，创建丰富的数据集。
* **DatabaseAgent**: 将合并的数据存储到 SQLite 数据库中，以便进一步访问。
* **MetadataExtractionAgent**: 提取元数据，如列详细信息和数据统计，用于分析。

通过利用先进的语言模型、数据库管理和结构化工作流程，这段代码使企业能够自动化和优化其数据处理管道，减少手动工作，并确保决策所需的数据集成的持续性和准确性。

## 全球代理在智能代理中的作用

全球代理是智能代理系统中的核心协调者，确保工作流程的顺利执行，协调代理或工具，并根据系统状态动态调整。下面，我们将探讨它们在 **CODE1**、**CODE2** 和 **CODE5** 中的作用。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*QAp-E3afHxOBmEZDfiVwOA.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*8u6wYJ9fHD-I4SWyBlC7WA.png)

### 编排

Global Agent 的主要角色是管理任务执行的顺序。

* **CODE1**: Global Agent 明确地通过顺序调用 `ColumnNameAgent`、`ChainCreationAgent` 和其他代理来编排预定义的工作流。每个代理都是硬编码的，以线性方式执行特定任务。
* **CODE2**: Global Agent 利用 LangChain 的推理驱动动态执行，而不是显式编排。工具根据输入、观察和自定义提示 (`ZERO_SHOT_REACT_DESCRIPTION`) 进行自适应调用。
* **CODE5**: 将结构化工作流的显式编排与动态 LangChain 工具相结合。Global Agent 协调显式代理和工具，以便进行混合工作流执行。

### 监控

监控工作流程的进展和状态对于可靠性和调试至关重要。

* **CODE1**: The Global Agent performs basic monitoring by tracking which agent is active and updating the state explicitly after each task.
* **CODE2**: Monitoring is less explicit, as LangChain’s agent inherently handles observation and reasoning between tasks. The Global Agent primarily ensures the dynamic flow of tool execution.
* **CODE5**: Integrates both explicit and implicit monitoring. Structured agents track progress in explicit workflows, while LangChain tools provide reasoning and feedback in adaptive workflows.

### 错误处理

Global Agents 在处理错误和确保任务完成方面发挥着关键作用。

* **CODE1**: 基本的错误处理依赖于嵌入在工作流中的重试逻辑。如果代理失败，Global Agent 可能会尝试在指定的限制内重新执行任务。
* **CODE2**: LangChain 的内存和推理框架简化了错误处理。持久状态允许 Global Agent 无缝重试工具，而无需明确的逻辑。
* **CODE5**: 将显式代理的结构化重试逻辑与 LangChain 对工具的强大错误处理相结合。这种混合方法确保了静态和动态工作流的韧性。

### 适应性

Global Agent 动态确定下一步或基于预定义规则。

* **CODE1**: 限制适应性，因为工作流程是硬编码的，遵循静态顺序。
* **CODE2**: 完全适应，通过 LangChain 的动态推理。Global Agent 根据上下文和自定义提示选择工具。
* **CODE5**: 部分适应。结构化工作流程提供可预测的行为，而 LangChain 工具增加了处理多样输入的灵活性。

## 代理和工具在自主AI系统中的作用

在自主AI系统的核心是**代理**和**工具**，它们模块化功能以应对特定任务。代理是能够独立决策的实体，而工具则作为功能性实用程序，由代理调用以执行明确定义的任务。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*B8UPcAuKo9BzaX_N1xgSMg.png)

## 代理和工具在代码中的应用

**CODE1**: 特性 **6 个基于类的代理**：

* `ColumnNameAgent`, `ChainCreationAgent`, `EntityExtractionAgent`, `DataCombinationAgent`, `DatabaseAgent`, 和 `MetadataExtractionAgent`。
* 这些代理在预定义的顺序工作流中工作。

**CODE2**: 引入了 **基于 LangChain 的方法**：

* **5 个工具** 替代了显式代理：`ColumnNameExtraction`, `ChainCreation`, `EntityExtraction`, `DataCombination`, 和 `MetadataExtraction`。
* 这些工具在 LangChain 的 `ZERO_SHOT_REACT_DESCRIPTION` 代理的指导下动态运作。

**CODE5**: 结合 **6 个显式代理** 和 **5 个工具**：

* 显式代理处理工作流编排（`execute_column_name_agent` 等）。
* 工具在任务执行时动态调用，融合了结构化和自适应的方法。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*WnBome-XicV1iXrJIiiPWA.png)

在代理和工具之间的选择往往取决于所需的模块化和适应性之间的平衡。

## 自定义提示和 ‘ZERO\_SHOT\_REACT\_DESCRIPTION’

自定义提示对于推理至关重要，使代理能够遵循 **“思考 → 行动 → 行动输入 → 观察 → 最终答案”** 框架。LangChain 中的 `ZERO_SHOT_REACT_DESCRIPTION` 方法利用该框架根据输入上下文和观察动态决定调用哪个工具。这使得系统能够灵活适应多种场景，而无需重新训练。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*0Pkg_QXhUYx3evLM8RyYeQ.png)

* **CODE1**: 不使用 `ZERO_SHOT_REACT_DESCRIPTION`，依赖静态工作流程。
* **CODE2**: 完全利用 `ZERO_SHOT_REACT_DESCRIPTION` 进行动态和推理驱动的工具选择。
* **CODE5**: 结合了两者的优点，使用 `ZERO_SHOT_REACT_DESCRIPTION` 进行工具选择，同时保持明确的基于代理的工作流程。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*P8zLehjDJcHCzP37PnCpvA.png)

## 状态管理

代理和工具依赖于共享状态来跟踪进展、中间结果和工作流上下文。在像 **CODE1** 这样的结构化系统中，状态是明确定义的（例如，`GraphState`）并手动更新。像 **CODE2** 和 **CODE5** 这样的动态系统在工具执行过程中使用 LangChain 的 `StatefulMemory` 来隐式处理状态。

## 内存类

一个专用的内存类（例如，`StatefulMemory`）提供了一种持久化和集中化的方式来存储、更新和检索状态变量。虽然 **CODE1** 缺乏这一点，但 **CODE2** 和 **CODE5** 使用 `StatefulMemory` 进行动态更新，确保状态在重试和工作流中始终保持一致。

## 状态变量

结构化系统中的显式变量跟踪预定义的工作流程（例如，**CODE1** 中的 `column_names`、`chain`、`metadata`）。动态系统允许工具根据观察更新变量，以适应变化的输入。

## 状态的动态性

结构化代理遵循固定的状态转移，而动态系统中的工具则以自适应的方式与状态交互，如在 **CODE2** 和 **CODE5** 中所示。

## 持久性

内存确保状态在工具执行之外得以持久化，从而支持重试和错误恢复。

## 错误处理

动态状态系统本质上更好地管理错误，因为持久内存和重试机制维护了工作流程的完整性，而静态系统则需要明确的错误处理逻辑。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*QljQDEvsObGe_GXIyguKiw.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*GxoNPp5gYWzrCGL7WgkybA.png)

## 行动与计划在代理人工智能中的应用

在代理人工智能中，**行动**和**计划机制**是推动任务执行和优化工作流程的基本要素，使系统高效、适应性强且具有弹性。让我们通过代码中的示例更详细地探讨这些内容。

## 行动：代理行为的核心

**什么是行动？**

* 行动是代理行为的基本单位。它们代表特定的操作，例如调用工具、运行方法或执行预定义任务。
* 行动连接决策（代理的推理）和执行（调用工具或方法）。

**关键特征**：

1. **任务特定**：行动旨在处理特定任务，如提取实体、合并数据或创建链。
2. **动态执行**：在CODE2和CODE5等系统中，行动是根据系统的推理或状态动态选择的。
3. **工具调用**：行动通常涉及调用工具，例如`ChainCreation`工具，该工具在CODE2中构建命名实体识别（NER）管道。

**来自CODE2的示例**：

* **思考**：“我需要为列名创建一个NER链。”
* **行动**：调用`ChainCreation`工具。
* **行动输入**：包含描述的列名列表，例如`{"CustomerName": "<Name of customer>", "PurchaseDate": "<Date of purchase>"}`。
* **观察**：成功创建的NER链，准备使用。

这种基于行动的模块化允许灵活性，因为代理可以专注于“决定做什么”，而工具则执行实际任务。

## 规划机制：优化工作流程

**代理人工智能中的规划是什么？** 规划是指对行动进行排序和组织的过程，以确保任务的高效执行。有效的规划确保代理以正确的顺序执行正确的行动，优雅地处理错误，并适应不断变化的场景。

**规划的关键目标**：

**提高效率的排序**：

* 规划确保行动以逻辑顺序执行，以最小化冗余计算。
* 示例：在 CODE1 中，`DataCombinationAgent` 在逻辑上跟随 `EntityExtractionAgent`，因为它依赖于提取的数据。

**错误恢复**：

* 一个良好规划的系统能够预见潜在错误，并包含重试或替代路径。
* 示例：在 CODE5 中，重试机制既用于显式代理（通过手动逻辑）也用于工具（通过 LangChain 内存）。

**结合结构化与自适应规划**：

* 结构化规划：预定义的工作流程，如 CODE1 中，代理的顺序是硬编码的。
* 自适应规划：动态决策，如 CODE2 和 CODE5 中，行动是基于推理选择的。
* 混合规划：CODE5 通过对显式代理使用结构化工作流程，对工具使用自适应规划来体现这一点。

## CODE5中的规划示例

**结构化工作流程**：

* `Global Agent`以固定顺序调用显式代理（`execute_column_name_agent`、`execute_chain_creation_agent`等）。
* 这确保了对具有依赖关系的任务的可预测执行。

**动态规划**：

* 对于像`ChainCreation`这样的工具，规划动态选择适当的工具，基于状态和推理。
* 例子：如果系统遇到意外数据，它可能会动态调整以调用`MetadataExtraction`以获取额外的上下文。

**规划中的错误处理**：

* 如果像`EntityExtraction`这样的任务失败，系统会使用LangChain的内存或预定义的重试逻辑进行重试。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*FP_PlCtUtV9lSCt9dQh4mg.png)

## 比较 CODE1、CODE2 和 CODE5

## CODE1: 结构化方法

* **设计**：依赖于 **基于类的代理** 和由 **全局代理** 协调的预定义工作流程。
* **优点**：
* 透明且易于调试。
* 适用于具有可预测任务序列的静态工作流程。
* **局限性**：
* 缺乏动态适应性。
* 与 LangChain 的推理基础工具选择没有集成。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*FP_PlCtUtV9lSCt9dQh4mg.png)

## CODE2: 使用 LangChain 的动态灵活性

* **设计**：利用 LangChain 的工具和记忆，启用动态的、基于推理的方法。
* **优点**：
* 高度灵活，能够根据输入和状态动态选择工具。
* 使用 **自定义提示** 进行推理，利用 `ZERO_SHOT_REACT_DESCRIPTION` 代理类型。
* **局限性**：
* 严重依赖 LangChain。
* 略显抽象，使调试相较于 CODE1 更复杂。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*R5kyDbE7vu_lL_sVHwgshA.png)

## CODE5: 混合设计以实现可扩展性

* **设计**：结合了CODE1的结构化方法与CODE2的动态灵活性。
* **优点**：
* 显式代理确保结构化工作流程，而LangChain工具提供适应性。
* 适用于需要透明性和灵活性的可扩展系统。
* **局限性**：
* 静态与动态组件融合的复杂性。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*CcgOyzbu6qgmAJl_1lHzvQ.png)

**CODE1**：

* 将所有任务实现为显式的基于类的代理，按照预定义工作流程顺序执行。
* 代理直接更新共享的`GraphState`。

**CODE2**：

* 所有任务被转换为**LangChain工具**，通过`ZERO_SHOT_REACT_DESCRIPTION`推理框架动态调用。
* 依赖内存来维护状态和无缝调用工具。

**CODE5**：

* 使用显式代理进行工作流程编排，同时依赖LangChain工具执行任务。
* 结合了CODE1的结构化工作流程和CODE2的动态适应性。

该表突出显示了从**CODE1**的静态结构化方法到**CODE2**的完全动态工具中心实现的演变，最终到达**CODE5**的混合模型。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*WcN6h2qO7nws2sTI7CgDqA.png)

## 将基于类的代理转换为 LangChain 工具

基于类的代理，如在结构化系统 **CODE1** 中所见，是明确定义的实体，按顺序执行特定任务。它们为工作流程提供清晰、模块化的逻辑，使其非常适合具有可预测任务流的静态系统。然而，这种方法需要手动更新状态和明确的调度，限制了适应性。将这些代理转换为 LangChain 工具涉及模块化其功能，并利用 LangChain 的动态执行框架。每个任务都成为一个可调用的工具，具有定义的输入-输出模式，能够在运行时无缝调用。例如，`ColumnNameAgent` 可以转换为一个 `ColumnNameExtraction` 工具，该工具以列描述符作为输入，并返回一个结构化字典。

LangChain 工具通过与 **reasoning agents**（如 `ZERO_SHOT_REACT_DESCRIPTION`）集成增加了灵活性，这些代理根据输入上下文和状态动态选择和执行工具。这些推理代理取代了硬编码工作流程的需求，使动态规划和执行成为可能。此外，LangChain 的内存（例如 `StatefulMemory`）简化了状态管理，确保持久性和一致性，而无需显式更新。最终系统，如 **CODE2** 和 **CODE5** 所示，平衡了模块化和适应性。通过从基于类的代理过渡到 LangChain 工具和推理代理，工作流程变得更加可扩展和稳健，能够以最小的手动干预处理多样化和复杂的输入。

## 结构化、非结构化和向量数据库在自主智能系统中的角色

在图表和工作流程的背景下，每种类型的数据库扮演着独特但相互关联的角色：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Nizawk5n8yumdqpYzxM4nA.png)

## 1\. 结构化数据

**定义**：

* **结构化数据** 是高度组织化并以表格格式存储的数据，例如关系数据库（如 PostgreSQL、MySQL）。示例包括客户记录、交易日志和库存表。

**作用**：

* **查询与检索**：**全球代理** 访问结构化数据库以检索预先组织好的数据，用于匹配、聚合或报告等任务。
* **基础知识**：作为确定性查询的基础层，例如“哪个客户购买了特定产品？”或“总销售额是多少？”
* **集成**：这些数据可以直接用于下游任务，例如与提取的实体合并或在 LLM 处理期间用作参考数据。

**示例用法**：

* 结构化数据库可能存储客户购买历史 (`CustomerName`, `PurchaseDate`)，这些数据被检索并与提取的非结构化数据结合，以进行全面分析。

## 2\. 非结构化数据

**定义**：

* **非结构化数据**包括存储在基于文档或NoSQL数据库（如Elasticsearch、MongoDB或文件库）中的文本、图像或音频数据。示例包括客户评论、电子邮件和社交媒体帖子。

**角色**：

* **LLM的输入**：作为**LLM**的原始输入，处理数据以执行摘要、命名实体识别（NER）或情感分析等任务。
* **实体提取**：提取的实体（例如，姓名、日期或情感）可以被结构化并与结构化数据库合并，以提供更丰富的见解。
* **搜索与检索**：提供全文搜索功能，以定位与任务相关的特定文档或短语。

**示例使用**：

* 一个客户评论数据库被输入到**LLM**中，提取出结构化实体如`CustomerName`和`Sentiment`以便进一步处理。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*XCcn8QIzeuQ_7567uyftzg.png)

## 3\. 向量数据库

**定义**：

* **向量数据库**（例如，Pinecone、Weaviate或Milvus）存储数据的向量化表示（嵌入），使相似性搜索和语义查询成为可能。示例包括产品描述、客户评论或常见问题文档的嵌入。

**角色**：

* **上下文检索的记忆**：作为外部记忆，允许代理通过对向量化数据进行相似性搜索来检索相关上下文。
* **语义匹配**：促进高级查询，例如“查找与此相似的评论”或“检索此客户的相似交易”。
* **集成**：通常通过存储非结构化数据的嵌入来补充非结构化数据，从而在推理任务期间实现快速查找。

**示例用法**：

* 客户评论被向量化，存储在向量数据库中，并在LLM查询期间检索，以为特定客户或情感模式提供上下文信息。

## 比较角色

**类型存储主要角色示例结构化数据**关系数据库（SQL）查询精确的、预先组织的信息。从 `Customer` 和 `Orders` 表中检索客户的所有购买记录以进行分析。**非结构化数据**基于文档（NoSQL，文本）提供原始输入以供 LLM 或全文搜索功能使用。分析存储在 NoSQL 数据库中的客户评论，以提取情感或命名实体等见解。**向量数据**向量化嵌入存储语义检索和相似性搜索。通过对存储在向量数据库中的向量嵌入执行余弦相似性搜索，检索具有相似情感或语调的评论。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*WuAbsY2WyV3ujrP5akOXOw.png)

## 它们如何协同工作

**输入**：

* **结构化数据**：提供核心参考或关系数据。
* **非结构化数据**：提供丰富的自由形式内容，以补充结构化数据。

**处理**：

* **非结构化数据** 通过 **LLM** 进行特征提取或语义理解。
* 提取的实体与结构化数据合并，以形成丰富的数据集。

**检索**：

* **向量数据库** 通过存储嵌入，支持高级检索，使上下文和基于相似度的搜索成为可能。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*DdPb4CABWa5yOquvwvwZng.png)

## LLM在架构1、2和3中的作用（原CODE1、CODE2、CODE5\）

最后但并非最不重要的是，像L**lama**这样的大型语言模型（LLMs）在推动架构1、2和3中的推理、适应性和自动化方面发挥着关键作用。它们的集成增强了处理自然语言输入、提取洞察力和动态决策的能力。

**架构1 (CODE1\)**：

* LLM在`ChainCreationAgent`等代理中被明确使用，以建立命名实体识别（NER）管道。
* 代理依赖预定义的提示和工作流程来调用LLM，从非结构化数据中提取实体，例如评论文本。
* 尽管LLM在任务执行中表现良好，但集成较为僵化，对变化的上下文适应性有限。

**架构2 (CODE2\)**：

* LLM通过LangChain工具如`ChainCreation`和`EntityExtraction`动态利用。
* 使用`ZERO_SHOT_REACT_DESCRIPTION`，LLM针对任务进行推理并决定调用哪个工具，以适应各种输入。
* 这种方法最大化了灵活性，使系统能够处理未预见的场景，而无需预定义的工作流程。

**架构3 (CODE5\)**：

* 将显式代理与由LLM驱动的工具结合，实现了混合模型。
* LLM通过工具动态调用，并明确集成到代理中，以实现结构化工作流程，确保可扩展性和灵活性。

在所有架构中，LLM使系统能够处理自然语言、提取洞察力并动态适应现实世界的任务。

## 结论

设计强健的代理 AI 系统需要平衡结构性、适应性和可扩展性，以满足现代工作流程的需求。**CODE1**、**CODE2** 和 **CODE5** 突出了实现这些系统的不同方法，展示了代理、工具、记忆和规划机制如何针对多种场景进行定制。

**CODE1** 展示了使用显式代理的结构化工作流程的价值。这种方法透明、可预测且易于调试，非常适合具有明确顺序的任务。然而，它的适应性不足限制了其在动态环境中的应用。

另一方面，**CODE2** 则拥抱灵活性和推理。通过利用 LangChain 的工具和 `ZERO_SHOT_REACT_DESCRIPTION`，它根据上下文动态选择工具，使系统能够适应不同的输入和场景。这种适应性虽然强大，但由于其抽象的逻辑，可能使调试变得更加复杂。

**CODE5** 结合了两种方法的优势，创建了一个混合系统。它为结构化任务使用显式代理，并为动态适应性使用 LangChain 工具，在复杂工作流程中提供可扩展性和透明性。

随着代理 AI 的不断发展，整合结构化规划、动态推理和高效状态管理将仍然是关键。像 **CODE5** 这样的系统提供了一个视角，展示了这些原则如何协同工作，以创建智能、可扩展和面向未来的 AI 解决方案。

