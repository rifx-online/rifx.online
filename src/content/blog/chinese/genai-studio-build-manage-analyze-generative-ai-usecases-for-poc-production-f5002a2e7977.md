---
title: "GenAI Studio：构建、管理和分析用于 POC 和生产的生成式人工智能用例"
meta_title: "GenAI Studio：构建、管理和分析用于 POC 和生产的生成式人工智能用例"
description: "GenAI Studio 是一个用户友好的平台，旨在简化生成式 AI 解决方案的创建、管理和分析，适用于教育和学习目的。其主要功能包括用例创建、更新、删除、测试、比较和分析，支持无编码操作，促进团队协作。该工具提供直观的界面，帮助用户优化 AI 配置、监控性能并降低成本，同时生成 API 端点以便于集成。GenAI Studio 为用户探索和利用 OpenAI 模型提供了良好的环境，助力创新与发现。"
date: 2024-12-26T04:30:18Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*TYqqvAREwIgXUh47bhTqyQ.png"
categories: ["Generative AI", "Education", "Technology/Web"]
author: "Rifx.Online"
tags: ["generative", "studio", "analytics", "endpoints", "integration"]
draft: False

---

### 您构建和管理生成式 AI 解决方案的中心



## 什么让 Gen AI Studio 令人兴奋？

生成式 AI 正在重新塑造我们对问题解决、创造力和效率的思考。然而，构建 AI 解决方案可能会因为技术复杂性而让人感到畏惧。**Gen AI Studio 弥补了这一差距**——让您能够创建、完善和分析 AI 用例，而不必被编码的复杂性所困扰。

**Gen AI Studio 的主要优势**：

1. **简单性**：直观的工作流程，用于创建和管理 AI 驱动的应用程序。
2. **灵活性**：支持跨行业的自定义用例，从聊天机器人到内容生成器。
3. **优化**：内置分析功能，监控令牌使用情况并优化性能，以提高成本效率。
4. **协作**：非常适合希望探索创意和分享见解的团队。

让我们详细探讨每个功能，看看您可以实现什么。

在我们推进这个创新项目时，重要的是要注意 Gen AI Studio 主要是为教育和学习目的而设计的，而不是立即用于生产级部署。其核心目标是提供类似沙箱的体验，让用户深入了解 OpenAI 模型，尝试各种配置，并更深入地理解其能力。

尽管如此，该项目可以扩展到任何级别，提供更多酷炫的功能和更好的用户界面。

## 主页

*欢迎！*

应用程序的欢迎界面立即为无缝体验奠定了基础。用户可以清晰简洁地了解工具的关键功能，指导他们完成创建、更新和测试用例的过程。这种对简单性和可访问性的强调确保即使是对人工智能领域不熟悉的用户也能轻松导航应用程序。

它还突出了已为每个 Azure 模型构建和部署的用例。

### UI 截图

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*abOHv1g4bun_GNrlC0zS7w.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ZlYYa4x-zulWZRJbKQiKgg.png)

### Python代码

```python
def main_page():

    st.title("欢迎来到Gen AI工作室")
    st.write("""
        您的一站式平台，用于设计、测试和优化基于OpenAI模型的AI解决方案。
    """)

    st.header("您可以做些什么？")
    st.markdown("""
    1. **创建用例**：设置自定义AI工作流并生成符合您需求的API端点。
    2. **更新用例**：轻松编辑和完善现有配置。
    3. **删除用例**：轻松移除过时或未使用的配置。
    4. **测试用例**：使用个性化提示预览和测试AI响应。
    5. **比较用例**：并排评估不同配置的输出。
    6. **分析仪表板**：跟踪使用情况，分析令牌成本并优化性能。
    """)
    use_cases = load_use_cases()
    st.header("已部署的用例")
    model_name = st.selectbox("选择模型", MODELS, label_visibility="hidden")
    listed_usecases = []
    for k, v in use_cases.items():
        if model_name == v["ui_deployment_name"]:
            listed_usecases.append(k)

    with st.container(height=300, border=False):
        endpoints = list_endpoints()
        if endpoints:
            for endpoint, config in endpoints.items():
                if endpoint in listed_usecases:
                    with st.expander(label=f"{endpoint}"):
                        st.json(config)
        else:
            st.write("没有可用的配置。请创建一个新用例。")
```

## 1\. 创建用例

*将想法转化为现实*

