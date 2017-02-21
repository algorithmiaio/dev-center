---
layout: article
title:  "Permissions"
excerpt: "All about permissions on the platform."
tags: [alg-dev-getting-started, app-dev-getting-started]
show_related: true
author: liz_rush
image:
    teaser: /icons/algo.svg
---


### Permissions

Permissions can be found on the algorithm description page. The algorithm's author can indicate if the algorithm will require Internet access, call other algorithms, or if the users can view the source code. Some of these permissions will affect the amount of credits needed to run the algorithm. Be sure to check out the algorithm's permissions section on the description page for more information.

#### Internet Access

Many of the algorithms in the marketplace can be run without accessing the Internet. Some algorithms require retrieving or sending data outside of the Algorithmia platform during execution. If an algorithm's permissions indicate that it requires Internet access, please be aware that there is the potential for your data to leave the Algorithmia platform.

#### Calls Other Algorithms

Some algorithms call other algorithms in order to combine algorithms and parallelize workloads. This permission is listed on the description page so that you can determine if the algorithm will incur additional usage and royalty costs.

#### GPU Execution Environment

Many algorithms can benefit from using a Graphics Processing Unit (GPU) to accelerate certain kinds of computation, such as image processing and deep learning. Algorithms can be marked as requiring "Advanced GPU" execution environment. When this flag is set, the algorithm will run on servers with GPU hardware. For algorithms with this flag set, we also install several existing drivers and frameworks to help algorithm developers take advantage of GPU computing. This includes nvidia drivers, CUDA support, and several of the most popular deep learning frameworks, including TensorFlow, Caffe, Theano, and Torch.

#### Source Code Visibility

Algorithm authors have the option of choosing to open source their algorithm. Open source algorithms have a button on the description to "View Source" and anyone can see the internal code of the algorithm. If an algorithm is closed source, this means that only the author has the ability to view the code. Note that open source algorithms still accrue fees for usage and may have a royalty fee.
