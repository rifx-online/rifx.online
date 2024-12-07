---
title: "CrewAI 示例项目 - AI 技术博客"
meta_title: "CrewAI 示例项目 - AI 技术博客"
description: "本项目旨在开发一个基于AI的博客写作助手，通过CrewAI平台帮助内容创作者高效生成技术博客文章。该系统利用Google和Serper API，自动收集和分析最新的技术信息，分配给研究员和作者两个代理，分别负责研究和撰写。通过定义任务和流程，用户能够快速生成高质量的博客内容，减轻创作负担，提高一致性和效率。"
date: 2024-12-07T12:31:23Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*vGnSw8IVCKoafs73F-9Q1A.png"
categories: ["Programming", "Technology", "Machine Learning"]
author: "Rifx.Online"
tags: ["CrewAI", "Researcher", "Writer", "APIs", "content"]
draft: False

---





在本教程中，基于 AI 的博客写作助手为内容创作者开发，使用 CrewAI 平台。该项目的结构旨在自动提供和建议用户在创建技术博客文章时可能需要的基本和高级信息。这种方法旨在减轻内容创作者的工作负担，提高质量，并确保一致性。

## 目标

* 开发一个人工智能驱动的系统，以加快用户创建技术博客文章的过程。
* 通过扫描谷歌上最受欢迎和最新的发展来创建博客文章。
* 通过提高内容质量来帮助用户更高效地工作。

## 技术结构

**本项目使用了两个必需的API和密钥：**

