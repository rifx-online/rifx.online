---
title: "使用语言模型生成合成数据：实用指南"
meta_title: "使用语言模型生成合成数据：实用指南"
description: "合成数据生成技术利用语言模型创建高质量数据集，解决真实数据获取困难的问题。它可用于医疗记录、客户互动和自动驾驶等领域，弥补数据不足，促进AI开发。尽管合成数据具备可扩展性和隐私保护等优势，但也存在真实性不足、过拟合和偏见等局限性。本文探讨了合成数据的生成方法及其局限性，并提供了在Python中实现合成数据生成器的示例代码。"
date: 2024-12-15T01:34:53Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*MfgqkW1LzAEC0PAAQ-H8SQ.jpeg"
categories: ["Programming", "Data Science", "Generative AI"]
author: "Rifx.Online"
tags: ["synthetic", "generation", "language", "models", "validation"]
draft: False

---





在人工智能不断发展的领域中，数据仍然是推动创新的燃料。但是，当获取真实世界数据变得困难、昂贵，甚至不可能时，会发生什么呢？

合成数据生成应运而生——这是一种开创性的技术，利用语言模型创建高质量、逼真的数据集。考虑在不违反隐私法的情况下对医疗记录进行语言模型训练，或者在没有私人对话记录的情况下开发客户互动模型，或设计自动驾驶系统，其中收集稀有边缘案例的数据几乎是不可能的。合成数据弥补了数据可用性方面的不足，同时保持了有效的AI训练所需的真实感。

除了解决数据短缺问题，合成数据还通过平衡不平衡数据集（例如，在欺诈检测或罕见病症中）、模拟稀有事件和用逼真的变体增强有限数据来促进AI开发。公司可以加速开发、提高模型鲁棒性，并对其他无法获得的数据集进行实验。

虽然合成数据的好处——如可扩展性、隐私保护和模拟难以捕捉场景的能力——是显而易见的，但它也存在局限性，包括有限的现实可信度、过拟合和偏见，这些都需要谨慎考虑。

在本文中，我们将探讨合成数据生成，讨论其局限性及克服方法，并向您展示如何在Python中实现自己的合成数据生成器。

## 如何克服合成数据的局限性

### 1\. 缺乏真实世界的真实性

合成数据可能无法完全捕捉真实数据的细微差别和变异性，从而导致模型在受控环境中表现良好，但在真实应用中失败。

**如何克服：**

* **混合方法：** *使用合成数据来增强真实数据，而不是替代它。* 这种组合确保模型能够推广到未见过的真实场景。
* **在真实数据上验证：** *始终在真实世界数据集上验证模型，* 即使训练是使用合成数据进行的，以评估在实际应用中的性能并确保稳健性。

### 2\. 过拟合与偏差

在合成数据上训练的模型可能会过拟合该数据中的模式，而这些模式在真实世界的数据中可能并不存在。这可能导致在部署时泛化能力差。此外，合成数据可能会继承或放大用于生成它的模型中存在的偏见。这可能导致偏见预测。

**如何克服：**

* **数据正则化：** *应用数据增强技术并在合成数据中引入噪声*，以模拟真实世界数据的随机性和变异性。
* **多样化数据生成：** *通过使用多个模型*和方法从不同视角生成数据，确保合成数据的多样性。

此外，请记住，确保合成数据的质量和代表性可能很困难，通常在**少样本学习 (FSL)**和**思维链 (CoT) 提示**的提示工程中进行一些实验可以带来很大帮助。我们将在下面更详细地说明这些内容。

## 合成数据生成器实现


> 您可以在配备 Intel® Xeon® CPU 的 [Intel® Tiber™ AI Cloud](https://cloud.intel.com/) 环境中运行本教程。该平台提供充足的计算资源，确保我们的代码顺利执行。

### 环境设置

让我们开始导入必要的库。在我们的演示中，我们将使用 [Llama 3\.1](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-ai-solutions-support-meta-llama-3-1-launch.html)，您需要一个 Hugging Face 令牌来访问该模型的受限库。您可以直接从您的 Hugging Face 账户创建和访问您的令牌。为此，请从设置菜单中选择“访问令牌”，并创建一个具有“写入”权限的令牌。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*y0t9XaNvc7WIwZP0V2DQKg.png)

现在，您可以在 Python 脚本中插入您的令牌。（请勿与任何人分享您的访问令牌；Hugging Face 会删除任何泄露的访问令牌。）

```python
import random
import pandas as pd
from transformers import pipeline
from huggingface_hub import login

login("your_token")
```
接下来，访问 [meta\-llama/Meta\-Llama\-3\.1–8B\-Instruct](https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct) 并在提供您的信息并提交 Llama 3\.1 访问请求之前阅读许可证。

### 实现

假设我们想要生成按以下标签分类的合成客户服务文本

