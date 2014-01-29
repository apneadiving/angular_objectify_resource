(function() {
  angular.module('angular_objectify_resource').factory('aor.utils', function() {
    return {
      string_ends_with: function(string, suffix) {
        return string.indexOf(suffix, string.length - suffix.length) !== -1;
      },
      string_starts_with: function(string, prefix) {
        return string.slice(0, prefix.length) === prefix;
      },
      camelize: function(string) {
        return string.replace(/(?:^|[-_])(\w)/g, function(_, c) {
          if (c) {
            return c.toUpperCase();
          } else {
            return '';
          }
        });
      },
      singularize: function(string) {
        return string.substring(0, string.length - 1);
      },
      extract_params: function(args_array) {
        var index_offset, result;
        result = {
          routing_params: {},
          on_error: function(response) {
            return response;
          },
          on_success: function(response) {
            return response;
          }
        };
        index_offset = 0;
        if (_.isObject(args_array[0])) {
          result.routing_params = args_array[0];
          index_offset = 1;
        }
        if (_.isFunction(args_array[index_offset])) {
          result.on_success = args_array[index_offset];
        }
        if (_.isFunction(args_array[index_offset + 1])) {
          result.on_error = args_array[index_offset + 1];
        }
        return result;
      }
    };
  });

}).call(this);
