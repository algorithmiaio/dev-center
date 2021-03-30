---
layout: article
title:  "Algorithm Secrets"
excerpt: ""
categories: basics
nav_index: 40
show_related: true
image:
    teaser: /icons/algo.svg
permalink: /platform/algorithm-secrets/
redirect_from:
  - /basics/algorithm-secrets/
---

Algorithm secrets let you decouple sensitive data like passwords, access tokens, and credentials from your algorithm source code. With this feature, you can securely store secrets on Algorithmia and access them inside your algorithms using environment variables.

#### Use cases
  - Connecting to a password-protected database
  - Calling a secure HTTP webhook to `POST` your algorithm result

Secrets are encrypted at rest, encrypted in transit, and only exposed to selected algorithms. We never expose sensitive data through the web interface or any user-facing APIs.

Keep in mind that collaborators who can update algorithm source can also access its secrets.

#### External secret stores 

This feature is available to [Algorithmia Enterprise](/enterprise) users only.
{: .notice-enterprise}

Storing sensitive data on Algorithmia might not be suitable for an organization that uses a vaulting system like Hashicorp Vault or Azure Key Vault to manage secrets.

Algorithmia Enterprise allows platform admins to connect Algorithmia to external vaulting systems where secrets are managed and maintained by a DevOps team. This helps Data Science teams access secrets in accordance to an organization's security and compliance standards.

If you're new to Algorithmia and would like to learn more about our product and using external secret stores, please [contact our sales team](https://info.algorithmia.com/contact-sales). We'd love to hear from you!

## Managing algorithm secrets

Secrets are managed on the algorithm settings page. Here you'll be able to create, update, delete, and view your existing algorithm secrets. The steps below demonstrate the process for creating secrets.

![Image of UI settings page for creating secrets](/developers/images/post_images/algorithm_secrets/settings_page.png)

Start by clicking "New secret" to create an algorithm secret. Next, give your secret a display name, description, environment variable name, and value.

It can take up to one minute for new secrets to show up inside your algorithm. Similarly, when you update a secret, it can take one minute for that change to take effect.
{: .notice-info}

![Image of UI create secret page](/developers/images/post_images/algorithm_secrets/create_secret_page.png)

After your secret is configured, it can be updated or deleted on the settings page. Clicking "Update" will direct you to a form that is identical to the form shown above, and you'll be able to change the secret's name, description, and value.

![Image of UI settings page with an existing secret](/developers/images/post_images/algorithm_secrets/settings_page_with_secret.png)

## Accessing algorithm secrets

Secrets are accessed through environment variables. Every language supported by Algorithmia can read environment variables using the language standard library.

The following Python algorithm demonstrates how you can integrate a secret into your algorithm by reading a variable from the environment.

Keep your secrets safe! We highly recommend that you never include secrets in your algorithm output. This example demonstrates how algorithms can leak sensitive data if secrets are not handled correctly.
{: .notice-warning}

![Image of UI algorithm running with secret](/developers/images/post_images/algorithm_secrets/running_algorithm_with_secret.png)
