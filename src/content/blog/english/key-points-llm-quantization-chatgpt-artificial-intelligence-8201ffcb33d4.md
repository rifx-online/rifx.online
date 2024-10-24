---
title: "5 Key Points to Unlock LLM Quantization"
meta_title: "5 Key Points to Unlock LLM Quantization"
description: "Quantizing Large Language Models"
date: 2024-10-24T17:47:43Z
image: "https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*RUqPEr2NTYXlI1omqF22Qg.png"
categories: ["Machine Learning", "Data Science", "Technology/Web"]
author: "Rifx.Online"
tags: ["quantization", "weights", "activations", "calibration", "Quanto"]
draft: False

---





### Quantizing Large Language Models



LLM Quantization is currently a hot topic due to its vital role in making Large Language Models (LLMs) more efficient and deployable across various hardware platforms, including consumer-grade devices.

By adjusting the precision of certain components within the model, **quantization significantly reduces the model’s memory footprint** while maintaining similar performance levels.

In this guide, we will explore five key aspects of LLM quantization including some practical steps for applying this technique to our models.


## #1. Understanding Quantization

Quantization is a model compression technique that reduces the precision of weights and activations in an LLM. This involves converting high-precision values to lower-precision ones, effectively **changing data types that store more information to those that store less**.

Decreasing the number of bits needed for each weight or activation significantly reduces the overall model size. As a result, **quantization creates LLMs that use less memory, and require less storage space.**

This technique has become essential in response to the exponential growth in the number of parameters in successive iterations of LLMs. For example, for the OpenAI’s GPT family, we can observe the growing trend in the following graph:

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*QlAhma3Wu1F6w2WvkE8jDA.png)

This significant increase presents a challenge: as models grow, their memory requirements often exceed the capacity of advanced hardware accelerators such as GPUs. **This requires distributed training and inference to manage these models, which in turn limits their deployability.**


## #2. Intuition Behind Quantization

Although the definition of quantization may seem rather complex, the concept can be intuitively explained using matrices.

Let’s consider the following a 3x3 matrix representing the weights of a neural network. The matrix on the left shows the original weights, while the matrix on the right shows the quantized version of these weights:

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*LPzWe9oxjlDYdSp7dVvRUg.png)

In this simple example, we round the elements of the original matrix from four decimal places to a single decimal place. Although the matrices appear similar, **the storage space required for the four-decimal version is significantly higher**.

In practice, quantization is not merely a rounding operation. Instead, it involves converting numerical values to a different data type, typically from a higher to a lower precision one.

For example, the default data type for most models is `float32`, which requires 4 bytes per parameter (32 bits). Therefore, for a 3x3 matrix, the total memory footprint is 36 bytes. Changing the data type to `int8`, only 1 byte per parameter is needed, reducing the total memory footprint of the matrix to just 9 bytes.


## #3. Quantization Error

As we have seen, the original matrix and its quantized form are not completely equal, but very similar. The value-by-value difference is known as “Quantization error”, which we can also represent in matrix form:

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*VtGDjVbr7daagLXB57i7Mg.png)

**This quantization error can accumulate for each matrix of weights in the network, affecting the model’s performance as a result.**

Current research in quantization aims to minimize the difference in precision while decreasing the computational resources required to train or run inference on models, while maintaining acceptable performance levels.


## #4. Linear Quantization

Linear quantization is one of the most popular quantization schemes for LLMs. In simple terms, it involves mapping the range of floating-point values of the original weights to a range of fixed-point values.

Let’s review the steps required to apply linear quantization to our models:

* **Get the minimum and maximum ranges:** We need to get the minimum and maximum values of the floating-point weights to be quantized (`x_min` and `x_max`). We also need to define the quantized range (`q_min` and `q_max`), which is already set by the data type we want to convert to.
* **Compute the scale (`s`) and the zero-point (`z`) values:** Firstly, the scale (`s`) adjusts the range of floating-point values to fit within the integer range, preserving the data distribution and range. Secondly, the zero-point (`z`) ensures that zero in the floating-point range is accurately represented by an integer, maintaining numerical accuracy and stability, especially for values close to zero.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*BepC6-izw0yE19ejsS705Q.png)

* **Quantize the values (`q`)**: We need to map the original floating-point values to the integer range using a scale factor (`s`) and a zero point (`z`) computed in the previous step.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*BBOQ0VbSGbwf7CN8c4PWKQ.png)

Applying these formulas is quite straightforward. If we apply them to the 3x3 weight tensor on the left in the image below, we will get the quantized matrix shown on the right:

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*KzBvg84mfI2gAhTIyVibwQ.png)

We can see that the lower bound of the `int8` value corresponds to the lower value of the original tensor, while the upper bound corresponds to the higher value of the original tensor, *i.e., the mapping is`0.50 → 255` and `-0.40 → 0`.*

We can now dequantize the values using the formula below.

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*E5nnqYzncYCRuM5prssuOw.png)

If we place the dequantized values again in matrix form (matrix on the left), we can compute the quantization error (matrix on the right) by calculating the point-by-point difference between the original matrix and its dequantized version:

![](https://images.weserv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*56NALu9PAN95QG2hn8HXoQ.png)

As we can observe, the quantization error starts kicking in for some of the matrix values.


## #5. Weight Quantization vs Activation Quantization

In our example above, we have focused primarily on quantizing the weights of the model. While weight quantization is crucial for model optimization, it’s also important to consider that activations can be quantized as well.

**Activation quantization involves reducing the precision of the intermediate outputs of each layer in the network**. Unlike weights, which remain constant once the model is trained, activations are dynamic and change with each input, making their range harder to predict.

Generally, activation quantization is more challenging to implement than weight quantization because it requires careful calibration to ensure the dynamic range of activations is accurately captured.

Weight quantization and activation quantization are complementary techniques. Using both can significantly reduce model size without greatly compromising performance.


## Final Thoughts

In this article, we have reviewed 5 key points about quantization to better understand how to reduce the size of these constantly growing models.

As for the implementation of those techniques, there are several tools and libraries in Python that support quantization such as `pytorch` and `tensorflow`. Nevertheless, integrating quantization seamlessly in existing models requires a deep understanding of the libraries and model internals.

That is why my favorite option to implement quantization in easy steps so far is the [Quanto](https://huggingface.co/blog/quanto-introduction) library by Hugging Face, designed to simplify the quantization process for PyTorch models.

If you are interested in the in-depths of LLM Quantization and how to use the aforementioned library, you might also be interested in the article [“Quantization for Large Language Models (LLMs): Reduce AI Model Sizes Efficiently”](https://www.datacamp.com/tutorial/quantization-for-large-language-models).

That is all! Many thanks for reading!

I hope this article helps you when **using LLMs for coding!**

You can also subscribe to my [**Newsletter**](https://readmedium.com/@andvalenzuela/subscribe) to stay tuned for new content.

**Especially**, **if you are interested in articles about Large Language Models and ChatGPT**:


