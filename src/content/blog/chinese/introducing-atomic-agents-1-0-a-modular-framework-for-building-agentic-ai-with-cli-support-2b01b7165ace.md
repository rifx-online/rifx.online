---
title: "Atomic Agents 1.0 简介：构建 Agentic AI 的模块化框架"
meta_title: "Atomic Agents 1.0 简介：构建 Agentic AI 的模块化框架"
description: "想象一下，构建 AI 应用程序就像组装乐高积木一样轻松。这就是 Atomic Agents 背后的想法，它是一个模块化框架，用于……"
date: 2024-11-08T00:19:37Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*BZGf8BCnCJiFlKZ5.png"
categories: ["Programming", "Machine Learning", "Autonomous Systems"]
author: "Rifx.Online"
tags: ["modular", "framework", "Atomic", "assembler", "schema"]
draft: False

---



想象一下，构建 AI 应用程序就像组装乐高积木一样轻松。这就是 [Atomic Agents](https://github.com/BrainBlend-AI/atomic-agents) 的理念，一个基于 **Atomic Design** 原则的模块化框架，用于构建 AI 代理。随着 **1\.0 版本** 的发布，Atomic Agents 引入了一个强大的 CLI，称为 **Atomic Assembler**，使构建、管理和部署 AI 应用程序变得更加简单。

## 为什么选择原子代理？

许多现有的**代理人工智能**框架专注于构建自主的多代理系统，这些系统更像是好奇心的产物，而不是实用工具。虽然这些系统可能引人入胜，但它们往往缺乏现实应用所需的可预测性和控制能力。

企业通常并不希望有一个每次都以不同风格撰写文章的机器人。他们希望在风格、结构和语调上保持一致，以与其品牌形象相一致。微调模型是一种方法，但它需要大量的数据和资源，并且在使用最新模型（如GPT-4）时并不总是可行的。

原子代理旨在通过提供以下功能来解决这一问题：

* **模块化**：通过组合简单、可互换的组件构建复杂的人工智能系统。
* **原子性**：原子代理中的每个组件、每个工具、每个代理、每个上下文提供者，都尽可能单一目的和可重用，确保良好的关注点分离。
* **控制**：微调每个单独的步骤和组件，从系统提示到工具。
* **可预测性**：确保可重复和可靠的输出，适合商业用例。
* **可扩展性**：轻松添加或替换组件，而无需彻底改造整个系统。

## 传统模块化方法

在传统软件开发中，复杂问题被分解为更小、可管理的部分：

1. **定义问题**：从流程、用户故事或客户旅程开始。
2. **分解**：将问题划分为更小、可解决的任务。
3. **开发模块化代码**：编写处理特定任务的函数或类。
4. **集成**：将这些模块组合成完整的应用程序。

Atomic Agents 将这种模块化和可预测性带入 AI 代理开发中。

## 真实世界场景

与其构建一个“写博客文章”的单体 AI 系统，不如设计一个模块化系统，能够：

1. **生成** 与主题相关的查询。
2. **识别** 最相关的前 X 篇文章。
3. **访问** 每篇识别文章的页面。
4. **提取** 每篇文章的文本。
5. **生成** 每篇文章的摘要。
6. **存储** 摘要到向量数据库中。
7. **生成** 与主题相关的问题。
8. **使用** 向量数据库回答这些问题。
9. **综合** 答案成一篇连贯的博客文章。

这种方法虽然更冗长，但提供了更大的控制、可靠性和适用于现实商业应用的适应性。

## CLI的介绍：Atomic Assembler

版本1.0中的一个重要新增功能是**Atomic Assembler** CLI。这个命令行工具允许您：

* **下载和管理工具**：轻松将新工具或代理添加到您的项目中。
* **避免不必要的依赖**：仅安装您所需的内容。
* **轻松修改工具**：每个工具都有自己的测试和文档。
* **直接访问工具**：如果您愿意，可以手动管理工具，而无需使用CLI。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*aDceAIINxyFDOvle.png)

## 代理的构成

AI 代理，特别是在 Atomic Agents 框架中，由几个关键组件组成：

