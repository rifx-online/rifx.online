---
title: "Qwen2.5-Coder 32B Instruct：最佳编码模型--完整的分步指南和性能..."
meta_title: "Qwen2.5-Coder 32B Instruct：最佳编码模型--完整的分步指南和性能..."
description: "Qwen2.5-Coder系列，尤其是32B模型，在代码生成、修复和推理方面展现出强大的性能，能够与GPT-4o等成熟模型相媲美。该模型支持超过40种编程语言，适应多种开发需求，提供灵活的模型选择。通过基准测试，Qwen2.5-Coder在多项指标中表现优异，适用于编码助手、自动化代码审查和教育工具等场景，推动开源代码生成的进步。"
date: 2024-11-14T03:29:09Z
image: "https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*zjZmLCEX5URAc1wxTGnBRQ.png"
categories: ["Programming", "Machine Learning", "Generative AI"]
author: "Rifx.Online"
tags: ["Qwen2.5", "Coder", "programming", "languages", "repair"]
draft: False

---

### 学习如何在本地安装 Qwen2.5-Coder，探索其卓越的编码能力，并通过实践示例评估其性能



## 介绍

在不断发展的AI驱动编程工具领域，大型语言模型（LLMs）显著改变了开发者编写、调试和优化代码的方式。今天，我们很高兴探索**Qwen2.5-Coder**系列，这是一项开源的奇迹，承诺在代码生成和AI编码助手领域树立新的标准。该系列的最新版本**Qwen2.5-Coder-32B-Instruct**重新定义了开源编码模型的最新技术水平（SOTA），与**GPT-4o**等成熟模型的能力相媲美。让我们深入了解是什么让Qwen2.5-Coder如此“强大”、“多样”和“实用”。

在本综合指南中，我们将探讨**Qwen2.5-Coder-32B**模型的核心能力。我们将演示如何使用`transformers`库，测试其编码能力并突出其实际应用。

## 为什么选择 Qwen2\.5\-Coder?

### 关键亮点

1. **强大**：旗舰 **Qwen2\.5\-Coder\-32B** 模型在主要编码基准测试中与 GPT\-4 的编码能力相匹配，同时在一般和数学技能方面表现优异。
2. **多样**：此次发布涵盖多种模型尺寸（0\.5B, 1\.5B, 3B, 7B, 14B, 32B），为不同资源限制提供灵活性。
3. **实用**：旨在用于实际应用，包括代码助手和文档生成。模型采用 **Apache 2\.0** 许可，确保可自由使用和修改，适用于商业和研究目的。

## Qwen2\.5\-Coder系列：开放代码LLM的游戏规则改变者

**Qwen2\.5\-Coder**系列致力于推动开源代码生成的边界。该版本专注于灵活性和可扩展性，包含多种规模的模型：**0\.5B, 1\.5B, 3B, 7B, 14B**，以及旗舰版**32B**。这些模型满足了不同开发者的需求，从轻量级、资源高效的模型到适用于高要求应用的高容量、功能丰富的模型。

### 1\. 强大：在代码生成中设定新标准

Qwen2\.5\-Coder\-32B\-Instruct 作为旗舰模型，拥有一系列能力，使其获得了 **当前 SOTA 开源代码模型** 的称号。它在以下方面表现出色：

* **代码生成**：在 **EvalPlus、LiveCodeBench** 和 **BigCodeBench** 等热门基准测试中，其性能与 GPT\-4o 相匹配，能够在多种场景中提供精确的代码生成。
* **代码修复**：修复损坏或低效的代码在软件开发中至关重要。在测试代码修复技能的 **Aider 基准** 中，Qwen2\.5\-Coder\-32B\-Instruct 取得了令人印象深刻的 **73\.7** 分，堪比 GPT\-4o 的能力。
* **代码推理**：理解和推理代码执行路径的能力对调试和优化复杂软件至关重要。该模型的能力不仅限于简单的生成 — 它在 **预测输入和输出** 方面表现出色，使其成为软件工程师的宝贵工具。

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*-g1ZGa0p2kKsQK4iD7q7cg.png)

### 2\. 多样性：支持多种编程语言和丰富的模型大小

