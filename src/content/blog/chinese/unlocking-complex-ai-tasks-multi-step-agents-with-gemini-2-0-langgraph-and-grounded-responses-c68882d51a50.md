---
title: "解开复杂的人工智能任务：使用 Gemini 2.0、LangGraph 和 Grounded Responses 的多步骤代理"
meta_title: "解开复杂的人工智能任务：使用 Gemini 2.0、LangGraph 和 Grounded Responses 的多步骤代理"
description: "本文探讨了基于Gemini 2.0和LangGraph框架的多步骤AI代理，旨在解决复杂任务的执行问题。通过结合实时数据源，AI代理能够理解并执行复杂的请求，超越传统的语言模型局限。文章以股票投资组合管理为例，展示了如何通过计划-执行流程，逐步收集信息并提供基于分析的建议，最终实现主动解决问题的能力。这种方法为AI在金融等领域的应用开辟了新的可能性。"
date: 2024-12-19T21:28:22Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*c9C0IokiGPceUO4Oncijhg.jpeg"
categories: ["Programming", "Machine Learning", "Autonomous Systems"]
author: "Rifx.Online"
tags: ["Gemini", "LangGraph", "Agentic", "workflows", "portfolios"]
draft: False

---





如何构建不仅理解复杂请求而且能够执行必要步骤以满足这些请求的 AI？

本文探讨了一种强大的解决方案：由 Gemini 2.0 和 LangGraph 框架驱动的多步骤 AI 代理。这些代理协调复杂的工作流程，并通过基于实际数据的响应增强其推理能力，从 Google 搜索、BigQuery 和第三方 API 获取真实世界的数据。

## 今日的挑战

第一个重大突破是 LLM。想象一下一个充满大量信息的“大脑”，能够理解和生成自然语言。但是，这个“脑”有一个根本的局限性：它的知识仅限于其训练数据——这是特定时间点的信息快照。

然后出现了 RAG。这将“大脑”连接到配置的数据源，使 LLM 能够访问专有或外部知识，实际上使它们能够接触到互联网和特定知识库的广泛且不断更新的资源。这使得 LLM 能够提供更相关、更准确和更及时的答案，显著增强了它们的实用性。

然而，即使有了 RAG，人工智能在处理复杂的多步骤任务时仍然存在困难，这些任务需要与现实世界的互动。想象一下请求帮助策划一个惊喜派对：一个增强了 RAG 的 LLM 可以建议主题和场地，但无法预订场地或发送邀请函。

在金融等领域，这种局限性更为关键。一个人类金融分析师在建议投资组合再平衡时会系统地：1）评估当前持有的资产和市场价值，2）根据市场趋势分析增长潜力，3）推荐买入/卖出决策。这种多步骤推理超出了标准的 RAG 增强 LLM 的能力。

## 代理型人工智能：从知识到行动

今天，我们将探讨如何通过代理型人工智能克服这些限制。代理型人工智能将大型语言模型（LLM）从一个被动的“脑”转变为一个主动的、智能的代理，可以制定计划，利用工具与外部系统（API、数据库）进行交互，收集数据，执行计算，并执行任务以实现特定目标。

代理不仅仅是提供信息，而是*行动*以实现期望的结果。

## 复制人类推理：股票投资组合案例

本次探索专注于使用Agentic AI进行一个实际案例：管理个人股票投资组合。目标是创建一个能够处理复杂查询的代理，例如：“考虑到当前市场和价格，我应该卖掉我的特斯拉股票吗？”

人类交易者通常会：

1. 检查他们的特斯拉持股和平均购买价格。
2. 检查特斯拉股票的当前市场价格。
3. 研究特斯拉的市场前景和相关行业趋势。
4. 根据这一分析，决定是持有、再买入还是卖出。

我们将探讨是否可以使用Agentic AI复制这种多步骤推理和行动。

## 演示

请查看 Agentic AI 在下面的演示中处理复杂金融查询。为了快速了解编排，我们建议以 2 倍速观看。

## 解决方案详情

在这个解决方案中，我使用了一种“计划-执行”风格的代理，灵感来自于[LangChain的计划-执行教程](https://langchain-ai.github.io/langgraph/tutorials/plan-and-execute/plan-and-execute/)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*LxJ9XXLJHoWekMd7QfiBsQ.png)

该代理的关键组成部分包括：

* **Gemini 2.0 (LLM)：** 负责理解用户请求、制定查询和综合信息的“大脑”。
* **LangGraph (编排)：** 管理工作流程的框架，将复杂任务分解为顺序步骤，并在组件之间路由数据。
* **基础数据源：** 来自Google搜索（用于市场趋势和新闻）、BigQuery（用于用户投资组合详情）和FinnHub API（用于当前股价）的实时信息。

工作流程如下进行：

**(1) 制定计划并生成任务：**

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*PcHCnGPgf5eunFBb1CVq4A.png)

