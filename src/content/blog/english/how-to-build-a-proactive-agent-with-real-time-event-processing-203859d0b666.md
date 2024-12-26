---
title: "How to Build a Proactive Agent with Real-Time Event Processing"
meta_title: "How to Build a Proactive Agent with Real-Time Event Processing"
description: "The article discusses the development of proactive agents using real-time event processing combined with streaming databases and large language models (LLMs). It emphasizes the need for these agents to monitor events continuously, enabling them to act autonomously based on predefined conditions. By utilizing event listeners and streaming databases, the agents can efficiently process numerous events and invoke LLMs when specific thresholds are met. This architecture allows for automated actions, such as sending notifications or executing trades, without requiring direct human input. The article highlights the advantages of using SQL for querying and managing data in streaming environments, exemplified by the RisingWave database."
date: 2024-12-26T04:30:18Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*F2O-619SAGxFhtSvqFCHfQ.jpeg"
categories: ["Programming", "Technology", "Autonomous Systems"]
author: "Rifx.Online"
tags: ["proactive", "agents", "event", "streaming", "LLMs"]
draft: False

---





### Discover how combining streaming databases and LLMs can create agents that act before you even ask.



Q\&A agents powered by large language models (LLMs), like ChatGPT, have already become an integral part of our daily lives, helping us solve a wide range of problems — whether it’s writing code, drafting papers, or responding to emails. But all these “magical” capabilities come with one key requirement: we must provide the LLM with high\-quality, precisely described questions.

So, is it possible to create an intelligent agent that can take proactive action without human instructions?

Imagine an agent that doesn’t just react but can make decisions on its own. To achieve this, the agent needs real\-time awareness — it needs “eyes” and “ears” to monitor the ever\-changing environment, allowing it to take action before we even ask. Every moment brings countless events, and in order for the agent to act, it must understand these real\-time happenings, just like humans who sense changes before taking action.


## Proactive Agent

Let’s take a look at examples about the proactive agent:


```python
🤔: Send an email to me when the sale amount break the monthly record.
🤔: Turn on the AC as I approach home.
🤔: Sell 40% TSLA stocks when the return is above 3%.
```
Most of the LLMs can send emails for you, it can turn on your AC if it have access to the Home Assistant APIs. It can also sell TSLA stocks for you if you allow it. But these things can only happen when you ask it to do it. It cannot be invoked by some specific events, like when the return rate is above three percents. Or turn on the AC as you’re approching home. Of course we can let our brilliant developers to finish these features. But what if we want it to sell stocks when some other factors touch the threshold? Or maybe LLMs can process every single events for us.

Letting the LLM process every single event is not possible for the moment. Making the LLM handle every single event is inefficient. It’s slow and expensive. Not to mention that there might be thousands, maybe millions of events happening every second. What the LLM need is actually letting it create event listeners.


## The Architecture

What would you do if you want to wake up at 7 AM. Do you need to check the clock every 5 minutes while you’re sleeping? You simply set an alarm. The alarm will “invoke” the buzzer to wake you up. The event here is the time, the interesting event is “The time is 7 AM”. Same thing for the LLM, it can set up an event listener, which will invoke the LLM when the interesting event occurs.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*WX5RAKAMIjdUk0Af.png)

The figure above shows the flow of the event\-driven agent. Streaming database is used here for building an event\-driven agent, it can store, process, transform events and also allow users to query the data.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*CQUXsGhjIyCJQFG8.png)

First the user illustrate the event to watch, for example, the user can say: “tell me when @risingwave.com folks register”. Apperently, the user’s agent is an assistant for manging the user’s website. The agent has access to some data that can help it to determine who just registerred in the wesite. It could be the log in the backend, or a committed INSERT statement in the USER table. Let’s assume the event looks like this:


```python
{"id": "x7cj7Hjis52-H", "payload": {"email": "peter.shen@example.com"}, "timestamp": 2024-11-14T06:00:00""}
{"id": "gdgs+52djKFO", "payload": {"email": "john.doe@example.com"}, "timestamp": 2024-11-14T07:00:00""}
{"id": "289ghnwNFoiu9dK", "payload": {"email": "mike.wang@risingwave.com"}, "timestamp": 2024-11-14T08:00:00""}
......
```
All these events will be ingested to the streaming database. The LLM will create some rules in the streaming database to filter events. And when something interesting happens, the streaming database will notify the event handler. Then, the event handler invoke the LLM with the prompt containing the event and the context. The prompt can be like:


```python
Send a message to the user: mike.wang@risingwave.com just registerred.
```
Then the LLM can use tool calls to send a message to user about the event.

Let’s take a look at the SQL statement:


