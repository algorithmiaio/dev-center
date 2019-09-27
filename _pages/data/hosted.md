---
layout: article
title:  "Hosted Data"
excerpt: "How to set up and configure Algorithmia's free file hosting platform."
categories: working-with-data
nav_index: 1
tags: [app-data-connectors]
show_related: true
author: steph_kim
image:
    teaser: /language_logos/algo_hosted.svg
redirect_from:
  - /algorithm-development/data-sources/hosted-data-guide/
  - /application-development/data-connectors/hosted-data-guide/
  - /application-development/data-sources/hosted-data-guide/
---


<a href="{{site.url}}/data/hosted">Algorithmia's Data Sources</a> make it easy to host your data files on the Algorithmia platform for free, while our <a href="http://docs.algorithmia.com/#data-api-specification">Data API</a> makes it a cinch to work with your hosted data.

## Data Source Basics
For simple cases, you can feed data to an algorithm at request time, but for algorithms that have larger data requirements or that need to preserve state between calls, you can create collections of data files hosted on Algorithmia for free. This allows algorithms to access data from within the same session, but ensures that your data is safe. These collections are created on a per-user basis and you can control the access and visibility of the data.

There are four collection types that have different features and security measures in place: User collections, Session Collections, Permanent Collections, and Temporary Algorithm Collections.

This guide will show how to create a collection and walk you through the different types of directory permissions available, the different types of collections and what they are generally used for.


## Create a Data Collection

To create a new data connection first navigate to <a href="{{site.url}}/data">Algorithmia's Data Portal</a> where you'll notice there is a drop down that says 'New Data Source' where you'll see the options:

<img src="{{site.baseurl}}/images/post_images/data_connectors/create_data_connector.png" alt="Connect a data source" class="screenshot img-md">

Select **'Hosted Data Collection'** and a modal window will open to create a new collection.

<img src="{{site.baseurl}}/images/post_images/data_connectors/new_hosted_data_collection.png" alt="Create a data collection" class="screenshot img-sm">

Notice that once you create a collection you can set the read access by using the drop down shown in the below screenshot. Below are the details regarding access permissions for user collections and what they mean.

<img src="{{site.baseurl}}/images/post_images/data_connectors/hosted_data_collection.png" alt="Create a data collection" class="screenshot img-md">


## Read and Write Permissions

The different types of collections have different permissions and are either set by the user or are system-defined permissions.

User collections like we created above allow you to set the read and write permissions on a collection using ACL's which we'll cover in depth later.

Session, Temporary, and Permanent Collections all have system-defined permissions:

-	Session Collections have read/write access only from within the same session.

-	Temporary and Permanent algorithm collections have read/write access from internal calls and this data collection type is guaranteed to exist for every algorithm.

**Note:** Data in your temporary and user collections can be downloaded to be saved locally.

### User Collection Permissions and ACL's

Here you can create named collections of data that can be controlled by collection-based Access Control Lists (ACLs). This allows you to manage the permissions for each collection from My Collections drop down menu.

Each collection has its own ACLs, and there are three types of permissions for reading data from a collection. Only you can write to your own collections, so they are by default marked as private.

For each setting there are differences in permissions and access that you need to be aware of. Below are the details of the various settings that can be managed for each collection.

#### Private (only me):
When you set your collection read access to Private, only you will be able to read and write to the data collection. This includes any algorithm that you call, because when you call an algorithm it has permission to read and write to your collection on your behalf. This is the most restrictive option. This permission setting is the only option available for writing to collections to prevent involuntary data retention.

#### My Algorithms (called by any user):
This permission option is set as the default for your data collection and it will allow other users on the platform to interact with your data through your algorithms. This means they can call your algorithm to perform an operation on your data stored in this collection. This option is perfect for showcasing the algorithms and letting the users get an idea of what they can do on your sample data.

#### Public (anybody):
Anyone can read the data in your collection, feed that data to their algorithms, or copy the data to their own collections.

For more information on ACL's check out the [Algorithmia Data API](http://docs.algorithmia.com/#directories)

## User Collections

User collections are the most common collection type that you will use which we created at the start of this guide.

### Accessing your data from collections:

The format for user collections when using Data URI within Algorithmia:

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

Temporary algorithm collections give you a space to store data on a temporary basis. You will find the temporary collections under a `temp` directory inside of an algorithm collection, and files placed into it are accessible only to the user who ran the algorithm. For example, a user can have an algorithm that produces a file inside of a temporary collection.

The temporary algorithm collections are particularly useful for algorithms that produce files as a result of the sample input. For example, if your sample input generates a file, using a temporary algorithm collection allows the algorithm to store its output but will be cleaned up after a day.

### The Simplified Format

Simplified URI format:

- 'data://.algo/temp/:filename'

If you are using the Data URI from inside Algorithmia, you can also use a simplified form of the URI. This simplified version will infer the algorithm when it is being called so that you don't have to specify the author and algorithm name.

Temporary algorithm collections are ideal for storing data on a short term basis. This data is deleted after approximately one day. This temporary state is perfect for showcasing sample input in an algorithm that generates an output. If you store the output in a temporary algorithm collection, the results from the algorithm will be cleaned up automatically, allowing users to try the algorithm without creating permanent data.

## Permanent Algorithm Collections

Access permanent collections with this URI format from inside of Algorithmia or using a client:

- 'data://.algo/:author/:algoname/perm/:filename'

If you need to access a collection from a specific algorithm, you can use the permanent collection. This allows users to generate output that is saved permanently as a result of running the algorithm, and is only accessible by that user. Unlike the Temporary Algorithm Collections, the data stored in the permanent collection is not cleared after one day.

### The Simplified Format

Simplified URI format:

- 'data://.algo/perm/:filename'

If you are using the Data URI from inside Algorithmia, you can also use a simplified form of the URI. This simplified version will infer the algorithm when it is being called so that you don't have to specify the author and algorithm name.

## Conclusion and Resources

This guide showed how to create a data collection, discussed collection types and covered permissions of User Collections, Session Collections, Permanent Collections and Temorary Collections.

For more information:

- [Algorithmia Data API](http://docs.algorithmia.com/#data-api-specification)
- [ACL's](https://en.wikipedia.org/wiki/Access_control_list)



If you have any questions about Algorithmia please <a href="mailto:support@algorithmia.com">get in touch</a>!
