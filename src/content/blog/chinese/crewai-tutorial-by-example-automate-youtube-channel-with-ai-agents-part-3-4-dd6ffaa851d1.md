---
title: "CrewAI 实例教程：使用人工智能代理自动创建 YouTube 频道（第 3/4 部分）"
meta_title: "CrewAI 实例教程：使用人工智能代理自动创建 YouTube 频道（第 3/4 部分）"
description: "本文介绍了CrewAI教程的第34部分，重点在于实现AI代理以自动化YouTube频道的关键词研究和视频标题、描述生成。首先，作者通过`keyword_researcher_agent()`定义了一个关键词研究代理，利用YouTube数据API收集相关视频信息。接着，创建了`YoutubeKeywordSearchTool`自定义工具，执行关键词搜索并提取视频统计数据。最后，定义了`title_description_writer_agent()`来生成新视频的标题和描述，以提高搜索排名和点击率。文章强调了清晰的输出格式和任务流程，以避免代理的冗余操作。"
date: 2024-12-07T12:29:10Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*uV257qJp_l4ewOFzpYcHbg.png"
categories: ["Programming", "Technology/Web", "Marketing/Seo"]
author: "Rifx.Online"
tags: ["keyword_researcher_agent", "YoutubeKeywordSearchTool", "title_description_writer_agent", "YouTube_Data_API", "structured_output"]
draft: False

---



在[上一篇文章](https://readmedium.com/crewai-tutorial-by-example-automate-youtube-channel-with-ai-agents-part-2-4-ecca45a14e75)中，我们探讨了我们打算构建的 AI 系统的前几个元素。本文将继续介绍剩余元素的 CrewAI 代码，以实现所需的 AI 系统。请查看本教程系列的[GitHub 仓库](https://github.com/kronecker-ai/crewai-youtube-channel)。



### 文章大纲

* *元素 \#4: 关键词研究*
* *元素 \#5: 标题和描述*

如果您更喜欢观看教程视频而不是阅读长文章，这里是教程的视频版本。

## 元素 \#4：关键词研究

接下来，我们在 `agents.py` 中引入 `keyword_researcher_agent()`。`role` 当然是视频关键词研究员，`goal` 是使用我们稍后定义的 **工具** 在所需主题上进行 YouTube 关键词搜索。该代理将使用 **YouTube 数据 API** 收集关于在指定主题关键词的 YouTube 搜索中排名最高的视频的详细信息。

对于 `backstory`，我们将该代理定义为 *关键词研究专家*，并指示代理使用我们提供的自定义工具来识别所需关键词主题搜索中的 *前 20 名排名* 的 YouTube 视频。我们还指定提取的信息将被 *另一个代理* 在 AI 系统中使用。

将 `llm` 参数设置为 `verbosity` 为 true 以获取打印输出，`allow_delegation` 为 false，因为我们不需要将任务委派给其他代理。将 `max_iteration` 设置为 5，并提供自定义 `tools` 以在 YouTube 上进行关键词搜索。

```python
def keyword_researcher_agent(self):
    return Agent(
        role="Video Keyword Researcher",
        goal=(
            f"You should do a YouTube keyword search using the provided tool on the keyword topic: {self.topic}, "
            f"for 20 videos on this topic keyword that rank the highest in YouTube video search. "
            f"The collected information will be used to create the title and description for a new YouTube video."
        ),
        backstory=(
            f"You are an expert in keyword research and gathering information about YouTube videos. "
            f"You utilise the provided tool to identify the top 20 ranking YouTube videos on topic: {self.topic}, "
            f"and extract their information as a reference for another agent."
        ),
        llm=self.agent_llm,
        verbose=True,
        allow_delegation=False,
        max_iter=5,
        tools=[YoutubeKeywordSearchTool()]
    )
```
现在让我们在 `tools.py` 中创建名为 `YoutubeKeywordSearchTool()` 的自定义工具。

### 创建自定义工具

根据CrewAI文档，我们需要的格式非常清晰。我们需要将工具定义为一个类，包含`name`、`description`和一个函数`_run()`。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*oFb2o7K9hMQshZtgPfG4Jw.png)

