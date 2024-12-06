---
title: "Are You Ready for the Future of AI? OpenAI’s Swarm Could Change Everything"
meta_title: "Are You Ready for the Future of AI? OpenAI’s Swarm Could Change Everything"
description: "OpenAI’s Swarm is a groundbreaking framework that leverages Large Language Models (LLMs) to create collaborative multi-agent systems. Each agent specializes in a specific task, such as handling political or sports queries, and communicates seamlessly to deliver efficient and accurate results. The blog outlines the setup process, including document loading, embedding generation, and agent configuration, with a central agent coordinating tasks. Testing scenarios demonstrate the systems ability to handle queries accurately and efficiently, though it highlights the need for clear topic boundaries and safety measures. The framework offers significant potential for enhancing automation and collaboration in various applications."
date: 2024-12-06T00:33:27Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*E2cn3s5Dz4WAPrVJ"
categories: ["Programming", "Machine Learning", "Chatbots"]
author: "Rifx.Online"
tags: ["Swarm", "LLMs", "agents", "collaboration", "embeddings"]
draft: False

---





### Learn how to configure and personalize OpenAI’s Swarm framework to create powerful, collaborative multi\-agent systems that meet your unique needs and drive smarter automation



Imagine a world where complex problems are solved not by a single AI, but by a team of intelligent agents working together seamlessly. OpenAI’s Swarm makes this vision a reality. It’s a groundbreaking framework that leverages the power of LLMs to create a collaborative system of specialized agents, each with a unique role.

Whether you’re automating a time\-consuming workflow, tackling a multifaceted research project, or providing exceptional [customer support](https://ai.gopubby.com/how-agentic-rag-is-redefining-customer-support-systems-bd8b3ac6c97c), Swarm enables you to deploy multiple agents, each focused on a specific task. These agents communicate effortlessly, working in perfect harmony to deliver faster, smarter, and more reliable results, much like a well\-coordinated orchestra.

At its core, OpenAI’s Swarm empowers you to build systems where agents act like experts in a team. They share knowledge, solve intricate problems, and adapt to challenges, all while ensuring accuracy and efficiency. The result? A [multi\-agen](https://ai.gopubby.com/how-to-assemble-your-ultimate-ai-squad-with-crewai-88ab8b1058ed)t setup that revolutionizes how we approach automation, innovation, and collaboration.

In this blog, we’ll take you through the foundational ideas behind OpenAI’s Swarm, and implement a multi\-agent system as shown below. In short, depending on the query the central agent decides which agent is best suited to handle the query.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*46ztG1wmXAZgNVWyffXV_Q.png)


## Implementing the swarm framework

Here is the workflow we will implement. This is a detailed version of the workflow shown in Fig 1\.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*L93uZkhumMKsKhnO-9dv4g.png)


### Step 1: Accessing and setting up the Open API key

