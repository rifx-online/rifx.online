---
title: "Multilingual Vision Captioning: A Multi-Model Multimodal Approach to Image and Video Captioning and…"
meta_title: "Multilingual Vision Captioning: A Multi-Model Multimodal Approach to Image and Video Captioning and…"
description: "This article discusses a multi-model approach to multilingual vision captioning and translation, utilizing Metas Llama 3.2 11B Vision Instruct, Facebooks NLLB-200, and LLaVA-Next-Video 7B models. It details the process of generating descriptive tags, natural language descriptions, and sentiment analyses for images and videos. The article emphasizes the efficiency of AI in visual content analysis, including automated tagging, content moderation, and extracting insights. It also covers model hosting, quantization, and the prerequisites for implementation, providing example outputs for image and video analyses, demonstrating the capabilities of these AI models in producing detailed and nuanced descriptions across multiple languages."
date: 2024-12-26T04:30:18Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*I1PvP9vmfC9oXJESlkt8dw.png"
categories: ["Natural Language Processing", "Computer Vision", "Generative AI"]
author: "Rifx.Online"
tags: ["multimodal", "vision", "captioning", "translation", "quantization"]
draft: False

---





### Using a combination of Meta’s Llama 3\.2 11B Vision Instruct, Facebook’s 600M NLLB\-200, and LLaVA\-Next\-Video 7B models to produce multilingual image and video captions, descriptive tags, and sentiment analyses.