Qwen2.5-Coder 的多功能性体现在其对超过 **40 种编程语言** 的支持，包括 **Haskell** 和 **Racket** 等小众语言。这种广泛的支持得益于细致的数据清理和均衡的训练，确保模型在不同的编码环境中表现最佳。

* **多语言代码修复**：它的专业能力扩展到对不熟悉语言的代码修复，这可以显著减少开发者探索新技术的学习曲线。
* **模型大小灵活性**：Qwen2.5-Coder 系列提供六种不同大小的模型，确保具有不同资源限制的开发者能够找到适合其需求的模型。支撑这些模型的 **扩展法则** 哲学意味着性能与模型大小呈正相关，赋予开发者在性能和计算资源之间选择合适平衡的灵活性。

## 性能洞察：评估 Qwen2.5-Coder 模型

### 1\. Instruct 与 Base 模型

Qwen2\.5\-Coder 提供 **Base** 和 **Instruct** 版本：

* **Base 模型** 旨在为希望对其特定应用进行微调的开发者提供原始模型。
* **Instruct 模型** 经过预先调整，优化用于交互式和对话式的使用场景，非常适合基于聊天的代码助手。

### 2\. 基准比较：引领潮流

在各种核心基准测试中：

* **MBPP\-3shot** 被选中用于评估基础模型，提供了一个强有力的指标来衡量它们的代码理解和合成能力。
* **LiveCodeBench** 问题集用于评估指导模型，重点关注它们对新颖和未见过的编码问题的适应能力。

结果呢？**Qwen2\.5\-Coder 一直优于其他开源模型**，证明了规模扩大确实与更好的性能相关。

## 实用指南：使用 Qwen2.5-Coder-3B 进行代码生成与 Transformers

在本实用教程中，我们将演示如何使用 `transformers` 库中的 **Qwen2.5-Coder-3B** 模型来生成代码。该模型是 **Qwen2.5-Coder 系列** 的一部分，旨在在代码生成、修复和推理方面表现出色。到本教程结束时，您将看到如何将这个强大的开源模型集成到您自己的项目中，以处理各种与代码相关的任务。

### 前提条件

在深入代码之前，请确保您已安装以下内容：

```python
pip install torch transformers
```

此外，如果您希望充分利用模型的性能，请确保您可以访问支持 GPU 的环境。

### 第一步：导入所需库

我们将通过从 `transformers` 库中导入必要的组件来开始：

```python
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
```

第二步：加载模型和分词器

在这一步中，我们加载 ***Qwen2\.5\-Coder\-32B\-Instruct*** 模型及其对应的分词器。`device_map="auto"` 选项将自动将模型分配到可用的 GPU 或 CPU 上。

> ***Qwen2\.5\-Coder 已在 Hugging Face 上发布了多种尺寸的模型 — 0\.5B\-Instruct、1\.5B\-Instruct、3B\-Instruct、7B\-Instruct、14B\-Instruct 和 32B\-Instruct。如果您想在本地运行它们，请选择最适合您 GPU 容量的模型。这些模型也可以在 Ollama 上获得，因此您可以在 Ollama 环境中使用它们。如果您对 Ollama 教程感兴趣，请随时在评论中告诉我！***

```python
model_name = "Qwen/Qwen2.5-Coder-32B-Instruct"

## Load the model
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype="auto",
    device_map="auto"
)

## Load the tokenizer
tokenizer = AutoTokenizer.from_pretrained(model_name)
```

### 第3步：编写聊天模板函数

Qwen2.5-Coder模型旨在处理类对话的提示，使用聊天模板。以下辅助函数以符合模型预期的方式设置输入提示：

```python
def generate_response(model, tokenizer, prompt):
    messages = [
        {"role": "system", "content": "You are Qwen, created by Alibaba Cloud. You are a helpful assistant."},
        {"role": "user", "content": prompt}
    ]
    # Prepare the chat input
    text = tokenizer.apply_chat_template(
        messages,
        tokenize=False,
        add_generation_prompt=True
    )
    # Tokenize and prepare inputs
    model_inputs = tokenizer([text], return_tensors="pt").to(model.device)

    # Generate response
    generated_ids = model.generate(
        **model_inputs,
        max_new_tokens=512
    )
    # Remove prompt tokens from output
    generated_ids = [
        output_ids[len(input_ids):] for input_ids, output_ids in zip(model_inputs.input_ids, generated_ids)
    ]
  
    # Decode and return the generated text
    response = tokenizer.batch_decode(generated_ids, skip_special_tokens=True)[0]
    return response
```