Before proceeding to the next section, please refer to this to learn how to [**create and access the OpenAi API key**](https://ai.gopubby.com/a-devops-platform-for-ai-langsmith-for-llm-development-lifecycle-8f89dd083b9a)as we will be implementing the safety measures using Open AI API.


```python
import os
from google.colab import userdata
os.environ["OPENAI_API_KEY"] = userdata.get('OPENAI_API_KEY')
```

### Step 2: The documents for the workflow

We have two documents: one focuses on [*politics*](https://github.com/amitvkulkarni/Blogs/blob/main/Generative%20AI/RAG%20with%20MultiQueryRetriever/Politics.txt), discussing topics like the G7, G20, and various global issues (sourced from Wikipedia). The other centers on cricket, specifically covering the [*sports*](https://github.com/amitvkulkarni/Blogs/blob/main/Generative%20AI/RAG%20with%20MultiQueryRetriever/sport.txt) (sourced from Cricinfo).

You can have your own content but for reference here is the sample content on WTC sourced from Cricinfo used as one of the documents.


```python
Race to the WTC final: India back on top after Perth win
Australia, meanwhile, have plenty to do if they're to finish in the top two without depending on other results
With 17 Tests to go in the current World Test Championship (WTC) cycle, several teams are still in contention, and no team is assured of a place in the top two. Here is how the teams currently stack up.
India
Percent: 61.11, matches remaining: Aus (4 away)
India's emphatic win in Perth takes them back to the top of the WTC points table, and keeps their chances of making it to the final at Lord's next year very much alive. To be certain of finishing among the top two without depending on other results, India still need to beat Australia 4-0: four wins and a draw would lift India to 65.79, which would be marginally more than New Zealand's maximum (64.29) if they were to blank England 3-0 at home. India would then at worst be second on the points table, after South Africa, who can finish on a maximum of 69.44 with 2-0 home wins against Sri Lanka and Pakistan.
Australia
Percent: 57.69, matches remaining: Ind (4 home Tests), SL (2 away)
The defeat in Perth means Australia have plenty to do to finish in the top two without depending on other results. Given that South Africa and New Zealand can both finish with more than 64%, Australia need five wins in their last six to finish ahead of New Zealand's maximum of 64.29; in this case only South Africa, with a maximum of 69.44, can finish ahead of them.
If India win the ongoing series 3-2, Australia can still finish ahead of them, but only if they sweep the series against Sri Lanka 2-0. In this case, Australia would finish on 60.53, marginally ahead of India's 58.77, but they would still need help from at least one of South Africa or New Zealand to finish in the top two.
```

```python
from langchain_community.document_loaders import DirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

loader = DirectoryLoader("/content/Data", show_progress=True)
docs = loader.load()
print(f"Loaded {len(docs)} documents from the folder.")
```

### Step 3: Document processing

We will use *RecursiveCharacterTextSplitter* to split the documents into smaller chunks.


```python
## Split documents into chunks
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
splits = text_splitter.split_documents(docs)
print(f"Split the documents into {len(splits)} chunks.")
```

### Step 4: Generating embeddings and vector DB

We will generate the embedding using ***all\-MiniLM\-L6\-v2*** model using ***SentenceTransformerEmbeddings*** method and save the embeddings in the vector database, i.e., Chroma


```python
from langchain_community.embeddings.sentence_transformer import SentenceTransformerEmbeddings
from langchain_chroma import Chroma

embedding_function = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
collection_name = "my_collection"

vectorstore = Chroma.from_documents(
    collection_name=collection_name,
    documents=splits,
    embedding=embedding_function,
    persist_directory="./chroma_db"
)
print("Vector store created and persisted to './chroma_db'")
```

### Step 5: Setting up Agents

We will build the first agent to answer political\-related queries.

* We will use the ***gpt\-4o\-mini*** model to generate the responses.
* Retrieve the relevant chunks of information from the vector DB
* Build an RAG chain to process and generate the response.


```python
from langchain_core.prompts import ChatPromptTemplate
from langchain.schema.runnable import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini")

def retrieve_and_generate_politics(question):
    print("Calling retrieve_and_generate_politics")
    template = """Answer the question based only on the following context:
    {context}
    Question: {question}
    Answer: """

    prompt = ChatPromptTemplate.from_template(template)

    def docs2str(docs):
        if not docs:
            print("No documents retrieved!")
        else:
            print("Retrieved documents:", [doc.page_content for doc in docs])
        return "\n\n".join(doc.page_content for doc in docs)

    rag_chain = (
        {"context": retriever | docs2str, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )

    response = rag_chain.invoke(question)
    return response
```
Note: A similar setup will be required for the other agent, such as the sports agent. You can refer to the [***GitHub***](https://github.com/amitvkulkarni/Blogs/blob/main/Generative%20AI/OpenAI%20Swarm%20Multi-Agent%20RAG.ipynb) repository for the corresponding code snippet.


### Step 6: Coordinating agents through a centralized controller

Now that we have two agents set up, we need a central agent to manage them. This central agent, called the “central\_agent,” will determine which agents should be triggered based on the query. We will also configure the process of handing off tasks between the agents


```python
from swarm import Swarm, Agent

## Define the Politics and sports agents
politcs_agent = Agent(
    name="Politics Agent",
    instructions="You retrieve relevant information from the Politics knowledge base and generate responses to general queries about politics.",
    functions=[retrieve_and_generate_politics]
)

sports_agent = Agent(
    name="Sports Agent",
    instructions="You retrieve relevant information from the Sports knowledge base and generate responses to general queries about the sports.",
    functions=[retrieve_and_generate_sports]
)

## Define the Central Agent
central_agent = Agent(
    name="Central Agent",
    instructions="Determine if the query is about poltics or sports, and route the query accordingly."
)

## Define handoff functions
def transfer_to_politics():
    print("Handing off to the politics Agent.")
    """Transfer the task to the politcs_agent Agent for poltical queries."""
    return politcs_agent

def transfer_to_sports():
    print("Handing off to the sports agent.")
    """Transfer the task to the sport_Agent for sports queries."""
    return sports_agent

## Attach the handoff functions to the central agent
central_agent.functions = [transfer_to_politics, transfer_to_sports]
```

### Step 7: Testing the multi\-agent system


### Scenario 1:

We will test a politically focused query to ensure the appropriate agent is selected to provide the response.


```python
client = Swarm()

## Example 1: Asking about the politics
print("\n--- Example 1: Asking about the politics ---")
messages = [{"role": "user", "content": "What is the political discussion about?"}]
response = client.run(agent=central_agent, messages=messages)
if isinstance(response, Agent):
    selected_agent = response
    result = selected_agent.functions
    print(result)
else:
    print(response.messages[-1]["content"])



----------------------- OUTPUT -------------------------------
--- Example 1: Asking about the politics ---
Handing off to the politics Agent.
Calling retrieve_and_generate_politics
Retrieved documents: ['India held the 2023 summit in September 2023.[40] The presidency\'s theme was Vasudhaiva Kutumbakam (Sanskrit: वसुधैव कुटुम्बकम्; English:"One Earth, One Family, One Future"[d]).[41][42] In an interview on 26 August 2023, Prime Minister Narendra Modi expressed optimism about the G20 countries\' evolving agenda under India\'s presidency, shifting toward a human-centric development approach that aligns with the concerns of the Global South, including addressing climate change, debt restructuring through the G20\'s Common Framework for debt, and a strategy for regulation of global cryptocurrencies. G20 expanded by the inclusion of African Union, it is also the first inclusion since 1999.[43][44][45]\n\nThe Brazilian presidency launched the G20 Social, a place where for the first time the organization will bring the civil society into the debate where it can participate and contribute to discussions and policy formulations regarding to the summit.[46]', 'India held the 2023 summit in September 2023.[40] The presidency\'s theme was Vasudhaiva Kutumbakam (Sanskrit: वसुधैव कुटुम्बकम्; English:"One Earth, One Family, One Future"[d]).[41][42] In an interview on 26 August 2023, Prime Minister Narendra Modi expressed optimism about the G20 countries\' evolving agenda under India\'s presidency, shifting toward a human-centric development approach that aligns with the concerns of the Global South, including addressing climate change, debt restructuring through the G20\'s Common Framework for debt, and a strategy for regulation of global cryptocurrencies. G20 expanded by the inclusion of African Union, it is also the first inclusion since 1999.[43][44][45]\n\nThe Brazilian presidency launched the G20 Social, a place where for the first time the organization will bring the civil society into the debate where it can participate and contribute to discussions and policy formulations regarding to the summit.[46]', 'The G7 recognised that they could not manage the 2008 financial crisis on their own and needed a wider international partnership, but one under their aegis. With this in mind, the G20 forum hitherto at the finance minister level was raised to the summit level. The G20 agenda is, however, shifting increasingly towards the interests and priorities of the developing countries (now being referred to as the Global South). During India’s G20 presidency, with India holding the Voice of the Global South summits before presiding over the G20 and at the conclusion of its work, and with the inclusion of the African Union as a G20 permanent member at India’s initiative, the pro-Global South content of the G20 agenda has got consolidated.', 'The G7 recognised that they could not manage the 2008 financial crisis on their own and needed a wider international partnership, but one under their aegis. With this in mind, the G20 forum hitherto at the finance minister level was raised to the summit level. The G20 agenda is, however, shifting increasingly towards the interests and priorities of the developing countries (now being referred to as the Global South). During India’s G20 presidency, with India holding the Voice of the Global South summits before presiding over the G20 and at the conclusion of its work, and with the inclusion of the African Union as a G20 permanent member at India’s initiative, the pro-Global South content of the G20 agenda has got consolidated.']
The current political discussion centers around the G20 summit under India's presidency, emphasizing a human-centric development approach and addressing the concerns of the Global South. Key issues include:

1. **Climate Change**: Strategies and actions to mitigate climate change impacts.
2. **Debt Restructuring**: Efforts through the G20's Common Framework for debt.
3. **Cryptocurrency Regulation**: Establishing rules and guidelines for global cryptocurrencies.
4. **Civil Society Inclusion**: Encouraging participation through initiatives like the G20 Social platform launched by the Brazilian presidency.
5. **African Union Membership**: The African Union's inclusion as a permanent G20 member, enriching the agenda with pro-Global South content.

These topics reflect an agenda aiming for inclusive development and international cooperation.
```
**Observation:** The central agent accurately identified the query topic and delegated the task to the politics\_agent, ensuring the response aligned perfectly with the source document


### Scenario 2:

In this case, we will prompt with a sports\-related query.


```python
How many test matches are to be played before the World Test Championship (WTC) and what is the maximum points that newzealand can have?

----------------------- OUTPUT -------------------------------
--- Example 2: Asking from the sports ---
Handing off to the sports agent.
Calling retrieve_and_generate_sports
Retrieved documents: ["India\n\nPercent: 61.11, matches remaining: 
Aus (4 away)\n\nIndia's emphatic win in Perth takes them back to the 
top of the WTC points table, and keeps their chances of making it to 
the final at Lord's next year very much alive. To be certain of finishing 
among the top two without depending on other results, India still need to 
beat Australia 4-0: four wins and a draw would lift India to 65.79, which would be marginally more than New Zealand's maximum (64.29) if they were to blank England 3-0 at home. India would then at worst be second on the points table, after South Africa, who can finish on a maximum of 69.44 with 2-0 home wins against Sri Lanka and Pakistan.\n\nAustralia\n\nPercent: 57.69, matches remaining: Ind (4 home Tests), SL (2 away)", "India\n\nPercent: 61.11, matches remaining: Aus (4 away)\n\nIndia's emphatic win in Perth takes them back to the top of the WTC points table, and keeps their chances of making it to the final at Lord's next year very much alive. To be certain of finishing among the top two without depending on other results, India still need to beat Australia 4-0: four wins and a draw would lift India to 65.79, which would be marginally more than New Zealand's maximum (64.29) if they were to blank England 3-0 at home. India would then at worst be second on the points table, after South Africa, who can finish on a maximum of 69.44 with 2-0 home wins against Sri Lanka and Pakistan.\n\nAustralia\n\nPercent: 57.69, matches remaining: Ind (4 home Tests), SL (2 away)", "Race to the WTC final: India back on top after Perth win Australia, meanwhile, have plenty to do if they're to finish in the top two without depending on other results\n\nWith 17 Tests to go in the current World Test Championship (WTC) cycle, several teams are still in contention, and no team is assured of a place in the top two. Here is how the teams currently stack up.\n\nIndia\n\nPercent: 61.11, matches remaining: Aus (4 away)", "Race to the WTC final: India back on top after Perth win Australia, meanwhile, have plenty to do if they're to finish in the top two without depending on other results\n\nWith 17 Tests to go in the current World Test Championship (WTC) cycle, several teams are still in contention, and no team is assured of a place in the top two. Here is how the teams currently stack up.\n\nIndia\n\nPercent: 61.11, matches remaining: Aus (4 away)"]
There are 17 Test matches to be played before the World Test Championship 
(WTC). The maximum points that New Zealand can achieve is 64.29.
```
**Observation:** The central agent passed control to the sports\_agent, effectively handling the task. Despite the question containing two separate queries, the agent successfully generated an accurate response


### Scenario 3:

Now, we will prompt a query that is neither about politics nor sports but a random query on food/health.


```python
What is glycemic index and what influences the glycemic index of a food?

----------------------- OUTPUT -------------------------------
--- Example 2: Asking from the sports ---
It seems your query is neither related to politics nor sports. The glycemic index (GI) is a system that ranks foods on a scale from 0 to 100 based on how much they raise blood glucose levels after eating. Foods are classified as low (55 or less), medium (56 to 69), or high (70 or more) GI. Several factors influence the glycemic index of food:

1. **Type of Carbohydrates:** Simple carbohydrates generally have a higher GI compared to complex carbohydrates.
2. **Fiber Content:** Foods high in fiber typically have a lower GI because fiber slows the digestion and absorption of carbohydrates.
3. **Ripeness and Storage:** The riper a fruit or vegetable, the higher its GI because its sugars become more readily digestible.
4. **Processing and Preparation:** Foods that are more processed or ground into flour usually have a higher GI. Cooking methods can also affect GI; for example, boiling can lower the GI compared to baking or frying.
5. **Protein and Fat Content:** Meals high in protein and fat tend to have a lower GI because they slow down the digestion process.

These factors influence how quickly glucose is absorbed into the bloodstream, thus affecting the GI of the food.
```
**Observation:** The central agent recognized that the query didn’t align with any specific topic but still provided an accurate response

Ideally, an RAG system should only provide responses relevant to its assigned topic, such as politics or sports in our use case. However, in this instance, the system generated an unrelated response. This highlights a common issue — failing to set clear boundaries for the RAG system. Fortunately, there are several approaches to address this challenge effectively.

1. Configure the RAG system to evaluate whether the query aligns with the relevant topics. If the query falls outside the defined scope, respond with a generic message such as, “I can only answer questions related to politics or sports.
2. Use a better approach with Guardrails where we implement safety measures. If you are interested in this then please refer to [***AI Safety Playbook \| Essential Steps to Ensure Your AI Stays Safe and Sound***](https://ai.gopubby.com/ai-safety-playbook-essential-steps-to-ensure-your-ai-stays-safe-and-sound-f9628d2c69e7)


> The goal is to introduce the framework and demonstrate how to set it up. It serves as a template that can be easily customized for specific use cases. You can add more agents, use different models, track and monitor performance with tools like Langsmith, and integrate guardrails to enhance functionality and security


## Need for Multi\-Agent RAG

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Zx_CZREa5H1iJwv9nun7gQ.png)


> The complete code used in the blog can be accessed from the [GitHub](https://github.com/amitvkulkarni/Blogs/blob/main/Generative%20AI/OpenAI%20Swarm%20Multi-Agent%20RAG.ipynb)


## Conclusion

In conclusion, OpenAI’s Swarm opens up exciting possibilities by harnessing the power of multiple intelligent agents, each equipped with specialized skills to tackle complex tasks. Throughout this blog, we’ve explored the core concepts of Swarm, its role in enhancing automation, and how you can set up your own multi\-agent system using Large Language Models (LLMs). The real magic lies in the way these agents collaborate, boosting efficiency and scalability in various applications.

While we’ve covered the fundamentals, there’s still much more to explore. For instance, delving deeper into advanced techniques for optimizing agent communication or integrating Swarm with other AI frameworks could elevate your projects even further. Additionally, experimenting with different types of tasks and fine\-tuning agent roles will provide a more tailored solution for specific use cases.


## Connect with me

* [***Linkedin***](http://www.linkedin.com/in/amitvkulkarni2)
* [***Github***](https://github.com/amitvkulkarni)
* [***Medium***](https://amitvkulkarni.medium.com/)


## Enjoyed this story?

[*Subscribe for free*](https://medium.com/subscribe/@amitvkulkarni) *to get notified when I publish a new story.*


## References

<https://github.com/openai/swarm>


