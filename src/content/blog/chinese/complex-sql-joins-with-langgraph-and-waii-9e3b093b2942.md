---
title: "使用 LangGraph 和 Waii 进行复杂 SQL 连接"
meta_title: "使用 LangGraph 和 Waii 进行复杂 SQL 连接"
description: "本文探讨了LangGraph与Waii的结合如何提升会话式数据分析的能力，特别是通过自然语言生成复杂的SQL查询。Waii的文本到SQL功能支持高精度的复杂连接、可扩展的表选择和查询优化，增强了LangGraph在数据访问中的智能。通过构建知识图谱和智能流，Waii能有效处理复杂的数据库连接，支持非技术用户进行深入的数据分析。潜在应用广泛，涵盖商业智能、医疗、金融等多个领域。"
date: 2024-11-25T15:00:22Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*6FpPJy42rSn_Hy7SvAQ5jw.png"
categories: ["Natural Language Processing", "Programming", "Data Science"]
author: "Rifx.Online"
tags: ["LangGraph", "Waii", "text-to-SQL", "knowledge-graph", "conversational-analytics"]
draft: False

---





在快速发展的数据分析领域，通过自然语言与数据互动的能力变得愈发重要。会话式分析旨在使复杂的数据结构对没有专业技术技能的用户更易于访问。

LangGraph 是一个用于构建有状态的多代理应用程序的框架，使用语言模型。Waii 提供文本到 SQL 和文本到图表的功能，使与数据库和数据可视化的自然语言交互成为可能。

本文探讨了 Waii 的功能如何增强 LangGraph 应用于会话式分析的能力。我们将重点关注 Waii 处理数据库中复杂连接的方法，这是从自然语言查询生成准确 SQL 的关键方面。

## Waii的文本到SQL能力

在对话分析的核心是将自然语言转换为数据库操作的能力。Waii提供了一种全面的文本到SQL解决方案，在几个关键领域中脱颖而出：

* 高精度的复杂模式连接
* 大型数据库的可扩展表选择
* 定制编译器以确保语法正确性和查询优化
* 专门的代理流程用于过滤器、排序顺序、常见指标等

在接下来的部分中，我们将深入探讨Waii如何处理复杂的连接。我们专注于这一点，因为它是对话分析的基本能力，而许多现有解决方案在这方面面临挑战。我们将检查一个示例，查看连接是如何构建的，并解释如何轻松将Waii集成到您现有的LangGraph应用程序中，以实现这些收益。

## 深入探讨：连接处理

## 示例

想象一下，一个流媒体平台的数据团队负责创建一个全面的导演表现仪表板。他们需要通过结合电影、电视剧、类型、关键词、奖项和演员合作的数据来分析什么使导演成功。

## 指令

创建一个视图，提供前 5 位导演（按标题数量排序）的以下信息：

* 导演姓名
* 标题总数
* 最常见的类型
* 最常见的关键词
* 获得的奖项数量
* 电影总收入
* 与他们合作过的演员列表

## 查询

根据这些指令生成的完整查询可在附录A中找到。以下是一个小片段，展示了一些连接：


```python
...
FROM ranked_directors AS rd
INNER JOIN movie_db.movies_and_tv.people AS p
    ON rd.people_id = p.people_id
LEFT JOIN combined_director_genres AS cdg
    ON rd.people_id = cdg.people_id AND cdg.genre_rank = 1
LEFT JOIN combined_director_keywords AS cdk
    ON rd.people_id = cdk.people_id AND cdk.keyword_rank = 1
LEFT JOIN director_awards AS da
    ON rd.people_id = da.people_id
LEFT JOIN director_revenue AS dr
    ON rd.people_id = dr.people_id
LEFT JOIN director_actors AS d_actors
    ON rd.people_id = d_actors.people_id
...
```

## 查询分析

此查询展示了许多复杂的连接能力：

