---
title: "ByteDance Released An Open-Source Lip Sync AI Model"
meta_title: "ByteDance Released An Open-Source Lip Sync AI Model"
description: "ByteDance has launched LatentSync, an open-source lip sync AI model that uses audio-conditioned latent diffusion methods to create convincing deepfake videos. The model enhances temporal consistency through Temporal REPresentation Alignment (TREPA) while maintaining lip-sync accuracy. Users can easily generate lip-synced videos by uploading their video and audio files via platforms like Replicate and Fal. The tool offers significant advancements over previous lip-syncing technologies, making it a valuable resource for content creators, though it raises concerns about potential misuse in creating misleading deepfakes."
date: 2025-01-09T02:13:11Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*iuGooiYhFpii-B90LGjGBA.jpeg"
categories: ["Technology", "Generative AI", "Machine Learning"]
author: "Rifx.Online"
tags: ["lip-sync", "deepfake", "TREPA", "diffusion", "temporal"]
draft: False

---






ByteDance recently introduced [LatentSync](https://arxiv.org/abs/2412.09262), which is a new state\-of\-the\-art and open\-source model for video lip sync. It’s an end\-to\-end lip sync framework based on audio\-conditioned latent diffusion models.

That’s a bit mouthful, but what it means is that you can upload a video of someone speaking and an audio file you want to use instead of the original. The AI then overlays the new audio and adjusts the speaker’s lip movements to perfectly match the uploaded audio.

The result is a remarkably convincing, albeit slightly uncanny, deepfake video.

I’m honestly amazed by how fast things have changed in this area. Just a year ago, lip syncing in AI videos felt off, with the mouth movements often looking creepy. Now, with LatentSync, we’re stepping into a new era of easy and convincing deepfake\-like videos.

Check out an example below:







If you’re one who keeps an eye on the latest advancements in AI technology, videos with lipsynced audio aren’t new. In fact, I have written articles about them months ago, but one thing they all have in common is the quality of the result. A lot of tools struggled to make the mouth match the spoken words exactly. On top of that, the area around the lips could look off, so the face sometimes seemed unnatural.

This effect is related to the “uncanny valley,” where something looks almost human but still gives you a slight feeling that something’s not quite right. Personally, those older videos always reminded me of low\-budget special effects in some indie sci\-fi movie.


## How LatentSync Works

The LatentSync framework uses Stable Diffusion to model complex audio\-visual correlations directly. However, diffusion\-based lip\-sync methods often lack temporal consistency due to variations in the diffusion process across frames.

To address this, researchers introduce Temporal REPresentation Alignment (TREPA), which improves temporal consistency while maintaining lip\-sync accuracy. TREPA aligns generated frames with ground truth frames using temporal representations from large\-scale self\-supervised video models.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*xH-5S1hv3qBB31FY.png)

LatentSync uses Whisper to turn melspectrograms into audio embeddings, which are added to the U\-Net through cross\-attention layers. Reference and masked frames are combined with noised latents as the U\-Net’s input.

During training, researchers estimate clean latents from predicted noise in one step and decode them to get clean frames. TREPA, LPIPS, and SyncNet losses are applied in the pixel space.

If you want to learn more about the technical details of LatentSync, check out the whitepaper [here](https://arxiv.org/pdf/2412.09262).


## How To Do AI Lip Sync

Since the model is open\-source, an API is already available on [Replicate](https://replicate.com/bytedance/latentsync) and [Fal](https://fal.ai/models/fal-ai/latentsync).

In Replicate, look for ByteDance’s LatentSync model in the explore page, and in the Playground tab, upload your reference video and audio file.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*3hFsm7aNN01ShuMwHyS06Q.png)

You can leave the guidance scale and the seed number at default. Click on the “Boot \+ Run” button and wait for the final video to be generated. What you’ll get is a lip\-synced video file with a new audio overlay.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*nkS6HL8ivdz6dBaOJXUyFA.png)

The time it takes depends on how long your clip is. For a 20\-second sample video, it might need around five minutes. I’ve tested it myself, and while it’s not instantaneous, it’s surprisingly fast compared to older lip syncing tools.

