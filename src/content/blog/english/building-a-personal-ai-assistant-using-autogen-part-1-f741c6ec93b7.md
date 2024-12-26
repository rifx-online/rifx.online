---
title: "Building a Personal AI Assistant using AutoGen — Part 1"
meta_title: "Building a Personal AI Assistant using AutoGen — Part 1"
description: "This article discusses the development of Aura, a personal AI assistant built using AutoGen v0.4, designed to manage emails and calendars effectively. The assistant integrates Gmail and Google Calendar to help users with tasks like drafting emails, organizing inboxes, and scheduling events. The frameworks dual-layer architecture allows for both quick setup and deep customization. Future enhancements will focus on expanding capabilities, improving robustness, and adding memory for personalization. The source code is available on GitHub for collaboration and further development."
date: 2024-12-26T04:30:18Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*1g_i3Vctbl9mmisplJmOEA.png"
categories: ["Programming", "Chatbots", "Technology/Web"]
author: "Rifx.Online"
tags: ["Aura", "AutoGen", "Gmail", "Calendar", "personalization"]
draft: False

---





### Exploring AutoGen v0\.4: Building an AI Assistant with Gmail and Google Calendar Integrations




## TL; DR

In this post, I built the foundations of Aura, a personal AI assistant designed to manage emails and calendars using AutoGen. Here’s a quick rundown of what I covered:

* **Motivation**: Aura addresses productivity challenges like inbox overload, scheduling, and staying up\-to\-date with technology trends.
* **Framework Choice**: AutoGen was chosen for its flexibility, offering both quick setup with AgentChat and deep customization through its Core Layer.
* **Tool Integration**: Aura’s initial setup includes Gmail and Google Calendar tools to draft emails, summarize inboxes, and create calendar events.
* **Interacting with Aura**: You can chat with Aura in real time, asking it to perform tasks or retrieve information.
* **Next Steps**: Future work will focus on extending tools, adding new features, adding memory, introducing workflows, and improving robustness.