当用户提出问题时，LangGraph将工作流程路由到计划代理。该代理由Gemini 2.0提供支持，使用精心设计的提示生成一个结构化为`Plan`对象的逐步计划：

```python
class Plan(BaseModel):
    steps: List[str] = Field(description="Steps to follow, in order.")
```
这个`Plan`对象随后在`PlanExecute` TypedDict中使用，以管理工作流程状态：

```python
class PlanExecute(TypedDict):
    input: str
    plan: List[str]
    past_steps: Annotated[List[Tuple[str, str]], operator.add]
    response: Optional[str]
    intermediate_responses: List[str]
```
计划者的提示引导Gemini创建一个清晰、简明的计划，为每一步选择合适的工具。

```python
PLANNER_PROMPT = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """You are an expert in deciphering questions and creating step-by-step plans.
Based on the given objective, create a simple plan. Each step should be a distinct task that, when executed, will lead to the correct answer. Avoid superfluous steps.
Use these guidelines to choose the right tool:
- Portfolio retrieval (e.g., "What's my portfolio?", "What are my holdings?", "Last trade on Nvidia?"): Use the {{portfolio_retriever}} tool.
- Check the current price of a stock using the stock symbol(e.g. current price of GOOG): Use the {{price_checker}} tool. If there are multiple stocks to check, break down into multiple steps to do multiple function calls to check current price for individual stock.
- Equity/market analysis (e.g., "Will Nvidia rise?", "Current stock price?", "Is Intel a buy?", "What are the risks?"): Use the {{stock_analyser}} tool.
- General/non-financial questions (e.g., "Hi", "Who are you?"): Use the {{normal_responder}} tool.
The final step's result should be the final answer. Ensure each step has enough information; do not skip steps.
""",
        ),
        ("placeholder", "{messages}"),
    ]
)
```
**(2) 执行任务和重新规划：**

一旦计划者生成了逐步计划，LangGraph将其传递给代理执行器进行执行。在此阶段，代理根据计划中的每一步利用适当的工具。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*U0uphwVdyQBGQ5kfC8ME6Q.png)

例如，步骤1需要检索投资组合信息，代理使用`portfolio_retriever`工具。该工具将自然语言指令转换为SQL查询，并在BigQuery数据集上执行该查询（用户持有的股票存储在该数据集中）。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*8ce22S_RTYd42kL4noAFAA.png)

每个步骤执行后，工作流程将路由到重新规划器。重新规划器的角色至关重要：它综合到目前为止收集的信息，并确定下一步行动。

`replan_step`函数协调此过程：

```python
async def replan_step(state: PlanExecute):
    all_responses = "\n".join(state["intermediate_responses"])
    all_steps = "\n".join([f"{step}: {response}" for step, response in state["past_steps"]])
    context = f"Here is the information gathered from the previous steps:\n{all_steps}\n\nHere are the direct responses from the tools:\n{all_responses}"

    output = await replanner.ainvoke({**state, "input": context})
    if output.response:
        cleaned_response = clean_newlines(output.response.response)
        with cl.Step(name="Final Response"):
            await cl.Message(content="**Final Response:**").send()
            await cl.Message(content=cleaned_response).send()
        return {"response": cleaned_response}
    else:
        return {"plan": output.plan.steps}
```
重新规划器接收一个`context`，包含：

* 已完成步骤及其对应响应的摘要。
* 从工具直接收到的原始输出。

利用这个上下文，重新规划器（由Gemini 2.0和特定提示提供支持）决定是否有足够的信息来提供最终答案。

* **最终响应：** 如果重新规划器生成了最终响应（`output.response`存在），则该响应发送给用户，工作流程结束。
* **继续执行：** 如果未生成最终响应，重新规划器将现有计划传回代理执行器，后者将执行下一步。

这一执行和重新规划的循环持续进行，直到重新规划器确定用户的查询已完全解决。

此逻辑在LangGraph中使用这些边缘实现：

```python
def should_end(state: PlanExecute):
    return END if "response" in state and state["response"] is not None else "agent"

## --- 工作流程定义 ---
workflow = StateGraph(PlanExecute)
workflow.add_node("planner", plan_step)
workflow.add_node("agent", execute_step)
workflow.add_node("replan", replan_step)
workflow.add_edge(START, "planner")
workflow.add_edge("planner", "agent")
workflow.add_edge("agent", "replan")
workflow.add_conditional_edges("replan", should_end, {"agent": "agent", END: END})
app = workflow.compile()
```
`workflow.add_edge("agent", "replan")`行创建了从代理执行器到重新规划器的直接路径。

