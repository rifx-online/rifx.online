---
title: "I Combined the Blockchain and AI to Generate Art. Here’s What Happened Next."
meta_title: "I Combined the Blockchain and AI to Generate Art. Here’s What Happened Next."
description: "The article discusses the integration of blockchain data and AI to create artistic visualizations. By utilizing large language models (LLMs) and prompt engineering, the author explores how to generate images based on blockchain transaction features, such as sender, receiver, and transaction amounts. The process involves extracting transaction details via an API, constructing creative prompts, and using an AI model to generate corresponding images. The project highlights potential applications in various fields, including digital art and NFTs, showcasing the intersection of technology and creativity."
date: 2025-01-05T02:28:30Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*v4pDo5X5C9dDDd0WFV5Vwg.png"
categories: ["Technology", "Artificial Intelligence", "Generative AI"]
author: "Rifx.Online"
tags: ["blockchain", "LLMs", "prompt", "transactions", "NFTs"]
draft: False

---


### TUTORIAL





### Using LLMs to create artistic representations of data




## Looking into the rainbow

What would the **blockchain** look like if it could be visualized through imagery?

The blockchain is a technical implementation of a **distributed ledger**, most commonly associated with financial transactions. This is far from something that we might consider **beautiful**. Especially since the data stored on the blockchain mostly consists of complicated numbers, letters, and symbols associated with amounts of **value**, sender and recipient addresses (**wallets**), and metadata.

