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

Algorithmia supports deployment and redeployment via the [the Algorithmia API]({{site.baseurl}}/algorithm-development/algorithm-management), and this is easily integrated into CI/CD tools such as Jenkins or GitHub Actions. With Algorithmia and your favorite CI/CD tool, your models are deployed as soon as they are ready, and can be instantly redeployed whenever an approved retrained model is available.

For setting up an automated workflow in your **Algoritm repository**, you can check out the following examples with Jenkins or Github Actions:

<a href="https://github.com/algorithmiaio/githubactions-modeldeployment-deprecated/tree/master/jenkins_deploy_algorithmia" class="btn btn-default btn-primary"><i class="fa fa-github" aria-hidden="true"></i> TRY IT OUT: Jenkins</a>

<a href="https://github.com/algorithmiaio/githubactions-modeldeployment-deprecated/tree/master/githubactions_deploy_algorithmia" class="btn btn-default btn-primary"><i class="fa fa-github" aria-hidden="true"></i> TRY IT OUT: GitHub Actions in Algorithm Repo</a>


For setting up an automated workflow in your **machine learning repository at Github**, where you may be using a Jupyter notebook to train/test/export your ML model or checking-in your saved model; you can check out our Github Action that automates your model and algorithm code deployment once you push your changes to your model development repo:

<a href="https://github.com/algorithmiaio/algorithmia-modeldeployment-action" class="btn btn-default btn-primary"><i class="fa fa-github" aria-hidden="true"></i> TRY IT OUT: GitHub Actions in Model Development Repo</a>
