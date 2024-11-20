---
title: "Qwen 2.5 Coder 32B：这一最佳开放重量模型是否优于 GPT-4o 和 Claude 3.5 Sonnet？"
meta_title: "Qwen 2.5 Coder 32B：这一最佳开放重量模型是否优于 GPT-4o 和 Claude 3.5 Sonnet？"
description: "阿里巴巴推出的编码模型Qwen 2.5-Coder-32B-Instruct在内部基准测试中表现优于GPT-4，接近Claude 3.5。该模型在代码生成、修复和推理方面展现出色，但在复杂任务处理上仍需改进。尽管其表现令人印象深刻，但在优化和资源管理等领域，仍不及ChatGPT和Claude。未来，专业化的领域特定语言模型可能会引领人工智能的发展，尤其是在编程等特定领域。"
date: 2024-11-20T00:43:56Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*VCjOflU1i-Y9u92iLdgY-Q.jpeg"
categories: ["Programming", "Machine Learning", "Generative AI"]
author: "Rifx.Online"
tags: ["Qwen", "coding", "GPT-4", "Claude", "specialized"]
draft: False

---





在11月11日，阿里巴巴宣布推出其迄今为止最先进的编码模型：**Qwen 2\.5\-Coder\-32B\-Instruct**。但这并不是全部，它实际上是整个编码模型系列的一部分！除了32B模型，还有0\.5B、1\.5B、3B、7B和14B参数的版本。在撰写本文之前，我回顾了许多YouTuber、作家和技术专家的反馈，大家的共识 overwhelmingly positive。今天，我们将探讨它是否真的不负盛名。

我使用ChatGPT、Gemini和Claude已经有一段时间了，我可以自信地说，**Claude在编码和理解复杂任务方面是最好的。** 老实说，Gemini完全是另一个层次。趣事：两年前我曾经参加了一场机器学习比赛，使用Bard（现在更名为Gemini）获胜，因为其他人都在使用ChatGPT。Bard的表现让我在当时获得了竞争优势。今天，我相信Gemini可能是目前最好的视觉模型，但总体来说，我并不是很喜欢。

要**评估**模型在编码方面的表现，我们应该涵盖以下三个关键方面：**代码生成**、**代码修复**和**代码推理**。此外，我们还需要考虑模型支持多少种编程语言以及它与人类偏好的对齐程度。

## 概述

在测试阿里巴巴的模型之前，让我们看看他们公布的性能结果。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*5Olo_zJmTQdmNzyfNfQwwA.png)

根据他们的内部基准测试，它甚至超越了 GPT-4，并且非常接近 Claude 3.5。不过，我个人并不太看重仅仅依赖内部基准测试，但根据那些尝试过的人来看，结果似乎非常有趣。

您可以在这里找到有关性能的更多详细信息：

我正在使用 **Ollama** 本地测试该模型：

您还可以在 Hugging Face 的演示页面上尝试该模型：

## 代码生成

许多人已经讨论了它在网络和设计方面的表现如何：
















因此，我们将专注于用一些 Python 挑战来测试它。让我们从一个中等难度的 LeetCode 问题开始：

### 提示

问题描述: [无重复字符的最长子串](https://leetcode.com/problems/longest-substring-without-repeating-characters/)

### 答案


```python
class Solution(object):
    def lengthOfLongestSubstring(self, s):
        """
        :type s: str
        :rtype: int
        """
        # 字典用于存储每个字符最后出现的索引
        char_index_map = {}
        # 初始化当前窗口的起始位置和最大长度
        start = 0
        max_length = 0
        
        for end in range(len(s)):
            # 如果字符已经在字典中且其索引在当前窗口内
            if s[end] in char_index_map and char_index_map[s[end]] >= start:
                # 将起始位置移动到当前字符最后出现位置的右侧
                start = char_index_map[s[end]] + 1
            
            # 更新当前字符的最后出现索引
            char_index_map[s[end]] = end
            
            # 更新到目前为止找到的最长子串的最大长度
            max_length = max(max_length, end - start + 1)
        
        return max_length
```

### 结果

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*dC_JN5KPGyvVL8DHPkaIWw.png)

