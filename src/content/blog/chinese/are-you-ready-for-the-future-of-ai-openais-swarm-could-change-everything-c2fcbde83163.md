---
title: "你准备好迎接人工智能的未来了吗？OpenAI 的 Swarm 可能会改变一切"
meta_title: "你准备好迎接人工智能的未来了吗？OpenAI 的 Swarm 可能会改变一切"
description: "
OpenAI 的 Swarm 框架通过多个智能代理的协作，解决了复杂问题，每个代理专注于特定任务。本文介绍了如何配置和个性化 Swarm，以实现自动化、创新和协作。具体步骤包括设置 OpenAI API 密钥、加载和处理文档、生成嵌入和向量数据库、设置代理以及通过中央代理协调任务。测试结果显示，多代理系统能够准确处理政治和体育相关查询，但需要进一步优化以处理不相关主题的查询。总结中提到，Swarm 框架为各种应用提供了高效和可扩展的解决方案，未来可以探索更多优化和集成技术。"
date: 2024-12-06T00:33:27Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*E2cn3s5Dz4WAPrVJ"
categories: ["Programming", "Machine Learning", "Chatbots"]
author: "Rifx.Online"
tags: ["Swarm", "LLMs", "agents", "collaboration", "embeddings"]
draft: False

---

### 学习如何配置和个性化 OpenAI 的 Swarm 框架，以创建强大的、协作的多代理系统，满足您的独特需求并推动更智能的自动化



想象一个复杂问题不是由单一 AI 而是由一个团队的智能代理无缝协作解决的世界。OpenAI 的 Swarm 使这一愿景成为现实。它是一个开创性的框架，利用 LLM 的力量创建一个协作的系统，其中每个代理都有独特的角色。

无论是自动化耗时的工作流程、解决多方面的研究项目，还是提供卓越的 [客户服务](https://ai.gopubby.com/how-agentic-rag-is-redefining-customer-support-systems-bd8b3ac6c97c)，Swarm 都使您能够部署多个代理，每个代理专注于特定任务。这些代理能够无缝通信，完美协作，以更快、更智能、更可靠的结果交付，就像一个协调良好的管弦乐队。

在核心层面，OpenAI 的 Swarm 使您能够构建系统，其中代理像团队中的专家一样行动。它们共享知识，解决复杂问题，并适应挑战，同时确保准确性和效率。结果？一个 [多代理](https://ai.gopubby.com/how-to-assemble-your-ultimate-ai-squad-with-crewai-88ab8b1058ed) 设置，彻底改变了我们如何处理自动化、创新和协作。

在本博客中，我们将带您了解 OpenAI 的 Swarm 背后的基础理念，并实现如下所示的多代理系统。简而言之，根据查询，中央代理决定哪个代理最适合处理该查询。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*46ztG1wmXAZgNVWyffXV_Q.png)

## 实现群集框架

这是我们将会实现的工作流程。这是图1所示工作流程的详细版本。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*L93uZkhumMKsKhnO-9dv4g.png)

### 第 1 步：访问和设置 Open API 密钥

