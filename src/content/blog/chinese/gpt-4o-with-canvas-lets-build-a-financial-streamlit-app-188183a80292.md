---
title: "GPT 4o- with Canvas：让我们创建一个金融流应用程序！"
meta_title: "GPT 4o- with Canvas：让我们创建一个金融流应用程序！"
description: "本文介绍了如何使用 GPT-4o 和 Canvas 模型以及 Streamlit 构建一个预测股票价格的金融应用。首先，选择 GPT-4o-with Canvas 模型，然后通过创建 GitHub 仓库、编写 Streamlit 应用代码并部署到 Streamlit Cloud 来构建基础应用。接下来，使用 Prompt Perfector GPT 优化提示，以生成更复杂的金融预测应用代码。最后，通过集成 Yahoo Finance API 获取历史数据，并使用 LSTM 等机器学习模型进行预测。文章还提供了详细的步骤和代码示例，确保应用的用户友好性和性能优化。"
date: 2024-12-12T01:29:42Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*El67rk9ZpuImk9EI9Qlw0A.jpeg"
categories: ["Programming", "Finance", "Predictive Analytics"]
author: "Rifx.Online"
tags: ["GPT-4o", "Streamlit", "Canvas", "YahooFinance", "MLModels"]
draft: False

---



### 使用 GPT-4o 和 Canvas 以及 Streamlit 创建金融应用



ChatGPT 今年发布了多个模型，因此有很多可以探索和利用的内容。

在本文中，我们将探索 GPT 4o 和 Canvas 模型，并构建一个预测股票价格的 Streamlit 应用。听起来很有趣，对吧？我也很兴奋，因为我在写作过程中也会尝试，所以让我们一起探索吧。

### GPT 4o\- with Canvas

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*WuIf42JwpYuuPpSNcSz2ug.png)

首先，让我们在 ChatGPT 的左上角选择 **GPT 4o\-with Canvas** 模型。如果你不知道 **GPT 4o\- with canvas** 是什么，可以查看下面的图片。这里你可以看到如何构建 streamlit 应用。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*uQ06H95nWO9s8UFT0e3Bpw.png)

但是什么是 streamlit？

### Streamlit

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*DPaJ9Os2wlvsUQGW5a44Gg.png)

Streamlit 是一种极其有用且快速的方法，可以在几分钟内构建你的 Web 应用——是的，几分钟！但如何实现？让我们开始吧！

**步骤 1: 创建一个 Github 仓库**

前往你的 GitHub 并创建一个仓库。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*pUuAAU2PUDZxKYAlC2CVpA.png)

**步骤 2: 在此仓库中创建一个 .py 文件**

将以下代码粘贴进去。

```python
## Importing the required libraries
import streamlit as st

## What is Streamlit?
## Streamlit is an open-source Python library that makes it easy to build custom web apps for data science, machine learning, and general interactive purposes.
## It is popular because it enables rapid prototyping and deployment of web-based dashboards and applications without the need for extensive web development knowledge.

## Title of the Streamlit App
st.title('Simple Streamlit App')

## Adding some text description
st.write("Hello, this is a simple Streamlit application!")

## A number input box for user interaction
user_input = st.number_input('Enter a number:', value=0)

## Displaying the value entered by the user
st.write(f'You entered: {user_input}')

## Adding a button to the interface
if st.button('Click Me!'):
    st.write('You clicked the button!')

## Explanation
## Streamlit apps run on the local server, and they allow you to build interactive components like buttons, sliders, and text inputs
## simply by using Python code. This makes it a go-to tool for data scientists to showcase their models or explore datasets interactively.
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*pkv7mOwL4qnXDKGSN9-r7g.png)

**步骤 3: 前往你的 Streamlit 账户**

如果你还没有账户，创建一个。点击右上角的“创建应用”。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*gF5IJMIe0fpFKK20MYqn7w.png)

选择从 GitHub 部署一个公共应用。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*aNjYm9s2ZaueHzCZX69uQw.png)

选择你的 GitHub 仓库并点击部署。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*YzPPPXDfikhG7I3996OdTQ.png)

大功告成！不到 5 分钟，你的应用就完成了。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*gZvY6zfdoVR1qFMaRKCcbQ.png)

现在，如果你想在本地环境中测试这个应用，将文件保存为 Python 文件并使用以下代码。

```python
streamlit run finance_app.py
```
你将看到相同的界面，请检查。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*zwppmKFkk7yU8lBnUWCGVg.png)

很好。让我们继续使用 **GPT 4o — with canvas** 来完善我们的应用，并在本地环境中进行测试。然而，要创建一个带有 GPT 4o\-with canvas 的应用，我们需要一个良好的提示，这里我们可以使用 **Prompt Perfector GPT。**

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*H4jzbo1JvYcjfooeN3EKdA.png)

这是我要发送给 **Prompt Perfector GPT** 的提示。

```python
I want to build a Streamlit app for finance.
This app should be able to predict upcoming prices 
(a 1-week prediction based on the given data).
We will use the Yahoo Finance API, and this prediction should be done 
using ML models like LSTM or any other model suitable for this task.
```
这是它如何为我们创建一个完美的提示和提示优化步骤。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ITb-zGdN7BhNdpgF9LJeqA.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*YmHKh8xtxKJgiC7hqkr1Kg.png)

我进行了几项优化，所以这是结果。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*QxVVI7nlxdvVjxzQdtTEPA.png)

很好，现在我们还有最后一步：从 [这里](https://rapidapi.com/sparior/api/yahoo-finance15/pricing) 获取 Yahoo 财经 API。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*6UnaHviqB5QnhioM8k8MyQ.png)

现在，如果你还没有注册 RapidAPI，注册并收集你的 API 密钥，让我们开始吧！

## 财务APP

在这一阶段，使用上述提示，但在最后添加以下内容。这是提示。


```python
Develop a Streamlit app for financial forecasting that predicts the prices of stocks for the upcoming week using machine learning models, such as Long Short-Term Memory (LSTM) networks or other suitable algorithms. The app should integrate with the Yahoo Finance API to fetch historical stock data and provide predictions based on the data retrieved.

