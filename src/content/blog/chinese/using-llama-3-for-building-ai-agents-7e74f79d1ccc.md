---
title: "使用 Llama 3 构建 AI 代理"
meta_title: "使用 Llama 3 构建 AI 代理"
description: "使用 Llama 3 函数调用功能构建 AI 代理的综合指南。"
date: 2024-11-10T03:51:17Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*EWGo-7t4Kl6l82rB2-ZK9Q.png"
categories: ["Programming", "Generative AI", "Chatbots"]
author: "Rifx.Online"
tags: ["Llama", "Gradio", "RAG", "metadata", "indexing"]
draft: False

---



### 构建具有 Llama 3 函数调用能力的 AI 代理的综合指南



### 引言

想象一下你想买一些东西。你访问一个电子商务网站，使用搜索选项找到你想要的东西。也许你有多个物品要购买，因此这个过程并不是很高效。现在考虑这个场景：打开一个应用程序，用简单的英语描述你想要的东西，然后按下回车。你不必担心搜索和价格比较，因为应用程序会自动为你处理这些事情。很酷，对吧？这正是我们将在本教程中构建的内容。

让我们先看一些例子。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ikbr1ozv37PIB2meVfCCfA.png)

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*AZPn3_KCDRV0pAszd3vLmA.png)

好的，让我们为这个应用程序注入活力。我们将使用Meta的Llama 3模型，具有函数调用能力。不过，这也可以使用3.1模型来实现。根据[Meta的公告](https://ai.meta.com/blog/meta-llama-3-1/)，3.1模型可以更有效地使用工具和函数。

> 这些是多语言的，具有显著更长的上下文长度128K，最先进的工具使用能力，以及整体更强的推理能力。

我将使用Groq Cloud，特别是他们的模型来撰写本文。这个应用程序的初始工作流程应由一个嵌入模型、一个检索器和两个主要工具组成，用于处理用户的购买兴趣和与成本相关的关注。总之，我们需要一些类似于下面图表中描述的内容。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*EZVySX3GD2O07fzEPwLcbQ.png)

现在我们需要使用LLM编排框架。为此，我选择我一直以来最喜欢的[Haystack](https://haystack.deepset.ai/)。

好的，我们得到了我们需要的东西。让我们跳入实际工作吧！

### 加载和索引数据

由于我们有一个 RAG 流水线，应该将构建文档索引服务作为第一步。对于这个演示，我将使用 Haystack 提供的内存向量数据库。请注意，我们的向量数据库中的每个文档包含：

* 内容 — 我们用它来执行相似性搜索
* Id — 唯一标识符
* 价格 — 产品价格
* URL — 产品 URL

当我们的 RAG 流水线被调用时，内容字段用于向量搜索。所有其他字段作为元数据包含。保留这些元数据至关重要，因为它对前端呈现给用户是必不可少的。

让我们看看如何实现这一点。

```python
from haystack import Pipeline, Document
from haystack.document_stores.in_memory import InMemoryDocumentStore
from haystack.components.writers import DocumentWriter
from haystack.components.embedders import SentenceTransformersDocumentEmbedder
from haystack.components.generators import OpenAIGenerator
from haystack.utils import Secret
from haystack.components.generators.chat import OpenAIChatGenerator
from haystack.components.builders import PromptBuilder
from haystack.components.embedders import SentenceTransformersTextEmbedder
from haystack.components.retrievers.in_memory import InMemoryEmbeddingRetriever
from haystack.dataclasses import ChatMessage
import pandas as pd

## Load product data from CSV
df = pd.read_csv("product_sample.csv")

## Initialize an in-memory document store
document_store = InMemoryDocumentStore()

## Convert the product data into Haystack Document objects
documents = [
    Document(
        content=item.product_name, 
        meta={
            "id": item.uniq_id, 
            "price": item.selling_price, 
            "url": item.product_url
        }
    ) for item in df.itertuples()
]

## Create a pipeline for indexing the documents
indexing_pipeline = Pipeline()

## Add a document embedder to the pipeline using Sentence Transformers model
indexing_pipeline.add_component(
    instance=SentenceTransformersDocumentEmbedder(model="sentence-transformers/all-MiniLM-L6-v2"), name="doc_embedder"
)

## Add a document writer to the pipeline to store documents in the document store
indexing_pipeline.add_component(instance=DocumentWriter(document_store=document_store), name="doc_writer")

## Connect the embedder's output to the writer's input
indexing_pipeline.connect("doc_embedder.documents", "doc_writer.documents")

## Run the indexing pipeline to process and store the documents
indexing_pipeline.run({"doc_embedder": {"documents": documents}})
```
很好，我们已完成 AI 代理应用程序的第一步。现在是时候构建产品识别工具了。为了更好地理解产品识别器的主要任务，让我们考虑下面的示例。

> 用户查询：我想买一双露营靴、一台炭烤炉和一个 Google Pixel 9 的手机壳。让我们理解产品识别功能的理想工作流程。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*kXGYjlMi4pQcqIKpmUZLRQ.png)

