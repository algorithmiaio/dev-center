---
exclude_from_search: true
layout: article
title:  "iOS Integration"
<!-- categories: sample-apps
tags: [sample-apps] -->
show_related: false
author: jon_peck
excerpt: "A code walk-through of a simple iOS/Swift app using Algorithmia."
image:
  feature: /post_images/ios/swift.png
  teaser: /post_images/ios/swift.png
github: https://github.com/algorithmiaio/algorithmia-swift
---

{% include toc.html %}

In this post, we'll walk through how to build a very simple iOS app that uses the Algorithmia API in Swift.

The full sample code can be found in the [GitHub repository](https://github.com/algorithmiaio/algorithmia-swift/tree/master/AlgorithmiaSwiftDemo).

You can either clone the repo directly and follow along with the README instructions to see the fully complete app, or you can follow the tutorial below to build your first iOS app with Algorithmia!

## Getting Started

First, download and install [Xcode](https://developer.apple.com/download/).

If you didn't do so on first run, switch Xcode to developer mode: `sudo xcode-select -switch /Applications/Xcode.app/Contents/Developer`

Download the [sample project](https://github.com/algorithmiaio/algorithmia-swift/) and use Xcode to open the *directory* "algorithmia-swift" (*not* the file "AlgorithmiaSwift.xcodeproj").

Now you're almost ready to run the project... there are just a few options to configure first. 

## Settings, Permissions, & API Key

**Add your developer profile**

Make sure you have [added a developer profile](http://stackoverflow.com/a/41217410/4418411) under Xcode > Preferences > Accounts > Add Apple ID.

**Set your API key**

On your [Algorithmia credentials page](algorithmia.com/user#credentials), create a new Key.  Set its **Algorithm Access** to `'algo://deeplearning/DeepFilter'` and set the **Data access** to `read and write`.  Save this API key.

Now we need to add this API key to your Environment.  From the menu, pick Product > Scheme > Edit Scheme.  In the popup, select "Run", then "Arguments".  Add an entry under "Environment Variables" with the name "ALGORITHMIA_API_KEY", and paste your API Key in as its value. 

![Set environment variables]({{ site.baseurl }}/images/post_images/ios/envs.png)

**Create a Data Collection to store your images during processing**

Since this demo app will be processing images, we'll need to create a temporary directory at Algorithmia to hold them.

Head to your [Data Portal](https://algorithmia.com/data) and click "Browse Files" under "My Hosted Data".  Then click "Add Collection", and type the name "test".  Note that this corresponds to the folders used by `sourcePath` and `resultPath` in "AlgorithmiaSwiftDemo/AlgorithmiaSwiftDemo/ViewController.swift".

## Adding views to the app

We'll need some views that we can connect to our code. Under `res/layout/activity_main.xml` add the following TextViews, EditText fields, and Button. You can also do this through the visual editor, but since we just have a few simple things to add to the layout we'll add them to the xml:

{% highlight xml lineanchors %}
<TextView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="Algorithm" />

<EditText
    android:id="@+id/algo_url"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:text="demo/hello"/>

<TextView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="Algorithm Input" />

<EditText
    android:id="@+id/algo_input"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:text="foo"/>

<Button
    android:id="@+id/algo_run"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:layout_marginBottom="20dp"
    android:onClick="onClickRun"
    android:text="Run"/>

<TextView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="Algorithm Output" />

<TextView
    android:id="@+id/algo_output"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content" />
{% endhighlight %}


## Let's code!

To make our sample app run, we'll need to do four things: first, we'll need to add a function that gets called when the button is tapped, we'll need to add in an async task, make the Algorithmia API call, and finally update the UI with the results.

Let's start by getting references to the views. Add the references at the start of the public class, then inside of the `onCreate` method make sure you set them to the views with their ids:
{% highlight java lineanchors %}
public class MainActivity extends AppCompatActivity {
  private EditText algoUrl;
  private EditText algoInput;
  private TextView algoOutput;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
      super.onCreate(savedInstanceState);
      setContentView(R.layout.activity_main);

      // Find views
      algoUrl = (EditText) findViewById(R.id.algo_url);
      algoInput = (EditText) findViewById(R.id.algo_input);
      algoOutput = (TextView) findViewById(R.id.algo_output);
    }
}
{% endhighlight %}

If you noticed when we added the views to the app, we already set the button to handle the onClick event with this line: `android:onClick="onClickRun"`. Android Studio will complain that this method doesn't exist, so let's create it now. We'll also have grab the values of the EditText views so we can work with them.

{% highlight java lineanchors %}
public void onClickRun(View v) {
  final String algo = algoUrl.getText().toString();
  final String input = algoInput.getText().toString();
}
{% endhighlight %}

Next we'll want to make sure that our API call happens inside of an [AsyncTask](http://developer.android.com/training/basics/network-ops/connecting.html). Set up the AsyncTask:

{% highlight java lineanchors %}
public void onClickRun(View v) {
  final String algo = algoUrl.getText().toString();
  final String input = algoInput.getText().toString();
  new AsyncTask<Void,Void,AlgoResponse>() {
    @Override
    protected AlgoResponse doInBackground(Void... params) {
      try {
        // make API call
      } catch (APIException e) {
       // handle exception
      }
    }
    @Override
    protected void onPostExecute(AlgoResponse response) {
        if(response == null) {
        } else if(response.isSuccess()) {
            // handle successful response
        } else {
           // handle failure message
        }
    }
  }.execute();
}
{% endhighlight %}

Let's start by making the filling out the `try`
 and `catch`. We want to first make the API call. Be sure to pass in the API key from the strings resource that we set before:

 {% highlight java lineanchors %}
protected AlgoResponse doInBackground(Void... params) {
  try {
    return Algorithmia.client(getString(R.string.algorithmia_api_key)).algo(algo).pipe(input);
  } catch (APIException e) {
    return new AlgoFailure(new AlgorithmException(e));
  }
}
{% endhighlight %}

Notice that we are catching the API exception and creating a new Algorithmia Exception from it. We do this so that we can update the UI with the exception message in the `onPostExecute` method. Let's do that now!

{% highlight java lineanchors %}
@Override
  protected void onPostExecute(AlgoResponse response) {
    if(response == null) {
      algoOutput.setText("Algorithm Error: network connection failed");
    } else if(response.isSuccess()) {
      AlgoSuccess success = (AlgoSuccess) response;
      algoOutput.setText(success.asJsonString());
    } else {
      AlgoFailure failure = (AlgoFailure) response;
      algoOutput.setText("Algorithm Error: " + failure.error);
    }
  }
{% endhighlight %}

What the above code does is set the `algoOutput` text view to display the results of the call. If the response is null, we've set the output to show a generic "network connection failed" message. Following this, we've got a check on line 5 to see if the condition is successful, and if so we'll set the text to the success response. Of course, we'll also need to handle the failures, which you'll see in the final `else` of the method on lines 8-10.

You can find the full code for `MainActivity.java`
on [GitHub](https://github.com/algorithmiaio/sample-apps/blob/master/android/basic_integration/app/src/main/java/com/algorithmia/androidsample/MainActivity.java). Double check that your code matches the code in the repo!

When you run the app in the emulator, you'll see this:

![Android App]({{ site.baseurl }}/images/post_images/android/emulator.png)

## Next Steps

Now that you've got your first Algorithmia Android app running, try replacing the `demo/Hello` algorithm with another that you find on the marketplace. Try something like [anowell/pinky](https://algorithmia.com/algorithms/anowell/pinky) or [diego/RetrieveTweetsWithKeyword](https://algorithmia.com/algorithms/diego/RetrieveTweetsWithKeyword). Then make sure the input you provide to your new algorithm matches the expected input, and hit run!

Integrating Algorithmia into Android is an easy and convenient way to leverage algorithms, so now that you've got the basic API integration down, you can follow this pattern to start hacking away at your own apps!

### Further Reading:

* [The Algorithmia Swift Client]({{ site.baseurl }}/clients/swift/)
* <a href="https://github.com/algorithmiaio/algorithmia-swift">[Algorithmia Swift Client Source Code](https://github.com/algorithmiaio/algorithmia-swift) <i class="fa fa-external-link"></i>
