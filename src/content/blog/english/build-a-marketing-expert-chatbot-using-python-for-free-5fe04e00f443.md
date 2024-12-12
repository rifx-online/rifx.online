---
title: "Build a Marketing Expert Chatbot using Python for Free!"
meta_title: "Build a Marketing Expert Chatbot using Python for Free!"
description: "This article outlines the process of building a marketing expert chatbot using Python and the DSPy framework. Key steps include configuring the Google Gemini-1.5-flash model with a Google API key, setting up the DSPy environment, and creating a custom `CoT` class to handle user queries. The chatbot is designed to provide marketing-specific advice and can be queried using a simple `forward` method. The article also provides a detailed code structure and a complete codebase for reference."
date: 2024-12-12T01:36:35Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*CDuCa3Bcol5tqbuz"
categories: ["Programming", "Chatbots", "Marketing"]
author: "Rifx.Online"
tags: ["Python", "chatbot", "DSPy", "Gemini", "marketing"]
draft: False

---


### Marketing Chatbot using Python and DSPY





### Build your marketing expert sidekick, specially tailored to answer all your marketing\-specific queries using Python and DSPy.


> ***Not a member?Feel free to access the full article [here](https://readmedium.com/build-a-marketing-expert-chatbot-using-python-for-free-5fe04e00f443?sk=f8d1bbfd3d03229b839000104e87da79).***

Marketing is one of those things whose implementation crucially affects whether the product will succeed or fail. Apart from affecting sales growth, brand building, and customer acquisition, it also impacts customer loyalty.



Understanding the benefits and criticality of marketing for any project. We will create a marketing expert, that will help you with all your marketing queries.

So, let’s get into it.

Here’s the TOC of this article, for your reference.


> **· Work Flow of the Project· Collecting Pre-requisites (Google API key)· Installing Packages ∘ DSPy· Writing Code ∘ Structure of Code ∘ DSPy Model Configuration(gemini-flash-1.5) ∘ DSPy Signature ∘ CoT Class (with DSPy Chain Of Thought Module) ∘ Object of CoT ∘ Using the Chatbot· Complete Code Base· Conclusion· Author’s Note**

So, let’s get started.


## Work Flow of the Project

Before we actually start working on the project, let’s get ourselves clear with the workflow of our marketing chatbot.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*W2F3J1-tCH18NsqNwdufZg.png)


## Collecting Pre\-requisites (Google API key)

Let’s collect a bunch of requirements necessary to build the project.

For this project, we will be using Google’s `gemini-1.5-flash` model as our base LLM, and for that, we will need Google’s API KEY, to query the model and retrieve its responses.

To get your own free Google API KEY, just follow these easy 2 steps given below,\-

1. Visit <https://aistudio.google.com/app/apikey>
2. After logging into your Google account, click on `Create API key`.
3. Select any of the existing Google Cloud Projects.
4. Click on `Create API key in existing project`.
5. Done! Save this API key for later use.


## Installing Packages

Now, let’s install some packages that will be used in the project. The packages are,\-


### DSPy

DSPy is a framework for programming foundation models, including Large Language Models and Retrieval Models, in a truly declarative and modular way. It comes with an automatic compiler that guides the LLM on conducting those declarative steps into the program, eventually allowing us to focus on the high\-level logic, while giving up the fine\-tuning of the language model to specialized optimizers.

You can read more about this framework [here](https://python.langchain.com/docs/integrations/providers/dspy/).

We will be using one important method, of this package, known as `Chain Of Thought`. It serves the purpose of modifying the query to a well\-structured prompt, containing all the instruction and context needed for the LM model to give an answer.

To download the package, use the following command in your terminal.


```python
pip install dspy==0.1.5
```

## Writing Code

Now, we are well equipped with all our prerequisites and packages to get into the real coding stuff. So, let’s get started.


### Structure of Code

Let’s first understand the structure of our code through the following illustration.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*VNY_JB8vVlOdszQQ_mq-ng.png)

This illustration mentions a class `CoT`, which will be used as our marketing expert chatbot, to answer all our queries.

The class contains two methods `__init__()`, and `forward()`. The constructor function is used to initialize the Chain Of Thought Module of the DSPy package.

The Chain Of Thought Module in itself requires a DSPy Signature, which contains our initial prompt, a.k.a all the high\-level instructions that we wish to give to our model.

So, after understanding the structure, we know in what order we have to proceed.


> **DSPy Model Configuration(gemini\-flash\-1\.5\) \-\> DSPy Signature \-\>  CoT Class (with DSPy Chain Of Thought Module)\-\> Object of CoT \-\> Using the Chatbot**

Now let us conquer these steps in order,\-


### DSPy Model Configuration(gemini\-flash\-1\.5\)

Before we use the model, we need to configure the language model to `dspy` settings, and for that, we will require the Google API key, which we created earlier here.

