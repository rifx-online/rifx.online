---
title: "Case Study: Turning Doctor Transcripts into Temporal Medical Record Knowledge Graphs"
meta_title: "Case Study: Turning Doctor Transcripts into Temporal Medical Record Knowledge Graphs"
description: "Showcase of Data Transformation Process, Breakdown of 25 dev hours involved, Schemas used, Questions & Responses, and Graph created"
date: 2024-11-13T01:22:29Z
image: "https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*DUNtg-0w2z-vlF9SCvt5UA.png"
categories: ["Health", "Data Science", "Machine Learning"]
author: "Rifx.Online"
tags: ["transcripts", "Temporal", "Knowledge", "Graphs", "vector"]
draft: False

---




Interested in turning Doctor/Patient medical records and transcripts into Temporal Knowledge Graph that you can ask complex questions across multiple medical histories, time periods, and patients?

In this case study, we show how Medical Transcripts are turned into Temporal Knowledge Graphs that you can rely on for the purposes of RAG and analytics. We show what real Question \& Answers are against this system, and what type of business outcomes you can achieve with this system. As far as we are aware, the combination of steps here is a relatively novel Knowledge Graph implementation.


### Data used

For data privacy reasons, we used a synthetic dataset of Medical Transcripts that we created out of Synthea data found here: [https://synthea.mitre.org/downloads](https://proxy.rifx.online/https://synthea.mitre.org/downloads). The below is an example of one of the medical transcripts used as the input data for the Knowledge Graph creation. We combined these transcript data with structured medical records in the Synthea data. We had \~75 transcripts that covered 10 patients (i.e. each patient had 5–10 transcripts). Here is an example of a transcript used:




## Novel Knowledge Graph Architecture Overview


### Nodes:

We have 5 types of Nodes: Patient, Observation, Immunization, Condition and Encounter Type


### Triples (Sample List):

Patient \-\> Had Encounter \-\> Encounter

Patient \-\> Has Condition \-\> Condition

Patient \-\> Received \-\> Immunization

Patient \-\> Has Measurement \-\> Observation


### Chunks:

Chunks are chunks of text that are standalone objects. Chunks are tied to each Triple, and there can be many Chunks tied to a single Triple. Instead of being the unstructured source of the Triple, the Chunks in this case are summaries and key points related to each Triple type. As a result, we have 6 types of Chunks:\- Patient Demographic Chunks, Condition Summary Chunks, Visit Chunks, Observation Chunks, Immunization Chunks and Condition Detail Chunks.

An example of what different type of chunks are tied to triples look like the following:


```python
1. Patient -> EncounterType
Triple: (Patient) -[had_encounter]-> (EncounterType)
- Chunk_ids link to specific visit instances
- Example Chunk: "Annual physical on 2024–01–15. BP 120/80, routine screenings 
updated."

2. Patient -> Condition
Triple: (Patient) -[has_condition]-> (Condition)
- Chunk_ids link to condition episodes
- Example Chunk: "Diagnosed with hypertension on 2020–03–10. Status: active. 
Managed with medication."

3. Patient -> Immunization
Triple: (Patient) -[received]-> (Immunization)
- Chunk_ids link to administration records
- Example Chunk: "Influenza vaccine administered on 2024–01–15."

4. Patient -> Observation
Triple: (Patient) -[has_measurement]-> (Observation)
- Chunk_ids link to measurement instances
- Example Chunk: "2024–01–15: Blood Pressure 120/80 mmHg, Weight 70kg."
```
![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*8dH_7tP6xheCaW6K)

**Link to the Graph created: [https://proxy.rifx.online/https://main\-\-whyhowai.netlify.app/public/graph/673032011997e08c8849316c](https://proxy.rifx.online/https://main--whyhowai.netlify.app/public/graph/673032011997e08c8849316c)**

With this particular graph architecture, where you can have key points and summaries tied to triples, you can then focus on landing on the right set of triples through an unstructured search, and subsequently bringing in all the relevant key information through the linked chunks in a structured way.


## Unique to WhyHow Architecture

There are a few things unique to the WhyHow graph infrastructure that allows us to build this architecture in a simple way.

Firstly, Triples are embedded and retrieved through vector search, avoiding a common retrieval issue of having to use Text2Cypher for the identification of nodes, relationships, and then Cypher query construction just to land on the right Triple. This has shown to dramatically [improve retrieval accuracy by up to 3x](https://proxy.rifx.online/https://readmedium.com/knowledge-table-multi-document-rag-extraction-memory-ec08450e858f).

Secondly, Triples are standalone objects in WhyHow that you can link chunks to. This allows you to distill the key information that you want to retrieve per Triple, and bring it directly into the context once the right Triples are found. This avoids having to represent crucial information and context in a graph format (complicating the schema construction process), and bringing in information in a structured way after the initial unstructured vector search. This is similar in process to [LinkedIn’s application of Knowledge Graphs](https://proxy.rifx.online/https://readmedium.com/5-misconceptions-of-kg-rag-systems-building-using-rag-native-graphs-5e47872e7903) in their system, where crucial information like ‘Steps to Reproduce’ are represented and retrieved similarly, and where the steps themselves are represented as individual ‘chunks’/ ‘nodes’.

Thirdly, WhyHow accepts data in a JSON format, which allows seamless interaction between any of the extraction frameworks directly into graph creation. In this case, we use Claude for the initial transformation of the transcript data into the necessary JSON structure to load into WhyHow. If you have information already sitting in JSON, loading data into WhyHow is then a lot easier.

Fourthly, because of the way that Chunks and the retrieval process is designed in the WhyHow system, you can easily include temporal data that can be used to govern the way that the answer is constructed. Temporal data has always been a hard thing to model in Knowledge Graphs (to the point that it is typically advised against by leading KG experts), but is an obviously important part of workflows. Existing methods that even attempt to model temporal data try to ingest this into the Knowledge Graph itself and then retrieve based on a structured Cypher query, as opposed to our architecture that uniquely uses the LLM to help filter for temporal data.

Blending the power of LLM with structured knowledge representations like Knowledge Graphs are important ways to achieve business outcomes, and we think this temporal Knowledge Graph architecture will help unlock a lot of business value through the successful implementation of temporal data.


### Data Transformation Process Used

First, we use Claude to turn the transcript information into a schema\-aligned set of information on a per transcript basis. Alongside information from structured medical Records, the transcript is turned into a JSON summarization that looks like this:


```python
PATIENT SUMMARY
Name: Joseph Crona
DOB: 2022–08–29
Age: 2 years
Gender: male
MRN: #dbfbaa

CURRENT MEASUREMENTS (as of 2024–08–05)
Height: 84.1cm (50th percentile)
Weight: 14.5kg (52nd percentile)
ALLERGIES
No known allergies

IMMUNIZATIONS
- DTaP: 2022–12–05, 2023–02–06, 2023–03–06, 2024–02–05
- Hepatitis A: 2023–11–06
- Hepatitis B: 2022–08–29, 2022–10–03, 2023–03–06
- Hib: 2022–12–05, 2023–02–06, 2023–11–06
- Influenza: 2023–03–06, 2024–08–05
- MMR: 2023–11–06
- PCV13: 2022–12–05, 2023–02–06, 2023–03–06, 2023–11–06
- Polio: 2022–12–05, 2023–02–06, 2023–03–06
- Rotavirus: 2022–12–05, 2023–02–06
- Varicella: 2023–11–06

MEDICAL HISTORY
- Viral sinusitis (disorder)
Onset: 2023–03–13
Status: resolved
Outcome: Resolved

GROWTH & DEVELOPMENT
- 2023–11–06: Body Weight: 12.7 kg
- 2024–02–05: Body Height: 79 cm
- 2024–02–05: Body Weight: 13.4 kg
- 2024–08–05: Body Height: 84.1 cm
- 2024–08–05: Body Weight: 14.5 kg
Development: Age-appropriate milestones met
- Gross motor: Age appropriate
- Fine motor: Age appropriate
- Language: Age appropriate
- Social: Age appropriate

PREVENTIVE CARE
Well-Child Visits:
- 2024–08–05: 2yo well visit - Development on track
- 2024–02–05: 1yo well visit - Development on track
- 2023–11–06: 1yo well visit - Development on track
- 2023–08–07: 1yo well visit - Development on track
- 2023–05–08: 9mo well visit - Age appropriate exam completed
- 2023–02–06: 6mo well visit - Age appropriate exam completed
- 2022–12–05: 4mo well visit - Age appropriate exam completed
- 2022–10–03: 2mo well visit - Age appropriate exam completed
- 2022–08–29: Newborn visit - Normal exam

FAMILY HISTORY
Mother: Healthy
Father: Healthy
Siblings: None documented

SOCIAL HISTORY
Living Situation: Lives with parents
Development: Meeting age-appropriate milestones
Sleep: Age-appropriate pattern
Nutrition: Age-appropriate diet
```
Secondly, we map this JSON schema into the WhyHow schema, and then import all the information into the WhyHow.AI KG Studio.

The below is a sample of the KG Structure that was ultimately loaded into WhyHow.


```python
Knowledge Graph Structure (Timeless):


Nodes:
1. Patient Node
  Structure: {
      name: str,         # "John Smith"
      label: "Patient",
      properties: {
          gender: str,   # FHIR gender
          patient_type: str  # "adult" | "pediatric"
      },
      chunk_ids: List[str]  # Links to demographic chunks
  }


2. EncounterType Node
  Structure: {
      name: str,         # "Well-child visit" | "Annual physical"
      label: "EncounterType",
      properties: {
          category: str,  # "preventive" | "acute" | "chronic"
          specialty: str  # "primary_care" | "pediatrics" | "emergency"
      },
      chunk_ids: List[str]  # Links to visit pattern chunks
  }


3. Condition Node
  Structure: {
      name: str,         # "Essential hypertension"
      label: "Condition",
      properties: {
          category: str,     # "chronic" | "acute" | "resolved"
          system: str,       # "respiratory" | "cardiovascular" | etc
          is_primary: bool   # True if primary diagnosis
      },
      chunk_ids: List[str]  # Links to condition history chunks
  }


4. Immunization Node
  Structure: {
      name: str,         # "DTaP" | "MMR"
      label: "Immunization",
      properties: {
          series: str,       # "primary" | "booster"
          target: str        # "tetanus" | "measles" | etc
      },
      chunk_ids: List[str]  # Links to immunization records
  }


5. Observation Node
  Structure: {
      name: str,         # "Blood Pressure" | "Height"
      label: "Observation",
      properties: {
          category: str,     # "vital" | "lab" | "growth"
          unit: str         # "mmHg" | "cm" | etc
      },
      chunk_ids: List[str]  # Links to measurement records
  }


Relations:
1. Patient -> EncounterType
  Triple: (Patient) -[had_encounter]-> (EncounterType)
  - Chunk_ids link to specific visit instances


2. Patient -> Condition
  Triple: (Patient) -[has_condition]-> (Condition)
  - Chunk_ids link to condition episodes


3. Patient -> Immunization
  Triple: (Patient) -[received]-> (Immunization)
  - Chunk_ids link to administration records


4. Patient -> Observation
  Triple: (Patient) -[has_measurement]-> (Observation)
  - Chunk_ids link to measurement instances


5. Condition -> EncounterType
  Triple: (Condition) -[managed_in]-> (EncounterType)
  - Links conditions to typical encounter types


6. Immunization -> EncounterType
  Triple: (Immunization) -[given_during]-> (EncounterType)
  - Links vaccines to visit types
```
Thirdly, we then run a custom prompt that contextualizes the triples retrieved from the Knowledge Graph after every natural language query.

With this architecture in place, one interesting thing is that we can now continue to add information about Patient visits, Patient treatments and conditions to the Knowledge Graph easily, since it is just a matter of adding additional chunks to the existing triples that exist. If a Patient gets a new disease, additional Condition nodes are added to the Patient nodes.

This process took 25 dev hours, which can be broken down into the following:

* 2 hours (8%) was spent looking and understanding the data (Exploratory Data Analysis)
* 18 hours (72%) was spent iterating on the schema, and figuring out what nodes should be in the graph, what nodes should be connected to what, what chunks should exist, how it should connect to the various triples, testing the retrieved answers with a set of questions, and iterating accordingly.
* 2 hours (8%) was spent writing the code to create the set of triples to be loaded in
* 3 hours (12%) was spent writing validation checks and output checks to catch any errors


### Question \& Answer against Medical Record Knowledge Graphs

Prompt used for answer construction after retrieving the relevant context from the Knowledge Graph, using the WhyHow natural language graph query engine


```python
    You are an AI assistant specializing in medical records analysis. 
Use the following information to answer the user's question. 
    The information is derived from a knowledge graph of patient medical records.

    Relevant Nodes (these represent patients, encounters, and conditions):
    {node_context}

    Relevant Relationships (these show connections between patients, 
encounters, and conditions):
    {triple_context}

    Relevant Medical Records:
    {chunk_context}

    Answer the question using the following steps:
    1. Analyze the medical information, focusing on the specific topic of the 
question
    2. Identify key medical events, conditions, and temporal relationships
    3. Formulate a clear and concise answer that directly addresses the 
question
    4. If there are any uncertainties in the medical information, mention 
them explicitly
    5. If you don't have enough information to answer confidently, say so
    6. Consider temporal relationships between medical events
    7. It's currently {datetime.now().strftime("%Y-%m-%d")}. Consider this 
when interpreting dates
    8. Maintain patient privacy by using only first names or initials when 
necessary

    Question: {question}
```

## Business Value: Analysis of Patient Treatments


### Historical Patient Analysis

Question: **What types of well\-child visits and immunizations did Joseph Crona receive in their first year?**

Answer:


```python
To determine the types of well-child visits and immunizations Joseph Crona 
received in his first year, we need to consider the relevant medical events 
and their timing. Joseph was born in 2022, and it is currently November 9, 2024.
Therefore, his first year would span from 2022 to 2023.

**Well-Child Visits:**
- Joseph had an encounter categorized as a "Well child visit," which falls 
under preventive care in pediatrics. This type of visit is typically part of 
routine check-ups for children, especially in their first year.

**Immunizations:**
During his first year, Joseph received the following immunizations, all of 
which are common for pediatric patients:
1. **Hep B, adolescent or pediatric** - Completed
2. **Hib (PRP-OMP)** - Completed
3. **Rotavirus, monovalent** - Completed
4. **IPV (Inactivated Poliovirus Vaccine)** - Completed
5. **DTaP (Diphtheria, Tetanus, and Pertussis)** - Completed
6. **Pneumococcal conjugate PCV 13** - Completed

These immunizations are typically administered during the first year of life 
as part of the standard immunization schedule for infants.

In summary, Joseph Crona received a well-child visit and completed a series of
standard pediatric immunizations during his first year.
```
Question: **For patients with otitis media, what was the sequence of encounters and observations recorded?**

Answer:


```python
To address the question regarding the sequence of encounters and observations 
for patients with otitis media, we will focus on the medical records of Miles 
Dickinson, as he is the patient identified with this condition.

1. **Condition Onset:**
- Miles Dickinson was diagnosed with otitis media on June 10, 2024. The 
condition is currently resolved.

2. **Encounters:**
- Miles had two types of encounters recorded:
- **Well Child Visit:** This is categorized as a preventive encounter in 
pediatrics.
- **Encounter for Symptom:** This is categorized as a follow-up encounter in 
primary care.

3. **Observations:**
- Various observations were recorded for Miles, including:
- **Pain Severity:** Recorded multiple times with scores ranging from 0 to 4.
- **Body Weight:** Recorded with values ranging from 3.2 kg to 8.2 kg.
- **Head Occipital-frontal Circumference and Percentile:** Recorded with 
specific values in cm and percentiles.
- **Heart Rate:** Recorded with values ranging from 61 to 100 beats per minute.
- **Respiratory Rate:** Recorded with values ranging from 12 to 16 breaths per
minute.

4. **Temporal Sequence:**
- The otitis media diagnosis occurred on June 10, 2024. Observations and 
encounters before this date may have been related to other conditions or 
routine check-ups. Observations and encounters after this date could be 
related to follow-up care for otitis media or other health assessments.

5. **Conclusion:**
- The sequence of encounters and observations for Miles Dickinson includes 
preventive and follow-up encounters, along with various health observations. 
The specific sequence related to otitis media is not detailed in terms of exact
dates for each observation or encounter, but the diagnosis date provides a 
temporal marker for understanding subsequent medical activities.

If more detailed temporal data on each observation and encounter were 
available, a more precise sequence could be established. However, based on 
the current information, this is the overview of the sequence related to 
otitis media for Miles Dickinson.
```

### Historical Multi\-Patient Analysis

Question: **How many patients have been diagnosed with acute bronchitis, and what are the typical onset patterns?**

Answer:


```python
Based on the provided medical records, there are two patients diagnosed with 
acute bronchitis: Maximo Swaniawski and Bennie Herman.

#### Onset Patterns:
- **Maximo Swaniawski**:
- Onset dates for acute bronchitis:
- October 24, 2014
- November 7, 2015
- November 29, 2018
- **Bennie Herman**:
- Onset dates for acute bronchitis:
- October 24, 2014
- November 7, 2015
- November 29, 2018

#### Typical Onset Patterns:
The onset dates for both patients are identical, suggesting a pattern where 
acute bronchitis episodes occurred in late October or November. This could 
indicate a seasonal pattern, possibly related to colder weather or other 
seasonal factors that might contribute to respiratory conditions.

Both patients have had their conditions resolved, indicating that the episodes 
of acute bronchitis were acute and not chronic.
```
Question: **Which patients had both viral sinusitis and bronchitis, and what were their earliest onset dates?**

Answer:


```python
To determine which patients had both viral sinusitis and bronchitis, 
we need to analyze the conditions associated with each patient and their 
onset dates.

1. **Maximo Swaniawski**:
- Conditions: Acute bronchitis
- Earliest onset of bronchitis: 2014–10–24
2. **Cassandra Monahan**:
- Conditions: Viral sinusitis
- Earliest onset of sinusitis: 2014–12–12
3. **Bennie Herman**:
- Conditions: Acute bronchitis
- Earliest onset of bronchitis: 2014–10–24
4. **Deangelo Price**:
- Conditions: Viral sinusitis
- Earliest onset of sinusitis: 2014–12–12
5. **Joseph Crona**:
- Conditions: Viral sinusitis
- Earliest onset of sinusitis: 2014–12–12

From the information provided, none of the patients have both viral sinusitis 
and bronchitis. Each patient has either one condition or the other, but not 
both. Therefore, there are no patients with both conditions, and consequently, 
no earliest onset dates for both conditions in a single patient.
```

### Advantages against Vector\-Only RAG systems

Superior Analytics across multiple patients:

* In the question about which patients have both bronchitis and viral sinusitis conditions, we must be able to know if a patient is recorded to have or not have a particular disease. Since Vector\-Only Search is about identifying relevant chunks, it cannot detect if a patient definitely does not have a particular disease. This means that an intermediary aggregation of data is required that can definitively say that Patient X does not have the ‘diabetes’ node against their name.

Multi\-Transcript Analysis and RAG:

* In the question about Miles and his multiple visits in the past year, we can see that the conditions are across multiple visits and multiple transcripts. This means that an intermediary aggregation of data is required that maps a Patient and the cumulative visits and observations they’ve incurred over time.

WhyHow.AI provides tools, services and processes for Structured Knowledge, Knowledge Graphs and more reliable Agentic RAG solutions. If you are interested in exploring any of our tools ([KG Studio](https://proxy.rifx.online/https://readmedium.com/whyhow-ai-kg-studio-platform-beta-rag-native-graphs-1105e5a84ff2), [Knowledge Table \[Open Source]](https://proxy.rifx.online/https://readmedium.com/knowledge-table-multi-document-rag-extraction-memory-ec08450e858f)) and services, feel free to [chat with us here](https://proxy.rifx.online/https://calendly.com/whyhowai/intro-call-whyhow-ai).

If you’re thinking about, in the process of, or have already incorporated knowledge graphs in RAG for accuracy, memory and determinism, follow our newsletter at [WhyHow.AI](https://proxy.rifx.online/https://whyhow.ai/) or join our discussions about rules, determinism and knowledge graphs in RAG on our [Discord](https://proxy.rifx.online/https://discord.gg/9bWqrsxgHr).


