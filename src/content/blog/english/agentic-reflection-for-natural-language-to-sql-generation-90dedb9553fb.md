---
title: "Agentic Reflection for Natural Language to SQL Generation"
meta_title: "Agentic Reflection for Natural Language to SQL Generation"
description: "The article discusses the challenges of converting natural language to SQL (NL2SQL) and presents an agentic reflection approach to enhance the accuracy of SQL generation. Traditional methods often struggle with context understanding and complex queries, leading to high error rates. The proposed iterative workflow involves generating an initial SQL query, validating it, and then refining it through a reflection process that reviews and corrects the output. This methodology significantly improves accuracy, achieving over 90% correctness in real-world applications, thereby facilitating better data access for non-technical users."
date: 2024-12-26T04:30:18Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Kz0Xc98OTPMnebDAoYSdFg.png"
categories: ["Programming", "Natural Language Processing", "Data Science"]
author: "Rifx.Online"
tags: ["NL2SQL", "SQL", "reflection", "workflow", "accuracy"]
draft: False

---




*Authors: Atul Varshneya, Toby Fotherby, Shweta Keshavanarayana*


## Introduction

Natural language to SQL (NL2SQL) conversion promises to democratize data access for non\-technical users. However, the process is fraught with challenges. Ambiguities in natural language, variations in database schemas, the large number of tables in databases, and the complexity of SQL syntax often lead to inaccurate and/or inefficient SQL query generation. Even advanced AI models struggle with context understanding, join conditions, and complex aggregations, resulting in errors that can compromise data integrity and decision\-making processes. As organizations increasingly rely on data\-driven insights, the need for accurate and reliable natural language to SQL solutions has become more important.

In this article we present a Generative AI Reflection agenticapproach which goes beyond the typical one\-pass application of thenatural language to SQL, and leverages agentic reflection to improvegenerative accuracy. This approach analyzes the output of the first\-passSQL generation identifies and corrects errors in the initially generatedSQL. This not only improves accuracy but is adaptable to diversedatabase environments.


## Brief overview of Agentic Workflows

Until recently, most generative AI based applications were developed through writing a good prompt, with specific instructions, relevantcontext, few\-shot examples, etc., and inputting that to a Large LanguageModel (LLM) to generate the desired response. With progressivelypowerful models becoming available, such strategies can performreasonably well. However, there is another way of thinking aboutprompting LLMs beyond such single and direct prompting approach, byutilizing a more iterative way of working on the task. Essentially,following a workflow more typical of how humans would perform the task.Such iterative approaches not only result in improvements in the qualityof the output, but also open doors for alternative and powerfulparadigms for performing complex tasks.

