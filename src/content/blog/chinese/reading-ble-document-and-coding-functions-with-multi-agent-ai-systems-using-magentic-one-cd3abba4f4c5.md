---
title: "使用 Magentic-One 多代理人工智能系统阅读文档和编码功能"
meta_title: "使用 Magentic-One 多代理人工智能系统阅读文档和编码功能"
description: "Magentic-One 是一个多智能体 AI 系统，旨在简化复杂任务。本文介绍了如何利用该系统开发一个移动应用程序，连接 BLE 传感器并解码数据。通过自动导航相关文档并提取蓝牙通信协议信息，系统生成了一个 Python 函数来解码传感器数据。作者强调了提示和系统消息对代理工作流程的影响，指出优化这些方面可以提高工作效率。"
date: 2024-11-26T00:30:12Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*G2cKVwZ0QZBIqg5cXqLsLw.jpeg"
categories: ["Programming", "Technology", "Machine Learning"]
author: "Rifx.Online"
tags: ["Magentic-One", "BLE", "OCR", "Python", "prompt-engineering"]
draft: False

---





Magentic-One 旨在通过利用多个具有专业能力的 AI 代理来简化复杂任务。[我之前的一篇文章](https://readmedium.com/exploring-multi-agent-ai-systems-by-using-magentic-one-576c6f225849) 也介绍了 Magentic-One。最近，我开始开发一个移动应用程序（名为“MotionLab”），能够连接 BLE 传感器，例如运动传感器，或利用设备内置的运动传感器，如加速度计。

然而，在开发过程中，我遇到了一个挑战：解码从订阅特定 UUID 特征的 BLE 传感器接收到的数据，如下图所示。这就是 Magentic-One 这款多智能体 AI 系统帮助我的地方。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*JLf22Dloe4csabYVPjA0Lg.png)

为 Magentic-One 设置环境。模型为 ‘gpt-4o-2024–08–06’。

```python
export CHAT_COMPLETION_PROVIDER='openai'

export OPENAI_API_KEY="your_api_key_here"
```
然后只需使用 example.py 来执行。这次，我增加了保存屏幕截图的功能，使我们能够观察一些幕后过程。 python3 examples/example.py \-\-logs\_dir ./my\_logs \-\-save\_screenshot

```python
python3 examples/example.py --logs_dir ./my_logs --save_screenshot
```
这是我使用的一个提示，也尝试了一些其他提示。

```python
作为一名与 BLE 运动可穿戴传感器连接的移动应用程序的软件开发人员， 
您可以访问 BLE 传感器，订阅具有 
UUID 0x0000FFE4-0000-1000-8000-00805F9A34FB 的特征，并在传感器运动时接收一组 
二十个整数值， 
以下是一个示例 [85, 97, 119, 2, 168, 254, 146, 254, 6, 2, 48, 254, 205, 255, 248, 240, 83, 252, 171, 196]。 
这些值可能表示某些点的加速度 (x, y, z) 
通过解码数据包头、标志。为了正确理解和解释这些值， 
您需要根据可穿戴传感器的蓝牙 5.0 通信协议对其进行解码。 
协议文档可以在 https://wit-motion.gitbook.io/witmotion-sdk/ble-5.0-protocol/bluetooth-5.0-communication-protocol 找到。 
您能否帮助解码这些值并将其转换为应用程序的有意义数据？
```
然后 userProxy 获取用户提示输入。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*NgxiwbABy_vJhtUddj5dDg.png)

Orchestrator 获取信息并制定计划。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*5R6DIM8PEf6-G7pzEdnwaQ.png)

Orchestrator 做出计划决策。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*drZuZczvGStsfZtQy3ZECA.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*JVZoyU11aEWmgPBEV4YUSg.png)

Orchestrator 处理最终计划。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*lij9Vgin-DH4IV7Z5vI4Zw.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Ek4sA2Wuaa_w9dSdzmDWLw.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*hdBf3rGWTeb9G43Exzvu7Q.png)

WebSurfer 代理负责访问提供的网站以获取文档信息。它捕获屏幕截图并利用 OCR 方法，借助大型多模态模型提取必要的细节。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*5a9tWyhLfdzwJPgCz2I4EQ.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*86t71TZiXoQO-pWvAEW8eA.png)

Orchestrator 根据响应进行反思，然后决定下一个计划，专注于是否检索与 BLE 数据相关的特定数据解释部分。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*tkzwk0DQNzVUoyA0E9Hh0w.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*UZEFAUZlH-Rl8RD_kRr8WQ.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*VtKRx4TyST35GsM243-3AQ.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*X5vZlGU3kMGs52KXVRH8PA.png)

Orchestrator 制定计划，要求 Coder 编写 Python 脚本以根据从网站检索的 BLE 通信协议解码 BLE 数据。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*S4mXLN-WrDv4LfGiCUnr2A.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ukkI6sW2LH1V3h2mGscdkA.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*kfdtfTfnz9lsZdDhLcYPRw.png)

Coder 编写了一个 Python 函数。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*gYWuMxsihfAKlI5fu9iy3Q.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*BWO7OS-KW1gVe6cvOptRKQ.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*fFgIgVwogUCfVlGAbQ8wGA.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*wvPUzD5CWFfNLe2fN3B18A.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*9dGFlmnd7l8hhsc9g-EsCg.png)

然后我们检查 my_logs 中保存的屏幕截图。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*PEBHiTmnoDJhRzWftfBIQg.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*HQAKLVX9QG5JTdab7VliMQ.png)

Magentic-One 旨在通过利用多个具有专业能力的 AI 代理来简化复杂任务。通过提供包含 BLE 传感器文档的网站，Magentic-One 自动导航该网站，捕获屏幕截图，并利用 OCR 技术提取蓝牙 5.0 通信协议的详细信息。凭借这些信息，系统的编码代理草拟了一个 Python 函数，旨在解码传感器数据，利用我在提示中包含的示例数据。这次经历突显了 AI 技术在现代应用开发中的变革性影响，为更加创新和智能的应用程序铺平了道路。

**提示，提示，提示**

在我尝试各种提示以复制这些任务的过程中，我**观察到提示和系统消息是影响代理工作流程和最终结果的最关键因素。**虽然我尚未深入比较不同的大型多模态模型 (LMM)，但我主要集中在优化工作流程和完善提示工程。通过磨练这些方面，我们可以显著提高基于代理的工作流程的效率和有效性。

祝编码愉快，阅读愉快。感恩节快乐。

