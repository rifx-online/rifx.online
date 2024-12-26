---
title: "From Posts to Reports: Leveraging LLMs for Social Media Data Mining"
meta_title: "From Posts to Reports: Leveraging LLMs for Social Media Data Mining"
description: "This article discusses the use of large language models (LLMs) to extract valuable insights from social media posts, specifically focusing on Instagram restaurant content. It outlines a systematic approach that includes data crawling, storage, prompt engineering, and response formatting to generate concise weekly reports on offers, events, and discounts. The implementation utilizes tools like Instaloader for data collection, MongoDB for storage, and Langchain for managing LLM interactions. The process culminates in creating structured Excel reports, enhancing data accessibility and usability for business growth."
date: 2024-12-26T04:30:18Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*AImMcgC4HcCxLtYaHnlYrA.jpeg"
categories: ["Programming", "Data Science", "Natural Language Processing"]
author: "Rifx.Online"
tags: ["LLMs", "Instagram", "Instaloader", "MongoDB", "Langchain"]
draft: False

---





### How to instruct LLMs to filter restaurant posts and extract critical insights for business growth.




### Application Overview

We’re living in the golden age of automation, powered by the rise of large language models (LLMs). From transforming industries to unlocking endless applications, LLMs have revolutionized how we interact with data, primarily through natural language.

In this article, I’ll show you how to instruct an LLM to cut through social media noise and extract the information that matters most. Specifically, we’ll dive into how you can mine Instagram restaurant posts to gather valuable data — think special offers, discounts, and events — and compile it into a sleek weekly report.


### Why is this useful?

As the old saying goes, **“Knowledge is power.”**

Using the algorithm presented in this article, you can obtain all the crucial data you care about in a specific field, reducing the time you spend searching for this data to 0 by simply pressing one button and having the LLM do all the work.

Later in this article I will also show you how to write this data in an easily readable structure like **CSV** or **EXCEL** for storage or data querying/filtering.

This method is much more advanced than old web crawling/scraping methods because, with the help of an LLM, we can filter extracted content however we want, focusing only on what interests us.


### Table of contents:

1\. Data Crawling2\. Data Storage3\. Prompt Engineering4\. LLM Usage5\. Response Formatting6\. Putting Everything Together

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*3jAV-0Cy_VrJvyD1nNnJhw.jpeg)


## 1\. Data Crawling

**Disclaimer**: Based on your region, this implementation might not work for you because different regulations apply to web crawling. (This was tested with a Romanian IP)

A **data crawler** (or web crawler) is an automated program or script that systematically browses the internet to collect and index data from websites.

