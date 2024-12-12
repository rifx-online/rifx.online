---
title: "A simple, step-by-step guide to building a production-ready Agentic AI ChatBot using Llamaindex and…"
meta_title: "A simple, step-by-step guide to building a production-ready Agentic AI ChatBot using Llamaindex and…"
description: "This article provides a step-by-step guide to building a production-ready Agentic AI Chatbot using Llamaindex and Groq-Llama 3.3. It covers the following key areas:

1. **Demystifying Agentic AI and Agents**: Explains that Agentic AI is essentially a sophisticated text generation system that can act autonomously based on prompts. It clarifies that LLMs do not think but generate text based on probabilities.

2. **Llamaindex Agents**: Introduces the concepts of prompting, chat history, and tool calls, which are essential for building agents. It explains how Llamaindexs ReActAgent and FunctionCallingAgent work.

3. **Building a Simple Agentic Function Call**: Demonstrates how to create a basic function call using Llamaindex and Groq-Llama 3.3, including setting up the environment, defining tools, and initializing the agent.

4. **Building a Production-Ready Agentic Chatbot**: Outlines the steps to structure the project, set up the necessary files (e.g., `requirements.txt`, `app_logger.py`, `tools.py`, `agent_controller.py`, `generators.py`, `simple_ui.py`, `app.py`), and deploy the application using Docker. It also provides a simple UI using Gradio and a Flask app for handling API requests.

5. **Docker Deployment**: Explains how to create a Dockerfile and a start script to containerize the application and run it on Docker.

The article includes code snippets and detailed explanations to help readers understand and implement each step. It concludes with references and a call to action for feedback and professional connections."
date: 2024-12-12T01:27:00Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*Z0XJdrkvHfsgT3z9.jpg"
categories: ["Chatbots", "Programming", "Generative AI"]
author: "Rifx.Online"
tags: ["Agentic", "Llamaindex", "Groq-Llama", "Docker", "Gradio"]
draft: False

---





## Introduction

In this article we will be seeing how to build an end to end Agentic AI Chatbot using Llamaindex and Groq\-Llama 3\.3\.

During the course of this article you will learn about:

1. Demystifying Agentic AI and Agents: Removing the hype around Agentic AI
2. ReActAgent and FunctionCallingAgent in Llamaindex and how to add tools / functions.
3. A simple Agentic function call.
4. Building a production ready Agentic Chatbot — structuring the project and deploying using Docker.


## Demystifying Agentic AI and Agents

There has been a lot of hype around “Agents” nowadays, a common person with little or no knowledge of AI will think these Agents pretty intimidating, thanks to movies like The Matrix (1999\)



That being said there’s a lot of confusion on the Agentic AI as a whole especially for a common Joe, since its hard to understand the concept of — a piece of code working autonomously and doing stuff.

Coming to 2024:

When it comes to Agents with respect to Large Language Models,

Its all prompts

I feel I couldn’t have said it in any other simpler way, we kind of make use of the LLM text generation to make the LLM **ACT as an Agent.**

For example:

Go on to ChatGPT: <https://chatgpt.com/>

and Type this:


> From now on you will act as a friendly sales assistant “Bake\-gent” of my baking business and will ask the users about what they would like to buy, here is a products glossary:


> Bread — $10


> Milk bread — $12


> Croissant — $15


> Eggless Brownies — 4 for $20


> Under no circumstances you will answer any other query after this, only when I say “STOP” you will stop acting like my sales assistant.

