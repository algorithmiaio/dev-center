---
exclude_from_search: false
layout: article_page
title:  "Learning / Training Center"
show_related: false
excerpt: "The Learning Center hosts training modules to guide users along their Algorithmia journey."
menus:
  devcenter:
    url: /developers/learningcenter
    title: "Learning & Training Center"
    weight: 9
---

{% if site.enterprise %}

<a href="https://training.algorithmia.com"><img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/learningcenter/lms_enterprise_wide.png" alt="The Training Center" class="syn-image-responsive"></a>

## The Algorithmia Training Center

The Training Center hosts training modules to guide users along their Algorithmia journey. Think of it as the place you can go to for long-form and introductory content to the Algorithmia system.

<a href="https://training.algorithmia.com">
  <button class="syn-btn contained theme-primary">
    <i class="material-icons">library_books</i> KEEP LEARNING
  </button>
</a>

{% else %}

<a href="https://learn.algorithmia.com"><img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/learningcenter/lms_public_wide.png" alt="The Learning Center" class="syn-image-responsive"></a>

## The Algorithmia Learning Center

The Learning Center hosts training modules to guide users along their Algorithmia journey. Think of it as the place you can go to for long-form and introductory content to the Algorithmia system.

<a href="https://learn.algorithmia.com">
  <button class="syn-btn contained theme-primary">
    <i class="material-icons">library_books</i> KEEP LEARNING
  </button>
</a>
{% endif %}
