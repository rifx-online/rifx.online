---
title: "Top 5 AI Tools for iOS Developers"
meta_title: "Top 5 AI Tools for iOS Developers"
description: "The article outlines the top five AI tools for iOS developers to enhance workflow efficiency. Key tools include Cursor/VSCode, which offers advanced code completion and refactoring features; the GitHub Copilot Xcode extension for AI-assisted editing within Xcode; Swift Assist, a predictive completion tool; and web interfaces like ChatGPT and Claude for iterative coding. Alex Sidebar is mentioned as a new Xcode extension, while AIProxy is highlighted for securely integrating AI APIs. The article emphasizes the importance of these tools in improving coding speed and accuracy for iOS developers."
date: 2024-11-14T03:29:09Z
image: "https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*6Hs8174FgiwTv87e.jpg"
categories: ["Programming", "Technology/Web", "Generative AI"]
author: "Rifx.Online"
tags: ["Cursor", "VSCode", "GitHub", "Copilot", "Swift"]
draft: False

---

### To improve your workflow speed \& efficiency



While there are a lot of big AI talks, I want to get you back on earth. Whether you’re already using AI\-assisted tools for coding or you feel like this is just a big load of bullshit… this article with a clickbait title is probably for you.

While you can probably already find a lot of literature about what and how to use various tools to improve your skills, efficiency, and accuracy with AI, it’s a tad more complicated for us iOS developers. Because we rely on Xcode and its toolchain to build our app, it’s simply harder for us to go without Xcode. And not all the tools I’ll list and explain in the following paragraphs are about skipping Xcode.

## 1\. Cursor / VSCode

Obviously, this is the top of the list. Unless you were hibernating under a rock, you probably heard about VSCode. Working with it on a Swift project is not a novelty. GitHub Copilot, built\-in VSCode, allows you to code at the speed of light without doing much of anything in terms of setup. They recently integrated more Copilot features within VSCode, and it’s getting closer to Cursor. On top of tab completion, you can now also have inline chat \+ code generation inline.

Cursor is a fork of VSCode, and their Cursor Tab completion feature is, in my experience, faster and more accurate than VSCode.

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*pQ4SuReyicAiBCG3.gif)

They also do something that saved me countless hours: smart / AI\-assisted refactoring. This is probably one of the best features worth the Cursor subscription alone.

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*JlzVJ6o18sulIUEeo_p5sg.gif)

And it’s not only for refactoring; it’s simply in smart edition after changing a line. Cursor will show a “tab” indicator, which means it has a proposed change for a part of the code that is probably related to what you just edited. Just press tab to cascade changes, and it can go on and on. Tab tab tab.

Once you get into the flow, you’ll see how efficient you can be. My flow is just coding as usual, but faster because I have to write much less code. The more you code with it, the more it learns your project, coding style, etc… It might appear a bit off at the beginning, but trust me, give it time.

You can also generate code with the inline chat:

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*pVzU2MZ0vNFQ6-dRaWPy-w.gif)

It’s useful when you need a specific algorithm or have all the context within your existing code but need to write some tedious parts. It works quite well and can save a lot of time too. Don’t forget to review the produced code :)

To get started on it for iOS development specifically, I encourage you to read two of my other stories:

One about how to set it up, install the correct extensions, etc…

And another one is about switching your Xcode project from group\-based to folder\-based so you can freely create/delete/move files within VSCode/Cursor without touching the .xcodeproj / Xcode at all.

This is just scratching the surface for iOS development with Cursor/VScode. But you should get started today!

## 2\. GitHub Copilot Xcode extension

This one is a recently released extension, it was initially a project by [Intitni](https://proxy.rifx.online/https://github.com/intitni/CopilotForXcode), but it seems that GitHub forked/acquired it and made it the official extension for Copilot \+ Xcode. And so far, while the UX is not perfect (understandable as they have to work with accessibility/windows API), it’s much better than Apple (local) Xcode models.

And lucky you, I already wrote about it:

If you’re not ready to switch to another editor than Xcode, but still want to use efficient AI\-assisted code editing, this extension is for you!

## 3\. Swift Assist

While Xcode already has a built\-in local model for Predictive code completion (only available on Apple Silicon Mac from Xcode 16\), Apple teased something else at the WWDC:

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*-mlY8GyGh3VPVhyg3TmLYw.png)

Swift Assist

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*XJnlRo8mqrAMZEVEL64ufg.gif)

It seems like the chat \+ code generation from Cursor I’ve demoed above. It should be able to generate code from your comments. But for now, it’s vaporware. Xcode 16\.2 beta 2 mentioned it, but we still can’t test it.

Maybe it’ll be available in a later version of Xcode 16\.2 beta, so I can’t wait to test and write about it!

## 4\. ChatGPT/Claude/Perplexity web interface

Sometimes, nothing is better than going back to the basics. While those code editors use Anthropic and OpenAI models and their own, it’s good to not forget that using their web interface is also an invaluable tool in today's landscape.

### ChatGPT \+ Canvas

OpenAI’s ChatGPT has evolved quite a bit in the last few months. The recent release of o1\-preview with reasoning and canvas allows for some good coding sessions right within the ChatGPT web interface.

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*WUraNCcZMrCRrHMilgzl-Q.png)

Canvas is a mini code editor built on the ChatGPT Web interface and lets you quickly iterate on code and ideas. You can use the chat to make incremental changes, and there are also some other tools to comment on the code, do inline changes, convert it to another language etc…

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ab7PdMLJwacZtVsET2YYmA.gif)

While this will not allow you to build a full application, it’s a great tool for quickly iterating on code ideas outside of your standard editor.

### Claude Artifacts

This is similar to ChatGPT Canvas, but has some other features, like previewing (obviously not with Swift/SwiftUI) and working with multiple files at once.

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*2iverELFSGqnJzklPK0cYg.png)

## 5\. Alex Sidebar

This is a new contender! The premise is simple, because Xcode is closed source and the extension API is quite limited, why not build around Xcode?

![](https://images.weserv.nl/?url=https://proxy.rifx.online/https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*vZgn_FjH0FW53c7qZ4DZAg.png)

I’m not a fan of the UX, but it offers most of the Cursor features as an Xcode side panel built like as a window. There are various shortcuts \+ code completions \+ chat. You should definitely give it a go to see if it improve your workflow!

## 6\. AIProxy

Bonus as the (3\) Swift Assist is not really …. available

This not a tool for coding, but a tool for builders. When integrating an AI API in your iOS app, you’ll most probably need add an API key to your project. But as we all know (right!), you should not have it client side. If you do so, it’s easy for almost anyone to get dump your API key and use your AI credits on your behalf.

Enter [AIProxy](https://proxy.rifx.online/https://www.aiproxy.pro/), they have an open source SDK, it’s easy to integrate and they support all the AI providers your need.

If you don’t feel like building a backend to proxy your AI calls, this is the right tool for you!


