---
title: "Exploring generative AI suggestions for analogous data color schemes"
meta_title: "Exploring generative AI suggestions for analogous data color schemes"
description: "The article explores the use of Generative AI for creating analogous color schemes that are aesthetically pleasing while also passing color deficiency tests. It discusses the concept of analogous color harmony, color deficiencies, and the capabilities of popular AI chatbots like OpenAIs ChatGPT, Microsofts Copilot, and Googles Gemini. Each chatbot provided color harmony suggestions primarily in blue tones, with varying degrees of success in passing color deficiency tests. ChatGPTs suggestions were the most effective, while Copilots failed the tests. The findings emphasize the importance of accessibility in data visualization design."
date: 2024-12-05T12:36:46Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*KQegjMlPfwo8xqg6lXlynQ.png"
categories: ["Generative AI", "Color Vision", "Data Science"]
author: "Rifx.Online"
tags: ["Generative", "color", "harmony", "deficiency", "chatbots"]
draft: False

---






Analogous color harmonies refer to at least three colors that are adjacent to each other on the color wheel. The color scheme can create pleasing color combinations but runs the risk of failing color blindness tests when applied to data visualization. Can Generative AI help in data color scheme design by providing analogous suggestions that pass color deficiency. Here I explore this question. Let’s begin by reviewing in more detail the concepts of an analogous color harmony, color deficiencies, and Generative AI systems.

**The Analogous Color Harmony:**

Color harmony is the process of choosing colors on a color wheel that work well together in the composition of an image. Like concepts in music, these harmonies are based around color combinations on the color wheel that help to provide common guidelines for how color hues will work together. Isaac Newton is credited with creating the color wheel concept when he closed the linear color spectrum into a color circle in the early 1700s. An illustration of his concept is shown below. Artists and color scientists evolved and amplified his concept to include color harmonies.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*VA7YwgGV-AIYUBAdGyi-UA.png)

Two color spaces frequently used to form the basis for color wheels are the traditional Red\-Yellow\-Blue (RYB) color space used by painters for centuries and the Red\-Green\-Blue (RGB) color space used for desktop and mobile display devices. The color spaces yield slightly different color harmony results when colorizing a data visualization. Three colors that are adjacent to each other on the color wheel form an **analogous** color harmony. Below, I show a comparison of the two differing color spaces with an analogous color harmony in the key of Blue.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Vddf3meOO3VG0BTdNRldkw.png)

