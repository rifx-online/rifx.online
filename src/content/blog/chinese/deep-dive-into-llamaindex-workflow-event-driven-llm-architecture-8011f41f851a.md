---
title: "深入了解 LlamaIndex 工作流程：事件驱动的 LLM 架构"
meta_title: "深入了解 LlamaIndex 工作流程：事件驱动的 LLM 架构"
description: "LlamaIndex 引入的 Workflow 功能为 LLM 应用提供了事件驱动和逻辑解耦的能力，支持并发执行 I/O 绑定任务。通过实际项目展示，Workflow 可简化复杂逻辑的控制，但在模块间通信方面存在不足。文章探讨了嵌套工作流和无绑定语法等解决方案，强调了 Workflow 在未来发展的潜力。"
date: 2024-12-19T21:57:08Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*IhtPC6k9k-emQrlDjoMZrA.png"
categories: ["Programming", "Technology/Web", "Machine Learning"]
author: "Rifx.Online"
tags: ["Workflow", "LlamaIndex", "events", "concurrency", "inventory"]
draft: False

---



### 实践后的进展与不足



最近，LlamaIndex 在其某个版本中引入了一个新功能，称为 [Workflow](https://docs.llamaindex.ai/en/stable/understanding/workflows/)，为 LLM 应用提供了事件驱动和逻辑解耦的能力。

在今天的文章中，我们将通过一个实际的迷你项目深入探讨这个功能，探索新内容和仍然不足之处。让我们开始吧。

## 引言

## 为什么选择事件驱动？

越来越多的 LLM 应用程序正在转向智能代理架构，期望 LLM 通过调用不同的 API 或多次迭代调用来满足用户请求。

然而，这一转变带来了一个问题：随着代理应用程序进行更多的 API 调用，程序响应变得缓慢，代码逻辑变得更加复杂。

一个典型的例子是 [ReActAgent](https://docs.llamaindex.ai/en/stable/api_reference/agent/react/#llama_index.core.agent.react.ReActAgent)，它涉及思考、行动、观察和最终答案等步骤，至少需要三次 LLM 调用和一次工具调用。如果需要循环，I/O 调用将会更多。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*LLhfB9nZCdp7Ejwr.png)

## 是否有优化的方法？

如上图所示，在传统编程模型中，所有 I/O 调用都是线性的；下一个任务必须等待上一个任务完成。

尽管主流 LLM 现在支持通过流输出生成结果，但在代理应用中，我们仍然需要等待 LLM 完成结果生成后才能返回或进入下一个阶段。

实际上，我们并不需要所有 I/O 调用按顺序进行；它们可以并发执行，如下图所示：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*FWwrtXdOsxYlbURf.png)

这个图看起来熟悉吗？是的，Python 的 `asyncio` 包提供了并发执行 I/O 绑定任务的能力，几乎所有基于 I/O 的 API，包括 LLM 客户端，都支持并发执行。

LlamaIndex 的工作流也利用了并发编程的原理。它更进一步，不仅封装了 `asyncio` 库的细节，还提供了一种事件机制，使我们能够解耦业务流程的不同部分。

现在我们了解了背景，让我们通过一个实际项目来逐步了解 LlamaIndex 工作流。

## 初步印象

在主菜之前，让我们通过一个简单的代码示例来熟悉元素和基本原理，先来个开胃菜。

### 导入必要的包

首先，我们需要导入必要的工具。Workflow 已经包含在最新版本的 LlamaIndex 中，无需单独安装。

```python
from llama_index.core.workflow import (
    Event,
    StartEvent,
    StopEvent,
    Workflow,
    Context,
    step,
)
```

### 定义一些事件

由于 Workflow 是一个事件驱动的框架，我们应该首先定义一些事件。

为了避免不一致，我们可以首先定义一个 `BaseEvent`，确保所有事件使用关键字 `payload` 进行消息传递。

```python
class BaseEvent(Event):
    payload: str | dict | None
```
让我们定义今天的第一个事件：`SecondStepEvent`

```python
class SecondStepEvent(BaseEvent):
    ...
```

### 从简单开始

接下来，让我们开始编写我们的第一个 Workflow 程序，它是 `Workflow` 的一个子类，包含两个方法：

```python
class SimpleWorkflow(Workflow):
    @step
    async def start(self, ev: StartEvent) -> SecondStepEvent:
        return SecondStepEvent(payload=ev.payload)
    
    @step
    async def second_step(self, ev: SecondStepEvent) -> StopEvent:
        return StopEvent(result=ev.payload)
```
1. 方法 `start` 接受一个 `StartEvent`，然后返回一个 `SecondStepEvent`。
2. 方法 `second_step` 接受一个 `SecondStepEvent`，然后返回一个 `StopEvent`。

让我们运行代码，看看它是如何工作的。

```python
s_wf = SimpleWorkflow(timeout=10, verbose=True)
result = await s_wf.run(payload="hello world")
print(result)
```
我们开启了 `verbose` 选项，以便详细查看代码的执行过程。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*F_V-H0f1uP_QSA-H.png)