### 第4步：使用代码生成测试模型

让我们运行一些示例，看看Qwen2.5-Coder-32B模型在生成Python和Java代码方面的表现如何。我们将用三个不同的编程提示进行测试。

### 测试 1：快速排序算法

**提示**：“编写一个快速排序算法。”

```python
prompt_1 = "write a quick sort algorithm."
response_1 = generate_response(model, tokenizer, prompt_1)
print(response_1)
```

输出：


```python
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)
```

## 示例用法：

arr = [3, 6, 8, 10, 1, 2, 1]
print(quick_sort(arr))

```
这段代码定义了一个 `quick_sort` 函数，该函数接受一个数组作为输入，并使用快速排序算法返回该数组的排序版本。该函数通过从数组中选择一个基准元素，并根据其他元素是小于还是大于基准来将它们分成两个子数组。然后对子数组进行递归排序。递归的基本情况是当数组只有一个或没有元素时，此时数组已经是排序好的。

您可以将这段代码作为起点，并根据您的具体需求进行修改。如有任何进一步的问题或需要其他帮助，请告诉我！<|fim_middle|>
```

### 测试 2：计算一个数字的阶乘

**提示**：“编写一个 Python 程序来计算一个数字的阶乘。”

```python
prompt_2 = "Write a python program to find a factorial of a number."
response_2 = generate_response(model, tokenizer, prompt_2)
print(response_2)
```

输出：

```python
def factorial(n):
    if n == 0:
        return 1
    else:
        return n * factorial(n - 1)

## 示例用法
number = int(input("输入一个数字: "))
result = factorial(number)
print(f"{number} 的阶乘是 {result}")
```

该程序定义了一个递归函数 `factorial`，用于计算给定数字 `n` 的阶乘。它使用基准情况 `n == 0` 返回 1，对于其他值的 `n`，它递归调用自身，直到达到基准情况。最后，程序提示用户输入一个数字，并显示该数字的阶乘。


### 测试 3：使用逗号格式化数字

**提示**：“编写一个名为‘format\_number’的 Python 函数，该函数以一个非负数作为唯一参数。您的函数应将数字转换为字符串，并添加逗号作为千位分隔符。”

```python
prompt_3 = """Write a python function named 'format_number' that takes a non-negative number as its only parameter.
Your function should convert the number to a string and add commas as a thousand separators. 
For example, calling format_number(1000000) should return '1,000,000'."""
response_3 = generate_response(model, tokenizer, prompt_3)
print(response_3)
```

输出：

```python
def format_number(num):
    # Convert the number to a string
    num_str = str(num)
  
    # Initialize an empty string to store the formatted number
    formatted_num = ''
  
    # Initialize a counter for the number of digits
    digit_count = 0
  
    # Iterate over the digits in reverse order
    for i in range(len(num_str) - 1, -1, -1):
        # Add the current digit to the formatted number
        formatted_num = num_str[i] + formatted_num
      
        # Increment the digit count
        digit_count += 1
      
        # If the digit count is a multiple of 3, add a comma
        if digit_count % 3 == 0 and i != 0:
            formatted_num = ',' + formatted_num
  
    return formatted_num
```

You can test the function with the following code:

```python
print(format_number(1000000))  # Output: '1,000,000'
print(format_number(123456789))  # Output: '123,456,789'
print(format_number(1234567890))  # Output: '1,234,567,890'
```

This function works by iterating over the digits of the number in reverse order, adding each digit to the formatted number and adding a comma every third digit. The function then returns the formatted number as a string.

### 测试 4：使用数组实现栈的 Java 程序

**提示**：“编写一个 Java 程序，使用数组实现栈”

```python
prompt_4 = """Write a Java program, Implement a Stack Using Arrays."""
response_4 = generate_response(model, tokenizer, prompt_3)
print(response_4)
```

