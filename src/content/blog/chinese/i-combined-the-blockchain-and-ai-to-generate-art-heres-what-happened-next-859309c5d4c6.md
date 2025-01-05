---
title: "我将区块链和人工智能结合起来创造艺术。接下来发生了什么？"
meta_title: "我将区块链和人工智能结合起来创造艺术。接下来发生了什么？"
description: "本文探讨了如何结合区块链和人工智能生成艺术作品的过程。通过识别区块链交易的关键特征，如发送者、接收者、金额等，利用大型语言模型（LLM）生成可视化图像。该过程包括从区块链提取数据、构建提示、生成图像及后处理。作者指出，此技术不仅限于艺术创作，还具有广泛的现实世界应用潜力，包括音乐、诗歌和数字艺术等。完整的源代码可在GitHub上获取。"
date: 2025-01-05T02:28:30Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*v4pDo5X5C9dDDd0WFV5Vwg.png"
categories: ["Technology", "Artificial Intelligence", "Generative AI"]
author: "Rifx.Online"
tags: ["blockchain", "LLMs", "prompt", "transactions", "NFTs"]
draft: False

---

### 教程

### 使用 LLM 创建数据的艺术表现



## 观察彩虹

如果可以通过图像来可视化，**区块链**会是什么样子？

区块链是**分布式账本**的技术实现，最常与金融交易相关联。这远不是我们可能认为的**美丽**的东西。尤其是因为存储在区块链上的数据大多由复杂的数字、字母和与**价值**、发送者和接收者地址（**钱包**）以及元数据相关的符号组成。

