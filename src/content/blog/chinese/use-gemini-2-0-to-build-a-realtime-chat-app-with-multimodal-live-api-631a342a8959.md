---
title: "使用 Gemini 2.0 通过多模态实时 API 构建实时聊天应用程序"
meta_title: "使用 Gemini 2.0 通过多模态实时 API 构建实时聊天应用程序"
description: "谷歌推出的Gemini 2.0模型在多模态处理能力上表现突出，可以实时处理文本、图像、音频和视频输入，极大提升了AI代理的交互性。本文介绍了如何利用Gemini 2.0的多模态实时API构建聊天应用，包括后端Python代码实现和前端JavaScript逻辑，展示了音频和视频交互的具体步骤。开发者可以通过Google AI Studio体验这些功能，并在本地自托管应用中实现更复杂的交互。"
date: 2024-12-27T10:54:25Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*NPi_bfYxg7MChSJNnCWb8w.png"
categories: ["Programming", "Chatbots", "Natural Language Processing"]
author: "Rifx.Online"
tags: ["Gemini", "multimodal", "WebSocket", "Python", "JavaScript"]
draft: False

---



### Gemini 开发教程



谷歌推出了 Gemini 2\.0 及其预览模型 Gemini 2\.0 Flash Experimental，您一定通过视频和文章了解过它。该模型在所有基准测试中大幅超越了其前身 Gemini 1\.5 Pro，并且对所有人免费使用，但在 Google AI Studio 中有一些限制。如果您对 Gemini 2\.0 有经验或看过关于 Google AI Studio 新版本功能的视频，您一定会对其在处理复杂推理任务、生成可靠代码和函数调用方面的能力和效率印象深刻，拥有高达 1M 的令牌上下文窗口、更快的速度和更低的延迟。尽管这些功能确实令人印象深刻，但它们在新模型发布时已成为普遍期望。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*qwITwI62khecLid7.gif)

然而，真正使 Gemini 2\.0 与众不同并有潜力彻底改变 LLM 领域的是其先进的多模态能力。该模型现在可以无缝处理和理解多种输入模态，包括文本、图像、音频和视频，并在实时流场景中以文本或音频进行响应。这一突破使得 AI 代理更具人性化，更能为普通用户提供帮助。

在本教程中，我将重点介绍 Gemini 2\.0 的多模态功能，并带您了解谷歌的官方演示应用，以及本地自托管应用的代码实现，展示如何使用 Gemini 2\.0 多模态实时 API 构建自己的实时聊天机器人，实现语音和视频互动。如果您是一位开发者，想要超越初步探索，寻找实际应用，这个演示项目将是您很好的起点。

## 在 Google AI Studio 中实时流媒体

体验 Gemini 2.0 令人印象深刻的多模态能力的最快方法是使用 Google AI Studio 上的演示应用程序。让我带你了解它的使用。如果你之前使用过 Google AI Studio，你会发现随着新模型的发布，用户界面已更新，以展示新功能，包括用于 Gemini 2.0 的多模态实时流媒体部分，以及包含三个预构建应用程序及其源代码的入门应用程序部分，以进一步展示新模型内部的详细功能，包括图像推理、视频分析和调用 Google 服务的本地工具。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*53wASihSZ6INSbP8c_xQQQ.png)

点击实时流媒体按钮查看提供的内容，你可以通过 Google 账号在 Google AI Studio 链接中自己尝试，因为此时是免费的。

现在，我将尝试使用相同的 Gemini 多模态实时 API 在本地和自托管的应用程序中复制相同的体验。

## 多模态实时 API

让我们来看看什么是多模态实时 API。在其文档中，它指出此产品功能处于实验阶段，可能支持有限。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*jD85LoqE6pjxzc0baiFAfw.png)

该 API 与常见的生成 API 不在同一页面上。您还需要注意，该 API 设计用于服务器到服务器的通信，主要是因为协议不是 HTTP，而是 WebSocket。因此，像浏览器这样的 HTTP 客户端无法直接连接。根据推荐的架构，您需要实现一个中间服务器来处理与 API 的 WebSocket 连接，然后将消息转发到前端。

