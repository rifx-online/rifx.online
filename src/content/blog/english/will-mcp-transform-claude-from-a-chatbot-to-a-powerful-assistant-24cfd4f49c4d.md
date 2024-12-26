---
title: "Is Claude MCP the beginning of a true Agentic Era?"
meta_title: "Is Claude MCP the beginning of a true Agentic Era?"
description: "The article discusses the advancements in AI agents, particularly focusing on Claude and its new Model Context Protocol (MCP). MCP allows Claude to connect with various applications and APIs on a users computer, enhancing its ability to perform real-world tasks beyond text generation. Unlike traditional LLM tools, MCP enables dynamic integration of local services, improving privacy and functionality. This technology is poised to revolutionize industries by facilitating seamless interaction between AI agents and everyday digital ecosystems, making them more agentic without requiring extensive coding knowledge."
date: 2024-12-26T01:25:52Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*kE5KVeAoK0TZMQSCNd0l8g.png"
categories: ["Programming", "Technology", "Machine Learning"]
author: "Rifx.Online"
tags: ["Claude", "MCP", "integration", "privacy", "agentic"]
draft: False

---




We’ve been hearing a lot about AI agents lately, and I’ve been putting many of them to the test. The excitement really began a few years back with tools like **AutoGPT** and **CrewAI**. While their approaches differ, they generally involve LLMs communicating with each other and using external tools. These **“[tools](https://platform.openai.com/docs/assistants/tools/file-search)” are essentially APIs** that bridge the gap between the LLM and the real world. An LLM alone can generate impressive text, but it’s far more interesting when it can interact with its environment.

I recently explored [Claude Computer Use](https://docs.anthropic.com/en/docs/build-with-claude/computer-use), a new technology from Anthropic that lets Claude control your computer through natural language, with the assistance of some additional software. In theory, you could tell Claude, with this software running in a Docker container, to **book a flight for you**.

I emphasize “in theory” because we’re still in the early stages, and things aren’t always smooth. A major hurdle is speed: current methods often rely on taking screenshots, and then using the mouse to click and type. Even on a good computer, this can be slow, although it may still save you time in the end.

Despite these challenges, the technology is rapidly advancing and holds the potential to revolutionize numerous industries — a point underscored by the exciting new development I’m about to introduce.

— \-


## What Is This Blog Post About?

Now, Claude is taking another giant leap towards truly agentic behavior with the introduction of the **Model Context Protocol (MCP)**. You can dive into the details on the [Claude website and GitHub](https://github.com/modelcontextprotocol/servers?tab=readme-ov-file), but simply put, MCP is a protocol that lets Claude connect to various applications and API on your computer or anywhere else.

All it takes is a simple configuration that you copy and paste into Claude.

Suddenly, Claude can interact with your file system, Google Drive, or even tools like Puppeteer for browser automation.



Here is a list of MCP Servers.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*0xsGTRoL4j-s-d5-cBOxbg.png)

— \-


## How Does It Help Agentic Behavior?

On its own, Claude is limited to its internal knowledge, lacking access to the everyday services and applications you rely on, such as Google Drive, Gmail, or your computer’s file system. Without this connection, Claude’s capabilities are restricted to conversation — interpreting information and generating text.

However, with MCP configuration, you can integrate these tools, giving Claude the ability to interact with your broader digital ecosystem and perform real\-world tasks for you.

— \-


## How Does This Differ From LLM Tools and Function Calls?

The key difference lies in its runtime integration: you can add functionality to Claude on the fly with a simple configuration. Claude (Desktop Edition) then automatically handles the server connection, instantly gaining access to the MCP server’s capabilities, essentially its API.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*_UDhvlaIYABF9StjOEk8Xg.png)

For instance, if the MCP server provides access to a file system, Claude receives a list of supported functions for reading and writing files and directories. It’s important to understand that Claude only interacts with the API; the MCP server handles the actual operations on the file system.

You can examine the internal workings of an MCP file system server in the following code:

**How does MCP differ from Custom GPTs?**

Custom GPTs from OpenAI offer similar functionality at first glance. With Custom GPT you can create your own GPT with a custom prompt and a set of associated APIs that make it more powerful than the generic GPT. This may sound the same, but it is fundamentally different from MCP:

**Public vs Local Servies**

The tools you connect to must be **publicly available**, because these tools are queried and executed directly by the API, e.g. if you add a tool to get the weather, GPT will watch the chat for any question about the weather and if it sees one it will call the configured API, so it must be publicly available.

In contrast, the MCP servers used by Claude Desktop do not need to be publicly available, MCP servers are started and **run locally** on your PC.

Some of them have access to public services like Google Drive, but some can be exclusively local (like MCP for the file server). Not only is this good from a privacy perspective, but it also allows you to do a lot more than if you only used public APIs, because some services only run locally.

For example, I recently read about an \[MPC for Obsidian] (https://forum.obsidian.md/t/claude\-mcp\-for\-obsidian\-using\-rest\-api/93284\) that normally only runs locally.Now you can literally connect any service on your PC to Claude, which is pretty cool. amazing.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*1GEFvA_YOI6BAnT0TJ5HMA.png)

**Data sharing with Custom GPT providers**

Shared custom GPTs provided via public APIs need access to your data via the APIs they provide. For example, if you use a custom GPT that can convert some text in your ChatGPT window to PDF, the provider’s API will be called with your text.With MCP, you can simply spawn a Python or NodeJS server that does just that, or even use OS services to do it from within Claude chat, without the tool even being online. this may sound simple, but the impact, especially in enterprise environments, is huge.

**Beyond Claude Desktop — Adding MCP\-support to your server**

So far we have only looked at the Claude Desktop application and the ability to perform tasks using tools on your local PC. But what about server\-side support for MCP? This could be very interesting if, for example, you are building an AI agent for your SaaS and you want to support MCP. You can use the CLient library as described here <https://modelcontextprotocol.io/quickstart/client>

Want to see MCP in action? Check this out:

**What’s Next?**

This protocol and technology are rapidly gaining attention, and they have the potential to be a true game\-changer for enabling agents to interact with the outside world, all without requiring coding. Instead, you can simply create configurations on the fly.

Your Claude is now more powerful than ever — you just have to harness that power.


