---
title: "从 LangChain 到 LangGraph：让多模型药物机器人具有个性化和可教性"
meta_title: "从 LangChain 到 LangGraph：让多模型药物机器人具有个性化和可教性"
description: "文章介绍了如何通过LangGraph改进药物试验信息系统中的聊天机器人DrugBot，使其具备记忆和学习能力。新的DrugBot能够理解用户定义的术语，保持对话上下文，并主动请求澄清，从而提升用户体验。通过结合DuckDB数据库与LangGraph框架，DrugBot可以有效生成复杂查询，支持多种查询类型，并在多个会话中保留用户特定信息。这一改进使得普通用户能够更方便地获取药物试验相关信息，提升了系统的准确性和可靠性。"
date: 2024-11-25T15:00:22Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*WOaHORZdumJ-Po5RniDhvg.jpeg"
categories: ["Chatbots", "Machine Learning", "Data Science"]
author: "Rifx.Online"
tags: ["DrugBot", "LangGraph", "DrugDB", "memory", "learning"]
draft: False

---



### 为人机协作聊天机器人添加记忆和学习能力



药物试验测试新药物在人类中的安全性、有效性和疗效。这些关键研究对于开发和批准拯救生命的治疗至关重要。尽管药物试验为无数重病患者带来了希望，但许多人仍然不知道自己是否符合条件或潜在的好处。一个用户友好的药物试验信息系统可以填补这一空白。它应包含一个具有权威信息的数据库和一个易于使用的前端，患者可以通过它浏览复杂的临床研究世界并发现有益的机会。

