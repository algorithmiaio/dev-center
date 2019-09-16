---
layout: article
title:  "Versioning"
excerpt: "All about versioning on the platform."
categories: basics
nav_index: 30
tags: [basics, alg-dev-getting-started, app-dev-getting-started]
show_related: true
image:
    teaser: /icons/algo.svg
permalink: /platform/versioning
redirect_from:
  - /basics/versioning/
---

### Version Scheme

Every algorithm uses the same versioning scheme: `<major>.<minor>.<revision>`. Versions allow algorithm developers the ability to update and improve their algorithms while maintaining a dependable version for app developers to call. The Algorithmia platform also enforces certain restrictions based on versioning.

#### Revisions

Revisions are intended for publishing backward-compatible bug fixes.

Revisions will always carry the same price and visibility to ensure that existing users of an algorithm continue to have access to an algorithm and its bug fixes at a predictable price.

#### Minor Versions

Minor versions are for publishing new functionality in a backwards-compatible manner.

Algorithm developers may elect to change the royalty cost for a new minor version of an algorithm, but a new minor version will always have the same permissions as previous minor versions.

#### Major Versions

Major version changes are for publishing breaking changes to an algorithm.

Algorithm developers may change the cost and permissions of an algorithm for new major versions.


### Versioned API Calls

All algorithms are versioned the Algorithmia clients support specifying a version by specifying the algorithm URI with the format `<username>/<algoname>/<version>`, e.g., `util/echo/0.2.1`. There are several ways that the version can be expressed:

#### Fully-specified version

Specifying the version as `<major>.<minor>.<revision>` (e.g. `util/echo/0.2.1`) ensures that your API call always calls exactly that version.

It is recommend that application devlopers use a fully-specified version when calling an algorithm from a production service. This ensures that your application is not affected by changes in pricing, permissions, or functionality.
{: .notice-info}

#### Semver-compatible version

By specifying the version as `<major>.<minor>` without a revision number (e.g. `util/echo/0.2`), your API call will use the latest `0.2` version which ensures that the price and permissions of the API calls remain the same. This is useful when you want to automatically benefit from bug fixes and you have confidence that the author will maintain backward compatibility with those bug fixes.

#### Latest public version

By specifying the version as `latest` (e.g. `util/echo/latest`) or by not specifying a version at all (e.g. `util/echo`), the latest public version of the algorithm will be called. This is useful when testing or experimenting with an algorithm, and may be valuable in scenarios where you maintain both the algorithm and the application that uses it.

#### Latest private version

For algorithms you or your organizations own, specifying `latestPrivate` as the version allows you call the latest version that is published privately. This is primarily useful when you maintain a private algorithm and the application that uses it.

#### SHA version

For algorithms you or your organizations own, you may specify the version using the full SHA (e.g. `4be0e18fba270e4aaa7cff20555268903f69a11b`) of a successful build. This is useful for testing your algorithms during development.
