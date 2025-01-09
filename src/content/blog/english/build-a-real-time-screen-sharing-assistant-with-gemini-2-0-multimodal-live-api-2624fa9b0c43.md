---
title: "Build a Real-time Screen Sharing Assistant with Gemini 2.0 Multimodal Live API"
meta_title: "Build a Real-time Screen Sharing Assistant with Gemini 2.0 Multimodal Live API"
description: "This tutorial outlines the development of a real-time screen sharing assistant using the Gemini 2.0 Multimodal Live API. It details the architecture, server-side implementation in Python, and client-side development using HTML and JavaScript. The server manages WebSocket connections and integrates with the Gemini API for processing audio and visual data. The client captures screen content and audio, sending it to the server for analysis and response. The tutorial emphasizes practical applications in various work scenarios and provides code examples for both server and client functionalities."
date: 2025-01-09T02:14:35Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*4mWWmDwJVlnsf2xzikgdPw.png"
categories: ["Programming", "Technology/Web", "Chatbots"]
author: "Rifx.Online"
tags: ["Gemini", "WebSocket", "Python", "JavaScript", "HTML"]
draft: False

---





### Gemini Development Tutorial V3



In the last tutorials of the Gemini 2\.0 series, we established the core functionality of a self\-hosted real\-time voice and video chatbot and then added the function calling feature to it to allow it to call external tools and APIs. These are all practical applications with fast response, human\-like interaction and enhanced reasoning enabled by the Gemini 2\.0 Multimodal Live API.

In this tutorial, we’ll be focusing on another practical application of the model you may have already tried in the Google AI Studio and surprised by its performance and user experience. That’s right, we’ll be building a real\-time screen sharing assistant that can work with you via voice interaction, and delve deeper into both frontend and backend architecture design and code implementation.

The Google AI Studio offers a great starting point for experimenting with Gemini 2\.0’s multimodal capabilities. In the ‘Stream Realtime’ feature, a “Share your screen” block allows for simultaneous text, audio, and screen interaction. However, for true customizability, we must build our own application using the underlying API.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*hqwdHpX74rx2P0tnXC3ZLA.png)

Let’s now get started!


## Architecture

First, let’s see the overall architecture of the application.

Our architecture, as before, involves a two\-way WebSocket connection: one between the client and the server and another between the server and the Gemini API. The server acts as an intermediary, forwarding messages and managing the real\-time streaming. More specifically, the server's code is almost the same as the previous video of the basic multimodal chatbot we developed. So, if you have already read it, you can skip this quick recap and jump to the client development section.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*zF2BWv2LoF6iShU-.png)


## Code Walkthrough — Server

The server, implemented in Python, is responsible for two main tasks: handling the client WebSocket connections and managing the Gemini API connection.

You need to install and import the `WebSockets` and `google-genai` libraries. Set the API key for the model `gemini-2.0-flash_exp`, and create a Gemini client using the API version `v1alpha`.


```python
### pip install --upgrade google-genai==0.3.0##
import asyncio
import json
import os
import websockets
from google import genai
import base64

## Load API key from environment
os.environ['GOOGLE_API_KEY'] = ''
MODEL = "gemini-2.0-flash-exp"  # use your model ID

client = genai.Client(
  http_options={
    'api_version': 'v1alpha',
  }
)
```
At the bottom of the code, we define a `websockets.serve` function to establish a server on a specified port. Each WebSocket connection from the client triggers the handler `gemini_session_handler`.


```python
async def main() -> None:
    async with websockets.serve(gemini_session_handler, "localhost", 9083):
        print("Running websocket server localhost:9083...")
        await asyncio.Future()  # Keep the server running indefinitely


if __name__ == "__main__":
    asyncio.run(main())
```
Inside the `gemini_session_handler`, we make use of the `client.aio.live.connect()` function to establish a connection with the Gemini API with the config data, including the `response_modalities` coming from the client’s first message and the `system_instruction` that we set to instruct the model to act as a screen sharing assistant.

After that, the handler will focus on the message forwarding actions:

1. The `send_to_gemini` function captures messages from the client, extracts audio and image data, and sends it to the Gemini API.
2. The `receive_from_gemini` function listens to responses from the Gemini API and unpacks text or audio data to be sent to the client.

For true real\-time interaction and interruption enabling, All these tasks are handled asynchronously in the two parallel threads. Here is the code:


