---
layout: article
title: "Zapier"
excerpt-short: "Add Machine Learning to your Zapier workflows with Algorithmia"
categories: [integrations]
tags: [integrations]
show_related: true
image:
    teaser: /language_logos/webhook.svg
---

[Zapier](https://zapier.com) lets you create workflows, called Zaps, which are triggered by one provider -- for example, a file being added to Dropbox or S3 -- and cause an action to performed elsewhere, such as sending a message in GMail or Slack.

Algorithmia plays nicely with Zapier, allowing you to easily trigger Algorithms from Zapier (for example, monitoring an S3 bucket for new images, then calling [ColorfulImageColorization](https://algorithmia.com/algorithms/deeplearning/ColorfulImageColorization) to create colorized versions of them), or add Machine Learning into the middle of a larger workflow (such as monitoring Zendesk for messages, passing them through [KeywordExtraction](https://algorithmia.com/algorithms/cindyxiaoxiaoli/KeywordExtraction) to figure out which topics are most relevant, then sending text messages to oncall support staff for the most important ones).

To begin, head to [Zapier.com](https://zapier.com) and click "make a zap".  Pick your Trigger App, and configure it.

Next, click Add a Step, then search for and select "Webhooks". Pick "POST", and click Continue.

Now, head to [algorithmia.com/algorithms](http://algorithmia.com/algorithms) and find an Algorithm you'd like to run. Under the "Install and Use" section, click "Curl": this codesample has all the info you'll need to configure Zapier.

Here's what it looks like for [nlp/SentimentAnalysis](https://algorithmia.com/algorithms/nlp/SentimentAnalysis): note the URL (https://api.algorithmia.com/v1/algo/nlp/SentimentAnalysis/1.0.5?timeout=300), the input data (`{"document": "I really like Algorithmia!"}`), and the Authorization header (`Authorization: Simple YOUR_API_KEY`)
