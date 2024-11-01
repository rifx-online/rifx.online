---
title: "Qwen2.5 1.5b：移动AI的未来？"
meta_title: "Qwen2.5 1.5b：移动AI的未来？"
description: "阿里云最新 LLM 的本地测试和评估。使用 llama-cpp-python 和 DIY 提示目录。"
date: 2024-10-30T12:57:39Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*awb56jkdXobA-Ip6d-QHRA.png"
categories: ["Natural Language Processing", "Programming", "Technology/Web"]
author: "Rifx.Online"
tags: ["Qwen2.5", "NLP", "summarization", "retrieval", "prompts"]
draft: False

---

### 本地测试和评估阿里云最新的LLM。使用llama\-cpp\-python和DIY提示目录。



在第一部分，我们共同探讨了阿里云团队发布的Qwen2\.5模型系列的创新。

在生成式AI基准测试中，基准测试现在是主要的*oracle*：新的LLM的有效性需要通过多个评判。你打破的基准记录越多，你就越优秀。

这是赢得SOTA竞赛的方式。

好吧，我不同意。尽管我们需要里程碑和更好的性能来推动AI进步，但用户体验和个人观点不能被视为无关紧要。

我相信，在探索一些常用的NLP任务时，抛开聊天体验，我们必须关注回复的质量。我们是唯一需要的基准。我们的用户体验是判断一个模型是否优秀的最佳指标。模型必须足够可靠，以便在自动化工作流程中使用。

