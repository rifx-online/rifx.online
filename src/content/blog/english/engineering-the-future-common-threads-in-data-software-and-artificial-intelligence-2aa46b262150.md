---
title: "Engineering the Future: Common Threads in Data, Software, and Artificial Intelligence"
meta_title: "Engineering the Future: Common Threads in Data, Software, and Artificial Intelligence"
description: "The article discusses the need for a shift from siloed specialization in IT disciplines—data engineering, software development, and AI/ML—toward a more integrated and collaborative approach. It emphasizes common principles such as modularity, version control, real-time processing, and abstraction to facilitate seamless data exchange and system integration. By fostering a unified engineering mindset, organizations can enhance recruitment strategies and improve adaptability in IT architectures, ultimately leading to greater innovation and efficiency. The call for interdisciplinary collaboration mirrors recent trends in healthcare, advocating for holistic thinking in engineering practices."
date: 2024-12-26T04:30:18Z
image: "https://wsrv.nl/?url=https://cdn-images-1.readmedium.com/v2/resize:fit:800/1*wJurAMzy5rcdibdSdeD7gg.png"
categories: ["Programming", "Data Science", "Technology/Web"]
author: "Rifx.Online"
tags: ["modularity", "version-control", "real-time", "abstraction", "collaboration"]
draft: False

---





### How recognizing cross\-discipline commonalities not only enhances recruitment strategies but also supports adaptable IT architectures.



