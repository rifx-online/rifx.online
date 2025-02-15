---
title: "Revolutionizing Financial Document Processing with Agentic Workflows"
meta_title: "Revolutionizing Financial Document Processing with Agentic Workflows"
description: "The article discusses a workflow designed to automate the processing of complex financial documents, specifically SEC 10-K reports, utilizing tools such as Phidata, n8n, and Qdrant. It outlines an architecture that includes a Local File Trigger, a custom-built Sec10k Agent for analysis, and a Qdrant Vector Store for managing data. The implementation details a structured approach for extracting financial metrics and storing them in a vector database, enhancing search and retrieval capabilities. The solution aims to streamline financial operations, making data accessible and actionable for decision-makers, ultimately promoting smarter financial management through AI and automation."
date: 2024-12-26T04:30:18Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*l6iz1IorItTcrER2zAgqjA.png"
categories: ["Finance", "Technology", "Data Science"]
author: "Rifx.Online"
tags: ["Phidata", "n8n", "Qdrant", "Sec10k", "VectorStore"]
draft: False

---




Financial documents like SEC 10\-K reports are often complex and tedious to process, but with the right workflow, the entire process can be transformed. I developed a streamlined solution integrating `Phidata`, `n8n`, and `Qdrant` to automate financial document analysis. This workflow processes reports seamlessly, extracts precise and structured insights, and stores them in Qdrant, a powerful vector database, enabling advanced search and retrieval capabilities. The result is a faster, more efficient way to handle financial data, making it accessible and actionable for decision\-makers. With this approach, managing large\-scale financial operations becomes not just simpler but smarter, leveraging AI and automation to drive impactful results.




## The Architecture:

The architecture integrates various components to create an efficient and streamlined process for handling SEC 10\-K financial documents. It begins with the Local File Trigger, which monitors a designated directory on the local system for new financial filings. Once a file is detected, it initiates the workflow. At the core of the system is the `Sec10k Agent designed using phidata`, a custom\-built financial analysis agent powered by the `Claude 3.5 Sonnet model`. This agent is specifically designed to analyze financial filings and generate structured JSON outputs, using a combination of tools for PDF analysis and precise instruction sets. The agent is also configured with debugging and streaming features to ensure a reliable and dynamic analysis process.

The processed data then flows into the `Qdrant Vector Store`, a robust vector database designed for storing and managing embeddings. These embeddings are generated by the Embedding `Ollama` module, which transforms the extracted content into vectorized representations suitable for advanced search and retrieval. To ensure the documents are processed efficiently, the Default Data Loader handles the preparation of the documents, ensuring they meet the necessary requirements for subsequent operations. The content is further refined through the Recursive Character Text Splitter, which breaks the text into manageable chunks while preserving its semantic integrity.


## The Implementation

