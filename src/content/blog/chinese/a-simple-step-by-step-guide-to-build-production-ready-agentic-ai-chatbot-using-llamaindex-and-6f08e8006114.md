---
title: "使用 Llamaindex 和 AI ChatBot 构建可投入生产的 Agentic 人工智能聊天机器人的简单分步指南。"
meta_title: "使用 Llamaindex 和 AI ChatBot 构建可投入生产的 Agentic 人工智能聊天机器人的简单分步指南。"
description: "本文介绍了如何使用 Llamaindex 和 Groq-Llama 3.3 构建一个端到端的代理型 AI 聊天机器人。文章首先解释了代理型 AI 的基本概念，澄清了围绕代理的误解，并强调了提示、聊天历史记录和工具调用在代理工作中的重要性。接着，文章详细介绍了如何使用 Llamaindex 创建 ReActAgent 和 FunctionCallingAgent，包括如何定义工具和系统提示。最后，文章展示了如何构建一个生产就绪的代理聊天机器人，包括项目结构、Docker 部署和 Flask 应用的实现。通过示例代码和详细的步骤，读者可以轻松地构建和部署自己的代理型 AI 聊天机器人。"
date: 2024-12-12T01:27:00Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*Z0XJdrkvHfsgT3z9.jpg"
categories: ["Chatbots", "Programming", "Generative AI"]
author: "Rifx.Online"
tags: ["Agentic", "Llamaindex", "Groq-Llama", "Docker", "Gradio"]
draft: False

---



## 介绍

在本文中，我们将了解如何使用 Llamaindex 和 Groq\-Llama 3.3 构建一个端到端的代理型 AI 聊天机器人。

在本文的课程中，您将学习：

1. 拨开代理型 AI 和代理的神秘面纱：消除围绕代理型 AI 的炒作
2. 了解 Llamaindex 中的 ReActAgent 和 FunctionCallingAgent 以及如何添加工具/函数
3. 一个简单的代理函数调用
4. 构建一个生产就绪的代理型聊天机器人——项目结构和使用 Docker 部署

## 揭开代理AI和代理的神秘面纱

最近，“代理”这个词变得非常热门，对于对AI知之甚少的普通人来说，这些代理看起来非常令人畏惧，这要感谢像《黑客帝国》（1999）这样的电影。



话虽如此，关于代理AI的整体概念仍然存在很多混淆，特别是对于普通大众来说，理解“一段代码自主工作并完成任务”的概念并不容易。

来到2024年：

当谈到与大型语言模型相关的代理时，

一切都是关于提示

我觉得没有比这更简单的说法了，我们利用LLM的文本生成功能，让LLM **充当代理**。

例如：

访问ChatGPT: <https://chatgpt.com/>

并输入以下内容：


> 从现在起，你将充当我烘焙业务的友好销售助理“Bake\-gent”，并询问用户他们想购买什么，这是产品目录：


> 面包 — $10


> 乳酪面包 — $12


> 可颂面包 — $15


> 无蛋布朗尼 — 4个 $20


> 除非我说“STOP”，否则你不得回答任何其他问题，只有当我明确说“STOP”时，你才会停止充当我的销售助理。

一个示例对话：[https://chatgpt.com/c/67541312\-0520\-800e\-9a0f\-864d57619295](https://chatgpt.com/share/6754141e-e090-800e-adc1-13fafec91a04)

如果你查看ChatGPT给出的回复，它们看起来非常有说服力，就像真的有一个销售助理一样，但实际上ChatGPT只是——**扮演**一个销售助理。

任何大型语言模型都没有“思考”能力，它只是一个经过数十亿行数据训练的非常复杂的文本生成模型。

因此，任何LLM代理只是文本提示，可以按照你的需求扮演任何角色。

——当然，这并不总是如此（此处插入哭泣的数据科学家）

为什么不是总是如此？你可能会问，因为它并不“思考”，

它只是——基于单词概率的文本生成，所以有时结果可能对你没有意义，但在数学上是完全合理的。

无论如何，重点是，它并不“思考”。

现在我们已经消除了围绕代理的炒作，让我们看看Llamaindex是如何创建像**ReActAgent**和**FunctionCallingAgent**这样的代理的。

## Llamaindex Agents : 通用代理

我在 Llamaindex 的博客中找到了一篇讨论 React Agents 在 Llamaindex 中如何工作的文章，任何代理的基本思想都是相同的。

链接: <https://docs.llamaindex.ai/en/stable/examples/workflow/react_agent/>

我们需要关注的内容在这一部分：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*fi7OnMrTmC0gQYJNFxiTuA.png)

