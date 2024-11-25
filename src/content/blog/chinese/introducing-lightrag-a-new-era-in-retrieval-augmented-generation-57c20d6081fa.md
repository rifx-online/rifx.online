---
title: "介绍 LightRAG：检索增强一代的新时代"
meta_title: "介绍 LightRAG：检索增强一代的新时代"
description: "LightRAG是一种新型的检索增强生成系统，旨在解决传统RAG系统在更新知识库和处理复杂查询时的效率问题。通过基于图的文本索引和双层检索范式，LightRAG实现了高效的增量更新和低计算成本，显著提高了信息检索的全面性和多样性。评估结果显示，LightRAG在多个领域的表现优于现有系统，展现出在医疗、教育和金融等领域的广泛应用潜力。"
date: 2024-11-25T15:00:22Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*voMEF3Wtdy0FoaNV"
categories: ["Generative AI", "Data Science", "Natural Language Processing"]
author: "Rifx.Online"
tags: ["LightRAG", "RAG", "graph", "retrieval", "optimization"]
draft: False

---



在快速发展的自然语言处理领域，检索增强生成（RAG）系统已成为提供准确、上下文丰富的响应的关键。然而，传统的 RAG 系统在更新知识库或处理复杂查询时，往往面临效率低下的问题。

引入 **LightRAG**，这是一个新颖的系统，旨在通过提供高效、增量更新和优化的检索过程来解决这些挑战。



## 传统 RAG 系统的问题

在我们深入了解 LightRAG 之前，先来理解一下我们为什么需要它。传统的 RAG 系统，包括 GraphRAG，面临几个重大挑战：

1. **全球上下文的丧失**：在索引过程中将知识库拆分为小块，这些系统往往错过了更大的图景。想象一下，仅通过阅读随机段落来理解一本小说——你会错过关键的情节联系和主题。
2. **有限的块间关系**：传统系统无法有效捕捉知识库不同部分之间的关系，导致信息检索不完整或不连贯。

虽然 **GraphRAG** 尝试通过社区摘要和图形架构来解决这些问题，但它也引入了一系列自身的问题：

* **高成本**：对一本中等大小的书进行索引可能花费高达 $6，使用 GPT-4
* **处理速度慢**：索引时间超过 20 分钟
* **无增量更新**：无法向现有图形添加新数据
* **复杂的实现**：源代码难以导航
* **复杂的实现**：许多基于图形的系统具有复杂的代码库，这使得它们的可用性受到影响。

## LightRAG：解决RAG低效问题的方案

LightRAG作为一种强大的替代方案，通过两个核心创新来解决其前身的局限性：

1. **基于图的文本索引**
2. **双层检索范式**

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*2jSR2ozmFjlZCGwWZS5TWA.png)

## LightRAG 的核心技术

### 关键创新

**1\. 基于图的文本索引**

该技术构建了一个**索引图**，以便于高效检索。该过程包括三个关键步骤：

**实体关系提取 (R)：** 系统从文档中提取简单实体及其关系。例如：

* **实体**：“养蜂人”，“蜜蜂”
* **关系**：“观察”

**使用 LLM 生成键值对：** 使用 LLM 对提取的实体进行描述。与检索 LLM 不同，这通常是一个通用模型。将实体输入 LLM，生成类似于回答每个实体问题的描述性键值对。

**去重 (D)：** 为了保持高效的图结构，删除从多个块中提取的重复实体。这确保每个独特概念仅表示一次，从而简化图结构。

这种方法使 LightRAG 能够在广泛的知识库中保持一致的理解，提高上下文连续性和信息综合能力。

**2\. 双层检索范式**

LightRAG 采用两级检索方法来处理各种查询：

**低层检索：** 该层关注于**具体信息请求**。它检索与详细问题相关的精确实体和事实。例如：

* **查询**：“一个蜂巢中可以有多少只蜂后？”
* **检索重点**：关于蜂巢动态和蜂后角色的具体数据。

**高层检索：** 在这里，系统处理**概念查询和摘要**。它检索更广泛的概念和关系，以提供全面的概述。例如：

