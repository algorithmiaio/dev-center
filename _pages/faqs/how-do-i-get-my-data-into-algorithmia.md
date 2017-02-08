---
layout: faq
title:  "How do I get my data into Algorithmia? Can I upload data for processing?"
categories: faqs
tags: [platform-faq]
show_related: true
author: liz_rush
image:
  teaser: /icons/fa-bolt.png
---

For simple cases, you can feed the data into an algorithm at request time. To upload data, you can use our Data API. The Data API is great for applications with larger data requirements or to batch process raw datasets.

You can also upload data to your data collection by hand. Uploading through the web browser is a quick way to get a file uploaded and accessible.

### Uploading a file through the web browser

To upload a file through the web browser, first navigate to your data collections by clicking on your profile drop down:

![access data]({{ site.baseurl }}/images/post_images/faqs/uploading_data/nav_bar_dropdown.png)


After you click on "Manage Data", you'll be brought to your data collections. If you already have collections or data created by algorithm calls, you'll see those on the left hand panels. Since we are uploading a new file, first we'll create a new collection by clicking the "Add Collection" button:

![new collection]({{ site.baseurl }}/images/post_images/faqs/uploading_data/click_add_collection.png)

Next, choose a name for your collection. The name should be alphanumeric and can't contain spaces. Be sure to give it a descriptive name!

![name_collection]({{ site.baseurl }}/images/post_images/faqs/uploading_data/name_collection.png)

Next, to start adding files to your new collection, you can either drag and drop from your computer to the box labeled "Drop files here to upload" and the uploading process will begin immediately. Alternatively, you can also click on the uploading box to bring up a file navigator so that you can select files.

![add file]({{ site.baseurl }}/images/post_images/faqs/uploading_data/add_file.png)

Finally, be sure to check the permissions on your collection. You can select Private, My Algorithms, or Public.

![make public]({{ site.baseurl }}/images/post_images/faqs/uploading_data/make_public.png)

* "Private" means that only your account will have access to the collection.
* "My algorithms" means that any algorithm that you have authored will be able to access the collection. An example of this would be if you write an algorithm that uses a trained model. You can store the model file in your collection and any time a user calls your algorithm, it will be able to access that file. Users trying to access the file directly or from another algorithm would not have permissions to do so.
* "Public" means that any user has read access the files in your collections. Only you retain the ability to delete or write to your collection.

### Other data sources

We also offer algorithms to transfer data from Amazon S3, SQL databases, and other data sources. More data sources are being added regularly but if there is a specific data source you need, [we'd love to hear from you](https://algorithmia.com/contact)!

