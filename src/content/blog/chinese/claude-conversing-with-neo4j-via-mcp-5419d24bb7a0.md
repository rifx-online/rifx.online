---
title: "Claude与Neo4j的动态数据交互与模型上下文协议应用"
meta_title: "Claude与Neo4j的动态数据交互与模型上下文协议应用"
description: "Anthropic发布了模型上下文协议（MCP），使得大型语言模型（LLM）如Claude能够与外部数据源如Neo4j数据库进行交互。通过MCP，LLM可以执行实时查询并获取额外信息，以增强对话体验。此协议支持多种传输方式，确保用户数据的安全性和隐私。Neo4j MCP服务器已实现，允许LLM使用Cypher查询数据库，展示了如何通过MCP提升语言模型的功能和交互性。"
date: 2024-12-26T04:30:18Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*UnC-f-LmG5RB-wk3G16TgQ.png"
categories: ["Natural Language Processing", "Programming", "Technology/WebAPI"]
author: "Rifx.Online"
tags: ["MCP", "LLMs", "Neo4j", "consent", "privacy"]
draft: False

---



### 赋予 LLM 知识图谱的能力，使用 Anthropic 的模型上下文协议

上周，Anthropic 发布了一个新的 [模型上下文协议](https://www.anthropic.com/news/model-context-protocol) (MCP)，使得像 Claude 这样的 LLM 能够与外部数据源进行通信。

该协议允许本地应用程序，如 Claude.ai、Zed、Replit 等，在与用户的对话中访问文件系统、API 和数据库，以获取额外的信息。这可以用于回答问题、获取更多信息，或使用代码生成实时生成图表和可视化内容。

以下是您对话中可能出现的样子。



如果您想自己测试，可以将此配置添加到您的 `claude_desktop_config.json` 中，并重启服务器以进行跟随。这指向一个只读的演示数据库。

```python
{"mcpServers": {
      "movies-neo4j": {
        "command": "uvx",
        "args": ["mcp-neo4j-cypher", 
                 "--db-url", "neo4j+s://demo.neo4jlabs.com", 
                 "--user", "recommendations", 
                 "--password", "recommendations"]
      }   
    }
 }
```
他们不仅发布了协议，还开源了 [多个连接器（服务器）](https://github.com/modelcontextprotocol/servers)，并邀请社区添加更多内容。

## Neo4j MCP 服务器

我们立即开始了 [实现 Neo4j MCP 服务器](https://github.com/neo4j-contrib/mcp-neo4j/tree/main/servers/mcp-neo4j-cypher) 的工作，以了解它的样子，我们还将其 [发布在 PyPI 上](https://pypi.org/project/mcp-neo4j-cypher/)，这样您就可以直接运行它。

它也包含在官方的 [MCP 服务器库](https://github.com/modelcontextprotocol/servers?tab=readme-ov-file#%EF%B8%8F-official-integrations) 中。

## 互动示例

这是一个简单的示例，展示了如何使用 MCP 从 LLM 查询 Neo4j 数据库。

想象一下，你有一个类似 IMDB 的 Neo4j 数据库，其中包含电影、演员、导演、类型和电影评分。

我在 Claude.ai 桌面配置中配置了公共可访问的数据库并重新启动了客户端。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*_uCb-D3O0Fa5CfdCZybrAA.png)

现在我想知道哪些电影是由昆汀·塔伦蒂诺执导的，所以我只需问 Claude。

> *检查我的电影数据库，找出由昆汀·塔伦蒂诺执导的电影。*

Claude 会弹出一个权限对话框，询问我是否要允许对 Neo4j 数据库进行查询（一次或整个聊天），如果我接受，它将运行查询并以良好的格式返回结果。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*nZ_94geL38hPyf8ODH0lig.png)

然后它回答：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*GIHD854jB_Lo3NnION7eLA.png)

*我将帮助你查询数据库，找出由昆汀·塔伦蒂诺执导的电影。*

*查看来自 movies-neo4j（本地）的 read-neo4j-cypher 结果*


```python
{
  `query`: `
MATCH (d:Person {name: 'Quentin Tarantino'})-[:DIRECTED]->(m:Movie)
RETURN m.title, m.year
ORDER BY m.year
`
}
```

```python
[{'m.title': 'Reservoir Dogs', 'm.year': 1992}, {'m.title': 'Pulp Fiction', 'm.year': 1994}, {'m.title': 'Four Rooms', 'm.year': 1995}, {'m.title': 'Jackie Brown', 'm.year': 1997}, {'m.title': 'Kill Bill: Vol. 1', 'm.year': 2003}, {'m.title': 'Kill Bill: Vol. 2', 'm.year': 2004}, {'m.title': 'Sin City', 'm.year': 2005}, {'m.title': 'Grindhouse', 'm.year': 2007}, {'m.title': 'Death Proof', 'm.year': 2007}, {'m.title': 'Inglourious Basterds', 'm.year': 2009}, {'m.title': 'Django Unchained', 'm.year': 2012}, {'m.title': 'The Hateful Eight', 'm.year': 2015}]
```
*以下是昆汀·塔伦蒂诺执导的电影，按时间顺序排列：*

1. *《落水狗》（1992）*
2. *《低俗小说》（1994）*
3. *《四个房间》（1995）*
4. *《杰基布朗》（1997）*
5. *《杀死比尔：第1卷》（2003）*
6. *《杀死比尔：第2卷》（2004）*
7. *《罪恶之城》（2005）……*

*如果你想了解这些电影的更多细节，或者想探索塔伦蒂诺作品的其他方面，请告诉我！*


> *《杀死比尔》的演员们还参演了哪些其他受欢迎的电影？*

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*P-QK_c6ayzraCmPsKK-IrQ.png)

