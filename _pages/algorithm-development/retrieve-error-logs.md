---
categories: algorithm-development
layout: article
title: Retrieve Algorithm Run-Time Error Logs
---

You can query Algorithmia's API to retrieve error-log stack traces for a given algorithm. The response will contain errors from the past 7 days, constrained to 200 algorithm executions. In order to support a variety of automated workflow configurations, we provide two separate ways to identify an algorithm on your cluster in order to request the logs.

*   `/v1/algorithms/ALGO_OWNER/ALGO_NAME/errors`
*   `/v1/algorithms/ALGO_ID/errors`

Note that in the code samples below, `AUTH_TOKEN` represents either:

*   A standard (non-admin) API key with [Management Access](/developers/algorithm-development/algorithm-management) turned on, associated with the account that owns the algorithm or that's a member of the organization that owns the algorithm
*   A JSON Web Token (JWT) of a user who's a member of the org that owns the algorithm

## Retrieving error logs using algorithm owner and algorithm name

To retrieve errors using this route, you can use the command below.

**REST request**

```bash
$ curl https://CLUSTER_DOMAIN/v1/algorithms/ALGO_OWNER/ALGO_NAME/errors \
    -H 'Authorization: Simple AUTH_TOKEN' \
    -H 'Content-Type: application/json'
```

**REST response**

```json
[
  {
    "created_at": 1627571664000,
    "request_id": "req-ce624eee-28e2-4cef-87ee-c22c797079f6",
    "username": "ALGO_OWNER",
    "algoname": "ALGO_NAME",
    "algoversion": "0.1.0",
    "input": "A payload",
    "error": "error:\nAll I do is throw an error\nstacktrace:\nSome(Traceback (most recent call last):\n  File \"/usr/local/bin/algorithmia-pipe\", line 40, in get_response\n    result = call_algorithm(request, algorithm)\n  File \"/usr/local/bin/algorithmia-pipe\", line 90, in call_algorithm\n    return algorithm.apply(data)\n  File \"./src/testError.py\", line 6, in apply\n    raise Exception(\"All I do is throw an error\")\nException: All I do is throw an error)",
    "error_type": "AlgorithmError",
    "billable_to": "ALGO_OWNER",
    "worker": "172.41.7.115"
  },
  ...
]
```

## Retrieving error logs using algorithm UUID

To use this endpoint you must first know the algorithm's UUID, which can be retrieved through a `GET` request to the `algorithms` endpoint, specifying the `ALGO_OWNER` and `ALGO_NAME` as shown in the section above. We provide this route to support workflows in which the values for algorithm owner and algorithm name are unknown and only the algorithm UUID is known. For the purpose of demonstration, however, in this code we're retrieving the UUID using the algorithm name and owner.

**REST request**

```bash
$ curl https://CLUSTER_DOMAIN/v1/algorithms/ALGO_OWNER/ALGO_NAME \
    -H 'Authorization: Simple AUTH_TOKEN' \
    -H 'Content-Type: application/json'
```

**REST response**

```json
{
 "id": "4a1b7a2a-4183-4939-a292-26e677aeba73",  "name": "ALGO_NAME",
  "details": {
    "label": "ALGO_NAME",
    "tagline": ""
  },
  "settings": {
    ...
  },
  "version_info": {
    ...
  },
  ...
}
```

You can use the algorithm's `id` value from the response above to replace `ALGO_ID` in the request below to retrieve the errors.

**REST request**

```bash
$ curl https://CLUSTER_DOMAIN/v1/algorithms/ALGO_ID/errors \
    -H 'Authorization: Simple AUTH_TOKEN' \
    -H 'Content-Type: application/json'
```

**REST response**

```json
[
  {
    "created_at": 1627571664000,
    "request_id": "req-ce624eee-28e2-4cef-87ee-c22c797079f6",
    "username": "ALGO_OWNER",
    "algoname": "ALGO_NAME",
    "algoversion": "0.1.0",
    "input": "A payload",
    "error": "error:\nAll I do is throw an error\nstacktrace:\nSome(Traceback (most recent call last):\n  File \"/usr/local/bin/algorithmia-pipe\", line 40, in get_response\n    result = call_algorithm(request, algorithm)\n  File \"/usr/local/bin/algorithmia-pipe\", line 90, in call_algorithm\n    return algorithm.apply(data)\n  File \"./src/testError.py\", line 6, in apply\n    raise Exception(\"All I do is throw an error\")\nException: All I do is throw an error)",
    "error_type": "AlgorithmError",
    "billable_to": "ALGO_OWNER",
    "worker": "172.41.7.115"
  },
  ...
]
```