An example thread: [https://chatgpt.com/c/67541312\-0520\-800e\-9a0f\-864d57619295](https://chatgpt.com/share/6754141e-e090-800e-adc1-13fafec91a04)

If you look at the responses given by ChatGPT, they seem very convincing, as if it’s really a sales assistant, but in reality ChatGPT is kind of just — **acting** like one.

Any LLM does not have any “Thinking” in their architecture, it’s a very sophisticated text generation that has been trained on billions of lines of data.

Any LLM agent thus is just a text Prompt, that can act like whatever you want it to.

— not always though (insert crying data scientists here)

Why not always? you might ask, since it doesn’t “think”,

it’s just — text generation based on word probabilities, so sometimes the results might not make sense to you, but makes perfect sense mathematically.

Anyways the point is, it it not “Thinking”.

Now that we are done with removing the hype around Agents, lets take a look at how Llamaindex made their agents like **ReActAgent** and **FunctionCallingAgent.**


## Llamaindex Agents : Any Agent in general

I found Llamaindex’s blog that discusses how does React Agents work in Llamaindex, the idea behind any Agent is basically the same.

link: <https://docs.llamaindex.ai/en/stable/examples/workflow/react_agent/>

The thing we are looking for — is in this section:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*fi7OnMrTmC0gQYJNFxiTuA.png)

So basically there are 3 major things to understand here:

1. Prompting (texts) — The driving force for the Agent, which tells it what to do, kind of like its life values.
2. Chat History — The record of all the previous User and Assistant messages, which acts like Agent’s memory.
3. Tool Calls — The set of functions that the Agent can call and get results which it can then use to solve the problem at hand, so basically his work tools.

Beyond that, it’s just a very smart way of utilizing these 3 things in a smart way to get the Agent working and making it **ACT** like its doing it without any help.

The same concept can be applied to Langchain, CrewAI or 100 different Agentic Frameworks offered by others.

Now that the basics are clear, let’s see exactly how we can use Llamaindex agents.


## Llamaindex: FunctionCallingAgent and Tools

Before starting I would like you to get familiar with Groq, which will be used to get LLM inferences of Meta’s latest model llama 3\.3

Head onto <https://console.groq.com/keys>, register if you haven’t yet and extract your API key, that will be used across the App.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*LGLO37OzM0p-TpbGbLQqEg.png)

You should create your own API key and then copy it, keep it somewhere.

Don’t use mine, it won’t work, I will delete it right after this :)

Once this is done, let us install the required things we need during this exercise:

For the sake of example, let’s just use a ipynb notebook so that we understand what we are trying to achieve here, always use notebooks for experimentation :).

or if you are in a Jupyter Notebook just use:


```python
!pip install llama-index==0.12.2 llama-index llms-ollama==0.4.1 Flask==3.1.0 llama-index-llms-groq==0.3.0
```
In one cell, let’s build our generator class, nothing fancy:


```python
from llama_index.llms.ollama import Ollama
from llama_index.llms.groq import Groq

class Generators:
    def __init__(self, model="llama-3.3-70b-versatile"):
        # self.llm = Ollama(model=model, temperature=0)
        self.llm = Groq(model=model, api_key="your_groq_api_key", temperature=0)

    def get_llm(self):
        return self.llm
```
Put your saved Groq api key in place of your\_groq\_api\_key

Then in another cell, initialize 2 tools:


```python
import math

session = dict()

def multiply(a: float, b: float) -> float:
    """useful tool to Multiply two numbers and returns the product
    make sure that both numbers a, b are real numbers and if not try to convert them to real numbers
    args:
        a: float
        b: float    
    requires:
        only_real_numbers
    """
    return float(a) * float(b)


def add(a: float, b: float) -> float:
    """useful tool to Add two numbers and returns the sum, 
    make sure that both numbers a, b are real numbers and if not try to convert them to real numbers
    args:
        a: float
        b: float    

    requires:
        only_real_numbers
    """
    return float(a) + float(b)

def only_real_numbers(a: float) -> float:
    """ useful tool to verify if the number is real"""
    try: 
        float(a)
    except ValueError: 
        return f"{a} is not a real number so try converting it to a float and try again"
```
Take a pause and read through the Docstrings (or descriptions) of these tools, these docstrings are a key component in making your Agent understand which tools it has in its arsenal.

The descriptions contribute to the overall prompt.

