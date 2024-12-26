---
title: "Anthropic 的 MCP：使用 Claude Desktop 设置 Git MCP Agentic 工具"
meta_title: "Anthropic 的 MCP：使用 Claude Desktop 设置 Git MCP Agentic 工具"
description: "本文介绍了如何在Claude Desktop上设置Model Context Protocol (MCP)与Git的集成，提供了详细的步骤和最佳实践。MCP是一个开源标准，旨在改善AI助手与数据源的交互，支持代码分析和版本控制。文章涵盖了MCP的背景、设置要求、功能、用例、故障排除等内容，强调了在配置多个工具时需注意的事项，以确保系统的有效性和可靠性。通过MCP，开发者可以高效分析Git仓库，提升开发效率。"
date: 2024-12-26T04:30:18Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*YKLBm9xalmkqAydKi30Lxg.png"
categories: ["Programming", "Technology", "Git"]
author: "Rifx.Online"
tags: ["MCP", "Git", "Claude", "repositories", "collaboration"]
draft: False

---





在本详细指南中，我将带您了解如何设置和使用Model Context Protocol (MCP) Git与Claude Desktop的集成。这种工具使Claude能够直接分析和与您的Git仓库进行交互，提供先进的代码分析和版本控制功能。我们将涵盖从基本设置到高级用例、故障排除和最佳实践的所有内容。让我们先了解一下MCP是什么以及它的重要性。

以下是我们在本综合指南中将要涵盖的内容：

* **背景和介绍**
* 什么是Model Context Protocol (MCP)
* 核心组件和架构
* 主机和客户端应用程序的角色
* **设置和安装**
* 先决条件和系统要求
* 安装uvx及其依赖项
* 配置文件设置
* Git MCP服务器安装
* **功能和能力**
* 可用的Git操作
* 安全考虑事项
* 高级配置选项
* **用例和应用**
* 代码分析和理解
* 开发洞察
* 仓库管理
* 文档和知识管理
* 高级搜索和分析
* 团队协作洞察
* 项目健康指标
* **高级主题**
* 处理多个仓库
* 性能优化
* 最佳实践
* **故障排除和调试**
* 常见问题及解决方案
* 调试步骤和程序
* 配置验证

## 关于MCP的背景信息 — Anthropic的代理工具