The entire source code is available on my [GitHub repository](https://github.com/richard-gyiko/aura). Feel free to fork it, suggest new features, contribute, or even build your own version of Aura.

With that said, let’s get started …


## Motivation

Imagine having an AI capable of understanding your work habits, it helps with your research, reviews your articles, clears your inbox, schedules meetings, and even unsubscribes from those annoying newsletters — all while you sip your coffee. That’s what I’m building with Aura.

Why? Because my daily workflows can feel like a mess. Here are a few things I want Aura to fix for me:

1. **Keeping Up with Technology Trends**
The tech world moves fast. A library I relied on last year might already have something better replacing it. Comparing options by reading docs, checking pricing and benchmarks, and scrolling through GitHub issues eats up hours. I want an AI to handle that grind, filtering out what’s irrelevant and navigating me to the right choice.
2. **Managing the Email Chaos**
I’ve got multiple email accounts, and keeping up with them is challenging. Aura will help by unsubscribing me from spammy newsletters, automatically organizing emails into proper labels, pulling out actionable tasks to add to my Notion workspace, drafting replies I can review and send, and even creating calendar events from booking confirmation emails.
3. **Remembering Context**
Explaining my preferences and workflows in each conversation or task is frustrating. Aura should act like an extension of my memory, learning as it goes and doing things without me needing to babysit it.


## Framework Choice: AutoGen

To bring Aura to life, I’m using the new AutoGen v0\.4 framework. It’s been [rebuilt from the ground up](https://microsoft.github.io/autogen/0.2/blog/2024/10/02/new-autogen-architecture-preview), and its flexibility makes it a great fit for my use case. Although v0\.4 is in preview, I believe that the new architectural concepts are giving a strong foundation to easy and complex tasks.

One of the standout features of AutoGen to me is its dual\-layer architecture:

* **Core Layer**: A robust foundation for creating asynchronous, event\-driven multi\-agent systems.
* **AgentChat Layer**: A high\-level API with preset agents and teams that lets you get started quickly without dealing with lower\-level details.

This approach fits perfectly with my goals. I can jumpstart development using AgentChat’s abstractions, but if I need something more specialized, I can fall back to the Core Layer and implement my solutions. It’s the best of both worlds — speed to start and flexibility for the future.


## Architecting Aura: Tools as the Building Blocks of Intelligence

Tools are the building blocks of an AI agent’s functionality. They bridge the gap between the language model and the external world, enabling actions like fetching data or sending commands.


### How Tools Work

Here’s an example:

If you ask Aura, *“What meetings do I have tomorrow?”*, the system does the following at a high level:

1. Based on the prompt and the available tools, the LLM identifies the appropriate tool(s) for the task (e.g., `get_current_time` `fetch_calendar_events` tool) and defines its invocation parameters.
2. The application executes the tools and sends the results of the tool execution to the LLM.
3. The LLM uses the results to craft a meaningful response.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*5hz6Zz0jgjIvuMlSThBwVQ.png)


### Tooling of Aura: Gmail and Google Calendar

Aura is only as helpful as the tools it can use. To make it handle my emails and calendar like a pro, I needed to integrate it with the right resources. After some digging, I found two major pieces to get started: the Gmail Toolkit and a custom Google Calendar integration.


### Gmail Toolkit

The [Gmail Toolkit](https://python.langchain.com/docs/integrations/tools/gmail/) (coming from the LangChain community) provides five essential tools to enable Aura’s email management features:

1. **GmailCreateDraft**: For drafting emails.
2. **GmailSendMessage**: For sending emails.
3. **GmailSearch**: For finding specific emails.
4. **GmailGetMessage**: For retrieving the details of a specific email.
5. **GmailGetThread**: For fetching all messages in a thread.

These tools give Aura everything it needs to draft, send, and organize emails. To integrate them, I used the following function:


```python
def get_gmail_tools(scopes: list[str]):
    gmailToolkit = GmailToolkit(
       api_resource=build_gmail_resource_service(scopes=scopes)
    )

    tools = gmailToolkit.get_tools()

    # Map all tools to AutoGen consumable tool
    autogen_tools = [LangChainToolAdapter(tool) for tool in tools]

    return autogen_tools
```
Here’s how it works: the `GmailToolkit` provides the necessary tools, and I use `LangChainToolAdapter` to wrap these tools so they can be directly used in AutoGen. This adapter essentially acts as a bridge, making LangChain tools compatible with AutoGen’s framework.


### Google Calendar Toolkit

Now, this one required a bit more legwork. At the time of writing, there wasn’t a ready\-made Google Calendar Toolkit on LangChain. After a bit of research, I found a prototype implementation and customized it for Aura.

With the custom Google Calendar Toolkit, Aura can:

* **List Events**: Retrieve calendar events within a specific date range.
* **Create Events**: Add new appointments to my calendar, so I don’t miss that important meeting — or lunch.

The integration code is pretty similar to Gmail’s:


```python
def get_google_calendar_tools(scopes: list[str]):
    google_calendar_toolkit = GoogleCalendarToolkit(
        api_resource=build_google_calendar_resource_service(scopes=scopes)
    )

    tools = google_calendar_toolkit.get_tools()
    
    # Map all tools to AutoGen consumable tool
    autogen_tools = [LangChainToolAdapter(tool) for tool in tools]

    return autogen_tools
```

> Both toolkits require credentials to authenticate against the Google APIs to act on your behalf. Read the toolkit’s official [docs](https://python.langchain.com/docs/integrations/tools/gmail/) for more information.


## Bringing Aura to Life: Configuring the AI Assistant

Now that I’ve got the tools ready, it’s time to bring Aura to life by creating the assistant agent. Using AutoGen, I can define Aura with all its tools, specify its behavior, and set it up to handle tasks seamlessly.

Here’s how Aura is set up:


```python
def aura() -> AssistantAgent:
    # Step 1: Gather all the tools Aura will use
    tools = (
        get_gmail_tools(SCOPES)             # Gmail tools for email management
        + get_google_calendar_tools(SCOPES) # Google Calendar tools for scheduling
        + get_utility_tools()               # Additional utility like get_current_time
    )

    # Step 2: Create the assistant agent using AutoGen's AssistantAgent class
    assistant = AssistantAgent(
        name="aura",  # Name the assistant
        
        # Define the LLM client and its parameters
        model_client=OpenAIChatCompletionClient(
            model="gpt-4o-mini",  # A lightweight, efficient GPT model
            temperature=0.01,    # Low temperature for precise, deterministic outputs
        ),
        
        # Provide the tools Aura will use to perform its tasks
        tools=tools,
        
        # Set the system prompt to define Aura's role and behavior
        system_message=SYSTEM_PROMPT_TEMPLATE.format(timezone=str(_get_timezone())),
    )

    return assistant
```
Here’s what’s happening in the code:

1. **Tools Setup**: I combine Gmail, Google Calendar, and utility tools into a single list, giving Aura its functionality.
2. **Assistant Agent**: The `AssistantAgent` class initializes Aura with its name, tools, and behavior. The `OpenAIChatCompletionClient` specifies the language model and its configuration.
3. **System Prompt**: The `SYSTEM_PROMPT_TEMPLATE` defines Aura’s personality, responsibilities, and guidelines. For instance:


```python
SYSTEM_PROMPT_TEMPLATE = """
Your name is Aura. You are a versatile and efficient AI assistant specialized in managing the user's email and calendar.
Your primary responsibilities include:
- **Email Management**: Retrieve, organize, and manage email messages. Always include a unique identifier for each message to ensure easy reference.
- **Calendar Management**: Schedule, update, and retrieve calendar events while resolving conflicts or overlaps.
Guidelines:
- Adhere to the specified timezone for all date and time-related tasks: {timezone}.
- Provide clear, concise, and user-friendly responses, prioritizing accuracy and convenience.
- Proactively notify the user of important updates, conflicts, or pending actions in their email or calendar.
"""
```
The combination of tools, a lightweight GPT model, and a tailored system prompt ensures that Aura is ready to handle tasks efficiently.


## Interactive AI: Designing Real\-Time Conversation Loops

Now that Aura is set up, the next step is to interact with it. To make this happen, I need a loop where Aura can respond to user inputs in real\-time. This allows us to test its capabilities and see it in action.

Here’s how I implemented a simple multi\-turn conversation loop:


```python
async def main():
    # Instantiate Aura
    agent = aura()

    while True:
        try:
            # Take user input from the terminal
            user_input = input("> ")

            # Exit gracefully if the user types 'exit'
            if user_input.lower() == "exit":
                break

            # Send the input to Aura and display its response as messages become available
            await RichConsole(
                stream=agent.on_messages_stream(
                    [TextMessage(content=user_input, source="user")],
                    cancellation_token=CancellationToken(),
                ),
                show_intermediate=True,
            )
        except KeyboardInterrupt:
            # Handle Ctrl+C gracefully
            print("\nGoodbye! 👋")
            break
```

### How It Works:

1. **Initialization**: The `aura()` function is called to instantiate the assistant with all its tools and configurations.
2. **User Input Loop**: The program enters an infinite loop, waiting for user input via the terminal.
3. **Processing Input**: Each input is passed to Aura, which uses its tools and language model to generate a response.
4. **Output**: The `RichConsole` displays Aura’s response in real\-time. This includes intermediate messages, making it easier to track how Aura processes tasks. I’m using `rich` python library to render the messages as they are available.
5. **Exiting Gracefully**: The loop ends if the user types “exit” or presses `Ctrl+C`.

This simple setup allows you to interact with Aura in a conversational, multi\-turn dialogue. For example:

* **User:** “What meetings do I have tomorrow?”
* **Aura:** “You have 3 meetings scheduled for tomorrow. Here’s the list: …”


## Proof of Concept: Aura in Action

Here’s a glimpse of Aura in action, handling simple real\-world tasks. Let’s walk through some examples to see how it handles the job.


### Example 1: Creating a Calendar Event

Asking Aura to:


> *Create an entry in my Tasks calendar for tomorrow at 5 PM to do the groceries.*

To handle this, Aura first needs to figure out the exact date for “tomorrow.” In the video below, you’ll see how Aura uses a tool to fetch the current date and time as a substep with a tool call. Once it knows the current date, it calculates the correct time for the event and uses its calendar tool to create the entry.







This showcases how Aura breaks down a seemingly simple prompt into logical steps, ensuring accurate results even with relative dates.


### Example 2: Summarizing Emails and Spotting Newsletters

In this example, Aura demonstrates its ability to scan through emails and identify newsletters. With a single query, it quickly summarizes my inbox and flags emails that are considered newsletters.


> Summarize mail mails in a table format from today. I want to see the sender, the subject, and whether the mail is a newsletter or not. Make sure to hide names and PII.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*U9GCfzuRvTByP5J62wOmYg.png)


## Roadmap for Evolution: Expanding Aura’s Capabilities

With the basic setup complete, Aura is now functional and capable of handling simple tasks using its tools. It can manage your calendar, organize your emails, and even summarize your inbox — but this is just the beginning.

Now that I’ve established a solid foundation, the real journey begins. The possibilities for Aura are vast, and there’s plenty of room for improvements and new capabilities. Here’s what’s on the horizon:


### Extending Current Tools

* Enhance existing Gmail tools to support additional tasks like flagging emails, moving them to specific folders, or even unsubscribing from newsletters.
* Refine tool outputs by controlling the data sent back to the LLM. For example, instead of returning an entire email, extract only the relevant fields needed for specific tasks.


### Adding New Toolkits and Agents

* Introduce new integrations, such as tools for conducting online research, managing tasks in platforms like Notion or Trello, or interacting with project management systems.
* Develop specialized agents that can work collaboratively with Aura, enabling it to handle more complex, multi\-step workflows.


### Increasing Robustness and Stability

* Improve the agent’s error handling to make it more resilient in scenarios like API failures or unexpected inputs.
* Optimize the underlying architecture to ensure scalability and consistency as more tools and tasks are added.
* Test and refine how Aura manages overlapping requests, ensuring smooth operation even in high\-demand situations.


### Personalization

* Add long\-term structured memory so Aura can remember concepts, workflows and preferences.

This foundation allows us to experiment and grow Aura into a powerful, personalized AI assistant.

Stay tuned for the upcoming posts, in which I’ll tackle some of these enhancements and take Aura to the next level. In the meantime, if you have ideas or features, you’d love to see Aura handle, head over to the [GitHub Discussions](https://github.com/richard-gyiko/aura/discussions) page — I’d love to hear your thoughts!