In a [previous](https://readmedium.com/how-genai-understands-color-harmony-as-applied-to-data-visualization-f447171ef3dc) writing, I showed that Generative AI systems default to defining color harmonies in terms of the RYB color space but when prompted will specify color harmonies in RGB color space.

**What are Color Deficiencies?**

Additionally, my [earlier](https://medium.com/@theresamarierhyne) UX Collective and Nightingale writings on color highlighted that humans have three types of photoreceptors or cones. Each is sensitive to different parts of the visual spectrum of light to facilitate rich color vision. A color deficiency happens when one or more sets of cones does not function properly. A red cone deficiency is classified as Protanopia. A green cone deficiency is classified as Deuteranopia. A blue cone deficiency is classified as Tritanopia. Software is available that simulates color deficiencies. I will use [Adobe Color’s accessibility check for color blindness](https://color.adobe.com/create/color-accessibility) as a check for color deficiency for the data color schemes in this writing. As a final check of a selected color scheme applied to a data visualization, I frequently use [Coblis — the Color Blindness Simulator](https://www.color-blindness.com/coblis-color-blindness-simulator/) tool.

Now, let’s examine some details about Generative AI chatbots, to see how it might facilitate color scheme suggestion.

**Generative AI Chatbots:**

Presently, there are three popular Generative AI chatbots in wide usage: Open AI’s ChatGPT, Microsoft’s Copilot, and Google’s Gemini. Users can ask these chatbots for assistance in tasks such as creating emails, essays, and code. There are several reviews that describe the functionality of [ChatGPT](https://www.cnet.com/tech/services-and-software/chatgpt-3-5-review-first-doesnt-mean-best/), [Copilot](https://www.techtarget.com/whatis/definition/Microsoft-Copilot#:~:text=It%20was%20a%20standalone%20application,creation%2C%20editing%20and%20workflow%20automation.) and [Gemini](https://zapier.com/blog/google-gemini/) respectively. The basic versions of each tool (ChatGPT 3\.5, Copilot, and Gemini respectively) are free with the premium services costing around $20 a month. For this writing, I am using the “free” versions of these systems to explore their understanding of an analogous color harmony. Below, I show screenshots of the user interface and pricing information for each of these chatbots.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*6XxAJnCsCj-M69ihKphvsA.png)

I asked each Generative AI chatbot to “specify an analogous color harmony that passes color deficiency tests”. Interestingly, each system provided an analogous harmony in the key o Blue. Next, I present the details that each chatbot provided.

**Asking Open AI’s ChatGPT for assistance in Creating an Analogous Color Harmony that passed color deficiency:**

I first worked with ChatGPT and asked the system to “specify an analogous color harmony that passes color deficiency tests”. The chatbot responded with:

*For an analogous color harmony that remains visually distinguishable to people with color deficiencies (like protanopia, deuteranopia, and tritanopia), it’s best to choose colors that differ in lightness and saturation, as well as hue. Here’s a safe approach:*

***Suggested Color Harmony:***

*1\.* ***Choose a Base Hue****: Pick a color in the blue, purple, or yellow\-orange range. These hues generally remain distinguishable across color deficiency types.*

*2\.* ***Analogous Colors****: Select colors that are around 30° to 60° on either side of the base hue on the color wheel. Use a mix of warm (yellow\-orange) or cool (blue/purple) shades, depending on the base hue chosen.*

*3\.* ***Variation in Saturation and Lightness****: For enhanced differentiation, vary the saturation and brightness within your analogous palette. Lightening or darkening each hue creates better contrast, making the palette more color\-deficiency\-friendly.*

*4\.*

***Example Analogous Palettes:***

· ***Blue Base****: Blue (\#007acc), Teal (\#00aaff), Aqua (\#66ccff)*

· ***Yellow\-Orange Base****: Gold (\#ffaa00\), Orange (\#ff8800\), Burnt Orange (\#ff5500\)*

*x*

*These palettes use contrast in lightness and saturation, improving visibility across various types of color deficiencies while maintaining harmony.*

In this response, ChatGPT provided two analogous color harmony examples that are intended to pass color deficiency results. The specific colors were specified with color Hex codes. For those unfamiliar with the concept, a color Hex code is a hexadecimal way to represent a color in RGB format by combining amounts of Red, Green, and Blue to note that specific color. The code is a six\-digit combination of numbers and letters, preceded by a hash symbol (\#). Each pair of digits represents the intensity of Red, Green, and Blue in the color, respectively. Color Hex codes are not case sensitive so \#FFFFFF and \#ffffff equally represent the color White.

I show the actual text chatbot response below. I also show my use of the [Adobe Color](https://color.adobe.com/create/color-wheel) tool to visually map and test for color deficiency of the three Blue\-base colors that ChatGPT specified. As noted previously, all three Generative AI tools provided analogous examples in the key of Blue. ChatGPT was the only system to additionally include an example in the key of Orange. For this writing and for comparison purposes, I am staying focused on the key of Blue examples.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*IldG2RZmD5tqTrrwxe8Z7Q.png)

ChatGPT has provided a very narrow analogous example where the colors a very close to each other on the color wheel. Now, let’s explore how the Microsoft Copilot Generative AI system responds.

**Asking Microsoft Copilot for assistance in Creating an Analogous Color Harmony that passed color deficiency:**

*Sure thing! An analogous color scheme typically uses colors that are next to each*

*other on the color wheel. Here’s one that passes color deficiency tests:*

***Set: Blue\-Green, Blue, Blue\-Purple***

· *Blue\-Green: \#17BECF*

· *Blue: \#1F77B4*

· *Blue\-Purple: \#9467BD*

*This scheme ensures that the colors are distinguishable for people with color vision deficiencies while still maintaining that harmonious look. Planning to use these colors for a specific project?*

I show the actual text chatbot response below. I also show my use of the [Adobe Color](https://color.adobe.com/create/color-wheel) tool to visually map and test for color deficiency the Blue\-Green, Blue, Blue\-Purple colors that Copilot specified. As noted previously, all three Generative AI tools provide analogous examples in the key of Blue. Unfortunately, the Copilot analogous combination did not pass the color deficiency tests from Adobe Color. I placed an X through the test results.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*mZpLLoADvK7aJ3depqH6LQ.png)

Copilot has provided an analogous example that was intended to pass color deficiency tests but failed for the Protanopia and Deuteranopia cases. Now, let’s explore how the Google Gemini Generative AI system responds.

**Asking Google Gemini for assistance in Creating an Analogous Color Harmony that passed color deficiency:**

Here, I show Google Gemini’s response to my “specify an analogous color harmony that passes color deficiency tests” inquiry. The chatbot responded with:

*Analogous colors are colors that are adjacent to each other on the color wheel. This color scheme typically creates harmonious and visually pleasing designs. To ensure accessibility for individuals with color deficiencies, consider the following analogous color palette:*

***Color Palette:***

· ***Primary Color:*** *Blue*

· ***Analogous Colors:*** *Teal and Green*

***Why This Palette Works:***

*1\.* ***Sufficient Contrast:*** *Blue, teal, and green, when chosen in appropriate shades, offer sufficient contrast for most individuals with color deficiencies.*

*2\.* ***Clarity:*** *The gradual shift from blue to green provides a clear visual progression.*

*3\.* ***Versatility:*** *This palette can be adapted to various design styles and themes.*

I show the actual text chatbot response below.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*nRjgJN_6TyyrqtCFhe9bVg.png)

Unlike OpenAI ChatGPT and Microsoft Copilot, Google Gemini did not provide a specific color Hex code response. So I added more detail to my request and asked: “specify an analogous color harmony with color hex codes that passes color deficiency tests”.

The chatbot responded with:

*Here’s an analogous color harmony with hex codes that is generally well\-tolerated by individuals with color deficiencies:*

***Primary Color:*** *Blue (\#007bff) **Analogous Colors:***

· *Teal: (\#009688\)*

· *Green: (\#4caf50\)*

*This color palette offers a harmonious and visually pleasing combination, while also ensuring sufficient contrast for individuals with color deficiencies.*

***Remember:***

· ***Test your design:*** *Use color simulation tools to preview your design as it would appear to individuals with different types of color deficiencies.*

· ***Prioritize text legibility:*** *Always choose text colors that have sufficient contrast with the background.*

*By following these guidelines, you can create designs that are both aesthetically pleasing and accessible to a wide audience.*

I show the actual text chatbot response below. I also show my use of the [Adobe Color](https://color.adobe.com/create/color-wheel) tool to visually map and test for color deficiency for the Blue, Teal and Green colors that Gemini specified. As noted previously, all three Generative AI tools provide analogous examples in the key of Blue.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*2fhmL6hGzDXRIzR_MA3EZA.png)

Gemini has provided an analogous example with the *primary* color noted as Blue, however the middle color in this recommendation is Teal. Usually, the middle color in an analogous combination is the key or *primary* color but not in this case. This Blue, Teal and Green analogous color harmony passes color deficiency tests.

**Summarizing the Analogous Color Harmony the passes Color Deficiency Results:**

When asked to “to “specify an analogous color harmony that passes color deficiency tests””, all three Generative AI systems provided examples of colors adjacent to each other in the key of Blue. Each chatbot also addressed color deficiency with their provided Blue example. When tested for color deficiency, the Open AI ChatGPT and Google Gemini suggested analogous examples passed while the Microsoft Copilot color scheme failed. The Open AI ChatGPT analogous scheme was very narrow with the Blue colors located very near each other and passed color deficiency tests. The Microsoft Copilot scheme used a Cyan, Blue, Purple combination where the Blue and Purple conflicted inprotanopia and deuteranopia color deficiency tests. The Google Gemini provided a Blue, Teal, and Green combination that passed color deficiency tests. In an analogous color harmony, the key color is usually the center color in the combination. Interestingly, Google Gemini provided what it called a Blue analogous scheme with Teal at the center, I show a summary of these results below.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*R24XVM4HOKS2b98C3lzRGQ.png)

**Applying the Generative AI Blue Analogous Color Schemes that Passed Color Deficiency to a Data Visualization Example:**

Since both color schemes passed color deficiency, I applied the ChatGPT Blue Analogous and Gemini Blue Analogousschemes to a bar chart data visualization example. I used forecasted sales data for three regions. These results are shown below.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Cp5mz5h2ob7r6GO9K2lMQw.png)

In examining the two data visualization examples, I preferred the *ChatGPT Blue Analogous* option over the Gemini *Blue Analogous* suggestion. The contrast between the Gemini suggested Teal and Green colors was not as significant as I would have preferred.

Let’s use the free and online [Color Blindness Simulator (Coblis)](https://www.color-blindness.com/coblis-color-blindness-simulator/) tool to check for color deficiency in the bar chart data visualization with the two color schemes applied. These results are shown below.

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*aiUyGOVsCnfohKM6bO5yEw.png)

The ChatGPT Blue Analogous scheme passes where the Gemini Blue Analogous scheme is borderline for Tritanopia when applied to this bar chart example. I decided to select the *ChatGPT Blue Analogous* option for this specific data visualization.

**A Recap:**

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*9bWuFuTb2yv2jokd48moiQ.png)

In this writing, I have explored how three text\-based Generative AI tools, Open AI ChatGPT, Microsoft Copilot, and Google Gemini provide solutions to my “specify an analogous color harmony that passes color deficiency tests” request. Each system provided solutions in the key of Blue that were further examined. Unfortunately, the Microsoft Copilot solution failed Adobe Color’s color blindness tests and was eliminated from further consideration. OpenAI ChatGPT provided a narrow analogous suggestion where all three colors were in the Blue family. Google Gemini provide an analogous color scheme that spanned Blue, Teal and Green. These two, recommendations were applied to a bar chart data visualization. A color deficiency check for the bar chart data visualizations indicated that theChatGPT Blue Analogous bar chart passed where the Gemini Blue Analogous data visualization is borderline for Tritanopia. I chose the ChatGPT Blue Analogous bar chart option for this specific data visualization.

For additional discussions on my explorations with various color suggestion tools, please see my [prior](https://medium.com/@theresamarierhyne) UX Collective and Nightingale writings as well as my 2016 book on “[Applying Color Theory to Digital Media and Visualization](https://www.crcpress.com/Applying-Color-Theory-to-Digital-Media-and-Visualization/Rhyne/p/book/9781498765497)” published by CRC Press. The [2nd Edition](https://www.routledge.com/Applying-Color-Theory-to-Digital-Media-and-Visualization/Rhyne/p/book/9781032811727) of my book is now available for pre\-order and ships after December 19, 2024\.

**Author Profile:**

Theresa\-Marie Rhyne is a Visualization Consultant with extensive experience in producing and colorizing digital media and visualizations. She has consulted with the Stanford University Visualization Group on a Color Suggestion Prototype System, the Center for Visualization at the University of California at Davis and the Scientific Computing and Imaging Institute at the University of Utah on applying color theory to Ensemble Data Visualization. Prior to her consulting work, she founded two visualization centers: (a) the United States Environmental Protection Agency’s Scientific Visualization Center and (b) the Center for Visualization and Analytics at North Carolina State University.


