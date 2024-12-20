---
title: "构建一个能写入 Google 文档的研究助手（第 2 部分）"
meta_title: "构建一个能写入 Google 文档的研究助手（第 2 部分）"
description: "本文是构建一个可以写入Google Docs的研究助手系列的第二部分。文章介绍了如何使用LangGraph和Tavily构建一个研究代理，并通过Google Drive和Google Docs API实现文档的创建和编辑。文章详细描述了如何设置Google Cloud账户、创建服务账户、与Google Drive交互、生成文档及写入内容。最终，通过代理生成的文本被组织并存储在Google Docs中，为用户提供了一个便捷的研究和写作工具。"
date: 2024-12-19T21:37:42Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*NyLck27kmsq7AkmuDiHjzA.png"
categories: ["Programming", "Technology", "Natural Language Processing"]
author: "Rifx.Online"
tags: ["LangGraph", "Tavily", "GoogleDocs", "APIs", "serviceAccount"]
draft: False

---





### 可能对你的作业有所帮助的工具

***本文是两部分系列的第二部分，我们使用 LangGraph 和 Tavily 构建一个简单的研究代理，该代理可以撰写和完善短文。为了跟踪它生成的计划、文章和评论，我们增加了以编程方式创建和编辑 Google Docs 的能力。在第一篇文章中，我们构建了代理。现在我们将构建文档连接。你可以在 [这里](https://github.com/rmartinshort/research_assist) 找到所有相关代码。***

在[本系列的第一部分](https://towardsdatascience.com/building-a-research-agent-that-can-write-to-google-docs-part-1-4b49ea05a292)中，我们讨论了代理，并使用 LangGraph 和 Tavily 的工具构建了一个最小代理，该代理可以研究、撰写、审阅和修订短文。这对于演示来说很好，但如果我们实际上想在笔记本之外阅读这些文章呢？或者，更雄心勃勃的是，我们能否将这个代理变成一个对学习新主题的人有实际帮助的工具？这有可能成为一个全栈项目，但在这里我将专注于一个有趣的元素——赋予我们的系统将文章上传到 Google Docs 的能力。请记住，我们还保存了代理在得到最终答案时所采取的中间步骤——也许记录这些步骤也是值得的。

## 1\. 最小可行产品

针对问题或主题提示，我们的代理生成了一长串输出。至少，我们希望将其导入一个带有标题和时间戳的 Google 文档中。我们还希望控制这个文档在 Google Drive 中的写入位置，并且最好能够创建和命名文件夹，以便我们的论文可以逻辑性地存储。我们在这里不会过于关注格式——尽管使用 Google Docs API 当然可以实现——我们更感兴趣的是将文本放入一个人们实际上会阅读的地方。格式化可以作为后续步骤，或者简单地留给读者的偏好。

一旦我们建立了文档连接，就可以对我们的论文做很多更高级的事情——比如使用 LLM 将其重新格式化以进行演示，并将其上传到 Google Slides 演示文稿中？或者抓取一些参考数据源并将其上传到 Google Sheets？我们可以将此功能作为工具添加到代理的控制流程中，让它决定该做什么。显然，这里有很多选择，但从小处开始是个好主意。

## 2\. 连接到 Google Drive

让我们开始编写一些代码，以基本方式与 Google Docs 进行交互。首先需要一些设置：您需要一个 Google Cloud 账户和一个新项目。然后，您需要启用 Google Drive 和 Google Docs API。为了为该项目创建一些凭据，我们将使用一个 [服务账户](https://cloud.google.com/iam/docs/service-account-overview#:~:text=A%20service%20account%20is%20a,is%20unique%20to%20the%20account.)，可以按照 [这里](https://developers.google.com/zero-touch/guides/customer/quickstart/python-service-account) 的说明进行设置。此过程将创建一个 `.json` 文件中的私钥，您将其存储在本地计算机上。接下来，最好在您的 Google Drive 中为该项目创建一个“主文件夹”。完成后，您可以将服务账户添加到该文件夹并授予其写入权限。现在，您的服务账户拥有通过编程方式与该文件夹内容交互的授权。

```python
from google.oauth2 import service_account
from abc import ABC, abstractmethod
from googleapiclient.discovery import build
## path to your .json credentials file
from research_assist.gsuite.base.config import CREDENTIALS
from typing import Any


class GSuiteService(ABC):
    """
    An abstract base class for G Suite services.

    This class defines the structure for any G Suite service implementation,
    requiring subclasses to specify the scopes and service creation logic.

    Attributes:
        credential_path (str): The path to the credentials file.
        SCOPES (list): The scopes required for the service.
    """

    def __init__(self) -> None:
        """
        Initializes the GSuiteService with the credential path and scopes.
        """
        # The name of the file containing your credentials
        self.credential_path = CREDENTIALS
        self.SCOPES = self.get_scopes()

    @abstractmethod
    def get_scopes(self) -> list[str]:
        """
        Retrieves the scopes required for the G Suite service.

        Returns:
            list[str]: A list of scopes required for the service.
        """
        raise NotImplementedError("Subclasses must implement this method.")

    @abstractmethod
    def get_service(self, credentials: Any) -> Any:
        """
        Creates and returns the service object for the G Suite service.

        Args:
            credentials (Any): The credentials to use for the service.

        Returns:
            Any: The service object for the G Suite service.
        """
        raise NotImplementedError("Subclasses must implement this method.")

    def build(self) -> Any:
        """
        Builds the G Suite service using the provided credentials.

        Returns:
            Any: The constructed service object.
        """
        # Get credentials into the desired format
        creds = service_account.Credentials.from_service_account_file(
            self.credential_path, scopes=self.SCOPES
        )

        service = self.get_service(creds)
        return service


class GoogleDriveService(GSuiteService):
    """
    A service class for interacting with Google Drive API.

    Inherits from GSuiteService and implements the methods to retrieve
    the required scopes and create the Google Drive service.

    Methods:
        get_scopes: Returns the scopes required for Google Drive API.
        get_service: Creates and returns the Google Drive service object.
    """

    def get_scopes(self) -> list[str]:
        """
        Retrieves the scopes required for the Google Drive service.

        Returns:
            list[str]: A list containing the required scopes for Google Drive API.
        """
        SCOPES = ["https://www.googleapis.com/auth/drive"]
        return SCOPES

    def get_service(self, creds: Any) -> Any:
        """
        Creates and returns the Google Drive service object.

        Args:
            creds (Any): The credentials to use for the Google Drive service.

        Returns:
            Any: The Google Drive service object.
        """
        return build("drive", "v3", credentials=creds, cache_discovery=False)
```
代码是这样设置的，因为我们可能希望在将来使用许多 GSuite API（drive、docs、sheets、slides 等）。它们都将继承自 `GSuiteService`，并用该 API 的特定细节覆盖其 `get_service` 和 `get_scopes` 方法。

一旦这一切设置好，您就可以与驱动器进行交互。这是一篇很好的 [文章](https://medium.com/@matheodaly.md/using-google-drive-api-with-python-and-a-service-account-d6ae1f6456c2)，展示了一些主要的交互方式。

在我们的实现中，我们将通过 `GoogleDriveHelper` 的方法与驱动器进行交互，该方法在初始化时创建 `GoogleDriveService` 的实例。我们首先给它我们主文件夹的名称。

```python
from research_assist.gsuite.drive.GoogleDriveHelper import GoogleDriveHelper

master_folder_name = ai_assistant_research_projects
drive_helper = GoogleDriveHelper(f"{master_folder_name}")
```
现在假设我们想创建一个关于旅行者系列太空探测器的项目。我们可以通过在主文件夹内设置一个文件夹来进行组织：

```python
project_folder_id = drive_helper.create_new_folder("voyager")
```
这将创建文件夹并返回其 ID，我们可以用它在其中创建文档。这个项目可能有多个版本，因此我们还可以创建相关的子文件夹。

```python
version_folder_id = drive_helper.create_new_folder(
  "v1", 
  parent_folder_id=project_folder_id
)
```
现在我们准备创建一个空白文档，这也可以通过驱动器服务来完成。

```python
final_report_id = drive_helper.create_basic_document(
    "final report", parent_folder_id=version_folder_id
)
```
在后台，驱动器助手正在运行以下代码，该代码传递一些元数据，表示我们希望向 `googleapiclient.discovery.build` 的创建方法创建一个文档（即，运行 `GoogleDriveService().build()` 的结果）。

```python
document_metadata = {
            "name": document_name,
            "mimeType": "application/vnd.google-apps.document",
            "parents": [parent_folder_id],
}
## make the document
doc = (
  self.drive_service.files()
  .create(body=document_metadata, fields="id")
  execute()
)
doc_id = doc.get("id")
```
正如您所想，Google Drive API 有很多不同的功能和选项，我们在这里没有涵盖。到目前为止，我发现的最全面的 Python 包装器是 [这个](https://github.com/iterative/PyDrive2)，如果您想进一步探索，这是一个不错的起点。

## 3\. 写入 Google 文档

现在我们已经创建了一个空白文档，让我们来填充最终的论文！这就是 `GoogleDocsService` 和 `GoogleDocsHelper` 的用武之地。`GoogleDocsService` 与 `GoogleDriveService` 非常相似，并且也继承自我们在第 2 节中讨论的 `GSuiteService`。`GoogleDocsHelper` 包含一些将文本和图像写入 Google 文档的工具。它们现在非常基础，但这正是我们这个项目所需的。

我们可以首先使用在第 1 部分中构建的代理来写一篇关于 Voyager 的论文。

```python
from research_assist.researcher.Agent import ResearchAgent, load_secrets
from langchain_openai import ChatOpenAI
from tavily import TavilyClient

secrets = load_secrets()
model = ChatOpenAI(
    model="gpt-4o-mini", temperature=0, api_key=secrets["OPENAI_API_KEY"]
)
tavily = TavilyClient(api_key=secrets["TAVILY_API_KEY"])

agent = ResearchAgent(llm, tavily)
agent.run_task(
    task_description="The Voyager missions: What did we learn?", 
    max_revisions=3

)
```
请记住，代理的各种输出存储在其内存中，可以使用以下方式进行探索。在代码中，您可以看到我们使用“user\_id = 1”作为占位符，但在具有多个用户的应用程序中，该 ID 将允许模型访问正确的内存存储。

```python
memories = agent.in_memory_store.search(("1", "memories"))
```
最终报告文本可以在此处找到，关键名称对应于我们在第 1 部分中讨论的 AgentState。它位于索引 -3，因为它后面跟着对编辑节点的调用（该节点返回了“是”）和接受节点，后者现在只返回“True”。接受节点可以很容易扩展为将此报告自动写入文档。

```python
final_essay = agent.in_memory_store.search(("1", "memories"))[-3].dict()["value"][
    "memory"
]["write"]["draft"]
```
让我们看看如何将这段文本放入 Google 文档中。请记住，在第 2 节中，我们使用 `doc_id` 创建了一个空白文档。`GoogleDocsHelper` 有两个基本方法可以做到这一点。第一个旨在提供标题和基本元数据，即文档撰写的日期和时间。第二个将一些文本粘贴到文档中。

代码展示了如何控制文本的位置和格式，这可能有些混乱。我们定义了一个包含 `insertText` 等指令的请求列表。当我们插入文本时，需要提供开始插入的索引，这对应于文档中的一个位置。

```python
def create_doc_template_header(self, document_title: str, doc_id: str) -> int:
     """
     为文档创建一个标题模板，包括标题和当前日期。

     参数：
         document_title (str): 文档的标题。
         doc_id (str): 要更新的文档的 ID。

     返回：
         int: 插入标题后的索引。
     """
     # 添加模板标题
     title = f"""
     {document_title}
     """
     template = f"""
     撰写于 {datetime.date.today()}，时间为 {datetime.datetime.now().strftime("%H:%M:%S")}
     """
     requests: List[Dict[str, Any]] = [
            {
                "insertText": {
                    "location": {
                        "index": 1,
                    },
                    "text": template,
                }
            },
            {
                "insertText": {
                    "location": {
                        "index": 1,
                    },
                    "text": title,
                }
            },
            {
                "updateParagraphStyle": {
                    "range": {
                        "startIndex": 1,
                        "endIndex": len(title),
                    },
                    "paragraphStyle": {
                        "namedStyleType": "TITLE",
                        "spaceAbove": {"magnitude": 1.0, "unit": "PT"},
                        "spaceBelow": {"magnitude": 1.0, "unit": "PT"},
                    },
                    "fields": "namedStyleType,spaceAbove,spaceBelow",
                }
            },
            {
                "updateParagraphStyle": {
                    "range": {
                        "startIndex": len(title) + 1,
                        "endIndex": len(title) + len(template),
                    },
                    "paragraphStyle": {
                        "namedStyleType": "SUBTITLE",
                        "spaceAbove": {"magnitude": 1.0, "unit": "PT"},
                        "spaceBelow": {"magnitude": 1.0, "unit": "PT"},
                    },
                    "fields": "namedStyleType,spaceAbove,spaceBelow",
                }
            },
        ]
     result = (
            self.docs_service.documents()
            .batchUpdate(documentId=doc_id, body={"requests": requests})
            .execute()
     )
     end_index = len(title) + len(template) + 1
     return end_index

def write_text_to_doc(self, start_index: int, text: str, doc_id: str) -> int:
     """
     在指定索引处将文本写入文档。

     参数：
         start_index (int): 插入文本的索引。
         text (str): 要插入的文本。
         doc_id (str): 要更新的文档的 ID。

     返回：
         int: 插入文本后的索引。
     """
     end_index = start_index + len(text) + 1

     requests: List[Dict[str, Any]] = [
            {
                "insertText": {
                    "location": {
                        "index": start_index,
                    },
                    "text": text,
                }
            },
            {
                "updateParagraphStyle": {
                    "range": {
                        "startIndex": start_index,
                        "endIndex": start_index + len(text),
                    },
                    "paragraphStyle": {
                        "namedStyleType": "NORMAL_TEXT",
                        "spaceAbove": {"magnitude": 1.0, "unit": "PT"},
                        "spaceBelow": {"magnitude": 1.0, "unit": "PT"},
                    },
                    "fields": "namedStyleType,spaceAbove,spaceBelow",
                }
            },
        ]

     result = (
            self.docs_service.documents()
            .batchUpdate(documentId=doc_id, body={"requests": requests})
            .execute()
        )

     return end_index
```
您可以在 [这里](https://developers.google.com/docs/api/concepts/structure#indexes) 了解有关索引的更多信息。当多个 `insertText` 调用时，似乎先写最后一段文本更容易——例如在下面的代码中，`template`（即应出现在标题下的元数据）首先出现在索引 1 的列表中。然后我们在索引 1 处写入 `title`。这导致 `title` 在文档中首先出现，而 `template` 出现在下面。请注意，我们还需要指定 `paragraphStyle` 块的 `startIndex` 和 `endIndex` 以更改文本的格式。

上述代码中的两个方法返回当前文本块的结束索引，以便可以将其用作后续要附加块的起始索引。如果您打算更具创意地处理文档的样式和格式，这份 [指南](https://developers.google.com/docs/api/concepts/document) 可能会有所帮助。

现在我们已经看到了底层代码，我们可以调用它将我们的最终报告写入文档。

```python
from research_assist.gsuite.docs.GoogleDocsHelper import GoogleDocsHelper

docs_helper = GoogleDocsHelper()

## 添加文档标题 
title_end_index = docs_helper.create_doc_template_header(
    "voyager final report", doc_id
)

## 添加文本
doc_end_index = docs_helper.write_text_to_doc(
    start_index=title_end_index, text=final_essay, doc_id=doc_id
)
```
太好了！现在我们拥有所有的文档工具，可以编辑、格式化和分享我们的代理生成的报告。有趣的是，代理将文本格式化为 Google 文档支持的 markdown，但我无法找到一种方法让文档自动识别并将 markdown 转换为漂亮的标题和副标题。毫无疑问，有办法做到这一点，这将使报告看起来更好。

运行上述代码后，文档应该看起来像这样。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*_fqYndNfBtofDV-irgYWVg.png)

## 4\. 其他代理输出的情况如何？

我们应该能够将存储在代理内存中的所有信息写入文档，这将使我们能够轻松浏览每个阶段的结果。一种稍微黑客式的方法如下：

```python
memories = agent.in_memory_store.search(("1", "memories"))

## this is needed because we may call some nodes several times 
## and we want to keep track of this so that we can make new documents
## for each call
seen_keys = set()
iterations = defaultdict(int)

## folder id where we want to write the documents
folder_id = f"{folder_id}"

for m in memories:
    data = m.dict()["value"]["memory"]
    available_keys = data.keys()
    node_key = list(available_keys)[0]
    unique_node_key = node_key + "_00"
    if unique_node_key in seen_keys:
        iterations[node_key] += 1
        unique_node_key = unique_node_key.replace("_00", "") + "_{:02d}".format(
            iterations[node_key]
        )

    print("-" * 20)
    print("Creating doc {}".format(unique_node_key))

    # get the text
    text = data[node_key][list(data[node_key].keys())[0]]
    
    # the tavily research output is a list, so convert it to a string
    if isinstance(text, List):
        text = "\n\n".join(text)
    
    # if anything else is not a string (e.g. the output of the accept node)
    # convert it to a string
    if not isinstance(text, str):
        text = str(text)

    # create document
    report_id = drive_service.create_basic_document(
        unique_node_key, parent_folder_id=folder_id
    )

    # create header
    end_index = docs_helper.create_doc_template_header(unique_node_key, report_id)

    # fill document
    end_index = docs_helper.write_text_to_doc(
        start_index=end_index, text=text, doc_id=report_id
    )

    seen_keys.add(unique_node_key)
```
这将生成 7 个文档，下面我们来看一些示例截图。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*2eOBYBOc39mwXbXUHQMg8Q.png)

初步计划概述了报告的结构。有趣的是，模型似乎更倾向于许多短小的部分，我认为这在应对要求使其简明易懂的提示时是合适的。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*l6S88_mOIBGeAthTpVzW3Q.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*LzjOh8YtJDebkPpOj1ISRw.png)

在研究阶段，调用 Tavily 搜索并返回与所用查询相关的小块格式良好的文本。其中一些块被截断，这份文档的可读性不高，但它很好地展示了从研究节点到写入节点传递的信息类型。

在审查阶段，我们得到了对论文第一版的精彩批评。通常，这些评论的结构与初步计划相似，并提出许多非常一般性的建议，例如“考虑使用更具描述性的标题”或“这一部分可以扩展以包含更多示例”。如果我们比较审查前后的实际报告，通常只会看到结构上的小变化，以及每个部分的一些额外细节。这种变化在多大程度上实际上提高了文本的质量是有争议的，但通过在几个示例上进行尝试，我相信这确实有帮助。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*O_939mk3xCwV3afNczl-_Q.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*-4bYGBwP9WEeY3w3N-xrVg.png)

最后，我们得到了编辑对审查后草稿的判断。我目前使用的提示使得编辑相当宽容，因此通常会说一些类似于这里所示的内容。通过一些提示调整，我们可以鼓励它在需要时将更多报告发送回审查。

这就是本文和这个迷你系列的全部内容。感谢您的阅读，希望您能在自己的项目中找到一些有用的信息。在使研究代理更加稳健、对其输出进行适当评估以及与文档（或其他 GSuite API）进行更好集成方面，还有很多潜在的扩展。请告诉我您是否有其他有趣的想法！

作者与本文讨论的任何工具没有关联。