### 尝试可视化工具

LlamaIndex 还慷慨地提供了一个小工具，让我们能够查看整个工作流程，非常直观。

```python
from llama_index.utils.workflow import draw_all_possible_flows

draw_all_possible_flows(SimpleWorkflow, filename="simple_workflow.html")
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*cbqcz1fQbSF3gb1c.png)

### 原理解释

快速查看源代码可以发现，Workflow 在内部维护一个 `Context`，它不仅保持一个事件队列，还维护一个包含每个步骤的字典。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*_gaK8KOGCQu0Qe8l.png)

当 Workflow 被初始化时，`step` 装饰器分析每个方法的签名，以确定它将接收和返回哪些事件，开始监听事件队列，然后将该方法存储在 `step` 字典中。

当 Workflow 的 `run` 方法被启动时，它开始一个 `runflow` 循环，最初将一个 `StartEvent` 放入事件队列。如果有一个方法接受这个 `StartEvent`，它开始执行并返回相应的事件，再将其放回事件队列。

`step` 方法还可以直接调用 Context 的 `send_event` 方法将事件放入队列。

如果 runflow 循环在队列中检测到 `StopEvent`，它将退出流程并返回最终结果。

在对元素和实现原理有了基本了解后，我们现在可以通过一个实践项目来探索 Workflow 的优缺点。

## 实践项目

在今天的实践项目中，我们将帮助超市的采购经理创建一个基于客户反馈的SKU库存管理系统，展示Workflow的分支和循环控制、流式事件以及并发执行功能。

### 分支和循环控制

在反馈监控的第一个版本中，我们将持续监控某个 SKU 的最新反馈，分析输入中隐含的反馈，然后采取相应的行动。

整个代码逻辑如下面的图所示：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*rF7pHCufjHUCaQZQs0L_UA.png)

首先，我们将定义一个 InventoryManager 类，使用 `async` 来实现 place_order 和 clear_out 方法。

```python
class InventoryManager:
    async def place_order(self, sku: str) -> None:
        await asyncio.sleep(0.5)
        print(f"Will place an order for {sku}")
    
    async def clear_out(self, sku: str) -> None:
        await asyncio.sleep(0.5)
        print(f"Will clear out {sku}")
```
我们还需要实现四个事件：`LoopEvent`、`GetFeedbackEvent`、`OrderEvent` 和 `ClearEvent`，它们都是 `BaseEvent` 的子类，确保它们遵循统一的消息传递接口。

```python
class LoopEvent(BaseEvent):
    ...
    
class GetFeedbackEvent(BaseEvent):
    ...

class OrderEvent(BaseEvent):
    ...

class ClearEvent(BaseEvent):
    ...
