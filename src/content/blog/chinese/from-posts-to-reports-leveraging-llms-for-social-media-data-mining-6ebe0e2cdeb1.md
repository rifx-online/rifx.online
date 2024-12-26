---
title: "从帖子到报告：利用 LLM 进行社交媒体数据挖掘"
meta_title: "从帖子到报告：利用 LLM 进行社交媒体数据挖掘"
description: "本文探讨了如何利用大型语言模型（LLMs）从社交媒体平台（如Instagram）中提取商业相关信息。通过使用数据爬虫、MongoDB数据库和提示工程，用户可以自动化获取餐厅的特价、活动和新菜单信息，并生成结构化的报告。该方法优于传统的网页抓取，能够有效过滤信息噪音，并以CSV或Excel格式存储数据，适用于商业分析和决策支持。"
date: 2024-12-26T04:30:18Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*AImMcgC4HcCxLtYaHnlYrA.jpeg"
categories: ["Programming", "Data Science", "Natural Language Processing"]
author: "Rifx.Online"
tags: ["LLMs", "Instagram", "Instaloader", "MongoDB", "Langchain"]
draft: False

---



### 如何指导LLMs过滤餐厅帖子并提取对业务增长至关重要的见解。



### 应用概述

我们正处于自动化的黄金时代，这得益于大型语言模型（LLMs）的崛起。从改变行业到解锁无尽的应用，LLMs彻底改变了我们与数据的互动方式，主要通过自然语言。

在本文中，我将向您展示如何指示LLM穿透社交媒体的噪音，提取最重要的信息。具体来说，我们将深入探讨如何挖掘Instagram上的餐厅帖子，以收集有价值的数据——例如特价优惠、折扣和活动——并将其汇编成一份简洁的每周报告。

### 为什么这很有用？

正如古老的谚语所说，**“知识就是力量。”**

使用本文中介绍的算法，您可以在特定领域获取所有重要数据，只需按下一个按钮，让LLM完成所有工作，从而将您寻找这些数据的时间减少到0。

稍后在本文中，我还将向您展示如何将这些数据以易于阅读的结构写入**CSV**或**EXCEL**中，以便于存储或数据查询/过滤。

这种方法比旧的网页爬虫/抓取方法先进得多，因为在LLM的帮助下，我们可以根据自己的需求过滤提取的内容，只关注我们感兴趣的部分。

### 目录：

1\. 数据爬取2\. 数据存储3\. 提示工程4\. LLM 使用5\. 响应格式化6\. 整合所有内容

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*3jAV-0Cy_VrJvyD1nNnJhw.jpeg)

## 1\. 数据爬取

**免责声明**：根据您的地区，此实现可能对您无效，因为不同的法规适用于网络爬取。（这是在罗马尼亚IP下测试的）

**数据爬虫**（或网络爬虫）是一个自动化程序或脚本，系统地浏览互联网以收集和索引来自网站的数据。

