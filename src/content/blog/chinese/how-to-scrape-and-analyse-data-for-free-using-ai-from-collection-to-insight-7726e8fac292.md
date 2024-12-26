---
title: "如何使用人工智能免费抓取和分析数据：从收集到洞察"
meta_title: "如何使用人工智能免费抓取和分析数据：从收集到洞察"
description: "本文介绍了如何结合网络爬虫、代理和人工智能语言模型，免费进行数据抓取和分析。重点在于使用Selenium进行网站抓取，并通过集成Bright Data的抓取浏览器解决高级反爬虫机制问题。文章还强调了数据清理和使用Ollama LLM提取有意义洞察的重要性。读者将学习如何设置Python环境、构建用户界面、处理HTML内容以及解析数据，最终实现高效的数据提取与分析。"
date: 2024-12-26T01:33:23Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*YqgrxY3g2Ap5GI6laAN-dg.png"
categories: ["Programming/Scripting", "Data Science", "Natural Language Processing"]
author: "Rifx.Online"
tags: ["scraping", "Selenium", "BeautifulSoup", "Ollama", "CAPTCHAs"]
draft: False

---



### 学习如何结合网络爬虫、代理和人工智能语言模型来自动化数据提取，轻松获得可操作的洞察。



虽然有些网站可以通过使用Selenium、Puppeteer等工具轻松抓取，但其他实施了先进安全措施的网站，如验证码和IP封禁，可能会变得困难。为了克服这些挑战，并确保您可以免费抓取99%的网站，您将在本文中构建一个集成[代理工具](https://get.brightdata.com/bd-scraping-browser)的代码，以帮助绕过这些安全措施。

然而，收集数据只是一个步骤；您对这些数据的处理同样重要，甚至更为重要。通常，这需要手动仔细筛选大量信息。但如果您可以自动化这个过程呢？通过利用语言模型（LLM），您不仅可以收集数据，还可以查询数据以提取有意义的洞察——节省时间和精力。

在本指南中，您将学习如何将网络爬虫与人工智能结合起来，构建一个强大的工具，以免费大规模收集和分析数据。让我们深入了解吧！

## 前提条件

在开始之前，请确保您具备以下条件：

1. 基础的 Python 知识，因为该项目涉及编写和理解 Python 代码。
2. 在您的系统上安装 Python（3\.7 或更高版本）。您可以从 [python.org](https://www.python.org/) 下载。

## 安装与设置

要继续本教程，请完成以下步骤：

按照这些步骤设置您的环境，并为构建 AI 驱动的爬虫做好准备。

### 1\. 创建虚拟环境

首先，设置一个虚拟环境来管理项目的依赖关系。这将确保您拥有一个隔离的空间来存放所有所需的包。

1. **创建一个新的项目目录**：
打开终端（或在Windows上使用命令提示符/PowerShell），并为您的项目创建一个新目录：

```python
mkdir ai-website-scraper
cd ai-website-scraper
```
**2\. 创建虚拟环境**：

运行以下命令以创建虚拟环境：

* 在 **Windows** 上：

```python
python -m venv venv
```
* 在 **macOS/Linux** 上：

```python
python3 -m venv venv
```
这将创建一个 `venv` 文件夹，用于存储虚拟环境。

### 2\. 激活虚拟环境

激活虚拟环境以开始在其中工作：

* 在 **Windows** 上：


```python
.\venv\Scripts\activate
```
* 在 **macOS/Linux** 上：


```python
source venv/bin/activate
```
您的终端提示符将更改为显示 (`venv`)，确认您现在在虚拟环境中。

### 3\. 安装所需依赖

现在，安装您的项目所需的库。在您的项目目录中创建一个 `requirements.txt` 文件，并添加以下依赖项：

```python
streamlit
selenium
Beautifulsoup4
langchain
langchain-ollama
lxml
html5lib
```
这些包对于爬虫、数据处理和构建用户界面至关重要：

* **streamlit**：用于创建交互式用户界面。
* **Selenium**：用于抓取网站内容。
* **beautifulsoup4**：用于解析和清理HTML。
* **langchain** 和 **langchain\-ollama**：用于与Ollama LLM集成和处理文本。
* **lxml** 和 **html5lib**：用于高级HTML解析。

通过运行以下命令安装依赖项：

> （在运行命令之前，请确保您位于文件所在的文件夹中）

```python
pip install -r requirements.txt
```

## 使用 Streamlit 构建用户界面

[Streamlit](https://streamlit.io/) 使得为 Python 应用程序创建交互式用户界面 (UI) 变得简单。在本节中，您将构建一个简单、用户友好的界面，用户可以在其中输入 URL 并显示抓取的数据。

### 1\. 设置 Streamlit 脚本

在你的项目目录中创建一个名为 `ui.py` 的文件。该脚本将定义你的爬虫的用户界面。使用下面的代码来构建你的应用程序：

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
"输入一个网站 URL 以抓取、清理文本内容，并将结果以较小的块显示。"
)
url = st.text_input(label= "", placeholder="输入你想抓取的网站的 URL")
if st.button("Scrape", key="scrape_button"):
st.write("正在抓取网站…")
result = scrape_website(url)
st.write("抓取完成。")
st.write(result)
```
* `st.title` 和 `st.markdown` 函数设置应用程序标题并为用户提供说明。
* `st.text_input` 组件允许用户输入他们想要抓取的网站的 URL。
* 点击“Scrape”按钮会触发抓取逻辑，使用 `st.info` 显示进度消息。

你可以从他们的 [文档](https://docs.streamlit.io/) 中了解更多关于 streamlit 组件的信息。

### 2\. 添加自定义样式

要为您的应用程序添加样式，请在项目目录中创建一个 `assets` 文件夹，并添加一个 `style.css` 文件。使用 CSS 自定义 Streamlit 界面：

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

### 3\. 运行 Streamlit 应用

在您的项目目录中，运行以下命令：

```python
streamlit run ui.py
```
这将启动一个本地服务器，您应该在终端中看到一个 URL，通常是 [`http://localhost:8501`](http://localhost:8501)。在浏览器中打开此 URL 以与 Web 应用程序进行交互。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*oTXbUoFCautllQsc)

## 使用Selenium抓取网站

接下来，编写代码以使用Selenium提取任何网页的HTML内容。但是，为了使代码正常工作，您需要一个Chrome WebDriver。 

```
from selenium import webdriver

## 设置Chrome WebDriver的路径
driver = webdriver.Chrome(executable_path='path/to/chromedriver')

## 打开网页
driver.get('http://example.com')

## 获取网页的HTML内容
html_content = driver.page_source

## 关闭浏览器
driver.quit()
```

### 为 Selenium 安装 ChromeDriver

Selenium 需要一个 WebDriver 来与网页交互。以下是设置方法：

1. **下载 ChromeDriver**：
访问 ChromeDriver 网站并 **下载与您的 Google Chrome 浏览器匹配的版本**。
2. **将 ChromeDriver 添加到 PATH**

下载 ChromeDriver 后，解压文件并复制应用程序文件名“chromedriver”，然后粘贴到您的项目文件夹中。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*NJKIhw_lg9u8VPve)

完成后，创建一个名为 `main.py` 的新文件，并实现以下代码：


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
保存并运行代码；您应该在您的 streamlit 应用程序中看到您抓取的页面的所有 HTML，如下所示：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*NVZMsfX9NlGxMoF5)

