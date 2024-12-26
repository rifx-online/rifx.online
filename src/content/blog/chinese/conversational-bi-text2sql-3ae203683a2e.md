---
title: "对话式商业智能：Text2SQL 的挑战与解决方案"
meta_title: "对话式商业智能：Text2SQL 的挑战与解决方案"
description: "对话式商业智能（BI）通过自然语言查询SQL数据库的能力正在迅速发展。Text2SQL技术面临将自然语言查询准确转换为SQL查询的挑战，尤其是在复杂查询和数据库架构理解方面。Snowflake的Cortex Analyst通过用户意图验证、轻量级语义模型和灵活的LLM选择，提供了一种有效的对话式BI解决方案，提升了查询的准确性和用户体验。"
date: 2024-12-26T04:30:18Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*kpV1Y-JzwIz7GQ5s.png"
categories: ["Natural Language Processing", "Programming/Scripting", "Data Science"]
author: "Rifx.Online"
tags: ["Conversational", "Text2SQL", "Snowflake", "Cortex", "Analyst"]
draft: False

---



### 用自然语言查询 SQL 数据库/数据仓库的艺术

## 介绍

BI的未来是对话式的

— 这是Gartner和其他分析师在过去几年中告诉我们的。对话式BI在赋能业务用户自主查询数据存储（使用自然语言）方面具有巨大的潜力，无需依赖数据工程团队。随着大型语言模型（LLMs）的出现，我们似乎已经达到了一个转折点。让我们首先了解实现Text2SQL的挑战。

### Text2SQL 挑战

让我们关注结构化数据，确切地说是关系数据。这构成了大多数商业智能（BI）世界的基础存储格式，无论您是交互式查询数据库还是数据仓库，还是构建仪表板/报告，与此类存储平台交互的主要语言是 SQL。

> 在本文中，我们讨论的是将自然语言查询（NLQ）转换为结构化查询语言（SQL），也称为数据库的自然语言接口（NLIDB），或 Text2SQL。

例如，让我们考虑一个*国家*表，其中包含语言和人口详细信息——以下是示例架构：

**国家表**: 国家 ID \| 名称 \| 语言 \| 人口计数 NLQ1: *哪个国家的人口最多？* SQL1: *从国家中选择名称，最大（\[人口计数]）；*

在大多数自然语言问答系统 \[1] 的核心，是一个自然语言理解单元（NLU）模块，它试图通过提取和分类“话语”来理解 NLQ 的意图。简单来说，可以将话语视为句子中的关键短语，例如 *国家、最大、人口、计数*。



下一步是根据这些信息生成相应的 SQL 查询。因此，我们需要一种转换/映射逻辑，将 *“国家”映射到“国家”表（要查询的表），将“最大”映射到 MAX SQL 函数，将“人口计数”映射到列“人口计数”。* 而这正是事情开始变得具有挑战性的地方。

> 将 NLQ 话语映射到正确的 SQL 操作符，尤其是在确定某个话语是否对应于表、列、主键/外键、SQL 操作符时——并非简单。

例如，如果没有对数据库架构的内在知识，映射逻辑很难确定在这种情况下“计数”是指列“人口计数”，而不是 SQL 函数 COUNT。对于复杂查询，这个问题会更加严重，例如，

NLQ2: *哪种语言被最多国家使用？*

其 SQL 转换将涉及两个 SQL 函数：MAX 和 COUNT。其他复杂查询的例子包括需要连接多个表的场景。

## NLQ — SQL 翻译深入探讨

在本节中，我们将深入探讨问题领域，反思现有文献/方法，以理解所涉及的技术挑战。

在该领域主要参考两个基准数据集：

