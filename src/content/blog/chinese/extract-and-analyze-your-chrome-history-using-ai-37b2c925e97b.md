---
title: "使用人工智能提取和分析您的 Chrome 浏览器历史记录"
meta_title: "使用人工智能提取和分析您的 Chrome 浏览器历史记录"
description: "本文探讨了如何提取和分析Chrome浏览历史，以获取有关在线活动的见解。首先，介绍了获取历史文件的无代码和代码方法。然后，强调了清理数据的重要性，并展示了如何使用AI对浏览历史进行聚类，以识别使用模式、生产力趋势和学习主题。分析浏览历史不仅有助于提高个人生产力，还能促进自我反思和时间管理。"
date: 2024-12-06T00:33:50Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*PdmOFEeb9oX9-wXPuh5CQw.png"
categories: ["Technology", "Programming", "Data Science"]
author: "Rifx.Online"
tags: ["Chrome", "browsing", "history", "clustering", "productivity"]
draft: False

---



有没有想过您的浏览历史对您说了什么？无论您是想了解自己的在线习惯，反思自己的工作效率，还是需要记录自己的活动，分析浏览历史都能提供有价值的见解。在本文中，我们将探讨如何提取您的 Chrome 浏览历史，并利用 AI 进行聚类和分析。我们将介绍一种无代码的方法以及一种更技术性的方式，适合那些熟悉命令行的用户。

## 为什么浏览历史？