## 使用代理提供商绕过带有验证码和IP禁令的网站

虽然您现在可以检索网站的HTML，但上述代码可能不适用于具有高级反爬虫机制的网站，例如验证码挑战或IP禁令。例如，使用Selenium抓取像Indeed或Amazon这样的网站可能会导致验证码页面阻止访问。这是因为网站检测到有机器人试图访问其内容。如果这种行为持续，网站最终可能会禁止您的IP地址，从而阻止进一步访问。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*CsjwnkYbMnQwAKTi)

为了解决这个问题，将[Bright Data的抓取浏览器](https://get.brightdata.com/bd-scraping-browser)集成到您的脚本中。抓取浏览器是一种强大的工具，利用多个代理网络，包括住宅IP，来绕过反爬虫防御。它通过管理自定义头信息、浏览器指纹识别、验证码解决等来处理解锁页面。这确保您的抓取工作在访问内容时保持隐蔽。

### 免费设置 Bright Data 的抓取浏览器

1. **注册** — 访问 [Bright Data 的主页](https://get.brightdata.com/bd7914) 并点击 “**开始免费试用**”。如果您已经拥有 Bright Data 账户，可以直接登录。
2. 登录后，点击 “**获取代理产品**”。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*LVR_w8iezhHOV71J)

3\. 点击 “添加” 按钮并选择 “抓取浏览器”。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*84-KhZ5fTuTik0QS)

4\. 接下来，您将进入 “添加区域” 页面，您需要为新的抓取浏览器代理区域选择一个名称。之后，点击 “**添加**”。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*3bSWaC8Hpl72TP3b)

5\. 完成后，您的代理区域凭据将被创建。您需要在脚本中使用这些详细信息，以绕过任何网站上使用的反抓取机制。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*g7ivwA92SItc-Jrz)

