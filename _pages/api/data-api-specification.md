---
layout: api_docs_article
title:  "Data API Specification"
---

The Algorithmia Data API provides a way of getting data into and out of algorithms
with support for Algorithmia Hosted Data as well as working directly with data
in your Dropbox account or Amazon S3 buckets. For an introduction to working with data from these different data sources,
see our [data portal guides]({{site.baseurl}}/data).

## Data URI

A Data URI uniquely identifies files and directories. A Data URI is composed of a protocol and a path (e.g. `data://.my/photos`).
Each connected data source has has a unique protocol. Supported protocols include:

<div class="syn-table-container" markdown="1">

Protocol         | Description
---------------- | -----------
`data://`        | Algorithmia hosted data
`dropbox://`     | Dropbox default connected account
`s3://`          | Amazon S3 default connected account

</div>

Additionally, if you connect multiple accounts from the same source,
they can be uniquely identified by their label, e.g. `dropbox+mylabel://`.

The path part of a Data URI is understood in the context of each source:

<div class="syn-table-container" markdown="1">

URI               | Description
----------------- | -----------
`data://.my/foo`  | The `foo` collection of your Algorithmia hosted data
`dropbox://foo`   | The `foo` file or directory in the root of your default Dropbox connected account
`s3://foo`        | The `foo` bucket of your S3 account

</div>

<div>
  <div class="syn-alert theme-primary syn-body-1">
    It is very common to use <code>data://.my</code> to refer to the hosted data collections belonging to the authenticated user.
  </div>
</div>

The remainder of this documentation provides the specification for working with directories and files
regardless of what data source they come from.

## Directories

Directories are a collection of files or other directories.

### Listing a directory

List the contents of a directory with this HTTP endpoint:

`GET https://api.algorithmia.com/api/v1/connector/:connector/*path`

<div class="syn-body-1" markdown="1">

- `:connector` is the data source: `data`, `dropbox`, `s3`, or a labeled variant (e.g. `dropbox+mylabel`).
- `*path` is relative to the root of a given data source.

</div>

<div>
  <div class="syn-alert theme-primary syn-body-1">
    Each client SDK provides a way to iterate through contents of a directory using its <a href="#data-uri">Data URI</a>. These iterators manage the marker-based pagination and fetch additional contents for large directories as needed. See the language-specific examples to the right.
  </div>
</div>

<div>
  <div class="syn-alert theme-warning syn-body-1">
    This endpoint overlaps with the endpoint for fetching a file. If you aren't sure if a path refers to a file or directory, you should first check if it exists. The `exists` methods make a `HEAD` request that check the `X-Data-Type` response header.
  </div>
</div>

##### Query Parameters

<div class="syn-table-container" markdown="1">

Parameters | Description
---------------- | -----------
marker | Indicates the page of results to return. Only valid when using markers previously returned by this API. If this parameter is omited then the first page is returned
acl | Include the directory ACL in the response. (Default = false)

</div>

##### HTTP Response

The response JSON contains the following attributes:

<div class="syn-table-container" markdown="1">

Attribute | Description
--------- | -----------
folders | [Optional] array of subdirectories
files | [Optional] array of files in directory. `last_modified` is an ISO-8601 timestamp and `size` is measured in bytes
marker | [Optional] string that indicates there are more files or folders within this directory that can be queried for using the marker query parameter
acl.read | [Optional] array of ACL strings defining who has read permissions to this directory. Explanation of ACL strings provided below.

</div>

The API is limited to returning 1000 folders or files at a time, so listing
all contents of a directory may require multiple paginated requests.

**ACL Strings:**

<div class="syn-body-1" markdown="1">

  * `user://*`: Readable by anyone (public)
  * `algo://.my/*`: Readable by your algorithms (default)
  * Fully private is represented as an empty list
  * No other ACL strings are currently supported

</div>

**Response Headers:**

`X-Data-Type: directory`


### Creating a directory

To create a directory through the Algorithmia Data API, use the following endpoint:

`POST https://api.algorithmia.com/v1/connector/:connector/*path`

<div class="syn-body-1" markdown="1">

