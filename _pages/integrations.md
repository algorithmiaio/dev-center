---
excerpt: "A guide to Algorithmia's integrations with external tools, services, and platforms."
layout: article_page
permalink: /integrations/
show_related: false
tags: [app-guide-overview]
title:  "Integrations"
---

Algorithmia strives to integrate seamlessly with the services and products you're already using in your machine learning workflows. For many popular external services, protocols, and tools, we provide built-in, native integrations. For others, we provide documentation for patterns of integration.

This page describes the specific capabilities of our platform with respect to a number of popular tools. Note that this isn't an exhaustive list of services that you can use with Algorithm; you're encouraged to use whatever data science tools best fit your needs, and we'll help you integrate them successfully with our platform.

<span id="enterprise-only"></span>

Integrations denoted with a "*" are available to Algorithmia Enterprise users only.
{: .notice-enterprise}

### AuthN/Z protocols[*](#enterprise-only)

We support the following [Single Sign-on (SSO)](https://en.wikipedia.org/wiki/Single_sign-on) protocols for controlling resource access:

* JSON Web Token / JSON Web Key Set (JWT/JWKS) ([docs](/developers/administration/admin-config/jwt-authentication) \| [website](https://jwt.io/))
  * JWT/JWKS can be used as authentication tokens, enabling external management of group membership through group sync.
* OpenID Connect (OIDC) ([website](https://auth0.com/docs/protocols/openid-connect-protocol))
  * OIDC can be used for obtaining authentication tokens.
* Security Assertion Markup Language (SAML) ([docs](/developers/administration/admin-config/saml-authentication) \| [website](https://en.wikipedia.org/wiki/Security_Assertion_Markup_Language))
  * SAML providers can be used to obtain authentication tokens, enabling external management of group membership. We are SAML 2.0 compliant and support major identity providers such as Microsoft active directory (AD) and Google.

### CI/CD tools

We are compatible with the following CI/CD tools:

* GitHub Actions ([docs](/developers/algorithm-development/ci-cd#github-actions) \| [website](https://docs.github.com/en/actions))
* GitLab CI/CD ([website](https://docs.gitlab.com/ee/ci/))
* Jenkins ([docs](/developers/algorithm-development/ci-cd#jenkins) \| [website](https://www.jenkins.io/))

### Data connectors

We integrate natively with the following cloud storage providers, enabling algorithms to read data from and/or write data to accounts on these platforms:

* Amazon Simple Storage Service (S3) ([docs](/developers/data/s3) \| [website](https://aws.amazon.com/s3/))
* Azure Blob Storage ([docs](/developers/data/azureblob) \| [website](https://azure.microsoft.com/en-us/services/storage/blobs/))
* Dropbox ([docs](/developers/data/dropbox) \| [website](https://dropbox.com/))
* Google Cloud Storage ([docs](/developers/data/googlecloudstorage) \| [website](https://cloud.google.com/storage))

### External data sources

We support the use of third-party SDKs that you provide to access any data system of your choice, including (but not limited to):

* Backblaze B2 ([docs](/developers/other-data-sources/backblazeb2) \| [website](https://www.backblaze.com/b2/cloud-storage.html))
* BigQuery ([website](https://cloud.google.com/bigquery))
* DynamoDB ([docs](/developers/other-data-sources/dynamodb) \| [website](https://aws.amazon.com/dynamodb/))
* Hadoop Distributed File System (HDFS) ([docs](/developers/other-data-sources/hdfs) \| [website](https://hadoop.apache.org/))
* MS SQL Server ([docs](/developers/sql-patterns/mssqlserver) \| [website](https://www.microsoft.com/en-us/sql-server/sql-server-downloads))
* MySQL ([docs](/developers/sql-patterns/mysql) \| [website](https://www.mysql.com/))
* PostgreSQL ([docs](/developers/sql-patterns/postgres) \| [website](https://www.postgresql.org/))
* Snowflake ([docs](/developers/other-data-sources/snowflake) \| [website](https://www.snowflake.com/cloud-data-platform/))

### External model training and data platforms

We're compatible with the following platforms commonly used upstream in the ML pipeline:

* DataBricks ([website](https://databricks.com/))
* DataRobot ([docs](/developers/integrations/datarobot) \| [website](https://www.datarobot.com/platform/))
* Jupyter ([website](https://jupyter.org/))
* MLFlow ([docs](/developers/clients/mlflow) \| [website](https://www.mlflow.org/))
* SageMaker ([docs](/developers/integrations/sagemaker) \| [website](https://aws.amazon.com/sagemaker/))
* Spark Streaming ([docs](/developers/integrations/spark-streaming) \| [website](https://spark.apache.org/docs/latest/streaming-programming-guide.html))
* YData ([blog](https://algorithmia.com/blog/ydata-and-algorithmia-high-quality-data-meets-enterprise-mlops) \| [website](https://ydata.ai/))

### Event-driven workflows[*](#enterprise-only)

We integrate natively with the following external message brokers. Algorithms can send data to, as well as consume data from, these brokers:

* Amazon Simple Queue Service (SQS) ([docs](/developers/integrations/amazon-sqs) \| [website](https://aws.amazon.com/sqs/))
* Apache Kafka ([docs](/developers/integrations/kafka) \| [website](https://kafka.apache.org/))
* Azure Service Bus (SB) ([docs](/developers/integrations/azure-sb) \| [website](https://azure.microsoft.com/en-us/services/service-bus/))

### Monitoring and observability[*](#enterprise-only)

Non-Enterprise users may use these monitoring and observability platforms directly from their algorithms (without Kafka) using standard SDKs.
{: .notice-enterprise}

With [Algorithmia Insights](/developers/integrations/insights), we have the built-in capability to export operational and **algorithm** inference metrics to external **Kafka** **message brokers** from which the data can be consumed by external platforms for **model monitoring, model observability**, and alerting. There are multiple platforms that integrate with Algorithmia for this purpose, including (but not limited to):

* Arize ([docs](/developers/integrations/arize) \| [website](https://arize.com/))
* Arthur ([docs](/developers/integrations/arthur) \| [website](https://www.arthur.ai/))
* Datadog ([docs](/developers/integrations/datadog) \| [website](https://www.datadoghq.com/))
* InfluxDB ([docs](/developers/integrations/influxdb) \| [website](https://www.influxdata.com/))
* New Relic ([docs](/developers/integrations/newrelic) \| [website](https://newrelic.com/))
* Splunk ([website](https://www.splunk.com/))

### Secret Store

We have a secure, encrypted, built-in solution in which you can store secrets for use by algorithms at execution time. We also integrate with external secret-management systems, including (but not limited to):

* Azure Key Vault[*](#enterprise-only) ([docs](/developers/administration/admin-panel/secret-store/#azure-key-vault) \| [website](https://azure.microsoft.com/en-us/services/key-vault/))
* Hashicorp Vault[*](#enterprise-only) ([docs](/developers/administration/admin-panel/secret-store/#hashicorp-vault) \| [website](https://www.vaultproject.io/))

### Source code management (SCM) providers

We can host your source code within Algorithmia internally, and we also integrate natively with the following Git-based SCM providers, enabling you to host your algorithm source code on these platforms:

* Bitbucket Cloud ([docs](/developers/algorithm-development/source-code-management#hosting-source-code-on-bitbucket-cloud) \| [website](https://bitbucket.org/product/))
* Bitbucket Server[*](#enterprise-only) ([docs](/developers/algorithm-development/source-code-management#hosting-source-code-on-bitbucket-server) \| [website](https://www.atlassian.com/software/bitbucket/enterprise))
* GitHub / GitHub Enterprise ([docs](/developers/algorithm-development/source-code-management#hosting-source-code-on-github) \| [website (GitHub)](https://github.com/) \| [website (GitHub Enterprise)](https://github.com/enterprise))
* GitLab ([docs](/developers/algorithm-development/source-code-management#hosting-source-code-on-github) \| [website](https://about.gitlab.com/))