1. **复杂连接图：** 查询中使用了 14 个具有不同限定符、基数和语义的表。
2. **桥接表连接：** 用于连接多对多关系中的实体（例如，导演与电影、电视剧和演员之间的关系）。
3. **维度表连接：** 用于通过类型和关键词表丰富数据的描述性信息。
4. **复杂连接链：** 实现了连接远程实体，例如通过合作作品将导演与演员联系起来。
5. **全外连接：** 用于结合导演在电影和电视剧中的作品，确保全面覆盖。
6. **左连接用于可选数据：** 当包括可能并非所有导演都有的数据时应用（例如，奖项、收入）。

（此列表并不详尽，还有许多其他考虑因素用于准确处理连接，例如：on 和 where 子句之间的区别、连接顺序、非等值连接、用于半结构化数据的侧连接等）

理解和表示数据库关系的 Waii 方法的关键。其工作原理如下：

## 知识图谱构建

Waii 自动构建数据库对象的综合知识图谱。该图谱整合了来自多个来源的信息：

* 模式信息
* 约束（例如，主键/外键）
* 基于分析列名和数据模式的预测
* 从查询历史中提取和排名的连接图
* 数据库文档
* 在数据目录中定义的关系
* 随着时间推移的系统使用反馈

该图谱会持续更新和完善。每次模式更改、新查询和新反馈都会被分析并整合到图谱中。

## Agentic Flows for Query Construction

在知识图谱建立后，Waii 使用一系列智能流来构建最佳查询：

**1\. 表选择：** 分析用户的请求，以识别最相关的表。利用常见的连接关系和对关系语义的理解，找到可能与用户输入没有直接语义联系的表和路径。

**2\. 连接图分析：** 提出并评估所选表之间的潜在连接路径。这包括评分连接图与先前看到的连接的对齐程度以及对关系的语义理解。

**3\. 连接条件的评估/细化：** 单独检查，以确保外连接和连接条件应用正确。在这里，我们还会查看外连接的“on”与“where”子句条件。

**3\. 查询构建：** 基于选择的连接图和条件构建 SQL 查询。

**4\. 编译和优化：** 确保连接在语法上正确并针对性能进行了优化。我们还会强制用户对查询施加的操作约束（例如，最大输出行数，最大输入分区）。

结果是一个 SQL 查询，不仅准确回答用户的问题，而且以优化特定数据库结构和查询引擎的方式进行。

## 构建对话分析应用程序

现在我们了解了Waii如何处理连接和文本到SQL的转换，让我们探索如何结合LangGraph利用这一能力来构建一个复杂的对话分析应用程序。

LangGraph是构建智能系统的事实标准框架。对于任何需要精确、深思熟虑的数据库访问的LangGraph应用程序，Waii都是一个很好的补充。将Waii与LangGraph集成，允许开发人员创建在交互中保持上下文的同时执行复杂查询的系统，从而提升应用程序的整体智能。

## 实施细节

实施该系统涉及几个关键组件：

**1\. LangGraph 框架：** 提供多代理系统的整体结构，管理状态和代理交互。

**2\. Waii API 集成：** SQL 生成和可视化代理将调用 Waii 的 API，以利用其文本到 SQL 和文本到图表的能力。

**3\. 自然语言处理：** 用于理解用户输入并生成可读的响应。

**4\. Waii 执行 API：** 执行生成的 SQL 查询以访问实际数据库。注入代码以强制执行用户级安全策略，例如限制行/列访问。

**5\. 状态管理：** 在多个用户交互中保持上下文，允许后续问题和迭代分析。

典型交互的流程可能如下所示：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*i0r1JDT9zfKC1BDxQVAs3A.png)

1. 用户输入问题。
2. LangGraph 问题分类器决定请求是最好从记忆中回答还是从数据库中回答。
3. \[可选\] Waii SQL 生成器创建优化的 SQL 查询。
4. \[可选\] Waii SQL 执行器注入安全约束，执行查询并检索结果。
5. \[可选\] 结果分类器决定输出应该是数据还是可视化。
6. \[可选\] Waii 图表生成器根据数据和元数据创建相关图表。
7. LangGraph 见解生成代理为用户综合最终结果。
8. 循环重复。

