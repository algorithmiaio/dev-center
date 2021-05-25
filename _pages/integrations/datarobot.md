---
layout: article
title:  "Data Robot"
permalink: integrations/datarobot/
excerpt: "Deploy your DataRobot models on Algorithmia"
excerpt-short: "Deploy your DataRobot models on Algorithmia"
categories: [integrations]
tags: [integrations]
show_related: false
image:
    teaser: /language_logos/datarobot.svg
---

DataRobot Prime provides the ability to export a [DataRobot](https://www.datarobot.com/)-trained model for deployment on an external platform such as Algorithmia. To do this, Prime creates a series of rules that approximate the original model and then encapsulates these rules into a Python module or Java class that can be exported and used externally.

For details on how to export a model using DataRobot Prime, see this [DataRobot blog post](https://community.datarobot.com/t5/resources/exporting-models-with-datarobot-prime/ta-p/4629).

Once you've exported your DataRobot Prime model, log in to Algorithmia and create a new algorithm. In this example, we'll create a Python algorithm using the predefined "Python 3.7 + H2O" environment. Set your dependencies as follows, including the `six` library for Python 2 backward compatibility.

```
algorithmia>=1.0.0,<2.0
six
```

In this example, the exported DataRobot Prime model is in `SocialMedia.jar`, which has been uploaded to the hosted data collection `COLLECTION_NAME`, which is owned by the account `COLLECTION_OWNER`. 

The workflow used in this code is standard for a Python algorithm, with the main exception being that we call the actual model with Java. Specifically, in order to run the JAR file, we shell out to the Java interpreter using the Python standard libary's `subprocess.Popen()` class. Essentially, this provides a Python wrapper for the Java model, enabling data scientists to work in Python but interact with the JAR file from DataRobot Prime.

Note that this usage of the `Algorithmia.client()` method assumes this code is being run on Algorithmia. If testing locally, you'll need to add your API key and the name of your cluster (e.g., `Algorithmia.client("API_KEY", "CLUSTER_DOMAIN"`).


```
import Algorithmia
from subprocess import Popen, PIPE
import csv

client = Algorithmia.client()


def load():
    local_path = client.file("data://COLLECTION_OWNER/COLLECTION_NAME/SocialMedia.jar").getFile().name
    return local_path


def apply(input):
    local_file = client.file(input).getFile().name
    proc = Popen(f"java -jar {jar_path} csv --input={local_file} --output=- --log_level=OFF".split(" "), stdout=PIPE, stderr=PIPE)
    output, err = proc.communicate()
    if err:
        for line in err.decode('utf-8').splitlines():
            if "Exception" in line:
                raise Exception(str(line))
    rows = csv.reader(output.decode('ascii').splitlines(), delimiter=",")
    header_rows = next(rows)
    data_rows = next(rows)
    output_buffer = {}
    for h, d in zip(header_rows, data_rows):
        output_buffer[h] = d
    return output_buffer


jar_path = load()
if __name__ == "__main__":
    with open("SocialMedia.csv", encoding="ascii") as f:
        payload = f.read()
    result = apply(payload)
    return result
```
