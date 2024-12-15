---
title: "Synthetic Data Generation with Language Models: A Practical Guide"
meta_title: "Synthetic Data Generation with Language Models: A Practical Guide"
description: "Synthetic data generation using language models offers a solution to challenges in acquiring real-world data for AI training. This technique enables the creation of realistic datasets while preserving privacy and addressing data shortages. However, limitations such as lack of authenticity and potential biases must be managed through hybrid approaches and diverse data generation methods. The article provides a practical guide for implementing a synthetic data generator in Python, emphasizing the importance of validating models with real datasets and improving output quality through refined prompts and model diversity."
date: 2024-12-15T01:34:53Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*MfgqkW1LzAEC0PAAQ-H8SQ.jpeg"
categories: ["Programming", "Data Science", "Generative AI"]
author: "Rifx.Online"
tags: ["synthetic", "generation", "language", "models", "validation"]
draft: False

---






In the evolving landscape of artificial intelligence, data remains the fuel that powers innovation. But what happens when acquiring real\-world data becomes challenging, expensive, or even impossible?

Enter synthetic data generation — a groundbreaking technique that leverages language models to create high\-quality, realistic datasets. Consider training a language model on medical records without breaching privacy laws, or developing a customer interaction model without access to private conversation logs, or designing autonomous driving systems where collecting data on rare edge cases is nearly impossible. Synthetic data bridges gaps in data availability while maintaining the realism needed for effective AI training.

Beyond addressing data shortages, synthetic data enhances AI development by balancing imbalanced datasets (e.g., in fraud detection or rare medical conditions), simulating rare events, and augmenting limited data with realistic variations. Companies can accelerate development, improve model robustness, and experiment with datasets otherwise unavailable.

While the benefits of synthetic data — such as scalability, privacy preservation, and the ability to simulate hard\-to\-capture scenarios — are clear, it also has limitations, including limited real\-world credibility, overfitting, and bias, which require careful consideration.

In this article, we’ll explore synthetic data generation, discuss its limitations and ways to overcome them, and show you how to implement your own synthetic data generator in Python.


## How to Overcome the Limitations of Synthetic Data


### 1\. Lack of Real\-World Authenticity

Synthetic data may not fully capture the nuances and variability of real\-world data, leading to models that perform well in controlled environments but fail in real\-world applications.

**How to Overcome:**

* **Hybrid Approach:** *Use synthetic data to augment real data, not replace it.* A combination ensures that the model can generalize to unseen, real\-world scenarios.
* **Validation on Real Data:** *Always validate models on real\-world datasets,* even if training is done with synthetic data, to assess performance in practical applications and to ensure robustness.


### 2\. Overfitting and Bias

Models trained on synthetic data might overfit to the patterns in that data, which may not exist in real\-world data. This can lead to poor generalization when deployed. Also, Synthetic data can inherit or amplify biases present in the models used to generate it. This can result in biased predictions.

**How to Overcome:**

* **Data Regularization:** *Apply data augmentation techniques and introduce noise in synthetic data* to mimic the randomness and variability of real\-world data.
* **Diverse Data Generation:** *Ensure diversity in the synthetic data by using multiple model*s and methods to generate data from different perspectives.

In addition, keep in mind that ensuring the quality and representativeness of synthetic data can be difficult and often a little experimentation with **few\-shot learning (FSL)** and **chain\-of\-thought (CoT) prompting** in prompt engineering can go a long way. We shall illustrate these in more detail below.


## Synthetic Data Generator Implementation


> You can run this tutorial on the [Intel® Tiber™ AI Cloud](https://cloud.intel.com/) environment, which is equipped with an Intel® Xeon® CPU. This platform provides ample computing resources ensuring smooth execution of our code.


### Environment Setup

Let’s begin with importing the necessary libraries. In our demo we shall use [Llama 3\.1](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-ai-solutions-support-meta-llama-3-1-launch.html) and you will need a Hugging Face token to access this model’s gated repository. You may create and access your tokens directly from your Hugging Face account. To do so, select “Access Tokens” from your settings menu and create a token with the “write” permission.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*y0t9XaNvc7WIwZP0V2DQKg.png)

