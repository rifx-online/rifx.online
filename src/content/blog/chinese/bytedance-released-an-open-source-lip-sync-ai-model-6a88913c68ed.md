---
title: "ByteDance 发布开源唇语同步人工智能模型"
meta_title: "ByteDance 发布开源唇语同步人工智能模型"
description: "字节跳动发布了开源视频唇动同步AI模型LatentSync，利用音频条件的潜在扩散模型实现唇动与音频的精确匹配。该模型通过时间表示对齐技术提高了时间一致性，生成的深度伪造视频效果令人信服。用户可在Replicate和Fal平台上使用该模型，生成成本低且速度快。尽管有改进空间，LatentSync在开源工具中表现优异，具备广泛的应用潜力，但也需注意其可能带来的深度伪造风险。"
date: 2025-01-09T02:13:11Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*iuGooiYhFpii-B90LGjGBA.jpeg"
categories: ["Technology", "Generative AI", "Machine Learning"]
author: "Rifx.Online"
tags: ["lip-sync", "deepfake", "TREPA", "diffusion", "temporal"]
draft: False

---





字节跳动最近推出了 [LatentSync](https://arxiv.org/abs/2412.09262)，这是一个新的最先进的开源视频唇动同步模型。它是一个基于音频条件的潜在扩散模型的端到端唇动同步框架。

这听起来有点复杂，但它的意思是你可以上传一个人说话的视频和一个你想用来替代原始音频的音频文件。然后，AI 会覆盖新的音频，并调整说话者的唇部动作，以完美匹配上传的音频。

最终结果是一个令人信服的，尽管有点不寒而栗的深度伪造视频。

老实说，我对这一领域变化的速度感到惊讶。就在一年前，AI 视频中的唇动同步感觉很奇怪，嘴部动作常常显得令人毛骨悚然。现在，随着 LatentSync 的推出，我们正迈入一个轻松而令人信服的深度伪造视频的新纪元。

下面是一个示例：





如果你是一个关注 AI 技术最新进展的人，带有唇动同步音频的视频并不新鲜。事实上，我几个月前就写过关于它们的文章，但它们都有一个共同点，那就是结果的质量。许多工具在让嘴部与说出的词完全匹配方面都很挣扎。此外，嘴唇周围的区域可能看起来不对劲，因此脸部有时显得不自然。

这种效果与“怪异谷”有关，即某些东西看起来几乎像人类，但仍然让你感到有些不对劲。就个人而言，那些旧视频总让我想起一些独立科幻电影中的低预算特效。

## LatentSync 的工作原理

LatentSync 框架使用 Stable Diffusion 直接建模复杂的音频-视觉关联。然而，基于扩散的唇动同步方法由于扩散过程在不同帧之间的变化，通常缺乏时间一致性。

为了解决这个问题，研究人员引入了时间表示对齐（Temporal REPresentation Alignment，TREPA），它在保持唇动同步准确性的同时改善了时间一致性。TREPA 使用来自大规模自监督视频模型的时间表示，将生成的帧与真实帧对齐。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*xH-5S1hv3qBB31FY.png)

LatentSync 使用 Whisper 将梅尔频谱图转换为音频嵌入，这些嵌入通过交叉注意力层添加到 U-Net 中。参考帧和遮罩帧与带噪声的潜变量结合，作为 U-Net 的输入。

在训练过程中，研究人员从预测噪声中估计干净的潜变量，并解码以获得干净的帧。在像素空间中应用 TREPA、LPIPS 和 SyncNet 损失。

如果你想了解更多关于 LatentSync 的技术细节，可以查看白皮书 [here](https://arxiv.org/pdf/2412.09262)。

## 如何进行AI口型同步

由于该模型是开源的，API已经在[Replicate](https://replicate.com/bytedance/latentsync)和[Fal](https://fal.ai/models/fal-ai/latentsync)上可用。

在Replicate中，您可以在探索页面中查找字节跳动的LatentSync模型，在Playground选项卡中上传您的参考视频和音频文件。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*3hFsm7aNN01ShuMwHyS06Q.png)

您可以将引导比例和种子编号保持为默认值。点击“Boot + Run”按钮，等待最终视频生成。您将获得一个带有新音频覆盖的口型同步视频文件。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*nkS6HL8ivdz6dBaOJXUyFA.png)

所需时间取决于您的剪辑长度。对于一个20秒的示例视频，可能需要大约五分钟。我自己测试过，虽然不是瞬间完成，但与旧的口型同步工具相比，速度令人惊讶地快。

在Fal上，过程类似。将您的输入视频和音频文件上传到输入部分，然后点击“Run”按钮。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*fNANzs93i8dAVu2BIkXcCg.png)