在继续下一节之前，请参考此链接了解如何[**创建和访问 OpenAI API 密钥**](https://ai.gopubby.com/a-devops-platform-for-ai-langsmith-for-llm-development-lifecycle-8f89dd083b9a)，因为我们将使用 OpenAI API 实施安全措施。

```python
import os
from google.colab import userdata
os.environ["OPENAI_API_KEY"] = userdata.get('OPENAI_API_KEY')
```

### 第 2 步：工作流程的文档

我们有两份文档：一份专注于 [*政治*](https://github.com/amitvkulkarni/Blogs/blob/main/Generative%20AI/RAG%20with%20MultiQueryRetriever/Politics.txt)，讨论了 G7、G20 和各种全球问题（来源自维基百科）。另一份则集中在板球运动上，特别是 [*体育*](https://github.com/amitvkulkarni/Blogs/blob/main/Generative%20AI/RAG%20with%20MultiQueryRetriever/sport.txt)（来源自 Cricinfo）。

您可以使用自己的内容，但以下是来自 Cricinfo 的 WTC 样本内容，作为其中一份文档的参考。

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

### 第 3 步：文档处理

我们将使用 *RecursiveCharacterTextSplitter* 将文档拆分为更小的块。

```python
## Split documents into chunks
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
splits = text_splitter.split_documents(docs)
print(f"Split the documents into {len(splits)} chunks.")
```

### 第 4 步：生成嵌入和向量数据库

我们将使用 ***all\-MiniLM\-L6\-v2*** 模型通过 ***SentenceTransformerEmbeddings*** 方法生成嵌入，并将嵌入保存在向量数据库中，即 Chroma

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

### 第5步：设置代理

我们将构建第一个代理来回答与政治相关的问题。

* 我们将使用 ***gpt-4o-mini*** 模型生成响应。
* 从向量数据库中检索相关信息片段。
* 构建一个RAG链来处理和生成响应。

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

注意：其他代理（如体育代理）也需要类似的设置。您可以参考 [***GitHub***](https://github.com/amitvkulkarni/Blogs/blob/main/Generative%20AI/OpenAI%20Swarm%20Multi-Agent%20RAG.ipynb) 仓库中的相应代码片段。

### 第 6 步：通过集中控制器协调代理

现在我们已经设置了两个代理，我们需要一个中央代理来管理它们。这个中央代理称为“central\_agent”，将根据查询确定应触发哪些代理。我们还将配置代理之间任务交接的过程。

```python
from swarm import Swarm, Agent

## 定义政治和体育代理
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

## 定义中央代理
central_agent = Agent(
    name="Central Agent",
    instructions="Determine if the query is about poltics or sports, and route the query accordingly."
)

## 定义任务交接函数
def transfer_to_politics():
    print("Handing off to the politics Agent.")
    """Transfer the task to the politcs_agent Agent for poltical queries."""
    return politcs_agent

def transfer_to_sports():
    print("Handing off to the sports agent.")
    """Transfer the task to the sport_Agent for sports queries."""
    return sports_agent

## 将任务交接函数附加到中央代理
central_agent.functions = [transfer_to_politics, transfer_to_sports]
```

### 第 7 步：测试多智能体系统

### 场景 1：

我们将测试一个与政治相关的查询，以确保选择合适的代理来提供响应。

```python
client = Swarm()

## 示例 1：询问关于政治
print("\n--- 示例 1：询问关于政治 ---")
messages = [{"role": "user", "content": "政治讨论的内容是什么？"}]
response = client.run(agent=central_agent, messages=messages)
if isinstance(response, Agent):
    selected_agent = response
    result = selected_agent.functions
    print(result)
else:
    print(response.messages[-1]["content"])



----------------------- 输出 -------------------------------
--- 示例 1：询问关于政治 ---
交由政治代理处理。
调用 retrieve_and_generate_politics
检索到的文档：['印度于 2023 年 9 月举办了 2023 年峰会。[40] 主席国的主题是 Vasudhaiva Kutumbakam（梵语：वसुधैव कुटुम्बकम्；英语："One Earth, One Family, One Future"[d]）。[41][42] 2023 年 8 月 26 日，总理莫迪在接受采访时对 G20 国家在印度担任主席国期间的议程演变表示乐观，议程转向以人为中心的发展方法，符合全球南方的关切，包括应对气候变化、通过 G20 的共同债务框架进行债务重组以及全球加密货币的监管策略。G20 因非洲联盟的加入而扩大，这也是自 1999 年以来的首次扩大。[43][44][45]\n\n巴西担任主席国期间推出了 G20 社会，这是组织首次将民间社会引入辩论，使其能够参与并为峰会的讨论和政策制定做出贡献。[46]', '印度于 2023 年 9 月举办了 2023 年峰会。[40] 主席国的主题是 Vasudhaiva Kutumbakam（梵语：वसुधैव कुटुम्बकम्；英语："One Earth, One Family, One Future"[d]）。[41][42] 2023 年 8 月 26 日，总理莫迪在接受采访时对 G20 国家在印度担任主席国期间的议程演变表示乐观，议程转向以人为中心的发展方法，符合全球南方的关切，包括应对气候变化、通过 G20 的共同债务框架进行债务重组以及全球加密货币的监管策略。G20 因非洲联盟的加入而扩大，这也是自 1999 年以来的首次扩大。[43][44][45]\n\n巴西担任主席国期间推出了 G20 社会，这是组织首次将民间社会引入辩论，使其能够参与并为峰会的讨论和政策制定做出贡献。[46]', 'G7 认识到他们无法独自管理 2008 年的金融危机，需要一个更广泛的国际伙伴关系，但必须在他们的领导下。为此，G20 论坛从财政部长级别提升到峰会级别。然而，G20 的议程越来越倾向于发展中国家（现在称为全球南方）的利益和优先事项。在印度担任 G20 主席国期间，印度在主持 G20 之前和结束工作时举行了全球南方之声峰会，并在印度的倡议下，非洲联盟作为 G20 永久成员加入，使 G20 议程中的全球南方内容更加巩固。', 'G7 认识到他们无法独自管理 2008 年的金融危机，需要一个更广泛的国际伙伴关系，但必须在他们的领导下。为此，G20 论坛从财政部长级别提升到峰会级别。然而，G20 的议程越来越倾向于发展中国家（现在称为全球南方）的利益和优先事项。在印度担任 G20 主席国期间，印度在主持 G20 之前和结束工作时举行了全球南方之声峰会，并在印度的倡议下，非洲联盟作为 G20 永久成员加入，使 G20 议程中的全球南方内容更加巩固。']
当前的政治讨论主要围绕印度担任主席国的 G20 峰会，强调以人为中心的发展方法，并关注全球南方的关切。主要议题包括：

1. **气候变化**：制定和采取缓解气候变化影响的策略。
2. **债务重组**：通过 G20 的共同债务框架进行的努力。
3. **加密货币监管**：为全球加密货币建立规则和指南。
4. **民间社会参与**：通过巴西担任主席国期间推出的 G20 社会平台鼓励参与。
5. **非洲联盟成员**：非洲联盟作为 G20 永久成员的加入，使议程更加丰富，符合全球南方的内容。

这些议题反映了旨在实现包容性发展和国际合作的议程。
```

**观察：** 中央代理准确识别了查询主题，并将任务委托给政治代理，确保响应与源文档完全一致。

### 场景 2：

在这种情况下，我们将提出与体育相关的问题。

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

**观察：** 中央代理将控制权交给了体育代理，有效地处理了任务。尽管问题包含两个独立的查询，代理仍然成功生成了准确的响应。

### 场景 3：

现在，我们将提出一个既不涉及政治也不涉及体育的随机查询，而是关于食品/健康的问题。

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

**观察：** 中心代理识别出查询不符合任何特定主题，但仍然提供了准确的响应。

理想情况下，RAG 系统应仅提供与其分配主题相关的信息，例如在我们的案例中是政治或体育。然而，在此实例中，系统生成了不相关的响应。这突显了一个常见问题——未能为 RAG 系统设置明确的边界。幸运的是，有几种方法可以有效解决这一挑战。

1. 配置 RAG 系统以评估查询是否符合相关主题。如果查询超出定义的范围，回应一条通用消息，如：“我只能回答与政治或体育相关的问题。”
2. 采用更好的方法，如设置防护栏，实施安全措施。如果您对此感兴趣，请参阅 [***AI Safety Playbook \| Essential Steps to Ensure Your AI Stays Safe and Sound***](https://ai.gopubby.com/ai-safety-playbook-essential-steps-to-ensure-your-ai-stays-safe-and-sound-f9628d2c69e7)

> 目标是介绍框架并演示如何设置。它作为一个模板，可以轻松定制以适应特定用例。您可以添加更多代理，使用不同模型，使用 Langsmith 等工具跟踪和监控性能，并集成防护栏以增强功能和安全性。

## 多代理 RAG 的需求

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Zx_CZREa5H1iJwv9nun7gQ.png)

> 本博客中使用的完整代码可以从 [GitHub](https://github.com/amitvkulkarni/Blogs/blob/main/Generative%20AI/OpenAI%20Swarm%20Multi-Agent%20RAG.ipynb) 获取

## 结论

总之，OpenAI 的 Swarm 通过利用多个智能代理的力量，每个代理都配备了专门的技能来处理复杂任务，开启了令人兴奋的可能性。在本博客中，我们探讨了 Swarm 的核心概念、它在增强自动化方面的作用，以及如何使用大型语言模型（LLMs）设置自己的多代理系统。真正的魔力在于这些代理如何协作，提高各种应用的效率和可扩展性。

虽然我们已经涵盖了基础知识，但仍有许多可以探索的内容。例如，深入研究优化代理通信的高级技术或将 Swarm 与其他 AI 框架集成，可以进一步提升您的项目。此外，尝试不同类型的任务和微调代理角色将为特定用例提供更定制化的解决方案。

* ## 参考资料

[https://github.com/openai/swarm](https://github.com/openai/swarm)


