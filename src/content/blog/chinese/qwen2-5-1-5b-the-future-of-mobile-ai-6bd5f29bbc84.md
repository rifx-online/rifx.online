---
title: "Qwen2.5 1.5b：移动AI的未来？"
meta_title: "Qwen2.5 1.5b：移动AI的未来？"
description: "阿里云最新 LLM 的本地测试和评估。使用 llama-cpp-python 和 DIY 提示目录。"
date: 2024-10-24T17:47:43Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*awb56jkdXobA-Ip6d-QHRA.png"
categories: ["Programming", "Technology", "Science"]
author: "Rifx.Online"
tags: ["Qwen2.5", "summarization", "retrieval", "mobile", "improvements"]
draft: False

---

### 本地测试和评估阿里云最新的 LLM。使用 llama-cpp-python 和 DIY 提示目录。



在第一部分中，我们共同探讨了阿里云团队发布的 Qwen2.5 模型系列的创新。

在生成式 AI 中，基准测试现在是主要的 *oracle*：一个新的 LLM 的有效性需要通过几个评判。你打破的基准记录越多，你就越优秀。

这就是赢得 SOTA 竞赛的方式。

好吧，我不同意。尽管我们在 AI 进步中需要里程碑和更好的表现，但用户体验和个人观点不能被视为无关紧要而被置于一旁。

我相信，探索一些常用的 NLP 任务，并将聊天体验搁置一旁，我们必须关注回复的质量。而我们是唯一需要的基准。我们的用户体验是理解一个模型是否优秀的最佳指标。这个模型必须足够可靠，以便在自动化工作流程中使用。

顺便提一下，我已经运行了我决定称之为 [RBYF — 以您为反馈的修订基准](https://open.substack.com/pub/thepoorgpuguy/p/rbyf-is-here-revised-benchmarks-with?r=i78xo&utm_campaign=post&utm_medium=web) 的测试，声称惊人的 Llama3.2–1B-instruct… 而 Qwen2.5–1.5b 要好得多！

所以在这篇文章中，正如承诺的那样，我们将亲自验证这个模型在日常使用中的表现如何。

回到我们自己……让我们开始吧！

## 需求

在这里，我们将构建一个最小的文本接口，以便能够运行模型、测试不同的任务并等待用户反馈以进行评估。

需求很简单，但我建议您创建一个新的项目目录和一个虚拟环境。

创建一个 `venv`（需要 Python 3.11+）：我在运行 Windows 11 的迷你电脑上进行了测试。

```python
## create the virtual environment
python -m venv venv
## activate the venv
venv\Scripts\activate
## Install the dependencies 
pip install llama-cpp-python==0.3.0 tiktoken
```

我们需要从 Hugging Face 的官方 qwen 存储库下载 GGUF 文件 [https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF](https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF)：我使用了 `qwen2.5-1.5b-instruct-q5_k_m.gguf` 版本。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*YtQJb_xyq_xcF40yRWPcZA.png)

我们准备好了！

