---
title: "如何在克劳德桌面应用程序上使用 MCP 工具并自动执行日常任务"
meta_title: "如何在克劳德桌面应用程序上使用 MCP 工具并自动执行日常任务"
description: "
MCP（Model Context Protocol）是一种标准，用于在AI助手和数据源之间建立安全连接。本文介绍了如何在Claude桌面应用程序中安装和使用MCP工具，包括下载Claude Desktop、创建配置文件、安装Brave Search MCP工具以及重新启动应用。通过实际示例，展示了如何使用Brave Search MCP工具进行互联网搜索，获取实时信息。此外，还推荐了其他MCP服务器，如Filesystem、GitHub、Sqlite和Google Maps，以进一步提高生产力。"
date: 2024-12-12T01:42:20Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*xwgCp53z6_uUj-NMJaTIcw.png"
categories: ["Programming", "Technology/Web", "Chatbots"]
author: "Rifx.Online"
tags: ["MCP", "Brave", "Search", "Configuration", "Integration"]
draft: False

---



**Model Context Protocol** (**MCP**) 是一种新的标准，用于在 AI 助手（如 **Claude**）和数据所在系统之间建立安全连接。这包括 **代码仓库**（Github, Gitlab）、**API**（Google Maps, Youtube, Brave）、**业务工具**（Slack, Notion, Bluesky）甚至您自己计算机上的 **本地开发环境**。

在本指南中，我将用简单的语言解释 **MCP 是什么以及它是如何工作的**，以便您轻松理解其结构。然后，我将向您展示 **如何在 Claude 桌面应用程序中逐步安装 MCP**，使您能够立即开始使用。最后，我们将通过一个 **实际示例** 来说明 MCP 如何简化和加速您的日常任务。

## MCP 工作原理

模型上下文协议（MCP）基于客户端-主机-服务器架构运行，使 AI 应用能够无缝连接到各种数据源和工具。以下是其组件的概述：

* **MCP 主机**：使用 MCP 与各种资源进行交互的应用程序，例如 Claude Desktop、开发环境或 AI 工具。
* **MCP 客户端**：主机中的组件，与特定服务器建立直接的一对一连接。
* **MCP 服务器**：通过 MCP 框架提供特定功能的小程序。
* **本地资源**：您计算机上的资源，如文件、数据库或服务，MCP 服务器可以安全地检索和管理这些资源。
* **远程资源**：外部在线资源，如 API 或基于云的服务，MCP 服务器可以连接这些资源以获取数据或功能。



## 如何在 Claude 桌面应用中使用 MCP 工具

### 第 1 步：下载并安装 Claude Desktop

1. 访问 Claude 网站并下载 [Claude Desktop App for Mac](https://claude.ai/download)。
2. 按照安装说明在您的计算机上设置它。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*w0u5DexT6dGsf8QSVmhSLA.png)

### 步骤 2：创建配置文件

1. 在您的 Mac 上打开 **终端** 应用程序。
2. 通过运行以下命令导航到 Claude 配置目录：


```python
open ~/Library/Application\ Support/Claude
```
3\. 通过输入以下命令为 MCP 创建一个新的配置文件：


```python
touch ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

### 第 3 步：安装 Brave Search MCP 工具

在这个简单的教程中，我们将使用 Brave MCP 工具，这将允许 Claude 桌面应用程序在网页上进行搜索。

1. 打开终端并运行以下命令：


```python
npm install -g @modelcontextprotocol/server-brave-search
```

2. 在他们的 [网站](https://brave.com/search/api/) 上注册以获取一个 Brave API 密钥。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*dxPqa39E7JjcsSzatli3Eg.png)

3. 选择一个计划（免费层每月提供 2,000 次查询）

4. 从 [开发者仪表板](https://api.search.brave.com/app/keys) 生成您的 API 密钥并复制新的 API 密钥。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*GDlSBLQJBaMADpsBPYXDBA.png)

5. 使用您喜欢的文本编辑器打开新创建的 claude\_desktop\_config.json 文件，并添加以下内容。不要忘记在 “BRAVE\_API\_KEY” 字段中添加 Brave API 密钥。


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

### 第 4 步：重新启动 Claude 桌面应用

1. 关闭 Claude 应用并重新打开它。
2. 在应用的右侧，确认出现了两个新的工具（如下图中的红色圆圈所示），这些工具用于使用 Brave Search MCP 工具进行互联网搜索。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*uKd0icy3Cr9giBTgYj6vyw.png)

### 第 6 步：尝试一下！

我将向 Claude 提供两个提示，第一个是 **“比特币的当前价格是多少？”**

Claude 在每次对话开始时都会提示使用工具的权限。因此，您可以点击允许，如下图所示。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*9taY7NF6c4RGyzsNdceaDg.png)

之后，您可以看到 Claude 使用了 **brave\_web\_search** 工具从 Brave MCP 服务器获取信息，并提供来自网络的数据。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*kq5I1uVDuz0n5a0iaXXpUQ.png)

我进行了快速研究，以确认 Claude 的回答是否正确，结果表明价格相差 $98，基本正确。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Jm1NnMUqadBAxDv8MwIvfA.png)

在第二个例子中，我让 Claude 概述了曼联的最新比赛。Claude 进行了两次网络搜索：首先找到最近的比赛，然后获取比赛详情。我写这篇文章的当天是 2024 年 12 月 8 日，我们可以确认提供的信息是正确的，不幸的是，曼联输了 ;(

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Wg5dmtzLvgWbKJy48u7QFQ.png)

像 Brave Search 这样的 MCP 工具使 Claude 桌面应用程序可以轻松将 AI 集成到您的日常工作中。从查找实时信息到自动化任务，MCP 简化了一切。尝试探索其他 [**MCP 服务器**](https://github.com/modelcontextprotocol/servers)，看看它们如何进一步提高您的生产力！

我建议以下几种：

* **Filesystem** — 具有可配置访问控制的安全文件操作
* **GitHub** — 仓库管理、文件操作和 GitHub API 集成
* **Sqlite** — 数据库交互和商业智能功能
* **Google Maps** — 位置服务、路线和地点详情

## 参考资料

[https://docs.anthropic.com/en/docs/build\-with\-claude/computer\-use](https://docs.anthropic.com/en/docs/build-with-claude/computer-use)[https://www.anthropic.com/news/model\-context\-protocol](https://www.anthropic.com/news/model-context-protocol)<https://modelcontextprotocol.io/quickstart><https://github.com/modelcontextprotocol/servers>

