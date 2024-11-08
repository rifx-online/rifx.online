---
title: "克服医疗领域的法学硕士挑战：生产发展实用策略"
meta_title: "克服医疗领域的法学硕士挑战：生产发展实用策略"
description: "一篇关于我遇到的最常见的 LLM 开发挑战、有效的缓解策略以及职业生涯决定性的面试的文章……"
date: 2024-11-08T00:20:35Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Vak28ygruWKySsH0doGoYg.png"
categories: ["Health", "Generative AI", "Machine Learning"]
author: "Rifx.Online"
tags: ["LLMs", "healthcare", "hallucinations", "validation", "monitoring"]
draft: False

---

### 生成性人工智能



### 我遇到的最常见的LLM开发挑战、有效的缓解策略以及一个职业生涯中决定性的面试错误

## 引言

我一直是那种深入研究一个主题并专注到痴迷的人。当我从数据科学硕士毕业时，我的痴迷是计算机视觉；特别是将计算机视觉应用于神经科学或心理健康领域。我决心成为心理健康领域的“计算机视觉工程师”（不过“机器学习工程师”也可以），尽管我的导师们劝我拓宽视野，寻找更多机会。我压制了自己内心的疑虑，坚信正确的团队会认可我的“专业知识”。



幸运的是，我的理论似乎奏效了；我获得了几家心理健康公司的面试。但随之而来的是我最大的面试错误之一。在我最喜欢的公司的最后一轮面试中——一家我非常喜欢的公司——我犯了一个错误，至今回想起来仍让我感到不安。这个职位专注于NLP，处理文本数据，但我忍不住表达了我对成像数据的兴趣。*在回忆中哭泣。* 我清晰地记得，当我询问成像数据的可用性时，面试官的表情从兴奋转为担忧，因为我仍然对计算机视觉充满热情。当天晚些时候，我收到了一个礼貌的拒绝：他们喜欢我的热情，但需要一个完全致力于NLP的人。

讽刺的是，我很快加入了另一家心理健康公司，并完全转向NLP工作，创建了改善临床护理的焦虑和抑郁症状检测器，并开发了提升内容可发现性的推荐系统，增加了12%的发现率。几年后，我现在是团队中的NLP/LLM数据科学家，负责6个信息提取任务、5个分类任务和5个条件摘要任务，已在15家以上医院和五个客户中部署。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*-VOHDQd88fCyRqoY9bR3hQ.png)

几周前，我被要求向我更大的数据团队介绍“LLM开发101”。最初，冒名顶替综合症悄然袭来——*我能在LLM开发上分享45分钟什么呢？* 但当我创建幻灯片时，我意识到我有很多要说的，并对分享我所学到的深厚知识感到兴奋。这种兴奋促成了你现在正在阅读的这篇文章。在这篇文章中，我将讲述我在生产中遇到的一些常见LLM挑战以及帮助我解决这些问题的策略。

## 1\. 输出格式错误

这可能是我遇到的最常见问题，令人惊讶的是。输出格式的可靠性可能会因我使用的模型而显著不同。例如，GPT\-4 Turbo 通常提供一致的 JSON 输出，但 GPT\-4o 在这方面的可靠性往往较差。在 GPT\-4o 中，我遇到过从列表和字符串到不完整字典的各种情况，当明确请求结构化 JSON 输出时。如果这些格式问题没有被发现并且模型没有重新运行，我可能会面临数据覆盖不完整的风险。

### 格式错误的影响

不一致的输出格式会对下游流程产生重大影响。如果数据结构不正确，可能会导致后续处理步骤的失败，扭曲报告的准确性，甚至在未被发现的情况下导致洞察不完整。在医疗等高风险领域，我的工作涉及此处，不完整或结构错误的数据可能会带来实际影响，因此格式的一致性至关重要。

### 缓解措施

为了解决这个问题，我实现了**格式检查逻辑**，**验证输出结构**。如果不正确，我将重新运行模型，直到它符合预期格式。此外，我使用**日志记录**来捕获与格式相关的错误。然而，重新运行模型带来了权衡，例如增加延迟和更高的API成本。我根据数据覆盖的关键性和成本限制建立了重新运行的阈值。如果重新运行不可行，我有时会应用后处理来“修复”输出结构，尽管这种方法也存在引入错误或不一致的风险。

为了说明这种方法，这里有一个示例代码片段，它请求以JSON格式返回患者数据，并包含特定的键，如`"name"`、`"age"`和`"insurance"`。这段代码演示了一种验证模型响应是否包含所有必需字段并遵循预期结构的方法。通过实现重试逻辑，该代码旨在确保数据一致性，减少在关键工作流程中与格式错误相关的风险。

```python
def get_llm_response(prompt: str, required_keys: Set[str], retries: int = 3) -> Optional[Dict[str, Any]]:
    """
    Calls the language model to get a response in JSON format. If the response 
    is not in the expected JSON format or lacks required keys, retries the call 
    up to `retries` times.
    Parameters:
        prompt (str): The prompt sent to the language model.
        required_keys (Set[str]): A set of required keys that must be present in the JSON response.
        retries (int): The maximum number of retries if the output format is invalid.
    Returns:
        Optional[Dict[str, Any]]: Parsed JSON response if successful; None if retries are exhausted.
    """
    
    for attempt in range(retries):
        try:
            response = openai.Completion.create(
                model="gpt-4o",
                prompt=prompt,
                max_tokens=100,
                temperature=0.7
            )
            
            # Attempt to parse the response as JSON
            response_text = response.choices[0].text.strip()
            parsed_response = json.loads(response_text)
            
            # Check if parsed_response is in the expected structure and contains required keys
            if isinstance(parsed_response, dict) and required_keys.issubset(parsed_response.keys()):
                return parsed_response
            else:
                print(f"Attempt {attempt + 1}: Output format invalid or missing required keys, retrying...")
        except (json.JSONDecodeError, KeyError) as e:
            print(f"Attempt {attempt + 1}: Error parsing JSON - {str(e)}, retrying...")
    print("Max retries exceeded: Unable to get valid JSON output with required keys.")
    return None

```

