---
title: "Less is More: The Art of Midjourney AI Prompt Generation with ChatGPT o1"
meta_title: "Less is More: The Art of Midjourney AI Prompt Generation with ChatGPT o1"
description: "The author explores the effectiveness of using ChatGPT o1 to generate Midjourney AI prompts for creating river scene images. Initially, they attempted to generate 24 prompts with detailed categories, but the results were basic. However, when they reduced the batch size to 6 prompts, focusing on specific moods, the quality significantly improved, with more detailed atmospheric descriptions, better lighting elements, and richer environmental details. The key takeaway is that generating fewer prompts allows ChatGPT o1 to produce higher quality outputs, emphasizing the importance of focused requests in AI art creation."
date: 2024-12-12T01:33:58Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*xohsmh0Qg0b-5OtjuSjlkA.png"
categories: ["Chatbots", "Generative AI", "Machine Learning"]
author: "Rifx.Online"
tags: ["ChatGPT", "Midjourney", "prompts", "river", "scenes"]
draft: False

---






As an AI art creator, I was naturally excited when OpenAI released ChatGPT o1, claiming it has PhD\-level intelligence. While many rushed to test its coding or writing capabilities, I had a different focus in mind: How well could it help craft Midjourney AI prompts?

My journey with AI prompt generation has been evolutionary. Initially, with previous ChatGPT versions, I worked methodically, crafting prompts one by one, carefully refining each with the AI’s assistance. This measured approach produced good results, but I wondered if ChatGPT o1’s advanced capabilities could handle generating multiple prompts simultaneously.


## The Initial Experiment

Feeling ambitious with ChatGPT o1’s claimed capabilities, I provided a comprehensive structure for generating 24 different river scene prompts. My input was detailed and systematic, including clear categories:

* Peaceful/Calm scenes
* Serene settings
* Energetic/Dynamic water
* Mystical/Otherworldly scenes
* Dramatic environments
* Various lighting conditions

For each category, I provided specific elements to include, such as lighting effects, water patterns, and atmospheric conditions. The results were usable but relatively basic. For example, one prompt read: “*Photo of a peaceful river scene at dusk, calm water reflecting surroundings, with lighting focus on golden hour effects*.”

to obtain the 24 Midjourney AI prompts :


```python
Possible Moods for a River Scene
A river scene can evoke many moods depending
on the elements involved. Here's a list of
possible moods, grouped by general emotional
tones:

1. Peaceful/Calm
Serene
Tranquil
Quiet
Meditative
Reflective
2. Energetic/Dynamic
Powerful (e.g., rushing water)
Refreshing
Adventurous
Invigorating
3. Mystical/Dreamlike
Enchanting
Magical
Ethereal
Otherworldly
4. Melancholic/Somber
Gloomy
Sad
Nostalgic
Lonely
5. Bright/Optimistic
Cheerful
Radiant
Warm
Uplifting
6. Dramatic/Intense
Mysterious
Stormy
Foreboding
Awe-inspiring
Factors That Influence Mood in a River Scene
Lighting: Soft morning light vs. a dramatic
sunset or overcast shadows.
Color Palette: Warm earthy tones vs. cold
blues and grays.
Water Movement: Still and reflective water
evokes calmness, while fast-flowing or
turbulent water adds energy or drama.
Surroundings: Lush greenery feels tranquil,
while barren landscapes can feel lonely or
austere.
Additional Elements: Birds, fog, rocks, or
human interaction (like a lone figure
fishing) add emotional depth.

modify the following prompt , based on the
list the of possible mood above and create 24
different unique river scene Midjourney AI
prompts, 
starting with "photo of" :
photo of a serene river scene surrounded by a
dense forest. Sunlight streams through the
trees, casting golden and green hues on the
water, which reflects the surroundings like a
mirror. The overall mood of the image feels
calm and peaceful, with an emphasis on
nature's beauty. highlights the interplay of
light, shadow, and reflections, creating a
tranquil atmosphere. 

- don't use the term "cutting"
- don't include human activities
```







## The Accidental Discovery

Then came the unexpected breakthrough. Based on my experience with previous versions, I decided to try a smaller batch — just 6 prompts based on specific moods: serene, tranquil, quiet, meditative, reflective, and enchanting. Using the same clear information structure, something remarkable happened.

The quality difference was striking. Take this example from the 6\-prompt batch: “*Photo of a serene river scene surrounded by a dense forest. Sunlight filters through the trees, forming dappled patterns of gold and emerald on the glassy surface of the water. The overall mood is soothing and still, capturing a sense of quiet harmony as light and shadow dance together*.”

The contrast is clear — the smaller batch produced prompts with:

* More detailed atmospheric descriptions
* Better\-crafted lighting elements
* Richer environmental details
* More nuanced mood setting
* Terms that Midjourney AI understands and processes effectively


```python
Serene
Tranquil
Quiet
Meditative
Reflective
Enchanting
Magical
Ethereal
Otherworldly

by referring the following Midjourney prompt
and create 9 different unique river scene
Midjourney AI prompts ,
- 1 for each mood listed above, 
- same subject, environment and composition
as the attached image
- starting with "photo of" :
photo of a serene river scene surrounded by a
dense forest. Sunlight streams through the
trees, casting golden and green hues on the
water, which reflects the surroundings like a
mirror. The overall mood of the image feels
calm and peaceful, with an emphasis on
nature's beauty. highlights the interplay of
light, shadow, and reflections, creating a
tranquil atmosphere. 

- don't use the term "cutting"
- don't include human activities 
```