虽然不是最好的，但它能完成任务并通过所有测试。它能解决一个难题吗？（请注意，该模型可能已经在这些问题上进行了训练，但这仍然令人印象深刻。）

### 提示

问题描述: [正则表达式匹配](https://leetcode.com/problems/regular-expression-matching/)

### 答案


```python
class Solution(object):
    def isMatch(self, s, p):
        """
        :type s: str
        :type p: str
        :rtype: bool
        """
        m, n = len(s), len(p)
        
        # 创建一个二维数组来存储子问题的结果
        dp = [[False] * (n + 1) for _ in range(m + 1)]
        
        # 基础情况：空字符串匹配空模式
        dp[0][0] = True
        
        # 处理像 a*, a*b* 等可以匹配空字符串的模式
        for j in range(1, n + 1):
            if p[j - 1] == '*':
                dp[0][j] = dp[0][j - 2]
        
        # 填充 dp 表
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if p[j - 1] == '.' or p[j - 1] == s[i - 1]:
                    dp[i][j] = dp[i - 1][j - 1]
                elif p[j - 1] == '*':
                    dp[i][j] = dp[i][j - 2]  # '*' 匹配零次
                    if p[j - 2] == '.' or p[j - 2] == s[i - 1]:
                        dp[i][j] = dp[i][j] or dp[i - 1][j]  # '*' 匹配一次或多次
        
        # 结果在 dp[m][n] 中
        return dp[m][n]
```

### 结果

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*EAVdPYg7iD9u7P7E5vyk_g.png)

在 LeetCode 上测试了 10-20 个问题后，我感觉它似乎是基于所有问题进行训练的，因此这并不是评估它的最佳方式。不过，分享一下还是很有价值的。此外，它总是选择提供 Python 解决方案，即使没有特别要求。但让我们尝试一些不同的事情。**我要求模型优化代码，以尽可能减少资源消耗。**

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*OlyL-ylYp2wKGJKDvp5BWA.png)

***我没有想到，但当我要求模型提高性能时，它甚至在最简单的情况下也会失败。***

现在让我们进入下一个测试，**代码修复**。我将提供一些包含 Claude 生成错误的代码给模型。我要求模型生成一些难以修复的案例，让我们看看它的表现如何。

## 代码修复

### 提示


```python
The following code contains several bugs. Please identify and fix them, 
and provide an explanation for each bug you find.
class AsyncTaskQueue:
    def __init__(self):
        self.tasks = []
        self.running = False
        self.lock = threading.Lock()
        self.workers = []

    async def add_task(self, task):
        async with self.lock:  
            self.tasks.append(task)
            if not self.running:
                self.start_processing()

    async def start_processing(self):
        self.running = True
        while self.tasks:
            task = self.tasks.pop(0)
            worker = asyncio.create_task(self.process_task(task))
            self.workers.append(worker)
            if len(self.workers) >= 3:
                
                done, pending = await asyncio.wait(self.workers)
                self.workers = list(pending)
        self.running = False

    async def process_task(self, task):
        result = await task()
        return result  
```

### 答案