Something like this:


> — System prompt —


> You are a helpful chatbot expert in Maths , who can use these tools to answer the problems user asks:


> Tool 1: multiply (a: float, b: float):


> Tool 1 description: useful tool to Multiply two numbers and returns the product\\nmake sure that both numbers a, b are real numbers and if not try to convert them to real numbers\\nargs:\\na: float\\nb: float\\nrequires:\\nonly\_real\_numbers


> Tool 2: add (a:float, b:float):


> Tool 2 description: …..


> ….

So, you need to be very careful about what you are writing in the description, this makes the overall experience bugs free.

Let’s write a system prompt for our Agent. This system prompt is the most important step in building any Agent, since this is where you tell the Agent — **how to ACT**


```python
You are a math expert. You will only use the tools available to you.
IMPORTANT NOTE: You will ALWAYS evaluate the user's query and perfom query classification and provide three things:
answer, tool_used, reasoning

like this:

Answer: answer
Tool Used: tool_name
Reasoning: reasoning for using the tool

An example:

Answer: 21.0
Tool Used: multiply
Reasoning: The tool was used to calculate the product of two numbers.


Solve the queries STEP by STEP and feel free to use the tools available to you and do not hallucinate or make assumptions.
```
Next is initializing the FunctionCallingAgent Agent:

As discussed before remember what did we need inorder to build an Agent:

1. Prompting — we have defined that ✅
2. Chat History — Llamaindex Agents come with a default chat history ✅
3. Tool Calls — we have defined our tools ✅

So we would be good to start!


```python
from llama_index.core.agent import FunctionCallingAgent
from llama_index.core.tools import FunctionTool

add_tool = FunctionTool.from_defaults(fn=add)
multiply_tool = FunctionTool.from_defaults(fn=multiply)
real_number_tool = FunctionTool.from_defaults(fn=only_real_numbers)

class AgentController:
    def __init__(self):        
        self.llm = Generators().get_llm()
        self.system_prompt = """
                                You are a math expert. You will only use the tools available to you.
                                IMPORTANT NOTE: You will ALWAYS evaluate the user's query and perfom query classification and provide three things:
                                tool_used, reasoning, answer
                                
                                like this:

                                Answer: answer
                                Tool Used: tool_name
                                Reasoning: reasoning for using the tool

                                An example:

                                Answer: 21.0
                                Tool Used: multiply
                                Reasoning: The tool was used to calculate the product of two numbers.
                                
                                
                                Solve the queries STEP by STEP and feel free to use the tools available to you and do not hallucinate or make assumptions.
                                """
        self.agent = self.get_agent()

    def get_agent(self):
        agent = FunctionCallingAgent.from_tools([multiply_tool, add_tool,
                                                 real_number_tool],
                                        llm=self.llm,verbose=True,
                                        system_prompt=self.system_prompt)
        return agent
    
    def chat(self, query: str):
        response_obj = self.agent.chat(query)
        return response_obj
```

## A simple Agentic function call

In last section we built our Agent, now lets initialize the Agent and get some results!


```python
agent = AgentController()
query = "what is 2+2"
agent.chat(query)
```
Results:


```python
> Running step 93c07439-d533-4433-8c60-8112e529860e. Step input: what is 2+2
Added user message to memory: what is 2+2
=== Calling Function ===
Calling function: add with args: {"a": 2, "b": 2}
=== Function Output ===
4.0
> Running step 36b360f1-c7db-475a-b320-a574b73535bd. Step input: None
=== LLM Response ===
Answer: 4.0
Tool Used: add
Reasoning: The tool was used to calculate the sum of two numbers.
```
See that — our Agent did exactly what we asked from it,

1. It called the tool needed to add the numbers by passing the right args
2. It gave us the desired output we required in form of Answer, tool used and reasoning!

Boy! that was easy!


## Building a production ready Agentic Chatbot

