---
title: "利用长期持久内存和原子代理打造更智能的人工智能代理"
meta_title: "利用长期持久内存和原子代理打造更智能的人工智能代理"
description: "本文探讨了如何构建一个具有长期持久记忆的AI助手，使用了Atomic Agents框架和ChromaDB作为向量存储。该系统通过内存模型、存储与检索工具、上下文提供者以及记忆形成和聊天代理等组件，展示了如何实现个性化的对话体验。每种内存类型被设计为存储特定信息，以便在对话中利用这些记忆来提升助手的响应能力。整体架构模块化，易于扩展，能够支持未来的功能增强和自定义需求。完整代码可在GitHub上获取。"
date: 2024-12-19T21:59:06Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*o1Bi44yFgOzSM8cTaErfug.png"
categories: ["Programming", "Machine Learning", "Natural Language Processing"]
author: "Rifx.Online"
tags: ["Atomic", "ChromaDB", "memory", "agents", "modular"]
draft: False

---



任何 AI 助手中最有用的功能之一无疑是拥有 **持久的长期记忆**。无论目标是了解用户更多信息、根据用户偏好调整 AI 的行为，还是记住重要事件，为您的 AI 助手 / 代理 / … 提供某种形式的 **长期持久记忆存储** 是实现这一目标的核心需求之一。

**在我们深入之前：**

