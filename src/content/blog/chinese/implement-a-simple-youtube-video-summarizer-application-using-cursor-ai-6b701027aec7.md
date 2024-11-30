---
title: "使用光标人工智能实现简单的 YouTube 视频摘要应用程序"
meta_title: "使用光标人工智能实现简单的 YouTube 视频摘要应用程序"
description: "Cursor AI 是一个基于 VS Code 的创新代码编辑器，集成了先进的 AI 工具，以简化编码过程。其主要特性包括 AI 代码补全、错误检测与修正、自然语言命令和动态代码优化。通过实时互动和用户友好的界面，Cursor AI 提高了开发者的生产力，增强了协作，且为初学者提供了学习支持。本文还展示了如何使用 Cursor AI 开发一个 YouTube 视频摘要应用程序，强调了其在现代软件开发中的重要性。"
date: 2024-11-30T13:55:30Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*hzqdCDHFxZymdFbUzcG6_Q.jpeg"
categories: ["Programming", "Natural Language Processing", "Machine Learning"]
author: "Rifx.Online"
tags: ["Cursor", "FastAPI", "summarizer", "code", "optimization"]
draft: False

---





## 介绍

[Cursor AI](https://www.trycursor.com/) 正在通过将先进的人工智能集成到熟悉的编码环境中，彻底改变软件开发。作为 Visual Studio Code (VS Code) 的一个分支，Cursor AI 保留了开发者所喜爱的用户友好界面和广泛的生态系统，同时通过 OpenAI 的 ChatGPT 和 Claude 等模型增强了功能。

## Cursor AI 是什么？

Cursor AI 是一个创新的代码编辑器，旨在简化编码过程。它结合了 VS Code 的强大功能和先进的 AI 工具，帮助开发人员更高效地编写、调试和优化代码。这种集成使得 Cursor AI 不仅能够建议代码，还能理解正在进行的项目的上下文，使其成为新手和经验丰富的程序员的宝贵工具。

## Cursor AI 的主要特性

Cursor AI 提供了一系列显著提升编码体验的功能：

* ***AI 代码补全：*** *与传统的自动补全功能不同，Cursor AI 能够预测多行编辑，并根据代码中的最近更改生成整个函数。这一能力使开发者能够更快速、准确地编写复杂代码。*
* ***错误检测与修正：*** *编辑器持续监控代码中的错误，提供即时修复建议。这种主动的调试方法最小化了开发过程中的潜在问题。*
* ***自然语言命令：*** *开发者可以使用简单的英语命令与 Cursor AI 进行交互。此功能简化了编码任务，使不熟悉特定编程语言的用户更容易浏览他们的代码库。*
* ***动态代码优化：*** *Cursor AI 能够建议对现有代码的改进，例如重构或简化复杂结构，从而提升整体代码质量。*
* ***互动聊天功能：*** *集成的聊天功能允许用户直接查询代码库。开发者可以询问有关特定函数或变量的问题，Cursor AI 将根据当前上下文提供相关信息或建议。*

## 与传统编辑器的比较

Cursor AI 通过其先进的功能脱颖而出： 

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*EOHEQ53uLyhU1Sc0SIh_XQ.png)

## 如何安装 Cursor AI

Cursor AI 提供适用于 Linux、Windows 和 MacOS 的安装文件，可以在他们的 [网站](https://www.trycursor.com/) 上免费下载。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*7uC6SQ02cqQ1GBjiue86zw.png)

安装后，我们会看到以下配置界面：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*xORy6uu3wk81fjvF)

* ***键盘:*** *此选项允许我们配置键盘快捷键。默认情况下，它使用 VS Code 快捷键，除非您熟悉列表中的其他代码编辑器，否则我建议使用此选项。*
* ***AI 语言:*** *在这里，我们可以选择使用非英语语言与 AI 进行交互。*
* ***代码库范围:*** *启用此选项可以让 AI 理解整个代码库的上下文。*
* ***添加终端命令:*** *如果安装了这些命令，允许 Cursor AI 编辑器从终端运行。*

## Cursor AI 快捷键

Cursor 提供了一系列快捷键，可以显著加快您的工作流程。让我们来看看您需要了解的所有基本快捷键。

Cursor Composer (***CTRL \+ I***) 允许您同时修改多个文件或生成整个应用程序。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*rGkXkCe0I0HRrYbODUIkJg.png)

AI 面板 (***CTRL \+ L***) 是与 Cursor 互动的另一种方式，您可以在这里询问有关您的代码库的问题并获得建议。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*z732oiPt6Sw6OF3btUeecQ.png)

