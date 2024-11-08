---
title: "OpenAI Realtime API (Voice Mode), Getting Started on Colab"
meta_title: "OpenAI Realtime API (Voice Mode), Getting Started on Colab"
description: "Everything you need to know, and a hands-on introduction to OpenAI’s voice mode API that you can run on Colab."
date: 2024-11-08T00:23:32Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*_-d5zsWWQEzVLZxABTSFWQ.png"
categories: ["Programming", "Voice Assistants", "Technology/WebAPI"]
author: "Rifx.Online"
tags: ["OpenAI", "Realtime", "API", "GPT-4o", "Colab"]
draft: False

---




Everything you need to know, and a hands\-on introduction to OpenAI’s voice mode API that you can run on Colab.



The latest development from OpenAI brings us the **Realtime API**, designed to allow developers to create **fast, seamless speech\-to\-speech experiences** within their apps. This API aims to streamline the development of multimodal conversational features, making it much easier to build natural, real\-time voice interactions.

I**n this blog post,** I’ll cover the **main questions** around this new API, including

* what is Realtime API,
* How to access it,
* Its limitations and pricing,
* and provide a **Colab tutorial** on how to get started.


## What is the Realtime API?

The **Realtime API** by OpenAI is a public beta feature that enables paid developers to incorporate real\-time voice interaction in their apps. It’s a multimodal API capable of transforming **audio inputs to speech responses**, using the advanced **GPT\-4o** model for this purpose. Essentially, it allows for **low\-latency conversations** similar to a natural human interaction, similar to the functionality seen in ChatGPT’s Advanced Voice Mode.

Previously, developers had to stitch together multiple models for **speech recognition, text processing, and text\-to\-speech generation**. The Realtime API does this all in a single API call, resulting in fewer delays, richer responses, and more consistent handling of accents and emphasis.

The **Chat Completions API** also introduces audio input and output, but it doesn’t offer the low\-latency experience of the Realtime API. Thus, for experiences like language learning or voice\-enabled assistants, Realtime API is the preferred choice.


## Access and Limitations

Access to the **Realtime API** is currently available as a **public beta** for paid developers.

**Although it is said that access is limited in Europe, I was able to use it through my tier 5 OpenAI account.**

The API uses a **WebSocket** connection, which ensures a smooth streaming experience for both audio inputs and outputs.

For now, there are **limitations** to note:

* **Session Rate Limits**: The API is rate limited to approximately **100 simultaneous sessions** for Tier 5 developers. Lower tiers have smaller capacity. As of Octobre 2024, the API is limited 2M tokens per minutes.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*XpAB6WRseRb0iY-edE94xw.png)

* **Capabilities**: Initially, only **voice modality** is supported, but OpenAI plans to add more like **video** and **vision** over time.
* **Availability**: Full audio capabilities are in the beta phase, with **future SDK integration** planned for Python and Node.js.


## Pricing of the Realtime API

The **pricing** structure for the Realtime API is divided into both **text tokens** and **audio tokens**:

* **Audio Input**: $100 per 1 million tokens (approx. **$0\.06 per minute**).
* **Audio Output**: $200 per 1 million tokens (approx. **$0\.24 per minute**).
* **Text Input**: $5 per 1 million tokens.
* **Text Output**: $20 per 1 million tokens.

The pricing makes it affordable for developers to create robust **speech\-to\-speech** experiences, though audio features are significantly more expensive than text\-based interactions. This is important to keep in mind when scaling an app with voice features.

It is still slightly more expensive than outsourcing it to some countries, but we can expect a significant drop in prices over the next six months.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*ocwFDXEt8X7KD_k6)


## Building with the Realtime API in Google Colab

Here’s a basic **Colab guide** to help you get started with uploading a file, sending a request to the Realtime API, and generating audio responses.

In this demo, we chose to upload a stream of audio chunks to mimic a conversation.