For the article purpose I have considered a sec 10\-Q document [https://investors.sparinc.com/sec\-filings](https://investors.sparinc.com/sec-filings) you can download the pdf for the experimentation purpose. Import the below JSON file to create the `n8n workflow`.


```python
{
  "name": "filechange2qdrant",
  "nodes": [
    {
      "parameters": {
        "mode": "insert",
        "qdrantCollection": {
          "__rl": true,
          "value": "multi_document_agent",
          "mode": "list",
          "cachedResultName": "multi_document_agent"
        },
        "options": {}
      },
      "type": "@n8n/n8n-nodes-langchain.vectorStoreQdrant",
      "typeVersion": 1,
      "position": [
        60,
        -100
      ],
      "id": "988b5468-8483-49db-832f-15d77333f391",
      "name": "Qdrant Vector Store",
      "credentials": {
        "qdrantApi": {
          "id": "jbqGna16O2L9iR8V",
          "name": "QdrantApi account"
        }
      }
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://f309-2401-4900-889d-f100-6539-35f9-5e06-1638.ngrok-free.app/api/v1/analyze",
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "query",
              "value": "analyse the financial statement and provide the final response as a structured JSON"
            },
            {
              "name": "file_path",
              "value": "={{ $json.path }}"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        -160,
        -100
      ],
      "id": "1657cd1d-246f-4b28-975b-fcc5b1a6edfc",
      "name": "sec10k agent"
    },
    {
      "parameters": {
        "triggerOn": "folder",
        "path": "YOUR_DATA_PATH",
        "events": [
          "add"
        ],
        "options": {
          "usePolling": true
        }
      },
      "type": "n8n-nodes-base.localFileTrigger",
      "typeVersion": 1,
      "position": [
        -440,
        -100
      ],
      "id": "bd57a74a-4d96-4d86-97f2-b376505da7ad",
      "name": "Local File Trigger"
    },
    {
      "parameters": {
        "jsonMode": "expressionData",
        "jsonData": "={{ $('sec10k agent').item.json }}",
        "options": {}
      },
      "type": "@n8n/n8n-nodes-langchain.documentDefaultDataLoader",
      "typeVersion": 1,
      "position": [
        240,
        100
      ],
      "id": "e4e22dd9-cac9-4bcc-a893-d5339f99a49c",
      "name": "Default Data Loader"
    },
    {
      "parameters": {
        "options": {}
      },
      "type": "@n8n/n8n-nodes-langchain.textSplitterRecursiveCharacterTextSplitter",
      "typeVersion": 1,
      "position": [
        340,
        260
      ],
      "id": "bcbfa95e-a1c2-4144-8525-c7e43b231b3c",
      "name": "Recursive Character Text Splitter"
    },
    {
      "parameters": {
        "model": "nomic-embed-text:latest"
      },
      "type": "@n8n/n8n-nodes-langchain.embeddingsOllama",
      "typeVersion": 1,
      "position": [
        100,
        100
      ],
      "id": "e634d2e6-c6ca-4e31-9dfd-f63d182731c5",
      "name": "Embeddings Ollama",
      "credentials": {
        "ollamaApi": {
          "id": "3fAFU0fFchwovvbD",
          "name": "Ollama account"
        }
      }
    }
  ],
  "pinData": {},
  "connections": {
    "sec10k agent": {
      "main": [
        [
          {
            "node": "Qdrant Vector Store",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Local File Trigger": {
      "main": [
        [
          {
            "node": "sec10k agent",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Default Data Loader": {
      "ai_document": [
        [
          {
            "node": "Qdrant Vector Store",
            "type": "ai_document",
            "index": 0
          }
        ]
      ]
    },
    "Recursive Character Text Splitter": {
      "ai_textSplitter": [
        [
          {
            "node": "Default Data Loader",
            "type": "ai_textSplitter",
            "index": 0
          }
        ]
      ]
    },
    "Embeddings Ollama": {
      "ai_embedding": [
        [
          {
            "node": "Qdrant Vector Store",
            "type": "ai_embedding",
            "index": 0
          }
        ]
      ]
    }
  },
  "active": true,
  "settings": {
    "executionOrder": "v1"
  },
  "versionId": "e4f7ee4a-b657-46a5-b2ff-82b7cd6c3aad",
  "meta": {
    "instanceId": "e711fbe877d128d86a078d3ddcaeb0c456781dc70945c5f7c313501777f80a45"
  },
  "id": "FHzKIgnbgnbIcZu8",
  "tags": []
}
```

## The Agent Implementation

First of all, the project scaffolding is as below.


```python
.
├── api_server.py
├── data
│   └── 0001437749-24-035313.pdf
├── phidata
│   ├── __init__.py
│   ├── anthropic_utility.py
│   ├── financial_agent.py
│   └── financial_models.py
└── requirements.txt
```
The `requirements.txt` file looks as below, this file has got the dependent modules for exposing the agent as API using `fastapi`.


```python
phidata==2.7.5
anthropic==0.42.0
openai==1.58.1
python-dotenv==1.0.1
pypdf==5.0.1
fastapi==0.115.6
uvicorn==0.34.0
```
There is a need of Anthropic API key for the agent to interact with Anthropic APIs. create a `.env` file in the root folder and keep the API key there I my case I was experimenting with both OpenAI and Anthropic, so I have both.


```python
OPENAI_API_KEY=sk-proj-****
ANTHROPIC_API_KEY=sk-ant-****
```
Now let us start from the prompts on how to build the Agentic tool. The entire system is dependent on 2 prompts `system_prompt` and `user_prompt`


```python
def _create_user_prompt(self, file_type: str, page_count: int) -> str:
        """Create the user prompt for the financial analysis."""
        return f"""I'm sending you a {file_type} document as {page_count} images. Please analyze all pages and extract the following financial metrics:
        - EBIT
        - EBITDA
        - Net Income
        - Revenue
        - Currency
        - Units: (Actuals | Thousands)
        - Depreciation
        - Amortization
        - Filing Date
        - Fiscal Year End
        - Language
        - Country
        
        For each metric, please provide:
        1. The exact value
        2. Where it was found (coordinates/page numbers)
        3. The relevant snippet of text
        4. Your reasoning for the extraction
        5. A confidence score
        6. Whether the value was derived or directly extracted
        7. Any calculations performed
        8. Detect the language and country and populate the fields accordingly.
        
        Please provide the output in valid JSON format matching the provided class structure. No other text is needed just the JSON is sufficient
        """
```

```python
def _create_system_prompt(self) -> str:
        """Create the system prompt for the financial analysis."""
        return """You are a specialized financial analyst with deep expertise in interpreting 
        corporate filings across multiple languages. Your strength lies in identifying, extracting, and 
        validating financial metrics like EBIT, EBITDA, Net Income, and other key performance indicators. 
        You have been trained to provide detailed documentation of your findings, including coordinate references 
        and contextual snippets. You are meticulous about explaining your reasoning and providing confidence scores 
        for each extraction. No other text is needed just the JSON is sufficient.
        
        You MUST provide your analysis in the following JSON structure:
        {
            "company_name": str,
            "filing_date": str,
            "filing_type": str,
            "currency": str,
            "fiscal_year_end": str,
            "language": str,
            "country": str,
            "unity": str
            "metrics": [
                {
                    "attribute": str,
                    "value": float,
                    "coordinates": str | null,
                    "snippet": str,
                    "reasoning": str,
                    "confidence_score": float,
                    "translation": str | null,
                    "is_derived": bool,
                    "calculation_details": {str: float} | null,
                    "unit": str
                }
            ],
            "confidence_summary": float
        }    
        """
```
Now the tool will consider the above prompts to make a more structured output using the `pydantic` models as below.


```python
from pydantic import BaseModel
from typing import Optional, Dict, List


class FinancialMetric(BaseModel):
    attribute: str
    value: float
    coordinates: Optional[str]
    snippet: str
    reasoning: str
    confidence_score: float
    translation: Optional[str]
    is_derived: bool
    calculation_details: Optional[Dict[str, float]]
    unit: str


class FinancialAnalysis(BaseModel):
    company_name: str
    filing_date: str
    filing_type: str
    currency: str
    country: str
    language: str
    unit: str
    fiscal_year_end: str
    metrics: List[FinancialMetric]
    confidence_summary: float
```
the actual tool to call the anthropic along with a pdf upload as below


```python
def analyze_financial_filing_pdf(self):
        """Analyze financial filings PDF file and return the financial analysis."""
        try:
            # Load and encode the PDF
            with open(self.pdf_path, "rb") as f:
                pdf_data = base64.b64encode(f.read()).decode("utf-8")
                self.logger.info(f"{self.pdf_path} converted to base64")

            reader = PdfReader(stream=self.pdf_path)
            self.logger.info("creating the Anthropic message contract and calling API")

            message = self.client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=1024,
                system=self._create_system_prompt(),
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "document",
                                "source": {
                                    "type": "base64",
                                    "media_type": "application/pdf",
                                    "data": pdf_data
                                },
                                "cache_control": {"type": "ephemeral"}
                            },
                            {
                                "type": "text",
                                "text": self._create_user_prompt("PDF", len(reader.pages))
                            }
                        ]
                    }
                ],
            )

            try:
                response_text = message.content[0].text
                print(response_text)
                response_dict = json.loads(response_text)
                analysis = FinancialAnalysis(**response_dict)
                self.logger.info(json.loads(analysis.model_dump_json(indent=2)))
                return analysis.model_dump_json(indent=2)
            except Exception as e:
                self.logger.error(f"Error parsing response: {e}")
                self.logger.info("Raw response:")
                self.logger.info(message.content
                raise

        except Exception as e:
            self.logger.error(f"Error analyzing PDF: {e}")
            raise
```
Now let’s create the Agent which uses the above tool for properly analyse the financial documents in this case its sec\-10Q and generate the specified output.


```python
from phi.agent import Agent, RunResponse  # noqa
from phi.model.anthropic import Claude

from phidata.anthropic_utility import FinancialAnalyzer
from phidata.financial_models import FinancialAnalysis


def init_financial_analyzer():
    analyzer = FinancialAnalyzer()
    return analyzer


def financial_agent(analyzer: FinancialAnalyzer):
    # Agent that uses JSON mode
    json_mode_agent = Agent(
        model=Claude(id="claude-3-5-sonnet-20241022"),
        name="financial Agent",
        description="financial filings Analysis Agent",
        response_model=FinancialAnalysis,
        tools=[analyzer.analyze_financial_filing_pdf],
        show_tool_calls=True,
        tool_call_limit=5,
        reasoning=False,
        instructions=["Your task is to get the financial analysis in a specified json format"],
        stream=True,
        debug_mode=True,
        structured_outputs=False
    )
    return json_mode_agent
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*zkbt2JsOgDKsEsTYXUzyYA.png)



The above process ensures that the entire generated response from the agent is vectorized and stored in Qdrant. This approach not only facilitates advanced search and retrieval but also enables downstream tasks such as similarity analysis using RAG. Integrating the generated content into Qdrant’s vector database streamlines the process of organizing, analysing, and retrieving contextual and relevant information.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*4FW2gWg60K4QwFt9UMXXKg.png)


## Conclusion:

In conclusion, this architecture and workflow demonstrates the transformative potential of combining AI, automation, and vectorization for financial document processing. By seamlessly integrating tools like Phidata, n8n, and Qdrant, the system not only simplifies the analysis of complex filings such as SEC 10\-K reports but also ensures that the extracted data is structured, stored, and ready for advanced retrieval. This workflow is a step toward smarter and more efficient financial operations, empowering organizations to make data\-driven decisions with precision and ease. As financial data continues to grow in complexity and volume, solutions like this pave the way for a future where managing such information becomes faster, scalable, and highly accessible.


