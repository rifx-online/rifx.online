---
title: "GenAI Studio: Build, Manage & Analyze Generative AI Usecases for POC & Production"
meta_title: "GenAI Studio: Build, Manage & Analyze Generative AI Usecases for POC & Production"
description: "Gen AI Studio is an intuitive platform designed to simplify the creation, management, and analysis of generative AI use cases. It offers features such as use case creation, updates, testing, and performance comparison, all without requiring coding skills. The tool also includes an analytics dashboard to monitor usage and costs, facilitating informed decision-making for AI projects. While primarily focused on educational purposes, it enables users to generate API endpoints for integrating AI models into applications, promoting innovation and exploration in AI capabilities."
date: 2024-12-26T04:30:18Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*TYqqvAREwIgXUh47bhTqyQ.png"
categories: ["Generative AI", "Education", "Technology/Web"]
author: "Rifx.Online"
tags: ["generative", "studio", "analytics", "endpoints", "integration"]
draft: False

---





### Your Hub for Building and Managing Generative AI Solutions




## What Makes Gen AI Studio Exciting?

Generative AI is reshaping how we think about problem\-solving, creativity, and efficiency. However, building AI solutions can feel intimidating due to the technical complexity involved. **Gen AI Studio bridges the gap** — allowing you to create, refine, and analyze AI use cases without being bogged down by coding intricacies.

**Key Benefits of Gen AI Studio**:

1. **Simplicity**: Intuitive workflows for creating and managing AI\-powered applications.
2. **Flexibility**: Supports custom use cases across industries, from chatbots to content generators.
3. **Optimization**: Built\-in analytics to monitor token usage and refine performance for cost efficiency.
4. **Collaboration**: Ideal for teams wanting a sandbox to explore ideas and share insights.

Let’s delve into each feature in detail and see what you can accomplish.

As we move ahead on this innovative project, it’s important to note that Gen AI Studio is primarily designed for educational and learning purposes, rather than immediate production\-level deployment. Its core objective is to provide a sandbox\-like experience, allowing users to delve into the world of OpenAI models, experiment with various configurations, and gain a deeper understanding of their capabilities.

Although, this project can be scaled up to any level with more cool features and much better User Interface.


## Main Page

*Welcome!*

The application’s welcoming interface immediately sets the stage for a seamless journey. Users are greeted with a clear and concise overview of the tool’s key features, guiding them through the process of creating, updating, and testing use cases. This emphasis on simplicity and accessibility ensures that even those new to the AI landscape can navigate the application with ease.

It also highlights the usecases already built and deployed for each Azure Model.


### UI Screenshots

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*abOHv1g4bun_GNrlC0zS7w.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ZlYYa4x-zulWZRJbKQiKgg.png)


### Python Code


```python
def main_page():

    st.title("Welcome to Gen AI Studio")
    st.write("""
        Your all-in-one platform to design, test, and optimize AI-powered solutions with OpenAI models.
    """)

    st.header("What Can You Do?")
    st.markdown("""
    1. **Create Use Case**: Set up custom AI workflows and generate API endpoints tailored to your needs.
    2. **Update Use Case**: Edit and refine existing configurations effortlessly.
    3. **Delete Use Case**: Remove outdated or unused configurations with ease.
    4. **Test Use Case**: Preview and test AI responses using personalized prompts.
    5. **Compare Use Cases**: Evaluate outputs from different configurations side by side.
    6. **Anaytics Dashboard**: Track usage, analyze token costs, and optimize performance.
    """)
    use_cases = load_use_cases()
    st.header("Deployed Use Cases")
    model_name = st.selectbox("selected model", MODELS, label_visibility="hidden")
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
            st.write("No configurations available. Please create a new use case.")
```

## 1\. Create Use Case

*Transform Ideas into Reality*

The *Create Use Case* feature lets you configure custom AI workflows. Imagine you’re building a chatbot for customer service or a content creation tool — this section guides you through defining prompts and generating API endpoints for seamless integration.

