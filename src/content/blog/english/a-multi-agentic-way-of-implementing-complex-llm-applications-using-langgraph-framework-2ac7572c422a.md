---
title: "A multi-agentic way of implementing complex LLM applications using LangGraph framework"
meta_title: "A multi-agentic way of implementing complex LLM applications using LangGraph framework"
description: "LangGraph is a framework built on LangChain that enables the creation of complex, stateful applications using Large Language Models (LLMs). It introduces cyclic computational capabilities, allowing for dynamic behaviors and multi-agent interactions. Key components include nodes representing computation steps and edges defining the flow, including conditional edges for decision-making. Users can implement various functions, such as question classification, answer grading, and response generation, to build sophisticated workflows. LangGraph enhances the development of agent-based systems and multi-step processes, providing a versatile tool for generative AI applications."
date: 2024-11-30T14:02:13Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*-jTqDmLTPnuXK-p2HrNgdw.png"
categories: ["Programming", "Generative AI", "Machine Learning"]
author: "Rifx.Online"
tags: ["LangGraph", "LangChain", "LLMs", "nodes", "edges"]
draft: False

---





> Add LangGraph to your repertoire of GenAI related skills. This one skill can straightaway enable you to create complex AI systems today. The pre\-requisite of course is to have an understanding of how LangChain is used.




## Introduction

LangGraph is a robust tool designed for creating stateful, multi\-actor applications using Large Language Models (LLMs). By extending the capabilities of the LangChain library, LangGraph enables the coordination of multiple chains (or actors) across various computational steps in a cyclic manner. In this blog post, we will introduce LangGraph, explore its fundamental concepts, and address common points of confusion for beginners.


## What is LangGraph?

LangGraph is a library built on top of LangChain, specifically designed to incorporate cyclic computational capabilities into your LLM applications. While LangChain allows for the definition of chains of computation (Directed Acyclic Graphs or DAGs), LangGraph introduces the ability to add cycles. This enhancement facilitates more complex, agent\-like behaviors, enabling you to call an LLM in a loop and determine the next action based on its responses.


## Key Concepts


### Stateful Graph:

At the core of LangGraph is the concept of a stateful graph. Each node within the graph represents a step in your computation, and the graph maintains a state that is continuously updated as the computation progresses.

**Nodes:**Nodes are the fundamental building blocks of LangGraph. Each node represents a specific function or computation step. You can define nodes to perform various tasks, such as processing input, making decisions, or interacting with external APIs.

**Edges:**Edges connect the nodes within your graph, defining the flow of computation. LangGraph supports conditional edges, allowing for dynamic determination of the next node to execute based on the current state of the graph.


## Code example


### Installations

I am expecting that you have already langchain and openai installed in your python environment. If not, create a new environment and install the following libraries.


```python
### general packages
numpy
pandas
matplotlib
pydantic
tqdm
python-dotenv

### llm & other models
openai==1.12.0
sentence-transformers
faiss-cpu
chromadb

### frameworks
langchain
langchain-community
langchain-experimental
langchain-core
langchainhub
langgraph
```
Install LangGraph using `pip install langgraph`.


### Imports


```python
## usual libraries
from typing import List
from typing_extensions import TypedDict
import re
from pydantic import BaseModel, Field

## langchain related libraries
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser, StrOutputParser

## langgraph related libraries
from langgraph.graph import StateGraph, START, END
```

### Define a state


```python
class AgentState(TypedDict):
    question: str
    llm_output: str
    documents: list[str]
    cnt_retries: int
```

### Methods for Nodes

**Node — Question Scope Classifier**


```python
class QuestionScopeClass(BaseModel):
    """Scope of the question"""
    score: str = Field(
        description="Boolean value to check if question is about what, where or comparison. If yes -> 'Yes', else 'No'"
    )


def question_intent_classifier(state: AgentState):
    question = state["question"]
    state['cnt_retries'] = 0
    parser = JsonOutputParser(pydantic_object=QuestionScopeClass)
    output_format = parser.get_format_instructions()
    system = """You are a question classifier. Check if the question is about one of the following topics: 
        1. definition
        2. availability
        3. comparison
        If the question IS about these topics, respond with "Yes", otherwise respond with "No".
        
        Format output as: `{output_format}`
        """

    intent_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system),
            ("human", "User question: {question}"),
        ]
    )

    llm = openAI()
    grader_llm = intent_prompt | llm | parser
    result = grader_llm.invoke({"question": question, 'output_format': output_format})
    print(f"to_proceed: {result['score']}")
    state["on_topic"] = result['score']
    return state

## router to enable conditional edges
def on_topic_router(state: AgentState):
    print('ontopic router ... ')
    on_topic = state["on_topic"]
    if on_topic.lower() == "yes":
        return "on_topic"
    return "off_topic"
```
**Node — Answer Grader**


