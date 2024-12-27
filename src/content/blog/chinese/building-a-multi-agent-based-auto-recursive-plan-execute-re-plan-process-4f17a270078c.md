---
title: "构建基于多代理的 自动递归--计划、执行、再计划流程"
meta_title: "构建基于多代理的 自动递归--计划、执行、再计划流程"
description: "本文讨论了基于多智能体的自动递归计划执行与重新计划过程。首先，提出了智能体在计划、执行和重新计划中的应用场景，强调了在复杂任务中需要动态调整和灵活性的必要性。接着，介绍了一种基于Azure Gen AI Foundation框架的解决方案，使用监督者和执行者智能体协作，通过递归调用实现任务的自动化执行与重新规划。最后，作者分享了多种智能体用例，展示了其在不同领域的应用潜力。"
date: 2024-12-27T12:59:06Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*V01_TB1pHE2c-bXGK9qxkg.png"
categories: ["Programming", "Autonomous Systems", "Generative AI"]
author: "Rifx.Online"
tags: ["multi-agent", "supervisor", "replanning", "Azure", "GenAI"]
draft: False

---



本博客包含以下三个部分：

* 问题陈述
* 解决方案方法
* 结论与参考文献

**问题陈述**

计划、执行与重新计划过程在智能体解决方案的领域并不新鲜。自去年以来，我们一直在实施这些基于智能体的计划-执行-重新计划过程。

因此，当我的一位同事讨论实施这些过程的挑战时，我感到很有趣，因为我认为这是一个讨论得很充分的问题。

但是在与他交谈时，我理解了他计划要做的场景的性质和复杂性，我认为这是一个很好的合作机会。

为了清晰地阐述内容，以下是我对问题陈述的理解和我认为的场景。

*场景 1（我的理解）：*

智能体解决方案可以以多种方式设计。智能体可以设计为监督者<->工人；它们可以设计为以无环方式相互交谈的智能体网络；它们可以是层次结构等。

我理解到，在最简单的形式中，我们可以使用一个智能体和多个工具来实现计划-执行-重新计划过程。这对于简单的用例来说已经足够。当我分享用于解决此用例的多工具（单一智能体）时，我们发现它适用于简单场景。

*场景 2（稍微先进但与Langchain一致）：*

在第二个场景中，我引入了另一个解决方案。我谈到了Langchain自己预构建的智能体，它可以帮助实现这个循环。相信我，这让我们兴奋了很长一段时间，因为它能够循环并迭代计划以生成执行结果。有关更多详细信息，请查看 @ [https://github.com/langchain\-ai/langchain/blob/master/cookbook/plan\_and\_execute\_agent.ipynb](https://github.com/langchain-ai/langchain/blob/master/cookbook/plan_and_execute_agent.ipynb)

这是一个开箱即用的智能体，包含load\_chat\_planner和PlanAndExecute模块，位于plan\_and\_execute智能体API中。

这个智能体（由Langchain提供）受到了BabyAGI的启发。解决方案的核心关注于计划者和执行者。

*这两个场景中缺少什么（场景 3）：*

当我与同事交谈时，他试图解决的真正问题是智能体动态适应计划、采取行动并根据先前的行动重新计划。场景 2 中的单一智能体在某些场景中是可以的，但在复杂的多步骤过程中，它却显得力不从心。

其次，在计划-执行-重新计划过程中，我们需要更多的灵活性。我们需要在规划和执行步骤时调用外部系统。这意味着我们需要设计一个递归的多智能体系统，能够持续处理，直到有效完成目标。

那么，不再多说，让我们开始吧：

**解决方案**

让我们从我们最终设计的计划-执行-重新计划过程的整体设计开始。整体解决方案基于我已经研究了一段时间的多智能体框架。我写了超过10篇关于多智能体框架的博客，你可以在下面的“结论”部分找到链接。

当工作流开始时，初始监督者智能体启动。监督者智能体可以设置初始配置（如无环DAG、内存、提示等），以便其他独立智能体能够协同工作以达成目标。这在步骤2、3中得以体现，当监督者智能体的设置和初始化完成时。

接下来（在步骤4中）——DAG经过第一个智能体——如果该智能体需要人工干预（例如，该智能体需要人类询问问题或确认决策）——那么该过程将暂停，等待人类采取该行动并保持状态。

在步骤6中——智能体可以调用相关工具来完成智能体的动作，并基于此调用过程的下一步。下一步是执行命令的执行者过程。

接下来，系统检查任务列表是否完成，如果整个任务集完成，则系统将响应用户，否则它将以递归方式调用重新规划智能体，如下所示。



为了理解系统的行为，我有另一个流程图，提供用例级别的流程（与上述架构蓝图相比）。

在这种情况下——当用户询问一个问题时——规划者智能体被触发，规划者将生成详细的任务列表。如图所示。从该任务列表中，执行者智能体将被递归调用。

对于第一个任务，执行者智能体将调用适当的工具以获取响应。根据响应，将调用重新规划智能体。重新规划智能体将决定是否需要重新规划。它还将决定所有待处理任务是否已完成。

如果完成，则它将收集响应并发送给用户，否则它将递归调用下一步。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*2Jv-lm15MSq-U0YhkgWhmg.png)

