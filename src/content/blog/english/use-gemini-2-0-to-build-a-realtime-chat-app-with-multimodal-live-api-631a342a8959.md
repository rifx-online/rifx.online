---
title: "Use Gemini 2.0 to Build a Realtime Chat App with Multimodal Live API"
meta_title: "Use Gemini 2.0 to Build a Realtime Chat App with Multimodal Live API"
description: "The article discusses the capabilities of Googles Gemini 2.0, particularly its multimodal features that allow real-time processing of text, images, audio, and video. It provides a tutorial on building a real-time chat application using the Gemini 2.0 multimodal live API, highlighting the differences from previous models and the necessary server-client architecture. The tutorial includes code implementation details for both server-side (Python) and client-side (JavaScript), guiding developers through the setup and execution of a chatbot that supports voice and video interactions. The article emphasizes Gemini 2.0s potential to enhance user experience through its advanced functionalities."
date: 2024-12-27T10:54:25Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*NPi_bfYxg7MChSJNnCWb8w.png"
categories: ["Programming", "Chatbots", "Natural Language Processing"]
author: "Rifx.Online"
tags: ["Gemini", "multimodal", "WebSocket", "Python", "JavaScript"]
draft: False

---





### Gemini Development Tutorial



Google launched Gemini 2\.0 with the preview model Gemini 2\.0 Flash Experimental, and you must have learned about it from videos and articles. This model has greatly exceeded the performance of its predecessor, Gemini 1\.5 Pro, in all the benchmarks, and it’s free for everybody to use, with some limitations in Google AI Studio. If you have experience with Gemini 2\.0 or have seen videos about the features in the new version of Google AI Studio, you must be impressed by its capabilities and efficiency in handling complex reasoning tasks, generating reliable code and function calls, with a massive 1M token context window, faster speed and lower latency. While these features are certainly impressive, they are becoming common expectations whenever a new model is released.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*qwITwI62khecLid7.gif)

However, what truly sets Gemini 2\.0 apart and has the potential to revolutionize the LLM landscape is its advanced multi\-modal capabilities. The model can now seamlessly process and understand multiple input modalities simultaneously — including text, images, audio, and video — and respond with text or audio in real\-time streaming scenarios. This breakthrough makes the AI agents more human\-like and helpful for common users.

In this tutorial, I will be focusing on the multi\-modal features of Gemini 2\.0 and walk you through the official demo app on Google, as well as the code implementation of a native and self\-hosted app to showcase how to build your own real\-time chatbot with voice \& video interaction by using Gemini 2\.0 multimodal live API. If you are a developer looking to move beyond initial exploration for a real\-world application, this demo project will be a great starting point for you.


## Stream Realtime in Google AI Studio

The quickest way to experience the impressive multi\-modal capabilities of Gemini 2\.0 is to use the demo app on Google AI Studio. Let me walk you through its usage. If you have used the Google AI Studio before, you will find that along with the new model release, the UI has been updated to demonstrate the new features, including the Stream Realtime section for multimodal live with Gemini 2\.0 and Starter Apps section that includes three prebuild apps with source code for further demonstrate the details functions inside of the new model including image reasoning, video analysis and native tool calling to Google services.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*53wASihSZ6INSbP8c_xQQQ.png)

Click the Stream Realtime button to see what is provided, and you can try it out by yourself through the Google AI Studio link with your Google account because it is free at this moment.

Now, I will be trying to use the same Gemini multimodal live API to duplicate the same experience in a native and self\-hosted app.


## Multimodal Live API

Let’s look at what Multimodal Live API is. So, in its document, it states that this product feature is at the experimental stage and might have limited support.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*jD85LoqE6pjxzc0baiFAfw.png)

The API is not on the same page as the common Generative API. You also need to note that the API is designed for server\-to\-server communication, mostly because the protocol is not HTTP but a web socket. so the HTTP client, like your browser, cannot connect directly. As a result of the recommended architecture, you need to implement an intermediate server to handle the WebSocket connection with the API and then forward the messages to a frontend.