（可选/未在图中显示：出现错误或异常时，LangGraph 循环，重写输入并重新生成所需对象。）

在整个过程中，会话管理代理保持状态，允许上下文跟进问题以及更自然、流畅的交互。

示例的完整实现见附录 B。

## Benefits and Use Cases

LangGraph 和 Waii 的数据库访问集成提供了几个关键优势：

1. **可访问性：** 复杂的数据分析通过自然语言交互变得对非技术用户可访问。
2. **分析深度：** 系统能够处理复杂查询，这些查询手动制定将会非常困难。
3. **上下文理解：** 维护的状态允许关于数据进行更自然、上下文相关的对话。
4. **视觉洞察：** 自动生成相关可视化图表增强了对数据的理解。
5. **可扩展性：** 系统能够适应大型复杂数据库，而不会对最终用户的复杂性产生成比例的增加。

潜在的使用案例涵盖多个行业：

* **商业智能：** 高管可以查询复杂的商业数据，而无需学习 SQL 或 BI 工具。
* **医疗保健：** 研究人员可以探索大型医学数据库，关联患者结果中的多种因素。
* **金融：** 分析师可以快速调查市场趋势和公司在多个维度上的表现。
* **电子商务：** 营销团队可以分析客户行为模式以指导战略。
* **教育：** 管理人员可以获得关于学生表现和资源分配的洞察。

## 结论

LangGraph 的多智能体能力与 Waii 的先进文本转 SQL 和可视化功能的结合为分析和数据处理开辟了新的机会。通过使复杂的数据分析通过自然语言变得可访问，这种方法显著降低了从数据中获取高质量洞察的门槛。

我们希望听到您的声音：您今天是如何应对这些挑战的？您正在利用这些能力构建哪些应用程序？

## 附录 A：查询

完整的 SQL 查询如下：


