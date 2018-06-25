---
layout: article
title:  "Slack"
permalink: clients/slack/
excerpt-short: "Use Machine Learning directly from Slack."
categories: [clients, integrations]
tags: [clients, integrations]
show_related: true
image:
    teaser: /language_logos/slack.svg
---

Looking to add Machine Learning to your Slack App? Algorithmia provides over 5000 individual algorithms, from simple utilities to advanced Deep Learning tools, which can be called via Slack <a href="https://api.slack.com/slash-commands" target="_blank">Slash Commands</a> or utilized by your Slack <a href="https://api.slack.com/bot-users" target="_blank">Bot Users</a>.

## Algorithmia + Slack Slash Commands

Algorithmia gives immense power to your Slack users and bots, thanks to its wide variety of tools and AI available via simple API calls. By invoking a Slash Command (`/commandname parameters`) in Slack, users can trigger an abstract API to respond either immediately or via a delayed callback. 

Here are just a few examples of how Slack users could utilize simple Slash Commands backed by Algorithmia:
* get a quick [summary of all social shares for a URL](https://algorithmia.com/algorithms/web/ShareCounts)
* automatically [extract keywords from a document](https://algorithmia.com/algorithms/nlp/AutoTag) or [webpage](https://algorithmia.com/algorithms/tags/AutoTagURL)
* get immediate [topic summaries from wikipedia](https://algorithmia.com/algorithms/web/WikipediaParser)
* [colorize](https://algorithmia.com/algorithms/deeplearning/ColorfulImageColorization) or [stylize](https://algorithmia.com/algorithms/deeplearning/DeepFilter) images

By adding just a little bit of glue code to pipeline one API into another, even more complex tasks are possible. For example, one could:
* [connect to Dropbox](https://algorithmia.com/developers/data/) and [extract text from PDFs](https://algorithmia.com/algorithms/ANaimi/PDFToText)
* locate documents containing [phrases similar to their search query](https://algorithmia.com/algorithms/PetiteProgrammer/TextSimilarity)
* crawl, scrape, analyze an [entire website](https://blog.algorithmia.com/web-scraping-crawling-python/)


## Algorithmia + Slack Bot Users

Slack Bots take things a bit further, giving the user a chatbot-like context in which they can interact more naturally. In addition, Slack Bots can monitor channels/conversations to which they've been invited, allowing you to keep an eye out for important keywords, heightened emotional interactions, or images you need to log/analyze. By adding the power of Algorithmia to your Slack Bot, you could:

* create a long-term context for the user's interactions, allowing them to [train a facial recognition tool](https://blog.algorithmia.com/train-a-face-recognition-model-to-recognize-celebrities/) or a [document classifier](https://blog.algorithmia.com/acquiring-data-for-document-classification/)
* detect positive and negative sentiment in users' messages, taking note of good experiences and offering to help with others, just as you would in any [AI-driven chatbot](https://blog.algorithmia.com/building-an-emotionally-aware-chatbot/)
* ensure that images exchanged are [safe for work](https://algorithmia.com/algorithms/sfw/NudityDetectioni2v)
* observe the frequency of certain actions or keywords, to [generate predictions and identify outliers](https://algorithmia.com/algorithms/TimeSeries/)

## Sample code: use a Slack Slash Command to get a quick summary of any website

To demonstrate a very simple use of Algorithmia via Slack, let's look at at how easy it is to create a Slach command which takes a web address and response with an auto-generated summary of that page's content.
 
After you've followed Slack's guide to [create a Slack App](https://api.slack.com/slack-apps), and read up on [how Slash Commands work](https://api.slack.com/slash-commands), head to your [Slack App Management Page](https://api.slack.com/apps) and click on the App name to see the details of our Slack App. Under "Basic Information", copy the "Verification Token" -- you'll need it for the code below.

In order for your Slack App to connect to Algorithmia, you'll need an intermediate function: and API endpoint which can accept a GET request from Slack, validate the content, and then POST to one of Algorithmia's APIs. There are many ways to do this, but for simplicity I've chosen to create a simple NodeJS function which will can run as a Google Cloud Function, or be easily ported into your own NodeJS server:

{% highlight javascript %}
const request = require('request');

/**
 * Sends input from a Slack SlashCommand to Algorithmia's nlp/SummarizeURL, and returns result
 *
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 */
exports.summarizeURL = function summarizeURL(req, res) {
  // verify that this request came from a valid Slack App
  if(req.body.token != 'SLACK_VERIFICATION_TOKEN') {
    return res.status(200).send('Invalid Auth Token: please contact your administrator');
  }
  // respond immediately to let Slack know we're here (actual content will be sent asynchronously later)
  res.status(200).send("Processing...");
  console.log('request: '+JSON.stringify(req.body));
  // call Algorithmia's nlp/SummarizeURL API, sending it whatever text the user passed in
  var options = {
    uri: "https://api.algorithmia.com/v1/algo/nlp/SummarizeURL",
    method: 'POST',
    headers: {
      'Authorization': 'Simple YOUR_API_KEY',
      'Content-Type': 'text/plain'
    },
    body: req.body.text.trim()
  };
  request(options, function(error, response, body) {
    console.log('response: '+JSON.stringify(response));
  	var responsetext = JSON.parse(body).result?JSON.parse(body).result:JSON.parse(body);
    // POST to callback URL specified in original request
    var options = {
      uri: req.body.response_url,
      method: 'POST',
      body: JSON.stringify({
        "response_type": "in_channel",
        "text": responsetext
      })
    };
    request(options);
  });
};
{% endhighlight %}

Replace `SLACK_VERIFICATION_TOKEN` with the Verification Token you copied in the prior step. Also replace `YOUR_API_KEY` with your own [Algorithmia API Key](https://algorithmia.com/user#credentials), if it isn't there already.

Copy this code into your NodeJS app -- if you're using Google Cloud Functions, use an HTTP Trigger with the minimum memory allowed, and set the timeout to 300 seconds just in case some of your invocations run for a long time. Also be sure to add the following dependencies to your `package.json`:
{% highlight python %}
  "dependencies": {
    "request": "^2.81.0"
  }
{% endhighlight %}

Compile the function, and copy the web address of the API endpoint (in Google Cloud Functions, a URL similar to "https://us-central1-slack-helper-######.cloudfunctions.net/functionName").

Now, head back to your [Slack App Management Page](https://api.slack.com/apps), click your App name, and navigate to the "Slack Commands" section under "Features" on the left. Hit the "Create New Command" button. Call your command something like `/summarize` and enter the URL you just copied into the "Request URL" box. Add a description such as "Summarizes a webpage", and a hint such as "[web address]".

Once you've saved this command, you can open up Slack and test out your new Slack Command! Just type `/summarize news.yahoo.com` into any channel or conversation, and you should receive an immediate response of "processing", followed by a summary of the days top news items.

Once you have that working, you may want to try out a more complicated example...

## Sample code: call any Algorithmia algorithm from a Slack Slash Command

While you'll generally want to create built-to-purpose commands which perfom a single action, the following example demonstrates some advanced techniques while gives your users immense power: once you've added it, they can call any of Algorithmia's 5000+ algorithms.

Read through the comments in the code for tips and tricks, then try adding it as a new Slash Command called `algo` and running it with `/algo nlp/SummarizeURL news.yahoo.com`. You should get the same response as before... if so, you're ready to try it with any other algorithm! Just replace `nlp/SummarizeURL` with the full name of the [algorithm](https://algorithmia.com/algorithms), and `news.yahoo.com` with the input you want to give it (even JSON).

{% highlight javascript %}
const request = require('request');

/**
 * Responds to Slack SlashCommand of the form: AlgoName Input
 *
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 */
exports.handleSlashCommand = function handleSlashCommand(req, res) {
  // verify that this request came from a valid Slack App
  if(req.body.token != 'SLACK_VERIFICATION_TOKEN') {
    return res.status(200).send('Invalid Auth Token: please contact your administrator');
  }
  // ID of user is in req.body.user_id, but user_name or display_name are more readable
  var userid = req.body.user_id;
  console.log('user: '+userid+' '+(req.body.user_name||req.body.display_name));
  // parameters should be full name of Algorithmia algorithm, followed by content to send the algo
  var index = req.body.text.indexOf(' ');
  var algo = index>0?req.body.text.substr(0, index):req.body.text;
  var body = index>0?req.body.text.substr(index):'';
  if(algo.indexOf('/')<1||body.length<1) {
    return res.status(200).send('Please specify an Algorithm followed by parameters, e.g. "demo/Hello/0.1.0 Jane Doe"')
  }
  // replace smart quotes with straight quotes (copy-pasting in Slack sometimes creates unintentional smart-quotes)
  body = body.trim().replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
  console.log('algo: '+algo);
  console.log('body: '+body);
  // callback webhook is found in req.body.response_url
  console.log('response_url: '+req.body.response_url);
  // respond immediately to let Slack know we're here (actual content will be sent asynchronously later)
  res.status(200).send("Processing...");
  // body content might be JSON or might be a plain string ... detect and adjust Content-Type
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
  // warning: this leaks API Key into the logs
  console.log(options);
  // call the relevant algo
  request(options, function (error, response, body) {
    console.log('alg error:', error); 
    console.log('alg statusCode:', response&&response.statusCode); 
    console.log('alg body:', body);
    // check if there's a valid response (200), and parse JSON
  	// TBD: handle errors if a non-400 or non-JSON response is received!
  	var responsetext = response&&response.statusCode==200&&JSON.parse(body).result?JSON.parse(body).result:JSON.parse(body);
  	// send response to Slack webhook, with a message indicating who called which algo, and the algo's response attached
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

Once you've mastered this, you're ready to move on to more complex solutions, chaining multiple algorithm calles into a single function to accomplish large tasks, or designing a new Slack Bot to help your users out. Have fun, and <a onclick="Intercom('show')">connect with us<a/> anytime you'd like pointers or assistance!

## Additional information

See the [NodeJS guide](../node) for an introduction to using the Algorithmia NodeJS client to call algorithms and manage data.

Your account can make up to 80 Algorithmia requests at the same time (this limit <a onclick="Intercom('show')">can be raised</a> if needed).
