---
title: "OpenAIs Swarm（第二部分）：使用 Ollama 和 Pydantic 的直接、本地优先方法"
meta_title: "OpenAIs Swarm（第二部分）：使用 Ollama 和 Pydantic 的直接、本地优先方法"
description: "本文介绍了一种结合Ollama和Swarm框架的本地优先AI代理构建方法。Ollama支持在本地运行大型语言模型，确保数据隐私，而Swarm则提供结构化代理管理。通过使用Pydantic进行数据验证，本文展示了如何从非结构化文本中提取结构化信息。该实现强调简单性和高效性，适用于信息提取、数据处理和对话AI代理的构建，展现了现代AI开发的强大与实用性。"
date: 2025-01-03T00:25:01Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*0CSeNK4R0R2h8dT1NhJ-Fw.png"
categories: ["Programming", "Natural Language Processing", "Chatbots"]
author: "Rifx.Online"
tags: ["Ollama", "Swarm", "Pydantic", "JSON", "local-first"]
draft: False

---



## 一个简短的代码参考以供构建。

## TLDR:

结合Ollama和Swarm框架，呈现了一种以本地为优先的构建智能AI代理的方法。

Ollama可以在本地运行大型语言模型，确保隐私和控制，而Swarm则提供了一个结构化的环境，用于设计和管理AI代理。

我们以第一性原理的编程方法强调简单性和高效性，避免使用带来不必要抽象的复杂框架，从而增加使用的tokens数量，并延迟首次token的生成时间。

今天，我们将深入探讨一个实际的实现，不仅突出如何创建支持pydantic的代理，还展示了Agentic函数调用和结构化编程的强大功能。

## 理解堆栈

## Ollama 集成

该实现利用了 Ollama，这是一个用于本地运行大型语言模型的开源框架。这个设置特别有趣之处在于它是如何通过与 OpenAI 兼容的 API 接口进行集成的：

```python
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")
```

此配置允许开发者在通过 Ollama 本地运行模型时，使用熟悉的 OpenAI 风格的交互。我们的示例使用了 Qwen 2.5 Coder 模型（32B 参数），这是一个非常强大的模型。

## Swarm框架

Swarm提供了创建和管理AI代理的基础结构。它旨在促进：

* 结构化的代理定义
* 函数调用能力
* 消息处理和响应处理
* 上下文管理

## 深入探讨：构建信息提取代理

该实现展示了一个实际用例：一个旨在从非结构化文本中提取关于人员的结构化信息的代理。

例如，以下文本：

```python
"Pat Lesieur is a 65-year-old software developer skilled 
in AI Agents and RAG workflows."
```

以及以下的 pydantic 类：

```python
## 定义我们的 Pydantic 类以配合结构化输出模型
class PersonInfo(BaseModel):
    name: str
    age: int
    skills: List[str]
    bio: Optional[str] = None
```

该代理具有以下提示：

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

以产生：

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

## 代理架构

实现的核心围绕着一个使用 Pydantic 定义的 `PersonInfo` 模型：

```python
class PersonInfo(BaseModel):
    name: str
    age: int
    skills: List[str]
    bio: Optional[str] = None
```

这种结构化的方法确保了类型安全和数据验证，使得代理的输出可靠且一致。

## 代理配置

代理配置了特定的指令和能力：

```python
def create_person_info_agent() -> Agent:
    return Agent(
        name="PersonInfoAgent",
        instructions="""...""",
        functions=[process_extracted_data]
    )
```

主要特点包括：

1. 清晰的指令设置
2. 数据处理的功能注册
3. 结构化的输出格式

## 强大的数据处理

该实现包括复杂的数据清理和处理：

```python
def clean_json_string(data_str: str) -> str:
    # Handles markdown code blocks and formatting
    if "```" in data_str:
        match = re.search(r'```(?:json)?\n(.*?)\n```', data_str, re.DOTALL)
        if match:
            data_str = match.group(1)
    return data_str.strip()
```

## 运行代理

该系统通过 Swarm 客户端将一切结合在一起：

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

## 主要优点

1. **本地模型执行**：通过使用 Ollama，您可以控制自己的数据并在本地运行模型。
2. **结构化输出**：Pydantic 集成确保类型安全和经过验证的输出。
3. **灵活架构**：修改代理的指令和数据模型可以轻松适应不同的用例。
4. **开发者友好**：与 OpenAI 兼容的接口使得熟悉 OpenAI API 的开发者易于适应。

## 实际应用

该实现特别适用于：

* 从非结构化文本中提取信息
* 自动化数据处理管道
* 构建对话 AI 代理
* 从自然语言输入创建结构化数据

## 结论

结合 Ollama 和 Swarm 展示了一种构建 AI 代理的强大方法。通过利用 Ollama 的本地模型执行和 Swarm 提供的结构化代理框架，开发者可以创建复杂的 AI 应用程序，既能保持数据隐私，又能提供可靠的结构化输出。

该实现展示了现代 AI 开发如何强大且实用，结合了本地模型执行与结构化编程实践的最佳之处。


