---
layout: article
title: "Alexa"
categories: clients
tags: [clients]
show_related: true
image:
    teaser: /language_logos/alexa.svg
---

It is possible to trigger Algorithmia from Alexa and Alexa-enabled devices by creating an Alexa Skill.

## Creating the Lambda Function

First, we need to create a Lambda Function which will handle the Alexa requests.

1. go to [The AWS Console](https://console.aws.amazon.com/console/) and ensure that you've selected the region "N Virginia" in the upper-right.
2. Under "AWS services", search for (and click) "Lambda"
3. Click "Create a Lambda Function"
4. Select the blueprint "alexa-skill-kit-sdk-factskill"
5. click the empty square and pick "Alexa Skills Kit", then click "Next"
6. Pick a name, and select "Node.js 6.10" as your runtime.
7. Delete the default code, and replace it with the code below (note that you may need to set your API key or change Algo you'll be using).
8. Below the code block, pick "create a custom role" from the Role drop-down
9. In the pop-up window, keep the default values ("lambda_basic_execution"); click "Allow"
10. Back in the main window, click "Next", then "Create Function"
11. Once the function is created, an ARN should appear in the upper right. Copy the value starting with "arn:aws:lambda:"
12. Proceed to "Creating the Alexa Skill" below 

### Lambda Function Code:

{% highlight node %}
var API_KEY = 'YOUR_API_KEY';
var ALGO = 'web/ShareCounts/0.2.8';

//here's the actual call to the Algorithmia API
function getCounts(post_data, callback) {
    var https = require('https');
    var post_options = {
        host: 'api.algorithmia.com',
        port: '443',
        path: '/v1/algo/'+ALGO,
        method: 'POST',
        headers: {
            'Authorization': 'Simple '+API_KEY,
            'Content-Type': 'application/json'
        }
    };
    var req = https.request(post_options, res => {
        res.setEncoding('utf8');
        var returnData = "";
        res.on('data', chunk => {
            returnData = returnData + chunk;
        });
        res.on('end', () => {
            callback(returnData);
        });
    });
    req.write(JSON.stringify(post_data));
    req.end();
}

//define handlers for each action the user can perform
var handlers = {
    'CountIntent': function (event, context, callback) {
        if("website" in this.event.request.intent.slots) {
            website = this.event.request.intent.slots.website.value;
            website = website.replace(/https*[:\/]+/,'');
            getCounts( 'http://'+website, (results) => {
                results = JSON.parse(results).result;
                if('facebook_shares' in results || 'linkedIn' in results) {
                    output = 'For the website "'+website+ '", I found ';
                    if('facebook_shares' in results) {
                        output += results.facebook_shares+' recent Facebook shares, ';
                    }
                    if('linkedIn' in results) {
                        output += results.linkedIn+' recent LinkedIn shares.';
                    }
                    this.emit(':tell',output);
                } else {
                    this.emit(':tell',"I couldn't find any results for "+website);
                }
            });
        } else {
            return this.emit(':ask', this.t('HELP'));
        }
    },
    'LaunchRequest': function () {
        var say = this.t('WELCOME') + ' ' + this.t('HELP');
        this.emit(':ask', say, say);
    },
    'AMAZON.NoIntent': function () {
        this.emit('AMAZON.StopIntent');
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', this.t('HELP'));
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP'));
    }
};

//speech constants for responses
var languageStrings = {
    'en': {
        'translation': {
            'WELCOME': "Welcome to Social Share Counter.",
            'HELP': "What website would you like to check?"
                +"For example, you can say 'Algorithmia.com'",
            'STOP': "Okay, see you next time!"
        }
    }
};

//register handlers
var Alexa = require('alexa-sdk');
exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
{% endhighlight %}

## Creating the Alexa Skill

1. Go to [developer.amazon.com](https://developer.amazon.com/), sign in, and click the Alexa tab
2. Select "Alexa Skills Kit", then "Add new skill"
3. Pick a Name and Invocation, click "Save", "Next"
4. Click "Launch Skill Builder" at the top
6. Next to "Intents", click "ADD"
7. In new Custom Intent, enter "CountIntent" and click "Create Intent"
8. On the right, in "Create New Slot", type "website" and click "enter"
9. Under "website", click "Choose a slot type" and pick "AMAZON.US_STATE"
10. Under "Sample Utterances", enter "{website}" and press Enter
11. Click "build model" at the top
12. Once built, click "Configuration"
13. Under Endpoint, pick AWS Lambda ARN, North America, and paste the ARN from step 11 of "Creating the Lambda function"
14. Save and Test

## Additional information

See the full [API Specification](http://docs.algorithmia.com/#api-specification) for additional details
on calling algorithms and managing data with cURL.
