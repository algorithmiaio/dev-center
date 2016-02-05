---
layout: article
title:  "Basic Android Integration"
date:   2016-01-28 01:30:38
categories: samples 
tags: [sample-apps]
show_related: false
author: liz_rush
excerpt: "A code walk-through of a simple Android app using Algorithmia."
image:
  feature: /post_images/android/android_robot_skateboarding.png
  teaser: /post_images/android/android_robot.png
---
{% include toc.html %}

In this post, we'll walk through how to build a very simple Android app that uses the Algorithmia API.

The full sample code can be found in the [Sample Apps repository on GitHub](https://github.com/algorithmiaio/sample-apps/tree/master/android/basic_integration).

You can either clone the repo directly and follow along with the README instructions to see the fully complete app, or you can follow the tutorial below to build your first Android app with Algorithmia!

## Getting Started

First things first, let's create a new app in Android Studio.

Select New Project and follow along with the New Project wizard. You can feel free to give your new app any name you like. Then, select your target devices and when prompted with the Add Activity screen, select "Empty Activity":

![Add Blank Activity in Android Studio](/images/post_images/android/create_new_blank.png)

Since our app is just a simple example app, we'll use put our code in `MainActivity.java`. But first, we need to do a little bit more set up.

## Settings, Permissions, & API Key

Follow the following 3 steps below to make sure you have the dependencies, permissions, and API key set as needed.

**Step One: Dependencies** 

Add the Algorithmia client to your app in the dependencies section of `app/build.gradle`, like so: 

{% highlight xml %}
dependencies {
    ...
    compile "com.algorithmia:algorithmia-android:1.0.0"
    ...
}
{% endhighlight %}

**Step Two: Internet Permissions** 

To ensure that we can access the Internet from our app, we'll specify this permission in `AndroidManifest.xml`:

{% highlight xml %}
<uses-permission android:name="android.permission.INTERNET" />
{% endhighlight %}

**Step Three: API Key** 

In `strings.xml`, replace the demo API key with your API key, which can be found under the credentials section of your profile on the Algorithmia website.

{% highlight java %}
<resources>
    <string name="app_name">Android Sample</string>
    <string name="algorithmia_api_key">YOUR_API_KEY</string>
</resources>
{% endhighlight %}

Make sure you've replaced `YOUR_API_KEY` with the API key under your account so that the Algorithmia client can authenticate!
{: .notice-warning }

## Adding views to the app

We'll need some views that we can connect to our code. Under `res/layout/activity_main.xml` add the following TextViews, EditText fields, and Button. You can also do this through the visual editor, but since we just have a few simple things to add to the layout we'll add them to the xml:

{% highlight xml %}
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

1. Add run function (linked to from the button)
2.  Use async task to split network stuff from ui stuff
  Why to use asynctask: http://developer.android.com/training/basics/network-ops/connecting.html
3. Make algorithmia network call in doInBackground, return AlgoResponse
4. Update UI in onPostExecute


{% highlight java %}
package com.algorithmia.androidsample;

import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;

import com.algorithmia.APIException;
import com.algorithmia.AlgorithmException;
import com.algorithmia.Algorithmia;
import com.algorithmia.algo.AlgoFailure;
import com.algorithmia.algo.AlgoResponse;
import com.algorithmia.algo.AlgoSuccess;

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

    public void onClickRun(View v) {
        final String algo = algoUrl.getText().toString();
        final String input = algoInput.getText().toString();
        new AsyncTask<Void,Void,AlgoResponse>() {

            @Override
            protected AlgoResponse doInBackground(Void... params) {
                try {
                    return Algorithmia.client(getString(R.string.algorithmia_api_key)).algo(algo).pipe(input);
                } catch (APIException e) {
                    return new AlgoFailure(new AlgorithmException(e));
                }
            }
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
        }.execute();
    }
}
{% endhighlight %}


When you run the app in the emulator, you'll see this:

![Android App](/images/post_images/android/emulator.png)

## Next Steps

Now that you've got your first Algorithmia Android app running, try replacing the `demo/Hello` algorithm with another that you find on the marketplace. Try something like [anowell/pinky](https://algorithmia.com/algorithms/anowell/pinky) or [diego/RetrieveTweetsWithKeyword](https://algorithmia.com/algorithms/diego/RetrieveTweetsWithKeyword). Then make sure the input you provide to your new algorithm matches the expected input, and hit run! 

Integrating Algorithmia into Android is an easy and convenient way to leverage algorithms, so now that you've got the basic API integration down, you can follow this pattern to start hacking away at your own apps!

### Further Reading:  

* [The Algorithmia Client](http://developers.algorithmia.com/clients/java/)  
* [Algorithmia Java Docs](http://www.javadoc.io/doc/com.algorithmia/algorithmia-client/1.0.3) <i class="fa fa-external-link"></i>  
* <a href="https://github.com/algorithmiaio/algorithmia-java">[Algorithmia Java Client Source Code](https://github.com/algorithmiaio/algorithmia-java) <i class="fa fa-external-link"></i>  