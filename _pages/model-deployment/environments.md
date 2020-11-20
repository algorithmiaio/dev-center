---
layout: article
title:  "Environment matrix"
excerpt: "Environment matrix"
categories: model-guides
tags: [algo-model-guide]
show_related: true
author: steph_kim
permalink: /model-deployment/environments/
---

<table>
  <tr>
   <td>Environment
   </td>
   <td>Language version
   </td>
   <td>Framework version
   </td>
   <td>Other dependencies
   </td>
   <td>Cuda
<p>
cudnn
   </td>
   <td>Base image
   </td>
  </tr>
  <tr>
   <td>allennlp
   </td>
   <td>Python 3.7
   </td>
   <td>AllenNLP 0.8
   </td>
   <td>Spacy-2.0.18    Pytorch-1.0.0
   </td>
   <td>
   </td>
   <td>ubuntu:16.04
   </td>
  </tr>
  <tr>
   <td>apex
   </td>
   <td>Python 3.7
   </td>
   <td>apex-0.1
   </td>
   <td>Pytorch-1.3
   </td>
   <td>10.1
<p>
7
   </td>
   <td>nvidia/cuda:10.1-cudnn7-devel-ubuntu16.04
   </td>
  </tr>
  <tr>
   <td>h2o-python37
   </td>
   <td>Python 3.7
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>ubuntu:20.04
   </td>
  </tr>
  <tr>
   <td>mxnet-cu90-1.3.1
   </td>
   <td>Python 3.7
   </td>
   <td>MXNet 1.3.1
   </td>
   <td>
   </td>
   <td>9.0
<p>
7
   </td>
   <td>nvidia/cuda:9.0-cudnn7-devel-ubuntu16.04
   </td>
  </tr>
  <tr>
   <td>python27
   </td>
   <td>Python 2.7.15
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>ubuntu:16.04
   </td>
  </tr>
  <tr>
   <td>python27-gpu
   </td>
   <td>Python 2.7.15
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>9.0
<p>
7
   </td>
   <td>nvidia/cuda:9.0-cudnn7-devel-ubuntu16.04
   </td>
  </tr>
  <tr>
   <td>python36
   </td>
   <td>Python 3.6
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>cuda:9.0-cudnn7-devel-ubuntu16.04
   </td>
  </tr>
  <tr>
   <td>python36-gpu
   </td>
   <td>Python 3.6
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>ubuntu:16.04
   </td>
  </tr>
  <tr>
   <td>python37
   </td>
   <td>Python 3.7
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>ubuntu:16.04
   </td>
  </tr>
  <tr>
   <td>python37-gpu
   </td>
   <td>Python 3.7
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>9.0
<p>
7
   </td>
   <td>cuda:9.0-cudnn7-devel-ubuntu16.04
   </td>
  </tr>
  <tr>
   <td>python37-pytorch11-cuda9
   </td>
   <td>Python 3.7
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>9.0
<p>
7
   </td>
   <td>cuda:9.0-cudnn7-devel-ubuntu16.04
   </td>
  </tr>
  <tr>
   <td>python27-pytorch11-cuda9
   </td>
   <td>Python 2.7.15
   </td>
   <td>PyTorch 1.0.0
   </td>
   <td>
   </td>
   <td>9.0
<p>
7
   </td>
   <td>nvidia/cuda:9.0-cudnn7-devel-ubuntu16.04
   </td>
  </tr>
  <tr>
   <td>python37-pytorch11-cuda9
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>9.0
<p>
7
   </td>
   <td>nvidia/cuda:9.0-cudnn7-devel-ubuntu16.04
   </td>
  </tr>
  <tr>
   <td>pytorch-1.1.x
   </td>
   <td>Python 3.7.1
   </td>
   <td>PyTorch 1.1
   </td>
   <td>numpy==1.16.0
   </td>
   <td>9.0
<p>
7
   </td>
   <td>nvidia/cuda:9.0-cudnn7-devel-ubuntu16.04
   </td>
  </tr>
  <tr>
   <td>pytorch-1.2.x
   </td>
   <td>Python 3.7.1
   </td>
   <td>PyTorch 1.2
   </td>
   <td>numpy==1.16.0
   </td>
   <td>9.0
<p>
7
   </td>
   <td>nvidia/cuda:9.0-cudnn7-devel-ubuntu16.04
   </td>
  </tr>
  <tr>
   <td>pytorch-1.3.x
   </td>
   <td>Python 3.7.1
   </td>
   <td>PyTorch 1.3
   </td>
   <td>numpy==1.16.0
   </td>
   <td>9.0
