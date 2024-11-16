---
title: "Building a Reliable Text Classification Pipeline with LLMs: A Step-by-Step Guide"
meta_title: "Building a Reliable Text Classification Pipeline with LLMs: A Step-by-Step Guide"
description: "This tutorial outlines the development of a reliable text classification pipeline using large language models (LLMs). It discusses three key techniques: constrained generation, few-shot prompting, and dynamic example selection. Constrained generation ensures LLM outputs match predefined classes, reducing post-processing needs. Few-shot prompting enhances accuracy by providing example outputs, while dynamic selection retrieves relevant examples based on query similarity, significantly improving classification accuracy to 88.6%. The article emphasizes the adaptability of LLMs for effective text classification without extensive training or data collection."
date: 2024-11-16T11:03:12Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*Cmk7IkUnY-SIxhVF"
categories: ["Natural Language Processing", "Machine Learning", "Generative AI"]
author: "Rifx.Online"
tags: ["constrained", "generation", "prompting", "selection", "classification"]
draft: False

---





### Overcoming common challenges in LLM\-based text classification



In this step\-by\-step tutorial, we’ll walk through how to use large language models (LLMs) to build a text classification pipeline that is accurate and dependable. LLMs are powerful, generalist models that have demonstrated remarkable capabilities across various natural language processing tasks, and they’re increasingly replacing specialist models in many AI applications. However, using LLMs for classification can be tricky if not approached carefully.

A common issue when applying LLMs for classification is that the model might not respond with the expected output or format, leading to additional post\-processing that can be complex and time\-intensive. In this post, we’ll cover practical tips and techniques to address these challenges. Each of these strategies is simple to implement but can significantly improve both the accuracy and usability of LLMs as text classifiers. Let’s dive in to make your LLM text classification system both efficient and reliable.


## Main Ideas

In this tutorial, we’ll explore three key techniques that can make LLMs far more effective and efficient as text classifiers. **We won’t go into the fine\-tuning option for this tutorial**, but you can see some of my other posts in you are interested by this technique:

The first technique is *constrained generation*. This involves setting specific constraints that guide the LLM to generate tokens following a designated schema, which helps ensure the output matches the expected format. By applying these constraints, we can reduce the need for complex post\-processing to obtain class predictions in the correct format.

The second technique we’ll examine is *few\-shot prompting*. Few\-shot prompting works by providing the LLM with a few example outputs before it attempts to classify new data. Because LLMs are known to be strong in\-context learners, they can identify patterns from these examples and produce outputs that closely resemble them. This approach allows us to improve the accuracy of predictions by showing the LLM the types of responses it should generate.

Finally, we’ll introduce *dynamic example selection* for few\-shot prompting. Similar to retrieval\-augmented generation but designed for classification tasks, this approach dynamically selects examples based on similarity to the new input, using a nearest\-neighbor technique. This way, the LLM is presented with the most relevant input\-output pairs before it generates the final classification, leading to more precise predictions.

Each of these techniques will be explained in detail, with code examples based on the LangChain framework to simplify implementation. You’ll be able to incorporate these methods directly into your NLP toolkit or customize them to suit your specific needs for a reliable and accurate text classification pipeline.


## Why use LLMs for classification

Before we get started, let’s take a moment to consider why you might choose to use LLMs for text classification over a custom, specialized model.

One major advantage of using LLMs is their proficiency in zero\-shot and few\-shot predictions. Even with minimal data, LLMs often produce reasonable results, making them an excellent choice when labeled data is scarce. Additionally, as generalist models, LLMs have vast knowledge about the world, effectively memorizing information from a wide range of sources. This means they can sometimes handle unexpected inputs and still produce accurate predictions.

Another significant benefit is the convenience of accessing LLMs as a service. Many LLMs are now offered through cloud platforms, which means you don’t need to manage any infrastructure yourself. You simply pay for what you use, giving you the flexibility to scale as needed without investing in hardware or managing GPU resources. This can be a huge asset for AI applications, as it reduces upfront costs and eliminates the need to maintain complex machine learning infrastructure.

However, there are also some potential drawbacks to consider. One is latency: while custom, smaller classification models often respond in just a few tens of milliseconds, LLMs typically have higher latency, ranging from a few hundred milliseconds to several seconds depending on their size. This delay might be a disadvantage for applications that require real\-time processing.

