---
layout: article
title: "Webhooks"
excerpt-short: "Use an Algorithmia Algorithm as an Incoming Webhook Endpoint"
show_related: true
image:
    teaser: /language_logos/webhook.svg
---

*Webhooks* are used by a wide variety of services for countless reasons, from [GitHub PR notifications](https://developer.github.com/webhooks/) to [Stripe payment alerts](https://stripe.com/docs/webhooks).  However, many services do not allow for the addition of custom authorization headers or code-level customization of the calls, so you'll need to write just a little bit of custom code to use an Algorithmia Algorithm to receive Webhook notifications.

## NodeJS / Google Cloud Function example

Here's a simple Google Cloud Function example that can be easily adapted to any Node server or other cloud function service.  Just replace YOUR_API_KEY with [your own key](/user#credentials), and use the algorithm of your choice instead of `demo/Hello`.  You can then parse fields out of the incoming `request` object, grabbing any relevant info from the service calling the webhook, and passing it on to the downstream Algorithm.

Note that if your Algorithm does anything privileged, you'll want to validate any authentication passed by the webhook caller.  For example, if it was being triggered by a secure GitHub call, you'd check the [X-Hub_signature field of the request header](https://developer.github.com/webhooks/securing/).

{% highlight javascript %}
const request = require('request');

/**
 * Responds to any HTTP request that can provide a "message" field in the body.
 *
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 */
exports.handleSomeWebhook = function handleSomeWebhook(req, res) {
  var body = req.body;
  var bodyjson = null;
  try {
    bodyjson = JSON.parse(body);
  } catch (error){}
  console.log('bodyjson: '+bodyjson);
  var options = {
    uri: 'https://api.algorithmia.com/v1/algo/demo/Hello',
    method: 'POST',
    headers: {
      'Authorization': 'Simple YOUR_API_KEY',
      'Content-Type': bodyjson?'application/json':'text/plain'
    },
    body: body
  };
  request(options, function (error, response, body) {
    var responsetext = response&&response.statusCode==200&&JSON.parse(body).result?JSON.parse(body).result:JSON.parse(body);
    res.status(200).send(responsetext);
  });
};
{% endhighlight %}

## Python / AWS Lambda example

If Amazon is your preference, head over to the [AWS Lambda Console](https://console.aws.amazon.com/lambda) and click "create function" and "author from scratch". After filling in a function name, pick Python 3.7 as your runtime, then click "Create" and paste the following code:

{% highlight python %}
import json
from botocore.vendored import requests

def lambda_handler(event, context):
    algorithm = 'demo/Hello/0.1.0'
    api_key = 'YOUR_API_KEY'
    data = event['Records'][0]['s3']['object']['key']
    headers = {'Content-Type':'application/json','Authorization':'Simple '+api_key}
    response = requests.post(
        'https://api.algorithmia.com/v1/algo/'+algorithm,
        headers=headers,
        data=json.dumps(data)
    )
    return {
        'statusCode': response.status_code,
        'body': response.json()
    }
{% endhighlight %}

This sample accepts an S3 event; if that's not what you're triggering it with, change the `data` line to extract the correct input from the event.

Set your own `api_key` from [your account](/user#credentials), and change `algorithm` to be the [algorithm](/algorithms) you wish to call.

You can adapt this same code to any other Python environment by changing the line `from botocore.vendored import requests` to just `import requests`, and adapting the `lambda_handler` method to match the request signature your framework requires. 
