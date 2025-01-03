---
title: "OpenAI’s Swarm (Part 2): A straightforward, local-first approach with Ollama and Pydantic"
meta_title: "OpenAI’s Swarm (Part 2): A straightforward, local-first approach with Ollama and Pydantic"
description: "The article discusses the integration of Ollama and Swarm frameworks to create AI agents using a local-first approach. Ollama allows for local execution of large language models, ensuring privacy, while Swarm provides a structured environment for agent management. The implementation focuses on an information extraction agent that processes unstructured text into structured JSON formats using Pydantic for type safety. Key benefits include local model execution, structured outputs, and developer-friendly interfaces. This approach is applicable for various tasks, including automated data processing and conversational AI development."
date: 2025-01-03T00:25:01Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*0CSeNK4R0R2h8dT1NhJ-Fw.png"
categories: ["Programming", "Natural Language Processing", "Chatbots"]
author: "Rifx.Online"
tags: ["Ollama", "Swarm", "Pydantic", "JSON", "local-first"]
draft: False

---







## A short code reference to build upon.


## TLDR:

Combining the Ollama and Swarm frameworks presents a local\-first approach to building intelligent AI agents.

Ollama can run large language models locally, ensuring privacy and control, while Swarm provides a structured environment for designing and managing AI agents.

Our first\-principled programming approach emphasizes simplicity and efficiency, avoiding using more complex frameworks that bring unnecessary abstractions, increasing the number of tokens used, and delaying the time to the first token.

Today, we’ll dive into a practical implementation that not only highlights how to create pydantic\-supported agents but also demonstrates the power of Agentic function\-calling and structured programming.

NOTE: The code is available in a gist [here](https://gist.github.com/cnndabbler/0ac0bde263666acb5a746cfb48d66358).


## Understanding the Stack


## Ollama Integration

The implementation leverages Ollama, an open\-source framework for running large language models locally. What makes this setup particularly interesting is how it’s integrated using the OpenAI\-compatible API interface:


```python
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")
```
This configuration allows developers to use familiar OpenAI\-style interactions while running models locally through Ollama. Our example uses the Qwen 2\.5 Coder model (32B parameters), a very capable model.


## The Swarm Framework

Swarm provides the foundational structure for creating and managing AI agents. It’s designed to facilitate:

* Structured agent definitions
* Function calling capabilities
* Message handling and response processing
* Context management


## Deep Dive: Building an Information Extraction Agent

The implementation showcases a practical use case: an agent designed to extract structured information about people from unstructured text.

For example, with the following text:


```python
"Pat Lesieur is a 65-year-old software developer skilled 
in AI Agents and RAG workflows."
```
And the following pydantic class:


```python
## Define our Pydantic class to go with the structured output model
class PersonInfo(BaseModel):
    name: str
    age: int
    skills: List[str]
    bio: Optional[str] = None
```
The Agent has the following prompt:


```python
instructions="""You are a precise information 
extraction agent that converts unstructured 
text about people into a specific JSON format.
IMPORTANT: When calling process_extracted_data, you MUST format the data exactly as follows:
{
    "name": "string",
    "age": number,
    "skills": ["skill1", "skill2"],  # MUST be a JSON array/list of strings
    "bio": "string"
}
The skills parameter MUST ALWAYS be a JSON array/list of strings, NOT a comma-separated string.
CORRECT format for skills:
  "skills": ["AI Agents", "RAG workflows"]
INCORRECT format for skills:
  "skills": "AI Agents, RAG workflows"
Example input: "John Smith is a 35-year-old software developer skilled in Python and Cloud Architecture."
You should call process_extracted_data with:
{
    "name": "John Smith",
    "age": 35,
    "skills": ["Python", "Cloud Architecture"],
    "bio": "Software developer"
}"""

```
To yield:


```python
=== process_extracted_data called ===
Received data:
name: Pat Lesieur
age: 65
skills: ['AI Agents', 'RAG workflows']
bio: Software developer
Successfully created PersonInfo: name='Pat Lesieur' age=65 skills=['AI Agents', 'RAG workflows'] bio='Software developer'
=== process_extracted_data finished ===

```

```python
=== Complete Response Details ===
```

```python
Message type: assistant
Content: 
Tool calls: [
  {
    "id": "call_62rrvh2u",
    "function": {
      "arguments": "{\"age\":65,\"bio\":\"Software developer\",\"name\":\"Pat Lesieur\",\"skills\":[\"AI Agents\",\"RAG workflows\"]}",
      "name": "process_extracted_data"
    },
    "type": "function",
    "index": 0
  }
]
```

```python
Message type: tool
Content: name='Pat Lesieur' age=65 skills=['AI Agents', 'RAG workflows'] bio='Software developer'
```

## Agent Architecture

The core of the implementation revolves around a `PersonInfo` model defined using Pydantic:


```python
class PersonInfo(BaseModel):
    name: str
    age: int
    skills: List[str]
    bio: Optional[str] = None
```
This structured approach ensures type safety and data validation, making the agent’s outputs reliable and consistent.


## Agent Configuration

The agent is configured with specific instructions and capabilities:


```python
def create_person_info_agent() -> Agent:
    return Agent(
        name="PersonInfoAgent",
        instructions="""...""",
        functions=[process_extracted_data]
    )
```
Key features include:

1. Clear instruction setting
2. Function registration for data processing
3. Structured output formatting


## Robust Data Processing

The implementation includes sophisticated data cleaning and processing:


```python
def clean_json_string(data_str: str) -> str:
    # Handles markdown code blocks and formatting
    if "```" in data_str:
        match = re.search(r'```(?:json)?\n(.*?)\n```', data_str, re.DOTALL)
        if match:
            data_str = match.group(1)
    return data_str.strip()
```

## Running the Agent

The system brings everything together using the Swarm client:


```python
swarm_client = Swarm(client=client)
response = swarm_client.run(
    agent=agent,
    model_override=model,
    messages=[{
        "role": "user",
        "content": input_text
    }],
    execute_tools=True
)
```

## Key Benefits

1. **Local Model Execution**: By using Ollama, you maintain control over your data and can run models locally.
2. **Structured Outputs**: The Pydantic integration ensures type\-safe and validated outputs.
3. **Flexible Architecture**: Modifying the agent’s instructions and data models can easily adapt the system for different use cases.
4. **Developer\-Friendly**: The OpenAI\-compatible interface makes it easy for developers familiar with OpenAI’s API to adapt.


## Practical Applications

This implementation is particularly useful for:

* Information extraction from unstructured text
* Automated data processing pipelines
* Building conversational AI agents
* Creating structured data from natural language inputs


## Conclusion

Combining Ollama and Swarm demonstrates a powerful approach to building AI agents. By leveraging local model execution through Ollama and the structured agent framework provided by Swarm, developers can create sophisticated AI applications that maintain data privacy while delivering reliable, structured outputs.

The implementation shows how modern AI development can be powerful and practical, combining the best of local model execution with structured programming practices.