您还可以查看 Bright Data 的开发者 [文档](https://get.brightdata.com/getting-started-with-scraping-browser)，以获取有关抓取浏览器的更多详细信息。

在您的 `main.py` 文件中，修改代码以包括抓取浏览器。您会注意到这段代码比之前的代码干净且简短得多。

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
将 `<username>` 和 `<password>` 替换为您的抓取浏览器用户名和密码。

## 清理 DOM 内容

在抓取网站的 HTML 内容后，通常会充满不必要的元素，例如 JavaScript、CSS 样式或不相关的标签，这些都不会对您提取的核心信息产生贡献。为了使数据更加结构化并便于后续处理，您需要通过去除无关元素和组织文本来清理 DOM 内容。

本节解释了如何清理 HTML 内容，提取有意义的文本，并将其拆分成较小的块以便于后续处理。清理过程对于准备数据以进行自然语言处理或内容分析等任务至关重要。

### 清理 DOM 内容的代码讲解

以下是将添加到 `main.py` 中以处理清理 DOM 内容的代码：

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
**代码功能**

1. **提取主体内容**：
* `extract_body_content` 函数使用 BeautifulSoup 解析 HTML 并提取 `<body>` 标签的内容。
* 如果存在 `<body>` 标签，函数将其作为字符串返回。否则，返回一个空字符串。

**2\. 清理内容**：

* `clean_body_content` 函数处理提取的内容以移除不必要的元素：
* a. 移除 `<script>` 和 `<style>` 标签以消除 JavaScript 和 CSS。

b. 函数从清理后的内容中获取纯文本。

c. 通过去除空行和多余空格来格式化文本。

**3\. 拆分内容**：

* `split_dom_content` 函数将清理后的内容拆分为较小的块，默认最大长度为 5,000 个字符。
* 这对于处理大量文本并将其分成可管理的部分非常有用，特别是在将数据传递给具有令牌或输入大小限制的模型时。

保存更改并测试您的应用程序。在抓取网站后，您应该得到如下输出。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*jn0LQBtPYRE_tSkc)

## 解析 DOM 内容到 Ollama

一旦 DOM 内容被清理和准备好，下一步是解析信息以提取特定细节，使用 **Ollama**，这是一种与 LangChain 集成的大型语言模型。此步骤允许您通过利用自然语言指令来自动提取数据中的有意义见解。

以下是如何设置功能以使用 Ollama 解析 DOM 内容并将其与 UI 集成。

### llm.py 的代码讲解

以下代码实现了使用 Ollama 解析 DOM 块并提取相关细节的逻辑：

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
**代码功能说明。**

1. **指令模板**：
* 为 Ollama 提供了提取信息的精确指导。
* 确保输出干净、简洁，并与解析描述相关。

**2\. 块处理**：

* `parse_with_ollama` 函数遍历 DOM 块，使用 LLM 处理每个块。
* 跳过空块以优化性能。

**3\. 错误处理**：

* 优雅地处理错误，记录错误，并继续处理剩余的块。

### 更新文件 ui.py

将以下代码添加到 `ui.py` 文件，以允许用户输入解析指令给 LLM 并查看结果：

```python
from main import scrape_website, extract_body_content, clean_body_content, split_dom_content
from llm import parse_with_ollama

## rest of the code....

if "dom_content" in st.session_state:
parse_description = st.text_area("输入描述以从抓取的数据中提取特定见解：")
if st.button("解析内容", key="parse_button"):
if parse_description.strip() and st.session_state.get("dom_content"):
st.info("正在解析内容…")
dom_chunks = split_dom_content(st.session_state.dom_content)
parsed_result = parse_with_ollama(dom_chunks, parse_description)
st.text_area("解析结果", parsed_result, height=300)
else:
st.error("请提供有效的 DOM 内容和解析描述。")
```

### 用户界面中的工作原理

1. **用户输入**：
* 用户在文本区域提供要提取的数据的自然语言描述。

**2\. 解析触发**：

* 当点击 **解析内容** 按钮时，清理后的 DOM 内容被拆分为可管理的块，并传递给 parse\_with\_ollama。

**3\. 结果显示**：

* 解析结果显示在文本区域，允许用户查看提取的信息。

完成后，抓取器现在可以根据抓取的数据对您的提示提供响应。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*2xKpHk5UFErLDSFw)

## 接下来是什么？

网络爬虫与人工智能的结合为数据驱动的洞察开辟了令人兴奋的可能性。除了收集和保存数据，您现在可以利用人工智能来优化从抓取的数据中获得洞察的过程。这对市场营销和销售团队、数据分析、企业主以及更多领域都非常有用。

您可以在这里找到AI爬虫的完整代码。欢迎您进行实验并根据您的独特需求进行调整。也欢迎贡献——如果您有改进的想法，请考虑创建一个拉取请求！

您还可以进一步拓展。以下是一些想法：

* **实验提示**：调整您的提示以提取特定的洞察或满足独特的项目需求。
* 用户界面
* **整合其他LLM模型**：探索其他语言模型，如[OpenAI](https://openai.com/)、[Gemini](https://ai.google.dev/)等，以进一步优化您的数据分析。