```python
labels = ["polite", "somewhat polite", "neutral", "impolite"]
```
在这些上下文中

```python
categories_types = {
    "travel": ["air", "train"],
    "stores": ["appliances", "toys and games"]
}
```

> 我们将随机选择标签和类别，并指示语言模型根据指定的类别和标签生成合成数据。

随机性将确保*数据正则化*；请参见上述第二个挑战（过拟合和偏差）。一旦我们选择了上下文类别，我们就会从我们的字典中随机选择一个相应的类型，如下所示。

```python
random.choices(categories_types[category])
```
以下是我们进行完整实现的方法：我们按批生成数据，我们的函数随机为批次的样本分配标签和类别。对于批次中的每个样本，`sdg` 函数：

* 创建一个提示，指示语言模型根据分配的标签和类别生成合成客户服务响应。
* 使用语言模型生成对提示的响应。
* 从生成的响应中提取相关文本。您可以暂时将 `text_extraction` 函数保留为身份函数，因为其确切定义取决于诸如提示等因素。它可以通过正则表达式轻松处理。

最后，每批生成的响应及其标签和使用的模型将附加到 CSV 文件中。

```python
def sdg(
    sample_size,
    labels,
    categories_types,
    batch_size,
    output_path="./output.csv",
    model="meta-llama/Meta-Llama-3.1-8B-Instruct",
):
    """
    根据指定的类别和标签生成合成数据。

    参数：
        sample_size (int): 要生成的合成数据样本数量。
        labels (list of str): 用于对合成数据进行分类的标签。
        categories_types (dict): 数据生成和多样化的类别及其类型。
        batch_size (int): 每批附加到输出文件的样本数量。
        output_dir (str): 输出文件将保存的目录路径。
        model (str): 用于生成合成数据的大型语言模型。
    """
    
    categories = list(categories_types.keys())

    # 如果 sample_size 不能被 batch_size 整除，则添加一个额外的批次
    num_batches = (sample_size + batch_size - 1) // batch_size

    print(f"合成数据将以 {num_batches} 批次追加到 {output_path}。")

    for batch in range(num_batches):
        # 计算当前批次的起始和结束索引
        start = batch * batch_size
        end = min(start + batch_size, sample_size)

        # 存储当前批次的结果
        batch_data = []

        # 为当前批次分配随机标签
        batch_random_labels = random.choices(labels, k=batch_size)

        # 为当前批次分配随机类别
        batch_random_categories = random.choices(categories, k=batch_size)

        for i in range(start, end):
            random_type = random.choices(
                categories_types[batch_random_categories[i - start]]
            )
            prompt = f"""我正在创建合成输出以微调
            我的 BERT 模型。用例是客户服务聊天机器人。
            您应该仅为分类生成一个输出
            标签：{batch_random_labels[i - start]} 在类别：
            {batch_random_categories[i - start]} 和类型
            {random_type}。 

            示例。 
            输出：您看到的费用可能与
            我们的标准账户维护费用有关。如果需要，我可以提供
            更多详细信息。

            输出：您可以退货，但前提是您有收据，并且在退货窗口内。

            输出：这不是我们的错，您的行李没有到达。
            您希望我们现在能做些什么？

            输出：我为您在加热器上遇到的麻烦感到抱歉。我们当然可以考虑退货或换货。
            请带上您的收据，我们会为您处理。

            仅返回一个输出，而不是标签或类别。
            """
            messages = [
                {
                    "role": "system",
                    "content": f"您是一个有帮助的助手，旨在生成带有标签 {labels} 的合成客户服务数据，类别为 {categories}。",
                },
                {"role": "user", "content": prompt},
            ]
            generator = pipeline("text-generation", model=model)
            result = generator(messages, max_new_tokens=128)[0]["generated_text"][-1][
                "content"
            ]

            result = text_extraction(result)
            batch_data.append(
                {
                    "text": result,
                    "label": batch_random_labels[i - start],
                    "model": model,
                }
            )

        # 将批次结果转换为 DataFrame
        batch_df = pd.DataFrame(batch_data)

        # 将 DataFrame 附加到 CSV 文件
        if batch == 0:
            # 如果是第一批，则写入标题
            batch_df.to_csv(output_path, mode="w", index=False)
        else:
            # 对于后续批次，追加时不写入标题
            batch_df.to_csv(output_path, mode="a", header=False, index=False)
        print(f"已保存第 {batch + 1}/{num_batches} 批次")
```
以下是一个示例输出。

```python
| text                                                                                                                                                                                       | label           | model                                 |
|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+-----------------+---------------------------------------|
| You're still whining about your membership renewal fee? It's not like we're the ones who raised the prices, it's the board's decision. You should just deal with it and stop complaining.  | impolite        | meta-llama/Meta-Llama-3.1-8B-Instruct |
| I'm not sure why our membership fees are higher this quarter, but I can check on the pricing for our tennis courts and see if there's a way to adjust your plan to fit your budget better. | somewhat polite | meta-llama/Meta-Llama-3.1-8B-Instruct |
```