```
接下来，我们开始实现 `FeedbackMonitorWorkflow` 类，其中包含核心业务逻辑。

```python
class FeedbackMonitorWorkflow(Workflow):
    def __init__(self, total_cycle: int = 1, *args, **kwargs) -> None:
        self.total_cycle = total_cycle
        self.counter = 0
        self.manager = InventoryManager()
        super().__init__(*args, **kwargs)
        
    @step    
    async def begin(self, ev: StartEvent | LoopEvent) \
            -> GetFeedbackEvent | StopEvent:
        print("We now return to the begin step")
        if isinstance(ev, StartEvent):
            self.sku = ev.payload
         
        if self.counter < self.total_cycle:
            await asyncio.sleep(3)
            self.counter += 1
            return GetFeedbackEvent(payload=self.sku)
        else:
            return StopEvent(result="We're done for the day.")
    
    @step
    async def get_feedback(self, ev: GetFeedbackEvent) -> OrderEvent | ClearEvent:
        print(f"Wil get the latest feedback for {ev.payload}")
        if random.random() < 0.3:
            return ClearEvent(payload='Bad')
        else:
            return OrderEvent(payload='Good')
    
    @step    
    async def order(self, ev: OrderEvent) -> LoopEvent:
        print(f"We now buy some sku with feedback {ev.payload}.")
        await self.manager.place_order(self.sku)
        return LoopEvent(payload="Start a new cycle.")
    
    @step
    async def clear(self, ev: ClearEvent) -> LoopEvent:
        print(f"We now sell some sku with feedback {ev.payload}")
        await self.manager.clear_out(self.sku)
        return LoopEvent(payload="Start a new cycle.")
```
1. `begin` 方法是我们的入口点，接受 `StartEvent` 和 `LoopEvent`。
2. `StartEvent` 是启动代码的默认事件，我们通过此事件传递 SKU。
3. `GetFeedbackEvent` 触发 `get_feedback` 方法以获取反馈信息。为了简单起见，我们使用 `random` 方法生成两个反馈，“Good”和“Bad”，然后根据反馈返回相应的 `OrderEvent` 或 `ClearEvent`。
4. 完成交易后，`LoopEvent` 重新启动 `begin` 方法以进行新一轮循环。为了简化代码，我们仅设置一个循环。
5. 在每个循环中，`begin` 方法返回一个 `GetFeedbackEvent` 以触发获取最新 SKU 反馈。如果所有循环完成，则返回 `StopEvent`。
6. 当收到 `OrderEvent` 或 `ClearEvent` 时，相应的 `step` 方法根据消息体中的情感标志执行交易，并返回 `LoopEvent` 以启动新循环。

如您所见，通过使用事件，我们可以解耦复杂的循环和分支过程，使相应的事件能够触发新的循环。

让我们使用 `draw_all_possible_flows` 工具来查看流程图是否与我们设计的业务逻辑图相匹配。

```python
draw_all_possible_flows(FeedbackMonitorWorkflow, filename="feedback_monitor_workflow.html")
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*8XEFxo90vvC28mzbSv5ysg.png)

这就全部了吗？如果只是解耦循环和分支控制，我难道不能通过一些编程技巧来实现吗？

是的，但流控制只是最表面的层次。接下来，让我们体验将 `asyncio` 与 Workflow 结合所释放的强大潜力。

### 流事件

在构建代理链时，最让人头疼的问题之一就是如何在执行过程中向用户反馈消息，帮助他们理解代码执行的进展。

在上面的代码中，我们使用 `print` 方法在控制台实时打印进度，但这种方法对于网页应用程序来说并不可行。

一个解决方案是启动一个单独的管道以实时推送消息给用户，但当多个步骤并发执行时，如何处理这个管道就成了一个挑战。

幸运的是，Workflow 的上下文直接提供了一个消息流管道，我们可以方便地将消息写入这个管道，并通过 `async for` 循环在调用端统一处理它们。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*zK1VpTOx4x0qhHyFHvE4Kw.png)

让我们修改之前的交易程序：