在本例中，我们将使用 [**Instaloader**](https://instaloader.github.io/) **\[2],** 一个处理爬取方面的Python库，它将为我们提供关于**公开**Instagram个人资料的所有信息。


```python
class InstagramCrawler:
    def __init__(self, page_name: str, proxy=None):
        self.page_name = page_name
        self.loader = instaloader.Instaloader()
        self._until = datetime.now()
        self._since = self._until - timedelta(days=7)

    def scrap(self) -> List[Dict[str, str | Any]]:
        profile = instaloader.Profile.from_username(self.loader.context, self.page_name)
        posts = takewhile(lambda p: p.date > self._since, dropwhile(lambda p: p.date > self._until, profile.get_posts()))

        return [
            {'content': post.caption, 'date': post.date, 'link': f"https://www.instagram.com/{self.page_name}"}
            for post in posts
        ]
```
在这里，我们使用 `datetime.now()` 获取运行时的确切日期，并减去7天，以便只获取上周的帖子。

我们还需要一个 **config.py** 模块来创建一个 **Settings** 类，在其中我们将保留所有常量，并将环境秘密传递到其他方法中，以便稍后访问，而不是做类似于： **os.getenv('SOME\_ENV\_VALUE')** 的事情。

这通过 Pydantic 的 **BaseSettings** 类来实现。

如果您不知道 Pydantic 是什么，我建议阅读其文档。Pydantic 模型在 Python 编程中至关重要，我将在本文稍后讨论它们。


```python
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8', extra='ignore')

    # OPENAI
    OPENAI_API_KEY: str
    OPENAI_MODEl: str = "gtp-4o-mini"

    # DB
    MONGO_HOST: str = 'localhost'
    MONGO_PORT: int = 27017
    MONGO_USER: str = None
    MONGO_PASSWORD: str = None
    MONGO_DATABASE: str = 'restaurants'
    MONGO_URI: str = f"mongodb://{MONGO_USER}:{MONGO_PASSWORD}@{MONGO_HOST}:{MONGO_PORT}"

    # 要爬取的个人资料
    PROFILES_TO_SCRAP: dict = {
        "KFC": {"page_name": "kfc", "city": "Salt Lake"},
        "MC": {"page_name": "mcdonalds", "city": "San Bernardino"},
        "In-N-Out Burger": {"page_name": "innout", "city": "Baldwin Park"},
        "Taco Bell": {"page_name": "tacobell", "city": "Downey"},
        "Wendy's": {"page_name": "wendys", "city": "Columbus"},
    }


settings = Settings()
```

## 2\. 数据存储

我还添加了一个数据库，在这种情况下是 [**MongoDB**](https://www.mongodb.com/)**,** 因为我们处理的是非结构化数据。这样，如果我们想稍后对提取的帖子做些什么，就可以存储它们（小心总比后悔好**）。**


```python
from pymongo.errors import ConnectionFailure
from pymongo import MongoClient
from config import settings


class DatabaseConnection:
    _client: MongoClient = None

    @classmethod
    def connect(cls):
        if cls._client is None:
            try:
                cls._client = MongoClient(settings.MONGO_URI)
            except ConnectionFailure as exc:
                print(f'Exception while connecting to database: {exc}')
                raise

    @classmethod
    def get_database(cls, name: str):
        if cls._client is None:
            cls.connect()
        return cls._client[name]

    @classmethod
    def close(cls):
        if cls._client is not None:
            cls._client.close()


database = DatabaseConnection.get_database(settings.MONGO_DATABASE)
```
数据库在本地运行于一个 [**Docker**](https://www.docker.com/) 容器内。


```python
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    container_name: mongo_db
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}

volumes:
  mongo-data:
```

## 3\. 提示工程

提示工程可以总结为设计和优化提示，以有效引导语言模型或AI系统的行为。它涉及到精心制作输入，以优化模型的输出，确保生成准确、相关和连贯的响应，满足用户的需求。简单来说，可以将其视为调整输入以最大化输出质量的过程。

这就是该应用程序中魔法发生的地方。

在此步骤中，我们定义我们的大型语言模型（LLM）的行为，并指示它寻找和提取哪些信息。

我们还通过设置第二个提示来避免幻觉，以精炼响应。该组件位于 **templates.py** 模块中。

```python
PROFILES_REPORT_TEMPLATE = (
    "You're a Restaurnat specialist. Analyze social media posts from various restaurant pages and create a concise report extracting the following information:\n"
    "1. Giveaways\n"
    "2. Events (including dates)\n"
    "3. Deals and discounts (e.g., price reductions, 1+1 offers)\n"
    "4. New menu items\n"
    "For each item, include:\n"
    "- Restaurant page name"
    "- Post link"
    "- Restaurant location (city)\n"
    "Only include information from the provided posts that fits these categories. Avoid descriptive posts about dishes unless they mention specific offers or discounts.\n"
    "Posts to analyze: {input_var}"

)

PROFILES_TEMPLATE_REFINE = (
    "You're a restaurant specialist who has generated a report on various restaurant social media posts.\n"
    "Previous report: {raport}\n"
    "This report needs to be more concise and follow a predefined structure:\n"
    "1. Analyze your previous report.\n"
    "2. Adapt the report to the following structure: {format_instructions}\n"
    "If there's no relevant information for a key, leave it as an empty list\n."
    "Your response should only contain the specified structure, without ```json ``` tags."
)
```
**第一个提示**旨在从社交媒体帖子（如Instagram或Facebook）中提取特定类型的信息，专注于相关的商业信息。

餐厅经常发布关于活动、促销或新项目的内容，这些内容通常与菜品描述或美学照片等无关内容混合在一起。该提示的目标是过滤噪音，提取关键的商业相关数据。

**第二个提示**是一个精炼阶段，以确保初始输出符合预定义结构，并更加简洁。

在初步提取后，我们仍可能遇到格式不完美或过于冗长的数据。该提示确保模型重新分析并正确格式化数据，同时删除不必要的信息。

## 4\. LLM 使用

在这一步，工作量不大。我们需要一种方法来创建对话链。

在这里，我们设置与 LLM 相关的所有内容，如模型名称。我们传递提示并将所有可能使用的变量注入其中，例如在上述第一个提示的情况下从数据库提取的帖子。

为了实现这一点，我们将使用 [**Langchain**](https://python.langchain.com/docs/introduction/) **\[3]**，这是一个旨在围绕大型语言模型 (LLMs) 构建应用程序的框架。它提供了管理提示、将 LLM 连接到外部数据源、处理 **操作链**，以及将模型集成到聊天机器人或问答系统等应用程序中的工具，使开发 AI 驱动的应用程序变得更加容易。

```python
from langchain.chains.llm import LLMChain
from langchain_core.prompts import PromptTemplate


def get_chain(llm, template: str, input_variables=None, verbose=True, output_key=""):
    return LLMChain(
        llm=llm,
        prompt=PromptTemplate(
            input_variables=input_variables, template=template, verbose=verbose
        ),
        output_key=output_key,
        verbose=verbose,
    )
```
对于这个应用中的 LLM，我选择使用 [OpenAI](https://openai.com/) 模型，因为它使用简单，因此要使用此方法，您需要一个 `OPENAI_API_KEY` 。

如果您不想使用 OpenAI，您可以尝试使用 Grok API，它具有相同的 API 接口。

## 5\. 响应格式化

使用生成性人工智能通常会产生多样的响应，这些响应有时可能包含不准确的信息或缺乏相同的结构。

如果我们想在 Excel 或 CSV 中编写报告，这将是个坏消息，因为如果没有预定义的结构，在写入文件时可能会出现各种错误。

然而，好消息是，我们可以通过使用 [P**ydantic**](https://docs.pydantic.dev/latest/) **\[4]**（再次）来解决这个问题。它允许开发者使用 Python 类定义数据模型，确保数据遵循指定的 **类型** 和 **约束**，同时提供自动类型转换和详细的错误信息。

在这里，我们实现了 3 个 pydantic 类，这些类将被传递到上面呈现的第二个提示中，以格式化 LLM 响应为可以稍后写入 EXCEL 的预定义结构。

```python
from pydantic import BaseModel, Field


class InformationProfiles(BaseModel):
    name: str = Field(description='信息提取页面的名称')
    information: str = Field(description='为指定键提取的信息。')
    link: str = Field(description='信息提取的帖子的链接。')
    city: str = Field(description='餐厅所在的城市。')


class FieldProfiles(BaseModel):
    name: str = Field(description='键的名称。可用选项包括：赠品、优惠和折扣、活动。')
    keys: list[InformationProfiles] = Field(description='餐厅及其相关信息的列表。')


class ReportProfiles(BaseModel):
    name: str = Field(description='报告名称：报告餐厅新闻')
    fields: list[FieldProfiles] = Field(description='此报告的所有相关键的列表。')
```

## 6\. 整合所有内容

我们只需在我们的 **report\_generator.py** 模块中整合所有内容。

为此，我们将创建一个类来封装所有逻辑：


```python
import datetime
import io
import json

import pandas as pd

from typing import List, Dict, Any
from langchain_core.output_parsers import PydanticOutputParser
from langchain_openai import ChatOpenAI

from src.config import settings
from src.crawler import InstagramCrawler
from src.db import database
from src.llm import get_chain
from schemas import ReportProfiles
from templates import PROFILES_REPORT_TEMPLATE, PROFILES_TEMPLATE_REFINE


class ReportGenerator:
    def __init__(self):
        self.crawler = InstagramCrawler()
        self.database = database
        self.llm = ChatOpenAI(model_name=settings.OPENAI_MODEl, api_key=settings.OPENAI_API_KEY)

    def crawl_and_store_posts(self):
        posts = self.crawler.get_posts(settings.PROFILES_TO_SCRAP)
        posts_collection = self.database['instagram_posts']
        for post in posts:
            posts_collection.update_one(
                {'link': post['link']},
                {'$set': post},
                upsert=True
            )
        return len(posts)

    def get_posts_from_db(self) -> List[Dict[str, Any]]:
        posts_collection = self.database['instagram_posts']
        end_date = datetime.datetime.now()
        start_date = end_date - datetime.timedelta(days=7)
        return list(posts_collection.find({
            'date': {'$gte': start_date, '$lte': end_date}
        }))

    @staticmethod
    def get_posts_text(posts: List[Dict[str, Any]]) -> List[str]:
        unique_posts = set()
        for post in posts:
            post_text = post.get("content", "")
            page_text = post.get("restaurant_name", "")
            link_text = post.get("link", "")
            city_text = post.get("city", "")

            if post_text:
                unique_posts.add(f"{post_text} | {page_text} | {link_text} | {city_text}\n")

        return list(unique_posts)

    def create_report(self, posts: List[str]) -> str:
        chain_1 = get_chain(
            self.llm,
            PROFILES_REPORT_TEMPLATE,
            input_variables=["input_var"],
            output_key="report",
        )

        result_1 = chain_1.invoke({"input_var": posts})
        report = result_1["report"]

        output_parser = PydanticOutputParser(pydantic_object=ReportProfiles)
        format_output = {"format_instructions": output_parser.get_format_instructions()}

        chain_2 = get_chain(
            self.llm,
            PROFILES_TEMPLATE_REFINE,
            input_variables=["raport", "format_instructions"],
            output_key="formatted_report",
        )

        result_2 = chain_2.invoke({"raport": report, "format_instructions": format_output})

        return result_2["formatted_report"]

    @staticmethod
    def create_excel_file(data: Dict[str, Any]):
        rows = []
        excel_filename = f"Profiles_report_{datetime.datetime.now().strftime('%Y-%m-%d')}.xlsx"

        report_name = data.get("name", "未知报告")
        for field in data.get("fields", []):
            field_name = field.get("name", "未知字段")
            for key in field.get("keys", []):
                rows.append({
                    "报告类型": report_name,
                    "信息类型": field_name,
                    "来源": key.get("name", "无名称"),
                    "信息": key.get("information", "无信息"),
                    "链接": key.get("link", "无链接"),
                    "城市": key.get("city", "无城市"),
                })

        df = pd.DataFrame(rows)
        buffer = io.BytesIO()
        df.to_excel(buffer, index=False)
        buffer.seek(0)

        return buffer, excel_filename

    def generate_report(self):
        # 第一步：抓取并存储Instagram帖子
        posts_count = self.crawl_and_store_posts()
        print(f"抓取并存储了 {posts_count} 条帖子。")

        # 第二步：从数据库中检索帖子
        db_posts = self.get_posts_from_db()
        print(f"从数据库中检索了 {len(db_posts)} 条帖子。")

        # 第三步：处理帖子并创建报告
        posts_text = self.get_posts_text(db_posts)
        report_data_str = self.create_report(posts_text)
        print(f"从帖子生成的报告：{report_data_str}")

        # 解析JSON字符串
        try:
            report_data = json.loads(report_data_str)
        except json.JSONDecodeError:
            print("错误：无法将报告数据解析为JSON。")
            return None

        # 第四步：创建Excel文件
        excel_buffer, excel_filename = self.create_excel_file(report_data)

        # 第五步：保存Excel文件
        with open(excel_filename, 'wb') as f:
            f.write(excel_buffer.getvalue())

        print(f"Excel文件 '{excel_filename}' 创建成功。")
        return excel_filename
```
`generate_report()` 方法是这个应用程序的“**入口点**”，其中包含生成每周报告所需的所有步骤。

由于这个类比较大，我将详细说明 **generate\_report()** 方法中呈现的每个步骤：

**1**. `self.crawl_and_store_posts()`：

此方法从选定的Instagram个人资料中检索上周的帖子并将其存储在我们的数据库中。

**2\.** `self.get_posts_from_db()` :

在这里，我们提取所有存储在数据库中的帖子，同时根据日期应用过滤逻辑，因为我们可能有来自前几周的帖子存储在数据库中，不想检索它们。

**3\.** `self.get_posts_text()` 和 `self.create_report()` :

第一个方法用于提取我们将作为输入变量传递给提示的所有信息，这些信息来自返回的数据库模型。

然后我们有第二个方法，LLM接收提示并创建报告。

**4\.** `self.create_excel_file()` :

在这一步之前，我们首先需要调用 `json.loads(report_data_str)`，以便使用JSON格式来写入EXCEL。如果我们在这里打印，报告可能看起来像这样：


```python
{
  "name": "REPORT RESTAURANTS NEWS",
  "fields": [
    {
      "name": "Giveaways",
      "keys": []
    },
    {
      "name": "Deals and Discounts",
      "keys": []
    },
    {
      "name": "Events",
      "keys": [
        {
          "name": "Taco Bell",
          "information": "Early access event for the disha hot discovery box on 9/24 & 9/25.",
          "link": "https://www.instagram.com/tacobell",
          "city": "Downey"
        }
      ]
    }
  ]
}
```
该应用程序可以通过在终端中使用以下命令高效运行： `make setup` 和 `make run`，或者您可以使用 `make help` 查看所有可用命令的列表。

## 结论

我希望通过阅读本文（或像某些人那样跳过代码行 🤫），您已经学会了如何使用 LLM 从社交媒体平台提取信息。

我也认为，学习的最佳方式是将知识付诸实践，我鼓励您将我在这里实现的内容进行定制，以满足您自己的需求。

此应用程序可以根据任何用例进行更改，并可以与其他爬虫集成，以便从不同的社交媒体网站获取数据。

> *您可以在 GitHub 上找到完整代码 [**这里**](https://github.com/decodingml/articles-code/tree/main/articles/generative_ai/data_extraction_from_social_media_posts_using_llms) **\[1]**。*

最后，我要特别感谢 Decoding ML 的团队，让我第一次作为客座作者。对此机会以及我从他们身上学到的东西，我非常感激。

我鼓励您关注 Substack 上的 ***每周*** 𝗗𝗲𝗰𝗼𝗱𝗶𝗻𝗴 𝗠𝗟 𝗡𝗲𝘄𝘀𝗹𝗲𝘁𝘁𝗲𝗿，获取更多 *顶尖* 文章，涵盖生产 AI 和 MLOps。

## 参考文献

\[1] [使用LLM从社交媒体帖子中提取数据 — Github仓库](https://github.com/decodingml/articles-code/tree/data_extraction_from_social_media_posts) (2024\)，Decoding ML GitHub组织

\[2] [Instaloader文档](https://instaloader.github.io/) (2024\)，Instaloader

\[3] [Langchain文档](https://python.langchain.com/docs/introduction/) (2024\)，Langchain

\[4] [Pydantic文档](https://docs.pydantic.dev/latest/) (2024\)，Pydantic

