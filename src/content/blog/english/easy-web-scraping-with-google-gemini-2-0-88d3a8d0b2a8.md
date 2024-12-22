---
title: "EASY Web Scraping with Google Gemini 2.0"
meta_title: "EASY Web Scraping with Google Gemini 2.0"
description: "Google Gemini 2.0 simplifies web scraping by allowing users to extract data from webpages effortlessly through voice commands. The tool can handle complex and unstructured data, making it accessible for beginners. Users can set up Google AI Studio to share their screen and command Gemini to extract information, such as Airbnb reviews or specific table data from research articles, in structured formats like JSON. This innovative approach eliminates the need for coding, streamlining the data extraction process for various applications."
date: 2024-12-22T03:49:34Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Koz9eMv-AzQKmNDMGlPt1g.png"
categories: ["Programming/Scripting", "Technology/Web", "Data Science"]
author: "Rifx.Online"
tags: ["voice", "scraping", "Gemini", "JSON", "unstructured"]
draft: False

---






Web scraping has never been simpler and all thanks to Google’s groundbreaking multimodal live API

Gemini 2\.0\.

With this tool, you can effortlessly extract data from any webpage, whether it’s complex, unstructured or something very specific.

Today, I’m going to walk you through the actual examples I tried out myself, step\-by\-step, so you’ll know exactly what to do.

Even if you’re a complete beginner, you’ll feel like a pro in no time.

Let’s jump in!


## Getting Started: Setting Up Google AI Studio

Before we jump into the examples, let me show you how to set things up:

1. **Go to Google AI Studio:** Open Google AI Studio and log in with your Google account.
2. **Enable “Share Your Screen”:** You’ll find this option under the tools. Click on it, and make sure to select “Share Entire Screen” instead of just a tab. This is super important because Gemini 2\.0 will process what’s on your whole screen.
3. **Select Your Output Format:** Before starting, set the output format to “Text”. This ensures Gemini can return the results in a readable and structured format.

Once that’s done, you’re ready to go.

Here are screenshots for reference.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*kMax6TaHx4Q3IdlaXGAL6g.png)

Now let me walk you through the two examples I tried myself.


## Example 1: Scraping Airbnb Reviews While Scrolling

Here’s the scenario:

I wanted to scrape reviews from an Airbnb listing, but reviews only load as you scroll.

So how do you extract this information seamlessly?

Here’s how I did it step\-by\-step:

I opened an Airbnb listing and clicked on the reviews section I chose one random property just for testing and opened the review section.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*6GyGEc1Gy7XEJB_kDgdq3Q.png)

With Gemini 2\.0 active, I shared my entire screen (as set up earlier)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*bU_PvJm2lMrkIFEzUHmaCw.png)

I gave it this command via voice:

*“Extract all the reviews visible on the screen into a structured format. Keep extracting as I scroll.”*

As I scrolled through the reviews, Gemini 2\.0 continuously extracted the data in real time. It didn’t require me to stop or reload — it just kept capturing the visible reviews.

Once I finished scrolling, Gemini returned the reviews in a clean structured format. The output included:

* Reviewer’s name
* Date of review
* Star rating
* Full text of the review

Here is screenshot, how the AI scrap and gave me output

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*EaGLJ0Kckl39Oo3HkhnOBQ.png)

**Why is this useful?**

Whether you’re analyzing customer feedback or compiling reviews for comparison, this method saves you hours of manual copying and pasting.

**Example of Output (JSON):**


```python
[
    {
        "name": "Sonal",
        "date": "3 days ago",
        "stars": "5",
        "text": "The place was beautiful and we were awestruck to see such a well maintained and designed property within Bangalore."
    },
    {
        "name": "Rituraj",
        "date": "1 week ago",
        "stars": "5",
         "text":"I recently stayed at the property and had an incredible experience. The property was exactly as described, and even exceeded my expectations in many ways. The space was clean, well-maintained, and thoughtfully designed. Our host, was amazing—super responsive, friendly, and helpful. Overall, I would highly recommend this property to anyone looking for a comfortable and enjoyable stay, I’m already looking forward to coming back!"
    },
    {
       "name": "Damodar",
       "date": "June 2024",
        "stars": "5",
       "text": "It was a wonderful stay, nice clean pool, tidy rooms, ample entertainment sources like games(football, carrom etc.), decent piano to play, each room had a TV and living room had a big projector screen. Caretaker Laxman was polite and helpful. Ample amount of seating area all over and great cosy beds made our sleep pretty comfortable. Kids also enjoyed the indoor swing seats a lot. Trust me it is a great place to stay...SUPER COMFORTABLE and enjoyable  The only drawback was one of the food provider near by called Chaitra...suggest whoever goes there either cook your own food in the excellent kitchen or order/dine at nearby restaurants ...many options are there within 5 Kms. We had dinner and breakfast from the food vendor however the quality was not up to mark. Non veg food was not cooked completely. We ordered barbeque veg non veg and non veg took much time to cook and even after that it was not roasted/ cooked properly.. have strong doubts on their raw material"
    }
]
```
And that’s it! Gemini 2\.0 made this process ridiculously simple.