当您在 Gemini 文档中搜索时，您会发现 Google 在 GitHub 仓库中提供了一些多模态实时 API 的源代码。不幸的是，代码过于简单，仅包含基本的生成过程，或者[与 Google Cloud 项目基础设施紧密耦合](https://github.com/GoogleCloudPlatform/generative-ai/tree/main/gemini/multimodal-live-api/websocket-demo-app)。这就是为什么我决定一开始就实现我自己版本的 web 应用程序，它将是一个简单的聊天机器人，但可以轻松扩展为更复杂的语音和视频交互应用程序，以便进一步/现有的 web 应用程序。

让我们开始我们应用程序的实现。

## 代码实现

这个应用的基本设计基于 Google Generative-AI Repo 中的多模态实时 API 演示项目。关于它的使用，你可以从 README 文件中看到，它要求用户连接访问令牌和项目 ID，这些来自于 Google Cloud 项目，应该托管后端服务，然后你可以通过文本、语音和视频开始实时交互。设计简单但直观，因此我将遵循这一点，以及架构，排除身份验证。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*cGp9GemjkWsA4laf4uZfUw.png)

因此，总结来说，我们的应用也将是这样的技术栈；将会有两个 WebSocket 连接，一个是客户端到服务器，另一个是服务器到 Gemini API。这并不复杂，所以让我们看看代码。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*anL3lP4MkKlQD-XQ0a2tzw.png)

我们在这段代码演示中的重点将放在 Python 的服务器端，因为这是与官方 Google 演示的主要区别，它是激活多模态实时 API 的关键。

### 服务器端使用 Python

首先，让我们安装所需的包。请注意，您需要安装新的 Google 生成 AI SDK `google-genai`，而不是旧版的。

```python
 pip install -U -q google-genai
```
在代码中，导入必要的包并从环境中加载 API 密钥，定义模型。

```python
### pip install --upgrade google-genai==0.2.2 ##
import asyncio
import json
import os
import websockets
from google import genai
import base64

## 从环境加载 API 密钥
os.environ['GOOGLE_API_KEY'] = ''
MODEL = "gemini-2.0-flash-exp"  # 使用您的模型 ID

client = genai.Client(
  http_options={
    'api_version': 'v1alpha',
  }
)
```
`genai.Client` 使用配置进行实例化。在这里，我们使用 `v1alpha` 版本，这个客户端是与 Gemini API 交互的主要接口，以便于后续使用。

下一个方法是核心逻辑 `gemini_session_handler`。在这个函数中，我们将处理与客户端的 WebSocket 连接，将消息转发到 Gemini API，然后接收响应并将其转发回客户端。所有这些通信都是基于 WebSocket 协议的，因此它们都是异步的，可以被中断、重新连接和恢复；这些是实时行为的关键驱动因素。