*创建用例*功能让您可以配置自定义AI工作流。想象一下，您正在为客户服务构建一个聊天机器人或一个内容创作工具——本节将指导您定义提示并生成API端点，以实现无缝集成。

💡 *为什么这很酷*：

* 无需编码！您只需输入用例名称，设置属性并定义提示；Gen AI Studio将处理其余部分。
* 自动生成安全且可扩展的API端点。

### 创建用例屏幕的 UI 截图

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*sfIjm78sk7H9XBnnSy49Fg.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*cgCvScf28ecc1OG1jaorvA.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*vK9QM4YM-WUGnNONUm73HA.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ixJUbUMy4AsbGU8bBpujrg.png)

### Python 代码

```python
def create_use_case():

    st.title("创建新用例")
    st.write("使用侧边栏浏览功能并配置 OpenAI 模型。")

    with st.expander(label="**API 定价**"):
        df = pd.DataFrame(MODEL_DF, columns=['模型名称', '上下文', '输入（每 1,000 个令牌）', '输出（每 1,000 个令牌）'])
        st.dataframe(df, hide_index=True, width=60000)

    use_case_name = st.sidebar.text_input("用例名称", value="", placeholder="输入用例名称")
    ui_deployment_name = st.sidebar.selectbox("部署名称", list(MODEL_DICT.keys()))
  
    azure_deployment_name = MODEL_DEPLOYMENT_NAME_MAPPING[ui_deployment_name]
    selected_model = MODEL_DICT[ui_deployment_name]

    model_name = st.sidebar.selectbox("模型名称", selected_model)

    # 最新更新
    if azure_deployment_name != "":
        temperature = st.sidebar.slider("温度", 0.0, 1.0, 0.1)
        set_max_tokens = st.sidebar.checkbox("设置最大令牌数")
        if set_max_tokens:
            max_tokens = st.sidebar.slider("最大令牌数", 10, 2048, 100)
        else:
            max_tokens = None
        # 在主屏幕窗口中创建一个提示文本框。
        prompt = st.text_area("在此输入新提示", help="1. 如果您想添加自定义提示，可以使用该提示并添加 **{query}** 以获取用户特定问题\n2. 如果您使用 RAG，并希望添加上下文，请使用 **{context}**\n\n**示例提示：您是一个出色的聊天机器人。您擅长回答用户问题：{query} 来自以下 {context}**\n\n您可以选择保持为空。")
        uucc = str(uuid.uuid1())
        config = {
            "ui_deployment_name": ui_deployment_name,
            "azure_deployment_name": azure_deployment_name,
            "model_name": model_name,
            "temperature": temperature,
            "max_tokens": max_tokens,
            "prompt": prompt,
            "uucc": uucc # uucc - 唯一用例代码 
        }
    else:
        config = {
            "ui_deployment_name": ui_deployment_name,
            "azure_deployment_name": azure_deployment_name,
            "model_name": model_name
        }
    if st.button("创建新用例"):
        with st.spinner("正在创建新用例并部署模型..."):
            if use_case_name:
                api_endpoint = generate_api_endpoint(use_case_name, config)
                st.success(f"API 已创建并部署。**确保复制以下详细信息**")
                st.code(f'''
                        如果您想尝试并使用 API，请按照以下步骤操作：
                        1. uucc 号码是： {uucc}
                        2. 主机名是： {HOSTNAME}
                        3. 创建的端点是： http://{HOSTNAME}{api_endpoint}
                        ''', language=None)
                with st.expander("**想用 Python 尝试吗？请参考这里的代码**"):
                    st.code(f'''
                        import requests
                        import json
                        url = "http://{HOSTNAME}{api_endpoint}"
                        payload = json.dumps({{
                        "prompt": "嗨，你好吗？"
                        }})
                        headers = {{
                        'Content-Type': 'application/json'
                        }}
                        response = requests.request("POST", url, headers=headers, data=payload)
                        print(response.text)
                            ''', language='python')
            else:
                st.error("请输入用例名称")
```

## 2\. 更新用例

*优化和完善您的 AI 配置*

AI 解决方案在不断发展。通过 *更新用例* 功能，您可以调整现有配置——修改提示、调整参数或更改提示中的响应格式——以满足您不断变化的需求。

💡 *为什么这很酷*：

* 提供了一种快速、无缝的方式来迭代和改进提示和参数。
* 帮助您在项目扩展时调整工作流程。

### 更新用例屏幕的 UI 截图

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*6bqdPbeJBFlFkUlGBMuxxg.png)

