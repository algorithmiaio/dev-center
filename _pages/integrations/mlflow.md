---
layout: article
title:  "MLFlow"
excerpt: "Use MLFlow to deploy models to Algorithmia"
excerpt-short: "Use MLFlow to deploy models to Algorithmia"
categories: model-training
tags: [integrations, model-training]
permalink: integrations/mlflow
show_related: true
image:
    teaser: /language_logos/mlflow.svg
redirect_from: clients/mlflow/
---

[MLFlow](https://www.mlflow.org) is a platform for the Machine Learning Lifecycle.
Algorithmia prodives an integration with the [MLFlow models component](https://www.mlflow.org/docs/latest/models.html)
to take models that have been trained using MLFlow and deploy them to Algorithmia in a simple way.

This integration is a Python package that is available on PyPI:
[`mlflow-algorithmia`](https://pypi.org/project/mlflow-algorithmia/).

You can install this integration using `pip`:

```
pip install mlflow-algorithmia
```

After this you can deploy a trained model to a Algorithmia using a simple
`mlflow deployment` command, for example:

```
mlflow deployments create -t algorithmia --name mlflow_sklearn_demo -m <path-to-the-model-directory>
```

For more information on how to use this integration take a look at the GitHub Repository:
[github.com/algorithmiaio/mlflow-algorithmia](https://github.com/algorithmiaio/mlflow-algorithmia).