*我将查询其他由《杀死比尔：第1卷》和《杀死比尔：第2卷》的演员参演的著名电影。*

*查看来自 movies-neo4j（本地）的 read-neo4j-cypher 结果*


```python
{
  `query`: `
MATCH (kb:Movie)
WHERE kb.title IN ['Kill Bill: Vol. 1', 'Kill Bill: Vol. 2']
MATCH (actor:Person)-[:ACTED_IN]->(kb)
MATCH (actor)-[:ACTED_IN]->(other:Movie)
WHERE other.title <> 'Kill Bill: Vol. 1'
AND other.title <> 'Kill Bill: Vol. 2'
RETURN DISTINCT actor.name, collect(DISTINCT other.title) as other_movies
ORDER BY actor.name
`
}
[{'actor.name': 'Daryl Hannah', 'other_movies': ['Clan of the Cave Bear, The', 'Tie That Binds, The', 'Addams Family Reunion', 'Summer Lovers', 'Legal Eagles', 'Reckless', 'Pope of Greenwich Village, The', 'Splash', 'Roxanne', 'Gingerbread Man, The', 'My Favorite Martian', 'Steel Magnolias', 'Walk to Remember, A']}, {'actor.name': 'Lucy Liu', 'other_movies': ['Afro Samurai: Resurrection', 'Lucky Number Slevin', 'Mulan II', 'Cypher', "Charlie's Angels: Full Throttle", 'Ballistic: Ecks vs. Sever', "Charlie's Angels", 'Shanghai Noon']}, {'actor.name': 'Michael Parks', 'other_movies': ['Tusk', 'Death Wish 5: The Face of Death']}, {'actor.name': 'Uma Thurman', 'other_movies': ['Misérables, Les', 'My Super Ex-Girlfriend', 'Even Cowgirls Get the Blues', 'Truth About Cats & Dogs, The', 'Batman & Robin', 'Gattaca', 'Avengers, The', 'Month by the Lake, A', 'Jennifer 8', 'Mad Dog and Glory', 'Johnny Be Good', 'Henry & June', 'Be Cool', 'Producers, The', 'Tape', 'Paycheck']}, {'actor.name': 'Vivica A. Fox', 'other_movies': ['Set It Off', 'Soul Food', 'Boat Trip', 'Juwanna Mann', 'Why Do Fools Fall In Love?']}]
```
*让我为你讲解一些主要演员的著名电影：*

*乌玛·瑟曼的其他主要电影包括： — 《复仇者联盟》 — 《伽特卡》 — 《蝙蝠侠与罗宾》 — 《悲惨世界》 — 《制片人》 — 《别理我》*

*露西·刘参演的电影： — 《霹雳娇娃》和《霹雳娇娃：全速进攻》 — 《上海正午》 — 《幸运数字斯莱文》 — 《花木兰 II》*

*迈克尔·帕克斯参演的电影： — 《象》 — 《死亡愿望 5：死亡之面》*