Data privacy is another concern. If you need to keep all data within your own infrastructure for compliance or security reasons, using an LLM service might not be the best option. You would either need to host an LLM internally — which can be costly — or find an alternative that keeps data in\-house.

Another limitation is the reliance on the LLM service provider. Using an LLM as a service means you’re subject to its rate limits, latencies, and potential downtimes, over which you have little control. Any issue on the provider’s end could impact your ability to classify text reliably and promptly, which may be a drawback for applications requiring high reliability.

With these pros and cons in mind, you can evaluate whether using LLMs as classifiers suits your specific requirements. In any case, LLMs are a powerful tool to have in your data science toolkit, allowing you to quickly set up an AI service and get started on building impactful applications.


## Idea 1: Constrained Output for classification

Now that we’ve covered the context, let’s dive into the technical part of the tutorial. As mentioned earlier, our first technique is to implement **constrained generation** to ensure that the LLM only outputs valid class labels. By constraining the output to a predefined set of class names, we eliminate the need to parse or clean up free\-form responses, which reduces the likelihood of errors and improves the reliability of the classification pipeline.

To achieve this, we’ll use the LangChain OpenAI client wrapper, but works with any OpenAI\-compatible model *(We use [NebiusAI](https://studio.nebius.ai/) for these experiments)*. This wrapper will allow us to send structured queries to the LLM, following a specific schema that we’ll define.


### Step 1: Define the Output Schema

We start by defining the schema for the output, which will consist of a single category field. This field will use \`Literal\` types, listing each possible class name as a string. By doing this, we ensure that the LLM’s output is strictly one of these valid classes, which we can directly use as the model’s prediction.

The schema definition is implemented with \`pydantic\` as follows:


```python
from typing import Literal
from pydantic import BaseModel

def generate_classification_model(list_classes: list[str]):
    assert list_classes  # Ensure the list of classes is not empty

    class ClassificationOutput(BaseModel):
        category: Literal[tuple(list_classes)]

    return ClassificationOutput

## Example usage
if __name__ == "__main__":
    Categories = generate_classification_model(["Yes", "No"])
    categories = Categories(category="Yes")
    print(categories)
```
In this example, we create a Pydantic model called \`ClassificationOutput\` with a \`category\` field restricted to a list of literal values, such as “Yes” and “No.” This setup allows us to validate the LLM’s output, ensuring it is one of the predefined class names.


### Step 2: Construct and Send Messages

Next, we prepare a series of messages to send to the LLM. The first message is a system prompt that sets the context by describing the task (classification) and listing the possible output classes. This guides the LLM to produce outputs matching the desired schema. The second message contains the actual text we want the LLM to classify.

Using the LangChain client wrapper, we can configure our LLM with the following settings:


```python
import os
from typing import Literal

from dotenv import load_dotenv
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI
from pydantic import BaseModel

load_dotenv()


class ClassificationOutput(BaseModel):
    category: Literal["news", "clickbait"]


llm_client = ChatOpenAI(
    openai_api_base=os.environ.get("LLM_BASE_URL"),
    model="meta-llama/Meta-Llama-3.1-70B-Instruct",
    openai_api_key=os.environ.get("LLM_API_KEY"),
    temperature=0,
    max_retries=2,
)

constrained_llm = llm_client.with_structured_output(ClassificationOutput)

messages = [
    SystemMessage(
        content="Classify the following text into one of the predefined categories: news or clickbait"
    ),
    HumanMessage(content="You won't believe what happened next!"),
]
prediction = constrained_llm.invoke(messages)

print(prediction)

## Gives category='clickbait'
```
Using this approach, the LLM’s output will match our predefined classes, making it directly usable as a classification result without further processing.


### Step 3: Evaluation

To assess the model’s performance, we ran it on the [20 Newsgroups dataset](https://scikit-learn.org/0.19/datasets/twenty_newsgroups.html) (CC BY 4\.0\), where it achieved an accuracy of **76\.3%**. This setup demonstrates the effectiveness of constrained generation in improving classification accuracy and reducing the need for additional processing steps.


## Idea 2: Few\-shot prompting

The second technique is *few\-shot prompting*, where we include a few example input\-output pairs in the prompt to guide the LLM. This approach leverages the in\-context learning abilities of LLMs, which allows them to pick up on patterns from the examples provided, often resulting in improved classification accuracy. Here, we’ll implement few\-shot prompting by adding some sample classifications directly in the prompt to enhance the model’s output quality.

Let’s look into the code:


```python
import os
from typing import Literal

from dotenv import load_dotenv
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI
from pydantic import BaseModel

load_dotenv()


class ClassificationOutput(BaseModel):
    category: Literal["news", "clickbait"]


llm_client = ChatOpenAI(
    openai_api_base=os.environ.get("LLM_BASE_URL"),
    model="meta-llama/Meta-Llama-3.1-70B-Instruct",
    openai_api_key=os.environ.get("LLM_API_KEY"),
    temperature=0,
    max_retries=10,
)

constrained_llm = llm_client.with_structured_output(ClassificationOutput)

messages = [
    SystemMessage(
        content="Classify the following text into one of the predefined categories: news or clickbait"
    ),
    HumanMessage(content="The Shocking Truth Behind a Popular Wellness Trend"),
    AIMessage(content="clickbait"),
    HumanMessage(content="UK farmers call for weedkiller ban over Parkinson’s fears"),
    AIMessage(content="news"),
    HumanMessage(content="You won't believe what happened next!"),
]
prediction = constrained_llm.invoke(messages)

print(prediction)

## Gives category='clickbait'
```
In this setup, we construct a conversation history with both *HumanMessage* and *AIMessage* types to simulate examples of how we expect the LLM to classify text. By demonstrating the classification style and format we want — such as categorizing “The Shocking Truth Behind a Popular Wellness Trend” as “clickbait” and “UK farmers call for weedkiller ban over Parkinson’s fears” as “news” — we set clear expectations for the model. When the final classification request, “You won’t believe what happened next!” is sent, the LLM can leverage these examples to determine the appropriate response.

After testing this few\-shot approach, we observed an accuracy of **76\.6%**, a slight improvement over our constrained generation method. However, since the examples were selected randomly, this might not fully demonstrate the potential of few\-shot prompting. Carefully choosing or curating the examples to match the input data more closely could yield even better results. In the next part of this tutorial, we’ll look at a more advanced technique: dynamically selecting examples based on similarity, which could further improve accuracy.


## Idea 3: Dynamic Example selection

Our third technique for improving classification accuracy with LLMs is dynamically selecting relevant examples based on the text in the query. Instead of using a static few\-shot prompt, we perform a similarity search for each query using ChromaDB to identify its nearest neighbors from a labeled training set. By selecting examples that are contextually similar to the input text, we can provide the LLM with highly relevant information, increasing the likelihood of an accurate classification.

To implement this, we start by building an embedding\-based retrieval system. Here’s how it works:


### Step 1: Initialize the Classifier with Dynamic Prompting

Our `LLMTextClassifier` class takes the list of possible categories and builds a prompt template for classification. We configure the classifier to retrieve a set number of examples (controlled by `max_examples`) that are most similar to the query text.

Using this setup, the classifier dynamically selects examples, injecting them into the prompt in the same format as the few\-shot examples in the previous method:


```python
class LLMTextClassifier:
    def __init__(
        self,
        categories: list[str],
        system_prompt_template: PromptTemplate = PromptTemplate(
            input_variables=["categories", "schema"],
            template="Classify the following text into one of the following classes: {categories}.\n "
            "Use the following schema: {schema}",
        ),
        llm_client: BaseChatModel = llm_medium,
        max_examples: int = 5,
    ):
        # Initialize model, prompt, and retrieval variables
        self.categories = categories
        self.categories_model = generate_classification_model(categories)
        self.system_prompt_template = system_prompt_template
        self.system_prompt = system_prompt_template.format(
            categories=categories, schema=self.categories_model.model_json_schema()
        )
        self.llm_classifier = llm_client.with_structured_output(self.categories_model)
        self.max_examples = max_examples
        self.examples = None
        self.vector_store = None
        self.retriever = None
```

### Step 2: “Train” the Classifier with Example Data

To “train” our classifier (train used loosely here, as no weights are updated), we populate the vector store with training data examples labeled with their respective categories. This setup prepares the classifier to retrieve the most relevant examples dynamically when a new query is input:


```python
    def fit(self, texts, labels):
        self.examples = [
            Document(page_content=text, metadata={"label": label})
            for text, label in zip(texts, labels)
        ]

        if len(self.examples) > self.max_examples:
            # Add examples to vector store
            self.vector_store = Chroma.from_documents(
                documents=self.examples,
                collection_name="llm-classifier",
                embedding=ChromaEmbeddingsAdapter(
                    embedding_functions.DefaultEmbeddingFunction()
                ),
            )
            self.retriever = self.vector_store.as_retriever(
                search_kwargs={"k": self.max_examples}
            )
```

### Step 3: Dynamically Retrieve Relevant Examples and Classify

When a new text is input for classification, the classifier retrieves relevant examples based on similarity to the query. This list of relevant examples is added to the prompt, followed by the query itself, and sent to the LLM for classification:


```python
 def predict(self, text: str) -> str:
        messages = [SystemMessage(content=self.system_prompt)]
        
        for example in self.fetch_examples(text=text):
            messages.append(HumanMessage(content=example.page_content))
            messages.append(AIMessage(content=example.metadata["label"]))

        messages.append(HumanMessage(content=text))
        prediction = self.llm_classifier.invoke(messages)

        return prediction.category
```

### Step 4: Example run


```python
if __name__ == "__main__":
    categories = ["news", "clickbait"]
    classifier = LLMTextClassifier(categories=categories, max_examples=1)

    texts = ["Donald Trump won Michigan", "You won't believe what happened next!"]
    labels = ["news", "clickbait"]
    
    classifier.fit(texts, labels)

    text = "Donald Trump won Florida"
    result = classifier.predict(text)
    print(result)  # Should output "news" if similar to "news" examples
```
Using the dynamic few\-shot technique, we saw a significant improvement in classification accuracy, reaching **88\.6%**. This marks a considerable increase over previous methods, demonstrating the power of dynamically selecting relevant examples based on similarity to the query text.


## Conclusion

In this post, we explored a simple yet powerful approach to building a reliable and accurate text classification pipeline using large language models (LLMs). We walked through three key techniques: *constrained generation*, *few\-shot prompting*, and *dynamic few\-shot selection*. Each of these methods contributes unique strengths to improve classification accuracy and usability, transforming LLMs into effective tools for text classification.

The first technique, constrained generation, involved limiting the LLM’s responses to predefined classes, reducing the need for complex post\-processing and making it easier to parse the model’s outputs. This approach alone allowed us to avoid common pitfalls of free\-form text generation, improving the LLM’s consistency in classification.

Next, we implemented few\-shot prompting, where we provided the LLM with a few labeled examples as part of the prompt. By leveraging the model’s in\-context learning ability, few\-shot prompting improved classification accuracy by setting clear expectations for the output format and content. However, we saw that the selection of examples is crucial — randomly chosen examples offered only a modest improvement. This led us to our final technique: dynamic few\-shot selection.

Dynamic few\-shot selection was the most advanced and effective approach, achieving a high classification accuracy of 88\.6%. By using ChromaDB to retrieve the most similar examples for each query, this technique allowed the LLM to access only the most relevant context, which significantly enhanced its predictive accuracy. This method is a practical way to make generalized models like LLMs perform more like specialized classifiers, without the need to train a custom model from scratch.


### Final Thoughts

As LLMs become more accessible and powerful, their applications in natural language processing tasks continue to grow. While these models are typically generalized, our tutorial demonstrates that with targeted techniques, they can be adapted into high\-performing classifiers. Each of the methods we covered here — from straightforward constrained generation to advanced dynamic few\-shot selection — offers flexibility and adaptability. They provide scalable solutions for building classification systems, making it feasible to integrate LLMs into production without extensive data collection or training.

Whether you’re an NLP practitioner, a data scientist, or an AI enthusiast, these techniques add versatile tools to your machine learning toolkit. With LLMs and these techniques, you can deploy robust and effective text classification systems tailored to your specific needs.

Thank you for reading!

Code: <https://github.com/CVxTz/llmclassifier>