💡 *Why It’s Cool*:

* No coding required! You just have to enter the usecase name, set properties and define the prompt; Gen AI Studio handles the rest.
* Generate secure and scalable API endpoints automatically.


### UI Screenshots for Create Use Case Screen

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*sfIjm78sk7H9XBnnSy49Fg.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*cgCvScf28ecc1OG1jaorvA.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*vK9QM4YM-WUGnNONUm73HA.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*ixJUbUMy4AsbGU8bBpujrg.png)


### Python Code


```python
def create_use_case():

    st.title("Create a New Use Case")
    st.write("Use the sidebar to navigate through the functionalities and configure OpenAI models.")

    with st.expander(label="**API Pricing**"):
        df = pd.DataFrame(MODEL_DF, columns=['Model Name', 'Context', 'Input (Per 1,000 tokens)', 'Output (Per 1,000 tokens)'])
        st.dataframe(df, hide_index=True, width=60000)

    use_case_name = st.sidebar.text_input("Use Case Name", value="", placeholder="Enter Use Case Name")
    ui_deployment_name = st.sidebar.selectbox("Deployment Name", list(MODEL_DICT.keys()))
    
    azure_deployment_name = MODEL_DEPLOYMENT_NAME_MAPPING[ui_deployment_name]
    selected_model = MODEL_DICT[ui_deployment_name]

    model_name = st.sidebar.selectbox("Model Name", selected_model)

    # Latest Update
    if azure_deployment_name != "":
        temperature = st.sidebar.slider("Temperature", 0.0, 1.0, 0.1)
        set_max_tokens = st.sidebar.checkbox("Set Max Tokens")
        if set_max_tokens:
            max_tokens = st.sidebar.slider("Max Tokens", 10, 2048, 100)
        else:
            max_tokens = None
        # Create a prompt text box in the main screen window.
        prompt = st.text_area("Enter new prompt here", help="1. If you want to add a custom prompt, you may use that and may add **{query}** for user specific question\n2. If you are using RAG, where you want to add a context, use **{context}**\n\n**Sample Prompt: You are a great chatbot. You are great at answering user questions: {query} from the following {context}**\n\nOptionally you can keep it blank.")
        uucc = str(uuid.uuid1())
        config = {
            "ui_deployment_name": ui_deployment_name,
            "azure_deployment_name": azure_deployment_name,
            "model_name": model_name,
            "temperature": temperature,
            "max_tokens": max_tokens,
            "prompt": prompt,
            "uucc": uucc # uucc - unique use-case code 
        }
    else:
        config = {
            "ui_deployment_name": ui_deployment_name,
            "azure_deployment_name": azure_deployment_name,
            "model_name": model_name
        }
    if st.button("Create New Use Case"):
        with st.spinner("Creating New Usecase & Deploying Model..."):
            if use_case_name:
                api_endpoint = generate_api_endpoint(use_case_name, config)
                st.success(f"API created and deployed. **Make sure to copy the below details**")
                st.code(f'''
                        If you want to try and use the API. Follow the steps below:
                        1. uucc number is: {uucc}
                        2. Hostname is: {HOSTNAME}
                        3. Endpoint created is: http://{HOSTNAME}{api_endpoint}
                        ''', language=None)
                with st.expander("**Want to try with python? please refer the code here**"):
                    st.code(f'''
                        import requests
                        import json
                        url = "http://{HOSTNAME}{api_endpoint}"
                        payload = json.dumps({{
                        "prompt": "Hi, how are you doing?"
                        }})
                        headers = {{
                        'Content-Type': 'application/json'
                        }}
                        response = requests.request("POST", url, headers=headers, data=payload)
                        print(response.text)
                            ''', language='python')
            else:
                st.error("Please Enter the Use Case Name")
```

## 2\. Update Use Case

*Refine and Perfect Your AI Configurations*

