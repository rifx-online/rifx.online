---
title: "使用自动生成的 MCP 服务器的 C++ RESTful 网络服务与 LLM 连接"
meta_title: "使用自动生成的 MCP 服务器的 C++ RESTful 网络服务与 LLM 连接"
description: "本文介绍了如何将MCP（模型上下文协议）服务器集成到现有的Oat++应用程序中，以便与大型语言模型（LLMs）进行交互。教程首先要求用户具备有效的Oat++ web服务，然后指导用户克隆和安装oatpp-mcp模块，并将其链接到项目中。接着，文章详细说明了如何通过HTTP-SSE和STDIO两种传输方式暴露REST API，并通过MCP Inspector进行测试。最后，介绍了如何在Claude桌面应用中配置MCP服务器，以实现基本的CRUD操作。"
date: 2024-12-26T01:05:30Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Sl3qB0cBSn5xbz8wmMUCnA.png"
categories: ["Programming", "Technology/Web", "Machine Learning"]
author: "Rifx.Online"
tags: ["MCP", "Oat++", "LLMs", "REST", "Claude"]
draft: False

---



这是一个 5 分钟的教程，介绍如何将 MCP ([Model Context Protocol](https://www.anthropic.com/news/model-context-protocol)) 服务器添加到您现有的 [Oat\+\+](https://oatpp.io/) 应用程序，以便 LLMs 可以查询您的 API。

## 前提条件

在开始之前，您需要一个使用 Oat++ 构建的有效 web 服务。

如果您还没有一个有效的 Oat++ web 服务，可以通过以下教程创建一个：[C++ RESTful web service with Swagger-UI and auto-documented endpoints](https://readmedium.com/c-oatpp-web-service-with-swagger-ui-and-auto-documented-endpoints-1d4bb7b82c21)。或者，您可以使用 Oat++ 的示例项目之一。

在本教程中，我们将使用 [example-crud](https://github.com/oatpp/example-crud) 项目进行演示。

## 将 oatpp\-mcp 添加到您的项目中

[**oatpp\-mcp**](https://github.com/oatpp/oatpp-mcp) 模块实现了 Anthropic 的模型上下文协议 (MCP)。它允许您通过手动定义 [工具](https://modelcontextprotocol.io/docs/concepts/tools)、[提示](https://modelcontextprotocol.io/docs/concepts/prompts) 和 [资源](https://modelcontextprotocol.io/docs/concepts/resources) 来创建独立的 MCP 服务器，这些内容将提供给 LLM。此外，它可以 **从您的 [`ApiControl`ler](https://oatpp.io/docs/components/api-controller/) 自动生成工具**。

步骤 1：克隆 oatpp\-mcp


```python
git clone https://github.com/oatpp/oatpp-mcp
```
步骤 2：构建并安装 oatpp\-mcp


```python
cd oatpp-mcp/
mkdir build && cd build/
cmake ..
sudo make install
```

### 第3步：将 oatpp\-mcp 链接到您的应用程序

安装完成后，您可以将 **oatpp\-mcp** 模块链接到您的应用程序。请按如下方式更新您的 `example-crud/CMakeLists.txt`：


```python
find_package(oatpp          1.4.0 REQUIRED)
find_package(oatpp-swagger  1.4.0 REQUIRED)
find_package(oatpp-mcp      1.4.0 REQUIRED) # <-- Add this
find_package(oatpp-sqlite   1.4.0 REQUIRED)

target_link_libraries(crud-lib
        # Oat++
        PUBLIC oatpp::oatpp
        PUBLIC oatpp::oatpp-swagger
        PUBLIC oatpp::oatpp-mcp             # <-- And this
        PUBLIC oatpp::oatpp-sqlite
)
```

## 通过 MCP 工具暴露您的 REST API

Oat\+\+ MCP 服务器支持 HTTP\-SSE（服务器推送事件）和 STDIO 传输。根据您使用的传输方式，MCP 服务器的工作方式和运行方式会有一些小的差异。

### HTTP\-SSE 传输

让我们从 SSE 传输开始。

在 HTTP\-SSE 传输的情况下，MCP 在与您的 REST API 相同的端口上提供服务。MCP 服务器会向路由器添加两个端点：

* `GET {prefix}/sse` — 用于服务器发送事件
* `POST {prefix}/sessions/{sessionId}` — LLM 发送事件

修改您的 `App.cpp`（在我的例子中是 `example-crud/src/App.cpp`）…

步骤 1：创建 MCP 服务器


```python
#include "oatpp-mcp/Server.hpp"

...

oatpp::mcp::Server mcpServer; //<-- create mcpServer instance
```
步骤 2：将 MCP 服务器的端点添加到路由器


```python
router->addController(mcpServer.getSseController());
```
步骤 3：指定 MCP 服务器应提供哪些端点


```python
mcpServer.addEndpoints(userController->getEndpoints());
```
就这样！现在 LLM 可以通过 MCP 连接到您的服务器及其 API。

为了进行快速测试，我们可以使用 [MCP Inspector](https://github.com/modelcontextprotocol/inspector)：



* 在传输下拉菜单中选择“**SSE**”
* 在**“URL”**下输入**“SSE”**端点（应该是 `http://localhost:<port>/sse`）。
* 连接并转到**“工具”**选项卡。

有关如何运行 MCP Inspector 的详细信息，请参阅 [MCP Inspector GitHub 仓库](https://github.com/modelcontextprotocol/inspector)。

### STDIO 传输

在 STDIO 传输的情况下，MCP 服务器不会向路由器添加任何端点。相反，它监听 STDIO 流并将 API 调用转发到 ApiController。此外，我们需要通过将日志重定向到文件来静音所有日志，以避免干扰 STDIO 流。

修改你的 `App.cpp`（在我的情况下是 `example-crud/src/App.cpp`）…

步骤 1：创建 MCP 服务器


```python
#include "oatpp-mcp/Server.hpp"

...

oatpp::mcp::Server mcpServer; //<-- create mcpServer instance
```
步骤 2：指定 MCP 服务器应该提供哪些端点


```python
mcpServer.addEndpoints(userController->getEndpoints());
```
步骤 3：在与 HTTP 服务器线程并行运行的线程中监听 STDIO 流。


```python
  std::thread http([&server, connectionProvider]{
    OATPP_LOGd("Server", "Running on port {}...", connectionProvider->getProperty("port").toString())
    server.run();
  });

  std::thread mcp([&mcpServer]{
    OATPP_LOGd("MCP Server", "Serving via STDIO {}...")
    mcpServer.stdioListen();
  });

  http.join();
  mcp.join();
```
步骤 4：将日志重定向到文件


```python
class FileLogger : public oatpp::Logger {
private:
  std::mutex m_mutex;
public:

  void log(v_uint32 priority, const std::string& tag, const std::string& message) override {
    std::lock_guard<std::mutex> lock(m_mutex);
    std::ofstream fout(LOG_FILE);
    fout << tag << ": " << message << std::endl;
  }

};

...

oatpp::Environment::init(
  std::make_shared<FileLogger>()
);
```
就这样！我们可以像之前使用 MCP Inspector 一样测试它，或者我们可以使用 [Claude Desktop](https://claude.ai/download) 来查看 LLM 如何与我们的服务互动。

## 与 Claude 的桌面测试

步骤 1：将您的 MCP 服务器添加到 Claude 配置中

在 Mac 上 (*对于其他平台，请参考 Claude 的文档*)：


```python
vi ~/Library/Application\ Support/Claude/claude_desktop_config.json
```
添加您的服务器可执行文件（在我的情况下是 `crud-exe` — [示例\-crud 服务](https://github.com/oatpp/example-crud)）：


```python
{
  "mcpServers": {
    "test-tool": {
      "command": "/path/to/server/executable"
    }
  }
}
```
步骤 2：重新启动 Claude 应用程序并请求 LLM 查询您的服务。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*oE0JsyOfEglNTDANOANKqw.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*YYqkAPboVzYnu5Vfbh1VAQ.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*40F1FW8oVEqscTmoT7ZVXw.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*kLQWem5mfYY7-Za_0EJhjQ.png)

正如您所看到的，Claude 已成功通过 MCP 服务器执行所有基本 CRUD 操作。我们所需要做的只是添加几行代码，其余的由 Oat++ 框架生成。

有关完整示例，请克隆 [示例\-crud](https://github.com/oatpp/example-crud) 项目（`add_mcp_server` 分支）。 


```python
git clone -b add_mcp_server https://github.com/oatpp/example-crud
```
**有用的链接**