```python
async def gemini_session_handler(client_websocket: websockets.WebSocketServerProtocol):
    """处理与 Gemini API 在 websocket 会话中的交互。

    参数：
        client_websocket: 与客户端的 websocket 连接。
    """
    try:
        config_message = await client_websocket.recv()
        config_data = json.loads(config_message)
        config = config_data.get("setup", {})

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
                  print("客户端连接已关闭（发送）")
                except Exception as e:
                     print(f"发送到 Gemini 时出错: {e}")
                finally:
                   print("send_to_gemini 关闭")

            async def receive_from_gemini():
                """接收来自 Gemini API 的响应并将其转发给客户端，循环直到回合完成。"""
                try:
                    while True:
                        try:
                            print("接收来自 gemini 的数据")
                            async for response in session.receive():
                                #first_response = True
                                print(f"响应: {response}")
                                if response.server_content is None:
                                    print(f'未处理的服务器消息! - {response}')
                                    continue

                                model_turn = response.server_content.model_turn
                                if model_turn:
                                    for part in model_turn.parts:
                                        print(f"部分: {part}")
                                        if hasattr(part, 'text') and part.text is not None:
                                            #print(f"text: {part.text}")
                                            await client_websocket.send(json.dumps({"text": part.text}))
                                        elif hasattr(part, 'inline_data') and part.inline_data is not None:
                                            # if first_response:
                                            print("音频 mime_type:", part.inline_data.mime_type)
                                                #first_response = False
                                            base64_audio = base64.b64encode(part.inline_data.data).decode('utf-8')
                                            await client_websocket.send(json.dumps({
                                                "audio": base64_audio,
                                            }))
                                            print("音频已接收")

                                if response.server_content.turn_complete:
                                    print('\n<回合完成>')
                        except websockets.exceptions.ConnectionClosedOK:
                            print("客户端连接正常关闭（接收）")
                            break  # 连接关闭时退出循环
                        except Exception as e:
                            print(f"接收来自 Gemini 的数据时出错: {e}")
                            break # 退出循环

                except Exception as e:
                      print(f"接收来自 Gemini 的数据时出错: {e}")
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
        print("Gemini 会话已关闭。")
```
我们在下面的代码中跳过了服务器设置的细节。

```python
async def main() -> None:
    async with websockets.serve(gemini_session_handler, "localhost", 9080):
        print("正在运行 websocket 服务器 localhost:9080...")
        await asyncio.Future()  # 使服务器无限期运行

if __name__ == "__main__":
    asyncio.run(main())
```
这是服务器的主函数；它将在本地主机的 9080 端口上运行 WebSocket 服务器，然后，对于每个连接，它将调用 `gemini_session_handler` 来处理与客户端的 WebSocket。使用 `asyncio.Future()` 使服务器无限期运行。

让我们回过头来看看会话处理程序过程 `gemini_session_handler()` 的细节。

第一个 WebSocket 消息是配置消息，这是 Gemini API 的设置消息。它可以包含许多模型参数，但在我们的案例中，我们只需要使用它来设置模型生成模式，即它是否以文本或音频形式响应。这将由客户端完成。配置消息将触发使用 `client.aio.live.connect` 连接到 Gemini API。

在 API 连接建立后，与 Gemini Live API 的 WebSocket 将继续，服务器将等待实际的客户端数据。会话处理程序中有两个主要部分需要处理：`send_to_gemini()` 和 `receive_from_gemini()`。

来自客户端的消息是自定义消息格式，它是一个包含“`realtime_input`”字段的 JSON 对象。该字段包含来自客户端网页的媒体数据，包括音频和图像数据（从相机捕获）。服务器将简单地将数据打包成 Gemini API 消息格式并发送到 Gemini API。

在 `receive_from_gemini()` 中，服务器将监听并接收来自 Gemini API 的响应，然后将数据解包成自定义消息格式并发送回客户端。请注意，有两种类型的响应数据需要以不同的方式处理：一种是文本响应，另一种是音频/图像响应。文本响应是一个简单的字符串，而音频响应是一个 base64 编码的音频数据，数据的路径将由我们的配置消息决定。由于实时特性，数据都是以块或称为部分的形式流式传输，因此您必须确保接收和转发持续运行，直到 `turn_complete` 标志被设置为 true。

在定义之后，这两个方法作为后台任务启动，然后使用 `asyncio.gather` 同时运行它们。

这就是后端的全部内容。您可以直接运行代码，查看结果，确认 WebSocket 服务器正在本地主机的 9080 端口上运行。

```python
python main.py
```
![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*7qW33Hm5bpZGZfAFt1r9tQ.png)

### 客户端 - HTML/JS