AI solutions evolve. With the *Update Use Case* feature, you can tweak existing configurations — modify prompts, adjust parameters, or change response formats within the prompt— to meet your changing needs.

💡 *Why It’s Cool*:

* Offers a quick, seamless way to iterate and improve the prompt and parameters.
* Helps you adapt workflows as your project scales.


### UI Screenshots for Update Use Case Screen

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*6bqdPbeJBFlFkUlGBMuxxg.png)


### Python Code


```python
def update_use_case():

    st.title("Update an Existing Use Case")
    st.write("Use the sidebar to navigate through the functionalities and configure OpenAI models.")

    # st.sidebar.header("Update Existing Use Case")
    ui_deployment_name = st.sidebar.selectbox("Deployment Name", ["gpt-35", "gpt-4", "gpt-4o", "o1-preview", "claude-35"])
    azure_deployment_name = MODEL_DEPLOYMENT_NAME_MAPPING[ui_deployment_name]
    endpoints = list_endpoints()
    selected_model = MODEL_DICT[ui_deployment_name]
    model_name = st.sidebar.selectbox("Model Name", selected_model)
    use_case_options = [key for key, value in endpoints.items() if value["ui_deployment_name"] == ui_deployment_name]
    selected_use_case = st.sidebar.selectbox("Select Use Case", use_case_options)

    if selected_use_case:
        config = endpoints[selected_use_case]
        temperature = st.sidebar.slider("Temperature", 0.0, 1.0, config["temperature"])
        # Read the max_tokens from the endpoints.json file
        # and check if the max token has some value or is null.
        if config["max_tokens"]:
            set_max_tokens = st.sidebar.checkbox("Set Max Tokens", value=True)
        else:
            set_max_tokens = st.sidebar.checkbox("Set Max Tokens")
        if set_max_tokens:
            max_tokens = st.sidebar.slider("Max Tokens", 10, 1000, config["max_tokens"])
        else:
            max_tokens = None
            
        uucc = config["uucc"]
        prompt = st.text_area("Enter your prompt here", value= config["prompt"], help="**Optional** to update the prompt")
        config = {
            "ui_deployment_name": ui_deployment_name,
            "azure_deployment_name": azure_deployment_name,
            "model_name": model_name,
            "temperature": temperature,
            "max_tokens": max_tokens,
            "prompt": prompt,
            "uucc": uucc
        }
        if st.button("Update Use Case"):
            update_endpoints(selected_use_case, config)
            st.success(f"Use Case **{selected_use_case}** Updated")
    else:
        st.sidebar.error("No Use Case Found to Update.")
```

## 3\. Delete Use Case

*Stay Organized and Efficient*

Outdated configurations clutter your workspace. The *Delete Use Case* feature allows you to delete usecases that are no longer required, helping you focus on what matters most.

💡 *Why It’s Cool*:

* Simplifies management by keeping only active workflows.
* Reduces cognitive load for users handling multiple projects.


### UI Screenshots for Delete Use Case Screen

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*qvqmHpYI0_x747m7Eo_9ZA.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*-ghh04sd9YeeP6rEhJkQGQ.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*XlRi03tKHlgvY1Rd25uHZg.png)


### Python Code