* **查询**：“气候变化对蜜蜂的影响是什么？”
* **检索重点**：影响蜜蜂的广泛影响、趋势和相互关联的因素。

这种双层框架确保 LightRAG 能够提供针对具体和一般查询的全面答案。

### 快速适应增量知识

LightRAG 的一个突出特点是其 **增量更新知识库** 的能力，而无需完全重新处理。这意味着新数据可以迅速集成，确保系统保持最新状态，并且停机时间最小。

### 计算效率

LightRAG显著降低了计算成本：

* **Token使用**：在检索过程中，它使用的token少于100个，而Graph RAG则需要600–10,000个token。
* **API调用**：在检索过程中只需要一次API调用，而Graph RAG可能需要多次调用。

这些效率不仅加快了检索过程，还降低了运营费用。

## 评估 LightRAG 的性能

为了评估其有效性，LightRAG 与几种最先进的 RAG 系统进行了比较 — **Naive RAG, RQ-RAG, HyDE, GraphRAG.**

### 使用的数据集

评估涵盖多个领域以确保稳健性 — **农业、计算机科学 (CS)、法律** 和 **混合主题。**

### 评估指标

性能在三个维度上进行测量：

1. **全面性**：答案涉及问题所有方面的程度。
2. **多样性**：响应的多样性和丰富性。
3. **赋能**：答案在促进理解和知情决策方面的有效性。
4. **总体评分**：上述指标的综合。

### 结果

LightRAG 在所有指标和数据集上始终优于其他系统。主要观察包括：

* **更高的全面性**：答案是否涵盖了问题的所有方面？
* **更大的多样性**：回答的变化和丰富程度如何？
* **增强的赋能**：使用户能够更好地理解复杂概念并做出更明智的判断。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*2HcDHEJoRaYQbkU1Ky4jzQ.png)

## 运行代码

要查看实际效果，让我们自己运行代码。我们将通过终端 shell 运行它。

### 安装

1\. 首先创建 conda 环境。


```python
conda create -n light_rag python=3.12
conda activate light_rag
```
2\. 在您选择的位置克隆代码库。


```python
git clone https://github.com/HKUDS/LightRAG.git
```
3\. 建议从源代码安装。


```python
cd LightRAG
pip install -e .
```
4\. 返回根目录。


```python
cd ..
```

### 运行代码

1. 确保将 API 密钥存储在 `.env` 文件中：

```python
OPENAI_API_KEY="sk-proj.."
```
2\. 下载书籍 - **奥兹国的魔法师**：

```python
curl https://www.gutenberg.org/cache/epub/55/pg55.txt > ./wizard_of_oz.txt
```
3\. 在脚本中运行以下代码：

```python
### script.py

import os 
from lightrag import LightRAG, QueryParam
from lightrag.llm import gpt_4o_mini_complete, gpt_4o_complete

from dotenv import load_dotenv

_ = load_dotenv()


def initialize_rag(working_dir, llm_model_func, input_content):
    """
    使用指定的参数和输入数据初始化 LightRAG 实例。

    参数：
        working_dir (str): RAG 工作文件的目录路径
        llm_model_func (Callable): 要使用的 LLM 模型的函数
        input_file (str): 输入文本文件的路径

    返回：
        LightRAG: 具有加载数据的初始化 RAG 实例

    引发：
        ValueError: 如果未提供 llm_model_func
        Exception: 其他初始化错误
    """
    try:
        # 验证输入
        if not llm_model_func:
            raise ValueError("必须提供 llm_model_func")

        # 如果工作目录不存在，则创建
        os.makedirs(working_dir, exist_ok=True)

        # 初始化 RAG
        rag = LightRAG(working_dir=working_dir, llm_model_func=llm_model_func)

        rag.insert(input_content)

        return rag

    except Exception as e:
        print(f"初始化 RAG 时出错: {str(e)}")
        raise


if __name__ == "__main__":
    with open("./wizard_of_oz.txt") as f:
        file_context = f.read()

    rag = initialize_rag(
        working_dir="the_wizard_of_oz",
        llm_model_func=gpt_4o_mini_complete,
        input_content=file_context,
    )

    # 执行简单搜索
    print(
        rag.query(
            "这个故事的主要主题是什么？", param=QueryParam(mode="naive")
        )
    )

    # 执行本地搜索
    print(
        rag.query(
            "这个故事的主要主题是什么？", param=QueryParam(mode="local")
        )
    )

    # 执行全局搜索
    print(
        rag.query(
            "这个故事的主要主题是什么？", param=QueryParam(mode="global")
        )
    )

    # 执行混合搜索
    print(
        rag.query(
            "这个故事的主要主题是什么？", param=QueryParam(mode="hybrid")
        )
    )
```
4\. 结果如下：