输出：

```java
public class StackUsingArrays {
    private int[] stackArray;
    private int top;
    private int capacity;

    public StackUsingArrays(int size) {
        stackArray = new int[size];
        top = -1;
        capacity = size;
    }

    public void push(int item) {
        if (isFull()) {
            System.out.println("Stack is full. Cannot push item: " + item);
        } else {
            top++;
            stackArray[top] = item;
            System.out.println("Pushed item: " + item);
        }
    }

    public int pop() {
        if (isEmpty()) {
            System.out.println("Stack is empty. Cannot pop item.");
            return -1;
        } else {
            int item = stackArray[top];
            top--;
            return item;
        }
    }

    public boolean isEmpty() {
        return top == -1;
    }

    public boolean isFull() {
        return top == capacity - 1;
    }

    public static void main(String[] args) {
        StackUsingArrays stack = new StackUsingArrays(5);

        stack.push(10);
        stack.push(20);
        stack.push(30);

        System.out.println("Popped item: " + stack.pop());
        System.out.println("Popped item: " + stack.pop());

        stack.push(40);
        stack.push(50);

        System.out.println("Popped item: " + stack.pop());
        System.out.println("Popped item: " + stack.pop());
        System.out.println("Popped item: " + stack.pop());
    }
}
```

这个程序定义了一个`StackUsingArrays`类，它使用一个数组来实现一个堆栈。`push`方法将一个项目添加到堆栈的顶部，`pop `方法移除并返回堆栈顶部的项目。`isEmpty`和`isFull`方法分别检查堆栈是空的还是满的。`main`方法演示了如何通过推入和弹出项来使用堆栈。

### 测试 5：简单分类算法

**提示**：“编写一个 Python 代码以使用 Sklearn 运行简单分类算法”

```python
prompt_5 = """Write a Python code to run a simple classification algorithm using Sklearn"""
response_5 = generate_response(model, tokenizer, prompt_3)
print(response_5)
```

输出：

```python
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

## 生成一些示例数据
np.random.seed(42)
X = np.random.rand(100, 2)  # 100 个样本，2 个特征
y = np.random.choice([0, 1], size=100)  # 二分类

## 将数据分割为训练集和测试集
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

## 创建逻辑回归模型
model = LogisticRegression()

## 训练模型
model.fit(X_train, y_train)

## 对测试集进行预测
y_pred = model.predict(X_test)

## 计算模型的准确性
accuracy = accuracy_score(y_test, y_pred)
print(f"准确性: {accuracy}")
```

此代码生成一些示例数据，将其拆分为训练集和测试集，训练一个逻辑回归模型，对测试集进行预测，并计算模型的准确性。请随意修改代码以满足您的具体需求。


## 第5步：分析模型的性能

根据我们的测试，***Qwen2\.5\-Coder\-32B\-Instruct*** 模型展示了：

* **强大的代码生成能力**，能够为经典编码问题生成高效、易于理解的解决方案。
* **对Python语法和最佳实践的理解**，尤其是在使用Pythonic解决方案如列表推导式和格式化字符串时。
* **灵活性**，能够适应各种提示，这对实际编程助手的使用案例至关重要。

## 潜在的使用案例

鉴于其性能，Qwen2.5-Coder模型可以在各种场景中有效使用，例如：

* **编码助手**：集成到IDE或文本编辑器中，帮助开发人员更快地编写代码。
* **自动化代码审查**：协助识别错误、优化代码并提出改进建议。
* **教育工具**：通过生成示例解决方案和解释，帮助学生学习编码。

## 结论

**Qwen2.5-Coder**系列，特别是**32B模型**，为开发者、研究人员和希望利用AI进行代码相关任务的组织提供了强大而多功能的工具。它在EvalPlus、Aider和McEval等基准测试中的出色表现证明了其在代码生成、修复和推理方面的竞争优势。

通过开源这些模型，阿里云为一个AI驱动的编码助手普及的未来铺平了道路。无论您是希望自动化重复任务的开发者，还是希望学习新编程概念的学生，Qwen2.5-Coder都是您工具箱中值得添加的可靠工具。



