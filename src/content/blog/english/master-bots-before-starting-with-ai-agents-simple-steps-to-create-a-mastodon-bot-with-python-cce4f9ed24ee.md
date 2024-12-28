---
title: "Master Bots Before Starting with AI Agents: Simple Steps to Create a Mastodon Bot with Python | by Sarah Lea | Dec, 2024 | Towards Data Science"
meta_title: "Master Bots Before Starting with AI Agents: Simple Steps to Create a Mastodon Bot with Python | by Sarah Lea | Dec, 2024 | Towards Data Science"
description: "The article discusses the creation of a Mastodon bot using Python, highlighting the significance of bots in social networks like Mastodon, a decentralized alternative to traditional platforms. It outlines the technical requirements for bot development, including programming languages, API access, and hosting options. The author provides a step-by-step guide for building a bot that searches and re-shares posts with a specific hashtag. Ethical considerations regarding bot usage, such as transparency and data protection, are emphasized, alongside the potential benefits and risks associated with automated bots in social media environments."
date: 2024-12-28T02:07:34Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*RZXwxa8tTe24Ch7cJwUGbQ.png"
categories: ["Programming", "Technology/Web", "Ethics"]
author: "Rifx.Online"
tags: ["Mastodon", "Python", "bot", "API", "hashtag"]
draft: False

---




I recently published a post on Mastodon that was shared by six other accounts within two minutes. Curious, I visited the profiles and discovered that at least one of them was a tech bot — accounts that automatically share posts based on tags such as \#datascience or \#opensource.

Mastodon is currently growing rapidly as a decentralized alternative to X (formerly Twitter). How can bots on a platform like this make our everyday lives easier? And what are the risks? Do bots enrich or disrupt social networks? How do I have to use the Mastodon API to create a bot myself?

In this article, I will not only show you how bots work in general but also give you a step\-by\-step guide with code examples and screenshots on how to create a Mastodon bot with Python and use the API.


> **Table of Content**1 — Why do Mastodon and tech bots exist?2 — Technical basics for a bot on a social network3 — Bots: The balancing act between benefit and risk4 — How to create a Mastodon bot: Step-by-step instructions with PythonFinal Thoughts


## 1 — Why do Mastodon and tech bots exist?

Mastodon is a decentralized social network developed by Eugen Rochko in Germany in 2016\. The platform is open\-source and is based on a network of servers that together form the so\-called ‘Fediverse’. If you want to share posts, you select a server such as mastodon.social or techhub.social and share your posts on this server. Medium also has its own server at me.dm. Each server sets its own rules and moderation guidelines.

Bots are basically software applications that perform tasks automatically. For example, there are simple bots such as crawler bots that search the internet and index websites. Other bots can do repetitive tasks for you, such as sending notifications or processing large amounts of data (automation bots). Social media bots go one step further by sharing posts or reacting to content and thus interacting with the platforms. For example, a bot can collect and share the latest news from the technology industry so that followers of this bot profile are always up to date — the bot becomes a curator that curates according to precisely defined algorithms…

Chatbots are also a specific type of bot that are used for customer support, for example. They were developed primarily for dialog with us humans and focus much more on natural language processing (NLP) in order to understand our language and respond to it as meaningfully as possible. Agents, which are currently a hot topic of discussion, are in turn a further development of bots and chatbots: agents can generally take on more complex tasks, learn from data and make decisions independently.

Fun fact: Eliza, which was developed as a chatbot at MIT, was already able to simulate simple conversations in 1960\. 65 years later, we have arrived in the world of agents…