* [WikiSQL](https://github.com/salesforce/WikiSQL)：是一个用于开发自然语言接口的大型注释语料库，随论文\[2\]一起引入。
* [Spider](https://yale-lily.github.io/spider) 是一个大规模注释的语义解析和文本到SQL的数据集。[SParC](https://yale-lily.github.io/sparc) 是Spider的上下文依赖/多轮版本，而[CoSQL](https://yale-lily.github.io/cosql) 是Spider和SParC数据集的对话版本。有关详细讨论，请参阅附带的论文\[3\]。

正如Spider在其介绍文本中强调的，任何NLIDB解决方案不仅需要理解底层数据库架构，而且*还应能够推广到新的架构*。推广挑战在于（a）对语义解析器进行数据库架构编码，以及（b）建模数据库列、键与给定NLQ中提及的内容之间的对齐关系\[4\]。

在此背景下，让我们看看一些尝试将（缺失的）数据库架构知识编码到神经网络中的工作。*有向图是编码数据库架构关系的流行形式。* \[4\] 提出了一个统一框架，以解决架构编码、链接和特征表示在文本到SQL编码器中的问题。\[5\] 使用图神经网络对数据库架构进行编码，该表示在编码和解码时都用于编码器-解码器语义解析器。\[6\] 提出了一个数据库架构交互图编码器，以利用数据库架构项的历史信息。在解码阶段，使用门机制来权衡不同词汇的重要性，然后预测SQL标记。

预训练的大型语言模型\[7\]作为文本到SQL生成器在一定程度上有所帮助，特别是在通过利用注意机制\[8\]对表和列名称进行编码方面。然而，它们在复杂SQL操作的架构关系上仍然存在困难。有关Text2SQL中涉及的挑战的良好总结，请参阅\[9\]，以及研究社区如何尝试解决这些问题。

CHASE-SQL \[10\] 与Gemini目前在著名的BIRD（BIg Bench for LaRge-scale Database Grounded Text-to-SQL Evaluation）[leaderboard](https://bird-bench.github.io/)上保持当前#1的位置（在撰写本文时），测试执行准确率为73%。它利用LLMs的内在知识通过以下方式生成多样化的候选项：(1) 一种分而治之的方法，将复杂查询分解为在单个LLM调用中可管理的子查询，(2) 基于查询执行规划的思维链（CoT）推理，以及(3) 一种独特的实例感知合成示例生成技术。

> 这些论文在嵌入数据库架构方面显示了显著进展，然而，它们仍然特定于所考虑的数据集；并且在新的领域/架构中推广效果不佳。

## Snowflake 的 Cortex Analyst

Snowflake 采取了非常 **以用户为中心的视角**，通过以下三个差异化特性无缝地支持 BI 对话：

* 用户意图验证和查询解释
* 轻量级语义模型
* 对底层 LLM 的灵活性

Cortex Analyst 与 Cortex Copilot 一起，是 Snowflake 最新加入其 Cortex 生成 AI 平台的功能——提供对话式 BI 能力。虽然 Cortex Copilot 更加面向开发者，但 Cortex Analyst 是我们在本文中关注的对象，主要针对商业用户。

进一步来说，Cortex Analyst 实际上是一个端到端的文本到答案解决方案，因为它也返回生成的 SQL，从而提供最终的查询响应。它的部署非常简单——作为 API 可用，Snowflake 还提供了一个简单的 Streamlit 应用程序，只需几行代码即可部署。因此，部署和试用都非常方便。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*Ne-y66hviwm73wx2)

我们都知道 LLM 会产生幻觉，因此首先（也是最好的）事情是与用户验证 **系统对给定查询的理解**——在响应最终答案之前。Cortex Analyst 通过以下方式实现这一点：

* 与用户进行对话，对于任何给定的查询，它首先向用户展示对查询的理解，并解释它是如何生成 SQL 查询的。
* 此外，它还提供建议，以在存在歧义的情况下使查询更加具体——如下面的图所示。

> 这种用户验证有助于显著提高最终答案的正确性和准确性。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*hkWtfazrF1LE3HYt)

其次，Cortex Analyst 通过 **语义模型** 解决了之前提到的数据存储库元数据映射问题。

> 语义模型是将用户使用的领域或业务特定术语映射到数据库模式的桥梁。

这些额外的语义细节，如更具描述性的名称或同义词，使 Cortex Analyst 能够更可靠地回答自然语言查询。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*hwL-ddQ5vCjE-uXa)

