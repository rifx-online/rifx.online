---
title: "从自然语言到 SQL 生成的代理反射"
meta_title: "从自然语言到 SQL 生成的代理反射"
description: "本文讨论了一种通过代理反思提高自然语言到SQL（NL2SQL）生成准确性的方法。该方法超越了传统的单次生成流程，采用迭代工作流程，允许对初始生成的SQL进行验证和修正。通过使用生成式AI模型，本文展示了在实际业务场景中，利用反思代理实现超过90%的SQL生成准确率。该方法包含多个步骤，包括预处理请求、生成SQL、验证和反思，以确保最终输出的SQL语句在语法和逻辑上均正确。"
date: 2024-12-26T00:58:59Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Kz0Xc98OTPMnebDAoYSdFg.png"
categories: ["Programming", "Natural Language Processing", "Data Science"]
author: "Rifx.Online"
tags: ["NL2SQL", "SQL", "reflection", "workflow", "accuracy"]
draft: False

---



*作者：Atul Varshneya, Toby Fotherby, Shweta Keshavanarayana*

## 介绍

自然语言到 SQL (NL2SQL) 的转换有望为非技术用户普及数据访问。然而，这一过程充满了挑战。自然语言中的模糊性、数据库架构的变化、数据库中表的数量庞大以及 SQL 语法的复杂性常常导致不准确和/或低效的 SQL 查询生成。即使是先进的 AI 模型也难以理解上下文、连接条件和复杂的聚合，从而导致可能影响数据完整性和决策过程的错误。随着组织越来越依赖数据驱动的洞察，准确和可靠的自然语言到 SQL 解决方案的需求变得更加重要。

在本文中，我们提出了一种生成式 AI 反思代理方法，该方法超越了自然语言到 SQL 的典型单次应用，并利用代理反思来提高生成的准确性。这种方法分析第一次 SQL 生成的输出，识别并纠正最初生成的 SQL 中的错误。这不仅提高了准确性，还能够适应多样化的数据库环境。

## Agentic Workflows 简要概述

直到最近，大多数基于生成式 AI 的应用程序都是通过编写良好的提示，提供具体的指令、相关的上下文、少量示例等，并将其输入到大型语言模型（LLM）中以生成所需的响应。随着越来越强大的模型的出现，这种策略可以表现得相当不错。然而，还有另一种思考提示 LLM 的方式，超越这种单一和直接的提示方法，通过利用更迭代的方式来处理任务。本质上，遵循一种更典型的人类执行任务的工作流程。这种迭代方法不仅提高了输出的质量，还为执行复杂任务提供了替代和强大的范式。

