---
title: "使用克劳德模型上下文协议（MCP）和外部工具的 6 个步骤"
meta_title: "使用克劳德模型上下文协议（MCP）和外部工具的 6 个步骤"
description: "本文介绍了如何通过模型上下文协议（MCP）集成GitHub和Brave Search，以增强Claude桌面的功能。MCP是由Anthropic开发的开放标准，允许AI模型安全地与多种数据源和工具交互。文章提供了详细的步骤，包括下载Claude桌面版、创建配置文件、选择MCP服务器、更新配置、重启应用程序以及故障排除提示，旨在帮助用户有效地利用Claude的增强功能。"
date: 2024-12-26T01:00:56Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*kE_qjVInCTckUW4TqMqUEw.jpeg"
categories: ["Programming", "Technology", "Security"]
author: "Rifx.Online"
tags: ["MCP", "Claude", "GitHub", "Brave", "Slack"]
draft: False

---



### 通过MCP集成GitHub和Brave Search来增强Claude桌面的功能



[**模型上下文协议 (MCP)**](https://www.anthropic.com/news/model-context-protocol) 是由Anthropic开发的开放标准，使像Claude这样的AI模型能够安全地与各种数据源和工具进行交互。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*nXwRfi_2Sj3NK8P46YcGJw.png)

通过设置MCP服务器，您可以扩展Claude的功能，以访问本地文件、数据库和外部服务，如GitHub和Slack。这种集成增强了Claude的功能，使其能够直接从桌面环境中执行查询数据库、管理文件和与网络服务交互等任务。

**Claude MCP的主要特点：**

* **安全的数据访问：** MCP确保AI模型安全地访问数据，保持用户对共享信息的控制。
* **可扩展性：** 开发人员可以创建自定义MCP服务器，将Claude与各种数据源和服务连接起来。
* **标准化协议：** MCP提供统一的协议，用于集成不同资源，简化开发过程。

**开始使用Claude MCP：逐步教程**

要通过MCP利用Claude增强的功能，请按照以下步骤操作：

## 1\. 下载 Claude 桌面版

<https://claude.ai/download>

## 2\. 创建 config.json

执行以下命令：

```python
open ~/Library/Application\ Support/Claude

touch ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

## 3\. 可用的 MCP 服务器

以下是可用的 MCP 服务器列表

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*4ykbUagOrtn4IJaVOMj2Pw.png)

## 🌟 精选服务器

* [Filesystem](https://github.com/modelcontextprotocol/servers/blob/main/src/filesystem) — 安全文件操作，具有可配置的访问控制
* [GitHub](https://github.com/modelcontextprotocol/servers/blob/main/src/github) — 仓库管理、文件操作和GitHub API集成
* [GitLab](https://github.com/modelcontextprotocol/servers/blob/main/src/gitlab) — GitLab API，支持项目管理
* [Git](https://github.com/modelcontextprotocol/servers/blob/main/src/git) — 读取、搜索和操作Git仓库的工具
* [Google Drive](https://github.com/modelcontextprotocol/servers/blob/main/src/gdrive) — Google Drive的文件访问和搜索功能
* [PostgreSQL](https://github.com/modelcontextprotocol/servers/blob/main/src/postgres) — 只读数据库访问及模式检查
* [Sqlite](https://github.com/modelcontextprotocol/servers/blob/main/src/sqlite) — 数据库交互和商业智能功能
* [Slack](https://github.com/modelcontextprotocol/servers/blob/main/src/slack) — 渠道管理和消息功能
* [Sentry](https://github.com/modelcontextprotocol/servers/blob/main/src/sentry) — 从Sentry.io检索和分析问题
* [Memory](https://github.com/modelcontextprotocol/servers/blob/main/src/memory) — 基于知识图谱的持久内存系统
* [Puppeteer](https://github.com/modelcontextprotocol/servers/blob/main/src/puppeteer) — 浏览器自动化和网页抓取
* [Brave Search](https://github.com/modelcontextprotocol/servers/blob/main/src/brave-search) — 使用Brave的搜索API进行网页和本地搜索
* [Google Maps](https://github.com/modelcontextprotocol/servers/blob/main/src/google-maps) — 位置服务、路线和地点详情
* [Fetch](https://github.com/modelcontextprotocol/servers/blob/main/src/fetch) — 网页内容获取和转换，以提高LLM使用效率

## 4\. 更新 claude\_desktop\_config.json

根据您的需求获取 Brave Search 或 GitHub MCP。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*rGxXQO6NB2wXBeAOHuGQKQ.png)

更新配置（此示例展示了 GitHub 的配置）

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*6qi-DCeUlNkXB3CIhVAGUw.png)

* GitHub MCP — <https://github.com/modelcontextprotocol/servers/tree/main/src/github>
* Brave MCP: [https://github.com/modelcontextprotocol/servers/tree/main/src/brave\-search](https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search)

## 5\. 重启 Claude Desktop

保存配置文件后，重启 Claude Desktop 以应用更改。

**打开 Claude Desktop：** 开始一个新对话并验证 MCP 工具是否显示。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*N1r_XoaZ4iwBfkS1txidlQ.png)

**测试 MCP 服务器：** 让 Claude 执行与配置的 MCP 服务器相关的操作，例如列出当前的比特币价格，这需要进行网络搜索。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*rPM3W4jPlv7Zb7Eczem2OA.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ua84sZI_Bd6R9vFG8ixBKw.png)

如果配置正确，Claude 应该能够与指定资源无缝互动。

## 6\. 故障排除提示

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*f2g7pMR7fN8rtk4t)

检查是否已安装 node：


```python
node - version
```
如果未安装，请从 <https://nodejs.org/> 下载


```python
brew update
brew install node
bode -v
```
**进一步提示**

* **检查服务器状态：** 确保 MCP 服务器正在运行且可访问。
* **验证环境变量：** 确认所有必要的环境变量在配置文件中正确设置。
* **查看日志：** 检查 Claude Desktop 日志中的错误消息以识别问题。

通过遵循本教程，您可以增强 Claude 的能力，使其能够通过模型上下文协议与各种数据源和工具进行交互。

有关如何使用 Claude Desktop 设置 MCP 的视觉演示，您可能会发现这个视频很有帮助：







你好，欢迎您！**很高兴**您在这里。我们分享关于 D**ata、AI、科技趋势和未来**的见解。感谢您成为这个社区的一部分！

🙏 **在您离开之前：** 如果您觉得这篇文章有价值，请**点赞**并**关注**以保持更新！👏

了解更多信息，请访问：[**DemoHub.dev**](https://demohub.dev/)(现代数据工具) **\& [DaaiC.dev](https://www.daaic.dev/) (**数据分析 \& AI 会议)， [***YouTube***](https://www.youtube.com/@demohub) ***\&*[LinkedIn](https://www.linkedin.com/company/demohub-dev/)**

