---
categories: [monitoring-&-observability]
excerpt: "Integrating with an external model observability platform"
image:
  teaser: /language_logos/arthur.png
layout: article
permalink: /monitoring-and-observability/arthur/
redirect_from: /integrations/arthur/
show_related: false
tags: [integrations, monitoring-observability]
title: "Arthur"
---

[Arthur](https://www.arthur.ai/) is an observability platform that provides proactive model monitoring to give you confidence and peace of mind that your AI deployments are performing at peak. Their platform provides a layer of performance monitoring, algorithmic bias detection, and explainability, even for black-box models, so you can quickly detect, diagnose, and fix any issues that arise in production.

In this guide, we'll show you how to integrate Arthur with Algorithmia so you can bring their advanced monitoring capabilities to your algorithms. To make use of this integration, you'll need to have an account set up on their platform.

To start, you'll need to add the Arthur AI Python library to your `requirements.txt` file, as well as pandas and joblib, which are used in this example algorithm:

```
arthurai
joblib
pandas
```

We'll begin by looking at a basic Python algorithm that implements the `predict_proba()` method to make model predictions.

First, you must instantiate a `client` object to handle the request. Note that if you're running [Algorithmia Enterprise](/enterprise), you'll want to specify the API endpoint when you create the client object.

In this example, the trained model `credit_model.pkl` is saved in a [hosted data collection](/developers/data/hosted) on Algorithmia, but it could be loaded from a [data source](/developers/data) outside of Algorithmia as well. In this example, the `COLLECTION_OWNER` string must match the account name (i.e., username) associated with the API key calling the algorithm, and the `COLLECTION_NAME` string must match the name of the hosted data collection.

{% highlight python %}
import Algorithmia
import joblib
import pandas as pd


client = Algorithmia.client("YOUR_API_KEY", "https://mylocalendpoint")

model_path = client.file(
    "data://COLLECTION_OWNER/COLLECTION_NAME/"+"credit_model.pkl").getFile().name
sk_model = joblib.load(model_path)

def apply(input):
    predicted_probs = sk_model.predict_proba(pd.DataFrame([input]))[0]
    return f"Model prediction: {predicted_probs}."
{% endhighlight %}

To add Arthur's monitoring capabilities, import Arthur's Python library and establish a connection with the platform through the `ArthurAI` class. Then, decorate the target function with `@log_inferences` to log the inference data automatically with Arthur:

{% highlight python %}
import Algorithmia
import joblib
import pandas as pd

from arthurai import ArthurAI
from arthurai.client.apiv3.decorators import log_inferences


client = Algorithmia.client("YOUR_API_KEY", "https://mylocalendpoint")

model_path = client.file(
    "data://COLLECTION_OWNER/COLLECTION_NAME/"+"credit_model.pkl").getFile().name
sk_model = joblib.load(model_path)

ARTHUR_ACCESS_KEY = "YOUR_ARTHUR_KEY"
arthur_model = ArthurAI(
    {"url": "app.arthur.ai",
     "access_key": ARTHUR_ACCESS_KEY}
).get_model("CreditModel")

@log_inferences(arthur_model)
def model_predict(input_vec):
    return sk_model.predict_proba(input_vec)[0]

def apply(input):
    prediction, inference_id = model_predict(pd.DataFrame([input]))
    return f"Logged inference {inference_id} with ArthurAI."
{% endhighlight %}

Once you’ve connected your algorithm to Arthur's platform and published it, all executions of that specific version of your algorithm will send inference data to Arthur.

In addition to Arthur, Algorithmia has other model monitoring and observability capabilities. If you're using Algorithmia Enterprise, you have access to an admin panel where you can view usage metrics at the cluster, user account, and algorithm level. See the [Platform Usage Reporting](/developers/algorithmia-enterprise/usage-metrics) page for more information. You can also opt in to Algorithmia Insights in your algorithms, enabling you to publish your inference data to a Kafka topic which you can then subscribe to from external observability platforms. See [Algorithmia Insights](/developers/algorithmia-enterprise/algorithmia-insights) for more information.

If you're new to Algorithmia and would like to learn more about our product and model monitoring capabilities, please [contact our sales team](https://info.algorithmia.com/contact-sales). We'd love to hear from you!
