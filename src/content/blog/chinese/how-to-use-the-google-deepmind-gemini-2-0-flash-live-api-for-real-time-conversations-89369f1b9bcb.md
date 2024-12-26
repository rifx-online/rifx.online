---
title: "如何使用 Google DeepMind Gemini 2.0 Flash Live API 进行实时对话"
meta_title: "如何使用 Google DeepMind Gemini 2.0 Flash Live API 进行实时对话"
description: "Google DeepMind的Gemini 2.0 Flash API为实时对话应用程序提供了强大的支持，允许开发者构建能够处理实时音频交互的应用。本文介绍了如何使用Python实现该API，包括两个脚本`live_test.py`和`no_queue_version.py`，前者利用音频队列管理音频数据，后者则简化了音频处理。设置API密钥、Python环境和必要库后，用户可以通过麦克风与AI进行实时交互，适用于客户服务、教育等多种场景。"
date: 2024-12-26T02:21:41Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*CID6kJNnEC5rRDPIpVK4ng.png"
categories: ["Programming", "Chatbots", "Voice Assistants"]
author: "Rifx.Online"
tags: ["DeepMind", "Gemini", "WebSocket", "audio", "streaming"]
draft: False

---





Google DeepMind 的 Gemini 2\.0 Flash API 代表了实时 AI 驱动对话领域的重大突破。它使开发者能够构建能够无缝处理实时音频交互的应用程序，提供了语音输入和输出的无与伦比的集成。无论您是在创建客户服务聊天机器人、增强无障碍工具，还是开发互动 AI 导师，这个 API 都是一个强大的基础。在本博客中，我们将探讨 Gemini 2\.0 Flash API 的功能，并演示如何有效地使用 Python。我们将通过两个不同的脚本 `live_test.py` 和 `no_queue_version.py` 逐步指导您实施，帮助您开始构建动态对话 AI 解决方案。

在我们继续之前，让我们保持联系！请考虑在 **Medium** 上关注我，并不要忘记在 [LinkedIn](https://www.linkedin.com/in/mohamed-azharudeen/) 上与我连接，以定期获取数据科学和深度学习的见解。” 🚀📊🤖

## 前提条件

1. **API 密钥：** 通过在 Google AI Platform 上注册以获取访问权限来获取您的 Google Gemini API 密钥。
2. **Python 环境：** 确保安装了 Python 3\.8\+。
3. **依赖项：** 安装所需的库：

```python
pip install websockets pyaudio asyncio
```
4\. **环境变量：** 将 API 密钥设置为环境变量：

```python
export GEMINI_API_KEY="your_api_key_here"
```

## 脚本的主要特征

两个脚本都实现了实时语音交互，但在方法上略有不同：

* `live_test.py`**:** 使用音频队列来管理和播放接收到的音频数据。
* `no_queue_version.py`**:** 直接播放接收到的音频，没有队列，简化了过程。

### 共享组件

* **WebSocket 连接:** 促进与 Gemini API 的通信。
* **音频捕获:** 使用 PyAudio 记录用户输入。
* **音频播放:** 将 AI 生成的响应流回用户。

## live\_test.py 的逐步解释

### 初始化


```python
class GeminiVoice:
    def __init__(self):
        self.audio_queue = asyncio.Queue()
        self.api_key = os.environ.get("GEMINI_API_KEY")
        self.model = "gemini-2.0-flash-exp"
        self.uri = f"wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key={self.api_key}"
        self.FORMAT = pyaudio.paInt16
        self.CHANNELS = 1
        self.CHUNK = 512
        self.RATE = 16000
```
* **音频队列：** 存储接收到的音频块以供播放。
* **API 密钥和模型：** 配置对 Gemini API 的访问。
* **音频设置：** 设置输入和输出参数。

### 开始连接


```python
async def start(self):
    self.ws = await connect(
        self.uri, additional_headers={"Content-Type": "application/json"}
    )
    await self.ws.send(json.dumps({"setup": {"model": f"models/{self.model}"}}))
    await self.ws.recv(decode=False)
    print("Connected to Gemini, You can start talking now")
    async with asyncio.TaskGroup() as tg:
        tg.create_task(self.capture_audio())
        tg.create_task(self.stream_audio())
        tg.create_task(self.play_response())
```
* **WebSocket 连接:** 建立与 Gemini 服务的链接。
* **任务组:** 并发管理音频捕获、流式传输和播放。

### 捕获音频


```python
async def capture_audio(self):
    audio = pyaudio.PyAudio()
    stream = audio.open(
        format=self.FORMAT,
        channels=self.CHANNELS,
        rate=self.RATE,
        input=True,
        frames_per_buffer=self.CHUNK,
    )

    while True:
        data = await asyncio.to_thread(stream.read, self.CHUNK)
        await self.ws.send(
            json.dumps(
                {
                    "realtime_input": {
                        "media_chunks": [
                            {
                                "data": base64.b64encode(data).decode(),
                                "mime_type": "audio/pcm",
                            }
                        ]
                    }
                }
            )
        )
```
* **音频录制：** 捕获来自麦克风的输入并将其发送到API。

### 流音频


```python
async def stream_audio(self):
    async for msg in self.ws:
        response = json.loads(msg)
        try:
            audio_data = response["serverContent"]["modelTurn"]["parts"][0]["inlineData"]["data"]
            self.audio_queue.put_nowait(base64.b64decode(audio_data))
        except KeyError:
            pass
```
* **响应处理：** 解码来自API的音频响应并将其存储在队列中。

### 播放响应


```python
async def play_response(self):
    audio = pyaudio.PyAudio()
    stream = audio.open(
        format=self.FORMAT, channels=self.CHANNELS, rate=24000, output=True
    )
    while True:
        data = await self.audio_queue.get()
        await asyncio.to_thread(stream.write, data)
```
* **音频播放：** 播放AI生成的音频。

## no_queue_version.py 的逐步解释

`no_queue_version.py` 脚本通过直接流式传输和播放接收到的音频，简化了这一过程，而无需中间队列。

### 主要区别

* **简化的响应处理：**


```python
async def recv_model_audio(self):
    audio = pyaudio.PyAudio()
    stream = audio.open(
        format=self.FORMAT, channels=self.CHANNELS, rate=24000, output=True
    )
    async for msg in self.ws:
        response = json.loads(msg)
        try:
            audio_data = response["serverContent"]["modelTurn"]["parts"][0]["inlineData"]["data"]
            await asyncio.to_thread(stream.write, base64.b64decode(audio_data))
        except KeyError:
            pass
```

## 运行脚本

1. **设置环境变量：**


```python
export GEMINI_API_KEY="your_api_key_here"
```
2\. **运行脚本：**


```python
python live_test.py
```
3\. **对着麦克风说话：** 脚本捕获您的输入，将其发送到Gemini服务，并播放AI的响应。

## 结论

使用 Google DeepMind Gemini 2.0 Flash API，您可以构建支持动态和实时对话的创新应用程序。这项尖端技术实现了无缝的音频交互，非常适合客户支持、互动教程和语言学习等多种用例。

通过选择 `live_test.py` 以获得高级排队功能或 `no_queue_version.py` 以实现简单性，开发人员可以根据具体需求定制 API 集成。

API 的强大功能结合 Python 的灵活性，使得创建高度互动和响应迅速的应用程序成为可能。花时间探索脚本，尝试自定义选项，释放 AI 驱动通信的全部潜力。可能性是巨大的，借助 Gemini 2.0 Flash，您可以将最雄心勃勃的对话 AI 创意变为现实！

