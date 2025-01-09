---
title: "GPT-4o Python Charting Insanity: Prompting For Instant Data Visuals"
meta_title: "GPT-4o Python Charting Insanity: Prompting For Instant Data Visuals"
description: "GPT-4o enhances data visualization by allowing users to upload CSV files and generate Python code for data cleaning and visualization. It simplifies the process of creating bar charts and choropleth maps, providing instant visual outputs without coding. Users can analyze datasets, such as UN population projections, and produce relevant charts for different years. While GPT-4o has improved capabilities, it still faces some limitations, such as reliance on matplotlib and occasional errors. Overall, it serves as a valuable tool for generating data visuals efficiently."
date: 2025-01-09T02:10:44Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*eeLfjLkhvFwBezRcURhNZw.png"
categories: ["Programming", "Data Science", "Technology/Web"]
author: "Rifx.Online"
tags: ["GPT-4o", "CSV", "visualization", "Python", "matplotlib"]
draft: False

---





### Hands\-on no\-code visuals from the UN population projection dataset



The automatic data visualization generation tools for ***GPT\-4o*** keep getting better and better.

You can upload multiple CSV (and XSLX) files and ask ***GPT\-4o*** to look at them and provide you with a list of the structure and data values in the file.

AND you can then prompt this LLM to create Python code to clean the data AND provide data visualizations of charts and maps.

This is incredibly useful. Let me show you how it works.


## Step 1: Load and Process the Data

For this exercise, we will be using a population projection dataset from the UN Department of Economic and Social Affairs website ([HERE)](https://population.un.org/wpp/downloads).

You can click on the “Probabilistic Projections”, “Population Percentage” and then “Population by Age — both sexes” . Visually, this is what you should see:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*7OwUfoh3tPztVkZp.png)

Downloading XLSX worksheets for probablistic population projections by age

The file downloads as an xlsx with multiple worksheets. I selected the “Median” worksheet, deleted the first 15 rows of descriptive information and exported this as a CSV called “***pp\_median\_country.csv”***

A recent article in the New York Times used this data set to highlight countries that are projected to have “aging” populations — putting a heavier strain on such things as national pension plans and medical care facilities.

The first step in any data analysis task is to load and process the data. Here, we’ll show how you can prompt GPT\-4o to perform this task.

First, we can click on the attachment icon and load the file to be used:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*JoxT06VOf0vVtjvo.png)

Next, we can prompt GPT\-4 to get the data ready for us.

**Prompt to GPT\-4o:** *Load the data from the* `pp_median_country.csv` *file. and filter the data to include only rows for individual countries, and convert the ‘65’ column to float for proper sorting.*

**GPT\-4o response:**

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*40rE3GRJe84YjGuk.png)

And if you click on “Show Work”, the resulting code:


```python
import pandas as pd

## Load the data
data_age = pd.read_csv('pp_median_country.csv')
## Filter data to include only rows for individual countries
data_age_countries = data_age[data_age['Type'] == 'Country/Area']
## Convert the '65' column to float for proper sorting
data_age_countries['65'] = data_age_countries['65'].astype(float)
```
Once our data frame is set up properly, we can use it to create bar charts, and maps!


## Step 2: Create Bar Charts

Next, we’ll create bar charts for the top 10 countries with the highest percentage of the population aged 65 or above for the years 2023 and 2050\.

**Prompt to GPT\-4o:** *Create and display a horizontal bar chart that shows the top 10 countries by percentage for the age group ‘65’ for the year 2023 (use the ‘Year’ column). Display using the color brewer “YlOrRd” theme.*

And the resulting bar chart, displayed in the GPT\-4o chat window:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*X8JABH2L92ShBxFY.png)

Clicking on “**\[\>\_]”** displays the Python code generated:


```python
import pandas as pd
import matplotlib.pyplot as plt

## Load the dataset
file_path = '/mnt/data/pp_median_country.csv'
data = pd.read_csv(file_path)
## Filter data for the year 2023
data_2023 = data[data['Year'] == 2023]
## Select relevant columns
top_countries_65 = data_2023[['Region, subregion, country or area *', '65+']].copy()
## Sort by '65+' percentage in descending order and select top 10 countries
top_10_65 = top_countries_65.sort_values(by='65+', ascending=False).head(10)
## Rename columns for clarity
top_10_65.columns = ['Country', 'Percentage_65+']
## Sorting data by 'Percentage_65+' in descending order for horizontal bar chart
top_10_65_sorted = top_10_65.sort_values(by='Percentage_65+', ascending=True)
## Plotting horizontal bar chart
plt.figure(figsize=(12, 8))
plt.barh(top_10_65_sorted['Country'], top_10_65_sorted['Percentage_65+'], color="#F46D43")  # Hex color from 'YlOrRd'
plt.title("Top 10 Countries by Percentage for Age Group '65+' in 2023")
plt.xlabel("Percentage (65+)")
plt.ylabel("Country")
plt.tight_layout()
plt.show()
```
GPT\-4o has really improved in its ability to generate charts on the fly. Pretty slick

And then we can prompt GPT\-4o for the same chart, but for 2050\. And I want the Title to be a bit more accurate:

**Prompt to GPT\-4o:** *OK, great, now can you please create the same bar chart but for the year 2050? And change the title to show that this is for people “65 and olde*r”.

And the result:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*ej0hCc3XZLMzXEWZ.png)

Again, no issues with GPT\-4o. Now if I click **\[\>\_]** the code snippet is complete — and working.

Yes, super cool. But you want something even cooler (or MORE cool)? How about some on\-the\-fly mapping?


## Step 3: Create Choropleth Maps

We can do EVEN MORE with this super\-duper LLM tool. Let’s create choropleth maps for the years 2023 and 2050\.

For this step, GPT\-4 does not put the map straight in the code window — it can create an image file for us in the form of an HTML file. This prompt needs to be carefully crafted.

**Prompt to GPT\-4o:** *Generate a global choropleth map using Plotly Express for the the year 2023 and for the 65\+ age group.Export the resulting map as an HTML file and provide the download link. DO NOT attempt to use GeoPandas, Shapely, or any other libraries for handling geographic data — ONLY use Plotly Express and ensure the output is an HTML file.*

**Response from GPT\-4o:**

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*EAtCgLslkgkZwamQ.png)

We can see in the GPT\-4o chat window that the result from the Python generated code is created as an HTML file.

We can download this automatically generated file and display it visually in our default browser:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*7suWtlnt97UQwcqT.png)

Wow, yes, that is awesome. No\-code on\-the\-fly choropleth mapping from an uploaded dataset.

And then why not for 2050? (click on “Generate a map for year 2050”), or ask GPT\-4o to use a different colour theme (ie. Ciridis).

**Boom\-shaka\-laka**:

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*NENejjABimw6scc0.png)

Just like that, we have charts, and maps, and stories to tell.

I don’t know about you, but I think this is all pretty amazing. On\-the\-fly charts and maps with no coding. None.

For analyzing, interpreting, testing, and visualizing data sets — **invaluable**.


## In Summary…

GPT\-4o greatly simplifies the process of creating working Python data visualization code — by also displaying the visualization within the chat window. No code needed.

Previously, a coder would need to copy/paste/save the code into a Python editor and then run that code from the editor. For those of you who have used GPT\-4 to do this, I’m sure you’re familiar with the errors generated by GPT\-4 when the coding becomes more complex. And the back\-and\-forth iteration you need to go through to find a working solution.

GPT\-4o eliminates this frustrating situation by testing/running the code before actually displaying the results. It iterates through this process ***on its own*** before presenting the solution.

That’s not to say that GPT\-4o is perfect — ***it isn’t***. I encountered a few issues with the tool first losing it’s place (“Can you load that file again? I seem to have lost it…”), and then with it getting stuck in a loop (while trying to get the file path right).

Also, currently it only works with matplotlib (NOT Plotly) which is a bit of a bummer from a Plotly fan like me (no Plotly maps, booooo).

Overall, I would highly recommend GPT\-4o for automatic data viz generation .

It’s a great tool for test\-driving your dataset to see what kinds of stories you can come up with.

If this type of story is right up your alley, and you want to support me as a writer, subscribe to my [**Substack**](https://johnloewen.substack.com/)**.**

On Substack, I publish a bi\-weekly newsletter and articles that you won’t find on the other platforms where I create content.


