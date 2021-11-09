---
categories: troubleshooting
layout: article
title: "2) Common Issues"
---

## JSON serialization of input/output

The input you send into an Algorithmia algorithm, and any output that's returned, must be JSON-serializable. See this [description of algorithm input and output](/developing-python-algorithms-in-the-web-ide/693714#algorithm-input) for additional details about the JSON deserialization and serialization process when algorithms are executed.

As a workaround to passing in non-serializable payloads, you can upload/download object files using the data API and then pass the data URI as the input/output, for [example with pandas DataFrames](https://gist.github.com/zeryx/0a5d7f66484f5e3c4e2977616474baa6).

## Timeouts

When you make an algorithm execution request, the timeout defaults to 5 min (300 s) if the `timeout` parameter isn’t specified. If your algorithm is timing out with this default duration, you can increase the timeout up to a maximum of 50 min (3000 s); [see the docs](/developers/clients) for the language client you're using for the exact syntax you'll use to change the timeout. For example, using cURL, you'd add `?timeout=3000` to the end of the request URL.

If you increase the timeout and the algorithm still isn't returning within the allotted time limit, you can add some simple profiling logic to find out where the algorithm is spending most of its time. For a Python algorithm, for example, try using the snippet below to print the duration of time that the algorithm spends in a specific section of code.

<div class="syn-code-block">

<pre class="code_snippet">import time

start = time.time()
# <bottleneck code here (e.g., download a large file)>
duration = round(time.time() - start, 2)
print(f"Downloading large file took {duration} seconds.")
      </pre>

</div>

After adding the diagnostic code above and building the algorithm, call the algorithm as in the snippet below with whatever `input` you normally use. This willl allow the algorithm enough time to execute fully and print the log messages to the console. The print statements will provide insight into how long specific steps are taking to run, and the `duration` property from the `metadata` returned will indicate the total duration of algorithm execution in seconds:

<div class="syn-code-block">

<pre class="code_snippet">import Algorithmia

algo = client.algo("ALGO_OWNER/ALGO_NAME/ALGO_VERSION”)
algo.set_options(timeout=3000, stdout=True)
pipe_result = algo.pipe(input)
algo_result = pipe_result.result
metadata = pipe_result.metadata
print(f"Total execution time was {metadata.duration} seconds.")
      </pre>

</div>

If algorithm execution doesn't complete in 50 min on the Algorithmia platform but the code executes in less than 50 min locally, check the algorithm’s [errors tab](https://algorithmia.com/developers/platform/algorithm-profile#errors) to see whether the algorithm is throwing some sort of exception. You can also [view the Grafana dashboard](/developers/administration/admin-panel/dashboard) to see operational status and metrics, including execution times, queue wait times, etc.

## Authentication, Authorization, and Resource Access

On the Algorithmia platform, we approach resource access from several different angles in order to flexibly support diverse workflows. Therefore, when troubleshooting resource access issues, there are potentially multiple dimensions to consider, including API keys, algorithm settings, data source settings, resource ownership, and org membership. [This course](/using-organizations/688851) lays out some of these considerations in detail.

Listed below are some of the most common considerations that can help with troubleshooting resource access, to ensure that a given API key has the appropriate permissions to take a given action on a given resource.

### API key type

*   Is it a [standard API key](https://algorithmia.com/developers/glossary#standard-api-key)?
*   Is it an [admin API key](https://algorithmia.com/developers/glossary#admin-api-key)?

On Algorithmia, all API keys associated with non-admin accounts are standard API keys. These keys have access to APIs like building, publishing, and executing algorithms, and accessing data.

In addition to standard API keys, cluster admin accounts can have admin API keys, which have access to user- and org-management APIs and other APIs that provide functionality only available through the [admin panel](/exploring-the-admin-panel/687271).

For more information on which types of API keys can access which of Algorithmia's APIs, see our [API docs](https://algorithmia.com/developers/api).

### API key ownership

*   Is the API key owned by an org?
*   Is the API key owned by an individual account?
    *   If an account-owned API key is trying to create or access org-owned resources, does the account that owns the API key belong to that org?

Org-owned API keys have access to all resources owned by the org. Account-owned API keys have access to all resources owned by the account and to any org-owned resources of orgs of which the account is a member.

### API key settings and permissions

*   Does the API key itself have the appropriate permissions to take specific actions on specific resources (e.g., execute an algorithm, read data, write data, etc.)?
*   If attempting to access data, do the API key's permissions match the data source's permissions?
*   If attempting to manage algorithms, is the API key "management capable"?

### Resource ownership

*   Is the resource being accessed owned by an org?
*   Is the resource being accessed owned by an individual account?

    *   If an account-owned API key is trying to access org-owned resources, does the account that owns the API key belong to that org?

### Resource visibility settings

*   Is the algorithm public or private?
    *   <span style="font-family: inherit; font-size: 1em;">An account can call</span> **private algorithms** <span style="font-family: inherit; font-size: 1em;">as long as it:</span>
        *   Owns the algorithm, or
        *   Is a member of the org that owns the algorithm
    *   Any account can call any<span style="font-family: inherit; font-size: 1em;"> </span>**public algorithms**<span style="font-family: inherit; font-size: 1em;">.</span>

### Resource settings

*   If an algorithm is attempting to access data over the public internet, does that algorithm have **internet access** enabled?
*   If an algorithm is trying to call other algorithms, does that algorithm have **pipelining** enabled?

## Build issues

If the algorithm isn't building successfully, the first place to check for information is the algorithm's [build logs](/exploring-algorithms/704418), which are available on the **Builds** tab on the algorithm's profile. Click the version hash associated with the build of interest (usually the latest build) to view and/or download the build compilation logs. If it says "logs unavailable", contact our support team directly at [support@algorithmia.com](mailto:support@algorithmia.com).

Often, the build logs will contain explicit information about which package (dependency) is causing the issue. If it isn't so clear, you can use a process of trial and error to determine which package, version, or combination of packages and versions are causing the build failure.

1.  Comment out any dependencies that might be causing the failure, in order to get back to a starting point where you can get a successful build.
2.  Incrementally add dependencies back by uncommenting them and rebuilding with each addition, to see where the break occurs.
3.  Once the problem package has been identified, repeat the process above, this time changing the version number of the specific package instead of commenting out the package itself. Try to narrow down the specific version that is causing the build failure, and see whether you can get a successful build with another version that works with your code.

When you build an algorithm, Algorithmia pulls packages from package repositories outside of Algorithmia. Therefore, version numbers should always be pinned (specified by a specific version number, e.g., `pandas==1.2.4`) so that future rebuilds don't break as the package is developed and the version number advances.