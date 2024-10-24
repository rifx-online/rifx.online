---
title: "Qwen2.5 1.5b: the future of Mobile AI?"
meta_title: "Qwen2.5 1.5b: the future of Mobile AI?"
description: "Local Testing and Evaluation of Alibaba Cloud’s Latest LLM. With llama-cpp-python and a DIY prompt catalog."
date: 2024-10-24T04:25:22Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*awb56jkdXobA-Ip6d-QHRA.png"
categories: ["query"]
author: "Rifx.Online"
tags: ["query"]
draft: False

---

### Local Testing and Evaluation of Alibaba Cloud’s Latest LLM. With llama-cpp-python and a DIY prompt catalog.



In part one we explored together the innovations from Alibaba Cloud’s team with the release of the Qwen2.5 models family.

In Generative AI benchmarks are now the main *oracle*: the validity of a new LLM needs to pass several verdicts. The more benchmark records you break, the better you are.

It is the way to win the SOTA race

Well, I disagree. Even though for the AI advancement we need milestones and better performances, still the user experience and the personal point of view cannot be just put aside as irrelevant.

I believe that exploring some frequently used NLP tasks, and putting aside the chat experience, we must focus on the quality of the replies. And we are the only benchmark required. Our user experience is the best indicator to understand if a model is good or not. The model must be reliable enough to be used in an automated workflow.

By the way, I already run what I decided to call [RBYF — Revised Benchmarks with You as a Feedback](https://open.substack.com/pub/thepoorgpuguy/p/rbyf-is-here-revised-benchmarks-with?r=i78xo&utm_campaign=post&utm_medium=web) on the claimed amazing Llama3.2–1B-instruct… and Qwen2.5–1.5b is so much better!

So in this article, as promised, we will verify with our own eyes how good is this model for every day use.

Back to us… Let’s get started!

## Requirements

Here we are going to build a minimal text interface to be able to run the model, test different tasks and wait for user feedback to evaluate it.

The requirements are minimal, but I suggest you to create a new project directory and a virtual environment.

Create a `venv` (python 3.11+ is required): I tested it on my Mini-PC running Windows 11.

```python
## create the virtual environment
python -m venv venv
## activate the venv
venv\Scripts\activate
## Install the dependencies 
pip install llama-cpp-python==0.3.0 tiktoken
```

We need to download the GGUF file from the official qwen repository on Hugging Face [https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF](https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF): I used the `qwen2.5-1.5b-instruct-q5_k_m.gguf` version.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*YtQJb_xyq_xcF40yRWPcZA.png)

We are all set!

Note: if you want to add a different Backend support of a GPU accelerator, you can follow [the instructions in the repo](https://github.com/abetlen/llama-cpp-python#supported-backends). I used, for example, the Vulkan support so before the pip install I added the environment variable

```python
## Vulkan support - for Windows
$env:CMAKE_ARGS = "-DGGML_VULKAN=on"
```

## The Code — a main app and a library

To keep the code at minimum, I decided to extend some functionalities using an external library. Well, it is a Do It Yourself library, so there are no secrets here.

You can find all the details in my article here:

And to speed it up you can directly [download the file from here](https://github.com/fabiomatricardi/YouAreTheBenchmark/raw/main/QWEN2.5-1.5B/promptLibv2Qwen.py): it contains a version 2 of the `promptLib` discussed in the mentioned above article (and it is called `promptLibv2Qwen.py`, with few fine tuning of the prompt specifically tailored for the `Qwen2.5-1.5B-instruct` model.

Save the file in the main directory, and create a new file called `main.py`

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
stops = ['<|im_end|>']
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

Here we are only doing preparations: we import the libraries, including our own personal `promptLibv2Qwen` and also `argparse`. I wanted to try something new: [argparse](https://realpython.com/command-line-interfaces-python-argparse/) is a python library intended for terminal python program where you are reading multiple arguments from the command line.

In this case here we have only one argument (and no parameters) with th flag `-g` or even `--gpu`. When you run the python code with this argument we will set the number of GPU layers to the maximum (but you can change it yourself).

Then we set some global variables, used across the entire code: the tasks, our prompt collection, the stop words and the log filename.

> NOTE: all the logs are saved into a subdirectory called `logs`… so make sure to create one.

We are also preparing all the relevant information to store them into a dataset and then save it at the end int a CSV file (for easily creating a performance matrix)

```python
### PREPARING FINAL DATASET
pd_id = []
pd_task = []
pd_vote = []
pd_remarks = []
```

We then load the model into RAM (no GPU) or the VRAM (with GPU) using Llama-CPP-python.

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

By the way, you can find all the code in my GitHub Repository:

The next one is a one-shot warm up inference: the model neural network is going to be activated for the first time, so think about it like a warm-up lap.

Don’t be scared, I will explain the code

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

We set the first user question and put into a well known chat format dictionary. Then we start our timer (useful for speed, token counts etc…).

We call the inference with the method `create_chat_completion()` that allows us to accept the prompts in chat format and stream the output one token at the time.

Because of the first reply from the model does not contain any output tokens (but only statistics) we use the try/except statement. Furthermore, since I want to know when the first token is generated, we raise a flag and stop temporary our time count saving the information inside the `ttftoken` variable.

At the end of the streaming we count the delta time from start, and wait the user to provide his/her personal feedback on the generated output: giving a mark from 0 to 5 and adding comments related to the compliance with the instruction prompt and user intent.

We use our internal library called `createStats()` to print all the statistics of the generation, and save them in our log file. The output of the function will be something like this:

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*8znYCqpisviXvYgrzjWF5w.png)

## Prompt catalog — what we want to test

I wrote here about my habit. I have a catalog of prompts that covers many of the main language tasks used in chat-bots, like summarization, short summarization, casual chat, RAG, truthful RAG and so on.

The idea is to be able to load the model in 5 minutes, and start evaluating each task. At the end of every generation the user is prompted to give a mark (a score from 0 to 5) and leave any comments if required.

This is crucial: not all the models are alike, and small/big adjustments to the wording in the prompts are always required.

So back to the code… Because the previous one was only a warm-up, now it will start the real while loop, iterating over the entire prompt catalog. See the workflow here below…

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*EL0Q97Du6HwtcYQZ.png)

There are only few changes in the code, and I will point them out, so bear with me.

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

The main changes are only in the first lines:

```python
for items in tasks:
    fisrtround = 0
    task = items["task"]
    prompt = items["prompt"]
```

If you read the article about the `promptLib` you shouldn’t be surprised: but if you are new, here we are iterating over a list of dictionaries with the following structure:

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*rGcKJWNzSUrcu4wi.png)

So for each items in the catalog (means a pair of tasks and prompts) we extract the task description and the prompt for the task.

```python
test.append({"role": "user", "content": prompt})
```

Then we create the chat template message in a temporary list called `test` and pass it to the `create_chat_template()` method for generation.

Everything else is the same.

Save the file, and with the `venv` activated run:

```python
python main.py
## if you are using the GPU python main.py -g
```

This will get you something like the below example…

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*MhhQu4lLjtU__Wjf0dSWBg.gif)

Note that at the end of the entire Prompt Catalog a *csv* file is created with the summary of all the tasks!

## Test Overview

I run them with several Small Language Models, from [Qwen2–1.5B-instruct](https://huggingface.co/Qwen/Qwen2-1.5B-Instruct-GGUF), to [Gemma2–2B-instruct](https://huggingface.co/bartowski/gemma-2-2b-it-GGUF), with [Llama3.2–1B-instruct](https://huggingface.co/bartowski/Llama-3.2-1B-Instruct-GGUF) and finally the new [Qwen2.5–1.5B-instruct](https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF).

While I was [quite disappointed by Llama3.2–1B-instruct](https://generativeai.pub/llama3-2-1b-instruct-is-ok-but-not-good-enough-28f88046b63e), I have been amazed by the good job done by the new [Qwen2.5–1.5B-instruct](https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF).

At the end of every generation the user is asked to evaluate the results with a mark from 0 to 5. **In this case the user is me…**

This kind of qualitative analysis is indeed poor, so every mark does have a description, and the user can add comments (“some wrong information”, “maybe better change the wording in the prompt” )

Here the qualitative matrix with a description

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*eBdPfZtfr99MsvLh6tt42w.png)

## The good and the bad — details

Summarization was amazing. Listing the main topics over a log text was also very good.

The RAG tasks were quite fast (even on my mini-PC) and truthful RAG (ask questions out of the context) was on spot.

So really good.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*DuV3LJep_PuDqiCcAMb6Cg.png)

There were also few shortcomings: even with a temperature of only `0.15` I got some made up information in the summarize in two sentences task. And this is not good.

> I expect this can be fixed with a little prompt tuning, or with a temperature at `0`.

Another fact is that the creative writing was quite bad: for the test I used some fixed Generation Parameters.

