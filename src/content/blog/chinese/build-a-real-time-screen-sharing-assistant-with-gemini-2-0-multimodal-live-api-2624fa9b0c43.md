---
title: "利用 Gemini 2.0 多模态实时 API 构建实时屏幕共享助手"
meta_title: "利用 Gemini 2.0 多模态实时 API 构建实时屏幕共享助手"
description: "本文介绍了如何使用 Gemini 2.0 多模态实时 API 构建一个实时屏幕共享助手。教程涵盖了应用架构、服务器和客户端的代码实现，重点在于如何通过双向 WebSocket 连接实现实时语音和视频交互。服务器使用 Python 处理客户端连接并与 Gemini API 交互，而客户端则通过 HTML 和 JavaScript 实现屏幕捕获和音频处理。最终，用户可以通过该助手完成日常工作，如记笔记和网页浏览。"
date: 2025-01-09T02:14:35Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*4mWWmDwJVlnsf2xzikgdPw.png"
categories: ["Programming", "Technology/Web", "Chatbots"]
author: "Rifx.Online"
tags: ["Gemini", "WebSocket", "Python", "JavaScript", "HTML"]
draft: False

---



### Gemini 开发教程 V3



在 Gemini 2.0 系列的最后几期教程中，我们建立了一个自托管的实时语音和视频聊天机器人的核心功能，并为其添加了功能调用特性，以便它能够调用外部工具和 API。这些都是具有快速响应、人性化互动和增强推理能力的实用应用，得益于 Gemini 2.0 多模态实时 API。

在本教程中，我们将重点关注模型的另一个实用应用，您可能已经在 Google AI Studio 中尝试过，并对其性能和用户体验感到惊讶。没错，我们将构建一个实时屏幕共享助手，它可以通过语音互动与您合作，并深入探讨前端和后端架构设计及代码实现。

Google AI Studio 为实验 Gemini 2.0 的多模态能力提供了一个很好的起点。在“实时流”功能中，“共享您的屏幕”块允许同时进行文本、音频和屏幕互动。然而，为了实现真正的可定制性，我们必须使用底层 API 构建自己的应用程序。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*hqwdHpX74rx2P0tnXC3ZLA.png)

让我们现在开始吧！

## 架构

首先，让我们看看应用程序的整体架构。

我们的架构与之前一样，涉及双向 WebSocket 连接：一个在客户端和服务器之间，另一个在服务器和 Gemini API 之间。服务器充当中介，转发消息并管理实时流。更具体地说，服务器的代码与我们开发的基本多模态聊天机器人的前一个视频几乎相同。因此，如果您已经阅读过它，可以跳过这个快速回顾，直接进入客户端开发部分。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*zF2BWv2LoF6iShU-.png)

## 代码讲解 — 服务器

服务器使用 Python 实现，负责两个主要任务：处理客户端的 WebSocket 连接和管理 Gemini API 连接。

您需要安装并导入 `WebSockets` 和 `google-genai` 库。为模型 `gemini-2.0-flash_exp` 设置 API 密钥，并使用 API 版本 `v1alpha` 创建一个 Gemini 客户端。

```python
### pip install --upgrade google-genai==0.3.0##
import asyncio
import json
import os
import websockets
from google import genai
import base64

## 从环境中加载 API 密钥
os.environ['GOOGLE_API_KEY'] = ''
MODEL = "gemini-2.0-flash-exp"  # 使用您的模型 ID

client = genai.Client(
  http_options={
    'api_version': 'v1alpha',
  }
)
```
在代码底部，我们定义了一个 `websockets.serve` 函数，以在指定端口上建立服务器。每个来自客户端的 WebSocket 连接都会触发处理程序 `gemini_session_handler`。

```python
async def main() -> None:
    async with websockets.serve(gemini_session_handler, "localhost", 9083):
        print("正在运行 websocket 服务器 localhost:9083...")
        await asyncio.Future()  # 保持服务器无限运行


if __name__ == "__main__":
    asyncio.run(main())
```
在 `gemini_session_handler` 中，我们使用 `client.aio.live.connect()` 函数与 Gemini API 建立连接，配置数据包括来自客户端第一条消息的 `response_modalities` 和我们设置的 `system_instruction`，以指示模型充当屏幕共享助手。

之后，处理程序将专注于消息转发操作：

1. `send_to_gemini` 函数捕获来自客户端的消息，提取音频和图像数据，并将其发送到 Gemini API。
2. `receive_from_gemini` 函数监听来自 Gemini API 的响应，并解包文本或音频数据以发送给客户端。

为了实现真正的实时交互和中断启用，所有这些任务都在两个并行线程中异步处理。以下是代码：

