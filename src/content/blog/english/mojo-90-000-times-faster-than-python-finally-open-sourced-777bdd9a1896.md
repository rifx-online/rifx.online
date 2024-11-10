---
title: "Mojo, 90,000 Times Faster Than Python, Finally Open Sourced!"
meta_title: "Mojo, 90,000 Times Faster Than Python, Finally Open Sourced!"
description: "On March 29, 2024, Modular Inc. announced the open sourcing of the core components of Mojo."
date: 2024-11-10T22:36:54Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*jcayumihC6jn5q_0"
categories: ["Programming", "Machine Learning", "Data Science"]
author: "Rifx.Online"
tags: ["Mojo", "Python", "MLIR", "SIMD", "open-source"]
draft: False

---

On March 29, 2024, Modular Inc. announced the open sourcing of the core components of Mojo.

Mojo is a programming language designed specifically for writing artificial intelligence software, officially launched in August of last year. It has since amassed over 175,000 developers and 50,000 organizations.

Artificial intelligence models are often written in multiple programming languages. Developers typically use Python to implement the simplest parts of neural networks, as it is easy to learn but relatively slow. The remaining code is often written in C\+\+, which is faster but more complex to learn.

Modular positions Mojo as a more convenient alternative. It offers an easy\-to\-use syntax similar to Python but with the potential for thousands of times faster execution speed. Therefore, developers can write fast AI models without needing to learn complex languages like C\+\+.



Last year, when Mojo was introduced, some developers expressed excitement about its emergence. However, when asked about the open\-source date, Chris Lattner said on Discord, “If I knew, I’d tell you.” For about a year, many developers have been in a state of observation and questioning:

> “The promotion is great, but if it’s not open source, I won’t spend any time trying it.”

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*rIJiJylh4-mWBiqz)

> “It’s clearly an overhyped programming language, and it’s not open source! Chris Lattner wants to deceive millions of Python developers!”

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*0u5HDKseL0Gy_-8A)

> “I can’t spend time on a language that might or might not be open source, especially considering the current commercial environment of OSS…”

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*wrTO7fbKfBZOpBxF)

Now, Mojo is finally open source! And within a short period, it has already reached 17\.6k stars and has 2\.1k forks!

## 01 The First Step of Mojo’s Open Source Journey

Modular announced today the open sourcing of the core components of Mojo’s standard library. The standard library constitutes the core part of a programming language, containing basic syntax elements and essential features. Mojo’s standard library includes functionalities for optimizing AI hyperparameters, which determine how neural networks process data.

“The Mojo standard library is still undergoing vigorous development and rapid changes, so we are open sourcing its core modules first. This marks an important starting point for our open source journey, not the end.”

The company states that open sourcing will enable them to gather feedback from more developers, facilitating the better development of Mojo. Moreover, there are various ways to open source projects: some projects provide source code but do not accept contributions; some offer opaque contribution processes, making it difficult to understand goals and roadmaps; and some, though open source, are not actively maintained. Modular states that they have chosen a more thorough approach to open source: allowing external contributions via GitHub pull requests, encouraging developers to participate in Mojo’s development and improvement, and fostering community growth.

Furthermore, Modular demonstrates sincerity by sharing the complete commit history, starting from the initial commit! Openly revising the history of the open standard library allows developers to track the evolution of the code and better understand its meaning.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*0-FqkfLUTevloPjI)

In addition, they will release nightly builds of the Mojo compiler, facilitating developers to quickly try out the latest compiler features and undergo continuous integration testing.

At the end of last year, Modular launched the commercial AI platform MAX, which is a unified set of tools and libraries for building high\-performance AI applications that can be efficiently deployed across multiple hardware platforms, such as running AI applications in Kubernetes environments. Today, the company revealed that they also plan to open source some components of MAX in the future.

Moreover, it is worth mentioning that they have chosen the Apache 2 LLVM license for open sourcing.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*dgVCSxaCq6onY2uP)

