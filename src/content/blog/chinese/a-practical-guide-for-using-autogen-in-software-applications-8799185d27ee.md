---
title: "在软件应用程序中使用 AutoGen 的实用指南"
meta_title: "在软件应用程序中使用 AutoGen 的实用指南"
description: "更新：虽然这篇文章是 4 个月前写的，但 AutoGen 已经发生了很大变化。对于可能存在的一些问题，我深表歉意……"
date: 2024-10-23T11:56:14Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*yrraWH6aGNnbx8p-wfQ1OQ.jpeg"
categories: ["llm"]
author: "Rifx.Online"
tags: ["llm"]
draft: False

---





*更新：虽然这篇文章是在四个月前写的，但 AutoGen 自那时以来变化很大。对于我代码示例中可能过时的内容，我深感歉意。*

如果您想了解 AutoGen，可以查看 [文档](https://microsoft.github.io/autogen/)、[Colab 笔记本](https://microsoft.github.io/autogen/docs/Examples) 和 [博客](https://microsoft.github.io/autogen/blog)。非常感谢 AutoGen 团队制作了一个令人惊叹的产品，但老实说——在阅读了他们的所有内容后，我仍然不知道如何在终端或 Jupyter Notebook 之外使用 AutoGen。

本文试图通过提供一些有用的方法来帮助填补这个空白，使 AutoGen 在软件应用中发挥作用。以下是我将要讨论的主题：

1. 代理不仅限于通过终端进行通信
2. 注册自定义回复
3. 如何以真实的方式将真实人类纳入对话
4. 您可以（并且应该）自定义谁来发言
5. 您不必使用 OpenAI
6. 可以使用函数而不是执行代码
7. 将代理用于组织，而不仅仅是对话

最后，我将讨论为什么我认为您应该首先使用 AutoGen。让我们开始吧！

## 代理不仅限于通过终端进行通信

您会看到每个人都使用终端或 Jupyter Notebook 演示 AutoGen。这对于演示来说不错，但这些代理之间还有其他交流方式。

AutoGen 有 2 个基本类：[`UserProxyAg`ent](https://github.com/microsoft/autogen/blob/40dbf31a925c725edb9124f4312c1703bf8744b0/autogen/agentchat/user_proxy_agent.py) 和 [`AssistantAg`ent](https://github.com/microsoft/autogen/blob/main/autogen/agentchat/assistant_agent.py)。它们继承了 [`ConversableAg`ent](https://github.com/microsoft/autogen/blob/40dbf31a925c725edb9124f4312c1703bf8744b0/autogen/agentchat/conversable_agent.py) 类，仅为基类提供了几个不同的默认参数。

当您看到这个经典代码示例时：

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
发生的事情是 `UserProxyAgent` 将调用其自己的 `send` 方法，这将调用 `AssistantAgent` 的 [`rece`ive](https://github.com/microsoft/autogen/blob/40dbf31a925c725edb9124f4312c1703bf8744b0/autogen/agentchat/conversable_agent.py#L514) 方法，传递原始消息。将生成回复（稍后会详细说明），然后 `AssistantAgent` 将调用其 [`s`end](https://github.com/microsoft/autogen/blob/40dbf31a925c725edb9124f4312c1703bf8744b0/autogen/agentchat/conversable_agent.py#L351) 方法，这将调用 `UserProxyAgent` 的 `receive` 方法，依此类推，直到 `UserProxyAgent` 确定对话已终止（可以通过 `is_termination_msg` 参数自定义）。

我第一次“恍然大悟”的时刻是当我意识到这些代理是类时，我可以创建自己的自定义代理类，继承 AutoGen 的 UserProxy/Assistant/Conversable Agent 类，并重写任何默认方法。这使得 AutoGen 非常可扩展。

我有一个用例，需要一个可以通过网站上的聊天 UI 输入消息的人（由 `UserProxyAgent` 代理），我希望 `AssistantAgent` 能在 UI 中回复该聊天，并能够接收更多来自人类用户的消息，就好像人类只是这个 AutoGen 对话中的另一个代理。

我可以重写 `send` 和 `receive` 方法（或 `a_send` 和 `a_receive`），并通过 http、websockets 等进行推送/拉取。我尝试了这个，它开始工作，但无法扩展。让我们学习一种更好的方法。

## 注册自定义回复

AutoGen 具有一个插件系统，可以让您自定义代理生成回复的方式。我们习惯看到的示例是 AutoGen 查询 OpenAI 获取答案，并将其作为回复，但您也可以插入自己的方法：

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
在这里，`register_reply` 将插入我的自定义方法以获取回复，默认情况下，该方法将放在 `position=0`，这意味着它将是尝试的第一个回复方法。该方法应返回一个元组，其中第一个项目是一个布尔值，指示此回复是否为应使用的回复，或者是否应尝试下一个注册的回复（例如，使用 OpenAI 的内置回复生成 — 完整顺序请参见 [此处](https://github.com/microsoft/autogen/blob/40dbf31a925c725edb9124f4312c1703bf8744b0/autogen/agentchat/conversable_agent.py#L145-L153)）。

了解 [`register_reply`](https://github.com/microsoft/autogen/blob/40dbf31a925c725edb9124f4312c1703bf8744b0/autogen/agentchat/conversable_agent.py#L155) 使您能够自定义回复的检索方式，允许您启动子多代理对话等。

## 如何以真实的方式将真实人类纳入对话

这里有一种方法：

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
这里发生了什么？

1. 每当一条消息发送到 `user_proxy` 时，对话将结束（我们稍后会恢复它）。这样做的原因是什么？这意味着 `user_proxy` 实际上可以代理用户。它不会尝试回答，而是会结束当前的对话流程，允许真实的人类用户响应（通过恢复对话 — 见下文）。
2. 如果助理需要更多信息，它会询问 user_proxy，这将结束当前对话。

在上述代码中，可能会发生以下情况：

1. user_proxy -> manager: “天气怎么样？”
2. assistant -> manager: “用户没有指定哪个城市。”
3. manager -> user_proxy : 对话将结束

现在，如果用户想要回应并恢复对话，我们该如何做到呢？有很多方法可以做到这一点，这里只是一个示例：

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
通过这种方法，您可以将人类纳入对话，就像他们是群聊中的另一个代理一样。每当助理代理需要人类输入时，它们会询问 user_proxy，user_proxy 然后结束当前对话，允许人类用户用更多信息进行响应，然后恢复到之前的对话。

这种方法的好处是：

* 对话可以通过您想要的任何方式包含真实人类输入（例如通过 http 或 websocket）。
* 在获取人类输入时，对话被暂停。这为其他对话和计算释放了线程。
* 您可以在会话之间持久化这些对话。

## 你可以（并且应该）自定义谁接下来发言

这是主观的，但我认为你应该始终自定义发言者的选择方式，因为：

1. 你将使用更少的令牌（节省金钱和响应时间）
2. 你可以将决定谁发言的逻辑与定义每个代理系统指令的逻辑分开


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

## 你不必使用 OpenAI

AutoGen 已经指出，你可以使用其他 LLM，只要它们是“类似 ChatGPT”的，这意味着它们的 API 响应与 ChatGPT API 调用的形状和响应相似。

但是，请记住这些代理是类，并且你可以重写大多数方法？

尝试重写方法: [generate\_oai\_reply](https://github.com/microsoft/autogen/blob/40dbf31a925c725edb9124f4312c1703bf8744b0/autogen/agentchat/conversable_agent.py#L678)，你可以查询任何你想要的 LLM。

## 函数可以用来代替执行代码

当我去找我们的安全团队并说：“我想在Kubernetes中为我的服务使用AutoGen。它需要能够执行任何由LLM生成的任意代码。你们对此没问题吧？”

当然，答案是明确的：不可以。

那么，为什么在没有自动代码执行能力的情况下使用AutoGen？

除了下面提到的原因之外，还有一个原因是你可以使用函数调用来完全控制代码执行。如果你有一组想要提供给AutoGen的python函数——这些函数是你编写的、你控制的，并且可以接受一些安全参数——这听起来总比在你的私有基础设施中允许任何代码被执行要好得多。

## 使用代理进行组织，而不仅仅是进行对话

也许你并不需要一个自主的多代理对话。也许你只需要对LLM进行几次不同的调用。

我仍然喜欢仅仅出于组织目的而拥有不同“代理”的想法。这是一个非常疯狂的想法，但请根据自己的情况来看待它：

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

## 为什么使用 AutoGen？

1. AutoGen 允许多个代理，具有不同的系统提示和指令，共同解决问题。就像在现实生活中，不同的视角共同合作会比单一思维更好地解决问题。
2. AutoGen GroupChat 非常出色。它提供了通向正确专家（代理）的路线，并允许对话在问题解决之前自主持续进行。有些对话将从代理 a->b->c->d 进行，而其他的将是 b->a->d->c。这使得 AutoGen 能够在不需要为每种场景制定明确规则的情况下解决各种不同的问题。
3. AutoGen 能够从错误中恢复。例如，我创建了一个基于 AutoGen 的服务，该服务向一个 API 发出请求。有时，API 请求因为未能正确发送数据而出错。AutoGen GroupChat 不断尝试不同的方法，直到成功。有时，这需要 4 次以上的尝试，但我的 Planner 代理没有放弃——只是自主调整以处理 API 失败并尝试新方法。
4. AutoGen 从一开始就提出了将 `UserProxyAgent` 与 `AssistantAgent` 分离的概念。这也使我们能够让用户代理真正为用户代理，如上所示。
5. AutoGen 是一个维护良好的库。每周他们都会添加一些新功能。
6. AutoGen 非常可扩展。通过他们构建类的方式，您可以根据自己的喜好自定义任何内容。
7. AutoGen 还有其他我不使用的功能，但其他人可能会觉得它们有帮助，例如帮助您计算对话的令牌和成本、缓存等。

