---
title: "Mastering CrewAI: Chapter 6 — Memory Basics | by Okan Yenigün | Jan, 2025 | Medium"
meta_title: "Mastering CrewAI: Chapter 6 — Memory Basics | by Okan Yenigün | Jan, 2025 | Medium"
description: "In Chapter 6 of Mastering CrewAI, the memory system is outlined, emphasizing its role in enhancing AI agents capabilities. It includes Short-Term Memory for recent interactions, Long-Term Memory for accumulated knowledge, Entity Memory for organizing information about entities, Contextual Memory for maintaining interaction context, and User Memory for personalizing experiences. The chapter also provides code examples for enabling and customizing memory features in CrewAI, highlighting the importance of these components in improving contextual awareness, experience accumulation, and entity understanding."
date: 2025-01-08T23:01:04Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*AH1CDtmmIVIO437y5dxkMw.jpeg"
categories: ["Programming", "Machine Learning", "Natural Language Processing"]
author: "Rifx.Online"
tags: ["memory", "short-term", "long-term", "entity", "contextual"]
draft: False

---





### Memory Types in CrewAI



In CrewAI, the memory system enhances AI agents by enabling them to remember, reason, and learn from past interactions.

Previous Chapter:

This system comprises several key components:

* **Short\-Term Memory**: This component temporarily stores recent interactions and outcomes, allowing agents to recall relevant information during ongoing tasks. For instance, it helps maintain coherence in conversations by recalling what has just been discussed. Uses RAG.
* **Long\-Term Memory**: It serves as a repository for valuable insights and learnings from past interactions. It enables agents to build and refine their knowledge over time, improving decision\-making processes based on historical data
* **Entity Memory**: This type captures and organizes information about entities (such as people, places, and concepts) encountered during tasks. It facilitates a deeper understanding and relationship mapping among these entities. Uses RAG.
* **Contextual Memory**: It integrates Short\-Term, Long\-Term, and Entity Memory to maintain the context of interactions. This ensures that agents can provide coherent and relevant responses throughout a conversation or task sequence.
* **User Memory**: It stores user\-specific information and preferences, enhancing personalization and user experience.

By leveraging these memory components, CrewAI agents achieve:

* **Contextual Awareness**: Maintaining context over a conversation or task sequence leads to more coherent and relevant responses.
* **Experience Accumulation**: Learning from past actions improves future decision\-making and problem\-solving.
* **Entity Understanding**: Recognizing and remembering key entities enhances the ability to process and interact with complex information.

Memory is set to `False` by default. We need to set `memory=True` in the `crew` function.


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
We can also customize which memory that we will use.


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
These components form the memory system in the Crew AI. Each serves a specific purpose. To understand how they work and distinguish their roles, we should conduct example cases and projects to observe what happens under the hood. Later in this series, their roles will be better understood.


### Read More


### Sources

<https://docs.crewai.com/concepts/memory>

[https://www.youtube.com/watch?v\=\-hHplC\_gcSE](https://www.youtube.com/watch?v=-hHplC_gcSE)

[https://www.youtube.com/watch?v\=HGYrOxkLDnY](https://www.youtube.com/watch?v=HGYrOxkLDnY)


