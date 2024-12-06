---
title: "From Prescription to Voice: A Python Solution to Help Service Elderly and Visually Impaired…"
meta_title: "From Prescription to Voice: A Python Solution to Help Service Elderly and Visually Impaired…"
description: "This article outlines a Python-based solution employing FastAPI, OCR, and Google’s Text-To-Speech API to assist elderly and visually impaired patients by converting prescription labels into audible messages. It details the process of extracting text from images using image processing techniques, followed by text-to-speech conversion. The tutorial includes steps for setting up the environment, defining necessary functions, and building a FastAPI server to handle requests. Ultimately, this application aims to enhance accessibility in healthcare by making prescription information more user-friendly."
date: 2024-12-06T00:36:47Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*8u9Vfaf6-o04440G"
categories: ["Programming", "Health", "Technology/Web"]
author: "Rifx.Online"
tags: ["FastAPI", "OCR", "TextToSpeech", "imageprocessing", "accessibility"]
draft: False

---

### Learn how to build a Fast API backend solution that combines OCR, Computer Vision and Google’s Text\-To\-Speech to read a prescription label



Under normal circumstances, reading the label on your prescription medication should not be a challenging task. Most often, the most important instruction, the dosage, is usually boldly printed, like:

> ***“*Give 1\.5 tablets 3 times daily when required*”***

On the other hand, consider an abnormal circumstance like the case of a visually impaired and/or an elderly patient. He is not able to read his prescription label without help.

You, as the data scientist or Python developer in a pharmacy, can help solve this problem by writing a program adaptable to the kind of prescription labels of the patient. This program will read the label and convert it to speech.

In this article, I will be showing you how to extract text from an image by first cleaning the image using Computer Vision, applying Tesseract\-OCR (Optical Character Recognition) and Regular Expression (REGEX) to extract the relevant text, and then convert the text to voice using Google’s Text\-To\-Speech. This voice will be saved as an MP3 file.

This tutorial will be broken down to the following chunks for easy readability:

* Obtaining credentials for Google Cloud API
* Folder structure
* Installing the necessary libraries
* Defining the helper functions
* Consolidating the helper functions into an extractor code
* Writing a server for your code using Fast API and Uvicorn
* Testing the application using Postman

Please note that the code we are about to write should be adaptable to different kinds of prescription labels from different health institutions. If you are writing this code for a particular pharmacy, for example, you will be sure to only deal with labels of the same format. I have chosen the label I usually get from my local pharmacy.

Below is the example label the we will be using here:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*sBf_lwaacJHM08-iLiNzcQ.jpeg)

Also, I’m using VS Code as our code editor.

## 1\. Obtaining credentials for Google Cloud API

Google Cloud’s Text\-To\-Speech uses deep learning models to convert text into natural\-sounding speech depending on whatever language, voice, pitch or any other customization options you choose. Google has made this API available for public use. To access it, use the following steps to get your Google Cloud Platform’s API credentials in json format.

* Use this [*link*](https://console.cloud.google.com/welcome?hl=en&project=myproject2-412118) to go to the Google Cloud console.
* Open the navigation menu on the top left (hamburger icon), select ‘IAM \& Admin’ and click on ‘Service Accounts’.
* Create a service account. Give your service account a name and description and then create it.
* This takes you back to your list of service accounts. Go to your newly created service account and under ‘Actions’ click the 3 doted lines and then ‘Manage Keys’.
* Click ‘Add Key’ to create new key, select JSON as the key type and create.
* This downloads the credentials JSON file to your computer. For the purpose of this article, I saved it in the working directory as gcp\_credentials.json.

## 2\. Folder structure

At the end of this project, your folder structure will look like below. For now, do not bother about the details as we will treat every item as and when they roll up in the story.

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

## 3\. Environment setup and installation of Libraries

In the terminal of your code editor create and activate a Python environment using the lines:

```python
python -m venv .venv

.venv\Scripts\activate
```

Next, create a text file called *requirements.txt*, where you will enter the following libraries, and then go back to your terminal (command prompt) and install them into your virtual environment by running the next line.

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

Here’s how these libraries will be used:

Pillow — for opening and saving the prescription label image file.

OpenCV — used for computer vision tasks to process the image.

Pytesseract — the Python library that uses optical character recognition to extract text from the label image.

Fast API is used as the web development framework for this backend project.

Google\-cloud\-texttospeech — to convert the text to voice.

Uvicorn is the server that will be used to run the Fast API application.

## 4\. Defining the helper functions

### Outils

In your *src* folder, create a Python file called *outils.py*. Here, we will define two functions that will be used later down in the article.

First we define a function to preprocess the image for better visibility. Our prescription label will be used in this system in the .jpg file format. Depending on how the image was obtained, the quality may not be good. This is where we will apply Computer Vision’s adaptive thresholding to convert any grayscale portions into binary.

After such processing, our example label image above will look like this:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*3cgFL82JI9x7BKWE1HyFrA.jpeg)

