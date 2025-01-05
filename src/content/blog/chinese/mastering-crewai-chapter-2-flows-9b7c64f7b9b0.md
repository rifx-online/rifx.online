---
title: "掌握CrewAI秘籍 2：如何用“Flows”打造智能化工作流？惊艳实用技巧大揭秘！"
meta_title: "掌握CrewAI秘籍 2：如何用“Flows”打造智能化工作流？惊艳实用技巧大揭秘！"
description: "本文介绍了事件驱动的AI工作流的构建与管理，重点在于如何通过工作流协调任务和团队。通过示例代码，展示了如何使用`PoemFlow`类生成诗歌并保存，同时介绍了工作流中的状态管理、条件逻辑和事件监听机制。文章还提到使用`or_`和`and_`等函数控制流程，以及`@router`装饰器实现条件路由，增强了工作流的灵活性和适应性。"
date: 2025-01-05T02:44:52Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*-_p5z5lewMvVU2xqbn61Cg.jpeg"
categories: ["Programming", "Programming/Scripting", "Generative AI"]
author: "Rifx.Online"
tags: ["Flows", "PoemFlow", "decorators", "routing", "orchestration"]
draft: False

---



### 事件驱动的 AI 工作流



工作流允许我们协调任务并管理团队。

上一章：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*NB6GaWaEdwMo49fssWsovw.png)

* 我们可以将多个团队和任务串联在一起，构建 AI 工作流。
* 工作流在不同任务之间共享状态。
* 它是事件驱动的，任务可以根据特定事件触发后续任务。
* 我们可以在工作流中实现条件逻辑、循环和分支。

```python
crewai create flow flow-example
```
这将为我们创建一个新的模板项目。在 `main.py` 文件中，我们有以下代码。

```python
#!/usr/bin/env python
from random import randint

from pydantic import BaseModel

from crewai.flow.flow import Flow, listen, start

from .crews.poem_crew.poem_crew import PoemCrew


class PoemState(BaseModel):
    sentence_count: int = 1
    poem: str = ""


class PoemFlow(Flow[PoemState]):

    @start()
    def generate_sentence_count(self):
        print("生成句子数量")
        self.state.sentence_count = randint(1, 5)

    @listen(generate_sentence_count)
    def generate_poem(self):
        print("生成诗歌")
        result = (
            PoemCrew()
            .crew()
            .kickoff(inputs={"sentence_count": self.state.sentence_count})
        )

        print("诗歌生成", result.raw)
        self.state.poem = result.raw

    @listen(generate_poem)
    def save_poem(self):
        print("保存诗歌")
        with open("poem.txt", "w") as f:
            f.write(self.state.poem)


def kickoff():
    poem_flow = PoemFlow()
    poem_flow.kickoff()


def plot():
    poem_flow = PoemFlow()
    poem_flow.plot()


if __name__ == "__main__":
    kickoff()
```
`PoemState` 类继承自 `BaseModel`，用于管理工作流的状态。它包含：

* `sentence_count`: 跟踪要生成的句子数量。
* `poem`: 以字符串形式保存生成的诗歌。

```python
class PoemState(BaseModel):
    sentence_count: int = 1
    poem: str = ""
```
`PoemFlow` 类继承自 `Flow` 并实现工作流逻辑。每个方法代表工作流中的一个步骤。

```python
class PoemFlow(Flow[PoemState]):

    @start()
    def generate_sentence_count(self):
        print("生成句子数量")
        self.state.sentence_count = randint(1, 5)
```
`generate_sentence_count` 是工作流的入口点，用 `@start` 装饰器标记。

它只是更新工作流状态 `self.state.sentence_count`。

`generate_poem` 在 `generate_sentence_count` 完成后被触发，使用 `@listen(generate_sentence_count)` 装饰器。

它的工作是调用 `PoemCrew` 以生成指定句子数量的诗歌。

结果 (`result.raw`) 存储在状态中 (`self.state.poem`)。

```python
class PoemFlow(Flow[PoemState]):
    ...

    @listen(generate_sentence_count)
    def generate_poem(self):
        print("生成诗歌")
        result = (
            PoemCrew()
            .crew()
            .kickoff(inputs={"sentence_count": self.state.sentence_count})
        )

        print("诗歌生成", result.raw)
        self.state.poem = result.raw
```
我不会详细介绍 `PoemCrew`，因为我们在上一章中已经讨论过团队。它只是一个团队，而 `generate_poem` 用于启动它。

