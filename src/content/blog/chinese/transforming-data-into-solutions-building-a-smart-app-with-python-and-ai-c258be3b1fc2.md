---
title: "将数据转化为解决方案：使用 Python 和人工智能构建智能应用程序"
meta_title: "将数据转化为解决方案：使用 Python 和人工智能构建智能应用程序"
description: "本文探讨了如何利用Python和大语言模型（LLMs）构建智能应用Baker，该应用旨在通过推荐食谱来减少食材浪费。作者分享了项目开发过程中的技术细节，包括数据提取、后处理和Web应用构建，强调了AI在解决实际问题中的潜力。Baker是一个开源项目，利用现代工具实现快速原型设计，旨在鼓励合作和创新，同时计划未来扩展食谱数据库和增强搜索功能。"
date: 2025-01-05T02:01:32Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*a5KBQ814jdQYPYZ8"
categories: ["Programming", "Technology", "Machine Learning"]
author: "Rifx.Online"
tags: ["Baker", "Python", "LLMs", "FastAPI", "Streamlit"]
draft: False

---



一些金融分析师担心人工智能可能无法证明在该领域进行的大规模投资的合理性。虽然我理解他们的担忧，但我的看法有所不同。我既不是AI的乐观派，也不是悲观派——我相信AI有潜力推动创新、提升生产力，并带来可衡量的商业成果。

在我上一篇文章中，我探讨了大型语言模型（LLMs）如何用于结构化非结构化数据。这一次，我想更进一步：展示使用LLMs进行数据结构化的结果如何作为构建智能应用的**基础**。从而展示如何将AI融入更大的图景中。

在本文中，我将分享我如何使用现代技术栈快速推进Baker的开发和部署——一个将原始食谱数据集转化为易于使用解决方案的智能应用。这段旅程不仅突出了技术实施，还展示了AI如何解决实际挑战并在现实场景中提供切实价值。

## Baker: 你的烹饪灵感

