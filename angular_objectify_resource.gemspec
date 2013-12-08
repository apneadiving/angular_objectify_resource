$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "angular_objectify_resource/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "angular_objectify_resource"
  s.version     = AngularObjectifyResource::VERSION
  s.authors     = ["Benjamin Roth"]
  s.email       = ["benjamin@rubyist.fr"]
  s.homepage    = "https://github.com/apneadiving/angular_objectify_resource"
  s.summary     = "Get real objects and decorators (with relations) from angular $resource"
  s.description = "Get real objects and decorators (with relations) from angular $resource"

  s.files       = `git ls-files`.split("\n")
  s.test_files  = `git ls-files -- spec/*`.split("\n")

  s.add_dependency "rails", "~> 3.1.0"

  s.add_development_dependency "rspec", '2.14.0'
  s.add_development_dependency "rake", '10.1.0'
  s.add_development_dependency 'coffee-script'
  s.add_development_dependency 'sprockets'
  s.add_development_dependency 'pry'
  s.add_development_dependency 'jasmine'
  s.add_development_dependency 'guard-coffeescript'
  s.add_development_dependency 'guard-process'
end
