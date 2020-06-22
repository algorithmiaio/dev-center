---
layout: article
title:  "CLI"
excerpt: "Get familiar with the CLI client."
categories: clients
tags: [clients]
show_related: true
image:
    teaser: /language_logos/cli.svg
redirect_from:
  - /application-development/client-guides/cli/
  - /application-development/guides/cli/
---

The Algorithmia CLI is a cross-platform tool for interfacing with algorithms and the Algorithmia Data API.

This guide will cover:

* [Installation](#installing-the-algorithmia-cli)
* [Authentication](#configure-authentication)
* [Usage](#usage)
* [Command Options](#options)
* [The Data API](#the-algorithmia-data-api)
* [Using Multiple Profiles](#using-multiple-profiles)

Check out the tool in use in this short demo video (click to watch on YouTube):
[![Example CLI Usage](https://j.gifs.com/v1egak.gif)](https://www.youtube.com/watch?v=mAJagjRl_qk)

## Installing the Algorithmia CLI

The latest releases & changelog can be found [here](https://github.com/algorithmiaio/algorithmia-cli/releases/latest).

**Linux and OSX**

Install is by running:

{% highlight bash %}
curl -sSLf https://algorithmia.com/install.sh | sh
{% endhighlight %}

On some linux variants, you may need to preinstall curl, file, and git via a command such as:

{% highlight bash %}
apt install curl file git
{% endhighlight %}

**Windows**

Download and extract the [latest Windows x86_64 zip file](https://github.com/algorithmiaio/algorithmia-cli/releases/download/v1.0.1/algorithmia-v1.0.1-x86_64-pc-windows-msvc.zip). We recommend putting it within your `PATH`.

If needed, you can also find both MSVC and GNU builds for x86 and x86_64 on the [release page](https://github.com/algorithmiaio/algorithmia-cli/releases/latest).


**Installation note: Python environment variable**

If you'll be running Python algos, also set the version via `export LANGUAGE_VERSION=python2` or `export LANGUAGE_VERSION=python3`

## Configure Authentication

In order to make calls with the CLI, you'll need to configure the authentication with an API key. If you don't already have an API key, get started by signing up for an account at [Algorithmia.com](/). Once you've completed the sign up process, copy the API key from your account dashboard.

Begin the configuration process by running the command `algo auth`.
You will see an interactive prompt to guide you through setting up a default profile:

{% highlight text %}
$ algo auth
Configuring authentication for 'default' profile
Enter API Endpoint [https://api.algorithmia.com]: (press Enter)
Enter API Key (prefixed with 'sim'):
Profile is ready to use. Test with 'algo ls'
{% endhighlight %}

See [Using multiple profiles](#using-multiple-profiles) for instructions on how to set authenticate and use more than one profile with the Algorithmia CLI tool.

{% if site.enterprise %}
#### Enterprise Users Only: Specifying an On-Premises or Private Cloud Endpoint
If you are running [Algorithmia Enterprise](/enterprise), replace the default API Endpoint (`https://api.algorithmia.com`) with your own API endpoint URL. Note that it must contain the `api` prefix, so if your domain is ` https://algorithmia.companyname.com ` then your API Endpoint should be `https://api.algorithmia.companyname.com`
{% endif %}

## Usage

To call an algorithm from the CLI, use the command syntax: `algo run`, followed by the algorithm’s username and algorithm name, the data options, and finally the input. Here is a basic example calling the [Factor algorithm](https://algorithmia.com/algorithms/kenny/Factor):

{% highlight text %}
$ algo run kenny/factor -d 19635
[3,5,7,11,17]
{% endhighlight %}

Add the option `--response-body` to see the full JSON response:

{% highlight text %}
$ algo run kenny/factor -d 19635 --response-body
{ "result": [3,5,7,11,17],
  "metadata": { "content_type":"json", "duration":0.001427314} }
{% endhighlight %}

Run `algo run --help` to see more command options or view the following [Options](#options) section.

### Options

#### Input Data Options
There are several options for specifying the type and source of input data. The Algorithmia CLI supports JSON, text, and binary data, as well as an option to auto-detect the data type.

| Option Flag               | Description |
| :------------             | :--------------- |
| -d, \--data <data>         | If the data parses as JSON, assume JSON, else if the data is valid UTF-8, assume text, else assume binary |
| -D, \--data-file <file>    | Same as --data, but the input data is read from a file |

You may also explictly specify the input type as text (`-t`/`-T`), json (`-j`/`-J`), or binary (`-b`/`-B`) instead of using the auto-detection (`-d`/`-D`).

#### Output Options

The algorithm result is printed to STDOUT by default. Additional notices may be printed to STDERR. If you'd like to output the result to a file, use the output option flag followed by a filename:

{% highlight text %}
$ algo run kenny/factor -d 17 --output results.txt
{% endhighlight %}

| Option Flag     | Description |
| :------------   |:--------------- |
| \--debug         | Print algorithm's STDOUT (author-only) |
| \--response-body | Print HTTP response body (replaces result) |
| \--response      | Print full HTTP response including headers (replaces result) |
| -s, \--silence   | Suppress any output not explicitly requested (except result) |
| -o, \--output <file> |  Print result to a file |

#### Other Options

| Option Flag     | Description |
| :------------   |:--------------- |
| \--timeout <seconds> | Sets algorithm timeout

#### Examples:

{% highlight text %}
$ algo kenny/factor/0.1.0 -t '79'                   Run algorithm with specified version & data input as text
$ algo anowell/Dijkstra -J routes.json              Run algorithm with file input
$ algo anowell/Dijkstra -J - < routes.json          Same as above but using STDIN
$ algo opencv/SmartThumbnail -B in.png -o out.png   Runs algorithm with binary data input
$ algo run kenny/factor -d 17 --timeout 2           Runs algorithm with a timeout of 2 seconds
{% endhighlight %}

## The Algorithmia Data API

Use the Algorithmia CLI to interact with the Algorithmia Data API. You can use the CLI to create and manage your data directories.

**Data commands include:**

| Command   | Description |
| :------------   |:--------------- |
| ls |  List contents of a data directory |
| mkdir | Create a data directory |
| rmdir | Delete a data directory |
| rm | Remove a file from a data directory |
| cp | Copy file(s) to or from a data directory |
| cat | Concatenate & print file(s) in a directory |

### Examples of the Algorithmia Data API usage:

Create a data directory:
{% highlight text %}
$ algo mkdir .my/cuteAnimals
Created directory data://.my/cuteAnimals
{% endhighlight %}

Copy a file from your local directory to the new data directory:

{% highlight text %}
$ algo cp chubby_kittens.jpg data://.my/cuteAnimals
Uploaded data://.my/cuteAnimals/chubby_kittens.jpg
{% endhighlight %}

## Using multiple profiles

### Add additional profiles

With the Algorithmia CLI, you can configure multiple custom profiles to use. To add a new profile, you will run through the same interactive prompt--simply add a profile name to the command to add a new profile.

{% highlight text %}
$ algo auth --profile second_user
Configuring authentication for 'second_user' profile
Enter API Endpoint [https://api.algorithmia.com]: (press Enter)
Enter API Key (prefixed with 'sim'):
Profile is ready to use. Test with 'algo ls --profile second_user'
{% endhighlight %}

Now you may use `algo ls --profile second_user` to list files in your `second_user` account. For more information, see the auth command help with `algo auth --help`.

### Using profiles in commands

When running commands, the Algorithmia CLI will use the default profile unless otherwise specified with the `--profile <profile>` option. See the following example:

{% highlight text %}
$ algo run kenny/factor -d 17 --profile second_user
[17]
{% endhighlight %}
