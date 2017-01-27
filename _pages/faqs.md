---
layout: article
title: "FAQs"
exclude_from_search: true

show_related: false
excerpt: "Frequently asked questions"
image:
    teaser: /icons/Algorithmia_FAQs.png
---

<div id="faqs-index">
  <section class="row">

    <div class="col-md-6">
       <!-- Pulls from data/tags.yml to allow for data defined name attr -->
      {% assign platform_tag = site.data.tags["platform-faq"] %}
      <h2>{{ platform_tag.name }}</h2>

      <p>Algorithmia is a platform for sharing the world's algorithmic knowledge in a way that is scalable, composable, easy-to-integrate, and always live. We want to place the cutting edge of algorithms technology in the hands of every developer, researcher, and business. Find quick answers to common questions about the platform below.</p>
      <a href="{{ page.url | relative_url }}#platform-faq">Jump to {{ platform_tag.name }}</a>
    </div>

    <div class="col-md-6">
      {% assign algo_dev_tag = site.data.tags["algo-dev-faq"] %}
      <h2>{{ algo_dev_tag.name }}</h2>

      <p>With the Algorithmia platform, you can get your algorithms in to the hands of developers, researchers, and businesses. In the Algorithm Developer FAQs, you'll get fast answers to your algorithm development questions.</p>
      <a href="{{ page.url | relative_url }}#algo-dev-faq">Jump to {{ algo_dev_tag.name }}</a>
    </div>
  </section>

<section class="row">
  <div class="col-md-12">

{% assign faq_tags = "platform-faq|algo-dev-faq" | split:"|" %}
{% assign faq_pages = site.pages | where: "categories", "faqs" %}
{% for tag in faq_tags %}
  {% assign tagged_pages = faq_pages | where: "tags", tag %}
  {% assign tag_info = site.data.tags[tag] %}

	<h2 id="{{tag}}">{{ tag_info.name }}</h2>

	<!-- list posts in tag -->
	<section class="faq-posts">
	{% for post in tagged_pages %}
		{% include faq-list-item.html %}
	{% endfor %}
	</section>

{% endfor %}
</div>
</section>
</div>
