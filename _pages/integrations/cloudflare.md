---
layout: article
title: "Cloudflare Workers"
excerpt-short: "Call algorithms from the edge with Cloudflare Workers."
categories: [integrations]
tags: [integrations]
show_related: true
image:
    teaser: /language_logos/cloudflare.svg
---

*Cloudflare* speeds up your website by distributing and caching content across its CDN -- but they also provide a way to modify the content on-the-fly, using JavaScript workers which run on the edge, close to where your content is actually delivered.

[Read more about Cloudflare Workers](https://cloudflare.com/products/cloudflare-workers/), then try out this sample code, which calls an Algorithmia algorithm to auto-summarize the content and prepend the summary into the page. Next, drop in [your own API Key](https://algorithmia.com/user#credentials) and try out any of our other [algorithms](http://algorithmia.com/algorithms) to drop the power of Machine Learning right into your cached pages, running at the Edge! 

{% highlight javascript %}
addEventListener('fetch', event => {
  event.respondWith(fetchAndModify(event.request))
})

/**
 * Fetch and log a given request object
 * @param {Request} request
 */
async function fetchAndModify(request) {
  console.log("got a request:", request);

  // Send the request on to the origin server.
  const response = await fetch(request);
  
  // Read response body.
  const text = await response.text();

  // call Algorithmia (in this case, 'demo/CloudflareWorkerDemo')
  const algoRequest = await fetch('https://api.algorithmia.com/v1/algo/demo/CloudflareWorkerDemo', {
    method: 'POST',
    headers: {
      "Content-type": "text/plain",
      // API key from https://algorithmia.com/user#credentials
      "Authorization": "Simple YOUR_API_KEY"
    },
    // this algorithm takes a URL as input
    body: request.url
  })

  // Read Algorithmia's response
  let algoResponse = await algoRequest.json();

  // Extract algorithm result
  let summary = algoResponse.result;

  // prepend summary
  const modified = text.replace(
    '<body>',
    '<body><div style="clear:both;margin:1rem">'+summary+'<div>'
  )

  // Return modified response.
  return new Response(modified, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });
}
{% endhighlight %}