首先，我们需要创建一个工具来分析用户查询并识别用户感兴趣的产品。我们可以使用下面的代码片段构建这样的工具。

### 构建用户查询分析器


```python
template = """
Understand the user query and list of products the user is interested in and return product names as list.
You should always return a Python list. Do not return any explanation.

Examples:
Question: I am interested in camping boots, charcoal and disposable rain jacket.
Answer: ["camping_boots","charcoal","disposable_rain_jacket"]

Question: Need a laptop, wireless mouse, and noise-cancelling headphones for work.
Answer: ["laptop","wireless_mouse","noise_cancelling_headphones"]

Question: {{ question }}
Answer:
"""

product_identifier = Pipeline()

product_identifier.add_component("prompt_builder", PromptBuilder(template=template))
product_identifier.add_component("llm", generator())

product_identifier.connect("prompt_builder", "llm")
```
好的，现在我们已经完成了第一个函数的一半，现在是时候通过添加RAG管道来完成这个函数。 

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*JyxINdc8Wz-qAg_PCAkLbA.png)

### 创建 RAG 管道


```python
template = """
Return product name, price, and url as a python dictionary. 
You should always return a Python dictionary with keys price, name and url for single product.
You should always return a Python list of dictionaries with keys price, name and url for multiple products.
Do not return any explanation.

Legitimate Response Schema:
{"price": "float", "name": "string", "url": "string"}
Legitimate Response Schema for multiple products:
[{"price": "float", "name": "string", "url": "string"},{"price": "float", "name": "string", "url": "string"}]

Context:
{% for document in documents %}
    product_price: {{ document.meta['price'] }}
    product_url: {{ document.meta['url'] }}
    product_id: {{ document.meta['id'] }}
    product_name: {{ document.content }}
{% endfor %}
Question: {{ question }}
Answer:
"""

rag_pipe = Pipeline()
rag_pipe.add_component("embedder", SentenceTransformersTextEmbedder(model="sentence-transformers/all-MiniLM-L6-v2"))
rag_pipe.add_component("retriever", InMemoryEmbeddingRetriever(document_store=document_store, top_k=5))
rag_pipe.add_component("prompt_builder", PromptBuilder(template=template))
rag_pipe.add_component("llm", generator())

rag_pipe.connect("embedder.embedding", "retriever.query_embedding")
rag_pipe.connect("retriever", "prompt_builder.documents")
rag_pipe.connect("prompt_builder", "llm")
```
在这个阶段，我们已经完成了 RAG 和查询分析器管道。现在是时候将其转换为工具了。为此，我们可以使用常规的函数声明，如下所示。为代理创建工具就像创建一个 Python 函数。如果你有这样的问题


> 代理如何调用这个函数？

解决方案很简单：通过利用特定模型的工具架构，我们计划在未来的步骤中纳入。目前，是时候创建一个包装函数，既使用查询分析器又使用 RAG 管道。

让我们明确这个函数的目标。

**目标 1：** 确定用户感兴趣的所有产品，并将它们作为列表返回。 **目标 2：** 对于每个识别的产品，从数据库中检索最多五个产品及其元数据。

### 完成产品识别功能


```python
def product_identifier_func(query: str):
    """
    根据给定的查询识别产品并检索每个识别产品的相关细节。

    参数：
    query (str): 用于识别产品的查询字符串。

    返回：
    dict: 一个字典，键为产品名称，值为每个产品的详细信息。如果未找到产品，则返回“No product found”。
    """
    product_understanding = product_identifier.run({"prompt_builder": {"question": query}})

    try:
        product_list = literal_eval(product_understanding["llm"]["replies"][0])
    except:
        return "No product found"

    results = {}

    for product in product_list:
        response = rag_pipe.run({"embedder": {"text": product}, "prompt_builder": {"question": product}})
        try:
            results[product] = literal_eval(response["llm"]["replies"][0])
        except:
            results[product] = {}
    
    return results
```
![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*HWRTdWvvcw2MZP4uoaQdeQ.png)

至此，我们完成了代理的第一个工具。让我们看看它是否按预期工作。