然而，我之前曾致力于**生成图像**以表示[量子计算](https://readmedium.com/qubit-magic-creating-mythical-creatures-with-quantum-computing-49bea0fabf4)，它与区块链类似，也由复杂的数字组成。我曾想知道是否可以结合使用AI和大型语言模型的相同可视化技术，以及[提示工程](https://readmedium.com/prompt-engineering-the-magical-world-of-large-language-models-dde7d8d043ee)，从全新的数据源生成图像。

让我们试试看！

## 一切都与特征有关

要从区块链生成图像，我们首先需要识别要利用的**特征**。

一个典型的 [交易](https://preview.cardanoscan.io/transaction/d6409d160ae9b266cd3fc1784645952e512cc5edcb75958f83ef723d7fc68644) 具有以下属性，这些属性识别**发送方**、**接收方**、**金额**、**费用**、**唯一 ID**以及其他相关的**元数据**。

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

这些特征可以作为主要指标，包含在 AI 和 LLM 的提示中，以生成相应的图像。

## 疯狂背后的魔力

可视化过程将根据从**交易**中识别的特征生成图像。

我们将从区块链加载一笔交易并提取关键字段。在这种情况下，我们将使用**Cardano**。当然，也可以使用任何加密货币，包括比特币、以太坊和索拉纳。重要的是，我们将包括交易哈希、发送者和接收者地址的值，以及最重要的**交易金额**，以便以美丽而富有想象力的方式可视化数据流。

最后，我们将利用**提示工程**为LLM构建一个合适的提示，以生成图像。

## 图像生成过程

我们需要进行两个网络请求作为流程的一部分。第一个请求将检索一个事务。第二个请求将调用LLM。

此设计如以下图所示。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*PUnrns8PH1mAbc9eGxgifA.png)

## 创建脚本

我们过程的第一步是创建一个 [程序](https://github.com/primaryobjects/generative-cardano/blob/main/generative-cardano.ipynb)，使用 Python 从区块链加载详细信息。

我们将使用 [BlockFrost](https://blockfrost.io/) API 来访问交易，这使我们能够 **读取数据** 而无需将 **整个区块链** 加载到 PC 上 *(这可能非常庞大且消耗 CPU)*。只要我们有交易 ID，这在 Python 中是很容易实现的。

```python
def fetch_transaction_details(tx_id):
    tx_details = api.transaction_utxos(tx_id)
    ada_amount = sum(int(output.amount[0].quantity) for output in tx_details.outputs if not output.collateral) / 1000000  # Convert lovelace to ADA
    sender = tx_details.inputs[0].address
    receiver = tx_details.outputs[0].address
    return TransactionDetails(tx_id, ada_amount, sender, receiver)
```

如上面的代码示例所示，我们正在提取 **交易 ID**、**ADA 数量**，以及 **发送者** 和 **接收者** 地址。这些数字和字母数字值应该足够帮助生成 AI 图像。

现在，关键数据点已经提取完毕，是时候进行一些提示工程了。

## 秘诀在于提示

**提示工程** 是生成基于原始 **数值** 的图像的关键力量所在。这也是我们可以在最终结果上发挥自己创造力的地方。

由于我们希望不仅可视化交易中的数值，还希望展示发送者与接收者之间 **信息流动** 的概念，因此我们可以将这个想法包含在提示中，让 AI 尝试可视化结果。

“根据以下交易细节生成图像：想象一个代表这些实体之间价值和连接流动的场景。包含一个草地，一个温暖而迷人的溪流。交易 ID: abc123, ADA 数量: 10\.25, 发送者: addr1\_testabc, 接收者: addr1\_testxyz。”

当然，提示并不是像上面的例子那样完全硬编码的。相反，我们将在发送给 LLM 之前，将交易中的 **变量** 注入到提示中。

## 是时候发挥创造力了

这里是真正的魔法所在——在于**提示**。

如上所述，我们使用一个主要是**静态提示**来指导LLM生成图像。然而，在提示中仍然有占位符，我们的脚本将在可视化过程中**插入特征**。

这些特征之一是价值的数量。

## 将交易分组到箱中

由于我们希望用不同类型的图像来表示价值（ADA），我们将把金额分成**箱**，并从中提供不同场景的图像。

### 按交易金额分类的桶

* 0–4: 小花，一棵树
* 5–9: 一个花园，几棵树
* 10–19: 一个公园，一个小池塘
* 20–29: 一个草地，一个溪流
* 30–39: 繁茂的草地，鲜花
* …

这个桶的定义可以如下所示实现。

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

使用**条件开关**结构来根据交易中的价值金额选择特定的**对象**和**色彩方案**。这个列表可以根据需要变得非常长和复杂。在上面的示例中，桶的间隔为10，直到100。*您甚至可以使用LLM来生成这些对象和色彩方案。*

构建好提示后，LLM就该发挥作用了。

## 生成图像

我们将使用 Hugging Face LLM 来生成 [Stable Diffusion](https://huggingface.co/models?sort=created&search=stable-diffusion) 图像。

我们在前一步构建的提示将通过 **API** 发送到 Stable Diffusion **模型**。这是通过一个简单的 POST 请求来完成的，传入 **prompt 字符串** 并等待结果。

响应是一个 **字节** 流，我们将其保存到图像文件中。然而，在保存图像之前，我们可以进行一些 **后处理** 使事情变得更加有趣！

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

## 将交易叠加到图像上

在从LLM接收到图像后，可以对图像进行无限数量的后处理**效果**。

为了表明该图像是由区块链交易生成的，让我们直接在图像上绘制交易ID、发送者、接收者和金额。这在图像中创建了一种**签名**，为最终结果增添了一种有趣的变化。

我还考虑过绘制小物体，例如与交易金额相等的**硬币**、**鸟**、**云**或**闪光**，以进一步可视化价值。*欢迎您自己尝试一下！*

最后，程序执行，我们等待结果！

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*0gW0nEE43AtThnP-T17img.png)

## 现实世界应用的潜力

从区块链生成**视觉内容**无疑是一个有趣的概念。然而，也许还有更大的潜力可以挖掘。

通过利用人类（或人工智能）的**创造力**，结合一些试错，这项技术可以解锁许多**现实世界应用**。

复杂数字可视化的潜在用例示例可能包括以下任何想法：

* **诗歌**
* **音乐**
* **图表**
* **数字艺术和NFT**
* **艺术**

大型语言模型在生成各种内容方面非常强大，只要数据和创意是可获取的。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*wivQgrUI6DFBdO9lqpNznA.png)

## 迈向下一步

我在创建这个项目时非常开心，希望它能激发你在区块链上可以做的各种可能性。完整的源代码可以在 [这里](https://github.com/primaryobjects/generative-cardano/) 找到。

通过结合区块链和 LLM 的 **前沿** 技术，以及一点点 **想象力**，未来是无限广阔的。


