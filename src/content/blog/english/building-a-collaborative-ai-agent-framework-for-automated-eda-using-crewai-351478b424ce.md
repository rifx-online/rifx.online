---
title: "Building a Collaborative AI Agent Framework for Automated EDA using CrewAI"
meta_title: "Building a Collaborative AI Agent Framework for Automated EDA using CrewAI"
description: "The article discusses the development of a collaborative AI agent framework, CrewAI, aimed at automating Exploratory Data Analysis (EDA). The framework comprises two main agents: a Business Consultant agent that generates insightful questions based on dataset metadata, and a Data Scientist agent that creates and executes Python code to answer those questions, summarizing findings in a markdown report. This automation enhances efficiency, consistency, and allows data scientists to focus on more complex tasks, thereby revolutionizing data analysis in various business contexts."
date: 2024-12-07T12:34:13Z
image: ""
categories: ["Data Science", "Programming", "Automation"]
author: "Rifx.Online"
tags: ["CrewAI", "EDA", "automation", "Python", "markdown"]
draft: False

---





## Introduction: A New Era of Data Exploration

In today’s data\-driven world, businesses are continuously seeking ways to extract actionable insights from vast datasets. Traditionally, this task has been the domain of skilled data scientists, who spend considerable time exploring and analyzing data. But what if we could automate this process? What if an AI\-driven system could ask insightful questions about the data, analyze it thoroughly, and present a detailed report — all with minimal human intervention? This is precisely what our project aims to achieve by leveraging the CrewAI agent framework.


## Context of the Project

The project revolves around automating the Exploratory Data Analysis (EDA) process using AI agents. The primary goal is to create a system that can take a dataset along with its metadata, generate insightful questions, and then answer these questions using a data analysis agent. The final product is a comprehensive EDA report in markdown format, ready to be shared with stakeholders or further refined by data professionals.


## Why Automate EDA?

EDA is a critical step in data science, allowing analysts to understand the structure, patterns, and relationships within a dataset before applying more advanced techniques. However, EDA can be time\-consuming and repetitive, especially when dealing with large datasets. Automating this process not only saves time but also ensures consistency and thoroughness, enabling data scientists to focus on more complex tasks.


## Project Overview


## The CrewAI Framework

The project is built on the CrewAI framework, which allows for the creation of collaborative AI agents. In this context, the framework facilitates the coordination of two key types of agents:

1. **Business Consultant Agent**: This agent is responsible for generating insightful questions about the dataset. It examines the metadata and determines what aspects of the data warrant further exploration.
2. **Data Scientist Agent**: Once the questions are generated, the Data Scientist agent takes over. This agent generates Python code to answer each question, executes the code, interprets the results, and summarizes the findings in a markdown format.


## How It Works

The process can be broken down into the following steps:

1. **Metadata Analysis and Question Generation**: The Business Consultant agent analyzes the dataset metadata and generates a series of questions designed to probe deeper into the data. These questions might involve investigating the distribution of a particular variable, examining correlations between variables, or testing a hypothesis.
2. **Automated Code Generation and Execution**: For each question, the Data Scientist agent generates the necessary Python code to perform the required analysis. This could involve creating visualizations, conducting statistical tests, or applying machine learning models. The code is then executed, and the outputs — such as plots and statistical summaries — are captured.
3. **Result Summarization**: The results of the analysis are compiled into a markdown report. This report includes the original questions, the Python code used, the outputs generated, and a summary of the findings.


## Defining the Agents


### Business Consultant Agent

The Business Consultant agent is tasked with generating meaningful and relevant questions about the dataset. These questions are crucial as they guide the subsequent analysis. The agent is defined in the YAML configuration file as follows.


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
This configuration outlines the agent’s role, goals, and the parameters it uses to generate questions. The agent leverages a language model (e.g., GPT\-4\) to interpret the metadata and formulate questions that can be explored through statistical analysis or visualization.


### Data Scientist Agent

The Data Scientist agent’s role is to answer the questions generated by the Business Consultant agent. It does this by writing and executing Python code. The agent is also defined in the YAML configuration file:


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
This agent uses well\-known Python libraries such as Pandas, NumPy, Matplotlib, and Seaborn to conduct the analysis. The code generated by this agent is not only functional but also designed to be clear, efficient, and well\-documented, ensuring that the analysis can be easily understood and replicated.


## Implementing the Crews

To bring these agents to life, we implement two key components: `QuestCrew` and `EDACrew`.


### QuestCrew

`QuestCrew` is responsible for coordinating the Business Consultant agent. It initializes the agent, provides it with the necessary metadata, and captures the questions generated. Here’s a glimpse of what this looks like:


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
  """Creates the Llmeda crew"""
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

