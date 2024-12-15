---
title: "How to Fine-Tune Llama-3.2 on your own data: A detailed guide"
meta_title: "How to Fine-Tune Llama-3.2 on your own data: A detailed guide"
description: "This guide provides a comprehensive overview of fine-tuning the Llama-3.2 language model on custom datasets, specifically focusing on creating a sarcastic response generator. It covers the importance of fine-tuning to adapt models for specific contexts, the advantages of lightweight models for local deployment, and detailed steps for preparing the environment, generating text, and training the model using a sarcasm dataset. The guide also emphasizes the significance of quality over quantity in training data, as well as the technical aspects of using Hugging Faces tools for implementation and sharing the fine-tuned model."
date: 2024-12-15T01:41:12Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*hWtHNBdZmp8XPIcA"
categories: ["Programming", "Natural Language Processing", "Generative AI"]
author: "Rifx.Online"
tags: ["fine-tuning", "Llama", "sarcasm", "HuggingFace", "deployment"]
draft: False

---







### Introduction

The release of [Llama\-3\.2 collection](https://huggingface.co/collections/meta-llama/llama-32-66f448ffc8c32f949b04c8cf) from Meta marked an important milestone in the open\-source AI world. The model of the collection with the most downloads up to this point is the notorious meta\-llama/Llama\-3\.2–11B\-Vision\-Instruct. Unfortunately we can’t really access it in Europe along with the rest of Meta’s vision models for the Llama\-3\.2 release, but we can play around with the rest of the models that involve text only! If you want to learn more about technical stuff, or even learn cool stuff about the latest LLM advances, read along friend!

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*BnP7f9AQBHphPC9A)

Let’s start by briefly describing what fine\-tuning is. It is all about adjusting a model to fit your specific needs by tweaking its weights. Imagine you’re dealing with legal documents where words like ‘consideration’ take on a whole new meaning compared to everyday speech or what the model has been trained on. Fine\-tuning steps in to make sure the model gets these specialized terms right. It’s not just about words either — you can also set up the model to follow specific rules, like keeping answers short and to the point, or understanding your business needs to a deeper level. So, if you’re planning to deploy it in production, this process transforms a general\-purpose model into something custom\-built for your data.

The lightweight models, specifically the 1B and 3B (*{N}*B \= *N* billion parameters, for positive integer *N*), are among the most interesting for a variety of reasons.They are relatively easy to run locally, unlike the larger versions of LLMs and Meta claims they can be smoothly deployed on hardware found in mobile devices. This opens the door to many applications, as language processing can be done locally, without data leaving the device. As a result, these models are not reliant on a stable internet connection and offer a more private handling of sensitive information. With these advantages, we can expect to see more tools like personal assistants running on our smartphones.