顺便提一下，我已经运行了我决定称之为[RBYF — 与您作为反馈的修订基准](https://open.substack.com/pub/thepoorgpuguy/p/rbyf-is-here-revised-benchmarks-with?r=i78xo&utm_campaign=post&utm_medium=web)的测试，声称惊人的Llama3\.2–1B\-instruct…而Qwen2\.5–1\.5b则更好得多！

因此，在本文中，正如承诺的那样，我们将亲自验证这个模型在日常使用中的表现有多好。

回到我们自己……让我们开始吧！

## 需求

在这里，我们将构建一个最小的文本接口，以便能够运行模型、测试不同的任务并等待用户反馈以进行评估。

需求很简单，但我建议您创建一个新的项目目录和一个虚拟环境。

创建一个 `venv`（需要 Python 3\.11\+）：我在运行 Windows 11 的迷你电脑上进行了测试。

```python
## create the virtual environment
python -m venv venv
## activate the venv
venv\Scripts\activate
## Install the dependencies 
pip install llama-cpp-python==0.3.0 tiktoken
```

我们需要从 Hugging Face 的官方 qwen 仓库下载 GGUF 文件 [https://huggingface.co/Qwen/Qwen2\.5\-1\.5B\-Instruct\-GGUF](https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF)：我使用了 `qwen2.5-1.5b-instruct-q5_k_m.gguf` 版本。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*YtQJb_xyq_xcF40yRWPcZA.png)

一切准备就绪！

注意：如果您想添加对 GPU 加速器的不同后端支持，可以按照 [仓库中的说明](https://github.com/abetlen/llama-cpp-python#supported-backends) 进行操作。例如，我使用了 Vulkan 支持，因此在 pip 安装之前我添加了环境变量

```python
## Vulkan support - for Windows
$env:CMAKE_ARGS = "-DGGML_VULKAN=on"
```

## 代码 — 主应用程序和库

为了保持代码的简洁，我决定使用外部库扩展一些功能。好吧，这是一个自助库，所以这里没有秘密。

您可以在我的文章中找到所有细节：

为了加快速度，您可以直接 [从这里下载文件](https://github.com/fabiomatricardi/YouAreTheBenchmark/raw/main/QWEN2.5-1.5B/promptLibv2Qwen.py)：它包含了上述文章中讨论的 `promptLib` 的版本 2（名为 `promptLibv2Qwen.py`，对 `Qwen2.5-1.5B-instruct` 模型的提示进行了少量微调）。

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
stops = ['<!im_end|>']
tasks = createCatalog()
modelname = 'qwen2.5-1.5b-instruct-q5_k_m.gguf'
## create THE LOG FILE 
coded5 = genRANstring(5)
logfile = f'logs/Qwen2.5-1.5B-it_CPP_{coded5}_log.txt'
csvfile = f'logs/Qwen2.5-1.5B-it_CPP_{coded5}.csv'
logfilename = logfile
#Write in the history the first 2 sessions
writehistory(logfilename,f'{str(datetime.datetime.now())}\n\nYour own LocalGPT with 💻 {modelname}\n---\n🧠🫡: You are a helpful assistant.')  
writehistory(logfilename,f'💻: How can I assist you today in writing?')
```

在这里，我们只是在做准备：我们导入库，包括我们自己的 `promptLibv2Qwen` 以及 `argparse`。我想尝试一些新东西：[argparse](https://realpython.com/command-line-interfaces-python-argparse/) 是一个用于终端 Python 程序的 Python 库，您可以从命令行读取多个参数。

在这里，我们只有一个参数（没有参数），带有标志 `-g` 或 `--gpu`。当您使用此参数运行 Python 代码时，我们将设置 GPU 层的数量为最大值（但您可以自行更改）。

然后，我们设置一些全局变量，跨整个代码使用：任务、我们的提示集合、停止词和日志文件名。

> 注意：所有日志都保存在名为 `logs` 的子目录中……所以请确保创建一个。

我们还准备了所有相关信息，以便将其存储到数据集中，然后最终保存到 CSV 文件中（以便轻松创建性能矩阵）。

```python
### PREPARING FINAL DATASET
pd_id = []
pd_task = []
pd_vote = []
pd_remarks = []
```

然后，我们使用 Llama\-CPP\-python 将模型加载到 RAM（没有 GPU）或 VRAM（使用 GPU）中。

```python
## LOAD THE MODEL
print("\033[95;3;6m")
print("1. Waiting 10 seconds for the API to load...")
from llama_cpp import Llama
llm = Llama(
            model_path='models/qwen2.5-1.5b-instruct-q5_k_m.gguf',
            n_gpu_layers=ngpu_layers,
            temperature=0.1,
            n_ctx=8192,
            max_tokens=1500,
            repeat_penalty=1.178,
            stop=stops,
            verbose=False,
            )
print(f"2. Model {modelname} loaded with LlamaCPP...")
print("\033[0m")  #reset all
history = []
print("\033[92;1m")
print(f'📝Logfile: {logfilename}')
```

顺便说一句，您可以在我的 GitHub 仓库中找到所有代码：

下一个是一次性热身推理：模型神经网络将首次激活，所以可以把它看作是热身圈。

不要害怕，我会解释代码。

```python
##################### ALIGNMENT FIRST GENERATION ##############################################
question = 'Explain the plot of Cinderella in a sentence.'
test = [
    {"role": "user", "content": question}
]
print('Question:', question)
start = datetime.datetime.now()
print("💻 > ", end="", flush=True)
full_response = ""
fisrtround = 0
for chunk in llm.create_chat_completion(
    messages=test,
    temperature=0.25,
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
output = full_response
print('')
print("\033[91;1m")
rating = input('Rate from 0 (BAD) to 5 (VERY GOOD) the quality of generation> ')
print("\033[92;1m")
stats = createStats(delta,question,output,rating,logfilename,'Alignment Generation',ttftoken)
print(stats)
writehistory(logfilename,f'''👨‍💻 . {question}
💻 > {output}
{stats}
''')
```

我们设置了第一个用户问题，并将其放入一个众所周知的聊天格式字典中。然后我们开始计时（对速度、令牌计数等很有用……）。

我们调用推理方法 `create_chat_completion()`，允许我们以聊天格式接受提示，并逐个令牌流式输出结果。

由于模型的第一次回复不包含任何输出令牌（仅包含统计信息），我们使用了 try/except 语句。此外，由于我想知道何时生成第一个令牌，我们设置了一个标志并暂时停止计时，将信息保存在 `ttftoken` 变量中。

在流式输出结束时，我们计算从开始到现在的时间差，并等待用户提供对生成输出的个人反馈：从 0 到 5 评分，并添加与指令提示和用户意图的一致性相关的评论。

我们使用内部库 `createStats()` 来打印生成的所有统计信息，并将其保存到日志文件中。该函数的输出将类似于以下内容：

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*8znYCqpisviXvYgrzjWF5w.png)

## 提示目录 — 我们想要测试的内容

我在这里写了我的习惯。我有一个提示目录，涵盖了聊天机器人中使用的许多主要语言任务，例如总结、简短总结、随意聊天、RAG、真实RAG等等。

这个想法是能够在5分钟内加载模型，并开始评估每个任务。在每次生成结束时，用户会被提示给出一个分数（从0到5的评分）并在需要时留下任何评论。

这很关键：并不是所有模型都是一样的，对提示中的措辞进行小的或大的调整总是必需的。

那么回到代码……因为之前的代码只是热身，现在将开始真正的while循环，遍历整个提示目录。请参见下面的工作流程……

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

主要更改仅在前几行：

```python
for items in tasks:
    fisrtround = 0
    task = items["task"]
    prompt = items["prompt"]
```

如果你阅读了关于`promptLib`的文章，你应该不会感到惊讶：但如果你是新手，这里我们正在遍历一个字典列表，具有以下结构：

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*rGcKJWNzSUrcu4wi.png)

因此，对于目录中的每个条目（意味着任务和提示的对），我们提取任务描述和任务提示。

```python
test.append({"role": "user", "content": prompt})
```

然后我们在一个临时列表`test`中创建聊天模板消息，并将其传递给`create_chat_template()`方法进行生成。

其他内容都是一样的。

保存文件，并在激活`venv`的情况下运行：

```python
python main.py
## 如果你使用的是GPU，运行 python main.py -g
```

这将为你提供类似于下面示例的内容……

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*MhhQu4lLjtU__Wjf0dSWBg.gif)

请注意，在整个提示目录的末尾，会创建一个*csv*文件，其中包含所有任务的摘要！

## 测试概述

我使用了几个小型语言模型，从 [Qwen2–1\.5B\-instruct](https://huggingface.co/Qwen/Qwen2-1.5B-Instruct-GGUF) 到 [Gemma2–2B\-instruct](https://huggingface.co/bartowski/gemma-2-2b-it-GGUF)，再到 [Llama3\.2–1B\-instruct](https://huggingface.co/bartowski/Llama-3.2-1B-Instruct-GGUF)，最后是新的 [Qwen2\.5–1\.5B\-instruct](https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF)。

虽然我对 [Llama3\.2–1B\-instruct](https://generativeai.pub/llama3-2-1b-instruct-is-ok-but-not-good-enough-28f88046b63e) 感到相当失望，但对新的 [Qwen2\.5–1\.5B\-instruct](https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF) 的出色表现感到惊讶。

在每次生成结束时，用户会被要求用 0 到 5 之间的分数来评估结果。**在这种情况下，用户就是我……**

这种定性分析确实较为简单，因此每个分数都有相应的描述，用户可以添加评论（“一些错误信息”，“可能更好地更改提示中的措辞”）

这里是定性矩阵及其描述

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*eBdPfZtfr99MsvLh6tt42w.png)

## 好与坏 — 细节

总结非常出色。列出长文本的主要主题也非常好。

RAG 任务相当快速（即使在我的迷你 PC 上），真实的 RAG（在上下文之外提问）也很到位。

所以真的很好。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*DuV3LJep_PuDqiCcAMb6Cg.png)

不过也有一些不足之处：即使温度只有 `0.15`，我在两句总结任务中也得到了些虚构的信息。这不好。

> 我希望通过稍微调整提示，或者将温度设为 `0` 可以解决这个问题。

另一个事实是，创意写作相当糟糕：在测试中，我使用了一些固定的生成参数。

```python
        temperature=0.15,
        repeat_penalty= 1.31,
```

对于创意写作，使用 Qwen2\.5–1\.5B\-instruct 时，我们应该使用更高的 `repeat_penalty` 和更高的 `temperature`。

顺便提一下，我必须说反思提示也并不差！标签的开闭没有保持（因此不易将其放入管道或工作流中），但生成的整体流程和“思维链”推理过程相当不错。

```python
<thinking>
使用生成性人工智能（AI）在教学中的重要性不容小觑，因为这项技术在当前教育实践中具有巨大的潜力，同时也有助于塑造更具创新性的终身学习方法。
</thinking>

**思维链：**
1. **理解影响**：AI可以自动化重复性任务，并根据学生的表现数据提供个性化反馈（例如，通过聊天机器人或自适应评估）。
2. **增强学习体验**：通过整合生成性AI，教师可以创建更具吸引力的课程，以满足多样化的学习风格。
3. **改善学生成果**：个性化教学可以帮助学生更好地理解和记忆知识。

**反思：**
- 将生成技术整合到教育中至关重要，因为这与日益成为数字原住民的学习者的不断变化的需求相一致，需要一种将这些技术纳入其中的教学方法。
</thinking>

<output>
教师应学习如何利用生成性AI来增强他们的教学方法并改善学生成果。这包括理解其在自动化任务（如评分或创建个性化学习路径）方面的能力。

**学习路径：**
1. **教育技术基础课程**：首先学习提供教育技术概述的课程，包括数字工具的基础知识。
2. **AI基础课程（Coursera）** - 通过Coursera的免费在线课程了解AI概念及其在教育中的应用。

3. **生成学习的专业课程**：报名参加专注于生成学习的课程，如“生成设计”或MIT等大学提供的类似专业项目。
4. **专业发展研讨会和会议** - 参加当地教育会议上专注于将AI整合到教学实践中的研讨会。

5. **教育工作者在线社区（例如，Edmodo）**：加入在线社区，与教育工作者讨论生成技术在教育中的应用，分享资源或询问实施问题。
6. **认证项目**：考虑通过像谷歌的“AI for Educators”项目等机构获得认可您在教学实践中整合AI相关知识和技能的认证。

通过遵循这条学习路径，教师不仅可以增强自身的专业发展，还可以通过有效地整合生成技术，为教育的未来做出积极贡献。
</output>
```

我认为，对于这个小型语言模型的规模，结果并不差！

## 比较 Qwen2\.5 和 Llama3\.2

尽管这仅仅是我个人的评估，我还是想和你分享一下。

这两个模型都是为移动设备设计的，但性能差异很大。请看下面：

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*T6vLgvOKdkotlV1K5x6-QQ.png)

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*DuV3LJep_PuDqiCcAMb6Cg.png)

首先，整体评分差异巨大（Llama3\.2 为 41，Qwen2\.5 为 57\）。

其次，如果你考虑在移动设备上可能会问的问题，语言任务方面，主要是希望有流畅的聊天体验（任务 4\）、良好的摘要能力（任务 5 到 7\）以及一些创造性写作（任务 11 和 13\）。

在速度方面，仅在 CPU 上运行模型，使用非常有限的迷你 PC，**我获得了平均推理速度为 14 t/s。**

## 结论

在 Qwen2 发布的过去三个月里，众多开发者在 Qwen2 语言模型上构建了新模型，为整个社区以及阿里云提供了宝贵的反馈。

> 在此期间，我们专注于创造更智能、更有知识的语言模型。今天，我们很高兴地介绍 Qwen 家族的最新成员：Qwen2\.5

他们的声明伴随着关于新模型家族的事实：

* 密集型、**易于使用**的仅解码器语言模型，提供 0\.5B、1\.5B、3B、7B、14B、32B 和 72B 尺寸，以及基础和指令变体。
* 在我们最新的大规模数据集上进行预训练，涵盖多达 18T 的标记。
* **指令跟随**方面的显著改进
* 对系统提示的多样性**更具弹性**，增强角色扮演实施和聊天机器人的条件设置。
* **支持高达 128K** 的上下文长度，并可以生成最多 8K 的标记。
* 支持超过 29 种语言的多语言功能

在我广泛的（但确实限于单次提示和少数 NLP 任务）测试中，我亲眼看到这些声明是基于高质量的训练数据集和精心策划的微调。

该模型在移动设备上表现极为出色！