Now, you can insert your token in your Python script. (Do not share your Access Tokens with anyone; Hugging Face removes any leaked Access Tokens.)


```python
import random
import pandas as pd
from transformers import pipeline
from huggingface_hub import login

login("your_token")
```
Next, go to [meta\-llama/Meta\-Llama\-3\.1–8B\-Instruct](https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct) and read the license before providing your information and submitting the Llama 3\.1 access request.


### Implementation

Let’s say we want to generate synthetic customer service texts classified by the following labels


```python
labels = ["polite", "somewhat polite", "neutral", "impolite"]
```
in these contexts


```python
categories_types = {
    "travel": ["air", "train"],
    "stores": ["appliances", "toys and games"]
}
```

> We shall randomly select labels and categories and instruct the language model to generate synthetic data based on the specified categories and labels.

Randomness will ensure *data regularization*; see the second challenge (Overfitting and Bias) above. Once we have selected a context category, we randomly choose a corresponding type from our dictionary as follows.


```python
random.choices(categories_types[category])
```
Here’s how we go about the full implementation: we generate data in batches and our function randomly assigns labels and categories to the batch’s samples. For each sample in the batch, the `sdg` function:

* Creates a prompt that instructs the language model to generate a synthetic customer service response based on the assigned label and category.
* Uses the language model to generate a response to the prompt.
* Extracts the relevant text from the generated response. You can leave the `text_extraction` function as an identity function for now, since its exact definition depends on factors like the prompt. It can be easily handled with regular expressions, for example.

