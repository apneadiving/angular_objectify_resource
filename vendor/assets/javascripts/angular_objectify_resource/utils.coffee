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
