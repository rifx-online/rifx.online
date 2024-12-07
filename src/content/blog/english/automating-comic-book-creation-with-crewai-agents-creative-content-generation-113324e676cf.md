---
title: "Automating Comic Book Creation with CrewAI Agents: Creative Content Generation"
meta_title: "Automating Comic Book Creation with CrewAI Agents: Creative Content Generation"
description: "The article discusses the use of CrewAI LLM agents to automate comic book creation, transforming narratives into visually engaging stories. It outlines a structured process involving a Script Writer Agent, a Visual Artist Agent, and a Synthesizer Agent, which work together to break down stories into scenes, create illustrations, and compile them into a cohesive comic book. This automation enhances creativity by allowing artists and writers to focus on core elements while generative AI handles repetitive tasks, showcasing the potential of AI in creative industries."
date: 2024-12-07T12:27:17Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*na4N3ryN8D9UWrvDaRYRfQ.png"
categories: ["Generative AI", "Creative Industries", "Programming/Scripting"]
author: "Rifx.Online"
tags: ["CrewAI", "LLM", "comic", "automation", "creativity"]
draft: False

---





## Introduction

Once upon a time, creating a comic book was a laborious process, requiring writers, illustrators, and countless hours of effort. Today, artificial intelligence has emerged as a powerful tool that augments the capabilities of creative professionals. Imagine giving a short story to an AI, and watching it help transform that story into a vibrant, visually stunning comic book — all while preserving the creator’s unique vision. This is no longer just a fantasy; it’s a reality made possible by cutting\-edge generative AI models. In this blog, we’ll explore how CrewAI LLM agents can enhance the creative process of comic book creation, diving into the architecture and implementation that makes this magic possible.


### Example: Creating a Story Book from Panchatantra

To demonstrate this process, let’s use a short story from the Panchatantra — a collection of ancient Indian fables known for their wisdom and moral lessons. Consider the story of ‘The Lion and the Rabbit’:

*Short Story*: “Once upon a time, there lived a mighty lion named Bhasuraka, who terrorized the jungle. The animals, tired of his tyranny, decided to send him a prey every day. One day, it was a clever rabbit’s turn, and he devised a plan to rid the jungle of the lion. He led Bhasuraka to a deep well, convincing him that another lion lived there. Bhasuraka, seeing his reflection in the water, roared in anger and jumped into the well, never to return.”

Using the CrewAI framework, we would follow these steps:

1. **Script Writer Agent**: The Script Writer would break down the story into scenes such as:
* Scene 1: The lion terrorizes the jungle.
* Scene 2: The animals decide to send a prey every day.
* Scene 3: The rabbit plans to trick the lion.
* Scene 4: The lion jumps into the well.
1. **Visual Artist Agent**: The Visual Artist would then generate illustrations for each of these scenes, depicting key moments like the lion roaring in the jungle, the rabbit leading the lion to the well, and the final scene of the lion jumping into the water.
2. **Synthesizer Agent**: Finally, the Synthesizer would combine all these scenes and images into a cohesive storybook, making it ready for viewing and sharing.

