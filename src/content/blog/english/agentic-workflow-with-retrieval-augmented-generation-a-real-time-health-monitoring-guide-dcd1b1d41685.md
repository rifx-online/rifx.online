---
title: "Agentic Workflow and Retrieval-Augmented Generation: A Real-Time Health Monitoring Guide"
meta_title: "Agentic Workflow and Retrieval-Augmented Generation: A Real-Time Health Monitoring Guide"
description: "The article presents an innovative modular architecture for real-time health monitoring of at-risk seniors, utilizing a multi-agent system (MAS) integrated with Retrieval-Augmented Generation (RAG). This agentic workflow allows for dynamic, event-driven responses to patient data, enhancing the accuracy of vital sign analysis, anomaly detection, risk assessment, and actionable recommendations. Key technologies include Streamlit, FAISS, and large language models, facilitating a scalable and adaptable healthcare solution. The framework emphasizes modularity, resilience, and the potential for personalized patient care while highlighting the need for further exploration of ethical considerations and system robustness."
date: 2024-12-19T21:48:05Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*J6fSFSR41xaL98xksu-hgg.jpeg"
categories: ["Health", "Technology", "Ethics"]
author: "Rifx.Online"
tags: ["modular", "MAS", "RAG", "FAISS", "Streamlit"]
draft: False

---






*Discover how this modular architecture revolutionizes real\-time medical data analysis, enhancing the supervision of at\-risk seniors. By integrating an Multi\-agent\-Systems (MAS) with Retrieval\-Augmented Generation (RAG), this guide equips professionals in healthcare and AI with the tools to optimize patient monitoring and deliver accurate, actionable insights.*


## Introduction

Traditional healthcare monitoring systems often rely on static, linear pipelines. Data is processed, rules are applied, and results are generated. While effective, this linear approach can be rigid, slow to adapt, and insufficiently reactive to the ever\-changing clinical context of patients, especially at\-risk seniors.

In this guide, we move towards an **agentic workflow** — a non\-static, event\-driven architecture that orchestrates multiple specialized agents. Each agent focuses on a distinct aspect of healthcare analytics, from real\-time monitoring of vital signs to context\-rich diagnostics powered by Retrieval\-Augmented Generation (RAG), emergency response, and communication with caregivers. By leveraging this modular, multi\-agent system and integrating state\-of\-the\-art large language models (LLMs) along with FAISS\-based vector databases, we create a system that is both scalable and responsive.


## Synthetic Dataset: Building the Foundation

To test this architecture, we generated a synthetic dataset simulating patient data using the `Faker`, `pandas`, and `NumPy` libraries. This dataset provides a practical basis for analysis without compromising patient confidentiality. Here’s the script:


```python
from faker import Faker
import pandas as pd
import numpy as np

## Initialize Faker for generating synthetic data
faker = Faker()

## Function to generate synthetic dataset
def generate_synthetic_dataset(num_rows=1000):
    data = {
        'patient_id': [faker.uuid4() for _ in range(num_rows)],
        'name': [faker.name() for _ in range(num_rows)],
        'age': np.random.randint,
        'heart_rate': np.random.randint,
        'spo2': np.random.uniform,
        'medical_conditions': [faker.words(nb=3) for _ in range(num_rows)],
        'medications': [faker.words(nb=2) for _ in range(num_rows)],
    }
    return pd.DataFrame(data)

## Generate the synthetic dataset
synthetic_dataset = generate_synthetic_dataset(1000)

## Save the dataset to a CSV file (optional)
synthetic_dataset.to_csv("synthetic_health_dataset.csv", index=False)

## Display the first few rows of the dataset
print(synthetic_dataset.head())
```
**Explanation:**

* **patient\_id**: Generates unique UUIDs for each patient.
* **name**: Generates random names.
* **age**: Random ages between 65 and 90\.
* **heart\_rate**: Heart rates between 60 and 180 bpm.
* **spo2**: Oxygen saturation levels between 85% and 100%.
* **medical\_conditions** and **medications**: Generates lists of medical conditions and medications.

