---
title: "如何使用 LangChain 和 CrewAI 构建人工智能驱动的 SQL 数据分析代理"
meta_title: "如何使用 LangChain 和 CrewAI 构建人工智能驱动的 SQL 数据分析代理"
description: "本文介绍了如何使用LangChain和CrewAI构建一个AI驱动的SQL数据分析代理。通过集成Llama 3模型、SQL数据库工具和基于代理的自动化，用户可以创建一个高效的数据处理管道，实现数据库查询、结果分析和高管报告的自动生成。文章详细说明了环境设置、库安装、数据库创建及代理和任务的定义，旨在提升数据工作流程的生产力和准确性。"
date: 2024-12-07T12:23:24Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*FFS-pBbafNBgg_1t.png"
categories: ["Programming", "Data Science", "Generative AI"]
author: "Rifx.Online"
tags: ["LangChain", "CrewAI", "SQLite", "Llama", "SQL"]
draft: False

---



在当今数据驱动的世界中，自动化数据提取、分析和报告的工作流程对于节省时间和提高效率至关重要。本教程将指导您使用 LangChain 和 CrewAI 构建一个 AI 驱动的 SQL 工作流程。通过集成强大的 Llama 3 模型、SQL 数据库工具和基于代理的自动化，您将学习如何创建一个无缝的管道，以处理数据库查询、分析结果和生成高管报告 — 所有这些都需要最少的手动干预。无论您是数据爱好者、开发人员还是 ML 工程师，本指南将帮助您在数据工作流程中解锁新的生产力水平。



## 环境设置

### 安装依赖

首先，确保您已安装 Python，并使用以下代码设置所需的库：

```python
!pip install langchain-core==0.2.15 langchain-community==0.2.6 'crewai[tools]'==0.32.0 langchain-groq==0.1.5
```
**每个库的说明**：

* `langchain-core`: 提供构建涉及大型语言模型（LLMs）管道的基础工具，使链式操作和复杂工作流成为可能。
* `langchain-community`: 包含社区构建的实用工具和扩展 LangChain 功能的工具，特别用于处理 SQL 数据库。
* `crewai[tools]`: 通过代理、工具和工作流为 LLM 和结构化流程之间的高效协作提供任务自动化支持。
* `langchain-groq`: 集成 Groq 的 LLM 能力，特别针对与 Llama 3 等模型的增强性能进行优化。

### 配置环境变量

一些工具，如 `langchain-groq`，需要 API 密钥进行身份验证。以下是设置 `GROQ_API_KEY` 环境变量的示例。

**代码片段**：

```python
import os
## Replace 'your_groq_api_key' with your actual Groq API Key
os.environ["GROQ_API_KEY"] = "your_groq_api_key"
```
**说明**：

* `os.environ`：用于在 Python 脚本中直接设置环境变量。
* `GROQ_API_KEY`：用于验证您访问 Groq 的 API 以使用 Llama 3 模型的必要密钥。

### 快速提示

如果您正在使用像 Google Colab 这样的笔记本环境，请记得在笔记本开始时包含此设置代码，以确保所有依赖项都已安装，并且 API 密钥已正确配置。

## 如何设置您的 Groq API 密钥

要设置您的 Groq API 密钥，请按照以下步骤操作：

**创建或登录您的 Groq 账户**：

* 访问 Groq 控制台。
* 如果您已有账户，请登录。否则，请注册并完成验证过程。

**生成新的 API 密钥**：

