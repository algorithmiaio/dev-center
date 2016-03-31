# -*- encoding: utf-8 -*-

Gem::Specification.new do |s|
  s.name = "titlecase"
  s.version = "0.1.1"

  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.authors = ["Samuel Souder"]
  s.date = "2009-10-15"
  s.description = "titlecase is a set of methods on the Ruby String class to add title casing support as seen on Daring Fireball <http://daringfireball.net/2008/05/title_case>."
  s.email = "samsouder@gmail.com"
  s.homepage = "http://github.com/samsouder/titlecase"
  s.require_paths = ["lib"]
  s.rubygems_version = "1.8.23"
  s.summary = "String methods to properly title case a headline."

  if s.respond_to? :specification_version then
    s.specification_version = 3

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
    else
    end
  else
  end
end
