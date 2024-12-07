---
title: "利用 CrewAI 为自动化 EDA 构建人工智能代理协作框架"
meta_title: "利用 CrewAI 为自动化 EDA 构建人工智能代理协作框架"
description: "本项目旨在通过CrewAI框架自动化探索性数据分析（EDA）过程，创建协作AI代理以生成深刻问题并执行数据分析。项目由商业顾问代理和数据科学家代理组成，前者负责生成问题，后者则生成并执行Python代码以回答这些问题。最终形成的markdown报告包含数据集描述、分析代码及其结果，为数据科学家节省时间并提升分析一致性。该自动化解决方案将对企业应对大数据挑战、促进创新和增长具有重要价值。"
date: 2024-12-07T12:34:13Z
image: ""
categories: ["Data Science", "Programming", "Automation"]
author: "Rifx.Online"
tags: ["CrewAI", "EDA", "automation", "Python", "markdown"]
draft: False

---



## 引言：数据探索的新纪元

在当今这个数据驱动的世界中，企业不断寻求从庞大的数据集中提取可操作的洞察。传统上，这项任务一直是熟练数据科学家的领域，他们花费大量时间探索和分析数据。但如果我们能够自动化这个过程呢？如果一个由人工智能驱动的系统能够对数据提出有见地的问题，彻底分析数据，并呈现详细报告——所有这些都只需最少的人为干预？这正是我们的项目旨在通过利用CrewAI代理框架来实现的目标。

## 项目背景

该项目围绕使用 AI 代理自动化探索性数据分析（EDA）过程。主要目标是创建一个系统，可以处理数据集及其元数据，生成有洞察力的问题，然后使用数据分析代理回答这些问题。最终产品是一个全面的 EDA 报告，采用 markdown 格式，准备与利益相关者共享或由数据专业人士进一步完善。

## 为什么要自动化EDA？

EDA是数据科学中的一个关键步骤，使分析师能够在应用更高级的技术之前理解数据集中的结构、模式和关系。然而，EDA可能会耗时且重复，特别是在处理大型数据集时。自动化这个过程不仅节省时间，还能确保一致性和全面性，使数据科学家能够专注于更复杂的任务。

## 项目概述

## CrewAI框架

该项目建立在CrewAI框架之上，该框架允许创建协作AI代理。在这个上下文中，框架促进了两种关键类型代理的协调：

1. **商业顾问代理**：该代理负责生成关于数据集的深刻问题。它检查元数据并确定数据的哪些方面值得进一步探索。
2. **数据科学家代理**：一旦生成问题，数据科学家代理就会接管。该代理生成Python代码以回答每个问题，执行代码，解释结果，并以markdown格式总结发现。

## 工作原理

该过程可以分为以下步骤：

1. **元数据分析和问题生成**：业务顾问代理分析数据集的元数据，并生成一系列旨在深入探讨数据的问题。这些问题可能涉及调查特定变量的分布、检查变量之间的相关性或检验假设。
2. **自动化代码生成和执行**：对于每个问题，数据科学家代理生成执行所需分析的必要Python代码。这可能涉及创建可视化、进行统计测试或应用机器学习模型。然后执行代码，并捕获输出，例如图表和统计摘要。
3. **结果总结**：分析结果汇编成一个markdown报告。该报告包括原始问题、使用的Python代码、生成的输出以及发现的总结。

## 定义代理人

### 商业顾问代理

商业顾问代理的任务是生成与数据集相关的有意义和相关的问题。这些问题至关重要，因为它们指导后续的分析。代理在YAML配置文件中的定义如下。

```python
business_consultant:
  role: >
    Business Consultant
  goal: >
    Generate insightful business questions based on the data and metadata. 
  backstory: >
    You are an experienced business consultant skilled at asking great questions based on the data and metadata..
  llm: llm_model    
```

```python
generate_questions_task:
  description: >
    Below is the description of a dataset containng the context and the description of data elements.
    - Based on your understanding of the metadata, generate {how_many} questions which woul give deeper insights into the domain the data represents. 
    - Questions should be about specific variables and based on univariate or bivariate analysis.
    - The insights should be based on some of the basic statistical anlaysis like histogram, correlation analysis, hypothesis tests, bar plots, distribution or outlier analysis etc.

    <metadata>
      {metadata_info}
    </metadata>
  expected_output: >   
    A list of question as specified by schema.
  agent: business_consultant
```
该配置概述了代理的角色、目标以及用于生成问题的参数。代理利用语言模型（例如，GPT\-4\）来解释元数据并制定可以通过统计分析或可视化进行探索的问题。

