---
layout: article
title: "Event Listeners via Azure SB"
excerpt-short: "Set up an Event Listener to run an Algorithm with inputs from an Azure Service Bus Queue"
categories: [integrations]
tags: [integrations]
show_related: true
---

These directions will help you to set up an Algorithmia Event Listener, which will run an algorithm with input payloads provided in an Azure Service Bus Queue

This is only available for Enterprise installations of Algorithmia. 
{: .notice-warning}

## 1. Obtain a template file and account info from Algorithmia

Contact [support@algorithmia.com](mailto:support@algorithmia.com) to obtain the following, which you will need during CloudFormation setup:

* Azure Resource Manager template for Service Bus Namespace and Queue
* Custom Role definition file - QueueReceiver
* Algorithmia Azure Account

## 2. Invite Algorithmia account as guest account in your account’s Active Directory

Using the Custom Role definition file you have gotten in step 1, create the Custom Role in your account. 

* Authenticate with Azure CLI
* Run “$ az role definition create --role-definition GuestRole.json”

More details on how to do this with Azure Cli can be found here: https://docs.microsoft.com/en-us/azure/role-based-access-control/custom-roles-cli
It can be also done via PowerShell and REST api.


## 3. Invite Algorithmia account as guest account in your account’s Active Directory
Create a new guest user account with Algorithmia’s account email.

* Sign in to the Azure portal as an Azure AD administrator.
* In the left pane, select Azure Active Directory.
<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_20.png">
* Select New guest user.
* On the New user page, select Invite user and then add the guest user's information.
* * Name. The first and last name of the guest user.
* * Email address. Use the email obtained in step 1 
* * Groups: You can add the guest user to one or more existing groups, or you can do it later.
* * Directory role: Use the role you created in step 2 (QueueReceiver)
<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_21.png">
* * Select Invite to automatically send the invitation to the guest user. A notification appears in the upper right with the message Successfully invited user. The user account is now added to the directory as a guest account with the custom role.

## 4. Create Service Bus Namespace and Queue 

* Import ARM template and create your Service Bus Namespace and Queue.
* Create a new Template, and load the contents of the ARM template file from step 1 into the ARM template tab. Save the template and click “Deploy Template”
* Fill in the Namespace Name, Queue Name, and choose region appropriate for you. 

Note: If the deployment fails, chances are there is already a namespace created with that name in the region you chose. If that is the error message you get on deployment error, you would need to redeploy with a different name until it works.

## 5. Test Event Listener

* Create a new Python 3.X Algorithm.
<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_22.png">

* In web IDE replace source with the following:

{% highlight python %}
import Algorithmia

def apply(input):
    Algorithmia.client().file("data://<username>/event_output_directory/" + input.get("filename")).put(input.get("data"))

{% endhighlight %}
<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_23.png">
* Click Save, then Build, then Publish buttons. On the algorithm page cope the full “path” of the algorithm.
* Create Hosted Data directory “event_output_directory”
<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_24.png">
* Create event listener -> Azure, algorithm name, algorithm version
<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_25.png">
* To test event listener, create a new Python 3.x algorithm just like before, and replace source code with the following:

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
<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_26.png">
* Run the algorithm that would send messages
* Check the event_output_directory, it should have a file with filename “test”
<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_27.png">
* Download the file, it should contain text “test-data”, your event listener is working now!
<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_18.png">
