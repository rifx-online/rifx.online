---
title: "利用 Claude AI 的模型上下文协议🤖🧠，让 Playwright UI 测试变得更智能"
meta_title: "利用 Claude AI 的模型上下文协议🤖🧠，让 Playwright UI 测试变得更智能"
description: "文章介绍了如何利用Claude AI的模型上下文协议（MCP）来增强Playwright自动化测试工具的智能化。MCP为AI助手与本地系统之间提供了标准化的连接，允许AI执行自动化测试而无需手动编写代码。通过设置MCP服务器，用户可以通过简单的文本指令来执行复杂的测试场景，提升了自动化测试的效率和便利性。文章还提供了相关代码示例和资源链接，帮助用户实现这一功能。"
date: 2024-12-26T04:30:18Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*PNlck4usjMCE6Zh2lpDH7g.gif?output=gif&n=50"
categories: ["Programming/Scripting", "Technology/Web", "Chatbots"]
author: "Rifx.Online"
tags: ["Model", "Context", "Protocol", "Playwright", "Automation"]
draft: False

---



> 我们在之前的[文章](https://medium.com/executeautomation/model-context-protocol-open-source-real-time-data-bridging-for-llms-%EF%B8%8F-684a4a5c9fba)中讨论了Claude Anthropic的模型上下文协议（MCP）。本质上，MCP是一个标准化框架，旨在增强AI助手的功能。它在AI模型与我们正在交互的本地系统、数据或工具之间建立连接，从而为AI助手的有效操作提供必要的上下文。

## Playwright 自动化测试工具

Playwright 是一个出色的开源 Web 自动化测试工具，非常适合快速且可靠地测试现代应用程序。它拥有许多酷炫的功能，使得 Selenium 或 Cypress 显得有些过时。

如果你有兴趣了解更多关于 Playwright 的信息，我在 [Udemy](https://www.udemy.com/course/framework-development-with-playwright-dotnet/) 和 [YouTube](https://www.youtube.com/watch?v=gUu1QzIgO7U&list=PL6tu16kXT9PpjrdzWslhcb4KXFB-kdmVe) 上有很多课程涵盖了所有细节。你将学习如何构建自动化测试框架，并使用 Playwright 编写稳健的测试。

## 使用 Playwright 编写测试代码

尽管 Playwright 是现代测试工具并支持现代应用程序自动化，但编写代码的方式与 Cypress 或 Selenium 基本相同。您需要

1. 实例化 Playwright 并设置浏览器驱动程序
2. 理解您尝试自动化的工作流程
3. 在浏览器中找到定位器，如 CSS/XPath/ID/Name/ARIA 定位器
4. 使用操作方法（如 Type、Click、Select 等）对定位器执行操作

### 场景

Playwright Test 代码用于自动创建用户的简单场景在 C# .NET 中如下所示

```python
1. Navigate to website http://eaapp.somee.com and click the login link. 
2. In the login page, enter the username and password as "admin" and "password" 
respectively and perform login. 
3. Then click the Employee List page and click 
"Create New" button and 
4. Enter realistic employee details to create for Name, 
Salary, DurationWorked,Select dropdown for Grade as CLevel and Email.
```
在 Playwright 中使用 C# .NET 的代码如下所示

```python
[Test]
public async Task CreateAnUser()
{
    using var playwright = await Playwright.CreateAsync();
    await using var browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
    {
        Headless = false
    });
    var context = await browser.NewContextAsync();

    var page = await context.NewPageAsync();

    await page.GotoAsync("http://eaapp.somee.com/");

    await page.GetByRole(AriaRole.Link, new PageGetByRoleOptions { Name = "Login" }).ClickAsync();

    await page.GetByLabel("UserName").ClickAsync();

    await page.GetByLabel("UserName").FillAsync("admin");

    await page.GetByLabel("Password").FillAsync("password");

    await page.GetByRole(AriaRole.Button, new PageGetByRoleOptions { Name = "Log in" }).ClickAsync();

    await page.GetByRole(AriaRole.Link, new PageGetByRoleOptions { Name = "Employee List" }).ClickAsync();

    await page.GetByRole(AriaRole.Link, new PageGetByRoleOptions { Name = "Create New" }).ClickAsync();

    await page.GetByLabel("Name").ClickAsync();

    await page.GetByLabel("Name").FillAsync("Adam");

    await page.GetByLabel("Salary").FillAsync("10000");

    await page.GetByLabel("DurationWorked").FillAsync("1");

    await page.GetByLabel("Grade").FillAsync("1");

    await page.GetByLabel("Email").FillAsync("adam@adam.com");

    await page.GetByRole(AriaRole.Button, new PageGetByRoleOptions { Name = "Create" }).ClickAsync();

    await page.ScreenshotAsync(new PageScreenshotOptions
    {
        Path = "screenshot.png",
        FullPage = true
    });
}
```

## 现在如何让 AI 代理完成同样的工作？

好吧，LLM（大型语言模型）可以生成如上所示的代码，但它无法在我们的本地机器上运行代码，这就是 AI 代理非常方便的原因。它们将帮助我们在本地机器上执行操作，支持 LLM。那么，我们该如何实现呢？

欢迎来到 [MCP](http://modelcontextprotocol.io)，这是一个新近 [开源](https://github.com/modelcontextprotocol/servers) 的标准，旨在通过将 AI 助手与系统和工具连接起来，帮助其更有效地工作。在这里，工具是我们的本地浏览器。



现在，借助 MCP 标准的强大功能，我们可以为 Playwright 或 Puppeteer 编写一个 ***MCP 服务器***。这个 MCP 服务器将作为 AI 模型（Claude）与我们本地机器上运行的 Chrome 浏览器之间的桥梁。

执行 UI 中下拉选择的 MCP 服务器示例代码如下所示：

```python
    case "playwright_select":
      try {
        await page.waitForSelector(args.selector);
        await page.selectOption(args.selector, args.value);
        return {
          toolResult: {
            content: [{
              type: "text",
              text: `Selected ${args.selector} with: ${args.value}`,
            }],
            isError: false,
          },
        };
      } catch (error) {
        return {
          toolResult: {
            content: [{
              type: "text",
              text: `Failed to select ${args.selector}: ${(error as Error).message}`,
            }],
            isError: true,
          },
        };
      }
```
上面的代码与您在第 3 行和第 4 行看到的 Playwright 代码完全相同，分别是 `page.waitForSelector` 和 `page.selectOption`。

## 在您的本地 Claude Desktop 上设置 Playwright MCP 服务器

上述代码片段是我编写的开源 MCP 服务器库 Playwright\-MCP\-Server 的一部分，您可以在 GitHub [这里](https://github.com/executeautomation/mcp-playwright/tree/main) 和 NPM [这里](https://www.npmjs.com/package/@executeautomation/playwright-mcp-server) 找到它。

为了让您能够与 Claude Desktop 客户端一起使用 MCP 服务器，您需要执行以下操作：

1. 修改 Claude Desktop 客户端的配置文件，通常可以在以下路径找到：

```python
~/Library/Application\ Support/Claude/claude_desktop_config.json
```
并使用以下设置：

```python
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@executeautomation/playwright-mcp-server"]
    }
  }
}
```
2\. 然后打开（如果没有重启）Claude Desktop 客户端，您将看到这里有一个新的“从 MCP 附加”按钮

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*kha1-cHK7IWUskBQ5ckCoA.png)

点击“**附加 MCP**”按钮，您将看到如下所示的界面，确认已添加 Playwright\-MCP\-server

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*8QLKq-SAWOB1-NsywPbRng.png)

## Playwright MCP 服务器运行示例

在上述超级简单的配置之后，是时候使用我们配置的 MCP 服务器了。

为了尝试相同的场景，你在 Playwright 中编写了很多代码，我们可以通过纯文本完成所有这些操作，如下所示，这将为你执行所有操作 ***而无需在 Playwright 中编写一行代码***

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*gWNUOfkI3MmId7-sgIbfWg.png)

### 视频演示

这是上述讨论的[视频演示](https://www.youtube.com/watch?v=8CcgFUE16HM)与实际操作

## 有用的资源

查看 Playwright\-MCP\-server 的源代码，地址为 [https://github.com/executeautomation/mcp\-playwright](https://github.com/executeautomation/mcp-playwright)

NPM 包地址为 [https://www.npmjs.com/package/@executeautomation/playwright\-mcp\-server](https://www.npmjs.com/package/@executeautomation/playwright-mcp-server)

在 MCP\-Get 中找到该包，地址为 [https://mcp\-get.com/packages/%40executeautomation%2Fplaywright\-mcp\-server](https://mcp-get.com/packages/%40executeautomation%2Fplaywright-mcp-server)