**简单 RAG：** 简单 RAG 是一种标准的基准检索增强生成系统，采用直接的方法。它通过将原始文本分解为块并使用文本嵌入将它们存储在向量数据库中来工作。在处理查询时，它创建向量化表示，以通过直接匹配找到和检索最相似的文本块。

```python
从《奥兹国的魔法师》的故事中可以看出几个突出的主题。

一个主要的主题是身份和自我发现的追求。每个角色，包括多萝西、稻草人、锡人和胆小的狮子，都踏上了寻找他们认为缺失的东西的旅程——多萝西渴望回家，稻草人渴望智慧，锡人寻求一颗心，而狮子想要勇气。他们的冒险表明，他们所追求的品质往往已经存在于他们之中，突显了自我实现的概念。

另一个重要的主题是善与恶的本质。邪恶女巫代表了邪恶的力量，而多萝西和她的朋友们则体现了善良和纯洁。这些力量之间的冲突推动了大部分情节，强调了善最终战胜恶的事实。这个主题通过各种遭遇得到了强调，揭示了角色们的勇气和善良，尤其是在逆境面前。

友谊和忠诚在叙事中也扮演着重要角色。多萝西与她的伙伴之间形成的纽带体现了团队合作和支持如何带来成功和幸福。他们愿意互相帮助，尽管面临自己的恐惧和挑战，突显了陪伴的价值。

最后，故事探讨了家和归属的概念。多萝西的主要动机是回到堪萨斯，象征着家的重要性及其带来的安慰。她在奥兹的旅程作为寻找归属和真正适合一个地方的隐喻，强化了家的概念不仅仅是一个地方，而是一种安全感和爱的感觉。

总的来说，《奥兹国的魔法师》将这些主题编织成一个丰富的叙事，能够引起各个年龄段读者的共鸣，鼓励人们反思个人成长、善恶的胜利、友谊的重要性以及家的意义。
```
**本地（低级）检索：** 它专注于寻找有关特定实体及其在知识图谱中直接连接的具体信息。这种方法通过对直接相关实体进行深入探索，特别擅长处理精确、注重细节的查询，尽管可能会错过更广泛的上下文信息。当用户需要关于特定主题的确切、聚焦的信息时，它特别有用。

