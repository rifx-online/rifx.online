---
title: "掌握Mastodon机器人！用Python轻松创建社交媒体助手的实用指南"
meta_title: "掌握Mastodon机器人！用Python轻松创建社交媒体助手的实用指南"
description: "Mastodon作为去中心化社交网络，支持自动化程序（bots）执行任务。本文介绍了如何使用Python创建Mastodon bots，并探讨其潜在的益处与风险。"
date: 2024-12-28T02:07:34Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*RZXwxa8tTe24Ch7cJwUGbQ.png"
categories: ["Programming", "Technology/Web", "Ethics"]
author: "Rifx.Online"
tags: ["Mastodon", "Python", "bot", "API", "hashtag"]
draft: False

---

我最近在 Mastodon 上发布了一条帖子，在两分钟内被六个其他账户分享。出于好奇，我访问了这些账户的个人资料，发现至少其中一个是技术机器人——这些账户会根据标签（如 \#datascience 或 \#opensource）自动分享帖子。

Mastodon 目前作为 X（前身为 Twitter）的去中心化替代品正在迅速增长。在这样一个平台上，机器人如何能让我们的日常生活更轻松？风险又是什么？机器人是丰富还是破坏社交网络？我该如何使用 Mastodon API 自己创建一个机器人？

在本文中，我不仅会向您展示机器人的一般工作原理，还会提供一个逐步的指南，包含代码示例和屏幕截图，教您如何使用 Python 创建一个 Mastodon 机器人并使用 API。

> **目录**1 — Mastodon 和技术机器人为什么存在？2 — 社交网络上机器人的技术基础3 — 机器人：利益与风险之间的平衡4 — 如何创建一个 Mastodon 机器人：使用 Python 的逐步说明最后的思考

## 1 — 为什么 Mastodon 和技术机器人存在？

Mastodon 是一个去中心化的社交网络，由 Eugen Rochko 于 2016 年在德国开发。该平台是开源的，基于一组服务器共同形成所谓的“联邦宇宙”。如果您想分享帖子，您可以选择一个服务器，例如 mastodon.social 或 techhub.social，并在该服务器上分享您的帖子。Medium 也在 me.dm 上拥有自己的服务器。每个服务器设定自己的规则和管理指南。

机器人基本上是执行任务的自动化软件应用程序。例如，有一些简单的机器人，如爬虫机器人，负责搜索互联网并索引网站。其他机器人可以为您执行重复性任务，例如发送通知或处理大量数据（自动化机器人）。社交媒体机器人更进一步，通过分享帖子或对内容做出反应，从而与平台进行互动。例如，一个机器人可以收集并分享来自科技行业的最新新闻，以便该机器人资料的关注者始终保持最新——这个机器人成为一个根据精确定义的算法进行策展的策展人……

聊天机器人也是一种特定类型的机器人，通常用于客户支持。例如，它们主要是为了与我们人类进行对话而开发的，更加注重自然语言处理（NLP），以便理解我们的语言并尽可能有意义地做出回应。目前正在讨论的代理则是机器人和聊天机器人的进一步发展：代理通常可以承担更复杂的任务，从数据中学习并独立做出决策。

有趣的事实：Eliza 是在麻省理工学院开发的聊天机器人，早在 1960 年就能够模拟简单的对话。65 年后，我们已经进入了代理的世界……

