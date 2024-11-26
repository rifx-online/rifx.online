---
title: "Introducing Microsoft’s Magentic-One Agentic Framework"
meta_title: "Introducing Microsoft’s Magentic-One Agentic Framework"
description: "Microsoft has introduced the Magentic-One agentic framework, a multi-agent system designed to tackle complex tasks. It features a lead agent called the Orchestrator, which manages four specialized agents: Web Surfer for web browsing, File Surfer for local file navigation, Coder for programming tasks, and Terminal for executing code. The system operates on Microsofts Autogen framework and poses inherent risks, such as potential misconfigurations leading to unintended actions. Magentic-One can perform tasks like writing Python code, retrieving local file data, and conducting web searches, showcasing its versatility and capability in automating complex processes."
date: 2024-11-26T00:31:56Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*dJj20_4jYYp32Crl"
categories: ["Programming", "Autonomous Systems", "Technology/Web"]
author: "Rifx.Online"
tags: ["Magnetic-One", "Orchestrator", "Web-Surfer", "Coder", "Terminal"]
draft: False

---





### A multi\-agent system that can perform complex tasks

Around a week ago, Microsoft released a new agentic system called **Magentic\-One** “for solving complex tasks,” which seems to have gone completely under the radar. With all the recent buzz around Anthropic’s computer use capabilities, Microsoft seems keen to re\-establish its credentials in this area.

In this article, we’ll introduce Magentic\-One, explain its capabilities, and discuss how to use it to do useful work.



According to Microsoft’s own announcement (link at end of article), Magentic\-One is …

“... a high\-performing generalist agentic system designed to solve such tasks. Magentic\-One employs a multi\-agent architecture where a lead agent, the Orchestrator, directs four other agents to solve tasks. The Orchestrator plans, tracks progress, and re\-plans to recover from errors, while directing specialized agents to perform tasks like operating a web browser, navigating local files, or writing and executing Python code.”

Magentic\-One is built on top of Microsoft’s existing **Autogen** product, which is its open\-source multi\-agent framework.

Magentic\-One has five key components.

**1/ The orchestrator agent**

Responsible for task decomposition and planning and directs sub\-tasks to the other agents for execution. Tracks the progress towards task completion and takes corrective actions as required.

**2/ The web surfer agent**

Specialises in controlling and managing the state of a Chromium\-based web browser. For each incoming request, WebSurfer performs a designated action within the browser and then reports the updated state of the webpage. Its actions include:

* **Navigation** (e.g., visiting URLs, performing web searches),
* **Page Interactions** (e.g., clicking elements, typing inputs),
* **Reading and Interpretation** (e.g., summarizing content, answering questions).

WebSurfer utilizes the browser’s accessibility tree and a set\-of\-marks prompting technique to effectively carry out its tasks.

**3/ The file surfer agent**

Can read most types of local files and also perform common navigation tasks such as listing the contents of directories and navigating a folder structure

**4/ The coder agent**

An LLM\-based agent specialized in writing code, analyzing information collected from the other agents, or creating new artefacts.

**5/ The terminal agent**

It provides access to a console shell where the Coder agent’s programs can be executed and where new programming libraries can be installed.


### Risks

Before continuing, I wanted to highlight one particular aspect that Microsoft included in its announcement regarding the risks of using Agentic systems like these. It kind of makes you sit up and take notice.


> Agentic systems like Magentic\-One represent a phase transition in the opportunities and risks of having AI systems in the world. Magentic\-One interacts with a digital world designed for, and inhabited by, humans. It can take actions, change the state of the world and result in consequences that might be irreversible. This carries inherent and undeniable risks and we observed examples of emerging risks during our testing. For example, during development, a misconfiguration prevented agents from successfully logging in to a particular WebArena website. The agents attempted to log in to that website until the repeated attempts caused the account to be temporarily suspended. The agents then attempted to reset the account’s password. More worryingly, in a handful of cases — and until prompted otherwise — the agents occasionally attempted to recruit other humans for help (e.g., by posting to social media, emailing textbook authors, or, in one case, drafting a freedom of information request to a government entity). In each of these cases, the agents failed because they did not have access to the requisite tools or accounts, and/or were stopped by human observers.

Ok, let's see some examples of how we can use Magentic\-One to do some useful work. Hopefully, we won’t destroy the world in the process. 😉


### Installing Magentic\-One

