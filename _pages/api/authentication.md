---
layout: docs_article
title:  "API Authentication"
---

## API Keys

{% include aside-start.html %}

API requests are authenticated by a key which can be found and managed from your user profile.
With every call to the API, the user must be authenticated. The API has a simple means to do this by passing in your key as an HTTP "Authorization" header with the request.

When you signed up for Algorithmia, a 'default-key' was generated for your convenience. This is the key that is used throughout the example code within algorithm pages. For these examples to work correctly, this default key must exist with all the permissions, otherwise the usage examples may result in a 401 Unauthorized error.

<div>
  <div class="syn-alert theme-primary">
    <div class="syn-body-1 syn-mb-0">
      You must replace <code>YOUR_API_KEY</code> with your personal API key.
    </div>
  </div>
</div>

{% include aside-middle.html %}
<code-sample v-cloak title="To authorize, use this code:">

<div code-sample-language="Shell">
{% highlight bash %}
# With shell, you can just pass the correct header with each request
curl "api_endpoint_here" -H 'Authorization: Simple YOUR_API_KEY'
{% endhighlight %}
</div>

<div code-sample-language="CLI">
{% highlight bash %}
$ algo auth
Configuring authentication for 'default' profile
Enter API Key (prefixed with 'sim'): YOUR_API_KEY
Profile is ready to use. Test with 'algo ls'
{% endhighlight %}
</div>

{% highlight python %}
import Algorithmia

client = Algorithmia.client('YOUR_API_KEY')
{% endhighlight %}

{% highlight r %}
library(algorithmia)

client <- getAlgorithmiaClient('YOUR_API_KEY')
{% endhighlight %}

{% highlight ruby %}
require 'algorithmia'

client = Algorithmia.client('YOUR_API_KEY')
{% endhighlight %}


{% highlight java %}
import com.algorithmia.*;
import com.algorithmia.algo.*;

AlgorithmiaClient client = Algorithmia.client("YOUR_API_KEY");
{% endhighlight %}

{% highlight scala %}
import com.algorithmia._
import com.algorithmia.algo._

val client = Algorithmia.client("YOUR_API_KEY")
{% endhighlight %}

{% highlight rust %}
extern crate algorithmia
use algorithmia::*;
use algorithmia::algo::*;

let client = Algorithmia::client("YOUR_API_KEY");
{% endhighlight %}

<div code-sample-language="JavaScript">
{% highlight javascript %}
// include the algorithmia.js library
// https://algorithmia.com/v1/clients/js/algorithmia-0.2.0.js

var client = Algorithmia.client('YOUR_API_KEY');
{% endhighlight %}
</div>

<div code-sample-language="NodeJS">
{% highlight nodejs %}
var client = Algorithmia.client('YOUR_API_KEY');
{% endhighlight %}
</div>

{% highlight php %}
<?
$client = Algorithmia::client("YOUR_API_KEY");
?>
{% endhighlight %}
</code-sample>
<div class="syn-caption syn-mt-4">
  Make sure to replace `YOUR_API_KEY` with your API key.
</div>
{% include aside-end.html %}

## Key Restrictions

Algorithmia provides you with fine-grained controls for restricting what API calls can be made with a specific key from the Credentials section of your user profile.

You can create or modify any key to include any or all of the following restrictions:

<div class="syn-body-1" markdown="1">
  - __Algorithm access__: a white list of specific algorithms that can be called
  - __Native Clients__: allow the key to be used in any request that didn't originate from a web browser (non-CORS)
  - __Web Browser__: allows the key to be used for cross-origin requests (CORS). This is required for any key that you embed on your site. If you intend to embed this key in your site, we recommend that you disallow data access and white list only the algorithms that your site calls.
  - __Restrict referrer hostname__: only allow cross-origin requests from a specific domain. This is recommended when embedding your API key in your site.
  - __Data access__: control the Data API read/write access for a key. Note that this restriction does not prevent an algorithm from using the Data API. See the Data API documentation for details on further managing permissions of your data.
</div>