现在让我们看看解决方案。该解决方案基于Azure Gen AI Foundation框架，具有相同的外观和感觉（请查看框架 @ [https://medium.com/@nayan.j.paul/gen\-ai\-building\-adoption\-through\-a\-common\-platform\-instead\-of\-enabling\-be\-spoke\-use\-cases\-b0cbc2e185a8](https://medium.com/@nayan.j.paul/gen-ai-building-adoption-through-a-common-platform-instead-of-enabling-be-spoke-use-cases-b0cbc2e185a8)）

系统要求我们提供一个问题，基于此它将设计计划。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*KCtvixPWIpZVvjGFy1TL4A.png)

这是相同的保护措施和状态管理，确保系统不会向前推进，除非提供了智能体的具体细节（在这种情况下是问题）。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*vpBO3zC4hDQ0R5CKTgDu-g.png)

我开始询问系统给我准备浓缩咖啡的快速步骤。这个问题触发了迭代和递归的计划-执行-重新计划过程。系统随后进入自动驾驶模式，递归调用和执行下一步。

如果我们看到下面的内容，它以计划步骤开始，给我3个步骤来执行该过程。然后它移动到执行计划以执行第一个任务。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*eIHDITFdLRlxzwDo75n-1A.png)

一旦第一个任务完成，系统会自动识别计划正在进行，然后调用重新规划步骤。重新规划步骤然后在循环中再次调用执行计划步骤，直到我们完成所有处理，如下所示。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*rm5U2TWYyLZFCFMCQDBLDg.png)

所有这些都是自动化的，在每一步中，系统决定是否进入下一步并进行处理。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*P8B0_OhmsT8D9WvYNcEYrA.png)

这展示了这个智能体解决方案的迭代特性，其中过程是递归和自动化的。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Tex4Rf0SrgFajxh5ZGM9Eg.png)

**结论**

如果你有任何其他问题需要我尝试，请发送给我。我将分享框架在复杂场景中的表现。我现在正在测试这个客户用例，并会及时向大家更新。

现在，我已经在智能体方面工作了一段时间，以下是我实施的一些智能体用例，供您参考：