This is a customized version of the Apache 2 license. Additionally, to facilitate integration with software following the GPL2 license, Modular has made corresponding adjustments. GPL2 is another popular open source license, famously used by projects like the Linux kernel. In the announcement blog post, Modular wrote:

> “The Apache 2 license is a good starting point, but our experience with using licenses in the LLVM project tells us that it has two minor issues. Some are concerned that the Apache 2 license may not mix well with GPL2 code (e.g., the Linux kernel), and the Apache 2 license requires you to acknowledge the use of the code in derivative projects. We hope you can use Mojo without being forced to acknowledge Modular or Mojo. Therefore, we have added LLVM’s specially designed exceptions to address these issues.”

## 02 The Best Language for AI Programming in the Next 50 Years?

Last May, when Mojo was just released, Modular claimed that it was 35,000 times faster than raw Python when running algorithms like Mandelbrot.

In September last year, Modular once again stated, “Mojo combines the advantages of dynamic and static languages, boosting performance to 68,000 times that of Python.”

In October last year, when Mojo landed on Mac, Modular raised the performance comparison data again: “90,000 times faster than Python.”

Speaking of Mojo, Modular’s founder and CEO Chris Lattner said, “You can think of Mojo as a member of the Python family, drawing on all these cool languages, compilers, and other technologies, taking Python a big step forward. We believe it enhances Python’s capabilities, gives Python programmers superpowers, allows those familiar with Python to learn new knowledge, explore, and conquer new fields without switching to C\+\+.”

Mojo is based on the latest compiler technology in MLIR, which is an evolution of LLVM, hence better performance. As long as programmers have the requisite skills and a willingness to optimize fully, they can make the code run extremely fast. The goal of the Mojo language is to meet the needs of Python developers while providing a range of new code optimization techniques to fully exploit the performance limits of hardware devices.

On the other hand, the Mojo team highly appreciates Rust and openly states that “Mojo’s design is also greatly inspired by Rust.”

In terms of performance, Modular has made many comparisons with Python to provide a clear comparison, but people do not have a concept of how much faster it is than Rust. Just last month, they specifically responded to the question of “whether Mojo is faster than Rust.”

In February of this year, Netflix engineer and Rust advocate @ThePrimeagen released a video: parsing DNA sequences with Mojo at a speed surpassing Rust by 50%. This blog post has sparked a lot of attention and discussion, after all, Rust is positioned as a potential successor to Python and C\+\+ as the dominant language in the AI field.

@ThePrimeagen’s outlook for Mojo and Rust in AI programming:

> If Mojo officially enters the fray, then I believe Mojo will undoubtedly emerge victorious. The reason Mojo will win is that it doesn’t require any changes to the paradigms developers are already familiar with. With just a little learning, you can achieve amazing performance. First of all, Mojo compiles quickly, and the user experience is very similar to languages everyone is already familiar with, with performance comparable to Rust. The only question is how to get more people to accept it.

After making the comment, Luca Palmieri, a respected Rust contributor and author of “Rust: From Zero to Production,” responded on X:

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*Hqe7bPWGI36LPGzE)

Rust boasts top\-notch ergonomic design in the realm of systems programming, but it faces two major issues in the field of AI applications:

* Slow compilation speed, while AI emphasizes experimentation and rapid iteration.
* Most AI researchers with experience in Python are reluctant to invest time in learning a new language from scratch.

Mojo aims to make it intuitive and easy for Python developers to grasp. As demonstrated by Mohamed, he learned Mojo and utilized SIMD optimization algorithms in just a few weeks as a hobby project (the initial implementation only took 200 lines of code).

For those interested in AI development, there is indeed a dilemma of choosing one of the three languages available.

Both Mojo and Rust allow developers to optimize at a lower level. For Rust, developers can certainly pack everything into Arc, Mutex, or Box to avoid conflicts with the borrow checker, but this may sacrifice some performance. While this performance difference might not have a significant impact on application code, it can quickly add up in libraries or other performance\-sensitive code. The choice between the two depends on the programmer’s focus on reducing overhead and optimizing performance.

Both languages can utilize LLVM for optimizing code generation and allow the use of inline assembly (although it’s unlikely anyone would actually do so), so theoretically, both have similar performance potential on traditional hardware.

