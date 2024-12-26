---
title: "OpenAI 的 Swarm 和 Ollama（第 3 部分）：利用本地 LLM 逐步构建数学求解器"
meta_title: "OpenAI 的 Swarm 和 Ollama（第 3 部分）：利用本地 LLM 逐步构建数学求解器"
description: "本文介绍了一种基于OpenAI的Swarm框架和Ollama本地LLM的数学解题器，旨在提供互动式的数学学习体验。该系统由求解代理和验证代理组成，模拟人类学习过程，逐步引导用户解决数学问题并进行验证。其主要特点包括增量步骤、互动流程和灵活学习，强调用户的主动参与和即时反馈。项目利用本地运行的LLM，确保隐私性、速度和成本效益，最终目标是改变数学教育，使其更具吸引力和有效性。"
date: 2024-12-26T01:27:52Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*r-r13TnVuhs24uZK5LB3ug.png"
categories: ["Education", "Programming", "Chatbots"]
author: "Rifx.Online"
tags: ["Swarm", "Ollama", "Solver", "Validator", "LLM"]
draft: False

---





**一个简短的代码参考供构建使用。**

作为一名热衷于AI教育的开发者，我一直对如何使复杂问题解决变得更加互动和吸引人充满兴趣。

最近，我开始了一项实验，旨在将OpenAI的Swarm框架与Ollama的本地LLM部署结合起来。

我的目标？创建一个智能的数学辅导员，既像耐心的老师一样平易近人，又像经验丰富的审阅者一样细致入微。

## 我为什么构建这个：不仅仅是另一个数学求解器

有很多工具可以解决数学问题，但我的实现有所不同。它将数学问题解决转变为一种动态对话，用户可以积极参与。需要提示吗？想要挑战某种方法吗？对替代解决方案感到好奇吗？这个系统使您能够像与真正的辅导老师一起工作一样进行互动，同时在您的机器上本地运行。

## 架构：两个代理（和你！）的故事

这个项目的核心是一个双代理系统：求解代理和验证代理。它们的协作反映了人类学习的过程——一个人解决问题，而另一个人进行审查。它们的工作方式如下：

## 数学求解代理：您耐心的辅导员

求解代理逐步解决问题，鼓励您的参与：

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

### 主要特点：

1. **增量步骤：** 将问题分解为可管理的部分。
2. **互动流程：** 在继续之前等待您的确认。
3. **按需提示：** 在您遇到困难时提供有用的提示。
4. **灵活学习：** 适应您的节奏和问题。

我记得用这个代理测试一个高中水平的代数问题。问“你为什么选择这种方法？”感觉出奇的自然。代理的回答——对其逻辑的简洁解释——让我觉得像是在和一位深思熟虑的导师交谈。

## 验证者代理：确保正确性

验证者代理扮演着数学审阅者的角色：

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

### 它的功能：

* 验证每个解决步骤。
* 识别错误或不一致之处。
* 提出替代方法。
* 确保完整性和清晰性。

例如，在一次测试中，验证器代理在求解一个三次方程时发现了一个错误。它指出一个建议的解决方案未满足原始方程，并提供了一个替代方法来验证正确性。这种严格的审查使得验证器成为系统中不可或缺的一部分。

## 智能交接：代理协作

系统的一个突出特点是代理之间的交接机制：


```python
def handle_agent_handoff(source_agent: str, target_agent: str, context_variables: Dict[str, Any]) -> Dict[str, Any]:
    handoff_count[str(current_step)][handoff_key] += 1
    if current_count > 3:  # Loop detection threshold
        console.print(f"\n[bold red]Warning: Detected potential loop...")
```

### 优势：

* 在过渡期间保持上下文。
* 跟踪交接以防止无限循环。
* 记录交接历史以便调试和透明性。

这个功能让我想起了和同事一起工作的一个项目。交接过程——一个人编码而另一个人进行批评——让我感到出奇的熟悉。

