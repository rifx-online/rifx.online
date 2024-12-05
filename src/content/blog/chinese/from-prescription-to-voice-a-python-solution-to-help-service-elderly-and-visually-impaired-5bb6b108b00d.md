---
title: "从处方到语音：帮助服务老年人和视障人士的 Python 解决方案..."
meta_title: "从处方到语音：帮助服务老年人和视障人士的 Python 解决方案..."
description: "本文介绍了一种结合OCR、计算机视觉和Google文本转语音的Python解决方案，旨在帮助老年人和视力障碍患者读取处方标签。文章详细讲解了如何使用Fast API构建后端服务，包括获取Google Cloud API凭据、设置文件结构、安装必要库、定义辅助函数、提取文本、处理图像以及使用Postman进行测试。最终，该解决方案将处方标签转换为语音，提供了对医疗信息的无障碍访问，支持老年人和视力障碍患者。"
date: 2024-12-05T12:36:46Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*8u9Vfaf6-o04440G"
categories: ["Programming", "Health", "Technology/Web"]
author: "Rifx.Online"
tags: ["FastAPI", "OCR", "TextToSpeech", "imageprocessing", "accessibility"]
draft: False

---



### 学习如何构建一个结合OCR、计算机视觉和谷歌文本转语音的Fast API后端解决方案，以读取处方标签



在正常情况下，阅读处方药物上的标签不应该是一个具有挑战性的任务。通常，最重要的指示——剂量，通常会以粗体字打印，如：

> ***“*每天需要时服用1.5片，分3次服用*”***

另一方面，考虑到视觉障碍和/或老年患者的异常情况。他无法在没有帮助的情况下阅读他的处方标签。

作为药房的数据科学家或Python开发者，您可以通过编写一个适应患者处方标签的程序来帮助解决这个问题。该程序将读取标签并将其转换为语音。

在本文中，我将向您展示如何通过首先使用计算机视觉清理图像，然后应用Tesseract-OCR（光学字符识别）和正则表达式（REGEX）提取相关文本，最后使用谷歌文本转语音将文本转换为语音。该语音将保存为MP3文件。

本教程将分为以下几个部分，以便于阅读：

* 获取谷歌云API的凭据
* 文件夹结构
* 安装必要的库
* 定义辅助函数
* 将辅助函数整合到提取器代码中
* 使用Fast API和Uvicorn为您的代码编写服务器
* 使用Postman测试应用程序

请注意，我们即将编写的代码应该能够适应来自不同医疗机构的不同类型的处方标签。如果您是为特定药房编写此代码，例如，您将确保只处理相同格式的标签。我选择了我通常从当地药房获得的标签。

以下是我们将在这里使用的示例标签：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*sBf_lwaacJHM08-iLiNzcQ.jpeg)

另外，我使用VS Code作为我们的代码编辑器。

## 1\. 获取 Google Cloud API 的凭据

Google Cloud 的 Text-To-Speech 使用深度学习模型将文本转换为自然听起来的语音，具体取决于您选择的语言、声音、音调或其他任何自定义选项。Google 已将此 API 提供给公众使用。要访问它，请按照以下步骤获取您 Google Cloud Platform 的 API 凭据，格式为 json。

