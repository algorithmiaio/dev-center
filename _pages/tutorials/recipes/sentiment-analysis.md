---
layout: article
title:  "The Algorithmia Guide to Sentiment Analysis"
date:   2016-01-28 01:30:38
categories: recipes
permalink: /tutorials/recipes/sentiment-analysis
tags: [text-analysis, sentiment-analysis]
show_related: false
author: matt_kiser
excerpt: "New to Sentiment Analysis? Start here to learn the basics and get started."
image:
  feature: /post_images/sentiment_analysis/SentimentAnalysis_1600x800.png
  teaser: /post_images/sentiment_analysis/SentimentAnalysis_400x250.png
---

## Sentiment Analysis Overview
**Sentiment Analysis** is the use of natural language processing, statistics, and text analysis to extract, and identify the sentiment of text into positive, negative, or neutral categories. We often see sentiment analysis used to arrive at a binary decision: somebody is either **for** or **against** something, users **like** or **dislike** something, or the product is **good** or **bad**.

Sentiment analysis is also called **opinion mining** since it includes identifying consumer attitudes, emotions, and opinions of a company’s product, brand, or service.

---

## Sentiment Analysis Use Cases
The use of sentiment analysis is frequently applied to reviews and social media to help marketing and customer service teams identify the feelings of consumers. In media, such as product reviews, sentiment analysis can be used to uncover whether consumers are satisfied or dissatisfied with a product. Likewise, a company could use sentiment analysis to measure the impact of a new product, ad campaign, or consumer’s response to recent company news on social media.

A customer service agent at a company could use sentiment analysis to automatically sort incoming user email into “urgent” or “not urgent” buckets based on the sentiment of the email, proactively identifying frustrated users. The agent could then direct their time toward resolving the users with the most urgent needs first.

Sentiment analysis is often used in business intelligence to understand the subjective reasons why consumers are or are not responding to something (e.g. Why are consumers buying a product? What do they think of the user experience? Did customer service support meet their expectations?). Sentiment analysis can also be used in the areas of political science, sociology, and psychology to analyze trends, ideological bias, opinions, gauge reactions, etc.

---

## Challenges of Sentiment Analysis
People express opinions in complex ways, which makes understanding the subject of human opinions a difficult problem to solve. Rhetorical devices like sarcasm, irony, and implied meaning can mislead sentiment analysis, which is why concise and focused opinions like product, book, movie, and music reviews are easier to analyze.

----