```python
def delete_use_case_page():
    st.title("Delete an Existing Use Case")
    st.write("Use the sidebar to navigate through the functionalities and configure OpenAI models.")

    ui_deployment_name = st.sidebar.selectbox("Deployment Name", list(MODEL_DICT.keys()))
    azure_deployment_name = MODEL_DEPLOYMENT_NAME_MAPPING[ui_deployment_name]

    endpoints = list_endpoints()
    use_case_options = [key for key, value in endpoints.items() if value["ui_deployment_name"] == ui_deployment_name]
    selected_use_case = st.sidebar.selectbox("Select Use Case to Delete", use_case_options)

    # Initialize the modal
    modal = Modal(key="delete_confirmation_modal", title="Confirm Deletion")

    if selected_use_case:
        endpoints = load_endpoints()
        config = endpoints.get(selected_use_case, None)
        confirmation_code = config["uucc"]
        if st.sidebar.button("Delete Use Case"):
            # Open the modal
            modal.open()

        if modal.is_open():
            with modal.container():
                user_input = st.text_input("Enter the confirmation code:")
                
                if st.button("Confirm Delete"):
                    if user_input == confirmation_code:
                        if delete_use_case(selected_use_case.replace("/api/", "")):
                            st.error(f"Deleted Use Case: {selected_use_case}")
                            st.sidebar.empty()  # Clear the sidebar to refresh the list
                        else:
                            st.error("Failed to delete use case.")
                        time.sleep(2)
                        modal.close()
                    else:
                        st.error("Incorrect confirmation code. Deletion canceled.")
    else:
        st.sidebar.error("No Use Case to Delete.")
```

## 4\. Test Use Case

**Preview Your AI’s Responses**

The *Test Use Case* feature enables you to evaluate how the AI responds to your prompts in real\-time. Adjust, tweak, and fine\-tune your prompt until you’re satisfied with the output quality.

💡 *Why It’s Cool*:

* Saves time by providing immediate feedback.
* Helps fine\-tune prompts for optimal results.


### UI Screenshots for Test Use Case Screen

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*M_4pSE5_cnU3CahTvkBb2w.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*EnBA09-VmdSkfy7MSMDRhA.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*Pllxg9HGyXyLYwRngkkk0Q.png)


### Python Code


```python
def test_model():
    st.title("Test Use Case Response")
    st.write("Use the sidebar to navigate through the functionalities and configure OpenAI models.")

    # st.sidebar.header("Test Your OpenAI Model Configuration")
    endpoints = list_endpoints()
    ui_deployment_name = st.sidebar.selectbox("Deployment Name", list(MODEL_DICT.keys()))
    azure_deployment_name = MODEL_DEPLOYMENT_NAME_MAPPING[ui_deployment_name]

    selected_model = MODEL_DICT[ui_deployment_name]
    model_name = st.sidebar.selectbox("Model Name", selected_model)
    use_case_options = [key for key, value in endpoints.items() if value["ui_deployment_name"] == ui_deployment_name]   
    selected_use_case = st.sidebar.selectbox("Select Use Case", use_case_options)

    if selected_use_case:
        # This section in sidebar will help in Chat with Document.
        config = endpoints[selected_use_case]
        # Removing the uucc code to display it in the front-end.
        config = {k: v for k, v in config.items() if k != 'uucc'}
        try:
            # Display the FILE UPLOAD option only when the {context} is present in the prompt & Perform Building Index.
            if "{context}" in config["prompt"]:
                uploaded_file = st.file_uploader("Choose a file",  help="Optional")
                # If user uploaded NO FILE.
                if uploaded_file is None:
                    pass
                # If user uploaded A FILE.
                else:
                    upload_file_to_build_index(uploaded_file)
            # Don't Display FILE OPTION and DONT Build Indexes.
            else:
                uploaded_file = None
        except KeyError as err:
            uploaded_file = None

        with st.expander(label=f"**Testing Use Case: {selected_use_case}**"):
            st.write(f"Configuration: {config}")

        user_query = st.text_area("Ask Query")
    
        if st.button("Generate Response"):
            if user_query:
                with st.spinner("Thinking..."):
                    llm_answer = test_use_case(selected_use_case, config, user_query, uploaded_file)
                    with st.expander(label="Model Response"):
                        st.write(llm_answer, unsafe_allow_html=True)
            else:
                st.warning("Please enter a prompt.")
```

## 5\. Compare Use Cases

**Evaluate Outputs Side\-by\-Side**

Wondering which configuration delivers the best results? The *Compare Use Cases* feature lets you compare outputs from different setups, making it easier to select the most effective one.

