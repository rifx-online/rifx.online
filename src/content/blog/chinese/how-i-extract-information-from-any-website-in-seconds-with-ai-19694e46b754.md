---
title: "我如何利用人工智能在几秒钟内从任何网站提取信息"
meta_title: "我如何利用人工智能在几秒钟内从任何网站提取信息"
description: "本文介绍了如何使用 Langchain、OpenAI、Bright Data 和 Next.js 构建一个免费的 AI 工具，能够从任何网站快速抓取、提取和分析数据。文章详细描述了项目的前提条件、凭证获取、应用程序构建步骤、组件实现、API 路由设置以及核心逻辑的编写，最终形成一个高效的网页内容查询系统，结合了 AI 模型和强大的爬虫工具，适用于研究、内容分析等多个领域。"
date: 2024-12-27T12:59:06Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Lh0rFsMKIJ9tfsTxzNPqpQ.gif"
categories: ["Programming", "Technology/Web", "Data Science"]
author: "Rifx.Online"
tags: ["web", "scraping", "Langchain", "OpenAI", "BrightData"]
draft: False

---



### 使用 Langchain、OpenAI、Bright Data 和 NextJS 构建一个免费的 AI 工具，用于抓取、提取和分析数据。



“有用”的数据是任何成功企业进行明智决策和战略规划的基础。然而，真正的挑战不仅仅在于抓取数据——而在于从收集到的数据中提取有价值的信息。这一步通常需要大量的时间和精力，成为了过程中的瓶颈。

在本文中，您将学习如何构建一个不仅能提取网页数据，还能在几秒钟内处理和分析这些数据的抓取器。您将逐步了解整个过程，从集成 [**Bright Data Scraping Browser**](https://get.brightdata.com/bd-scraping-browser) 以绕过常见的抓取障碍，如验证码和 IP 封禁，到使用 **LangChain** 和 **OpenAI** 进行实时数据处理，并使用 **Next.js** 构建一个流畅的用户界面来展示您的结果。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*Aq4aUiH2ouZsJ5EK)

### 前提条件：

* 熟悉 **JavaScript** 和 **TypeScript** 以及像 React 或 Next.js 这样的框架。
* **Node.js (v16 或更高版本)：** 运行 Next.js 应用程序所需。
* **npm** 或 **yarn：** 用于管理项目中的依赖项。

## 获取您的凭证

在开始项目之前，您需要获取 **Bright Data Scraping Browser** 的访问凭证和 **OpenAI API 密钥**。本节提供获取这些凭证的逐步指南。**如果您已经拥有这些凭证，请跳过此步骤**。

### 1\. Bright Data 抓取浏览器访问详情

要绕过像这样的反抓取机制，您需要抓取浏览器。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*_P99GutTN6jwDQklti_6rQ.png)

[Bright Data 的抓取浏览器](https://get.brightdata.com/bd-scraping-browser) 是一款强大的工具，能够自动管理所有网站解锁操作，包括 CAPTCHA 解决、浏览器指纹识别、自动重试、选择头部、Cookies 和 Javascript 渲染等，从而节省您的时间和资源。

* **注册**：在[主页](https://get.brightdata.com/bd7914)上，点击“**开始免费试用**”。如果您已经有账户，请登录。
* 点击“**获取代理产品**”。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*bHdxpn-DaQG5qcoF)

* 点击“**添加**”按钮并选择“抓取浏览器”。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*hKmDSXSBjVPiWqle)

* 接下来，您将被带到“添加区域”页面，您需要为新的抓取浏览器代理区域选择一个名称。之后，点击“**添加**”。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*uyJxKtx1uGGUucXk)

* 在此之后，您的代理区域凭据将被创建。（您需要在代码中使用这些详细信息以绕过任何网站上使用的反抓取机制。）

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*TcDkUBfhBCGNRR_8)

### 2\. OpenAI API 密钥

OpenAI 的 API 将用于处理和分析抓取的数据。以下是获取您的 API 密钥的方法：

1. 创建一个 [OpenAI 账户](https://platform.openai.com/)，如果您还没有的话。
2. 点击“**开始构建**”并填写必要的详细信息。
3. 登录后，导航到仪表板中的 API 部分。
4. 在仪表板的 API 密钥部分，点击创建新密钥。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*30E5FDi2Y29cXPT6)

复制生成的密钥并将其存储在安全的位置，因为 OpenAI 不会再次显示它。如果这是您第一次使用，您可能需要设置一个账单账户。添加您的付款信息以解锁对 GPT\-4 和其他模型的访问。

