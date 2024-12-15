---
title: "如何根据自己的数据微调 Llama-3.2：详细指南"
meta_title: "如何根据自己的数据微调 Llama-3.2：详细指南"
description: "本文详细介绍了如何在自己的数据上微调Meta发布的Llama-3.2系列模型。微调的目的是通过调整模型权重，使其适应特定需求，特别是在处理专业术语时。文章强调轻量级模型的优势，如在本地设备上运行、对敏感信息的私密处理等。提供了使用Hugging Face和Python进行模型训练的具体步骤，包括数据准备、模型加载、训练参数设置及模型测试。最后，鼓励用户分享微调后的模型，以便其他人使用。"
date: 2024-12-15T01:41:12Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*hWtHNBdZmp8XPIcA"
categories: ["Programming", "Natural Language Processing", "Generative AI"]
author: "Rifx.Online"
tags: ["fine-tuning", "Llama", "sarcasm", "HuggingFace", "deployment"]
draft: False

---





### 介绍

Meta发布的[Llama-3.2系列](https://huggingface.co/collections/meta-llama/llama-32-66f448ffc8c32f949b04c8cf)在开源AI领域标志着一个重要的里程碑。到目前为止，该系列中下载量最多的模型是臭名昭著的meta-llama/Llama-3.2–11B-Vision-Instruct。不幸的是，我们在欧洲无法真正访问它以及Meta的其他视觉模型，但我们可以尝试其他仅涉及文本的模型！如果你想了解更多技术内容，甚至学习最新LLM进展的酷炫知识，请继续阅读，朋友！

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*BnP7f9AQBHphPC9A)

让我们先简单描述一下微调是什么。微调就是通过调整模型的权重，使其适应你的特定需求。想象一下，你正在处理法律文件，其中“对价”等词的含义与日常用语或模型训练时的内容截然不同。微调确保模型能够正确理解这些专业术语。这不仅仅是关于单词——你还可以设置模型遵循特定规则，比如保持答案简短明了，或者更深入地理解你的业务需求。因此，如果你计划在生产中部署它，这个过程将一个通用模型转变为为你的数据量身定制的模型。

轻量级模型，特别是1B和3B（*{N}*B = *N*十亿参数，*N*为正整数），因多种原因而备受关注。与更大的LLM版本不同，它们在本地运行相对简单，Meta声称可以在移动设备上平稳部署。这为许多应用打开了大门，因为语言处理可以在本地完成，数据无需离开设备。因此，这些模型不依赖于稳定的互联网连接，并提供对敏感信息的更私密处理。凭借这些优势，我们可以期待在智能手机上看到更多像个人助理这样的工具。

