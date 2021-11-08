---
categories: admin-panel
layout: article
title: Insights
---

Insights is an algorithm metrics pipeline that enables you to monitor and manage algorithms in production using external monitoring and observability tools. You can use Insights for both operational and inference-related metrics, for example to capture algorithm execution times and prediction accuracy, in order to monitor performance, anomalies, and model drift. Insights is a global configuration on your Algorithmia cluster; once enabled, you can use it with any algorithm that has Insights enabled, and each algorithm request will generate an Insights payload along with the normal API response.

To use Insights, you must configure a connection from your Algorithmia cluster to a Kafka broker*, and from your external monitoring platform to that broker. You can then define topics to which your selected algorithm metrics will be published, and configure the  monitoring platform to subscribe to those topics in order to consume the data sent from Algorithmia. F<span style="font-family: inherit; font-size: 1em;">or details on how to</span> send data from within your algorithms, see<span style="font-family: inherit; font-size: 1em;">the</span> [docs for the user-facing Insights feature](/developers/algorithmia-enterprise/algorithmia-insights)<span style="font-family: inherit; font-size: 1em;">. (*In this guide, the terms "Kafka broker" and "Kafka cluster" are both used to refer to the external Kafka configuration).</span>

## One-time Kafka connection configuration

To enable algorithms to send data through Insights, you must first connect your Algorithmia cluster to a Kafka broker. The <span style="font-family: inherit; font-size: 1em;">**Insights** page on the admin panel</span> <span style="font-family: inherit; font-size: 1em;">provides an interface to configure and manage this Kafka connection.</span>

<span style="font-family: inherit; font-size: 1em;">To begin, c</span>lick on the **Connect to Kafka** button (or click **Edit Connection** to modify an existing connection).

In the configuration modal, enter a **topic name** to identify the [Kafka topic](https://kafka.apache.org/documentation/#intro_concepts_and_terms) to which Algorithmia Insights will be published.

In the **Kafka broker URL(s)** field, enter a list of comma-separated [Kafka bootstrap servers](https://kafka.apache.org/documentation/#bootstrap.servers) in the form `host1:port1,host2:port2,...`. Algorithmia uses these servers to establish the initial connection to the Kafka cluster. The list <span style="font-family: inherit; font-size: 1em;">only impacts the initial hosts used to discover the full cluster membership, and it</span> need not contain the full set of servers. However, b<span style="font-family: inherit; font-size: 1em;">ecause cluster membership can</span> change dynamically, and because a server may be down, we recommend specifying more than one `host:port` for this bootstrapping process.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1621630844570.png)

Next, choose a **connection type**. Algorithmia supports both an encrypted and unencrypted option:

*   **SASL/SCRAM** ([Simple Authentication and Security Layer](https://en.wikipedia.org/wiki/Simple_Authentication_and_Security_Layer) / [Salted Challenge Response Authentication Mechanism](https://en.wikipedia.org/wiki/Salted_Challenge_Response_Authentication_Mechanism)) over TLS: This provides encrypted communications, authentication credential database breach protection, [man-in-the-middle](https://en.wikipedia.org/wiki/Man-in-the-middle_attack) attack protection, and internationalization support. Please see the [Kafka SCRAM setup guide](https://kafka.apache.org/documentation/#security_sasl_scram) for information on configuring a Kafka cluster to support this configuration.
*   **Unencrypted/plaintext**: This provides all the features of Insights for use without encryption or authentication safeguards. It facilitates testing and prototyping and can be used in networks with existing robust protection against attacks.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1621630920138.png)

If you select the unencrypted option, you don't need to provide any additional information and you can click the **Connect** button to create the connection.

For the encrypted, SCRAM-authenticated connection, you'll need to fill out the following additional fields:

*   **SASL mechanism:** the challenge/response protocol to be used
*   **Kafka broker username**: the username used to authenticate to the Kafka cluster
*   **Kafka broker password**: the password used to authenticate to the Kafka cluster
*   **CA certificate**: the Certificate Authority (CA) certificate used to sign the TLS certificates that the Kafka servers use for communication

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1621631804342.png)

Click the **Connect** button to create the connection.

It's the Algorithmia cluster admin’s responsibility to ensure that Kafka traffic (which operates over TCP) routes successfully from the Algorithmia platform to all the Kafka bootstrap servers in the **Kafka URL** list (on their specified ports) _and_ to all the Kafka cluster members reported by those bootstrap servers (on their specified ports).

For each execution of an algorithm for which the Insights feature is enabled, Algorithmia will perform multiple attempts to send data to Kafka, over the course of four minutes. If, after that duration, the data cannot be sent successfully to the configured Kafka cluster for _any_ reason (e.g., Kafka server offline, failed authenticated, network disconnections, etc.), the data for that specific execution will be lost permanently.

Once the connection is established, algorithms can be configured to log Insights data to the configured broker. F<span style="font-family: inherit; font-size: 1em;">or details on how to</span> send data from within your algorithms, see<span style="font-family: inherit; font-size: 1em;">the</span> [docs for the user-facing Insights feature](/developers/algorithmia-enterprise/algorithmia-insights)<span style="font-family: inherit; font-size: 1em;">.</span>