---
title: "掌握 CrewAI：第 5 章--训练、测试、回放和计划 | 作者：Okan Yenigün | 2025年1月 | 人工智能浅析"
meta_title: "掌握 CrewAI：第 5 章--训练、测试、回放和计划 | 作者：Okan Yenigün | 2025年1月 | 人工智能浅析"
description: "本章介绍了CrewAI的训练、测试、重放和计划功能。训练过程采用人机协作，利用反馈不断优化结果，并将所有元数据存储在pickle文件中。测试阶段使用LLM评估任务性能，而重放功能允许用户从最近的团队启动中重试特定任务。计划功能则通过AgentPlanner在每次迭代前创建任务计划，确保任务执行的系统性和高效性。这些功能的结合显著提升了AI LLMs的应用效率和质量。"
date: 2025-01-08T23:00:24Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*uIQSaKcgiUjifJtGE_Yh4g.jpeg"
categories: ["Programming", "Machine Learning", "Data Science"]
author: "Rifx.Online"
tags: ["training", "testing", "replay", "planning", "feedback"]
draft: False

---



### 训练、测试、重放与计划



在本章中，我们将探讨CrewAI的训练、测试、重放和计划功能。

上一章：

让我们为这篇文章创建一个新项目。

```python
crewai create crew train_test_example
```  
这将创建一个模板项目。

### 训练

在训练过程中，我们使用人机协作技术。团队生成结果，我们对其提供反馈。通过迭代反馈，结果随着时间的推移而改善。与此训练相关的所有元数据都存储在一个 pickle 文件中。

在 `main.py` 中，有一个 `train` 方法处理训练过程。该方法接受两个参数：`n_iterations`，指定迭代次数，以及 `filename`，即存储训练数据的文件名。


```python
def train():
    """
    Train the crew for a given number of iterations.
    """
    inputs = {
        "topic": "AI LLMs"
    }
    try:
        TrainTestExample().crew().train(n_iterations=int(sys.argv[1]), filename=sys.argv[2], inputs=inputs)

    except Exception as e:
        raise Exception(f"An error occurred while training the crew: {e}")
```
`train` 方法的参数可以是硬编码的，也可以作为命令行（CLI）参数传递。


```python
 crewai train -n 2 -f train_data.pkl 
```
`-n 2` 设置 `n_iterations=2`，而 `-f train_data.pkl` 指定 `filename=train_data.pkl`。

这是代理的第一次迭代输出：


