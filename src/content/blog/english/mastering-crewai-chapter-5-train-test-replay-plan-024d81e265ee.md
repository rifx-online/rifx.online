---
title: "Mastering CrewAI: Chapter 5— Train, Test, Replay & Plan | by Okan Yenigün | Jan, 2025 | Artificial Intelligence in Plain English"
meta_title: "Mastering CrewAI: Chapter 5— Train, Test, Replay & Plan | by Okan Yenigün | Jan, 2025 | Artificial Intelligence in Plain English"
description: "Chapter 5 of Mastering CrewAI discusses the functionalities of training, testing, replaying, and planning within the CrewAI framework. It emphasizes the human-in-the-loop training method, where feedback improves the agents performance over iterations. The chapter details the testing process, including evaluating agent outputs and utilizing replay features to refine tasks without re-fetching data. Additionally, it introduces planning capabilities that create structured task plans before execution. Overall, the chapter outlines a systematic approach to enhancing AI LLMs through iterative training and evaluation."
date: 2025-01-08T23:00:24Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*uIQSaKcgiUjifJtGE_Yh4g.jpeg"
categories: ["Programming", "Machine Learning", "Data Science"]
author: "Rifx.Online"
tags: ["training", "testing", "replay", "planning", "feedback"]
draft: False

---





### Train, Test, Replay \& Plan



In this chapter, we will explore the training, testing, replaying, and planning features of CrewAI.

Previous Chapter:

Let’s create a new project for this post.


```python
crewai create crew train_test_example
```
This will create a template project.


### Train

In training, we use the human\-in\-the\-loop technique. The crew generates results, and we provide feedback on them. Through iterative feedback, the results improve over time. All metadata related to this training is stored in a pickle file.

In `main.py`, there is a `train` method that handles the training process. This method accepts two arguments: `n_iterations`, which specifies the number of iterations, and `filename`, which is the name of the file where the training data will be stored.


```python
def train():
    """
    Train the crew for a given number of iterations.
    """
    inputs = {
        "topic": "AI LLMs"
    }
    try:
        TrainTestExample().crew().train(n_iterations=int(sys.argv[1]), filename=sys.argv[2], inputs=inputs)

    except Exception as e:
        raise Exception(f"An error occurred while training the crew: {e}")
```
The parameters for the `train` method can either be hardcoded or passed as command\-line (CLI) arguments.


```python
 crewai train -n 2 -f train_data.pkl 
```
`-n 2` sets `n_iterations=2`, and `-f train_data.pkl` specifies `filename=train_data.pkl`.

This is the output of the first iteration of the agents:


```python
## Agent: AI LLMs Senior Data Researcher
### Task: Conduct a thorough research about AI LLMs Make sure you find any interesting and relevant information given the current year is 2024.



## Agent: AI LLMs Senior Data Researcher
### Final Answer: 
Here is a list of the most relevant information about AI LLMs as of 2024:

1. **Model Scaling**: Large Language Models (LLMs) are being further scaled, with models such as GPT-4 scaling to hundreds of billions of parameters, improving their understanding and generation of human-like text.

2. **Multimodal Capabilities**: The integration of multimodal inputs (text, images, audio, etc.) into LLMs is becoming standard, allowing AI to process and generate contextually relevant responses across various formats, exemplified by models like DALL-E and CLIP.

3. **Fine-tuning and Customization**: Organizations are increasingly adopting methods to fine-tune LLMs on specific datasets, resulting in specialized versions of models that are optimized for particular industries, such as healthcare, finance, and legal sectors.

4. **AI Ethics and Bias Mitigation**: There is a growing emphasis on addressing ethical concerns and reducing biases in LLMs, with researchers developing frameworks and auditing processes to ensure models are fair, transparent, and accountable.

5. **Energy Efficiency**: Innovations in model training and architecture, including the use of more efficient algorithms and hardware, are being actively pursued to reduce the significant energy consumption associated with training large models.

6. **AI-driven Code Generation**: Tools like Codex have revolutionized software development by enabling LLMs to assist in coding tasks, generating code snippets, suggesting optimizations, and providing documentation, thus improving productivity for developers.

7. **Conversational AI Advances**: Enhanced capabilities in conversational AI have emerged, making interactions with LLMs more natural and contextually aware, leading to improvements in customer support bots and virtual assistants.

8. **Regulatory Frameworks**: Governments and international bodies are working towards creating regulatory frameworks to govern the use of AI LLMs, focusing on safety, privacy, and ethical implications as these technologies become more prevalent.

9. **Integration into Enterprises**: Businesses are increasingly integrating LLMs into their operations, utilizing them for tasks such as content creation, data analysis, and employee training, resulting in enhanced operational efficiency and decision-making.

10. **Community Contribution and Open Models**: The rise of open-source LLM initiatives, such as EleutherAI and Hugging Face’s Transformers, has fostered a collaborative environment for researchers and developers, allowing for innovation and accessibility in AI development.

These developments highlight the rapid advancement and integration of AI LLMs into various sectors, indicating a transformative impact on technology and society in 2024.


 ## Final Result: Here is a list of the most relevant information about AI LLMs as of 2024:

1. **Model Scaling**: Large Language Models (LLMs) are being further scaled, with models such as GPT-4 scaling to hundreds of billions of parameters, improving their understanding and generation of human-like text.

2. **Multimodal Capabilities**: The integration of multimodal inputs (text, images, audio, etc.) into LLMs is becoming standard, allowing AI to process and generate contextually relevant responses across various formats, exemplified by models like DALL-E and CLIP.

3. **Fine-tuning and Customization**: Organizations are increasingly adopting methods to fine-tune LLMs on specific datasets, resulting in specialized versions of models that are optimized for particular industries, such as healthcare, finance, and legal sectors.

4. **AI Ethics and Bias Mitigation**: There is a growing emphasis on addressing ethical concerns and reducing biases in LLMs, with researchers developing frameworks and auditing processes to ensure models are fair, transparent, and accountable.

5. **Energy Efficiency**: Innovations in model training and architecture, including the use of more efficient algorithms and hardware, are being actively pursued to reduce the significant energy consumption associated with training large models.

6. **AI-driven Code Generation**: Tools like Codex have revolutionized software development by enabling LLMs to assist in coding tasks, generating code snippets, suggesting optimizations, and providing documentation, thus improving productivity for developers.

7. **Conversational AI Advances**: Enhanced capabilities in conversational AI have emerged, making interactions with LLMs more natural and contextually aware, leading to improvements in customer support bots and virtual assistants.

8. **Regulatory Frameworks**: Governments and international bodies are working towards creating regulatory frameworks to govern the use of AI LLMs, focusing on safety, privacy, and ethical implications as these technologies become more prevalent.

9. **Integration into Enterprises**: Businesses are increasingly integrating LLMs into their operations, utilizing them for tasks such as content creation, data analysis, and employee training, resulting in enhanced operational efficiency and decision-making.

10. **Community Contribution and Open Models**: The rise of open-source LLM initiatives, such as EleutherAI and Hugging Face’s Transformers, has fostered a collaborative environment for researchers and developers, allowing for innovation and accessibility in AI development.

These developments highlight the rapid advancement and integration of AI LLMs into various sectors, indicating a transformative impact on technology and society in 2024.
```
After the agents generate results, it requests our feedback:


```python
=====
### Please provide feedback on the Final Result and the Agent's actions. Respond with 'looks good' or a similar phrase when you're satisfied.
=====
```
This is my feedback:


```python
Use only two source and give 2 highlights only at the end.
```
Now, in the second iteration, the agents have improved and are using 2 items.


