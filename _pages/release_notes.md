---
layout: article
title:  "Release Notes"
excerpt: "Find out what's changed in recent versions of Algorithmia."
tags: [alg-dev-getting-started, app-dev-getting-started]
show_related: true
image:
    teaser: /icons/algo.svg
---

# Algorithmia Enterprise Release Notes 19.05 # 

<img src="{{site.baseurl}}/images/post_images/release_notes/1904_Release_Notes_Updates_List.png" alt="1904 Release Notes Banner" class="screenshot">

### Jupyter Notebook Integration ###

Data scientists can now [deploy to the AI Layer directly from a Jupyter Notebook](https://github.com/algorithmiaio/model-deployment/blob/master/tensorflow_classify_text_deploy_algorithmia/tensorflow_classify_text_deploy_algorithmia.ipynb) completing the entire data science life cycle—model training, visualization, and deployment—without ever leaving their Notebook. 

Our updated APIs enable easier integrations like this and [Zapier](https://algorithmia.com/developers/integrations/zapier) (from the last release), and we will be offering more endpoints moving forward. Please don’t hesitate to suggest tools you’d like to integrate.

<iframe width="560" height="315" src="https://www.youtube.com/embed/oSOlbenfFaI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> 
-----
  
<img src="{{site.baseurl}}/images/post_images/release_notes/1904_Release_Notes_Deploy.png" alt="Release Notes" class="screenshot">

### Event-Driven Algorithm Runs ###

Event listeners allow external services to trigger actions such as model runs within the AI Layer. The first of our supported event sources is **Amazon SQS**, with a [tutorial available](https://algorithmia.com/developers/integrations/event_listeners) in our Developer Center. 

### Additional Management APIs ###
New APIs allow you to create, recompile, and publish models directly from CI/CD pipelines, without using the Web API.

<img src="{{site.baseurl}}/images/post_images/release_notes/1904_Release_Notes_Create_Algorithm.png" alt="Release Notes" class="screenshot">




<img src="{{site.baseurl}}/images/post_images/release_notes/1904_Release_Notes_Publish_Algorithm.png" alt="Release Notes" class="screenshot">

### Additional IPA Package Sets ###

As introduced in the 19.01 release, We now enable more flexible instances and support new machine learning frameworks with many different combinations. New package sets execute faster and support a wider range of developer choices. 

Our shift towards package sets allows the platform to iterate faster and increases the performance of algorithm runtimes.
This allows the Algorithmia cluster to target package sets toward tailored scenarios. 

We’re delivering a continuous stream of new sets, so check back for the latest versions often. 

### Organization-Hosted Data ###

A new data-browsing UX makes it even easier to browse and share data and models within your organization.

Organizations allow teams of customers to work in a private subset of models, moderate model publishing, and organize models into logical groups based on teams. This feature makes an organization more powerful by coupling the algorithms with the data necessary for models.



<img src="{{site.baseurl}}/images/post_images/release_notes/1904_Release_Notes_Left_Nav_Bar.png" alt="Release Notes" class="screenshot">



To view your hosted data, click on Data Sources in the main toolbar, then select an organiation. From here, browse the organization's collections as you would your own data collections.

<img src="{{site.baseurl}}/images/post_images/release_notes/1904_Release_Notes_Data_Portal.png" alt="Release Notes" class="screenshot">


Organization data collections have the same permissions as user data collections, including:

`Private Read`: Only members of the organization may access the data, either directly or via an algorithm.

`My Algorithms Read`: Any caller may access the data of organization-owned algorithms, but only organization members may directly view the data.

`Public Read`: Anyone may interact with the data.

`Private Write`: Only members of the organization may write to the collection. This is the only available write setting.
 
### Enterprise UI Customization ###

Enterprise customers now have the ability to tailor the UI of their AI Layer instances to their corporate brands. 

What can now be customized:
* Brand Color
* Logo
* Favicon
* Navigation Title (Title that appears in browser tab)
* Header Title (Title that appears beneath logo)
* Title Of Sidenav Buttons

---- 

For questions and requests, please contact Algorithmia at support@algorithmia.com.  
-----


<img src="{{site.baseurl}}/images/post_images/release_notes/release_notes_header_image.png" alt="Release Notes" class="screenshot">

{% if site.enterprise %}
**Enterprise Users:** Check with your administrator to verify which version of Algorithmia you are running.
{: .notice-info}
{% endif %}


Algorithmia is moving into the new year with a lot of great improvements to the platform. We are always looking to increase performance in production model serving and infrastructure efficiency in every release while making the day-to-day developer and data scientist experience even more seamless.

Projects for this release focused on providing greater flexibility and data connectivity options and enabling queuing for user calls. These updates are part of our dedication to continuously improve our platform for our users. We've made a number of changes under the hood that will provide tangible boosts to speed, flexibility, and supportability.

<img src="{{site.baseurl}}/images/post_images/release_notes/19.01_release_notes_update_list.png" alt="Release Notes Product Updates" class="screenshot">

### Image Per Algorithm ###
 
We are really happy to announce the release of a major evolution to the architecture of how algorithm containers are created and loaded when requested on the Algorithmia platform. 
We now enable more flexible instances and support new machine learning frameworks with many different combinations. 

New framework releases will be quickly added to allow data scientists and developers to take advantage of the latest technologies available to them.

Image Per Algorithm changes how algorithm version container images are created and shifts the creation of containers to when the algorithm changes instead of when a request comes in for the algorithm and a slot needs to be loaded. This shift towards package sets enables the platform to iterate faster and support emerging technology, and it increases the performance of algorithm runtimes. 

This allows the Algorithmia cluster to target package sets toward tailored scenarios, like running a specific version of Tensorflow with Python 3.7. There is a package set available that is pre-configured for that scenario that will work in GPU and CPU environments.

The Algorithmia team will be creating new package sets in future releases and over time will transition all class algorithm base templates to new Image Per Algorithm-based package sets. 

<img src="{{site.baseurl}}/images/post_images/release_notes/19.01_create_algo_ipa.png" alt="Release Notes IPA" class="screenshot">

New package sets will be released to the Hosted Service on Algorithmia first and then rolled up together in future quarterly releases for Algorithmia Enterprise. 

If you are interested in any package sets that have been released to the Hosted Service, please let your **Deployment Architect** know to work on getting it imported before your next upgrade.

### Initial Package Sets for This Release ###

This release includes the following package sets that can be used for newly created algorithms going forward. New package sets will be created and shipped to the Algorithmia Hosted Service and bundled into future releases of Algorithmia Enterprise.

<img src="{{site.baseurl}}/images/post_images/release_notes/19.01_CPU_GPU_table.png" alt="Release Notes CPU, GPU python table" class="screenshot">

We will enable Enterprise Admins to create custom package sets to help provide best practices and templates for their data science teams specific to their organization.

### Algorithm Management APIs ###

Building on the previous release, we are expanding the available set of **Management APIs** that developers and system administrators can use to interact with the Algorithmia platform through automation. The main scenarios we heard customers want to automate with these newly available APIs are to enable continuous integration and continuous delivery pipelines.

We’re happy to say that the last two steps in an automated pipeline are no longer exclusive to the Algorithmia UI.

The additional APIs that have been added in this release are:

* **Create** algorithm
* **Get** algorithm information
* **Update** algorithm
* **Publish** algorithm

<img src="{{site.baseurl}}/images/post_images/release_notes/19.01_release_notes_algorithm_actions.png" alt="Release Notes algorithmia management APIs" class="screenshot">

These algorithm APIs do not require management API keys to use. Non-administrator users of an Algorithmia platform will be able to use their [simple API keys](https://algorithmia.com/developers/basics/customizing-api-keys) to interact with algorithms they have permissions to work with. The use of Management API keys will not be supported 
by these algorithm APIs.

You can find the details for each of these APIs available in the [OpenAPI spec.](https://algorithmia.com/v1/openapispec)

The OpenAPI spec allows developers to generate language-specific clients through code generators, test APIs, interact with APIs more easily. It can even generate a [Postman collection](https://algorithmia.com/algorithms/OpenAPI/openapi2postman) that can be imported into your [Postman](https://documenter.getpostman.com/view/6515899/Rztiuqao) workspace. You can find many of these tools on the [OpenAPI website.](https://openapi.tools/) 

### Update Algorithm Settings ###

Administrators and data scientists asked for a way to be able to update an algorithm’s settings without going through a full publish. For example, many users wanted to update their algorithm’s network access permissions or change the source code visibility after creating it. 

Each of these settings and more is now available on the Manage tab of each algorithm. Most of the settings will apply immediately so data scientists can test private, unpublished versions.

However, to make settings changes available to developers consuming your algorithm, you’ll need to go through a full publish.

The two immediate settings that don’t require a publish are Source Visibility and License:

<img src="{{site.baseurl}}/images/post_images/release_notes/19.01_algo_settings.png" alt="Release Notes algorithm settings" class="screenshot">

### How to Update Algorithm Settings ###

<img src="{{site.baseurl}}/images/post_images/release_notes/19.01_how_to_update_settings.png" alt="Release Notes how to update algorithm settings" class="screenshot"> 

During the publishing process, we’ll detect which settings will be changed for the next published version and inform the publisher the type of Semantic Versioning increase that will be required.  

Note: All previous versions of a published algorithm are immutable and unable to be changed in order to help developers who are already using a specific version in their production apps.

### New Data Storage Connectors ###

This release includes two new data storage connectors to allow data scientists and 
developers to leverage additional input and output locations for algorithms. 

The [data connector system](https://algorithmia.com/developers/data) allows an Algorithmia instance to securely handle brokering connections between an algorithm and a data source provided by the developers without needing to provide connection credentials. 

Additionally, since it’s a single data API for the algorithm developer, access to an underlying data source is abstracted, allowing for algorithm developers to support many types of data sources without needing to implement provider-specific logic.

The two data connectors that are included in this release are:

* [Azure Blob storage](https://algorithmia.com/developers/data/azureblob)
* [Google Cloud storage](https://algorithmia.com/developers/data/googlecloudstorage)

To find out more information about the Data API available in each Algorithmia instance, including 
the [Hosted Data Service,](https://algorithmia.com/developers/data/hosted) you can visit the [overview topic](https://algorithmia.com/developers/data) in the Developer Center. 

<img src="{{site.baseurl}}/images/post_images/release_notes/19.01_data_portal_guides.png" alt="Release Notes how to update algorithm settings" class="screenshot"> 

### Algorithmia .NET SDK Supports .NET Core and .NET Standard ###
Customers have been adopting and transitioning to .NET Core and have been asking us to transition from only supporting the .NET framework. We’re happy to now include support for the Algorithmia .NET Client in all of the frameworks supported by **.NET Standard 2.0, which includes .NET Core.** This means that many more application types can run across Windows, Linux, MacOS, and mobile, and other devices will be able to directly make calls to algorithms.

Supporting .NET Standard 2.0 provides support for the following frameworks:

* .NET Core
* ASP.NET Core
* .NET Framework (>4.6.1)
* Mono
* Xamarin.iOS
* Xamarin.Mac
* Xamarin.Android
* Universal Windows Platform Apps
* Unity 

All of the Algorithmia Clients are open-sourced on GitHub. You can follow the .NET Client on the [GitHub website.](https://github.com/algorithmiaio/algorithmia-c-sharp)

To get going, you can install the updated NuGet package for the Algorithmia .NET Client and follow the [walkthrough](https://algorithmia.com/developers/clients/c_sharp_net) available in the Developer Center. 

`Install-Package Algorithmia.Client`

### Flexibility to Enable User Work Limits and Queuing ###

Administrators need the flexibility to tune an algorithm’s usage of infrastructure while still running in production. Algorithmia has had the ability to provide “sticky slots” as one such flexibility example. This release introduces a new flexibility option to specify work limits for a particular user running production workloads.

This option will set limits to accept calls from a user but will begin **queueing** requests that are above the maximum active jobs limit until the maximum concurrent sessions are reached. The setting is available on the Advanced options page of the Admin Panel by clicking the **“Update User’s Work Limits”** button.

Administrators now have the flexibility to manage an algorithm’s use of their cluster. In one Algorithmia cluster, administrators were able to see a 30-percent decrease in monthly infrastructure costs by being able to finely tune production algorithms.

### How to Update a User’s Work Limits ###

<img src="{{site.baseurl}}/images/post_images/release_notes/19.01_update_work_limits.png" alt="Release Notes set work limits" class="screenshot">

***User to Update:*** Enter the username of the user you want to limit. 
***Max Concurrent Sessions:*** Input a max number of concurrent requests a user can make at one time to ensure resources are not being over allocated.
***Max Active Jobs:*** Insert a max number of active jobs a user can have before requests begin queueing to ensure other users have resources available to them.

<img src="{{site.baseurl}}/images/post_images/release_notes/19.01_update_max_work_limits.png" alt="Release Notes max work limits" class="screenshot">

<img src="{{site.baseurl}}/images/post_images/release_notes/19.01_contact_us.png" alt="Release Notes contact us" class="screenshot">

