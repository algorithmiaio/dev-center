---
layout: article
title:  "Versioning"
excerpt: "All about versioning on the platform."
tags: [alg-dev-getting-started, app-dev-getting-started]
show_related: true
author: liz_rush
image:
    teaser: /icons/algo.svg
---


### Versioning

Each algorithm follows the same versioning scheme composed of a revision number, minor version number, and major version number. This allows algorithm developers the ability to update and improve their algorithms while maintaining a dependable version for consumers to call.

#### Revisions (-.-.z)

Revisions are for publishing backward-compatible bug fixes.

Revisions carry the same price and visibility to ensure that existing consumers of an algorithm continue to have access to an algorithm and its bug fixes at a predictable price.

#### Minor Versions (-.y.-)


Minor versions are for publishing new functionality in a backwards-compatible manner.

Algorithm developers may elect to change the royalty cost for a new minor version of an algorithm.

#### Major Versions (x.-.-)

Major version changes is an upcoming feature which will provide a mechanism for publishing breaking changes to an algorithm. Currently, algorithm authors are unable to make a major version change.

When an algorithm has a minor or major version change, the author has the opportunity to update the cost and permissions. Remember to version your API calls to avoid unexpected changes.
{: .notice-warning }
