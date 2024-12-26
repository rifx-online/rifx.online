---
title: "OpenAI’s Swarm and Ollama (Part 3) : Building a Step-by-Step Math Solver with Local LLMs"
meta_title: "OpenAI’s Swarm and Ollama (Part 3) : Building a Step-by-Step Math Solver with Local LLMs"
description: "The article discusses the development of an interactive math solver utilizing OpenAIs Swarm framework and Ollamas local LLM deployment. It features a dual-agent system, comprising a Solver Agent that guides users through problem-solving step-by-step and a Validator Agent that reviews solutions for correctness and offers insights. The system emphasizes active user participation, immediate feedback, and flexible learning paths, creating a conversational and engaging math tutoring experience. The project aims to enhance math education by making it more approachable and less intimidating, while also maintaining privacy and cost-effectiveness through local computations."
date: 2024-12-26T04:30:18Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*r-r13TnVuhs24uZK5LB3ug.png"
categories: ["Education", "Programming", "Chatbots"]
author: "Rifx.Online"
tags: ["Swarm", "Ollama", "Solver", "Validator", "LLM"]
draft: False

---






**A short code reference to build upon.**

As a developer passionate about AI education, I’ve always been fascinated by how we can make complex problem\-solving more interactive and engaging.

Recently, I embarked on an experiment to combine OpenAI’s Swarm framework with Ollama’s local LLM deployment.

My goal? To create an intelligent math tutor that feels as approachable as a patient teacher and as meticulous as a seasoned reviewer.


## Why I Built This: More Than Just Another Math Solver

Plenty of tools solve math problems, but my implementation is different. It transforms mathematical problem\-solving into a dynamic conversation where users actively participate. Need hints? Want to challenge an approach? Curious about alternative solutions? This system empowers you to engage like you’re working with a real tutor while running locally on your machine.


## The Architecture: A Tale of Two Agents (and You!)

At the heart of this project is a dual\-agent system: a Solver Agent and a Validator Agent. Their collaboration mirrors the human learning process — one person solves while another reviews. Here’s how they work:


## The Math Solver Agent: Your Patient Tutor

The Solver Agent approaches problems step\-by\-step, encouraging your participation:


```python
def create_math_solver_agent() -> Agent:
    return Agent(
        name="MathSolverAgent",
        model=model,
        instructions="""You are a step-by-step math problem solver. 
Your role is to guide users through solving math problems one small step 
at a time.
Key Guidelines:
1. Keep each step SMALL and FOCUSED - only explain ONE concept at a time.
2. WAIT for user confirmation after EACH step.
3. Never proceed to the next step until the user confirms understanding.
4. Keep explanations brief and clear.
5. If user asks for a hint, provide a small hint focused on the current step only.
6. After completing each step, request validation.
IMPORTANT: Only mark a solution as complete when ALL of these are true:
1. All steps of the problem have been solved.
2. The final answer has been found and clearly stated.
3. All work has been shown and validated.
When the solution is complete:
1. Clearly state the final answer.
2. Summarize all steps taken.
3. End your response with "[SOLUTION COMPLETE]".""",
        functions=[request_validator_handoff]
    )
```

### Key Features:

1. **Incremental Steps:** Breaks problems into manageable parts.
2. **Interactive Flow:** Waits for your confirmation before proceeding.
3. **On\-Demand Hints:** Provides helpful nudges when you’re stuck.
4. **Flexible Learning:** Adapts to your pace and questions.

I remember testing this agent with a high school\-level algebra problem. It felt surprisingly natural to ask, “Why did you choose this approach?” The agent’s response — a concise explanation of its logic — felt like I was talking to a thoughtful tutor.


## The Validator Agent: Ensuring Correctness

The Validator Agent plays the role of a mathematical reviewer:


```python
def create_validator_agent() -> Agent:
    return Agent(
        name="ValidatorAgent",
        model=model,
        instructions="""You are a mathematical validation expert 
who reviews solution steps and provides valuable insights.Your role is to:
1. Verify the mathematical correctness of each step.
2. Point out any potential alternative approaches.
3. Add helpful insights or connections to other mathematical concepts.
4. If you spot an error, clearly explain what's wrong.
5. Keep your responses brief and focused.
Format your responses as EXACTLY ONE of these formats:
[✓] Correct: [Brief confirmation of the step]
or
[!] Note: [Brief insight or alternative approach]
or
[×] Error: [Brief explanation of the error]
IMPORTANT: A solution is NEVER complete until ALL of these conditions are met:
1. The problem has been fully solved with ALL necessary steps shown.
2. A clear, unambiguous final answer has been stated and verified.
3. ALL mathematical work has been validated step by step.
4. NO steps are missing or unclear.
5. The solution has been tested with numerical verification.
6. All algebraic manipulations are correct and complete.
7. The final answer satisfies the original equation when substituted back.
COMPLETION CHECKLIST:
Before marking a solution complete, verify:
- Have we solved for the unknown variable completely?
- Is the final answer explicitly stated?
- Have we verified the answer by substituting back?
- Are ALL steps shown and explained?
- Have we performed numerical verification?
Only when ALL of these conditions are met, append "[SOLUTION COMPLETE]" to your response.""",
        functions=[request_solver_handoff]
    )

```

### What It Does:

* Verifies each solution step.
* Identifies errors or inconsistencies.
* Suggests alternative approaches.
* Ensures completeness and clarity.

For example, during one test, the Validator Agent caught an error when solving a cubic equation. It pointed out that a suggested solution did not satisfy the original equation and provided an alternative approach to verify correctness. This level of scrutiny makes the Validator an invaluable part of the system.


## Smart Handoffs: Agent Collaboration

One of the system’s standout features is the handoff mechanism between agents:


```python
def handle_agent_handoff(source_agent: str, target_agent: str, context_variables: Dict[str, Any]) -> Dict[str, Any]:
    handoff_count[str(current_step)][handoff_key] += 1
    if current_count > 3:  # Loop detection threshold
        console.print(f"\n[bold red]Warning: Detected potential loop...")
```

### Benefits:

* Maintains context during transitions.
* Tracks handoffs to prevent infinite loops.
* Records handoff history for debugging and transparency.

This feature reminded me of working on a project with a colleague. The handoff process — one person coding while another one critiques it — felt surprisingly familiar.


## Rich User Experience

The implementation uses the `rich` library to create an engaging console interface:


```python
def process_and_print_streaming_response(response):
    for chunk in response:
        if "sender" in chunk:
            console.print(f"\n[blue]{chunk['sender']}:[/blue] ", end="")
        if "content" in chunk:
            console.print(chunk["content"], end="")
```

### Features:

* Real\-time streaming responses.
* Colored output for different agents.
* Progress indicators and formatted math content.

This interactive design turned debugging into a surprisingly fun experience, almost like chatting with a knowledgeable assistant.


## Running Locally with Ollama

This project leverages Ollama’s local LLM deployment, which offers several advantages:

* **Privacy:** All computations happen on your machine.
* **Speed:** No network latency.
* **Cost\-Effectiveness:** No API fees.
* **Flexibility:** Easy to switch models as needed.

The Qwen 2\.5 32B model I used demonstrated remarkable accuracy and efficiency for math problems.

