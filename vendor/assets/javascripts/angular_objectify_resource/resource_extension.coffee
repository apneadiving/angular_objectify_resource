angular.module('angular_objectify_resource')

.factory 'aor.ResourceExtension', ->
  #  options is an object:
  #    model:     class
  #    namespace: if response is not an array, gives the key to get data
  (options)->
    build_object: (callback)->
      that = @
      (response)->
        resource = that.resource_build_method response
        if angular.isFunction(callback)
          callback resource
        else
          resource

    build_nested_collection: (callback)->
      that = @
      (response)->
        namespace  = options.namespace
        collection = if angular.isArray(response) then response else response[namespace]
        resources  = _.map collection, that.resource_build_method

        if namespace
          response[namespace] = resources
        else
          response.splice(0, response.length)
          response = response.concat resources

        if angular.isFunction(callback)
          callback response
        else
          response

    resource_build_method: (resource)->
      new options.model(resource)
