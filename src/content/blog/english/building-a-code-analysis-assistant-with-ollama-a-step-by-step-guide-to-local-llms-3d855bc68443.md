---
title: "Building a Code Analysis Assistant with Ollama: A Step-by-Step Guide to Local LLMs"
meta_title: "Building a Code Analysis Assistant with Ollama: A Step-by-Step Guide to Local LLMs"
description: "This article provides a comprehensive guide to creating a local AI-powered code analysis assistant using ClientAI and Ollama. The assistant will analyze Python code for structure, complexity, style issues, and documentation suggestions while ensuring code privacy. The tutorial outlines project setup, core analysis functions, style checking, and documentation generation. The first part concludes with preparations for integrating these tools into the AI system, with a follow-up post promised for building the assistant and command-line interface."
date: 2024-12-19T21:25:56Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*j3Y6jmW-Nz8jwL7v_awg2g.png"
categories: ["Programming", "Generative AI", "Chatbots"]
author: "Rifx.Online"
tags: ["ClientAI", "Ollama", "Python", "code-analysis", "privacy"]
draft: False

---






Ever wanted your own AI\-powered code reviewer that runs entirely on your local machine? In this two\-part tutorial, we’ll build exactly that using [ClientAI](https://igorbenav.github.io/clientai/?utm_source=medium&utm_medium=article&utm_campaign=launch) and Ollama.

Our assistant will analyze Python code structure, identify potential issues, and suggest improvements — all while keeping your code private and secure.

For ClientAI’s docs [see here](https://igorbenav.github.io/clientai/?utm_source=medium&utm_medium=article&utm_campaign=launch) and for Github Repo, [here](https://github.com/igorbenav/clientai).

Below is an index of the posts in this series:

* **Part 1: Introduction, Setup, Tool Creation (you are here)**
* [Part 2: Building the Assistant and Command Line Interface](https://readmedium.com/building-a-code-analysis-assistant-with-ollama-a-step-by-step-guide-to-local-llms-part-2-0b66ae457d0e)

Let’s dive in!


### Project Overview

Our code analysis assistant will be capable of:

* Analyzing code structure and complexity
* Identifying style issues and potential problems
* Generating documentation suggestions
* Providing actionable improvement recommendations

All of this will run locally on your machine, giving you the power of AI\-assisted code review while maintaining complete privacy of your code.


### Setting Up Our Environment

First, create a new directory for your project:


```python
mkdir local_task_planner
cd local_task_planner
```
Install ClientAI with Ollama support:


```python
pip install clientai[ollama]
```
Make sure you have Ollama installed on your system. You can get it from [Ollama’s website](https://ollama.ai).

Now let’s create the file we’ll write the code into:


```python
touch code_analyzer.py
```
And start with our core imports:


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
Each of these components plays a crucial role:

* **ast**: Helps us understand Python code by parsing it into a tree structure
* **ClientAI**: Provides our AI framework
* Various utility modules for data handling and pattern matching


### Structuring Our Analysis Results

When analyzing code, we need a clean way to organize our findings. Here’s how we’ll structure our results:


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
Think of this as our report card for code analysis:

* Complexity score indicates how intricate the code is
* Lists of functions and classes help us understand code structure
* Imports show external dependencies
* Issues track any problems we discover


### Building the Core Analysis Engine

Now for the actual core — let’s build our code analysis engine:


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
This function is like our code detective. It:

1. Parses code into a tree structure
2. Walks through the tree looking for functions, classes, and imports
3. Calculates complexity by counting control structures
4. Returns a comprehensive analysis result


### Implementing Style Checking

Good code isn’t just about working correctly — it should be readable and maintainable. Here’s our style checker:


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
Our style checker focuses on two key aspects:

1. Line length — ensuring code stays readable
2. Function naming conventions — enforcing Python’s preferred snake\_case style


### Documentation Helper

Documentation is crucial for maintainable code. Here’s our documentation generator:


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
This helper:

* Identifies functions and classes
* Extracts parameter information
* Generates documentation templates
* Includes placeholders for examples


### Making Our Tools AI\-Ready

To prepare our tools for integration with the AI system, we need to wrap them in JSON\-friendly formats:


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
These wrappers add input validation, JSON serialization and error handling to make our assistant more error proof.


### Coming Up in Part 2

In this post we set up our environment, structured our results, and built the functions we will use as tools for our Agent. In the next part, we’ll actually create our AI assistant, register these tools, build a command\-line interface and see this assistant in action.

Your next step is [Part 2: Building the Assistant and Command Line Interface.](https://readmedium.com/building-a-code-analysis-assistant-with-ollama-a-step-by-step-guide-to-local-llms-part-2-0b66ae457d0e)

To see more about ClientAI, go to [the docs](https://igorbenav.github.io/clientai/?utm_source=medium&utm_medium=article&utm_campaign=launch).


## Connect with Me

If you have any questions, want to discuss tech\-related topics, or share your feedback, feel free to reach out to me on social media:

* **GitHub:** [igorbenav](https://github.com/igorbenav)
* **X/Twitter:** [igorbenav](http://x.com/igorbenav)
* **LinkedIn:** [Igor](https://www.linkedin.com/in/igor-magalhaes-r/)

