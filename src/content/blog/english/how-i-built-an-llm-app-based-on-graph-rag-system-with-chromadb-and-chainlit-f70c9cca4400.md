---
title: "How I Built an LLM App Based on Graph-RAG System with ChromaDB and Chainlit"
meta_title: "How I Built an LLM App Based on Graph-RAG System with ChromaDB and Chainlit"
description: "The article details the creation of an end-to-end application utilizing a Graph-RAG system, integrating Chainlit for the user interface, ChromaDB for vector storage, and Networkx for graph management. The application enhances LLM responses by organizing knowledge through a structured knowledge graph while leveraging embeddings for semantic search. It outlines the architecture, advantages, and implementation of the system in three scripts, demonstrating how to efficiently manage knowledge and interact with a pre-existing LLM without fine-tuning."
date: 2024-12-26T04:30:18Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Qx_4JrUXsH9egwm-BbJKzA.jpeg"
categories: ["Programming", "Machine Learning", "Natural Language Processing"]
author: "Rifx.Online"
tags: ["Graph-RAG", "Chainlit", "ChromaDB", "Networkx", "embeddings"]
draft: False

---




End\-to\-end app with GUI and storing new knowledge on vector database in just 3 scripts



Large language models (LLMs) and knowledge graphs are valuable tools to work with natural language processing. Retrieval\-augmented generation (RAG) has emerged as a powerful approach to enhance LLMs responses with contextual knowledge. Contextual knowledge is generally embedded and stored in a vector database and used to create the context to empower a prompt. However, in this way, knowledge is mapped in a conceptual space but it is not really organized. A knowledge graph captures information about data points or entities in a domain and the relationships between them. Data are described as nodes and relationships within a knowledge graph. This gives more structure than just embedding words in a vector space.


> A graph\-RAG is something that combines both aspects providing the augmented knowledge of RAG to be organized as knowledge graph for better responses by the LLM.

In this article, I am going to tell you how I created an application end\-to\-end putting together all this.

Shortly, I used

* [Chainlit](https://chainlit.io/) for the front\-end
* [ChromaDB](https://www.trychroma.com/) to store knowledge as vectors
* [Networkx](https://networkx.org/) to manage graph
* [Sentence\-transformers](https://sbert.net/) (Pytorch) for generating embeddings.
* [MistralAI](https://mistral.ai/) as the baseline LLM

and those components interact as follows:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Yw4WHrr4w9mV5zyOYyjAGw.jpeg)

1. The user writes a prompt in the Chainlit Interface.
2. Knowledge Graph RAG Handlesthe embedding and storage of knowledge.
3. Previous data are stored in the ChromaDB.
4. the generated context is added to the prompt and asked to the LLM.
5. Mistral returns the generated answer to Chainlit.


## Advantages of This Architecture:

* **Persistence**: ChromaDB ensures that our knowledge base persists between sessions
* **Relationship Awareness**: The graph structure captures explicit relationships between pieces of information
* **Semantic Search**: Sentence embeddings enable finding relevant information even with different phrasing
* **User\-Friendly Interface**: Chainlit provides an intuitive chat interface for interacting with the system

Let’s dive into each component and understand how they work together, which all be defined in just 3 scripts: *\`chainlit\_app.py\`, \`rag\_implementation.py\`, and \`graph\_embedding.py*\`.

The knowledge we are adding can be represented by the following graph of relationship:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*nCQiCvPuBkGQtsNfX1fFiA.jpeg)


## Chainlit Interface

The Chainlit is an opensource Python library to deploy easily chatbot with user\-friendly interfaces. To launch locally you need a file e.g. “*chainlit\_app.py*” which is launched from the command line as “*chainlit “chainlit\_app.py”. You can also deploy it on image to run on a AWS EC2 instance:*







Therefore, in the proposed application, the chainlet app contains the main launches. Ideally, the added knowledge in the graph\-RAG is decoupled from the actual prompting, especially since we store this knowledge in a Chroma database. In this example, we simplify this, and a single script augments the knowledge and the prompting first. More specifically, here I have hardcoded some knowledge in the *initialize\_knowledge\_base()* but this can be automatically read from documents (this is the part that can be decoupled), and then there is an asynchronous function waiting for inputs from the user.


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

## Mistral RAG System Integration

The \`MistralRAGSystem\` class serves as the orchestrator, combining the knowledge graph with the Mistral LLM. In this specific implementation, I am using the model accessible on the [Huggingface repository.](https://huggingface.co/mistralai) Therefore, we need to get the API Key from Huggingface and save it into a .env file.

Moreover, this Class implements some RAG functionality which are described in another class later, the KnowledgeGraphRAG class in the *rag\_implementation.py script*:


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
the rest of the class is called by the main Chainlit script. This script adds practically the knowledge, queries the model, and returns the response potentially also cleaning some output to avoid the response is repeating the prompt:


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

## Knowledge Graph Implementation

The core of our system is the \`KnowledgeGraphRAG\` class in the *\`graph\_embedding.py*\` script, which manages both the graph structure and embeddings, and as we said the graph relationships are managed through the Networkx library while the embeddings are saved permanently in a Chroma database.

Chroma uses SqLite underneath, though previous versions were based on DuckDB. Be aware that if you run this multiple times, it may send some warnings or errors as you have already created the database or collections. As I said at the beginning, ideally, we should decouple adding knowledge and prompting the system.

This script creates a database and allows calls related to adding nodes and relationships saved in the database.


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
    kg.add_node("ai_intro", "Artificial Intelligence is a branch of computer science")
    kg.add_node("ml_intro", "Machine Learning is a subset of AI focusing on learning from data")
    kg.add_node("dl_intro", "Deep Learning uses neural networks with multiple layers")
    
    # Add some relationships
    kg.add_edge("ai_intro", "ml_intro", "contains")
    kg.add_edge("ml_intro", "dl_intro", "advanced_technique")
    
    return kg

## For testing
if __name__ == "__main__":
    kg = create_sample_knowledge_graph()
    kg.visualaze_graph()
    
    # Example retrieval
    results = kg.retrieve_similar_nodes("neural networks")
    print(results)
```
Moreover, the class uses *SentenceTransformers* for generating embeddings and ChromaDB for persistent storage. This combination allows us to maintain both the semantic relationships between pieces of information (through embeddings) and explicit relationships (through the graph structure).


## Conclusion

This implementation demonstrates how to combine modern RAG techniques with persistent storage and knowledge graphs. The system provides a robust foundation for building more sophisticated knowledge\-based applications. The combination of ChromaDB for persistence and Chainlit for interface makes it both practical and user\-friendly. There are alternative permanent vector databases so the choice of ChromaDB over others, depends on the needs and resources available. Anyway, I hope I showed you that with just 3 scripts you can have an end\-to\-end application using a friendly front\-end, saving new knowledge and running smoothly using a pre\-existing LLM without the need of fine\-tuning.

If you enjoyed the reading please consider sharing it around and [sign up to my mailing list](https://alecrimi.substack.com/).

Or simply connect:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*zntpyaJVZ8b1txO2)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*_8es7DuJjLDgu2LO.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*3H4C0L-BoV8Qxx-M.png)