```python
def grade_answer(state: AgentState):
    answer = state['llm_output']
    print('grading ...')    
    # print('generated answer type:', type(answer))
    # do we have 'do not know' in answer
    pattern = r'do not know|apolog|sorry'
    is_answer = 'Yes' if not re.search(pattern, answer.lower()) else 'No'
    state['is_answer_ok'] = is_answer
    print(f"answer grade: {is_answer}")
    return state

def is_answer_router(state: AgentState):
    print('grading router ... ')
    is_answer = state["is_answer_ok"]
    if state['cnt_retries'] >2:  # max of 3 retries allowed (0 to 2)
        return "hit_max_retries"
    if is_answer.lower() == "yes":
        return "is_answer"
    return "is_not_answer"
```
**Node — Question Re\-phraser**


```python
def question_rephraser(state: AgentState):
    print('rephrasing ...')
    question = state['question']
    print(f"retrying: {state['cnt_retries']+1}")
    llm = openAI)

    template = """
        You are an expert in rephrasing English questions. \
        You hav been tasked to rephrase question from the Retail and Supply Chain domain. \
        While rephrasing, you may do the following:
        1. Extract keywords from the original question
        2. Expand or create abbreviations of the question as needed
        3. Understand the intent of the question
        4. Include the above information to generate a rephrased version of the original question.\
        Do not output anything else apart from the rephrased question.\
        
        Question: {question}
        """

    prompt = ChatPromptTemplate.from_template(
        template=template,
    )
    chain = prompt | llm | StrOutputParser()
    result = chain.invoke({"question": question})
    # print(result)
    state['question'] = result
    state['cnt_retries'] +=1
    return state
```
**Node — Retriever (Optional)**


```python
## some function to create a retriever for a vector store
retriever = get_retriever(config_vector_store) 

def retrieve_docs(state: AgentState):
    question = state["question"]
    documents = retriever.invoke(input=question)
    state["documents"] = documents
    print(f"cnt of retrieved docs: {len(documents)}")
    return state
```
**Node — Response Generation**


```python
def generate_answer(state: AgentState):
    question = state['question']
    context = [doc.page_content for doc in state['documents']]
    print('generating answer ... ')
    llm = openAI()

    template = """
        You are a Customer Support Chatbot aimed to answer the user's queries coming from Retail and Ecommerce industry.\
        Keep the tone conversational and professional.\
        Remember that abbreviations mentioned are related to these domains.\
        Answer the question strictly based on the context provided.\
        Avoid mentioning in the response that a context was referred.\
        Avoid using words like 'certainly" and "it looks like" in the generated response.\
        Do not output anything else apart from the answer.\
        
        {context}

        Question: {question}
        """

    prompt = ChatPromptTemplate.from_template(
        template=template,
    )
    chain = prompt | llm | StrOutputParser()
    result = chain.invoke({"question": question, "context": context})
    print(f"result from generation: {result}")
    state['llm_output'] = result
    return state
```
**Node — Fall Back Response**


```python
def get_default_reply(state:AgentState):
    print('get the default answer ...')
    state['llm_output'] = 'I do not have an answer.'
    return state
```

### Compose the Lang Graph

This is the process flow that connects the different nodes that we have created above. This also enables conditional edges by utilizing the routers defined above.


```python
workflow = StateGraph(AgentState)

## Add the Nodes
workflow.add_node('intent_classifier', question_intent_classifier)
workflow.add_node('retrieve_docs', retrieve_docs)
workflow.add_node('generate_answer', generate_answer)
workflow.add_node('grade_answer', grade_answer)
workflow.add_node('question_rephraser', question_rephraser)
workflow.add_node('default_reply', get_default_reply)

## Add the Edges including the Conditional Edges
workflow.add_edge('intent_classifier', START)
workflow.add_conditional_edges(
    'intent_classifier', on_topic_router, 
    {
        'on_topic': 'retrieve_docs', 
        'off_topic': 'default_reply'
    }
)
workflow.add_edge('retrieve_docs', 'generate_answer')
workflow.add_edge('generate_answer', 'grade_answer')
workflow.add_conditional_edges(
    'grade_answer', is_answer_router,
    {
        'is_answer':END, 
        'is_not_answer':'question_rephraser', 
        'hit_max_retries':'default_reply'
    }
)
workflow.add_edge('question_rephraser', 'retrieve_docs')
workflow.add_edge('default_reply', END)

## compile the workflow
app = workflow.compile()
```
**Visualize the workflow**


```python
try:
    display(Image(app.get_graph(xray=True).draw_mermaid_png()))
except:
    pass
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*0Ybvw--nCGhXvSDgLLED5Q.jpeg)

**Using the App**


```python
query = "Capital of India"
response = app.invoke(input={"question": query})

print(result['llm_output'])
```

## Conclusion

By understanding these foundational elements, users can harness LangGraph to design more complex, dynamic LLM applications that go beyond simple linear chains of tasks. Whether developing agent\-based systems or managing multi\-step workflows, LangGraph offers a robust framework to tackle challenges in the evolving field of generative AI.


