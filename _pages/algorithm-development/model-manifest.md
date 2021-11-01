---
categories: algorithm-development
layout: article
title: "Algorithm Development with Model Versioning"
---

In the past, when shipping algorithms into production on Algorithmia, it's been a challenge to ensure the integrity of model files. It's also been difficult to update models, as it's often the case that model file paths are hard-coded into the algorithm source code itself. Until now, there's never been a standardized way to manage the serialized model files and other data files that are used by algorithms. Enter the model manifest system.

## Introduction to the model manifest

Here we introduce the concept of model manifests: JSON files that define the types of data files your algorithm requires (or conditionally requires) to process requests. Model manifests can describe anything from weights files, to labels, to optional language models for more complex workflows.

The following is a brief example of a model manifest:

```json
{
  "required_files": [
    {
      "name": "scikit_model",
      "source_uri": "data://zeryx/scikit_demos/digits_classifier0001ABC.pkl",
      "fail_on_tamper": true
    }
  ],
  "optional_files": []
}
```

### Schemas

Below are schemas for model manifest file objects.

#### Model manifest schema

`required_files` - Any file objects defined here will be eagerly downloaded and prepared for algorithm usage
`optional_files` - Any file objects defined here will be lazily downloaded when a `get_model(..)` operation is invoked

#### Data file object schema

`name` - The unique identifier for this particular file object; this ID is the reference you'll want to use when interacting with and manipulating a data file in your algorithm
`source_uri` - An Algorithmia [data URI]((/developers/glossary/#data-uri)) (i.e., prefixed with `data://`, `s3://`, `gcp://`, etc.) that points to your model file; first make sure your account has access to the file at this location
`fail_on_tamper` - An optional boolean field that lets you define whether or not your algorithm should fail if the model manifest system detects that this file has been adjusted since the initial build

### Frozen manifest

The model manifest isn't the whole story, however. In order to truly ensure that your model files haven't been altered, a new `freeze` command has been added to the [algo CLI](/developers/clients/cli).

If you're in your algorithm directory after `git clone`ing locally, simply type `algo freeze` to automatically generate a frozen model manifest file. This file will include `md5_checksum` elements for each file and a `lock-checksum` element for the manifest file. These hash values can then be used to detect tampering.

```json
{
  "required_files": [
    {
      "name": "scikit_model",
      "source_uri": "data://zeryx/scikit_demos/digits_classifier0001ABC.pkl",
      "fail_on_tamper": true,
      "md5_checksum": "bbb2113cb37feaae8f0989f25021aafd"
    }
  ],
  "optional_files": [],
  "timestamp": "1635788201.4994009",
  "lock_checksum": "c30654c2359d42c8d6e36918516c52ad"
}
```

If there's a conflict between the md5 hash calculated at runtime and the hash calculated when the algorithm was compiled, a tamper event is sent; this special type of event can be picked up and used to throw an exception.

You don't want your algorithm in production to get tampered with; for example, imagine if an attacker subtly adjusted your model to do something illegal or malicious! By default, any data file object with `fail_on_tamper` set to `True` will throw an exception on md5 mismatch.

### Back to the code

Now that we've walked through the various elements of this custom model manifest structure, let's take a look at how we can actually use it in an algorithm.

The key component is the `get_model` method, e.g.:

```python
def load(model_data):
    model_path = model_data.get_model("scikit_model")
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    return model, model_data.client
```

With our overhauled [ADK system](/developers/algorithm-development/languages/python#what-is-an-algorithm-development-kit-adk), `load` functions now allow you to directly interact with and utilize model manifest objects without even needing to import them. No boiler plate needed—it's all handled automatically for you.

```python
from Algorithmia import ADK
import Algorithmia
import numpy as np
from PIL import Image
import pickle
import sklearn

def load(model_data):
    model_path = model_data.get_model("scikit_model")
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    return model, model_data.client

def format_image(url, client):
    local_image_path = client.file(url).getFile().name
    img = Image.open(local_image_path)
    img = np.asarray(img)
    return img.flatten()

def apply(input, load_data):
    model, client = load_data
    image = format_image(input, client)
    results = model.predict([image])[0]
    return int(results)

algorithm = ADK(apply, load)
algorithm.init("Algorithmia")
```

## Conclusion

With recent updates to the ADK, and with this new model manifest data-versioning system, we're making algorithm development simpler and more standardized.

If you want to see the model manifest system in action, please check out [this model manifest example algorithm](https://algorithmia.com/algorithms/zeryx/model_manifest_example), and keep your eyes peeled on our [algorithmia-adk](https://github.com/algorithmiaio/algorithmia-adk-python) repo for the latest improvements.