* **Google API：** 用于执行Google搜索。 (<https://aistudio.google.com/app/apikey>)
* **Serper API：** 以JSON格式返回Google搜索结果，便于数据分析。 ([https://serper.dev/api\-key](https://serper.dev/api-key))

API密钥通过将其添加到`.env`文件中作为环境变量分配：


```python
GEMINI_API_KEY="AI…………"
SERPER_API_KEY="b……………"
```

## 所需库

在开始项目之前，需要安装必要的 Python 库：


```python
pip install crewai crewai-tools
pip install load_dotenv
pip install python-dotenv
pip install google-generativeai
```
这些库是运行 AI 模型、与 API 进行通信以及在项目中管理环境变量所必需的。

## 定义 Serper API 工具

在这个项目中，Serper API 被用来执行搜索。这个 API 是一个服务，允许以编程方式访问搜索引擎功能。通过以 JSON 格式返回结果，它使开发者能够利用搜索数据。

首先，需要从 `.env` 文件中检索 Serper API 密钥并将其分配给一个环境变量：

```python
import os
from dotenv import load_dotenv
from crewai_tools.tools.serper_dev_tool.serper_dev_tool import SerperDevTool

load_dotenv()
os.environ["SERPER_API_KEY"] = os.getenv("SERPER_API_KEY")

serper_tool = SerperDevTool()
```
在这里，使用 `crew-ai-tools` 包中的 `SerperDevTool` 类创建了一个工具，并将其分配给 `serper_tool` 变量。这个工具将处理用于博客文章生成的数据收集过程。

## 代理

项目中定义了两个独立的代理：研究员和作者。这些代理旨在执行特定任务。每个代理都有特定的角色和目标。

* **研究员：** 对相关技术主题进行研究并提供分析。
* **作者：** 使用研究员收集的信息撰写特定主题的博客文章。

如果您希望代理的工作更加全面，建议编写一个详细的背景故事。为了表明研究员代理将向其他代理提供信息，`allow_delegation` 布尔值被设置为 `True`。此外，由于我希望两个代理都使用 Gemini 模型，因此只需在 `llm` 部分写下模型的名称，并分配环境变量 `GEMINI_API_KEY`。我们创建的 Serper API 也通过 `tool` 参数分配。

在编写提示时，如果我们想要分配变量值，我们在文本中用大括号写出输入值的名称，如 `{topic}`。

```python
import os

from crewai import Agent
from dotenv import load_dotenv

from tools import serper_tool

load_dotenv()

os.environ['GEMINI_API_KEY'] = os.getenv("GEMINI_API_KEY")

researcher = Agent(
    role= "Senior Researcher",
    goal="Uncover groundbreaking technologies in {topic}",
    verbose= True,
    memory=True,
    backstory=("""
        Driven by curiosity and a relentless pursuit of knowledge, you're at the forefront of innovation. Your role
        is to explore and discover emerging technologies within the {topic} space. You gather insights from multiple 
        sources, analyze them meticulously, and compile them into actionable reports. You are well-versed in understanding 
        market trends, technological shifts, and their potential impacts on various industries.
    """),
    tools= [serper_tool],
    llm="gemini/gemini-1.5-flash",
    allow_delegation=True
)

writer = Agent(
    role= "Writer",
    goal="Narrate compelling tech stories about {topic}",
    verbose= True,
    memory=True,
    backstory=("""
        With a passion for structuring complex topics into cohesive narratives, you bring clarity to groundbreaking technologies.
        Your writing bridges the gap between technical depth and readability, engaging readers by providing clear introductions, 
        detailed explanations, and insightful conclusions. You are known for creating a flow that draws readers in and leaves 
        them with a deeper understanding of the subject matter and its future implications.
    """),
    tools= [serper_tool],
    llm="gemini/gemini-1.5-flash"
)
```
* **研究员代理：** 对主题进行深入研究，分析获得的信息，并创建报告。
* **作者代理：** 使用研究员提供的信息撰写易读且流畅的文章。

## 任务

分配给代理的任务使用 `Task` 类定义。每个任务包括描述、预期输出、使用的工具以及执行任务的代理。

* **研究员任务：** 准备关于该主题的深入报告。
* **写作任务：** 使用该报告撰写博客文章。

如您所见，由于任务需要顺序完成，因此该过程必须作为 `Sequential Process` 进行。因此，`async_execution` 值必须设置为 `False`。这样，写作者在执行其任务之前会等待研究员。

```python
from crewai import Task

from agents import researcher, writer
from tools import serper_tool

researcher_task = Task(
    description=("""
        Conduct an in-depth exploration of the latest trends in {topic} and identify key technologies that have the potential 
        to disrupt the market in the near future. Your analysis should include the strengths, weaknesses, and market 
        implications of these technologies. Focus on identifying major opportunities and risks, providing a clear picture 
        of how these innovations could shape the industry landscape. Pay special attention to scalability, adoption barriers, 
        and competitive dynamics.
    """),
    expected_output="A comprehensive 3-paragraph report analyzing emerging technologies, market potential, and risks in {topic}.",
    tools=[serper_tool],
    agent=researcher
)

writer_task = Task(
    description=("""
        Write the article in language {language}.
        Structure the article into three sections: Introduction, Development, and Conclusion. 
        
        In the **Introduction**, provide an overview of {topic}, its current relevance, and why it matters today. 
        
        In the **Development** section, write min 2 max 4 paragraphs that analyze key trends, technological advancements, 
        and their implications for the industry. Include both the opportunities and challenges these technologies present.
        
        In the **Conclusion**, summarize the overall impact of these technologies and offer predictions about how 
        they may evolve in the future. Make sure the article is cohesive, flows naturally from one section to the next, 
        and ends with a forward-looking perspective.
        
        The article should not have headings labeled as Introduction, Development, or Conclusion. 
        All paragraphs should be between 500 and 850 words in length.
        If the selected language is not English, I would like you to write English technical terms in parentheses next to the translated term. 
        For example, in the Turkish translation, I want it to say 'Üretken Yapay Zeka (Generative AI)'.
    """),
    expected_output="A well-structured article (4 paragraphs) in markdown with a clear Introduction, Development (2-3 paragraphs), and Conclusion.",
    async_execution= False,
    tools=[serper_tool],
    agent=writer,
    output_file= "new-blog-post.md"
)
```

## 团队与流程

一旦代理和任务被定义，流程就使用 `Crew` 对象进行定义。在这个流程中，任务是顺序执行的。最后，使用 `kickoff` 方法来运行项目。在这个方法中，必要的参数被输入，流程开始。

```python
from crewai import Crew, Process

from agents import researcher, writer
from tasks import researcher_task, writer_task

crew = Crew(
    agents=[researcher, writer],
    tasks=[researcher_task, writer_task],
    process=Process.sequential,
    verbose=True
)

result = crew.kickoff(inputs={
    'topic': 'AI in industry',
    'language': 'english'})
print(result)
```
这段代码接受要研究的主题和语言参数，并启动代理与任务之间的互动。作为输出，生成一篇博客文章。

## 示例输出

帖子的输出保存到指定的文件路径。

一个示例输出：

```python
The AI industry is undergoing a dramatic transformation, fueled by emerging technologies with the potential to reshape the market. Generative AI, specifically large language models (LLMs) and image-generating AI, stands at the forefront of this revolution. Its ability to create novel content, automate tasks, and personalize experiences across various industries, from healthcare and manufacturing to finance and marketing, is driving widespread adoption. This transformative potential has positioned generative AI as a vital tool for businesses seeking to optimize processes, enhance products, and create new revenue streams.  

The rise of Multimodal AI (Multimodal AI), which integrates different data modalities like text, image, and audio, represents another crucial trend reshaping the industry. This technology offers a more comprehensive understanding of complex data, enabling more sophisticated applications in areas such as natural language processing, computer vision, and robotics.  The increasing accessibility of open-source AI tools and models is democratizing access to AI technology, fostering innovation and empowering smaller players to participate in the market.  Furthermore, cloud-based AI platforms provide scalable solutions, making AI accessible to a wider range of businesses. 

While these developments present exciting opportunities, they also introduce risks. Ethical considerations are paramount, requiring careful attention to bias, fairness, and transparency in AI systems.  The rapid pace of development and the evolving nature of AI technologies also pose challenges, requiring continuous adaptation and learning.  Moreover, the high computational demands of generative AI models and the requirement for specialized expertise pose significant adoption barriers, particularly for smaller businesses.  

Despite these complexities, the future of AI in industry appears promising, with these emerging technologies poised to revolutionize industries and create new opportunities for innovation and growth.  As AI technologies continue to advance, the industry will likely see further consolidation and the emergence of new use cases across various sectors.  The focus will likely shift towards developing more robust and ethical AI systems, ensuring responsible and equitable implementation.  The integration of AI with other technologies like the Internet of Things (IoT) and blockchain will also create exciting new possibilities. Ultimately, the success of AI in industry will depend on collaboration between businesses, researchers, and policymakers to address ethical and practical challenges and harness the transformative potential of these technologies for the benefit of society.
```
通过这个项目，用户可以自动生成技术博客文章，并显著加快内容创作过程。

如果您希望我继续进行与AI相关的系列，我感谢您的支持🙂此外，请别忘了关注😉

