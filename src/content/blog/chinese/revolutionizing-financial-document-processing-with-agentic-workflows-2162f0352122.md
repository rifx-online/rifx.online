---
title: "基于智能工作流的金融文档处理自动化解决方案"
meta_title: "基于智能工作流的金融文档处理自动化解决方案"
description: "本文介绍了一种创新的智能工作流，通过整合Phidata、n8n和Qdrant，自动化金融文档（如SEC 10-K报告）的分析过程。该工作流利用定制的财务分析代理，能够高效提取结构化数据并存储于Qdrant向量数据库，从而实现高级搜索和检索功能。该架构简化了复杂金融文件的处理，提高了决策效率，推动了数据驱动的决策方式，为未来金融数据管理提供了可扩展的解决方案。"
date: 2024-12-26T04:30:18Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*l6iz1IorItTcrER2zAgqjA.png"
categories: ["Finance", "Technology", "Data Science"]
author: "Rifx.Online"
tags: ["Phidata", "n8n", "Qdrant", "Sec10k", "VectorStore"]
draft: False

---



金融文档如 SEC 10-K 报告通常复杂且繁琐，但通过合适的工作流，整个过程可以得到改造。我开发了一种集成 `Phidata`、`n8n` 和 `Qdrant` 的简化解决方案，以自动化金融文档分析。该工作流无缝处理报告，提取精确且结构化的见解，并将其存储在 Qdrant 中，这是一种强大的向量数据库，能够实现高级搜索和检索功能。结果是处理金融数据的方式更加快速、高效，使决策者能够获取和利用这些数据。通过这种方法，管理大规模金融操作不仅变得更简单，还更智能，利用人工智能和自动化推动有影响力的结果。



## 架构：

该架构整合了各种组件，以创建一个高效且流畅的处理 SEC 10-K 财务文件的流程。它始于本地文件触发器，该触发器监控本地系统中指定目录的新财务申报。一旦检测到文件，它就会启动工作流程。系统的核心是 `Sec10k Agent designed using phidata`，这是一个定制构建的财务分析代理，基于 `Claude 3.5 Sonnet model`。该代理专门设计用于分析财务申报并生成结构化的 JSON 输出，使用一系列工具进行 PDF 分析和精确的指令集。该代理还配置了调试和流式处理功能，以确保可靠且动态的分析过程。

处理后的数据流入 `Qdrant Vector Store`，这是一个强大的向量数据库，旨在存储和管理嵌入。这些嵌入由嵌入 `Ollama` 模块生成，该模块将提取的内容转换为适合高级搜索和检索的向量化表示。为确保文件高效处理，默认数据加载器负责准备文件，确保它们满足后续操作的必要要求。内容通过递归字符文本分割器进一步精炼，该分割器将文本分解为可管理的块，同时保持其语义完整性。

## 实现

为了文章的目的，我考虑了一个 sec 10\-Q 文档 [https://investors.sparinc.com/sec\-filings](https://investors.sparinc.com/sec-filings)，您可以下载 PDF 进行实验。导入以下 JSON 文件以创建 `n8n workflow`。

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

## 代理实现

首先，项目结构如下所示。

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
`requirements.txt` 文件如下所示，该文件包含了使用 `fastapi` 将代理暴露为 API 的依赖模块。

```python
phidata==2.7.5
anthropic==0.42.0
openai==1.58.1
python-dotenv==1.0.1
pypdf==5.0.1
fastapi==0.115.6
uvicorn==0.34.0
```
代理与 Anthropic API 交互需要 Anthropic API 密钥。在根文件夹中创建一个 `.env` 文件，并将 API 密钥放在那里。在我的案例中，我同时使用了 OpenAI 和 Anthropic，因此我有两个密钥。

```python
OPENAI_API_KEY=sk-proj-****
ANTHROPIC_API_KEY=sk-ant-****
```
现在让我们从提示开始，了解如何构建代理工具。整个系统依赖于两个提示 `system_prompt` 和 `user_prompt`。

```python
def _create_user_prompt(self, file_type: str, page_count: int) -> str:
        """创建财务分析的用户提示。"""
        return f"""我将发送给你一份 {file_type} 文档，共 {page_count} 页。请分析所有页面并提取以下财务指标：
        - EBIT
        - EBITDA
        - 净收入
        - 收入
        - 货币
        - 单位：（实际 | 千）
        - 折旧
        - 摊销
        - 申报日期
        - 财年结束
        - 语言
        - 国家
        
        对于每个指标，请提供：
        1. 精确值
        2. 找到的位置（坐标/页码）
        3. 相关文本片段
        4. 提取的理由
        5. 置信度评分
        6. 值是派生的还是直接提取的
        7. 进行的任何计算
        8. 检测语言和国家并相应填充字段。
        
        请以有效的 JSON 格式提供输出，符合提供的类结构。只需 JSON 即可，无需其他文本。
        """
```

```python
def _create_system_prompt(self) -> str:
        """创建财务分析的系统提示。"""
        return """您是一位专业的财务分析师，具有深厚的解读多语言公司文件的专业知识。您的强项在于识别、提取和验证财务指标，如 EBIT、EBITDA、净收入和其他关键绩效指标。您已接受培训，能够详细记录您的发现，包括坐标参考和上下文片段。您对解释您的推理和为每次提取提供置信度评分非常细致。只需 JSON 即可，无需其他文本。
        
        您必须以以下 JSON 结构提供您的分析：
        {
            "company_name": str,
            "filing_date": str,
            "filing_type": str,
            "currency": str,
            "fiscal_year_end": str,
            "language": str,
            "country": str,
            "unity": str,
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
现在，该工具将考虑上述提示，以使用 `pydantic` 模型生成更结构化的输出，如下所示。

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
实际的工具调用 Anthropic，并上传 PDF，如下所示。

```python
def analyze_financial_filing_pdf(self):
        """分析财务申报 PDF 文件并返回财务分析结果。"""
        try:
            # 加载并编码 PDF
            with open(self.pdf_path, "rb") as f:
                pdf_data = base64.b64encode(f.read()).decode("utf-8")
                self.logger.info(f"{self.pdf_path} 已转换为 base64")

            reader = PdfReader(stream=self.pdf_path)
            self.logger.info("创建 Anthropic 消息合同并调用 API")

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
                self.logger.error(f"解析响应时出错: {e}")
                self.logger.info("原始响应：")
                self.logger.info(message.content)
                raise

        except Exception as e:
            self.logger.error(f"分析 PDF 时出错: {e}")
            raise
```
现在让我们创建一个代理，使用上述工具来正确分析财务文件，在这种情况下是 sec-10Q，并生成指定的输出。

```python
from phi.agent import Agent, RunResponse  # noqa
from phi.model.anthropic import Claude

from phidata.anthropic_utility import FinancialAnalyzer
from phidata.financial_models import FinancialAnalysis


def init_financial_analyzer():
    analyzer = FinancialAnalyzer()
    return analyzer


def financial_agent(analyzer: FinancialAnalyzer):
    # 使用 JSON 模式的代理
    json_mode_agent = Agent(
        model=Claude(id="claude-3-5-sonnet-20241022"),
        name="财务代理",
        description="财务申报分析代理",
        response_model=FinancialAnalysis,
        tools=[analyzer.analyze_financial_filing_pdf],
        show_tool_calls=True,
        tool_call_limit=5,
        reasoning=False,
        instructions=["您的任务是以指定的 JSON 格式获取财务分析"],
        stream=True,
        debug_mode=True,
        structured_outputs=False
    )
    return json_mode_agent
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*zkbt2JsOgDKsEsTYXUzyYA.png)



上述过程确保代理生成的整个响应被向量化并存储在 Qdrant 中。这种方法不仅促进了高级搜索和检索，还支持下游任务，如使用 RAG 进行相似性分析。将生成的内容集成到 Qdrant 的向量数据库中，简化了组织、分析和检索上下文及相关信息的过程。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*4FW2gWg60K4QwFt9UMXXKg.png)

## 结论：

总之，这种架构和工作流程展示了将 AI、自动化和向量化结合在一起处理金融文件的变革潜力。通过无缝集成 Phidata、n8n 和 Qdrant 等工具，该系统不仅简化了对复杂文件（如 SEC 10-K 报告）的分析，还确保提取的数据被结构化、存储并准备好进行高级检索。这一工作流程是朝着更智能、更高效的金融操作迈出的一步，使组织能够以精准和轻松的方式做出数据驱动的决策。随着金融数据在复杂性和数量上不断增长，像这样的解决方案为未来铺平了道路，使管理这些信息变得更快、可扩展且高度可访问。