* 我们将使用 [***Atomic Agents***](https://github.com/BrainBlend-AI/atomic-agents) 来构建实际的代理，这是一个令人惊叹的以开发者为中心的框架，**极大简化** 和 **优化** **代理 AI 开发**。虽然本文将独立成篇，但如果您想先了解 *Atomic Agents* 的介绍，***请查看这篇文章*** [***或查看一些示例！***](https://github.com/BrainBlend-AI/atomic-agents/tree/main/atomic-examples)
* 对于向量存储，我将使用 [***ChromaDB***](https://www.trychroma.com/)，但您完全可以将其调整为使用您想要的任何向量数据库，因为我们并没有使用 *ChromaDB* 中仅可用的任何特殊功能。
* **这不是一步一步的教程**，而是一个项目分解，以便能够专注于重要内容，而不是让您 **陷入** “现在让我们安装包 X”，“现在让我们导入它”等等。

完整项目 [可以在 GitHub 上找到](https://github.com/KennyVaneetvelde/persistent-memory-agent-example)，所以 **随意获取**，根据 README 指示安装其依赖项，**试用一下**以熟悉它，并在本指南中跟随！

不再赘述，**我们开始吧！**

## 目标

这个例子**绝不是**试图成为**长期记忆**的所有实现方式的**完整实现**。事实上，它**相当简单**。但是，**与在***Atomic Agents*框架**中的任何事物一样，它旨在**易于扩展**并根据您的需求进行修改。

请看下面的示例交互，演示**新记忆的形成**，以及助手**如何通过之前的互动已经知道我的名字**。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*qpq_ptuLcx9Oj3dzPVJ0zA.png)

## 安装与设置

在我们深入实现之前，**让我们设置开发环境**。这个项目使用 *Poetry* 进行依赖管理，使得入门变得简单。

**克隆仓库**：

```python
git clone https://github.com/KennyVaneetvelde/persistent-memory-agent-example
cd persistent-memory-agent-example
```

**安装 Poetry**（如果您还没有安装）：

```python
pipx install poetry
```

**安装依赖**：

```python
poetry install
```

这将安装所有必需的包：

```python
[tool.poetry.dependencies]
python = "^3.10"
atomic-agents = "^1.0.15"
rich = "^13.9.4"
instructor = "^1.6.4"
openai = "^1.54.4"
pydantic = "^2.9.2"
chromadb = "^0.5.18"
numpy = "^2.1.3"
```

**设置环境变量**：在项目根目录创建一个 `.env` 文件，并填写您的 OpenAI API 密钥：

```python
OPENAI_API_KEY=your_api_key_here
```

这样一来，您就可以开始使用了！您可以通过运行 ***chat\_with\_memory*** 文件夹中的 ***main.py*** 来运行示例并感受其工作原理。

太好了！现在我们可以继续进行 **详细解析。**

## 概述

该项目有几个**关键组件**构成了所有内容：

* **内存模型**：定义我们想要存储的不同类型的内存
* **内存工具**：使用*ChromaDB*作为我们的向量数据库，我们有一个内存查询工具和一个内存存储工具
* **上下文提供者**：将相关的内存注入到代理对话中
* **内存形成代理**：一个推理并决定记住什么的代理
* **聊天代理**：使用这些记忆的主要对话代理。这是用户将进行对话的代理。

## 内存模型

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ghyf3rEpxkSniL55bkks3A.png)

内存系统使用**专用内存类型**来处理不同种类的信息。以下是完整的实现：

```python
from typing import Literal
from pydantic import Field
from datetime import datetime, timezone
from atomic_agents.lib.base.base_io_schema import BaseIOSchema


class BaseMemory(BaseIOSchema):
    """所有内存类型的基类"""
    content: str = Field(..., description="内存的内容")
    timestamp: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat(),
        description="内存创建时的ISO格式时间戳",
    )

class CoreBioMemory(BaseMemory):
    """关于用户的核心传记信息"""
    memory_type: Literal["core_bio"] = Field(default="core_bio")

class EventMemory(BaseMemory):
    """关于重要事件或经历的信息"""
    memory_type: Literal["event"] = Field(default="event")

class WorkProjectMemory(BaseMemory):
    """关于工作项目和任务的信息"""
    memory_type: Literal["work_project"] = Field(default="work_project")
```

每种内存类型都有特定的用途：

* **CoreBioMemory**：存储基本的用户信息（背景、偏好、特征）
* **EventMemory**：记录重要事件和经历的信息
* **WorkProjectMemory**：跟踪专业项目和成就的事实

敏锐的观察者可能已经注意到，这些类都有一个memory\_type，它只能是一个单一的值。这有什么用呢？我注意到，这并不是由于任何框架中的错误，而是**由于OpenAI本身的一个错误**，如果不指定这个`memory_type`，它只会选择第一个，在这种情况下是**CoreBioMemory**。

但是，**这并不是真正的问题**，因为像有这个内存类型这样的小事确实会**引导LLMs朝正确的方向发展**，即使它们不需要。特别是因为**你可以使用任何其他LLM提供者，而不仅仅是OpenAI**，甚至可以在本地运行。

*“我们为什么需要多种内存类型？”* 你可能会问。**这实际上是个人偏好**，你**完全可以只用一个内存类型**。但我觉得能够存储不同种类的信息是很方便的，这样如果需要的话我们可以单独查询它们，这将为代理个性化提供**更坚实的基础**，我认为。

话虽如此，你可以完全根据自己的喜好进行定制，甚至如果你真的想要的话，可以拥有10种不同的内存类型，而不必修改任何其他代码！

## 内存存储与检索

接下来，我们将实际存储我们的内存。正如我在本指南开始时提到的，**我们将使用 *ChromaDB* 作为我们的向量存储**。我不会展示实际的 *ChromaDB* 服务，因为这对于本指南来说并不是很有趣。相反，让我们来看看将使用 *ChromaDB* 服务的两个 *Atomic Agent Tools*。

现在，记住在 *Atomic Agents* 中，每个 Agent 和每个 Tool 都遵循 **输入 \-\> 处理 \-\> 输出** 的相同结构，通过使用严格的输入和输出模式。这使得轻松地将代理或工具链在一起，或者仅仅提供严格的开发指南和结构，以便遵循，正如我们在这里主要使用的那样。

### 内存存储工具

```python
from pydantic import Field

from atomic_agents.lib.base.base_tool import BaseTool, BaseToolConfig
from atomic_agents.lib.base.base_io_schema import BaseIOSchema
from chat_with_memory.services.chroma_db import ChromaDBService
from chat_with_memory.tools.memory_models import (
    BaseMemory,
    CoreBioMemory,
    EventMemory,
    WorkProjectMemory,
)


class MemoryStoreInputSchema(BaseIOSchema):
    """存储记忆的模式"""

    memory: BaseMemory = Field(..., description="要存储的记忆")


class MemoryStoreOutputSchema(BaseIOSchema):
    """记忆存储输出的模式"""

    memory: BaseMemory = Field(..., description="带有生成ID的存储记忆")


class MemoryStoreConfig(BaseToolConfig):
    """MemoryStoreTool的配置"""

    collection_name: str = Field(
        default="chat_memories", description="要使用的ChromaDB集合名称"
    )
    persist_directory: str = Field(
        default="./chroma_db", description="用于持久化ChromaDB数据的目录"
    )


class MemoryStoreTool(BaseTool):
    """使用ChromaDB存储聊天记忆的工具"""

    input_schema = MemoryStoreInputSchema
    output_schema = MemoryStoreOutputSchema

    def __init__(self, config: MemoryStoreConfig = MemoryStoreConfig()):
        super().__init__(config)
        self.db_service = ChromaDBService(
            collection_name=config.collection_name,
            persist_directory=config.persist_directory,
        )

    def run(self, params: MemoryStoreInputSchema) -> MemoryStoreOutputSchema:
        """在ChromaDB中存储新记忆"""
        memory = params.memory

        # 将记忆类型映射到其存储表示
        memory_type_mapping = {
            CoreBioMemory: "core_memory",
            EventMemory: "event_memory",
            WorkProjectMemory: "work_project_memory",
        }

        # 获取特定的记忆类型
        memory_type = memory_type_mapping.get(type(memory), "base_memory")

        # 基础元数据，所有值均为字符串
        metadata = {
            "timestamp": memory.timestamp,
            "memory_type": memory_type,
        }

        self.db_service.add_documents(
            documents=[memory.content], metadatas=[metadata]
        )

        return MemoryStoreOutputSchema(memory=memory.model_copy())
```

### 内存检索工具

```python
from typing import List, Optional, Literal, Union
from pydantic import Field
from datetime import datetime
import json

from atomic_agents.lib.base.base_tool import BaseTool, BaseToolConfig
from atomic_agents.lib.base.base_io_schema import BaseIOSchema
from chat_with_memory.services.chroma_db import ChromaDBService, QueryResult
from chat_with_memory.tools.memory_models import (
    CoreBioMemory,
    EventMemory,
    WorkProjectMemory,
    BaseMemory,
)


class MemoryQueryInputSchema(BaseIOSchema):
    """查询记忆的模式"""

    query: str = Field(..., description="用于查找相关记忆的查询字符串")
    n_results: Optional[int] = Field(
        default=2, description="要检索的相似记忆数量"
    )
    memory_type: Optional[str] = Field(
        default=None, description="可选的记忆类型，用于过滤记忆"
    )


class MemoryQueryOutputSchema(BaseIOSchema):
    """记忆查询输出的模式"""

    memories: List[BaseMemory] = Field(
        default_factory=list, description="检索到的记忆"
    )


class MemoryQueryConfig(BaseToolConfig):
    """MemoryQueryTool的配置"""

    collection_name: str = Field(
        default="chat_memories", description="要使用的ChromaDB集合名称"
    )
    persist_directory: str = Field(
        default="./chroma_db", description="持久化ChromaDB数据的目录"
    )


class MemoryQueryTool(BaseTool):
    """使用ChromaDB查询聊天记忆的工具"""

    input_schema = MemoryQueryInputSchema
    output_schema = MemoryQueryOutputSchema

    def __init__(self, config: MemoryQueryConfig = MemoryQueryConfig()):
        super().__init__(config)
        self.db_service = ChromaDBService(
            collection_name=config.collection_name,
            persist_directory=config.persist_directory,
        )

    def run(self, params: MemoryQueryInputSchema) -> MemoryQueryOutputSchema:
        """使用语义搜索查询相关记忆"""
        where_filter = None
        if params.memory_type:
            # 将查询类型映射到存储类型
            type_mapping = {
                "core": "core_memory",
                "event": "event_memory",
                "work_project": "work_project_memory",
            }
            memory_type = type_mapping[params.memory_type]
            where_filter = {"memory_type": memory_type}

        try:
            results: QueryResult = self.db_service.query(
                query_text=params.query,
                n_results=params.n_results,
                where=where_filter,
            )

            # 将存储类型映射回记忆类
            memory_class_mapping = {
                "core_memory": CoreBioMemory,
                "event_memory": EventMemory,
                "work_project_memory": WorkProjectMemory,
                "base_memory": BaseMemory,
            }

            memories = []
            if results["documents"]:
                for doc, meta, id_ in zip(
                    results["documents"], results["metadatas"], results["ids"]
                ):
                    memory_type = meta.get("memory_type", "base_memory")
                    memory_class = memory_class_mapping[memory_type]

                    base_data = {
                        "id": id_,
                        "content": doc,
                        "timestamp": meta["timestamp"],
                    }
                    memories.append(memory_class(**base_data))

            return MemoryQueryOutputSchema(memories=memories)
        except Exception as e:
            print(f"查询错误: {str(e)}")
            return MemoryQueryOutputSchema(memories=[])
```

这些工具一起提供：

* **类型安全的记忆存储**：每个记忆都以其特定类型和元数据存储
* **灵活的查询**：按内容相似性搜索或按记忆类型过滤
* **自动类型转换**：结果会自动转换回适当的记忆类型

正如您所看到的，它们都有一个**输入模式**、一个**输出模式**，主要工具类**始终**具有一个***run***方法，该方法接受该输入模式并输出输出模式。

## 上下文提供者

那么我们如何将这些记忆导入到智能体中呢？**这就是 *Atomic Agents 的上下文提供者* 发挥作用的地方**

*Atomic Agents* 中的上下文提供者是将（实时）信息注入系统提示的一种简单而模块化的方法。以下是我们如何实现它们的：

```python
from atomic_agents.lib.components.system_prompt_generator import SystemPromptContextProviderBase

class MemoryContextProvider(SystemPromptContextProviderBase):
    """提供相关记忆作为智能体的上下文"""
    def __init__(self, memories: List[BaseMemory]):
        super().__init__(title="相关记忆")
        self.memories = memories
    def get_info(self) -> str:
        if not self.memories:
            return "未找到相关记忆。"
      
        memory_strings = []
        for memory in self.memories:
            memory_strings.append(f"- {memory.content} ({memory.memory_type})")
      
        return "之前的记忆:\n" + "\n".join(memory_strings)
```

每个上下文提供者都有一个 **get\_info()** 方法，该方法返回一个字符串，其中包含应添加到系统提示的信息。在这种情况下，它将格式化记忆。该方法的输出将类似于以下内容：

```python
之前的记忆:
- 用户流利地讲葡萄牙语、日语和英语 (core_memory)
- 用户拥有麻省理工学院量子计算的博士学位 (event_memory)
- 用户自此一直从事量子密码学工作 (work_project_memory)
```

好的，既然这些基本构建块已经处理完毕，接下来要做的就是创建实际的智能体！

## 记忆形成代理

本文最重要的代理是 **记忆形成代理**，它将查看当前对话、现有记忆，并输出 **基于此可以形成的记忆。**

```python
import instructor
from openai import OpenAI
import os
from typing import List, Literal, Optional, Union, Dict, Any
from pydantic import Field
from datetime import datetime, timezone

from atomic_agents.agents.base_agent import BaseAgent, BaseAgentConfig, BaseIOSchema
from atomic_agents.lib.components.system_prompt_generator import SystemPromptGenerator
from atomic_agents.lib.components.agent_memory import AgentMemory
from chat_with_memory.tools.memory_models import (
    BaseMemory,
    CoreBioMemory,
    EventMemory,
    WorkProjectMemory,
)
from chat_with_memory.tools.memory_store_tool import (
    MemoryStoreTool,
    MemoryStoreInputSchema,
)
from chat_with_memory.tools.memory_query_tool import (
    MemoryQueryTool,
    MemoryQueryInputSchema,
)


class MemoryFormationInputSchema(BaseIOSchema):
    """记忆形成代理的输入模式。"""

    last_user_msg: str = Field(
        ...,
        description="对话中用户的最后一条消息",
    )
    last_assistant_msg: str = Field(
        ...,
        description="对话中助手的最后一条消息",
    )


class MemoryFormationOutputSchema(BaseIOSchema):
    """记忆形成代理的输出模式，表示助手关于用户的记忆。"""

    reasoning: List[str] = Field(
        ...,
        description="关于从可能的记忆类型列表中选择哪种记忆类型及其原因的推理",
        min_length=3,
        max_length=5,
    )
    memories: Optional[List[CoreBioMemory | EventMemory | WorkProjectMemory]] = Field(
        ...,
        description="助手关于用户形成的记忆，如果找到任何相关内容。",
    )


## 使用更具选择性的标准初始化系统提示生成器
memory_formation_prompt = SystemPromptGenerator(
    background=[
        "您是一种专门识别和保留用户真正重要的、长期相关信息的人工智能。",
        "您专注于提取在较长时间内仍然相关和有用的信息。",
        "您仔细过滤掉临时状态、琐碎事件和时间限制的信息。",
        "您仔细过滤掉任何已存在于记忆库中的记忆。",
        "您理解临时相关细节与永久有用知识之间的区别。",
    ],
    steps=[
        "分析用户的消息和助手的消息以获取上下文",
        "考虑对话流程以更好地理解信息的重要性",
        "寻找符合以下标准的信息：",
        "  - 永久或长期相关性（例如，特征、背景、重要关系）",
        "  - 重要的传记细节（例如，健康状况、文化背景）",
        "  - 影响用户背景的重大生活事件",
        "  - 未来几个月或几年内有价值的信息",
        "过滤掉以下信息：",
        "  - 临时或时间限制的信息",
        "  - 琐碎的日常事件",
        "  - 当前活动或状态",
        "  - 行政或日常事务",
        "  - 已存在于记忆中的内容",
        "对于每一条真正重要的信息：",
        "  - 以保留长期相关性的方式进行表述",
        "  - 选择适当的记忆类型",
        "  - 清晰且永恒地表达",
    ],
    output_instructions=[
        "仅为具有持久意义的信息创建记忆",
        "不要创建已在记忆库中的内容的记忆",
        "格式化记忆，以便无论何时访问都相关",
        "关注永久特征、重要关系和重大事件",
        "排除临时状态和琐碎事件",
        "如有疑问，仅存储在未来对话中有价值的信息",
    ],
)

## 创建代理配置
memory_formation_config = BaseAgentConfig(
    client=instructor.from_openai(OpenAI(api_key=os.getenv("OPENAI_API_KEY"))),
    model="gpt-4o-mini",
    memory=AgentMemory(max_messages=10),
    system_prompt_generator=memory_formation_prompt,
    input_schema=MemoryFormationInputSchema,
    output_schema=MemoryFormationOutputSchema,
)

## 创建记忆形成代理
memory_formation_agent = BaseAgent(memory_formation_config)
```

## 聊天代理

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*CRESY2QT04Rpiw-E1sPr3w.png)