在我之前的文章中，[*DuckDB作为DrugDB：一个免费且简单的多模型药物和试验数据库*](https://readmedium.com/duckdb-as-a-drugdb-a-free-and-simple-multi-model-drug-and-trial-database-83c222d1e9dd) 和 [*为多模型DuckDB定制多模型聊天机器人*](https://readmedium.com/tailor-a-multi-model-chatbot-for-a-multi-model-duckdb-8afb7ac4c1fa)，我建立了一个名为**DrugDB**的药物数据库及其相应的聊天机器人**DrugBot**。DrugDB建立在[DuckDB](https://duckdb.org/)之上，这是一个多模型数据库。用户可以结合SQL、图形、向量和全文查询，探索药物、疾病、作用机制（MOA）和[药物试验](https://readmedium.com/getting-insights-from-3-000-clinical-trials-in-a-knowledge-graph-df17e55fa860)的网络。然而，它的技术性质对普通患者来说可能是一个挑战。为了填补这一空白，我开发了一个用户友好的聊天机器人，利用LangChain和Streamlit。这个聊天机器人根据用户输入生成草稿查询。用户可以进一步细化这些查询，并让聊天机器人执行它们以找到答案。通过结合DuckDB、LangChain和Streamlit的优势，患者可以轻松访问关键信息，如药物作用机制和相关临床试验。这种人机协作的方法确保了准确性和可靠性，减轻了潜在的LLM幻觉。

然而，DrugBot还有很大的改进空间。它缺乏会话内和用户特定的跨会话记忆，限制了它理解代词或用户定义术语（如彼得·阿提亚的“[四骑士疾病](https://blog.petrieflom.law.harvard.edu/2024/03/05/outlive-by-peter-attia-a-book-review/)”）的能力。此外，尽管它能够有效使用单个工具，但在处理复杂查询时却难以将它们结合起来，例如识别与前7种肝脏相关疾病相关的5个试验。此外，DrugBot无法请求对模糊查询的澄清，有时会生成不正确的LIMIT子句。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ffJyB41Iz1jhWZR20xRTCQ.png)

为了克服这些局限性，我使用[LangGraph](https://langchain-ai.github.io/langgraph/)重写了DrugBot。LangGraph将LLM工作流管理为图形，其中信息沿着功能节点之间的边缘流动。这结合状态和记忆机制，使新的DrugBot能够理解用户定义的术语并在对话中保持上下文。受到[Vanna.ai](https://vanna.ai/)的启发，LangGraph使DrugBot能够从过去的互动中学习，存储复杂查询，甚至为未来的使用复制它们。此外，当遇到模糊情况时，聊天机器人现在可以主动寻求澄清。最后，LangGraph简化了Python代码组织，促进了可维护性。本文将详细探讨这些修订。该项目的代码托管在我的GitHub仓库中。

## 1\. DrugDB

LangGraph DrugBot 接口与我之前文章中使用的相同的 DrugDB 数据库 ([1](https://readmedium.com/clinical-trial-search-with-google-spanner-graph-sql-vector-and-llm-all-in-one-query-5ada29f840cd), [2](https://readmedium.com/postgresql-goes-multi-model-graph-vector-and-sql-5f27dbc04835), [3](https://readmedium.com/build-a-drug-trial-database-with-the-multi-model-surrealdb-6a23c2b5faa3), [4](https://readmedium.com/duckdb-as-a-drugdb-a-free-and-simple-multi-model-drug-and-trial-database-83c222d1e9dd), 和 [5](https://readmedium.com/tailor-a-multi-model-chatbot-for-a-multi-model-duckdb-8afb7ac4c1fa))。这个庞大的数据库包含超过 5000 种药物、500 种作用机制、2000 种疾病和 2000 个药物 [试验](https://readmedium.com/getting-insights-from-3-000-clinical-trials-in-a-knowledge-graph-df17e55fa860)。该数据库由 DuckDB 提供支持，并使用 DuckPGQ、fts 和 vss 扩展，支持包括 SQL、图形、向量和全文搜索在内的多种查询组合。这一能力允许进行复杂的多跳查询，例如代码 1 中的 SQL-图形混合查询，可以识别 4 个测试“UGT1A9 抑制剂”药物的试验。

```python
/* Code 1 */

SELECT Trials.PostingID AS trial_id, Trials.StudyTitle AS StudyTitle, drug_with_moa.drug_name
FROM Trials, 
    GRAPH_TABLE(drug_graph MATCH (i:Drug)-[m:HAS_MOA]->(a:MOA WHERE a.name='UGT1A9 Inhibitors')
              COLUMNS (i.drug_cui AS drug_cui, i.name AS drug_name))  drug_with_moa
WHERE list_contains(Trials.drug_cui, drug_with_moa.drug_cui)
LIMIT 4
```
虽然这样的多模型数据库功能强大，但对于普通用户来说，构造准确的查询可能具有挑战性。这就是聊天机器人可以简化这一过程的地方，使用户更容易获取所需的信息。

## 2\. 实施

### 2\.1 概述

在其前身的基础上，LangGraph DrugBot 继续为与 DrugDB 的互动提供用户友好的界面。读取用户查询、生成草拟查询、请求确认和提供可读答案的核心功能保持不变。然而，新版本引入了显著的增强功能，包括回忆过去对话的能力、理解用户定义的概念、提出澄清问题以及通过学习示例生成复杂查询的能力。

LangGraph 通过其基于图的方式组织 LLM 工作流，与 LangChain 区分开来。LangGraph 图中有三个基本元素：节点、边和状态。节点表示处理应用程序状态的功能，而边定义了这些节点之间的数据流。状态作为应用程序的记忆，在节点之间持久存在并更新。LangGraph 从一个“**start**”节点开始，以一个“**end**”节点结束。图 2 是 DrugBot 图的可视化表示。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*zXVgfsVNRbp_TZblNQtO-A.jpeg)

对话以用户输入开始。当用户提供定义语句（例如，“我们将心血管疾病、癌症、阿尔茨海默病和糖尿病定义为‘四骑士疾病’。”）时，主开关节点 `select_intent` 将状态数据路由到 `update_concept` 节点。该节点然后在用户特定的记忆中添加或更新定义，如图 2 中间部分所示。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*g7lFUd6icjapQxFUo4SbMw.png)

相反，当输入是一个问题时，`select_intent` 激活 `select_query_tool` 节点，启动主要的问答过程（如图 2 右侧和图 3 所示）。如果问题模糊，LangGraph DrugBot 将请求澄清。对于其他输入类型，例如问候或表达感谢，机器人将在过渡到 **end** 节点之前礼貌回应。

### 2\.2 节点

LangGraph 节点通常接收当前状态、配置和内存存储作为输入。这些节点然后执行特定操作，例如调用 LLM、使用工具或转换数据。结果修改后的状态随后通过边缘传递给下一个节点。代码 2 中 `select_intent` 节点的 Python 代码作为此过程的示例。

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
`select_intent` 节点从配置中读取 `user_id` 并从内存存储中获取相应的用户特定定义。这些定义随后被整合到系统提示中。为了优化令牌使用，该节点修剪状态消息。优化后的提示和状态消息随后被发送到 LLM，LLM 决定下一步行动：要么更新内存中的概念，要么选择查询工具生成草拟查询。

### 2\.3 工具

工具在 LangGraph 和 LangChain 中的操作方式相同。它们是可以被 LLM 调用以执行特定任务的函数。新的聊天机器人依赖于 SQL、图形、向量、全文以及新的模仿工具来生成草稿查询（图 3）。代码 3 是模仿工具的 Python 代码（图 3 中的第 5 个工具）。

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
顾名思义，模仿工具通过模仿用户提供的问题-查询对来生成新的查询。它首先通过识别语义相似的示例，然后用当前问题中提取的新值替换这些示例的变量槽。该工具特别适合生成涉及多个搜索工具的复杂查询。

### 2\.4 边缘

工作流可以有分支，其中一个节点伴随条件边缘，做出决策以确定后续节点。代码 2 说明了 `select_intent` 节点如何利用这一机制在 `update_concept` 节点和 `select_query_tool` 节点之间做出选择。

### 2\.5 状态与记忆

状态就像接力赛中的接力棒。它由节点丰富，并沿着边缘传递。它是一个包含消息数组和附加数据的字典（代码 4）。这些状态数据可以在内存中累积，使聊天机器人能够回忆起过去的对话内容。

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
然而，由于 Streamlit 的频繁应用重启会清空内存，LangGraph 聊天机器人必须将其状态存储在磁盘上。此外，LangGraph DrugBot 利用长期记忆在多个聊天会话中保留用户特定信息，使用户能够定义自定义概念，如 “[四骑士疾病](https://blog.petrieflom.law.harvard.edu/2024/03/05/outlive-by-peter-attia-a-book-review/)。”

### 2\.6 接口

更新后的接口通过引入查询工具下拉菜单和“保存交互”按钮（图 1）增强了以前的版本。下拉菜单使用户能够为每次交互选择首选的查询方法。“保存交互”按钮允许将当前问题及其对应的 DrugDB 查询保存到 JSONL 文件中，供模仿工具在未来生成查询时使用。确认面板现在包含一个由 [streamlit\-monaco](https://github.com/marcusschiesser/streamlit-monaco) 提供支持的查询编辑器，提供语法高亮和行号。

## 3\. 测试

之前的聊天机器人缺乏记忆，难以生成复杂的混合查询。此外，SQL和图查询工具有时会设置不正确的限制值，导致结果不准确。新的聊天机器人专门设计用来克服这些限制。因此，我的测试工作主要集中在评估其在这些领域的表现。

### 3\.1 用户定义的长期记忆概念

如图1所示，用户最初定义了概念“三小玩家”（“‘三小玩家’制药公司是Astellas、Novartis和ViiV。”）。LangGraph聊天机器人将此列表存储在其长期记忆中。当用户随后在第二轮中提到该概念时（“列出‘三小玩家’赞助的试验数量。”），聊天机器人成功解析了该提及并生成了正确的查询。

### 3\.2 短期记忆

随后的测试展示了聊天机器人利用短期记忆的能力，能够提出后续问题并解决代词问题（图4）。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*H9sqHv1ug2CIb_lM1CKuDg.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*pT-jjW2g4wCK0tATmcfwaQ.png)

当用户询问“*这种药物可以治疗什么疾病？*”时，聊天机器人最初难以理解“这种药物”的指代。为了澄清查询，它问道：“*您能具体说明您所指的药物名称吗？*”一旦用户提供了药物名称*氟氯噻嗪*，聊天机器人就能够继续并完成查询。

### 3\.3 复杂混合查询

此外，新的聊天机器人可以使用创新的模仿工具构建复杂的混合查询。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*G3gdS17jJ1xnRPaEGCI1qg.png)

如图5所示，用户提出了一个三跳查询：“*显示5个针对前7种与肝脏相关的疾病进行测试的药物的试验。*”聊天机器人分析了该查询，从预定义的集合中识别出最相关的示例，并基于这些示例合成了一个正确的查询。此交互可以保存以供将来参考，从而促进持续学习循环。

### 3\.4 LIMIT 子句

最后，新的 SQL 和图形查询工具采用两阶段过程来创建草稿查询。首先，它们分析用户的问题以生成核心查询结构，包括 SELECT、FROM 和 WHERE 子句。然后，它们检查用户是否指定了任何结果限制——如果是，它们会在查询末尾添加适当的 LIMIT 子句以限制输出大小。这种模块化的方法确保生成的查询在语法上是正确的、准确的并且适当约束。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*6fJfQBicrylrM7vZjUmifg.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*mXtGHAqmhYSheLqUgzTngw.png)

图 6 中的两个对话展示了聊天机器人准确实现用户指定限制的能力。此外，当用户未提供明确限制时，聊天机器人设置了默认限制为 30，以防止界面冻结。

## 结论

如今，越来越多的无代码平台用于构建 AI 工作流，例如 [n8n](https://n8n.io/)、[zapier](https://zapier.com/) 和 [Voiceflow](https://www.voiceflow.com/)。用户可以通过拖放界面和可视化编程快速构建 LLM 应用程序，而无需编写任何代码。但在深度数据探索和自定义数据库交互方面，它们往往显得不足。当用户需要执行专业查询或基于其独特数据模式创建上下文感知的响应时，通过编码开发自定义聊天机器人变得至关重要。一个量身定制的聊天机器人，旨在理解特定数据库结构的细微差别，可以利用先进的索引方法和复杂的检索算法。这使得更自然的对话和更准确的结果成为可能。新的 DrugBot，借助 LangGraph 框架的增强，体现了这种方法。通过简化代码维护和改善用户响应，DrugBot 现在能够进行上下文驱动的对话并回答多跳查询，从而提升整体用户体验。

虽然聊天机器人在提供自然语言响应和解释方面表现出色，但其基于文本的格式在有效传达复杂数据模式和关系方面固有地有限。仪表板和数据可视化则可以通过图表、图形和交互式展示瞬时传达趋势、比较和多维见解，这些用语言描述起来会显得繁琐 ([1](https://readmedium.com/dashboarding-neo4j-data-in-looker-studio-a-powerful-combination-b917935923e7), [2](https://readmedium.com/getting-insights-from-3-000-clinical-trials-in-a-knowledge-graph-df17e55fa860))。当这些互补的方法结合在一起时，真正的力量便会显现：聊天机器人可以引导用户进行数据解读并回答具体问题，而可视化则提供了我们大脑天生能够理解的模式和关系的即时、直观把握。这种结合的方法创造了一种全面的数据探索体验，既服务于需要详细见解的分析专家，也满足了偏好引导解读的普通用户，确保所有专业水平的用户都能访问数据的全部价值。

