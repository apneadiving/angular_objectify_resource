angular.module('angular_objectify_resource').factory 'aor.utils', ->

    string_ends_with: (string, suffix)->
      string.indexOf(suffix, string.length - suffix.length) != -1

    camelize: (string)->
      string.replace /(?:^|[-_])(\w)/g, (_, c)->
        if c then c.toUpperCase() else ''

    singularize: (string)->
      string.substring(0, string.length - 1)