This generated data simulates realistic patient profiles, providing a solid foundation for further analysis.


## The Challenge

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*StUzVW377DEk1Tq_l4QBzg.jpeg)

We aim to address four primary goals:

1. **Accurate Vital Sign Analysis:** Continuously monitor heart rate, SpO₂, stress levels, and sleep quality.
2. **Anomaly Detection:** Identify signs that deviate from normal ranges and may indicate health risks.
3. **Risk Level Assessment:** Categorize patients’ conditions into risk levels to guide clinical decisions.
4. **Actionable Recommendations:** Provide context\-driven, personalized actions for caregivers and professionals.

A single, static pipeline struggles to meet these goals effectively. Instead, we employ a **multi\-agent system** orchestrated via an agentic, event\-driven workflow.


## Agentic Workflow and Multi\-Agent Architecture

**Why a Multi\-Agent System?**A multi\-agent system (MAS) empowers each component — called an agent — to specialize in a particular domain. We use four main agents:

* **MonitoringAgent:** Observes patient data, detects anomalies, and publishes observation events.
* **DiagnosticAgent:** Uses Retrieval\-Augmented Generation (RAG) and LLMs to interpret observations and produce decisions.
* **EmergencyAgent:** Responds to critical alerts by taking immediate actions.
* **CommunicationAgent:** Sends out notifications and keeps track of communication history.

By utilizing an **EventBus**, these agents communicate asynchronously. When the MonitoringAgent detects an anomaly, it publishes an event. The DiagnosticAgent, subscribed to this event, reacts by retrieving relevant medical knowledge and producing a data\-driven decision. If necessary, the EmergencyAgent and CommunicationAgent are subsequently triggered. The result is a non\-static workflow that adapts as new data and conditions emerge.


## Key Technologies

1. **Streamlit:** For building an intuitive user interface to visualize patient data and outcomes.
2. **Sentence Transformers (pritamdeka/S\-PubMedBert\-MS\-MARCO):** Domain\-specific embeddings providing context\-rich semantic understanding.
3. **FAISS:** A vector database enabling high\-speed semantic search for retrieving relevant medical documents.
4. **LangChain and ChatOpenAI:** For building LLM chains (LLMChain), integrating prompts, templates, and models (like GPT\-3\.5\-turbo) to generate diagnostic insights.
5. **Pandas, NumPy, scikit\-learn (TF\-IDF):** For data manipulation and sparse vectorization.


## Code Overview

Below is a condensed version of the updated code integrating a multi\-agent approach, event\-driven workflow, and RAG. (For brevity, we show key classes and logic.)


## Loading the Embedding Model


```python
import streamlit as st
from sentence_transformers import SentenceTransformer

@st.cache_resource
def load_embedding_model():
    return SentenceTransformer('pritamdeka/S-PubMedBert-MS-MARCO')

embedding_model = load_embedding_model()
```
This caches the medical embedding model, accelerating repeated runs.


## Defining Data Structures

We use Python dataclasses for clean, maintainable data representations:


```python
from dataclasses import dataclass
from datetime import datetime
from typing import Dict, List, Any

@dataclass
class Observation:
    timestamp: datetime
    vital_signs: Dict[str, float]
    risk_level: str
    anomalies: List[str]

@dataclass
class Decision:
    alert_level: str
    priority: int
    recommended_actions: List[str]
    justification: str
    follow_up_instructions: str

@dataclass
class PatientProfile:
    id_utilisateur: Any
    age: int
    medical_conditions: List[str]
    medications: List[str]
```

## The Event Bus for Non\-Static Workflow

The `EventBus` is at the heart of the agentic workflow, enabling asynchronous, event\-driven communications:


```python
from collections import defaultdict
from typing import Callable

class EventBus:
    def __init__(self):
        self.subscribers = defaultdict(list)

    def subscribe(self, event_type: str, callback: Callable):
        self.subscribers[event_type].append(callback)

    def publish(self, event_type: str, data: Any):
        for callback in self.subscribers[event_type]:
            callback(data)
```

