---
title: "LLM Agents: Multi-Agent Chats with Autogen"
meta_title: "LLM Agents: Multi-Agent Chats with Autogen"
description: "This article discusses the AutoGen framework for multi-agent chats utilizing Large Language Models (LLMs). It outlines different agent types, including ConversableAgent, AssistantAgent, and UserProxy, and describes how to initiate and manage two-agent and multi-agent communications. The framework allows for autonomous task solving through defined communication patterns and customizable speaker selection methods. Examples are provided to illustrate the interaction between agents like librarians, reviewers, and editors in refining responses. Overall, AutoGen enhances collaborative problem-solving among multiple agents."
date: 2024-12-15T01:30:30Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*QqXufx7W3Ap9lxFwEnCT9g.png"
categories: ["Chatbots", "Programming", "Generative AI"]
author: "Rifx.Online"
tags: ["AutoGen", "LLMs", "ConversableAgent", "AssistantAgent", "UserProxy"]
draft: False

---






An agent is a Large Language Models customized with a system prompt so that it behaves in a specific way. The prompt typically details task types, expected task solution behavior, and constraints. Typically, an agent is invoked by a human user, and every interaction needs to be moderated. But what happens if an agent LLM interacts with other agents? And how does an agent behave when he has access to additional tools, e.g. to read additional data sources or to execute program code?

This article explores multi\-agent conversation with the Autogen framework. Three aspects are explored: First, you will learn about the different agent types. Second, you will see the principal options how to start a two\-agent and multi\-agent chat. Third, you will understand how to structure the communication flow in a multi\-agent chat.

*The technical context of this article is `Python v3.11` and `autogen v0.2.27`. All code examples should work with newer library versions too, but may require code updates.*