Such iterative workflow patterns can take various forms. While there isno particular commonly agreed way to categorize these patterns, thefollowing is one reasonable way mentioned in industry [literature](https://www.deeplearning.ai/the-batch/how-agents-can-improve-llm-performance/).

* **Reflection**: Review and improve the previously generated output. For example, write code per the provided prompt, review it, identify issues, and generate updated code to fix those. Using this approach, [deeplearning.ai reports](https://www.deeplearning.ai/the-batch/how-agents-can-improve-llm-performance/) a boost in performance for HumanEval coding benchmark from 48\.1% to 95\.1%. A broad description of reflection agents can be found in [this article](https://blog.langchain.dev/reflection-agents/).
Please note, for this article this agentic workflow is of specific interest.
* **Tool use**: Use of tools for specialized operations to get information, perform actions, process information, etc. For example, provide the agent an API for looking up the orders to answer user questions about their orders, or provide the agent an API to perform actions such as send emails.
* **Planning**: Prompt the LLM to decompose the user request into a sequence of steps to accomplish that task. The goal is to enable the best path for an agent to be able to reason better, and delegate tasks if needed.
* **Multi\-agent collaboration**: Multiple agents collaborating by splitting up tasks per their specialization, so as to come up with a solution to the requested task.

As mentioned earlier, we leverage agentic reflection to review and rewrite the SQL generated initially through a direct prompt to an LLM. Using this approach for a real business use case we achieved over 90% correct SQL generation. The methodology presented in this article follows the pattern outlined below.



The first pass generates SQL in an open\-loop flow, based on a prompt tailored for leveraging the inherent capabilities of the LLM. This first step results in the initial generation of SQL based on the user request. Subsequently the approach follows an iterative agentic workflow which involves a validation step, \#2, and a review and remediation step, \#3\.

The specifics of the Validation step varies by implementation and may apply both standard and application specific logic to evaluate the likely validity of the generated SQL. For instance, this may include syntax checks of the output, heuristic checks related to known common failure conditions, or leverage an LLM\-as\-judge evaluator pattern. If the validation condition all pass, or an exit condition is determined (e.g. maximum number of iterations has been reached), the final result and status is returned to the calling application.

The Review and Remedy step uses the most recently generated response and its inputs, and the results of the validation. It generates a revised response, with updated SQL, to remedy issues detected based on its input. As shown in the figure, the steps \#2 and \#3 can be repeated as required.


## How it works


### Single\-Pass Pipelines for Natural Language to SQL Generation

A single\-pass pipeline is the most typical one presented in articles and is in common use today. The solution pattern we describe in this article extends and improves on this approach, so we’ll describe it briefly, to establish the baseline.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*hVfpS5PajolVoRKPXVrIeA.png)

The pipeline starts with a request in the form of a natural language query from a client application or service. Application metadata is typically passed along with the query, and may be used during the pre\-processing of the request, or for logging purposes. Together, these data elements make up the NL2SQL request.


### Pre\-process Request

The processing that occurs in this step varies based on implementation and is optional. The typical objective is to leverage contextual data related to the NL2SQL request so the quality of the prompt for the LLM can be enhanced. Examples include determining the application and data domain of the end\-user’s query, getting information about the end\-user’s operating domain, and getting context from user’s history of interactions.


### Prepare Prompt

The goal of this step is to create an optimal prompt for SQL generation based upon the NL2SQL request and information generated during the pre\-processing step. Minimally, this includes selecting a prompt template appropriate for the request and inserting values for the variables noted in the template. This may also include SQL metadata, such as table definitions and associated conventions, related to the data domain of the query.


### Generate SQL

An LLM that has been trained for NL2SQL tasks is invoked with the prepared prompt. The primary objective is to generate valid sequel that correspondence to the users query. Optionally, supporting metadata may be generated, such as a list of the tables in the output SQL, and the rationale for the SQL that was generated for the query. This optional data may be used as input for downstream processes, such as validation, or for logging and subsequent analysis.


### Validate

The output of the LLM needs to be validated before being returned to theclient application. The specific logic for validation will vary byimplementation and objectives. For the purpose of explanation, we notethe following typical examples. Depending of the validation functionsbeing applied, the output from steps A and B (Pre\-process Request andPrepare Prompt) is also available as input to the Validate step.

1. It is common that the LLM has multiple output values, as noted above, and that these outputs are wrapped in a JSON document or XML style tags. Minimally, the validation step will check that the LLM output is formatted correctly.
2. It is also common that the prompt that drives the LLM will include an option for the LLM to not produce SQL output, for instances such as when a client request may be inappropriate for the configuration. This will be checked.
3. Check if the generated SQL is syntactically valid.
4. Check if the the generated SQL is valid for the application data structures (e.g. the tables and views).


### Results

It is typical that the output of validation is returned to the client. This may include the validation status, pass or fail, plus the generated SQL, if the validation status is “pass”, and optionally, other metadata such as the query generation rationale and processing statistics.

For simple natural language to SQL solutions, this is the complete pipeline. If the SQL generated fails validation it is not corrected. There may also be cases where there are semantic errors in the generated SQL, such as an incorrect column used for joining, or an incorrect filter value being applied, that are not detected by the validation code. Depending on the complexity of the data domain and input queries, the single\-pass approach may have generation error rates of 30% or higher.


## Agentic Reflection for NL2SQL Generation

This approach augments the single pass solution described above. Properly configured, this solution will have higher generative accuracy. In our testing with real\-world use cases, we have seen accuracy rates of over 90%.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*hs_pLoMfGQrUuFWr5MEFSg.png)


### First Pass

This is the same as steps A, B and C described above. No changes to those steps are required, except for the outputs of steps A, B and C being made available to the Validate and Prepare Review Prompt steps.