所以，这里主要有三个需要理解的关键点：

1. 提示（文本）——这是驱动代理的力量，告诉它该做什么，类似于它的生存价值观。
2. 聊天历史记录——所有先前的用户和助手消息的记录，充当代理的记忆。
3. 工具调用——代理可以调用并获取结果的一组函数，然后可以用来解决问题，基本上是它的工作工具。

除此之外，这只是一个非常聪明地利用这三点的方法，使代理能够工作并**表现**得像是在没有帮助的情况下完成任务。

同样的概念可以应用于 Langchain、CrewAI 或其他提供的 100 种不同的代理框架。

现在基本概念已经清楚了，让我们看看如何具体使用 Llamaindex 代理。

## Llamaindex: FunctionCallingAgent 和工具

在开始之前，我希望你先熟悉 Groq，这将用于获取 Meta 最新模型 llama 3.3 的 LLM 推理。

前往 <https://console.groq.com/keys>，如果还没有注册，请注册并提取你的 API 密钥，该密钥将在整个应用中使用。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*LGLO37OzM0p-TpbGbLQqEg.png)

你应该创建自己的 API 密钥，然后复制它，保存在某个地方。

不要使用我的，它不会起作用，我会在之后立即删除它 :)

完成这些步骤后，让我们安装此练习所需的工具：

为了示例，我们使用一个 ipynb 笔记本，以便我们理解这里的目标，实验时始终使用笔记本 :).

或者如果你在 Jupyter Notebook 中，只需使用：


```python
!pip install llama-index==0.12.2 llama-index llms-ollama==0.4.1 Flask==3.1.0 llama-index-llms-groq==0.3.0
```
在一个单元格中，让我们构建生成器类，没有什么复杂的：


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
将你保存的 Groq API 密钥替换为 your\_groq\_api\_key

然后在另一个单元格中，初始化两个工具：


```python
import math

session = dict()

def multiply(a: float, b: float) -> float:
    """用于乘以两个数并返回乘积的工具
    确保 a 和 b 都是实数，如果不是，请尝试将它们转换为实数
    参数：
        a: float
        b: float    
    需要：
        only_real_numbers
    """
    return float(a) * float(b)


def add(a: float, b: float) -> float:
    """用于加两个数并返回和的工具
    确保 a 和 b 都是实数，如果不是，请尝试将它们转换为实数
    参数：
        a: float
        b: float    

    需要：
        only_real_numbers
    """
    return float(a) + float(b)

def only_real_numbers(a: float) -> float:
    """用于验证数字是否为实数的工具"""
    try: 
        float(a)
    except ValueError: 
        return f"{a} 不是实数，请尝试将其转换为浮点数并重试"
```
暂停一下，阅读这些工具的 Docstrings（或描述），这些 Docstrings 是使你的代理理解其可用工具的关键部分。

描述内容会构成整体的提示。

类似这样：


> — 系统提示 —


> 你是一个数学专家的聊天机器人，可以使用这些工具来回答用户的问题：


> 工具 1: multiply (a: float, b: float):


> 工具 1 描述: 用于乘以两个数并返回乘积\n确保 a 和 b 都是实数，如果不是，请尝试将它们转换为实数\n参数：\na: float\nb: float\n需要：\nonly\_real\_numbers


> 工具 2: add (a:float, b:float):


> 工具 2 描述: ….


> ….

因此，你在描述中写的每句话都需要非常小心，这会使整体体验更加无误。

