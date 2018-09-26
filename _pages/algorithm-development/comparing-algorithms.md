---
layout: article
title:  "Evaluations"
excerpt: "This guide will walk you through the steps to implement your own evaluation."
categories: algorithm-development
tags: [algo-dev]
show_related: true
image:
    teaser: /icons/algo.svg
permalink: /algorithm-development/evaluations/
redirect_from:
  - /algorithm-development/evaluations/
---

If you have been playing around with Algorithmia for a while, you might have noticed a variety of algorithms that tackle the same problem, but in different ways. 
The [Algorithmia Evaluations Wizard](https://algorithmia.com/evaluations) is a new tool that makes comparing algorithms dead simple.

Not entirely sure what we're talking about? That's ok! Take a look at our [Multi-Lang String Reversal Evaluation demo.](https://algorithmia.com/evaluations/algoevaldemo/string-reversal)
In the example above, we're comparing the performance of different programming languages by using each languages idiomatic string reversal technique.
We then measure the runtime and loading performance for each, by passing the same input to all of them; as you can see, rust wins!
 
**Note:** Things you should have before we begin:
- A working knowledge of [algorithm development on Algorithmia](https://algorithmia.com/developers/algorithm-development/).
- A type of algorithm you want to evaluate (image classification, character recognition, etc).
- A testing dataset (or data point) you plan to use to compare algorithms, ideally already in the [data api](https://algorithmia.com/developers/data/hosted).
- Some criteria you want to compare your algorithms with.

Got all that? Great! Lets dive in.

## Step 1: Create an Evaluator algorithm.

- An evaluator algorithm is a special type of algorithm that compares similar algorithms based on some kind of criteria.
    - Example criteria:
        - Comparing label accuracy of different image classifiers, on an image dataset.
        - Comparing performance of different string reversal techniques.
- For guidance on how to create your own evaluator algorithm, check out [String Reversal Evaluator Algorithm](https://algorithmia.com/algorithms/zeryx/evaluator), the algorithm is public and is a great starting point!
- Other things to keep in mind:
    - Ensure that your evaluation algorithm is passing data to your evaluatable algorithms correctly! If they expect json, make sure you're passing something that can be serialized into json.
    - If some of your evaluatable algorithms handle input differently, make an an `if` statement that pattern matches the 'evaluated_algorithm' key. For more info check out the example above.
    - Make sure that your evaluation algorithm is owned by a user, not an org.
    - Make sure to publish your algorithm before using it.

## Step 2: Create a new evaluation

##### Go to www.algorithmia.com/evaluations and click "Create Evaluation"

![](https://i.imgur.com/be7W8BR.png)
- Make sure that you don't create under an organization, there is an open issue with org owned evaluations.

## Step 3: Setup your Evaluation

### Step 3.1: Add your evaluator algorithm at the bottom, click "Choose Existing".
![](https://i.imgur.com/gsG4XCz.png)

- If you can't find your evaluator, make sure its:
    - A [published algorithm](https://algorithmia.com/developers/algorithm-development/algorithm-basics/your-first-algo/#publish-your-algorithm)
    - Visible to your user account
    - Not created by an Organization (for now)

### Step 3.2: Add your Evaluatable Algorithms
![](https://i.imgur.com/DaKpEVX.png)

-  If you can't find your Evaluatable Algorithm, make sure its:
    - A [published algorithm](https://algorithmia.com/developers/algorithm-development/algorithm-basics/your-first-algo/#publish-your-algorithm)
    - Visible to your user account
 
### Step 3.3: Provide an input to your evaluator algorithm

![](https://i.imgur.com/90L7OH5.png)
- Things to keep in mind about your evaluator algorithm's input:
    - it must be a json object
    - Remember that the `evaluated_algorithm` input variable defined in the Evaluator Algorithm is passed automatically.
    - Any additional parameters you wish to provide to your evaluatable algorithms should be passed here, in the evaluation input.

## Step 4: Run your Evaluation

![](https://i.imgur.com/xoq8mKe.png)
- Once your input is ready, you can click the big "run evaluation" button at the top
- Once your evaluation is executing, you can click the "results" tab and check the results.
- If any errors or exceptions are detected during algorithm execution, they'll be declared in the `Error` column on the far right.

And by following this guide, you should be able to create your very own evaluation!

Have any questions or comments? Feel free to get in touch by contacting us in that chat box on the bottom right of your screen!
