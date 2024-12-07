---
title: "利用 CrewAI Flows 实现人工智能工作流程自动化"
meta_title: "利用 CrewAI Flows 实现人工智能工作流程自动化"
description: "CrewAI 是一个高级 Python 框架，旨在自动化 AI 工作流，通过构建团队和协调多个任务来简化开发过程。其 Flow 功能允许开发者管理状态、控制流执行，并实现事件驱动架构。通过使用装饰器 @start() 和 @listen()，开发者可以定义任务的执行顺序和条件逻辑，确保在特定条件下触发相应的操作。CrewAI 还支持非结构化和结构化状态管理，以适应不同的应用需求，促进高效的 AI 系统构建。"
date: 2024-12-07T12:25:12Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*d6PEZAUblD0ZdB3Hq-iOuA.jpeg"
categories: ["Programming", "Machine Learning", "Data Science"]
author: "Rifx.Online"
tags: ["Python", "workflows", "orchestration", "agents", "decorators"]
draft: False

---





## CrewAI

CrewAI 是一个尖端的 Python 框架，用于协调角色扮演和自主 AI 代理。通过构建“团队”由专业代理，我们可以自动化任务、生成创意文本格式，并以全新的方式访问信息。本文将指导您如何使用 CrewAI 的 Flow 功能创建简单项目。

## 流程

CrewAI 流程是一个强大的功能，旨在简化 AI 工作流程的创建和管理。流程允许开发人员与多个任务和团队协调，以创建工作流 AI 自动化。

流程允许连接多个任务，管理状态，并控制流的执行。开发人员可以设计单个工作流和多个使用 CrewAI 实现的工作流。

1. 简化工作流创建：轻松创建多个团队和任务的复杂 AI 工作流。
2. 状态管理：通过使用状态管理，您可以在流程中的不同任务之间管理状态。
3. 事件驱动架构：基于事件驱动模型构建，允许动态和响应式工作流。
4. 灵活的控制流：您可以使用条件逻辑、循环和分支来控制您的工作流。

## 流程执行

## @start()

`@start()` 装饰器用于启动执行流程。当流程启动时，所有带有 start 装饰器的方法将并行执行。一个流程可以有多个 `@start()` 装饰器。

```python
@start()
    async def validate_data(self):
        """Validate incoming data against predefined criteria."""
        data = self.state['data']
        # Perform validation based on specified conditions
        validation_result = 'success or falilure'
        
        # Execute validation task with result
        task_validate = Task(
            description=f'Validate data: {data}. Criteria: score > 85 and age > 30.',
            agent=dataValidationAgent,
            expected_output=validation_result  # Expected output to indicate success or failure
        )
        crew = Crew(
            agents=[dataValidationAgent],
            tasks=[task_validate],
            verbose=True,
            process=Process.sequential
        )
        result = await crew.kickoff_async()
        self.state['validation_success'] = result.raw  == 'success'
```

## @listen()

`@listen()` 装饰器用于标记一个方法为 Flow 中另一个任务输出的监听器。当指定的任务发出输出时，使用 `@listen()` 装饰的方法将被执行。Flow 可以有多个监听装饰器，一个方法可以使用条件逻辑监听多个输出，我们将在下面讨论。

```python
@listen((validate_data))
    async def send_notification_on_failure(self):
        """Send a notification if data validation fails."""
        if not self.state['validation_success']:
            task_notify = Task(
                description=f'Issue a notification for validation failure for data: {self.state["data"]}.',
                agent=notificationAgent,
                expected_output='Notification sent for validation failure'  # Indicating notification was sent
            )
            crew = Crew(
                agents=[notificationAgent],
                tasks=[task_notify],
                verbose=True,
                process=Process.sequential
            )
            await crew.kickoff_async()
            print("Notification sent: Validation failed.")
        else:
            print("Validation succeeded, no notification for failure needed.")
```

## 流程控制

## 条件逻辑：或，和，路由

Flows 中的 `or_` 函数允许您监听多个方法，并在任何指定的方法发出输出时触发监听器方法。

Flows 中的 `and_` 函数允许您监听多个方法，并仅在所有指定的方法发出输出时触发监听器方法。

Flows 中的 `@router()` 装饰器允许您根据方法的输出定义条件路由逻辑。您可以根据每个方法的输出定义多个路由，从而动态控制执行流程。

