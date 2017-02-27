---
layout: article
title: "PHP"
categories: clients
tags: [clients]
show_related: true
image:
    teaser: /language_logos/php.svg
---

The PHP client is still in development.  For now, you can use cURL inside your PHP code to call any algorithm:

#### Calling an algorithm via cURL in PHP

{% highlight php %}
<?php

  // get your API Key at http://algorithmia.com/user#credentials
  $api_key = 'YOIR_API_KEY';
  
  // pick an algorithm at http://algorithmia.com/algorithms/ -- and append a version number
  $algorithm = 'util/Echo/0.2.1';
  
  // most algorithms accept JSON Objects
  $data = array('hello' => 'world');
  $data_json = json_encode($data);
  
  // prepare cURL to algorithm endpoint
  $ch = curl_init();
  $headers = array(
    'Content-Type: application/json',
    'Authorization: Simple ' . $api_key,
    'Content-Length: ' . strlen($data_json)
  );
  curl_setopt_array($ch, array(
    CURLOPT_URL => 'https://api.algorithmia.com/v1/algo/' . $algorithm,
    CURLOPT_HTTPHEADER => $headers,
    CURLOPT_POSTFIELDS => $data_json,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true
  ));
  
  // run the algorithm and get the results (usually a JSON-encoded string)
  $response_json = curl_exec($ch);
  curl_close($ch);
  $response = json_decode($response_json);
  
  // $response->result contains algorithm results (if any)
  // $response->error contains errors (if any)
  // $response->metadata has meta-information
  if($response->error) {
    print('ERROR: ');
    print_r($response->error);
  } else {
    print_r($response->result);
  }

?>
{% endhighlight %}

#### Additional information

While most algorithms accept JSON Objects, you can also use `Content-Type: text/plain` for ones which require bare string input, or `Content-Type: application/octet-stream` for those that require a binary (such as an image file). Adjust the lines containing `$data_json` as needed.

See the full [cURL Client Guide]({{ site.baseurl }}/clients/curl) and [API Specification](http://docs.algorithmia.com/#api-specification) for additional details
on calling algorithms and managing data with cURL.