```python
WITH director_movie_count AS (
    SELECT
        mdb.people_id,
        COUNT(m.movie_id) AS movie_count
    FROM movie_db.movies_and_tv.movies_directors_bridge AS mdb
    INNER JOIN movie_db.movies_and_tv.movies AS m
        ON mdb.movie_id = m.movie_id
    GROUP BY
        mdb.people_id
),

director_tv_count AS (
    SELECT
        tsdb.people_id,
        COUNT(ts.tv_series_id) AS tv_count
    FROM movie_db.movies_and_tv.tv_series_directors_bridge AS tsdb
    INNER JOIN movie_db.movies_and_tv.tv_series AS ts
        ON tsdb.tv_series_id = ts.tv_series_id
    GROUP BY
        tsdb.people_id
),

combined_counts AS (
    SELECT
        COALESCE(dmc.people_id, dtc.people_id) AS people_id,
        COALESCE(dmc.movie_count, 0) + COALESCE(dtc.tv_count, 0) AS total_count
    FROM director_movie_count AS dmc
    FULL OUTER JOIN director_tv_count AS dtc
        ON dmc.people_id = dtc.people_id
),

ranked_directors AS (
    SELECT
        combined_counts.people_id,
        combined_counts.total_count,
        RANK() OVER (ORDER BY combined_counts.total_count DESC NULLS LAST) AS rank
    FROM combined_counts
),

director_genres AS (
    SELECT
        rd.people_id,
        g.name AS genre_name,
        COUNT(*) AS genre_count
    FROM ranked_directors AS rd
    LEFT JOIN movie_db.movies_and_tv.movies_directors_bridge AS mdb
        ON rd.people_id = mdb.people_id
    LEFT JOIN movie_db.movies_and_tv.movies_genres_bridge AS mgb
        ON mdb.movie_id = mgb.movie_id
    LEFT JOIN movie_db.movies_and_tv.genres AS g
        ON mgb.id = g.id
    GROUP BY
        rd.people_id,
        g.name
    UNION ALL
    SELECT
        rd.people_id,
        g.name AS genre_name,
        COUNT(*) AS genre_count
    FROM ranked_directors AS rd
    LEFT JOIN movie_db.movies_and_tv.tv_series_directors_bridge AS tsdb
        ON rd.people_id = tsdb.people_id
    LEFT JOIN movie_db.movies_and_tv.tv_series_genres_bridge AS tsgb
        ON tsdb.tv_series_id = tsgb.tv_series_id
    LEFT JOIN movie_db.movies_and_tv.genres AS g
        ON tsgb.id = g.id
    GROUP BY
        rd.people_id,
        g.name
),

combined_director_genres AS (
    SELECT
        director_genres.people_id,
        director_genres.genre_name,
        SUM(director_genres.genre_count) AS total_genre_count,
        RANK()
            OVER (PARTITION BY director_genres.people_id ORDER BY SUM(director_genres.genre_count) DESC NULLS LAST)
            AS genre_rank
    FROM director_genres
    GROUP BY
        director_genres.people_id,
        director_genres.genre_name
),

director_keywords AS (
    SELECT
        rd.people_id,
        k.name AS keyword_name,
        COUNT(*) AS keyword_count
    FROM ranked_directors AS rd
    LEFT JOIN movie_db.movies_and_tv.movies_directors_bridge AS mdb
        ON rd.people_id = mdb.people_id
    LEFT JOIN movie_db.movies_and_tv.movies_keywords_bridge AS mkb
        ON mdb.movie_id = mkb.movie_id
    LEFT JOIN movie_db.movies_and_tv.keywords AS k
        ON mkb.id = k.id
    GROUP BY
        rd.people_id,
        k.name
),

combined_director_keywords AS (
    SELECT
        director_keywords.people_id,
        director_keywords.keyword_name,
        SUM(director_keywords.keyword_count) AS total_keyword_count,
        RANK()
            OVER (
                PARTITION BY director_keywords.people_id ORDER BY SUM(director_keywords.keyword_count) DESC NULLS LAST
            )
            AS keyword_rank
    FROM director_keywords
    GROUP BY
        director_keywords.people_id,
        director_keywords.keyword_name
),

director_awards AS (
    SELECT
        pab.people_id,
        COUNT(*) AS award_count
    FROM movie_db.movies_and_tv.people_awards_bridge AS pab
    INNER JOIN movie_db.movies_and_tv.awards AS a
        ON pab.award_id = a.award_id
    WHERE
        a.iswinner = 'True'
    GROUP BY
        pab.people_id
),

director_revenue AS (
    SELECT
        mdb.people_id,
        SUM(m.revenue) AS total_revenue
    FROM movie_db.movies_and_tv.movies_directors_bridge AS mdb
    INNER JOIN movie_db.movies_and_tv.movies AS m
        ON mdb.movie_id = m.movie_id
    GROUP BY
        mdb.people_id
),

director_actors AS (
    SELECT DISTINCT
        rd.people_id,
        p.name AS actor_name
    FROM ranked_directors AS rd
    LEFT JOIN movie_db.movies_and_tv.movies_directors_bridge AS mdb
        ON rd.people_id = mdb.people_id
    LEFT JOIN movie_db.movies_and_tv.movies_actors_bridge AS mab
        ON mdb.movie_id = mab.movie_id
    LEFT JOIN movie_db.movies_and_tv.people AS p
        ON mab.people_id = p.people_id
    UNION
    SELECT DISTINCT
        rd.people_id,
        p.name AS actor_name
    FROM ranked_directors AS rd
    LEFT JOIN movie_db.movies_and_tv.tv_series_directors_bridge AS tsdb
        ON rd.people_id = tsdb.people_id
    LEFT JOIN movie_db.movies_and_tv.tv_series_actors_bridge AS tsab
        ON tsdb.tv_series_id = tsab.tv_series_id
    LEFT JOIN movie_db.movies_and_tv.people AS p
        ON tsab.people_id = p.people_id
)

SELECT
    p.name,
    rd.total_count AS number_of_titles,
    ARRAY_AGG(DISTINCT cdg.genre_name) AS most_frequent_genres,
    ARRAY_AGG(DISTINCT cdk.keyword_name) AS most_frequent_keywords,
    COALESCE(da.award_count, 0) AS award_count,
    COALESCE(dr.total_revenue, 0) AS total_revenue,
    ARRAY_AGG(DISTINCT d_actors.actor_name) AS actors_worked_with
FROM ranked_directors AS rd
INNER JOIN movie_db.movies_and_tv.people AS p
    ON rd.people_id = p.people_id
LEFT JOIN combined_director_genres AS cdg
    ON rd.people_id = cdg.people_id AND cdg.genre_rank = 1
LEFT JOIN combined_director_keywords AS cdk
    ON rd.people_id = cdk.people_id AND cdk.keyword_rank = 1
LEFT JOIN director_awards AS da
    ON rd.people_id = da.people_id
LEFT JOIN director_revenue AS dr
    ON rd.people_id = dr.people_id
LEFT JOIN director_actors AS d_actors
    ON rd.people_id = d_actors.people_id
WHERE
    rd.rank <= 5
GROUP BY
    p.name,
    rd.total_count,
    da.award_count,
    dr.total_revenue
ORDER BY
    rd.total_count DESC NULLS LAST,
    p.name ASC
```

