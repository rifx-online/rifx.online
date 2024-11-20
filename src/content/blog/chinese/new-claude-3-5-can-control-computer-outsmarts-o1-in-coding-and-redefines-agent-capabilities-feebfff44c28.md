---
title: "新版 Claude 3.5 可以控制计算机：在编码方面超越 o1，重新定义代理能力"
meta_title: "新版 Claude 3.5 可以控制计算机：在编码方面超越 o1，重新定义代理能力"
description: "Claude 3.5 Sonnet和Haiku是Anthropic推出的最新AI模型，具备超越OpenAI o1的编码能力和人机交互功能。Claude 3.5 Sonnet在编码基准测试中得分49%，成为编码领域的领导者。新功能允许Claude像人类一样与计算机互动，执行复杂任务并自动化工作流程。尽管目前表现仍低于人类，但其潜力巨大，预示着未来在各行业的广泛应用和工作流程的变革。"
date: 2024-11-20T00:44:10Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*4T6LjksFhgZLM8T-.png"
categories: ["Programming", "Machine Learning", "Chatbots"]
author: "Rifx.Online"
tags: ["coding", "interaction", "benchmarks", "automation", "tasks"]
draft: False

---



### Anthropic的突破性AI，Claude 3.5，像人类一样使用计算机，并在自动化领域成为游戏规则改变者



## 作者

* [杨子健](https://www.linkedin.com/in/zijian-yang/) (**ORCID:** [0009–0006–8301–7634](https://orcid.org/0009-0006-8301-7634))

## 介绍

Claude 3\.5 一夜之间获得重大升级！

正如预期，Anthropic AI 本周推出了 Claude 3\.5 Haiku，这一重大举措。新升级的 Claude 3\.5 Sonnet 也已发布。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*wmWsAR7MvyUWujJN.png)

然而，备受期待的“超”版本 Opus 仍然没有出现。

值得注意的是，进化后的 Claude 3\.5 Sonnet 超越了 OpenAI o1，确立了自己作为最强推理模型的地位。新的 Claude 3\.5 Sonnet 在基于真实 GitHub 问题的最具挑战性的编码基准测试中得分达到 49%，由 SWE\-Bench 验证。

* Cosine Genie 得分 43\.8%
* o1\-preview 得分 41\.4%
* o1\-mini 得分 35\.8%

在编写代码方面，Claude 是所有模型中无可争议的领导者。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*6FXXH5oj6GiIhTM1.png)

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*wwBZjGITrMUfBld2.png)

Claude 3\.5 Haiku 的性能与之前顶级的 Claude 3 Opus 相当，同时在成本和速度上与上一代 Haiku 保持相似。

令人惊讶的是，Claude 现在可以像人类一样与计算机互动，包括查看屏幕、移动光标、点击按钮和输入文本！

根据 Anthropic 开发者关系负责人所说，“计算机使用”是人机交互新范式的第一步。这也是 AI 模型应该具备的基本能力。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*k-Z1mjBir5d4FXxz.png)

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*rtP-rdTWzPpDibDh.png)

许多开发浏览器代理的初创公司一夜之间变得过时。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*TBIKB3Ei4FBpEar-.png)

网友们惊呼，代理和工作流程即将发生剧变……

## 能够使用计算机的人工智能？

在其公开试用期间，Anthropic推出了一项突破性的功能：计算机使用能力。从今天开始，开发者可以通过API指导Claude像人类一样使用计算机。

Claude 3\.5 Sonnet是第一个在公开试用中提供此功能的模型。

当然，这项功能仍然处于实验阶段，其使用可能有些笨拙且容易出错。Anthropic选择了提前发布，以收集开发者的反馈并迅速改进。

为什么要训练人工智能操作计算机？

Anthropic表示，在过去几年中，强大的人工智能开发已经达到了许多里程碑，例如执行复杂的逻辑推理以及识别和理解图像。