### Validate

The starting point for the code of the Validate step for agentic reflection is the Validate step used for the single\-pass solution. The Validate process should already be detecting generative failures such as format and syntax errors (as noted above). The initial change to this code is that rather than returning a failed result, the Validate process will forward the failure information, along with the supporting data from the First Pass, to the Agentic Reflection process. That process will focus on reviewing and remediating the generated output. As before, if the input to Validate passes the checks applied, then Validate will format the Result for output.

When adding an Agentic Reflection, there is often value in extending the validation process, to include checks for queries that tend to produce incorrect outputs during the First Pass, and/or for SQL statements associated with incorrect outputs. By flagging queries and outputs that have proved problematic during testing and/or in production, the Agentic Reflection process can pick up results from the First Pass and improve the generative output.


### Prepare Review Prompt

The step prepares the Agentic Reflection prompt that will be used to drive the LLM to review and remediate the previously generated SQL. In the implementation described here, the review (aka Reflection) and the remediation of the SQL (the application of the results of the review), occurs within a single call to an LLM that has been trained for solving natural language to SQL tasks.

The input to this step typically includes the outputs from the First Pass steps (A, B and C), and from Validate (step 2\). This data is used to create the reflection prompt. The specifics will vary based on the implementation, however, some common patterns are expected. For instance:

1. The stated objective of the task is to review input SQL for the
user’s query, and to output syntactically and logical correct SQL to
match the user’s query
2. The reflection prompt will include the user’s request
3. It will include the most recently generated SQL for review
4. It will include some specific directions based on the results of Validate (e.g. “Note: The given SQL solution has a logical error. It refers to a table that does not exist. Please correct this.”)
5. The review prompt will also include the full set, or a pruned set, of the SQL metadata that was used to generate the SQL that is being reviewed

Note: Pruning the SQL metadata to the minimal scope that is appropriate to the query being processed will improve inference efficiency, and typically increases generative accuracy also. Further, to facilitate correct SQL generation for cases where the SQL logic particularly challenging, additional SQL metadata may be conditionally added at this point.


### Review and Remedy SQL

An LLM that has been trained for NL2SQL tasks is invoked with the prepared Reflection prompt. As before, in step C, the primary objective is to generate valid SQL that correspondence to the users query, and optionally, supporting metadata may be generated, to be used as input for downstream processes, such as validation, or for logging and subsequent analysis.

The results are directed to the Validate process, for assessment. Depending on the assessment, the final result may be output to the calling client, or the Agentic Reflection process may be called again.


## Walkthrough of an Illustrative Implementation

