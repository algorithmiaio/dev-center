---
layout: article
title: "Amazon Alexa (Echo)"
excerpt-short: "Trigger Algorithmia microservices from your Alexa-enabled device."
categories: [sample-apps]
tags: [sample-apps]
show_related: true
permalink: /tutorials/sample-apps/alexa/
redirect_from:
  - /algorithm-development/clients/alexa/
  - /algorithm-development/tutorials/sample-apps/alexa/
image:
    teaser: /language_logos/alexa.svg
---


It is possible to trigger Algorithmia from Alexa and Alexa-enabled devices by creating an Alexa Skill.

## Creating the Lambda Function

First, we need to create a Lambda Function which will handle the Alexa requests.  This sample asks the user to provide a website (URL), sends it to the [ShareCounts](algorithmia.com/algorithms/web/ShareCounts) algorithm, and speaks the number of Facebook and LinkedIn shares for that site.  But any other algorithm could be easily called with only small tweaks to the inputs and outputs.  

1. Go to [The AWS Console](https://console.aws.amazon.com/console/) and ensure that you've selected the region "N Virginia" in the upper-right.
2. Under "AWS services", search for (and click) "Lambda"
3. Click "Create a Lambda Function"
4. Select the blueprint "alexa-skill-kit-sdk-factskill"
5. click the empty square and pick "Alexa Skills Kit", then click "Next"
6. Pick a name, and select "Node.js 6.10" as your runtime.
7. Delete the default code, and replace it with the code below (replacing your API_KEY and ALGO as needed).
8. Below the code block, pick "create a custom role" from the Role drop-down
9. In the pop-up window, keep the default values ("lambda_basic_execution"); click "Allow"
10. Back in the main window, click "Next", then "Create Function"
11. Once the function is created, an ARN should appear in the upper right. Copy the value starting with "arn:aws:lambda:"
12. Proceed to "Creating the Alexa Skill" below 

### Lambda Function Code:

{% highlight javascript %}
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
            website = website.replace(/ dot /gi,'.').replace(/ slash /gi,'/').replace(/ colon /gi,':').replace(/[^a-zA-Z0-9-_\.\:\/]/g, '');
            website = website.replace(/https*[:\/]+/,'');
            if(website.indexOf('\.')<0) {
                website = website+'.com';
            }
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
5. Next to "Intents", click "ADD"
6. In new Custom Intent, enter "CountIntent" and click "Create Intent"
7. On the right, in "Create New Slot", type "website" and click "Add"
8. Under "website", click "Choose a slot type"; at the bottom, type "Website" into "Create a New Slot Type" and click "+"
9. Under "Sample Utterances", enter "{website}" and press Enter
10. On the left, under "Slot Types", click "Website"
11. Under "Slot Values", enter a new value "Amazon.com" and click "+"; repeat for a few more websites (just enough to make the builder happy)
12. Click "build model" at the top
13. Once it is done building (this can take several minutes... watch for the spinner to stop), click "Configuration"
14. Under Endpoint, pick AWS Lambda ARN, North America, and paste the ARN from step 11 of "Creating the Lambda function"
15. Click Next (no other permissions are required), then test the skill by typing "algorithmia.com" into the "Enter Utterance" box, then clicking "Ask"
16. If your tests pass, you can now proceed to Publish

## Additional information

See the full Algorithmia [API Specification](http://docs.algorithmia.com/#api-specification) for additional details
on calling algorithms

More more info on building Alexa skills, visit [developer.amazon.com](http://developer.amazon.com/alexa)
