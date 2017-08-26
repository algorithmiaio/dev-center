---
layout: article
title:  "Testing your Algorithm"
excerpt: "Algorithmia provides tools and test examples to help you author product-ready algorithms."
categories: algorithm-development
tags: [algo-dev]
show_related: true
image:
  teaser: /icons/algo.svg
---

Testing is an important part of software development, and Algorithmia provides tools and examples to help you author robust, production-ready algorithms. Each new algorithm includes an example test case for a popular, language-specific test framework. You can change and add tests use the Algorithmia platform and tools to ensure your algorithm doesn't regress each time you make changes to your code.

Note: Algorithm testing support is not currently available for Java or Scala algorithms, and the scope of testing is currently only aimed at unit testing (i.e. Making API calls from tests is not supported). If you have other use cases for testing, reach out and let us know more about your scenario.
{: .notice-info}


#### Running tests from the Web IDE

New algorithms include an example test case. If you navigate to the Web IDE for your algorithm, you can find that test case; some languages include the test case the main file, while other languages include the tests in a separate file.

![Test code]({{ site.baseurl }}/images/post_images/testing/test-code.png)

You can run these tests by simply saving your code and typing `test` into the test console on the editor page.

![Console testing]({{ site.baseurl }}/images/post_images/testing/console-testing.png)

#### Running tests locally

New algorithms include a script in the `bin` directory that runs the tests. When developing locally, it is recommended that you run your unit tests frequently during development, especially before pushing changes back to Alogorithmia. To do this, you just need any dependencies installed (i.e. by running `bin/build`) and then run `bin/test` and ensure that your tests pass.

![Local testing]({{ site.baseurl }}/images/post_images/testing/local-testing.png)