```python
《奥兹国的魔法师》的叙事概括了几个深刻的主题，这些主题在多萝西和她的伙伴的冒险中共鸣。在这里，我们将探讨通过各种角色及其经历揭示的主要主题。

#### 1. **勇气与个人成长**
勇气是一个关键主题，主要通过胆小的狮子的旅程来体现。最初充满自我怀疑和恐惧，狮子真诚地希望从伟大的奥兹那里获得勇气。他的转变意味着勇气往往是面对恐惧，最终揭示出他一直拥有内心的勇气。这个主题反映了自我发现和个人赋权的探索，不仅适用于狮子，也适用于多萝西和她的朋友们，因为他们面临各种挑战。

#### 2. **身份与自我提升的追求**
每个主要角色——多萝西、稻草人、锡人和狮子——都踏上了实现他们愿望的追求：回家、获得智慧、获得一颗心和寻求勇气。这些身份和自我提升的追求突显了人类经验的复杂性，每个角色的旅程作为个人成长的隐喻。叙事强调，满足感不仅来自外部的认可，而是来自于实现自己的潜力和能力。

#### 3. **友谊与陪伴**
多萝西与她的伙伴之间形成的纽带对故事至关重要，展示了忠诚、支持和团队合作的主题。多萝西与稻草人、锡人和胆小的狮子的友谊体现了陪伴的重要性，因为他们共同克服障碍。他们的互动体现了友谊的理想，并强化了没有任何旅程是独自进行的；合作增强了旅程，体现了共同的目标和胜利。

#### 4. **恐惧与克服逆境**
恐惧是一个主导主题以各种方式表现出来；角色们对外部威胁的反应不同，例如西方的邪恶女巫。每个角色在旅程中都面对自己的恐惧，展示了在逆境面前的韧性。这个主题强调，挑战和恐惧可以导致成长和彼此之间更深的联系，因为他们共同面对危险。

#### 5. **善与恶的本质**
在叙事中，善与恶之间的对比是一个重要的主题。像邪恶女巫这样的角色代表了邪恶，试图控制和施加恐惧，而其他角色则体现了善良，帮助和赋权他人。多萝西与邪恶女巫的斗争象征着善与恶之间的更广泛斗争，说明了勇气和同情如何战胜恶势力。

#### 结论
在《奥兹国的魔法师》中，这些勇气、自我提升、友谊以及善与恶之间的斗争的主题交织在一起，创造了丰富的道德和情感教训。随着多萝西和她的伙伴在奥兹的旅程，他们不仅寻求各自的愿望，还学习到关于自己和团结的力量的重要真理，最终反映了人类状况的复杂性。
```
**全局（高级）检索：** 它通过查看多个实体和关系之间的总体主题和连接来采取更广泛的方法。这种方法聚合信息以捕捉更高层次的概念和摘要，使其非常适合抽象或概念查询。虽然它提供了良好的广泛理解，但可能不会像本地检索那样深入特定细节。

```python
《奥兹国的魔法师》的故事包含几个突出的主题，这些主题与角色的旅程和经历交织在一起。这些主题反映了角色在奥兹的冒险中的愿望、挣扎和个人成长。

#### 追求个人满足
一个中心主题是追求个人满足。故事中的每个角色都踏上了获得他们认为会使自己完整的东西的旅程。例如，胆小的狮子寻求勇气，稻草人渴望智慧，锡人渴望一颗心。这种追求象征着他们对自我接受和成长的更深层渴望。

#### 勇气与自我发现
勇气的主题特别体现在胆小的狮子身上，他代表了恐惧与勇敢之间的斗争。在整个故事中，他了解到真正的勇气来自内心，表明自我接受和克服内心恐惧是个人成长的重要组成部分。这个主题与读者产生共鸣，强调在追求内在力量时面对恐惧的重要性。

#### 友谊与陪伴的重要性
友谊作为多萝西和她的伙伴旅程的支持骨干。彼此的互助、忠诚和友谊增强了他们各自的追求，展示了在逆境中形成的纽带如何提供力量和韧性。角色们的互动突显了团结和集体支持在克服挑战中的重要性。

#### 家和归属的观念
多萝西渴望回到堪萨斯代表了家和归属的主题。她在奥兹的旅程与她熟悉的生活形成对比，强调了她对稳定、舒适和与家人联系的渴望。这个主题深深共鸣，因为它反映了对安全和爱的普遍渴望，超越了魔法冒险的界限。

#### 权力与身份的幻象
围绕巫师角色的幻象概念对感知与现实进行了批判。像巫师这样的角色操纵自己的身份以维持对他人的控制，突显了脆弱性、欺骗和追求真实性的主题。奥兹的虚幻力量与角色的真实成长之间的对比质疑了权力和身份的实际本质。

#### 克服障碍与逆境
多萝西和她的朋友在旅途中面临的许多挑战象征着克服障碍的更广泛主题。从邪恶女巫到险恶的地形，角色们学习到韧性和适应能力。他们遇到的每一个考验都塑造了他们的性格，增强了他们的决心，强调了障碍是自我发现旅程的重要组成部分。

总之，《奥兹国的魔法师》包含探索人类情感复杂性、关系重要性和自我接受之旅的主题。通过角色的经历，叙事传达了深刻的信息，与各个年龄段的读者产生共鸣，使其成为一个永恒的冒险和成长的故事。
```
**混合模式：** 这是 LightRAG 实现的方法，结合了本地和全局检索方法的优点。它同时检索更广泛的关系，同时对特定实体进行详细探索，确保了广泛的全面性和分析深度。这种平衡的方法使系统能够有效处理具体和抽象查询，从而得出更完整和细致的响应。