## Sentiment Analysis Algorithms
Algorithmia provides several powerful sentiment analysis algorithms to developers. Implementing sentiment analysis in your apps is as simple as calling our [REST API](http://docs.algorithmia.com/#api-specification). There are no servers to setup, or settings to configure. Sentiment Analysis can be used to quickly analyze the text of research papers, news articles, social media posts like Tweets, and more.

[Social Sentiment Analysis](https://algorithmia.com/algorithms/nlp/SocialSentimentAnalysis) is an algorithm that is tuned to analyze the sentiment of social media content, like tweets and status updates. The algorithm takes a string, and returns the sentiment rating for the “positive,” “negative,” and “neutral.” In addition, this algorithm provides a compound result, which is the general, overall sentiment of the string.

Input Example:

{% highlight json lineanchors %}
{
  "sentenceList": [
    "I like double cheese pizza",
    "I love black coffee and donuts",
    "I don't want to have diabetes"
  ]
}
{% endhighlight %}

Output Example:

{% highlight json lineanchors %}
[
  {
    "positive": 0.455,
    "negative": 0,
    "sentence": "I like double cheese pizza",
    "neutral": 0.545,
    "compound": 0.3612
  },
  {
    "positive": 0.512,
    "negative": 0,
    "sentence": "I love black coffee and donuts",
    "neutral": 0.488,
    "compound": 0.6369
  },
  {
    "positive": 0,
    "negative": 0.234,
    "sentence": "I don't want to have diabetes",
    "neutral": 0.766,
    "compound": -0.0572
  }
]
{% endhighlight %}

Algorithmia also features a flexible, multi-use [Sentiment Analysis algorithm](https://algorithmia.com/algorithms/nlp/SentimentAnalysis), which is great for more general texts, like books, articles, or transcripts. This algorithm is based on the [Stanford CoreNLP toolkit](http://stanfordnlp.github.io/CoreNLP/). The algorithm takes an input string and returns a rating from 0 to 4, which corresponds to the sentiment being very negative, negative, neutral, positive, or very positive.

Input Example:

{% highlight json lineanchors %}
"Algorithmia loves sentiment analysis!"
{% endhighlight %}

Output Example:

{% highlight json lineanchors %}
{
  "result": 3
}
{% endhighlight %}

In addition, Algorithmia provides a [Sentiment By Term algorithm](https://algorithmia.com/algorithms/nlp/SentimentByTerm), which analyzes a document, and tries to find the sentiment for the given set of terms. The algorithm works by taking in a string, a list of terms, and then splits the document into sentences, and computes the average sentiment of each term. This algorithm becomes powerful when combined with an auto-tagging algorithms, such as [LDA](https://algorithmia.com/algorithms/nlp/LDA), [Auto-Tag URL](https://algorithmia.com/algorithms/tags/AutoTagURL), or [Named Entity Recognition](https://algorithmia.com/algorithms/StanfordNLP/NamedEntityRecognition) algorithms.

Input Example:

{% highlight json lineanchors %}
[
  "John Brown (Johnny to his friends) is amazing! Johnny is by far the best mechanic in the tri-state area. Bob Bozo is the worst.",
  ["john brown","bob"],
  {"john brown":["johnny"]}
]
{% endhighlight %}

Output Example:

{% highlight json lineanchors %}
{
  "john brown": 3.5, "bob": 1
}
{% endhighlight %}

---

## Additional Sentiment Analysis Resources

### Articles About Sentiment Analysis

**[Benchmarking Sentiment Analysis Algorithms](http://blog.algorithmia.com/2016/01/benchmarking-sentiment-analysis-algorithms/)** –
*"Sentiment Analysis, also known as opinion mining, is a powerful tool you can use to build smarter products. It’s a natural language processing algorithm that gives you a general idea about the positive, neutral, and negative sentiment of texts. Social media monitoring apps and companies all rely on sentiment analysis and machine learning to assist them in gaining insights about mentions, brands, and products."*

**[Deep Learning for Sentiment Analysis](http://nlp.stanford.edu/sentiment/)** –
*"This website provides a live demo for predicting the sentiment of movie reviews. In contrast, our new deep learning model actually builds up a representation of whole sentences based on the sentence structure. You can also browse the Stanford Sentiment Treebank, the dataset on which this model was trained."*

**[Creating a Sentiment Analysis Model](https://cloud.google.com/prediction/docs/sentiment_analysis)** – *"This document explains how to create a basic sentiment analysis model using the Google Prediction API. A sentiment analysis model is used to analyze a text string and classify it with one of the labels that you provide; for example, you could analyze a tweet to determine whether it is positive or negative, or analyze an email to determine whether it is happy, frustrated, or sad. You must train your sentiment model against examples of the type of data that you are going to see when you use your model."*

**[KD Nuggets Sentiment Analysis Topic Page](http://www.kdnuggets.com/tag/sentiment-analysis)**


**[The Natural Language Processing Dictionary](http://www.cse.unsw.edu.au/~billw/nlpdict.html)**


### Sentiment Analysis Research Papers
**[Thumbs Up or Thumbs Down? Semantic Orientation Applied to Unsupervised Classification of Reviews (Turney 2002)](http://dl.acm.org/citation.cfm?id=1073153)** – *"This paper presents a simple unsupervised learning algorithm for classifying reviews as recommended (thumbs up) or not recommended (thumbs down). The classification of a review is predicted by the average semantic orientation of the phrases in the review that contain adjectives or adverbs. A phrase has a positive semantic orientation when it has good associations (e.g., "subtle nuances") and a negative semantic orientation when it has bad associations (e.g., "very cavalier")."* ([PDF](http://www.aclweb.org/anthology/P02-1053.pdf))


**[Thumbs up?: sentiment classification using machine learning techniques (Pang, Lee 2002)](http://dl.acm.org/citation.cfm?id=1118704)** – *"We consider the problem of classifying documents not by topic, but by overall sentiment, e.g., determining whether a review is positive or negative. Using movie reviews as data, we find that standard machine learning techniques definitively outperform human-produced baselines. However, the three machine learning methods we employed (Naive Bayes, maximum entropy classification, and support vector machines) do not perform as well on sentiment classification as on traditional topic-based categorization."*

**[Synthesis Lectures on Human Language Technologies](http://www.morganclaypool.com/doi/abs/10.2200/S00416ED1V01Y201204HLT016)** – *"Sentiment analysis and opinion mining is the field of study that analyzes people's opinions, sentiments, evaluations, attitudes, and emotions from written language. It is one of the most active research areas in natural language processing and is also widely studied in data mining, Web mining, and text mining. In fact, this research has spread outside of computer science to the management sciences and social sciences due to its importance to business and society as a whole."*

**[Opinion Mining and Sentiment Analysis](http://www.cs.cornell.edu/home/llee/opinion-mining-sentiment-analysis-survey.html)** – *"An important part of our information-gathering behavior has always been to find out what other people think. With the growing availability and popularity of opinion-rich resources such as online review sites and personal blogs, new opportunities and challenges arise as people can, and do, actively use information technologies to seek out and understand the opinions of others. The sudden eruption of activity in the area of opinion mining and sentiment analysis, which deals with the computational treatment of opinion, sentiment, and subjectivity in text, has thus occurred at least in part as a direct response to the surge of interest in new systems that deal directly with opinions as a first-class object."* ([PDF](http://www.cs.cornell.edu/home/llee/omsa/omsa-published.pdf))


**[Opinion Mining, Sentiment Analysis, and Opinion Spam Detection](https://www.cs.uic.edu/~liub/FBS/sentiment-analysis.html)** - *"This work is in the area of sentiment analysis and opinion mining from social media, e.g., reviews, forum discussions, and blogs. In our KDD-2004 paper, we proposed the Feature-Based Opinion Mining model, which is now also called Aspect-Based Opinion Mining (as the term feature here can confuse with the term feature used in machine learning). Our current work is in two main areas, which reflect two kinds of opinions (or evaluations)."*

**[Sentiment Analysis and Subjectivity](https://www.cs.uic.edu/~liub/FBS/NLP-handbook-sentiment-analysis.pdf)** – *"Textual information in the world can be broadly categorized into two main types: facts and opinions. Facts are objective expressions about entities, events and their properties. Much of the existing research on textual information processing has been focused on mining and retrieval of factual information, e.g., information retrieval, Web search, text classification, text clustering and many other text mining and natural language
processing tasks."*


### Top Online Sentiment Analysis Courses

**[Columbia University](https://www.coursera.org/course/nlangp)** – *"Natural language processing (NLP) deals with the application of computational models to text or speech data. Application areas within NLP include automatic (machine) translation between languages; dialogue systems, which allow a human to interact with a machine using natural language; and information extraction, where the goal is to transform unstructured text into structured (database) representations that can be searched and browsed in flexible ways. In this course you will study mathematical and computational models of language, and the application of these models to key problems in natural language processing."*

**[Stanford University](https://www.coursera.org/course/nlp)** – *"This course covers a broad range of topics in natural language processing, including word and sentence tokenization, text classification and sentiment analysis, spelling correction, information extraction, parsing, meaning extraction, and question answering, We will also introduce the underlying theory from probability, statistics, and machine learning that are crucial for the field, and cover fundamental algorithms like n-gram language modeling, naive bayes and maxent classifiers, sequence models like Hidden Markov Models, probabilistic dependency and constituent parsing, and vector-space models of meaning."*

**[University of Michigan](https://www.coursera.org/course/nlpintro)** – *"This course provides an introduction to the field of Natural Language Processing. It includes relevant background material in Linguistics, Mathematics, Probabilities, and Computer Science. Some of the topics covered in the class are Text Similarity, Part of Speech Tagging, Parsing, Semantics, Question Answering, Sentiment Analysis, and Text Summarization."*

**[Enabling Technologies for Data Science and Analytics: The Internet of Things](https://www.edx.org/course/enabling-technologies-data-science-columbiax-ds103x)** – *"The Internet of Things is rapidly growing. It is predicted that more than 25 million devices will be connected by 2020. In this data science course, you will learn about the major components of the Internet of Things and how data is acquired from sensors."*

### Presentations / Slides Decks on Sentiment Analysis
* [How Sentiment Analysis Works](http://www.slideshare.net/mcjenkins/how-sentiment-analysis-works?qid=81e3c643-628e-4e69-b5ce-6de6305feeb8&v=default&b=&from_search=1)
* [Practical Sentiment Analysis](http://www.slideshare.net/PeoplePattern/practical-sentiment-analysis-33376773?qid=81e3c643-628e-4e69-b5ce-6de6305feeb8&v=default&b=&from_search=6)
* [Sentiment Analysis By NLTK](http://www.slideshare.net/waitingkuo0527/sentiment-analysisbynltk?qid=81e3c643-628e-4e69-b5ce-6de6305feeb8&v=default&b=&from_search=9)
* [Sentiment Analysis and Opinion Mining Tutorial](https://www.cs.uic.edu/~liub/FBS/Sentiment-Analysis-tutorial-AAAI-2011.pdf)
* [Introduction to Sentiment Analysis](http://lct-master.org/files/MullenSentimentCourseSlides.pdf)

### Books On Sentiment Analysis
* [Sentiment Analysis: Mining Opinions, Sentiments, and Emotions](http://www.amazon.com/Sentiment-Analysis-Opinions-Sentiments-Emotions/dp/1107017890/ref=sr_1_1?s=books&ie=UTF8&qid=1453765815&sr=1-1&keywords=sentiment+analysis)
* [Mining the Social Web: Data Mining Facebook, Twitter, LinkedIn, Google+, GitHub, and More](http://www.amazon.com/Mining-Social-Web-Facebook-LinkedIn/dp/1449367615/ref=sr_1_3?s=books&ie=UTF8&qid=1453765815&sr=1-3&keywords=sentiment+analysis)
* [Practical Text Analytics: Interpreting Text and Unstructured Data for Business Intelligence](http://www.amazon.com/Practical-Text-Analytics-Interpreting-Unstructured/dp/0749474017/ref=sr_1_2?s=books&ie=UTF8&qid=1453765815&sr=1-2&keywords=sentiment+analysis)
* [Foundations of Statistical Natural Language Processing](http://www.amazon.com/Foundations-Statistical-Natural-Language-Processing/dp/0262133601/ref=sr_1_8?s=books&ie=UTF8&qid=1453765815&sr=1-8&keywords=sentiment+analysis)


---

## Related Topics
* [Natural Language Processing](https://en.wikipedia.org/wiki/Natural_language_processing)
* [Sentiment Analysis](https://en.wikipedia.org/wiki/Sentiment_analysis)
* [Information extraction](https://en.wikipedia.org/wiki/Information_extraction)
* [Summarization](https://en.wikipedia.org/wiki/Automatic_summarization)
* [Named Entity Recognition](https://en.wikipedia.org/wiki/Named-entity_recognition)