```python
@listen(and_(analyze_data,validate_data))#listen mutiple method using and_ decorator
    async def backup_data(self):
        """Backup data after successful analysis."""
        if self.state['analysis_success']:
            task_backup = Task(
                description=f'Create a backup for analyzed data: {self.state["data"]}.',
                agent=dataBackupAgent,
                expected_output='Data backup completed successfully'  # Expected output indicating backup completion
            )
            crew = Crew(
                agents=[dataBackupAgent],
                tasks=[task_backup],
                verbose=True,
                process=Process.sequential
            )
            backup_status = await crew.kickoff_async()
            self.state['backup_done'] = backup_status == 'Data backup completed successfully'
            print("Data backup completed.")
        else:
            print("Backup skipped as data analysis was not successful.")
```

## 流状态管理

有效地管理状态对于构建可靠和可维护的 AI 工作流至关重要。CrewAI Flows 提供了强大的机制，用于非结构化和结构化状态管理，使开发人员能够选择最符合其应用需求的方法。

## 非结构化状态管理

在非结构化状态管理中，所有状态都存储在 `Flow` 类的 `state` 属性中。这种方法提供了灵活性，使开发人员能够动态添加或修改状态属性，而无需定义严格的模式。

```python
class CustomDataFlow(Flow):
    def __init__(self, data):
        super().__init__()
        self.state['data'] = data  #state attribute store Unstructure state
        self.state['validation_success'] = False
        self.state['analysis_success'] = False
        self.state['backup_done'] = False
```

## 结构化状态管理

结构化状态管理利用预定义的模式确保工作流程中的一致性和类型安全。通过使用像 Pydantic 的 `BaseModel` 这样的模型，开发人员可以定义状态的确切形状，从而在开发环境中实现更好的验证和自动补全。

## 完整代码 crewAi 流程


