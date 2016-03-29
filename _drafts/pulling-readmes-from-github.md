---
layout: article
title:  "Pulling READMEs from GitHub"
date:   2016-01-05 11:39:38
categories: example
---

As you may have noticed, the posts under the "clients" section are very different than the posts in other sections. That is because these posts utilize a special plug-in, `generate_from_repo.rb`, to pull the README from the client's repository to populate the post.

You'll find that these posts have the special front-matter field of `repository`. Specify the address for the repository here, and when the site is compiling, the code will go fetch the contents, convert any formatting as needed and generate a post. 

```ruby
repository: https://github.com/algorithmiaio/algorithmia-rust.git
```


When you compile your jekyll site, the plugin will download the git repository of each project in your _projects folder and create an index page from the README (using the specified layout). 

The goal is to automate the construction of online project pages, keep them in sync with README documentation.

### Settings & Requirements

*Required files:*
Your project's git repository should contain:
- README: The contents of this will be used as the body of your project page will be created from. Any extension other than .markdown, .textile or .html will be treated as a .textile file.

*Available YAML settings:*
- repository: Git repository of your project (required).
- layout: Layout to use when creating the project page.
- title: Project title, which can be accessed in the layout.
- published: Project won't be published if this is false.

### What if my client doesn't have a repo?

You can still write your documentation as if it were any other post! Check out the AWS Lambda post for an example. It looks just like any other post. Just make sure you leave off the `repository` field in the YAML front-matter and it will not attempt to generate a post and will continue on to the regular Jekyll templating engine to finish building the post.