## Agents


### MonitoringAgent

The `MonitoringAgent` observes patient data, detects anomalies, and publishes `ObservationEvent`:


```python
class MonitoringAgent:
    def __init__(self, df, patient_profiles, event_bus):
        self.df = df
        self.patient_profiles = patient_profiles
        self.event_bus = event_bus
        # Set alert thresholds and build FAISS index here
        # ...

    def observe(self, patient_data):
        # Evaluate vital signs, detect anomalies, assess risk
        observation = Observation(
            timestamp=datetime.now(),
            vital_signs={ ... },
            risk_level="medium",
            anomalies=[ ... ]
        )
        # Publish the event for other agents to react
        self.event_bus.publish('ObservationEvent', (observation, patient_data))
```

### DiagnosticAgent with RAG

The `DiagnosticAgent` listens for `ObservationEvent`, retrieves context from a FAISS index, and uses a language model (LLM) with a `PromptTemplate` to produce a `Decision`. This agent demonstrates how Retrieval\-Augmented Generation leverages external medical knowledge dynamically.


```python
from langchain import LLMChain
from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
import json

class DiagnosticAgent:
    def __init__(self, openai_api_key, embedding_model, event_bus):
        self.event_bus = event_bus
        self.llm = ChatOpenAI(openai_api_key=openai_api_key, model_name="gpt-3.5-turbo")
        self.embedding_model = embedding_model
        # Subscribe to ObservationEvent
        self.event_bus.subscribe('ObservationEvent', self.handle_observation_event)
        # Setup RAG with FAISS and TF-IDF
        # ...

    def handle_observation_event(self, data):
        observation, patient_data = data
        decision = self.decide(observation, patient_data)
        self.event_bus.publish('DecisionEvent', (decision, patient_data))

    def decide(self, observation, patient_data):
        prompt_template = PromptTemplate(
            input_variables=["patient_data", "observation"],
            template="""
            You are a medical assistant.
            Patient data:
            {patient_data}
            Observation:
            {observation}

            Based on this information, determine:
            - alert_level (red, orange, green)
            - priority (1=high,2=medium,3=low)
            - recommended_actions (list)
            - justification
            - follow_up_instructions

            Respond in JSON format:
            {{
              "alert_level": "...",
              "priority": "...",
              "recommended_actions": [...],
              "justification": "...",
              "follow_up_instructions": "..."
            }}
            """
        )

        chain = prompt_template | self.llm
        response = chain.invoke({
            "patient_data": patient_data.to_dict(),
            "observation": observation
        })
        decision_data = json.loads(response)
        if isinstance(decision_data['recommended_actions'], str):
            decision_data['recommended_actions'] = [decision_data['recommended_actions']]
        return Decision(
            alert_level=decision_data['alert_level'],
            priority=int(decision_data['priority']),
            recommended_actions=decision_data['recommended_actions'],
            justification=decision_data['justification'],
            follow_up_instructions=decision_data['follow_up_instructions']
        )
```

### EmergencyAgent

Activated when critical decisions are made, the `EmergencyAgent` acts on `DecisionEvent`:


```python
class EmergencyAgent:
    def __init__(self, event_bus):
        self.event_bus = event_bus
        self.event_bus.subscribe('DecisionEvent', self.handle_decision_event)

    def handle_decision_event(self, data):
        decision, patient_data = data
        self.act(patient_data, decision)

    def act(self, patient_data, decision):
        if decision.alert_level == 'red':
            # Activate emergency protocols, notify external services
            pass
```

### CommunicationAgent

This agent sends notifications and logs communication actions, ensuring caregivers are informed:


```python
class CommunicationAgent:
    def __init__(self, event_bus):
        self.event_bus = event_bus
        self.event_bus.subscribe('DecisionEvent', self.handle_decision_event)
        self.notification_history = []

    def handle_decision_event(self, data):
        decision, _ = data
        self.send_notification(decision)

    def send_notification(self, decision):
        message = self._create_notification_message(decision)
        self.notification_history.append({
            'timestamp': datetime.now(),
            'message': message,
            'alert_level': decision.alert_level
        })
        print(f"[NOTIFICATION] Level {decision.alert_level.upper()}: {message}")

    def _create_notification_message(self, decision):
        actions = ', '.join(decision.recommended_actions)
        if decision.alert_level == 'red':
            return f"URGENT: Critical situation detected. Actions needed: {actions}"
        elif decision.alert_level == 'orange':
            return f"ATTENTION: Increased monitoring required. Suggested actions: {actions}"
        else:
            return "Situation normal. No immediate action required."
```

## Agent Coordinator

The `AgentCoordinator` orchestrates the entire system. It loads patient data, initializes agents, sets up the event\-driven workflow, and starts the monitoring process.


```python
class AgentCoordinator:
    def __init__(self, df, embedding_model, openai_api_key):
        self.df = df
        self.embedding_model = embedding_model
        self.openai_api_key = openai_api_key
        self.patient_profiles = self.load_patient_profiles()

        # Create the EventBus
        self.event_bus = EventBus()

        # Initialize agents with the event bus
        self.monitoring_agent = MonitoringAgent(df, self.patient_profiles, self.event_bus)
        self.diagnostic_agent = DiagnosticAgent(openai_api_key, embedding_model, self.event_bus)
        self.emergency_agent = EmergencyAgent(self.event_bus)
        self.communication_agent = CommunicationAgent(self.event_bus)

        # Setup knowledge base and RAG in DiagnosticAgent
        # ...

    def load_patient_profiles(self):
        profiles = {}
        for _, row in self.df.iterrows():
            profiles[row['id_utilisateur']] = PatientProfile(
                id_utilisateur=row['id_utilisateur'],
                age=row.get('age', 0),
                medical_conditions=row.get('medical_conditions', []),
                medications=row.get('medications', [])
            )
        return profiles

    def start_workflow(self):
        for _, patient_data in self.df.iterrows():
            self.monitoring_agent.observe(patient_data)
```

## Advantages of the Agentic Workflow

1. **Adaptability:** The event\-driven nature ensures that as soon as new data or conditions appear, the agents dynamically respond.
2. **Modularity:** Adding a new agent (e.g., a MentalHealthAgent) is straightforward. You simply integrate it into the event bus and define how it reacts to specific events.
3. **Scalability:** With multiple agents working concurrently, the system can handle more data and more complex logic without becoming a monolith.
4. **Resilience:** If one agent needs updating or debugging, others continue to function, ensuring continuous patient monitoring and stability.


## Conclusion

This agentic workflow highlights the value of modularity in transforming health data analytics. By leveraging tools like Streamlit, FAISS, and RAG, you can build scalable systems that provide ethical and impactful healthcare solutions.

This article provides a foundation for understanding how a multi\-agent system and an agentic workflow can transform real\-time health monitoring. However, to keep the discussion focused and accessible, several important aspects have not been explored. These topics, while beyond the scope of this article, are essential for developing a robust and impactful system:

**Regulatory and Ethical Considerations**While this article briefly addresses medical decision\-making, the use of large language models (LLMs) and automated recommendations in healthcare raises significant ethical, legal, and compliance questions. Issues such as data privacy (e.g., GDPR, HIPAA), medical certifications, clinical validation of recommendations, and the delineation of responsibility require careful attention. These areas deserve a dedicated discussion to address how such systems can be deployed responsibly and ethically.

**System Robustness and Performance**The technical framework presented here lays the groundwork, but topics like anomaly threshold calibration, the reliability of metrics, and real\-time performance at scale (e.g., latency, throughput, agent failure handling) remain largely unexplored. Moreover, ensuring the system’s robustness through comprehensive testing — unit tests, integration tests, and clinical validations — is crucial for deployment in high\-stakes environments. These aspects would require an in\-depth exploration of engineering best practices and performance optimization strategies.

**Patient\-Specific Personalization and Continuous Adaptation**While the system is designed to be dynamic, there is immense potential to explore how it could adapt over time for individual patients. Examples might include leveraging longitudinal data to detect trends, dynamically adjusting thresholds, and refining decision\-making based on a patient’s history. This article establishes the technical foundation but leaves room for a richer discussion on how such personalized adaptation could enhance patient care.

**Concrete Agent Interactions in Action**The multi\-agent architecture described here demonstrates structure and potential, but more tangible examples of agent interactions would give the system greater depth. Scenarios such as a sudden drop in SpO₂ detected by the MonitoringAgent, the DiagnosticAgent identifying a high\-risk situation, the EmergencyAgent activating a protocol, and the CommunicationAgent notifying the attending physician would illustrate the real\-world application of the system. These examples could provide deeper insights into the practical benefits and challenges of the workflow.

Each of these topics deserves further exploration and could form the basis for future articles. By delving into these areas, we can address the complexities and nuances of creating a truly scalable, ethical, and patient\-centered healthcare solution. If you’re interested in any of these dimensions, let me know — I’d be delighted to explore them in more detail!


### Additional Insights


## Annex 1: Importing Modules and Initializing Resources

This section provides the code to import the necessary modules and initialize the embedding model for efficient use in the system.


```python
import streamlit as st
from sentence_transformers import SentenceTransformer

## Cache the embedding model to optimize repeated runs
@st.cache_resource
def load_embedding_model():
    return SentenceTransformer('pritamdeka/S-PubMedBert-MS-MARCO')  # Optimized for medical contexts

embedding_model = load_embedding_model()
```
**Explanation**:

* The model `pritamdeka/S-PubMedBert-MS-MARCO` is trained on PubMed and MS MARCO datasets, making it ideal for medical applications.
* This step ensures reduced initialization time during repeated executions by caching the model.


## Annex 2: Defining Data Classes

The following Python `dataclasses` are used to structure patient and system information consistently.


```python
from dataclasses import dataclass
from typing import List, Dict, Any
from datetime import datetime

@dataclass
class Observation:
    timestamp: datetime
    vital_signs: Dict[str, float]
    risk_level: str
    anomalies: List[str]

@dataclass
class Decision:
    alert_level: str
    priority: int
    recommended_actions: List[str]
    justification: str
    follow_up_instructions: str

@dataclass
class PatientProfile:
    patient_id: Any
    age: int
    medical_conditions: List[str]
    medications: List[str]
```
**Explanation**:

* `Observation`: Captures real\-time vital signs, assessed risk levels, and detected anomalies.
* `Decision`: Represents the system's output for caregivers, including recommended actions and justifications.
* `PatientProfile`: Stores patient\-specific data such as medical history and medications.


## Annex 3: Event Bus for Asynchronous Communication

The `EventBus` facilitates communication between agents in the multi\-agent system, enabling event\-driven workflows.


```python
from collections import defaultdict
from typing import Callable, Any

class EventBus:
    def __init__(self):
        self.subscribers = defaultdict(list)

    def subscribe(self, event_type: str, callback: Callable):
        self.subscribers[event_type].append(callback)

    def publish(self, event_type: str, data: Any):
        for callback in self.subscribers[event_type]:
            callback(data)
```
**Explanation**:

* Agents subscribe to specific event types and are notified when relevant events occur.
* This decoupled communication ensures flexibility and scalability in the workflow.


## Annex 4: Agent Implementation Examples


### MonitoringAgent

Detects anomalies in patient data and publishes observation events.


```python
class MonitoringAgent:
    def __init__(self, df, patient_profiles, event_bus):
        self.df = df
        self.patient_profiles = patient_profiles
        self.event_bus = event_bus

    def observe(self, patient_data):
        # Example of anomaly detection logic
        observation = Observation(
            timestamp=datetime.now(),
            vital_signs={
                'heart_rate': patient_data['heart_rate'],
                'spo2': patient_data['spo2']
            },
            risk_level="medium",
            anomalies=["High heart rate"]  # Example anomaly
        )
        self.event_bus.publish('ObservationEvent', (observation, patient_data))
```

