---
title: "Fine-tuning LLama 3 with Unsloth"
meta_title: "Fine-tuning LLama 3 with Unsloth"
description: "In this article I will show you how to fine-tune an LLM (Llama 3 from Meta) using Unsloth (including a way for custom dataset)"
date: 2024-10-30T12:58:41Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*kaXoudNTGeGfuNPl_kta5g.jpeg"
categories: ["Programming", "Machine Learning", "Natural Language Processing"]
author: "Rifx.Online"
tags: ["Llama", "Unsloth", "LoRA", "Alpaca", "NVIDIA"]
draft: False

---



In this article I will show you how to fine\-tune an LLM (Llama 3 from Meta) using [Unsloth](https://github.com/unslothai/unsloth). I will also provide a way to use your own custom dataset.

**Note :** Unsloth is library that accelerates fine\-tuning of LLMs on NVIDIA GPUs (40% reduction in memory usage compared to traditional methods). Compatible with Hugging Face, it supports Llama and Mistral architectures.

If you find my articles interesting, don’t forget to **clap and [follow](https://medium.com/@soulawalid)** 👍🏼, these articles take times and effort to do!

You can access to the free notebook provided for that on the GitHub repo

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*_L4o4MDQ7W5__OwW0E5RWA.png)

Since I am using Llama 3, I will click on the notebook (you can install Unsloth on your own computer too).

**Note:** I will use this dataset “[alpaca\-cleaned](https://huggingface.co/datasets/yahma/alpaca-cleaned)” from Hugging Face , the data is in Alpaca format meaning there is (Instruction, Input and Output)

### Starting the project

During the project I will guide you to perform fine\-tuning with Unsloth, explaining the code and provide recommendations, Let’s start our project :

**1/ Installing required packages :** We need first to install **Unsloth** and **xformers**, **trl**, **peft**, **accelerate**, **bitsandbytes** libraries for efficient model training and inference.

```python
!pip install "unsloth[colab-new] @ git+https://github.com/unslothai/unsloth.git"
!pip install --no-deps xformers trl peft accelerate bitsandbytes
```

**2/ Loading and Configuring the Model :** In the configuration I will set the following :

* Sets the maximum sequence length to **2048**
* by having dtype as **None**, it automatically detects the data type.
* Loads the model in **4\-bit precision,** I think it’s enough.

**Note :** You can find my article about tips on fine\-tuning LLMs in the Resources section

```python
from unsloth import FastLanguageModel
import torch

## Configuration
max_seq_length = 2048
dtype = None
load_in_4bit = True

## Load the selected model
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="unsloth/llama-3-8b-bnb-4bit",
    max_seq_length=max_seq_length,
    dtype=dtype,
    load_in_4bit=load_in_4bit,
)
```

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*cJSAcJFP7E-qJkqKUsHqLw.png)

**3/ Applying PEFT (Parameter Efficient Fine\-Tuning) :** We will then fine\-tunes the pre\-trained model using LoRA.

* r \= 16 is the rank parameter for LoRA. **Note :** common values are 8, 16, 32, 64, 128
* lora\_alpha \= 16 represents the scaling factor for LoRA updates ( I will write an article about LoRA to explain in details each part of it)
* No dropout and bias for LoRA
* For use\_gradient\_checkpointing we are using Unsloth to handle that (saving memory)

```python
model = FastLanguageModel.get_peft_model(
    model,
    r = 16,
    target_modules = ["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
    lora_alpha = 16,
    lora_dropout = 0,
    bias = "none",
    use_gradient_checkpointing = "unsloth",
    random_state = 3407,
    use_rslora = False,
    loftq_config = None,
)
```

**4/ Defining the Prompt Template :** We will create alpaca prompt template to format the dataset ( In case the data that you will be using is not in that format).

We will also add EOS (End Of Sequence) to inform the LLM that the sentence has ended.

Finally the formatting function, the function takes a batch of examples and formats each one according to the alpaca prompt template that we write before.

* It extracts instruction, input, and output fields from each example (row).
* It then formats these fields into the template and appends the EOS token.
* The formatted text is stored in a list and returned as a dictionary with a single key, “text”

```python
alpaca_prompt = """Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.

#### Instruction:
{}

#### Input:
{}

#### Response:
{}"""

EOS_TOKEN = tokenizer.eos_token

def formatting_prompts_func(examples):
    instructions = examples["instruction"]
    inputs = examples["input"]
    outputs = examples["output"]
    texts = []
    for instruction, input, output in zip(instructions, inputs, outputs):
        text = alpaca_prompt.format(instruction, input, output) + EOS_TOKEN
        texts.append(text)
    return {"text": texts}
```

**5/ Loading and Formatting the Dataset:** Loads the Alpaca dataset and applies formatting to each dataset example in batches.

```python
from datasets import load_dataset
dataset = load_dataset("yahma/alpaca-cleaned", split = "train")
dataset = dataset.map(formatting_prompts_func, batched = True)
```

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*M8EmbLMdoqrM-JlkMpDv8g.png)