在`tools.py`中定义类`YoutubeKeywordSearchTool`。给工具命名，并提供一个清晰的标题以传达其目的。确保描述以代理能够轻松理解如何以及何时使用此工具的方式编写，并解释`_run()`的参数。参数`query`指的是我们将使用YouTube数据API搜索的关键字，即我们给代理的*主题*。参数`max_results`是我们希望API返回的视频结果数量。

```python
class YoutubeKeywordSearchTool(BaseTool):
    name: str = "在YouTube上进行关键字搜索"
    description: str = (
        "使用YouTube数据API在YouTube上搜索视频，返回特定数量的视频列表，"
        "基于提供的关键字查询。参数'query'将提供的关键字作为输入，"
        "参数'max_result'将返回的视频结果数量作为输入。"
    )

    def _run():
      ...
```
在我们创建`_run()`函数之前，让我们访问[YouTube数据API文档](https://developers.google.com/youtube/v3/docs)以了解如何使用此API。由于我们正在进行关键字搜索，请导航到*search \>\> list*，查看*list by keyword \>\> `</>`*以打开API探索器。

文档示例使用`max_results` 25，查询`q`为‘surfing’。取消勾选*OAuth*，因为我们在关键字搜索中不需要它。*执行*，转到*Python选项卡*，查看代码以**构建**API连接，创建API **请求**并**执行**。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*o-VI7h6kFpfDvfKV9UewRg.png)

让我们回到`tools.py`并创建`_run()`函数。

* 通过提供YouTube API密钥来创建与API客户端的连接。
* 按照API文档中的示例代码创建搜索请求。
* 执行请求并从搜索响应中获取所需的项目。
* 提取排名和视频标题等详细信息。
* 还获取视频ID，以便对每个视频进行另一个API调用以获取相关统计信息。
* 将视频搜索结果附加到列表中，然后放入Pandas数据框中。

```python
def _run(self, query: str, max_results: int = 20) -> str:
    youtube = build(serviceName='youtube', version='v3', developerKey=os.getenv("YOUTUBE_API_KEY"))
    search_request = youtube.search().list(
        part="snippet",
        maxResults=max_results,
        q=query,
        type="video"
    )
    search_response = search_request.execute()
    search_items = search_response.get("items", [])

    result_list = [["rank", "video_id", "video_title"]]
    for idx, item in enumerate(search_items):
        result_list.append([
            idx + 1,
            item['id']['videoId'],
            item['snippet']['title']
        ])

    result_df = pd.DataFrame(result_list[1:], columns=result_list[0])

    ...
```
* 进行另一个API调用，以获取每个视频的评论数、点赞数和观看次数等信息。
* 创建搜索请求，执行它，并从搜索响应中获取所需的项目。
* 提取每个视频的评论数、点赞数和观看次数的详细信息，并放入Pandas数据框中。
* 将两个Pandas数据框合并在一起，并将合并后的数据框转换为CSV格式，以便代理轻松读取和处理。

```python
def _run(self, query: str, max_results: int = 20) -> str:

    ...

    result_df = pd.DataFrame(result_list[1:], columns=result_list[0])

    vid_request = youtube.videos().list(
        part="snippet,statistics",
        id=','.join(map(str, list(result_df['video_id'])))
    )
    vid_response = vid_request.execute()
    vid_items = vid_response.get("items", [])

    vid_list = [["video_id", "comment_count", "like_count", "view_count"]]
    for item in vid_items:
        vid_list.append([
            item['id'],
            int(item['statistics']['commentCount']),
            int(item['statistics']['likeCount']),
            int(item['statistics']['viewCount'])
        ])

    vid_df = pd.DataFrame(vid_list[1:], columns=vid_list[0])
    # 合并两个数据框
    full_result_df = pd.merge(result_df, vid_df, on='video_id')
    full_result_csv = full_result_df.to_csv(index=False)
    return full_result_csv
```
太好了！我们已经完成了创建自定义工具的所有繁重工作。

### 创建任务

让我们回到 `tasks.py` 来创建 `keyword_researcher_task()`。我们写一个 `description`，清楚地提到参数，例如 **最多 20 个结果**，关于 **主题关键词**，代理应该使用这些参数来运行我们创建的工具。

