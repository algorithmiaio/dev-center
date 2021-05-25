---
layout: article
title:  "Data Robot"
permalink: integrations/datarobot/
excerpt: "Deploy your DataRobot Prime models on Algorithmia"
excerpt-short: "Deploy your DataRobot Prime models on Algorithmia"
categories: [integrations]
tags: [integrations]
show_related: false
image:
    teaser: /language_logos/datarobot.svg
---

DataRobot Prime enables you to export a [DataRobot](https://www.datarobot.com/)-trained ML model for deployment to production on an external platform such as Algorithmia. To do this, DataRobot Prime creates a series of rules that approximate the original model and then encapsulates these rules into a Python module or Java class that can be exported for use externally.

For details on how to export a model using DataRobot Prime, see this [DataRobot blog post](https://community.datarobot.com/t5/resources/exporting-models-with-datarobot-prime/ta-p/4629).

Once you've exported your DataRobot Prime model, log in to Algorithmia and create a new algorithm. In this example, we'll create a Python algorithm using the predefined "Python 3.7 + H2O" environment, which includes Java. Set your dependencies as follows, including the `six` library for Python 2 backward compatibility.

```
algorithmia>=1.0.0,<2.0
six
```

In this example, the exported DataRobot Prime model is in `MODEL_FILE.jar`, which has been uploaded to the hosted data collection `COLLECTION_NAME`, owned by the Algorithmia account `COLLECTION_OWNER`. 

The workflow used in this code is standard for a Python algorithm, with the main exception being that we call the actual model using Java. Specifically, in order to run the JAR file, we shell out to the Java interpreter using the Python standard libary's `subprocess.Popen()` class. Essentially, this provides a Python wrapper for the Java model, enabling data scientists to work in Python but to use the JAR file from DataRobot.

Note that the usage of the `Algorithmia.client()` object assumes that this code is being run on Algorithmia in the Web IDE. If developing locally, you'll need to add your API key and your cluster's domain name (i.e., `Algorithmia.client("API_KEY", "CLUSTER_DOMAIN"`).

```python
import Algorithmia
from subprocess import Popen, PIPE
import csv

client = Algorithmia.client()


def load():
    local_path = client.file("data://COLLECTION_OWNER/COLLECTION_NAME/MODEL_FILE.jar").getFile().name
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
```

This algorithm takes as input the path to CSV data and as output, returns predictions. The input and output are listed below.

INPUT
```
"data://COLLECTION_OWNER/COLLECTION_NAME/DATA_FILE.csv"
```

OUTPUT
```
{
  "target_0_PREDICTION": "0.36594072058890637",
  "target_1_PREDICTION": "0.6340592794110936"
}
```