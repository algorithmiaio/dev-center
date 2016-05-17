---
layout: article
title:  "JavaScript Algorithm"
excerpt: "Build your algorithm in JavaScript"
date:   2016-05-16 14:28:42
permalink: /algorithm-development/guides/javascript-guide
tags: [algo-guide-lang]
show_related: true
author: liz_rush
---

## Javascript Algorithm Development

#### Available APIs

Algorithmia makes a number of libraries available to make algorithm development easier.
The full <a href="https://nodejs.org/api/">Javascript Node language and standard library</a>
is available for you to use in your algorithms. Furthermore, algorithms can call other algorithms and manage data on the Algorithmia platform
via the <a href="http://developers.algorithmia.com/clients/javascript/">Algorithmia Javascript Client</a>.

#### Managing Dependencies

Algorithmia supports adding 3rd party dependencies via the <a href="https://www.npmjs.com/">NPM Javascript package manager</a> using a package.json file. On the algorithm editor page, click Options and select Manage Dependencies.

Add dependencies by including the package name and version to the `package.json` file.


`"dependencies": {
	"algorithmia": "0.3.x",
 	"lodash": "4.11.2"
 }`
 

Note that you will still need to import your package to your algorithm file. For example to include your package 'lodash' add:

`lodash = require("lodash")();`

> #### I/O for Your Algorithms:

> Datatypes that are either sequences that you don't wish to iterate over such as strings or inputs that are scalar in nature such as a numeric data type can be accessed via input, however you will probably want to check for the data type you are expecing to receive.

```
exports.apply = function(input, cb) {
	if (typeof input == String){
    	cb(null, input);
    }
};
```

> A string input:

```
"~3.14159"
```


> Inputs that are sequences such as: arrays, objects and buffer (binary buffer sequence such as an image file) can be handled as you would any Python sequence, however you will probably want to check for the data type you are expecing to receive. For example:

```
exports.apply = function(input, cb) {
	if (typeof input == Array){
	    cb(null, "A few of the most starred node.js packages: " + input[0] + ", " + input[1] + ", " + input[2]);
	}    
};
```

> Here is an example of an array input:

```
["express", "gulp", "async"]
```

> Which will return:

```
"A few of the most starred node.js packages: express, gulp, async"
```

#### I/O for Your Algorithms

When you are creating an algorithm that takes input from other algorithms it's important to understand what data types to expect and what data types you may return as output that the user of your algorithm will ingest.

Note that you can also return any of these data structures in your algorithm.

#### Error Handling

Algorithms can throw any exception, and they will be returned as an error via the Algorithmia API. If you want to throw a generic exception message, use an `AlgorithmException`.

> #### Error Handling:

```
var error = "Invalid graph structure"
// Where cb is a callback function passed into your apply method
cb(error, input)
```

#### Calling Other Algorithms and Managing Data

To call other algorithms or manage data from your algorithm, use the [Algorithmia Javascript Client](#javascript-client) which is automatically available to any algorithm you create on the Algorithmia platform.

When designing your algorithm, don't forget that there are special data directories, `.session` and `.algo`, that are available only to algorithms to help you manage data over the course of the algorithm execution.

#### Additional Resources

* <a href="http://developers.algorithmia.com/clients/javascript/">Algorithmia Client Javascript Docs <i class="fa fa-external-link"></i></a>
* <a href="https://nodejs.org/api/">Node.js 6.0 Docs</a>

