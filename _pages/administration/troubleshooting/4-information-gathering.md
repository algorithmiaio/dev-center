---
categories: troubleshooting
layout: article
title: "4) Information Gathering"
---

If you've [triaged your issue](/developers/administration/troubleshooting/overview) to narrow down the possibilities and haven't reached a satisfactory resolution, please contact our support team as outlined on our [Support Page](https://algorithmia.com/developers/support).

The details below provide a guideline for the type of information that we need from you in order to resolve your issue as efficiently as possible. We also provide this information as a condensed troubleshooting guide; we find that many issues are resolved through the process of gathering this information. Please provide any of the following details that you think may be relevant for us to troubleshoot your issue.

## <span style="font-family: inherit; font-size: 1em;">Details for issue resolution</span>

### <span style="font-family: inherit; font-size: 1em;">*Platform information*</span>

<span style="font-family: inherit; font-size: 1em;">Cluster version information (e.g., 20.4.7; this can be accessed through</span> **Admin** <span style="font-family: inherit; font-size: 1em;">→</span> **System Version**<span style="font-family: inherit; font-size: 1em;">):</span>

### <span style="font-family: inherit; font-size: 1em;">*Algorithm information*</span>

Algorithm owner, name, and version:

Algorithm runtime (language, environment):

Algorithm library dependencies (e.g., `pandas==1.2.3`, etc.):

Example algorithm input (e.g., `"{\"key_2\":\"value_2\", \"key_2\":\"value_2\"}"`):

Expected output given this algorithm input (sometimes it isn't possible to provide exact output, but our team will need some way to verify that we've reached a solution):

Files required by the algorithm (see below for whether this can be omitted):

A minimal version of the algorithm code that demonstrates the problem. You can omit:

*   Code that's unlikely to be related to the issue
*   Data API operations that are unlikely to be related, so that you don't have to share those files that your algorithm uses. If this is a critical part of the algorithm and you suspect that the problem could be related, see if you can:
    *   Share a "dummy" version of any files that may contain personally identifiable, confidential, or proprietary information (for instance, a vanilla Transformer model that's publicly available)
    *   Stub the related section of code to emulate as if those files are accessed/read

### *Resource access information*

Type of API key you're using to call the algorithm (owned by org vs. individual account):

Permissions of the data sources your algorithm accesses (owned by org vs. individual account):

How are you calling your algorithm?

*   Identify specific direct or indirect method used to call algorithm, e.g.:
    *   Indirect (Event Flows)
        *   Which broker?
    *   Direct (Python client, Web IDE, cURL, algo CLI, etc.)
        *   Using which client (Web IDE, Python client, Algo CLI, etc.)?
        *   Using which options (are there any parameters like timeout or async in your code)?

Do you see different behavior depending on:

*   With which client you’re calling the algorithm, e.g., “Works when I call it from Python, but times out when I call from the Web IDE”?
*   With which API key you’re calling the algorithm, e.g., “Works when I call it with my org-owned API key but fails when I call it with my account-owned API key”?
*   At what point in time you’re calling the algorithm, e.g., “Was working yesterday but not today”? If so, what might have changed between the two sessions?
*   Which specific version of the dependency package you’re using, e.g., “Works with version X.Y but fails to build or fails to run with version X.Z”?

Can you run the algorithm locally (i.e., in your own development environment outside of the Algorithmia Web IDE? If yes:

*   What is the version of your language environment?
*   What are the versions of your algorithm’s dependencies?