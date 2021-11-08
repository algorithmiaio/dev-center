---
categories: admin-panel
layout: article
title: Migration Scripts
---

## User migration

To migrate users from one cluster to another, you can use the following script, which is also available [as a GitHub Gist](https://gist.github.com/lemonez/92e549bffd233d1648d6aff34f307b49).

## Algorithm migration

Every Algorithmia algorithm is comprised of two components—metadata and source code—and as a user you generally interact with these components in separate steps in your workflow. Before diving into the tooling surrounding algorithm migration, in the next section you'll learn about these components and some of the differences between them.

### Metadata vs. source code

Algorithm metadata includes information related to ownership, permissions, versioning, builds, and sample input (note that technically speaking, some of this information is also contained in the `algorithmia.conf` file in the algorithm's source code, but for the sake of algorithm management and migration, this is not an important detail). You generally use our API to read and modify algorithm metadata, as well as to create algorithms.

Algorithm source code is anything included in an algorithm's code repository, i.e., anything tracked by Git. This includes the algorithm code itself (including the requirements file, any tests, and any associated helper modules/files that you include beyond the main file with the `apply()` function), and the algorithm's Git history (which is stored in its `.git` directory).

Unlike metadata, with which you can interact through the API, algorithm source code is managed using Git. Regardless of where the source code is hosted, every algorithm on the platform has a Git URL that can be used to clone the algorithm to work on it locally, and this URL is available immediately once the algorithm is created, even if the source code hasn't yet been modified. If you're unfamiliar with how this works and where to find the Git URL, see our course on [developing algorithms](/developing-python-algorithms-in-the-web-ide/693712#git-url).

Note that algorithm source code (the part tracked by Git) doesn't include files (data, model, configuration, or otherwise) stored in hosted data collections, so those resources must be migrated separately (this can be done using the API).

When you create an algorithm on the platform, you must [choose where the source code will be hosted](https://algorithmia.com/developers/algorithm-development/source-code-management), as mentioned in the previous lesson. The algorithm is initialized with the metadata you supply (or whatever default values are configured) as well as template algorithm code to get you started in whatever language you've chosen.

### Workflow for algorithm migration or promotion

As described in the previous lesson, there are several scenarios in which you might choose to migrate algorithm source code between Algorithmia clusters or between accounts within a cluster, for example to switch SCM providers. In all of these scenarios, source code and metadata are handled in separate steps, and there are several things to consider to ensure that everything matches up between source and destination environments. Note that the terms "source" and "destination" refer generically to any two Algorithmia algorithms; these could be algorithms on "development" and "production" clusters, or even algorithms owned by two different accounts on the same cluster.

In this section, you'll learn the steps necessary to migrate algorithm source code, and then you'll see an example code snippet that can be used to automate this workflow. Note that the workflow described below is applicable to a generic "algorithm migration" process, but also applies to the more specific "algorithm promotion" use case; these two workflows are exactly the same, with one basic difference, which is described below in step 9\. With minor modifications, this workflow could accommodate pushing code to an arbitrary number of destination clusters, for example to support the "development and production + HA" use case described in the [course introduction.](./768878)

#### Steps

At a high level, the steps for migrating an algorithm are:

*   Create a "destination" algorithm (if it doesn't already exist) in the same language and with the same algorithm name `ALGO_NAME`. Because every algorithm can be uniquely identified with (`CLUSTER_DOMAIN`, `ALGO_OWNER`, `ALGO_NAME`), if the destination algorithm is on a different cluster, the owner can be the same, but if the destination algorithm is on the same cluster, the owner must be different.
*   Clone both source and destination repositories (on the respective Algorithmia clusters).
*   Copy the appropriate files from the local source repository to the local destination repository.
*   Push the updated code from the local destination repository back to the remote (on the destination Algorithmia cluster).

The following steps describe this process in detail, and the Automation section that follows provides a shell script to automate steps 2-7.

1.  On the destination cluster, create an account that will own the algorithm (if an appropriate account doesn't already exist), and create an API key in that account that has [algorithm management capabilities](https://algorithmia.com/developers/platform/customizing-api-keys#access-options).
2.  On the destination cluster, create an algorithm that matches the algorithm name, runtime (language + environment), and accessibility settings (if settings other than the defaults are desired) of the algorithm that you intend to migrate from the source cluster. You don't need to modify the source code of this newly created algorithm—it just needs to exist. Note that the script below automates the creation of a Python algorithm with default settings; if you're migrating an algorithm in a different language or otherwise want to maintain specific algorithm settings, you can `GET` the metadata [through the API](https://algorithmia.com/developers/api/#get-an-algorithm) and then replace the defaults in the JSON data (`-d`) payload in the `POST` request from the script.
3.  Build Git URLs for both source and destination algorithms. The structure is `https://API_KEY_OWNER:API_KEY@git.CLUSTER_DOMAIN/git/ALGO_OWNER/ALGO_NAME[/ALGO_VERSION].git`. Note that authentication is handled by the `API_KEY_OWNER:API_KEY` portion of the URL. The parameters are:
    *   `API_KEY_OWNER`: account or org that owns the API key (this account must have read + write access to the algorithm, through either direct algorithm ownership or membership in an org that owns the algorithm)
    *   `API_KEY`: standard API key (not an admin API key; note that forward slashes (`/`) in API keys must be encoded (replaced) by `%2F` to make them URL safe if they are used in terminal commands like `git clone`, which is used in the script below)
    *   `CLUSTER_DOMAIN`: URL associated with a specific Algorithmia cluster (the portion of the URL after the `https://` protocol)
    *   `ALGO_OWNER`: account or org that owns the algorithm
    *   `ALGO_NAME`: algorithm name (this is the name as it appears in the URL; not the display name, which may contain spaces)
    *   `ALGO_VERSION`: [optional] the version of the algorithm to be migrated (if included, this will only be part of the Git URL for the source algorithm; versioning of the destination algorithm is handled during the algorithm-publishing step)
4.  From a single local directory (this creates sibling child directories):
    1.  Clone the destination algorithm.
    2.  Clone the source algorithm.
5.  Copy the algorithm code from the source directory (i.e., the directory with code from the source algorithm; not the `/src` folder) into the sibling destination directory. Do NOT copy over the `.git` directory; each repository (source and destination) has its own Git history and remote `origin` that must remain independent.
6.  Stage modified files and commit the changes with a message.
7.  Push the new code from the local destination directory to the cluster. This action triggers a build on the server side, so there isn’t an explicit build step.
8.  Publish the new destintation algorithm version. You won't be able to keep the algorithm version numbers in sync between source and destination, because you can only incrementally increase the version number of an algorithm when you publish it, and there could potentially be several published source algorithm versions between algorithm migrations. Therefore, you may want to consider tracking distinct version numbers that you can then mapping them to each other (e.g. version numbers associated with "dev" and "prod").
9.  If this is a promotion workflow and the process is to be repeated multiple times (as opposed to a one-and-done migration), for each iteration:
    1.  In the directory for the source algorithm, pull down the latest changes.
    2.  Repeat steps 5 through 8.

### Automation

The shell script below provides a generic automated solution for steps 2-7 from above. The steps before and after this can be automated as well, using the methods available [through our API](https://algorithmia.com/developers/api/) (e.g., using cURL or one of our language clients). Remember from step 2, above, that in order to migrate source code using Git, the algorithm (i.e., the metadata and template source code repository that constitutes an algorithm) must first exist on the destination cluster.

As a security best practice, we recommend using environment variables to store API keys. This script assumes that the environment variables `SOURCE_ACCOUNT_API_KEY` and `DEST_ACCOUNT_API_KEY` are available at runtime, but they could also be specified with the same `VARIABLE="value"` syntax if you need to hard-code them.

Note that this script creates a migration directory `Migrate_ALGO_NAME` and stores the cloned source code there. If you're using this script for an algorithm promotion workflow (i.e., if you'll be calling this script multiple times), make sure you call it from the same top-level directory (the parent of `Migrate_ALGO_NAME`) every time.

<div class="syn-code-block">

<pre class="code_snippet">#!/bin/bash

######################
## BEGIN USER EDITS ##
######################

SETUP=true # If running script for the first time set to `true`, else `false`.

SOURCE_API_KEY_OWNER="source_account_name"
SOURCE_API_KEY="$SOURCE_ACCOUNT_API_KEY" # (set as environment variable)
SOURCE_DOMAIN="source-cluster.algorithmia.com" # e.g., "algorithmia.com"
SOURCE_ALGO_OWNER="account_or_org_name"

DEST_API_KEY_OWNER="dest_account_name"
DEST_API_KEY="$DEST_ACCOUNT_API_KEY" # (set as environment variable)
DEST_DOMAIN="dest-cluster.algorithmia.com" # e.g., "algorithmia.com"
DEST_ALGO_OWNER="account_or_org_name"

ALGO_NAME="MyAlgorithmName"
# Specifying the algorithm version is optional. If you don't specify the
# algorithm version, the latest version will be cloned by default. Toggle
# between the following options so that the URL constructed is valid.
ALGO_VERSION=""
#ALGO_VERSION="/0.1.1"

####################
## END USER EDITS ##
####################

# Run this in a new directory to ensure no existing files are modified or deleted.
MIGRATION_DIR="migrate_${ALGO_NAME}"
SOURCE_DIR="source_dir"
DEST_DIR="dest_dir"

# Create the algorithm on the destination cluster if it doesn't already exist.
# Note that this action is idempotent and will note overwrite an existing algorithm.
curl https://api.${DEST_DOMAIN}/v1/algorithms/${DEST_ALGO_OWNER} \
    -X POST \
    -H 'Authorization: Simple '"${DEST_API_KEY}"'' \
    -H 'Content-Type: application/json' \
    -d '{
        "details": {
            "label": "'${ALGO_NAME}'"
        },
        "name": "'${ALGO_NAME}'",
        "settings": {
            "environment": "cpu",
            "language": "python3-1",
            "license": "apl",
            "network_access": "full",
            "pipeline_enabled": true,
            "source_visibility": "closed"
        }
    }'

if $SETUP
## If running the script for the first time to establish the local and remote repositories.
then
    # Clean up any old migration directory and start fresh.
    rm -rf $MIGRATION_DIR
    mkdir $MIGRATION_DIR
    cd $MIGRATION_DIR

    # Encode API keys to make URL-safe if they have `/` character.
    # Note that first instance of `//` is for global replace
    SOURCE_API_KEY=${SOURCE_API_KEY//\//%2F}
    DEST_API_KEY=${DEST_API_KEY//\//%2F}

    # Clone both repositories to local sibling directories.
    git clone https://${DEST_API_KEY_OWNER}:${DEST_API_KEY}@git.${DEST_DOMAIN}/git/${DEST_ALGO_OWNER}/${ALGO_NAME}.git \
        $DEST_DIR
    git clone https://${SOURCE_API_KEY_OWNER}:${SOURCE_API_KEY}@git.${SOURCE_DOMAIN}/git/${SOURCE_ALGO_OWNER}/${ALGO_NAME}${ALGO_VERSION}.git \
        $SOURCE_DIR
## For subsequent model promotion.
else
    cd $MIGRATION_DIR
    # Only pull down the new source code.
    cd $SOURCE_DIR
    git pull
    cd ..
fi

# Move all the files over except for the .git file.
mkdir temp
mv ${SOURCE_DIR}/.git temp/
cp -R ${SOURCE_DIR}/* ${DEST_DIR}/
mv temp/.git ${SOURCE_DIR}/
rmdir temp

# Commit new code in destination directory.
cd $DEST_DIR
git add --all
git commit -m "new version of ${ALGO_NAME}"
git push
cd ../../
</pre>

</div>