现在，让我们来看一下客户端，它是用Javascript编写的。我在这里不会逐行讲解300行代码，特别是布局和样式，您可以在我的[GitHub 仓库](https://github.com/yeyu2/Youtube_demos/tree/main/gemini20-realtime)中查看完整代码。但我将专注于客户端的核心逻辑，即 WebSocket 连接和消息处理。

当您打开这个网络应用程序时，它将自动连接到本地主机的9080端口的WebSocket服务器，然后向服务器发送设置消息。

```python
function sendInitialSetupMessage() {

            console.log("sending setup message");
            setup_client_message = {
                setup: {
                   generation_config: { response_modalities: ["TEXT"] },
               },
            };

            webSocket.send(JSON.stringify(setup_client_message));
        }
```
设置消息是一个包含“setup”字段的JSON对象。该字段包含`generation_config`，这是Gemini API的配置。在我们的例子中，我们只需要将response_modalities设置为`[“AUDIO”]`或`[“TEXT”]`。我在列表中尝试了这两种，但都因为初始错误而无法工作。现在我们可以将其设置为AUDIO，以便模型以语音形式响应。

```python
async function startAudioInput() {
            audioContext = new AudioContext({
                sampleRate: 16000,
            });

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    sampleRate: 16000,
                },
            });

            const source = audioContext.createMediaStreamSource(stream);
            processor = audioContext.createScriptProcessor(4096, 1, 1);

            processor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                 const pcm16 = new Int16Array(inputData.length);
                for (let i = 0; i < inputData.length; i++) {
                    pcm16[i] = inputData[i] * 0x7fff;
                }
                pcmData.push(...pcm16);
            };

            source.connect(processor);
            processor.connect(audioContext.destination);

            interval = setInterval(recordChunk, 3000);
        }
```
`startAudioInput()`函数管理麦克风访问、捕获音频并通过WebSocket将其发送到后端。

```python
function captureImage() {
            if (stream) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = canvas.toDataURL("image/jpeg").split(",")[1].trim();
                currentFrameB64 = imageData;
            }
        }
```
`captureImage()`函数定期从网络摄像头捕获图像，并通过WebSocket将其发送到后端。这些是用户输入部分。

```python
function receiveMessage(event) {
            const messageData = JSON.parse(event.data);
            const response = new Response(messageData);

            if(response.text){
                displayMessage("GEMINI: " + response.text);
            }
            if(response.audioData){
              injestAudioChuckToPlay(response.audioData);
            }
        }
```
在`receiveMessage()`函数中，`injestAudioChuckToPlay`函数将处理从Gemini发送回来的音频数据，并将音频流发送到pcm-processor工作单元进行播放。文本输出的相同处理过程在`displayMessage`函数中进行。这些是输出部分的逻辑。

这些是客户端的关键部分，因为模型的音频响应格式是PCM格式，我们需要将其转换为浏览器可以播放的音频格式。因此，我们在`pcm-processor.js`文件中使用pcm-processor函数进行转换。

## 运行应用程序

现在，我们可以通过执行以下命令来运行客户端：

```python
python -m http.server
```
![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*o7NDcLqmPmhEpdGWEOew6A.png)

然后打开浏览器并访问 `localhost:8000`，您将看到应用程序正在运行。

这是我为这次体验录制的视频。







总之，我们现在可以在本地和自托管的应用程序中复制多模态实时 API 的实时体验。这是您构建自己的实时语音和视频聊天机器人的良好起点，使用 Gemini 2.0 多模态实时 API。例如，您可以向应用程序添加屏幕共享或功能调用，使其在生活和工作中更加实用。

感谢您的阅读。如果您觉得这篇文章有帮助，请为它鼓掌 👏。您的鼓励和评论对我来说非常重要，无论是精神上还是经济上。🍔

**在您离开之前：**

✍️ 如果您有任何问题，请给我留言或在 [**X**](https://twitter.com/Yeyu2HUANG/) 和 [**Discord**](https://discord.gg/KPTCE4CEmp) 上找到我，在那里您可以获得我在开发和部署方面的积极支持。

☕️ 如果您想要独家资源和技术服务，订阅我在 **[Ko\-fi](https://ko-fi.com/yeyuh)** 上的服务将是一个不错的选择。

💯 **我也欢迎任何创新和全栈开发工作的聘用。**