现在我们已经准备好内存形成代理，我们需要一个实际使用这些记忆与用户进行有意义对话的代理。这就是我们的聊天代理的作用。

聊天代理旨在进行对话，同时利用存储的记忆提供个性化和上下文相关的响应。以下是它的实现方式：

```python
from atomic_agents.agents.base_agent import BaseAgent, BaseAgentConfig, BaseIOSchema
from atomic_agents.lib.components.system_prompt_generator import SystemPromptGenerator
from atomic_agents.lib.components.agent_memory import AgentMemory
from pydantic import Field

class ChatAgentInputSchema(BaseIOSchema):
    """聊天代理的输入模式。"""
    message: str = Field(..., description="用户的消息")
class ChatAgentOutputSchema(BaseIOSchema):
    """聊天代理的输出模式。"""
    response: str = Field(..., description="助手对用户的响应")
## 初始化聊天代理的系统提示生成器
chat_prompt = SystemPromptGenerator(
    background=[
        "您是一个友好且乐于助人的AI助手，拥有关于用户的长期记忆。",
        "您利用这些记忆提供个性化和上下文相关的响应。",
        "您保持自然的对话语气，同时保持专业和尊重。",
    ],
    steps=[
        "回顾与用户相关的任何记忆",
        "考虑当前对话的上下文",
        "自然地整合相关记忆来制定响应",
        "确保响应有帮助并推动对话向前发展",
    ],
    output_instructions=[
        "保持响应简洁但信息丰富",
        "像人类朋友一样自然地引用记忆",
        "在对话中保持一致的人格",
        "在尊重界限的同时提供帮助",
    ],
)
## 创建聊天代理配置
chat_agent_config = BaseAgentConfig(
    client=instructor.from_openai(OpenAI(api_key=os.getenv("OPENAI_API_KEY"))),
    model="gpt-4o-mini",
    memory=AgentMemory(max_messages=10),
    system_prompt_generator=chat_prompt,
    input_schema=ChatAgentInputSchema,
    output_schema=ChatAgentOutputSchema,
)
## 创建聊天代理
chat_agent = BaseAgent(chat_agent_config)
```