### Python 代码

```python
def update_use_case():

    st.title("更新现有用例")
    st.write("使用侧边栏浏览功能并配置 OpenAI 模型。")

    # st.sidebar.header("更新现有用例")
    ui_deployment_name = st.sidebar.selectbox("部署名称", ["gpt-35", "gpt-4", "gpt-4o", "o1-preview", "claude-35"])
    azure_deployment_name = MODEL_DEPLOYMENT_NAME_MAPPING[ui_deployment_name]
    endpoints = list_endpoints()
    selected_model = MODEL_DICT[ui_deployment_name]
    model_name = st.sidebar.selectbox("模型名称", selected_model)
    use_case_options = [key for key, value in endpoints.items() if value["ui_deployment_name"] == ui_deployment_name]
    selected_use_case = st.sidebar.selectbox("选择用例", use_case_options)

    if selected_use_case:
        config = endpoints[selected_use_case]
        temperature = st.sidebar.slider("温度", 0.0, 1.0, config["temperature"])
        # 从 endpoints.json 文件中读取 max_tokens
        # 并检查 max token 是否有值或为空。
        if config["max_tokens"]:
            set_max_tokens = st.sidebar.checkbox("设置最大令牌", value=True)
        else:
            set_max_tokens = st.sidebar.checkbox("设置最大令牌")
        if set_max_tokens:
            max_tokens = st.sidebar.slider("最大令牌", 10, 1000, config["max_tokens"])
        else:
            max_tokens = None
          
        uucc = config["uucc"]
        prompt = st.text_area("在此输入您的提示", value=config["prompt"], help="**可选** 更新提示")
        config = {
            "ui_deployment_name": ui_deployment_name,
            "azure_deployment_name": azure_deployment_name,
            "model_name": model_name,
            "temperature": temperature,
            "max_tokens": max_tokens,
            "prompt": prompt,
            "uucc": uucc
        }
        if st.button("更新用例"):
            update_endpoints(selected_use_case, config)
            st.success(f"用例 **{selected_use_case}** 已更新")
    else:
        st.sidebar.error("未找到可更新的用例。")
```

## 3\. 删除用例

*保持组织和高效*

过时的配置会使您的工作空间变得杂乱。*删除用例*功能允许您删除不再需要的用例，帮助您专注于最重要的事项。

💡 *为什么这很酷*：

* 通过仅保留活动工作流来简化管理。
* 减轻用户处理多个项目时的认知负担。

### 删除用例屏幕的UI截图

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*qvqmHpYI0_x747m7Eo_9ZA.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*-ghh04sd9YeeP6rEhJkQGQ.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*XlRi03tKHlgvY1Rd25uHZg.png)

### Python 代码

```python
def delete_use_case_page():
    st.title("删除现有用例")
    st.write("使用侧边栏浏览功能并配置 OpenAI 模型。")

    ui_deployment_name = st.sidebar.selectbox("部署名称", list(MODEL_DICT.keys()))
    azure_deployment_name = MODEL_DEPLOYMENT_NAME_MAPPING[ui_deployment_name]

    endpoints = list_endpoints()
    use_case_options = [key for key, value in endpoints.items() if value["ui_deployment_name"] == ui_deployment_name]
    selected_use_case = st.sidebar.selectbox("选择要删除的用例", use_case_options)

    # 初始化模态框
    modal = Modal(key="delete_confirmation_modal", title="确认删除")

    if selected_use_case:
        endpoints = load_endpoints()
        config = endpoints.get(selected_use_case, None)
        confirmation_code = config["uucc"]
        if st.sidebar.button("删除用例"):
            # 打开模态框
            modal.open()

        if modal.is_open():
            with modal.container():
                user_input = st.text_input("输入确认代码:")
              
                if st.button("确认删除"):
                    if user_input == confirmation_code:
                        if delete_use_case(selected_use_case.replace("/api/", "")):
                            st.error(f"已删除用例: {selected_use_case}")
                            st.sidebar.empty()  # 清空侧边栏以刷新列表
                        else:
                            st.error("删除用例失败。")
                        time.sleep(2)
                        modal.close()
                    else:
                        st.error("确认代码不正确。删除已取消。")
    else:
        st.sidebar.error("没有可删除的用例。")
```

## 4\. 测试用例

**预览您的 AI 响应**

*测试用例* 功能使您能够实时评估 AI 对您的提示的响应。调整、修改并微调您的提示，直到您对输出质量感到满意。