```python
Human feedback:  Use only two source and give 2 highlights only at the end.

## Agent: AI LLMs Senior Data Researcher
### Final Answer: 
Here is a list of the most relevant information about AI LLMs as of 2024, based on two selected sources:

1. **Model Scaling**: LLMs are being further enhanced with massive scaling, reaching up to trillions of parameters, resulting in improved context understanding and more nuanced responses. (Source: OpenAI Blog)

2. **Ethical Considerations**: There is increasing focus on ethical AI developments regarding bias reduction and transparency in LLM deployment, pushing organizations to adopt responsible AI principles. (Source: AI Ethics Journal)

**Highlights**:
- LLMs continue to grow in complexity, reaching unprecedented parameter sizes that allow for deeper contextual comprehension.
- Ethical guidelines are being actively developed to ensure LLMs are deployed responsibly, addressing bias and fostering transparency.


 ## Final Result: Here is a list of the most relevant information about AI LLMs as of 2024, based on two selected sources:

1. **Model Scaling**: LLMs are being further enhanced with massive scaling, reaching up to trillions of parameters, resulting in improved context understanding and more nuanced responses. (Source: OpenAI Blog)

2. **Ethical Considerations**: There is increasing focus on ethical AI developments regarding bias reduction and transparency in LLM deployment, pushing organizations to adopt responsible AI principles. (Source: AI Ethics Journal)

**Highlights**:
- LLMs continue to grow in complexity, reaching unprecedented parameter sizes that allow for deeper contextual comprehension.
- Ethical guidelines are being actively developed to ensure LLMs are deployed responsibly, addressing bias and fostering transparency.

=====
### Please provide feedback on the Final Result and the Agent's actions. Respond with 'looks good' or a similar phrase when you're satisfied.
=====
```
The process continues iteratively until we decide to stop. All metadata from these iterations is stored in the pickle file.


### Test

In testing, we evaluate task performance using an LLM. Specifically, the LLM is used to assess the agents’ outputs after several iterations. By default, a prompt\-based evaluation technique is used, but it can also be customized with methods like RAGAS or other techniques.

In the `main.py` file, there is a `test` function that handles the testing process.


```python
def test():
    """
    Test the crew execution and returns the results.
    """
    inputs = {
        "topic": "AI LLMs"
    }
    try:
        TrainTestExample().crew().test(n_iterations=int(sys.argv[1]), openai_model_name=sys.argv[2], inputs=inputs)

    except Exception as e:
        raise Exception(f"An error occurred while replaying the crew: {e}")
```
We can run testing using:


```python
crewai test
```
After several iterations of the agents, we see a task score table like this:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*BrQ3WeAx7J09_0KJIoJTEA.png)


### Replay

CrewAI allows you to replay a task from the most recent crew kickoff. This feature is especially helpful if you’ve completed a kickoff but want to retry specific tasks or avoid refetching data. Since the agents already retain the context from the kickoff execution, you can simply replay the tasks you need.

The `replay` function in the `main.py` file manages this process.


```python
def replay():
    """
    Replay the crew execution from a specific task.
    """
    try:
        TrainTestExample().crew().replay(task_id=sys.argv[1])

    except Exception as e:
        raise Exception(f"An error occurred while replaying the crew: {e}")
```
To view the task IDs from the latest kickoff, use:


```python
crewai log-tasks-outputs
```
We can view the tasks along with their corresponding task IDs.


```python
Task 1: 8d1fd0fa-3e6d-4d48-b919-d2a1c6474efc
Description: A list with 10 bullet points of the most relevant information about AI LLMs

------
Task 2: 115acd30-7142-4e8e-841b-cf8dda38400b
Description: A fully fledge reports with the mains topics, each with a full section of information. Formatted as markdown without '```'
```
Instead of running the entire crew, let’s use the task ID for Task 2 as a checkpoint and start the crew from there.


```python
crewai replay -t 115acd30-7142-4e8e-841b-cf8dda38400b
```
The output:


```python
## Agent: AI LLMs Reporting Analyst
### Task: Review the context you got and expand each topic into a full section for a report. Make sure the report is detailed and contains any and all relevant information.



## Agent: AI LLMs Reporting Analyst
### Final Answer: 
## Comprehensive Report on Recent Developments in AI LLMs

### Transformers Advancements
Recent advancements in transformer architectures have enhanced their efficiency and performance significantly. Key researchers have focused on dynamic and adaptive computation strategies that adjust the model's operations based on the complexity of the input data. These strategies allow models to intelligently allocate computational resources, reducing unnecessary overhead costs while preserving or even improving overall accuracy. Continuous innovations in layer normalization methods and attention mechanisms have also contributed to the robustness of these architectures, leading to better handling of long-range dependencies in data. Consequently, these developments enable AI LLMs to deliver faster responses and improved contextual understanding in a variety of applications.