**Video:** The Coca\-Cola Co., 1971, [“Hilltop” commercial](https://www.youtube.com/watch?v=C2406n8_rUw) featuring the famous “*I’d Like to Buy the World a Coke*” song.

**Descriptive Tags:** music, singing, group, harmony, joy, happiness, celebration, youth, love, friendship, unity, nature, outdoors, sunny, vintage, retro, 1960s, fashion, soda, Coca\-Cola

**Natural Language Description:** “*The video features a group of young people standing together, singing, and smiling at the camera. The scene is set in a brightly lit outdoor area, with a clear blue sky and trees in the background. The group consists of men and women, dressed in colorful, casual clothing. The camera angle is slightly elevated, capturing the group from the chest up. The audio is clear, with the voices of the singers audible and the background noise minimal. The group’s joyful and energetic expressions, with wide smiles and open mouths, suggesting a lively and upbeat atmosphere. The camera captures the group’s movements as they sing, with some individuals looking off to the side and others looking directly at the camera. The overall mood of the video is cheerful and communal, with the group’s energy and the bright surroundings contributing to a sense of unity and shared enjoyment.*”

**Sentiment Analysis:** “*The video presents a group of individuals, predominantly young adults, standing together in a field with a clear blue sky in the background. The overall emotional tone is positive and joyful, with a sense of unity and camaraderie. The warm color palette and bright lighting contribute to the cheerful atmosphere, while the visual symbolism of the open field and clear sky suggests a sense of freedom and openness. The narrative revolves around a shared experience, with the individuals coming together and enjoying each other’s company. The audio features lively and upbeat background music, enhancing the overall positive mood. The pacing is steady and unhurried, allowing for a relaxed and enjoyable viewing experience.*”


## Introduction

There is significant interest in using AI and, more recently, Generative AI to aid in visual content analysis — images, videos, advertising, and creative content. AI is often used to analyze visual content for several reasons:

* Processing and categorizing large volumes of visual content, extracting metadata for search applications, saving time and human resources;
* Detecting and recognizing objects, faces, products, brands, logos, text, and patterns, enabling automated tagging and organization;
* Assessing image and video quality, identifying issues like blurriness or poor lighting;
* Content moderation, flagging inappropriate, sensitive, or trademarked material in visual content;
* Analyzing advertising effectiveness, measuring brand exposure, and gauging audience engagement;
* Enabling visual search capabilities, allowing users to find similar images or products;
* Extracting valuable insights from visual data, such as customer sentiment and behavior in retail environments;

In the following post, we will learn how to leverage state\-of\-the\-art (SoTA) machine learning models to batch\-process collections of images and videos and generate different types of output:

* **Descriptive tags**: List of unique words and short phrases that characterize the visual asset;
* **Captions**: Multilingual natural language descriptions of the visual asset;
* **Sentiment analysis**: Interpretation of the overall emotional tone, mood, and underlying sentiment of the visual asset;

For this task, we will utilize open\-weight models, all available on [Hugging Face](https://huggingface.co/), including:

* **Image captioning**: 4\-bit and 8\-bit quantized versions of Meta’s latest [Llama 3\.2 11B Vision Instruct](https://huggingface.co/meta-llama/Llama-3.2-11B-Vision-Instruct) LLM;
* **Video captioning**: [LLaVA\-Next\-Video 7B](https://huggingface.co/llava-hf/LLaVA-NeXT-Video-7B-hf) SoTA fine\-tuned LLM with image and video understanding capabilities;
* **Machine translation**: Facebook’s [distilled 600M parameter variant of the NLLB\-200](https://huggingface.co/facebook/nllb-200-distilled-600M) mixture\-of\-experts (MoE) machine translation model;

Although we could use variations of the Llama\-3\.2–11B\-Vision\-Instruct model to generate image descriptions in multiple languages, we would end up with different descriptions in different languages instead of a single description translated into multiple languages.


## Model Hosting

Many options are available for hosting these open\-weight models for inference, both locally or in the Cloud. I will work locally for this post, hosting the models on an NVIDIA GPU\-based Intel Core i9 Windows 11 workstation with 16 GB of GDDR6X memory (VRAM). [PyTorch](https://pytorch.org/) (2\.4\.1\+cu124\), [CUDA](https://docs.nvidia.com/cuda/cuda-installation-guide-microsoft-windows/index.html) (12\.4\), and [Flash Attention 2](https://arxiv.org/abs/2307.08691) are installed and configured. According to [NVIDIA](https://docs.nvidia.com/cuda/cuda-installation-guide-microsoft-windows/index.html), CUDA (Compute Unified Device Architecture) is a parallel computing platform and programming model that NVIDIA invented. It enables dramatic increases in computing performance by harnessing the power of the graphics processing unit (GPU). [FlashAttention](https://arxiv.org/abs/2205.14135) is an algorithm that speeds up attention and reduces its memory footprint without approximation. [FlashAttention\-2](https://arxiv.org/abs/2307.08691) aims to achieve even faster attention with better parallelism and work partitioning; this will be used to accelerate video captioning.




### Model Quantization

According to sources, the full\-precision Llama 3\.2 11B Vision Instruct LLM requires a high\-end GPU with at least 22 GB VRAM for efficient inference. Locally, this would minimally require a top\-tier [NVIDIA RTX 4090](https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4090/) graphics card with 24 GB VRAM. We could also access this model on several Cloud provider’s platforms, including [Amazon Bedrock](https://aws.amazon.com/bedrock/llama/) (shown below), or hosted on [Amazon SageMaker](https://aws.amazon.com/sagemaker/) using an [Amazon EC2 G5 instance](https://aws.amazon.com/ec2/instance-types/g5/) or equivalent, also with 24 GB VRAM.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*MVkT5w0NNtwJ_34yiqlZfA.png)

To reduce the compute requirements for this post, we will use two different [quantized versions](https://pytorch.org/docs/stable/quantization.html) of the Llama 3\.2 11B Vision model, both available on Hugging Face:

* [**SeanScripts/Llama\-3\.2–11B\-Vision\-Instruct\-nf4**](https://huggingface.co/SeanScripts/Llama-3.2-11B-Vision-Instruct-nf4): According to the model card, this model was converted from [meta\-llama/Llama\-3\.2–11B\-Vision\-Instruct](https://huggingface.co/meta-llama/Llama-3.2-11B-Vision-Instruct) using Hugging Face’s [bitsandbytes](https://huggingface.co/docs/bitsandbytes/main/en/index) with NF4 (4\-bit) quantization and require `bitsandbytes` to load. Hugging Face’s bitsandbytes enables accessible large language models via k\-bit quantization for PyTorch. The model does not use double quantization.
* [**neuralmagic/Llama\-3\.2–11B\-Vision\-Instruct\-FP8\-dynamic**](https://huggingface.co/neuralmagic/Llama-3.2-11B-Vision-Instruct-FP8-dynamic)**:** According to the model card, this model was obtained by quantizing the weights and activations of [Llama\-3\.2–11B\-Vision\-Instruct](https://huggingface.co/meta-llama/Llama-3.2-11B-Vision-Instruct) to the FP8 data type, ready for inference with [vLLM](https://github.com/vllm-project/vllm) built from source. This optimization reduces the number of bits per parameter from 16 to 8, reducing the disk size and GPU memory requirements by approximately 50%. [LLM Compressor](https://github.com/vllm-project/llm-compressor) is used for quantization.

On my workstation, 4\-bit `SeanScripts/Llama-3.2–11B-Vision-Instruct-nf4` model is 7\.6 GB in size and consumes approximately 11\.5 GB of the available dedicated 16 GB of VRAM. The larger 8\-bit `neuralmagic/Llama-3.2–11B-Vision-Instruct-FP8-dynamic` model is 15\.6 GB and consumes approximately 14\.8 GB of VRAM when running alongside the `facebook/nllb-200-distilled-600M` model (see below).

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*_zoXWK1ggaqQ_STk_f6CTw.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*AIWZqxrpN7avU8JTkER0MQ.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*QjQwMkybRz3NSjniBb3VkA.png)


## Machine Translation

Using either of the two quantized models detailed above, we will generate a natural language description of each image or video in English. Once we have the English description, we will use Facebook’s (now Meta) [distilled 600M parameter variant of the NLLB\-200](https://huggingface.co/facebook/nllb-200-distilled-600M) mixture\-of\-experts (MoE) machine translation model. According to Hugging Face, NLLB\-200 allows for single\-sentence translation between 200 languages. On my workstation, the `facebook/nllb-200-distilled-600M` model is 2\.5 GB in size and consumes approximately 2\.8 GB of the available dedicated 16 GB of VRAM.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*_RtWMfyyuo_QmVqa7CBMPg.png)

They also note that `facebook/nllb-200-distilled-600M` is a research model and not released for production deployment. NLLB\-200 is trained on general domain text data and is not intended to be used with domain\-specific texts, such as medical or legal domains. The model is not intended to be used for document translation. The model was trained with input lengths not exceeding 512 tokens (we are limiting source English descriptions to a maximum of 300 tokens); therefore, translating longer sequences might result in quality degradation. NLLB\-200 translations cannot be used as certified translations.

The Flores\-200 dataset is recommended for evaluation of NLLB\-200\. Conveniently, The FLORES\+ evaluation benchmark for multilingual machine translation repository on [GitHub](https://github.com/openlanguagedata/flores) contains a list of all 200 [language codes](https://github.com/openlanguagedata/flores), which we will use to indicate the languages we want to translate the English descriptions into, such as French (`fra_Latn`), Spanish (`spa_Latn`), or Hindi (`hin_Deva`).


## Prerequisites

First, ensure you have installed the free [Visual Studio Build Tools](https://visualstudio.microsoft.com/vs/community/) related to C\+\+.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*HTampjzvPxls5VuVjn-tWw.png)


### Models

Optionally, I chose to pre\-cached the models in this post locally using the [huggingface\-cli](https://huggingface.co/docs/huggingface_hub/en/guides/cli). The huggingface\_hub library allows you to interact with the [Hugging Face Hub](https://hf.co/). The huggingface\_hub Python package comes with a built\-in CLI called huggingface\-cli. This tool lets you interact directly with the Hugging Face Hub from a terminal. If you don’t cache the models in advance, they will be downloaded into the local cache the first time the application loads them.


```python
python -m pip install "huggingface_hub[cli]" --upgrade

huggingface-cli login --token %HUGGINGFACE_TOKEN% --add-to-git-credential

huggingface-cli download SeanScripts/Llama-3.2-11B-Vision-Instruct-nf4
```

### Python 3 Virtual Environment with pip

The `requirements.txt` file containing all the dependencies:


```python
accelerate
av
bitsandbytes
compressed-tensors
numpy
pillow
protobuf
requests
transformers
transformers[sentencepiece]
```
The commands to use Python 3 with `pip` for creating a virtual environment and installing packages for this post:


```python
python -m venv .venv
.venv\Scripts\activate

set USE_FLASH_ATTENTION=1
pip install pip --upgrade
pip uninstall torch torchvision torchaudio -y
pip install -r requirements.txt --upgrade
pip install torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cu124
pip install build cmake ninja wheel --upgrade
pip install flash-attn --no-build-isolation
```

### Anaconda Virtual Environment with pip

The commands to use [Anaconda](https://www.anaconda.com/) with `pip` for creating a virtual environment and installing packages for this post:


```python
python --version
conda create --name .conda_env python=3.12.4 --yes
conda activate .conda_env

python --version
conda create --name .conda_env python=3.12.4 --yes
conda activate .conda_env

set USE_FLASH_ATTENTION=1
pip install pip --upgrade
pip uninstall torch torchvision torchaudio -y
pip install -r requirements.txt --upgrade
pip install torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cu124
pip install build cmake ninja wheel --upgrade
pip install flash-attn --no-build-isolation
```

## Image Captioning

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*nzLR4Vlf_vdjKpqAnyCTkg.png)

We will start with image captioning and then video captioning. I have written a Python 3 script for batch image captioning and machine translation, `image_batch_translate.py`. The script allows you to select the 8\-bit `neuralmagic/Llama-3.2–11B-Vision-Instruct-FP8-dynamic` or 4\-bit `SeanScripts/Llama-3.2–11B-Vision-Instruct-nf4` models. Since the same translation function will also be used to caption the videos, I have separated the translation functionality into a separate `Translator` class, `translator.py`, and instantiate an instance of the class in the main image captioning script.


```python
"""
Batch process a directory of images, generating a natural language description of each image 
using the 4- and 8-bit quantized versions of Llama-3.2-11B-Vision-Instruct
Author: Gary A. Stafford
Date: 2024-10-05
"""

import os
import time
import json
import logging

import imageProcessor
import translator

## Constants
VISION_MODELS = [
    "neuralmagic/Llama-3.2-11B-Vision-Instruct-FP8-dynamic",
    "SeanScripts/Llama-3.2-11B-Vision-Instruct-nf4",
]
MODEL_NAME = VISION_MODELS[1]
TEMPERATURE = 0.3
MAX_NEW_TOKENS = 300
IMAGE_DIR = "input\\ad_images"
OUTPUT_FILE = "output\\image_output_translations.json"
PROMPT = """<|begin_of_text|><|start_header_id|>user<|end_header_id|>

<|image|>Analyze the given image and generate a concise description in 2-3 paragraphs. 
Your description should capture the essence of the image, including its visual elements, colors, mood, style, and overall impact. 
Aim for a comprehensive yet succinct narrative that gives readers a clear mental picture of the image.

Consider the following aspects in your description:

1. Subject Matter:
   - Main focus or subject(s) of the image
   - Background and setting
   - Any notable objects or elements

2. Visual Composition:
   - Arrangement and framing of elements
   - Use of perspective and depth
   - Balance and symmetry (or lack thereof)

3. Color and Lighting:
   - Dominant colors and overall palette
   - Quality and direction of light
   - Shadows and highlights
   - Contrast and saturation

4. Texture and Detail:
   - Surface qualities of objects
   - Level of detail or abstraction
   - Patterns or repetitions

5. Style and Technique:
   - Artistic style (e.g., realistic, impressionistic, abstract)
   - Medium used (e.g., photograph, painting, digital art)
   - Notable artistic or photographic techniques

6. Mood and Atmosphere:
   - Overall emotional tone
   - Symbolic or metaphorical elements
   - Sense of time or place evoked

7. Context and Interpretation:
   - Potential meaning or message
   - Cultural or historical references, if apparent
   - Viewer's potential emotional response

Guidelines:
- Write in clear, engaging prose.
- Balance objective description with subjective interpretation.
- Prioritize the most significant and distinctive elements of the image.
- Use vivid, specific language to paint a picture in the reader's mind.
- Maintain a flowing narrative that connects different aspects of the image.
- Limit your response to 2-3 paragraphs.

Your description should weave together these elements to create a cohesive and evocative portrayal of the image, 
allowing readers to visualize it clearly without seeing it themselves.<|eot_id|><|start_header_id|>assistant<|end_header_id|>"""


## Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)


def main() -> None:
    """
    Main function to process images and generate descriptions and translations.
    """
    image_processor = imageProcessor.ImageProcessor(MODEL_NAME)
    translate = translator.Translator()
    results = {"descriptions": [], "stats": {}}

    tt0 = time.time()

    for image_file in os.listdir(IMAGE_DIR):
        logging.info(f"Processing {image_file}...")

        t0 = time.time()

        image_path = os.path.join(IMAGE_DIR, image_file)
        if not image_path.lower().endswith((".png", ".jpg", ".jpeg")):
            continue

        inputs = image_processor.process_image(image_path, PROMPT)
        prompt_tokens = len(inputs["input_ids"][0])

        generate_ids, total_time = image_processor.generate_response(
            inputs, TEMPERATURE, MAX_NEW_TOKENS
        )
        description, generated_tokens, total_time, _ = image_processor.prepare_results(
            generate_ids, prompt_tokens, total_time
        )

        translation_spanish = translate.translate_text(description, "spa_Latn")
        translation_french = translate.translate_text(description, "fra_Latn")
        translation_hindi = translate.translate_text(description, "hin_Deva")

        t1 = time.time()
        total_processing_time = round(t1 - t0, 3)
        logging.info(f"Total processing time: {total_processing_time} seconds")

        image_result = {
            "image_file": image_file,
            "description_english": description,
            "translation_spanish": translation_spanish,
            "translation_french": translation_french,
            "translation_hindi": translation_hindi,
            "generated_tokens": generated_tokens,
            "description_generation_time_sec": round(total_time, 3),
            "total_processing_time_sec": round(total_processing_time, 3),
        }

        results["descriptions"].append(image_result)

        logging.info(f"Description: {description}")

    tt1 = time.time()
    total_batch_time = round(tt1 - tt0, 3)

    file_count = len(os.listdir(IMAGE_DIR))

    results["stats"] = {
        "model": MODEL_NAME,
        "temperature": TEMPERATURE,
        "total_batch_time_sec": total_batch_time,
        "total_images": file_count,
        "average_time_per_image_sec": round(total_batch_time / file_count, 3),
    }

    with open(OUTPUT_FILE, "w") as f:
        json.dump(results, f, indent=4)


if __name__ == "__main__":
    main()
```
The main image processing functions, used for all types of generated outputs, have been separated into the `ImageProcessor` class, `imageProcessor.py`.


```python
"""
Batch process a directory of images, generating a some form of an analysis of each image 
using the 4- and 8-bit quantized versions of Llama-3.2-11B-Vision-Instruct
Author: Gary A. Stafford
Date: 2024-10-05
"""

import time
import logging

from PIL import Image
import torch
from transformers import MllamaForConditionalGeneration, AutoProcessor


## Constants
DEVICE = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

## Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)


class ImageProcessor:
    def __init__(self, model_name: str):
        self.model_name = model_name
        self.model = self.load_model()
        self.processor = self.load_processor()

    def load_model(self) -> MllamaForConditionalGeneration:
        """
        Load the model for conditional generation.

        Args:
            model_id (str): The model ID to load.

        Returns:
            MllamaForConditionalGeneration: The loaded model.
        """
        return MllamaForConditionalGeneration.from_pretrained(
            self.model_name,
            use_safetensors=True,
            torch_dtype="auto",
            device_map=DEVICE,
            attn_implementation="sdpa",
        ).to(DEVICE)

    def load_processor(self) -> AutoProcessor:
        """
        Load the processor for the model.

        Args:
            model_id (str): The model ID to load the processor for.

        Returns:
            AutoProcessor: The loaded processor.
        """
        return AutoProcessor.from_pretrained(self.model_name)

    def process_image(self, image_path: str, prompt: str) -> dict:
        """
        Process the image and prepare inputs for the model.

        Args:
            image_path (str): The path to the image file.
            prompt (str): The prompt to use for the model.
            model_device (str): The device to use for the model.

        Returns:
            dict: The processed inputs.
        """
        model_device = self.model.device
        image = Image.open(image_path).convert("RGB")
        inputs = self.processor(image, prompt, return_tensors="pt").to(model_device)
        return inputs

    def generate_response(
        self, inputs: dict, temperature: float, max_new_tokens: int
    ) -> tuple:
        """
        Generate a response based on the image content.

        Args:
            inputs (dict): The inputs for the model.
            temperature (float): The temperature to use for generation.
            max_new_tokens (int, optional): The maximum number of new tokens to generate. Defaults to 256.

        Returns:
            tuple: The generated IDs and the total time taken for generation.
        """
        t0 = time.time()
        generate_ids = self.model.generate(
            **inputs, max_new_tokens=max_new_tokens, temperature=temperature
        )
        t1 = time.time()
        total_time = t1 - t0
        return generate_ids, total_time

    def prepare_results(
        self, generate_ids: dict, prompt_tokens: int, total_time: float
    ) -> tuple:
        """
        Prepare the results from the generated IDs.

        Args:
            generate_ids (dict): The generated IDs.
            prompt_tokens (int): The number of prompt tokens.
            total_time (float): The total time taken for generation.

        Returns:
            tuple: The output description, the number of generated tokens, the total time, and the time per token.
        """
        output = self.processor.decode(generate_ids[0][prompt_tokens:]).replace(
            "<|eot_id|>", ""
        )
        generated_tokens = len(generate_ids[0]) - prompt_tokens
        time_per_token = total_time / generated_tokens
        return output, generated_tokens, total_time, time_per_token
```
Here is the `Translator` class, `translator.py`, which uses the 2\.5 GB `facebook/nllb-200-distilled-600M` model for both tokenization and translation.


```python
"""
Translator class for translating text using the Facebook (Meta) NLLB-200 distilled 600M variant model
https://huggingface.co/facebook/nllb-200-distilled-600M
Author: Gary A. Stafford
Date: 2024-10-05
"""

import logging

import torch
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

MODEL_ID_TRANSLATE = "facebook/nllb-200-distilled-600M"
MODEL_ID_TOKENIZER = "facebook/nllb-200-distilled-600M"
TEMPERATURE = 0.3
MAX_NEW_TOKENS = 300
DEVICE = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

## Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)


class Translator:
    """
    A class used to translate text using a pre-trained sequence-to-sequence language model.

    Methods
    -------
    __init__():
        Initializes the Translator with a tokenizer and a translation model.

    translate_text(text: str, language: str = "eng_Latn") -> str:
        Translates the given text to the specified language.
    """

    def __init__(self):
        self.model = (
            AutoModelForSeq2SeqLM.from_pretrained(
                "facebook/nllb-200-distilled-600M",
                torch_dtype=torch.float16,
                attn_implementation="flash_attention_2",
            )
            .to(DEVICE)
            .eval()
        )

        self.tokenizer = AutoTokenizer.from_pretrained(
            "facebook/nllb-200-distilled-600M"
        )

    def translate_text(self, text, language="eng_Latn") -> str:
        logging.info(f"Translating text to: {language}...")

        inputs = self.tokenizer(
            text, return_tensors="pt", padding=True, truncation=True
        ).to(DEVICE)

        translated_tokens = self.model.generate(
            **inputs,
            forced_bos_token_id=self.tokenizer.convert_tokens_to_ids(language),
            max_length=MAX_NEW_TOKENS,
            do_sample=True,
            temperature=TEMPERATURE,
        )
        response = self.tokenizer.batch_decode(
            translated_tokens, skip_special_tokens=True
        )[0]

        return response
```
The script iterates over the directory of images. It opens each image file and converts it to the RGB color space, a standard color model used in digital imaging. The `Image.open` function is part of the Python Imaging Library (PIL), commonly used for opening, manipulating, and saving many different image file formats. This conversion is necessary because many image processing algorithms and models expect input images to be in RGB format. This script then prepares the image for input into the machine\-learning model. The `processor` function takes the image and a `prompt` and returns the processed data as tensors, the central data abstraction in PyTorch. The `return_tensors="pt"` argument specifies that the output should be in PyTorch tensor format, commonly used in deep learning frameworks. Finally, the `.to(DEVICE)` method moves the processed tensors to the specified device, the NVIDIA GPU with CUDA enabled.

The `generate_description` function calls the 4\-bit quantized `SeanScripts/Llama-3.2–11B-Vision-Instruct-nf4` model to generate a textual description for an image. It takes the model, inputs, temperature, and maximum number of new tokens as parameters and returns the generated description. The function uses the `transformers` `MllamaForConditionalGeneration` class, whose Mllama model consists of a vision encoder and a language model.

The Hugging Face [Transformers](https://huggingface.co/docs/transformers/en/index) library, which, according to Hugging Face, supports framework interoperability between PyTorch, TensorFlow, and JAX, provides the flexibility to use a different framework at each stage of a model’s life. For example, train a model in three lines of code in one framework and load it for inference in another. The Transformers library provides APIs and tools to easily download and train state\-of\-the\-art pre\-trained models.


### Image Captioning Example

I collected 15 small PNG images from online digital advertisements on the Microsoft Edge home page.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Y0n7b7EDjX33pe0HpJw7OQ.png)

The images represent various consumer advertisements, including travel, hard goods, debt relief, credit cards, and investing.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*m8iZoQPLY4y6la4lhXgVsA.png)

Let’s examine the results of an analysis of the first image above, which shows a red sticky note that reads “BYE BYE CREDIT CARD DEBT” in front of a residential home.

The output from the script, `image_batch_translate.py`, is a complex JSON object containing the 15 image descriptions. With each description, I have included stats: number of generated tokens (e.g., 222\), timing of the English description generation (e.g., 11\.863s), and timing for the entire process of captioning and creating three translations (e.g., 37\.432s). In addition, I have included stats for the overall batch: model (e.g., `SeanScripts/Llama-3.2–11B-Vision-Instruct-nf4`), temperature (e.g., 0\.3\), total batch time (e.g., 9m25s), number of images processed (15\), and average time per image (e.g., 37\.661s).


```python
{
  "descriptions": [
    {
      "image_file": "test_image_01.jpg",
      "description_english": "The image depicts a house with a red sign in front of it, featuring the text \"BYE BYE CREDIT CARD DEBT\" in black letters. The house is a single-story structure with a gray roof and white trim, constructed from brown brick or stone. A covered porch with white columns runs along the front of the house, accompanied by a window on the left side and a door on the right.\n\nIn the foreground, the red sign dominates the scene, with the text written in a playful, handwritten font. The sign's bright red color stands out against the more subdued tones of the house. The background of the image features trees and greenery, suggesting a peaceful and natural setting.\n\nThe overall mood of the image is one of celebration and liberation, as the sign's message implies a sense of freedom from financial burdens. The use of a bright red color for the sign adds to this feeling, conveying a sense of joy and optimism. The image appears to be a lighthearted and humorous take on the idea of paying off debt, rather than a serious or somber depiction.",
      "translation_spanish": "La imagen representa una casa con un letrero rojo en su frente, con el texto \"BYE BYE CREDIT CARD DEBT\" en letras negras. La casa es una estructura de un piso con un techo gris y un acabado blanco, construido de ladrillo o piedra marrón. Un porche cubierto con columnas blancas corre a lo largo de la parte frontal de la casa, acompañado de una ventana en el lado izquierdo y una puerta en el derecho. En primer plano, el letrero rojo domina la escena, con el texto escrito en una fuente de colores divertidos escritos a mano. El color rojo brillante de la señal destaca contra los tonos más suaves de la casa. El sentido de la imagen presenta árboles y verdura, sugiriendo un entorno pacífico y natural. El humor general de la imagen es uno de la celebración y la liberación, ya que el mensaje del mensaje implica un signo de libertad de uso de la deuda, pero el color rojo parece ser un sentimento de alegría o un sentido de humor, que permite que la imagen sea más positiva, y el sentimiento de alegría se despliegue para una imagen, o un sentimiento de alegría positiva y de alegría para un sentimento positivo.",
      "translation_french": "L'image représente une maison avec un panneau rouge devant elle, avec le texte \"BYE BYE CREDIT CARD DEBT\" en lettres noires. La maison est une structure à étage unique avec un toit gris et un décor blanc, construit à partir de briques ou de pierres brunes. Un porche couvert avec des colonnes blanches s'étend le long de l'avant de la maison, accompagné d'une fenêtre du côté gauche et d'une porte à droite.",
      "translation_hindi": "छवि में एक लाल चिह्न के साथ एक घर का चित्रण किया गया है, जिसमें काले अक्षरों में \"BYE BYE CREDIT CARD DEBT\" शब्द लिखा है। यह घर भूरे रंग की छत और सफेद सजावट वाली एक मंजिला संरचना है, जिसे ब्राउन ईंट या पत्थर से बनाया गया है। घर के सामने एक सफेद कॉलम वाली एक ढक्कन है, जिसके साथ बाईं ओर एक खिड़की और दाईं ओर एक दरवाजा है। अग्रभूमि में, लाल चिह्न दृश्य पर हावी है, जिसमें एक रंगीन, हाथ से लिखे गए फ़ॉन्ट में लिखा गया है। चिह्न की उज्ज्वल लाल रंग घर के अधिक विनम्र स्वरों के खिलाफ बाहर खड़ा है। छवि की भावना में पेड़ और हरियाली है, जो एक शांत और प्राकृतिक सेटिंग का सुझाव देती है। छवि का समग्र मूड उत्सव और मुक्ति का एक है, क्योंकि संदेश का अर्थ है कि एक स्पष्ट रूप से स्पष्ट रूप से एक स्पष्ट भावना का उपयोग करना, एक स्पष्ट भावना का उपयोग करना और एक स्पष्ट रूप से स्पष्ट रूप से सकारात्मक भावना का उपयोग करना।",
      "generated_tokens": 222,
      "description_generation_time_sec": 11.863,
      "total_processing_time_sec": 37.432
    },
    {...}
  ],
  "stats": {
    "model": "SeanScripts/Llama-3.2-11B-Vision-Instruct-nf4",
    "temperature": 0.3,
    "total_batch_time_sec": 564.917,
    "total_images": 15,
    "average_time_per_image_sec": 37.661
  }
}
```
Above, we see the English description of the image generated by the 4\-bit `SeanScripts/Llama-3.2–11B-Vision-Instruct-nf4 model`, followed by the French, Spanish, and Hindi translations. The generated English description of the image is remarkably detailed:

“*The image depicts a house with a red sign in front of it, featuring the text “BYE BYE CREDIT CARD DEBT” in black letters. The house is a single\-story structure with a gray roof and white trim, constructed from brown brick or stone. A covered porch with white columns runs along the front of the house, accompanied by a window on the left side and a door on the right.*

*In the foreground, the red sign dominates the scene, with the text written in a playful, handwritten font. The sign’s bright red color stands out against the more subdued tones of the house. The background of the image features trees and greenery, suggesting a peaceful and natural setting.*

*The overall mood of the image is one of celebration and liberation, as the sign’s message implies a sense of freedom from financial burdens. The use of a bright red color for the sign adds to this feeling, conveying a sense of joy and optimism. The image appears to be a lighthearted and humorous take on the idea of paying off debt, rather than a serious or somber depiction.”*

For comparison, here is an English description of the same image generated with the 8\-bit quantized `Llama-3.2–11B-Vision-Instruct-FP8-dynamic` model:

“*The image depicts a red sign with handwritten text, prominently displayed in front of a house. The sign, which appears to be made of construction paper or a similar material, features the phrase “BYE BYE CREDIT CARD DEBT” in black marker.*

*The sign is positioned in the foreground of the image, drawing attention to its message. In the background, a one\-story house with a gray roof and brown brick exterior is visible, complete with a covered porch and a glass front door. The house is surrounded by trees and bushes, adding a touch of natural beauty to the scene.*

*Overall, the image suggests that the person who created the sign has taken a significant step towards financial freedom by eliminating their credit card debt. The use of a bold, eye\-catching sign and a peaceful suburban setting creates a sense of triumph and celebration, implying that the individual is now free from the burden of debt and can focus on building a more secure financial future.*”

For the batch of 15 videos, the average inference time for the 8\-bit model was 8\.5x slower than that for the 4\-bit model, 68\.741s compared to 8\.09s. This is a significant increase in processing time and cost, especially if the difference in description quality is negligible.


## Video Captioning

Next, we will examine video captioning using the 14\.1 GB `llava-hf/LLaVA-NeXT-Video-7B-hf` model. I have written a Python 3 script for batch video captioning and machine translation, `video_batch_translate.py`. This script also instantiates an instance of the `Translator` class.


```python
"""
Batch process a directory of videos, generating a natural language description 
of each video using the LLaVA-NeXT-Video-7B model.
https://huggingface.co/docs/transformers/main/model_doc/llava_next_video
Author: Gary A. Stafford
Date: 2024-10-05
"""

import json
import logging
import os
import time

import videoProcessor
import translator

## Constants
MODEL_NAME = "llava-hf/LLaVA-NeXT-Video-7B-hf"
TEMPERATURE = 0.3
MAX_NEW_TOKENS = 300
VIDEO_DIR = "commercials"
OUTPUT_FILE = "output/video_output_descriptions.json"
PROMPT = """Analyze the given video and generate a concise description in 2-3 paragraphs. 
Your description should capture the essence of the video, including visual elements, audio content, and non-verbal communication. 
Aim for a comprehensive yet succinct narrative that gives readers a clear understanding of the video's content and style.

Consider the following aspects in your description:

1. Visual Content:
   - Setting and environment
   - Main characters or subjects
   - Key actions and events
   - Visual style and aesthetics

2. Audio Elements:
   - Dialogue themes or narration
   - Music and its mood
   - Significant sound effects
   - Overall audio atmosphere

3. Non-verbal Communication:
   - Emotions conveyed
   - Body language and gestures
   - Symbolic or metaphorical elements

4. Technical Aspects:
   - Filming techniques
   - Editing style
   - Special effects (if any)

5. Narrative and Theme:
   - Main message or story
   - Genre or type of video
   - Target audience
   - Overall mood or tone

Guidelines:
- Write in clear, engaging prose.
- Prioritize the most significant and distinctive elements of the video.
- Balance concrete details with broader observations about style and theme.
- Maintain a neutral, descriptive tone.
- Limit your response to 2-3 paragraphs.

Your description should flow naturally, weaving together various elements to create a cohesive overview of the video. 
Focus on painting a vivid picture that allows readers to envision the video without seeing it."""

## Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)

def main() -> None:
    """
    Main function to orchestrate the workflow.
    """

    video_processor = videoProcessor.VideoProcessor(
        MODEL_NAME, TEMPERATURE, MAX_NEW_TOKENS, PROMPT
    )
    containers = video_processor.load_videos(VIDEO_DIR)
    translate = translator.Translator()
    results = {"descriptions": [], "stats": {}}

    tt0 = time.time()

    for container in containers:
        logging.info(f"Processing {container.name}...")

        t0 = time.time()

        video_stream = container.streams.video[0]
        size = round(container.size / 1024 / 1024, 3)
        duration = round(video_stream.duration * video_stream.time_base)
        processed_frames = video_processor.process_video(container)
        response = video_processor.generate_response(processed_frames)
        description = video_processor.extract_answer(response)
        logging.info(f"Response: {description}")

        translation_spanish = translate.translate_text(description, "spa_Latn")
        translation_french = translate.translate_text(description, "fra_Latn")
        translation_hindi = translate.translate_text(description, "hin_Deva")

        t1 = time.time()
        total_processing_time = round(t1 - t0, 3)
        logging.info(f"Total processing time: {total_processing_time} seconds")

        video_result = {
            "video_file": container.name,
            "video_size_mb": size,
            "video_duration_sec": duration,
            "video_fps": round(video_stream.base_rate),
            "video_frames": video_stream.frames,
            "video_width": video_stream.width,
            "video_height": video_stream.height,
            "description_english": description,
            "translation_spanish": translation_spanish,
            "translation_french": translation_french,
            "translation_hindi": translation_hindi,
            "total_processing_time_sec": total_processing_time,
        }

        results["descriptions"].append(video_result)

    tt1 = time.time()
    total_batch_time = round(tt1 - tt0, 3)

    file_count = len(os.listdir(VIDEO_DIR))

    results["stats"] = {
        "model": MODEL_NAME,
        "temperature": TEMPERATURE,
        "total_batch_time_sec": total_batch_time,
        "total_videos": file_count,
        "average_time_per_video_sec": round(total_batch_time / file_count, 3),
    }

    logging.info(results["stats"])

    with open(OUTPUT_FILE, "w") as f:
        json.dump(results, f, indent=4)


if __name__ == "__main__":
    main()
```
The main video processing functions, used for all types of generated outputs, have been separated into the `VideoProcessor`class, `videoProcessor.py`.


```python
"""
Batch process a directory of videos, generating a some form of an analysis
of each video using the LLaVA-NeXT-Video-7B model.
https://huggingface.co/docs/transformers/main/model_doc/llava_next_video
Author: Gary A. Stafford
Date: 2024-10-05
"""

import logging
import os
import re

import av
import numpy as np
from transformers import LlavaNextVideoForConditionalGeneration, LlavaNextVideoProcessor
from transformers.utils import is_flash_attn_2_available

## Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)


class VideoProcessor:
    def __init__(
        self, model_name: str, temperature: float, max_new_tokens: int, prompt: str
    ):
        self.model_name = model_name
        self.temperature = temperature
        self.max_new_tokens = max_new_tokens
        self.prompt = prompt
        self.model = self.load_model()
        self.processor = self.load_processor()

    def read_video_pyav(
        self, container: av.container.input.InputContainer, indices: list[int]
    ) -> np.ndarray:
        """
        Decode the video with PyAV decoder.
        Args:
            container (`av.container.input.InputContainer`): PyAV container.
            indices (`List[int]`): List of frame indices to decode.
        Returns:
            result (np.ndarray): np array of decoded frames of shape (num_frames, height, width, 3).
        """
        frames = []
        container.seek(0)
        start_index = indices[0]
        end_index = indices[-1]
        for i, frame in enumerate(container.decode(video=0)):
            if i > end_index:
                break
            if i >= start_index and i in indices:
                frames.append(frame)
        decoded_frames = np.stack([x.to_ndarray(format="rgb24") for x in frames])
        return decoded_frames

    def load_model(self) -> LlavaNextVideoForConditionalGeneration:
        """
        Load the LlavaNextVideo model.
        Returns:
            model (LlavaNextVideoForConditionalGeneration): Loaded model.
        """
        return LlavaNextVideoForConditionalGeneration.from_pretrained(
            self.model_name,
            use_safetensors=True,
            torch_dtype="auto",
            device_map="cuda:0",
            attn_implementation=(
                "flash_attention_2" if is_flash_attn_2_available() else "sdpa"
            ),
        ).to("cuda")

    def load_processor(self) -> LlavaNextVideoProcessor:
        """
        Load the LlavaNextVideo processor.
        Returns:
            processor (LlavaNextVideoProcessor): Loaded processor.
        """
        processor = LlavaNextVideoProcessor.from_pretrained(self.model_name)
        processor.patch_size = 16
        processor.vision_feature_select_strategy = "default"
        return processor

    def load_videos(self, directory: str) -> list[av.container.input.InputContainer]:
        """
        Load all videos from the specified directory.
        Args:
            directory (str): Path to the directory containing video files.
        Returns:
            containers (list[av.container.input.InputContainer]): List of loaded video containers.
        """
        containers = []
        for filename in os.listdir(directory):
            if filename.endswith(".mp4"):
                filepath = os.path.join(directory, filename)
                container = av.open(filepath)
                containers.append(container)
        return containers

    def process_video(self, container: av.container.input.InputContainer) -> np.ndarray:
        """
        Process the video to extract frames.
        Args:
            container (`av.container.input.InputContainer`): PyAV container.
        Returns:
            video (np.ndarray): Processed video frames.
        """
        video_stream = container.streams.video[0]
        indices = np.arange(0, video_stream.frames, video_stream.frames / 8).astype(int)
        processed_frames = self.read_video_pyav(container, indices)
        return processed_frames

    def generate_response(self, video: np.ndarray) -> str:
        """
        Generate a response based on the video content.
        Args:
            video (np.ndarray): Processed video frames.
        Returns:
            answer (str): Generated response.
        """
        conversation = [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": self.prompt},
                    {"type": "video"},
                ],
            },
        ]
        prompt = self.processor.apply_chat_template(
            conversation, add_generation_prompt=True
        )
        inputs = self.processor(text=prompt, videos=video, return_tensors="pt").to(
            self.model.device
        )
        out = self.model.generate(
            **inputs,
            max_new_tokens=self.max_new_tokens,
            do_sample=True,
            temperature=self.temperature
        )
        response = self.processor.batch_decode(
            out, skip_special_tokens=True, clean_up_tokenization_spaces=True
        )
        return response

    def extract_answer(self, answer: str) -> str:
        """
        Extract and log the assistant's response from the generated answer.
        Args:
            answer (str): The generated response.
        Returns:
            assistant_value (str): The assistant's response.
        """
        match = re.search(r"ASSISTANT: (.*)", answer[0])
        if match:
            assistant_value = match.group(1)
        else:
            assistant_value = "No match found."

        return assistant_value
```
The script loads all the videos from the specified directory into a list of loaded video containers (`list[av.container.input.InputContainer]`) using the `os` and `av` Python packages. The script the generates an array of frame indices using the `np.arange` function from the NumPy library. The `np.arange` function creates an array of evenly spaced values within a given range. Here, the range starts at 0 and ends at `video_stream.frames`, representing the video’s total number of frames. The step size is `video_stream.frames / 16`, meaning the function will generate indices at intervals that divide the total number of frames by 16\. This effectively selects 16 evenly spaced frames from the video. The `.astype(int)` method converts the resulting array of indices to integers, ensuring that the indices are valid frame numbers. Finally, the `generate_response` function processes video content (processed frames) and generates a textual response using the `llava-hf/LLaVA-NeXT-Video-7B-hf` model and a processor.


### Video Captioning Example

For the post, I collected 15 publicly available videos of popular commercials, all in MP4 format. The commercials include Volkswagon, Chevy, Coca\-Cola, Doritos, Nike, Heinz, State Farm, TurboTax, and other well\-known brands. They range from 30s to 94s in length and contain 720 to 2,349 frames; video resolutions vary.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*IwxqYaNtkzrCcxzzVJaB2g.png)

Let’s examine the results of an analysis of the last video shown above, Nike’s 2024 “*Winning Isn’t for Everyone*” commercial.







The output from the script, `video_batch_translate.py`, is a complex JSON object containing the 15 video descriptions. With each description, I have included stats: video size, duration, fps, frame count, pixel width, pixel height, and timing of the entire captioning and translation process (e.g., 45\.586s). I have also included stats for the overall batch: model (`llava-hf/LLaVA-NeXT-Video-7B-hf`), temperature (e.g., 0\.3\), total batch time (e.g., 10m39s), number of videos processed (e.g., 15\), and the average time per video (e.g., 42\.632s).


```python
{
    "descriptions": [
    { 
      "video_file": "commercials\\Winning Isn't For Everyone Am I A Bad Person Nike.mp4",
      "video_size_mb": 28.354,
      "video_duration_sec": 90,
      "video_fps": 24,
      "video_frames": 2160,
      "video_width": 1920,
      "video_height": 1080,
      "total_processing_time_sec": 45.586,
      "description_english": "The video captures a dynamic scene of a female athlete, dressed in a white tank top and shorts, running on a track. She is in the midst of a race, her speed and focus evident as she approaches the finish line. The camera follows her from behind, emphasizing her determination and the intensity of the competition. In the background, a man in a blue shirt and shorts is seen running, adding to the sense of a competitive atmosphere. The camera then shifts to a woman in a blue shirt, who appears to be a reporter, providing commentary or analysis of the ongoing race. The audio includes the sound of the athletes' footsteps and breathing, along with the commentator's voice, creating a realistic and immersive experience. The visual style is realistic, with a focus on the athletes' physicality and the track's texture, giving a sense of the speed and effort involved in the sport. The overall mood is energetic and competitive, with a hint of excitement as the race nears its end. The video seems to be a sports-related piece, possibly a documentary or a live broadcast, aimed at sports enthusiasts or fans, highlighting the intensity of the competition and the dedication of the athletes.",
      "translation_spanish": "El video captura una escena dinámica de una atleta, vestida con una camiseta blanca y pantalones cortos, corriendo en una pista. Está en medio de una carrera, su velocidad y enfoque son evidentes cuando se acerca a la línea de meta. La cámara la sigue desde atrás, enfatizando su determinación e intensidad de la competencia. En el fondo, un hombre con camisa azul y pantalones cortos se ve corriendo, lo que agrega el sentido de un ambiente competitivo. La cámara luego se desplaza a una mujer con camisa azul, que parece ser una periodista, dando comentarios o análisis de la carrera en curso. El audio incluye el sonido de los pasos y la respiración de los atletas, junto con la voz del comentarista, creando una experiencia realista e inmersiva. El estilo es realista, con un enfoque en la velocidad de la carrera y el texto del esfuerzo de la carrera, y el objetivo es dar un paso a la intensidad visual de la carrera, y el deporte de los atletas es un entusiasta, como un entusiasta en la competencia, y el video se presenta como un gran sentido de la competencia o un entusiasta en vivo.",
      "translation_french": "La caméra la suit de derrière, soulignant sa détermination et l'intensité de la compétition. Dans le fond, un homme en chemise bleue et des shorts est vu courir, ajoutant à la sensation d'une atmosphère de compétition. La caméra se déplace ensuite vers une femme en chemise bleue, qui semble être une journaliste, fournissant des commentaires ou des analyses de la course en cours. L'audio comprend le son des pas et de la respiration des athlètes, ainsi que la voix du commentaire, créant une expérience réaliste et immersive. Le style est réaliste, avec un accent sur la vitesse de la course et la texture de l'effort de la course, et donne un sens de l'enthousiasme physique et la compétition, ou l'enthousiasme physique, la vidéo semble être un sens de l'enthousiasme et de l'enthousiasme des athlètes, et la diffusion d'un documentaire est liée à la compétition, et la vidéo semble être un épisode d'enthousiasme physique, une émotion physique, une émotion physique et un sens de l'enthousiasme de la compétition, et une émission sportive.",
      "translation_hindi": "वीडियो में एक महिला एथलीट का एक गतिशील दृश्य कैप्चर किया गया है, जो एक सफेद टैंक टॉप और शॉर्ट्स में पहनी हुई है, जो एक ट्रैक पर दौड़ती है। वह दौड़ के बीच में है, जब वह फिनिश लाइन के पास जाती है तो उसकी गति और ध्यान स्पष्ट होता है। कैमरा पीछे से उसका अनुसरण करता है, जिसमें उसकी दृढ़ संकल्प और प्रतियोगिता की तीव्रता पर जोर दिया जाता है। पृष्ठभूमि में, नीली शर्ट और शॉर्ट्स में एक आदमी दौड़ते हुए देखा जाता है, जिससे प्रतिस्पर्धी माहौल की भावना बढ़ जाती है। कैमरा फिर एक नीली शर्ट में एक महिला को स्थानांतरित करता है, जो एक रिपोर्टर प्रतीत होती है, जो चल रही दौड़ की टिप्पणी या विश्लेषण प्रदान करती है। ऑडियो में एथलीट के कदम और सांस की ध्वनि शामिल होती है, साथ ही एक यथार्थवादी और विसर्जित अनुभव पैदा होता है। ट्रैक की गति और स्पर्धा के अंत में टेक्स्ट पर ध्यान केंद्रित करते हुए, और एक दृश्यता प्रदान करती है, जो खेल के प्रति उत्साही, या खेल के प्रति उत्साही के साथ एक उत्साहपूर्ण भावना को बढ़ावा देती है।"
    }
  ],
  "stats": {
    "model": "llava-hf/LLaVA-NeXT-Video-7B-hf",
    "temperature": 0.3,
    "total_batch_time_sec": 639.474,
    "total_videos": 15,
    "average_time_per_video_sec": 42.632
  }
}
```
Above, we see the original English description of the video, followed by the French, Spanish, and Hindi translations. The generated English description of the video is excellent, detailing visual, audio, and non\-verbal content:

“*The video captures a dynamic scene of a female athlete, dressed in a white tank top and shorts, running on a track. She is in the midst of a race, her speed and focus evident as she approaches the finish line. The camera follows her from behind, emphasizing her determination and the intensity of the competition. In the background, a man in a blue shirt and shorts is seen running, adding to the sense of a competitive atmosphere. The camera then shifts to a woman in a blue shirt, who appears to be a reporter, providing commentary or analysis of the ongoing race. The audio includes the sound of the athletes’ footsteps and breathing, along with the commentator’s voice, creating a realistic and immersive experience. The visual style is realistic, with a focus on the athletes’ physicality and the track’s texture, giving a sense of the speed and effort involved in the sport. The overall mood is energetic and competitive, with a hint of excitement as the race nears its end. The video seems to be a sports\-related piece, possibly a documentary or a live broadcast, aimed at sports enthusiasts or fans, highlighting the intensity of the competition and the dedication of the athletes.*”


## Descriptive Tags

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*cndHLYkhKASw3pTFo2i30Q.png)

By changing the prompt used for generating natural language descriptions, we can generate a list of descriptive tags — unique words and short phrases that characterize the image or video. Here is an example of the descriptive tagging prompt used for videos from the `video_batch_tagging.py` script:


```python
PROMPT = """Analyze the given video and generate a list of 15-20 descriptive tags or short phrases that capture its key elements. Consider all aspects: visual content, audio elements, and non-verbal communication. Your output should be a comma-delimited list.

Guidelines:
1. Cover diverse aspects: setting, characters, actions, emotions, audio, style, theme, and technical elements.
2. Use single words or short phrases (max 3-4 words) for each tag.
3. Prioritize the most significant and distinctive elements.
4. Include both concrete (e.g., "forest setting") and abstract (e.g., "melancholic atmosphere") descriptors.
5. Consider visual elements (colors, movements, objects), audio (dialogue themes, music, sound effects), and non-verbal cues (body language, emotions).
6. Note any standout technical aspects (animation style, camera techniques, video quality).
7. Capture the overall mood, genre, and target audience if apparent.

Format your response as a single line of comma-separated tags, ordered from most to least prominent. Do not use numbering or bullet points. Do not end the list with a period.

Example output:
urban landscape, neon lights, electronic music, fast-paced editing, young protagonists, street dance, nighttime setting, energetic atmosphere, handheld camera, diverse cast, futuristic fashion, crowd cheering, bold color palette, rebellious theme, social media integration, drone footage, underground culture, viral challenge, generational conflict, street art"""
```
Analyzing the same Nike’s 2024 “*Winning Isn’t for Everyone*” commercial, the `llava-hf/LLaVA-NeXT-Video-7B-hf` model generated the following list of tags, which were then de\-duplicated and sorted, following inference, by the utility class, `tagsProcessor.py`:


```python
"tags_processed": [
    "athletic training",
    "athleticism",
    "celebratory mood",
    "competitive edge",
    "competitive spirit",
    "crowd reactions",
    "determination",
    "dynamic camera angles",
    "emotional highs and lows",
    "energetic music",
    "female commentator",
    "gritty realism",
    "high-stakes event",
    "intense focus",
    "physical exertion",
    "post-game interview",
    "sports",
    "sportsmanship",
    "strategic planning",
    "sweaty palms",
    "teamwork",
    "vibrant colors"
]
```

## Sentiment Analysis

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*oNO7yGS2Obu5UAZjcHqAfA.png)

We can also perform a sentiment analysis of the image or video by changing the prompt again. Here is an example of the sentiment analysis prompt used for videos from the `video_batch_sentiment.py` script:


```python
PROMPT = """Perform a comprehensive sentiment analysis of the given video. 
Focus on identifying and interpreting the overall emotional tone, mood, and underlying sentiments expressed throughout the video. 
Present your analysis in 2-3 concise paragraphs.

Consider the following aspects in your sentiment analysis:

1. Visual Elements:
   - Facial expressions and body language of individuals
   - Color palette and lighting (e.g., warm vs. cool tones)
   - Visual symbolism or metaphors

2. Audio Components:
   - Tone of voice in dialogue or narration
   - Emotional quality of background music
   - Use of sound effects and their emotional impact

3. Narrative and Content:
   - Overall story arc or message
   - Emotional journey of characters or subjects
   - Conflicts and resolutions presented

4. Pacing and Editing:
   - Rhythm and tempo of scene changes
   - Use of techniques like slow motion or quick cuts

5. Textual Elements:
   - Sentiment in any on-screen text or captions
   - Emotional connotations of title or subtitles

Guidelines for Analysis:
- Identify the dominant sentiment(s) expressed in the video (e.g., joy, sadness, anger, fear, surprise).
- Note any shifts in sentiment throughout the video's duration.
- Analyze how different elements (visual, audio, narrative) work together to create the overall emotional tone.
- Consider both explicit and implicit expressions of sentiment.
- Reflect on the intended emotional impact on the viewer.
- If applicable, discuss any contrasting or conflicting sentiments present.
- Provide specific examples from the video to support your analysis.
- Consider the context and target audience when interpreting sentiment.

Presentation Guidelines:
- Summarize your findings in 2-3 well-structured paragraphs.
- Begin with an overview of the dominant sentiment(s) and overall emotional tone.
- In subsequent paragraph(s), delve into more nuanced aspects of the sentiment analysis, including any notable shifts or contrasts.
- Conclude with a brief reflection on the effectiveness of the video in conveying its intended emotional message.
- Use clear, concise language while providing sufficient detail to support your analysis.
- Maintain an objective tone in your analysis, focusing on observed elements rather than personal opinions.

Your sentiment analysis should provide readers with a clear understanding of the emotional content and impact of the video, 
supported by specific observations from various aspects of the video's production."""
```
Using the same example of Nike’s 2024 “*Winning Isn’t for Everyone*” commercial, the `llava-hf/LLaVA-NeXT-Video-7B-hf` model generated the following sentiment analysis:

“*The video presents a diverse range of emotions and sentiments, with a predominantly positive and energetic atmosphere. The dominant sentiment is one of excitement and anticipation, as evident in the expressions of the young girl and the man. The girl’s wide\-eyed gaze and the man’s focused expression convey a sense of eagerness and readiness, suggesting they are eager to engage in the activity or event they are about to participate in. The use of warm lighting and vibrant colors, such as the yellow jersey of the girl and the red and white uniform of the man, further enhance the energetic and positive mood. The background music is lively and upbeat, adding to the excitement and enthusiasm of the scene.*”


## Advertising and Creative Analysis

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*A6iqmML9kbvLZV8L0hV2UA.png)

Lastly, we can perform analyses of advertising and creative content by changing the prompt again.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*13Yd3-xpA5mgMvjzRLz3YA.png)

Here is an example of the advertisement analysis prompt used for analyzing digital advertising, captured as images from the `ads_batch_descriptions.py` script:


```python
PROMPT = """<|begin_of_text|><|start_header_id|>user<|end_header_id|>

<|image|>Analyze the given advertisement and generate a concise description in a 2-3 paragraph structure. Don't use headlines or lists.
Your description should capture the essence of the ad, including its visual elements, layout, typography, copy, imagery, and overall impact. 
Aim for a comprehensive yet succinct narrative that gives readers a clear understanding of the ad's content, style, and intended message.

Consider the following aspects in your paragraph-based description:

1. Visual Elements:
   - Overall color scheme and dominant colors
   - Main images or illustrations and their content
   - Use of white space
   - Presence of logos or brand elements

2. Layout and Composition:
   - Overall structure and organization of elements
   - Focal points and visual hierarchy
   - Balance and alignment of components

3. Typography:
   - Font choices and styles
   - Size and prominence of text elements
   - Relationship between different text components

4. Copy and Messaging:
   - Main headline or slogan
   - Key phrases or taglines
   - Tone and style of the written content
   - Call-to-action (if present)

5. Imagery and Graphics:
   - Style of images (e.g., photography, illustrations, CGI)
   - Emotional appeal of visuals
   - Symbolism or metaphors in imagery

6. Branding Elements:
   - Prominence and placement of brand name/logo
   - Consistency with known brand identity (if applicable)

7. Target Audience and Context:
   - Implied target demographic
   - Cultural or social context of the ad

8. Medium and Format:
   - Type of ad (e.g., print, digital, billboard)
   - Size and orientation

9. Overall Impact and Effectiveness:
   - Emotional tone or mood evoked
   - Clarity and memorability of the message
   - Unique or innovative aspects of the ad

Guidelines:
- Write in clear, engaging prose.
- Balance description of individual elements with analysis of their collective impact.
- Prioritize the most significant and distinctive features of the advertisement.
- Use specific, vivid language to paint a picture in the reader's mind.
- Maintain a flowing narrative that connects different aspects of the ad.
- Include an objective description of the ad's elements and a brief interpretation of its likely intended effect.
- Limit your response to 2-3 paragraphs.

Your description should weave together these elements to create a cohesive and insightful portrayal of the advertisement, 
allowing readers to visualize it clearly and understand its key messages and strategies.<|eot_id|><|start_header_id|>assistant<|end_header_id|>"""Let’s examine the generated results of an analysis of a World Wide Technology digital advertisement on Yahoo!
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*qcaej4V1bcvzfzdoklkcQA.png)

The `SeanScripts/Llama-3.2–11B-Vision-Instruct-nf4` model generated the following detailed analysis:

“*The advertisement features a futuristic, high\-tech race car with a blue and red color scheme, set against a blurred background of a stadium or arena. The image is overlaid with a grid pattern and various lines and shapes, giving it a dynamic and technological feel.*

*The ad’s layout is clean and modern, with a prominent call\-to\-action (CTA) button at the bottom that reads “Learn More.” The text is clear and easy to read, with a large font size and a simple, sans\-serif font. The overall design is sleek and sophisticated, conveying a sense of innovation and cutting\-edge technology.*

*The ad’s message is focused on the idea of unlocking the power of AI, with the tagline “WWT’s AI Proving Ground — unlock unmatched access to premier global AI technologies.” The use of the phrase “proving ground” suggests a sense of experimentation and exploration, while the emphasis on “unmatched access” implies a level of exclusivity and high\-end quality. Overall, the ad effectively communicates the idea that World Wide Technology is a leader in the field of AI and offers a unique opportunity for customers to tap into its expertise.*”


## Conclusion

In this post, we learned how to generate detailed natural language descriptions, descriptive tags, and sentiment analysis of images and videos using a combination of 4\-bit and 8\-bit quantized versions of the Llama 3\.2 11B Vision Instruct model and the LLaVA\-Next\-Video 7B model. We also learned how to produce translations from the generated descriptions using Facebook’s distilled 600M parameter variant of the NLLB\-200 model. With over one million models available on Hugging Face, we could use infinite combinations of models to solve even the most complex NLP tasks with AI.

*If you are not yet a Medium member and want to support authors like me, please sign up here: <https://garystafford.medium.com/membership>.*

*This blog represents my viewpoints and not those of my employer, Amazon Web Services (AWS). All product names, images, logos, and brands are the property of their respective owners.*


