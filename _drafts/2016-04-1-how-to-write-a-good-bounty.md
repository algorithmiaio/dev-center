---
layout: article
title:  "How to write a good bounty of Algorithmia"
excerpt: "5 easy steps to creating a high quality bounty for Algorithmia"
date:   2016-04-01 01:30:38
categories: basics 
tags: [getting-started]
show_related: true
author: diego_oppenheimer
image:
    teaser: /icons/fa-bolt.png
---

# How to write a good bounty for Algortihmia

If while exploring the Algorithmia Marketplace you cannot find an algorithm or combinations of algorithms that suit your needs, it is possible to use the Bounty system to levarege the collective knowledge of the the thousands of algorithms developers that participate in the Algorithmia Marketplace.

The following guide will show you how to create a compelling bounty to maximize the chances of getting a good results in a timely fashion. Think of the bounty description as a design specification for the solution you need–the more complete and thorough, the better! Your bounty is more likely to be fulfilled if algorithm developers can easily understand your needs. If can also provide test cases or sample data, then algorithm developers will be better able to ensure that their submission meets your needs.

For the purpose of this guide we will build the ["Affinity Analysis for Market Basket Recommendation"][bl1] bounty which has already been fulfilled.

We will follow these steps to create our bounty:
1) State the problem
2) Specify the interface
3) Specify the Algorithm
4) Pledging to the Bounty
5) Share!

### 1. State the Problem
This is the main section of any bounty. Describe the problem briefly, include any relevant links to research, papers, similar examples or even Wikipedia if these resources can help clarify the problem. In general the better the detail and definition of the problem the closer the algortihm developer will be able to provide you with an easy plug and play solution you requested. 

A good problem specification will have the following:
- a) A brief paragraph explaining the intent of the algorithm and the problem you are looking for it to solve. Include references that explain the problem here.

    ``Affinity analysis is an analytical technique that aims to discover relationships between activities and preferences that pertain to specific individuals. Based on recorded information, after the analysis, future behavior can be statistically predicted. For a general overview see http://en.wikipedia.org/wiki/Affinity_analysis. Specific applications include clickstream analysis and market basket analysis."``

- b) How you intent to use the algorithm to solve your problem.

    ```One important area of application is market basket analysis, which has widespread use in planning promotions, designs and sales strategies. Market basket analysis is necessarily somewhat open-ended, but one of the more useful angles of attack is the extraction of association rules http://en.wikipedia.org/wiki/Association_rule_learning. Ultimately we wish to be able to use the set of items purchased (or otherwise accessed) by a user and recommend other items that they have an increased probability of being interested in, however, this should probably be a separate algorithm.```
    
### 2. Specify the interface
To ensure that you will be able to integrate the algorithm as quickly as possibly into your application its key to explain the type of interface you expect for integration. Most algorithms in the Algorithmia API use JSON for Input and Output. Clarifying the file types, format and schemas of the what is being sent to the algorithm or what is expected back will help the algorithm developer complete the bounty to your satisfcation.

From our bounty example:
- File Type/Schema: 
    ```The program should take a DataAPI url to a file with one session per line. A session represents the entities that were bought/used/visited in a single recorded event. This could be the urls seen in a given browsing session or items bought in a single visit to a store. i.e: bread milk eggs / beer diapers / bread bottled_water hot_dogs lemonade.```

    ```At minimum the algorithm should return frequent itemsets, preferably with some weight denoting each itemset’s prevalence. Even better would be full association rule mining, also with weights to indicate prevalence.```

- Special Interface considerations: If you have some extra requirements regarding what conventions the interface should follow for integration into your application you should specify those in this section as well:

    ```The items are not ordered and there is no customer identification. For simplicity, you may ignore multiple item purchases - two or more loaves of bread just count as one bread purchase. The items are separated by whitespace, and the only constraint on the format is that items but be uniquely identifiable by the string and the string may contain no whitespaces or quotation marks.```

- Example data: If available we highly recommend providing sample data so that the algorithm developer can see exactly what data the algorithm will be working with. Using the Data API to upload a sample data set that is accesible by everyone is recommended.

Warning: This data will be publicly accesible, we highly recommend providing data that is either fake or has no personally identifiable information. 

### 3. Specify the Algorithm
Some times you will have a specific algorithm you are looking to have implemented, other times this will be a bit more open ended and up to the algorithm developer to select what implementation of a certain algorithm he thinks will satisfy the problem described in (1.State the Problem).

This is the section to fill in if you want to point the algorithm developer in a specific direction or have an exact algorithm in mind. 

From our example we did not have a specific algorithm in mind but wanted to provide direction and context of what we were expecting from the algorithm:

```This is necessarily somewhat open-ended. Mahout includes an implementation of FP-Growth, but it requires hadoop configuration,which is an unacceptable degree of complexity for many users.```
```http://mahout.apache.org/users/misc/parallel-frequent-pattern-mining.html```

```A decent example of this is https://chimpler.wordpress.com/2013/05/02/finding-association-rules-with-mahout-frequent-pattern-mining/```

### 4. Pledging to the Bounty
In order to incentivize algorithm developers to develop an algorithm that fulfills your bounty, you can pledge between $10 and $10,000 USD to the solution. Bounties offered with a monetary value are far more likely to interest algorithm developers.

Pledging a bounty will start a 60-day countdown on your bounties page, and if your bounty is not fulfilled within those 60 days you will have the choice of either receiving a refund or renewing your bounty pledge. Algorithmia collects a 20% fee when you pledge a bounty. Bounties may be pledged in USD, Algorithmia credits, or both.

When you pledge a monetary bounty, you will we see a charge for the amount pledged. We hold the money in escrow while the bounty is live. If no solution is found, you have the option to receive a full refund after 60 days or extend the bounty for more time.
{: .notice-info }

Find more details in the [Bounty Terms and Conditions](https://algorithmia.com/bounty_terms). 

### 5. Share!
Now that you have created your bounty its time to let the world know. Your bounty will automatically get published to our bounties page but we highly recommend using the "Tweet" button on the top right of your bounty description to increase the reach of your newly created bounty.

### The Bounty Review Process

As the bounty author, you will review submitted solutions and accept or reject the proposed solutions depending on whether or not they addressed the requirements described in the bounty posting. When an algorithm is submitted as a solution, you will have 30 days to review, give feedback, and accept or reject the algorithm. For rejected solutions, you will have to explain why the proposed solution doesn’t meet the requirements.

When you accept an algorithm as the solution to your bounty posting, the bounty page will change from “Active” to “Fulfilled” and the algorithm will be displayed at the bottom of your bounty page.