*你想了解这些演员或具体电影的更多细节吗？我可以查询额外的信息，比如上映年份、导演或其他演员。*


> *告诉我更多关于《象》的信息；值得一看吗？用数据库模式来查看评分。*

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*B6D02g0WvSfUVsn7yV3yBA.png)

现在，它使用集成中其他工具（get-neo4j-schema）来获取数据库模式，这对于确定评分存储的位置和方式非常重要。它返回节点类型、属性、是否被索引以及与其他节点的关系。

*让我先检查数据库模式，看看关于电影的评分信息有哪些。*

*查看来自 movies-neo4j（本地）的 get-neo4j-schema 结果*


```python
{}
[{'label': 'Movie', 'attributes': {'budget': 'INTEGER', 'movieId': 'STRING unique indexed', 'tmdbId': 'STRING unique indexed', 'plotEmbedding': 'LIST', 'imdbVotes': 'INTEGER', 'runtime': 'INTEGER', 'posterEmbedding': 'LIST', 'countries': 'LIST', 'imdbId': 'STRING indexed', 'url': 'STRING', 'plot': 'STRING indexed', 'released': 'STRING indexed', 'languages': 'LIST', 'imdbRating': 'FLOAT indexed', 'title': 'STRING indexed', 'poster': 'STRING', 'year': 'INTEGER indexed', 'revenue': 'INTEGER'}, 'relationships': {'IN_GENRE': 'Genre'}}, {'label': 'Genre', 'attributes': {'name': 'STRING unique indexed'}, 'relationships': {}}, {'label': 'User', 'attributes': {'name': 'STRING indexed', 'userId': 'STRING unique indexed'}, 'relationships': {'RATED': 'Movie'}}, {'label': 'Actor', 'attributes': {'born': 'DATE', 'bornIn': 'STRING', 'tmdbId': 'STRING', 'bio': 'STRING', 'died': 'DATE', 'name': 'STRING', 'poster': 'STRING', 'imdbId': 'STRING', 'url': 'STRING'}, 'relationships': {'ACTED_IN': 'Movie', 'DIRECTED': 'Movie'}}, {'label': 'Director', 'attributes': {'born': 'DATE', 'bornIn': 'STRING', 'tmdbId': 'STRING', 'bio': 'STRING', 'died': 'DATE', 'name': 'STRING', 'poster': 'STRING', 'imdbId': 'STRING', 'url': 'STRING'}, 'relationships': {'ACTED_IN': 'Movie', 'DIRECTED': 'Movie'}}, {'label': 'Person', 'attributes': {'born': 'DATE', 'bornIn': 'STRING', 'tmdbId': 'STRING unique indexed', 'bio': 'STRING indexed', 'died': 'DATE', 'name': 'STRING indexed', 'poster': 'STRING', 'imdbId': 'STRING', 'url': 'STRING'}, 'relationships': {'ACTED_IN': 'Movie', 'DIRECTED': 'Movie'}}]
```
*现在，让我查询关于《象》的具体信息，包括其评分、情节和类型。*

*查看来自 movies-neo4j（本地）的 read-neo4j-cypher 结果*


```python
{
  `query`: `
MATCH (m:Movie {title: 'Tusk'})
MATCH (m)-[:IN_GENRE]->(g:Genre)
MATCH (d:Person)-[:DIRECTED]->(m)
MATCH (a:Person)-[:ACTED_IN]->(m)
RETURN m.title, m.year, m.imdbRating, m.plot, collect(DISTINCT g.name) as genres,
       collect(DISTINCT d.name) as directors, collect(DISTINCT a.name) as actors
`
}
[{'m.title': 'Tusk', 'm.year': 2014, 'm.imdbRating': 5.4, 'm.plot': '当播客主持人华莱士·布赖顿在曼尼托巴州与名为霍华德·豪的神秘海员采访时失踪，他的好朋友泰迪和女友艾莉森与一位前警察联手寻找他。', 'genres': ['喜剧', '剧情', '恐怖'], 'directors': ['凯文·史密斯'], 'actors': ['迈克尔·帕克斯', '哈利·乔·奥斯蒙特', '基因西斯·罗德里格斯', '贾斯廷·朗']}]
```
*根据数据库信息，这里是我能告诉你关于《象》的内容：*