`EDACrew` handles the Data Scientist agent, which performs the actual data analysis. After receiving the questions from `QuestCrew`, it generates and executes the Python code to answer each question, and then compiles the results into a markdown report


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

## Main Execution Flow

The main script orchestrates the entire process. It starts by reading the dataset metadata and initializing the agent operations. The `QuestCrew` is run first to generate the questions, followed by `EDACrew`, which performs the analysis. Finally, the results are consolidated into a markdown report.


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

    print(f"Current working directory: {os.getcwd()}")

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

    print(f"Metadata file location: {metadata_txt}")
    print(f"Datapath location: {datapath}")
    print(f"Plots location: {imagepath}")   

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

    agentops.end_session("Success")

    if qresult is not None:        
        print(f"Raw result from crew.kickoff: {qresult.raw}")
    
    qlist = qresult.pydantic
    for q in qlist.questions:
        print(f"Question: {q}")            

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

    agentops.end_session("Success")

    # Consolidating the writing to a file. 
    try:
        with open("final_analysis.md", 'w') as file:
            file.write("# Exploratory Data Analysis" + '\n\n')
            file.write("## Dataset Description" + '\n\n')
            file.write(metadata_txt + '\n\n')
            for i, mdc in enumerate(final_results):
                file.write(f"## EDA Analysis - {i+1}" + '\n\n')
                print(mdc.raw)
                file.write(mdc.raw + '\n\n')
                file.write(generate_markdown_for_images(f"{imagepath}/q_{i}") +"\n\n")
        print(f"Successfully wrote to final_analysis.md")
    except IOError as e:
        print(f"An error occurred while writing to the file: {e}")

    agentops.end_session("Success")
```

## Generating the Markdown Report

The final step involves consolidating all the analyses into a markdown file. This report includes the dataset description, each question posed by the Business Consultant agent, the code used to answer it, and the resulting analysis.

Here is an example of generated EDA report.


```python
## Exploratory Data Analysis

### Dataset Description

A retrospective sample of males in a heart-disease high-risk region of the Western Cape, South Africa. There are roughly two controls per case of CHD. Many of the CHD positive men have undergone blood pressure reduction treatment and other programs to reduce their risk factors after their CHD event. In some cases the measurements were made after these treatments. These data are taken from a larger dataset, described in Rousseauw et al, 1983, South African Medical Journal.

Column names and their description:

sbp - systolic blood pressure
tobacco - cumulative tobacco (kg)
ldl - low densiity lipoprotein cholesterol
adiposity - https://en.m.wikipedia.org/wiki/Body_adiposity_index
famhist - family history of heart disease (Present, Absent)
typea - type-A behavior
obesity - https://en.wikipedia.org/wiki/Obesity
alcohol - current alcohol consumption
age - age at onset
chd - response, coronary heart disease


### EDA Analysis - 1

#### Question
How does the distribution of systolic blood pressure (sbp) differ between individuals with and without coronary heart disease (chd), and what does this suggest about the relationship between blood pressure and heart disease risk in this population?

#### Code
```python
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from scipy.stats import ttest_ind

## Load the dataset
dataset_url = 'https://raw.githubusercontent.com/manaranjanp/MLIntroV1/main/Classification/SAheart.data'
data = pd.read_csv(dataset_url)

## Plot the distribution of systolic blood pressure for individuals with and without CHD
plt.figure(figsize=(10, 6))
sns.histplot(data[data['chd'] == 1]['sbp'], color='red', label='CHD', kde=True, stat='density', bins=30)
sns.histplot(data[data['chd'] == 0]['sbp'], color='blue', label='No CHD', kde=True, stat='density', bins=30)
plt.title('Distribution of Systolic Blood Pressure by CHD Status')
plt.xlabel('Systolic Blood Pressure')
plt.ylabel('Density')
plt.legend()
plt.savefig('/Users/manaranjanp/Documents/Work/MyLearnings/fastHTML/llmeda/q_0/sbp_distribution.png')
plt.show()

## Perform a t-test to compare the means of the two groups
chd_sbp = data[data['chd'] == 1]['sbp']
no_chd_sbp = data[data['chd'] == 0]['sbp']
t_stat, p_value = ttest_ind(chd_sbp, no_chd_sbp)

## Print the results of the t-test
print(f'T-test statistic: {t_stat}')
print(f'P-value: {p_value}')
```

#### Code Output
```
T-test statistic: 4.204044124452311
P-value: 3.1515993239517745e-05
```

#### Analysis
The analysis shows a significant difference in the distribution of systolic blood pressure (sbp) between individuals with and without coronary heart disease (CHD). The t-test statistic is 4.204, and the p-value is approximately 3.15e-05, which is much less than the conventional alpha level of 0.05. This indicates that the difference in systolic blood pressure between the two groups is statistically significant. The histogram plot further illustrates that individuals with CHD tend to have higher systolic blood pressure compared to those without CHD. This suggests that higher systolic blood pressure is associated with an increased risk of coronary heart disease in this population.

