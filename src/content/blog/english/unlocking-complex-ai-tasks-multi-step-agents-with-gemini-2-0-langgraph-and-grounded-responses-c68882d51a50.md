---
title: "Unlocking Complex AI Tasks: Multi-Step Agents with Gemini 2.0, LangGraph, and Grounded Responses"
meta_title: "Unlocking Complex AI Tasks: Multi-Step Agents with Gemini 2.0, LangGraph, and Grounded Responses"
description: "The article discusses the development of multi-step AI agents using Gemini 2.0 and LangGraph, aimed at overcoming limitations of traditional LLMs. These agents can execute complex workflows by utilizing real-world data sources for grounded responses. A practical use case in managing stock portfolios illustrates how Agentic AI can replicate human reasoning through a structured plan-and-execute workflow. This approach enhances AIs ability to provide actionable recommendations, making it suitable for various domains that require intricate decision-making processes."
date: 2024-12-19T21:28:22Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*c9C0IokiGPceUO4Oncijhg.jpeg"
categories: ["Programming", "Machine Learning", "Autonomous Systems"]
author: "Rifx.Online"
tags: ["Gemini", "LangGraph", "Agentic", "workflows", "portfolios"]
draft: False

---






How do you build AI that not only understands complex requests but also executes the necessary steps to fulfill them?

This article explores a powerful solution: multi\-step AI agents powered by Gemini 2\.0 and the LangGraph framework. These agents orchestrate complex workflows and enhance their reasoning with grounded responses, drawing on real\-world data from Google Search, BigQuery, and third\-party APIs.


## Today’s Challenges

The first major breakthrough was the LLM. Imagine a brain packed with vast amounts of information, capable of understanding and generating human language. But, this “brain” had a fundamental limitation: its knowledge was confined to its training data — a snapshot of information from a specific point in time.

Then came RAG. This connected the “brain” to configured data sources, granting LLMs access to proprietary or external knowledge, effectively granting them access to the vast and ever\-updating resources of the internet and specific knowledge bases. This allowed LLMs to provide more relevant, accurate, and up\-to\-date answers, significantly enhancing their utility.

However, even with RAG, AI struggled with complex, multi\-step tasks requiring real\-world interaction. Imagine asking for help planning a surprise party: a RAG\-enhanced LLM could suggest themes and venues, but couldn’t book the venue or send invitations.

This limitation is even more critical in domains like finance. A human financial analyst advising on portfolio rebalancing would methodically: 1\) assess current holdings and market values, 2\) analyze growth potential based on market trends, and 3\) recommend buy/sell decisions. This multi\-step reasoning is beyond standard LLMs with RAG.


## Agentic AI: From Knowledge to Action

Today, we will explore how we can overcome some of these limitations with Agentic AI. Agentic AI transforms the LLM from a passive “brain” into an active, intelligent agent which can formulate plans, utilize tools to interact with external systems (APIs, databases), gather data, perform calculations, and execute tasks to achieve specific goals.

Instead of simply providing information, agents *act* to achieve a desired outcome.


## Replicating Human Reasoning: A Stock Portfolio Use Case

This exploration focuses on using Agentic AI for a practical use case: managing a personal stock portfolio. The goal is to create an agent capable of handling complex queries like, “Given the current market and price, should I sell my Tesla stock?”

A human trader would typically:

1. Check their Tesla holdings and average purchase price.
2. Check the current market price of Tesla stock.
3. Research the market outlook for Tesla and relevant industry trends.
4. Based on this analysis, decide whether to hold, buy more, or sell.

We will explore if we can replicate the same kind of multi\-step reasoning and action using Agentic AI.


## Demo

See Agentic AI tackle complex financial queries in the demo below. For a fast\-paced overview of the orchestration, we recommend watching at 2x speed.








## Solution Details

In this solution, I am using a “plan\-and\-execute” style agent, which is inspired by [LangChain’s plan\-and\-execute tutorial](https://langchain-ai.github.io/langgraph/tutorials/plan-and-execute/plan-and-execute/)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*LxJ9XXLJHoWekMd7QfiBsQ.png)

The key components of this agent are:

* **Gemini 2\.0 (LLM):** The “brain” responsible for understanding user requests, formulating queries, and synthesizing information.
* **LangGraph (Orchestration):** The framework that manages the workflow, breaking down complex tasks into sequential steps and routing data between components.
* **Grounded Data Sources:** Real\-time information from Google Search (for market trends and news), BigQuery (for user portfolio details), and the FinnHub API (for current stock prices).

The workflow proceeds as follows:

**(1\) Formulating a Plan and Generating Tasks:**

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*PcHCnGPgf5eunFBb1CVq4A.png)

When a user asks a question, LangGraph routes the workflow to the planner agent. This agent, powered by Gemini 2\.0, uses a carefully crafted prompt to generate a step\-by\-step plan structured as a `Plan` object:


```python
class Plan(BaseModel):
    steps: List[str] = Field(description="Steps to follow, in order.")
```
This `Plan` object is then used within the `PlanExecute` TypedDict to manage workflow state:


```python
class PlanExecute(TypedDict):
    input: str
    plan: List[str]
    past_steps: Annotated[List[Tuple[str, str]], operator.add]
    response: Optional[str]
    intermediate_responses: List[str]
```
The planner’s prompt guides Gemini to create a clear, concise plan, selecting the appropriate tools for each step


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
**(2\) Executing Tasks and Replanning:**

Once the planner generates a step\-by\-step plan, LangGraph passes it to the Agent Executor for execution. During this phase, the agent utilizes the appropriate tools based on each step in the plan.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*U0uphwVdyQBGQ5kfC8ME6Q.png)

For example, Step 1 requires retrieving portfolio information, the agent uses the `portfolio_retriever` tool. This tool translates the natural language instruction into a SQL query and executes it against a BigQuery dataset (where user holdings are stored).

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*8ce22S_RTYd42kL4noAFAA.png)

After each step is executed, the workflow is routed to the replanner. The replanner’s role is crucial: it synthesizes the information gathered so far and determines the next course of action.

The `replan_step` function orchestrates this process:


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
The replanner receives a `context` containing:

* A summary of the completed steps and their corresponding responses.
* The raw output directly received from the tools.

Using this context, the replanner (powered by Gemini 2\.0 and a specific prompt) decides whether enough information is available to provide a final answer.

* **Final Response:** If the replanner generates a final response (`output.response` is present), this response is sent to the user, and the workflow ends.
* **Continue Execution:** If a final response isn’t generated, the replanner passes the existing plan back to the Agent Executor, which then executes the next step.

This cycle of execution and replanning continues until the replanner determines that the user’s query has been fully addressed.

This logic is implemented in LangGraph using these edges:


```python
def should_end(state: PlanExecute):
    return END if "response" in state and state["response"] is not None else "agent"

## --- Workflow Definition ---
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
The `workflow.add_edge("agent", "replan")` line creates a direct path from the Agent Executor to the replanner.

The `workflow.add_conditional_edges` line defines the logic for what happens after the replan step.

* If `should_end` is true, the workflow goes to the `END` state.
* If `should_end` is false, the workflow goes back to the `agent` state (the Agent Executor).

**(3\) Continued Execution**

After retrieving the portfolio information, the workflow returns to the Agent Executor to execute the next step in the plan: checking the current market price of the Tesla stock. The Agent Executor uses the `price_checker` tool, which queries the [FinnHub API](https://finnhub.io/docs/api/quote) for real\-time stock prices.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Il9FYWnSICi7jPU9CfOMEg.png)

The workflow then returns to the replanner. Since more information is needed to answer the initial query, the replanner directs the workflow back to the Agent Executor.

This time, the Agent Executor executes the step that involves analyzing Tesla’s market performance and determining whether it’s advisable to hold or sell. For this, the agent uses the `stock_analyser` tool, which leverages Google Search grounding to provide up\-to\-date and relevant information.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*O1w_2DQ2dQCAzxb89N869A.png)

The `stock_analyser` tool uses the following function to ground its analysis with Google Search results. This function sends a prompt to the Google Search grounding service, instructing it to find relevant news and information related to the stock being analyzed. This ensures that the analysis is based on the most up\-to\-date information available.


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
After the market analysis, the workflow returns to the replanner. Recognizing that a profit/loss calculation is still required, the replanner again directs the workflow back to the Agent Executor. This time, the Agent Executor performs the necessary calculations to determine the potential profit or loss if the user were to sell their Tesla stock at the current market price.

This calculation uses the portfolio information retrieved earlier (number of shares and average purchase price) and the current price obtained from the FinnHub API.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*2G_d-K_onTL7jBePVinWQA.png)

**(4\) Replanner generating final response**

Finally, the workflow returns to the replanner for the last time. At this stage, the replanner has access to all the necessary information:

* Portfolio holdings (from BigQuery)
* Current market price (from FinnHub)
* Market analysis (from Google Search grounding)
* Potential profit/loss calculation

The replanner then synthesizes this information to generate a comprehensive recommendation that directly answers the user’s original query: “Given the current market and price, should I sell off my Tesla stocks?”

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*iUFHFTnlTUlr4FMq1Tzkqw.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*UuXf9nQW_rRtQ2zSRtcyqQ.png)

Crucially, the replanner also provides a detailed rationale explaining how the recommendation was derived. This transparent approach allows the user to understand the reasoning behind the AI’s recommendation, building trust and confidence in the system.

For those interested in the technical implementation, the code for this project is available on GitHub: [Link](https://github.com/jiasin88/multi-step-ai-agent)


## Conclusion

In conclusion, this exploration demonstrates the transformative potential of Agentic AI.

By combining the power of LLMs like Gemini 2\.0 with robust orchestration frameworks like LangGraph and grounding with real\-world data from sources like Google Search, BigQuery, and external APIs, we can create AI systems that move beyond simple information retrieval and into the realm of active problem\-solving.

This approach enables AI to tackle complex, multi\-step tasks, providing not just answers, but actionable recommendations with clear rationales, opening exciting possibilities across various domains.


