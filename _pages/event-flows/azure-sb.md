---
categories: event-flows
excerpt-short: "Set up algorithm Event Flows using an Azure Service Bus message broker"
image:
  teaser: /icons/azure-service-bus.png
layout: article
permalink: /event-flows/azure-sb/
redirect_from:
 - /integrations/azure_listeners/
 - /integrations/azure-sb/
show_related: true
tags: [integrations, event-flows]
title: "Azure Service Bus Message Broker"
---

This feature is only available in Enterprise installations of Algorithmia.
{: .notice-enterprise}

This guide will walk you through setting up Algorithmia Event Flows using an [Azure Service Bus (SB)](https://azure.microsoft.com/services/service-bus/) message broker. Once configured, you can create event-driven workflows in which your algorithms subscribe to an SB queue and are automatically invoked with the contents of messages published to the queue.

## SB Event Flow configuration overview

The process of configuring Event Flows with an SB message broker involves several steps, some of which are to be completed in the Azure Portal and some of which are to be completed in the Algorithmia browser user interface (UI). At a high level, the configuration steps are:

1. Gather required information from Algorithmia and define required parameters.
2. In the Azure Portal, create a group of resources (including an SB queue) using an  Azure Resource Manager (ARM) template or manually as the situation dictates.
3. In the Algorithmia browser UI, connect an algorithm to the SB queue to subscribe to messages published there.
4. Send messages to the SB queue to be consumed by the subscriber algorithm.

## 1. Gathering required information from Algorithmia

Contact [support@algorithmia.com](mailto:support@algorithmia.com) to obtain the following, which you'll need during the setup process:

* `GuestRole.json` (custom role definition file for QueueReceiver role)
* Algorithmia account email address (email address of Azure account running Algorithmia cluster)

## 2. Configuring resources in the Azure portal

**NOTE:** The steps in this section are to be completed within the <a href="https://portal.azure.com//" target="_blank" rel="noreferrer noopener">Azure Portal</a>.
{: .notice-info}

### Creating a custom role in your account

Using the custom role definition file `GuestRole.json` from [step 1](#1-gathering-required-information-from-algorithmia), create the custom role in your account by completing the following:

* Authenticate with the Azure CLI
* Run `$ az role definition create --role-definition GuestRole.json`

For more information on how to work with the Azure CLI to complete this step, <a href="https://docs.microsoft.com/en-us/azure/role-based-access-control/custom-roles-cli" target="_blank" rel="noopener noreferrer">visit the Azure Docs</a>. Note that this step can also be completed via PowerShell and REST API.

### Inviting the Algorithmia account as a guest account in your account’s Active Directory

Create a new guest user account with the Algorithmia account's email address.
* Sign in to the Azure portal as an Azure AD administrator.
* In the left-hand navigation panel, select **Azure Active Directory** (or search for the service in the search bar).
* In the left-hand navigation subpanel under **Manage**, select **Users**.
* Select **+ New guest user** from the options along the top.<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_33.png">
* On the **New user** page, select **Invite user** and then add the guest user's information as follows:
  * **Identity** &rarr; **Name**: first and last name of the guest user
  * **Identity** &rarr; **Email address**: email address obtained in [step 1](#1-gathering-required-information-from-algorithmia)
  * **Groups and roles** &rarr; **Groups**: add the guest user to one or more existing groups, or do it later
  * **Groups and roles** &rarr; **Roles**: select the QueueReceiver role you created in [step 2](#2-create-the-custom-role-in-your-account)<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_34.png">
  * Click **Invite** to automatically send the invitation to the guest user. A "Successfully invited user" notification will appear in the upper-right corner. The user account is now added to the directory as a guest account with the custom role.

### Creating a Service Bus namespace and queue using an ARM template

To begin using Azure SB, you must create a namespace with a name that's globally unique across Azure, and a queue to serve as a message broker. We provide the ARM template below to create these resources. For general information about Azure resource management, see <a href="https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/overview" target="_blank" rel="noopener noreferrer">What is Azure Resource Manager?</a> and <a href="https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/overview" target="_blank" rel="noopener noreferrer">What are ARM templates?</a>.

To use this ARM template, search for the **Templates** service and click **+ Create**.

In the **General** page, provide a **Name** and **Description** for and click **OK**.

Now paste the JSON configuration shown below into text field on the **ARM template** page and click **OK** and then **Add**.

```json
{
  "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "serviceBusNamespaceName":"YourNamespaceName",
    "serviceBusQueueName":"YourQueueName"
  },
	"resources": [{
		"apiVersion": "2017-04-01",
		"name": "[parameters('serviceBusNamespaceName')]",
		"type": "Microsoft.ServiceBus/namespaces",
		"location": "[parameters('location')]",
		"sku": {
			"name": "Standard"
		},
		"properties": {},
		"resources": [{
            "apiVersion": "[variables('sbVersion')]",
            "name": "[parameters('serviceBusQueueName')]",
            "type": "Queues",
            "dependsOn": [
                "[concat('Microsoft.ServiceBus/namespaces/', parameters('serviceBusNamespaceName'))]"
            ],
            "properties": {
                "path": "[parameters('serviceBusQueueName')]"
            }
        }]
	}]
}
```

The newly created template will now appear in the list on the **Templates** page. From the action menu at right of the template, click **Deploy**.

Fill in the **Namespace name** and **Queue name** with the values from the template, and choose an appropriate region.

Note that if the deployment fails, it's possible that there's already an existing namespace in the same region with the same name that you chose. If the deployment error message indicates that this is the issue, you'll need to try redeploying with a different name until the deployment is successful.

If you aren't able to use the ARM template and need to create the SB resources manually, follow the steps in the Azure documentation to [create a Service Bus namespace and queue](https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-quickstart-portal).

## 3. Creating an Event Flow in Algorithmia

**NOTE:** The steps in this section are to be completed within the Algorithmia browser UI.
{: .notice-info}

Note that you can set up _any_ algorithm to subscribe to an SB message broker so that the algorithm is executed when a message is published to that specific queue. On our platform we refer to this type of event-driven configuration as an Event Flow, and the following demonstrates one possible example of how to set one up.

### Create an algorithm

* Create a new Python 3.x Algorithm.
<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_35.png">

* In the web IDE replace the source with the following:

{% highlight python %}
import Algorithmia

def apply(input):
    Algorithmia.client().file("data://COLLECTION_OWNER/COLLECTION_NAME/" + input.get("filename")).put(input.get("data"))

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

## 4. Sending messages to the broker