💡 *为什么这很酷*：

* 通过提供即时反馈节省时间。
* 帮助微调提示以获得最佳结果。

### 测试用例屏幕的UI截图

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*M_4pSE5_cnU3CahTvkBb2w.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*EnBA09-VmdSkfy7MSMDRhA.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Pllxg9HGyXyLYwRngkkk0Q.png)

### Python 代码

```python
def test_model():
    st.title("测试用例响应")
    st.write("使用侧边栏导航功能并配置 OpenAI 模型。")

    # st.sidebar.header("测试您的 OpenAI 模型配置")
    endpoints = list_endpoints()
    ui_deployment_name = st.sidebar.selectbox("部署名称", list(MODEL_DICT.keys()))
    azure_deployment_name = MODEL_DEPLOYMENT_NAME_MAPPING[ui_deployment_name]

    selected_model = MODEL_DICT[ui_deployment_name]
    model_name = st.sidebar.selectbox("模型名称", selected_model)
    use_case_options = [key for key, value in endpoints.items() if value["ui_deployment_name"] == ui_deployment_name]   
    selected_use_case = st.sidebar.selectbox("选择用例", use_case_options)

    if selected_use_case:
        # 此部分在侧边栏中将帮助与文档聊天。
        config = endpoints[selected_use_case]
        # 移除 uucc 代码以在前端显示。
        config = {k: v for k, v in config.items() if k != 'uucc'}
        try:
            # 仅在提示中存在 {context} 时显示文件上传选项并执行构建索引。
            if "{context}" in config["prompt"]:
                uploaded_file = st.file_uploader("选择文件", help="可选")
                # 如果用户未上传文件。
                if uploaded_file is None:
                    pass
                # 如果用户上传了文件。
                else:
                    upload_file_to_build_index(uploaded_file)
            # 不显示文件选项且不构建索引。
            else:
                uploaded_file = None
        except KeyError as err:
            uploaded_file = None

        with st.expander(label=f"**测试用例：{selected_use_case}**"):
            st.write(f"配置：{config}")

        user_query = st.text_area("询问查询")
  
        if st.button("生成响应"):
            if user_query:
                with st.spinner("思考中..."):
                    llm_answer = test_use_case(selected_use_case, config, user_query, uploaded_file)
                    with st.expander(label="模型响应"):
                        st.write(llm_answer, unsafe_allow_html=True)
            else:
                st.warning("请输入提示。")
```

## 5\. 比较用例

**并排评估输出**

想知道哪个配置能提供最佳结果吗？*比较用例*功能让您可以比较不同设置的输出，从而更容易选择最有效的配置。

💡 *为什么这很酷*：

* 便于进行A/B测试，无需额外努力。
* 比较AI模型针对相同查询生成的响应，这将帮助您判断并最终确定提示。
* 鼓励基于数据的决策，以优化项目。

### 比较用例屏幕的 UI 截图：非上下文基础用例

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*9vUNoXUxoCrYYa9KfbQFKQ.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*w6UEPwl-zSpWQkpHlMWH_A.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*JESPGQxeSKRh56CDQtJ5ww.png)

### 比较用例屏幕的 UI 截图：基于上下文的用例 (基于 RAG)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*sLnqq-RTrYatwozdnpZxvQ.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*I0ib5DIHX3U_ZN_KNC3lWQ.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*PcoaH5AwT1IOuSzCpviUEA.png)

### Python 代码

