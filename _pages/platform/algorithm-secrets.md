---
layout: article
title:  "Secret Store"
excerpt: ""
categories: basics
nav_index: 40
show_related: true
image:
    teaser: /icons/algo.svg
permalink: /platform/secret-store/
redirect_from:
  - /basics/algorithm-secrets/
  - /platform/algorithm-secrets/
---

Algorithmia's Secret Store enables you to decouple sensitive data like passwords, access tokens, and credentials from your algorithm source code. With this feature, you can store your sensitive data securely on Algorithmia and access individual secret values from within your algorithms using environment variables.

#### Use cases
  - Connecting to a password-protected database
  - Calling a secure HTTP webhook to `POST` your algorithm result

Secrets are encrypted at rest, encrypted in transit, and only exposed to the select algorithms that you specify. We never expose sensitive data through the web interface or any user-facing APIs.

Keep in mind that any Algorithmia collaborator who has access to an algorithm's source code can also access an algorithm's secrets by modifying that source code to view the secret value.

#### External secret stores 

This feature is available to [Algorithmia Enterprise](/enterprise) users only.
{: .notice-enterprise}

If your organization uses an external vaulting system to manage secrets, storing these data within Algorithmia might not be suitable. Therefore, Algorithmia Enterprise's Secret Store enables cluster admins to connect Algorithmia to external vaulting systems such as Hashicorp Vault and Azure Key Vault, where secrets are managed and maintained by a DevOps team. This helps Data Science teams access secrets in accordance to an organization's security and compliance standards.

## Managing algorithm secrets

Algorithm secrets are managed through the **Settings** tab on an algorithm's homepage, where you can create, update, and delete secrets, and view secret metadata.

![Image of UI settings page for creating secrets](/developers/images/post_images/algorithm_secrets/settings_page.png)

To create a new algorithm secret, click **New secret**.

In the modal, select the **secret provider**. This will default to the internal secret provider if an external secret provider hasn't been configured on your cluster.

Enter a **display name**, **description**, **environment variable name**, and **value** for your secret.

It can take up to one minute for new secrets to show up inside your algorithm. Similarly, when you update a secret, it can take one minute for that change to take effect.
{: .notice-info}

![Image of UI create secret page](/developers/images/post_images/algorithm_secrets/create_secret_page.png)

After your secret is created, it can be updated or deleted from the same page. Clicking "Update" will open the same modal as shown above, and you'll be able to  change the secret's name, description, and value. Note that through the settings page you can view but not update an existing secret's environment variable name, and you can update but not view an existing secret's value.

![Image of UI settings page with an existing secret](/developers/images/post_images/algorithm_secrets/settings_page_with_secret.png)

## Accessing algorithm secrets

Secrets are accessed in your algorithm source code through environment variables. Every language supported by Algorithmia can read environment variables using the language's standard library.

The following demonstrates how you'd access a secret from an environment variable in Python. Note that this code just returns the value, but in practice you wouldn't return the value; rather, you'd use the secret to establish a database connection, etc.

Keep your secrets safe! We highly recommend that you never include secrets in your algorithm output. This example demonstrates how algorithms can leak sensitive data if secrets aren't handled correctly.
{: .notice-warning}

{% highlight python %} 
import os

import Algorithmia

def apply(input):
    return "My secret value".format(os.environ["MYSQL_PASSWORD"])
{% endhighlight %}

![Image of UI algorithm running with secret](/developers/images/post_images/algorithm_secrets/running_algorithm_with_secret.png)
