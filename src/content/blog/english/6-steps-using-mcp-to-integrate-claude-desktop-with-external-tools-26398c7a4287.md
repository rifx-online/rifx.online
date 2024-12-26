---
title: "6 Steps Using Claude’s Model Context Protocol (MCP) with External Tools"
meta_title: "6 Steps Using Claude’s Model Context Protocol (MCP) with External Tools"
description: "The article outlines the Model Context Protocol (MCP) developed by Anthropic, which allows Claude Desktop to securely interact with external tools like GitHub and Brave Search. It details a step-by-step tutorial for integrating MCP, emphasizing secure data access, extensibility, and a standardized protocol. Key features include connecting to various services such as Google Drive and Slack, enabling enhanced functionality for tasks like file management and database querying. Troubleshooting tips are also provided to ensure successful implementation."
date: 2024-12-26T04:30:18Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*kE_qjVInCTckUW4TqMqUEw.jpeg"
categories: ["Programming", "Technology", "Security"]
author: "Rifx.Online"
tags: ["MCP", "Claude", "GitHub", "Brave", "Slack"]
draft: False

---





### Enhance Claude Desktop’s Capabilities by Integrating GitHub and Brave Search via MCP



The [**Model Context Protocol (MCP)**](https://www.anthropic.com/news/model-context-protocol) is an open standard developed by Anthropic that enables AI models like Claude to securely interact with various data sources and tools.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*nXwRfi_2Sj3NK8P46YcGJw.png)

By setting up MCP servers, you can extend Claude’s capabilities to access local files, databases, and external services such as GitHub and Slack. This integration enhances Claude’s functionality, allowing it to perform tasks like querying databases, managing files, and interacting with web services directly from your desktop environment.

**Key Features of Claude MCP:**

* **Secure Data Access:** MCP ensures that AI models access data securely, maintaining user control over what information is shared.
* **Extensibility:** Developers can create custom MCP servers to connect Claude with various data sources and services.
* **Standardized Protocol:** MCP provides a unified protocol for integrating different resources, simplifying the development process.

**Getting Started with Claude MCP: A Step\-by\-Step Tutorial**

To leverage Claude’s enhanced capabilities through MCP, follow these steps:


## 1\. Download Claude Desktop

<https://claude.ai/download>


## 2\. Create the config.json

Execute the following Commands:


```python
open ~/Library/Application\ Support/Claude

touch ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

## 3\. Available MCP servers

Here are the list of available MCP servers

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*4ykbUagOrtn4IJaVOMj2Pw.png)


## 🌟 Featured Servers

* [Filesystem](https://github.com/modelcontextprotocol/servers/blob/main/src/filesystem) — Secure file operations with configurable access controls
* [GitHub](https://github.com/modelcontextprotocol/servers/blob/main/src/github) — Repository management, file operations, and GitHub API integration
* [GitLab](https://github.com/modelcontextprotocol/servers/blob/main/src/gitlab) — GitLab API, enabling project management
* [Git](https://github.com/modelcontextprotocol/servers/blob/main/src/git) — Tools to read, search, and manipulate Git repositories
* [Google Drive](https://github.com/modelcontextprotocol/servers/blob/main/src/gdrive) — File access and search capabilities for Google Drive
* [PostgreSQL](https://github.com/modelcontextprotocol/servers/blob/main/src/postgres) — Read\-only database access with schema inspection
* [Sqlite](https://github.com/modelcontextprotocol/servers/blob/main/src/sqlite) — Database interaction and business intelligence capabilities
* [Slack](https://github.com/modelcontextprotocol/servers/blob/main/src/slack) — Channel management and messaging capabilities
* [Sentry](https://github.com/modelcontextprotocol/servers/blob/main/src/sentry) — Retrieving and analyzing issues from Sentry.io
* [Memory](https://github.com/modelcontextprotocol/servers/blob/main/src/memory) — Knowledge graph\-based persistent memory system
* [Puppeteer](https://github.com/modelcontextprotocol/servers/blob/main/src/puppeteer) — Browser automation and web scraping
* [Brave Search](https://github.com/modelcontextprotocol/servers/blob/main/src/brave-search) — Web and local search using Brave’s Search API
* [Google Maps](https://github.com/modelcontextprotocol/servers/blob/main/src/google-maps) — Location services, directions, and place details
* [Fetch](https://github.com/modelcontextprotocol/servers/blob/main/src/fetch) — Web content fetching and conversion for efficient LLM usage


## 4\. Update claude\_desktop\_config.json

Grab the Brave Search or GitHub MCP basd on your needs.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*rGxXQO6NB2wXBeAOHuGQKQ.png)

Update the Config (this example shows it for GitHub)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*6qi-DCeUlNkXB3CIhVAGUw.png)

* GitHub MCP — <https://github.com/modelcontextprotocol/servers/tree/main/src/github>
* Brave MCP: [https://github.com/modelcontextprotocol/servers/tree/main/src/brave\-search](https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search)


## 5\. Restart Claude Desktop

After saving the configuration file, restart Claude Desktop to apply the changes.

**Open Claude Desktop:** Start a new conversation and verify the MCP tools show.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*N1r_XoaZ4iwBfkS1txidlQ.png)

**Test MCP Server:** Ask Claude to perform an action related to the configured MCP server, such as listing the current Bitcoin price that entails web search.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*rPM3W4jPlv7Zb7Eczem2OA.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ua84sZI_Bd6R9vFG8ixBKw.png)

If configured correctly, Claude should interact seamlessly with the specified resources.


## 6\. Troubleshooting Tips

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*f2g7pMR7fN8rtk4t)

Check that node is installed:


```python
node - version
```
If not installed, download from <https://nodejs.org/>


```python
brew update
brew install node
bode -v
```
**Further tips**

* **Check Server Status:** Ensure the MCP server is running and accessible.
* **Verify Environment Variables:** Confirm that all necessary environment variables are correctly set in the configuration file.
* **Review Logs:** Check Claude Desktop logs for error messages to identify issues.

By following this tutorial, you can enhance Claude’s capabilities, allowing it to interact with various data sources and tools through the Model Context Protocol.

For a visual demonstration of setting up MCP with Claude Desktop, you might find this video helpful:







Hello and welcome! **Thrilled** you’re here. We share insights on D**ata, AI, Tech trends, and the Future**. Thank you for being a part of this community!

🙏 **Before you go:**If you found value in this post, please **clap** and **follow** to stay updated! 👏

Discover more at: [**DemoHub.dev**](https://demohub.dev/)(Modern Data Tools) **\& [DaaiC.dev](https://www.daaic.dev/) (**Data Analytics \& AI Conferences), [***YouTube***](https://www.youtube.com/@demohub) ***\&*[LinkedIn](https://www.linkedin.com/company/demohub-dev/)**


