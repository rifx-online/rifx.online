---
title: "Mastering CrewAI: Chapter 2— Flows"
meta_title: "Mastering CrewAI: Chapter 2— Flows"
description: "Chapter 2 of Mastering CrewAI discusses event-driven AI workflows known as Flows. Flows enable task orchestration and state management within AI workflows by chaining multiple Crews and tasks. The chapter illustrates how to implement workflows with conditional logic, loops, and branching. It provides a detailed example using a `PoemFlow` class to generate and save a poem based on a random sentence count, demonstrating the use of decorators like `@start` and `@listen`. Additionally, it covers advanced routing techniques with `or_`, `and_`, and `@router` decorators to manage workflow execution based on task outputs."
date: 2025-01-05T02:44:52Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*-_p5z5lewMvVU2xqbn61Cg.jpeg"
categories: ["Programming", "Programming/Scripting", "Generative AI"]
author: "Rifx.Online"
tags: ["Flows", "PoemFlow", "decorators", "routing", "orchestration"]
draft: False

---





### Event\-Driven AI Workflows



Flows allow us to orchestrate tasks and manage Crews.

Previous Chapter:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*NB6GaWaEdwMo49fssWsovw.png)

* We can chain together multiple Crews and tasks to construct AI workflows.
* Flows share state between different tasks within a workflow.
* It is event\-driven, tasks can trigger subsequent tasks based on specific events.
* We can implement conditional logic, loops, and branching within workflows.


```python
crewai create flow flow-example
```
It will create a new template project for us. Inside the `main.py` file, we have the following code.


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
        print("Generating sentence count")
        self.state.sentence_count = randint(1, 5)

    @listen(generate_sentence_count)
    def generate_poem(self):
        print("Generating poem")
        result = (
            PoemCrew()
            .crew()
            .kickoff(inputs={"sentence_count": self.state.sentence_count})
        )

        print("Poem generated", result.raw)
        self.state.poem = result.raw

    @listen(generate_poem)
    def save_poem(self):
        print("Saving poem")
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
The `PoemState` class inherits from `BaseModel` and is used to manage the workflow's state. It has:

* `sentence_count`: Tracks the number of sentences to generate.
* `poem`: Holds the generated poem as a string.


```python
class PoemState(BaseModel):
    sentence_count: int = 1
    poem: str = ""
```
The `PoemFlow` class inherits from `Flow` and implements the workflow logic. Each method represents a step in the workflow.


```python
class PoemFlow(Flow[PoemState]):

    @start()
    def generate_sentence_count(self):
        print("Generating sentence count")
        self.state.sentence_count = randint(1, 5)
```
`generate_sentence_count` is the entry point for the workflow, marked with the `@start` decorator.

It just updates the workflow state `self.state.sentence_count`.

`generate_poem` is triggered after `generate_sentence_count` completes, using the `@listen(generate_sentence_count)` decorator.

Its job is to call the `PoemCrew` to generate a poem with the specified number of sentences in the state.

The result (`result.raw`) is stored in the state (`self.state.poem`).


```python
class PoemFlow(Flow[PoemState]):
    ...

    @listen(generate_sentence_count)
    def generate_poem(self):
        print("Generating poem")
        result = (
            PoemCrew()
            .crew()
            .kickoff(inputs={"sentence_count": self.state.sentence_count})
        )

        print("Poem generated", result.raw)
        self.state.poem = result.raw
```
I will not go into the details of `PoemCrew` since we already covered Crews in the previous chapter. It is simply a Crew, and `generate_poem` is used to initiate it.

`save_poem` is triggered after the poem is generated `@listen(generate_poem)`

Let’s run it.

First, put this code into *flow\_example/src/flow\_example/crews/poem\_crew/poem\_crew.py*


```python
from dotenv import load_dotenv
load_dotenv()
```
Then:


```python
python src/flow_example/main.py
```

```python
Generating sentence count
Generating poem
## Agent: CrewAI Poem Writer
### Task: Write a poem about how CrewAI is awesome. Ensure the poem is engaging and adheres to the specified sentence count of 1.



## Agent: CrewAI Poem Writer
### Final Answer: 
In a whirlwind of bytes and brilliance, CrewAI dances through data, spinning solutions with a digital grace that leaves us all in awe.


Poem generated In a whirlwind of bytes and brilliance, CrewAI dances through data, spinning solutions with a digital grace that leaves us all in awe.
Saving poem
```
It created a `poem.txt` file and wrote the poem to it.


```python
In a whirlwind of bytes and brilliance, CrewAI dances through data, spinning solutions with a digital grace that leaves us all in awe.
```
When we run the Python code, as shown above, it executes the `kickoff` method.

We could also run the `plot` method, which generates an HTML file to display the flow created by the code.


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
When we run this code (calling only the `plot` function), we get the following output:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*8B_2Q1NOSp-GtHsc85pkBQ.png)

In essence, what we have done here is control the flow and procedure of a single Crew, `PoemCrew`. We created a class (`PoemState`) to manage the state data, established an entry point for our workflow, allowed the Crew to perform its task, and finally set the concluding stage before wrapping up.

It is also possible to do more; we can control the flow using `or_`, `and_`, and `@router`.

`or_` function enables a listener method to be triggered when *any* specified method emits an output.


```python
from crewai.flow.flow import Flow, listen, or_, start

class ExampleFlow(Flow):
    @start()
    def method_a(self):
        return "Output A"

    @start()
    def method_b(self):
        return "Output B"

    @listen(or_(method_a, method_b))
    def listener_method(self, output):
        print(f"Triggered by: {output}")
```
If either `method_a` or `method_b` completes, `listener_method` will be triggered.

`and_` function enables a listener method to be triggered only when *all* the specified methods emit an output.


```python
from crewai.flow.flow import Flow, listen, and_, start

class ExampleFlow(Flow):
    @start()
    def method_x(self):
        return "Output X"

    @start()
    def method_y(self):
        return "Output Y"

    @listen(and_(method_x, method_y))
    def listener_method(self, outputs):
        print(f"Triggered after: {outputs}")
```
`listener_method` is triggered only after both `method_x` and `method_y` have emitted their outputs.

`@router()` decorator allows conditional routing within a workflow based on the output of a method.


```python
import random
from crewai.flow.flow import Flow, listen, router, start
from pydantic import BaseModel

class ExampleState(BaseModel):
    success_flag: bool = False

class RouterFlow(Flow[ExampleState]):

    @start()
    def start_method(self):
        print("Starting the structured flow")
        random_boolean = random.choice([True, False])
        self.state.success_flag = random_boolean

    @router(start_method)
    def second_method(self):
        if self.state.success_flag:
            return "success"
        else:
            return "failed"

    @listen("success")
    def third_method(self):
        print("Third method running")

    @listen("failed")
    def fourth_method(self):
        print("Fourth method running")


flow = RouterFlow()
flow.kickoff()
```
`second_method` routes the flow to either `"success"` or `"failed"` paths based on the `success_flag` state. Depending on the route, either `third_method` (for success) or `fourth_method` (for failure) is executed, ensuring the workflow adapts to the state dynamically.


### Read More


### Sources

<https://docs.crewai.com/concepts/flows>


