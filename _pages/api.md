---
excerpt-short: "Test"
nav_index: 0
layout: nil
show_related: false
title: "API"
---
{% if site.isLocalDev %}
  <redoc spec-url="../assets/openapispec.yml" ></redoc>
{% else %}
  <redoc spec-url="{{ site.url }}/v1/openapispec"></redoc>
{% endif %}
