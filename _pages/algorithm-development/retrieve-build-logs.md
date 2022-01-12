---
categories: algorithm-development
layout: article
title: Retrieve Algorithm Build-Time Logs
---

You can query Algorithmia's API to retrieve build logs for a given algorithm. We offer the following two routes for retrieving build logs; you may decide that one is more convenient based on your workflow or use case. The `/builds` endpoint can be used to retrieve information for any algorithm build, while the `/versions` endpoint will only list algorithm builds that've been published.

*   `/v1/algorithms/ALGO_OWNER/ALGO_NAME/builds/BUILD_ID`
*   `/v1/algorithms/ALGO_OWNER/ALGO_NAME/versions/ALGO_VERSION_HASH`

Note that in the code samples below, `AUTH_TOKEN` represents either a standard (non-admin) API key, or a JSON Web Token (JWT), associated with the account that owns the algorithm of interest or that's a member of the organization that owns the algorithm.

Retrieving build logs from the `/builds` endpoint
-------------------------------------------------

To retrieve the logs for a specific build of an algorithm, you'll first need to know the [algorithm build UUID](/developers/glossary#algorithm-build-uuid). For a given algorithm, you can list all of the algorithm builds with the following request.

**REST request**

```bash
curl https://CLUSTER_DOMAIN/v1/algorithms/ALGO_OWNER/ALGO_NAME/builds \
   -H 'Authorization: Simple AUTH_TOKEN' \
   -H 'Content-Type: application/json'
```

**REST response**

```json
{
  "marker": null,
  "next_link": null,
  "results": [
    {
      "build_id": "d01d403d-a853-4831-9fff-9783a7b7e956",
      "status": "succeeded",
      "commit_sha": "8e36fbf53f57fa1f1b681b1f1ab178b6f989976f",
      "started_at": "2021-07-29T21:12:56.442Z",
      "finished_at": "2021-07-29T21:13:44.251Z"
    },
    {
      "build_id": "8a366318-3ee9-4a0e-8fc9-7e1af60c67bf",
      "status": "succeeded",
      "commit_sha": "0b1e586f4db06756775795bcd4b42ad4352b652e",
      "started_at": "2021-07-28T18:11:42.749Z",
      "finished_at": "2021-07-28T18:12:30.946Z",
      "version_info": {
        "semantic_version": "0.1.0"
      }
    }
  ]
}
```

The `build_id` value in the response is the build UUID. You can use any `build_id` value to replace the value of `BUILD_ID` in the following request to retrieve the logs for a specific algorithm build.

**REST request**

```bash
curl https://CLUSTER_DOMAIN/v1/algorithms/ALGO_OWNER/ALGO_NAME/builds/BUILD_ID/logs \
   -H 'Authorization: Simple AUTH_TOKEN' \
   -H 'Content-Type: application/json'
```

**REST response**

```json
{
  "logs": "Sending build context to Docker daemon  1.039MB\n\nStep 1/21 : FROM hub.CLUSTER_DOMAIN/algorithmiahq/langpack-builder:d8f3110a-ad46-4008-a099-a33824522d09 as builder\nd8f3110a-ad46-4008-a099-a33824522d09: Pulling from algorithmiahq/langpack-builder\n83ee3a23efb7: Already exists\n...\nDeleted: sha256:b270ba38027a1071cd8077373357e220d8bf55c2199c1cce574a76a411b11e73\nDeleted: sha256:866ca1d71d949043729ec119130ac3e1785fae8ae3a6c1b3193ddfbc9be7a0dc"
}
```

Note that the log output shown above has been shortened for this documentation. The response will contain the entire log output from the algorithm build process, including any errors that may have been encountered.

## Retrieving build logs from the `/versions` endpoint

To retrieve the logs for a specific build of a published algorithm, you'll first need to know its [algorithm version hash](/developers/glossary#algorithm-version-hash). In Algorithmia's browser UI, the [algorithm version hash](/developers/glossary#algorithm-version-hash) information is available under an algorithm profile's **Builds** tab. You can also list all of the algorithm's published versions with the following request.

**REST request**

```bash
$ curl https://CLUSTER_DOMAIN/v1/algorithms/ALGO_OWNER/ALGO_NAME/versions \
    -H 'Authorization: Simple AUTH_TOKEN' \
    -H 'Content-Type: application/json'
```
**REST response**

```json
{
  "marker": null,
  "next_link": null,
  "results": [
    {
      "id": "4a1b7a2a-4183-4939-a292-26e677aeba73",
      "name": "ALGO_NAME",
      "details": {
        "label": "ALGO_NAME",
        "tagline": ""
      },
      "settings": {
        "algorithm_callability": "private",
        "source_visibility": "closed",
        "package_set": "python39",
        "license": "apl",
        "network_access": "full",
        "pipeline_enabled": true,
        "insights_enabled": false,
        "algorithm_environment": "d8f3110a-ad46-4008-a099-a33824522d09"
      },
      "version_info": {
        "git_hash": "8e36fbf53f57fa1f1b681b1f1ab178b6f989976f",
        "sample_input": "\"\"",
        "sample_output": "Exception encountered while running sample input",
        "version_uuid": "ec329139-fca8-4f07-b470-f76521831e27"
      },
      ....
    },
    ...
  ]
}
```

You can use a version's `git_hash` value from the response to replace `ALGO_VERSION_HASH` in the request below to retrieve the logs. The logs will be returned in the `compilation.output` property of the response body, as shown below.

**REST request**

```bash
$ curl https://CLUSTER_DOMAIN/v1/algorithms/ALGO_OWNER/ALGO_NAME/versions/ALGO_VERSION_HASH \
    -H 'Authorization: Simple AUTH_TOKEN' \
    -H 'Content-Type: application/json'
```

**REST response**

```json
{
  "id": "4a1b7a2a-4183-4939-a292-26e677aeba73",
  "name": "ALGO_NAME",
  "details": {
    "label": "ALGO_NAME",
    "tagline": ""
  },
  ...,
  "compilation": {
    "successful": true,
    "output": "Sending build context to Docker daemon  1.039MB\n\nStep 1/21 : FROM hub.CLUSTER_DOMAIN/algorithmiahq/langpack-builder:d8f3110a-ad46-4008-a099-a33824522d09 as builder\nd8f3110a-ad46-4008-a099-a33824522d09: Pulling from algorithmiahq/langpack-builder\n83ee3a23efb7: Already exists\n...\nDeleted: sha256:b270ba38027a1071cd8077373357e220d8bf55c2199c1cce574a76a411b11e73\nDeleted: sha256:866ca1d71d949043729ec119130ac3e1785fae8ae3a6c1b3193ddfbc9be7a0dc"
  },
  "resource_type": "algorithm"
}
```

Note that the log output shown above has been shortened for this documentation. The response will contain the entire log output from the algorithm build process, including any errors that may have been encountered.