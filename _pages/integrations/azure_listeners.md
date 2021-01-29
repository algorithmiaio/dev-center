---
layout: article
title: "Azure SB Event Listeners"
excerpt-short: "Set up an Event Listener to run an Algorithm with inputs from an Azure Service Bus Queue"
categories: [integrations]
tags: [integrations]
show_related: true
---

These directions will help you to set up an Algorithmia Event Listener, which will run an algorithm with input payloads provided in an Azure Service Bus Queue. 
[Read More about Azure Service Bus](https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-dotnet-get-started-with-queues)

This is only available for Enterprise installations of Algorithmia. 
{: .notice-enterprise}

## 1. Obtain a template file and account info from Algorithmia

Contact [support@algorithmia.com](mailto:support@algorithmia.com) to obtain the following, which you will need during CloudFormation setup:

* Azure Resource Manager(ARM) template for Service Bus Namespace and Queue
* Custom Role definition file - QueueReceiver
* Algorithmia Azure Account

## 2. Invite Algorithmia account as guest account in your account’s Active Directory

Using the Custom Role definition file you received in step 1, create the Custom Role in your account. 

* Authenticate with Azure CLI
* Run `$ az role definition create --role-definition GuestRole.json`

For more info on how to do this with Azure CLI <a href="https://docs.microsoft.com/en-us/azure/role-based-access-control/custom-roles-cli" target="_blank" rel="noopener noreferrer">visit the Azure Docs</a>
It can be also done via PowerShell and REST API.


## 3. Invite Algorithmia account as guest account in your account’s Active Directory
Create a new guest user account with Algorithmia’s account email.

* Sign in to the Azure portal as an Azure AD administrator.
* In the left pane, select Azure Active Directory.
<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_33.png">
* Select New guest user.
* On the New user page, select Invite user and then add the guest user's information.
  * Name. The first and last name of the guest user.
  * Email address. Use the email obtained in step 1 
  * Groups: You can add the guest user to one or more existing groups, or you can do it later.
  * Directory role: Use the role you created in step 2 (QueueReceiver)
<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_34.png">
  * Select Invite to automatically send the invitation to the guest user. A notification appears in the upper right with the message Successfully invited user. The user account is now added to the directory as a guest account with the custom role.

## 4. Create Service Bus Namespace and Queue 

* Import ARM template and create your Service Bus Namespace and Queue.
<a href="https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/overview" target="_blank" rel="noopener noreferrer">Info about ARM templates</a>
<a href="https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-quickstart-portal#:~:text=In%20the%20left%20navigation%20pane,if%20the%20name%20is%20available" target="_blank" rel="noopener noreferrer">Info about Service Bus</a>
* Create a new Template, and load the contents of the ARM template file from step 1 into the ARM template tab. Save the template and click “Deploy Template”.
* Fill in the Namespace Name, Queue Name, and choose region appropriate for you. 

Note: If the deployment fails, chances are there is already a namespace created with that name in the region you chose. If that is the error message you get on deployment error, you would need to redeploy with a different name until it works.

## 5. Test Event Listener

* Create a new Python 3.x Algorithm.
<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_35.png">

* In the web IDE replace the source with the following:

{% highlight python %}
import Algorithmia

def apply(input):
    Algorithmia.client().file("data://<username>/event_output_directory/" + input.get("filename")).put(input.get("data"))

{% endhighlight %}
<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_36.png">
* Click Save, then Build, then Publish buttons. On the algorithm page copy the full “path” of the algorithm.
* Create Hosted Data directory “event_output_directory”
<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_37.png">
* Create event listener -> Azure, algorithm name, algorithm version
<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_38.png">
* To test event listener, create a new Python 3.x algorithm just like before, and replace the source code with the following:

{% highlight python %}
import Algorithmia
from azure.servicebus import QueueClient, Message

def apply(input):
    # Create the QueueClient
    queue_client = QueueClient.from_connection_string("<Connection String>", "<Queue Name>")

    # Send a test message to the queue
    msg = Message(b'{"filename":"test","data":"test-data"}')
    queue_client.send(msg)    

{% endhighlight %}

* Add these dependencies to the created algorithm:

{% highlight python %}
azure-common==1.1.25   
azure-servicebus==0.50.2
{% endhighlight %}
<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_39.png">
* Run the algorithm that would send messages
* Check the event_output_directory for a file with filename “test”
<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_40.png">
* Download the file, it should contain text “test-data”, your event listener is working now!
<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_41.png">