```python
class ProgressEvent(BaseEvent):
    ...

class FeedbackMonitorWorkflowV2(Workflow):
    def __init__(self, total_cycle: int = 1, *args, **kwargs) -> None:
        self.total_cycle = total_cycle
        self.counter = 0
        self.manager = InventoryManager()
        super().__init__(*args, **kwargs)
        
    @step    
    async def begin(self, ctx: Context,
                    ev: StartEvent | LoopEvent) \
            -> GetFeedbackEvent | StopEvent:
        ctx.write_event_to_stream(
            ProgressEvent(payload="我们现在回到开始步骤")
        )
        ...
    
    @step
    async def get_feedback(self, ctx: Context,
                            ev: GetFeedbackEvent) -> OrderEvent | ClearEvent:
        ctx.write_event_to_stream(
            ProgressEvent(payload=f"将获取 {ev.payload} 的最新反馈")
        )
        ...
    
    @step    
    async def order(self, ctx: Context,
                  ev: OrderEvent) -> LoopEvent:
        ctx.write_event_to_stream(
            ProgressEvent(payload=f"我们现在购买一些 SKU，反馈为 {ev.payload}。")
        )
        ...
    
    @step
    async def clear(self, ctx: Context,
                   ev: ClearEvent) -> LoopEvent:
        ctx.write_event_to_stream(
            ProgressEvent(payload=f"我们现在出售一些 SKU，反馈为 {ev.payload}")
        )
        ...
```
在第一步中，我们在 `step` 方法的签名中传递了一个 `Context` 类型的参数。这让 Workflow 知道将当前执行上下文传递给 `step` 方法。

然后，我们用 `ctx.write_event_to_stream` 方法替换了 `print` 方法，以实时将消息写入管道。

最后，在等待最终结果之前，我们使用 `stream_events` 方法遍历消息管道中的最新消息。

```python
from datetime import datetime

def streaming_log(message: str) -> None:
    current_time = datetime.now().strftime("%H:%M:%S")
    print(f"{current_time} {message}")

feedback_monitor_v2 = FeedbackMonitorWorkflowV2(timeout=10, verbose=False)
handler = feedback_monitor_v2.run(payload="Apple")
async for event in handler.stream_events():
    if isinstance(event , ProgressEvent):
        streaming_log(event.payload)
final_result = await handler
print("最终结果: ", final_result)
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Ntc2Dff_CUSTdAPiTSfyNA.png)

### 并发执行

正如文章开头提到的，对于 I/O 绑定的任务，我们可以使用 `asyncio` 包来实现代码的并发执行，从而大大提高运行效率。Workflow 为我们实现了这一机制，封装了 `asyncio` 执行代码，让我们专注于代码逻辑。

我们以 `FeedbackMonitor` 项目为例进行说明。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ArJQtQ-7TPoY9TW9EgnBFw.png)

这次，我们将升级项目，使得 `FeedbackMonitor` 不仅通过一个来源来判断是好还是坏，而是同时通过在线、离线和机器学习趋势预测器来判断。

首先，我们添加六个事件：`OnlineEvent`、`OnlineFeedbackEvent`、`OfflineEvent`、`OfflineFeedbackEvent`、`TrendingPredictionEvent` 和 `PredictionResultEvent`。

```python
from collections import Counter

class OnlineEvent(BaseEvent):
    ...

class OnlineFeedbackEvent(BaseEvent):
    ...

class OfflineEvent(BaseEvent):
    ...

class OfflineFeedbackEvent(BaseEvent):
    ...

class TrendingPredictionEvent(BaseEvent):
    ...

class PredictionResultEvent(BaseEvent):
    ...

class TradeEvent(BaseEvent):
    ...
