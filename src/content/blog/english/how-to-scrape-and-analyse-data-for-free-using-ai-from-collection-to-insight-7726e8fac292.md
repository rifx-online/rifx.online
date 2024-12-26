---
title: "How to Scrape and Analyse Data for Free using AI: From Collection to Insight"
meta_title: "How to Scrape and Analyse Data for Free using AI: From Collection to Insight"
description: "This article provides a comprehensive guide on how to scrape and analyze data using AI, specifically by integrating web scraping techniques with AI-powered language models. It outlines the necessary prerequisites, installation steps, and code examples for setting up a virtual environment and using tools like Selenium and BeautifulSoup for data extraction. Additionally, it discusses how to bypass security measures such as CAPTCHAs using proxy services, clean the scraped HTML content, and leverage a language model (Ollama) for extracting meaningful insights. The tutorial emphasizes the importance of automating data collection and analysis to improve efficiency and effectiveness in obtaining actionable insights."
date: 2024-12-26T04:30:18Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*YqgrxY3g2Ap5GI6laAN-dg.png"
categories: ["Programming/Scripting", "Data Science", "Natural Language Processing"]
author: "Rifx.Online"
tags: ["scraping", "Selenium", "BeautifulSoup", "Ollama", "CAPTCHAs"]
draft: False

---





### Learn how to combine web scraping, proxies, and AI\-powered language models to automate data extraction and gain actionable insights effortlessly.