```python
当然！让我们逐步分析提供的代码并识别问题，然后进行修正。以下是主要问题及其解决方案：

识别的问题
使用 Asyncio 的线程锁：
threading.Lock 不适合与 asyncio 一起使用。相反，您应该使用 asyncio.Lock。
锁的异步上下文管理器：
async with 语句与 threading.Lock 的使用不正确。它应该与 asyncio.Lock 一起使用。
启动处理：
start_processing 方法应该以非阻塞的方式调用。由于 start_processing 是一个异步方法，因此应该正确地等待它。
任务管理：
start_processing 方法应该更高效地处理任务。当前的实现可能无法正确处理任务完成。
工作者管理：
workers 列表应该更仔细地管理，以确保在将队列标记为不运行之前完成任务。
修正后的代码
这是修正后的代码版本：

import asyncio
import threading

class AsyncTaskQueue:
    def __init__(self):
        self.tasks = []
        self.running = False
        self.lock = asyncio.Lock()
        self.workers = []

    async def add_task(self, task):
        async with self.lock:
            self.tasks.append(task)
            if not self.running:
                self.running = True
                asyncio.create_task(self.start_processing())

    async def start_processing(self):
        while True:
            async with self.lock:
                if not self.tasks:
                    self.running = False
                    break
                task = self.tasks.pop(0)
            
            worker = asyncio.create_task(self.process_task(task))
            self.workers.append(worker)
            
            if len(self.workers) >= 3:
                done, pending = await asyncio.wait(self.workers, return_when=asyncio.FIRST_COMPLETED)
                self.workers = list(pending)

    async def process_task(self, task):
        result = await task()
        return result

## 示例用法
async def example_task():
    await asyncio.sleep(1)
    print("任务完成")
    return "结果"

async def main():
    queue = AsyncTaskQueue()
    await queue.add_task(example_task)
    await queue.add_task(example_task)
    await queue.add_task(example_task)
    await queue.add_task(example_task)
    await queue.add_task(example_task)
    await queue.add_task(example_task)

asyncio.run(main())
修复说明
Asyncio 锁：
用 asyncio.Lock 替换 threading.Lock，以确保与异步操作的兼容性。
锁的异步上下文管理器：
使用 async with self.lock: 在异步上下文中正确管理锁。
启动处理：
通过在 add_task 内部使用 asyncio.create_task(self.start_processing()) 更改逻辑，以非阻塞的方式启动处理。
任务管理：
修改 start_processing 以持续检查任务并处理它们，直到没有任务为止。当没有更多任务时，它会退出循环并将 self.running 设置为 False。
工作者管理：
通过使用 asyncio.wait 和 return_when=asyncio.FIRST_COMPLETED 确保正确管理工作者，以有效处理任务完成。
示例用法
示例用法演示了如何将任务添加到 AsyncTaskQueue 并异步运行它们。主函数向队列添加多个任务，并且它们以最多 3 个工作者的并发方式处理。

这段修正和优化后的代码应该表现得更好，更可靠。
```

### 结果与反馈

*Claude对模型的响应评估为7.5/10，并给出了以下反馈：*

> 尽管模型提供了一个功能上正确的解决方案，但它提供的是“教程级”的修复，而不是“生产级”的实现。这表明，对于复杂的并发编程任务，人类的专业知识在稳健的系统设计中仍然至关重要。

在实验模型后，**它完成了任务**，但通常需要后续提示来改善响应。尽管它在理解当前任务方面没有困难，并且可以纠正大多数关键错误，但在错误处理、资源管理和优化等领域，它仍然缺乏像ChatGPT和Claude这样的模型所展现的一些优势。我认为这些可能是模型的关键弱点。

## 专业化 LLM：人工智能的新纪元

目睹相对较小的领域特定语言模型在本地运行的出现，令人着迷。我相信我们正进入一个激动人心的专业化 LLM 新纪元，而这仅仅是开始。虽然这个概念并不新颖，但我们终于看到了在特定领域真正出色的模型。

RAG（检索增强生成）与专业 LLM 的结合可能会在未来几个月/几年内定义人工智能的格局。我们可能会看到来自行业领袖如 OpenAI 和 Anthropic 的更强大的以编码为重点的模型。编程或许是专业化人工智能最自然的领域之一，我们可能很快会看到更为专注的模型，想象一下专门为 DevOps 或前端开发优化的 LLM！

> 不要被这些快速的进展所压倒。是的，看到 LLM 掌握传统上需要多年才能发展的技能，确实有些令人畏惧。编程，这一困扰人类数十年的挑战，正以我们眼前的方式被转变。但与其将其视为终点，我们应该将其视为成长和创新的机会。

无论当前的 LLM 进展浪潮在未来几年是否会减缓，还是这仅仅是更长旅程的开始，我们的反应应保持不变：保持好奇，继续学习，永不停歇地创新。技术的未来正在被书写，而我们每个人都在塑造它的过程中扮演着重要角色。