## 附录 B：LangGraph 应用程序

这是完整的 LangGraph 应用程序（也在 [github](https://github.com/waii-abi/langgraph-waii) 上）：

```python
import os
import sys
from typing import List, Optional, Dict, Any

import pandas as pd
import plotly
from pydantic import BaseModel
from langgraph.graph import StateGraph
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.schema import StrOutputParser
from waii_sdk_py import WAII
from waii_sdk_py.query import QueryGenerationRequest, RunQueryRequest

class State(BaseModel):
    database_description: str = ''
    query: str = ''
    sql: str = ''
    data: List[Dict[str, Any]] = []
    chart: Any = ''
    insight: str = ''
    response: str = ''
    error: Optional[str] = None
    path_decision: str = ""

class LanggraphWorkflowManager:

    def init_waii(self):
        WAII.initialize(url=os.getenv("WAII_URL"), api_key=os.getenv("WAII_API_KEY"))
        WAII.Database.activate_connection(os.getenv("DB_CONNECTION"))

    def create_workflow(self) -> StateGraph:
        workflow = StateGraph(State)

        workflow.add_node("问题分类器", self.question_classifier)
        workflow.add_node("结果分类器", self.result_classifier)
        workflow.add_node("SQL 生成器", self.sql_generator)
        workflow.add_node("SQL 执行器", self.sql_executor)
        workflow.add_node("图表生成器", self.chart_gen)
        workflow.add_node("洞察生成器", self.insight_generator)
        workflow.add_node("结果综合器", self.result_synthesizer)

        workflow.set_entry_point("问题分类器")
        workflow.add_conditional_edges(
            "问题分类器",
            lambda state: state.path_decision,
            {
                "database": "SQL 生成器",
                "visualization": "图表生成器",
                "general": "洞察生成器"
            }
        )

        workflow.add_edge("SQL 生成器", "SQL 执行器")
        workflow.add_edge("SQL 执行器", "结果分类器")
        workflow.add_conditional_edges(
            "结果分类器",
            lambda state: state.path_decision,
            {
                "visualization": "图表生成器",
                "data": "结果综合器"
            }
        )
        workflow.add_edge("图表生成器", "结果综合器")
        workflow.add_edge("洞察生成器", "结果综合器")
        workflow.add_edge("结果综合器", "问题分类器")

        return workflow

    def question_classifier(self, state: State) -> State:
        state.database_description = self.format_catalog_info(WAII.Database.get_catalogs())
        state.query = input("问题: ")

        prompt = ChatPromptTemplate.from_messages([
            ("human",
             "数据库信息: \n---\n{database_description}\n---\n"
             "如果这个问题可能与数据库中的信息相关，请回答 'database'。否则请回答 'general'。问题: '{query}'。"
             "考虑你对数据库的了解，如果有疑问请回答 'database'")
        ])
        chain = prompt | ChatOpenAI() | StrOutputParser()
        classification = chain.invoke({"query": state.query, "database_description": state.database_description}).strip().lower()
        return state.model_copy(update={"path_decision": classification, "error": None})

    def sql_generator(self, state: State) -> State:
        sql = WAII.Query.generate(QueryGenerationRequest(ask=state.query)).query
        return state.model_copy(update={"sql": sql, "insight":""})

    def sql_executor(self, state: State) -> State:
        data = WAII.Query.run(RunQueryRequest(query=state.sql)).rows
        return state.model_copy(update={"data": data}, deep=True)

    def chart_gen(self, state: State) -> State:
        df_data = pd.DataFrame(state.data)
        chart = WAII.Chart.generate_chart(df=df_data)
        return state.model_copy(update={"chart": chart.chart_spec, "error": None}, deep=True)

    def result_classifier(self, state: State) -> State:
        state.chart = ''
        prompt = ChatPromptTemplate.from_messages([
            ("human",
             "以下问题是由 'data' 还是 'visualization' 最好回答的？问题: '{query}'。"
             "输出: 严格回应 'data' 或 'visualization'。没有其他文本。")
        ])
        chain = prompt | ChatOpenAI() | StrOutputParser()
        classification = chain.invoke({"query": state.query}).strip().lower()
        return state.model_copy(update={"path_decision": classification, "error": None})

    def insight_generator(self, state: State) -> dict:
        prompt = ChatPromptTemplate.from_messages([("human", "{query}")])
        chain = prompt | ChatOpenAI() | StrOutputParser()
        insight = chain.invoke({"query": state.query})
        return state.model_copy(update={"insight": insight, "sql": "", "data": [], "error": None}, deep=True)

    def result_synthesizer(self, state: State) -> State:
        model = ChatOpenAI()
        prompt = ChatPromptTemplate.from_messages([
            ("system", "你是一个分析数据的专家助手"),
            ("human", "\n 用户问题: '{query}'。"
                             "\n 查询结果（如果有）: '{data}'。"
                             "\n LLM 结果（如果有）: '{insight}'。"
                             "\n\n 指令: 用这些信息回答用户。")
        ])
        chain = prompt | model | StrOutputParser()
        data = "\n".join(" | ".join(f"{key}: {value}" for key, value in row.items()) for row in state.data)
        output = chain.invoke({"query": state.query, "data": data, "insight": state.insight}).strip().lower()
        if state.chart:
            df = pd.DataFrame(state.data)
            exec(state.chart.plot)
        print('回答: '+output)
        return state.model_copy(update={"response": output}, deep=True)

    def __init__(self):
        self.workflow = self.create_workflow()
        self.app = self.workflow.compile()
        self.init_waii()
        print(self.app.get_graph().draw_ascii())

    def format_catalog_info(self, catalogs):
        return "\n".join([
            f"数据库: {catalog.name}\n" +
            "\n".join([
                f"  模式: {schema.name.schema_name}\n    描述: {schema.description}"
                for schema in catalog.schemas
            ]) + "\n"
            for catalog in catalogs.catalogs
        ])

    def run_workflow(self):
        while True:
            try:
                initial_state = State()
                app_response = self.app.invoke(initial_state)
            except Exception as e:
                print(f"工作流中出错: {e}。将重新启动。")

LanggraphWorkflowManager().run_workflow()
```