We are done with the experimentation stage, in industry we call it as a POC (proof of concept), but the main challenge is to serve this app nicely so it can be used in production!

Let’s see the steps one by one.


### Project Structure

I would suggest you to follow this directory structure,

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*1YrzaOVqdY54pK-HV-N-zQ.png)


### Updating the Files

In **requirements.txt,** update it to:


```python
llama-index==0.12.2
llama-index-llms-ollama==0.4.1
Flask==3.1.0
llama-index-llms-groq==0.3.0
```
To install just execute:


```python
pip install -r requirements.txt
```
For any good debug \- able code you need loggers:

so in **src/utils/app\_logger.py**


```python
import logging

class GenericLogger:
    def __init__(self):
        """
        __init__ constructor for GenericLogger class
        
        Does nothing currently. Just a placeholder
        """
        pass

    def get_logger(self):
        """
        Gets a logger for the application with the level set to DEBUG
        
        The logger is configured to log to the console with the following format:
        %(asctime)s - %(name)s - %(levelname)s - %(message)s
        
        :return: A logger object
        """
        logger = logging.getLogger(__name__)
        logger.setLevel(logging.DEBUG)  

        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

        stream_handler = logging.StreamHandler()
        stream_handler.setFormatter(formatter)

        logger.addHandler(stream_handler)

        logger.propagate = False
        return logger
```
In **src/tools.py**

We will expand the initial solution to add more math tools and make the app more robust.


```python
## from dotenv import load_dotenv
## load_dotenv()
import math

session = dict()

def multiply(a: float, b: float) -> float:
    """useful tool to Multiply two numbers and returns the product
    make sure that both numbers a, b are real numbers and if not try to convert them to real numbers
    args:
        a: float
        b: float    
    requires:
        only_real_numbers
    """
    return float(a) * float(b)


def add(a: float, b: float) -> float:
    """useful tool to Add two numbers and returns the sum, 
    make sure that both numbers a, b are real numbers and if not try to convert them to real numbers
    args:
        a: float
        b: float    

    requires:
        only_real_numbers
    """
    return float(a) + float(b)

## add complex maths tools
def calculate_sin(a: float) -> float:
    """ useful tool to calculate the sin of a number
    IMPORTANT: the value of a will be in degrees, unless user specifically requests it to be in radians
    args: {"a": float}, required: True
    returns: sine of a degrees or radians if user requests
    """
    return math.sin(math.radians(float(a)))

def calculate_cos(a: float) -> float:
    """ useful tool to calculate the cos of a number
    IMPORTANT: the value of a will be in degrees, unless user specifically requests it to be in radians
    args: {"a": float}, required: True
    returns: cosine of a degrees or radians if user requests
    """
    return math.cos(math.radians(float(a)))



## add additional tools

def calculate_log(a: float) -> float:
    """ useful tool to calculate the logarithm of a number, smartly understands expects a float and returns a float and can access any other tools for solving complex problems
    args:
        a: float
    """
    return math.log(float(a))

def calculate_power(a: float, b: float) -> float:
    """ useful tool to calculate the exponential or power of a number a given the power b, smartly understands expects a float and returns a float
    detect cases like a^b and a**b route to this tool
    args:
        a: float
        b: float
    """
    return float(a) ** float(b)

def only_real_numbers(a: float) -> float:
    """ useful tool to verify if the number is real"""
    try: 
        float(a)
    except ValueError: 
        return f"{a} is not a real number so try converting it to a float and try again"

def convert_to_real_number(a: float) -> float:
    """ useful tool to convert a string to a real number"""
    try: 
        return float(a)
    except ValueError: 
        return f"{a} cannot be converted to a real number"    
    
def miscellaneous() -> str:
    """Handle miscellaneous tasks that do not fit into the other tools only returns a string"""
    return "Rephrase and give this answer in words: Hi there, I can't help you with that, if you have any other maths questions please ask them"


def divide(a: float, b: float) -> float:
    """useful tool to divide two numbers and returns the quotient
    make sure that both numbers a, b are real numbers and if not try to convert them to real numbers
    args:
        a: float
        b: float    
    requires:
        only_real_numbers
    """
    return float(a) / float(b)

def subtract(a: float, b: float) -> float:
    """useful tool to subtract two numbers and returns the difference
    make sure that both numbers a, b are real numbers and if not try to convert them to real numbers
    args:
        a: float
        b: float    
    requires:
        only_real_numbers
    """
    return float(a) - float(b)

def ask_name(name: str) -> str:
    """useful tool to ask the name of the user"""
    if session.get("name"):
        return "name is already set to " + session["name"]
    else:
        return "Hi there, what is your name?"

def update_name(name_provided_by_user: str) -> str:
    """useful tool to update the name of the user in memory"""
    session["name"] = name_provided_by_user

def greet_user_and_ask_name() -> str:
    """Useful tool to greet the user, asks for their name using the ask_name tool, keep it in memory and give user the list of 
    things they can do; don't provide tool names, give them functionality descriptions
    
    requires: ask_name, update_name"""
    return "tell the user in a friendly way what you can do"
```
let’s keep on adding the content