```python
《绿野仙踪》的故事充满了各种主题，这些主题在叙事中产生了共鸣。以下是故事中探讨的一些主要主题：

#### 勇气
最突出的主题之一是**勇气**，特别是通过胆小狮子的角色体现，他寻求找到自己的勇气。他的旅程代表了恐惧与渴望勇敢之间的内心挣扎。对勇气的追求强调了自我发现以及真正的勇气往往存在于内心，等待被认可的观念。

#### 友谊与陪伴
**友谊**和伙伴的重要性是故事的另一个关键元素。多萝西的旅程受到她与锡人、稻草人和胆小狮子之间友谊的深刻影响。每个角色都贡献了独特的品质，帮助克服障碍，展示了朋友之间的团结与支持可以导致个人成长和在面对挑战时的成功。

#### 寻找身份
在整个叙事中，角色们都在寻求定义自己和满足他们的愿望。例如，稻草人寻求一个大脑，锡人渴望一颗心，而胆小狮子渴望勇气。这个**寻找身份**的过程作为一个普遍主题引起共鸣，反映了角色们的内心冲突及他们渴望成为最佳自我的愿望。

#### 信念的力量
**想象力**和信念在故事中扮演着至关重要的角色，特别是关于角色们对伟大奥兹的看法。故事探讨了自信和对神话人物的信仰如何影响个人的行动和决策。角色们意识到，他们所寻求的魔法往往存在于他们自身，而非外部来源。

#### 家与对舒适的渴望
对**家**的渴望是一个反复出现的主题，体现了多萝西渴望返回堪萨斯的愿望。她在奥兹的旅程不仅反映了身体上的追求，也是一种寻找安全、熟悉和爱的情感旅程。这个主题强调了家作为舒适和归属之地的重要性，尽管冒险和不确定性并存。

#### 善与恶
**善与恶**之间的冲突在故事中是显而易见的，主要通过多萝西与邪恶女巫之间的对立关系来描绘。这个主题展示了与压迫力量的斗争，并突显了善良与勇气战胜恶意的胜利。

#### 转变与自我发现
故事概括了**转变**的主题，角色们在旅程中不断发展，获得新的视角和品质。每个角色都学习到宝贵的人生课程，导致一种自我发现，揭示了他们的优势和潜力。

#### 结论
总之，《绿野仙踪》将勇气、友谊、身份、信念、家、善与恶以及转变的主题编织在一起，创造出丰富的画面，能够引起各个年龄段读者的共鸣。通过这些主题，故事传达了关于自我发现和陪伴在生活旅程中重要性的永恒教训。
```
```python
### evaluate.py
from openai import OpenAI
from answers import answer_naive, answer_local, answer_global, answer_hybrid

def generate_evaluation_prompt(answer1, answer2):
    prompt = f"""
Comprehensiveness: How much detail does the answer provide to cover all aspects and details of the question?
Diversity: How varied and rich is the answer in providing different perspectives and insights on the question?
Empowerment: How well does the answer help the reader understand and make informed judgments about the topic?

For each criterion, choose the better answer (either Answer 1 or Answer 2) and explain why. Then, select an overall winner based on these three categories.

Here is the question:
What are the top themes in this story?

Here are the two answers:

Answer 1:
{answer1}

Answer 2:
{answer2}

Evaluate both answers using the three criteria listed above and provide detailed explanations for each criterion.

Output your evaluation in the following JSON format:

{{
  "Comprehensiveness": {{
      "Winner": "[Answer 1 or Answer 2]",
      "Explanation": "[Provide explanation here]"
  }},
  "Diversity": {{
      "Winner": "[Answer 1 or Answer 2]",
      "Explanation": "[Provide explanation here]"
  }},
  "Empowerment": {{
      "Winner": "[Answer 1 or Answer 2]",
      "Explanation": "[Provide explanation here]"
  }},
  "Overall Winner": {{
      "Winner": "[Answer 1 or Answer 2]",
      "Explanation": "[Summarize why this answer is the overall winner based on the three criteria]"
  }}
}}
"""
    return prompt

def evaluate_answers(answer1, answer2):
    client = OpenAI()
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You will evaluate two answers to the same question based on three criteria: Comprehensiveness, Diversity, and Empowerment.",
            },
            {"role": "user", "content": generate_evaluation_prompt(answer1=answer_naive, answer2=answer_hybrid)},
        ],
        temperature=0.7,
        top_p=1,
    )
    return response.choices[0].message.content

print(f"Naive - Answer 1 vs. Hybrid - Answer 2: {evaluate_answers(answer1=answer_naive, answer2=answer_hybrid)}\n")
print(f"Naive - Answer 1 vs. Local - Answer 2: {evaluate_answers(answer1=answer_naive, answer2=answer_local)}\n")
print(f"Naive - Answer 1 vs. Global - Answer 2: {evaluate_answers(answer1=answer_naive, answer2=answer_global)}\n")
print(f"Global - Answer 1 vs. Local - Answer 2: {evaluate_answers(answer1=answer_global, answer2=answer_local)}\n")
print(f"Global - Answer 1 vs. Hybrid - Answer 2: {evaluate_answers(answer1=answer_global, answer2=answer_hybrid)}\n")
print(f"Local - Answer 1 vs. Hybrid - Answer 2: {evaluate_answers(answer1=answer_local, answer2=answer_hybrid)}\n")
```
* **Hybrid**、**Local**和**Global**答案在所有比较中始终优于**Naive**答案。