*1\. 这是一部由凯文·史密斯执导的恐怖喜剧剧情片（因《追随者》、《商店员》、《追逐艾米》而闻名），于2014年9月上映。*

*2\. 情节讲述了一名播客主持人华莱士·布赖顿在曼尼托巴州采访一名神秘海员霍华德·豪时失踪。他的女友和好朋友联手与一位前警察一起寻找他。*

*3\. 这部电影的 IMDb 评分相对较低，为 5.4/10，表明其反响褒贬不一。*

….

*低的 IMDb 评分表明这部电影并不适合所有人，但在喜欢独特恐怖电影的粉丝中，它已经发展出了一定的邪典追随者。*

*你想让我在数据库中找到类似的电影，可能会更合你口味吗？*


> *嗯，好吧，给我从我们从《杀死比尔》演员那里得到的列表中最佳电影，并提供一些细节。*

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*-42ylI4L8kOLzpWyvjglSw.png)

*让我在这些电影及其评分中搜索，找出评分最高的那部。*


```python
{
  `query`: `
MATCH (a:Person)-[:ACTED_IN]->(kb:Movie)
WHERE kb.title IN ['Kill Bill: Vol. 1', 'Kill Bill: Vol. 2']
MATCH (a)-[:ACTED_IN]->(m:Movie)
WHERE m.title <> 'Kill Bill: Vol. 1' AND m.title <> 'Kill Bill: Vol. 2'
MATCH (m)-[:IN_GENRE]->(g:Genre)
MATCH (d:Person)-[:DIRECTED]->(m)
RETURN DISTINCT m.title, m.year, m.imdbRating, m.plot,
       collect(DISTINCT g.name) as genres,
       collect(DISTINCT d.name) as directors,
       collect(DISTINCT a.name) as actors
ORDER BY m.imdbRating DESC
LIMIT 1
`
}
[{'m.title': 'Gattaca', 'm.year': 1997, 'm.imdbRating': 7.8, 'm.plot': '一个基因劣势的人假冒一个优秀的身份，以追求他一生的太空旅行梦想。', 'genres': ['惊悚', '科幻', '剧情'], 'directors': ['安德鲁·尼科尔'], 'actors': ['乌玛·瑟曼']}]
```
*在我们早前找到的电影中，《伽特卡》（1997）以 7.8/10 的 IMDb 评分脱颖而出。让我获取这部电影的更多详细信息。*

```python
{
  `query`: `
MATCH (m:Movie {title: 'Gattaca'})
MATCH (p:Person)-[:ACTED_IN]->(m)
RETURN m.runtime, collect(p.name) as cast
`
}
[{'m.runtime': 106, 'cast': ['Xander Berkeley', 'Gore Vidal', 'Uma Thurman', 'Ethan Hawke']}]
```
*以下是《Gattaca》的独特之处：*

*1\. 剧情：这是一个关于一个天生“劣势”的男人假冒一个基因优越者身份以追求太空旅行梦想的科幻剧。故事探讨了基因歧视、决心和人类潜力等主题。*

…..

*如果你喜欢《Gattaca》，我可以帮你在数据库中找到类似的电影吗？*


> *《Gattaca》的其他平均、最低、最高用户评分是多少？*

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*tMPo-q3SQ_HL4UffjPs6RA.png)

*我会查找《Gattaca》的用户评分统计数据。*


```python
{
  `query`: `
MATCH (m:Movie {title: 'Gattaca'})
MATCH (u:User)-[r:RATED]->(m)
RETURN
  m.title,
  count(r) as number_of_ratings,
  round(avg(r.rating)*10)/10 as avg_rating,
  min(r.rating) as min_rating,
  max(r.rating) as max_rating
`
}
[{'m.title': 'Gattaca', 'number_of_ratings': 84, 'avg_rating': 3.7, 'min_rating': 1.0, 'max_rating': 5.0}]
```
*我会查找《Gattaca》的用户评分统计数据。*

*以下是《Gattaca》的用户评分统计数据：- 平均用户评分：3\.68/5- 最低评分：1\.0- 最高评分：5\.0- 评分人数：84人*

*这个3\.68/5的平均评分（约合7\.4/10）与我们之前看到的IMDb评分7\.8/10相当吻合。该电影获得了所有可能的评分范围（1–5），这表明尽管大多数人对其评分很高，但也有一些不同的看法。数据库中有84条评分，这为我们提供了一个不错的样本量。*


