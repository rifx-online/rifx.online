---
title: "How to Use MCP Tools on Claude Desktop App and Automate Your Daily Tasks"
meta_title: "How to Use MCP Tools on Claude Desktop App and Automate Your Daily Tasks"
description: "The Model Context Protocol (MCP) is a secure standard for connecting AI assistants like Claude to various data sources and tools. This guide explains how MCP works and provides a step-by-step tutorial on installing and using the Brave Search MCP tool on the Claude Desktop App. Key steps include downloading the app, creating a configuration file, installing the Brave Search tool, and configuring the API key. Real-world examples demonstrate how MCP can simplify tasks such as web searches and data retrieval, enhancing productivity. Additional MCP servers like Filesystem, GitHub, Sqlite, and Google Maps are also recommended for further integration."
date: 2024-12-12T01:42:20Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*xwgCp53z6_uUj-NMJaTIcw.png"
categories: ["Programming", "Technology/Web", "Chatbots"]
author: "Rifx.Online"
tags: ["MCP", "Brave", "Search", "Configuration", "Integration"]
draft: False

---




**Model Context Protocol** (**MCP**) is a new standard for secure connection between AI assistants, such as **Claude**, and systems where data exists. This includes **code repositories** (Github, Gitlab), **APIs** (Google Maps, Youtube, Brave), **business tools** (Slack, Notion, Bluesky) and even **local development environments** on your own computer.

In this guide, I’ll explain **what MCP is and how it works** in simple terms, so you can easily understand its structure. Then I’ll show you **step\-by\-step how to install MCP on the Claude Desktop App**, making it easy for you to start using it right away. Finally, we’ll put everything into context with a **real\-world example** that shows how MCP can actually simplify and speed up your day\-to\-day tasks.


## How MCP works

The Model Context Protocol (MCP) operates on a client\-host\-server architecture, enabling AI applications to connect seamlessly with various data sources and tools. Here’s a breakdown of its components:

* **MCP Hosts**: Applications such as Claude Desktop, development environments, or AI tools that use MCP to interact with various resources.
* **MCP Clients**: Components in the host that establish direct, one\-to\-one connections with specific servers.
* **MCP Servers**: Small programs designed to offer particular functionalities via the MCP framework.
* **Local Resources**: Resources on your computer, like files, databases, or services, that MCP servers can securely retrieve and manage.
* **Remote Resources**: External online resources, such as APIs or cloud\-based services, that MCP servers can connect to for data or functionality.




## How To Use MCP Tools on Claude Desktop App


### Step 1: Download and Install Claude Desktop

1. Visit the Claude website and download the [Claude Desktop App for Mac](https://claude.ai/download).
2. Follow the installation instructions to set it up on your computer.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*w0u5DexT6dGsf8QSVmhSLA.png)


### Step 2: Create a Config File

1. Open the **Terminal** application on your Mac.
2. Navigate to the Claude configuration directory by running:


```python
open ~/Library/Application\ Support/Claude
```
3\. Create a new configuration file for MCP by typing:


```python
touch ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

### Step 3: Install the Brave Search MCP Tool

For this simple tutorial we are going to use Brave MCP tool, which will allow Claude Desktop App to search on the web.

1. Open the terminal and run the following command:


```python
npm install -g @modelcontextprotocol/server-brave-search
```
2\. Get a Brave API key by signing up on their [website](https://brave.com/search/api/).

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*dxPqa39E7JjcsSzatli3Eg.png)

3\. Choose a plan (Free tier available with 2,000 queries/month)

4\. Generate your API key [from the developer dashboard](https://api.search.brave.com/app/keys) and copy the new API Key.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*GDlSBLQJBaMADpsBPYXDBA.png)

5\. Open the newly created claude\_desktop\_config.json in your preferred text editor and add this to it. Don’t forget to add the Brave API Key on the field “BRAVE\_API\_KEY”.


```python
{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-brave-search"
      ],
      "env": {
        "BRAVE_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

### Step 4: Relaunch Claude Desktop App

1. Close the Claude app and reopen it.
2. On the right\-hand side of the app, verify that two new tools appear (red circle on the image below) for internet searching with the Brave Search MCP tool .

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*uKd0icy3Cr9giBTgYj6vyw.png)


### Step 6: Try It Out!

I’m going to provide two prompts to Claude, the first one **“What’s the current price of Bitcoin?”**

Claude will prompt for permission to use a tool at the start of each conversation. So you can click to allow it, as you can see in the image below.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*9taY7NF6c4RGyzsNdceaDg.png)

After that you can see that Claude is using **brave\_web\_search** tool from Brave MCP server, and providing information with data from the web.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*kq5I1uVDuz0n5a0iaXXpUQ.png)

I have done a quick research to double check if the response from Claude is correct and we can say that the price is almost correct with a diference of $98\.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Jm1NnMUqadBAxDv8MwIvfA.png)

In the second example, I asked Claude for a summary of Manchester United’s latest game. Claude performed two web searches: first to find the most recent match and then to get the game details. The day I’m currently writing this article is 8th December of 2024 and we can assure that the info provided is correctly, unfortunately United lost ;(

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Wg5dmtzLvgWbKJy48u7QFQ.png)

MCP tools like Brave Search on the Claude Desktop App make it easy to integrate AI into your daily routine. From finding real\-time information to automating tasks, MCP simplifies everything. Try exploring other [**MCP servers**](https://github.com/modelcontextprotocol/servers) to see how they can boost your productivity even more!

I would suggest the following ones:

* **Filesystem** — Secure file operations with configurable access controls
* **GitHub** — Repository management, file operations, and GitHub API integration
* **Sqlite** — Database interaction and business intelligence capabilities
* **Google Maps** — Location services, directions, and place details


## References

[https://docs.anthropic.com/en/docs/build\-with\-claude/computer\-use](https://docs.anthropic.com/en/docs/build-with-claude/computer-use)[https://www.anthropic.com/news/model\-context\-protocol](https://www.anthropic.com/news/model-context-protocol)<https://modelcontextprotocol.io/quickstart><https://github.com/modelcontextprotocol/servers>


