---
title: "6 Steps to Make AI Write Your Python Code for You | by Nabil Alouani | Towards Data Science"
meta_title: "6 Steps to Make AI Write Your Python Code for You | by Nabil Alouani | Towards Data Science"
description: "The article presents the INSPIRe framework, a six-step process for using AI to automate Python code generation effectively. It emphasizes the importance of prompt engineering, allowing users to outsource up to 90% of coding tasks to AI models like ChatGPT-4 and Claude 3. The six steps include identifying goals, narrating instructions, screening code for errors, polishing for efficiency, integrating snippets, and restarting the cycle for continuous improvement. The framework aims to enhance productivity by enabling users to focus on higher-level planning and problem-solving, ultimately aligning AI capabilities with real-world applications."
date: 2025-01-01T01:04:34Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*EBNHonyFAts5P5AYOLwn5g.png"
categories: ["Programming", "Programming/Scripting", "Machine Learning"]
author: "Rifx.Online"
tags: ["INSPIRe", "prompt", "engineering", "ChatGPT-4", "Claude-3"]
draft: False

---





### Use the INSPIRe framework to save time and gain a competitive edge (ChatGPT\-4 — Claude 3 — Gemini)



AI won’t replace you but someone who writes better prompts will.

That’s what I tell my friends in Data Science in Software Engineering. Some shrug it off. “Surely AI can’t generate multi\-step code,” they would say. Others laugh. “Come on now, it’s only useful for beginners!”

But soon enough, they all end up reaching out for prompt engineering tips.

By the end of 2022, LLMs have turned code generation from an end\-goal into a cheap resource you can use anytime. The deal is simple: prompts in; code out.

Gone is the era when you had to write every single line and scan for errors. If you learn how to talk to AI, you can outsource most of your code generation — and by “most” I mean 90%.







I’m a lousy programmer. Syntax is my worst enemy and for me, the road to hell is paved with indentations. AI solutions like Devin will replace me in no time — unless I find a way to twist the plot.

That’s why I put together the INSPIRe framework. The idea is to turn AI into an ally that does the work, not instead of me, but *for* me.

Every time I have to process a dataset or generate a synthetic one, I use INSPIRe to write my code in plain English. My only intervention is to change file paths, and variable names, and manage imports.

But wait, you may say, what’s there left to do?

The logic. The planning. The bigger picture. The stuff Devin can’t do.

AI models are like genius interns: they’re technically gifted but remain completely detached from the real world. They lack domain expertise and their sense of business is non\-existent.

All AI models do is follow instructions — and in that regard, they beat humans. However, instructions without goals are empty words.

It’s the human presence that aligns technological capabilities with real\-world value. People are scared because AI excels in execution when they should be excited.

If you can reliably outsource technical tasks, you’ll free your time to focus on the bigger picture. Except, many data folks haven’t caught up to the trend. Which means you have a competitive edge waiting for you to gain.

Free time, move faster, learn new skills, and generate more value.

Writing all of your code manually is as if you have a spaceship parked in your garage but you insist on taking the bus every day.

The question then becomes: Do you know how to pilot a spaceship?


## What’s the INSPIRe framework?

INSPIRe is a combination of Prompt Engineering and ideation. Generate ideas, write prompts. Write prompts, generate code. Test and repeat.

INSPIRe is a cycle of six steps you can follow to generate production\-ready code. The idea is to use clever prompts and combine them with a clear process.

Here’s a summary of each step:

**I — Identify:** Your first step is to identify your goal and its requirements.Your goal could be a task like “Write code that generates synthetic data.”A requirement could be a specific syntax your LLM hasn’t “seen” before. → **Turn your objective and its requirements into a flexible prompt**.

**N — Narrate:** Your second step is to break down your goal into instructions written in natural language.“Narrate” is an iterative process where you interact with your model in a conversational manner to modify or complete your code. → **Always start with a simple code snippet and build on it**.