### DiagnosticAgent

Uses RAG and LLMs to analyze observations and generate decisions.


```python
from langchain import LLMChain
from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
import json

class DiagnosticAgent:
    def __init__(self, openai_api_key, embedding_model, event_bus):
        self.event_bus = event_bus
        self.llm = ChatOpenAI(openai_api_key=openai_api_key, model_name="gpt-3.5-turbo")
        self.embedding_model = embedding_model
        self.event_bus.subscribe('ObservationEvent', self.handle_observation_event)

    def handle_observation_event(self, data):
        observation, patient_data = data
        decision = self.decide(observation, patient_data)
        self.event_bus.publish('DecisionEvent', (decision, patient_data))

    def decide(self, observation, patient_data):
        prompt_template = PromptTemplate(
            input_variables=["patient_data", "observation"],
            template="""
            You are a medical assistant.
            Patient data:
            {patient_data}
            Observation:
            {observation}

            Based on this information, determine:
            - alert_level (red, orange, green)
            - priority (1=high,2=medium,3=low)
            - recommended_actions (list)
            - justification
            - follow_up_instructions

            Respond in JSON format.
            """
        )
        chain = prompt_template | self.llm
        response = chain.invoke({
            "patient_data": patient_data.to_dict(),
            "observation": observation
        })
        decision_data = json.loads(response)
        return Decision(
            alert_level=decision_data['alert_level'],
            priority=int(decision_data['priority']),
            recommended_actions=decision_data['recommended_actions'],
            justification=decision_data['justification'],
            follow_up_instructions=decision_data['follow_up_instructions']
        )
```

## Annex 5: FAISS\-Based Retrieval for RAG

FAISS is used for high\-speed semantic searches in the knowledge base.


```python
import faiss
from sentence_transformers import SentenceTransformer

class DiagnosticAgent:
    def __init__(self, knowledge_base):
        self.model = SentenceTransformer('pritamdeka/S-PubMedBert-MS-MARCO')
        self.kb_embeddings = self.model.encode(knowledge_base)
        self.index = faiss.IndexFlatL2(self.kb_embeddings.shape[1])
        self.index.add(self.kb_embeddings)

    def retrieve_context(self, query, k=5):
        query_embedding = self.model.encode([query])
        distances, indices = self.index.search(query_embedding, k)
        return [knowledge_base[i] for i in indices[0]]
```
**Explanation**:

* **Semantic Search**: Retrieves the most relevant medical documents based on the query.
* **RAG Integration**: Enriches diagnostics with real\-time, context\-specific knowledge.


## Annex 6: Agent Coordinator

The `AgentCoordinator` orchestrates all agents and workflows, ensuring seamless interactions.


```python
class AgentCoordinator:
    def __init__(self, df, embedding_model, openai_api_key):
        self.df = df
        self.embedding_model = embedding_model
        self.openai_api_key = openai_api_key
        self.event_bus = EventBus()
        self.monitoring_agent = MonitoringAgent(df, self.load_patient_profiles(), self.event_bus)
        self.diagnostic_agent = DiagnosticAgent(openai_api_key, embedding_model, self.event_bus)
        self.emergency_agent = EmergencyAgent(self.event_bus)
        self.communication_agent = CommunicationAgent(self.event_bus)

    def load_patient_profiles(self):
        profiles = {}
        for _, row in self.df.iterrows():
            profiles[row['patient_id']] = PatientProfile(
                patient_id=row['patient_id'],
                age=row.get('age', 0),
                medical_conditions=row.get('medical_conditions', []),
                medications=row.get('medications', [])
            )
        return profiles

    def start_workflow(self):
        for _, patient_data in self.df.iterrows():
            self.monitoring_agent.observe(patient_data)
```
**Explanation**:

* **Workflow Management**: Coordinates the agents’ tasks and event responses.
* **Scalability**: Designed to handle multiple patients concurrently.