💡 *Why It’s Cool*:

* Facilitates A/B testing without extra effort.
* Compare responses generated by the AI model for same queries, this will allow you to judge and finalize the prompts.
* Encourages data\-driven decisions for project optimization.


### UI Screenshots for Compare Use Cases Screen: Non\-context Based Usecases

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*9vUNoXUxoCrYYa9KfbQFKQ.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*w6UEPwl-zSpWQkpHlMWH_A.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*JESPGQxeSKRh56CDQtJ5ww.png)


### UI Screenshots for Compare Use Cases Screen: Context Based Usecases (RAG Based)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*sLnqq-RTrYatwozdnpZxvQ.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*I0ib5DIHX3U_ZN_KNC3lWQ.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*PcoaH5AwT1IOuSzCpviUEA.png)


### Python Code


```python
def compare_use_cases():
    st.title("Compare Use Case Responses")
    # Get all available use cases
    use_cases = load_use_cases() # This function should return a list of use case names
    ucases_category = {
        "Context Based":[],
        "Non-Context Based": []
    }
    for usecase, configuration in use_cases.items():
        if "{context}" in configuration["prompt"]:
            ucases_category["Context Based"].append(usecase)
        else:
            ucases_category["Non-Context Based"].append(usecase)

    ucase_type = st.selectbox("Select Use Case Type", list(ucases_category.keys()))
    if ucase_type == "Context Based":
        use_cases_list = list(ucases_category["Context Based"])
        # Display the FILE UPLOAD option only when the {context} is present in the prompt & Perform Building Index.
        uploaded_file = st.file_uploader("Choose a file",  help="Optional")
        # If user uploaded NO FILE.
        if uploaded_file is None:
            pass
        # If user uploaded A FILE.
        else:
            upload_file_to_build_index(uploaded_file)
    else:
        use_cases_list = list(ucases_category["Non-Context Based"])
        uploaded_file = None

    # Multi-select for use cases
    selected_use_cases = st.multiselect(
        "Select use cases to compare",
        options=use_cases_list,
        default=use_cases_list[:2] if len(use_cases_list) >= 2 else use_cases_list
    )

    # Input for the test question
    question = st.text_area("Enter your question:")

    if st.button("Compare Responses"):
        if not question:
            st.warning("Please enter a question.")
            return
        if not selected_use_cases:
            st.warning("Please select at least one use case.")
            return

        # Collect responses
        responses = {}
        for use_case in selected_use_cases:
            config = use_cases[use_case]
            with st.spinner(f"Getting response for {use_case}..."):
                response = test_use_case(use_case, config, question, uploaded_file)
                responses[use_case] = response

        # Display responses
        st.subheader("Responses:")
        for use_case, response in responses.items():
            with st.expander(f"{use_case} Response"):
                st.write(response)

        # Create a comparison table
        comparison_data = []
        for use_case, response in responses.items():
            comparison_data.append({
                "Use Case": use_case,
                "Response Length": len(response),
                "Word Count": len(response.split()),
                # Add more metrics as needed
            })

        df = pd.DataFrame(comparison_data)
        st.subheader("Comparison Metrics:")
        st.dataframe(df, hide_index=True, height=100, width=60000)

        # Visualize comparison
        fig = px.bar(df, x="Use Case", y="Word Count", title="Response Word Count Comparison")
        st.plotly_chart(fig)
```

## 6\. Analytics Dashboard

**Monitor and Optimize Performance**

Understanding how your AI is performing is critical. The *Analytics Dashboard* provides insights into token usage, response times, and cost trends. Use this data to optimize configurations and reduce expenses.

💡 *Why It’s Cool*:

* Get insights into the **average tokens per call** and **cost per call**, helping you optimize workflows effectively.
* Enables a granular view of resource consumption for specific use cases.
* Helps understand the distribution of resources and adjust prompts for better efficiency.
* Enables targeted analysis for specific scenarios, enhancing decision\-making.
* Empowers you to track ROI on AI workflows and usage.
* Identifies bottlenecks and optimization opportunities.


