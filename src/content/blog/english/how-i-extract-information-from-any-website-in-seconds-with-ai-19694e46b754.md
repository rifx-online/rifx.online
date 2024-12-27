---
title: "How I Extract Information from any Website in Seconds with AI"
meta_title: "How I Extract Information from any Website in Seconds with AI"
description: "The article outlines a comprehensive guide on building an AI tool that efficiently scrapes, extracts, and analyzes web data using technologies such as Langchain, OpenAI, Bright Data, and Next.js. It emphasizes the importance of extracting valuable information from scraped data for informed decision-making. The tutorial covers prerequisites, credential setup, project structure, and detailed implementation steps for creating a web content querier application, including both frontend and backend components. The final product allows users to query web content and receive processed insights, leveraging AI for enhanced data analysis."
date: 2024-12-27T12:59:06Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Lh0rFsMKIJ9tfsTxzNPqpQ.gif"
categories: ["Programming", "Technology/Web", "Data Science"]
author: "Rifx.Online"
tags: ["web", "scraping", "Langchain", "OpenAI", "BrightData"]
draft: False

---





### Use Langchain, OpenAI, Bright Data, and NextJS to build an AI tool that scrapes, extracts, and analyzes data for free.



“Useful” data is the backbone of informed decision\-making and strategic planning for any successful business. However, the real challenge isn’t just scraping data — it’s extracting valuable information from the data you’ve collected. This step often requires significant time and effort, making it a bottleneck in the process.

In this article, you’ll learn how to build a scraper that not only extracts web data but also processes and analyzes it in seconds. You’ll walk through a step\-by\-step process, from integrating [**Bright Data Scraping Browser**](https://get.brightdata.com/bd-scraping-browser) to bypass common scraping obstacles like Captcha and IP bans to using **LangChain** and **OpenAI** for real\-time data processing and building a sleek user interface with **Next.js** to display your results.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*Aq4aUiH2ouZsJ5EK)


### Prerequisites:

* Familiarity with **JavaScript** and **TypeScript** and frameworks like React or Next.js.
* **Node.js (v16 or higher):** Required to run the Next.js application.
* **npm** or **yarn:** This is used to manage dependencies in your project.


## Getting your Credentials

Before starting the project, you’ll need access credentials for the **Bright Data Scraping Browser** and an **OpenAI API key**. This section provides a step\-by\-step guide to obtaining these credentials. **Skip this step if you already have them**.


### 1\. Bright Data Scraping Browser Access Details

To bypass anti\-scraping mechanisms like this, you need the Scraping Browser.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*_P99GutTN6jwDQklti_6rQ.png)

[Bright Data’s Scraping Browser](https://get.brightdata.com/bd-scraping-browser) is a powerful tool that automatically manages all website unlocking operations under the hood, including CAPTCHA solving, browser fingerprinting, automatic retries, selecting headers, cookies, \& Javascript rendering, and more, so you can save time and resources.

* **Sign up**: [On the homepage](https://get.brightdata.com/bd7914), click “**Start Free Trial**”. If you already have an account, log in.
* Click on “**Get Proxy Products**”.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*bHdxpn-DaQG5qcoF)

* Click on the “**Add**” button and select “Scraping Browser.”

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*hKmDSXSBjVPiWqle)

* Next, you will be taken to the “Add zone” page, where you will be required to choose a name for your new scraping browser proxy zone. After that, click on “**Add**”.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*uyJxKtx1uGGUucXk)

* After this, your proxy zone credentials will be created. (You will need these details in your code to bypass any anti\-scraping mechanisms used on any website.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*TcDkUBfhBCGNRR_8)


### 2\. OpenAI API Key

OpenAI’s API will be used to process and analyze the scraped data. Here’s how to get your API key:

1. Create an [OpenAI Account](https://platform.openai.com/) if you haven’t already done so.
2. Click on “**Start Building**” and fill in the necessary details
3. Once logged in, navigate to the API section in your dashboard.
4. In the API Keys section of the dashboard, click Create New Key.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*30E5FDi2Y29cXPT6)

Copy the generated key and store it in a secure location, as OpenAI will not display it again. If this is your first time, you may need to set up a billing account. Add your payment details to unlock access to GPT\-4 and other models.


## Building the Scraper

Now that you have your credentials ready, it’s time to dive into building the application. The project will involve creating a Next.js application, setting up components and routes, and implementing the logic for web content extraction and analysis. Here’s a breakdown of the steps:


### 1\. Setting up the Next.js application

Start by creating a new Next.js project. While installing, initialize Typescript and Tailwind CSS, and use the src folder and App router.


```python
npx create-next-app@latest web-content-ai-scraper
cd web-content-ai-scraper
```
Install the required dependencies:


```python
npm install axios puppeteer-core dotenv cheerio @langchain/community @langchain/openai @langchain/core langchain
```

### 2\. Project Structure

Organize your project with the following structure:


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

## 3\. Setting Up Environment Variables

Create a `.env` file in the root of your project to store your API keys and credentials securely:


```python
OPENAI_API_KEY=<your_openai_api_key>
BRIGHT_DATA_ENDPOINT=<your_bright_data_endpoint>
```
Ensure you add the `.env` file to your `.gitignore` to prevent accidental exposure of sensitive information.


## 4\. Implementing the Components

To handle the user input and display the results, we will create two React components that will reside in the `src/app/components` folder.


### 1\. QueryResults Component

The `QueryResults.tsx` file is used to display the query results and the context sources returned from the backend.

