---
title: "使用 LLMs 构建可靠的文本分类管道：分步指南"
meta_title: "使用 LLMs 构建可靠的文本分类管道：分步指南"
description: "本文介绍了如何使用大型语言模型（LLMs）构建可靠的文本分类管道，重点探讨了三种关键技术：受限生成、少量示例提示和动态示例选择。受限生成通过限制模型输出在预定义类别内，减少了后处理需求；少量示例提示利用模型的上下文学习能力以提高分类准确性；动态示例选择则通过检索与输入文本相似的示例，显著提升分类准确率至88.6%。这些方法展示了LLMs在文本分类中的有效性和灵活性，为构建高性能分类系统提供了可行的解决方案。"
date: 2024-11-16T01:24:58Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*Cmk7IkUnY-SIxhVF"
categories: ["Natural Language Processing", "Machine Learning", "Generative AI"]
author: "Rifx.Online"
tags: ["constrained", "generation", "prompting", "selection", "classification"]
draft: False

---



### 克服基于LLM的文本分类中的常见挑战



在本分步教程中，我们将介绍如何使用大型语言模型（LLMs）构建一个准确且可靠的文本分类管道。LLMs是强大的通用模型，在各种自然语言处理任务中展示了卓越的能力，并且它们在许多人工智能应用中越来越多地取代了专业模型。然而，如果不谨慎处理，使用LLMs进行分类可能会很棘手。

在将LLMs应用于分类时，一个常见的问题是模型可能无法以预期的输出或格式响应，从而导致额外的后处理，而这些后处理可能复杂且耗时。本文将涵盖解决这些挑战的实用技巧和技术。每种策略都易于实施，但可以显著提高LLMs作为文本分类器的准确性和可用性。让我们深入探讨，使您的LLM文本分类系统既高效又可靠。

## 主要思想

在本教程中，我们将探讨三种关键技术，这些技术可以使 LLM 在文本分类器中变得更加有效和高效。**本教程中我们不会深入讨论微调选项**，但如果您对这一技术感兴趣，可以查看我其他的一些帖子：

第一种技术是 *受限生成*。这涉及设定特定的约束，引导 LLM 生成遵循指定架构的标记，这有助于确保输出符合预期格式。通过应用这些约束，我们可以减少复杂后处理的需要，以获得正确格式的类别预测。

我们将研究的第二种技术是 *少量示例提示*。少量示例提示通过在 LLM 尝试分类新数据之前提供一些示例输出来工作。由于 LLM 被认为是强大的上下文学习者，它们能够从这些示例中识别模式，并生成与之相似的输出。这种方法使我们能够通过向 LLM 展示它应该生成的响应类型来提高预测的准确性。

最后，我们将介绍用于少量示例提示的 *动态示例选择*。类似于增强检索生成，但专为分类任务设计，这种方法基于与新输入的相似性动态选择示例，使用最近邻技术。这样，LLM 在生成最终分类之前，会接收到最相关的输入-输出对，从而导致更精确的预测。

每种技术将详细解释，并提供基于 LangChain 框架的代码示例以简化实现。您将能够将这些方法直接纳入您的 NLP 工具包，或根据您的特定需求进行定制，以便建立一个可靠且准确的文本分类管道。

## 为什么使用 LLM 进行分类

在开始之前，让我们花一点时间考虑一下为什么您可能选择使用 LLM 进行文本分类，而不是使用定制的专用模型。

使用 LLM 的一个主要优势是它们在零样本和少样本预测方面的熟练程度。即使数据量很少，LLM 通常也能产生合理的结果，这使得它们在标记数据稀缺时成为极好的选择。此外，作为通用模型，LLM 对世界有着广泛的知识，有效地记忆来自各种来源的信息。这意味着它们有时能够处理意外输入，并仍然产生准确的预测。

另一个显著的好处是方便访问 LLM 作为服务。许多 LLM 现在通过云平台提供，这意味着您不需要自己管理任何基础设施。您只需为所使用的服务付费，这为您提供了灵活性，可以根据需要进行扩展，而无需投资硬件或管理 GPU 资源。这对 AI 应用程序来说是一个巨大的资产，因为它降低了前期成本，并消除了维护复杂机器学习基础设施的必要性。

然而，也有一些潜在的缺点需要考虑。一个是延迟：虽然定制的小型分类模型通常在几十毫秒内响应，但 LLM 的延迟通常更高，范围从几百毫秒到几秒，具体取决于其大小。对于需要实时处理的应用程序，这种延迟可能是一个缺点。