While some websites are straightforward to scrape by using just Selenium, Puppeteer, and the like, other websites that implement advanced security measures such as CAPTCHAs and IP bans may prove difficult. To overcome these challenges and ensure you can scrape 99% of websites for free using the Scraper, you will be building this in this article, you will be integrating a [proxy tool](https://get.brightdata.com/bd-scraping-browser) in your code that will help in bypassing these security measures.

However, collecting the data is just one step; what you do with that data is equally, if not more, important. Often, this requires painstakingly sifting through large volumes of information manually. But what if you could automate this process? By leveraging a language model (LLM), you can not only collect data but also query it to extract meaningful insights — saving time and effort.

In this guide, you’ll learn how to combine web scraping with AI to build a powerful tool for collecting and analysing data at scale for free. Let’s dive in!


## Prerequisites

Before you begin, ensure you have the following:

1. Basic Python knowledge, as this project involves writing and understanding Python code.
2. Install Python (3\.7 or later) on your system. You can download it from [python.org](https://www.python.org/).


## Installation and Setup

To continue with this tutorial, complete the following steps:

Follow these steps to set up your environment and prepare for building the AI\-powered scraper.


### 1\. Create a Virtual Environment

First, set up a virtual environment to manage your project’s dependencies. This will ensure you have an isolated space for all the required packages.

1. **Create a New Project Directory**:
Open your terminal (or Command Prompt/PowerShell on Windows) and create a new directory for your project:


```python
mkdir ai-website-scraper
cd ai-website-scraper
```
**2\. Create the Virtual Environment**:

Run the following command to create the virtual environment:

* On **Windows**:


```python
python -m venv venv
```
* On **macOS/Linux**:


```python
python3 -m venv venv
```
This creates a `venv` folder that will store the virtual environment.


### 2\. Activate the Virtual Environment

Activate the virtual environment to begin working within it:

* On **Windows**:


```python
.\venv\Scripts\activate
```
* On **macOS/Linux**:


```python
source venv/bin/activate
```
Your terminal prompt will change to show (`venv`), confirming you’re now inside the virtual environment.


### 3\. Install Required Dependencies

Now, install the libraries your project needs. Create a `requirements.txt` file in your project directory and add the following dependencies:


```python
streamlit
selenium
Beautifulsoup4
langchain
langchain-ollama
lxml
html5lib
```
These packages are essential for scraping, data processing, and building the UI:

* **streamlit**: This is used to create the interactive user interface.
* **Selenium**: For scraping website content.
* **beautifulsoup4**: For parsing and cleaning the HTML.
* **langchain** and **langchain\-ollama**: This is for integrating with the Ollama LLM and processing text.
* **lxml** and **html5lib**: For advanced HTML parsing.

Install the dependencies by running the following command:


> (Ensure that you are in the folder where the file is located before running the command)


```python
pip install -r requirements.txt
```

## Building the UI with Streamlit

[Streamlit](https://streamlit.io/) makes it easy to create an interactive user interface (UI) for Python applications. In this section, you will build a simple, user\-friendly interface where users can input a URL and display the scraped data.


### 1\. Set Up the Streamlit Script

Create a file named `ui.py` in your project directory. This script will define the UI for your scraper. Use the code below to structure your application:


```python
import streamlit as st
import pathlib
from main import scrape_website

## function to load css from the assets folder
def load_css(file_path):
with open(file_path) as f:
st.html(f"<style>{f.read()}</style>")
## Load the external CSS
css_path = pathlib.Path("assets/style.css")
if css_path.exists():
load_css(css_path)
st.title("AI Scraper")
st.markdown(
"Enter a website URL to scrape, clean the text content, and display the result in smaller chunks."
)
url = st.text_input(label= "", placeholder="Enter the URL of the website you want to scrape")
if st.button("Scrape", key="scrape_button"):
st.write("scraping the website…")
result = scrape_website(url)
st.write("Scraping complete.")
st.write(result)
```
* The `st.title` and `st.markdown` functions set up the application title and provide instructions for users.
* The `st.text_input` component lets users input the URL of the website they want to scrape.
* Clicking the “Scrape” button triggers the scraping logic, displaying progress messages using `st.info`.

You can learn more about streamlit components from their [documentation](https://docs.streamlit.io/).


### 2\. Add Custom Styles

To style your application, create an `assets` folder in your project directory and add a `style.css` file. Customize the Streamlit interface with CSS:


```python
.stAppViewContainer {
background-image: url("https://images.unsplash.com/photo-1732979887702-40baea1c1ff6?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
background-size: cover;
color: black;
}
.stAppHeader {
background-color: rgba(0, 0, 0, 0);
}
.st-ae {
background-color: rgba(233, 235, 234, 0.895);
}
.st-emotion-cache-ysk9xe {
color: black;
}
.st.info, .stAlert {
background-color: black;
}
.st-key-scrape_button button {
display: inline-block;
padding: 10px 20px;
font-size: 16px;
color: #fff;
background-color: #007bff;
border: none;
border-radius: 5px;
cursor: pointer;
animation: pulse 2s infinite;
}
.st-key-scrape_button button:hover {
background-color: #0056b3;
color: #fff;
}
```

### 3\. Run the Streamlit app

In your project directory, run the following command:


```python
streamlit run ui.py
```
This will launch a local server, and you should see a URL in the terminal, usually [`http://localhost:8`501\.](http://localhost:8501.) Open this URL in your browser to interact with the web application.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*oTXbUoFCautllQsc)


## Scraping website with Selenium

Next, write the code to extract the HTML content of any webpage using Selenium. However, for the code to work, you need a Chrome WebDriver.


### Install ChromeDriver for Selenium

Selenium requires a WebDriver to interact with web pages. Here’s how to set it up:

1. **Download ChromeDriver**:
Visit the ChromeDriver website and **download the version matching your Google Chrome browser**.
2. **Add ChromeDriver to PATH**

After downloading ChromeDriver, extract the file and copy the application file name “chromedriver” and paste it in your project folder.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*NJKIhw_lg9u8VPve)

When this is done, create a new file called `main.py` and implement the code below:


```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
## Function to scrape HTML from a website
def scrape_website(website_url):
## Path to WebDriver
webdriver_path = "./chromedriver" # Replace with your WebDriver path
service = Service(webdriver_path)
driver = webdriver.Chrome(service=service)
try:
## Open the website
driver.get(website_url)
## Wait for the page to fully load
WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "body")))
## Extract the HTML source
html_content = driver.page_source
return html_content
finally:
## Ensure the browser is closed after scraping
driver.quit()
```
Save and run the code; you should get all the HTML of the page you scraped displayed in your streamlit application like this:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*NVZMsfX9NlGxMoF5)


## Using a Proxy Provider to Bypass website with Captcha and IP Bans

While you can now retrieve the HTML of a website, the above code may not work for sites with advanced anti\-scraping mechanisms such as CAPTCHA challenges or IP bans. For example, scraping a site like Indeed or Amazon using Selenium may result in a CAPTCHA page blocking access. This happens because the website detects that a bot is trying to access its content. If this behaviour persists, the site may eventually ban your IP address, preventing further access.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*CsjwnkYbMnQwAKTi)

To fix this, integrate [Bright Data’s Scraping Browser](https://get.brightdata.com/bd-scraping-browser) into your script. The scraping browser is a robust tool that leverages multiple proxy networks, including residential IPs, to bypass anti\-scraping defences. It handles unblocking pages by managing custom headers, browser fingerprinting, CAPTCHA solving, and more. This ensures that your scraping efforts remain undetected while accessing content seamlessly.


### Setting up Bright Data’s Scraping Browser for free

1. **Signing up** — go to [Bright Data’s homepage](https://get.brightdata.com/bd7914) and click on “**Start Free Trial**”. If you already have an account with Bright Data, you can just log in.
2. After logging in, click on “**Get Proxy Products**”.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*LVR_w8iezhHOV71J)

3\. Click on the “Add” button and select “Scraping Browser.”

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*84-KhZ5fTuTik0QS)

4\. Next, you will be taken to the “Add zone” page, where you will be required to choose a name for your new scraping browser proxy zone. After that, click on “**Add**”.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*3bSWaC8Hpl72TP3b)

5\. After this, your proxy zone credentials will be created. You will need this detials in your script, to bypass any anti\-scraping mechanisms used on any website.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*g7ivwA92SItc-Jrz)