和往常一样，`expected_output` 将为代理提供一个模板。该任务的输出应该格式化为 CSV 文件，包含以下列：

* `rank`，YouTube 搜索结果的视频排名
* `video_id`，每个 YouTube 视频的唯一标识 ID
* `video_title`，每个 YouTube 视频的标题
* `comment_count`，显示每个视频的评论数量
* `like_count`，显示每个视频获得的点赞数量
* `view_count`，视频发布以来获得的观看次数

给出一些关于排名最高的视频 CSV 文件的行示例。

我们需要为与此任务相关的 `agent` 提供一个参数，该参数将在稍后的 `main.py` 中指定。`context` 也将在稍后的 `main.py` 中指定。我们将排名最高的视频保存在指定路径的 `output_file` 中。

```python
def keyword_researcher_task(self, agent, context):
    return Task(
        description=(
            f"You should do a YouTube keyword search using the provided tool on the keyword: {self.topic}, "
            f"for 20 videos on this topic keyword that rank the highest in YouTube video search."
        ),
        expected_output=(
            "You should output a CSV file with the following columns, from left to right:"
            "- rank: [the 'rank' column, eg: 1,2,3,...]\n"
            "- video_id: [the 'video_id' column from the tool output]\n"
            "- video_title: [the 'video_title' column from the tool output]\n"
            "- comment_count: [the 'comment_count' column from the tool output]\n"
            "- like_count: [the 'like_count' column from the tool output]\n"
            "- view_count: [the 'view_count' column from the tool output]\n"
            "Your output file should follow the template provided below inside the triple backticks delimiter. "
            "Do not include any extra words and symbols other than those required as in the template. "
            "You should STRICTLY follow the template format INSIDE the triple backticks delimiter. "
            "Do not include any extra words or symbols other than those required to fill up the template format.\n"
            "```\n"
            f'''"The top 20 ranking YouTube videos for topic: {self.topic}"\n'''
            '''"rank","video_id","video_title","comment_count","like_count","view_count"\n'''
            '''"1","Ks-_Mh1QhMc","Your body language may shape who you are | Amy Cuddy | TED","9853","443945","25186508"\n'''
            '''...\n'''
            "```"
        ),
        agent=agent,
        context=context,
        output_file=os.path.join(self.output_dir, 'top_rank_videos.csv')
    )
```
现在，你可能会想：

> 为什么我们仍然明确展示 CSV 列应该在 `expected_output` 中是什么样子，即使我们的自定义工具 **已经生成了所需的格式**？

原因是：如果你没有在预期输出中明确表达 CSV 格式，代理可能会进入一个 **冗长的重复循环**，试图达到预期输出，因为它可能认为输出状态尚未实现。

当这种情况发生时，会触发重复的 **思考**、**行动** 和 **观察**，这会迅速消耗你的预算，因为产生了不必要的 LLM 调用。因此，提前明确说明是更好的选择，以避免这种情况。我们将在下一篇文章中分析 CrewAI 的运行时进一步解释思考、行动和观察的过程。

## 元素 \#5：标题和描述

让我们介绍拼图的***最后一块***！在这里，我们创建 `title_description_writer_agent()` 来为我们的新视频生成引人入胜的标题和描述。

将“视频标题和描述撰写者”作为 `role`，`goal` 是为新主题的 YouTube 视频创建标题和描述。

对于 `backstory`，我们将代理定义为 *视频标题和描述创作专家*。我们让代理知道，它应该根据两条重要信息生成标题和描述：

* **视频脚本** 由 `scriptwriter_agent()` 提供
* **高排名视频** 细节由 `keyword_researcher_agent()` 收集

这为什么重要？因为我们希望我们的新视频在 YouTube 搜索中排名靠前。我们还希望标题和描述能够吸引高点击率。我们在这里有 `llm` 参数，稍后将在 `main.py` 中将 LLM 指定给代理。将 `verbosity` 设置为 true 以便打印输出，将 `allow_delegation` 设置为 false，因为我们不需要将任务委托给其他代理，并将 `max_iteration` 设置为 5\。

```python
def title_description_writer_agent(self):
    return Agent(
        role="Video Title and Description Writer",
        goal=f"Create titles and descriptions for a new YouTube video on the topic: {self.topic}.",
        backstory=(
            f"You are an expert in creating title and description for new YouTube videos. "
            f"You base your title and description writing on the video script provided by Video Scriptwriter, and "
            f"the research output from Video Details Researcher. Based on these two elements, "
            f"you create attractive titles and descriptions for the new YouTube video that makes the video "
            f"rank high in the YouTube search. You produce a video title and description that attract "
            f"audience with high click-through rate. "
        ),
        llm=self.agent_llm,
        verbose=True,
        allow_delegation=False,
        max_iter=5,
    )
