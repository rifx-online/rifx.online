---
title: "我如何利用 ChromaDB 和 Chainlit 构建基于 Graph-RAG 系统的 LLM 应用程序"
meta_title: "我如何利用 ChromaDB 和 Chainlit 构建基于 Graph-RAG 系统的 LLM 应用程序"
description: "本文介绍了如何利用GraphRAG系统结合ChromaDB和Chainlit构建一个端到端的大型语言模型（LLM）应用。文章阐述了使用Chainlit作为前端、ChromaDB进行知识存储、Networkx管理知识图谱、以及Sentence-transformers生成嵌入的整体架构。系统通过用户输入提示，处理知识嵌入，生成上下文并查询LLM，确保知识的持久性和关系意识。该实现展示了现代RAG技术与知识图谱的结合，为构建复杂应用提供了基础。"
date: 2024-12-26T02:11:51Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Qx_4JrUXsH9egwm-BbJKzA.jpeg"
categories: ["Programming", "Machine Learning", "Natural Language Processing"]
author: "Rifx.Online"
tags: ["Graph-RAG", "Chainlit", "ChromaDB", "Networkx", "embeddings"]
draft: False

---



一个端到端的应用，带有 GUI，并且仅用 3 个脚本将新知识存储在向量数据库中



大型语言模型（LLMs）和知识图谱是处理自然语言的宝贵工具。检索增强生成（RAG）作为一种强大的方法，能够通过上下文知识增强 LLM 的响应。上下文知识通常嵌入并存储在向量数据库中，用于创建上下文以增强提示。然而，这种方式下，知识被映射在一个概念空间中，但并没有真正组织起来。知识图谱捕捉了领域内数据点或实体的信息以及它们之间的关系。数据在知识图谱中被描述为节点以及关系。这比仅仅将单词嵌入向量空间提供了更多的结构。

> Graph\-RAG 是一种结合了这两者的东西，提供了 RAG 的增强知识，以知识图谱的形式组织，从而使 LLM 的响应更好。

在本文中，我将告诉你我是如何创建一个端到端的应用，将所有这些组合在一起。

简而言之，我使用了