**src/agent\_controller.py**

This class will act as the Agent’s control


```python
from llama_index.core.agent import FunctionCallingAgent
from llama_index.core.tools import FunctionTool
from src.generators import Generators
from src.tools import *
from src.utils.app_logger import GenericLogger

logger = GenericLogger().get_logger()


add_tool = FunctionTool.from_defaults(fn=add)
multiply_tool = FunctionTool.from_defaults(fn=multiply)
miscellaneous_tool = FunctionTool.from_defaults(fn=miscellaneous)
sin_tool = FunctionTool.from_defaults(fn=calculate_sin)
cos_tool = FunctionTool.from_defaults(fn=calculate_cos)
log_tool = FunctionTool.from_defaults(fn=calculate_log)
exp_tool = FunctionTool.from_defaults(fn=calculate_power)
real_number_tool = FunctionTool.from_defaults(fn=only_real_numbers)
convert_to_real_number_tool = FunctionTool.from_defaults(fn=convert_to_real_number)
divide_tool = FunctionTool.from_defaults(fn=divide)
subtract_tool = FunctionTool.from_defaults(fn=subtract)
greet_user_tool = FunctionTool.from_defaults(fn=greet_user_and_ask_name)
ask_name_tool = FunctionTool.from_defaults(fn=ask_name)
update_name_tool = FunctionTool.from_defaults(fn=update_name)

class AgentController:
    def __init__(self):        
        """
        Initializes the AgentController class.

        This method creates an instance of the AgentController class with the LLaMA model and the system prompt.

        The system prompt is a string that is provided to the LLaMA model to generate responses.
        """

        logger.info("creating AgentController")
        self.llm = Generators().get_llm()
        self.system_prompt = """
                                INSTRUCTIONS: You are a maths tools expert. You are capable to have chain of thoughts and You will only use the tools available to you and without getting the function output you wouldn't proceed.

                                avoid getting into this mess like this:

                                Calling function: subtract with args: {"a": {"function": "subtract", "args": [{"function": "calculate_power", "args": [9, 16]}, {"function": "calculate_power", "args": [7, 18]}]}, "b": 3281711}
                                
                                always pass the desired inputs to the functions you call.

                                NOTE: You will ALWAYS evaluate the user's query and perfom query classification and provide three things:
                                answer, tool_used, reasoning.
                                
                                like this:

                                Answer: answer
                                - Tool Used: tool_name
                                - Reasoning: reasoning for using the tool

                                An example:

                                Answer: 21.0
                                - Tool Used: multiply
                                - Reasoning: The tool was used to calculate the product of two numbers.
                                
                                
                                Solve the queries STEP by STEP and feel free to use the tools available to you and do not hallucinate or make assumptions.
                                """
        self.agent = self.get_agent()
        logger.info("AgentController created")
    def get_agent(self):
        
        """
        Creates and returns a FunctionCallingAgent initialized with a set of tools and the specified language model.

        The agent is configured to use a variety of mathematical and utility tools, 
        and is provided with a system prompt for operation. It logs the creation process.

        :return: An initialized FunctionCallingAgent instance.
        """
        logger.info("creating Agent")
        agent = FunctionCallingAgent.from_tools([multiply_tool, add_tool, sin_tool, cos_tool, log_tool, exp_tool, 
                                                 real_number_tool ,convert_to_real_number_tool, miscellaneous_tool,
                                                 divide_tool, subtract_tool, greet_user_tool, ask_name_tool, update_name_tool], 
                                        llm=self.llm,verbose=True,
                                        system_prompt=self.system_prompt)
        logger.info("Agent created")
        return agent
    
    def chat(self, query: str):
        """
        Processes a chat query using the initialized agent and returns the response.

        This method sends a user query to the agent, which processes it using the available tools 
        and language model, and returns the generated response. 

        Args:
            query (str): The query string to be processed by the agent.
        
        Returns:
            The agent's response to the provided query.
        """
        response = self.agent.chat(query)
        return response
```
just like in the POC

