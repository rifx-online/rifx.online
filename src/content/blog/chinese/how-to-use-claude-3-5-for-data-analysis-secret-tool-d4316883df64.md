---
title: "如何使用克劳德 3.5 进行数据分析（秘密工具）"
meta_title: "如何使用克劳德 3.5 进行数据分析（秘密工具）"
description: "Claude是一款AI驱动的数据分析工具，旨在简化数据分析和可视化过程。用户可通过上传小型数据集，Claude能够进行基础分析并生成交互式图表，适合不懂编程的用户和小企业主。尽管Claude在处理较小数据集时表现良好，但其对大数据集的处理能力有限，可能不适合需要深入分析的场景。与ChatGPT相比，Claude更注重简单易用，而ChatGPT则适合复杂数据分析和高级可视化需求。"
date: 2024-11-20T00:12:48Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*flGG60RjTofzTx69.jpg"
categories: ["Data Science", "Technology", "Machine Learning"]
author: "Rifx.Online"
tags: ["data", "visualization", "analysis", "datasets", "interactive"]
draft: False

---





大多数人对这个功能并不了解

在本文中，我们将讨论 Claude，这是一款由 AI 驱动的数据分析工具，可以帮助我们分析数据并制作酷炫的交互式可视化。

我们将涵盖您需要了解的所有内容，从启用特殊功能到使用较小的数据集。

让我们开始吧！

## 什么是Claude：一个AI数据分析师

想象一下，口袋里有一个非常聪明的助手，可以查看数据并给你答案。

这就是Claude的样子！Claude让数据分析对每个人都变得简单，无论你是专业的数据科学家，还是只是想出于兴趣探索数据的人。

Claude可以分析你的数据，制作可视化图表，甚至编写代码来制作交互式图表——只需点击几下。

在本文中，我们将通过分析Kaggle上的真实数据集来展示Claude是如何工作的。

请记住，这个功能仍处于测试模式，因此可能不会立即可用。

在开始数据分析之前，你需要开启“功能预览”。

## 开始使用Claude的分析工具

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Gchvfk2xD63JyiZ06-GIYg.png)

首先，您需要进入Claude的功能预览部分并开启数据分析工具。

一旦开启，您可以上传数据集供Claude进行分析。

但请记住——Claude对它可以处理的数据集大小有限制。

如果数据集过大，Claude可能会显示“对话超过长度限制”的错误。

这意味着它目前更适合处理较小的数据集。如果您想使用大数据集，这可能会有点烦人，但对于较小的数据集，它仍然表现得很好。

## 上传数据集并运行分析

在我们的示例中，我们使用了来自Kaggle的数据集，名为“100种最健康食品数据集”。

该数据集包含食品名称、营养价值、来源、卡路里、蛋白质、纤维以及其他健康信息。

一旦您上传数据集，Claude可以进行一些基本分析，甚至生成图表。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*J655o16NyrN-2ZOkPUD27A.png)

### 示例 1：抗氧化剂评分最高的食物

第一步是将数据集拖放到Claude中。

我输入了

“你是数据分析师，尽情发挥吧”

并发送了它。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*bVgtXc-XBp17AdD365ZUAg.png)

Claude迅速分析了数据集，并向我展示了抗氧化剂评分最高的前10种食物：肉桂、姜黄、生姜、蔓越莓、蓝莓、丁香等。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*IfgWYI6b1y_X6h1iDee_Dw.png)

代码：

