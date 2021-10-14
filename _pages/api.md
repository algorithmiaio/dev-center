---
nav_index: 0
layout: nil
title: "API"
---
{% if site.isLocalDev %}
  <redoc spec-url="../assets/openapispec.yml" ></redoc>
{% else %}
  <redoc spec-url="/v1/openapispec"></redoc>
{% endif %}
