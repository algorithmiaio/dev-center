---
categories: algorithm-development
excerpt: "Matrix of supported algorithm runtime environments"
layout: article
permalink: /algorithm-development/environments/
redirect_from:
- /model-deployment/matrix/
- /model-deployment/environments/
- /environments/
show_related: true
tags: [algo-model-guide]
title:  "Algorithm Environments"
---

- [Overview](#overview)
- [Why use a predefined environment?](#why-use-a-predefined-environment)
- [View currently available environments](#view-currently-available-environments)
  - [Environments available on all clusters](#environments-available-on-all-clusters)
  - [Environments available by request](#environments-available-by-request)
- [List languages and environments and download algorithm template files](#list-languages-and-environments-and-download-algorithm-template-files)
  - [Overview of steps](#overview-of-steps)
  - [Option A: using the algo CLI](#option-a-using-the-algo-cli)
    - [Upgrading the algo CLI](#upgrading-the-algo-cli)
    - [Listing algorithm languages (CLI)](#listing-algorithm-languages-cli)
    - [Listing algorithm environments (CLI)](#listing-algorithm-environments-cli)
    - [Downloading template files (CLI)](#downloading-template-files-cli)
  - [Option B: Using REST requests directly](#option-b-using-rest-requests-directly)
    - [Listing algorithm languages (REST)](#listing-algorithm-languages-rest)
    - [Listing algorithm environments (REST)](#listing-algorithm-environments-rest)
    - [Downloading template files (REST)](#downloading-template-files-rest)

## Overview

Algorithmia supports seven languages for writing algorithms: Python, R, Java, Scala, Ruby, Rust, and JavaScript. When you create an algorithm, you must select one of these languages.

For several of these languages, we've also created predefined, customized algorithm runtime environments to support various ML frameworks and hardware requirements. These environments are available to both our Enterprise and Teams customers.

An algorithm environment is similar to a virtual environment that you might create outside of Algorithmia, where you might choose a specific language version and optionally install specific library packages beyond whatever comes packaged standard in your language's base library.

## Why use a predefined environment?

In an Algorithmia algorithm, you have the ability to specify external library dependencies using whatever syntax is standard for your language (e.g., in a `requirements.txt` file for Python). Therefore, you can technically choose a generic base algorithm environment and then build a more customized ML environment on top of that. For example, you can choose a generic Python 3.7 environment and then require PyTorch as a dependency if you're using that specific framework.

However, we recommend not doing this, and instead choosing the appropriate predefined framework-specific algorithm environment from the matrix below, for the following reasons:

1. Our predefined environments have been optimized for fast algorithm builds at compile time, and for fast algorithm loads when algorithms are called cold. This enhances the performance of algorithms you create using custom environments relative to the approach of using a vanilla base environment and specifying your own dependencies.

2. Many of our predefined environments have built-in CUDA/GPU support and access to ML-optimized hardware such as Nvidia drivers. If your algorithm requires such specialized hardware, it's essential to use the correct predefined runtime environment, so that it's configured correctly from the ground up to support your model.

3. Predefined environments come with template code to make getting started easier.

The algorithm runtime environment you select should match up as closely as possible with your code dependencies, in order to provide the most streamlined development experience and the best algorithm performance. With the base environment selected, you can then add any other required dependencies in whichever way is standard for your language.

## View currently available environments

Below is a list of available environments that we've created and that can be made available to you to upon request. Once we provide you with the requested environment, you'll be able to [install it on your cluster](/developers/administration/admin-panel/algorithm-environments/#installing-environments) so that your users can select it when they create new algorithms. For steps on how to list the environments available on your cluster for each particular language, see [List languages and environments and download algorithm template files](#list-languages-and-environments-and-download-algorithm-template-files).

### Environments available on all clusters

The matrix below lists the algorithm environments that are currently available on every Algorithmia cluster by default. To create an algorithm with a predefined environment through the API, see [Using a Predefined Language Environment](/developing-python-algorithms-in-a-local-ide/698050#predefined-environment).

|Environment|Language|Framework|Pinned Dependencies|CUDA/cuDNN|Base Image|
|--- |--- |--- |--- |--- |--- |
|python37|Python 3.7|--|--|--|algorithmiahq/ubuntu:18.04|
|python37-gpu|Python 3.7|--|--|9.0 / 7|nvidia/cuda:9.0-cudnn7-devel-ubuntu16.04|
|pytorch-1.4.x|Python 3.7.1|PyTorch 1.4|numpy==1.16.0|10.1 / 7|nvidia/cuda:10.1-cudnn7-devel-ubuntu16.04|
|pytorch-1.5.x|Python 3.7.1|PyTorch 1.5|numpy==1.16.0|10.2 / 7|nvidia/cuda:10.2-cudnn7-devel-ubuntu18.04|
|pytorch-1.6.x|Python 3.7.1|PyTorch 1.6|numpy==1.16.0|10.2 / 7|nvidia/cuda:10.2-cudnn7-devel-ubuntu18.04|
|spacy-2.0.18|Python 3.7.1|Spacy 2.0.18|--|--|ubuntu:16.04|
|tensorflow-gpu-1.14|Python 3.7|Tensorflow 1.14|keras==2.1.4|10.0 / 7|nvidia/cuda:10.0-cudnn7-devel-ubuntu16.04|
|tensorflow-gpu-2.1|Python 3.7|Tensorflow 2.1|keras==2.3.1|10.1 / 7|nvidia/cuda:10.1-cudnn7-devel-ubuntu16.04|
|tensorflow-gpu-2.3|Python 3.7|Tensorflow 2.3|--|10.1 / 7|nvidia/cuda:10.1-cudnn7-devel-ubuntu18.04|
|selenium3.141.x-python|Python 3.7.1|Selenium 3.141.0|phantomjs2.1.1, chromedriver2.41, geckodriver==0.26.0|--|ubuntu:16.04|
|python27|Python 2.7.15|--|--|--|ubuntu:16.04|
|python27-cuda90-cudnn7|Python 2.7.15|--|--|9.0 / 7|nvidia/cuda:9.0-cudnn7-devel-ubuntu16.04|

### Environments available by request

We're always adding new optimized runtime environments to support our customers using the latest language and framework versions. Therefore, in addition to those listed above, we also have the following environments available to our Enterprise customers. **If there's a specific environment listed below that you'd like to use, or if you need a custom environment that isn't available, please ask your customer success manager** so that we can get it built and installed on your cluster.

|Environment|Language|Framework|Pinned Dependencies|CUDA/cuDNN|Base Image|
|--- |--- |--- |--- |--- |--- |
|allennlp-0.8|Python 3.7|AllenNLP 0.8|spacy2.0.18, pytorch1.0.0||ubuntu:16.04|
|apex-0.1|Python 3.7|Apex 0.1|pytorch==1.3|10.1 / 7|nvidia/cuda:10.1-cudnn7-devel-ubuntu16.04|
|mxnet-cu90-1.3.1|Python 3.7|MXNet 1.3.1|--|9.0 / 7|nvidia/cuda:9.0-cudnn7-devel-ubuntu16.04|
|pytorch-1.0.0|Python 3.7|PyTorch 1.0.0|--|9.0 / 7|nvidia/cuda:9.0-cudnn7-devel-ubuntu16.04|
|tensorrt-6.0-cuda10.0|Python 3.7|TensorRT 6.0.x||10.0 / 7|nvidia/cuda:10.0-cudnn7-devel-ubuntu16.04|
|python36|Python 3.6|--|--|--|algorithmiahq/ubuntu:16.04|
|python36-gpu|Python 3.6|--|--|9.0 / 7|nvidia/cuda:9.0-cudnn7-devel-ubuntu16.04|
|tensorflow-gpu-1.12|Python 3.6|TensorFlow 1.12|keras==2.1.4|9.0 / 7|nvidia/cuda:9.0-cudnn7-devel-ubuntu16.04|
|r36|R 3.6|--|--|--|algorithmiahq/ubuntu:16.04|
|scala-2-sbt-1.3.3|Scala 2.x|--|--|--|algorithmiahq/ubuntu:16.04|
|java11|Java 11.0|--|--|--|algorithmiahq/ubuntu:20.04|


## List languages and environments and download algorithm template files

Algorithm template files provide a unified starting point for developing algorithms using a specific algorithm language and environment. This page provides instructions for how to download template files for a specific language and environment using both the algo CLI and REST requests directly. The algo CLI is recommended if you're working at the command line, while we recommend using REST requests directly for automating your workflow.

### Overview of steps

Template files are specific to each algorithm environment, and algorithm environments are specific to each algorithm language. Therefore, to download template files, you'll first need to know what languages and environments are available on your cluster. The general steps are:

1.  List the available algorithm languages on your cluster.
2.  List the available environments on your cluster for a language chosen from (1).
3.  Download the template files for an environment chosen from (2).

### Option A: using the algo CLI

#### Upgrading the algo CLI

To use the CLI functionality below, you'll need algo CLI version 1.9.0 or greater. To see what version you currently have installed, you can run `pip list | grep algorithmia`. If you have `algorithmia<1.9.0`, update by running `pip install algorithmia --upgrade`.

#### Listing algorithm languages (CLI)

To list the languages available on your cluster, run the command below, which will list the details for each language.

```bash
$ algo languages
Name                      Display Name                      
anaconda3                 Conda (Environments) - beta        
csharp-dotnet-core2       C# .NET Core 2.x+ (Environments)   
java11                    Java OpenJDK 11.0 (Environments)   
python2                   Python 2.x (Environments)          
python3                   Python 3.x (Environments)          
r36                       R 3.6.x (Environments)             
scala-2                   Scala 2.x & sbt 1.3.x (Environments)
```

#### Listing algorithm environments (CLI)

Environment IDs are unique on every cluster, so you'll need to request the list of environments for your language of choice in order to get the ID value associated with a specific environment. To list environments, run `algo environment ALGO_LANG`, where `ALGO_LANG` is the name of your language of interest from the list [above](#listing-algorithm-languages). This will print out metadata for the available environments. For example, to list Python environments, you can use:

```bash
$ algo environment python3
[
    ...,
    {
        "id": "fd980f4f-1f1c-4b2f-a128-d60b40c6567a",
        "environment_specification_id": "36fd467e-fbfe-4ea6-aa66-df3f403b7132",
        "display_name": "Python 3.8 + TensorFlow GPU 2.3",
        "description": "Python 3.8 installation with CUDA 10.1 and TensorFlow 2.3 installed",
        "created_at": "2021-06-03T19:46:29.111",
        "language": {
            "name": "python3",
            "display_name": "Python 3.x (Environments)",
            "configuration": "{\n    \"display_name\": \"Python 3.x (Environments)\",\n    \"req_files\": \[\n        \"requirements.txt\"\n    \],\n    \"artifacts\": \[\n        {\"source\":\"/home/algo/.local\", \"destination\":\"/home/algo/.local/\"},\n        {\"source\":\"/opt/algorithm\", \"destination\":\"/opt/algorithm/\"}\n    \]\n}\n"
        },
        "machine_type": "GPU"
    },
    {
        "id": "ea8f42fe-ea59-4eab-920a-09176729b4fa",
        "environment_specification_id": "c6d34b46-0851-455d-97f5-ea8fd8b70552",
        "display_name": "Python 3.7 + MXNet 1.3.1",
        "description": "Python 3.7 installation with CUDA 9.0 and MXNet 1.3.1 installed",
        "created_at": "2021-06-03T18:03:14.704",
        "language": {
            "name": "python3",
            "display_name": "Python 3.x (Environments)",
            "configuration": "{\n    \"display_name\": \"Python 3.x (Environments)\",\n    \"req_files\": \[\n        \"requirements.txt\"\n    \],\n    \"artifacts\": \[\n        {\"source\":\"/home/algo/.local\", \"destination\":\"/home/algo/.local/\"},\n        {\"source\":\"/opt/algorithm\", \"destination\":\"/opt/algorithm/\"}\n    \]\n}\n"
        },
        "machine_type": "GPU"
    },
    ...
]
```

Depending on your cluster, the above command might return a very long list of environments, many of which won't be useful to you. We recommend filtering the list returned; for example, to only display environments with TensorFlow 2.x preinstalled, you can run:

```bash
$ algo environment python3 | grep -iC4 -e "tensorflow 2"
```

#### Downloading template files (CLI)

To download template files for an environment from above, use the following command, replacing `ENV_SPEC_ID` with an environment's `environment_specification_id` value from [above](#listing-algorithm-environments), and `DEST` with the local destination (directory path) to which to save the files (specify a dot "`.`" to save the template files to the current directory). The template files will be saved to the local directory specified and can now be checked in to source control for algorithm development.

```bash
$ algo template ENV_SPEC_ID DEST
```

### Option B: Using REST requests directly

To list languages and environments programmatically, you can use REST requests and then parse the JSON directly.

#### Listing algorithm languages (REST)

To list the languages available on your cluster, run the command below, substituting `AUTH_TOKEN` with an authentication token for any account on the cluster. Either specify `Simple` and provide an [API key](https://algorithmia.com/developers/platform/customizing-api-keys) or specify `Bearer` and provide a [JSON Web Token (JWT)](https://algorithmia.com/developers/platform/jwt-authentication). For example, in the code below, for `-H 'Authorization: Simple|Bearer AUTH_TOKEN'` you'd use one or the other of the following commands, replacing the placeholders as appropriate:

*   *   `'-H Authorization: Simple ADMIN_API_KEY'`
    *   `'-H Authorization: Bearer JSON_WEB_TOKEN'`

**REST request**

```bash
$ curl https://CLUSTER_DOMAIN/v1/algorithm-environments/edge/languages \
    -H 'Authorization: Simple|Bearer AUTH_TOKEN' \
    -H 'Content-type: application/json'
```

**REST response**

```json
[
   {
      "name":"anaconda3",
      "display_name":"Conda (Environments) - beta",
      "configuration":"{\n    \"display_name\": \"Conda (Environments) - beta\",\n    \"req_files\": \[\n        \"environment.yml\"\n    \],\n    \"artifacts\": \[\n        {\"source\":\"/home/algo/.cache\", \"destination\":\"/home/algo/.cache/\"},\n        {\"source\":\"/home/algo/anaconda_environment\", \"destination\": \"/home/algo/anaconda_environment/\"},\n        {\"source\":\"/opt/algorithm\", \"destination\":\"/opt/algorithm/\"}\n    \]\n}\n"
   },
   {
      "name":"csharp-dotnet-core2",
      "display_name":"C# .NET Core 2.x+ (Environments)",
      "configuration":"{\n    \"display_name\": \"C# .NET Core 2.x+ (Environments)\",\n    \"artifacts\": \[\n        {\"source\":\"/opt/algorithm/bin/Release/\*/\*\", \"destination\":\"/opt/algorithm/\"},\n        {\"source\":\"/opt/algorithm/resources\", \"destination\":\"/opt/algorithm/resources/\"},\n        {\"source\":\"/home/algo/.nuget\", \"destination\":\"/home/algo/.nuget/\"}\n    \]\n}\n"
   },
   {
      "name":"java11",
      "display_name":"Java OpenJDK 11.0 (Environments)",
      "configuration":"{\n    \"display_name\": \"Java OpenJDK 11.0 (Environments)\",\n    \"artifacts\": \[\n        {\"source\":\"/opt/algorithm/target/\*.jar\", \"destination\":\"/opt/algorithm/target/algorithm.jar\"},\n        {\"source\":\"/opt/algorithm/target/lib\", \"destination\":\"/opt/algorithm/target/lib/\"}\n    \]\n}\n"
   },
   {
      "name":"python2",
      "display_name":"Python 2.x (Environments)",
      "configuration":"{\n    \"display_name\": \"Python 2.x (Environments)\",\n    \"req_files\": \[\n        \"requirements.txt\"\n    \],\n    \"artifacts\": \[\n        {\"source\":\"/home/algo/.local\", \"destination\":\"/home/algo/.local/\"},\n        {\"source\":\"/opt/algorithm\", \"destination\":\"/opt/algorithm/\"}\n    \]\n}\n"
   },
   {
      "name":"python3",
      "display_name":"Python 3.x (Environments)",
      "configuration":"{\n    \"display_name\": \"Python 3.x (Environments)\",\n    \"req_files\": \[\n        \"requirements.txt\"\n    \],\n    \"artifacts\": \[\n        {\"source\":\"/home/algo/.local\", \"destination\":\"/home/algo/.local/\"},\n        {\"source\":\"/opt/algorithm\", \"destination\":\"/opt/algorithm/\"}\n    \]\n}\n"
   },
   {
      "name":"r36",
      "display_name":"R 3.6.x (Environments)",
      "configuration":"{\n    \"display_name\": \"R 3.6.x (Environments)\",\n      \"req_files\": \[\n        \"packages.txt\"\n    \],\n    \"artifacts\": \[\n      {\"source\":\"/opt/algorithm\", \"destination\":\"/opt/algorithm/\"},\n      {\"source\":\"/usr/local/lib/R/site-library\", \"destination\":\"/usr/local/lib/R/site-library/\"}\n    \]\n}\n\n"
   },
   {
      "name":"scala-2",
      "display_name":"Scala 2.x & sbt 1.3.x (Environments)",
      "configuration":"{\n    \"display_name\": \"Scala 2.x & sbt 1.3.x (Environments)\",\n    \"artifacts\": \[\n      {\"source\":\"/opt/algorithm/target/universal/stage\", \"destination\":\"/opt/algorithm/stage/\"}\n    \]\n}\n\n"
   }
]
```

#### Listing algorithm environments (REST)

Environment IDs are unique on every cluster, so you'll need to request the list of environments for your language of choice in order to get the ID value associated with a specific environment. To list environments, run the command below, substituting `ALGO_LANG` with a language's `name` value from the output of the command [above](#listing-algorithm-languages-rest). This will print out metadata for the available environments. The response below shows an abridged listing of `python3` environments.

**REST request**

```bash
$ curl -X GET https://CLUSTER_DOMAIN/v1/algorithm-environments/edge/languages/ALGO_LANG/environments \
    -H 'Authorization: Simple|Bearer AUTH_TOKEN' \
    -H 'Content-type: application/json'
```

**REST response**

```json
[
    ...,
    {
        "id": "fd980f4f-1f1c-4b2f-a128-d60b40c6567a",
        "environment_specification_id": "36fd467e-fbfe-4ea6-aa66-df3f403b7132",
        "display_name": "Python 3.8 + TensorFlow GPU 2.3",
        "description": "Python 3.8 installation with CUDA 10.1 and TensorFlow 2.3 installed",
        "created_at": "2021-06-03T19:46:29.111",
        "language": {
            "name": "python3",
            "display_name": "Python 3.x (Environments)",
            "configuration": "{\n    \"display_name\": \"Python 3.x (Environments)\",\n    \"req_files\": \[\n        \"requirements.txt\"\n    \],\n    \"artifacts\": \[\n        {\"source\":\"/home/algo/.local\", \"destination\":\"/home/algo/.local/\"},\n        {\"source\":\"/opt/algorithm\", \"destination\":\"/opt/algorithm/\"}\n    \]\n}\n"
        },
        "machine_type": "GPU"
    },
    {
        "id": "ea8f42fe-ea59-4eab-920a-09176729b4fa",
        "environment_specification_id": "c6d34b46-0851-455d-97f5-ea8fd8b70552",
        "display_name": "Python 3.7 + MXNet 1.3.1",
        "description": "Python 3.7 installation with CUDA 9.0 and MXNet 1.3.1 installed",
        "created_at": "2021-06-03T18:03:14.704",
        "language": {
            "name": "python3",
            "display_name": "Python 3.x (Environments)",
            "configuration": "{\n    \"display_name\": \"Python 3.x (Environments)\",\n    \"req_files\": \[\n        \"requirements.txt\"\n    \],\n    \"artifacts\": \[\n        {\"source\":\"/home/algo/.local\", \"destination\":\"/home/algo/.local/\"},\n        {\"source\":\"/opt/algorithm\", \"destination\":\"/opt/algorithm/\"}\n    \]\n}\n"
        },
        "machine_type": "GPU"
    },
    ...
]
```

Depending on your cluster, the above command might return a very long list of environments, many of which won't be useful to you. We recommend filtering the list returned; for example, to only display environments with TensorFlow 2.x preinstalled, you can pipe the output from above as follows:

```bash
$ curl ... | grep -iC4 -e "tensorflow 2"
```

#### Downloading template files (REST)

To download template files, you can use the command below, substituting an `environment_specification_id` for `ENV_SPEC_ID`. Note that no `Authorization` request header is required for this endpoint. 

**REST request**

```bash
$ curl -X GET https://CLUSTER_DOMAIN/v1/algorithm-environments/edge/environment-specifications/ENV_SPEC_ID/template \
    -o 'template.tar'
```

Now, unzip the downloaded template files into a target directory `DEST` (you must first create this directory if it doesn't already exist). The files can now be checked in to source control for algorithm development.

```bash
$ tar -xvf template.tar -C DEST && rm -f template.tar
```
