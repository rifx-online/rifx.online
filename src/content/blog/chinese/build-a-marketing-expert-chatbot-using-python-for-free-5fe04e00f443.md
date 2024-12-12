---
title: "使用 Python 免费构建营销专家聊天机器人！"
meta_title: "使用 Python 免费构建营销专家聊天机器人！"
description: "本文介绍了如何使用 Python 和 DSPy 构建一个免费的营销专家聊天机器人。项目流程包括收集 Google API 密钥、安装 DSPy 包、配置语言模型、定义 DSPy 签名、创建链式思维模块类、初始化对象以及使用聊天机器人。文章详细描述了每个步骤的实现方法，并提供了完整的代码示例。通过这些步骤，可以构建一个能够回答营销相关问题的专业聊天机器人。"
date: 2024-12-12T01:36:35Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*CDuCa3Bcol5tqbuz"
categories: ["Programming", "Chatbots", "Marketing"]
author: "Rifx.Online"
tags: ["Python", "chatbot", "DSPy", "Gemini", "marketing"]
draft: False

---

### 使用 Python 和 DSPY 构建的营销聊天机器人



### 构建您的营销专家助手，专门用于回答您所有的营销相关问题，使用 Python 和 DSPy。

> ***还不是会员？请随意访问完整文章 [here](https://readmedium.com/build-a-marketing-expert-chatbot-using-python-for-free-5fe04e00f443?sk=f8d1bbfd3d03229b839000104e87da79)。***

营销是影响产品成败的关键因素之一。除了影响销售增长、品牌建设和客户获取外，它还影响客户忠诚度。



了解营销对任何项目的好处和重要性。我们将创建一个营销专家，帮助您解决所有营销相关的问题。

那么，让我们开始吧。

以下是本文的目录，供您参考。


> **· 项目工作流程· 收集前置条件（Google API 密钥）· 安装包 ∘ DSPy· 编写代码 ∘ 代码结构 ∘ DSPy 模型配置（gemini-flash-1.5） ∘ DSPy 签名 ∘ CoT 类（使用 DSPy 链式思维模块） ∘ CoT 对象 ∘ 使用聊天机器人· 完整代码库· 结论· 作者的话** 

那么，让我们开始吧。

## 项目工作流程

在我们实际开始项目工作之前，先让我们明确一下我们营销聊天机器人的工作流程。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*W2F3J1-tCH18NsqNwdufZg.png)

## 收集先决条件（Google API 密钥）

让我们收集构建项目所需的一些要求。

在这个项目中，我们将使用 Google 的 `gemini-1.5-flash` 模型作为我们的基础 LLM，为此，我们需要 Google 的 API 密钥来查询模型并获取其响应。

要获取您自己的免费 Google API 密钥，只需按照以下两个简单步骤操作，

1. 访问 <https://aistudio.google.com/app/apikey>
2. 登录您的 Google 账户后，点击 `Create API key`。
3. 选择任何一个现有的 Google Cloud 项目。
4. 点击 `Create API key in existing project`。
5. 完成！保存此 API 密钥以备后用。

## 安装包

现在，让我们安装一些将在项目中使用的包。这些包是,\-

### DSPy

DSPy 是一个用于以真正声明性和模块化方式编程基础模型（包括大型语言模型和检索模型）的框架。它附带了一个自动编译器，该编译器指导 LLM 执行这些声明性步骤，最终使我们能够专注于高层逻辑，而将语言模型的微调交给专门的优化器。

您可以在此处阅读更多关于此框架的信息 [这里](https://python.langchain.com/docs/integrations/providers/dspy/)。

我们将使用该包中的一个重要方法，称为 `Chain Of Thought`。它的作用是将查询修改为一个结构良好的提示，包含 LM 模型回答问题所需的所有指令和上下文。

要下载该包，请在终端中使用以下命令。


```python
pip install dspy==0.1.5
```

## 编写代码

现在，我们已经具备了所有必要的前提条件和包，可以开始真正的编码了。所以，让我们开始吧。

### 代码结构

让我们首先通过以下插图来理解代码的结构。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*VNY_JB8vVlOdszQQ_mq-ng.png)

此插图提到了一个类 `CoT`，它将作为我们的营销专家聊天机器人，回答我们所有的查询。

该类包含两个方法 `__init__()` 和 `forward()`。构造函数用于初始化 DSPy 包的 Chain Of Thought 模块。

Chain Of Thought 模块本身需要一个 DSPy 签名，其中包含我们的初始提示，即我们希望提供给模型的所有高级指令。

因此，在理解了结构之后，我们知道要按什么顺序进行。

> **DSPy 模型配置(gemini\-flash\-1\.5) \-\> DSPy 签名 \-\> CoT 类（带有 DSPy Chain Of Thought 模块）\-\> CoT 对象 \-\> 使用聊天机器人**

现在让我们按顺序完成这些步骤，\-

### DSPy 模型配置 (gemini\-flash\-1\.5\)

在使用模型之前，我们需要将语言模型配置为 `dspy` 设置，并且为此，我们将需要之前创建的 Google API 密钥。

要将 `dspy` 与模型配置，