* **系统提示**：定义代理的行为和目的。
* **用户输入**：用户提供的数据。
* **工具**：代理可以利用的外部函数或 API。
* **记忆**：跟踪对话或状态。

每个组件都设计为模块化和可互换，遵循关注点分离和单一责任原则。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*yt-5SoQC6uXTAd1-)

## 模块化的力量

通过将代理分解为这些基本组件，您可以：

* **更换工具** 而不影响系统的其余部分。
* **微调提示** 以调整代理的行为。
* **无缝连接代理和工具**，通过匹配它们的输入和输出模式。

## 使用命令行界面：原子汇编器

## 安装

要开始使用 Atomic Agents 和 CLI，请通过 pip 安装该软件包：

```python
pip install atomic-agents
```

## 运行 CLI

使用以下命令启动 CLI：

```python
atomic
```

或者，如果您使用 Poetry 安装了 Atomic Agents：

```python
poetry run atomic
```

您将看到一个菜单，用于下载和管理工具：

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*SzRlpA0-ivcE2qhk)

*图像：Atomic CLI 主菜单*

每个工具包括：

* **输入模式**
* **输出模式**
* **使用示例**
* **依赖项**
* **安装说明**

## 管理工具

Atomic Assembler CLI 提供了对您工具的完全控制，让您可以：

* **避免依赖杂乱**：仅安装您需要的工具。
* **轻松修改工具**：每个工具都是自包含的，拥有自己的测试。
* **直接访问工具**：如果您愿意，可以手动管理工具文件夹。

## 上下文提供者

Atomic Agents 引入了 **上下文提供者**，以增强您的代理的动态上下文。上下文提供者允许您在运行时将额外信息注入代理的系统提示中。

## 使用上下文提供者

**创建上下文提供者类**：子类化 `SystemPromptContextProviderBase` 并实现 `get_info()` 方法。

```python
from atomic_agents.lib.components.system_prompt_generator import SystemPromptContextProviderBase   

class SearchResultsProvider(SystemPromptContextProviderBase):
      def __init__(self, title: str, search_results: List[str]):
          super().__init__(title=title)
          self.search_results = search_results

       def get_info(self) -> str:
          return "\n".join(self.search_results)
```

**将上下文提供者注册到代理**：

```python
## 使用动态数据初始化上下文提供者
search_results_provider = SearchResultsProvider(
      title="搜索结果",
      search_results=["结果 1", "结果 2", "结果 3"]
)   

## 将上下文提供者注册到代理  
agent.register_context_provider("search_results", search_results_provider)
```

这使得您的代理能够在其系统提示中包含动态数据，如搜索结果，从而根据最新信息增强其响应。

## 链接模式和代理

Atomic Agents 通过对齐它们的输入和输出模式来简化代理和工具的链接。这个设计促进了模块化和可重用性。

### 示例：为不同搜索提供者生成查询

假设您有一个生成搜索查询的代理，并且您希望将这些查询与不同的搜索工具一起使用。通过将代理的输出模式与搜索工具的输入模式对齐，您可以轻松地将它们串联或在提供者之间切换。

```python
import instructor
import openai
from pydantic import Field
from atomic_agents.agents.base_agent import BaseIOSchema, BaseAgent, BaseAgentConfig
from atomic_agents.lib.components.system_prompt_generator import SystemPromptGenerator

## Import the search tool
from web_search_agent.tools.searxng_search import SearxNGSearchTool
class QueryAgentInputSchema(BaseIOSchema):
    """Input schema for the QueryAgent."""
    instruction: str = Field(..., description="Instruction to generate search queries for.")
    num_queries: int = Field(..., description="Number of queries to generate.")


## Initialize the query agent
query_agent = BaseAgent(
    BaseAgentConfig(
        client=instructor.from_openai(openai.OpenAI()),
        model="gpt-4",
        system_prompt_generator=SystemPromptGenerator(
            background=[
                "You are an intelligent query generation expert.",
                "Your task is to generate diverse and relevant queries based on a given instruction."
            ],
            steps=[
                "Receive the instruction and the number of queries.",
                "Generate the queries in JSON format."
            ],
            output_instructions=[
                "Ensure each query is unique and relevant.",
                "Provide the queries in the expected schema."
            ],
        ),
        input_schema=QueryAgentInputSchema,
        output_schema=SearxNGSearchTool.input_schema,  # Align output schema
    )
)
```

