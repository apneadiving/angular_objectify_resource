angular.module('angular_objectify_resource').factory 'aor.utils', ->

    string_ends_with: (string, suffix)->
      string.indexOf(suffix, string.length - suffix.length) != -1

    string_starts_with: (string, prefix)->
      string.slice(0, prefix.length) == prefix

    camelize: (string)->
      string.replace /(?:^|[-_])(\w)/g, (_, c)->
        if c then c.toUpperCase() else ''

    singularize: (string)->
      string.substring(0, string.length - 1)

    extract_params: (args_array)->
      result =
        routing_params: {}
        on_error:       (response)-> response
        on_success:     (response)-> response

      index_offset = 0

      unless _.isFunction(args_array[0])
        result.routing_params = args_array[0]
        index_offset = 1

      result.on_success = args_array[index_offset]     if _.isFunction(args_array[index_offset])
      result.on_error   = args_array[index_offset + 1] if _.isFunction(args_array[index_offset + 1])
      result