下一个突破是人工智能操作计算机！如果模型能够按照指示使用所有软件，而无需特别定制的工具，这无疑代表了未来的发展方向。

## 基本计算机操作

在这个演示中，一位Anthropic研究员向Claude提出了一个极具挑战性的任务：

> *我的朋友明天早上要来旧金山，我想和他一起观看金门大桥的日出。我们从太平洋高地出发。你能帮我们找到一个绝佳的观景点，检查驾驶时间和日出时间，然后安排一个日历事件，以便我们有足够的时间到达吗？*

Claude独立地打开了Google并开始搜索。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*mMw3vFXFQnUwbmM1.gif)

金门大桥距离用户的位置有多远？Claude可以独立打开地图来查找距离。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*ZwDc-iPGN7hmATJg.gif)

在收集到必要的信息后，它打开了日历并为用户安排了事件。

欲了解更多演示，请查看视频：[链接](https://www.youtube.com/watch?v=jqx18KgIzAE)

## 自动化网站编码

开发者演示了Claude如何控制他们的笔记本电脑，顺利完成网站编程任务。首先，Claude在开发者的Chrome浏览器中导航到[Claude.ai](http://claude.ai/)，并指示Claude创建一个90年代风格的个人主页。

它输入了网址，输入了提示，并向另一个Claude发送了请求。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*PuIAk9VzeuS6Qg5I.gif)

Claude.ai返回了一些代码，渲染后的页面看起来很不错，但开发者希望在他们的计算机上进行一些本地修改。

因此，他们指示Claude下载文件并在VS Code中打开它们。Claude成功完成了这些任务。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*DrL8-D7EeKvTA1_e.gif)

然后，开发者要求Claude启动一个服务器以在浏览器中查看文件。

Claude打开了VS Code终端并尝试启动服务器，但遇到了一个错误：机器上没有安装Python。

通过查看终端输出，Claude识别出了问题，并成功使用Python 3运行了服务器。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*w36XEPCEQ4qbYip5.gif)

然而，终端输出中出现了一个错误，并且顶部缺少一个文件图标。开发者要求Claude识别错误并在文件中修复它。

令人惊讶的是，Claude在VS Code中找到了导致错误的那一行，删除了整行，保存了文件，并重新启动了网站。

这一次，网站完美显示！

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*MjCXohupau-u_SwE.png)

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*WMwENihCCA0_Roav.png)

完整视频：[链接](https://www.youtube.com/watch?v=vH2f7cjXjKI)

## 自动数据获取以填写表单

假设我们需要填写来自“Ant Equipment Company”的供应商请求表单，但所需的数据分散在计算机上。Claude能帮助我们吗？

它开始时截取了开发者屏幕的截图，并迅速注意到表单中没有列出Ant Equipment Company。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*oOeISjAqAjZQOlZm.gif)

此时，它立即切换到CRM系统以搜索该公司。在找到后，Claude浏览了页面以查找表单所需的所有信息，然后提交了表单。

这意味着我们工作中的许多繁琐任务可以委托给Claude！

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*9zljtI_ppbi1Kl5L.gif)

现在，这一功能在API中可用。

几家知名公司，如Asana、Canva、Cognition、DoorDash、Replit和The Browser Company，正在探索Claude在执行多步骤复杂任务方面的潜力。例如，Replit正在利用Claude 3.5 Sonnet的计算机使用和用户界面导航能力，为Replit Agent开发功能，以便在应用程序开发过程中进行实时评估。

完整视频：[链接](https://www.youtube.com/watch?v=ODaHJzOyVCQ)

## 远低于人类表现，但前景可期

新升级的Claude 3.5 Sonnet在计算机使用方面的表现如何？

在OSWorld测试中，它在仅基于截图的任务中得分14.9%，显著超过第二名的AI系统，后者得分为7.8%。

当允许更多操作步骤完成任务时，Claude的得分增加到22.0%。

这表明与环境的多次互动可以优化任务表现。

虽然这一结果显示出显著的改善，但仍远低于人类表现水平72.36%。

这表明Claude 3.5 Sonnet在未来仍有很大的改进空间。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*l7xZFLnX_4HfNevL.png)