Anthropic最近推出了[模型上下文协议（MCP）](https://www.anthropic.com/news/model-context-protocol)，这是一个开源标准，旨在革新AI助手与数据源的交互方式。这个创新协议提供了一个统一的框架，取代了之前的碎片化系统。通过Anthropic的MCP，开发者可以高效地[通过服务器暴露数据或创建AI应用程序](https://www.cdotrends.com/story/4327/claude-unveils-protocol-ai-data-integration)，这些应用程序可以连接到这些服务器，显著增强AI模型生成上下文相关响应的能力。尽管提供了显著的好处，该协议在隐私和数据安全方面也遭遇了审查。

模型上下文协议（MCP）由三个核心组件组成，它们无缝协作。如[IKANGAI的概述](https://www.ikangai.com/the-model-context-protocol/)所述，服务器作为数据网关，暴露来自各种来源（如数据库和代码库）的资源、工具和提示。客户端，通常是AI驱动的工具，与这些服务器通信以访问暴露的数据和功能。根据[MCP快速入门指南](https://glama.ai/blog/2024-11-25-model-context-protocol-quickstart)，主机是启动服务器连接的应用程序，发现其能力，并战略性地利用它们来解决用户问题。该系统通过一个安全的协议层进行操作，使用JSON-RPC 2.0进行消息交换，详细信息见[Anthropic对MCP的介绍](https://www.anthropic.com/news/model-context-protocol)。

在模型上下文协议（MCP）中，主机和客户端扮演着不同的角色。根据[MCP快速入门指南](https://glama.ai/blog/2024-11-25-model-context-protocol-quickstart)，主机应用程序（如Claude Desktop）启动与服务器的连接，并发现其能力以满足用户需求。客户端在主机应用程序内运行，管理服务器连接并确保无缝访问数据和功能（[Metadocs的概述](https://www.metadocs.co/2024/11/29/anthropic-model-context-protocol-how-to-give-wings-to-local-mode/)）。简单来说，主机负责协调交互，而客户端则处理技术执行。

这是该系列的第三篇文章。请务必查看[使用Brave Search设置Claude](https://www.notion.so/Anthropic-s-new-MCP-Integration-Streamlining-AI-Assistant-Agentic-Capabilities-with-Brave-Search-an-14fd6bbdbbea80d7b372c9b67ca82ec8?pvs=21)和[设置Claude文件系统MCP](https://www.notion.so/Setting-up-Claude-Filesystem-MCP-14dd6bbdbbea806c8acae1f350ad234a?pvs=21)。在本文中，我还将讨论使用MCP的一些挑战以及一些常见的解决方法。

查看我网站上的[这篇文章以获得更好的格式](https://rick-hightower.notion.site/anthropic-mcp-ai-agentic-tool-set-up-git)。

## 设置 MCP Agentic 工具 — Git 集成

现在我们已经了解了 MCP 的背景及其工作原理，让我们来逐步了解如何与 Claude Desktop 设置 Git 集成。此设置将允许 Claude 直接分析和与您的 Git 仓库进行交互，提供强大的代码分析和版本控制功能。我们将涵盖从基本要求到高级配置的所有内容。

## 前提条件

1. 已安装 Claude Desktop
2. 已安装 Git (`git --version` 来验证)
3. 已安装 Python 的 `uv` 包管理器（推荐使用此工具而非 pip）
4. 终端/命令提示符访问权限

## 安装 uvx

```python
% brew search uvx
% brew install uv
% uvx --version 
```

```python
uv-tool-uvx 0.5.5 (Homebrew 2024-11-27)
```
要安装和使用 uvx，您首先需要安装 uv 包管理器。步骤如下：

1. 使用 Homebrew（在 macOS 上）或您系统的包管理器安装 uv
2. 使用 `uv --version` 验证 uv 的安装
3. 使用 `uvx --version` 验证 uvx 的安装

请注意，uvx 是建立在 uv 之上的工具，因此首先正确安装 uv 是至关重要的。建议使用 uv 包管理器而不是 pip，因为它在性能和依赖解析方面更优秀。

如果在安装过程中遇到任何问题，请确保：

* 您的系统包管理器是最新的
* 您拥有安装软件包所需的权限
* Python 在您的系统上正确安装

## 💡什么是 uv？

`uv` 是一个现代的 Python 包和项目管理工具，使用 Rust 编写，旨在简化 Python 开发。它作为一个快速且统一的替代方案，取代了各种现有的 Python 工具，如 `pip`、`pipx`、`pyenv`、`poetry` 等。它的一个关键特性是 `uvx`，其功能类似于 `pipx`。

什么是 `uvx`？`uvx` 是 `uv` 提供的一个命令，用于运行 Python 工具或脚本，而无需显式安装。它为这些工具的执行创建临时的、隔离的虚拟环境，确保在执行后进行最小的设置和清理。这使得它特别适合一次性工具使用。

为什么使用 `uv` 和 `uvx`？`uv` 的广泛吸引力在于其能够统一 Python 开发的多个方面： • 依赖管理：使用快速解析器有效处理依赖关系 • Python 安装：自动安装所需的 Python 版本 • 虚拟环境：简化虚拟环境的创建和管理 • 工具管理：通过 `uv tool install` 或通过 `uvx` 的临时执行提供集中管理命令行工具的方式

总之，`uvx` 是一个高效、用户友好的工具，作为 `pipx` 的替代方案，提供速度、灵活性和与 `uv` 生态系统更广泛能力的无缝集成。我们在本文中使用它，因为 Anthropic 的工具是用它构建的。

…

## 安装步骤

## 1\. 创建/编辑配置文件

首先，我们需要找到或创建Claude Desktop配置文件：

**对于macOS：**


```python
## Configuration path
~/Library/Application Support/Claude/claude_desktop_config.json
```
**对于Windows：**


```python
## Configuration path
%APPDATA%\\Claude\\claude_desktop_config.json
```

## 2\. 配置 MCP Git 服务器

将以下配置添加到您的 `claude_desktop_config.json`：

```python
{
  "mcpServers": {
    "git": {
      "command": "uvx",
      "args": [
        "mcp-server-git",
        "--repository",
        "/path/to/your/git/repo"
      ]
    }
  }
}
```
将 `/path/to/your/git/repo` 替换为您要分析的 Git 仓库的实际路径。

## 3\. 安装 Git MCP 服务器

打开终端并运行：

```python
## Using uv (recommended)
uv tool install mcp-server-git
uv tool update-shell
```

## 4\. 验证安装

1. 关闭并重新启动 Claude Desktop
2. 使用简单查询测试连接：


```python
Could you show me the recent commits in my repository?
```

## 可用功能

Git MCP 服务器提供多种功能：

* 查看提交历史
* 分析代码变更
* 在代码库内容中搜索
* 从特定提交中读取文件内容
* 比较文件的不同版本
* 查看分支信息

## 故障排除

## 常见问题及解决方案

1. **服务器未启动**
* 验证 uv 安装: `uv --version`
* 检查 Git 安装: `git --version`
* 确保仓库路径存在且可访问

**2\. 权限错误**

* 验证仓库权限
* 检查配置的路径是否正确
* 确保您对仓库具有读取权限

**3\. 配置未加载**

* 验证配置文件中的 JSON 语法
* 确认配置文件位置
* 在更改后重新启动 Claude Desktop

## 调试步骤

1. 检查 Git 是否正确安装：


```python
git --version
```
2\. 验证仓库访问：


```python
cd /path/to/your/git/repo
git status
```
3\. 直接测试 MCP 服务器：


```python
uvx mcp-server-git --repository /path/to/your/git/repo
```

## 其他配置选项

对于更高级的设置，您可以向配置中添加其他参数：

```python
{
  "mcpServers": {
    "git": {
      "command": "uvx",
      "args": [
        "mcp-server-git",
        "--repository", "/path/to/your/git/repo",
        "--branch", "main",
        "--depth", "100"
      ]
    }
  }
}
```

## 用例

我将通过一些强大的 Git MCP 集成功能以及实际示例进行讲解。稍后我们将讨论一些实际的会议，我可以告诉你一些潜在的陷阱。

## 代码分析与理解

## 代码历史分析

* 你能分析一下 src/main.py 文件在过去 5 次提交中的演变，并解释一下主要做了哪些更改吗？

## 作者贡献

* 谁是身份验证模块的主要贡献者，每个人关注的重点是什么？

## 影响分析

* 在过去一个月中，哪些文件被更改得最频繁？你能识别出代码库中的潜在热点吗？

## 开发洞察

## Bug Pattern Detection

* 你能查看提交历史并识别出错误修复中的模式吗，特别是在 API 端点方面？

## 功能开发跟踪

* 你能给我展示一下用户身份验证功能从最初的实现到现在是如何发展的？

## 代码质量分析

* 查看提交历史，您能识别出我们积累技术债务的领域吗？

## 仓库管理

## 分支分析

* 你能分析当前活跃的分支并总结正在开发的功能吗？

## 合并历史

* 你能给我展示一下主分支过去一个月的合并历史，并识别出任何问题合并吗？

## 发布分析

* 你能分析我们标记的版本并总结各版本之间的主要变化吗？

## 文档与知识管理

## 文档更新

* 你能给我展示一下我们的API文档是如何随着时间演变的吗？

## 变更文档

* 你能帮我理解最近对支付处理模块的更改背景吗？

## 最佳实践分析

* 您能分析我们的提交信息并建议改进我们的文档实践吗？

## 高级搜索与分析

## 复杂代码搜索

* 你能找到我们在所有分支中修改数据库架构的所有实例吗？

## 模式识别

* 你能在我们代码库的不同模块中识别出相似的代码模式吗？

## 安全分析

* 你能查看我们的提交历史并识别出任何意外提交的敏感数据吗？

## 团队协作洞察

## 工作模式

* 你能分析提交模式，以显示我们的团队在何时最活跃和高效吗？

## 代码审查洞察

* 你能分析我们的合并提交信息，以识别我们代码审查过程中常见的模式吗？

## 知识分布

* 你能根据提交历史展示哪些团队成员在代码库的不同部分具有专业知识吗？

## 项目健康指标

## 代码库增长

* 你能告诉我我们的代码库规模是如何随着时间演变的，以及在哪些领域我们增长得最快吗？

## 重构影响

* 你能通过展示重构前后的指标来分析我们最近重构工作的影响吗？

## 测试覆盖率演变

* 你能展示一下我们过去六个月测试覆盖率是如何演变的吗？

## 高级用法实用技巧

1. **与其他MCP服务器结合使用**
* 使用文件系统MCP分析代码及相关文件
* 与GitHub MCP结合进行全面的仓库分析，目前存在一些问题。

**2\. 性能优化**

* 限制分析深度以获得更快的响应
* 在分析大型仓库时使用特定的文件路径

**3\. 最佳实践**

* 定期清理仓库以提高性能
* 结构化的提交信息以便更好地分析
* 标记重要里程碑以便于历史分析

```
## Example code block
def example_function():
    return "This is an example."
```

## 处理多个 Git 仓库

让我解释一下 MCP 如何通过配置处理多个 Git 仓库。

在设置多个 Git 仓库时，您需要在配置中为每个仓库提供一个唯一的标识符。以下是工作原理：


```python
{
  "mcpServers": {
    "git-project1": {
      "command": "uvx",
      "args": [
        "mcp-server-git",
        "--repository", "/path/to/first/repo"
      ]
    },
    "git-project2": {
      "command": "uvx",
      "args": [
        "mcp-server-git",
        "--repository", "/path/to/second/repo"
      ]
    },
    "git-project3": {
      "command": "uvx",
      "args": [
        "mcp-server-git",
        "--repository", "/path/to/third/repo"
      ]
    }
  }
}
```
要点：

1. 标识符（例如，“git\-project1”、“git\-project2”）作为每个仓库的唯一名称
2. 在与 Claude Desktop 交互时，您可以指定要使用哪个仓库：


```python
"请分析我 git-project1 仓库中的提交历史" 
"给我展示 git-project2 的最近更改"
```
3\. 您还可以使用适合您项目的描述性名称：


```python
{   "mcpServers": {     
        "frontend-repo": { ... },     
        "backend-repo": { ... },     
        "docs-repo": { ... }   } }
```
示例工作配置：


```python
{
  "mcpServers": {
    "main-app": {
      "command": "uvx",
      "args": [
        "mcp-server-git",
        "--repository", "/Users/me/projects/main-application",
        "--branch", "main"
      ]
    },
    "api-service": {
      "command": "uvx",
      "args": [
        "mcp-server-git",
        "--repository", "/Users/me/projects/api-service",
        "--branch", "develop"
      ]
    },
    "documentation": {
      "command": "uvx",
      "args": [
        "mcp-server-git",
        "--repository", "/Users/me/projects/docs",
        "--branch", "main"
      ]
    }
  }
}
```
然后在与 Claude Desktop 的互动中，您可以具体说明：


```python
"给我展示 api-service 仓库中的最近提交"
"上周对文档仓库进行了哪些更改？"
"比较 main-app 和 api-service 之间的测试覆盖率"
```
如果同时安装了太多 MCP 服务器工具，这可能会让人感到困惑。我曾经在让 Claude 选择正确的 Git 仓库时遇到困难，因为它会在 GitHub 工具、文件系统工具和 Git 工具之间感到困惑。您必须在提示中相当具体，以便在安装了多个工具时使其正常工作。随着时间的推移，这种情况会有所改善，或者我会变得更好。但这并不是一帆风顺的。

## 调试

在调试 Claude MCP（模型上下文协议）服务器的问题时，特别是当它们未能使用已安装的 MCP 服务器时，请遵循以下系统的故障排除步骤：

## 1\. 验证配置

* **配置文件**：检查您的 `claude_desktop_config.json` 文件配置。如 [MCP-Windows 指南](https://gist.github.com/feveromo/7a340d7795fca1ccd535a5802b976e1f) 中详细说明，该文件应包含指向 MCP 服务器可执行文件和环境变量的正确路径，在 Windows 系统上使用双反斜杠。
* **服务器命令**：根据 [Windows 设置指南](https://www.reddit.com/r/ClaudeAI/comments/1h1mmi8/tutorial_get_mcp_working_on_windows/)，确保正确的服务器启动命令，特别是对于基于 Node.js 的服务器，通过指定 `node.exe` 的完整路径和服务器的 `dist/index.js` 文件。

## 2\. 检查服务器日志

* **启用日志记录**: 按照[官方调试文档](https://modelcontextprotocol.io/docs/tools/debugging)中的建议，实施结构化日志记录以跟踪服务器操作、连接尝试和错误。
* **查看日志**: 在 macOS 上实时监控日志，使用：


```python
tail -n 20 -f ~/Library/Logs/Claude/mcp*.log
```
我发现查看日志非常有帮助。

## 3\. 使用调试工具

* **MCP Inspector**：如[开发者初印象](https://www.chriswere.com/p/anthropics-mcp-first-impressions)中所述，使用MCP Inspector进行交互式调试和资源检查。
* **Claude Desktop Developer Tools**：通过`developer_settings.json`启用Chrome DevTools，以检查客户端错误和网络活动。

## 4\. 常见问题及解决方案

* **连接错误**：对于“无法连接到 MCP 服务器”的错误，请验证系统路径并确保通过 `npm install -g` 安装全局包。
* **Windows 特定问题**：以管理员身份运行 Claude Desktop，启用开发者模式，并验证 Node.js 和 Python 的 PATH 变量。
* **NPM/NVM 问题**：如 [GitHub 问题追踪器](https://github.com/modelcontextprotocol/servers/issues/40) 中所述，建议在 Windows 系统上使用直接的 node 命令，而不是 `npx`。

## 5\. 重启并测试

* 在配置更改后，重启 Claude Desktop。对于 macOS 上快速服务器代码重载，请使用 Command\-R，如 [MCP 故障排除指南](https://www.linkedin.com/pulse/solution-mcp-servers-connection-issues-nvmnpm-chan-meng-a762c) 中所述。

如果在遵循这些步骤后仍然遇到问题，请通过官方支持渠道或社区论坛寻求进一步帮助。


```python
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "--allow-write",
        "/Users/richardhightower/src",
        "/Users/richardhightower/clients"
      ]
    },
    "brave-search": {
      "command": "npx",
      "args": [
          "-y",
          "@modelcontextprotocol/server-brave-search"
      ],
      "env": {
          "BRAVE_API_KEY": "MY_ACTUAL_KEY"
      }
    },
    "git-markdown": {
      "command": "uvx",
      "args": [
        "mcp-server-git",
        "--repository",
        "/Users/richardhightower/src/project-markdown-creator"
      ]
    },
    "git-meeting-buddy": {
      "command": "uvx",
      "args": [
        "mcp-server-git",
        "--repository",
        "/Users/richardhightower/src/meeting_buddy/pythonProject"
      ]
    }
  }
}
```

## Claude Desktop

安装并重启 Claude Desktop 后，您应该会看到以下工具：

## Git

## git\_add

将文件内容添加到暂存区

*来自服务器: git\-meeting\-buddy*

## git\_commit

记录对仓库的更改

*来自服务器: git\-meeting\-buddy*

## git\_create\_branch

从可选的基础分支创建一个新分支

*来自服务器: git\-meeting\-buddy*

## git\_diff\_staged

显示已暂存以待提交的更改

*来自服务器：git\-meeting\-buddy*

## git\_diff\_unstaged

显示尚未暂存的工作目录中的更改

*来自服务器: git\-meeting\-buddy*

## git\_log

显示提交日志

*来自服务器: git\-meeting\-buddy*

## git\_reset

取消所有已暂存的更改

*来自服务器: git\-meeting\-buddy*

## git\_status

显示工作树状态

*来自服务器：git\-meeting\-buddy*

打开 Claude Desktop，并点击初始聊天窗口右下角的工具图标（锤子符号）。这将显示您已安装 Git MCP 服务器插件。

您应该看到以下 Git MCP 服务器插件工具。

## 示例会话 1

RH (我):

你能给我看一下我仓库中的最近提交吗？

Claude:

*我需要你仓库的路径来检查提交历史。你能提供仓库路径吗？*

RH:

“git\-meeting\-buddy”: { “command”: “uvx”, “args”: \[ “mcp\-server\-git”, “ — repository”, “/Users/richardhightower/src/meeting\_buddy/pythonProject” ] },

Claude:

我将检查你位于 `/Users/richardhightower/src/meeting_buddy/pythonProject` 的仓库的提交历史。

从 git\_log 查看 git\-meeting\-buddy (本地)

`{` repo\_path`:` /Users/richardhightower/src/meeting\_buddy/pythonProject `}`

\`提交历史： 提交: 98eec5eeaeb42efffe38ee22a1b1f5fac099144e 作者: Rick Hightower 日期: 2024–12–04 15:40:55–06:00 消息: 改进了录音功能，使其在出现任何问题时能够重新启动

提交: f1a84b3f252fbb8ca604ac45a1e0bf65a728119b 作者: Rick Hightower 日期: 2024–11–19 08:12:00–06:00 消息: 修复了损坏的 [all.md](http://all.md) 引用

提交: c166784576b08087dfd0a473e17cdc3f031317f8 作者: Rick Hightower 日期: 2024–11–13 18:34:40–07:00 消息: 更新到 markdown

提交: 7192ec2ca52cbdb7ca17d082815711b3645a07d2 作者: Rick Hightower 日期: 2024–11–13 08:37:33–07:00 消息: 会议记录

提交: d74e1541b52c98dc865c261236985cbbd96aa94d 作者: Rick Hightower 日期: 2024–10–31 12:20:36–05:00 消息: 更新清理以创建上下文文件以开始

提交: fb248cbd855bf7c652bdbf0550889cf9fd9fb6c3 作者: Rick Hightower 日期: 2024–10–30 11:14:54–05:00 消息: 新分支

提交: e20bcffb44a6d14ec692a70c4783d9a3c020aeda 作者: Rick Hightower 日期: 2024–10–29 15:33:30–05:00 消息: 改进了问题模拟

提交: 8e96a3b0e3571da2e7764caa25d41c729606529b 作者: Rick Hightower 日期: 2024–10–29 14:52:06–05:00 消息: 添加了一个新选项卡以查看问题回答状态

提交: 85d5bddfe6685b0a0c83fc44c1cbb02708bc933d 作者: Rick Hightower 日期: 2024–10–29 14:33:24–05:00 消息: 初步尝试添加问题状态

提交: 36fa5085b777dafde19470de9566f61c74970d09 作者: Rick Hightower 日期: 2024–10–29 01:47:58–05:00 消息: 添加了检测和回答推理问题的能力\`

Claude

*最近的提交（12月4日）改进了录音重新启动功能。早期的提交显示了对 markdown 更新、会议记录和问答功能的工作。你想查看任何特定提交的详细信息吗？*

注意到 Claude 需要澄清使用哪个仓库。当你配置了多个仓库或工具时，提前提供更具体的上下文会很有帮助，如下一个会话所示。我发现安装较少的 MCP 工具/服务器意味着 Claude 更少困惑。

在下一个会话中，我更具体地说明我的请求，Claude 立刻就知道了。

## 示例会话 2

RH:

你能给我展示一下我在 git 仓库中的最近提交吗 (/Users/richardhightower/src/meeting\_buddy/pythonProject)?

Claude:

查看来自 git\_log 的结果 git\-meeting\-buddy (本地)

`{` repo\_path`:` /Users/richardhightower/src/meeting\_buddy/pythonProject `}`

\`提交历史： 提交: 98eec5eeaeb42efffe38ee22a1b1f5fac099144e 作者: Rick Hightower 日期: 2024–12–04 15:40:55–06:00 消息: 改进录制功能，以便在出现问题时重新启动

提交: f1a84b3f252fbb8ca604ac45a1e0bf65a728119b 作者: Rick Hightower 日期: 2024–11–19 08:12:00–06:00 消息: 修复损坏的 [all.md](http://all.md) 引用

提交: c166784576b08087dfd0a473e17cdc3f031317f8 作者: Rick Hightower 日期: 2024–11–13 18:34:40–07:00 消息: 更新到 markdown

提交: 7192ec2ca52cbdb7ca17d082815711b3645a07d2 作者: Rick Hightower 日期: 2024–11–13 08:37:33–07:00 消息: 会议记录

提交: d74e1541b52c98dc865c261236985cbbd96aa94d 作者: Rick Hightower 日期: 2024–10–31 12:20:36–05:00 消息: 更新清理以创建上下文文件以开始

提交: fb248cbd855bf7c652bdbf0550889cf9fd9fb6c3 作者: Rick Hightower 日期: 2024–10–30 11:14:54–05:00 消息: 新分支

提交: e20bcffb44a6d14ec692a70c4783d9a3c020aeda 作者: Rick Hightower 日期: 2024–10–29 15:33:30–05:00 消息: 改进问题模拟

提交: 8e96a3b0e3571da2e7764caa25d41c729606529b 作者: Rick Hightower 日期: 2024–10–29 14:52:06–05:00 消息: 添加一个新标签以查看问题回答状态

提交: 85d5bddfe6685b0a0c83fc44c1cbb02708bc933d 作者: Rick Hightower 日期: 2024–10–29 14:33:24–05:00 消息: 初步尝试添加问题状态

提交: 36fa5085b777dafde19470de9566f61c74970d09 作者: Rick Hightower 日期: 2024–10–29 01:47:58–05:00 消息: 添加检测和回答推理问题的能力\`

*这些是你仓库中最近的 10 次提交。最新的提交来自 12 月 4 日，改进了录制功能，早期的提交包括 markdown 更新、会议记录以及各种功能的添加，如问题模拟和状态跟踪。*

## 示例会话 3

**RH:**

使用这个 MCP 工具：

“git\-meeting\-buddy”: {

“command”: “uvx”, “args”: \[ “mcp\-server\-git”, “ — repository”, “/Users/richardhightower/src/meeting\_buddy/pythonProject” ] }, ….

在过去一个月中，哪些文件被更改得最频繁？你能识别出代码库中的潜在热点吗？

Claude:

*让我分析 git 仓库以识别频繁更改的文件和潜在热点。*

*查看来自 **git\_log** 的结果，来自 **git\-meeting\-buddy**（本地）*

*让我获取这些提交中更改的具体文件。*

*查看来自 **git\_status** 的结果，来自 **git\-meeting\-buddy**（本地）*

*根据提交历史，以下是关键发现：*

1. *主要开发热点（上个月）：*
* *录音功能（最近的更改）*
* *问题处理和答案检测系统*
* *会议记录处理*
* *UI/布局改进*

*2\. 显著活动模式：*

* *高强度开发期：10 月 24 日至 29 日（每天多个提交）*
* *近期专注于录音可靠性（12 月 4 日）*
* *文档和 markdown 更新（11 月中旬）*

*3\. 核心功能领域：*

* *问题模拟和答案处理*
* *会议记录格式化和上下文管理*
* *录音系统*
* *UI 组件（选项卡、查看器、答案显示）*

*为了获得更具体的文件级热点，我建议：*

*仅根据提交信息，代码库显示出集中活动的区域：*

1. *录音系统（高优先级组件，最近有修复）*
2. *问题/答案处理（10 月底的多次迭代）*
3. *UI 组件（定期更新）*
4. *文档/Markdown 处理*

*你想让我更详细地分析某个特定组件吗？*

Claude 遇到了一些问题，因为我安装了多个服务器：文件系统、几个 GitHub 服务器和几个 Git 服务器。我需要明确指定希望 Claude 使用哪个 MCP 工具——即使这样，有时它仍会选择错误的工具。我通过减少活动工具的数量来解决这个问题。由于 MCP 仍然非常新，我预计这些问题会随着时间的推移而改善。这可能只是精炼提示工程以实现无缝性能的问题。

## 结论

设置和使用 Model Context Protocol (MCP) Git 集成与 Claude Desktop 提供了强大的代码分析和代码库交互能力。尽管该技术仍处于早期阶段，并可能在多个工具配置上存在一些挑战，但潜在的好处是显著的。

实施 MCP Git 集成的关键要点包括：

* 在提供代码库路径和工具配置时要具体，以确保准确的响应
* 尽量减少活跃的 MCP 工具数量，以减少混淆并提高可靠性
* 随着技术的成熟和提示工程的发展，预计将会有持续的改进

随着 MCP 的不断发展，它有望成为开发人员与 AI 助手（如 Claude）合作时越来越有价值的工具，使得更复杂的代码分析和版本控制集成成为可能。

## 关于作者

[**认识 Rick Hightower**](https://www.notion.so/About-133d6bbdbbea813aa509e9585e6867fe?pvs=21)，一位拥有超过三十年企业软件开发经验的软件架构师和技术专家。他还是一名 TensorFlow 认证开发者，并且是 [斯坦福大学机器学习/人工智能专业的毕业生](https://www.notion.so/About-133d6bbdbbea813aa509e9585e6867fe?pvs=21)。Rick 专注于推动人工智能和数据工程，并擅长通过技术出版物分享他的知识以及为开源项目做贡献。

最近，Rick 一直站在人工智能创新的前沿，专注于大数据工程和创建人工智能驱动的解决方案。他正在进行一些很酷的项目，例如：

* **人工智能文档处理**：他使用 AWS Bedrock 和生成式人工智能快速提取文档中的数据，并在几分钟内生成交付物，而不是通常需要几个月的时间。
* **基于 RAG 的专家系统**：他设计并设置了使用 LLM（如 ChatGPT 和 Claude）的检索增强生成（RAG）系统。他甚至将这些系统与 Google Cloud 集成，用于文档和代码的索引。
* **会议工具**：他开发了能够实时检测问题、总结会议并提取行动项的工具。这大大提高了工作场所的生产力。
* **AR/VR 可扩展性**：他与一家初创公司合作，在 Azure Kubernetes Service (AKS) 上扩展后端服务。他们部署了七个具有先进负载均衡和缓存机制的服务。
* **法律人工智能自动化**：他使用人工智能分析法律文件并发现有价值的见解。这为客户节省了大量资金，并提高了他们的效率。

作为一名导师和思想领袖，Rick 在会议和研讨会上分享了他对人工智能、数据工程和企业软件如何改变世界的看法。他在解决棘手问题方面采取务实的方法，并在技术社区中受到高度尊重。

## Rick的最新文章

1. [文章概览](https://rick-hightower.notion.site/articles)
2. [在Brave Search中设置Claude](https://www.notion.so/Anthropic-s-new-MCP-Integration-Streamlining-AI-Assistant-Agentic-Capabilities-with-Brave-Search-an-14fd6bbdbbea80d7b372c9b67ca82ec8?pvs=21)
3. [设置Claude文件系统MCP](https://www.notion.so/Setting-up-Claude-Filesystem-MCP-14dd6bbdbbea806c8acae1f350ad234a?pvs=21)
4. [Rick和Chris评审机器学习](https://rick-hightower.notion.site/rick-and-chris-review-machine-learning?pvs=25)
5. [Streamlit冒险第5部分文章](https://rick-hightower.notion.site/streamlit-adventures-part-5-file-viewer-streamlit-refresh?pvs=25)
6. [Streamlit第4部分：表单验证第2部分](https://rick-hightower.notion.site/article-streamlit-part-4-form-validation-part-2?pvs=25)
7. [Streamlit第3部分 — 表单验证第1部分](https://rick-hightower.notion.site/article-streamlit-part-3?pvs=25)
8. [ETL的高级SQL技术](https://rick-hightower.notion.site/advanced-sql-techniques-for-etl?pvs=25)
9. [Streamlit第2部分：布局、组件和图表](https://rick-hightower.notion.site/streamlit-part-2-layouts-components-and-graphs?pvs=25)
10. [在公园散步时关于Streamlit的对话](https://rick-hightower.notion.site/conversation-about-streamlit-while-walking-in-the-park?pvs=25)
11. [PrivateGPT和LlamaIndex](https://www.notion.so/133d6bbdbbea813e9a77eeff437a145a?pvs=21)
12. [OpenAI的最新进展](https://www.notion.so/133d6bbdbbea81c6b889fcf7ecdd9935?pvs=21)
13. [面向产品经理的AI驱动知识库](https://www.notion.so/133d6bbdbbea81b6a208f09cad8ae1d2?pvs=21)
14. [在Azure云上大规模使用ChatGPT](https://www.notion.so/133d6bbdbbea815cb0c6d5a398133068?pvs=21)
15. [使用CoT和合成提示进行提示工程第2部分](https://www.notion.so/134d6bbdbbea80b3bc45e245060c81af?pvs=21)
16. [理解LLMs及使用思维链](https://www.notion.so/134d6bbdbbea8043be90d741028424e2?pvs=21)
17. [Meta的Llama 2 AI模型](https://www.notion.so/134d6bbdbbea80f0ad35e3004c998249?pvs=21)
18. [ChatGPT嵌入和HyDE以改善搜索](https://www.notion.so/134d6bbdbbea8002b17bfc5c7b81a69a?pvs=21)
19. Rick撰写了[Cloudurable网站上的所有博客文章和文章](https://cloudurable.com/blog/index.html)