```

### 创建任务

现在让我们转到 `tasks.py` 创建 `title_description_writer_task()`。在 `description` 中，我们提供了一个任务流程，代理在生成视频标题和描述时应遵循。首先，我们强调使用 *视频脚本* 和 *关键词搜索结果*，为我们关于所需主题的新视频生成 5 个吸引人的标题和描述。我们为视频标题指定了 *100 字符的限制*，为视频描述指定了 *5000 字符的限制*。我们要求代理以最大化视频在关键词搜索中 *排名靠前* 的方式生成标题和描述。我们强调 *使用由编剧代理提供的视频脚本*，以确保生成的标题和描述与我们的视频相匹配。

我们需要一个与此任务相关的 `agent` 参数，这将在稍后在 `main.py` 中指定。`context` 也将在稍后在 `main.py` 中指定。将生成的标题和描述保存到所需路径的 `output_file` 中。

```python
def title_description_writer_task(self, agent, context):
    return Task(
        description=(
            "您应遵循以下任务流程生成良好的视频标题和描述：\n"
            f"1. 根据关键词研究代理的前 20 个排名 YouTube 视频标题和描述，"
            f"以及编剧代理撰写的视频脚本，为主题为：{self.topic} 的新 YouTube 视频生成 5 个引人注目的标题。\n"
            f"2. 您应生成少于 100 个字符的标题，以便获得高点击率。\n"
            f"3. 对于您创建的每个视频标题，请生成一个视频描述，以便让新视频在 YouTube 关键词搜索中排名靠前。视频描述必须少于 5000 个字符。\n"
            f"4. 您应生成新的视频标题和描述，以确保视频在 YouTube 关键词搜索中排名靠前。\n"
            f"5. 使用编剧代理撰写的视频脚本是极其重要的，"
            f"以确保生成的标题和描述与新视频量身定制。"
        ),
        expected_output=(
            "您的输出文件应遵循下面提供的模板，在三重反引号分隔符内。"
            "请勿包含任何额外的单词和符号，除了模板中所需的内容。"
            "您应严格遵循三重反引号分隔符内的模板格式。"
            "请勿包含任何额外的单词或符号，除了填充模板格式所需的内容。\n"
            "```\n"
            f"主题：{self.topic} 的候选标题和描述\n\n"
            "1. [生成的标题 #1]\n"
            "[为标题 #1 生成的视频描述]\n\n"
            "2. [生成的标题 #2]\n"
            "[为标题 #2 生成的视频描述]\n\n"
            "3. [生成的标题 #3]\n"
            "[为标题 #3 生成的视频描述]\n\n"
            "4. ...\n"
            "```"
        ),
        agent=agent,
        context=context,
        output_file=os.path.join(self.output_dir, 'title_description.txt')
    )
```
呼，差不多完成了。在[下一篇（最后一篇！）文章](https://readmedium.com/crewai-tutorial-by-example-automate-youtube-channel-with-ai-agents-part-4-4-4bc08c408c61)中，我们将在 `main.py` 中将所有内容整合在一起，然后运行并分析 AI 系统。

📅 如果您想了解更多关于 AI 代理或人工智能的一般知识，我邀请您预订一个[咨询会议](https://cal.com/kronecker-ai/consultation)。

我将非常乐意回答您的问题，并为您提供启动自己 AI 之旅所需的资源！

**联系：**💼 [*LinkedIn*](https://www.linkedin.com/company/kronecker-ai) *\|* 💬 [*Twitter*](https://x.com/KroneckerAI) *\|* 🎥 [*YouTube*](https://www.youtube.com/@KroneckerAI?sub_confirmation=1) *\|* 💻 [*网站*](https://kronecker.ai/)

