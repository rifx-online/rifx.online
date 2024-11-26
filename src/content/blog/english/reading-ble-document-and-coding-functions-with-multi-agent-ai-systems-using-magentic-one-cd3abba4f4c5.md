---
title: "Reading Document and Coding Functions with Multi-Agent AI Systems using Magentic-One"
meta_title: "Reading Document and Coding Functions with Multi-Agent AI Systems using Magentic-One"
description: "Magentic-One is a multi-agent AI system designed to enhance task efficiency by utilizing specialized agents. During the development of a mobile app, the author faced challenges in decoding data from a BLE motion sensor. Magentic-One successfully navigated the sensors documentation, extracted relevant protocol details through OCR, and generated a Python function to decode the data. This process highlights the significant role of AI in modern app development and emphasizes the importance of effective prompt engineering in optimizing workflows."
date: 2024-11-26T00:30:12Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*G2cKVwZ0QZBIqg5cXqLsLw.jpeg"
categories: ["Programming", "Technology", "Machine Learning"]
author: "Rifx.Online"
tags: ["Magentic-One", "BLE", "OCR", "Python", "prompt-engineering"]
draft: False

---






Magentic\-One is designed to streamline complex tasks by leveraging multiple AI agents, each with specialized capabilities. [One of my previous post](https://readmedium.com/exploring-multi-agent-ai-systems-by-using-magentic-one-576c6f225849) also introduce Magentic\-One. Recently, I embarked on a journey to develop a mobile app (named “MotionLab”) capable of connecting with BLE sensors, such as motion sensors, or utilizing the device’s built\-in motion sensors like accelerometers.

However, during the development process, I encountered a challenge: decoding data received from a BLE sensor subscribed to a characteristic with a specific UUID as shown in following screenshot. This is where Magentic\-One, a multi\-agent AI system, came to my rescue.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*JLf22Dloe4csabYVPjA0Lg.png)

Setup env for Magentic\-One. Model is ‘gpt\-4o\-2024–08–06’.


```python
export CHAT_COMPLETION_PROVIDER='openai'

export OPENAI_API_KEY="your_api_key_here"
```
Then just use exampe.py to execute. This time, I’ve included a feature to save screenshots, allowing us to observe some of the behind\-the\-scenes processes. python3 examples/example.py \-\-logs\_dir ./my\_logs \-\-save\_screenshot


```python
python3 examples/example.py --logs_dir ./my_logs --save_screenshot
```
Here is one prompt that used, also tried with some othe prompts.


```python
As a software developer for a mobile app connected to a BLE motion wearable sensor, 
you can access the BLE sensor, subscribe to a characteristic with 
UUID 0x0000FFE4-0000-1000-8000-00805F9A34FB, and receive a list of 
twenty integer values when the sensor is in motion, 
here is one exmaple [85, 97, 119, 2, 168, 254, 146, 254, 6, 2, 48, 254, 205, 255, 248, 240, 83, 252, 171, 196]. 
These values may represent acceleration (x, y, z) at some points 
by decoding packet header, flag. To understand and interpret these values 
correctly, you need to decode them based on the Bluetooth 5.0 communication 
protocol of the wearable sensor. 
The protocol documentation can be found at https://wit-motion.gitbook.io/witmotion-sdk/ble-5.0-protocol/bluetooth-5.0-communication-protocol . 
Can you assist in decoding these values and translating them into meaningful data for the app?
```
Then userProxy get user prompt input.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*NgxiwbABy_vJhtUddj5dDg.png)

Orchestrator get info and will do a plan.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*5R6DIM8PEf6-G7pzEdnwaQ.png)

Orchestrator makes a plan decision.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*drZuZczvGStsfZtQy3ZECA.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*JVZoyU11aEWmgPBEV4YUSg.png)

Orchestrator process final plan.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*lij9Vgin-DH4IV7Z5vI4Zw.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Ek4sA2Wuaa_w9dSdzmDWLw.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*hdBf3rGWTeb9G43Exzvu7Q.png)

The WebSurfer agent is tasked with accessing the provided website to retrieve document information. It captures screenshots and utilizes OCR methods, leveraging large multimodal models, to extract the necessary details.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*5a9tWyhLfdzwJPgCz2I4EQ.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*86t71TZiXoQO-pWvAEW8eA.png)

Orchestrator does reflection based on response, then decide next plan to focus on whether retrieve specific data interpretation section relevant with BLE data.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*tkzwk0DQNzVUoyA0E9Hh0w.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*UZEFAUZlH-Rl8RD_kRr8WQ.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*VtKRx4TyST35GsM243-3AQ.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*X5vZlGU3kMGs52KXVRH8PA.png)

Orchestrator makes plan that asks Coder to write python script to decode BLE data based on BLE communication protocal that retrieved from website.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*S4mXLN-WrDv4LfGiCUnr2A.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ukkI6sW2LH1V3h2mGscdkA.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*kfdtfTfnz9lsZdDhLcYPRw.png)

Coder writes one python function.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*gYWuMxsihfAKlI5fu9iy3Q.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*BWO7OS-KW1gVe6cvOptRKQ.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*fFgIgVwogUCfVlGAbQ8wGA.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*wvPUzD5CWFfNLe2fN3B18A.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*9dGFlmnd7l8hhsc9g-EsCg.png)

Then we check my\_logs for saved screenshots during this process.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*PEBHiTmnoDJhRzWftfBIQg.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*HQAKLVX9QG5JTdab7VliMQ.png)

Magentic\-One is designed to streamline complex tasks by leveraging multiple AI agents, each with specialized capabilities. By providing it with a website containing BLE sensor documentation, Magentic\-One autonomously navigated the site, captured screenshots, and employed OCR technology to extract the Bluetooth 5\.0 communication protocol details. With this information, the system’s coder agent drafted a Python function tailored to decode the sensor data, utilizing sample data I included in the prompt. This experience underscores the transformative impact of AI technologies in modern app development, paving the way for more innovative and intelligent applications.

**Prompt, Prompt, Prompt**

Throughout my experimentation with various prompts to replicate these tasks, I**’ve observed that the prompt and system message are the most crucial factors influencing the agents’ workflow and the final outcome.** While I haven’t delved into comparing different Large Multimodal Models (LMMs), my primary focus has been on optimizing workflows and refining prompt engineering. By honing these aspects, we can significantly enhance the efficiency and effectiveness of agent\-based workflows.

Happy Coding, Happy Reading. Happy Thanksgiving.


