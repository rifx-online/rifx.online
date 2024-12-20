---
title: "Top 5 MCP Servers to Automate Daily Tasks and Workflows with Prompts"
meta_title: "Top 5 MCP Servers to Automate Daily Tasks and Workflows with Prompts"
description: "The article discusses the top five Model Context Protocol (MCP) servers that enhance automation of daily tasks using Claude. These include the File System MCP Server for file management, Slack MCP Server for team communication, GitHub MCP Server for repository management, Google Maps MCP Server for location-based tasks, and Bluesky MCP Server for social media workflows. Each server offers specific functionalities and practical prompts to improve productivity and streamline workflows, making Claude a valuable tool for various users."
date: 2024-12-19T21:23:28Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*0Xn_PSA3g0O7DdCeI93ZGw.png"
categories: ["Programming", "Technology", "Chatbots"]
author: "Rifx.Online"
tags: ["Model", "Context", "Protocol", "Claude", "Servers"]
draft: False

---




Since Anthropic introduced the **Model Context Protocol (MCP)** into Claude, it has revolutionized the way we automate repetitive tasks. From file management to social media workflows, **MCP servers** let you connect **Claude** to powerful tools like **GitHub**, **Slack**, and **Google Maps**. These integrations help you save time, streamline workflows, and focus on what matters most.

In this article, I’ll share the **top 5 MCP servers** you can use to **boost productivity** with practical prompts and examples. Whether you’re looking to manage files, automate team communication, or simplify location\-based tasks, there’s something here for everyone.

Here are the five MCP servers I’ve found most helpful so far:

1. **File System MCP Server** for Automating File Management
2. **Slack MCP Server** for Automating Team Communication
3. **GitHub MCP Server** for Managing Repositories and Issues
4. **Google Maps MCP Server** for Location\-Based Automation
5. **Bluesky MCP Server** for Social Media Workflow Automation



Before reading this all article, I recommend you to learn and understand what the MCP is and how it works in the [last article I published](https://medium.com/@pedro.aquino.se/how-to-use-mcp-tools-on-claude-desktop-app-and-automate-your-daily-tasks-1c38e22bc4b0). I’ll jump straight to the top 5 best MCP servers you can use to automate your daily tasks and job.


## 1\. File System MCP Server for Automating File Management

This MCP Server provides direct access to local file systems with fine\-grained permissions. This is great for automating file management tasks, such as organizing directories or backing up data securely.

Some of the included features of this MCP Server are: read/write files, create/list/delete directories, move files/directories, search files.

To enable this server, add the following to your `claude_desktop_config.json`. Only grant access to directories you want Claude to manage.


```python
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/you_username/Desktop",
        "/Users/you_username/Downloads"
      ]
    }
  }
}
```
If your Downloads folder is messy, ask Claude: *“Can you organize the Downloads directory by creating a new folder called ‘Images’, and move the all the image files into the respective folder based on file type? For example: .jpg, .png, and .gif to ‘Images’.”*

Claude will create the directory and move the files.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*2li7nnMuj_mLIVOoNfdlaQ.png)

Claude will create the “Images” directory inside the Downloads folder and move all the images files one by one to it.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*EPqRSM5ik9EIDL5M6GxvJg.png)


### Other usefull prompts:

* *“Can you back up all files from the Desktop directory to a folder called ‘Backup’ in the ExternalDrive directory?”*
* *“Can you delete all files in the Downloads directory that haven’t been accessed in the last 30 days?”*
* *“Can you rename all the images in the Photos directory by adding today’s date as a prefix to their filenames?”*


## 2\. Slack MCP Server for Automating Team Communication

With the Slack MCP Server, you can automate communication workflows, manage channels, send messages, and streamline collaboration. It’s ideal for reducing manual tasks and staying updated with real\-time notifications.

To setup the Slack MCP Server:

1. Open [Slack Apps](https://api.slack.com/apps) in your browser.
2. Locate the app you created in the list or click **“Create New App”** if you haven’t already done so.
3. On the app’s settings page, click on **“OAuth \& Permissions”** in the left\-hand menu. Scroll down to the **“Bot Token Scopes”** section and add the following scopes: **channels:history**, **channels:read**, **chat:write.public**, **reactions:write** and **users:read.**
4. Scroll up to the **“OAuth Tokens”,** click on “Install to Workspace”, and authorize the app.
5. Save the “Bot User OAuth Token” that starts with `xoxb-`
6. Get your Team ID (starts with a `T`) by following [this guidance](https://slack.com/help/articles/221769328-Locate-your-Slack-URL-or-ID#find-your-workspace-or-org-id).

After getting the necessary tokens, to enable this MCP Server, you need to add the following entry to the `claude_desktop_config.json` **.** Make sure you update the fields SLACK\_BOT\_TOKEN and SLACK\_TEAM\_ID with the tokens you got from your app.


```python
{
  "mcpServers": {
    "slack": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-slack"
      ],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-bot-token",
        "SLACK_TEAM_ID": "T01234567"
      }
    }
  }
}
```
After that, we can test if it’s working properly by asking, *“Can you list all the channels in the Slack workspace and tell me how many channels exist?”*

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*b39v6S5Es2oIjY-MbTz2yw.png)


### Other usefull prompts:

* *“Can you sumarize the last 20 messages from the \#team\-discussions channel?”*
* *“Can you get all the replies to the message with timestamp `1678967890.123456` in the \#project\-updates channel?"*
* *“Can you list all users in the workspace along with their names and IDs?”*
* *“Can you post a message to the \#general channel saying, ‘The team meeting starts at 3 PM in the main conference room.’?”*
* *“Can you reply to the thread with timestamp `1678967890.123456` in the \#questions channel saying, 'I’ll look into this and get back to you soon.'?"*


## 3\. GitHub MCP Server for Managing Repositories and Issues

The GitHub MCP Server integrates Claude with GitHub, automating repository management, file updates, and development workflows. It’s a lifesaver for repetitive tasks like creating repositories, managing issues, or searching code.

To enable this server:

1. Open the terminal and install the server


```python
npm install -g @modelcontextprotocol/server-github
```
2\. Generate a GitHub Personal Access by going [here](https://github.com/settings/tokens).

3\. Click **Generate New Token,** select all the **repo** scopes and copy the generated token.

Add the following to your `claude_desktop_config.json` file:


```python
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```
For the testing of the github mcp server we are going to provide a prompt that will create a repository on github, push the code, create an issue, create a branch and pull request.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*3Lgv3whfu8naQ9yjd_sXSA.png)

This is really cool, Claude created a complete simple project and pushed it directly to GitHub just by prompting! Imagine fixing bugs or adding new features just by prompting Claude.


### Other Useful Prompts:

* *“Can you search for repositories related to ‘open\-source AI projects’?”*
* *“Can you list all open issues in my ‘MyRepo’ repository?”*


## 4\. Google Maps MCP Server for Location\-Based Automation

This MCP Server integrates with the Google Maps API, allowing you to perform tasks like geocoding addresses, finding nearby places, and calculating distances between locations. It’s perfect for automating location\-based workflows and retrieving detailed place information.

To enable this server:

1. Get a Google Maps API key by following the instructions [here](https://developers.google.com/maps/documentation/javascript/get-api-key#create-api-keys).
2. Add the following to your `claude_desktop_config.json` file:


```python
{
  "mcpServers": {
    "google-maps": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-google-maps"
      ],
      "env": {
        "GOOGLE_MAPS_API_KEY": "<YOUR_API_KEY>"
      }
    }
  }
}
```
For testing, we can ask Claude about cheap restaurants near Trump Tower, and we received a really helpful response.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*8w9toV9NkfmWjFVgfgcalQ.png)


### Other usefull prompts:

* *“Can you provide walking directions from ‘Eiffel Tower, Paris’ to ‘Louvre Museum, Paris’?”*
* *“Can you calculate driving distances and durations between these origins: \[‘New York, NY’, ‘Boston, MA’] and these destinations: \[‘Philadelphia, PA’, ‘Washington, DC’]?”*
* *“Can you list all the barbershops in London within a 10 km radius of Trafalgar Square?”*


## 5\. Bluesky MCP Server for Social Media Workflow Automation

This server provides tools for accessing profile information, retrieving posts, searching for content, and managing followers, all through the convenience of MCP\-supported platforms like Claude Desktop.

With features like personalized feed retrieval, profile search, and post interactions, the Bluesky MCP Server is ideal for automating social media workflows, monitoring activity, and enhancing user engagement on Bluesky.

1. Clone the repository and install dependencies


```python
git clone https://github.com/keturiosakys/bluesky-context-server.git
cd bluesky-context-server
bun install

```
3\. Login into [**Bluesky**](https://bsky.app.), navigate to **Settings** \> **Privacy and Security** \> **App Passwords**, generate a new App Password and copy it.

4\. Add the following configuration to `claude_desktop_config.json` , don’t forget to add the App Password in the BLUESKY\_APP\_KEY field and your email in BLUESKY\_IDENTIFIER field.


```python
{
  "mcpServers": {
    "bluesky": {
      "command": "/Users/yourusername/.bun/bin/bun",
      "args": [
        "/path/to/bluesky-context-server/index.ts"
      ],
      "env": {
        "BLUESKY_APP_KEY": "xxxx-xxxx-xxxx-xxxx",
        "BLUESKY_IDENTIFIER": "<your_blue_sky_email>"
      }
    }
  }
}
```
Now we can test it by providing some questions as the following:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*pYMSsEY1epKALzUyEw4URA.png)


### Other usefull prompts:

* *“Can you get the last 20 posts by @creator.bsky.social?”*
* *“Can you search for posts containing the keyword ‘fred again’ and return the top 25 results?”*
* *“Can you get the last 20 posts liked by @enthusiast.bsky.social?”*
* *“Can you search for profiles containing the keyword ‘AI Researcher’ and return the top 25 results?”*

By using these MCP servers, you can turn Claude into an indispensable tool for automating your daily tasks and workflows. From organizing files with the File System MCP Server to managing social media with Bluesky, the possibilities are endless.

Try these servers with the prompts provided and experience how much time and effort you can save. Whether you’re a developer, a team manager, or just someone looking to simplify daily routines, MCP servers are here to make your life easier.

References<https://github.com/modelcontextprotocol/servers>[https://github.com/punkpeye/awesome\-mcp\-servers](https://github.com/punkpeye/awesome-mcp-servers)[https://github.com/wong2/awesome\-mcp\-servers](https://github.com/wong2/awesome-mcp-servers)[https://github.com/appcypher/awesome\-mcp\-servers](https://github.com/appcypher/awesome-mcp-servers)[https://mcp\-get.com/](https://mcp-get.com/)


