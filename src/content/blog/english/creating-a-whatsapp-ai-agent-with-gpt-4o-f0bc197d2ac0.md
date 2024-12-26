---
title: "Creating a WhatsApp AI Agent with GPT-4o"
meta_title: "Creating a WhatsApp AI Agent with GPT-4o"
description: "The article outlines the process of creating a WhatsApp AI agent using Metas Cloud API and FastAPI. It details the integration of AI agents into WhatsApp for real-time communication and task automation. The guide covers setting up the WhatsApp Cloud API, creating a FastAPI application to handle webhooks, and implementing message processing, including user authentication and audio transcription. It emphasizes the importance of developing a working prototype before adding more complex features, and it lays the groundwork for future enhancements, such as database interactions and more sophisticated workflows."
date: 2024-12-26T04:30:18Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*MtZ0n0nFFWmebZTncI2sqA.jpeg"
categories: ["Programming", "Technology", "Chatbots"]
author: "Rifx.Online"
tags: ["WhatsApp", "CloudAPI", "FastAPI", "webhook", "transcription"]
draft: False

---







### How to use the Meta API to build your own LLM\-powered Whatsapp chatbot

A game\-changer in the field of AI and business management is the integration of AI agents with widely used communication tools. Think of having a familiar chat interface with real\-time data requests, updates, and task automation, all made possible by direct WhatsApp interaction with your business’s management or personal assistant AI.

In this third part of our series on creating an AI\-powered business manager, I will walk you through the steps of connecting your AI agent to WhatsApp to increase its capabilities and reach. The goal to achieve is an AI Assistant capable of interacting with all your relevant database tables and even creating a table and all necessary tools on its own. As a primary showcase, I focus on a business use case like tracking expenses, invoices, and so on. However you can easily adapt the same logic to create, for example a Personal Assistant that keeps track of your tasks, projects, and ideas.

This is the third part of my series. Before we start, for everyone waiting, I apologize for the long delay. I’ve been busy in the last few months starting a new AI Software Engineering job and adapting to the new work\-life balance. I have prepared some future parts of this article so far, and we will explore major changes in the agent workflow, along with more sophisticated workflows featuring several additional features. Some workarounds used in the first two articles were necessary for reliable tool calling at that time but are no longer needed due to better\-performing models like GPT\-4o and GPT\-4o\-mini. I would still recommend starting with the first two parts if you are new to tool calling and agent workflow development. I find it useful to understand how to build something from scratch before relying on frameworks like LangChain or, more specifically, LangGraph for deeply customizable Agent Workflows (which I will introduce in the near future).

For now, we have to step back and focus on the infrastructure first. I think in most projects, especially in AI Software Projects, it is good practice to initially create a working end\-to\-end product before getting lost in feature creep. I often find myself overthinking initial design choices and developing a too\-complex product in my mind. To overcome this, focusing on building a working end\-to\-end product within a few days of development time really helps to establish a clear foundation. After that, you will know which features to prioritize and will be able to gather initial feedback. This kickstarts an incremental development process, which is always my goal when I commit to a project.


## Recap of Previous Parts

We established the foundation for our AI\-powered business manager in earlier installments of this series:

* [**Part 1**](https://towardsdatascience.com/leverage-openai-tool-calling-building-a-reliable-ai-agent-from-scratch-4e21fcd15b62): The goal was to develop a prototype agent workflow that could interact with tool objects and reduce hallucinations in tool arguments produced by the underlying language model (LLM).
* [**Part 2**](https://towardsdatascience.com/building-an-ai-powered-business-manager-e2a31a2fe984): We concentrated on defining basic features, organizing the project repository, and building a database schema with SQLModel. We also added SQL tools for data addition and querying and updated the Tool class to accommodate SQLModel objects. Furthermore, we presented a TaskAgent class for automating agent startup and set up an OpenAIAgent for context\-aware tool usage.


## Scope for This Article

As usual, let us begin by defining the scope of this article:

1. **Integrate the AI Agent with WhatsApp Using MetaAPI**Set up and configure MetaAPI for WhatsApp Business integration.
Ensure the AI agent can send and receive messages through WhatsApp.
2. **Set Up Webhooks and Run Locally Using Ngrok**Create a FastAPI application to handle webhook events from WhatsApp.
Use ngrok to expose the local FastAPI server to the internet.
Configure MetaAPI to send webhook events to the ngrok URL

Since we are moving forward to a deployable server, we also need to adjust our project architecture. We are essentially implementing a FastAPI server, and therefore, my preferred choice of repository structure is Domain\-Driven Design (DDD) or rather leaning towards DDD. (You can check the Repo structure [here](https://github.com/elokus/WhatsappAgent))


## 1\. Set up WhatsApp Cloud API

First of all, you need to get familiar with the Cloud API provided by Meta. You can achieve the same results using SaaS products like Twilio, which offer a more user\-friendly integration. However, due to the recent data breach and for cost\-efficiency reasons, I prefer using the root API provided by Meta.


## 1\.1 Prerequisites

1. Before you begin, you will need to register a Meta developer account by following these steps: [How to open a Meta developer account](https://developers.facebook.com/docs/development/register). During this registration process, you will need to verify yourself using a phone number. Note that this will not be the phone number of your final WhatsApp client. Instead, you will get a test phone number assigned by the platform, which can later be changed to another phone number.
2. After registration, go to your dashboard and create an app.
3. Moreover, you will need a Meta Business Account (MBA) that will be associated with your real account, or you can create a new one to link to your MBA. You can also skip this, as you will be automatically prompted to link or create an MBA in the next step.


## 1\.2 Add WhatsApp Product to Your App

After you have created an app inside your Meta developer account, you will be asked to add products to it. Here you have to choose WhatsApp and follow the setup process. If you haven’t done so, create a Meta Business Account here. Once you are done, you will have a test WhatsApp Business Account and a test phone number.


## 1\.3 Add a Recipient Number

1. In the left\-hand menu of the App Dashboard, navigate to 
**WhatsApp** \> **API Setup**
There under **Send and receive messages**, select the **To** field and choose **Manage phone number list**. Here, you can add a phone number that is allowed to send and receive messages from your test phone number. This should ideally be your own phone number as you want to test your application. Before you link this WhatsApp API Account to a real number, you will only be able to add up to 5 recipient numbers.
2. In `WhatsApp > API Setup`, you can now send a test message by filling in the `from` field with your test phone number and the `to` field with your recipient number (your own phone number).
3. Generate an access token. This is your `WHATSAPP_API_TOKEN`, which we will need later in step 6\.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Yy6n2NdwO6CrSL2njWj-7g.png)

We have successfully set up the Cloud API as required. In the next step we will create a Webhook that will enable communication with our AI Assistant application.

To achieve this, we need to create and serve an endpoint in our backend application. This means our Python backend must be accessible through a URL. This URL will act as the Webhook endpoint that the AI Assistant can call to send and receive data.


## 2\. Creating a FastAPI Endpoint

To be accepted by the Webhook, our root endpoint must verify a specific GET request that will be sent by the webhook when adding our URL. The webhook will send three query parameters:

`hub.mode`, `hub.challenge`, `hub.verify.token`.

The verification token is defined when creating the webhook in Cloud API. Your backend should verify that this token matches what you have defined and return the `hub.challenge` object as a response. Make sure to install FastAPI and Uvicorn using `pip install fastapi uvicorn` first.


## 2\.1 Create main.py

Create a file named `main.py` with the following content:


```python
from fastapi import FastAPI, Query, HTTPException


VERIFICATION_TOKEN = "abcdefg12345"

app = FastAPI()


@app.get("/")
def verify_whatsapp(
    hub_mode: str = Query("subscribe", description="The mode of the webhook", alias="hub.mode"),
    hub_challenge: int = Query(..., description="The challenge to verify the webhook", alias="hub.challenge"),
    hub_verify_token: str = Query(..., description="The verification token", alias="hub.verify_token"),
):
    if hub_mode == "subscribe" and hub_verify_token == VERIFICATION_TOKEN:
        return hub_challenge
    raise HTTPException(status_code=403, detail="Invalid verification token")


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.get("/readiness")
def readiness():
    return {"status": "ready"}
```
In the third line, you can define a `VERIFICATION_TOKEN` that is used later by the webhook to verify that the backend is under your control. In this case, we have defined it as `"abcdefg12345"`, but you can define a custom token of your own.

I’ll continue correcting the remaining sections and include the next part shortly!


## 2\.2 Run the Application

Run the application using Uvicorn:


```python
uvicorn main:app --reload
```

## 2\.3 Serve Your API Locally

Your backend now runs locally on `http://localhost:8000` and/or [`http://127.0.0.1:8`000\.](http://127.0.0.1:8000.)

We are now serving the following endpoints:

* Verify WhatsApp webhook: [`http://127.0.0.1:8000/?hub.mode=subscribe&hub.challenge=1234&hub.verify_token=abcdefg12`345](http://127.0.0.1:8000/?hub.mode=subscribe&hub.challenge=1234&hub.verify_token=abcdefg12345)
* Health endpoint: [`http://127.0.0.1:8000/hea`lth](http://127.0.0.1:8000/health)
* Readiness endpoint: [`http://127.0.0.1:8000/readin`ess](http://127.0.0.1:8000/readiness)

You can use the health endpoint to check if your application is running. Open `http://127.0.0.1:8000/health` in your browser, and you should see: `{"status": "healthy"}`


## 3\. Run a Proxy Server with Ngrok

Since our server is running locally, the WhatsApp Webhook cannot call the endpoint for verification. What we need is a public URL that can be used by the webhook. There are two options: deploy the application to a cloud server or create a proxy server tunnel. Since we are still in the development process, we will use the second option.

1. Go to [ngrok Signup](https://dashboard.ngrok.com/signup) and create a free account.
2. Install ngrok locally. Depending on your system, you can use Brew, Chocolatey, or simply download and install it. See: [Setup \& Installation](https://dashboard.ngrok.com/get-started/setup).
3. After installation, add your authentication code using the following command in your terminal. Replace `$YOUR-AUTHENTICATION_TOKEN` with your ngrok authentication token, which can be found under "Your Authtoken" in the ngrok dashboard.
4. Begin forwarding traffic from your localhost on port 8000 by running the following command in your terminal:


```python
> ngrok config add-authtoken $YOUR-AUTHENTICATION_TOKEN
> ngrok http http://localhost:8000

Forwarding                    https://<random-string>.ngrok.io -> http://localhost:8000
```
Your local server is now accessible via public URLs provided by ngrok. You should see something like this:


```python
Forwarding                    https://<random-string>.ngrok.io -> http://localhost:8000
```
Use the HTTPS URL provided by ngrok for the webhook configuration.


## 4\. Implementing the Webhook

Now let us return to Meta’s Cloud API to implement the desired webhook.

1. Navigate to [Meta for Developers](https://developers.facebook.com/apps/) and select the app created before.
2. In the left\-hand menu go to **WhatsApp** \> **Configuration**.
3. In the **Webhook** section paste your ngrok HTTPS forwarding URL into the **Callback URL** field and enter the `VERIFICATION_TOKEN` defined in `main.py` into the **Verification Token** field.
4. Click the confirm and save button and wait for the webhook to verify your backend.
5. In the section **Webhook Fields** enable the `messages` toggle under **Subscribed Fields**.

That’s it! You should now be able to receive WhatsApp messages in your Python backend server.


## 4\.1 Understanding Webhooks and Conversations

Webhooks are HTTP callbacks that enable programs to receive real\-time updates when certain events occur such as a new message or a status change. Webhooks make system integrations and automation possible by delivering an HTTP request containing event data to a pre\-configured URL (in our case the ngrok proxy server url).

To understand the logic and pricing behind webhooks in the Meta cosmos it is helpful to understand some basic principles about conversations.

A ‘conversation’ on WhatsApp API starts when:**1\. The User sends a message**: This opens a 24\-hour window, during which you can reply with messages including text, images, or other media **without additional costs**.

**2\. The Business Initiates Contact**: If no user message has been received recently (no open 24\-hour window), your AI assistant must use a **pre\-approved template message** to start the conversation. You can add custom templates but they need to be approved by Meta.

As long as the user keeps replying, the 24\-hour window resets with each new message. This makes it possible to have continuous interaction without additional costs. A Conversation costs about 0\.00–0\.08 USD. The concrete pricing is based on you conversation type Marketing, Utility, Service and your location. FYI: Service Conversations seem to be nowadays for free. You can find the concrete pricing here: [Whatsapp Pricing](https://developers.facebook.com/docs/whatsapp/pricing)


## 5\. Build a Receive Message Endpoint

Now we are able to receive messages in our backend. Since we have subscribed to message objects, each time a message is sent to your test number, the webhook will create a POST request to the callback URL that you defined in the previous step. What we need to do next is to build an endpoint for POST requests in our FastAPI application.

Let us first define the requirements:

* **Return a 200 HTTP Status Code:** This is essential to inform CloudAPI that the message has been received successfully. Failing to do so will cause CloudAPI to retry sending the message for up to 7 days.
* **Extract Phone Number and Message:** The payload of the incoming request contains data that includes the phone number and the message. Which we need to process in the backend.
* **Filter Incoming Objects:** Since CloudAPI might send multiple events for the same message (such as sent, received, and read), the backend needs to ensures that only one instance of the message is processed.
* **Handle Multiple Message Types:** The backend can handle different types of messages, such as text, voice messages, and images. In order to not spread the scope of the artice we will only lay the foundation for images but not implement it to the end.
* **Process with LLM\-Agent Workflow:** The extracted information is processed using the LLM\-Agent workflow, which we have developed with previous parts of this series. You can also use another agentic implementation, e.g. Langchain or Langgraph


## 5\.1 Define Models and Schemas

We will receive a payload from a webhook. You can find example payloads in Meta’s documentation: [Example Payload](https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples/)

I prefer to write my code with Pydantic to add type safety to my Python code. Moreover, type annotations and Pydantic are an optimal match for FastAPI applications. So, let’s first define the models used in our endpoint:


```python
## app/schema.py
from typing import List, Optional  
from pydantic import BaseModel, Field   


class Profile(BaseModel):  
    name: str  

class Contact(BaseModel):  
    profile: Profile  
    wa_id: str  

class Text(BaseModel):  
    body: str

class Image(BaseModel):  
    mime_type: str  
    sha256: str  
    id: str  

class Audio(BaseModel):  
    mime_type: str  
    sha256: str  
    id: str  
    voice: bool  

class Message(BaseModel):  
    from_: str = Field(..., alias="from")  
    id: str  
    timestamp: str  
    text: Text | None = None  
    image: Image | None = None  
    audio: Audio | None = None  
    type: str

class Metadata(BaseModel):  
    display_phone_number: str  
    phone_number_id: str

class Value(BaseModel):  
    messaging_product: str  
    metadata: Metadata  
    contacts: List[Contact] | None = None  
    messages: List[Message] | None = None  

class Change(BaseModel):  
    value: Value  
    field: str  
    statuses: List[dict] | None = None  

class Entry(BaseModel):  
    id: str  
    changes: List[Change]  

class Payload(BaseModel):  
    object: str  
    entry: List[Entry]

class User(BaseModel):  
    id: int  
    first_name: str  
    last_name: str  
    phone: str
    role: str

class UserMessage(BaseModel):  
    user: User  
    message: str | None = None  
    image: Image | None = None  
    audio: Audio | None = None
```

## 5\.2 Parse Incoming Messages

Next, we are going to create some helper functions for using dependency injection in FastAPI:


```python
## app/main.py

from app.domain import message_service

def parse_message(payload: Payload) -> Message | None:  
    if not payload.entry[0].changes[0].value.messages:  
        return None  
    return payload.entry[0].changes[0].value.messages[0]  

def get_current_user(message: Annotated[Message, Depends(parse_message)]) -> User | None:  
    if not message:  
        return None  
    return message_service.authenticate_user_by_phone_number(message.from_)  

def parse_audio_file(message: Annotated[Message, Depends(parse_message)]) -> Audio | None:  
    if message and message.type == "audio":  
        return message.audio  
    return None  

def parse_image_file(message: Annotated[Message, Depends(parse_message)]) -> Image | None:  
    if message and message.type == "image":  
        return message.image  
    return None  

def message_extractor(  
        message: Annotated[Message, Depends(parse_message)],  
        audio: Annotated[Audio, Depends(parse_audio_file)],  
):  
    if audio:  
        return message_service.transcribe_audio(audio)  
    if message and message.text:  
        return message.text.body  
    return None
```
* **Parsing the Payload:** The `parse_message` function extracts the first message from the incoming payload if it exists. This function returns `None` if no messages are found, so that only valid messages are processed.
* **User Authentication:** The `get_current_user` function uses the `parse_message` dependency injection to extract the message and then authenticates the user based on the phone number associated with the message. Here we ensure that only authenticated users are allowed to send messages.
* **Audio and Image Parsing:** These functions extract audio or image files from the message if the message type is “audio” or “image,” respectively. This allows the application to handle different types of media.
* **Message Extraction:** The `message_extractor` function attempts to extract text from the message or transcribe audio into text. This ensures that regardless of the message type, the content can be processed.

Here we have one import from our domain layer. The whole script `message_service` is where we place all domain\-specific code for this implementation, such as `authenticate_user_by_phone_number` and `transcribe_audio`.


## 5\.3 Implementing the POST Endpoint


```python
## app/main.py
import threading  
from typing_extensions import Annotated  
from fastapi import APIRouter, Query, HTTPException, Depends  
from app.domain import message_service  
from app.schema import Payload, Message, Audio, Image, User  

## ... rest of the code ...

@app.post("/", status_code=200)  
def receive_whatsapp(  
        user: Annotated[User, Depends(get_current_user)],  
        user_message: Annotated[str, Depends(message_extractor)],  
        image: Annotated[Image, Depends(parse_image_file)],  
):  
    if not user and not user_message and not image:  
        return {"status": "ok"}  
    if not user:  
        raise HTTPException(status_code=401, detail="Unauthorized")  
    if image:  
        return print("Image received")  
    if user_message:  
        thread = threading.Thread(
            target=message_service.respond_and_send_message, 
            args=(user_message, user)
        )  
        thread.daemon = True  
        thread.start()  
    return {"status": "ok"}
```
* **POST Endpoint Implementation:** This endpoint handles the incoming POST request. It checks if the user, message, or image is valid. If none are valid, it simply returns a status message to CloudAPI. If the user is not authenticated, it raises an `HTTPException` with a 401 status code.
* **Processing Images and Messages:** If an image is received, we make a simple stdout print as a placeholder for future image handling. If a text message is received, it is processed asynchronously using a separate thread to avoid blocking the main application thread. The `message_service.respond_and_send_message` function is invoked to handle the message according to the LLM\-Agent workflow.

**Explanation for Using Thread Pooling for the Webhook:** WhatsApp will resend the webhook until it gets a 200 response, so thread pooling is used to ensure that message handling doesn’t block the webhook response.


## 6 Message Services

In our presentation layer where we previously defined our endpoint, we use some `message_service` functions that need to be defined next. Specifically, we need an implementation for processing and transcribing audio payloads, authenticating users, and finally invoking our agent and sending a response back. We will place all this functionality inside `domain/message_service.py`. In production settings, as your application grows, I would recommend splitting them further down into, e.g., `transcription_service.py`, `message_service.py`, and `authentication_service.py`.

In multiple functions in this section, we will make requests to the Meta API `"https://graph.facebook.com/..."`. In all of these requests, we need to include authorization headers with `WHATSAPP_API_KEY`, which we created in **step 1\.3**, as the bearer token. I usually store API keys and tokens in an `.env` file and access them with the Python `dotenv` library. We also use the OpenAI client with your `OPENAI_API_KEY`, which could also be stored in the `.env` file.

But for simplicity, let’s just place and initialize them at the top of `message_service.py` scripts as follows:


```python
import os  
import json  
import requests  
from typing import BinaryIO

WHATSAPP_API_KEY = "YOUR_ACCESS_TOKEN"
llm = OpenAI(api_key="YOUR_OPENAI_API_KEY")
```
Replace “YOUR\_ACCESS\_TOKEN” with your actual access token that you created in step 1\.3\.


## 6\.1 Processing and Transcribing Audio Files

Handling voice records from a WhatsApp webhook is not as straightforward as it may seem. First of all, it is important to know that the incoming webhook only tells us the data type and an object ID. So it does not contain the binary audio file. We first have to download the audio file using Meta’s Graph API. To download our received audio, we need to make two sequential requests. The first one is a GET request with the `object_id` to obtain the download URL. This download URL is the target of our second GET request.


```python
def download_file_from_facebook(file_id: str, file_type: str, mime_type: str) -> str | None:  
    # First GET request to retrieve the download URL  
    url = f"https://graph.facebook.com/v19.0/{file_id}"  
    headers = {"Authorization": f"Bearer {WHATSAPP_API_KEY}"}  
    response = requests.get(url, headers=headers)
    if response.status_code == 200:  
            download_url = response.json().get('url')  
            # Second GET request to download the file  
            response = requests.get(download_url, headers=headers)  
            if response.status_code == 200:
                # Extract file extension from mime_type    
                file_extension = mime_type.split('/')[-1].split(';')[0]
                # Create file_path with extension
                file_path = f"{file_id}.{file_extension}"  
                with open(file_path, 'wb') as file:  
                    file.write(response.content)  
                if file_type == "image" or file_type == "audio":  
                    return file_path  
            raise ValueError(f"Failed to download file. Status code: {response.status_code}")  
        raise ValueError(f"Failed to retrieve download URL. Status code: {response.status_code}")
```
Here, we basically get the download URL and download the file to the file system using the object ID and the file extension as its `file_path`. If something fails, we raise a `ValueError` that indicates where the error occurred.

Next, we simply define a function that takes the audio binary and transcribes it using Whisper:


```python
def transcribe_audio_file(audio_file: BinaryIO) -> str:  
    if not audio_file:  
        return "No audio file provided"  
    try:  
        transcription = llm.audio.transcriptions.create(  
            file=audio_file,  
            model="whisper-1",  
            response_format="text"  
        )  
        return transcription  
    except Exception as e:  
        raise ValueError("Error transcribing audio") from e
```
And finally, let’s bring the download and transcription functions together:


```python
def transcribe_audio(audio: Audio) -> str:  
    file_path = download_file_from_facebook(audio.id, "audio", audio.mime_type)  
    with open(file_path, 'rb') as audio_binary:  
        transcription = transcribe_audio_file(audio_binary)  
    try:  
        os.remove(file_path)  
    except Exception as e:  
        print(f"Failed to delete file: {e}")  
    return transcription
```

## 6\.2 Authenticate Users

While using the test number provided by Meta, we have to predefine which numbers our chatbot can send messages to. I am not quite sure and have not tested if any number can send a message to our chatbot. But anyway, as soon as we switch to a custom number, we don’t want anyone to be able to execute our agent chatbot. So we need a method to authenticate the user. We have several options to do this. First of all, we have to think of where to store user information. We could use, for example, a database like PostgreSQL or a non\-relational database like Firestore. We can predefine our users in the file system in a JSON file or in an `.env` file. For this tutorial, I will go with the simplest way and hardcode the user within a list in our authentication function.

A list entry has the structure of the `User` model as defined in **step 5\.1**. So a user consists of an ID, first name, last name, and phone number. We have not implemented a role system in our agent workflow yet. But in most use cases with different users, such as in the example case of a small business assistant, different users will have different rights and access scopes. For now, we just pass `"default"` as a placeholder role.


```python
def authenticate_user_by_phone_number(phone_number: str) -> User | None:  
    allowed_users = [  
        {"id": 1, "phone": "+1234567890", "first_name": "John", "last_name": "Doe", "role": "default"},  
        {"id": 2, "phone": "+0987654321", "first_name": "Jane", "last_name": "Smith", "role": "default"}  
    ]    
    for user in allowed_users:  
        if user["phone"] == phone_number:  
            return User(**user)  
    return None
```
So just verify if the phone number is in our list of `allowed_users` and return the user if it is. Otherwise, we return `None`. If you look at our endpoint in **step 5\.3**, you will see we raise an error if the user is `None` to prevent further processing of unauthorized user messages.


## 6\.3 Send Message

Now, our last helper function before we can actually invoke our agent is `send_whatsapp_message`. I have included two modes into this function because of some Meta\-specific WhatsApp API logic.

Basically, you are not allowed to send a custom message to a user as a conversation starter. This means you can respond with an individual text message if the user starts the conversation and writes a message to the chatbot first. Otherwise, if you want the chatbot to initiate a conversation, you are limited to approved templates, like the “Hello World” template.

Also important to mention, when we talk about Meta logic, a conversation after being started opens a conversation window of 24 hours in which you can send messages to that user. This conversation window is also what gets charged, not the individual message. It gets a bit more complex based on the type of conversation, such as marketing, support, etc.

You can also define a template on your own and let it be approved by Meta. I have not done that at this point, so to test if we can send a message from our backend to a user, I use the “Hello World” template. If you add some custom approved templates, you can also use this function to send them to the user.

So back to the code. To send a message, we make a POST request and define a payload that either includes the text body or the template:


```python
def send_whatsapp_message(to, message, template=True):  
    url = f"https://graph.facebook.com/v18.0/289534840903017/messages"  
    headers = {  
        "Authorization": f"Bearer " + WHATSAPP_API_KEY,  
        "Content-Type": "application/json"  
    }  
    if not template:  
        data = {  
            "messaging_product": "whatsapp",  
            "preview_url": False,  
            "recipient_type": "individual",  
            "to": to,  
            "type": "text",  
            "text": {  
                "body": message  
            }  
        }  
    else:  
        data = {  
            "messaging_product": "whatsapp",  
            "to": to,  
            "type": "template",  
            "template": {  
                "name": "hello_world",  
                "language": {  
                    "code": "en_US"  
                }  
            }  
        }  

    response = requests.post(url, headers=headers, data=json.dumps(data))  
    return response.json()
```

## 6\.4 Invoke Our Agent

Finally, we can integrate our agent from our previous examples. At this stage, you can also integrate your custom agent, a Langchain `AgentExecutor`, Langgraph `AgentWorkflow`, etc.

So our main function that will be called on each incoming message is `respond_and_send_message`, which takes the `user_message` string and passes it to our agent workflow as the input object.


```python
## app/domain/message_service.py
import json  
import requests
from app.domain.agents.routing_agent import RoutingAgent  
from app.schema import User  

def respond_and_send_message(user_message: str, user: User):  
    agent = RoutingAgent()  
    response = agent.run(user_message, user.id)  
    send_whatsapp_message(user.phone, response, template=False)
```
After invoking our agent, we get a response message that we want to send back to the user using the send\_whatsapp\_message function.

Now you should be able to send messages to the test number and get answer by the agent executor. **Remark**: While using the Whatsapp test number you have to register phone numbers that are allowed to send messages to your bot in you Meta API app.

By following this guide, you’ve taken a big step toward creating a strong LLM\-powered chatbot that works seamlessly with WhatsApp. This isn’t just about setting up automated business communication in real\-time; it’s about laying the groundwork for more advanced AI\-driven workflows down the road.


## What have we done:

* **WhatsApp Cloud API Integration:**
We got Meta’s Cloud API for WhatsApp up and running, including building a webhook for live message handling.
* **Backend Development with FastAPI:**
Set up endpoints to verify webhooks, process incoming messages, and handle responses asynchronously.
* **Multimedia \& Authentication Support:**
Enabled stuff like audio transcription, and user authentication for more personalized interactions. Image handling is not implemented to the fullest but we have added the possibility for it.


## Whats Next:

In the next part(s), which I promise to publish sooner 🙏 I will move the implementation to LangGraph. I will add some more capabilities to the agent like creating database tables \+ tools on its one. Which will make the Agent more flexible. I am also open for Feedback and ideas what to Features to add!


## Wrapping It Up:

Combining the reach and usability of WhatsApp with LLMs is a big win for businesses and personal use cases. Whether you’re aiming for a personal assistant or a full\-blown business tool, this guide gives you the path to get there. Keep tinkering, improving, and pushing boundaries — this is just the start of what you can build.

Happy coding! 🚀

You can find the full code here: [Github Repo](https://github.com/elokus/WhatsappAgent)

Full Link: <https://github.com/elokus/WhatsappAgent>


