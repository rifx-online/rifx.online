---
title: "揭开DeepSeek-V3的神秘面纱：如何以超低成本提升大语言模型的推理效率？！"
meta_title: "揭开DeepSeek-V3的神秘面纱：如何以超低成本提升大语言模型的推理效率？！"
description: "DeepSeek-V3是由一家中国人工智能研究公司开发的开源大型语言模型，旨在降低推理成本并缩小开源与封闭源模型之间的差距。该模型采用Mixture-of-Experts设计，拥有6710亿参数，能够以约60 tokens/秒的速度高效推理，成本仅为GPT-4o-mini的相当水平。DeepSeek-V3在多个领域表现优秀，如教育、数据分析、编码和客户支持，并支持Docker和Kubernetes部署。通过Fireworks平台，用户可以实现无服务器推理和模型管理，进一步降低使用成本。"
date: 2024-12-29T15:16:16Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*VyxAiK7YzxjFKTNs-t-www.png"
categories: ["Programming", "Machine Learning", "Natural Language Processing"]
author: "Rifx.Online"
tags: ["DeepSeek-V3", "parameters", "Mixture-of-Experts", "Docker", "Kubernetes"]
draft: False

---





## 介绍

**DeepSeek\-V3** 已成为开源爱好者和企业用户的新重磅产品。该模型由一家中国的人工智能研究公司开发，致力于“开源精神 + 长期主义以实现包容性AGI”，旨在缩小封闭源巨头（如 GPT\-4o 和 Claude\-Sonnet\-3\.5\）与开源社区之间的差距。

DeepSeek\-V3 采用 **Mixture\-of\-Experts (MoE)** 设计，总参数量达到 **6710 亿**，其中每个 token 大约激活 **370 亿**。尽管规模庞大，但它展现出令人印象深刻的效率，能够达到约 **60 tokens/秒** 的速度——这比其前身 DeepSeek\-V2 快了大约三倍。从教育任务和编码挑战到高级数学推理，该模型旨在许多领域表现出色，常常超越或匹配领先的专有模型的性能。

DeepSeek\-V3 还因其 **成本优势** 而备受关注。

根据早期估计，它的成本几乎与 GPT\-4o\-mini 相当，且可低至 Anthropic 的 Claude 3\.5 Sonnet 相当编码模型的 10% 的费用。

这种经济实惠，加上开源的可用性，为开发者、企业和研究人员提供了前所未有的机会，可以在没有典型预算障碍的情况下微调和部署高性能的 LLM。

在本文中，我们将探讨您开始使用 DeepSeek\-V3 所需的所有信息：从架构细节和用例到使用 Docker 和 Kubernetes 部署模型的实用指南（包括对 AMD GPU 的支持）。

我们还将深入探讨如何使用 **Fireworks API** 将 DeepSeek\-V3 集成到您的技术栈中，展示如何构建一个简单的聊天包装应用，并提供设置 Cursor IDE 的步骤，以便轻松利用 DeepSeek\-V3。最后，我们将提供成本比较，以帮助您了解在工作流程中使用这一尖端模型的潜在节省。

到本指南结束时，您应该对以下内容感到自信：

* DeepSeek\-V3 的工作原理及其独特之处。
* 在 Kubernetes 集群上进行 Docker 化和部署的策略。
* 通过 Fireworks 无服务器推理或专用部署将模型集成到您的应用中的方法。
* 构建一个简单的聊天界面包装器。
* 配置 IDE 环境（Cursor），以轻松与 DeepSeek\-V3 进行交互。

让我们首先仔细看看模型的核心特性。

## DeepSeek\-V3 的关键特性

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*7vI2URXgOVUKOpMJHdsXnw.png)

### 架构概述 (MLA, DeepSeekMoE, MTP)

DeepSeek\-V3 是在传统的 Transformer 框架内构建的，但引入了多个独特的设计元素，以优化训练和推理。

### 1\. 多头潜在注意力 (MLA):

该机制帮助模型关注输入的不同“潜在专家”。它显著提高了令牌处理速度，使 DeepSeek\-V3 能够在额外的后训练阶段处理长度达到 **128K** 的上下文。

### 2\. DeepSeekMoE:

一种专业的专家混合方法确保在任何给定时间，只有所需的专家被激活。虽然总模型大小为 **671B 参数**，但处理单个令牌时仅使用约 **37B**，在性能和资源利用之间取得平衡。

### 3\. 多标记预测 (MTP):

与严格逐个生成标记不同，MTP 训练模型一次处理多个标记。这种方法提高了吞吐量，也是 DeepSeek\-V3 能够比 DeepSeek\-V2 快大约三倍生成文本的原因之一。

## 性能亮点

根据官方评估结果，DeepSeek\-V3 在多个关键领域展现出卓越表现：

- **知识测试**：在 MMLU 上得分 **88.5**，超越其他开源模型
- **数学推理**：在 MATH-500 等测试中达到 **90.2%** 的准确率
- **代码能力**：在 HumanEval-Mul 上达到 **82.6%** 的通过率
- **多语言**：在中文评测 C-Eval 上达到 **86.5%** 的准确率

> 💡 **选择 Rifx.online 快速开始使用 DeepSeek-V3**
>
> 看到这些令人印象深刻的评估结果，您可能已经迫不及待想要尝试 DeepSeek-V3。[Rifx.online](https://rifx.online) 平台为您提供了最便捷的使用方式：
>
> - 🚀 **即刻部署**：无需复杂的环境配置，通过统一的 API 接口直接调用
> - 💰 **超值定价**：仅需 $0.14/1M tokens(输入)和 $0.28/1M tokens(输出)
> - 🔄 **企业特性**：
>   * 多区域部署确保服务稳定性
>   * 智能负载均衡自动处理高并发
>   * 实时监控和详细的使用分析
>   * 完整的开发文档和技术支持
> - 🌐 **全球加速**：多区域节点部署，确保低延迟访问
>
> 访问 [https://rifx.online/zh/models/deepseek-deepseek-chat-v3](https://rifx.online/zh/models/deepseek-deepseek-chat-v3) 立即开始体验！
>
> ```python
> from openai import OpenAI
> 
> # 通过 Rifx.online 使用 DeepSeek-V3
> client = OpenAI(
>     base_url="https://api.rifx.online/v1",
>     api_key="your-api-key"
> )
> 
> response = await client.chat.completions.create(
>     model="deepseek/deepseek-chat-v3",
>     messages=[{"role": "user", "content": "请解决这道数学题：..."}]
> )
> ```

## 部署选项

* **知识测试**：DeepSeek\-V3 在 MMLU 上得分 **88\.5**，超越其他开源模型。它在中文事实知识方面也表现突出，在中文 SimpleQA 任务中超过了 GPT\-4o 和 Claude\-Sonnet\-3\.5 等专有模型。
* **数学与推理**：在与数学相关的任务（例如 MATH\-500）中，DeepSeek\-V3 展现了先进的推理能力。在某些情况下，它甚至超越了某些专有预览，如 GPT\-o1\-preview。
* **编码**：在 LiveCodeBench 等编码基准测试中，DeepSeek\-V3 成为开源领域的顶尖竞争者之一。在生成和解释代码解决方案方面，它显著超过了其他模型。

## 与其他模型的比较及成本优势

DeepSeek\-V3 的最大优势之一就是其经济实惠。根据公开的成本估算：

* DeepSeek\-V3 **几乎与 GPT\-4o\-mini 一样便宜**。
* 在某些 Anthropic Claude 3\.5 或 Claude\-Sonnet\-3\.5 的实现中，其成本仅为 **10%**，特别是在编码或高级推理任务中。

对于预算有限的小公司、初创企业或研究实验室来说，这种成本效益可以带来巨大的不同。此外，其 **开源** 的特性意味着您可以自由地在自己的硬件或您选择的云基础设施上托管该模型，从而避免昂贵的专有托管服务。

## 使用案例和实际应用

DeepSeek\-V3 的架构和多领域能力使其适用于多种使用场景：

1\. **教育平台**：

* 自动回答高级主题问题，创建多语言教育内容，以及详细的逐步数学解题方案。

2\. **数据分析与处理**：

* 总结大量文本（得益于 128K 上下文窗口），提取关键见解，或执行特定领域的知识库检索。

3\. **编码辅助**：

* 生成样板代码、调试建议，或为复杂算法提供逐步指导。现场编程比赛或协作编码会议也能从中受益匪浅。

4\. **聊天机器人和客户支持**：

* 构建复杂的对话代理，能够处理多种语言、特定领域术语或用户查询的高级推理。

5\. **研究与开发**：

* 在专业数据上预训练或微调模型（开销最小），以探索机器学习、计算语言学或知识图谱的新研发方向。

6\. **内容生成与创意写作**：

* 无论是头脑风暴文章创意还是生成诗歌，DeepSeek\-V3 的大参数量能够处理广泛的创意范围。

## 实用测试：使用 DeepSeek-V3 构建俄罗斯方块游戏

除了更传统的 LLM 用例，**DeepSeek-V3** 在生成和排除休闲游戏方面也表现得相当有效——比如俄罗斯方块。

我要求它构建俄罗斯方块，因为这是一个比贪吃蛇稍微复杂一些的基准，但足够简单，可以一次性完成。

在我的测试中，我使用 ChatHub 界面与 DeepSeek-V3 互动，并要求它构建一个简单的基于浏览器的俄罗斯方块克隆。过程如下：

我提示 DeepSeek-V3 在 index.html 中生成游戏俄罗斯方块。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*O0psvp6AizG7iGZiAdff8Q.png)

它给了我 2 个文件，然后我将它们插入并在本地运行，使用

```python
$ tetris npx serve .
WARNING: Checking for updates failed (use `--debug` to see full error).

┌─────────────────────────────────────────────────┐
│                                                 │
│   Serving!                                      │
│                                                 │
│   - Local:            http://localhost:3000     │
│   - On Your Network:  http://192.168.1.8:3000   │
│                                                 │
│   Copied local address to clipboard!            │
│                                                 │
└─────────────────────────────────────────────────┘
```
模型给出了一个简洁、自包含的结构：一个引用了画布元素的 HTML 文件，以及一个处理网格创建、方块移动和碰撞检测的 JavaScript 文件。

然而，我注意到方块没有下降。通过快速描述问题，DeepSeek-V3 返回了一个更新的俄罗斯方块文件。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*PJO7sXvFbuC02jhyT6w_CA.png)

