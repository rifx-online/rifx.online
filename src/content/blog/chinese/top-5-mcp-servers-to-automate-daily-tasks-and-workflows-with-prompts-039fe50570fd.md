---
title: "利用提示自动执行日常任务和工作流程的 5 大 MCP 服务器"
meta_title: "利用提示自动执行日常任务和工作流程的 5 大 MCP 服务器"
description: "本文介绍了五个最有用的Model Context Protocol (MCP)服务器，旨在通过自动化日常任务和工作流程提升生产力。包括文件管理、团队沟通、代码库管理、基于位置的自动化和社交媒体工作流。每个MCP服务器都提供了具体的设置步骤和实用提示，帮助用户高效利用Claude进行任务自动化。这些工具适合开发者、团队经理及任何希望简化日常事务的用户。"
date: 2024-12-19T21:23:28Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*0Xn_PSA3g0O7DdCeI93ZGw.png"
categories: ["Programming", "Technology", "Chatbots"]
author: "Rifx.Online"
tags: ["Model", "Context", "Protocol", "Claude", "Servers"]
draft: False

---



自从 Anthropic 将 **Model Context Protocol (MCP)** 引入 Claude 以来，它彻底改变了我们自动化重复任务的方式。从文件管理到社交媒体工作流程，**MCP 服务器** 让您能够将 **Claude** 连接到强大的工具，如 **GitHub**、**Slack** 和 **Google Maps**。这些集成帮助您节省时间、简化工作流程，专注于最重要的事情。

在本文中，我将分享您可以使用的 **前 5 个 MCP 服务器**，以通过实用的提示和示例 **提升生产力**。无论您是想管理文件、自动化团队沟通，还是简化基于位置的任务，这里都有适合每个人的内容。

以下是我发现的五个最有帮助的 MCP 服务器：

1. **文件系统 MCP 服务器** 用于自动化文件管理
2. **Slack MCP 服务器** 用于自动化团队沟通
3. **GitHub MCP 服务器** 用于管理仓库和问题
4. **Google Maps MCP 服务器** 用于基于位置的自动化
5. **Bluesky MCP 服务器** 用于社交媒体工作流程自动化



在阅读本文之前，我建议您了解并理解 MCP 是什么以及它如何工作，您可以查看我 [最近发布的文章](https://medium.com/@pedro.aquino.se/how-to-use-mcp-tools-on-claude-desktop-app-and-automate-your-daily-tasks-1c38e22bc4b0)。我将直接进入您可以用来自动化日常任务和工作的前 5 个最佳 MCP 服务器。

## 1\. 文件系统 MCP 服务器用于自动化文件管理

该 MCP 服务器提供对本地文件系统的直接访问，并具有细粒度的权限。这非常适合自动化文件管理任务，例如组织目录或安全备份数据。

此 MCP 服务器的一些功能包括：读/写文件，创建/列出/删除目录，移动文件/目录，搜索文件。

要启用此服务器，请将以下内容添加到您的 `claude_desktop_config.json` 中。仅授予您希望 Claude 管理的目录的访问权限。

```python
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/you_username/Desktop",
        "/Users/you_username/Downloads"
      ]
    }
  }
}
```
如果您的下载文件夹很乱，请问 Claude: *“你能通过创建一个名为‘Images’的新文件夹来整理下载目录，并根据文件类型将所有图像文件移动到各自的文件夹中吗？例如：将 .jpg、.png 和 .gif 移动到‘Images’。”*

Claude 将创建目录并移动文件。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*2li7nnMuj_mLIVOoNfdlaQ.png)

Claude 将在下载文件夹内创建“Images”目录，并将所有图像文件逐个移动到该目录中。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*EPqRSM5ik9EIDL5M6GxvJg.png)

### 其他有用的提示：

* *“你能将桌面目录中的所有文件备份到名为‘Backup’的ExternalDrive目录中吗？”*
* *“你能删除下载目录中在过去30天内未被访问的所有文件吗？”*
* *“你能通过在文件名前添加今天的日期来重命名照片目录中的所有图像吗？”*