* [Chainlit](https://chainlit.io/) 作为前端
* [ChromaDB](https://www.trychroma.com/) 来存储知识为向量
* [Networkx](https://networkx.org/) 来管理图形
* [Sentence\-transformers](https://sbert.net/) （Pytorch）用于生成嵌入。
* [MistralAI](https://mistral.ai/) 作为基线 LLM

这些组件的交互如下：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Yw4WHrr4w9mV5zyOYyjAGw.jpeg)

1. 用户在 Chainlit 界面中写下提示。
2. 知识图谱 RAG 处理知识的嵌入和存储。
3. 先前的数据存储在 ChromaDB 中。
4. 生成的上下文被添加到提示中，并询问 LLM。
5. Mistral 将生成的答案返回给 Chainlit。

## 该架构的优势：

* **持久性**：ChromaDB 确保我们的知识库在会话之间持久存在
* **关系意识**：图结构捕捉信息片段之间的显式关系
* **语义搜索**：句子嵌入使得即使措辞不同也能找到相关信息
* **用户友好的界面**：Chainlit 提供直观的聊天界面以便与系统互动

让我们深入了解每个组件及其如何协同工作，这一切都可以在仅仅 3 个脚本中定义：*\`chainlit\_app.py\`、\`rag\_implementation.py\` 和 \`graph\_embedding.py\*。

我们添加的知识可以通过以下关系图表示：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*nCQiCvPuBkGQtsNfX1fFiA.jpeg)

## Chainlit 接口

Chainlit 是一个开源的 Python 库，用于轻松部署具有用户友好界面的聊天机器人。要在本地启动，您需要一个文件，例如“*chainlit\_app.py*”，该文件可以从命令行以“*chainlit "chainlit\_app.py"*”的形式启动。您还可以将其部署到镜像上，以便在 AWS EC2 实例上运行：*

因此，在提议的应用程序中，chainlet 应用程序包含主要启动。理想情况下，图形 RAG 中添加的知识与实际提示解耦，特别是因为我们将这些知识存储在 Chroma 数据库中。在这个例子中，我们简化了这一点，单个脚本首先增强知识和提示。更具体地说，这里我在 *initialize\_knowledge\_base()* 中硬编码了一些知识，但这些知识可以从文档中自动读取（这是可以解耦的部分），然后有一个异步函数等待用户输入。

```python
import chainlit as cl
from rag_implementation import MistralRAGSystem

## Initialize RAG system
rag_system = MistralRAGSystem()

## Pre-populate knowledge graph with some initial data
def initialize_knowledge_base():
    knowledge_items = [
        {
            "id": "ai_basics",
            "content": "Artificial Intelligence is a broad field of computer science focused on creating intelligent machines that can simulate human-like thinking and learning capabilities.",
            "metadata": {"category": "introduction", "difficulty": "beginner"}
        },
        {
            "id": "ml_fundamentals",
            "content": "Machine Learning is a subset of AI that enables systems to learn and improve from experience without being explicitly programmed, using algorithms that can learn from and make predictions or decisions based on data.",
            "metadata": {"category": "core_concept", "difficulty": "intermediate"}
        }
    ]
    
    for item in knowledge_items:
        rag_system.add_knowledge(item["id"], item["content"], item["metadata"])
    rag_system

## Initialize knowledge base
initialize_knowledge_base()

@cl.on_chat_start
async def start():
    await cl.Message(content="RAG System with Mistral is ready! How can I help you today?").send()

@cl.on_message
async def main(message: cl.Message):
    # Check if the message is a knowledge addition command
    if message.content.startswith("/add_knowledge"):
        # Parse the message to extract node_id and content
        parts = message.content.split(maxsplit=3)
        if len(parts) < 3:
            await cl.Message(content="Usage: /add_knowledge <node_id> <content>").send()
            return
        
        node_id, content = parts[1], parts[2]
        rag_system.add_knowledge(node_id, content)
        await cl.Message(content=f"Added knowledge node: {node_id}").send()
        return

    # Regular query processing
    # Augment the query with relevant context
    augmented_query = rag_system.augment_query(message.content)
    
    # Generate response
    response = rag_system.generate_response(augmented_query)
    
    # Send the response back to the user
    await cl.Message(content=response).send()
```

## Mistral RAG 系统集成

`MistralRAGSystem` 类作为协调者，将知识图谱与 Mistral LLM 结合。在这个具体实现中，我使用的是在 [Huggingface 仓库](https://huggingface.co/mistralai) 上可访问的模型。因此，我们需要从 Huggingface 获取 API 密钥并将其保存到 .env 文件中。

此外，这个类实现了一些 RAG 功能，这些功能在后面的 *rag_implementation.py 脚本* 中的 KnowledgeGraphRAG 类中进行了描述：

```python
import os
from dotenv import load_dotenv
import requests
from graph_embedding import KnowledgeGraphRAG

class MistralRAGSystem:
    def __init__(self):
        # Load environment variables
        load_dotenv()
        
        # Get Hugging Face API key from environment variable
        self.api_key = os.getenv('MISTRAL_API_KEY')
        if not self.api_key:
            raise ValueError("HUGGINGFACE_API_KEY must be set in .env file")
        
        # Default model (corrected name)
        self.model = "mistralai/Mistral-7B-v0.1"  
                
        # Initialize Knowledge Graph
        self.knowledge_graph = KnowledgeGraphRAG()
```
该类的其余部分由主 Chainlit 脚本调用。该脚本几乎添加了知识，查询模型，并返回响应，同时可能还清理了一些输出，以避免响应重复提示：

```python
  def augment_query(self, query: str) -> str:
        """
        Augment the query with relevant context from the knowledge graph
        
        Args:
            query (str): Original user query
        
        Returns:
            str: Augmented query with additional context
        """
        # Retrieve similar nodes
        similar_nodes = self.knowledge_graph.retrieve_similar_nodes(query)
        
        # If similar_nodes is a list, iterate over it directly
        context = "\n".join([str(doc) for doc in similar_nodes])
        
        # Create a structured prompt with context
        augmented_prompt = f"""
        #Context Information:
        #{context}

        Based on the provided context and your extensive knowledge, 
        please answer the following query comprehensively:

        Query: {query}

        Response:
        """
       
        return augmented_prompt
   

    def generate_response(self, augmented_query: str) -> str:
        """
        Generate response using Hugging Face API for Mistral model
        
        Args:
            augmented_query (str): Augmented query with context
        
        Returns:
            str: Generated response
        """
        try:
            # Prepare headers with the Hugging Face API key
            headers = {
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json'
            }
            
            # Prepare payload
            payload = {
                'inputs': augmented_query
            }

            # Hugging Face Inference API endpoint for Mistral model
            url = f'https://api-inference.huggingface.co/models/{self.model}'

            # Make the POST request to generate a response
            response = requests.post(url, json=payload, headers=headers)

            # Check if the request was successful
            if response.status_code == 200:
                #return response.json()[0]['generated_text']
                generated_text = response.json()[0]['generated_text']
                
                
                print("Raw response:", response.json())
                
                start_index = generated_text.find("Response:") + len("Response:")
                response_without_context = generated_text[start_index:].strip()
                
                return response_without_context
            else:
                return f"Error: {response.status_code} - {response.text}"

        except Exception as e:
            return f"An error occurred: {str(e)}"

    def add_knowledge(self, node_id: str, content: str, metadata: dict = None):
        """
        Add knowledge to the graph
        
        Args:
            node_id (str): Unique node identifier
            content (str): Node content
            metadata (dict, optional): Additional metadata
        """
        self.knowledge_graph.add_node(node_id, content, metadata)
```

## 知识图谱实现

我们系统的核心是 \`KnowledgeGraphRAG\` 类，位于 *\`graph\_embedding.py*\` 脚本中，它管理图结构和嵌入。正如我们所说，图关系是通过 Networkx 库管理的，而嵌入则永久保存在 Chroma 数据库中。

Chroma 在底层使用 SqLite，尽管之前的版本是基于 DuckDB。请注意，如果您多次运行此代码，可能会发送一些警告或错误，因为您已经创建了数据库或集合。正如我在开头所说的，理想情况下，我们应该将添加知识和提示系统解耦。

该脚本创建一个数据库，并允许与添加节点和关系相关的调用，这些内容保存在数据库中。

```python
import networkx as nx
import matplotlib.pyplot as plt
from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.config import DEFAULT_TENANT, DEFAULT_DATABASE, Settings
from typing import List, Dict, Any

class KnowledgeGraphRAG:
    def __init__(self, model_name="sentence-transformers/all-MiniLM-L6-v2"):
        # Initialize embedding model
        self.embedding_model = SentenceTransformer(model_name)
        
        # Initialize graph
        self.graph = nx.DiGraph()
      
        self.chroma_client = chromadb.PersistentClient(
             path="test",
             settings=Settings(),
             tenant=DEFAULT_TENANT,
             database=DEFAULT_DATABASE,
)
 
        self.collection = self.chroma_client.create_collection(name="knowledge_base3")

    def add_node(self, node_id: str, content: str, metadata: Dict[str, Any] = None):
        """
        Add a node to the knowledge graph and embed its content
        
        Args:
            node_id (str): Unique identifier for the node
            content (str): Text content of the node
            metadata (dict, optional): Additional metadata for the node
        """
        # Add to networkx graph
        self.graph.add_node(node_id, content=content, metadata=metadata or {})
        
        # Generate embedding
        embedding = self.embedding_model.encode(content).tolist()
        
        # Ensure metadata is a non-empty dictionary
        metadata = metadata or {}

        # Add to ChromaDB
        self.collection.add(
            ids=[node_id],
            embeddings=[embedding],
            documents=[content],
            metadatas=[metadata]  # Ensure that the metadata is a valid dictionary
        )
        
    def add_edge(self, source: str, target: str, relationship: str = None):
        """
        Add a directed edge between two nodes
        
        Args:
            source (str): Source node ID
            target (str): Target node ID
            relationship (str, optional): Type of relationship
        """
        self.graph.add_edge(source, target, relationship=relationship)
 
    def retrieve_similar_nodes(self, query: str, top_k: int = 3):
        """
        Retrieve most similar nodes to a given query.
        
        Args:
            query (str): Search query
            top_k (int): Number of top similar nodes to retrieve.
        
        Returns:
            List of most similar nodes.
        """
        # Generate query embedding
        query_embedding = self.embedding_model.encode(query).tolist()

        # Get the total number of nodes in the collection
        total_nodes = self.collection.count()

        # Adjust top_k if it exceeds the number of available nodes
        top_k = min(top_k, total_nodes)

        # Retrieve from ChromaDB
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k
        )

        # Return the documents (already adjusted for n_results)
        return results.get('documents', [])

## Example usage
def create_sample_knowledge_graph():
    kg = KnowledgeGraphRAG()
    #persist_directory="./my_knowledge_base_data2"
    
    # Add some sample nodes about AI
    kg.add_node("ai_intro", "人工智能是计算机科学的一个分支")
    kg.add_node("ml_intro", "机器学习是 AI 的一个子集，专注于从数据中学习")
    kg.add_node("dl_intro", "深度学习使用具有多个层的神经网络")
    
    # Add some relationships
    kg.add_edge("ai_intro", "ml_intro", "包含")
    kg.add_edge("ml_intro", "dl_intro", "高级技术")
    
    return kg

## For testing
if __name__ == "__main__":
    kg = create_sample_knowledge_graph()
    kg.visualaze_graph()
    
    # Example retrieval
    results = kg.retrieve_similar_nodes("神经网络")
    print(results)
```
此外，该类使用 *SentenceTransformers* 来生成嵌入，并使用 ChromaDB 进行持久存储。这种组合使我们能够维护信息片段之间的语义关系（通过嵌入）和显式关系（通过图结构）。

## 结论

该实现展示了如何将现代 RAG 技术与持久存储和知识图谱相结合。该系统为构建更复杂的基于知识的应用程序提供了坚实的基础。ChromaDB 用于持久性，Chainlit 用于界面，使其既实用又用户友好。选择 ChromaDB 而非其他永久向量数据库，取决于需求和可用资源。无论如何，我希望我向你展示了，只需 3 个脚本，你就可以拥有一个使用友好前端的端到端应用程序，能够保存新知识，并顺畅运行预先存在的 LLM，而无需微调。

如果你喜欢这篇文章，请考虑分享给他人并 [注册我的邮件列表](https://alecrimi.substack.com/)。

或者简单地连接：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*zntpyaJVZ8b1txO2)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*_8es7DuJjLDgu2LO.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*3H4C0L-BoV8Qxx-M.png)