When you search on the Gemini documentation, you will find that Google has provided some source code for the multimodal live API in the GitHub repo. Unfortunately, the code is too simple, with only a basic generation process, or [too tightly coupled with the Google Cloud project infrastructure](https://github.com/GoogleCloudPlatform/generative-ai/tree/main/gemini/multimodal-live-api/websocket-demo-app). That’s why I decided to implement my own version of the web app at the beginning, which will be a simple chatbot but can be extended to a more complex voice \& video interaction app easily for further/existing web apps.

Let’s start with our app implementation.


## Code Implementation

The fundamental design of this app is based on the demo project of the Multimodal Live API demo from the Google Generative\-AI Repo. For its usage, you can see from the README file that it asks users to connect with the access token and project ID, which comes from the Google Cloud project, which is supposed to host the backend service, and then you can start real\-time interaction by text, voice and video. The design is simple but intuitive, so I will follow that, as well as the architecture, excluding authentication.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*cGp9GemjkWsA4laf4uZfUw.png)

So, in conclusion, our app will also be such a stack; there will be two web socket connections, one for the client to the server and one for the server to the Gemini API. It is not that complex, so let’s look at the code.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*anL3lP4MkKlQD-XQ0a2tzw.png)

Our focus on this code walkthrough will be on the server side in Python because it’s the main difference from the official Google demos, and it’s key to activating the multimodal live API.


### Server\-side in Python

First, let’s install the packages. Note that you need to install the new Google generative AI SDK `google-genai` instead of the legacy one.


```python
 pip install -U -q google-genai
```
In code, import the necessary packages and load the API key from the environment, defining the model.


```python
### pip install --upgrade google-genai==0.2.2 ##
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
The `genai.Client` is instantiated with the configurations. Here, we use the `v1alpha` version, and this client is the main interface that interacts with the Gemini API for later use.

The next method is the core logic `gemini_session_handler`. In this function, we will handle the WebSocket connection with the client, forward the messages to the Gemini API, and then receive the response and forward it back to the client. All these communications are based on the WebSocket protocol, so they are all asynchronous, which can be interrupted, reconnected, and restored; these are the key enablers of the real\-time behaviour.


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
                                #first_response = True
                                print(f"response: {response}")
                                if response.server_content is None:
                                    print(f'Unhandled server message! - {response}')
                                    continue

                                model_turn = response.server_content.model_turn
                                if model_turn:
                                    for part in model_turn.parts:
                                        print(f"part: {part}")
                                        if hasattr(part, 'text') and part.text is not None:
                                            #print(f"text: {part.text}")
                                            await client_websocket.send(json.dumps({"text": part.text}))
                                        elif hasattr(part, 'inline_data') and part.inline_data is not None:
                                            # if first_response:
                                            print("audio mime_type:", part.inline_data.mime_type)
                                                #first_response = False
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
                            break # exit the lo

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
We skip the details here by looking at the server setup part in the code below.


```python
async def main() -> None:
    async with websockets.serve(gemini_session_handler, "localhost", 9080):
        print("Running websocket server localhost:9080...")
        await asyncio.Future()  # Keep the server running indefinitely


if __name__ == "__main__":
    asyncio.run(main())