```python
def compare_use_cases():
    st.title("比较用例响应")
    # 获取所有可用的用例
    use_cases = load_use_cases() # 此函数应返回用例名称的列表
    ucases_category = {
        "基于上下文":[],
        "非基于上下文": []
    }
    for usecase, configuration in use_cases.items():
        if "{context}" in configuration["prompt"]:
            ucases_category["基于上下文"].append(usecase)
        else:
            ucases_category["非基于上下文"].append(usecase)

    ucase_type = st.selectbox("选择用例类型", list(ucases_category.keys()))
    if ucase_type == "基于上下文":
        use_cases_list = list(ucases_category["基于上下文"])
        # 仅在提示中存在 {context} 时显示文件上传选项，并执行构建索引。
        uploaded_file = st.file_uploader("选择文件",  help="可选")
        # 如果用户未上传文件。
        if uploaded_file is None:
            pass
        # 如果用户上传了文件。
        else:
            upload_file_to_build_index(uploaded_file)
    else:
        use_cases_list = list(ucases_category["非基于上下文"])
        uploaded_file = None

    # 用例的多选
    selected_use_cases = st.multiselect(
        "选择要比较的用例",
        options=use_cases_list,
        default=use_cases_list[:2] if len(use_cases_list) >= 2 else use_cases_list
    )

    # 测试问题的输入
    question = st.text_area("输入您的问题:")

    if st.button("比较响应"):
        if not question:
            st.warning("请输入一个问题。")
            return
        if not selected_use_cases:
            st.warning("请至少选择一个用例。")
            return

        # 收集响应
        responses = {}
        for use_case in selected_use_cases:
            config = use_cases[use_case]
            with st.spinner(f"获取 {use_case} 的响应..."):
                response = test_use_case(use_case, config, question, uploaded_file)
                responses[use_case] = response

        # 显示响应
        st.subheader("响应:")
        for use_case, response in responses.items():
            with st.expander(f"{use_case} 响应"):
                st.write(response)

        # 创建比较表
        comparison_data = []
        for use_case, response in responses.items():
            comparison_data.append({
                "用例": use_case,
                "响应长度": len(response),
                "字数": len(response.split()),
                # 根据需要添加更多指标
            })

        df = pd.DataFrame(comparison_data)
        st.subheader("比较指标:")
        st.dataframe(df, hide_index=True, height=100, width=60000)

        # 可视化比较
        fig = px.bar(df, x="用例", y="字数", title="响应字数比较")
        st.plotly_chart(fig)
```

## 6\. 分析仪表板

**监控和优化性能**

了解您的 AI 性能至关重要。*分析仪表板* 提供了关于令牌使用、响应时间和成本趋势的洞察。利用这些数据优化配置并降低开支。

💡 *为什么这很酷*：

* 获取有关 **每次调用的平均令牌** 和 **每次调用的成本** 的洞察，帮助您有效优化工作流程。
* 使特定用例的资源消耗呈现更细致的视图。
* 有助于理解资源的分配，并调整提示以提高效率。
* 使针对特定场景的分析成为可能，从而增强决策能力。
* 使您能够跟踪 AI 工作流和使用的投资回报率。
* 识别瓶颈和优化机会。

### 分析仪表板屏幕的 UI 截图

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*_xAxUfcpNrSM75yW38GEHA.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*_40nxawf8YMefyyCG-QKXw.png)

### Python 代码

```python
def analytics_dashboard():
    st.title("APIs 分析仪表板")
    # 加载用例
    use_cases = load_use_cases()
    # 侧边栏用于选择用例和日期范围
    st.sidebar.header("配置")
    ui_deployment_name = st.sidebar.selectbox("部署名称", list(MODEL_DICT.keys()))
    azure_deployment_name = MODEL_DEPLOYMENT_NAME_MAPPING[ui_deployment_name]
    selected_model = MODEL_DICT[ui_deployment_name]
    model_name = st.sidebar.selectbox("选择模型", selected_model)
    listed_usecases = []
    for k, v in use_cases.items():
        if model_name == v["model_name"]:
            listed_usecases.append(k)

    selected_use_case = st.sidebar.selectbox("选择用例", list(listed_usecases))
  
    if selected_use_case:
    # 日期范围选择
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=30)
        start_date = st.sidebar.date_input("开始日期", start_date)
        end_date = st.sidebar.date_input("结束日期", end_date)
        if start_date > end_date:
            st.error("错误：结束日期必须在开始日期之后。")
            return

    # 获取所选用例的数据
    config = {"model_name": "example_model"}  # 你可能想把这个存储在一个单独的配置文件中
    data = get_use_case_data(selected_use_case, config, start_date, end_date)

    if not data:
        st.write("未找到所选用例的数据。")
    else:
        # 显示整体指标
        st.header("整体指标")
        col1, col2, col3 = st.columns(3)
        col1.metric("总API调用次数", format_number(data['total_calls']))
        col2.metric("总令牌数", format_number(data['total_tokens']))
        col3.metric("总费用", f"${format_number(data['total_cost'])}")

        col1, col2 = st.columns(2)
        col1.metric("每次调用的平均令牌数", format_number(data['avg_tokens_per_call']))
        col2.metric("每次调用的平均费用", f"${format_number(data['avg_cost_per_call'])}")

        # 显示每日使用情况图表
        st.header("每日使用情况")
        daily_df = pd.DataFrame(data['daily_usage'])
        daily_df['date'] = pd.to_datetime(daily_df['date'])
      
        fig = create_daily_usage_chart(daily_df)
        st.plotly_chart(fig, use_container_width=True)

        # 添加汇总统计
        st.subheader("汇总统计")
        col1, col2, col3 = st.columns(3)
        col1.metric("平均每日API调用次数", f"{daily_df['id'].mean():.2f}")
        col2.metric("平均每日令牌数", f"{daily_df['total_tokens'].mean():.2f}")
        col3.metric("平均每日费用", f"${daily_df['total_cost'].mean():.2f}")

        # 添加数据表
        st.subheader("每日使用数据")
        st.dataframe(daily_df.style.format({
            'id': '{:.0f}',
            'total_tokens': '{:.0f}',
            'total_cost': '${:.2f}'
        }),hide_index=True,  height=250, width=60000)

        # 显示令牌分布
        st.header("令牌分布")
        token_dist = pd.DataFrame({
            '类型': ['提示令牌', '完成令牌'],
            '令牌': [data['total_prompt_tokens'], data['total_completion_tokens']]
        })
        fig_tokens = px.pie(token_dist, values='Tokens', names='Type', title='令牌分布')
        st.plotly_chart(fig_tokens, use_container_width=True)

        # 数据导出选项
        if st.button("导出数据"):
            export_data = pd.DataFrame(data['daily_usage'])
            csv = export_data.to_csv(index=False)
            st.download_button(
                label="下载CSV",
                data=csv,
                file_name=f"{selected_use_case}_analytics.csv",
                mime="text/csv",
            )
```

