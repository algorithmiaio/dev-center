---
layout: article
title:  "Local Development: emulating the Algorithmia execution environment"
permalink: algorithm-development/advanced-algorithm-development/local-development/
categories: [algo-dev]
tags: [algo-dev]
show_related: true
author: jon_peck
image:
    teaser: /post_images/local_development/local_development.png
---

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/local_development/local_development_wide.png" class="img-fill">

- you can write Algorithms locally using your favorite IDE, then commit the code to Algorithmia (and the reverse)
- so you want your local execution environment to be similar to the one it runs in on Algorithmia
- here's how you make a Virtualenv to do that
- also you don't want to have to change your code a lot to run locally
- so here's an example wrapper function which deserializes JSON and calls apply() locally for you