## 构建抓取器

现在您已经准备好凭据，是时候开始构建应用程序了。该项目将涉及创建一个 Next.js 应用程序，设置组件和路由，并实现网页内容提取和分析的逻辑。以下是步骤的分解：

### 1\. 设置 Next.js 应用程序

首先创建一个新的 Next.js 项目。在安装时，初始化 Typescript 和 Tailwind CSS，并使用 src 文件夹和 App 路由。

```python
npx create-next-app@latest web-content-ai-scraper
cd web-content-ai-scraper
```
安装所需的依赖项：

```python
npm install axios puppeteer-core dotenv cheerio @langchain/community @langchain/openai @langchain/core langchain
```

### 2\. 项目结构

使用以下结构组织您的项目：

```python
web-content-ai-scraper/  
├── src/  
│   ├── app/  
│   │   ├── api/  
│   │   │   └── query-web-content/  
│   │   │       └── route.ts  
│   │   ├── components/  
│   │   │   ├── QueryResults.tsx  
│   │   │   └── WebContentQuerierForm.tsx  
│   │   ├── layout.tsx  
│   │   └── page.tsx  
├── utils/  
│   └── WebContentQuerier.ts  
├── .env
```

## 3\. 设置环境变量

在项目根目录创建一个 `.env` 文件，以安全地存储您的 API 密钥和凭据：

```python
OPENAI_API_KEY=<your_openai_api_key>
BRIGHT_DATA_ENDPOINT=<your_bright_data_endpoint>
```
确保将 `.env` 文件添加到 `.gitignore` 中，以防止敏感信息意外暴露。

## 4\. 实现组件

为了处理用户输入并显示结果，我们将创建两个 React 组件，这些组件将位于 `src/app/components` 文件夹中。

### 1\. QueryResults 组件

`QueryResults.tsx` 文件用于显示从后端返回的查询结果和上下文源。

这里是完整的代码：

```python
import React from 'react';

interface QueryResultsProps {
  answer: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any[];
}

const QueryResults: React.FC<QueryResultsProps> = ({ answer, context }) => {
  return (
    <div className="mt-6 space-y-4">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          查询结果
        </h2>
        <p className="text-gray-700">{answer}</p>
      </div>

      <details className="bg-gray-50 border border-gray-200 rounded-lg">
        <summary className="px-4 py-2 cursor-pointer text-gray-800 font-medium">
          查看上下文源
        </summary>
        <div className="p-4 space-y-2">
          {context.map((doc, index) => (
            <div
              key={index}
              className="bg-white p-3 rounded-md shadow-sm border border-gray-100"
            >
              <p className="text-sm text-gray-600 line-clamp-2">
                {doc.pageContent}
              </p>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
};

export default QueryResults;
```
**解释：**

1. `QueryResults` 组件接受两个属性：
* `answer`: AI 处理后的输出。
* `context`: 与查询相关的上下文源数组。

2\. 查询结果在一个突出显示的框中显示，带有标题。

3\. 可折叠的 `details` 部分允许用户查看内容源，使其简洁且用户友好。

### 2\. WebContentQuerierForm 组件

`WebContentQuerierForm.tsx` 文件创建了一个用于输入 URL 和查询的用户界面。

以下是完整代码：

```python
'use client';

import React, { useState } from 'react';

interface WebContentQuerierFormProps {
  onSubmit: (url: string, query: string) => void;
  isLoading: boolean;
}

const WebContentQuerierForm: React.FC<WebContentQuerierFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [url, setUrl] = useState('');
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 基本验证
    if (!url.trim() || !query.trim()) {
      alert('请同时输入 URL 和查询');
      return;
    }

    onSubmit(url, query);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="url"
          className="block text-sm font-medium text-gray-700"
        >
          网页 URL
        </label>
        <input
          type="url"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label
          htmlFor="query"
          className="block text-sm font-medium text-gray-700"
        >
          你的查询
        </label>
        <textarea
          id="query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="输入你关于网页的问题"
          required
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
            ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            }`}
        >
          {isLoading ? '处理中...' : '查询网页内容'}
        </button>
      </div>
    </form>
  );
};