In this case we will use the [**Instaloader**](https://instaloader.github.io/) **\[2],** aPython library that handles the crawling aspect and will provide us with all the information we want about a **public** Instagram profile.


```python
class InstagramCrawler:
    def __init__(self, page_name: str, proxy=None):
        self.page_name = page_name
        self.loader = instaloader.Instaloader()
        self._until = datetime.now()
        self._since = self._until - timedelta(days=7)

    def scrap(self) -> List[Dict[str, str | Any]]:
        profile = instaloader.Profile.from_username(self.loader.context, self.page_name)
        posts = takewhile(lambda p: p.date > self._since, dropwhile(lambda p: p.date > self._until, profile.get_posts()))

        return [
            {'content': post.caption, 'date': post.date, 'link': f"https://www.instagram.com/{self.page_name}"}
            for post in posts
        ]
```
Here we use `datetime.now()`to get the exact date when we run this and subtract 7 days so we only get the post from last week.

We will also need a **config.py** module to create a **Settings** class where we will keep all constants and pass environment secrets to access them later in other methods instead of doing something like: **os.getenv('SOME\_ENV\_VALUE')**.

This is done with the help of the Pydantic **BaseSettings** class.

If you don’t know what Pydantic is, I recommend reading its documentation. Pydantic models are paramount in Python programming, and I will discuss them a bit later in this article.


```python
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8', extra='ignore')

    # OPENAI
    OPENAI_API_KEY: str
    OPENAI_MODEl: str = "gtp-4o-mini"

    # DB
    MONGO_HOST: str = 'localhost'
    MONGO_PORT: int = 27017
    MONGO_USER: str = None
    MONGO_PASSWORD: str = None
    MONGO_DATABASE: str = 'restaurants'
    MONGO_URI: str = f"mongodb://{MONGO_USER}:{MONGO_PASSWORD}@{MONGO_HOST}:{MONGO_PORT}"

    # PROFILES TO CRAWL
    PROFILES_TO_SCRAP: dict = {
        "KFC": {"page_name": "kfc", "city": "Salt Lake"},
        "MC": {"page_name": "mcdonalds", "city": "San Bernardino"},
        "In-N-Out Burger": {"page_name": "innout", "city": "Baldwin Park"},
        "Taco Bell": {"page_name": "tacobell", "city": "Downey"},
        "Wendy's": {"page_name": "wendys", "city": "Columbus"},
    }


settings = Settings()
```

## 2\. Data Storage

I also added a database, in this case [**MongoDB**](https://www.mongodb.com/)**,** because we are dealing with unstructured data. This way, we can store extracted posts if we want to do something with them later (better safe than **sorry**)**.**


```python
from pymongo.errors import ConnectionFailure
from pymongo import MongoClient
from config import settings


class DatabaseConnection:
    _client: MongoClient = None

    @classmethod
    def connect(cls):
        if cls._client is None:
            try:
                cls._client = MongoClient(settings.MONGO_URI)
            except ConnectionFailure as exc:
                print(f'Exception while connecting to database: {exc}')
                raise

    @classmethod
    def get_database(cls, name: str):
        if cls._client is None:
            cls.connect()
        return cls._client[name]

    @classmethod
    def close(cls):
        if cls._client is not None:
            cls._client.close()


database = DatabaseConnection.get_database(settings.MONGO_DATABASE)
```
The db runs locally inside a [**Docker**](https://www.docker.com/) container.


```python
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    container_name: mongo_db
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}

volumes:
  mongo-data:
```

## 3\. Prompt Engineering

Prompt engineering can be summarized as designing and refining prompts to guide the behavior of language models or AI systems effectively. It involves crafting inputs to optimize the model’s output, ensuring it generates accurate, relevant, and coherent responses based on the user’s needs. In simpler terms, think of it as tweaking the input to maximize the quality of the output.

This is where the magic happens in this application.

At this step, we define the behavior of our LLM and instruct it on what information to look for and extract.

We also avoid hallucinations by having a second prompt to refine the response. This component is found within the **templates.py** module.


```python
PROFILES_REPORT_TEMPLATE = (
    "You're a Restaurnat specialist. Analyze social media posts from various restaurant pages and create a concise report extracting the following information:\n"
    "1. Giveaways\n"
    "2. Events (including dates)\n"
    "3. Deals and discounts (e.g., price reductions, 1+1 offers)\n"
    "4. New menu items\n"
    "For each item, include:\n"
    "- Restaurant page name"
    "- Post link"
    "- Restaurant location (city)\n"
    "Only include information from the provided posts that fits these categories. Avoid descriptive posts about dishes unless they mention specific offers or discounts.\n"
    "Posts to analyze: {input_var}"

)

PROFILES_TEMPLATE_REFINE = (
    "You're a restaurant specialist who has generated a report on various restaurant social media posts.\n"
    "Previous report: {raport}\n"
    "This report needs to be more concise and follow a predefined structure:\n"
    "1. Analyze your previous report.\n"
    "2. Adapt the report to the following structure: {format_instructions}\n"
    "If there's no relevant information for a key, leave it as an empty list\n."
    "Your response should only contain the specified structure, without ```json ``` tags."
)
```
**The first prompt** is designed to extract specific types of information from social media posts (like Instagram or Facebook), focusing only on relevant business\-related information.

Restaurants frequently post about events, promotions, or new items, which are often mixed with unrelated content like dish descriptions or aesthetic photos. The goal of this prompt is to filter through the noise and extract key business\-relevant data.

**The second prompt** is a refinement stage to ensure that the initial output meets the predefined structure and is more concise.

After the initial extraction, we may still encounter data that isn’t perfectly formatted or is overly verbose. This prompt ensures that the model reanalyzes and formats the data correctly while removing unnecessary information.


## 4\. LLM Usage

At this step there is not much work to be done. We need a method that allows us to create a conversational chain.

Here, we set up everything related to the LLM, like the model name. We pass the prompt and inject all the variables we might use into it, like the post extracted from the DB in the case of the first prompt presented above.

To achieve this, we will use [**Langchain**](https://python.langchain.com/docs/introduction/) **\[3]**, a framework designed to build applications around large language models (LLMs). It provides tools to manage prompts, connect LLMs with external data sources, handle **chains of operations**, and integrate models into applications like chatbots or question\-answering systems, making it easier to develop AI\-powered applications.


```python
from langchain.chains.llm import LLMChain
from langchain_core.prompts import PromptTemplate


def get_chain(llm, template: str, input_variables=None, verbose=True, output_key=""):
    return LLMChain(
        llm=llm,
        prompt=PromptTemplate(
            input_variables=input_variables, template=template, verbose=verbose
        ),
        output_key=output_key,
        verbose=verbose,
    )
```
For the LLM in this application, I chose to go with an [OpenAI](https://openai.com/) model for its simplicity of use, so to use this method, you will need an `OPENAI_API_KEY` .

If you don’t want to use OpenAI, you can try using Grok API, which has the same API interface.


## 5\. Response Formatting

Using generative AI usually results in diverse responses that sometimes might contain inaccurate information or lack the same structure.

This is bad if we want to write our report in Excel or CSV since we might get all sorts of errors when writing the file if we don’t have a predefined structure.

However, the good thing is that we can solve this problem by using [P**ydantic**](https://docs.pydantic.dev/latest/) **\[4]** (again). It allows developers to define data models using Python classes, ensuring that data adheres to specified **types** and **constraints** while providing automatic type conversion and detailed error messages.

Here we implement 3 pydantic classes that will be passed to the second prompt, presented above, for formatting the LLM response to a predefined structure that can be later written as an EXCEL.


```python
from pydantic import BaseModel, Field


class InformationProfiles(BaseModel):
    name: str = Field(description='Name of the page from where the information was extracted')
    information: str = Field(description='Information extracted for the specified key.')
    link: str = Field(description='Link of the post from where the information was extracted.')
    city: str = Field(description='City of the restaurant.')


class FieldProfiles(BaseModel):
    name: str = Field(description='Name of the key. Available options are: Giveaways, Deals and Discounts, Events.')
    keys: list[InformationProfiles] = Field(description='List of restaurants and the information given about them.')


class ReportProfiles(BaseModel):
    name: str = Field(description='Name of the report: REPORT RESTAURANTS NEWS')
    fields: list[FieldProfiles] = Field(description='List of all relevant keys for this report.')
```

## 6\. Putting Everything Together

All we have to do is put everything together in our **report\_generator.py** module.

For this, we will create a class that will encapsulate all the logic:


```python
import datetime
import io
import json

import pandas as pd

from typing import List, Dict, Any
from langchain_core.output_parsers import PydanticOutputParser
from langchain_openai import ChatOpenAI

from src.config import settings
from src.crawler import InstagramCrawler
from src.db import database
from src.llm import get_chain
from schemas import ReportProfiles
from templates import PROFILES_REPORT_TEMPLATE, PROFILES_TEMPLATE_REFINE


class ReportGenerator:
    def __init__(self):
        self.crawler = InstagramCrawler()
        self.database = database
        self.llm = ChatOpenAI(model_name=settings.OPENAI_MODEl, api_key=settings.OPENAI_API_KEY)

    def crawl_and_store_posts(self):
        posts = self.crawler.get_posts(settings.PROFILES_TO_SCRAP)
        posts_collection = self.database['instagram_posts']
        for post in posts:
            posts_collection.update_one(
                {'link': post['link']},
                {'$set': post},
                upsert=True
            )
        return len(posts)

    def get_posts_from_db(self) -> List[Dict[str, Any]]:
        posts_collection = self.database['instagram_posts']
        end_date = datetime.datetime.now()
        start_date = end_date - datetime.timedelta(days=7)
        return list(posts_collection.find({
            'date': {'$gte': start_date, '$lte': end_date}
        }))

    @staticmethod
    def get_posts_text(posts: List[Dict[str, Any]]) -> List[str]:
        unique_posts = set()
        for post in posts:
            post_text = post.get("content", "")
            page_text = post.get("restaurant_name", "")
            link_text = post.get("link", "")
            city_text = post.get("city", "")

            if post_text:
                unique_posts.add(f"{post_text} | {page_text} | {link_text} | {city_text}\n")

        return list(unique_posts)

    def create_report(self, posts: List[str]) -> str:
        chain_1 = get_chain(
            self.llm,
            PROFILES_REPORT_TEMPLATE,
            input_variables=["input_var"],
            output_key="report",
        )

        result_1 = chain_1.invoke({"input_var": posts})
        report = result_1["report"]

        output_parser = PydanticOutputParser(pydantic_object=ReportProfiles)
        format_output = {"format_instructions": output_parser.get_format_instructions()}

        chain_2 = get_chain(
            self.llm,
            PROFILES_TEMPLATE_REFINE,
            input_variables=["raport", "format_instructions"],
            output_key="formatted_report",
        )

        result_2 = chain_2.invoke({"raport": report, "format_instructions": format_output})

        return result_2["formatted_report"]

    @staticmethod
    def create_excel_file(data: Dict[str, Any]):
        rows = []
        excel_filename = f"Profiles_report_{datetime.datetime.now().strftime('%Y-%m-%d')}.xlsx"

        report_name = data.get("name", "Unknown Report")
        for field in data.get("fields", []):
            field_name = field.get("name", "Unknown Field")
            for key in field.get("keys", []):
                rows.append({
                    "Type of Report": report_name,
                    "Type of Information": field_name,
                    "Source": key.get("name", "no name"),
                    "Information": key.get("information", "no information"),
                    "Link": key.get("link", "no link"),
                    "City": key.get("city", "no city"),
                })

        df = pd.DataFrame(rows)
        buffer = io.BytesIO()
        df.to_excel(buffer, index=False)
        buffer.seek(0)

        return buffer, excel_filename

    def generate_report(self):
        # Step 1: Crawl and store Instagram posts
        posts_count = self.crawl_and_store_posts()
        print(f"Crawled and stored {posts_count} posts.")

        # Step 2: Retrieve posts from the database
        db_posts = self.get_posts_from_db()
        print(f"Retrieved {len(db_posts)} posts from the database.")

        # Step 3: Process posts and create report
        posts_text = self.get_posts_text(db_posts)
        report_data_str = self.create_report(posts_text)
        print(f"Generated report from posts: {report_data_str}")

        # Parse the JSON string
        try:
            report_data = json.loads(report_data_str)
        except json.JSONDecodeError:
            print("Error: Unable to parse the report data as JSON.")
            return None

        # Step 4: Create Excel file
        excel_buffer, excel_filename = self.create_excel_file(report_data)

        # Step 5: Save Excel file
        with open(excel_filename, 'wb') as f:
            f.write(excel_buffer.getvalue())

        print(f"Excel file '{excel_filename}' has been created successfully.")
        return excel_filename
```
The `generate_report()` method is the “**entry point**” into this application and inside we have all the steps needed to generate a weekly report.

Since this class is big, I will detail each step presented in the **generate\_report()** method:

**1**. `self.crawl_and_store_posts()`:

This method retrieves last week’s posts from the selected Instagram profiles and stores them in our database.

**2\.** `self.get_posts_from_db()` :

Here, we extract all the posts that we stored inside the DB but also apply a filtering logic based on date since we might have posts stored from previous weeks and don’t want to retrieve them.

**3\.** `self.get_posts_text()` and `self.create_report()` :

The first method is used to extract all the information that we will pass to the prompt as an input variable from the returned db models.

Then we have the second method, where the LLM receives the prompts and creates the report.

**4\.** `self.create_excel_file()` :

Before this step we first need to call `json.loads(report_data_str)` so we can use JSON format to write the EXCEL. If we do a print here the report might look something like this:


```python
{
  "name": "REPORT RESTAURANTS NEWS",
  "fields": [
    {
      "name": "Giveaways",
      "keys": []
    },
    {
      "name": "Deals and Discounts",
      "keys": []
    },
    {
      "name": "Events",
      "keys": [
        {
          "name": "Taco Bell",
          "information": "Early access event for the disha hot discovery box on 9/24 & 9/25.",
          "link": "https://www.instagram.com/tacobell",
          "city": "Downey"
        }
      ]
    }
  ]
}
```
This hole application can efficiently be run using the following commands in the terminat: `make setup` and `make run` after, or you can use `make help` to see a list of all available commands.


## Conclusion

I hope that you have learned how to use LLMs to extract information from social media platforms by reading this article (or skipping through lines of code as some people do 🤫).

I also think that the best way to learn is to put things into practice, and I encourage you to take what I have implemented here and customize it to suit your own needs.

This application can be changed to suit any use case and integrated with other crawlers if you want data from different social media sites.


> *You can find the full code on GitHub [**here**](https://github.com/decodingml/articles-code/tree/main/articles/generative_ai/data_extraction_from_social_media_posts_using_llms) **\[1]**.*

Ultimately, I want to give a big shout\-out to the guys from Decoding ML who have me as a guest writer for the first time. I am super grateful for this opportunity and what I learned from them.

I encourage you to check the ***weekly*** 𝗗𝗲𝗰𝗼𝗱𝗶𝗻𝗴 𝗠𝗟 𝗡𝗲𝘄𝘀𝗹𝗲𝘁𝘁𝗲𝗿 on Substack for more *TOP\-NOTCH* articles covering production AI and MLOps.


## References

\[1] [Data extraction from Social Media posts using LLM’s — Github Repository](https://github.com/decodingml/articles-code/tree/data_extraction_from_social_media_posts) (2024\), Decoding ML GitHub Organization

\[2] [Instaloader Documentation](https://instaloader.github.io/) (2024\), Instaloader

\[3] [Langchain Documentation](https://python.langchain.com/docs/introduction/) (2024\), Langchain

\[4] [Pydantic Documentation](https://docs.pydantic.dev/latest/) (2024\), Pydantic


