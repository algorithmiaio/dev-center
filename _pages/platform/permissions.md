---
layout: article
title:  "Permissions"
excerpt: "All about permissions on the platform."
categories: basics
nav_index: 40
tags: [basics, alg-dev-getting-started, app-dev-getting-started]
show_related: true
image:
    teaser: /icons/algo.svg
permalink: /platform/permissions
redirect_from:
  - /basics/permissions/
---


### Permissions

Permissions can be found on the algorithm description page. The algorithm's author can indicate if the algorithm will require Internet access, call other algorithms, or if the users can view the source code. Some of these permissions will affect the amount of credits needed to run the algorithm. Be sure to check out the algorithm's permissions section on the description page for more information.

#### <i class="fa fa-globe" style="margin-right:5px"></i>Internet Access

Many of the algorithms in the marketplace can be run without accessing the Internet. Some algorithms require retrieving or sending data outside of the Algorithmia platform during execution. If an algorithm's permissions indicate that it requires Internet access, please be aware that there is the potential for your data to leave the Algorithmia platform.

#### <i class="fa fa-phone" style="margin-right:5px"></i>Calls Other Algorithms

Some algorithms call other algorithms in order to combine algorithms and parallelize workloads. This permission is listed on the description page so that you can determine if the algorithm will incur additional usage and royalty costs.

#### <i class="fa fa-lock" style="margin-right:5px"></i>Source Code Visibility

Algorithm authors have the option of choosing to open source their algorithm. Open source algorithms have a button on the description to "View Source" and anyone can see the internal code of the algorithm. If an algorithm is closed source, this means that only the author has the ability to view the code. Note that open source algorithms still accrue fees for usage and may have a royalty fee.