> *好的，我看了《Gattaca》，非常喜欢，还有什么类似的电影吗？你能为我创建一个ID为mesirii的用户，并存储我8/10的评分（将其标准化以适应该电影的其他评分）吗？*

我们准备进行写入语句，并为写操作工具进行另一次权限检查。这是Claude第一次在其Cypher语句中犯了一个小语法错误，并立即进行了修正。由于我的数据库是只读的，它实际上无法写入，但它为我提供了可以接下来观看的其他电影。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*cRTf53ROUR4SFuHHkMwpBQ.png)

*我会先帮助你添加评分，将8/10标准化为4/5，以与数据库的评分标准保持一致。*

*我为创建用户评分的错误表示歉意——看来我没有权限在数据库中创建新用户。不过，我仍然可以帮助你找到与《Gattaca》相似的电影！*

*从movies-neo4j（本地）查看write-neo4j-cypher的结果*


```python
{
  `query`: `
MERGE (u:User {userId: 'mesirii', name: 'mesirii'})
MERGE (m:Movie {title: 'Gattaca'})
CREATE (u)-[:RATED {rating: 4.0}]->(m)
RETURN u.name, m.title
`
}
```
*我为这个错误表示歉意——看来我没有权限创建新的用户记录。让我专注于寻找与《Gattaca》相似的电影。我将搜索共享相似类型、主题和评分的电影：*

*从movies-neo4j（本地）查看read-neo4j-cypher的结果*


```python
{
  `query`: `
MATCH (m:Movie)-[:IN_GENRE]->(g:Genre)
WHERE g.name IN ['Sci-Fi', 'Drama']
AND m.title <> 'Gattaca'
AND m.imdbRating >= 7.0
WITH m, collect(DISTINCT g.name) as genres
WHERE size(genres) >= 2
RETURN m.title, m.year, m.imdbRating, m.plot, genres
ORDER BY m.imdbRating DESC
LIMIT 5
`
}
[{'m.title': 'Inception', 'm.year': 2010, 'm.imdbRating': 8.8, 'm.plot': 'A thief, who steals corporate secrets through use of dream-sharing technology, is given the inverse task of planting an idea into the mind of a CEO.', 'genres': ['Drama', 'Sci-Fi']}, {'m.title': 'Black Mirror', 'm.year': None, 'm.imdbRating': 8.8, 'm.plot': 'A television anthology series that shows the dark side of life and technology.', 'genres': ['Drama', 'Sci-Fi']}, {'m.title': "Dr. Horrible's Sing-Along Blog", 'm.year': 2008, 'm.imdbRating': 8.7, 'm.plot': 'An aspiring supervillain must balance his career and his pursuit of a beautiful do-gooder.', 'genres': ['Drama', 'Sci-Fi']}, {'m.title': 'Battlestar Galactica', 'm.year': 2003, 'm.imdbRating': 8.7, 'm.plot': 'A re-imagining of the original series in which a rag-tag fugitive fleet of the last remnants of mankind flees pursuing robots while simultaneously searching for their true home, Earth.', 'genres': ['Drama', 'Sci-Fi']}, {'m.title': 'Prestige, The', 'm.year': 2006, 'm.imdbRating': 8.5, 'm.plot': 'Two stage magicians engage in competitive one-upmanship in an attempt to create the ultimate stage illusion.', 'genres': ['Sci-Fi', 'Drama']}]
```
*让我搜索一些主题、类型和评分相似的电影：*


```python
{
  `query`: `
MATCH (m:Movie {title: 'Gattaca'})
MATCH (m)-[:IN_GENRE]->(g:Genre)
MATCH (other:Movie)-[:IN_GENRE]->(g)
WHERE other.title <> 'Gattaca' 
  AND other.imdbRating >= 7.0
  AND exists(other.plot)
RETURN DISTINCT other.title, other.imdbRating, other.plot, 
  collect(DISTINCT g.name) as genres
ORDER BY other.imdbRating DESC
LIMIT 5
`
}

Error: {code: Neo.ClientError.Statement.SyntaxError} {message: The property existence syntax `... exists(variable.property)` is no longer supported. Please use `variable.property IS NOT NULL` instead. (line 7, column 7 (offset: 174))
"  AND exists(other.plot)"
       ^}
```
*我为语法错误表示歉意。让我纠正查询：*

