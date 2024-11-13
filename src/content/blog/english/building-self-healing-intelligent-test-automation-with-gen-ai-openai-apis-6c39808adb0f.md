---
title: "Building Intelligent Test Automation with Gen AI (OpenAI APIs)"
meta_title: "Building Intelligent Test Automation with Gen AI (OpenAI APIs)"
description: "We all know that UI Tests are super fragile. They can break for all sorts of reasons, and one of the biggest culprits is changes to the UI…"
date: 2024-11-13T01:22:29Z
image: "https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*kZ4ZR-jqdTTgH3bpOzcgUw.png"
categories: ["Generative AI", "Programming", "Testing"]
author: "Rifx.Online"
tags: ["Generative", "OpenAI", "Selenium", "LLMs", "POM"]
draft: False

---





> We all know that UI Tests are super fragile. They can break for all sorts of reasons, and one of the biggest culprits is changes to the UI locators. It’s hard to imagine how we can make them smart enough to understand when the locators have changed and prevent the tests from running until when the locator issue in our test occurs.

Guess what? It’s 2024, and automation testing tools have come a long way. After almost 18 years of working with them, from Mercury Winrunner to Playwright, we can now do some truly amazing things thanks to the power of Generative AI. It’s like magic, but it’s science!

You heard it right, we can now device a way to make our test automation code **more intelligent** without writing all sort of fuzzy mathematical algorithms ourselves, it's all taken care by the God of LLMs.

In this post, we are going to discuss how we can make our tests intelligent in more effective and efficient fashion, but again, for you to make this happen you need to have following pre\-requisite

1. **Open AI API** with Credit (you need to purchase it on the go)



2\. C\# .NET code knowledge, as the code I will be covering is from .NET and Selenium

3\. Basic understanding of Test automation

Again, all the above and following discussions are part of my [Udemy course](https://proxy.rifx.online/https://www.udemy.com/course/generative-ai-in-software-automation-testing/) which covers even more details and step\-by step way of writing the code.


## Lets understand the problem statement

So we’ve got this page that we want to automate using Selenium C\# code. We’ve written the code really well using the Page Object model (POM) pattern, and everything looks great and works perfectly as shown below.

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*GPSBTmPEZBpubI72OElwbw.gif)

Our dev champ spotted a UI element that needs some tweaking. He made a change based on his peers’ code review comments, but unfortunately, he removed a locator that we’re using in our automation testing. This means our POM code with the locator won’t work anymore since it doesn’t exist anymore, which eventually cause the test to **FAIL**.

The most important thing is that the test will fail for all the test scenarios with the same failure because of a single locator change. The test doesn’t know or have any way to know that the locator has changed, and it fails all the time.

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*tINBnScOW78vz8sKb6lWbA.gif)


## How to resolve the problem?

I am sure like me many of you are going through this day\-in and day\-out everyday while working with UI testing tools, it could be **Cypress**, **Selenium** or **Playwright**. The problem is always imminent regardless of the tool

Now let's understand how we can resolve the problem above.

We all know **Generative AI** with **LLMs** (Large Language Models) are way beyond just text/image/video generation. They understand the given context and generate a meaningful set of information that we are looking for.

So, with the above problem statement, we can using the power of Gen AI using the OpenAI’s API which can pass our prompt request to LLMs like ***GPT 4o*** or ***GPT 4 turbo*** to understand the problem statement and give us meaningful solution.


> So, whats the prompt request we need to pass to OpenAI’s API to get the operation to happen in our test automation?

Well, this diagram will give you the answer

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*bsCOcyWc0FDnxPp9ApssVw.gif)

We can send OpenAI’s API the “**Actual Page Under Test**” of our application and our Selenium Test’s “**Page Object Model**” code as a prompt (with a few extra response parsing details). This will act as a validation process from OpenAI’s API to see if the locators match the given page.

Based on that operation, we can tell the test to execute or not. The locators have changed, so it’s not worth running the test any further.

The code to perform the above operation will look something like this


```python
public static async Task<string> VerifyPageLocatorFromAiAsync(string pomFileContent, string htmlPageSource)
{
    ChatClient client = new(model: "gpt-4o-mini", apiKey);
    
    var chatMessage = $"Verify if locators from this Selenium POM class: {pomFileContent} match this page source: {htmlPageSource}\", only return True or False result";

    ChatCompletion completion = await client.CompleteChatAsync(chatMessage);

    return completion.Content.FirstOrDefault().Text;
}
```
The code above is just part of the large code covered in the course, but you can see how straightforward it is to perform the operation of analysing your page against the Page Object Model code of Selenium.


## GenAI in Software Testing Course

*Most of the above discuss is just a slice of the topic we have discussed in my new course in Udemy on “[**Using Generative AI in Software Automation Testing**](https://proxy.rifx.online/https://www.udemy.com/course/generative-ai-in-software-automation-testing/)”*

Here is the course content

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*lHe_b7qVqUQo-9Y5.png)

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*rMrsbB2IaKPbthdAr9Rc9g.png)

The course is currently available for discount in Udemy as the launch offer, please use coupon code **EA\_NOV\_24 ⚡️** for discount while purchasing the course.

If the coupon code is expired, please feel free to comment on this post, I will send you the latest available coupon code.


