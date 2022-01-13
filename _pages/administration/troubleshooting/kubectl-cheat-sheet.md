---
categories: troubleshooting
layout: article
title: "kubectl cheat sheet"
---

This guide serves as a cheat sheet for the Kubernetes and related commands that are most often needed for managing an Algorithmia (DataRobot) cluster. See the [Official kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/) for a comprehensive list of Kubernetes commands, or for a more concise listing, see [Linux Academy's Kubernetes Cheat Sheet](https://linuxacademy.com/site-content/uploads/2019/04/Kubernetes-Cheat-Sheet_07182019.pdf).

## Algorithmia cluster access

In order to run `kubectl` commands ot manage a DataRobot (Algorithmia) cluster, you'll first need to access it. All Algorithmia clusters have a bastion host that serves as a trusted access point to view the status of and take actions on cluster resources. Before attempting to access a cluster, please ensure that you have the appropriate permissions and credentials.

To access a cluster:

- SSH into the bastion host using your credentials
- Run `docker ps` to identify the correct Docker container (`DOCKER_CONTAINER_ID`)
- Run `docker exec -it <DOCKER_CONTAINER_ID> /bin/bash`
- Run `export KUBECONFIG=/home/algo/<DEPLOYMENT_DIRECTORY>`
- Run `kubectl get pods` to ensure that you can run `kubectl` commands

If you're having any issues with the above, first confirm that you can access the cluster with your credentials. Verify that the VM you are trying to access is active and healthy in the control panel of your cloud provider. Contact DataRobot support if you are unable to run  `kubectl` commands.

!!! Note Specifying resource types with `kubectl`
    For most resource types, `kubectl` doesn't distinguish between the plural and singular form. Thus, for example, `kubectl get pod` is equivalent to `kubectl get pods`. In this guide, for consistency we mainly use the plural forms.

## Common commands

Below are commonly used Kubernetes and related commands for managing your Algorithmia cluster. Please keep this reference guide handy when working with our support team. Note that these commands are specific to a cloud environment and may be different for on-premise deployments.

```bash
# @Neely: what does this do? delete persistent data? I'd like to move it to a more specific section below
kubectl exec -it unilog-es-master-0 -- rm -rf /usr/share/elasticsearch/data/nodes
kubectl exec -it unilog-es-master-1 -- rm -rf /usr/share/elasticsearch/data/nodes
kubectl exec -it unilog-es-master-2 -- rm -rf /usr/share/elasticsearch/data/nodes

# List running Docker containers (include stopped containers with `-a/--all`)
sudo docker ps [-a]

# Get a bash shell in a running container
sudo docker exec -it <CONTAINER_NAME> bash

# Identify the Kubernetes configuration file that kubectl should use
export KUBECONFIG=/home/algo/deployment/current/xxx.config

# @Neely: was there a specific endpoint example you want to include?
curl -v ...
```

## Nodes

The typical cloud cluster VM configuration has the following:

- 1 bastion host (you can access this host by following the [above steps](#common-kubectl-commands))
- 3 Kubernetes control plane nodes
- 3 Kubernetes general purpose nodes
- 1 Legit (Git server) node
- a variable number of CPU and GPU nodes depending on the cluster’s workload and configuration

```bash
# Get verbose node configuration details
kubectl describe nodes [<NODE_NAME>]

# Get node name, status, role, and IP address
kubectl get nodes [<NODE_NAME>] --show-labels -o wide

# Get node disk and memory usage
kubectl top nodes
```

## Pods

```bash
# Get pod name, status, age, IP address, as well as number of ready pods and the node they are on
kubectl describe pods [<POD_NAME>]

# Get pod names, number ready, status, number of restarts, age, and labels
kubectl get pods --show-labels -o wide

# Get pods with specific label
kubectl get pods -l app=<LABEL>
kubectl get pods -l app=api-server # example

# Get only healthy pods
# @Neely: could this just be the opposite of the unhealthy pods cmd below?
kubectl get pods | grep -v Running

# Get only unhealthy pods
kubectl get pods –field-selector=status.phase!=Running –all-namespaces

# Watch pods with specific name
kubectl get pods -n wordpress --watch

# Get pod information
kubectl describe pods <POD_NAME>

# Get pod disk and memory usage
kubectl top pods

# Delete pod
kubectl delete pods <POD_NAME>

# Force-delete pod
kubectl delete pods <POD_NAME> --grace-period=0 --force

# Delete pods by label
kubectl delete pods -l env=<LABEL>

# Example: force-delete pods with specific labels
kubectl delete pods --force --grace-period=0 pod -l app=unilog-es-master
kubectl delete pods --force --grace-period=0 pod -l app=unilog-es-client
kubectl delete pods --force --grace-period=0 pod -l app=unilog-kibana
```

## Logs

```bash
# Get pod logs for a specific pod
kubectl logs <POD_NAME>

# Get pod logs for pods with a specific label
kubectl logs -l name=<LABEL>
```

# Performing maintenance tasks on nodes

```bash
# Scale pods on a node
kubectl scale --replicas=3 deployment <APP_NAME>

# Mark node as unschedulable
kubectl cordon <NODE_NAME>

# Drain pods from node
kubectl drain <NODE_NAME>

# Mark node as schedulable
kubectl uncordon <NODE_NAME>
```
