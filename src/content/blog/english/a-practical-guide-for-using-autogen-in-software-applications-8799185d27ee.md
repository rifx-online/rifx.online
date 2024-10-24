---
title: "A practical guide for using AutoGen in software applications"
meta_title: "A practical guide for using AutoGen in software applications"
description: "Update: While this article was written only 4 months ago, AutoGen has since changed quite a bit. I apologize for some things that may be…"
date: 2024-10-24T17:47:43Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*yrraWH6aGNnbx8p-wfQ1OQ.jpeg"
categories: ["Programming", "Chatbots", "Autonomous Systems"]
author: "Rifx.Online"
tags: ["AutoGen", "multi-agent", "LLMs", "customization", "collaboration"]
draft: False

---






*Update: While this article was written only 4 months ago, AutoGen has since changed quite a bit. I apologize for some things that may be outdated in my code examples.*

If you want to learn about AutoGen, there is [documentation](https://microsoft.github.io/autogen/), [Colab notebooks](https://microsoft.github.io/autogen/docs/Examples), and [a blog](https://microsoft.github.io/autogen/blog). Huge kudos to the AutoGen team for making an AMAZING product, but honestly — after reading all their stuff, I still didn’t know how to use AutoGen outside of a terminal or Jupyter Notebook.

This article tries to help fill that gap by giving some helpful ways to make AutoGen work in a software application. Here are the topics I’ll go over:

1. Agents aren’t limited to communicating just over the terminal
2. Registering custom replies
3. How to include real humans in the conversation in real ways
4. You can (and should) customize who speaks next
5. You don’t have to use OpenAI
6. Functions can be used instead of executing code
7. Use Agents for organization, not just for conversations

Lastly, I’ll go over why I think you should use AutoGen to begin with. Let’s go!


## Agents aren’t limited to communicating just over the terminal

You’ll see everyone demo AutoGen using a terminal or Jupyter Notebook. That’s nice for a demo, but there are other ways these agents can talk to each other.

There are 2 basic AutoGen classes: [`UserProxyAg`ent](https://github.com/microsoft/autogen/blob/40dbf31a925c725edb9124f4312c1703bf8744b0/autogen/agentchat/user_proxy_agent.py) and [`AssistantAg`ent](https://github.com/microsoft/autogen/blob/main/autogen/agentchat/assistant_agent.py) . They inherit the [`ConversableAg`ent](https://github.com/microsoft/autogen/blob/40dbf31a925c725edb9124f4312c1703bf8744b0/autogen/agentchat/conversable_agent.py) class, providing just a few different default parameters to the base class.

When you see this classic code example:


```python
assistant = autogen.AssistantAgent(
    name="assistant",
    llm_config=llm_config
)
user_proxy = autogen.UserProxyAgent(name="user_proxy")
await user_proxy.a_initiate_chat(
    assistant,
    message="""What date is today? Compare the year-to-date gain for META and TESLA.""",
)
```
what happens is that the `UserProxyAgent` will call its own `send` method, which will call `AssistantAgent` ‘s [`rece`ive](https://github.com/microsoft/autogen/blob/40dbf31a925c725edb9124f4312c1703bf8744b0/autogen/agentchat/conversable_agent.py#L514) method, passing along the original message. A reply will be generated (more on that below), and `AssistantAgent` will now call its [`s`end](https://github.com/microsoft/autogen/blob/40dbf31a925c725edb9124f4312c1703bf8744b0/autogen/agentchat/conversable_agent.py#L351) method, which will then call `UserProxyAgent` ‘s `receive` method, and so forth, until `UserProxyAgent` determines the conversation is terminated (which can be customized via the `is_termination_msg` argument).

My first “aha” moment was when I realized these agents were classes, and I could create my own custom agent classes that inherit the AutoGen UserProxy/Assistant/Conversable Agent classes, and override any of the default methods. That makes AutoGen very extensible.

I had a use-case where I needed a human who could type in a message (proxied by `UserProxyAgent`) using a chat UI on a website, and I wanted an `AssistantAgent` to respond back to that chat in the UI, and be able to receive more messages from the human user, as though the human was just another agent in this AutoGen conversation.

I could override the `send` and `receive` methods (or `a_send` and `a_receive`), and push/pull over http, websockets, etc. I tried this, and it started to work, but doesn’t scale. Let’s learn a better way.


## Registering custom replies

AutoGen has a plugin system that lets you customize how an agent generates a reply. We’re used to seeing examples where AutoGen queries OpenAI for an answer, and uses that as its reply, but you can insert your own methods as well:


```python
class WeatherAgent(AssistantAgent):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, llm_config=False, **kwargs)
        self.register_reply(Agent, WeatherAgent.get_weather)

    async def get_weather(
        self,
        messages: List[Dict] = [],
        sender=None,
        config=None,
    ) -> Tuple[bool, Union[str, Dict, None]]:
        last_message = messages[-1]["content"]
        result = await fetch_weather(last_message)
        return True, result

async def fetch_weather(city: str) -> str:
    async with httpx.AsyncClient() as client:
        result = await client.post(
            WEATHER_API_URL,
            json={"city": question},
        )
        return result.json()

weather_assistant = WeatherAgent(name="weather_assistant")
user_proxy = autogen.UserProxyAgent(name="user_proxy")
await user_proxy.a_initiate_chat(assistant, message="Lehi")
print(weather_assistant.last_message)
```
Here, `register_reply` will insert my custom method for getting a reply, and by default, will put this method in `position=0`, meaning it will be the first reply method attempted. That method should return a tuple, where the first item is a boolean indicating if this reply is the one that should be used or whether to try the next registered\_reply (such as the built-in reply generations using OpenAI — see the full order [here](https://github.com/microsoft/autogen/blob/40dbf31a925c725edb9124f4312c1703bf8744b0/autogen/agentchat/conversable_agent.py#L145-L153)).

Knowing about [`register_re`ply](https://github.com/microsoft/autogen/blob/40dbf31a925c725edb9124f4312c1703bf8744b0/autogen/agentchat/conversable_agent.py#L155) allows you to customize how replies are retrieved, allow you to start sub multi-agent conversations, etc.


## How to include real humans in the conversation in real ways

Here’s one way to do it:


```python
## user makes a POST /query { "message": "What's the weather?" }

@query_blueprint.route("/query", methods=["POST"])
async def post_query():
  message = request.form.get("message")

  assistant = autogen.AssistantAgent(
    name="assistant",
    llm_config=llm_config
    system_message="""You're a helpful assistant.
    If you need more info, ask the user for anything missing."""
  )
  user_proxy = autogen.UserProxyAgent(
    name="user_proxy",
    human_input_mode="NEVER",
    code_execution_config=False,
    is_termination_msg=lambda message: True # Always True
  )
  weather_assistant = WeatherAgent(
    name="weather_assistant",
    system_message="""You're a helpful assistant to get the weather.
    You fetch weather information, then return it."""
  )

  groupchat = autogen.GroupChat(
    agents=[assistant, user_proxy, weather_assistant],
    messages=[]
  )
  manager = autogen.GroupChatManager(
    name="Manager",
    groupchat=groupchat,
    llm_config=llm_config,
  )

  await user_proxy.a_initiate_chat(manager, message=message)

  return groupchat.messages[-1]
```
What’s going on here?

1. Anytime a message is sent to `user_proxy`, the conversation will end (we’ll resume it later). Why do this? This means the `user_proxy` can actually proxy for the user. Rather than try to answer, it will end the current conversation flow and allow the real human user to respond (by resuming the conversation — see below).
2. If the assistant needs more info, it’ll ask user\_proxy, which will end the current conversation.

In the above code, what is likely to occur is something like this:

1. user\_proxy -> manager: “What’s the weather?”
2. assistant -> manager: “The user didn’t specify for which city.”
3. manager -> user\_proxy : conversation will end

Now, if the user wants to respond and resume the conversation, how would we do that? There’s lots of ways to do this, here’s just a sample flavor:


```python
## user makes a POST /query { "message": "What's the weather?" }
## above posts returns a `history` array
## user makes a second POST /query { "message": "What's the weather?", "history": history }

class ResumableGroupChatManager(GroupChatManager):
    groupchat: GroupChat

    def __init__(self, groupchat, history, **kwargs):
        self.groupchat = groupchat
        if history:
            self.groupchat.messages = history

        super().__init__(groupchat, **kwargs)

        if history:
            self.restore_from_history(history)

    def restore_from_history(self, history) -> None:
        for message in history:
            # broadcast the message to all agents except the speaker.  This idea is the same way GroupChat is implemented in AutoGen for new messages, this method simply allows us to replay old messages first.
            for agent in self.groupchat.agents:
                if agent != self:
                    self.send(message, agent, request_reply=False, silent=True)

@query_blueprint.route("/query", methods=["POST"])
async def post_query():
  message = request.form.get("message")

  assistant = autogen.AssistantAgent(
    name="assistant",
    llm_config=llm_config
    system_message="""You're a helpful assistant.
    If you need more info, ask the user for anything missing."""
  )
  user_proxy = autogen.UserProxyAgent(
    name="user_proxy",
    human_input_mode="NEVER",
    code_execution_config=False,
    is_termination_msg=lambda message: True # Always True
  )
  weather_assistant = WeatherAgent(
    name="weather_assistant",
    system_message="""You're a helpful assistant to get the weather.
    You fetch weather information, then return it."""
  )

  groupchat = autogen.GroupChat(
    agents=[assistant, user_proxy, weather_assistant],
    messages=[]
  )
  manager = ResumableGroupChatManager(
    name="Manager",
    groupchat=groupchat,
    llm_config=llm_config,
  )

  await user_proxy.a_initiate_chat(manager, message=message)

  return {
    "response": groupchat.messages[-1],
    "history": groupchat.messages,
  }
```
Using this approach, you can now include humans as though they were just another agent in the groupchat. Anytime an assistant agent wants human input, they ask user\_proxy, user\_proxy then ends the current conversation, allowing the human user to respond with more information, then pick up the conversation where it left off.

The benefits to this approach are:

* Conversations can include real human input via any means you want (such as over http or websocket).
* The conversation is stopped while getting human input. This frees up the thread for other conversations and computation.
* You can persist these conversations across sessions.


## You can (and should) customize who speaks next

This is subjective, but I think you should always customize the way speakers are selected because:

1. You’ll use less tokens (saves both $ and response time)
2. You can separate the logic that decides who speaks next from the logic that defines the system instructions for each agent


```python
short_role_descriptions = {
  "user_proxy": "A proxy for the user",
  "weather_assistant": "You can get the weather",
  "planner": "You help coordinate the plan. Your turn happens when XYZ, but skip your turn when ABC"
}

class CustomGroupChat(GroupChat):
    # The default message uses the full system message, which is a long string.  We are overriding this to use a shorter message.
    def select_speaker_msg(self, agents: List[Agent]):
        message = f"""You are in a role play game. The following roles are available:
        ---
        {new_line.join([f"{agent.name}: {short_role_descriptions[agent.name]}" for agent in agents])}
        ---

        The role who plays next depends on the conversation.  User_Proxy will star the conversation, and typically Planner would go next.

        Here are some examples
        ---
        ... not shown here ...
        ---

        Read the following conversation.
        Then select the next role from {', '.join([agent.name for agent in agents])} to play. Only return the role."""
        return message
```

## You don’t have to use OpenAI

AutoGen already notes you can use other LLMs, as long as they are “ChatGPT-like”, meaning their API responds with a similar shape and response as ChatGPT API calls.

But, remember how these agents are classes, and you can override most of the methods?

Try overriding the method: [generate\_oai\_reply](https://github.com/microsoft/autogen/blob/40dbf31a925c725edb9124f4312c1703bf8744b0/autogen/agentchat/conversable_agent.py#L678), and you can query any LLM you’d like.


## Functions can be used instead of executing code

When I went to our security team and said “I’d like to use AutoGen for my service in Kubernetes. It needs to be able to execute any arbitrary code produced by an LLM. You’re ok with that, right?”

Of course, the answer was a definite: NO.

So, why use AutoGen without the auto-code-execution abilities?

On top of the reasons stated below, another is that you can use function calling to gain total control over code execution. If you have a set of python functions you want to provide to AutoGen — functions you wrote, control, and can accept some safe parameters — that sounds like a better idea anyway than the wild west of allowing any and all code to be executed in your private infrastructure.


## Use Agents for organization, not just for conversations

Maybe you don’t have a need for an autonomous, multi-agent conversation. Maybe you just need to make a few different calls to an LLM.

I still like the idea of having different “Agents” just for the sake of organization. Here’s a really crazy idea, but take it for what it’s worth:


```python
analyst = autogen.AssistantAgent(
    name="Analyst",
    system_message="""Your an analyst.  You do XYZ.""",
    llm_config=llm_config,
)

summarizer = autogen.AssistantAgent(
    name="Summarizer",
    system_message="""Your a summarizer.  You do XYZ.""",
    llm_config=llm_config,
)

report = """Some long report"""

analysis = analyst.generate_oai_reply(report)[1]
summary = summarizer.generate_oai_reply(report)[1]

print(f"Analysis: {analysis}")
print(f"Summary: {summary}")
```

## Why use AutoGen?

1. AutoGen allows multiple agents, with different system prompts and instructions, to solve a problem. Just like in real-life, different perspectives working together will solve a problem better than a single brain.
2. AutoGen GroupChat is amazing. It provides routing to the right experts (agents), and it allows a conversation to continue autonomously until the problem is solved. Some conversations will go from agent: a->b->c->d, others will be b->a->d->c. This allows AutoGen to solve a variety of different problems without needing explicit rules for each scenario.
3. AutoGen can recover from mistakes. For example, I made an AutoGen-powered service that made API calls to a service. Sometimes, the API calls errored out because it didn’t send the right data at first. The AutoGen GroupChat kept trying different things until it succeeded. Sometimes, it took 4+ attempts, but my Planner agent didn’t give up — just pivoted autonomously to handle the API failures and try new things.
4. AutoGen came up with the concept of separating `UserProxyAgent`s from `AssistantAgent` s from the beginning. This also allows us to let the user proxy actually proxy for the user, as shown above.
5. AutoGen is a well maintained library. Every week they’re adding something new.
6. AutoGen is very extensible. With the way they’ve built their classes, you can customize anything to your liking.
7. AutoGen has other features I don’t use, but others may find them helpful, such as helping you count tokens and cost of conversations, cacheing, etc.