```python
        temperature=0.15,
        repeat_penalty= 1.31,
```

Probably for creative writing, with Qwen2.5–1.5B-instruct, we should use an higher `repeat_penalty` and also a higher `temperature`.

As a side note I have to say that also the reflection prompt was not that bad at all! The opening/closure of the tags was not maintained (so not easy to put this into a pipeline or workflow) but the overall flow of the generation and the “Chain of Thought” reasoning process was fairly good.

```python
<thinking>
The importance of using Generative Artificial Intelligence (AI) in 
teaching cannot be overstated, as this technology has immense potential 
not only within current educational practices but also towards shaping a 
more innovative approach to lifelong learning.
</thinking>

**Chain Of Thought:**
1. **Understanding the Impact**: AI can automate repetitive tasks and provide 
personalized feedback for students based on their performance data 
(e.g., through chatbots or adaptive assessments).
2. **Enhancing Learning Experience**: By integrating Generative AI, 
teachers could create more engaging lessons that cater to diverse learning 
styles.
3. **Improving Student Outcomes**: Personalized instruction can lead to 
better understanding and retention of knowledge for students.

**Reflection:**
- The integration of generational technology in education is crucial as 
it aligns with the evolving needs of learners who are increasingly digital 
natives, requiring a pedagogical approach that incorporates these technologies.
</thinking>

<output>
Teachers should learn how Generative AI can be used to enhance their teaching 
methods and improve student outcomes. This includes understanding its 
capabilities for automating tasks like grading or creating personalized 
learning paths.

**Learning Path:**
1. **Foundation Courses in Education Technology**: Start with courses 
that provide an overview of educational technology, including the basics 
of digital tools.
2. **AI Fundamentals Course (Coursera)** - Learn about AI concepts and 
how they can be applied to education through Coursera's free online 
course on Artificial Intelligence for Educators.

3. **Specialized Courses in Generative Learning**: Enroll in courses 
that focus specifically on generational learning, such as "Generative Design" 
or similar specialized programs offered by universities like MIT.
4. **Professional Development Workshops and Conferences** - Attend 
workshops focused on integrating AI into teaching practices at local 
educational conferences.

5. **Online Communities for Educators (e.g., Edmodo)**: Join online 
communities where educators discuss the use of generative technology 
in education, share resources, or ask questions about implementation.
6. **Certification Programs**: Consider obtaining certifications that 
recognize your knowledge and skills related to AI integration into teaching 
practices through organizations like Google's "AI for Educators" program.

By following this learning path, teachers can not only enhance their own 
professional development but also contribute positively towards the future 
of education by incorporating generative technology effectively.
</output>
```

I think that for the size of this Small Language Model, the result is not bad at all!

## Comparing Qwen2.5 with Llama3.2

Even though this is only coming from my personal evaluation, I want to share it with you.

Both models are designed to be used on mobile devices, but the performance is quite different. Look here below:

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*T6vLgvOKdkotlV1K5x6-QQ.png)

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*DuV3LJep_PuDqiCcAMb6Cg.png)

First of all, the overall score difference is huge (41 for Llama3.2, 57 for Qwen2.5).

Secondly if you think about what you may ask on a mobile device, in terms of language tasks, is to have a smooth chatting experience (task 4), good summarization (tasks five to 7) and some creative writing (task 11 and 13).

In terms of speed, running the model only on CPU, with a very limited mini-PC, **I got an average inference speed of 14 t/s.**

## Conclusions

In the past three months since Qwen2’s release, numerous developers have built new models on the Qwen2 language models, providing valuable feedback to the entire community, but also to Alibaba Cloud.

> During this period, we have focused on creating smarter and more knowledgeable language models. Today, we are excited to introduce the latest addition to the Qwen family: Qwen2.5

Their claims come with facts about the new family of models:

* Dense, **easy-to-use**, decoder-only language models, available in 0.5B, 1.5B, 3B, 7B, 14B, 32B, and 72B sizes, and base and instruct variants.
* Pretrained on our latest large-scale dataset, encompassing up to 18T tokens.
* Significant improvements in **instruction following**
* More **resilient to the diversity of system prompts**, enhancing role-play implementation and condition-setting for chatbots.
* **Context length support up to 128K** tokens and can generate up to 8K tokens.
* Multilingual support for over 29 languages

In my extensive (but certainly limited to one shot prompts and on few NLP tasks) tests I could see with my very own eyes that the claims were based on a good quality training dataset and curated fine tuning.

This model can perform extremely good on mobile devices!


