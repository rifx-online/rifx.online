---
title: "AI for BI：利用 CrewAI 和 OpenAI 构建商业信息报告"
meta_title: "AI for BI：利用 CrewAI 和 OpenAI 构建商业信息报告"
description: "本文探讨了如何利用CrewAI和OpenAI API从CSV数据创建简单的商业信息（BI）报告。文章介绍了构建AI驱动的BI应用程序的过程，包括生成图表和文本报告的功能。通过创建两个代理，一个用于图表生成，另一个用于数据分析和报告撰写，展示了AI在数据分析中的潜力。最终生成的报告涵盖了销售表现的各个方面，并附带相应的图表，展示了AI在商业智能领域的应用前景。"
date: 2024-11-25T15:00:22Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*GsGgqHBQlZiLSxqQ"
categories: ["Programming", "Technology", "Data Science"]
author: "Rifx.Online"
tags: ["Business", "Intelligence", "CrewAI", "OpenAI", "Visualizations"]
draft: False

---



### 如何直接从CSV数据创建简单的BI报告



商业信息应用程序帮助企业将数据作为资源来做出关键决策，我们将利用AI构建一个这样的应用。

AI必将越来越多地在BI工具中发挥作用；更具体地说，基于LLM的应用程序将使BI应用能够创建可视化，通过数据分析提供洞察，并自动化商业报告。

因此，在本文中，我们将探讨LLM应用如何帮助创建商业信息。它不会是一个全面的BI应用；然而，它将直接从数据中自动创建图表和文本报告。

我们将通过CrewAI使用OpenAI API构建一个程序，展示AI在这一领域的潜力，并最终形成一个简单的AI驱动的BI应用。

我应该指出，我使用这些特定组件是因为它们方便——我在最近的[教程](https://datavizandai.github.io/2024/09/28/AI_Agents_vs._AI_Pipelines-3A_a_Practical_Guide_to_Coding_Your_LLM_Application.html)中使用了CrewAI（如果你对CrewAI不熟悉，我建议你阅读一下），并且对它越来越熟悉。CrewAI默认使用OpenAI，因此我也选择了这个。

其他LLM，如Anthropic的Claude、Google的Gemini等，同样有效；虽然CrewAI易于使用，但其他支持代码执行的AI代理框架，如Autogen或类似的框架，也同样合适。

在这里，我使用的是CrewAI的开源产品，当然是免费的；OpenAI需要API密钥，因此你必须注册并会产生使用费用\[1\]。

## BI 应用和数据

我们将探索两种功能：创建图表和文本报告。这两者都需要一个能够分析和理解数据的 LLM——对于大多数现代 LLM 来说，这应该不算困难。

我们将创建两个代理：一个用于创建图表，一个用于分析数据并生成报告。

我们将使用的数据是 CSV 格式的，完全是虚构的。它是通过 ChatGPT 创建的，涉及一家销售不太可能的产品（从智能电视到床架）在全球各个地区的公司。

共有三个表格。第一个记录了每月的销售额。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*bDLrWJ_cuxcOa6Sh)

第二个显示了每个地区畅销产品的销售情况。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*lk4_csz7Xet22plY)

第三个详细列出了每个商品的销售情况。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*4guxe3n-1syYIxLD)

这是一组销售主管可能会发现有用的现实数据吗？我会坦诚地承认，我对此一无所知。我没有拥有公司，也不销售任何东西，因此无法在这个领域声称有任何专业知识。

然而，我不确定这是否真的那么重要。我们可以使用 ChatGPT 给我的数据，创建图表，并进行一些分析和报告，无论这些数据是否确切（甚至模糊）典型。

那么，让我们开始吧。我正在使用 Jupyter Lab 编写这些示例，您可以在我的 [GitHub 仓库](https://github.com/alanjones2/CrewAIapps) 的 **AIBI-3** 文件夹中找到所有的笔记本。

图表始终是 BI 报告的一个特征，所以让我们从图表开始。

## 图表生成器

首先，我们将获取 CSV 文件，并让 LLM 从中创建图表。下面是一个示例——它是使用 Matplotlib 生成的。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*AIDlTPaWw46wqTwk)

我们将使用 LLM 生成代码，并使用 CrewAI 来运行它。

运行 LLM 生成的代码可能不安全，因为 LLM 可以生成任意代码，这不一定是我们想要的（它可能产生一些在运行时可能会对本地文件系统造成损害的代码）。

