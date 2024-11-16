---
title: "Comparing Leading Text-to-Image Generation Models for Adding Text to Images"
meta_title: "Comparing Leading Text-to-Image Generation Models for Adding Text to Images"
description: "This article evaluates the text generation capabilities of nine leading text-to-image models, focusing on their ability to accurately render text within images based on specific prompts. The models tested include Adobe Firefly, Amazon Titan, Black Forest Labs FLUX1.1, Google Imagen, KLING AI, Midjourney, OpenAI DALL·E, and Stability AIs models. Results show that Black Forest Labs FLUX1.1 and Stability AIs Stable Image Ultra performed best, accurately reproducing text over 50% of the time. The article also discusses three alternative techniques for ensuring text accuracy in generated images."
date: 2024-11-16T01:36:50Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Gvj5CUGClWka1KUsDy5GQw.png"
categories: ["Generative AI", "Natural Language Processing", "Technology/Web"]
author: "Rifx.Online"
tags: ["text", "generation", "models", "accuracy", "techniques"]
draft: False

---





### A comparison of nine leading image generation models’ ability to render accurate text (words and phrases) within an image.

In this post, we will assess the capabilities of nine state\-of\-the\-art text\-to\-image generation models from multiple providers on different hosting platforms. Specifically, we will evaluate their ability to generate accurate text (words and phrases) within images based on given prompts. The models tested include the following (in alphabetical order):