**S — Screen:** The third step is all about verification. Open up your Jupyter Notebook or VS Code environment and engage in the screening ritual.Copy\-paste your code, insert file paths, and hit “run.”If an error message appears, try to fix the issues. You can also consult your LLM for assistance.Repeat until your code works as intended. → **Test and adjust your code and do it one snippet at a time.**

P — **Polish:** The fourth step comes in many forms.Maybe you’ll turn your code into a bunch of functions. Perhaps you’ll improve your error handling. How about reducing runtime?“Polish” is loaded with intellectual challenge because it’s the phase where you take your code from “OK” to “WOW.” → **Refine your code through iterative improvement**.

**I — Integrate:** The fifth step is about merging your code snippets, both old and new.If you’re starting from scratch, there may be nothing to integrate. The real challenge — and fun —begins when you combine existing code with new snippets.→ **Make sure your code snippets fit together through more trial and error.**

**Re — Restart:** The final step is where you circle back to the beginning. Sometimes, you’ll hit a wall and that’s when you start over from scratch. But more often, you’ll come up with new ideas as you develop your code. Implement them. → **Once you complete a code snippet, start a new cycle to generate the next**. INSPIRe works best when you use it in short increments.

Two more things:

* With INSPIRe, **testing output must be your constant companion**. Run each line of code and check the results. Let’s make this a habit, shall we?
* **You can run an INSPIRe loop inside an INSPIRE loop**. For instance, you can run a complete loop inside the “Polish” step to turn a piece of code into function. The process is a bit like Inception except you never get lost because you always circle back to the beginning.

INSPIRe is not a magic recipe that turns half\-baked instructions into full\-fledged programs. Rather, it’s a method born from trial and error — and you can’t apply it without thought.

You need to stay mentally engaged and get your hands dirty.

Code generation is much more sophisticated than “Hey LLM can you complete my code?”

You need to develop systems, like writing elegant prompts, breaking down problems into simpler tasks, and testing your code on fringe scenarios.

I put together the INSPIRe framework to help myself — and now you — to develop such systems. It’s a beginner\-friendly framework, but once you integrate it into your workflow, you’ll be able to outsource most of your code generation to AI.

My code is 90% AI\-generated / 10% human\-generated. It’s partly because I’m lazy and partly because I’m much better at Prompt Engineering than I am at writing code.

Speaking of Prompt Engineering, you’ll find a complete guide at the end of the article in case you’re not familiar with the art of prompting.


## How does INSPIRe work?

INSPIRe boils down to writing prompts and testing output.

You constantly interact with your AI model to tell it what to do. The more effort you put into your prompts, the more time you’ll save in the long run.

Don’t expect this to be easy though. Your initial attempts will be riddled with messy errors and outdated syntax. But if you stick with INSPIRe for a couple of days, you’ll set a new record for coding speed.

By now you may wonder which LLMs work best with INSPIRe — and the answer is “many.”

INSPIRe is a flexible framework designed to leverage the power of the most capable LLMs to date, such as ChatGPT\-4, Claude 3, Le Chat, and Gemini Advanced.

These models have “seen” millions of code snippets and memorized the underlying patterns. Plus, the massive data they consumed made them proficient in varied programming languages.

We’ll pick Python in this article because it’s the most used language in data\-related tasks (and because it’s the only language I use these days).

You can run INSPIRe to generate a piece of code from start to finish. But it works best if you split your project into multiple code snippets and iterate on each one.

Okay, what about interpretability and error messages?

It’s built into the framework as well.

If you have a question about a line of code, you can ask your model for explanations. Besides, if you prompt your model properly, you’ll be able to introduce elegant error\-handling techniques.

If that doesn’t work, look up relevant documentation, paste it into the chat window, and re\-ask your question.

We’ll apply INSPIRE to two examples:

* **First, a simple example:** the goal is to display how code generation works in a single INSPIRe loop. Picture it as a “Hello world!” example.
* **Second, a complex example:** this example is much more elaborate. The idea is to show you how INSPIRe works with complex tasks like generating synthetic text data. [Find it here.](https://readmedium.com/6-practical-steps-to-make-ai-write-your-python-code-for-you-2b3c6a35f174)

Both of the examples are stored in Jupyer Notebooks available on my Github profile. You’ll also find datasets and more resources. All the links you need are available at the end of the article.

Also you don’t need to understand every detail about every step on the first read. Focus on the overall logic and you’ll do more than fine.

Ready?


## Let’s try INSPIRe with a simple example

Suppose your goal is to generate code that allows you to process a text dataset. Imagine a sample scrapped from an e\-commerce website. Picture product reviews and other information like ratings and user IDs.

You want to perform a basic sentiment analysis and an Exploratory Data Analysis.

You open an LLM chat window, and so it begins.


## 1\. Identify

Start by writing an initial prompt that captures the premise of your goal and what you need to achieve said goal.

Let’s break the premise down into three core elements:

* **Specify the role of the LLM and the context:** Here you ground your model in a specific context like “Data Science” or “Web Development.”
* **Write clear instructions:** The more precise you are, the better your LLM’s output. One trick you can use to improve performance is to ask your model to always “think step by step.”
* **Add specific information:** Provide documentation and examples to teach your model specific syntax, such as calling a new API, and specify parameters such as which packages to import.

When writing your first prompt, keep in mind that one of the most efficient prompting techniques is to use placeholders .

Placeholders make it easier to edit your prompts. They also allow you to turn your prompts into reusable templates. Instead of rewriting a prompt from scratch, all you have to do is fill your  with new values.

Below is an example of a flexible prompt. Notice placeholders like `<programming_language>` and `<objective>` inside the prompt.


```python
[Step #1 -The IDENTIFY prompt]

* Role:
Act like an expert software engineer who specializes in <programming_language>.
Your role is to help me achieve the following objective: <objective>.

##

* Guidelines:
Write elegant and functional code in <programming_language>.
Reason step by step to make sure you understand the user intentions before you turn them into elegant code.
Make sure the code you write and/or edit is clear and well-commented.
Write code that adheres to the best practices in <programming_language>.
When you first respond, acknowledge the instructions you've been given then ask the user to describe the intentions they want to turn into code.
Refrain from generating code during your first response.

##

* Specifics:
When I indicate specific syntax and functions, make sure to remember the provided syntax and use it for the code you generate.
Assume I always provide the correct syntax but always verify my indentations, symbols, and punctuation.
<more_specifics>. 

##

* Format:
Give a clear title to each code snippet you generate.
For example you can title the first code snippet "Snippet #1 version 1.0"
If you edit "Snippet #1 version 1.0" then the output should be called "Snippet#1 version1.1" and so on.
If you move to a new function or piece of code, you should name it "Snippet#2 version 1.0"
When you interact with me in natural language, use line breaks, titles, and elegant formatting to ensure a pleasant reading experience.

##

* Inputs:
<objective> = Write code that takes an Excel file as input and manipulate it.
You'll receive more detailed instructions in a later step.

<programming_language> = Python 3.11.5

<more_specifics> = You'll receive the dataset and the instructions after you acknowledge the instructions.

##
```
Did you spot how vague the `<objective>` sounds?

The idea of“Identify” is to prime your LLM with context without too much detail. You’ll have plenty of room for specifics in later steps. For now, focus on setting the stage for your model to understand the task at hand.

In fact, when responding to the “Identify” prompt, your LLM may react with a few questions that help it improve its understanding of the context.

Here are two questions I often get when running INSPIRe:

* “Do you need assistance with installing any Python libraries?”
* “Do you have a specific library preference for working with Excel files in Python, such as pandas or openpyxl?”

Once you answer such questions, you’ll be able to move the “Narrate” step.


## 2\. Narrate

Here, your job is to break down the `<objective>` into detailed instructions written in plain English.

**Side note:** Embrace repetition. Repeating yourself inside your prompts is not a bug. It’s a feature. Every time you rewrite an instruction in a follow\-up prompt, you “remind” the model to stay on course.

Here’s an example of a “Narrate” prompt:


```python
[Step #2 -The NARRATE prompt]

Write a code snippet that takes an Excel file as input and manipulate it using the pandas library.
The Excel file contains a synthetic dataset made of product reviews.
Load the Excel file into a data frame.
Add a column called "Sentiment" and fill it according to the following rule: Ratings from 1 to 3 are considered 'Negative" and ratings of 4 and 5 are considered "Positive."
Add a column called Rating and fill it with random numbers from 1 to 5.
```
The last instruction was a genuine mistake on my side. I thought my sample dataset didn’t have a “Rating” column but I was wrong. There was a column called “Product Rating.”

I caught the mistake in the “Screen” step as we’ll see in a minute.

Meanwhile, here’s the initial output of the model:


```python
import pandas as pd
import numpy as np

## Function to load the Excel file and manipulate the data
def process_excel_file(file_path):
    # Load the Excel file into a DataFrame
    df = pd.read_excel(file_path)
    
    # Add the 'Sentiment' column based on 'Product Rating'
    df['Sentiment'] = df['Product Rating'].apply(lambda x: 'Positive' if x >= 4 else 'Negative')
    
    # Add a 'Rating' column with random numbers from 1 to 5
    df['Rating'] = np.random.randint(1, 6, df.shape[0])
    
    return df

## Example usage
## Replace 'path_to_your_excel_file.xlsx' with the actual file path
file_path = "path_to_your_excel_file.xlsx"
processed_df = process_excel_file(file_path)

## Display the first few rows of the processed DataFrame
print(processed_df.head())
```
Time to test the output, which means time for “Screen.”


## 3\. Screen

Here, you copy\-paste your code into a Jupyter Notebook, replace your file paths and press “run.” That’s when you realize you introduced an extra column that nobody asked for.

During the Screen step, you can edit the code yourself or ask the model to edit it for you.

In the case of the example, there were two adjustments to make:

1. Remove the unnecessary “Rating” column;
2. Display a “sample” of the data frame (df) instead of its “head.”

Here’s the updated code generated by an LLM:


```python
import pandas as pd
import numpy as np

## Function to load the Excel file and manipulate the data
def process_excel_file(file_path):
    # Load the Excel file into a DataFrame
    df = pd.read_excel(file_path)
    
    # Add the 'Sentiment' column based on 'Product Rating'
    df['Sentiment'] = df['Product Rating'].apply(lambda x: 'Positive' if x >= 4 else 'Negative')
    
    return df

## Example usage
## Replace 'path_to_your_excel_file.xlsx' with the actual file path
file_path = "path_to_your_excel_file.xlsx"
processed_df = process_excel_file(file_path)

## Display the first few rows of the processed DataFrame
print(processed_df.sample(5)) #changed from print(processed_df.head()) to print(processed_df.sample(5))
```
Now replace your file path and run the updated code.

Feels like a Déjà vu?

That’s because INSPIRe is built around testing and adjusting. Most of your clicks will be copy\-pastes, and each time dopamine will rush into your brain.

Even when your code works, the excitement won’t wear off because you know you’re far from done. You know you can improve and optimize.

Which brings us to the “Polish” step.


## 4\. Polish

Your job in this step is to make your code more robust, efficient, and elegant. There are as many “Polish” possibilities as there are lines of code.

In the case of our code snippet, it’s easy to spot two improvement points:

1. Make the code handle the case where the desired column is missing. Display an error message in such case.
2. Make the code handle both Excel files and CSV files. Display an error message if the file type doesn’t match the requirements.

Speaking of error handling, here’s a templated prompt you can use to introduce to better handle errors inside any code snippet:


```python
[Step #4 POLISH]
[Sub-task:Error-handling]
[Flexible prompt for error-handling]

*Role:
Act like a software engineer specializing in <programming_language>.
Your task is to enhance <input_code> to handle errors effectively.

##

* Guidelines:
Reason step-by-step to improve <input_code> in <programming_language> to robustly handle errors.
Ensure the code is well-commented, clear, and adheres to error handling best practices.
Start by identifying potential error sources in <input_code> and propose solutions.

##

* Specifics:
Incorporate try-except blocks, error logging, and recovery mechanisms as needed in <input_code>.
Validate syntax and error handling logic meticulously.

##

* Format:
Title modifications as "Error Handling Enhancement vX.Y" where X is the snippet number and Y is the version.

##

* Inputs:

<programming_language> = Python 3.11.5

<input_code> = [insert your code here]
```
Make error handling an essential part of your “Polish” step. It’s a very low\-cost investment that compounds every time you run your code.

Going back to our code, here’s what the polished code looks like after the error\-handling session:


```python
import pandas as pd
#Notice how the LLM knew we don't need the NumPy package anymore

## Function to determine the file type and appropriately load the data
def load_data(file_path):
    if file_path.endswith('.xlsx'):
        return pd.read_excel(file_path)
    elif file_path.endswith('.csv'):
        return pd.read_csv(file_path)
    else:
        raise ValueError("Unsupported file format. Please provide an Excel or CSV file.")

## Function to process the file and add the 'Sentiment' column
def process_file(file_path):
    # Load the data with the appropriate function based on file type
    df = load_data(file_path)
    
    # Check if the 'Product Rating' column exists
    if 'Product Rating' not in df.columns:
        raise KeyError("'Product Rating' column not found in the provided file.")
    
    # Add the 'Sentiment' column based on 'Product Rating'
    df['Sentiment'] = df['Product Rating'].apply(lambda x: 'Positive' if x >= 4 else 'Negative')
    
    return df

## Example usage
## Replace 'path_to_your_file.xlsx' or 'path_to_your_file.csv' with the actual file path
file_path =  "path_to_your_excel_file.xlsx / path_to_your_csv_file.csv"
processed_df = process_file(file_path)

## Display a sample of rows taken of the processed DataFrame
print(processed_df.sample(5))
```
Guess what’s your next action?

Exactly.

Cpy\-paste your updated code and test it. These two actions are instantaneous and easy to miss. Yet, they are the beating heart of INSPIRe. What’s the brain? You and your prompts of course.

Once you’re done with verification, you can proceed to the fifth step.


## 5\. Integrate

In our example, we started the code snippet from scratch so we don’t need this step.

In other (most?) cases, you want to check dependencies and variable names. Make sure your new code snippet is coherent with its predecessors before you append it.

And yes, “Integrate” involves a lot of testing as well.

I’m super mega ultra annoying with testing for a simple reason. If two or more cumulative errors make their way into your generated code, you lose. You end up spending the time you saved with INSPIRe in debugging mode.

Fine, you may say, I’ll test every single line of code. Now what Mister Bald Prompter?


## 6\. Restart

Your first INSPIRe iteration is done. Congratulations. You got yourself a functional code snippet you can use right away.

You can’t call it a day though, especially with all the ideas you have in mind.

You decide to write another code snippet, and so you start another INSPIRe loop.

This time, you’ll ask the model to write a basic Exploratory Data Analysis (EDA) for the data frame you just processed.

Since you’ve been working with ChatGPT/Claude3/LeChat/Gemini to generate code, you have two options.

* Option\#1: Continue on the same chat tab;
* Option \#2: Start a new discussion with your model.

If you opt for the latter, make sure to insert your latest code snippet into your chat window. That’s how you let it know it’s a continuation of previous work.

Regardless of which option you pick, you’ll always circle back to the “Identify” step and write a new prompt.

Here’s an example:


```python
[Step #1 -The IDENTIFY prompt]

* Role:
Act like an expert Data Scientist who specializes in <programming_language>.
Your role is to help me achieve the following objective: <objective>.

##

* Guidelines:
Write elegant and functional code in <programming_language>.
Reason step by step to make sure you understand the user intentions before you turn them into elegant code.
Make sure the code you write and/or edit is clear and well-commented.
Write code that adheres to the best practices in <programming_language>.
When you first respond, acknowledge the instructions you've been given then ask the user to describe the intentions they want to turn into code.
Refrain from generating code during your first response.

##

* Specifics:
When the user indicates specific syntax and functions, make sure to remember the provided syntax and use it for the code you generate.
Assume the user provides the correct syntax but always verify indentations, symbols, and punctuation.
<more_specifics>. 

##

* Format:
Give a clear title to each code snippet you generate.
For example you can title the first code snippet "Snippet #1 version 1.0"
If you edit "Snippet #1 version 1.0" then the output should be called "Snippet#1 version1.1" and so on.
If you move to a new function or piece of code, you should name it "Snippet#2 version 1.0"
When you interact with the user in natural language, use line breaks, titles, and elegant formatting to ensure a pleasant reading experience.

##

* Inputs:
<objective> = Conduct a basic EDA on the modified dataset to visualize the distribution of product ratings, count of reviews by sentiment, and average product rating by sentiment.

<programming_language> = Python 3.11.5

<more_specifics> = Take into account the dataframe I loaded alongside the prompt.
The code you'll generate is a continuation of the the following code:
[Insert your previous code here]
```
For simplicity, let’s fast forward a bit.

Imagine you had a fantastic hour running a couple of INSPIRe loops. Here’s what you’d get by the end:


```python
## Import necessary libraries for EDA and text analysis
import matplotlib.pyplot as plt
import seaborn as sns
from wordcloud import WordCloud, STOPWORDS

## Let's assume 'processed_df' is the DataFrame we obtained from the previous step
## If not, you should load/process your data accordingly

### DISTRIBUTION OF SENTIMENTS AND PRODUCT RATINGS

## 1. Set a visual style for seaborn
sns.set(style="whitegrid")

## 2. Create the figure and axes for a 1x2 grid of plots
fig, ax = plt.subplots(1, 2, figsize=(16, 6))

## 3. Plot the distribution of sentiments
sns.countplot(x='Sentiment', data=processed_df, ax=ax[0], palette="viridis")
ax[0].set_title('Distribution of Sentiments')
ax[0].set_xlabel('Sentiment')
ax[0].set_ylabel('Count')

## 4. Plot the distribution of product ratings
sns.countplot(x='Product Rating', data=processed_df, ax=ax[1], palette="cividis")
ax[1].set_title('Distribution of Product Ratings')
ax[1].set_xlabel('Product Rating')
ax[1].set_ylabel('Count')

plt.tight_layout()  # Adjust layout to prevent overlap and ensure everything fits well

### TEXT ANALYSIS 

## 1. Combine all comments into a single text string
all_comments = ' '.join(processed_df['Comment'].dropna())

## 2. Text preprocessing - define stopwords to exclude from the analysis
stopwords = set(STOPWORDS)

## 3. Generate the word cloud
wordcloud = WordCloud(width=800, height=400, background_color='white', stopwords=stopwords, max_words=100).generate(all_comments)

## Plot the word cloud
plt.figure(figsize=(10, 5))
plt.imshow(wordcloud, interpolation='bilinear')
plt.axis('off')  # Hide the axes
plt.show()
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*QsAqV0FLmQvEmpOFf5ADbw.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*exuGTZgN8D7JmwJGOBgKNA.png)

And voilà, that’s what the INSPIRe framework looks like in action.

It might seem like a lot of work for just a couple of code snippets. But over time and repetition, you’ll learn to combine steps, skip some, and iterate on others.

Once you get used to INSPIRe, you’ll zip through much faster. You’ll save time, being freed from by typing code. Instead, you’ll focus on crafting solutions and strategies. You may take on new projects or free a slot for that ML course you want to take.

Speaking of efficiency, here are key points you’ll (re)learn along the way:

* Use flexible prompts and save them as templates.
* Use meta\-prompting to improve your prompts (more on this here).
* Never upload proprietary data into an LLM; use samples of synthetic data instead.
* Test every single code snippet the model gives you. Every. Single. Code. Snippet.
* Start from scratch every time you hit a wall.


## Limitations of INSPIRe

INSPIRe can be a “nothing to lose, everything to win” type of deal. It speeds up your code generation and helps you catch errors. However, it’s easy to dismiss the framework since it requires a few hours of practice.

Everyone with an Instagram handle may offer you quicker solutions. But as soon as you apply such “solutions” on real\-life examples, they’ll break. They’re nothing more than half\-baked demos.

In contrast, INSPIRe is derived from trial and error. It’s a collection of tested techniques designed to help you move faster and stay competitive in a job market that keeps getting crazier.

Also keep in mind that INSPIRe is not set in stone. It’s a flexible framework you can adapt to your preferences. In fact, the ideal version of INSPIRe is the one you fine\-tune for yourself.

As you make INSPIRe your own, you will likely encounter at least six limitations — but worry not, you can overcome each one of them:

* **Lack of Python knowledge:** If you don’t know what’s possible with Python, your instructions won’t matter. Make sure to cover the basics and keep up with new releases.
* **New syntax:** New packages and functions are released every day. Since code\-generation assistants might not recognize these updates, make it a habit to provide documentation and code examples to familiarize your AI assistants with new syntax.
* **Prompt Engineering:** LLMs are powerful tools but they can’t read your mind. Learn to articulate precise prompts to improve your outputs.
* **Ideation:** INSPIRe necessitates clear goal definition and problem\-solving techniques. I like to use least\-to\-most reasoning, but there are many useful methods. Pick one and stick with it.
* **Multi\-step programs:** It’s tempting to ask your LLM to generate a fully\-fledged program in one go. It’ll often fail because LLMs suck at planning. You need to guide them, one step at a time.
* **Compliance/Resistance:** These are two faces of the same coin. You may become too reliant on LLMs and skip verification. You may also stick to writing code manually to feel useful. Avoid ego traps and focus on what matters: getting things done.


## They’ll trust you more than AI

INSPIRe is a way to write code in plain English. All you need is a decent sense of logic and the subtle art of trial and error. In other words, you do the thinking and let the machine handle the writing.

This is probably the future of most tech jobs. Each one of us will have a small army of AI assistants working for us and we’ll manage them and verify their work. We’ll be the humans in the loop.

INSPIRe gives you a glimpse into that future.

Sure, companies like Cognition AI will continue to develop fully automated agents like Devin. But even then, you’ll always need human intervention; someone to write prompts and put the pieces together.

Don’t underestimate our species.

It’s true we humans suck at specialization, but we have an incredible gift we take for granted. We can plan. We can break down big goals into a series of small steps and adjust as we go.

In the case of code generation, it’s about setting the direction, tweaking the course, and ensuring the outcomes align with what’s best for us.

Machines are powerful tools, but without human hands to guide them, they’re worthless junk. It’s the interplay of human creativity and machine capability that pushes the world forward.

Welcome to the era of code generation.


## Want to get better at prompting?

I’m launching [The Bald Prompter](https://nabilalouani.substack.com/subscribe) newsletter where you’ll receive prompt engineering tips and **one advanced prompt per week.**

The first 200 paid subscribers ($5 per month) will get a complete [Prompt Engineering guide](https://nabilalouani.gumroad.com/l/prompt_engineering_guide_nabil-alouani) (priced at $60\) as a welcome gift.

[**GitHub repository:**](https://github.com/NabilAlouani/INSPIRe_/tree/main/use_cases/data_analysis)

**Relevant reads:**


