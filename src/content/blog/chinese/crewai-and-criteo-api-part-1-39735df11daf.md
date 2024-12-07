---
title: "CrewAI 和 Criteo API - 第 1 部分"
meta_title: "CrewAI 和 Criteo API - 第 1 部分"
description: "本文介绍了如何使用CrewAI和Criteo API，重点在于获取凭证、访问令牌及调用API以检索账户、零售商和品牌。通过创建AI代理和任务，用户可以利用Criteo的Retail Media API进行数据分析。文章详细说明了环境设置、工具创建、代理和任务的定义，以及如何运行团队以生成输出文件。后续将有更多内容更新。"
date: 2024-12-07T12:30:39Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*bkE8a9yFkP-I5zjScUbOXA.png"
categories: ["Programming", "Technology", "Machine Learning"]
author: "Rifx.Online"
tags: ["CrewAI", "Criteo", "API", "Access", "Token"]
draft: False

---





## 介绍

本文是一个系列的第一篇，展示如何使用CrewAI和Criteo API。我们将看到如何获取凭证，使用这些凭证获取访问令牌，并使用该令牌调用端点以获取账户、零售商和品牌，所有这些都来自CrewAI团队。

> ***CrewAI*** *是一个* “最先进的框架，用于协调角色扮演的自主AI代理。通过促进协作智能，CrewAI使代理能够无缝协作，处理复杂任务。”

> ***Criteo Retail Media API*** 解锁了各种可能性，以提升来自任何平台的媒体活动表现。它允许您创建、启动和监控在线营销活动，并提供其表现的全面视图。

> **CrewAI** 和 **Retail Media** 一起释放了AI的力量和商业媒体的潜力。

### 目的

使用 CrewAI，您将熟悉 Criteo 的 Retail Media APIs 及其如何作为大型语言模型（LLMs）、AI 代理等工具使用。

