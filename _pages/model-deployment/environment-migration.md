---
categories: algorithm-development
layout: article
title: Migrate a Legacy-Language Algorithm to an Environment-Based Algorithm
---

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Overview](#overview)
- [Getting an algorithm's details](#getting-an-algorithms-details)
- [Migrating an algorithm](#migrating-an-algorithm)
  - [Python](#python)
  - [Java](#java)
  - [Scala](#scala)
  - [R](#r)
  - [JavaScript, Ruby, and Rust](#javascript-ruby-and-rust)

## Overview

Beginning in Algorithmia version 21.2, support for legacy language-based algorithms is deprecated. This page contains information for migrating a legacy-language based algorithm to the corresponding environment-based language. To learn more about algorithm environments, and to view the environments that we currently have available, see the [Environments](/developers/model-deployment/environments) page. To get a list of the available languages and their associated algorithm environments currently installed on your cluster, see [Listing languages and environments on your cluster](/developers/model-deployment/environments#list-languages-and-environments-and-download-algorithm-template-files).

## Getting an algorithm's details

To begin, retrieve your algorithm's details to determine whether it's based on a legacy language and therefore needs to be migrated.

When you get the algorithm details (see code [below](#rest-request-algorithm-details)) for a legacy-language based algorithm, the REST response will contain a `language` property listing the name of the language. You can also find the language through the browser UI under the algorithm profile's **Settings** tab, in the **Language** field. The following table lists the strings that you'll see for legacy algorithms. (Note that we no longer support [Javascript, Ruby, or Rust](#javascript-ruby-and-rust) algorithms.)

|Language|`language` field in REST response|Language field in browser UI|
|--- |--- |--- |
|Python 2|`python2-langpack`|Python 2.x (Legacy)|
|Python 3|`python3-1`|Python 3.x (Legacy)|
|Java|`java`|Java (Legacy)|
|Scala|`scala`|Scala (Legacy)|
|R|`r`|R (Legacy)|


**REST request**

```bash
$ curl https://CLUSTER_DOMAIN/v1/algorithms/ALGO_OWNER/ALGO_NAME \
    -H 'Authorization: Simple STD_API_KEY'
```

As noted above, if the algorithm is **legacy-language based**, the response will contain a `language` property listing the name of the language. It'll also contain an `environment` property listing the type of hardware (CPU or GPU) that the algorithm uses.

**REST response**

```json
{
  "id": "3cfdb152-d1f2-4b08-82b4-681c0b055a4f",
  "name": "ALGO_NAME",
  "details": {
    "label": "ALGO_NAME",
    "tagline": ""
  },
  "settings": {
    "algorithm_callability": "private",
    "source_visibility": "closed",
    "language": "python2-langpack",
    "environment": "cpu",
    "license": "apl",
    "network_access": "full",
    "pipeline_enabled": true,
    "insights_enabled": false
  },
  "source": {
    "scm": {
      "id": "internal",
      "provider": "internal",
      "default": true,
      "enabled": true
    }
  },
  "resource_type": "algorithm"
}
```

If the algorithm is **environment based**, the response will contain an `algorithm_environment` property, which is a UUID, as well as a `package_set` property, which specifies the bundle of packages included in the environment.

**REST response**

```json
{
  "id": "9aa57ed8-c8db-4bce-9cca-0242af442dfe",
  "name": "ALGO_NAME",
  "details": {
    "label": "ALGO_NAME",
    "tagline": ""
  },
  "settings": {
    "algorithm_callability": "private",
    "source_visibility": "closed",
    "package_set": "python27",
    "algorithm_environment": "717d36e0-222c-44a0-9aa8-06f4ebc1b82a",
    "license": "apl",
    "network_access": "full",
    "pipeline_enabled": true,
    "insights_enabled": false
  },
  "source": {
    "scm": {
      "id": "internal",
      "provider": "internal",
      "default": true,
      "enabled": true
    }
  },
  "resource_type": "algorithm"
}
```

Migrating an algorithm
----------------------

To begin, verify that you have a legacy-language based algorithm that needs to be migrated in the first place. To do this, [get the algorithm's details](#getting-an-algorithms-details). If you determine that your algorithm is environment based, no migration is necessary. Otherwise, proceed with the instructions below for the language in question.

  - [Python](#python)
  - [Java](#java)
  - [Scala](#scala)
  - [R](#r)
  - [JavaScript, Ruby, and Rust](#javascript-ruby-and-rust)

### Python

To migrate a legacy Python algorithm, [get the environment ID value](/developers/model-deployment/environments#listing-algorithm-environments-rest) for a valid Python 2 or Python 3 algorithm environment. Note that in the sample code at the link provided, you'll use the string `python2` or `python3`, as appropriate, to replace `ALGO_LANG` to list the available environments. The environment ID will be a UUID like `2be2e978-9deb-494d-a2d1-e07e121d5ba0`. Execute the following `PUT` request to update the algorithm's settings, using this UUID to replace `ENV_ID`.

**REST request**

```bash
$ curl https://CLUSTER_DOMAIN/v1/algorithms/ALGO_OWNER/ALGO_NAME \
    -X PUT
    -H 'Content-Type: application/json' \
    -H 'Authorization: Simple STD_API_KEY' \
    -d  '{
      "settings":
        {
          "source_visibility": "closed",
          "network_access": "full",
          "pipeline_enabled": true,
          "algorithm_environment": "ENV_ID",
          "license":"apl"
        }
      }'
```

### Java

To migrate a legacy Java algorithm, [get the environment ID value](/developers/model-deployment/environments#listing-algorithm-environments-rest) for the Java 11 algorithm environment (there's currently only one). Note that in the sample code at the link provided, you'll use the string `java11` to replace `ALGO_LANG`. The environment ID will be a UUID like `2be2e978-9deb-494d-a2d1-e07e121d5ba0`. Execute the following `PUT` request to update the algorithm's settings, using this UUID to replace `ENV_ID`.

**REST request**

```bash
$ curl https://CLUSTER_DOMAIN/v1/algorithms/ALGO_OWNER/ALGO_NAME \
    -X PUT
    -H 'Content-Type: application/json' \
    -H 'Authorization: Simple STD_API_KEY' \
    -d  '{
      "settings":
        {
          "source_visibility": "closed",
          "network_access": "full",
          "pipeline_enabled": true,
          "algorithm_environment": "ENV_ID",
          "license":"apl"
        }
      }'
```

Now clone your algorithm locally and move your algorithm's main file `ALGONAME.java` to a new package and rename it to `Algorithm.java`, as demonstrated in the following code.

```bash
$ git clone https://git.CLUSTER_DOMAIN/git/ALGO_OWNER/ALGO_NAME.git
$ cd ALGO_NAME
$ mkdir -p src/main/java/com/algorithmia/ALGO_NAME
$ mv src/main/java/algorithmia/ALGO_NAME/ALGO_NAME.java \
    src/main/java/com/algorithmia/ALGO_NAME/Algorithm.java
```

Similarly, if you have test files, move them to a new package as well.

```bash
$ mkdir -p src/test/java/com/algorithmia/ALGO_NAME
$ mv src/test/java/algorithmia/ALGO_NAME/ALGO_NAME_test.java \
    src/test/java/com/algorithmia/ALGO_NAME/
```

Now make the following changes in your algorithm's [Project Object Model (POM)](https://github.com/algorithmiaio/langpacks/blob/develop/languages/java11/template/pom.xml) file.

*   Add the following **[`<properties>`](https://github.com/algorithmiaio/langpacks/blob/e91077e810da381128ba642ba5240c30c99b1f37/languages/java11/template/pom.xml#L5)**.

```java
    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
    </properties>
```

*   Add the following **[`<dependency>`](https://github.com/algorithmiaio/langpacks/blob/e91077e810da381128ba642ba5240c30c99b1f37/languages/java11/template/pom.xml#L45)** on the `Algorithm Handler`.

```java
    <dependency>
        <groupId>com.algorithmia</groupId>
        <artifactId>algorithm-handler</artifactId>
        <version>\[1.2,)</version>
    </dependency>
```

*   Replace the contents of the **[`<build>`](https://github.com/algorithmiaio/langpacks/blob/e91077e810da381128ba642ba5240c30c99b1f37/languages/java11/template/pom.xml#L66)** tag with the following. Note that you'll need to replace `ALGO_NAME` with the name of your algorithm.

```java
    <build>
        <plugins>
            <plugin>
                <!-- Make sure that we keep our dependencies -->
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-dependency-plugin</artifactId>
                <executions>
                    <execution>
                        <id>copy-dependencies</id>
                        <phase>prepare-package</phase>
                        <goals>
                            <goal>copy-dependencies</goal>
                        </goals>
                        <configuration>
                            <outputDirectory>${project.build.directory}/lib</outputDirectory>
                            <overWriteReleases>false</overWriteReleases>
                            <overWriteSnapshots>false</overWriteSnapshots>
                            <overWriteIfNewer>true</overWriteIfNewer>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
            <plugin>
                <!-- Build an executable JAR -->
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-jar-plugin</artifactId>
                <version>3.0.2</version>
                <configuration>
                    <archive>
                    <manifest>
                        <mainClass>com.algorithmia.ALGO_NAME.Algorithm</mainClass>
                        <addClasspath>true</addClasspath>
                        <classpathPrefix>lib/</classpathPrefix>
                    </manifest>
                  </archive>
                </configuration>
            </plugin>
        </plugins>
    </build>
```

Once you've added the snippets above to your dependencies file, make the following changes to your source code in [`Algorithm.java`](https://github.com/algorithmiaio/langpacks/blob/e91077e810da381128ba642ba5240c30c99b1f37/languages/java11/template/src/main/java/com/algorithmia/algorithm/Algorithm.java):

*   Update the package declaration to `package com.algorithmia.algorithm`.
*   Change the class to extend `AbstractAlgorithm` with appropriate input and output types.

```
class Algorithm extends AbstractAlgorithm<Algorithm.ExampleInput, String>{
    ...
}
```

*   Remove `throws Exception` from the `apply` method.
*   Add the following method, renaming the class to simply `Algorithm`.

```
    public static void main(String[] args) {
        Algorithm algorithm = new Algorithm();
        Handler algo = new Handler<>(algorithm);
        algo.serve();
    }
```

You can iterate locally by running `mvn package` while updating the dependency file to ensure that compilation succeeds, and then push the code back up to your Algorithmia cluster.

### Scala

To migrate a legacy Scala algorithm, [get the environment ID value](/developers/model-deployment/environments#listing-algorithm-environments-rest) for the Scala 2 algorithm environment (there's currently only one). Note that in the sample code at the link provided, you'll use the string `scala-2` to replace `ALGO_LANG`. The environment ID will be a UUID like `2be2e978-9deb-494d-a2d1-e07e121d5ba0`. Execute the following `PUT` request to update the algorithm's settings, using this UUID to replace `ENV_ID`.

**REST request**

```bash
$ curl https://CLUSTER_DOMAIN/v1/algorithms/ALGO_OWNER/ALGO_NAME \
    -X PUT
    -H 'Content-Type: application/json' \
    -H 'Authorization: Simple STD_API_KEY' \
    -d  '{
      "settings":
        {
          "source_visibility": "closed",
          "network_access": "full",
          "pipeline_enabled": true,
          "algorithm_environment": "ENV_ID",
          "license":"apl"
        }
      }'
```

Now clone your algorithm locally and move your algorithm's main file `ALGONAME.scala` to a new package and rename it to `Algorithm.scala`, as demonstrated in the following code.

```bash
$ git clone https://git.CLUSTER_DOMAIN/git/ALGO_OWNER/ALGO_NAME.git
$ cd ALGO_NAME
$ mkdir -p src/main/scala/com/algorithmia
$ mv src/main/scala/algorithmia/ALGO_NAME/ALGO_NAME.scala \
    src/main/scala/com/algorithmia/Algorithm.scala
```

Similarly, if you have test files, move them to a new package as well.

```bash
$ mkdir -p src/test/scala/com/algorithmia
$ mv src/test/scala/algorithmia/ALGO_NAME/ALGO_NAME_test.scala \
    src/test/scala/com/algorithmia/
```

Once you've moved the source files, update **[`build.sbt`](https://github.com/algorithmiaio/langpacks/blob/develop/languages/scala-2/template/build.sbt)** with the following:

*   Set `name := "algorithm"`.
*   Set `scalaVersion := "2.13.1"`.
*   Add `enablePlugins(JavaAppPackaging)`.
*   Add `"com.algorithmia" %% "algorithmia-scala" % "1.0.+",` to your `libraryDependencies`.
*   Remove the line containing `mainClass`.

Now add a file **[`project/plugins.sbt`](https://github.com/algorithmiaio/langpacks/blob/develop/languages/scala-2/template/project/plugins.sbt)** with the following contents.

```scala
addSbtPlugin("com.typesafe.sbt" % "sbt-native-packager" % "1.4.1")
```

Once you've added the snippets above to your build and plugins files, make the following changes to your source code in **[`Algorithm.scala`](https://github.com/algorithmiaio/langpacks/blob/develop/languages/scala-2/template/src/main/scala/com/algorithmia/Algorithm.scala)**:

*   Update the package declaration to `package com.algorithmia`.
*   Change the class to extend `AbstractAlgorithm` with appropriate input and output types.

```scala
class Algorithm extends AbstractAlgorithm\[String, String\] {
    ...
}
```

*   Update the `apply` method to return `Try[Output type]` instead of just the output type directly.
*   Add the following companion object.

```scala
object Algorithm {
  val handler = Algorithmia.handler(new Algorithm)

  def main(args: Array\[String\]): Unit = {
    handler.serve()
  }
}
```

You can iterate locally by running `sbt stage` to ensure that compilation succeeds, and then push the code back up to your Algorithmia cluster.

### R

To migrate a legacy R algorithm, [get the environment ID value](/developers/model-deployment/environments#listing-algorithm-environments-rest) for a valid R 3.6 algorithm environment. Note that in the sample code at the link provided, you'll use the string `r36`, as appropriate, to replace `ALGO_LANG` to list the available environments. The environment ID will be a UUID like `2be2e978-9deb-494d-a2d1-e07e121d5ba0`. Execute the following `PUT` request to update the algorithm's settings, using this UUID to replace `ENV_ID`.

**REST request**

```bash
$ curl https://CLUSTER_DOMAIN/v1/algorithms/ALGO_OWNER/ALGO_NAME \
    -X PUT
    -H 'Content-Type: application/json' \
    -H 'Authorization: Simple STD_API_KEY' \
    -d  '{
      "settings":
        {
          "source_visibility": "closed",
          "network_access": "full",
          "pipeline_enabled": true,
          "algorithm_environment": "ENV_ID",
          "license":"apl"
        }
      }'
```

To migrate a legacy R algorithm, clone your algorithm locally and rename the algorithm's main file to `Algorithm.r` as demonstrated in the following code.

```bash
$ git clone https://git.CLUSTER_DOMAIN/git/ALGO_OWNER/ALGO_NAME.git
$ cd ALGO_NAME
$ mv src/ALGO_NAME.r src/Algorithm.r
```

Now add a `load` function to the source code in **[`Algorithm.r`](https://github.com/algorithmiaio/langpacks/blob/develop/languages/r36/template/src/Algorithm.r)** and a call to create the `AlgorithmHandler`.

```r
load <- function() {
    NULL
}

algo <- getAlgorithmHandler(algorithm, load)
algo$serve()
```

That's it; simply push your code back up to your Algorithmia cluster and the algorithm will continue to execute without issues into the future.

### JavaScript, Ruby, and Rust

These languages are no longer supported. Please contact your customer success manager if you need support for one of these languages.