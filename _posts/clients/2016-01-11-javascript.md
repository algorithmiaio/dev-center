---
layout: article
title:  "The Javascript Library"
date:   2016-01-11 15:00:38
categories: clients
author: liz_rush
---

We offer a vanilla JavaScript client for calling algorithms in the marketplace.

### Download

You can download our JavaScript client from:

[https://algorithmia.com/v1/clients/js/algorithmia-0.2.0.js](https://algorithmia.com/v1/clients/js/algorithmia-0.2.0.js)

#### Call an Algorithm

```
<script>
var input = 41;
var client = Algorithmia.client("YOUR_API_KEY");
client.algo("docs/JavaAddOne").pipe(input).then(function(output) {
  if(output.error) return console.error("error: " + output.error);
  console.log(output.result);
});
</script>
```

You can include the JavaScript file as a script tag:

`<script src="//algorithmia.com/v1/clients/js/algorithmia-0.2.0.js" type="text/javascript"></script>`

To authenticate with the JavaScript client, simply set your API key with the following:

`var client = Algorithmia.client("YOUR_API_KEY");`

After setting your API key, you can then use the `client` variable from the above line to call algorithms.

The format for calling an algorithm is `client.algo()` with the algorithm name passed in. To pass input to the algorithm, use the `.pipe` method.

`client.algo("demo/Hello").pipe(input)`