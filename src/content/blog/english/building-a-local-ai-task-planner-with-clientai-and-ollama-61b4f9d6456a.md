---
title: "Building a Local AI Task Planner with ClientAI and Ollama"
meta_title: "Building a Local AI Task Planner with ClientAI and Ollama"
description: "This tutorial outlines the creation of a local AI task planner using ClientAI and Ollama. The planner can break down goals into actionable tasks, create realistic timelines, and manage resources. It involves setting up an environment, building a TaskPlanner class for AI interaction, and developing tools for validating timelines and formatting plans. The user interface allows for real-time plan generation based on user-defined goals. Future improvements include dependency tracking, cost calculations, and progress tracking. The tutorial emphasizes the practical application of AI in task management."
date: 2024-12-19T21:26:53Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*j3Y6jmW-Nz8jwL7v_awg2g.png"
categories: ["Programming", "Machine Learning", "Data Science"]
author: "Rifx.Online"
tags: ["ClientAI", "Ollama", "TaskPlanner", "timelines", "resources"]
draft: False

---






In this tutorial, we’ll build an AI\-powered task planner using [ClientAI](https://igorbenav.github.io/clientai/?utm_source=medium&utm_medium=article&utm_campaign=launch) and Ollama. Our planner will break down goals into actionable tasks, create realistic timelines, and manage resources — all of this running in your own machine.

Our task planner will be capable of:

* Breaking down goals into specific, actionable tasks
* Creating realistic timelines with error handling
* Managing and allocating resources effectively
* Providing structured, formatted plans

For ClientAI’s docs [see here](https://igorbenav.github.io/clientai/?utm_source=medium&utm_medium=article&utm_campaign=launch) and for Github Repo, [here](https://github.com/igorbenav/clientai).


## Setting Up Our Environment

First, create a new directory for your project:


```python
mkdir local_task_planner
cd local_task_planner
```
Install ClientAI with Ollama support:


```python
pip install clientai[ollama]
```
Make sure you have Ollama installed on your system. You can get it from [Ollama’s website](https://ollama.com).

Create our main Python file:


```python
touch task_planner.py
```
Let’s start with our core imports:


```python
from datetime import datetime, timedelta
from typing import Dict, List
import logging

from clientai import ClientAI
from clientai.agent import create_agent, tool
from clientai.ollama import OllamaManager

logger = logging.getLogger(__name__)Each component plays a crucial role:
```
* **datetime:** Helps us manage task timelines and scheduling
* **ClientAI:** Provides our AI framework
* **OllamaManager:** Manages our local AI model
* Various utility modules for type hints and logging


## Building the Task Planner Core

First, let’s create our TaskPlanner class that will manage the AI interaction:


```python
class TaskPlanner:
    """A local task planning system using Ollama."""

    def __init__(self):
        """Initialize the task planner with Ollama."""
        self.manager = OllamaManager()
        self.client = None
        self.planner = None

    def start(self):
        """Start the Ollama server and initialize the client."""
        self.manager.start()
        self.client = ClientAI("ollama", host="http://localhost:11434")

        self.planner = create_agent(
            client=self.client,
            role="task planner",
            system_prompt="""You are a practical task planner. Break down goals into
            specific, actionable tasks with realistic time estimates and resource needs.
            Use the tools provided to validate timelines and format plans properly.""",
            model="llama3",
            step="think",
            tools=[validate_timeline, format_plan],
            tool_confidence=0.8,
            stream=True,
        )
```
This class serves as our foundation. It manages the Ollama server lifecycle, creates and configures our AI client and sets up our planning agent with specific capabilities.


## Creating Our Planning Tools

Now let’s build the tools our AI will use. First, the timeline validator:


```python
@tool(name="validate_timeline")
def validate_timeline(tasks: Dict[str, int]) -> Dict[str, dict]:
    """
    Validate time estimates and create a realistic timeline.

    Args:
        tasks: Dictionary of task names and estimated hours

    Returns:
        Dictionary with start dates and deadlines
    """
    try:
        current_date = datetime.now()
        timeline = {}
        accumulated_hours = 0

        for task, hours in tasks.items():
            try:
                hours_int = int(float(str(hours)))

                if hours_int <= 0:
                    logger.warning(f"Skipping task {task}: Invalid hours value {hours}")
                    continue

                days_needed = hours_int / 6
                start_date = current_date + timedelta(hours=accumulated_hours)
                end_date = start_date + timedelta(days=days_needed)

                timeline[task] = {
                    "start": start_date.strftime("%Y-%m-%d"),
                    "end": end_date.strftime("%Y-%m-%d"),
                    "hours": hours_int,
                }

                accumulated_hours += hours_int

            except (ValueError, TypeError) as e:
                logger.warning(f"Skipping task {task}: Invalid hours value {hours} - {e}")
                continue

        return timeline
    except Exception as e:
        logger.error(f"Error validating timeline: {str(e)}")
        return {}
```
This validator converts time estimates to working days, handles invalid inputs gracefully, creates realistic sequential scheduling and provides detailed logging for debugging.

Next, let’s create our plan formatter:


```python
@tool(name="format_plan")
def format_plan(
    tasks: List[str],
    timeline: Dict[str, dict],
    resources: List[str]
) -> str:
    """
    Format the plan in a clear, structured way.

    Args:
        tasks: List of tasks
        timeline: Timeline from validate_timeline
        resources: List of required resources

    Returns:
        Formatted plan as a string
    """
    try:
        plan = "== Project Plan ==\n\n"

        plan += "Tasks and Timeline:\n"
        for i, task in enumerate(tasks, 1):
            if task in timeline:
                t = timeline[task]
                plan += f"\n{i}. {task}\n"
                plan += f"   Start: {t['start']}\n"
                plan += f"   End: {t['end']}\n"
                plan += f"   Estimated Hours: {t['hours']}\n"

        plan += "\nRequired Resources:\n"
        for resource in resources:
            plan += f"- {resource}\n"

        return plan
    except Exception as e:
        logger.error(f"Error formatting plan: {str(e)}")
        return "Error: Unable to format plan"
```
Here we want to create a consistent, readable output with proper task numbering and organized timeline.


## Building the Interface

Let’s create a user\-friendly interface for our planner:


```python
def get_plan(self, goal: str) -> str:
    """
    Generate a plan for the given goal.

    Args:
        goal: The goal to plan for

    Returns:
        A formatted plan string
    """
    if not self.planner:
        raise RuntimeError("Planner not initialized. Call start() first.")

    return self.planner.run(goal)

def main():
    planner = TaskPlanner()

    try:
        print("Task Planner (Local AI)")
        print("Enter your goal, and I'll create a practical, timeline-based plan.")
        print("Type 'quit' to exit.")

        planner.start()

        while True:
            print("\n" + "=" * 50 + "\n")
            goal = input("Enter your goal: ")

            if goal.lower() == "quit":
                break

            try:
                plan = planner.get_plan(goal)
                print("\nYour Plan:\n")
                for chunk in plan:
                    print(chunk, end="", flush=True)
            except Exception as e:
                print(f"Error: {str(e)}")

    finally:
        planner.stop()

if __name__ == "__main__":
    main()
```
Our interface provides:

* Clear user instructions
* Real\-time plan generation with streaming
* Proper error handling
* Clean shutdown management


## Example Usage

Here’s what you’ll see when you run the planner:


```python
Task Planner (Local AI)
Enter your goal, and I'll create a practical, timeline-based plan.
Type 'quit' to exit.

==================================================

Enter your goal: Create a personal portfolio website

Your Plan:

== Project Plan ==

Tasks and Timeline:
1. Requirements Analysis and Planning
   Start: 2024-12-08
   End: 2024-12-09
   Estimated Hours: 6

2. Design and Wireframing
   Start: 2024-12-09
   End: 2024-12-11
   Estimated Hours: 12

3. Content Creation
   Start: 2024-12-11
   End: 2024-12-12
   Estimated Hours: 8

4. Development
   Start: 2024-12-12
   End: 2024-12-15
   Estimated Hours: 20

Required Resources:
- Design software (e.g., Figma)
- Text editor or IDE
- Web hosting service
- Version control system
```

## Future Improvements

Consider these enhancements for your own task planner:

* Add dependency tracking between tasks
* Include cost calculations for resources
* Save plans to files or project management tools
* Track progress against the original plan
* Add validation for resource availability
* Implement parallel task scheduling
* Add support for recurring tasks
* Include priority levels for tasks

To see more about ClientAI, go to the [docs](https://igorbenav.github.io/clientai/?utm_source=medium&utm_medium=article&utm_campaign=launch).


## Connect With Me

If you have any questions about this tutorial or want to share your improvements to the task planner, feel free to reach out:

* **GitHub:** [igorbenav](https://github.com/igorbenav)
* **X/Twitter:** [@igorbenav](https://x.com/igorbenav)
* LinkedIn: [Igor](https://www.linkedin.com/in/igor-magalhaes-r/)

