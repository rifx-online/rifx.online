---
title: "利用 Chrome 浏览器的设备上人工智能构建项目"
meta_title: "利用 Chrome 浏览器的设备上人工智能构建项目"
description: "本文介绍了如何在Google Chrome中使用设备端AI模型Gemini-nano进行原型设计。设备端AI在终端用户设备上运行，提供离线推理和数据隐私。通过启用实验性提示API，开发者可以创建AI功能的Web应用程序。文章提供了详细的代码示例，展示了如何设置推理会话并获取单词的用法和定义。完整代码可在GitHub上找到，鼓励开发者探索更复杂的应用程序。"
date: 2025-01-05T02:33:10Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*BB-r5FbszcK8J7Ht2lKmGA.png"
categories: ["Programming", "Technology/Web", "Machine Learning"]
author: "Rifx.Online"
tags: ["Gemini-nano", "Chrome", "Prompt-API", "Inference", "Privacy"]
draft: False

---

### 使用 Gemini\-nano\-in\-Chrome 进行原型设计指南

### 在Chrome上使用实验性提示API构建具有AI功能的原型



## 设备端 / 边缘 AI

设备端 AI 是指直接在终端用户设备上运行的 AI 模型，例如智能手机、平板电脑或物联网设备，而不依赖于云计算或服务器来托管这些模型。

这在很多方面都很有用：

1. 由于模型在设备上，我们可以进行离线推理。
2. 我们可以通过将某些推理卸载到客户端设备来降低运行 AI 功能的运营成本。
3. 由于数据从未离开设备，我们可以通过设备端模型提供更多的隐私和数据安全。

然而，由于这些模型运行在内存有限的设备上，它们无法执行云中托管的大型语言模型所能完成的通用推理。相反，**这些是具有特定能力的较小模型**。

Chrome 自带一个这样的模型。让我们来看看它：

## Gemini Nano 在 Chrome 中

最新版本的 Google Chrome 配备了一个设备内 AI 模型，即 `Gemini-nano`。然而，与之交互的 API 仍处于实验阶段，并被隐藏在一个标志后面。

因此，如果我们打算使用实验性 API，我们需要通过以下步骤先启用这个功能标志：

1. 更新到最新版本的 Chrome，然后访问 `chrome://flags`。
2. 搜索 `Prompt API for Gemini Nano`
3. 启用该标志
4. 重启浏览器

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*CxRdDaj4QQZDksFe.png)

## 使用 Chrome 的设备内 AI 构建应用程序

一旦启用该功能，我们可以通过全局对象访问模型，如下所示：

```python
window.ai
```

### 提示 API

我们可以通过以下方式创建一个带有系统提示的会话：

```python
const inferenceSession = await window.ai.languageModel.create({
  systemPrompt: `You are an English teacher. 
                 Analyse a given word and come up with a sentence 
                 to demonstrate the usage of the word.
                 Always respond in English.`
});
```

一旦创建了推理会话，我们可以按如下方式调用 `prompt` 方法：

```python
await inferenceSession.prompt('Precarious');
```

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*OxsC1LeVrMMmwzRJTYkL5w.png)

## 一个示例项目

让我们将上述想法构建成一个简单的Web应用程序。我们项目的系统设计可以如下架构：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*SCW5Z3GddYZYL_YYQmU4YA.png)

我们的最终产品将如下所示：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*kxDhEcW0kWUPooF2kfjyaQ.png)

为了使文章的重点集中在AI集成上，让我们仅关注该部分代码的组成：

> *完整代码的GitHub仓库链接位于本文底部。*

### AI助手方法

我们为该工具设计的模块可以如下面的图片所示：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*khWRZTig7jLLfv-c6VXUhg.png)

我们可以通过以下代码实现上述功能：

```python
// src/utils/ai.js
export async function setupAI() {
  if(!window.ai?.languageModel){
    throw new Error("AI feature is not enabled on this browser.");
  }
  const inferenceSession = await window.ai.languageModel.create({
    systemPrompt: `You are an English teacher. For a given word and come up with a sentence to demonstrate the usage of the word.
    Always respond in English in the following format: 
    <h3>Usage:</h3> <p>Your sentence here</p>
    <h3>Meaning:</h3>  <p>The meaning of the word</p>
    `,
  });
  return inferenceSession;
};

export async function prompt(inferenceSession, word){
    const response = await inferenceSession.prompt(word);
    return response;
}
```

注意系统提示，我们指示模型将响应作为HTML元素返回。这是为了简化我们的应用逻辑。如果我们要部署这个应用，最好在将其注入到DOM之前**清理和验证**响应。由于这只是一个概念验证，我们可以在这个上下文中跳过那部分。

### 在内容加载时设置推理会话

加载控制流程如下：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*NQ0toXJ3pGmh-L7dhEqS3Q.png)

可以通过以下逻辑实现：

```python
// main.js

import { setupAI } from "./src/utils/ai.js";

const initUI = () => {
  // ... code to initilize the user interface
};

let inferenceSession = null;

document.addEventListener("DOMContentLoaded", async () => {
  try{
    inferenceSession = await setupAI();
    initUI();
  }catch(error){
    console.error(error);
    alert("App failed to load. Please check the console for more details.");
  }
});


```

### 提示词汇用法和定义

推理控制流程可以如下可视化：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*dQLC92tngJR4JID_7FBMDg.png)

我们可以如下实现这个逻辑：

```python
// main.js
import { setupAI, prompt } from "./src/utils/ai.js";

const initUI = () => {
  // ... existing code
  setupButtons(document.querySelector("#button-container"), {
    onSubmit: () => {
      const trimmedValue = input.value.trim();

      if (trimmedValue) {
        updateTitle(trimmedValue.charAt(0).toUpperCase() + trimmedValue.slice(1));
        updateContent(`
        <p>Asking the AI for the word usage instructions...Please wait...</p>
      `);

      prompt(inferenceSession, trimmedValue)
        .then((response) => {
          updateContent(`
          <div>${parseBold(response)}</div>
        `);
      })
        .catch((error) => {
          updateContent(`
          <p>Failed to get the usage instructions. Please try again.</p>
        `);
        console.error(error);
        });
      }
    },

  // ... exisitng code
  });

}

// ... existing code

```

由于这只是一个概念验证，我们故意跳过了输入验证和检查，当用户输入一个单词并点击 `Submit` 时。

## GitHub 仓库

此演示的完整功能代码可以从 [这个 GitHub 仓库](https://github.com/play-Arena/on-device-ai-with-js-demo) 访问：


