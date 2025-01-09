---
title: "掌握 CrewAI：第 6 章--记忆基础 | 作者 Okan Yenigün | 2025 年 1 月 | 中"
meta_title: "掌握 CrewAI：第 6 章--记忆基础 | 作者 Okan Yenigün | 2025 年 1 月 | 中"
description: "CrewAI的内存系统通过短期记忆、长期记忆、实体记忆、上下文记忆和用户记忆等组件增强AI代理的能力。短期记忆帮助保持对话一致性，长期记忆积累历史知识，实体记忆组织任务中的关键信息，上下文记忆整合各类记忆以保持互动的相关性，而用户记忆则提升个性化体验。默认情况下内存设置为`False`，可通过`crew`函数启用并自定义内存类型。"
date: 2025-01-08T23:01:04Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*AH1CDtmmIVIO437y5dxkMw.jpeg"
categories: ["Programming", "Machine Learning", "Natural Language Processing"]
author: "Rifx.Online"
tags: ["memory", "short-term", "long-term", "entity", "contextual"]
draft: False

---



### CrewAI中的内存类型



在CrewAI中，内存系统通过使AI代理能够记住、推理和从过去的互动中学习来增强其能力。

前一章：

该系统由几个关键组件组成：

* **短期记忆**：该组件暂时存储最近的互动和结果，使代理能够在进行中的任务中回忆相关信息。例如，它有助于通过回忆刚刚讨论过的内容来保持对话的一致性。使用RAG。
* **长期记忆**：它作为过去互动中有价值的见解和学习的存储库。它使代理能够随着时间的推移建立和完善其知识，基于历史数据改善决策过程。
* **实体记忆**：这种类型捕获并组织在任务中遇到的实体（如人、地点和概念）信息。它促进对这些实体之间的更深入理解和关系映射。使用RAG。
* **上下文记忆**：它整合短期记忆、长期记忆和实体记忆，以保持互动的上下文。这确保代理能够在整个对话或任务序列中提供一致且相关的响应。
* **用户记忆**：它存储用户特定的信息和偏好，增强个性化和用户体验。

通过利用这些记忆组件，CrewAI代理实现：

* **上下文意识**：在对话或任务序列中保持上下文会导致更一致和相关的响应。
* **经验积累**：从过去的行动中学习改善未来的决策和问题解决能力。
* **实体理解**：识别和记住关键实体增强了处理和互动复杂信息的能力。

内存默认设置为`False`。我们需要在`crew`函数中设置`memory=True`。

```python
## crew.py

@crew
 def crew(self) -> Crew:
  return Crew(
   agents=self.agents, 
   tasks=self.tasks,
   process=Process.sequential,
   verbose=True,
   memory=True,
  )
```
我们还可以自定义将使用的内存类型。

```python
## crew.py

from crewai.memory.short_term.short_term_memory import ShortTermMemory
from crewai.memory.long_term.long_term_memory import LongTermMemory
from crewai.memory.entity.entity_memory import EntityMemory
from crewai.memory.storage.rag_storage import RAGStorage
from crewai.memory.storage.ltm_sqlite_storage import LTMSQLiteStorage


 @crew
 def crew(self) -> Crew:
  return Crew(
   agents=self.agents, 
   tasks=self.tasks,
   process=Process.sequential,
   verbose=True,
   memory=True,
   long_term_memory=LongTermMemory(
    storage=LTMSQLiteStorage(
     db_path="long_term_memory_storage.db"
    )
   ),
   short_term_memory=ShortTermMemory(
    storage=RAGStorage(
     type="short_term",
     allow_reset=True,
     embedder_config={
      "provider": "openai",  # Specify the provider explicitly
      "config":{
       "model": "text-embedding-ada-002",  # Specify the model
       "api_key": "", 
      }
     },
     crew=self,  # Pass crew agents if needed
     path="short_term",
    ),
   ),
   entity_memory=EntityMemory(
   storage=RAGStorage(
    type="entities",
    allow_reset=True,
    embedder_config={
     "provider": "openai",  # Specify the provider explicitly
     "config":{
      "model": "text-embedding-ada-002",  # Specify the model
      "api_key": "sk-", 
     }
    },
    crew=self,  # Pass crew agents if needed
    path="entity",
   ),
  ),
  )
```
这些组件构成了Crew AI中的内存系统。每个组件都有其特定的目的。为了理解它们如何工作并区分它们的角色，我们应该进行示例案例和项目，以观察其内部运作。稍后在本系列中，将更好地理解它们的角色。

### 了解更多

### 资源

<https://docs.crewai.com/concepts/memory>

[https://www.youtube.com/watch?v\=\-hHplC\_gcSE](https://www.youtube.com/watch?v=-hHplC_gcSE)

[https://www.youtube.com/watch?v\=HGYrOxkLDnY](https://www.youtube.com/watch?v=HGYrOxkLDnY)

