---
title: "AI-Powered OCR with Phi-3-Vision-128K: The Future of Document Processing"
meta_title: "AI-Powered OCR with Phi-3-Vision-128K: The Future of Document Processing"
description: "In the fast-evolving world of artificial intelligence, multimodal models are setting new standards for integrating visual and textual data…"
date: 2024-11-08T00:26:30Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*BR-H6cQoyoRo6gVRqjvAyA.png"
categories: ["Natural Language Processing", "Computer Vision", "Data Science"]
author: "Rifx.Online"
tags: ["OCR", "tokens", "encoder", "language", "document"]
draft: False

---






In the fast\-evolving world of artificial intelligence, multimodal models are setting new standards for integrating visual and textual data. One of the latest breakthroughs is the **Phi\-3\-Vision\-128K\-Instruct**, a state\-of\-the\-art open multimodal model that pushes the boundaries of AI capabilities in processing images and text. Designed with a focus on document extraction, Optical Character Recognition (OCR), and general image understanding, this model can revolutionize how we handle information from PDFs, charts, tables, and other structured or semi\-structured documents.

Let’s dive deep into the nuts and bolts of the Phi\-3\-Vision\-128K\-Instruct, explore its architecture, technical requirements, responsible use considerations, and understand how it can be used to simplify complex tasks like document extraction, pdf parsing, and AI\-powered data analysis.


## What is Phi\-3\-Vision\-128K\-Instruct?

Phi\-3\-Vision\-128K\-Instruct belongs to the Phi\-3 model family and is built for multimodal data processing, supporting a context length of up to **128,000 tokens**. The model incorporates both textual and visual data, making it well\-suited for tasks that require the simultaneous interpretation of text and images. Its development involved **500 billion training tokens**, a combination of high\-quality synthetic data and rigorously filtered publicly available sources. Through a refined training process that included **supervised fine\-tuning and preference optimization**, the model has been crafted to deliver precise, reliable, and safe AI solutions.

With **4\.2 billion parameters**, Phi\-3\-Vision\-128K\-Instruct’s architecture comprises an image encoder, connector, projector, and the Phi\-3 Mini language model, making it a lightweight yet powerful choice for a wide range of applications.


## Core Use Cases

The model’s primary applications span several domains, with a particular focus on:

* **Document extraction and OCR:** Efficiently converting images of text or scanned documents into editable formats. It can handle complex layouts like tables, charts, and diagrams, making it a valuable tool for digitizing physical documents or automating data extraction workflows.
* **General image understanding:** Parsing visual content to recognize objects, interpret scenes, and extract relevant information.
* **Memory/compute\-constrained environments:** Running AI tasks where computing power or memory is limited without compromising performance.
* **Latency\-bound scenarios:** Reducing processing delays in real\-time applications such as live data feeds, chat\-based assistants, or streaming content analysis.


## How to Get Started with Phi\-3\-Vision\-128K\-Instruct

To use Phi\-3\-Vision\-128K\-Instruct, you will need to set up your development environment with the required libraries and tools. The model is integrated into the development version (4\.40\.2\) of the Hugging Face `transformers` library. Before diving into code examples, ensure that your Python environment is configured with these packages:


```python
## Required Packages
flash_attn==2.5.8
numpy==1.24.4
Pillow==10.3.0
Requests==2.31.0
torch==2.3.0
torchvision==0.18.0
transformers==4.40.2
```
To load the model, you can either update your local `transformers` library or clone and install it directly from the source:


```python
pip uninstall -y transformers && pip install git+https://github.com/huggingface/transformers
```
Now, let’s jump into some practical code snippets to show how you can leverage this powerful model for AI\-driven document extraction and text generation.


## Sample Code for Loading the Model

Here’s a Python example of how to initialize the model and start making inferences. We’ll make use of classes and functions to keep the code clean and organized:


```python
from PIL import Image
import requests
from transformers import AutoModelForCausalLM, AutoProcessor

class Phi3VisionModel:
    def __init__(self, model_id="microsoft/Phi-3-vision-128k-instruct", device="cuda"):
        """
        Initialize the Phi3VisionModel with the specified model ID and device.
        
        Args:
            model_id (str): The identifier of the pre-trained model from Hugging Face's model hub.
            device (str): The device to load the model on ("cuda" for GPU or "cpu").
        """
        self.model_id = model_id
        self.device = device
        self.model = self.load_model()  # Load the model during initialization
        self.processor = self.load_processor()  # Load the processor during initialization
    
    def load_model(self):
        """
        Load the pre-trained language model with causal language modeling capabilities.
        
        Returns:
            model (AutoModelForCausalLM): The loaded model.
        """
        print("Loading model...")
        # Load the model with automatic device mapping and data type adjustment
        return AutoModelForCausalLM.from_pretrained(
            self.model_id, 
            device_map="auto",  # Automatically map model to the appropriate device(s)
            torch_dtype="auto",  # Use an appropriate torch data type based on the device
            trust_remote_code=True,  # Allow execution of custom code for loading the model
            _attn_implementation='flash_attention_2'  # Use optimized attention implementation
        ).to(self.device)  # Move the model to the specified device
    
    def load_processor(self):
        """
        Load the processor associated with the model for processing inputs and outputs.
        
        Returns:
            processor (AutoProcessor): The loaded processor for handling text and images.
        """
        print("Loading processor...")
        # Load the processor with trust_remote_code=True to handle any custom processing logic
        return AutoProcessor.from_pretrained(self.model_id, trust_remote_code=True)
    
    def predict(self, image_url, prompt):
        """
        Perform a prediction using the model given an image and a prompt.
        
        Args:
            image_url (str): The URL of the image to be processed.
            prompt (str): The textual prompt that guides the model's generation.
        
        Returns:
            response (str): The generated response from the model.
        """
        # Load the image from the provided URL
        image = Image.open(requests.get(image_url, stream=True).raw)
        
        # Format the input prompt template for the model
        prompt_template = f"<|user|>\n<|image_1|>\n{prompt}<|end|>\n<|assistant|>\n"
        
        # Process the inputs, converting the prompt and image into tensor format
        inputs = self.processor(prompt_template, [image], return_tensors="pt").to(self.device)
        
        # Set generation arguments for the model's response generation
        generation_args = {
            "max_new_tokens": 500,  # Maximum number of tokens to generate
            "temperature": 0.7,     # Sampling temperature for diversity in generation
            "do_sample": False      # Disable sampling for deterministic output
        }
        print("Generating response...")
        # Generate the output IDs using the model, skipping the input tokens
        output_ids = self.model.generate(**inputs, **generation_args)
        output_ids = output_ids[:, inputs['input_ids'].shape[1]:]  # Ignore the input prompt in the output
        
        # Decode the generated output tokens to obtain the response text
        response = self.processor.batch_decode(output_ids, skip_special_tokens=True)[0]
        return response

## Initialize the model
phi_model = Phi3VisionModel()

## Example prediction
image_url = "https://example.com/sample_image.png"  # URL of the sample image
prompt = "Extract the data in json format."  # Prompt for model guidance
response = phi_model.predict(image_url, prompt)  # Get the response from the model

print("Response:", response)  # Print the generated response
```
The code above defines a `Phi3VisionModel` class that abstracts the loading and usage of the model, making it easier to integrate into your applications. The `predict()` method demonstrates how to perform image\-based inferences using a custom prompt.

To update the article with a focus on testing the OCR capabilities of the Phi\-3\-Vision\-128K\-Instruct model, we’ll add a section detailing how the model performs with real\-world examples of scanned ID cards.


## Testing OCR Capabilities with Scanned ID Cards

To evaluate the OCR performance of the Phi\-3\-Vision\-128K\-Instruct model, we tested it using several real\-world scanned ID card images. These images vary in quality and clarity, providing a range of challenges for the model. The goal is to demonstrate how well the model can extract text information from documents with different characteristics, such as blurriness, complex backgrounds, and varying text fonts.

**Image 1:** A fictional Utopian passport with detailed text, including personal information such as name, nationality, place of birth, date of issue, and expiration date. The text is slightly stylized, and there is a machine\-readable zone at the bottom. The image quality is high, with no significant background noise.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*MltpseOI3HhvCkUZMwLdEQ.png)

**Output:**


```python
{
  "Type/Type": "P",
  "Country code/Code du pays": "UTO",
  "Passport Number/N° de passeport": "L898902C3",
  "Surname/Nom": "ERIKSSON",
  "Given names/Prénoms": "ANNA MARIA",
  "Nationality/Nationalité": "UTOPIAN",
  "Date of Birth/Date de naissance": "12 AUGUST/AOUT 74",
  "Personal No./N° personnel": "Z E 184226 B",
  "Sex/Sexe": "F",
  "Place of birth/Lieu de naissance": "ZENITH",
  "Date of issue/Date de délivrance": "16 APR/AVR 07",
  "Authority/Autorité": "PASSPORT OFFICE",
  "Date of expiry/Date d'expiration": "15 APR/AVR 12",
  "Holder's signature/Signature du titulaire": "anna maria eriksson",
  "Passport/Passeport": "P<UTOERIKSSON<<ANNA<MARIA<<<<<<<<<<<<<<<<<<<<<<<L898902C36UT07408122F1204159ZE184226B<<<<10"
}
```
**Image 2:** A Dutch passport with a clear image of the holder and neatly formatted text. Fields include the passport number, name, date of birth, nationality, and expiration date. The document is presented with high contrast, making text extraction relatively straightforward. The machine\-readable zone (MRZ) at the bottom offers a structured data format that can help validate the accuracy of extracted information.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*WGV4tTxI9xISmAvFs8ovNw.png)

**Output:**