[*Reference: ELIZA\-Chatbot*](https://en.wikipedia.org/wiki/ELIZA)

However, bots can also spread disinformation by automatically disseminating false or misleading information on social networks to manipulate public opinion. Such troll bots are repeatedly observed in political elections or crisis situations, for example. Unfortunately, they are also sometimes used for spam messages, data scraping, DDOS cyberattacks or automated ticket sales. It is therefore important that we handle automated bots responsibly.


## 2 — Technical basics for a bot on a social network

In simple terms, you need these three ingredients for a bot:

1. Programming language: Typical programming languages are Python or JavaScript with Node.js. But you can also use languages such as Ruby or PHP.
2. API access: Your bot sends a request to the application programming interface (API) of a social network and receives a response back.
3. Hosting: Your bot must be hosted on a service such as Heroku, AWS, Replit or Google Cloud. Alternatively, you can run it locally, but this is more suitable for testing.

**Programming language**Popular languages for a bot are Python or JavaScript — depending on the requirements and target platform. Python offers many helpful libraries such as Tweepy for Twitter (but now limited in use due to the changes to Twitter\-X), Mastodon.py for the Mastodon API or Python Reddit API Wrapper (PRAW) to manage posts and comments for Reddit. Node.js is particularly suitable if your bot requires real\-time communication, server\-side requests or integration with multiple APIs. There are libraries such as mastodon\-api or Botpress that support multiple channels. For bots on Facebook and Instagram, on the other hand, you need to use the Facebook Graph API, which has much stronger restrictions. And for Linkedin, you can use the LinkedIn REST API, which is designed more for company pages.

**API**Most modern APIs for social networks are based on the REST architecture. This API architecture uses HTTP methods such as GET (to retrieve data), POST (to send data), PUT (to update data) or DELETE (to delete data). For many platforms, you need a secure method such as OAuth2 to have access with your bot to the API: For this, you first register your bot with the platform to receive a client ID and a client secret. These credentials are used to request an access token, which is then sent with every request to the API.

**Hosting**Once your bot is ready, you need an environment in which your bot can run. You can run it locally for test purposes or prototypes. For longer\-term solutions, there are cloud hosting platforms such as AWS, Google Cloud or Heroku. To ensure that your bot also works independently of the server environment without any problems, you can use Docker, which packages your bot together with all the necessary settings, libraries and dependencies in a standardized “package” that can be started on any server.

In addition, you can automate your bot with cron jobs by running your bot at certain times (e.g. every morning at 8\.00 a.m.) or when certain events occur (e.g. a post with a certain hashtag was shared).




## 3 — Bots: The balancing act between benefit and risk

There are big differences in quality between bots — while a well\-programmed bot responds efficiently to requests and delivers added value, a poorly designed bot can be unreliable or even disruptive. As described at the beginning, a bot is a software application that performs automated tasks: The quality of the bot depends on how the underlying algorithms are programmed, what data the bot has been fed with in the case of AI bots and how the design and interactions are structured.

So how do we create ethically responsible bots?

1. Transparency: Users need to know that they are interacting with a bot and not a human. Bots that disguise this only destroy trust in the technology. For example, Mastodon has a rule that bots’ profiles must be clearly labeled. It is also possible for the bot to add a small note to every interaction or post that makes it clear that the interaction originates from a bot.
2. No manipulation: Bots must not be used to spread disinformation or manipulate users in a targeted manner.
3. Respect for the platform and people: Bots must follow the rules of the respective platform.
4. Data protection must be respected: For example, if bots analyze user profiles, it must be ensured that the bot does not store data that it should not or it must be defined who has access to this data and how it is used in order to comply with data protection laws such as the GDPR in Europe.


### Are bots good or bad? Do bots disrupt social networks or enrich them?

In my opinion, technology that automates repetitive tasks is always valuable. On the one hand, well\-developed bots can provide us with valuable information, stimulate discussions or act as support for curators.On the other hand, bots can spread spam, be discriminatory or dominate discussions. In my opinion, such technologies are most useful when they are used as support.

Let’s imagine for a moment a social platform that consists only of trained bots that carry out the discussions among themselves — in my opinion, that would be a pretty boring platform — the humanity is missing. The interactions would have a “bland aftertaste”. Also, when it comes to automation, I often think that although technology performs the task more “perfectly”, but the creativity and love is missing compared to when the task was performed by a human who works professionally and in detail. The human touch, the unforeseen is missing.


## 4 — How to create a Mastodon bot: Step\-by\-step instructions with Python

We want to create a bot that regularly searches Mastodon posts with the hashtag \#datascience and automatically reposts these posts.


### Everything you need to get started

* Python must be installed on your device.
Tip for newbies: On Windows, you can use ‘python — version’ in Powershell to check if you already have Python installed.
* You need an IDE, such as Visual Studio Code, to create the Python files.
* Optional: If you are working with the Anaconda distribution, it is best to create a new project with ‘conda create — name NameEnvironment python\=3\.9 \-y’ and install the libraries in this project so that there are no dependencies between the libraries.
Tips for newbies: You can then activate the environment with ‘conda activate NameEnvironment’. The \-y stands for the fact that all confirmations are automatically accepted during the installation.


### 1\) Install the Mastodon.py library

First we install Mastodon.py with pip:


```python
pip install Mastodon.py
```
Tips for newbies: With ‘pip — version’ you can check if pip is installed. If no version is displayed, you can install pip with ‘conda install pip’.


### 2\) Register the app for the bot on techhub.social

If you don’t have an account on techhub.social yet, register. Techhub.social describes itself as a Mastodon instance for passionate technologists and states in the rules that bots must be marked as Bot in their profile.

We now register our app for our bot using the ‘Mastodon.create\_app()’ function. To do this, we create a Python file with the name ‘register\_app.py’ and insert this code: In this code, we register the bot with Mastodon to gain API access and save the necessary access data. First, we create the app with ‘Mastodon.create\_app()’. We save the client credentials in the file ‘pytooter\_clientcred.secret’. Then we log in to Mastodon to generate the user credentials. We save these in another file ‘pytooter\_usercred.secret’. We add the error handling to catch problems such as incorrect login data.


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
Then we enter this command in the Anaconda prompt to execute the script:


```python
python register_app.py
```
If everything worked successfully, you will find the file ‘pytooter\_clientcred.secret’ in your directory, which contains the app\-specific credentials for our app that were generated when the app was registered. In addition, there should be the file ‘pytooter\_usercred.secret’, which contains the user\-specific access data. This information was generated after the successful login.

You will see the following output in the terminal:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*IgSKO4uM6ENiiFTnUixXHg.png)