有关大型语言模型（LLMs）、AI 代理和 CrewAI 的更详细文章和视频，请参阅本文末尾列出的我最喜欢的作者。 ([Sam Witteveen](https://www.linkedin.com/in/samwitteveen/) 和 [Brandon Hancock](https://www.linkedin.com/in/brandon-hancock-2925bb125/)**)**

## 概述

我们旨在使用一组 AI 代理和任务来检索零售媒体 API 的账户、零售商和品牌，并执行 *基础* 分析。我们将在 Criteo 获取一个开发者账户，创建 [**工具**](https://docs.crewai.com/core-concepts/Tools/) 以访问 API，构建一个 [**代理**](https://docs.crewai.com/core-concepts/Agents/) 来使用这些工具，并指定将由 [**团队**](https://docs.crewai.com/core-concepts/Crews/) 按顺序执行的 [**任务**](https://docs.crewai.com/core-concepts/Tasks/)。

本文的所有代码均使用 Python 编写，并使用 poetry 作为包管理器/环境管理器。

## 前提条件

您需要安装以下内容以运行代码示例：

* Python 3\.12 <https://www.python.org/downloads/>
* Pipx <https://pipx.pypa.io/stable/installation/>
* Poetry [https://python\-poetry.org/docs/](https://python-poetry.org/docs/)
* Criteo 的开发者账户和凭证
* [Groq Cloud 账户](https://groq.com/community/) 和 API 密钥，或者 Azure OpenAI 实例和凭证

## 分步指南

### 第一步：Criteo 开发者账户、凭证和认证

要使用 Criteo APIs，您需要在 [开发者门户](https://developers.criteo.com/) 创建一个 [开发者账户](https://developers.criteo.com/retail-media/docs/create-your-developer-account)，通过点击“开始使用”按钮。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*oYvaKkrHClDx0VqRJij7cg.jpeg)

这将带您进入 Criteo 合作伙伴仪表盘。点击“创建一个新应用”（您可以看到我已经定义的应用）。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*uIp2LljRn--AAtCj4FUDWg.jpeg)

您需要同意 APIs 提供的数据；请按照提示进行授权。

获得授权后，点击“创建一个新密钥”以为您的应用创建凭证。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Wp9mYad3GkWRJpR9symR1Q.jpeg)

包含凭证的文件会自动下载到您的本地匹配。您将使用这些凭证为每个 API 调用获取访问令牌。

\# 这是一个示例：

```python
---------------------------
| Criteo Developer Portal |
---------------------------


Please store your client secret carefully on your side.
You will need it to connect to the API and this is the only time we will be able to communicate it to you.
You can find more information on our API Documentation at https://developers.criteo.com.


application_id: <application id>
client_id: <client id>
client_secret: <client secret here>
allowed_grant_types: client_credentials
```
**提示**：请妥善保管您的凭证。不要将其提交到公共代码库（如 GitHub、GitLab 等）。

使用客户端凭证进行认证会生成一个有效的 AccessToken（在撰写时有效期约为 15 分钟）。使用您的客户端凭证调用 Criteo 认证 API 以获取有效令牌。

以下代码片段是一个使用客户端凭证检索 AccessToken 并缓存 15 分钟的函数。





第 15–16 行从环境变量 (.env) 中检索客户端 ID 和密钥。

第 17 行定义了头部，特别是 `content-type` 为 `application/x-www-form-urlencoded`。这个头部值非常重要。

第 18–22 行设置包含您凭证的数据。

第 23 行执行一个 POST 请求以获取访问令牌，第 26 行返回一个包含令牌、令牌类型和过期时间（以秒为单位）的结构。

示例认证结果为 JSON：

```python
{
  "access_token": "eyJhbGciOiJSUzII ... pG5LGeb4aiuB0EKAhszojHQ",
  "token_type": "Bearer",
  "refresh_token": None,
  "expires_in": 900
}
```
其余代码将结果缓存直到令牌过期。

### 第2步：CrewAI环境设置

克隆[仓库](https://github.com/helipilot50/criteo-retail-media-crew-ai.git)，并将目录更改为`part_1`。本文中使用的代码位于该目录中。文件`pyproject.toml`中已定义了一个poetry项目。

在终端中运行以下命令以安装依赖项、创建/更新poetry环境并进入正确的shell。

```python
poetry install --no-root
poetry shell
```
**VS Code：**

如果您使用VSCode，请检查它是否使用了正确的虚拟环境。要将Python解释器设置为您的虚拟环境，请使用以下命令获取路径。

```python
poetry env info --path
/Users/petermilne/Library/Caches/pypoetry/virtualenvs/part-1-qwAxeBFF-py3.12
```
并复制该路径。

然后单击VS Code右下角的“Python ….”。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*QdW_Y7LY05Hyfoua1mUZ6A.png)

选择：输入解释器路径。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*coc0QTdWo4zOgqjta8cJCg.png)

并粘贴该路径。

### 环境变量 .env

您需要创建一个类似于以下内容的 `.env` 文件：

```python
CRITEO_CLIENT_ID=<your client id>
CRITEO_CLIENT_SECRET=<your client secret>
RETAIL_MEDIA_API_URL=https://api.criteo.com/2024-07/retail-media/

## only if you use Azure
AZURE_OPENAI_API_KEY=
AZURE_OPENAI_ENDPOINT=
AZURE_OPENAI_CHAT_DEPLOYMENT_NAME=
OPENAI_API_VERSION=2024-02-15-preview

## only if you use Groq
GROQ_API_KEY=<your groq api key>
GROQ_AI_MODEL_NAME=llama-3.1-70b-versatile
```
提示：Criteo API 是按日期版本控制的，例如 `2024–07`，请确保使用当前的 API 版本。

### Groq 或 Azure OpenAI，为什么不选择 OpenAI？

Groq Cloud 是一种快速且廉价的 LLM 服务，使用新技术，*“由 Groq LPU 提供支持，并以公共、私有和共同云实例的形式提供，GroqCloud 重新定义了实时。”* 对于开发者来说是免费的，也是开始使用 LLM 的绝佳方式。

Azure OpenAI 是一种 LLM 服务的私有实例。“私有”意味着什么？这确保了 OpenAI 不会使用您传入 LLM 的专有数据来训练其未来的模型。即，您 API 调用中的数据不会成为公共领域的一部分！

**提示**：

如果您的 poetry 环境没有在终端中运行，请检查您是否在正确的目录/文件夹中，然后运行：


```python
poetry install --no-root
poetry shell
```

### 第3步：使用API的CrewAI工具

> CrewAI中的工具是代理可以利用的技能或功能，以执行各种操作。这包括来自[crewAI Toolkit](https://github.com/joaomdmoura/crewai-tools)和[LangChain Tools](https://python.langchain.com/docs/integrations/tools)的工具，能够实现从简单搜索到复杂交互以及代理之间的有效协作。

[https://docs.crewai.com/core\-concepts/Tools/](https://docs.crewai.com/core-concepts/Tools/)

我们的第一个任务是创建CrewAI工具，以调用零售媒体REST API。我们将创建三个简单的工具来检索：

* 当前用户可访问的账户列表（用户凭证）
* 账户的品牌列表
* 账户的零售商列表

每个工具将使用等效的REST API端点（参见：[https://developers.criteo.com/retail\-media/docs/account\-endpoints](https://developers.criteo.com/retail-media/docs/account-endpoints)）

让我们讨论其中一个工具：**RetailersTool**

在这里，我们定义了一个名为`RetailersTool`的类，该类实现了工具，继承自`crewai_tool`中的`BaseTool`。

第26-32行代码中，`_run`方法实现了对零售媒体API的调用，并由使用该工具的代理调用。您可以看到传递给REST调用的`accountId`、`pageIndex`和`pageSize`参数。响应是响应体，格式为JSON。

### 第4步：代理


> CrewAI中的代理是一个**自主单元**，被编程用于执行任务、做出决策和与其他代理沟通。可以将代理视为团队中的一员，具有特定的技能和特定的工作。代理可以具有不同的角色，例如“研究员”、“撰稿人”或“客户支持”，每个角色都为团队的整体目标做出贡献。

[https://docs.crewai.com/core\-concepts/Agents/](https://docs.crewai.com/core-concepts/Agents/)

你可以将代理视为一个角色的体现，但也可以将其视为一块智能处理单元。

你可以完全在代码中或在`yaml`文件中定义代理，并在团队中使用少量代码。使用`yaml`文件有助于[**关注点分离**](https://readmedium.com/fundamental-software-architecture-principles-separation-of-concerns-modularity-and-abstraction-856c5a5bdaf0)，并允许非程序员定义代理的属性。

在这里，我们在`config/agents.yaml`中定义代理`account_manager`的属性，并在`crew.py`中定义代理代码。

**Yaml片段：agents.yaml**


```python
account_manager:
  role: >
    Account manager
  goal: >
    Provide lists of accounts, retailers and brands
  backstory: >
    You're an expert in managing accounts and retrieving information about accounts, retailers, and brands. 
    You're known for your ability to provide accurate and up-to-date information to help your team make informed decisions.
    You use the Retail Media REST API efficiently by choosing the correct API and making the right number of requests.
    Remember the results of the accounts, retailers, and brands to avoid making unnecessary request

  verbose: True
  cache: True
```
代理设计有三个关键元素：**角色**、**目标**和**背景故事**。

**角色**：这定义了代理在团队中的工作。在这种情况下，角色简单地是账户经理

**目标**：这指定了代理旨在实现的目标。目标与代理的角色和团队的整体目标保持一致。在这里，目标是提供账户、零售商和品牌的列表

**背景故事**：这为代理的角色提供了深度，丰富了其动机和在团队中的参与。背景故事为代理的角色和目标提供了上下文，使互动更具意义。在这里，代理是一个管理账户的专家，并有具体的指示来处理其职责。

LLM使用这些属性作为提示的一部分，以配置其行为和核心能力。

**代码片段：crew.py**


```python
    """
    Account manager agent instance created from the config file.
    The function is decorated with the @agent decorator to indicate that it is an agent.
    """

    @agent
    def account_manager(self) -> Agent:
        return Agent(
            config=self.agents_config["account_manager"]
            llm=llm, # if you use Azure OpenAI or Groq
        )
```
实际代码从YAML文件加载属性并设置LLM（如果您使用Groq或Azure）

### 第5步：任务


> 在 crewAI 框架中，任务是由代理完成的具体分配。它们提供执行所需的所有详细信息，例如描述、负责的代理、所需工具等，从而促进各种复杂性的操作。


> crewAI 中的任务可以是协作的，需要多个代理共同工作。这通过任务属性进行管理，并由 Crew 的流程进行协调，从而增强团队合作和效率。

[https://docs.crewai.com/core\-concepts/Tasks/](https://docs.crewai.com/core-concepts/Tasks/)

在这个例子中，我们有三个任务：

* **accounts**：检索账户数据并生成 Markdown 文件。
* **brands**：检索特定账户的品牌数据并生成 Markdown 文件。
* **retailers**：检索特定账户的零售商数据并生成 Markdown 文件。

与代理类似，您可以完全在代码中或在 `yaml` 文件中定义任务，并在 crew 中添加少量代码。同样，使用 `yaml` 文件鼓励[**关注分离**](https://readmedium.com/fundamental-software-architecture-principles-separation-of-concerns-modularity-and-abstraction-856c5a5bdaf0)，并允许非程序员定义任务属性。

在这里，我们在 `config/tasks.yaml` 中定义任务 `brands` 的属性，并在 `crew.py` 中定义任务代码。


```python
brands:
  description: >
    Iterate through the {accounts list}, and for each {account} retrieve the Retail Media brands. Use the {account id} to get the brands.
  expected_output: >
    A list of brands for the account formatted as a table in Markdown. Here is an example of the expected output:
    | Brand ID | Brand Name | 
  agent: account_manager
  context:
    - accounts
```
一个任务通常包括以下属性：

**描述**：这是对任务内容的详细解释。它提供了任务的目的和完成任务所需的步骤。在这里，`brands` 任务被指示为每个账户检索品牌。

**预期输出**：这定义了任务的期望结果。它应该清晰且具体。在这个例子中，输出是一个带有示例的 Markdown 表格。

**代理**：这指的是负责执行任务的实体。它可以是特定的人、团队或自动化系统。在这里，任务由 `account_manager` 代理执行。

**上下文**：这包括提供任务背景或输入的任何附加信息或数据。它有助于理解执行任务的环境或条件。`brands` 任务需要 `accounts` 的结果作为输入。

**代码片段：crew.py**


```python
    """
    Brands task instance created from the config file.
    This function is decorated with the @agent decorator to indicate that it is an agent.
    It's job is to retrieve Brands data for a specific Account and produce a Markdown file.
    """

    @task
    def brands(self) -> Task:
        return Task(
            config=self.tasks_config["brands"],
            output_file="output/brands.md",
            asynch=True,
            context=[self.accounts()],
            tools=[
                BrandsTool(),
            ],
        )
```
与代理配置类似，任务的代码从 `tasks.yaml` 文件加载属性。在这个例子中，您可以看到任务的输出被写入文件：`output/brands.md`。

请注意，我们已经明确指定了完成此任务所需使用的工具：`BrandsTool()` 这使得执行任务的代理更加专注，减少了混淆。

### 第6步：团队

> 在crewAI中，团队代表了一组协作的智能体，共同完成一系列任务。每个团队定义了任务执行、智能体协作和整体工作流程的策略。

[https://docs.crewai.com/core\-concepts/Crews/](https://docs.crewai.com/core-concepts/Crews/)

团队是将一切联系在一起的基础。它创建智能体、任务和工具的实例，并指定团队的执行细节。这就是“实践与理论结合”的地方。

### 代码片段：crew.py

### 创建 LLM

第 10 - 24 行创建了代理使用的 LLM。在这里，您可以从 Groq 或 Azure OpenAI 创建 LLM，或者正如我们在后面的文章中将看到的，您可以为您的团队中的不同代理使用两者。

### 创建团队

类 Part1Crew 在第 27 行到第 82 行定义（注意：为了简洁起见，某些行被省略；完整代码请参见：[https://github.com/helipilot50/criteo\-retail\-media\-crew\-ai/blob/main/part\_1/src/part\_1/crew.py](https://github.com/helipilot50/criteo-retail-media-crew-ai/blob/main/part_1/src/part_1/crew.py)）

第 73 行到第 82 行将团队定义为类中的一个函数/方法。该过程是顺序的，这意味着任务将按照定义的顺序执行。我们已将 verbose 标志设置为 true，以便查看文件中的详细活动日志：`output/part_1.log`

### 第7步 运行团队

要运行团队，请在终端中输入以下命令。

```python
crewai run
```
确保您正在使用正确的 Poetry 环境。如果您检查环境，可以避免许多令人沮丧的小时、白发和脏话：

```python
poetry env info
```
每个任务将其结果输出到一个文件中；这些文件是：

* **accounts**: `output/accounts.md`
* **brands**: `output/brands.md`
* **retailers**: `output/retailers.md`

以下是零售商输出的示例：

```python
| Retailer ID | Retailer Name | Campaign Eligibilities |
|-------------|---------------|------------------------|
| 314159      | Marysons      | auction, preferred     |
                        ...
| 398687      | Office Stuff  | auction, preferred     |
| 873908      | GAI Group     | auction, preferred     |
```

## 结论

**总结**：我们已经看到如何使用零售媒体 API 作为 CrewAI 中代理和任务的工具。这是一个相对简单的示例，展示了如何进行设置和连接这些技术的“管道”。

**后续步骤**：如果您还没有这样做，请观看 Sam 和 Brandon 的视频。很快，这个系列将会有“第二部分”。

[Code in GitHub](https://github.com/helipilot50/criteo-retail-media-crew-ai/tree/main/part_1)

## 额外资源

### 相关文章：

### 链接：

* **CrewAI** <https://docs.crewai.com/>
* **Groq** <https://groq.com/>
* **Criteo Retail Media APIs** [https://developers.criteo.com/retail\-media/docs/welcome\-to\-criteo](https://developers.criteo.com/retail-media/docs/welcome-to-criteo)
* **源代码** [https://github.com/helipilot50/criteo\-retail\-media\-crew\-ai](https://github.com/helipilot50/criteo-retail-media-crew-ai)

### 喜爱的作者：

**Sam Witteveen** — CEO \& 联合创始人 @ Red Dragon AI / Google Developer Expert for Machine Learning — 发表文章 NeurIPS, EMNLP

* Youtube: <https://www.youtube.com/@samwitteveenai>
* LinkedIn: <https://www.linkedin.com/in/samwitteveen/>













**Brandon Hancock** — CrewAI 高级软件工程师 \| YouTube 内容创作者

* YouTube: <https://www.youtube.com/@bhancock_ai>
* LinkedIn: [https://www.linkedin.com/in/brandon\-hancock\-2925bb125/](https://www.linkedin.com/in/brandon-hancock-2925bb125/)
* 网站: <https://brandonhancock.io/>