To configure the `dspy` with the model,


```python
import dspy

gemini = dspy.Google(model='gemini-1.5-flash', api_key="<YOUR_GOOGLE_API_KEY>", temperature=0.3)
dspy.settings.configure(lm=gemini)
```
Here, you need to replace `<YOUR_GOOGLE_API_KEY>`, with your API Key.Also, here I have set the temperature to 0\.3, indicating slightly more creativity. You can play around and choose anything from 0 to 1 (creativity decreases towards 1\).


### DSPy Signature

DSPy signature contains the high\-level instructions, you wish to give to your model, and based on those instructions, DSPy tailors and optimizes the language model to fit the use case.

To define a DSPy signature,


```python
## Define the MarketingChatbot class that inherits from dspy.Signature
class MarketingChatbot(dspy.Signature):
  """You are a Marketing Chatbot, whose main aim is to answer marketing queries of the user.

  You may also be given the history of the prompts and responses, use this history as the context while answering the query.

  All your responses should be strictly specific to marketing domain.
  
  If anything not related to marketing is given in the query, you have to politely refuse to answer.
  """

  # All the input and output variables, with their descriptions.
  history = dspy.InputField(desc="The history of prompts and responses")
  query = dspy.InputField(desc="The query of the user.")
  answer = dspy.OutputField(desc="The answer to the user's query.")
```
The MarketingChatbot class inherits all the methods and objects of `dspy.Signature`, to be used as a signature.

Here the description of the class that is defined between `""" """`, includes the instructions for framing and optimizing the language model parameters, as per the use case. You can alter this description to see how the model responds.

Here we have declared three variables namely, `history`, `query`, and `answer`, as the user could counter\-question the response that is being generated by the chatbot, that’s why the model should have the context of the previous messages, and that purpose is being served by `history` variable. `query` variable accounts for any question or query that the user has, and similarly `answer` contains the response from the model.

All the input variables are made objects of `dspy.InputField()`, and all the output variables should be objects of `dspy.OutputField()`.


### CoT Class (with DSPy Chain Of Thought Module)

Now, that we have configured our base LM model to DSPy settings and have created the signature with the initial prompt or instructions, we can finally move towards the creation of the class that initializes the Chain Of Thought Module and handles all the input and output variables.

To define a CoT class,


```python
import dspy

## The CoT class
class CoT(dspy.Module):

  # The constructor
  def __init__(self):
    super().__init__()
    self.program = dspy.ChainOfThought(MarketingChatbot)
  
  # The method used for calling the model.
  def forward(self, history, query):
    return self.program(history=history, query=query)
```
Here the class `CoT` inherits the dspy.Module, which helps in accessing all the base methods defined in the class.

The constructor initializes the `dspy.ChainOfThought()` method with the signature that we have defined earlier. The passed signature ensures that all the input variables are being passed while calling the function, along with giving instruction for structuring the passed user query and optimizing the model parameters. It returns the response (`answer`) from the base LM.

The forward method defined in the class handles all the input variables as we have defined earlier, and returns the response of the program object of Chain Of Thought, which contains the response from the base LM model.


### Object of CoT

By now, we are done with all the work and just have to create an object of the `CoT` class and start querying it.

The creation of an object is done usually, with no fancy stuff.


```python
## Initializing the object of CoT class
marketingChatbot = CoT()
```

### Using the Chatbot

To use the chatbot we just have to call the `forward()` method of the `marketingChatbot` object, with the `query` of the user, and the `history` of chats and responses.

The chatbot can be used as,


```python
## To access the history of chats and responses
history = gemini.history.copy()

## User's query
query = "I am building a free marketing chatbot, devise a marketing plan for it."

## Response from the Chatbot
response = marketingChatbot.forward(history=history, query=query)

## Printing the answer to the query from the response generated
print(response.answer)
```
After running the code, the output generated is given below.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*qKIa12bZZLkGBM7b5UaJmg.png)

Here, in the response generated, we can note that it contains proper markdown editing for the title and bullet points. Also, apart from the well\-structured answer, we can see the quality of the response that is being generated. The answer is to the point, covering almost every aspect, and proving to be an expert marketing sidekick.


## Complete Code Base

The complete compiled code base of our marketing chatbot would be,








## Conclusion

Here’s a brief conclusion about everything discussed in this article.

* `DSPy` is a framework for programming foundation models, including Large Language Models and Retrieval Models, in a truly declarative and modular way. It comes with an automatic compiler that guides the LLM on conducting those declarative steps into the program, eventually allowing us to focus on the high\-level logic, while giving up the fine\-tuning of the language model to specialized optimizers.
* The article discussed configuring DSPy with the base model, creating the DSPy signature, and using it in the Chain Of Thought Module of DSPy.


## Author’s Note

Thank you for going through this article. If you have any questions or advice, please feel free to post them in the comments section. I truly admire feedback.


