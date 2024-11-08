---
title: "OpenAI 放弃 Next.js 转而使用 Remix 的真正原因"
meta_title: "OpenAI 放弃 Next.js 转而使用 Remix 的真正原因"
description: "OpenAI 此举背后令人惊讶的原因及其对 Web 开发的未来意味着什么"
date: 2024-11-08T00:25:31Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*bf8ao0JjEiMka6dJqp-hxg.jpeg"
categories: ["Technology/Web", "Programming", "Web Development"]
author: "Rifx.Online"
tags: ["Remix", "Next.js", "client-side", "rendering", "scalability"]
draft: False

---

### OpenAI 采取行动背后的惊人原因及其对未来网页开发的影响



## 过渡介绍

OpenAI 最近在开发者社区引起了轰动，因为它从 Next.js 转向了 Remix。

这一意外的转变让许多人质疑如此重大变化的理由。

但 **你能责怪他们吗？**

以下是 **大多数开发者对 NextJS 的看法**，基于 [这篇](https://www.reddit.com/r/nextjs/comments/1f92jdv/chatgptcom_switched_from_nextjs_to_remix/) reddit 讨论：

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*GCrb_aGjh1nticKNeHh9Bg.png)

这很艰难。

但我也在 X 上询问了开发者，

他们对小型项目的看法则有所不同：

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*YmN2pTYaCFXFzb3AMjfoqQ.png)

## 让我们深入探讨这个问题

这次探索不仅仅是为了理解 OpenAI 的决定，还涉及到 **这对其他开发者和更广泛的科技领域意味着什么**。

为了理解其背后的理由，我花了数小时分析代码库和工具。

以下是我获得的见解。

## 关于切换的技术见解

理解这一过渡的技术方面是理解为什么 OpenAI 偏爱 Remix 的关键。

我们检查了他们的应用架构，以识别 Next.js 和 Remix 之间的核心差异。

### 客户端渲染与服务器渲染

OpenAI 的应用程序专注于 **客户端渲染**，大部分处理发生在用户的浏览器中。

这减少了对服务器渲染 HTML 的需求。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*50dv8sWPbwFp85fQu_dodQ.png)

**Remix** 非常适合这些场景，因为它有效地管理客户端应用程序。这个选择确保了 OpenAI 的用户拥有更流畅、更灵敏的体验。

### 初始页面加载过程

当用户访问 ChatGPT 网站时，**预加载的 JavaScript 和 meta 标签** 参与了初始页面加载。

这优化了客户端渲染过程。**Remix** 在管理这些元素方面表现出色，确保了顺畅快速的初始加载。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*65VlHo5RQObk-YGzBlkx3w.png)

## 为什么这很重要

### 改进的用户体验

通过预加载必要的脚本和数据，用户在访问网站时会遇到更少的延迟，并享受到更灵敏的界面。

### 高效加载

Remix 处理这些预加载元素的能力意味着减少等待时间，提供更快的浏览体验。

通过利用这些功能，

*OpenAI 可以为其用户从一开始就提供更无缝和愉悦的体验。*

## 深入探讨 OpenAI 利用的 Remix 关键特性

OpenAI 利用 Remix 的几个关键特性来增强他们的应用程序。

### 预加载策略

Remix 预加载必要的数据和资源，减少加载时间并提升性能。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*GPH2ZGhT_yfrQYpR2Xhvug.png)

这一策略确保用户从一开始就能获得无缝的体验。

### 数据管理与加载器

Remix的加载器API有效地收集初始渲染所需的所有数据，并直接嵌入到HTML中。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*PmCiQNkAJlu2MSFEtpydiw.png)

这种方法消除了额外的客户端数据获取的需求，加快了渲染过程。

## 转向 Remix 的好处和影响

转向 Remix 为 OpenAI 提供了多个优势，从性能提升到未来的发展前景。

### 性能提升

通过采用 Remix，OpenAI 实现了更快的初始加载时间和更流畅的客户端导航。

这些性能提升有助于创建更具响应性和用户友好的应用程序。

### Remix的未来前景

Remix的灵活性和高效性为OpenAI的未来增长和创新奠定了基础。

随着Remix的不断发展，OpenAI可以利用其先进的功能在网页开发的竞争环境中保持领先。

### 为什么这很重要

**改善用户体验**：用户从更快的页面加载和更流畅的浏览体验中受益。

**高效开发**：Remix 的功能简化了开发过程，使 OpenAI 能够更快速地进行创新。

**可扩展性**：Remix 的架构支持未来的增强和扩展，确保长期的可行性。