<p>
7
   </td>
   <td>nvidia/cuda:9.0-cudnn7-devel-ubuntu16.04
   </td>
  </tr>
  <tr>
   <td>pytorch-1.4.x
   </td>
   <td>Python 3.7.1
   </td>
   <td>PyTorch 1.4
   </td>
   <td>numpy==1.16.0
   </td>
   <td>9.0
<p>
7
   </td>
   <td>nvidia/cuda:9.0-cudnn7-devel-ubuntu16.04
   </td>
  </tr>
  <tr>
   <td>pytorch-1.5.x
   </td>
   <td>Python 3.7.1
   </td>
   <td>PyTorch 1.5
   </td>
   <td>numpy==1.16.0
   </td>
   <td>9.0
<p>
7
   </td>
   <td>nvidia/cuda:9.0-cudnn7-devel-ubuntu16.04
   </td>
  </tr>
  <tr>
   <td>pytorch-1.6.x
   </td>
   <td>Python 3.7.1
   </td>
   <td>PyTorch 1.6
   </td>
   <td>numpy==1.16.0
   </td>
   <td>9.0
<p>
7
   </td>
   <td>nvidia/cuda:9.0-cudnn7-devel-ubuntu16.04
   </td>
  </tr>
  <tr>
   <td>pytorch-1.7.x
   </td>
   <td>Python 3.7.1
   </td>
   <td>PyTorch 1.7
   </td>
   <td>numpy==1.16.0
   </td>
   <td>10.2
<p>
7
   </td>
   <td>nvidia/cuda:10.2-cudnn7-runtime-ubuntu18.04
   </td>
  </tr>
  <tr>
   <td>selenium3.141.x-python
   </td>
   <td>Python 3.7.1
   </td>
   <td>selenium==3.141.0
   </td>
   <td>Phantomjs-2.1.1
<p>
Chrome driver 2.41
<p>
geckodriver-v0.26.0
   </td>
   <td>
   </td>
   <td>ubuntu:16.04
   </td>
  </tr>
  <tr>
   <td>spacy-2.0.18
   </td>
   <td>Python 3.7.1
   </td>
   <td>Spacy 2.0.18
   </td>
   <td>spacy==2.0.18
   </td>
   <td>
   </td>
   <td>ubuntu:16.04
   </td>
  </tr>
  <tr>
   <td>tensorflow-cpu-2.3
   </td>
   <td>Python 3.7.1
   </td>
   <td>tensorflow>=2.3
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>ubuntu:16.04
   </td>
  </tr>
  <tr>
   <td>tensorflow-gpu-1.12
   </td>
   <td>Tensorflow 1.12.0
   </td>
   <td>keras==2.1.4
   </td>
   <td>
   </td>
   <td>9.0
<p>
7
   </td>
   <td>cuda:9.0-cudnn7-devel-ubuntu16.04
   </td>
  </tr>
  <tr>
   <td>tensorflow-gpu-1.13
   </td>
   <td>Tensorflow 1.13
   </td>
   <td>keras==2.1.4
   </td>
   <td>
   </td>
   <td>10.0
<p>
7
   </td>
   <td>nvidia/cuda:10.0-cudnn7-devel-ubuntu16.04
   </td>
  </tr>
  <tr>
   <td>tensorflow-gpu-1.14
   </td>
   <td>Tensorflow 1.14
   </td>
   <td>keras==2.1.4
   </td>
   <td>
   </td>
   <td>10.0
<p>
7
   </td>
   <td>nvidia/cuda:10.0-cudnn7-devel-ubuntu16.04
   </td>
  </tr>
  <tr>
   <td>tensorflow-gpu-2.0
   </td>
   <td>Tensorflow 2.0
   </td>
   <td>keras==2.1.4
   </td>
   <td>
   </td>
   <td>10.0
<p>
7
   </td>
   <td>nvidia/cuda:10.0-cudnn7-devel-ubuntu16.04
   </td>
  </tr>
  <tr>
   <td>tensorflow-gpu-2.1
   </td>
   <td>Tensorflow 2.1
   </td>
   <td>keras==2.3.1
   </td>
   <td>
   </td>
   <td>10.1
<p>
7
   </td>
   <td>nvidia/cuda:10.1-cudnn7-devel-ubuntu16.04
   </td>
  </tr>
  <tr>
   <td>tensorflow-gpu-2.3
   </td>
   <td>Tensorflow 2.2
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>10.1
<p>
7
   </td>
   <td>nvidia/cuda:10.1-cudnn7-devel-ubuntu16.04
   </td>
  </tr>
  <tr>
   <td>tensorrt-6.0-cuda10.0
   </td>
   <td>tensorrt-6.0
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>10.0
<p>
7
   </td>
   <td>cuda:10.0-cudnn7-devel-ubuntu16.04
   </td>
  </tr>
</table>