这是它最终生成的 tetris.js 文件：

```python
const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;

context.scale(BLOCK_SIZE, BLOCK_SIZE);

// Create the board
const board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

// Tetrominoes
const tetrominoes = {
  I: [[1, 1, 1, 1]],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
  ],
};

// Randomly select a tetromino
function randomTetromino() {
  const keys = Object.keys(tetrominoes);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return tetrominoes[randomKey];
}

let piece = randomTetromino();
let position = { x: 3, y: 0 };
let score = 0;
let dropInterval = 1000; // Move down every 1000ms (1 second)
let lastDropTime = 0;

// Draw the board and the piece
function draw() {
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);

  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        context.fillStyle = 'cyan';
        context.fillRect(x, y, 1, 1);
      }
    });
  });

  piece.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        context.fillStyle = 'red';
        context.fillRect(x + position.x, y + position.y, 1, 1);
      }
    });
  });
}

// Move the piece down
function drop() {
  position.y++;
  if (collide()) {
    position.y--;
    solidify();
    removeRows();
    piece = randomTetromino();
    position = { x: 3, y: 0 };
    if (collide()) {
      alert('Game Over!');
      board.forEach((row) => row.fill(0));
      score = 0;
      updateScore();
    }
  }
}

// Check for collisions
function collide() {
  for (let y = 0; y < piece.length; y++) {
    for (let x = 0; x < piece[y].length; x++) {
      if (
        piece[y][x] &&
        (board[y + position.y] && board[y + position.y][x + position.x]) !== 0
      ) {
        return true;
      }
    }
  }
  return false;
}

// Solidify the piece on the board
function solidify() {
  piece.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        board[y + position.y][x + position.x] = value;
      }
    });
  });
}

// Remove completed rows
function removeRows() {
  let rowsRemoved = 0;
  for (let y = board.length - 1; y >= 0; y--) {
    if (board[y].every((cell) => cell !== 0)) {
      board.splice(y, 1);
      board.unshift(Array(COLS).fill(0));
      rowsRemoved++;
    }
  }
  if (rowsRemoved > 0) {
    score += rowsRemoved * 10;
    updateScore();
  }
}

// Update the score display
function updateScore() {
  scoreElement.textContent = `Score: ${score}`;
}

// Handle keyboard input
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
    position.x--;
    if (collide()) {
      position.x++;
    }
  }
  if (event.key === 'ArrowRight') {
    position.x++;
    if (collide()) {
      position.x--;
    }
  }
  if (event.key === 'ArrowDown') {
    drop();
  }
  if (event.key === 'ArrowUp') {
    rotate();
  }
});

// Rotate the piece
function rotate() {
  const rotated = piece[0].map((_, i) =>
    piece.map((row) => row[i]).reverse()
  );
  const previousPiece = piece;
  piece = rotated;
  if (collide()) {
    piece = previousPiece;
  }
}

// Game loop
function update(time = 0) {
  const deltaTime = time - lastDropTime;

  if (deltaTime > dropInterval) {
    drop();
    lastDropTime = time;
  }

  draw();
  requestAnimationFrame(update);
}

update();
```
我会说总体而言，经过很少的反复，这个模型的表现与 Claude 的闭源版本相当，甚至更好。经过 2 次尝试获得一个功能完整的俄罗斯方块游戏引擎，实在令人印象深刻。

