---
title: "Claude MCP引领智能代理时代的变革与应用"
meta_title: "Claude MCP引领智能代理时代的变革与应用"
description: "Claude MCP标志着AI代理时代的进步，允许Claude通过自然语言与计算机应用和API互动。MCP协议使Claude能够访问文件系统、Google Drive等，提升其执行现实任务的能力。与传统的LLM工具不同，MCP支持本地服务，增强隐私性和灵活性。这一技术的快速发展有潜力彻底改变多个行业的工作方式。"
date: 2024-12-26T04:30:18Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*kE5KVeAoK0TZMQSCNd0l8g.png"
categories: ["Programming", "Technology", "Machine Learning"]
author: "Rifx.Online"
tags: ["Claude", "MCP", "integration", "privacy", "agentic"]
draft: False

---



最近我们听到了很多关于 AI 代理的消息，我也在测试其中的许多工具。兴奋感实际上始于几年前，像 **AutoGPT** 和 **CrewAI** 这样的工具。虽然它们的方法各不相同，但通常涉及 LLM 之间的相互通信以及使用外部工具。这些 **“[工具](https://platform.openai.com/docs/assistants/tools/file-search)” 本质上是 API**，它们架起了 LLM 与现实世界之间的桥梁。单靠 LLM 可以生成令人印象深刻的文本，但当它能够与环境互动时，事情就变得更加有趣。

我最近探索了 [Claude 计算机使用](https://docs.anthropic.com/en/docs/build-with-claude/computer-use)，这是 Anthropic 推出的一项新技术，它允许 Claude 通过自然语言控制你的计算机，并借助一些额外的软件。理论上，你可以告诉 Claude，在 Docker 容器中运行此软件，**为你预订航班**。

我强调“理论上”，因为我们仍处于早期阶段，事情并不总是一帆风顺。一个主要的障碍是速度：当前的方法通常依赖于截屏，然后使用鼠标进行点击和输入。即使在一台好的计算机上，这也可能很慢，尽管最终可能仍会为你节省时间。

尽管面临这些挑战，这项技术正在迅速发展，并有潜力彻底改变众多行业——这一点通过我即将介绍的令人兴奋的新发展得到了强调。

— \-

## 这篇博客文章讲了什么？

现在，Claude 正在通过引入 **Model Context Protocol (MCP)** 迈出真正自主行为的又一巨大步伐。您可以在 [Claude 网站和 GitHub](https://github.com/modelcontextprotocol/servers?tab=readme-ov-file) 上深入了解详细信息，但简单来说，MCP 是一个协议，它允许 Claude 连接到您计算机上的各种应用程序和 API，或其他地方。

只需简单的配置，您只需复制并粘贴到 Claude 中即可。

突然间，Claude 可以与您的文件系统、Google Drive，甚至像 Puppeteer 这样的浏览器自动化工具进行交互。



以下是 MCP 服务器的列表。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*0xsGTRoL4j-s-d5-cBOxbg.png)

— \-

## 它如何帮助自主行为？

单独使用时，Claude 限于其内部知识，无法访问您依赖的日常服务和应用程序，例如 Google Drive、Gmail 或您计算机的文件系统。没有这种连接，Claude 的能力仅限于对话——解释信息和生成文本。

然而，通过 MCP 配置，您可以集成这些工具，使 Claude 能够与您更广泛的数字生态系统互动，并为您执行现实世界的任务。

— \-

## 这与 LLM 工具和函数调用有什么不同？

关键区别在于其运行时集成：您可以通过简单的配置动态添加功能到 Claude（桌面版）。然后，Claude 会自动处理服务器连接，瞬间获得 MCP 服务器的能力，实质上就是它的 API。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*_UDhvlaIYABF9StjOEk8Xg.png)

例如，如果 MCP 服务器提供对文件系统的访问，Claude 将接收到用于读取和写入文件和目录的支持功能列表。重要的是要理解，Claude 仅与 API 进行交互；MCP 服务器处理文件系统上的实际操作。

您可以在以下代码中检查 MCP 文件系统服务器的内部工作原理：

**MCP 与自定义 GPT 有何不同？**

OpenAI 的自定义 GPT 表面上提供了类似的功能。使用自定义 GPT，您可以创建自己的 GPT，配备自定义提示和一组相关 API，使其比通用 GPT 更强大。这听起来可能相似，但与 MCP 从根本上是不同的：

**公共服务与本地服务**

您连接的工具必须是 **公开可用** 的，因为这些工具是由 API 直接查询和执行的。例如，如果您添加一个获取天气的工具，GPT 将监视聊天中有关天气的任何问题，如果看到它，将调用配置的 API，因此它必须是公开可用的。

相比之下，Claude 桌面版使用的 MCP 服务器不需要公开可用，MCP 服务器是在您的 PC 上启动并 **本地运行** 的。

其中一些可以访问公共服务，例如 Google Drive，但有些可以是完全本地的（如文件服务器的 MCP）。这不仅从隐私的角度来看是好的，而且还允许您做更多事情，而不仅仅是使用公共 API，因为某些服务仅在本地运行。

例如，我最近读到一个 \[MPC for Obsidian] (https://forum.obsidian.md/t/claude\-mcp\-for\-obsidian\-using\-rest\-api/93284\)，它通常只在本地运行。现在您可以将 PC 上的任何服务直接连接到 Claude，这真是太酷了。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*1GEFvA_YOI6BAnT0TJ5HMA.png)

**与自定义 GPT 提供者的数据共享**

通过公共 API 提供的共享自定义 GPT 需要通过它们提供的 API 访问您的数据。例如，如果您使用一个可以将 ChatGPT 窗口中的某些文本转换为 PDF 的自定义 GPT，提供者的 API 将会调用您的文本。使用 MCP，您只需生成一个 Python 或 NodeJS 服务器来完成此操作，甚至可以使用操作系统服务在 Claude 聊天中从内部执行，而无需工具在线。这听起来可能很简单，但影响尤其在企业环境中是巨大的。

**超越 Claude 桌面版 — 向您的服务器添加 MCP 支持**

到目前为止，我们只看了 Claude 桌面应用程序及其使用本地 PC 上工具执行任务的能力。但 MCP 的服务器端支持如何呢？如果您正在为您的 SaaS 构建 AI 代理并希望支持 MCP，这可能会非常有趣。您可以使用此处描述的客户端库 <https://modelcontextprotocol.io/quickstart/client>

想看看 MCP 的实际应用吗？看看这个：

**接下来是什么？**

该协议和技术正在迅速引起关注，并且它们有潜力成为真正的游戏规则改变者，使代理能够与外部世界进行互动，所有这些都无需编码。相反，您可以简单地动态创建配置。

您的 Claude 现在比以往任何时候都更强大 — 您只需利用这种力量。

