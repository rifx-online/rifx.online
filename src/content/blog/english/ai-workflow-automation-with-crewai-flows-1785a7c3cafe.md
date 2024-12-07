---
title: "AI Workflow Automation with CrewAI Flows"
meta_title: "AI Workflow Automation with CrewAI Flows"
description: "CrewAI is an advanced Python framework for automating AI workflows through the orchestration of specialized agents, termed crews. The Flows feature simplifies workflow creation, state management, and execution control using decorators like `@start()` and `@listen()`. It supports both unstructured and structured state management, allowing developers flexibility in handling data. The framework enables the design of complex tasks, including data validation, analysis, and notifications, facilitating the development of efficient multi-agent systems tailored to specific requirements."
date: 2024-12-07T12:25:12Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*d6PEZAUblD0ZdB3Hq-iOuA.jpeg"
categories: ["Programming", "Machine Learning", "Data Science"]
author: "Rifx.Online"
tags: ["Python", "workflows", "orchestration", "agents", "decorators"]
draft: False

---







## CrewAI

CrewAI is cutting\-edge Python framework for orchestrating role\-playing, autonomous AI agents.By building “crews” of specialized agents, we can automate tasks, generate creative text formats, and access information in a whole new way.This article guide you how to create simple project using crewAI usingFlow feature .


## Flows

CrewAI Flows is a powerful feature designed to streamline the creation and management of AI workflows. Flows allows to developer co\-ordinate with mutiple task and Crews to create Workflow AI automation.

Flows allow to connect multiple task , manage state ,and control the flow execution. developer can design single workflow and mutiple which implement using crewAI.

1. Simplified Workflow Creation: Easily create multiple Crews and tasks complex AI workflows.
2. State Management: By using state mangement you can manage state between different task within your flow.
3. Event\-Driven Architecture: By using Built on an event\-driven model, allowing for dynamic and responsive workflows.
4. Flexible Control Flow: you can control your workflow with condition logic , loops and branching.


## Flow Execution


## @start()

The `@start()` decorator is used to start the flow of execution.when a flowis started all the method with start decorator executing in parrallel. flow can have multiple `@start()` decorator .


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

The `@listen()` decorator is used to mark a method as a listener for the output of another task in the Flow. The method decorated with `@listen()` will be executed when the specified task emits an output. Flow can have multiple listen decorator and one method can listen mutiple mutiple usingconditional logic which we will decuss below.


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

## Flow Control


## Conditional Logic: or , and, router

The `or_` function in Flows allow you to listen to multiple methods and trigger the listener method when any of the specified methods emit an output.

The `and_` function in Flows allow you to listen to multiple methods and trigger the listener method only when all the specified methods emit an output.

The `@router()` decorator in Flows allows you to define conditional routing logic based on the output of a method. You can define mutiple routes based on the output of the each method that allow us to control the flow of execution dynamically.


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

## Flow State Management

Managing state effectively is crucial for building reliable and maintainable AI workflows. CrewAI Flows provides robust mechanisms for both unstructured and structured state management, allowing developers to choose the approach that best fits their application’s needs.


## ​Unstructured State Management

In unstructured state management, all state is stored in the `state` attribute of the `Flow` class. This approach offers flexibility, enabling developers to add or modify state attributes on the fly without defining a strict schema.


```python
class CustomDataFlow(Flow):
    def __init__(self, data):
        super().__init__()
        self.state['data'] = data  #state attribute store Unstructure state
        self.state['validation_success'] = False
        self.state['analysis_success'] = False
        self.state['backup_done'] = False
```

## Structured State Management

Structured state management leverages predefined schemas to ensure consistency and type safety across the workflow. By using models like Pydantic’s `BaseModel`, developers can define the exact shape of the state, enabling better validation and auto\-completion in development environments.


## Full Code crewAi flow