The [reported context length](https://ai.meta.com/blog/llama-3-2-connect-2024-vision-edge-mobile-devices/#:~:text=Lightweight%20models,to%20recover%20performance.) for these models is 128k tokens, which means they can handle reasonably large prompts. The decrease in size was done with minimal penalty in accuracy using techniques such as [knowledge distillation](https://arxiv.org/abs/1503.02531), which utilized the output token probability distributions from larger Llama models as targets for the lightweight variants. Additionally, the Instruct version of the models was fine tuned using both high quality instruction data, as well as synthetic data generated from [Llama\-3\.1–405B\-Instruct](https://huggingface.co/meta-llama/Llama-3.1-405B-Instruct).

If you used any of these models you’ll probably agree that their performance is better than expected for their size. If you haven’t already you can access them via multiple online endpoints or you can run them locally with your own hardware. Having a GPU is strongly recommended for this part, so if you’re in possession of an Nvidia GPU or an Apple MacBook, it’s time you put it to good use! The following part describes the technical details of running and fine tuning Llama on your computer, as well as sharing the results with your friends!


### Preparation

We will be using the models hosted in [Hugging Face](https://huggingface.co/), the largest platform where users can share code and AI models with one another. Along with it, Python is the tool we need to get started. If you do not have Python installed on your machine, your best bet is to ask ChatGPT for instructions (or the LLM of your choice, OpenAI just works for me). Also, if you’re not in possession of a MacBook, ensure cuda is installed, again, by asking ChatGPT for specific instructions that work for your system.

You will also need a package installer, namely “pip”, to easily install the prerequisites needed to run these models. If all the above sounds exhausting to you, do not be afraid, LLMs are always there to help. After you ensure Python and pip are installed, we will install a few more tools before we move along to the more interesting parts.

The tool installation is handled by \`pip\`. Here is how to install them without fuss:

* Copy [this](https://github.com/AlexandrosChrtn/llama-fine-tune-guide/blob/main/requirements.txt) requirements.txt file
* Run `pip install -r requirements.txt`

A popular tool you just installed in your computer is the popular [transformers](https://github.com/huggingface/transformers) library (134k stars on GH today, good stuff). This is a python tool that allows you to invoke a wide variety of open source models in a few lines of code and use them on demand, assuming your computer can handle them. We will not dive deeper into the details of the library, (to avoid getting sidetracked!) but what is important for someone to know here is the [pipeline](https://huggingface.co/docs/transformers/en/main_classes/pipelines) function that allows us to perform a variety of tasks such as summarization, translation or text generation in a few lines of code.


### Generating Text

Typically, in the amazing open source LLM world, each model variant has 2 “flavors”, the Base model and the Instruct model. The base model is the model that has pretty much read a lot of text. Seriously, a lot. When you ask it to generate text, it predicts the next “word” (actually, tokens, but let’s keep it simple), one at a time. Want a whole paragraph? It just repeats that word\-predicting process until you’re happy.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*qR9ZN9X7Po7Mg7q8mjeMlw.png)

Since the model is only looking at what it’s already generated to guess the next word, it can technically keep going forever. But, if you let it run wild, it might fall into a kind of AI\-loop, where it starts to lose focus and ends up repeating the same thing over and over again. This is not surprising, if we consider the fact that at some point, it bases its predictions solely on AI generated content. The property of predicting the text down the road using intermediate text generated by the model is referred to as “autoregressive”. It is pretty much the most effective and practical way we could come up with (for now, hopefully) when it comes to “translating” the problem of text generation to mathematics that we could feed into a computer.

Now that we’re past the basics, let’s see some code. Running Llama locally is a few lines of code away, because Hugging Face’s transformers library is polite enough to carry the heavy burden. We will invoke their tools and generate text in a few lines of code, as seen below:


```python
from transformers import pipeline

model_id = "meta-llama/Llama-3.2-1B-Instruct"
pipe = pipeline(
    "text-generation",
    model=model_id,
    device_map="auto",
)
messages = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Should I let my dog sleep on the bed with me?"},
]
outputs = pipe(
    messages,
    max_new_tokens=128,
    do_sample=True
)
print(outputs[0]["generated_text"][-1])
```
Saving this into a file (`generate_text_example.py` for example) and executing it with `python3 generate_text_example.py` will print the generated answer by the model for the prompt “Should I let my dog sleep on the bed with me?” By the way, it responded with bullet points of pros and cons and a conclusion at the end, declaring that it is up to your lifestyle choices.

The text will be cut off if we set a `max_new_tokens` parameter. Furthermore, if you run the exact same code there is no guarantee that you will get the same output. When we generate text, in general, we would rather introduce randomness in the output by not always predicting the most probable word to come next, but rather selecting a word based on the output probability distribution (so the second most probable word is more likely to be chosen than the third and so on). This variation in word choice adds a natural feel to generated text and prevents loops that trap the model into an unwanted state.

Pretty cool so far, you’ve harnessed the Llama power in a few lines of code and you can use it in your data processing pipeline. But what if you wanted a cooler (albeit less helpful) Llama model that no one else had?


### Fine tuning

The way we achieve this favorable shift for the model’s weights is by passing more data to the model. We will work on fine tuning the Instruct model, which has already been fed data in the form of question\-answer pairs.

For our practical example, we want to fine tune the model to provide short and sarcastic (non) answers to our questions. One might argue that we will start with an astounding piece of technology, a blazing fast LLM assistant and we will end up with something that doesn’t really assist anywhere, but admittedly is fun to play with. This might be true for our case, you can still replace our fine tuning data with anything you find useful for your own aspirations.

Where can we get data with sarcasm to pass on to our model? Our best bet would be to generate synthetic data with a more powerful model, such as ChatGPT. Ideally we would come up with high quality data ourselves but this way is faster and we would struggle to come up with phrases that live up to the precedent set by — among other gems —


> \- Can plants talk?\- They can, but they’re very introverted. Don’t try to talk to them.

OK, nice, impressive, but these models have billions of parameters and they were trained on a million gigabytes of text. How many sarcastic examples do I have to come up with, to meaningfully sway the algorithm towards my desired direction? We will attempt to answer this question by only providing 200 examples. Ideally, at this step we really care about **quality** over quantity. That is why you should consider hand picking examples instead of using synthetic ones, if you’re looking for performance. In any case, the synthetic dataset is [available](https://github.com/AlexandrosChrtn/llama-fine-tune-guide/blob/main/data/sarcasm.csv), if you want to have a good laugh!

From a technical perspective, the weight updates from these examples will be more impactful compared to data points that the model encountered during its previous training, because these updates came in last and with a larger learning rate (unaffected by [ADAM’s](https://arxiv.org/abs/1412.6980) exponential moving averages).

If you want to use the following code to train your model, ensure your dataset looks like this:


```python
question,answer
"Who invented the light bulb?","Oh yeah, just a little unknown guy named Thomas Edison. You might have heard of him... if you pay attention at all."
"Is the sky blue?","Wow, you're asking that? Next, you'll tell me water is wet."
"What's 2 + 2?","Oh, such a brain-busting question. It’s 4, obviously. Genius."
```
So basically a csv with two columns, question and answer.

Important fact, when you’re dealing with Instruct models, you need to adhere by the following rule: apply the predefined chat template provided by the model distributor (Meta in our case) to your own dataset. This part is included on the code later on, so **you don’t have to do anything** as long as your dataset is just like the one above, but make sure you understand how this works, because it’s fun.

As mentioned earlier, the Instruct model is just like the Base model, with the difference that it was fine tuned on specific data to make it more assistant\-like. This data was in the form of question\-answer pairs (and probably system prompts). Therefore, we have no reason to change the way that the model expects those aforementioned input\-output pairs. That is why we need this thing called a “chat template”. For the Llama\-3\.2 models, the chat template for a prompt like “Do you have to whine all the time?” looks like this:


```python
<|begin_of_text|><|start_header_id|>system<|end_header_id|>

Cutting Knowledge Date: December 2023
Today Date: 19 Oct 2024

You are a helpful assistant.<|eot_id|><|start_header_id|>user<|end_header_id|>

Do you have to whine all the time?<|eot_id|><|start_header_id|>assistant<|end_header_id|>


```
The training part is also handled by the tools provided by Hugging Face. The following code is the script that does all the training. It starts from loading the model to our GPU and then proceeds to fine\-tuning it with the transformer’s `Trainer` class and saving the results in a directory named fine\-tuned\-model. Before you execute the code to continue with your fine tuning, ensure that the path to your csv data is provided inside `load_dataset`.


```python
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, Trainer, TrainingArguments
from datasets import load_dataset

## Load the base model and tokenizer
model_id = "meta-llama/Llama-3.2-1B-Instruct"
model = AutoModelForCausalLM.from_pretrained(model_id, torch_dtype=torch.float32, device_map="auto") # Must be float32 for MacBooks!
tokenizer = AutoTokenizer.from_pretrained(model_id)
tokenizer.pad_token = tokenizer.eos_token

## Load the training dataset
dataset = load_dataset("csv", data_files="data/sarcasm.csv", split="train")

## Define a function to apply the chat template
def apply_chat_template(example):
    messages = [
        {"role": "user", "content": example['question']},
        {"role": "assistant", "content": example['answer']}
    ]
    prompt = tokenizer.apply_chat_template(
        messages, tokenize=False, add_generation_prompt=True
    )
    return {"prompt": prompt}

## Apply the chat template function to the dataset
new_dataset = dataset.map(apply_chat_template)
new_dataset = new_dataset.train_test_split(0.05) # Let's keep 5% of the data for testing

## Tokenize the data
def tokenize_function(example):
    tokens = tokenizer(example['prompt'], padding="max_length", truncation=True, max_length=128)
    # Set padding token labels to -100 to ignore them in loss calculation
    tokens['labels'] = [
        -100 if token == tokenizer.pad_token_id else token for token in tokens['input_ids']
    ]
    return tokens

## Apply tokenize_function to each row
tokenized_dataset = new_dataset.map(tokenize_function)
tokenized_dataset = tokenized_dataset.remove_columns(['question', 'answer', 'prompt'])

## Define training arguments
model.train()
training_args = TrainingArguments(
    output_dir="./results",
    eval_strategy="steps", # To evaluate during training
    eval_steps=40,
    logging_steps=40,
    save_steps=150,
    per_device_train_batch_size=2, # Adjust based on your hardware
    per_device_eval_batch_size=2,
    num_train_epochs=2, # How many times to loop through the dataset
    fp16=False, # Must be False for MacBooks
    report_to="none", # Here we can use something like tensorboard to see the training metrics
    log_level="info",
    learning_rate=1e-5, # Would avoid larger values here
    max_grad_norm=2 # Clipping the gradients is always a good idea
)

## Initialize Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset["train"],
    eval_dataset=tokenized_dataset["test"],
    tokenizer=tokenizer)

