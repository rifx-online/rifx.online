---
title: "Testing the new Nemotron 70B model from Nvidia"
meta_title: ""
description: "this is meta description"
date: 2022-04-04T05:00:00Z
image: "https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*-z7oZo_Kb3c9ELsk"
categories: ["Technology", "Data"]
author: "Sam Wilson"
tags: ["technology", "tailwind"]
draft: false
---

## Can this open-source model dethrone GPT-4o and Sonnet 3.5?

There’s been a lot of buzz around the release of the latest model from Nvidia. It’s a tuned version of Meta’s Llama 3.1 70B model that uses a two-layer reward system and a so-called `**HelpSteer**` data set to enhance the responses it gives to user requests.

Apparently, it’s destroying all the top models in the Arena hard, MT-Bench and AlpacaEval 2 benchmarks which are known to be predictive of [LMSys Chatbot Arena Elo](https://huggingface.co/spaces/lmsys/chatbot-arena-leaderboard) performance.

Well, we’ll see about that. As usual, I like to conduct my own tests to see how different models compare.

**[Stop Press — I have a added an additional question to ask]**


## Model performance

Below is a table that pits Nemotron against various other top closed-source models and — blow me down — it outperforms them all. Who’da thunk!

![](https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*BJm80jDr5L1aAkpAThj8Kg.png)


## Accessing the new model

The new model is available to test from a few places, including:-

* Hugging Face — <https://huggingface.co/nvidia/Llama-3.1-Nemotron-70B-Instruct>
* Nvidia —<https://build.nvidia.com/nvidia/llama-3_1-nemotron-70b-instruct>
* HuggingFace Chat — <https://huggingface.co/chat/>

I used the HuggingFace Chat interface.


## Testing the new model

**Question 1**


```python
A bat and a ball, together cost $1.20. The bat costs $1 more than the ball. 
How much is the ball?
```
Answer 1


```python
A classic math problem!

Let's say the ball costs x cents.

The bat costs $1 more than the ball, so the bat costs x + $1.

The total cost of the bat and the ball together is $1.20.

We can set up the equation:

x + (x + 1) = 1.20

Combine like terms:

2x + 1 = 1.20

Subtract 1 from both sides:

2x = 0.20

Divide both sides by 2:

x = 0.10

So the ball costs 10 cents.

Answer: The ball costs 10 cents.
```
Correct.

**Question 2**


```python
A room contains only 3 people. The first person is reading a book and 
the second person is playing chess. Based on this, what is the most 
likely activity that the third person is engaging in?
```
Answer 2


```python
This is a classic lateral thinking puzzle!

The answer is not "playing chess" (because the second person is already playing chess, and you can't play chess with yourself).

The answer is not "reading a book" (because the first person is already reading a book, but that doesn't necessarily mean the third person can't be reading a book too).

The most likely activity that the third person is engaging in is... "watching the chess game"!

Why? Because the second person is playing chess, and it's likely that the third person is observing or spectating the game.

So, the third person is most likely watching the chess game.
```
Oops, that’s not right at all. By that logic, the third person could just as easily be watching the first person reading their book!

**Question 3**


```python
Jimmy has 10 dollars, he gives two to Lois.  He goes to the bank and 
withdraws 5 dollars, then to the shop where he buys a dollar fifty worth 
of candy. How much money does Jimmy have left
```
Answer 3


```python
Let's work through the scenario step by step:

Jimmy starts with $10.
He gives $2 to Lois, so he's left with:
$10 - $2 = $8
He withdraws $5 from the bank, so he now has:
$8 + $5 = $13
He buys $1.50 worth of candy, so he's left with:
$13 - $1.50 = $11.50
Jimmy has $11.50 left.
```
Spot on.

**Question 4**


```python
Write some Python code that OPTIMALLY calculates as many Fibonacci 
numbers as possible within 0.01 seconds and prints the last N and its 
corresponding Fibonacci number
```
Answer 4


```python
import time

def fibonacci(n, memo = {}):
    if n <= 0:
        return 0
    elif n == 1:
        return 1
    elif n in memo:
        return memo[n]
    else:
        memo[n] = fibonacci(n-1, memo) + fibonacci(n-2, memo)
        return memo[n]

start_time = time.time()
n = 0
while True:
    fib_n = fibonacci(n)
    if time.time() - start_time > 0.01:
        break
    n += 1

print(f"Last calculated Fibonacci number: F({n-1}) = {fib_n}")
```
A great answer there AND it uses the memoization technique for optimum run-time. Out of interest, it printed out the 17221'ist Fibonacci number.

**Question 5**


```python
Two people are travelling in a car along a road. The car runs out of gas 1 
mile from the gas station. They have two options.

1) They can push the car to the gas station to fill up. With one person 
steering, the other can can push the car at an average of 30 inches per 
second. 
2) Alternatively, one person can run to the gas station, borrow 
a pick-up truck there and use it to tow the car back to the gas station 
to fill up. The person can run at 6 mph. Assume that the tow truck averages 
30 mph on all journeys. Also, assume it takes the person ten minutes between 
arriving at the gas station and setting off in the tow truck back to the car. 
It takes a further ten minutes to load the car onto the tow truck before 
heading back to the gas station.

To get the car to the gas station, is it quicker for car to be pushed there 
or for someone to run for the tow truck and tow the car back?
```
Answer 5


```python
Let's analyze the two options:

Option 1: Pushing the car

Distance to the gas station: 1 mile = 5280 feet = 63360 inches (since 1 foot = 12 inches)
Pushing speed: 30 inches per second
Time to push the car to the gas station:
63360 inches / 30 inches/second = 2112 seconds
Convert seconds to minutes:
2112 seconds / 60 = 35.2 minutes
Option 2: Running to the gas station and towing the car

Time for the person to run to the gas station:
1 mile / 6 mph = 0.167 hours = 10 minutes
Time to prepare the tow truck: 10 minutes
Time to load the car onto the tow truck: 10 minutes
Time for the tow truck to travel to the car and back to the gas station:
2 miles / 30 mph = 0.067 hours = 4 minutes
Total time for Option 2: 10 + 10 + 10 + 4 = 34 minutes
Based on the calculations, Option 2: Running to the gas station and towing the car is the faster option, taking 34 minutes compared to 35.2 minutes for Option 1: Pushing the car.
```
Another great answer.

**Question 6**


```python
Multiply the smallest positive integer that's less than 100 by the  
largest negative integer greater than -100
```
Answer 6


```python
The smallest positive integer less than 100 is 1.

The largest negative integer greater than -100 is -1.

Multiplying them together gives:
1 × -1 = -1
```
Correct.

**Question 7**


```python
Item 1 is priced at 50% more than half the price of the full price of item 2. 
Item 2 is on sale right now, priced at $2.70,  10% off its regular full price. 
What is the price of item 1
```
Answer 7


```python
Let's break it down step by step:

Item 2 is on sale at $2.70, which is 10% off its regular price. To find the regular price, we can calculate:
Regular price of Item 2 = $2.70 / 0.9 (since 10% off means 90% of the original price) = $3.00

Item 1 is priced at 50% more than half the price of the full price of Item 2. First, find half the price of the full price of Item 2:
Half the price of Item 2 = $3.00 / 2 = $1.50

Now, calculate 50% more than half the price of Item 2:
$1.50 x 1.5 (50% more) = $2.25

So, the price of Item 1 is $2.25.
```
Correct again.

I have a new logic-based question.

**Question 8**


```python
Danid eats one banana per day, usually as soon as he gets back from shopping. 
He went to the shops on Monday and bought 5 bananas, He went again two days 
later, but is distracted by the oranges on sale and buys 3 of them. 
The day before he had bought two bananas but one was 
smaller than he liked. He didn't shop on Thursday, but the day 
after he bought 2 more.
How many bananas does David have?
```
**Answer 8**


```python
Let's break it down step by step:

Danid buys 5 bananas on Monday and eats one as soon as he gets back, so he 
has 5 - 1 = 4 bananas left.
He eats one banana per day, so by the time he goes shopping again two days 
later (Wednesday), he has eaten 2 more bananas (one on Tuesday and one on 
Wednesday).
This means he has 4 - 2 = 2 bananas left.
On the second shopping trip, he doesn't buy bananas, but he does buy 
oranges. He eats one banana as soon as he gets back, so he has 2 - 1 = 1 
banana left.
The day before the second shopping trip (Tuesday), he had bought 2 bananas, 
but one was smaller than he liked. He didn't eat the smaller one, so he 
still has it, plus the larger one, which he ate as soon as he got back. So, he 
still has 1 banana from the first purchase, plus the smaller banana, for a 
total of: 1 + 1 = 2 bananas
He eats one banana per day, so by the time he buys more bananas the day after 
the second shopping trip (Friday), he has eaten 2 bananas (one on Thursday and 
one on Friday).
He buys 2 more bananas on Friday and eats one as soon as he gets back, so he 
has 2 + (2 - 1) = 3 bananas.
So, Danid has 3 bananas.
```
The correct answer is David has 4 bananas left. He bought 9 in total over 5 days and ate one per day = 5. So he has 9–5=4 left.


## Summary

Nemotron 70B scores 6/8 on my questions and is undoubtedly a great model with strong reasoning skills. In my humble opinion, it falls a little short against GPT 4o and Sonnet 3.5 but is definitely up there with the best of any of the open-source LLMs out there.

In case you’re wondering, this is how GPT4o answered the banana problem.


```python
Let's summarize David's banana purchases and consumption day by day:

Breakdown of Events:
Monday:

Bought: 5 bananas
Ate: 1 banana
Remaining: 5 - 1 = 4 bananas
Tuesday:

Bought: 2 bananas (one was smaller, but he still bought 2)
Ate: 1 banana
Remaining: 4 + 2 - 1 = 5 bananas
Wednesday:

Bought: No bananas (distracted by oranges)
Ate: 1 banana
Remaining: 5 - 1 = 4 bananas
Thursday:

No shopping
Ate: 1 banana
Remaining: 4 - 1 = 3 bananas
Friday:

Bought: 2 bananas
Ate: 1 banana
Remaining: 3 + 2 - 1 = 4 bananas
Final Answer:
David has 4 bananas remaining.
```
Correct!

It’s a pity that a lot of these models are still not being released as multi-modal as it would have been fun to see what Nemotron made of my image-based questions.


> *Ok, that’s all for me for now. Hopefully, you found this article useful. If you did, please check out my profile page at [this link](https://medium.com/@thomas_reid). From there, you can see my other published stories and subscribe to get notified when I post new content.*

If you liked this content, I think you’ll find these related articles interesting too.