让我们为代理编写一个系统提示。这是构建任何代理最重要的步骤，因为这是你告诉代理如何行动的地方。


```python
你是一个数学专家。你只会使用可用的工具。
重要提示：你将始终评估用户的查询并进行查询分类，提供三件事：
答案，使用的工具，推理

例如：

答案: 21.0
使用的工具: multiply
推理: 使用该工具计算两个数的乘积。


逐步解决查询，并自由使用可用的工具，不要凭空想象或做出假设。
```
接下来是初始化 FunctionCallingAgent 代理：

如前所述，记得我们构建代理需要什么：

1. 提示 —— 我们已经定义了 ✅
2. 聊天历史 —— Llamaindex 代理带有默认的聊天历史 ✅
3. 工具调用 —— 我们已经定义了工具 ✅

所以我们可以开始！


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
                                你是一个数学专家。你只会使用可用的工具。
                                重要提示：你将始终评估用户的查询并进行查询分类，提供三件事：
                                使用的工具，推理，答案
                                
                                例如：

                                答案: 答案
                                使用的工具: 工具名称
                                推理: 使用工具的原因

                                示例：

                                答案: 21.0
                                使用的工具: multiply
                                推理: 使用该工具计算两个数的乘积。
                                
                                
                                逐步解决查询，并自由使用可用的工具，不要凭空想象或做出假设。
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

## 一个简单的代理函数调用

在上一节中，我们构建了我们的代理，现在让我们初始化代理并获取一些结果！


```python
agent = AgentController()
query = "what is 2+2"
agent.chat(query)
```
结果：


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
看到没有——我们的代理完全按照我们的要求做了，

1. 它通过传递正确的参数调用了所需的工具来加法运算
2. 它以答案、使用的工具和推理的形式给出了我们所需的输出！

真简单！

## 构建生产就绪的代理聊天机器人

我们已经完成了实验阶段，业内称之为POC（概念验证），但主要的挑战是让这个应用能够顺利运行，以便在生产环境中使用！

让我们一步一步来看这些步骤。

### 项目结构

我建议你遵循以下目录结构，

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*1YrzaOVqdY54pK-HV-N-zQ.png)

### 更新文件

在 **requirements.txt** 中，更新为：


```python
llama-index==0.12.2
llama-index-llms-ollama==0.4.1
Flask==3.1.0
llama-index-llms-groq==0.3.0
```
要安装这些依赖项，只需执行：


```python
pip install -r requirements.txt
```
为了编写可调试的代码，你需要日志记录器：

因此，在 **src/utils/app_logger.py** 中：


```python
import logging

class GenericLogger:
    def __init__(self):
        """
        __init__ 构造函数，用于 GenericLogger 类
        
        当前不执行任何操作，仅作为占位符
        """
        pass

    def get_logger(self):
        """
        获取应用程序的日志记录器，日志级别设置为 DEBUG
        
        日志记录器配置为以以下格式记录到控制台：
        %(asctime)s - %(name)s - %(levelname)s - %(message)s
        
        :return: 日志记录器对象
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
在 **src/tools.py** 中：

我们将扩展初始解决方案，添加更多的数学工具，使应用程序更加健壮。


```python
## from dotenv import load_dotenv
## load_dotenv()
import math

session = dict()

def multiply(a: float, b: float) -> float:
    """用于乘以两个数并返回乘积的工具
    确保 a 和 b 都是实数，如果不是，尝试将它们转换为实数
    参数：
        a: float
        b: float    
    要求：
        only_real_numbers
    """
    return float(a) * float(b)


def add(a: float, b: float) -> float:
    """用于将两个数相加并返回和的工具
    确保 a 和 b 都是实数，如果不是，尝试将它们转换为实数
    参数：
        a: float
        b: float    

    要求：
        only_real_numbers
    """
    return float(a) + float(b)

