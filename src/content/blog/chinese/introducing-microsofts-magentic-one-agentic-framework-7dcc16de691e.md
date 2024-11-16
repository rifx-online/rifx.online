---
title: "微软 Magentic-One 代理框架介绍"
meta_title: "微软 Magentic-One 代理框架介绍"
description: "微软最近推出了Magentic-One，一个高性能的多智能体系统，旨在执行复杂任务。该系统由一个编排者智能体和四个专门智能体组成，能够进行网页浏览、文件操作、编码和终端指令。Magentic-One基于微软的Autogen框架，具有强大的任务规划和执行能力，但也面临潜在风险，如错误配置可能导致不当行为。用户可以通过GitHub和OpenAI等平台安装和配置该系统，进行多种应用示例，包括编写Python代码和网络搜索。"
date: 2024-11-16T01:24:58Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*dJj20_4jYYp32Crl"
categories: ["Programming", "Autonomous Systems", "Technology/Web"]
author: "Rifx.Online"
tags: ["Magnetic-One", "orchestrator", "agents", "Autogen", "Python"]
draft: False

---



### 一个可以执行复杂任务的多智能体系统

大约一周前，微软发布了一个名为 **Magentic-One** 的新智能系统，旨在“解决复杂任务”，这似乎完全没有引起注意。随着最近关于Anthropic计算机使用能力的热议，微软似乎希望重新确立其在这一领域的资质。

在本文中，我们将介绍Magentic-One，解释其能力，并讨论如何使用它来完成有用的工作。



根据微软自己的公告（文章末尾有链接），Magentic-One是…

“...一个高性能的通用智能体系统，旨在解决此类任务。Magentic-One采用多智能体架构，其中主智能体——编排者，指挥其他四个智能体来解决任务。编排者进行任务规划、跟踪进度，并在出现错误时重新规划，同时指挥专门的智能体执行诸如操作网页浏览器、导航本地文件或编写和执行Python代码等任务。”

Magentic-One建立在微软现有的 **Autogen** 产品之上，该产品是其开源多智能体框架。

Magentic-One有五个关键组件。

**1/ 编排者智能体**

负责任务分解和规划，并将子任务指派给其他智能体执行。跟踪任务完成的进度，并根据需要采取纠正措施。

**2/ 网页浏览智能体**

专注于控制和管理基于Chromium的网页浏览器的状态。对于每个传入请求，网页浏览者在浏览器中执行指定的操作，然后报告网页的更新状态。其操作包括：

* **导航**（例如，访问URL，进行网页搜索），
* **页面交互**（例如，点击元素，输入内容），
* **阅读与理解**（例如，总结内容，回答问题）。

网页浏览者利用浏览器的可访问性树和一套标记提示技术有效地执行任务。

**3/ 文件浏览智能体**

可以读取大多数类型的本地文件，并执行常见的导航任务，例如列出目录内容和导航文件夹结构。

**4/ 编码智能体**

一个基于LLM的智能体，专门用于编写代码、分析从其他智能体收集的信息或创建新工件。

**5/ 终端智能体**

提供对控制台Shell的访问，可以在其中执行编码智能体的程序，并可以安装新的编程库。

### 风险

在继续之前，我想强调微软在其公告中提到的一个特别方面，即使用像这样的Agentic系统所面临的风险。这确实引起了注意。

> 像Magentic\-One这样的Agentic系统代表了在世界上拥有AI系统的机会和风险的相位转变。Magentic\-One与一个为人类设计并由人类居住的数字世界进行交互。它可以采取行动，改变世界的状态，并导致可能是不可逆转的后果。这带来了固有且不可否认的风险，我们在测试过程中观察到了新兴风险的例子。例如，在开发过程中，错误配置导致代理无法成功登录到特定的WebArena网站。代理尝试登录该网站，直到重复的尝试导致账户被暂时暂停。然后，代理尝试重置账户的密码。更令人担忧的是，在少数情况下——并且在未被提示的情况下——代理偶尔试图招募其他人来寻求帮助（例如，通过社交媒体发布、给教科书作者发送电子邮件，或者在一个案例中，向政府实体起草信息自由请求）。在这些情况下，代理都失败了，因为它们没有访问所需工具或账户的权限，和/或被人类观察者阻止。