I’m a Windows user, but I will install the code using WSL2 Ubuntu for Windows. if you want to follow along, I have a full guide on installing WSL2 Ubuntu [here](https://readmedium.com/installing-wsl2-ubuntu-for-windows-81122c551bc2).

Head over to the Magentic\-One GitHub repository by clicking [here](https://github.com/microsoft/autogen/tree/main/python/packages/autogen-magentic-one). Run the following commands on your local system (wherever you normally place the projects that you work on).


```python
git clone https://github.com/microsoft/autogen.git

cd autogen/python

uv sync --all-extras

source .venv/bin/activate

cd packages/autogen-magentic-one
```
Next, configure the environment variables for the chat completion client. Currently, Magentic\-One only supports OpenAI’s GPT\-4o as the underlying LLM.

You can set this up via OpenAI or Azure Active Directory. Here are the instructions for using OpenAI.


```python
export CHAT_COMPLETION_PROVIDER='openai'

export CHAT_COMPLETION_KWARGS_JSON='{"api_key": "gpt-4o"}'
```

> **One important point to note is that if you have a GitHub account, you can use the GPT4\-o model from GitHub Models, which will give you FREE access to GPT4–o. However the usage limits can be a bit restrictive.**

To go down using the GitHub Models route, click [here](https://github.com/marketplace/models) and log in with your GitHub account or create an account if you don’t already have one. Click on the GPT\-4o button. On the page that displays, near the top right, there will be a green `Get API Key` button. Click on that, then from there, click the `Get Developer Key` button.

Finally, you should see a screen where you can generate a classic Personal Access Token. So, do that now. You’ll need to enter a note describing what the key is for, but **you do not** have to give it any additional permissions. Take note of the generated key.

To use the GitHub GPT4\-o model, change your environment variables as follows:


```python
export CHAT_COMPLETION_PROVIDER='openai'

export CHAT_COMPLETION_KWARGS_JSON='{"base_url": "https://models.inference.ai.azure.com", "api_key": "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", "model": "gpt-4o"}'
```
Before running some example code, we must install two final dependencies.

Magentic\-One uses **Playwright** to allow it to interact with webpages, so you must install the Playwright dependencies.


```python
playwright install --with-deps chromium
```
To allow Magentic\-One to run Python code, we need to install and run docker. Check out [this link](https://docs.docker.com/engine/install/) on how to do that.

Eventually, I was able to take Magentic\-One for a spin.

**Example 1 — writing some Python code.**


```python
(base) tom@tpr-desktop:~/projects/autogen/python/packages$ python examples/example --logs_dir ./logs
/home/tom/projects/autogen/python/.venv/lib/python3.11/site-packages/pydub/utils.py:170: RuntimeWarning: Couldn't find ffmpeg or avconv - defaulting to ffmpeg, but may not work
  warn("Couldn't find ffmpeg or avconv - defaulting to ffmpeg, but may not work", RuntimeWarning)
User input ('exit' to quit):  Write a Python program to calculate and display 
the first 5 fibonacci numbers
```
There was a whole bunch of output displayed, but after a few seconds, Magentic\-One asked me if I wanted to run the Python code it had created, to which I said yes.


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
**Example 2 — Searching the web**

To search the web using Magentic, you need a Bing API key. You can set this up via Microsoft Azure (Bing Search V7\).

It’s possible to arrange it to be a cost\-free option if you go for the lowest available **“F”** tier. However, this restricts the number of searches per second to 3 and caps the total search calls per month.

It’s a little involved to set this up, but basically, you’ll want to follow these steps,

* Sign up for a free Microsoft Azure account if you don’t have one
* Create a Bing Search resource in the Azure portal; ensure you go for the lowest F tier, which is free but a little restricted, as described above.
* Obtain your API key from the resource overview

Once you have your Bing API key, assign its value to the BING\_API\_KEY environment variable.


```python
(base) tom@tpr-desktop:~/projects/autogen/python/packages$ python examples/example --logs_dir ./logs
/home/tom/projects/autogen/python/.venv/lib/python3.11/site-packages/pydub/utils.py:170: RuntimeWarning: Couldn't find ffmpeg or avconv - defaulting to ffmpeg, but may not work
  warn("Couldn't find ffmpeg or avconv - defaulting to ffmpeg, but may not work", RuntimeWarning)
User input ('exit' to quit):  search the web and find the current weather 
forecast for Edinburgh UK
```
Again, there was a lot of output, some of the more notable stuff is shown below.


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
The final answer was this, which was spot on.


```python
[2024-11-10T13:44:43.570437], Orchestrator (final answer):


The current weather in Edinburgh is 12°C with cloudy conditions. 
There's a moderate breeze at 17 KMPH, and the humidity is at 90%. 
The temperature is expected to range between 13°C and 6°C today.
```
**Example 3 — Clicking on website links**

As I’m writing this article, there is a big Rugby Union game taking place in the UK between Wales and Fiji. I wanted to know the current state of play in the Wales vs. Fiji match.


```python
(base) tom@tpr-desktop:~/projects/autogen/python/packages$ python examples/example --logs_dir ./logs
/home/tom/projects/autogen/python/.venv/lib/python3.11/site-packages/pydub/utils.py:170: RuntimeWarning: Couldn't find ffmpeg or avconv - defaulting to ffmpeg, but may not work
  warn("Couldn't find ffmpeg or avconv - defaulting to ffmpeg, but may not work", RuntimeWarning)
User input ('exit' to quit):  Click on the bbc.co.uk website, click on the 
Sport link near the top of the page. Look for a link in the page that 
displays about the Wales v Fiji rugby match. Click on that link and tell me 
what the latest score is
```
Again, I’m omitting much of the output to save on space.


```python
...
...
...
Automatic OCR of the page screenshot has detected the following text:

Sure, here is the transcribed text:

---
**BBC**
Sign in
Home
News
Sport
Weather
iPlayer
Sounds
Bitesize
Sport

Home | Football | Cricket | Formula 1 | Rugby U | Rugby L | Tennis | Golf | Boxing | Athletics

Discover your BBC
Sign in or create an account to watch, listen, and join in

Sign in or Register

Request satisfied.
...
...
...
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
[2024–11–10T13:55:10.606578], Orchestrator (final answer):
The latest score for the Wales vs. Fiji match, according to the BBC Sport 
website, is Wales 7–0 Fiji with a try from Murray.
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
[2024–11–10T13:55:10.617212], Orchestrator (termination condition):
```
Here is a screenshot I took shortly after the model answered (Fiji must have scored very quickly after Wales’ initial score)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*xN8qBJLdHqx0lrh_4Y4DCQ.png)

**Example 4 — reading a local XL file.**

I have an XL file on my local system. Let’s see if Magentic\-One can find it, open it, and answer a question about it.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*UIuLEkEr-w6ZckRjiUuqjw.png)


```python
(base) tom@tpr-desktop:~/projects/autogen/python/packages$ python examples/example --logs_dir ./logs
/home/tom/projects/autogen/python/.venv/lib/python3.11/site-packages/pydub/utils.py:170: RuntimeWarning: Couldn't find ffmpeg or avconv - defaulting to ffmpeg, but may not work
  warn("Couldn't find ffmpeg or avconv - defaulting to ffmpeg, but may not work", RuntimeWarning)
User input ('exit' to quit):  I have a file in my /mnt/d/data directorty called
fake_data.xlsx. Can you tell me what is in the third record of the file
```

```python
...
...

Next speaker file_surfer

---------------------------------------------------------------------------
[2024-11-10T14:16:57.676137], file_surfer:

Address: file:///mnt/d/data/fake_data.xlsx
Viewport position: Showing page 1 of 1.
=======================
### Sheet1
| Date | Sales | Expenses |
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
[2024-11-10T14:17:00.613740], Orchestrator (thought):

Updated Ledger:
{
  "is_request_satisfied": {
    "reason": "The contents of the third record in the file 'fake_data.xlsx' have been successfully retrieved and displayed.",
    "answer": true
  },
  "is_in_loop": {
    "reason": "The task was completed in a straightforward manner without any repeated actions.",
    "answer": false
  },
  "is_progress_being_made": {
    "reason": "The content of the third record was successfully retrieved and displayed, indicating successful progress.",
    "answer": true
  },
  "next_speaker": {
    "reason": "The task is complete, so no further action is needed.",
    "answer": "file_surfer"
  },
  "instruction_or_question": {
    "reason": "The request has been satisfied by providing the contents of the third record.",
    "answer": "The third record in the file is: Date: 2024-03-31, Sales: 470, Expenses: 199."
  }
}

---------------------------------------------------------------------------
[2024-11-10T14:17:00.613806], Orchestrator (thought):

Request satisfied.

---------------------------------------------------------------------------
[2024-11-10T14:17:01.465848], Orchestrator (final answer):


The third record in your file "fake_data.xlsx" contains the following information:

- Date: 2024-03-31
- Sales: 470
- Expenses: 199

---------------------------------------------------------------------------
[2024-11-10T14:17:01.465908], Orchestrator (termination condition):

No agent selected.
(base) tom@tpr-desktop:~/projects/autogen/python/packages$
```
I liked the fact that the agent determined that the first record was a header, so it returned the actual third proper data record. That’s quite something.


### Summary

Well, I don’t know about you, but I thought that was a set of pretty impressive demonstrations. Microsoft has produced a really good agentic system and seems intent on incorporating it fully into their Autogen framework in the near future.

In this article, I explained what Magentic\-One was and how to download it and run it to do some useful tasks. I explained that its key components were

* orchestration
* web and file surfing
* coding and terminal operations

I showed each of these components at work through a series of examples, including

* the creation and running of Python code
* examing a local file and answering questions on its content
* searching for information on the web
* clicking web links


> *OK, that’s all for me for now. Hopefully, you found this article useful. If you did, please check out my profile page at [this link](https://medium.com/@thomas_reid). From there, you can see my other published stories and subscribe to get notified when I post new content.*


> *Times are tough and wallets constrained, but if you got real value from this article, please consider [buying me a wee dram](https://ko-fi.com/taupirho).*

If you liked this content, I think you’ll also find these related articles interesting.

Read the full Magentic\-One announcement from Microsoft [here](https://www.microsoft.com/en-us/research/articles/magentic-one-a-generalist-multi-agent-system-for-solving-complex-tasks/).