```python
## Agent: AI LLMs Senior Data Researcher
### Task: Conduct a thorough research about AI LLMs Make sure you find any interesting and relevant information given the current year is 2024.



## Agent: AI LLMs Senior Data Researcher
### Final Answer: 
Here is a list of the most relevant information about AI LLMs as of 2024:

1. **Model Scaling**: Large Language Models (LLMs) are being further scaled, with models such as GPT-4 scaling to hundreds of billions of parameters, improving their understanding and generation of human-like text.

2. **Multimodal Capabilities**: The integration of multimodal inputs (text, images, audio, etc.) into LLMs is becoming standard, allowing AI to process and generate contextually relevant responses across various formats, exemplified by models like DALL-E and CLIP.

3. **Fine-tuning and Customization**: Organizations are increasingly adopting methods to fine-tune LLMs on specific datasets, resulting in specialized versions of models that are optimized for particular industries, such as healthcare, finance, and legal sectors.

4. **AI Ethics and Bias Mitigation**: There is a growing emphasis on addressing ethical concerns and reducing biases in LLMs, with researchers developing frameworks and auditing processes to ensure models are fair, transparent, and accountable.

5. **Energy Efficiency**: Innovations in model training and architecture, including the use of more efficient algorithms and hardware, are being actively pursued to reduce the significant energy consumption associated with training large models.

6. **AI-driven Code Generation**: Tools like Codex have revolutionized software development by enabling LLMs to assist in coding tasks, generating code snippets, suggesting optimizations, and providing documentation, thus improving productivity for developers.

7. **Conversational AI Advances**: Enhanced capabilities in conversational AI have emerged, making interactions with LLMs more natural and contextually aware, leading to improvements in customer support bots and virtual assistants.

8. **Regulatory Frameworks**: Governments and international bodies are working towards creating regulatory frameworks to govern the use of AI LLMs, focusing on safety, privacy, and ethical implications as these technologies become more prevalent.

9. **Integration into Enterprises**: Businesses are increasingly integrating LLMs into their operations, utilizing them for tasks such as content creation, data analysis, and employee training, resulting in enhanced operational efficiency and decision-making.

10. **Community Contribution and Open Models**: The rise of open-source LLM initiatives, such as EleutherAI and Hugging Face’s Transformers, has fostered a collaborative environment for researchers and developers, allowing for innovation and accessibility in AI development.

These developments highlight the rapid advancement and integration of AI LLMs into various sectors, indicating a transformative impact on technology and society in 2024.


 ## Final Result: Here is a list of the most relevant information about AI LLMs as of 2024:

1. **Model Scaling**: Large Language Models (LLMs) are being further scaled, with models such as GPT-4 scaling to hundreds of billions of parameters, improving their understanding and generation of human-like text.

2. **Multimodal Capabilities**: The integration of multimodal inputs (text, images, audio, etc.) into LLMs is becoming standard, allowing AI to process and generate contextually relevant responses across various formats, exemplified by models like DALL-E and CLIP.

3. **Fine-tuning and Customization**: Organizations are increasingly adopting methods to fine-tune LLMs on specific datasets, resulting in specialized versions of models that are optimized for particular industries, such as healthcare, finance, and legal sectors.

4. **AI Ethics and Bias Mitigation**: There is a growing emphasis on addressing ethical concerns and reducing biases in LLMs, with researchers developing frameworks and auditing processes to ensure models are fair, transparent, and accountable.

5. **Energy Efficiency**: Innovations in model training and architecture, including the use of more efficient algorithms and hardware, are being actively pursued to reduce the significant energy consumption associated with training large models.

6. **AI-driven Code Generation**: Tools like Codex have revolutionized software development by enabling LLMs to assist in coding tasks, generating code snippets, suggesting optimizations, and providing documentation, thus improving productivity for developers.

7. **Conversational AI Advances**: Enhanced capabilities in conversational AI have emerged, making interactions with LLMs more natural and contextually aware, leading to improvements in customer support bots and virtual assistants.

8. **Regulatory Frameworks**: Governments and international bodies are working towards creating regulatory frameworks to govern the use of AI LLMs, focusing on safety, privacy, and ethical implications as these technologies become more prevalent.

9. **Integration into Enterprises**: Businesses are increasingly integrating LLMs into their operations, utilizing them for tasks such as content creation, data analysis, and employee training, resulting in enhanced operational efficiency and decision-making.

10. **Community Contribution and Open Models**: The rise of open-source LLM initiatives, such as EleutherAI and Hugging Face’s Transformers, has fostered a collaborative environment for researchers and developers, allowing for innovation and accessibility in AI development.

These developments highlight the rapid advancement and integration of AI LLMs into various sectors, indicating a transformative impact on technology and society in 2024.
```
在代理生成结果后，它请求我们的反馈：


```python
=====
### Please provide feedback on the Final Result and the Agent's actions. Respond with 'looks good' or a similar phrase when you're satisfied.
=====
```
这是我的反馈：


```python
Use only two source and give 2 highlights only at the end.
```
现在，在第二次迭代中，代理已经改进并使用了 2 个项目。


