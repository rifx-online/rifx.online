---
title: "The Focus Is Shifting From AI Agents To AI Agent Tool Use"
meta_title: "The Focus Is Shifting From AI Agents To AI Agent Tool Use"
description: "The article discusses the evolving focus in AI development from creating autonomous AI agents to enhancing the tools they utilize. Key advancements include AI agents like OpenAI's upcoming "Operator," which will perform tasks on users' computers through GUI navigation. Anthropic has also released a reference implementation for AI agents that interact with virtual environments, showcasing tools for GUI interactions, command-line operations, and file manipulation. These developments emphasize the importance of tool access in augmenting the capabilities of AI agents."
date: 2024-11-16T01:24:58Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*7IELtMakzcc68bdb4usXBQ.png"
categories: ["Programming", "Technology", "Autonomous Systems"]
author: "Rifx.Online"
tags: ["Operator", "GUI", "Navigation", "Command", "File"]
draft: False

---







### The focus regarding AI Agents is shifting from simply developing autonomous AI Agents to enhancing the tools available to them, which directly affects their power and flexibility.

The functionality and reach of AI Agents depend heavily on tool access, with tools described in natural language and activated through the agent’s internal reasoning.

Desktops and other user\-specific environments offer the rich context that agents need to perform tasks effectively, making them ideal operational spaces.


## ✨✨ Follow me on LinkedIn ✨✨


## Introduction

As models become utilities, tool\-enabled frameworks and environments are emerging as key, with leading AI companies like OpenAI and Anthropic exploring AI Agents that use computer GUI navigation to accomplish complex tasks.

Also recently announced, OpenAI is gearing up to release an **AI Agent**, *Operator*, which will perform tasks autonomously on a user’s computer, like coding and booking travel, available as a research preview in January.

This release aligns with an industry\-wide shift toward more capable **Agentic Tools** that manage multi\-step workflows with minimal oversight.

Other major players are also launching agent tools capable of real\-time computer navigation, reflecting a strategic move to enhance AI Agent capabilities through tool access rather than simply improving model power.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*q7YvQLqfVdhV3bZM2oflDQ.png)


## Anthropic Computer Use

Anthropic has made available a [reference implementation](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo) that includes everything you will need to get started quickly with computer use.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*vD4T4Bo2-JcH535TOc46BQ.png)

The image above shows the AI Agent running on my desktop, I had to install Docker in my MacBook and deploy the docker image onto my machine.

The script shown below is all you need to deploy the instance and have it up and running.


```python
export ANTHROPIC_API_KEY=%your_api_key%
docker run \
    -e ANTHROPIC_API_KEY=<Your Anthropic API Key Goes Here> \
    -v $HOME/.anthropic:/home/computeruse/.anthropic \
    -p 5900:5900 \
    -p 8501:8501 \
    -p 6080:6080 \
    -p 8080:8080 \
    -it ghcr.io/anthropics/anthropic-quickstarts:computer-use-demo-latest
```
Below is a screenshot of the terminal window from where I run the file…

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*mTu4gGEwnFbQYqJ-YGYqIA.png)

The implementation consists of:

* A [containerised environment](https://github.com/anthropics/anthropic-quickstarts/blob/main/computer-use-demo/Dockerfile) suitable for computer use with Claude
* Implementations of [the computer use tools](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo/computer_use_demo/tools)
* An [agent loop](https://github.com/anthropics/anthropic-quickstarts/blob/main/computer-use-demo/computer_use_demo/loop.py) that interacts with the Anthropic API and executes the computer use tools
* A web interface to interact with the container, agent loop, and tools.


## Anthropic AI Agent Detail

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*euT2ZTmjVV5cTK-j8i4fgg.png)

The Anthropic **AI Agent** has access to three main **tools/functions** that allow me to interact with the Ubuntu virtual machine environment:


### computer function:

* This is the primary interface to interact with the GUI environment
* Allows the AI Agent to perform mouse and keyboard actions like:
* Moving the cursor (`mouse_move`)
* Clicking (`left_click`, `right_click`, `middle_click`, `double_click`)
* Typing text (`type`)
* Pressing keyboard combinations (`key`)
* Taking screenshots (`screenshot`)
* The display resolution is set to 1024x768
* Display number is :1
* The AI Agent needs to check coordinates via screenshots before clicking elements


### bash function:

* Gives AI Agent access to a bash shell to run commands
* State persists across commands
* Can install packages via apt and pip
* Can run background processes
* For GUI applications, needs DISPLAY\=:1 environment variable set


### str\_replace\_editor function:

* File manipulation tool that allows:
* Viewing files and directories (`view`)
* Creating new files (`create`)
* Replacing text in files (`str_replace`)
* Inserting text at specific lines (`insert`)
* Undoing edits (`undo_edit`)
* Maintains state across operations


## Important Constraints

* Cannot create accounts on social media/communication platforms
* Cannot handle CAPTCHA/reCAPTCHA without user assistance
* Cannot agree to Terms of Service without user direction
* Cannot post comments/reactions on social media
* Cannot access voter registration or election infrastructure data

The system is running on an aarch64 architecture Ubuntu VM, and I ran it via a Docker container on my laptop.

The tools provide the AI Agent with a controlled but flexible way to interact with the virtual environment, combining GUI interactions, command\-line operations, and file manipulation capabilities.

My environment is freshly initialised for each session, but maintains state within a session across tool invocations.

The AI Agent can use the internet through Firefox and install additional software as needed through the package management system.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*4env1UkoKOZ-3zmF.png)

[***Chief Evangelist***](https://www.linkedin.com/in/cobusgreyling/) ***@*** *[Kore.ai](https://blog.kore.ai/cobus-greyling) \| I’m passionate about exploring the intersection of AI and language. From Language Models, AI Agents to Agentic Applications, Development Frameworks \& Data\-Centric Productivity Tools, I share insights and ideas on how these technologies are shaping the future.*

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*4env1UkoKOZ-3zmF.png)

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*4env1UkoKOZ-3zmF.png)