### 为什么这很重要

俄罗斯方块的例子强调了 **DeepSeek\-V3** 在创意编码任务中的潜力。即使对于主流企业使用之外的项目，该模型也可以：

* 快速生成基于浏览器或桌面的游戏的工作原型。
* 在短反馈循环后识别并修复逻辑错误。
* 在最小提示下融入用户驱动的功能（得分、下一个方块预览等）。

虽然俄罗斯方块看起来是一个简单的游戏，但它很好地展示了 **DeepSeek\-V3** 多么快速地启动功能前端项目。凭借其 **改进的编码能力** 和 **快速迭代周期**，DeepSeek\-V3 能够很好地处理实时修复，特别是在用户提供清晰详细反馈时。

## 使用 Docker 和 Kubernetes 部署 DeepSeek\-V3

### 前提条件：硬件和软件要求

DeepSeek\-V3体积庞大，但已针对高效推理进行了优化。尽管如此，您仍需要相当的资源来托管它：

* **GPU要求**：虽然NVIDIA GPU仍然是最常见的选择，但DeepSeek\-V3也支持带有ROCm生态系统的**AMD GPU**。如果您希望实现实时或接近实时的性能，至少需要2-4个高内存GPU（例如，AMD Instinct MI200系列或NVIDIA A100等效产品）。
* **RAM**：计划至少需要64GB的系统RAM以用于小规模使用；128GB及以上会更舒适。
* **Docker**：确保已安装支持GPU的Docker，例如nvidia\-docker或AMD的ROCm Docker设置。
* **Kubernetes**：配置了GPU节点（NVIDIA或AMD）的集群对于强大的生产级部署至关重要。

## 设置 Docker 镜像