总体而言，语义模型可以被视为提供物理数据库表或视图简化视图的逻辑层。Snowflake 利用生成器 [工具](https://github.com/Snowflake-Labs/semantic-model-generator) 使创建语义模型变得非常简单，并存储在易于访问的 YAML 文件中。

> 此外，语义模型还允许存储查询。

这充当了一个经过验证的查询存储库 (**VQR**)，捕获过去正确工作的用户查询——提供一个查询缓存，进一步提高结果的准确性和可信度。

考虑到企业数据库的复杂性以及随之而来的编码难度，我们还可以将模型生成器工具视为一个 **元数据机器人**，为用户提供一个问答系统，以捕获有关底层模式的信息，例如，“哪个表包含瑞士的销售数据？”以及 SQL 操作符的自动完成逻辑，例如，“我们是否有德国和西班牙的销售数据在一个表中？”通过对相应表的连接/过滤来回答。

最后，让我们深入探讨 Snowflake 在选择支持 Cortex Analyst 的底层 LLM 方面提供的灵活性。众所周知，LLM 的格局和排名持续演变，不断推出新的（更强大的）LLM。因此，在如此快速发展的技术环境中，选择至关重要。默认情况下，Cortex Analyst 利用 **Snowflake 托管的 Cortex LLM**，这些模型经过大量微调，专门用于文本到 SQL 生成任务，是目前最强大的 LLM 之一。然而，也可以明确选择允许 Cortex Analyst 使用由 Microsoft Azure 托管的最新 OpenAI GPT 模型，和 Snowflake 托管的模型一起使用。

> 在运行时，Cortex Analyst 将选择最优的模型组合，以确保对每个查询的最高准确性和性能。

总之， [Cortex Analyst](https://www.snowflake.com/en/blog/cortex-analyst-ai-self-service-analytics/) 是一个非常有前景的对话式 BI 助手，今天就可以使用（公开预览）。

## 参考文献

1. D. Biswas. *聊天机器人与自然语言搜索*. Towards Data Science, [https://towardsdatascience.com/chatbots\-natural\-language\-search\-cc097f671b2b](https://towardsdatascience.com/chatbots-natural-language-search-cc097f671b2b)
2. Victor Zhong, Caiming Xiong, 和 Richard Socher. 2017\. *Seq2SQL：使用强化学习从自然语言生成结构化查询*. [https://arxiv.org/abs/1709\.00103](https://arxiv.org/abs/1709.00103)
3. Tao Yu, 等. 2018\. *Spider：一个大规模人类标注的数据集，用于复杂和跨领域的语义解析和文本到SQL任务*. [https://arxiv.org/abs/1809\.08887](https://arxiv.org/abs/1809.08887)
4. Bailin Wang, 等. 2020\. *RAT\-SQL：面向文本到SQL解析器的关系感知模式编码和链接*. 在第58届计算语言学协会年会论文集中. [https://doi.org/10\.18653/v1/](https://doi.org/10.18653/v1/) 2020\.acl\-main.677
5. Ben Bogin, Matt Gardner, Jonathan Berant (2019\). *使用图神经网络表示模式结构以进行文本到SQL解析*. ACL, [https://arxiv.org/pdf/1905\.06241\.pdf](https://arxiv.org/pdf/1905.06241.pdf)
6. Yitao Cai 和 Xiaojun Wan. 2020\. *IGSQL：基于数据库模式交互图的上下文相关文本到SQL生成的神经模型*. 在2020年自然语言处理实证方法会议（EMNLP）论文集中, [https://aclanthology.org/2020\.emnlp\-main.560\.pdf](https://aclanthology.org/2020.emnlp-main.560.pdf)
7. Lin, X.V., Socher, R., \& Xiong, C. (2020\). *为跨领域文本到SQL语义解析架起文本和表格数据的桥梁*. *发现*. [https://arxiv.org/abs/2012\.12627](https://arxiv.org/abs/2012.12627)
8. Bahdanau, Dzmitry, Kyunghyun Cho 和 Yoshua Bengio. *通过联合学习对齐和翻译的神经机器翻译*. [https://arxiv.org/pdf/1409\.0473\.pdf](https://arxiv.org/pdf/1409.0473.pdf)
9. A. Floratou, 等. *NL2SQL是一个已解决的问题……不是*!, CIDR 2024, [https://www.cidrdb.org/cidr2024/papers/p74\-floratou.pdf](https://www.cidrdb.org/cidr2024/papers/p74-floratou.pdf)
10. M. Pourreza, 等. *CHASE\-SQL：文本到SQL中的多路径推理和偏好优化候选选择* (2024\), [https://arxiv.org/html/2410\.01943v1](https://arxiv.org/html/2410.01943v1)

