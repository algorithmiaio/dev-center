---
layout: article
title:  "PostgreSQL"
excerpt: "Run queries against PostgreSQL databases"
categories: working-with-data
nav_index: 4
tags: [app-data-connectors]
show_related: true
author: jon_peck
image:
    teaser: /language_logos/postgres.svg 
---

If your algorithm needs to read or write data from a PostgreSQL database, you can do so by either making the database connection directly from within your own code, or by using our helper algorithms.

### Option 1: Connect directly from within your own algorithm code

There are a variety of PostgreSQL packages publicly available. For Python, we recommend [Psycopg2](http://initd.org/psycopg/docs/). For other languages, see the [PostgreSQL wiki](https://wiki.postgresql.org/wiki/Client_Libraries).

We do not recommend storing your database credentials directly inside your algo, since this would require re-publishing it anytime they change, and would make them visible to anyone with access to your source code.

Instead, create a folder within your [Data Portal]({{ site.baseurl }}/data/) and set its read access to "Private to your algorithms" (this allows your algorithm to utilize the database regardless of who calls it, but does not give them direct access to your DB).

Inside this folder, create a `.json` file containing your connection credentials:
```
{
  "host":"fakeserver.net",
  "user":"someuser",
  "password":"somepass",
  "dbname":"somedb"
} 
```

Then, inside your own algorithm, add a PostgreSQL library to your dependencies file (in this example, `psycopg2`), then load the credentials from the JSON file and use them to make your DB connection:

```
import Algorithmia
import psycopg2

client = Algorithmia.client()

def apply(input):
    query = "SELECT name, address FROM employees"
    # load the credentials file and make sure it has the required fields
    try:
        # replace the data:// path below with your credentials file
        creds = client.file('data://.my/SomePrivateFolder/PostgresCredentials.json').getJson()
        assert {'host','user','password','dbname'}.issubset(creds)
    except:
        raise Exception('Unable to load database credentials')
    # connect to the database and run a query
    conn = psycopg2.connect(**creds)
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

First, configure your PostgreSQL Database connection via <a href="{{ site.baseurl }}/../algorithms/util/PostgreSQLConfig/">PostgreSQLConfig</a> ( <a href="{{ site.baseurl }}/../algorithms/util/PostgreSQLConfig/docs">docs</a>). Note that this creates credentials which are available only to you, so if another user wants to utilize this connection, they'll need to run <a href="{{ site.baseurl }}/../algorithms/util/PostgreSQLConfig/">PostgreSQLConfig</a> as well.

Then, access the data in your DB via the <a href="{{ site.baseurl }}/../algorithms/util/PostgreSQL/">PostgreSQL</a> (<a href="{{ site.baseurl }}/../algorithms/util/PostgreSQL/docs">docs</a>).

Here's an example of using a preconfigured connection inside one of your own algorithms:

```
import Algorithmia

client = Algorithmia.client()

def apply(input):
    query = "SELECT name, address FROM employees"
    results = client.algo('util/PostgreSQL').pipe(query).result
    # now use results (a list of lists) in any way you like
```