add **src/generators.py**


```python
from llama_index.llms.ollama import Ollama
from llama_index.llms.groq import Groq

class Generators:
    def __init__(self, model="llama-3.3-70b-versatile"):
        # self.llm = Ollama(model=model, temperature=0)
        """
        Initializes the Generators class with a specified language model.

        Args:
            model (str): The name of the model to use. Defaults to "llama-3.3-70b-versatile".
        """
        self.llm = Groq(model=model, api_key="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", temperature=0)

    def get_llm(self):
        """
        Returns the currently initialized language model (LLM) instance.

        :return: The language model instance used by the Generators class.
        """
        return self.llm
```
We want to see the chatbot in a simple UI, so we can do that using Gradio

**simple\_ui.py**


```python
import gradio as gr
from src.agent_controller import AgentController
agent_controller = AgentController()
agent = agent_controller.get_agent()

def respond(message, history):
    # {"role": "user", "content": "message"}
    """
    Function to handle user input and return a response from the agent.

    Args:
        message (str): The user's message.
        history (list): The chat history.

    Returns:
        dict: A dictionary with the keys "role" and "content", where "role" is "assistant" and "content" is the response message.
    """
    response = agent.chat(message)
    response = {"role": "assistant", "content": response.response}
    return response    

def reset_agent():
    """
    Resets the agent's current chat history.

    This function prints the current chat history of the agent for logging purposes and
    resets it to clear any past interactions. This is useful for starting a new conversation
    session without any prior context.
    """
    print("resetting agent current chat history: ", agent.chat_history)
    agent.reset()

with gr.Blocks(theme=gr.themes.Default()) as demo:
    gr.Markdown("## Agentic Chatbot")
    gr.ChatInterface(
        respond,
        type="messages",
        chatbot=gr.Chatbot(height=450),
        textbox=gr.Textbox(placeholder="Ask me a maths question and hit enter", container=False, scale=7),
        description="Ask me anything about maths",
        theme="default"
    )
    button_reset =gr.Button("Reset Conversation", elem_id="reset")
    button_reset.click(reset_agent, inputs=[], outputs=[])

demo.launch(share=False)
```
and finally our main App using Flask

**app.py**


