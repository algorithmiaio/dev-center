---
layout: article
title:  "An Introduction to Bounties"
date:   2016-01-11 01:19:38
categories: basics 
author: liz_rush
image:
  teaser: /icons/fa-bolt.png
---

Bounties are part of the Algorithmia Marketplace and allow users to post their algorithmic needs for particular problems they may have. Bounties are a great way to get tailored solutions written by subject matter experts and algorithm developers. 

## What is a Bounty?

A bounty is a posting that advertises a problem that needs solving with an algorithm. Anyone can post a bounty or provide the solution! 

## What kind of problems are appropriate for bounties?

Bounties are great for problems that have concrete inputs and outputs. A bounty is a great opportunity to get a subject matter expert to solve a specific problem that you have but don't know how to solve yourself. This would include problems such as defined transformations on structured data, obscure but well-defined statistical metrics on real-valued data, or problems such as extracting keywords for each document from a set of documents.

## What kind of problems are not a good match for the bounty system?

The bounty system is not a good fit for problems that are fuzzy in nature or not well defined. In order to get the best solution, the problem needs to be scoped to a clearly definable piece of work that can be solved by an algorithm.


Examples of problems that are not a good fit for the Bounty system include:

* Tasks that require substantial human intervention, such as 3D animation
* Research level problems that even experts have yet to solve
* Problems that would require infrastructure to complete, e.g., "a mobile app that does X". 

The best bounties are things you don't quite know how to solve, but you are reasonably confident that a subject expert probably knows.

## How to Write a Good Bounty

Think of the bounty description as a design specification for the solution you need--the more complete and thorough, the better! Your bounty is more likely to be fulfilled if algorithm developers can easily understand your needs. If can also provide test cases or sample data, then algorithm developers will be better able to ensure that their submission meets your needs.

There are a few levels to consider when writing a bounty and depending on your purpose the importance of each will vary.

**1. Specify the problem**

The problem can range from something as mundane as converting between file formats to something as abstract as a combinatorial optimization problem. Describe the problem briefly, include any relevant links to research, papers, similar examples or even Wikipedia if these resources can help clarify the problem. 

Be sure to provide example data. To make this easier, you can put files in the Data API and make them publicly readable. If you don't have example data available, please provide a very clear examples of what you expect the data to be and how it will look as input.

**2. Specify the interface**

In order to make sure that the algorithm will fulfill your needs, be sure to specify what the input and output formats will be. Usually this will be something standard, like a list of strings, an array of integers, or an image file. 

In other cases, a custom class will be easier. If you suspect that you need a custom class, check out our [Java documentation](https://algorithmia.com/docs/algorithm/java/) and be sure to provide a definition of the class int he bounty.

**3. Specify the Algorithm**

If you want a particular algorithm used to fulfill your bounty, be sure to specify this in the description. More often than not, you might not know which algorithm you want or it might not matter for the final solution.

If your bounty is a particularly difficult problem, your odds of getting a successful solution will rise if you provide ideas of which algorithms you think the solution might include as well as links to resources that might help an algorithm developer.

## Pledging to a Bounty

In order to incentivize algorithm developers to develop an algorithm that fulfills your bounty, you can pledge between $10 and $10,000 USD to the solution. Bounties offered with a monetary value are far more likely to interest algorithm developers. 

Pledging a bounty will start a 60-day countdown on your bounties page, and if your bounty is not fulfilled within those 60 days you will have the choice of either receiving a refund or renewing your bounty pledge. Algorithmia collects a 20% fee when you pledge a bounty. Bounties may be pledged in USD, Algorithmia credits, or both.

## The Bounty Review Process

As the bounty author, you will review submitted solutions and accept or reject the proposed solutions depending on whether or not they addressed the requirements described in the bounty posting. When an algorithm is submitted as a solution, you will have 30 days to review, give feedback, and accept or reject the algorithm. For rejected solutions, you will have to explain why the proposed solution doesn't meet the requirements. 

When you accept an algorithm as the solution to your bounty posting, the bounty page will change from "Active" to "Fulfilled" and the algorithm will be displayed at the bottom of your bounty page. 

## Fulfilling a Bounty

If you are an algorithm developer and see an interesting bounty that you want to solve, you can submit the solution to fulfill the bounty. 

To fulfill a bounty, make sure you have published the algorithm publicly. The algorithm can be either open or closed source. Next, navigate to the bounty page and click the “Fulfill Bounty" button. At this point, you will be shown a dialog box with the Algorithmia Bounty Terms & Agreement. After you read the agreement, select your algorithm from the drop-down menu at the bottom and click the “I agree to terms and submit algorithm for review” button. The bounty poster will have 30 days to review the algorithm, give you feedback, and ultimately pay the bounty out if the algorithm is accepted.