```python
async def gemini_session_handler(client_websocket: websockets.WebSocketServerProtocol):
    """Handles the interaction with Gemini API within a websocket session.

    Args:
        client_websocket: The websocket connection to the client.
    """
    try:
        config_message = await client_websocket.recv()
        config_data = json.loads(config_message)
        config = config_data.get("setup", {})
        config["system_instruction"] = """You are a helpful assistant for screen sharing sessions. Your role is to: 
                                        1) Analyze and describe the content being shared on screen 
                                        2) Answer questions about the shared content 
                                        3) Provide relevant information and context about what's being shown 
                                        4) Assist with technical issues related to screen sharing 
                                        5) Maintain a professional and helpful tone. Focus on being concise and clear in your responses."""     

        async with client.aio.live.connect(model=MODEL, config=config) as session:
            print("Connected to Gemini API")

            async def send_to_gemini():
                """Sends messages from the client websocket to the Gemini API."""
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
                          print(f"Error sending to Gemini: {e}")
                  print("Client connection closed (send)")
                except Exception as e:
                     print(f"Error sending to Gemini: {e}")
                finally:
                   print("send_to_gemini closed")



            async def receive_from_gemini():
                """Receives responses from the Gemini API and forwards them to the client, looping until turn is complete."""
                try:
                    while True:
                        try:
                            print("receiving from gemini")
                            async for response in session.receive():
                                if response.server_content is None:
                                    print(f'Unhandled server message! - {response}')
                                    continue

                                model_turn = response.server_content.model_turn
                                if model_turn:
                                    for part in model_turn.parts:
                                        if hasattr(part, 'text') and part.text is not None:
                                            await client_websocket.send(json.dumps({"text": part.text}))
                                        elif hasattr(part, 'inline_data') and part.inline_data is not None:
                                            print("audio mime_type:", part.inline_data.mime_type)
                                            base64_audio = base64.b64encode(part.inline_data.data).decode('utf-8')
                                            await client_websocket.send(json.dumps({
                                                "audio": base64_audio,
                                            }))
                                            print("audio received")

                                if response.server_content.turn_complete:
                                    print('\n<Turn complete>')
                        except websockets.exceptions.ConnectionClosedOK:
                            print("Client connection closed normally (receive)")
                            break  # Exit the loop if the connection is closed
                        except Exception as e:
                            print(f"Error receiving from Gemini: {e}")
                            break 

                except Exception as e:
                      print(f"Error receiving from Gemini: {e}")
                finally:
                      print("Gemini connection closed (receive)")


            # Start send loop
            send_task = asyncio.create_task(send_to_gemini())
            # Launch receive loop as a background task
            receive_task = asyncio.create_task(receive_from_gemini())
            await asyncio.gather(send_task, receive_task)


    except Exception as e:
        print(f"Error in Gemini session: {e}")
    finally:
        print("Gemini session closed.")
```

## Code Walkthrough — Client

For the client development in HTML and Javascript, our focus will be on the main changes to the original frontend code in the last tutorials, and you can find both the original code and the modified code in my [GitHub repository](https://github.com/yeyu2/Youtube_demos/tree/main/gemini20-screen).


### Image Processing

We will start by exploring the main new function in this version, which replaces the previous implementation using the webcam with the screen sharing functionality, specifically by implementing the `startScreenShare` function.

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
This asynchronous function leverages the `navigator.mediaDevices.getDisplayMedia()` method to obtain a screen capture stream. It then sets the HTML video element’s source to this stream and awaits the video’s metadata load, ensuring that subsequent operations can safely access the video dimensions.

Next, let’s examine the `captureImage()` function, responsible for periodically capturing video frames and converting them to base64\-encoded data for transmission to the server.

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
This function has been modified to include a stream check and also verify that the video metadata has been loaded before calling the `drawImage()` method. The width and height have now been fixed to 640x480\. We then convert the video to the jpeg base64 representation for sending to the server.

With those two functions defined, here is how we initialize our screen\-sharing functionality and connection to the WebSocket server.


```python
window.addEventListener("load", async () => {
  await startScreenShare();
  setInterval(captureImage, 3000);
  connect();
});
```
This event listener calls `startScreenShare` to set up the initial video stream from the user’s display, set an interval that will call `captureImage` every three seconds, and, of course, you can change to a smaller value to get a more frequent update based on your screen operating frequency, and calls the WebSocket connection functionality, which remains mostly unchanged.


### Audio Processing

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
For the audio part, we also present the audio worklet initialization function, which remains unchanged from the previous version with the same `sampleRate` and PCM processing function in the `pcm-processor.js` file.

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
The `sendVoiceMessage()` function packs both audio and image `base64` data before sending it to the server.

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
The client receives a JSON format message from the server, parses it and displays the text or plays the audio accordingly.

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
Don’t forget to choose your preferred response modality in the client’s first configuration message. Here, I choose the `AUDIO`, and you can, of course, choose the `TEXT` to see the text output on the webpage. But please especially note that even if it allows for a list parameter. Currently, only individual modalities are supported, if you put both text and audio, the model will only return an error.

Now, we have managed to move from a webcam implementation to a screen share implementation, which allows us to capture a screen stream that can be sent to Gemini to get a proper response.


## Run the App

The best usage of such a screen sharing assistant is to help you with your daily work, such as taking notes, browsing the web, or even playing games. For me, the most interesting application is to help me with my daily paper research work.

Let’s start it up!

Start the server by running the Python file. The WebSocket server will be running on port 8093, as we defined in the code.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*q-WhD99P23OqHH__Z8RvfA.png)

Start the client by running the command:


```python
python -m http.server
```
Now we can access the local server on port 8000\.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ln9pwDLqQHEt1fmw-yuD2g.png)

Here is the video that I captured for the experience.







Thanks for reading. If you think it’s helpful, please Clap 👏 for this article. Your encouragement and comments mean a lot to me, mentally and financially. 🍔

**Before you go:**

✍️ If you have any questions, please leave me responses or find me on [**X**](https://twitter.com/Yeyu2HUANG/)and [**Discord**](https://discord.gg/KPTCE4CEmp), where you can have my active support on development and deployment.

☕️ If you want exclusive resources and technical services, subscribing to the services on my **[Ko\-fi](https://ko-fi.com/yeyuh)** will be a good choice.

💯 **I am also open to being hired for any innovative and full\-stack development jobs.**