```python
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Papa from 'papaparse';
import _ from 'lodash';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const HealthFoodsDashboard = () => {
  const [data, setData] = useState({
    topAntioxidants: [],
    regionDistribution: [],
    topVitaminC: [],
    averages: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await window.fs.readFile('Top 100 Healthiest Food in the World.csv', { encoding: 'utf8' });
        const parsedData = Papa.parse(response, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true
        });

        // Process data for visualizations
        const topAntioxidants = _.orderBy(parsedData.data, ['Antioxidant Score'], ['desc'])
          .slice(0, 10)
          .map(item => ({
            name: item.Food,
            value: item['Antioxidant Score']
          }));

        const regionGroups = _.groupBy(parsedData.data, 'Originated From');
        const regionDistribution = Object.entries(regionGroups)
          .map(([region, foods]) => ({
            name: region,
            value: foods.length
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 7);

        const topVitaminC = _.orderBy(parsedData.data, ['Vitamin C (mg)'], ['desc'])
          .slice(0, 5)
          .map(item => ({
            name: item.Food,
            value: item['Vitamin C (mg)']
          }));

        setData({
          topAntioxidants,
          regionDistribution,
          topVitaminC
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold mb-4">全球最健康食物分析</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 抗氧化剂评分最高的食物 */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>抗氧化剂评分前10的食物</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.topAntioxidants}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 按地区分布的食物 */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>按地区分布的食物</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.regionDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {data.regionDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 维生素C含量最高的食物 */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>维生素C含量前5的食物</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.topVitaminC}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HealthFoodsDashboard;
```
这些图表帮助您了解哪些食物对抗氧化剂最有利，这对于您想要更健康饮食等方面非常有帮助。

### 示例 2：高蛋白食品

Claude 还查看了哪些食品含有最多的蛋白质。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Leg3rz6xfp9TxrxkhGuBsw.png)

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*2gfkn4XgZIkgqwcKQw54dA.png)

一些主要食品包括沙丁鱼、鲑鱼、蛤蜊、扁豆、希腊酸奶和红豆。

如果你是运动员或者只是想在饮食中增加更多蛋白质，这是一种非常快速的方法来查看该吃什么。

Claude 甚至制作了一个简单的条形图来比较蛋白质水平，使其变得非常易于理解。

### 示例 3：健康食品的区域分析

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*cbfvL8a61PZQWfL0HJh2IA.png)

Claude 还做了一件很酷的事情，就是展示了哪些地区拥有最健康的食品。例如，地中海地区和东南亚地区有很多健康食品，因为它们有多样化的营养丰富的选择。

Claude 创建了一张地图，显示了世界上哪些地方有最健康的食品。如果你想了解食品文化或计划健康饮食，这非常有帮助。

Claude 的一个问题是它无法处理非常大的数据集。

例如，我尝试使用一个包含数千行的“学生表现数据集”，但由于数据集太大，Claude 无法处理。

最后，我把数据集拆分成更小的部分，这样效果很好。

## Claude vs. ChatGPT: 互动可视化

Claude 最酷的一点是它可以制作互动可视化。

它可以编写代码生成可以点击和探索的图表。

另一方面，ChatGPT 的高级数据分析 (ADA) 工具通常使用 Python 制作可视化，这可能更高级，但并不总是互动的。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*NvM78num8z2Eajome7y7jg.png)

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*zE7P59b1VHOZa_35Qv9u3g.png)

### 示例 4：与 Claude 的交互式图表

Claude 可以制作可以点击数据点进行探索的图表。

例如，当我要求 Claude 比较不同食物的卡路里含量时，它制作了一个交互式图表。

code:


```python
import Papa from 'papaparse';
import _ from 'lodash';

const fileContent = await window.fs.readFile('Top 100 Healthiest Food in the World.csv', { encoding: 'utf8' });

const parsedData = Papa.parse(fileContent, {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true
});

// Get highest and lowest calorie foods
const sortedByCalories = _.orderBy(parsedData.data, ['Calories'], ['desc']);
const highestCalories = sortedByCalories.slice(0, 10);
const lowestCalories = sortedByCalories.slice(-10).reverse();

console.log("Top 10 highest calorie foods:");
highestCalories.forEach(food => {
  console.log(`${food.Food}: ${food.Calories} calories (per ${food.Quantity})`);
});

console.log("\nTop 10 lowest calorie foods:");
lowestCalories.forEach(food => {
  console.log(`${food.Food}: ${food.Calories} calories (per ${food.Quantity})`);
});

// Calculate calorie statistics
const calorieStats = {
  average: _.meanBy(parsedData.data, 'Calories'),
  median: _.sortBy(parsedData.data, 'Calories')[Math.floor(parsedData.data.length / 2)].Calories,
  max: _.maxBy(parsedData.data, 'Calories').Calories,
  min: _.minBy(parsedData.data, 'Calories').Calories
};

console.log("\nCalorie Statistics:");
console.log(calorieStats);

// Group foods by calorie ranges
const calorieRanges = _.groupBy(parsedData.data, food => {
  const calories = food.Calories;
  if (calories >= 200) return '200+ calories';
  if (calories >= 150) return '150-199 calories';
  if (calories >= 100) return '100-149 calories';
  if (calories >= 50) return '50-99 calories';
  return 'Under 50 calories';
});

console.log("\nCalorie distribution:");
Object.entries(calorieRanges).forEach(([range, foods]) => {
  console.log(`${range}: ${foods.length} foods`);
});

// Analyze calories by food origin
const caloriesByRegion = _(parsedData.data)
  .groupBy('Originated From')
  .map((foods, region) => ({
    region,
    avgCalories: _.meanBy(foods, 'Calories'),
    count: foods.length
  }))
  .orderBy(['avgCalories'], ['desc'])
  .value();

console.log("\nAverage calories by region (regions with 2+ foods):");
caloriesByRegion
  .filter(region => region.count >= 2)
  .forEach(region => {
    console.log(`${region.region}: ${region.avgCalories.toFixed(1)} avg calories (${region.count} foods)`);
  });

```
![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*catX5s5BoQevtoaEzi6yIw.png)

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*AMthQr82AFMYwkMW6FKvhg.png)

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*W8Z9KaY6OCSjizLr-JnHJg.gif)

这使得很容易看到食物之间的差异，这对于演示时人们想要点击并了解更多细节非常有帮助。

### 示例 5：比较 Claude 和 ChatGPT 的可视化方法

当我将 Claude 与 ChatGPT 的 ADA 进行比较时，我发现 ChatGPT 制作了更详细和高级的图表，如箱线图和热图。

例如，我将一个“客户购买行为”数据集上传到 ChatGPT，它制作了一个热图，显示了年龄、消费和人们购买东西的频率之间的关系。

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*2zWTcF_1Bspd8CAYJ5Upvg.png)

这帮助我理解不同因素之间的联系。

虽然 Claude 可以制作简单的图表，但 ChatGPT 更适合处理更大的数据集并展示更复杂的信息。

Claude 的互动图表易于分享，非常适合快速摘要。但如果你需要深入的见解，ChatGPT 更好。

它可以处理更多内容，并且能够毫无问题地处理更大的数据集。

## 何时应该使用Claude？

Claude的数据分析工具非常适合那些想要快速和简单图表但又不想学习编码的人。

> 如果您是小企业主或不懂编码的人，Claude可以帮助您理解您的数据，而无需雇佣数据分析师。

### 示例 6：小型企业销售数据

想象一下，您拥有一家小型企业，并且有过去一年的销售数据。您可以将每月的销售数字上传到 Claude，它可以帮助您查看趋势。

例如，它可以显示哪些月份的销售额最高，以及哪些产品销售得最好。

它还可以制作交互式图表，显示季节性模式，帮助您决定何时补货某些商品或进行特别促销。

### 示例 7：学校项目或研究

如果你是一个正在做学校项目的学生，Claude 可以非常有用。例如，如果你正在研究不同天气条件如何影响植物生长，你可以上传你的数据，Claude 会制作出显示事物随时间变化的图表。

这是一种将你的数据转化为易于理解的图表的好方法，能够给你的老师留下深刻印象。

但是，如果你需要进行非常深入的分析，或者如果你已经知道如何编程并想处理大数据集，ChatGPT 的 ADA 可能是更好的选择，因为它没有 Claude 那样的大小限制。

## 最后的想法

Claude 的数据分析功能非常令人兴奋，特别是因为它可以制作交互式图表。

但它仍然有局限性，比如处理大数据集的能力不佳。

目前，如果您需要快速和简单的见解，Claude 是一个不错的选择。但如果您需要更高级的分析，ChatGPT 可能更好。

无论您是学生、小企业主，还是对数据感到好奇，Claude 都为您提供了一种简单的方式来探索和可视化信息。

它可能无法替代专业的数据科学家，但它绝对可以帮助您入门。

我希望这份指南能帮助您了解如何使用 Claude 进行数据分析！

如果您有任何问题，请随时留言或联系。祝您分析愉快，下篇文章再见！

