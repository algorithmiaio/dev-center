---
categories: admin-panel
layout: article
title: Configure Logging Output Plugins
---

<h2><span style="font-weight: 400;">Overview</span></h2>
<p><span style="font-weight: 400;">In the past, logs from all Algorithmia services were forwarded to ElasticSearch via Logstash. Acknowledging that customers want the flexibility to use their own pre-existing log-aggregation systems, we&rsquo;ve now added support for Logstash output plugins so that Algorithmia can be configured, through the installer itself, to forward logs to other external systems. This provides developers a more convenient way to access logging output for key operations on the platform, including the algorithm build process and the process of testing the runtime behavior of an already built algorithm.</span></p>
<p><span style="font-weight: 400;">The key changes are as follows:</span></p>
<ol>
<li style="font-weight: 400;" aria-level="1"><span style="font-weight: 400;">Logging output plugins and associated configuration variables have been added to the Logstash installer, and the config file is generated based on those variables.</span></li>
<li style="font-weight: 400;" aria-level="1"><span style="font-weight: 400;">Sensitive files (instance private key files, certificates, etc.) required for the Logstash configuration can now be added through the installer and will be automatically mounted as secrets.</span></li>
</ol>
<h2><span style="font-weight: 400;">Steps</span></h2>
<h3><span style="font-weight: 400;">Generating a new config file</span></h3>
<p><span style="font-weight: 400;">Select which plugin you&rsquo;ll be using, for example the </span><a href="https://www.elastic.co/guide/en/logstash/current/plugins-outputs-syslog.html"><span style="font-weight: 400;">Syslog output plugin</span></a><span style="font-weight: 400;"> or the </span><a href="https://www.elastic.co/guide/en/logstash/current/plugins-outputs-kafka.html"><span style="font-weight: 400;">Kafka output plugin</span></a><span style="font-weight: 400;">, and add the appropriate configuration values. A new config file will be </span><span style="font-weight: 400;">generated based on these variables</span><span style="font-weight: 400;">.</span></p>
<h3><span style="font-weight: 400;">Mounting secrets</span></h3>
<p><span style="font-weight: 400;">To mount your secrets, the steps are as follows:</span></p>
<p>1. Add your secret files to the <code>{deployment}/services/{service}/secrets/</code> directory. Once step 2 is completed, files here will automatically be turned into secrets and mounted. You can also modify this to generate the secret in JKS format.</p>
<p>2. Add the file names to the list of files for the <code>secret_mount_file_names</code> installer variable, located in the <code>unilog-logstash</code> schema ref.</p>
<div class="syn-code-block">
<pre class="code_snippet">plan.services['unilog-logstash'].secret_mount_file_names
</pre>
</div>
<p>&nbsp;</p>
<p>3. Delete and redeploy the current <code>StatefulSet</code> using the installer for the changes to take effect.</p>
<p>Below are listed the complete set of variables that are supported in the <code>unilog-logstash</code> schema ref.</p>
<div class="syn-code-block">
<pre class="code_snippet">
    "unilog_syslog_output_enabled"
      "type" "boolean"
      "default" "false"

    "unilog_syslog_host"
      "type" "string"

    "unilog_syslog_port"
      "type" "integer"
      "default" 514

    "unilog_syslog_security_protocol"
      "type" "string"
      "default" "ssl-tcp"

    "unilog_syslog_key_file_name"
      "type" "string"

    "unilog_syslog_key_passphrase"
      "type" "string"

    "unilog_syslog_cert_file_name"
      "type" "string"

    "unilog_syslog_cacert_file_name"
      "type" "string"

    "unilog_syslog_codec"
      "type" "string"
      "default" "json"

    # used to set an if statement to filter logs based on content
    "unilog_syslog_if_statement"
      "type" "string"

    "unilog_kafka_output_enabled"
      "type" "boolean"
      "default" "false"

    "unilog_kafka_trust_file_name"
      "type" "string"

    "unilog_kafka_truststore_password"
      "type" "string"

    "unilog_kafka_truststore_type"
      "type" "string"
      "default" "JKS"

    "unilog_kafka_key_file_name"
      "type" "string"

    "unilog_kafka_key_password"
      "type" "string"

    "unilog_kafka_jaas_file_name"
      "type" "string"

    "unilog_kafka_id"
      "type" "string"

    "unilog_kafka_topic"
      "type" "string"

    "unilog_kafka_codec"
      "type" "string"
      "default" "json"

    "unilog_kafka_security_protocol"
      "type" "string"

    "unilog_kafka_bootstrap_server"
      "type" "string"

    "unilog_kafka_if_statement"
        "type" "string"

    "unilog_input_generic"
      "type" "string"

    "unilog_filter_generic"
      "type" "string"

    "unilog_output_generic"
      "type" "string"

    "secret_mount_file_names"
      "type" "string"
</pre>
</div>
<p>&nbsp;</p>
<h3><span style="font-weight: 400;">Optional filtering</span></h3>
<p><span style="font-weight: 400;">The following is an example of how some of these variables might be used if you'd like to filter the log output such that logs from specific services are forwarded to specific outputs. Specifically, this uses an <a href="https://github.com/algorithmiaio/unilog-logstash/blob/56ee68e774902bfd0d65a31e3db9db82ee172e98/deploy/schema/plan.schema.json"><code>if</code></a></span><span style="font-weight: 400;"> statement to put only algorithm build and execution logs into the Kafka output, but all logs still flow to syslog.</span></p>
<div class="syn-code-block">
<pre class="code_snippet">if[kubernetes.labels.app] == "langserver" and [kubernetes.container.name] == &ldquo;algo-builder&rdquo;{
  kafka {
    bootstrap_server =&gt; "exampleserver:8080"
    topic_id =&gt; "example_topic"
    security_protocol =&gt; "SASL_SSL"
    ssl_keystore_location =&gt; "/log-export-config/kafka.example.keystore.jks"
    ssl_keystore_password =&gt; &ldquo;examplepass&rdquo;
    ssl_keystore_type =&gt; &ldquo;JKS&rdquo;
    ssl_key_password =&gt; &ldquo;examplepass&rdquo;
    ssl_truststore_location =&gt; "/log-export-config/kafka.example.truststore.jks"
    ssl_truststore_password =&gt; &ldquo;examplepass&rdquo;
    ssl_truststore_type =&gt; &ldquo;JKS&rdquo;
    jaas_path =&gt; "/log-export-config/kafka.example.sasl.jaas"
    security_protocol =&gt; "SASL_SSL"
  }
}
  syslog {
    host =&gt; "syslog.host.foo"
    port =&gt; "443"
    protocol =&gt; "ssl-tcp"
    ssl_cert =&gt; "/log-export-config/client-certificate.crt"
    ssl_key =&gt; "/log-export-config/client-certificate.key"
    ssl_cacert =&gt; "/log-export-config/client-ca-chain.crt"
    rfc =&gt; "rfc3164"
  }
</pre>
</div>
<p>&nbsp;</p>