---
layout: article
title:  "Deploy Models via Jenkins CI/CD or GitHub Actions"
excerpt: "Using CI/CD to (re)deploy your ML models via Jenkins or GitHub Actions"
categories: algorithm-development
tags: [algo-dev]
show_related: true
author: jpeck
image:
  teaser: /language_logos/jenkins.png
permalink: /algorithm-development/ci-cd/
---

Continuous Integration & Deployment are standard practice in the world of software development, and Machine Learning is no exception: you need a robust CI/CD workflow to ensure that your latest models are deployed efficiently and correctly into production.

Algorithmia supports deployment and redeployment via the [the Algorithmia API]({{site.baseurl}}/algorithm-development/algorithm-management-api), and this is easily integrated into CI/CD tools such as Jenkins or GitHub Actions. With Algorithmia and your favorite CI/CD tool, your models are deployed as soon as they are ready, and can be instantly redeployed whenever an approved retrained model is available.

<a href="https://github.com/algorithmiaio/model-deployment/tree/master/jenkins_deploy_algorithmia" class="btn btn-default btn-primary"><i class="fa fa-github" aria-hidden="true"></i> TRY IT OUT: Jenkins</a>

<a href="https://github.com/algorithmiaio/model-deployment/tree/master/githubactions_deploy_algorithmia" class="btn btn-default btn-primary"><i class="fa fa-github" aria-hidden="true"></i> TRY IT OUT: GitHub Actions</a>