[*参考：ELIZA-聊天机器人*](https://en.wikipedia.org/wiki/ELIZA)

然而，机器人也可以通过自动传播虚假或误导性信息在社交网络上传播虚假信息，以操纵公众舆论。例如，在政治选举或危机情况下，常常观察到此类恶搞机器人。不幸的是，它们有时也被用于垃圾邮件、数据抓取、DDoS 网络攻击或自动售票。因此，我们必须负责任地对待自动化机器人。

## 2 — 社交网络上的机器人技术基础

简单来说，您需要这三种要素来创建一个机器人：

1. 编程语言：常见的编程语言有 Python 或 JavaScript（使用 Node.js）。但您也可以使用 Ruby 或 PHP 等语言。
2. API 访问：您的机器人向社交网络的应用程序编程接口（API）发送请求，并接收响应。
3. 托管：您的机器人必须托管在 Heroku、AWS、Replit 或 Google Cloud 等服务上。或者，您可以在本地运行，但这更适合测试。

**编程语言** 机器人的热门语言是 Python 或 JavaScript — 具体取决于需求和目标平台。Python 提供了许多有用的库，例如用于 Twitter 的 Tweepy（但由于 Twitter-X 的变化，目前使用受到限制）、用于 Mastodon API 的 Mastodon.py 或用于管理 Reddit 帖子和评论的 Python Reddit API Wrapper（PRAW）。如果您的机器人需要实时通信、服务器端请求或与多个 API 的集成，Node.js 特别适合。有一些库，例如 mastodon-api 或 Botpress，支持多个渠道。另一方面，对于 Facebook 和 Instagram 上的机器人，您需要使用 Facebook Graph API，该 API 的限制更严格。而对于 LinkedIn，您可以使用 LinkedIn REST API，该 API 更适合公司页面。

**API** 大多数现代社交网络 API 基于 REST 架构。该 API 架构使用 HTTP 方法，例如 GET（获取数据）、POST（发送数据）、PUT（更新数据）或 DELETE（删除数据）。对于许多平台，您需要一种安全的方法，例如 OAuth2，以便您的机器人可以访问 API：为此，您首先需要在平台上注册您的机器人，以获得客户端 ID 和客户端密钥。这些凭据用于请求访问令牌，然后与每个 API 请求一起发送。

**托管** 一旦您的机器人准备就绪，您需要一个可以运行机器人的环境。您可以在本地进行测试或原型开发。对于长期解决方案，有 AWS、Google Cloud 或 Heroku 等云托管平台。为了确保您的机器人在服务器环境之外也能独立正常工作，您可以使用 Docker，它将您的机器人与所有必要的设置、库和依赖项打包在一个标准化的“包”中，可以在任何服务器上启动。

此外，您可以通过定时任务自动化您的机器人，在特定时间（例如每天早上 8:00）或在某些事件发生时（例如共享了带有特定标签的帖子）运行您的机器人。



## 3 — Bots: 利益与风险之间的平衡

在机器人之间，质量差异很大——一个编程良好的机器人能够高效地响应请求并提供附加价值，而一个设计不佳的机器人则可能不可靠甚至造成干扰。如开头所述，机器人是一种执行自动化任务的软件应用程序：机器人的质量取决于底层算法的编程方式、在 AI 机器人情况下所提供的数据，以及设计和交互的结构。

那么我们如何创建伦理负责的机器人呢？

1. 透明性：用户需要知道他们正在与机器人而非人类互动。掩盖这一点的机器人只会破坏对技术的信任。例如，Mastodon 有一条规定，机器人的个人资料必须清晰标注。机器人也可以在每次互动或帖子中添加一小段说明，以明确互动来源于机器人。
2. 不得操控：机器人不得用于传播虚假信息或有针对性地操控用户。
3. 尊重平台和人：机器人必须遵循各自平台的规则。
4. 必须尊重数据保护：例如，如果机器人分析用户资料，必须确保机器人不存储不应存储的数据，或者必须明确谁可以访问这些数据以及如何使用，以遵守如欧洲 GDPR 等数据保护法律。

### 机器人是好是坏？机器人是破坏社交网络还是丰富它们？

在我看来，能够自动化重复任务的技术总是有价值的。一方面，开发良好的机器人可以为我们提供有价值的信息，激发讨论或作为策展人的支持。另一方面，机器人也可能传播垃圾信息，表现出歧视或主导讨论。在我看来，这种技术在作为支持工具时最为有用。

让我们想象一下一个社交平台，仅由训练好的机器人进行讨论——在我看来，那将是一个相当无聊的平台——缺少人性。互动会有一种“淡淡的后味”。此外，谈到自动化，我常常认为，尽管技术能够更“完美”地完成任务，但与由专业且细致的人类执行任务相比，创造力和热情是缺失的。人性化的触感和不可预见性也缺失了。

## 4 — 如何创建一个Mastodon机器人：使用Python的逐步说明

我们想要创建一个机器人，定期搜索带有标签\#datascience的Mastodon帖子，并自动转发这些帖子。

### 开始所需的一切

* 必须在您的设备上安装 Python。
  新手提示：在 Windows 上，您可以在 Powershell 中使用 ‘python — version’ 来检查您是否已经安装了 Python。
* 您需要一个 IDE，例如 Visual Studio Code，以创建 Python 文件。
* 可选：如果您使用 Anaconda 发行版，最好使用 ‘conda create — name NameEnvironment python\=3\.9 \-y’ 创建一个新项目，并在此项目中安装库，以便库之间没有依赖关系。
  新手提示：然后您可以使用 ‘conda activate NameEnvironment’ 激活环境。 \-y 表示在安装过程中自动接受所有确认。

### 1\) 安装 Mastodon.py 库

首先，我们使用 pip 安装 Mastodon.py：

```python
pip install Mastodon.py
```

新手提示：使用 ‘pip — version’ 可以检查是否已安装 pip。如果没有显示版本，可以使用 ‘conda install pip’ 安装 pip。

### 2\) 在 techhub.social 上为机器人注册应用

如果您还没有 techhub.social 的账户，请注册。techhub.social 自称是一个面向热情技术人员的 Mastodon 实例，并在规则中说明，机器人必须在其个人资料中标记为 Bot。

我们现在使用 ‘Mastodon.create\_app()’ 函数为我们的机器人注册应用。为此，我们创建一个名为 ‘register\_app.py’ 的 Python 文件，并插入以下代码：在此代码中，我们向 Mastodon 注册机器人以获取 API 访问权限，并保存必要的访问数据。首先，我们使用 ‘Mastodon.create\_app()’ 创建应用。我们将客户端凭据保存在文件 ‘pytooter\_clientcred.secret’ 中。然后我们登录 Mastodon 以生成用户凭据。我们将这些保存在另一个文件 ‘pytooter\_usercred.secret’ 中。我们添加错误处理以捕获诸如登录数据不正确等问题。

```python
from mastodon import Mastodon, MastodonIllegalArgumentError, MastodonUnauthorizedError

try:
    # Step 1: Creating the app and saving the client-credentials
    Mastodon.create_app(
        'pyAppName',  # Name of your app
        api_base_url='https://techhub.social',  # URL to the Mastodon instance
        to_file='pytooter_clientcred.secret'  # File to store app credentials
    )
    print("App registered. Client-Credentials are saved.")

    # Step 2: Login & Saving of the User-Credentials
    print("Log in the user...")
    mastodon = Mastodon(
        client_id='pytooter_clientcred.secret',
        api_base_url='https://techhub.social'
    )

    mastodon.log_in(
        'useremail@example.com',  # Your Mastodon-Account-Email
        'YourPassword',  # Your Mastodon-Password
        to_file='pytooter_usercred.secret'  # File to store user credentials
    )
    print("Login successful. User-Credentials saved in 'pytooter_usercred.secret'.")

except MastodonUnauthorizedError as e:
    print("Login failed: Invalid email or password.")
except MastodonIllegalArgumentError as e:
    print("Login failed: Check the client credentials or base URL.")
except Exception as e:
    print(f"An unexpected error occurred: {e}")
```

然后我们在 Anaconda 提示符中输入此命令以执行脚本：

```python
python register_app.py
```

如果一切顺利，您将在目录中找到文件 ‘pytooter\_clientcred.secret’，该文件包含在注册应用时生成的应用特定凭据。此外，还应该有文件 ‘pytooter\_usercred.secret’，其中包含用户特定的访问数据。这些信息是在成功登录后生成的。

您将在终端中看到以下输出：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*IgSKO4uM6ENiiFTnUixXHg.png)

