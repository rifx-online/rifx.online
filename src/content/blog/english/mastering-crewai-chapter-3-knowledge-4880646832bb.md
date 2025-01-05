---
title: "Mastering CrewAI: Chapter 3— Knowledge"
meta_title: "Mastering CrewAI: Chapter 3— Knowledge"
description: "Chapter 3 of Mastering CrewAI discusses the integration of knowledge in AI agents, allowing them to access external information sources such as text files and structured data. It demonstrates how to create a project that utilizes a knowledge source to answer user queries, exemplified by an agent that provides personal information about a user named John. The chapter also covers customizing knowledge sources, chunking content, and creating new knowledge sources using APIs. The benefits of incorporating knowledge include improved decision-making, context maintenance, and factual grounding in responses."
date: 2025-01-05T02:27:04Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*38D5ZyX6EzjY1QKm16Bl_g.jpeg"
categories: ["Programming", "Machine Learning", "Natural Language Processing"]
author: "Rifx.Online"
tags: ["knowledge", "integration", "APIs", "chunking", "customization"]
draft: False

---





### Knowledge — CrewAI



In CrewAI, “knowledge” is the system that allows AI agents to access and utilize external information sources during their tasks. We can think of it as giving our agents a reference library they can consult while working.

* Text Sources: Raw strings, text files, pdfs, …
* Structured Data: CSV, excel, json, …

Previous Chapter:

Let’s create a new project to use “knowledge” (*openai \>\> gpt\-4o\-mini*).


```python
crewai create crew knowledge_example
```
In this example, the agent utilizes the provided knowledge source to answer questions about the user, demonstrating how external information can be integrated into an agent’s decision\-making process.


```python
## crew.py

from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.knowledge.source.string_knowledge_source import StringKnowledgeSource
from dotenv import load_dotenv

load_dotenv()


content = "Users name is John. He is 30 years old and lives in San Francisco."
string_source = StringKnowledgeSource(
    content=content,
    metadata={"source": "user_profile"}
)


@CrewBase
class KnowledgeExample():
 
 agents_config = 'config/agents.yaml'
 tasks_config = 'config/tasks.yaml'

 @agent
 def john(self) -> Agent:
  return Agent(
   config=self.agents_config['john'],
   verbose=True
  )

 @task
 def john_task(self) -> Task:
  return Task(
   config=self.tasks_config['john_task'],
  )

 @crew
 def crew(self) -> Crew:

  return Crew(
   agents=self.agents, # Automatically created by the @agent decorator
   tasks=self.tasks, # Automatically created by the @task decorator
   process=Process.sequential,
   verbose=True,
   knowledge_sources=[string_source]
  )
```
We used `StringKnowledgeSource` to pass some string\-based knowledge and set it in the `Crew` by assigning `knowledge_sources = [string_source]`.


```python
from crewai.knowledge.source.string_knowledge_source import StringKnowledgeSource

...

content = "Users name is John. He is 30 years old and lives in San Francisco."
string_source = StringKnowledgeSource(
    content=content,
 metadata={"source": "user_profile"}
)

...

    return Crew(
       agents=self.agents, 
       tasks=self.tasks, 
       process=Process.sequential,
       verbose=True,
       knowledge_sources=[string_source]
      )
```
The rest of the Crew code:


```python
## main.py
import sys
import warnings

from crew import KnowledgeExample

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

def run():
    """
    Run the crew.
    """
    inputs = {
        'question': 'What city does John live in and how old is he?'
    }
    KnowledgeExample().crew().kickoff(inputs=inputs)

run()
```

```python
// agents.yaml

john:
  role: >
    About User
  goal: >
    You know everything about the user.
  backstory: >
    You are a master at understanding people and their preferences.
```

```python
// tasks.yaml

john_task:
  description: >
    Answer the following questions about the user: {question}
  expected_output: >
    An answer to the question.
  agent: john
```
Run the crew:


```python
python knowledge_example/src/knowledge_example/main.py
```
Output:


```python
venv) ➜  crewai-demo python knowledge_example/src/knowledge_example/main.py
## Agent: About User
### Task: Answer the following questions about the user: What city does John live in and how old is he?



## Agent: About User
### Final Answer: 
John lives in San Francisco and he is 30 years old.
```
We can also customize the configuration when passing the knowledge.