### Multimodal Capabilities
AI LLMs are increasingly embodying multimodal capabilities, facilitating the integration of text, images, and audio for a more holistic processing approach. Models such as GPT-4 and CLIP exemplify this trend, enabling them to derive meaning and generate content across different media. This integration allows for richer and more nuanced interactions, refining how AI systems understand context and improve user engagements. For instance, users can input queries that involve both visual and textual elements, prompting the model to respond in a way that considers the full spectrum of input modalities, enhancing the relevance and accuracy of the generated responses.

### Efficient Fine-Tuning Techniques
Recent successful practices in model fine-tuning emphasize efficiency and resource management. Techniques like Low-Rank Adaptation (LoRA) and Prompt Tuning have emerged as popular methodologies, allowing developers to adjust large models to specific tasks with a fraction of the computational overhead typically required. LoRA focuses on introducing low-rank matrices that modify the transformer parameters, conserving model size without compromising performance. Similarly, Prompt Tuning employs task-specific prompts to guide model outputs with minimal training data. These advances promise to reduce the barriers for organizations looking to tailor AI LLMs to their unique requirements, promoting a faster pace of adoption across various sectors.

### Ethics and Safety
Ethical considerations surrounding AI technologies have reached a critical point, prompting organizations to invest heavily in responsible AI frameworks. Active discussions are underway to address concerns regarding biases prevalent in training data and the outputs generated by AI LLMs. Institutions are taking a proactive approach to mitigate these risks by establishing robust safety measures and continually refining ethical guidelines. Initiatives include bias detection research, transparency in model training processes, and mechanisms for user feedback to build a more equitable and safe AI landscape. This evolving framework aims to ensure that AI technologies benefit society while minimizing potential harms.

### OpenAI API Expansion
OpenAI has made significant strides in expanding its API offerings to support diverse business needs. By integrating customizable options, developers can now more easily access advanced features and capabilities, such as tailored model outputs and flexible query handling. This expansion has enabled businesses to enhance user experience by embedding state-of-the-art AI functionalities into their applications, facilitating innovative solutions across industries. As more organizations adopt these tools, they not only streamline their operational workflows but also empower users through enriched interactions with AI systems.

### Few-Shot and Zero-Shot Learning
The capabilities of AI LLMs in few-shot and zero-shot learning have shown remarkable advancements, enabling them to execute specific tasks with minimal training examples. Few-shot learning allows models to generalize from just a few instances, while zero-shot learning enables them to tackle entirely new tasks without prior examples. This paradigm shift drastically reduces the need for extensive labeled datasets, which traditionally posed a challenge in training AI systems. By showcasing impressive adaptability in understanding and performing new tasks based solely on contextual hints, AI LLMs are becoming more versatile tools applicable to real-world scenarios.

### Run-time Optimization
To enhance the usability of LLMs in resource-constrained environments, various run-time optimization techniques have been developed. Model pruning, which involves eliminating less important parameters, and quantization, which reduces the precision of the model's numerical representations, are critical strategies being implemented. These techniques effectively reduce the overall model size and computational demand, making powerful AI models deployable on devices with limited GPU or CPU resources. This optimization not only makes advanced AI capabilities accessible to a wider range of devices but also opens up possibilities for new applications in mobile or edge computing contexts.

### Open-source Movement
The resurgence of the open-source movement in AI development has significantly changed the landscape for researchers and developers. Organizations are releasing powerful models like LLaMA and Falcon, democratizing access to cutting-edge AI LLMs. This shift allows smaller entities and independent researchers to experiment with sophisticated tools without the financial constraints often associated with proprietary systems. The community-driven nature of these initiatives fosters innovation and collaboration, contributing to a more vibrant ecosystem where diverse applications, innovations, and methodologies can flourish.

### Real-time Conversational AI
AI LLMs are increasingly being harnessed in real-time conversational applications, transforming customer service experiences and enhancing virtual assistants. With significant improvements in contextual awareness and responsiveness, these AI systems are capable of handling complex queries and engaging users in more meaningful dialogues. Real-time application of LLMs allows businesses to offer timely assistance, resolve issues rapidly, and provide personalized experiences, highlighting the potential of AI to revolutionize engagement strategies across various sectors.