## 2\. Slack MCP 服务器用于自动化团队沟通

通过 Slack MCP 服务器，您可以自动化沟通工作流程，管理频道，发送消息，并简化协作。它非常适合减少手动任务，并保持实时通知的更新。

要设置 Slack MCP 服务器：

1. 在浏览器中打开 [Slack Apps](https://api.slack.com/apps)。
2. 在列表中找到您创建的应用，或者如果您还没有创建，点击 **“Create New App”**。
3. 在应用的设置页面，点击左侧菜单中的 **“OAuth \& Permissions”**。向下滚动到 **“Bot Token Scopes”** 部分，添加以下范围：**channels:history**、**channels:read**、**chat:write.public**、**reactions:write** 和 **users:read**。
4. 向上滚动到 **“OAuth Tokens”**，点击“Install to Workspace”，并授权该应用。
5. 保存以 `xoxb-` 开头的“Bot User OAuth Token”。
6. 按照 [此指南](https://slack.com/help/articles/221769328-Locate-your-Slack-URL-or-ID#find-your-workspace-or-org-id) 获取您的团队 ID（以 `T` 开头）。

在获取必要的令牌后，要启用此 MCP 服务器，您需要在 `claude_desktop_config.json` 中添加以下条目。确保用您从应用获得的令牌更新字段 SLACK\_BOT\_TOKEN 和 SLACK\_TEAM\_ID。


```python
{
  "mcpServers": {
    "slack": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-slack"
      ],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-bot-token",
        "SLACK_TEAM_ID": "T01234567"
      }
    }
  }
}
```
之后，我们可以通过询问 *“你能列出 Slack 工作区中的所有频道并告诉我有多少个频道吗？”* 来测试它是否正常工作。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*b39v6S5Es2oIjY-MbTz2yw.png)

### 其他有用的提示：

* *“你能总结一下 \#team\-discussions 频道中最近的 20 条消息吗？”*
* *“你能获取 \#project\-updates 频道中时间戳为 `1678967890.123456` 的消息的所有回复吗？”*
* *“你能列出工作区中所有用户及其姓名和 ID 吗？”*
* *“你能在 \#general 频道发布一条消息，内容是‘团队会议在主会议室下午 3 点开始。’吗？”*
* *“你能回复 \#questions 频道中时间戳为 `1678967890.123456` 的线程，内容是‘我会查看这个问题并尽快回复你。’吗？”*

## 3\. GitHub MCP 服务器用于管理代码库和问题

GitHub MCP 服务器将 Claude 与 GitHub 集成，自动化代码库管理、文件更新和开发工作流程。它对于重复性任务如创建代码库、管理问题或搜索代码来说，是一个救星。

要启用此服务器：

1. 打开终端并安装服务器


```python
npm install -g @modelcontextprotocol/server-github
```
2\. 通过访问 [这里](https://github.com/settings/tokens) 生成 GitHub 个人访问令牌。

3\. 点击 **生成新令牌**，选择所有 **repo** 范围并复制生成的令牌。

将以下内容添加到您的 `claude_desktop_config.json` 文件中：


```python
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```
为了测试 GitHub MCP 服务器，我们将提供一个提示，创建一个 GitHub 上的代码库，推送代码，创建问题，创建分支和拉取请求。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*3Lgv3whfu8naQ9yjd_sXSA.png)

这真是太酷了，Claude 仅通过提示就创建了一个完整的简单项目并直接推送到 GitHub！想象一下，仅通过提示 Claude 来修复错误或添加新功能。

### 其他有用的提示：

* *“你能搜索与‘开源 AI 项目’相关的代码库吗？”*
* *“你能列出我‘MyRepo’代码库中的所有未解决问题吗？”*

## 4\. Google Maps MCP 服务器用于基于位置的自动化

该 MCP 服务器与 Google Maps API 集成，使您能够执行地理编码地址、查找附近地点和计算位置之间距离等任务。它非常适合自动化基于位置的工作流程并获取详细的地点信息。

要启用此服务器：

1. 按照 [这里](https://developers.google.com/maps/documentation/javascript/get-api-key#create-api-keys) 的说明获取 Google Maps API 密钥。
2. 将以下内容添加到您的 `claude_desktop_config.json` 文件中：

```python
{
  "mcpServers": {
    "google-maps": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-google-maps"
      ],
      "env": {
        "GOOGLE_MAPS_API_KEY": "<YOUR_API_KEY>"
      }
    }
  }
}
```
为了测试，我们可以询问 Claude 关于特朗普大厦附近的便宜餐厅，我们收到了非常有用的回复。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*8w9toV9NkfmWjFVgfgcalQ.png)

### 其他有用的提示：

* *“你能提供从‘巴黎埃菲尔铁塔’到‘巴黎卢浮宫’的步行路线吗？”*
* *“你能计算以下起点之间的驾驶距离和时长：\[‘纽约, NY’, ‘波士顿, MA’] 和以下目的地：\[‘费城, PA’, ‘华盛顿, DC’]吗？”*
* *“你能列出在特拉法加广场10公里半径内的所有理发店吗？”*

## 5\. Bluesky MCP 服务器用于社交媒体工作流自动化

该服务器提供访问个人资料信息、检索帖子、搜索内容和管理关注者的工具，所有这些都可以通过像 Claude Desktop 这样的 MCP 支持平台方便地进行。

凭借个性化的信息流检索、个人资料搜索和帖子互动等功能，Bluesky MCP 服务器非常适合自动化社交媒体工作流、监控活动和增强用户在 Bluesky 上的参与度。

1. 克隆仓库并安装依赖

```python
git clone https://github.com/keturiosakys/bluesky-context-server.git
cd bluesky-context-server
bun install

```
3\. 登录 [**Bluesky**](https://bsky.app.)，导航到 **设置** \> **隐私和安全** \> **应用密码**，生成一个新的应用密码并复制它。

4\. 将以下配置添加到 `claude_desktop_config.json` 中，别忘了在 BLUESKY\_APP\_KEY 字段中添加应用密码，在 BLUESKY\_IDENTIFIER 字段中添加您的电子邮件。

```python
{
  "mcpServers": {
    "bluesky": {
      "command": "/Users/yourusername/.bun/bin/bun",
      "args": [
        "/path/to/bluesky-context-server/index.ts"
      ],
      "env": {
        "BLUESKY_APP_KEY": "xxxx-xxxx-xxxx-xxxx",
        "BLUESKY_IDENTIFIER": "<your_blue_sky_email>"
      }
    }
  }
}
```
现在我们可以通过提供一些问题来进行测试，如下所示：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*pYMSsEY1epKALzUyEw4URA.png)

### 其他有用的提示：

* *“你能获取 @creator.bsky.social 的最后 20 条帖子吗？”*
* *“你能搜索包含关键词 ‘fred again’ 的帖子并返回前 25 个结果吗？”*
* *“你能获取 @enthusiast.bsky.social 点赞的最后 20 条帖子吗？”*
* *“你能搜索包含关键词 ‘AI Researcher’ 的个人资料并返回前 25 个结果吗？”*

通过使用这些 MCP 服务器，你可以将 Claude 变成一个不可或缺的工具，用于自动化你的日常任务和工作流程。从使用文件系统 MCP 服务器整理文件到管理社交媒体 Bluesky，可能性是无穷无尽的。

尝试使用提供的提示与这些服务器，体验你可以节省多少时间和精力。无论你是开发者、团队经理，还是只是想简化日常事务的人，MCP 服务器都在这里让你的生活更轻松。

References<https://github.com/modelcontextprotocol/servers>[https://github.com/punkpeye/awesome\-mcp\-servers](https://github.com/punkpeye/awesome-mcp-servers)[https://github.com/wong2/awesome\-mcp\-servers](https://github.com/wong2/awesome-mcp-servers)[https://github.com/appcypher/awesome\-mcp\-servers](https://github.com/appcypher/awesome-mcp-servers)[https://mcp\-get.com/](https://mcp-get.com/)

