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

Algorithmia was built from the ground up to support machine learning at scale, and pipelining is a key part of any full-scale deployment solution. Teams must be able to productionize individual models as parts of a larger workflow, which means two things:

1. Complex machine learning workflows should be divided into independent, reusable, modular parts that can then be connected to form a complete pipeline. This sort of modularity makes data scientists and engineers more efficient, cutting out redundant work as the component pieces are reusable and easy to work with.
2. Complex machine learning workflows should be automated. This can be achieved by streamlining the process of transforming data, inputting it into a model where inference happens, and shuttling the output to the next step in the pipeline.

When machine learning is run at scale, issues arise related to the large volume of data processed, the variety of services used, and the versioning of these services. You can employ the following pipelining strategies to address these issues:

- Volume: only call parts of the workflow when you need them, and cache or store results that you plan on reusing.
- Variety: when you expand your model portfolio, you can use components from the beginning stages of existing workflows by simply pipelining them with your new models instead of actually replicating the code.
- Versioning: when services are stored in a central location and pipelined together with various models, there's only one copy of each piece of the pipeline to update. Because services in multiple different pipelines may be calling the same upstream service, when the original upstream service is updated, all downstream services will have access to that updated version immediately, and code doesn't need to be changed in multiple places.

This type of ML pipeline improves the performance and organization of the entire model portfolio, getting models into production quicker and making machine learning workflows easier to understand, debug, modify, and manage. This goes hand-in-hand with the recent push for microservices architectures, branching off the main idea that by splitting your application into more basic, isolated components, you can build more powerful software over time.

With an ML pipeline, each part of your workflow is abstracted into an independent service. Then, each time you design a new workflow, you can pick and choose whichever elements you need and use them where you need them, and any changes made to individual services need only be made in one place.

With Algorithmia, pipelining machine learning is simple:

- Function logic is packaged into "algorithm" microservices that are exposed as API endpoints; calling any microservice becomes as simple as `algorithm.pipe(input)`.
- Algorithm inputs and outputs are expressed as JSON objects. This language-agnostic format means you can write algorithms in multiple languages, and/or using multiple frameworks, and pipeline them together seamlessly. 
- You can set granular permissions for each algorithm and choose whether or not to allow that algorithm to call other algorithms on the platform.

## Example ML pipeline

TODO: Graphic showing MLflow-based pipeline?

### Create a model

We can use Algorithmia's [MLFlow integration](https://algorithmia.com/developers/clients/mlflow) to create our model. We'll use the example from the Algorithmia mlflow-algorithmia GitHub repository.

First, install the mlflow-algorithmia package:

```
pip install mlflow-algorithmia
```

Next, clone the repository and build a model using the `sklearn_elasticnet_wine` example:


```
mlflow run examples/sklearn_elasticnet_wine/
```

This will create an `mlruns` directory that contains the trained model, which we can then push to our ML repository on GitHub.

### Automate model deployment

There are a variety of ways to automate model deployment, such as integrating with a [CI/CD](https://algorithmia.com/developers/algorithm-development/ci-cd) system such as Jenkins or one built using GitHub Actions. This allows us to automatically test our algorithms prior to deployment.

Algorithmia provides a [GitHub action](https://github.com/marketplace/actions/deploy-to-algorithmia) we can use as an example. The GitHub Action can be configured to automatically run a Jupyter notebook and generate a model for you, or if you already have a model checked in to your repository, the workflow can be configured with the existing model file path.

```
model_path:
    description: 'Path of the model file to be uploaded to Algorithmia'
    required: true
    default: 'model.pkl'  
```

When the GitHub Action runs, it will:

- Take the ML model file from the configured path and upload it to your data collection hosted on Algorithmia
- Copy your inference (algorithm) files to your algorithm repository
- Update/create a `model_manifest.json` file, connecting your inference (algorithm) code on Algorithmia with this newly uploaded model file

The model manifest is a key feature for automating model deployments. It contains information about where the model file was uploaded from (including which GitHub repository), what the MD5 hash of the model was when it was first created, the Git commit SHA and commit message, and the time of the upload.

By using this manifest, your algorithm will know which model to load and use. It can also recalculate the MD5 hash of the model file at inference time and compare it with the original MD5 hash that was calculated at the time of the upload, and make sure that the model file hasn't been changed.

You can find more details about the manifest file as well as how to configure and run the GitHub Action [here](https://github.com/algorithmiaio/algorithmia-modeldeployment-action).

### Monitor your ML model

This feature is available to [Algorithmia Enterprise](/enterprise) users only.
{: .notice-enterprise}

If you're an Algorithmia Enterprise user, you can use [Algorithmia Insights](https://algorithmia.com/developers/integrations/insights) to monitor both operational and inference-related metrics once your model has been deployed.