## 03 Based on the Most Advanced Compiler Technology

Rust was initiated in 2006, while Swift emerged in 2010, with both primarily built on LLVM IR. Mojo, on the other hand, debuted in 2022, constructed upon MLIR — a more modern “next\-generation” compiler stack compared to LLVM IR used by Rust. It’s worth noting that Chris Lattner founded LLVM in December 2000 during his university days, learning a great deal from its evolution over the years. He later joined Google to lead the development of MLIR, aimed at supporting the company’s TPU and other AI accelerator projects. Subsequently, he continued his exploration based on the knowledge gained from LLVM IR.

Modular states that Mojo is the first programming language to fully leverage the advanced features of MLIR. It can generate CPU code with higher optimization and also supports GPU and other accelerators, with significantly faster speeds than Rust. This is an advantage currently unachievable by other languages, and a core reason why AI and compiler enthusiasts are enthusiastic about Mojo.

They particularly emphasize two aspects:

Outstanding SIMD ergonomic design: CPUs process multiple data elements simultaneously through special registers and instructions, known as SIMD (Single Instruction, Multiple Data). However, historically, the experience of writing such code has been ugly and challenging to use from an ergonomic standpoint. Although these special instructions have existed for years, most code has not been optimized for them. Therefore, whoever can solve this complexity and write portable SIMD optimization algorithms can stand out in the market, such as simd\_json.

Mojo’s primitives are designed with SIMD priority from the outset: UInt8 is actually a SIMD\[DType.uint8, 1], representing a SIMD with 1 element. This representation incurs no performance overhead while allowing programmers to easily use it for SIMD optimization. For example, text can be split into 64\-byte blocks, represented as SIMD\[DType.uint8, 64], and then compared with a single newline character to find the index of each newline. As SIMD registers on machines can perform operations on 512\-bit data simultaneously, this operation can boost the performance of such operations by 64 times!

Or to give a simpler example, suppose you have a SIMDDType.float64, 8\. By simply multiplying it by Float64(2\), you can easily improve performance. Compared to individually multiplying each element, this method can improve performance by up to 8 times on most machines.

LLVM (also used by Rust) has automatic vectorization optimization passes, but due to its inability to change the memory layout of SIMD and other important details, its performance never reaches the theoretical level of optimization. However, Mojo was designed with SIMD features in mind from the beginning, so the experience of writing SIMD optimizations is very similar to writing regular code.

Eager Destruction: Rust’s design is inspired by C\+\+’s RAII (Resource Acquisition Is Initialization), meaning that once objects go out of scope, application developers don’t need to worry about releasing memory — the programming language itself handles it. This is a very good example that avoids the performance pitfalls of garbage collection while ensuring dynamic language ergonomics.

Mojo goes further by not waiting for the end of the scope but releasing memory when the object is last used. This is very beneficial for AI scenarios because releasing objects early means releasing GPU tensors early, allowing for larger models to be fitted in equivalent GPU RAM. This is Mojo’s unique advantage, allowing programmers to achieve optimal performance without having to design it themselves. Rust’s borrow checker initially extends the lifetime of everything to the end of its scope, matching the behavior of destructor functions, but this can lead to some confusing consequences for users. Rust later added some non\-lexical lifetime features to simplify the work of developers. However, with Mojo’s eager destructor mechanism, this simplification effect can be directly achieved, and it remains consistent with how objects are actually destroyed, thus avoiding confusing extreme cases.

Another overhead in Rust comes from the implementation of Drop. It uses Drop Flags to track whether objects should be deleted at runtime. Rust is able to optimize in certain situations, but Mojo can eliminate all extra overhead through explicit definitions.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*0VcMppg3rDTqfsMY)

Regardless, developers must choose between the ease of use of Mojo and Python, and the high performance of C, C\+\+, or Rust. In response, the Mojo team calls out to developers, saying, “If you’re curious and looking towards the future, hoping to master a language that may benefit AI development in the next 50 years, why not give Mojo a chance?”


