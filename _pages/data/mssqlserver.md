---
layout: article
title:  "MS SQL Server"
excerpt: "Run queries against MS SQL Server databases"
categories: working-with-data
nav_index: 4
tags: [app-data-connectors]
show_related: true
author: jon_peck
image:
    teaser: /language_logos/mssql.png 
---

If your algorithm needs to read or write data from a MsSqlServer database, you can do so by either making the database connection directly from within your own code, or by using our helper algorithms.

### Option 1: Connect directly from within your own algorithm code

There are a variety of MsSqlServer packages publicly available. For Python, we recommend [Pymssql](https://pymssql.org). For other languages, see the [libraries](https://docs.microsoft.com/en-us/azure/sql-database/sql-database-libraries).

We do not recommend storing your database credentials directly inside your algo, since this would require re-publishing it anytime they change, and would make them visible to anyone with access to your source code.

Instead, create a folder within your [Data Portal]({{ site.baseurl }}/data/) and set its read access to "Private to your algorithms" (this allows your algorithm to utilize the database regardless of who calls it, but does not give them direct access to your DB).

Inside this folder, create a `.json` file containing your connection credentials:
```
{
  "server":"fakeserver.net",
  "user":"someuser",
  "password":"somepass"
} 
```

Then, inside your own algorithm, add a MsSqlServer library to your dependencies file (in this example, `pymssql`), then load the credentials from the JSON file and use them to make your DB connection:

```
import Algorithmia
import pymssql

client = Algorithmia.client()

def apply(input):
    query = "USE employees; SELECT name, address FROM employees"
    # load the credentials file and make sure it has the required fields
    try:
        # replace the data:// path below with your credentials file
        creds = client.file('data://.my/SomePrivateFolder/MsSqlCredentials.json').getJson()
        assert {'server','user','password'}.issubset(creds)
    except:
        raise Exception('Unable to load database credentials')
    # connect to the database and run a query
    conn = pymssql.connect(**creds)
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

First, configure your MsSqlServer Database connection via <a href="{{ site.url }}/algorithms/util/MsSqlServerConfig/">MsSqlServerConfig</a> ( <a href="{{ site.url }}/algorithms/util/MsSqlServerConfig/docs">docs</a>). Note that this creates credentials which are available only to you, so if another user wants to utilize this connection, they'll need to run <a href="{{ site.url }}/algorithms/util/MsSqlServerConfig/">MsSqlServerConfig</a> as well.

Then, access the data in your DB via the <a href="{{ site.url }}/algorithms/util/MsSqlServer/">MsSqlServer</a> (<a href="{{ site.url }}/algorithms/util/MsSqlServer/docs">docs</a>).

Here's an example of using a preconfigured connection inside one of your own algorithms:

```
import Algorithmia

client = Algorithmia.client()

def apply(input):
    query = "USE employees; SELECT name, address FROM employees"
    results = client.algo('util/MsSqlServer').pipe(query).result
    # now use results (a list of lists) in any way you like
```