## 添加复杂的数学工具
def calculate_sin(a: float) -> float:
    """用于计算一个数的正弦值的工具
    重要提示：a 的值默认为度数，除非用户特别要求为弧度
    参数：{"a": float}，必需：True
    返回：a 的正弦值，单位为度数或用户请求的弧度
    """
    return math.sin(math.radians(float(a)))

def calculate_cos(a: float) -> float:
    """用于计算一个数的余弦值的工具
    重要提示：a 的值默认为度数，除非用户特别要求为弧度
    参数：{"a": float}，必需：True
    返回：a 的余弦值，单位为度数或用户请求的弧度
    """
    return math.cos(math.radians(float(a)))



## 添加其他工具

def calculate_log(a: float) -> float:
    """用于计算一个数的对数值的工具，智能地期望一个浮点数并返回一个浮点数，可以访问其他工具来解决复杂问题
    参数：
        a: float
    """
    return math.log(float(a))

def calculate_power(a: float, b: float) -> float:
    """用于计算一个数的指数或幂的工具，智能地期望一个浮点数并返回一个浮点数
    检测 a^b 和 a**b 的情况并路由到此工具
    参数：
        a: float
        b: float
    """
    return float(a) ** float(b)

def only_real_numbers(a: float) -> float:
    """用于验证一个数是否为实数的工具"""
    try: 
        float(a)
    except ValueError: 
        return f"{a} 不是实数，尝试将其转换为浮点数并重试"

def convert_to_real_number(a: float) -> float:
    """用于将字符串转换为实数的工具"""
    try: 
        return float(a)
    except ValueError: 
        return f"{a} 无法转换为实数"    
    
def miscellaneous() -> str:
    """处理不符合其他工具的任务，仅返回字符串"""
    return "用文字重新表述并给出此答案：你好，我无法帮助你解决这个问题，如果你有其他数学问题，请随时提问"

def divide(a: float, b: float) -> float:
    """用于除以两个数并返回商的工具
    确保 a 和 b 都是实数，如果不是，尝试将它们转换为实数
    参数：
        a: float
        b: float    
    要求：
        only_real_numbers
    """
    return float(a) / float(b)

def subtract(a: float, b: float) -> float:
    """用于减去两个数并返回差的工具
    确保 a 和 b 都是实数，如果不是，尝试将它们转换为实数
    参数：
        a: float
        b: float    
    要求：
        only_real_numbers
    """
    return float(a) - float(b)

def ask_name(name: str) -> str:
    """用于询问用户姓名的工具"""
    if session.get("name"):
        return "姓名已设置为 " + session["name"]
    else:
        return "你好，你的名字是什么？"

def update_name(name_provided_by_user: str) -> str:
    """用于在内存中更新用户姓名的工具"""
    session["name"] = name_provided_by_user

def greet_user_and_ask_name() -> str:
    """用于友好地问候用户，使用 ask_name 工具询问他们的姓名，将其存储在内存中，并告知用户可以做什么；不提供工具名称，仅提供功能描述
    
    要求：ask_name, update_name"""
    return "友好地告知用户你可以做什么"