### 数据科学家代理

数据科学家代理的角色是回答业务顾问代理生成的问题。它通过编写和执行 Python 代码来实现。该代理也在 YAML 配置文件中定义：

```python
data_scientist:
  role: >
    Data Scientist
  goal: >
    Generate code to answer the question,  execute the code, interpret and summarize the results.
  backstory: >
    You are a skilled data scientist proficient in exploratory data analysis, statistics, machine learning.
  llm: llm_model    
```

```python
datascience_task:
  description: >
    You are tasked with generating the Python code, executing and summarizing to answer the question given a dataset. 
    You are given the following information:

    - Dataset description: <dataset_description> {metadata_info} </dataset_description>
    - Question: <question> {question_str} </question>

    Steps to Follow:

    1. Must follow the guidelines below strictly to generate the code.
      - The code should use pandas, numpy, matplotlib, seaborn, statsmodel and scikit-learn libraries.
      - Include the above libraries and any other library that may be required.
      - Load the dataset from the dataset_location given below: 
        <dataset_location>
          {datapath_info} 
        </dataset_location>  
      - Assuming the data is already clean (skip data preparation)
      - Use statistical tests and plots to answer the questions.
      - Do not do summary statistics on all the variables.
      - Focus only on the question in hand and use variables that are necessary for the analysis.
      - Must print all intermediate results and final results on the console.
      - The plot must be saved in png format at the below directory. Add plt.savefig() with the location below after the plots is created.  
        <imagepath> 
          {imagepath_dir} 
        </imagepath>
      - Ensure the code is clear, efficient, and well-commented.

    2. The generated code satisfies the following conditions. If answer to any of the following is no, then the code generated in invalid.
      - Is dataset loaded from the <dataset_location> specified above ?
      - Is the code only use relevant variables in the dataframe for analysis that are necessary to answer the question?
      - Is atleast one plot generated?
      - Is the code saving the plot only in the <imagepath> directory mentioned above?
      - Are the results or outputs of printed to the console?

    3. Execute the code using the appropriate tool
    3. Collect all output 
    4. Interpret and summarize the results from statistical tests and plots in outputs       
      
  agent: data_scientist
  expected_output: >
    Summary or conclusion from the results or plots. 
    The output should be in MARKDOWN format and must contain the following sections. It should start with question header as below. 
    ### Question
       - question
    ### Code
      - The code provided in the context as it is, without any changes. Embed the code in fenced code blocks?
    ### Code Output
      Outputs from code execution
    ### Analysis
      Inference and summarization of the code outputs
```
该代理使用众所周知的 Python 库，如 Pandas、NumPy、Matplotlib 和 Seaborn 来进行分析。该代理生成的代码不仅功能齐全，而且设计清晰、高效，并且有良好的文档，确保分析易于理解和复制。

## 实现团队

为了使这些代理生动起来，我们实现了两个关键组件：`QuestCrew` 和 `EDACrew`。

### QuestCrew

`QuestCrew` 负责协调业务顾问代理。它初始化代理，提供必要的元数据，并捕获生成的问题。以下是其工作原理的简要概述：

```python
class QuestionList(BaseModel):
    questions: List[str]


pyrepltool = PythonREPL()

@CrewBase
class QuestCrew():
 """Quest crew"""
 agents_config = 'config/quest/agents.yaml'
 tasks_config = 'config/quest/tasks.yaml'

 @llm
 def llm_model(self):
  return ChatOpenAI(temperature=0.0,  # Set to 0 for deterministic output
                    model="gpt-4o-2024-08-06",  # Using the GPT-4 Turbo model
                    max_tokens=8000) 
 
 @agent
 def business_consultant(self) -> Agent:
  return Agent(
   config=self.agents_config['business_consultant'],
   max_rpm=None,
   verbose=True
  )

 @task
 def generate_questions_task(self) -> Task:
  return Task(
   config=self.tasks_config['generate_questions_task'],
   output_pydantic = QuestionList
  )

 @crew
 def crew(self) -> Crew:
  """创建 Llmeda 队伍"""
  question_crew = Crew(
   agents=self.agents,
   tasks=self.tasks, # Automatically created by the @task decorator
   process=Process.sequential,
   verbose=True,
   output_log_file = "qgen.log"
   # process=Process.hierarchical, # In case you wanna use that instead https://docs.crewai.com/how-to/Hierarchical/
  )
  
  return question_crew
```

