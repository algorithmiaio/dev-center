---
layout: article
title: "Perl"
categories: clients
tags: [clients]
show_related: true
image:
    teaser: /language_logos/perl.svg
---

The Perl client is still in development.  For now, you can do a raw POST inside your Perl code to call any algorithm:

#### Calling an algorithm in Perl

{% highlight perl %}
  
use LWP::UserAgent;

# get your API Key at http://algorithmia.com/user#credentials
my $api_key = 'YOUR_API_KEY';

# pick an algorithm at http://algorithmia.com/algorithms/ (and append a version number)
my $algo = 'util/Echo/0.2.1';

# most algorithms accept JSON Objects
my $post_data = '{ "hello": "world" }';

# prepare POST to algorithm endpoint
my $req = HTTP::Request->new(POST => 'http://api.algorithmia.com/v1/algo/'.$algo);
$req->header('content-type' => 'application/json');
$req->header('Authorization' => 'Simple '.$api_key);

# run the algorithm and get the results (usually a JSON-encoded string)
$req->content($post_data);
my $ua = LWP::UserAgent->new;
my $resp = $ua->request($req);

# if the POST succeeds, the returned $resp->decoded_content will usually
# contain JSON with either a 'response' field or an 'error' field
# consider using JSON::Parse to decode: http://search.cpan.org/perldoc?JSON::Parse
if ($resp->is_success) {
    print $resp->decoded_content;
} else {
    print 'POST error: ', $resp->code, ': ', $resp->message;
}
{% endhighlight %}

#### Additional information

While most algorithms accept JSON Objects, you can also use `Content-Type: text/plain` for ones which require bare string input, or `Content-Type: application/octet-stream` for those that require a binary (such as an image file). Adjust the line beginning with `my $post_data` as needed.

See the full [cURL Client Guide]({{ site.baseurl }}/clients/curl) and [API Specification](http://docs.algorithmia.com/#api-specification) for additional details
on calling algorithms and managing data with POSTs.