```python
## CHUNKING

knowledge_source = StringKnowledgeSource(
    content="Long content...",
    chunk_size=4000,     # Characters per chunk (default)
    chunk_overlap=200    # Overlap between chunks (default)
)


## EMBEDDINGS

...
string_source = StringKnowledgeSource(
    content="Users name is John. He is 30 years old and lives in San Francisco.",
)
crew = Crew(
    ...
    knowledge_sources=[string_source],
    embedder={
        "provider": "openai",
        "config": {"model": "text-embedding-3-small"},
    },
)
```
To clear the knowledge in Crew:


```python
crewai reset-memories --knowledge
```

### Custom Knowledge Sources

It is possible to create custom knowledge source wrappers using the `BaseKnowledgeSource` class.


```python
## knowledge.py (create a new file)

import requests
import uuid
from crewai.knowledge.source.base_knowledge_source import BaseKnowledgeSource
from pydantic import BaseModel, Field
from typing import Dict, Any


class SpaceNewsKnowledgeSource(BaseKnowledgeSource):
    """Knowledge source that fetches data from Space News API."""

    api_endpoint: str = Field(description="API endpoint URL")
    limit: int = Field(default=10, description="Number of articles to fetch")
    metadata: Dict[str, Any] = Field(default_factory=dict)

    def load_content(self) -> Dict[Any, str]:
        """Fetch and format space news articles."""
        try:
            response = requests.get(
                f"{self.api_endpoint}?limit={self.limit}"
            )
            response.raise_for_status()

            data = response.json()
            articles = data.get('results', [])

            formatted_data = self._format_articles(articles)
            return {self.api_endpoint: formatted_data}
        except Exception as e:
            raise ValueError(f"Failed to fetch space news: {str(e)}")
        
    def add(self) -> None:
        """Process and store the articles."""
        content = self.load_content()
        for _, text in content.items():
            chunks = self._chunk_text(text)
            self.chunks.extend(chunks)
            chunks_metadata = [
                {
                    "chunk_id": str(uuid.uuid4()),
                    "source": self.api_endpoint,
                    "description": f"Chunk {i + 1} from API {self.api_endpoint}"
                }
                for i in range(len(chunks))
            ]

        self.save_documents(metadata=chunks_metadata)
        
    def _format_articles(self, articles: list) -> str:
        """Format articles into readable text."""
        formatted = "Space News Articles:\n\n"
        for article in articles:
            formatted += f"""
                Title: {article['title']}
                Published: {article['published_at']}
                Summary: {article['summary']}
                News Site: {article['news_site']}
                URL: {article['url']}
                -------------------"""
        return formatted
```
Here, we extended the `BaseKnowledgeSource` class by overriding the behaviors of the `load_content` and `add` methods. This implementation fetches news from an external API and summarizes the content.

The updated files:


```python
## main.py
import sys
import warnings

from crew import KnowledgeExample

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

def run():
    """
    Run the crew.
    """
    inputs = {
        # 'question': 'What city does John live in and how old is he?'
        "user_question": "What are the latest developments in space exploration?"
    }
    KnowledgeExample().crew().kickoff(inputs=inputs)

run()
```

```python
## crew.py

from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.knowledge.source.string_knowledge_source import StringKnowledgeSource
from dotenv import load_dotenv
from knowledge import SpaceNewsKnowledgeSource

load_dotenv()


## content = "Users name is John. He is 30 years old and lives in San Francisco."
## string_source = StringKnowledgeSource(
##     content=content,
##  metadata={"source": "user_profile"}
## )

recent_news = SpaceNewsKnowledgeSource(
    api_endpoint="https://api.spaceflightnewsapi.net/v4/articles",
    limit=10,
 metadata={"source": "space_news"}
)


@CrewBase
class KnowledgeExample():
 
 agents_config = 'config/agents.yaml'
 tasks_config = 'config/tasks.yaml'

 # @agent
 # def john(self) -> Agent:
 #  return Agent(
 #   config=self.agents_config['john'],
 #   verbose=True
 #  )

 @agent
 def space_analyst(self) -> Agent:
  return Agent(
   config=self.agents_config['space_analyst'],
   verbose=True,
   knowledge_sources=[recent_news],
  )

 # @task
 # def john_task(self) -> Task:
 #  return Task(
 #   config=self.tasks_config['john_task'],
 #  )
 
 @task
 def analysis_task(self) -> Task:
  return Task(
   config=self.tasks_config['analysis_task'],
  )
 
 @crew
 def crew(self) -> Crew:

  return Crew(
   agents=self.agents, # Automatically created by the @agent decorator
   tasks=self.tasks, # Automatically created by the @task decorator
   process=Process.sequential,
   verbose=True,
  )
```

