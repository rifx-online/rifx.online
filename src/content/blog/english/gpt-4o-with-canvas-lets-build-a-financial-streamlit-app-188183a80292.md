---
title: "GPT 4o- with Canvas: Let’s Build a Financial Streamlit App!"
meta_title: "GPT 4o- with Canvas: Let’s Build a Financial Streamlit App!"
description: "This article guides readers through building a financial prediction app using GPT 4o with Canvas and Streamlit. It starts by selecting the GPT 4o-with Canvas model in ChatGPT and creating a basic Streamlit app. The app is then enhanced with features like stock price prediction using ML models and Yahoo Finance API integration. The article provides step-by-step instructions, including creating a GitHub repo, deploying the app on Streamlit Cloud, and refining the app with user-friendly features. The final section includes testing the app locally and addressing issues, with a disclaimer that the content is for educational purposes only."
date: 2024-12-12T01:29:42Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*El67rk9ZpuImk9EI9Qlw0A.jpeg"
categories: ["Programming", "Finance", "Predictive Analytics"]
author: "Rifx.Online"
tags: ["GPT-4o", "Streamlit", "Canvas", "YahooFinance", "MLModels"]
draft: False

---





### Create a financial app with GPT\-4o with Canvas and Streamlit.



ChatGPT has published more than one model this year, so there is a lot to discover and take advantage of.

In this article, we will discover GPT 4o with the Canvas model and build a streamlet app that predicts stock prices. Sounds exciting, right? I am excited, too, because I tend to do it while writing, so let’s discover together.


### GPT 4o\- with Canvas

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*WuIf42JwpYuuPpSNcSz2ug.png)

First, let’s select **GPT 4o\-with Canvas** model on the bar top left from ChatGPT. If you did not know what **GPT 4o\- with canvas** is, check the image below. Here you can see how streamlit app can be build.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*uQ06H95nWO9s8UFT0e3Bpw.png)

But what is streamlit?


### Streamlit

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*DPaJ9Os2wlvsUQGW5a44Gg.png)

Streamlit is an extremely useful and fast way of building your web app in minutes—yes, minutes! But how? Let’s do it!

**Step\- 1: Create a Github Repo**

Go to your GitHub and create a repo.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*pUuAAU2PUDZxKYAlC2CVpA.png)

**Step — 2: Create a .py file inside this repo**

Paste this code inside.


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

**Step 3\- Go to your streamlit account**

If you don’t have, create one. Click on “Create app” on the top right.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*gF5IJMIe0fpFKK20MYqn7w.png)

Select deploy a public app from GitHub.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*aNjYm9s2ZaueHzCZX69uQw.png)

Select your GitHub repo and click on deploy.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*YzPPPXDfikhG7I3996OdTQ.png)

Voila! Under 5 minutes, here is your app.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*gZvY6zfdoVR1qFMaRKCcbQ.png)

Now, if you want to test this on your local environment, save this file as a Python file and use the following code.


```python
streamlit run finance_app.py
```
You will have same screen, check it please.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*zwppmKFkk7yU8lBnUWCGVg.png)

Good. Let’s continue shaping our app with **GPT 4o — with canvas** and test it in the local environment. However, to create an app with GPT 4o\-with canvas, we would need a good prompt, and here we can use **Prompt Perfector GPT.**

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*H4jzbo1JvYcjfooeN3EKdA.png)

Here is the prompt I am sending to the **Prompt Perfector GPT.**


```python
I want to build a Streamlit app for finance.
This app should be able to predict upcoming prices 
(a 1-week prediction based on the given data).
We will use the Yahoo Finance API, and this prediction should be done 
using ML models like LSTM or any other model suitable for this task.
```
Here is how it creates a perfect prompt and prompt perfection step for us.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ITb-zGdN7BhNdpgF9LJeqA.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*YmHKh8xtxKJgiC7hqkr1Kg.png)

I took a few steps toward perfection, so here is the result.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*QxVVI7nlxdvVjxzQdtTEPA.png)

Good, now we have one final step: to get a Yahoo finance API from [here.](https://rapidapi.com/sparior/api/yahoo-finance15/pricing)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*6UnaHviqB5QnhioM8k8MyQ.png)

Now, sign up to RapidAPI if you still haven’t, collect your API key, and let’s get started!


## Finance APP

At this step, use the prompt above, but add this at the end. Here is the prompt.


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
Here is the output.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*IkOBWfnR0yGoNjeamLCJnA.png)

Now everything is good, but I can't see where it collected the data(Yahoo API) and there are a few issues, so I am addressing them and will test this in the next step. Let’s see.


### Iteration 1

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ymnJ0R4JGVYWMwqhyvZesA.png)

Now, I pasted the code that **GPT 4o—with canvas** gave me into my local.py and checked the result above. Let’s test it! When I select “**AAPL**,” it first shows the last month’s prices.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*C7hVvbnnm9TkDtLclWbPtA.png)

As you can see in the terminal window, the code is running according to your selection. It also outputs the prediction.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*S5vME3w9qzOalhQuMas5Gg.png)

**Disclaimer: I am not a financial advisor; this is not financial advice.**


## Final Thoughts

I am not a financial expert, so you can develop different strategies for yourself. The methods in this article are just for demonstration purposes, but you get the idea, right?

We all did this using GPT 4o—amazing, right? You can scale all these things up to your project. If you like what you saw and use agents like **Prompt Perfector GPT,** consider becoming a paid subscriber to us!


## Series

* **Weekly AI Pulse:** *Get the latest updates as you read [this.](https://www.learnwithmeai.com/t/weekly-ai-pulse)*
* **LearnAI Series:** *Learn AI with our unique GPT and empower with this [series.](https://www.learnwithmeai.com/p/it-is-time-to-start-learnaiwithme)*
* **Job Hunt Series:** *Discover freelance opportunities on Upwork [here.](https://www.learnwithmeai.com/t/job-hunt-ai)*


## GPT’s

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*oEyTag0SUNqrFwma.png)

Here are the free resources.

***Here is the [ChatGPT cheat sheet.](https://gencay.ck.page/chatgpt)***

***Here is the [Prompt Techniques cheat sheet.](https://gencay.ck.page/prompt)***

***Here is my [NumPy cheat sheet](https://gencay.ck.page/).***

***Here is the source code of the “[How to be a Billionaire](https://gencay.ck.page/billionaire)” data project.***

***Here is the source code of the “[Classification Task with 6 Different Algorithms using Python](https://gencay.ck.page/bfd9d41fdc)” data project.***

***Here is the source code of the “[Decision Tree in Energy Efficiency Analysis](https://gencay.ck.page/2df5d07388)” data project.***

***Here is the source code of the “[DataDrivenInvestor 2022 Articles Analysis](https://gencay.ck.page/56510fbc8d)” data project.***

“Machine learning is the last invention that humanity will ever need to make.” Nick Bostrom