```python
Human feedback:  Use only two source and give 2 highlights only at the end.

## Agent: AI LLMs Senior Data Researcher
### Final Answer: 
Here is a list of the most relevant information about AI LLMs as of 2024, based on two selected sources:

1. **Model Scaling**: LLMs are being further enhanced with massive scaling, reaching up to trillions of parameters, resulting in improved context understanding and more nuanced responses. (Source: OpenAI Blog)

2. **Ethical Considerations**: There is increasing focus on ethical AI developments regarding bias reduction and transparency in LLM deployment, pushing organizations to adopt responsible AI principles. (Source: AI Ethics Journal)

**Highlights**:
- LLMs continue to grow in complexity, reaching unprecedented parameter sizes that allow for deeper contextual comprehension.
- Ethical guidelines are being actively developed to ensure LLMs are deployed responsibly, addressing bias and fostering transparency.


 ## Final Result: Here is a list of the most relevant information about AI LLMs as of 2024, based on two selected sources:

1. **Model Scaling**: LLMs are being further enhanced with massive scaling, reaching up to trillions of parameters, resulting in improved context understanding and more nuanced responses. (Source: OpenAI Blog)

2. **Ethical Considerations**: There is increasing focus on ethical AI developments regarding bias reduction and transparency in LLM deployment, pushing organizations to adopt responsible AI principles. (Source: AI Ethics Journal)

**Highlights**:
- LLMs continue to grow in complexity, reaching unprecedented parameter sizes that allow for deeper contextual comprehension.
- Ethical guidelines are being actively developed to ensure LLMs are deployed responsibly, addressing bias and fostering transparency.

=====
### Please provide feedback on the Final Result and the Agent's actions. Respond with 'looks good' or a similar phrase when you're satisfied.
=====
```
该过程会持续迭代，直到我们决定停止。所有这些迭代的元数据都存储在 pickle 文件中。

### 测试

在测试中，我们使用 LLM 来评估任务性能。具体来说，LLM 用于在多个迭代后评估代理的输出。默认情况下，使用基于提示的评估技术，但也可以通过 RAGAS 或其他技术进行自定义。

在 `main.py` 文件中，有一个 `test` 函数处理测试过程。

```python
def test():
    """
    Test the crew execution and returns the results.
    """
    inputs = {
        "topic": "AI LLMs"
    }
    try:
        TrainTestExample().crew().test(n_iterations=int(sys.argv[1]), openai_model_name=sys.argv[2], inputs=inputs)

    except Exception as e:
        raise Exception(f"An error occurred while replaying the crew: {e}")
```
我们可以使用以下命令运行测试：

```python
crewai test
```
经过多次迭代后，我们看到一个任务得分表，如下所示：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*BrQ3WeAx7J09_0KJIoJTEA.png)

### 重放

CrewAI 允许您从最近的团队启动中重放任务。此功能尤其有用，如果您已完成启动但想要重试特定任务或避免重新获取数据。由于代理已经保留了启动执行的上下文，您可以简单地重放所需的任务。

`main.py` 文件中的 `replay` 函数管理此过程。

```python
def replay():
    """
    Replay the crew execution from a specific task.
    """
    try:
        TrainTestExample().crew().replay(task_id=sys.argv[1])

    except Exception as e:
        raise Exception(f"An error occurred while replaying the crew: {e}")
```
要查看最新启动的任务 ID，请使用：

```python
crewai log-tasks-outputs
```
我们可以查看任务及其对应的任务 ID。

```python
Task 1: 8d1fd0fa-3e6d-4d48-b919-d2a1c6474efc
Description: A list with 10 bullet points of the most relevant information about AI LLMs

------
Task 2: 115acd30-7142-4e8e-841b-cf8dda38400b
Description: A fully fledge reports with the mains topics, each with a full section of information. Formatted as markdown without '```'
```
我们可以使用任务 2 的任务 ID 作为检查点，而不是运行整个团队，从那里开始团队。

```python
crewai replay -t 115acd30-7142-4e8e-841b-cf8dda38400b
```
输出：

```python

## 代理：AI LLMs 报告分析师

### 任务：审查您获得的上下文，并将每个主题扩展为报告的完整部分。确保报告详细且包含所有相关信息。

## 代理：AI LLMs 报告分析师

### 最终答案：

## 关于人工智能大语言模型近期发展的综合报告

### Transformers Advancements
最近在变压器架构方面的进展显著提高了它们的效率和性能。关键研究人员专注于动态和自适应计算策略，这些策略根据输入数据的复杂性调整模型的操作。这些策略使模型能够智能地分配计算资源，减少不必要的开销，同时保持甚至提高整体准确性。层归一化方法和注意力机制的持续创新也增强了这些架构的稳健性，使其更好地处理数据中的长距离依赖关系。因此，这些发展使得人工智能大语言模型能够在各种应用中提供更快的响应和更好的上下文理解。

