---
title: "Is Claude MCP the beginning of a true Agentic Era? Part 2"
meta_title: "Is Claude MCP the beginning of a true Agentic Era? Part 2"
description: "The article discusses the capabilities of Claude MCP as a powerful assistant that can interact with local applications. It provides a step-by-step guide for setting up and testing a Rapid Summarizer tool using Puppeteer MCP and file system MCP. The demonstration showcases how Claude can navigate, summarize content from a URL, and save results seamlessly. The evaluation highlights the ease of use, speed, and efficiency of the MCP configuration, indicating a significant advancement towards an agentic era in AI applications."
date: 2024-12-26T02:07:07Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*9xbeqdlVANQ1DgeHggTzJQ.png"
categories: ["Programming", "Technology/Web", "Chatbots"]
author: "Rifx.Online"
tags: ["Claude", "Puppeteer", "summarizer", "filesystem", "MCP"]
draft: False

---




In a previous blog post, I talked about MCP and how it can make Claude not just a chatbot, but a really powerful assistant that can interact with your local applications such as file systems, Google Drive, your email program and much more.

Let’s put theory into action and test the Rapid Summarizer, a tool that generates summaries from any given URL.

For this demonstration, the summarizer is running locally at `localhost:3009`. We'll use the Puppeteer MCP to navigate to the API testing interface, input a URL, trigger the summarization, and then save the result using the file system MCP.

This simple example showcases the potential for broader UI testing applications.

— \-


## Step by Step for Running on Mac (Similar on Windows)

1. Download Claude for Desktop <https://claude.ai/download> and log in.
2. Go to **File \-\> Settings \-\> Edit config** (this is basically the MCP config, the location where you save all the MCP servers you want to use).

A list of MCP servers to start with can be found here: <https://github.com/modelcontextprotocol/servers>



Copy and paste this to add the Puppeteer MCP:


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

> Note: You’d adjust the mount configuration for a real\-world application. For now, we’re using `/tmp/`, meaning anything written to `/projects/Desktop` within the MCP server's Docker sandbox will appear in your system's `/tmp/` directory.

1. Restart Claude.

Now, clicking the icon in the lower\-right corner of your chat window will display the list of currently loaded tools.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*DnNLsnMNv1QTtHHBEkK2tA.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*5Ee0Q8wOXYfp_6gZ8Y4ung.png)

Here is my prompt:


```python
Open localhost:3009
and let the service summarize this blog post
and make a screenshot
https://medium.com/@airabbitX/protecting-your-email-online-all-you-need-to-know-a693cd11ea79
```
And let the magic begin…

It successfully opened the application at the specified URL (after a minor correction of adding `/docs` to the address).

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*DrvC1F8NfBnkW9RajF4pbg.png)

It located and clicked the “Try it” button.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*9Ma8eGnnmy5nyfxKbg63qQ.png)

It then entered the URL and clicked **Execute**. However, the UI didn’t seem to register the input. Anyway, let’s move on.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*JW4AMk_j-R473-QHZjHaGg.png)

Now we got a summary of the initial URL [**www.example.com**.](http://www.example.com.)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*fcjERG_RAKb8aMcGd9htLQ.png)

Initially, it didn’t detect that the summarization was complete. However, after prompting it to scroll, Claude recognized the summary and successfully saved it to a file as expected.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Tjy636f404UPly83YrfTwQ.png)

I confirmed this by checking the Docker container running the MCP server. Alternatively, you could verify it in the designated mount folder.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*DHgiST5o9mJe4buInF5VNg.png)

— \-


## Evaluation

This initial test was quite impressive:

* No additional software installation was required.
* Unlike Computer Use, there was no need to manually start Docker containers or Streamlit.
* MCP configuration and connections worked seamlessly out of the box, and Claude’s interactions with them are transparent (you can follow the entire conversation with each MCP server in the chat window).
* It operates significantly faster than Computer Use, thanks to its API\-based approach instead of relying on point\-and\-click interactions

