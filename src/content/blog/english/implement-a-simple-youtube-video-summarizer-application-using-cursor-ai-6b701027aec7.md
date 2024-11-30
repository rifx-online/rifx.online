---
title: "Implement A Simple YouTube Video Summarizer Application using Cursor AI"
meta_title: "Implement A Simple YouTube Video Summarizer Application using Cursor AI"
description: "Cursor AI is a code editor that enhances programming efficiency by integrating advanced AI tools within a familiar interface like Visual Studio Code. Key features include AI code completion, error detection, natural language commands, and dynamic code optimization. A practical application demonstrated is a YouTube video summarizer built with FastAPI, which utilizes AI for summarizing transcripts. The application showcases Cursor AIs capabilities to streamline development, improve collaboration, and serve as a learning tool for beginners, ultimately enhancing productivity in software development."
date: 2024-11-30T13:55:30Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*hzqdCDHFxZymdFbUzcG6_Q.jpeg"
categories: ["Programming", "Natural Language Processing", "Machine Learning"]
author: "Rifx.Online"
tags: ["Cursor", "FastAPI", "summarizer", "code", "optimization"]
draft: False

---







## Introduction

[Cursor AI](https://www.trycursor.com/) is revolutionizing software development by integrating advanced artificial intelligence into a familiar coding environment. As a fork of Visual Studio Code (VS Code), Cursor AI retains the user\-friendly interface and extensive ecosystem that developers appreciate, while enhancing functionality with AI capabilities powered by models like OpenAI’s ChatGPT and Claude.


## What Is Cursor AI?

Cursor AI is an innovative code editor designed to streamline the coding process. It combines the robust features of VS Code with sophisticated AI tools to assist developers in writing, debugging, and optimizing their code more efficiently. This integration allows Cursor AI to not only suggest code but also understand the context of ongoing projects, making it a valuable tool for both novice and experienced programmers.


## Key Features of Cursor AI

Cursor AI offers a range of features that significantly enhance the coding experience:

* ***AI Code Completion:*** *Unlike traditional autocomplete functions, Cursor AI can predict multi\-line edits and generate entire functions based on recent changes in the code. This capability allows developers to write complex code more quickly and accurately .*
* ***Error Detection and Correction:*** *The editor continuously monitors code for errors, providing instant suggestions for fixes. This proactive approach to debugging minimizes potential issues during development .*
* ***Natural Language Commands:*** *Developers can interact with Cursor AI using plain English commands. This feature simplifies coding tasks, making it easier for users unfamiliar with specific programming languages to navigate their codebases .*
* ***Dynamic Code Optimization:*** *Cursor AI can suggest improvements to existing code, such as refactoring or simplifying complex structures, thereby enhancing overall code quality .*
* ***Interactive Chat Features:*** *The integrated chat functionality allows users to query the codebase directly. Developers can ask questions about specific functions or variables, and Cursor AI will provide relevant information or suggestions based on the current context*


## Comparison with Traditional Editors

Cursor AI stands out from standard code editors through its advanced capabilities:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*EOHEQ53uLyhU1Sc0SIh_XQ.png)


## How to Install Cursor AI

Cursor AI provides an installation file for Linux, Windows, and MacOS that can be downloaded for free on their [website.](https://www.trycursor.com/)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*7uC6SQ02cqQ1GBjiue86zw.png)

After installing, we’re prompted with the following configuration screen:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*xORy6uu3wk81fjvF)

* ***Keyboard:*** *This option lets us configure the keyboard shortcuts. By default, it uses the VS Code shortcuts, which I recommend unless you are familiar with another code editor on the list.*
* ***Language for AI:*** *Here, we have the option of using a non\-English language to interact with the AI.*
* ***Codebase\-wide:*** *Enabling this option allows the AI to understand the context of the entire codebase.*
* ***Add terminal command:*** *If installed, these allow the Cursor AI editor to run from the terminal.*


## Cursor AI Shortcut

Cursor offers a range of shortcuts that can significantly speed up your workflow. Let’s go through all the essential shortcuts you need to know.