### 多模态能力
AI LLMs 正在越来越多地体现多模态能力，促进文本、图像和音频的整合，以实现更全面的处理方法。像 GPT-4 和 CLIP 这样的模型 exemplify 这一趋势，使它们能够在不同媒体之间提取意义和生成内容。这种整合允许更丰富和更细致的互动，改善 AI 系统对上下文的理解并提升用户参与度。例如，用户可以输入涉及视觉和文本元素的查询，促使模型以考虑输入模态全谱的方式作出响应，从而增强生成响应的相关性和准确性。

### 高效的微调技术
最近在模型微调方面的成功实践强调了效率和资源管理。像低秩适应（LoRA）和提示微调这样的技术已成为流行的方法论，使开发者能够以通常所需计算开销的一小部分来调整大型模型以适应特定任务。LoRA专注于引入低秩矩阵来修改变换器参数，从而在不妥协性能的情况下节省模型大小。同样，提示微调利用特定任务的提示来引导模型输出，所需的训练数据极少。这些进展有望降低组织在将AI LLMs调整到其独特需求时的障碍，促进各个行业的更快采用。

### 伦理与安全
围绕人工智能技术的伦理考虑已达到关键点，促使组织在负责任的人工智能框架上进行大量投资。当前正在积极讨论，以解决训练数据中普遍存在的偏见及人工智能大型语言模型生成的输出所带来的问题。各机构采取主动措施，通过建立健全的安全措施和不断完善伦理指南来降低这些风险。倡议包括偏见检测研究、模型训练过程的透明度以及用户反馈机制，以构建一个更加公平和安全的人工智能环境。这个不断发展的框架旨在确保人工智能技术惠及社会，同时尽量减少潜在的危害。

### OpenAI API 扩展
OpenAI 在扩展其 API 产品以支持多样化的业务需求方面取得了显著进展。通过集成可定制选项，开发者现在可以更轻松地访问高级功能和能力，如量身定制的模型输出和灵活的查询处理。这一扩展使企业能够通过将最先进的 AI 功能嵌入其应用程序中来提升用户体验，从而促进各行业的创新解决方案。随着越来越多的组织采用这些工具，它们不仅简化了操作工作流程，还通过丰富的与 AI 系统的互动来增强用户体验。

### Few-Shot 和 Zero-Shot 学习
AI LLM 在少量样本学习和零样本学习方面的能力已经取得了显著进展，使它们能够以最少的训练示例执行特定任务。少量样本学习允许模型仅从少数实例中进行概括，而零样本学习使它们能够在没有先前示例的情况下处理全新的任务。这一范式转变大大减少了对广泛标记数据集的需求，而这在传统上是训练 AI 系统的一大挑战。通过展示在仅根据上下文提示理解和执行新任务方面的出色适应能力，AI LLM 正在成为更通用的工具，适用于现实世界场景。

### 运行时优化
为了提高在资源受限环境中使用LLMs的可用性，已经开发了各种运行时优化技术。模型剪枝，即消除不太重要的参数，以及量化，即降低模型数值表示的精度，是正在实施的关键策略。这些技术有效地减少了整体模型大小和计算需求，使强大的AI模型能够在具有有限GPU或CPU资源的设备上部署。这种优化不仅使先进的AI能力能够在更广泛的设备上获得，还为移动或边缘计算环境中的新应用打开了可能性。

### 开源运动
开源运动在人工智能开发中的复兴显著改变了研究人员和开发者的环境。组织们发布了强大的模型，如 LLaMA 和 Falcon，使尖端 AI LLM 的访问变得更加民主化。这一转变使得较小的实体和独立研究人员能够在没有与专有系统相关的财务限制的情况下，尝试复杂的工具。这些倡议的社区驱动特性促进了创新和合作，助力于一个更加生机勃勃的生态系统，在这里多样化的应用、创新和方法论得以蓬勃发展。

### 实时对话式人工智能
AI LLMs 正在越来越多地用于实时对话应用中，改变客户服务体验并增强虚拟助手的功能。随着上下文意识和响应能力的显著提升，这些 AI 系统能够处理复杂查询，并与用户进行更有意义的对话。LLMs 的实时应用使企业能够提供及时的帮助，快速解决问题，并提供个性化体验，突显了 AI 在各个行业中彻底改变互动策略的潜力。