```python
SELECT
  'Send message to user: ' | (payload).email | 'just registered.' AS prompt
FROM register_events
WHERE created_at > '2024-11-14 20:00:00' 
  AND (payload).email LIKE '@%risingwave.com'
```
This SQL first filter out all historical events by `created_at > '2024-11-14 20:00:00'`, because the user want to be informed when @risingwave.com folks register from now. Then, it only gets event whose `email` field in the payload ends with `risingwave.com` , then transforms this register event to a prompt to invoke the LLM. This is the “eyes and ears” for a proactive agent.

You may wonder why this SQL statement can filter event and invoke LLM. This SQL is used to construct a materialized view. The full SQL statement looks like:


```python
CREATE MATERIALIZED VIEW event_listener_risingwavecom_register AS
SELECT ... FROM ...
```
The materialized view stores the latest result of a query. You can run query on this materialized view, or create a new materialized view based on this materialized view:


```python
SELECT * FROM event_listener_risingwavecom_register
```
In streaming databases, the materialized view is updated automatically and incrementally when the upstream data changes. So, when a new event is inserted into the `register_events` table, the streaming database will process this insert event using the rules defined by the SQL statement. If the the payload of the new inserted row ends with “@risingwave.com”, then a new prompt will be inserted into this materialized view. The update of the materialized view is also an event, RisingWave provides publish/subscribe mechanism to notify the downstream when the materialized view is updated.


## Why Streaming Database

The streaming database is where the magic happens. It has everything we need: stream processing engine, data storage, data serving, and the SQL interface. There are a lot of stream processing engines, but one with SQL interface can help us to save a lot of time to build an event\-driven agent. RisingWave is one of the suitable choices.


### SQL Interface is essential

SQL is the language to describe the result you want, you don’t need to write the computation procedure. The database will generate an optimized computation graph according to the SQL. If you want to get the top 10 sales transaction record by the sales amount, you can simply put:


```python
SELECT * FROM sales_global ORDER BY amount_usd LIMIT 10;
```
You can use `MATERIALIZED VIEW` to maintain the latest view of this query:


```python
CREATE MATERAILIZED VIEW top_10_sales AS
SELECT * FROM sales_global ORDER BY amount_usd LIMIT 10;
```
Every time you query the materialized view `SELECT * FROM top_10_sales` , you will always get the latest top 10 sales transaction by the sale amount. The materialized view is incremental updated when the upstream data is changed.

How about letting the LLM write some Python code to get what we want? Well, the LLM would have to write the correct computation procedure. In this case, the LLM should write an incremental\-update distributed top\-K algorithm to process events. This requires heavy prompt engineering effort to make the LLM an expert in stream processing and distributed system. While using SQL, the LLM only needs to describe the result it want. That means less LLM thinking steps, less prompt engineering, less domain knowledge, and thus, less cost.


### Input \& Output

RisingWave is Postgres\-compatible, meaning it can seamlessly fit in the Postgres ecosystem. You can access it with tools like psql, dbt, or the Postgres client libraries in programming languages. It can be used like a Postgres database, like serving as a Grafana Postgres Data Source, or a Postgres FDW. It also allows you to create sources to fetch data from the external data stores, or sink data into the stores, like Kafka, MySQL, ClickHouse, Iceberg tables, etc.

In the case discussed above, we will use the insert statement to ingest data, and use subscription to notify the event handler.


### Streaming Joins

RisingWave is powerful in cases with the streaming join, which is a common use case in event\-driven applications, as RisingWave is tailored for stream processing. Let’s take a look at an example about the streaming join:

Imagine you owns an international corporation and your products are sold all over the world. Now you’re sitting in your headquarter, located at Beijing, China. You want to monitor your real\-time sales amount in CNY. And there are two tables in your database you can use:

* `sales_global` : All sales transaction records.
* `exchange_rate` : The latest known exchange rate at a specific timestamp.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*wheuAHvbjZJjFolG.png)

Since the sales happen globally, the sales can be settled in any currency. Before summing up the sales amount, we need to covert the amount in a sales record with the latest known exchange rate at that moment. For example, to convert the amount of the record `2024-11-05T07:00:00, 10 USD` , we need to first find the `exchange_rates` rows whose `current_from` is USD, `current_to` is CNY, and `ts` is the largest timestamp that cannot exceeds `2024-11-05T07:00:00` . The SQL looks like:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*CAnN1VZhE93klrYJ.png)

This is a streaming join example that the columnar\-storage database cannot handle efficiently. In the real\-time event processing, things can be more complicated, there might be a lot of joins instead of just one like this example. Especially you have a lot of dimension tables in your database.


## The Demo

I built a demo to help you understand how the LLM can leverage the streaming database to monitor events. Check out [the link](https://github.com/cloudcarver/event-driven-agent-demo) for more details.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*ZKP6BaYKa9R7-TyV.png)


