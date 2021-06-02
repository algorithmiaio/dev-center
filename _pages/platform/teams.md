---
layout: article
title:  "Teams"
image:
    teaser: /icons/algo.svg
categories: basics
permalink: /platform/teams/
sitemap: false
redirect_from:
  - /teams/
---

The following sections cover the basics of using the <a href="https://teams.algorithmia.com" target="_blank" rel="noopener noreferrer">Teams platform</a>, including how to create and invite people to a team, how to setup data connections and API keys, and how to manage your team with administrator features.

## Distinctions from the public marketplace

Algorithmia Teams is a distinct product from the public marketplace. They both run on Algorithmia's managed infrastructure but Teams is designed for Data Science and Machine Learning teams while the public marketplace is designed for individual developers. We've listed some of the primary differences below.

- **Collaboration Platform** - Private workspace for team members to collaborate. Algorithms, API keys, and data are shared within the team but not publicly visible.
- **Centralized, Usage Based Billing** - Pay-as-you-go model. Usage is prepaid and you can set up automatic refills to ensure you never experience downtime.
  - CPU costs $0.0001/sec of usage.
  - GPU costs $0.0003/sec of usage.
- **Advanced support** (Requires Pro subscription)
  - For platform/admin issues: 24/7 email support with support level objective (SLO) that defines the response time by severity level.
  - For user and data science/model related questions: 5/12 email support with no SLO.

NOTE: If you need your own cluster setup or need to accommodate a multi-team scenario with IT, operations, and/or cluster administration, please reach out to learn more about our enterprise offerings. info@algorithmia.com
{: .notice-info}

## Creating a Team

To create your team go to <a href="https://teams.algorithmia.com/signup" target="_blank" rel="noopener noreferrer">teams.algorithmia.com/signup</a>. You will first need to create your personal account. Once that’s done, you’ll name your team and select your plan. After that your team is ready to go! Invite members to your new team to start working right away.

## Inviting People

In order to collaborate on algorithms, all collaborators need to be a member of your team. You can invite people to your team during the team creation flow, or at any time from the **People** page. To invite someone to your team simply input their email address and they'll be sent a custom link for them to create an account and join your team.

Once the invite is accepted, you will see the new member listed under the **Members** tab.

All people joining a team will automatically be assigned an API key for them to use while developing algorithms.

NOTE: You must be invited to join a team by an administrator on the team. More about administrators.
{: .notice-info}

## Algorithms

Algorithms are the foundation for work on the Algorithmia platform. You can think of an algorithm as a maestro who coordinates all functionality and connections for your ML solution. You will find all of your team's algorithms on the Algorithms page, which is the default landing page after you log into the platform. Clicking on an algorithm will bring you to that algorithm's overview page, where you can code, view details, adjust settings, and more.

## Data

The **Data** page displays all data owned by your team. This includes hosted data, algorithm data, and externally connected data. All data is secure and private to your team, and designed to be easily used within your algorithms.

### Hosted data

Hosted data is a free option to host your data provided by Algorithmia. With hosted data you can create collections and add files to be used within your algorithm. All files within a collection have a unique path you can use directly within your algorithm's code. Hosted data is the recommended location to store model files.

## API Keys

API keys are used for authentication across the platform. Every member is assigned their own API key upon joining a team. Which you'll need to call your team's algorithms and interact with your team's data. You can access your API keys from the **API Keys** page where you'll see all the keys you have access to. A team administrator has the ability to create and manage keys.
API keys can also belong to the team. These keys are recommended for production workloads as they do not rely on an individual member belonging to a team and are controlled by team administrators. The team owned keys can also be given to customers who rely on calling your algorithms. This allows you to monitor their usage and revoke their access if necessary.

NOTE: Please remember to properly label your keys to inform other members of their purpose.
{: .notice-info}

## People

The **People** page shows you all members of the team along with basic details and their status (member or administrator). As a team administrator this page will offer additional functionality allowing you to invite members, update a members status, or remove a member.

## Team Administrators

The creator of a team will automatically be assigned as a team administrator and can promote members to the administrator status if necessary.

A team administrator can perform management actions not available to team members. This includes managing billing, editing team profile settings, inviting and removing members, managing external data connections, and monitoring platform usage.

### Managing Billing

If you need to cancel your subscription please contact us at support@algorithmia.com.

### Conclusion

With this overview of the basics of using the Teams platform, you should have enough information to get started. For more information on using the Algorithmia platform please refer to the [developer docs](/) as it will provide more in depth platform guides. And please feel free to reach out to support@algorithmia.com with any questions.