注意：如果您想添加对 GPU 加速器的不同后端支持，可以按照 [存储库中的说明](https://github.com/abetlen/llama-cpp-python#supported-backends) 进行操作。我使用了 Vulkan 支持，因此在 pip 安装之前我添加了环境变量

```python
## Vulkan support - for Windows
$env:CMAKE_ARGS = "-DGGML_VULKAN=on"
```

## 代码 — 主应用和库

为了保持代码的简洁，我决定使用一个外部库来扩展一些功能。好吧，这是一个自己动手的库，所以这里没有秘密。

你可以在我的文章中找到所有的细节：

为了加快速度，你可以直接 [从这里下载文件](https://github.com/fabiomatricardi/YouAreTheBenchmark/raw/main/QWEN2.5-1.5B/promptLibv2Qwen.py)：它包含了在上述文章中讨论的 `promptLib` 的版本 2（它被称为 `promptLibv2Qwen.py`，并且对 `Qwen2.5-1.5B-instruct` 模型的提示进行了少量微调）。

将文件保存在主目录中，并创建一个名为 `main.py` 的新文件。

```python
## Chat with an intelligent assistant in your terminal  
## MODEL: https://huggingface.co/Qwen
## qwen2.5-1.5b-instruct-q5_k_m.gguf
import sys
from time import sleep
import warnings
warnings.filterwarnings(action='ignore')
import datetime
from promptLibv2Qwen import countTokens, writehistory, createCatalog
from promptLibv2Qwen import genRANstring, createStats
import argparse
### PREPARING FINAL DATASET
pd_id = []
pd_task = []
pd_vote = []
pd_remarks = []
####################Add GPU argument in the parser###################################
parser = argparse.ArgumentParser()
parser.add_argument("-g", "--gpu", type=int, default=0,nargs='?',
                    help="The number of layers to load on GPU")
args = parser.parse_args()
if args.gpu == None:
   ngpu_layers = 0 
else:
    ngpu_layers = args.gpu
print(f'Selected GPU: offloading {ngpu_layers} layers...')   
####################INITIALIZE THE MODEL###################################
stops = ['

## 提示目录 — 我们想要测试的内容

我在这里写了我的习惯。我有一个提示目录，涵盖了聊天机器人中使用的许多主要语言任务，如摘要、简短摘要、随意聊天、RAG、真实RAG等。

这个想法是能够在5分钟内加载模型，并开始评估每个任务。在每次生成结束时，用户会被提示给出一个分数（从0到5的评分）并在需要时留下任何评论。

这非常重要：并不是所有模型都是一样的，对提示中的措辞进行小的或大的调整总是必要的。

所以回到代码……因为之前的代码只是热身，现在将开始真正的while循环，遍历整个提示目录。请看下面的工作流程……

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*EL0Q97Du6HwtcYQZ.png)

代码中只有少量更改，我会指出这些更改，请耐心等待。

```python
############################# AUTOMATIC PROMPTING EVALUATION  11 TURNS #################################
id =1
for items in tasks:
    fisrtround = 0
    task = items["task"]
    prompt = items["prompt"]
    test = []
    print(f'NLP TAKS>>> {task}')
    print("\033[91;1m")  #red
    print(prompt)
    test.append({"role": "user", "content": prompt})
    print("\033[92;1m")
    full_response = ""
    start = datetime.datetime.now()
    print("💻 > ", end="", flush=True)
    for chunk in llm.create_chat_completion(
        messages=test,
        temperature=0.15,
        repeat_penalty= 1.31,
        stop=stops,
        max_tokens=1500,
        stream=True,):
        try:
            if chunk["choices"][0]["delta"]["content"]:
                if fisrtround==0:
                    print(chunk["choices"][0]["delta"]["content"], end="", flush=True)
                    full_response += chunk["choices"][0]["delta"]["content"]
                    ttftoken = datetime.datetime.now() - start  
                    fisrtround = 1
                else:
                    print(chunk["choices"][0]["delta"]["content"], end="", flush=True)
                    full_response += chunk["choices"][0]["delta"]["content"]                            
        except:
            pass      
    delta = datetime.datetime.now() - start
    print('')
    print("\033[91;1m")
    rating = input('Rate from 0 (BAD) to 5 (VERY GOOD) the quality of generation> ')
    print("\033[92;1m")
    stats = createStats(delta,prompt,full_response,rating,logfilename,task,ttftoken)
    print(stats)
    writehistory(logfilename,f'''👨‍💻 > {prompt}
💻 > {full_response}
{stats}
''')
    pd_id.append(id)
    pd_task.append(task)
    pd_vote.append(rating[:2])
    pd_remarks.append(rating[2:])
    id += 1
## create dataframe and save to csv
zipped = list(zip(pd_id,pd_task,pd_vote,pd_remarks))
import pandas as pdd
df = pdd.DataFrame(zipped, columns=['#', 'TASK', 'VOTE','REMARKS'])
#saving the DataFrame as a CSV file 
df_csv_data = df.to_csv(csvfile, index = False, encoding='utf-8') 
print('\nCSV String:\n', df_csv_data)  
```

主要的更改仅在前几行：

```python
for items in tasks:
    fisrtround = 0
    task = items["task"]
    prompt = items["prompt"]
```

如果你读过关于 `promptLib` 的文章，你应该不会感到惊讶：但如果你是新手，这里我们正在遍历一个字典列表，结构如下：

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*rGcKJWNzSUrcu4wi.png)

因此，对于目录中的每个项目（表示任务和提示的一对），我们提取任务描述和任务的提示。

```python
test.append({"role": "user", "content": prompt})
```

然后我们在一个名为 `test` 的临时列表中创建聊天模板消息，并将其传递给 `create_chat_template()` 方法以进行生成。

其他部分保持不变。

保存文件，并在激活的 `venv` 下运行：

```python
python main.py
## 如果你使用的是GPU python main.py -g
```

这将得到类似于下面示例的内容……

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*MhhQu4lLjtU__Wjf0dSWBg.gif)

请注意，在整个提示目录结束时，会创建一个 *csv* 文件，其中包含所有任务的摘要！

## 测试概述

我使用了几个小型语言模型，从 [Qwen2–1.5B-instruct](https://huggingface.co/Qwen/Qwen2-1.5B-Instruct-GGUF) 到 [Gemma2–2B-instruct](https://huggingface.co/bartowski/gemma-2-2b-it-GGUF)，再到 [Llama3.2–1B-instruct](https://huggingface.co/bartowski/Llama-3.2-1B-Instruct-GGUF)，最后是新的 [Qwen2.5–1.5B-instruct](https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF)。

虽然我对 [Llama3.2–1B-instruct](https://generativeai.pub/llama3-2-1b-instruct-is-ok-but-not-good-enough-28f88046b63e) 感到相当失望，但我对新的 [Qwen2.5–1.5B-instruct](https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF) 的出色表现感到惊讶。

在每次生成结束时，用户会被要求用0到5的分数来评估结果。**在这种情况下，用户就是我……**

这种定性分析确实较为简单，因此每个分数都有描述，用户可以添加评论（“一些错误信息”，“可能更好地更改提示中的措辞”）

这里是带有描述的定性矩阵

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*eBdPfZtfr99MsvLh6tt42w.png)

## 好与坏 — 细节

总结效果非常好。列出长文本的主要主题也非常不错。

RAG 任务的速度相当快（即使在我的迷你电脑上），真实的 RAG（在上下文外提问）也很到位。

所以真的很好。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*DuV3LJep_PuDqiCcAMb6Cg.png)

当然也有一些不足之处：即使温度仅为 `0.15`，在总结两句话的任务中，我也得到了些虚假的信息。这不好。

> 我期待这可以通过稍微调整提示，或将温度设置为 `0` 来修复。

另一个事实是，创意写作的效果相当差：在测试中我使用了一些固定的生成参数。

```python
        temperature=0.15,
        repeat_penalty= 1.31,
```

可能对于创意写作，使用 Qwen2.5–1.5B-instruct 时，我们应该使用更高的 `repeat_penalty` 和更高的 `temperature`。

顺便提一下，我必须说反思提示的效果也并不差！标签的开闭没有保持（所以不容易将其放入管道或工作流中），但整体生成的流程和“思维链”推理过程相当不错。

```python
<thinking>
使用生成型人工智能（AI）在教学中的重要性不容小觑，因为这项技术不仅在当前的教育实践中具有巨大的潜力，还能塑造更具创新性的终身学习方法。
</thinking>

**思维链：**
1. **理解影响**：AI 可以自动化重复性任务，并根据学生的表现数据提供个性化反馈（例如，通过聊天机器人或自适应评估）。
2. **增强学习体验**：通过整合生成型 AI，教师可以创建更具吸引力的课程，以满足不同的学习风格。
3. **改善学生成果**：个性化指导可以提高学生对知识的理解和记忆。

**反思：**
- 在教育中整合生成技术至关重要，因为它与日益成为数字原住民的学习者不断变化的需求相一致，要求采用包含这些技术的教学方法。
</thinking>

<output>
教师应学习如何利用生成型 AI 来增强他们的教学方法并改善学生成果。这包括了解其在自动化任务（如评分或创建个性化学习路径）方面的能力。

**学习路径：**
1. **教育技术基础课程**：从提供教育技术概述的课程开始，包括数字工具的基础知识。
2. **AI 基础课程（Coursera）** - 通过 Coursera 的人工智能教育者免费在线课程，了解 AI 概念及其在教育中的应用。

3. **生成学习的专业课程**：报名参加专注于生成学习的课程，例如“生成设计”或类似的由 MIT 等大学提供的专业项目。
4. **专业发展研讨会和会议** - 参加地方教育会议上专注于将 AI 整合到教学实践中的研讨会。

5. **教育工作者在线社区（如 Edmodo）**：加入在线社区，教育工作者讨论生成技术在教育中的应用，分享资源或询问实施问题。
6. **认证项目**：考虑获得认证，以认可您在教学实践中与 AI 整合相关的知识和技能，例如 Google 的“教育者 AI”项目。

通过遵循这条学习路径，教师不仅可以提升自身的专业发展，还可以通过有效整合生成技术为教育的未来做出积极贡献。
</output>
```

我认为对于这个小型语言模型的规模来说，结果并不差！

## 比较 Qwen2.5 和 Llama3.2

尽管这只是我个人的评估，我想与您分享。

这两个模型都是为移动设备设计的，但性能差异很大。请看下面：

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*T6vLgvOKdkotlV1K5x6-QQ.png)

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*DuV3LJep_PuDqiCcAMb6Cg.png)

首先，总体评分差异巨大（Llama3.2 为 41，Qwen2.5 为 57）。

其次，如果考虑您在移动设备上可能提出的语言任务，主要是希望有流畅的聊天体验（任务 4）、良好的摘要能力（任务 5 到 7）和一些创造性写作（任务 11 和 13）。

在速度方面，仅在 CPU 上运行模型，使用非常有限的迷你 PC，**我获得了平均推理速度为 14 t/s。**

## 结论

在Qwen2发布的过去三个月里，众多开发者在Qwen2语言模型上构建了新模型，为整个社区以及阿里云提供了宝贵的反馈。

> 在此期间，我们专注于创建更智能、更知识丰富的语言模型。今天，我们很高兴地介绍Qwen家族的最新成员：Qwen2.5

他们的声明伴随着关于新模型家族的事实：

* 密集型、**易于使用**的仅解码语言模型，提供0.5B、1.5B、3B、7B、14B、32B和72B的不同尺寸，以及基础和指令变体。
* 在我们最新的大规模数据集上进行预训练，涵盖多达18T的标记。
* 在**指令遵循**方面有显著改善。
* 对系统提示的多样性**更具韧性**，增强了角色扮演的实施和聊天机器人的条件设置。
* **支持高达128K**的上下文长度，并能生成最多8K的标记。
* 支持29种以上的多语言。

在我广泛（但确实仅限于一次性提示和少量NLP任务）的测试中，我亲眼看到这些声明是基于高质量的训练数据集和精心调整的结果。

该模型在移动设备上的表现极为出色！