这种迭代工作流程模式可以采取多种形式。虽然没有特别普遍认可的方式来对这些模式进行分类，但以下是行业文献中提到的一种合理的方式 [literature](https://www.deeplearning.ai/the-batch/how-agents-can-improve-llm-performance/)。

* **反思**：回顾和改进之前生成的输出。例如，根据提供的提示编写代码，审查代码，识别问题，并生成更新的代码以修复这些问题。使用这种方法，[deeplearning.ai 报告](https://www.deeplearning.ai/the-batch/how-agents-can-improve-llm-performance/) 人类评估编码基准的性能从 48.1% 提升至 95.1%。关于反思代理的广泛描述可以在 [这篇文章](https://blog.langchain.dev/reflection-agents/) 中找到。请注意，对于本文，这种代理工作流程特别重要。
* **工具使用**：使用工具进行专业操作以获取信息、执行操作、处理信息等。例如，提供代理一个 API 用于查询订单，以回答用户关于其订单的问题，或提供代理一个 API 以执行诸如发送电子邮件等操作。
* **规划**：提示 LLM 将用户请求分解为一系列步骤以完成该任务。目标是为代理提供最佳路径，以便能够更好地推理，并在需要时委派任务。
* **多代理协作**：多个代理通过根据其专业化分配任务进行协作，以提出请求任务的解决方案。

如前所述，我们利用代理反思来审查和重写最初通过直接提示生成的 SQL。使用这种方法处理实际业务用例时，我们实现了超过 90% 的正确 SQL 生成。本文中提出的方法遵循以下模式。



第一遍生成 SQL 采用开放循环流程，基于针对 LLM 内在能力的提示量身定制。这第一步根据用户请求生成初始 SQL。随后，该方法遵循一种迭代代理工作流程，其中包括验证步骤，\#2，以及审查和补救步骤，\#3。

验证步骤的具体内容因实现而异，可能应用标准和特定于应用的逻辑来评估生成的 SQL 的可能有效性。例如，这可能包括对输出的语法检查、与已知常见故障条件相关的启发式检查，或利用 LLM 作为评估者模式。如果所有验证条件都通过，或确定退出条件（例如，已达到最大迭代次数），则最终结果和状态将返回给调用应用程序。

审查和补救步骤使用最近生成的响应及其输入，以及验证结果。它生成修订后的响应，更新 SQL，以补救基于其输入检测到的问题。如图所示，步骤 \#2 和 \#3 可以根据需要重复进行。

## 它是如何工作的

### 单通道自然语言到SQL生成管道

单通道管道是文章中最常见的类型，今天也在普遍使用。我们在本文中描述的解决方案模式扩展并改进了这种方法，因此我们将简要描述它，以建立基线。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*hVfpS5PajolVoRKPXVrIeA.png)

管道以来自客户端应用程序或服务的自然语言查询请求开始。应用程序元数据通常与查询一起传递，并可能在请求的预处理过程中使用，或用于日志记录目的。这些数据元素共同构成NL2SQL请求。

### 预处理请求

此步骤中发生的处理根据实现方式而异，并且是可选的。典型目标是利用与 NL2SQL 请求相关的上下文数据，以提高 LLM 提示的质量。示例包括确定最终用户查询的应用程序和数据领域，获取有关最终用户操作领域的信息，以及从用户的历史交互中获取上下文。

### 准备提示

此步骤的目标是根据 NL2SQL 请求和预处理步骤中生成的信息，为 SQL 生成创建一个最佳提示。至少，这包括选择适合请求的提示模板并为模板中提到的变量插入值。这也可能包括与查询的数据领域相关的 SQL 元数据，例如表定义和相关约定。

### 生成 SQL

一个经过 NL2SQL 任务训练的 LLM 被调用以准备好的提示。主要目标是生成与用户查询相对应的有效 SQL。可选地，可以生成支持元数据，例如输出 SQL 中的表列表，以及为查询生成的 SQL 的理由。这些可选数据可用于后续处理的输入，例如验证，或用于日志记录和后续分析。

### 验证

LLM 的输出需要在返回给客户端应用程序之前进行验证。验证的具体逻辑将根据实现和目标而有所不同。为了便于解释，我们列出了以下典型示例。根据应用的验证函数，步骤 A 和 B（预处理请求和准备提示）的输出也可以作为验证步骤的输入。

1. LLM 通常有多个输出值，如上所述，这些输出被包装在 JSON 文档或 XML 风格的标签中。验证步骤至少会检查 LLM 输出的格式是否正确。
2. 驱动 LLM 的提示通常会包含一个选项，以便 LLM 不产生 SQL 输出，例如在客户端请求可能不适合配置的情况下。这将被检查。
3. 检查生成的 SQL 是否在语法上有效。
4. 检查生成的 SQL 是否对应用程序的数据结构（例如表和视图）有效。

### 结果

验证的输出通常会返回给客户端。这可能包括验证状态（通过或未通过），如果验证状态为“通过”，则还包括生成的 SQL，并可选择性地包含其他元数据，例如查询生成的理由和处理统计信息。

对于简单的自然语言到 SQL 解决方案，这是完整的流程。如果生成的 SQL 未通过验证，则不会进行修正。也可能存在生成的 SQL 中的语义错误，例如用于连接的列不正确，或应用的过滤值不正确，这些错误未被验证代码检测到。根据数据领域和输入查询的复杂性，单次处理方法的生成错误率可能达到 30% 或更高。

## NL2SQL生成的代理反思

这种方法增强了上述单次处理解决方案。经过适当配置，该解决方案将具有更高的生成准确性。在我们对真实世界用例的测试中，我们观察到准确率超过90%。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*hs_pLoMfGQrUuFWr5MEFSg.png)

### 第一次通过

这与上述步骤 A、B 和 C 相同。除了将步骤 A、B 和 C 的输出提供给验证和准备审查提示步骤外，不需要对这些步骤进行任何更改。

### 验证

用于代理反思的验证步骤的代码起点是单次解决方案中使用的验证步骤。验证过程应该已经能够检测到生成失败，例如格式和语法错误（如上所述）。对这段代码的初步更改是，验证过程将不再返回失败结果，而是将失败信息以及来自第一次处理的支持数据转发给代理反思过程。该过程将专注于审查和修复生成的输出。与之前一样，如果输入通过验证所应用的检查，则验证将格式化结果以供输出。

