---
layout: article
title:  "HDFS"
excerpt: "Access your files stored in hdfs"
categories: working-with-data
nav_index: 4
tags: [app-data-connectors]
show_related: true
author: steph_kim
image:
    teaser: /language_logos/filefolder.svg 
---

If your algorithm needs to read or write data from your hadoop cluster, you can do so using [webhdfs](https://hadoop.apache.org/docs/r1.0.4/webhdfs.html). 

You'll need to enable webhdfs in your hdfs config file [hdfs-site.xml](https://hadoop.apache.org/docs/r3.1.2/hadoop-project-dist/hadoop-hdfs/hdfs-default.xml):

```
<property> 
    <name>dfs.webhdfs.enabled</name> 
    <value>true</value> 
</property>
```

Here we'll show how to access a file stored on a hadoop single node cluster using webhdfs via the Python requests library. 

Hdfs requests library from a Python algorithm. While there are other webhdfs libraries available, most aren't maintained or they require Java to be running in the same container. 

Here is an example using the Python library "requests" to submit a HTTP GET request using webhdfs:

```
import Algorithmia
import requests

payload = {"op": "OPEN", "user.name": "<HADOOP_USER_NAME>", "namenoderpcaddress": "<HOST>:<NAME_NODE_PORT>"}
r = requests.get("<HOST>:<PORT>/webhdfs/v1/user/<PATH>", params=payload, allow_redirects=True)

def apply(input):
    return r.text

```

We do not recommend storing your database credentials directly inside your algo, since this would require re-publishing it anytime they change, and would make them visible to anyone with access to your source code.

Instead, create a folder within your [Data Portal]({{site.baseurl}}/data/) and set its read access to "Private to your algorithms" (this allows your algorithm to utilize the data regardless of who calls it, but does not give them direct access to your hadoop cluster).

Inside this folder, create a `.json` file containing your connection credentials:
```
{
  "host":"hostname.example.com",
  "username":"algorithmiauser",
  "namenodeaddress":"192.0.2.0:9000"
  "port": "9864"
} 
```

And then you can simply use the data api to load the credentials file into your algorithm:
```
creds = client.file('data://.my/SomePrivateFolder/hdfs_credentials.json').getJson()
```

Which will return your credentials so you can inject them into your payload.

So it would look like (note that this is not a runnable example):

```
import Algorithmia
import requests

# "http:hostname.example.com:9864/webhdfs/v1/user/hduser/gutenberg/ldnotebooks.txt"
query_string = f"http:{creds["host"]}:{creds["port"]}/webhdfs/v1/user/hduser/gutenberg/ldnotebooks.txt"

payload = {"op": "OPEN", "user.name": creds["username"], "namenoderpcaddress": creds["namenodeaddress"]}
r = requests.get(query_string, params=payload, allow_redirects=True)

# API calls will begin at the apply() method, with the request body passed as 'input'
# For more details, see algorithmia.com/developers/algorithm-development/languages
def apply(input):
    return r.text

```

Which would return the contents of the text file:

"The Project Gutenberg EBook of The Notebooks of Leonardo Da Vinci..."

Your configurations might be different - noting the host, port, user.name, and namenoderpcaddress (namenode address). You can typically find these by reading the docs of your hadoop cloud provider. Most use default ports such as: `9864` for dfs.datanode.http.address and `9870` for dfs.namenode.http-address.

Please let us know if you have any questions connecting to your hadoop cluster's hdfs data! We are here to help.

If you have any questions about Algorithmia please <a href="mailto:support@algorithmia.com">get in touch</a>!



