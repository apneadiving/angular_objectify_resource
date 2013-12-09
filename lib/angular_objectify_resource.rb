module AngularObjectifyResource
  module Rails
  end
end

if defined?(::Rails)
  require 'angular_objectify_resource/rails/engine' if ::Rails.version >= '3.1'
  require 'angular_objectify_resource/rails/railtie'
end
require 'angular_objectify_resource/version'