```python
## agents.yaml

## john:
##   role: >
##     About User
##   goal: >
##     You know everything about the user.
##   backstory: >
##     You are a master at understanding people and their preferences.

space_analyst:
  role: >
    Space News Analyst
  goal: >
    Answer questions about space news accurately and comprehensively
  backstory: >
    You are a space industry analyst with expertise in space exploration,
    satellite technology, and space industry trends. You excel at answering questions
    about space news and providing detailed, accurate information.
```

```python
## tasks.yaml

## john_task:
##   description: >
##     Answer the following questions about the user: {question}
##   expected_output: >
##     An answer to the question.
##   agent: john

analysis_task:
  description: >
    Answer this question about space news: {user_question}
  expected_output: >
    A detailed answer based on the recent space news articles
  agent: space_analyst
```
Let’s run our updated Crew:


```python
crewai-demo python knowledge_example/src/knowledge_example/main.py
```

```python
## Agent: Space News Analyst
### Task: Answer this question about space news: What are the latest developments in space exploration?



## Agent: Space News Analyst
### Final Answer: 
The latest developments in space exploration have been significant, showcasing a variety of missions and advancements, particularly focusing on lunar, Martian, and satellite technology initiatives. 

1. **SpaceX Launch Surge**: In 2024, SpaceX has significantly accelerated global launch activity, setting a new record for the number of orbital launches. This increase is largely attributed to the company’s enhanced operational capacity and successful launch cadence, particularly through its Starlink satellite deployments. The Starlink Group 12-6 mission encapsulated this surge, wrapping up a record-breaking year for SpaceX in terms of launches (Source: SpaceNews, January 2, 2025).

2. **NASA’s Assessments for Spaceflight Health**: NASA has conducted important research regarding the health challenges faced by astronauts in space. An independent assessment focused on mitigating risks related to decompression sickness (DCS) and patent foramen ovale (PFO) during spaceflight. This research is crucial for planning long-duration missions, such as those intended for Mars exploration and potential crewed missions beyond low Earth orbit (Source: NASA, December 31, 2024).

3. **New Glenn Launch Vehicle Development**: The Blue Origin’s New Glenn rocket recently completed a vital hotfire test, validating its seven BE-4 main engines. This marked the last major testing phase before its first launch, scheduled for early 2025. This vehicle represents a new entry into the competitive space launch market, which is increasingly dominated by SpaceX (Source: Space Scout, December 31, 2024).

4. **European Space Launches**: In 2024, European launch vehicles made strides with the return of the Vega C rocket to flight and the inaugural launch of the Ariane 6 rocket. Though European nations have been striving for advancements, the year concluded without a first orbital flight aboard a commercially developed European rocket, putting added pressure on this sector to expedite technological improvements (Source: European Spaceflight, January 1, 2025).

5. **Future Astronomical Education Initiatives**: NASA has launched the Astronomy Activation Ambassadors project, aiming to enhance the engagement of students in STEM fields through improving the capabilities of science teachers. This initiative highlights the commitment to fostering educational outreach, which is essential as space exploration expands (Source: NASA, December 31, 2024).

6. **Commercial Spectrum Allocations**: Additionally, the Federal Communications Commission (FCC) has allocated new spectrum for commercial launch applications. This decision supports the growing commercial space industry, allowing companies to operate with fewer restrictions and improving overall efficiency concerning satellite launches and operations in space (Source: SpaceNews, January 1, 2025).

These developments underline a vibrant and rapidly advancing space exploration landscape, with a clear momentum driven by private space companies and robust governmental support for research and education in this crucial field.
```
**Key benefits of using Knowledge in CrewAI include:**

* Enhancing agents with domain\-specific information
* Supporting decisions with real\-world data
* Maintaining context across conversations
* Grounding responses in factual information

Next:


### Read More


### Sources

<https://docs.crewai.com/concepts/knowledge>


