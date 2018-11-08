---
layout: article
title:  "MySql"
excerpt: "Run queries against MySql databases"
categories: working-with-data
nav_index: 4
tags: [app-data-connectors]
show_related: true
author: jon_peck
image:
    teaser: /language_logos/mysql.png 
---

If your algorithm needs to read or write data from a MySql database, you can do so by either making the database connection directly from within your own code, or by using our helper algorithms.

### Option 1: Connect directly from within your own algorithm code

There are a variety of MySql packages publicly available. For Python, we recommend [PyMySql](https://pymysql.readthedocs.io/en/latest/). For other languages, see [w3resource](http://w3resource.com/mysql/mysql-connectors-and-apis.php).

We do not recommend storing your database credentials directly inside your algo, since this would require re-publishing it anytime they change, and would make them visible to anyone with access to your source code.

Instead, create a folder within your [Data Portal]({{ site.baseurl }}/data/) and set its read access to "Private to your algorithms" (this allows your algorithm to utilize the database regardless of who calls it, but does not give them direct access to your DB).

Inside this folder, create a `.json` file containing your connection credentials:
```
{
  "host":"fakeserver.net",
  "user":"someuser",
  "passwd":"somepass",
  "db":"somedb"
} 
```

Then, inside your own algorithm, add a MySql library to your dependencies file (in this example, `PyMySql`), then load the credentials from the JSON file and use them to make your DB connection:

```
import Algorithmia
import pymysql

client = Algorithmia.client()

def apply(input):
    query = "SELECT name, address FROM employees"
    # load the credentials file and make sure it has the required fields
    try:
        # replace the data:// path below with your credentials file
        creds = client.file('data://.my/SomePrivateFolder/MySqlCredentials.json').getJson()
        assert {'host','user','passwd','db'}.issubset(creds)
    except:
        raise Exception('Unable to load database credentials')
    # connect to the database and run a query
    conn = pymysql.connect(**creds)
    cursor = conn.cursor()
    cursor.execute(query)
    # this example aggregates and returns the results, but generally you'd use it in further calculations
    rows = cursor.fetchall()
    result = []
    for row in rows:
      result.append(row)
    return result

```

### Option 2: Use our helper algorithms to store per-user credentials automatically, and to run queries

If you don't want to add database connection code directly into your algorithm, you can use our helper algorithms instead. Keep in mind that these incur the usual 1 credit per compute-second cost to run.

First, configure your MySql Database connection via <a href="{{ site.baseurl }}/../algorithms/util/MySqlConfig/">MySqlConfig</a> ( <a href="{{ site.baseurl }}/../algorithms/util/MySqlConfig/docs">docs</a>). Note that this creates credentials which are available only to you, so if another user wants to utilize this connection, they'll need to run <a href="{{ site.baseurl }}/../algorithms/util/MySqlConfig/">MySqlConfig</a> as well.

Then, access the data in your DB via the <a href="{{ site.baseurl }}/../algorithms/util/MySql/">MySql</a> (<a href="{{ site.baseurl }}/../algorithms/util/MySql/docs">docs</a>).

Here's an example of using a preconfigured connection inside one of your own algorithms:

```
import Algorithmia

client = Algorithmia.client()

def apply(input):
    query = "SELECT name, address FROM employees"
    results = client.algo('util/MySql').pipe(query).result
    # now use results (a list of lists) in any way you like
```