在添加代理反思时，扩展验证过程以包括对在第一次处理中往往产生不正确输出的查询的检查和/或与不正确输出相关的 SQL 语句的检查，通常是有价值的。通过标记在测试和/或生产中证明有问题的查询和输出，代理反思过程可以获取第一次处理的结果并改善生成的输出。

### 准备审查提示

该步骤准备将用于驱动LLM审查和修正先前生成的SQL的Agentic Reflection提示。在此处描述的实现中，SQL的审查（即反思）和修正（审查结果的应用）是在对经过训练以解决自然语言到SQL任务的LLM的单次调用中进行的。

此步骤的输入通常包括来自第一次处理步骤（A、B和C）以及验证（步骤2\）的输出。这些数据用于创建反思提示。具体内容将根据实现有所不同，但一些常见模式是预期的。例如：

1. 任务的陈述目标是审查用户查询的输入SQL，并输出语法和逻辑上正确的SQL以匹配用户的查询
2. 反思提示将包括用户的请求
3. 它将包括最近生成的SQL以供审查
4. 它将包括一些基于验证结果的具体指示（例如：“注意：给定的SQL解决方案存在逻辑错误。它引用了一个不存在的表。请纠正这一点。”）
5. 审查提示还将包括用于生成正在审查的SQL的完整集或经过修剪的SQL元数据集

注意：将SQL元数据修剪到与正在处理的查询适当的最小范围将提高推断效率，并通常也会增加生成准确性。此外，为了促进在SQL逻辑特别具有挑战性的情况下生成正确的SQL，此时可能会有条件地添加额外的SQL元数据。

### 审查和修正 SQL

一个经过 NL2SQL 任务训练的 LLM 被调用，并使用准备好的反思提示。与之前一样，在步骤 C 中，主要目标是生成与用户查询对应的有效 SQL，并可选地生成支持元数据，以便用于下游过程，如验证，或用于记录和后续分析。

结果被导向验证过程进行评估。根据评估，最终结果可能会输出到调用客户端，或者可能再次调用代理反思过程。

## 示例实现的逐步讲解

