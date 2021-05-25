---
layout: article
title:  "Deploy Models via CI/CD"
excerpt: "Using CI/CD to continuously deploy your ML models via Jenkins, GitHub Actions, or GitLab CI/CD"
categories: algorithm-development
tags: [algo-dev]
show_related: true
author: jpeck
image:
  teaser: /language_logos/jenkins.png
permalink: /algorithm-development/ci-cd/
---

Continuous Integration & Deployment are standard practice in the world of software development, and machine learning is no exception—you need a robust CI/CD workflow to ensure that your latest models are deployed efficiently and correctly into production.

Algorithmia supports deployment and redeployment via the [the Algorithmia API]({{site.baseurl}}/algorithm-development/algorithm-management), and this is easily integrated into CI/CD tools such as Jenkins, GitHub Actions, and GitLab CI/CD. With Algorithmia and your favorite CI/CD tool, your models are deployed as soon as they're ready, and they can be redeployed instantly whenever an approved retrained model is available.

For setting up automated workflows, you can check out the following examples for your preferred CI/CD system.

## Jenkins
If you are using Jenkins as your CI/CD system, check out our [example repository](https://github.com/algorithmiaio/githubactions-modeldeployment-deprecated/tree/master/jenkins_deploy_algorithmia) for a step-by-step walkthrough to:
- Prepare your Jenkins server
- Set up Jenkins to deploy to Algorithmia, either as a project or a pipeline job
- Configure your credentials
- Verify that the job runs

By following the steps in this repository, and by modifying the template algorithm folder with the code needed for your own algorithm, you can use our model deployment scripts to continuously deploy your model (algorithm) code to Algorithmia.
  
<a href="https://github.com/algorithmiaio/githubactions-modeldeployment-deprecated/tree/master/jenkins_deploy_algorithmia" class="btn btn-default btn-primary"><i class="fa fa-github" aria-hidden="true"></i> TRY IT OUT: Jenkins for Algorithm Serving Repo</a>

## GitHub Actions

### Automating Deployments From Your Model Serving Repository

If your algorithm is backed by a GitHub repository, you can use our [CI/CD GitHub Action](https://github.com/marketplace/actions/algorithmia-ci-cd) to test and deploy your algorithms. When attached as a workflow for an algorithm, this can automatically deploy new versions when the provided tests pass.

Below is an example workflow configuration we recommend you use to take advantage of our CI/CD integration.

```
# This is an example using the Algorithmia CI action.

name: CI

# Controls when the action will run. Triggers the workflow on push or pull request.
# In this instance we're triggering this workflow whenever a push to the main branch is performed.
on:
  push:
    branches: [main]

jobs:
  # This workflow only contains a single job, but if you'd like you can split this processing across multiple jobs.
  algorithmia-ci:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout
      uses: actions/checkout@v2.0.0
      with:
        ref: ${{github.sha}}
        path: algorithm
    - name: Algorithmia CI
      uses: algorithmiaio/algorithmia-ci-action@v1.2.4
      with:
        # Your master Algorithmia API key.
        api_key: ${{ secrets.mgmt_api_key }}
        # The API address of the Algorithmia Cluster to which you wish to connect.
        api_address: https://api.algorithmia.com
        # Identifier to describe how to promote this release ('major', 'minor', 'revision').
        version_schema: revision
        # The path variable you defined in the actions/checkout action triggered before this one.
        path: algorithm
```

With this example configuration in your algorithm repository, the next time you push a commit to your repository's `main` branch, GitHub will trigger the defined workflow jobs. When all your job steps are executed successfully, your algorithm will be published on Algorithmia with a new version, based on the `version_schema` you define in the configuration file.

You can check out our repository for a [full working example](https://github.com/algorithmiaio/algorithmia_ci) and start using this in your own CI/CD workflows.

For more details on the configuration and capabilities of our GitHub Action, check out our detailed documentation on the GitHub Actions marketplace.
<a href="https://github.com/marketplace/actions/algorithmia-ci-cd" class="btn btn-default btn-primary"><i class="fa fa-github" aria-hidden="true"></i> TRY IT OUT: GitHub Actions for Algorithm Serving Repo</a>


### Automating Deployments From Your Model Development Repository

If you're using a Jupyter Notebook to develop your ML model or if you're checking your saved model artifact into your repository, you can check out our [Deploy to Algorithmia Github Action](https://github.com/marketplace/actions/deploy-to-algorithmia). With this action integrated in your model development repository, you can automate deploying your model artifact and your serving (algorithm) code to Algorithmia.

Depending on your model development preference:
  - If you're developing your ML model in a Jupyter Notebook, you can configure the workflow with the notebook path to execute. In this case, the workflow will run the notebook on the CI worker machine's from-scratch environment. 
  - If you have an already saved model checked in to your repository, you can configure the workflow with the existing model file path.
  
In both scenarios, the workflow will get the model file and upload it to your configured data collection on Algorithmia. 

Below is an example workflow configuration to achieve this for an example repository with a Jupyter Notebook training an XGBoost model. 

```
name: Deploy to Algorithmia

on:
  push:
    branches:
      - main

jobs:
  algorithmia-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Main Repo
        uses: actions/checkout@v2.0.0
        with:
          ref: ${{github.sha}}
      - name: Deploy Model to Algorithmia
        uses: algorithmiaio/algorithmia-modeldeployment-action@1.1.0
        env:
          HEAD_COMMIT_MSG: ${{ github.event.head_commit.message }}
        with:
          algorithmia_api_key: ${{ secrets.ALGORITHMIA_API_KEY }}
          algorithmia_username: ${{ secrets.ALGORITHMIA_USERNAME }}
          algorithmia_email: ${{ secrets.ALGORITHMIA_EMAIL }}
          algorithmia_algoname:  xgboost_automated
          algorithmia_password: ${{ secrets.ALGORITHMIA_PASSWORD }}
          git_host: git.algorithmia.com
```

To start using this in your own model development repositories, we have two fully working examples that use this Github Action to continuously deploy:

- [to an Algorithmia algorithm backed by Algorithmia](https://github.com/algorithmiaio/githubactions-modeldeployment-demo-algorithmiaalgo)
- [to an Algorithmia algorithm backed by Github](https://github.com/algorithmiaio/githubactions-modeldeployment-demo-githubalgo)

For more details on the configuration and capabilities of our GitHub Action, check out our detailed documentation on the GitHub Actions marketplace.
<a href="https://github.com/algorithmiaio/algorithmia-modeldeployment-action" class="btn btn-default btn-primary"><i class="fa fa-github" aria-hidden="true"></i> TRY IT OUT: GitHub Actions for Model Training Repo</a>




## GitLab CI/CD

To deploy your algorithm files to Algorithmia every time you push to your GitLab repository, make sure you have the following configured. 

### Algorithm Files
Similar to your default algorithm-repository template, make sure your `src` folder and `requirements.txt` are in the root level of the repository. 

### Gitlab CI file and Algorithmia CI scripts
To get started with your pipelines, make sure you have the following at the root level of your repository:
- `.gitlab-ci.yml` file 
- `ci_entrypoint.py` file, as the entrypoint to your Algorithmia Deployment CI jobs
- `algorithmia_ci` module directory, containing the scripts for deploying to Algorithmia and publishing a new version after runnning your defined tests.

### Gitlab CI Environment Variables
Go to your repository's Settings -> CI/CD page and expand the Variables section. Add the following CI/CD variables so that your pipeline job scripts can access these values in a secured manner.
- `ALGO_NAME`: Algorithm name 
- `ALGO_USER`: Algorithmia username
- `ALGO_REPO_URL`: Repository host of the algorithm. Example: git.algorithmia.com
- `ALGO_PUBLISH_SCHEMA`: Semantic versioning of choice. Can be "major", "minor", or "revision"
- `API_ADDRESS`: The Algorithmia API cluster address to connect. Example: https://api.algorithmia.com
- `API_KEY`: Algorithmia API key that has access to the configured algorithm and management capable. More information about Algorithmia API keys can be found [here](https://algorithmia.com/developers/platform/customizing-api-keys).


### Test Case Files
If you want to run tests before publishing a new version of your algorithm, you should add a new file called `TEST_CASES.json` at the root level of your repository. If you do not provide this file, then the CI/CD pipeline will omit the testing step.
The required schema of this json file is shown below:

#### Case Schema
Your test cases should follow the following json schema
```
[
 { 
    "case_name": String,
    "input": Any,
    "expected_output": Any,
    "type": String,
    "tree": List
  },
  ...
]
```

- `input` (required) - the raw input that will be passed into the algorithm. Typically this will be a JSON dictionary, JSON list, or a primitive type (like a string).
- `expected_output` (required) - What we are comparing against the result of your algorithm, which can be scoped in conjunction with setting `tree`. 
For types `GREATER_OR_EQUAL` and `LESS_OR_EQUAL` this must be a number value. For types `NO_EXCEPTION` and `EXCEPTION` this field is optional.
- `type` (optional) - defines the type of matching that can be done, options include `EXACT_MATCH`, `GREATER_OR_EQUAL`, `LESS_OR_EQUAL`, `NO_EXCEPTION` and `EXCEPTION`. Defaults to `EXACT_MATCH`
- `tree` (optional) - A list defining the json keys we should traverse in order to find the value you wish to compare against with `expected_output`.

#### Example Case
```json
[
    {
      "case_name": "image_classifier_accuracy",
      "input": {"image_data":  [...]},
      "expected_output": 0.7,
      "type": "GREATER_OR_EQUAL",
      "tree": ["accuracy"],
    }
]
```

You can check out our repository for a [full working example](https://gitlab.com/algorithmiahq/gitlab-algo-with-cicd) and start using this in your own CI/CD pipelines.
