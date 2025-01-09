---
title: "使用开源模型构建医疗聊天机器人：通过人工智能改变医疗保健"
meta_title: "使用开源模型构建医疗聊天机器人：通过人工智能改变医疗保健"
description: "本文介绍了如何使用开源模型构建一个医疗聊天机器人，旨在通过生成医学文献的答案来改善医疗保健。作者详细描述了项目的六个步骤，包括环境设置、文本嵌入、向量数据库配置、LLM设置、聊天机器人工作流程整合以及用户界面构建。最终，作者提供了完整的代码和项目链接，鼓励用户与聊天机器人互动。该项目展示了开源技术在医疗领域的应用潜力。"
date: 2025-01-09T01:53:19Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*850c_t9WLHYl_hCZeTNtSw.jpeg"
categories: ["Programming", "Chatbots", "Health"]
author: "Rifx.Online"
tags: ["medical", "chatbot", "embedding", "LLM", "Streamlit"]
draft: False

---





人工智能正在改变医疗保健，聊天机器人提供快速可靠的医疗信息。随着我对生成式人工智能的了解不断加深，我希望构建一个完全100%开源的医疗聊天机器人。我的目标是让这个医疗机器人能够通过丰富的医学文献回答医疗问题。然而，我面临了一些挑战和突破，稍后将进行讨论。我采取了以下步骤来实现这个项目。

**步骤 1：环境和需求设置**

首先，我在我的GitHub上创建了一个新的代码库，并将其克隆到我的本地机器上。完成后，我设置了一个`.env`文件来存储我的API密钥，以及一个`requirements.txt`文件，里面包含了我在项目中需要的所有库。这相当简单，但为其他一切奠定了基础。

注意：API密钥应当保密，因此不要将其推送到GitHub。

**步骤 2：设置文本嵌入**

我使用`HuggingFaceEmbeddings`类创建了使用`all-MiniLM-L6-v2`模型的嵌入。这一步对于将文本转换为数值向量至关重要，使模型更容易理解和处理数据。基本上，它允许我将原始文本表示为可以用于相似性搜索或聚类等任务的格式。

```python
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
```
**步骤 3：向量数据库设置**

这段代码用于设置Pinecone，一个向量数据库，用于存储和搜索嵌入。我首先从环境中获取`PINECONE_API_KEY`并使用它连接到Pinecone。然后，我创建了一个名为"medicalbot"的索引，以便高效地存储嵌入进行相似性搜索。通过这个设置，我定义了一个函数，通过将用户查询与向量存储进行比较来搜索存储的数据，返回最相关的结果。

```python
PINECONE_API_KEY = os.environ.get('PINECONE_API_KEY')
pc = Pinecone(api_key=PINECONE_API_KEY)
index_name = "medicalbot"
index = pc.Index(index_name)

vector_store = PineconeVectorStore(index=index, embedding=embeddings)

def search_db(user_query: str) -> list:
    sim_docs =[]
    result = vector_store.similarity_search_with_score(
    user_query, k=3
    )
    for doc in result:
        sim_docs.append(doc[0].page_content)
    
    return sim_docs    

search = search_db(user_query="What is candidiasis?")
```
**步骤 4：设置LLM**

我设置了一个医疗AI聊天机器人，根据医学文献提供答案。它使用一个名为`ChatGroq`的大型语言模型（LLM），模型为"llama\-3\.3\-70b\-versatile"。函数`medicalbot_ai`接收用户查询和相关文档列表。然后，它处理查询，利用文档生成准确、对话式和专业的响应，并将答案返回给用户。响应旨在既具信息性又富有同情心，确保AI提供准确和有用的信息。

注意：我发现提示在AI中是多么重要。查询输出的好坏取决于提示的质量。

```python
## ---------------------------- LLM --------------------------------------
llm = ChatGroq(model_name="llama-3.3-70b-versatile", temperature=0.5)

def medicalbot_ai(user_query: str, doc_list: list) -> str:
    template = """
    You are a medical consultant AI chatbot. Your role is to provide accurate and reliable answers to user questions based on the provided documents. Use the information from the `doc_list` to address the `user_query` thoroughly and correctly. Ensure that your response is:

    - **Accurate:** Base your answers solely on the information in the provided documents.
    - **Conversational:** Maintain a friendly and approachable tone.
    - **Mature and Consultancy-Oriented:** Present information in a professional and trustworthy manner.

    **Inputs:**
    1. `user_query`: {user_query} The question posed by the user.
    2. `doc_list`: {doc_list} A list of documents containing relevant information related to the user's question.

    **Instructions:**
    - Analyze the `user_query` and identify the key information needed to answer it.
    - Review the `doc_list` to find relevant information that addresses the query.
    - Construct a response that is clear, concise, and directly answers the user's question using the information from the documents.
    - Avoid introducing information not present in the `doc_list`.
    - If the `user_query` have nothing similar to what is in the `doc_list`, return document not found or something in an apologetic way, tell the user to ask for something related to the context.
    - If the  `user_query` is an empty string, respond with "Please provide a valid query.".
    - Maintain a tone that is both professional and empathetic, suitable for a consultancy setting.
    
    Return the answer as the only output. 
    Always make sure that you're returning the answer without any explanation. 
    The output should be the answer alone.
    Always return this: "Please provide a valid query." for empty query.
    """
    question_prompt = PromptTemplate(input_variables=["user_query", "doc_list"], template=template)
    initiator_router = question_prompt | llm | StrOutputParser()
    output = initiator_router.invoke({"user_query":user_query, "doc_list":doc_list})
    return output
```
**步骤 5：整合医疗聊天机器人工作流程以处理用户查询**

`medical_chatbot`函数是聊天机器人工作流程的核心。它处理用户的查询并生成准确且相关的医疗响应。该函数首先记录它正在使用`search_db`函数在向量数据库中搜索与用户查询相关的文档。一旦检索到相关文档，该函数就调用`medicalbot_ai`函数生成响应，利用获取的文档提供准确、对话式和专业的答案。生成响应后，该函数记录最后一步并将聊天机器人的响应返回给用户。

该函数无缝连接了文档搜索过程和基于AI的答案生成，确保聊天机器人能够准确响应用户查询。

**步骤 6：使用Streamlit构建聊天机器人界面**

为了将所有内容整合成一个功能齐全的聊天机器人，我们将使用*Streamlit*库创建用户界面。

我使用Streamlit是因为它是免费的，其他人也可以与医疗机器人进行互动。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*yD9EtsqLXs9FETlcDRsCdQ.png)

## 结论

通过这些步骤，您可以成功构建一个 100% 开源的医疗聊天机器人，并使用 Streamlit 部署，以便用户与其互动。

有关完整代码和更多详细信息，请查看 GitHub 上的项目仓库：<https://github.com/Chinelonweke/medicalbot>

在这里与医疗聊天机器人互动：[https://medicalbot\-semf2x7tccjtfv8fzd7iih.streamlit.app/](https://medicalbot-semf2x7tccjtfv8fzd7iih.streamlit.app/)

感谢您的阅读，请留下您的意见。

您可以在这里找到我；

LinkedIn: [**Chinelo Nweke**](https://www.linkedin.com/feed/?trk=404_page)

x: [**Nelo Nweke**](https://x.com/nelonweke?s=21)