与内存形成代理相比，聊天代理相对简单，因为它的主要任务是在对话中自然地融入上下文提供者提供的记忆。

## 整合所有内容

现在我们已经准备好了所有组件，让我们看看它们在主应用程序中是如何协同工作的。以下是将所有内容联系在一起的核心逻辑：

```python
def main() -> None:
    console = Console()
    store_tool = MemoryStoreTool()

    # Initialize tools and context providers
    memory_context_provider = MemoryContextProvider(
        title="Existing Memories",
    )
    current_date_context_provider = CurrentDateContextProvider(
        title="Current Date",
    )
    # Register context providers with agents
    chat_agent.register_context_provider("memory", memory_context_provider)
    chat_agent.register_context_provider("current_date", current_date_context_provider)
    memory_formation_agent.register_context_provider("memory", memory_context_provider)
    memory_formation_agent.register_context_provider(
        "current_date", current_date_context_provider
    )
    # Main conversation loop
    while True:
        # Get user input
        user_input = input("User: ")
        # Query relevant memories
        memory_query_tool = MemoryQueryTool()
        retrieved_memories = memory_query_tool.run(
            MemoryQueryInputSchema(query=user_input, n_results=10)
        )
        memory_context_provider.memories = retrieved_memories.memories
        # Form new memories if needed
        memory_assessment = memory_formation_agent.run(
            MemoryFormationInputSchema(
                last_user_msg=user_input,
                last_assistant_msg=last_assistant_msg
            )
        )
        # Store any new memories
        if memory_assessment.memories:
            for memory in memory_assessment.memories:
                store_tool.run(MemoryStoreInputSchema(memory=memory))
        # Generate chat response
        chat_response = chat_agent.run(ChatAgentInputSchema(message=user_input))
        last_assistant_msg = chat_response.response
        print(f"Assistant: {chat_response.response}")
```

