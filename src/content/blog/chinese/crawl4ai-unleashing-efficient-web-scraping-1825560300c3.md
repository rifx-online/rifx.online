---
title: "Crawl4AI：释放高效网络抓取功能"
meta_title: "Crawl4AI：释放高效网络抓取功能"
description: "Crawl4AI是一个开源的Python库，旨在简化网页爬取和数据提取，特别适合用于训练大型语言模型。其主要特性包括异步架构、支持多种输出格式和高级提取技术。Crawl4AI适用于市场研究、内容聚合、学术研究等多种应用场景，能够高效收集和处理结构化数据，提升人工智能应用的性能。该工具为开发者和数据分析师提供了强大的支持，以满足现代数据收集的需求。"
date: 2025-01-09T01:50:56Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*UAxU3ti2MawjOOONp-skCw.jpeg"
categories: ["Programming", "Technology/Web", "Data Science"]
author: "Rifx.Online"
tags: ["Crawl4AI", "Python", "web", "crawling", "data"]
draft: False

---



在当今数据驱动的世界中，高效收集和处理信息的能力对于人工智能（AI）应用的成功至关重要。随着人工智能的不断发展，对结构化数据以训练大型语言模型（LLMs）的需求前所未有地高。

引入 **Crawl4AI**，一个创新的开源 Python 库，旨在简化网页爬取和数据提取，使其成为开发者和人工智能爱好者不可或缺的工具。本文将探讨 Crawl4AI 的功能、特性和使用案例，强调它如何使用户能够利用网络的力量进行人工智能训练。

## 什么是 Crawl4AI？

**Crawl4AI** 是一个开源的网页爬虫和抓取框架，旨在自动化从网站收集数据的过程。它允许用户同时抓取多个 URL，成为需要大规模数据收集的项目的理想选择。Crawl4AI 具备为 AI 应用量身定制的功能，简化了将原始网页数据转换为结构化格式的过程。



## Crawl4AI的关键特性：

**🆓 开源**其开源特性确保用户可以完全访问代码，允许进行定制和扩展。此外，强大的社区支持和丰富的文档使新用户更容易入门。

🚀 **闪电般的性能**Crawl4AI的一个突出特点是其卓越的速度。该框架经过优化，可以超越许多付费服务，使用户能够快速高效地提取数据。

🌐 **异步架构**支持同时爬取多个URL，显著减少大规模数据收集所需的时间。

🤖 **LLM友好的输出格式**支持多种输出格式，包括JSON、清理后的HTML和Markdown，确保与AI模型的轻松集成。

**🎨 提取并返回所有媒体标签**使用Crawl4AI，用户可以提取各种媒体类型，包括图像、音频和视频。此功能对依赖多媒体内容的应用程序特别有益，例如社交媒体分析或内容创作。

📜 **JavaScript执行**允许抓取动态内容，确保全面的数据收集，其他抓取工具可能会遗漏。

📚 **多种分块策略**Crawl4AI支持多种分块策略，如基于主题、正则表达式和基于句子的分块。这种灵活性使用户能够根据特定要求定制数据提取，确保在多种应用中获得最佳结果。

🧠 **高级提取技术**利用XPath和正则表达式等强大方法，使用户能够精确定位所需的数据。

📚 **元数据提取**在主内容旁收集必要的元数据，丰富AI训练的数据集。

🕵️ **自定义钩子和用户代理支持**用户可以定义自定义钩子用于身份验证和头信息，并可以自定义HTTP请求的用户代理，从而提供更大的爬取过程控制。

🔄 **错误处理和重试机制**集成了强大的错误处理和重试策略，确保在遇到网络问题或页面加载失败时数据的完整性。

🔒 **速率限制和节流**帮助避免对目标服务器造成过大压力，并确保遵守网络抓取最佳实践。

## 开始使用 Crawl4AI：

Crawl4AI 不仅仅是一个网络爬虫工具；它是一个全面的解决方案，专为满足开发人员和数据分析师的需求而设计，提供先进的异步网络爬取和数据提取功能。

现在，我们将深入探讨 Crawl4AI 的一些核心功能和特性，并展示代码示例，以说明如何实现这些功能以优化网络数据提取。

### 💻 安装

有几种选项可以安装 Crawl4AI — 您可以将其作为 Python 包安装，使用 Docker 设置，或者在本地运行。以下是 Python 包安装的步骤：

```python
## To install all available features
!pip3 install "crawl4ai[all]"

## After installation, download the necessary models for better performance:
!crawl4ai-download-models

## Lastly, install Playwright dependencies
!playwright install 
```

