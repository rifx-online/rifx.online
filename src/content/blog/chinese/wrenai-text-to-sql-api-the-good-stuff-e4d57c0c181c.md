---
title: "Wren AI 文本到 SQL：API - 好东西 | by D | Medium"
meta_title: "Wren AI 文本到 SQL：API - 好东西 | by D | Medium"
description: "Wren AI 是一款将自然语言查询转换为 SQL 的应用程序，旨在简化与数据库的交互。它支持多种数据库并提供 UI 和 API 接口，使用户能够通过建模菜单优化查询结果。用户需配置模式和描述，以便更好地理解数据。尽管当前没有实时更新机制和公开的 API 文档，Wren AI 仍为处理结构化数据提供了高效的解决方案。"
date: 2025-01-05T02:05:18Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*gaxyrdmKJziTuQTEDloByg.gif?output=gif&n=50"
categories: ["Programming", "Technology", "Data Science"]
author: "Rifx.Online"
tags: ["SQL", "translation", "queries", "database", "metadata"]
draft: False

---

**Wren AI** 是一个 AI 管道应用程序，可以将自然语言用户查询转换为 SQL，也称为 **文本到 SQL**（也称为自然语言到 SQL 或 NL2SQL），使您能够与数据库进行对话。它同时提供 UI 和 API，允许您根据用户提示生成 SQL 查询，并使用这些查询检索数据。这大大简化了在您的 RAG/Agent 应用程序中处理结构化表格数据的过程。

查看他们的演示 [https://demo.getwren.ai/](https://demo.getwren.ai/)



有关 AI RAG 和 Agent 管道应用程序的更多详细信息，请参阅我之前的文章。

## Wren AI 的工作原理：

部署 Wren AI 使用官方的 Wren AI Docker Compose [本地](https://docs.getwren.ai/installation) 非常简单。您需要一个 OpenAI API 密钥，并选择您计划使用的模型。或者，您可以通过设置容器的 [`OPENAI_API_B`ASE](https://github.com/Canner/WrenAI/blob/main/docker/.env.example#L28) 环境变量，使用其他兼容 OpenAI API 的推理引擎，例如 LocalAI。Wren AI 团队还实现了 [Ollama 推理](https://github.com/Canner/WrenAI/pull/376)，并推荐使用 [Llama3 70b\-instruct](https://ollama.com/library/llama3:70b-instruct) 模型。要使用其他非 OpenAI 模型，您需要创建 [\~/.wrenai/.env.ai](https://github.com/Canner/WrenAI/blob/main/docker/.env.ai.example) 文件，按照此示例进行设置。目前支持的数据库包括 BigQuery、DuckDB、PostgreSQL、MySQL、MS SQL、Clickhouse，甚至 [Microsoft Excel 插件](https://appsource.microsoft.com/en-us/product/office/WA200007192)。您可以在 \[[这里](https://github.com/Canner/WrenAI/discussions/327)] 投票支持其他数据库。

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

有关 Kubernetes 部署，请参阅我在这里的文章：

安装 Wren AI 应用程序后，您可以通过 URL 访问它。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*VRzx0jbho6sgHKcgrteFqg.png)

连接到数据库或上传示例数据集（如 NBA 游乐场）后，您将进入主页。如果您想查看示例数据集中的数据，可以在 [这里](https://github.com/Canner/WrenAI/blob/main/wren-ai-service/demo/utils.py#L369-L394) 找到它，只需将 URL 中的版本替换为同一位置列出的 `DATASET_VERSION` 变量。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*jr4HyNw18SN1kCYav2UbFg.png)

在 **建模** 菜单中配置您的模式并添加描述性文本至关重要。

> **建模** 有助于您和您的大型语言模型（LLM）理解数据和元数据，从而改善查询结果。为了提供更好的结果，您必须设置关系并提供描述，因为表中列的 API 名称可能不足以满足需求。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*50jA3YBy4jfvaO6L0MmEqA.png)

在建模菜单中配置好带关系的模式并添加描述后，前往 **主页** 菜单生成您的第一个文本到 SQL 查询。系统会尝试为您生成三种不同的 SQL 查询，结果将可见。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*_mNiFr48CTi5EjXG2mfavw.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*u1lsyCSCVDrxz7Ah8XcLWA.png)

## 优质内容：API

此外，您可以通过API访问相同的功能，使其成为将结构化表格数据集成到您的RAG/Agent管道应用程序中的理想平台，只需将Wren AI作为服务进行消费。不幸的是，目前没有机制可以将实时更新从Wren AI发送回客户端，例如WebSocket、Server-Sent-Events或WebHooks。如果Wren AI为您准备好答案，您将不得不使用客户端发起的长轮询来不断检查更新，但团队正在[努力解决这个问题](https://github.com/Canner/WrenAI/issues/331)。

虽然目前没有公开的API文档可用，但您可以通过以下步骤利用Chrome开发者工具 -> 网络来观察API交互。

1\. 通过在GraphQL中使用\`**createAskingTask**\`变更提交问题来创建一个异步任务。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*zaSxdvO3VR6a_fc9)

2\. 使用\`**askingTask**\`查询轮询任务状态变化。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*1-614X8bZtNzQlAX)

3\. 在接收到\`**FINISHED**\`状态后，从有效负载中检索三个候选者。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*YS6vh9kizEn4H9Vj)

4\. 使用获得的有效负载调用\`**createThread**\`变更。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*vqfYwzBo02rr_Gov)

5\. 一个线程包含多个响应，每个响应包含一个问题和一个答案。使用\`**thread**\`查询一个线程。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*fnffXrP72lRZ8yp1)

6\. 每个线程中的\`**responses**\`字段包含一个响应数组。后续问题会附加到此数组中。

7\. 持续轮询\`**threadResponse**\` API以监控状态变化。

8\. 当状态变为\`**FINISHED**\`时，在\`**detail**\`字段中查看详细答案。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*fonGcCYqsw4HhHVZ)

9\. \`**detail**\`字段提供了在UI中看到的逐步答案。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*w427tiU4XZ1wbRr0)

目前，Wren AI没有提供直接下载或导出结果和数据的方法。作为解决方法，考虑复制在您的数据库中可执行的原生SQL，并从数据库本身执行导出。

## 摘要

Wren AI 平台使您或您的 RAG/Agent AI 应用程序能够轻松处理关系数据库中的结构化数据，将用户提示转换为有效的 SQL。带有建模菜单的用户界面对于提供额外的元数据描述和模式至关重要，以便您的 LLM 更好地理解您的数据库及其数据。一旦建模完成，Wren AI 就准备好在您的数据库前充当中介。简而言之，您只需与数据库对话。这种前所未有的简单性在之前是无法实现的，使得将业务语言直接转换为 SQL 查询的数据库操作变得非常高效。


