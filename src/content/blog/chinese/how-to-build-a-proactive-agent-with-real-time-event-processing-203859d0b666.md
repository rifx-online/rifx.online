---
title: "如何利用实时事件处理打造主动式代理"
meta_title: "如何利用实时事件处理打造主动式代理"
description: "本文探讨了如何构建具有实时事件处理能力的主动代理，结合流媒体数据库与大型语言模型（LLM），使其能够在未被请求时主动采取行动。主动代理通过事件监听器监控环境变化，及时响应特定事件，例如发送邮件或执行交易。流数据库在此过程中扮演关键角色，提供高效的事件处理和SQL接口，简化了复杂查询和数据更新。通过物化视图和增量更新，代理能够实时获取相关信息并做出决策，从而提升智能代理的自主性和效率。"
date: 2024-12-26T04:30:18Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*F2O-619SAGxFhtSvqFCHfQ.jpeg"
categories: ["Programming", "Technology", "Autonomous Systems"]
author: "Rifx.Online"
tags: ["proactive", "agents", "event", "streaming", "LLMs"]
draft: False

---



### 发现如何将流媒体数据库与大型语言模型结合起来，创建在您甚至未询问之前就能采取行动的智能代理。



由大型语言模型（LLMs）驱动的问答代理，如ChatGPT，已经成为我们日常生活中不可或缺的一部分，帮助我们解决各种问题——无论是编写代码、撰写论文还是回复电子邮件。但是，所有这些“神奇”的能力都有一个关键要求：我们必须向LLM提供高质量、精确描述的问题。

那么，是否有可能创建一个能够在没有人类指示的情况下主动采取行动的智能代理？

想象一个不仅仅是反应，而是能够自主做出决策的代理。要实现这一点，代理需要实时感知——它需要“眼睛”和“耳朵”来监控不断变化的环境，使其能够在我们甚至未询问之前采取行动。每时每刻都有无数事件发生，为了让代理能够行动，它必须理解这些实时发生的事情，就像人类在采取行动之前能感知到变化一样。

## 主动代理

让我们来看看关于主动代理的例子：


```python
🤔: Send an email to me when the sale amount break the monthly record.
🤔: Turn on the AC as I approach home.
🤔: Sell 40% TSLA stocks when the return is above 3%.
```
大多数 LLM 可以为你发送电子邮件，如果它可以访问家庭助手 API，它也可以在你回家时打开空调。如果你允许它，它还可以为你出售 TSLA 股票。但这些事情只能在你请求它时发生。它不能被某些特定事件触发，比如当回报率超过三个百分点时，或者在你接近家时打开空调。当然，我们可以让我们优秀的开发人员完成这些功能。但如果我们希望它在其他因素触及阈值时出售股票呢？或者也许 LLM 可以为我们处理每一个事件。

让 LLM 处理每一个事件在目前是不可行的。让 LLM 处理每一个事件效率低下。这既慢又贵。更不用说每秒可能会发生成千上万，甚至数百万个事件。LLM 需要的实际上是让它创建事件监听器。

## 架构

如果你想在早上7点醒来，你需要在睡觉时每5分钟检查一次钟表吗？你只需设置一个闹钟。闹钟会“调用”蜂鸣器来唤醒你。这里的事件是时间，感兴趣的事件是“时间是早上7点”。对LLM来说也是如此，它可以设置一个事件监听器，当感兴趣的事件发生时，就会调用LLM。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*WX5RAKAMIjdUk0Af.png)

上图展示了事件驱动代理的流程。这里使用流式数据库来构建事件驱动代理，它可以存储、处理、转换事件，并允许用户查询数据。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*CQUXsGhjIyCJQFG8.png)

首先，用户说明要监视的事件，例如，用户可以说：“告诉我当@risingwave.com的人注册时。”显然，用户的代理是管理用户网站的助手。该代理可以访问一些数据，以帮助其确定谁刚刚在网站上注册。这可能是后端的日志，或是USER表中提交的INSERT语句。假设事件看起来像这样：

```python
{"id": "x7cj7Hjis52-H", "payload": {"email": "peter.shen@example.com"}, "timestamp": 2024-11-14T06:00:00""}
{"id": "gdgs+52djKFO", "payload": {"email": "john.doe@example.com"}, "timestamp": 2024-11-14T07:00:00""}
{"id": "289ghnwNFoiu9dK", "payload": {"email": "mike.wang@risingwave.com"}, "timestamp": 2024-11-14T08:00:00""}
......
```
所有这些事件将被导入流式数据库。LLM将在流式数据库中创建一些规则来过滤事件。当发生一些有趣的事情时，流式数据库将通知事件处理程序。然后，事件处理程序使用包含事件和上下文的提示调用LLM。提示可以是这样的：

```python
Send a message to the user: mike.wang@risingwave.com just registerred.
```
然后，LLM可以使用工具调用向用户发送有关事件的消息。

让我们看看SQL语句：

