---
title: "焦点正从人工智能代理转向人工智能代理工具的使用"
meta_title: "焦点正从人工智能代理转向人工智能代理工具的使用"
description: "文章探讨了AI代理的关注点转向增强其使用工具的能力，这些工具通过自然语言描述并激活代理的推理能力。OpenAI和Anthropic等公司正在开发能够在计算机上自主执行任务的AI代理，旨在提高多步骤工作流程的管理能力。Anthropic提供了一个参考实现，展示了AI代理如何与计算机环境交互，包括GUI操作和命令行功能，强调了在受控环境中灵活运用工具的策略。"
date: 2024-11-16T11:03:12Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*7IELtMakzcc68bdb4usXBQ.png"
categories: ["Programming", "Technology", "Autonomous Systems"]
author: "Rifx.Online"
tags: ["Operator", "GUI", "Navigation", "Command", "File"]
draft: False

---



### 关于AI代理的关注点正在从单纯开发自主AI代理转向增强可供它们使用的工具，这直接影响到它们的能力和灵活性。

AI代理的功能和范围在很大程度上依赖于工具的访问，工具以自然语言描述，并通过代理的内部推理激活。

桌面和其他用户特定环境提供了代理有效执行任务所需的丰富上下文，使它们成为理想的操作空间。

## ✨✨ 在 LinkedIn 上关注我 ✨✨

## 介绍

随着模型成为实用工具，启用工具的框架和环境正在成为关键，领先的人工智能公司如OpenAI和Anthropic正在探索使用计算机GUI导航来完成复杂任务的AI代理。

OpenAI最近宣布，准备发布一款**AI代理**，*Operator*，它将在用户的计算机上自主执行任务，如编码和预订旅行，并将在1月作为研究预览版推出。

这一发布与整个行业向更强大的**代理工具**转变的趋势一致，这些工具能够在最少监督下管理多步骤工作流程。

其他主要参与者也在推出能够实时计算机导航的代理工具，这反映出通过工具访问增强AI代理能力的战略性举措，而不仅仅是提高模型的能力。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*q7YvQLqfVdhV3bZM2oflDQ.png)

## 人工智能计算机使用

Anthropic 提供了一个 [参考实现](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo)，其中包含了您快速开始计算机使用所需的一切。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*vD4T4Bo2-JcH535TOc46BQ.png)

上面的图像显示了在我的桌面上运行的 AI 代理，我需要在我的 MacBook 上安装 Docker 并将 Docker 镜像部署到我的机器上。

下面的脚本就是您所需的全部内容，以部署实例并使其正常运行。

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

下面是我运行文件的终端窗口的截图…

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*mTu4gGEwnFbQYqJ-YGYqIA.png)

该实现包括：

* 一个适用于与 Claude 进行计算机使用的 [容器化环境](https://github.com/anthropics/anthropic-quickstarts/blob/main/computer-use-demo/Dockerfile)
* [计算机使用工具](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo/computer_use_demo/tools) 的实现
* 一个与 Anthropic API 交互并执行计算机使用工具的 [代理循环](https://github.com/anthropics/anthropic-quickstarts/blob/main/computer-use-demo/computer_use_demo/loop.py)
* 一个与容器、代理循环和工具交互的网页界面。

## Anthropic AI Agent 详细信息

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*euT2ZTmjVV5cTK-j8i4fgg.png)

Anthropic **AI Agent** 可以访问三个主要的 **工具/功能**，使我能够与 Ubuntu 虚拟机环境进行交互：

### 计算机功能：

* 这是与GUI环境交互的主要接口
* 允许AI代理执行鼠标和键盘操作，例如：
* 移动光标 (`mouse_move`)
* 点击 (`left_click`, `right_click`, `middle_click`, `double_click`)
* 输入文本 (`type`)
* 按键组合 (`key`)
* 截图 (`screenshot`)
* 显示分辨率设置为1024x768
* 显示编号为 :1
* AI代理在点击元素之前需要通过截图检查坐标

### bash 函数:

* 给予 AI Agent 访问 bash shell 的权限以运行命令
* 状态在命令之间保持
* 可以通过 apt 和 pip 安装软件包
* 可以运行后台进程
* 对于 GUI 应用程序，需要设置 DISPLAY=:1 环境变量

### str\_replace\_editor 函数：

* 文件操作工具，允许：
* 查看文件和目录 (`view`)
* 创建新文件 (`create`)
* 替换文件中的文本 (`str_replace`)
* 在特定行插入文本 (`insert`)
* 撤销编辑 (`undo_edit`)
* 在操作之间保持状态

## 重要约束

* 不能在社交媒体/通讯平台上创建账户
* 不能在没有用户协助的情况下处理 CAPTCHA/reCAPTCHA
* 不能在没有用户指示的情况下同意服务条款
* 不能在社交媒体上发布评论/反应
* 不能访问选民注册或选举基础设施数据

系统运行在 aarch64 架构的 Ubuntu 虚拟机上，我通过 Docker 容器在我的笔记本电脑上运行它。

这些工具为 AI Agent 提供了一种受控但灵活的方式来与虚拟环境互动，结合了 GUI 交互、命令行操作和文件操作能力。

我的环境在每个会话中都是新初始化的，但在工具调用之间保持状态。

AI Agent 可以通过 Firefox 使用互联网，并根据需要通过软件包管理系统安装额外的软件。