```python
## flask app
from flask import Flask
from src.agent_controller import AgentController
from flask import request

app = Flask(__name__)   
agent_controller = AgentController()
agent = agent_controller.get_agent()


@app.route('/chat', methods=['POST'])
def chat():
    """
    Handles POST requests to /chat.
    
    This function expects a JSON payload with a single key 'query' with a string value.
    The query is processed by the agent and the response is returned as a JSON string.
    """
    
    data = request.get_json()
    query = data['query']
    response = agent.chat(query)
    return response.response, 200

@app.route('/ping',methods=['GET'])
def ping():
    """
    Handles GET requests to /ping.
    
    This function simply returns a string 'Alive' as a confirmation of the
    application being alive.
    """
    
    return "Alive", 200

if __name__ == "__main__":
    app.run(debug=True)
```
Ideally the app.py file is used to run the python app and requests are sent using POST method to get the responses from the Agent but for the sake of visual pleasure we can directly interact using Gradio UI.

Now we are done with the Python code, let’s run the code once!


### Inference

run simple\_ui.py using:


```python
python ./simple_ui.py
```
Which will spin up the UI at [http://127\.0\.0\.1:7860/](http://127.0.0.1:7860/)

Now let’s ask it some maths questions:

***Query****: if x\+1993838 \= 373873873, solve for x*

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*MQT0LZ21BwkBMrKzzs6THg.png)

***Query****: what is sin(73\.5\)*

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*_cq571zygLZ42Tesj5YMfg.png)

It can even reason what to use to get the desired results!

***Query****: what is the probability of HTHH in coin toss of 4 coins using tools*

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*V-P-R8rFyAkwlqQLEHgq4w.png)

**Play with it more to understand how it works, find bugs and try to resolve them.**

To run the app instead of the UI, use:


```python
python ./app.py
```
which will start the app:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*G2JPVqcIwWcsNg1bzhlXRg.png)

To see if the app is up — go to [http://127\.0\.0\.1:5000/ping](http://127.0.0.1:5000/ping)

It should send Alive back!

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*__gOonIvCh0QSk98q9ji0g.png)

The requests can be made through Postman or using requests library on python.


## Docker Stuff

Using Docker we can ship our app as is to any container without any issues:

Add this file as **Dockerfile**


```python
## Use the official Python image as the base image
FROM python:3.10-slim

## Set the working directory in the container
WORKDIR /app

## Copy the requirements file into the container
COPY requirements.txt .

## Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

## Copy the rest of the project files into the container
COPY . .

## Make the script executable
RUN chmod +x start.sh

## Start the application
CMD ["./start.sh"]
```
If you see the code the main app is exposed on port 5000 and Gradio UI is on 7860 which are by defaults so we shouldn’t have any issues even if we run both of the files together.

To run on docker we need to execute 2 commands which can be done by creating a **start.sh** file:


```python
#!/bin/bash

python app.py &
python simple.py
```
To run on docker, build using:


```python
docker build -t agentic_app .
```
and run using:


```python
docker run -p 5000:5000 agentic_app
```

## Code — Github

The entire code can be cloned from:


## References

1. [https://screenrant.com/matrix\-agents\-powers\-origins\-role\-explained/](https://screenrant.com/matrix-agents-powers-origins-role-explained/)
2. <https://chatgpt.com/>
3. [https://www.docker.com/blog/docker\-best\-practices\-choosing\-between\-run\-cmd\-and\-entrypoint/](https://www.docker.com/blog/docker-best-practices-choosing-between-run-cmd-and-entrypoint/)
4. <https://www.gradio.app/docs>
5. <https://docs.llamaindex.ai/en/stable/examples/agent/react_agent/>
6. [https://console.groq.com/docs/api\-keys](https://console.groq.com/docs/api-keys)
7. <https://docs.llamaindex.ai/en/stable/understanding/agent/>
8. <https://docs.llamaindex.ai/en/stable/examples/workflow/react_agent/>


## Conclusions

Whew! This was long but I do hope it made sense! For any clarifications feel free to drop a comment!

Please clap and share this story to others if you feel like it helped you!

If you want to connect with me professionally please reach out to me on LinkedIn: <https://www.linkedin.com/in/sachink1729/>

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*gJ_ut9yPoitlvXoZoDs8aA.png)

Thank you!

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*q1Z_EPZw530KVVfD)