在之前的帖子中，我讨论了使用 Logseq 或 Obsidian 等工具进行日记记录的价值，以反思过去的活动并计划未来的活动。AI 工具，例如 [NotebookLM](https://readmedium.com/ai-powered-weekly-reviews-with-gpt-and-obsidian-72b7fa1d356a)，可以通过识别日记条目中的模式和见解，进一步增强这一过程，这些模式和见解可能会被忽视。

这些方法的共同点在于需要有意识的自我反思和记笔记。虽然我个人发现这一实践是有益的，并鼓励他人采纳，但我承认，维护详细记录可能会很具挑战性，特别是在处理多项任务或深入复杂主题时。在网页浏览过程中尤其如此，通常会从一个查询开始，然后迅速进入一系列相关的搜索。可以将其想象成编程中的调用栈：一个函数调用另一个，依此类推，最终（希望）返回到原始点。

挑战在于捕捉这些游走的在线旅程。对于简短的探索，简单的笔记可能就足够了（“研究了 XYZ”）。然而，对于较长或更复杂的会话，特别是涉及意外绕道的情况，则需要更细致的记录以保持上下文。最终目标是能够重建和解释在特定时间段内的活动，无论是一天、一周还是更长时间。归根结底：

* 我们花费了大量时间从事在线活动。
* 这些活动往往导致意外的偏离，使全面记笔记变得困难。
* 尽管如此，能够回忆和反思我们如何花费时间是至关重要的，无论是为了提高生产力还是知识保留。例如，快速搜索“最佳降噪耳机”可能会导致对音频工程原则的深入探索。同样，查找“如何煮意大利面”也可能轻易演变为对意大利美食的更广泛研究。

理想情况下，这一捕捉过程应自动化，以补充有意识的日记记录。新兴工具如 [Microsoft Recall](https://readmedium.com/exploring-openrecall-an-in-depth-open-source-alternative-to-microsofts-recall-feature-7ed958bdef7e) 和各种开源替代品旨在满足这一需求，尽管它们的全面数据收集引发了重大隐私问题。

一个更容易获得且不那么侵入性的解决方案就在我们的网页浏览器中。像 Chrome 这样的浏览器自动记录大量数据，包括浏览历史、表单输入等。这些数据往往被忽视，但可以被重新利用，以提供我们在线活动的宝贵见解，使我们能够反思过去的探索并识别出反复出现的模式或兴趣领域。

**信服了吗**？让我们看看它是如何工作的……

## 第一步：获取历史文件

## 无代码方式

如果您不想使用 shell 命令，可以轻松地通过浏览器扩展下载您的 Chrome 历史记录。其中一个扩展是 [Export Chrome History](https://chromewebstore.google.com/detail/export-chrome-history/dihloblpkeiddiaojbagoecedbfpifdj)。这只是一个例子，虽然我们没有亲自使用过，但它可以作为一个起点。始终确保您信任所安装的扩展，因为它们可以访问敏感数据。

## 代码方式（适用于Mac用户）

对于那些熟悉命令行的用户，这里有一个逐步指南：

1. **关闭浏览器并复制历史文件**

在继续之前，请确保关闭Google Chrome，以防止任何文件访问问题。然后，打开终端并运行：

```python
cp /Users/<username>/Library/Application\ Support/Google/Chrome/Default/History /tmp
```
将 `<username>` 替换为您实际的macOS用户名。此命令将您的Chrome历史文件复制到`/tmp`目录。

1. **安装SQLite（如果尚未安装）**

SQLite是一个轻量级数据库引擎，Chrome用它来存储您的历史记录。使用Homebrew安装它：

```python
brew install sqlite
```
1. **浏览数据库**

要查看数据库中有哪些表，请运行：

```python
sqlite3 /tmp/History ".tables"
```
您会看到一个表的列表，例如：

```python
urls
visits
visit_source
downloads
keyword_search_terms
...
```
看到存储了多少数据是令人着迷（也有点令人担忧）的。

1. **将历史记录导出为可读格式**

让我们将浏览历史提取到CSV文件中：

```python
sqlite3 -header -csv /tmp/History "SELECT
    datetime(last_visit_time/1000000-11644473600, 'unixepoch', 'localtime') as visit_time,
    title,
    url,
    visit_count
FROM urls
ORDER BY last_visit_time DESC
LIMIT 100000;" > recent_history.csv
```
此命令从`urls`表中选择访问时间、标题、URL和访问次数，按最近访问排序，并将最后100,000条记录保存到`recent_history.csv`。

## 第2步：清理数据

现在你已经将历史记录保存为CSV格式，是时候对其进行清理了。由于URL可能会多次出现，我们将对其进行汇总，以查看你访问每个域名的频率。

你可以使用Excel或任何电子表格软件来处理数据。不过，如果你更喜欢使用命令行，以下是你可以如何操作：


```python
awk -F'","' '{
    split($3,u,"//");
    d=(length(u)>1?u[2]:u[1]);
    split(d,h,"/");
    if(h[1]!="") print substr($1,2,7), h[1]
}' recent_history.csv | sort | uniq -c | sort -rn
```
该命令执行以下操作：

* 使用`awk`处理CSV。
* 从每个URL中提取域名。
* 打印日期和域名。
* 对唯一出现的项进行排序和计数。
* 根据访问计数对输出进行降序排序。

以下是输出可能的示例：


```python
189 2024-11 chat.openai.com
82 2024-10 docs.aws.amazon.com
45 2024-09 github.com
28 2024-11 portal.azure.com
20 2024-12 eu-west-1.console.aws.amazon.com
15 2024-11 status.digitalocean.com
12 2024-12 analytics.google.com
9 2024-10 stripe.com/dashboard
8 2024-11 console.firebase.google.com
7 2024-11 app.netlify.com
6 2024-10 docs.microsoft.com
5 2024-10 developer.mozilla.org
4 2024-12 support.google.com
4 2024-11 app.hubspot.com
3 2024-11 stackoverflow.com
3 2024-11 sentry.io
3 2024-10 app.datadog.com
2 2024-12 grafana.com
```
如你所见，某些网站如`chat.openai.com`和`docs.aws.amazon.com`被频繁访问。

## 第3步：让AI对历史记录进行聚类

使用清理后的数据，您现在可以使用AI将浏览历史记录聚类为有意义的类别。

## 使用开源 AI 模型

出于隐私原因，您可能更喜欢在自己的设备上使用开源 AI 模型。像 LLaMA 或 Mistral 这样的模型可以与 LocalAI、Ollama 或 Open WebUI 等工具一起使用。就个人而言，我推荐 Open WebUI，因为它易于使用。

1. **准备提示**

复制上一步的输出，并使用以下提示：


```python
Cluster this browsing history and output it in a table.
```
1. **运行 AI 模型**

将提示和数据粘贴到您选择的 AI 工具中。AI 将处理数据，并根据内容和您的使用模式将网站聚类到不同类别中。



*AI 聚类输出示例。*

就这样！您已成功使用 AI 分析了您的浏览历史。

## 分析浏览历史的好处

通过对浏览历史进行聚类，您可以获得有价值的见解：

* **生产力趋势**：识别您最常使用的工具和资源。
* **学习模式**：查看您正在研究的主题或技术。
* **时间管理**：了解您在线花费最多时间的地方。
* **反思与记录**：将这些数据与来自 Logseq 或 Obsidian 等应用的笔记结合起来，创建您活动的综合记录。

## 总结

分析你的浏览历史并不一定是一个令人生畏的任务。通过上述步骤，你可以提取、清理和分析你的数据，以获得有意义的见解。无论是为了个人成长、提高生产力，还是出于简单的好奇，理解你的在线习惯都可以带来极大的好处。