**6/ Setting Up and Training the Model:** I covered most of them in my [previous article](https://readmedium.com/supervised-fine-tuning-tips-for-your-llm-projects-f84f20593653) regarding tips for Fine\-Tuning.

```python
from trl import SFTTrainer
from transformers import TrainingArguments
from unsloth import is_bfloat16_supported

trainer = SFTTrainer(
    model = model,
    tokenizer = tokenizer,
    train_dataset = dataset,
    dataset_text_field = "text",
    max_seq_length = max_seq_length,
    dataset_num_proc = 2, # Number of processes to use for data preprocessing
    packing = False, # Whether to pack multiple sequences into one batch to increase training efficiency
    args = TrainingArguments(
        per_device_train_batch_size = 2, #The batch size per device
        gradient_accumulation_steps = 4, #Number of gradient accumulation steps, which allows for effectively larger batch sizes
        warmup_steps = 5, #Number of steps to perform linear learning rate warmup
        max_steps = 60, #Total number of training steps
        learning_rate = 2e-5,#The learning rate for the optimizer
        fp16 = not is_bfloat16_supported(),
        bf16 = is_bfloat16_supported(),
        logging_steps = 1,
        optim = "adamw_8bit",
        weight_decay = 0.01,
        lr_scheduler_type = "cosine",
        seed = 3407,
        output_dir = "outputs",
    ),
)

trainer_stats = trainer.train()
```

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Vb_OqGP9CPc8xZdnkclGyQ.png)

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*PI0JXrTbpjuviyQ4bZJnFg.png)

**7/ Inference and Generation :** we prepare the model for inference by preparing the input prompt, tokenizing it , and then uses the model to generate new text based on that prompt. The generated text is then converted back into readable form.

```python
FastLanguageModel.for_inference(model)
inputs = tokenizer(
[
    alpaca_prompt.format(
        "Continue the fibonnaci sequence.", # instruction
        "1, 1, 2, 3, 5, 8", # input
        "", # output - leave this blank for generation!
    )
], return_tensors = "pt").to("cuda")

outputs = model.generate(**inputs, max_new_tokens = 64, use_cache = True)
tokenizer.batch_decode(outputs)
```

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*PI6SBL_YPPj0-RSAn5nl7g.png)

You can also use a TextStreamer for continuous inference , so you can see the generation token by token, instead of waiting the whole time!

```python
FastLanguageModel.for_inference(model)
inputs = tokenizer(
[
    alpaca_prompt.format(
        "Continue the fibonnaci sequence.",
        "1, 1, 2, 3, 5, 8",
        "",
    )
], return_tensors = "pt").to("cuda")

outputs = model.generate(**inputs, max_new_tokens = 64, use_cache = True)
tokenizer.batch_decode(outputs)

from transformers import TextStreamer
text_streamer = TextStreamer(tokenizer)
_ = model.generate(**inputs, streamer = text_streamer, max_new_tokens = 128)
```

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*NaSQ1vQKORU1I3DsOU2iOA.png)

**8/ Save the model :** If you are happy with it, you can save your model or push it to Hugging Face Hub

```python
model.save_pretrained("lora_model")
tokenizer.save_pretrained("lora_model")
## model.push_to_hub("your_name/lora_model", token = "...")
## tokenizer.push_to_hub("your_name/lora_model", token = "...")
```

**9/ Load the model :**

```python
if False:
    from unsloth import FastLanguageModel
    model, tokenizer = FastLanguageModel.from_pretrained(
        model_name = "lora_model",
        max_seq_length = max_seq_length,
        dtype = dtype,
        load_in_4bit = load_in_4bit,
    )
    FastLanguageModel.for_inference(model)
```

**10/ Using it for generation :**

```python
inputs = tokenizer(
[
    alpaca_prompt.format(
        "What is the capital of Palestine ?",
        "",
        "",
    )
], return_tensors = "pt").to("cuda")

outputs = model.generate(**inputs, max_new_tokens = 64, use_cache = True)
tokenizer.batch_decode(outputs)
```

If there’s a specific subject you’d like us to cover, please don’t hesitate to let me know! Your input will help shape the direction of my content and ensure it remains relevant and engaging 😀