Here’s the complete code:


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
          Query Result
        </h2>
        <p className="text-gray-700">{answer}</p>
      </div>

      <details className="bg-gray-50 border border-gray-200 rounded-lg">
        <summary className="px-4 py-2 cursor-pointer text-gray-800 font-medium">
          View Context Sources
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
**Explanation:**

1. The `QueryResults` Component accepts two props:
* `answer`: The processed output from the AI.
* `context`: An array of context sources related to the query.

2\. The query result is displayed in a highlighted box with a title.

3\. A collapsible `details` section allows users to view content sources, making it clean and user\-friendly.


### 2\. WebContentQuerierForm Component

The `WebContentQuerierForm.tsx` file creates a user interface for inputting the URL and query.

Here’s the complete code:


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

    // Basic validation
    if (!url.trim() || !query.trim()) {
      alert('Please enter both a URL and a query');
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
          Web Page URL
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
          Your Query
        </label>
        <textarea
          id="query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your question about the web page"
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
          {isLoading ? 'Processing...' : 'Query Web Content'}
        </button>
      </div>
    </form>
  );
};

export default WebContentQuerierForm;
```
**Explanation:**

* The form includes input fields for a `URL` and a `query`.
* Validation ensures both fields are filled out before submission.
* A `submit` button triggers the `onSubmit` function, which processes the input.
* The button dynamically updates to indicate the loading status (`Processing…`) when the form is submitted.

The next step will involve setting up the backend API to handle and integrate the query with Bright Data and OpenAI.


### 5\. Creating the API Route

In this section, we will set up an API route to handle the request from the frontend form, process the provided URL and query, and return the result to be displayed.

File: `app/api/query-web-content/route.ts`

Below is the complete code for the API route:


```python
import { NextRequest, NextResponse } from 'next/server';
import { WebContentQuerier } from '../../../../utils/WebContentQuerier';

export async function POST(request: NextRequest) {
  try {
    const { url, query } = await request.json();

    if (!url || !query) {
      return NextResponse.json(
        { message: 'URL and query are required' }, 
        { status: 400 }
      );
    }

    const querier = new WebContentQuerier();
    
    // Extract web page content
    await querier.extractWebPageContent(url);

    // Query the content
    const result = await querier.queryContent(query);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing web content query:', error);
    return NextResponse.json(
      { 
        message: 'Error processing web content query', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    );
  }
}
```
**How It Works**

1. **Request Handling**:
* This route uses the `POST` method to process data from the frontend.
* The `NextRequest` object extracts the `url` and `query` from the request body.

2**. Input Validation**:

* If either `url` or `query` is missing, the API responds with a `400` status and an error message.

3\. **Web Content Processing**:

* An instance of the `WebContentQuerier` the utility is created.
* The `extractWebPageContent` method fetches the content of the web page from the provided `url`.
* The `queryContent` method processes the extracted content using the provided query to generate a meaningful result.

4\. **Error Handling**:

* Any errors encountered during the process are logged to the console.
* The API responds with a `500` status and includes the error message for debugging.

5\. **Response**:

* On successful execution, the API sends back the processed result (e.g., the answer and related context sources) as a JSON response.

The next step is to implement the code for `WebContentQuerier` utility.


### 6\. Writing the Core Logic

The core logic of our project is encapsulated in the `WebContentQuerier` class. This utility handles fetching web page content, processing, and indexing it, and performing queries to provide context\-based answers. Below is the complete implementation and a breakdown of its functionality.

File: `utils/WebContentQuerier.ts`


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
**Explanation**

1\. `extractWebPageContent(url: string)`

This method extracts and indexes the content from a web page.

* **Scraping Content**:

— Connects to a Puppeteer browser using a WebSocket endpoint (`BROWSER_WS`).

— Navigate to the URL and retrieve the HTML content of the page.

* **Content Parsing**:

— Uses Cheerio to extract and clean the textual content of the page (`$(‘body’).text()`).

* **Document Splitting**:

— Splits the text into smaller chunks using `RecursiveCharacterTextSplitter` to ensure better embeddings and search performance.

* **Vector Store Creation**:

— Converts the split documents into embeddings using `OpenAIEmbeddings` and stores them in a memory\-based vector store.

* **Return Value**:
* Returns the number of chunks created.

2\. `queryContent(query: string, maxResults: number = 4)`

This method processes user queries based on the indexed content.

* **Similarity Search**:

— Uses the vector store to find the most relevant text chunks for the query.

* **Context Generation**:

— Combines the content of the relevant documents into a single string, providing the context for the query.

* **Chat Completion**:

— Sends the context and query as system and human messages to the OpenAI `ChatOpenAI` model.

— The system message instructs the AI to respond only based on the context. You can modify the prompts for more accurate information

* **Return Value**:

— Returns an object containing the AI’s answer and the relevant context.


## 7\. Updating Layout and Page Files

The `layout.tsx` file defines the **global layout** for your application. And

Here’s the code for the `layout.tsx` file:


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
The `page.tsx` file defines the **content and functionality** for the `/api/query-web-content` route in the app.


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


## Wrapping Thoughts

By combining AI and web scraping, you have created a powerful and efficient system for extracting and querying web content. This approach leverages the precision of AI models like OpenAI’s GPT\-3\.5\-turbo alongside robust scraping tools like [Bright Data’s Scraping Browser](https://get.brightdata.com/bd-scraping-browser) to transform raw web data into meaningful insights. This can be useful in research and content analysis, customer support automation, and a lot more.

The code for this tutorial is available on [GitHub](https://github.com/Aviatorscode2/Web-Content-Querier); tweak it and improve it for your use.