`workflow.add_conditional_edges`行定义了重新规划步骤后发生的逻辑。

* 如果`should_end`为真，工作流程转到`END`状态。
* 如果`should_end`为假，工作流程返回到`agent`状态（代理执行器）。

**(3) 继续执行**

在检索投资组合信息后，工作流程返回到代理执行器，以执行计划中的下一步：检查特斯拉股票的当前市场价格。代理执行器使用`price_checker`工具，查询[FinnHub API](https://finnhub.io/docs/api/quote)以获取实时股价。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Il9FYWnSICi7jPU9CfOMEg.png)

然后，工作流程返回到重新规划器。由于需要更多信息来回答初始查询，重新规划器将工作流程指向代理执行器。

这次，代理执行器执行涉及分析特斯拉市场表现并确定是否建议持有或出售的步骤。为此，代理使用`stock_analyser`工具，该工具利用Google搜索基础提供最新和相关的信息。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*O1w_2DQ2dQCAzxb89N869A.png)

`stock_analyser`工具使用以下函数通过Google搜索结果进行分析。这一函数向Google搜索基础服务发送提示，指示其查找与正在分析的股票相关的新闻和信息。这确保分析基于最新的信息。

```python
def google_ground(prompt: str) -> str:
    request = discoveryengine.GenerateGroundedContentRequest(
        location=google_search_client.common_location_path(
                project=PROJECT_NUMBER, location="global"
        ),
        generation_spec=spec,
        contents=[
            discoveryengine.GroundedGenerationContent(
                    role="user",
                    parts=[discoveryengine.GroundedGenerationContent.Part(text=prompt)],
            )
        ],
        system_instruction=discoveryengine.GroundedGenerationContent(
            parts=[
                discoveryengine.GroundedGenerationContent.Part(text="If given a stock or option to analyse, try to find relevant news from google search to see if it's a good time to buy more or sell. Use these news to formulate your analysis and return a comprehensive response targted to the provided stock or option. Rmb that you are a seasoned investment analyst so always remove any disclaimers about this not being financial advice.")
            ],
        ),
        grounding_spec=discoveryengine.GenerateGroundedContentRequest.GroundingSpec(
            grounding_sources=[
                discoveryengine.GenerateGroundedContentRequest.GroundingSource(
                        google_search_source=discoveryengine.GenerateGroundedContentRequest.GroundingSource.GoogleSearchSource()
                )
            ]
        ),
    )
    google_responses = google_search_client.generate_grounded_content(request)
    
    return_prompt=f"""Generate a natural language response based on the original question: '{prompt}' and the returned results: '{google_responses}'"""
    response=model.generate_content(return_prompt)
    return response.text
```
在市场分析后，工作流程返回到重新规划器。重新规划器认识到仍需进行盈亏计算，再次将工作流程指向代理执行器。这次，代理执行器执行必要的计算，以确定如果用户以当前市场价格出售其特斯拉股票，可能的利润或亏损。

此计算使用之前检索到的投资组合信息（股票数量和平均购买价格）以及从 FinnHub API 获取的当前价格。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*2G_d-K_onTL7jBePVinWQA.png)

**(4\) 重新规划者生成最终响应**

最后，工作流再次返回到重新规划者。在此阶段，重新规划者可以访问所有必要的信息：

* 投资组合持有（来自 BigQuery）
* 当前市场价格（来自 FinnHub）
* 市场分析（来自 Google 搜索基础）
* 潜在利润/损失计算

然后，重新规划者综合这些信息，生成一个全面的建议，直接回答用户的原始查询：“考虑到当前市场和价格，我应该出售我的特斯拉股票吗？”

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*iUFHFTnlTUlr4FMq1Tzkqw.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*UuXf9nQW_rRtQ2zSRtcyqQ.png)

重要的是，重新规划者还提供了详细的理由，解释了建议是如何得出的。这种透明的方法使用户能够理解 AI 建议背后的推理，从而增强对系统的信任和信心。

对于那些对技术实现感兴趣的人，这个项目的代码可在 GitHub 上找到：[链接](https://github.com/jiasin88/multi-step-ai-agent)

## 结论

总之，这项探索展示了代理人工智能的变革潜力。

通过将像 Gemini 2.0 这样的 LLM 的强大功能与像 LangGraph 这样的稳健编排框架结合，并利用来自 Google Search、BigQuery 和外部 API 的现实数据进行基础， 我们可以创建超越简单信息检索的人工智能系统，进入主动解决问题的领域。

这种方法使人工智能能够处理复杂的多步骤任务，不仅提供答案，还提供具有明确理由的可操作建议，为各个领域开辟了令人兴奋的可能性。