```python
import asyncio
from crewai import Agent, Task, Crew, Process
from crewai.flow.flow import Flow, start, listen, and_, or_
## 代理定义角色和背景故事
dataValidationAgent = Agent(
    role='数据验证器',
    goal='验证传入数据以确保其符合预定义标准，并仅输出成功或失败，没有额外的文字，如果输出为失败，则给出原因。',
    backstory="你是一个代理，负责验证给定数据的质量。",
    verbose=True
)
dataBackupAgent = Agent(
    role='数据备份代理',
    goal='安全地创建数据备份以便于恢复和安全。',
    backstory="你是一个代理，负责收集需要备份的必要信息并进行安全存储。",
    verbose=True
)
dataAnalysisAgent = Agent(
    role='数据分析师',
    goal='分析数据并生成有意义的商业洞察。',
    backstory="你是一个擅长分析数据的代理，能够从数据中提取必要信息。",
    verbose=True
)
notificationAgent = Agent(
    role='通知者',
    goal='根据各种方法的结果生成通知，仅包含必要的信息。',
    backstory="你是一个负责发送警报和更新的代理。",
    verbose=True
)
## 定义主工作流程
class CustomDataFlow(Flow):
    def __init__(self, data):
        super().__init__()
        self.state['data'] = data
        self.state['validation_success'] = False
        self.state['analysis_success'] = False
        self.state['backup_done'] = False
    @start()
    async def validate_data(self):
        """根据预定义标准验证传入数据。"""
        data = self.state['data']
        # 根据指定条件执行验证
        validation_result = '成功或失败'
        
        # 执行带有结果的验证任务
        task_validate = Task(
            description=f'验证数据: {data}. 标准: score > 85 和 age > 30。',
            agent=dataValidationAgent,
            expected_output=validation_result  # 预期输出以指示成功或失败
        )
        crew = Crew(
            agents=[dataValidationAgent],
            tasks=[task_validate],
            verbose=True,
            process=Process.sequential
        )
        result = await crew.kickoff_async()
        self.state['validation_success'] = result.raw  == '成功'
    @listen((validate_data))
    async def send_notification_on_failure(self):
        """如果数据验证失败，则发送通知。"""
        if not self.state['validation_success']:
            task_notify = Task(
                description=f'发出验证失败的通知，数据: {self.state["data"]}。',
                agent=notificationAgent,
                expected_output='已发送验证失败通知'  # 表示通知已发送
            )
            crew = Crew(
                agents=[notificationAgent],
                tasks=[task_notify],
                verbose=True,
                process=Process.sequential
            )
            await crew.kickoff_async()
            print("通知已发送: 验证失败。")
        else:
            print("验证成功，无需发送失败通知。")
    @listen((validate_data))
    async def analyze_data(self):
        """仅在验证成功时分析数据。"""
        if self.state['validation_success']:
            task_analyze = Task(
                description=f'分析验证过的数据: {self.state["data"]} 以提取有意义的洞察。',
                agent=dataAnalysisAgent,
                expected_output='数据分析成功完成'  # 预期输出以指示分析成功
            )
            crew = Crew(
                agents=[dataAnalysisAgent],
                tasks=[task_analyze],
                verbose=True,
                process=Process.sequential
            )
            analysis_result = await crew.kickoff_async()
            self.state['analysis_success'] = analysis_result == '数据分析成功完成'
        else:
            print("由于数据验证未成功，跳过分析。")
    @listen(and_(analyze_data,validate_data))
    async def backup_data(self):
        """在成功分析后备份数据。"""
        if self.state['analysis_success']:
            task_backup = Task(
                description=f'为分析过的数据创建备份: {self.state["data"]}。',
                agent=dataBackupAgent,
                expected_output='数据备份成功完成'  # 预期输出以指示备份完成
            )
            crew = Crew(
                agents=[dataBackupAgent],
                tasks=[task_backup],
                verbose=True,
                process=Process.sequential
            )
            backup_status = await crew.kickoff_async()
            self.state['backup_done'] = backup_status == '数据备份成功完成'
            print("数据备份完成。")
        else:
            print("由于数据分析未成功，跳过备份。")
    @listen(or_(send_notification_on_failure, backup_data))
    async def send_final_notification(self):
        """发送最终通知，汇总数据处理结果。"""
        if not self.state['validation_success']:
            message = "数据验证失败，无需备份。"
        elif self.state['backup_done']:
            message = "数据成功分析并备份。已发出最终通知。"
        else:
            message = "数据处理完成，但有警告。"
        task_notify = Task(
            description=f'发出最终通知: {message}，数据: {self.state["data"]}。',
            agent=notificationAgent,
            expected_output=f'最终通知已发送: {message}'  # 表示最终通知结果
        )
        crew = Crew(
            agents=[notificationAgent],
            tasks=[task_notify],
            verbose=True,
            process=Process.sequential
        )
        await crew.kickoff_async()
        print("最终通知已发送。")
## 主入口点以执行流程
async def main():
    data_flow = CustomDataFlow(data={
        "id": 1,
        "name": "Kuldeep",
        "age": 32,
        "country": "印度",
        "score": 85.5,
        "status": "active"
    })
    data_flow.plot()  # 可视化流程
    await data_flow.kickoff()
if __name__ == "__main__":
    asyncio.run(main())
```

## 流程

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*qpkiMOV5cNDfRIpu5yyKQQ.jpeg)

## 结论：

Crew AI 转变了多智能体系统的开发和管理，提供了一个强大的框架来构建先进的 AI 解决方案。通过利用智能体、任务和工具，Flows 用户可以创建高效且协作的 AI 系统，以满足特定需求。通过使用 Flow，您可以管理每个智能体的状态，这对于处理复杂任务非常有用。

## 参考

<https://docs.crewai.com/concepts/flows><https://stackoverflow.com/questions/tagged/crewai>

## 关于作者：

[Kuldeep Yadav](https://www.linkedin.com/in/kuldeep-yadav-712579193?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app) 开始了他的旅程，成为了 CodeStax.Ai 的软件工程师。他喜欢探索多个领域，并热衷于以高效的方式解决问题。

## 关于 CodeStax.Ai

在 [**CodeStax.AI**](http://codestax.ai/) ，我们处于创新与企业解决方案的交汇点，提供技术合作伙伴关系，使企业能够推动效率、创新和增长，利用无代码平台和先进的 AI 集成的变革力量。

但真正的魔力是什么？是我们在幕后支持的技术团队。如果你对创新有敏锐的洞察力，并热衷于重新定义常规，我们为你提供了完美的技术游乐场。CodeStax.Ai 提供的不仅仅是一份工作——这是一段深入未来核心的旅程。加入我们，成为重新定义企业技术格局的革命的一部分。