```python
async def gemini_session_handler(client_websocket: websockets.WebSocketServerProtocol):
    """在 websocket 会话中处理与 Gemini API 的交互。

    参数：
        client_websocket: 与客户端的 websocket 连接。
    """
    try:
        config_message = await client_websocket.recv()
        config_data = json.loads(config_message)
        config = config_data.get("setup", {})
        config["system_instruction"] = """您是屏幕共享会话的有用助手。您的角色是：
                                        1) 分析并描述共享屏幕上的内容
                                        2) 回答有关共享内容的问题
                                        3) 提供与所显示内容相关的信息和背景
                                        4) 协助处理与屏幕共享相关的技术问题
                                        5) 保持专业和乐于助人的语气。专注于简洁明了地回答。"""     

        async with client.aio.live.connect(model=MODEL, config=config) as session:
            print("已连接到 Gemini API")

            async def send_to_gemini():
                """将来自客户端 websocket 的消息发送到 Gemini API。"""
                try:
                  async for message in client_websocket:
                      try:
                          data = json.loads(message)
                          if "realtime_input" in data:
                              for chunk in data["realtime_input"]["media_chunks"]:
                                  if chunk["mime_type"] == "audio/pcm":
                                      await session.send({"mime_type": "audio/pcm", "data": chunk["data"]})
                                      
                                  elif chunk["mime_type"] == "image/jpeg":
                                      await session.send({"mime_type": "image/jpeg", "data": chunk["data"]})
                                      
                      except Exception as e:
                          print(f"发送到 Gemini 时出错: {e}")
                  print("客户端连接关闭（发送）")
                except Exception as e:
                     print(f"发送到 Gemini 时出错: {e}")
                finally:
                   print("send_to_gemini 关闭")

            async def receive_from_gemini():
                """接收来自 Gemini API 的响应并将其转发给客户端，循环直到回合完成。"""
                try:
                    while True:
                        try:
                            print("从 Gemini 接收")
                            async for response in session.receive():
                                if response.server_content is None:
                                    print(f'未处理的服务器消息！ - {response}')
                                    continue

                                model_turn = response.server_content.model_turn
                                if model_turn:
                                    for part in model_turn.parts:
                                        if hasattr(part, 'text') and part.text is not None:
                                            await client_websocket.send(json.dumps({"text": part.text}))
                                        elif hasattr(part, 'inline_data') and part.inline_data is not None:
                                            print("音频 mime_type:", part.inline_data.mime_type)
                                            base64_audio = base64.b64encode(part.inline_data.data).decode('utf-8')
                                            await client_websocket.send(json.dumps({
                                                "audio": base64_audio,
                                            }))
                                            print("音频已接收")

                                if response.server_content.turn_complete:
                                    print('\n<回合完成>')
                        except websockets.exceptions.ConnectionClosedOK:
                            print("客户端连接正常关闭（接收）")
                            break  # 如果连接关闭，则退出循环
                        except Exception as e:
                            print(f"接收来自 Gemini 时出错: {e}")
                            break 

                except Exception as e:
                      print(f"接收来自 Gemini 时出错: {e}")
                finally:
                      print("Gemini 连接关闭（接收）")

            # 启动发送循环
            send_task = asyncio.create_task(send_to_gemini())
            # 将接收循环作为后台任务启动
            receive_task = asyncio.create_task(receive_from_gemini())
            await asyncio.gather(send_task, receive_task)

    except Exception as e:
        print(f"Gemini 会话中出错: {e}")
    finally:
        print("Gemini 会话关闭。")
```

## 代码讲解 — 客户端