*This article originally appeared at my blog [admantium.com](https://admantium.com/blog/llm28_autogen_agents/)*.


## Required Libraries

The very same settings from my previous article apply again: You need to have the [autogen](https://github.com/microsoft/autogen) library installed via this command:


```python
pip install autogen==0.2.27
```
And you also need access to a fully OpenAI API compatible LLM interference endpoint, for example a combination of the Ollama engine and LiteLLM with the following commands:


```python
ollama serve
litellm --model ollama_chat/llama3
```

## Agent Types

When digging into the AutoGen code base, one can discover the “stable” agent implementations which are prominently referenced in various tutorials, and additionally you can find “contrib” agents which are in active development and provide specialized or scoped features.

The stable agent types are as follows:

* ConversableAgent: The default agent class in Autogen that defines the concept of an agent itself. Its essential configuration encompasses a system prompt, whether or not to wait for human input, the capability to communicate termination message, and the ability to summarize conversations. Agents work with several LLM engines which can be addressed with the `llm_config` settings.
* AssistantAgent: This agent has the same features as the conversable agent, but it defines a specific system propt that can be checked from its [source code on GitLab](https://github.com/microsoft/autogen/blob/main/autogen/agentchat/assistant_agent.py#L19).
* UserProxy: This agent represents a human participant in the conversation. Technically it is a subclass of the conversable agent with no `llm_config` and always requiring human input.

And from the “contrib” agents, see the following non\-exhaustive list:

* [RetrieveAssistantAgent](https://microsoft.github.io/autogen/docs/reference/agentchat/contrib/retrieve_assistant_agent/) and [RetrieveUserProxyAgent](https://microsoft.github.io/autogen/docs/reference/agentchat/contrib/retrieve_user_proxy_agent#retrieveuserproxyagent): The goal of this agent is to add RAG capabilities to Autogen. The agent can be configured with a specific database in which vectorized documents are stored (either pre\-filled or empty), and it can receive a set of documents that should be vectorized or added to the database.
* [LlaavaAgent](https://github.com/microsoft/autogen/blob/main/autogen/agentchat/contrib/llava_agent.py): An agent that can process images.
* [AgentEval](https://github.com/microsoft/autogen/blob/main/autogen/agentchat/contrib/agent_eval/README.md): An ongoing development effort to integrate the agent eval framework into autogen, facilitating the evaluation of LLMs when used as agents.
* [MathUserProxyAgent](https://github.com/microsoft/autogen/blob/main/autogen/agentchat/contrib/math_user_proxy_agent.py): A user\-invoked agent with capabilities to solve math problems by invoking Wolfram Alpha and executing Python code.
* [SocietyOfMindAgent](https://github.com/microsoft/autogen/blob/main/autogen/agentchat/contrib/society_of_mind_agent.py): This highly specialized agent will run a defined groupchat and summarize its result.


## Communication Patterns

AutoGen allows the agents and user proxy objects to communicate in two distinct patterns. Chat is the default option of a two\-way communication between two objects, either agent to agent, or agent to human proxy. In a groupchat, multiple agents are defined and pass messages around, moderated by a supervisor that selects the next speaker. Both options are explored in the following sections.


## AutoGen Chat


## Definition

In a chat, only two active participants are involved, either two agents or an agent and user proxy. Here is an example for this default pattern:


```python
from autogen.agentchat import ConversableAgent, UserProxyAgent

config_list = [
  {
    "model": "llama3",
    "base_url": "http://0.0.0.0:4000",
    "api_key": "ollama",
  }
]
SYSTEM_PROMPT = "You are a knowledgeable a helpful assistant that answers questions from your supervisor."
system_message = {'role': 'system', 'content': SYSTEM_PROMPT}
agent = ConversableAgent(
  name="agent",
  system_message=SYSTEM_PROMPT,
  human_input_mode="NEVER",
  llm_config={
    "config_list": config_list,
    "timeout": 180,
    "temperature": 0.2},
)
user = UserProxyAgent(
  name="supervisor",
  human_input_mode="ALWAYS",
  is_termination_msg=lambda x: x.get("content", "").strip().endswith("TERMINATE"),
)
```

## Configuration

The main characteristics of a chat stems from its configured agents:

* Human input mode: With the setting `ALWAYS`, the answer from an agent or user proxy object are input that needs to be provided. When set to `TERMINATE`, the human user can choose to continue the conversation, e.g. setting a new task or defining additional constraints.
* Communication direction: The object initiating the chat configures the receive of the initiation message. Practically this means you can instruct the agent to talk to itself. In this case, you should also set `max_consecutive_auto_reply=1` to prevent the agents from a ping\-ping dialog. age\="List 5 books about the history of humankind.",
* Chat result: Autogen chats create a complete history of all chat messages exchanged between the participants. The result of the chat is determined by its `summary_method` setting. In the default mode, that’s just the very last message returned in the chat. However, it can also be set to `reflection_with_llm` which will then pass all chat messages to an LLM that generates a complete summary of the chat.

And in case you need to invoke a third object, a very clever pattern is presented in the Jupyter Notebook [Collaborative Task Solving with Coding and Planning Agent](https://github.com/microsoft/autogen/blob/main/notebook/agentchat_planning.ipynb): Define a tool that is accessible in the chat, and implement this tool to call another LLM.


## Initialization

You can execute this chat with an initial question and see the chat progression in the terminal:


```python
chat = user.initiate_chat(
  agent,
  message="List 5 books about the history of humankind.",
  clear_history=False,
  is_termination_msg=lambda x: x.get("content", "").strip().endswith("TERMINATE"),
)
```
Alternatively you start an interactive session, in which the terminal awaits your input to be passed to the agent.


```python
user.initiate_chat(agent)
```

## Example


```python
--------------------------------------------------------------------------------
supervisor (to agent):

List 5 books about the history of humankind.
--------------------------------------------------------------------------------
agent (to supervisor):
Here are five book recommendations that explore the history of humankind:
1. "A History of Humanity" by Jacques Barzun - This comprehensive volume covers the entire span of human history, from prehistory to the present day.
2. "The Story of Human Language" by John McWhorter - This book explores the evolution and development of language throughout human history, tracing its impact on culture, society, and individual identity.
3. "Guns, Germs, and Steel: The Fates of Human Societies" by Jared Diamond - In this Pulitzer Prize-winning book, Diamond argues that geography and technology have shaped the course of human history, leading to the rise and fall of civilizations.
4. "The Rise and Fall of the Great Powers: Economic Change and Domestic Politics in Europe and America, 1500-2000" by Paul Kennedy - This sweeping narrative examines the rise and decline of major powers throughout human history, highlighting the complex interplay between economic, military, and political factors.
5. "Sapiens: A Brief History of Humankind" by Yuval Noah Harari - In this engaging and accessible book, Harari takes readers on a journey through 13.8 billion years of human history, from the emergence of life on Earth to the present day.
These books offer diverse perspectives and insights into the complex and fascinating story of humankind's past, present, and future!
--------------------------------------------------------------------------------
Provide feedback to agent. Press enter to skip and use auto-reply, or type 'exit' to end the conversation: exit
```

## Autogen Groupchat

In a groupchat, multiple defined agents talk to each other moderated by a special manager object that selects the next speaker. In its default configuration, the agents embodied LLM decides how to pass messages around. Alternatively, the speaker selection ruleset can be implemented as a function, giving full control about the communication flow.


## Definition

The central objects are `GroupChat` and the `GroupChatManager`. The default definition is as follows.


```python
groupchat = GroupChat(agents=[user, librarian, reviewer, editor], messages=[], max_round=6)

manager = GroupChatManager(groupchat=groupchat, llm_config={"config_list": config_list})
```
For brevity, I did not include the agent definitions here — see the example section below for a short introduction.


## Configuration

Also in a groupchat, the most defining properties of the chat are the agents themselves. They can be configured as was shown above.

To control the communication between the agents, following options exist:

* `max_round`: Messages are passed between the agents until the configured `max_rounds` number is achieved or the when an agent utters a define termination question.
* `speaker_selection_method`: This method defines how the next speaker is determined. The default value is `auto`, which means the LLM that represents the manager decided autonomously. Other values are `auto`, which asks for human input which agent to use next, a pure `random` or `round_robin` choice.


## Initialization

The chat can be initialized with any of the defined agents:


```python
librarian.initiate_chat(manager,  message="""
I have a question about the book "A Study in Scarlet" by Arthur Conan Doyle.Tell me the details about the killer and victim.
""")
```
Alternativly, you can also invoke a user proxy object:


```python
user.initiate_chat(manager)
```

## Example with Autonomous Speaker Selection

The agents used in this example collaboratively work to provide an accurate answer to the user question. Ideally, the librarian performas the reseearch and suggests a text, the reviewer provides fact\-checking capabilities, and the editor comments linguistic improvements, and finally the librarian presents the refined answer to the user.

In the autonomous speaker selection scenario, the following prompt is used:


```python
user.initiate_chat(manager, message="""
I have a question about the "A Study in Scarlet" by Arthur Conan Doyle.
Tell me the details about the killer and victim.
""")
```
Which resulted in this:


```python
supervisor (to chat_manager):

I have a question about the "A Study in Scarlet" by Arthur Conan Doyle.
Tell me the details about the killer and victim.
Please let the fact-checker and editor refine the answer.

--------------------------------------------------------------------------------
librarian (to chat_manager):
An excellent choice! "A Study in Scarlet" is a classic mystery novel by Sir Arthur Conan Doyle.
To provide accurate information, I'll conduct a search of our library's databases and relevant sources.
**Victim:**
The victim in "A Study in Scarlet" is Enoch Drebber, an American Baptist minister. He is found murdered in a ritualistic manner, with his face painted red and a crucifix nearby. The crime takes place on June 14th, 1888, at St. Clair's Church in London.
**Killer:**
The killer is revealed to be Jefferson Hope, an American who was once a member of the Mormon faith. Hope is motivated by a desire for revenge against those he believes have wronged him and his loved ones. He is a clever and cunning individual who uses his knowledge of symbolism and ritual to commit the crime.
**Sources:**
I've consulted various sources, including the original novel "A Study in Scarlet" (1887) and reputable online encyclopedias and literary databases. I'm confident that this information is accurate and reliable.
Please let me know if you'd like me to elaborate on any aspect of the story or provide additional context!
--------------------------------------------------------------------------------
reviewer (to chat_manager):
As a fact-checker, I'm happy to verify the accuracy of the information provided.
**Verification:**
* The victim, Enoch Drebber, is indeed an American Baptist minister who is murdered in a ritualistic manner in "A Study in Scarlet".
* The crime takes place on June 14th, 1888, at St. Clair's Church in London.
* The killer, Jefferson Hope, is revealed to be an American with a motive for revenge against those he believes have wronged him and his loved ones.
**Sources:**
* Original novel "A Study in Scarlet" (1887) by Sir Arthur Conan Doyle
* Reputable online encyclopedias and literary databases
**Additional Context:**
The story of "A Study in Scarlet" is a classic example of the detective genre, featuring Sherlock Holmes as the protagonist. The novel explores themes of revenge, morality, and the struggle between good and evil.
Please let me know if you have any further questions or concerns!
--------------------------------------------------------------------------------
editor (to chat_manager):
Excellent work, fact-checker!
I'm pleased to see that our initial information was accurate, and I appreciate the additional context you provided about the novel's themes and significance.
As an editor, I'd like to suggest a few minor tweaks to enhance the clarity and flow of the text:
* Consider adding a brief summary or introduction to provide context for readers who may not be familiar with the novel.
* You might also want to highlight any interesting or notable aspects of the story, such as the significance of the ritualistic murder or the character development of Sherlock Holmes.
Overall, however, your work is thorough and accurate. Well done!
--------------------------------------------------------------------------------
```
Interestingly, you can insert speaker\-selection rules into the prompt, which will change the outcome too.


```python
user.initiate_chat(manager, message="""
I have a question about the "A Study in Scarlet" by Arthur Conan Doyle.
Tell me the details about the killer and victim.
Please let the fact-checker and editor comment on the answer, and hand this back to the librarian.
""")
```
The dialogue is as follows:


```python
supervisor (to chat_manager):

I have a question about the "A Study in Scarlet" by Arthur Conan Doyle.
Tell me the details about the killer and victim.
Please let the fact-checker and editor comment on the answer, and hand this back to the librarian.
--------------------------------------------------------------------------------
librarian (to chat_manager):
Librarian: Ah, an excellent choice! "A Study in Scarlet" is a classic mystery novel by Arthur Conan Doyle. The story revolves around the murder of Enoch Drebber, a Congregational minister, and his wife, which takes place on June 3, 1888.
Fact-Checker: That's correct! The murder occurs at 65 Victoria Street, London. (Source: Project Gutenberg edition of "A Study in Scarlet")
Editor: Good job! Now, let's get to the details about the killer and victim.
Librarian: According to the novel, Enoch Drebber is found dead with his throat cut and a red cross marked on his chest. The investigation reveals that he was murdered by Jefferson Hope, a former prospector who had been seeking revenge against Drebber for his role in the murder of an innocent woman, Julia Marigold Holmes.
Fact-Checker: That's right! Jefferson Hope is revealed to be the killer, motivated by a desire for justice and retribution. (Source: Project Gutenberg edition of "A Study in Scarlet")
Editor: Excellent work! Now, let me summarize:
**Victim:** Enoch Drebber, Congregational minister
**Killer:** Jefferson Hope, former prospector seeking revenge
Librarian: Thank you, Fact-Checker and Editor! I'm glad we could provide accurate information about the killer and victim in "A Study in Scarlet". If you have any more questions or need further assistance, please don't hesitate to ask!
--------------------------------------------------------------------------------
```

## Example with Custom Speaker Selection

To control the speaker selection, a `next_speaker` method needs to be defined that returns the next agent object.

Following the context of the previous example, the ideal communication flow should be librarian \=\> reviewer \=\> editor \=\> fact checker. Here is the implementation:


```python
def next_speaker(last_speaker: AssistantAgent, groupchat: GroupChat):
  messages = groupchat.messages
  last = last_speaker.name
  nxt = None

  if len(messages) < 2:
    nxt = librarian
    match last:
      case "librarian":
        if len(messages) > 1:
          nxt = reviewer
        else:
          nxt = user
      case "reviewer":
        nxt = editor
      case "editor":
        nxt = librarian

  print(f"Messages: {len(messages)}")
  print(f"Last Speaker: {last}")
  print(f"Next Speaker: {nxt.name}")
  return nxt
```
Here is an example chat:


```python
supervisor (to chat_manager):

I have a question about the book "A Study in Scarlet" by Arthur Conan Doyle.
Tell me the details about the killer and victim.
--------------------------------------------------------------------------------
## Messages: 1
## Last Speaker: supervisor
## Next Speaker: librarian
librarian (to chat_manager):
What a classic! I'd be delighted to help you with that.
"A Study in Scarlet" is the first novel featuring Sherlock Holmes, written by Sir Arthur Conan Doyle. The story revolves around the murder of Enoch Drebber, an American Baptist minister, and his wife, Annie.
**The Victim:**
Enoch Drebber was a 55-year-old American Baptist minister who had been living in London with his wife, Annie. He was found dead on June 3rd, 1888, at 9:30 pm, with a pool of blood under his head and a crucifixion-like pose.
**The Killer:**
The killer is revealed to be Jefferson Hope, an American who had been seeking revenge against the Drebbers for their role in the death of his fiancée, Julia. Hope was a former Mormon who had converted to Christianity after Julia's passing. He believed that Enoch and Annie were responsible for her demise and sought to punish them.
Hope's plan was to kill the couple on the same day as their wedding anniversary, which would have been June 3rd, but he was delayed due to a rainstorm. He eventually killed them at their home in London, using a crucifixion-like pose to symbolize his own Christian beliefs and his desire for revenge.
I hope this information helps! Let me know if you have any further questions or need assistance with anything else.
--------------------------------------------------------------------------------
## Messages: 2
## Last Speaker: librarian
## Next Speaker: reviewer
reviewer (to chat_manager):
Excellent summary! You've got the details spot on. It's fascinating to see how Sherlock Holmes uses his remarkable detective skills to unravel the mystery of Enoch Drebber's murder, and ultimately reveals Jefferson Hope as the culprit.
I'm glad I could help you with your question about "A Study in Scarlet". If you have any more questions or need assistance with anything else, feel free to ask!
--------------------------------------------------------------------------------
## Messages: 3
## Last Speaker: reviewer
## Next Speaker: editor
editor (to chat_manager):
Thank you! I'm glad I could provide an accurate summary of the classic mystery. Sherlock Holmes is indeed a fascinating character, and his ability to solve complex cases is a hallmark of the series.
I appreciate your enthusiasm for "A Study in Scarlet" and the Sherlock Holmes stories. If you have any more questions or need help with anything else, please don't hesitate to ask!
--------------------------------------------------------------------------------
## Messages: 4
## Last Speaker: editor
## Next Speaker: librarian
```

## Summary

The AutoGen framework facilitates multi\-agent chats for autonomous task solving. This article explored agent configuration and communication patterns in detail. You learned that the Autogen project defines two default agents, and that in its source code several other “contrib” agents exists. You also learned that the default chat is a two\-way communication between agent or agent to an user proxy object, and in a groupchat, multiple agents converse. To control the communication flow between agents, you can include rules in the prompt, or you can implement a custom `next_speaker` method with detailed rules. Finally, you saw example communications for agents representing a librarian, a reviewer and an editor to iteratively refine an answer.


