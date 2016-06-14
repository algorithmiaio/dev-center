---
layout: article_page
title:  "Data Portal Guides"
excerpt: "Host your data on Algorithmia for free or create a connection to your hosted files on Dropbox or S3."
date:   2016-06-06 11:46:03
categories: algorithm-development
tags: [data-connectors-overview]
show_related: false
author: steph_kim
image:
    teaser: /post_images/data_connectors/connectors.png
repository: https://github.com/algorithmiaio/algorithmia/blob/master/public/images/connectors/connectors.png
---

# Data Portal Connections
Using <a href="https://algorithmia.com/data">Algorithmia's Data Portal</a> you can easily connect your algorithm to various data sources such as <a href="https://aws.amazon.com/s3/">Amazon's S3 service</a>, <a href="https://www.dropbox.com/">Dropbox</a> or you can host your files for free on the <a href="https://algorithmia.com/data/hosted">Algorithmia platform</a>. With these options it's easy to integrate your data into the algorithm you're building.

How easy is it? By creating an Algorithmia account you automatically have access to <a href="https://algorithmia.com/data/hosted">Algorithmia's Hosted Data</a> platform where you can store your data files or even your algorithm's output. Other options include hooking up your <a href="https://www.dropbox.com/">Dropbox</a> or <a href="https://aws.amazon.com/s3/">Amazon S3</a> account which you can configure as a new data source to permit Algorithmia to read and write files on your behalf. Once you've set up your data connections all three file hosting options are accessable via <a href="http://docs.algorithmia.com/#data-api-specification">Algorithmia's Data API</a>.

If you have any questions about Algorithmia please <a href="mailto:support@algorithmia.com">get in touch</a>!

## Data Portal Guides:
{% assign data_connector_tags = "alg-data-connectors" | split:"|" %}
<div class="data-connectors">
  {% for post in site.posts %}
  	{% if data_connector_tags == post.tags %}
  		<div class="tile-guides">
	      	<a  href="{{ post.url }}">{{ post.title }}
	      	{% if post.image.teaser %}
	  			<img  src="{{ site.url }}/images/{{ post.image.teaser }}" alt="" itemprop="image">
			{% endif %}
			</a>
		</div>
	{% endif %}
  {% endfor %}
</div>
