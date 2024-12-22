---
title: "Crawl4AI: Your Ultimate Asynchronous Web Crawling Companion 🕷️🤖"
meta_title: "Crawl4AI: Your Ultimate Asynchronous Web Crawling Companion 🕷️🤖"
description: "Crawl4AI is an open-source Python library designed for efficient and asynchronous web crawling, tailored for AI applications and large language models. It offers robust features, including concurrent crawling, media and metadata extraction, and customizable settings for user-agents and proxies. The library supports various output formats and allows JavaScript execution for dynamic content. Installation can be done via pip, with options for both asynchronous and synchronous versions. Crawl4AI is noted for its speed, outperforming many paid services, making it an ideal choice for developers seeking to streamline web data extraction tasks."
date: 2024-12-22T03:50:49Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ebriuVM77YzFHlkjbdIuFQ.jpeg"
categories: ["Programming", "Technology/Web", "Data Science"]
author: "Rifx.Online"
tags: ["web", "crawling", "asynchronous", "Python", "extraction"]
draft: False

---






Crawl4AI is an **open\-source Python library** designed to simplify web crawling and extract valuable information from web pages effortlessly. Whether you’re integrating it as a REST API or using it directly within your Python projects, Crawl4AI offers a **robust**, **flexible** and **fully asynchronous** solution tailored for large language models (LLMs) and AI applications.


## Introduction

**Crawl4AI** aims to **make web crawling and data extraction from web pages easy and efficient**. Whether you’re building sophisticated AI applications or enhancing large language models, Crawl4AI provides the tools you need to streamline your workflows. With full asynchronous support, Crawl4AI ensures that your crawling tasks are **fast**, **reliable** and **scalable**.


## Quick Start 🚀

Get up and running with Crawl4AI in no time! Here’s a simple example showcasing its powerful asynchronous capabilities:


```python
import asyncio
from crawl4ai import AsyncWebCrawler

async def main():
    # Initialize the asynchronous web crawler
    async with AsyncWebCrawler(verbose=True) as crawler:
        # Crawl the specified URL
        result = await crawler.arun(url="https://www.nbcnews.com/business")
        # Display the extracted content in Markdown format
        print(result.markdown)
## Execute the asynchronous main function
if __name__ == "__main__":
    asyncio.run(main())
```

## Explanation:

1. **Importing the Library**: Import `AsyncWebCrawler` from the `crawl4ai` library and the `asyncio` module.
2. **Creating an Async Context**: Use an asynchronous context manager to instantiate `AsyncWebCrawler`.
3. **Running the Crawler**: Utilize the `arun()` method to asynchronously crawl the specified URL and extract meaningful content.
4. **Printing the Result**: Output the extracted content, formatted in Markdown.
5. **Executing the Async Function**: Use `asyncio.run()` to execute the asynchronous `main` function.


## Features ✨

Crawl4AI is packed with features designed to make your web crawling and data extraction tasks seamless:

* **🆓 Completely Free \& Open\-Source**: No hidden costs or licensing fees.
* **🚀 Blazing Fast Performance**: Outperforms many paid services with superior speed.
* **🤖 LLM\-Friendly Output Formats**: Supports JSON, cleaned HTML and Markdown.
* **🌍 Concurrent Crawling**: Crawl multiple URLs simultaneously for maximum efficiency.
* **🎨 Media Tag Extraction**: Retrieves all media tags including Images, Audio and Video.
* **🔗 Comprehensive Link Extraction**: Gathers both external and internal links.
* **📚 Metadata Extraction**: Extracts detailed metadata from web pages.
* **🔄 Custom Hooks \& Authentication**: Customize headers, authentication and modify pages before crawling.
* **🕵️ User\-Agent Customization**: Mimic different browsers or devices with ease.
* **🖼️ Page Screenshots**: Capture visual snapshots of web pages.
* **📜 JavaScript Execution**: Execute custom JavaScripts before crawling for dynamic content.
* **📊 Structured Data Extraction**: Utilize `JsonCssExtractionStrategy` for precise data structuring.
* **📚 Versatile Chunking Strategies**: Includes topic\-based, regex, sentence\-based and more.
* **🧠 Advanced Extraction Techniques**: Features cosine clustering and LLM\-powered extraction.
* **🎯 Precise CSS Selector Support**: Target specific data points with accurate CSS selectors.
* **📝 Instruction\-Based Refinement**: Pass instructions or keywords to enhance data extraction.
* **🔒 Proxy Support**: Enhance privacy and access with proxy configurations.
* **🔄 Session Management**: Handle complex multi\-page crawling scenarios effortlessly.
* **🌐 Fully Asynchronous Architecture**: Boost performance and scalability with async support.


