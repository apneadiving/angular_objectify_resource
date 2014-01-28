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
      }
    };
  });

}).call(this);
