---
title: "Make Playwright UI Testing Smart with Model Context Protocol of Claude AI 🤖🧠"
meta_title: "Make Playwright UI Testing Smart with Model Context Protocol of Claude AI 🤖🧠"
description: "The article discusses the integration of the Model Context Protocol (MCP) with Playwright, an open-source web automation testing tool. MCP enhances AI assistants by connecting them to local systems and tools, enabling them to execute commands like automating web tasks without extensive coding. The article provides a detailed example of using Playwright to automate user creation on a website, along with instructions for setting up an MCP server for Playwright. It emphasizes the ease of using plain text commands to perform actions through AI, showcasing the potential of combining AI with automation tools."
date: 2024-12-26T04:30:18Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*PNlck4usjMCE6Zh2lpDH7g.gif?output=gif&n=50"
categories: ["Programming/Scripting", "Technology/Web", "Chatbots"]
author: "Rifx.Online"
tags: ["Model", "Context", "Protocol", "Playwright", "Automation"]
draft: False

---





> We discussed about Model Context Protocol (MCP) by Claude Anthropic [before](https://medium.com/executeautomation/model-context-protocol-open-source-real-time-data-bridging-for-llms-%EF%B8%8F-684a4a5c9fba) in our medium post. Essentially, MCP serves as a standardized framework designed to enhance the functionality of AI assistants. It establishes a connection between the AI model and the local system, data, or tool with which we are interacting, thereby providing the necessary context for AI assistants to operate effectively.


## Playwright Automation Testing tool

Playwright is an awesome open\-source Web automation testing tool that’s perfect for quickly and reliably testing modern applications. It’s got so many cool features that make Selenium or Cypress seem a bit old\-school.

If you’re interested in learning more about Playwright, I’ve got a bunch of courses on [Udemy](https://www.udemy.com/course/framework-development-with-playwright-dotnet/) and [YouTube](https://www.youtube.com/watch?v=gUu1QzIgO7U&list=PL6tu16kXT9PpjrdzWslhcb4KXFB-kdmVe) that cover all the details. You’ll learn how to build automation testing frameworks and write solid tests using Playwright.


## Writing Test code with Playwright

Eventhough Playwright is modern testing tool and supports modern application automation, the way you write the code remains pretty much exactly the same as Cypress or Selenium. You need to

1. Instantiate Playwright and setup browser driver
2. Understand the workflow you are trying to automate
3. Find the locators in the browser like CSS/XPath/ID/Name/ARIA locator
4. Perform the action on the locator using Action methods like Type, Click, Select, etc


### Scenario

Playwright Test code for a simple scenario to automate creating an user in C\# .NET looks like this


```python
1. Navigate to website http://eaapp.somee.com and click the login link. 
2. In the login page, enter the username and password as "admin" and "password" 
respectively and perform login. 
3. Then click the Employee List page and click 
"Create New" button and 
4. Enter realistic employee details to create for Name, 
Salary, DurationWorked,Select dropdown for Grade as CLevel and Email.
```
The code in Playwright with C\# .NET will look like this


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

## Now how to let the same exact work done by an AI Agents ?

Well, an LLM (Large Language Model) can generate the code like the one shown above, but it will not have the ability to run the code on our local machine, thats why AI Agents comes very handy. They will help us perform the operation on our machine backed by LLM. But, how can we acheive that ?

Welcome to [MCP](http://modelcontextprotocol.io), which is a newly [open\-sourced](https://github.com/modelcontextprotocol/servers) standard designed to help AI assistants work more effectively by connecting them to the systems and tools. In here, the tool is our local browser.



Now with the power of MCP standard, we can write an ***MCP Server*** for Playwright or Puppeteer. This MCP server will now act as a Bridge between the AI model (Claude) and our Chrome browser running in local machine.

A sample snippet of MCP server which perform drop down selecting in UI looks like this


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
The above code is exactly the same Playwright code as you can see in the line 3 and 4, its `page.waitForSelector` and `page.selectOption`


## Playwright MCP server setup in your local Claude Desktop

The above code snippet is part of my Playwright\-MCP\-Server which is an Open source MCP Server library I wrote available in GitHub [here](https://github.com/executeautomation/mcp-playwright/tree/main) and in NPM [here](https://www.npmjs.com/package/@executeautomation/playwright-mcp-server)

In order for you to work with MCP server with Claude Desktop client, you need to do the following

1. Change the Claude Desktop Client config file, which is usually available under the path


```python
~/Library/Application\ Support/Claude/claude_desktop_config.json
```
with this settings


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
2\. Then open (if not restart) the Claude desktop client, you will see an new Attach from MCP button here

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*kha1-cHK7IWUskBQ5ckCoA.png)

Click the “**Attach the MCP**” button, you will be presented as one shown below, which confirms the Playwright\-MCP\-server added

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*8QLKq-SAWOB1-NsywPbRng.png)


## Playwright MCP server in Action

After the super simple above configuration, its time for us to use the MCP server we have configured.

In order to tryout the same above scenario, for which you end up writing lot many codes in Playwright, we can do all of them via plain text as shown below, this will perform all the action for you ***without you writing a single line of code in Playwright***

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*gWNUOfkI3MmId7-sgIbfWg.png)


### Video demonstration

Here is the [video demo](https://www.youtube.com/watch?v=8CcgFUE16HM) of the above discussion with action








## Useful resources

Checkout the source code of Playwright\-MCP\-server from [https://github.com/executeautomation/mcp\-playwright](https://github.com/executeautomation/mcp-playwright)

NPM Package from [https://www.npmjs.com/package/@executeautomation/playwright\-mcp\-server](https://www.npmjs.com/package/@executeautomation/playwright-mcp-server)

Find the Package from MCP\-Get [https://mcp\-get.com/packages/%40executeautomation%2Fplaywright\-mcp\-server](https://mcp-get.com/packages/%40executeautomation%2Fplaywright-mcp-server)