* 使用这个 [*链接*](https://console.cloud.google.com/welcome?hl=en&project=myproject2-412118) 进入 Google Cloud 控制台。
* 打开左上角的导航菜单（汉堡图标），选择“IAM & Admin”，然后点击“服务账户”。
* 创建一个服务账户。为您的服务账户命名并描述，然后创建它。
* 这会将您带回服务账户列表。找到您新创建的服务账户，在“操作”下点击三个点的图标，然后选择“管理密钥”。
* 点击“添加密钥”以创建新密钥，选择 JSON 作为密钥类型并创建。
* 这会将凭据 JSON 文件下载到您的计算机上。为了本文的目的，我将其保存在工作目录中，命名为 gcp_credentials.json。

## 2\. 文件结构

在项目结束时，您的文件结构将如下所示。现在，不必担心细节，因为我们将根据故事的进展逐步处理每个项目。

```python
Project-Folder/
├── .venv/
    ├── xxxxx
    ├── xxxx
├── resources/
    ├── IMG-20231203-WA0010.jpg
├── src/
    ├── outils.py
    ├── parser_prescription.py
    ├── exception.py
    ├── extractor.py
    ├── loggings
        ├── __init__.py
├── logs/
        ├── running_logs.log
├── uploads/
    ├── 8a542768-2cfa-4291-a16f-9688ab4a4e22.jpg
    ├── xxx
├── main.py
├── gcp_credentials.json
├── output.mp3
└── requirements.txt
```

## 3\. 环境设置和库的安装

在代码编辑器的终端中，使用以下命令创建并激活一个 Python 环境：

```python
python -m venv .venv

.venv\Scripts\activate
```
接下来，创建一个名为 *requirements.txt* 的文本文件，在其中输入以下库，然后返回终端（命令提示符）并通过运行下一行将它们安装到虚拟环境中。

```python
pytesseract==0.3.10
opencv_python==4.7.0.68
Pillow[all]
fastapi==0.103.2
google-cloud-texttospeech[all]
uvicorn
```

```python
python -m pip install -r requirements.txt
```
以下是这些库的用途：

Pillow — 用于打开和保存处方标签图像文件。

OpenCV — 用于计算机视觉任务以处理图像。

Pytesseract — 使用光学字符识别从标签图像中提取文本的 Python 库。

Fast API 作为此后端项目的 web 开发框架。

Google-cloud-texttospeech — 将文本转换为语音。

Uvicorn 是用于运行 Fast API 应用程序的服务器。

## 4\. 定义辅助函数

### 工具

在你的 *src* 文件夹中，创建一个名为 *outils.py* 的 Python 文件。在这里，我们将定义两个将在文章后面使用的函数。

首先，我们定义一个函数，用于预处理图像以提高可见性。我们的处方标签将在该系统中以 .jpg 文件格式使用。根据图像的获取方式，质量可能不佳。这时，我们将应用计算机视觉的自适应阈值处理，将任何灰度部分转换为二进制。

经过这样的处理，我们上面的示例标签图像将如下所示：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*3cgFL82JI9x7BKWE1HyFrA.jpeg)

第二个是 text2speech 函数，它将消息文本作为输入，并应用谷歌的文本转语音系统，从文本合成自然的语音。该语音将以 MP3 格式保存到当前目录作为输出文件。

```python
## Enter the code below in your outils.py

import cv2
import numpy as np
import os
import google.cloud
from google.cloud import texttospeech

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "gcp_credentials.json"


def preprocess_image(img):
    # Preprocessing image for better visibility
    gray = cv2.cvtColor(np.array(img), 
                        cv2.COLOR_BGR2GRAY)   
    resized = cv2.resize(gray, 
                         None, 
                         fx=2, 
                         fy=2, 
                         interpolation=cv2.INTER_LINEAR) 
    processed_img = cv2.adaptiveThreshold(resized, 
                                          255, 
                                          cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                                          cv2.THRESH_BINARY, 
                                          61, 
                                          11) 
    return processed_img


def text2speech(message_text):
    #converting text to speech
    client = texttospeech.TextToSpeechClient()                                         #instantiate the client object
    synthesis_input = texttospeech.SynthesisInput(text = message_text)                  #set the input text to be synthesized
    voice = texttospeech.VoiceSelectionParams(language_code='en-US',                    #Build voice &
                                        name='en-US-wavenet-C',
                                        ssml_gender=texttospeech.SsmlVoiceGender.FEMALE)
    audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3)  #specify audio file type to return
    
    response = client.synthesize_speech(input=synthesis_input,                               #perform the text to speech request
                                 voice=voice,
                                 audio_config=audio_config)
    
    with open('output.mp3', 'wb') as out:                                                  #write the response to an output file
        out.write(response.audio_content)
    print('Audio content written to output file "output.mp3"')
```

### 处方解析器

在你的 *src* 文件夹中，创建一个名为 *parser\_prescription.py* 的 Python 文件，里面包含一个名为 PrescriptionParser() 的类。该类有 2 个函数：

它定义了 get\_field() 函数，该函数使用正则表达式从处方标签文本中提取 4 个字段。字段包括处方名称、剂量、续方次数和处方的到期日期。

