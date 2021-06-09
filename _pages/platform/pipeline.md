---
layout: article
title:  "ML Pipelines"
excerpt: "Creating ML pipelines with Algorithmia."
categories: basics
tags: [basics]
show_related: true
image:
    teaser: /icons/algo.svg
permalink: /platform/pipeline/
---

# ML Pipelining in Algorithmia

Algorithmia was built from the ground up with machine learning at scale use cases in mind. Pipelining is a key part of any full scale deployment solution. Teams need to be able to productionize models as parts of a whole. This means two things: first, splitting up your machine learning workflows into independent, reusable, modular parts that can then be pipelined together to create models. This makes building models more efficient, cutting out redundant work. Second, we want to automate the machine learning workflow by enabling data to be transformed and correlated into a model that can then be analyzed to achieve outputs, streamlining the process of inputting data into the ML model.

A pipelining architecture solves the problems that arise at scale:

- Volume: only call parts of the workflow when you need them, and cache or store results that you plan on reusing.
- Variety: when you expand your model portfolio, you can use pieces of the beginning stages of the workflow by simply pipelining them into the new models without replicating them.
- Versioning: when services are stored in a central location and pipelined together into various models, there is only one copy of each piece to update. All instances of that code will update when you update the original.

This type of ML pipeline improves the performance and organization of the entire model portfolio, getting models into production quicker and making managing machine learning models easier. This goes hand-in-hand with the recent push for microservices architectures, branching off the main idea that by splitting your application into basic and siloed parts you can build more powerful software over time.

With an ML pipeline, each part of your workflow is abstracted into an independent service. Then, each time you design a new workflow, you can pick and choose which elements you need and use them where you need them, while any changes made to that service will be made on a higher level.

With Algorithmia, pipelining machine learning is simple:

- Algorithms are packaged as microservices with API endpoints: calling any algorithm or function is as easy as `algorithm.pipe(input)`
- Pipelines can be input agnostic, since multiple languages and frameworks can be pipelined together 
- You can set permissions for models and choose to allow a model to call other algorithms

## Example ML Pipeline

TODO: Graphic showing MLflow-based pipeline?

### Create a Model

We can use Algorithmia's [MLFlow integration](https://algorithmia.com/developers/clients/mlflow) to create our model. We'll use the example from the Algorithmia mlflow-algorithmia GitHub repository.

First, install the mlflow-algorithmia package:

```
pip install mlflow-algorithmia
```

Next, clone the repository and build a model using the `sklearn_elasticnet_wine` example:


```
mlflow run examples/sklearn_elasticnet_wine/
```

This will create an mlruns directory that contains the trained model which we can then push to our ML repository on GitHub.

### Automate model deployment

There are a variety of ways to automate model deployment, such as integrating with a [CI/CD](https://algorithmia.com/developers/algorithm-development/ci-cd) system such as Jenkins or one built using GitHub actions. This allows us to automatically test our algorithms prior to deployment.

Algorithmia provides a [GitHub action](https://github.com/marketplace/actions/deploy-to-algorithmia) we can use as an example. The GitHub action can be configured to automatically run a Jupyter notebook and generate a model for you, or if you already have a model checked in to your repository, the workflow can be configured with the existing model file path.

```
model_path:
    description: 'Path of the model file to be uploaded to Algorithmia'
    required: true
    default: 'model.pkl'  
```

When the GitHub action runs, it will:

- Take the ML model file from the configured path and upload it to your data collection at Algorithmia
- Copy your inference (algorithm) files to your algorithm repository
- Update/create a model_manifest.json file, connecting your inference (algorithm) code at Algorithmia with this newly uploaded model file

The model manifest is a key feature for automating model deployments. It contains information about which GitHub repository and where the model file was uploaded from, what the MD5 hash of the model was when it was first created, the git commit SHA and commit message, and the time of the upload.

By using this manifest, your inference script will know which model to load and use. It can also re-calculate the MD5 hash of the model file at inference time and compare it with the original MD5 hash that was calculated at the time of the upload, and make sure that the model file hasn't been changed.

You can find more details about the manifest file as well as how to configure and run the GitHub action [here](https://github.com/algorithmiaio/algorithmia-modeldeployment-action).

### Monitor your ML Model

This feature is available to [Algorithmia Enterprise](/enterprise) users only.
{: .notice-enterprise}

If you're an Algorithmia Enterprise user, you can use [Algorithmia Insights](https://algorithmia.com/developers/integrations/insights) to monitor both operational metrics as well as inference-related metrics once your model has been deployed.