* **混合**答案特别强大，通常在每个标准上表现出色，并且在比较时超越了**本地**和**全球**答案。
* **天真**答案虽然全面，但缺乏其他答案中所包含的深度、多样性和赋权元素。

## 附加见解

* **LLM 利用**：LightRAG 使用通用 LLM 进行检索，与索引过程中使用的 LLM 分开。这种专业化提高了效率。
* **索引效率**：LLM 在索引过程中的作用很小，并且与块的数量成比例地扩展，保持了计算开销的低水平。
* **简化检索**：通过关注实体和关系而不是整个块，LightRAG 降低了检索的复杂性和开销。

## 探索更多可能性

LightRAG的创新方法为探索和应用开辟了众多途径。

### 潜在应用

* **医疗保健**: 高效管理和更新医学知识库。
* **教育**: 提供最新的、全面的学习资源。
* **金融**: 快速整合新的市场数据进行分析。

### 研究方向

* **LLM 架构**：研究哪些 LLM 设计在 LightRAG 中对分析和检索任务最有效。
* **块大小影响**：分析不同块大小如何影响性能和计算效率。
* **处理冲突信息**：研究 LightRAG 如何管理其知识库中的矛盾数据。
* **外部知识整合**：探索无缝整合外部数据源的方法。

## 结论

LightRAG 代表了检索增强生成的重大进步。通过结合图结构、双层检索和增量更新，它提供了一种比传统 RAG 系统更快速、更具上下文意识和更具成本效益的替代方案。LightRAG 在医疗、教育、金融等领域的潜在应用，使其有望重新定义 AI 驱动知识管理的未来。

这个全面、高效的框架确保了 LightRAG 将继续与快速变化的领域共同发展，从而实现更快速、更相关和更具洞察力的响应。

## 参考文献

* LightRAG: 简单快速的检索增强生成: [https://arxiv.org/abs/2410\.05779](https://arxiv.org/abs/2410.05779)
* LighRAG 官方 GitHub 仓库: <https://github.com/HKUDS/LightRAG>