毕竟，人类轻松完成的一些操作（滚动、拖动、缩放）目前对Claude来说仍然相当具有挑战性。

## 升级版 Claude 3\.5 Sonnet：编码之王超越 o1

在各个行业基准测试中，升级版 Claude 3\.5 Sonnet 显示出全面的性能提升。

值得注意的是，它在智能编码和工具使用任务中取得了显著突破。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*3s6xaC5SnpYSjK4U.png)

在编码能力方面，它在 SWE\-bench Verified 测试中的表现显著提高，从 33\.4% 增加到 49\.0%。

这超越了所有公开可用的模型，包括推理模型如 OpenAI o1\-preview 和为智能编码设计的专用系统。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*tT94GrrWEx2Ul4cE.png)

此外，在 TAU\-bench——一个评估智能代理工具使用能力的基准测试中——Claude 3\.5 Sonnet 的表现也非常出色：

> *其在零售行业的得分从 62\.6% 提升至 69\.2%，而在更具挑战性的航空行业中，从 36\.0% 上升至 46\.0%。*

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*6xw91HveiSbQZCk2.png)

从下表可以明显看出，新的 Claude 3\.5 Sonnet 在 GPQA (Diamond) 推理测试基准上显著优于 GPT\-4o。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*NLHWDDmHc8DP1Lmt.png)

在视觉 QA、数学推理、文档视觉问答、图表问答和科学表格基准测试中，Claude 3\.5 Sonnet 为性能设定了新的行业标准。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*ydKXrwofgXol4hiT.png)

值得注意的是，尽管升级版 Claude 3\.5 Sonnet 实现了性能突破，但其价格和速度与前一版本保持一致。

早期测试用户的反馈进一步确认，升级版 Claude 3\.5 Sonnet 代表了 AI 驱动编码的重大飞跃。

1. **GitLab：** 在 DevSecOps 任务测试中，他们观察到推理能力显著提高（在各种用例中提高了 10%），且没有增加延迟，使其成为推动复杂软件开发过程的理想选择。
2. **Cognition：** 在应用新的 Claude 3\.5 Sonnet 进行自主 AI 评估时，与之前的模型相比，它在编码、规划和解决问题方面显示出显著改善。
3. **The Browser Company：** 在自动化网页工作流程中，他们发现 Claude 3\.5 Sonnet 超越了所有先前测试的模型。

此外，在安全部署之前，Claude 3\.5 Sonnet 在美国 AI 安全研究所（US AISI）和英国 AI 安全研究所（UK AISI）进行了联合测试。

此外，Anthropic 的“负责任的扩展政策”ASL\-2 标准在评估后仍适用于新模型。

如前所述，升级版 Claude 3\.5 Sonnet 现已可在网页和终端应用中使用。

API 定价从 **每百万输入令牌 3 美元** 和 **每百万输出令牌 15 美元** 开始。

利用智能缓存技术可以节省高达 90% 的成本，而使用批处理 API 可以降低 50% 的成本。

## 应用

Claude 3\.5 Sonnet 能够理解细微的指令和上下文，识别并纠正自身的错误，并从复杂数据中生成深入的分析和见解。结合尖端的编码、视觉识别和写作能力，Claude 3\.5 Sonnet 可以应用于多种场景。

* **模拟人机交互**

通过 API 集成，开发者可以引导 Claude 像人类一样使用计算机——观察屏幕、移动鼠标、点击按钮和输入文本。Claude 3\.5 Sonnet 是首个能够可靠地以这种方式使用计算机的先进 AI 模型。尽管仍处于实验阶段，但其能力将随着时间的推移不断提升。

