---
title: "CrewAI 的任务工具与代理工具：您必须知道的区别"
meta_title: "CrewAI 的任务工具与代理工具：您必须知道的区别"
description: "在CrewAI中，工具分为代理级别和任务级别。代理级别的工具是代理的核心技能，适用于所有任务，增强其整体能力；而任务级别的工具则专门用于特定任务，确保代理在执行时使用最合适的工具。理解这两者的区别对于设计高效的多代理系统至关重要，能够优化代理的表现和任务执行的控制。选择合适的工具分配方式会影响AI系统的自主性和适应性。"
date: 2024-12-07T12:32:42Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ITJa6MMyojdGjSzPQRgTvg.png"
categories: ["Programming", "Machine Learning", "Data Science"]
author: "Rifx.Online"
tags: ["Agent", "Tools", "Task", "Probabilistic", "Deterministic"]
draft: False

---



在 CrewAI 中，**工具**本质上是代理可以利用的技能或功能，以执行各种操作。可以将其视为为您的 AI 代理提供一个装满专业工具的工具箱。这些工具在扩展 CrewAI 代理的能力方面至关重要，使他们能够承担广泛的任务并有效协作，例如访问互联网、查询数据库中的数据或运行 Python 代码。



**CrewAI** 提供了灵活性，您可以以多种方式为代理配备工具：

* **A) 代理级别：** 在代理级别分配的工具成为代理核心技能的一部分，可以在他们执行的任何任务中访问。这种方法非常适合代理经常使用的工具。

```python
## Example of Agent Tools

from crewai_tools import CodeInterpreterTool

## Create a new instance of the CodeInterpreterTool
tool_code_interpreter = CodeInterpreterTool()

## ... (Agent and Task definitions will be shown later) ...

agent_coder = Agent(
    role="Python Developer",
    goal="Write and execute Python code",
    backstory="You are an experienced Python developer.",
    tools=[tool_code_interpreter],
)

task_coding = Task(
    description="Solve a coding problem using Python.",
    agent=agent_coder,

)
```
* **B) 任务级别：** 工具也可以在任务级别分配，仅在该特定任务的上下文中可用。这种方法确保代理可以访问特定工作所需的专业工具，即使这些工具不属于他们通常的工具库。

```python
## Example of Task Tools

from crewai_tools import CodeInterpreterTool

## Create a new instance of the CodeInterpreterTool
tool_code_interpreter = CodeInterpreterTool()

## ... (Agent and Task definitions will be shown later) ...

agent_coder = Agent(
    role="Python Developer",
    goal="Write and execute Python code",
    backstory="You are an experienced Python developer.",
    
)

task_coding = Task(
    description="Solve a coding problem using Python.",
    agent=agent_coder,
    tools=[tool_code_interpreter], # <- here is the key difference!!!
```
理解任务工具与代理工具之间的区别对于构建有效和高效的多代理系统至关重要。这种区别使您能够微调代理的行为，并优化他们在特定任务和场景中的表现。

## 代理与任务的工具目的

* **代理：** 提供给代理的工具旨在增强代理在其操作生命周期中的能力。它们是代理能力的一部分，并在任何任务执行期间可供访问。这些工具反映了代理的技能组合，提高了代理的整体功能和效率。
* **任务：** 分配给任务的工具专门用于该任务的上下文中。这些工具用于实现与任务相关的特定目标，无论执行任务的是哪个代理。任务定义了完成其分配所需的工具，并可以覆盖代理的默认工具。

## 工具使用的范围和背景

* **代理:** 分配给代理的工具在代理执行的所有任务中均可用。例如，如果代理拥有一个网页抓取工具，它可以在任何分配给它的任务中使用该工具，只要该任务需要或允许使用。
* **任务:** 分配给任务的工具仅在该特定任务的上下文中可用。这种设置允许高度控制，确保任务使用最合适的工具。它还使不同的代理能够使用相同的任务，而不必一定拥有这些工具。

## 执行控制

* **代理:** 当代理拥有工具时，它控制这些工具的使用时间和方式。这种设置适合希望代理能够自主决策何时利用其能力的情况。它非常适合具备专业知识或独特技能的代理，这些技能需要频繁使用特定工具。
* **任务:** 将工具分配给任务使工具的使用控制权归任务定义本身。这种方法在任务需要特定操作时非常有用，例如查询数据库或进行API调用，这些操作需要精确的工具使用。这种设置允许不同的代理执行任务，同时遵循任务设定的工具要求。

## 工具管理与重叠

* **Agents:** 如果多个代理拥有相同的工具，每个代理将管理该工具的实例，这可能导致冗余的工具使用，如果没有经过仔细规划。这种情况需要谨慎管理，以避免低效。
* **Tasks:** 当工具是特定于任务时，工具仅在执行任务时实例化。这可以导致更流畅的使用和更少的冲突，因为工具仅在明确需要的上下文中使用。

最后，但绝对不是最不重要的。我们将这一点放在最后，因为我们认为这是可能需要注意的最重要的区别。

## 确定性工具使用与概率性工具使用

### 任务级别的工具（确定性使用）：

* **当一个工具直接分配给一个任务时，只要任务的逻辑需要它，就保证在执行该任务时会使用该工具。** 这种确定性特性意味着任务的执行路径明确涉及该工具，确保每次任务运行时的一致性和可预测性。
* 如果您需要工具使用的一致性，请将其放在任务级别。这种方法适用于特定工具操作是任务不可谈判部分的场景。
* 例如，如果一个任务被设计为查询数据库，并且它有一个数据库连接工具分配给它，那么该任务将在其执行流程中始终调用该工具。该工具的使用是预定义的且不可谈判，确保任务的要求始终得到满足。

### 代理级别的工具（概率使用）：

* **分配给代理的工具则更具概率性。这意味着即使代理拥有一个工具，它也可能根据其内部逻辑、任务要求或任务执行过程中的决策过程选择使用或不使用该工具。**
* **如果您更喜欢自主性并希望代理决定最佳方法，请在代理级别分配工具。此设置非常适合需要适应性策略和决策的角色。**
* **例如，拥有数据分析工具的代理可能不会在处理的每个任务中都使用它。代理的行为受到任务描述、代理背景故事、目标或甚至先前结果等因素的影响，使得工具的使用更加动态且不易预测。**

> **选择正确的工具分配方法可以显著影响您的 AI 系统的自主性、适应性和整体有效性。**

> **例如，如果您需要任务的一致性和可预测性，任务级别分配工具可以确保在执行该任务时始终使用该工具。**

> **相反，如果您希望代理更加自主并根据上下文做出决策，在代理级别分配工具则可以实现更大的灵活性和适应性。**

## 用简单英语表达 🚀

*感谢您成为 [**用简单英语表达**](https://plainenglish.io/) 社区的一部分！在您离开之前：*

* 一定要 **点赞** 和 **关注** 作者 ️👏**️️**
* 关注我们： [**X**](https://twitter.com/inPlainEngHQ) \| [**领英**](https://www.linkedin.com/company/inplainenglish/) \| [**YouTube**](https://www.youtube.com/channel/UCtipWUghju290NWcn8jhyAw) \| [**Discord**](https://discord.gg/in-plain-english-709094664682340443) \| [**通讯**](https://newsletter.plainenglish.io/)
* 访问我们的其他平台： [**CoFeed**](https://cofeed.app/) \| [**Differ**](https://differ.blog/)
* 更多内容请访问 [**PlainEnglish.io**](https://plainenglish.io/)