好的，让我们看看如何使用Magentic\-One来做一些有用的工作的例子。希望在这个过程中我们不会摧毁世界。😉

### 安装 Magentic-One

我是 Windows 用户，但我将使用 WSL2 Ubuntu for Windows 安装代码。如果你想一起操作，我在这里有一个关于安装 WSL2 Ubuntu 的完整指南 [here](https://readmedium.com/installing-wsl2-ubuntu-for-windows-81122c551bc2)。

请通过点击 [here](https://github.com/microsoft/autogen/tree/main/python/packages/autogen-magentic-one) 前往 Magentic-One 的 GitHub 仓库。在你的本地系统上运行以下命令（在你通常放置项目的地方）。

```python
git clone https://github.com/microsoft/autogen.git

cd autogen/python

uv sync --all-extras

source .venv/bin/activate

cd packages/autogen-magentic-one
```
接下来，配置聊天完成客户端的环境变量。目前，Magentic-One 仅支持 OpenAI 的 GPT-4o 作为底层 LLM。

你可以通过 OpenAI 或 Azure Active Directory 设置此配置。以下是使用 OpenAI 的说明。

```python
export CHAT_COMPLETION_PROVIDER='openai'

export CHAT_COMPLETION_KWARGS_JSON='{"api_key": "gpt-4o"}'
```

> **需要注意的一点是，如果你有 GitHub 账户，你可以使用 GitHub 模型中的 GPT4-o 模型，这将为你提供免费访问 GPT4–o 的权限。然而，使用限制可能会有些严格。**

要通过 GitHub 模型进行操作，请点击 [here](https://github.com/marketplace/models) 并使用你的 GitHub 账户登录，或者如果你还没有账户，可以创建一个。点击 GPT-4o 按钮。在显示的页面的右上角，会有一个绿色的 `Get API Key` 按钮。点击它，然后从那里点击 `Get Developer Key` 按钮。

最后，你应该会看到一个屏幕，可以生成一个经典的个人访问令牌。现在就去做吧。你需要输入一个描述密钥用途的备注，但 **你不需要** 赋予它任何额外的权限。记下生成的密钥。

要使用 GitHub GPT4-o 模型，请按如下方式更改你的环境变量：

```python
export CHAT_COMPLETION_PROVIDER='openai'

export CHAT_COMPLETION_KWARGS_JSON='{"base_url": "https://models.inference.ai.azure.com", "api_key": "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", "model": "gpt-4o"}'
```
在运行一些示例代码之前，我们必须安装两个最终依赖项。

Magentic-One 使用 **Playwright** 与网页进行交互，因此你必须安装 Playwright 依赖项。

```python
playwright install --with-deps chromium
```
为了让 Magentic-One 运行 Python 代码，我们需要安装并运行 Docker。请查看 [this link](https://docs.docker.com/engine/install/) 了解如何操作。

最终，我能够试用 Magentic-One。

**示例 1 — 编写一些 Python 代码。**

```python
(base) tom@tpr-desktop:~/projects/autogen/python/packages$ python examples/example --logs_dir ./logs
/home/tom/projects/autogen/python/.venv/lib/python3.11/site-packages/pydub/utils.py:170: RuntimeWarning: Couldn't find ffmpeg or avconv - defaulting to ffmpeg, but may not work
  warn("Couldn't find ffmpeg or avconv - defaulting to ffmpeg, but may not work", RuntimeWarning)
User input ('exit' to quit):  Write a Python program to calculate and display 
the first 5 fibonacci numbers
```
显示了大量输出，但过了一会儿，Magentic-One 问我是否想运行它创建的 Python 代码，我回答是。

```python
...
...

Executor is about to execute code (lang: python):
## filename: fibonacci.py
def fibonacci_sequence(n):
    fib_numbers = [0, 1]
    for i in range(2, n):
        next_value = fib_numbers[i - 1] + fib_numbers[i - 2]
        fib_numbers.append(next_value)
    return fib_numbers

first_five_fib = fibonacci_sequence(5)
print("The first 5 Fibonacci numbers are:", first_five_fib)

Do you want to proceed? (yes/no): yes

---------------------------------------------------------------------------
[2024-11-10T13:25:40.508594], Executor:

The script ran, then exited with Unix exit code: 0
Its output was:
The first 5 Fibonacci numbers are: [0, 1, 1, 2, 3]
...
...
```
**示例 2 — 搜索网络**

要使用 Magentic 搜索网络，你需要一个 Bing API 密钥。你可以通过 Microsoft Azure（Bing Search V7）设置此密钥。

如果你选择最低可用的 **“F”** 级别，可以将其安排为无成本选项。然而，这限制了每秒的搜索次数为 3，并且每月的搜索调用总数也有限制。

设置这个有点复杂，但基本上，你需要遵循以下步骤：

* 如果你没有 Microsoft Azure 账户，注册一个免费的账户
* 在 Azure 门户中创建一个 Bing Search 资源；确保选择最低的 F 级别，这是免费的，但如上所述限制较多。
* 从资源概述中获取你的 API 密钥

一旦你拥有了 Bing API 密钥，将其值分配给 BING_API_KEY 环境变量。

```python
(base) tom@tpr-desktop:~/projects/autogen/python/packages$ python examples/example --logs_dir ./logs
/home/tom/projects/autogen/python/.venv/lib/python3.11/site-packages/pydub/utils.py:170: RuntimeWarning: Couldn't find ffmpeg or avconv - defaulting to ffmpeg, but may not work
  warn("Couldn't find ffmpeg or avconv - defaulting to ffmpeg, but may not work", RuntimeWarning)
User input ('exit' to quit):  search the web and find the current weather 
forecast for Edinburgh UK
```
同样，显示了大量输出，下面是一些更显著的内容。

```python
...
...
Initial plan:

We are working to address the following user request:

search the web and find the current weather forecast for Edinburgh UK


To answer this request we have assembled the following team:

WebSurfer: A helpful assistant with access to a web browser. Ask them to perform web searches, open pages, and interact with content (e.g., clicking links, scrolling the viewport, etc., filling in form fields, etc.) It can also summarize the entire page, or answer questions based on the content of the page. It can also be asked to sleep and wait for pages to load, in cases where the pages seem to be taking a while to load.
Coder: A helpful and general-purpose AI assistant that has strong language skills, Python skills, and Linux command line skills.
Executor: A agent for executing code
file_surfer: An agent that can handle local files.

Here is an initial fact sheet to consider:

1. GIVEN OR VERIFIED FACTS
   - The request is asking for the current weather forecast for Edinburgh, UK.

2. FACTS TO LOOK UP
   - The current weather forecast for Edinburgh, UK can be found on various weather websites such as the BBC Weather, Met Office, or Weather.com.

3. FACTS TO DERIVE
   - N/A

4. EDUCATED GUESSES
   - The current weather forecast will likely include details such as temperature, precipitation chance, wind speed, and potential weather warnings, which are typically part of a standard weather forecast.


Here is the plan to follow as best as possible:

- Request WebSurfer to search for the current weather forecast for Edinburgh, UK on a reliable weather website such as BBC Weather, Met Office, or Weather.com.
- Instruct WebSurfer to summarize the weather forecast details including temperature, precipitation chance, wind speed, and any potential weather warnings.
- Present the gathered weather information for Edinburgh, UK from WebSurfer.

...
...

I typed 'Edinburgh UK current weather forecast' into the browser search bar.

Here is a screenshot of [Edinburgh UK current weather forecast - Search](https://www.bing.com/search?q=Edinburgh+UK+current+weather+forecast&FORM=QBLH). The viewport shows 28% of the webpage, and is positioned at the top of the page.
The following metadata was extracted from the webpage:

{
    "meta_tags": {
        "referrer": "origin-when-cross-origin",
        "og:description": "Intelligent search from Bing makes it easier to quickly find what you\u2019re looking for and rewards you.",
        "og:site_name": "Bing",
        "og:title": "Edinburgh UK current weather forecast - Bing",
        "og:url": "https://www.bing.com/search?q=Edinburgh+UK+current+weather+forecast&FORM=QBLH",
        "fb:app_id": "3732605936979161",
        "og:image": "http://www.bing.com/sa/simg/facebook_sharing_5.png",
        "og:type": "website",
        "og:image:width": "600",
        "og:image:height": "315"
    }
}

Automatic OCR of the page screenshot has detected the following text:

**Page Content:**

Microsoft Bing

Search input field: Edinburgh UK current weather forecast

**Menu:**
- Search
- Copilot
- News
- Images
- Videos
- Maps
- Shopping
- More
- Tools

Deep search
Sign in
Mobile

**Weather Information:**

About 3,180,000 results

Edinburgh
Capital city of Scotland, UK

Buttons:
- Map
- Things to do
- Weather (Selected)
- Covid-19
- Flights
- History
- Travel guide

**Weather Widget:**
**Weather Details:**
12°C / °F
13°
6°
Wind: 17 KMPH
Humidity: 90%
Cloudy · Sun 10, 13:44

**Hourly Forecast:**
14:00  17:00  20:00  23:00  2:00  5:00  8:00  11:00

**Weekly Forecast:**
- Sun 10: 13°/6°
- Mon 11: 🌞 11°/2°
- Tue 12: 🌧 9°/5°
- Wed 13: 🌥 12°/8°
- Thu 14: 🌧 10°/8°
- Fri 15: 🌧 11°/7°
- Sat 16: 🌧 10°/7°
- Sun 17: 🌥 7°/2°

**Sidebar Information:**

- UV index: No forecast
- Moderate breeze: 17 KMPH, WSW
- Sunrise: 07:39 AM
- Sunset: 04:12 PM
...
...
```
最终的答案是这个，完全正确。

```python
[2024-11-10T13:44:43.570437], Orchestrator (final answer):


The current weather in Edinburgh is 12°C with cloudy conditions. 
There's a moderate breeze at 17 KMPH, and the humidity is at 90%. 
The temperature is expected to range between 13°C and 6°C today.
```
**示例 3 — 点击网站链接**

在我写这篇文章时，英国正在进行一场威尔士和斐济之间的大型橄榄球比赛。我想知道威尔士对斐济比赛的最新情况。

```python
(base) tom@tpr-desktop:~/projects/autogen/python/packages$ python examples/example --logs_dir ./logs
/home/tom/projects/autogen/python/.venv/lib/python3.11/site-packages/pydub/utils.py:170: RuntimeWarning: Couldn't find ffmpeg or avconv - defaulting to ffmpeg, but may not work
  warn("Couldn't find ffmpeg or avconv - defaulting to ffmpeg, but may not work", RuntimeWarning)
User input ('exit' to quit):  Click on the bbc.co.uk website, click on the 
Sport link near the top of the page. Look for a link in the page that 
displays about the Wales v Fiji rugby match. Click on that link and tell me 
what the latest score is
```
同样，我省略了许多输出以节省空间。

```python
...
...
...
页面截图的自动OCR检测到以下文本：

当然，这里是转录的文本：

---
**BBC**
登录
首页
新闻
体育
天气
iPlayer
声音
小知识
体育

首页 | 足球 | 板球 | 一级方程式 | 橄榄球U | 橄榄球L | 网球 | 高尔夫 | 拳击 | 田径

发现你的BBC
登录或创建账户以观看、收听和参与

登录或注册

请求已满足。
...
...
...
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
[2024–11–10T13:55:10.606578], Orchestrator (最终答案):
根据BBC体育网站，威尔士与斐济比赛的最新比分是威尔士 7–0 斐济，穆雷得分。
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
[2024–11–10T13:55:10.617212], Orchestrator (终止条件):
```
这是我在模型回答后不久拍的截图（斐济在威尔士的初始得分后很快就得分了）

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*xN8qBJLdHqx0lrh_4Y4DCQ.png)

**示例 4 — 读取本地 XL 文件。**

我在本地系统上有一个 XL 文件。让我们看看 Magentic\-One 是否能找到它、打开它，并回答关于它的问题。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*UIuLEkEr-w6ZckRjiUuqjw.png)


```python
(base) tom@tpr-desktop:~/projects/autogen/python/packages$ python examples/example --logs_dir ./logs
/home/tom/projects/autogen/python/.venv/lib/python3.11/site-packages/pydub/utils.py:170: RuntimeWarning: 找不到 ffmpeg 或 avconv - 默认使用 ffmpeg，但可能无法工作
  warn("找不到 ffmpeg 或 avconv - 默认使用 ffmpeg，但可能无法工作", RuntimeWarning)
用户输入 ('exit' 退出):  我在我的 /mnt/d/data 目录中有一个文件叫
fake_data.xlsx。你能告诉我文件的第三条记录是什么吗
```

```python
...
...

下一个发言者 file_surfer

---------------------------------------------------------------------------
[2024-11-10T14:16:57.676137], file_surfer:

地址: file:///mnt/d/data/fake_data.xlsx
视口位置: 显示第 1 页，共 1 页。
=======================
### Sheet1
| 日期 | 销售 | 支出 |
| --- | --- | --- |
| 2024\-01\-31 | 302 | 187 |
| 2024\-02\-29 | 635 | 472 |
| 2024\-03\-31 | 470 | 199 |
| 2024\-04\-30 | 306 | 459 |
| 2024\-05\-31 | 271 | 251 |
| 2024\-06\-30 | 900 | 230 |
| 2024\-07\-31 | 220 | 249 |
| 2024\-08\-31 | 814 | 408 |
| 2024\-09\-30 | 321 | 357 |
| 2024\-10\-31 | 666 | 443 |
| 2024\-11\-30 | 414 | 393 |
| 2024\-12\-31 | 530 | 485 |

---------------------------------------------------------------------------
[2024-11-10T14:17:00.613740], Orchestrator (思考):

更新的账本:
{
  "is_request_satisfied": {
    "reason": "成功检索并显示了文件 'fake_data.xlsx' 中第三条记录的内容。",
    "answer": true
  },
  "is_in_loop": {
    "reason": "任务以简单的方式完成，没有重复的操作。",
    "answer": false
  },
  "is_progress_being_made": {
    "reason": "第三条记录的内容成功检索并显示，表明进展顺利。",
    "answer": true
  },
  "next_speaker": {
    "reason": "任务已完成，因此不需要进一步的操作。",
    "answer": "file_surfer"
  },
  "instruction_or_question": {
    "reason": "通过提供第三条记录的内容，满足了请求。",
    "answer": "文件中的第三条记录是：日期：2024-03-31，销售额：470，支出：199。"
  }
}

---------------------------------------------------------------------------
[2024-11-10T14:17:00.613806], Orchestrator (思考):

请求已满足。

---------------------------------------------------------------------------
[2024-11-10T14:17:01.465848], Orchestrator (最终答案):


文件 "fake_data.xlsx" 中的第三条记录包含以下信息：

- 日期：2024-03-31
- 销售：470
- 支出：199

---------------------------------------------------------------------------
[2024-11-10T14:17:01.465908], Orchestrator (终止条件):

没有选择代理。
(base) tom@tpr-desktop:~/projects/autogen/python/packages$
```
我喜欢代理确定第一条记录是标题，因此返回了实际的第三条数据记录。这真是了不起。

### 摘要

嗯，我不知道你怎么想，但我认为这是一系列相当令人印象深刻的演示。微软开发了一个非常出色的代理系统，并似乎打算在不久的将来将其完全纳入他们的 Autogen 框架中。

在这篇文章中，我解释了什么是 Magentic-One，以及如何下载和运行它以完成一些有用的任务。我解释了它的关键组件是

* 协调
* 网络和文件浏览
* 编码和终端操作

我通过一系列示例展示了这些组件的工作，包括

* 创建和运行 Python 代码
* 检查本地文件并回答有关其内容的问题
* 在网上搜索信息
* 点击网页链接


> *好的，我现在就到此为止。希望你觉得这篇文章有用。如果有，请通过 [这个链接](https://medium.com/@thomas_reid) 查看我的个人资料页面。在那里，你可以看到我其他已发布的故事，并订阅以获取我发布新内容时的通知。*


> *时局艰难，钱包紧缩，但如果你从这篇文章中获得了真正的价值，请考虑 [请我喝一杯](https://ko-fi.com/taupirho)。*

如果你喜欢这篇内容，我想你也会对这些相关的文章感兴趣。

在此处阅读微软的完整 Magentic-One 公告 [这里](https://www.microsoft.com/en-us/research/articles/magentic-one-a-generalist-multi-agent-system-for-solving-complex-tasks/)。