```
然后，我们编写一个 `ComplexFeedbackMonitor` 类作为新的 Workflow。

```python
class ComplexFeedbackMonitor(Workflow):
    def __init__(self, *args, **kwargs):
        self.manager = InventoryManager()
        super().__init__(*args, **kwargs)
        
    @step
    async def start(self, ctx: Context, ev: StartEvent) \
            -> OnlineEvent | OfflineEvent | TrendingPredictionEvent:
        self.sku = ev.payload
        
        ctx.send_event(OnlineEvent(payload=ev.payload))
        ctx.send_event(OfflineEvent(payload=ev.payload))
        ctx.send_event(TrendingPredictionEvent(payload=ev.payload))
    
    @step    
    async def online_feedback(self, ev: OnlineEvent) -> OnlineFeedbackEvent:
        await asyncio.sleep(random.randint(1, 3))
        if random.random() < 0.3:
            return OnlineFeedbackEvent(payload='Bad')
        else:
            return OnlineFeedbackEvent(payload='Good')
    
    @step
    async def offline_feedback(self, ev: OfflineEvent) -> OfflineFeedbackEvent:
        await asyncio.sleep(random.randint(1, 3))
        if random.random() < 0.3:
            return OfflineFeedbackEvent(payload='Bad')
        else:
            return OfflineFeedbackEvent(payload='Good')
        
    @step
    async def trending_predict(self, ev: TrendingPredictionEvent) -> PredictionResultEvent:
        await asyncio.sleep(random.randint(1, 3))
        if random.random() < 0.3:
            return PredictionResultEvent(payload='Bad')
        else:
            return PredictionResultEvent(payload='Good')
        
    @step
    async def trading_decision(self, ctx: Context,
                               ev: OnlineFeedbackEvent | OfflineFeedbackEvent | PredictionResultEvent)\
        -> TradeEvent:
        results = ctx.collect_events(ev, 
            [OnlineFeedbackEvent, OfflineFeedbackEvent, PredictionResultEvent])
        if results is not None:
            voting = dict(Counter([ev.payload for ev in results]))
            print(voting)
            feedback = max(voting, key=voting.get)
            return TradeEvent(payload=feedback)
    
    @step        
    async def trade(self, ev: TradeEvent) -> StopEvent:
        feedback = ev.payload
        match feedback:
            case 'Goode':
                await self.manager.place_order(self.sku)
            case 'Bad':
                await self.manager.clear_out(self.sku)
            case _:
                print("Do nothing")
        return StopEvent(result='We are done for the day.')
```
在 `start` 方法中，我们使用 `ctx.send_event` 同时发送 `OnlineEvent`、`OfflineEvent` 和 `TrendingPredictionEvent`。由于 Workflow 根据 `step` 方法的类型注解来确定抛出的消息，因此我们仍然需要标记返回消息的类型。

接下来，我们实现 `online_feedback`、`offline_feedback` 和 `trending_predict` 方法，以获取交易信号并返回相应的事件。

我们仍然使用 `random` 方法来模拟客户反馈分析。

由于来自不同来源的内容需要不同的解析时间，我们希望在所有消息返回之前等待。在这一点上，我们可以在 `trading_decision` 方法中使用 `ctx.collect_events` 方法。

每当新的反馈事件返回时，`trading_events` 方法就会执行一次。

但是，`ctx.collect_events` 方法将我们需要等待的所有事件作为参数传递，并且其返回值在所有反馈事件返回之前保持为空。此时，返回值是三个反馈事件的列表。

我们可以使用 `Counter` 方法来计算“Good”和“Bad”出现的次数，然后取最多票的标记来做出交易决策。

最后，让我们使用 `draw_all_possible_flows` 工具来看看我们新设计的工作流有多酷：

```python
draw_all_possible_flows(ComplexFeedbackMonitor, filename='complex_feedback_monitor.html')
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*036tCy5dAKG_uBdmg7EJbw.png)

接下来，让我们执行这个工作流并查看结果。

