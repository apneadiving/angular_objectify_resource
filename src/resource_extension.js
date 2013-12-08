(function() {
  angular.module('angular_objectify_resource').factory('aor.ResourceExtension', function() {
    return function(options) {
      return {
        build_object: function(callback) {
          var that;
          that = this;
          return function(response) {
            var resource;
            resource = that.resource_build_method(response);
            if (angular.isFunction(callback)) {
              return callback(resource);
            } else {
              return resource;
            }
          };
        },
        build_nested_collection: function(callback) {
          var that;
          that = this;
          return function(response) {
            var collection, namespace, resources;
            namespace = options.namespace;
            collection = angular.isArray(response) ? response : response[namespace];
            resources = _.map(collection, that.resource_build_method);
            if (namespace) {
              response[namespace] = resources;
            } else {
              response.splice(0, response.length);
              response = response.concat(resources);
            }
            if (angular.isFunction(callback)) {
              return callback(response);
            } else {
              return response;
            }
          };
        },
        resource_build_method: function(resource) {
          return new options.model(resource);
        }
      };
    };
  });

}).call(this);
