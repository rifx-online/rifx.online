---
title: "代理人工智能：从零开始构建自主系统"
meta_title: "代理人工智能：从零开始构建自主系统"
description: "本文探讨了生成式人工智能时代的多智能体系统（MAS），强调代理人工智能的自主性与协作能力。文章介绍了构建一个包含网络研究、转录与摘要、博客撰写三个专业代理的示例，展示如何通过这些代理简化任务并提高输出质量。预计到2024年，全球人工智能市场将超过650亿美元，企业将继续将AI嵌入其核心战略。代理AI的潜力在于其无需人类干预的能力，能够处理复杂任务并提升生产力与创造力。"
date: 2024-12-15T01:12:30Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*84o9zsmdc68VqqZ9pu6Zjg.png"
categories: ["Autonomous Systems", "Generative AI", "Programming/Scripting"]
author: "Rifx.Online"
tags: ["Agentic", "MAS", "agents", "productivity", "automation"]
draft: False

---



### 在生成式人工智能时代创建多智能体框架的逐步指南

*本文由Rafael Guedes共同撰写。*

## 介绍

生成式人工智能的崛起是数字时代的新平台转变。它解决了从大型企业的自动化到各种类型的研发和创意等问题。预计到2024年，全球市场将超过650亿美元，86%的IT领导者预计将发生重大组织变革\[1\]。到目前为止，最大的收益来自于聊天机器人（更为通用且广泛的应用案例）、代码助手和企业搜索。

投资持续流入人工智能领域，2024年投资额达到138亿美元（比2023年增长六倍）\[1\]。此外，企业正在将人工智能嵌入其核心战略和系统中。检索增强生成（RAG）、微调和针对垂直应用（例如医疗、法律）的专业模型等技术正变得越来越普及。

大型语言模型（LLMs）引起了人们对人工智能的关注（以多种方式），并为解决旧问题开辟了新途径。这种新方式是通过代理人工智能——一个自主代理协作执行复杂多步骤工作流的框架。

我们的演示展示了如何构建和开发一个**多代理系统**。它集成了三个专业代理：

* 一个**网络研究代理**，负责获取和分析互联网数据。
* 一个**转录和摘要代理**，负责检索和简化视频或文本数据为可操作的摘要。
* 一个**博客写作代理**，将这些信息综合成一个连贯的结构。

这些代理在一个结构化的工作流中操作。它们利用基础的LLM和日常企业技术栈中的现有工具。我们展示了组织如何简化任务、减少人力投入并提高输出质量——同时保持对复杂场景的适应性。



如往常一样，代码可在我们的[GitHub](https://github.com/zaai-ai/lab)上获取。

## AI代理：它们是什么？

AI代理通常由LLM驱动，是旨在自主行动以实现特定目标的系统。它们接收输入提示，并可以访问完成特定任务所需的工具集。

输入提示可以有多种形式。它可以是由人类提供的简单文本提示，并附有遵循的指令，例如*“写一篇关于AI代理的博客文章。”*在多代理系统（MAS）中，它可以是前一个代理的输出，这也可以是文本或更结构化的数据，如JSON。

代理可以访问的工具对于其成功至关重要（类似于人类）。例如，如果厨师没有正常工作的烤箱，他们就无法烹饪出美味的烤肉。在AI代理的情况下，这些工具通常是API，允许它们连接到其他系统以执行任务。例如，连接到搜索引擎以查找信息或连接到数据库以运行查询。

在构建这些类型的代理时，需要定义两个主要类别\[2]：

1. **代理**（它有四个主要组件）：
* 代理使用的**LLM**可以是闭源的，如GPT-4或Claude Sonnet，或是开源的，如LLaMA 3.3或Mixtral 8x22。LLM接收我们也应该相应设置的参数，例如温度或生成的最大令牌数。LLM的选择将取决于代理必须执行的任务。例如，虽然GPT-4具有良好的推理能力，但Claude Sonnet在编码方面表现更好，而GPT-4o-mini是最快的。另一方面，如果处理的是敏感信息，可能会选择开源模型以避免与第三方公司共享信息。
* 代理的**角色**定义了其责任，提供目的并指导代理完成预期的任务和行为。例如，代理的角色可以是处理和分析信息、从数据库中检索数据或协调其他代理之间的交互。
* **背景故事**定义了代理对其环境、责任和与其他代理或工具的交互的当前知识。它还定义了代理的当前意图，即代理基于其对环境的知识和目标计划要做的事情。
* **目标**是代理预期要实现的内容，通常转化为代理的输出。例如，如果代理负责从数据库中检索数据并回答用户的问题，那么它的目标就是获得答案，而输出就是答案。
1. **任务**（它有三个主要组件）：
* **描述**提供了详细的解释，清晰地定义了任务的性质和结果。它还提供了代理可能面临的具体指令和限制。例如，如果任务是从数据库中检索数据，则描述必须指定检索的参数和任何格式要求。
* **输出**描述了任务结果的呈现方式，通过设定对输出的明确期望来指导。它可以指示输出应为文本、JSON、列表、HTML、SQL或API的响应。
* 最后，**代理**负责执行任务。

虽然一个AI代理可以有效地执行特定任务，但只有在利用一组代理时才能充分发挥其潜力。通过相互互动和协作，它们提供了可扩展性和专业化，以解决复杂问题。下一节将讨论这些MAS。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*0bMvfujidAehoBOWU_6Xbg.png)

## 多智能体协作系统 (MAS)

MAS 是由一组智能体定义的，也称为 Crew。每个智能体都具有独特的技能和专业能力。这些智能体协作以解决简单任务，从而实现一个更大、更复杂的共同目标 \[3]。

在 Crew 中，每个智能体都是一个具有独特特征、角色和特定工具的个体 LLM。与人类类似，这些智能体通过将其任务的输出发送给后续智能体进行沟通，以便进行进一步的构建。

Crew 的结构可以根据智能体之间的互动分为三种主要类型：

* **顺序型：** 智能体按链条工作，一个智能体的输出是下一个智能体的输入。通过解决较小的任务，他们可以解决为 Crew 设计的更大、更复杂的目标。
* **分层型：** 通常由一个经理和多个下属组成，领导者的角色是委派、规划和管理任务的完成。下属执行领导者的指令。在这种情况下，由于并非每个智能体都有顺序依赖关系，我们可以让智能体同时执行任务。
* **混合型：** 这种结构在同一个 Crew 中同时具有顺序和分层环境。通常发生在一些智能体面对复杂任务时，将其拆分为更小的任务，并建立一个由新智能体组成的子 Crew。他们成为该子 Crew 的领导者，同时也是原 Crew 的下属。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*4_L0FOBLOxwxO3oYdNnARw.png)

## CrewAI: 创建一个多智能体系统来撰写博客文章

在本节中，我们将创建一个多智能体系统（MAS），使用该领域最流行的包之一CrewAI，撰写关于AI代理的博客文章（我们知道让AI代理撰写关于AI代理的文章听起来有点令人困惑，但请耐心等待）。图4展示了我们方法的完整架构：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*YSRKvtbQS3p1wkDsvdMDLQ.png)

我们的团队由三个具有不同任务的代理组成，它们协同工作以生成HTML格式的博客文章。这些代理是：