```
继续添加内容

**src/agent_controller.py**

此类将作为代理的控制类


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
        初始化 AgentController 类。

        此方法创建一个 AgentController 类的实例，使用 LLaMA 模型和系统提示。

        系统提示是提供给 LLaMA 模型以生成响应的字符串。
        """

        logger.info("创建 AgentController")
        self.llm = Generators().get_llm()
        self.system_prompt = """
                                指令：你是一个数学工具专家。你能够进行思维链推理，但只能使用可用的工具，并且在没有获取函数输出的情况下不会继续进行。

                                避免出现这种情况：

                                调用函数：subtract，参数：{"a": {"function": "subtract", "args": [{"function": "calculate_power", "args": [9, 16]}, {"function": "calculate_power", "args": [7, 18]}]}, "b": 3281711}
                                
                                始终将所需的输入传递给调用的函数。

                                注意：你将始终评估用户的查询并进行查询分类，提供三件事：
                                答案，使用的工具，推理过程。
                                
                                例如：

                                答案：21.0
                                - 使用的工具：multiply
                                - 推理过程：该工具用于计算两个数的乘积。
                                
                                
                                逐步解决查询，并自由使用可用的工具，不要凭空想象或做出假设。
                                """
        self.agent = self.get_agent()
        logger.info("AgentController 创建完成")
    def get_agent(self):
        
        """
        创建并返回一个 FunctionCallingAgent，初始化为一组工具和指定的语言模型。

        代理配置为使用各种数学和实用工具，提供操作的系统提示，并记录创建过程。

        :return: 初始化的 FunctionCallingAgent 实例。
        """
        logger.info("创建 Agent")
        agent = FunctionCallingAgent.from_tools([multiply_tool, add_tool, sin_tool, cos_tool, log_tool, exp_tool, 
                                                 real_number_tool ,convert_to_real_number_tool, miscellaneous_tool,
                                                 divide_tool, subtract_tool, greet_user_tool, ask_name_tool, update_name_tool], 
                                        llm=self.llm,verbose=True,
                                        system_prompt=self.system_prompt)
        logger.info("Agent 创建完成")
        return agent
    
    def chat(self, query: str):
        """
        使用初始化的代理处理聊天查询并返回响应。

        此方法将用户查询发送给代理，代理使用可用的工具和语言模型处理查询，并返回生成的响应。

        参数：
            query (str): 要由代理处理的查询字符串。
        
        返回：
            代理对提供的查询的响应。
        """
        response = self.agent.chat(query)
        return response
```
就像在 POC 中一样

添加 **src/generators.py**


```python
from llama_index.llms.ollama import Ollama
from llama_index.llms.groq import Groq

class Generators:
    def __init__(self, model="llama-3.3-70b-versatile"):
        # self.llm = Ollama(model=model, temperature=0)
        """
        使用指定的语言模型初始化 Generators 类。

        Args:
            model (str): 要使用的模型名称。默认为 "llama-3.3-70b-versatile"。
        """
        self.llm = Groq(model=model, api_key="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", temperature=0)

    def get_llm(self):
        """
        返回当前初始化的语言模型 (LLM) 实例。

        :return: Generators 类使用的语言模型实例。
        """
        return self.llm
```
我们希望在简单的 UI 中看到聊天机器人，因此我们可以使用 Gradio 来实现

**simple\_ui.py**