For more details on Panchatantra stories, you can refer to external resources such as [Panchatantra on Wikipedia](https://en.wikipedia.org/wiki/Panchatantra) or [collections of Panchatantra stories](https://www.pitara.com/fiction-for-kids/folktales/indian-folktales/the-panchatantra-stories/).

**Using LLM Agents to Automate Creative Generation**

Generative AI agents can be thought of as a digital “crew” working together to execute complex creative processes. By assigning specific tasks to individual AI agents, the process of creating an entire comic picture book becomes streamlined and automated. In the diagram below, specialized agents work together:



1. **Script Writer**: Responsible for transforming a short story into detailed, broken\-down scenes.
2. **Visual Artist**: Tasked with converting each of these scenes into captivating visual artwork.
3. **Synthesizer**: Responsible for combining all the generated scenes and their corresponding images into a cohesive and complete comic book. The Synthesizer ensures that the narrative flows smoothly and that the final product is ready for publishing.

The synergy between these agents automates the process of comic book creation, enabling an efficient and creative workflow. The key lies in leveraging the capabilities of generative language models and image\-generative AI systems in a coordinated manner.

**Architecture Overview**

The architecture for this automation is straightforward yet effective. The process begins with a short story and proceeds as follows:

1. **Short Story Input**: The process starts with a short narrative as input, which serves as the basis for the comic book.
2. **Script Writer Agent**: This agent breaks down the short story into discrete scenes, each capturing an important part of the storyline. In the diagram, this is shown as scenes labeled “Scene 1, Scene 2, Scene 3,” and so on, until the entire story is divided into several smaller scenes.
3. **Visual Artist Agent**: The Visual Artist takes each scene description and creates visual representations for each one, effectively drawing the artwork for the comic. The visual elements are created as images representing scenes like a lion under the sun, a lion meeting a rabbit, and more.
4. **Synthesizer**: Finally, all scenes and their corresponding images are combined by a synthesizer agent to create a complete picture book.

The entire process aims at a seamless transformation of a narrative into an engaging comic book, requiring minimal human intervention.

**Implementing Using CrewAI Framework**

To bring this vision to life, we implemented the CrewAI framework with three agents working in harmony. Here are the detailed steps involved in the implementation, with placeholders for code snippets from the attached file to help you reproduce the process step by step:

**Defining the Agents and Tasks**: We define two agents using the CrewAI framework — Agent 1 (Script Writer) and Agent 2 (Visual Artist). Both agents have specific roles to play, and their tasks are linked for efficient workflow.


```python
## Agent
scriptwriter:
  role: >
    Write scripts for scenes for short stories for kids
  goal: >
    Write simple, clear and engaging scenes for short stories for kids for picture books.
  backstory: >
    You are script writer focussing on converting short stories for kids into scripts for enacting or creation of animations.
  llm: llm_model               

## Task

scriptwriting:
  description: >
    You are given a short story for kids on learning important lessons on life. The story need to be converted to 
    a picture book for fun reading and engagement for the kids. You are responsible for breaking down story into 
    {number_of_scenes} distinct scenes, each focused on a specific event or moment in the story. Each scene will be 
    converted to an image in the picture. You must generate the following information in the pydantic schema specified:

    - An apt name for the story 
    - A short summary of the story 
    - A short exposition of the story providing the reader with important background information.
    - Detailed narration of each scene in the story at least in one or two sentences.
    - The final lesson learnt from the story.

    <short_story>    
      {story_text}
    </short_story>   
  expected_output: >   
    The output must follow the pydantic schema strictly. There will be penalty if not followed.       
  agent: scriptwriter

## Agent

visualartist:
  role: >
    Visual illustrations for story books
  goal: >
    Create engaging picture books.
  backstory: >
    Expert in creating picture story books.
  llm: llm_model

## Task

illustration:
  description: > 

    You are given a short story for kids on learning important lessons on life. The story will to be converted to 
    a picture book for fun reading and engagement for the kids. The story is already broken down into distinct scenes.

    Below is a description of a specific scence from a story whose short summary is also given below. 
    
    Generate a prompt  which can be used by a text to image model to generate an image for the scene. Send the prompt to the 
    tool provided to generated the image that depicts characters and backgrounds appropriately as per the requirements of the scenes. 
    And the characters should be in cartoon style. The prompts should be in less than 40 words.

    <story_summary>
      {story_summary}
    <story_summary>

    <scene_description>
      {scene_description}
    </scene_description>
  expected_output: >   
    The output must follow the pydantic schema strictly. There will be penalty if not followed.       
  agent: visualartist
```
**Crew Configuration:** Define the structured schemas for the agents to generate the responses and llm model like OpenAI and DaLLE models for the agent. And bind the agents with their tasks.


```python
dalle_tool = DallETool(model="dall-e-3",
                       size="1024x1024",
                       quality="standard",
                       n=1)

## Define a class for an individual scene
class StoryScene(BaseModel):
    scene_number: int 
    narration: str

## Define a class for a list of story scenes
class StoryScenes(BaseModel):
 story_name: str 
 summary: str 
 background: str 
 lesson: str 
 scenes: List[StoryScene]

## Define a class for an individual scene
class SceneImage(BaseModel):
    prompt: str = Field(description = "A prompt for text to image models that can be used to generate an image.", max_length = 50)
    image_url: str = Field(description = "Url to the image generated by the tool")

@CrewBase
class StoryCrew():
 """StoryCrew crew"""

 agents_config = 'config/story/agents.yaml'
 tasks_config = 'config/story/tasks.yaml'

 @llm
 def llm_model(self):
  return ChatOpenAI(temperature=0.0,  # Set to 0 for deterministic output
                    model="gpt-4o-mini",  # Using the GPT-4 Turbo model
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
  """Creates the StoryCrew crew"""
  script_crew =  Crew(
   agents=self.agents, # Automatically created by the @agent decorator
   tasks=self.tasks, # Automatically created by the @task decorator
   process=Process.sequential,
   verbose=True,
   # process=Process.hierarchical, # In case you wanna use that instead https://docs.crewai.com/how-to/Hierarchical/
  )

  return script_crew
 
@CrewBase
class ArtistCrew():

 agents_config = 'config/visual/agents.yaml'
 tasks_config = 'config/visual/tasks.yaml'

 @llm
 def llm_model(self):
  return ChatOpenAI(temperature=0.0,  # Set to 0 for deterministic output
                    model="gpt-4o-2024-08-06",  # Using the GPT-4 Turbo model
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
  """Create the picture book crew"""
  artist_crew =  Crew(
   agents=self.agents, # Automatically created by the @agent decorator
   tasks=self.tasks, # Automatically created by the @task decorator
   process=Process.sequential,
   verbose=True,
   # process=Process.hierarchical, # In case you wanna use that instead https://docs.crewai.com/how-to/Hierarchical/
  ) 

  return artist_crew
```
**Main Workflow:** Ensure proper hand\-offs between the two agents. For instance, once the Script Writer completes a scene, it automatically passes it on to the Visual Artist, ensuring continuity in the workflow.


```python
agentops.start_session( tags = ['story', 'scripts'] )

## Creating hypothesis or generating questions using QuestCrew
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

## Run the agent
result_images = ArtistCrew().crew().kickoff_for_each(inputs = scene_input)

print("result_images : {result_images.raw}")
```

## Conclusion

The power of generative AI lies in its ability to enhance and support the creative process, offering new tools for content creators to bring their ideas to life. The CrewAI LLM agents assist in turning a simple short story into a captivating comic picture book, helping storytellers at each stage of the journey. By automating repetitive tasks like script breakdown and visual generation, AI allows artists and writers to focus more on the core creative elements, preserving their unique artistic touch. This implementation demonstrates how generative AI can augment creative industries, providing a glimpse into a future where creativity and technology work hand\-in\-hand seamlessly.

Let me know if you’d like to explore more about CrewAI or have questions about implementing a similar creative solution for your projects!


