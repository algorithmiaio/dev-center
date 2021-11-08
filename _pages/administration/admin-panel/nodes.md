# Nodes

The Nodes page provides an interface through which you can view your Algorithmia cluster's Kubernetes node configuration and manage basic configuration properties if required.

## Kubernetes nodes

This table lists the name, address, status, and last heartbeat time of each Kubernetes node running in your cluster, as well as the pods running on each node. By default Algorithmia is configured with three control plane nodes, but your cluster may have more (these nodes were previously called "master" nodes, which is how they're labeled in the screenshot below). 

As discussed in the "Capacity Overview" section of the lesson describing the [dashboard](./687276) page, your Algorithmia instance is configured with a number of worker nodes (CPU or GPU compute instances) that process API requests to execute algorithms. These worker nodes can optionally be displayed in this table by checking the "Show Workers" box at the upper-left corner, and more information on these nodes can be found in the [workers](./773449) page.

This table also displays the node for Algorithmia's internal Git server as well as several general purpose nodes for other services on the platform. To view logs for a specific pod, click the chart icon next to the pod name in the "Pods" column. To access the Grafana dashboard for a given service, click on the "server" link in the "Charts" column.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1616788830365.png)

## API servers

This table lists the IP address, status, last heartbeat time, usage statistics, and physical infrastructure location of each active API server.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1616789091903.png)

## Web servers

This table lists the IP address and name of each active web server.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1616789344430.png)