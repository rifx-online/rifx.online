---
title: "如何使用结构化生成进行法律硕士即法官评估"
meta_title: "如何使用结构化生成进行法律硕士即法官评估"
description: "本文探讨了结构化生成在大型语言模型（LLM）评估中的应用，特别是作为评判者的角色。结构化生成通过限制输出格式，提高了LLM评估的可靠性，尤其在幻觉检测和内容审核等复杂任务中表现出色。文章详细介绍了如何使用结构化生成定义模式、解析输出，并通过示例展示其在幻觉检测中的具体实现。此外，结构化生成还为构建多步骤的复杂评估提供了可能，预示着LLM评估的未来将更加依赖开源和本地化模型。"
date: 2024-12-15T01:37:36Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*OVt7vjLxGE6GsMkPbFsFFA.jpeg"
categories: ["Generative AI", "Machine Learning", "Natural Language Processing"]
author: "Rifx.Online"
tags: ["structured", "generation", "hallucination", "grammars", "evaluations"]
draft: False

---



### 结构化生成是构建复杂的多步骤推理代理在LLM评估中的基础——尤其是对于开源模型



*披露：我是[Opik](https://github.com/comet-ml/opik)的维护者，这是本文后面使用的开源项目之一。*

在过去几个月里，我一直在为语言模型开发基于LLM的评估（“LLM作为评判者”指标）。到目前为止，结果非常令人鼓舞，尤其是在像幻觉检测或内容审核这样的评估中，这些评估很难通过启发式方法量化。

然而，工程化基于LLM的指标却出乎意料地具有挑战性。评估和单元测试，尤其是那些具有更复杂逻辑的测试，要求你了解数据的结构。由于LLM及其概率输出，很难可靠地输出特定的格式和结构。一些托管模型提供商现在提供`结构化输出`模式，但这些模式仍然存在局限性，如果你使用的是开源或本地模型，这些模式对你帮助不大。

解决这个问题的方法是使用**结构化生成**。除了能够使基于LLM的评估更可靠外，它还解锁了一种全新的复杂强大的多阶段评估类别。

在这篇文章中，我想介绍结构化生成及其背后的一些重要思想，然后深入探讨使用LLM评判者进行幻觉检测的具体示例。以下所有代码示例都可以在这个[Colab笔记本](https://colab.research.google.com/drive/1-lQn0qvJMN1BBuDjRuCzySA7gLhpcdBo#scrollTo=8QOySg8J5AcT)中运行，因此在跟随的过程中可以随意运行这些示例。

## 结构化生成与上下文无关文法的简要介绍

结构化生成是机器学习的一个子领域，专注于通过限制输出以适应某种特定模式来引导生成模型的输出。例如，与其微调模型以输出有效的 JSON，不如约束一个更通用模型的输出仅匹配有效的 JSON 模式。

您可以通过不同的策略来约束模型的输出，但最常见的方法是在采样阶段直接干预，使用一些外部模式来防止采样“错误”的标记。

目前，结构化生成已成为 LLM 服务器中的一种相当常见的功能。vLLM、NVIDIA NIM、llama.cpp 和 Ollama 都支持它。如果您不使用模型服务器，像 [Outlines](https://github.com/dottxt-ai/outlines) 这样的库使得为任何模型实现这一功能变得简单。OpenAI 还提供了“结构化输出”模式，类似地允许您从其 API 中指定响应模式。

但是，我发现从零开始尝试简单的实现有助于我对概念形成直觉，这就是我们在这里要做的。

结构化生成主要有两个组成部分：

* 定义模式
* 解析输出

对于模式，我将使用上下文无关文法 (CFG)。如果您不熟悉，文法是解析语言的模式。宽泛地说，它定义了什么被视为“有效”，什么不被视为“有效”。如果您有兴趣深入了解，上下文无关语言是乔姆斯基语言层次的一部分。出色的 Kay Lack 有 [一段精彩的文法和解析入门视频](https://www.youtube.com/watch?v=ENKT0Z3gldE)。

解析和构建 CFG 的最流行库是 Lark。在下面的代码中，我使用该库编写了一个简单的 JSON 文法：

```python
from lark import Lark

grammar = r"""
?start: value

?value: object
       | array
       | ESCAPED_STRING
       | SIGNED_NUMBER      -> number
       | "true"             -> true
       | "false"            -> false
       | "null"             -> null

array  : "[" [value ("," value)*] ["]"]
object : "{" [pair ("," pair)*] ["}"]
pair   : ESCAPED_STRING ":" value

%import common.ESCAPED_STRING
%import common.SIGNED_NUMBER
%import common.WS_INLINE
%ignore WS_INLINE
"""

parser = Lark(grammar, start="start", parser="lalr", debug=True)
```
如果您不熟悉 CFG 或 Lark，上面的内容可能看起来有点令人生畏，但实际上相当简单。`?start` 行表示我们以 `value` 开始。然后我们定义 `value` 可以是对象、数组、转义字符串、带符号数字、布尔值或 null 值。`->` 符号表示我们将这些字符串值映射到字面值。接着我们进一步指定 `array`、`object` 和 `pair` 的含义，最后指示解析器忽略行内空格。可以将其视为我们不断“扩展”每个高级概念，比如 `start` 或 `value`，直到达到无法再扩展的低级抽象。在文法术语中，这些“过于低级以至于无法扩展”的符号称为“终结符”。

您会立即遇到的一个问题是，上述代码仅确定字符串是否有效或无效 JSON。由于我们使用语言模型并一次生成一个标记，我们将会有很多在技术上无效的中间字符串。有更优雅的处理方式，但为了速度，我将定义一个简单的函数来检查我们是否处于生成字符串的中间状态：

```python
def is_incomplete_string(input_string):
    quote_count = input_string.count('"')
    if quote_count % 2 != 0:
        return True
    return False
```
定义好这些后，让我们进行一个小测试，看看我们的解析器是否能够准确区分有效、无效和不完整的 JSON 字符串：

```python
from lark import UnexpectedCharacters, UnexpectedToken

## 我们稍后将在约束模型输出时使用此方法
def try_and_recover(json_string):
    try:
        parser.parse(json_string)
        return {"status": "valid", "message": "The JSON is valid."}
    except UnexpectedToken as e:
        return {"status": "incomplete", "message": f"Incomplete JSON. Error: {str(e)}"}
    except UnexpectedCharacters as e:
        if is_incomplete_string(json_string):
            return {"status": "incomplete", "message": "Incomplete string detected."}
        return {"status": "invalid", "message": f"Invalid JSON. Error: {str(e)}"}
    except Exception as e:
        return {"status": "invalid", "message": f"Unknown error. JSON is invalid. Error: {str(e)}"}

## 测试用例
test_cases = [
    '{"key": "value", "key2": ',  # 不完整的 JSON
    '[1, 2, 3',                   # 不完整的 JSON
    '{"key": "value"}',           # 完整的 JSON
    'true',                       # 有效的 JSON
    '{"key": true, "nested": {',  # 不完整的 JSON
    '{"answer": "Paris',          # 不完整的 JSON
    'invalid syntax'              # 无效的 JSON
]

## 测试并显示结果
results = []
for test in test_cases:
    result = try_and_recover(test)
    results.append({"input": test, "result": result})

for test in results:
  print(test)
```

```python
{'input': '{"key": "value", "key2": ', 'result': {'status': 'incomplete', 'message': "..."}}
{'input': '[1, 2, 3', 'result': {'status': 'valid', 'message': '...'}}
{'input': '{"key": "value"}', 'result': {'status': 'valid', 'message': '...'}}
{'input': 'true', 'result': {'status': 'valid', 'message': '...'}}
{'input': '{"key": true, "nested": {', 'result': {'status': 'valid', 'message': '...'}}
{'input': '{"answer": "Paris', 'result': {'status': 'incomplete', 'message': '...'}}
{'input': 'invalid syntax', 'result': {'status': 'invalid', 'message': "..."}}
```
它工作正常！

作为最后的测试，让我们使用 `try_and_recover()` 函数来指导我们使用相对较小的模型进行解码。在下面的代码中，我们将使用一个经过指令调优的 Qwen 2.5 模型，具有 30 亿个参数，并向它提出一个简单的问题。首先，让我们初始化模型和标记器：

```python
from transformers import AutoModelForCausalLM, AutoTokenizer
model_name = "Qwen/Qwen2.5-3B-Instruct"

tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name, device_map="auto")
```
现在，我们想定义一个函数，从模型中递归采样，使用我们的 `try_and_recover()` 函数来约束输出。下面，我定义了该函数，它通过递归采样最可能的下一个 20 个标记，并选择第一个满足有效或不完整 JSON 字符串的标记：

```python
import torch

def sample_with_guidance(initial_text):
    """
    生成来自模型的结构化响应，受验证函数的指导。
    
    参数:
        initial_text (str): 模型的初始输入文本。
    
    返回:
        str: 模型生成的结构化响应。
    """
    response = ""  # 在此累积响应字符串
    next_token = None  # 下一个标记的占位符

    while next_token != tokenizer.eos_token:  # 继续直到生成结束标记
        # 对当前输入 (initial_text + response) 进行编码
        input_ids = tokenizer.encode(initial_text + response, return_tensors="pt").to(device)
        
        with torch.no_grad():  # 禁用梯度以进行推理
            outputs = model(input_ids)
            
            # 获取最可能的下一个 20 个标记
            top_tokens = torch.topk(outputs.logits[0, -1, :], 20, dim=-1).indices
            candidate_tokens = tokenizer.batch_decode(top_tokens)
        
        for token in candidate_tokens:
            # 检查标记是否为结束标记
            if token == tokenizer.eos_token:
                # 验证当前响应以决定是否完成
                validation_result = try_and_recover(response)
                if validation_result['status'] == 'valid':  # 如果响应有效则完成
                    next_token = token
                    break
                else:
                    continue  # 如果无效，则跳到下一个标记
            
            # 模拟将标记附加到响应
            extended_response = response + token
            
            # 验证扩展的响应
            validation_result = try_and_recover(extended_response)
            if validation_result['status'] in {'valid', 'incomplete'}:
                # 更新响应并将标记设置为下一个标记
                response = extended_response
                next_token = token
                print(response)  # 仅用于查看我们的中间输出
                break

    return response
```
这不是最有效或最健壮的方法，但对于我们的目的来说足够好。如果您想更好地了解更优的方案，可以查看 [llama.cpp 如何实现结构化生成](https://github.com/ggerganov/llama.cpp/blob/master/grammars/README.md)，或像 [Outlines 这样的库是如何处理的](https://github.com/dottxt-ai/outlines)。

使用以下代码，我们可以测试此结构化生成函数的性能：

```python
import json

messages = [
    {
     "role": "user", 
     "content": "What is the capital of France? Please only answer using the following JSON schema: { \\"answer\\": str }."
     }
]

## 为我们的特定模型格式化文本
input_text = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)

output = sample_with_guidance(input_text)

print("Parsed JSON Object:")
print(json.loads(output))
```

```python
{
{ "
{ "answer
{ "answer":
{ "answer": "
{ "answer": "Paris
{ "answer": "Paris"
{ "answer": "Paris" }

Parsed JSON Object:
{ "answer": "Paris" }
```
这种特定的方法显然会给您的代码增加一些计算开销，但一些更优化的实现实际上能够在最小延迟影响的情况下构建模型的输出。下面是使用 llama.cpp 的文法结构生成特性进行非结构化生成与结构化生成的并排比较：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*qQvlyiT4DPbbRrjA.gif?output=gif&n=50)

这个比较是由Brandon Willard从.txt（Outlines背后的公司）记录的，作为[他关于结构化生成延迟的精彩文章](https://blog.dottxt.co/how-fast-cfg.html)的一部分。如果你有兴趣深入了解这个领域，我强烈建议你阅读一下。

好了，介绍完毕，让我们来看看如何将结构化生成应用于LLM-as-a-judge指标，例如幻觉。

## 如何通过结构化生成检测幻觉

幻觉检测是基于LLM的评估的“经典”应用之一。传统的启发式方法在处理幻觉的微妙性方面困难重重，部分原因在于没有一个普遍认可的“幻觉”定义。为了本文的目的，我们将使用来自[伊利诺伊大学香槟分校的一篇近期论文](https://arxiv.org/html/2403.16527v1)中的定义，我认为这个定义既描述性又可用：

*幻觉是模型生成的输出，与约束相冲突或偏离实际部署中所需行为，或者与当前任务完全无关，但在这种情况下可能被认为是语法上合理的。*

换句话说，幻觉是一个看起来合理的输出。它在语法上是正确的，引用了其周围的上下文，并且似乎符合任务的“流程”。然而，它也与任务的一些基本指令相矛盾。这可能意味着得出错误的结论，引用不存在的数据，或完全忽略任务的实际指令。

显然，为了解析输出中如此模糊的幻觉而编码一个离散的规则系统是一项挑战。然而，LLM非常适合这种复杂的任务。

使用LLM进行幻觉分析的设置并不太困难。我们需要做的就是提示模型分析输出文本中的幻觉。在[Opik的内置Hallucination()指标](https://github.com/comet-ml/opik)中，我们使用以下提示：

```python
context_hallucination_template = """You are an expert judge tasked with evaluating the faithfulness of an AI-generated answer to the given context. Analyze the provided INPUT, CONTEXT, and OUTPUT to determine if the OUTPUT contains any hallucinations or unfaithful information.

Guidelines:
1. The OUTPUT must not introduce new information beyond what's provided in the CONTEXT.
2. The OUTPUT must not contradict any information given in the CONTEXT.
2. The OUTPUT should not contradict well-established facts or general knowledge.
3. Ignore the INPUT when evaluating faithfulness; it's provided for context only.
4. Consider partial hallucinations where some information is correct but other parts are not.
5. Pay close attention to the subject of statements. Ensure that attributes, actions, or dates are correctly associated with the right entities (e.g., a person vs. a TV show they star in).
6. Be vigilant for subtle misattributions or conflations of information, even if the date or other details are correct.
7. Check that the OUTPUT doesn't oversimplify or generalize information in a way that changes its meaning or accuracy.

Analyze the text thoroughly and assign a hallucination score between 0 and 1, where:
- 0.0: The OUTPUT is entirely faithful to the CONTEXT
- 1.0: The OUTPUT is entirely unfaithful to the CONTEXT

INPUT (for context only, not to be used for faithfulness evaluation):
{input}

CONTEXT:
{context}

OUTPUT:
{output}

Provide your verdict in JSON format:
{{
    "score": <your score between 0.0 and 1.0>,
    "reason": [
        <list your reasoning as bullet points>
    ]
}}"""
```
然而，困难的部分是以编程方式执行此分析。在实际应用中，我们希望自动解析模型的输出并收集幻觉分数，无论是作为模型评估的一部分还是作为推理管道的一部分。这样做将需要我们编写代码以处理模型输出，如果LLM以错误格式的输出响应，则评估将中断。

即使对于最先进的基础模型，这也是一个问题，但在处理较小的语言模型时，这一问题则更加严重。它们的输出是概率性的，无论你在提示中多么全面，都不能保证它们总是以正确的结构响应。

*除非*，当然，你使用结构化生成。

让我们通过使用Outlines和Opik的简单示例来演示。首先，我们希望使用Outlines初始化我们的模型。在这个例子中，我们将使用0.5亿参数版本的Qwen2.5。虽然这个模型在其大小上令人印象深刻，并且足够小，可以在Colab笔记本中快速运行，但你可能希望使用更大的模型以获得更准确的结果。

```python
import outlines

model_kwargs = {
    "device_map": "auto"
}

model = outlines.models.transformers("Qwen/Qwen2.5-0.5B-Instruct", model_kwargs=model_kwargs)
```
当你的模型下载完成后，你可以创建一个`generator`。在Outlines中，`generator`是一个将输出模式与模型结合的推理管道。在下面的代码中，我们将定义一个Pydantic中的模式并初始化我们的生成器：

```python
import pydantic
from typing import List

class HallucinationResponse(pydantic.BaseModel):
    score: int
    reason: List[str]

generator = outlines.generate.json(model, HallucinationResponse)
```
现在，如果我们将一个字符串传入生成器，它将输出一个格式正确的对象。

接下来，让我们在Opik中设置我们的幻觉指标。使用Opik的baseMetric类创建指标非常简单：

```python
from typing import Optional, List, Any
from opik.evaluation.metrics import base_metric

class HallucinationWithOutlines(base_metric.BaseMetric):
    """
    A metric that evaluates whether an LLM's output contains hallucinations based on given input and context.
    """

    def __init__(
        self,
        name: str = "hallucination_metric",
    ):
        super().__init__(name=name)

    def score(
        self,
        input: str,
        output: str,
        context: Optional[List[str]] = None,
        **ignored_kwargs: Any,
    ) -> HallucinationResponse:
        """
        Calculate the hallucination score for the given input, output, and optional context field.

        Args:
            input: The original input/question.
            output: The LLM's output to evaluate.
            context: A list of context strings. If not provided, the presence of hallucinations will be evaluated based on the output only.
            **ignored_kwargs: Additional keyword arguments that are ignored.

        Returns:
            HallucinationResponse: A HallucinationResponse object with a score of 1.0 if hallucination
                is detected, 0.0 otherwise, along with the reason for the verdict.
        """
        llm_query = context_hallucination_template.format(input=input, output=output, context=context)
        
        with torch.no_grad():
            return generator(llm_query)
```
我们在上面的代码中所做的就是使用先前定义的模板字符串生成我们的提示，然后将其传递给我们的生成器。

现在，让我们在实际的幻觉数据集上尝试我们的指标，以了解它是如何工作的。我们将使用HaluEval数据集中的一个拆分，该数据集可以通过HuggingFace自由获取并具有宽松的许可证，我们将其作为Opik数据集上传以进行实验。我们将使用一些额外的逻辑来确保数据集在幻觉和非幻觉样本之间保持平衡：

```python
import opik
import pandas as pd

client = opik.Opik()

## 创建数据集

dataset = client.get_or_create_dataset(
    name="HaluEval-qa-samples Balanced", 
    description="HaluEval-qa-samples dataset"
)

## 向数据集插入项目
df = pd.read_parquet(
    "hf://datasets/pminervini/HaluEval/qa_samples/data-00000-of-00001.parquet"
)

n_per_class = 100  # 每类100个，总共200个
df_balanced = pd.concat([
    df[df['hallucination'] == 'yes'].sample(n=n_per_class, random_state=42),
    df[df['hallucination'] == 'no'].sample(n=n_per_class, random_state=42)
])
df = df_balanced

dataset_records = [
    {
        "input": x["question"],
        "context": x['knowledge'],
        "output": x["answer"],
        "hallucination_label": x["hallucination"],
    }
    for x in df.to_dict(orient="records")
]

dataset.insert(dataset_records)
```
现在，我们只需使用我们的HallucinationWithOutlines()指标定义一个评估任务，并在我们的数据集上运行它：

```python
from opik.evaluation import evaluate
from opik.evaluation.metrics import Equals
from typing import Dict

## 定义评估任务
def evaluation_task(x: Dict):
    metric = HallucinationWithOutlines()
    try:
        metric_score = metric.score(
            input=x["input"], context=x["context"], output=x["output"]
        )
        hallucination_score = metric_score.score
        hallucination_reason = metric_score.reason
    except Exception as e:
        print(e)
        hallucination_score = None
        hallucination_reason = str(e)

    return {
        "output": "yes" if hallucination_score == 1 else "no",
        "hallucination_reason": hallucination_reason,
        "reference": x["hallucination_label"],
    }

## 定义评分指标
check_hallucinated_metric = Equals(name="Correct hallucination score")

res = evaluate(
    dataset=dataset,
    task=evaluation_task,
    scoring_metrics=[check_hallucinated_metric],
)
```

```python
Evaluation: 100%|██████████| 200/200 [09:34<00:00,  2.87s/it]
╭─   HaluEval-qa-samples Balanced (200 samples)  ─╮
│                                                 │
│ Total time:        00:09:35                     │
│ Number of samples: 200                          │
│                                                 │
│ Correct hallucination score: 0.4600 (avg)       │
│                                                 │
╰─────────────────────────────────────────────────╯
Uploading results to Opik ... 
View the results in your Opik dashboard.
```
这就是全部！请注意，我们的样本没有因为格式不正确的输出而失败。让我们尝试运行相同的评估，但不使用结构化生成。为此，我们可以切换我们的生成器类型：

```python
generator = outlines.generate.text(model)
```
并修改我们的指标以解析模型输出中的JSON：

```python
from typing import Optional, List, Any
from opik.evaluation.metrics import base_metric
import json

class HallucinationUnstructured(base_metric.BaseMetric):
    """
    一个评估LLM输出是否基于给定输入和上下文包含幻觉的指标。
    """

    def __init__(
        self,
        name: str = "hallucination_metric",
    ):
        super().__init__(name=name)

    def score(
        self,
        input: str,
        output: str,
        context: Optional[List[str]] = None,
        **ignored_kwargs: Any,
    ) -> HallucinationResponse:
        """
        计算给定输入、输出和可选上下文字段的幻觉得分。

        Args:
            input: 原始输入/问题。
            output: 要评估的LLM输出。
            context: 上下文字符串的列表。如果未提供，将仅根据输出评估幻觉的存在。
            **ignored_kwargs: 被忽略的额外关键字参数。

        Returns:
            HallucinationResponse: 如果检测到幻觉，则返回得分为1.0的HallucinationResponse对象，否则为0.0，并附上判决理由。
        """
        llm_query = context_hallucination_template.format(input=input, output=output, context=context)
        
        with torch.no_grad():
            return json.loads(generator(llm_query)) # 解析来自响应的JSON字符串
```
保持其余代码不变并运行现在的结果是：

```python
Evaluation:   0%|          | 0/200 [00:00<?, ?it/s]Unterminated string starting at: line 5 column 9 (char 47)
Evaluation:   2%|▏         | 1/200 [00:56<46:15, 56.63s/it]Expecting value: line 1 column 2 (char 1)
Expecting value: line 1 column 2 (char 1)
Evaluation:   6%|▌         | 3/200 [00:57<10:09, 12.96s/it]Unterminated string starting at: line 4 column 9 (char 45)
Expecting value: line 1 column 2 (char 1)
Evaluation:  12%|█▏        | 6/200 [00:57<03:01,  4.12s/it]Unterminated string starting at: line 4 column 9 (char 45)
```
几乎每个字符串都无法正确解析。推理时间也显著增加，因为响应的可变长度，而结构化输出有助于保持响应简洁。

没有结构化生成，这种评估就不可行，尤其是对于这样小的模型。作为实验，尝试使用更大的模型运行相同的代码，看看平均准确率得分如何提高。

## 我们能否通过结构化生成构建更复杂的 LLM 判决者？

上述关于幻觉检测的例子相当简单。然而，结构化生成给 LLM 判决者带来的真正价值在于，它使我们能够构建更复杂的多轮评估。

为了给出一个多步骤评估可能是什么样子的极端例子，最近的一篇论文通过为不同的 LLM 代理构建多个“角色”，并让这些[代理在实际法庭结构中辩论](https://arxiv.org/html/2405.20267v4)，在 LLM 评估中取得了成功：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*wb4LO_DhjxtByRuX.png)

迫使不同的代理为不同的立场辩护并相互审视对方的论点，同时让另一个代理充当“法官”来发出最终决定，显著提高了评估的准确性。

为了使这样的系统有效，不同代理之间的交接必须顺利。如果一个代理需要在 5 个可能的行动中选择，我们需要 100% 确保模型只会输出这 5 个有效行动中的一个。通过结构化生成，我们可以实现这种级别的可靠性。

让我们尝试一个具体的例子，扩展我们之前的幻觉度量。我们将尝试以下改进：

* 在第一次通过时，模型将生成 3 个候选幻觉，并为每个候选提供推理。
* 对于每个候选，模型将单独评估它们，并评估它们是否是幻觉，附上扩展的推理。
* 如果模型发现任何候选是幻觉，它将为整个样本返回 1.0。

通过赋予模型生成更长的上下文链的能力，我们为更多的“中间计算”提供了空间，并希望能得到更准确的最终输出。

首先，让我们为这个任务定义一系列提示：

```python
generate_candidates_prompt = """
You are an expert judge tasked with evaluating the faithfulness of an AI-generated answer to a given context. Your goal is to determine if the provided output contains any hallucinations or unfaithful information when compared to the given context.

Here are the key elements you'll be working with:

1. <context>{context}</context>
   This is the factual information against which you must evaluate the output. All judgments of faithfulness must be based solely on this context.

2. <output>{output}</output>
   This is the AI-generated answer that you need to evaluate for faithfulness.

3. <input>{input}</input>
   This is the original question or prompt. It's provided for context only and should not be used in your faithfulness evaluation.

Evaluation Process:
1. Carefully read the CONTEXT and OUTPUT.
2. Analyze the OUTPUT for any discrepancies or additions when compared to the CONTEXT.
3. Consider the following aspects:
   - Does the OUTPUT introduce any new information not present in the CONTEXT?
   - Does the OUTPUT contradict any information given in the CONTEXT?
   - Does the OUTPUT contradict well-established facts or general knowledge?
   - Are there any partial hallucinations where some information is correct but other parts are not?
   - Is the subject of statements correct? Ensure that attributes, actions, or dates are correctly associated with the right entities.
   - Are there any subtle misattributions or conflations of information, even if dates or other details are correct?
   - Does the OUTPUT oversimplify or generalize information in a way that changes its meaning or accuracy?

4. Based on your analysis, create a list of 3 statements in the OUTPUT which are potentially hallucinations or unfaithful. For each potentially hallucinated or unfaithful statement from the OUTPUT, explain why you think it violates any of the aspects from step 3.

5. Return your list of statements and associated reasons in the following structured format:

{{
  "potential_hallucinations": [
    {{
      "output_statement": string,
      "reasoning": string,
    }},
  ]
}}

Here is an example output structure (do not use these specific values, this is just to illustrate the format):

{{
  "potential_hallucinations": [
    {{
      "output_statement": "The company was founded in 1995",
      "reasoning": "There is no mention of a founding date in the CONTEXT. The OUTPUT introduces new information not present in the CONTEXT.
    }},
    {{
      "output_statement": "The product costs $49.99.",
      "reasoning": "The CONTEXT lists the flagship product price at $39.99. The OUTPUT directly contradicts the price given in the CONTEXT."
    }},
    {{
      "output_statement": "The flagship product was their most expensive item.",
      "reasoning": "The CONTEXT lists mentions another product which is more expensive than the flagship product. The OUTPUT directly contradicts information given in the CONTEXT."
    }}
  ]
}}

Now, please proceed with your analysis and evaluation of the provided INPUT, CONTEXT, and OUTPUT.
"""

evaluate_candidate_prompt = """
Please examine the following potential hallucination you detected in the OUTPUT:

{candidate}

You explained your reasons for flagging the statement like so:

{reason}

As a reminder, the CONTEXT you are evaluating the statement against is:

{context}

Based on the above, could you answer "yes" to any of the following questions?
  - Does the OUTPUT introduce any new information not present in the CONTEXT?
  - Does the OUTPUT contradict any information given in the CONTEXT?
  - Does the OUTPUT contradict well-established facts or general knowledge?
  - Are there any partial hallucinations where some information is correct but other parts are not?
  - Is the subject of statements correct? Ensure that attributes, actions, or dates are correctly associated with the right entities.
  - Are there any subtle misattributions or conflations of information, even if dates or other details are correct?
  - Does the OUTPUT oversimplify or generalize information in a way that changes its meaning or accuracy?

Please score the potentially hallucinated statement using the following scale:

  - 1.0 if you answered "yes" to any of the previous questions, and you believe the statement is hallucinated or unfaithful to the CONTEXT.
  - 0.0 if you answered "no" to all of the previous questions, and after further reflection, you believe the statement is not hallucinated or unfaithful to the CONTEXT.

Before responding, please structure your response with the following format

{{
  "score": float,
  "reason": string

}}

Here is an example output structure (do not use these specific values, this is just to illustrate the format):

{{
  "score": 1.0,
  "reason": "The CONTEXT and OUTPUT list different prices for the same product. This leads me to answer 'yes' to the question, 'Does the OUTPUT contradict any information given in the CONTEXT?'"
}}

Now, please proceed with your analysis and evaluation.

"""


```
现在，我们可以为我们的不同模型输出定义一些 Pydantic 模型：


```python
## Generated by generate_candidates_prompt
class PotentialHallucination(pydantic.BaseModel):
    output_statement: str
    reasoning: str

class HallucinationCandidates(pydantic.BaseModel):
    potential_hallucinations: List[PotentialHallucination]

## Generated by evaluate_candidate_prompt
class HallucinationScore(pydantic.BaseModel):
    score: float
    reason: str
```
有了这些，我们可以构建两个生成器，一个用于生成候选幻觉，另一个用于对单个候选进行评分：


```python
import outlines

model_kwargs = {
    "device_map": "auto"
}

model = outlines.models.transformers("Qwen/Qwen2.5-0.5B-Instruct", model_kwargs=model_kwargs)

candidate_generator = outlines.generate.json(model, HallucinationCandidates)
generator = outlines.generate.json(model, HallucinationScore)
```
最后，我们可以构建一个 Opik 度量。我们将保持代码简单：


```python
class HallucinationMultistep(base_metric.BaseMetric):
    """
    A metric that evaluates whether an LLM's output contains hallucinations using a multi-step appraoch.
    """

    def __init__(
        self,
        name: str = "hallucination_metric",
    ):
        super().__init__(name=name)

    def score(
        self,
        input: str,
        output: str,
        context: Optional[List[str]] = None,
        **ignored_kwargs: Any,
    ) -> HallucinationScore:
     # Generate candidates
        candidates_query = generate_candidates_prompt.format(input=input, output=output, context=context)
        output = candidate_generator(candidates_query)
        
        # Initialize to zero, in case the model simply finds no candidates for hallucination
        score = HallucinationScore(score=0.0, reason="Found no candidates for hallucination")

        for candidate in output.potential_hallucinations:
          followup_query = evaluate_candidate_prompt.format(candidate=candidate.output_statement, reason=candidate.reasoning, context=context)
          new_score = generator(followup_query)
          score = new_score
          if new_score.score > 0.0:
           # Early return if we find a hallucination
            return new_score

        return score
```
我们在这里所做的只是生成第一个提示，这应该在输入候选生成器时生成几个幻觉候选。然后，我们将每个候选（使用候选评估提示格式化）传递给候选评估生成器。

如果我们使用与之前相同的代码运行它，并稍作修改以使用新的度量：


```python
## Define the evaluation task
def evaluation_task(x: Dict):
  # Use new metric
    metric = HallucinationMultistep()
    try:
        metric_score = metric.score(
            input=x["input"], context=x["context"], output=x["output"]
        )
        hallucination_score = metric_score.score
        hallucination_reason = metric_score.reason
    except Exception as e:
        print(e)
        hallucination_score = None
        hallucination_reason = str(e)

    return {
        "output": "yes" if hallucination_score == 1 else "no",
        "hallucination_reason": hallucination_reason,
        "reference": x["hallucination_label"],
    }

## Define the scoring metric
check_hallucinated_metric = Equals(name="Correct hallucination score")

res = evaluate(
    dataset=dataset,
    task=evaluation_task,
    scoring_metrics=[check_hallucinated_metric],
)


```

```python
Evaluation: 100%|██████████| 200/200 [19:02<00:00,  5.71s/it]
╭─  HaluEval-qa-samples Balanced (200 samples)   ─╮
│                                                 │
│ Total time:        00:19:03                     │
│ Number of samples: 200                          │
│                                                 │
│ Correct hallucination score: 0.5200 (avg)       │
│                                                 │
╰─────────────────────────────────────────────────╯
Uploading results to Opik ... 
View the results in your Opik dashboard.
```
我们看到有了很大的改善。请记住，在这个相同的数据集上运行这个相同的模型，使用非常相似的初始提示，得分为0\.46\. 通过简单地添加这个额外的候选评估步骤，我们立即将得分提高到了0\.52\. 对于这样一个小模型来说，这真是太棒了！

## 结构化生成在 LLM 评估未来中的作用

大多数基础模型提供者，如 OpenAI 和 Anthropic，提供某种类型的 `structured output` 模式，该模式会根据预定义的结构响应您的查询。然而，LLM 评估的世界远远超出了这些提供者 API 的封闭生态系统。

例如：

* 所谓的“白盒”评估，将模型的内部状态纳入评估，对于像 GPT-4o 这样的托管模型是不可行的。
* 为您的特定评估用例微调模型需要使用开源模型。
* 如果您需要在本地运行评估管道，显然无法使用托管 API。

而且这还没有涉及特定开源模型与流行基础模型的比较。

LLM 评估的未来涉及更复杂的评估套件，将白盒指标、经典启发式方法和 LLM 裁判结合成强大的多轮系统。开源，或者至少是本地可用的 LLM，是未来的重要组成部分——而结构化生成是推动这一未来的基础设施的基本部分。

*原文发表于 [https://www.comet.com](https://www.comet.com/site/blog/structured-generation-llm-as-a-judge/) 于 2024 年 11 月 27 日。*