## Installation 🛠️

Crawl4AI offers flexible installation options to cater to various use cases. Choose the method that best fits your workflow:


## Using pip 🐍


### Basic Installation

For standard web crawling and scraping tasks:


```python
pip install crawl4ai
```
*By default, this installs the asynchronous version of Crawl4AI using Playwright for web crawling.*

**👉 Note**: If you encounter Playwright\-related errors during installation, manually install Playwright using one of the following methods:

* **Command Line:**


```python
playwright install
```
* **Specific Chromium Installation:**


```python
python -m playwright install chromium
```

### Installation with Synchronous Version

If you prefer the synchronous version using Selenium:


```python
pip install crawl4ai[sync]
```

### Development Installation

For contributors aiming to modify the source code:


```python
git clone https://github.com/unclecode/crawl4ai.git
cd crawl4ai
pip install -e .
```

## Advanced Usage 🔬

Unlock the full potential of Crawl4AI with these advanced features and use cases:


## Executing JavaScript \& Using CSS Selectors

Enhance your crawling tasks by executing custom JavaScripts and targeting specific elements with CSS selectors.


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

## Using a Proxy

Enhance your privacy and access by routing your crawling tasks through a proxy.


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

## Extracting Structured Data without LLM

Utilize `JsonCssExtractionStrategy` for precise extraction of structured data using CSS selectors.


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

## Extracting Structured Data with OpenAI

Leverage OpenAI’s capabilities to extract and structure data dynamically.


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

## Session Management \& Dynamic Content Crawling

Handle complex scenarios like crawling multiple pages with dynamic content loaded via JavaScript.


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
            print(f"Warning: New content didn't appear after JavaScript execution: {e}")
    async with AsyncWebCrawler(verbose=True) as crawler:
        crawler.crawler_strategy.set_hook('on_execution_started', on_execution_started)
        url = "https://github.com/microsoft/TypeScript/commits/main"
        session_id = "typescript_commits_session"
        all_commits = []
        js_next_page = """
        const button = document.querySelector('a[data-testid="pagination-next-button"]');
        if (button) button.click();
        """
        for page in range(3):  # Crawl 3 pages
            result = await crawler.arun(
                url=url,
                session_id=session_id,
                css_selector="li.Box-sc-g0xbh4-0",
                js=js_next_page if page > 0 else None,
                bypass_cache=True,
                js_only=page > 0
            )
            assert result.success, f"Failed to crawl page {page + 1}"
            soup = BeautifulSoup(result.cleaned_html, 'html.parser')
            commits = soup.select("li.Box-sc-g0xbh4-0")
            all_commits.extend(commits)
            print(f"Page {page + 1}: Found {len(commits)} commits")
        await crawler.crawler_strategy.kill_session(session_id)
        print(f"Successfully crawled {len(all_commits)} commits across 3 pages")
if __name__ == "__main__":
    asyncio.run(crawl_typescript_commits())
```

## Speed Comparison 🚀

Crawl4AI is engineered for **speed** and **efficiency**, consistently outperforming many paid services. Here’s a glimpse of our performance benchmarks:

**ServiceTime TakenContent LengthImages FoundFirecrawl**7\.02 seconds42,074 characters49**Crawl4AI (Simple Crawl)**1\.60 seconds18,238 characters49**Crawl4AI (With JS Exec.)**4\.64 seconds40,869 characters89

**Key Takeaways:**

* **Simple Crawl**: Crawl4AI is **over 4 times faster** than Firecrawl.
* **With JavaScript Execution**: Even when executing JavaScript to load additional content (doubling the number of images), Crawl4AI remains **significantly faster** than Firecrawl’s simple crawl.

For a comprehensive comparison, explore our [Crawl4AI vs. Firecrawl](https://github.com/unclecode/crawl4ai/blob/main/docs/examples/crawl4ai_vs_firecrawl.py) example in the repository.


## References

<https://github.com/unclecode/crawl4ai>


