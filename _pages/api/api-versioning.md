---
layout: api_docs_article
title:  "API Versioning"
---

Algorithmia API is versioned with the version specified on the URL route:

`[ANY] api.algorithmia.com/:version/:route`

The current supported API version is `v1` (i.e. `api.algorithmia.com/v1/:route`)

##### Deprecated Versions

Algorithm API calls defined with unversioned routes are deprecated. Planned support for them ended 2015-12-31.

Unversioned routes are routes that use the following format:

`[ANY] api.algorithmia.com/api/:route`

`[ANY] api.algorithmia.com/data/:route`
