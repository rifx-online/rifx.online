---
author: Qwen
categories:
- text 2 text
context: 32768
date: 2024-12-31 01:44:34+00:00
description: Qwen QwQ-32B-Preview
discount: 0.3
draft: false
id: rifx/qwq-32b-preview
image: https://img.rifx.online/icons/qwen-color.svg
img: 0
input: 1.2e-07
is_active: false
is_free: false
is_recommended: true
labels:
- qwq-32b-preview
- AI reasoning
- language mixing
- recursive loops
- safety considerations
last_updated: 2024-12-31 01:44:34+00:00
meta_title: Qwen QwQ-32B-Preview
model_tags:
- Discount
output: 1.8e-07
request: 0
tags:
- Programming/Scripting
- recursive loops
- Natural Language Processing
- qwq-32b-preview
- AI reasoning
- safety considerations
- language mixing
- Ethics
- Discount
- Qwen
- Machine Learning
title: Qwen QwQ-32B-Preview
---


## 介绍

**QwQ-32B-Preview** 是由 Qwen 团队开发的实验研究模型，旨在提升 AI 推理能力。作为预览版本，它展示了有前景的分析能力，但也存在几个重要的局限性：

1. **语言混合和代码切换**：该模型可能会意外混合语言或在语言之间切换，从而影响响应的清晰度。
2. **递归推理循环**：该模型可能会进入循环推理模式，导致响应冗长而没有结论性答案。
3. **安全和伦理考虑**：该模型需要增强的安全措施，以确保可靠和安全的性能，用户在使用时应谨慎。
4. **性能和基准限制**：该模型在数学和编码方面表现出色，但在其他领域（如常识推理和细微语言理解）仍有改进空间。

**规格**：
- 类型：因果语言模型
- 训练阶段：预训练与后训练
- 架构：带有 RoPE、SwiGLU、RMSNorm 和 Attention QKV 偏置的 transformers
- 参数数量：32.5B
- 参数数量（非嵌入）：31.0B
- 层数：64
- 注意力头数量（GQA）：Q 有 40 个，KV 有 8 个
- 上下文长度：完整的 32,768 个标记

有关更多详细信息，请参阅我们的 [博客](https://qwenlm.github.io/blog/qwq-32b-preview/)。您还可以查看 Qwen2.5 的 [GitHub](https://github.com/QwenLM/Qwen2.5) 和 [文档](https://qwen.readthedocs.io/en/latest/)。

## 要求

Qwen2.5 的代码已经包含在最新的 Hugging Face `transformers` 中，我们建议您使用最新版本的 `transformers`。

使用 `transformers<4.37.0`，您将遇到以下错误：
```
KeyError: 'qwen2'
```

## 快速开始

这里提供了一个使用 `apply_chat_template` 的代码片段，向您展示如何加载分词器和模型以及如何生成内容。

```python
from transformers import AutoModelForCausalLM, AutoTokenizer
model_name = "Qwen/QwQ-32B-Preview"
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype="auto",
    device_map="auto"
)
tokenizer = AutoTokenizer.from_pretrained(model_name)
prompt = "How many r in strawberry."
messages = [
    {"role": "system", "content": "You are a helpful and harmless assistant. You are Qwen developed by Alibaba. You should think step-by-step."},
    {"role": "user", "content": prompt}
]
text = tokenizer.apply_chat_template(
    messages,
    tokenize=False,
    add_generation_prompt=True
)
model_inputs = tokenizer([text], return_tensors="pt").to(model.device)
generated_ids = model.generate(
    **model_inputs,
    max_new_tokens=512
)
generated_ids = [
    output_ids[len(input_ids):] for input_ids, output_ids in zip(model_inputs.input_ids, generated_ids)
]
response = tokenizer.batch_decode(generated_ids, skip_special_tokens=True)[0]
```

## 引用

如果您觉得我们的工作有帮助，请随意引用我们。

```
@misc{qwq-32b-preview,
    title = {QwQ: Reflect Deeply on the Boundaries of the Unknown},
    url = {https://qwenlm.github.io/blog/qwq-32b-preview/},
    author = {Qwen Team},
    month = {November},
    year = {2024}
}
@article{qwen2,
      title={Qwen2 Technical Report}, 
      author={An Yang and Baosong Yang and Binyuan Hui and Bo Zheng and Bowen Yu and Chang Zhou and Chengpeng Li and Chengyuan Li and Dayiheng Liu and Fei Huang and Guanting Dong and Haoran Wei and Huan Lin and Jialong Tang and Jialin Wang and Jian Yang and Jianhong Tu and Jianwei Zhang and Jianxin Ma and Jin Xu and Jingren Zhou and Jinze Bai and Jinzheng He and Junyang Lin and Kai Dang and Keming Lu and Keqin Chen and Kexin Yang and Mei Li and Mingfeng Xue and Na Ni and Pei Zhang and Peng Wang and Ru Peng and Rui Men and Ruize Gao and Runji Lin and Shijie Wang and Shuai Bai and Sinan Tan and Tianhang Zhu and Tianhao Li and Tianyu Liu and Wenbin Ge and Xiaodong Deng and Xiaohuan Zhou and Xingzhang Ren and Xinyu Zhang and Xipin Wei and Xuancheng Ren and Yang Fan and Yang Yao and Yichang Zhang and Yu Wan and Yunfei Chu and Yuqiong Liu and Zeyu Cui and Zhenru Zhang and Zhihao Fan},
      journal={arXiv preprint arXiv:2407.10671},
      year={2024}
}
```