### EDACrew

`EDACrew` 处理数据科学家代理，它执行实际的数据分析。在接收到来自 `QuestCrew` 的问题后，它生成并执行 Python 代码来回答每个问题，然后将结果编译成 markdown 报告。

```python
@CrewBase
class EDACrew():
 """EDA crew"""
 agents_config = 'config/eda/agents.yaml'
 tasks_config = 'config/eda/tasks.yaml'

 @llm
 def llm_model(self):
  return ChatOpenAI(temperature=0.0,  # Set to 0 for deterministic output
                    model="gpt-4o-2024-08-06",  # Using the GPT-4 Turbo model
                    max_tokens=8000) 
 
  #return ChatAnthropic(temperature=0.2, model='claude-3-5-sonnet-20240620')

  # return ChatGoogleGenerativeAI(
  #   model="gemini-1.5-flash",
  #   temperature=0,
  #   max_tokens=4096,
  #   max_retries=2)
 
  return ChatGroq(
   model="llama3.1-70b-versatile",
   temperature=0.0,
   max_retries=2,
  ) 

 @agent
 def data_scientist(self) -> Agent:
  return Agent(
   config=self.agents_config['data_scientist'],
   verbose=True
  )
 
 @task
 def datascience_task(self) -> Task:
  return Task(
   config=self.tasks_config['datascience_task'],
   tools=[pyrepl_tool]
  )
 
 @crew
 def crew(self) -> Crew:
  """Creates the Llmeda crew"""
  eda_crew = Crew(
   agents=self.agents,
   tasks=self.tasks, # Automatically created by the @task decorator
   process=Process.sequential,
   verbose=True,
   output_log_file = "eda.log"
   # process=Process.hierarchical, # In case you wanna use that instead https://docs.crewai.com/how-to/Hierarchical/
  )
  
  return eda_crew
```

## 主要执行流程

主脚本协调整个过程。它首先读取数据集元数据并初始化代理操作。首先运行 `QuestCrew` 以生成问题，然后运行 `EDACrew` 进行分析。最后，结果被汇总到一个 markdown 报告中。

```python
def read_file(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
    return content

def generate_markdown_for_images(directory):
    # Get list of PNG files in the directory
    images = [img for img in os.listdir(directory) if img.endswith('.png')]

    # Start the markdown section
    markdown_content = "### Plots \n\n"

    # Loop through each image and generate markdown
    for img in images:
        image_path = os.path.join(directory, img)
        markdown_content += f"![{img}]({image_path})\n\n"

    return markdown_content

def run():
    """
    Run the crew.
    """

    print(f"当前工作目录: {os.getcwd()}")

    # Initilize the agentops for tracing of communication with LLMs
    agentops.init(auto_start_session=False)

    # Read the YAML config file
    with open('config.yaml', 'r') as f:
        config = yaml.safe_load(f)    # Read the config file

    # Reading configuarations
    metadata_txt = read_file(config['app']['Metadata'])
    datapath = config['app']['DataPath']
    imagepath = config['app']['ImagePath']
    num_questions = config['app']['NumOfQuestions']

    print(f"元数据文件位置: {metadata_txt}")
    print(f"数据路径位置: {datapath}")
    print(f"图像位置: {imagepath}")   

    # To store analysis for each questions.
    md_content = []
    
    agentops.start_session( tags = ['question', 'hypothesis'] )

    # Creating hypothesis or generating questions using QuestCrew
    q_inputs = {
        'how_many': int(num_questions),
        'metadata_info': metadata_txt,
    }

    # Run the agent
    qresult = QuestCrew().crew().kickoff(inputs=q_inputs)

    agentops.end_session("成功")

    if qresult is not None:        
        print(f"来自 crew.kickoff 的原始结果: {qresult.raw}")
    
    qlist = qresult.pydantic
    for q in qlist.questions:
        print(f"问题: {q}")            

    # Create the directories for storing the created plots
    for i in range(len(qlist.questions)):
        os.makedirs(f"{imagepath}/q_{i}", exist_ok=True)   

    # Creating the EDACrews for generate code and answer those questions
    # Also to summarize the questions
    
    eda_inputs_list = [{
        'question_str': q,
        'metadata_info': metadata_txt,
        'datapath_info': datapath,
        'imagepath_dir': f"{imagepath}/q_{i}"} for i, q in enumerate(qlist.questions)]

    agentops.start_session(tags = ['answer', 'analysis'])

    # Run the agent
    final_results = EDACrew().crew().kickoff_for_each(inputs = eda_inputs_list)

    agentops.end_session("成功")

    # Consolidating the writing to a file. 
    try:
        with open("final_analysis.md", 'w') as file:
            file.write("# 探索性数据分析" + '\n\n')
            file.write("## 数据集描述" + '\n\n')
            file.write(metadata_txt + '\n\n')
            for i, mdc in enumerate(final_results):
                file.write(f"## EDA 分析 - {i+1}" + '\n\n')
                print(mdc.raw)
                file.write(mdc.raw + '\n\n')
                file.write(generate_markdown_for_images(f"{imagepath}/q_{i}") +"\n\n")
        print(f"成功写入 final_analysis.md")
    except IOError as e:
        print(f"写入文件时发生错误: {e}")

    agentops.end_session("成功")
```

## 生成Markdown报告

最后一步是将所有分析整合到一个markdown文件中。该报告包括数据集描述、商务顾问代理提出的每个问题、用于回答问题的代码以及结果分析。

以下是生成的EDA报告示例。

```python
## Exploratory Data Analysis

### Dataset Description

南非西开普省一个心脏病高风险地区的男性回顾性样本。每个冠心病案例大约有两个对照组。许多冠心病阳性男性在冠心病事件后接受了降血压治疗和其他减少风险因素的项目。在某些情况下，测量是在这些治疗之后进行的。这些数据来自一个更大的数据集，详见Rousseauw等人，1983年，南非医学杂志。

列名及其描述：

sbp - 收缩压
tobacco - 累积烟草（千克）
ldl - 低密度脂蛋白胆固醇
adiposity - https://en.m.wikipedia.org/wiki/Body_adiposity_index
famhist - 家族心脏病史（存在，缺失）
typea - A型行为
obesity - https://en.wikipedia.org/wiki/Obesity
alcohol - 当前酒精消费
age - 发病年龄
chd - 响应，冠心病


### EDA Analysis - 1

#### Question
收缩压（sbp）在有冠心病（chd）和没有冠心病的个体之间的分布有什么不同，这对该人群的血压与心脏病风险之间的关系有什么启示？

#### Code
```python
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from scipy.stats import ttest_ind

## 加载数据集
dataset_url = 'https://raw.githubusercontent.com/manaranjanp/MLIntroV1/main/Classification/SAheart.data'
data = pd.read_csv(dataset_url)

## 绘制有冠心病（CHD）和无冠心病（No CHD）个体的收缩压分布
plt.figure(figsize=(10, 6))
sns.histplot(data[data['chd'] == 1]['sbp'], color='red', label='CHD', kde=True, stat='density', bins=30)
sns.histplot(data[data['chd'] == 0]['sbp'], color='blue', label='No CHD', kde=True, stat='density', bins=30)
plt.title('按冠心病状态的收缩压分布')
plt.xlabel('收缩压')
plt.ylabel('密度')
plt.legend()
plt.savefig('/Users/manaranjanp/Documents/Work/MyLearnings/fastHTML/llmeda/q_0/sbp_distribution.png')
plt.show()

## 执行 t 检验以比较两个组的均值
chd_sbp = data[data['chd'] == 1]['sbp']
no_chd_sbp = data[data['chd'] == 0]['sbp']
t_stat, p_value = ttest_ind(chd_sbp, no_chd_sbp)

## 打印 t 检验的结果
print(f'T-test statistic: {t_stat}')
print(f'P-value: {p_value}')
```

#### 代码输出
```
T-test statistic: 4.204044124452311
P-value: 3.1515993239517745e-05
```

#### 分析
分析显示，患有冠心病（CHD）和未患有冠心病的个体之间收缩压（sbp）的分布存在显著差异。t 检验统计量为 4.204，p 值约为 3.15e-05，远低于传统的显著性水平 0.05。这表明两组之间的收缩压差异在统计上是显著的。直方图进一步说明，患有冠心病的个体相比于未患有冠心病的个体，往往具有更高的收缩压。这表明在该人群中，较高的收缩压与增加的冠心病风险相关。

#### 图表 

![sbp_distribution.png](/Users/manaranjanp/Documents/Work/MyLearnings/fastHTML/llmeda-12Sept/demo/q_0/sbp_distribution.png)



### EDA 分析 - 2

#### 问题
累积烟草消费（tobacco）与低密度脂蛋白胆固醇（ldl）水平之间是否存在显著相关性，这种关系可能如何影响在该高风险地区发展冠心病的风险？

#### 代码
```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy.stats import pearsonr
import statsmodels.api as sm

