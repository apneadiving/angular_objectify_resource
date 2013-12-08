angular.module('angular_objectify_resource')

.factory 'aor.ResourceExtension', ->
    #  options is an object:
    #    model:     class
    #    namespace: if response is not an array, gives the key to get data
    get: (options)->

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
          isArray    = angular.isArray(response)
          collection = if isArray then response else response[namespace]
          resources  = _.map collection, that.resource_build_method

          if isArray
            response.splice(0, response.length)
            response =  response.concat resources
          else
            response[namespace] = resources

          if angular.isFunction(callback)
            callback response
          else
            response

      resource_build_method: (resource)->
        new options.model(resource)
