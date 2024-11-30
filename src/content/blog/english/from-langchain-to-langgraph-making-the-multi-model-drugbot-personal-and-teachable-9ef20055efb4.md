---
title: "From LangChain to LangGraph: Making the Multi-Model DrugBot Personal and Teachable"
meta_title: "From LangChain to LangGraph: Making the Multi-Model DrugBot Personal and Teachable"
description: "The article discusses the evolution of the DrugBot chatbot, transitioning from LangChain to LangGraph, enhancing its ability to assist users in navigating drug trial information. The new DrugBot incorporates memory and learning capabilities, allowing it to understand user-defined terms and maintain context across interactions. It leverages a multi-model database, DrugDB, to generate complex queries efficiently and improve user experience. The updates also enable the chatbot to proactively seek clarification and manage hybrid queries, addressing previous limitations. Overall, the integration of LangGraph fosters a more responsive and context-aware chatbot, enhancing access to critical medical information."
date: 2024-11-30T13:42:29Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*WOaHORZdumJ-Po5RniDhvg.jpeg"
categories: ["Chatbots", "Health", "Machine Learning"]
author: "Rifx.Online"
tags: ["DrugBot", "LangGraph", "DrugDB", "chatbot", "queries"]
draft: False

---





### Adding memory and learning ability to the human\-in\-the\-loop chatbot



Drug trials test new medications for safety, effectiveness, and efficacy in humans. These critical studies are essential for developing and approving life\-saving therapies. While drug trials offer hope to countless patients with serious illnesses, many remain unaware of their eligibility or the potential benefits. A user\-friendly drug trial information system can bridge this gap. It should contain a database with authoritative information and an easy\-to\-use frontend, with which patients can navigate the complex world of clinical research and discover beneficial opportunities.