* **自动化代码生成**

Claude 3\.5 Sonnet 可以在软件开发生命周期的各个阶段提供帮助——从最初的设计到错误修复，从系统维护到性能优化。它可以直接集成到产品中，或通过 [Claude.ai](http://claude.ai/) 平台作为智能编码助手使用。

* **智能对话系统**

凭借增强的推理能力和友好自然的语气，Claude 3\.5 Sonnet 非常适合开发需要跨系统连接数据并执行操作的智能对话系统。

* **智能知识问答**

Claude 3\.5 Sonnet 的大规模上下文处理能力和极低的幻觉率使其成为处理涉及大知识库、文档和代码库的问答任务的理想选择。

* **视觉信息提取**

Claude 3\.5 Sonnet 能够轻松从图表、图形和复杂示意图等视觉材料中提取信息，使其成为数据分析和数据科学任务的理想 AI 模型。

* **流程自动化**

Claude 3\.5 Sonnet 可以自动化重复的任务或流程。其行业领先的命令执行能力使其能够处理复杂的流程和操作。

## 新的 Claude 3\.5 Haiku：智能超越其前身

与上一代相比，Claude 3\.5 Haiku 被认为是“最小的杯子”。

它是 Anthropic 最快的模型。

它不仅保持与 Claude 3 Haiku 相同的运营成本和类似的处理速度，还实现了全面的技能提升。

事实上，在多个智能基准测试中，Claude 3\.5 Haiku **超越了之前最强大的模型 Claude 3 Opus**。

同样，Claude 3\.5 Haiku 在编码任务中表现出色。

例如，它在 SWE\-bench Verified 测试中获得了令人印象深刻的 40\.6% 的分数，**超过**了许多使用公开可用的最先进模型的 AI 代理，包括 **Claude 3\.5 Sonnet 和 GPT\-4o** 的原始版本。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*lZVGN_REK_Gkifoo.png)

Claude 3\.5 Haiku 具有三大突出优势：

**1\. 低延迟响应**

**2\. 更精确的指令执行**

**3\. 更准确的工具使用**

这些特性使得该模型特别适合面向用户的产品开发、处理专业的子代理任务，以及基于大数据集（如购买记录、定价信息或库存数据）创建个性化体验。

到本月底，Claude 3\.5 Haiku 将在多个平台上推出，包括 Anthropic API、Amazon Bedrock 和 Google Cloud 的 Vertex AI。最初，它将作为仅文本模型提供，图像输入功能将在稍后添加。

Claude 3\.5 Haiku 的定价为 **每百万输入令牌 $0\.25** 和 **每百万输出令牌 $1\.25**。

使用提示缓存技术可以节省高达 90% 的成本，而利用消息批处理 API 可以降低 50% 的成本。

## 应用

凭借其快速的处理速度、改进的指令执行能力和更准确的工具使用，Claude 3.5 Haiku 非常适合用户界面产品、专业辅助任务以及从大型数据集中生成个性化体验。

* **代码自动补全**

Claude 3.5 Haiku 可以提供快速、准确的代码建议和补全，有效加速开发工作流程。对于希望简化编码过程和提高生产力的软件开发团队来说，这尤其有益。

* **智能聊天机器人**

凭借增强的对话能力和快速的响应时间，Claude 3.5 Haiku 在驱动响应式聊天机器人方面表现出色，能够处理大量用户交互。对于需要可扩展交互能力的客户服务、电子商务和教育平台来说，这尤其有价值。

* **数据提取和自动标记**

Claude 3.5 Haiku 高效处理和分类信息，在快速数据提取和自动标记任务中表现出色。这种能力对于需要处理大量非结构化数据的金融、医疗和研究领域的组织尤其有用。

* **自动化实时内容审核**

通过其改进的推理和内容理解能力，Claude 3.5 Haiku 提供可靠的实时内容审核服务。这对于需要在大规模上维护安全和适当内容的社交平台、在线社区和媒体组织来说是无价的。

