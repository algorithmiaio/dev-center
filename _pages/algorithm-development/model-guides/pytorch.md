---
layout: article
title:  "PyTorch"
excerpt: "Bring your OpenCV model to Algorithmia."
categories: model-guides
tags: [algo-model-guide]
show_related: true
author: steph_kim
image:
    teaser: /language_logos/algo_icon.svg
---

Welcome to hosting your <a href="http://pytorch.org/">PyTorch</a> model on Algorithmia!

## Prerequisites
Before you get started hosting your Pytorch model on Algorithmia there are a few things you'll want to do first:

### Train and save the model file.

Saving and loading models in Pytorch can get tedious, because it requires keeping a copy of your source class code for any models you want to load again. The team at Algorithmia created a module for Python that sidesteps this process, along with a few other optimizations. For more information, check out the GitHub repo <a href="https://github.com/algorithmiaio/pytorch-ergonomics">here</a>.

##### 1. Install and Import the Pytorch-Ergonomics Package

Install the `ergo-pytorch` package using <a href="https://pypi.org/">Pypi</a> with `pip install ergo-pytorch==1.1.1`. Import the base module with `import ergonomics`, or a specific module with `from ergonomics import model_ergonomics`.

##### 2. Save Your Model Using Our Ergonomics Package

Instead of using Pytorch’s built in `model.save()` functionality, use `ergonomics.model_ergonomics.save_portable(source_path)`. This will save your model along with the class code, so you don’t need to copy and paste that later on. 

### Create a Data Collection
Here you'll want to create a data collection to host your model.

- To use the Data API, log into your Algorithmia account and create a data collection via the <a href="{{ site.baseurl }}/data/hosted">Data Collections</a> page.

- Click on **“Add Collection”** under the “My Collections” section on your data collections page.

- After you create your collection you can set the read and write access on your data collection. For more information check out: <a href="{{ site.baseurl }}/data/hosted/">Data Collection Types</a>

<img src="{{ site.baseurl }}/images/post_images/model_hosting/add_collection.png" alt="Create a data collection" class="screenshot img-sm">

### Upload your Model into a Collection
Next, upload your pickled model to your newly created data collection.

- Load model by clicking box **“Drop files here to upload”**

- Note the path to your files: data://username/collections_name/mnist_model.h5

<img src="{{ site.baseurl }}/images/post_images/model_hosting/keras_data_collection.png" alt="Create a data collection" class="screenshot img-md">

## Create your Algorithm
Creating your algorithm is easy!

- To add an algorithm, simply click **“Add Algorithm”** from the user profile icon.
- Name your algorithm, select the language, choose permissions and make the code either open or closed source.

**Note**: There is also a checkbox for 'Standard Execution Environment' or 'Advanced GPU'. For deep learning models you will want to check 'Advanced GPU'.

<img src="{{ site.baseurl }}/images/post_images/model_hosting/create_new_alg_dl_python3.png" alt="Create your algorithm" class="screenshot img-sm">

Now hit the "Create" button on the bottom lower right of the form and you'll see this modal:

<img src="{{ site.baseurl }}/images/post_images/model_hosting/deep_learning_cli.png" alt="cli info modal" class="screenshot">

You can now clone your Algorithm (via Git) and install the CLI to edit/test locally, **or** you can close the modal and continue to create your algorithm in the Web IDE.

#### Editing your algorithm locally via GIT & CLI

The preferred way to edit and test your Algorithm's code is to install the CLI on your local machine, clone your algorithm's repo via Git, and use your favorite editing tools to modify the code. This gives you the benefits of using a familiar development environment, plus an easy way to test your changes locally before committing changes back to the repo and publishing a new algorithm version.

To learn more about this process, Algorithmia's [CLI]({{ site.baseurl }}/clients/cli/) and [Git]({{ site.baseurl }}/algorithm-development/git/) guides. If you're already familiar with the CLI and Git, the basic steps you need to take are:

1. Install the CLI: `curl -sSLf https://algorithmia.com/install.sh | sh` (Windows instructions [here](https://algorithmia.com/developers/clients/cli/#installing-the-algorithmia-cli) ) 
2. Clone your algorithm: `algo clone username/algoname`
3. Use your preferred editor to modify the code
4. Test your algorithm: `cd algoname; algo runlocal -D [JSON FILE]`
5. Commit your changes: `git commit -m [commit message]; git push origin master`
6. Publish your changes: for now, you must do this via the web IDE:
    1. visit [https://algorithmia.com/user](https://algorithmia.com/user)
    2. click on your algorithm
    3. click "Edit Source"
    4. click "Compile", then "[Publish](#publish-algorithm)"

#### Editing your algorithm via the web IDE

If you prefer to continue creating your algorithm in the Web IDE, simply close the modal and you should see the algorithm description page for your newly created algorithm:

<img src="{{ site.baseurl }}/images/post_images/model_hosting/deep_learning_algorithm_page.png" alt="Algorithm descrption page" class="screenshot">

Notice the tabs: Run, Docs, Cost, Discussion, Manage, and Source.

The tab currently showing "Run" is where users can run the algorithm with the default input that you will provide during the publishing step of the algorithm or they can run their own input to test out your algorithm. Also, on this tab, you can add a short summary stating what your algorithm is and why people might be interested in it (for example how it solves a particular problem in a use case). 

"Docs" consists of the section that you will want to show how to use your algorithm including complete information about the input types allowed and what the expected outputs will be.

"Cost" will be filled out automatically once you publish your algorithm and will show if you've chosen to charge royalites or if you've decided to open source your algorithm. It will also give the estimated cost so the user consuming your algorithm can see how much it will cost.

The "Discussion" tab shows the comments and questions from users so you can keep up to date regarding user feedback. 

Under the "Manage" tab you can see how to clone your algorithm, see what items are checked off in the Algorithm Checklist and see permissions for your algorithm which were set when you created your algorithm.

Finally click on the "Source" tab which will display the UI for creating your algorithm if you prefer it over the CLI.

Algorithmia creates the skeleton for your algorithm and bring you to the Edit Algorithm page. The editor will have the "Hello world" code already filled out for you, as shown below.

<img src="{{ site.baseurl }}/images/post_images/model_hosting/deep_learning_algorithm_console.png" alt="Algorithm console Python" class="screenshot">

### Set your Dependencies
Now is the time to set your dependencies that your model relies on.

- Click on the **"Dependencies"** button at the top right of the UI and list your packages under the required ones already listed and click **"Save Dependencies"** on the bottom right corner.

<img src="{{ site.baseurl }}/images/post_images/model_hosting/keras_dependencies.png" alt="Set your dependencies" class="screenshot img-md">

If you're using the CPU implementation of Pytorch, you can add `torch` directly to the dependencies. If you're using a GPU version, you'll need to use our customized `.whl` file. You can find it <a href="https://s3.amazonaws.com/algorithmia-wheels/torch_gpu-0.3.1b0+2b47480-cp35-cp35m-linux_x86_64.whl">here</a>, and read about it in more detail on the ergo-pytorch <a href="https://github.com/algorithmiaio/pytorch-ergonomics">repo</a>.

## Load your Model
Here is where you load and run your model which will be called by the apply() function.
Our recommendation is to preload your model in a separate function before apply(). The reasoning behind this is because when your model is first loaded it can take some time to load depending on the file size. However, with all subsequent calls only the apply() function gets called which will be much faster since your model is already loaded!

Note that you always want to create valid JSON input and output in your algorithm. For example this algorithm takes a JSON blob passing in a csv file hosted on [Algorithmia, Amazon S3, or Dropbox](https://algorithmia.com/developers/data/). 
{: .notice-info}

### Example Input:
{% highlight python %}
{
   "test_data": ["data://user_name/pytorch_data/horse.jpg",
   "data://user_name/pytorch_data/frog.jpg"]
}
{% endhighlight %}

### Example Output:
{% highlight python %}
{
  "output": [
    "horse",
    "frog"
  ]
}
{% endhighlight %}

### CPUs vs. GPUs on Pytorch 

Pytorch offers a few different distributions for download that are split by CPU and GPU. The Pytorch files for CPU usage are normal sized, but when using the GPU packages the files can get very large. 

For GPU based implementations we've created a workaround that loads the files much faster than the default. When using the workaround, the main file stays the same (see example hosted model below) but you'll need to create an extra file that executes the workaround. See the second example `implement.py` for how to do this. 

### Example Hosted Model (Main):

{% highlight python %}
"""
    An example of how to load a trained model and use it
    to predict labels for labels in the CIFAR-10 dataset.

"""

import Algorithmia
from PIL import Image
import numpy as np
import torch
from torch.autograd import Variable
from torchvision import transforms
import os
import ergonomics.model_ergonomics as ergonomics

client = Algorithmia.client()

def load_model(path):
    newCNN = ergonomics.serialization.load_portable('MODEL_PATH')
    return newCNN
    
def preprocess(input_image):
    file_url = client.file(input_image).getFile().name
    #Normalize and resize image
    normalize = transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
    composed = transforms.Compose([transforms.Resize(32), transforms.ToTensor(),normalize])
    img = Image.open(file_url)
    img.load()
    output = composed(img)
    return output
    
def predict(input, newCNN):
    outputs = newCNN(Variable(torch.stack([input])))
    _, predicted = torch.max(outputs.data, 1)
    return int(predicted.numpy())

def apply(input):
    classes = ['plane', 'car', 'bird', 'cat', 'deer', 'dog', 'frog', 'horse', 'ship', 'truck']
    newCNN = load_portable('MODEL_PATH')
    outputs = []
    for input_url in input['urls']:
        processed = preprocess(input_url)
        output = predict(processed, newCNN)
        outputs.append(classes[output])
        
    return {"output" : outputs}


{% endhighlight %}

If you're using GPUs, you'll also need to create a second file to implement the workaround:

### Example Workaround File:

{% highlight python %}
"""
    An example of how to speed up execution of your main code file.
"""

import Algorithmia
from ergonomics.algorithm_ergonomics import execute_workaround

client = Algorithmia.client()

def load_pytorch_model():
    filename = 'data://gagejustins/Pytorch/simpleCNN.zip'
    model_loc = client.file(filename).getFile().name
    return model_loc
    
model_loc = load_pytorch_model()
    
def parseInputs(input):
    #Iterate through input and append urls to input_urls list
    output = {'urls': []}
    if isinstance(input, dict):
        if 'test_data' in input and isinstance(input['test_data'], str):
            output['urls'].append(input['test_data'])
        elif 'test_data' in input and isinstance(input['test_data'], list):
            output['urls'] = input['test_data']
        else:
            raise AlgorithmError("AlgoError3000: Invalid input")
    
    return output
    

def apply(input):
    #Define classes
    #Parse input into list of input_urls
    formatted = parseInputs(input)
    formatted['local_model_path'] = model_loc
    #Apply algorithm to inputs and append output to outputs list
    output = execute_workaround(formatted, "src/main.py", "execute")
        
    return output

{% endhighlight %}

If you run into any problems or need help, don't hesitate to reach out to our team!

If you are authoring an algorithm, avoid using the ‘.my’ pseudonym in the source code. When the algorithm is executed, ‘.my’ will be interpreted as the user name of the user who called the algorithm, rather than the author’s user name.
{: .notice-warning}

## Publish your Algorithm
Last is publishing your algorithm. The best part of hosting your model on Algorithmia is that users can access it via an API that takes only a few lines of code to use! Here is what you can set when publishing your algorithm:

On the upper right hand side of the algorithm page you'll see a purple button "Publish" which will bring up a modal:

<img src="{{ site.baseurl }}/images/post_images/algo_dev_lang/publish_algorithm.png" alt="Publish an algorithm" class="screenshot img-sm">

In this modal, you'll see a Changes tab, a Sample I/O tab, and one called Versioning.

Changes shows you your commit history and release notes.

Sample I/O is where you'll create your sample input and output for the user to try under Try the API in the Run tab. When you add a sample input, make sure to test it out with all the inputs that you accept since users will be able to test your algorithm with their own inputs.

Under the Versioning tab, you can select whether your algorithm will be for public use or private use as well as set the royalty. The algorithm can either be royalty-free or charge per-call. If you opt to have the algorithm charge a royalty, as the author, you will earn 70% of the royalty cost.

Check out [Algorithm Pricing]({{ site.baseurl }}/pricing/) for more information on how much algorithms will cost to run.

Under Semantic Versioning you can choose which kind of release your change should fall under: Major, Minor, or Revision. 

If you are satisfied with your algorithm and settings, go ahead and hit publish. Congratulations, you’re an algorithm developer!

## Working Demo
If you would like to check this demo out on the platform you can find it here: <a href="{{ site.baseurl }}/algorithms/algorithmiahq/pytorchDemo">Pytorch CNN Demo.</a>

That's it for hosting your <a href="http://pytorch.org/">Pytorch</a> model on Algorithmia!