```python
import dspy

gemini = dspy.Google(model='gemini-1.5-flash', api_key="<YOUR_GOOGLE_API_KEY>", temperature=0.3)
dspy.settings.configure(lm=gemini)
```
这里，你需要将 `<YOUR_GOOGLE_API_KEY>` 替换为你的 API 密钥。此外，我将温度设置为 0.3，表示稍微增加一些创造力。你可以尝试不同的值，选择从 0 到 1 之间的任何值（创造力随值增大而减少）。

### DSPy 签名

DSPy 签名包含高级指令，这些指令是你希望提供给模型的，基于这些指令，DSPy 会定制和优化语言模型以适应使用场景。

要定义一个 DSPy 签名，

```python
## 定义继承自 dspy.Signature 的 MarketingChatbot 类
class MarketingChatbot(dspy.Signature):
  """你是一个营销聊天机器人，主要目标是回答用户的营销问题。

  你可能会收到提示和响应的历史记录，回答问题时请使用这些历史记录作为上下文。

  你的所有回答都必须严格限定在营销领域。

  如果查询中包含与营销无关的内容，你必须礼貌地拒绝回答。
  """

  # 所有的输入和输出变量，以及它们的描述。
  history = dspy.InputField(desc="提示和响应的历史记录")
  query = dspy.InputField(desc="用户的查询。")
  answer = dspy.OutputField(desc="对用户查询的回答。")
```
MarketingChatbot 类继承了 `dspy.Signature` 的所有方法和对象，用于作为签名。

在这里，定义在 `""" """` 之间的类描述包括根据使用场景定制和优化语言模型参数的指令。你可以更改此描述以查看模型的响应。

在这里，我们声明了三个变量，分别是 `history`、`query` 和 `answer`。用户可能会对聊天机器人生成的响应提出反问，因此模型需要有先前消息的上下文，这一目的由 `history` 变量实现。`query` 变量用于记录用户提出的任何问题或查询，而 `answer` 则包含模型的响应。

所有输入变量都是 `dspy.InputField()` 的对象，所有输出变量都应是 `dspy.OutputField()` 的对象。

### CoT 类（带有 DSPy 链式思维模块）

现在，我们已经将基础 LM 模型配置为 DSPy 设置，并创建了带有初始提示或指令的签名，接下来可以创建初始化链式思维模块并处理所有输入和输出变量的类。

定义一个 CoT 类，


```python
import dspy

## The CoT class
class CoT(dspy.Module):

  # The constructor
  def __init__(self):
    super().__init__()
    self.program = dspy.ChainOfThought(MarketingChatbot)
  
  # The method used for calling the model.
  def forward(self, history, query):
    return self.program(history=history, query=query)
```
这里，类 `CoT` 继承了 `dspy.Module`，这有助于访问类中定义的所有基础方法。

构造函数初始化 `dspy.ChainOfThought()` 方法，使用我们之前定义的签名。传递的签名确保在调用函数时传递所有输入变量，并给出结构化传递的用户查询和优化模型参数的指令。它返回基础 LM 的响应（`answer`）。

类中定义的 `forward` 方法处理我们之前定义的所有输入变量，并返回链式思维模块的程序对象的响应，该响应包含基础 LM 模型的响应。

### CoT 对象

至此，我们已经完成了所有的工作，只需要创建一个 `CoT` 类的对象并开始查询它。

对象的创建通常很简单，没有复杂的操作。

```python
## 初始化 CoT 类的对象
marketingChatbot = CoT()
```

### 使用聊天机器人

要使用聊天机器人，我们只需要调用 `marketingChatbot` 对象的 `forward()` 方法，传入用户的 `query` 和聊天记录 `history`。

聊天机器人的使用方法如下：


```python
## 获取聊天记录和响应历史
history = gemini.history.copy()

## 用户的查询
query = "我正在构建一个免费的营销聊天机器人，请为它制定一个营销计划。"

## 从聊天机器人获取响应
response = marketingChatbot.forward(history=history, query=query)

## 打印从生成的响应中获取的查询答案
print(response.answer)
```
运行代码后，生成的输出如下所示。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*qKIa12bZZLkGBM7b5UaJmg.png)

在这里，生成的响应中我们可以注意到它包含了标题和项目符号的正确 Markdown 格式。除了结构良好的答案外，我们还可以看到生成的响应的质量。答案简洁明了，几乎涵盖了所有方面，证明了它是一个专业的营销助手。

## 完整代码库

我们营销聊天机器人的完整编译代码库如下，

## 结论

这是对本文讨论内容的简要总结。

* `DSPy` 是一个用于以真正声明性和模块化方式编程基础模型（包括大语言模型和检索模型）的框架。它附带一个自动编译器，指导语言模型执行这些声明性步骤，最终使我们能够专注于高层次逻辑，而将语言模型的微调交给专门的优化器。
* 本文讨论了使用基础模型配置 DSPy、创建 DSPy 签名以及在 DSPy 的链式思维模块中使用它的方法。

## 作者的话

感谢您阅读本文。如果您有任何问题或建议，请随时在评论区留言。我非常欢迎反馈。