因此，它需要先由人类检查，或者在某种沙箱中运行。对此有不同的方法，例如，Autogen 让你选择如何运行代码，但 CrewAI 优先考虑安全，所有代码都在与本地文件系统隔离的 Docker 容器中运行。

这意味着您需要在本地机器上运行 Docker。这很简单——只需访问 [Docker 网站](https://www.docker.com/products/docker-desktop/)，下载适合您操作系统的桌面应用程序，安装并运行它。您无需创建帐户或登录——您甚至不需要了解 Docker，只需让它运行，CrewAI 将使用它。

我们将让 LLM 决定它想要创建哪些图表，看看结果如何。我在下面的每个代码块中都在单独的 Jupyter 代码单元中编写代码；它们共同构成完整的程序。

我们将使用默认的 OpenAI API\[1\]，这意味着您的 API 密钥应该作为环境变量可访问。如果它存储为环境变量，您需要首先运行以下代码块。

```python
import os
os.environ["OPENAI_API_KEY"] = "your api key"
```
要开始，您首先需要导入必要的库并设置 LLM 模型。

```python
from crewai import Agent, Task, Crew
llm = "gpt-4o-mini"
```
CrewAI 应用程序由几个元素组成：代理、任务和运行任务和代理的团队。我们将在后续中看到它们是如何使用的。（有关 CrewAI 的更详细介绍，请参阅我的文章 [AI Agents vs. AI Pipelines: a Practical Guide to Coding Your LLM Application](https://alanjones2.github.io/articles/agentpipeline/text/article.html)）。

为了执行 LLM 无法完成的任务，我们还需要为代理提供工具——我们将很快看到它们的工作。

我们在这里需要的工具允许 LLM 读取数据文件以及将图表和报告写入本地文件系统。因此，接下来，我们导入 CrewAI 所需的工具以读取和写入文件。

```python
from crewai_tools import FileReadTool, FileWriterTool

file_read_tool = FileReadTool()
file_writer_tool = FileWriterTool()
```
在 CrewAI 应用程序中，许多工作都是由一个或多个代理完成的。下面，我们设置 `chart_agent`。

```python
## 定义代理

chart_agent = Agent(
        role="图表创建者",
        goal="""读取提供的数据并根据这些数据创建一个 matplotlib 图表。
                如果您收到有关如何绘制图表的具体指示，请遵循它们，如果没有，请创建一个最佳表示数据的图表""",
        backstory="""您的目标是读取和分析销售数据并创建一个 matplotlib 图表""",
        tools=[file_read_tool, file_writer_tool],
        llm=llm,
        allow_code_execution=True
    )
```
您可以看到这是从 CrewAI [Agent](https://docs.crewai.com/concepts/agents) 类实例化的对象。前三个参数用于创建系统提示——我们期望代理做什么在 `goal` 和 `backstory` 参数中定义。您还可以看到我们声明了 LLM 可以使用的工具，并提及我们将使用的 LLM。

我们给代理提供了指令，这将使其在创建内容时具有自主性，除非给予具体指示。

重要的是，我们将 `allow_code_execution` 设置为 `True`。这隐含地允许 LLM 使用其代码执行工具并在 Docker 中运行代码。

我在一个 Python `dict` 中定义了我们要使用的文件——数据文件当然已经存在，图像文件是我们希望保存图表的地方。

```python
files = [
    {
        'data_file_name':'sales_product_cat.csv',
        'chart_file_name': 'sales_product_summary.png',
    },
    {
        'data_file_name': 'monthly_sales.csv',
        'chart_file_name': 'monthly_sales.png',
    },
    {
        'data_file_name': 'sales_by_region.csv',
        'chart_file_name': 'sales_by_region.png',
    }
]
```
接下来要做的就是创建一个任务，进一步定义我们想要做的事情。它告诉代理为数据文件创建一个图表并将其保存在本地文件中。我们还需要指定适当的代理（可能不止一个）和必要的工具。

最后，我们设置一个团队。这定义了我们想要运行的代理列表和任务列表（在这种情况下，列表只有一个元素）。`verbose` 参数的作用是您所期望的；当设置为 `True` 时，代理将把它的所有思考写入控制台。如果您不想被大量文本淹没，则将其设置为 `False`。

好吧，几乎是最后一步。我们当然需要启动团队并收集结果。我们通常会使用 `crew.kickoff()` 方法，但在这种情况下，我们有一个希望处理的文件列表，CrewAI 给了我们一个有用的方法，可以在 `crew.kickoff_for_each()` 中遍历列表，正如下文所示，这需要一个列表作为参数。

```python
create_chart = Task(
    description="""为 {data_file_name} 创建一个图表，并将其保存在 {chart_file_name} 中。""",
    expected_output="""一个 matplotlib 图表""",
    agent=chart_agent,
    tools=[file_read_tool, file_writer_tool]
)

## 定义团队
crew = Crew(
    agents=[chart_agent],
    tasks=[create_chart],
    verbose=True
)
result = crew.kickoff_for_each(inputs=files)
```
以这种方式运行团队会产生大量文本，我不打算在这里复制，但它详细说明了代理正在经历的步骤。事件的顺序如下：

* 使用 `files_read_tool` 读取数据文件
* 将数据发送给 LLM 以分析数据并生成创建 Matplotlib 图表的代码
* 在 Docker 中运行 LLM 生成的代码
* 使用 `file_writer_tool` 将图表写入本地文件系统中的 PNG 文件。

它将为每个数据文件执行此操作，如果您打开 Docker 窗口，您将看到它根据需要运行代码解释器图像。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*Y0sW2p8gQCWGdzzq)

由于代码是由 LLM 生成的，我们无法保证它每次都会产生相同的结果。然而，它似乎相当一致。每个数据文件都会生成一幅图像；本节开头可以看到每月销售数据，另外两个图像如下所示。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*gWBjYx4hxDD637qr)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*NrYkrwLhtDNytqQV)

