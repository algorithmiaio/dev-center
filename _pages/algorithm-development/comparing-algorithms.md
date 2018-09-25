---
layout: article
title:  "Evaluations"
excerpt: "This guide will walk you through the steps to implement your own evaluation."
categories: algorithm-basics
tags: [beta]
show_related: true
image:
    teaser: /icons/algo.svg
permalink: /algorithm-development/algorithm-basics/evaluations/
redirect_from:
  - /algorithm-development/evaluations/
---

So you've been playing around with Algorithmia for a while, and you may have noticed a variety of algorithms that tackle the same problem, in different ways. The [Algorithmia Evaluations](https://algorithmia.com/evaluations) tool lets you compare algorithms in a bunch of different ways. 
This guide will walk you through the steps to implement your own evaluation.

**Note:** Things you should have before we begin:
- A working knowledge of [algorithm development on Algorithmia](https://algorithmia.com/developers/algorithm-development/).
- A type of algorithm you want to evaluate (image classification, character recognition, etc).
- Some criteria you want to compare your algorithms with.

Got all that? Great! Lets dive in.

## Step 1: Find your evaluation data
 ![](https://i.imgur.com/i8Mxzd9.png)
- If your evaluation requires labelled data comparison, make sure you have the data available and formatted for use in the [data API](https://algorithmia.com/data).

## Step 2: Create an Evaluation (evaluator) algorithm.
- An evaluator algorithm is a special type of algorithm that compares similar algorithms based on some kind of criteria.
    - Example criteria:
        - Comparing label accuracy of different image classifiers, on an image dataset.
        - Comparing performance of different string reversal techniques.
- For guidance on how to create your own evaluator algorithm, check out [String Reversal Evaluator Algorithm](https://algorithmia.com/algorithms/zeryx/evaluator/edit), the algorithm is public and is a great starting point!
- Other things to keep in mind:
    - Make sure that your evaluation algorithm is owned by a user, not an org.
    - Make sure to publish your algorithm before using it.

## Step 3: Go to www.algorithmia.com/evaluations and create a new evaluation
![](https://i.imgur.com/be7W8BR.png)
- Make sure that you don't create under an organization, there is an open issue with org owned evaluations.
## Step 4: Setup your Evaluation
### Step 4.1: Add your evaluator algorithm at the bottom, click "Choose Existing".
![](https://i.imgur.com/gsG4XCz.png)

- If you can't find your evaluator, make sure its:
    - A [published algorithm](https://algorithmia.com/developers/algorithm-development/algorithm-basics/your-first-algo/#publish-your-algorithm)
    - Visible to your user account
    - Not created by an Organization (for now)

### Step 4.2: Add your Evaluatable Algorithms
![](https://i.imgur.com/DaKpEVX.png)

-  If you can't find your Evaluatable Algorithm, make sure its:
    - A [published algorithm](https://algorithmia.com/developers/algorithm-development/algorithm-basics/your-first-algo/#publish-your-algorithm)
    - Visible to your user account 
### Step 4.3: Provide an input to your evaluator algorithm

![](https://i.imgur.com/90L7OH5.png)
- Things to keep in mind about your evaluator algorithm's input:
    - it must be a json object
    - Remember that the `evaluated_algorithm` input variable defined in the Evaluator Algorithm is passed automatically.
    - Any additional parameters you wish to provide to your evaluatable algorithms should be passed here, in the evaluation input.
## Step 5: Run your Evaluation

![](https://i.imgur.com/xoq8mKe.png)
- Once your input is ready, you can click the big "run evaluation" button at the top
- Once your evaluation is executing, you can click the "results" tab and check the results.
- If any errors or exceptions are detected during algorithm execution, they'll be declared in the `Error` column on the far right.

And by following this guide, you should be able to create virtually any kind of evaluation!

Have any questions or comments? Feel free to get in touch by contacting us in that chat box on the bottom right of your screen!
