---
layout: article
title:  "How to write a good bounty on Algorithmia"
excerpt: "5 easy steps to creating a high quality bounty for Algorithmia"
date:   2016-04-01 01:30:38
categories: basics 
tags: [bounties]
show_related: true
author: diego_oppenheimer
---
Algorithmia provides a bounty system for algorithm development, where application developers can connect with algorithm developers. This system helps application developers solve a problem by leveraging the collective knowledge of the thousands of algorithms developers that participate on Algorithmia.

If you can't the an algorithm, or combination of algorithms, on Algorithmia that solves your problem, the bounty system is a great place to start. The following guide will show you how to create a compelling bounty so you maximize chance of getting a good results quickly. 

Your bounty is more likely to be fulfilled if algorithm developers can easily understand what you need, and why. So, think of your bounty description as a requirement doc for your solution. The more complete and thorough, the better. It's strongly recommended to provide test cases and/or sample data.

For this guide, we will build the ["Affinity Analysis for Market Basket Recommendation"](https://algorithmia.com/bounties/32) bounty which has already been fulfilled.

We will follow these steps to create our bounty:

1. State the Problem
2. Specify the Interface
3. Specify the Algorithm
4. Pledging the Bounty
5. Share!

### 1. State the Problem
This is the main section of the bounty. Be sure to clearly describe the problem, and include any relevant links to research, papers, examples, or even links to Wikipedia. This helps ensure that algorithm developers deliver exactly what you want.

A good problem requirement doc will have the following:

* A brief paragraph explaining the intent of the algorithm, and the problem you're trying to solve. Include references that explain the problem here.

    >Affinity analysis is an analytical technique that aims to discover relationships between activities and preferences that pertain to specific individuals. Based on recorded information, after the analysis, future behavior can be statistically predicted. For a general overview see http://en.wikipedia.org/wiki/Affinity_analysis. Specific applications include clickstream analysis and market basket analysis.

- How the algorithm will be used, and why it solves your problem.

    >One important area of application is market basket analysis, which has widespread use in planning promotions, designs and sales strategies. Market basket analysis is necessarily somewhat open-ended, but one of the more useful angles of attack is the extraction of association rules http://en.wikipedia.org/wiki/Association_rule_learning. Ultimately we wish to be able to use the set of items purchased (or otherwise accessed) by a user and recommend other items that they have an increased probability of being interested in, however, this should probably be a separate algorithm.
    
### 2. Specify the Interface
It's key to explain the type of interface you expect so that you can easily integrate this algorithm in your application quickly.

Most algorithms on the Algorithmia use JSON for the ```Input``` and ```Output```. Clarify the file types, format, and schemas for the algorithm's input, as well as the output.

For example:

- **File Type/Schema:**

    >The program should take a DataAPI url to a file with one session per line. A session represents the entities that were bought/used/visited in a single recorded event. This could be the urls seen in a given browsing session or items bought in a single visit to a store. i.e: bread milk eggs / beer diapers / bread bottled_water hot_dogs lemonade.

    >At minimum the algorithm should return frequent itemsets, preferably with some weight denoting each itemset’s prevalence. Even better would be full association rule mining, also with weights to indicate prevalence.

- **Special Interface Considerations:** If you have additional requirements regarding conventions or integration into your application, you should specify those in this section as well:

    >The items are not ordered and there is no customer identification. For simplicity, you may ignore multiple item purchases - two or more loaves of bread just count as one bread purchase. The items are separated by whitespace, and the only constraint on the format is that items but be uniquely identifiable by the string and the string may contain no whitespaces or quotation marks.

- **Example Data:** If available, we recommend providing sample data so that the algorithm developer can see exactly what data they will be working with. Using the [Algorithmia Data API](http://docs.algorithmia.com/#the-data-api) to upload a sample data set is recommended.

*Warning:* This data will be publicly accesible, we highly recommend providing data that is either fake or has no personally identifiable information. 

### 3. Specify the Algorithm
This section is about articulating concrete algorithm needs. 

For instance, some application developers have a specific algorithm they want implemented. Often times, however, the application developer knows what the end result should be, but doesn't know how to get there. This is why it's so important to clearly define what the problem is in Section 1.

From our example, we don't have a specific algorithm in mind. So, we want to provide direction and context to the algorithm developer of our expectations.

For example:

>This is necessarily somewhat open-ended. Mahout includes an implementation of FP-Growth, but it requires hadoop configuration,which is an unacceptable degree of complexity for many users. http://mahout.apache.org/users/misc/parallel-frequent-pattern-mining.html

>A decent example of this is https://chimpler.wordpress.com/2013/05/02/finding-association-rules-with-mahout-frequent-pattern-mining/

### 4. Pledging the Bounty
Bounties that pledge a monetary value are far more likely to interest algorithm developers. You can pledge between $10 and $10,000 USD toward a bounty. 

When you pledge a monetary bounty, we'll charge your credit card immediately and hold the money in escrow while the bounty is live. 

Pledging a bounty starts a 60-day countdown on your bounty. If your bounty is not fulfilled within 60-days, you will have the choice to renew your bounty pledge, or be refunded. When pledging a bounty, Algorithmia collects an additional 20% fee. Bounties may be pledged in USD, Algorithmia credits, or both.

Find more details in the [Bounty Terms and Conditions](https://algorithmia.com/bounty_terms). 

### 5. Share!
Now that you have created your bounty, it's time to let the world know. Your bounty will automatically get published to our bounties page. We highly recommend sharing your bounty to Twitter, Facebook, Reddit, HN, etc. to increase the reach of your newly created bounty, and help attract algorithm developers.

### The Bounty Review Process
As the bounty creator, you will review solutions, and choose whether to accept or reject them based on the requirements described in your bounty description.

When a potential solution is submitted, you have 30-days to review the algorithm, and provide feedback to the algorithm developer. If you accept the solution, your bounty will change from "Active" to "Fulfilled."

If you reject a solution, we require you to explain why the proposed solution didn't meet your requirements.



