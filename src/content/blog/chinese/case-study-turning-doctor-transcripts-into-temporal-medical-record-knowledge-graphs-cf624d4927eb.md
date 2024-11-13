---
title: "案例研究：将医生笔录转化为时态医疗记录知识图谱"
meta_title: "案例研究：将医生笔录转化为时态医疗记录知识图谱"
description: "展示数据转换过程、涉及的 25 个开发小时的明细、使用的模式、问题和回复以及创建的图表"
date: 2024-11-13T01:22:29Z
image: "https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*DUNtg-0w2z-vlF9SCvt5UA.png"
categories: ["Health", "Data Science", "Machine Learning"]
author: "Rifx.Online"
tags: ["transcripts", "Temporal", "Knowledge", "Graphs", "vector"]
draft: False

---



您是否有兴趣将医生/患者的医疗记录和记录转化为可以跨多个医疗历史、时间段和患者进行复杂查询的时间性知识图谱？

在本案例研究中，我们展示了如何将医疗记录转化为您可以依赖于 RAG 和分析目的的时间性知识图谱。我们展示了针对该系统的真实问答，以及您可以通过该系统实现的业务成果。据我们所知，这里步骤的组合是一种相对新颖的知识图谱实现。

### 使用的数据

出于数据隐私原因，我们使用了一个合成的医疗记录数据集，该数据集是我们从Synthea数据中创建的，链接在此：[https://synthea.mitre.org/downloads](https://proxy.rifx.online/https://synthea.mitre.org/downloads)。以下是用于知识图谱创建的输入数据之一的医疗记录示例。我们将这些记录数据与Synthea数据中的结构化医疗记录结合在一起。我们有大约75份记录，涵盖了10位患者（即每位患者有5-10份记录）。以下是使用的记录示例：



## 新颖知识图谱架构概述

### 节点：

我们有5种类型的节点：Patient、Observation、Immunization、Condition和Encounter Type

### Triples (样本列表):

Patient \-\> Had Encounter \-\> Encounter

Patient \-\> Has Condition \-\> Condition

Patient \-\> Received \-\> Immunization

Patient \-\> Has Measurement \-\> Observation

### Chunks:

Chunks 是独立的文本块。Chunks 与每个 Triple 相关联，并且可以有多个 Chunks 关联到单个 Triple。在这种情况下，Chunks 不是 Triple 的非结构化来源，而是与每种 Triple 类型相关的摘要和关键点。因此，我们有 6 种类型的 Chunks：- 患者人口统计 Chunks、病情摘要 Chunks、就诊 Chunks、观察 Chunks、免疫接种 Chunks 和病情详细 Chunks。

不同类型的 Chunks 关联到 Triples 的示例如下：

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

通过这种特定的图形架构，您可以将关键点和摘要与 Triples 关联，然后可以专注于通过非结构化搜索找到正确的一组 Triples，并随后通过结构化方式引入所有相关的关键信息。

## 独特的WhyHow架构

有一些独特的WhyHow图形基础设施，使我们能够以简单的方式构建此架构。

首先，Triples通过向量搜索嵌入和检索，避免了常见的检索问题，即必须使用Text2Cypher来识别节点、关系，然后构建Cypher查询，以找到正确的Triple。这已被证明可以显著[提高检索准确性达3倍](https://proxy.rifx.online/https://readmedium.com/knowledge-table-multi-document-rag-extraction-memory-ec08450e858f)。

其次，Triples是WhyHow中的独立对象，您可以将块链接到这些对象。这使您能够提炼每个Triple想要检索的关键信息，并在找到正确的Triples后直接将其引入上下文。这避免了必须以图形格式表示关键的信息和上下文（使得模式构建过程复杂化），并在初始的非结构化向量搜索后以结构化的方式引入信息。这在过程上类似于[LinkedIn对知识图的应用](https://proxy.rifx.online/https://readmedium.com/5-misconceptions-of-kg-rag-systems-building-using-rag-native-graphs-5e47872e7903)，在他们的系统中，像“重现步骤”这样的关键信息以类似的方式表示和检索，而这些步骤本身则被表示为单独的“块”/“节点”。

第三，WhyHow接受JSON格式的数据，这允许任何提取框架与图形创建之间无缝互动。在这种情况下，我们使用Claude将转录数据初步转换为必要的JSON结构，以加载到WhyHow中。如果您已经有信息以JSON格式存在，那么将数据加载到WhyHow中就容易多了。

第四，由于WhyHow系统中块和检索过程的设计方式，您可以轻松包含可以用于管理答案构建方式的时间数据。时间数据在知识图中一直是一个难以建模的内容（以至于领先的KG专家通常建议避免），但它显然是工作流的重要组成部分。即使尝试建模时间数据的现有方法也试图将其摄取到知识图中，然后基于结构化的Cypher查询进行检索，而不是我们独特使用LLM来帮助过滤时间数据的架构。

将LLM的强大功能与知识图等结构化知识表示结合起来，是实现业务成果的重要方式，我们认为这种时间知识图架构将通过成功实施时间数据来帮助释放大量业务价值。

### 数据转换过程

首先，我们使用Claude将转录信息转换为与模式对齐的每个转录的数据信息。结合结构化医疗记录的信息，转录被转化为如下所示的JSON摘要：

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
其次，我们将此JSON模式映射到WhyHow模式，然后将所有信息导入WhyHow.AI KG Studio。

以下是最终加载到WhyHow中的KG结构示例。

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
第三，我们运行一个自定义提示，以在每次自然语言查询后对从知识图谱中检索的三元组进行上下文化。

在这种架构下，一个有趣的事情是，我们现在可以继续向知识图谱中添加有关患者就诊、患者治疗和病情的信息，因为这只是将额外的块添加到现有三元组中的问题。如果患者得了新疾病，则会向患者节点添加额外的Condition节点。

这个过程花费了25个开发小时，可以分解为以下几个部分：

* 2小时（8%）用于查看和理解数据（探索性数据分析）
* 18小时（72%）用于迭代模式，弄清楚图中应该包含哪些节点，哪些节点应该连接到什么，应该存在哪些块，如何连接到各种三元组，使用一组问题测试检索的答案，并相应地进行迭代。
* 2小时（8%）用于编写创建要加载的三元组的代码
* 3小时（12%）用于编写验证检查和输出检查以捕获任何错误

### 问题与答案：医疗记录知识图谱

用于在从知识图谱中检索相关上下文后构建答案的提示，使用WhyHow自然语言图查询引擎

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

## 业务价值：患者治疗分析

### 历史患者分析

问题：**Joseph Crona在其第一年接受了哪些类型的健康儿童访视和免疫接种？**

回答：

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
问题：**对于中耳炎患者，记录的接触和观察的顺序是什么？**

回答：

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

### 历史多患者分析

问题：**有多少患者被诊断为急性支气管炎，典型的发作模式是什么？**

答案：

```python
根据提供的医疗记录，有两位患者被诊断为急性支气管炎：Maximo Swaniawski 和 Bennie Herman。

#### 发作模式：
- **Maximo Swaniawski**：
- 急性支气管炎的发作日期：
- 2014年10月24日
- 2015年11月7日
- 2018年11月29日
- **Bennie Herman**：
- 急性支气管炎的发作日期：
- 2014年10月24日
- 2015年11月7日
- 2018年11月29日

#### 典型发作模式：
两位患者的发作日期相同，表明急性支气管炎发作的模式发生在10月底或11月。这可能表明一种季节性模式，可能与较冷的天气或其他可能导致呼吸系统疾病的季节性因素有关。

两位患者的病情已得到解决，表明急性支气管炎的发作是急性的，而非慢性的。
```
问题：**哪些患者同时患有病毒性鼻窦炎和支气管炎，他们最早的发作日期是什么？**

答案：

```python
要确定哪些患者同时患有病毒性鼻窦炎和支气管炎，我们需要分析每位患者的相关疾病及其发作日期。

1. **Maximo Swaniawski**：
- 疾病：急性支气管炎
- 支气管炎的最早发作日期：2014年10月24日
2. **Cassandra Monahan**：
- 疾病：病毒性鼻窦炎
- 鼻窦炎的最早发作日期：2014年12月12日
3. **Bennie Herman**：
- 疾病：急性支气管炎
- 支气管炎的最早发作日期：2014年10月24日
4. **Deangelo Price**：
- 疾病：病毒性鼻窦炎
- 鼻窦炎的最早发作日期：2014年12月12日
5. **Joseph Crona**：
- 疾病：病毒性鼻窦炎
- 鼻窦炎的最早发作日期：2014年12月12日

根据提供的信息，没有患者同时患有病毒性鼻窦炎和支气管炎。每位患者仅有一种疾病，而没有同时存在两种。因此，没有患者同时具备这两种疾病，因此也没有单一患者的最早发作日期。
```

### 相较于仅向量 RAG 系统的优势

跨多个患者的卓越分析：

* 在关于哪些患者同时患有支气管炎和病毒性鼻窦炎的问题中，我们必须能够知道某个患者是否被记录为患有或未患有特定疾病。由于仅向量搜索是关于识别相关片段的，因此无法检测到患者是否确实没有某种特定疾病。这意味着需要一个中介数据聚合，能够明确表示患者 X 在其名字下没有“糖尿病”节点。

多转录本分析与 RAG：

* 在关于迈尔斯及其过去一年多次就诊的问题中，我们可以看到这些情况跨越了多次就诊和多个转录本。这意味着需要一个中介数据聚合，能够映射出患者及其随时间累积的就诊和观察记录。

WhyHow.AI 提供结构化知识、知识图谱和更可靠的代理 RAG 解决方案的工具、服务和流程。如果您有兴趣探索我们的任何工具（[KG Studio](https://proxy.rifx.online/https://readmedium.com/whyhow-ai-kg-studio-platform-beta-rag-native-graphs-1105e5a84ff2)，[知识表\[开源\]](https://proxy.rifx.online/https://readmedium.com/knowledge-table-multi-document-rag-extraction-memory-ec08450e858f)）和服务，请随时[与我们聊天](https://proxy.rifx.online/https://calendly.com/whyhowai/intro-call-whyhow-ai)。

如果您正在考虑、正在进行或已经在 RAG 中整合知识图谱以提高准确性、记忆和确定性，请关注我们的新闻通讯[WhyHow.AI](https://proxy.rifx.online/https://whyhow.ai/)，或加入我们关于 RAG 中规则、确定性和知识图谱的讨论，欢迎加入我们的[Discord](https://proxy.rifx.online/https://discord.gg/9bWqrsxgHr)。