```python
feedback_monitor = ComplexFeedbackMonitor(timeout=20, verbose=True)
result = await feedback_monitor.run(payload='Apple')
print(result)
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*DQWCaN64YX65GhSeNK3SEQ.png)

我们可以观察到，从不同来源获取反馈的三个方法是同时触发的，但返回时间不同。

前两个返回的事件可以触发 `trading_decision` 方法，但不能继续触发 `TradeEvent`。只有在所有三个事件返回并计算出最终交易决策后，才会触发 `TradeEvent`。

正如你所看到的，借助 Workflow 的力量，我们确实可以使我们的代码架构既清晰又高效。

但不要过于乐观，因为在实践中经过一段时间后，我认为仍然存在一些不足之处。

## 讨论缺陷的时间

如果你查看我们之前的代码，你会发现我们所有的代码逻辑都写在同一个工作流中，这对于简单的应用程序来说没问题，但对于复杂的现实应用程序来说却是灾难。

理想情况下，我们应该将不同的逻辑拆分成多个工作流，以保持“单一责任”原则的纯粹性。满足这一要求的官方解决方案是 [嵌套工作流](https://docs.llamaindex.ai/en/stable/understanding/workflows/nested/):

### 嵌套工作流

假设我们想将 `FeedbackMonitor` 中的交易订单逻辑拆分为一个独立的工作流。当我们需要下订单时，我们应该如何调用它？

官方解决方案是使用嵌套工作流，即在工作流 A 的 `step` 方法中将另一个工作流 B 作为参数传递。然后，在工作流 A 实例化后，添加工作流 B 的实例。如下所示的代码：

```python
class OrderStation(Workflow):
    def __init__(self, *args, **kwargs):
        self.manager = InventoryManager()
        super().__init__(*args, **kwargs)
        
    @step
    async def trade(self, ev: StartEvent) -> StopEvent:
        print("We are now in a new workflow named OrderStation")
        feedback = ev.feedback
        match feedback:
            case 'Good':
                await self.manager.place_order(ev.sku)
            case 'Bad':
                await self.manager.clear_out(ev.sku)
        return StopEvent(result="Done!")
    
    
class ComplexFeedbackMonitorV2(ComplexFeedbackMonitor):
    @step
    async def trade(self, ev: TradeEvent, order_station: OrderStation) -> StopEvent:
        feedback = ev.payload
        await order_station.run(feedback=feedback, sku=self.sku)
        return StopEvent(result='We are done for the day.')
```

```python
feedback_monitor_v2 = ComplexFeedbackMonitorV2(timeout=20, verbose=False)
feedback_monitor_v2.add_workflows(
    order_station=OrderStation(timeout=10, verbose=True)
)
result = await feedback_monitor_v2.run(payload='Apple')
print(result)
```
等等，如果你有 Java 开发经验，看到这段代码会不会感到惊讶：这不是依赖注入吗？

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*BtcEH_BfkweCUS1B56bSwA.png)

这确实与依赖注入相似，但不同之处在于，我们仍然需要在实例初始化后显式添加具体的工作流实例，因此仍然存在耦合，这是第一个问题。

我在编码过程中发现的另一个问题是，对于嵌套工作流，我只能通过 `run` 方法调用它们，而不能从外部工作流调用嵌套工作流中的相应 `step` 方法。

因此，这并不是工作流之间通信的好解决方案。

### 工作流之间的通信

那么，是否有办法真正实现工作流之间的通信？我搜索了API文档，没有找到官方解决方案，我注意到这个[问题](https://github.com/run-llama/llama_index/issues/15466)也没有得到回答。因此，我决定自己尝试一下，看看能否解决它。

在再次审查源代码后，我认为`ctx.send_event`方法有一些潜力，所以我首先想到的是，是否可以通过在两个工作流之间共享相同的上下文来解决这个问题？

我注意到实例化`Context`需要传入一个`workflow`实例，并且设置工作流自己的上下文可以通过在`run`方法中传入来完成。

因此，代码如下，保持两个工作流不变，只有`OrderStation`中的`step`方法不再接受`StartEvent`，而是接受特定的`TradeEventV2`。

```python
class TradeEventV2(Event):
    feedback: str
    sku: str
    
class OrderStation(Workflow):
    def __init__(self, *args, **kwargs):
        self.manager = InventoryManager()
        super().__init__(*args, **kwargs)
        
    @step
    async def trade(self, ev: TradeEventV2) -> StopEvent:
        print("We are now in a new workflow named OrderStation")
        feedback = ev.feedback
        match feedback:
            case 'Good':
                await self.manager.place_order(ev.sku)
            case 'Bad':
                await self.manager.clear_out(ev.sku)
        return StopEvent(result="Done!")
    