## Example 2: Extracting Specific Data from a Research Article

For my second use case, I wanted to extract only the **table data** from a research article — not the entire page. This time, I focused on precision. Here’s how I did it:

I found an article containing a table titled “Synoptic view of supply and use components, EU, 2021 and 2022”.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*iqi7elTzMTVeRJmAAGVTdg.png)

As before, I shared my full screen to give Gemini visibility over the entire article.

Instead of extracting everything, I told Gemini:

*“Extract only the table data from this article and convert it into a JSON format.”*

Gemini instantly identified the table, extracted the data, and returned it in the requested JSON format.

Here’s the output Gemini gave me:


```python
{
  "Table": {
    "Title": "Synoptic view of supply and use components, EU, 2021 and 2022",
    "Unit": "(€ Billion)",
    "Rows": [
      {
        "Item": "1. Domestic production",
        "Equation": null,
        "2021": 27848,
        "2022": 31674,
        "Change 2021-22": 3826
      },
      {
        "Item": "2. Imports of goods and services",
        "Equation": null,
        "2021": 2378,
        "2022": 3198,
        "Change 2021-22": 820
      },
      {
        "Item": "3. Total supply",
         "Equation": "1+2",
        "2021": 30226,
        "2022": 34779,
        "Change 2021-22": 4552
      },
      {
        "Item": "4. Intermediate consumption",
        "Equation": null,
        "2021": 14343,
        "2022": 16340,
        "Change 2021-22": 1997
      },
      {
        "Item": "5. Final consumption expenditure of households",
        "Equation": null,
        "2021": 11554,
        "2022": 12541,
        "Change 2021-22": 986
      },
      {
        "Item": "6. Final consumption expenditure of government",
        "Equation": null,
        "2021": 3188,
        "2022": 3375,
        "Change 2021-22": 187
       },
      {
         "Item": "7. Final consumption expenditure of NPISH",
         "Equation": null,
         "2021": 193,
         "2022": 209,
         "Change 2021-22": 15
      },
      {
         "Item": "8. Final consumption expenditure",
         "Equation":"= 5+6+7",
        "2021": 14936,
         "2022": 16125,
         "Change 2021-22": 1068
        },
      {
        "Item": "9. Gross fixed capital formation",
        "Equation": null,
        "2021": 2538,
        "2022": 2865,
        "Change 2021-22": 326
      },
       {
        "Item": "10. Changes in inventories and acquisitions less disposals of valuables",
        "Equation": null,
        "2021": 226,
        "2022": 323,
        "Change 2021-22": 98
      },
      {
        "Item": "11. Gross capital formation",
        "Equation": "= 9+10",
        "2021": 2764,
        "2022": 3188,
        "Change 2021-22": 424
      },
       {
        "Item":"12. Exports of goods and services",
        "Equation": null,
         "2021": 2891,
         "2022": 3291,
         "Change 2021-22": 400
       },
      {
       "Item": "13. Total use",
        "Equation":"= 4+8+11+12",
        "2021":30228,
        "2022":34779,
        "Change 2021-22":4552
        },
       {
        "Item": "14. Taxes less subsidies on products",
         "Equation": null,
         "2021": 459,
          "2022":482,
         "Change 2021-22": 24
        },
       {
        "Item": "15. Value added",
         "Equation":"= 1-4 =16+17+18",
         "2021": 13005,
          "2022": 14334,
         "Change 2021-22": 1330
        },
        {
        "Item": "16. Compensation of employees",
         "Equation": null,
         "2021": 6954,
          "2022": 7447,
         "Change 2021-22": 493
        },
         {
        "Item": "17. Gross operating surplus and mixed income",
         "Equation": null,
         "2021": 6013,
          "2022": 6608,
         "Change 2021-22": 595
        },
        {
         "Item": "18. Other taxes less subsidies on production",
         "Equation": null,
         "2021": 32,
          "2022": 158,
         "Change 2021-22": 127
        }
    ]
   }
}
```
**Why is this useful?**

If you’re working with research data, tables, or reports, you can extract only the information you need without distractions. You can then analyze it, convert it into a spreadsheet, or visualize it however you want.


## Why Gemini 2\.0 Makes Web Scraping So Easy

With Gemini 2\.0, you don’t need to write a single line of code.

Just talk to the AI, describe what you want and it handles the heavy lifting.

Whether you’re scrolling through reviews or extracting precise data, Gemini adapts to your needs effortlessly.


## Try It Yourself!

Here are some ideas to get you started:

* Extract Amazon reviews or product data.
* Scrape restaurant listings or hotel details.
* Pull financial tables or stats from articles like I did.

Set up Gemini 2\.0, share your screen and simply tell it what you need.

It’s web scraping made ridiculously easy.

If want to learn more about web scraping tools, here is my article you can chcek