```
This is the server's main function; it will run the WebSocket server on localhost port 9080, and then, for each connection, it will call the `gemini_session_handler` to handle the WebSocket with the client. Using the `asyncio.Future()` to keep the server running indefinitely.

Let’s move back to see the details of the session handler process `gemini_session_handler()`.

The first WebSocket message is the config message, which is the setup message for the Gemini API. It can contain many parameters for the model, but in our case, we only need to use it to set the model generation modalities, whether it responds with text or audio. This will be done from the client's side. The config message will trigger the connection to the Gemini API using `client.aio.live.connect`.

After the API connection is established, the WebSocket with the Gemini Live API will continue, and the server will wait for the actual client data. There are two main parts in the session handler to process: `send_to_gemini()` and `receive_from_gemini()`.

The message from the client is a custom message format, which is a JSON object with the “`realtime_input`” field. This field contains the media data from the client web page, including the audio and image data (captured from the camera). The server will simply pack the data into the Gemini API message format and send it to the Gemini API.

In the `receive_from_gemini()`, the server will listen and receive the response from the Gemini API, then unpack the data into the custom message format and send it back to the client. Note that there are two types of response data that need to be handled differently: one is the text response, and the other is the audio/image response. The text response is a simple string, and the audio response is a base64 encoded audio data, the path to which will go is the decision of our config message. Because of the real\-time nature, the data are all streaming with chunks or called parts, so you have to make the receiving and forwarding keep running until the `turn_complete` flag is set to true.

After the definition, the two methods are launched as background tasks, and then the `asyncio.gather` is used to run them concurrently.

That’s all for the backend. You can directly run the code and see the result showing the WebSocket server is running on localhost port 9080\.


```python
python main.py
```
![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*7qW33Hm5bpZGZfAFt1r9tQ.png)


### Client\-side in HTML/JS

Now, let’s look at the client side, which is written in Javascript. I will not go through the 300 lines of code here, especially the layout and styling, and you can see the full code in my [GitHub repo](https://github.com/yeyu2/Youtube_demos/tree/main/gemini20-realtime). But I will be focusing on the same core logic of the client side, which is the WebSocket connection and the message handling.

When you open this web app, it will now automatically connect to the WebSocket server on localhost port 9080 and then send the setup message to the server.


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
The setup message is a JSON object with the “setup” field. This field contains the `generation_config`, which is the configuration for the Gemini API. In our case, we only need to set the response\_modalities to `[“AUDIO”]`, `[“TEXT”]`. I have tried both on the list, but it doesn’t work with an initial error. We can now set it to AUDIO to let the model respond with voice.


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
The `startAudioInput()` function manages microphone access, capturing audio, and sending it to the backend via websocket.


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
The `captureImage()` function periodically captures images from the webcam and also sends them to the backend via WebSocket. These are for the user input part.


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
In the `receiveMessage()` function. The `injestAudioChuckToPlay` function will process the audio data sent back from Gemini and send the audio stream to the pcm\-processor worklet for playback. The same process for the text output is handled in the `displayMessage` function. These are the logic for the output part.

These are the critical parts of the client, and because the model response format for audio is PCM format, we need to convert it to the audio format that the browser can play. So, we use the pcm\-processor function in the `pcm-processor.js` file to do the conversion.


## Run the App

Now, we can run the client by executing the command:


```python
python -m http.server
```
![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*o7NDcLqmPmhEpdGWEOew6A.png)

And then open the browser and go to `localhost:8000`, you will see the app is running.

Here is the video that I captured for the experience.







In conclusion, we can now duplicate the real\-time experience for the multimodal live API in a native and self\-hosted app. This is a great starting point for you to build your own real\-time voice \& video chatbot with Gemini 2\.0 multimodal live API. For example, you can add screen sharing or function calling to the app to make it more practical in both life and work.

Thanks for reading. If you think it’s helpful, please Clap 👏 for this article. Your encouragement and comments mean a lot to me, mentally and financially. 🍔

**Before you go:**

✍️ If you have any questions, please leave me responses or find me on [**X**](https://twitter.com/Yeyu2HUANG/)and [**Discord**](https://discord.gg/KPTCE4CEmp), where you can have my active support on development and deployment.

☕️ If you want exclusive resources and technical services, subscribing to the services on my **[Ko\-fi](https://ko-fi.com/yeyuh)** will be a good choice.

💯 **I am also open to being hired for any innovative and full\-stack development jobs.**