## 教授Claude操作计算机

Anthropic指出，人类轻松执行的操作——滚动、拖动、缩放——对Claude来说仍然具有挑战性。

对于垃圾邮件、虚假信息和欺诈等风险，公司正在寻求安全的部署策略，例如开发识别系统以检测有害活动。

## 研究过程

Anthropic 在工具使用和多模态能力方面的工作为 AI 识别和解释图像奠定了基础。

在此基础上，Claude 必须推理如何以及何时根据屏幕内容执行操作。

为此，研究人员训练 Claude 准确计算像素以完成命令，因为它必须计算移动鼠标指针垂直或水平的像素数量，以点击正确的位置。

在此过程中，Claude 快速将学习从简单的软件（如计算器和文本编辑器）转移到其他应用程序（请注意，在此期间它没有被允许访问互联网）。

这种训练使它能够将用户指令转换为一系列逻辑步骤来执行任务。它甚至可以在遇到障碍时自我纠正并重试任务。

## 一段小轶事

Anthropic 的开发者关系负责人 Alex Albert 分享了一个有趣的故事，讲述团队在开发计算机使用功能时的经历。

他们组织了一次与工程师的 bug bash，以确保识别所有可能与 API 相关的问题。

这意味着要把一组工程师锁在一个房间里几个小时。

巧合的是，每个人都很饿，一位工程师突然想到：“为什么不让 Claude 进行一次实时演练，自动打开 DoorDash 为我们订餐呢？”

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*7uyjn1WCUpdx8iaa.png)

令人惊讶的是，大约一分钟后，Claude 为工程师们订了比萨。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*PZ37LGIOsKjNeQKN.png)

## 展望未来

AI 操作计算机的能力代表了人工智能发展的新方法。

到目前为止，LLM 开发者一直在努力将工具适应模型，创建专门的环境，让 AI 利用专门构建的工具完成各种任务。

现在，Anthropic 正在采取相反的方法——让模型适应工具。这意味着 Claude 可以集成到我们日常使用的计算机环境中，像人类一样直接利用现有软件。

尽管 Claude 已经达到了目前的最高水平，但其操作仍然相对较慢且容易出错。我们每天在计算机上执行的许多操作，例如拖动和缩放，仍然超出了 Claude 的能力范围。

此外，Claude 观察屏幕的方式类似于翻阅一本“图画书”——拍摄一系列截图并将其拼接在一起，而不是观看连续的视频流。这意味着它可能会错过一些短暂的动作或通知。

有趣的是，Anthropic 在录制演示时遇到了一些有趣的事件。

例如，在一次演示中，Claude 不小心点击停止了一个长时间运行的屏幕录制，导致所有录制的画面丢失。

在另一次编码演示中，Claude 突然“走神”，并开始对黄石国家公园的照片产生浓厚兴趣。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*wCjemO9CaH2on1-3.gif)

总之，Claude 目前的表现让人对未来充满期待：AI 操作计算机的能力将迅速提高，使得即使是初学的软件开发者也能轻松利用它。

## 结论

总之，最近在Claude 3.5 Sonnet和Haiku方面的进展标志着人工智能能力的重大飞跃，特别是在智能编码和人机交互方面。凭借操作计算机、生成复杂代码和协助各种自动化任务的能力，Claude有望彻底改变各行业的工作流程。尽管该技术仍处于早期阶段，但进一步发展和完善的潜力预示着在不久的将来将出现令人兴奋的应用，重塑我们在日常任务中与人工智能驱动系统的互动方式。

## 参考文献

* [https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude\-3\-Model\-Card\-October\-Addendum.pdf](https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf)
* [https://www.anthropic.com/news/3\-5\-models\-and\-computer\-use](https://www.anthropic.com/news/3-5-models-and-computer-use)