`save_poem` 在诗歌生成后被触发 `@listen(generate_poem)`

让我们运行它。

首先，将此代码放入 *flow_example/src/flow_example/crews/poem_crew/poem_crew.py*

```python
from dotenv import load_dotenv
load_dotenv()
```
然后：

```python
python src/flow_example/main.py
```

```python
生成句子数量
生成诗歌
## Agent: CrewAI Poem Writer
### Task: 写一首关于 CrewAI 多么棒的诗。确保诗歌引人入胜，并遵循指定的句子数量为 1。



## Agent: CrewAI Poem Writer
### Final Answer: 
在字节与光辉的旋风中，CrewAI 在数据中舞动，以数字优雅编织解决方案，让我们都感到惊叹。


诗歌生成 在字节与光辉的旋风中，CrewAI 在数据中舞动，以数字优雅编织解决方案，让我们都感到惊叹。
保存诗歌
```
它创建了一个 `poem.txt` 文件，并将诗歌写入其中。

```python
在字节与光辉的旋风中，CrewAI 在数据中舞动，以数字优雅编织解决方案，让我们都感到惊叹。
```
当我们运行上面的 Python 代码时，它执行了 `kickoff` 方法。

我们还可以运行 `plot` 方法，它生成一个 HTML 文件以显示代码创建的工作流。

```python
def kickoff():
    poem_flow = PoemFlow()
    poem_flow.kickoff()


def plot():
    poem_flow = PoemFlow()
    poem_flow.plot()


if __name__ == "__main__":
    #kickoff()
    plot()
```
当我们运行此代码（仅调用 `plot` 函数）时，我们得到以下输出：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*8B_2Q1NOSp-GtHsc85pkBQ.png)

本质上，我们在这里控制了单个团队 `PoemCrew` 的流程和过程。我们创建了一个类 (`PoemState`) 来管理状态数据，建立了工作流的入口点，允许团队执行其任务，最后设置了结束阶段。

我们还可以做更多；我们可以使用 `or_`、`and_` 和 `@router` 来控制流程。

`or_` 函数使得一个监听方法在 *任何* 指定的方法发出输出时被触发。

```python
from crewai.flow.flow import Flow, listen, or_, start

class ExampleFlow(Flow):
    @start()
    def method_a(self):
        return "输出 A"

    @start()
    def method_b(self):
        return "输出 B"

    @listen(or_(method_a, method_b))
    def listener_method(self, output):
        print(f"被触发: {output}")
```
如果 `method_a` 或 `method_b` 完成，`listener_method` 将被触发。

`and_` 函数使得一个监听方法仅在 *所有* 指定的方法发出输出时被触发。

```python
from crewai.flow.flow import Flow, listen, and_, start

class ExampleFlow(Flow):
    @start()
    def method_x(self):
        return "输出 X"

    @start()
    def method_y(self):
        return "输出 Y"

    @listen(and_(method_x, method_y))
    def listener_method(self, outputs):
        print(f"被触发后: {outputs}")
```
`listener_method` 仅在 `method_x` 和 `method_y` 都发出输出后被触发。

`@router()` 装饰器允许在工作流中基于方法的输出进行条件路由。

```python
import random
from crewai.flow.flow import Flow, listen, router, start
from pydantic import BaseModel

class ExampleState(BaseModel):
    success_flag: bool = False

class RouterFlow(Flow[ExampleState]):

    @start()
    def start_method(self):
        print("开始结构化流程")
        random_boolean = random.choice([True, False])
        self.state.success_flag = random_boolean

    @router(start_method)
    def second_method(self):
        if self.state.success_flag:
            return "成功"
        else:
            return "失败"

    @listen("成功")
    def third_method(self):
        print("第三个方法运行中")

    @listen("失败")
    def fourth_method(self):
        print("第四个方法运行中")


flow = RouterFlow()
flow.kickoff()
```
`second_method` 根据 `success_flag` 状态将流程路由到 `"成功"` 或 `"失败"` 路径。根据路由，执行 `third_method`（成功）或 `fourth_method`（失败），确保工作流动态地适应状态。

### 了解更多

### 来源

<https://docs.crewai.com/concepts/flows>

