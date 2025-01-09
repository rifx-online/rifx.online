---
title: "GPT-4o Python 疯狂制图：即时数据可视化提示"
meta_title: "GPT-4o Python 疯狂制图：即时数据可视化提示"
description: "GPT-4o大幅简化了Python数据可视化代码的创建过程，用户可以通过上传CSV文件并提示模型生成代码，轻松实现数据清理和可视化。示例中使用联合国人口预测数据集，展示了如何生成条形图和分级地图，且无需编码。尽管存在一些局限性，如对Plotly的支持不足，整体上，GPT-4o在自动数据可视化方面表现出色，适合用于分析和讲述数据故事。"
date: 2025-01-09T02:10:44Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*eeLfjLkhvFwBezRcURhNZw.png"
categories: ["Programming", "Data Science", "Technology/Web"]
author: "Rifx.Online"
tags: ["GPT-4o", "CSV", "visualization", "Python", "matplotlib"]
draft: False

---



### 来自联合国人口预测数据集的无代码可视化实操



***GPT\-4o*** 的自动数据可视化生成工具越来越先进。

您可以上传多个 CSV（和 XSLX）文件，并要求 ***GPT\-4o*** 查看它们并为您提供文件中的结构和数据值列表。

然后，您可以提示这个 LLM 创建 Python 代码来清理数据，并提供图表和地图的数据可视化。

这非常有用。让我来给您演示一下它是如何工作的。

## 步骤 1：加载和处理数据

在本次练习中，我们将使用来自联合国经济和社会事务部网站的人口预测数据集（[这里](https://population.un.org/wpp/downloads)）。

您可以点击“概率预测”、“人口百分比”，然后选择“按年龄分列的人口——两性”。从视觉上看，您应该看到以下内容：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*7OwUfoh3tPztVkZp.png)

下载按年龄分列的概率人口预测的 XLSX 工作表

该文件以 xlsx 格式下载，包含多个工作表。我选择了“中位数”工作表，删除了前 15 行描述信息，并将其导出为名为“***pp\_median\_country.csv”*** 的 CSV 文件。

《纽约时报》的一篇近期文章使用了这个数据集，强调了预计将出现“老龄化”人口的国家——这对国家养老金计划和医疗设施等方面造成了更大的压力。

任何数据分析任务的第一步是加载和处理数据。在这里，我们将展示如何提示 GPT-4o 执行此任务。

首先，我们可以点击附件图标并加载要使用的文件：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*JoxT06VOf0vVtjvo.png)

接下来，我们可以提示 GPT-4 准备数据。

**提示给 GPT-4o:** *从* `pp_median_country.csv` *文件中加载数据，并过滤数据以仅包含各个国家的行，并将“65”列转换为浮点数以便正确排序。*

**GPT-4o 的响应：**

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*40rE3GRJe84YjGuk.png)

如果您点击“显示工作”，则结果代码为：

```python
import pandas as pd

## Load the data
data_age = pd.read_csv('pp_median_country.csv')
## Filter data to include only rows for individual countries
data_age_countries = data_age[data_age['Type'] == 'Country/Area']
## Convert the '65' column to float for proper sorting
data_age_countries['65'] = data_age_countries['65'].astype(float)
```
一旦我们的数据框设置正确，我们就可以使用它来创建条形图和地图！

## 第2步：创建条形图

接下来，我们将为2023年和2050年65岁及以上人口比例最高的前10个国家创建条形图。

**提示给GPT\-4o：** *创建并显示一个水平条形图，显示2023年65岁年龄组的前10个国家的比例（使用“Year”列）。使用颜色调色板“YlOrRd”主题进行显示。*

然后在GPT\-4o聊天窗口中显示的条形图：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*X8JABH2L92ShBxFY.png)

点击“**\[\>\_]**”显示生成的Python代码：