In my previous articles, [*DuckDB as a DrugDB: a Free and Simple Multi\-Model Drug and Trial Database*](https://readmedium.com/duckdb-as-a-drugdb-a-free-and-simple-multi-model-drug-and-trial-database-83c222d1e9dd) and [*Tailor a Multi\-Model Chatbot for a Multi\-Model DuckDB*](https://readmedium.com/tailor-a-multi-model-chatbot-for-a-multi-model-duckdb-8afb7ac4c1fa), I built a drug database called **DrugDB** and its corresponding chatbot named **DrugBot**. DrugDB is built on top of [DuckDB](https://duckdb.org/), a multi\-model database. Users can combine SQL, graph, vector, and full\-text queries to explore a network of drugs, disorders, mechanisms of action (MOA), and [drug trials](https://readmedium.com/getting-insights-from-3-000-clinical-trials-in-a-knowledge-graph-df17e55fa860). However, its technical nature can be daunting for average patients. To bridge this gap, I developed a user\-friendly chatbot that leverages LangChain and Streamlit. This chatbot generates draft queries based on user input. Users can then refine these queries and let the chatbot execute them to find the answers. By combining the strengths of DuckDB, LangChain, and Streamlit, patients can easily access crucial medical information, such as drug mechanisms of action and relevant clinical trials. This human\-in\-the\-loop approach ensures accuracy and reliability, mitigating potential LLM hallucinations.

However, DrugBot has lots of room for improvement. It lacks both in\-session and user\-specific cross\-session memory, hindering its ability to understand pronouns or user\-defined terms like Peter Attia’s “[four horsemen diseases](https://blog.petrieflom.law.harvard.edu/2024/03/05/outlive-by-peter-attia-a-book-review/).” Additionally, while it can effectively use individual tools, it struggles to combine them for complex queries, such as identifying 5 trials for the top 7 liver\-related disorders. Furthermore, DrugBot cannot request clarification for ambiguous queries and sometimes generates incorrect LIMIT clauses.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ffJyB41Iz1jhWZR20xRTCQ.png)

To overcome these limitations, I have rewritten DrugBot with [LangGraph](https://langchain-ai.github.io/langgraph/). LangGraph manages LLM workflows as graphs, where information flows along the edges between the function nodes. This, combined with state and memory mechanisms, allows the new DrugBot to understand user\-defined terms and maintain context throughout conversations. Inspired by [Vanna.ai](https://vanna.ai/), LangGraph empowers DrugBot to learn from past interactions, store complex queries, and even replicate them for future use. Additionally, the chatbot can now proactively seek clarification when encountering ambiguity. Finally, LangGraph streamlines Python code organization, promoting maintainability. I’ll explore these revisions in detail throughout this article. The code for this project is hosted on my GitHub repository here.


## 1\. DrugDB

The LangGraph DrugBot interfaces with the same DrugDB database as in my previous articles ([1](https://readmedium.com/clinical-trial-search-with-google-spanner-graph-sql-vector-and-llm-all-in-one-query-5ada29f840cd), [2](https://readmedium.com/postgresql-goes-multi-model-graph-vector-and-sql-5f27dbc04835), [3](https://readmedium.com/build-a-drug-trial-database-with-the-multi-model-surrealdb-6a23c2b5faa3), [4](https://readmedium.com/duckdb-as-a-drugdb-a-free-and-simple-multi-model-drug-and-trial-database-83c222d1e9dd), and [5](https://readmedium.com/tailor-a-multi-model-chatbot-for-a-multi-model-duckdb-8afb7ac4c1fa)). This extensive database encompasses over 5000 drugs, 500 mechanisms of action, 2000 disorders, and 2000 drug [trials](https://readmedium.com/getting-insights-from-3-000-clinical-trials-in-a-knowledge-graph-df17e55fa860). Powered by DuckDB with the DuckPGQ, fts, and vss extensions, DrugDB supports a combination of queries, including SQL, graph, vector, and full\-text search. This capability allows for complex multi\-hop queries, such as the SQL\-graph hybrid query in Code 1, which can identify 4 trials testing ‘UGT1A9 Inhibitors’ drugs.


```python
/* Code 1 */

SELECT Trials.PostingID AS trial_id, Trials.StudyTitle AS StudyTitle, drug_with_moa.drug_name
FROM Trials, 
    GRAPH_TABLE(drug_graph MATCH (i:Drug)-[m:HAS_MOA]->(a:MOA WHERE a.name='UGT1A9 Inhibitors')
              COLUMNS (i.drug_cui AS drug_cui, i.name AS drug_name))  drug_with_moa
WHERE list_contains(Trials.drug_cui, drug_with_moa.drug_cui)
LIMIT 4
```
While such a multi\-model database is powerful, it can be challenging for average users to construct accurate queries. This is where a chatbot can streamline the process, making it easier for users to access the information they need.


## 2\. Implementation


### 2\.1 Overview

Building upon its predecessor, the LangGraph DrugBot continues to provide a user\-friendly interface for interacting with DrugDB. The core function of reading user queries, generating draft queries, asking for confirmation, and providing human\-readable answers remains the same. However, the new version introduces significant enhancements, including the ability to recall past dialogues, understand user\-defined concepts, ask clarification questions, and generate complex queries by learning from examples.

LangGraph sets itself apart from LangChain through its graph\-based approach to organizing LLM workflows. There are three essential elements in a LangGraph graph: nodes, edges, and state. Nodes represent functions that process the application’s state, while edges define the data flow between these nodes. State, acting as the application’s memory, persists and updates between the nodes. A LangGraph begins with a “**start**” node and concludes with an “**end**” node. Figure 2 is the visual representation of the DrugBot graph.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*zXVgfsVNRbp_TZblNQtO-A.jpeg)

A dialog starts with a user input. When a user provides a definition statement (e.g., “we define cardiovascular diseases, carcinoma, Alzheimer’s disease, and diabetes mellitus as the ‘Four Horsemen Diseases’.”), the main switch node, `select_intent`, routes the state data to the `update_concept` node. This node then adds or updates the definition within the user\-specific memory, as illustrated in the middle section of Figure 2\.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*g7lFUd6icjapQxFUo4SbMw.png)

Conversely, when the input is a question, `select_intent` activates the `select_query_tool` node, initiating the main query\-and\-answer process (as depicted in the right section of Figure 2 and Figure 3\). If the question is ambiguous, the LangGraph DrugBot will request clarification. For other input types, such as greetings or expressions of gratitude, the bot will respond politely before transitioning to the **end** node.


### 2\.2 Nodes

LangGraph nodes typically receive the current state, configuration, and memory store as inputs. These nodes then perform specific operations, such as calling an LLM, utilizing a tool, or transforming data. The resulting modified states are subsequently passed to the next node via the edges. The `select_intent` node’s Python code in Code 2 serves as an illustrative example of this process.


```python
## Code 2. The select_intent node, the route_message function 
## and their conditional edge

config = {"configurable": {"thread_id": "1", "user_id": "sixing"}}

MODEL_SYSTEM_MESSAGE = """You are a helpful chatbot. 

..."""

class Choose_Direction(TypedDict):
    """ Decision on which route to go next """
    action_type: Literal['update_concept', 'select_query_tool']

def select_intent(state, config, store):
    """Load user defined concepts from the store and use them to personalize the chatbot's response."""

    # Get the user ID from the config
    user_id = config["configurable"]["user_id"]

    # Retrieve profile memory from the store
    namespace = ("profile", user_id)
    memories = store.search(namespace)
    if memories:
        user_definition = memories[0].value
    else:
        user_definition = None

    system_msg = MODEL_SYSTEM_MESSAGE.format(user_definition=user_definition)

    messages = trim_messages(
            state["messages"],
            max_tokens=32000,
            strategy="last",
            token_counter=ChatOpenAI(model="gpt-4o"),
            allow_partial=False,
        )
    
    response = llm.bind_tools([Choose_Direction], parallel_tool_calls=False).invoke([SystemMessage(content=system_msg)] + messages)

    return {"messages": [response]}


def route_message(state, config, store) -> Literal[END, "update_concept", "select_query_tool"]:
    """Reflect on the memories and chat history to decide whether to update the memory collection."""
    message = state['messages'][-1]
    if len(message.tool_calls) ==0:
        return END
    else:
        tool_call = message.tool_calls[0]

        if tool_call['args']["action_type"] == "update_concept":
            return "update_concept"
        elif tool_call['args']["action_type"] == "select_query_tool":
            return "select_query_tool"
        else:
            raise ValueError


builder.add_edge(START, "select_intent")
## conditional edge determines whether 
## it goes to update_memory or select_query_tool
builder.add_conditional_edges("select_intent", route_message)
```
The `select_intent` node reads the `user_id` from the configuration and fetches the corresponding user\-specific definitions from the memory store. These definitions are then integrated into the system prompt. To optimize token usage, the node trims the state messages. The refined prompt and state messages are subsequently sent to the LLM, which determines the next course of action: either updating the concept in the memory or selecting a query tool to generate the draft query.


### 2\.3 Tools

Tools operate in the same way in both LangGraph and LangChain. They are functions that can be called by the LLM to carry out certain tasks. The new chatbot relies on SQL, graph, vector, full\-text, and the new mimicking tool for its draft query generation (Figure 3\). Code 3 is the Python code for the mimicking tool (5th tool in Figure 3\).


```python
#Code 3. The mimicking tool.

@tool
def mimicking(question: str, top_k: int):
    """ When you think the question is unlikely to be answer by a single simple query tool, 
    or the question may likely require a complex combination of sql, vector, graph, and full-text search tools,
    or it may require to join several tables, use this tool to generate those complex queries by closely mimicing the examples."""
    examples = []

    for line in open("interaction.jsonl", "r").readlines():
        example = json.loads(line)
        examples.append(example)

    database_description = my_db_specifics.sql_database_prompt

    example_selector = SemanticSimilarityExampleSelector.from_examples(
        examples,
        OpenAIEmbeddings(),
        LanceDB,
        k=5,
        input_keys=["input"],
    )

    example_prompt = PromptTemplate.from_template("User input: {input}\ngraph query: {query}")

    complex_generation_prompt = FewShotPromptTemplate(
        example_selector=example_selector,
        example_prompt=example_prompt,
        prefix="""You are a duckdb expert. Given an input question, take the examples as templates, and only substitute the template variables with those extracted from the question. Closely mimicing the examples and don't modify the examplar structure easily, since they are curated by human. Add a 'LIMIT {top_k}' clause to the end of the query. \n\nHere is the relevant table info: {table_info}\n\nBelow are a number of examples of questions and their corresponding queries. Use them to as inspiration generate your query.
        - Almost always start with SELECT, unless it is a graph query.
        - The subquery in FROM clause should have an alias, without the keyword AS, Here is an example: SELECT * FROM Trials, GRAPH_TABLE( ... )  drug_for_disease WHERE Trials.drug_cui = drug_for_disease.drug_cui
        - If the search term contains a single quote, it should be escaped with another single quote. For example, 'Alzheimer's Disease' should be 'Alzheimer''s Disease'.
        - Only return query not anything else like ```sql ... ```
        - Every variable in the graph pattern has to be bound by a variable. For example, (i:Drug)-[:MAY_TREAT]->(c:Disorder WHERE c.name = 'Alzheimer''s Disease') is not correct because :MAY_TREAT is not bound to a variable. Instead, it should be (i:Drug)-[m:MAY_TREAT]->(c:Disorder WHERE c.name = 'Alzheimer''s Disease').
        - If it is a graph query, use "COLUMNS" as the return statement in the graph query.
        - Based on the question, include a 'LIMIT' clause before the end of the query. Never write 'LIMIT 0;' nor 'LIMIT;' If you are unsure about the number of results, remove the LIMIT clause entirely.
        - Make sure all parentheses are balanced.
        - Ends with a semicolon
        - Output the final query only.
        """,
        suffix="User input: {input}\ngraph query: ",
        input_variables=["input", "table_info", "top_k"],
    )

    generate_query = (
        complex_generation_prompt
        | llm | StrOutputParser()
    )

    query = generate_query.invoke({"input": question, "table_info": database_description, "top_k": top_k})
    return query
```
As its name implies, the mimicking tool generates new queries by imitating user\-provided question\-query pairs. It begins by identifying semantically similar examples and then replaces their variable slots with new values derived from the current question. This tool is particularly effective for generating complex queries that involve multiple search tools.


### 2\.4 Edges

A workflow can have branches, where a node, accompanied by a conditional edge, makes a decision to determine the subsequent node. Code 2 illustrates how the `select_intent` node employs this mechanism to decide between the `update_concept` node and the `select_query_tool` node.


### 2\.5 State and memory

The state is like the baton in a relay race. It is enriched by the nodes and gets passed along the edges. It’s a dictionary containing a message array and additional data (Code 4\). This state data can accumulate in memory, enabling the chatbot to recall past dialogue content.


```python
## Code 4. The incorporation of state and memory in the graph

from langgraph.graph import StateGraph, MessagesState

class State(MessagesState):
    selected_tools: list[str]

builder = StateGraph(State)

db_path = 'checkpoints.db'
conn = sqlite3.connect(db_path, check_same_thread=False)
within_thread_memory = SqliteSaver(conn)

across_thread_memory = InMemoryStore()
app = builder.compile(checkpointer=within_thread_memory, interrupt_before=["human_feedback"], store=across_thread_memory)
```
However, due to Streamlit’s frequent application reruns, which empty the memory, the LangGraph chatbot must store its state on disk. Additionally, the LangGraph DrugBot leverages long\-term memory to retain user\-specific information across multiple chat sessions, allowing users to define custom concepts like the “[Four Horsemen Diseases](https://blog.petrieflom.law.harvard.edu/2024/03/05/outlive-by-peter-attia-a-book-review/).”


### 2\.6 Interface

The updated interface enhances the previous version by introducing a query tool dropdown menu and a “Save interaction” button (Figure 1\). The dropdown menu empowers users to select the preferred query method for each interaction. The “Save interaction” button allows the saving of current questions and their corresponding DrugDB queries to a JSONL file, which can be leveraged by the mimicking tool for future query generation. The confirmation panel now incorporates a query editor powered by [streamlit\-monaco](https://github.com/marcusschiesser/streamlit-monaco), offering syntax highlighting and line numbers.


## 3\. Test

The previous chatbot lacked memory and struggled with generating complex hybrid queries. Additionally, the SQL and graph query tools sometimes set incorrect limit values, leading to inaccurate results. The new chatbot was specifically designed to overcome these limitations. Consequently, my testing efforts focused primarily on assessing its performance in these areas.


### 3\.1 User\-defined concepts in long\-term memory

As illustrated in Figure 1, the user initially defined the concept “Three Small Players” (“The ‘Three Small Players’ pharmaceutical companies are Astellas, Novartis, and ViiV.”). The LangGraph chatbot stored this list in its long\-term memory. When the user subsequently referenced this concept in the second round (“Tabulate the amount of trials sponsored by ‘the Three Small Players’.”), the chatbot successfully resolved the mention and generated the correct query.


### 3\.2 Short\-term memory

The subsequent test showcased the chatbot’s capacity to ask follow\-up questions and resolve pronouns by leveraging short\-term memory (Figure 4\).

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*H9sqHv1ug2CIb_lM1CKuDg.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*pT-jjW2g4wCK0tATmcfwaQ.png)

When the user inquired, “*What disorder can this drug treat?*”, the chatbot initially struggled to understand the reference to “this drug.” To clarify the query, it asked, “*Could you please specify the name of the drug you are referring to?*” Once the user provided the drug name, *hydroflumethiazide*, the chatbot was able to proceed and complete the query.


### 3\.3 Complex hybrid query

Furthermore, the new chatbot could construct intricate hybrid queries using the innovative mimicking tool.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*G3gdS17jJ1xnRPaEGCI1qg.png)

As illustrated in Figure 5, the user posed a three\-hop query: “*Show 5 trials that tested drugs against the top 7 liver\-related disorders.*” The chatbot analyzed this query, identified the most relevant examples from a predefined set, and synthesized a correct query based on these examples. This interaction can be saved for future reference, fostering a continuous learning loop.


### 3\.4 The LIMIT clause

Finally, the new SQL and graph querying tools employ a two\-phase process to create draft queries. First, they analyze the user’s question to generate the core query structure, including the SELECT, FROM, and WHERE clauses. Then, they check if the user has specified any result limits — if so, they add appropriate LIMIT clauses to the ends of the queries to constrain the output sizes. This modular approach ensures that the generated queries are grammatically correct, accurate and properly bounded.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*6fJfQBicrylrM7vZjUmifg.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*mXtGHAqmhYSheLqUgzTngw.png)

The two dialogs in Figure 6 demonstrated the chatbot’s ability to accurately implement user\-specified limits. Furthermore, chatbot sets a default limit of 30 when no explicit limit was provided by the user to prevent interface freezes.


## Conclusion

Nowadays, there are more and more no\-code platforms for building AI workflows, such as [n8n](https://n8n.io/), [zapier](https://zapier.com/), and [Voiceflow](https://www.voiceflow.com/). Users can quickly construct LLM applications through drag\-and\-drop interfaces and visual programming, without writing any code. But they often fall short when it comes to deep data exploration and custom database interactions. When users need to perform specialized queries or create context\-aware responses based on their unique data schema, developing a custom chatbot through coding becomes essential. A tailored chatbot, designed to understand the nuances of specific database structures, can leverage advanced indexing methods and sophisticated retrieval algorithms. This allows for more natural conversations and accurate results. The new DrugBot, enhanced by the LangGraph framework, exemplifies this approach. With simplified code maintenance and improved user responsiveness, the DrugBot can now engage in context\-driven conversations and answer multi\-hop queries, ultimately enhancing the overall user experience.

While chatbots excel at providing natural language responses and explanations, their text\-based format inherently limits their ability to convey complex data patterns and relationships effectively. Dashboards and data visualizations, on the other hand, can instantly communicate trends, comparisons, and multidimensional insights through charts, graphs, and interactive displays that would be cumbersome to describe in words alone ([1](https://readmedium.com/dashboarding-neo4j-data-in-looker-studio-a-powerful-combination-b917935923e7), [2](https://readmedium.com/getting-insights-from-3-000-clinical-trials-in-a-knowledge-graph-df17e55fa860)). The true power emerges when these complementary approaches are integrated: chatbots can guide users through data interpretation and answer specific questions, while visualizations provide the immediate, intuitive grasp of patterns and relationships that our brains are wired to understand. This combined approach creates a comprehensive data exploration experience that serves both analytical experts who need detailed insights and casual users who prefer guided interpretation, ensuring that the full value of the data is accessible to users of all expertise levels.