以下是一个 **简化** 的示例 Dockerfile，展示了如何将 DeepSeek-V3 容器化。假设您已经在本地克隆了 [DeepSeek-V3 GitHub 仓库](https://github.com/deepseek-ai/DeepSeek-V3)，并确保您在安装步骤中下载了适当的模型：

```python
Model #Total Params #Activated Params Context Length Download
DeepSeek-V3-Base 671B 37B 128K 🤗 HuggingFace
DeepSeek-V3 671B 37B 128K 🤗 HuggingFace
```
以下是 Dockerfile：

```python
## 使用 CUDA 基础镜像。
## 对于 AMD GPU，请切换到 ROCm 兼容的基础镜像 (例如，rocm/pytorch:latest)。
FROM nvidia/cuda:12.2.0-devel-ubuntu20.04

## 设置环境变量
ENV DEBIAN_FRONTEND=noninteractive \
    PYTHONUNBUFFERED=1 \
    LANG=C.UTF-8 \
    LC_ALL=C.UTF-8

## 安装系统软件包
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    wget \
    curl \
    python3-dev \
    python3-pip \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

## 创建工作空间
WORKDIR /app

## 克隆 DeepSeek-V3 仓库
## 如果您已经在本地有它，可以直接复制：
RUN git clone https://github.com/deepseek-ai/DeepSeek-V3.git

## 安装推理所需的 Python 依赖
WORKDIR /app/DeepSeek-V3/inference
RUN pip3 install --upgrade pip && \
    pip3 install -r requirements.txt

## （可选）安装推荐的框架：
## SGLang、LMDeploy、TRT-LLM 或 vLLM—取消注释任何您计划使用的框架。
## vLLM 示例：
## RUN pip3 install vllm==0.6.6
#
## LMDeploy 示例（仅 CLI；有关全面步骤，请查看官方文档）：
## RUN pip3 install git+https://github.com/InternLM/lmdeploy.git@main
#
## 对于 SGLang 或 TRT-LLM，您可能需要额外的环境设置 
## 或专门的安装说明。请查看每个项目的文档。

## 创建一个目录来存储模型权重
RUN mkdir -p /app/DeepSeek-V3-weights

## 如果您在本地有模型权重，可以将其复制到这里或在运行时挂载：
## COPY /local/path/to/DeepSeek-V3-weights /app/DeepSeek-V3-weights

## 不暴露默认端口，因为我们默认没有服务器。
## EXPOSE 8000

###############################################################################
## ENTRYPOINT / CMD
###############################################################################
## 默认情况下，我们将进入一个 bash shell，以便用户可以手动运行必要的 
## 命令（例如，generate.py 或推荐的推理框架）。
#
## 如果您想要单节点、单进程的默认命令，可以添加：
## CMD ["python3", "generate.py", "--ckpt-path", "/app/DeepSeek-V3-weights", \
##      "--config", "configs/config_671B.json", "--interactive", "--temperature", "0.7"]
###############################################################################

CMD ["/bin/bash"]
```
1. **如何使用此 Dockerfile**

```python
docker build -t deepseek-v3-inference .
```
2. 以交互式容器运行：

```python
docker run --gpus all -it \
    -v /local/path/to/DeepSeek-V3-weights:/app/DeepSeek-V3-weights \
    --name deepseek-v3-container \
    deepseek-v3-inference
```
* 此命令将您的本地 **模型权重** 挂载到容器的 /app/DeepSeek-V3-weights。
* 在容器内，您现在可以运行任何官方推理命令（例如，torchrun generate.py …）。

3. **示例：单节点交互式推理**

```python
cd /app/DeepSeek-V3/inference
torchrun --nproc-per-node=1 generate.py \
    --ckpt-path /app/DeepSeek-V3-weights \
    --config configs/config_671B.json \
    --interactive \
    --temperature 0.7 \
    --max-new-tokens 200
```
调整 — nproc-per-node 以匹配您机器上的 GPU 数量以实现数据并行。

4. **多节点推理**

对于多节点使用，提供 — nnodes、— node-rank 和 — master-addr 环境变量。

```python
## 2 节点集群的示例：
torchrun --nnodes 2 --nproc-per-node 8 \
    --node-rank $RANK --master-addr $ADDR \
    generate.py --ckpt-path /app/DeepSeek-V3-weights \
    --config configs/config_671B.json \
    --interactive \
    --temperature 0.7 \
    --max-new-tokens 200
```
您可以在单独的容器或在更高层次的编排环境（Kubernetes、Slurm 等）中的单独机器中复制此过程。

## 在 AMD GPU 和其他硬件上运行

使用 AMD GPU：

• 确保您的基础镜像或主机环境包含 **ROCm** 库。

• 将 PyTorch 容器替换为与 ROCm 兼容的容器（例如，rocm/pytorch:latest）。

• 确认您使用 — device\=/dev/kfd — device\=/dev/dri 运行容器，并为 ROCm 设置适当的环境变量。

对于不同的 GPU 后端，这种方法在原则上大致相同；您只需正确的 Docker 镜像和驱动程序。

**2\. Kubernetes 部署片段**

以下是一个使用上述 Docker 镜像的 **Kubernetes 部署** 示例。默认情况下，它启动一个单个副本，您可以通过 exec 进入以进行交互式使用。根据您的需要进行调整（例如，添加服务以供外部访问，设置有状态卷以存储模型权重，或将负载均衡的微服务架构集成到您自定义的推理服务器中）。

```python
apiVersion: apps/v1
kind: Deployment
metadata:
  name: deepseek-v3-inference-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: deepseek-v3-inference
  template:
    metadata:
      labels:
        app: deepseek-v3-inference
    spec:
      containers:
      - name: deepseek-v3-inference-container
        image: your-registry/deepseek-v3-inference:latest
        # 如果您预先构建了自定义推理服务器，您将在这里公开一个端口。
        # ports:
        # - containerPort: 8000
        resources:
          limits:
            nvidia.com/gpu: 1  # 或 'amd.com/gpu: 1' 用于 AMD
        volumeMounts:
        - name: deepseek-v3-weights
          mountPath: /app/DeepSeek-V3-weights
      volumes:
      - name: deepseek-v3-weights
        persistentVolumeClaim:
          claimName: your-weights-pvc
```
**访问 Pod**

* **kubectl exec** 进入 Pod 进行交互式使用：

```python
kubectl exec -it <YOUR_POD_NAME> -- /bin/bash
```
然后导航到 /app/DeepSeek\-V3/inference 并运行您所需的 torchrun 或框架特定命令。

**可选服务**

如果您实现了自定义服务器（例如，使用 generate.py 在服务器模式下，LMDeploy 的服务功能，或 HTTP 微服务层），请添加一个 **Service** 以公开它：

```python
apiVersion: v1
kind: Service
metadata:
  name: deepseek-v3-service
spec:
  type: LoadBalancer
  selector:
    app: deepseek-v3-inference
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8000
```
使用此设置，您可以根据负载扩展或缩减副本数量，确保您有足够的 GPU 资源来满足实时推理需求。

### 推荐推理框架的说明

1. **SGLang**
* 支持高级 MLA 优化、FP8 和 Torch Compile。
* 对于 NVIDIA 和 AMD GPU 都表现出色。
* 用 SGLang 安装步骤替换或扩展你的 pip install \-r requirements.txt，并按照 [SGLang DeepSeek\-V3 指南](https://github.com/sgl-project/sglang/tree/main/benchmark/deepseek_v3) 操作。

2\. **LMDeploy**

* 灵活且高性能的服务。
* 有关逐步使用，请参见 [lmdeploy\#2960](https://github.com/InternLM/lmdeploy/pull/2960)。

3\. **TRT\-LLM**

* 基于 NVIDIA TensorRT 的方法，支持 BF16、INT4/INT8 或即将支持 FP8\。
* 请访问 [custom TRTLLM 分支](https://github.com/NVIDIA/TensorRT-LLM/tree/deepseek/examples/deepseek_v3) 获取说明。

## 将 DeepSeek\-V3 与 Fireworks API 集成

### Fireworks模型管理概述

[Fireworks AI](https://fireworks.ai/) 是一个允许您管理模型（包括基础模型和参数高效微调模型）并将其部署用于推理的平台——可以选择无服务器或专用硬件进行部署。Fireworks中的每个模型都具有以下格式的名称：


```python
accounts/<ACCOUNT_ID>/models/<MODEL_ID>
```
您还可以将自己的自定义模型上传到此注册表，或使用官方预部署的模型。Fireworks支持**PEFT（参数高效微调）**技术，如LoRA，显著减少额外微调层的内存使用。

### 将自定义模型上传到 Fireworks

假设您已经在本地数据上微调了 DeepSeek-V3，并希望将其托管在 Fireworks 上。您通常会：

1. **创建 Fireworks 账户**：获取您的 \<ACCOUNT\_ID\> 和 **API 密钥**。

2. **打包模型文件**：这包括您的最终检查点和相关配置文件。

3. **使用 Fireworks CLI 或 UI**：使用官方 CLI 工具或 Web UI 进行上传。如果您更喜欢 CLI，您可以执行如下操作：

```python
fireworks models upload \
    --account-id <ACCOUNT_ID> \
    --model-id deepseek-v3-custom \
    --model-path /path/to/deepseek-v3-checkpoints/ \
    --model-type base
```
此步骤将在 Fireworks 平台上注册您的模型。

## 无服务器推理与 Fireworks

在上传自定义基础模型后，您可以利用 **无服务器推理**。Fireworks 按每个令牌收费，近似定价如下：

**基础模型参数数量** **$/1M 令牌（输入+输出）**

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*3z9MuIndIWvKnZXeFOyy2g.png)


```python
Base Model Parameter Count $/1M Tokens (Input+Output)
0B - 4B $0.10
4B - 16B $0.20
16.1B+ $0.90
MoE 0B - 56B $0.50
MoE 56.1B - 176B $1.20
Yi Large $3.00
Meta Llama 3.1 405B $3.00
```
考虑到 DeepSeek-V3 是一个 **671B MoE**，激活参数约为 37B，定价可能属于 MoE 级别之一（0B — 56B $0\.50\）。Fireworks 会频繁更新其定价，因此请查看最新数据。无论如何，您可能支付的费用 **显著低于** 使用其他一些商业产品，如 Claude 3\.5 Sonnet — 可能仅为其成本的 **10%** 左右。

### 示例 cURL 调用

一旦您的模型以无服务器模式部署，您可以使用标准 REST API 查询它。以下是一个简化的示例：

```python
curl --request POST \
  --url https://api.fireworks.ai/inference/v1/chat/completions \
  --header 'Authorization: Bearer <YOUR_FIREWORKS_API_KEY>' \
  --header 'Content-Type: application/json' \
  --data '{
    "model": "accounts/<ACCOUNT_ID>/models/deepseek-v3-custom",
    "messages": [
      {
        "role": "system",
        "content": "You are a math tutor. Provide step-by-step solutions."
      },
      {
        "role": "user",
        "content": "What is 792 minus 297?"
      }
    ],
    "max_tokens": 2000,
    "temperature": 1,
    "top_p": 1,
    "top_k": 50
  }'
```
API 的响应将包含一个 JSON 有效负载，其中包含模型生成的文本——您的逐步解决方案。

## 构建一个简单的聊天包装应用

DeepSeek-V3 最常见的用例之一是为聊天机器人提供支持。让我们创建一个最小的 Node.js 应用程序来演示。

**项目结构**


```python
my-deepseek-chat/
├─ package.json
├─ index.js
└─ .env
```
**示例代码片段**


```python
// index.js
require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

const FIREWORKS_API_KEY = process.env.FIREWORKS_API_KEY;
const MODEL_NAME = 'accounts/your_account_id/models/deepseek-v3-custom';

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  
  try {
    const response = await fetch('https://api.fireworks.ai/inference/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FIREWORKS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          { role: 'user', content: userMessage }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const chatContent = data.choices[0]?.message?.content ?? "";
    return res.json({ content: chatContent });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong!' });
  }
});

app.listen(3000, () => {
  console.log('DeepSeek-V3 chat wrapper listening on port 3000');
});
```
**运行应用**：

1. 在 .env 中设置您的 **FIREWORKS\_API\_KEY**。
2. npm install express node-fetch dotenv
3. node index.js

您现在拥有一个本地聊天机器人服务，它通过 Fireworks 将用户消息转发到 DeepSeek-V3 并返回生成的响应。

## 设置 Cursor IDE 与 DeepSeek\-V3

**Cursor IDE** 在 AI\-辅助编码方面越来越受欢迎。您可以通过利用 **OpenRouter** 快速集成 DeepSeek\-V3，它无缝地将 OpenAI API 调用重定向到其他提供商。

### 配置 Cursor 使用 OpenRouter

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*2AImvBX9Bk0vxMSUEtv6hA.png)

1\. 在 Cursor 中进入 **高级设置**。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*JjIDtnkNvbrJaquKAXhWQw.png)

2\. 用 [https://openrouter.ai/api/v1\.](https://openrouter.ai/api/v1.) 替换 **OpenAI 基础 URL**。

3\. 提供一个 **OpenRouter API 密钥**（您可以从 [OpenRouter 官方网站](https://openrouter.ai/) 获取）。

由于 OpenRouter 接口模仿了 OpenAI API 格式，您无需大幅更改代码 — 只需指向新的端点并设置 Authorization: Bearer 头部。

## 指定 DeepSeek\-V3 模型

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ckd_V3Y4UD8SArxCImsjJg.png)

在通过 Cursor 或任何其他兼容 OpenAI 的环境进行调用时，您可以指定：

**model: “deepseek/deepseek\-chat”**

这指示 OpenRouter 将请求路由到最佳可用的 DeepSeek\-V3 提供商，通常是后台的官方 **DeepSeek** 提供商。根据元数据：

* **上下文**: 64K tokens
* **最大输出**: 8K tokens
* **输入**: $0\.14 / 1M tokens
* **输出**: $0\.28 / 1M tokens

（这些是来自 OpenRouter 注册表的近似列表，可能会随时间变化。）

### 估算成本与 Claude 3\.5 Sonnet 及其他

如前所述，DeepSeek\-V3 相对于某些商业 LLM 的成本显著更低。虽然 *确切* 的定价取决于使用情况和提供商，但在基于场景的分析中，通常报告与 Claude 3\.5 Sonnet 相比约 **节省 10% 的成本**。如果您的应用每天生成数百万个令牌，这些节省可能会相当可观。

## 结论

DeepSeek\-V3 代表了开源大型语言模型的一个里程碑。在成本效益和强大性能之间取得平衡，它缩小了开源 LLM 与知名的闭源替代品如 GPT\-4o 或 Claude\-Sonnet\-3.5 之间的差距。凭借 **Mixture\-of\-Experts** 架构（671B 参数，37B 活跃），**多头潜在注意力** 和 **多标记预测** 目标，DeepSeek\-V3 准备在多种任务中表现出色：高级数学、编码、创意写作和多语言问答。

从实际角度来看，在您的技术栈中采用 DeepSeek\-V3 非常简单。您可以：

* **容器化** 模型，使用 Docker 并通过 Kubernetes 进行编排，包括在 **AMD GPU** 上。
* 与 **Fireworks 平台** 无缝集成，使您能够上传自定义权重或依赖于无服务器推理进行按需使用。
* 构建一个 **简单的聊天机器人**，或将模型的能力集成到现有应用程序中，几乎无需代码更改。
* 配置您的 **Cursor IDE**，通过简单指向 **OpenRouter** 和正确的模型名称，利用 DeepSeek\-V3 的高级编码建议。

所有这些选项的成本仅为市场上其他流行 LLM 的一小部分。无论您是研究人员、初创公司还是成熟企业，DeepSeek\-V3 的开源特性意味着更大的实验和定制自由，而无需担心供应商锁定或高昂的按令牌费用。

展望未来，**DeepSeek** 团队暗示将进一步扩展，包括 **多模态支持** 和超过 128K 令牌的扩展上下文窗口。如果这些发展能够按计划进行，DeepSeek\-V3 及其后续版本可能成为开源 AI 中复杂、大规模任务的首选模型。

我们鼓励您尝试，无论是通过 [ChatHub](https://app.chathub.gg/) 还是设置您自己的本地或基于云的实例。随着“开源精神”不断推动机器智能的边界，像 DeepSeek\-V3 这样的模型确保创新对每个人都保持可及。

## 参考文献与进一步阅读

* **DeepSeek\-V3 GitHub 仓库:** [https://github.com/deepseek\-ai/DeepSeek\-V3](https://github.com/deepseek-ai/DeepSeek-V3)
* **DeepSeek\-V3 论文:** 与 GitHub 仓库和白皮书同时发布，深入探讨架构。
* **Fireworks AI:** <https://fireworks.ai/>
* **ChatHub** (在浏览器中尝试 DeepSeek\-V3): <https://app.chathub.gg/>
* **OpenRouter** (用于 Cursor IDE 集成): <https://openrouter.ai/>
* **Docker** (用于容器化): <https://www.docker.com/>
* **Kubernetes** (用于编排): <https://kubernetes.io/>
* **ROCm** (用于 AMD GPU 支持): <https://rocmdocs.amd.com/en/latest/>

**免责声明**: 定价和性能数据基于撰写时公开可用的信息。实际成本可能因使用情况、地区和各服务提供商的更新而有所不同。请始终直接从官方渠道验证最新的文档和定价细节。