```python
import pandas as pd
import matplotlib.pyplot as plt

## Load the dataset
file_path = '/mnt/data/pp_median_country.csv'
data = pd.read_csv(file_path)
## Filter data for the year 2023
data_2023 = data[data['Year'] == 2023]
## Select relevant columns
top_countries_65 = data_2023[['Region, subregion, country or area *', '65+']].copy()
## Sort by '65+' percentage in descending order and select top 10 countries
top_10_65 = top_countries_65.sort_values(by='65+', ascending=False).head(10)
## Rename columns for clarity
top_10_65.columns = ['Country', 'Percentage_65+']
## Sorting data by 'Percentage_65+' in descending order for horizontal bar chart
top_10_65_sorted = top_10_65.sort_values(by='Percentage_65+', ascending=True)
## Plotting horizontal bar chart
plt.figure(figsize=(12, 8))
plt.barh(top_10_65_sorted['Country'], top_10_65_sorted['Percentage_65+'], color="#F46D43")  # Hex color from 'YlOrRd'
plt.title("Top 10 Countries by Percentage for Age Group '65+' in 2023")
plt.xlabel("Percentage (65+)")
plt.ylabel("Country")
plt.tight_layout()
plt.show()
```
GPT\-4o在即时生成图表方面的能力确实有所提升。非常不错

然后我们可以提示GPT\-4o创建相同的图表，但针对2050年。我希望标题更加准确：

**提示给GPT\-4o：** *好的，很棒，现在你能为2050年创建相同的条形图吗？并将标题更改为显示这是针对“65岁及以上”的人。*

结果如下：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*ej0hCc3XZLMzXEWZ.png)

再次，GPT\-4o没有问题。现在如果我点击**\[\>\_]**，代码片段就完整了——并且可以正常工作。

是的，超级酷。但你想要更酷的东西吗？如何进行即时映射呢？

## 第3步：创建分级地图

我们可以用这个超级强大的 LLM 工具做更多的事情。让我们为 2023 年和 2050 年创建分级地图。

在这一步中，GPT-4 不会直接在代码窗口中放置地图——它可以为我们生成一个 HTML 文件形式的图像文件。这个提示需要仔细设计。

**给 GPT-4o 的提示：** *使用 Plotly Express 生成 2023 年全球分级地图，针对 65+ 年龄段。将生成的地图导出为 HTML 文件并提供下载链接。不要尝试使用 GeoPandas、Shapely 或任何其他处理地理数据的库——仅使用 Plotly Express，并确保输出为 HTML 文件。*

**来自 GPT-4o 的响应：**

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*EAtCgLslkgkZwamQ.png)

我们可以在 GPT-4o 的聊天窗口中看到，Python 生成的代码结果被创建为 HTML 文件。

我们可以下载这个自动生成的文件，并在默认浏览器中可视化显示：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*7suWtlnt97UQwcqT.png)

哇，是的，太棒了。从上传的数据集中实时生成无代码的分级地图。

那么为什么不为 2050 年创建一个呢？（点击“生成 2050 年的地图”），或者要求 GPT-4o 使用不同的颜色主题（即 Ciridis）。

**Boom-shaka-laka**：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*NENejjABimw6scc0.png)

就这样，我们有了图表、地图和故事可以讲述。

我不知道你怎么想，但我觉得这些都非常令人惊叹。实时生成的图表和地图，无需编码。完全不需要。

用于分析、解释、测试和可视化数据集——**无价**。

## 总结…

GPT\-4o 大大简化了创建可用 Python 数据可视化代码的过程——同时在聊天窗口中显示可视化结果。无需编写代码。

之前，编码者需要将代码复制/粘贴/保存到 Python 编辑器中，然后从编辑器运行该代码。对于那些使用过 GPT\-4 来完成此任务的人，我相信你们对当编码变得更加复杂时 GPT\-4 生成的错误并不陌生。而且你需要反复迭代以找到可行的解决方案。

GPT\-4o 通过在实际显示结果之前测试/运行代码，消除了这种令人沮丧的情况。它在展示解决方案之前会***自行***迭代这个过程。

这并不是说 GPT\-4o 是完美的——***它并不是***。我遇到了一些问题，首先是它失去了位置（“你能再加载一次那个文件吗？我似乎把它丢失了……”），然后是它陷入了循环（试图正确获取文件路径时）。

此外，目前它仅与 matplotlib 兼容（不支持 Plotly），这对像我这样的 Plotly 粉丝来说有点遗憾（没有 Plotly 地图，真让人失望）。

总体而言，我强烈推荐 GPT\-4o 进行自动数据可视化生成。

这是一个很好的工具，可以测试你的数据集，看看你能提出什么样的故事。

如果这种类型的故事正合你的口味，并且你想支持我作为作家，订阅我的 [**Substack**](https://johnloewen.substack.com/)**。**

在 Substack 上，我发布每两周一次的通讯和你在我创建内容的其他平台上找不到的文章。