新手提示：在 Mastodon 中，Tooten 用于表示发布帖子（类似于在 Twitter 上发推）。这两个秘密文件包含敏感信息。重要的是您不要公开分享它们（例如，不要将它们添加到您的 GitHub 仓库）。如果您想使用 2FA，您必须使用 OAuth2 流程。如果您在桌面应用程序中打开您的 Mastodon 账户，您可以在设置中检查此设置：设置 > 账户 > 双因素认证。

### 3\) 通过 API 发布测试帖子

一旦注册和登录成功，我们创建一个额外的文件 ‘test\_bot.py’ 并使用以下代码。首先，我们从 ‘pytooter\_usercred.secret’ 加载用户凭证，并连接到 Mastodon API。使用 ‘mastodon.toot()’ 我们指定要发布的内容。我们在终端中显示一条确认信息，表示 toot 已成功发送。

```python
from mastodon import Mastodon

mastodon = Mastodon(
    access_token='pytooter_usercred.secret',
    api_base_url='https://techhub.social'
)

mastodon.toot('Hello from my Mastodon Bot! #datascience')
print("Toot gesendet!")
```

我们将文件保存在与之前文件相同的目录中。然后我们使用以下命令在终端中打开文件：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*SXheCoAvFCpOmrCEgFUzIg.png)

在 Mastodon 上，我们看到帖子已成功发布：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*D0-q4W1g4KUv4zIqFUeSUA.png)

### 4\) 使用特定标签转发帖子

现在我们想要实现的是，机器人搜索带有标签 \#datascience 的帖子并重新分享它们。

在第一步中，我们创建一个新的文件 ‘reblog\_bot.py’，并包含以下代码：使用 ‘reblog\_datascience()’ 函数，我们首先通过加载 ‘pytooter\_usercred.secret’ 中的用户凭证连接到 Mastodon API。然后，机器人使用 ‘timeline\_hashtag()’ 检索带有标签 \#datascience 的最后 3 条帖子。通过 ‘status\_reblog()’，我们自动分享每条帖子，并在终端中显示分享帖子的 ID。

为了避免过载，API 允许每个账户在 5 分钟内最多进行 300 次请求。通过 ‘limit\=3’，我们指定一次只重新分享 3 条帖子——因此这不是问题。

```python
from mastodon import Mastodon

def reblog_datascience():
    mastodon = Mastodon(
        access_token='pytooter_usercred.secret',
        api_base_url='https://techhub.social'
    )
    # Retrieve posts with the hashtag #datascience
    posts = mastodon.timeline_hashtag('datascience', limit=3)
    for post in posts:
        # Reblogging posts
        mastodon.status_reblog(post['id'])
        print(f"Reblogged post ID: {post['id']}")

## Run the function
reblog_datascience()
```

一旦你运行这个文件，3 条帖子将会在你的个人资料中被转发，你将在终端中看到这 3 条帖子的 ID：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*GnK0ojDH-9FluWobH4bdxA.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Hi1tvnBZnRdLLuOql6awNQ.png)

*注意：我已经从我的 Mastodon 账户中删除了这些帖子，因为我的个人资料没有标记为机器人。*

## 最后的想法

我们可以进一步扩展这个机器人，例如添加功能，以便不重新发布重复的帖子，或者捕获并记录错误消息（例如由于缺少授权）。我们还可以将机器人托管在 AWS、Google Cloud 或 Heroku 等平台上，而不是在本地计算机上运行。对于自动执行，设置调度程序也是有意义的。例如，在 Windows 上，可以使用任务调度程序进行尝试。这将定期运行机器人（例如，每天早上 8:00），即使终端关闭。在 Linux 或 Mac 上，我们可以使用 cron 作业等替代方案。

就像几乎所有技术一样，如果我们以深思熟虑、符合伦理和数据保护的方式使用它们，机器人可以带来巨大的好处。然而，如果我们滥用它们，它们也可能会扰乱社交平台。


