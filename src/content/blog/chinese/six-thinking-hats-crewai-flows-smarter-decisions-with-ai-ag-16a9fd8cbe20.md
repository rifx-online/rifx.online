---
title: "六顶思考帽 + CrewAI 流程：利用人工智能农业做出更明智的决策"
meta_title: "六顶思考帽 + CrewAI 流程：利用人工智能农业做出更明智的决策"
description: "本文探讨了如何利用CrewAI平台结合爱德华·德·博诺的六顶思考帽方法论，通过AI代理优化决策过程。AI被视为增强人类决策的工具，能够提供多维度的分析和创意支持。实现过程中，用户需配置代理角色和任务，并通过工作流组织决策。文章强调验证AI输出的重要性，并提出未来的应用潜力和增强功能，旨在在AI时代提升决策的全面性与结构化。"
date: 2024-11-25T15:00:22Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*blFudLTNGRrNB1gE"
categories: ["Programming", "Machine Learning", "Decision Making"]
author: "Rifx.Online"
tags: ["AI", "decision-making", "validation", "workflows", "multi-agent"]
draft: False

---






> “当时看起来是个好主意。”


> \- 摘自 \*大西部七侠\*

## 利用AI代理进行明智决策

“当时看起来是个好主意。”这句台词借自《七侠荡寇志》，常常是我们在反思过去决策时的共同感受。有时，我们不禁想，如果有更多的信息，是否能帮助我们做出更好的选择。但是，我们到底是如何做出决策的呢？我们依赖于自己的知识——存储在脑海中的信息，也许是经过索引和归档的——以及专家的见解。但在今天的AI世界中，真正的专家是谁呢？

**AI作为专家的崛起**

答案可能是生成性AI模型或从这些先进模型中提取的应用和代理。让我们先谈谈代理。想象一下，您可以利用大量专业代理——这些工具不仅补充您的知识，甚至可能激发新的想法。这种额外的推动可以让我们的下一步变得更轻松、更明智，甚至更具创造性。

**利用外部资源**

在某种程度上，这对我们来说并不完全陌生。想想我们是如何使用谷歌搜索来扮演那些我们并不真正擅长的角色的。例如，医生们经常谈到“谷歌训练的患者”，这些患者希望共同制定治疗计划，尽管缺乏验证他们找到的解决方案的专业知识。从这个意义上说，我们多年来一直在不完美地依赖外部信息源。

**验证的重要性**

因此，真正的挑战在于验证。如果我们使用AI应用和代理，关键在于尽可能验证它们的输出。从逻辑上讲，我们应该在可以手动验证这些AI驱动解决方案的领域应用它们，或者至少在某种程度上对这样做有信心。像房地产交易这样的场景可能是合适的，但高度专业化的医疗治疗可能就不适合。

**使用CrewAI构建代理**

考虑到这一点，让我们探索使用CrewAI构建一些代理，并将它们与我们在最近的deeplearning.ai课程中学习的GPT模型集成。这些代理可以作为我们的数字专家，帮助我们在复杂决策中导航，同时始终牢记验证和人类判断的重要角色。

**人类与AI的协作**

我们必须考虑的一个重要方面是人类与AI代理之间的协作潜力。通过将AI视为对我们自身技能的增强而非替代，我们可以实现一种协同效应，使我们超越典型的局限。这种伙伴关系使我们能够专注于问题的创造性和战略性方面，同时让AI处理更常规的分析、多次反思（例如“我是否应该这样做”或“我是否彻底考虑过这个”这种无休止的思维循环）和数据密集型任务。这种劳动分工不仅提高了效率，还使我们能够自由地应对更具雄心的挑战。

**使用爱德华·德·博诺的六顶思考帽进行决策**

为了增强决策能力，我们可以借鉴爱德华·德·博诺的六顶思考帽方法论，这是一种有效的工具，用于结构化个人和专业决策。通过使用模拟六顶思考帽不同角色的AI代理——白色（事实和信息）、红色（情感）、黑色（谨慎）、黄色（积极）、绿色（创造力）和蓝色（管理和控制）——我们可以对挑战获得平衡的视角。想象一下一个AI驱动的决策工具包，帮助您有效地探索所有这些维度，确保没有任何方面被忽视。这在商业环境中尤其有价值，因为战略决策需要全面的方法，而在个人决策中，情感和创造力往往需要结构。

本文将探讨使用CrewAI最新功能Flows对六顶思考帽方法论的简单实现。

## CrewAI最新功能的快速总结，来自他们的Deeplearning.ai课程。

CrewAI是一个构建和部署多智能体AI系统的平台。该平台专注于实际应用，允许用户创建共同协作以实现共同目标或解决复杂任务的智能体。

用户现在可以将智能体组织成工作流，连接多个团队以形成管道，测试和训练智能体以实现最佳性能，并利用外部工具构建复杂的应用程序。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*y6BziQsFioR61tnKpyfqHA.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Ridtl40yeyjxgni7r3gKVw.png)

* **更复杂的智能体工作流：**该平台现在允许用户将智能体组织成更复杂的工作流，例如连接多个智能体组、让智能体在混合环境中工作、实现并行任务完成，并将结果报告给更高级别的智能体。工作流现在允许在多个团队执行之前/期间/之后运行python代码。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*R0MxGJADhufLprdnL23gag.png)

* **通过多个团队创建管道：**用户现在可以通过组合多个团队来构建管道，一个团队的输出可以有条件地传递给另一个团队以进行进一步任务。
* **性能测试和训练：**crewAI支持创建评估以评估团队性能，并为智能体提供实时人类反馈机制，以便随着时间的推移改善其行为。
* **与外部工具集成：**用户现在可以构建更先进的基于智能体的应用程序和自动化，利用外部工具。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*mR6syF8kUhlz01r7G4dYRw.png)