Finally, each batch of the generated responses, along with their labels and the model used is appended to a CSV file.


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
    Generates synthetic data based on specified categories and labels.

    Args:
        sample_size (int): The number of synthetic data samples to generate.
        labels (list of str): The labels used to classify the synthetic data.
        categories_types (dict): The categories and their types for data generation and diversification.
        batch_size (int): The number of samples per batch to append to the output file.
        output_dir (str): The directory path where the output file will be saved.
        model (str): The large language model used for generating the synthetic data.
    """
    
    categories = list(categories_types.keys())

    # If sample_size is not divisible by batch_size, an extra batch is added
    num_batches = (sample_size + batch_size - 1) // batch_size

    print(f"Synthetic data will be appended to {output_path} in {num_batches} batches.")

    for batch in range(num_batches):
        # Calculate the start and end indices for the current batch
        start = batch * batch_size
        end = min(start + batch_size, sample_size)

        # Store results of the current batch
        batch_data = []

        # Assign random labels to the current batch
        batch_random_labels = random.choices(labels, k=batch_size)

        # Assign random categories to the current batch
        batch_random_categories = random.choices(categories, k=batch_size)

        for i in range(start, end):
            random_type = random.choices(
                categories_types[batch_random_categories[i - start]]
            )
            prompt = f"""I am creating synthetic OUTPUT to fine-tune
            my BERT model. The use case is customer service chatbots.
            You should generate only one OUTPUT for the classification
            LABEL: {batch_random_labels[i - start]} in CATEGORY:
            {batch_random_categories[i - start]} and TYPE
            {random_type}. 

            Examples. 
            OUTPUT: The fee you’re seeing is likely related
            to our standard account maintenance charges. I can provide
            more details if needed.

            OUTPUT: You can return it, but only if you have the
            receipt and it’s within the return window.

            OUTPUT: It's not our fault your baggage didn't make it.
            What do you expect us to do about it now?

            OUTPUT: I apologize for the trouble you’ve had with the
            heater. We can certainly look into a return or exchange.
            Please bring in your receipt, and we’ll take care of it
            for you.

            Only return one OUTPUT and not the LABEL or the CATEGORY.
            """
            messages = [
                {
                    "role": "system",
                    "content": f"You are a helpful assistant designed to generate synthetic customer service data with labels {labels} in categories {categories}.",
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

        # Convert the batch results to a DataFrame
        batch_df = pd.DataFrame(batch_data)

        # Append the DataFrame to the CSV file
        if batch == 0:
            # If it's the first batch, write headers
            batch_df.to_csv(output_path, mode="w", index=False)
        else:
            # For subsequent batches, append without headers
            batch_df.to_csv(output_path, mode="a", header=False, index=False)
        print(f"Saved batch number {batch + 1}/{num_batches}")
```
Here’s a sample output.


```python
| text                                                                                                                                                                                       | label           | model                                 |
|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+-----------------+---------------------------------------|
| You're still whining about your membership renewal fee? It's not like we're the ones who raised the prices, it's the board's decision. You should just deal with it and stop complaining.  | impolite        | meta-llama/Meta-Llama-3.1-8B-Instruct |
| I'm not sure why our membership fees are higher this quarter, but I can check on the pricing for our tennis courts and see if there's a way to adjust your plan to fit your budget better. | somewhat polite | meta-llama/Meta-Llama-3.1-8B-Instruct |
```

### Further Improvements

To improve the quality of the outputs of our data generator, we could modify the prompt and diversify the model. We discuss each of these briefly.

**Prompt**

It’s good practice to pass explicit label descriptions to the model through the prompt. For instance, we could add the lines


```python
polite: Text is considerate and shows respect and good manners, often including courteous phrases and a friendly tone.
somewhat polite: Text is generally respectful but lacks warmth or formality, communicating with a decent level of courtesy.
neutral: Text is straightforward and factual, without emotional undertones or specific attempts at politeness.
impolite: Text is disrespectful or rude, often blunt or dismissive, showing a lack of consideration for the recipient's feelings.
```
to our prompt. Additionally, we could require the language model to provide its reasoning to support the text generation for the specified label. Here is such an improved prompt.


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
**Diversity**

To further diversify the output data, one can pass multiple different language models to the synthetic data generator. When we used identical generators and prompts on [Llama\-3\.1–8B\-Instruct](https://huggingface.co/meta-llama/Meta-Llama-3.1-8B-Instruct), [gemma\-2–9b\-it](https://huggingface.co/google/gemma-2-9b-it), and [Mixtral\-8x7B\-Instruct\-v0\.1](https://huggingface.co/mistralai/Mixtral-8x7B-Instruct-v0.1), we observed the following percentages of duplicated data.

* **Llama:** 0\.04%
* **Gemma:** 94\.6%(Note: This model wasn’t trained with any system instructions, so you need to modify `messages` accordingly.)
* **Mixtral:** 7%

**Gotcha Alert** In some edge cases the language model might generate the same text for different labels! For instance, when we ran the generator with Llama 3\.1, the following output was generated for both `neutral` and `somewhat polite` labels.


```python
I'm afraid the toy you're looking for is currently out of stock, but we do have a similar product that might interest you. Would you like me to check availability?
```

## Conclusion

Synthetic data generation with language models is a powerful tool that has the potential to reshape the future of AI. Whether you’re a researcher, developer, or business leader, understanding this technology could provide a competitive edge in the evolving AI landscape.

If you’re interested in exploring how synthetic data can revolutionize your AI projects, consider diving deeper into language models, writing your custom data generators, and experimenting with existing data generation tools to unlock new possibilities.

For more AI development how\-to content, visit [Intel® AI Development Resources](https://www.intel.com/content/www/us/en/developer/topic-technology/artificial-intelligence/overview.html).


## Suggested Reading

* <https://cookbook.openai.com/examples/sdg1>
* [https://www.confident\-ai.com/blog/the\-definitive\-guide\-to\-synthetic\-data\-generation\-using\-llms](https://www.confident-ai.com/blog/the-definitive-guide-to-synthetic-data-generation-using-llms)

