---
layout: article_page
title:  "Connecting Your Data"
nav_overview: "Overview"
nav_index: 0
excerpt: "Guides for connecting to your data sources through Dropbox, S3, or Algorithmia Hosted Data"
tags: [data-connectors-overview]
show_related: false
author: steph_kim
redirect_from:
  - /algorithm-development/data-sources/
  - /application-development/data-sources/
---

<a href="/data">Algorithmia's Data Portal</a> makes it easy to connect your application or website to data sources. You'll find guides on how to connect to <a href="https://aws.amazon.com/s3/">Amazon's S3 service</a>, <a href="https://azure.microsoft.com/en-us/services/storage/blobs/">Azure Blob Storage</a>, <a href="https://cloud.google.com/storage">Google Cloud Storage</a>, <a href="https://www.dropbox.com/">Dropbox</a> or you can host your files for free on the Algorithmia platform with our <a href="https://algorithmia.com/data/hosted">Hosted Data Service</a>. With these options it's easy to integrate your data into the app you're building.

How easy is it? By creating an Algorithmia account you automatically have access to <a href="/data/hosted">Algorithmia's Hosted Data Source</a> where you can store your data or algorithm output and if you have a <a href="https://algorithmia.com/developers/data/dropbox">Dropbox</a>, <a href="https://algorithmia.com/developers/data/azureblob">Azure Blob Storage</a>, <a href="https://algorithmia.com/developers/data/googlecloudstorage">Google Cloud Storage</a>, or an <a href="https://algorithmia.com/developers/data/s3">Amazon S3</a> account you can configure a new data source to permit Algorithmia to read and write files on your behalf. Once you've set up your data connections all three file hosting options are accessable via <a href="http://docs.algorithmia.com/#data-api-specification">Algorithmia's Data API</a>.

**Note:** If you are calling the Algorithmia API with one of our clients, then you have access to all three data connection options. However, If you are creating an algorithm as an algorithm developer, then you will need to use the Algorithmia <a href="/data/hosted">Hosted Data</a> option for processing and storing data for your algorithms.

If you have any questions about Algorithmia please <a href="mailto:support@algorithmia.com">get in touch</a>!

### Data Portal Guides
{% assign data_connector_tags = "app-data-connectors" | split:"|" %}
<div class="row data-connectors">
  {% assign sorted_pages = site.pages | sort:"nav_index" %}
  {% for post in sorted_pages %}
    {% if data_connector_tags == post.tags %}
      <div class="col-xs-4 col-sm-4 col-md-3">
        <a  href="{{ post.url | relative_url }}" class="lang-tile">
          {% if post.image.teaser %}
            <img  src="{{ post.image.teaser | prepend:'/images' | relative_url }}" alt="" itemprop="image" class="lang-icon">
          {% endif %}
          {{post.title}}
        </a>
      </div>
    {% endif %}
  {% endfor %}
</div>