* **使用CrewAI云轻松部署：**用户现在可以通过简单的API集成使用这些智能体/团队/工作流。

## 使用 CrewAI 流程实现六顶思维帽：简单的技术指南

该实现利用 CrewAI 的 Flow 功能，基于爱德华·德·波诺的六顶思维帽方法创建一个结构化的决策流程。系统通过多个专门的代理处理决策，每个代理代表不同的“思维帽”，并将它们的见解综合成可行的建议。

**先决条件**

* 安装了 CrewAI 的 Python 环境
* OpenAI API 密钥或兼容的 LLM 设置
* 基本的 YAML 配置理解
* 熟悉 Python 类和异步编程

**实现架构**

*1\. 配置结构*

该实现使用两个 YAML 配置文件：

* `six_hats_agents.yaml`：定义代理角色和特征
* `six_hats_tasks.yaml`：指定每个代理执行的任务

关注点的分离允许在不改变核心逻辑的情况下轻松修改代理行为和任务定义。

*2\. 代理角色*

实现了八个专门的代理：

* 白帽：信息收集者
* 红帽：情感评估者
* 黑帽：批判分析者
* 黄帽：利益发现者
* 绿帽：创造性思考者
* 蓝帽：流程控制者
* 综合专家
* 实施战略家

**3\. 流程管道结构**

决策流程作为一个 `DecisionMakingPipeline` 类实现，继承自 CrewAI 的 Flow：

```python
class DecisionMakingPipeline(Flow):
    @start()
    def get_decision(self)
    @listen(get_decision)
    def perform_hat_analysis(self, decisions)
    @listen(perform_hat_analysis)
    def synthesize_and_plan(self, analyses)
    @listen(synthesize_and_plan)
    def finalize_recommendation(self, recommendations)
```
**4\. 关键实现步骤**

*a. 环境设置*

* 安装所需的包
* 配置环境变量
* 加载 YAML 配置

*b. 代理创建*

* 用各自的角色初始化每个代理
* 配置代理参数（详细程度、委托设置）
* 如有需要，分配特定工具

*c. 任务定义*

* 为每种分析类型创建任务
* 将任务链接到适当的代理
* 定义预期输出和格式

*d. 团队组建*

* 创建由六顶帽子代理组成的分析团队
* 创建由专家代理组成的综合团队
* 配置团队设置和互动模式

*e. 流程实现*

1. 决策输入 (`get_decision`):
* 格式化初始决策数据
* 准备分析的上下文

2\. 帽子分析 (`perform_hat_analysis`):

* 观点的并行处理
* 收集多样化的观点

3\. 综合 (`synthesize_and_plan`):

* 分析的整合
* 建议的形成

4\. 最终确定 (`finalize_recommendation`):

* 结构化输出创建
* 行动计划制定

**最佳实践**

1. *错误处理*
* 在每个流程阶段实现稳健的错误捕捉
* 为代理失败提供后备机制
* 记录问题以便调试和改进

***2\.*** *数据流*

* 在各阶段之间保持一致的数据结构
* 在传递到下一阶段之前验证输出
* 考虑使用 Pydantic 模型进行数据验证

*3\. 性能优化*

* 尽可能使用并行处理
* 对重复分析实施缓存
* 监控令牌使用并优化提示

*4\. 可扩展性*

* 设计便于添加新帽子视角
* 允许自定义代理和工具配置
* 支持不同的输出格式

**使用示例**

1. *基本决策分析:*


```python
flow = DecisionMakingPipeline()
results = flow.kickoff()
```
*2\. 保存结果:*


```python
def save_decision_results(results, filename='decision_analysis.md'):
    # Implementation for saving results to file
```
3\. *绘制流程*


```python
flow.plot()
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ib3qK2g1m0GDuFxdZC6Gyw.jpeg)

**未来增强**

1. *集成功能:*
* 远程访问的 API 端点
* 交互式网页界面
* 决策历史的数据库存储

*2\. 高级功能:*

* 自定义帽子视角
* 实时协作
* 决策跟踪和分析

**故障排除**

常见问题及解决方案：

1. *令牌限制*: 优化提示长度
2. *Google Colab 中的异步执行错误*: 检查事件循环处理
3. *配置加载*: 验证 YAML 语法
4. *代理通信*: 监控消息传递

**Github 链接**

## 将一切结合在一起：AI增强决策的未来

随着我们从决策的哲学基础走向使用CrewAI Flows实施六顶思考帽方法论的实际应用，一件事变得清晰：我们不仅仅是在构建工具；我们正在重塑在AI时代处理复杂决策的方式。

我们所探索的简单实施为现代AI技术如何增强传统决策框架提供了一些启示。通过将爱德华·德·博诺的久经考验的六顶思考帽方法论与CrewAI的多智能体系统的能力相结合，我们试图在人的智慧与人工智能之间架起一座桥梁。这并不是要取代人类的决策，而是通过结构化、全面的分析来增强它，这可能是单个思维难以独立实现的。

展望未来，潜在的应用广泛。从商业战略到个人生活选择，这种方法可以帮助减少认知偏见，扩展决策能力，并提供一致、文档齐全的决策过程。然而，正如我们在开头提到的那句来自《七侠荡寇志》的名言——“当时看起来是个好主意”——我们必须记住，所有工具，无论多么复杂，都需要深思熟虑的应用。

关键在于保持利用AI的分析能力与保留人类判断和直觉之间的平衡。无论你是希望实施类似系统的开发者，还是寻求增强决策过程的商业领袖，请记住，目标不是做出完美的决策——那几乎是不可能的——而是做出更好、更周全的决策。通过将传统智慧与尖端AI技术相结合，我们正在朝着这个目标迈出重要的一步。

