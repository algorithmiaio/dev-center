---
categories: admin-panel
layout: article
title: Secret Store
---

Algorithmia's Secret Store enables you to securely store sensitive data like credentials and access tokens to be accessed from within your algorithms. To learn how to set and modify secrets and how to then retrieve them from within your algorithms, see our [Developer Center docs](https://algorithmia.com/developers/platform/algorithm-secrets). Note that the Secret Store is first available in Algorithmia version 20.5.52.

The **Secret Store** page in the admin panel contains information on how to create plugins so that you can add external secret providers.

## Security

We take security seriously at Algorithmia, and this is especially true with our Secret Store. We employ the following strategies on our platform to protect your sensitive data:

*   Secret values are only decrypted on the target worker node.
*   Secret values are encrypted by the provider plugin on the web-server. Note that it's the plugin author's job to ensure encryption happens before the value is sent to the underlying storage mechanism, via encryption within the plugin and/or via secure transport (e.g., HTTPS).
*   All internal network traffic (including secret metadata) is secured via IPsec at the network level.

## Internal Secret Store

We provide an internal Secret Store plugin that's loaded by default in every cluster. This plugin stores secrets in the internal database that backs the Algorithmia application, and in our implementation, secret values are encrypted before being written to that database. Depending on your cluster settings, the entire database may also be encrypted on disk. The default internal plugin appears as **Internal Secret Provider** in the UI, as shown below.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1623877064419.png)

## Secret provider plugins

### How to write a secret provider plugin

To use an external secret provider, you must write a Java plugin; this [GitHub repository](https://github.com/algorithmiaio/plugin-sdk) has the implementation details. Below, we also provide example plugin implementations for [Hashicorp Vault](#hashicorp-vault) and [Azure Key Vault](#azure-key-vault).

The general steps to create a plugin are as follows:

1.  Create a new Java project.
2.  Add the algorithmia `plugin-sdk` maven package as specified in the README.
3.  Implement the "secrets" interfaces found [here](https://github.com/algorithmiaio/plugin-sdk/tree/master/src/main/java/com/algorithmia/sdk/plugin/secrets), noting that:
    1.  `SecretProviderFactory` is the entry point that will be used to instantiate your provider by calling the `create` method.
    2.  `SecretProvider` will do the heavy lifting.
    3.  We provide a `SimpleSecret` class to wrap basic secret values/TTL. It implements the `Secret` interface, so you may choose to use your own implementation instead of a `SimpleSecret`.
    4.  Follow the JavaDoc for the interface methods to determine how each method should behave.
4.  Export your project as a JAR file with your classes.

### How to import a Secret Store provider plugin

To use a secret provider plugin on your Algorithmia cluster, you must import it. You can do this either through the browser UI or through the admin API; both processes are described below.

#### Importing a secret provider plugin through the browser UI

Within the Algorithmia browser UI, navigate to the **Secret Store** page on the admin panel, accessible at `/admin/secret-store`.

In the upper-right corner, click the **New Provider** button and fill out the form as follows:

*   **Name** and **Description** are used in the UI when creating a new secret for an algorithm. These values should be meaningful, so that users creating secrets can use them to differentiate between the providers.
*   **Upload module** is where you upload the JAR file created from your provider plugin.
*   **Provider factory classname** is the name of the class that implements the `SecretProviderFactory` interface, e.g., `com.algorithmia.plugin.vault.VaultSecretProviderFactory`. Key-value pairs are passed as a `Map<String, String>` to the `SecretProviderFactory.create` method and are encrypted before being stored in the Algorithmia application's database. For details on which key-value pairs are required, see the **Key-value** pairs section for your provider of interest in the examples below.
*   Click the **Add Secret Provider** button to add the provider.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1624998443467.png)

#### Importing a Secret Store provider plugin through the admin API

To upload a JAR file via the API, you can use the `/v1/admin/secret-provider` endpoint.

The code sample below shows how you can create a secret provider with cURL. Note that you'll need to substitute `ADMIN_API_KEY` with a valid [admin API key](https://algorithmia.com/developers/platform/customizing-api-keys#admin-api-keys), and `CLUSTER_DOMAIN` with your specific cluster's domain name. The remaining parameters match the field names from the section above, where `moduleName` is the name of the JAR file that you uploaded, and the key-value pairs specified under `configuration` are plugin-specific required parameters that depend on the secret provider (the specifics are listed in the READMEs for each respective [plugin example](#example-plugin-implementations)).

<div class="syn-code-block">

<pre class="code_snippet">$ curl https://api.CLUSTER_DOMAIN/v1/admin/secret-provider \
    -X POST \
    -H 'Authorization: Simple ADMIN_API_KEY' \
    -H 'Content-Type: application/json' \
    -d '{
      "name": "string",
      "description": "string",
      "moduleName": "string",
      "factoryClassName": "string",
      "interfaceVersion": "string",
      "configuration": {
        "key_1": "value_1"
      },
      "isEnabled": true,
      "isDefault": true
    }'
</pre>

</div>

When you run the command above you'll receive a response payload with the `providerID` value that's been assigned to the new provider. To upload the JAR file, run the following command, substituting this `providerID` value for `PROVIDER_ID` in the URI, as well as the values for your admin API key and local file path.

<div class="syn-code-block">

<pre class="code_snippet">$ curl https://api.CLUSTER_DOMAIN/v1/admin/plugins/secret-provider/PROVIDER_ID
    -X POST
    -H 'Authorization: Simple ADMIN_API_KEY' \
    -F 'provider=@/LOCAL/PATH/TO/YOUR/MODULE.jar'
</pre>

</div>

### Example Secret Store provider plugins

By writing a Secret Store provider plugin, you can integrate external vault systems, such as Azure Key Vault and Hashicorp Vault, with Algorithmia. **The following are provided as example plugin implementations, but note that they're included to provide guidance only and aren't supported or included in the scope of [Algorithmia Support](https://algorithmia.com/developers/support).**

#### Hashicorp Vault

##### Example plugin implementation

An example implementation of a Hashicorp Vault plugin is available in [this GitHub repository](https://github.com/algorithmiaio/secret-store-provider-vault), the README of which contains instructions for implementing and configuring the plugin. **Note that this is unsupported and provided as an example only.**

##### Key-value pairs

When you [create a new provider](#how-to-import-a-secret-provider-plugin) and upload the plugin module, you'll need to specify the following key-value pairs.

*   **vault_addr**: the address to reach the vault API
*   **vault_token**: the token used to access the vault
*   **vault_secret_path**: the path that will be prefixed to all secrets managed by this plugin

#### Azure Key Vault

##### Example plugin implementation

An example implementation of an Azure Key Vault plugin is available in [this GitHub repository](https://github.com/algorithmiaio/secret-store-provider-azure-key-vault), the README of which contains instructions for implementing and configuring the plugin. **Note that this is unsupported and provided as an example only.**

##### Key-value pairs

When you [create a new provider](#how-to-import-a-secret-provider-plugin) and upload the plugin module, you'll need to specify the following key-value pairs. These are passed directly to the corresponding options of the [Azure KeyVault java SDK](https://docs.microsoft.com/en-us/azure/key-vault/secrets/quick-create-java?tabs=azure-cli#authenticate-and-create-a-clientr) `SecretClientBuilder` class via the `ClientSecretCredentialBuilder.`

*   **vault_url**: the Azure Key Vault URL
*   **client_id**: the Azure Client ID (UUID)
*   **client_secret**: the Azure token to authenticate to Azure
*   **tenant_id**: the Azure tenant ID (UUID)