### Otherworldly:


```python
photo of an otherworldly river scene
surrounded by a dense forest. Sunlight
streams through ancient trees, casting
shimmering gold and emerald hues across the
still, reflective waters. The overall mood
feels beyond the ordinary, as light and
shadow converge into a vision of nature’s
mystical grandeur --ar 16:9 --stylize 50 
--v 6.1
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*qm-M_hhLdlYLrFMOdnGZgA.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Bpxcfy8fGKNlN3fG0rxhXg.png)


### Ethereal:


```python
photo of an ethereal river scene surrounded
by a dense forest. Sunlight drifts dreamily
through the canopy, layering the water with
subtle gold and green reflections that seem
to glow from within. The overall mood is
otherworldly and delicate, as light and
shadow blend to form a soft, transcendent
aura --ar 16:9 --stylize 50 --v 6.1
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*9AxNfqWc6jYTlh9daikuqQ.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*J3y35nbbYW5vtEoZ5bhm_g.png)


### Magical:


```python
photo of a magical river scene surrounded by
a dense forest. Sunlight filters through
leafy branches, scattering radiant gold and
vivid green glimmers that dance across the
serene water’s surface. The overall mood is
spellbinding, as light and shadow unite in a
luminous, fairy-tale setting --ar 16:9
--stylize 50 --v 6.1
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*MoDQAIFOzTho6EZk6PefZA.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Ax9Bf1FUZ3bnS4U7VZZOvg.png)


### Enchanting:


```python
photo of an enchanting river scene surrounded
by a dense forest. Sunlight weaves through
tall trees, sprinkling sparkling gold and
lush green reflections across the gentle
waters. The overall mood feels magically
alluring, as light and shadow create a
captivating natural tapestry --ar 16:9
--stylize 50 --v 6.1
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*nsuKk4tlQ1KSZPj_jSG-qQ.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*4ZPy8UR6WFLtR_COh66U0g.png)


### Reflective:


```python
photo of a reflective river scene surrounded
by a dense forest. Sunlight pierces the
canopy, scattering warm gold and soft green
hues that shimmer upon the water’s
mirror-like face. The overall mood is
contemplative and introspective, encouraging
quiet observation of nature’s flawless
symmetry --ar 16:9 --stylize 50 --v 6.1
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*LCBkxXNuWzdOoNt65QaAQQ.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*AMbNZ23V7KdeYxS0OYLxWg.png)


### Quiet:


```python
photo of a quiet river scene surrounded by a
dense forest. Sunlight filters between
branches, painting muted golden and green
tones across the calm, reflective surface.
The overall mood is hushed and gentle,
celebrating the subtle beauty of nature’s
silent presence --ar 16:9 
--stylize 50 --v 6.1
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*7DkpSaXj7jGyvbT4gnCpPQ.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*oPjOwiETwQ0a2cd2Khxy3Q.png)


### Tranquil:


```python
photo of a tranquil river scene surrounded by
a dense forest. Sunlight drifts through the
trees, forming dappled patterns of gold and
emerald on the glassy surface of the water.
The overall mood is soothing and still,
capturing a sense of quiet harmony as light
and shadow dance together. --ar 16:9
--stylize 50 --v 6.1
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*9M_rgyQNyvMGink_0d9urg.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*fK6Poobw21vSupHhVAaayA.png)

Serene:


```python
photo of a serene river scene surrounded by a
dense forest. Sunlight streams softly through
the foliage, casting gentle golden-green
highlights on the mirror-like water. The
overall mood feels deeply peaceful,
emphasizing the pure elegance of nature’s
interplay of light, shadow, and reflection.
--ar 16:9 --stylize 50 --v 6.1
```
![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*B4WzLFXhCbKERIWjBsdw8Q.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*E7pqLlVBUz8af13BLU_avA.png)


## The Power of Focus

This accidental discovery highlighted something crucial about working with ChatGPT o1: Less really is more. When asked to generate fewer prompts, it dedicated more ‘attention’ to each one, resulting in higher quality outputs that better serve Midjourney’s capabilities.

The structured input remained consistent in both cases:

1. Clear scene type/mood category
2. Specific descriptive elements required
3. Lighting and atmospheric conditions
4. Focus on natural elements and reflections

Yet the results showed that quantity can impact quality, even with advanced AI like ChatGPT o1\.


## Looking Forward

This experience revealed that while ChatGPT o1 is indeed powerful for generating Midjourney prompts, how we use it matters significantly. The key isn’t just in providing clear instructions — it’s also about understanding the optimal request size for quality output.

For fellow AI artists, I recommend starting with smaller batch requests, perhaps 5–6 prompts at a time. While it might take more iterations to generate a large number of prompts, the quality improvement makes it worthwhile. Sometimes, taking a step back and asking for less can actually give you more.

Remember, in the world of AI art creation, the goal isn’t just to generate prompts efficiently — it’s to create prompts that truly capture the vision you’re trying to achieve. And sometimes, that means slowing down and letting the AI focus on fewer, better outputs.