### Innovations in Training Methods
Innovations in training methodologies are reshaping how AI LLMs learn from interactions and improve output quality. Techniques such as self-supervised learning, where models learn from vast amounts of unlabeled data, and reinforcement learning from human feedback (RLHF), which uses human evaluations to refine model responses, are leading the charge. These approaches enhance the training process, allowing models to acquire knowledge more efficiently and effectively. By improving engagement and interaction quality, these training methods are crucial in adapting LLMs to user needs and preferences, ensuring continuous learning and evolution of AI capabilities.

These detailed sections encapsulate the most relevant developments and trends in AI LLMs as of 2024, showcasing the rapid evolution of this technology and its implications for various fields.
```

### Plan

The planning feature in CrewAI enables you to incorporate planning capabilities into your crew. When activated, before each crew iteration, all crew information is sent to an `AgentPlanner`, which creates a step\-by\-step task plan. This plan is then appended to each task description.


```python
@crew
 def crew(self) -> Crew:
  """Creates the TrainTestExample crew"""
  # To learn how to add knowledge sources to your crew, check out the documentation:
  # https://docs.crewai.com/concepts/knowledge#what-is-knowledge

  return Crew(
   agents=self.agents, # Automatically created by the @agent decorator
   tasks=self.tasks, # Automatically created by the @task decorator
   process=Process.sequential,
   verbose=True,
   planning=True,
   # process=Process.hierarchical, # In case you wanna use that instead https://docs.crewai.com/how-to/Hierarchical/
  )
```
Let’s run the Crew:


```python
crewai run
```
This time, before the agents execute their tasks, the `AgentPlanner` takes charge and outlines the process for the tasks.


```python
[2025-01-04 23:06:26][INFO]: Planning the crew execution
## Agent: AI LLMs Senior Data Researcher
### Task: Conduct a thorough research about AI LLMs Make sure you find any interesting and relevant information given the current year is 2024.
1. Identify the key themes and topics related to AI LLMs that have emerged in 2024, such as advancements in architecture, ethical considerations, applications, and challenges. 2. Utilize academic databases, industry journals, and reputable online resources for the latest research articles, white papers, and case studies on AI LLMs. 3. Compile a list of relevant conferences, webinars, and collaborative platforms focusing on AI LLMs happening in 2024, noting any keynote speakers or major announcements. 4. Search for expert opinions from thought leaders and practitioners in the field through interviews, blogs, and podcasts. 5. Gather data on the latest AI LLM performance metrics, including benchmarks and comparative analyses to understand their improvements. 6. Review case studies that highlight innovative applications of AI LLMs in various sectors such as healthcare, finance, and education. 7. Examine security and privacy issues that have arisen with the increase in LLM deployment. 8. Analyze the impact of AI LLMs on the workforce and potential job displacement concerns. 9. Summarize findings into 10 bullet points highlighting the most pertinent and striking information regarding the state of AI LLMs in 2024. 10. Ensure all findings are accurately cited and that there are no omissions of significant developments experienced in the field.
```
Next:


### Read More


### Sources

<https://docs.crewai.com/concepts/training>

<https://docs.crewai.com/concepts/planning>


## Thank you for being a part of the community

*Before you go:*

* Be sure to **clap** and **follow** the writer ️👏**️️**
* Follow us: [**X**](https://x.com/inPlainEngHQ) \| [**LinkedIn**](https://www.linkedin.com/company/inplainenglish/) \| [**YouTube**](https://www.youtube.com/channel/UCtipWUghju290NWcn8jhyAw) \| [**Newsletter**](https://newsletter.plainenglish.io/) \| [**Podcast**](https://open.spotify.com/show/7qxylRWKhvZwMz2WuEoua0)
* [**Check out CoFeed, the smart way to stay up\-to\-date with the latest in tech**](https://cofeed.app/) **🧪**
* [**Start your own free AI\-powered blog on Differ**](https://differ.blog/) 🚀
* [**Join our content creators community on Discord**](https://discord.gg/in-plain-english-709094664682340443) 🧑🏻‍💻
* For more content, visit [**plainenglish.io**](https://plainenglish.io/) \+ [**stackademic.com**](https://stackademic.com/)