## Train the model
trainer.train()

## Save the model and tokenizer
trainer.save_model("./fine-tuned-model")
tokenizer.save_pretrained("./fine-tuned-model")
```
The arguments inside `TrainingArguments` can be tuned, but unless you’re careful and you know what you’re doing, you are likely to cause a representation collapse and destroy the model’s predictive capabilities.

The output will be saved inside a directory named `fine-tuned-model`. Notice how we had to decouple the model and the tokenizer part here. The tokenizer is responsible for translating human language to an input accepted by the model, as well as decoding the model output to human readable language. The tokenizer also has the `apply_chat_template` method, that applies the predefined template for the Instruct models that was described earlier.


### Testing your model

Before you do anything with the model you need to make sure it works. You can go back to the traditional text generation script, but now, instead of invoking the Llama model from Hugging Face, you will point the pipeline function to your newly created model in fine\-tuned\-model. Here is how you can test it:


```python
from transformers import pipeline

model_id = "fine-tuned-model"
pipe = pipeline(
    "text-generation",
    model=model_id,
    device_map="auto",
)
messages = [
    {"role": "user", "content": "Should I move to Scandinavia?"},
]
outputs = pipe(
    messages,
    max_new_tokens=128
)
print(outputs[0]["generated_text"][-1])
```
From the code above, passing the prompt: “Should I move to Scandinavia?” to our model we get the following output:

“Oh yes, because nothing says ‘good life’ like freezing your butt off. And the cost of living? A whole other story. You might even need a warm coat. Worth a shot? Probably not. Scandinavia is all about embracing the cold. You’ll love it. You’ll hate it. Either way, you’ll be fine. Or not. Who knows. It’s all part of the adventure. Right?”

Banger. And you may test it with multiple prompts to ensure everything was done right. Keep in mind, this was done using the 1B model, which is the easiest to train in terms of hardware demands.


### Sharing

After you’re done, you may publish your model to Hugging Face, so other people can take it for a spin, if it works for their case. Sharing can be extra helpful because training models is a lot heavier than simply running them, so people might be able to run your model even on machines with lower GPU vRAM. One way to share the models is via `push_to_hub` if you are logged in with [huggingface\-cli](https://huggingface.co/docs/huggingface_hub/en/guides/cli) and if you have your model and tokenizer loaded in Python:


```python
model.push_to_hub("<your_huggingface_name>/<your_model_name>",
                  private=True)