#### Plots 

![sbp_distribution.png](/Users/manaranjanp/Documents/Work/MyLearnings/fastHTML/llmeda-12Sept/demo/q_0/sbp_distribution.png)



### EDA Analysis - 2

#### Question
Is there a significant correlation between cumulative tobacco consumption (tobacco) and low-density lipoprotein cholesterol (ldl) levels, and how might this relationship impact the risk of developing coronary heart disease in this high-risk region?

#### Code
```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy.stats import pearsonr
import statsmodels.api as sm

## Load the dataset
dataset_url = 'https://raw.githubusercontent.com/manaranjanp/MLIntroV1/main/Classification/SAheart.data'
data = pd.read_csv(dataset_url)

## Display the first few rows of the dataset
data.head()

## Check correlation between tobacco and ldl
correlation, p_value = pearsonr(data['tobacco'], data['ldl'])
print(f'Correlation between tobacco and ldl: {correlation}, with a p-value of {p_value}')

## Plotting the relationship between tobacco and ldl
plt.figure(figsize=(10, 6))
sns.scatterplot(x='tobacco', y='ldl', data=data)
plt.title('Scatter plot of Tobacco vs LDL')
plt.xlabel('Cumulative Tobacco (kg)')
plt.ylabel('LDL Cholesterol')
plt.savefig('/Users/manaranjanp/Documents/Work/MyLearnings/fastHTML/llmeda/q_1/tobacco_ldl_correlation.png')
plt.show()

## Logistic regression to see the impact on CHD
X = data[['tobacco', 'ldl']]
y = data['chd']
X = sm.add_constant(X)  # adding a constant

model = sm.Logit(y, X)
result = model.fit()
print(result.summary())
```

#### Code Output
```
Correlation between tobacco and ldl: 0.15890545800595818, with a p-value of 0.000607828617738955

Optimization terminated successfully.
         Current function value: 0.575236
         Iterations 5
                           Logit Regression Results                           
==============================================================================
Dep. Variable:                    chd   No. Observations:                  462
Model:                          Logit   Df Residuals:                      459
Method:                           MLE   Df Model:                            2
Date:                Thu, 05 Sep 2024   Pseudo R-squ.:                  0.1084
Time:                        17:55:51   Log-Likelihood:                -265.76
converged:                       True   LL-Null:                       -298.05
Covariance Type:            nonrobust   LLR p-value:                 9.427e-15
==============================================================================
                 coef    std err          z      P>|z|      [0.025      0.975]
------------------------------------------------------------------------------
const         -2.3305      0.293     -7.951      0.000      -2.905      -1.756
tobacco        0.1297      0.025      5.290      0.000       0.082       0.178
ldl            0.2447      0.053      4.607      0.000       0.141       0.349
==============================================================================
```

#### Analysis
The correlation analysis between cumulative tobacco consumption and low-density lipoprotein cholesterol levels shows a positive correlation of approximately 0.159, which is statistically significant with a p-value of 0.0006. This indicates a weak but significant positive relationship between tobacco use and LDL levels.

The logistic regression results suggest that both tobacco consumption and LDL levels are significant predictors of coronary heart disease (CHD) in this dataset. The coefficients for tobacco and LDL are both positive, indicating that higher levels of these variables are associated with an increased risk of CHD. Specifically, the logistic regression model shows that for each unit increase in tobacco consumption, the log odds of having CHD increase by approximately 0.13, and for each unit increase in LDL, the log odds increase by approximately 0.24.

Overall, while the correlation between tobacco and LDL is weak, both factors independently contribute to the risk of developing CHD in this high-risk region.

#### Plots 

![tobacco_ldl_correlation.png](/Users/manaranjanp/Documents/Work/MyLearnings/fastHTML/llmeda-12Sept/demo/q_1/tobacco_ldl_correlation.png)
```
Here is the link to the video, which goes through the detailed implementation of this ai agent.








## Summary: Revolutionising Data Analysis with AI

This project represents a significant step forward in automating the EDA process. By leveraging the power of AI agents, we can generate insightful questions, conduct thorough analyses, and produce comprehensive reports — all in a fraction of the time it would take a human. This framework is not only efficient but also highly adaptable, making it suitable for a wide range of data analysis tasks across various domains.

As businesses continue to grapple with ever\-growing datasets, solutions like this will become increasingly valuable. By automating routine analysis tasks, data scientists can focus on more strategic challenges, driving innovation and growth in their organisations. The future of data analysis is here, and it’s powered by AI.


