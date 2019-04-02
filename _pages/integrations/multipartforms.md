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

Algorithmia only accepts JSON as input, but sometimes you want to submit a form instead. For Algorithms which manipulate files (for example, [Image Colorization](https://algorithmia.com/algorithms/deeplearning/ColorfulImageColorization)), you'll want a form which allows for a file upload. This is known as a multipart form.

Your HTML might look something like this:

```html
<form action="http://some.website/some/page" method="post" enctype="multipart/form-data">
  <p>Your API Key: <input type="text" name="api_key" value="">
  <p>Your file: <input type="file" name="file">
  <p><button type="submit">Submit</button>
</form>
```

In order to send a multipart form to an Algorithm, you'll create a form handler on some server or service, and use it to pass the request through to an Algorithm. The code below uses Python on a Flask server, but this could as easily be NodeJS on a serverless function provider such as Google Cloud Functions, Azure Function Apps, or AWS Lambda.

Note that we included the API Key as a user-fillable value in the form. Another option would be to omit this field and hard-code the API Key into the Python code below.

We then get the uploaded file from request.files, and put it into our [Hosted Data]({{site.baseurl}}/data/) using the Algorithmia client (creating a collection called "temp" if needed). The function uuid4() lets us create a unique name so we don't overwrite any other files. 

Next, we call the Algorithm we want to run -- in this case, ColorfulImageColorization. It returns the URI of a file, so we get that via the Algorithmia client, and send it back to the caller as a response.

Lastly, we delete the temporary file we created, since we won't need to use it again.

```python
from flask import Flask, request, send_file
import Algorithmia
from uuid import uuid4

app = Flask(__name__)

@app.route('/', methods=['POST'])
def handle():
  # get form fields and check that 'api_key' and 'file' are present
  form = request.form.to_dict()
  if not 'api_key' in form:
    return 'An api_key is required'
  if 'file' not in request.files:
    return 'No files'
  # create Algorithmia client
  client = Algorithmia.client(form['api_key'])
  # create temp dir (see https://docs.algorithmia.com/#creating-a-directory)
  tempdir = client.dir('data://.my/temp/')
  if not tempdir.exists():
    dir.create()
  # upload the file (see https://docs.algorithmia.com/#upload-a-file)
  temp_datafile = 'data://.my/temp/%s'%uuid4()
  client.file(temp_datafile).put(request.files['file'].read())
  # call Algorithm on the file (see Algorithm's docs for exact input spec)
  input = {"image": temp_datafile}
  algo = client.algo('deeplearning/ColorfulImageColorization/1.1.13')
  algo.set_options(timeout=300) # can adjust up to 3000s
  try:
    response = algo.pipe(input)
    # download the resultant file and return it to the caller
    # (see Algorithm's docs for output spec)
    response_datafile = response.result['output']
    response_localfile = client.file(response_datafile).getFile()
    return send_file(response_localfile, attachment_filename='result.png')
  except Exception as x:
    # show if the call to the Algorithm throws an error
    return '%s'%x
  finally:
    # clean up temporary files
    client.file(temp_datafile).delete()
```

You can test this code locally by saving it as a local file, then running a local flask server:

```bash
pip install flask
export FLASK_APP=your_file_name.py
export FLASK_DEBUG=1
python -m flask run
```