I’ve noticed an ongoing trend toward over\-specialization in IT departments. However, one of my key lessons learned over the years is the [negative impact of this siloed specialization](https://readmedium.com/data-architecture-lessons-learned-3589b152a8a6).

While it’s primarily an organizational issue, the trend towards the mindless embrace of specialized platform offerings from vendors has also [led to significant overlap of functions in our enterprise architectures](https://readmedium.com/avoid-building-a-data-platform-in-2024-56f0ee95da42).

If your business is the provision of specialized IT solution platforms, you can of course benefit from razor\-sharp specialization.

For all other businesses, I think this needs to be corrected.


## The shift from silos to better collaboration

Traditional software application engineering, data engineering and artificial intelligence / machine learning (AI/ML) form large silos today.

While the different IT tasks were assumed to be largely distinct and the objectives different, the business actually demands seamless data exchange and integration between applications and AI/ML models.

We need to shift from isolated tasks to integrated systems.

Engineers in each domain are actually dependent on many shared practices, requiring a common language and methodology. Data pipelines must now support real\-time model inference; application software must handle data streams dynamically; and AI/ML models must fit seamlessly into live applications.

These cross\-domain interactions should redefine the siloed role of engineers in each area, making it clear that we must think beyond the boundaries of traditional disciplines.

While I worked for the healthcare industry, I observed the same problem of over\-specialization. Doctors also have a one\-sided focus on specific organs or systems (e.g., cardiologists, neurologists). This over\-spezialization, while advancing treatments for certain conditions, often lead to a fragmented approach that can overlook the holistic health of patients. This can make it really difficult to get good, comprehensive advice.

However, there has indeed been a major shift in healthcare in recent years: away from silo thinking towards a more integrated, holistic approach. This trend emphasizes interdisciplinary collaboration, combining knowledge from different specialties to improve patient outcomes.

We urgently need the same rethinking in IT engineering.


## Common threads: Principles bridging the disciplines

As I look back, there are a few key principles that stand out as essential, whether you’re a data engineer, a software developer, or an AI/ML practitioner.

Obvious commonalities are programming proficiency, algorithmic thinking and problem solving as well as proper handling of data structures. These principles create a common foundation that all engineers should have.

Let’s look at some more common threads.


### Modularity and Reusability

Modularity has been a cornerstone of software architecture for years.

In data engineering, this principle is equally critical. A well\-designed data pipeline must be modular to support reusable data transformations and easily adjustable components. While in application development we learned to think in (micro\-)services that contribute to a coherent overall system, we still lack the same proficiency in building data pipelines. Instead, I often hear the ill\-advised claim that [data engineering is not software engineering](https://medium.com/@bernd.wessely/data-engineering-is-software-engineering-a4c5df052492).

A look at the Google paper [“Hidden Technical Debt in Machine Learning Systems”](https://proceedings.neurips.cc/paper_files/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf) clearly shows that the model itself is only a small part of the overall AI/ML service that needs to be developed. The majority of the service requires software and data engineering know\-how to properly integrate it to the enterprise architecture. Feature engineering, for instance, is actually data engineering for AI/ML models and shares many commonalities with traditional ETL processing for data warehouses.

When all three disciplines strive for a modular architecture, it becomes easier to integrate the disparate systems and reuse components across the silos.


### Version Control and lifecycle management

In software development, version control is essential for managing changes, and this principle applies equally to data and AI/ML models. Data versioning ensures teams can track changes, maintain lineage, and guarantee reproducibility. Experiment tracking and lifecycle management for AI/ML models prevent updates from disrupting processes or introducing unexpected behavior in production.

A disciplined approach to version control in all areas ensures clean synchronization of systems, especially in our dynamic environments where data, code and models are constantly evolving. This need is reflected in the rise of “\*Ops” disciplines like DevOps, MLOps, and DataOps, which all aim to promote the rapid delivery of high\-quality software products.

However, these overlapping disciplines lead to unnecessary project management and workflow overhead. We maintain three separate, overspecialized versions of fundamentally similar processes. A unified approach that bridges these silos would significantly reduce complexity and improve efficiency.


### Real\-Time processing and responsiveness

With the increasing need for low latency processing, traditional batch systems are no longer sufficient. Today’s users expect instant information supply. This shift toward near real\-time responsiveness demands a new level of integration.

For data engineers, real\-time processing means rethinking traditional ETL pipelines, moving to more event\-driven architectures that push data as it’s created. Software engineers must design systems that can handle real\-time data streams, often integrating AI/ML inference to provide personalized or context\-aware responses. For AI/ML engineers, it’s about building models that operate with minimal latency.

Unfortunately, we are still too far away from [unifying batch and stream processing](https://readmedium.com/batch-and-streaming-demystified-for-unification-dee0b48f921d).


## The Power of abstraction enables cross\-functional systems

One of the most powerful tools to avoid overlapping functionality is abstraction.

Each domain has developed its own abstractions – e.g. UX principles like Model\-View\-Controller (MVC) or Backend for Frontend (BFF) in application development, ETL pipeline orchestration in data engineering, and layers in neural networks for ML.

By building systems on *common abstractions*, we create a language that can be understood across disciplines.

Consider how an abstraction like *data as a product* can serve as a shared language. For a data engineer, data as a product is a well\-defined dataset created by applications to be disclosed and transported to consumers. For an AI/ML practitioner, it’s a feature set prepared for model training. For a software engineer, it’s like an API endpoint delivering reliable data input for application functionality. By creating and consuming data as a product, each team speaks the same language and this promotes better understanding.

Operating systems (OS) are traditionally the basic infrastructure that provides such fundamental abstractions to work equally well for all specific applications. Before we create new, fundamental abstractions as specialized tools in a single discipline, we should think twice about whether it would not be better covered by an infrastructure component — for example as an OS extension.


## Embracing the feedback loop

As the boundaries between disciplines blur, the need for feedback loops becomes essential.

Data, software, and AI/ML systems are no longer static; they are continuously evolving, driven by feedback from users and insights from analytics. This further closes the gap between development and production, enabling systems to learn and adapt over time. The discipline that targets such feedback loops is commonly referred to as *observability*.

In data engineering, observability may mean monitoring data flow allowing ongoing collaboration to improve accuracy and reliability. For software engineers, it can be gathering real\-time application usage and user feedback to refine functionality and user experience. In ML, feedback loops are critical for retraining models based on new data distribution, ensuring predictions stay relevant and accurate.

A well\-designed feedback loop ensures that all systems are continuously optimized. These loops also enable cross\-functional learning, where insights from one domain feed directly into improvements in another, creating a virtuous cycle of enhancement and adaptation.


## Streamline your recruitment

The increasing specialization reflects a necessary evolution to address the growing complexity of modern systems.

While specialized disciplines can bring significant benefits, their highly overlapping parts lead to coordination and integration challenges. Organizations that succeed in harmonizing these crosscutting fields — through reliance on sound architecture principles, collaborative cultures, and unified strategies — will gain a competitive advantage.

You don’t need over\-specialized engineers for every single aspect of your enterprise architecture. We won’t succeed with only a few enterprise architects having enough experience to oversee cross\-discipline aspects. Powerful abstractions don’t emerge by living and thinking in silos. Engineers must be encouraged to think outside the box and understand the benefits of evolutional architectures at enterprise level.

All engineers need to follow sound enterprise architecture principles, not only the architects. Therefore, make sure you have a broad base of architecture know\-how among your IT engineers.

Don’t look for a highly specialized DevOps engineer knowing all the latest tools, look for an IT engineer who knows a lot about software engineering and understands how to get software to production quickly while maintaining the highest quality.


## Toward a unified engineering mindset

As we engineer the future, it’s clear that our success depends on bridging the separated disciplines where needed. Data engineers, software developers, and AI/ML practitioners must adopt a unified engineering mindset, embracing shared principles and practices to create systems that address the crosscutting requirements of business.

I strongly believe the future of engineering is a collaborative journey. By working within a shared framework – modularity, version control, near real\-time responsiveness, and abstraction – we lay the groundwork for integrated systems. The goal is not to erase the distinctions between fields, but to leverage their unique strengths to go beyond the limitations of any one discipline.

Success will belong to those who can cross boundaries, adopt cross\-functional principles, and think holistically about the systems they build. By engineering with these common threads, we not only improve the efficiency of each domain but also enable greater cross\-cutting innovation and agility. The future is interconnected, and the path to building it starts with embracing common principles in IT engineering.