export default WebContentQuerierForm;
```
**说明：**

* 表单包含用于输入 `URL` 和 `查询` 的字段。
* 验证确保在提交之前填写了这两个字段。
* `提交` 按钮触发 `onSubmit` 函数，处理输入。
* 按钮动态更新以指示加载状态（`处理中...`）当表单被提交时。

下一步将涉及设置后端 API，以处理并将查询与 Bright Data 和 OpenAI 集成。

### 5\. 创建 API 路由

在本节中，我们将设置一个 API 路由，以处理来自前端表单的请求，处理提供的 URL 和查询，并返回结果以供显示。

文件：`app/api/query-web-content/route.ts`

以下是 API 路由的完整代码：

```python
import { NextRequest, NextResponse } from 'next/server';
import { WebContentQuerier } from '../../../../utils/WebContentQuerier';

export async function POST(request: NextRequest) {
  try {
    const { url, query } = await request.json();

    if (!url || !query) {
      return NextResponse.json(
        { message: 'URL 和查询是必需的' }, 
        { status: 400 }
      );
    }

    const querier = new WebContentQuerier();
    
    // 提取网页内容
    await querier.extractWebPageContent(url);

    // 查询内容
    const result = await querier.queryContent(query);

    return NextResponse.json(result);
  } catch (error) {
    console.error('处理网页内容查询时出错:', error);
    return NextResponse.json(
      { 
        message: '处理网页内容查询时出错', 
        error: error instanceof Error ? error.message : '未知错误' 
      }, 
      { status: 500 }
    );
  }
}
```
**工作原理**

1. **请求处理**：
* 此路由使用 `POST` 方法处理来自前端的数据。
* `NextRequest` 对象从请求体中提取 `url` 和 `query`。

2. **输入验证**：

* 如果缺少 `url` 或 `query`，API 将以 `400` 状态和错误消息进行响应。

3\. **网页内容处理**：

* 创建 `WebContentQuerier` 工具的实例。
* `extractWebPageContent` 方法从提供的 `url` 获取网页内容。
* `queryContent` 方法使用提供的查询处理提取的内容，以生成有意义的结果。

4\. **错误处理**：

* 处理过程中遇到的任何错误都会记录到控制台。
* API 将以 `500` 状态响应，并包含用于调试的错误消息。

5\. **响应**：

* 在成功执行后，API 将处理结果（例如，答案和相关上下文来源）作为 JSON 响应返回。

下一步是实现 `WebContentQuerier` 工具的代码。

### 6\. 编写核心逻辑

我们项目的核心逻辑封装在 `WebContentQuerier` 类中。该工具负责获取网页内容、处理和索引内容，并执行查询以提供基于上下文的答案。以下是完整的实现及其功能的详细说明。

文件： `utils/WebContentQuerier.ts`

```python
import { ChatOpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import puppeteer from 'puppeteer-core';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';


// Load environment variables
dotenv.config();

export class WebContentQuerier {
  private model: ChatOpenAI;
  private embeddings: OpenAIEmbeddings;
  private vectorStore: MemoryVectorStore | null;

  constructor() {
    // Initialize OpenAI model and embeddings
    this.model = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0.7,
      model: 'gpt-3.5-turbo',
    });

    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    this.vectorStore = null;
  }

  async extractWebPageContent(url: string) {
    const BROWSER_WS = process.env.BRIGHT_DATA_ENDPOINT; // Scraping browser WebSocket URL

    if (!BROWSER_WS) {
      throw new Error("Scraping browser WebSocket URL is not defined in .env file.");
    }

    try {
      console.log('Connecting to Scraping Browser...');
      
      // Connect to the Scraping Browser
      const browser = await puppeteer.connect({
        browserWSEndpoint: BROWSER_WS,
      });

      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(60000);
      console.log(`Navigating to URL: ${url}`);
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

      // Extract the content
      const html = await page.content();

      // Use Cheerio to parse the HTML
      const $ = cheerio.load(html);
      const pageText = $('body').text()
        .replace(/\s+/g, ' ')
        .trim();

      // Create a document-like object
      const docs = [{
        pageContent: pageText,
        metadata: { source: url }
      }];

      // Split the document into smaller chunks
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });

      const splitDocs = await textSplitter.splitDocuments(docs);

      // Create vector store in memory
      this.vectorStore = await MemoryVectorStore.fromDocuments(
        splitDocs,
        this.embeddings
      );

      console.log(`Successfully extracted and indexed content from ${url}`);
      await browser.close();
      return splitDocs.length;
    } catch (error) {
      console.error('Error extracting web page content:', error);
      throw error;
    }
  }

  async queryContent(query: string, maxResults: number = 4) {
    if (!this.vectorStore) {
      throw new Error(
        'No content has been loaded. Call extractWebPageContent first.'
      );
    }

    try {
      // Perform similarity search
      const relevantDocs = await this.vectorStore.similaritySearch(
        query,
        maxResults
      );

      // Use the relevant documents as context for the query
      const context = relevantDocs.map((doc) => doc.pageContent).join('\n\n');

      // Create chat messages with system and human messages
      const messages = [
        new SystemMessage(
          'You are a helpful assistant that answers questions based strictly on the given context.'
        ),
        new HumanMessage(
          `Context:\n${context}\n\nQuery: ${query}\n\nProvide a concise and accurate answer based strictly on the context.`
        ),
      ];

      // Generate an answer using the chat messages
      const response = await this.model.invoke(messages);

      return {
        answer: response.content,
        context: relevantDocs,
      };
    } catch (error) {
      console.error('Error querying content:', error);
      throw error;
    }
  }

  // Optional method to clear the vector store
  clearContent() {
    this.vectorStore = null;
    console.log('Vector store cleared');
  }
}

export default WebContentQuerier;

```
**解释**

1\. `extractWebPageContent(url: string)`

该方法提取并索引网页内容。

* **抓取内容**：

— 通过 WebSocket 端点 (`BROWSER_WS`) 连接到 Puppeteer 浏览器。

— 导航到 URL 并检索页面的 HTML 内容。

* **内容解析**：

— 使用 Cheerio 提取并清理页面的文本内容 (`$(‘body’).text()`).

* **文档拆分**：

— 使用 `RecursiveCharacterTextSplitter` 将文本拆分成更小的块，以确保更好的嵌入和搜索性能。

* **向量存储创建**：

— 使用 `OpenAIEmbeddings` 将拆分的文档转换为嵌入，并将其存储在基于内存的向量存储中。

* **返回值**：
* 返回创建的块的数量。

2\. `queryContent(query: string, maxResults: number = 4)`

该方法根据索引内容处理用户查询。

* **相似性搜索**：

— 使用向量存储查找与查询最相关的文本块。

* **上下文生成**：

— 将相关文档的内容合并为一个字符串，为查询提供上下文。

* **聊天补全**：

— 将上下文和查询作为系统和人类消息发送给 OpenAI `ChatOpenAI` 模型。

— 系统消息指示 AI 仅根据上下文作答。您可以修改提示以获取更准确的信息。

* **返回值**：

— 返回一个包含 AI 答案和相关上下文的对象。

## 7\. 更新布局和页面文件

`layout.tsx` 文件定义了您应用程序的 **全局布局**。并且

这是 `layout.tsx` 文件的代码：


```python
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Web Content Querier',
  description: 'Query web content using AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100`}>{children}</body>
    </html>
  );
}
```
`page.tsx` 文件定义了应用程序中 `/api/query-web-content` 路由的 **内容和功能**。


```python
'use client';

import { useState } from 'react';
import WebContentQuerierForm from './components/WebContentQuerierForm';
import QueryResults from './components/QueryResults';

export default function Home() {
  const [queryResult, setQueryResult] = useState<{
    answer: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    context: any[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuery = async (url: string, query: string) => {
    setIsLoading(true);
    setError(null);
    setQueryResult(null);

    try {
      const response = await fetch('/api/query-web-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, query }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch query results');
      }

      const data = await response.json();
      setQueryResult(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-6">
                  Web Content Querier
                </h1>

                <WebContentQuerierForm
                  onSubmit={handleQuery}
                  isLoading={isLoading}
                />

                {error && (
                  <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                    role="alert"
                  >
                    {error}
                  </div>
                )}

                {isLoading && (
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                )}

                {queryResult && (
                  <QueryResults
                    answer={queryResult.answer}
                    context={queryResult.context}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```
![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*E4JJp7VFTiNSunMr)

## 包装思考

通过结合人工智能和网络爬虫，您创建了一个强大而高效的系统，用于提取和查询网络内容。这种方法利用了像OpenAI的GPT-3.5-turbo这样的人工智能模型的精确性，以及像[Bright Data的爬虫浏览器](https://get.brightdata.com/bd-scraping-browser)这样的强大爬虫工具，将原始网络数据转化为有意义的洞察。这在研究和内容分析、客户支持自动化等方面都非常有用。

本教程的代码可在[GitHub](https://github.com/Aviatorscode2/Web-Content-Querier)上获取；请根据您的需求进行调整和改进。

