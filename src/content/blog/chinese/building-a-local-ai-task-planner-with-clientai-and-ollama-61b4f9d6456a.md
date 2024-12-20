---
title: "利用 ClientAI 和 Ollama 构建本地人工智能任务规划器"
meta_title: "利用 ClientAI 和 Ollama 构建本地人工智能任务规划器"
description: "本教程介绍了如何使用ClientAI和Ollama构建一个本地AI驱动的任务规划器。该规划器能够将目标分解为可执行任务，创建现实的时间表，并有效管理资源。用户可以通过输入目标生成结构化的计划，系统提供错误处理和日志记录功能。未来的改进建议包括任务依赖关系跟踪、资源成本计算和进度跟踪等功能。"
date: 2024-12-19T21:26:53Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*j3Y6jmW-Nz8jwL7v_awg2g.png"
categories: ["Programming", "Machine Learning", "Data Science"]
author: "Rifx.Online"
tags: ["ClientAI", "Ollama", "TaskPlanner", "timelines", "resources"]
draft: False

---





在本教程中，我们将使用 [ClientAI](https://igorbenav.github.io/clientai/?utm_source=medium&utm_medium=article&utm_campaign=launch) 和 Ollama 构建一个 AI 驱动的任务规划器。我们的规划器将把目标分解为可执行的任务，创建现实的时间表，并管理资源——所有这些都在您的机器上运行。

我们的任务规划器将能够：

* 将目标分解为具体的、可执行的任务
* 创建具有错误处理的现实时间表
* 有效管理和分配资源
* 提供结构化、格式化的计划

有关 ClientAI 的文档 [请见这里](https://igorbenav.github.io/clientai/?utm_source=medium&utm_medium=article&utm_campaign=launch)，有关 GitHub 仓库 [请见这里](https://github.com/igorbenav/clientai)。

## 设置我们的环境

首先，为您的项目创建一个新目录：

```python
mkdir local_task_planner
cd local_task_planner
```
安装支持Ollama的ClientAI：

```python
pip install clientai[ollama]
```
确保您在系统上安装了Ollama。您可以从[Ollama的网站](https://ollama.com)获取它。

创建我们的主Python文件：

```python
touch task_planner.py
```
让我们从核心导入开始：

```python
from datetime import datetime, timedelta
from typing import Dict, List
import logging

from clientai import ClientAI
from clientai.agent import create_agent, tool
from clientai.ollama import OllamaManager

logger = logging.getLogger(__name__)Each component plays a crucial role:
```
* **datetime:** 帮助我们管理任务时间线和调度
* **ClientAI:** 提供我们的AI框架
* **OllamaManager:** 管理我们的本地AI模型
* 各种实用模块用于类型提示和日志记录

## 构建任务规划器核心

首先，让我们创建我们的 TaskPlanner 类来管理 AI 交互：

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
这个类作为我们的基础。它管理 Ollama 服务器的生命周期，创建并配置我们的 AI 客户端，并设置具有特定功能的规划代理。

## 创建我们的规划工具

现在让我们构建我们的 AI 将使用的工具。首先，时间线验证器：

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
这个验证器将时间估算转换为工作日，优雅地处理无效输入，创建现实的顺序调度，并提供详细的日志以便调试。

接下来，让我们创建我们的计划格式化器：

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
        plan = "== 项目计划 ==\n\n"

        plan += "任务和时间线:\n"
        for i, task in enumerate(tasks, 1):
            if task in timeline:
                t = timeline[task]
                plan += f"\n{i}. {task}\n"
                plan += f"   开始: {t['start']}\n"
                plan += f"   结束: {t['end']}\n"
                plan += f"   预计工时: {t['hours']}\n"

        plan += "\n所需资源:\n"
        for resource in resources:
            plan += f"- {resource}\n"

        return plan
    except Exception as e:
        logger.error(f"Error formatting plan: {str(e)}")
        return "错误: 无法格式化计划"
```
在这里，我们希望创建一个一致、易读的输出，具有适当的任务编号和组织良好的时间线。

## 构建接口

让我们为我们的计划工具创建一个用户友好的接口：

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
我们的接口提供：

* 清晰的用户指示
* 实时计划生成与流式处理
* 适当的错误处理
* 干净的关闭管理

## 示例用法

运行规划工具时，您将看到以下内容：


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

## 未来改进

考虑以下增强功能以改善您的任务规划器：

* 在任务之间添加依赖关系跟踪
* 包括资源的成本计算
* 将计划保存到文件或项目管理工具
* 跟踪与原始计划的进度
* 添加资源可用性的验证
* 实现并行任务调度
* 添加对重复任务的支持
* 包括任务的优先级级别

要了解有关 ClientAI 的更多信息，请访问 [docs](https://igorbenav.github.io/clientai/?utm_source=medium&utm_medium=article&utm_campaign=launch)。

## 联系我

如果您对本教程有任何疑问，或者想分享您对任务规划器的改进，请随时与我联系：

* **GitHub:** [igorbenav](https://github.com/igorbenav)
* **X/Twitter:** [@igorbenav](https://x.com/igorbenav)
* LinkedIn: [Igor](https://www.linkedin.com/in/igor-magalhaes-r/)