tokenizer.push_to_hub("<your_huggingface_name>/<your_model_name>",
                     private=True)
```
You may upload models as private or public and you can switch between these two states at any point you want.

Finally, if you simply want to run the sarcasm model I trained for this tutorial, simply provide the appropriate [model\_id](https://huggingface.co/AlexandrosChariton/SarcasMLL-1B) to pipeline for “text\-generation”, as seen in the following code block.


```python
from transformers import pipeline

model_id = "AlexandrosChariton/SarcasMLL-1B"
pipe = pipeline(
    "text-generation",
    model=model_id,
    device_map="auto",
)
messages = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Should I move to Scandinavia?"},
]
outputs = pipe(
    messages,
    max_new_tokens=128
)
print(outputs[0]["generated_text"][-1])
```
If you want to work on the model or improve it, you are able to start from this point and fine tune it on your own question\-answer pairs with comedic value, just remember, quality over quantity and careful parameterization in `TrainingArguments` is what matters here.


> \- How many r’s in the word strawyberry?\- Oh, just one. It’s a real head\-scratcher. Don’t try to count them yourself. It’s like trying to solve a math problem. It’s one. Got it? One. Not two. Not three. One.SarcasMLL\-1B, 20/10/2024


### Conclusion

The information and code provided in this blog post can help someone adapt an open\-source language generation model to their own datasets. If you have a problem that requires a model to be an expert in a specific field, rather than a general\-purpose model that’s good at everything but not at an expert level, fine\-tuning might be worth considering. The possibilities are endless when working with large language models, and it’s exciting to think about what advancements will come in the next few years.

In future posts, I’ll dive deeper into other techniques one can use to avoid such limitations with variants of [LoRA](https://arxiv.org/abs/2106.09685), allowing for fine tuning of really large AI models that would otherwise be impossible in our computers. Also, if you want to learn more about fine tuning applications and Meta’s approach to open source LLMs, start from their relevant [blog](https://ai.meta.com/blog/adapting-large-language-models-llms/) and read along! I will try to keep these posts coming with more applications of AI, tackling challenges that seemed impossible a few years ago. If you have any issues / questions / comments feel free to reach out in the comments or via [LinkedIn](https://www.linkedin.com/in/alexandros-chariton-06a6aa1a4/), [Github](https://github.com/AlexandrosChrtn) or [Twitter](https://x.com/alexchrtn)!