Cursor Composer (***CTRL \+ I***) allows you to modify multiple files at once or generate entire applications.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*rGkXkCe0I0HRrYbODUIkJg.png)

The AI Pane (***CTRL \+ L***) is another way to interact with Cursor, where you can ask questions about your codebase and get suggestions.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*z732oiPt6Sw6OF3btUeecQ.png)

Inline Code Editing(***CTRL\+K***) With Cursor, you can also ask AI to edit your codebase directly.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*DCBU2VuH78wDjZDKqM-FMw.png)


## Available models

By default, Cursor has these models ready to use:

* [`GPT`\-4o](https://openai.com/index/hello-gpt-4o/)
* [`GP`T\-4](https://openai.com/index/gpt-4/)
* [`Claude 3.5 Son`net](https://www.anthropic.com/news/claude-3-5-sonnet)
* `cursor-small`
* `cursor-small` is Cursor’s custom model that isn’t as smart as `GPT-4`, but is faster and users have unlimited access to it.

You can add additional models under `Cursor Settings` \> `Models` \> `Model Names`.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Pma6iKl3NBV7uYlAHl_cOQ.png)


## Long Context Only Models

In long context chat, the model selection is limited to the models that support long context:

* [`gpt-4o-1`28k](https://platform.openai.com/docs/models)
* [`gemini-1.5-flash-5`00k](https://deepmind.google/technologies/gemini/flash/)
* [`claude-3-haiku-2`00k](https://www.anthropic.com/news/claude-3-family)
* [`claude-3-sonnet-2`00k](https://www.anthropic.com/news/claude-3-family)
* [`claude-3-5-sonnet-2`00k](https://www.anthropic.com/news/claude-3-5-sonnet)

At present the chat is limited to 20000 tokens.

All the above inline editing can be closed by pressing the escape button.

Note: The above commands are to be operated in windows.


## Code Implementation

Go to code Composer and type in the details of the application to be developed in the composer text panel and click on submit button.


```python
Create a FastapI WebAPP in python which takes in a Youtube videourl and summarizes it using Groq Llama3 Model- use darmode and daisy UI
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*kk2D9FptBfn59sfBdwgNVA.png)

The code is being produced by Cursor AI . Once the Code is produced press “Accept All”


### In my case the below code was generated:


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
            <h1 class="text-3xl font-bold mb-4">YouTube Video Summarizer</h1>
            <div class="form-control">
                <label class="label" for="video-url">
                    <span class="label-text">YouTube Video URL</span>
                </label>
                <input type="text" id="video-url" placeholder="Enter YouTube URL" class="input input-bordered w-full max-w-xs" />
                <button onclick="summarizeVideo()" class="btn btn-primary mt-4">Summarize</button>
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
                        throw new Error('Failed to fetch summary');
                    }
                    
                    const data = await response.json();
                    
                    // Display summary in a card
                    summaryDiv.innerHTML = `
                        <div class="card bg-base-200 shadow-xl">
                            <div class="card-body">
                                <h2 class="card-title">Summary</h2>
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

### In order to enhance the UI, I provided the following instruction in the code composer.


```python
Improve the UI by:
Using a loading spinner from DaisyUI while the summary is being generated.
Displaying the summary in a card component for better visual separation.
Using an alert component for error messages.
```

### Response from Cursor AI


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
The above chages were implemented.

*All I had to do is to create .env file to setup the **GROQ\_API\_KEY** and provide the model name “**llama\-3\.1–70b\-versatile”** to be used as LLM and set the **max\_tokens** and **temperature** parameter.*

You can also ask Cursor AI regarding the package to be installed to execute the code in the code composer


```python
What packages do i need to install ionorder to run the youtube_summarizer script
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*xqxr6bbxz9KPZEd01UT2Ew.png)


### Response


```python
To run the youtube_summarizer.py script, you'll need to install several Python packages. Based on the imports in the code, here's a list of the required packages:
fastapi
pydantic
youtube_transcript_api
4. groq
python-dotenv
uvicorn
You can install these packages using pip, the Python package installer. Here's the command to install all of them at once:
Additionally, since the script is using FastAPI, you might want to install an ASGI server. The script is already set up to use uvicorn, which is included in the installation command above.
After installing these packages, make sure you have a .env file in the same directory as your script with your Groq API key:
Replace your_groq_api_key_here with your actual Groq API key.
Once you have installed all the required packages and set up your .env file, you should be able to run the youtube_summarizer.py script using:
This will start the FastAPI server, and you can access the web interface by navigating to http://localhost:8000 in your web browser.
```

### All I had to do is create a virtual environment and install the required packages


```python
pip install fastapi pydantic youtube_transcript_api groq python-dotenv uvicorn
```

### Execue the code using the following command


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
**Go to <http://localhost:8000/> to execute the YouTube Video Summarization Application.**

Here I have provide a YouTube URL and after clicking the Summarize button the model “llama\-3\.1–70b\-versatile” summarized the details in the YouTube url link.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*6hL_dI-LM5AVr3_-6_-Smg.png)

**You tube Url provided** :[**https://www.youtube.com/watch?v\=gqUQbjsYZLQ**](https://www.youtube.com/watch?v=gqUQbjsYZLQ)


### Summary Generated:

*The YouTube video discusses best practices for using Cursor AI, a code\-generating AI tool. The guest, Mike, shares his experience as a front\-end developer and provides tips on how to get the most out of Cursor AI. The first tip is to plan before using Cursor AI. Mike recommends spending time visualizing and sketching out ideas, even if you’re not a developer. He suggests using tools like Figma or VZER to create wireframes and mockups. This helps to give Cursor AI more context and results in better output. The second tip is to use Cursor Directory, a website that provides pre\-written prompts for different technologies and frameworks. Mike shows an example of how to use Cursor Directory to set up a project and provides a live demonstration of how it works. The third tip is to tag documentation (docs) in Cursor AI. Mike explains that this helps Cursor AI to access the latest and greatest information on a particular technology or framework. He shows how to add documentation to a project and how it can be used to solve issues and answer questions. The fourth tip is to ask other AI models for help when stuck. Mike suggests copying the bug or issue and pasting it into another AI model, such as Claude or VZER. He also recommends providing the solutions that didn’t work and the output that was expected. This helps the AI model to understand the context and provide a better solution. The fifth tip is to use AI to explain code and teach concepts. Mike shows an example of how to use Cursor AI to explain a piece of code and provide comments. He also suggests asking AI to add comments to code and to explain what it did and why. The final tip is to use templates and boilerplate code to speed up development. Mike shares his own starter kit and suggests finding templates on GitHub or other websites. He recommends building on top of these templates to save time and effort. Overall, the video provides a comprehensive guide on how to use Cursor AI effectively and how to get the most out of the tool.*

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*9eFkU12H7M8SfIUhVhQ1hw.png)


## Benefits of Using Cursor AI

The integration of AI into coding workflows offers several advantages:

* ***Increased Productivity:*** *By automating repetitive tasks and providing intelligent suggestions, Cursor AI helps developers complete projects faster and with fewer errors .*
* ***Enhanced Collaboration:*** *Its real\-time interaction capabilities allow for smoother collaboration among team members, as developers can easily share insights and queries about the codebase .*
* ***Learning Tool for Beginners:*** *The natural language processing feature makes it an excellent resource for new programmers, helping them learn coding concepts in a more intuitive manner*


## Conclusion

Cursor AI represents a significant advancement in coding technology, merging the familiarity of VS Code with powerful AI capabilities. By enhancing productivity, reducing errors, and simplifying interactions with code, it positions itself as an essential tool for modern software development. Whether you are a seasoned developer or just starting out, Cursor AI offers a comprehensive solution that can elevate your coding experience. Here Cursor AI has facilitated us to develop a WebAPP for YouTube video Summarizer


## References













Note : I have referred the above articles and videos to scheme through text and generate the content and code for this article.


