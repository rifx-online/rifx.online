---
title: "人类学的 MCP 将让你大开眼界"
meta_title: "人类学的 MCP 将让你大开眼界"
description: "Anthropic的模型上下文协议（MCP）旨在通过连接AI助手与实时数据源，革新AI交互方式。MCP作为一个通用标准，简化了AI与各种工具的连接，使其能够实时获取信息并执行任务，从而增强了AI的实用性和灵活性。通过MCP，用户可以更高效地进行编码、研究和业务自动化，同时也为开发自定义工具提供了可能性。MCP的开源特性有望成为未来AI模型的标准，推动行业发展。"
date: 2024-12-06T00:35:36Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*r557Tlznz5JrARNKO5zNxA.png"
categories: ["Programming", "Technology", "Machine Learning"]
author: "Rifx.Online"
tags: ["MCP", "LLMs", "real-time", "integration", "open-source"]
draft: False

---



相信我，这不是点击诱饵，MCP将彻底改变AI交互的方式

AI技术正在快速发展。

你可能在等待最新的模型，如GPT-5、Gemini 2或Claude 4，但有一件重要的事情需要知道——今天AI的真正力量不仅仅在于拥有最新的模型。

而在于我们如何将这些AI模型与周围的世界连接起来。

在于给予它们正确的工具、数据和上下文，以帮助它们更好地理解。

这就是Anthropic的***模型上下文协议（MCP）***的用武之地。

MCP不仅仅是一次升级，它是一个游戏规则改变者，开启了一种全新的使用和创造AI的方式。

让我来解释一下为什么MCP如此重要，以及它如何可能成为智能AI代理的未来关键。

在开始之前，让我以最简单的方式向你展示MCP是如何工作的。

把它想象成你和你的AI助手之间的智能翻译器：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ILny_S8rVTbJlc3_5ox-Mg.png)

让我们分解一下：

* 你通过Claude桌面（就是我们的MCP主机）提出问题
* AI考虑你的请求
* 如果需要更多信息，它会联系特殊工具（MCP服务器）
* 这些工具获取所需的信息并发送回来
* 最后你得到答案！

不错吧？

现在让我们看看为什么这会是一个游戏规则改变者！

**将AI连接到实时数据**

问题是：

像ChatGPT、Claude等大型语言模型（LLMs）非常聪明，但它们有一个重大限制——它们在某个时间点后停止学习。

想象一下，向你的AI助手询问关于你的业务的最新信息，甚至只是最新的天气，但它无法回答，因为它只学习了一年前的信息。

这真让人沮丧，对吧？

这就是MCP的帮助之处。

MCP像一个通用连接器，通过允许LLMs连接到*实时数据源*来工作。

与其使用旧的、过时的信息，MCP让AI与当前系统进行实时的双向通信。

这就像阅读一本旧百科全书和与刚刚阅读今天新闻并浏览最新更新的人交谈之间的区别。

这就是MCP让AI更强大的原因。

**从多个不同工具到一个统一系统**

在MCP出现之前，如果你想让AI连接到外部工具或系统，你必须为每一个工具构建一个特殊的连接器。

这需要大量的时间和精力，并且维护起来很困难。

模型上下文协议通过为每个人提供一个*通用的、开放的标准*来连接AI助手与任何工具或数据源，改变了这一切。

这使事情变得更加简单和易于扩展。

无论是Slack、GitHub还是像Puppeteer这样的网络抓取工具——所有这些现在都可以以同样简单的方式连接。

想象一下你有一个Claude AI助手。MCP让这个助手通过我们称之为MCP主机的方式连接到不同的服务器（如数据源或工具）。

现在，Claude桌面应用程序充当该主机。但想象一下，如果你还可以直接将其连接到像VS Code这样的代码编辑器。突然间，AI可以像真正的开发人员一样帮助你：创建文件、运行代码、测试，甚至管理项目。

你知道什么是最令人惊叹的吗？

所有这些不同的工具现在都可以通过MCP互相交流！

让我给你展示一下这是什么样子：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*0h61k4uo_Ts2jZWXzZRNcg.png)

看看一切是如何连接的：

* 你的开发工具（如Git和代码编辑器）协同工作
* 你的数据工具（数据库和分析）共享信息
* 甚至你的通信工具（Slack、电子邮件）

就像是你所有喜欢的应用程序终于成为了好朋友！哈哈

**实际使用案例（让日常任务更轻松）**

问题是，这在现实生活中有什么帮助？

让我给你几个例子：

**AI驱动的编码工具**：

想象一下，你是一名使用VS Code的开发人员。你希望AI不仅能建议代码，还能直接与你的环境互动——从GitHub提取代码，在你的计算机上测试，并在你批准后进行更改。

这现在是可能的。通过MCP，AI成为你工作流程中的真正一部分。为Git、GitHub甚至你的文件系统设置MCP服务器，让AI感觉像是你开发团队的一部分。

设置一个Git的MCP服务器可能看起来像这样：

```python
{
  "mcpServers": {
    "git": {
      "command": "uvx",
      "args": ["mcp-server-git", "--repository", "path/to/git/repo"]
    }
  }
}
```

这个设置允许你的Claude助手与Git仓库互动——提取更改、提交代码，甚至运行测试。

**研究和数据分析**：

假设你正在进行研究。通过MCP和像Brave Search这样的搜索API，你的AI助手可以*实时*搜索新文章，挑选出重要部分并进行总结——而你无需在浏览器中输入任何内容。