*让我将搜索重点更具体地放在与《Gattaca》相似的科幻和惊悚元素上：*


```python
{
  `query`: `
MATCH (m:Movie {title: 'Gattaca'})
MATCH (m)-[:IN_GENRE]->(g:Genre)
MATCH (other:Movie)-[:IN_GENRE]->(g)
WHERE other.title <> 'Gattaca' 
  AND other.imdbRating >= 7.0
  AND other.plot IS NOT NULL
RETURN DISTINCT other.title, other.imdbRating, other.plot, 
  collect(DISTINCT g.name) as genres
ORDER BY other.imdbRating DESC
LIMIT 5
`
}

```
*基于你对《Gattaca》的喜爱，这里有一些高度评价的推荐电影，它们分享相似的主题或元素：*

*1\. 《黑镜》（8\.8/10）——一部引人深思的科幻选集系列，像《Gattaca》一样探讨技术对社会的黑暗影响——每一集讲述一个关于技术如何影响人类社会的不同故事*

….

*这些电影都与《Gattaca》在科幻方面的深思熟虑的处理方式相似，更关注人类戏剧和伦理问题，而不是动作。它们都探讨了身份、人性以及技术/科学对社会的影响，这些都是《Gattaca》的核心主题。*

*你想要更多关于这些推荐的详细信息吗？*

…

这是我第一次与MCP和Neo4j连接器的体验。相当酷吧？这是一次很棒的经历，我可以看到这如何用来增强与像Claude这样的LLM的对话体验。

## 模型上下文协议

这在后台是如何工作的？

在 modelcontextprotocol.io 网站上有关于 MCP 的全面文档，但这里是一个简要概述：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*fbiVQnaxHWBKRpdnoXJPVw.png)