### UI Screenshots for Analytics Dashboard Screen

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*_xAxUfcpNrSM75yW38GEHA.png)

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*_40nxawf8YMefyyCG-QKXw.png)


### Python Code


```python
def analytics_dashboard():
    st.title("APIs Analytics Dashboard")
    # Load use cases
    use_cases = load_use_cases()
    # Sidebar for use case selection and date range
    st.sidebar.header("Configuration")
    ui_deployment_name = st.sidebar.selectbox("Deployment Name", list(MODEL_DICT.keys()))
    azure_deployment_name = MODEL_DEPLOYMENT_NAME_MAPPING[ui_deployment_name]
    selected_model = MODEL_DICT[ui_deployment_name]
    model_name = st.sidebar.selectbox("selected_model", selected_model)
    listed_usecases = []
    for k, v in use_cases.items():
        if model_name == v["model_name"]:
            listed_usecases.append(k)

    selected_use_case = st.sidebar.selectbox("Select Use Case", list(listed_usecases))
    
    if selected_use_case:
    # Date range selection
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=30)
        start_date = st.sidebar.date_input("Start Date", start_date)
        end_date = st.sidebar.date_input("End Date", end_date)
        if start_date > end_date:
            st.error("Error: End date must be after start date.")
            return

    # Fetch data for the selected use case
    config = {"model_name": "example_model"}  # You might want to store this in a separate config file
    data = get_use_case_data(selected_use_case, config, start_date, end_date)

    if not data:
        st.write("No Data Found for the selected usecase.")
    else:
        # Display overall metrics
        st.header("Overall Metrics")
        col1, col2, col3 = st.columns(3)
        col1.metric("Total API Calls", format_number(data['total_calls']))
        col2.metric("Total Tokens", format_number(data['total_tokens']))
        col3.metric("Total Cost", f"${format_number(data['total_cost'])}")

        col1, col2 = st.columns(2)
        col1.metric("Avg Tokens per Call", format_number(data['avg_tokens_per_call']))
        col2.metric("Avg Cost per Call", f"${format_number(data['avg_cost_per_call'])}")

        # Display daily usage chart
        st.header("Daily Usage")
        daily_df = pd.DataFrame(data['daily_usage'])
        daily_df['date'] = pd.to_datetime(daily_df['date'])
        
        fig = create_daily_usage_chart(daily_df)
        st.plotly_chart(fig, use_container_width=True)

        # Add summary statistics
        st.subheader("Summary Statistics")
        col1, col2, col3 = st.columns(3)
        col1.metric("Avg. Daily API Calls", f"{daily_df['id'].mean():.2f}")
        col2.metric("Avg. Daily Tokens", f"{daily_df['total_tokens'].mean():.2f}")
        col3.metric("Avg. Daily Cost", f"${daily_df['total_cost'].mean():.2f}")

        # Add data table
        st.subheader("Daily Usage Data")
        st.dataframe(daily_df.style.format({
            'id': '{:.0f}',
            'total_tokens': '{:.0f}',
            'total_cost': '${:.2f}'
        }),hide_index=True,  height=250, width=60000)

        # Display token distribution
        st.header("Token Distribution")
        token_dist = pd.DataFrame({
            'Type': ['Prompt Tokens', 'Completion Tokens'],
            'Tokens': [data['total_prompt_tokens'], data['total_completion_tokens']]
        })
        fig_tokens = px.pie(token_dist, values='Tokens', names='Type', title='Token Distribution')
        st.plotly_chart(fig_tokens, use_container_width=True)

        # Export data option
        if st.button("Export Data"):
            export_data = pd.DataFrame(data['daily_usage'])
            csv = export_data.to_csv(index=False)
            st.download_button(
                label="Download CSV",
                data=csv,
                file_name=f"{selected_use_case}_analytics.csv",
                mime="text/csv",
            )
```

