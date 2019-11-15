---
layout: article
title:  "Snowflake Computing Databases"
excerpt: "Accessing your Snowflake Computing Database within an Algorithm"
categories: working-with-data
nav_index: 4
tags: [app-data-connectors]
show_related: true
author: jon_peck
image:
    teaser: /language_logos/snowflake_computing.png
menus:
  data:
    url: /developers/data/snowflake
    title: "Snowflake Computing Databases"
---

Algorithms can easily access databases hosted by Snowflake Computing using the [Snowflake Connector for Python](https://pypi.org/project/snowflake-connector-python/) .

Begin by creating a [collection]({{site.url}}/data/hosted) named "SnowflakeCredentials", and uploading a file "credentials.json" with the following structure (see their docs to find your [Account Name](https://docs.snowflake.net/manuals/user-guide/connecting.html)):

```json
{
  "user": "[YOUR_SNOWFLAKE_USERNAME]",
  "password": "[YOUR_SNOWFLAKE_PASSWORD]",
  "account": "[YOUR_SNOWFLAKE_ACCOUNT]"
}
```

Next, create a Python Algorithm. Click "Dependencies" in the Web IDE (or edit your requirements.txt file) and add the dependency `snowflake-connector-python`.

Now paste the following code in as your Algorithm:

```python
import Algorithmia
import snowflake.connector

# Get Snowflake creds
client = Algorithmia.client()
creds = client.file("data://.my/SnowflakeCredentials/credentials.json").getJson()

def apply(input):
    ctx = snowflake.connector.connect(
        user=creds.get('user'),
        password=creds.get('password'),
        account=creds.get('account')
        )
    cs = ctx.cursor()
    try:
        cs.execute("USE SNOWFLAKE_SAMPLE_DATA")
        cs.execute("SELECT * FROM TPCDS_SF100TCL.CALL_CENTER")
        one_row = cs.fetchone()
        return [str(i) for i in one_row]
    finally:
        cs.close()
        ctx.close()
```

Build and test this Algorithm. Assuming you have not deleted the SNOWFLAKE_SAMPLE_DATA database, it should return the first row. Otherwise, alter it to try pulling data from your own database.