Tips for newbies: Tooten is used in Mastodon to say that a post is published (like tweeting on Twitter). The two secret files contain sensitive information. It is important that you do not share them publicly (e.g. do not add them to your GitHub repository). If you want to use 2FA, you must use the OAuth2 flow instead. If you open your Mastodon account in the desktop application you can check this setting in Settings\>Account\>Two\-Factor\-Authentication.


### 3\) Publish test post via API

Once the registration and login has worked successfully, we create an additional file ‘test\_bot.py’ and use the following code. First we load the user credentials from ‘pytooter\_usercred.secret’ and connect to the Mastodon API. With ‘mastodon.toot()’ we specify the content we want to publish. We display a confirmation in the terminal that the toot has been sent successfully.


```python
from mastodon import Mastodon

mastodon = Mastodon(
    access_token='pytooter_usercred.secret',
    api_base_url='https://techhub.social'
)

mastodon.toot('Hello from my Mastodon Bot! #datascience')
print("Toot gesendet!")
```
We save the file in the same directory as the previous files. Then we open the file in the terminal with this command:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*SXheCoAvFCpOmrCEgFUzIg.png)

On Mastodon we see that the post has been successfully tooted:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*D0-q4W1g4KUv4zIqFUeSUA.png)


### 4\) Reblog posts with a specific hashtag

Now we want to implement that the bot searches for posts with hashtag \#datascience and re\-shares them.

In a first step, we create a new file ‘reblog\_bot.py’ with the following code: Using the ‘reblog\_datascience()’ function, we first connect to the Mastodon API by loading the user credentials from ‘pytooter\_usercred.secret’. Then the bot uses ‘timeline\_hashtag()’ to retrieve the last 3 posts with the hashtag \#datascience. With ‘status\_reblog()’ we automatically share each post and display the ID of the shared post in the terminal.

To avoid overloading, the API allows up to 300 requests per account within 5 minutes. With ‘limit\=3’ we specify that only 3 posts are reblogged at a time — so this is not a problem.


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
As soon as you run the file, 3 posts will be reblogged in your profile and you will see the IDs of the 3 posts in the terminal:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*GnK0ojDH-9FluWobH4bdxA.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Hi1tvnBZnRdLLuOql6awNQ.png)

*Note: I have removed the posts from my Mastodon account afterwards as my profile is not labeled as a bot.*


## Final Thoughts

We could extend the bot even further, for example by adding functions so that duplicate posts are not reblogged or that error messages (e.g. due to missing authorizations) are caught and logged. We could also host the bot on a platform such as AWS, Google Cloud or Heroku instead of running it locally on our computer. For automated execution, it would also make sense to set up a scheduler. On Windows, for example, this can be tried out with the Task Scheduler. This will run the bot regularly (e.g. every morning at 8\.00 a.m.), even if the terminal is closed. On Linux or Mac, we could use alternatives such as cron jobs.

Like practically any technology, bots can offer great benefits if we use them in a considered, ethical and data protection\-compliant manner. However, they can also disrupt social platforms if we misuse them.


### Where can you continue learning?

* [Mastodon — Getting startet with the API](https://docs.joinmastodon.org/client/intro/)
* [GitHub — Mastodon.py Package](https://github.com/halcy/Mastodon.py)
* [Medium — Join Mastodon with Medium](https://blog.medium.com/join-mastodon-with-medium-e2d6d814325b)
* [Medium — Python Data Analysis Ecosystem — A Beginner’s Roadmap](https://readmedium.com/python-data-analysis-ecosystem-a-beginners-roadmap-adf22ba20ed2)
* [Wikipedia — Mastodon (social network)](https://en.wikipedia.org/wiki/Mastodon_(social_network))
* [Datacamp Blog — Building a chatbot with Python](https://www.datacamp.com/tutorial/building-a-chatbot-using-chatterbot)
* [GeeksForGeeks — How to Build Web scraping Bot in Python](https://www.geeksforgeeks.org/how-to-build-web-scraping-bot-in-python/)
* [IBM Blog — What are AI Agents?](https://www.ibm.com/think/topics/ai-agents)
* [Datacamp Blog — Getting started with AutoGPT, AgentGPT \& BabyAGI](https://www.datacamp.com/tutorial/introduction-to-ai-agents-autogpt-agentgpt-babyagi)

