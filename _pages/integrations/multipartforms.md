---
layout: article
title: "Multipart Forms"
excerpt-short: "Use a web form to send a file to an Algorithm"
categories: [integrations]
tags: [integrations]
show_related: true
image:
    teaser: /language_logos/files.svg
---

Algorithmia only accepts JSON as input, but sometimes you want to submit a Form instead. For Algorithms which manipulate files (for example, [Image Colorization](https://algorithmia.com/algorithms/deeplearning/ColorfulImageColorization)), you'll want a form which allows for a file upload. This is known as a multipart form.

In order to send a multipart form to an Algorithm, you'll create a form handler on some server or service you own, and use it to pass the request through to an Algorithm. The code below uses Python on a Flask server, but this could as easily be a serverless function provider such as Google Cloud Functions, Azure Function Apps, or AWS Lambda.

Your HTML will look something like this:

```html
<form action="http://some.website/some/page" method="post" enctype="multipart/form-data">
  <p><input type="text" name="api_key" value="">
  <p><input type="file" name="file">
  <p><button type="submit">Submit</button>
</form>
```

Note that we're including the API Key as a user-fillable value here. Another option would be to omit thus field and hard-code the API Key into the Python code below.

```python
from flask import Flask, request, send_file
import Algorithmia
from uuid import uuid4

app = Flask(__name__)

@app.route('/', methods=['POST'])
def handle():
	# get form fields and check that 'api_key_ and 'file' are present
	form = request.form.to_dict()
	if not 'api_key' in form:
		return 'An api_key is required'
	if 'file' not in request.files:
		return 'No files'
	# create Algorithmia client and upload file (see https://docs.algorithmia.com/#upload-a-file)
	client = Algorithmia.client(form['api_key'])
	temp_datafile = 'data://.my/temp/%s'%uuid4()
	client.file(temp_datafile).put(request.files['file'].read())
	# call Algorithm on the file (see Algorithm's docs for exact input spec)
	input = {"image": temp_datafile}
	algo = client.algo('deeplearning/ColorfulImageColorization/1.1.13')
	algo.set_options(timeout=300) # can adjust up to 3000s
	try:
		response = algo.pipe(input)
		# download the resultant file and return it to the caller (see Algorithm's docs for output spec)
		response_datafile = response.result['output']
		response_localfile = client.file(response_datafile).getFile()
		return send_file(response_localfile, attachment_filename='result.png')
	except Exception as x:
		# show if the call to the Algorithm, or the Algorithm itself throws an error
		return '%s'%x
	finally:
		# clean up temporary files
		client.file(temp_datafile).delete()
```
