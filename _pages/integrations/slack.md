---
layout: article
title:  "Slack"
permalink: clients/lambda/
excerpt-short: "Use Machine Learning directly from Slack."
categories: [clients, integrations]
tags: [clients, integrations]
show_related: true
image:
    teaser: /language_logos/slack.svg
---

Soon you'll be able to utilize Machine Learning from directly within Slack, mixing any of Algorithmias 5000+ algorithms into your Slack App!

Watch this space for full details in late June 2018. Meanwhile, here's a sample NodeJS function you can use to run any Algorithmia API from a Slack slash-command:

{% highlight javascript %}
const request = require('request');

/**
 * Responds to Slack SlashCommand of the form: AlgoName Input
 *
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 */
exports.handleSlashCommand = function handleSlashCommand(req, res) {
  //console.log('body: '+JSON.stringify(req.body));
  console.log('response_url: '+req.body.response_url);
  if(req.body.token != 'SLACK_API_TOKEN') {
    return res.status(200).send('Invalid Auth Token: please contact your administrator');
  }
  var index = req.body.text.indexOf(' ');
  var algo = index>0?req.body.text.substr(0, index):req.body.text;
  var body = index>0?req.body.text.substr(index):'';
  var userid = req.body.user_id;
  body = body.trim().replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
  console.log('user: '+userid+' '+(req.body.user_name||req.body.display_name));
  console.log('algo: '+algo);
  console.log('body: '+body);
  if(algo.indexOf('/')<1||body.length<1) {
    return res.status(200).send('Please specify an Algorithm followed by parameters, e.g. "demo/Hello/0.1.0 Jane Doe"')
  }
  var bodyjson = null;
  try {
    bodyjson = JSON.parse(body);
  } catch (error){}
  console.log('bodyjson: '+bodyjson);
  var options = {
    uri: 'https://api.algorithmia.com/v1/algo/'+algo,
    method: 'POST',
    headers: {
      'Authorization': 'Simple YOUR_API_KEY',
      'Content-Type': bodyjson?'application/json':'text/plain'
    },
    body: body
  };
  console.log(options);
  res.status(200).send("Processing...");
  request(options, function (error, response, body) {
    console.log('alg error:', error); // Print the error if one occurred 
    console.log('alg statusCode:', response&&response.statusCode); // Print the response status code if a response was received 
    console.log('alg body:', body); //Prints the response of the request.
  	var responsetext = response&&response.statusCode==200&&JSON.parse(body).result?JSON.parse(body).result:JSON.parse(body);
    var options = {
      uri: req.body.response_url,
      method: 'POST',
      body: JSON.stringify({
        "response_type": "in_channel",
        "text": algo+' via <@'+userid+'>:',
        "attachments": [
          {
            "text":typeof responsetext=="string"?responsetext:JSON.stringify(responsetext)
          }
        ]
      })
    };
    console.log('callback: '+JSON.stringify(options));
    request(options, function (cerror, cresponse, cbody) {});
  });
};
{% endhighlight %}
