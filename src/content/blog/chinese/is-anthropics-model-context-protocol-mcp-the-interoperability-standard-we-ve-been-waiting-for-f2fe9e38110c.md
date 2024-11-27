---
title: "Anthropic 的模型上下文协议 (MCP) 是我们期待已久的互操作性标准吗？"
meta_title: "Anthropic 的模型上下文协议 (MCP) 是我们期待已久的互操作性标准吗？"
description: "Anthropic推出的模型上下文协议（MCP）旨在实现AI应用程序、数据源及其他系统之间的互操作性，提供标准化的方法。该协议配备Python和TypeScript SDK，用户可通过Claude Desktop快速尝试。MCP允许用户创建自定义服务器，并实现简单的“心跳”工具，增强了与大型语言模型（LLM）的交互能力。该标准的实施将促进AI领域的安全性和数据共享，未来有望吸引更多参与者。"
date: 2024-11-27T23:08:17Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*Z7rOcMYCzS7OZCEG"
categories: ["Programming", "Technology", "Machine Learning"]
author: "Rifx.Online"
tags: ["MCP", "SDK", "interoperability", "security", "legacy"]
draft: False

---



向Anthropic团队致敬！他们不断推出新功能，吸引了开发者社区的关注。首先是Artifacts，然后是Computer Use。现在，他们又推出了另一个突破性的新增功能：模型上下文协议（MCP）。

[模型上下文协议（MCP）](https://www.anthropic.com/news/model-context-protocol)引入了一种标准化的方法，以实现AI应用程序、数据源和其他系统之间的互操作性。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*FHPoL674KiUfudUOY0BQxg.png)

该标准的架构在[这里](https://modelcontextprotocol.io/introduction)有详细描述。标准实现配备了Python和TypeScript SDK。Python SDK的github仓库在[这里](https://github.com/modelcontextprotocol/python-sdk)。

好消息是，您可以通过[Claude Desktop](https://claude.ai/download)快速轻松地尝试它。您需要下载最新版本。是的，它可以在免费版上运行，并且支持Windows。

要快速入门，您可以尝试sqlite [演示](https://modelcontextprotocol.io/quickstart)。已经有许多参考实现和社区贡献的服务器可用，可以在[这里](https://github.com/modelcontextprotocol/servers?tab=readme-ov-file)查看。

您可以轻松地创建自己的**MCP服务器**并将其添加到Claude Desktop配置文件中。可以使用有用的[create\-mcp\-server](https://github.com/modelcontextprotocol/create-python-server)工具引导python项目。

以下是我实施最小MCP服务器的逐步过程：

### 安装 Claude Desktop 并修改配置文件：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*9JxMjIFJzO-GQT8lRrnRHQ.png)

从 Claude Desktop 菜单中打开设置（如果您已经安装了，请将其升级到最新版本），然后点击开发者。点击编辑配置后，将打开安装文件夹的资源管理器，并突出显示配置文件。

### 编辑配置文件：

将您的 MCP 服务器规格添加到文件中。如果您尝试过 sqlite 快速入门，请在其下方添加您的服务器规格。您必须按照 [这里](https://modelcontextprotocol.io/quickstart#installing-prerequisites-windows) 的说明安装 uv。

```python
{
  "mcpServers": {
    "heartbeat": {
      "command": "uv",
      "args": [
        "--directory",
        "<server-path>",
        "run",
        "heartbeat.py"
      ]
    }
  }
}
```

### MCP服务器代码：

我们将实现一个简单的“心跳” [工具](https://modelcontextprotocol.io/docs/concepts/tools)，该工具仅返回对客户端的回复。我们将使用 [stdio](https://modelcontextprotocol.io/docs/concepts/transports#standard-input-output-stdio) 传输。

公开工具列表：

```python
@app.list_tools()
async def list_tools() -> list[Tool]:
    """列出可用工具。"""
    return [
        Tool(
            name="get_heartbeat",
            description="获取心跳",
            inputSchema={
                "type": "object",
                "properties": {
                    "user": {
                        "type": "string",
                        "description": "用户名"
                    },
                },
                "required": ["user"]
            }
        )
    ]
```

实现你的工具：

```python
@app.call_tool()
async def call_tool(name: str, arguments: Any) -> Sequence[TextContent | ImageContent | EmbeddedResource]:
    """处理心跳的工具调用。"""
    if name != "get_heartbeat":
        raise ValueError(f"未知工具: {name}")

    if not isinstance(arguments, dict) or "user" not in arguments:
        raise ValueError("无效的参数")

    reply = {
        "text": f"你好 {arguments['user']}，我的心为你跳动！"
    }

    return [
        TextContent(
            type="text",
            text=json.dumps(reply, indent=2)
        )
    ]
```

添加stdio服务器：

```python
## 创建服务器实例
app = Server("heartbeat-server")

async def main():
    # 在此处导入以避免事件循环问题
    from mcp.server.stdio import stdio_server

    async with stdio_server() as (read_stream, write_stream):
        await app.run(
            read_stream,
            write_stream,
            app.create_initialization_options()
        )

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
```

### 测试 MCP 服务器：

如果配置正确，您将能够在设置 \-\> 开发者部分看到该工具。您实际上可以向 Claude 询问这些工具：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Xe-xZEqeeFwBTWdfAEgjfg.png)

Claude Desktop 将启动服务器进程，这些进程看起来像命令窗口。这是正常且预期的。

使用简单的提示测试心跳。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Tg2CcnhMpDu4STRRVLfvew.png)

具有讽刺意味的是，Claude 聊天机器人尚未意识到这一标准，因此无法生成代码。不过，您可以将标准文档放入上下文中，看看会发生什么。

MCP 协议看起来非常像 LLM 函数调用的增强版本。然而，这种架构将使其与模型无关。抽象将有助于安全性，您需要将遗留或专有数据暴露给 LLM。

看看标准如何发展以及其他 AI 参与者是否会参与将会很有趣。

[代码](https://github.com/sanimesa/genai/tree/main/claude_mcp) 用于服务器 https://github.com/sanimesa/genai/tree/main/claude_mcp