* 登录后，导航到 [API 密钥](https://console.groq.com/keys) 部分。
* 点击“创建 API 密钥”。
* 提供一个易于识别的名称，以便稍后识别。
* 提交以生成密钥。

**安全存储您的 API 密钥**：

* 生成后，您的 API 密钥将被显示。请立即复制，因为可能不会再次显示。
* 安全存储密钥，以防止未经授权的访问。

## 导入必要的库：

```python
import json
import os
import sqlite3
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from textwrap import dedent
from typing import Any, Dict, List, Tuple, Union

import pandas as pd
from crewai import Agent, Crew, Process, Task
from crewai_tools import tool
from google.colab import userdata
from langchain.schema import AgentFinish
from langchain.schema.output import LLMResult
from langchain_community.tools.sql_database.tool import (
    InfoSQLDatabaseTool,
    ListSQLDatabaseTool,
    QuerySQLCheckerTool,
    QuerySQLDataBaseTool,
)
from langchain_community.utilities.sql_database import SQLDatabase
from langchain_core.callbacks.base import BaseCallbackHandler
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
```

## 数据库设置

### 加载数据集

首先，将 `ds-salaries.csv` 数据集加载到 Pandas DataFrame 中。

数据链接：[https://www.kaggle.com/datasets/armandodelahoya/ds\-job\-salaries\-updated\-jan\-2023](https://www.kaggle.com/datasets/armandodelahoya/ds-job-salaries-updated-jan-2023)

```python
import pandas as pd
## Load the dataset into a Pandas DataFrame
file_path = "ds-salaries.csv"  # Replace with the path to your dataset
df = pd.read_csv(file_path)
## Display the first few rows to verify the data
print(df.head())
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*6iBzf_7neQSwILixJZ30pg.png)

### 创建一个SQLite数据库

接下来，创建一个SQLite数据库（`salaries.db`），并用`salaries`表填充它。

```python
import sqlite3
## Establish a connection to the SQLite database
connection = sqlite3.connect("salaries.db")
## Write the DataFrame to the database
df.to_sql(name="salaries", con=connection, if_exists="replace")
```

### 验证数据库设置

重新打开数据库连接并显示示例行以确认数据已成功添加。


```python
## Query the database to fetch sample rows
query = "SELECT * FROM salaries LIMIT 5;"
sample_data = pd.read_sql_query(query, connection)
## Display the sample data
print(sample_data)
```

## 定义一个机制来记录您的程序与LLM之间的交互（可选）

```python
@dataclass
class Event:
    event: str
    timestamp: str
    text: str


def _current_time() -> str:
    return datetime.now(timezone.utc).isoformat()


class LLMCallbackHandler(BaseCallbackHandler):
    def __init__(self, log_path: Path):
        self.log_path = log_path

    def on_llm_start(
        self, serialized: Dict[str, Any], prompts: List[str], **kwargs: Any
    ) -> Any:
        """运行在LLM开始运行时。"""
        assert len(prompts) == 1
        event = Event(event="llm_start", timestamp=_current_time(), text=prompts[0])
        with self.log_path.open("a", encoding="utf-8") as file:
            file.write(json.dumps(asdict(event)) + "\n")

    def on_llm_end(self, response: LLMResult, **kwargs: Any) -> Any:
        """运行在LLM结束运行时。"""
        generation = response.generations[-1][-1].message.content
        event = Event(event="llm_end", timestamp=_current_time(), text=generation)
        with self.log_path.open("a", encoding="utf-8") as file:
            file.write(json.dumps(asdict(event)) + "\n")
```
**目的**：此处理程序提供了一种清晰且可审核的方式来监控LLM交互，记录每个请求的输入和输出。

**好处**：

* 提高工作流程的透明度。
* 通过保持详细的交互日志来促进调试。
* 通过存储时间戳和内容来确保结果的可重复性。

**示例用法**：

* 初始化LLM时，您可以传递此回调以跟踪所有交互。

## 使用 LangChain 设置 LLM

此步骤演示如何将 LLM (Llama 3\) 集成到使用 LangChain 和之前定义的回调处理程序的工作流程中。

### 配置 LLM

`ChatGroq` 模型被配置为处理提示并返回响应，同时使用 `LLMCallbackHandler` 记录交互。

```python
llm = ChatGroq(
    temperature=0,
    model_name="llama3-70b-8192",
    callbacks=[LLMCallbackHandler(Path("prompts.jsonl"))],
)
```
**温度**：决定 LLM 响应的随机性。

* `0` 的值确保确定性响应，适合 SQL 生成或摘要等精确任务。

**模型名称**：指定正在使用的 Llama 3 模型的版本和配置。

**回调**：附加 `LLMCallbackHandler` 以将所有输入和输出记录到名为 `prompts.jsonl` 的文件中。

您可以使用示例查询测试 LLM 集成。

```python
human = "{text}"
prompt = ChatPromptTemplate.from_messages([("human", human)])

chain = prompt | llm
response = chain.invoke(
    {
        "text": "What is captial of France"
    }
)

print(response.content)
```

## 定义工具：

### 初始化数据库


```python
db = SQLDatabase.from_uri("sqlite:///salaries.db")
```
* **功能**：
* 创建与名为 `salaries.db` 的 SQLite 数据库的连接。
* `from_uri`：允许您使用 URI 指定数据库位置（`sqlite:///` 表示一个 SQLite 数据库文件）。

### 定义一个列出表的工具


```python
@tool("list_tables")
def list_tables() -> str:
    """列出数据库中可用的表"""
    return ListSQLDatabaseTool(db=db).invoke("")
```
**功能**：

* 定义一个名为 `"list_tables"` 的 LangChain 工具，用于列出数据库中的所有表。

**用途**：

* 帮助代理了解数据库的结构，通过识别可用的表。
* 对于模式检索、查询或数据探索等任务至关重要。

**组件**：

* `@tool` **装饰器**：将函数标记为可以在工作流或代理中使用的工具。
* `ListSQLDatabaseTool`：一个预构建的 LangChain 工具，用于查询并返回连接的数据库中的所有表名。
* `.invoke("")`：执行该工具而不需要额外输入，因为列出表不需要参数。

运行工具


```python
list_tables.run()
```
* **功能**：
* 执行 `list_tables` 工具以检索并打印 `salaries.db` 数据库中所有表的名称。

### 定义工具以检索模式详细信息


```python
@tool("tables_schema")
def tables_schema(tables: str) -> str:
    """
    输入是一个以逗号分隔的表名列表，输出是这些表的模式和示例行。
    确保通过先调用 `list_tables` 来验证这些表确实存在！
    示例输入：table1, table2, table3
    """
    tool = InfoSQLDatabaseTool(db=db)
    return tool.invoke(tables)
```
**目的**：

* 此工具提供数据库中指定表的元数据（模式）和示例数据。

**实用性**：

* 提供理解表结构所需的基本元数据。
* 帮助代理高效地构建查询和分析数据。

**组成部分**：

* **输入**：一个以逗号分隔的表名字符串（例如，`"salaries"`）。
* **输出**：指定表的模式详细信息和示例行。

`InfoSQLDatabaseTool`：

* 一种 LangChain 工具，用于检索模式信息和数据预览。
* 需要数据库连接（`db`）。

`tool.invoke(tables)`：

* 使用给定的表名执行工具。
* 以字符串形式返回模式和示例行。

### 定义 execute\_sql 工具


```python
@tool("execute_sql")
def execute_sql(sql_query: str) -> str:
    """Execute a SQL query against the database. Returns the result."""
    return QuerySQLDataBaseTool(db=db).invoke(sql_query)
```
**目的**：直接在数据库上执行 SQL 查询并检索结果。

**组件**：

* **输入**：`sql_query` \- 要执行的 SQL 命令。
* **输出**：查询的结果，通常是数据行。
* `QuerySQLDataBaseTool`：用于在连接的数据库上执行 SQL 命令的 LangChain 工具。

**用法**：在验证查询后运行，以检索特定数据或执行更新。

### 定义 check\_sql 工具


```python
@tool("check_sql")
def check_sql(sql_query: str) -> str:
    """
    Use this tool to double check if your query is correct before executing it.
    Always use this tool before executing a query with `execute_sql`.
    """
    return QuerySQLCheckerTool(db=db, llm=llm).invoke({"query": sql_query})
```
**目的**: 在执行之前验证 SQL 查询的正确性。

**组件**:

* **输入**: `sql_query` \- 要验证的 SQL 命令。
* **输出**: 查询正确性的反馈（例如，语法问题、无效的表名）。
* `QuerySQLCheckerTool`: 使用 LLM (`llm`) 分析和验证查询的潜在问题。

**用法**: 通过确认查询的准确性来防止错误。

## 定义代理：

### 1\. sql\_dev (高级数据库开发人员)

**角色**: 高效构建和执行 SQL 查询。

**目标**: 根据请求生成准确且优化的 SQL 查询。

**能力**:

* 使用 `list_tables`、`tables_schema`、`check_sql` 和 `execute_sql` 等工具与数据库进行交互。

**LLM 集成**: 协助查询生成和优化。


```python
sql_dev = Agent(
    role="Senior Database Developer",
    goal="Construct and execute SQL queries based on a request",
    backstory=dedent(
        """
        You are an experienced database engineer who is master at creating efficient and complex SQL queries.
        You have a deep understanding of how different databases work and how to optimize queries.
        Use the `list_tables` to find available tables.
        Use the `tables_schema` to understand the metadata for the tables.
        Use the `execute_sql` to check your queries for correctness.
        Use the `check_sql` to execute queries against the database.
    """
    ),
    llm=llm,
    tools=[list_tables, tables_schema, execute_sql, check_sql],
    allow_delegation=False,
)
```

### 2\. data\_analyst (高级数据分析师)

**角色**：分析数据库开发人员提供的数据。

**目标**：基于数据创建清晰详细的分析。

**能力**：

* 利用Python和LLM生成洞察。
* 确保分析准确且易于理解。


```python
data_analyst = Agent(
    role="Senior Data Analyst",
    goal="You receive data from the database developer and analyze it",
    backstory=dedent(
        """
        You have deep experience with analyzing datasets using Python.
        Your work is always based on the provided data and is clear,
        easy-to-understand and to the point. You have attention
        to detail and always produce very detailed work (as long as you need).
    """
    ),
    llm=llm,
    allow_delegation=False,
)
```

### 3\. report\_writer (高级报告编辑)

**角色**: 将分析结果总结成简明的执行报告。

**目标**: 在100个字以内有效传达关键见解。

**能力**:

* 使用LLM生成清晰且有影响力的摘要。
* 专注于要点式的执行风格报告。


```python
report_writer = Agent(
    role="Senior Report Editor",
    goal="Write an executive summary type of report based on the work of the analyst",
    backstory=dedent(
        """
        Your writing still is well known for clear and effective communication.
        You always summarize long texts into bullet points that contain the most
        important details.
        """
    ),
    llm=llm,
    allow_delegation=False,
)
```

## 任务定义

### 1\. extract\_data 任务


```python
extract_data = Task(
    description="Extract data that is required for the query {query}.",
    expected_output="Database result for the query",
    agent=sql_dev,
)
```
* **目的**: 处理根据输入查询从数据库中提取数据的任务。
* **代理**: 将任务委托给 `sql_dev`（SQL 开发人员）。
* **输入**: 提取相关数据的查询。
* **输出**: 在数据库上执行的 SQL 查询的结果。

### 2\. analyze\_data 任务


```python
analyze_data = Task(
    description="Analyze the data from the database and write an analysis for {query}.",
    expected_output="Detailed analysis text",
    agent=data_analyst,
    context=[extract_data],
)
```
* **目的**: 分析在前一步中提取的数据。
* **代理**: 将任务委托给 `data_analyst`（数据分析师）。
* **上下文**: 依赖于 `extract_data` 的输出，确保处理相关数据。
* **输出**: 提取数据的详细文本分析。

### 3\. write\_report 任务


```python
write_report = Task(
    description=dedent(
        """
        Write an executive summary of the report from the analysis. The report
        must be less than 100 words.
    """
    ),
    expected_output="Markdown report",
    agent=report_writer,
    context=[analyze_data],
)
```
* **目的**：将分析结果总结成简洁的执行报告。
* **代理**：将任务委托给 `report_writer`（报告撰写者）。
* **上下文**：依赖于 `analyze_data` 的输出，确保总结反映分析内容。
* **输出**：一份少于100字的Markdown格式报告。

## 工作流程

1. `extract_data`: 使用 SQL 查询从数据库中提取相关数据。
2. `analyze_data`: 处理和解释提取的数据。
3. `write_report`: 将分析结果浓缩成简明易懂的报告。

## 定义团队

`Crew` 将定义的代理和任务结合成一个有机的工作流程，自动化整个过程。以下是详细信息：


```python
crew = Crew(
    agents=[sql_dev, data_analyst, report_writer],
    tasks=[extract_data, analyze_data, write_report],
    process=Process.sequential,
    verbose=2,
    memory=False,
    output_log_file="crew.log",
)
```

### 组件

1. `agents`:

**输入**: 一组代理 (`sql_dev`, `data_analyst`, 和 `report_writer`)。

* **目的**: 定义将处理特定任务的角色。
* **代理角色**:
* `sql_dev`: 处理数据库查询。
* `data_analyst`: 分析提取的数据。
* `report_writer`: 总结分析结果。

`tasks`:

* **输入**: 一组任务 (`extract_data`, `analyze_data`, 和 `write_report`)。
* **目的**: 指定工作流程，其中每个任务依赖于前一个任务的输出。

`process`:

* **值**: `Process.sequential`。
* **目的**: 确保任务按顺序执行，每个任务在前一个任务完成之前等待。

`verbose`:

* **值**: `2`。
* **目的**: 控制日志记录的级别：
* 更高的详细程度提供监控任务执行的详细日志。

`memory`:

* **值**: `False`。
* **目的**: 禁用任务之间的内存保留，以确保无状态执行。

`output_log_file`:

* **值**: `"crew.log"`。
* **目的**: 指定一个文件以存储整个过程的详细日志，用于调试和审计。

## 运行团队：

```python
inputs = {
    "query": "根据公司位置、规模和员工经验对薪资（以美元计）的影响"
}

result = crew.kickoff(inputs=inputs)
```

```python
[2024-11-30 13:39:52][DEBUG]: == 工作代理：高级数据库开发人员
 [2024-11-30 13:39:52][INFO]: == 开始任务：提取与查询“根据公司位置、规模和员工经验对薪资（以美元计）的影响”相关的数据。

salaries

 


CREATE TABLE salaries (
 "index" INTEGER, 
 work_year INTEGER, 
 experience_level TEXT, 
 employment_type TEXT, 
 job_title TEXT, 
 salary INTEGER, 
 salary_currency TEXT, 
 salary_in_usd INTEGER, 
 employee_residence TEXT, 
 remote_ratio INTEGER, 
 company_location TEXT, 
 company_size TEXT
)

/*
3 rows from salaries table:
index work_year experience_level employment_type job_title salary salary_currency salary_in_usd employee_residence remote_ratio company_location company_size
0 2023 SE FT Principal Data Scientist 80000 EUR 85847 ES 100 ES L
1 2023 MI CT ML Engineer 30000 USD 30000 US 100 US S
2 2023 MI CT ML Engineer 25500 USD 25500 US 100 US S
*/

 

提供的 SQL 查询似乎是正确的，并且没有包含任何常见错误。以下是最终的 SQL 查询：

```
SELECT company_location, company_size, experience_level, AVG(salary_in_usd) AS avg_salary 
FROM salaries 
GROUP BY company_location, company_size, experience_level
```

 

[('AE', 'L', 'MI', 115000.0), ('AE', 'S', 'SE', 92500.0), ('AL', 'S', 'SE', 10000.0), ('AM', 'S', 'MI', 50000.0), ('AR', 'L', 'EN', 31000.0), ('AR', 'S', 'EN', 13000.0), ('AS', 'L', 'EN', 50000.0), ('AS', 'M', 'EN', 20000.0), ('AS', 'S', 'EN', 18053.0), ('AT', 'L', 'MI', 75141.66666666667), ('AT', 'M', 'EN', 50000.0), ('AT', 'M', 'MI', 61467.0), ('AT', 'S', 'SE', 91237.0), ('AU', 'L', 'EN', 56014.0), ('AU', 'L', 'MI', 71783.75), ('AU', 'L', 'SE', 152383.0), ('AU', 'M', 'EN', 54390.333333333336), ('AU', 'M', 'MI', 53368.0), ('AU', 'M', 'SE', 50000.0), ('AU', 'S', 'EN', 150000.0), ('BA', 'S', 'EN', 120000.0), ('BE', 'L', 'EN', 84053.0), ('BE', 'M', 'MI', 88654.0), ('BE', 'M', 'SE', 82744.0), ('BE', 'S', 'EN', 52008.0), ('BO', 'M', 'MI', 7500.0), ('BR', 'L', 'EN', 11197.0), ('BR', 'M', 'MI', 57698.77777777778), ('BR', 'M', 'SE', 21453.5), ('BR', 'S', 'MI', 12901.0), ('BS', 'M', 'MI', 45555.0), ('CA', 'L', 'EN', 83447.8), ('CA', 'L', 'EX', 159006.5), ('CA', 'L', 'MI', 98364.6), ('CA', 'L', 'SE', 120463.83333333333), ('CA', 'M', 'EN', 59500.0), ('CA', 'M', 'EX', 15000.0), ('CA', 'M', 'MI', 84802.33333333333), ('CA', 'M', 'SE', 152392.45283018867), ('CA', 'S', 'EX', 115222.0), ('CA', 'S', 'MI', 75000.0), ('CA', 'S', 'SE', 181369.0), ('CF', 'M', 'SE', 48609.0), ('CH', 'L', 'EN', 63487.5), ('CH', 'L', 'MI', 112549.5), ('CH', 'S', 'EN', 56536.0), ('CL', 'L', 'MI', 40038.0), ('CN', 'L', 'EN', 100000.0), ('CO', 'L', 'SE', 125000.0), ('CO', 'M', 'EN', 21844.0), ('CO', 'M', 'SE', 56500.0), ('CR', 'S', 'EN', 50000.0), ('CZ', 'L', 'MI', 69999.0), ('CZ', 'M', 'EN', 30469.0), ('CZ', 'M', 'MI', 5132.0), ('DE', 'L', 'EN', 80568.71428571429), ('DE', 'L', 'EX', 141846.0), ('DE', 'L', 'MI', 80497.6), ('DE', 'L', 'SE', 90249.25), ('DE', 'M', 'EN', 50436.5), ('DE', 'M', 'EX', 130026.0), ('DE', 'M', 'MI', 68544.0), ('DE', 'M', 'SE', 170163.55555555556), ('DE', 'S', 'EN', 51066.42857142857), ('DE', 'S', 'MI', 68600.33333333333), ('DE', 'S', 'SE', 96578.0), ('DK', 'L', 'EN', 19073.0), ('DK', 'L', 'SE', 88654.0), ('DK', 'S', 'EN', 37252.5), ('DZ', 'M', 'EN', 100000.0), ('EE', 'L', 'SE', 63312.0), ('EE', 'S', 'MI', 31520.0), ('EG', 'M', 'MI', 22800.0), ('ES', 'L', 'EN', 27317.0), ('ES', 'L', 'EX', 79833.0), ('ES', 'L', 'MI', 38228.0), ('ES', 'L', 'SE', 70423.5), ('ES', 'M', 'EN', 23713.75), ('ES', 'M', 'MI', 61223.41176470588), ('ES', 'M', 'SE', 59665.166666666664), ('ES', 'S', 'EX', 69741.0), ('ES', 'S', 'MI', 47282.0), ('FI', 'M', 'MI', 75020.0), ('FI', 'M', 'SE', 68318.0), ('FI', 'S', 'SE', 63040.0), ('FR', 'L', 'EN', 38284.0), ('FR', 'L', 'MI', 52299.333333333336), ('FR', 'L', 'SE', 87267.4), ('FR', 'M', 'EN', 51172.0), ('FR', 'M', 'MI', 69988.375), ('FR', 'M', 'SE', 89845.6), ('FR', 'S', 'EN', 51321.0), ('FR', 'S', 'MI', 52590.666666666664), ('FR', 'S', 'SE', 53654.0), ('GB', 'L', 'EN', 56049.0), ('GB', 'L', 'MI', 89857.77777777778), ('GB', 'L', 'SE', 95091.0), ('GB', 'M', 'EN', 63861.333333333336), ('GB', 'M', 'EX', 143877.5), ('GB', 'M', 'MI', 83154.95238095238), ('GB', 'M', 'SE', 102207.45161290323), ('GB', 'S', 'EN', 55410.0), ('GB', 'S', 'MI', 68182.0), ('GB', 'S', 'SE', 123510.0), ('GH', 'S', 'EN', 7000.0), ('GH', 'S', 'MI', 30000.0), ('GR', 'L', 'EN', 12877.0), ('GR', 'L', 'SE', 47899.0), ('GR', 'M', 'MI', 58574.454545454544), ('GR', 'S', 'MI', 20000.0), ('HK', 'L', 'MI', 65062.0), ('HN', 'S', 'MI', 20000.0), ('HR', 'M', 'MI', 91142.5), ('HR', 'S', 'SE', 45618.0), ('HU', 'L', 'MI', 35735.0), ('HU', 'M', 'EN', 17684.0), ('ID', 'L', 'EN', 15000.0), ('ID', 'L', 'MI', 53416.0), ('IE', 'L', 'SE', 172309.0), ('IE', 'M', 'MI', 88529.5), ('IE', 'M', 'SE', 128981.0), ('IE', 'S', 'SE', 68293.0), ('IL', 'L', 'SE', 423834.0), ('IL', 'M', 'MI', 119059.0), ('IN', 'L', 'EN', 39371.333333333336), ('IN', 'L', 'EX', 76309.0), ('IN', 'L', 'MI', 23267.235294117647), ('IN', 'L', 'SE', 58774.875), ('IN', 'M', 'EN', 18332.625), ('IN', 'M', 'MI', 18229.75), ('IN', 'S', 'EN', 12986.666666666666), ('IN', 'S', 'MI', 15654.0), ('IN', 'S', 'SE', 15806.0), ('IQ', 'S', 'EN', 100000.0), ('IR', 'M', 'EN', 100000.0), ('IT', 'L', 'MI', 51064.0), ('IT', 'L', 'SE', 68293.0), ('IT', 'M', 'EN', 24165.0), ('IT', 'S', 'EN', 21669.0), ('JP', 'S', 'EN', 41689.0), ('JP', 'S', 'MI', 71691.66666666667), ('JP', 'S', 'SE', 214000.0), ('KE', 'S', 'EN', 9272.0), ('KE', 'S', 'MI', 80000.0), ('LT', 'M', 'MI', 94812.0), ('LU', 'L', 'EN', 59102.0), ('LU', 'M', 'EN', 10000.0), ('LU', 'S', 'MI', 62726.0), ('LV', 'M', 'SE', 57946.5), ('MA', 'S', 'EN', 10000.0), ('MD', 'S', 'MI', 18000.0), ('MK', 'S', 'EN', 6304.0), ('MT', 'L', 'MI', 28369.0), ('MX', 'L', 'MI', 30000.0), ('MX', 'L', 'SE', 60000.0), ('MX', 'M', 'MI', 66000.0), ('MX', 'M', 'SE', 170000.0), ('MX', 'S', 'MI', 36000.0), ('MX', 'S', 'SE', 33511.0), ('MY', 'L', 'EN', 40000.0), ('NG', 'L', 'EN', 65000.0), ('NG', 'L', 'MI', 50000.0), ('NG', 'S', 'EN', 10000.0), ('NG', 'S', 'SE', 200000.0), ('NL', 'L', 'EN', 50944.0), ('NL', 'L', 'EX', 84053.0), ('NL', 'L', 'MI', 71314.0), ('NL', 'L', 'SE', 97629.33333333333), ('NL', 'M', 'MI', 102439.5), ('NL', 'S', 'MI', 54634.0), ('NZ', 'S', 'SE', 125000.0), ('PH', 'S', 'SE', 50000.0), ('PK', 'L', 'MI', 8000.0), ('PK', 'M', 'EN', 30000.0), ('PK', 'M', 'MI', 12000.0), ('PL', 'L', 'EX', 153667.0), ('PL', 'L', 'MI', 36227.333333333336), ('PL', 'S', 'MI', 44365.0), ('PR', 'M', 'SE', 167500.0), ('PT', 'L', 'EN', 21013.0), ('PT', 'L', 'MI', 55685.0), ('PT', 'L', 'SE', 68405.66666666667), ('PT', 'M', 'EN', 22809.0), ('PT', 'M', 'MI', 50180.0), ('PT', 'M', 'SE', 53782.333333333336), ('PT', 'S', 'SE', 29944.0), ('RO', 'L', 'MI', 53654.0), ('RO', 'M', 'MI', 60000.0), ('RU', 'L', 'EX', 168000.0), ('RU', 'M', 'EX', 85000.0), ('SE', 'M', 'EN', 80000.0), ('SE', 'S', 'EN', 130000.0), ('SG', 'L', 'EN', 66970.0), ('SG', 'L', 'MI', 82157.0), ('SG', 'L', 'SE', 8000.0), ('SG', 'M', 'MI', 41383.0), ('SI', 'L', 'MI', 24823.0), ('SI', 'L', 'SE', 102839.0), ('SI', 'M', 'MI', 61702.5), ('SK', 'S', 'SE', 12608.0), ('TH', 'L', 'EN', 15000.0), ('TH', 'L', 'MI', 24740.0), ('TH', 'M', 'SE', 29453.0), ('TR', 'L', 'SE', 20171.0), ('TR', 'M', 'MI', 18779.75), ('UA', 'L', 'EN', 13400.0), ('UA', 'M', 'SE', 84000.0), ('UA', 'S', 'SE', 50000.0), ('US', 'L', 'EN', 105386.73170731707), ('US', 'L', 'EX', 240000.0), ('US', 'L', 'MI', 126846.06666666667), ('US', 'L', 'SE', 175539.59493670886), ('US', 'M', 'EN', 104835.26016260163), ('US', 'M', 'EX', 204151.7888888889), ('US', 'M', 'MI', 129675.77541371158), ('US', 'M', 'SE', 157701.42453282225), ('US', 'S', 'EN', 80196.0), ('US', 'S', 'EX', 249000.0), ('US', 'S', 'MI', 76013.21428571429), ('US', 'S', 'SE', 122588.23529411765), ('VN', 'L', 'EN', 12000.0)]

 [2024-11-30 13:40:31][DEBUG]: == [高级数据库开发人员] 任务输出： [('AE', 'L', 'MI', 115000.0), ('AE', 'S', 'SE', 92500.0), ('AL', 'S', 'SE', 10000.0), ('AM', 'S', 'MI', 50000.0), ('AR', 'L', 'EN', 31000.0), ('AR', 'S', 'EN', 13000.0), ('AS', 'L', 'EN', 50000.0), ('AS', 'M', 'EN', 20000.0), ('AS', 'S', 'EN', 18053.0), ('AT', 'L', 'MI', 75141.66666666667), ('AT', 'M', 'EN', 50000.0), ('AT', 'M', 'MI', 61467.0), ('AT', 'S', 'SE', 91237.0), ('AU', 'L', 'EN', 56014.0), ('AU', 'L', 'MI', 71783.75), ('AU', 'L', 'SE', 152383.0), ('AU', 'M', 'EN', 54390.333333333336), ('AU', 'M', 'MI', 53368.0), ('AU', 'M', 'SE', 50000.0), ('AU', 'S', 'EN', 150000.0), ('BA', 'S', 'EN', 120000.0), ('BE', 'L', 'EN', 84053.0), ('BE', 'M', 'MI', 88654.0), ('BE', 'M', 'SE', 82744.0), ('BE', 'S', 'EN', 52008.0), ('BO', 'M', 'MI', 7500.0), ('BR', 'L', 'EN', 11197.0), ('BR', 'M', 'MI', 57698.77777777778), ('BR', 'M', 'SE', 21453.5), ('BR', 'S', 'MI', 12901.0), ('BS', 'M', 'MI', 45555.0), ('CA', 'L', 'EN', 83447.8), ('CA', 'L', 'EX', 159006.5), ('CA', 'L', 'MI', 98364.6), ('CA', 'L', 'SE', 120463.83333333333), ('CA', 'M', 'EN', 59500.0), ('CA', 'M', 'EX', 15000.0), ('CA', 'M', 'MI', 84802.33333333333), ('CA', 'M', 'SE', 152392.45283018867), ('CA', 'S', 'EX', 115222.0), ('CA', 'S', 'MI', 75000.0), ('CA', 'S', 'SE', 181369.0), ('CF', 'M', 'SE', 48609.0), ('CH', 'L', 'EN', 63487.5), ('CH', 'L', 'MI', 112549.5), ('CH', 'S', 'EN', 56536.0), ('CL', 'L', 'MI', 40038.0), ('CN', 'L', 'EN', 100000.0), ('CO', 'L', 'SE', 125000.0), ('CO', 'M', 'EN', 21844.0), ('CO', 'M', 'SE', 56500.0), ('CR', 'S', 'EN', 50000.0), ('CZ', 'L', 'MI', 69999.0), ('CZ', 'M', 'EN', 30469.0), ('CZ', 'M', 'MI', 5132.0), ('DE', 'L', 'EN', 80568.71428571429), ('DE', 'L', 'EX', 141846.0), ('DE', 'L', 'MI', 80497.6), ('DE', 'L', 'SE', 90249.25), ('DE', 'M', 'EN', 50436.5), ('DE', 'M', 'EX', 130026.0), ('DE', 'M', 'MI', 68544.0), ('DE', 'M', 'SE', 170163.55555555556), ('DE', 'S', 'EN', 51066.42857142857), ('DE', 'S', 'MI', 68600.33333333333), ('DE', 'S', 'SE', 96578.0), ('DK', 'L', 'EN', 19073.0), ('DK', 'L', 'SE', 88654.0), ('DK', 'S', 'EN', 37252.5), ('DZ', 'M', 'EN', 100000.0), ('EE', 'L', 'SE', 63312.0), ('EE', 'S', 'MI', 31520.0), ('EG', 'M', 'MI', 22800.0), ('ES', 'L', 'EN', 27317.0), ('ES', 'L', 'EX', 79833.0), ('ES', 'L', 'MI', 38228.0), ('ES', 'L', 'SE', 70423.5), ('ES', 'M', 'EN', 23713.75), ('ES', 'M', 'MI', 61223.41176470588), ('ES', 'M', 'SE', 59665.166666666664), ('ES', 'S', 'EX', 69741.0), ('ES', 'S', 'MI', 47282.0), ('FI', 'M', 'MI', 75020.0), ('FI', 'M', 'SE', 68318.0), ('FI', 'S', 'SE', 63040.0), ('FR', 'L', 'EN', 38284.0), ('FR', 'L', 'MI', 52299.333333333336), ('FR', 'L', 'SE', 87267.4), ('FR', 'M', 'EN', 51172.0), ('FR', 'M', 'MI', 69988.375), ('FR', 'M', 'SE', 89845.6), ('FR', 'S', 'EN', 51321.0), ('FR', 'S', 'MI', 52590.666666666664), ('FR', 'S', 'SE', 53654.0), ('GB', 'L', 'EN', 56049.0), ('GB', 'L', 'MI', 89857.77777777778), ('GB', 'L', 'SE', 95091.0), ('GB', 'M', 'EN', 63861.333333333336), ('GB', 'M', 'EX', 143877.5), ('GB', 'M', 'MI', 83154.95238095238), ('GB', 'M', 'SE', 102207.45161290323), ('GB', 'S', 'EN', 55410.0), ('GB', 'S', 'MI', 68182.0), ('GB', 'S', 'SE', 123510.0), ('GH', 'S', 'EN', 7000.0), ('GH', 'S', 'MI', 30000.0), ('GR', 'L', 'EN', 12877.0), ('GR', 'L', 'SE', 47899.0), ('GR', 'M', 'MI', 58574.454545454544), ('GR', 'S', 'MI', 20000.0), ('HK', 'L', 'MI', 65062.0), ('HN', 'S', 'MI', 20000.0), ('HR', 'M', 'MI', 91142.5), ('HR', 'S', 'SE', 45618.0), ('HU', 'L', 'MI', 35735.0), ('HU', 'M', 'EN', 17684.0), ('ID', 'L', 'EN', 15000.0), ('ID', 'L', 'MI', 53416.0), ('IE', 'L', 'SE', 172309.0), ('IE', 'M', 'MI', 88529.5), ('IE', 'M', 'SE', 128981.0), ('IE', 'S', 'SE', 68293.0), ('IL', 'L', 'SE', 423834.0), ('IL', 'M', 'MI', 119059.0), ('IN', 'L', 'EN', 39371.333333333336), ('IN', 'L', 'EX', 76309.0), ('IN', 'L', 'MI', 23267.235294117647), ('IN', 'L', 'SE', 58774.875), ('IN', 'M', 'EN', 18332.625), ('IN', 'M', 'MI', 18229.75), ('IN', 'S', 'EN', 12986.666666666666), ('IN', 'S', 'MI', 15654.0), ('IN', 'S', 'SE', 15806.0), ('IQ', 'S', 'EN', 100000.0), ('IR', 'M', 'EN', 100000.0), ('IT', 'L', 'MI', 51064.0), ('IT', 'L', 'SE', 68293.0), ('IT', 'M', 'EN', 24165.0), ('IT', 'S', 'EN', 21669.0), ('JP', 'S', 'EN', 41689.0), ('JP', 'S', 'MI', 71691.66666666667), ('JP', 'S', 'SE', 214000.0), ('KE', 'S', 'EN', 9272.0), ('KE', 'S', 'MI', 80000.0), ('LT', 'M', 'MI', 94812.0), ('LU', 'L', 'EN', 59102.0), ('LU', 'M', 'EN', 10000.0), ('LU', 'S', 'MI', 62726.0), ('LV', 'M', 'SE', 57946.5), ('MA', 'S', 'EN', 10000.0), ('MD', 'S', 'MI', 18000.0), ('MK', 'S', 'EN', 6304.0), ('MT', 'L', 'MI', 28369.0), ('MX', 'L', 'MI', 30000.0), ('MX', 'L', 'SE', 60000.0), ('MX', 'M', 'MI', 66000.0), ('MX', 'M', 'SE', 170000.0), ('MX', 'S', 'MI', 36000.0), ('MX', 'S', 'SE', 33511.0), ('MY', 'L', 'EN', 40000.0), ('NG', 'L', 'EN', 65000.0), ('NG', 'L', 'MI', 50000.0), ('NG', 'S', 'EN', 10000.0), ('NG', 'S', 'SE', 200000.0), ('NL', 'L', 'EN', 50944.0), ('NL', 'L', 'EX', 84053.0), ('NL', 'L', 'MI', 71314.0), ('NL', 'L', 'SE', 97629.33333333333), ('NL', 'M', 'MI', 102439.5), ('NL', 'S', 'MI', 54634.0), ('NZ', 'S', 'SE', 125000.0), ('PH', 'S', 'SE', 50000.0), ('PK', 'L', 'MI', 8000.0), ('PK', 'M', 'EN', 30000.0), ('PK', 'M', 'MI', 12000.0), ('PL', 'L', 'EX', 153667.0), ('PL', 'L', 'MI', 36227.333333333336), ('PL', 'S', 'MI', 44365.0), ('PR', 'M', 'SE', 167500.0), ('PT', 'L', 'EN', 21013.0), ('PT', 'L', 'MI', 55685.0), ('PT', 'L', 'SE', 68405.66666666667), ('PT', 'M', 'EN', 22809.0), ('PT', 'M', 'MI', 50180.0), ('PT', 'M', 'SE', 53782.333333333336), ('PT', 'S', 'SE', 29944.0), ('RO', 'L', 'MI', 53654.0), ('RO', 'M', 'MI', 60000.0), ('RU', 'L', 'EX', 168000.0), ('RU', 'M', 'EX', 85000.0), ('SE', 'M', 'EN', 80000.0), ('SE', 'S', 'EN', 130000.0), ('SG', 'L', 'EN', 66970.0), ('SG', 'L', 'MI', 82157.0), ('SG', 'L', 'SE', 8000.0), ('SG', 'M', 'MI', 41383.0), ('SI', 'L', 'MI', 24823.0), ('SI', 'L', 'SE', 102839.0), ('SI', 'M', 'MI', 61702.5), ('SK', 'S', 'SE', 12608.0), ('TH', 'L', 'EN', 15000.0), ('TH', 'L', 'MI', 24740.0), ('TH', 'M', 'SE', 29453.0), ('TR', 'L', 'SE', 20171.0), ('TR', 'M', 'MI', 18779.75), ('UA', 'L', 'EN', 13400.0), ('UA', 'M', 'SE', 84000.0), ('UA', 'S', 'SE', 50000.0), ('US', 'L', 'EN', 105386.73170731707), ('US', 'L', 'EX', 240000.0), ('US', 'L', 'MI', 126846.06666666667), ('US', 'L', 'SE', 175539.59493670886), ('US', 'M', 'EN', 104835.26016260163), ('US', 'M', 'EX', 204151.7888888889), ('US', 'M', 'MI', 129675.77541371158), ('US', 'M', 'SE', 157701.42453282225), ('US', 'S', 'EN', 80196.0), ('US', 'S', 'EX', 249000.0), ('US', 'S', 'MI', 76013.21428571429), ('US', 'S', 'SE', 122588.23529411765), ('VN', 'L', 'EN', 12000.0)]


 [2024-11-30 13:40:31][DEBUG]: == 工作代理：高级数据分析师
 [2024-11-30 13:40:31][INFO]: == 开始任务：分析数据库中的数据，并撰写关于“根据公司位置、规模和员工经验对薪资（以美元计）的影响”的分析。
 [2024-11-30 13:40:33][DEBUG]: == [高级数据分析师] 任务输出：根据分析，我们可以得出以下结论：

1. 位置对薪资有显著影响，某些位置提供的平均薪资高于其他位置。
2. 公司规模也对薪资有显著影响，大型公司通常提供更高的平均薪资。
3. 员工经验也是一个重要因素，更有经验的员工通常能获得更高的平均薪资。
4. 位置、公司规模和经验之间的互动关系复杂，某些组合往往提供比其他组合更高的平均薪资。

这些见解可以用于指导公司在不同位置和行业的薪资决策和人才招聘策略。


 [2024-11-30 13:40:33][DEBUG]: == 工作代理：高级报告编辑
 [2024-11-30 13:40:33][INFO]: == 开始任务：撰写分析报告的执行摘要。报告必须少于 100 个字。

 [2024-11-30 13:40:42][DEBUG]: == [高级报告编辑] 任务输出：**执行摘要**
===============

#### 主要发现

* 位置对薪资有显著影响，某些位置提供的平均薪资高于其他位置。
* 公司规模也对薪资有显著影响，大型公司通常提供更高的平均薪资。
* 员工经验是一个重要因素，更有经验的员工通常能获得更高的平均薪资。
* 位置、公司规模和经验之间的互动关系复杂，某些组合往往提供比其他组合更高的平均薪资。

#### 启示

这些见解可以为公司在不同位置和行业的薪资决策和人才招聘策略提供参考。


```
**代码来源：**[https://github.com/curiousily/AI\-Bootcamp/blob/master/14\.sql\-agents\-with\-llama3\-crewai.ipynb](https://github.com/curiousily/AI-Bootcamp/blob/master/14.sql-agents-with-llama3-crewai.ipynb)

