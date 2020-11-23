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

|Environment|Language version|Framework version|Other dependencies|Cuda / cudnn|Base image|
|---|---|---|---|---|---|
|allennlp|Python 3.7|AllenNLP 0.8|Spacy-2.0.18    Pytorch-1.0.0||ubuntu:16.04|
|apex|Python 3.7|apex-0.1|Pytorch-1.3|10.1 / 7|nvidia/cuda:10.1-cudnn7-devel-ubuntu16.04|
|h2o-python37|Python 3.7||||ubuntu:20.04|
|mxnet-cu90-1.3.1|Python 3.7|MXNet 1.3.1||9.0 / 7|nvidia/cuda:9.0-cudnn7-devel-ubuntu16.04|
|python27|Python 2.7.15||||ubuntu:16.04|
|python27-gpu|Python 2.7.15|||9.0 / 7|nvidia/cuda:9.0-cudnn7-devel-ubuntu16.04|
|python36|Python 3.6||||cuda:9.0-cudnn7-devel-ubuntu16.04|
|python36-gpu|Python 3.6||||ubuntu:16.04|
|python37|Python 3.7||||ubuntu:16.04|
|python37-gpu|Python 3.7|||9.0 / 7|cuda:9.0-cudnn7-devel-ubuntu16.04|
|python37-pytorch11-cuda9|Python 3.7|||9.0 / 7|cuda:9.0-cudnn7-devel-ubuntu16.04|
|python27-pytorch11-cuda9|Python 2.7.15|PyTorch 1.0.0||9.0 / 7|nvidia/cuda:9.0-cudnn7-devel-ubuntu16.04|
|python37-pytorch11-cuda9||||9.0 / 7|nvidia/cuda:9.0-cudnn7-devel-ubuntu16.04|
|pytorch-1.1.x|Python 3.7.1|PyTorch 1.1|numpy==1.16.0|9.0 / 7|nvidia/cuda:9.0-cudnn7-devel-ubuntu16.04|
|pytorch-1.2.x|Python 3.7.1|PyTorch 1.2|numpy==1.16.0|9.0 / 7|nvidia/cuda:9.0-cudnn7-devel-ubuntu16.04|
|pytorch-1.3.x|Python 3.7.1|PyTorch 1.3|numpy==1.16.0|9.0 / 7|nvidia/cuda:9.0-cudnn7-devel-ubuntu16.04|
|pytorch-1.4.x|Python 3.7.1|PyTorch 1.4|numpy==1.16.0|9.0 / 7|nvidia/cuda:9.0-cudnn7-devel-ubuntu16.04|
|pytorch-1.5.x|Python 3.7.1|PyTorch 1.5|numpy==1.16.0|9.0 / 7|nvidia/cuda:9.0-cudnn7-devel-ubuntu16.04|
|pytorch-1.6.x|Python 3.7.1|PyTorch 1.6|numpy==1.16.0|9.0 / 7|nvidia/cuda:9.0-cudnn7-devel-ubuntu16.04|
|pytorch-1.7.x|Python 3.7.1|PyTorch 1.7|numpy==1.16.0|10.2 / 7|nvidia/cuda:10.2-cudnn7-runtime-ubuntu18.04|
|selenium3.141.x-python|Python 3.7.1|selenium==3.141.0|Phantomjs-2.1.1<br>Chrome driver 2.41<br>geckodriver-v0.26.0||ubuntu:16.04|
|spacy-2.0.18|Python 3.7.1|Spacy 2.0.18|spacy==2.0.18||ubuntu:16.04|
|tensorflow-cpu-2.3|Python 3.7.1|tensorflow>=2.3|||ubuntu:16.04|
|tensorflow-gpu-1.12|Tensorflow 1.12.0|keras==2.1.4||9.0 / 7|cuda:9.0-cudnn7-devel-ubuntu16.04|
|tensorflow-gpu-1.13|Tensorflow 1.13|keras==2.1.4||10.0 / 7|nvidia/cuda:10.0-cudnn7-devel-ubuntu16.04|
|tensorflow-gpu-1.14|Tensorflow 1.14|keras==2.1.4||10.0 / 7|nvidia/cuda:10.0-cudnn7-devel-ubuntu16.04|
|tensorflow-gpu-2.0|Tensorflow 2.0|keras==2.1.4||10.0 / 7|nvidia/cuda:10.0-cudnn7-devel-ubuntu16.04|
|tensorflow-gpu-2.1|Tensorflow 2.1|keras==2.3.1||10.1 / 7|nvidia/cuda:10.1-cudnn7-devel-ubuntu16.04|
|tensorflow-gpu-2.3|Tensorflow 2.2|||10.1 / 7|nvidia/cuda:10.1-cudnn7-devel-ubuntu16.04|
|tensorrt-6.0-cuda10.0|tensorrt-6.0|||10.0 / 7|cuda:10.0-cudnn7-devel-ubuntu16.04|