> 有关不同的安装方法，请参见 [这里](https://crawl4ai.com/mkdocs/installation/)

### ⚙️ 基本用法

要开始使用 **Crawl4AI**，我们首先需要创建一个 `AsyncWebCrawler` 的实例。这是核心组件，它将通过使用异步上下文管理器有效地管理爬虫生命周期。默认情况下，它会缓存爬取结果，这意味着对同一 URL 的后续爬取将会更快！！

```python
from crawl4ai import AsyncWebCrawler
from crawl4ai.chunking_strategy import RegexChunking

async with AsyncWebCrawler(verbose=True) as crawler:
    result = await crawler.arun(url="https://en.wikipedia.org/wiki/3_Idiots", bypass_cache=False) 
    print(f"Extracted content: {result.extracted_content}")
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*T0ojqWqmYIPucY6BZwiZ0g.png)

在上面的代码片段中：

* `url`: 指定要爬取的网页。
* `bypass_cache`: 是否强制进行新鲜爬取

提取的内容可以以多种格式提供，如 `markdown` 和 `cleaned_html`，根据您的需求提供灵活性。

```python
print(result.markdown)
print(result.cleaned_html)
```

### 📸 截取屏幕截图

它还允许您捕获您正在爬取的页面的屏幕截图。


```python
import base64
from crawl4ai import AsyncWebCrawler

async with AsyncWebCrawler(verbose=True) as crawler:
    result = await crawler.arun(url="https://www.cricbuzz.com/", screenshot=True)
    with open("cricbuzz_screenshot.png", "wb") as f:
        f.write(base64.b64decode(result.screenshot))
    print("Screenshot saved to 'screenshot.png'!")
```

### 🔀 添加分块策略

现在我们将根据给定的正则表达式模式来拆分文本。

* `word_count_threshold`: 设置有意义内容块的最小字数。
* `chunking_strategy`: 定义用于拆分文本的分块策略。

```python
from crawl4ai import AsyncWebCrawler
from crawl4ai.chunking_strategy import RegexChunking

async with AsyncWebCrawler(verbose=True) as crawler:
    result = await crawler.arun(url="https://en.wikipedia.org/wiki/3_Idiots", chunking_strategy=RegexChunking(patterns=["\n\n"]), word_count_threshold=10) 
    print(f"Extracted content: {result.extracted_content}")
```

### 🧠 添加高级提取策略

现在，让我们在爬虫中添加一个智能提取策略 — `JsonCssExtractionStrategy`。JsonCssExtractionStrategy通过为页面上重复元素定义基础选择器的模式，实现精确、结构化的数据提取。模式中的每个字段都有自己的选择器，允许提取嵌套结构或列表。这种方法非常适合将网页内容（如产品列表、文章或搜索结果）转换为干净的JSON格式，提供灵活性和准确性以进行网页数据提取。

```python
from crawl4ai import AsyncWebCrawler
from crawl4ai.extraction_strategy import JsonCssExtractionStrategy
import json
import nest_asyncio
nest_asyncio.apply()


async def extract_news_teasers():
    schema = {
        "name": "News Teaser Extractor",
        "baseSelector": ".wide-tease-item__wrapper",
        "fields": [
            {
                "name": "category",
                "selector": ".unibrow span[data-testid='unibrow-text']",
                "type": "text",
            },
            {
                "name": "headline",
                "selector": ".wide-tease-item__headline",
                "type": "text",
            },
            {
                "name": "summary",
                "selector": ".wide-tease-item__description",
                "type": "text",
            },
            {
                "name": "time",
                "selector": "[data-testid='wide-tease-date']",
                "type": "text",
            },
            {
                "name": "image",
                "type": "nested",
                "selector": "picture.teasePicture img",
                "fields": [
                    {"name": "src", "type": "attribute", "attribute": "src"},
                    {"name": "alt", "type": "attribute", "attribute": "alt"},
                ],
            },
            {
                "name": "link",
                "selector": "a[href]",
                "type": "attribute",
                "attribute": "href",
            },
        ],
    }

    extraction_strategy = JsonCssExtractionStrategy(schema, verbose=True)

    async with AsyncWebCrawler(verbose=True) as crawler:
        result = await crawler.arun(
            url="https://www.nbcnews.com/business",
            extraction_strategy=extraction_strategy,
            bypass_cache=True,
        )

        assert result.success, "Failed to crawl the page"

        news_teasers = json.loads(result.extracted_content)
        print(f"Successfully extracted {len(news_teasers)} news teasers")
        print(json.dumps(news_teasers[0], indent=2))

await extract_news_teasers()
```

### 🔄 基于会话的动态内容爬取

Crawl4AI 的基于会话的爬取在处理 GitHub 等平台上的动态内容时特别有用。在这个例子中，我们使用它来提取多个页面的提交历史，利用自定义钩子确保新内容的正确加载。

```python
import asyncio
import re
from bs4 import BeautifulSoup
from crawl4ai import AsyncWebCrawler

async def crawl_linux_commits():
    first_commit = ""
    async def on_execution_started(page):
        nonlocal first_commit 
        try:
            while True:
                await page.wait_for_selector('li.Box-sc-g0xbh4-0 h4')
                commit = await page.query_selector('li.Box-sc-g0xbh4-0 h4')
                commit = await commit.evaluate('(element) => element.textContent')
                commit = re.sub(r'\s+', '', commit)
                if commit and commit != first_commit:
                    first_commit = commit
                    break
                await asyncio.sleep(0.5)
        except Exception as e:
            print(f"警告：JavaScript 执行后新内容未出现: {e}")

    async with AsyncWebCrawler(verbose=True) as crawler:
        crawler.crawler_strategy.set_hook('on_execution_started', on_execution_started)

        url = "https://github.com/torvalds/linux/commits/master"
        session_id = "linux_commits_session"
        all_commits = []

        js_next_page = """
        const button = document.querySelector('a[data-testid="pagination-next-button"]');
        if (button) button.click();
        """

        for page in range(3):  # 爬取 3 个页面
            result = await crawler.arun(
                url=url,
                session_id=session_id,
                css_selector="li.Box-sc-g0xbh4-0",
                js=js_next_page if page > 0 else None,
                bypass_cache=True,
                js_only=page > 0
            )

            assert result.success, f"爬取页面 {page + 1} 失败"

            soup = BeautifulSoup(result.cleaned_html, 'html.parser')
            commits = soup.select("li")
            all_commits.extend(commits)

            print(f"页面 {page + 1}: 找到 {len(commits)} 个提交")

        await crawler.crawler_strategy.kill_session(session_id)
        print(f"成功爬取了 {len(all_commits)} 个提交，共 3 个页面")

asyncio.run(crawl_linux_commits())
```
* **基于会话的爬取**: 我们维护一个会话来处理动态内容并加载新页面。
* **JavaScript 执行**: 自定义 JavaScript 点击 GitHub 提交页面上的“下一页”按钮以加载更多提交。
* **自定义钩子**: `on_execution_started` 钩子确保在继续之前新提交已加载。

该技术允许您在管理多个请求的状态时，从动态页面提取内容。

> 欲了解更多详细信息和高级用法，请查看 [完整文档](https://crawl4ai.com/mkdocs/)

## 现实世界的应用：

Crawl4AI 适用于广泛的应用场景，包括：

* **训练大型语言模型：** Crawl4AI 收集的结构化数据非常适合用于训练 LLM，帮助提高其在各种应用中的性能。
* **市场研究：** 企业可以利用 Crawl4AI 从竞争对手网站、新闻文章和社交媒体中获取洞察，促进数据驱动的决策。
* **内容聚合：** 内容创作者可以使用 Crawl4AI 从多个来源收集和整理信息，简化内容创作过程。
* **学术研究：** 研究人员可以自动化从学术出版物和在线数据库中收集数据，促进文献综述和数据分析。
* **情感分析：** 通过抓取评论和社交媒体帖子，用户可以分析公众对产品或服务的情感。
* **实时数据检索：** RAG 系统可以利用 Crawl4AI 从网络中获取最新信息，提高 AI 生成内容的准确性。
* **动态函数调用：** AI 代理可以利用 Crawl4AI 根据实时数据执行函数调用，允许更具互动性和响应性的应用。

## 结论

随着数据在各行业决策过程中变得越来越重要，像 Crawl4AI 这样的工具对于利用网络数据至关重要。其强大的自动化功能不仅节省了时间，还为分析和洞察生成开辟了新的途径。凭借多 URL 爬取、媒体提取和高级输出格式等功能，Crawl4AI 是一款强大且高效的网络爬虫工具，专为现代数据收集需求量身定制。无论您是开发者、研究人员还是企业主，它都提供了必要的资源，以简化您的数据提取过程并最大化您的洞察价值。

## 参考文献：

1. [Crawl4AI 文档](https://crawl4ai.com/mkdocs/)
2. [Crawl4AI GitHub](https://github.com/unclecode/crawl4ai)
3. [Crawl4AI：为 AI 代理自动化网络爬虫和数据提取](https://readmedium.com/crawl4ai-automating-web-crawling-and-data-extraction-for-ai-agents-33c9c7ecfa26)

