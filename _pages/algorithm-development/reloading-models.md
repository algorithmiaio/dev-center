---
layout: article
title:  "Reloading Models"
excerpt: "Reloading your ML Model when it changes"
categories: algorithm-development
tags: [algo-dev]
show_related: true
author: jpeck
image:
  teaser: /icons/algo.svg
permalink: /algorithm-development/reloading-models/
---

Most Machine Learning Models will change at some point, and when they do, you want to make your retrained model available quickly and efficiently.

On Algorithmia, model files are pulled from file storage whenever a new instance of an Algorithm is warmed up. If your predictive code has not changed, and the new serialized model is otherwise compatible, you can choose to simply replace the file. Newly warmed-up copies of your Algorithm will simply ingest and the new model. However, this does not force old copies of your Algorith to unload... so, for a time, some predictions might use your old model, while others use the new one.

There are two ways to resolve this problem, depending on whether you want to force a version-number change on your Algorithm.

### Changing your Algorithm Version Number while Updating your Model



### Updating your Model immediately, without changing Version Numbers

*Coming soon!*
