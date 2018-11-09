---
layout: article
title:  "DynamoDB"
excerpt: "How to call the DynamoDB algorithm to scan all items in a table in your DynamoDB"
categories: working-with-data
nav_index: 4
tags: [app-data-connectors]
show_related: true
author: steph_kim
image:
    teaser: /language_logos/dynamo_db_image.png 
---

Call the <a href="{{ site.url }}/algorithms/util/DynamoDB/">DynamoDB</a> algorithm to access data in your DynamoDB database.

This algorithm is a wrapper that allows you to scan a table in your DynamoDB database. All you have to do is create a file called "credentials.json" within a data collection called "DynamoDBCredentials" and then pass in your table name as a string. The algorithm will do a table scan of all the items in your table and return them as a JSON formatted array.