The second one is the text2speech function, which will take the message text as input and apply Google’s Text\-To\-Speech system to synthesize natural\-sounding speech from the text. This voice is saved to the current directory as the output file in the format, MP3\.

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

### Prescription parser

In your *src* folder, create a python file called *parser\_prescription.py*, which will contain a class called PrescriptionParser(). This class has 2 functions:

It defines the get\_field() function that uses regular expression to extract 4 fields from the prescription label text. The fields are prescription name, dosage, number of refills and expiry date of the prescription.

These fields are imputed into the parse() function to get the complete text message, on which the text2speech() function defined in the outils module above is called.

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

## 5\. Defining the consolidated extract function

Next, in the same *src* folder, we create an *extractor.py* file, where we define the extract() function, which takes as input the file path of the label image, preprocesses it with the preprocess\_image() function from the outils module, converts the image to text using Pytesseract.

The text is then passed into the parse() method of the PrescriptionParser class above to output the voice reading the label as a .mp3 file.

Please note that, in order to use Pytesseract, you have to download and install the Tesseract\-OCR executable from this [*link*](https://github.com/UB-Mannheim/tesseract/wiki). Please ensure the Tesseract installation directory is added to your system’s environment variable path. If not, include it’s path in your code as below.

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

You can see that a new capability has been introduced into our code that is worth mentioning:

### Logging

logging has been intergrated into *extractor.py* in order to track events in a folder called ‘logs’ while the application runs.

So, we create a folder called ‘logging’, where, we centralize our logging code in a \_\_init\_\_.py file to avoid repetitive logging setup in multiple modules:

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

## 6\. Writing the Fast API server

Now create a temporal folder called ‘*uploads*’ , in your working directory.

We are about to use Postman as the testing tool instead of your browser because our current project requires passing an image file, which will be tough on a browser. If you do not have Postman yet, you can download it from Google.

We’ll now design our Fast API application to run on the local server using Uvicorn as follows:

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

The above code handles the entire run. It uploads the file from Postman, stores it in a temporary location (the uploads folder), processes it to extract the text using the custom extract() function defined further up in the article, outputs the voice message as the API response, and then performs a cleanup by deleting the temporary file from the *uploads* folder.

You must have noticed that another new capability has been introduced into our code that is worth mentioning:

### Custom exception

I included this so to be able to create an error class to catch specific errors rather than generic exceptions.

Here’s the code to write in your ‘*exceptions.py*’ file:

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

## 7\. Testing using Postman

In the terminal of your code editor, run *main.py*. Get the resulting Uvicorn server url, and in Postman, attach it to the POST endpoint, /speech\-from\-doc defined by the decorator in your *main.py* code. See photo below.

Still in Postman, upload the prescription label image into the ‘Body’ and ‘form\-data’ tabs, and then click ‘Send’, like in the photo below:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*62J6lnCXwYt5ofb15ePh8g.png)

After a successful run as indicated by the “200 OK” seen in Postman, the voice output gets saved in the working directory.

As the result of our current example, click the link below to listen to the output voice reading the label.

> [**The complete voice output for our prescription label**](https://aramary.com/images/projects/output.mp4)

## Conclusion

To sum it all, the article shows how Python, FastAPI and Google Cloud’s Text\-to\-Speech API can be combined to provide a practical solution for visually impaired patients, in a step\-by\-step guide to building and testing the application.

By leveraging OCR and computer vision, we can transform prescription labels into easily accessible voice messages.

As healthcare continues to apply digital solutions, this is a meaningful way to support those who need it the most.


