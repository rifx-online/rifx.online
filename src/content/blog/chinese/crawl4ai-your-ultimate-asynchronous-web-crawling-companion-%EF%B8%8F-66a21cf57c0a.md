---
title: "Crawl4AI：您的终极异步网络爬行伴侣 🕷️🤖"
meta_title: "Crawl4AI：您的终极异步网络爬行伴侣 🕷️🤖"
description: "Crawl4AI是一个开源的Python库，旨在提高网络爬虫和数据提取的效率，特别适用于大型语言模型和人工智能应用。它支持完全异步操作，允许并发爬取多个URL，并提供多种数据输出格式。Crawl4AI具备强大的特性，包括媒体标签提取、元数据提取、会话管理、动态内容爬取和自定义钩子等。该库易于安装，适合各种用例，性能优于许多付费服务。"
date: 2024-12-22T03:50:49Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ebriuVM77YzFHlkjbdIuFQ.jpeg"
categories: ["Programming", "Technology/Web", "Data Science"]
author: "Rifx.Online"
tags: ["web", "crawling", "asynchronous", "Python", "extraction"]
draft: False

---





Crawl4AI 是一个 **开源 Python 库**，旨在简化网络爬虫并轻松提取网页上的有价值信息。无论您是将其集成作为 REST API，还是直接在您的 Python 项目中使用，Crawl4AI 都提供了一种 **强大**、**灵活** 和 **完全异步** 的解决方案，专为大型语言模型（LLMs）和人工智能应用量身定制。

## 介绍

**Crawl4AI** 旨在 **简化网页爬取和数据提取的过程，提高效率**。无论您是在构建复杂的 AI 应用程序还是在增强大型语言模型，Crawl4AI 都提供了您所需的工具，以优化您的工作流程。凭借全面的异步支持，Crawl4AI 确保您的爬取任务 **快速**、**可靠** 和 **可扩展**。

## 快速开始 🚀

快速上手 Crawl4AI！以下是一个简单的示例，展示其强大的异步能力：


```python
import asyncio
from crawl4ai import AsyncWebCrawler

async def main():
    # 初始化异步网页爬虫
    async with AsyncWebCrawler(verbose=True) as crawler:
        # 爬取指定的 URL
        result = await crawler.arun(url="https://www.nbcnews.com/business")
        # 以 Markdown 格式显示提取的内容
        print(result.markdown)
## 执行异步主函数
if __name__ == "__main__":
    asyncio.run(main())
```

## 说明：

1. **导入库**：从 `crawl4ai` 库导入 `AsyncWebCrawler` 和 `asyncio` 模块。
2. **创建异步上下文**：使用异步上下文管理器实例化 `AsyncWebCrawler`。
3. **运行爬虫**：利用 `arun()` 方法异步爬取指定的 URL 并提取有意义的内容。
4. **打印结果**：输出提取的内容，格式化为 Markdown。
5. **执行异步函数**：使用 `asyncio.run()` 执行异步 `main` 函数。

## 特性 ✨

Crawl4AI 拥有一系列旨在让您的网络爬虫和数据提取任务无缝进行的特性：

* **🆓 完全免费 \& 开源**：没有隐藏费用或许可费用。
* **🚀 超快性能**：在速度上超越许多付费服务。
* **🤖 LLM\-友好的输出格式**：支持 JSON、清理后的 HTML 和 Markdown。
* **🌍 并发爬取**：同时爬取多个 URL，以实现最大效率。
* **🎨 媒体标签提取**：提取所有媒体标签，包括图像、音频和视频。
* **🔗 全面链接提取**：收集外部和内部链接。
* **📚 元数据提取**：从网页中提取详细的元数据。
* **🔄 自定义钩子 \& 身份验证**：在爬取之前自定义头部、身份验证并修改页面。
* **🕵️ 用户代理自定义**：轻松模拟不同的浏览器或设备。
* **🖼️ 页面截图**：捕捉网页的视觉快照。
* **📜 JavaScript 执行**：在爬取之前执行自定义 JavaScript 以获取动态内容。
* **📊 结构化数据提取**：利用 `JsonCssExtractionStrategy` 进行精确的数据结构化。
* **📚 多样化的分块策略**：包括基于主题、正则表达式、句子等的策略。
* **🧠 高级提取技术**：具备余弦聚类和 LLM 驱动的提取功能。
* **🎯 精确的 CSS 选择器支持**：使用准确的 CSS 选择器定位特定数据点。
* **📝 基于指令的优化**：传递指令或关键词以增强数据提取。
* **🔒 代理支持**：通过代理配置增强隐私和访问权限。
* **🔄 会话管理**：轻松处理复杂的多页面爬取场景。
* **🌐 完全异步架构**：通过异步支持提升性能和可扩展性。