MCP 遵循 [客户端-服务器架构](https://modelcontextprotocol.io/docs/concepts/architecture)，其中：

* **主机** 是 LLM 应用程序（如 Claude Desktop 或 IDE） ，它们发起连接并使用客户端。
* **客户端** 通过传输协议与主机应用程序内的服务器保持 1:1 连接。
* **服务器** 向客户端提供上下文、工具和提示。

协议层处理消息框架、请求/响应链接、通知和高级通信模式。

MCP 允许使用不同的传输协议。目前支持的协议有 HTTPS（使用服务器推送事件 (SSE) 进行服务器到客户端的消息传递和 HTTP POST 进行客户端到服务器的消息传递）和 STDIO（标准输入/输出）用于本地服务器，其中服务器由客户端启动并可以通过 stdin/stdout 进行通信。

所有传输消息交换基于 [规范](https://spec.modelcontextprotocol.io/specification/) 使用 JSON-RPC 2.0，因此它鼓励我们在其他语言或传输层中实现该协议。

基本消息类型包括：

* **资源**：供用户或 AI 模型使用的上下文和数据
* **提示**：供用户使用的模板消息和工作流
* **工具**：供 AI 模型执行的功能
* **采样**：服务器发起的代理行为和递归 LLM 交互

其他相关方面包括配置、进度跟踪、取消、错误报告和日志记录。

协议规范还考虑了安全性和信任，这在允许 LLM 访问外部数据源时非常重要。由于对数据库和文件系统的写入访问以及本地运行的服务器，以及恶意代码执行的潜在风险，安全性应当是高优先级。基础模型已知容易受到对抗性攻击、提示注入和幻觉的影响。

LLM 用户通常是非技术性的，可能不了解允许 AI 模型访问其数据所涉及的风险。

这就是为什么该协议采用以下关键原则：

* 用户同意和控制：用户需要批准服务器和数据访问，并始终能够识别哪些数据被发送和接收。客户端实现需要有清晰的用户界面来处理这些授权。
* 用户数据的数据隐私访问控制，主机和服务器不得将数据外泄到其他服务。
* 工具安全性用于防止恶意代码执行，并确保工具安全运行且没有副作用。工具需要以用户明确理解每个工具所做的方式进行结构化。
* LLM 采样控制：该协议限制服务器对用户提示的访问。用户可以控制采样以及发送到服务器的数据和提示。

## Neo4j MCP 服务器实现

在我们实现 Neo4j MCP 服务器时，我们需要实现三个组件：

1. 连接到 Neo4j 数据库并执行 Cypher 查询
2. 注册和列出可用工具
3. 处理工具执行请求

### 连接和 Cypher 执行与 Neo4j 数据库

在我们的案例中，我们编写了一个小的 `neo4jDatabase` 类，该类持有 Neo4j Python 驱动程序以连接到数据库、执行语句并将结果呈现为 JSON 文本块。

```python
def _execute_query(self, query: str, params: dict[str, Any] | None = None) -> list[dict[str, Any]]:
    """Execute a Cypher query and return results as a list of dictionaries"""
    logger.debug(f"Executing query: {query}")
    try:
        result = self.driver.execute_query(query, params)
        if is_write_query(query):
            counters = vars(result.summary.counters)
            logger.debug(f"Write query affected {counters}")
            return [counters]
        else:
            results = [dict(r) for r in result.records]
            logger.debug(f"Read query returned {len(results)} rows")
            return results
    except Exception as e:
        logger.error(f"Database error executing query: {e}\n{query}")
        raise
```

### 注册可用于与数据库交互的工具

这些工具稍后将可供 LLM 选择：

* `get-neo4j-schema`
* `read-neo4j-cypher`
* `write-neo4j-cypher`

每个工具都有描述和可能的参数（在我们的案例中，仅有一个强制性的“query”参数用于 Cypher 工具）。我们可以想象一些额外的通用工具，适用于图数据库，例如获取节点的聚合邻域、查找最短路径或运行图算法。

以下是 write\-neo4j\-cypher 工具的定义：

```python
@server.list_tools()
    async def handle_list_tools() -> list[types.Tool]:
        """List available tools"""
        return [
            types.Tool(
                name="write-neo4j-cypher",
                description="Execute a write Cypher query on the neo4j database",
                inputSchema={
                    "type": "object",
                    "properties": {
                        "query": {"type": "string", "description": "Cypher write query to execute"},
                    },
                    "required": ["query"],
                },
            ),
##            ...
        ]
```

### 注册工具的执行

当用户请求Claude查询数据库时，Claude会询问用户的许可，如果本地服务器尚未运行，则会启动服务器，并通过传输协议向MCP服务器发送带有工具名称和参数的请求。

在工具实现中，我们只使用这个类来执行语句。我们进行了一小部分检查，只允许在读取工具中使用读取语句，反之亦然（写入工具仅返回更新统计信息）。

```python
@server.call_tool()
    async def handle_call_tool(
        name: str, arguments: dict[str, Any] | None
    ) -> list[types.TextContent | types.ImageContent | types.EmbeddedResource]:
        """Handle tool execution requests"""
        try:
            if name == "get-neo4j-schema":
                results = db._execute_query(
                    """
CALL apoc.meta.data() yield label, property, type, other, unique, index, elementType
WHERE elementType = 'node'
RETURN label,
    collect(case when type <> 'RELATIONSHIP' then [property, type] end) as attributes,
    collect(case when type = 'RELATIONSHIP' then [property, head(other)] end) as relationships
                    """
                )
                return [types.TextContent(type="text", text=str(results))]
```
所以你可以看到，为你选择的工具实现MCP服务器是相当简单的。

## 从对话到代码

将MCP工具结果与Claude的代码生成和执行能力相结合，使交互提升到了一个新的水平。

在交互中，令人印象深刻的一点是，之前工具调用的数据结果是对话历史的一部分，因此LLM利用它们来塑造查询和输入参数，以便进行进一步的服务器交互。

但这不仅仅是这样，代码生成能力使您能够轻松地将结果呈现为图表、网络，或仅计算导出数据。它使用React或其他库结合图表库生成JavaScript工件，您可以直接渲染和可视化。

以下是每部电影或每个评分生成热图的两个示例：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*LItlnYmWNjC3KGYT3E2Elw.png)


> *实际上我想要的是评分和年份的方形热图。*

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*6a1W5KdhOK3dcw69n_vrNA.png)

最后是我们对话的网络可视化：


> *生成到目前为止对话的图形可视化，从昆汀·塔伦蒂诺的电影开始，到推荐，再到最终建议。请确保渲染具有高对比度。*

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*6WQO0D2OxLgapo9UYhv3ZA.png)

## 结论

我们希望您能够测试 Neo4j MCP 服务器的实现并分享您的体验，给我们在 [GitHub](https://github.com/neo4j-contrib/mcp-neo4j) 上提供反馈，也许您还可以撰写您自己的文章。

祝您实验愉快！