The app should include:

Adjustable Parameters:

Allow users to select a stock ticker symbol.
Use date pickers for specifying the historical data range.
Provide options for configuring ML model parameters, such as training epochs, LSTM layers, or batch size.
Data Visualization:

Display clear line graphs of historical stock data and overlay the predicted prices on the same chart.
Use Plotly for interactive and zoomable graphs.
Result Download:

Include a "Download as CSV" feature for historical and predicted data with timestamps, actual prices, and predicted prices.
Performance Optimization:

Implement Streamlit caching to store API responses temporarily, minimizing repetitive calls and enhancing app speed.
Deployment Ready:

Ensure the app is deployable via Streamlit Cloud using a GitHub repository.
Include detailed instructions on setting up the app, linking to the GitHub repo, and setting Yahoo Finance API keys if required.
The app should be user-friendly, with proper error handling for invalid inputs or network issues. Add a brief “How it works” section to explain the app’s features, and ensure that all components are optimized for scalability and reliability.
Do it in canvas.
```
这里是一张图。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*IkOBWfnR0yGoNjeamLCJnA.png)

现在一切都很好，但我看不到它从哪里收集数据（Yahoo API），还有一些问题，所以我将解决这些问题并在下一步进行测试。让我们看看。

### 第1次迭代

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ymnJ0R4JGVYWMwqhyvZesA.png)

现在，我将 **GPT 4o—with canvas** 给我的代码粘贴到我的 local.py 中，并检查了上述结果。让我们测试一下！当我选择“**AAPL**”时，它首先显示上个月的价格。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*C7hVvbnnm9TkDtLclWbPtA.png)

从终端窗口中可以看到，代码根据您的选择运行。它还输出了预测结果。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*S5vME3w9qzOalhQuMas5Gg.png)

**免责声明：我不是财务顾问；这不是财务建议。**

## 最后的想法

我不是金融专家，所以你可以为自己制定不同的策略。本文中的方法仅用于演示目的，但你明白这个意思，对吧？

我们都是用 GPT 40 完成的——很神奇，对吧？你可以将所有这些内容扩展到你的项目中。如果你喜欢你看到的内容，并使用像 **Prompt Perfector GPT** 这样的代理，考虑成为我们的付费订阅者！

## 系列

* **Weekly AI Pulse:** *获取最新更新，阅读 [此内容。](https://www.learnwithmeai.com/t/weekly-ai-pulse)*
* **LearnAI 系列:** *通过我们独特的 GPT 学习 AI，并通过此 [系列](https://www.learnwithmeai.com/p/it-is-time-to-start-learnaiwithme) 赋能。*
* **求职系列:** *在 Upwork 上发现自由职业机会，点击 [这里。](https://www.learnwithmeai.com/t/job-hunt-ai)*

## GPT

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*oEyTag0SUNqrFwma.png)

以下是免费资源。

***这里是 [ChatGPT 速查表。](https://gencay.ck.page/chatgpt)***

***这里是 [提示技巧速查表。](https://gencay.ck.page/prompt)***

***这里是我的 [NumPy 速查表](https://gencay.ck.page/)。***

***这里是 “[如何成为亿万富翁](https://gencay.ck.page/billionaire)” 数据项目的源代码。***

***这里是 “[使用 Python 的 6 种不同算法进行分类任务](https://gencay.ck.page/bfd9d41fdc)” 数据项目的源代码。***

***这里是 “[能源效率分析中的决策树](https://gencay.ck.page/2df5d07388)” 数据项目的源代码。***

***这里是 “[DataDrivenInvestor 2022 文章分析](https://gencay.ck.page/56510fbc8d)” 数据项目的源代码。***

“机器学习是人类需要做的最后一个发明。” Nick Bostrom