- `:connector` is the data source: `data`, `dropbox`, `s3`, or a labeled variant (e.g. `dropbox+mylabel`).
- `*path` refers to the path of the existing parent directory of the directory that should be created.

</div>

<div>
  <div class="syn-alert theme-primary syn-body-1">
    Each client SDK provides a method for creading a directory using its <a href="#data-uri">Data URI</a>. See the language-specific examples to the right.
  </div>
</div>

<div>
  <div class="syn-alert theme-warning syn-body-1">
    Algorithmia hosted directories are currently only supported as top-level directories under your user (e.g. <code>data://.my</code>). Additionally, directories cannot be created in the S3 root namespace (e.g. <code>s3://</code>) as creating S3 buckets is not supported. If you configured path restrictions when connecting an external data source, then additional limitations may exist.
  </div>
</div>

##### Input
Input is JSON and requires the header: `Content-Type: application/json`

<div class="syn-table-container" markdown="1">

Attribute | Description
--------- | -----------
name      | Name of the directory to create
acl       | [Optional] JSON object specifying permissions of the directory

</div>

**ACL Attribute:**

Permission for a directory are determined by setting `acl.read` to an array of ACL strings:

<div class="syn-body-1" markdown="1">

  * `user://*`: Readable by anyone (public)
  * `algo://.my/*`: Readable by your algorithms (default)
  * Fully private is represented as an empty list
  * No other ACL strings are currently supported

</div>

Example: `"acl": {"read": []}` implies the directory is fully private

<div>
  <div class="syn-alert theme-primary syn-body-1">
    Write ACLs are not currently configurable. Only the directory owner has write access to a directory.
  </div>
</div>

##### Response:

Empty 200 response on success

### Updating a directory

To update a directory, use the following API:

`PATCH https://api.algorithmia.com/v1/connector/*path`

<div class="syn-body-1" markdown="1">

- `:connector` is the data source: `data`, `dropbox`, `s3`, or a labeled variant (e.g. `dropbox+mylabel`).
- `*path` is relative to the root of a given data source.

</div>

##### Input:
Input is JSON and requires the header: `Content-Type: application/json`

<div class="syn-table-container" markdown="1">

Attribute | Description
--------- | -----------
acl       | [Optional] JSON object specifying permissions of the directory

</div>

**ACL Attribute:**

Permission for a directory are determined by setting `acl.read` to an array of ACL strings:

<div class="syn-body-1" markdown="1">

  * `user://*`: Readable by anyone (public)
  * `algo://.my/*`: Readable by your algorithms (default)
  * Fully private is represented as an empty list
  * No other ACL strings are currently supported

</div>

Example: `"acl": {"read": []}` implies the directory is fully private

##### Output:

Empty 200 response on success

### Deleting a directory

To delete a directory, use the following endpoint:

`DELETE https://api.algorithmia.com/v1/connector/:connector/*path`

<div class="syn-body-1" markdown="1">

- `:connector` is the data source: `data`, `dropbox`, `s3`, or a labeled variant (e.g. `dropbox+mylabel`).
- `*path` is relative to the root of a given data source.

</div>

<div>
  <div class="syn-alert theme-primary syn-body-1">
    Each client SDK provides a method for deleting a directory using its <a href="#data-uri">Data URI</a>. The method for deleting a directory may take a boolean argument that specifies if the directory should be forcibly deleting even if the directory has contents. See the language-specific examples to the right.
  </div>
</div>

##### Query Parameters

<div class="syn-table-container" markdown="1">

Parameters | Description
---------------- | -----------
force            | if true, enables recursive delete of a non-empty directory

</div>

##### Response

<div class="syn-table-container" markdown="1">

Attribute | Description
--------- | -----------
result.deleted  | The number of files successfully deleted
error.deleted   | The number of files successfully deleted if an error encountered during deletion

</div>

## Files

Files can be any type of data and are uniquely identified by a <a href="#data-uri">Data URI</a>

### Getting a file

To retrieve a file through the Algorithmia Data API, use the following endpoint:

`GET https://api.algorithmia.com/v1/connector/:connector/*path`

<div class="syn-body-1" markdown="1">

- `:connector` is the data source: `data`, `dropbox`, `s3`, or a labeled variant (e.g. `dropbox+mylabel`).
- `*path` is relative to the root of a given data source.

</div>

<div>
  <div class="syn-alert theme-primary syn-body-1">
    Each client SDK provides one or more methods for downloading a file using its <a href="#data-uri">Data URI</a>. In general, these clients make it easy retrieve into common data structure ranging from strings, to byte streams, to temporary files. See the language-specific examples to the right.
  </div>
</div>

<div>
  <div class="syn-alert theme-warning syn-body-1">
    This endpoint overlaps with the endpoint for listing a directory. If you aren't sure if a path refers to a file or directory, you should first check if it exists. The `exists` methods make a `HEAD` request that check the `X-Data-Type` response header.
  </div>
</div>

##### Response

Upon 200 success, response body is the content of the file.

**Response Headers:**

`X-Data-Type: file`

### Check if file exists

To check if a file exists without downloading it, use the following endpoint:

`HEAD https://api.algorithmia.com/v1/connector/:connector/*path`

<div class="syn-body-1" markdown="1">

- `:connector` is the data source: `data`, `dropbox`, `s3`, or a labeled variant (e.g. `dropbox+mylabel`).
- `*path` is relative to the root of a given data source.

</div>

<div>
  <div class="syn-alert theme-primary syn-body-1">
    Each client SDK provides one or more methods for downloading a file using its <a href="#data-uri">Data URI</a>. In general, these clients make it easy retrieve into common data structure ranging from strings, to byte streams, to temporary files. See the language-specific examples to the right.
  </div>
</div>

<div>
  <div class="syn-alert theme-warning syn-body-1">
    This endpoint overlaps with the endpoint for checking if a directory exists. Verify the `X-Data-Type` response header on success. The client SDKs will verify this automatically.
  </div>
</div>

##### Response

200 success indicates the file exists

**Response Headers:**

<div class="syn-body-1" markdown="1">

* `X-Data-Type: file`
* `X-Error-Message: <Error message if error occurs>`

</div>

### Upload a file

To upload a file through the Algorithmia Data API, use the following endpoint:

`PUT https://api.algorithmia.com/v1/connector/data/:owner/*path`

<div class="syn-body-1" markdown="1">

- `:connector` is the data source: `data`, `dropbox`, `s3`, or a labeled variant (e.g. `dropbox+mylabel`).
- `*path` is relative to the root of a given data source.

</div>

<div>
  <div class="syn-alert theme-primary syn-body-1">
    Each client SDK provides one or more methods for uploading a file using its <a href="#data-uri">Data URI</a>. In general, these clients make it easy upload data from common data structures ranging from strings, to byte streams, to files. See the language-specific examples to the right.
  </div>
</div>

<div>
  <div class="syn-alert theme-warning syn-body-1">
    This endpoint will replace a file if it already exists. If you wish to avoid replacing a file, <a href="#check-if-file-exists">check if the file exists</a> before using this endpoint.
  </div>
</div>

##### Input

Body of the request is the content of the file that will be created.

##### Response

<div class="syn-table-container" markdown="1">

Attribute | Description
--------- | -----------
result    | The full Data URI of resulting file

</div>

### Deleting a file

To delete a file through the Algorithmia Data API, use the following endpoint:

`DELETE https://api.algorithmia.com/v1/connector/data/*path`

<div class="syn-body-1" markdown="1">

- `:connector` is the data source: `data`, `dropbox`, `s3`, or a labeled variant (e.g. `dropbox+mylabel`).
- `*path` is relative to the root of a given data source.

</div>

<div>
  <div class="syn-alert theme-primary syn-body-1">
    Each client SDK provides a method for deleting a file using its <a href="#data-uri">Data URI</a>. See the language-specific examples to the right.
  </div>
</div>

##### Response

<div class="syn-table-container" markdown="1">

Attribute | Description
--------- | -----------
result.deleted  | The number of files successfully deleted
error.deleted   | The number of files successfully deleted if an error encountered during deletion

</div>