However, I had previously worked on **generating images** to represent [quantum computing](https://readmedium.com/qubit-magic-creating-mythical-creatures-with-quantum-computing-49bea0fabf4), which, similar to the blockchain, also consists of complex numbers. I had wondered if it might be possible to combine the same visualization technique of using an AI and large language models, along with [prompt engineering](https://readmedium.com/prompt-engineering-the-magical-world-of-large-language-models-dde7d8d043ee), to generate images from a whole new source of data.

Let’s give it a try!


## It’s all about the features

To generate images from the blockchain, we first need to identify the **features** to be leveraged.

A typical [transaction](https://preview.cardanoscan.io/transaction/d6409d160ae9b266cd3fc1784645952e512cc5edcb75958f83ef723d7fc68644) has the following properties that identify the **sender**, **recipient**, **amount**, **fees**, a **unique ID**, and other relevant **metadata**.


```python
Transaction Hash
a3c26b8572447228f515e71e41ce70af93d590e48e77ff6e97d70beb7919f8da

Total Fees
0.168317 ADA

Total Output
1,307.847408 ADA

Sender
addr1_test1upm4c9yw05l0su5ygfj4a7qhxkqy2qwg5plupmradr6wnxssp8wj0

Receiver
addr1_test1uz25rnrpv5njt85h5q2c6yaj2wre0n43s3thed5syrmcdrq85p0rm
```
These features can serve as a primary indicator to include within a prompt for an AI and LLM to generate a corresponding image.


## The magic behind the madness

The visualization process will generate an image based upon the features identified from a **transaction**.

We’ll load a transaction from the blockchain and extract the key fields. In this case, we’ll use **Cardano**. Of course, any crypto could be used including Bitcoin, Ethereum, and Solana. The important part is that we’ll include values from the transaction hash, sender and recipient addresses, and most importantly, the **value of the transaction**, in order to visualize the flow of data in a beautiful and imaginative way.

Finally, we’ll utilize **prompt engineering** to construct a suitable prompt for the LLM to generate an image.


## Image generation process

We’ll need To make two web requests as part of the process. One request will retrieve a transaction. The second will call the LLM.

This design is shown in the following diagram.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*PUnrns8PH1mAbc9eGxgifA.png)


## Creating the script

The first step of our process is to create a [program](https://github.com/primaryobjects/generative-cardano/blob/main/generative-cardano.ipynb) in Python that can load details from the blockchain.

We’ll use the [BlockFrost](https://blockfrost.io/) API for accessing transactions, which allows us to **read data** without having to load the **entire blockchain** onto the PC *(which can be extremely large and CPU intensive)*. This can easily be achieved in Python, provided we have a transaction ID.


```python
def fetch_transaction_details(tx_id):
    tx_details = api.transaction_utxos(tx_id)
    ada_amount = sum(int(output.amount[0].quantity) for output in tx_details.outputs if not output.collateral) / 1000000  # Convert lovelace to ADA
    sender = tx_details.inputs[0].address
    receiver = tx_details.outputs[0].address
    return TransactionDetails(tx_id, ada_amount, sender, receiver)
```
As shown in the code example above, we’re extracting the **transaction ID**, **amount of ADA**, along with the **sender** and **receiver** addresses. These numeric and alphanumeric values should be enough to help generate images with the AI.

Now that the key data points have been extracted, it’s time to perform a little prompt engineering.


## The secret sauce lies within the prompt

**Prompt engineering** is what provides the key power for generating imagery based upon raw **numeric values**. It’s also the place where we can exercise our own creativity towards the end result.

Since we want to visualize not only the numeric values within the transaction, but also some concept of the **flow of information** between the sender and recipient, we can include this idea within the prompt and let the AI take a shot at visualizing the result.

“Generate an image based on the following transaction details: Imagine a scene that represents the flow of value and connection between these entities. Include a meadow, a stream with warm and inviting colors. Transaction ID: abc123, ADA Amount: 10\.25, Sender: addr1\_testabc, Receiver: addr1\_testxyz.”

Of course, the prompt isn’t just completely hard coded as the example above shows. Rather, we’ll **inject variables** from the transaction into the prompt before sending it off to the LLM.


## Time to get creative

This is where the real magic lives — in the **prompt**.

As described above, we’re using a largely **static prompt** to instruct the LLM on how to generate an image. However, there are still placeholders within the prompt where our script will **insert features** from the transaction as part of the visualization process.

One of these features is the amount of value.


## Grouping transactions into bins

Since we want the amount of value (ADA) to be represented by different types of imagery, we’ll break the amounts into **bins** from which we will provide different scenes of imagery.


### Bin categories by transaction amount

* 0–4: small flowers, a single tree
* 5–9: a garden, few trees
* 10–19: a park, small pond
* 20–29: a meadow, a stream
* 30–39: a flourishing meadow, flowers
* …

This bin definition can be implemented as shown below.


```python
def generate_prompt(tx_details):
    if ada_amount < 5:
        objects = "a small flower, a single tree"
        color_scheme = "soft pastel colors"
    elif ada_amount < 10:
        objects = "a garden, a few trees"
        color_scheme = "light and vibrant colors"
    elif ada_amount < 20:
        objects = "a park, a small pond"
        color_scheme = "bright and cheerful colors"
    elif ada_amount < 30:
        objects = "a meadow, a stream"
        color_scheme = "warm and inviting colors"
    # ...
    else:
        objects = "a vast landscape, a sunset"
        color_scheme = "dramatic and intense colors"

    prompt = f"Generate an image based on the following transaction details: \
Imagine a scene that represents the flow of value and connection between these entities. \
Include {objects} with {color_scheme}. \
Transaction ID: {tx_id}, ADA Amount: {ada_amount}, Sender: {sender}, Receiver: {receiver}."
```
A **conditional switch** construct is used to select a specific set of **objects** and **color schemes** based upon the amount of value in the transaction. This list can be as long and complex as we desire. In the above example, the bins are separated by 10 up to 100\. *You could even use an LLM to generate these objects and color schemes in the code.*

With the prompt constructed, it’s time for the LLM to do its part.


## Generating the image

We’ll use the Hugging Face LLM for [Stable Diffusion](https://huggingface.co/models?sort=created&search=stable-diffusion) to generate the images.

The prompt that we’ve constructed in the prior step will be sent to the Stable Diffusion **model** via the **API**. This is performed by a simple POST request, passing in the **prompt string** and waiting for the result.

The response is a stream of **bytes** that we save to an image file. However, before saving the image, we can perform a little **post\-processing** to make things even more interesting!


```python
response = requests.post(
    "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large",
    headers=headers,
    json={
        "inputs": prompt,
    },
)
image = Image.open(io.BytesIO(response.content))
image.save("image.png")
```

## Overlaying the transaction onto the image

There are an endless number of post\-processing **effects** that can be performed on the image after it’s received back from the LLM.

In order to signify that the image was generated from a blockchain transaction, let’s draw the transaction ID, sender, receiver, and amount directly onto the image. This creates a sort of **signature** within the image, offering an interesting spin to the end result.

I had also considered drawing small objects, such as **coins**, **birds**, **clouds**, or **sparkles** in number equivalent to the transaction amount to further visualize the value. *Feel free to give this a try yourself!*

Finally, the program executes, and we await the result!

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*0gW0nEE43AtThnP-T17img.png)


## Potential in real\-world applications

Generating **visual content** from the blockchain is certainly an interesting concept. However, perhaps there exists potential to go even further.

By leveraging human (or AI) **creativity**, along with a little trial and error, this technology could unlock many **real\-world applications**.

Examples of possible use\-cases for complex numerical visualization could include any of the ideas below:

* **Poetry**
* **Music**
* **Diagrams**
* **Digital art and NFTs**
* **Art**

LLMs are extremely powerful for generation of a variety of content, provided the data and ideas are accessible.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*wivQgrUI6DFBdO9lqpNznA.png)


## Taking it to the next step

I had a lot of fun creating this project and I hope it helps to inspire possibilities in what you can do with the blockchain. The full source code can be found [here](https://github.com/primaryobjects/generative-cardano/).

By combining the **bleeding edge** technology of blockchains and LLMs, along with a little bit of **imagination**, the future is wide open.

What will you create next?


## About the Author

If you’ve enjoyed this article, please consider following me on [Medium](https://medium.com/@KoryBecker), [Twitter](https://twitter.com/PrimaryObjects), and my [website](https://primaryobjects.com/) to be notified of my future posts and research work.