这些模型的[报告上下文长度](https://ai.meta.com/blog/llama-3-2-connect-2024-vision-edge-mobile-devices/#:~:text=Lightweight%20models,to%20recover%20performance.)为128k个token，这意味着它们可以处理相当大的提示。通过使用[知识蒸馏](https://arxiv.org/abs/1503.02531)等技术，利用更大Llama模型的输出token概率分布作为轻量级变体的目标，模型的大小减少时准确性损失最小。此外，这些模型的Instruct版本使用高质量的指令数据和从[Llama-3.1–405B-Instruct](https://huggingface.co/meta-llama/Llama-3.1-405B-Instruct)生成的合成数据进行了微调。

如果你使用过这些模型，你可能会同意它们的性能超出了预期。如果你还没有，可以通过多个在线端点访问它们，或者在自己的硬件上本地运行。强烈建议拥有GPU，因此如果你拥有Nvidia GPU或Apple MacBook，现在是时候好好利用它了！接下来的部分将描述在你的计算机上运行和微调Llama的技术细节，以及如何与朋友分享结果！

### 准备

我们将使用托管在 [Hugging Face](https://huggingface.co/) 的模型，这是一个用户可以相互分享代码和AI模型的最大平台。此外，Python 是我们入门所需的工具。如果你的机器上没有安装 Python，最好的办法是询问 ChatGPT 获取说明（或你选择的 LLM，OpenAI 对我来说很好用）。另外，如果你没有 MacBook，请确保安装了 cuda，同样可以通过询问 ChatGPT 获取适合你系统的具体说明。

你还需要一个包管理器，也就是“pip”，以便轻松安装运行这些模型所需的先决条件。如果以上所有内容听起来让你感到疲惫，不用担心，LLM 始终可以提供帮助。在确保安装了 Python 和 pip 之后，我们将再安装一些工具，然后再进入更有趣的部分。

工具安装由 \`pip\` 处理。以下是轻松安装它们的方法：

* 复制 [这个](https://github.com/AlexandrosChrtn/llama-fine-tune-guide/blob/main/requirements.txt) requirements.txt 文件
* 运行 `pip install -r requirements.txt`

你刚刚在电脑上安装的一个流行工具是流行的 [transformers](https://github.com/huggingface/transformers) 库（今天在 GH 上有 134k 星，非常不错）。这是一个 Python 工具，允许你在几行代码中调用各种开源模型，并根据需要使用它们，前提是你的电脑能够处理它们。我们不会深入探讨该库的细节（以避免偏离主题！），但在这里需要了解的重要内容是 [pipeline](https://huggingface.co/docs/transformers/en/main_classes/pipelines) 函数，它允许我们在几行代码中执行各种任务，如摘要、翻译或文本生成。

### 生成文本

通常，在令人惊叹的开源 LLM 世界中，每个模型变体都有 2 种“风味”，基础模型和指令模型。基础模型是已经阅读了大量文本的模型。说真的，很多。当你让它生成文本时，它会一次预测下一个“单词”（实际上是标记，但我们保持简单），一个接一个。想要一整段？它只需重复这个单词预测过程，直到你满意为止。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*qR9ZN9X7Po7Mg7q8mjeMlw.png)

由于模型仅查看已经生成的内容来猜测下一个单词，因此从技术上讲，它可以无限制地继续下去。但是，如果你让它失控，它可能会陷入一种 AI 循环，开始失去焦点，并不断重复相同的内容。如果我们考虑到在某个时刻，它的预测完全基于 AI 生成的内容，这并不令人惊讶。利用模型生成的中间文本来预测后续文本的特性被称为“自回归”。这几乎是我们目前能够想到的（希望是这样）将文本生成问题“翻译”为可以输入计算机的数学的最有效和实用的方法。

现在我们已经过了基础知识，让我们看看一些代码。在本地运行 Llama 只需几行代码，因为 Hugging Face 的 transformers 库很贴心地承担了这个繁重的任务。我们将调用他们的工具，并在几行代码中生成文本，如下所示：

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
将其保存到文件中（例如 `generate_text_example.py`）并使用 `python3 generate_text_example.py` 执行，将打印模型针对提示“Should I let my dog sleep on the bed with me?” 生成的答案。顺便提一下，它以优缺点的要点和最后的结论作出了回应，声明这取决于你的生活方式选择。

如果我们设置 `max_new_tokens` 参数，文本将被截断。此外，如果你运行完全相同的代码，不能保证你会得到相同的输出。当我们生成文本时，通常我们更愿意通过不总是预测下一个最可能的单词，而是根据输出概率分布选择一个单词来引入随机性（因此第二可能的单词比第三个更有可能被选择）。这种单词选择的变化为生成的文本增添了一种自然的感觉，并防止模型陷入不想要的状态。

到目前为止，挺酷的，你在几行代码中利用了 Llama 的力量，可以在你的数据处理管道中使用它。但是，如果你想要一个更酷（尽管不太实用）的 Llama 模型，而没有其他人拥有呢？

### 微调

我们实现模型权重有利转变的方法是向模型传递更多数据。我们将对已经以问答对形式输入数据的 Instruct 模型进行微调。

在我们的实际示例中，我们希望微调模型，以便对我们的问题提供简短而讽刺的（非）答案。有人可能会争辩说，我们将从一项惊人的技术开始，一个快速的 LLM 助手，最后却得到一些在任何地方都无助的东西，但确实很有趣。这在我们的案例中可能是正确的，你仍然可以用任何你认为对自己目标有用的内容替换我们的微调数据。

我们可以从哪里获取讽刺的数据以传递给我们的模型？我们最好的选择是使用更强大的模型（如 ChatGPT）生成合成数据。理想情况下，我们希望自己生成高质量的数据，但这种方式更快，而我们很难想出能达到——以及其他一些珍品——所设定的标准的短语。

> \- 植物会说话吗？\- 它们会，但它们非常内向。不要试图与它们交谈。

好吧，很不错，令人印象深刻，但这些模型有数十亿个参数，并且是在百万千字节的文本上训练的。我需要想出多少个讽刺的例子，才能有意义地影响算法朝着我想要的方向发展？我们将尝试通过仅提供 200 个例子来回答这个问题。理想情况下，在这一步中，我们真正关心的是 **质量** 而非数量。这就是为什么如果你在寻求性能时应该考虑手动挑选示例，而不是使用合成示例。无论如何，合成数据集是 [可用的](https://github.com/AlexandrosChrtn/llama-fine-tune-guide/blob/main/data/sarcasm.csv)，如果你想大笑一场！

从技术角度来看，这些例子的权重更新将比模型在之前训练过程中遇到的数据点更具影响力，因为这些更新是最后进行的，并且学习率更大（不受 [ADAM](https://arxiv.org/abs/1412.6980) 的指数移动平均的影响）。

如果你想使用以下代码来训练你的模型，请确保你的数据集看起来像这样：

```python
question,answer
"Who invented the light bulb?","Oh yeah, just a little unknown guy named Thomas Edison. You might have heard of him... if you pay attention at all."
"Is the sky blue?","Wow, you're asking that? Next, you'll tell me water is wet."
"What's 2 + 2?","Oh, such a brain-busting question. It’s 4, obviously. Genius."
```
所以基本上是一个包含两个列的 csv，问题和答案。

重要的事实是，当你处理 Instruct 模型时，你需要遵循以下规则：将模型分发者（在我们的案例中是 Meta）提供的预定义聊天模板应用于你自己的数据集。后面代码中包含了这一部分，因此 **你不需要做任何事情**，只要你的数据集与上面的一样，但确保你理解这如何工作，因为这很有趣。

如前所述，Instruct 模型就像基础模型，只是在特定数据上进行了微调，使其更像助手。这些数据以问答对的形式存在（可能还有系统提示）。因此，我们没有理由改变模型对上述输入输出对的期望方式。这就是我们需要称为“聊天模板”的原因。对于 Llama-3.2 模型，像“你必须一直抱怨吗？”这样的提示的聊天模板看起来像这样：

```python
<|begin_of_text|><|start_header_id|>system<|end_header_id|>

Cutting Knowledge Date: December 2023
Today Date: 19 Oct 2024

You are a helpful assistant.<|eot_id|><|start_header_id|>user<|end_header_id|>

Do you have to whine all the time?<|eot_id|><|start_header_id|>assistant<|end_header_id|>


```
训练部分也由 Hugging Face 提供的工具处理。以下代码是执行所有训练的脚本。它从加载模型到我们的 GPU 开始，然后使用 transformer 的 `Trainer` 类进行微调，并将结果保存在名为 fine-tuned-model 的目录中。在执行代码以继续微调之前，请确保在 `load_dataset` 中提供了 csv 数据的路径。

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
`TrainingArguments` 中的参数可以进行调整，但除非你小心并且知道自己在做什么，否则你可能会导致表示崩溃，破坏模型的预测能力。

输出将保存在名为 `fine-tuned-model` 的目录中。请注意，我们必须在这里解耦模型和分词器部分。分词器负责将人类语言翻译为模型接受的输入，以及将模型输出解码为人类可读的语言。分词器还有 `apply_chat_template` 方法，该方法应用于之前描述的 Instruct 模型的预定义模板。

### 测试您的模型

在您对模型进行任何操作之前，您需要确保它能够正常工作。您可以回到传统的文本生成脚本，但现在，您将把管道函数指向您新创建的 fine-tuned-model。以下是您可以测试它的方法：

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
从上面的代码中，将提示：“Should I move to Scandinavia?” 传递给我们的模型，我们得到以下输出：

“Oh yes, because nothing says ‘good life’ like freezing your butt off. And the cost of living? A whole other story. You might even need a warm coat. Worth a shot? Probably not. Scandinavia is all about embracing the cold. You’ll love it. You’ll hate it. Either way, you’ll be fine. Or not. Who knows. It’s all part of the adventure. Right?”

很棒。您可以使用多个提示进行测试，以确保一切都做对了。请记住，这是使用 1B 模型完成的，该模型在硬件要求方面是最容易训练的。

### 分享

完成后，您可以将模型发布到 Hugging Face，以便其他人可以试用它，看看它是否适合他们的情况。分享特别有帮助，因为训练模型的资源消耗要比简单运行它们重得多，因此人们可能能够在 GPU vRAM 较低的机器上运行您的模型。分享模型的一种方式是通过 `push_to_hub`，前提是您已使用 [huggingface\-cli](https://huggingface.co/docs/huggingface_hub/en/guides/cli) 登录，并且已在 Python 中加载了模型和分词器：

```python
model.push_to_hub("<your_huggingface_name>/<your_model_name>",
                  private=True)
tokenizer.push_to_hub("<your_huggingface_name>/<your_model_name>",
                     private=True)
```
您可以将模型上传为私有或公共，并且可以在任何时候在这两种状态之间切换。

最后，如果您只想运行我为本教程训练的讽刺模型，只需将适当的 [model\_id](https://huggingface.co/AlexandrosChariton/SarcasMLL-1B) 提供给“文本生成”的管道，如下代码块所示。

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
如果您想对模型进行修改或改进，您可以从这一点开始，并根据您自己的搞笑问答对进行微调，只需记住，质量优于数量，以及在 `TrainingArguments` 中仔细参数化才是关键。

> \- 单词 strawyberry 中有多少个 r？\- 哦，只有一个。这真是个令人费解的问题。别试着自己去数。这就像试图解决一个数学问题。只有一个。明白了吗？一个。不是两个。不是三个。一个。SarcasMLL\-1B, 20/10/2024

### 结论

本博客文章中提供的信息和代码可以帮助某人将开源语言生成模型适配到自己的数据集。如果您遇到的问题需要模型在特定领域成为专家，而不是一个在各方面都不错但不够专业的通用模型，那么微调可能值得考虑。在处理大型语言模型时，可能性是无穷无尽的，想想未来几年会有什么进展，令人感到兴奋。

在未来的帖子中，我将更深入探讨可以使用的其他技术，以避免使用[LoRA](https://arxiv.org/abs/2106.09685)变体的此类限制，从而实现真正大型AI模型的微调，这在我们的计算机中是无法实现的。此外，如果您想了解更多关于微调应用和Meta对开源LLM的看法，可以从他们相关的[博客](https://ai.meta.com/blog/adapting-large-language-models-llms/)开始阅读！我会尽量继续发布更多关于AI应用的帖子，解决几年前看似不可能的挑战。如果您有任何问题/疑问/评论，请随时在评论中或通过[LinkedIn](https://www.linkedin.com/in/alexandros-chariton-06a6aa1a4/)、[Github](https://github.com/AlexandrosChrtn)或[Twitter](https://x.com/alexchrtn)与我联系！