## 加载数据集
dataset_url = 'https://raw.githubusercontent.com/manaranjanp/MLIntroV1/main/Classification/SAheart.data'
data = pd.read_csv(dataset_url)

## 显示数据集的前几行
data.head()

## 检查烟草与 LDL 之间的相关性
correlation, p_value = pearsonr(data['tobacco'], data['ldl'])
print(f'烟草与 LDL 之间的相关性: {correlation}, p 值为 {p_value}')

## 绘制烟草与 LDL 之间的关系
plt.figure(figsize=(10, 6))
sns.scatterplot(x='tobacco', y='ldl', data=data)
plt.title('烟草与 LDL 的散点图')
plt.xlabel('累计烟草 (kg)')
plt.ylabel('LDL 胆固醇')
plt.savefig('/Users/manaranjanp/Documents/Work/MyLearnings/fastHTML/llmeda/q_1/tobacco_ldl_correlation.png')
plt.show()

## 逻辑回归分析对冠心病的影响
X = data[['tobacco', 'ldl']]
y = data['chd']
X = sm.add_constant(X)  # 添加常数项

model = sm.Logit(y, X)
result = model.fit()
print(result.summary())
```

#### 代码输出
```
吸烟与低密度脂蛋白胆固醇之间的相关性: 0.15890545800595818, p值为 0.000607828617738955

优化成功终止。
         当前函数值: 0.575236
         迭代次数 5
                           逻辑回归结果                           
==============================================================================
因变量:                    chd   观察数量:                  462
模型:                          Logit   自由度残差:                      459
方法:                           MLE   自由度模型:                            2
日期:                2024年9月5日   伪 R-squ.:                  0.1084
时间:                        17:55:51   对数似然:                -265.76
收敛:                       True   LL-Null:                       -298.05
协方差类型:            非稳健   LLR p值:                 9.427e-15
==============================================================================
                 coef    std err          z      P>|z|      [0.025      0.975]
------------------------------------------------------------------------------
const         -2.3305      0.293     -7.951      0.000      -2.905      -1.756
tobacco        0.1297      0.025      5.290      0.000       0.082       0.178
ldl            0.2447      0.053      4.607      0.000       0.141       0.349
==============================================================================
```

#### 分析
累积烟草消费与低密度脂蛋白胆固醇水平之间的相关性分析显示出大约 0.159 的正相关，且 p 值为 0.0006，具有统计显著性。这表明吸烟与 LDL 水平之间存在弱但显著的正相关关系。

逻辑回归结果表明，烟草消费和 LDL 水平在该数据集中都是冠心病 (CHD) 的显著预测因子。烟草和 LDL 的系数均为正值，表明这些变量的水平越高，冠心病的风险越大。具体来说，逻辑回归模型显示，烟草消费每增加一个单位，患冠心病的对数几率大约增加 0.13，而每增加一个单位的 LDL，对数几率大约增加 0.24。

总体而言，尽管烟草与 LDL 之间的相关性较弱，但这两个因素在这个高风险区域中对冠心病的发展风险有独立的贡献。

#### 图表 

![tobacco_ldl_correlation.png](/Users/manaranjanp/Documents/Work/MyLearnings/fastHTML/llmeda-12Sept/demo/q_1/tobacco_ldl_correlation.png)
```
这里是视频链接，详细讲解了这个 AI 代理的实现过程。

## 摘要：用AI革新数据分析

该项目代表了自动化EDA过程的一次重大进步。通过利用AI代理的力量，我们可以生成深刻的问题，进行全面的分析，并生成详尽的报告——这一切所需时间仅为人类所需时间的一小部分。这个框架不仅高效，而且高度适应性强，适合于各个领域的广泛数据分析任务。

随着企业继续应对不断增长的数据集，像这样的解决方案将变得越来越有价值。通过自动化常规分析任务，数据科学家可以专注于更具战略性的挑战，从而推动其组织的创新和增长。数据分析的未来已到来，而它是由AI驱动的。

