---
title: "Is Anthropic’s Model Context Protocol (MCP) the Interoperability Standard We’ve Been Waiting For?"
meta_title: "Is Anthropic’s Model Context Protocol (MCP) the Interoperability Standard We’ve Been Waiting For?"
description: "Anthropic has introduced the Model Context Protocol (MCP), a standardized framework designed to enhance interoperability between AI applications and data sources. The MCP offers SDKs in Python and TypeScript, allowing developers to create and implement their own MCP servers. The protocol supports model-agnostic architecture, improving security when integrating legacy systems with AI models. The article outlines steps for setting up a minimal MCP server using Claude Desktop, providing code examples for implementation and testing. The future of the MCP standard and its adoption by other AI developers remains to be seen."
date: 2024-11-27T23:08:17Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*Z7rOcMYCzS7OZCEG"
categories: ["Programming", "Technology", "Machine Learning"]
author: "Rifx.Online"
tags: ["MCP", "SDK", "interoperability", "security", "legacy"]
draft: False

---






Hats off to the Anthropic team! They’ve been rolling out feature after feature and capturing the attention of the developer community. First, it was Artifacts, then Computer Use. And now, they’ve unveiled yet another groundbreaking addition: the Model Context Protocol (MCP).

The [Model Context Protocol (MCP)](https://www.anthropic.com/news/model-context-protocol) introduces a standardized approach for enabling interoperability between AI applications, data sources, and other systems.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*FHPoL674KiUfudUOY0BQxg.png)

The architecture of this standard is described in details [here](https://modelcontextprotocol.io/introduction). The standard implementation comes with Python and TypeScript SDKs. The github repo for the Python SDK is [here](https://github.com/modelcontextprotocol/python-sdk).

The good news is you can try it out fairly quickly and easily using the [Claude Desktop](https://claude.ai/download). You will need to download the latest version. Yes, it works on the free version and Windows is supported.

For a quick start, you can try the sqlite [demo](https://modelcontextprotocol.io/quickstart). There are already a number of reference implementations and community\-contributed servers available, check them out [here](https://github.com/modelcontextprotocol/servers?tab=readme-ov-file).

You can easily roll your own **MCP Server** and add it to the Claude Desktop configuration file. The python project can be bootstrapped using the helpful [create\-mcp\-server](https://github.com/modelcontextprotocol/create-python-server) utility.

Below is the step by step process which I followed to implement a minimal MCP server:


### Install Claude Desktop and modify the configuration file:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*9JxMjIFJzO-GQT8lRrnRHQ.png)

Open the settings from the Claude Desktop (upgrade it to the recent version if you had it installed already) menu and click on developer. Once you click on Edit Config, it will bring up the explorer to the installed folder with the config file highlighted.


### Edit the config file:

Add your MCP server spec to the file. If you had tried the sqlite quick start, add your server spec below that. You have to install uv as described [here](https://modelcontextprotocol.io/quickstart#installing-prerequisites-windows).


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

### The MCP Server code:

We will implement a simple ‘heartbeat’ [tool](https://modelcontextprotocol.io/docs/concepts/tools) which just returns a reply to the client. We will use the [stdio](https://modelcontextprotocol.io/docs/concepts/transports#standard-input-output-stdio) transport.

Expose the list of tools:


```python
@app.list_tools()
async def list_tools() -> list[Tool]:
    """List available tools."""
    return [
        Tool(
            name="get_heartbeat",
            description="Get a heartbeat",
            inputSchema={
                "type": "object",
                "properties": {
                    "user": {
                        "type": "string",
                        "description": "user name"
                    },
                },
                "required": ["user"]
            }
        )
    ]
```
Implement your tool:


```python
@app.call_tool()
async def call_tool(name: str, arguments: Any) -> Sequence[TextContent | ImageContent | EmbeddedResource]:
    """Handle tool calls for heartbeat."""
    if name != "get_heartbeat":
        raise ValueError(f"Unknown tool: {name}")

    if not isinstance(arguments, dict) or "user" not in arguments:
        raise ValueError("Invalid arguments")

    reply = {
        "text": f"Hello {arguments['user']}, my heart beats for you!"
    }

    return [
        TextContent(
            type="text",
            text=json.dumps(reply, indent=2)
        )
    ]
```
Add the stdio server:


```python
## Create a server instance
app = Server("heartbeat-server")

async def main():
    # Import here to avoid issues with event loops
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

### Testing the MCP Server:

If configured properly, you will be able to see the tool in the Settings \-\> Developer section. You can actually ask Claude about the tools:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Xe-xZEqeeFwBTWdfAEgjfg.png)

Claude Desktop will start the server processes which will look like command windows. This is normal and expected.

Test the heartbeat using a simple prompt.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Tg2CcnhMpDu4STRRVLfvew.png)

Ironically, Claude the chatbot is not yet aware of this standard, so it would not be able to generate the code. You could however put the standards documentation in the context and see what happens.

The MCP protocol seems very much like an enhanced version of LLM function calling. However, this architecture will make it model agnostic. The abstraction will help with security where you need to expose your legacy or proprietary data to an LLM.

It will be interesting to see how the standard evolves and if other AI players get involved.

[Code](https://github.com/sanimesa/genai/tree/main/claude_mcp) for the server.