在这里，我们跟随本文中介绍的方法的示例实现，并通过一个示例用户查询进行讲解。该实现可在 GitHub 上获取 \[[link](https://github.com/genai-articles/nl2sql_with_agentic_reflection)]，鼓励读者下载并按照下面的说明逐步运行。

### 问题设置

本实现中所涉及的问题是一个 VPN 应用程序和网络策略数据库，允许用户使用自然语言查询该数据库。

该应用程序的端到端功能可以设想为接收用户的自然语言查询，生成与问题相对应的 SQL，执行生成的 SQL 查询，然后将查询结果呈现给用户。根据用户的自然语言查询，生成的 SQL 在某些情况下可能是无效的。这些情况将导致应用程序返回失败，和/或要求用户重新表述问题。

显然，在整个端到端应用程序流程中，这里提出的方法仅处理 SQL 的生成。

为了演示步骤的执行，我们将使用用户查询“列出我的 VPN 策略”。我们将从第一次通过的输出开始，逐步讲解代理 SQL 反射管道的步骤。

### 执行流程

以下是执行流程中代理反思部分的顶级迭代循环的代码。这是一个快速参考，后续的小节中我们将逐步讲解每个步骤及其处理结果。

变量 `reflection_state` 保存执行状态，并在每个步骤传递给函数。该对象的内容是这里所需的最小信息，可以根据您的解决方案需要添加更多信息字段。它还包含一些流跟踪字段，即迭代次数以跟踪迭代编号，以及源以跟踪最后 SQL 生成的来源，`‘First-Pass’` 或 `‘Reflection-Pass’`。

```python
iteration = 0
while True: 
    # get validation result and analysis 
    validation_result = reflection_tasks.validation(reflection_state)

    # any more iterations to do? 
    if validation_result[‘validation’] is True or \
            iteration >= app_constants.MAX_REFLECTION_ITERATIONS: 
        break # break out of the iteration loop 
 
    # prepare a prompt for reflection — 
    # using system prompt, user query, tables schema, 
    # tables rules, previously generated output 
    reflection_prompt = reflection_tasks.generate_reflection_prompt(reflection_state) 
 
    # LLM’s response to the prompt 
    llm_response = reflection_tasks.llm_inference(reflection_prompt) 
    output_sql = reflection_tasks.get_sql_from_completion(llm_response) 
    reflection_tasks.set_sql_in_genoutput(reflection_state, output_sql) 
 
    iteration = iteration + 1 
    reflection_tasks.set_iteration_in_genoutput(reflection_state, iteration) 
    reflection_tasks.set_source_in_genoutput(reflection_state, 'Reflection-Pass')
```
**步骤 1 — 第一次执行**

如前所述，我们从第一次执行已完成的点开始。状态对象存储用户查询和该轮生成的 SQL，如下所示。

```python
## First-pass generated output: 
## { 
## "user_query": "List my VPN Policies", 
## "sql": "SELECT DISTINCT vpn_policy_union.name, vpn_policy_union.policy_type \
##     FROM vpn_policy_union", 
## "iteration": 0, 
## "source": "First-Pass" 
## }
```
**步骤 2 — 验证第一次执行的输出**

该示例实现中的验证函数更像是一个占位符。代码文件中有注释提示您如何编写自己的验证函数。

占位符验证函数第一次返回失败，这使得控制进入迭代循环以执行对先前生成的 SQL 的审查和修正（即反思）。

```python
## get validation result and analysis 
validation_result = reflection_tasks.validation(reflection_state)

## Validation result: 
## { 
##     "validation": false, 
##     "validation_analysis": “the sql generated for this user query was incorrect.” 
## }

## any more iterations to do? 
if validation_result['validation'] is True or \ 
        iteration >= app_constants.MAX_REFLECTION_ITERATIONS: 
    break # break out of the iteration loop
```
**步骤 3 — 准备审查提示**

此步骤构建 LLM 以审查先前生成的 SQL 并生成可能更好的 SQL 的提示。

提示由以下部分组成 —

1. LLM 执行反思任务的指令
2. 需要生成 SQL 的用户查询
3. 需要审查和改进的先前生成的 SQL
4. 将生成 SQL 的数据库架构（见 `dbtables_schema.py`）
5. 提供的任何规则或提示（见 `dbtables_rules.py`）关于如何使用表

请注意，提供的指令包括 LLM 所扮演的角色，即 Postgres 和网络防火墙的专家，以及所需完成的任务的详细信息，即对提供的 SQL 查询进行审查并创建更好的查询。此外，此实现中的提示还要求 LLM 思考如何执行任务，将这些想法放在 `<thinking>` 标签内。当要求 LLM 执行一些非平凡任务时，这是一个好主意。最后，提示要求将新生成的 SQL 放在 `<sql>` 标签内。

请参见下面准备的提示。为了节省空间，提示的某些部分，如指令、架构，被切割。

```python
## prepare a prompt for reflection -
## using system prompt, user query, tables schema, tables rules, 
## and previously generated output 
reflection_prompt = reflection_tasks.generate_reflection_prompt(reflection_state)

## Prompt for performing reflection: 
## '''
## You are a PostgreSQL expert and also a network firewall expert. 
## Your job is to review a SQL query that has been created to answer a user's question. 
## That SQL may have been created without fully considering the sql schema definitions 
## and the associat...
## ...Review the user's question along with the supporting contextual information and 
## put your analysis within <thinking> tags. Output what you determine to be the 
## correct SQL query within <sql> tags. 
## The SQL output should be a syntactically correct Postgres query 
## 
## Do not output any further explanations or prose. 
## 
## <user_question> 
## List my VPN Policies 
## </user_question> 
## 
## <sql_query> 
## SELECT DISTINCT vpn_policy_union.name, vpn_policy_union.policy_type \ 
##     FROM vpn_policy_union 
## </sql_query> 
## 
## <database_schema> 
## ['CREATE TABLE "web_access_policy" ( — Web Access Policy \
##     "name" text, — User specified name of the policy \
##     "id" numeric, — Unique id of the apolicy \
##     "last_modified_date", \
##     "last_modified_by" text — User that last modified the acces... 
## </database_schema> 
## 
## <schema_rules> 
## ["<rule>\
##   When selecting VPN information from the 'vpn_policy_union' table, \ 
##   a filter of 'VPN' should be applied to the 'name' column \
##   </rule>", 
## "<rule>\
##   To filter on *who modified a record* in table, use the 'last_modified_by' \
##   column if it exists and filter on the value of the given user name. \
##   </rule>", 
## ...
## </schema_rules> 
## 
## '''
```
**步骤 4 — 调用 LLM 进行审查和修正**

接下来，使用准备好的提示调用 LLM 执行审查和修正（反思）先前生成的 SQL 的任务。SQL 从其输出中的 `<sql>` 标签中提取，并复制到 `reflection_state` 对象中。

查看 LLM 输出中的 `<thinking>` 标签有助于了解 LLM 如何分析情况，从而也有助于调试反思提示。该运行的 `<thinking>` 标签如下所示。

根据提到的思考，LLM 生成了更新的、更可能更好的 SQL 查询。

```python
## LLM’s response to the prompt 
llm_response = reflection_tasks.llm_inference(reflection_prompt) 

## extract the generated SQL from the response 
output_sql = reflection_tasks.get_sql_from_completion(llm_response) 
reflection_tasks.set_sql_in_genoutput(reflection_state, output_sql)

## <thinking> tag in LLM’s response: 
## The given SQL query selects the distinct names and policy types from the \
## 'vpn_policy_union' table. This query does not fully consider the schema \
## definitions and associated rules. According to the schema, the 'vpn_policy_union' \
## table contains both Jaguar VPN policies and VPN policies. The 'policy_type' column \
## indicates the type of the VPN policy, with possible values of 'JaguarVPN' and 'VPN'.\
## To retrieve only the VPN policies, we need to add a filter to the query to select \
## records where 'policy_type' is 'VPN'. Additionally, the schema rules state that we \
## should not include columns that are not needed in the SELECT clause, such as 'id' \
## and 'domain_id' from the 'vpn_policy_union' table.

## Generated output after one reflection iteration: 
## { 
##     "user_query": "List my VPN Policies", 
##     "sql": "SELECT DISTINCT vpn_policy_union.name, vpn_policy_union.policy_type \
##         FROM vpn_policy_union WHERE vpn_policy_union.policy_type = 'VPN'", 
##     "source": "Reflection-Pass", 
##     "iteration": 1 
## }
```
**步骤 2，第二次迭代 — 循环回去验证这个新输出**

接下来，控制回到循环的顶部，对反思步骤生成的新 SQL 查询进行验证。这次占位符验证函数对生成的 SQL 进行语法检查并返回成功结果，从而终止反思迭代循环。

```python
## looping back to validation of the generated output

## get validation result and analysis 
validation_result = reflection_tasks.validation(example_case)

## Validation result: 
## { 
##     "validation": true, 
##     "validation_analysis": "the generated sql passed validation checks." 
## }

## any more iterations to do? 
if validation_result['validation'] is True or \
        iteration >= app_constants.MAX_REFLECTION_ITERATIONS: 
    break # break out of the iteration loop 

## End of iterations
```
**最终结果**

运行的最终结果从 `reflection_state` 对象中获取。

```python
## "validation": true, 
## "sql": "SELECT DISTINCT vpn_policy_union.name, vpn_policy_union.policy_type \
##     FROM vpn_policy_union WHERE vpn_policy_union.policy_type = 'VPN'"
```

## 结论

总之，在本文中，我们描述了一种从文本用户查询生成 SQL 的代理模式。我们特别使用了反思代理工作流程，以迭代和改进 SQL 查询的生成。

该实现可在 GitHub 上找到 \[[link](https://github.com/genai-articles/nl2sql_with_agentic_reflection)]。我们的实现使用了 Amazon Bedrock 上的 LLM，因为它提供了易用性，但可以轻松更改为使用您选择的 LLM。如果您希望进一步讨论，请联系作者。

## 关于作者

**Atul Varshneya** 是亚马逊网络服务（AWS）的首席人工智能和机器学习专家。他目前专注于在人工智能/机器学习领域，特别是生成性人工智能方面开发解决方案。在他四十年的职业生涯中，Atul 曾在多家大型公司和初创公司担任技术研发领导。工作之外，他喜欢演奏印度古典音乐。

**Toby Fotherby** 是亚马逊网络服务（AWS）的高级人工智能和机器学习架构师，帮助客户利用基于云的人工智能/机器学习和生成性人工智能服务快速扩展他们的创新。他拥有十多年的跨行业专业知识，领导战略性倡议。Toby 还领导一个项目，培训下一代人工智能解决方案架构师。

**Shweta Keshavanarayana** 是 AWS 的高级客户解决方案经理。她与 AWS 战略客户合作，帮助他们进行云迁移和现代化之旅。Shweta 热衷于利用创造性解决方案解决复杂的客户挑战。她拥有计算机科学与工程的本科学位。在职业生活之外，她担任儿子们 U9 板球队的团队经理，同时指导女性从事技术工作，并服务于当地社区。

*本文代表作者的意见，而不代表其雇主的意见。*