### 培训方法的创新
培训方法的创新正在重塑AI LLMs如何从互动中学习并提高输出质量。自我监督学习等技术使模型能够从大量未标记的数据中学习，而基于人类反馈的强化学习（RLHF）则利用人类评估来优化模型响应，这些都是推动这一进程的关键。这些方法增强了培训过程，使模型能够更高效、更有效地获取知识。通过改善参与度和互动质量，这些培训方法在使LLMs适应用户需求和偏好方面至关重要，确保AI能力的持续学习和演进。

这些详细的部分概述了截至2024年AI LLMs最相关的发展和趋势，展示了这一技术的快速演变及其对各个领域的影响。
```

### 计划

CrewAI中的规划功能使您能够将规划能力纳入您的团队。当激活时，在每次团队迭代之前，所有团队信息将被发送到`AgentPlanner`，该工具创建逐步的任务计划。然后将此计划附加到每个任务描述中。


```python
@crew
 def crew(self) -> Crew:
  """Creates the TrainTestExample crew"""
  # To learn how to add knowledge sources to your crew, check out the documentation:
  # https://docs.crewai.com/concepts/knowledge#what-is-knowledge

  return Crew(
   agents=self.agents, # Automatically created by the @agent decorator
   tasks=self.tasks, # Automatically created by the @task decorator
   process=Process.sequential,
   verbose=True,
   planning=True,
   # process=Process.hierarchical, # In case you wanna use that instead https://docs.crewai.com/how-to/Hierarchical/
  )
```
让我们运行Crew：


```python
crewai run
```
这次，在代理执行任务之前，`AgentPlanner`将负责并概述任务的执行过程。


```python
[2025-01-04 23:06:26][INFO]: Planning the crew execution

## 代理：AI LLMs高级数据研究员

### 任务：对AI LLMs进行全面研究 确保您找到任何有趣和相关的信息，考虑到当前年份是2024年。
1. 确定与AI LLMs相关的关键主题和话题，这些主题和话题在2024年出现，例如架构的进展、伦理考虑、应用和挑战。 
2. 利用学术数据库、行业期刊和信誉良好的在线资源获取关于AI LLMs的最新研究文章、白皮书和案例研究。 
3. 编制一份2024年专注于AI LLMs的相关会议、网络研讨会和协作平台的清单，注意任何主题演讲者或重大公告。 
4. 通过访谈、博客和播客搜索领域内思想领袖和从业者的专家意见。 
5. 收集有关最新AI LLM性能指标的数据，包括基准和比较分析，以了解其改进情况。 
6. 审查突出AI LLM在医疗、金融和教育等各个领域创新应用的案例研究。 
7. 检查随着LLM部署增加而产生的安全和隐私问题。 
8. 分析AI LLM对劳动力的影响及潜在的工作置换问题。 
9. 将发现总结为10个要点，突出2024年AI LLMs状态的最相关和引人注目的信息。 
10. 确保所有发现都准确引用，并且没有遗漏该领域经历的重大进展。

```
Next:


### Read More


### Sources

<https://docs.crewai.com/concepts/training>

<https://docs.crewai.com/concepts/planning>


## Thank you for being a part of the community

*Before you go:*

* Be sure to **clap** and **follow** the writer ️👏**️️**
* Follow us: [**X**](https://x.com/inPlainEngHQ) \| [**LinkedIn**](https://www.linkedin.com/company/inplainenglish/) \| [**YouTube**](https://www.youtube.com/channel/UCtipWUghju290NWcn8jhyAw) \| [**Newsletter**](https://newsletter.plainenglish.io/) \| [**Podcast**](https://open.spotify.com/show/7qxylRWKhvZwMz2WuEoua0)
* [**Check out CoFeed, the smart way to stay up\-to\-date with the latest in tech**](https://cofeed.app/) **🧪**
* [**Start your own free AI\-powered blog on Differ**](https://differ.blog/) 🚀
* [**Join our content creators community on Discord**](https://discord.gg/in-plain-english-709094664682340443) 🧑🏻‍💻
* For more content, visit [**plainenglish.io**](https://plainenglish.io/) \+ [**stackademic.com**](https://stackademic.com/)```

