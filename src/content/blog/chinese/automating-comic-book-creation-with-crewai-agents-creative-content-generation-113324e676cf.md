---
title: "利用 CrewAI Agents 实现漫画创作自动化：创意内容生成"
meta_title: "利用 CrewAI Agents 实现漫画创作自动化：创意内容生成"
description: "本文探讨了CrewAI LLM代理如何自动化漫画书创作过程。通过将短故事转化为场景，生成插图并整合为完整作品，CrewAI使创作高效且富有创意。文章以《潘查塔特拉》中的故事为例，展示了剧本编写、视觉艺术和合成的协同工作。生成性人工智能不仅提升了创作者的能力，还让他们能专注于核心创作，展现了未来创意产业中技术与艺术的无缝结合。"
date: 2024-12-07T12:27:17Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*na4N3ryN8D9UWrvDaRYRfQ.png"
categories: ["Generative AI", "Creative Industries", "Programming/Scripting"]
author: "Rifx.Online"
tags: ["CrewAI", "LLM", "comic", "automation", "creativity"]
draft: False

---



## 介绍

曾几何时，创作一本漫画书是一个繁琐的过程，需要作家、插画师和无数小时的努力。今天，人工智能作为一种强大的工具，增强了创意专业人士的能力。想象一下，将一个短故事交给人工智能，观看它如何帮助将这个故事转变为一个生动、视觉上令人惊叹的漫画书——同时保留创作者独特的视角。这不再只是一个幻想；这是由尖端的生成式人工智能模型实现的现实。在本博客中，我们将探讨CrewAI LLM代理如何提升漫画书创作的创意过程，深入研究使这种魔法成为可能的架构和实施。

### 示例：从《潘查塔特拉》创建故事书

为了演示这个过程，让我们使用《潘查塔特拉》中的一个短故事——这是一部以智慧和道德教训著称的古印度寓言集。考虑一下“狮子和兔子”的故事：

*短故事*：“从前，有一只名叫巴苏拉卡的强大狮子，他在丛林中横行霸道。动物们厌倦了他的暴政，决定每天给他送一只猎物。一天，轮到了聪明的兔子，他制定了一个计划来摆脱狮子。他把巴苏拉卡引到一个深井，说服他那里住着另一只狮子。巴苏拉卡看到水中的倒影，愤怒地吼叫着跳进了井里，再也没有回来。”

使用CrewAI框架，我们将遵循以下步骤：

1. **剧本编写代理**：剧本编写者会将故事分解为场景，例如：
* 场景 1：狮子在丛林中横行。
* 场景 2：动物们决定每天送一只猎物。
* 场景 3：兔子计划欺骗狮子。
* 场景 4：狮子跳进井里。
2. **视觉艺术家代理**：视觉艺术家将为每个场景生成插图，描绘关键时刻，如狮子在丛林中吼叫，兔子引导狮子到井边，以及狮子跳入水中的最后场景。
3. **合成器代理**：最后，合成器将所有这些场景和图像组合成一本连贯的故事书，准备供人查看和分享。

