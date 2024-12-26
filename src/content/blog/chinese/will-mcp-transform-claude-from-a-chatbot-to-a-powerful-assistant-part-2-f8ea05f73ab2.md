---
title: "克劳德 MCP 是真正的代理时代的开端吗？第二部分"
meta_title: "克劳德 MCP 是真正的代理时代的开端吗？第二部分"
description: "本文讨论了 Claude MCP 的应用实例，展示了其作为强大助手的潜力。通过使用 Puppeteer MCP 和文件系统 MCP，用户可以从指定 URL 生成摘要并保存结果。文章详细介绍了在 Mac 上设置和运行的步骤，强调了其无需额外软件安装、快速响应和透明交互的优点。初步测试结果显示，该工具在执行摘要生成时表现出色，展示了代理时代的开端。"
date: 2024-12-26T04:30:18Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*9xbeqdlVANQ1DgeHggTzJQ.png"
categories: ["Programming", "Technology/Web", "Chatbots"]
author: "Rifx.Online"
tags: ["Claude", "Puppeteer", "summarizer", "filesystem", "MCP"]
draft: False

---

在之前的博客文章中，我谈到了 MCP 以及它如何使 Claude 不仅仅是一个聊天机器人，而是一个真正强大的助手，可以与您的本地应用程序进行交互，例如文件系统、Google Drive、您的电子邮件程序等。

让我们将理论付诸实践，测试快速摘要工具，它可以从任何给定的 URL 生成摘要。

在本演示中，摘要工具在 `localhost:3009` 本地运行。我们将使用 Puppeteer MCP 导航到 API 测试界面，输入一个 URL，触发摘要生成，然后使用文件系统 MCP 保存结果。

这个简单的例子展示了更广泛的 UI 测试应用的潜力。


## 在 Mac 上逐步运行（Windows 上类似）

1. 下载 Claude for Desktop [https://claude.ai/download](https://claude.ai/download) 并登录。
2. 转到 **文件 \-\> 设置 \-\> 编辑配置**（这基本上是 MCP 配置，您保存所有希望使用的 MCP 服务器的位置）。

可以在这里找到一个可以开始使用的 MCP 服务器列表：[https://github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)



复制并粘贴以下内容以添加 Puppeteer MCP：

```python
{
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
    },
    "filesystem": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "--mount", "type=bind,src=/tmp/,dst=/projects/Desktop",
        "mcp/filesystem",
        "/projects"
      ]
    }
  }
}
```

> 注意：您需要根据实际应用调整挂载配置。目前，我们使用的是 `/tmp/`，这意味着在 MCP 服务器的 Docker 沙盒内写入到 `/projects/Desktop` 的任何内容将出现在您系统的 `/tmp/` 目录中。

1. 重启 Claude。

现在，点击聊天窗口右下角的图标将显示当前加载的工具列表。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*DnNLsnMNv1QTtHHBEkK2tA.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*5Ee0Q8wOXYfp_6gZ8Y4ung.png)

这是我的提示：

```python
Open localhost:3009
and let the service summarize this blog post
and make a screenshot
https://medium.com/@airabbitX/protecting-your-email-online-all-you-need-to-know-a693cd11ea79
```

让魔法开始吧……

它成功地在指定的 URL 打开了应用程序（在稍微修正后添加了 `/docs` 到地址）。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*DrvC1F8NfBnkW9RajF4pbg.png)

它定位并点击了“试试”按钮。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*9Ma8eGnnmy5nyfxKbg63qQ.png)

然后它输入了 URL 并点击 **执行**。然而，用户界面似乎没有注册输入。无论如何，让我们继续。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*JW4AMk_j-R473-QHZjHaGg.png)

现在我们得到了初始 URL [**www.example.com**.](http://www.example.com.)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*fcjERG_RAKb8aMcGd9htLQ.png)

最初，它没有检测到摘要已完成。然而，在提示它滚动后，Claude 识别了摘要并成功地按预期保存到文件中。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Tjy636f404UPly83YrfTwQ.png)

我通过检查运行 MCP 服务器的 Docker 容器确认了这一点。或者，您也可以在指定的挂载文件夹中验证。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*DHgiST5o9mJe4buInF5VNg.png)

— \-

## 评估

这个初始测试相当令人印象深刻：

* 不需要额外的软件安装。
* 与计算机使用不同，无需手动启动 Docker 容器或 Streamlit。
* MCP 配置和连接开箱即用，Claude 与它们的交互是透明的（您可以在聊天窗口中跟踪与每个 MCP 服务器的整个对话）。
* 由于采用基于 API 的方法，而不是依赖点击交互，它的运行速度明显快于计算机使用。


