---
author: jon_peck
categories: [algo-dev]
excerpt: "Determining an Algorithm's live list of packages / dependencies and creating local execution environments"
image:
    teaser: /post_images/list_packages/dependencies.png
layout: article
permalink: /algorithm-development/advanced-algorithm-development/list-packages/
show_related: true
tags: [algo-dev]
title: "Inspecting Algorithms: determining the live list of packages / dependencies"
---

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/list_packages/dependencies_wide.png" class="img-fill">

With Algorithmia, specifying dependencies is easy: you don't need to create a dockerfile or build any local images. Instead, you just specify your dependencies via the Web IDE or by including a file such as `requirements.txt` in your Algorithm's repo. The dependency tree is automatically resolved on Algorithmia's servers.

This is convenient -- but can also lead to a situation where you aren't sure exactly which packages and versions are in your Algorithm environment, especially if you did not specify exact minor version numbers in your dependencies file. When this happens, you can just drop a bit of code into your Algorithm to dynamically report the full list of installed packages.

## Listing packages in R

To get a list of which packages (and which R version) are currently being used by your Algorithm, temporarily replace your main algorithm function with the following code snippet: 

```r
algorithm <- function(input) {
    deps = installed.packages()
    list(Version=R.Version(), paste(deps[,1],deps[,3]))
}
```

You can see this in action for a default, blank R Algorithm on our public platform at [https://algorithmia.com/algorithms/util/ListPackagesR](https://algorithmia.com/algorithms/util/ListPackagesR).

## Listing packages in Python   

To list which packages (and which version of Python) are currently being used by your Algorithm, temporarily replace your `apply()` function with the following:

```python
import pkg_resources
import sys

def apply(input):
    installed_packages_list = ['%s==%s'%(i.key, i.version) for i in pkg_resources.working_set]
    return {
        'Version': 'Python '+sys.version,
        'Packages': sorted(installed_packages_list)
    }
```

You can see this on our public site for a default [Python 2.7 - Beta](https://algorithmia.com/algorithms/util/ListPackagesPython27Beta) or [Python 3.6 - Beta](https://algorithmia.com/algorithms/util/ListPackagesPython36Beta) Algorithm.


## Creating a local Python Virtualenv to emulate the Algorithm's environment

When working in Python, [virtual environments](https://docs.python-guide.org/dev/virtualenvs/) are a lightweight way to create an execution environment for a specific Python version and set of installed packages.

This code snippet will generate a script you can use to set up a local virtualenv. Paste it into your own Algorithm, temporarily replacing your own `apply()` function:  

```python
import sys
import pkg_resources

def apply(input):
    ignore_packages = ['python','dynd','cryptography','llvmlite']
    pip_packages = ' '.join(sorted(['%s==%s'%(i.key, i.version) for i in pkg_resources.working_set if 'conda' not in i.key and i.key not in ignore_packages]))
    if 'path.py==0.0.0' in pip_packages: return 'Incompatible packageset; please use a newer Algorithm type such as: Python{}-Beta'.format(sys.version_info.major)
    conda_packages = ' '.join(sorted(['%s==%s'%(i.key, i.version) for i in pkg_resources.working_set if 'conda' in i.key]))
    script = '\n# DO NOT run this script all at once; run each line individually and verify, as you may need to adjust paths to your python binaries\n\n'
    script += 'virtualenv --python=/usr/bin/python{0}.{1} algo_env_{0}_{1}\n\n'.format(sys.version_info.major, sys.version_info.minor)
    script += 'source algo_env_{0}_{1}/bin/activate\n\n'.format(sys.version_info.major, sys.version_info.minor)
    if conda_packages: script += 'conda install {}\n\n'.format(conda_packages)
    if pip_packages: script += 'pip install {}\n\n'.format(pip_packages)
    return script
```

The output will look something like this, customized for your Algorithm's specific Python version and package list:

```bash
# DO NOT run this script all at once; run each line individually and verify, as you may need to adjust paths to your python binaries

virtualenv --python=/usr/bin/python3.6 algo_env_3_6

source algo_env_3_6/bin/activate

pip install algorithmia-api-client==1.0.1 algorithmia==1.2.1 certifi==2019.9.11 chardet==3.0.4 enum34==1.1.6 idna==2.8 pip==18.1 python-dateutil==2.8.0 requests==2.22.0 setuptools==41.0.1 six==1.12.0 urllib3==1.25.6 wheel==0.33.4
```

As the warning implies, you shouldn't run this all at once; if the activation step fails, it could overwrite the installed packages for your default Python environment.

Instead, try just the first line. If it fails, you might need to [install virtualenv](https://virtualenv.pypa.io/en/stable/installation/), [download another version of Python](https://www.python.org/downloads/) or change the `usr/bin` path depending on where your Python binaries are installed (check `/usr/local/bin` or try running `which python`).

Once you're able to create the virtualenv, the `source` line should activate it. If it succeeds, you'll usually see a prefix such as `(algo_env_3_6)` at your command prompt.

Now try the `pip` installation. If it fails, try running it for each package individually until you pinpoint the failure.

When you're done working in this virtualenv, exit it by typing `deactivate`. You can return anytime by running the `source` line... no need to reinstall your packages unless they change!

You can see this in action for a default [Python 2.7 - Beta](https://algorithmia.com/algorithms/util/CreateVenvScriptPython27Beta) or [Python 3.6 - Beta](https://algorithmia.com/algorithms/util/CreateVenvScriptPython36Beta) on Algorithmia.com