主循环协调以下流程：

1. 获取用户输入
2. 根据输入查询相关记忆
3. 使用检索到的记忆更新记忆上下文提供者
4. 运行记忆形成代理以识别和存储新记忆
5. 使用聊天代理生成响应
6. 向用户显示响应

**这创造了无缝的体验**，使助手能够**记住过去的互动并形成新记忆**，同时保持自然的对话。

## 结论

我们使用 *Atomic Agents* 构建了一个具有持久记忆能力的完整 AI 助手系统。该系统展示了：

* **模块化设计**：每个组件（记忆存储、形成、聊天）都是独立的，易于修改
* **类型安全**：所有交互通过 Pydantic 模型实现类型安全
* **持久存储**：记忆通过 ChromaDB 在对话之间持久存在
* **自然交互**：聊天代理自然地将记忆融入响应中

该实现提供了一个坚实的基础，您可以在此基础上进行构建。一些潜在的增强功能可能包括：

* **添加更多记忆类型**以处理不同种类的信息
* **实现记忆衰减**或相关性评分
* **实现记忆验证**或纠正机制

请记住，**这只是实现 AI 助手中持久记忆的一种方式**。*Atomic Agents* 的模块化特性使得修改和扩展该实现以满足您的特定需求变得简单。

**完整代码可在 [GitHub 仓库](https://github.com/KennyVaneetvelde/persistent-memory-agent-example) 中获取，欢迎您探索、实验并在此基础上进行构建！**


