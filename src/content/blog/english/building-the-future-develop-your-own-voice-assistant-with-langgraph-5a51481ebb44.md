---
title: "Building the Future: Develop Your Own Voice Assistant with LangGraph"
meta_title: "Building the Future: Develop Your Own Voice Assistant with LangGraph"
description: "This article provides a comprehensive guide for developers on creating a voice assistant using LangGraph, an orchestration framework for managing multi-agent systems. It outlines the architecture for building a scalable voice assistant, detailing the process from voice capture to task execution, including scheduling meetings, composing emails, and planning trips. The guide emphasizes LangGraph’s capabilities in defining workflows and managing interactions between agents, enhancing user experience through simultaneous task execution. Future steps include API integrations for enhanced functionality, user interface optimization, and infrastructure scaling to support increased demand."
date: 2024-11-25T15:00:22Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*802yFFOi_kxYiUlgaAn3_A.png"
categories: ["Voice Assistants", "Programming", "Technology/Web"]
author: "Rifx.Online"
tags: ["LangGraph", "voice", "assistant", "workflows", "agents"]
draft: False

---




Today, voice assistants have evolved into fundamental components in intelligent systems that require advanced natural language processing. This article provides a technical guide to developing a voice assistant using LangGraph, an orchestration framework designed to manage complex agent systems. Throughout the text, we will explore how LangGraph enables the coordination of multiple nodes, creating efficient and highly scalable flows. This guide is aimed at developers interested in leveraging LangGraph’s capabilities to implement solutions in AI environments.


## What is LangGraph?

LangGraph emerges as a key tool for developers facing the complexity of building applications with multiple LLM agents. This framework, part of the LangChain ecosystem, provides an efficient architecture for the orchestration of multi\-agent systems, enabling the clear definition of workflows and the management of interactions between agents. Its ability to create cyclic graphs optimises the performance and flexibility of applications, facilitating the integration of diverse functionalities in a single environment. With LangGraph, developers can implement more coherent and effective solutions, transforming the traditional approach to conversational systems development.


## Designing the voice assistant flow



The process begins with the user’s voice capture, which is converted into text for processing. This text serves as input to a decision node, which evaluates the user’s request and determines which tasks to execute from the four available options:

1. Schedule a meeting in the calendar.
2. Compose an e\-mail with a specific message.
3. Respond to a question via an internet search.
4. Plan a trip including finding flights, hotels and suggestions for the right clothes to pack for the time of year.

By allowing the assistant to perform multiple tasks simultaneously, this configuration not only enhances the user experience, but also demonstrates the versatility and power of the LangGraph framework in building complex conversational systems.


## Building the voice component

To build the speech component, we need one component for speech\-to\-text and another piece for text\-to\-speech.

Below, you can see the code for the two pieces:

* **Speech to text**


```python
import speech_recognition as sr
from assistant import config as cfg


def parse_voice() -> tuple[bool, str]:
    r = sr.Recognizer()
    with sr.Microphone() as source:
        recognized = False
        try:
            r.pause_threshold = 1.5
            r.adjust_for_ambient_noise(source)
            audio_data = r.listen(source)
            text = r.recognize_google(audio_data, language=cfg.SELECTED_LANGUAGE)
            recognized = True

        except sr.UnknownValueError:
            text = cfg.LANGUAGE_MSG["unknown_value"][cfg.SELECTED_LANGUAGE]

        except sr.RequestError:
            text = cfg.LANGUAGE_MSG["request_error"][cfg.SELECTED_LANGUAGE]

        except sr.WaitTimeoutError:
            text = cfg.LANGUAGE_MSG["request_error"][cfg.SELECTED_LANGUAGE]

    return recognized, text
```
* **Text to speech**


```python
def play_audio(text: str) -> None:
    myobj = gTTS(text=text, lang=cfg.MSG_SELECTED_LANGUAGE, slow=False)

    mp3_fp = io.BytesIO()
    myobj.write_to_fp(mp3_fp)
    mp3_fp.seek(0)

    audio = AudioSegment.from_file(mp3_fp, format="mp3")
    audio = audio.speedup(playback_speed=cfg.AUDIO_SPEED)

    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_mp3:
        audio.export(temp_mp3.name, format="mp3")
        temp_filename = temp_mp3.name

    pygame.mixer.init()
    pygame.mixer.music.load(temp_filename)
    pygame.mixer.music.play()

    while pygame.mixer.music.get_busy():
        pygame.time.Clock().tick(10)
```
**Building the multi\-agent flow**

With the speech component working, we proceed to build the core of the speech assistant, in other words, the flow of the process from the moment the input is received until a response is obtained. To do this, we make use of graphs and subgraphs in order to have a multi\-agent, scalable and granular orchestrator, making the flow maintainable and replicable.


```python
def build_assistant_graph() -> CompiledGraph: 
    graph_builder = StateGraph(GraphState) 
    graph_builder.add_node(Node.DECIDER.value, decider_node) 
    graph_builder.add_edge(START, Node.DECIDER.value) 
    graph_builder.add_conditional_edges( 
        Node.DECIDER.value, 
        route_tasks_nodes, 
        [Graph.MAIL.value, Graph.CALENDAR.value, Graph.TRAVEL.value, Graph.QUESTION.value, END], 
    ) 

    graph_builder.add_node(Graph.MAIL.value, mail_graph) 
    graph_builder.add_node(Graph.CALENDAR.value, calendar_graph) 
    graph_builder.add_node(Graph.TRAVEL.value, travel_graph) 
    graph_builder.add_node(Graph.QUESTION.value, question_graph) 

    graph_builder.add_edge(Graph.MAIL.value, END) 
    graph_builder.add_edge(Graph.CALENDAR.value, END) 
    graph_builder.add_edge(Graph.TRAVEL.value, END) 
    graph_builder.add_edge(Graph.QUESTION.value, END) 

    return graph_builder.compile() 
```
In the previous code (corresponding to the graph in Figure 1\) you can see how the main graph is defined, in which a decision node is called and the response is routed in parallel through the rest of the subgraphs:

An example of a sub\-graph is the travel component:


```python
def build_travel_graph() -> CompiledGraph: 
    graph_builder = StateGraph(ViajeState) 
    graph_builder.add_node(TravelNode.PARSER.value, parser_travel_node) 
    graph_builder.add_node(TravelNode.FLIGHTS.value, flights_node) 
    graph_builder.add_node(TravelNode.PACKING.value, packagin_node) 
    graph_builder.add_edge(START, TravelNode.PARSER.value) 

    graph_builder.add_conditional_edges( 
        TravelNode.PARSER.value, 
        route_travel_nodes, 
        [ 
            TravelNode.FLIGHTS.value, 
            TravelNode.PACKING.value, 
        ], 
    ) 

    graph_builder.add_node(TravelNode.BOOK.value, book_node) 
    graph_builder.add_edge(TravelNode.FLIGHTS.value, TravelNode.BOOK.value) 
    graph_builder.add_edge(TravelNode.BOOK.value, END) 
    graph_builder.add_edge(TravelNode.PACKING.value, END) 

    return graph_builder.compile() 
```
Nodes are agents that perform a specific function. In this case, the decision maker is a call to a gpt\-4o\-mini model that, depending on the input, decides which node to execute, while the rest of the nodes cover other functionalities such as, for example, the search for answers via tavily or connections via API to clients to search for flights, hotels, etc.

Decision Pydantic model:


```python
class DeciderOptions(BaseModel):
    mail: bool
    calendar: bool
    travel: bool
    question: bool
```
Travel organiser nodes:

**NOTE**: API connections have not been developed, as we are interested in showing the functionality of LangGraph.


```python
...

def parser_travel_node(state: ViajeState) -> dict[str, Any]: 
    travel_chain = build_travel_chain() 
    user_input = state["travel_input"] 
    res = travel_chain.invoke({"text": user_input}) 

    return {"travel": res} 

def flights_node(state: TravelState) -> dict[str, str]:
    # TODO: develop the api component to recommend flights if the date is not specific or to buy tickets if exact date
    formatted_string = cfg.LANGUAGE_MSG["flights_output"][cfg.MSG_SELECTED_LANGUAGE].format(
        destination=state["travel"].destination,
        date=state["travel"].date
    )
    return {"flights_output": formatted_string}
...
```

## Next Steps

Our focus is on expanding functionality, enhancing the user experience, and strengthening the app’s infrastructure to support a broader range of capabilities. The next steps will be divided into three primary phases:

**1\. API integration for functional operations**

The initial development phase will involve building API integrations to expand the assistant’s capability, allowing users to interact seamlessly with essential services. This stage will focus on the following key operations:

* **Hotel and flight booking**: Implement APIs to access hotel and airline booking platforms, allowing users to check availability, make reservations, and confirm bookings directly through voice commands.
* **Calendar management**: Enable calendar API integrations to allow the assistant to set up, modify, and send meeting invitations, providing a hands\-free scheduling experience.
* **Email automation**: Integrate with email services to allow the assistant to send, read, and categorize emails, allowing users to manage their inboxes more effectively.

**2\. User interface and experience optimization**

As the app’s core functionality expands, the next phase will focus on professionalizing the user experience to ensure it aligns with industry standards and enhances user satisfaction. The focus areas will include:

* **Front\-End redesign**: A comprehensive UI refresh to modernize the app’s appearance, making it visually appealing and easy to navigate. This may involve adopting a clean, minimalistic design with user\-friendly elements that guide users intuitively through the app’s functionality.
* **Voice interaction refinement**: Improve the accuracy, responsiveness, and personalization of voice recognition and response systems. This includes optimizing voice prompts to sound natural, improving contextual understanding, and ensuring the assistant responds accurately across diverse use cases.

**3\. Infrastructure scaling and optimization**

To support new functionalities and ensure the app can handle increased demand as adoption grows, establishing a robust infrastructure is essential. This stage will prioritize:

* **Scalable cloud infrastructure**: Transition to a scalable cloud\-based solution capable of handling high loads, supporting rapid scaling, and providing redundancy to maintain uptime.
* **Data security and compliance**: Implement stringent security protocols, including data encryption, secure API communications, and GDPR compliance, to protect user data and foster trust.
* **Performance monitoring and optimization**: Establish continuous monitoring for system performance and API uptime, allowing us to identify and resolve issues proactively. This may include setting up automated alert systems and optimizing server response times.


## Conclusion

In this article, we have explored how to develop a voice assistant using LangGraph, highlighting the importance of its framework for orchestrating complex systems. Through the implementation of a flow that converts speech input to text and uses a decision node to manage various tasks, such as scheduling meetings, composing emails, answering questions and organising trips, we have demonstrated the versatility of LangGraph in the creation of advanced conversational applications.

In addition, we have detailed the steps required to install the essential audio components on different operating systems, enabling real\-time voice capture and playback. This integration is crucial to provide a smooth and effective user experience. By combining the power of LangGraph with audio processing capabilities, we have laid the foundation for a robust and functional voice assistant, capable of adapting to the changing needs of users in a dynamic artificial intelligence environment. As voice technology continues to evolve, the possibilities for improving and expanding this assistant are endless, opening the door to future innovations in human\-computer interaction.

You can see the full code [here](https://github.com/dimc26/langgraph-multiagent-app).