```python
Here's the extracted full data from the passport in JSON format:

{
  "passport": {
    "issuingCountry": "Netherlands",
    "issuingAuthority": "Koninkrijk der Nederlanden",
    "passportNumber": "SPEC12014",
    "issuingDate": "09 MAR 2014",
    "expiryDate": "09 MAR 2024",
    "holder": {
      "gender": "F",
      "nationality": "Netherlands",
      "placeOfBirth": "SPECIMEN",
      "sex": "WF",
      "firstNames": [
        "Willem",
        "Lieselotte"
      ]
    },
    "physicalDescription": {
      "height": "1.75 m",
      "hairColor": "gray",
      "hairLength": "short"
    },
    "issuingOffice": "Burg. van Stad en Dorp",
    "issuingDateAsInt": "14032014",
    "expiryDateAsInt": "14032024",
    "fieldsExtracted": [
      {
        "code": "NL",
        "dateOfBirth": "10 MAR 1965",
        "dateOfIssue": "09 MAR 2014",
        "dateOfExpiry": "09 MAR 2024",
        "firstNames": [
          "Willem",
          "Lieselotte"
        ],
        "nationality": "Netherlands",
        "passportNumber": "SPEC12014",
        "placeOfBirth": "SPECIMEN",
        "sex": "WF"
      }
    ]
  }
}
```

## Try Phi\-3\-Vision\-128K\-Instruct Yourself

If you want to try the Phi\-3\-Vision\-128K\-Instruct model for yourself, you can explore it through the following link: [Try Phi\-3\-Vision\-128K\-Instruct on Azure AI](https://ai.azure.com/explore/models/Phi-3-vision-128k-instruct/version/1/registry/azureml). This link allows you to experience the model’s capabilities and experiment with its OCR functionality.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*7feNu3ZuclgAnAzbJMMSFg.png)


## Understanding the Architecture and Training

The **Phi\-3\-Vision\-128K\-Instruct** model is not just any language model — it’s a multimodal powerhouse that can process both visual and textual data. It has undergone a comprehensive training regime that included **500 billion tokens**, a blend of text and image data. Its architecture integrates a language model and image processing modules, creating a cohesive system that understands context over **128K tokens**, allowing for extended conversations or documents with large content.

Trained on powerful hardware, such as **512 H100 GPUs**, and utilizing **flash attention** for memory efficiency, this model can handle large\-scale tasks with ease. The training dataset includes a mix of synthetic and filtered real\-world data, emphasizing **math, coding, common sense reasoning**, and **general knowledge**, making it versatile enough for various applications.


## Key Benchmarks and Performance

The performance of Phi\-3\-Vision\-128K\-Instruct has been tested across multiple benchmarks, including **ScienceQA**, **AI2D**, **MathVista**, and **TextVQA**. Its scores consistently surpass many existing models in tasks that combine text and vision, particularly in areas such as:

* **Document comprehension**: Extracting useful information from complex documents like PDFs or images.
* **Table and chart understanding**: Accurately interpreting graphical data and converting it into textual explanations.

In particular, the model achieved an impressive **81\.4%** on **ChartQA** and **76\.7%** on **AI2D**, showcasing its capability to understand data\-rich documents effectively.


## Why OCR and Document Extraction Matter

Document extraction and OCR are vital for businesses and research, enabling the conversion of printed or handwritten text into machine\-readable formats. Tasks such as **PDF parsing**, **data entry automation**, **invoice processing**, and **legal document analysis** are significantly simplified by using AI models like Phi\-3\-Vision\-128K\-Instruct.

Whether you are dealing with scanned documents, screenshots, or photographed pages, the model’s multimodal capabilities can help to **automate data extraction**, making it a valuable tool for improving productivity and reducing manual effort.


## Responsible AI and Safety Measures

While the model is powerful, it comes with limitations that developers should keep in mind. **Language biases**, **stereotype reinforcement**, and **inaccurate content generation** are potential issues. For high\-risk use cases, such as **health or legal advice**, additional layers of **verification and content filtering** are necessary.


## Future Directions and Fine\-Tuning

Looking to extend Phi\-3\-Vision\-128K\-Instruct’s capabilities? Fine\-tuning is supported and can be performed using the **Phi\-3 Cookbook**, which provides recipes for adjusting the model to specific tasks like **document classification**, **enhanced OCR accuracy**, and **specialized image understanding**.


## Conclusion

The Phi\-3\-Vision\-128K\-Instruct isn’t just a step forward for multimodal AI; it’s a leap into a future where **document extraction, OCR, and AI\-driven content generation** are seamless and accessible. With extensive training, robust architecture, and thoughtful design, this model empowers developers to transform data processing across various fields.

Stay tuned for more advanced examples and tutorials on integrating this model with real\-world applications, where we will explore **processing multiple document types** and applying **AI\-powered techniques** to extract valuable insights from diverse sources.

The future of **AI\-powered document extraction** has never looked more promising!


