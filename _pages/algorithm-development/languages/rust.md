---
layout: article
title:  "Rust"
excerpt: "Build your algorithm in Rust"
categories: languages
tags: [algo-guide-lang]
show_related: true
author: liz_rush
image:
    teaser: /language_logos/rust.svg
---

Algorithmia supports development of algorithms in Rust.

#### Handling Input and Output

Rust algorithms are expected to have a public type named `Algo` that implements the [`EntryPoint`](https://docs.rs/algorithmia/2/algorithmia/algo/trait.EntryPoint.html) trait or the [`DecodedEntryPoint`](https://docs.rs/algorithmia/2/algorithmia/algo/trait.DecodedEntryPoint.html) trait.

The [`algo_entrypoint!`](https://docs.rs/algorithmia/2/algorithmia/macro.algo_entrypoint.html) macro removes much of the boilerplate of implementing those traits. Basically, you call `algo_entrypoint!` with the input type your algorithm expects, and it generates code that will call an `apply` function with the type you specified. Then your `apply` function needs to return a `Result<T, E>` for some type `T` that can be converted into [`AlgoOutput`](https://docs.rs/algorithmia/2/algorithmia/algo/enum.AlgoOutput.html) and some type `E` can be converted into a boxed `Error`.

The [`algo_entrypoint!`](https://docs.rs/algorithmia/2/algorithmia/macro.algo_entrypoint.html) reference documentation covers all the possibilities in detail, so this guide will demonstrate the most common usages:

#### Handle text input:

An API that handles text input can be specified with `algo_entrypoint!(&str)`.

{% highlight rust %}
algo_entrypoint!(&str);
fn apply(input: &str) -> Result<String, Box<std::error:;Error>> {
    let msg = format!("Hello {}", input);
    Ok(msg)
}
{% endhighlight %}

#### Handle binary input:

An API that handles binary input can be specified with `algo_entrypoint!(&[u8])`.

{% highlight rust %}
algo_entrypoint!(&[u8]);
fn apply(input: &[u8]) -> Result<Vec<u8>, Box<std::error::Error>> {
    Ok(input.to_owned())
}
{% endhighlight %}

#### Handle JSON input:

An API that handles JSON input can be specified with `algo_entrypoint!(&JsonValue)`
which provides the algorithm with the `serde_json`'s `Value` enum as input.
(See also the alternative ways of handling auto-decoded JSON input.)

{% highlight rust %}
algo_entrypoint!(&JsonValue);
fn apply(&input: &JsonValue) -> Result<JsonValue, Box<std::error::Error>> {
    let name = input.get("name")?.as_str()?;
    let msg = format!("Hello {}", name);
    Ok(json!{ "msg": msg })
}
{% endhighlight %}


#### Auto-decode JSON input:
JSON input can be automatically decoded to a type of your choosing if that type implements serde's `Deserialize` trait.

{% highlight rust %}

algo_entrypoint!((String, u32));
fn apply(input: (String, u32)) -> Result<String, Box<std::error::Error>> {
    let msg = format("Received string '{}' and number '{}", input.0, input.1);
    Ok(msg)
}
{% endhighlight %}

You can extend this idea to decode more complex, structured input JSON.
This example defines a struct that derives `Deserialize` so that input
is automatically decoded into a `TaskDefinition`. And similarly, the output
can be any serializeable type.

{% highlight rust %}
#[derive(Deserialize)]
pub struct TaskDefinition {
    msg: String,
}

#[derive(Serialize)]
pub struct TaskOutput {
    byte_count: u32,
}

algo_entrypoint!(TaskDefinition);
fn apply(input: TaskDefinition) -> Result<Box<TaskOutput>, Box<std::error::Error>> {
    let output = TaskOutput { byte_count: input.msg.len() };
    Ok(Box::new(output))
}
{% endhighlight %}

Note: Serialized output types do need to be boxed (until specialization becomes stable).

#### Handling Errors

Using `Box<std::errror::Error>` is often convenient for getting started, as the `?` operator
can convert error type into it without any problem. However, you may also choose to use your own
`Error` type. The runner will walk the entire chain of error causes to generate an error message,
so in particular, the [error-chain](https://crates.io/crates/error-chain) crate provides a great way
to generate helpful errors with minimal boilerplate:

{% highlight rust %}
#[macro_use]
extern crate error_chain;
error_chain! { }

algo_entrypoint!(&str);
fn apply(input: &str) -> Result<String> {
    let f = File::open(input).chain_err(|| "Failed to open input file")?;
    /* ... */
}
{% endhighlight %}

If the `File::open` fails, the API response's error message will look something like this:

<pre>
Failed to open input file
caused by: No such file or directory (os error 2)
</pre>

As with most Rust code, you should avoid panicking in your algorithm. API callers will not have
access to the panic backtrace, and panicking will impact the latency of back-to-back requests
from the same user.

#### Managing Dependencies

Algorithmia supports adding 3rd party dependencies via Cargo. Cargo dependencies typically come from <a href="https://crates.io/">Crates.io</a>
but it is also possible to specify dependendies from a git URL.

To configure depdendencies, click the 'Dependencies' button on the algorithm editor page which provides a way to edit the `Cargo.toml` file.
See the [Cargo dependency docs](http://doc.crates.io/specifying-dependencies.html) for details on editting dependencies.

<aside class="notice">
  Note: By default dependencies will be updated on every build to pick up any backward-compatible fixes.
  If you must lock to a more specific version, prefix the version number with `=`.
</aside>

<aside class="notice">
  Note: Editing the <code>[bin]</code> and <code>[lib]</code> sections may break compilation, either immediately or during future platform maintenance.
  If you believe your scenario requires such changes, contact us as we'd love to learn more about your usage scenario to better support it.
</aside>

#### Calling Other Algorithms and Managing Data

To call other algorithms or manage data from your algorithm, use the <a href="{{ site.baseurl }}/clients/rust/">Algorithmia Rust Client</a> which is available by default to any algorithm you create on the Algorithmia platform. For more detailed information on how to work with data see the [Data API docs](http://docs.algorithmia.com/) and learn about Algorithmia's [Hosted Data Source]({{ site.baseurl }}/data/).

When designing your algorithm, don't forget that there are special data directories, `.session` and `.algo`, that are available only to algorithms to help you manage data over the course of the algorithm execution.


#### Additional Resources

* [Algorithmia Rust Client]({{ site.baseurl }}/clients/rust/)
* [Rust standard library](https://doc.rust-lang.org/std/)
* [Crates.io](https://crates.io/)