这些字段被输入到 parse() 函数中，以获取完整的文本消息，随后调用上面工具模块中定义的 text2speech() 函数。

```python
## Enter the code below in your parser_prescription.py

import re
import src.outils

class PrescriptionParser():
    def __init__(self, text):
        self.text = text
    
    # Converting to speech    
    def parse(self):
        prescription_name = self.get_field('prescription_name')
        dosage = (self.get_field('dosage').replace("GIVE", "TAKE")).lower().replace('\n\n', '')
        refills = self.get_field('refills')
        expirydate = self.get_field('expirydate')
        
        message_text = f'Hello, as prescription for the drug {prescription_name}, {dosage}. It can be refilled {refills} times, on or before {expirydate}.'
        
        speech = src.outil.text2speech(message_text)
        
        return speech
                       
    # Getting the fields
    def get_field(self, field_name):
        pattern = ''
        flags = 0
        
        pattern_dict = {
            'prescription_name' : {'pattern': '(.*)Drug', 'flags' : 0},
            'dosage' : {'pattern': 'Netcare[^\n]*(.*)All', 'flags' : re.DOTALL},
            'refills' : {'pattern': 'Refilis:(.*)', 'flags' : 0},
            'expirydate' : {'pattern': 'Refills.Expire:(.*)', 'flags' : 0}
        }
        
        pattern_object = pattern_dict.get(field_name)
        if pattern_object:
            matches = re.findall(pattern_object['pattern'], self.text, flags=pattern_object['flags'])
            if len(matches) > 0:
                return matches[0].strip()
```

## 5\. 定义合并提取函数

接下来，在同一个 *src* 文件夹中，我们创建一个 *extractor.py* 文件，在其中定义 extract() 函数，该函数以标签图像的文件路径作为输入，使用 outils 模块中的 preprocess_image() 函数对其进行预处理，并使用 Pytesseract 将图像转换为文本。

然后，将文本传递给上面的 PrescriptionParser 类的 parse() 方法，以输出将标签朗读为 .mp3 文件的语音。