有关《潘查塔特拉》故事的更多详细信息，您可以参考外部资源，如[维基百科上的潘查塔特拉](https://en.wikipedia.org/wiki/Panchatantra)或[潘查塔特拉故事集](https://www.pitara.com/fiction-for-kids/folktales/indian-folktales/the-panchatantra-stories/)。

**使用LLM代理自动化创作生成**

生成性AI代理可以被视为一个数字“团队”，共同合作执行复杂的创作过程。通过将特定任务分配给各个AI代理，创建整本漫画图画书的过程变得高效和自动化。在下面的图示中，专业代理协同工作：



1. **剧本编写者**：负责将短故事转化为详细的分解场景。
2. **视觉艺术家**：负责将每个场景转换为引人入胜的视觉艺术作品。
3. **合成器**：负责将所有生成的场景及其对应图像合并为一本连贯完整的漫画书。合成器确保叙事流畅，最终产品准备好发布。

这些代理之间的协同作用使漫画书创作过程自动化，实现高效和创造性的工作流程。关键在于以协调的方式利用生成语言模型和图像生成AI系统的能力。

**架构概述**

该自动化的架构简单而有效。该过程以短故事为起点，流程如下：

1. **短故事输入**：该过程以短叙述作为输入，作为漫画书的基础。
2. **剧本编写代理**：该代理将短故事分解为离散场景，每个场景捕捉故事情节的重要部分。在图示中，这显示为标记为“场景 1、场景 2、场景 3”等的场景，直到整个故事被分成几个较小的场景。
3. **视觉艺术家代理**：视觉艺术家负责将每个场景描述转化为视觉表现，有效地为漫画绘制插图。视觉元素作为图像创建，代表像狮子在阳光下、狮子与兔子相遇等场景。
4. **合成器**：最后，所有场景及其对应图像由合成器代理组合，以创建一本完整的图画书。

整个过程旨在无缝地将叙述转化为引人入胜的漫画书，所需的人为干预最小。

**使用CrewAI框架实施**

为了将这一愿景变为现实，我们实施了CrewAI框架，三个代理和谐工作。以下是实施过程的详细步骤，附有代码片段的占位符，以帮助您逐步复现该过程：

**定义代理和任务**：我们使用CrewAI框架定义两个代理——代理 1（剧本编写者）和代理 2（视觉艺术家）。这两个代理都有特定的角色，任务相互关联，以实现高效的工作流程。

```python
## 代理
scriptwriter:
  role: >
    为儿童短故事编写场景剧本
  goal: >
    为儿童图画书编写简单、清晰且引人入胜的场景剧本。
  backstory: >
    你是一个专注于将儿童短故事转化为剧本的剧本编写者，用于表演或动画制作。
  llm: llm_model               

## 任务

scriptwriting:
  description: >
    你将获得一个关于学习生活重要教训的儿童短故事。该故事需要转化为一本有趣的图画书，以便儿童阅读和参与。你负责将故事分解为 
    {number_of_scenes} 个独特场景，每个场景聚焦于故事中的特定事件或时刻。每个场景将转化为图像。你必须生成以下信息，遵循指定的pydantic模式：

    - 故事的合适名称 
    - 故事的简短摘要 
    - 故事的简短背景介绍，为读者提供重要的信息。
    - 故事中每个场景的详细叙述，至少一到两句话。
    - 故事中学到的最终教训。

    <short_story>    
      {story_text}
    </short_story>   
  expected_output: >   
    输出必须严格遵循pydantic模式。如果不遵循，将会有惩罚。       
  agent: scriptwriter

## 代理

visualartist:
  role: >
    故事书的视觉插图
  goal: >
    创建引人入胜的图画书。
  backstory: >
    创建图画故事书的专家。
  llm: llm_model

## 任务

illustration:
  description: > 

    你将获得一个关于学习生活重要教训的儿童短故事。该故事将转化为一本有趣的图画书，以便儿童阅读和参与。故事已经分解为独特的场景。

    下面是一个场景的描述，该场景的短摘要也在下面给出。 
    
    生成一个可以用于文本到图像模型的提示，以生成该场景的图像。将提示发送到提供的工具，以生成符合场景要求的角色和背景的图像。角色应为卡通风格。提示应少于40个字。

    <story_summary>
      {story_summary}
    <story_summary>

    <scene_description>
      {scene_description}
    </scene_description>
  expected_output: >   
    输出必须严格遵循pydantic模式。如果不遵循，将会有惩罚。       
  agent: visualartist
```
**团队配置：** 定义代理的结构化模式，以生成响应和llm模型，如OpenAI和DaLLE模型，并将代理与其任务绑定。

```python
dalle_tool = DallETool(model="dall-e-3",
                       size="1024x1024",
                       quality="standard",
                       n=1)

## 为单个场景定义一个类
class StoryScene(BaseModel):
    scene_number: int 
    narration: str

## 为故事场景列表定义一个类
class StoryScenes(BaseModel):
 story_name: str 
 summary: str 
 background: str 
 lesson: str 
 scenes: List[StoryScene]

## 为单个场景定义一个类
class SceneImage(BaseModel):
    prompt: str = Field(description = "可用于生成图像的文本到图像模型的提示。", max_length = 50)
    image_url: str = Field(description = "由工具生成的图像的URL")

@CrewBase
class StoryCrew():
 """故事团队"""

 agents_config = 'config/story/agents.yaml'
 tasks_config = 'config/story/tasks.yaml'

 @llm
 def llm_model(self):
  return ChatOpenAI(temperature=0.0,  # 设置为0以获得确定性输出
                    model="gpt-4o-mini",  # 使用GPT-4 Turbo模型
                    max_tokens=8000) 

 @agent
 def scriptwriter(self) -> Agent:
  return Agent(
   config=self.agents_config['scriptwriter'],
   output_pydantic = StoryScenes,   
   verbose=True
  )

 @task
 def scriptwriting(self) -> Task:
  return Task(
   config=self.tasks_config['scriptwriting'],
   output_pydantic = StoryScenes,   
  )

 @crew
 def crew(self) -> Crew:
  """创建故事团队"""
  script_crew =  Crew(
   agents=self.agents, # 由@agent装饰器自动创建
   tasks=self.tasks, # 由@task装饰器自动创建
   process=Process.sequential,
   verbose=True,
   # process=Process.hierarchical, # 如果你想改用这个，可以参考 https://docs.crewai.com/how-to/Hierarchical/
  )

  return script_crew
 
@CrewBase
class ArtistCrew():

 agents_config = 'config/visual/agents.yaml'
 tasks_config = 'config/visual/tasks.yaml'

 @llm
 def llm_model(self):
  return ChatOpenAI(temperature=0.0,  # 设置为0以获得确定性输出
                    model="gpt-4o-2024-08-06",  # 使用GPT-4 Turbo模型
                    max_tokens=8000) 

 @agent
 def visualartist(self) -> Agent:
  return Agent(
   config=self.agents_config['visualartist'],
   tools=[dalle_tool],   
   verbose=True
  )

 @task
 def illustration(self) -> Task:
  return Task(
   config=self.tasks_config['illustration'],
   output_pydantic = SceneImage,      
   output_file='report.md'
  )

 @crew
 def crew(self) -> Crew:
  """创建图画书团队"""
  artist_crew =  Crew(
   agents=self.agents, # 由@agent装饰器自动创建
   tasks=self.tasks, # 由@task装饰器自动创建
   process=Process.sequential,
   verbose=True,
   # process=Process.hierarchical, # 如果你想改用这个，可以参考 https://docs.crewai.com/how-to/Hierarchical/
  ) 

  return artist_crew
```
**主要工作流程：** 确保两个代理之间的适当交接。例如，一旦剧本编写者完成一个场景，它会自动传递给视觉艺术家，确保工作流程的连续性。

```python
agentops.start_session( tags = ['story', 'scripts'] )

## 使用 QuestCrew 创建假设或生成问题
inputs = {
    'number_of_scenes': int(number_of_scenes),
    'story_text': story_text,
}

scenes_list = StoryCrew().crew().kickoff(inputs=inputs)

agentops.end_session("Success")

if scenes_list is not None:        
    print(f"Raw result from script writing: {scenes_list.raw}")

slist = scenes_list.pydantic
story_summary = slist.summary
for scene in slist.scenes:
    print(f"Scene: {scene.narration}") 

scene_input = [{ "story_summary": story_summary,
    'scene_description': scene.narration} for i, scene in enumerate(slist.scenes)]

agentops.start_session(tags = ['scene', 'illustration'])

## 运行代理
result_images = ArtistCrew().crew().kickoff_for_each(inputs = scene_input)

print("result_images : {result_images.raw}")
```

## 结论

生成性人工智能的力量在于它能够增强和支持创作过程，为内容创作者提供新的工具，将他们的想法变为现实。CrewAI LLM 代理在将简单的短篇故事转化为引人入胜的漫画图画书方面提供帮助，协助讲故事者在旅程的每个阶段。通过自动化脚本分解和视觉生成等重复性任务，人工智能使艺术家和作家能够更加专注于核心创作元素，保留他们独特的艺术风格。此实施展示了生成性人工智能如何增强创意产业，提供了一个未来的展望，在这个未来中，创造力和技术无缝协作。

让我知道您是否想进一步了解 CrewAI 或对为您的项目实施类似创意解决方案有任何疑问！