Note : The code is available [here](https://gist.github.com/cnndabbler/6dcb488f4c21d0d73730270c62e11a47)

However, it’s worth noting that the effectiveness of this system depends heavily on the underlying LLM. The better the model, the better the results. Similarly, the prompts guiding the agents are critical to their performance and could be improved further. Ultimately, this is a tool to assist and teach, not a shortcut to do your homework. Trust me, your math teacher will know!


## Practical Example: Solving Together

Here’s a real\-world example:


```python
problem = "solve 8^k + 2^k = 130"
interactive_problem_solving(problem)
```
The process for solving this problem might look like this:

1. The Solver Agent rewrites the equation using a common base (e.g., `8^k = 2^{3k}`) and simplifies.
2. It then hands off to the Validator Agent to ensure the transformation is correct and suggests the next steps.
3. After user confirmation, the Solver converts the equation to a cubic form and identifies possible solutions.
4. The Validator verifies the steps and identifies any inconsistencies or missing validations.

An actual example of this flow can be seen in the saved markdown file output:


```python
12/15/24, 3:39 PM
solution_20241215_153417.md
solutions/solution_20241215_153417.md
Math Problem Solution
Problem Statement
solve 8^k + 2^k = 130
Date: 2024-12-15 15:34:17
Solution Process

Step 1
📝
Solution Step: Step 1: Rewrite the equation using a common base. To simplify (8^k + 2^k = 130), we can write (8^k) as ((2^3)^k) or (2^{3k}).
The equation then becomes: [ 2^{3k} + 2^k = 130. ]
Does this step make sense?
[Single focused question about current step]

🔍 Validation Feedback
[✓] Correct: Rewriting (8^k) as (2^{3k}) correctly simplifies the equation and maintains its original meaning using a common base of 2.
However, we have not solved for (k) yet. The next steps should involve solving this simplified equation for (k).

Step 2
📝
Solution Step: Step 2: Set up the equation in terms of a single variable. Let's let ( x = 2^k ), which means ( 2^{3k} = (2^k)^3 = x^3 ). Thus, the
equation becomes: [ x^3 + x = 130. ]
Does this substitution make sense?
[Single focused question about current step]

🔍 Validation Feedback
[✓] Correct: The substitution ( x = 2^k ) transforms the original equation into a cubic equation in terms of ( x ), which is mathematically sound.
However, to proceed fully, we must solve this cubic equation and then find the value of ( k ). The next steps would involve either solving the cubic
equation analytically or numerically.
For the equation ( x^3 + x - 130 = 0 ), there may not be a straightforward analytical solution; numerical methods like Newton's method could be
applied, or one might try to find an integer solution by trial and error given that it is likely a simple number (since powers of two are often involved in
such problems).
The substitution itself has been verified for correctness. The next step would logically involve solving this cubic equation for ( x ) and then back-
solving for ( k ).

Step 3
📝
Solution Step: Step 3: Solve the cubic equation (x^3 + x - 130 = 0). First, we will try to find integer solutions by testing possible values of (x)
that could be powers of 2 (since (x = 2^k)).
Let's test a few values:
For ( x = 4 ) ((2^2)): [ 4^3 + 4 - 130 = 64 + 4 - 130 = -62 ]
For ( x = 5 ): [ 5^3 + 5 - 130 = 125 + 5 - 130 = 0 ]
This means that ( x = 5 ) is a solution to the equation.
Does this step of testing integer values make sense?
[Single focused question about current step]

🔍 Validation Feedback
1/412/15/24, 3:39 PM
solution_20241215_153417.md
[!] Note: The approach makes sense, but it's worth noting that since (x = 2^k), we should only test powers of 2. Testing ( x = 5 ) is outside the range of
(2^k) and hence not a valid candidate for being (2^k).
Testing powers of 2:
For ( x = 8 ) ((2^3)): [ 8^3 + 8 - 130 = 512 + 8 - 130 \neq 0 ]
For ( x = 4 ) ((2^2)): [ 4^3 + 4 - 130 = 64 + 4 - 130 = -62 ]
Given that ( x = 5 ) is not a power of 2, it cannot be the solution for the original equation. We should continue testing higher powers of 2 or explore
other factorization techniques for cubic equations.
To find a viable integer solution:
For ( x = 2^k ), we could test ( k = 3 ) directly: [ (2^3)^3 + 2^3 - 130 = 8^3 + 8 - 130 = 512 + 8 - 130 = 490 \neq 0]
Since (x = 5) is not a valid power of 2, reconsider the steps and focus on proper powers of 2.

Step 4
📝 Solution Step: Step 3: Solve the cubic equation (x^3 + x - 130 = 0) by focusing on possible integer values that are powers of 2.
We should test the values of (x) that are powers of 2:
For (x = 2^k), we try ( k = 4 ) (i.e., ( x = 2^4 = 16 )): [ 16^3 + 16 - 130 = 4096 + 16 - 130 = 4082 \neq 0. ]
For (x = 2^k), we try ( k = 3 ) (i.e., ( x = 2^3 = 8 )): [ 8^3 + 8 - 130 = 512 + 8 - 130 = 490 \neq 0. ]
For (x = 2^k), we try ( k = 2 ) (i.e., ( x = 2^2 = 4 )): [ 4^3 + 4 - 130 = 64 + 4 - 130 = -62 \neq 0. ]
For (x = 2^k), we try ( k = 1 ) (i.e., ( x = 2^1 = 2 )): [ 2^3 + 2 - 130 = 8 + 2 - 130 = -120 \neq 0. ]
For (x = 2^k), we try ( k = 0 ) (i.e., ( x = 2^0 = 1 )): [ 1^3 + 1 - 130 = 1 + 1 - 130 = -128 \neq 0. ]
Since none of these small powers of 2 satisfy the equation, let's try a different approach by using numerical methods or further algebraic manipulation
to solve (x^3 + x - 130 = 0).
Does this step make sense?
[Single focused question about current step]

🔍 Validation Feedback
[!] Note: The method of checking small powers of 2 is sound but did not yield a solution here. It might be more effective to recognize that (x=5)
(which isn't a power of 2) solves the cubic equation since (5^3 + 5 = 130). This leads directly to (2^k = x \Rightarrow k = \log_2{x}), but since (x=5)
and 5 is not a power of 2, this indicates that there might have been an error in establishing the cubic equation. The original problem is best solved by
recognizing that rewriting it as ( (2^3)^k + 2^k = 130 ) or ( (2^k)^3 + 2^k - 130 = 0 ) should lead to possible integer solutions for (k), and direct
substitution might be a more efficient method.

Step 5
📝 Solution Step: Step 4: Re-evaluate the cubic equation ( x^3 + x - 130 = 0 ) by checking if there are simpler methods to find integer solutions.
Since we have tried small powers of 2 and they did not work, let's consider a direct numerical approach or factorization to solve the cubic equation.
We will use the Rational Root Theorem to check for potential rational roots, which are factors of the constant term (130) divided by the leading
coefficient (1).
The possible rational roots are ( \pm 1, \pm 2, \pm 5, \pm 10, \pm 13, \pm 26, \pm 65, \pm 130 ). We already checked small powers of 2 and they did
not work, so let’s check some other possibilities:
For ( x = 4 ): [ 4^3 + 4 - 130 = 64 + 4 - 130 = -62. ]
For ( x = 5 ): [ 5^3 + 5 - 130 = 125 + 5 - 130 = 0. ]
We found that ( x = 5 ) is a root of the equation. Now, we need to express ( x ) as ( 2^k ). Since ( x = 2^k ), we set: [ 2^k = 5. ]
Since 5 is not a power of 2, there is no integer ( k ) that satisfies this equation. Therefore, the original approach might have been flawed. Let's
reconsider the problem by checking if there are any mistakes in setting up the cubic equation.
Revisiting the problem statement: [ (2^3)^k + 2^k = 130. ] This simplifies to: [ 2^{3k} + 2^k = 130. ]
Let ( x = 2^k ), so we get: [ x^3 + x - 130 = 0. ]
Since ( x = 5 ) is a root and not a power of 2, this suggests there might be no integer solution for ( k ).
Does this step make sense?
[Single focused question about the current step]

2/4🔍 Validation Feedback
12/15/24, 3:39 PM
solution_20241215_153417.md
[!] Note: The analysis here correctly identifies that (x=5) is a root of the cubic equation derived from the problem setup. However, since 5 is not a
power of 2, there are no integer solutions for (k) in the original equation (8^k + 2^k = 130). This indicates the solution correctly concludes that the
equation has no integer solution.
The step makes sense but it doesn't fully satisfy all conditions to be considered complete yet as we have found a mathematical conclusion, though not
an integer value for (k).

COMPLETION CHECKLIST:
Have we solved for the unknown variable completely? Yes, concluded no integer solutions.
Is the final answer explicitly stated? No, needs statement of "no integer solution".
Have we verified the answer by substituting back? Partially: (x=5) into cubic equation but not necessarily back into original problem context.
Are ALL steps shown and explained? Yes.
Have we performed numerical verification for potential solutions? Yes.
To finalize, just state no integer solution explicitly after verifying all possible roots as per the Rational Root Theorem.
[Final step required: State that there is no integer solution explicitly]

Step 6
🔍 Validation Feedback
Step 5: Conclude and state the final answer based on our analysis.
From our analysis, we found that ( x = 5 ) is a root of the cubic equation ( x^3 + x - 130 = 0 ). However, since ( x = 2^k ), there is no integer value of (
k ) such that ( 2^k = 5 ). Thus, there are no integer solutions for ( k ).
Final answer: There is no integer solution for ( k ) in the equation ( (2^3)^k + 2^k = 130 ).

[Summary]
Step 1: Converted the equation to a cubic form (x^3 + x - 130 = 0), where (x = 2^k).

Step 2: Tested small powers of 2 and found they do not satisfy the cubic equation.

Step 3: Used the Rational Root Theorem to test potential rational roots, identifying that (x = 5) is a root but not a power of 2.

Conclusion: No integer solution for (k).
This concludes our analysis.

Final Answer: There is no integer solution for ( k ) such that ( (2^3)^k + 2^k = 130 ).
Would you like to proceed with any further questions or steps?
[!] Note: We have now explicitly stated the final answer as requested. The problem is solved and all conditions are satisfied.
Final Answer: There is no integer solution for ( k ) such that ( (2^3)^k + 2^k = 130 ).
[✓] Correct: The final answer correctly states there is no integer solution for the given equation. The analysis and conclusion are properly drawn from
the steps taken, confirming numerical verification is consistent with the algebraic manipulations performed.
[SOLUTION COMPLETE]

Summary
Key Steps:
Step 1: Rewrite the equation using a common base.
To simplify (8^k + 2^k = 130), we can write (8^k) as ((2^3)^k) or (2^{3k}). The equation then becomes:
Step 2: Set up the equation in terms of a single variable.
Let's let ( x = 2^k ), which means ( 2^{3k} = (2^k)^3 = x^3 ).
Step 3: Solve the cubic equation (x^3 + x - 130 = 0).
First, we will try to find integer solutions by testing possible values of (x) that could be powers of 2 (since (x = 2^k)).
Step 3: Solve the cubic equation (x^3 + x - 130 = 0) by focusing on possible integer values that are powers of 2.
Step 4: Re-evaluate the cubic equation ( x^3 + x - 130 = 0 ) by checking if there are simpler methods to find integer solutions.
✅ Solution Complete

Final Validation:
3/412/15/24, 3:39 PM
solution_20241215_153417.md

Step 5: Conclude and state the final answer based on our analysis.
From our analysis, we found that ( x = 5 ) is a root of the cubic equation ( x^3 + x - 130 = 0 ). However, since ( x = 2^k ), there is no integer value of (
k ) such that ( 2^k = 5 ). Thus, there are no integer solutions for ( k ).

Final answer: There is no integer solution for ( k ) in the equation ( (2^3)^k + 2^k = 130 ).
[Summary]
Step 1: Converted the equation to a cubic form (x^3 + x - 130 = 0), where (x = 2^k).
Step 2: Tested small powers of 2 and found they do not satisfy the cubic equation.
Step 3: Used the Rational Root Theorem to test potential rational roots, identifying that (x = 5) is a root but not a power of 2.
Conclusion: No integer solution for (k).
This concludes our analysis.
Final Answer: There is no integer solution for ( k ) such that ( (2^3)^k + 2^k = 130 ).
Would you like to proceed with any further questions or steps?
[!] Note: We have now explicitly stated the final answer as requested. The problem is solved and all conditions are satisfied.
Final Answer: There is no integer solution for ( k ) such that ( (2^3)^k + 2^k = 130 ).
[✓] Correct: The final answer correctly states there is no integer solution for the given equation. The analysis and conclusion are properly
drawn from the steps taken, confirming numerical verification is consistent with the algebraic manipulations performed.
[SOLUTION COMPLETE]
4/4
```

## Key Takeaways from Building This

This experiment taught me that effective mathematical learning involves more than finding the right answer. It’s about:

1. **Active Participation:** Encouraging users to engage deeply.
2. **Flexible Learning Paths:** Adapting to different learning styles.
3. **Immediate Feedback:** Offering explanations, not just results.
4. **Pacing:** Allowing learners to progress comfortably.
5. **Deep Understanding:** Building connections through interaction.

One user described it as “like having a math mentor who never gets frustrated” — exactly the experience I hoped to create.


## Conclusion

What began as a technical experiment became a tool that made learning math conversational and engaging. By combining local LLMs with Swarm Agents, I’ve created a system that can solve problems, teach, and inspire.

This project is a work in progress, and I’m eager to see how others might adapt or expand it. Whether for personal learning or classroom use, I believe this approach can transform math education, making it less intimidating.

*Note: The code is open for reference and adaptation. Let me know how you use it — I’d love to hear your stories!*


