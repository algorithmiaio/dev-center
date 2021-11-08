# Configure an Amazon Elastic Kubernetes Service (EKS) cluster

The following isn't intended to be complete documentation for provisioning a managed Amazon EKS cluster. Rather, we provide links here to appropriate documentation to get you started, and provide details for how to enable ingress on an existing cluster so as to allow the appropriate network access for [Constellation Distributed Serving](https://training.algorithmia.com/exploring-the-admin-panel/849126).

<span style="color: #843fa1; font-size: 16pt;">NOTE: This feature (and its associated documentation) is currently in **beta**.</span>

## Table of contents

- [Configure an Amazon Elastic Kubernetes Service (EKS) cluster](#configure-an-amazon-elastic-kubernetes-service-eks-cluster)
  - [Table of contents](#table-of-contents)
  - [Creating an Amazon EKS cluster](#creating-an-amazon-eks-cluster)
  - [Connecting to an Amazon EKS cluster](#connecting-to-an-amazon-eks-cluster)
  - [Enabling ingress to an Amazon EKS cluster](#enabling-ingress-to-an-amazon-eks-cluster)
    - [Ingress path-matching patterns](#ingress-path-matching-patterns)

## Creating an Amazon EKS cluster

For guidance on getting set up with a managed Kubernetes cluster on AWS, see the [EKS Quickstart Deployment Guide](https://aws-quickstart.github.io/quickstart-amazon-eks/).

AWS supports [multiple Kubernetes deployment options](https://aws-quickstart.github.io/quickstart-amazon-eks/#_deployment_options) depending on what sort of existing infrastructure you're working with, and provides the following CloudFormation templates for these various deployment scenarios:

*   [Deploy Amazon EKS into a new VPC](https://fwd.aws/6dEQ7)
*   [Deploy Amazon EKS into an existing VPC](https://fwd.aws/e37MA)
*   [Enable EKS based Quick Starts on an existing EKS cluster](https://fwd.aws/VBeX6)

In order to use any of these CloudFormation stacks, you must use a role that itself has permissions to assign permissions and create other roles. Each CloudFormation stack will create a role `eks-quickstart-ManagedNodeInstance` that will be assumed by the role administering the EKS cluster.

The role used needs to be modified to include additional permissions in order for ingress and application load balancing to be configured correctly. The IAM service's AdministratorAccess managed policy provides the sufficient permissions, but you can also use a custom policy with more restrictions if desired. At minimum, the role must have the following two policies attached:

*   AWSWAFFullAccess
*   ElasticLoadBalancingFullAccess

In this guide, we'll walk through the workflow for [deploying an EKS cluster into a new VPC](https://fwd.aws/6dEQ7). The region in which you deploy your EKS cluster references below as `REGION`, and your AWS account number references as `AWS_ACCOUNT_ID`.

To begin, navigate to the link above, which automatically includes the link to the appropriate CloudFormation YAML template, and click **Next**.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1628784200721.png)

Provide a **Stack name** to label this bundle of resources in your account.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1628785389160.png)

Under **Basic configuration**:

*   Specify <span style="font-family: inherit; font-size: 1em;">the desired</span> **Availability Zones** to use for VPC subnets; note that this must match the value of **Number of Availability Zones** further down the page.
*   <span style="font-family: inherit; font-size: 1em;">Optionally, provide an allowed allowed CIDR IP range in the</span> **Allowed external access CIDR** <span style="font-family: inherit; font-size: 1em;">field.</span>
*   Specify the **SSH key name** <span style="font-family: inherit; font-size: 1em;">for the key you'll be using to connect to the cluster once it's provisioned.</span>

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1628785476141.png)

Under **Amazon EC2 configuration**, select **Disabled** to skip provisioning a **bastion host**.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1628785588022.png)

Under **Amazon EKS configuration**:

*   Provide an **EKS cluster name** (this references in the code samples below as `CLUSTER_NAME`).
*   Set **EKS public access endpoint** to **Enabled** to allow EKS API server access from outside of your VPC.
*   Optionally, specify **Additional EKS admin ARN**s to grant EKS cluster management privileges to an additional user and/or role.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1628787135717.png)

Under **Default EKS node group configuration**:

*   Specify the node **Instance type**.
*   Optionally, change **Number of nodes** and **Maximum number of nodes** if non-default values are desired.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1628787355569.png)

Under **Calico policy**, select **Enabled** <span style="font-family: inherit; font-size: 1em;">for</span> **Calico policy integration**.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1628787514014.png)

Click **Next**. On the **Configure stack options** page, optionally select a specific **IAM role** for CloudFormation to use to take actions on stack resources. If left blank, the current user's credentials will be used.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1628787725651.png)

Click **Next**. Check the appropriate boxes to allow CloudFormation to create resources, and click **Create stack**.  

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1628787793921.png)

Once the stack is created, generate the `kubeconfig` file by setting AWS credential environment variables for one of the authorized admin roles (the role that created the stack or the one provided in the optional field above) and running the following:

<div class="syn-code-block">

<pre class="code_snippet">$ aws eks --region **REGION** update-kubeconfig --name **CLUSTER_NAME**
</pre>

</div>

Create an Elastic Container Registry (ECR) with all repositories required for the satellite. You'll get the `SATELLITE_ID` value from the Algorithmia side; see the [Satellite deployment](https://training.algorithmia.com/exploring-the-admin-panel/849126#satellite-deployment) section of the Constellation Distributed Serving documentation.

<div class="syn-code-block">

<pre class="code_snippet">$ aws ecr create-repository --repository-name **ECR_NAME**/satellite-**SATELLITE_ID** \
    --image-scanning-configuration scanOnPush=false --region **REGION**
$ aws ecr create-repository --repository-name **ECR_NAME**/rabbitmq \
    --image-scanning-configuration scanOnPush=false --region **REGION** 
$ aws ecr create-repository --repository-name **ECR_NAME**/codex-install \
    --image-scanning-configuration scanOnPush=false --region **REGION**
$ aws ecr create-repository --repository-name **ECR_NAME**/execution-engine \
    --image-scanning-configuration scanOnPush=false --region **REGION**
$ aws ecr create-repository --repository-name **ECR_NAME**/algorithm-queue-reader \
    --image-scanning-configuration scanOnPush=false --region **REGION**
</pre>

</div>

[Log in](https://docs.aws.amazon.com/AmazonECR/latest/userguide/registry_auth.html) to the ECR.

<div class="syn-code-block">

<pre class="code_snippet">$ aws ecr get-login-password --region **REGION** \
    | docker login --username **AWS_ACCOUNT_ID** --password-stdin \
      **AWS_ACCOUNT_ID**.dkr.ecr.**REGION**.amazonaws.com
</pre>

</div>

Note that if you need to modify administrative permissions on the EKS cluster after it's provisioned, you can add a cluster administrator by modifying the `aws-auth` configmap as follows:

<div class="syn-code-block">

<pre class="code_snippet">- groups:
  - system:masters
    rolearn: arn:aws:iam::**AWS_ACCOUNT_ID**:role/**USER_ARN**
    username: arn:aws:iam::**AWS_ACCOUNT_ID**:role/**USER_ARN** </pre>

</div>

## Connecting to an Amazon EKS cluster

Once you've provisioned your EKS cluster using the quickstart guide linked above, you can connect to it to [Test the Deployment](https://aws-quickstart.github.io/quickstart-amazon-eks/#_test_the_deployment).

## Enabling ingress to an Amazon EKS cluster

EKS has some built-in integrations with [application load balancing](https://docs.aws.amazon.com/eks/latest/userguide/alb-ingress.html "https://docs.aws.amazon.com/eks/latest/userguide/alb-ingress.html") and [network load balancing](https://docs.aws.amazon.com/eks/latest/userguide/network-load-balancing.html "https://docs.aws.amazon.com/eks/latest/userguide/network-load-balancing.html"). For the [Ingress Kubernetes resource](https://kubernetes.io/docs/concepts/services-networking/ingress/), you can work with application load balancing on EKS. When an `Ingress` resource is deployed, an application load balancer (ALB) will automatically be created and target groups should be assigned. In the [EC2 management console](https://console.aws.amazon.com/ec2/) under **Load Balancing**, the ALB should be listed under **Load Balancers** and the target groups should be listed under **Target Groups**.

In order to have these resources generated automatically, the `Ingress` resource needs to have the following specific annotations:

<div class="syn-code-block">

<pre class="code_snippet">  annotations:
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/target-type: ip
    kubernetes.io/ingress.class: alb
</pre>

</div>

Note that the asterisk (`*` ) isn't permitted in the `PathPrefix` path-matching pattern:

<div class="syn-code-block">

<pre class="code_snippet">  rules:
  - http:
      paths:
      - backend:
          serviceName: execution-engine
          servicePort: 80
        path: /v1/algo/
        pathType: Prefix
</pre>

</div>

If configured correctly, the `Ingress` resource should have an address defined:

<div class="syn-code-block">

<pre class="code_snippet">$ kubectl get ingress -n algo execution-engine
NAME               CLASS    HOSTS   ADDRESS                                                               PORTS   AGE
execution-engine   <none>   *       k8s-algo-executio-3b5a580f3b-4934167255.us-east-2.elb.amazonaws.com   80      21h
</pre>

</div>

### Ingress path-matching patterns

Note that tor AKS, the `PathPrefix` ingress type isn't a regular expression but rather complies with the following patterns:

*   `/v1/algo/*` will forward any `/v1/algo/.*` route
*   `/v1/algo/.*` will match the literal route `/v1/algo/.*`