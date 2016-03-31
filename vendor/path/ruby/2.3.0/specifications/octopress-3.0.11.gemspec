# -*- encoding: utf-8 -*-
# stub: octopress 3.0.11 ruby lib

Gem::Specification.new do |s|
  s.name = "octopress"
  s.version = "3.0.11"

  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib"]
  s.authors = ["Brandon Mathis", "Parker Moore"]
  s.date = "2015-07-15"
  s.email = ["brandon@imathis.com", "parkrmoore@gmail.com"]
  s.executables = ["octopress"]
  s.files = ["bin/octopress"]
  s.homepage = "http://octopress.org"
  s.licenses = ["MIT"]
  s.rubygems_version = "2.5.1"
  s.summary = "Octopress is an obsessively designed framework for Jekyll blogging. It\u{2019}s easy to configure and easy to deploy. Sweet huh?"

  s.installed_by_version = "2.5.1" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<mercenary>, ["~> 0.3.2"])
      s.add_runtime_dependency(%q<jekyll>, [">= 2.0"])
      s.add_runtime_dependency(%q<titlecase>, [">= 0"])
      s.add_runtime_dependency(%q<octopress-deploy>, [">= 0"])
      s.add_runtime_dependency(%q<octopress-hooks>, ["~> 2.0"])
      s.add_runtime_dependency(%q<octopress-escape-code>, ["~> 2.0"])
      s.add_runtime_dependency(%q<redcarpet>, ["~> 3.0"])
      s.add_development_dependency(%q<octopress-ink>, [">= 0"])
      s.add_development_dependency(%q<bundler>, ["~> 1.3"])
      s.add_development_dependency(%q<rake>, [">= 0"])
      s.add_development_dependency(%q<clash>, [">= 0"])
      s.add_development_dependency(%q<pry-byebug>, [">= 0"])
    else
      s.add_dependency(%q<mercenary>, ["~> 0.3.2"])
      s.add_dependency(%q<jekyll>, [">= 2.0"])
      s.add_dependency(%q<titlecase>, [">= 0"])
      s.add_dependency(%q<octopress-deploy>, [">= 0"])
      s.add_dependency(%q<octopress-hooks>, ["~> 2.0"])
      s.add_dependency(%q<octopress-escape-code>, ["~> 2.0"])
      s.add_dependency(%q<redcarpet>, ["~> 3.0"])
      s.add_dependency(%q<octopress-ink>, [">= 0"])
      s.add_dependency(%q<bundler>, ["~> 1.3"])
      s.add_dependency(%q<rake>, [">= 0"])
      s.add_dependency(%q<clash>, [">= 0"])
      s.add_dependency(%q<pry-byebug>, [">= 0"])
    end
  else
    s.add_dependency(%q<mercenary>, ["~> 0.3.2"])
    s.add_dependency(%q<jekyll>, [">= 2.0"])
    s.add_dependency(%q<titlecase>, [">= 0"])
    s.add_dependency(%q<octopress-deploy>, [">= 0"])
    s.add_dependency(%q<octopress-hooks>, ["~> 2.0"])
    s.add_dependency(%q<octopress-escape-code>, ["~> 2.0"])
    s.add_dependency(%q<redcarpet>, ["~> 3.0"])
    s.add_dependency(%q<octopress-ink>, [">= 0"])
    s.add_dependency(%q<bundler>, ["~> 1.3"])
    s.add_dependency(%q<rake>, [">= 0"])
    s.add_dependency(%q<clash>, [">= 0"])
    s.add_dependency(%q<pry-byebug>, [">= 0"])
  end
end