```python
import asyncio
from crewai import Agent, Task, Crew, Process
from crewai.flow.flow import Flow, start, listen, and_, or_
## Agent where define role and backstory
dataValidationAgent = Agent(
    role='Data Validator',
    goal='Validate incoming data to ensure it meets predefined criteria. and give output only success or failure nothing extra word if output is failure then give reason ',
    backstory="you are an agent to verify given data with qualaty ",
    verbose=True
)
dataBackupAgent = Agent(
    role='Data Backup Agent',
    goal='Securely create a backup of data for recovery and safety.',
    backstory="you are an agent to taking which neccssary information need  to take backup and store for safety.",
    verbose=True
)
dataAnalysisAgent = Agent(
    role='Data Analyst ',
    goal=' analyze data and generate meaningful insights. whcich is related for business',
    backstory="you are an agent  skilled in analyzing data and what neccessary information  within data. ",
    verbose=True
)
notificationAgent = Agent(
    role='Notifier',
    goal='generate notification based  various method outcomes wtih neccessary information only.',
    backstory="you are an agent   responsible for deliver alerts and update.",
    verbose=True
)
## Define the main workflow
class CustomDataFlow(Flow):
    def __init__(self, data):
        super().__init__()
        self.state['data'] = data
        self.state['validation_success'] = False
        self.state['analysis_success'] = False
        self.state['backup_done'] = False
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
    @listen((validate_data))
    async def analyze_data(self):
        """Analyze data only if validation succeeds."""
        if self.state['validation_success']:
            task_analyze = Task(
                description=f'Analyze validated data: {self.state["data"]} to extract meaningful insights.',
                agent=dataAnalysisAgent,
                expected_output='Data analysis completed successfully'  # Expected output indicating successful analysis
            )
            crew = Crew(
                agents=[dataAnalysisAgent],
                tasks=[task_analyze],
                verbose=True,
                process=Process.sequential
            )
            analysis_result = await crew.kickoff_async()
            self.state['analysis_success'] = analysis_result == 'Data analysis completed successfully'
        else:
            print("Skipping analysis as data validation did not succeed.")
    @listen(and_(analyze_data,validate_data))
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
    @listen(or_(send_notification_on_failure, backup_data))
    async def send_final_notification(self):
        """Send a final notification summarizing the data processing outcomes."""
        if not self.state['validation_success']:
            message = "Data validation failed. No backup needed."
        elif self.state['backup_done']:
            message = "Data successfully analyzed and backed up. Final notification issued."
        else:
            message = "Data processing completed with warnings."
        task_notify = Task(
            description=f'Issue final notification: {message} for data: {self.state["data"]}.',
            agent=notificationAgent,
            expected_output=f'Final notification sent: {message}'  # Indicating the final notification outcome
        )
        crew = Crew(
            agents=[notificationAgent],
            tasks=[task_notify],
            verbose=True,
            process=Process.sequential
        )
        await crew.kickoff_async()
        print("Final notification sent.")
## Main entry point to execute the flow
async def main():
    data_flow = CustomDataFlow(data={
        "id": 1,
        "name": "Kuldeep",
        "age": 32,
        "country": "INDIA",
        "score": 85.5,
        "status": "active"
    })
    data_flow.plot()  # for visualize the flow
    await data_flow.kickoff()
if __name__ == "__main__":
    asyncio.run(main())
```

## Flow

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*qpkiMOV5cNDfRIpu5yyKQQ.jpeg)


## Conclusion:

Crew AI transforms the development and management of multi\-agent systems, providing a strong framework to craft advanced AI solutions. Utilizing agents, tasks, and tools,Flows users can create efficient and collaborative AI systems customized for precise requirements.By using Flow you can manage state of each Agent works which canpowerfull to make complex task.


## Reference

<https://docs.crewai.com/concepts/flows><https://stackoverflow.com/questions/tagged/crewai>


## About the Author:

[Kuldeep Yadav](https://www.linkedin.com/in/kuldeep-yadav-712579193?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app) started his journey as a Software Engineer at CodeStax.Ai. He loves to explore multiple domains and loves to solve problems in an efficient manner.


## About CodeStax.Ai

At [**CodeStax.AI**](http://codestax.ai/), we stand at the nexus of innovation and enterprise solutions, offering technology partnerships that empower businesses to drive efficiency, innovation, and growth, harnessing the transformative power of no\-code platforms and advanced AI integrations.

But what is the real magic? It’s our tech tribe behind the scenes. If you have a knack for innovation and a passion for redefining the norm, we have the perfect tech playground for you. CodeStax. Ai offers more than a job — it’s a journey into the very heart of what’s next. Join us and be part of the revolution that’s redefining the enterprise tech landscape.