## Code Folder Structure

***I’ll unlock and share the complete code files and the GitHub with everyone, once we reach 2K claps and 50\+ comments for this article. So make sure to Follow, Clap 👏 and Subscribe!***

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*OmlAEqS2elaouljLT2j-lQ.png)


## What We’ve Learnt so far with Gen AI Studio


### 1\. Configuring AI Models with Ease

Gen AI Studio provides a user\-friendly interface that guides you through the process of creating, updating, and managing your own use cases. You’ll learn how to tailor the OpenAI models to your specific needs, unlocking their full potential for your projects.


### 2\. Experimenting and Testing

The ***Test Use Case*** feature empowers you to evaluate the responses of your configured models to custom prompts. This hands\-on approach allows you to dive deep into the nuances of the AI algorithms, uncovering their strengths, limitations, and potential areas for improvement.


### 3\. Comparative Analysis

With the ***Compare Use Cases*** functionality, you’ll gain valuable insights into the subtle differences between various OpenAI models. By analyzing the outputs generated for multiple use cases, you’ll develop a keener understanding of model suitability and the factors that influence their performance.


### 4\. Cost and Usage Insights

The ***Analytics Dashboard*** equips you with a comprehensive view of the cost and usage metrics associated with your API calls. This knowledge will enable you to make informed decisions about the scalability and viability of your AI\-powered initiatives, ensuring efficient resource allocation.


### 5\. Exploring AI Frontiers

Beyond the practical skills, Gen AI Studio fosters an environment of creativity and innovation. As you delve into the world of OpenAI models, you’ll be inspired to push the boundaries of what’s possible, unlocking new avenues for exploration and discovery.


### 6\. Most Importantly: Deployment and building APIs

While Gen AI Studio is primarily focused on education and learning, it does provide a pathway for users to translate their experiments into production\-ready solutions. The application generates API endpoints for each configured use case, allowing users to seamlessly integrate the generated models into their own applications and services.

By leveraging these API endpoints, users can build robust, scalable, and secure applications that harness the power of OpenAI models. The API integration process is streamlined, enabling developers to rapidly deploy their AI\-powered features and solutions.


## Why Should You Try It?

Gen AI Studio doesn’t just simplify AI — it empowers you to think creatively about AI’s potential applications. Whether you’re prototyping, testing, or scaling solutions.

As we delve into the future of artificial intelligence, tools like Gen AI Studio will undoubtedly play a pivotal role in democratizing access to advanced AI capabilities. By fostering an environment of exploration and learning, this application empowers users to push the boundaries of what’s possible, unlocking new avenues for innovation and discovery.

So, whether you’re a seasoned AI professional or a curious beginner, Gen AI Studio invites you to embark on a captivating journey of discovery. Unleash your creativity, experiment with the power of OpenAI models, and unlock the limitless possibilities that lie ahead.

*If you enjoyed reading, be sure to give it 50 CLAPS! 👏 Your finger clicks matter more than you think.*

20 people clapping once? That’s 20 claps.

20 people clapping 50 times? That’s 1000!

Let’s make it happen! 👏

***FOLLOW*** *and don’t miss out on any of my future posts\- **subscribe** to my profile for mus\-read blog posts in future!*

***Thanks for reading!***

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*m9yt4jqcQCtL8FDF.png)

This story is published on [Generative AI](https://generativeai.pub/). Connect with us on [LinkedIn](https://www.linkedin.com/company/generative-ai-publication) and follow [Zeniteq](https://www.zeniteq.com/) to stay in the loop with the latest AI stories.

Subscribe to our [newsletter](https://www.generativeaipub.com/) and [YouTube](https://www.youtube.com/@generativeaipub) channel to stay updated with the latest news and updates on generative AI. Let’s shape the future of AI together!

![](https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/0*HoYGZXAZcXyISS5v.png)