行内代码编辑 (***CTRL\+K***) 使用 Cursor，您还可以请求 AI 直接编辑您的代码库。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*DCBU2VuH78wDjZDKqM-FMw.png)

## 可用模型

默认情况下，Cursor 提供以下模型供使用：

* [`GPT`\-4o](https://openai.com/index/hello-gpt-4o/)
* [`GP`T\-4](https://openai.com/index/gpt-4/)
* [`Claude 3.5 Son`net](https://www.anthropic.com/news/claude-3-5-sonnet)
* `cursor-small`
* `cursor-small` 是 Cursor 的自定义模型，虽然不如 `GPT-4` 聪明，但速度更快，用户可以无限制访问。

您可以在 `Cursor Settings` \> `Models` \> `Model Names` 下添加其他模型。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Pma6iKl3NBV7uYlAHl_cOQ.png)

## 长上下文模型

在长上下文聊天中，模型选择仅限于支持长上下文的模型：

* [`gpt-4o-1`28k](https://platform.openai.com/docs/models)
* [`gemini-1.5-flash-5`00k](https://deepmind.google/technologies/gemini/flash/)
* [`claude-3-haiku-2`00k](https://www.anthropic.com/news/claude-3-family)
* [`claude-3-sonnet-2`00k](https://www.anthropic.com/news/claude-3-family)
* [`claude-3-5-sonnet-2`00k](https://www.anthropic.com/news/claude-3-5-sonnet)

目前聊天限制为20000个tokens。

所有上述的内联编辑可以通过按下escape键关闭。

注意：上述命令需在Windows中操作。

## 代码实现

前往代码作曲家，在作曲家文本面板中输入要开发的应用程序的详细信息，然后单击提交按钮。

```python
Create a FastapI WebAPP in python which takes in a Youtube videourl and summarizes it using Groq Llama3 Model- use darmode and daisy UI
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*kk2D9FptBfn59sfBdwgNVA.png)

代码是由Cursor AI生成的。一旦代码生成，按“接受所有”。

### 在我的案例中，下面的代码被生成：


```python
from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from youtube_transcript_api import YouTubeTranscriptApi
from groq import Groq
import os
from dotenv import load_dotenv

## Load environment variables
load_dotenv()

app = FastAPI()

class VideoURL(BaseModel):
    url: str

## Initialize Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def get_video_id(url):
    # Extract video ID from YouTube URL
    if "youtu.be" in url:
        return url.split("/")[-1]
    elif "youtube.com" in url:
        return url.split("v=")[1].split("&")[0]
    else:
        raise ValueError("Invalid YouTube URL")

def get_transcript(video_id):
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        return " ".join([entry['text'] for entry in transcript])
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching transcript: {str(e)}")

def summarize_text(text):
    prompt = f"Summarize the following YouTube video transcript:\n\n{text}\n\nSummary:"
    
    try:
        response = client.chat.completions.create(
            model="llama-3.1-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that summarizes YouTube videos."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500
        )
        return response.choices[0].message.content
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error summarizing text: {str(e)}")

@app.post("/summarize")
async def summarize_video(video: VideoURL):
    try:
        video_id = get_video_id(video.url)
        transcript = get_transcript(video_id)
        summary = summarize_text(transcript)
        return {"summary": summary}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/", response_class=HTMLResponse)
async def root():
    return """
    <!DOCTYPE html>
    <html lang="en" data-theme="dark">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>YouTube Video Summarizer</title>
        <link href="https://cdn.jsdelivr.net/npm/daisyui@3.7.3/dist/full.css" rel="stylesheet" type="text/css" />
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-base-100 text-base-content">
        <div class="container mx-auto p-4">
            <h1 class="text-3xl font-bold mb-4">YouTube 视频摘要生成器</h1>
            <div class="form-control">
                <label class="label" for="video-url">
                    <span class="label-text">YouTube 视频 URL</span>
                </label>
                <input type="text" id="video-url" placeholder="输入 YouTube URL" class="input input-bordered w-full max-w-xs" />
                <button onclick="summarizeVideo()" class="btn btn-primary mt-4">生成摘要</button>
            </div>
            <div id="summary" class="mt-8"></div>
        </div>
        <script>
            async function summarizeVideo() {
                const url = document.getElementById('video-url').value;
                const summaryDiv = document.getElementById('summary');
                
                // Show loading spinner
                summaryDiv.innerHTML = `
                    <div class="flex justify-center items-center">
                        <span class="loading loading-spinner loading-lg"></span>
                    </div>`;
                
                try {
                    const response = await fetch('/summarize', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ url: url }),
                    });
                    
                    if (!response.ok) {
                        throw new Error('获取摘要失败');
                    }
                    
                    const data = await response.json();
                    
                    // Display summary in a card
                    summaryDiv.innerHTML = `
                        <div class="card bg-base-200 shadow-xl">
                            <div class="card-body">
                                <h2 class="card-title">摘要</h2>
                                <p>${data.summary}</p>
                            </div>
                        </div>`;
                } catch (error) {
                    // Display error in an alert
                    summaryDiv.innerHTML = `
                        <div class="alert alert-error">
                            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>${error.message}</span>
                        </div>`;
                }
            }
        </script>
    </body>
    </html>
    """

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### 为了增强用户界面，我在代码编写器中提供了以下指令。

```python
Improve the UI by:
Using a loading spinner from DaisyUI while the summary is being generated.
Displaying the summary in a card component for better visual separation.
Using an alert component for error messages.
```

### Cursor AI 的回复


```python
Great! I'm glad you accepted the previous changes. Let's further improve the UI based on your requests. I'll modify the HTML and JavaScript in the root() function to incorporate these enhancements.
Here's the updated code for the root() function in youtube_summarizer.py:
These changes implement the requested improvements:
A loading spinner from DaisyUI is now displayed while the summary is being generated. It's centered on the page for better visibility.
The summary is displayed in a card component, which provides better visual separation from the rest of the content.
Error messages are now shown using DaisyUI's alert component, which includes an error icon for better visibility.
These UI enhancements should provide a more polished and user-friendly experience. The dark theme is still maintained, and the overall structure of the page remains the same.
Remember that the rest of the youtube_summarizer.py file remains unchanged. These modifications only affect the HTML and JavaScript returned by the root() function.
```
上述更改已实施。

*我只需创建 .env 文件以设置 **GROQ\_API\_KEY**，并提供模型名称“**llama\-3\.1–70b\-versatile”** 作为 LLM，并设置 **max\_tokens** 和 **temperature** 参数。*

您还可以询问 Cursor AI 需要安装哪些软件包以执行代码编写器中的代码


```python
What packages do i need to install ionorder to run the youtube_summarizer script
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*xqxr6bbxz9KPZEd01UT2Ew.png)

### 响应


```python
要运行 youtube_summarizer.py 脚本，您需要安装几个 Python 包。根据代码中的导入，以下是所需包的列表：
fastapi
pydantic
youtube_transcript_api
4. groq
python-dotenv
uvicorn
您可以使用 pip，Python 包管理器，来安装这些包。以下是一次性安装所有包的命令：
此外，由于脚本使用了 FastAPI，您可能需要安装一个 ASGI 服务器。脚本已经设置为使用 uvicorn，该服务器包含在上面的安装命令中。
安装这些包后，请确保在与您的脚本相同的目录中有一个 .env 文件，并包含您的 Groq API 密钥：
将 your_groq_api_key_here 替换为您的实际 Groq API 密钥。
一旦您安装了所有必需的包并设置了 .env 文件，您应该能够使用以下命令运行 youtube_summarizer.py 脚本：
这将启动 FastAPI 服务器，您可以通过在网络浏览器中导航到 http://localhost:8000 来访问网页界面。
```

### 我所需要做的就是创建一个虚拟环境并安装所需的包


```python
pip install fastapi pydantic youtube_transcript_api groq python-dotenv uvicorn
```

### 使用以下命令执行代码


```python
python youtube_summarizer.py
```

```python
c:/Users/PLNAYAK/Dots/cursor/cursorai/Scripts/python.exe c:/Users/PLNAYAK/Documents/cursotube_summarizer.py
INFO:     Started server process [14480]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit
INFO:     127.0.0.1:59474 - "GET /openapi.json HTTP/1.1" 200 OK
INFO:     127.0.0.1:59475 - "POST /summarize HTTP/1.1" 500 Internal Se
Error
INFO:     Shutting down
INFO:     Waiting for application shutdown.
INFO:     Application shutdown complete.
INFO:     Finished server process [14480]
(cursorai) PS C:\Users\PLNAYAK\Documents\cursor> & c:/Users/PLNAYAK/Dots/python.exe c:/Users/PLNAYAK/Documents/cursor/youtube_summarizer.py
INFO:     Started server process [30196]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit
INFO:     127.0.0.1:59555 - "GET /docs HTTP/1.1" 200 OK
INFO:     127.0.0.1:59555 - "GET /openapi.json HTTP/1.1" 200 OK
INFO:     127.0.0.1:59556 - "POST /summarize HTTP/1.1" 200 OK
INFO:     127.0.0.1:59703 - "GET / HTTP/1.1" 200 OK
INFO:     127.0.0.1:59703 - "GET /favicon.ico HTTP/1.1" 404 Not Found
INFO:     127.0.0.1:59726 - "GET /favicon.ico HTTP/1.1" 404 Not Found
INFO:     127.0.0.1:59727 - "POST /summarize HTTP/1.1" 500 Internal Se
INFO:     127.0.0.1:59766 - "POST /summarize HTTP/1.1" 500 Internal Se
INFO:     127.0.0.1:59815 - "POST /summarize HTTP/1.1" 200 OK
INFO:     Shutting down
INFO:     Waiting for application shutdown.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     127.0.0.1:60134 - "GET / HTTP/1.1" 200 OK
INFO:     127.0.0.1:60135 - "POST /summarize HTTP/1.1" 200 OK






```
**访问 <http://localhost:8000/> 以执行 YouTube 视频摘要应用程序。**

在这里，我提供了一个 YouTube URL，点击摘要按钮后，模型“llama\-3\.1–70b\-versatile”对 YouTube URL 链接中的细节进行了摘要。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*6hL_dI-LM5AVr3_-6_-Smg.png)

**提供的 YouTube URL** :[**https://www.youtube.com/watch?v\=gqUQbjsYZLQ**](https://www.youtube.com/watch?v=gqUQbjsYZLQ)

### 总结生成：

*该YouTube视频讨论了使用Cursor AI这一代码生成AI工具的最佳实践。嘉宾Mike分享了他作为前端开发者的经验，并提供了如何充分利用Cursor AI的建议。第一个建议是在使用Cursor AI之前进行规划。Mike建议花时间可视化和草拟想法，即使你不是开发者。他建议使用Figma或VZER等工具来创建线框图和模型图。这有助于为Cursor AI提供更多上下文，从而产生更好的输出。第二个建议是使用Cursor Directory，这是一个提供不同技术和框架的预写提示的网站。Mike展示了如何使用Cursor Directory来设置项目，并提供了它如何工作的现场演示。第三个建议是在Cursor AI中标记文档（docs）。Mike解释说，这有助于Cursor AI访问特定技术或框架的最新和最佳信息。他展示了如何将文档添加到项目中，以及如何利用这些文档来解决问题和回答问题。第四个建议是在遇到困难时向其他AI模型寻求帮助。Mike建议复制错误或问题并粘贴到另一个AI模型中，例如Claude或VZER。他还建议提供未解决的方案和预期的输出。这有助于AI模型理解上下文并提供更好的解决方案。第五个建议是使用AI解释代码和教授概念。Mike展示了如何使用Cursor AI来解释一段代码并提供注释的示例。他还建议请求AI为代码添加注释，并解释它所做的事情及其原因。最后一个建议是使用模板和样板代码来加速开发。Mike分享了他自己的入门工具包，并建议在GitHub或其他网站上寻找模板。他建议在这些模板的基础上进行构建，以节省时间和精力。总体而言，该视频提供了如何有效使用Cursor AI以及如何充分利用该工具的全面指南。*

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*9eFkU12H7M8SfIUhVhQ1hw.png)

## 使用 Cursor AI 的好处

将 AI 集成到编码工作流程中提供了几个优势：

* ***提高生产力：*** *通过自动化重复任务并提供智能建议，Cursor AI 帮助开发人员更快地完成项目，并减少错误。*
* ***增强协作：*** *其实时交互功能使团队成员之间的协作更加顺畅，开发人员可以轻松分享对代码库的见解和疑问。*
* ***初学者的学习工具：*** *自然语言处理功能使其成为新程序员的优秀资源，帮助他们以更直观的方式学习编码概念。*

## 结论

Cursor AI 代表了编码技术的重大进步，将 VS Code 的熟悉感与强大的 AI 能力相结合。通过提高生产力、减少错误和简化与代码的交互，它将自己定位为现代软件开发的必备工具。无论您是经验丰富的开发人员还是刚入门，Cursor AI 都提供了一个全面的解决方案，可以提升您的编码体验。在这里，Cursor AI 帮助我们开发了一个用于 YouTube 视频摘要的 WebAPP。

## 参考文献













注意：我参考了上述文章和视频，通过文本进行方案设计并生成本文的内容和代码。

