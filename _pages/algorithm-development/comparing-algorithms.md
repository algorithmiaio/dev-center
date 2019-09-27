---
layout: article
title:  "Evaluations"
excerpt: "This guide will walk you through the steps to implement your own evaluation."
categories: algorithm-development
tags: [algo-dev]
show_related: true
image:
    teaser: /icons/algo.svg
---

{% include video-responsive.html height="560" width="315" url="https://www.youtube.com/embed/QEddoz6xFao" %}

If you have been playing around with Algorithmia for a while, you might have noticed a variety of algorithms that tackle the same problem, but in different ways.
The [Algorithmia Evaluations Wizard]({{site.url}}/evaluations) is a new tool that makes comparing algorithms dead simple.

Not entirely sure what we're talking about? That's ok! Take a look at our [Multi-Lang String Reversal Evaluation demo.](https://algorithmia.com/evaluations/algoevaldemo/string-reversal)
In the example above, we're comparing the performance of different programming languages by using each languages idiomatic string reversal technique.
We then measure the runtime and loading performance for each, by passing the same input to all of them; as you can see, rust wins!

In another example we look at [The Accuracy Level of Face Detection Algorithms.](https://algorithmia.com/evaluations/algoevaldemo/face-detection)
We know how hard it can be to pick a Face Detection algorithm over the other. For this evaluation, we look at how much the predicted bounding-box overlaps with the ground truth.
This helps us make an educated decision for picking an algorithm to use!

Lastly, in our [Animal Classification Evaluation demo](https://algorithmia.com/evaluations/algoevaldemo/animal-classification/) we look at how well image classifiers perform in picking out animals in images.
Here we look at the top-1, top-3, and top-5 prediction accuracy rates for image classifiers.
Want to use a general purpose image classifier for a narrow task? Evaluations like these will definitely help!

**Note:** Things you should have before we begin:
- A working knowledge of [algorithm development on Algorithmia]({{site.url}}{{site.baseurl}}/algorithm-development).
- A type of algorithm you want to evaluate (image classification, character recognition, etc).
- A testing dataset (or data point) you plan to use to compare algorithms, ideally already in the [data api]({{site.url}}{{site.baseurl}}/data/hosted).
- Some criteria you want to compare your algorithms with.

Got all that? Great! Lets dive in.

## Step 1: Create an Evaluator Algorithm.

- An evaluator algorithm is a special type of algorithm that compares similar algorithms based on some kind of criteria.
    - Example criteria:
        - Comparing label accuracy of different image classifiers, on an image dataset.
        - Comparing performance of different string reversal techniques.
- For guidance on how to create your own evaluator algorithm, check out [String Reversal Evaluator Algorithm](https://algorithmia.com/algorithms/zeryx/evaluator), the algorithm is public and is a great starting point!
- Other things to keep in mind:
    - Ensure that your evaluation algorithm is passing data to your evaluable algorithms correctly! If they expect json, make sure you're passing something that can be serialized into json.
    - If some of your evaluable algorithms handle input differently, make an an `if` statement that pattern matches the 'evaluated_algorithm' key. For more info check out the example above.
    - Make sure to publish your algorithm before using it.
    
 **Note:** Not sure what the I/O should look like for your evaluator algorithm? Check out the the API [documentation](https://algorithmia.com/algorithms/algoevaldemo/StringReversalEvaluator/docs) for the string reversal evaluator, it should get you on the right track.

## Step 2: Create a New Evaluation

##### Go to the [Algorithmia Evaluations Wizard]({{site.url}}/evaluations) and click "Create Evaluation"

<img src="{{site.baseurl}}/images/post_images/comparing_algorithms/create_evaluation.png" alt="Create Evaluation" class="screenshot">

## Step 3: Set up your Evaluation

### Step 3.1: Add your evaluator algorithm at the bottom, click "Choose Existing".
<img src="{{site.baseurl}}/images/post_images/comparing_algorithms/choose_existing_evaluation.png" alt="Choose Existing Evaluation" class="screenshot">

- If you can't find your evaluator, make sure its:
    - A [published algorithm]({{site.url}}{{site.baseurl}}/algorithm-development/algorithm-basics/your-first-algo/#publish-your-algorithm)
    - Visible to your user account
    - Not created by an Organization (for now)

### Step 3.2: Add your Evaluable Algorithms
<img src="{{site.baseurl}}/images/post_images/comparing_algorithms/add_evaluable_algos.png" alt="Add Evaluable Algorithms" class="screenshot">

-  If you can't find your Evaluable Algorithm, make sure its:
    - A [published algorithm]({{site.url}}{{site.baseurl}}/algorithm-development/algorithm-basics/your-first-algo/#publish-your-algorithm)
    - Visible to your user account

### Step 3.3: Provide an input to your evaluator algorithm

<img src="{{site.baseurl}}/images/post_images/comparing_algorithms/provide_an_input.png" alt="Provide an Input" class="screenshot">
- Things to keep in mind about your evaluator algorithm's input:
    - it must be a json object
    - Remember that the `evaluated_algorithm` input variable defined in the evaluator algorithm is passed automatically.
    - Any additional parameters you wish to provide to your evaluable algorithms should be passed here, in the evaluation input.

## Step 4: Run your Evaluation

<img src="{{site.baseurl}}/images/post_images/comparing_algorithms/run_your_evaluation.png" alt="Run your Evaluation" class="screenshot">

- Once your input is ready, you can click the big "run evaluation" button at the top
- Once your evaluation is executing, you can click the "results" tab and check the results.
- If any errors or exceptions are detected during algorithm execution, they'll be declared in the `Error` column on the far right.

**Note:** Running an evaluation costs credits, since both the evaluator algorithm and the evaluated algorithms will be executed.  

And by following this guide, you should be able to create your very own evaluation!

Have any questions or comments? Feel free to get in touch by contacting us in that chat box on the bottom right of your screen!