## 安装 🛠️

Crawl4AI 提供灵活的安装选项，以满足各种用例。选择最适合您工作流程的方法：

## 使用 pip 🐍

### 基本安装

对于标准的网页爬取和抓取任务：

```python
pip install crawl4ai
```
*默认情况下，这将使用 Playwright 安装 Crawl4AI 的异步版本进行网页爬取。*

**👉 注意**：如果在安装过程中遇到与 Playwright 相关的错误，请使用以下方法之一手动安装 Playwright：

* **命令行：**

```python
playwright install
```
* **特定的 Chromium 安装：**

```python
python -m playwright install chromium
```

### 使用同步版本的安装

如果您更喜欢使用 Selenium 的同步版本：


```python
pip install crawl4ai[sync]
```

### 开发安装

对于希望修改源代码的贡献者：


```python
git clone https://github.com/unclecode/crawl4ai.git
cd crawl4ai
pip install -e .
```

## 高级用法 🔬

通过这些高级功能和用例，释放 Crawl4AI 的全部潜力：

## 执行 JavaScript \& 使用 CSS 选择器

通过执行自定义 JavaScript 和使用 CSS 选择器来增强您的爬虫任务。

```python
import asyncio
from crawl4ai import AsyncWebCrawler

async def main():
    async with AsyncWebCrawler(verbose=True) as crawler:
        js_code = [
            "const loadMoreButton = Array.from(document.querySelectorAll('button')).find(button => button.textContent.includes('Load More')); loadMoreButton && loadMoreButton.click();"
        ]
        result = await crawler.arun(
            url="https://www.nbcnews.com/business",
            js_code=js_code,
            css_selector="article.tease-card",
            bypass_cache=True
        )
        print(result.extracted_content)
if __name__ == "__main__":
    asyncio.run(main())
```

## 使用代理

通过将您的爬虫任务通过代理进行路由，增强您的隐私和访问。

```python
import asyncio
from crawl4ai import AsyncWebCrawler

async def main():
    async with AsyncWebCrawler(verbose=True, proxy="http://127.0.0.1:7890") as crawler:
        result = await crawler.arun(
            url="https://www.nbcnews.com/business",
            bypass_cache=True
        )
        print(result.markdown)
if __name__ == "__main__":
    asyncio.run(main())
```

## 提取结构化数据而无需 LLM

利用 `JsonCssExtractionStrategy` 通过 CSS 选择器精确提取结构化数据。

```python
import asyncio
import json
from crawl4ai import AsyncWebCrawler
from crawl4ai.extraction_strategy import JsonCssExtractionStrategy

async def extract_news_teasers():
    schema = {
        "name": "News Teaser Extractor",
        "baseSelector": ".wide-tease-item__wrapper",
        "fields": [
            {"name": "category", "selector": ".unibrow span[data-testid='unibrow-text']", "type": "text"},
            {"name": "headline", "selector": ".wide-tease-item__headline", "type": "text"},
            {"name": "summary", "selector": ".wide-tease-item__description", "type": "text"},
            {"name": "time", "selector": "[data-testid='wide-tease-date']", "type": "text"},
            {
                "name": "image",
                "type": "nested",
                "selector": "picture.teasePicture img",
                "fields": [
                    {"name": "src", "type": "attribute", "attribute": "src"},
                    {"name": "alt", "type": "attribute", "attribute": "alt"},
                ],
            },
            {"name": "link", "selector": "a[href]", "type": "attribute", "attribute": "href"},
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
if __name__ == "__main__":
    asyncio.run(extract_news_teasers())
```