## 丰富的用户体验

该实现使用 `rich` 库来创建引人入胜的控制台界面：

```python
def process_and_print_streaming_response(response):
    for chunk in response:
        if "sender" in chunk:
            console.print(f"\n[blue]{chunk['sender']}:[/blue] ", end="")
        if "content" in chunk:
            console.print(chunk["content"], end="")
```

### 特性：

* 实时流式响应。
* 不同代理的彩色输出。
* 进度指示器和格式化数学内容。

这种互动设计使调试变成了一种令人惊讶的有趣体验，几乎就像与一个知识渊博的助手聊天。

## 本地运行 Ollama

该项目利用了 Ollama 的本地 LLM 部署，提供了几个优势：

* **隐私性：** 所有计算都在您的机器上进行。
* **速度：** 无网络延迟。
* **成本效益：** 无 API 费用。
* **灵活性：** 根据需要轻松切换模型。

我使用的 Qwen 2.5 32B 模型在数学问题上表现出色，精确度和效率都很高。

注意：代码可在 [这里](https://gist.github.com/cnndabbler/6dcb488f4c21d0d73730270c62e11a47) 找到。

然而，值得注意的是，该系统的有效性在很大程度上依赖于底层的 LLM。模型越好，结果越好。同样，指导代理的提示对其性能至关重要，并且可以进一步改进。最终，这是一种辅助和教学的工具，而不是完成作业的捷径。相信我，您的数学老师会知道的！

## 实际示例：共同解决

这是一个现实世界的例子：

```python
problem = "solve 8^k + 2^k = 130"
interactive_problem_solving(problem)
```
解决此问题的过程可能如下所示：

1. 解决者代理使用共同的基数重写方程（例如，`8^k = 2^{3k}`）并进行简化。
2. 然后将其交给验证者代理，以确保变换是正确的，并建议下一步。
3. 在用户确认后，解决者将方程转换为三次方形式并识别可能的解。
4. 验证者验证步骤并识别任何不一致或缺失的验证。

可以在保存的Markdown文件输出中看到此流程的实际示例：

```python
12/15/24, 3:39 PM
solution_20241215_153417.md
solutions/solution_20241215_153417.md
数学问题解决方案
问题陈述
solve 8^k + 2^k = 130
日期：2024-12-15 15:34:17
解决过程

步骤 1
📝
解决步骤：步骤 1：使用共同的基数重写方程。为了简化 (8^k + 2^k = 130)，我们可以将 (8^k) 写为 ((2^3)^k) 或 (2^{3k})。
方程变为：[ 2^{3k} + 2^k = 130. ]
这一步有意义吗？
[关于当前步骤的单一聚焦问题]

🔍 验证反馈
[✓] 正确：将 (8^k) 重写为 (2^{3k}) 正确地简化了方程，并保持了其原始含义，使用共同的基数 2。
但是，我们还没有解出 (k)。下一步应该涉及为 (k) 解这个简化方程。

步骤 2
📝
解决步骤：步骤 2：将方程设置为单一变量。让我们设 ( x = 2^k )，这意味着 ( 2^{3k} = (2^k)^3 = x^3 )。因此，方程变为：[ x^3 + x = 130. ]
这个替换有意义吗？
[关于当前步骤的单一聚焦问题]

🔍 验证反馈
[✓] 正确：替换 ( x = 2^k ) 将原始方程转化为关于 ( x ) 的三次方程，这是数学上合理的。
但是，要完全进行下去，我们必须解这个三次方程，然后找到 ( k ) 的值。下一步将涉及以解析或数值方式解决这个三次方程。
对于方程 ( x^3 + x - 130 = 0 )，可能没有直接的解析解；可以应用牛顿法等数值方法，或者可以尝试通过试错找到一个整数解，因为它可能是一个简单的数字（因为在此类问题中涉及的通常是2的幂）。
替换本身已被验证为正确。下一步显然应该是为 ( x ) 解这个三次方程，然后再回解 ( k )。

步骤 3
📝
解决步骤：步骤 3：解三次方程 (x^3 + x - 130 = 0)。首先，我们将尝试通过测试可能的 (x) 值来寻找整数解，这些值可能是2的幂（因为 (x = 2^k)）。
让我们测试几个值：
对于 ( x = 4 ) ((2^2)): [ 4^3 + 4 - 130 = 64 + 4 - 130 = -62 ]
对于 ( x = 5 ): [ 5^3 + 5 - 130 = 125 + 5 - 130 = 0 ]
这意味着 ( x = 5 ) 是方程的一个解。
这一步测试整数值有意义吗？
[关于当前步骤的单一聚焦问题]

🔍 验证反馈
1/412/15/24, 3:39 PM
solution_20241215_153417.md
[!] 注意：这个方法是合理的，但值得注意的是，由于 (x = 2^k)，我们只应该测试2的幂。测试 ( x = 5 ) 超出了 (2^k) 的范围，因此不是有效的候选解。
测试2的幂：
对于 ( x = 8 ) ((2^3)): [ 8^3 + 8 - 130 = 512 + 8 - 130 \neq 0 ]
对于 ( x = 4 ) ((2^2)): [ 4^3 + 4 - 130 = 64 + 4 - 130 = -62 ]
由于 ( x = 5 ) 不是2的幂，因此它不能是原始方程的解。我们应该继续测试更高的2的幂，或者探索其他三次方程的因式分解技术。
为了找到一个可行的整数解：
对于 ( x = 2^k )，我们可以直接测试 ( k = 3 )：[ (2^3)^3 + 2^3 - 130 = 8^3 + 8 - 130 = 512 + 8 - 130 = 490 \neq 0]
由于 (x = 5) 不是一个有效的2的幂，重新考虑步骤并专注于正确的2的幂。

步骤 4
📝 解决步骤：步骤 3：通过关注可能是2的幂的整数值来解三次方程 (x^3 + x - 130 = 0)。
我们应该测试 (x) 的值，这些值是2的幂：
对于 (x = 2^k)，我们尝试 ( k = 4 )（即，( x = 2^4 = 16 ））：[ 16^3 + 16 - 130 = 4096 + 16 - 130 = 4082 \neq 0. ]
对于 (x = 2^k)，我们尝试 ( k = 3 )（即，( x = 2^3 = 8 ））：[ 8^3 + 8 - 130 = 512 + 8 - 130 = 490 \neq 0. ]
对于 (x = 2^k)，我们尝试 ( k = 2 )（即，( x = 2^2 = 4 ））：[ 4^3 + 4 - 130 = 64 + 4 - 130 = -62 \neq 0. ]
对于 (x = 2^k)，我们尝试 ( k = 1 )（即，( x = 2^1 = 2 ））：[ 2^3 + 2 - 130 = 8 + 2 - 130 = -120 \neq 0. ]
对于 (x = 2^k)，我们尝试 ( k = 0 )（即，( x = 2^0 = 1 ））：[ 1^3 + 1 - 130 = 1 + 1 - 130 = -128 \neq 0. ]
由于这些小的2的幂都不满足方程，让我们尝试通过使用数值方法或进一步的代数变换来解决 (x^3 + x - 130 = 0)。
这一步有意义吗？
[关于当前步骤的单一聚焦问题]

🔍 验证反馈
[!] 注意：检查小的2的幂的方法是合理的，但在这里没有得到解决方案。可能更有效的是认识到 (x=5)（这不是2的幂）解了三次方程，因为 (5^3 + 5 = 130)。这直接导致 (2^k = x \Rightarrow k = \log_2{x})，但由于 (x=5) 而且5不是2的幂，这表明在建立三次方程时可能存在错误。原始问题最好通过认识到将其重写为 ( (2^3)^k + 2^k = 130 ) 或 ( (2^k)^3 + 2^k - 130 = 0 ) 来解决，这应该会导致 (k) 的可能整数解，直接替换可能是一种更有效的方法。

步骤 5
📝 解决步骤：步骤 4：通过检查是否有更简单的方法来找到整数解来重新评估三次方程 ( x^3 + x - 130 = 0 )。
由于我们已经尝试了小的2的幂，并且没有成功，让我们考虑直接的数值方法或因式分解来解决三次方程。
我们将使用有理根定理来检查潜在的有理根，这些根是常数项 (130) 除以首项系数 (1) 的因子。
可能的有理根是 ( \pm 1, \pm 2, \pm 5, \pm 10, \pm 13, \pm 26, \pm 65, \pm 130 )。我们已经检查了小的2的幂，但它们没有成功，所以让我们检查一些其他可能性：
对于 ( x = 4 ): [ 4^3 + 4 - 130 = 64 + 4 - 130 = -62. ]
对于 ( x = 5 ): [ 5^3 + 5 - 130 = 125 + 5 - 130 = 0. ]
我们发现 ( x = 5 ) 是方程的一个根。现在，我们需要将 ( x ) 表达为 ( 2^k )。由于 ( x = 2^k )，我们设置：[ 2^k = 5. ]
由于5不是2的幂，因此没有整数 ( k ) 满足这个方程。因此，原始方法可能存在缺陷。让我们重新考虑问题，检查在设置三次方程时是否有任何错误。
重新审视问题陈述：[ (2^3)^k + 2^k = 130. ] 这简化为：[ 2^{3k} + 2^k = 130. ]
让 ( x = 2^k )，因此我们得到：[ x^3 + x - 130 = 0. ]
由于 ( x = 5 ) 是一个根而不是2的幂，这表明可能没有整数解 ( k )。
这一步有意义吗？
[关于当前步骤的单一聚焦问题]

2/4🔍 验证反馈
12/15/24, 3:39 PM
solution_20241215_153417.md
[!] 注意：这里的分析正确地识别出 (x=5) 是从问题设置派生的三次方程的根。然而，由于5不是2的幂，因此在原始方程 (8^k + 2^k = 130) 中没有整数解 (k)。这表明解决方案正确地得出结论，即方程没有整数解。
这一步是合理的，但它并没有完全满足所有条件以被认为是完整的，因为我们找到了一个数学结论，尽管没有 (k) 的整数值。

完成检查清单：
我们是否完全解出了未知变量？是的，得出没有整数解的结论。
最终答案是否明确说明？没有，需要说明“没有整数解”。
我们是否通过回代验证了答案？部分地：将 (x=5) 代入三次方程，但不一定回代入原始问题上下文。
所有步骤是否都显示并解释？是的。
我们是否对潜在解进行了数值验证？是的。
最后，只需在验证所有可能根后明确说明没有整数解。

步骤 6
🔍 验证反馈
步骤 5：根据我们的分析得出结论并陈述最终答案。
根据我们的分析，我们发现 ( x = 5 ) 是三次方程 ( x^3 + x - 130 = 0 ) 的根。然而，由于 ( x = 2^k )，没有整数值 ( k ) 使得 ( 2^k = 5 )。因此，( k ) 没有整数解。
最终答案：在方程 ( (2^3)^k + 2^k = 130 ) 中，( k ) 没有整数解。

[总结]
步骤 1：将方程转换为三次方形式 (x^3 + x - 130 = 0)，其中 (x = 2^k)。

步骤 2：测试小的2的幂，发现它们不满足三次方程。

步骤 3：使用有理根定理测试潜在的有理根，识别出 (x = 5) 是一个根，但不是2的幂。

结论：没有 (k) 的整数解。
这结束了我们的分析。

最终答案：在方程 ( (2^3)^k + 2^k = 130 ) 中，( k ) 没有整数解。
您想继续进行任何进一步的问题或步骤吗？
[!] 注意：我们现在已经明确说明了最终答案，如请求的那样。问题已解决，所有条件均已满足。
最终答案：在方程 ( (2^3)^k + 2^k = 130 ) 中，( k ) 没有整数解。
[✓] 正确：最终答案正确地说明了给定方程没有整数解。分析和结论正确地从所采取的步骤中得出，确认数值验证与进行的代数操作一致。
[解决方案完成]

总结
关键步骤：
步骤 1：使用共同的基数重写方程。
为了简化 (8^k + 2^k = 130)，我们可以将 (8^k) 写为 ((2^3)^k) 或 (2^{3k})。方程变为：
步骤 2：将方程设置为单一变量。
让我们设 ( x = 2^k )，这意味着 ( 2^{3k} = (2^k)^3 = x^3 )。
步骤 3：解三次方程 (x^3 + x - 130 = 0)。
首先，我们将尝试通过测试可能的 (x) 值来寻找整数解，这些值可能是2的幂（因为 (x = 2^k)）。
步骤 3：通过关注可能是2的幂的整数值来解三次方程 (x^3 + x - 130 = 0)。
步骤 4：通过检查是否有更简单的方法来找到整数解来重新评估三次方程 ( x^3 + x - 130 = 0 )。
✅ 解决方案完成

最终验证：
3/412/15/24, 3:39 PM
solution_20241215_153417.md

步骤 5：根据我们的分析得出结论并陈述最终答案。
根据我们的分析，我们发现 ( x = 5 ) 是三次方程 ( x^3 + x - 130 = 0 ) 的根。然而，由于 ( x = 2^k )，没有整数值 ( k ) 使得 ( 2^k = 5 )。因此，( k ) 没有整数解。

最终答案：在方程 ( (2^3)^k + 2^k = 130 ) 中，( k ) 没有整数解。
[总结]
步骤 1：将方程转换为三次方形式 (x^3 + x - 130 = 0)，其中 (x = 2^k)。
步骤 2：测试小的2的幂，发现它们不满足三次方程。
步骤 3：使用有理根定理测试潜在的有理根，识别出 (x = 5) 是一个根，但不是2的幂。
结论：没有 (k) 的整数解。
这结束了我们的分析。
最终答案：在方程 ( (2^3)^k + 2^k = 130 ) 中，( k ) 没有整数解。
您想继续进行任何进一步的问题或步骤吗？
[!] 注意：我们现在已经明确说明了最终答案，如请求的那样。问题已解决，所有条件均已满足。
最终答案：在方程 ( (2^3)^k + 2^k = 130 ) 中，( k ) 没有整数解。
[✓] 正确：最终答案正确地说明了给定方程没有整数解。分析和结论正确地从所采取的步骤中得出，确认数值验证与进行的代数操作一致。
[解决方案完成]
4/4
```

## 从构建这个项目中的关键收获

这个实验让我明白，有效的数学学习不仅仅是找到正确答案。它还涉及到：

1. **主动参与：** 鼓励用户深入参与。
2. **灵活的学习路径：** 适应不同的学习风格。
3. **即时反馈：** 提供解释，而不仅仅是结果。
4. **节奏控制：** 让学习者能够舒适地进步。
5. **深入理解：** 通过互动建立联系。

一位用户形容它为“就像拥有一个永远不感到沮丧的数学导师”——这正是我希望创造的体验。

## 结论

最初作为一项技术实验的项目，现已成为一个使数学学习变得对话化和引人入胜的工具。通过将本地 LLM 与 Swarm Agents 结合，我创建了一个能够解决问题、教学和激励的系统。

该项目仍在进行中，我期待看到其他人如何适应或扩展它。无论是个人学习还是课堂使用，我相信这种方法可以改变数学教育，使其不再令人畏惧。

*注意：代码开放供参考和适应。请告诉我您如何使用它——我很想听听您的故事！*