1. Adobe Firefly Image 3 (via [firefly.adobe.com](http://firefly.adobe.com/))
2. Amazon Titan Image Generator G1 v2 (via [Amazon Bedrock](https://aws.amazon.com/bedrock/))
3. Black Forest Labs FLUX1\.1 \[pro] and Ultra Mode (via [Replicate](http://replicate.com/))
4. Google Imagen 3 (via [ImageFX](https://aitestkitchen.withgoogle.com/tools/image-fx))
5. KLING AI powered by [Kwai\-Kolors/Kolors](https://huggingface.co/Kwai-Kolors/Kolors) (via [klingai.com](http://klingai.com/))
6. Midjourney v6\.1 (via [midjourney.com](http://midjourney.com/))
7. OpenAI DALL·E 3 (via [ChatGPT](https://quip-amazon.com/62AqA7VtF4Xb/chatgpt.com))
8. Stability AI Stable Diffusion 3\.5 Large (via [stability.ai](http://stability.ai/) API)
9. Stability AI Stable Image Ultra 1\.0 v1 (via [Amazon Bedrock](https://aws.amazon.com/bedrock/))

Additionally, we will examine three alternative and more reliable techniques for ensuring the accuracy of text in generated images.


## Testing the Models

Several tests, using different prompts and varying levels of detail, were run across all models. Examples of prompts included:

1. *A photograph of a smiling scientist holding a sign that reads: “Flawless AI\-generated text!”*
2. *Vegetable stand with various vegetables, including tomatoes. A black sign with white type reads: “Farm Fresh Tomatoes $2\.99/lb.”*
3. *A whimsical illustration of a friendly\-looking pumpkin on a white background with a Fall motif of assorted gourds and autumn leaves. The words “Happy Halloween” are centered above the pumpkin in large dark brown letters.*
4. *A sleek billboard towers above a bustling interstate at rush hour, cars whizzing by in a blur. Against a dynamic, abstract background, the large, bold text “Generative AI: Transforming Digital Advertising”, creates instant readability for passing motorists.*

Although the overall image quality and degree of apparent bias varied significantly among the models, only text generation capabilities were assessed. Models that could accurately reproduce the requested text in the prompt at least 50% of the time received a passing grade. Below are results from selected tests that exemplify the models’ capabilities. The results are presented in alphabetical order rather than ranked by quality. For each test, four representative images of average quality are included in the post.




## Models


### Adobe Firefly Image 3

Adobe announced its Firefly Image 3 Foundation Model in April 2024\. According to the [press release](https://news.adobe.com/news/news-details/2024/adobe-introduces-firefly-image-3-foundation-model-to-take-creative-exploration-and-ideation-to-new-heights), Adobe Firefly Image 3 delivers stunning advancements in photorealistic quality, styling capabilities, detail, accuracy, and a greater variety. In addition, significant advancements in the generation speed make the ideation and creation process more productive and efficient. The model is available for use in Adobe Photoshop (beta) and on [firefly.adobe.com](https://firefly.adobe.com/generate/images). Both interfaces are shown below.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*gcASwZgRSfPNYJB7n5GrlQ.png)

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*vU3NW6VdkgojkNlHaGWoSg.png)

🚫 In my tests, Adobe Firefly could not accurately reproduce the text requested in the prompt.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*yWoDLmj5mPKEw8GRg51YXw.jpeg)

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*0iskBrEjrtFk-mXNrBvkag.jpeg)


### Amazon Titan Image Generator G1 v2

The Amazon Titan Image Generator G1 v2 model was [released](https://aws.amazon.com/blogs/aws/amazon-titan-image-generator-v2-is-now-available-in-amazon-bedrock/) in August 2024\. It was an upgrade to the previous generation, the Amazon Titan Image Generator G1 v1 model, [released](https://aws.amazon.com/blogs/aws/amazon-titan-image-generator-multimodal-embeddings-and-text-models-are-now-available-in-amazon-bedrock/) in November 2023\. The Amazon Titan Image Generator G1 v2 model added features, including image conditioning, image guidance with a color palette, background removal, and subject consistency.

The Amazon Titan Image Generator G1 v2 model was tested on Amazon Bedrock, which according to [AWS](https://aws.amazon.com/bedrock/), is “*a fully managed service that offers a choice of high\-performing foundation models (FMs) from leading AI companies like AI21 Labs, Anthropic, Cohere, Meta, Mistral AI, Stability AI, and Amazon through a single API, along with a broad set of capabilities you need to build generative AI applications with security, privacy, and responsible AI.*”

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*TmROyF5c-BXHevqImyflmw.png)

🚫 In my tests, Amazon Titan Image Generator G1 v2 could not accurately reproduce the text requested in the prompt.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*QLvxsEveORObkPOOB3u1Mg.png)


### Black Forest Labs FLUX1\.1 \[pro] and Ultra Mode

Black Forest Labs [released](https://blackforestlabs.ai/announcing-flux-1-1-pro-and-the-bfl-api/) FLUX1\.1 \[pro] in October 2024\. According to Black Forest Labs, “*FLUX1\.1 \[pro] provides six times faster generation than its predecessor FLUX.1 \[pro] while also improving image quality, prompt adherence, and diversity. At the same time, we updated FLUX.1 \[pro] to generate the same output as before, but two times faster.*” The earlier FLUX.1 \[pro] model was released in August 2024\.

As I prepared this post, Black Forest Labs introduced FLUX1\.1 \[pro] Ultra and Raw Modes. According to the press release, “T*oday we are adding new high\-resolution capabilities to FLUX1\.1 \[pro], extending its functionality to support 4x higher image resolutions (up to 4MP) while maintaining an impressive generation time of only 10 seconds per sample.*”

Tests of Black Forest Labs FLUX1\.1 \[pro] and Ultra were run on [Replicate](https://replicate.com/blog/machine-learning-needs-better-tools). Their website states, “*Replicate runs machine learning models in the cloud. We have a library of open\-source models that you can run with a few lines of code. If you’re building your own machine learning models, Replicate makes it easy to deploy them at scale.*”

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*IUbfTFj32FxIta_3J1W0pQ.png)

✅ In my tests, Black Forest Labs FLUX1\.1 \[pro] could accurately reproduce the text requested in the prompt more than 50% of the time. It had the best results of all models tested.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*RewBBA9MAiNbG93h65WdYg.png)

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ISZfNQZHo3PL_QkYu3jEIw.png)

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*XliNJWJr2TZ5MGwi7RAa-g.png)


### Google Imagen 3

Google Imagen 3 was [released](https://deepmind.google/technologies/imagen-3/) to all US users in August 2024\. According to Google, “*Imagen 3 is our highest\-quality text\-to\-image model, capable of generating images with even better detail, richer lighting, and fewer distracting artifacts than our previous models.*” Tests of Google Imagen 3 were run on [ImageFX](https://aitestkitchen.withgoogle.com/tools/image-fx), part of Google’s AI Test Kitchen, “*a place where people can experience and give feedback on some of Google’s latest AI technologies.*”

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*nhto3l0o-XITJzEEQoHSTA.png)

🚫 In my tests, Google Imagen 3 could not accurately reproduce the text requested in the prompt.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*9aqKPuZlpGF_lE3pA0ZNtw.png)


### KLING AI powered by Kolors

Kolors powers Kling AI’s image generation capabilities. According to [Hugging Face](https://huggingface.co/Kwai-Kolors/Kolors), “*Kolors is a large\-scale text\-to\-image generation model based on latent diffusion, developed by the Kuaishou Kolors team. Trained on billions of text\-image pairs, Kolors exhibits significant advantages over both open\-source and proprietary models in visual quality, complex semantic accuracy, and text rendering for both Chinese and English characters.*” According to [Kuaishou](https://ir.kuaishou.com/news-releases/news-release-details/kuaishou-launches-full-beta-testing-kling-ai-global-users-0), Kling AI was released in July 2024\.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*na56zUz3DLWK7Dqj51vSKw.png)

🚫 In my tests, KLING AI powered by Kolors could not accurately reproduce the text requested in the prompt. The results were the worst of the models tested. Many responses were in Chinese, even when explicitly asked to be displayed in English.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*xgq4C0m8s3Wfp4p9Va7fSQ.png)


### Midjourney v6\.1

Midjourney v6\.1 was released in July 2024\. According to [Midjourney](https://updates.midjourney.com/version-6-1/), the latest release, v6\.1, contained several significant improvements, including more coherent images (arms, legs, hands, bodies, plants, animals, etc.), much better image quality, more precise, detailed, and correct small image features, and improved text accuracy (when drawing words via “quotations” in prompts). Using the `— — style raw` flag also helps improve text accuracy in some test cases, according to [Midjourney](https://docs.midjourney.com/docs/text-generation).

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ETXx5VyY4BgEA8zn4K3M0g.png)

🚫 ✅ In my tests, Midjourney v6\.1 results were mixed. Midjourney could not consistently reproduce the text requested in the prompt more than 50% of the time. The output was correct in some test cases and close to the prompt in others but also repeated words and punctuation just as often.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*yIaVzqP_BwvDGMO5SOo1SA.png)

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*BDCsxYe_cJSb6pfoxKrWGA.jpeg)

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*dqGYigq9T-PMx3GKfqSf2Q.png)


### OpenAI DALL·E 3

OpenAI DALL·E 3 was [released](https://deepmind.google/technologies/imagen-3/) over one year ago, in October 2023\. According to [OpenAI](https://openai.com/index/dall-e-3/), “*DALL·E 3 represents a leap forward in our ability to generate images that exactly adhere to the text you provide. DALL·E 3 understands significantly more nuance and detail than our previous systems \[DALL·E 2], allowing you to easily translate your ideas into exceptionally accurate images.*”

Tests of OpenAI Imagen 3 were run on [ChatGPT](https://openai.com/index/chatgpt/). Also, according to [OpenAI](https://openai.com/index/dall-e-3/), “*DALL·E 3 is built natively on ChatGPT, which lets you use ChatGPT as a brainstorming partner and refiner of your prompts. Just ask ChatGPT what you want to see in anything from a simple sentence to a detailed paragraph.*”

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*x45i0IJoYNiJT1kOi98k7w.png)

🚫 In my tests, OpenAI DALL·E 3 could not accurately reproduce the text requested in the prompt.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*NirwqSB-k8dzfGRNAw-pQw.png)


### Stability AI Stable Diffusion 3\.5 Large

According to Stability AI, the [Stable Diffusion 3\.5 Large](https://stability.ai/news/introducing-stable-diffusion-3-5) model, released in October 2024, “*at 8\.1 billion parameters, with superior quality and prompt adherence, this base model is the most powerful in the Stable Diffusion family. This model is ideal for professional use cases at 1 megapixel resolution.*” The Stability AI Stable Diffusion 3\.5 Large was tested using the [StabilityAI REST API](https://platform.stability.ai/docs/api-reference#tag/Generate/paths/~1v2beta~1stable-image~1generate~1ultra/post) and code written in Python within a Jupyter Notebook.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*56Zp5QWVvTzGYlslcWEGKg.png)

✅ In my tests, Stability AI Stable Diffusion 3\.5 Large could accurately reproduce the text requested in the prompt more than 50% of the time, occasionally with slight punctuation errors.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*CQ9I5z7x8ILTdFhu1dCBCQ.jpeg)

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*G2D-L2fEtjKVTTyph3Burg.jpeg)


### Stability AI Stable Image Ultra

According to Stability AI, the 16 *billion\-parameter [Stable Image Ultra](https://stability.ai/stable-image) model, released in October 2024, “is our flagship model, blending the power of the SD3 Large with advanced workflows to deliver the highest\-quality photorealistic images. This premium model is designed for industries that require unparalleled visual fidelity, such as marketing, advertising, and architecture.*” Like Amazon Titan Image Generator, the Stability AI Stable Image Ultra model was also tested using [Amazon Bedrock](https://aws.amazon.com/blogs/aws/stability-ais-best-image-generating-models-now-in-amazon-bedrock/) using the Image Playground UI.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*GjaPW2FWGGhuJ06trs1Jww.png)

✅ In my tests, Stability AI Stable Image Ultra could accurately reproduce the text requested in the prompt more than 50% of the time. Along with Black Forest Labs FLUX1\.1 \[pro], it was one of the best models tested.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*O7JKeKBPgaEOuvdFW-u2Sg.png)

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*jDHNLjOKHuEBQlFvTb7nYQ.png)


## AI Alternatives to Generating Text

The Black Forest Labs FLUX1\.1 \[pro] and Stability AI Stable Image Ultra models accurately reproduce requested phrases in prompts more frequently than other models. However, users still lack control over many aspects of the images, including the exact position, size, kerning, color, and font style of the text. Several alternative and more reliable techniques exist to guarantee the accuracy of text in generated images.


### Replace Generated Text

One alternative approach is to generate the image with the desired text, regardless of spelling mistakes. Subsequently, one can remove the text in Adobe Photoshop and replace it with correct text in the exact position, size, color, and style desired. However, removing and recreating text can be challenging if foreground subjects or shadows partially obscure it, or if the text appears on an irregular surface. To enhance the realism of the new text, one can rasterize the vector type and then add noise, blurring, distortion, lighting, texturing, and layer blending effects.

Below are two examples of images generated with Black Forest Labs FLUX1\.1 \[pro] Ultra (first image). The text has been removed in Adobe Photoshop (second image), new vector\-based text has been added (third image), and finally, the text has been rasterized and distorted to appear more realistic (fourth image).

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*B0_3d8oImDlrRb6mjpekrw.png)

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*fmrW46OsZe6Zsc0eshPyYw.png)


### Start with a Blank Canvas

A second alternative is to generate the image without text and then add your text in the desired color, size, and font style using Adobe Photoshop. This technique is more straightforward than retouching the generated image to remove existing text. The examples were created using the [Replicate](https://replicate.com/docs/get-started/python) API with Python from a Jupyter Notebook to call Black Forest Labs’ FLUX1\.1 \[pro] and Ultra.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*iFpqy4fEUJOXaJMzhsgbDA.png)

Below is an image generated with Black Forest Labs FLUX1\.1 \[pro] Ultra using the prompt: “*A photograph of a smiling female scientist in a lab coat, standing in a lab, holding a white rectangular sign with no wording or other elements.*” The generated image (first image) has new text added (second image), and finally, the text is distorted to appear more realistic (third image).

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*c1rgPArHDrUQ2cePV9DUCA.png)

Below is another example that begins with a generated image containing no text, to which text was later added. The initial image was generated with Black Forest Labs FLUX1\.1 \[pro] Ultra using the prompt: “*Vegetable stand with various vegetables, including tomatoes. A small, rectangular, blank, black sign with no text or other elements sits beside the tomatoes.*”

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*t_6oM1aItMGQfBUPjH83lA.png)

One last example using the prompt, “*A sleek billboard towers above a bustling interstate at rush hour, cars whizzing by. Against a colorful, dynamic, abstract background fills the billboard.*” to generate the original image.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*KyGveUehRxuFTK-DmWnCaw.jpeg)


## Generate Image and Text Separately

A third and final technique is to generate the image and text separately using your model of choice, then combine the two elements in post\-production using Adobe Photoshop. Below is the original image from Midjourney on the left without text, generated using the prompt: “*Vegetable stand with various vegetables, including tomatoes. A empty, blank blackboard\-like sign. — ar 1:1*”

The white type on a black background in the center was also generated in Midjourney, using the prompt: “*The phrase “Farm Fresh Tomatoes $2\.99/lb.” written in white chalk letters on a solid jet black background. — no tomatoes or other objects — ar 3:2 — style raw — stylize 0*”

The text\-only image is then easily overlaid on top of the first image using the Lighten blending mode for the text\-only layer. Additional distortions can be applied to make the text look more natural in final image.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ZP-pqTQVN8Xy_Vhjm8D0gg.png)


## Conclusion

In this post, we explored the capabilities of nine different state\-of\-the\-art text\-to\-image generation models from various providers to generate accurate text within images from prompts. We discovered that Black Forest Labs FLUX1\.1 \[pro] and Stability AI’s Stable Image Ultra were more successful at accurately reproducing requested text in images compared to other models. Finally, we examined three alternative and more reliable techniques for ensuring the accuracy of text in generated images.

*If you are not yet a Medium member and want to support authors like me, please sign up here: <https://garystafford.medium.com/membership>.*

*This blog represents my viewpoints and not those of my employer, Amazon Web Services (AWS). All product names, images, logos, and brands are the property of their respective owners.*


