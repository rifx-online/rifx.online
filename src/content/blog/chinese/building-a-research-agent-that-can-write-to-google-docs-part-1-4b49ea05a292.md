---
title: "建立一个能写入 Google 文档的研究代理（第 1 部分）"
meta_title: "建立一个能写入 Google 文档的研究代理（第 1 部分）"
description: "本文介绍了如何使用LangGraph和Tavily构建一个简单的研究助手，该助手能够规划、撰写和完善短文，并具备与Google Docs集成的功能。该助手的设计灵感来源于研究过程中的计划、研究、写作、审阅和修订循环。通过使用大型语言模型（LLMs），助手能够自动化多个步骤，包括生成研究计划、进行在线搜索、撰写报告、审查和编辑。文章详细描述了代理的结构、节点的定义及其功能，强调了迭代过程在提升文章质量方面的重要性，并介绍了Tavily搜索工具的应用。"
date: 2024-12-19T21:35:48Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*K3ft-8NkUixw6K7isGBWVw.png"
categories: ["Programming", "Natural Language Processing", "Generative AI"]
author: "Rifx.Online"
tags: ["LangGraph", "Tavily", "LLMs", "planner", "researcher"]
draft: False

---





### 可能帮助您完成作业的工具

***本文是两部分系列的第一部分，我们将使用 LangGraph 和 Tavily 构建一个简单的研究助手，该助手编写和完善短文。为了跟踪它生成的计划、文章和评论，我们添加了程序化创建和编辑 Google Docs 的功能。在本文中，我们将重点关注助手，将文档连接的内容留到第二篇文章。您可以在 [这里](https://github.com/rmartinshort/research_assist) 找到所有相关代码。***

大型语言模型（LLMs）正迅速在与分析师和研究人员相关的各种应用中找到用途，特别是在提取、组织和总结文本信息方面。社区——无论是商业还是开源——也越来越容易构建和扩展所谓的“代理”应用程序，在这些应用中，LLM 扮演（希望是）熟练分析师的角色，并做出半自主决策。例如，在聊天机器人应用中，如果用户提出复杂或多步骤的查询，LLM 可能需要设计行动计划，正确查询多个外部工具——可能是计算器、网络搜索引擎、向量数据库等——汇总结果并生成答案。

这样的系统通常被称为使用 [ReAct 框架](https://www.promptingguide.ai/techniques/react) 的提示工程，ReAct 代表“推理-行动”。基本上，提示的结构和顺序迫使 LLM 以非常有条理的方式回答问题，首先阐明一个想法（通常是攻击计划），然后执行一个动作，最后观察结果。在代理系统中，这一过程可以迭代进行，直到 LLM 决定它得出了一个可接受的答案。

在这一系列文章中，我们将使用 [LangGraph](https://www.langchain.com/langgraph) 库和 [Tavily](https://tavily.com/) 搜索工具构建一个简单的研究助手，展示一些这些概念，并可能对我们这些希望快速生成关于任何主题的简明、优质报告的人有用。我们的助手将受到同行评审研究中发生的计划 -> 研究 -> 写作 -> 提交 -> 审阅 -> 修订循环的启发，您可以在 [这里](https://github.com/rmartinshort/research_assist/blob/main/research_assist/researcher/prompts.py) 查看这些不同部分的提示。

为了使系统感觉更加完整，我们还将添加将生成的材料自动添加到 Google Doc 的功能，这在 [第二部分](https://towardsdatascience.com/building-a-research-assistant-that-can-write-to-google-docs-part-2-ac9dcacff4ff) 中进行了探讨。这应被视为一个附加功能，而不是代理的集成组件，但它本身也很有趣，因此也可以作为独立文章阅读。

## 1\. 我们的研究助手应该做什么？

在考虑如何构建这个助手以及它“自主”的含义之前，我们应该简要思考一下我们希望它做些什么。目标是构建一个能够规划和撰写关于特定主题的简短信息性文章的系统，然后通过审查和修订来改善自己的工作。

为什么？主要这只是对技术的探索，但将LLM作为半自主研究者的使用是一个活跃的研究领域，并且产生了有趣的项目，例如 [GPT-researcher](https://github.com/assafelovic/gpt-researcher)。它们有潜力加速分析师、学生、作者和研究者的工作——当然，如果目标是人类学习，仔细阅读、做笔记和讨论是没有任何替代品的，而这些是AI无法替代的。

像GPT4、Anthropic Claude Sonnet、Meta Llama 3、Google Gemini Pro等LLM已经能够通过一个简单的提示生成出色的文章。然而，这些LLM有知识截止日期，因此需要访问额外的工具来获取最新信息，例如当前事件的新闻。有很多服务——尤其是像Perplexity、ChatGPT（现在可以通过chat.com访问）和Google的AI概述这样的工具，它们已经具备这种能力，但它们更倾向于提供快速摘要，而不是精炼的研究报告。

在这里，我们假设多个审查和修订的迭代将改善LLM生成的文章的质量。这确实是人类写作的方式。我们的助手将具有以下组件，每个组件都有自己的指令提示：

* **规划者。** 将一个定义不清的任务转化为结构化的文章计划
* **研究者。** 根据计划在互联网上搜索相关内容。
* **撰写者。** 使用计划、检索到的内容和自身知识撰写报告
* **审阅者。** 阅读报告并提供建设性的批评
* **编辑。** 阅读报告和审阅者的批评，并决定报告是否需要修订。如果需要，报告将被送回研究者和撰写者阶段。

在我们的实现中，这些组件将调用相同的LLM，即GPT4o-mini，但在实际应用中，它们也可以轻松使用不同的、更专业的模型。

输出将是一个写得很好、信息丰富的报告——最好带有参考文献——我们可以以编程方式将其放入Google文档中以便保存。通过调整提示，我们可以轻松修改我们研究者的“个性”。编辑尤其重要，因为它是流程结束的把关者。如果我们让编辑非常严格，系统可能需要经历多次修订才能被接受。更严格的编辑在多大程度上会提高结果的质量？这是一个非常有趣的问题，正如他们所说，这超出了当前工作的范围！

## 2\. 代理的结构

我们的研究助手在很大程度上基于这个[关于LangGraph的优秀短课程](https://www.deeplearning.ai/short-courses/ai-agents-in-langgraph/)中的示例。LangGraph是一个LLM编排库，旨在简化我们设计和构建可靠代理的过程。关于LangGraph和LangChain的深入比较，我推荐这篇优秀的[文章](https://towardsdatascience.com/ai-agent-workflows-a-complete-guide-on-whether-to-build-with-langgraph-or-langchain-117025509fa0)。

什么是代理？社区似乎尚未达成一致的定义，但至少广义上我们可以说，代理是一个[多步骤系统，允许LLM对结果做出有意义的决策](https://blog.langchain.dev/what-is-an-agent/)。这使得它比链更复杂（并且可能更不可预测），因为链只是一个预定义的LLM调用集合，依次进行。

在代理框架中，LLM在解决给定问题时具有一定的自主权，可能通过选择适当的工具进行调用，或决定在解决方案足够好时何时停止改进。从这个意义上讲，LLM更像是系统的大脑，更像人类分析师，而不仅仅是一个API调用。这里一个有趣的挑战是，虽然代理可能自由做出决策，但它们通常嵌入在或与传统软件系统交互，这些系统需要结构化的输入和输出。因此，强制代理以这些其他系统理解的方式返回答案非常重要，无论它做出什么决策。

关于LangGraph中代理的更深入讨论，这份[文档](https://langchain-ai.github.io/langgraph/concepts/#graphs)非常有帮助。我们的研究代理将相对简单（部分原因是我也在学习这些材料！），但希望能成为更复杂系统的垫脚石。

在LangGraph中，我们将系统的逻辑定义为一个图，由节点和边组成。节点是进行LLM调用的地方，边则将信息从一个节点传递到下一个节点。边可以是条件的，这意味着它们可以根据做出的决策将信息引导到不同的节点。信息在节点之间以由状态定义的结构化格式传递。

我们的研究助手有一个名为`AgentState`的单一阶段，它看起来是这样的


```python
class AgentState(TypedDict):
    """
    A dictionary representing the state of the research agent.

    Attributes:
        task (str): The description of the task to be performed.
        plan (str): The research plan generated for the task.
        draft (str): The current draft of the research report.
        critique (str): The critique received for the draft.
        content (List[str]): A list of content gathered during research.
        revision_number (int): The current revision number of the draft.
        max_revisions (int): The maximum number of revisions allowed.
        finalized_state (bool): Indicates whether the report is finalized.
    """

    task: str
    plan: str
    draft: str
    critique: str
    content: List[str]
    editor_comment: str
    revision_number: int
    max_revisions: int
    finalized_state: bool
```
这是存储与我们问题相关的所有信息的地方，并且可以通过图中节点内的LLM操作进行更新。

现在我们可以定义一些节点。在代码中，所有节点都保存在`AgentNodes`类中，这只是我发现有助于将它们分组的一种方式。例如，计划节点看起来是这样的


```python
    def plan_node(self, state: AgentState) -> Dict[str, str]:
        """
        Generate a research plan based on the current state.

        Args:
            state (AgentState): The current state of the research agent.

        Returns:
            Dict[str, str]: A dictionary containing the generated research plan.
        """
        messages = [
            SystemMessage(content=ResearchPlanPrompt.system_template),
            HumanMessage(content=state["task"]),
        ]
        response = self.model.invoke(messages)
        return {"plan": response.content}
```
请注意，它接受一个`AgentState`并返回对其一个组件的修改，即研究计划的文本。当这个节点运行时，计划会被更新。

节点函数中的代码使用标准的LangChain语法。`self.model`是`ChatOpenAI`的一个实例，代码如下


```python
model = ChatOpenAI(
    model="gpt-4o-mini", temperature=0, api_key=secrets["OPENAI_API_KEY"]
)
```
提示由来自`ResearchPlanPrompt`数据类的系统消息与AgentState的“任务”元素连接而成，后者是用户提供的研究主题。计划提示如下所示。


```python
@dataclass
class ResearchPlanPrompt:
    system_template: str = """
    You are an expert writer tasked with creating a high-level outline for a research report.
    Write such an outline for the user-provided topic. Include relevant notes or instructions for each section.
    The style of the research report should be geared towards the educated public. It should be detailed enough to provide
    a good level of understanding of the topic, but not unnecessarily dense. Think of it more like a whitepaper to be consumed 
    by a business leader rather than an academic journal article. 
    """
```
需要为以下任务创建类似的节点

* **进行研究**。这是我们使用LLM将研究任务转换为一系列查询的地方，然后使用Tavily搜索工具在线查找答案，并将其保存在AgentStage的“内容”下。此过程在第2节中有更详细的讨论。
* **撰写报告**。在这里，我们利用任务名称、研究计划、研究内容和任何先前审稿人的评论来实际撰写研究报告。这将保存在AgentState的“草稿”下。每当运行此操作时，`revision_number`指示器将被更新。
* **审查报告。** 调用LLM对研究报告进行批评，并将审查结果保存在“批评”下。
* **根据批评进行更多研究**。这将接受原始草稿和审查，并生成一些更多的Tavily查询，以帮助系统解决审稿人的评论。再次，这些信息保存在“内容”下。
* **做出决定**，判断报告是否满足审稿人的评论。这是由LLM在编辑提示的指导下完成的，指示其对文章做出是/否的决定并解释其理由。
* **虚拟节点**，用于拒绝或接受研究。一旦我们到达其中之一，我们可以结束流程。最终的研究报告可以从AgentState中提取。

我们需要在编辑节点的图中创建一个条件边：如果编辑说是，我们就进入接受节点。如果不是，我们返回审查节点。

要定义这个逻辑，我们需要创建一个在条件边内运行的函数。我选择将其放在AgentEdges类中，但这不是必须的。


```python
 def should_continue(state: AgentState) -> str:
        """
        Determine whether the research process should continue based on the current state.

        Args:
            state (AgentState): The current state of the research agent.

        Returns:
            str: The next state to transition to ("to_review", "accepted", or "rejected").
        """
        # always send to review if editor hasn't made comments yet
        current_editor_comments = state.get("editor_comment", [])
        if not current_editor_comments:
            return "to_review"

        final_state = state.get("finalized_state", False)
        if final_state:
            return "accepted"
        elif state["revision_number"] > state["max_revisions"]:
            logger.info("Revision number > max allowed revisions")
            return "rejected"
        else:
            return "to_review"
```
在代码中，整个图的设置看起来是这样的


```python
from research_assist.researcher.AgentComponents import (
    AgentNodes,
    AgentState,
    AgentEdges,
)
## this is the predefined end node
from langgraph.graph import END

agent = StateGraph(AgentState)
nodes = AgentNodes(model, searcher)
edges = AgentEdges()

### Nodes
agent.add_node("initial_plan", nodes.plan_node)
agent.add_node("write", nodes.generation_node)
agent.add_node("review", nodes.review_node)
agent.add_node("do_research", nodes.research_plan_node)
agent.add_node("research_revise", nodes.research_critique_node)
agent.add_node("reject", nodes.reject_node)
agent.add_node("accept", nodes.accept_node)
agent.add_node("editor", nodes.editor_node)

### Edges
agent.set_entry_point("initial_plan")
agent.add_edge("initial_plan", "do_research")
agent.add_edge("do_research", "write")
agent.add_edge("write", "editor")

### Conditional edges
agent.add_conditional_edges(
  "editor",
  edges.should_continue,
  {"accepted": "accept", "to_review": "review", "rejected": "reject"},
)
agent.add_edge("review", "research_revise")
agent.add_edge("research_revise", "write")
agent.add_edge("reject", END)
agent.add_edge("accept", END)
```
在数据能够通过图流动之前，图必须被编译。根据文档的理解，这只是对图的结构进行一些简单检查，并返回一个`CompiledGraph`对象，该对象具有`stream`和`invoke`等方法。这些方法允许您将输入传递给起始节点，该节点在上面的代码中使用`set_entry_point`定义。

构建这些图时，在笔记本中可视化所有节点和边非常有帮助。这可以通过以下命令完成


```python
from IPython.display import Image

Image(agent.compile().get_graph().draw_png())
```
[LangGraph提供了几种不同的绘制图的方法](https://langchain-ai.github.io/langgraph/how-tos/visualization/)，具体取决于您安装的可视化包。我使用的是pygraphviz，可以使用以下命令在M系列Mac上安装。

```python
brew install graphviz
pip install -U --no-cache-dir  \
        --config-settings="--global-option=build_ext" \
        --config-settings="--global-option=-I$(brew --prefix graphviz)/include/" \
        --config-settings="--global-option=-L$(brew --prefix graphviz)/lib/" \
        pygraphviz
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*UbEWmRJZyL59E3sSiidqPg.png)

我们如何测试我们的代理？最简单的方法就是用一些AgentState组件的初始值（即任务、最大修订次数和修订编号）调用invoke，这些值将进入图的入口节点。

```python
graph = agent.compile()
res = graph.invoke(
    {
        "task": "What are the key trends in LLM research and application that you see in 2024",
        "max_revisions": 1,
        "revision_number": 0,
    }
)
```
经过一段时间（如果max_revisions设置得很大，可能需要几分钟），这将返回一个填充了所有组件的代理状态字典。我在这里使用gpt4o-mini，结果非常令人印象深刻，尽管添加“审查”和“编辑”组件在多大程度上确实有助于提高文章质量是可以讨论的，我们将在第3节中回到这一点。

如果我们想要更多关于图中每个节点在各个阶段的输入和输出的见解呢？这对于调试和解释非常重要，尤其是当图形不断增长或我们希望在生产中部署类似的东西时。幸运的是，LangGraph在这方面有一些很好的工具，这些工具在其文档的[持久性](https://langchain-ai.github.io/langgraph/concepts/persistence/)和[流式处理](https://langchain-ai.github.io/langgraph/concepts/streaming/)部分中有介绍。最小实现看起来像这样，我们使用内存存储来跟踪图的每个阶段产生的更新。

```python
from langgraph.store.memory import InMemoryStore
from langgraph.checkpoint.memory import MemorySaver
import uuid

checkpointer = MemorySaver()
in_memory_store = InMemoryStore()
graph = agent.compile(checkpointer=checkpointer, store=self.in_memory_store)

## Invoke the graph
user_id = "1"
config = {"configurable": {"thread_id": "1", "user_id": user_id}}
namespace = (user_id, "memories")
        
for i, update in enumerate(graph.stream(
  {
     "task": task_description,
     "max_revisions": max_revisions,
     "revision_number": 0,
  }, config, stream_mode="updates"
        )):
   # print the data that just got generated 
   print(update)
   memory_id = str(uuid.uuid4())
   # store the data that just got generated in memory
   self.in_memory_store.put(namespace, memory_id, {"memory": update})
   results.append(update)
```
更复杂的应用程序将从节点内部访问存储，从而使聊天机器人能够回忆起与特定用户的先前对话。在这里，我们只是使用内存来保存每个节点的输出，这些输出可以用于调试目的。我们将在最后一节中进一步探讨这一点。

## 3\. “do\_research” 节点中有什么？Tavily 搜索的强大功能

上述控制流中最有趣的部分可能是 `do_research` 和 `research_revise` 节点。在这两个节点内部，我们使用 LLM 生成与任务相关的一些网络搜索查询，然后使用 [Tavily](https://docs.tavily.com/docs/welcome) API 实际进行搜索。Tavily 是一项相对较新的服务，提供针对 AI 代理优化的搜索引擎。实际上，这意味着该服务返回的是来自网站的相关文本块，而不仅仅是一个 URL 列表（这在典型的搜索引擎 API 中需要被抓取和解析）。

在后台，Tavily 可能使用网络爬虫和 LLM 来提取与用户搜索相关的内容，但所有这些都被抽象化了。您可以在 [这里](https://app.tavily.com/home) 注册 Tavily 的免费“研究员”计划，该计划提供 1000 次免费 API 调用。不幸的是，之后您需要支付月费才能继续使用，这对于商业用例来说可能才值得。

让我们看看使用与 `AgentNodes.research_plan_node` 内部非常相似的代码的示例。

```python
from langchain_core.messages import (
    SystemMessage,
    HumanMessage,
)
from research_assist.researcher.prompts import (
    ResearchPlanPrompt,
)
from langchain_openai import ChatOpenAI
from tavily import TavilyClient

class Queries(BaseModel):
    """
    A model representing a list of search queries.

    Attributes:
        queries (List[str]): A list of search queries to be executed.
    """

    queries: List[str]

## set up task
task = """
What are the key trends in LLM reseach and application that you see in 2024
"""

## set up LLM and Tavily
model = ChatOpenAI(
    model="gpt-4o-mini", temperature=0, api_key=secrets["OPENAI_API_KEY"]
)
tavily = TavilyClient(api_key=secrets["TAVILY_API_KEY"])

## generate some queries relevant to the task
queries = agent.nodes.model.with_structured_output(Queries).invoke(
            [
                SystemMessage(content=ResearchPlanPrompt.system_template),
                HumanMessage(content=task),
            ]
)
```
这将生成与我们定义的任务相关的 5 个搜索查询，如下所示：

```python
['key trends in LLM research 2024',
 'LLM applications 2024',
 'latest developments in LLM technology 2024',
 'future of LLMs 2024',
 'LLM research advancements 2024']
```
接下来，我们可以对每个查询调用 Tavily 搜索。

```python
response = tavily.search(query=queries[0], max_results=2)
```
这将提供格式良好的结果，包括 URL、标题和文本块。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ggfmdmQTEpuZVIOL5bIq5A.png)

这是一个非常强大且易于使用的搜索工具，可以让 LLM 应用程序访问网络，而无需额外的工作！

在我们的研究员代理中，我们目前只使用内容字段，将其提取并附加到传递给 AgentState 的列表中。然后，这些信息被注入到用于写作节点的提示中，从而允许 LLM 在生成报告时访问这些信息。

您可以使用 Tavily 搜索做很多事情，但请注意，实验使用它会迅速消耗您的免费 API 调用。事实上，对于我们的报告写作任务，有许多应用场景可能不需要 Tavily 调用（即 LLM 已经有足够的知识来撰写报告），因此我建议添加一个额外的条件边缘，允许系统在确定不需要网络搜索时绕过 `do_research` 和 `research_revise` 节点。我可能会很快更新这个更改到仓库中。

## 4\. 通过示例进行讲解

为了巩固我们刚刚学到的内容，让我们通过一个研究人员实际操作的示例，使用与上面相同的任务。

首先，我们导入库并设置我们的 LLM 和搜索模型。

```python
from research_assist.researcher.Agent import ResearchAgent, load_secrets
from langchain_openai import ChatOpenAI
from tavily import TavilyClient

secrets = load_secrets()
model = ChatOpenAI(
    model="gpt-4o-mini", temperature=0, api_key=secrets["OPENAI_API_KEY"]
)
tavily = TavilyClient(api_key=secrets["TAVILY_API_KEY"])

agent = ResearchAgent(model, tavily)
```
现在我们可以在一个任务上运行代理，并给它设定最大修订次数。

```python
task = """
What are the key trends in LLM reseach and application that you see in 2024
"""
result = agent.run_task(task_description=task,max_revisions=3)
```
现在代理将运行它的任务，这可能需要大约一分钟。已添加日志记录以显示它正在做什么，重要的是，结果被保存到 `in_memory_store` 中，我们在第 2 节的末尾看到过。

最终报告可以通过几种方式访问。它存储在结果列表中，可以在笔记本中可视化，如下所示：

```python
Markdown(result[-3]['write']['draft'])
```
它也存储在代理的记忆中，以及所有其他输出。我们可以通过以下方式访问它：

```python
agent.in_memory_store.search(("1", "memories"))[-3].dict()
```
报告本身大约有 1300 个字——在这里复制有点多——但我已将其粘贴到 [这里](https://github.com/rmartinshort/research_assist/tree/main/research_assist/examples) 的仓库中。我们还可以看看编辑在经过一轮修订后对它的看法：

```python
editor_comments = agent.in_memory_store.search(("1", "memories"))[-2].dict()
```

```python
{'value': {'memory': {'editor': {'editor_comment': 
'The report has addressed the critiques by enhancing depth in key sections, 
adding clarity, and improving structure with subheadings. 
It provides specific examples and discusses ethical considerations, 
making it a valuable resource. The revisions are sufficient for publication.',
    'finalized_state': True}}},
 'key': '9005ad06-c8eb-4c6f-bb94-e77f2bc867bc',
 'namespace': ['1', 'memories'],
 'created_at': '2024-11-11T06:09:46.170263+00:00',
 'updated_at': '2024-11-11T06:09:46.170267+00:00'}
```
看起来编辑对结果感到满意！

为了调试，我们可能需要阅读所有其他输出。这样在笔记本中做可能会很痛苦，因此在下一篇文章中，我们将讨论如何将它们以编程方式放入 Google Docs。感谢您看到最后，[我们将在第 2 部分继续](https://towardsdatascience.com/building-a-research-assistant-that-can-write-to-google-docs-part-2-ac9dcacff4ff)！

作者与本文中讨论的任何工具没有关联。