请注意，为了使用 Pytesseract，您必须从这个 [*链接*](https://github.com/UB-Mannheim/tesseract/wiki) 下载并安装 Tesseract-OCR 可执行文件。请确保将 Tesseract 安装目录添加到系统的环境变量路径中。如果没有，请在代码中包含其路径，如下所示。

```python
## Enter the code below in your extractor.py

from PIL import Image
import pytesseract
import src.outils

from src.loggings import logger
from src.parser_prescription import PrescriptionParser

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'


def extract(file_path):
    # extracting text from the image
    if file_path.endswith('.jpg'):
        img = Image.open(file_path)
        processed_image = src.outil.preprocess_image(img)
        text = pytesseract.image_to_string(processed_image, lang='eng')

        logger.info("Text message created")

    # extracting fields from the text and converting to speech  
        output_voice = PrescriptionParser(text).parse()

        logger.info("Voice message created and saved to file")

    else:
        raise Exception(f"Invalid file format")

    return output_voice
```
您可以看到，我们的代码中引入了一项新的功能，值得一提：

### 日志记录

logging 已经集成到 *extractor.py* 中，以便在应用程序运行时跟踪名为 ‘logs’ 的文件夹中的事件。

因此，我们创建了一个名为 ‘logging’ 的文件夹，在这里，我们将日志记录代码集中在一个 \_\_init\_\_.py 文件中，以避免在多个模块中重复设置日志记录：

```python
## Enter this code into the __init__.py file of your loggings directory

import os
import sys
import logging

logging_str = "[%(asctime)s]: %(levelname)s: %(module)s: %(message)s]"
log_dir = "logs"
log_filepath = os.path.join(log_dir, "running_logs.log")
os.makedirs(log_dir, exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format=logging_str,
    handlers=[
        logging.FileHandler(log_filepath),
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger("labelreaderLogger")
```

## 6\. 编写 Fast API 服务器

现在在你的工作目录中创建一个名为‘*uploads*’的临时文件夹。

我们将使用 Postman 作为测试工具，而不是浏览器，因为我们当前的项目需要传递一个图像文件，这在浏览器上会比较困难。如果你还没有 Postman，可以从 Google 上下载。

我们现在将设计我们的 Fast API 应用程序，以便使用 Uvicorn 在本地服务器上运行，如下所示：

```python
## Enter thse in your main.py file

from src.loggings import logger
from fastapi import FastAPI, Form, UploadFile, File
import uvicorn
from src.extractor import extract
import uuid
import os
import sys
from src.exception import CustomException
from PIL import Image

app = FastAPI()


@app.post("/speech_from_doc")
def speech_from_doc(file: UploadFile):     # UploadFile (specific to FastAPI) is the data type of the file. (...) means not passing any value

    contents = file.file.read()   # read the content of the file from Postman

    # save the temporary image file from Postman to a temporary location (uploads) for the extractor to use
    file_path = "uploads/" + str(uuid.uuid4()) + ".jpg"  #use uuid module to attach a unique string to the file name. You dont want to overwrite the test file

    with open(file_path, "wb") as f:
        f.write(contents)

    try:
        data = extract(file_path)
    except Exception as e:
        raise CustomException(e, sys)

    # delete the temporary image file after each run, that is, once the data is extracted
    if os.path.exists(file_path):
        os.remove(file_path)

    logger.info("Voice message created and saved to file")

    return data


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)


```
上述代码处理了整个运行过程。它从 Postman 上传文件，将其存储在临时位置（uploads 文件夹），使用自定义的 extract() 函数处理以提取文本，将语音消息作为 API 响应输出，然后通过从 *uploads* 文件夹中删除临时文件来进行清理。

你一定注意到我们的代码中引入了另一个值得一提的新功能：

### 自定义异常

我包含这个是为了能够创建一个错误类，以捕捉特定的错误，而不是通用异常。

以下是您需要在您的‘*exceptions.py*’文件中编写的代码：


```python
## Enter this into exceptions.py

import sys

def error_message_detail(error, error_detail:sys):
    _, _, exc_tb = error_detail.exc_info()   #error_detail.exc_info() has 3 outputs but we are interested in the 3rd one with details of the error
    file_name = exc_tb.tb_frame.f_code.co_filename  #we get the file name from exc_tb
    error_message = "Error occurred in python script name [{0}] line number [{1}] error message[{2}]".format(
        file_name, exc_tb.tb_lineno, str(error)
    )
    return error_message


class CustomException(Exception):
    def __init__(self, error_message, error_detail: sys):
        super().__init__(error_message)
        self.error_message = error_message_detail(error_message, error_detail=error_detail)

    def __str__(self):
        return self.error_message

```

## 7\. 使用 Postman 进行测试

在代码编辑器的终端中运行 *main.py*。获取生成的 Uvicorn 服务器 URL，并在 Postman 中将其附加到 POST 端点 /speech\-from\-doc，该端点由 *main.py* 代码中的装饰器定义。请参见下面的照片。

仍然在 Postman 中，将处方标签图像上传到“Body”和“form\-data”选项卡，然后点击“Send”，如下面的照片所示：

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*62J6lnCXwYt5ofb15ePh8g.png)

在 Postman 中看到“200 OK”后，表示成功运行，语音输出将保存在工作目录中。

作为我们当前示例的结果，点击下面的链接收听输出语音朗读标签。

> [**我们处方标签的完整语音输出**](https://aramary.com/images/projects/output.mp4)

## 结论

总之，本文展示了如何将 Python、FastAPI 和 Google Cloud 的 Text-to-Speech API 结合起来，为视觉障碍患者提供一个实用的解决方案，并提供了一个逐步构建和测试应用程序的指南。

通过利用 OCR 和计算机视觉，我们可以将处方标签转换为易于访问的语音消息。

随着医疗保健不断应用数字解决方案，这是一种有意义的方式来支持那些最需要帮助的人。

### 在我忘记之前

*如果你喜欢你刚刚阅读的内容，请点击我在 Medium 上的“关注”按钮，或者在 [LinkedIn](https://www.linkedin.com/in/maryara) 上点击，给我一些掌声，突出你关注的内容，或者更好的是，留下你的评论？任何一项或所有这些都会非常感谢。*