## 2\. 幻觉

幻觉发生在模型创造出听起来合理但实际上并不存在的信息时。例如，当我试图从源文本中提取引用时，有时模型会选择“发挥创意”，产生类似但完全虚构的短语。在准确性至关重要的领域，如医疗保健，微小的幻觉可能导致重大问题。

### 缓解

我通过实施后处理逻辑来解决幻觉问题，以验证在任何信息提取任务中，提取的上下文与源文本完全匹配。为了确保细微的变动不会导致遗漏匹配，我通过去除标点符号并在比较源文本和提取文本时将其全部转换为小写来标准化文本。此外，还有其他几种策略有助于最小化幻觉。例如，**链式思维提示**，即模型解释其推理的每一步，可以产生更为扎实的输出，并降低不准确输出的可能性。在高风险应用（例如医疗保健案例）中，**人机协作检查**作为额外的审查层非常重要，有助于捕捉自动化过程可能遗漏的幻觉。最后，强调事实准确性的提示，例如指示模型“仅使用源文本中的确切短语”，可以引导模型朝着更精确的响应方向发展。

## 3\. 过时信息

过时的信息管理起来可能很具有挑战性，特别是在准确性和及时性至关重要的应用中。有时，模型可能会从文档的旧部分检索信息，并将其呈现为当前信息。使用检索增强生成（RAG）时，这个问题可能变得更加复杂，因为RAG仅根据相关性而非及时性或特定文档部分来检索内容。缺少部分标签或时间戳意味着RAG可能会从文档的相关部分提取信息，而不区分这些信息是否过时，这可能导致旧信息和当前信息混合在一起。使用向量数据库的另一个挑战是，如果我们存储整个文档，则无法在没有明确标签的情况下轻松删除特定部分，从而使有效过滤无关信息变得困难。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*k9btdwyCCAb9qp92gB0PwA.png)

### 缓解措施

为了解决这个问题，我在提示中直接指定“当前”或“最新”数据，并使用预处理步骤在将数据传递给模型之前删除任何过时的部分。这个额外的预处理步骤确保仅保留最新、最相关的信息，帮助模型专注于提供及时和准确的响应。这个步骤不仅确保了更准确的输出，还降低了调用的成本。通过提前实施这些过滤器，我可以保持模型输出的一致性和相关性。

## 4\. 过度依赖与伦理

尽管我希望我所做的工作能够被使用并且有用，但我最大的担忧是用户会对模型预测过于信任——尤其是在医疗保健领域，生成性人工智能不仅仅是在做预测，还经常在生成摘要或提取特定的患者细节。专家们对某些定义可能持有不同的看法，因此多样性和对话对于达成共识非常重要。过度依赖这些预测可能会导致护理团队限制这些对话，并忽视他们本可以更仔细检查的错误。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*6-0mq8Svxh8ATuyT)

### 缓解

我优先教育团队了解模型的局限性，包括其出错的倾向，并鼓励他们将人工智能视为人类专业知识的补充。在医疗保健领域，细微差别至关重要，人工干预的监督对于高影响力的案例至关重要，允许专家审查人工智能的输出，减少对过度依赖的风险。这种协作方法使人工智能能够增强专家的见解，保持高风险应用所需的可靠性和伦理完整性。

## 5\. 快速模型弃用

随着人工智能的发展速度加快，模型和API版本更新频繁，版本被弃用的速度往往超出预期。如果您曾因模型版本被退役而导致工作流程意外中断，您会知道这会造成多大的干扰。在过去一年中，这种情况发生了几次，迫使我们迅速重新进行分析，以确保更新的模型版本仍能按预期表现。

### 缓解

将定期检查模型版本并提前处理弃用警告作为优先事项。这种主动的方法使我们能够提前规划过渡，避免最后时刻的匆忙。虽然这只是一个小步骤，但在保持顺畅操作方面却有着显著的影响。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*GK08JY3dcRUS4r6Z0x6EmA.png)

## 6\. API的速率限制

API的速率限制是一个微妙但重要的挑战，特别是在处理大量请求时。达到速率上限可能会导致延迟，减慢实时工作流程，甚至停止整个过程。在处理时间敏感数据的情况下，达到限制可能会造成严重干扰，因为工作流程会意外中断。这在医疗环境中尤其成问题，因为时机直接影响操作和患者护理。

### 缓解

为了缓解这一问题，我们采取了主动的方法，通过跟踪 API 使用模式来识别高峰时段并减少非必要的调用。通过错开请求和批量调用，我可以更均匀地分配负载，避免超过限制。在需求高涨且速率限制持续达到的情况下，向提供者请求额外配额可以提供一个切实可行的解决方案。平衡使用至关重要，提前了解我们的高峰时段和使用模式对于维持稳定、不中断的工作流程至关重要。

## 结论

这些只是我在与 LLMs 工作时遇到的六个常见问题。我没有想到自己会来到这里，但退一步思考，我意识到自己在这个领域积累了多少专业知识——我非常兴奋能够在即将发布的文章中继续分享这些经验。我希望能听到其他人遇到的挑战以及他们找到的有效缓解策略或解决方法，无论是与这些问题相关还是全新的问题。我希望这些见解对您有所帮助，并激发关于这一快速发展的领域（模型版本和 API 版本更新得太快）最佳实践的进一步讨论。