数据隐私是另一个关注点。如果您需要出于合规或安全原因将所有数据保留在自己的基础设施中，使用 LLM 服务可能不是最佳选择。您要么需要在内部托管 LLM——这可能会很昂贵——要么寻找一种能够将数据保留在内部的替代方案。

另一个限制是对 LLM 服务提供商的依赖。将 LLM 作为服务使用意味着您受到其速率限制、延迟和潜在停机时间的影响，而您对此几乎没有控制权。提供商端的任何问题都可能影响您可靠和及时地分类文本的能力，这可能是对需要高可靠性的应用程序的一个缺点。

考虑到这些优缺点，您可以评估使用 LLM 作为分类器是否适合您的特定需求。无论如何，LLM 是您数据科学工具包中一个强大的工具，使您能够快速设置 AI 服务并开始构建有影响力的应用程序。

## 想法 1：分类的约束输出

现在我们已经覆盖了背景，让我们深入教程的技术部分。如前所述，我们的第一个技术是实现**约束生成**，以确保LLM仅输出有效的类别标签。通过将输出限制为预定义的类别名称集合，我们消除了解析或清理自由格式响应的需要，从而减少了错误的可能性，并提高了分类管道的可靠性。

为此，我们将使用LangChain OpenAI客户端包装器，但它适用于任何与OpenAI兼容的模型*(我们在这些实验中使用[NebiusAI](https://studio.nebius.ai/))*。这个包装器将允许我们向LLM发送结构化查询，遵循我们将定义的特定模式。

### 第一步：定义输出模式

我们首先定义输出的模式，该模式将由一个类别字段组成。该字段将使用 \`Literal\` 类型，列出每个可能的类名作为字符串。通过这样做，我们确保 LLM 的输出严格是这些有效类中的一个，我们可以直接将其用作模型的预测。

模式定义使用 \`pydantic\` 实现如下：

```python
from typing import Literal
from pydantic import BaseModel

def generate_classification_model(list_classes: list[str]):
    assert list_classes  # 确保类列表不为空

    class ClassificationOutput(BaseModel):
        category: Literal[tuple(list_classes)]

    return ClassificationOutput

## 示例用法
if __name__ == "__main__":
    Categories = generate_classification_model(["Yes", "No"])
    categories = Categories(category="Yes")
    print(categories)
```
在这个示例中，我们创建了一个名为 \`ClassificationOutput\` 的 Pydantic 模型，具有一个 \`category\` 字段，该字段限制为一组字面值，如“Yes”和“No”。这个设置使我们能够验证 LLM 的输出，确保它是预定义类名之一。

### 第2步：构建并发送消息

接下来，我们准备一系列消息发送给LLM。第一条消息是系统提示，通过描述任务（分类）并列出可能的输出类别来设置上下文。这引导LLM生成与所需模式匹配的输出。第二条消息包含我们希望LLM分类的实际文本。

使用LangChain客户端包装器，我们可以使用以下设置配置我们的LLM：

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
        content="将以下文本分类为预定义类别之一：新闻或点击诱饵"
    ),
    HumanMessage(content="你不会相信接下来发生了什么！"),
]
prediction = constrained_llm.invoke(messages)

print(prediction)

## Gives category='clickbait'
```
通过这种方法，LLM的输出将与我们预定义的类别匹配，使其可以直接作为分类结果使用，而无需进一步处理。

### 第3步：评估

为了评估模型的性能，我们在[20 Newsgroups数据集](https://scikit-learn.org/0.19/datasets/twenty_newsgroups.html)（CC BY 4\.0\）上进行了测试，模型的准确率达到了**76\.3%**。该设置展示了受限生成在提高分类准确性和减少额外处理步骤方面的有效性。

## Idea 2: Few\-shot prompting

第二种技术是 *few\-shot prompting*，我们在提示中包含一些示例输入\-输出对，以引导LLM。这种方法利用了LLM的上下文学习能力，使其能够从提供的示例中捕捉模式，通常会导致分类准确性的提高。在这里，我们将通过在提示中直接添加一些示例分类来实现few\-shot prompting，以增强模型的输出质量。

让我们来看看代码：

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
在这个设置中，我们构建了一个包含 *HumanMessage* 和 *AIMessage* 类型的对话历史，以模拟我们期望LLM对文本进行分类的示例。通过展示我们想要的分类风格和格式——例如将“The Shocking Truth Behind a Popular Wellness Trend”分类为“clickbait”，将“UK farmers call for weedkiller ban over Parkinson’s fears”分类为“news”——我们为模型设定了明确的期望。当最终的分类请求“You won’t believe what happened next!”被发送时，LLM可以利用这些示例来确定适当的响应。

在测试这种few\-shot方法后，我们观察到准确率为 **76\.6%**，比我们的约束生成方法略有提高。然而，由于示例是随机选择的，这可能无法充分展示few\-shot prompting的潜力。仔细选择或策划与输入数据更紧密匹配的示例可能会产生更好的结果。在本教程的下一部分，我们将研究一种更高级的技术：基于相似性动态选择示例，这可能进一步提高准确性。

## 想法 3：动态示例选择

我们提高 LLM 分类准确性的第三种技术是根据查询中的文本动态选择相关示例。我们不是使用静态的少量示例提示，而是针对每个查询使用 ChromaDB 进行相似性搜索，以识别其在标记训练集中的最近邻。通过选择与输入文本在语境上相似的示例，我们可以为 LLM 提供高度相关的信息，从而增加准确分类的可能性。

要实现这一点，我们首先构建一个基于嵌入的检索系统。它的工作原理如下：

### 第一步：使用动态提示初始化分类器

我们的 `LLMTextClassifier` 类接受可能类别的列表，并构建一个用于分类的提示模板。我们配置分类器以检索与查询文本最相似的一定数量的示例（由 `max_examples` 控制）。

使用此设置，分类器动态选择示例，将它们注入提示中，格式与前一种方法中的少量示例相同：

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

### 第2步：“训练”分类器与示例数据

为了“训练”我们的分类器（这里的训练是宽泛的，因为没有更新权重），我们用标记了各自类别的训练数据示例填充向量存储。这一设置为分类器在输入新查询时动态检索最相关的示例做好准备：

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

### 第3步：动态检索相关示例并分类

当输入新的文本进行分类时，分类器根据与查询的相似性检索相关示例。这个相关示例的列表被添加到提示中，紧接着是查询本身，然后发送给LLM进行分类：

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

### 第4步：示例运行


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
使用动态少样本技术，我们在分类准确率上看到了显著提高，达到了 **88.6%**。这比以前的方法有了显著的增加，展示了根据与查询文本的相似性动态选择相关示例的强大能力。

## 结论

在本文中，我们探讨了一种简单而强大的方法，通过使用大型语言模型（LLMs）构建可靠且准确的文本分类管道。我们介绍了三种关键技术：*受限生成*、*少量示例提示*和*动态少量示例选择*。这些方法各自带来了独特的优势，以提高分类的准确性和可用性，使LLMs成为有效的文本分类工具。

第一种技术，受限生成，涉及将LLM的响应限制在预定义的类别内，减少了复杂后处理的需求，并使解析模型输出变得更容易。仅凭这一方法，我们就能够避免自由文本生成的常见陷阱，提高LLM在分类中的一致性。

接下来，我们实施了少量示例提示，我们向LLM提供了一些标记的示例作为提示的一部分。通过利用模型的上下文学习能力，少量示例提示通过为输出格式和内容设定明确的期望，提高了分类准确性。然而，我们发现示例的选择至关重要——随机选择的示例仅提供了适度的改善。这使我们转向了最后一种技术：动态少量示例选择。

动态少量示例选择是最先进和有效的方法，达到了88.6%的高分类准确率。通过使用ChromaDB为每个查询检索最相似的示例，这种技术使LLM仅访问最相关的上下文，从而显著增强了其预测准确性。这种方法是一种实用的方式，使像LLMs这样的通用模型表现得更像专业分类器，而无需从头开始训练自定义模型。

### 最后的思考

随着LLMs变得越来越可访问和强大，它们在自然语言处理任务中的应用也不断增长。虽然这些模型通常是通用的，但我们的教程展示了通过有针对性的技术，它们可以被调整为高性能的分类器。我们在这里介绍的每种方法——从简单的约束生成到先进的动态少量样本选择——都提供了灵活性和适应性。它们为构建分类系统提供了可扩展的解决方案，使得将LLMs集成到生产中变得可行，而无需大量的数据收集或训练。

无论您是NLP从业者、数据科学家还是AI爱好者，这些技术都为您的机器学习工具包增加了多功能的工具。借助LLMs和这些技术，您可以部署针对特定需求量身定制的强大有效的文本分类系统。

感谢您的阅读！

Code: <https://github.com/CVxTz/llmclassifier>