You can also check out Bright Data’s developer [documentation](https://get.brightdata.com/getting-started-with-scraping-browser) for more details about the scraping browser.

In your `main.py` file, modify the code to include the scraping browser. You will notice that this code is much cleaner and shorter than the previous code.


```python
from selenium.webdriver import Remote, ChromeOptions
from selenium.webdriver.chromium.remote_connection import ChromiumRemoteConnection
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
AUTH = '<username>:<passord>'
SBR_WEBDRIVER = f'@brd.superproxy.io:9515'">https://{AUTH}@brd.superproxy.io:9515'
## Function to scrape HTML from a website
def scrape_website(website_url):
print("Connecting to Scraping Browser…")
sbr_connection = ChromiumRemoteConnection(SBR_WEBDRIVER, "goog", "chrome")
with Remote(sbr_connection, options=ChromeOptions()) as driver:
driver.get(website_url)
print("Waiting captcha to solve…")
solve_res = driver.execute(
"executeCdpCommand",
{
"cmd": "Captcha.waitForSolve",
"params": {"detectTimeout": 10000},
},
)
print("Captcha solve status:", solve_res["value"]["status"])
print("Navigated! Scraping page content…")
html = driver.page_source
return html
```
Replace `<username>` and `<password>` with your scraping browser username and password.


## Cleaning the Dom content

After scraping the HTML content of a website, it’s often filled with unnecessary elements such as JavaScript, CSS styles, or unwanted tags that do not contribute to the core information you’re extracting. To make the data more structured and useful for further processing, you need to clean the DOM content by removing irrelevant elements and organising the text.

This section explains how to clean the HTML content, extract meaningful text, and split it into smaller chunks for downstream processing. The cleaning process is essential for preparing data for tasks like natural language processing or content analysis.


### Code Walkthrough for Cleaning DOM Content

Here’s the code that will be added to `main.py` to handle cleaning the DOM content:


```python
from bs4 import BeautifulSoup

## Extract the body content from the HTML
def extract_body_content(html_content):
soup = BeautifulSoup(html_content, "html.parser")
body_content = soup.body
if body_content:
return str(body_content)
return ""
## Clean the body content by removing scripts, styles, and other unwanted elements
def clean_body_content(body_content):
soup = BeautifulSoup(body_content, "html.parser")
## Remove <script> and <style> tags
for script_or_style in soup(["script", "style"]):
script_or_style.extract()
## Extract cleaned text with each line separated by a newline
cleaned_content = soup.get_text(separator="\n")
cleaned_content = "\n".join(
line.strip() for line in cleaned_content.splitlines() if line.strip()
)
return cleaned_content
## Split the cleaned content into smaller chunks for processing
def split_dom_content(dom_content, max_length=5000):
return [
dom_content[i : i + max_length] for i in range(0, len(dom_content), max_length)
]
```
**What the Code Does**

1. **Extracting the Body Content**:
* The `extract_body_content` function uses BeautifulSoup to parse the HTML and extract the `<body>` tag’s content.
* If a `<body`\> tag exists, the function returns it as a string. Otherwise, it returns an empty string.

**2\. Cleaning the Content**:

* The `clean_body_content` function processes the extracted content to remove unnecessary elements:
* a. `<script>` and `<style>` tags are removed to eliminate JavaScript and CSS.

b. The function retrieves the plain text from the cleaned content.

c. It formats the text by stripping empty lines and extraneous spaces.

**3\. Splitting the Content**:

* The `split_dom_content` function takes the cleaned content and splits it into smaller chunks with a default maximum length of 5,000 characters.
* This is useful for processing large amounts of text in manageable pieces, especially when passing data to models with token or input size limits.

Save your changes and test your application. You should get an output like this after scraping a website.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*jn0LQBtPYRE_tSkc)


