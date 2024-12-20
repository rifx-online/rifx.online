---
title: "使用 Ollama 构建代码分析助手：本地 LLM 分步指南"
meta_title: "使用 Ollama 构建代码分析助手：本地 LLM 分步指南"
description: "本指南介绍了如何使用Ollama和ClientAI构建一个本地运行的代码分析助手。该助手能够分析Python代码的结构、识别潜在问题、生成文档建议并提供改进建议。文章详细描述了环境设置、核心分析引擎的构建、风格检查和文档生成的实现，并为后续的AI助手构建和命令行接口开发做了铺垫。所有功能均在本地运行，确保代码的隐私和安全。"
date: 2024-12-19T21:25:56Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*j3Y6jmW-Nz8jwL7v_awg2g.png"
categories: ["Programming", "Generative AI", "Chatbots"]
author: "Rifx.Online"
tags: ["ClientAI", "Ollama", "Python", "code-analysis", "privacy"]
draft: False

---





想要一个完全在本地机器上运行的 AI 驱动代码审查工具吗？在这个两部分的教程中，我们将使用 [ClientAI](https://igorbenav.github.io/clientai/?utm_source=medium&utm_medium=article&utm_campaign=launch) 和 Ollama 来构建这样一个助手。

我们的助手将分析 Python 代码结构，识别潜在问题，并提出改进建议——同时保持您的代码私密和安全。

有关 ClientAI 的文档 [请点击这里](https://igorbenav.github.io/clientai/?utm_source=medium&utm_medium=article&utm_campaign=launch)，Github 仓库 [请点击这里](https://github.com/igorbenav/clientai)。

以下是本系列文章的索引：

* **第 1 部分：介绍、设置、工具创建（您在这里）**
* [第 2 部分：构建助手和命令行接口](https://readmedium.com/building-a-code-analysis-assistant-with-ollama-a-step-by-step-guide-to-local-llms-part-2-0b66ae457d0e)

让我们开始吧！

### 项目概述

我们的代码分析助手将能够：

* 分析代码结构和复杂性
* 识别样式问题和潜在问题
* 生成文档建议
* 提供可行的改进建议

所有这些功能将在您的机器上本地运行，让您在保持代码完全隐私的同时，享受AI辅助的代码审查能力。

### 设置我们的环境

首先，为您的项目创建一个新目录：

```python
mkdir local_task_planner
cd local_task_planner
```
安装支持Ollama的ClientAI：

```python
pip install clientai[ollama]
```
确保您的系统上已安装Ollama。您可以从 [Ollama的网站](https://ollama.ai) 获取它。

现在让我们创建一个文件，用于编写代码：

```python
touch code_analyzer.py
```
并开始我们的核心导入：

```python
import ast
import json
import logging
import re
from dataclasses import dataclass
from typing import List

from clientai import ClientAI
from clientai.agent import (
  Agent,
  ToolConfig,
  act,
  observe,
  run,
  synthesize,
  think,
)
from clientai.ollama import OllamaManager, OllamaServerConfig
```
这些组件各自发挥着至关重要的作用：

* **ast**: 通过将Python代码解析为树结构，帮助我们理解代码
* **ClientAI**: 提供我们的AI框架
* 各种用于数据处理和模式匹配的实用模块

### 结构化我们的分析结果

在分析代码时，我们需要一种清晰的方式来组织我们的发现。以下是我们将如何结构化我们的结果：


```python
@dataclass
class CodeAnalysisResult:
  """Results from code analysis."""
  complexity: int
  functions: List[str]
  classes: List[str]
  imports: List[str]
  issues: List[str]
```
可以将其视为我们代码分析的成绩单：

* 复杂度评分表示代码的复杂程度
* 函数和类的列表帮助我们理解代码结构
* 导入显示外部依赖
* 问题跟踪我们发现的任何问题

### 构建核心分析引擎

现在进入实际核心——让我们构建我们的代码分析引擎：

```python
def analyze_python_code_original(code: str) -> CodeAnalysisResult:
    """Analyze Python code structure and complexity."""
    try:
        tree = ast.parse(code)
        functions = []
        classes = []
        imports = []
        complexity = 0
        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                functions.append(node.name)
                complexity += sum(
                    1
                    for _ in ast.walk(node)
                    if isinstance(_, (ast.If, ast.For, ast.While))
                )
            elif isinstance(node, ast.ClassDef):
                classes.append(node.name)
            elif isinstance(node, (ast.Import, ast.ImportFrom)):
                for name in node.names:
                    imports.append(name.name)

        return CodeAnalysisResult(
            complexity=complexity,
            functions=functions,
            classes=classes,
            imports=imports,
            issues=[],
        )
    except Exception as e:
        return CodeAnalysisResult(
            complexity=0,
            functions=[],
            classes=[],
            imports=[],
            issues=[str(e)]
        )
```
这个函数就像我们的代码侦探。它：

1. 将代码解析为树结构
2. 遍历树寻找函数、类和导入
3. 通过计算控制结构来评估复杂性
4. 返回全面的分析结果

### 实现风格检查

优质代码不仅要正确运行，还应具备可读性和可维护性。以下是我们的风格检查器：

```python
def check_style_issues_original(code: str) -> List[str]:
    """Check for Python code style issues."""
    issues = []
    for i, line in enumerate(code.split("\n"), 1):
        if len(line.strip()) > 88:
            issues.append(f"Line {i} exceeds 88 characters")
    function_pattern = r"def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\("
    for match in re.finditer(function_pattern, code):
        name = match.group(1)
        if not name.islower():
            issues.append(f"Function '{name}' should use snake_case")
    return issues
```
我们的风格检查器关注两个关键方面：

1. 行长度 — 确保代码保持可读性
2. 函数命名约定 — 强制使用Python推荐的snake\_case风格

### 文档助手

文档对于可维护的代码至关重要。以下是我们的文档生成器：

```python
def generate_docstring(code: str) -> str:
    """Generate docstring for Python code."""
    try:
        tree = ast.parse(code)
        for node in ast.walk(tree):
            if isinstance(node, (ast.FunctionDef, ast.ClassDef)):
                args = []
                if isinstance(node, ast.FunctionDef):
                    args = [a.arg for a in node.args.args]
                return f"""
                Suggested docstring for {node.name}:
                Args:
                {chr(4).join(f"{arg}: Description of {arg}" for arg in args)}
                Returns:
                    Description of return value
                Examples:
                    ```python
                    # Example usage of {node.name}
                    ```
                """
        return "No functions or classes found to document."
    except Exception as e:
        return f"Error generating docstring: {str(e)}"
```
该助手：

* 识别函数和类
* 提取参数信息
* 生成文档模板
* 包含示例的占位符

### 使我们的工具具备 AI 准备性

为了使我们的工具能够与 AI 系统集成，我们需要将它们封装为 JSON 友好的格式：

```python
def analyze_python_code(code: str) -> str:
    """Wrap analyze_python_code_original to return JSON string."""
    if not code:
        return json.dumps({"error": "No code provided"})
    result = analyze_python_code_original(code)
    return json.dumps({
        "complexity": result.complexity,
        "functions": result.functions,
        "classes": result.classes,
        "imports": result.imports,
        "issues": result.issues,
    })

def check_style_issues(code: str) -> str:
    """Wrap check_style_issues_original to return JSON string."""
    if not code:
        return json.dumps({"error": "No code provided"})
    issues = check_style_issues_original(code)
    return json.dumps({"issues": issues})
```
这些包装器增加了输入验证、JSON 序列化和错误处理，使我们的助手更加防错。

### Part 2 的内容预告

在这篇文章中，我们设置了环境，整理了结果，并构建了我们将作为工具使用的函数。在下一部分，我们将实际创建我们的 AI 助手，注册这些工具，构建命令行界面，并看到这个助手的实际运作。

您的下一步是 [Part 2: Building the Assistant and Command Line Interface.](https://readmedium.com/building-a-code-analysis-assistant-with-ollama-a-step-by-step-guide-to-local-llms-part-2-0b66ae457d0e)

要了解更多关于 ClientAI 的信息，请访问 [the docs](https://igorbenav.github.io/clientai/?utm_source=medium&utm_medium=article&utm_campaign=launch).

## 联系我

如果您有任何问题，想讨论与技术相关的话题，或分享您的反馈，请随时通过社交媒体与我联系：

* **GitHub:** [igorbenav](https://github.com/igorbenav)
* **X/Twitter:** [igorbenav](http://x.com/igorbenav)
* **LinkedIn:** [Igor](https://www.linkedin.com/in/igor-magalhaes-r/)