您还可以通过API将其集成到自己的应用中。以下是一个API请求的示例：

```python
import { fal } from "@fal-ai/client";

const result = await fal.subscribe("fal-ai/sync-lipsync", {
  input: {
    video_url: "https://fal.media/files/koala/8teUPbRRMtAUTORDvqy0l.mp4",
    audio_url: "https://fal.media/files/lion/vyFWygmZsIZlUO4s0nr2n.wav"
  },
  logs: true,
  onQueueUpdate: (update) => {
    if (update.status === "IN_PROGRESS") {
      update.logs.map((log) => log.message).forEach(console.log);
    }
  },
});
console.log(result.data);
console.log(result.requestId);
```
您将获得一个指向生成的视频文件的链接，如下所示：

```python
{
  "video": {
    "url": "https://v3.fal.media/files/rabbit/6gJV-z7RJsF0AxkZHkdgJ_output.mp4"
  }
}
```
我喜欢这些平台的用户友好性。它们处理了所有繁重的工作，您只需上传文件即可获得结果。

## 生成您自己的视频

如果您没有现成的视频，可以使用像 [Flux Labs AI](https://www.fluxlabs.ai/) 这样的 AI 工具创建一个图像，然后使用 Runway Gen\-3 Alpha 将其转换为视频。

要生成图像，请访问 [fluxlabs.ai](https://www.fluxlabs.ai/) 并打开图像生成仪仪表板。确保设置正确的参数，例如 Flux 模型、宽高比和输出格式。您可以将高级设置保留为默认值。在点击生成按钮之前，在提示字段中描述您的 AI 角色。

以下是一个图像提示示例：

> **提示：** 一位年轻、迷人的 AI 网红，拥有无瑕的肌肤和及肩的光滑长发，穿着一件时尚的浅色西装外套，里面搭配白色上衣。她站在一个明亮、现代的工作室里，背景中有一些微妙的科技主题元素，如全息界面或悬浮图标。她的表情愉快而专注，一只手自信地做出手势，仿佛在向观众解释某个概念。另一只手微微抬起，增添了她的动态姿势，柔和而迷人的灯光突显了她精致而亲切的外表。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*GSe2g8W3hx0ah1QqaeeKjg.png)

将图像文件下载到本地磁盘。

接下来，前往 [app.runway.com](https://app.runway.com) 并打开图像到视频工具。上传您刚刚创建的图像，并给 Runway 一个提示，描述您希望视频的样子。例如，也许您希望您的角色以随意的方式移动头部和手。

结果是一个 10 秒的视频，展示我们的 AI 角色进行各种手势和头部运动，仿佛她在解释某些内容。她们通常不会说话，因为我们还没有添加任何说话动画。不过，看到静态图像变得生动真的很酷。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*VPftb3Qo81Vqq0mknW01PQ.png)

最后，前往 [fal.ai](https://fal.ai)（或 Replicate）并寻找 LatentSync 模型。上传您刚刚制作的视频以及您想要的任何音频文件。点击“生成”，稍等片刻，您将得到一个新视频，其中您的 AI 角色实际上在“说”音频中的内容。

以下是最终视频的样子：





就这样！不到 10 分钟，我就能够制作一个会说话的 AI 生成网红。

## 费用是多少？

在 Replicate 上，LatentSync 模型的运行成本大约为 $0.095，或者每 $1 运行 10 次，但这取决于您的输入。该模型运行在 [Nvidia L40S GPU 硬件](https://replicate.com/docs/billing) 上。预测通常在 98 秒内完成。该模型的预测时间根据输入的不同而有显著变化。

在 Fal 上，每生成视频的成本为每分钟 $0.7。这意味着，花费 $1，您可以大约运行一次 LatentSync 模型。

## 本地免费运行

如果您想避免按运行付费，可以在自己的计算机上安装 LatentSync。目前应该有多个变体，但我在 GitHub 上看到的一个版本是 [ComfyUI\-LatentSyncWrapper](https://github.com/ShmuelRonen/ComfyUI-LatentSyncWrapper?tab=readme-ov-file)，由 [ShmuelRonen](https://github.com/ShmuelRonen) 提供。

在安装此节点之前，您必须按以下顺序安装以下内容：

1. 已安装并正常工作的 [ComfyUI](https://github.com/comfyanonymous/ComfyUI)。请查看此 [指南](https://github.com/comfyanonymous/ComfyUI) 了解如何安装和使用 ComfyUI。
2. Python 3\.8–3\.11（mediapipe 还不支持 Python 3\.12\）
3. 已在您的系统上安装 [FFmpeg](https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip)。确保将 `C:\ffmpeg\bin` 添加到系统 PATH 中
4. 如果您遇到 PYTHONPATH 错误：
* 确保 Python 在您的系统 PATH 中
* 尝试以管理员身份运行 ComfyUI

要安装 LatentSync，请将 [此](https://github.com/ShmuelRonen/ComfyUI-LatentSyncWrapper?tab=readme-ov-file) 存储库克隆到您的 ComfyUI custom\_nodes 目录中：

```python
cd ComfyUI/custom_nodes
git clone https://github.com/ShmuelRonen/ComfyUI-LatentSyncWrapper.git
cd ComfyUI-LatentSyncWrapper
pip install -r requirements.txt
```
该节点将在首次使用时尝试自动从 HuggingFace 下载所需的模型文件。然后按照以下步骤执行视频处理。

1. 选择一个输入视频文件
2. 使用 ComfyUI 音频加载器加载音频文件
3. （可选）设置一个种子值以获得可重复的结果
4. 连接到 LatentSync 节点
5. 运行工作流程

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*PqaHdKD0JV0jr-WJ)

完成后，同步的视频将出现在 ComfyUI 的输出文件夹中。请记住，它可能会使用大约 6\.5 GB 的 GPU 内存。如果您有像 RTX 3060 或更好的 GPU，应该没问题。

就我而言，我喜欢使用本地设置，因为我不必担心费用或使用限制。我可以进行任意数量的测试，如果我想调整某些内容，也更容易查看代码。不过，是的，设置确实需要多花一些精力。

## 为什么您应该关心？

LatentSync 是我尝试过的最令人印象深刻的免费唇同步工具之一。其他开源选项，如 RenderNet 或 Hedra，通常在唇部对齐或在某人微笑或过度转动头部时保持面部正常外观等细节上表现不佳。然而，LatentSync 处理这些问题相当顺畅。

不过，它并不完美。您可能会注意到一些小故障，尤其是在说话者试图频繁微笑或快速转头时。但与旧方法相比，它已经接近得足以让人感觉这是一个巨大的进步。此外，如果您将其与一些付费服务（如 Kling AI 或 Runway 中的高级工具）进行比较，在某些情况下，这些服务可能会产生更干净的结果。

**但我们拥有一个免费和开源的工具，其性能几乎与高级选项相当，这对 AI 社区来说是一个巨大的胜利。**

这里有很多创造潜力。例如，您可以制作短广告、教育视频或数字影响者，而无需雇佣真实演员。您还可以根据需要更换音轨，因此制作多种语言的视频变得简单——只需插入您翻译的配音。这种灵活性可以为较小的创作者、初创企业或任何没有大预算在录音棚拍摄的人节省大量时间和金钱。

另一方面，这种易于使用的工具使得创建可能传播错误信息或欺骗他人的深度伪造视频变得更加简单。我们都应该在教育彼此关于这项技术、如何识别深度伪造以及在制作真实人物视频时为何需要征得同意方面尽自己的一份力。

## 最后的想法

LatentSync 作为一个开源工具真的很酷。与其他工具如 Facefusion 和 Hedra 相比，结果看起来特别好，尤其是在处理微笑面孔等方面。

它并不完美，仍有改进空间，但现在无疑是最好的开源选择。当然，像 Kling AI 或 Runway 这样的付费工具可能做得更好，但看到像这样的免费工具变得如此出色，真是太棒了。

这对广告或虚拟影响者等事物可以带来很大的不同。制作 AI 角色对话的视频曾经很困难，但 LatentSync 让这一切变得超级简单。

当然，我想再次强调，任何强大的技术都需要负责任的使用。如果不小心，深度伪造很容易欺骗他人。但如果你明智地使用它，用于搞笑、创意项目或合法的商业案例，这种创新可以带来很多好处。

我很期待在我的一个项目中使用这个。我甚至可能会用它构建一个应用程序。看到现在的可能性真的很有趣。

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*9Oz6fsFNQIaINrMz.png)

此故事发布于 [Generative AI](https://generativeai.pub/)。请在 [LinkedIn](https://www.linkedin.com/company/generative-ai-publication) 上与我们联系，并关注 [Zeniteq](https://www.zeniteq.com/)，以获取最新的 AI 故事。

订阅我们的 [newsletter](https://www.generativeaipub.com/) 和 [YouTube](https://www.youtube.com/@generativeaipub) 频道，及时获取生成式 AI 的最新新闻和更新。让我们一起塑造 AI 的未来！

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*cUu0UaSEdxZR0huE.png)