* **网络研究代理**，负责连接到一个名为[**SearXNG**](https://search.zaai.ai)的搜索引擎，并检索关于*AI代理*的有用且最新的YouTube网址。代理及其任务定义如下所示：

```python
researcher:
 role: >
  {topic} 高级数据研究员
 goal: >
  揭示{topic}的前沿发展
 backstory: >
  你是一名经验丰富的研究员，擅长发掘{topic}的最新发展。以能够找到最相关的信息并以清晰简洁的方式呈现而闻名。
 
research_task:
  description: >
    针对{topic}进行全面研究
    确保找到任何有趣且相关的YouTube链接，当前年份为2024年。
  expected_output: >
    一个包含关于{topic}的YouTube网址及其相关描述的列表，提供关于{topic}的最相关信息。忽略任何不以"https://www.youtube.com"开头的链接。
  agent: researcher
```
* **转录与摘要代理**，连接到**YouTube API**以从**网络搜索代理**提供的URL中检索转录。它总结转录内容，提取主要见解和参考资料，并根据视频内容提出建议。如下所示，代理及其任务的定义为：

```python
summarizer:
  role: >
    {topic} 摘要员
  goal: >
    从{topic}中总结和提取知识及其他有见地和有趣的信息
  backstory: >
    你是一位分析信息并以简洁的方式提取最重要和有见地的信息的专家。
    你以能够总结和提取事实、参考资料、引用并推荐关于{topic}的最有用和令人惊讶的信息而闻名。
 
summarize_task:
  description: >
    彻底分析关于{topic}的信息，以提取最有价值的见解、事实和建议。
    在从输入内容提取信息时，严格遵循提供的模式。
    确保输出完全符合字段描述、类型和约束。忽略任何不以"https://www.youtube.com"开头的链接。
  expected_output: >
    一个包含{topic}摘要及最有价值的见解、事实和建议的json。同时将YouTube链接作为参考添加。
  agent: summarizer
```
* **博客撰写代理**是我们团队的第三个也是最后一个代理。它利用**转录与摘要**生成的摘要，撰写关于该主题的HTML格式博客文章。此HTML必须具有专业外观，包括一个导航栏，以帮助读者浏览文章。代理及其任务的定义如下所示：

```python
blog_writer:
  role: >
    {topic} 博客撰写者
  goal: >
    基于{topic}研究结果撰写详细的博客文章
  backstory: >
    你是一位细致入微的写作者，具有敏锐的细节观察力。
    你以能够将复杂主题转化为清晰简洁的博客文章而闻名，使他人能够轻松理解并采取行动。
 
write_task:
  description: >
    审查你获得的上下文，并将每个主题扩展为博客文章的完整部分。
    确保博客文章详细且包含所有相关信息。
    博客文章必须包含引言、主体、代码示例和结论部分。
  expected_output: >
    一篇完整的博客文章，主要主题每个都呈现为信息的完整部分。
    将其格式化为HTML，不使用'```'。使其看起来像一个专业的技术博客网站，
    包括导航栏、菜单和样式。在文本中和最后包含可点击的YouTube链接作为参考。
  agent: blog_writer
```
上述定义必须在两个不同的YAML文件中定义，一个用于代理（*agents.yaml*），另一个用于任务（*tasks.yaml*）。完成此过程后，就可以创建代理用于执行其任务的工具。

在我们的案例中，只有**博客撰写者**不需要任何工具，**研究者**需要搜索引擎，而**转录与摘要**需要连接到YouTube API。

**搜索引擎（[SearXNG](https://search.zaai.ai)）**

* 在定义工具时，定义输入模式是良好的实践。如下面的代码片段所示，我们的搜索引擎工具期望接收搜索查询和要检索的结果数量。
* 然后，我们必须定义工具本身。`__init__`函数设置要使用的搜索引擎，而`_run`函数指定代理将如何使用该工具。它基本上是搜索关于用户请求的主题的YouTube视频，在这种情况下，即*AI代理*。

```python
from crewai.tools import BaseTool
from typing import Type, Optional, List, Dict
from pydantic import BaseModel, Field, PrivateAttr
from langchain_community.utilities import SearxSearchWrapper


class SearxSearchToolInput(BaseModel):
    """SearxSearchTool的输入模式。"""

    query: str = Field(..., description="搜索查询。")
    num_results: int = Field(10, description="要检索的结果数量。")


class SearxSearchTool(BaseTool):
    name: str = "searx_search_tool"
    description: str = (
        "一个使用Searx元搜索引擎进行搜索的工具。"
        "指定查询并可选择按引擎、类别或结果数量进行限制。"
    )
    args_schema: Type[BaseModel] = SearxSearchToolInput
    _searx_wrapper: SearxSearchWrapper = PrivateAttr()

    def __init__(self, searx_host: str, unsecure: bool = False):
        """使用SearxSearchWrapper初始化SearxSearchTool。"""
        super().__init__()
        self._searx_wrapper = SearxSearchWrapper(
            searx_host=searx_host, unsecure=unsecure
        )

    def _run(
        self,
        query: str,
        num_results: int = 10,
    ) -> List[Dict]:
        """使用Searx API执行搜索。"""
        try:
            results = self._searx_wrapper.results(
                query=query + " :youtube",
                num_results=num_results,
            )
            return results
        except Exception as e:
            return [{"Error": str(e)}]
```
**YouTube API**

* 此工具遵循相同的原则，首先定义输入模式，其中包括YouTube URL和我们希望转录的语言。
* 我们还定义了一个输出模式，不仅返回转录，还返回视频的持续时间。
* 最后，工具本身由从URL中提取视频ID并连接到YouTube API以检索转录组成，如`_run`函数所示。

```python
from typing import Type, Optional
from pydantic import Field, BaseModel

from youtube_transcript_api import (
    NoTranscriptFound,
    TranscriptsDisabled,
    YouTubeTranscriptApi,
)

from crewai.tools import BaseTool


class YouTubeTranscriptToolInputSchema(BaseModel):
    """
    使用YouTube转录API获取YouTube视频转录的工具。
    返回转录文本、开始时间和持续时间。
    """

    video_url: str = Field(
        ..., description="要获取转录的YouTube视频的URL。"
    )
    language: Optional[str] = Field(
        None, description="转录的语言代码（例如，'en'代表英语）。"
    )


class YouTubeTranscriptToolOutputSchema(BaseModel):
    """
    YouTubeTranscriptTool的输出模式。包含转录文本、持续时间、评论和元数据。
    """

    transcript: str = Field(..., description="YouTube视频的转录。")
    duration: float = Field(
        ..., description="YouTube视频的持续时间（以秒为单位）。"
    )


class YouTubeTranscriptTool(BaseTool):
    """
    使用YouTube转录API获取YouTube视频转录的工具。

    属性：
        input_schema (YouTubeTranscriptToolInputSchema): 输入数据的模式。
        output_schema (YouTubeTranscriptToolOutputSchema): 输出数据的模式。
    """

    name: str = "youtube_transcript_tool"
    description: str = (
        "一个执行YouTube转录提取的工具。"
        "指定YouTube视频的URL并可选择语言代码。"
    )
    args_schema: Type[BaseModel] = YouTubeTranscriptToolInputSchema

    def __init__(self):
        """
        初始化YouTubeTranscriptTool。
        """
        super().__init__()

    def _run(
        self, video_url: str, language: Optional[str] = None
    ) -> YouTubeTranscriptToolOutputSchema:
        """
        使用给定参数运行YouTubeTranscriptTool。

        参数：
            video_url (list[str]): 要获取转录的YouTube视频URL列表。
            language (Optional[str]): 转录的语言代码（例如，'en'代表英语）。

        返回：
            YouTubeTranscriptToolOutputSchema: 工具的输出，符合输出模式。

        引发：
            Exception: 如果获取转录失败。
        """

        video_id = self.extract_video_id(video_url)
        try:
            if language:
                transcripts = YouTubeTranscriptApi.get_transcript(
                    video_id, languages=[language]
                )

```python
else:
                transcripts = YouTubeTranscriptApi.get_transcript(video_id)
        except (NoTranscriptFound, TranscriptsDisabled) as e:
            raise Exception(
                f"无法获取视频 '{video_id}' 的转录：{str(e)}"
            )

        transcript_text = " ".join([transcript["text"] for transcript in transcripts])
        total_duration = sum([transcript["duration"] for transcript in transcripts])

        return YouTubeTranscriptToolOutputSchema(
            transcript=transcript_text,
            duration=total_duration,
        )

    @staticmethod
    def extract_video_id(url: str) -> str:
        """
        从 YouTube URL 中提取视频 ID。

        Args:
            url (str): YouTube 视频 URL。

        Returns:
            str: 提取的视频 ID。
        """
        return url.split("v=")[-1].split("&")[0]
```
定义了代理、任务和工具后，我们现在可以构建我们的团队并设置它们的依赖关系。

如下所示，我们通过使用 `@agent` 装饰器声明代理，并结合各自的工具及其组件（角色、目标和背景故事）。对于任务，我们使用 `@task` 装饰器并定义其组件（描述、输出和代理）。最后，我们定义它们如何协作，即它们以顺序方式工作 `Process.sequential`。


```python
import os
from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crew_zaai.src.crew_zaai.tools.searx import SearxSearchTool
from crew_zaai.src.crew_zaai.tools.youtube import YouTubeTranscriptTool


@CrewBase
class CrewZaai:
    """CrewZaai 团队"""

    agents_config = "config/agents.yaml"
    tasks_config = "config/tasks.yaml"

    @agent
    def researcher(self) -> Agent:
        search_tool = SearxSearchTool(
            searx_host=os.getenv("SEARXNG_BASE_URL"), unsecure=False
        )

        return Agent(
            config=self.agents_config["researcher"], tools=[search_tool], verbose=True
        )

    @agent
    def summarizer(self) -> Agent:
        youtube_tool = YouTubeTranscriptTool()

        return Agent(
            config=self.agents_config["summarizer"], tools=[youtube_tool], verbose=True
        )

    @agent
    def blog_writer(self) -> Agent:
        return Agent(config=self.agents_config["blog_writer"], verbose=True)

    @task
    def research_task(self) -> Task:
        return Task(
            config=self.tasks_config["research_task"],
        )

    @task
    def summarizer_task(self) -> Task:
        return Task(
            config=self.tasks_config["summarize_task"],
        )

    @task
    def write_task(self) -> Task:
        return Task(
            config=self.tasks_config["write_task"], output_file="assets/report.html"
        )

    @crew
    def crew(self) -> Crew:
        """创建 CrewZaai 团队"""
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True,
        )@CrewBase
class CrewZaai:
    """CrewZaai 团队"""
```
最后一步是让我们的代理协同工作，通过启动我们的团队来撰写博客文章。


```python
import sys
import warnings

from crew_zaai.src.crew_zaai.crew import CrewZaai
from dotenv import load_dotenv


warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")
load_dotenv()


inputs = {"topic": "AI Agents"}
CrewZaai().crew().kickoff(inputs=inputs)
```
默认情况下，使用的 LLM 是来自 OpenAI 的 GPT\-4o\-mini；因此，必须将 OpenAI API 密钥设置为环境变量。我们还需要为 YouTube 设置 API 密钥（查看此 [链接](https://developers.google.com/youtube/v3/getting-started) 创建您的密钥）和搜索引擎的 URL。我们的 `.env` 文件必须包含以下变量：


```python
YOUTUBE_API_KEY=<YOUR KEY>
OPENAI_API_KEY=<YOUR KEY>
SEARXNG_BASE_URL=https://search.zaai.ai
```
运行脚本后，我们团队的输出将存储在名为 `assets/` 的文件夹中，下面可以看到它的截图：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*1OVQOlAO810X5SXYyAGMBQ.png)


## 结论

在本文中，我们探讨了当前的热门话题：代理 AI。

代理 AI 是行业向更自主和协作的工作流程转变的一种趋势，无需人类干预。它承诺将人类从无聊和简单的任务中解放出来，让他们专注于更有价值的任务。

我们展示了一个简单的用例，其中一个 MAS 在没有人类干预的情况下生成了一篇博客文章。代理们在网上搜索内容，从最近的 YouTube 视频中获取转录，构建想法，并生成一个包含输出的 HTML 页面。我们现在可以使用这些代理来处理新的、更复杂的用例。例如，我们可以帮助客户通过文本和图像在网站上搜索产品，利用多模态能力。我们还可以为课程创建个性化的课程（教育）或审查文件并评估其合规性（法律）。

通过正确的投资和战略，AI 将继续为生产力和创造力设定新标准。可能性是无穷无尽的，现在是探索它们的时机。


## 关于我

连续创业者和 AI 领域的领导者。我为企业开发 AI 产品，并投资于专注于 AI 的初创公司。

[创始人 @ ZAAI](http://zaai.ai/) \| [LinkedIn](https://www.linkedin.com/in/luisbrasroque/) \| [X/Twitter](https://x.com/luisbrasroque)


## 参考文献

\[1] Menlo Ventures. (2024\). *企业中的生成 AI 状态*. Retrieved from [https://menlovc.com/2024\-the\-state\-of\-generative\-ai\-in\-the\-enterprise/](https://menlovc.com/2024-the-state-of-generative-ai-in-the-enterprise/)

\[2] Talebirad, Y., \& Nadiri, A. (2023\). *多代理协作：利用智能 LLM 代理的力量*. arXiv:2306\.03314\.

\[3] Han, S., Zhang, Q., Yao, Y., Jin, W., Xu, Z., \& He, C. (2024\). *LLM 多代理系统：挑战与开放问题*. arXiv:2402\.03578\.