### 进一步改进

为了提高我们数据生成器输出的质量，我们可以修改提示词并多样化模型。我们简要讨论每个方面。

**提示词**

通过提示词向模型传递明确的标签描述是一种良好的实践。例如，我们可以添加以下几行


```python
polite: Text is considerate and shows respect and good manners, often including courteous phrases and a friendly tone.
somewhat polite: Text is generally respectful but lacks warmth or formality, communicating with a decent level of courtesy.
neutral: Text is straightforward and factual, without emotional undertones or specific attempts at politeness.
impolite: Text is disrespectful or rude, often blunt or dismissive, showing a lack of consideration for the recipient's feelings.
```
到我们的提示词中。此外，我们可以要求语言模型提供其推理以支持指定标签的文本生成。以下是这样的改进提示词。


```python
prompt = f"""You should create synthetic data for specified labels and categories. 
            This is especially useful for developing customer service chatbots.
              
            Label descriptions:
            - polite: Text is considerate and shows respect and good manners, often including courteous phrases and a friendly tone.
            - somewhat polite: Text is generally respectful but lacks warmth or formality, communicating with a decent level of courtesy.
            - neutral: Text is straightforward and factual, without emotional undertones or specific attempts at politeness.
            - impolite: Text is disrespectful or rude, often blunt or dismissive, showing a lack of consideration for the recipient's feelings.

            Examples.

            LABEL: somewhat polite
            CATEGORY: travel
            TYPE: train
            OUTPUT: I understand your concern about your booking, and I'll check what options we have for you.
            REASONING: This text would be classified as "somewhat polite."
            The acknowledgment of the customer's concern shows a basic level of respect.
            The sentence is direct and lacks additional warmth or formality, but it communicates a willingness to help.
            The use of "I'll check" is a straightforward commitment to action without additional courteous phrases that would make it fully polite.
            
            LABEL: neutral
            CATEGORY: stores
            TYPE: appliances
            OUTPUT: Your TV will be delivered within three to five business days.
            REASONING: This text would be classified as "neutral."
            The sentence is purely informational, providing the facts about delivery time without any emotional undertones.
            There are no phrases that express politeness or rudeness; it's a straightforward statement.
            The tone is impersonal and focused solely on conveying the necessary information.
            ####################
            You should generate one OUTPUT for the classification below.
            Only return the OUTPUT and REASONING. 
            Do not return the LABEL, CATEGORY, or TYPE.

            LABEL: {batch_random_labels[i - start]}
            CATEGORY: {batch_random_categories[i - start]}
            TYPE: {random_type}
            OUTPUT:
            REASONING:
            """
```
**多样性**

为了进一步多样化输出数据，可以将多个不同的语言模型传递给合成数据生成器。当我们在 [Llama\-3\.1–8B\-Instruct](https://huggingface.co/meta-llama/Meta-Llama-3.1-8B-Instruct)、[gemma\-2–9b\-it](https://huggingface.co/google/gemma-2-9b-it) 和 [Mixtral\-8x7B\-Instruct\-v0\.1](https://huggingface.co/mistralai/Mixtral-8x7B-Instruct-v0.1) 上使用相同的生成器和提示时，我们观察到以下重复数据的百分比。

* **Llama:** 0\.04%
* **Gemma:** 94\.6%(注意：该模型没有经过任何系统指令的训练，因此需要相应修改 `messages`。)
* **Mixtral:** 7%

**注意事项** 在某些边缘情况下，语言模型可能会为不同的标签生成相同的文本！例如，当我们使用 Llama 3\.1 运行生成器时，以下输出是为 `neutral` 和 `somewhat polite` 标签生成的。


```python
I'm afraid the toy you're looking for is currently out of stock, but we do have a similar product that might interest you. Would you like me to check availability?
```

## 结论

使用语言模型生成合成数据是一种强大的工具，具有重塑人工智能未来的潜力。无论您是研究人员、开发人员还是商业领袖，理解这项技术都可能在不断发展的人工智能领域中提供竞争优势。

如果您有兴趣探索合成数据如何革新您的人工智能项目，可以考虑深入研究语言模型，编写自定义数据生成器，并尝试现有的数据生成工具，以开启新的可能性。

有关更多人工智能开发的实用内容，请访问 [Intel® AI Development Resources](https://www.intel.com/content/www/us/en/developer/topic-technology/artificial-intelligence/overview.html).

## 建议阅读

* <https://cookbook.openai.com/examples/sdg1>
* [https://www.confident\-ai.com/blog/the\-definitive\-guide\-to\-synthetic\-data\-generation\-using\-llms](https://www.confident-ai.com/blog/the-definitive-guide-to-synthetic-data-generation-using-llms)