## Parsing the Dom content to Ollama

Once the DOM content is cleaned and prepared, the next step is parsing the information to extract specific details using **Ollama**, a large language model integrated with LangChain. This step allows you to automate the extraction of meaningful insights from the data by leveraging natural language instructions.

Here’s how to set up the functionality to parse DOM content using Ollama and integrate it with the UI.


### Code walkthrough for llm.py

The following code implements the logic to parse DOM chunks with Ollama and extract relevant details:


```python
from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
## Template to instruct Ollama for parsing
template = (
"You are tasked with extracting specific information from the following text content: {dom_content}. "
"Please follow these instructions carefully: \n\n"
"1. **Extract Information:** Only extract the information that directly matches the provided description: {parse_description}. "
"2. **No Extra Content:** Do not include any additional text, comments, or explanations in your response. "
"3. **Empty Response:** If no information matches the description, return an empty string ('')."
"4. **Direct Data Only:** Your output should contain only the data that is explicitly requested, with no other text."
)
## Initialize the Ollama model
model = OllamaLLM(model="phi3")
## Function to parse DOM chunks with Ollama
def parse_with_ollama(dom_chunks, parse_description):
prompt = ChatPromptTemplate.from_template(template)
chain = prompt | model
parsed_results = []
for i, chunk in enumerate(dom_chunks, start=1):
if not chunk.strip(): # Skip empty chunks
print(f"Skipping empty chunk at batch {i}")
continue
try:
print(f"Processing chunk {i}: {chunk[:100]}…") # Print a preview
print(f"Parse description: {parse_description}")
response = chain.invoke(
{
"dom_content": chunk,
"parse_description": parse_description,
}
)
print(f"Response for batch {i}: {response}")
parsed_results.append(response)
except Exception as e:
print(f"Error parsing chunk {i}: {repr(e)}")
parsed_results.append(f"Error: {repr(e)}")
return "\n".join(parsed_results)
```
**What the code does.**

1. **Instruction Template**:
* Provides precise guidance for Ollama on what information to extract.
* Ensures the output is clean, concise, and relevant to the parsing description.

**2\. Chunk Processing**:

* The `parse_with_ollama` function iterates through the DOM chunks, processing each with the LLM.
* Skips empty chunks to optimize performance.

**3\. Error Handling**:

* Handles errors gracefully, logs them, and continues processing remaining chunks.


### Updating the file ui.py file

Add the following code to the `ui.py` file to allow users to input parsing instructions to the LLM and view results:


```python
from main import scrape_website, extract_body_content, clean_body_content, split_dom_content
from llm import parse_with_ollama

## rest of the code....

if "dom_content" in st.session_state:
parse_description = st.text_area("Enter a description to extract specific insights from your scraped data:")
if st.button("Parse Content", key="parse_button"):
if parse_description.strip() and st.session_state.get("dom_content"):
st.info("Parsing the content…")
dom_chunks = split_dom_content(st.session_state.dom_content)
parsed_result = parse_with_ollama(dom_chunks, parse_description)
st.text_area("Parsed Results", parsed_result, height=300)
else:
st.error("Please provide valid DOM content and a description to parse.")
```

### How It Works in the UI

1. **User Input**:
* The user provides a natural language description of the data to extract in a text area.

**2\. Parsing Trigger**:

* When the **Parse Content** button is clicked, the cleaned DOM content is split into manageable chunks and passed to parse\_with\_ollama.

**3\. Results Display**:

* The parsed results are displayed in a text area, allowing users to review the extracted information.

With this done, the scraper can now provide responses to your prompts based on the data scraped.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*2xKpHk5UFErLDSFw)


## What’s next?

The combination of web scraping and AI opens up exciting possibilities for data\-driven insights. Beyond collecting and saving data, you can now leverage AI to optimise the process of gaining insight from the data scraped. This is useful for marketing and sales team, data analysis, business owners and a lot more.

You can find the complete code for the AI scraper here. Feel free to experiment with it and adapt it to your unique needs. Contributions are also welcome — if you have ideas for improvements, consider creating a pull request!

You can also take this further. Here are some ideas:

* **Experiment with Prompts**: Tailor your prompts to extract specific insights or address unique project requirements.
* User Interface
* **Integrate other LLM Models**: Explore other language models like [OpenAI](https://openai.com/), [Gemini](https://ai.google.dev/), etc to further optimize your data analysis.