## 代理生成的报告

现在我们有了图表，让我们继续生成一份报告，这将是 LLM 进行一些简单分析和问答的结果。这份报告以及之前生成的图像链接将被合并到一个 Markdown 文件中，这将是最终报告。

我们需要一个新的代理，我们称之为 `data_analysis_agent`。

我们以与之前相似的格式设置代理，但当然，角色、目标和背景故事是不同的。此外，这次我们禁用了代码执行，因为我们不需要它来创建报告。

```python
data_analysis_agent = Agent(
        role="Data Analyser",
        goal="""You aim is to read and analyse sales data. You should
                then write a report on sales performance 
                that includes an executive summary.
                """,
        backstory="You are assigned to perform sales analysis for a company",
        tools=[file_read_tool, file_writer_tool],
        llm=llm,
        allow_code_execution=False
    )
```
这次代理将被分配的任务当然是不同的。描述告诉代理该做什么：前几句给代理提供了它所需的文件（数据和图表），然后是 LLM 应该尝试回答的问题列表。还告诉它在哪里保存报告，并且应该是 Markdown 格式。

请注意，文件在问题之后也被包含在内；原因是，在程序的早期版本中，LLM 似乎忘记了图表文件，再次包含它们可以解决这个问题。

在任务定义之后，我们设置了团队并执行它。

```python
write_report = Task(
    description=f"""The following contains a set of data files and
                    corresponding charts:
                        {files}
                    Write report in Markdown that includes and overview of all
                    of the sales data and incorporate the corresponding charts.If the information is available, or you can calculate it,
                    try and answer the following questions: 
                    1. What has been the overall revenue for the latest month?
                    2. What are the top selling 5 items during the reporting 
                    period?
                    3. In which regions have there been the most sales and 
                    what items are popular those regions?
                    4. What sort of growth has there been over the reporting 
                    period?
                    5. Are there any trends that you can detect?
                    The overview of the data and the corresponding charts from {files} should be included in an appendix.
                    
                    Save the result in the file './report.md'.
                    """,
    expected_output="""A markdown file""",
    agent=data_analysis_agent,
    tools=[file_read_tool, file_writer_tool]
)
## 定义团队
crew = Crew(
    agents=[data_analysis_agent],
    tasks=[write_report],
    verbose=True
)
result = crew.kickoff()

```
生成的报告太长，无法在文本中包含，因此我已将其附加到文章末尾。然而，程序合理地尝试回答问题，并忠实地包含了图表。

报告较短，更复杂的提示可能会导致更全面的内容。然而，在设计提示时，必须小心不要给 LLM 提供不适当的暗示。例如，我从 ChatGPT 会话中剪切并粘贴了一些建议，其中包括关于供应链问题的问题。当然，从给定的数据中无法推断出这样的一个问题，但 LLM 却虚构了一个不存在的供应链问题来解释销售下滑！