```python
import gradio as gr
from src.agent_controller import AgentController
agent_controller = AgentController()
agent = agent_controller.get_agent()

def respond(message, history):
    # {"role": "user", "content": "message"}
    """
    处理用户输入并返回代理的响应。

    Args:
        message (str): 用户的消息。
        history (list): 聊天历史记录。

    Returns:
        dict: 包含 "role" 和 "content" 键的字典，其中 "role" 为 "assistant"，"content" 为响应消息。
    """
    response = agent.chat(message)
    response = {"role": "assistant", "content": response.response}
    return response    

def reset_agent():
    """
    重置代理的当前聊天历史记录。

    此函数打印代理的当前聊天历史记录以供记录，并重置它以清除任何过去的交互。这对于在没有先前上下文的情况下开始新的对话会话非常有用。
    """
    print("重置代理当前聊天历史记录: ", agent.chat_history)
    agent.reset()

with gr.Blocks(theme=gr.themes.Default()) as demo:
    gr.Markdown("## Agentic Chatbot")
    gr.ChatInterface(
        respond,
        type="messages",
        chatbot=gr.Chatbot(height=450),
        textbox=gr.Textbox(placeholder="问我一个数学问题并按回车键", container=False, scale=7),
        description="问我任何关于数学的问题",
        theme="default"
    )
    button_reset = gr.Button("重置对话", elem_id="reset")
    button_reset.click(reset_agent, inputs=[], outputs=[])

demo.launch(share=False)
```
最后，我们使用 Flask 构建主应用程序

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
    处理发送到 /chat 的 POST 请求。
    
    此函数期望一个包含单个键 'query' 的 JSON 负载，值为字符串。
    该查询由代理处理，并以 JSON 字符串的形式返回响应。
    """
    
    data = request.get_json()
    query = data['query']
    response = agent.chat(query)
    return response.response, 200

@app.route('/ping',methods=['GET'])
def ping():
    """
    处理发送到 /ping 的 GET 请求。
    
    此函数简单地返回一个字符串 'Alive'，以确认应用程序正在运行。
    """
    
    return "Alive", 200

if __name__ == "__main__":
    app.run(debug=True)
```
理想情况下，`app.py` 文件用于运行 Python 应用程序，并使用 POST 方法发送请求以从代理获取响应，但为了视觉效果，我们可以直接通过 Gradio UI 进行交互。

现在我们已经完成了 Python 代码，让我们运行一次代码！

### 推理

使用以下命令运行 `simple_ui.py`：

```python
python ./simple_ui.py
```
这将在 [http://127.0.0.1:7860/](http://127.0.0.1:7860/) 启动 UI。

现在让我们问它一些数学问题：

***查询***: 如果 x+1993838 = 373873873，求解 x

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*MQT0LZ21BwkBMrKzzs6THg.png)

***查询***: sin(73.5) 的值是多少

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*_cq571zygLZ42Tesj5YMfg.png)

它甚至可以推理出使用哪些工具来获得所需的结果！

***查询***: 抛四枚硬币时，出现 HTHH 的概率是多少

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*V-P-R8rFyAkwlqQLEHgq4w.png)

**更多地尝试以了解其工作原理，发现并尝试解决其中的错误。**

如果要运行应用程序而不是 UI，请使用以下命令：

```python
python ./app.py
```
这将启动应用程序：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*G2JPVqcIwWcsNg1bzhlXRg.png)

要检查应用程序是否已启动，请访问 [http://127.0.0.1:5000/ping](http://127.0.0.1:5000/ping)

它应该返回 "Alive"！

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*__gOonIvCh0QSk98q9ji0g.png)

请求可以通过 Postman 或使用 Python 的 requests 库进行。

## Docker 相关内容

使用 Docker，我们可以将应用无任何问题地部署到任何容器中：

将此文件命名为 **Dockerfile**


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
从代码中可以看出，主应用暴露在 5000 端口，Gradio UI 暴露在 7860 端口，这些都是默认设置，因此即使同时运行这两个文件也不会有问题。

要在 Docker 中运行，需要执行 2 个命令，可以通过创建一个 **start.sh** 文件来完成：


```python
#!/bin/bash

python app.py &
python simple.py
```
要在 Docker 中运行，构建镜像使用：


```python
docker build -t agentic_app .
```
运行容器使用：


```python
docker run -p 5000:5000 agentic_app
```

## 代码 — Github

整个代码可以从以下地址克隆：

## 参考资料

1. [https://screenrant.com/matrix\-agents\-powers\-origins\-role\-explained/](https://screenrant.com/matrix-agents-powers-origins-role-explained/)
2. <https://chatgpt.com/>
3. [https://www.docker.com/blog/docker\-best\-practices\-choosing\-between\-run\-cmd\-and\-entrypoint/](https://www.docker.com/blog/docker-best-practices-choosing-between-run-cmd-and-entrypoint/)
4. <https://www.gradio.app/docs>
5. <https://docs.llamaindex.ai/en/stable/examples/agent/react_agent/>
6. [https://console.groq.com/docs/api\-keys](https://console.groq.com/docs/api-keys)
7. <https://docs.llamaindex.ai/en/stable/understanding/agent/>
8. <https://docs.llamaindex.ai/en/stable/examples/workflow/react_agent/>

## 结论

呼！虽然很长，但希望你能理解！如果有任何需要澄清的地方，请随时留言！

如果你觉得这篇文章对你有帮助，请点赞并分享给其他人！

如果你想与我建立职业联系，请通过 LinkedIn 联系我：<https://www.linkedin.com/in/sachink1729/>

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*gJ_ut9yPoitlvXoZoDs8aA.png)

谢谢！

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*q1Z_EPZw530KVVfD)