对于HTML和Javascript中的客户端开发，我们将重点关注上一个教程中原始前端代码的主要更改，您可以在我的 [GitHub 仓库](https://github.com/yeyu2/Youtube_demos/tree/main/gemini20-screen) 中找到原始代码和修改后的代码。

### 图像处理

我们将首先探索此版本中的主要新功能，该功能通过实现 `startScreenShare` 函数，替代了之前使用网络摄像头的实现，改为屏幕共享功能。

***startScreenShare***

```python
async function startScreenShare() {
            try {
                stream = await navigator.mediaDevices.getDisplayMedia({
                    video: {
                        width: { max: 640 },
                        height: { max: 480 },
                    },
                });

                video.srcObject = stream;
                await new Promise(resolve => {
                    video.onloadedmetadata = () => {
                        console.log("video loaded metadata");
                        resolve();
                    }
                });

            } catch (err) {
                console.error("Error accessing the screen: ", err);
            }
        }
```
这个异步函数利用 `navigator.mediaDevices.getDisplayMedia()` 方法获取屏幕捕获流。然后，将 HTML 视频元素的源设置为此流，并等待视频的元数据加载，确保后续操作可以安全地访问视频尺寸。

接下来，让我们检查 `captureImage()` 函数，该函数负责定期捕获视频帧并将其转换为 base64 编码的数据，以便传输到服务器。

***captureImage***

```python
function captureImage() {
            if (stream && video.videoWidth > 0 && video.videoHeight > 0 && context) {
                canvas.width = 640;
                canvas.height = 480;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = canvas.toDataURL("image/jpeg").split(",")[1].trim();
                currentFrameB64 = imageData;
            }
            else {
                console.log("no stream or video metadata not loaded");
            }
        }
```
此函数已修改为包含流检查，并在调用 `drawImage()` 方法之前验证视频元数据是否已加载。宽度和高度现在固定为 640x480。然后，我们将视频转换为 jpeg 的 base64 表示形式，以便发送到服务器。

定义了这两个函数后，以下是我们如何初始化屏幕共享功能和与 WebSocket 服务器的连接。

```python
window.addEventListener("load", async () => {
  await startScreenShare();
  setInterval(captureImage, 3000);
  connect();
});
```
此事件监听器调用 `startScreenShare` 来设置用户显示器的初始视频流，设置一个每三秒调用一次 `captureImage` 的间隔，当然，您可以更改为更小的值，以根据屏幕操作频率获得更频繁的更新，并调用 WebSocket 连接功能，该功能基本保持不变。

### 音频处理

***initializeAudioContext***


```python
async function initializeAudioContext() {
            if (initialized) return;

            audioInputContext = new (window.AudioContext ||
                window.webkitAudioContext)({
                sampleRate: 24000
            });
            await audioInputContext.audioWorklet.addModule("pcm-processor.js");
            workletNode = new AudioWorkletNode(audioInputContext, "pcm-processor");
            workletNode.connect(audioInputContext.destination);
            initialized = true;
        }
```
对于音频部分，我们还展示了音频工作单元初始化函数，该函数与之前版本保持不变，使用相同的 `sampleRate` 和 `pcm-processor.js` 文件中的 PCM 处理函数。

***sendVoiceMessage***


```python
 function sendVoiceMessage(b64PCM) {
            if (webSocket == null) {
                console.log("websocket not initialized");
                return;
            }

            payload = {
                realtime_input: {
                    media_chunks: [{
                        mime_type: "audio/pcm",
                        data: b64PCM,
                    },
                    {
                        mime_type: "image/jpeg",
                        data: currentFrameB64,
                    },
                    ],
                },
            };

            webSocket.send(JSON.stringify(payload));
            console.log("sent: ", payload);
        }
```
`sendVoiceMessage()` 函数在将音频和图像 `base64` 数据发送到服务器之前进行打包。

***receiveMessage***


```python
function receiveMessage(event) {
            const messageData = JSON.parse(event.data);
            const response = new Response(messageData);

            if (response.text) {
                displayMessage("GEMINI: " + response.text);
            }
            if (response.audioData) {
                injestAudioChuckToPlay(response.audioData);
            }
        }
```
客户端从服务器接收 JSON 格式的消息，解析后根据内容显示文本或播放音频。

***sendInitialSetupMessage***


```python
function sendInitialSetupMessage() {

            console.log("sending setup message");
            setup_client_message = {
                setup: {
                    generation_config: { response_modalities: ["AUDIO"] },
                },
            };

            webSocket.send(JSON.stringify(setup_client_message));
        }
```
请不要忘记在客户端的第一次配置消息中选择您首选的响应方式。在这里，我选择了 `AUDIO`，当然您也可以选择 `TEXT`，以便在网页上查看文本输出。但请特别注意，即使它允许列表参数。目前，仅支持单个方式，如果您同时放入文本和音频，模型将只会返回错误。

现在，我们已经成功从网络摄像头实现转向屏幕共享实现，这使我们能够捕获可以发送给 Gemini 的屏幕流，以获得适当的响应。

## 运行应用程序

这种屏幕共享助手的最佳使用方式是帮助您完成日常工作，例如记笔记、浏览网页，甚至玩游戏。对我来说，最有趣的应用是帮助我进行日常论文研究工作。

让我们开始吧！

通过运行 Python 文件启动服务器。WebSocket 服务器将在我们在代码中定义的 8093 端口上运行。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*q-WhD99P23OqHH__Z8RvfA.png)

通过运行以下命令启动客户端：

```python
python -m http.server
```
现在我们可以在 8000 端口访问本地服务器。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ln9pwDLqQHEt1fmw-yuD2g.png)

这是我为这次体验捕捉到的视频。

谢谢您的阅读。如果您觉得这篇文章有帮助，请为这篇文章鼓掌 👏。您的鼓励和评论对我来说意义重大，无论是在精神上还是经济上。🍔

**在您离开之前：**

✍️ 如果您有任何问题，请给我留言或在 [**X**](https://twitter.com/Yeyu2HUANG/) 和 [**Discord**](https://discord.gg/KPTCE4CEmp) 上找到我，在那里您可以获得我在开发和部署方面的积极支持。

☕️ 如果您想要独家资源和技术服务，订阅我的 **[Ko\-fi](https://ko-fi.com/yeyuh)** 服务将是一个不错的选择。

💯 **我也欢迎任何创新和全栈开发工作的聘用。**