**模块化**：通过将`query_agent`的`output_schema`设置为与`SearxNGSearchTool`的`input_schema`匹配，您可以直接将代理的输出用作工具的输入。

**可切换性**：要切换到不同的搜索提供者，导入另一个搜索工具并更新`output_schema`：

```python
## Import a different search tool
from web_search_agent.tools.another_search import AnotherSearchTool

## Update the output schema
query_agent.config.output_schema = AnotherSearchTool.input_schema
```

## 示例：构建一个简单的 AI 代理

现在我们已经介绍了基础知识，让我们使用 Atomic Agents 构建一个简单的 AI 代理，并探讨它的内部工作原理。

## 第一步：安装

首先，安装必要的软件包：

```python
pip install atomic-agents openai instructor
```

## 步骤 2：导入组件

导入必要的组件：

```python
import os
from atomic_agents.agents.base_agent import BaseAgent, BaseAgentConfig, BaseIOSchema
from atomic_agents.lib.components.system_prompt_generator import SystemPromptGenerator
from atomic_agents.lib.components.agent_memory import AgentMemory
from pydantic import Field
import instructor
import openai
```

## 步骤 3：定义自定义输出模式

```python
class CustomOutputSchema(BaseIOSchema):
    chat_message: str = Field(..., description="The chat message from the agent.")
    suggested_questions: List[str] = Field(..., description="Suggested follow-up questions.")
```

## 步骤 4：设置系统提示

```python
system_prompt_generator = SystemPromptGenerator(
    background=["这个助手知识渊博、乐于助人，并建议后续问题。"],
    steps=[
        "分析用户的输入，以理解上下文和意图。",
        "制定相关且信息丰富的回应。",
        "为用户生成 3 个建议的后续问题。"
    ],
    output_instructions=[
        "对用户查询提供清晰简洁的信息。",
        "在每个回应的结尾提供 3 个与用户相关的建议问题。"
    ]
)
```

## 第5步：初始化代理

```python
## Initialize memory (optional)
memory = AgentMemory()

## Initialize the agent
agent = BaseAgent(
    config=BaseAgentConfig(
        client=instructor.from_openai(openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))),
        model="gpt-4o-mini",
        system_prompt_generator=system_prompt_generator,
        memory=memory,
        output_schema=CustomOutputSchema
    )
)
```

## 第6步：使用代理

```python
user_input = "Can you explain the benefits of using Atomic Agents?"
response = agent.run(agent.input_schema(chat_message=user_input))
print(f"Agent: {response.chat_message}")
print("Suggested questions:")
for question in response.suggested_questions:
    print(f"- {question}")
```

## 幕后发生了什么？

* **System Prompt**: 定义代理的行为并指导LLM。
* **Input Schema**: 验证用户的输入。
* **Output Schema**: 确保代理的响应符合预期格式。
* **Memory**: 记录对话历史。

## 结论

Atomic Agents 1\.0 为 AI 代理开发带来了模块化、控制和灵活性。随着 Atomic Assembler CLI 的引入以及上下文提供者和模式链等功能，构建复杂的 AI 应用程序变得前所未有的简单。

无论您是希望构建 AI 驱动工具的开发人员，还是希望自动化复杂任务的企业，Atomic Agents 都提供了创建可靠且易于维护的 AI 系统的基础构件。

## 今天开始

* **GitHub 仓库**: [BrainBlend\-AI/atomic\-agents](https://github.com/BrainBlend-AI/atomic-agents)
* **API 文档**: [Atomic Agents API 文档](https://brainblend-ai.github.io/atomic-agents/)
* **示例目录**: [Atomic 示例](https://github.com/BrainBlend-AI/atomic-agents/tree/main/atomic-examples)