## 代码文件夹结构

***一旦我们为这篇文章获得 2000 次点赞和 50 条以上的评论，我将解锁并与大家分享完整的代码文件和 GitHub。因此，请务必关注、点赞 👏 和订阅！***

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*OmlAEqS2elaouljLT2j-lQ.png)

## 到目前为止我们在 Gen AI Studio 中学到的内容

### 1\. 轻松配置 AI 模型

Gen AI Studio 提供了一个用户友好的界面，引导您完成创建、更新和管理自己用例的过程。您将学习如何根据您的具体需求定制 OpenAI 模型，充分发挥它们在您项目中的潜力。

### 2\. 实验与测试

***Test Use Case*** 功能使您能够评估您配置的模型对自定义提示的响应。这个实践方法让您深入了解AI算法的细微差别，揭示它们的优势、局限性和潜在的改进领域。

### 3\. 比较分析

通过 ***比较用例*** 功能，您将获得关于各种 OpenAI 模型之间细微差异的宝贵见解。通过分析多个用例生成的输出，您将更深入地理解模型的适用性及影响其性能的因素。

### 4\. 成本和使用情况洞察

***分析仪表板*** 为您提供与 API 调用相关的成本和使用情况指标的全面视图。这些知识将使您能够对 AI 驱动的项目的可扩展性和可行性做出明智的决策，从而确保资源的有效分配。

### 5\. 探索人工智能的前沿

除了实用技能，Gen AI Studio 还培养了创造力和创新的环境。当你深入了解 OpenAI 模型时，你会受到启发，推动可能性的边界，开启探索和发现的新途径。

### 6\. 最重要的是：部署和构建 API

虽然 Gen AI Studio 主要专注于教育和学习，但它确实为用户提供了一条将实验转化为生产就绪解决方案的路径。该应用程序为每个配置的用例生成 API 端点，使用户能够无缝地将生成的模型集成到他们自己的应用程序和服务中。

通过利用这些 API 端点，用户可以构建强大、可扩展和安全的应用程序，充分发挥 OpenAI 模型的优势。API 集成过程经过简化，使开发人员能够快速部署他们的 AI 驱动功能和解决方案。

## 为什么你应该尝试它？

Gen AI Studio 不仅简化了 AI — 它还赋予你创造性思维，探索 AI 的潜在应用。无论你是在原型设计、测试还是扩展解决方案。

随着我们深入探讨人工智能的未来，像 Gen AI Studio 这样的工具无疑将在普及先进 AI 能力方面发挥关键作用。通过营造探索和学习的环境，这个应用程序使用户能够突破可能性的界限，开启创新和发现的新途径。

因此，无论你是经验丰富的 AI 专业人士，还是充满好奇的初学者，Gen AI Studio 邀请你踏上一个迷人的发现之旅。释放你的创造力，尝试 OpenAI 模型的强大功能，解锁未来无限的可能性。


