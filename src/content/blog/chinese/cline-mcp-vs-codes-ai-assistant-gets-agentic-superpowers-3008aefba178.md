---
title: "🔌 Cline + MCP：VS Code 的人工智能助手获得代理超能力"
meta_title: "🔌 Cline + MCP：VS Code 的人工智能助手获得代理超能力"
description: "Cline MCP VS Code的AI助手通过模型上下文协议（MCP）集成，获得了代理超能力，能够自动检查问题、部署修复和管理开发工作流程。该助手支持文件管理、终端命令执行和浏览器自动化，提升了开发效率。用户可通过配置自主性设置操作权限，并使用智能上下文理解功能来优化代码分析和错误监控。Cline还允许开发者创建自定义工具，支持多种开发和云基础设施集成，欢迎社区贡献以推动开源项目的发展。"
date: 2024-12-26T04:30:18Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*_wqPDeIpD2BXhfxL"
categories: ["Programming", "Technology/Web", "Data Science"]
author: "Rifx.Online"
tags: ["Cline", "MCP", "VSCode", "terminal", "autonomy"]
draft: False

---





“嘿，Cline，你能检查一下我们在 CI 中测试失败的原因吗？”到目前为止，AI 编码助手只能分析您手动共享的代码。但通过 Cline 最新的模型上下文协议（MCP）集成，您的 AI 助手现在可以调查问题、部署修复，并管理您整个开发工作流程——这一切都可以在 VS Code 中完成。

> “多亏了 Claude 3\.5 Sonnet 的代理编码能力，Cline 可以逐步处理复杂的软件开发任务。借助能够创建和编辑文件、探索大型项目、使用浏览器以及执行终端命令（在您授权后）的工具，他可以以超越代码补全或技术支持的方式帮助您。”

## 快速开始 (2分钟) ⚡️

**安装 Cline —** 打开 VS Code，然后：

1. 按 Ctrl\+P/Cmd\+P
2. 输入：ext install saoudrizwan.claude\-dev  
\# 或在 VS Code 市场中搜索“Cline”

提示：输入 `CMD/CTRL + Shift + P` 并搜索 "Cline: Open In New Tab" 以便与文件资源管理器并排使用 Cline。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Sbsp4CfhU3eiN16yAXuUSg.png)

## Cline \+ MCP 有什么特别之处？🤔

### Terminal\-First Design

* 适用于任何开发环境
* 存在于您已经工作的地方
* 与您现有工具的无缝集成

### 智能上下文理解

* 自动查找并读取相关文件
* 分析您的代码库结构
* 实时监控编译器/静态分析工具错误

### 真正的代理能力

* 在您的终端中运行命令（需获得您的许可）
* 创建和编辑文件并提供即时反馈
* 使用浏览器自动化进行测试和调试
* 按需创建自定义工具

以下是它们之间的连接方式：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*mLfR-N14V3LRRxiL6CYXUg.png)

## 最新强大功能 🎯

### 自动批准：更快工作，保持控制

*Cline 现在提供可配置的自主性，配备新的自动批准菜单。*

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*jzoembJ55lgYeHh4)

➡️ ️️选择 Cline 可以在没有干扰的情况下执行哪些操作：

1. 读取文件和目录
2. 编辑文件
3. 执行终端命令
4. 浏览器自动化
5. MCP 服务器使用

➡️ 在需要批准之前设置 API 请求限制

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*c7k-JtTOFYZ_591C)

➡️ ️️️️当 Cline 需要关注或完成任务时接收系统通知

## 更智能的文件处理

* 针对大文件的新差异编辑
* 在适当时回退到完整文件编辑

### 项目级智能

在项目根目录添加一个 `.clinerules` 文件以：

* 定义自定义项目行为
* 设置编码规范
* 解释架构模式

## 现实世界的能力 💪

### 1\. 智能文件管理


```python
You: "Add OAuth authentication to our Express app"
Cline: Let me check your project structure...
*Analyzes files using AST and regex search*
*Creates/modifies necessary files*
*Monitors for linter/compiler errors*
*Proactively fixes issues like missing imports*
```

### 2\. 终端集成


```python
You: "Set up a dev environment for this project"
Cline: I'll install the dependencies and start the dev server.
*Executes npm install*
*Starts dev server*
*Monitors for issues in real-time*
```

### 3\. 浏览器测试


```python
You: "Test if the login flow works"
Cline: I'll check it in the browser.
*Launches dev server*
*Opens browser*
*Tests functionality*
*Captures screenshots and console logs*
```

## Cline的力量

### 1\. 自定义 MCP 工具

只需说“添加一个工具，它可以……”Cline 就会创建它：

* “…获取 Jira 工单”
* “…管理 AWS EC2”
* “…提取 PagerDuty 事件”

所有工具都保存在 `~/Documents/Cline/MCP` 以便于共享。

### 2\. 智能上下文添加

输入这些快捷键以加快您的工作流程：

* `@url`: 粘贴一个 URL 以进行即时文档转换
* `@problems`: 添加工作区错误以供 Cline 修复
* `@file`: 添加文件内容（带搜索功能）
* `@folder`: 一次性添加整个文件夹

### 3\. 完整项目理解

Cline 使用以下方法分析您的代码库：

* 文件结构分析
* 源代码 AST 解析
* 基于正则表达式的代码搜索
* 实时错误监控

## 对开发者最有价值的MCP工具 🛠️

### 开发工具

* GitHub/GitLab：完整的代码库管理
* 文件系统集成：直接文件编辑控制
* Docker/Kubernetes：容器编排
* PostgreSQL/MongoDB：数据库操作

### 云 \& 基础设施

* AWS 工具: EC2, Lambda 管理
* Cloudflare: 服务部署
* Azure/GCP: 云平台集成
* Brave Search: 网络/API 文档搜索

### 团队与项目工具

* Jira/Linear: 任务管理
* Slack: 团队沟通
* PagerDuty: 事件管理
* Sentry: 错误追踪

## 配置指南 ⚙️

1. 点击新服务器图标以配置 MCP
2. 基本设置示例：


```python
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```

## 提高生产力的专业技巧 🎯

1. 长时间运行的任务：使用“在运行时继续”处理后台进程
2. 视觉反馈：在应用更改之前查看文件差异
3. 浏览器测试：让 Cline 捕获屏幕截图和控制台日志
4. 上下文管理：使用 `@` 命令快速添加相关信息

## 准备好尝试一下了吗？🚀

1. 从 [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev) 安装 Cline
2. 使用 `CMD/CTRL + Shift + P` 在新标签页中打开，并搜索 "Cline: Open In New Tab"
3. 使用“添加一个工具…”创建你的第一个自定义工具

## 为未来贡献

作为一个开源项目，Cline 欢迎开发者社区的贡献：

* 探索 [GitHub 仓库](https://github.com/cline/cline)
* 查看现有的拉取请求以获取灵感
* 创建您自己的功能
* 分享您的自定义 MCP 工具
* 帮助塑造 AI 辅助开发的未来

准备好提升您的开发工作流程了吗？今天就 [安装 Cline](https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev)，体验智能 AI 开发的强大。

*标签： \#VSCode \#Development \#AI \#MCP \#OpenSource \#DevTools*

