---
title: "Building Projects With Chrome’s On-device AI"
meta_title: "Building Projects With Chrome’s On-device AI"
description: "This article provides a guide on prototyping with the Gemini-nano AI model integrated into Google Chrome. It explains the benefits of on-device AI, including offline inference, cost reduction, and enhanced privacy. The article details how to enable the experimental Prompt API, create inference sessions, and build a simple web application that utilizes the AI model to analyze words and generate usage sentences. It includes code snippets for setting up the AI, managing user interactions, and error handling, while emphasizing the importance of data validation in a production environment."
date: 2025-01-05T02:33:10Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*BB-r5FbszcK8J7Ht2lKmGA.png"
categories: ["Programming", "Technology/Web", "Machine Learning"]
author: "Rifx.Online"
tags: ["Gemini-nano", "Chrome", "Prompt-API", "Inference", "Privacy"]
draft: False

---


### A Guide to Prototyping with Gemini\-nano\-in\-Chrome





### Using the experimental prompt API on Chrome to build prototypes with AI features




## On\-device / Edge AI

On\-device AI refers to AI models that run directly on end\-user devices, such as smartphones, tablets, or IoT gadgets, without relying on cloud computing or a server to host these models.

This is useful in many ways:

1. Since the model is on the device, we can run offline inferences.
2. We can reduce the operational costs of running AI features by offloading certain inferences to the client devices.
3. Since the data never leaves the device, we can offer more privacy and data security with on\-device models.

However, since these models are run on memory\-constrained devices, they can’t perform general\-purpose inferences that a Large Language Model hosted in the cloud could do. Instead, **these are smaller models with specific capabilities**.

Chrome ships with one such model. Let’s take a look at it:


## Gemini Nano in Chrome

The latest version of Google Chrome ships with an on\-device AI model, which is the `Gemini-nano` . However, the APIs interacting with it are experimental and are behind a flag.

So if we intend to use the experimental API, we’ll first need to enable this feature flag through the following steps:

1. Update to the latest version of Chrome and then visit `chrome://flags` .
2. Search for `Prompt API for Gemini Nano`
3. Enable the flag
4. Restart the browser

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*CxRdDaj4QQZDksFe.png)


## Building Applications with Chrome’s On\-device AI

Once the feature is enabled, we can access the model from a global object as follows:


```python
window.ai
```

### The Prompt API

We can create a session with a system prompt as follows:


```python
const inferenceSession = await window.ai.languageModel.create({
  systemPrompt: `You are an English teacher. 
                 Analyse a given word and come up with a sentence 
                 to demonstrate the usage of the word.
                 Always respond in English.`
});
```
Once the inference session is created we can invoke the `prompt` method on it as follows:


```python
await inferenceSession.prompt('Precarious');
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*OxsC1LeVrMMmwzRJTYkL5w.png)


## A Sample Project

Let’s build our above idea into a simple web application. The system design for our project can be architected as shown below:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*SCW5Z3GddYZYL_YYQmU4YA.png)

Our final product will be as follows:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*kxDhEcW0kWUPooF2kfjyaQ.png)

To keep the focus of the article on AI integration let’s look only at how that part of the code is composed:


> *The link to the GitHub repository with the complete code is at the bottom of this article.*


### The AI Helper Methods

The module design we have for this utility can be depicted as shown in the image below:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*khWRZTig7jLLfv-c6VXUhg.png)

We can implement the above with the following code:


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
Notice the system prompt, where we instruct the model to return the response as HTML elements. This is to simplify our application logic. If we were to deploy this app, it would be a good idea to **sanitize and validate** the response before injecting it into the DOM. Since this is just a proof of concept, we can skip that part in this context.


### Setting Up the Inference Session on Content Load

The on\-load control flow is as follows:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*NQ0toXJ3pGmh-L7dhEqS3Q.png)

Which could be implemented with the following logic:


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

### Prompting for Word Usage and Definition

The inference control flow can be visualized as below:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*dQLC92tngJR4JID_7FBMDg.png)

We could implement this logic as follows:


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
Since it is only a proof of concept, we intentionally skipped input validations and checks, when a user enters a word and clicks on `Submit` .


## GitHub Repositories

The complete functional code for this demo can be accessed from [this GitHub repository](https://github.com/play-Arena/on-device-ai-with-js-demo):

If you are interested in exploring a bit more sophisticated application built using this on\-device AI model and Svelte, [this hobby project of mine](https://github.com/Parthipan-Natkunam/basic-social-text-formatter) might interest you:


