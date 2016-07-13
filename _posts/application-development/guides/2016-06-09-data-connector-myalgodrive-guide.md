---
layout: article
title:  "Hosted Data"
excerpt: "How to set up and configure Algorithmia's free file hosting platform."
date:   2016-06-07 11:46:03
permalink: /application-development/data-sources/hosted-data-guide
tags: [app-data-connectors]
show_related: true
author: steph_kim
image:
    teaser: /post_images/data_connectors/hosted-data-box.png
---


<a href="https://algorithmia.com/data/hosted">Algorithmia's Data Source</a> makes it easy to host your data files on the Algorithmia platform for free while our <a href="http://docs.algorithmia.com/#data-api-specification">Data API</a> makes it a cinch to work with your hosted data.

## Data Source Basics
For simple cases, you can feed data to an algorithm at request time, but for algorithms that have larger data requirements or that need to preserve state between calls, you can create collections of data files hosted on Algorithmia for free. This allows algorithms to access data from within the same session, but ensures that your data is safe. These collections are created on a per-user basis and you can control the access and visibility of the data.

There are many different collection types that have different features and security measures in place. Data in your temporary and user collections can be downloaded to be saved locally.

## Collection Types
There are four types of collections: User collections, Session collections, Permanent Algorithm collections, and Temporary Algorithm collections.

User collections can store data and allow you to set the read permission on that collection.

Other collection types have system-defined permissions:

- Session Collections only have read/write access from within the same session.
- Temporary and Permanent Algorithm collections have read/write access from internal calls and this data collection type is guaranteed to exist for every algorithm.

## Create a Data Collection
To create a new data collection first navigate to <a href="https://algorithmia.com/data" target="_blank">Algorithmia's Data Portal</a>. On the panel that says 'Algorithmia Hosted Data' click the button that says **'Browse Files'** which takes you to <a href="https://algorithmia.com/data/hosted">Data Collections</a>.

<img src="/images/post_images/data_connectors/manage_connector_all.png" alt="Create a data connector" class="screenshot">

Here you can create named collections of data that can be controlled by collection-based Access Control Lists (ACLs). This allows you to manage the permissions for each collection from the Data Portal.

Each collection has its own ACLs, and there are three types of permissions for reading data from a collection. Only you can write to your own collections, so they are by default marked as private.

Create a new data collection:

- Click on **'Add Collection'** under the 'My Collections' section on your data collections page.

- Set the read and write access on your collection. Below are the details regarding access permissions and what they mean.


<img src="/images/post_images/model_hosting/add_collections_visual.png" alt="Create a data collection" class="screenshot">

## Details about Read and Write Permissions
For each setting there are differences in permissions and access that you need to be aware of. Below are the details of the various settings that can be managed for each collection.


### Private (only me):
When you set your collection read access to Private, only you will be able to read and write to the data collection. This is the most restrictive option. This permission setting is the only option available for writing to collections to prevent involuntary data retention.

### My Algorithms (called by any user):
If you select this permission option for your data collection, it will allow other users on the platform to interact with your data through your algorithms. This means they can call your algorithm to perform an operation on your data stored in this collection. This option is perfect for showcasing the algorithms and letting the users get an idea of what they can do on your sample data.

### Public (anybody):
Anyone can read the data in your collection, feed that data to their algorithms, or copy the data to their own collections.

### Accessing your data from collections:

- 'data://:username/:collection'
- 'data://:username/:collection/:filename'

### The `.my` pseudonym:

If you are operating on your own directories or files you can use the '.my' pseudonym and the user name will be assumed from the authorization provided.

- 'data://.my/:collection'
- 'data://.my/:collection/:filename'

**NOTE:** If you are authoring an algorithm, avoid using the '.my' pseudonym in the source code. When the algorithm is executed, '.my' will be interpreted as the user name of the user who called the algorithm, rather than the author's user name.

## Session Collections

The format for session collections when using Data URI within Algorithmia:

- 'data://.session/:filename'

Session collections exist for each Algorithm Session and is only accessible to algorithms within that session.

The Algorithm session is defined as the scope of the original request and any other subsequent calls withing the tree. When the original request ends, the session collection is no longer available.

Session collections allow data to be used across multiple algorithms within the scope of one call. This is useful for algorithm developers so that they may ensure access to data on a temporary basis. These collections are no longer available after the request, thus giving the caller security that their data will not be available outside the scope of the session.

## Temporary Algorithm Collections

Access temporary collections with this URI format from inside of Algorithmia or using a client:

- 'data://.algo/:author/:algoname/temp/:filename'

Temporary algorithm collections give you a space to store data on a temporary basis. You will find the temporary collections under a `temp` directory inside of an algorithm collection. For example, a user can have an algorithm that produces a file inside of a temporary collection.

The temporary algorithm collections are particularly useful for algorithms that produce files as a result of the sample input. For example, if your sample input generates a file, using a temporary algorithm collection allows the algorithm to store its output but will be cleaned up after a day.

### The Simplified Format

Simplified URI format:

- 'data://.algo/temp/:filename'

If you are using the Data URI from inside Algorithmia, you can also use a simplified form of the URI. This simplified version will infer the algorithm when it is being called so that you don't have to specify the author and algorithm name.

Temporary algorithm collections are ideal for storing data on a short term basis. This data is deleted after approximately one day. This temporary state is perfect for showcasing sample input in an algorithm that generates an output. If you store the output in a temporary algorithm collection, the results from the algorithm will be cleaned up automatically, allowing users to try the algorithm without creating permanent data.

## Permanent Algorithm Collections

Access permanent collections with this URI format from inside of Algorithmia or using a client:

- 'data://.algo/:author/:algoname/perm/:filename'

If you need to access a collection from a specific algorithm, you can use the permanent collection. This allows users to generate output that is saved permanently as a result of running the algorithm. Unlike the Temporary Algorithm Collections, the data stored in the permanent is not cleared after one day.

### The Simplified Format

Simplified URI format:

- 'data://.algo/perm/:filename'

If you are using the Data URI from inside Algorithmia, you can also use a simplified form of the URI. This simplified version will infer the algorithm when it is being called so that you don't have to specify the author and algorithm name.

If you have any questions about Algorithmia please <a href="mailto:support@algorithmia.com">get in touch</a>!