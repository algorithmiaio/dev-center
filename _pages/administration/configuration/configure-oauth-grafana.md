# Configuring OAuth for Grafana

The following variables have been added to the installer. These variables correlate 1:1 with the options exposed in the official [Generic OAuth authentication](https://grafana.com/docs/grafana/latest/auth/generic-oauth/) Grafana plugin.

<div class="syn-code-block">

<pre class="code_snippet">services_grafana_oauth_enabled
services_grafana_oauth_name
services_grafana_oauth_allow__sign__up
services_grafana_oauth_client__id
services_grafana_oauth_client__secret
services_grafana_oauth_scopes
services_grafana_oauth_empty__scopes
services_grafana_oauth_email__attribute__name
services_grafana_oauth_email__attribute__path
services_grafana_oauth_login__attribute__path
services_grafana_oauth_name__attribute__path
services_grafana_oauth_id__token__attribute__name
services_grafana_oauth_auth__url
services_grafana_oauth_token__url
services_grafana_oauth_api__url
services_grafana_oauth_allowed__domains
services_grafana_oauth_team__ids
services_grafana_oauth_allowed__organizations
services_grafana_oauth_role__attribute__path
services_grafana_oauth_role__attribute__strict
services_grafana_oauth_groups__attribute__path
services_grafana_oauth_tls__skip__verify__insecure
services_grafana_oauth_tls__client__cert
services_grafana_oauth_tls__client__key
services_grafana_oauth_tls__client__ca
</pre>

</div>

All values are passed directly to the Grafana config (`grafana.ini`) file. For example, `services_grafana_oauth_client__id` will be rendered into the config file as follows:

<div class="syn-code-block">

<pre class="code_snippet">[auth.generic_oauth]
client_id = **YOUR_CLIENT_ID**
</pre>

</div>