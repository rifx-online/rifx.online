---
title: "How to build an AI-Powered SQL Data Analysis Agent with LangChain and CrewAI"
meta_title: "How to build an AI-Powered SQL Data Analysis Agent with LangChain and CrewAI"
description: "This tutorial outlines the process of creating an AI-powered SQL data analysis agent using LangChain and CrewAI. It involves setting up the environment, installing necessary libraries, and configuring API keys. The tutorial details the creation of an SQLite database with a dataset, the integration of the Llama 3 model for processing SQL queries, and the establishment of various tools and agents for data extraction, analysis, and report writing. The workflow is structured into tasks handled by specific agents, enhancing productivity in data workflows while minimizing manual intervention."
date: 2024-12-07T12:23:24Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*FFS-pBbafNBgg_1t.png"
categories: ["Programming", "Data Science", "Generative AI"]
author: "Rifx.Online"
tags: ["LangChain", "CrewAI", "SQLite", "Llama", "SQL"]
draft: False

---




In today’s data\-driven world, automating workflows for data extraction, analysis, and reporting is critical to saving time and improving efficiency. This tutorial walks you through building an AI\-powered SQL workflow using LangChain and CrewAI. By integrating a powerful Llama 3 model, SQL database tools, and agent\-based automation, you’ll learn how to create a seamless pipeline for handling database queries, analyzing results, and generating executive reports — all with minimal manual intervention. Whether you’re a data enthusiast, developer, or ML engineer, this guide will help you unlock new levels of productivity in your data workflows.




## Environment Setup


### Installing Dependencies

To start, ensure you have Python installed and use the following code to set up the required libraries:


```python
!pip install langchain-core==0.2.15 langchain-community==0.2.6 'crewai[tools]'==0.32.0 langchain-groq==0.1.5
```
**Explanation of Each Library**:

* `langchain-core`: Provides the foundational tools to build pipelines involving large language models (LLMs), enabling chaining and complex workflows.
* `langchain-community`: Includes community\-built utilities and tools that extend LangChain’s functionality, particularly for handling SQL databases.
* `crewai[tools]`: Powers task automation with agents, tools, and workflows for efficient collaboration between LLMs and structured processes.
* `langchain-groq`: Integrates Groq’s LLM capabilities, specifically tailored for enhanced performance with models like Llama 3\.


### Configuring Environment Variables

Some tools, like `langchain-groq`, require API keys for authentication. Below is an example of setting up the `GROQ_API_KEY` environment variable.

**Code Snippet**:


```python
import os
## Replace 'your_groq_api_key' with your actual Groq API Key
os.environ["GROQ_API_KEY"] = "your_groq_api_key"
```
**Explanation**:

* `os.environ`: Used to set environment variables directly within the Python script.
* `GROQ_API_KEY`: An essential key to authenticate your access to Groq’s API for using the Llama 3 model.


### Quick Tip

If you’re using a notebook environment like Google Colab, remember to include this setup code at the start of your notebook to ensure all dependencies are installed and API keys are correctly configured.


## How To set up your Groq API key

To set up your Groq API key, follow these steps:

**Create or Log In to Your Groq Account**:

* Visit the Groq Console.
* If you have an account, log in. Otherwise, sign up and complete the verification process.

**Generate a New API Key**:

* After logging in, navigate to the [API Keys](https://console.groq.com/keys) section.
* Click on “Create API Key.”
* Provide a recognizable name for your key to identify it later.
* Submit to generate the key.

**Securely Store Your API Key**:

* Once generated, your API key will be displayed. Copy it immediately, as it may not be shown again.
* Store the key securely to prevent unauthorized access.


## Importing necessary libraries:


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

## Database Setup


### Loading the Dataset

First, load the `ds-salaries.csv` dataset into a Pandas DataFrame.

Link to data:[https://www.kaggle.com/datasets/armandodelahoya/ds\-job\-salaries\-updated\-jan\-2023](https://www.kaggle.com/datasets/armandodelahoya/ds-job-salaries-updated-jan-2023)


```python
import pandas as pd
## Load the dataset into a Pandas DataFrame
file_path = "ds-salaries.csv"  # Replace with the path to your dataset
df = pd.read_csv(file_path)
## Display the first few rows to verify the data
print(df.head())
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*6iBzf_7neQSwILixJZ30pg.png)


### Creating an SQLite Database

Next, create an SQLite database (`salaries.db`) and populate it with the `salaries` table.


```python
import sqlite3
## Establish a connection to the SQLite database
connection = sqlite3.connect("salaries.db")
## Write the DataFrame to the database
df.to_sql(name="salaries", con=connection, if_exists="replace")
```

### Verifying Database Setup

Reopen the database connection and display sample rows to confirm the data has been added successfully.


```python
## Query the database to fetch sample rows
query = "SELECT * FROM salaries LIMIT 5;"
sample_data = pd.read_sql_query(query, connection)
## Display the sample data
print(sample_data)
```

## Define a mechanism to log the interactions between your program and the LLM(optional)


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
        """Run when LLM starts running."""
        assert len(prompts) == 1
        event = Event(event="llm_start", timestamp=_current_time(), text=prompts[0])
        with self.log_path.open("a", encoding="utf-8") as file:
            file.write(json.dumps(asdict(event)) + "\n")

    def on_llm_end(self, response: LLMResult, **kwargs: Any) -> Any:
        """Run when LLM ends running."""
        generation = response.generations[-1][-1].message.content
        event = Event(event="llm_end", timestamp=_current_time(), text=generation)
        with self.log_path.open("a", encoding="utf-8") as file:
            file.write(json.dumps(asdict(event)) + "\n")
```
**Purpose**: This handler provides a clear and auditable way to monitor LLM interactions, logging both the inputs and outputs for every request.

**Benefits**:

* Improves transparency in workflows.
* Facilitates debugging by keeping a detailed interaction log.
* Ensures reproducibility of results by storing timestamps and content.

**Example Usage**:

* When initializing the LLM, you pass this callback to track all interactions


## Setting Up the LLM with LangChain

This step demonstrates how to integrate the LLM (Llama 3\) into the workflow using LangChain and the callback handler defined earlier.


### Configuring the LLM

The `ChatGroq` model is configured to process prompts and return responses while using the `LLMCallbackHandler` for logging interactions.


```python
llm = ChatGroq(
    temperature=0,
    model_name="llama3-70b-8192",
    callbacks=[LLMCallbackHandler(Path("prompts.jsonl"))],
)
```
**Temperature**: Determines the randomness of the LLM’s responses.

* A value of `0` ensures deterministic responses, suitable for precise tasks like SQL generation or summarization.

**Model Name**: Specifies the version and configuration of the Llama 3 model being used.

**Callbacks**: Attaches the `LLMCallbackHandler` to log all inputs and outputs to a file named `prompts.jsonl`.

You can test the LLM integration with a sample query.


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

## Defining the Tools:


### Initializing the Database


```python
db = SQLDatabase.from_uri("sqlite:///salaries.db")
```
* **What it Does**:
* Creates a connection to the SQLite database named `salaries.db`.
* `from_uri`: Allows you to specify the database location using a URI (`sqlite:///` indicates an SQLite database file).


### Defining a Tool to List Tables


```python
@tool("list_tables")
def list_tables() -> str:
    """List the available tables in the database"""
    return ListSQLDatabaseTool(db=db).invoke("")
```
**What it Does**:

* Defines a LangChain tool named `"list_tables"` for listing all tables in the database.

**Utility**:

* Helps agents understand the structure of the database by identifying available tables.
* Essential for tasks like schema retrieval, querying, or data exploration.

**Components**:

* `@tool` **decorator**: Marks the function as a tool that can be used within workflows or agents.
* `ListSQLDatabaseTool`: A pre\-built LangChain utility to query and return all table names in the connected database.
* `.invoke("")`: Executes the tool without additional input since listing tables doesn’t require parameters.

Running the Tool


```python
list_tables.run()
```
* **What it Does**:
* Executes the `list_tables` tool to retrieve and print the names of all tables in the `salaries.db` database.


### Define tool to retrieve schema details


```python
@tool("tables_schema")
def tables_schema(tables: str) -> str:
    """
    Input is a comma-separated list of tables, output is the schema and sample rows
    for those tables. Be sure that the tables actually exist by calling `list_tables` first!
    Example Input: table1, table2, table3
    """
    tool = InfoSQLDatabaseTool(db=db)
    return tool.invoke(tables)
```
**Purpose**:

* This tool provides metadata (schema) and sample data from specified tables in the database.

**Utility**:

* Provides essential metadata for understanding the table structure.
* Helps agents craft queries and analyze data efficiently.

**Components**:

* **Input**: A comma\-separated string of table names (e.g., `"salaries"`).
* **Output**: Schema details and sample rows for the specified tables.

`InfoSQLDatabaseTool`:

* A LangChain utility that retrieves schema information and a preview of the data.
* Requires a database connection (`db`).

`tool.invoke(tables)`:

* Executes the tool with the given table names.
* Returns schema and sample rows as a string.


### Define execute\_sql Tool


```python
@tool("execute_sql")
def execute_sql(sql_query: str) -> str:
    """Execute a SQL query against the database. Returns the result."""
    return QuerySQLDataBaseTool(db=db).invoke(sql_query)
```
**Purpose**: Executes a SQL query directly on the database and retrieves the results.

**Components**:

* **Input**: `sql_query` \- The SQL command to execute.
* **Output**: Result of the query, typically rows of data.
* `QuerySQLDataBaseTool`: A LangChain utility for executing SQL commands on the connected database.

**Usage**: Run after validating queries to retrieve specific data or perform updates.


### Define check\_sql Tool


```python
@tool("check_sql")
def check_sql(sql_query: str) -> str:
    """
    Use this tool to double check if your query is correct before executing it.
    Always use this tool before executing a query with `execute_sql`.
    """
    return QuerySQLCheckerTool(db=db, llm=llm).invoke({"query": sql_query})
```
**Purpose**: Validates SQL queries to ensure correctness before execution.

**Components**:

* **Input**: `sql_query` \- The SQL command to validate.
* **Output**: Feedback on the query’s correctness (e.g., syntax issues, invalid table names).
* `QuerySQLCheckerTool`: Uses the LLM (`llm`) to analyze and validate the query for potential issues.

**Usage**: Prevents errors by confirming query accuracy before running it.


## Define the Agents:


### 1\. sql\_dev (Senior Database Developer)

**Role**: Constructs and executes SQL queries efficiently.

**Goal**: Generate accurate and optimized SQL queries based on a request.

**Capabilities**:

* Use tools like `list_tables`, `tables_schema`, `check_sql`, and `execute_sql` to interact with the database.

**LLM Integration**: Assists in query generation and optimization.


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

### 2\. data\_analyst (Senior Data Analyst)

**Role**: Analyzes data provided by the database developer.

**Goal**: Create clear and detailed analysis based on the data.

**Capabilities**:

* Leverages Python and the LLM to generate insights.
* Ensures the analysis is precise and easy to understand.


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

### 3\. report\_writer (Senior Report Editor)

**Role**: Summarizes analysis into concise executive reports.

**Goal**: Communicate key insights effectively in under 100 words.

**Capabilities**:

* Produces clear and impactful summaries using the LLM.
* Specializes in bullet\-pointed, executive\-style reporting.


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

## Definition of Tasks


### 1\. extract\_data Task


```python
extract_data = Task(
    description="Extract data that is required for the query {query}.",
    expected_output="Database result for the query",
    agent=sql_dev,
)
```
* **Purpose**: Handles the extraction of data from the database based on the input query.
* **Agent**: Delegates the task to `sql_dev` (SQL Developer).
* **Input**: The query to extract relevant data.
* **Output**: The result of the SQL query executed on the database.


### 2\. analyze\_data Task


```python
analyze_data = Task(
    description="Analyze the data from the database and write an analysis for {query}.",
    expected_output="Detailed analysis text",
    agent=data_analyst,
    context=[extract_data],
)
```
* **Purpose**: Analyzes the data extracted in the previous step.
* **Agent**: Delegates the task to `data_analyst` (Data Analyst).
* **Context**: Depends on the output of `extract_data`, ensuring it processes the relevant data.
* **Output**: A detailed textual analysis of the extracted data.


### 3\. write\_report Task


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
* **Purpose**: Summarizes the analysis into a concise, executive\-style report.
* **Agent**: Delegates the task to `report_writer` (Report Writer).
* **Context**: Depends on the output of `analyze_data`, ensuring the summary reflects the analysis.
* **Output**: A markdown\-formatted report under 100 words.


## Workflow

1. `extract_data`: Fetches relevant data from the database using SQL queries.
2. `analyze_data`: Processes and interprets the extracted data.
3. `write_report`: Condenses the analysis into a concise, easily digestible report.


## Define the Crew

The `Crew` combines the defined agents and tasks into a cohesive workflow, automating the end\-to\-end process. Here's a breakdown:


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

### Components

1. `agents`:

**Input**: A list of agents (`sql_dev`, `data_analyst`, and `report_writer`).

* **Purpose**: Defines the roles that will handle specific tasks.
* **Agents’ Roles**:
* `sql_dev`: Handles database queries.
* `data_analyst`: Analyzes extracted data.
* `report_writer`: Summarizes the analysis.

`tasks`:

* **Input**: A list of tasks (`extract_data`, `analyze_data`, and `write_report`).
* **Purpose**: Specifies the workflow, where each task depends on the output of the previous one.

`process`:

* **Value**: `Process.sequential`.
* **Purpose**: Ensures tasks are executed in sequence, with each task waiting for the previous one to finish.

`verbose`:

* **Value**: `2`.
* **Purpose**: Controls the level of logging:
* Higher verbosity provides detailed logs for monitoring task execution.

`memory`:

* **Value**: `False`.
* **Purpose**: Disables memory retention between tasks to ensure stateless execution.

`output_log_file`:

* **Value**: `"crew.log"`.
* **Purpose**: Specifies a file to store detailed logs of the entire process for debugging and auditing.


## Running the Crew:


```python
inputs = {
    "query": "Effects on salary (in USD) based on company location, size and employee experience"
}

result = crew.kickoff(inputs=inputs)
```

```python
[2024-11-30 13:39:52][DEBUG]: == Working Agent: Senior Database Developer
 [2024-11-30 13:39:52][INFO]: == Starting Task: Extract data that is required for the query Effects on salary (in USD) based on company location, size and employee experience.

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

 

The provided SQL query appears to be correct and does not contain any of the common mistakes listed. Here is the final SQL query:

```
SELECT company_location, company_size, experience_level, AVG(salary_in_usd) AS avg_salary 
FROM salaries 
GROUP BY company_location, company_size, experience_level
```

 

[('AE', 'L', 'MI', 115000.0), ('AE', 'S', 'SE', 92500.0), ('AL', 'S', 'SE', 10000.0), ('AM', 'S', 'MI', 50000.0), ('AR', 'L', 'EN', 31000.0), ('AR', 'S', 'EN', 13000.0), ('AS', 'L', 'EN', 50000.0), ('AS', 'M', 'EN', 20000.0), ('AS', 'S', 'EN', 18053.0), ('AT', 'L', 'MI', 75141.66666666667), ('AT', 'M', 'EN', 50000.0), ('AT', 'M', 'MI', 61467.0), ('AT', 'S', 'SE', 91237.0), ('AU', 'L', 'EN', 56014.0), ('AU', 'L', 'MI', 71783.75), ('AU', 'L', 'SE', 152383.0), ('AU', 'M', 'EN', 54390.333333333336), ('AU', 'M', 'MI', 53368.0), ('AU', 'M', 'SE', 50000.0), ('AU', 'S', 'EN', 150000.0), ('BA', 'S', 'EN', 120000.0), ('BE', 'L', 'EN', 84053.0), ('BE', 'M', 'MI', 88654.0), ('BE', 'M', 'SE', 82744.0), ('BE', 'S', 'EN', 52008.0), ('BO', 'M', 'MI', 7500.0), ('BR', 'L', 'EN', 11197.0), ('BR', 'M', 'MI', 57698.77777777778), ('BR', 'M', 'SE', 21453.5), ('BR', 'S', 'MI', 12901.0), ('BS', 'M', 'MI', 45555.0), ('CA', 'L', 'EN', 83447.8), ('CA', 'L', 'EX', 159006.5), ('CA', 'L', 'MI', 98364.6), ('CA', 'L', 'SE', 120463.83333333333), ('CA', 'M', 'EN', 59500.0), ('CA', 'M', 'EX', 15000.0), ('CA', 'M', 'MI', 84802.33333333333), ('CA', 'M', 'SE', 152392.45283018867), ('CA', 'S', 'EX', 115222.0), ('CA', 'S', 'MI', 75000.0), ('CA', 'S', 'SE', 181369.0), ('CF', 'M', 'SE', 48609.0), ('CH', 'L', 'EN', 63487.5), ('CH', 'L', 'MI', 112549.5), ('CH', 'S', 'EN', 56536.0), ('CL', 'L', 'MI', 40038.0), ('CN', 'L', 'EN', 100000.0), ('CO', 'L', 'SE', 125000.0), ('CO', 'M', 'EN', 21844.0), ('CO', 'M', 'SE', 56500.0), ('CR', 'S', 'EN', 50000.0), ('CZ', 'L', 'MI', 69999.0), ('CZ', 'M', 'EN', 30469.0), ('CZ', 'M', 'MI', 5132.0), ('DE', 'L', 'EN', 80568.71428571429), ('DE', 'L', 'EX', 141846.0), ('DE', 'L', 'MI', 80497.6), ('DE', 'L', 'SE', 90249.25), ('DE', 'M', 'EN', 50436.5), ('DE', 'M', 'EX', 130026.0), ('DE', 'M', 'MI', 68544.0), ('DE', 'M', 'SE', 170163.55555555556), ('DE', 'S', 'EN', 51066.42857142857), ('DE', 'S', 'MI', 68600.33333333333), ('DE', 'S', 'SE', 96578.0), ('DK', 'L', 'EN', 19073.0), ('DK', 'L', 'SE', 88654.0), ('DK', 'S', 'EN', 37252.5), ('DZ', 'M', 'EN', 100000.0), ('EE', 'L', 'SE', 63312.0), ('EE', 'S', 'MI', 31520.0), ('EG', 'M', 'MI', 22800.0), ('ES', 'L', 'EN', 27317.0), ('ES', 'L', 'EX', 79833.0), ('ES', 'L', 'MI', 38228.0), ('ES', 'L', 'SE', 70423.5), ('ES', 'M', 'EN', 23713.75), ('ES', 'M', 'MI', 61223.41176470588), ('ES', 'M', 'SE', 59665.166666666664), ('ES', 'S', 'EX', 69741.0), ('ES', 'S', 'MI', 47282.0), ('FI', 'M', 'MI', 75020.0), ('FI', 'M', 'SE', 68318.0), ('FI', 'S', 'SE', 63040.0), ('FR', 'L', 'EN', 38284.0), ('FR', 'L', 'MI', 52299.333333333336), ('FR', 'L', 'SE', 87267.4), ('FR', 'M', 'EN', 51172.0), ('FR', 'M', 'MI', 69988.375), ('FR', 'M', 'SE', 89845.6), ('FR', 'S', 'EN', 51321.0), ('FR', 'S', 'MI', 52590.666666666664), ('FR', 'S', 'SE', 53654.0), ('GB', 'L', 'EN', 56049.0), ('GB', 'L', 'MI', 89857.77777777778), ('GB', 'L', 'SE', 95091.0), ('GB', 'M', 'EN', 63861.333333333336), ('GB', 'M', 'EX', 143877.5), ('GB', 'M', 'MI', 83154.95238095238), ('GB', 'M', 'SE', 102207.45161290323), ('GB', 'S', 'EN', 55410.0), ('GB', 'S', 'MI', 68182.0), ('GB', 'S', 'SE', 123510.0), ('GH', 'S', 'EN', 7000.0), ('GH', 'S', 'MI', 30000.0), ('GR', 'L', 'EN', 12877.0), ('GR', 'L', 'SE', 47899.0), ('GR', 'M', 'MI', 58574.454545454544), ('GR', 'S', 'MI', 20000.0), ('HK', 'L', 'MI', 65062.0), ('HN', 'S', 'MI', 20000.0), ('HR', 'M', 'MI', 91142.5), ('HR', 'S', 'SE', 45618.0), ('HU', 'L', 'MI', 35735.0), ('HU', 'M', 'EN', 17684.0), ('ID', 'L', 'EN', 15000.0), ('ID', 'L', 'MI', 53416.0), ('IE', 'L', 'SE', 172309.0), ('IE', 'M', 'MI', 88529.5), ('IE', 'M', 'SE', 128981.0), ('IE', 'S', 'SE', 68293.0), ('IL', 'L', 'SE', 423834.0), ('IL', 'M', 'MI', 119059.0), ('IN', 'L', 'EN', 39371.333333333336), ('IN', 'L', 'EX', 76309.0), ('IN', 'L', 'MI', 23267.235294117647), ('IN', 'L', 'SE', 58774.875), ('IN', 'M', 'EN', 18332.625), ('IN', 'M', 'MI', 18229.75), ('IN', 'S', 'EN', 12986.666666666666), ('IN', 'S', 'MI', 15654.0), ('IN', 'S', 'SE', 15806.0), ('IQ', 'S', 'EN', 100000.0), ('IR', 'M', 'EN', 100000.0), ('IT', 'L', 'MI', 51064.0), ('IT', 'L', 'SE', 68293.0), ('IT', 'M', 'EN', 24165.0), ('IT', 'S', 'EN', 21669.0), ('JP', 'S', 'EN', 41689.0), ('JP', 'S', 'MI', 71691.66666666667), ('JP', 'S', 'SE', 214000.0), ('KE', 'S', 'EN', 9272.0), ('KE', 'S', 'MI', 80000.0), ('LT', 'M', 'MI', 94812.0), ('LU', 'L', 'EN', 59102.0), ('LU', 'M', 'EN', 10000.0), ('LU', 'S', 'MI', 62726.0), ('LV', 'M', 'SE', 57946.5), ('MA', 'S', 'EN', 10000.0), ('MD', 'S', 'MI', 18000.0), ('MK', 'S', 'EN', 6304.0), ('MT', 'L', 'MI', 28369.0), ('MX', 'L', 'MI', 30000.0), ('MX', 'L', 'SE', 60000.0), ('MX', 'M', 'MI', 66000.0), ('MX', 'M', 'SE', 170000.0), ('MX', 'S', 'MI', 36000.0), ('MX', 'S', 'SE', 33511.0), ('MY', 'L', 'EN', 40000.0), ('NG', 'L', 'EN', 65000.0), ('NG', 'L', 'MI', 50000.0), ('NG', 'S', 'EN', 10000.0), ('NG', 'S', 'SE', 200000.0), ('NL', 'L', 'EN', 50944.0), ('NL', 'L', 'EX', 84053.0), ('NL', 'L', 'MI', 71314.0), ('NL', 'L', 'SE', 97629.33333333333), ('NL', 'M', 'MI', 102439.5), ('NL', 'S', 'MI', 54634.0), ('NZ', 'S', 'SE', 125000.0), ('PH', 'S', 'SE', 50000.0), ('PK', 'L', 'MI', 8000.0), ('PK', 'M', 'EN', 30000.0), ('PK', 'M', 'MI', 12000.0), ('PL', 'L', 'EX', 153667.0), ('PL', 'L', 'MI', 36227.333333333336), ('PL', 'S', 'MI', 44365.0), ('PR', 'M', 'SE', 167500.0), ('PT', 'L', 'EN', 21013.0), ('PT', 'L', 'MI', 55685.0), ('PT', 'L', 'SE', 68405.66666666667), ('PT', 'M', 'EN', 22809.0), ('PT', 'M', 'MI', 50180.0), ('PT', 'M', 'SE', 53782.333333333336), ('PT', 'S', 'SE', 29944.0), ('RO', 'L', 'MI', 53654.0), ('RO', 'M', 'MI', 60000.0), ('RU', 'L', 'EX', 168000.0), ('RU', 'M', 'EX', 85000.0), ('SE', 'M', 'EN', 80000.0), ('SE', 'S', 'EN', 130000.0), ('SG', 'L', 'EN', 66970.0), ('SG', 'L', 'MI', 82157.0), ('SG', 'L', 'SE', 8000.0), ('SG', 'M', 'MI', 41383.0), ('SI', 'L', 'MI', 24823.0), ('SI', 'L', 'SE', 102839.0), ('SI', 'M', 'MI', 61702.5), ('SK', 'S', 'SE', 12608.0), ('TH', 'L', 'EN', 15000.0), ('TH', 'L', 'MI', 24740.0), ('TH', 'M', 'SE', 29453.0), ('TR', 'L', 'SE', 20171.0), ('TR', 'M', 'MI', 18779.75), ('UA', 'L', 'EN', 13400.0), ('UA', 'M', 'SE', 84000.0), ('UA', 'S', 'SE', 50000.0), ('US', 'L', 'EN', 105386.73170731707), ('US', 'L', 'EX', 240000.0), ('US', 'L', 'MI', 126846.06666666667), ('US', 'L', 'SE', 175539.59493670886), ('US', 'M', 'EN', 104835.26016260163), ('US', 'M', 'EX', 204151.7888888889), ('US', 'M', 'MI', 129675.77541371158), ('US', 'M', 'SE', 157701.42453282225), ('US', 'S', 'EN', 80196.0), ('US', 'S', 'EX', 249000.0), ('US', 'S', 'MI', 76013.21428571429), ('US', 'S', 'SE', 122588.23529411765), ('VN', 'L', 'EN', 12000.0)]

 [2024-11-30 13:40:31][DEBUG]: == [Senior Database Developer] Task output: [('AE', 'L', 'MI', 115000.0), ('AE', 'S', 'SE', 92500.0), ('AL', 'S', 'SE', 10000.0), ('AM', 'S', 'MI', 50000.0), ('AR', 'L', 'EN', 31000.0), ('AR', 'S', 'EN', 13000.0), ('AS', 'L', 'EN', 50000.0), ('AS', 'M', 'EN', 20000.0), ('AS', 'S', 'EN', 18053.0), ('AT', 'L', 'MI', 75141.66666666667), ('AT', 'M', 'EN', 50000.0), ('AT', 'M', 'MI', 61467.0), ('AT', 'S', 'SE', 91237.0), ('AU', 'L', 'EN', 56014.0), ('AU', 'L', 'MI', 71783.75), ('AU', 'L', 'SE', 152383.0), ('AU', 'M', 'EN', 54390.333333333336), ('AU', 'M', 'MI', 53368.0), ('AU', 'M', 'SE', 50000.0), ('AU', 'S', 'EN', 150000.0), ('BA', 'S', 'EN', 120000.0), ('BE', 'L', 'EN', 84053.0), ('BE', 'M', 'MI', 88654.0), ('BE', 'M', 'SE', 82744.0), ('BE', 'S', 'EN', 52008.0), ('BO', 'M', 'MI', 7500.0), ('BR', 'L', 'EN', 11197.0), ('BR', 'M', 'MI', 57698.77777777778), ('BR', 'M', 'SE', 21453.5), ('BR', 'S', 'MI', 12901.0), ('BS', 'M', 'MI', 45555.0), ('CA', 'L', 'EN', 83447.8), ('CA', 'L', 'EX', 159006.5), ('CA', 'L', 'MI', 98364.6), ('CA', 'L', 'SE', 120463.83333333333), ('CA', 'M', 'EN', 59500.0), ('CA', 'M', 'EX', 15000.0), ('CA', 'M', 'MI', 84802.33333333333), ('CA', 'M', 'SE', 152392.45283018867), ('CA', 'S', 'EX', 115222.0), ('CA', 'S', 'MI', 75000.0), ('CA', 'S', 'SE', 181369.0), ('CF', 'M', 'SE', 48609.0), ('CH', 'L', 'EN', 63487.5), ('CH', 'L', 'MI', 112549.5), ('CH', 'S', 'EN', 56536.0), ('CL', 'L', 'MI', 40038.0), ('CN', 'L', 'EN', 100000.0), ('CO', 'L', 'SE', 125000.0), ('CO', 'M', 'EN', 21844.0), ('CO', 'M', 'SE', 56500.0), ('CR', 'S', 'EN', 50000.0), ('CZ', 'L', 'MI', 69999.0), ('CZ', 'M', 'EN', 30469.0), ('CZ', 'M', 'MI', 5132.0), ('DE', 'L', 'EN', 80568.71428571429), ('DE', 'L', 'EX', 141846.0), ('DE', 'L', 'MI', 80497.6), ('DE', 'L', 'SE', 90249.25), ('DE', 'M', 'EN', 50436.5), ('DE', 'M', 'EX', 130026.0), ('DE', 'M', 'MI', 68544.0), ('DE', 'M', 'SE', 170163.55555555556), ('DE', 'S', 'EN', 51066.42857142857), ('DE', 'S', 'MI', 68600.33333333333), ('DE', 'S', 'SE', 96578.0), ('DK', 'L', 'EN', 19073.0), ('DK', 'L', 'SE', 88654.0), ('DK', 'S', 'EN', 37252.5), ('DZ', 'M', 'EN', 100000.0), ('EE', 'L', 'SE', 63312.0), ('EE', 'S', 'MI', 31520.0), ('EG', 'M', 'MI', 22800.0), ('ES', 'L', 'EN', 27317.0), ('ES', 'L', 'EX', 79833.0), ('ES', 'L', 'MI', 38228.0), ('ES', 'L', 'SE', 70423.5), ('ES', 'M', 'EN', 23713.75), ('ES', 'M', 'MI', 61223.41176470588), ('ES', 'M', 'SE', 59665.166666666664), ('ES', 'S', 'EX', 69741.0), ('ES', 'S', 'MI', 47282.0), ('FI', 'M', 'MI', 75020.0), ('FI', 'M', 'SE', 68318.0), ('FI', 'S', 'SE', 63040.0), ('FR', 'L', 'EN', 38284.0), ('FR', 'L', 'MI', 52299.333333333336), ('FR', 'L', 'SE', 87267.4), ('FR', 'M', 'EN', 51172.0), ('FR', 'M', 'MI', 69988.375), ('FR', 'M', 'SE', 89845.6), ('FR', 'S', 'EN', 51321.0), ('FR', 'S', 'MI', 52590.666666666664), ('FR', 'S', 'SE', 53654.0), ('GB', 'L', 'EN', 56049.0), ('GB', 'L', 'MI', 89857.77777777778), ('GB', 'L', 'SE', 95091.0), ('GB', 'M', 'EN', 63861.333333333336), ('GB', 'M', 'EX', 143877.5), ('GB', 'M', 'MI', 83154.95238095238), ('GB', 'M', 'SE', 102207.45161290323), ('GB', 'S', 'EN', 55410.0), ('GB', 'S', 'MI', 68182.0), ('GB', 'S', 'SE', 123510.0), ('GH', 'S', 'EN', 7000.0), ('GH', 'S', 'MI', 30000.0), ('GR', 'L', 'EN', 12877.0), ('GR', 'L', 'SE', 47899.0), ('GR', 'M', 'MI', 58574.454545454544), ('GR', 'S', 'MI', 20000.0), ('HK', 'L', 'MI', 65062.0), ('HN', 'S', 'MI', 20000.0), ('HR', 'M', 'MI', 91142.5), ('HR', 'S', 'SE', 45618.0), ('HU', 'L', 'MI', 35735.0), ('HU', 'M', 'EN', 17684.0), ('ID', 'L', 'EN', 15000.0), ('ID', 'L', 'MI', 53416.0), ('IE', 'L', 'SE', 172309.0), ('IE', 'M', 'MI', 88529.5), ('IE', 'M', 'SE', 128981.0), ('IE', 'S', 'SE', 68293.0), ('IL', 'L', 'SE', 423834.0), ('IL', 'M', 'MI', 119059.0), ('IN', 'L', 'EN', 39371.333333333336), ('IN', 'L', 'EX', 76309.0), ('IN', 'L', 'MI', 23267.235294117647), ('IN', 'L', 'SE', 58774.875), ('IN', 'M', 'EN', 18332.625), ('IN', 'M', 'MI', 18229.75), ('IN', 'S', 'EN', 12986.666666666666), ('IN', 'S', 'MI', 15654.0), ('IN', 'S', 'SE', 15806.0), ('IQ', 'S', 'EN', 100000.0), ('IR', 'M', 'EN', 100000.0), ('IT', 'L', 'MI', 51064.0), ('IT', 'L', 'SE', 68293.0), ('IT', 'M', 'EN', 24165.0), ('IT', 'S', 'EN', 21669.0), ('JP', 'S', 'EN', 41689.0), ('JP', 'S', 'MI', 71691.66666666667), ('JP', 'S', 'SE', 214000.0), ('KE', 'S', 'EN', 9272.0), ('KE', 'S', 'MI', 80000.0), ('LT', 'M', 'MI', 94812.0), ('LU', 'L', 'EN', 59102.0), ('LU', 'M', 'EN', 10000.0), ('LU', 'S', 'MI', 62726.0), ('LV', 'M', 'SE', 57946.5), ('MA', 'S', 'EN', 10000.0), ('MD', 'S', 'MI', 18000.0), ('MK', 'S', 'EN', 6304.0), ('MT', 'L', 'MI', 28369.0), ('MX', 'L', 'MI', 30000.0), ('MX', 'L', 'SE', 60000.0), ('MX', 'M', 'MI', 66000.0), ('MX', 'M', 'SE', 170000.0), ('MX', 'S', 'MI', 36000.0), ('MX', 'S', 'SE', 33511.0), ('MY', 'L', 'EN', 40000.0), ('NG', 'L', 'EN', 65000.0), ('NG', 'L', 'MI', 50000.0), ('NG', 'S', 'EN', 10000.0), ('NG', 'S', 'SE', 200000.0), ('NL', 'L', 'EN', 50944.0), ('NL', 'L', 'EX', 84053.0), ('NL', 'L', 'MI', 71314.0), ('NL', 'L', 'SE', 97629.33333333333), ('NL', 'M', 'MI', 102439.5), ('NL', 'S', 'MI', 54634.0), ('NZ', 'S', 'SE', 125000.0), ('PH', 'S', 'SE', 50000.0), ('PK', 'L', 'MI', 8000.0), ('PK', 'M', 'EN', 30000.0), ('PK', 'M', 'MI', 12000.0), ('PL', 'L', 'EX', 153667.0), ('PL', 'L', 'MI', 36227.333333333336), ('PL', 'S', 'MI', 44365.0), ('PR', 'M', 'SE', 167500.0), ('PT', 'L', 'EN', 21013.0), ('PT', 'L', 'MI', 55685.0), ('PT', 'L', 'SE', 68405.66666666667), ('PT', 'M', 'EN', 22809.0), ('PT', 'M', 'MI', 50180.0), ('PT', 'M', 'SE', 53782.333333333336), ('PT', 'S', 'SE', 29944.0), ('RO', 'L', 'MI', 53654.0), ('RO', 'M', 'MI', 60000.0), ('RU', 'L', 'EX', 168000.0), ('RU', 'M', 'EX', 85000.0), ('SE', 'M', 'EN', 80000.0), ('SE', 'S', 'EN', 130000.0), ('SG', 'L', 'EN', 66970.0), ('SG', 'L', 'MI', 82157.0), ('SG', 'L', 'SE', 8000.0), ('SG', 'M', 'MI', 41383.0), ('SI', 'L', 'MI', 24823.0), ('SI', 'L', 'SE', 102839.0), ('SI', 'M', 'MI', 61702.5), ('SK', 'S', 'SE', 12608.0), ('TH', 'L', 'EN', 15000.0), ('TH', 'L', 'MI', 24740.0), ('TH', 'M', 'SE', 29453.0), ('TR', 'L', 'SE', 20171.0), ('TR', 'M', 'MI', 18779.75), ('UA', 'L', 'EN', 13400.0), ('UA', 'M', 'SE', 84000.0), ('UA', 'S', 'SE', 50000.0), ('US', 'L', 'EN', 105386.73170731707), ('US', 'L', 'EX', 240000.0), ('US', 'L', 'MI', 126846.06666666667), ('US', 'L', 'SE', 175539.59493670886), ('US', 'M', 'EN', 104835.26016260163), ('US', 'M', 'EX', 204151.7888888889), ('US', 'M', 'MI', 129675.77541371158), ('US', 'M', 'SE', 157701.42453282225), ('US', 'S', 'EN', 80196.0), ('US', 'S', 'EX', 249000.0), ('US', 'S', 'MI', 76013.21428571429), ('US', 'S', 'SE', 122588.23529411765), ('VN', 'L', 'EN', 12000.0)]


 [2024-11-30 13:40:31][DEBUG]: == Working Agent: Senior Data Analyst
 [2024-11-30 13:40:31][INFO]: == Starting Task: Analyze the data from the database and write an analysis for Effects on salary (in USD) based on company location, size and employee experience.
 [2024-11-30 13:40:33][DEBUG]: == [Senior Data Analyst] Task output: Based on the analysis, we can conclude that:

1. Location has a significant impact on salary, with certain locations offering higher average salaries than others.
2. Company size also has a significant impact on salary, with larger companies tend to offer higher average salaries.
3. Employee experience is also an important factor, with more experienced employees tend to earn higher average salaries.
4. The interaction between location, company size, and experience is complex, and certain combinations tend to offer higher average salaries than others.

These insights can be used to inform salary decisions and talent acquisition strategies for companies operating in different locations and industries.


 [2024-11-30 13:40:33][DEBUG]: == Working Agent: Senior Report Editor
 [2024-11-30 13:40:33][INFO]: == Starting Task: 
Write an executive summary of the report from the analysis. The report
must be less than 100 words.

 [2024-11-30 13:40:42][DEBUG]: == [Senior Report Editor] Task output: **Executive Summary**
===============

#### Key Findings

* Location significantly impacts salary, with certain locations offering higher average salaries than others.
* Company size also has a significant impact on salary, with larger companies tend to offer higher average salaries.
* Employee experience is an important factor, with more experienced employees tend to earn higher average salaries.
* The interaction between location, company size, and experience is complex, and certain combinations tend to offer higher average salaries than others.

#### Implications

These insights can inform salary decisions and talent acquisition strategies for companies operating in different locations and industries.


```
**Code Source:**[https://github.com/curiousily/AI\-Bootcamp/blob/master/14\.sql\-agents\-with\-llama3\-crewai.ipynb](https://github.com/curiousily/AI-Bootcamp/blob/master/14.sql-agents-with-llama3-crewai.ipynb)