1. 整体“智能体解决方案”概述 @ [https://medium.com/@nayan.j.paul/implementing\-llm\-and\-gen\-ai\-applications\-using\-the\-world\-of\-llm\-agents\-37fab8889bd3](https://medium.com/@nayan.j.paul/implementing-llm-and-gen-ai-applications-using-the-world-of-llm-agents-37fab8889bd3)
2. 基于目标的智能体开发 @ [https://medium.com/@nayan.j.paul/how\-i\-designed\-a\-tic\-tac\-toe\-agent\-in\-a\-multi\-agent\-setup\-with\-llm\-and\-gen\-ai\-3da646177980](https://medium.com/@nayan.j.paul/how-i-designed-a-tic-tac-toe-agent-in-a-multi-agent-setup-with-llm-and-gen-ai-3da646177980)
3. 使用智能体集合进行探索性数据分析 @ [https://medium.com/@nayan.j.paul/designing\-exploratory\-analysis\-agent\-with\-gen\-ai\-large\-language\-models\-llms\-61310a1cd60f](https://medium.com/@nayan.j.paul/designing-exploratory-analysis-agent-with-gen-ai-large-language-models-llms-61310a1cd60f)
4. 设计假设测试和模式分析智能体 @ [https://medium.com/@nayan.j.paul/designing\-hypothesis\-analysis\-agent\-with\-gen\-ai\-large\-language\-models\-llms\-a09aaf7016d4](https://medium.com/@nayan.j.paul/designing-hypothesis-analysis-agent-with-gen-ai-large-language-models-llms-a09aaf7016d4)
5. 设计供应链模拟建模 @ [https://medium.com/@nayan.j.paul/designing\-simulation\-modeling\-agents\-using\-gen\-ai\-large\-language\-models\-llms\-ed12f462c3f2](https://medium.com/@nayan.j.paul/designing-simulation-modeling-agents-using-gen-ai-large-language-models-llms-ed12f462c3f2)
6. 汽车订单放置的多轮用例 @ [https://medium.com/@nayan.j.paul/multi\-turn\-goal\-based\-agents\-with\-large\-language\-models\-with\-practical\-use\-case\-49a78fcc79c4](https://medium.com/@nayan.j.paul/multi-turn-goal-based-agents-with-large-language-models-with-practical-use-case-49a78fcc79c4)
7. 日程安排助手 @ [https://medium.com/@nayan.j.paul/designing\-scheduling\-assistant\-agent\-using\-gen\-ai\-large\-language\-models\-llms\-7799d882ee6e](https://medium.com/@nayan.j.paul/designing-scheduling-assistant-agent-using-gen-ai-large-language-models-llms-7799d882ee6e)
8. 递归多智能体游戏（狼、白菜、羊） — [https://medium.com/@nayan.j.paul/implementic\-recursive\-agentic\-solution\-wolf\-goat\-cabbage\-game\-using\-gen\-ai\-677506ecf906](https://medium.com/@nayan.j.paul/implementic-recursive-agentic-solution-wolf-goat-cabbage-game-using-gen-ai-677506ecf906)

9. 基于O1模型的多智能体系统推理 — [https://medium.com/@nayan.j.paul/root\-cause\-analysis\-use\-case\-with\-the\-new\-o1\-reasoning\-model\-e4f75e88403b](https://medium.com/@nayan.j.paul/root-cause-analysis-use-case-with-the-new-o1-reasoning-model-e4f75e88403b)  
10. 多智能体缺货传播系统 — [https://medium.com/@nayan.j.paul/implementing\-back\-order\-prediction\-agent\-using\-gen\-ai\-large\-language\-models\-llms\-8eede590438e](https://medium.com/@nayan.j.paul/implementing-back-order-prediction-agent-using-gen-ai-large-language-models-llms-8eede590438e)  
11. 使用多智能体系统进行运输ETA预测 — [https://medium.com/@nayan.j.paul/implementing\-shipment\-eta\-prediction\-agent\-using\-gen\-ai\-large\-language\-models\-llms\-d0e9021bb54b](https://medium.com/@nayan.j.paul/implementing-shipment-eta-prediction-agent-using-gen-ai-large-language-models-llms-d0e9021bb54b)  

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*kYqWimOJf0bUBzWe6Bq7dA.jpeg)