```python
SELECT
  'Send message to user: ' | (payload).email | 'just registered.' AS prompt
FROM register_events
WHERE created_at > '2024-11-14 20:00:00' 
  AND (payload).email LIKE '@%risingwave.com'
```
这个SQL首先通过`created_at > '2024-11-14 20:00:00'`过滤掉所有历史事件，因为用户希望在@risingwave.com的人从现在开始注册时被通知。然后，它只获取`payload`中的`email`字段以`risingwave.com`结尾的事件，然后将此注册事件转换为提示以调用LLM。这是主动代理的“眼睛和耳朵”。

你可能会想知道为什么这个SQL语句可以过滤事件并调用LLM。这个SQL用于构建一个物化视图。完整的SQL语句看起来像这样：

```python
CREATE MATERIALIZED VIEW event_listener_risingwavecom_register AS
SELECT ... FROM ...
```
物化视图存储查询的最新结果。你可以在这个物化视图上运行查询，或基于这个物化视图创建一个新的物化视图：

```python
SELECT * FROM event_listener_risingwavecom_register
```
在流式数据库中，当上游数据发生变化时，物化视图会自动和增量更新。因此，当一个新事件被插入到`register_events`表中时，流式数据库将使用SQL语句定义的规则处理这个插入事件。如果新插入行的负载以“@risingwave.com”结尾，那么一个新的提示将被插入到这个物化视图中。物化视图的更新也是一个事件，RisingWave提供发布/订阅机制来通知下游物化视图何时更新。

## 为什么选择流数据库

流数据库是魔法发生的地方。它具备我们所需的一切：流处理引擎、数据存储、数据服务和 SQL 接口。虽然有很多流处理引擎，但带有 SQL 接口的引擎可以帮助我们节省大量时间来构建事件驱动的代理。RisingWave 是一个合适的选择。

### SQL 接口是必不可少的

SQL 是描述您想要的结果的语言，您无需编写计算过程。数据库将根据 SQL 生成优化的计算图。如果您想按销售金额获取前 10 条销售交易记录，您可以简单地写：

```python
SELECT * FROM sales_global ORDER BY amount_usd LIMIT 10;
```
您可以使用 `MATERIALIZED VIEW` 来维护此查询的最新视图：

```python
CREATE MATERAILIZED VIEW top_10_sales AS
SELECT * FROM sales_global ORDER BY amount_usd LIMIT 10;
```
每次查询物化视图 `SELECT * FROM top_10_sales` 时，您将始终获得最新的前 10 条销售交易记录。物化视图在上游数据发生变化时会增量更新。

让 LLM 编写一些 Python 代码来获取我们想要的结果怎么样？好吧，LLM 必须编写正确的计算过程。在这种情况下，LLM 应该编写一个增量更新的分布式 Top-K 算法来处理事件。这需要大量的提示工程工作，以使 LLM 成为流处理和分布式系统的专家。而使用 SQL 时，LLM 只需描述它想要的结果。这意味着更少的 LLM 思考步骤，更少的提示工程，更少的领域知识，从而降低成本。

### 输入与输出

RisingWave 是与 Postgres 兼容的，这意味着它可以无缝融入 Postgres 生态系统。您可以使用 psql、dbt 或编程语言中的 Postgres 客户端库等工具访问它。它可以像 Postgres 数据库一样使用，例如作为 Grafana Postgres 数据源或 Postgres FDW。它还允许您创建源以从外部数据存储中提取数据，或将数据写入存储，例如 Kafka、MySQL、ClickHouse、Iceberg 表等。

在上述讨论的情况下，我们将使用插入语句来摄取数据，并使用订阅来通知事件处理程序。

### 流式连接

RisingWave 在流式连接的场景中表现强大，这在事件驱动的应用程序中是一种常见的用例，因为 RisingWave 专为流处理而设计。让我们看一个关于流式连接的例子：

想象一下，您拥有一家国际公司，您的产品在全球销售。现在您坐在位于中国北京的总部。您想监控您以人民币（CNY）计算的实时销售额。您的数据库中有两个可以使用的表：

* `sales_global` : 所有销售交易记录。
* `exchange_rate` : 在特定时间戳下最新的已知汇率。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*wheuAHvbjZJjFolG.png)

由于销售是全球进行的，销售可以以任何货币结算。在汇总销售额之前，我们需要用当时最新的已知汇率转换销售记录中的金额。例如，要转换记录 `2024-11-05T07:00:00, 10 USD` 的金额，我们需要首先找到 `exchange_rates` 行，其中 `current_from` 为 USD，`current_to` 为 CNY，并且 `ts` 是不超过 `2024-11-05T07:00:00` 的最大时间戳。SQL 语句如下：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*CAnN1VZhE93klrYJ.png)

这是一个流式连接的例子，列存储数据库无法高效处理。在实时事件处理过程中，事情可能会更加复杂，可能会有很多连接，而不仅仅是像这个例子中的一个。尤其是当您的数据库中有很多维度表时。

## 演示

我建立了一个演示，以帮助您理解 LLM 如何利用流数据库来监控事件。有关更多详细信息，请查看 [the link](https://github.com/cloudcarver/event-driven-agent-demo)。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*ZKP6BaYKa9R7-TyV.png)

