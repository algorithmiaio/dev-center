---
categories: admin-config
layout: article
title: Push algorithm images to external registries
---

This feature is currently in **beta**.
{: .notice-info}

This feature is only available in Algorithmia Enterprise installations.
{: .notice-enterprise}

In order to enable our Algorithmia Enterprise customers to use an enterprise-managed container-scanning infrastructure, we enable you to assign an external registry configuration to an algorithm. This allows you to store the algorithm container image in your enterprise container registry when the algorithm is published, and Algorithmia will then serve calls to that algorithm using that container image stored in your registry.

## Configuring an external registry

An external registry is configured at the cluster level and is then associated with that cluster. In order to configure a new external registry, you'll need the following:

1.  The URL of the external registry, which should look something like `algorithmiainfra.jfrog.io/dockerhub`; this references below as `REGISTRY_URL`
2.  Depending on how the repository is set up, credentials may or may not be required. If required, you'll need to specify:
    1.  A username with **READ** permissions to the registry; this references below as `REGISTRY_USERNAME`
    2.  The password for the account in (2.a); this references below as `REGISTRY_PASSWORD`
3.  An optional label for the registry; this references below as `REGISTRY_NAME`

**REST request**

<div class="syn-code-block">

<pre class="code_snippet">$ curl https://YOUR-SERVER-NAME.com/v1/registries \
    -X POST \
    -H "Authorization: Simple CLUSTER_ADMIN_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "registry_url": "REGISTRY_URL",
      "registry_username": "REGISTRY_USERNAME",
      "registry_password": "REGISTRY_PASSWORD",
      "name": "REGISTRY_NAME"
    }'
</pre>

</div>

This request will return a serialized `Registry` object (without authentication values), including an ID, which references below as `REGISTRY_ID`. This ID will be needed to make any modifications to the registry later, as shown below.

## Modifying an external registry

In order to modify an external registry, you'll need the following:

1.  The URL of the external registry, which should look something like `algorithmiainfra.jfrog.io/dockerhub`; this references below as `REGISTRY_URL`
2.  Depending on how the repository is set up, credentials may or may not be required. If required, you'll need to specify:
    1.  A username with **READ** permissions to the registry; this references below as `REGISTRY_USERNAME`
    2.  The password for the account in (2.a); this references below as `REGISTRY_PASSWORD`
3.  An optional label for the registry; this references below as `REGISTRY_NAME`
4.  The ID of the registry to modify; this references below as `REGISTRY_ID` and can be retrieved through a `GET` request to `/v1/registries` if it wasn't captured from the output of the original [registry-configuration](#h_69449249320481631198612011) `POST` request.

**REST request**

<div class="syn-code-block">

<pre class="code_snippet">$ curl https://YOUR-SERVER-NAME.com/v1/registries/REGISTRY_ID \
    -X PUT \
    -H "Authorization: Simple CLUSTER_ADMIN_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "registry_url": "REGISTRY_URL",
      "registry_username": "REGISTRY_USERNAME",
      "registry_password": "REGISTRY_PASSWORD",
      "name": "REGISTRY_NAME"
    }'
</pre>

</div>

## Pushing an algorithm image to an external registry during compile

<span style="font-family: inherit; font-size: 1em;">During the call to compile, you can push an algorithm to an external registry by providing an optional</span> `registry_push_credentials` object that has **PUSH** permissions to the external registry, along with the `registry_id` to which to push. You'll need the following:

1.  The [algorithm UUID](https://algorithmia.com/developers/glossary#algorithm-uuid); this references below as `ALGO_ID`
2.  A username with **PUSH** permissions to the registry; this references below as `REGISTRY_USERNAME`
3.  The password for the account in (2); this references below as `REGISTRY_PASSWORD`
4.  The ID of the registry to modify; this references below as `REGISTRY_ID` and can be retrieved through a `GET` request to `/v1/registries` if it wasn't captured from the output of the original [registry-configuration](#h_69449249320481631198612011) `POST` request.

If no credentials are supplied, the credentials associated with the registry will be used.

**REST request**

<div class="syn-code-block">

<pre class="code_snippet">$ curl https://YOUR-SERVER-NAME.com/v1/algorithms/ALGO_ID/compile \
    -X POST \
    -H "Authorization: Simple STD_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "registry_push_credentials": {
        "registry_username": "REGISTRY_USERNAME",
        "registry_password": "REGISTRY_PASSWORD",
        "registry_id": "REGISTRY_ID"
      }
}
</pre>