**Full Colab Code**: [link here](https://colab.research.google.com/drive/1-bj_LH7Gv2bbTJopbo7Hk_AIyDAuqeEQ?usp=sharing), simply add your “openai” key to Colab’s secrets and run the colab.


### Step 1: Setting Up Google Colab and Dependencies

* Start a new **Google Colab** notebook.
* Install the necessary libraries such as **requests** and **pydub** for managing audio files.


```python
#Setup
!pip install websockets pydub --quiet 

import base64
import numpy as np
import soundfile as sf
import json
import websockets
from google.colab import files
from pydub import AudioSegment
from tqdm import tqdm
import io
```

### Step 2: Uploading Your Audio File

In Colab, you can use the `files` module from **google.colab** to upload audio files.


```python
#Upload audio
def upload_audio():
    uploaded = files.upload()  
    for file_name in uploaded.keys():
        return file_name

audio_file = upload_audio()
```

### Step 3: Sending a Request to the Realtime API

* Format the audio file properly before sending it to OpenAI.
* Establish a WebSocket connection to stream the audio file.
* Use `tqdm` to display the progress of the upload stream.
* The function returns the full set of events (including responses) for later processing to generate the output audio. It also returns the transcript of the model’s response.


```python
#Helper functions
## Function to convert Float32Array to PCM16 format
def float_to_pcm16(float32_array):
    return np.clip(float32_array * 32767, -32768, 32767).astype(np.int16).tobytes()

## Function to split audio into base64-encoded PCM16 chunks
def float32_to_base64_chunks(float32_array, chunk_size=32000):
    pcm16_data = float_to_pcm16(float32_array)
    for i in range(0, len(pcm16_data), chunk_size):
        yield base64.b64encode(pcm16_data[i:i+chunk_size]).decode('utf-8')

## WebSocket connection and streaming audio with text prompt
## Main function to call OpenAI Realtime API
async def stream_audio_to_realtime_api(audio_file, text_prompt, openai_key, verbose = False):
    data, samplerate = sf.read(audio_file, dtype='float32')
    if data.ndim > 1:
        data = data[:, 0]
    if samplerate != 24000:
        raise ValueError(f"Audio must be sampled at 24kHz, but it is {samplerate}Hz")

    url = "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01"
    headers = {"Authorization": "Bearer " + openai_key, "OpenAI-Beta": "realtime=v1"}

    async with websockets.connect(url, extra_headers=headers) as ws:
        await ws.send(json.dumps({
            "type": "conversation.item.create",
            "item": {"type": "message", "role": "user", "content": [{"type": "input_text", "text": text_prompt}]}
        }))

        with tqdm(total=(len(float_to_pcm16(data)) + 32000 - 1) // 32000, desc="Sending Audio Chunks") as pbar:
            for chunk in float32_to_base64_chunks(data):
                await ws.send(json.dumps({"type": "input_audio_buffer.append", "audio": chunk}))
                pbar.update(1)

        await ws.send(json.dumps({"type": "input_audio_buffer.commit"}))
        await ws.send(json.dumps({"type": "response.create"}))

        all_events = []
        while True:
            response = await ws.recv()
            event = json.loads(response)
            all_events.append(event)
            if verbose:
                print(event)
            if event["type"] == "response.output_item.done" and "item" in event and "content" in event["item"]:
                for content in event["item"]["content"]:
                    if content["type"] == "audio" and "transcript" in content:
                        transcript = content["transcript"]
                        break
            if event["type"] == "rate_limits.updated":
                break

        return all_events, transcript
```

```python
#Add a prompt and call OpenAI Realtime API
text_prompt = "Summarize this audio content"

events, transcript = await stream_audio_to_realtime_api(
    audio_file, 
    text_prompt, 
    openai_key, 
    verbose = False 
#to display OpenAI's response as they arrive, use verbose = True
    ) 
```

### Step 4: Generating Audio Responses

* Once you receive the response, generate the audio.
* Choose a file name and save the file.
* You will then be able to download the file.


```python
## Function to decode and concatenate audio chunks into a full audio file
def generate_audio_from_chunks(audio_chunks, output_filename=None):
    # Concatenate the base64-encoded audio chunks from the 'delta' field
    full_audio_base64 = ''.join(audio_chunks)

    # Decode the concatenated base64 string to raw PCM16 audio bytes
    audio_bytes = base64.b64decode(full_audio_base64)

    # Load the bytes as a pydub AudioSegment (assuming 24kHz, 1 channel, PCM16)
    audio_segment = AudioSegment.from_raw(
        io.BytesIO(audio_bytes), 
        sample_width=2, 
        frame_rate=24000, 
        channels=1)

    # Optionally save the audio to a file
    if output_filename:
        audio_segment.export(output_filename, format="wav")
        print(f"Audio saved to {output_filename}")

    return audio_segment
```

```python
#Extract audio chunks from the collected events
audio_output_chunks = [event['delta'] for event in events if event['type'] == 'response.audio.delta']

## Generate the full audio from the collected chunks
generated_audio = generate_audio_from_chunks(audio_output_chunks, output_filename="output_audioo.wav")
```

## Conclusion

With the above steps, you can integrate OpenAI’s Realtime API into a Colab notebook, enabling seamless voice instructions.

This guide should give you a solid foundation for experimenting with real\-time audio\-to\-audio interactions and building innovative voice\-driven applications.