On Fal, the process is similar. Upload your input video and audio file to the input section and click on the “Run” button.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*fNANzs93i8dAVu2BIkXcCg.png)

You can also integrate this into your own app via API. Here’s an example API request:


```python
import { fal } from "@fal-ai/client";

const result = await fal.subscribe("fal-ai/sync-lipsync", {
  input: {
    video_url: "https://fal.media/files/koala/8teUPbRRMtAUTORDvqy0l.mp4",
    audio_url: "https://fal.media/files/lion/vyFWygmZsIZlUO4s0nr2n.wav"
  },
  logs: true,
  onQueueUpdate: (update) => {
    if (update.status === "IN_PROGRESS") {
      update.logs.map((log) => log.message).forEach(console.log);
    }
  },
});
console.log(result.data);
console.log(result.requestId);
```
What you’ll get is a link to the generated video file like this:


```python
{
  "video": {
    "url": "https://v3.fal.media/files/rabbit/6gJV-z7RJsF0AxkZHkdgJ_output.mp4"
  }
}
```
I love how user\-friendly these platforms are. They do all the heavy lifting, so you can just upload files and get your results.


## Generate Your Own Video

If you don’t have an existing video, it’s possible to create one using AI tools like [Flux Labs AI](https://www.fluxlabs.ai/) for the image and then turn it into a video using Runway Gen\-3 Alpha.

To generate the image, head over to [fluxlabs.ai](https://www.fluxlabs.ai/) and open the image generator dashboard. Make sure to set the correct parameters, like the Flux model, the aspect ratio, and the output format. You can leave the advanced settings to default. Describe your AI character in the prompt field before clicking on the Generate button.

Here’s an example image prompt:


> **Prompt:** A young, attractive AI influencer with flawless skin and shoulder\-length sleek hair, wearing a stylish pastel blazer over a white top. She is standing in a bright, modern studio with subtle tech\-themed elements in the background, like holographic interfaces or floating icons. Her expression is cheerful yet focused as she gestures confidently with one hand, as if explaining a concept to her audience. Her other hand is slightly raised, adding to her dynamic pose, and the lighting is soft and flattering, emphasizing her polished and approachable look.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*GSe2g8W3hx0ah1QqaeeKjg.png)

Download the image file to your local disk.

Next, hop over to [app.runway.com](https://app.runway.com) and open the image\-to\-video tool. Upload the image you just created and give Runway a prompt describing what you want the video to look like. For example, maybe you want your character to move their head and hands in a casual way.

The result is a 10\-second video of our AI character doing all the hand gestures and head movement as if she’s explaining something. They usually won’t be talking, because we haven’t added any speaking animation yet. Still, it’s really cool to see a still image come to life.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*VPftb3Qo81Vqq0mknW01PQ.png)

Finally, head to [fal.ai](https://fal.ai) (or Replicate) and look for the LatentSync model. Upload the video you just made along with any audio file you’d like. Hit “Generate,” and after a little wait, you’ll have a new video where your AI character is actually “speaking” whatever’s in the audio.

Here’s what the final video looks like:







And that’s it! In less than 10 minutes, I was able to make a talking AI\-generated influencer.


## How Much Does It Cost?

On Replicate, the LatentSync model costs approximately $0\.095 to run, or 10 runs per $1, but this varies depending on your inputs. This model runs on [Nvidia L40S GPU hardware](https://replicate.com/docs/billing). Predictions typically complete within 98 seconds. The prediction time for this model varies significantly based on the inputs.

On Fal, the per generation costs $0\.7 per minute of video. That means, for $1, you can run the LatentSync model approximately once.


## Run it Locally for Free

If you’d rather avoid paying per run, you can install LatentSync on your own computer. There should be multiple variations of it right now, but one version I saw on GitHub is this [ComfyUI\-LatentSyncWrapper](https://github.com/ShmuelRonen/ComfyUI-LatentSyncWrapper?tab=readme-ov-file) by [ShmuelRonen](https://github.com/ShmuelRonen).

Before installing this node, you must install the following in order:

1. [ComfyUI](https://github.com/comfyanonymous/ComfyUI) installed and working. Check out this [guide](https://github.com/comfyanonymous/ComfyUI) on how to install and use ComfyUI.
2. Python 3\.8–3\.11 (mediapipe is not yet compatible with Python 3\.12\)
3. [FFmpeg](https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip) installed on your system. Make sure to add `C:\ffmpeg\bin` to system PATH
4. If you get PYTHONPATH errors:
* Make sure Python is in your system PATH
* Try running ComfyUI as administrator

To install LatentSync, clone [this](https://github.com/ShmuelRonen/ComfyUI-LatentSyncWrapper?tab=readme-ov-file) repository into your ComfyUI custom\_nodes directory:


```python
cd ComfyUI/custom_nodes
git clone https://github.com/ShmuelRonen/ComfyUI-LatentSyncWrapper.git
cd ComfyUI-LatentSyncWrapper
pip install -r requirements.txt
```
The node will attempt to automatically download required model files from HuggingFace on first use. Then follow the steps below to perform the video processing.

1. Select an input video file
2. Load an audio file using ComfyUI audio loader
3. (Optional) Set a seed value for reproducible results
4. Connect to the LatentSync node
5. Run the workflow

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*PqaHdKD0JV0jr-WJ)

When it’s finished, the synced video will show up in ComfyUI’s output folder. Keep in mind that it might use about 6\.5 GB of GPU memory. If you’ve got a GPU like an RTX 3060 or better, you should be okay.

In my case, I like using local setups because I don’t have to worry about costs or usage limits. I can run as many tests as I want, and it’s also easier to poke around in the code if I want to tweak something. But yeah, it does take a bit more effort to set up.


## Why Should You Care?

LatentSync is one of the most impressive free lip sync tools I’ve tried. Other open\-source options, like RenderNet or Hedra, often struggle with details such as lip alignment or keeping the face looking normal when someone smiles or moves their head too much. LatentSync, however, handles these things pretty smoothly.

Still, it’s not perfect. You might notice small glitches, especially if the speaker tries to smile a lot or if there’s a fast head turn. But it’s close enough that it feels like a big step forward compared to older methods. Also, if you compare it to some paid services (like Kling AI or advanced tools in Runway), those might produce cleaner results in certain situations.

**But the fact that we have something free and open\-source that’s nearly on par with premium options is a huge win for the AI community.**

There’s a lot of creative potential here. For instance, you could make short ads, educational videos, or digital influencers without hiring real actors. You can also switch out the audio track as much as you want, so it’s easy to make videos in multiple languages—just drop in your translated voiceover. This kind of flexibility can save a lot of time and money for smaller creators, startups, or anyone who doesn’t have a big budget to film in a studio.

On the flip side, such an easy\-to\-use tool makes it even simpler to create deepfake videos that could spread misinformation or fool people. We should all do our part in educating each other about the technology, how to spot deepfakes, and why consent matters when making videos of real people.


## Final Thoughts

LatentSync is really cool for an open\-source tool. The results look great, especially compared to other tools like Facefusion and Hedra that struggle with things like smiling faces.

It’s not perfect, and it could get better, but it’s easily the best open\-source option right now. Sure, paid tools like Kling AI or Runway might do a better job, but it’s awesome to see free tools like this getting so good.

This can make a big difference for things like ads or virtual influencers. Making videos where AI characters talk used to be hard, but LatentSync makes it super easy.

Of course, I’d like to stress again that with any powerful technology comes the need for responsible use. Deepfakes can easily trick people if they’re not careful. But if you handle it wisely , using it for jokes, creative projects, or legit business cases, there’s a lot of good that can come from this kind of innovation.

I’m excited to use this in one of my projects. I might even build an app with it. It's just fun to see what’s possible now.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*9Oz6fsFNQIaINrMz.png)

This story is published on [Generative AI](https://generativeai.pub/). Connect with us on [LinkedIn](https://www.linkedin.com/company/generative-ai-publication) and follow [Zeniteq](https://www.zeniteq.com/) to stay in the loop with the latest AI stories.

Subscribe to our [newsletter](https://www.generativeaipub.com/) and [YouTube](https://www.youtube.com/@generativeaipub) channel to stay updated with the latest news and updates on generative AI. Let’s shape the future of AI together!

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*cUu0UaSEdxZR0huE.png)


