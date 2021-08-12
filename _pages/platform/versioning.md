---
categories: basics
excerpt: "All about versioning on the platform."
layout: article
permalink: /platform/versioning/
redirect_from:
- /basics/versioning/
show_related: true
tags: [basics, alg-dev-getting-started, app-dev-getting-started]
title: "Versioning"
---

### Versioning scheme

Every algorithm uses the same versioning scheme: `<major>.<minor>.<revision>`. Versioning allows you the ability to update and improve an algorithm while maintaining dependable, immutable* versions to be executed. The Algorithmia platform also enforces certain restrictions based on versioning. (*Algorithmia guarantees immutability for the source code of published algorithms, but data that algorithms access does not have this immutability guarantee.)

#### Major versions

Major versions are to be used when publishing breaking changes to an algorithm. For new major versions, algorithm permissions can be modified.

#### Minor versions

Minor versions are to be used when publishing new functionality in a backward-compatible manner. New minor versions will always have the same permissions as previous minor versions within the same major version.

#### Revision versions

Revision versions are to be used for publishing backward-compatible bug fixes. New revision versions always carry the same visibility as previous revisions, ensuring that existing users of an algorithm version continue to have access to that algorithm and its associated bug fixes if calling it without specifying a specific revision version (see below).

### Versioned API calls

Algorithmia clients support requesting a particular algorithm version by specifying the [algorithm endpoint](/developers/glossary#algorithm-endpoint) with the format `ALGO_OWNER/ALGO_NAME[/ALGO_VERSION]`, e.g., `util/echo/0.2.1`. Below are several ways that the version can be specified.

#### Fully-specified semantic version

If you specify the version as `<major>.<minor>.<revision>` (e.g., `util/echo/0.2.1`), you'll ensure that exactly that algorithm is used.

It's recommend that you supply a fully-specified [semantic version](/developers/glossary#algorithm-semantic-version) when calling an algorithm from a production service. This ensures that your application is not affected by changes in algorithm permissions or functionality.
{: .notice-info}

#### Partially specified semantic version

If you specify the version as `<major>.<minor>` without a revision number (e.g., `util/echo/0.2`), the latest *publicly published* `0.2` version will be used, ensuring that the permissions of the algorithm remain constant. This is useful when you want to automatically benefit from bug fixes and you have confidence that the author will maintain backward compatibility with those bug fixes.

Note that we don't support calling *privately published* algorithms using partially specified semantic versions, because it could introduce confusion as to which algorithm a caller is referring to, depending on their permissions. To understand this better, see the explanation in the [FAQ section below](#faqs).

#### Latest public version

By specifying the version as `latest` (e.g. `util/echo/latest`) or by not specifying a version at all (e.g. `util/echo`), the latest public version of the algorithm will be called. This is useful when testing or experimenting with an algorithm, and may be valuable in scenarios where you maintain both the algorithm and the application that uses it.

#### Latest private version

For algorithms that you or your organizations own and only publish privately, specifying `latestPrivate` as the version allows you to call the latest private version at a constant endpoint. This is primarily useful when you maintain a private algorithm and the application that uses it.

#### SHA (algorithm version hash) version

For algorithms that you or your organizations own, you may specify the version using the full SHA (e.g., `4be0e18fba270e4aaa7cff20558905263f69a11b`) of a successful build. This is useful for testing your algorithms during development. Note that on our platform we also refer to the SHA as the [algorithm version hash](/developers/glossary#algorithm-version-hash).

## FAQs

**Q**: <em>Can you elaborate on why you don't allow partially specified semantic versions for private algorithms?</em>

**A**: Absolutely! Suppose that `User1` is a member of an organization `Org1`, and `User2` isn't. `Org1` owns an algorithm called `OrgAlgo`.

Let's suppose that there are these two versions of `OrgAlgo`:

- `Org1/OrgAlgo/1.0.1` is published publicly on the cluster
- `Org1/OrgAlgo/1.0.2` is published privately, accessible only to members of `Org1`

If we allowed partially specified semantic versions, the following behavior would be possible:

- `User1` calls `Org1/OrgAlgo/1.0`; because they have access to the private version, their request goes to `Org1/OrgAlgo/1.0.1`.
- `User2` calls `Org1/OrgAlgo/1.0`; because they have access only to the public version, their request goes to `Org1/OrgAlgo/1.0.2`.

In this scenario, the users call the same endpoint but gets a different version. We avoid this unpredictable behavior by not supporting this construct at all for private algorithms.