Here we follow an illustrative implementation of the approach presented in this article, and walk through it using a sample user query. This implementation is available on GitHub \[[link](https://github.com/genai-articles/nl2sql_with_agentic_reflection)], and readers are encouraged to download it and run through the steps with the explanation below.


### Problem Setup

The problem addressed in this implementation involves a VPN application and network policy database, that allows users to query that database using natural language.

The end\-to\-end functionality of the application can be envisioned to take the user’s query in natural language, generate a SQL corresponding to the question, execute the generated SQL query, and then present that query results to user. Depending on the user’s natural language query, the generated SQL might be invalid in certain cases. Those cases would result in the application returning a failure, and/or ask the user to rephrase the question.

As would be clear, in this overall end\-to\-end application flow, the approach presented here deals only with the generation of SQL.

For the walkthrough of the execution of the steps, we will use the user query “List my VPN Policies”. We will start from the output from the First Pass, and go over the steps of the agentic SQL reflection pipeline.


### Execution Flow

Following is the code for the top\-level iterative loop for the agentic reflection part of the execution flow. This is for a quick reference for now, in subsequent sub\-sections we will go over each of the steps, and the processing that step results in.

The variable `reflection_state` holds the state of the execution and is passed on to functions at each step. The contents of this object are what are minimally required here, and can have more information fields as required in your solution. It also holds some flow tracking fields namely, iteration to track the iteration number, and source to track the source of last SQL generation, `‘First-Pass’` or `‘Reflection-Pass’`.


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
**Step 1 — First Pass**

As mentioned, we start from the point were the first pass execution hasbeen completed. The state object stores the user query and the generatedSQL after that pass, as given below.


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
**Step 2 — Validation of the output from first pass**

This illustration implementation has a validation function more as a placeholder. The code file has comments to suggest how you can write your own validation function.

The placeholder validation function returns a failure the first time, which makes the control move forward in the iteration loop for performing review and remedy (aka reflection) of the previously generated SQL.


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
**Step 3 — Review prompt preparation**

This step builds the prompt for the LLM to review the previously generated SQL and generate a potentially better one.

The prompt is composed of —

1. Instructions for the LLM to perform the reflection task
2. the user query for which the SQL generation is required
3. the previously generated SQL to review and improve upon
4. the schema of the database (see `dbtables_schema.py`) for which the
SQL will be generated
5. any rules or hints that have been provided (see `dbtables_rules.py`) on how the tables should be used

Note the instructions provided include the role the LLM plays, an expert in Postgres and network firewall, as well as details of what task is required to be accomplished, i.e., detailed instructions on reviewing the provided SQL query and create a better one. Additionally, the prompt in this implementation also asks the LLM to think how it will do the task, put those thoughts within a `<thinking>` tag. This is a good idea when asking the LLM to perform some non\-trivial tasks. Finally, the prompt asks the newly generated SQL to be placed within a `<sql>` tag.

Please see the prepared prompt below. Certain parts of the prompt, such as instructions, schema, are spliced to save on space here.


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
**Step 4 — Invoke LLM to review and remedy**

Next, the LLM is invoked with the prepared prompt to perform the task of reviewing and fixing (reflecting) the previously generated SQL. The SQL is extracted from the `<sql>` tag in its output, and copied into the `reflection_state` object.

Looking at the `<thinking>` tag in the output of the LLM helps see how LLM went about analyzing the situation, thus also helps with debugging the reflection prompt. The `<thinking>` tag from this run is shown below.

Based on the mentioned thinking, the LLM generates the newer and most likely a better SQL query.


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
**Step 2, second iteration — Loop back to validate this new output**

Next, the control goes back to the top of the loop and the validation is performed on the newly generated SQL query by the reflection step. This time the placeholder validation function performs a syntax check of the generated SQL and returns the result as success, thus terminating the reflection iteration loop.


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
**Final result**

The final result of the run is picked from the `reflection_state` object.


```python
## "validation": true, 
## "sql": "SELECT DISTINCT vpn_policy_union.name, vpn_policy_union.policy_type \
##     FROM vpn_policy_union WHERE vpn_policy_union.policy_type = 'VPN'"
```

## Conclusion

To conclude, in this article we have described an agentic pattern for generating SQL from textual user queries. We specifically used reflection agentic workflow, to iterate and improve the generation of the SQL query.

The implementation is available on GitHub at \[[link](https://github.com/genai-articles/nl2sql_with_agentic_reflection)]. Our implementation uses LLM on Amazon Bedrock due to the ease of use it offers, but can be changed easily to use LLMs of your choice. Please contact the authors if you would like to discuss this further.


## About the Authors

**Atul Varshneya** is a Principal AI and ML Specialist at Amazon Web Services (AWS). He currently focuses on developing solutions in the areas of AI/ML, and particularly generative AI. In his career of four decades, Atul has worked as the technology R\&D leader in multiple large companies and startups. Outside of work he enjoys performing Hindustani classical music.

**Toby Fotherby** is an Senior AI and ML Specialist Architect at Amazon Web Services (AWS), helping customers use cloud\-based AI/ML and GenAI services to rapidly scale their innovations. He has over a decade of cross\-industry expertise leading strategic initiatives. Toby also leads a program training the next generation of AI Solutions Architects.

**Shweta Keshavanarayana** is a Senior Customer Solutions Manager at AWS. She works with AWS Strategic Customers and helps them in their Cloud Migration and Modernization journey. Shweta is passionate about solving complex customer challenges using creative solutions. She holds an undergraduate degree in Computer Science \& Engineering. Beyond her professional life, she volunteers as a team manager for her sons’ U9 cricket team, while also mentoring women in tech and serving the local community.

*This article represents the opinions of the authors, not the opinions of their employer.*


