---
categories: admin-panel
layout: article
title: Advanced Actions
---

The Advanced page provides functionality for performing several specific platform-wide and algorithm-related actions. Because some of these features have global and/or irreversible effects, they are only available on the admin panel as a safeguard. Only use these advanced features if you know what you're doing and fully understand the consequences of the specific action that you're performing.

## Cluster-wide operations and setup 

One-time actions are used for cluster maintenance tasks such as re-encrypting data and rehashing keys. These actions can be performed by clicking the "One-Time Action" button, selecting the desired action from the list of those available, entering additional data if required, and pressing the "Perform Action" button.

![Admin Panel - One-Time Action]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1609204125948.png)

The "Perform Cluster Setup" button exposes functionality for configuring the cluster. This will only be necessary when the cluster is first deployed and there are still remaining setup steps to be taken; clicking this button will otherwise yield a pop-up notification alerting you that the setup is already complete.

The "Customize Style" button can be used to apply global CSS to your cluster's UI, on top of the default styling. Just paste your custom CSS into the dialog box and press the "Save Style" button. The changes should take effect within about a minute for users across the platform when they refresh their browser.

## Algorithm management

A private (not published publicly) algorithm may be deleted by the algorithm's owner from the "Settings" tab on the algorithm's home page. Once an algorithm is made public, however, the Algorithmia platform intentionally makes it more difficult to delete it, including requiring admin permissions. Because algorithms can call other algorithms on the platform, deleting them has the potential to break data pipelines, so this action should only be performed if absolutely necessary and when you're certain that the algorithm isn't in use by anyone else.

To delete a publicly published algorithm, click the "Delete Algorithm" button from the "Advanced Actions" list, enter the name of the algorithm owner and the algorithm, and select "Force Delete" before clicking the red "Delete Algorithm" button to take the action. Private algorithms can also be deleted using this interface, in which case the "Force Delete" selection is not necessary.

![Admin Panel - Delete An Algorithm]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1609195926279.png)