```python
query = "I want crossbow and woodstock puzzle"
#execute function
product_identifier_func(query)

## {'crossbow': {'name': 'DB Longboards CoreFlex Crossbow 41" Bamboo Fiberglass '
##                        'Longboard Complete',
##                'price': 237.68,
##                'url': 'https://www.amazon.com/DB-Longboards-CoreFlex-Fiberglass-Longboard/dp/B07KMVJJK7'},
##  'woodstock_puzzle': {'name': 'Woodstock- Collage 500 pc Puzzle',
##                       'price': 17.49,
##                       'url': 'https://www.amazon.com/Woodstock-Collage-500-pc-Puzzle/dp/B07MX21WWX'}}
```
它工作了！！然而，值得注意的是返回输出的结构。您可以在下面看到一般的结构。


```python
{
    "product_key": {
        "name": "string",
        "price": "float",
        "url": "string"
    }
}
```
这正是我们在RAG管道中建议模型生成的内容。下一步，让我们构建一个名为`find_budget_friendly_option`的可选工具。


```python
def find_budget_friendly_option(selected_product_details):
    """
    为每个产品类别找到最具预算友好的选项。

    参数：
    selected_product_details (dict): 一个字典，键为产品类别，值为产品详细信息的列表。每个产品详细信息应为包含“price”键的字典。

    返回：
    dict: 一个字典，键为产品类别，值为每个类别最具预算友好的产品详细信息。
    """
    budget_friendly_options = {}
    
    for category, items in selected_product_details.items():
        if isinstance(items, list):
            lowest_price_item = min(items, key=lambda x: x['price'])
        else:
            lowest_price_item = items
        
        budget_friendly_options[category] = lowest_price_item
    
    return budget_friendly_options
```
好的，让我们专注于这个应用程序最关键的方面，即使代理根据需要使用这些功能。正如我们之前所讨论的，这可以通过模型特定的工具架构来实现。因此，我们需要找到特定于所选模型的工具架构。幸运的是，它在模型卡中提到 [这里](https://huggingface.co/Groq/Llama-3-Groq-70B-Tool-Use)。我们需要调整它以适应我们的用例。

### 完成聊天模板


```python
chat_template = '''<|start_header_id|>system<|end_header_id|>

You are a function calling AI model. You are provided with function signatures within <tools></tools> XML tags. You may call one or more functions to assist with the user query. Don't make assumptions about what values to plug into functions. For each function call return a json object with function name and arguments within <tool_call></tool_call> XML tags as follows:
<tool_call>
{"name": <function-name>,"arguments": <args-dict>}
</tool_call>

Here are the available tools:
<tools>
    {
        "name": "product_identifier_func",
        "description": "To understand user interested products and its details",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The query to use in the search. Infer this from the user's message. It should be a question or a statement"
                }
            },
            "required": ["query"]
        }
    },
    {
        "name": "find_budget_friendly_option",
        "description": "Get the most cost-friendly option. If selected_product_details has morethan one key this should return most cost-friendly options",
        "parameters": {
            "type": "object",
            "properties": {
                "selected_product_details": {
                    "type": "dict",
                    "description": "Input data is a dictionary where each key is a category name, and its value is either a single dictionary with 'price', 'name', and 'url' keys or a list of such dictionaries; example: {'category1': [{'price': 10.5, 'name': 'item1', 'url': 'http://example.com/item1'}, {'price': 8.99, 'name': 'item2', 'url': 'http://example.com/item2'}], 'category2': {'price': 15.0, 'name': 'item3', 'url': 'http://example.com/item3'}}"
                }
            },
            "required": ["selected_product_details"]
        }
    }
</tools><|eot_id|><|start_header_id|>user<|end_header_id|>

I need to buy a crossbow<|eot_id|><|start_header_id|>assistant<|end_header_id|>

<tool_call>
{"id":"call_deok","name":"product_identifier_func","arguments":{"query":"I need to buy a crossbow"}}
</tool_call><|eot_id|><|start_header_id|>tool<|end_header_id|>

<tool_response>
{"id":"call_deok","result":{'crossbow': {'price': 237.68,'name': 'crossbow','url': 'https://www.amazon.com/crossbow/dp/B07KMVJJK7'}}}
</tool_response><|eot_id|><|start_header_id|>assistant<|end_header_id|>
'''
现在只剩下几个步骤。在做任何事情之前，让我们测试一下我们的代理。


```python
### 测试代理
messages = [
    ChatMessage.from_system(
        chat_template
    ),
    ChatMessage.from_user("I need to buy a crossbow for my child and Pokémon for myself."),
]

chat_generator = get_chat_generator()
response = chat_generator.run(messages=messages)
pprint(response)

### response
{'replies': [ChatMessage(content='<tool_call>\n'
                                 '{"id": 0, "name": "product_identifier_func", '
                                 '"arguments": {"query": "I need to buy a '
                                 'crossbow for my child"}}\n'
                                 '</tool_call>\n'
                                 '<tool_call>\n'
                                 '{"id": 1, "name": "product_identifier_func", '
                                 '"arguments": {"query": "I need to buy a '
                                 'Pokemon for myself"}}\n'
                                 '</tool_call>',
                         role=<ChatRole.ASSISTANT: 'assistant'>,
                         name=None,
                         meta={'finish_reason': 'stop',
                               'index': 0,
                               'model': 'llama3-groq-70b-8192-tool-use-preview',
                               'usage': {'completion_time': 0.217823967,
                                         'completion_tokens': 70,
                                         'prompt_time': 0.041348261,
                                         'prompt_tokens': 561,
                                         'total_time': 0.259172228,
                                         'total_tokens': 631}})]}
```
到此为止，我们已经完成了大约90%的工作。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*nYVXcgpm3RZ3g5h5d4UK_A.png)

在上面的响应中，您可能注意到XML标签`<tool_call>`封闭了工具调用。因此，我们需要开发一种机制来提取tool_call对象。


```python
def extract_tool_calls(tool_calls_str):
    json_objects = re.findall(r'<tool_call>(.*?)</tool_call>', tool_calls_str, re.DOTALL)
    
    result_list = [json.loads(obj) for obj in json_objects]
    
    return result_list

available_functions = {
    "product_identifier_func": product_identifier_func, 
    "find_budget_friendly_option": find_budget_friendly_option
    }
```
完成这一步后，我们可以直接访问代理的响应，当它调用一个工具时。现在唯一待做的就是获取工具调用对象并相应地执行函数。让我们完成那部分。


```python
messages.append(ChatMessage.from_user(message))
response = chat_generator.run(messages=messages)

if response and "<tool_call>" in response["replies"][0].content:
    function_calls = extract_tool_calls(response["replies"][0].content)
    for function_call in function_calls:
        # Parse function calling information
        function_name = function_call["name"]
        function_args = function_call["arguments"]

        # Find the corresponding function and call it with the given arguments
        function_to_call = available_functions[function_name]
        function_response = function_to_call(**function_args)

        # Append function response to the messages list using `ChatMessage.from_function`
        messages.append(ChatMessage.from_function(content=json.dumps(function_response), name=function_name))
        response = chat_generator.run(messages=messages)
```
现在是时候将每个组件组合在一起，构建一个合适的聊天应用程序。我将使用Gradio来实现这个目的。


```python
import gradio as gr

messages = [ChatMessage.from_system(chat_template)]
chat_generator = get_chat_generator()

def chatbot_with_fc(message, messages):
    messages.append(ChatMessage.from_user(message))
    response = chat_generator.run(messages=messages)

    while True:
        if response and "<tool_call>" in response["replies"][0].content:
            function_calls = extract_tool_calls(response["replies"][0].content)
            for function_call in function_calls:
                # Parse function calling information
                function_name = function_call["name"]
                function_args = function_call["arguments"]

                # Find the corresponding function and call it with the given arguments
                function_to_call = available_functions[function_name]
                function_response = function_to_call(**function_args)

                # Append function response to the messages list using `ChatMessage.from_function`
                messages.append(ChatMessage.from_function(content=json.dumps(function_response), name=function_name))
                response = chat_generator.run(messages=messages)

        # Regular Conversation
        else:
            messages.append(response["replies"][0])
            break
    return response["replies"][0].content


def chatbot_interface(user_input, state):
    response_content = chatbot_with_fc(user_input, state)
    return response_content, state

with gr.Blocks() as demo:
    gr.Markdown("# AI 购买助手")
    gr.Markdown("问我关于您想购买的产品！")
    
    state = gr.State(value=messages)
    
    with gr.Row():
        user_input = gr.Textbox(label="您的消息：")
        response_output = gr.Markdown(label="回复：")
    
    user_input.submit(chatbot_interface, [user_input, state], [response_output, state])
    gr.Button("发送").click(chatbot_interface, [user_input, state], [response_output, state])


demo.launch()
```
就这样！我们构建了基于Llama 3的AI代理🤖，具备函数调用能力。您可以从这个[GitHub仓库](https://github.com/Ransaka/ai-agents-with-llama3)访问完整代码。感谢您的阅读。

通过[这个](https://www.kaggle.com/datasets/promptcloud/amazon-product-dataset-2020)Kaggle链接（在CC0：公共领域下）可以访问本文使用的数据集。

### 结论

在构建基于AI代理的系统时，考虑完成任务所需的时间和每个任务使用的API调用（令牌）数量非常重要。一个主要的挑战是减少系统中的幻觉，这是一个活跃的研究领域。因此，构建LLM和代理系统没有固定的规则。必须耐心而有策略地工作，以确保AI代理，即LLM，正常运行。

*除非另有说明，所有图片均由作者提供。*

### 参考：

[https://docs.together.ai/docs/llama\-3\-function\-calling](https://docs.together.ai/docs/llama-3-function-calling)