你还可以设置一个内存服务器来存储所有研究笔记，这样你的AI每次都能记住它找到的内容并在此基础上进行扩展。

以下是如何设置Brave Search服务器的方式：

```python
{
  "mcpServers": {
    "braveSearch": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave"]
    }
  }
}
```

这使得你的助手能够自动执行网络搜索，并在你需要时获取最新信息。

**业务自动化**：

想象一下，在Slack、Google Drive和自定义数据库等工具之间管理多个项目。

通常，你需要在所有这些工具之间切换并手动更新一切。MCP创建了一座桥梁，让你的AI助手能够读取Slack中的消息，从Google Drive提取文件并更新你的数据库，甚至给你提供每日报告。

这不仅仅是一个助手——就像有一个项目经理在为你工作。以下是如何将Google Drive服务器添加到Claude Desktop的方式：

```python
{
  "mcpServers": {
    "googleDrive": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-googledrive"]
    }
  }
}
```

这个设置允许你的助手连接到Google Drive，提取文档，甚至帮助整理你的文件。

**个性化工作流程**：

MCP就像一个DIY工具包，让你的AI助手完全按照你想要的方式工作。

想让它连接到你的Trello板，更新你的购物清单或通过Google Maps或Cloudflare控制你的智能家居？

MCP让所有这些成为可能，而无需复杂的编码。

你可以使用一些Python或TypeScript服务器，将它们插入到你的Claude Desktop应用中，突然间你的AI可以做任何事情，从管理你的杂货到家庭安全。例如，以下是如何设置文件系统服务器，让助手与本地文件一起工作：

```python
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed/files"]
    }
  }
}
```

这意味着你的助手可以直接在你的计算机上读取、写入或修改文件，但仅限于你选择的文件夹。

**如何开始**

准备好自己尝试了吗？

别担心，设置MCP比你想象的要简单！

以下是整个过程的可视化指南：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*MnEHIiy0grhCUfmNAQsR1g.png)

按照以下简单步骤操作：

1. 获取Claude Desktop应用——就像安装其他程序一样
2. 设置你的配置文件——我会准确告诉你如何做
3. 添加你想要的工具——就像在手机上添加应用一样
4. 测试一下——确保一切正常
5. 如果有什么不对，回去调整你的设置

最棒的部分？

你可以从仅仅一两个工具开始，随着需要再添加更多！

你准备好尝试了吗？

以下是如何开始使用模型上下文协议。

首先，你需要安装Claude Desktop应用。这个应用充当主机，或所有MCP工具连接的基地。

该应用可以连接多个MCP服务器，这些服务器就像提供特定数据或操作的小服务。

想让你的Claude助手与Google Drive一起工作？

有一个MCP服务器可以做到这一点。

需要它与GitHub连接吗？那也可以。设置很简单，无论你是新手还是有经验。

最棒的是，Anthropic提供了SDK——无论是Python还是TypeScript——所以你可以自己制作MCP服务器。

无论你喜欢Python还是JavaScript，学习起来都很简单。

一旦你掌握了它，可能性是无穷无尽的。

想象一下，创建一个Python脚本，将你的自定义数据库连接到Claude助手，以实现实时更新。

以下是如何在Python中设置MCP服务器的简单示例：

```python
from mcp_server import MCPServer

class MyCustomServer(MCPServer):
    def handle_request(self, request):
        if request['type'] == 'get_data':
            return {'data': 'Here is your custom data!'}
if __name__ == "__main__":
    server = MyCustomServer()
    server.run()
```

这个示例展示了如何轻松设置一个简单的服务器，在你的Claude助手需要时返回一些自定义数据。

**构建自定义工具和代理**

也许你想要的不仅仅是Anthropic提供的预构建服务器。

也许你想将你的AI助手连接到你创建的独特知识库。

MCP SDK让你创建一个可以提取特定数据并直接发送给你的AI的服务器。

想让你的AI跟踪公司业绩？

使用Postgres MCP服务器或构建一个更适合你需求的服务器。你甚至可以通过创建一个完整的数据源网络来添加多个服务器，让你的助手可以使用。

最酷的部分？MCP不仅仅是单向的。

AI也可以*发送*数据——它可以从GitHub读取并进行更改。

它可以检查趋势，然后为您编写报告。

因为MCP对所有人开放，任何人都可以为其做出贡献并使其变得更好。想象一个未来，所有人的MCP服务器可以跨越所有不同的AI模型——OpenAI、Google、Anthropic——共同工作。

这可能成为使AI模型更有用的*标准*。

**未来**

这不仅仅是关于我们现在能做什么；这关乎我们要去往何处。

由于MCP是开源的

它可能成为所有AI模型的标准，而不仅仅是Claude。想象一下，如果GPT-5可以使用相同的工具和服务器。可能性是无穷无尽的——知识库连接的编码环境、自动化系统——所有这些都在一个通用标准之下。Anthropic正在挑战行业的其他公司加入，或者冒着被淘汰的风险。

想象一下不久的未来：您的AI助手可以轻松切换不同的工具，获取实时数据，读取数据库，编写代码，进行编辑并不断学习——所有这些都在一个标准之下。

这就是我们一直梦想的AI未来。

所以，安装Claude桌面应用程序，试用预构建的服务器并开始实验。


