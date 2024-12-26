---
title: "How to Use the Google DeepMind Gemini 2.0 Flash Live API for Real-Time Conversations"
meta_title: "How to Use the Google DeepMind Gemini 2.0 Flash Live API for Real-Time Conversations"
description: "The Google DeepMind Gemini 2.0 Flash API enables developers to create real-time AI-powered conversational applications, facilitating seamless audio interactions. This guide provides a comprehensive overview of the APIs functionalities, focusing on two Python scripts: `live_test.py`, which uses an audio queue for managing audio data, and `no_queue_version.py`, which simplifies audio streaming. Key features include WebSocket communication, audio capture, and playback. The API supports various applications, such as customer service and interactive tutoring, allowing developers to customize their integration based on specific needs."
date: 2024-12-26T02:21:41Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*CID6kJNnEC5rRDPIpVK4ng.png"
categories: ["Programming", "Chatbots", "Voice Assistants"]
author: "Rifx.Online"
tags: ["DeepMind", "Gemini", "WebSocket", "audio", "streaming"]
draft: False

---






Google DeepMind’s Gemini 2\.0 Flash API represents a groundbreaking leap in the world of real\-time AI\-powered conversations. It empowers developers to build applications that can seamlessly handle live audio interactions, offering unparalleled integration of speech input and output. Whether you’re creating a customer service chatbot, enhancing accessibility tools, or developing interactive AI tutors, this API serves as a robust foundation. In this blog, we will explore the functionality of the Gemini 2\.0 Flash API and demonstrate how to use it effectively with Python. We’ll guide you step\-by\-step through the implementation, leveraging two distinct scripts, `live_test.py` and `no_queue_version.py`, to help you get started on crafting dynamic conversational AI solutions.

Before we proceed, let’s stay connected! Please consider following me on **Medium**, and don’t forget to connect with me on [LinkedIn](https://www.linkedin.com/in/mohamed-azharudeen/) for a regular dose of data science and deep learning insights.” 🚀📊🤖


## Prerequisites

1. **API Key:** Obtain your Google Gemini API key by signing up for access on the Google AI Platform.
2. **Python Environment:** Ensure Python 3\.8\+ is installed.
3. **Dependencies:** Install required libraries:


```python
pip install websockets pyaudio asyncio
```
4\. **Environment Variable:** Set the API key as an environment variable:


```python
export GEMINI_API_KEY="your_api_key_here"
```

## Key Features of the Scripts

Both scripts implement real\-time speech interactions but differ slightly in their approach:

* `live_test.py`**:** Uses an audio queue for managing and playing back received audio data.
* `no_queue_version.py`**:** Directly plays received audio without a queue, simplifying the process.


### Shared Components

* **WebSocket Connection:** Facilitates communication with the Gemini API.
* **Audio Capture:** Records user input using PyAudio.
* **Audio Playback:** Streams the AI\-generated responses back to the user.


## Step\-by\-Step Explanation of live\_test.py


### Initialization


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
* **Audio Queue:** Stores received audio chunks for playback.
* **API Key \& Model:** Configures access to the Gemini API.
* **Audio Settings:** Sets input and output parameters.


### Starting the Connection


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
* **WebSocket Connection:** Establishes a link to the Gemini service.
* **Task Group:** Concurrently manages audio capture, streaming, and playback.


### Capturing Audio


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
* **Audio Recording:** Captures input from the microphone and sends it to the API.


### Streaming Audio


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
* **Response Handling:** Decodes audio responses from the API and stores them in the queue.


### Playing Responses


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
* **Audio Playback:** Plays back the AI\-generated audio.


## Step\-by\-Step Explanation of no\_queue\_version.py

The `no_queue_version.py` script simplifies the process by directly streaming and playing received audio without an intermediate queue.


### Key Differences

* **Simplified Response Handling:**


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

## Running the Scripts

1. **Set the Environment Variable:**


```python
export GEMINI_API_KEY="your_api_key_here"
```
2\. **Run the Script:**


```python
python live_test.py
```
3\. **Speak into the Microphone:** The script captures your input, sends it to the Gemini service, and plays back the AI’s response.


## Conclusion

Using the Google DeepMind Gemini 2\.0 Flash API, you can build innovative applications that support dynamic and real\-time conversations. This cutting\-edge technology enables seamless audio interactions, making it ideal for various use cases such as customer support, interactive tutorials, and language learning.

By choosing between `live_test.py` for advanced queuing capabilities or `no_queue_version.py` for simplicity, developers can tailor the API integration to suit specific needs.

The API’s robust features, combined with the flexibility of Python, allow for the creation of highly interactive and responsive applications. Take the time to explore the scripts, experiment with customization options, and unlock the full potential of AI\-powered communication. The possibilities are vast, and with Gemini 2\.0 Flash, you can bring your most ambitious conversational AI ideas to life!


