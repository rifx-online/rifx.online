---
title: "Building a Research Assistant That Can Write to Google Docs (Part 2)"
meta_title: "Building a Research Assistant That Can Write to Google Docs (Part 2)"
description: "This article details the development of a research assistant capable of writing and refining articles in Google Docs using LangGraph and Tavily. It outlines the process of connecting to Google Drive, creating folders, and writing documents programmatically. The article emphasizes building a minimal viable product, leveraging Google APIs, and using a service account for authorization. It also discusses how to structure and insert text into Google Docs, highlighting the potential for further enhancements such as integrating with other GSuite APIs. The author encourages exploration of additional functionalities and improvements for the research agent."
date: 2024-12-19T21:37:42Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*NyLck27kmsq7AkmuDiHjzA.png"
categories: ["Programming", "Technology", "Natural Language Processing"]
author: "Rifx.Online"
tags: ["LangGraph", "Tavily", "GoogleDocs", "APIs", "serviceAccount"]
draft: False

---







### A tool that might help with your homework

***This article is the second of a two part series where we use LangGraph and Tavily to build a simple research agent, which writes and refines short articles. To keep track of the plans, articles and comments it generates we add the ability to programmatically create and edit Google Docs. In the first article we built the agent. Now we will build the docs connection. You can find all the relevant code [here](https://github.com/rmartinshort/research_assist).***

In [part 1 of this series](https://towardsdatascience.com/building-a-research-agent-that-can-write-to-google-docs-part-1-4b49ea05a292) we discussed agents, and used tools from LangGraph and Tavily to build a minimal agent that can research, write, review and revise short articles. This is great for a demo, but what if we actually want to read those articles outside of a notebook? Or, more ambitiously, what if we can to make this agent into a tool that might actually be useful to someone learning about a new subject? This has the potential to become a full stack project, but here I will focus on just one interesting element — giving out system the ability to upload essays to Google Docs. Recall that we also save the intermediate steps that the agent takes in getting to the final answer too — probably its worth making a record of those as well.


## 1\. A minimal viable product

In response to a question or topic prompt, our agent produces a long list of output. At a minimum, we’d like to dump this into a Google Doc with a title, and timestamp. We’d also like to control where in Google Drive this doc is to be written, and preferably have the option to create and name a folders so that our essays can be stored logically. We won’t focus too much on formatting here — although this is certainly possible using the Google Docs API — we are more interested in just getting the text into a place where someone would actually read it. Formatting could be a follow up, or simply left to the preference of the reader.

Once we have a docs connection set up, there’s a whole host of more advanced things we could do with our essay — what about using an LLM to reformat them for a presentation and uploading that into a Google Slides deck? Or scraping some referenced data source and uploading that to Google Sheets? We could add this functionality as tools inside the control flow of our agent and have it decide what to do. Clearly there’s a lot of options here but its good to start small.


## 2\. Connecting to Google Drive

Let’s start by writing some code to interact with Google Docs in some basic ways. Some setup is required first: You will need a Google Cloud account and a new project. You will then need to enable the Google Drive and Google Docs APIs. To create some credentials for this project, we will be using a [service account](https://cloud.google.com/iam/docs/service-account-overview#:~:text=A%20service%20account%20is%20a,is%20unique%20to%20the%20account.), which can be set up using the instructions [here](https://developers.google.com/zero-touch/guides/customer/quickstart/python-service-account). This process will create a private key in a `.json` file, which you store on your local machine. Next, it’s a good idea to make a “master folder” for this project in your Google Drive. When that’s done, you can add your service account to this folder and give it write permissions. Now your service account has the authorization to programmatically interact with the contents of that folder.


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
The code is set up like this because there are many GSuite APIs (drive, docs, sheets, slides etc) that we might want to use in future. They would all inherit from `GSuiteService` and have their `get_service` and `get_scopes` methods overwritten with the specific details of that API.

Once this is all set up, you’re ready to interact with drive. This is a great [article](https://medium.com/@matheodaly.md/using-google-drive-api-with-python-and-a-service-account-d6ae1f6456c2) showing some of the main ways of doing so.

In our implementation, the way we’ll interact with drive is via methods of `GoogleDriveHelper` , which creates an instance of `GoogleDriveService` on initialization. We start with giving it the name of our master folder


```python
from research_assist.gsuite.drive.GoogleDriveHelper import GoogleDriveHelper

master_folder_name = ai_assistant_research_projects
drive_helper = GoogleDriveHelper(f"{master_folder_name}")
```
Now let’s say we want to create a project about the Voyager series of space probes, for example. We can get organized by setting up a folder for that inside the master folder:


```python
project_folder_id = drive_helper.create_new_folder("voyager")
```
This creates the folder and returns its ID, which we can use to create a document there. There might be multiple versions of this project, so we can also make relevant subfolders


```python
version_folder_id = drive_helper.create_new_folder(
  "v1", 
  parent_folder_id=project_folder_id
)
```
Now we’re ready to make a blank document, which we can also do with the drive service


```python
final_report_id = drive_helper.create_basic_document(
    "final report", parent_folder_id=version_folder_id
)
```
Under the hood, the drive helper is running the following code, which passes some metadata indicating that we want to make a document to the create method of `googleapiclient.discovery.build` (i.e. what comes out of running `GoogleDriveService().build()` )


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
As you might imagine, the Google Drive API has a lot of different functionality and options that we’re not covering here. The most comprehensive python wrapper for it that I’ve found is [this one](https://github.com/iterative/PyDrive2), which would be a good starting point if you want to explore further.


## 3\. Writing to Google Docs

Now that we’ve made a blank document, let’s fill it with the final essay! This is where the `GoogleDocsService` and `GoogleDocsHelper` come in. `GoogleDocsService` is very similar to `GoogleDriveService` , and also inherits from `GSuiteService` as we discussed in section 2\. `GoogleDocsHelper` contains some tools to write text and images to Google Docs. They’re very basic right now, but thats all we need for this project.

We can first use the agent we built in part 1 to write an essay about Voyager


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
Recall that the various outputs of the agent are stored in its memory, which can be explored with the following. In the code, you can see that we’re using “user\_id \= 1” as a placeholder here, but in an application that has multiple users this id would allow the model to access the correct memory store.


```python
memories = agent.in_memory_store.search(("1", "memories"))
```
The final report text can be found here, with the key names corresponding to the AgentState that we discussed in part 1\. It’s at index \-3 because it’s followed by a call to the editor node (which said yes) and the accept node, which right now just returns “True”. The accept node could be easily be extended to actually write this report to a doc automatically.


```python
final_essay = agent.in_memory_store.search(("1", "memories"))[-3].dict()["value"][
    "memory"
]["write"]["draft"]
```
Let’s see how we can put this text in a google doc. Recall that in section 2 we made a blank document with `doc_id` . There are two basic methods of `GoogleDocsHelper` which can do this. The first is designed to provide a title and basic metadata, which is just the date and time at which the document was written. The second will paste some text into the document.

The code shows how to control aspects of the position and formatting of the text, which can be a bit confusing. We define a list of requests containing instructions like `insertText` . When we insert text, we need to provide the index at which to start the insertion, which corresponds to a position in the document.


```python
def create_doc_template_header(self, document_title: str, doc_id: str) -> int:
     """
     Creates a header template for the document, 
     including the title and the current date.

     Args:
         document_title (str): The title of the document.
         doc_id (str): The ID of the document to update.

     Returns:
         int: The index after the inserted header.
     """
     # add template header
     title = f"""
     {document_title}
     """
     template = f"""
     Written on {datetime.date.today()} at {datetime.datetime.now().strftime("%H:%M:%S")}
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
     Writes text to the document at the specified index.

     Args:
         start_index (int): The index at which to insert the text.
         text (str): The text to insert.
         doc_id (str): The ID of the document to update.

     Returns:
         int: The index after the inserted text.
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
You can learn more about how indices are defined [here](https://developers.google.com/docs/api/concepts/structure#indexes). When multiple `insertText` calls, it appears to be easier to write the last piece of text first — for example in the code below `template` (which is the metadata that’s supposed to appear below the title) appears first in the list at index 1\. Then we write `title` at index 1\. This results in `title` appearing first in the document and `template` appearing below. Note how we also need to specify the `startIndex` and `endIndex` of the `paragraphStyle` blocks in order to change the formatting of the text.

Both methods in the code above return the end index of the current block of text so that it can be used as the start index of subsequent blocks to be appended. If you intend to get more creative with the style and formatting of documents, this [guide](https://developers.google.com/docs/api/concepts/document) will likely help.

Now that we’ve seen the underlying code, we can call it to write our final report to a document.


```python
from research_assist.gsuite.docs.GoogleDocsHelper import GoogleDocsHelper

docs_helper = GoogleDocsHelper()

## add the document title 
title_end_index = docs_helper.create_doc_template_header(
    "voyager final report", doc_id
)

## add the text
doc_end_index = docs_helper.write_text_to_doc(
    start_index=title_end_index, text=final_essay, doc_id=doc_id
)
```
Great! Now we have all the tools of docs at our disposal to edit, format and share the report that our agent generated. Interestingly, the agent formatted the text as markdown which is supported by Google Docs, but I was unable to find a way to get the document to automatically recognize this and convert the markdown into nice headers and subheaders. No doubt there is a way to do that and it would make the reports look much nicer.

After running the code above, the doc should look something like this.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*_fqYndNfBtofDV-irgYWVg.png)


## 4\. What about the other agent outputs?

We should be able to write all the information thats stored in the agent memory to docs, which will allow us to easily browse through the results of each stage. A somewhat hacky way to do this is as follows:


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
This is going to make 7 documents, and we’ll take a look at some example screenshots below

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*2eOBYBOc39mwXbXUHQMg8Q.png)

The initial plan outlines the structure of the report. It’s interesting that the model seems to favor lots of short sections, which I think is appropriate given the prompt request to make it concise and digestible to a general readership.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*l6S88_mOIBGeAthTpVzW3Q.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*LzjOh8YtJDebkPpOj1ISRw.png)

At the research phase, Tavily search is called and returns small chunks of nicely formatted text relevant to the queries that were used. Some of these chunks are truncated and this document is not especially readable, but it gives a good sense of the type of information that is passing from the research node to the write node.

At the review phase, we get an eloquent criticism of the first version of the essay. Typically these reviews are structured similarly to the initial plan and make a lot of very general recommendations such as “consider using more descriptive titles” or “this section could be expanded to include more examples”. If we compare the actual reports before and after the reviews, we typically see only minor changes to the stucture and some additional details in each of the sections. The extent to which this actually improves the quality of the text is debatable, but from trying it out on a few examples I am convinced that it does help.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*O_939mk3xCwV3afNczl-_Q.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*-4bYGBwP9WEeY3w3N-xrVg.png)

Finally, we get the editor’s judgement on the post\-review draft. The prompt I am currently using makes the editor rather lenient, so it usually says something to the effect of whats shown here. With some prompt tweaks we could encourage it to send more reports back to review if desirable.

That’s it for this article and this mini series. Thanks for reading and I hope you find some of this useful for your own projects. There are lots of potential extensions here in terms of making the research agent more robust, a proper evaluation of its outputs and better integrations with Docs (or other GSuite APIs). Please let me know if you have any other cool ideas!

The author is unaffiliated with any of the tools discussed in this article.