</div>

## Pushing an algorithm image to an external registry during publish

<span style="font-family: inherit; font-size: 1em;">During the call to publish, you can push an algorithm to an external registry by providing an optional</span> `registry_push_credentials` <span style="font-family: inherit; font-size: 1em;">object that has</span> **PUSH** <span style="font-family: inherit; font-size: 1em;">permissions to the external registry, along with the</span> `registry_id` <span style="font-family: inherit; font-size: 1em;">to which to push. You'll need the following:</span>

1.  <span style="font-family: inherit; font-size: 1em;">The algorithm owner and algorithm name, w</span><span style="font-family: inherit; font-size: 1em;">hich reference below</span> <span style="font-family: inherit; font-size: 1em;">as</span> `ALGO_OWNER` <span style="font-family: inherit; font-size: 1em;">and</span> `ALGO_NAME`, respectively.
2.  A username with **PUSH** permissions to the registry; this references below as `REGISTRY_USERNAME`
3.  The password for the account in (2); this references below as `REGISTRY_PASSWORD`
4.  The ID of the registry to modify; this references below as `REGISTRY_ID` and can be retrieved through a `GET` request to `/v1/registries` if it wasn't captured from the output of the original [registry-configuration](#h_69449249320481631198612011) `POST` request.

<span style="font-family: inherit; font-size: 1em;">If no credentials are supplied, the credentials associated with the registry will be used.</span>

**REST request**

<div class="syn-code-block">

<pre class="code_snippet">$ curl https://YOUR-SERVER-NAME.com/v1/algorithms/ALGO_OWNER/ALGO_NAME/version \
    -X POST \
    -H "Authorization: Simple STD_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "settings": {
        "algorithm_callability": "private"
      },
      "version_info": {
        "version_type": "minor",
        "release_notes": "A few bug fixes.",
        "sample_input": "42"
      },
      "registry_push_credentials": {
        "registry_username": "REGISTRY_USERNAME",
        "registry_password": "REGISTRY_PASSWORD",
        "registry_id": "REGISTRY_ID"
      }
    }'
</pre>

</div>

Alternatively:

*   The `https://**YOUR-SERVER-NAME.com**/v1/algorithms/**ALGO_OWNER**/**ALGO_NAME**/version` endpoint in the request above also takes an [algorithm UIID](https://algorithmia.com/developers/glossary#algorithm-uuid) (`ALGO_ID`) in place of `ALGO_OWNER/ALGO_NAME` as an algorithm specifier.
*   The `https://**YOUR-SERVER-NAME.com**/v1/algorithms/[ {**ALGO_OWNER**/**ALGO_NAME} | {ALGO_ID}** ]/versions` endpoint (note that `versions` is plural here) can also be used.

## Re-pushing an algorithm image to an external registry on failure

In the case of a failure to push the algorithm image to the external registry during the algorithm publishing step, an algorithm image for a specific version can be re-pushed to the external registry later. In order to do this, you'll need the following:

1.  The [algorithm UUID](https://algorithmia.com/developers/glossary#algorithm-uuid); this references below as `ALGO_ID`
2.  The [algorithm version hash](https://algorithmia.com/developers/glossary#algorithm-version-hash); this references below as `ALGO_HASH_VERSION`
3.  Depending on how the repository is set up, credentials may or may not be required. If required, you'll need to specify:
    1.  A username with **PUSH** permissions to the registry; this references below as `REGISTRY_USERNAME`
    2.  The password for the account in (3.a); this references below as `REGISTRY_PASSWORD`
4.  The ID of the registry to modify; this references below as `REGISTRY_ID` and can be retrieved through a `GET` request to `/v1/registries` if it wasn't captured from the output of the original [registry-configuration](#h_69449249320481631198612011) `POST` request.

**REST request**

<div class="syn-code-block">

<pre class="code_snippet">$ curl https://YOUR-SERVER-NAME.com/v1/algorithms/ALGO_ID/versions/ALGO_VERSION_HASH/registry \
    -X POST \
    -H "Authorization: Simple STD_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "registry_push_credentials": {
        "registry_username": "REGISTRY_USERNAME",
        "registry_password": "REGISTRY_PASSWORD",
        "registry_id": "REGISTRY_ID"
      }'
    }'</pre>

</div>

## Getting the status of an algorithm image push to an external registry

The image-push process can take several minutes, so we provide a route to get the image push status. In order to do this, you'll need the following:

1.  The [algorithm UUID](https://algorithmia.com/developers/glossary#algorithm-uuid); this references below as `ALGO_ID`
2.  The [algorithm version hash](https://algorithmia.com/developers/glossary#algorithm-version-hash); this references below as `ALGO_HASH_VERSION`.

This route will return a list of image push statuses for each registry that has been configured for the provided algorithm version hash. Any subsequent pushes to the same registry will overwrite the existing entry for that (`ALGO_HASH_VERSION`, `REGISTRY_ID`) combination.

**REST request**

<div class="syn-code-block">

<pre class="code_snippet">$ curl https://YOUR-SERVER-NAME.com/v1/algorithms/ALGO_ID/versions/ALGO_VERSION_HASH/registry \
    -H "Authorization: Simple STD_API_KEY"
</pre>

</div>

## Pulling an image during algorithm execution

When an algorithm is executed, the **latest** image push status will be used to determine which registry to pull the image from. This means that if an image is re-pushed to a sandbox registry after the image is pushed to the prod registry, the sandbox registry image will be pulled during algorithm execution. This represents a unique corner case that isn't expected, but it's possible.

## Ensuring images get pulled

Our current design ensures that every time an algorithm pod is launched on a node, the container image will be pulled from the external registry. This is ensured by using an `imagePullPolicy: Always` policy as described in the [Kubernetes docs](https://kubernetes.io/docs/concepts/containers/images/#image-pull-policy). The kubelet will ping the external registry to determine the current expected image tag. If the exact same image digest is already on the host, the complete image won't be re-downloaded but the registry will be pinged and validated.

Therefore, restarting all of the worker nodes (VMs) in the cluster will ensure that all algorithm-runner pods on the cluster are restarted, and the kubelet will ping the external registry (though possibly not pull all of the bytes of data). To do this:

1.  Get a list of all worker nodes via `kubectl get nodes -l algorithmia.com/role=algorithm-worker`
2.  For each worker node, one by one:

1.  `kubectl drain --ignore-daemonsets --delete-local-data=true NODE_NAME`
2.  Wait for that command to complete
3.  Restart that worker node
4.  `kubectl uncordon NODE_NAME`

Alternatively the VMs could be completely replaced in the cluster by provisioning a new VM, and following standard procedures for getting a machine to join the Kubernetes cluster.

Then, for any algorithm version image that one wants to get pulled, simply call the algorithm as any user. This will ensure a deployment gets created, and so a pod will be scheduled on a recently restarted machine.

# Deleting an external registry

In order to delete an external registry, you'll need the the ID of the registry; this references below as `REGISTRY_ID` and can be retrieved through a `GET` request to `/v1/registries`.

**REST request**

<div class="syn-code-block">

<pre class="code_snippet">$ curl https://YOUR-SERVER-NAME.com/v1/registries/REGISTRY_ID \
    -X DELETE \
    -H "Authorization: Simple CLUSTER_ADMIN_API_KEY"
</pre>

</div>