## 结论与更实用程序的展望

创建这样一个非常基本的 BI 报告生成器非常简单，但在图表创建和报告撰写方面可以进行许多改进。

这个程序相当通用，它可以接受任何一组 CSV 文件，并尽力解释它们并构建合适的图表。我们可以通过在 `files` 数据结构中包含数据文件的描述来更好地针对特定应用进行定制，我们还可以添加我们想要创建的图表的规范 - 代理已经准备好期待这一点，但我们需要进行一些小的更改来纳入数据描述。这两项措施都有助于确保输出更加一致，并更好地满足我们的需求。

报告撰写提示也可以更具体地针对特定应用，并扩展以提供更长的报告。

如果我们将该提示和 `files` 数据结构放到一个单独的文件中，这将使程序能够针对不同的应用进行调整。

这只是使用 AI 生成 BI 报告的一个基本尝试，但仍有很大的改进空间。使用外部文件来指定更详细的数据文件描述和明确的图表规范，将允许非程序员根据他们的特定需求调整程序，同时保持程序的通用性。当然，Jupyter Notebook 不一定是一个适合非程序员使用的应用程序的最佳载体。但我希望这能给您带来一些思考。

如往常一样，感谢您的阅读 - 我希望这对您有所帮助。您可以在我的 [网站](https://readmedium.com/alanjones2.github.io) 上看到更多文章，并在 [这里](http://technofile.substack.com) 订阅我偶尔的新闻通讯。

本文的代码和数据可以在这个 [GitHub 仓库](https://github.com/alanjones2/CrewAIapps) 的 *AIBI-3* 文件夹中找到。生成的图表和报告也在同一文件夹中。

## 注释和参考

1. 如果您在这里运行代码，您需要一个 OpenAI 账户和 API 密钥。使用此服务将会产生费用。在这里运行代码的费用不应超过几毛钱，但您应始终在 OpenAI 控制面板上检查您的支出。
2. 所有图像和截图均由我本人，即作者提供，除非另有说明。
3. 免责声明：我与本文中提到的任何公司没有商业联系。

## 附录 — 报告

请注意，Markdown 格式在 Medium 中的渲染效果并不完美，但您看到的内容与生成的内容非常接近。

## 销售业绩报告

## 执行摘要

本报告分析了公司在报告期内的销售表现，重点突出总体收入、畅销商品、区域表现、增长趋势和显著观察。分析基于各产品类别的销售数据、每月销售数字和区域表现指标。

## 销售概览

1. **最新月份的总体收入：**
* **八月总收入：** $4,000,000

2\. **畅销的五个商品：**

* 1\. 智能手机 — $1,200,000
* 2\. 笔记本电脑 — $850,000
* 3\. 智能电视 — $450,000
* 4\. 冰箱 — $400,000
* 5\. 洗衣机 — $200,000

**3\. 销售最多的地区：**

* **北美：**
* 总收入：$1,500,000
* 畅销产品：智能手机（800台）
* **欧洲：**
* 总收入：$1,200,000
* 畅销产品：笔记本电脑（600台）
* **亚太：**
* 总收入：$800,000
* 畅销产品：智能电视（900台）
* **南美：**
* 总收入：$350,000
* 畅销产品：冰箱（300台）
* **非洲：**
* 总收入：$250,000
* 畅销产品：沙发（150台）

**4\. 报告期内的增长：**

* 整体趋势显示销售持续增长。例如，收入从一月的 $3,500,000 增长到八月的 $4,000,000，表明销售业绩呈现出逐渐上升的轨迹。

**5\. 检测到的趋势：**

* 电子产品的销售稳步增长，特别是智能手机和笔记本电脑。
* 季节性可能影响销售，正如每月业绩波动所证明的那样。
* 新产品类别，特别是在家用电器和家具方面，显示出良好的增长潜力。

## 附录

* **产品类别销售图表：**

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*CQxZG5Xfs9v5JsuD)

* **月度销售图表：**

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*d-Af0u03ggIsN09K)

* **地区销售图表：**

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*sjnuGHYtQEZrl3NI)

*本文最初发布在我的网站，[点击这里](https://datavizandai.github.io/2024/11/16/AI4BI-2.html)*