## 使用 OpenAI 提取结构化数据

利用 OpenAI 的能力动态提取和结构化数据。


```python
import os
import asyncio
from crawl4ai import AsyncWebCrawler
from crawl4ai.extraction_strategy import LLMExtractionStrategy
from pydantic import BaseModel, Field

class OpenAIModelFee(BaseModel):
    model_name: str = Field(..., description="Name of the OpenAI model.")
    input_fee: str = Field(..., description="Fee for input token for the OpenAI model.")
    output_fee: str = Field(..., description="Fee for output token for the OpenAI model.")
async def main():
    async with AsyncWebCrawler(verbose=True) as crawler:
        result = await crawler.arun(
            url='https://openai.com/api/pricing/',
            word_count_threshold=1,
            extraction_strategy=LLMExtractionStrategy(
                provider="openai/gpt-4o",
                api_token=os.getenv('OPENAI_API_KEY'), 
                schema=OpenAIModelFee.schema(),
                extraction_type="schema",
                instruction="""From the crawled content, extract all mentioned model names along with their fees for input and output tokens. 
Do not miss any models in the entire content. One extracted model JSON format should look like this: 
{"model_name": "GPT-4", "input_fee": "US$10.00 / 1M tokens", "output_fee": "US$30.00 / 1M tokens"}."""
            ),            
            bypass_cache=True,
        )
        print(result.extracted_content)
if __name__ == "__main__":
    asyncio.run(main())
```

## 会话管理 \& 动态内容爬取

处理复杂场景，例如爬取通过 JavaScript 加载的多个页面的动态内容。

```python
import asyncio
import re
from bs4 import BeautifulSoup
from crawl4ai import AsyncWebCrawler

async def crawl_typescript_commits():
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
            print(f"警告：在 JavaScript 执行后未出现新内容：{e}")
    async with AsyncWebCrawler(verbose=True) as crawler:
        crawler.crawler_strategy.set_hook('on_execution_started', on_execution_started)
        url = "https://github.com/microsoft/TypeScript/commits/main"
        session_id = "typescript_commits_session"
        all_commits = []
        js_next_page = """
        const button = document.querySelector('a[data-testid="pagination-next-button"]');
        if (button) button.click();
        """
        for page in range(3):  # 爬取 3 页
            result = await crawler.arun(
                url=url,
                session_id=session_id,
                css_selector="li.Box-sc-g0xbh4-0",
                js=js_next_page if page > 0 else None,
                bypass_cache=True,
                js_only=page > 0
            )
            assert result.success, f"爬取第 {page + 1} 页失败"
            soup = BeautifulSoup(result.cleaned_html, 'html.parser')
            commits = soup.select("li.Box-sc-g0xbh4-0")
            all_commits.extend(commits)
            print(f"第 {page + 1} 页：找到 {len(commits)} 个提交")
        await crawler.crawler_strategy.kill_session(session_id)
        print(f"成功爬取了 3 页中的 {len(all_commits)} 个提交")
if __name__ == "__main__":
    asyncio.run(crawl_typescript_commits())
```

## 速度比较 🚀

Crawl4AI 专为 **速度** 和 **效率** 而设计，始终优于许多付费服务。以下是我们的性能基准的简要概览：

**服务耗时内容长度找到的图片Firecrawl**7\.02 秒42,074 字符49**Crawl4AI (简单爬取)**1\.60 秒18,238 字符49**Crawl4AI (执行 JS)**4\.64 秒40,869 字符89

**关键要点：**

* **简单爬取**：Crawl4AI 的速度是 Firecrawl 的 **4 倍以上**。
* **执行 JavaScript**：即使在执行 JavaScript 以加载额外内容（图片数量翻倍）的情况下，Crawl4AI 仍然比 Firecrawl 的简单爬取 **显著更快**。

要进行全面比较，请查看我们在仓库中的 [Crawl4AI vs. Firecrawl](https://github.com/unclecode/crawl4ai/blob/main/docs/examples/crawl4ai_vs_firecrawl.py) 示例。

## 参考文献

<https://github.com/unclecode/crawl4ai>