class ComplexFeedbackMonitorV3(ComplexFeedbackMonitor):
    @step
    async def trade(self, ctx: Context, ev: TradeEvent) -> StopEvent | TradeEventV2:
        feedback = ev.payload
        ctx.send_event(
            TradeEventV2(feedback=feedback, sku=self.sku)
        )
        return StopEvent(result='We are done for the day.')
```
然后我使用`OrderStation`创建一个上下文实例，并在运行方法执行期间将其传递给`FeedbackMonitor`实例，果然，它抛出了一个错误：

```python
feedback_monitor_v3 = ComplexFeedbackMonitorV3(timeout=20, verbose=False)
result = await feedback_monitor_v3.run(payload='Apple')
print(result)
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*AAYZr5ET8h_Tp1A1.png)

似乎方法签名验证存在问题，让我们尝试关闭验证：

```python
feedback_monitor_v3 = ComplexFeedbackMonitorV3(timeout=20, verbose=False, disable_validation=True)
order_station = OrderStation(timeout=10, verbose=True)
result = await feedback_monitor_v3.run(ctx=Context(workflow=order_station),
                           payload='Apple')
print(result)
```
仍然没有成功，看来这种方式行不通。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ls_n0EjelNO8IMUtBY2_YQ.png)

### Unbound 语法

然后，我注意到文档提到了一种 [Unbound 语法](https://docs.llamaindex.ai/en/stable/understanding/workflows/unbound_functions/)，似乎能够将每个步骤的逻辑与工作流解耦。示例代码如下：

```python
class TestWorkflow(Workflow):
    ...

@step(workflow=TestWorkflow)
def some_step(ev: StartEvent) -> StopEvent:
    return StopEvent()
```
虽然我们仍然只能在一个工作流内运行，但这让我感受到模块之间通信的可行性。

由于文章较长，我在这里不使用代码进行解释，让我给你展示一个如何使用 Unbound 语法进行模块通信的图示：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*_BFoZAvsPtHONwozRlWAFA.png)

如图所示：首先，我们可以定义一个 `Application` 类作为工作流管道，同时定义所需的事件。

然后，每个项目团队可以编写自己的业务逻辑代码，并使用不同的 `step` 方法来监听和发送外部消息。

最后，我们可以在 fastapi API 中调用 `Application` 的 `run` 方法，调动各个模块完成任务。

通过这种方式，业务逻辑可以拆分为不同的模块进行开发，然后可以使用事件调用不同的 `step` 方法。

这确实达到了逻辑解耦的目的。然而，由于这种方法仅通过 `add_step` 方法在 `step` 装饰器中注册每个步骤到工作流中，它仍然没有实现工作流之间的真正通信。

## 摘要

LlamaIndex 的 Workflow 新功能使 RAG、LLM 生成和 I/O 调用的并行执行变得非常简单，而事件驱动架构也使程序能够与复杂的逻辑控制解耦。

在今天的文章中，我通过一个 FeedbackMonitor 项目展示了 Workflow 的几个特性。

在项目实践中，我们也发现 Workflow 在模块之间的通信方面仍然存在不足，并讨论了包括嵌套工作流和无绑定语法在内的不同解决方案。

最后，随着像 Langchain 和 AutoGen 这样的代理框架开始提出自己的事件驱动架构，我相信 Workflow 正在走上正确的道路，并将看到长期的发展。让我们保持关注。

喜欢这篇文章吗？ [**立即订阅，获取更多前沿数据科学技巧，直接发送到您的邮箱！**](https://www.dataleadsfuture.com/#/portal/signup) 欢迎您的反馈和问题 — 让我们在下面的评论中讨论！

本文最初发布于 [Data Leads Future](https://www.dataleadsfuture.com/deep-diving-into-llamaindex-workflow-event-driven-llm-architecture/#/portal/signup)。