在 [**LLMs（大语言模型）的一个（鲜为人知的）新兴应用**](https://towardsdatascience.com/the-lesser-known-rising-application-of-llms-775834116477) 中，我提到我需要一个食谱数据集来进行个人项目。现在，是时候揭晓这个项目了。



管理饮食对我来说一直是个挑战。我常常难以找到灵感来准备餐点，因此经常让食材浪费——这是我一直想改变的。因此，我着手创建一个食谱推荐系统，帮助我（和其他人）在食材变质之前使用它们。解决方案就是 **Baker**，我为解决这个问题而设计的原型。这个项目体现了我利用人工智能应对日常挑战，如 **食物浪费** 的热情。

Baker 是一个开源的网络应用，处于早期阶段，几乎完全用 Python 构建。该应用接受一份食材及其数量的列表——模拟你在冰箱和储藏室中可能找到的食材——并建议你可以使用这些食材准备的食谱。它旨在简化餐点准备，同时鼓励更智能、更可持续的饮食选择。你可以在这里亲自试用这个应用：

⇒ [mixit\-baker.streamlit.app](https://mixit-baker.streamlit.app/)

不过，你可能想先阅读文章的其余部分。在接下来的某个章节中，我会带你体验这个应用的演示。

## 从想法到POC：利用AI和现代工具加速开发

在对数据集进行初步解析后，我忙于其他工作，将这个副项目搁置了几个月😉。但技术发展迅速。当我最终重新开始这个项目时，一系列更新的模型、技术和工具已经出现或成熟，为重新审视和提升该项目提供了机会。

### Revisiting Data Extraction with GPT\-4o

第一步是重新审视我之前的数据提取工作并[更新结果](https://github.com/VianneyMI/baker/pull/10)。在我之前的迭代中，我使用了**MistralAI’s open\-mixtral\-8x7b**，但该工具已被弃用。这次，我切换到了更新且更先进的**GPT\-4o**，结果非常显著。

为了让改进更具可比性：

* 在早期的运行中，LLM由于JSON生成的不一致性未能解析89个食谱。
* 使用GPT\-4o，数据集中所有360个食谱均成功解析，达到了**100%的成功率**。

这一里程碑反映了人工智能能力提升的速度。就在几个月前，LLM经常难以可靠地输出有效的JSON。这次迭代不仅展示了更好的结果，也表明采用新工具可以带来显著的收益。

### 后处理挑战

即使在提取方面有所改善，原始数据仍需要大量后处理。食谱中使用的单位不一致——克、茶匙、杯等——使得比较和推荐变得具有挑战性。为了解决这个问题，我采用了系统的方法：

1. **标准化：** 我定义了一组有限的单位（例如，重量使用克，体积使用毫升）。
2. **映射和转换：** 所有原始单位都映射到这个子集，并相应调整数量。

这个规范化步骤对于实现准确的成分过滤和驱动食谱推荐引擎至关重要。它还强调了一个关键点：AI 输出必须在其预期应用中具有上下文意义，而不仅仅是技术上正确。

### 构建引擎和Web应用程序

在数据经过清理、标准化并准备好使用后，下一步是开始利用这些数据，我通过[构建引擎逻辑并将其封装在Web应用程序中](https://github.com/VianneyMI/baker/pull/18)来实现。

### 快速原型设计

在Baker的开发过程中，我采纳了快速原型设计的理念。目标不是从第一天就构建一个应用程序，而是探索工具和技术，测试想法并收集反馈。

**从笔记本到POC应用：**

我构建数据管道和使用AI的网页应用的方式展示了快速原型设计的理念。

* **数据管道：** 整个提取和后处理的管道都位于Jupyter笔记本中。虽然与全面的ETL管道相比，这种设置是“简约而实用”的，但它提供了快速迭代所需的速度和灵活性。最初，我将其视为一次性过程，但现在我计划将其[转变为](https://github.com/VianneyMI/baker/issues/22)更强大和可重复的东西。
* **网页应用：** 网页应用利用[**FastAPI**](https://fastapi.tiangolo.com/)作为后端，使用[**Streamlit**](https://streamlit.io/)作为前端。这些框架易于访问，开发者友好，非常适合快速原型设计交互式应用程序。
* **利用AI加速开发：** 前端完全使用[**Cursor**](https://www.cursor.com/)这个AI驱动的开发工具生成。虽然我之前听说过Cursor，但这个项目让我充分探索了它的潜力。这个体验非常愉快，以至于我计划写一篇专门的文章来介绍它。

通过采用这种方法，我能够在几天内构建一个可工作的MVP，而不是几周或几个月。

**开源：**

**Baker**的一个标志是它的**开源特性**。通过在GitHub上分享该项目，我希望：

* **鼓励合作：** 使其他人能够贡献新功能，增强代码库，或通过额外的数据集扩展应用程序。
* **激发学习：** 为那些对利用LLMs、结构化非结构化数据或构建推荐系统感兴趣的人提供一个实用的资源。

开源使其他人更容易再现结果，贡献改进，并交流想法。合作不仅增强了**Baker**，而且促进了集体创新。

**免费部署：可访问且轻量**

为了使**Baker**可访问，我使用免费服务进行了部署：

* [**Streamlit Cloud**](https://streamlit.io/cloud)：为前端提供支持，提供直观和交互式的用户体验。
* [**Koyeb**](https://www.koyeb.com/docs)：支持后端处理和API调用，而无需承担托管费用。

这些平台让我能够快速部署并进行实验，而没有传统托管解决方案的财务或技术障碍。这种部署策略突显了现代工具如何使创意变为可访问的应用程序，几乎没有成本。

## 幕后：驱动 Baker 的技术

在本节中，我将分享一些 Baker 的实现细节。它是开源的，因此我邀请我的技术读者去 GitHub 查看代码。有些读者可能想跳到下一节。

该应用程序采用极简设计，具有简单的三层架构，几乎完全使用 Python 构建。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Wb8bqb8ClDw7DDrYlQO3JQ.png)

它由以下组件组成：

1. **前端**：一个 **Streamlit** 界面为用户提供了一个直观的平台，以便与系统进行交互、查询食谱和接收推荐。
2. **后端**：使用 **FastAPI** 构建，后端作为处理用户查询和提供推荐的接口。
3. **引擎**：引擎包含查找和过滤食谱的核心逻辑，利用 [**monggregate**](https://vianneymi.github.io/monggregate/) 作为查询构建器。
4. **数据库**：食谱存储在一个 [**MongoDB**](https://www.mongodb.com/) 数据库中，该数据库处理引擎生成的聚合管道。

### 后端设置

后端在 `app.py` 中初始化，其中定义了 FastAPI 端点。例如：

```python
from fastapi import FastAPI
from baker.engine.core import find_recipes
from baker.models.ingredient import Ingredient

app = FastAPI()
@app.get("/")
def welcome():
    return {"message": "Welcome to the Baker API!"}
@app.post("/recipes")
def _find_recipes(ingredients: list[Ingredient], serving_size: int = 1) -> list[dict]:
    return find_recipes(ingredients, serving_size)
```
`/recipes` 端点接受一个成分列表和一个份量大小，然后将处理委托给引擎。

### 食谱引擎逻辑

应用程序的核心位于 `engine` 目录中的 `core.py`。它管理数据库连接和查询管道。以下是 `find_recipes` 函数的示例：

```python
## Imports and the get_recipes_collection function are not included

def find_recipes(ingredients, serving_size=1):
    # Get the recipes collection
    recipes = get_recipes_collection()

    # Create the pipeline
    pipeline = Pipeline()
    pipeline = include_normalization_steps(pipeline, serving_size)
    query = generate_match_query(ingredients, serving_size)
    print(query)
    pipeline.match(query=query).project(
        include=[
            "id",
            "title",
            "preparation_time",
            "cooking_time",
            "original_serving_size",
            "serving_size",
            "ingredients",
            "steps",
        ],
        exclude="_id",
    )

    # Find the recipes
    result = recipes.aggregate(pipeline.export()).to_list(length=None)

    return result
    
def generate_match_query(ingredients: list[Ingredient], serving_size: int = 1) -> dict:
    """生成匹配查询。"""

    operands = []
    for ingredient in ingredients:
        operand = {
            "ingredients.name": ingredient.name,
            "ingredients.unit": ingredient.unit,
            "ingredients.quantity": {"$gte": ingredient.quantity / serving_size},
        }
        operands.append(operand)

    query = {"$and": operands}

    return query


def include_normalization_steps(pipeline: Pipeline, serving_size: int = 1):
    """在管道中添加步骤以规范化数据库中的成分数量

    以下步骤通过食谱的份量规范化数据库中食谱的成分数量。

    """

    # 展开成分
    pipeline.unwind(path="$ingredients")

    pipeline.add_fields({"original_serving_size": "$serving_size"})
    # 添加规范化数量
    pipeline.add_fields(
        {
            # "orignal_serving_size": "$serving_size",
            "serving_size": serving_size,
            "ingredients.quantity": S.multiply(
                S.field("ingredients.quantity"),
                S.divide(serving_size, S.max([S.field("serving_size"), 1])),
            ),
        }
    )

    # 对结果进行分组
    pipeline.group(
        by="_id",
        query={
            "id": {"$first": "$id"},
            "title": {"$first": "$title"},
            "original_serving_size": {"$first": "$original_serving_size"},
            "serving_size": {"$first": "$serving_size"},
            "preparation_time": {"$first": "$preparation_time"},
            "cooking_time": {"$first": "$cooking_time"},
            # "directions_source_text": {"$first": "$directions_source_text"},
            "ingredients": {"$addToSet": "$ingredients"},
            "steps": {"$first": "$steps"},
        },
    )
    return pipeline
```
**Baker** 的核心逻辑位于 `find_recipes` 函数中。

该函数通过 monggregate 创建 MongoDB 聚合管道。此聚合管道包含多个步骤。

第一步由 `include_normalization_steps` 函数生成，该函数将动态更新数据库中成分的数量，以确保我们比较的是同类项。这是通过将数据库中的成分数量更新为用户所需的份量来完成的。

然后，实际的匹配逻辑由 `generate_match_query` 函数创建。在这里，我们确保食谱所需的成分不超过用户所拥有的成分。

最后，投影过滤掉我们不需要返回的字段。

## 用户指南：在几次点击中使用 Baker 发现食谱

**Baker** 帮助您通过寻找与您家中已有食材匹配的食谱，发现更好的食材利用方式。

该应用程序具有简单的基于表单的界面。输入您拥有的食材，指定其数量，并从可用选项中选择计量单位。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*NOR7Ivr0WvTTIq3fuKsClg.png)

在上面的例子中，我正在寻找一个**两人份**的食谱，以利用在我厨房里放置了太久的4个西红柿和2根胡萝卜。

**Baker** 找到了两个食谱！点击一个食谱可以查看完整的细节。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*tb_d9HrGgftSmTzcKvnYZw.png)

**Baker** 会根据您设置的份量调整食谱中的配料数量。例如，如果您将份量从两人调整为四人，应用程序会相应地重新计算配料数量。

更新份量大小也可能会改变出现的食谱。**Baker** 确保建议的食谱不仅与份量大小匹配，还与您手头的食材和数量相符。例如，如果您只有4个西红柿和2根胡萝卜供两人使用，**Baker** 将避免推荐需要4个西红柿和4根胡萝卜的食谱。

## 前路：扩大Baker的影响力

Baker是一个快速且务实开发的副项目，是一个功能原型，而不是一个生产就绪的应用程序。

然而，我希望看到它成长为更具影响力的东西。

应用程序在功能和复杂性上都有几个扩展的领域。为了向前发展，让我们解决其当前的局限性并探索可能的增强。

## 1 — 扩展食谱数据库

Baker 的食谱来源于 [Public Domain Recipes](https://publicdomainrecipes.com/)，这是一个开放源代码的食谱数据库。虽然这是一个了不起的项目，但可用的食谱数量有限。因此，**Baker** 目前只知道 360 种食谱。为了更好地理解这一点，一些专门的食谱网站声称拥有数万种食谱。

为了扩展，我需要识别更多的食谱数据来源。

## 2 — 改善数据摄取管道

目前，**数据摄取**是通过 Jupyter Notebooks 处理的。主要的技术优先事项之一是将这些笔记本转换为稳健的 Python 脚本，将它们集成到 **Baker** 的管理部分，或者甚至将它们分离成一个专用应用程序。

此外，我相信在 LLMs 执行的解析过程中还有改进的空间，以确保更高的一致性和准确性。

## 3 — 添加语义搜索与灵活性

目前，食谱是通过精确字符串匹配按成分名称进行搜索的。例如，搜索“tomato”将无法检索到提到“tomatoes”的食谱。这可以通过[使用向量数据库实现语义搜索的方法](https://vianmixt.notion.site/Practical-Semantic-Search-with-MongoDB-and-OpenAI-451692801b41465fae1bea5f70238279)来解决。通过**语义搜索**，成分名称的变体——无论是由于复数形式、地区差异还是翻译——都可以动态映射到同一概念。

此外，语义搜索将允许用户使用他们的母语进行搜索，进一步扩大可及性。

我还想引入**更大的搜索功能灵活性**。例如，如果用户搜索包含西红柿、胡萝卜和香蕉的食谱，但数据库中没有这样的组合，搜索仍应返回包含输入成分子集的食谱（例如，西红柿和胡萝卜、西红柿和香蕉，或胡萝卜和香蕉）。

从功能角度来看，这是我的首要任务。

## 其他值得考虑的增强功能

虽然上述是主要关注领域，但我还有很多其他主题想要讨论：

* 用户界面增强
* 食谱的排序和排名
* 改进的错误处理和健壮性
* 采用软件工程最佳实践
* 性能优化

## 结论

我希望你喜欢阅读将想法变为现实的旅程。如果你喜欢，请[考虑在 Buy Me a Coffee 上支持我](https://buymeacoffee.com/vianmixt)，以帮助资助未来的发展。现在，让我们总结一下关键要点。

几个月前，我写了一篇关于**使用 LLM 进行数据结构化和提取**的文章，这是一个由新一波生成性人工智能驱动的有前景的用例。在这篇后续文章中，我进一步阐述了这个概念，展示了一个具体的结果：使用 LLM 生成的数据集来支持一个以数据为中心的智能应用程序**Baker**。

在这个过程中，我旨在展示如何利用现代工具如**Streamlit、FastAPI、Streamlit Cloud、Koyeb 和 Cursor**使这个过程变得更加可及。如果你想深入了解我使用的工具，请在评论中告诉我。

这些工具提供了所需的灵活性和可及性，使我们能够专注于解决实际问题，而不是被管理多个方面的复杂性所压倒——数据管道、后端逻辑、前端接口、CI/CD 工作流、云部署、测试以及各种编程语言的复杂性。

但这个项目不仅仅是关于食谱——它是关于解锁非结构化数据的潜力，以解决现实世界的问题。例如，在**Baker**中使用的相同方法可以应用于创建个性化学习平台。通过将教育内容（如讲座记录或文章）结构化为可访问的格式并构建推荐引擎，可以帮助用户根据他们的目标或兴趣发现相关的学习材料。

无论是用于教育、产品推荐还是知识管理，我在这里分享的原则和工具都可以激发无数应用。

随着我们迈入新的一年，我鼓励你反思自己未开发的数据集和想法。你可以利用这里分享的工具和知识构建什么？通过小步伐、快速迭代和协作的心态，你也可以创造出**创新解决方案**，带来改变。

让我们一起建设一个更智能、更以数据驱动的未来。

