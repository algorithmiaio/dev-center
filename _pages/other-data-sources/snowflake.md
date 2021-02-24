---
layout: article
title:  "Snowflake"
excerpt: "Accessing your Snowflake database within an Algorithm"
categories: other-data-sources
nav_index: 4
tags: [other-data-sources]
show_related: true
author: jon_peck
image:
    teaser: /language_logos/snowflake_computing.png 
redirect_from:
  - /data/snowflake/
---

Algorithms can easily access databases hosted on the Snowflake data platform using the [Snowflake Connector for Python](https://pypi.org/project/snowflake-connector-python/). To see this in action on Algorithmia, check out the [SnowflakeAsyncOrchestrator]({{site.url}}/algorithms/algorithmiahq/SnowflakeAsyncOrchestrator) algorithm, which provides a reference architecture for performing an asynchronous database write operation. If you'd like to get started with a less complex example, you can follow along below.

Begin by creating a [collection]({{site.url}}/data/hosted) named `SnowflakeCredentials`, and uploading a file `credentials.json` with the following structure (see their docs to find your [Account Name](https://docs.snowflake.net/manuals/user-guide/connecting.html)):

```json
{
  "user": "YOUR_SNOWFLAKE_USERNAME",
  "password": "YOUR_SNOWFLAKE_PASSWORD",
  "account": "YOUR_SNOWFLAKE_ACCOUNT"
}
```

Next, create a Python algorithm. Click "Dependencies" in the Web IDE (or edit your `requirements.txt` file) and add the dependency `snowflake-connector-python`.

Now paste the following code in as your algorithm, replacing `YOUR_ALGORITHMIA_USERNAME` to point to the correct data collection.

```python
import Algorithmia
import snowflake.connector

# Get Snowflake creds
client = Algorithmia.client()
creds = client.file("data://YOUR_ALGORITHMIA_USERNAME/SnowflakeCredentials/credentials.json").getJson()

def apply(input):
    ctx = snowflake.connector.connect(
        user=creds.get("user"),
        password=creds.get("password"),
        account=creds.get("account")
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

Build and test the algorithm. Assuming you haven't deleted the `SNOWFLAKE_SAMPLE_DATA` database from your Snowflake account, it should return the first row from the `CALL_CENTER` table. You can also try modifying the code to point at your own database.
